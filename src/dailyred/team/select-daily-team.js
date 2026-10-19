const MIN_TOTAL = 2700;
const MAX_ATTEMPTS = 1000;

/** Daily species selection (dailyred-improved). */
export class SelectDailyTeam {
  constructor(rows) {
    this.species = rows;
    this.legendaries = rows.filter((s) => s[3] === 1);
    this.byLetter = {};
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
      this.byLetter[letter] = rows.filter(
        (s) => s[3] === 0 && s[1][0].toLowerCase() === letter,
      );
    }
  }

  select(word, seed) {
    if (!/^[a-z]{5}$/.test(word)) throw new Error('Invalid Wordle answer.');
    const pick = this.rng(seed);

    let starSlot = 0;
    let star = null;
    for (let slot = 0; slot < 5; slot++) {
      const pool = this.byLetter[word[slot]];
      if (!pool.length) {
        throw new Error(`No non-legendary for letter ${word[slot].toUpperCase()}`);
      }
      const best = this.strongestOf(pool);
      if (!star || best[2] > star[2]) {
        star = best;
        starSlot = slot;
      }
    }

    const bestLegendary = this.strongestOf(this.legendaries);
    let allowRepeats = false;
    let maximum = this.strongestTeam(word, starSlot, star, false);
    if (!maximum || this.total(maximum) + bestLegendary[2] < MIN_TOTAL) {
      allowRepeats = true;
      maximum = this.strongestTeam(word, starSlot, star, true);
    }
    if (!maximum) throw new Error('No Pokémon team matches this word.');

    let chosen = null;
    let finalLegendary = null;
    if (this.total(maximum) + bestLegendary[2] >= MIN_TOTAL) {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const five = Array(5);
        five[starSlot] = star;
        const taken = new Set([star[0]]);
        for (let slot = 0; slot < 5; slot++) {
          if (slot === starSlot) continue;
          const pool = this.byLetter[word[slot]].filter((s) => allowRepeats || !taken.has(s[0]));
          five[slot] = pool[pick(pool.length)];
          taken.add(five[slot][0]);
        }
        const eligible = this.legendaries.filter((s) => this.total(five) + s[2] >= MIN_TOTAL);
        if (eligible.length) {
          chosen = five;
          finalLegendary = eligible[pick(eligible.length)];
          break;
        }
      }
    }
    chosen ??= maximum;
    if (!finalLegendary) {
      const eligible = this.legendaries.filter((s) => this.total(chosen) + s[2] >= MIN_TOTAL);
      finalLegendary = eligible.length ? eligible[pick(eligible.length)] : bestLegendary;
    }

    return {
      starSlot,
      species: [...chosen, finalLegendary].map(([id, name, baseStats, isLegendary]) => ({
        id,
        name,
        baseStats,
        legendary: Boolean(isLegendary),
      })),
    };
  }

  total(species) {
    return species.reduce((sum, s) => sum + (s ? s[2] : 0), 0);
  }

  strongestOf(pool) {
    return pool.reduce((best, s) => (!best || s[2] > best[2] ? s : best), null);
  }

  strongestTeam(word, starSlot, star, allowRepeats) {
    const chosen = Array(5);
    chosen[starSlot] = star;
    const taken = new Set([star[0]]);
    for (let slot = 0; slot < 5; slot++) {
      if (slot === starSlot) continue;
      const pool = this.byLetter[word[slot]].filter((s) => allowRepeats || !taken.has(s[0]));
      if (!pool.length) return null;
      chosen[slot] = this.strongestOf(pool);
      taken.add(chosen[slot][0]);
    }
    return chosen;
  }

  rng(seed) {
    let state = seed >>> 0;
    return (limit) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return limit > 0 ? state % limit : 0;
    };
  }
}
