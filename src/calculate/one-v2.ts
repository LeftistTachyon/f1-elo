import { Result } from "../types";

const STARTING_ELO = 2000;
const DRIVER_RATIO = 0.6,
  CONSTRUCTOR_RATIO = 1 - DRIVER_RATIO;

export const driverElos: Record<string, number> = {},
  constructorElos: Record<string, number> = {};

export function doStep(results: Result[]) {
  const qC = new Array<number>(results.length),
    qD = new Array<number>(results.length);
  let maxPosition = 0;
  for (let i = 0; i < results.length; i++) {
    const res = results[i];

    // fetching ELOs
    const driverElo =
      driverElos[res.driver] ?? (driverElos[res.driver] = STARTING_ELO);
    const constructorElo =
      constructorElos[res.constructor] ??
      (constructorElos[res.constructor] = STARTING_ELO);

    // calculating Qs
    qC[i] = 10 ** (constructorElo / 600);
    qD[i] = 10 ** (driverElo / 600);

    // finding max position
    if (res.position > maxPosition) maxPosition = res.position;
  }

  for (let i = 0; i < results.length; i++) {
    let expectedD = 0,
      expectedC = 0;
    for (let j = 0; j < results.length; j++) {
      if (i == j) continue;
      expectedD +=
        DRIVER_RATIO / (qD[i] + qD[j]) + CONSTRUCTOR_RATIO / (qD[i] + qC[j]);
      expectedC +=
        DRIVER_RATIO / (qC[i] + qD[j]) + CONSTRUCTOR_RATIO / (qC[i] + qC[j]);
    }
    expectedD *= qD[i] / (results.length - 1);
    expectedC *= qC[i] / (results.length - 1);

    const actual = (maxPosition - results[i].position) / maxPosition;

    constructorElos[results[i].constructor] += 16 * (actual - expectedC);
    driverElos[results[i].driver] += 16 * (actual - expectedD);
  }
}
