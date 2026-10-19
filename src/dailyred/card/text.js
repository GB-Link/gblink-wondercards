/** English Gen 3 charset (pret). Strings end with 0xFF. */

import { alloc } from '../bytes.js';

// Only glyphs used by Daily Red card/script copy (+ alnum handled below).
const CHARSET = new Map([
  [' ', 0x00],
  ['!', 0xab],
  ['.', 0xad],
  ['-', 0xae],
  ['\n', 0xfe],
]);

export function encode(text) {
  const out = [];
  for (const ch of text) {
    if (ch >= '0' && ch <= '9') out.push(0xa1 + (ch.charCodeAt(0) - 48));
    else if (ch >= 'A' && ch <= 'Z') out.push(0xbb + (ch.charCodeAt(0) - 65));
    else if (ch >= 'a' && ch <= 'z') out.push(0xd5 + (ch.charCodeAt(0) - 97));
    else if (CHARSET.has(ch)) out.push(CHARSET.get(ch));
    else throw new Error(`Character not in English game font: ${ch}`);
  }
  out.push(0xff);
  return Uint8Array.from(out);
}

export function encodeField(text, fieldBytes) {
  const bytes = encode(text);
  if (bytes.length > fieldBytes) {
    throw new Error(`Text too long for card field (${fieldBytes} bytes).`);
  }
  const out = alloc(fieldBytes, 0xff);
  out.set(bytes, 0);
  return out;
}
