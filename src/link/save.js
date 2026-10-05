// The whole save of FireRed, LeafGreen or Emerald over Mystery Gift, both ways.
//
// Backup: the client runs its ROM's backup script (tools/native-cards/
// savebackup.s) once per pass of its client script, and each pass sends the
// next stretch of the 128 KB save chip, compressed into a message of up to
// 1 KB. The exchange ends with a message of the page's own, which the game
// shows without saving, so the backup leaves the save as it was.
//
// Restore: the client installs its ROM's restore script (saverestore.s), which
// reports where the chip's newest copy is, then takes the save a sector at a
// time, compressed, writes each sector beside that copy with the game's own
// sector write, reads it back and reports; the next sector goes once the report
// is in, as nothing reaches the game while the chip is written. With every
// sector in, it loads the save, and the exchange ends on a success the game
// saves after. Anything short of that ends on a message the game shows without
// saving, and until the new copy is whole the chip's own still loads.

import {
  CLI,
  CLIENT_SCRIPTS,
  MG_LINK,
  MG_LINK_BUFFER_SIZE,
  WonderCardServer,
  clientScript,
  isJapanese,
  parseGameData,
  romId,
} from './mystery-gift.js';
import { SAVE_MESSAGES, SAVE_SCRIPTS } from '../events/save-payloads.js';

export const SAVE_BYTES = 0x20000;
export const SAVE_ROMS = Object.keys(SAVE_SCRIPTS);

const SECTOR_BYTES = 0x1000;
const SECTORS = SAVE_BYTES / SECTOR_BYTES;
const SECTOR_DATA = 0xf80;
const SLOT_SECTORS = 14;
const FIRST_EXTRA_SECTOR = 2 * SLOT_SECTORS;
const SIGNATURE = 0x08012025;
// Backup passes per client script: each takes 24 of its 1024 bytes.
const MAX_PASSES = 32;
const OP_DATA = 1;
const OP_FINISH = 2;
const HEADER_BYTES = 12;
const SAVE_STATUS_OK = 1;
const CLI_MSG_BUFFER_SUCCESS = 13;
const CLI_MSG_BUFFER_FAILURE = 14;

// Backups cut short, by game and player: { save, at }; restores cut short, by game,
// player and file: { counter, done }. The next exchange with the same game goes on
// from there: a restore only while the chip's newest copy is still the one it went
// beside, which stays newest until the new copy is whole.
const unfinishedBackups = new Map();
const unfinishedRestores = new Map();
const playerKey = (game) => `${game.gameCode} ${game.trainerId} ${Array.from(game.playerName).join(',')}`;
function restoreKey(game, save) {
  let hash = 0;
  for (let i = 0; i < save.length; i += 4) hash = (Math.imul(hash, 31) + u32(save, i)) >>> 0;
  return `${playerKey(game)} ${hash}`;
}

const u16 = (bytes, at) => bytes[at] | (bytes[at + 1] << 8);
const u32 = (bytes, at) => (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;

// Whether a sector's checksum (save.c CalculateChecksum) holds over its data,
// whose size depends on the sector, the game and its language: some size, in
// steps of 4 bytes, up to the whole data area.
function checksumHolds(save, at) {
  const want = u16(save, at + 0xff6);
  let sum = 0;
  for (let i = 0; i < SECTOR_DATA; i += 4) {
    sum = (sum + u32(save, at + i)) >>> 0;
    if ((((sum >>> 16) + sum) & 0xffff) === want) return true;
  }
  return false;
}

// What a save holds: each copy's 14 sectors whole, and its counter.
export function describeSave(save) {
  const slots = [0, 1].map((slot) => {
    const ids = new Set();
    let counter = null;
    let sound = true;
    for (let i = 0; i < SLOT_SECTORS; i++) {
      const at = (slot * SLOT_SECTORS + i) * SECTOR_BYTES;
      const id = u16(save, at + 0xff4);
      const good = u32(save, at + 0xff8) === SIGNATURE && checksumHolds(save, at) && id < SLOT_SECTORS;
      if (!good) {
        sound = false;
        continue;
      }
      ids.add(id);
      const count = u32(save, at + 0xffc);
      if (counter !== null && count !== counter) sound = false;
      counter = count;
    }
    return { sound: sound && ids.size === SLOT_SECTORS, counter };
  });
  const sound = slots.filter((slot) => slot.sound);
  return { slots, sound: sound.length > 0, counter: sound.length ? Math.max(...sound.map((slot) => slot.counter)) : null };
}

// The tokens both scripts use: n < 0x80 then n + 1 bytes as they are, or
// n >= 0x80 then a byte repeated n - 0x80 + 3 times.
export function inflate(tokens, save, at) {
  for (let i = 0; i < tokens.length;) {
    const n = tokens[i++];
    const length = n < 0x80 ? n + 1 : n - 0x80 + 3;
    if (at + length > save.length || i + (n < 0x80 ? length : 1) > tokens.length) {
      throw new Error('The Game Boy Advance sent a save block that does not fit.');
    }
    if (n < 0x80) {
      save.set(tokens.subarray(i, i + length), at);
      i += length;
    } else {
      save.fill(tokens[i++], at, at + length);
    }
    at += length;
  }
  return at;
}

// One token per array, each with how many bytes it stands for.
export function deflate(bytes) {
  const tokens = [];
  for (let i = 0; i < bytes.length;) {
    let run = 1;
    while (i + run < bytes.length && run < 130 && bytes[i + run] === bytes[i]) run++;
    if (run >= 3) {
      tokens.push({ bytes: [0x80 + run - 3, bytes[i]], length: run });
      i += run;
      continue;
    }
    const start = i;
    while (i < bytes.length && i - start < 128) {
      if (i > start && i + 2 < bytes.length && bytes[i + 1] === bytes[i] && bytes[i + 2] === bytes[i]) break;
      i++;
    }
    tokens.push({ bytes: [i - start - 1, ...bytes.subarray(start, i)], length: i - start });
  }
  return tokens;
}

// Where the chip's newest copy is, from the footers the restore script reads
// (12 bytes a sector: id, checksum, signature, counter): the slot whose 14
// sectors all carry the signature, the higher counter winning as in save.c.
export function chipNewest(footers) {
  const slots = [0, 1].map((slot) => {
    const ids = new Set();
    let counter = null;
    for (let i = 0; i < SLOT_SECTORS; i++) {
      const at = (slot * SLOT_SECTORS + i) * 12;
      if (u32(footers, at + 4) !== SIGNATURE) return null;
      ids.add(u16(footers, at));
      counter = u32(footers, at + 8);
    }
    return ids.size === SLOT_SECTORS ? { slot, counter } : null;
  }).filter(Boolean);
  if (!slots.length) return null;
  return slots.reduce((a, b) => ((b.counter + 1) >>> 0 > (a.counter + 1) >>> 0 ? b : a));
}

// The sectors to write, in order, as { sector, bytes }: the save's newest whole
// copy in the slot beside the chip's newest one, its counter one past that
// copy's so that it loads (the game puts a counter's copy in slot counter % 2,
// which this keeps), then the last four sectors (Hall of Fame and the rest).
// The game takes a slot whose 14 sector ids all pass their checksums, whatever
// their counters, so old and new sectors could pass as a copy halfway: the old
// copy's sector of id 0 there is erased first and the new one written last, so
// the slot lacks it until the copy is whole, and the chip's own copy loads.
// footers: the chip's, as the restore script reads them.
export function sectorsToWrite(save, newest, footers) {
  const { slots } = describeSave(save);
  const from = slots[0].sound && (!slots[1].sound || slots[0].counter > slots[1].counter) ? 0 : 1;
  const counter = newest ? (newest.counter + 1) >>> 0 : 0;
  const to = counter % 2;
  const copy = [];
  for (let i = 0; i < SLOT_SECTORS; i++) {
    const bytes = save.slice((from * SLOT_SECTORS + i) * SECTOR_BYTES, (from * SLOT_SECTORS + i + 1) * SECTOR_BYTES);
    new DataView(bytes.buffer).setUint32(0xffc, counter, true);
    copy.push({ sector: to * SLOT_SECTORS + i, bytes, id: u16(bytes, 0xff4) });
  }
  const out = [];
  for (let i = 0; i < SLOT_SECTORS; i++) {
    const at = (to * SLOT_SECTORS + i) * 12;
    if (u32(footers, at + 4) === SIGNATURE && u16(footers, at) === 0) {
      out.push({ sector: to * SLOT_SECTORS + i, bytes: new Uint8Array(SECTOR_BYTES).fill(0xff) });
    }
  }
  out.push(...copy.filter((s) => s.id !== 0), ...copy.filter((s) => s.id === 0));
  for (let n = FIRST_EXTRA_SECTOR; n < SECTORS; n++) out.push({ sector: n, bytes: save.subarray(n * SECTOR_BYTES, (n + 1) * SECTOR_BYTES) });
  return out.map(({ sector, bytes }) => ({ sector, bytes }));
}

// A restore message: a branch from where the client runs it (the start of the
// decompression buffer) to the installed entry, the op, the rest.
function restoreMessage(scripts, op, body = []) {
  const bytes = new Uint8Array(5 + body.length);
  const branch = (0xea000000 | (((scripts.entry - (scripts.buffer + 8)) >> 2) & 0xffffff)) >>> 0;
  new DataView(bytes.buffer).setUint32(0, branch, true);
  bytes[4] = op;
  bytes.set(body, 5);
  return bytes;
}

// Each sector to write as messages of at most 1 KB, the last marked to write it.
export function sectorMessages(save, scripts, newest, footers) {
  return sectorsToWrite(save, newest, footers).map(({ sector, bytes }) => {
    const tokens = deflate(bytes);
    const messages = [];
    let offset = 0;
    for (let i = 0; i < tokens.length;) {
      const start = offset;
      const body = [];
      while (i < tokens.length && HEADER_BYTES + body.length + tokens[i].bytes.length <= MG_LINK_BUFFER_SIZE) {
        body.push(...tokens[i].bytes);
        offset += tokens[i].length;
        i++;
      }
      const last = i === tokens.length;
      messages.push(restoreMessage(scripts, OP_DATA, [sector, last ? 1 : 0, 0, start & 0xff, start >> 8, body.length & 0xff, body.length >> 8, ...body]));
    }
    return { sector, messages };
  });
}

function messagesFor(game) {
  return isJapanese(game) ? SAVE_MESSAGES.japanese : SAVE_MESSAGES.international;
}

class SaveServer extends WonderCardServer {
  constructor({ link, log = () => {} }) {
    super({ link, payload: () => null, game: null, confirm: async () => false, log });
  }

  // The game data, or the end of the exchange when this game can't take part.
  async check() {
    this.stage('checking');
    this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.sendGameData);
    const game = parseGameData(await this.receive(MG_LINK.GAME_DATA));
    this.stage('checked', game);
    if (!game.valid) return { done: await this.end('cant-accept', CLIENT_SCRIPTS.cantAccept, game) };
    const scripts = SAVE_SCRIPTS[romId(game)];
    if (!scripts) return { done: await this.end('unsupported', CLIENT_SCRIPTS.cantAccept, game) };
    return { game, scripts };
  }

  // Ends on one of the page's messages: a success the game saves after, or not.
  async close(saves, text) {
    this.send(MG_LINK.CLIENT_SCRIPT, clientScript([
      [CLI.RECV, MG_LINK.DYNAMIC_MSG], [CLI.COPY_MSG], [CLI.SEND_READY_END],
      [CLI.RETURN, saves ? CLI_MSG_BUFFER_SUCCESS : CLI_MSG_BUFFER_FAILURE],
    ]));
    this.send(MG_LINK.DYNAMIC_MSG, text);
    await this.receive(MG_LINK.READY_END);
  }
}

export class SaveBackupServer extends SaveServer {
  async run() {
    const { done, game, scripts } = await this.check();
    if (done) return done;
    const key = playerKey(game);
    const kept = unfinishedBackups.get(key) ?? { save: new Uint8Array(SAVE_BYTES), at: 0 };
    unfinishedBackups.set(key, kept);
    const { save } = kept;
    const total = SAVE_BYTES / 1024;
    const start = kept.at;
    let at = start;
    let passes = 0;
    if (start) this.log(`Going on with the backup from ${Math.floor(start / 1024)} KB`);
    const code = scripts.backup.slice();
    new DataView(code.buffer).setUint32(4, start, true);
    this.stage('backing-up', { done: Math.floor(at / 1024), total });
    while (at < SAVE_BYTES) {
      // As many passes as the rest should take at the pace so far, and one more.
      const count = passes ? Math.min(MAX_PASSES, Math.ceil(((SAVE_BYTES - at) * passes) / (at - start)) + 1) : MAX_PASSES;
      const steps = [];
      for (let i = 0; i < count; i++) steps.push([CLI.LOAD_TOSS_RESPONSE], [CLI.RUN_BUFFER_SCRIPT], [CLI.SEND_LOADED]);
      this.send(MG_LINK.CLIENT_SCRIPT, clientScript([[CLI.RECV, MG_LINK.RAM_SCRIPT], ...steps, [CLI.RECV, MG_LINK.CLIENT_SCRIPT], [CLI.COPY_RECV]]));
      this.send(MG_LINK.RAM_SCRIPT, code);
      for (let i = 0; i < count; i++) {
        const tokens = await this.receive(MG_LINK.RESPONSE);
        // Past the end, a pass answers with its 4-byte word.
        const before = at;
        if (at < SAVE_BYTES) kept.at = at = inflate(tokens, save, at);
        passes += 1;
        // The whole save is in: the page offers it now, whatever becomes of the
        // exchange's ending.
        const whole = before < SAVE_BYTES && at >= SAVE_BYTES ? { save: save.slice(), summary: describeSave(save) } : {};
        this.stage('backing-up', { done: Math.floor(at / 1024), total, ...whole });
      }
    }
    await this.close(false, messagesFor(game).backedUp);
    unfinishedBackups.delete(key);
    return { outcome: 'backed-up', game, save, summary: describeSave(save) };
  }
}

export class SaveRestoreServer extends SaveServer {
  // save: the 128 KB .sav to write.
  constructor({ save, ...rest }) {
    super(rest);
    this.save = save;
  }

  async run() {
    const { done, game, scripts } = await this.check();
    if (done) return done;
    const text = messagesFor(game);
    if (this.save?.length !== SAVE_BYTES || !describeSave(this.save).sound) {
      await this.close(false, text.notRestored);
      return { outcome: 'restore-failed', game, reason: 'unsound' };
    }

    // Installed, the script reports the chip's sector footers.
    const reporting = (ident) => [[CLI.RECV, ident], [CLI.LOAD_TOSS_RESPONSE], [CLI.RUN_BUFFER_SCRIPT], [CLI.SEND_LOADED],
      [CLI.RECV, MG_LINK.CLIENT_SCRIPT], [CLI.COPY_RECV]];
    this.stage('restoring', { done: 0, total: SLOT_SECTORS + SECTORS - FIRST_EXTRA_SECTOR });
    this.send(MG_LINK.CLIENT_SCRIPT, clientScript(reporting(MG_LINK.RAM_SCRIPT)));
    this.send(MG_LINK.RAM_SCRIPT, scripts.restore);
    const footers = await this.receive(MG_LINK.RESPONSE);
    const newest = chipNewest(footers);
    const counter = newest ? (newest.counter + 1) >>> 0 : 0;
    const key = restoreKey(game, this.save);
    const earlier = unfinishedRestores.get(key);
    // Going on, the plan is the first attempt's: the slot written to has changed since.
    const kept = earlier?.counter === counter ? earlier : { counter, done: 0, sectors: sectorMessages(this.save, scripts, newest, footers) };
    unfinishedRestores.set(key, kept);
    const { sectors } = kept;
    if (kept.done) this.log(`Going on with the restore after ${kept.done} sectors`);
    this.stage('restoring', { done: kept.done, total: sectors.length });

    // A sector at a time: its messages, then the client's report once written.
    for (const [i, { sector, messages }] of sectors.entries()) {
      if (i < kept.done) continue;
      const passes = messages.slice(1).flatMap(() => [[CLI.RECV, MG_LINK.NEWS], [CLI.RUN_BUFFER_SCRIPT]]);
      this.send(MG_LINK.CLIENT_SCRIPT, clientScript([...passes, ...reporting(MG_LINK.NEWS)]));
      for (const bytes of messages) this.send(MG_LINK.NEWS, bytes);
      const failed = u32(await this.receive(MG_LINK.RESPONSE), 0);
      if (failed) {
        this.log(`The save's sector ${sector} did not write (${failed.toString(16)})`);
        unfinishedRestores.delete(key);
        await this.close(false, text.notRestored);
        return { outcome: 'restore-failed', game, failed };
      }
      kept.done = i + 1;
      this.stage('restoring', { done: i + 1, total: sectors.length });
    }

    this.send(MG_LINK.CLIENT_SCRIPT, clientScript(reporting(MG_LINK.NEWS)));
    this.send(MG_LINK.NEWS, restoreMessage(scripts, OP_FINISH));
    const status = await this.receive(MG_LINK.RESPONSE);
    const failed = status.length >= 8 ? u32(status, 0) : 0xffffffff;
    const loaded = status.length >= 8 ? status[4] : 0xff;
    const ok = failed === 0 && loaded === SAVE_STATUS_OK;
    if (!ok) this.log(`The game could not load the save (sectors failed ${failed.toString(16)}, load ${loaded})`);
    unfinishedRestores.delete(key);
    await this.close(ok, ok ? text.restored : text.notRestored);
    return { outcome: ok ? 'restored' : 'restore-failed', game, failed, loaded };
  }
}
