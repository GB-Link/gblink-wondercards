// Adapter-level frames the GB-Link wireless mode exchanges with its host:
// "RFU1", type and header (both big-endian), then a payload whose size is
// fixed by the type, so the stream frames itself across 64-byte packets.

const MAGIC = [0x52, 0x46, 0x55, 0x31];

export const RFU1 = {
  BROADCAST: 0,
  CONNECT_REQ: 1,
  CONNECT_ACK: 2,
  CONNECT_NACK: 3,
  DISCONNECT: 4,
  HOST_SEND: 5,
  CLIENT_SEND: 6,
  CLIENT_ACK: 7,
  FLOWCTL: 8,
};

export const MAX_SEND_BYTES = 92;

export function frameSize(type) {
  if (type === RFU1.BROADCAST) return 36;
  if (type === RFU1.HOST_SEND || type === RFU1.CLIENT_SEND) return 104;
  if (type >= RFU1.CONNECT_REQ && type <= RFU1.FLOWCTL) return 16;
  return -1;
}

function put32be(bytes, at, value) {
  bytes[at] = value >>> 24;
  bytes[at + 1] = (value >>> 16) & 0xff;
  bytes[at + 2] = (value >>> 8) & 0xff;
  bytes[at + 3] = value & 0xff;
}

function get32be(bytes, at) {
  return ((bytes[at] << 24) | (bytes[at + 1] << 16) | (bytes[at + 2] << 8) | bytes[at + 3]) >>> 0;
}

function emptyFrame(type, header) {
  const frame = new Uint8Array(frameSize(type));
  frame.set(MAGIC);
  put32be(frame, 4, type);
  put32be(frame, 8, header >>> 0);
  return frame;
}

export function commandFrame(type, header) {
  return emptyFrame(type, header);
}

// The game writes its six broadcast words little-endian; the frame carries
// them as big-endian words.
export function broadcastFrame(header, data) {
  const frame = emptyFrame(RFU1.BROADCAST, header);
  for (let i = 0; i < 6; i++) {
    const at = i * 4;
    const word = (data[at] | (data[at + 1] << 8) | (data[at + 2] << 16) | (data[at + 3] << 24)) >>> 0;
    put32be(frame, 12 + at, word);
  }
  return frame;
}

export function broadcastData(frame) {
  const data = new Uint8Array(24);
  for (let i = 0; i < 6; i++) {
    const word = get32be(frame, 12 + i * 4);
    data[i * 4] = word & 0xff;
    data[i * 4 + 1] = (word >>> 8) & 0xff;
    data[i * 4 + 2] = (word >>> 16) & 0xff;
    data[i * 4 + 3] = word >>> 24;
  }
  return data;
}

export function hostSendFrame(payload) {
  const length = Math.min(payload.length, MAX_SEND_BYTES);
  const frame = emptyFrame(RFU1.HOST_SEND, length);
  frame.set(payload.subarray(0, length), 12);
  return frame;
}

export function clientSendFrame(header, payload) {
  const frame = emptyFrame(RFU1.CLIENT_SEND, header);
  frame.set(payload.subarray(0, MAX_SEND_BYTES), 12);
  return frame;
}

export function hostPayload(frame) {
  const length = Math.min(frame[11] & 0x7f, MAX_SEND_BYTES);
  return frame.slice(12, 12 + length);
}

// A child's send length is the header's top byte.
export function clientPayload(frame) {
  const length = Math.min(frame[8], MAX_SEND_BYTES);
  return frame.slice(12, 12 + length);
}

export class Rfu1Reader {
  constructor() {
    this.buffer = new Uint8Array(0);
  }

  push(bytes) {
    const joined = new Uint8Array(this.buffer.length + bytes.length);
    joined.set(this.buffer);
    joined.set(bytes, this.buffer.length);
    const frames = [];
    let at = 0;
    while (joined.length - at >= 12) {
      if (joined[at] !== MAGIC[0] || joined[at + 1] !== MAGIC[1]
        || joined[at + 2] !== MAGIC[2] || joined[at + 3] !== MAGIC[3]) {
        at++;
        continue;
      }
      const type = get32be(joined, at + 4);
      const size = frameSize(type);
      if (size < 0) {
        at++;
        continue;
      }
      if (joined.length - at < size) break;
      frames.push({ type, header: get32be(joined, at + 8), frame: joined.slice(at, at + size) });
      at += size;
    }
    this.buffer = joined.slice(at);
    return frames;
  }
}
