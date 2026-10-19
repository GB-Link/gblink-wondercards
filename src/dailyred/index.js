/**
 * Daily Red — client-side Wonder Card payload generator.
 *
 * Team / seed / Wordle: dailyred-improved. ROM symbols: pret pokefirered / pokeemerald.
 */
import species from './data/species.json' with { type: 'json' };
import baseStats from './data/base_stats.json' with { type: 'json' };
import learnsets from './data/level_up_moves.json' with { type: 'json' };
import moves from './data/moves.json' with { type: 'json' };
import types from './data/species_types.json' with { type: 'json' };
import { buildCard, buildPayload, encodeWc3, payloadsArray } from './card/wonder-card.js';
import { build as buildScript } from './rom/script-builder.js';
import { forRom, ROMS } from './rom/symbols.js';
import { buildThumb, packMonTable } from './rom/thumb.js';
import { BuildMon } from './team/build-mon.js';
import { party as bossParty } from './team/boss-red.js';
import { SelectDailyTeam } from './team/select-daily-team.js';
import * as Wordle from './team/wordle.js';

const CARD_ICON_SPECIES = 25; // Pikachu — RED's lead
const DATA = { species, baseStats, learnsets, moves, types };

function wc3Name(romId) {
  return `dailyred-${romId.replaceAll(' ', '-')}.wc3`;
}

/**
 * @param {{ date?: string, word?: string, seed?: number, log?: boolean }} [opts]
 * @returns {{
 *   date: string, word: string, seed: number, team: object,
 *   payloads: { rom: string, payload: string }[],
 *   variants: Record<string, Uint8Array[]>,
 *   files: { rom: string, name: string, wc3: Uint8Array }[],
 * }}
 */
export function generateDailyRed(opts = {}) {
  const log = opts.log === true;
  const date = opts.date ?? Wordle.today();
  if (!Wordle.isValidDate(date) && opts.seed === undefined) {
    throw new Error('Invalid date (want YYYY-MM-DD).');
  }

  const seed = opts.seed !== undefined
    ? (Number(opts.seed) || 1)
    : Wordle.seedFromDate(date);

  let word = opts.word?.toLowerCase();
  if (word !== undefined) {
    if (!/^[a-z]{5}$/.test(word)) throw new Error('Word must be 5 lowercase letters.');
  } else {
    word = Wordle.forDate(date);
  }

  if (log) console.log(`[dailyred] date=${date} word=${word} seed=${seed >>> 0}`);

  const team = new SelectDailyTeam(DATA.species).select(word, seed);
  const speciesIds = team.species.map((s) => s.id);
  const player = new BuildMon(DATA).buildParty(speciesIds, seed);
  const enemy = bossParty();
  const monTable = packMonTable(player, enemy);

  if (log) {
    console.log('[dailyred] Team:', team.species.map((s) => s.name).join(', '));
  }

  const card = buildCard({
    flagId: 2100,
    iconSpecies: CARD_ICON_SPECIES,
    title: 'DAILY RED',
    subtitle: '',
    body: [
      'Talk to the deliveryman',
      'in any POKeMON CENTER.',
      'Your party is restored',
      'after the battle.',
    ],
    footer: ['GB-Link Daily Red', date],
  });
  const intro = `Daily Red!\n${date}`;
  const outro = 'Thanks for battling!';
  const wrong = 'Wrong game version';

  const entries = [];
  const files = [];
  const variants = {};
  for (const romId of ROMS) {
    const thumb = buildThumb(romId, monTable);
    const script = buildScript(forRom(romId), thumb, intro, outro, wrong);
    const payload = buildPayload(card, script);
    const wc3 = encodeWc3(card, script);
    entries.push({ rom: romId, payload });
    files.push({ rom: romId, name: wc3Name(romId), wc3 });
    variants[romId] = [payload];
    if (log) {
      console.log(`[dailyred] ${romId}  thumb=${thumb.length} script=${script.length} wc3=${wc3.length}`);
    }
  }

  return {
    date,
    word,
    seed,
    team,
    payloads: payloadsArray(entries),
    variants,
    files,
  };
}

export { ROMS, Wordle };
