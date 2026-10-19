const PHYSICAL_TYPES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** FireRed ISO_RANDOMIZE1 (pret; dailyred-improved team gen). */
class IsoRandom {
  constructor(seed) {
    this.state = seed >>> 0;
  }

  next16() {
    this.state = (Math.imul(this.state, 1103515245) + 24691) >>> 0;
    return (this.state >>> 16) & 0xffff;
  }

  next32() {
    const lo = this.next16();
    const hi = this.next16();
    return (lo | (hi << 16)) >>> 0;
  }
}

/** Level-100 party builder (dailyred-improved). */
export class BuildMon {
  constructor({ baseStats, learnsets, moves, types }) {
    this.baseStats = baseStats;
    this.learnsets = learnsets;
    this.moves = moves;
    this.types = types;
  }

  buildParty(speciesIds, seed) {
    const rng = new IsoRandom(seed);
    return speciesIds.map((species) => this.buildOne(species, rng));
  }

  buildOne(species, rng) {
    const personality = rng.next32();
    // Advance ISO stream like dailyred-improved (IVs are not packed; asm uses 31).
    for (let i = 0; i < 6; i++) rng.next16();
    const moves = this.pickMoves(species);
    const evs = this.focusedEvs(species, moves);
    const item = this.pickItem(species, moves);
    return { species, item, moves, evs, personality };
  }

  pickMoves(species) {
    const key = String(species);
    const learn = this.learnsets[key] ?? [];
    const candidates = new Set();
    for (const [, move] of learn) candidates.add(move);

    const scored = [];
    for (const move of candidates) {
      const md = this.moves[String(move)];
      if (!md || md.power < 1) continue;
      let score = (md.power * Math.max(1, md.acc)) / 100;
      const types = this.types[key] ?? [0, 0];
      if (md.type === types[0] || md.type === types[1]) score *= 1.5;
      scored.push({ move, score, type: md.type });
    }
    scored.sort((a, b) => b.score - a.score);

    const picked = [];
    const usedTypes = new Set();
    for (const row of scored) {
      if (picked.length >= 4) break;
      if (picked.length < 2 && usedTypes.has(row.type) && scored.length > 4) continue;
      picked.push(row.move);
      usedTypes.add(row.type);
    }
    if (picked.length < 4) {
      for (let i = learn.length - 1; i >= 0; i--) {
        const move = learn[i][1];
        if (!picked.includes(move)) picked.push(move);
        if (picked.length >= 4) break;
      }
    }
    while (picked.length < 4) picked.push(33);
    return picked.slice(0, 4);
  }

  focusedEvs(species, moves) {
    const st = this.baseStats[String(species)] ?? {
      hp: 50, atk: 50, def: 50, spe: 50, spa: 50, spd: 50,
    };
    let hasPhys = false;
    let hasSpec = false;
    for (const move of moves) {
      const md = this.moves[String(move)];
      if (!md || md.power <= 1) continue;
      if (PHYSICAL_TYPES.includes(md.type)) hasPhys = true;
      else hasSpec = true;
    }
    const usable = { hp: st.hp, def: st.def, spe: st.spe, spd: st.spd };
    if (hasPhys) usable.atk = st.atk;
    if (hasSpec) usable.spa = st.spa;
    const order = ['atk', 'spa', 'spe', 'hp', 'def', 'spd'];
    const keys = Object.keys(usable).sort((a, b) => {
      if (usable[a] !== usable[b]) return usable[b] - usable[a];
      return order.indexOf(a) - order.indexOf(b);
    });
    const [first, second = 'hp', third = 'hp'] = keys;
    const evs = { hp: 0, atk: 0, def: 0, spe: 0, spa: 0, spd: 0 };
    evs[first] = 252;
    evs[second] = 252;
    const remainKey = (first === 'hp' || second === 'hp') ? third : 'hp';
    evs[remainKey] = 6;
    return [evs.hp, evs.atk, evs.def, evs.spe, evs.spa, evs.spd];
  }

  pickItem(species, moves) {
    if (species === 25) return 202;
    if (species === 104 || species === 105) return 224;
    if (moves.includes(156)) return 134;
    return 200;
  }
}
