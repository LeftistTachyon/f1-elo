import { Result } from "../types";

// const race: Race = {
//   round: 1,
//   results: [
//     {
//       position: 0,
//       positionText: "1",
//       driver: "farina",
//       constructor: "alfa",
//       status: "Finished",
//     },
//     {
//       position: 1,
//       positionText: "2",
//       driver: "fagioli",
//       constructor: "alfa",
//       status: "Finished",
//     },
//     {
//       position: 2,
//       positionText: "3",
//       driver: "reg_parnell",
//       constructor: "alfa",
//       status: "Finished",
//     },
//     {
//       position: 3,
//       positionText: "4",
//       driver: "cabantous",
//       constructor: "lago",
//       status: "+2 Laps",
//     },
//     {
//       position: 4,
//       positionText: "5",
//       driver: "rosier",
//       constructor: "lago",
//       status: "+2 Laps",
//     },
//     {
//       position: 5,
//       positionText: "6",
//       driver: "gerard",
//       constructor: "era",
//       status: "+3 Laps",
//     },
//     {
//       position: 6,
//       positionText: "7",
//       driver: "harrison",
//       constructor: "era",
//       status: "+3 Laps",
//     },
//     {
//       position: 7,
//       positionText: "8",
//       driver: "etancelin",
//       constructor: "lago",
//       status: "+5 Laps",
//     },
//     {
//       position: 8,
//       positionText: "9",
//       driver: "hampshire",
//       constructor: "maserati",
//       status: "+6 Laps",
//     },
//     {
//       position: 9.5,
//       positionText: "10",
//       driver: "shawe_taylor",
//       constructor: "maserati",
//       status: "+6 Laps",
//     },
//     {
//       position: 9.5,
//       positionText: "10",
//       driver: "fry",
//       constructor: "maserati",
//       status: "+6 Laps",
//     },
//     {
//       position: 11,
//       positionText: "11",
//       driver: "claes",
//       constructor: "lago",
//       status: "+6 Laps",
//     },
//     {
//       position: 12,
//       positionText: "R",
//       driver: "fangio",
//       constructor: "alfa",
//       status: "Oil leak",
//     },
//     {
//       position: 13,
//       positionText: "N",
//       driver: "kelly",
//       constructor: "alta",
//       status: "Not classified",
//     },
//     {
//       position: 14,
//       positionText: "R",
//       driver: "bira",
//       constructor: "maserati",
//       status: "Out of fuel",
//     },
//     {
//       position: 15,
//       positionText: "R",
//       driver: "murray",
//       constructor: "maserati",
//       status: "Engine",
//     },
//     {
//       position: 16,
//       positionText: "R",
//       driver: "crossley",
//       constructor: "alta",
//       status: "Transmission",
//     },
//     {
//       position: 17,
//       positionText: "R",
//       driver: "graffenried",
//       constructor: "maserati",
//       status: "Engine",
//     },
//     {
//       position: 18,
//       positionText: "R",
//       driver: "chiron",
//       constructor: "maserati",
//       status: "Clutch",
//     },
//     {
//       position: 19,
//       positionText: "R",
//       driver: "martin",
//       constructor: "lago",
//       status: "Oil pressure",
//     },
//     {
//       position: 20.5,
//       positionText: "R",
//       driver: "peter_walker",
//       constructor: "era",
//       status: "Gearbox",
//     },
//     {
//       position: 20.5,
//       positionText: "R",
//       driver: "rolt",
//       constructor: "era",
//       status: "Gearbox",
//     },
//     {
//       position: 22,
//       positionText: "R",
//       driver: "leslie_johnson",
//       constructor: "era",
//       status: "Supercharger",
//     },
//   ],
// };

const STARTING_ELO = 2000;
const DRIVER_RATIO = 0.6,
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
    driverElos[results[i].driver] += adj / DRIVER_RATIO;
    constructorElos[results[i].constructor] += adj / CONSTRUCTOR_RATIO;
  }
}

// doStep(race.results);

// console.log(players);
console.log(constructorElos);
console.log(driverElos);
