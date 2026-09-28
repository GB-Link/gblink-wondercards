// The distribution machine as the GBA's wireless adapter sees it: a librfu
// parent with one child in slot 0, speaking through GB-Link wireless mode.
//
// Parent frames start with a 3-byte header (size 0-6, phase 9-10, n 11-12,
// ack 13, state 14-17, slot bitmap 18-21); once linked they carry five 14-byte
// command slots, slot 0 our own command and slot 1 the child's last command
// echoed back once. Child frames start with a 2-byte header (size 0-4,
// phase 5-6, n 7-8, ack 9, state 10-13) and carry one slot.

import {
  RFU1,
  broadcastFrame,
  clientPayload,
  commandFrame,
  hostSendFrame,
} from './rfu1.js';

const STATE = { NULL: 0, NI_START: 1, NI: 2, NI_END: 3, UNI: 4 };
const CHILD_SLOT = 1 << 18;
const SLOT_BYTES = 14;
const SLOT_COUNT = 5;
const FRAGMENT_BYTES = 12;
const MAX_FRAGMENTS = 24;
const BEACON_TICKS = 30;
// The adapter asks for a pause while its queue toward the GBA runs deep; it
// repeats the request every 150 ms, so a hold lapses on its own.
const FLOW_HOLD_TICKS = 18;

export const CMD = {
  READY_CLOSE_LINK: 0x5f00,
  READY_EXIT_STANDBY: 0x6600,
  SEND_PLAYER_IDS: 0x7700,
  SEND_BLOCK_INIT: 0x8800,
  SEND_BLOCK: 0x8900,
  SEND_BLOCK_REQ: 0xa100,
};

export const RFU_SERIAL_WONDER_DISTRIBUTOR = 0x7f7d;

function randomId() {
  return 1 + Math.floor(Math.random() * 0xfffe);
}

function parentHeader(state, n, phase, size, ack) {
  const h = CHILD_SLOT | (state << 14) | (ack ? 1 << 13 : 0) | (n << 11) | (phase << 9) | size;
  return [h & 0xff, (h >> 8) & 0xff, (h >> 16) & 0xff];
}

function parentFrame(state, n, phase, payload = [], ack = false) {
  return Uint8Array.from([...parentHeader(state, n, phase, payload.length, ack), ...payload]);
}

// The join answer: librfu's NI send of the one-byte JOIN_GROUP_OK status (5),
// its 7-byte control block split across two NI_START frames, then the status,
// then NI_END. Each step repeats until the child acks it.
const JOIN_OK = [
  { state: STATE.NI_START, n: 1, frame: parentFrame(STATE.NI_START, 1, 0, [0x00, 0x05, 0x00, 0x01, 0x00]) },
  { state: STATE.NI_START, n: 2, frame: parentFrame(STATE.NI_START, 2, 0, [0x00, 0x00]) },
  { state: STATE.NI, n: 1, frame: parentFrame(STATE.NI, 1, 0, [0x05]) },
  { state: STATE.NI_END, n: 0, frame: parentFrame(STATE.NI_END, 0, 0, []) },
];
const IDLE_NULL = parentFrame(STATE.NULL, 1, 0);

// Broadcast data (librfu rfu_REQ_configGameData): serial with the multiboot
// flag in bit 15, the 13-byte game data, a checksum, the 8-byte user name.
export function beaconData({ serialNo, mbootFlag = 0, gnameBytes, unameBytes }) {
  const b = new Uint8Array(24);
  const serial = (serialNo & 0x7fff) | (mbootFlag ? 0x8000 : 0);
  b[0] = serial & 0xff;
  b[1] = serial >> 8;
  b.set(gnameBytes.subarray(0, 13), 2);
  b.set(unameBytes.subarray(0, 8), 16);
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += b[2 + i] + b[16 + i];
  b[15] = ~sum & 0xff;
  return b;
}

function slotWords(slot) {
  const words = [];
  for (let i = 0; i < 7; i++) words.push(slot[i * 2] | (slot[i * 2 + 1] << 8));
  return words;
}

function isZero(bytes) {
  for (const b of bytes) if (b) return false;
  return true;
}

export class Distributor {
  constructor({ send, log = () => {} }) {
    this.send = send;
    this.log = log;
    this.devid = randomId();
    this.beacon = null;
    this.state = 'idle';
    this.ticks = 0;
    this.onConnect = null;
    this.onLinked = null;
    this.onCommand = null;
    this.onBlockStart = null;
    this.onBlock = null;
    this.onClosed = null;
    this.resetLink();
  }

  resetLink() {
    this.childDevid = 0;
    this.childFrames = [];
    this.nameDone = false;
    this.niAck = null;
    this.joinStep = 0;
    this.idleNull = 0;
    this.own = [];
    this.echo = null;
    this.recv = null;
    this.hold = 0;
    this.silentTicks = 0;
  }

  // Opens the group, or updates what it advertises.
  open(beacon) {
    this.beacon = beacon;
    if (this.state === 'idle' || this.state === 'closed') this.state = 'open';
    this.broadcast();
  }

  close() {
    if (this.childDevid) this.send(commandFrame(RFU1.DISCONNECT, this.childDevid));
    this.resetLink();
    this.state = 'closed';
  }

  broadcast() {
    if (!this.beacon) return;
    const slot = this.state === 'open' ? 0 : 0xff;
    this.send(broadcastFrame(this.devid | (slot << 16), this.beacon));
  }

  receive({ type, header, frame }) {
    switch (type) {
      case RFU1.CONNECT_REQ:
        this.connectRequest(header);
        break;
      case RFU1.DISCONNECT:
        if (this.childDevid && (header & 0xffff) === this.childDevid) this.lost();
        break;
      case RFU1.CLIENT_SEND:
        // All zeros is the adapter keeping the radio busy while the GBA is
        // quiet; every frame the GBA itself sends has a header.
        if (this.childDevid && (header & 0xffff) === this.childDevid) {
          const payload = clientPayload(frame);
          if (!isZero(payload)) {
            this.childFrames.push(payload);
            this.silentTicks = 0;
          }
        }
        break;
      case RFU1.FLOWCTL:
        this.hold = header & 1 ? FLOW_HOLD_TICKS : 0;
        break;
      default:
        break;
    }
  }

  connectRequest(header) {
    if ((header & 0xffff) !== this.devid) {
      this.send(commandFrame(RFU1.CONNECT_NACK, 0));
      return;
    }
    // The adapter repeats a request until it has an answer.
    if (this.childDevid) return;
    if (this.state !== 'open') {
      this.send(commandFrame(RFU1.CONNECT_NACK, 0));
      return;
    }
    this.resetLink();
    this.childDevid = randomId();
    this.state = 'naming';
    this.send(commandFrame(RFU1.CONNECT_ACK, this.childDevid));
    this.broadcast();
    this.onConnect?.();
  }

  lost() {
    this.resetLink();
    this.state = 'closed';
    this.onClosed?.();
  }

  // Once per GBA frame (59.7275 Hz).
  tick() {
    this.ticks++;
    if (this.state === 'open' && this.ticks % BEACON_TICKS === 0) this.broadcast();
    if (!this.childDevid) return;
    this.silentTicks++;
    const child = this.childFrames.shift();
    if (child) this.fromChild(child);
    if (!this.childDevid) return;
    if (this.hold > 0) {
      this.hold--;
      return;
    }
    this.send(hostSendFrame(this.nextFrame()));
  }

  // A child send can hold several subframes back to back.
  fromChild(data) {
    for (let at = 0; at + 2 <= data.length;) {
      const h = data[at] | (data[at + 1] << 8);
      const size = h & 31;
      if (at + 2 + size > data.length) break;
      const payload = data.subarray(at + 2, at + 2 + size);
      if (((h >> 10) & 15) === STATE.UNI) this.childUni(payload);
      else this.childNi(h);
      at += 2 + size;
      if (h === 0) break;
    }
  }

  childNi(h) {
    const state = (h >> 10) & 15;
    const ack = (h >> 9) & 1;
    const n = (h >> 7) & 3;
    const phase = (h >> 5) & 3;
    if (ack) {
      const step = JOIN_OK[this.joinStep];
      if (this.state === 'answering' && step && step.state === state && step.n === n && phase === 0) {
        this.joinStep++;
        if (this.joinStep === JOIN_OK.length) this.idleNull = 2;
      }
      return;
    }
    if (this.state !== 'naming') return;
    if (state === STATE.NI_START || state === STATE.NI || state === STATE.NI_END) {
      this.niAck = parentFrame(state, n, phase, [], true);
      if (state === STATE.NI_END) this.nameDone = true;
    } else if (state === STATE.NULL && this.nameDone) {
      this.state = 'answering';
      this.niAck = null;
    }
  }

  childUni(slot) {
    if (this.state === 'naming' || this.state === 'answering') {
      this.state = 'linked';
      this.onLinked?.();
    }
    if (slot.length < SLOT_BYTES || slot[1] === 0) return;
    const words = slotWords(slot);
    // Bits 5-7 of the command word are the child's sequence tag.
    words[0] &= 0xff1f;
    this.echo = words;
    const op = words[0] & 0xff00;
    if (op === CMD.SEND_BLOCK_INIT || op === CMD.SEND_BLOCK) this.childBlock(words);
    else this.onCommand?.(words);
  }

  childBlock(words) {
    if ((words[0] & 0xff00) === CMD.SEND_BLOCK_INIT) {
      const count = words[1];
      if (count < 1 || count > MAX_FRAGMENTS) return;
      if (!this.recv || this.recv.done || this.recv.count !== count) {
        this.recv = { count, flags: 0, data: new Uint8Array(count * FRAGMENT_BYTES), done: false };
        this.onBlockStart?.(count);
      }
      return;
    }
    const r = this.recv;
    if (!r || r.done) return;
    const index = words[0] & 0x1f;
    if (index >= r.count) return;
    for (let k = 0; k < 6; k++) {
      r.data[index * FRAGMENT_BYTES + k * 2] = words[1 + k] & 0xff;
      r.data[index * FRAGMENT_BYTES + k * 2 + 1] = words[1 + k] >> 8;
    }
    r.flags = (r.flags | (1 << index)) >>> 0;
    if (r.flags === ((2 ** r.count) - 1) >>> 0) {
      r.done = true;
      this.onBlock?.(r.data.slice());
    }
  }

  nextFrame() {
    if (this.state === 'naming') return this.niAck ?? new Uint8Array(3);
    if (this.state === 'answering') {
      const step = JOIN_OK[this.joinStep];
      if (step) return step.frame;
      if (this.idleNull > 0) {
        this.idleNull--;
        return IDLE_NULL;
      }
    }
    const frame = new Uint8Array(3 + SLOT_COUNT * SLOT_BYTES);
    frame.set(parentHeader(STATE.UNI, 0, 0, SLOT_COUNT * SLOT_BYTES, false));
    const own = this.own.shift();
    if (own) for (let i = 0; i < 7; i++) put16(frame, 3 + i * 2, own[i] ?? 0);
    const echo = this.echo;
    this.echo = null;
    if (echo) for (let i = 0; i < 7; i++) put16(frame, 3 + SLOT_BYTES + i * 2, echo[i]);
    return frame;
  }

  // ---- game level (link_rfu_2.c as the parent)

  command(words) {
    this.own.push(words);
  }

  playerIds() {
    // Two players; slot 0's child is multiplayer id 1.
    this.command([CMD.SEND_PLAYER_IDS, 2, 0x0001, 0, 0, 0, 0]);
  }

  requestBlock(type) {
    this.command([CMD.SEND_BLOCK_REQ, type, 0, 0, 0, 0, 0]);
  }

  standby(count) {
    this.command([CMD.READY_EXIT_STANDBY, count, 0, 0, 0, 0, 0]);
    this.command([CMD.READY_EXIT_STANDBY, count, 0, 0, 0, 0, 0]);
  }

  closeLink(count) {
    this.command([CMD.READY_CLOSE_LINK, count, 0, 0, 0, 0, 0]);
  }

  // The parent's block: its INIT on four frames, then one fragment a frame,
  // never resent. The child only reads a new INIT once it has taken the
  // previous block, which the four INIT frames give it time to do.
  sendBlock(data) {
    const count = Math.max(1, Math.ceil(data.length / FRAGMENT_BYTES));
    for (let i = 0; i < 4; i++) this.command([CMD.SEND_BLOCK_INIT, count, 0x80, 0, 0, 0, 0]);
    for (let i = 0; i < count; i++) {
      const words = [CMD.SEND_BLOCK | i];
      for (let k = 0; k < 6; k++) {
        const at = i * FRAGMENT_BYTES + k * 2;
        words.push((data[at] ?? 0) | ((data[at + 1] ?? 0) << 8));
      }
      this.command(words);
    }
    return count;
  }
}

function put16(bytes, at, value) {
  bytes[at] = value & 0xff;
  bytes[at + 1] = (value >> 8) & 0xff;
}
