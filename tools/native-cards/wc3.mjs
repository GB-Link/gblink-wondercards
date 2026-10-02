// Writes the GB-Link Team cards as .wc3 files for emulators and save editors, a folder per
// language and game: wc3/<language>/<game>/<card>.wc3, from the payloads in
// src/events/custom-wondercards.js. The builder runs it after each build;
// `node tools/native-cards/wc3.mjs` runs it alone.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WC3_GAMES, payloadForGame, wc3FileName, wc3FromPayload } from '../../src/events/wc3.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(HERE, '../../src/events/custom-wondercards.js');
export const WC3_DIR = join(HERE, '../../wc3');

export async function writeWc3Files() {
  // Imported afresh: the builder may just have rewritten it.
  const { CUSTOM_WONDERCARDS } = await import(`${pathToFileURL(EVENTS_FILE)}?${Date.now()}`);
  let count = 0;
  for (const game of WC3_GAMES) {
    const dir = join(WC3_DIR, game.folder);
    mkdirSync(dir, { recursive: true });
    for (const name of readdirSync(dir)) {
      if (name.endsWith('.wc3')) rmSync(join(dir, name));
    }
    for (const card of CUSTOM_WONDERCARDS) {
      const payload = payloadForGame(card.payloads, card.roms, game);
      if (!payload) continue;
      writeFileSync(join(dir, wc3FileName(card.label)), wc3FromPayload(payload, game.japanese));
      count++;
    }
  }
  return count;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`${await writeWc3Files()} .wc3 files in ${WC3_DIR}`);
}
