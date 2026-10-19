/** Patch a packed mon table into a pre-assembled Thumb template. */
import { alloc, writeU16LE, writeU32LE, concat } from '../bytes.js';
import { THUMB_TEMPLATES } from './thumb-templates.js';

const RECORD = 22;
const TABLE = 12 * RECORD;

function fromBase64(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const TEMPLATES = new Map(
  THUMB_TEMPLATES.map((t) => [t.rom, { monTableAt: t.monTableAt, bytes: fromBase64(t.bytes) }]),
);

function packMon(mon) {
  const buf = alloc(RECORD);
  writeU16LE(buf, 0, mon.species);
  writeU16LE(buf, 2, mon.item);
  for (let i = 0; i < 4; i++) writeU16LE(buf, 4 + i * 2, mon.moves[i] ?? 0);
  writeU32LE(buf, 12, mon.personality >>> 0);
  for (let i = 0; i < 6; i++) buf[16 + i] = (mon.evs[i] ?? 0) & 0xff;
  return buf;
}

/** Pack 6 player + 6 enemy mons (ROM-independent). */
export function packMonTable(player, enemy) {
  if (player.length !== 6 || enemy.length !== 6) {
    throw new Error('Need 6 player and 6 enemy mons.');
  }
  const table = concat([...player, ...enemy].map(packMon));
  if (table.length !== TABLE) throw new Error(`Mon table must be ${TABLE} bytes.`);
  return table;
}

/** Copy the ROM template and write the mon table. */
export function buildThumb(romId, monTable) {
  const tmpl = TEMPLATES.get(romId);
  if (!tmpl) throw new Error(`No Thumb template for ${romId}`);
  if (tmpl.monTableAt + monTable.length > tmpl.bytes.length) {
    throw new Error('mon_table past end of payload.');
  }
  const blob = tmpl.bytes.slice();
  blob.set(monTable, tmpl.monTableAt);
  return blob;
}
