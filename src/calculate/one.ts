import { Race } from "../types";

type Player = {
  elo: number;
  q: number;
  expected?: number;
  actual: number;
  adj?: number;
  driver: string;
  constructor: string;
};

const race: Race = {
  round: 1,
  results: [
    {
      position: 0,
      positionText: "1",
      driver: "farina",
      constructor: "alfa",
      status: "Finished",
    },
    {
      position: 1,
      positionText: "2",
      driver: "fagioli",
      constructor: "alfa",
      status: "Finished",
    },
    {
      position: 2,
      positionText: "3",
      driver: "reg_parnell",
      constructor: "alfa",
      status: "Finished",
    },
    {
      position: 3,
      positionText: "4",
      driver: "cabantous",
      constructor: "lago",
      status: "+2 Laps",
    },
    {
      position: 4,
      positionText: "5",
      driver: "rosier",
      constructor: "lago",
      status: "+2 Laps",
    },
    {
      position: 5,
      positionText: "6",
      driver: "gerard",
      constructor: "era",
      status: "+3 Laps",
    },
    {
      position: 6,
      positionText: "7",
      driver: "harrison",
      constructor: "era",
      status: "+3 Laps",
    },
    {
      position: 7,
      positionText: "8",
      driver: "etancelin",
      constructor: "lago",
      status: "+5 Laps",
    },
    {
      position: 8,
      positionText: "9",
      driver: "hampshire",
      constructor: "maserati",
      status: "+6 Laps",
    },
    {
      position: 9.5,
      positionText: "10",
      driver: "shawe_taylor",
      constructor: "maserati",
      status: "+6 Laps",
    },
    {
      position: 9.5,
      positionText: "10",
      driver: "fry",
      constructor: "maserati",
      status: "+6 Laps",
    },
    {
      position: 11,
      positionText: "11",
      driver: "claes",
      constructor: "lago",
      status: "+6 Laps",
    },
    {
      position: 12,
      positionText: "R",
      driver: "fangio",
      constructor: "alfa",
      status: "Oil leak",
    },
    {
      position: 13,
      positionText: "N",
      driver: "kelly",
      constructor: "alta",
      status: "Not classified",
    },
    {
      position: 14,
      positionText: "R",
      driver: "bira",
      constructor: "maserati",
      status: "Out of fuel",
    },
    {
      position: 15,
      positionText: "R",
      driver: "murray",
      constructor: "maserati",
      status: "Engine",
    },
    {
      position: 16,
      positionText: "R",
      driver: "crossley",
      constructor: "alta",
      status: "Transmission",
    },
    {
      position: 17,
      positionText: "R",
      driver: "graffenried",
      constructor: "maserati",
      status: "Engine",
    },
    {
      position: 18,
      positionText: "R",
      driver: "chiron",
      constructor: "maserati",
      status: "Clutch",
    },
    {
      position: 19,
      positionText: "R",
      driver: "martin",
      constructor: "lago",
      status: "Oil pressure",
    },
    {
      position: 20.5,
      positionText: "R",
      driver: "peter_walker",
      constructor: "era",
      status: "Gearbox",
    },
    {
      position: 20.5,
      positionText: "R",
      driver: "rolt",
      constructor: "era",
      status: "Gearbox",
    },
    {
      position: 22,
      positionText: "R",
      driver: "leslie_johnson",
      constructor: "era",
      status: "Supercharger",
    },
  ],
};

const STARTING_ELO = 2000;
const DRIVER_RATIO = 0.6,
  CONSTRUCTOR_RATIO = 1 - DRIVER_RATIO;

const driverElos: Record<string, number> = {},
  constructorElos: Record<string, number> = {};

const max = Math.max(...race.results.map((r) => r.position));
const players: Player[] = race.results.map((res) => {
  const driverElo =
    driverElos[res.driver] ?? (driverElos[res.driver] = STARTING_ELO);
  const constructorElo =
    constructorElos[res.constructor] ??
    (constructorElos[res.constructor] = STARTING_ELO);
  const elo = driverElo * DRIVER_RATIO + constructorElo * CONSTRUCTOR_RATIO;

  const q = 10 ** (elo / 400);
  const actual = (max - res.position) / max;
  return { elo, q, actual, driver: res.driver, constructor: res.constructor };
});

for (let i = 0; i < players.length; i++) {
  let otherQs = 0;
  for (let j = 0; j < players.length; j++) {
    if (i == j) continue;
    otherQs += players[j].q;
  }

  const self = (players.length - 1) * players[i].q;
  const expected = self / (self + otherQs);
  players[i].expected = expected;

  const adj = 32 * (players[i].actual - expected);
  players[i].adj = adj;

  driverElos[players[i].driver] += adj / DRIVER_RATIO;
  constructorElos[players[i].constructor] += adj / CONSTRUCTOR_RATIO;
}

console.log(players);
console.log(constructorElos);
console.log(driverElos);
// let sumE = 0,
//   sumA = 0;
// for (const player of players) {
//   sumE += player.expected ?? 0;
//   sumA += player.actual ?? 0;
// }
// console.log(sumE, sumA);
