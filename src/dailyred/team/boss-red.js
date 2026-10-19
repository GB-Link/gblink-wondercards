/** RED's Mt. Silver team (dailyred-improved, Gen 3 adapted). */
export function party() {
  const natures = [0, 15, 1, 15, 15, 15];
  const rows = [
    [25, 202, [344, 85, 231, 98], [0, 124, 0, 252, 132, 0]],
    [196, 214, [94, 247, 347, 234], [4, 0, 0, 252, 252, 0]],
    [143, 200, [34, 89, 247, 156], [252, 252, 4, 0, 0, 0]],
    [3, 205, [202, 188, 79, 73], [252, 0, 0, 4, 252, 0]],
    [6, 215, [53, 337, 89, 332], [0, 4, 0, 252, 252, 0]],
    [9, 209, [57, 58, 89, 308], [252, 0, 0, 4, 252, 0]],
  ];
  return rows.map(([species, item, moves, evs], i) => ({
    species,
    item,
    moves,
    evs,
    personality: natures[i],
  }));
}
