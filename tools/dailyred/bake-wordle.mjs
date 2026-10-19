#!/usr/bin/env node
/**
 * Refresh src/dailyred/team/wordle-answers.js from NYT.
 *
 * With no flags: keeps existing answers, fetches from the day after the last
 * stored date through a short horizon past today, and stops filling once the
 * API has nothing newer (unpublished dates are skipped).
 *
 *   node tools/dailyred/bake-wordle.mjs
 *   node tools/dailyred/bake-wordle.mjs --from YYYY-MM-DD --to YYYY-MM-DD
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../../src/dailyred/team/wordle-answers.js');
const NYT = 'https://www.nytimes.com/svc/wordle/v2';
const CONCURRENCY = 12;
const AHEAD_DAYS = 60; // NYT often publishes a bit ahead; stop naturally on 404s

const { values: opts } = parseArgs({
  options: {
    from: { type: 'string' },
    to: { type: 'string' },
    help: { type: 'boolean', default: false },
  },
  strict: true,
});

if (opts.help) {
  console.log('Usage: node tools/dailyred/bake-wordle.mjs [--from YYYY-MM-DD] [--to YYYY-MM-DD]');
  process.exit(0);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function ymd(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function parseYmd(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(`Bad date: ${s}`);
  const d = new Date(`${s}T00:00:00Z`);
  if (d.toISOString().slice(0, 10) !== s) throw new Error(`Bad date: ${s}`);
  return d;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

function loadExisting() {
  if (!existsSync(OUT)) return {};
  try {
    const text = readFileSync(OUT, 'utf8');
    const m = text.match(/export\s+default\s+(\{[\s\S]*\})\s*;?\s*$/);
    if (!m) return {};
    const parsed = JSON.parse(m[1]);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const existing = loadExisting();
const existingKeys = Object.keys(existing).sort();
const lastExisting = existingKeys.length ? existingKeys[existingKeys.length - 1] : null;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

// Resume after the last stored answer (re-fetch that day in case of corrections).
const from = opts.from
  ? parseYmd(opts.from)
  : (lastExisting ? parseYmd(lastExisting) : addDays(today, -30));
const to = opts.to ? parseYmd(opts.to) : addDays(today, AHEAD_DAYS);

const dates = [];
for (let d = new Date(from); d <= to; d = addDays(d, 1)) dates.push(ymd(d));

console.log(
  lastExisting
    ? `Existing answers through ${lastExisting}; fetching ${dates[0]} … ${dates[dates.length - 1]}`
    : `No existing answers; fetching ${dates[0]} … ${dates[dates.length - 1]}`,
);

const fetched = {};
let i = 0;
let ok = 0;
let fail = 0;

async function worker() {
  while (i < dates.length) {
    const date = dates[i++];
    try {
      const res = await fetch(`${NYT}/${date}.json`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GB-Link-WonderCards/1.0 (bake-wordle.mjs)',
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const word = String(data.solution ?? '').toLowerCase();
      if (data.print_date === date && /^[a-z]{5}$/.test(word)) {
        fetched[date] = word;
        ok += 1;
      } else {
        fail += 1;
      }
    } catch {
      // Unpublished / network — leave gap; existing answers are kept.
      fail += 1;
    }
  }
}

try {
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
} catch (err) {
  console.warn(`Wordle fetch interrupted: ${err.message ?? err}`);
}

const merged = { ...existing, ...fetched };
const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
const keys = Object.keys(sorted);

if (!keys.length) {
  console.error('No Wordle answers available (existing file empty and NYT fetch failed).');
  process.exit(1);
}

writeFileSync(
  OUT,
  `/** Official Wordle solutions by print_date. */\n`
    + `export default ${JSON.stringify(sorted)};\n`,
);
console.log(
  `Wrote ${OUT}: ${keys.length} answers (${keys[0]} … ${keys[keys.length - 1]})`
    + ` — fetched ${ok} ok, ${fail} missing/unavailable`,
);
