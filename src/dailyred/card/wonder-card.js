/**
 * International Wonder Card body, GB-Link wire payload, and .wc3 file.
 * Wire layout: [0,332) card, [332,336) zeros, [336,…) deliveryman script.
 */
import { alloc, writeU16LE, writeU32LE, toBase64 } from '../bytes.js';
import { compute as crc16 } from './crc16.js';
import { encodeField } from './text.js';

const SIZE = 332;
const FIELD_BYTES = 40;
const SCRIPT_OFFSET = 336;
const WC3_SIZE = 0x58c;
const CARD_AT = 4;
const SCRIPT_AT = 0x1a0;
const DATA_AT = 0x1a4;
const RAM_SCRIPT_MAGIC = 0x33;
const MAX_SCRIPT = 995;

/** 332-byte international Wonder Card body. */
export function buildCard({
  flagId,
  iconSpecies,
  title,
  subtitle,
  body,
  footer,
  idNumber = 0,
}) {
  const bytes = alloc(SIZE, 0xff);
  writeU16LE(bytes, 0, flagId);
  writeU16LE(bytes, 2, iconSpecies);
  writeU32LE(bytes, 4, idNumber >>> 0);
  bytes[8] = 0x00;
  bytes[9] = 0x00;

  const bodyPad = [...body];
  while (bodyPad.length < 4) bodyPad.push('');
  const footerPad = [...footer];
  while (footerPad.length < 2) footerPad.push('');
  const fields = [title, subtitle, ...bodyPad.slice(0, 4), ...footerPad.slice(0, 2)];
  for (let i = 0; i < fields.length; i++) {
    bytes.set(encodeField(fields[i], FIELD_BYTES), 10 + FIELD_BYTES * i);
  }
  bytes[330] = 0x00;
  bytes[331] = 0x00;
  return bytes;
}

export function buildPayload(card332, script) {
  if (card332.length !== SIZE) {
    throw new Error(`Wonder Card must be ${SIZE} bytes.`);
  }
  const out = alloc(SCRIPT_OFFSET + script.length, 0);
  out.set(card332, 0);
  out.set(script, SCRIPT_OFFSET);
  return out;
}

/** International .wc3 (1420 bytes) for WC3 Plugin / GB-Link. */
export function encodeWc3(card332, script) {
  if (card332.length !== SIZE) {
    throw new Error('Wonder Card must be 332 bytes.');
  }
  if (script.length > MAX_SCRIPT) {
    throw new Error(`Script is ${script.length} bytes; max ${MAX_SCRIPT}.`);
  }

  const file = alloc(WC3_SIZE, 0);
  file.set(card332, CARD_AT);
  writeU32LE(file, 0, crc16(file.subarray(CARD_AT, CARD_AT + SIZE)));

  const data = alloc(1000, 0);
  data[0] = RAM_SCRIPT_MAGIC;
  data[1] = 0xff;
  data[2] = 0xff;
  data[3] = 0xff;
  data.set(script, 4);
  file.set(data, DATA_AT);
  writeU32LE(file, SCRIPT_AT, crc16(file.subarray(DATA_AT, DATA_AT + 1000)));

  return file;
}

export function payloadsArray(entries) {
  return entries.map(({ rom, payload }) => ({
    rom,
    payload: toBase64(payload),
  }));
}
