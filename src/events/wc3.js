// .wc3 files, the Wonder Card files of PKHeX's WC3 plugin and the Mystery Gift Tool: a
// Wonder Card and the RAM script the deliveryman runs, laid out as the games keep them in
// the save, the Japanese games' shorter. The GB-Link Team cards are offered as .wc3 for
// emulators and save editors, and a .wc3 of anyone's can be sent like any card on the page.

import { createEventDescriptor } from './descriptor.js';
import { defaultWonderDistributorIdentity, RFU_SERIAL_WONDER_DISTRIBUTOR } from './rfu-identity.js';
import {
  JAPANESE_WONDER_CARD_BYTES, PAYLOAD_SCRIPT_OFFSET, RAM_SCRIPT_BYTES, WONDER_CARD_BYTES, crc16,
} from '../link/mystery-gift.js';
import { decodeGameText } from '../link/text.js';

// Where a .wc3 keeps the card (after its CRC16), WonderCardMetadata.iconSpecies (which
// the game copies from the card) and the RAM script (its CRC16, then its data).
const LAYOUTS = {
  international: { bytes: 0x58c, card: WONDER_CARD_BYTES, icon: 0x15a, script: 0x1a0, titleLength: 40 },
  japanese: { bytes: 0x4e4, card: JAPANESE_WONDER_CARD_BYTES, icon: 0xb2, script: 0xf8, titleLength: 18 },
};
export const WC3_BYTES = LAYOUTS.international.bytes;
const CARD_AT = 4;
// struct RamScriptData: magic, map group, map number, object, then the script, padded to a
// multiple of four as the games lay it out. Its CRC covers the padding too.
const SCRIPT_DATA_BYTES = 1000;
const RAM_SCRIPT_MAGIC = 51;
const NO_MAP = 0xff;

// The games' ValidateWonderCard limits.
const CARD_TYPE_COUNT = 3;
const SEND_TYPE_COUNT = 3;
const NUM_WONDER_BGS = 8;
const MAX_STAMP_CARD_STAMPS = 7;

const TITLE_AT = 10;

export class Wc3Error extends Error {}

function put16(bytes, at, value) {
  bytes[at] = value & 0xff;
  bytes[at + 1] = value >> 8;
}

// The .wc3 of a payload: a Wonder Card, padding, then its RAM script; for the Japanese
// games in theirs.
export function wc3FromPayload(payload, japanese = false) {
  const layout = japanese ? LAYOUTS.japanese : LAYOUTS.international;
  const file = new Uint8Array(layout.bytes);
  const card = payload.subarray(0, layout.card);
  file.set(card, CARD_AT);
  put16(file, 0, crc16(card));
  file.set(card.subarray(2, 4), layout.icon);
  const script = payload.subarray(PAYLOAD_SCRIPT_OFFSET);
  if (script.length) {
    const data = new Uint8Array(SCRIPT_DATA_BYTES);
    data.set([RAM_SCRIPT_MAGIC, NO_MAP, NO_MAP, NO_MAP]);
    data.set(script.subarray(0, RAM_SCRIPT_BYTES), 4);
    file.set(data, layout.script + 4);
    put16(file, layout.script, crc16(data));
  }
  return file;
}

// The payload a .wc3 holds, as the page sends it, the card's title and whether it is for
// the Japanese games. A file whose card the games would refuse is refused here, with the
// reason.
export function readWc3(bytes) {
  const japanese = bytes.length === LAYOUTS.japanese.bytes;
  const layout = japanese ? LAYOUTS.japanese : LAYOUTS.international;
  if (bytes.length !== layout.bytes) {
    throw new Wc3Error(`This is not a .wc3 file: it has ${bytes.length} bytes, where a .wc3 has ${WC3_BYTES} `
      + `(${LAYOUTS.japanese.bytes} for the Japanese games).`);
  }
  const card = bytes.subarray(CARD_AT, CARD_AT + layout.card);
  const flagId = card[0] | (card[1] << 8);
  const type = card[8] & 3;
  const bgType = (card[8] >> 2) & 0xf;
  const sendType = card[8] >> 6;
  if (!flagId || type >= CARD_TYPE_COUNT || sendType >= SEND_TYPE_COUNT || bgType >= NUM_WONDER_BGS
    || card[9] > MAX_STAMP_CARD_STAMPS) {
    throw new Wc3Error('This .wc3 holds no Wonder Card the games would accept.');
  }
  const data = bytes.subarray(layout.script + 4, layout.script + 4 + SCRIPT_DATA_BYTES);
  let script = new Uint8Array(0);
  if (data[0] === RAM_SCRIPT_MAGIC) {
    script = data.subarray(4, 4 + RAM_SCRIPT_BYTES);
    let end = script.length;
    while (end > 0 && script[end - 1] === 0) end--;
    script = script.subarray(0, end);
  }
  const payload = new Uint8Array(PAYLOAD_SCRIPT_OFFSET + script.length);
  payload.set(card);
  payload.set(script, PAYLOAD_SCRIPT_OFFSET);
  const title = decodeGameText(card.subarray(TITLE_AT, TITLE_AT + layout.titleLength), japanese).replace(/\s+/g, ' ').trim();
  return { payload, title, hasScript: script.length > 0, japanese };
}

// The game a .wc3 is for, going by its file name as Project Pokémon and this page name them
// ("E - …", "FL - …", "… (FireRed 1.1).wc3"), or null.
export function gameOfWc3Name(name) {
  const emerald = /^E\s*-|\bemerald\b/i.test(name);
  const frlg = /^(FL|FRLG|FR|LG)\s*-|\b(fire\s*red|leaf\s*green|frlg)\b/i.test(name);
  if (emerald === frlg) return null;
  return emerald ? 'emerald' : 'frlg';
}

const GAME_NAMES = { emerald: 'Emerald', frlg: 'FireRed and LeafGreen' };

// The event for a .wc3 someone opened on the page: sent to whatever game of its languages
// joins, with the page's usual question when its name says it is for the other game.
export function wc3Event(bytes, fileName) {
  const { payload, title, hasScript, japanese } = readWc3(bytes);
  const identity = defaultWonderDistributorIdentity();
  const game = gameOfWc3Name(fileName);
  const name = fileName.replace(/\.wc3$/i, '');
  const made = game
    ? `Its name says it is for ${GAME_NAMES[game]}.`
    : 'The page cannot tell which game it was made for: send it to that game.';
  const quoted = /^“.*”$/.test(title) ? title : `“${title || 'untitled'}”`;
  return createEventDescriptor({
    id: 'wc3-file',
    label: name,
    description: [
      `Your file ${fileName}: the Wonder Card ${quoted}.`,
      japanese ? 'It is laid out for the Japanese games, and goes only to them.' : '',
      made,
      hasScript ? '' : 'It has no script, so the deliveryman has nothing to hand over.',
    ].filter(Boolean).join(' '),
    serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
    gnameLabel: 'Wonder Card',
    unameLabel: 'DISTRIB',
    gnameBytes: identity.gnameBytes,
    unameBytes: identity.unameBytes,
    payloadBytes: payload,
    japanese,
    game,
  });
}

// The games the GB-Link Team cards are built for, as their .wc3 files are named:
// a folder per language, and in it one per game (and revision, for the English
// and Japanese FireRed and LeafGreen, the only ones with two).
const WC3_LANGUAGES = [['E', 'English'], ['F', 'French'], ['D', 'German'], ['I', 'Italian'], ['S', 'Spanish'], ['J', 'Japanese']];
export const WC3_GAMES = WC3_LANGUAGES.flatMap(([letter, language]) => [
  { game: 'Emerald', rom: `BPE${letter} 1.0`, family: 'emerald' },
  ...(letter === 'E' || letter === 'J'
    ? [['FireRed 1.0', `BPR${letter} 1.0`], ['FireRed 1.1', `BPR${letter} 1.1`], ['LeafGreen 1.0', `BPG${letter} 1.0`],
      ['LeafGreen 1.1', `BPG${letter} 1.1`]]
    : [['FireRed', `BPR${letter} 1.0`], ['LeafGreen', `BPG${letter} 1.0`]]).map(([game, rom]) => ({ game, rom, family: 'frlg' })),
].map((entry) => ({
  ...entry, name: `${entry.game} (${language})`, folder: `${language}/${entry.game}`, japanese: letter === 'J',
})));

// The payload a card sends to one of WC3_GAMES (by ROM, or one for the whole game, which
// is never a Japanese game's), or null.
export function payloadForGame(payloads, roms, game) {
  if (roms && !roms.includes(game.rom)) return null;
  return (payloads[game.rom] ?? (game.japanese ? null : payloads[game.family]))?.[0] ?? null;
}

// A card's label as a file name.
export function wc3FileName(label) {
  return `${label.replace(/\s*:\s*/g, ' - ').replace(/[\\/]/g, '-').replace(/[*?"<>|]/g, '')}.wc3`;
}
