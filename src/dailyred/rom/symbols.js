/**
 * Per-ROM addresses for English BPRE/BPGE 1.0/1.1 and BPEE 1.0
 * (pret pokefirered / pokeemerald).
 *
 * Only symbols used by the deliveryman script and Thumb bake are kept.
 */

export const ROMS = ['BPRE 1.0', 'BPRE 1.1', 'BPGE 1.0', 'BPGE 1.1', 'BPEE 1.0'];

function all() {
  const frRam = {
    PARTY: 0x02024284,
    PARTY_COUNT: 0x02024029,
    ENEMY_PARTY: 0x0202402c,
    BATTLE_TYPE: 0x02022b4c,
    TRAINER_BATTLE_OPPONENT_A: 0x020386ae,
    MAIN: 0x030030f0,
    SB1_PTR: 0x03005008,
    SCRIPT_CONTEXT: 0x03000eb0,
    TASKS: 0x03005090,
    SET_MAIN_CALLBACK2: 0x08000545,
    CLOSE_LINK: 0x080098b9,
  };

  const fr10Code = {
    CREATE_MON: 0x0803da55,
    SET_MON_DATA: 0x0804037d,
    SET_MON_MOVE_SLOT: 0x0803e965,
    CALCULATE_STATS: 0x0803e47d,
    CREATE_TASK: 0x0807741d,
    PLAY_MAP_BGM: 0x08044091,
    BATTLE_TRANSITION_START: 0x080d08b9,
    IS_BATTLE_TRANSITION_DONE: 0x080d08f9,
    CLEANUP_OVERWORLD: 0x080563f1,
    CB2_INIT_BATTLE: 0x0800fd9d,
    SCRIPT_CONTEXT_STOP: 0x08069b29,
    CB2_RETURN: 0x080568e1,
  };

  const frlgMeta = {
    TRAINER_OPPONENT_ID: 514, // TRAINER_PLAYER_RED
    MUS_BATTLE: 299, // MUS_VS_CHAMPION
    SPECIAL_SAVE_PARTY: 39,
    SPECIAL_LOAD_PARTY: 40,
    scriptInSaveBlock1: 0x3624,
  };

  const d = 0x14;
  const fr11Code = Object.fromEntries(
    Object.entries(fr10Code).map(([k, v]) => [k, v + d]),
  );

  const fr10 = {
    ...frRam,
    ...fr10Code,
    game: 'R',
    revision: 0,
    ...frlgMeta,
  };

  const fr11 = {
    ...frRam,
    ...fr11Code,
    SET_MAIN_CALLBACK2: 0x08000545 + d,
    CLOSE_LINK: 0x080098b9 + d,
    game: 'R',
    revision: 1,
    ...frlgMeta,
  };

  const lg10 = { ...fr10, game: 'G' };

  const shift = 0x30c5c;
  const lg11 = {
    game: 'G',
    revision: 1,
    PARTY: 0x02024190,
    PARTY_COUNT: 0x0202418d,
    ENEMY_PARTY: 0x020243e8,
    BATTLE_TYPE: 0x02022c90,
    TRAINER_BATTLE_OPPONENT_A: 0x02038802,
    MAIN: 0x03002360,
    SB1_PTR: 0x03005aec,
    SCRIPT_CONTEXT: 0x03000e40,
    TASKS: 0x03005a00,
    SET_MAIN_CALLBACK2: 0x08000545 + d,
    CREATE_MON: 0x08067731,
    SET_MON_DATA: 0x0806a775,
    SET_MON_MOVE_SLOT: 0x08068d35,
    CALCULATE_STATS: 0x0806884d,
    CREATE_TASK: 0x0807741d + d + shift,
    PLAY_MAP_BGM: 0x08044091 + d + shift,
    BATTLE_TRANSITION_START: 0x080d08b9 + d + shift,
    IS_BATTLE_TRANSITION_DONE: 0x080d08f9 + d + shift,
    CLEANUP_OVERWORLD: 0x080563f1 + d + shift,
    CB2_INIT_BATTLE: 0x0800fd9d + d + shift,
    SCRIPT_CONTEXT_STOP: 0x080988c5,
    CB2_RETURN: 0x08085b21,
    CLOSE_LINK: 0x080098b9 + d + shift,
    ...frlgMeta,
  };

  const em = {
    game: 'E',
    revision: 0,
    PARTY: 0x020244ec,
    PARTY_COUNT: 0x020244e9,
    ENEMY_PARTY: 0x02024744,
    BATTLE_TYPE: 0x02022fec,
    TRAINER_BATTLE_OPPONENT_A: 0x02038bca,
    MAIN: 0x030022c0,
    SB1_PTR: 0x03005d8c,
    SCRIPT_CONTEXT: 0x03000e40,
    TASKS: 0x03005e00,
    SET_MAIN_CALLBACK2: 0x08000541,
    scriptInSaveBlock1: 0x3730,
    CREATE_MON: 0x08067b4d,
    SET_MON_DATA: 0x0806acad,
    SET_MON_MOVE_SLOT: 0x080691f5,
    CALCULATE_STATS: 0x08068d0d,
    CREATE_TASK: 0x080a8fb1,
    PLAY_MAP_BGM: 0x0806e669,
    BATTLE_TRANSITION_START: 0x08145ef5,
    IS_BATTLE_TRANSITION_DONE: 0x08145f21,
    CLEANUP_OVERWORLD: 0x08085d35,
    CB2_INIT_BATTLE: 0x08036761,
    SCRIPT_CONTEXT_STOP: 0x08098f31,
    CB2_RETURN: 0x080861cd,
    CLOSE_LINK: 0x080097e9,
    TRAINER_OPPONENT_ID: 851, // TRAINER_RED
    MUS_BATTLE: 478, // MUS_VS_CHAMPION
    SPECIAL_SAVE_PARTY: 40,
    SPECIAL_LOAD_PARTY: 41,
  };

  return {
    'BPRE 1.0': fr10,
    'BPRE 1.1': fr11,
    'BPGE 1.0': lg10,
    'BPGE 1.1': lg11,
    'BPEE 1.0': em,
  };
}

const MAP = all();

export function forRom(romId) {
  if (!MAP[romId]) throw new Error(`Unknown ROM id: ${romId}`);
  return MAP[romId];
}
