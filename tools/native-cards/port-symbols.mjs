// Finds the addresses of an English pret build's symbols in another ROM of the
// same game: the other languages, which pret has no sources for. Used by
// rom-symbols.mjs.
//
// - Routines are found by their code: BL offsets and words that look like
//   addresses are masked, everything else (instructions, offsets into structs,
//   constants) must match. A routine with several matches, or none, gets votes
//   from matched routines that call it or load its address, or takes the one
//   match between its nearest matched neighbours (the link order is the same
//   in every language).
// - Data is found through the literal pools of the routines that load it.
//   Where those routines changed (Japanese ROMs differ more), their pools
//   are lined up with the foreign ones on the values known on both sides,
//   and the slot between two of them holds it; tables of routine pointers
//   place more of those routines first.
// - Scripts are searched with their pointers masked; a short one takes the
//   match where the nearest script found already puts it.

import { execFileSync } from 'node:child_process';

const ROM_BASE = 0x08000000;
const ROM_END = 0x0a000000;
const HITS_CAP = 64;

const isRom = (v) => v >= ROM_BASE && v < ROM_END;
const isPointer = (v) => (v >= 0x02000000 && v < 0x02040000) || (v >= 0x03000000 && v < 0x03008000) || isRom(v);
const region = (v) => (v >>> 24 === 0x09 ? 0x08 : v >>> 24);

function u32(bytes, at) {
  return (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;
}

function blTarget(bytes, at, base) {
  const hw1 = bytes[at] | (bytes[at + 1] << 8);
  const hw2 = bytes[at + 2] | (bytes[at + 3] << 8);
  if ((hw1 & 0xf800) !== 0xf000 || (hw2 & 0xf800) !== 0xf800) return null;
  let high = hw1 & 0x7ff;
  if (high & 0x400) high -= 0x800;
  return base + at + 4 + high * 4096 + ((hw2 & 0x7ff) << 1);
}

// A routine's bytes with BLs and address literals masked (mask[i] = 1: must
// match), its literal pool slots and its calls.
function analyse(code, addr) {
  const n = code.length;
  const mask = new Uint8Array(n).fill(1);
  const pool = new Set();
  const calls = [];
  for (let i = 0; i + 1 < n;) {
    const hw = code[i] | (code[i + 1] << 8);
    if (i + 3 < n && (hw & 0xf800) === 0xf000 && ((code[i + 2] | (code[i + 3] << 8)) & 0xf800) === 0xf800) {
      calls.push([i, blTarget(code, i, addr)]);
      mask.fill(0, i, i + 4);
      i += 4;
      continue;
    }
    if ((hw & 0xf800) === 0x4800) {                     // ldr rX, [pc, #imm]
      const slot = ((addr + i + 4) & ~3) + (hw & 0xff) * 4 - addr;
      if (slot >= 0 && slot <= n - 4) pool.add(slot);
    }
    i += 2;
  }
  const literals = [];
  for (const slot of pool) {
    const value = u32(code, slot);
    literals.push([slot, value]);
    if (isPointer(value)) mask.fill(0, slot, slot + 4);
  }
  // Switch tables sit in the middle of a routine and hold code addresses.
  for (let t = 0; t + 3 < n; t += 1) {
    if ((addr + t) % 4 === 0 && !pool.has(t) && isRom(u32(code, t))) mask.fill(0, t, t + 4);
  }
  return { mask, literals, calls };
}

// The longest run of bytes that must match, as the needle.
function needleOf(mask, shortest) {
  let best = [0, 0];
  let run = 0;
  for (let i = 0; i <= mask.length; i += 1) {
    if (i < mask.length && mask[i]) {
      run += 1;
    } else {
      if (run > best[1]) best = [i - run, run];
      run = 0;
    }
  }
  return best[1] >= shortest ? best : null;
}

// Where code matches in `haystack` (offsets), up to `cap` + 1 of them.
function findAll(haystack, code, mask, { cap = HITS_CAP, step = 2, shortest = 4 } = {}) {
  const found = needleOf(mask, shortest);
  if (!found) return [];
  const [at, length] = found;
  const needle = code.subarray(at, at + length);
  const hits = [];
  for (let pos = haystack.indexOf(needle); pos >= 0; pos = haystack.indexOf(needle, pos + 1)) {
    const base = pos - at;
    if (base < 0 || base % step || base + code.length > haystack.length) continue;
    let same = true;
    for (let i = 0; i < code.length && same; i += 1) same = !mask[i] || haystack[base + i] === code[i];
    if (same) {
      hits.push(base);
      if (hits.length > cap) break;
    }
  }
  return hits;
}

// An English pret build: its symbols, and each routine's code analysed.
export class EnglishBuild {
  constructor(elfPath, romBytes) {
    this.rom = romBytes;
    this.symbols = new Map();
    const routines = [];
    const labels = [];
    const nm = execFileSync('arm-none-eabi-nm', ['-n', '-S', '--defined-only', elfPath],
      { encoding: 'utf8', maxBuffer: 1 << 28 });
    for (const line of nm.split('\n')) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 3) continue;
      const [value, size, type, name] = parts.length >= 4 ? parts : [parts[0], null, parts[1], parts[2]];
      if (!name || name.startsWith('.') || name.startsWith('$')) continue;
      const addr = parseInt(value, 16);
      const bytes = size === null ? null : parseInt(size, 16);
      if (!this.symbols.has(name)) this.symbols.set(name, { addr, size: bytes, type });
      if (isRom(addr)) labels.push(addr);
      if ((type === 't' || type === 'T') && bytes && bytes <= 0x4000 && isRom(addr) && addr % 2 === 0) {
        routines.push({ name, addr, size: bytes });
      }
    }
    this.labels = [...new Set(labels)].sort((a, b) => a - b);
    const seen = new Set();
    this.routines = routines.sort((a, b) => a.addr - b.addr).filter((r) => !seen.has(r.name) && seen.add(r.name));
    for (const routine of this.routines) {
      routine.code = romBytes.subarray(routine.addr - ROM_BASE, routine.addr - ROM_BASE + routine.size);
      Object.assign(routine, analyse(routine.code, routine.addr));
    }
    this.byName = new Map(this.routines.map((r) => [r.name, r]));
    // who calls a routine, or loads an address
    this.users = new Map();
    for (const routine of this.routines) {
      const add = (target) => {
        if (!this.users.has(target)) this.users.set(target, new Set());
        this.users.get(target).add(routine);
      };
      for (const [, target] of routine.calls) add(target);
      for (const [, value] of routine.literals) if (isRom(value)) add(value & ~1);
    }
  }

  nextLabel(addr) {
    let lo = 0;
    let hi = this.labels.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.labels[mid] <= addr) lo = mid + 1;
      else hi = mid;
    }
    return lo < this.labels.length ? this.labels[lo] : addr + 0x100;
  }
}

export class Port {
  constructor(build, foreign) {
    this.build = build;
    this.foreign = foreign;
    this.map = new Map();         // routine name -> foreign address
    this.hits = new Map();
    for (const routine of build.routines) {
      if (routine.size < 6) continue;
      const hits = findAll(foreign, routine.code, routine.mask).map((at) => at + ROM_BASE);
      this.hits.set(routine.name, hits);
      if (hits.length === 1) this.map.set(routine.name, hits[0]);
    }
    this.dropOutliers();
    this.exact = new Set(this.map.keys());
    this.rank = new Map(build.routines.map((r, i) => [r.name, i]));
    do this.propagate(); while (this.bracket());
  }

  // Matched routines must keep the English order: drop the few that don't
  // (longest increasing run of foreign addresses).
  dropOutliers() {
    const items = this.build.routines.filter((r) => this.map.has(r.name)).map((r) => [r.name, this.map.get(r.name)]);
    const tails = [];
    const tailIndex = [];
    const prev = new Array(items.length).fill(-1);
    items.forEach(([, f], k) => {
      let lo = 0;
      let hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < f) lo = mid + 1;
        else hi = mid;
      }
      tails[lo] = f;
      tailIndex[lo] = k;
      prev[k] = lo ? tailIndex[lo - 1] : -1;
    });
    const keep = new Set();
    for (let k = tailIndex[tails.length - 1] ?? -1; k >= 0; k = prev[k]) keep.add(items[k][0]);
    for (const [name] of items) if (!keep.has(name)) this.map.delete(name);
  }

  votesFor(routine) {
    const votes = new Map();
    for (const caller of this.build.users.get(routine.addr) ?? []) {
      const f = this.map.get(caller.name);
      if (f === undefined) continue;
      for (const [offset, target] of caller.calls) {
        if (target !== routine.addr) continue;
        const at = blTarget(this.foreign, f - ROM_BASE + offset, ROM_BASE);
        if (at !== null) votes.set(at, (votes.get(at) ?? 0) + 1);
      }
      for (const [slot, value] of caller.literals) {
        if ((value & ~1) !== routine.addr) continue;
        const at = (u32(this.foreign, f - ROM_BASE + slot) & ~1) >>> 0;
        votes.set(at, (votes.get(at) ?? 0) + 1);
      }
    }
    const hits = this.hits.get(routine.name) ?? [];
    for (const at of [...votes.keys()]) {
      if (!isRom(at) || at % 2 || (hits.length > 0 && hits.length <= HITS_CAP && !hits.includes(at))) votes.delete(at);
    }
    return votes;
  }

  propagate() {
    for (let changed = true; changed;) {
      changed = false;
      for (const routine of this.build.routines) {
        if (this.map.has(routine.name)) continue;
        const users = this.build.users.get(routine.addr);
        if (!users || ![...users].some((u) => this.map.has(u.name))) continue;
        const best = winner(this.votesFor(routine));
        if (best === null) continue;
        this.map.set(routine.name, best);
        changed = true;
      }
    }
  }

  bracket() {
    const mapped = this.build.routines.filter((r) => this.map.has(r.name));
    let added = 0;
    let k = 0;
    for (const routine of this.build.routines) {
      while (k < mapped.length && mapped[k].addr < routine.addr) k += 1;
      const hits = this.hits.get(routine.name) ?? [];
      if (this.map.has(routine.name) || hits.length === 0 || hits.length > HITS_CAP || k === 0 || k >= mapped.length) continue;
      const lo = this.map.get(mapped[k - 1].name);
      const hi = this.map.get(mapped[k].name);
      const inside = hits.filter((at) => at > lo && at < hi);
      if (inside.length === 1) {
        this.map.set(routine.name, inside[0]);
        added += 1;
      }
    }
    return added;
  }

  routine(name) {
    return this.map.get(name) ?? null;
  }

  data(name) {
    const { addr, size } = this.build.symbols.get(name);
    const extent = Math.min(size || 1, 0x2000);
    const votes = new Map();
    for (const routine of this.build.routines) {
      const f = this.map.get(routine.name);
      if (f === undefined) continue;
      const weight = this.exact.has(routine.name) ? 2 : 1;    // others may have moved slots
      for (const [slot, value] of routine.literals) {
        const k = value - addr;
        if (k < 0 || k >= extent) continue;
        const target = u32(this.foreign, f - ROM_BASE + slot) - k;
        if (region(target) !== region(addr)) continue;
        votes.set(target, (votes.get(target) ?? 0) + weight);
      }
    }
    return winner(votes);
  }

  // English address -> foreign address, for the routines placed and the
  // literals of those that matched exactly (same code, so the same slots).
  translation() {
    if (this.known) return this.known;
    const counts = new Map();
    for (const routine of this.build.routines) {
      const f = this.map.get(routine.name);
      if (f === undefined || !this.exact.has(routine.name)) continue;
      for (const [slot, value] of routine.literals) {
        if (!isPointer(value)) continue;
        const pair = `${value} ${u32(this.foreign, f - ROM_BASE + slot)}`;
        counts.set(pair, (counts.get(pair) ?? 0) + 1);
      }
    }
    const best = new Map();
    for (const [pair, count] of counts) {
      const [english, foreign] = pair.split(' ').map(Number);
      if (count > (best.get(english)?.[1] ?? 0)) best.set(english, [foreign, count]);
    }
    this.known = new Map([...best].map(([english, [foreign]]) => [english, foreign]));
    for (const routine of this.build.routines) {
      const f = this.map.get(routine.name);
      if (f === undefined) continue;
      this.known.set(routine.addr, f);
      this.known.set(routine.addr + 1, f + 1);
    }
    return this.known;
  }

  // Routines placed by tables of routine pointers (a battle script command's,
  // say): a table that a routine matched exactly loads holds them in the
  // same order.
  placeFromTables() {
    if (this.tablesPlaced) return;
    this.tablesPlaced = true;
    const known = this.translation();
    const starts = new Map(this.build.routines.map((r) => [r.addr, r]));
    for (const { addr, size } of this.build.symbols.values()) {
      const at = known.get(addr);
      if (!isRom(addr) || !size || size % 4 || size < 8 || size > 0x1000 || at === undefined || !isRom(at)) continue;
      const entries = Array.from({ length: size / 4 }, (_, i) => u32(this.build.rom, addr - ROM_BASE + 4 * i));
      if (!entries.every((entry) => entry & 1 && starts.has(entry - 1))) continue;
      entries.forEach((entry, i) => {
        const routine = starts.get(entry - 1);
        const f = u32(this.foreign, at - ROM_BASE + 4 * i);
        if (this.map.has(routine.name) || !(f & 1) || !isRom(f)) return;
        this.map.set(routine.name, f - 1);
        known.set(routine.addr, f - 1);
        known.set(routine.addr + 1, f);
      });
    }
  }

  // Data `data` can't place: the pools of the routines that load it, lined up
  // with their foreign pools on the values known on both sides (constants are
  // the same), give its slot when the run around it has the same length.
  alignedData(name) {
    const { addr, size } = this.build.symbols.get(name);
    const extent = Math.min(size || 1, 0x2000);
    this.placeFromTables();
    const known = this.translation();
    const same = (value, foreign) => (isPointer(value) ? known.get(value) === foreign : value === foreign);
    const votes = new Map();
    for (const routine of this.build.routines) {
      const f = this.map.get(routine.name);
      if (f === undefined || !routine.literals.some(([, value]) => value - addr >= 0 && value - addr < extent)) continue;
      const english = [...routine.literals].sort((a, b) => a[0] - b[0]).map(([, value]) => value);
      const code = this.foreign.subarray(f - ROM_BASE, f - ROM_BASE + routine.size + (routine.size >> 2) + 16);
      const foreign = analyse(code, f).literals.sort((a, b) => a[0] - b[0]).map(([, value]) => value);
      const pairs = commonRun(english, foreign, same);
      english.forEach((value, i) => {
        const k = value - addr;
        if (k < 0 || k >= extent) return;
        const before = pairs.filter(([e]) => e < i).at(-1) ?? [-1, -1];
        const after = pairs.find(([e]) => e > i) ?? [english.length, foreign.length];
        if (after[0] - before[0] !== after[1] - before[1]) return;
        const target = foreign[before[1] + i - before[0]] - k;
        if (region(target) === region(addr)) votes.set(target, (votes.get(target) ?? 0) + 1);
      });
    }
    return winner(votes);
  }

  // near: [English address, foreign address] of a script found already.
  script(name, near = null) {
    const { addr } = this.build.symbols.get(name);
    const end = Math.min(addr + 64, this.build.nextLabel(addr));
    const code = this.build.rom.subarray(addr - ROM_BASE, end - ROM_BASE);
    const mask = new Uint8Array(code.length).fill(1);
    for (let i = 0; i + 3 < code.length; i += 1) {
      if ((code[i + 3] === 0x08 || code[i + 3] === 0x09) && isPointer(u32(code, i))) mask.fill(0, i, i + 4);
    }
    if (near) {
      const want = near[1] + (addr - near[0]);
      const lo = Math.max(0, want - ROM_BASE - 0x800);
      const window = this.foreign.subarray(lo, want - ROM_BASE + 0x800);
      const hits = findAll(window, code, mask, { step: 1, shortest: 2 }).map((at) => at + lo + ROM_BASE)
        .sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
      if (hits.length && (hits[0] === want || hits.length === 1
        || Math.abs(hits[1] - want) > 2 * Math.abs(hits[0] - want) + 0x40)) return hits[0];
      return null;
    }
    const hits = findAll(this.foreign, code, mask, { step: 1, cap: 400 });
    return hits.length === 1 ? hits[0] + ROM_BASE : null;
  }
}

// The pairs [i, j] of a longest common subsequence of a and b under same(a[i], b[j]).
function commonRun(a, b, same) {
  const n = a.length;
  const m = b.length;
  const longest = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      longest[i][j] = same(a[i], b[j]) ? longest[i + 1][j + 1] + 1 : Math.max(longest[i + 1][j], longest[i][j + 1]);
    }
  }
  const pairs = [];
  for (let i = 0, j = 0; i < n && j < m;) {
    if (same(a[i], b[j]) && longest[i][j] === longest[i + 1][j + 1] + 1) pairs.push([i++, j++]);
    else if (longest[i + 1][j] >= longest[i][j + 1]) i += 1;
    else j += 1;
  }
  return pairs;
}

// The value with the most votes, when nothing comes close to it.
function winner(votes) {
  const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
  if (!ranked.length || (ranked.length > 1 && ranked[1][1] * 2 >= ranked[0][1])) return null;
  return ranked[0][0];
}

// Ports `symbols` (rom-symbols.mjs's SYMBOLS resolved for this game: name ->
// [symbol, offset, kind]) to the foreign ROM. Returns name -> address, and the
// names it could not place.
export function portSymbols(build, foreign, symbols) {
  const port = new Port(build, foreign);
  const out = {};
  const missing = [];
  const pending = [];
  const scripts = [];
  for (const [key, [symbol, offset = 0, kind]] of Object.entries(symbols)) {
    const found = build.symbols.get(symbol);
    if (!found) {
      out[key] = 0;
      continue;
    }
    let address = null;
    if (kind === 'fn' || build.byName.has(symbol)) {
      address = port.routine(symbol);
      if (address !== null && kind === 'fn') address += 1;
    } else if (symbol.startsWith('EventScript_') || (isRom(found.addr) && found.size === null)) {
      address = port.script(symbol);
      if (address === null) {
        pending.push([key, symbol, offset]);
        continue;
      }
      scripts.push([found.addr, address]);
    } else {
      address = port.data(symbol) ?? port.alignedData(symbol);
    }
    if (address === null) missing.push(key);
    else out[key] = address + offset;
  }
  // short scripts, in rounds: each one found anchors the next
  while (pending.length) {
    const left = [];
    for (const [key, symbol, offset] of pending) {
      const { addr } = build.symbols.get(symbol);
      const near = scripts.reduce((best, s) => (!best || Math.abs(s[0] - addr) < Math.abs(best[0] - addr) ? s : best), null);
      const address = port.script(symbol, near);
      if (address === null) {
        left.push([key, symbol, offset]);
      } else {
        out[key] = address + offset;
        scripts.push([addr, address]);
      }
    }
    if (left.length === pending.length) {
      missing.push(...left.map(([key]) => key));
      break;
    }
    pending.splice(0, pending.length, ...left);
  }
  return { symbols: out, missing };
}
