export function createEventDescriptor(partial = {}) {
  return {
    id: partial.id ?? 'custom',
    label: partial.label ?? 'Custom event',
    description: partial.description ?? '',
    serialNo: partial.serialNo ?? 0,
    mbootFlag: partial.mbootFlag ?? 0,
    maxPlayers: partial.maxPlayers ?? 0,
    gnameLabel: partial.gnameLabel ?? partial.gname ?? '',
    unameLabel: partial.unameLabel ?? partial.uname ?? '',
    gnameBytes: partial.gnameBytes ?? null,
    unameBytes: partial.unameBytes ?? null,
    payloadBytes: partial.payloadBytes ?? null,
    guideSteps: partial.guideSteps ?? [],
    game: 'game' in partial ? partial.game : 'emerald',
    roms: partial.roms ?? null,
    variants: partial.variants ?? null,
  };
}

export function identityFromEvent(event) {
  return {
    serialNo: event.serialNo & 0xffff,
    mbootFlag: event.mbootFlag ?? 0,
    maxPlayers: event.maxPlayers ?? 0,
    gnameBytes: event.gnameBytes,
    unameBytes: event.unameBytes,
  };
}

const LANGUAGES = { E: 'English', F: 'French', D: 'German', I: 'Italian', S: 'Spanish', J: 'Japanese' };

// The games an event runs on, FireRed/LeafGreen first, and the language it
// requires, if any. With no event, all games.
export function eventGames(event) {
  if (!event) return { games: ['frlg', 'emerald'], language: null };
  const games = new Set(event.roms
    ? event.roms.map((rom) => (rom.startsWith('BPE') ? 'emerald' : 'frlg'))
    : Object.keys(event.variants ?? { [event.game ?? 'emerald']: true }));
  const languages = new Set((event.roms ?? []).map((rom) => rom[3]));
  return {
    games: ['frlg', 'emerald'].filter((game) => games.has(game)),
    language: languages.size === 1 ? LANGUAGES[[...languages][0]] ?? null : null,
  };
}

// "FireRed, LeafGreen, or Emerald", "FireRed or LeafGreen" or "Emerald",
// prefixed with the language if any.
export function gamesPhrase({ games, language }) {
  const names = games.flatMap((game) => (game === 'frlg' ? ['FireRed', 'LeafGreen'] : ['Emerald']));
  const list = names.length > 2 ? `${names.slice(0, -1).join(', ')}, or ${names.at(-1)}` : names.join(' or ');
  return language ? `${language} ${list}` : list;
}

// Mystery Gift is on the main menu in every game once unlocked: LINK TOGETHER
// WITH ALL on the questionnaire at any Poké Mart counter, then a save. Emerald
// takes the words only after the Pokédex; the first Poké Mart FireRed and
// LeafGreen reach shows its questionnaire only after it.
export function mysteryGiftStep(games) {
  return `On ${gamesPhrase(games)}, unlock Mystery Gift with the Poké Mart questionnaire, then choose `
    + 'Mystery Gift → Wireless Communication on the main menu.';
}
