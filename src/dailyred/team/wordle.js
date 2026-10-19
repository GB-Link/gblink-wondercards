/** Wordle + daily seed (dailyred-improved). */
import ANSWERS from './wordle-answers.js';

export function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const dt = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(dt.getTime()) && dt.toISOString().slice(0, 10) === date;
}

/** Local calendar date (day boundary). */
export function today(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Official Wordle answer for a calendar date (embedded table). */
export function forDate(date) {
  if (!isValidDate(date)) throw new Error(`Invalid Wordle date: ${date}`);
  const word = String(ANSWERS[date] ?? '').toLowerCase();
  if (!/^[a-z]{5}$/.test(word)) {
    throw new Error(`No embedded Wordle answer for ${date}.`);
  }
  return word;
}

/** FNV-1a of "dailyred:YYYY-MM-DD", never 0. */
export function seedFromDate(date) {
  let hash = 0x811c9dc5;
  const s = `dailyred:${date}`;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash || 1;
}
