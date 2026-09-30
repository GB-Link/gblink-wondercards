export const RFU_SERIAL_WONDER_DISTRIBUTOR = 0x7f7d;
export const RFU_GAME_NAME_LENGTH = 13;
export const RFU_USER_NAME_LENGTH = 8;

export const ACTIVITY_WONDER_CARD = 21;
export const LANGUAGE_ENGLISH = 2;
export const LANGUAGE_FRENCH = 3;
export const LANGUAGE_GERMAN = 5;
export const VERSION_EMERALD = 3;
export const VERSION_FIRERED = 4;
export const VERSION_LEAFGREEN = 5;

export function encodePokemonName(ascii, maxLen) {
  const out = new Uint8Array(maxLen);
  out.fill(0xff);
  const s = String(ascii ?? '').toUpperCase();
  let n = 0;
  for (let i = 0; i < s.length && n < maxLen; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0x41 && c <= 0x5a) out[n++] = 0xbb + (c - 0x41);
    else if (c >= 0x30 && c <= 0x39) out[n++] = 0xa1 + (c - 0x30);
    else if (c === 0x20) out[n++] = 0x00;
  }
  if (n < maxLen) out[n] = 0xff;
  return out;
}

export function buildWonderDistributorGname({
  trainerId = 0x1234,
  activity = ACTIVITY_WONDER_CARD,
  hasCard = true,
  hasNews = false,
  language = LANGUAGE_ENGLISH,
  version = VERSION_EMERALD,
} = {}) {
  const g = new Uint8Array(RFU_GAME_NAME_LENGTH);
  let compat = (language & 0xf)
    | ((hasNews ? 1 : 0) << 4)
    | ((hasCard ? 1 : 0) << 5)
    | (0 << 6)
    | (1 << 7)
    | (1 << 8)
    | (1 << 9)
    | ((version & 0xf) << 10);
  g[0] = compat & 0xff;
  g[1] = (compat >> 8) & 0xff;
  g[2] = trainerId & 0xff;
  g[3] = (trainerId >> 8) & 0xff;
  g[8] = 0;
  g[9] = 0;
  g[10] = (activity & 0x7f) | (0 << 7);
  g[11] = 0;
  g[12] = 0;
  return g;
}

export function buildWonderDistributorUname(name = 'DISTRIB') {
  return encodePokemonName(name, RFU_USER_NAME_LENGTH);
}

export function defaultWonderDistributorIdentity(version = VERSION_EMERALD) {
  return {
    serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
    mbootFlag: 0,
    maxPlayers: 0,
    gnameBytes: buildWonderDistributorGname({ version }),
    unameBytes: buildWonderDistributorUname('DISTRIB'),
  };
}

export function frlgWonderDistributorIdentity() {
  return defaultWonderDistributorIdentity(VERSION_FIRERED);
}
