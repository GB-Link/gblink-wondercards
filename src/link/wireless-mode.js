import {
  getActiveConnection,
  sendDataPacket,
  waitForDataPacket,
  ensureDataReader,
  reconfigureWireless,
} from './gblink.js';

const RFUP_MAGIC = [0x52, 0x46, 0x55, 0x50];
const USB_PACKET_SIZE = 64;
const CHUNK_DATA_MAX = 48;
const MAX_PAYLOAD_BYTES = 16384;

export const RFUP_EVT = {
  PHASE: 0x10,
  COMPLETE: 0x11,
  ERROR: 0x12,
  WIRE: 0x13,
};

export const RFUP_HOST = {
  SET_IDENTITY: 0x01,
  LOAD_PAYLOAD: 0x02,
  START_SESSION: 0x03,
  CANCEL_SESSION: 0x04,
  SET_WIRE_LOG: 0x05,
};

export const RFUP_PHASE = {
  IDLE: 0,
  RESETTING: 1,
  BROADCASTING: 2,
  WAITING_CHILD: 3,
  CONNECTED: 4,
  LINKING: 5,
  MG_SCRIPT: 6,
  MG_CARD: 7,
  MG_RAM_SCRIPT: 8,
  DONE: 9,
  ERROR: 10,
};

const PHASE_LABELS = {
  [RFUP_PHASE.IDLE]: 'Idle',
  [RFUP_PHASE.RESETTING]: 'Waiting for Emerald adapter probe (checkID)…',
  [RFUP_PHASE.BROADCASTING]: 'checkID PASSED — broadcasting (Emerald should accept adapter)',
  [RFUP_PHASE.WAITING_CHILD]: 'Waiting for GBA to connect…',
  [RFUP_PHASE.CONNECTED]: 'GBA connected',
  [RFUP_PHASE.LINKING]: 'Establishing Pokémon link…',
  [RFUP_PHASE.MG_SCRIPT]: 'Sending Mystery Gift client script…',
  [RFUP_PHASE.MG_CARD]: 'Sending Wonder Card…',
  [RFUP_PHASE.MG_RAM_SCRIPT]: 'Sending event script…',
  [RFUP_PHASE.DONE]: 'Delivery complete',
  [RFUP_PHASE.ERROR]: 'Error',
};

const ERROR_LABELS = {
  0: 'Unknown error',
  1: 'Payload too large',
  2: 'Payload not loaded',
  3: 'Identity not set',
  4: 'Timed out waiting for GBA',
  5: 'No GBA / RFU traffic',
  6: 'Cancelled',
  7: 'Unexpected failure',
  8: 'Handshake failed',
  9: 'Child disconnected',
};

const EVT_PAYLOAD_SIZES = {
  [RFUP_EVT.PHASE]: 3,
  [RFUP_EVT.COMPLETE]: 1,
  [RFUP_EVT.ERROR]: 3,
  [RFUP_EVT.WIRE]: 9,
};

function buildHostPacket(cmd, body = new Uint8Array(0)) {
  const pkt = new Uint8Array(USB_PACKET_SIZE);
  pkt.set(RFUP_MAGIC, 0);
  pkt[4] = cmd;
  pkt.set(body.subarray(0, USB_PACKET_SIZE - 5), 5);
  return pkt;
}

function parseRfupPackets(data) {
  if (!data || data.byteLength < 5) return [];
  const view = data instanceof DataView
    ? data
    : new DataView(data.buffer, data.byteOffset, data.byteLength);
  const results = [];
  let offset = 0;
  while (offset + 5 <= view.byteLength) {
    if (
      view.getUint8(offset) !== RFUP_MAGIC[0]
      || view.getUint8(offset + 1) !== RFUP_MAGIC[1]
      || view.getUint8(offset + 2) !== RFUP_MAGIC[2]
      || view.getUint8(offset + 3) !== RFUP_MAGIC[3]
    ) {
      offset++;
      continue;
    }
    const evt = view.getUint8(offset + 4);
    const payloadLen = EVT_PAYLOAD_SIZES[evt];
    if (payloadLen === undefined || offset + 5 + payloadLen > view.byteLength) {
      offset++;
      continue;
    }
    const payload = new Uint8Array(payloadLen);
    for (let i = 0; i < payloadLen; i++) payload[i] = view.getUint8(offset + 5 + i);
    results.push({ evt, payload });
    offset += 5 + payloadLen;
  }
  return results;
}

function describeWireEvent(payload) {
  if (payload.length < 5) return null;
  const flags = payload[0];
  const a = payload[1] | (payload[2] << 8);
  const b = payload[3] | (payload[4] << 8);
  const total = payload.length >= 9
    ? (payload[5] | (payload[6] << 8) | (payload[7] << 16) | (payload[8] << 24))
    : 0;
  if (flags & 0x80) {
    const pins = flags & 0x1f;
    const sc = pins & 1 ? 'H' : 'L';
    const si = pins & 2 ? 'H' : 'L';
    const sdGba = pins & 8 ? 'H' : 'L';
    const sdGbc = pins & 16 ? 'H' : 'L';
    return `Probe SC=${sc} SI=${si} SD3=${sdGba} SD4=${sdGbc} | SC↓=${a} SoftReset=${b}`;
  }
  if (flags === 0x60) {
    if (b === 0xa10f) return `RFU phy v${a} loaded — flash OK`;
    return `checkID rxLo=0x${a.toString(16)} turn=${b & 0xff}`;
  }
  if (flags === 0x61) {
    const turns = a & 0xff;
    const ownIdx = (a >> 8) & 0xf;
    const sawNi = (a >> 12) & 1;
    const sawFin = (a >> 13) & 1;
    const stageNames = { 2: 'SC-timeout', 3: 'bit-timeout', 4: 'cancel', 5: 'SoftReset-abort' };
    const stageSuffix = turns === 0 ? ` stage=${b >> 8}(${stageNames[b >> 8] ?? '?'})` : ` lastTxHi=0x${b.toString(16)}`;
    return `checkID summary turns=${turns} ownIdx=${ownIdx} ni=${sawNi} fin=${sawFin}${stageSuffix}`;
  }
  if (flags === 0x62) {
    return `checkID lastRx hi=0x${a.toString(16)} lo=0x${b.toString(16)}`;
  }
  if (flags === 0x70) {
    if (a === 1) return 'checkID #1 passed — listening for stopMode re-probe or initializeRFU RESET…';
    return b
      ? 'post-checkID: 2nd login or captured command — entering command mode'
      : 'post-checkID: no 2nd probe — staying in command mode for RESET/BYE (initializeRFU has no extra SoftReset)';
  }
  if (flags === 0x71) {
    return `command-mode exchange timeout x${a} (waiting for GBA command word)`;
  }
  if (flags === 0x72) {
    return `command-mode saw non-command word header=0x${a.toString(16)} low=0x${b.toString(16)}`;
  }
  if (flags === 0x73) {
    return `Emerald restarted checkID mid-session (saw 0x${a.toString(16)}${b.toString(16).padStart(4,'0')}) — redoing full login…`;
  }
  if (flags === 0x74) {
    return `[cmd-word] 0x${a.toString(16).padStart(4,'0')}${b.toString(16).padStart(4,'0')}`;
  }
  if (flags === 0x76) {
    const cmdNames = { 0x10: 'RESET', 0x17: 'SETUP', 0x16: 'BROADCAST', 0x19: 'START_HOST', 0x1c: 'BROADCAST_READ_START', 0x3d: 'BYE' };
    const name = cmdNames[a] ?? `0x${a.toString(16)}`;
    return b
      ? `ack-result ${name}: OK (GBA should see reqResult=0)`
      : `ack-result ${name}: FAILED (physical ack did not complete — GBA will likely see this as a timeout/error)`;
  }
  if (flags === 0x77) {
    const elapsedUs = a << 4;
    const stage = (b >> 8) & 0xff;
    const bitIndexRaw = b & 0xff;
    const stageNames = {
      0: 'ok',
      1: 'timed out in leading idle-gap wait',
      2: 'timed out waiting for initial SC falling edge (SC never fell — GBA never started clocking)',
      3: `timed out mid-bitloop waiting for a clock edge${bitIndexRaw ? ` at bit ${bitIndexRaw - 1}` : ''}`,
      4: 'cancelled',
    };
    return `  └─ failed exchange: elapsed=${elapsedUs}us stage=${stageNames[stage] ?? stage}`;
  }
  if (flags === 0x78) {
    const dtUs = a;
    const idx = (b >> 8) & 0xff;
    const pins = b & 0xff;
    const sc = pins & 1 ? 'H' : 'L';
    const si = pins & 2 ? 'H' : 'L';
    const so = pins & 4 ? 'H' : 'L';
    return `    trace[${idx}] +${dtUs}us  SC=${sc} SI=${si} SO=${so}`;
  }
  if (flags === 0x79) {
    const elapsedUs = a << 4;
    const stage = b;
    const stageNames = {
      0: 'ok (unexpected on failure path)',
      1: 'never saw a clean 10us SC-idle-high gap (line may be busy/dead/toggling)',
      2: 'idle-gap satisfied, but SC never actually fell to start a word',
      3: 'SC started clocking but stalled mid-word',
      4: 'cancelled',
      5: 'SoftReset (SD high) during peek — aborted so we can re-run checkID',
    };
    return `  peek: elapsed=${elapsedUs}us stage=${stageNames[stage] ?? stage}`;
  }
  if (flags === 0x7a) {
    return `*** SoftReset detected mid command-mode (#${a}) — restarting checkID ***`;
  }
  if (flags === 0x7b) {
    const cmdNames = { 0x10: 'RESET', 0x17: 'SETUP', 0x3d: 'BYE' };
    const name = cmdNames[a] ?? `0x${a.toString(16)}`;
    return `Emerald stuck re-sending ${name} (#${b}) — session not progressing past this command, but the link is alive`;
  }
  if (flags === 0x7c) {
    return 'Polling';
  }
  if (flags === 0x7d) {
    return a
      ? `SoftReset pulse accepted (#${b}) — starting checkID`
      : `listening on SPI (login idle, SoftReset seen=${b})…`;
  }
  if (flags === 0x7e) {
    return `ignored leftover 0x9966 during login 0x${a.toString(16).padStart(4, '0')}${b.toString(16).padStart(4, '0')} (staying in checkID)`;
  }
  if (flags === 0x04) {
    const ev = { 0x27: 'TIMEO', 0x28: 'DATA', 0x29: 'DISC' };
    const name = ev[b] ?? `0x${b.toString(16)}`;
    return a
      ? `wait-event ${name} delivered — clock back to GBA`
      : `wait-event ${name} delivery FAILED (handshake/SO)`;
  }
  if (flags === 0x05) {
    const st = (b >> 10) & 0xf;
    const ack = (b >> 9) & 1;
    const phase = (b >> 5) & 3;
    const n = (b >> 7) & 3;
    const stName = { 0: 'NULL', 1: 'START', 2: 'NI', 3: 'END', 4: 'UNI' }[st] ?? `st${st}`;
    return `NI name-send: ackLen=${a} childLLSF=${stName} ack=${ack} ph=${phase} n=${n} raw=0x${b.toString(16)}`;
  }
  if (flags === 0x06) {
    const names = ['JOIN start0', 'JOIN start1', 'JOIN data OK', 'JOIN end', 'JOIN idle', 'UNI ready'];
    const step = a === 0xff ? 'name' : (names[a] ?? `step ${a}`);
    return `join-status NI: ${step} nameDone=${b}`;
  }
  if (flags === 0x07) {
    return `UNI parent remaining=${a} cmd=0x${b.toString(16)}`;
  }
  if (flags === 0x08) {
    return `UNI child cmd=0x${b.toString(16)}`;
  }
  if (flags === 0x03) {
    const cmdNames = {
      0x10: 'HELLO', 0x11: 'SIGNAL', 0x12: 'VERSION', 0x13: 'SYSSTAT',
      0x14: 'SLOTSTAT', 0x15: 'CFGSTAT', 0x16: 'BROADCAST', 0x17: 'SETUP',
      0x19: 'START_HOST', 0x1a: 'POLL_CONN', 0x1b: 'END_HOST',
      0x1c: 'BCRD_START', 0x1d: 'BCRD_POLL', 0x1e: 'BCRD_END',
      0x1f: 'CONNECT', 0x20: 'IS_CONN', 0x21: 'FINISH_CONN',
      0x24: 'SEND_DATA', 0x25: 'SEND_WAIT', 0x26: 'RECV_DATA',
      0x27: 'WAIT', 0x30: 'DISCONNECT', 0x35: 'WAIT2', 0x37: 'RTX_WAIT',
      0x3d: 'BYE',
    };
    const name = cmdNames[a] ?? `0x${a.toString(16)}`;
    if (a === 0x11 || a === 0x1a || a === 0x1c || a === 0x1d || a === 0x1e) {
      return 'Polling';
    }
    return `cmd ${name}`;
  }
  if (flags === 0x7f) {
    return `unstuck missed STWI handshake x${a} (GBA was waiting on SI/SO after a command we did not sample)`;
  }
  if (flags & 0x40) {
    return `checkID txHi=0x${a.toString(16)} rxHi=0x${b.toString(16)}`;
  }
  return `[wire] flags=0x${flags.toString(16)} a=0x${a.toString(16)} b=0x${b.toString(16)} n=${total}`;
}

function describeEvent(evt, payload) {
  if (evt === RFUP_EVT.WIRE) return describeWireEvent(payload);
  if (evt === RFUP_EVT.PHASE && payload.length >= 1) {
    return PHASE_LABELS[payload[0]] ?? null;
  }
  if (evt === RFUP_EVT.COMPLETE) return 'Event delivered';
  if (evt === RFUP_EVT.ERROR && payload.length >= 1) {
    return ERROR_LABELS[payload[0]] ?? 'Something went wrong';
  }
  return null;
}

export function formatRfupWireMessage(raw) {
  const all = parseRfupPackets(raw);
  if (all.length === 0) return null;
  if (all.some((p) => p.evt !== RFUP_EVT.WIRE)) return null;
  return describeWireEvent(all[0].payload);
}

export async function setIdentity({
  serialNo = 0x0000,
  mbootFlag = 0,
  maxPlayers = 0,
  gnameBytes = null,
  unameBytes = null,
  gname = '',
  uname = '',
} = {}) {
  const conn = getActiveConnection();
  if (!conn) throw new Error('GB-Link not connected.');
  if (!conn.wirelessMode) throw new Error('Adapter is not in wireless mode.');

  const body = new Uint8Array(2 + 1 + 1 + 13 + 8);
  const view = new DataView(body.buffer);
  view.setUint16(0, serialNo & 0xffff, true);
  body[2] = mbootFlag & 0xff;
  body[3] = maxPlayers & 0x03;

  const g = gnameBytes instanceof Uint8Array
    ? gnameBytes
    : Uint8Array.from([...String(gname)].map((c) => c.charCodeAt(0) & 0xff));
  const u = unameBytes instanceof Uint8Array
    ? unameBytes
    : Uint8Array.from([...String(uname)].map((c) => c.charCodeAt(0) & 0xff));
  body.set(g.subarray(0, 13), 4);
  body.set(u.subarray(0, 8), 17);

  await sendDataPacket(conn, buildHostPacket(RFUP_HOST.SET_IDENTITY, body));
  conn.wirelessIdentitySet = true;
}

function markPreloaded(bytes) {
  const conn = getActiveConnection();
  if (conn) {
    conn.wirelessPayloadPreloaded = true;
    conn.wirelessPayloadByteLength = bytes.length;
    conn.wirelessPayloadBytes = bytes;
  }
}

function payloadsMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function isPreloadedPayload(bytes) {
  const conn = getActiveConnection();
  return (
    conn?.wirelessPayloadPreloaded === true
    && payloadsMatch(conn.wirelessPayloadBytes, bytes)
  );
}

export async function preloadPayload(bytes) {
  const conn = getActiveConnection();
  if (!conn) throw new Error('GB-Link not connected.');
  if (!conn.wirelessMode) throw new Error('Adapter is not in wireless mode.');
  if (bytes.length > MAX_PAYLOAD_BYTES) {
    throw new Error(
      `Payload is too large for the adapter (${bytes.length} bytes, max ${MAX_PAYLOAD_BYTES}).`,
    );
  }

  let offset = 0;
  while (offset < bytes.length) {
    const chunkLen = Math.min(CHUNK_DATA_MAX, bytes.length - offset);
    const body = new Uint8Array(6 + chunkLen);
    const view = new DataView(body.buffer);
    view.setUint32(0, offset, true);
    view.setUint16(4, chunkLen, true);
    body.set(bytes.subarray(offset, offset + chunkLen), 6);
    await sendDataPacket(conn, buildHostPacket(RFUP_HOST.LOAD_PAYLOAD, body));
    offset += chunkLen;
  }
  markPreloaded(bytes);
}

export async function startSession() {
  const conn = getActiveConnection();
  if (!conn) throw new Error('GB-Link not connected.');
  if (conn.dataQueue) conn.dataQueue.length = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    ensureDataReader();
    try {
      await sendDataPacket(conn, buildHostPacket(RFUP_HOST.START_SESSION));
      return;
    } catch (err) {
      if (attempt < 2 && err instanceof DOMException && err.name === 'AbortError') {
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      throw err;
    }
  }
}

export async function cancelSession() {
  const conn = getActiveConnection();
  if (!conn?.wirelessMode) return;
  try {
    await sendDataPacket(conn, buildHostPacket(RFUP_HOST.CANCEL_SESSION));
  } catch {
  }
}

export async function setFirmwareWireLog(enabled) {
  const conn = getActiveConnection();
  if (!conn?.wirelessMode) return;
  try {
    await sendDataPacket(
      conn,
      buildHostPacket(RFUP_HOST.SET_WIRE_LOG, new Uint8Array([enabled ? 1 : 0])),
    );
  } catch {
  }
}

async function pollSessionEvents({ onStatus, timeoutMs = 180_000 } = {}) {
  const started = Date.now();
  let lastStatus = null;
  while (Date.now() - started < timeoutMs) {
    const raw = await waitForDataPacket(500);
    if (!raw) continue;

    for (const parsed of parseRfupPackets(raw)) {
      const message = describeEvent(parsed.evt, parsed.payload);
      if (message && message !== lastStatus) {
        lastStatus = message;
        onStatus?.(message);
      }

      if (parsed.evt === RFUP_EVT.COMPLETE) return true;
      if (parsed.evt === RFUP_EVT.PHASE && parsed.payload[0] === RFUP_PHASE.DONE) {
        return true;
      }
      if (parsed.evt === RFUP_EVT.WIRE) {
        const flags = parsed.payload[0];
        const a = parsed.payload[1] | (parsed.payload[2] << 8);
        if (flags === 0x07 && a === 0x5F) return true;
        continue;
      }
      if (parsed.evt === RFUP_EVT.ERROR) {
        const code = parsed.payload[0] ?? 7;
        throw new Error(ERROR_LABELS[code] ?? 'Wireless session failed');
      }
    }
  }
  throw new Error('Timed out waiting for wireless session to finish');
}

export async function runSession({
  identity,
  payloadBytes,
  onStatus,
  timeoutMs = 180_000,
} = {}) {
  const conn = getActiveConnection();
  if (!conn) throw new Error('GB-Link not connected.');

  if (conn.wirelessSessionCompleted) {
    await reconfigureWireless({ onProgress: onStatus });
  }

  if (identity) {
    onStatus?.('Uploading broadcast identity…');
    await setIdentity(identity);
  }

  if (payloadBytes) {
    if (!isPreloadedPayload(payloadBytes)) {
      onStatus?.('Uploading event payload…');
      await preloadPayload(payloadBytes);
    }
  }

  await startSession();
  onStatus?.('Armed — open Mystery Gift → Wireless on Emerald now (adapter must already be connected)');
  try {
    return await pollSessionEvents({ onStatus, timeoutMs });
  } finally {
    if (conn) conn.wirelessSessionCompleted = true;
  }
}

export { pollSessionEvents, PHASE_LABELS, ERROR_LABELS, MAX_PAYLOAD_BYTES, parseRfupPackets, describeEvent };
