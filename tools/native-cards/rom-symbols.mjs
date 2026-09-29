#!/usr/bin/env node
// Writes roms.mjs, the addresses the cards use in each English ROM, from the
// symbol tables of pret's pokeemerald and pokefirered builds (`make`, and
// `make firered_rev1 leafgreen leafgreen_rev1` for pokefirered).
//
//   node tools/native-cards/rom-symbols.mjs <pokeemerald dir> <pokefirered dir>
//
// Needs arm-none-eabi-nm on PATH. Routines get the Thumb bit.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const ROMS = {
  'BPEE 1.0': { family: 'emerald', game: 'E', revision: 0, elf: ['emerald', 'pokeemerald.elf'] },
  'BPRE 1.0': { family: 'frlg', game: 'R', revision: 0, elf: ['frlg', 'pokefirered.elf'] },
  'BPRE 1.1': { family: 'frlg', game: 'R', revision: 1, elf: ['frlg', 'pokefirered_rev1.elf'] },
  'BPGE 1.0': { family: 'frlg', game: 'G', revision: 0, elf: ['frlg', 'pokeleafgreen.elf'] },
  'BPGE 1.1': { family: 'frlg', game: 'G', revision: 1, elf: ['frlg', 'pokeleafgreen_rev1.elf'] },
};

// Name in the card sources: [symbol, offset] for data, [symbol, 0, 'fn'] for
// routines, or { emerald, frlg } when the games name it differently. A name
// missing from a game's build is 0 there.
const SYMBOLS = {
  // RAM
  MAIN: ['gMain'],
  INTR_CHECK: ['gMain', 0x1c],
  INTR_VBLANK: ['gIntrTable', 0x10],
  SB1_PTR: ['gSaveBlock1Ptr'],
  SB2_PTR: ['gSaveBlock2Ptr'],
  STORAGE_PTR: ['gPokemonStoragePtr'],
  SCRIPT_CONTEXT: ['sGlobalScriptContext'],
  PARTY: ['gPlayerParty'],
  ENEMY_PARTY: ['gEnemyParty'],
  PLAYER_AVATAR: ['gPlayerAvatar'],
  OBJECT_EVENTS: ['gObjectEvents'],
  PALETTE_FADE: ['gPaletteFade'],
  TEXT_PRINTERS: ['sTextPrinters'],
  SPECIAL_VAR_8004: ['gSpecialVar_0x8004'],
  SPECIAL_VAR_RESULT: ['gSpecialVar_Result'],
  STRING_VAR_1: ['gStringVar1'],
  STRING_VAR_2: ['gStringVar2'],
  STRING_VAR_3: ['gStringVar3'],
  WILD_ENCOUNTERS_DISABLED: ['sWildEncountersDisabled'],
  HELP_R_DISABLE: ['gHelpSystemToggleWithRButtonDisabled'],
  CB2_AFTER_EVOLUTION: ['gCB2_AfterEvolution'],
  ROAMER_LOCATION: ['sRoamerLocation'],
  PARTY_COUNT: ['gPlayerPartyCount'],
  MAP_HEADER: ['gMapHeader'],
  CONTROLS_LOCKED: ['sLockFieldControls'],
  TASKS: ['gTasks'],
  PARTY_MENU: ['gPartyMenu'],
  FIELD_CALLBACK: ['gFieldCallback'],
  ITEM_ID: ['gSpecialVar_ItemId'],
  ITEM_ANIM_PLAYED: { frlg: ['sCancelDisabled'] },
  // ROM data
  NATURE_NAMES: ['gNatureNamePointers'],
  STAT_NAMES: ['gStatNamesTable'],
  TYPE_NAMES: ['gTypeNames'],
  SPECIES_INFO: ['gSpeciesInfo'],
  ABILITY_NAMES: ['gAbilityNames'],
  ROAMER_LOCATIONS: ['sRoamerLocations'],
  // routines
  VBLANK_INTR: ['VBlankIntr', 0, 'fn'],
  RUN_TEXT_PRINTERS: ['RunTextPrinters', 0, 'fn'],
  CB1_OVERWORLD: ['CB1_Overworld', 0, 'fn'],
  CB2_OVERWORLD: ['CB2_Overworld', 0, 'fn'],
  BATTLE_CB1: ['BattleMainCB1', 0, 'fn'],
  BATTLE_CB2: ['BattleMainCB2', 0, 'fn'],
  RETURN_TO_FIELD: ['CB2_ReturnToFieldContinueScript', 0, 'fn'],
  AVATAR_GRAPHICS_ID: ['GetPlayerAvatarGraphicsIdByStateIdAndGender', 0, 'fn'],
  SET_GRAPHICS_ID: ['ObjectEventSetGraphicsId', 0, 'fn'],
  OBJECT_EVENT_TURN: ['ObjectEventTurn', 0, 'fn'],
  GET_MON_DATA: ['GetMonData3', 0, 'fn'],
  SET_MON_DATA: ['SetMonData', 0, 'fn'],
  GET_NATURE: ['GetNature', 0, 'fn'],
  GET_SPECIES_NAME: ['GetSpeciesName', 0, 'fn'],
  DO_NAMING_SCREEN: ['DoNamingScreen', 0, 'fn'],
  CALCULATE_STATS: ['CalculateMonStats', 0, 'fn'],
  MON_RESTORE_PP: ['MonRestorePP', 0, 'fn'],
  STRING_COPY: ['StringCopy', 0, 'fn'],
  INT_TO_STRING: ['ConvertIntToDecimalStringN', 0, 'fn'],
  GET_EVOLUTION_TARGET: ['GetEvolutionTargetSpecies', 0, 'fn'],
  BEGIN_EVOLUTION_SCENE: ['BeginEvolutionScene', 0, 'fn'],
  GET_MAP_HEADER: ['Overworld_GetMapHeaderByGroupAndId', 0, 'fn'],
  GET_MAP_NAME: ['GetMapName', 0, 'fn'],
  FLAG_GET: ['FlagGet', 0, 'fn'],
  FLAG_CLEAR: ['FlagClear', 0, 'fn'],
  SPECIES_TO_NATIONAL: ['SpeciesToNationalPokedexNum', 0, 'fn'],
  CREATE_MON_IVS_PERSONALITY: ['CreateMonWithIVsPersonality', 0, 'fn'],
  CREATE_MON: ['CreateMon', 0, 'fn'],
  SET_MON_MOVE_SLOT: ['SetMonMoveSlot', 0, 'fn'],
  RANDOM: ['Random', 0, 'fn'],
  SEND_MON_TO_PC: { emerald: ['CopyMonToPC', 0, 'fn'], frlg: ['SendMonToPC', 0, 'fn'] },
  GET_SET_POKEDEX_FLAG: ['GetSetPokedexFlag', 0, 'fn'],
  ROAMER_MOVE: ['RoamerMoveToOtherLocationSet', 0, 'fn'],
  CB2_OPEN_FLY_MAP: ['CB2_OpenFlyMap', 0, 'fn'],
  CB2_RETURN_TO_PARTY_FROM_FLY: ['CB2_ReturnToPartyMenuFromFlyMap', 0, 'fn'],
  CB2_RETURN_TO_FIELD: ['CB2_ReturnToField', 0, 'fn'],
  MAP_ALLOWS_FLY: ['Overworld_MapTypeAllowsTeleportAndFly', 0, 'fn'],
  HIDE_MAP_NAME: { emerald: ['HideMapNamePopUpWindow', 0, 'fn'], frlg: ['DismissMapNamePopup', 0, 'fn'] },
  FREEZE_OBJECT_EVENTS: ['FreezeObjectEvents', 0, 'fn'],
  STOP_PLAYER_AVATAR: ['StopPlayerAvatar', 0, 'fn'],
  FADE_SCREEN: ['FadeScreen', 0, 'fn'],
  RAIN_SOUND_STOP: ['PlayRainStoppingSoundEffect', 0, 'fn'],
  CLEANUP_OVERWORLD: ['CleanupOverworldWindowsAndTilemaps', 0, 'fn'],
  SCANLINE_EFFECT_STOP: ['ScanlineEffect_Stop', 0, 'fn'],
  RESET_TASKS: ['ResetTasks', 0, 'fn'],
  CREATE_TASK: ['CreateTask', 0, 'fn'],
  CB2_UPDATE_PARTY_MENU: ['CB2_UpdatePartyMenu', 0, 'fn'],
  LEARNED_MOVE_STEP: ['Task_DoLearnedMoveFanfareAfterText', 0, 'fn'],
  ADD_BAG_ITEM: ['AddBagItem', 0, 'fn'],
  CB2_USE_ITEM: { frlg: ['CB2_UseItem', 0, 'fn'] },
  CB2_USE_TM_AFTER_FORGETTING: { frlg: ['CB2_UseTMHMAfterForgettingMove', 0, 'fn'] },
  // the multichoice box (menu.inc)
  CREATE_WINDOW_FROM_RECT: ['CreateWindowFromRect', 0, 'fn'],
  WINDOW_BORDER: { emerald: ['SetStandardWindowBorderStyle', 0, 'fn'], frlg: ['SetStdWindowBorderStyle', 0, 'fn'] },
  PRINT_MENU_ITEMS: { emerald: ['PrintMenuTable', 0, 'fn'], frlg: ['MultichoiceList_PrintItems', 0, 'fn'] },
  INIT_MENU_CURSOR: { emerald: ['InitMenuInUpperLeftCornerNormal', 0, 'fn'], frlg: ['Menu_InitCursor', 0, 'fn'] },
  MULTICHOICE_TASK: { emerald: ['InitMultichoiceCheckWrap', 0, 'fn'], frlg: ['CreateMCMenuInputHandlerTask', 0, 'fn'] },
  SCHEDULE_BG_COPY: ['ScheduleBgCopyTilemapToVram', 0, 'fn'],
  DAYCARE_COMPATIBILITY: ['GetDaycareCompatibilityScore', 0, 'fn'],
  TRIGGER_DAYCARE_EGG: ['TriggerPendingDaycareEgg', 0, 'fn'],
  BERRY_TREE_GROW: { emerald: ['BerryTreeGrow', 0, 'fn'] },
  BERRY_STAGE_DURATION: { emerald: ['GetStageDurationByBerryType', 0, 'fn'] },
};

const [emeraldDir, frlgDir] = process.argv.slice(2);
if (!emeraldDir || !frlgDir) {
  console.error('usage: rom-symbols.mjs <pokeemerald dir> <pokefirered dir>');
  process.exit(1);
}
const dirs = { emerald: emeraldDir, frlg: frlgDir };

function symbolTable(path) {
  const table = new Map();
  for (const line of execFileSync('arm-none-eabi-nm', [path], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n')) {
    const [value, , name] = line.split(' ');
    if (name && !table.has(name)) table.set(name, parseInt(value, 16));
  }
  return table;
}

const out = {};
for (const [id, rom] of Object.entries(ROMS)) {
  const table = symbolTable(join(dirs[rom.elf[0]], rom.elf[1]));
  const symbols = {};
  for (const [name, spec] of Object.entries(SYMBOLS)) {
    const [symbol, offset = 0, kind] = (Array.isArray(spec) ? spec : spec[rom.family]) ?? [];
    const address = symbol && table.get(symbol);
    symbols[name] = address === undefined || !symbol ? 0 : address + offset + (kind === 'fn' ? 1 : 0);
  }
  symbols.EMERALD = rom.family === 'emerald' ? 1 : 0;
  out[id] = { family: rom.family, game: rom.game, revision: rom.revision, symbols };
}

const hex = (value) => `0x${value.toString(16).padStart(8, '0')}`;
const body = Object.entries(out).map(([id, rom]) => {
  const symbols = Object.entries(rom.symbols).map(([name, value]) => `      ${name}: ${hex(value)},`).join('\n');
  return `  '${id}': {\n    family: '${rom.family}', game: '${rom.game}', revision: ${rom.revision},\n    symbols: {\n${symbols}\n    },\n  },`;
}).join('\n');
writeFileSync(join(HERE, 'roms.mjs'), `// Written by rom-symbols.mjs from pret's pokeemerald and pokefirered builds.
// Addresses the cards use in each English ROM; routines carry the Thumb bit.

export const ROMS = {
${body}
};
`);
