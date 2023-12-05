import { Result } from "../types";

const STARTING_ELO = 2000;
const DRIVER_RATIO = 0.5,
  CONSTRUCTOR_RATIO = 1 - DRIVER_RATIO;

export const driverElos: Record<string, number> = {},
  constructorElos: Record<string, number> = {};

export function doStep(results: Result[]) {
  const q = new Array<number>(results.length);
  let maxPosition = 0;
  for (let i = 0; i < results.length; i++) {
    const res = results[i];

    // fetching ELOs
    const driverElo =
      driverElos[res.driver] ?? (driverElos[res.driver] = STARTING_ELO);
    const constructorElo =
      constructorElos[res.constructor] ??
      (constructorElos[res.constructor] = STARTING_ELO);

    // calculating Q
    const elo = driverElo * DRIVER_RATIO + constructorElo * CONSTRUCTOR_RATIO;
    q[i] = 10 ** (elo / 400);

    // finding max position
    if (res.position > maxPosition) maxPosition = res.position;
  }

  for (let i = 0; i < results.length; i++) {
    let otherQs = 0;
    for (let j = 0; j < results.length; j++) {
      if (i == j) continue;
      otherQs += q[j];
    }

    const self = (results.length - 1) * q[i];
    const expected = self / (self + otherQs);
    const actual = (maxPosition - results[i].position) / maxPosition;

    const adj = 32 * (actual - expected);
    driverElos[results[i].driver] += adj * DRIVER_RATIO;
    constructorElos[results[i].constructor] += adj * CONSTRUCTOR_RATIO;
  }
}

// doStep(race.results);

// console.log(players);
console.log(constructorElos);
console.log(driverElos);
