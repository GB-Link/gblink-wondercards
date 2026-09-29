#!/usr/bin/env node
// Builds the GB-Link Team cards and writes their payloads, one per game, into
// src/events/custom-wondercards.js. Needs the arm-none-eabi binutils on PATH.
//
//   node tools/native-cards/build.mjs
//
// Each RAM script checks the ROM header first; on any other ROM the
// deliveryman says the gift doesn't work. The speed cards and the Master Ball
// keep their Wonder Card bytes apart from the footer (and the speed cards'
// subtitle), and the Master Ball keeps its script.
//
// A card's code sits after its texts and is called through trampoline.s.
// Cards that open a menu or a scene first move their script to RELOCATED,
// because the game moves the RAM script when it returns to the overworld.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROMS } from './roms.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(HERE, '../../src/events/custom-wondercards.js');

const WONDER_CARD_BYTES = 332;
const PAYLOAD_SCRIPT_OFFSET = 336;
const RAM_SCRIPT_BYTES = 995;
const VIRTUAL_BASE = 0x08000000;
// gDecompressionBuffer, unused while a field script runs.
const TEXT_BUFFER = 0x0201c000;
// Free RAM in both games, past their own data (relocate.inc).
const RELOCATED = 0x0203fc00;
// The 80 free bytes below it, for the multichoice box's items (menu.inc).
const MENU_LIST = 0x0203fbb0;
// The script context's data registers, which hold the trampoline.
const CONTEXT_DATA = 0x64;
const ROM_GAME = 0x080000ae;        // the third letter of the game code: E, R or G
const ROM_LANGUAGE = 0x080000af;
const ROM_REVISION = 0x080000bc;
const VAR_0x8004 = 0x8004;
const VAR_0x8005 = 0x8005;
const VAR_0x8006 = 0x8006;
const VAR_RESULT = 0x800d;
// VAR_RESULT after B in a multichoice box.
const MENU_B = 127;
// vgoto_if after checkflag: EQ when the flag is set, LT when not.
const UNSET = 0;
const ITEM_LANSAT_BERRY = 173;
const ITEM_STARF_BERRY = 174;
const ITEM_ENIGMA_BERRY = 175;
const ITEM_RARE_CANDY = 68;
const ITEM_COIN_CASE = 260;
const PARTY_SIZE = 6;
const SPECIES_EGG = 412;
const SPECIES_UNOWN = 201;
const MAX_MON_MOVES = 4;
const FADE_FROM_BLACK = 0;
const FADE_TO_BLACK = 1;
const FADE_FROM_WHITE = 2;
const FADE_TO_WHITE = 3;
// The state of the V-blank hooks (shiny.s, roamer.s, fly.s, tm.s, feebas.s, split.s),
// first byte 1 while on; the shiny hook keeps at SHINY_NAME the name of the
// Pokémon met in a row.
const HOOK_STATE = 0x0203ff60;
const SHINY_NAME = HOOK_STATE + 12;

// first..last, both included.
const range = (first, last) => Array.from({ length: last - first + 1 }, (_, i) => first + i);

// What FireRed/LeafGreen and Emerald each keep the same across their ROMs:
// offsets in SaveBlock1 and the numbers of the game's specials.
const FAMILIES = {
  frlg: {
    scriptInSaveBlock1: 0x3624,
    symbols: { DAYCARE: 0x2f80, GIFT_RIBBONS: 0x309c },
    specials: {
      choosePartyMon: 0x9f, eggHatch: 0xc2, changePokemonNickname: 0x9e, getPartyMonSpecies: 0x147,
      enableNationalPokedex: 0x16f, chooseMonForMoveRelearner: 0xdb, teachMoveRelearnerMove: 0xe0,
      isSelectedMonEgg: 0x148, getNumMovesSelectedMonHas: 0xdf, chooseMoveToForget: 0xdc, moveDeleterForgetMove: 0xdd,
      bufferMoveDeleterNicknameAndMove: 0xde,
    },
    flags: {
      pokedex: 0x829, nationalDex: 0x840, ribbons: 0x83b, mysteryGiftDone: 0x3d8, pendingDaycareEgg: 0x266,
      // FLAG_TUTOR_DOUBLE_EDGE to FLAG_TUTOR_BODY_SLAM, then the three ultimate moves
      tutors: [...range(0x2c0, 0x2ce), ...range(0x2de, 0x2e0)],
    },
    vars: { repelSteps: 0x4020 },
    songs: { giftMon: 257 },            // MUS_LEVEL_UP, which FireRed/LeafGreen play for a gift Pokémon
  },
  emerald: {
    scriptInSaveBlock1: 0x3730,
    symbols: { DAYCARE: 0x3030, GIFT_RIBBONS: 0x31a8 },
    specials: {
      choosePartyMon: 0xa2, eggHatch: 0xc5, changePokemonNickname: 0xa1, getPartyMonSpecies: 0x149,
      enableNationalPokedex: 0x1f3, chooseMonForMoveRelearner: 0xde, teachMoveRelearnerMove: 0xe3,
      isSelectedMonEgg: 0x14a, getNumMovesSelectedMonHas: 0xe2, chooseMoveToForget: 0xdf, moveDeleterForgetMove: 0xe0,
      bufferMoveDeleterNicknameAndMove: 0xe1, isLastMonThatKnowsSurf: 0x209, giveFrontierBattlePoints: 0x1ca,
    },
    flags: {
      pokedex: 0x861, nationalDex: 0x896, ribbons: 0x89b, mysteryGiftDone: 0x1e4, pendingDaycareEgg: 0x86,
      tutors: range(0x1b1, 0x1ba),      // FLAG_MOVE_TUTOR_TAUGHT_SWAGGER to _EXPLOSION
    },
    vars: { mirageHigh: 0x4024, repelSteps: 0x4021 },
    songs: { giftMon: 370 },            // MUS_OBTAIN_ITEM, which Emerald plays for one
  },
};

// A card's view of one ROM: its family's constants and the ROM's addresses.
function gameOf(romId) {
  const rom = ROMS[romId];
  const family = FAMILIES[rom.family];
  return { ...family, ...rom, id: romId, symbols: { ...rom.symbols, ...family.symbols } };
}

// The ROM header must name exactly this ROM: game letter, English, revision.
const romCheck = (game, wrong) => [
  compareAddrToValue(ROM_GAME, game.game), vgotoIf(NE, wrong),
  compareAddrToValue(ROM_LANGUAGE, 'E'), vgotoIf(NE, wrong),
  compareAddrToValue(ROM_REVISION, game.revision), vgotoIf(NE, wrong),
];

const WRONG_ROM_MESSAGE = 'This gift doesn’t work with\nthis version of the game.';

// ---- script commands (same opcodes in both games)
const EQ = 1;
const GT = 2;
const GE = 4;
const NE = 5;

function u16(value) {
  return [value & 0xff, (value >>> 8) & 0xff];
}

function u32(value) {
  return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
}

const end = () => [0x02];
const loadword = (index, value) => [0x0f, index, ...u32(value)];
const writebytetoaddr = (value, address) => [0x11, value, ...u32(address)];
const setvar = (variable, value) => [0x16, ...u16(variable), ...u16(value)];
const addvar = (variable, value) => [0x17, ...u16(variable), ...u16(value)];
const setflag = (flag) => [0x29, ...u16(flag)];
const clearflag = (flag) => [0x2a, ...u16(flag)];
const checkflag = (flag) => [0x2b, ...u16(flag)];
const additem = (item, quantity = 1) => [0x44, ...u16(item), ...u16(quantity)];
const checkitemspace = (item, quantity = 1) => [0x46, ...u16(item), ...u16(quantity)];
const compareAddrToValue = (address, value) => [0x1f, ...u32(address),
  typeof value === 'string' ? value.charCodeAt(0) : value];
const copyvar = (to, from) => [0x19, ...u16(to), ...u16(from)];
const copybyte = (to, from) => [0x15, ...u32(to), ...u32(from)];
const compareVarToValue = (variable, value) => [0x21, ...u16(variable), ...u16(value)];
const callnative = (address) => [0x23, ...u32(address)];
const special = (id) => [0x25, ...u16(id)];
const specialvar = (variable, id) => [0x26, ...u16(variable), ...u16(id)];
const waitstate = () => [0x27];
const delay = (frames) => [0x28, ...u16(frames)];
const faceplayer = () => [0x5a];
const waitmessage = () => [0x66];
const message = (address) => [0x67, ...u32(address)];
const closemessage = () => [0x68];
const lock = () => [0x6a];
const getpartysize = () => [0x43];
const bufferspeciesname = (index, variable) => [0x7d, index, ...u16(variable)];
const bufferpartymonnick = (index, variable) => [0x7f, index, ...u16(variable)];
const buffernumberstring = (index, variable) => [0x83, index, ...u16(variable)];
const bufferstring = (index, address) => [0x85, index, ...u32(address)];
const release = () => [0x6c];
const waitbuttonpress = () => [0x6d];
const yesnobox = () => [0x6e, 20, 8];
const fadescreen = (mode) => [0x97, mode];
const setvaddress = (address) => [0xb8, ...u32(address)];
const vgoto = (label) => [0xb9, { label }];
const vgotoIf = (condition, label) => [0xbb, condition, { label }];
const vmessage = (label) => [0xbd, { label }];
const giveegg = (variable) => [0x7a, ...u16(variable)];
const addmoney = (amount) => [0x90, ...u32(amount), 0];
const checkitem = (item, quantity = 1) => [0x47, ...u16(item), ...u16(quantity)];
const addcoins = (coins) => [0xb4, ...u16(coins)];
const playfanfare = (song) => [0x31, ...u16(song)];
const waitfanfare = () => [0x32];
const say = (label) => [...vmessage(label), ...waitmessage(), ...waitbuttonpress(), ...closemessage(),
  ...release(), ...end()];
// Calls a routine in the card's code.
const native = (routine) => [{ native: routine }];
// Moves the script to RELOCATED; setvaddress then points the relative
// addresses at the copy.
const relocate = () => [...native('relocate'), { define: 'relocated' }, 0xb8, { label: 'relocated' }];

// Text characters; ¶ starts a new box.
const CHARSET = new Map([
  [' ', 0x00], ['&', 0x2d], ['é', 0x1b], ['!', 0xab], ['?', 0xac], ['.', 0xad], ['-', 0xae], ['…', 0xb0], ['’', 0xb4],
  ["'", 0xb4], [',', 0xb8], ['×', 0xb9], ['¥', 0xb7], ['/', 0xba], [':', 0xf0], ['¶', 0xfb], ['\n', 0xfe],
]);
for (let i = 0; i < 10; i++) CHARSET.set(String(i), 0xa1 + i);
for (let i = 0; i < 26; i++) {
  CHARSET.set(String.fromCharCode(65 + i), 0xbb + i);
  CHARSET.set(String.fromCharCode(97 + i), 0xd5 + i);
}

// The game's own placeholders, filled in when a message is shown.
const PLACEHOLDERS = {
  PLAYER: [0xfd, 0x01], STR_VAR_1: [0xfd, 0x02], STR_VAR_2: [0xfd, 0x03], STR_VAR_3: [0xfd, 0x04],
  RIVAL: [0xfd, 0x06],
};

// {name} is replaced with tokens[name].
function encodeText(text, tokens = PLACEHOLDERS) {
  const out = [];
  for (const part of text.split(/(\{\w+\})/)) {
    const token = /^\{(\w+)\}$/.exec(part);
    if (token) {
      if (!(token[1] in tokens)) throw new Error(`no token ${part}`);
      out.push(...tokens[token[1]]);
      continue;
    }
    for (const c of part) {
      if (!CHARSET.has(c)) throw new Error(`no game character for ${JSON.stringify(c)}`);
      out.push(CHARSET.get(c));
    }
  }
  return [...out, 0xff];
}

const textItems = (texts = {}) => Object.entries(texts).flatMap(([label, text]) => [{ define: label }, ...encodeText(text)]);

// ---- the cards
const FOOTER = ['GB-Link Team', ''];

const SPEEDS = {
  '0-5': { TEXT_EXTRA: 0, OW_EXTRA: 0, BATTLE_EXTRA: 0, SLOW_PERIOD: 2,
    message: 'Press R to play at half speed!\nPress R again to play normally.' },
  '0-75': { TEXT_EXTRA: 0, OW_EXTRA: 0, BATTLE_EXTRA: 0, SLOW_PERIOD: 4,
    message: 'Press R to play a little slower!\nPress R again to play normally.' },
  2: { TEXT_EXTRA: 1, OW_EXTRA: 1, BATTLE_EXTRA: 1, SLOW_PERIOD: 0,
    message: 'Press R for double speed!\nPress R again to play normally.' },
  3: { TEXT_EXTRA: 2, OW_EXTRA: 2, BATTLE_EXTRA: 2, SLOW_PERIOD: 0,
    message: 'Press R for triple speed!\nPress R again to play normally.' },
  4: { TEXT_EXTRA: 4, OW_EXTRA: 3, BATTLE_EXTRA: 3, SLOW_PERIOD: 0,
    message: 'Press R to speed the game up!\nPress R again to play normally.' },
};
// In place of the original cards' "Hold the R Button!".
const SPEED_SUBTITLE = 'R turns it on and off!';

// Installs the speed hook and explains it.
const speedScript = (text) => ({
  body: [...native('install'), ...say('message_text')],
  texts: { message_text: text },
});

// Asks first, then runs the card's code.
const askingScript = ({ entry, ask, done, declined, flash = false }) => ({
  body: [
    ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
    ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
    ...(flash ? [...closemessage(), ...fadescreen(FADE_TO_WHITE)] : []),
    ...native(entry),
    ...(flash ? fadescreen(FADE_FROM_WHITE) : []),
    ...say('done_text'),
    { define: 'declined' },
    ...say('declined_text'),
  ],
  texts: { ask_text: ask, done_text: done, declined_text: declined },
});

// Asks for a party Pokémon and, when one is chosen (its name in STR_VAR_1),
// carries on with `steps`, which end the script or go to `done` to close it.
// With an `egg` text, an Egg gets that instead.
const partyMonScript = (game, { which, egg, steps, texts }) => ({
  body: [
    ...vmessage('which_text'), ...waitmessage(), ...waitbuttonpress(),
    ...relocate(),
    ...special(game.specials.choosePartyMon), ...waitstate(),
    ...compareVarToValue(VAR_0x8004, PARTY_SIZE), ...vgotoIf(GE, 'done'),
    ...(egg ? [
      ...specialvar(VAR_RESULT, game.specials.getPartyMonSpecies),
      ...compareVarToValue(VAR_RESULT, SPECIES_EGG), ...vgotoIf(EQ, 'egg'),
    ] : []),
    ...bufferpartymonnick(0, VAR_0x8004),
    ...steps,
    ...(egg ? [{ define: 'egg' }, ...say('egg_text')] : []),
    { define: 'done' },
    ...closemessage(), ...release(), ...end(),
  ],
  texts: { which_text: which, ...(egg && { egg_text: egg }), ...texts },
});

// Placeholders filled in by judge.s: FD 00 nickname, FD 01 nature, FD 10+n
// value n (FD 1C is the EV total), FD 30 and FD 31 the IV and EV lines.
const JUDGE_TOKENS = {
  name: [0xfd, 0x00], nature: [0xfd, 0x01],
  hp: [0xfd, 0x10], attack: [0xfd, 0x11], defense: [0xfd, 0x12],
  speed: [0xfd, 0x13], sp_atk: [0xfd, 0x14], sp_def: [0xfd, 0x15],
  ev_total: [0xfd, 0x1c], ivs: [0xfd, 0x30], evs: [0xfd, 0x31],
};

// An event Pokémon card (eventmon.s): once per card, into the party or the PC.
// `choose` (offerMon) asks which Pokémon first, whose name is then shown.
const MON_GIVEN_TO_PC = 1;
const MON_CANT_GIVE = 2;
const eventMonScript = (game, name, { choose = [], texts = {} } = {}) => ({
  body: [
    ...checkflag(game.flags.mysteryGiftDone), ...vgotoIf(EQ, 'already'),
    ...choose,
    ...getpartysize(),
    ...native('give_mon'),
    ...compareVarToValue(VAR_RESULT, MON_CANT_GIVE), ...vgotoIf(EQ, 'full'),
    ...setflag(game.flags.mysteryGiftDone),
    ...playfanfare(game.songs.giftMon), ...vmessage('received_text'), ...waitmessage(), ...waitfanfare(),
    ...waitbuttonpress(),
    ...compareVarToValue(VAR_RESULT, MON_GIVEN_TO_PC), ...vgotoIf(EQ, 'pc'),
    ...closemessage(), ...release(), ...end(),
    { define: 'pc' },
    ...say('pc_text'),
    { define: 'already' },
    ...say('already_text'),
    { define: 'full' },
    ...say('full_text'),
    ...(choose.length ? [{ define: 'declined' }, ...say('declined_text')] : []),
  ],
  texts: {
    received_text: `{PLAYER} received ${name ?? '{STR_VAR_1}'}!`,
    pc_text: 'It was sent to the PC.',
    already_text: `Receive the card again for\nanother ${name ?? 'one'}!`,
    full_text: 'Your party and the PC are full!',
    ...(choose.length && { declined_text: 'Come back any time!' }),
    ...texts,
  },
});

const VISIT = ['Visit the deliveryman on 2F', 'of a POKéMON CENTER.'];

// Offers the card's Pokémon in turn (offer), their names in STR_VAR_1, until
// one is taken: VAR_0x8004.
const offerMon = [
  ...setvar(VAR_0x8004, 0),
  { define: 'offer' },
  ...native('offer'),
  ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
  ...bufferspeciesname(0, VAR_0x8006),
  ...vmessage('offer_text'), ...waitmessage(), ...yesnobox(),
  ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'chosen'),
  ...addvar(VAR_0x8004, 1),
  ...vgoto('offer'),
  { define: 'chosen' },
];

const CARDS = [
  ...Object.entries(SPEEDS).map(([speedId, { message, ...symbols }]) => ({
    id: `custom-speed-${speedId}`,
    source: 'speed.s',
    symbols: { ...symbols, TOGGLE: 1 },
    subtitle: SPEED_SUBTITLE,
    script: speedScript(message),
  })),
  {
    id: 'custom-gender-swap',
    source: 'gender.s',
    card: {
      flagId: 1013, idNumber: 13, iconSpecies: 132, bgType: 2,
      title: 'NEW TRAINER NAME/GENDER',
      subtitle: 'A new name, a new look!',
      body: ['New name? New look? Visit the', 'deliveryman on the 2nd floor', 'of a POKéMON CENTER to rename', 'or swap between BOY and GIRL.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...vmessage('name_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'gender'),
        ...relocate(),
        ...closemessage(), ...fadescreen(FADE_TO_BLACK),
        ...native('rename'), ...waitstate(),
        ...native('update_ot'),
        ...vmessage('named_text'), ...waitmessage(), ...waitbuttonpress(),
        { define: 'gender' },
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...closemessage(), ...fadescreen(FADE_TO_WHITE),
        ...native('swap'),
        ...fadescreen(FADE_FROM_WHITE),
        ...say('done_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        name_text: 'Would you like a new name?',
        named_text: 'Nice to meet you, {PLAYER}!',
        ask_text: 'Shall I swap you between\nBOY and GIRL?',
        done_text: 'Ta-da! Talk to me again any\ntime to swap back.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-pokerus',
    source: 'pokerus.s',
    card: {
      flagId: 1014, idNumber: 14, iconSpecies: 113, bgType: 5,
      title: 'POKéRUS',
      subtitle: 'Achoo!',
      body: ['A tiny virus that helps', 'POKéMON grow stronger. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: askingScript({
      entry: 'infect',
      ask: 'POKéRUS is a tiny virus that\nhelps POKéMON grow stronger.¶Want your party POKéMON\nto catch it?',
      done: 'Achoo! Your party POKéMON\ncaught POKéRUS!',
      declined: 'Stay healthy out there!',
    }),
  },
  {
    id: 'custom-instant-eggs',
    source: 'eggs.s',
    card: {
      flagId: 1016, idNumber: 16, iconSpecies: 412, bgType: 1,
      title: 'INSTANT EGGS',
      subtitle: 'Hatch now, or get one now',
      body: ['Hatch the EGGS you carry, or', 'get the DAY CARE’s EGG right', 'away. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // Each Egg hatches with the game's own scene. The delay lets the overworld
    // fade back in before the next one.
    script: (game) => ({
      body: [
        ...native('prepare'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'daycare'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'daycare'),
        ...closemessage(),
        ...relocate(),
        { define: 'next' },
        ...native('next_egg'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'hatched'),
        ...special(game.specials.eggHatch), ...waitstate(),
        ...delay(16),
        ...vgoto('next'),
        { define: 'hatched' },
        ...say('hatched_text'),
        { define: 'daycare' },
        ...vmessage('daycare_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...checkflag(game.flags.pendingDaycareEgg), ...vgotoIf(EQ, 'waiting'),
        ...native('daycare_egg'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'no_pair'),
        ...say('ready_text'),
        { define: 'waiting' },
        ...say('waiting_text'),
        { define: 'no_pair' },
        ...say('no_pair_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'You have EGGS with you!\nShall I hatch them right now?',
        hatched_text: 'Take good care of them!',
        daycare_text: 'Shall I have the DAY CARE’s\nEGG ready for you right away?',
        ready_text: 'The DAY CARE has an EGG\nready for you now!',
        waiting_text: 'The DAY CARE already has an\nEGG waiting for you!',
        no_pair_text: 'Leave two POKéMON that get\nalong at the DAY CARE first!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-friendship',
    source: 'friendship.s',
    card: {
      flagId: 1017, idNumber: 17, iconSpecies: 172, bgType: 4,
      title: 'FRIENDSHIP CHECKER',
      subtitle: 'How close are you?',
      body: ['See how friendly a POKéMON is,', 'then make it or your party as', 'friendly as can be. Visit the', 'deliveryman on 2F of a CENTER.'],
      footer: FOOTER,
    },
    data: { max_items: 'THIS POKéMON', max_party: 'WHOLE PARTY', max_no: 'NO THANKS' },
    script: (game) => partyMonScript(game, {
      which: 'Whose friendship should I\ncheck?',
      egg: 'An EGG hasn’t made friends yet!',
      steps: [
        ...native('check'), ...buffernumberstring(1, VAR_0x8005),
        ...vmessage('value_text'), ...waitmessage(), ...waitbuttonpress(),
        ...vmessage('ask_text'), ...waitmessage(),
        ...native('max_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, 2), ...vgotoIf(GE, 'declined'),
        ...native('befriend'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(NE, 'party'),
        ...say('one_text'),
        { define: 'party' },
        ...say('party_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        value_text: '{STR_VAR_1}’s friendship is\n{STR_VAR_2} out of 255.',
        ask_text: 'Shall I make it as friendly\nas can be?',
        one_text: '{STR_VAR_1} adores you now!',
        party_text: 'Your whole party adores you\nnow!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-stat-judge',
    source: 'judge.s',
    card: {
      flagId: 1019, idNumber: 19, iconSpecies: 178, bgType: 6,
      title: 'IV/EV STAT JUDGE',
      subtitle: 'IVs, EVs and nature',
      body: ['Curious about your POKéMON?', 'The deliveryman on the 2nd', 'floor of a POKéMON CENTER can', 'show its IVs, EVs and nature.'],
      footer: FOOTER,
    },
    data: {
      template: '{name}’s nature is {nature}.\nHere are its IVs, out of 31:¶{ivs}¶Its EVs add up to {ev_total} of 510:¶{evs}',
      stat_lines: 'HP {hp}, ATTACK {attack}, DEFENSE {defense}\nSP. ATK {sp_atk}, SP. DEF {sp_def}, SPEED {speed}',
    },
    tokens: JUDGE_TOKENS,
    // The party menu leaves the chosen slot in VAR_0x8004, or PARTY_SIZE + 1
    // when cancelled.
    script: (game) => ({
      body: [
        ...vmessage('ask_text'), ...waitmessage(), ...waitbuttonpress(),
        ...relocate(),
        ...special(game.specials.choosePartyMon), ...waitstate(),
        ...compareVarToValue(VAR_0x8004, PARTY_SIZE), ...vgotoIf(GE, 'done'),
        ...native('judge'),
        ...message(TEXT_BUFFER), ...waitmessage(), ...waitbuttonpress(), ...closemessage(),
        { define: 'done' },
        ...release(), ...end(),
      ],
      texts: { ask_text: 'Which POKéMON should I judge?' },
    }),
  },
  {
    id: 'custom-no-encounters',
    source: 'encounters.s',
    card: {
      flagId: 1020, idNumber: 20, iconSpecies: 41, bgType: 7,
      title: 'NO ENCOUNTERS & REPEL',
      subtitle: 'Wild POKéMON, stay away!',
      body: ['Keep all wild POKéMON away,', 'or only the weaker ones. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    data: { choice_items: 'ALL OF THEM', choice_weaker: 'WEAKER ONES', choice_none: 'NONE' },
    // sWildEncountersDisabled, which the game only clears at boot and after
    // FireRed/LeafGreen's recap on Continue; and a REPEL's step count.
    script: (game) => ({
      body: [
        ...vmessage('ask_text'), ...waitmessage(),
        ...native('choice_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'weaker'),
        ...compareVarToValue(VAR_RESULT, 2), ...vgotoIf(EQ, 'none'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(NE, 'declined'),
        ...writebytetoaddr(1, game.symbols.WILD_ENCOUNTERS_DISABLED),
        ...say('all_text'),
        { define: 'weaker' },
        ...writebytetoaddr(0, game.symbols.WILD_ENCOUNTERS_DISABLED),
        ...setvar(game.vars.repelSteps, 0xffff),
        ...say('weaker_text'),
        { define: 'none' },
        ...writebytetoaddr(0, game.symbols.WILD_ENCOUNTERS_DISABLED),
        ...setvar(game.vars.repelSteps, 0),
        ...say('none_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Which wild POKéMON should\nstay away?',
        all_text: 'None will appear until you\nturn off your game.',
        weaker_text: 'Like a REPEL that lasts\n65,535 steps!',
        none_text: 'Wild POKéMON are back to\nnormal!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-nickname',
    source: 'nickname.s',
    card: {
      flagId: 1021, idNumber: 21, iconSpecies: 201, bgType: 3,
      title: 'NICKNAME CHANGE',
      subtitle: 'A new name, or none at all',
      body: ['Give a POKéMON a new nickname', 'or its species name back. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => ({
      body: [
        ...vmessage('which_text'), ...waitmessage(), ...waitbuttonpress(),
        ...relocate(),
        ...special(game.specials.choosePartyMon), ...waitstate(),
        ...compareVarToValue(VAR_0x8004, PARTY_SIZE), ...vgotoIf(GE, 'done'),
        ...specialvar(VAR_RESULT, game.specials.getPartyMonSpecies),
        ...compareVarToValue(VAR_RESULT, SPECIES_EGG), ...vgotoIf(EQ, 'egg'),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...vmessage('rename_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'rename'),
        ...native('nicknamed'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...vmessage('remove_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('unname'),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...say('removed_text'),
        { define: 'rename' },
        ...closemessage(), ...fadescreen(FADE_TO_BLACK),
        ...special(game.specials.changePokemonNickname), ...waitstate(),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...say('renamed_text'),
        { define: 'egg' },
        ...say('egg_text'),
        { define: 'declined' },
        ...say('declined_text'),
        { define: 'done' },
        ...release(), ...end(),
      ],
      texts: {
        which_text: 'Whose nickname shall I change?',
        rename_text: 'Give {STR_VAR_1} a new nickname?',
        remove_text: 'Should {STR_VAR_1} go back to\nits species name instead?',
        removed_text: 'Done! It’s {STR_VAR_1} again.',
        renamed_text: 'From now on, it’s {STR_VAR_1}!',
        egg_text: 'An EGG doesn’t have a name yet!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-shiny-hunting',
    source: 'shiny.s',
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1022, idNumber: 22, iconSpecies: 130, bgType: 0,
      title: 'SHINY HUNTING',
      subtitle: 'Shiny POKéMON, more often',
      body: ['Meet shiny POKéMON more often,', 'more still in a row. Visit the', 'deliveryman on the 2nd floor', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // `report` puts the chain in VAR_0x8005 and the next odds in VAR_0x8006.
    script: {
      body: [
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'active'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'active' },
        ...native('report'),
        ...buffernumberstring(1, VAR_0x8006),
        ...compareVarToValue(VAR_0x8005, 0), ...vgotoIf(EQ, 'keep'),
        ...bufferstring(0, SHINY_NAME), ...buffernumberstring(2, VAR_0x8005),
        ...vmessage('chain_text'), ...waitmessage(), ...waitbuttonpress(),
        { define: 'keep' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...writebytetoaddr(0, HOOK_STATE),
        ...say('off_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Want shiny POKéMON more often?',
        on_text: 'Done! Same POKéMON in a row,\nbetter odds!',
        chain_text: '{STR_VAR_1} in a row: {STR_VAR_3}!',
        keep_text: 'Shiny odds: 1 in {STR_VAR_2}.\nKeep hunting?',
        off_text: 'Shiny hunting is off.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-nature-mint',
    source: 'nature.s',
    card: {
      flagId: 1023, idNumber: 23, iconSpecies: 43, bgType: 3,
      title: 'NATURE MINT',
      subtitle: 'A fresh new nature',
      body: ['Pick the stat a POKéMON’s', 'nature raises and the one it', 'lowers. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // The first choice waits in VAR_0x8005 while the second is made.
    script: (game) => partyMonScript(game, {
      which: 'Whose nature should I change?',
      steps: [
        ...vmessage('raise_text'), ...waitmessage(),
        ...native('stat_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'done'),
        ...copyvar(VAR_0x8005, VAR_RESULT),
        ...vmessage('lower_text'), ...waitmessage(),
        ...native('stat_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'done'),
        ...native('change_nature'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'failed'),
        ...say('changed_text'),
        { define: 'failed' },
        ...say('failed_text'),
      ],
      texts: {
        raise_text: 'Which stat should it raise?',
        lower_text: 'And which should it lower?',
        changed_text: '{STR_VAR_1} is {STR_VAR_2} now!',
        failed_text: 'That didn’t work, sorry!',
      },
    }),
  },
  {
    id: 'custom-ability-capsule',
    source: 'ability.s',
    card: {
      flagId: 1024, idNumber: 24, iconSpecies: 233, bgType: 6,
      title: 'ABILITY CAPSULE',
      subtitle: 'Try its other ability',
      body: ['Switch a POKéMON to the other', 'ability its species can have.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Whose ability should I switch?',
      egg: 'An EGG can’t switch abilities!',
      steps: [
        ...native('switch_ability'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'one'),
        ...say('done_text'),
        { define: 'one' },
        ...say('one_text'),
      ],
      texts: {
        done_text: '{STR_VAR_1}’s ability is now\n{STR_VAR_2}!',
        one_text: '{STR_VAR_1} has only one\nability.',
      },
    }),
  },
  {
    id: 'custom-pokemon-gender',
    source: 'mongender.s',
    card: {
      flagId: 1025, idNumber: 25, iconSpecies: 32, bgType: 4,
      title: 'POKéMON GENDER CHANGE',
      subtitle: 'For the perfect pair',
      body: ['Switch a POKéMON between male', 'and female. Visit the', 'deliveryman on the 2nd floor', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Which POKéMON should switch\ngender?',
      egg: 'Let’s wait for the EGG to\nhatch first!',
      steps: [
        ...native('switch_gender'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'one'),
        ...compareVarToValue(VAR_RESULT, 2), ...vgotoIf(EQ, 'female'),
        ...say('male_text'),
        { define: 'female' },
        ...say('female_text'),
        { define: 'one' },
        ...say('one_text'),
      ],
      texts: {
        male_text: '{STR_VAR_1} is now male!',
        female_text: '{STR_VAR_1} is now female!',
        one_text: '{STR_VAR_1}’s gender can’t\nbe switched.',
      },
    }),
  },
  {
    id: 'custom-pp-max',
    source: 'ppmax.s',
    card: {
      flagId: 1027, idNumber: 27, iconSpecies: 36, bgType: 7,
      title: 'PP MAX',
      subtitle: 'Moves at full power',
      body: ['Every move in your party gets', 'the most PP it can have. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: askingScript({
      entry: 'max_pp',
      ask: 'Shall I raise the PP of every\nmove in your party to the max?',
      done: 'Done! Every move has the most\nPP it can have.',
      declined: 'Come back any time!',
    }),
  },
  {
    id: 'custom-max-conditions',
    source: 'conditions.s',
    card: {
      flagId: 1028, idNumber: 28, iconSpecies: 329, bgType: 1,
      title: 'MAX CONDITIONS',
      subtitle: 'Contest ready!',
      body: ['COOL, BEAUTY, CUTE, SMART and', 'TOUGH to the max: a FEEBAS', 'then evolves at its next level.', 'Visit 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Which POKéMON should I get\nready for contests?',
      egg: 'An EGG can’t enter contests!',
      steps: [
        ...native('max_conditions'),
        ...say('done_text'),
      ],
      texts: {
        done_text: '{STR_VAR_1} is in top condition!¶A FEEBAS in this condition will\nevolve at its next level.',
      },
    }),
  },
  {
    id: 'custom-hidden-power',
    source: 'hiddenpower.s',
    symbols: { PICK: 0 },
    card: {
      flagId: 1029, idNumber: 29, iconSpecies: 201, bgType: 2,
      title: 'HIDDEN POWER & IVS',
      subtitle: 'Check it, then max it',
      body: ['See a POKéMON’s HIDDEN POWER,', 'then raise all its IVs to 31', 'if you like. Visit the 2F', 'deliveryman of a CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Whose HIDDEN POWER should I\ncheck?',
      egg: 'An EGG keeps its power hidden!',
      steps: [
        ...native('hidden_power'), ...buffernumberstring(2, VAR_0x8005),
        ...vmessage('power_text'), ...waitmessage(), ...waitbuttonpress(),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('max_ivs'),
        ...native('hidden_power'), ...buffernumberstring(2, VAR_0x8005),
        ...say('trained_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        power_text: '{STR_VAR_1}’s HIDDEN POWER is\n{STR_VAR_2}-type, power {STR_VAR_3}.',
        ask_text: 'Shall I raise all its IVs\nto 31?',
        trained_text: 'All its IVs are 31 now!¶Its HIDDEN POWER is\n{STR_VAR_2}-type, power {STR_VAR_3}.',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-hidden-power-type',
    source: 'hiddenpower.s',
    symbols: { PICK: 1 },
    card: {
      flagId: 1057, idNumber: 57, iconSpecies: 201, bgType: 6,
      title: 'HIDDEN POWER TYPE',
      subtitle: 'Any type, power 70',
      body: ['Give a POKéMON’s HIDDEN POWER', 'the type you choose. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    data: { kind_items: 'PHYSICAL', kind_special: 'SPECIAL' },
    script: (game) => partyMonScript(game, {
      which: 'Whose HIDDEN POWER should I\nchange?',
      egg: 'An EGG keeps its power hidden!',
      steps: [
        ...vmessage('kind_text'), ...waitmessage(),
        ...native('kind_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'declined'),
        ...copyvar(VAR_0x8006, VAR_RESULT),
        ...vmessage('type_text'), ...waitmessage(),
        ...native('type_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'declined'),
        ...native('set_type'),
        ...say('done_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        kind_text: 'A physical or a special type?',
        type_text: 'Which type?',
        done_text: 'Done! {STR_VAR_1}’s HIDDEN POWER\nis {STR_VAR_2}-type, power 70.',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-unown-letters',
    source: 'unown.s',
    card: {
      flagId: 1056, idNumber: 56, iconSpecies: 201, bgType: 6,
      title: 'UNOWN LETTER CHANGER',
      subtitle: 'From A to ?',
      body: ['Give an UNOWN any of its 28', 'letters. It keeps its nature.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Which UNOWN?',
      steps: [
        ...specialvar(VAR_RESULT, game.specials.getPartyMonSpecies),
        ...compareVarToValue(VAR_RESULT, SPECIES_UNOWN), ...vgotoIf(NE, 'not_unown'),
        ...vmessage('type_text'), ...waitmessage(), ...waitbuttonpress(),
        { define: 'naming' },
        ...closemessage(), ...fadescreen(FADE_TO_BLACK),
        ...native('type_letter'), ...waitstate(),
        ...native('change_letter'),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...compareVarToValue(VAR_RESULT, 2), ...vgotoIf(EQ, 'one_letter'),
        ...say('done_text'),
        { define: 'one_letter' },
        ...vmessage('one_letter_text'), ...waitmessage(), ...waitbuttonpress(),
        ...vgoto('naming'),
        { define: 'not_unown' },
        ...say('not_unown_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        type_text: 'Type its new letter:\nA to Z, ! or ?',
        one_letter_text: 'One letter, please:\nA to Z, ! or ?',
        done_text: '{STR_VAR_1} is the letter\n{STR_VAR_2} now!',
        not_unown_text: 'That’s not an UNOWN!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-ev-training',
    source: 'evs.s',
    card: {
      flagId: 1030, idNumber: 30, iconSpecies: 106, bgType: 0,
      title: 'EV TRAINING',
      subtitle: 'Train without battling',
      body: ['Reset a POKéMON’s EVs or max', 'the stats you choose. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Which POKéMON should I train?',
      egg: 'An EGG can’t train yet!',
      steps: [
        ...vmessage('reset_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'train'),
        ...native('reset_evs'),
        { define: 'train' },
        ...vmessage('stat_text'), ...waitmessage(),
        ...native('ev_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'finish'),
        ...native('max_ev'),
        ...buffernumberstring(2, VAR_0x8005),
        ...vmessage('trained_text'), ...waitmessage(), ...waitbuttonpress(),
        ...vgoto('train'),
        { define: 'finish' },
        ...native('recalculate'),
        ...say('done_text'),
      ],
      texts: {
        reset_text: 'Reset all of {STR_VAR_1}’s\nEVs to 0 first?',
        stat_text: 'Which EVs should I max?\nPress B when you’re done.',
        trained_text: '{STR_VAR_2} EVs: {STR_VAR_3}.',
        done_text: 'All done! Good luck,\n{STR_VAR_1}!',
      },
    }),
  },
  {
    id: 'custom-trainer-ids',
    source: 'ids.s',
    card: {
      flagId: 1031, idNumber: 31, iconSpecies: 63, bgType: 6,
      title: 'TRAINER ID REVEAL',
      subtitle: 'Both of your IDs',
      body: ['Learn your TRAINER ID and the', 'SECRET ID the game hides.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [...native('buffer_ids'), ...say('ids_text')],
      texts: {
        ids_text: 'Your TRAINER ID is {STR_VAR_1}\nand your SECRET ID is {STR_VAR_2}.¶Together they decide which\nPOKéMON you meet are shiny.',
      },
    },
  },
  {
    id: 'custom-national-dex',
    card: {
      flagId: 1032, idNumber: 32, iconSpecies: 137, bgType: 2,
      title: 'NATIONAL POKéDEX',
      subtitle: 'Every POKéMON, right away',
      body: ['Upgrade your POKéDEX to the', 'NATIONAL POKéDEX now. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => ({
      body: [
        ...checkflag(game.flags.pokedex), ...vgotoIf(UNSET, 'no_dex'),
        ...checkflag(game.flags.nationalDex), ...vgotoIf(EQ, 'already'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...special(game.specials.enableNationalPokedex),
        ...say('done_text'),
        { define: 'no_dex' },
        ...say('no_dex_text'),
        { define: 'already' },
        ...say('already_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I upgrade your POKéDEX\nto the NATIONAL POKéDEX?',
        done_text: 'Done! Your POKéDEX is now the\nNATIONAL POKéDEX.',
        no_dex_text: 'You don’t have a POKéDEX yet!',
        already_text: 'Your POKéDEX is already the\nNATIONAL POKéDEX!',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-rare-berries',
    card: {
      flagId: 1033, idNumber: 33, iconSpecies: 288, bgType: 5,
      title: 'RARE BERRIES',
      subtitle: 'ENIGMA, LANSAT and STARF',
      body: ['Three BERRIES that were only', 'ever given out at events.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // Once per card: the game clears FLAG_MYSTERY_GIFT_DONE when a card arrives.
    script: (game) => ({
      body: [
        ...checkflag(game.flags.mysteryGiftDone), ...vgotoIf(EQ, 'already'),
        ...[ITEM_ENIGMA_BERRY, ITEM_LANSAT_BERRY, ITEM_STARF_BERRY].flatMap((item) => [
          ...checkitemspace(item), ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'full'),
        ]),
        ...additem(ITEM_ENIGMA_BERRY), ...additem(ITEM_LANSAT_BERRY), ...additem(ITEM_STARF_BERRY),
        ...setflag(game.flags.mysteryGiftDone),
        ...say('given_text'),
        { define: 'already' },
        ...say('already_text'),
        { define: 'full' },
        ...say('full_text'),
      ],
      texts: {
        given_text: 'Here you go: an ENIGMA, a\nLANSAT and a STARF BERRY!',
        already_text: 'Receive this card again for\nmore BERRIES!',
        full_text: 'There’s no room for them in\nyour BAG!',
      },
    }),
  },
  {
    id: 'custom-mirage-island',
    roms: ['BPEE 1.0'],
    card: {
      flagId: 1034, idNumber: 34, iconSpecies: 360, bgType: 1,
      title: 'MIRAGE ISLAND',
      subtitle: 'Out on ROUTE 130 today',
      body: ['Make MIRAGE ISLAND appear', 'today. Visit the deliveryman', 'on the 2nd floor of a', 'POKéMON CENTER.'],
      footer: FOOTER,
    },
    // The island is there while a party Pokémon's personality has the low
    // half VAR_MIRAGE_RND_H holds, which the game rerolls every day.
    script: (game) => ({
      body: [
        ...copybyte(game.symbols.SPECIAL_VAR_8004 + 2, game.symbols.PARTY),
        ...copybyte(game.symbols.SPECIAL_VAR_8004 + 3, game.symbols.PARTY + 1),
        ...copyvar(game.vars.mirageHigh, VAR_0x8005),
        ...setvar(VAR_0x8004, 0),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...say('mirage_text'),
      ],
      texts: {
        mirage_text: 'MIRAGE ISLAND is out off\nROUTE 130 today!¶It stays as long as {STR_VAR_1}\nis in your party.',
      },
    }),
  },
  {
    id: 'custom-mass-outbreak',
    source: 'outbreak.s',
    roms: ['BPEE 1.0'],
    card: {
      flagId: 1058, idNumber: 58, iconSpecies: 376, bgType: 6,
      title: 'MASS OUTBREAK',
      subtitle: 'Rare POKéMON, everywhere!',
      body: ['Start a swarm of a rare HOENN', 'POKéMON where it lives. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...vmessage('which_text'), ...waitmessage(),
        ...native('outbreak_menu'), ...waitstate(),
        ...compareVarToValue(VAR_RESULT, MENU_B), ...vgotoIf(EQ, 'declined'),
        ...native('start_outbreak'),
        ...say('started_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        which_text: 'Which POKéMON should swarm?',
        started_text: 'There’s a mass outbreak of\n{STR_VAR_1} on {STR_VAR_2}!¶It lasts for two days.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-berry-garden',
    source: 'berries.s',
    roms: ['BPEE 1.0'],
    card: {
      flagId: 1035, idNumber: 35, iconSpecies: 369, bgType: 3,
      title: 'BERRY GARDEN',
      subtitle: 'Ripe BERRIES, right now',
      body: ['Every BERRY tree you planted', 'is ready to pick. Visit the', 'deliveryman on the 2nd floor', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('ripen'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'none'),
        ...buffernumberstring(0, VAR_RESULT),
        ...say('done_text'),
        { define: 'none' },
        ...say('none_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I make your BERRY trees\nready to pick?',
        done_text: 'Done! {STR_VAR_1} BERRY trees are\nready to pick, and well watered.',
        none_text: 'None of your BERRY trees are\ngrowing right now.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-rival-name',
    source: 'rival.s',
    roms: ['BPRE 1.0', 'BPRE 1.1', 'BPGE 1.0', 'BPGE 1.1'],
    card: {
      flagId: 1037, idNumber: 37, iconSpecies: 133, bgType: 4,
      title: 'RENAME YOUR RIVAL',
      subtitle: 'Smell ya later!',
      body: ['Give your rival a new name.', 'Visit the deliveryman on the', '2nd floor of a POKéMON', 'CENTER.'],
      footer: FOOTER,
    },
    // The naming screen returns to the field, so the script moves first.
    script: {
      body: [
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...relocate(),
        ...closemessage(), ...fadescreen(FADE_TO_BLACK),
        ...native('rename_rival'), ...waitstate(),
        ...say('renamed_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Would you like to give your\nrival a new name?',
        renamed_text: 'From now on, your rival is\n{RIVAL}!',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-gift-ribbons',
    source: 'ribbons.s',
    card: {
      flagId: 1038, idNumber: 38, iconSpecies: 358, bgType: 0,
      title: 'GIFT RIBBONS',
      subtitle: 'Seven RIBBONS to show off',
      body: ['Your party gets the gift', 'RIBBONS once only given at', 'events. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => ({
      body: [
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('give_ribbons'),
        ...setflag(game.flags.ribbons),
        ...say('done_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I give your party POKéMON\nthe gift RIBBONS?',
        done_text: 'Your POKéMON got all seven gift\nRIBBONS! Take a look.',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-fast-text',
    source: 'speed.s',
    // The speed hook with extra text printer runs only, which it makes every
    // frame; R keeps its own use.
    symbols: { TEXT_EXTRA: 8, OW_EXTRA: 0, BATTLE_EXTRA: 0, SLOW_PERIOD: 0, HELP_R_DISABLE: 0, TOGGLE: 0 },
    card: {
      flagId: 1039, idNumber: 39, iconSpecies: 315, bgType: 6,
      title: 'FAST TEXT',
      subtitle: 'No more waiting',
      body: ['All text prints at top speed', 'until you turn off your game.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: speedScript('All text prints at top speed\nnow, until you turn off the game.'),
  },
  {
    id: 'custom-move-tutor',
    source: 'movetutor.s',
    card: {
      flagId: 1040, idNumber: 40, iconSpecies: 235, bgType: 5,
      title: 'MOVE RELEARNER & DELETER',
      subtitle: 'And the tutors teach again',
      body: ['Relearn a move, forget one,', 'or let the move tutors teach', 'again. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // The game's own relearner and deleter; both return to the field.
    script: (game) => ({
      body: [
        ...relocate(),
        ...vmessage('remember_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'forget'),
        ...vmessage('which_text'), ...waitmessage(), ...waitbuttonpress(),
        ...special(game.specials.chooseMonForMoveRelearner), ...waitstate(),
        ...compareVarToValue(VAR_0x8004, PARTY_SIZE), ...vgotoIf(GE, 'done'),
        ...special(game.specials.isSelectedMonEgg),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'egg'),
        ...compareVarToValue(VAR_0x8005, 0), ...vgotoIf(EQ, 'no_moves'),
        ...special(game.specials.teachMoveRelearnerMove), ...waitstate(),
        { define: 'done' },
        ...closemessage(), ...release(), ...end(),
        { define: 'forget' },
        ...vmessage('forget_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'tutors'),
        ...vmessage('which_text'), ...waitmessage(), ...waitbuttonpress(),
        ...special(game.specials.choosePartyMon), ...waitstate(),
        ...compareVarToValue(VAR_0x8004, PARTY_SIZE), ...vgotoIf(GE, 'done'),
        ...special(game.specials.isSelectedMonEgg),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'egg'),
        ...bufferpartymonnick(0, VAR_0x8004),
        ...special(game.specials.getNumMovesSelectedMonHas),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'one_move'),
        ...vmessage('which_move_text'), ...waitmessage(), ...waitbuttonpress(),
        ...fadescreen(FADE_TO_BLACK),
        ...special(game.specials.chooseMoveToForget), ...waitstate(),
        ...fadescreen(FADE_FROM_BLACK),
        ...compareVarToValue(VAR_0x8005, MAX_MON_MOVES), ...vgotoIf(EQ, 'done'),
        ...special(game.specials.bufferMoveDeleterNicknameAndMove),
        ...vmessage('confirm_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...(game.specials.isLastMonThatKnowsSurf ? [
          ...special(game.specials.isLastMonThatKnowsSurf),
          ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'surf'),
        ] : []),
        ...special(game.specials.moveDeleterForgetMove),
        ...say('forgot_text'),
        { define: 'egg' },
        ...say('egg_text'),
        { define: 'no_moves' },
        ...say('no_moves_text'),
        { define: 'one_move' },
        ...say('one_move_text'),
        ...(game.specials.isLastMonThatKnowsSurf ? [{ define: 'surf' }, ...say('surf_text')] : []),
        { define: 'tutors' },
        ...vmessage('tutors_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...game.flags.tutors.flatMap(clearflag),
        ...say('tutored_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        remember_text: 'Shall I help a POKéMON\nremember a move?',
        forget_text: 'Or shall I make one forget\na move?',
        which_text: 'Which POKéMON should it be?',
        which_move_text: 'Which move should it forget?',
        confirm_text: 'Make {STR_VAR_1} forget\n{STR_VAR_2}?',
        forgot_text: '{STR_VAR_1} forgot {STR_VAR_2}!',
        egg_text: 'An EGG doesn’t know any\nmoves yet!',
        no_moves_text: 'There’s no move for it to\nremember.',
        one_move_text: '{STR_VAR_1} knows only one\nmove!',
        ...(game.specials.isLastMonThatKnowsSurf && { surf_text: 'It’s the only POKéMON of yours\nthat knows SURF!' }),
        tutors_text: 'Or shall I let the move tutors\nteach their moves again?',
        tutored_text: 'Done! Every move tutor will\nteach again.',
        declined_text: 'Come back any time!',
      },
    }),
  },
  {
    id: 'custom-trade-evolution',
    source: 'tradeevo.s',
    card: {
      flagId: 1041, idNumber: 41, iconSpecies: 65, bgType: 2,
      title: 'TRADE EVOLUTION',
      subtitle: 'No second GBA needed',
      body: ['Evolve a POKéMON that evolves', 'by trading, right away. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => partyMonScript(game, {
      which: 'Which POKéMON should evolve?',
      egg: 'An EGG can’t evolve!',
      steps: [
        ...native('trade_evolve'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'cant'),
        ...waitstate(),
        ...say('done_text'),
        { define: 'cant' },
        ...say('cant_text'),
      ],
      texts: {
        done_text: 'Take good care of it!',
        cant_text: '{STR_VAR_1} doesn’t evolve by\ntrading.¶Some POKéMON need to hold an\nitem when they’re traded.',
      },
    }),
  },
  {
    id: 'custom-roamer',
    source: 'roamer.s',
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1042, idNumber: 42, iconSpecies: 245, bgType: 4,
      title: 'ROAMING POKéMON',
      subtitle: 'Find it, then lure it',
      body: ['Find out where the roaming', 'POKéMON is and lure it to you.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...native('roamer_info'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'none'),
        ...vmessage('where_text'), ...waitmessage(), ...waitbuttonpress(),
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'following'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'following' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...writebytetoaddr(0, HOOK_STATE),
        ...say('off_text'),
        { define: 'none' },
        ...say('none_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        where_text: '{STR_VAR_1} is roaming\n{STR_VAR_2} right now.',
        ask_text: 'Shall I lure it to you? It will\nfollow you along its routes.',
        on_text: 'Done! Look for it in tall grass\nand on the water.',
        keep_text: 'It’s following you.\nKeep luring it?',
        off_text: 'It will roam on its own again.',
        none_text: 'No POKéMON is roaming right\nnow.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-legendary-respawn',
    source: 'respawn.s',
    card: {
      flagId: 1043, idNumber: 43, iconSpecies: 150, bgType: 7,
      title: 'LEGENDARY RESPAWN',
      subtitle: 'A second chance',
      body: ['Legendary POKéMON you beat', 'but didn’t catch come back.', 'Visit the deliveryman on 2F', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('respawn'),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'none'),
        ...buffernumberstring(0, VAR_RESULT),
        ...say('done_text'),
        { define: 'none' },
        ...say('none_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I bring back the legendary\nPOKéMON you didn’t catch?',
        done_text: 'Done! {STR_VAR_1} legendary POKéMON\ncame back.',
        none_text: 'No legendary POKéMON needs to\ncome back.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-travel-anywhere',
    source: 'fly.s',
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1044, idNumber: 44, iconSpecies: 18, bgType: 1,
      title: 'TRAVEL ANYWHERE',
      subtitle: 'FLY with R, BIKE indoors',
      body: ['Press R outdoors to FLY, no', 'HM needed, and run and BIKE', 'anywhere. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'active'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'active' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...native('uninstall'),
        ...say('off_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I let you FLY with R and\nrun and BIKE anywhere?',
        on_text: 'Done! Outdoors, press R to FLY.\nIt lasts until you reset.',
        keep_text: 'Travel anywhere is on.\nKeep it on?',
        off_text: 'Back to normal travel!',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-reusable-tms',
    source: 'tm.s',
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1045, idNumber: 45, iconSpecies: 137, bgType: 6,
      title: 'REUSABLE TMs',
      subtitle: 'Teach a TM again and again',
      body: ['Teaching a move with a TM no', 'longer uses the TM up. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'active'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'active' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...native('uninstall'),
        ...say('off_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I make your TMs last\nforever?',
        on_text: 'Done! Teaching a move won’t use\nup the TM until you reset.',
        keep_text: 'Your TMs last forever.\nKeep it that way?',
        off_text: 'TMs get used up again.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-physical-special-split',
    source: 'split.s',
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1062, idNumber: 62, iconSpecies: 357, bgType: 7,
      title: 'GEN 4 PHYSICAL/SPECIAL SPLIT',
      subtitle: 'Moves hit as in later games',
      body: ['Each move is physical or', 'special on its own, not by its', 'type. Visit the deliveryman', 'on 2F of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'active'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'active' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...writebytetoaddr(0, HOOK_STATE),
        ...say('off_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Want the physical/special\nsplit?',
        on_text: 'Done! It lasts until you reset.',
        keep_text: 'The split is on.\nKeep it on?',
        off_text: 'Back to the old way!',
        declined_text: 'Come back any time!',
      },
    },
  },
  // Event Pokémon: EVENT picks the distribution in eventmon.s.
  ...[
    {
      id: 'wishmkr-jirachi', icon: 409, bgType: 3, name: 'JIRACHI',
      title: 'WISHMKR JIRACHI', subtitle: 'The BONUS DISC gift',
      body: ['The wish-granting JIRACHI of', 'the COLOSSEUM BONUS DISC.', ...VISIT],
    },
    {
      id: '10-aniv-celebi', icon: 251, bgType: 1, name: 'CELEBI',
      title: '10 ANIV CELEBI', subtitle: 'The 10th Anniversary gift',
      body: ['The CELEBI of the 2006 10th', 'Anniversary tour of America.', ...VISIT],
    },
    {
      id: '10-aniv-kanto', icon: 25, bgType: 4,
      title: 'PARTY OF THE DECADE', subtitle: 'KANTO favorites',
      body: ['BULBASAUR, CHARIZARD,', 'BLASTOISE, PIKACHU, ALAKAZAM', 'or DRAGONITE: choose one on', '2F of a POKéMON CENTER.'],
    },
    {
      id: '10-aniv-legends', icon: 144, bgType: 6,
      title: 'PARTY OF THE DECADE', subtitle: 'Legendary POKéMON',
      body: ['ARTICUNO, ZAPDOS, MOLTRES,', 'RAIKOU, ENTEI, SUICUNE, LATIAS', 'or LATIOS: choose one on', '2F of a POKéMON CENTER.'],
    },
    {
      id: '10-aniv-johto-hoenn', icon: 196, bgType: 2,
      title: 'PARTY OF THE DECADE', subtitle: 'JOHTO & HOENN favorites',
      body: ['TYPHLOSION, ESPEON, UMBREON,', 'TYRANITAR, BLAZIKEN or', 'ABSOL: choose one on', '2F of a POKéMON CENTER.'],
    },
    {
      id: 'doel-deoxys', icon: 410, bgType: 6, name: 'DEOXYS',
      title: 'DOEL DEOXYS', subtitle: 'From outer space',
      body: ['The DEOXYS of the DOEL', 'distribution, ready to obey.', ...VISIT],
    },
    {
      id: 'space-c-deoxys', icon: 410, bgType: 5, name: 'DEOXYS',
      title: 'SPACE C DEOXYS', subtitle: 'From outer space',
      body: ['The DEOXYS of the SPACE C', 'distribution, ready to obey.', ...VISIT],
    },
    {
      id: 'aura-mew', icon: 151, bgType: 3, name: 'MEW',
      title: 'AURA MEW', subtitle: 'The Aura gift',
      body: ['The MEW of the Aura', 'distribution, ready to obey.', ...VISIT],
    },
    {
      id: 'mystry-mew', icon: 151, bgType: 1, name: 'MEW',
      title: 'MYSTRY MEW', subtitle: 'The MYSTRY gift',
      body: ['The MEW of the MYSTRY', 'distribution, ready to obey.', ...VISIT],
    },
    {
      id: 'rocks-metang', icon: 399, bgType: 5, name: 'METANG',
      title: 'ROCKS METANG', subtitle: 'With the National Ribbon',
      body: ['The METANG of the ROCKS', 'distribution, with its ribbon.', ...VISIT],
    },
  ].map(({ id, icon, bgType, name, title, subtitle, body }, i) => ({
    id: `custom-${id}`,
    source: 'eventmon.s',
    symbols: { EVENT: i + 1 },
    card: {
      flagId: 1046 + i, idNumber: 46 + i, iconSpecies: icon, bgType,
      title,
      subtitle,
      body,
      footer: FOOTER,
    },
    script: (game) => (name ? eventMonScript(game, name) : eventMonScript(game, null, {
      choose: offerMon,
      texts: { offer_text: 'Would you like {STR_VAR_1}?' },
    })),
  })),
  {
    id: 'custom-feebas-finder',
    source: 'feebas.s',
    roms: ['BPEE 1.0'],
    symbols: { STATE: HOOK_STATE },
    card: {
      flagId: 1059, idNumber: 59, iconSpecies: 328, bgType: 3,
      title: 'FEEBAS FINDER',
      subtitle: 'Fish anywhere on ROUTE 119',
      body: ['FEEBAS bites wherever you fish', 'on ROUTE 119. Visit the', 'deliveryman on the 2nd floor', 'of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: {
      body: [
        ...compareAddrToValue(HOOK_STATE, 1), ...vgotoIf(EQ, 'active'),
        ...vmessage('ask_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'declined'),
        ...native('install'),
        ...say('on_text'),
        { define: 'active' },
        ...vmessage('keep_text'), ...waitmessage(), ...yesnobox(),
        ...compareVarToValue(VAR_RESULT, 1), ...vgotoIf(EQ, 'declined'),
        ...native('uninstall'),
        ...say('off_text'),
        { define: 'declined' },
        ...say('declined_text'),
      ],
      texts: {
        ask_text: 'Shall I bring FEEBAS to every\nfishing spot on ROUTE 119?',
        on_text: 'Done! Cast a rod anywhere on\nROUTE 119. It lasts until you reset.',
        keep_text: 'The FEEBAS FINDER is on.\nKeep it on?',
        off_text: 'FEEBAS is back in its six\nhidden spots.',
        declined_text: 'Come back any time!',
      },
    },
  },
  {
    id: 'custom-starter-egg',
    source: 'starter.s',
    card: {
      flagId: 1060, idNumber: 60, iconSpecies: 412, bgType: 4,
      title: 'STARTER EGG',
      subtitle: 'Which one will hatch?',
      body: ['An EGG with one of the nine', 'first partners inside. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    script: (game) => ({
      body: [
        ...checkflag(game.flags.mysteryGiftDone), ...vgotoIf(EQ, 'already'),
        ...native('pick_starter'),
        ...giveegg(VAR_0x8004),
        ...compareVarToValue(VAR_RESULT, MON_CANT_GIVE), ...vgotoIf(EQ, 'full'),
        ...setflag(game.flags.mysteryGiftDone),
        ...playfanfare(game.songs.giftMon), ...vmessage('received_text'), ...waitmessage(), ...waitfanfare(),
        ...waitbuttonpress(),
        ...compareVarToValue(VAR_RESULT, MON_GIVEN_TO_PC), ...vgotoIf(EQ, 'pc'),
        ...closemessage(), ...release(), ...end(),
        { define: 'pc' },
        ...say('pc_text'),
        { define: 'already' },
        ...say('already_text'),
        { define: 'full' },
        ...say('full_text'),
      ],
      texts: {
        received_text: '{PLAYER} received an EGG!',
        pc_text: 'It was sent to the PC.',
        already_text: 'Receive the card again for\nanother EGG!',
        full_text: 'Your party and the PC are full!',
      },
    }),
  },
  {
    id: 'custom-gift-box',
    card: {
      flagId: 1061, idNumber: 61, iconSpecies: 113, bgType: 2,
      title: 'GIFT BOX',
      subtitle: 'Money, candy and more',
      body: ['¥100,000, 99 RARE CANDIES and', 'COINS or BATTLE POINTS. Visit', 'the deliveryman on the 2nd', 'floor of a POKéMON CENTER.'],
      footer: FOOTER,
    },
    // Once per card. RARE CANDIES need room in the bag, COINS a COIN CASE;
    // BATTLE POINTS are Emerald's (up to 9,999).
    script: (game) => ({
      body: [
        ...checkflag(game.flags.mysteryGiftDone), ...vgotoIf(EQ, 'already'),
        ...setflag(game.flags.mysteryGiftDone),
        ...addmoney(100000),
        ...playfanfare(game.songs.giftMon), ...vmessage('money_text'), ...waitmessage(), ...waitfanfare(),
        ...waitbuttonpress(),
        ...checkitemspace(ITEM_RARE_CANDY, 99),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'no_room'),
        ...additem(ITEM_RARE_CANDY, 99),
        ...vmessage('candy_text'), ...waitmessage(), ...waitbuttonpress(),
        { define: 'coins' },
        ...checkitem(ITEM_COIN_CASE),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(EQ, 'points'),
        ...addcoins(1000),
        ...compareVarToValue(VAR_RESULT, 0), ...vgotoIf(NE, 'points'),
        ...vmessage('coins_text'), ...waitmessage(), ...waitbuttonpress(),
        { define: 'points' },
        ...(game.specials.giveFrontierBattlePoints ? [
          ...setvar(VAR_0x8004, 100), ...special(game.specials.giveFrontierBattlePoints),
          ...vmessage('points_text'), ...waitmessage(), ...waitbuttonpress(),
        ] : []),
        ...closemessage(), ...release(), ...end(),
        { define: 'no_room' },
        ...vmessage('no_room_text'), ...waitmessage(), ...waitbuttonpress(),
        ...vgoto('coins'),
        { define: 'already' },
        ...say('already_text'),
      ],
      texts: {
        money_text: '{PLAYER} received ¥100,000!',
        candy_text: '{PLAYER} received 99 RARE\nCANDIES!',
        no_room_text: 'There’s no room in your bag\nfor 99 RARE CANDIES!',
        coins_text: '{PLAYER} received 1,000 COINS!',
        ...(game.specials.giveFrontierBattlePoints && { points_text: '{PLAYER} received 100\nBATTLE POINTS!' }),
        already_text: 'Receive the card again for\nanother GIFT BOX!',
      },
    }),
  },
  { id: 'custom-master-ball', fixed: true },
];

// struct WonderCard text: title, subtitle, four body lines and two footer
// lines, 40 bytes each from byte 10, padded with 0xFF.
const CARD_TEXT_AT = 10;
const CARD_TEXT_BYTES = 40;
const CARD_SUBTITLE_FIELD = 1;
const CARD_FOOTER_FIELD = 6;

function setCardText(card, field, text) {
  const bytes = encodeText(text);
  if (bytes.length > CARD_TEXT_BYTES) throw new Error(`card text too long: ${text}`);
  const at = CARD_TEXT_AT + CARD_TEXT_BYTES * field;
  card.fill(0xff, at, at + CARD_TEXT_BYTES);
  card.set(bytes, at);
}

function wonderCard({ flagId, idNumber, iconSpecies, bgType, title, subtitle, body, footer }) {
  const card = new Uint8Array(WONDER_CARD_BYTES).fill(0xff);
  card.set([...u16(flagId), ...u16(iconSpecies), ...u32(idNumber), bgType << 2, 0]);
  [title, subtitle, ...body, ...footer].forEach((text, field) => setCardText(card, field, text));
  card[330] = 0;
  card[331] = 0;
  return card;
}

// A Wonder Card from the file with the footer replaced, and the subtitle
// when the entry has one.
function withFooter(kept, subtitle) {
  const card = Uint8Array.from(kept);
  FOOTER.forEach((text, i) => setCardText(card, CARD_FOOTER_FIELD + i, text));
  if (subtitle) setCardText(card, CARD_SUBTITLE_FIELD, subtitle);
  return card;
}

// ---- native code
// Assembles a source in this directory; `data` becomes data.inc. Returns the
// bytes and the label offsets.
function assemble(source, symbols, dir, data = null) {
  const object = join(dir, 'out.o');
  const elf = join(dir, 'out.elf');
  const bin = join(dir, 'out.bin');
  if (data) {
    const include = Object.entries(data.strings).map(([label, text]) =>
      `    .align 2\n${label}:\n    .byte ${encodeText(text, data.tokens).join(', ')}\n`);
    writeFileSync(join(dir, 'data.inc'), `${include.join('')}    .align 2\n`);
  }
  const defsyms = Object.entries(symbols).flatMap(([key, value]) => ['--defsym', `${key}=${value}`]);
  execFileSync('arm-none-eabi-as', ['-mcpu=arm7tdmi', '-mthumb', '-I', HERE, '-I', dir, ...defsyms,
    '-o', object, join(HERE, source)]);
  execFileSync('arm-none-eabi-ld', ['-Ttext=0', '-o', elf, object], { stdio: ['ignore', 'ignore', 'ignore'] });
  execFileSync('arm-none-eabi-objcopy', ['-O', 'binary', elf, bin]);
  const labels = {};
  for (const line of execFileSync('arm-none-eabi-nm', [elf], { encoding: 'utf8' }).split('\n')) {
    const [value, type, name] = line.split(' ');
    if (type === 't' || type === 'T') labels[name] = parseInt(value, 16);
  }
  return { bytes: [...readFileSync(bin)], labels };
}

// Lays out bytes, { define } labels, { label } (the label's address from
// `base`, 4 bytes), { align } padding and { size, bytes } items, whose
// bytes(labels, at) depend on where they land.
function layout(items, base) {
  const labels = {};
  const sizeAt = (item, at) => (item?.label ? 4 : item?.align ? -at & (item.align - 1) : item?.size ?? 1);
  let at = 0;
  for (const item of items) {
    if (item?.define) {
      if (item.define in labels) throw new Error(`label ${item.define} defined twice`);
      labels[item.define] = at;
    } else {
      at += sizeAt(item, at);
    }
  }
  const out = [];
  for (const item of items) {
    if (item?.define) continue;
    if (item?.label) {
      if (!(item.label in labels)) throw new Error(`no label ${item.label}`);
      out.push(...u32(base + labels[item.label]));
    } else if (item?.align) {
      out.push(...new Array(sizeAt(item, out.length)).fill(0));
    } else if (item?.bytes) {
      out.push(...item.bytes(labels, out.length));
    } else {
      out.push(item);
    }
  }
  return out;
}

// The RAM script: the ROM check, the trampoline, the card's script and texts,
// then its code.
function buildScript(card, romId, dir) {
  const game = gameOf(romId);
  const script = typeof card.script === 'function' ? card.script(game) : card.script;
  const code = card.source
    && assemble(card.source, { ...game.symbols, ...card.symbols, TEXT_BUFFER, RELOCATED, MENU_LIST,
      SCRIPT_IN_SB1: game.scriptInSaveBlock1 }, dir, card.data && { strings: card.data, tokens: card.tokens });
  const trampoline = Buffer.from(code ? assemble('trampoline.s', {}, dir).bytes : []);
  const loadTrampoline = Array.from({ length: trampoline.length / 4 },
    (_, i) => loadword(i, trampoline.readUInt32LE(4 * i))).flat();

  // callnative to the trampoline, then the routine's distance from the
  // callnative's operand + 2.
  const expand = (item) => {
    if (!item?.native) return [item];
    if (!code || !(item.native in code.labels)) throw new Error(`${card.id}: no routine ${item.native}`);
    const routine = code.labels[item.native];
    return [...callnative(game.symbols.SCRIPT_CONTEXT + CONTEXT_DATA + 1),
      { size: 2, bytes: (labels, at) => u16(labels.code + routine + 1 - (at - 2)) }];
  };
  const texts = { ...script.texts, wrong_rom_message: WRONG_ROM_MESSAGE };
  const items = [
    ...setvaddress(VIRTUAL_BASE),
    ...lock(),
    ...faceplayer(),
    ...romCheck(game, 'wrong_rom').flat(),
    ...loadTrampoline,
    ...script.body,
    { define: 'wrong_rom' },
    ...say('wrong_rom_message'),
    ...textItems(texts),
    ...(code ? [{ align: 4 }, { define: 'code' }, ...code.bytes] : []),
  ].flatMap(expand);
  const out = layout(items, VIRTUAL_BASE);
  if (out.length > RAM_SCRIPT_BYTES) {
    throw new Error(`${card.id} ${romId}: the script is ${out.length} bytes, over ${RAM_SCRIPT_BYTES}`);
  }
  return Uint8Array.from(out);
}

// Base64 in lines of 76, continued lines indented by `indent`.
function base64Lines(bytes, indent = '') {
  return Buffer.from(bytes).toString('base64').match(/.{1,76}/g).join(`\n${indent}`);
}

const FRLG_ROMS = ['BPRE 1.0', 'BPRE 1.1', 'BPGE 1.0', 'BPGE 1.1'];
const decodeText = (bytes, indent = '') => `decodeBase64(\`${base64Lines(bytes, indent)}\`)`;

// The payloads an entry holds now, by game family: the first for each.
function keptPayloads(body) {
  const kept = {};
  const found = body.matchAll(/(emerald|frlg|'BP[RG]E 1\.0'|romPayloads)(?:: \[|\()decodeBase64\(`([^`]*)`\)/g);
  for (const [, key, base64] of found) {
    kept[key === 'emerald' ? 'emerald' : 'frlg'] ??= Buffer.from(base64.replace(/\s+/g, ''), 'base64');
  }
  return kept;
}

// The bytes of `bytes` that differ from `base`, as runs of [u16 offset, u8
// length, bytes]; runs a few bytes apart are merged.
function patchOf(base, bytes) {
  if (bytes.length !== base.length) throw new Error('FireRed/LeafGreen payloads of different sizes');
  const out = [];
  for (let at = 0; at < bytes.length;) {
    if (bytes[at] === base[at]) {
      at += 1;
      continue;
    }
    let end = at + 1;
    for (let next = end; next < bytes.length && next - end < 4 && end - at < 255; next += 1) {
      if (bytes[next] !== base[next]) end = next + 1;
    }
    out.push(at & 0xff, at >> 8, end - at, ...bytes.subarray(at, end));
    at = end;
  }
  return Uint8Array.from(out);
}

// The text of an entry's payloads: Emerald's, then FireRed 1.0's with the other
// FireRed/LeafGreen ROMs as patches of it.
function payloadsText(card, kept, dir) {
  const romIds = card.fixed ? ['BPEE 1.0', 'BPRE 1.0'] : card.roms ?? Object.keys(ROMS);
  const built = {};
  for (const romId of romIds) {
    const family = ROMS[romId].family;
    if (!card.card && !kept[family]) throw new Error(`${card.id}: no ${family} payload to keep the card of`);
    const cardBytes = card.card ? wonderCard(card.card)
      : withFooter(kept[family].subarray(0, WONDER_CARD_BYTES), card.subtitle);
    const script = card.fixed ? kept[family].subarray(PAYLOAD_SCRIPT_OFFSET) : buildScript(card, romId, dir);
    built[romId] = Buffer.concat([cardBytes, new Uint8Array(PAYLOAD_SCRIPT_OFFSET - WONDER_CARD_BYTES), script]);
    console.log(`${card.id} ${romId}: script ${script.length} bytes`);
  }
  const lines = [];
  if (built['BPEE 1.0']) lines.push(`\n      emerald: [${decodeText(built['BPEE 1.0'])}],`);
  if (card.fixed) {
    lines.push(`\n      frlg: [${decodeText(built['BPRE 1.0'])}],`);
  } else if (built['BPRE 1.0']) {
    const patches = FRLG_ROMS.slice(1).map((romId) =>
      `\n        '${romId}': ${decodeText(patchOf(built['BPRE 1.0'], built[romId]), '  ')},`);
    lines.push(`\n      ...romPayloads(${decodeText(built['BPRE 1.0'])}, {${patches.join('')}\n      }),`);
  }
  return lines.join('');
}


let source = readFileSync(EVENTS_FILE, 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'native-cards-'));
try {
  for (const card of CARDS) {
    const entry = new RegExp(`(id: '${card.id}',[\\s\\S]*?payloads: \\{)([\\s\\S]*?)(\\n {4}\\},)`);
    const match = entry.exec(source);
    if (!match) throw new Error(`no entry for ${card.id} in ${EVENTS_FILE}`);
    const text = payloadsText(card, keptPayloads(match[2]), dir);
    source = source.replace(entry, (all, head, old, tail) => head + text + tail);
  }
  writeFileSync(EVENTS_FILE, source);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
