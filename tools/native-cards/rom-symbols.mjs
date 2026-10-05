#!/usr/bin/env node
// Writes roms.mjs, the addresses the cards use in each ROM. The English ROMs'
// come from the symbol tables of pret's pokeemerald and pokefirered builds
// (`make`, and `make firered_rev1 leafgreen leafgreen_rev1` for pokefirered);
// every further ROM given, another language's FireRed, LeafGreen or Emerald,
// gets them from port-symbols.mjs, which finds the English 1.0 build's code in it.
//
//   node tools/native-cards/rom-symbols.mjs <pokeemerald dir> <pokefirered dir> [<ROM>...]
//
// Needs arm-none-eabi-nm on PATH. Routines get the Thumb bit.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EnglishBuild, portSymbols } from './port-symbols.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const ROMS = {
  'BPEE 1.0': { family: 'emerald', game: 'E', revision: 0, elf: ['emerald', 'pokeemerald.elf'] },
  'BPRE 1.0': { family: 'frlg', game: 'R', revision: 0, elf: ['frlg', 'pokefirered.elf'] },
  'BPRE 1.1': { family: 'frlg', game: 'R', revision: 1, elf: ['frlg', 'pokefirered_rev1.elf'] },
  'BPGE 1.0': { family: 'frlg', game: 'G', revision: 0, elf: ['frlg', 'pokeleafgreen.elf'] },
  'BPGE 1.1': { family: 'frlg', game: 'G', revision: 1, elf: ['frlg', 'pokeleafgreen_rev1.elf'] },
};

// Name in the card sources: [symbol, offset] for data, [symbol, 0, 'fn'] for
// routines, or { emerald, frlg } when the games name it differently, with
// `japanese` for what the Japanese ROMs do with another routine. A name
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
  DECOMPRESSION_BUFFER: ['gDecompressionBuffer'],
  // gRfu.sendQueue.count; Japanese Emerald's gRfu is laid out as FireRed's.
  SEND_QUEUE_COUNT: { emerald: ['gRfu', 0xc1a], frlg: ['gRfu', 0x8d2], japanese: { emerald: ['gRfu', 0x8d2] } },
  SELECTED_OBJECT: ['gSelectedObjectEvent'],
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
  SCRIPT_STATUS: ['sGlobalScriptContextStatus'],
  TASKS: ['gTasks'],
  PARTY_MENU: ['gPartyMenu'],
  FIELD_CALLBACK: ['gFieldCallback'],
  ITEM_ID: ['gSpecialVar_ItemId'],
  ITEM_ANIM_PLAYED: { frlg: ['sCancelDisabled'] },
  EXEC_FLAGS: ['gBattleControllerExecFlags'],
  SCRIPT_INSTR: ['gBattlescriptCurrInstr'],
  CURRENT_MOVE: ['gCurrentMove'],
  BATTLE_STRUCT: ['gBattleStruct'],
  BATTLE_MONS: ['gBattleMons'],
  BATTLER_ATTACKER: ['gBattlerAttacker'],
  BATTLER_TARGET: ['gBattlerTarget'],
  BATTLER_POSITIONS: ['gBattlerPositions'],
  SIDE_STATUSES: ['gSideStatuses'],
  PROTECT_STRUCTS: ['gProtectStructs'],
  BATTLER_FAINTED: ['gBattlerFainted'],
  SENT_POKES: ['gSentPokesToOpponent'],
  EXP_SHARE_EXP: ['gExpShareExp'],
  BATTLE_SCRIPTING: ['gBattleScripting'],
  BATTLE_TYPE: ['gBattleTypeFlags'],
  BATTLE_OUTCOME: ['gBattleOutcome'],
  BATTLE_MAIN_FUNC: ['gBattleMainFunc'],
  CHOSEN_ACTIONS: ['gChosenActionByBattler'],
  QUEST_LOG_STATE: { frlg: ['gQuestLogState'] },
  // ROM data
  NATURE_NAMES: ['gNatureNamePointers'],
  STAT_NAMES: ['gStatNamesTable'],
  TYPE_NAMES: ['gTypeNames'],
  SPECIES_INFO: ['gSpeciesInfo'],
  ABILITY_NAMES: ['gAbilityNames'],
  ROAMER_LOCATIONS: ['sRoamerLocations'],
  SPECIES_NAMES: ['gSpeciesNames'],
  BATTLE_MOVES: ['gBattleMoves'],
  ITEMS: ['gItems'],
  // field scripts: where a "can't use the move" message returns to, and where
  // the script goes on when a Pokémon knows the move
  CUT_CANT: { emerald: ['EventScript_CheckTreeCantCut', 8], frlg: ['EventScript_CantCutTree', 8] },
  CUT_RESUME: { emerald: ['EventScript_CutTree', 24], frlg: ['EventScript_CutTree', 38] },
  SMASH_CANT: ['EventScript_CantSmashRock', 8],
  SMASH_RESUME: { emerald: ['EventScript_RockSmash', 24], frlg: ['EventScript_RockSmash', 38] },
  STRENGTH_CANT: { emerald: ['EventScript_CantStrength', 8], frlg: ['EventScript_CantMoveBoulder', 8] },
  STRENGTH_RESUME: { emerald: ['EventScript_StrengthBoulder', 33], frlg: ['EventScript_StrengthBoulder', 47] },
  WATERFALL_CANT: { emerald: ['EventScript_CantWaterfall', 8], frlg: ['EventScript_WaterCrashingDown', 8] },
  WATERFALL_RESUME: { emerald: ['EventScript_UseWaterfall', 15], frlg: ['EventScript_Waterfall', 29] },
  DIVE_CANT: { emerald: ['EventScript_CantDive', 8] },
  DIVE_RESUME: { emerald: ['EventScript_UseDive', 15] },
  SURFACE_CANT: { emerald: ['EventScript_CantSurface', 9] },
  SURFACE_RESUME: { emerald: ['EventScript_UseDiveUnderwater', 15] },
  SURF_RESUME: { emerald: ['EventScript_UseSurf', 14], frlg: ['EventScript_UseSurf', 28] },
  CURRENT_TOO_FAST: { frlg: ['EventScript_CurrentTooFast'] },
  // routines
  VBLANK_INTR: ['VBlankIntr', 0, 'fn'],
  RUN_TEXT_PRINTERS: ['RunTextPrinters', 0, 'fn'],
  CB1_OVERWORLD: ['CB1_Overworld', 0, 'fn'],
  CB2_OVERWORLD: ['CB2_Overworld', 0, 'fn'],
  SET_TURN_ORDER: ['SetActionsAndBattlersTurnOrder', 0, 'fn'],
  SPAWN_OBJECT: ['SpawnSpecialObjectEventParameterized', 0, 'fn'],
  SET_HELD_MOVEMENT: ['ObjectEventSetHeldMovement', 0, 'fn'],
  CLEAR_HELD_MOVEMENT: ['ObjectEventClearHeldMovement', 0, 'fn'],
  MOVE_OBJECT_TO: ['MoveObjectEventToMapCoords', 0, 'fn'],
  REMOVE_OBJECT: ['RemoveObjectEvent', 0, 'fn'],
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
  DO_NAMING_SCREEN: ['DoNamingScreen', 0, 'fn'],
  CB2_RETURN_TO_SCRIPT: ['CB2_ReturnToFieldContinueScriptPlayMapMusic', 0, 'fn'],
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
  CREATE_WILD_MON: { emerald: ['CreateWildMon', 0, 'fn'] },
  TASK_FISHING: ['Task_Fishing', 0, 'fn'],
  DESTROY_TASK: ['DestroyTask', 0, 'fn'],
  FRONT_OF_PLAYER: ['GetXYCoordsOneStepInFrontOfPlayer', 0, 'fn'],
  FEEBAS_SPOT: { emerald: ['GetFeebasFishingSpotId', 0, 'fn'] },
  CB2_USE_TM_AFTER_FORGETTING: { frlg: ['CB2_UseTMHMAfterForgettingMove', 0, 'fn'] },
  // the multichoice box (menu.inc)
  CREATE_WINDOW_FROM_RECT: ['CreateWindowFromRect', 0, 'fn'],
  WINDOW_BORDER: { emerald: ['SetStandardWindowBorderStyle', 0, 'fn'], frlg: ['SetStdWindowBorderStyle', 0, 'fn'] },
  PRINT_MENU_ITEMS: { emerald: ['PrintMenuTable', 0, 'fn'], frlg: ['MultichoiceList_PrintItems', 0, 'fn'],
    japanese: { emerald: ['PrintMenuActionTextsWithSpacing', 0, 'fn'] } },
  INIT_MENU_CURSOR: { emerald: ['InitMenuInUpperLeftCornerNormal', 0, 'fn'], frlg: ['Menu_InitCursor', 0, 'fn'],
    japanese: { emerald: ['InitMenuNormal', 0, 'fn'] } },
  MULTICHOICE_TASK: { emerald: ['InitMultichoiceCheckWrap', 0, 'fn'], frlg: ['CreateMCMenuInputHandlerTask', 0, 'fn'] },
  SCHEDULE_BG_COPY: ['ScheduleBgCopyTilemapToVram', 0, 'fn'],
  DAYCARE_COMPATIBILITY: ['GetDaycareCompatibilityScore', 0, 'fn'],
  TRIGGER_DAYCARE_EGG: ['TriggerPendingDaycareEgg', 0, 'fn'],
  BERRY_TREE_GROW: { emerald: ['BerryTreeGrow', 0, 'fn'] },
  BERRY_STAGE_DURATION: { emerald: ['GetStageDurationByBerryType', 0, 'fn'] },
  SETUP_SCRIPT: ['ScriptContext_SetupScript', 0, 'fn'],
  WRITE_SECTOR: ['ProgramFlashSectorAndVerify', 0, 'fn'],
  LOAD_GAME_SAVE: ['LoadGameSave', 0, 'fn'],
  IN_UNION_ROOM: ['InUnionRoom', 0, 'fn'],
  FACING_SURFABLE_WATER: ['IsPlayerFacingSurfableFishableWater', 0, 'fn'],
  SURFING_NORTH: ['IsPlayerSurfingNorth', 0, 'fn'],
  METATILE_BEHAVIOR_AT: ['MapGridGetMetatileBehaviorAt', 0, 'fn'],
  GET_METATILE_ID: ['MapGridGetMetatileIdAt', 0, 'fn'],
  SET_METATILE_ID: ['MapGridSetMetatileIdAt', 0, 'fn'],
  INIT_MAP: ['InitMap', 0, 'fn'],
  DRAW_WHOLE_MAP_VIEW: ['DrawWholeMapView', 0, 'fn'],
  IS_FAST_WATER: { frlg: ['MetatileBehavior_IsFastWater', 0, 'fn'] },
  USE_FLASH: ['FldEff_UseFlash', 0, 'fn'],
  // A New Day: what Emerald does once a day
  CLEAR_DAILY_FLAGS: { emerald: ['ClearDailyFlags', 0, 'fn'] },
  UPDATE_DEWFORD_TREND: { emerald: ['UpdateDewfordTrendPerDay', 0, 'fn'] },
  UPDATE_TV_SHOWS: { emerald: ['UpdateTVShowsPerDay', 0, 'fn'] },
  UPDATE_WEATHER: { emerald: ['UpdateWeatherPerDay', 0, 'fn'] },
  UPDATE_POKERUS: { emerald: ['UpdatePartyPokerusTime', 0, 'fn'] },
  UPDATE_MIRAGE_RND: { emerald: ['UpdateMirageRnd', 0, 'fn'] },
  UPDATE_BIRCH_STATE: { emerald: ['UpdateBirchState', 0, 'fn'] },
  UPDATE_FRONTIER_MANIAC: { emerald: ['UpdateFrontierManiac', 0, 'fn'] },
  UPDATE_FRONTIER_GAMBLER: { emerald: ['UpdateFrontierGambler', 0, 'fn'] },
  SET_SHOAL_ITEM_FLAG: { emerald: ['SetShoalItemFlag', 0, 'fn'] },
  SET_LOTTERY_NUMBER: { emerald: ['SetRandomLotteryNumber', 0, 'fn'] },
  BERRY_TREE_TIME_UPDATE: { emerald: ['BerryTreeTimeUpdate', 0, 'fn'] },
};

const [emeraldDir, frlgDir, ...otherRoms] = process.argv.slice(2);
if (!emeraldDir || !frlgDir) {
  console.error('usage: rom-symbols.mjs <pokeemerald dir> <pokefirered dir> [<ROM>...]');
  process.exit(1);
}
const dirs = { emerald: emeraldDir, frlg: frlgDir };
// The English 1.0 build another language's ROM is found from, by game letter.
const ENGLISH_BASE = {
  E: ['emerald', 'pokeemerald'],
  R: ['frlg', 'pokefirered'],
  G: ['frlg', 'pokeleafgreen'],
};

// A name's [symbol, offset, kind] in a game and language.
const resolve = (spec, family, language) =>
  (language === 'J' && spec.japanese?.[family]) || (Array.isArray(spec) ? spec : spec[family]);

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
    const [symbol, offset = 0, kind] = resolve(spec, rom.family, 'E') ?? [];
    const address = symbol && table.get(symbol);
    symbols[name] = address === undefined || !symbol ? 0 : address + offset + (kind === 'fn' ? 1 : 0);
  }
  symbols.EMERALD = rom.family === 'emerald' ? 1 : 0;
  symbols.JAPANESE = 0;
  out[id] = { family: rom.family, game: rom.game, language: 'E', revision: rom.revision, symbols };
}

const builds = {};
for (const path of otherRoms) {
  const rom = readFileSync(path);
  const code = rom.subarray(0xac, 0xb0).toString('latin1');
  const revision = rom[0xbc];
  const id = `${code} 1.${revision}`;
  const [family, base] = ENGLISH_BASE[code[2]] ?? [];
  if (!code.startsWith('BP') || !family) throw new Error(`${path}: ${code} is not FireRed, LeafGreen or Emerald`);
  builds[base] ??= new EnglishBuild(join(dirs[family], `${base}.elf`), readFileSync(join(dirs[family], `${base}.gba`)));
  const wanted = {};
  for (const [name, spec] of Object.entries(SYMBOLS)) {
    const resolved = resolve(spec, family, code[3]);
    if (resolved) wanted[name] = resolved;
  }
  const { symbols: found, missing } = portSymbols(builds[base], rom, wanted);
  if (missing.length) throw new Error(`${id}: could not place ${missing.join(', ')}`);
  const symbols = {};
  for (const name of Object.keys(SYMBOLS)) symbols[name] = found[name] ?? 0;
  symbols.EMERALD = family === 'emerald' ? 1 : 0;
  symbols.JAPANESE = code[3] === 'J' ? 1 : 0;
  out[id] = { family, game: code[2], language: code[3], revision, symbols };
  console.log(`${id}: ${Object.keys(found).length} addresses`);
}

const hex = (value) => `0x${value.toString(16).padStart(8, '0')}`;
const body = Object.entries(out).map(([id, rom]) => {
  const symbols = Object.entries(rom.symbols).map(([name, value]) => `      ${name}: ${hex(value)},`).join('\n');
  return `  '${id}': {\n    family: '${rom.family}', game: '${rom.game}', language: '${rom.language}', revision: ${rom.revision},\n    symbols: {\n${symbols}\n    },\n  },`;
}).join('\n');
writeFileSync(join(HERE, 'roms.mjs'), `// Written by rom-symbols.mjs from pret's pokeemerald and pokefirered builds,
// and for the other languages from the ROMs themselves. Addresses the cards
// use in each ROM; routines carry the Thumb bit.

export const ROMS = {
${body}
};
`);
