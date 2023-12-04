import { writeFile } from "fs/promises";

type Result = {
  position: number;
  positionText: string;
  driver: string;
  constructor: string;
  status: string;
};
type Race = {
  round: number;
  results: Result[];
};

type YearDataIn = {
  round: string;
  Results: {
    position: string;
    positionText: string;
    Driver: { driverId: string };
    Constructor: { constructorId: string };
    status: string;
  }[];
};

async function runDataTabulation() {
  console.log("tabulating data...");

  const output: Record<string, Race[]> = {};
  for (let year = 1950; year <= 2023; year++) {
    const resp = await fetch(
      `https://ergast.com/api/f1/${year}/results.json?limit=1000`
    );

    const data = (await resp.json()).MRData;
    if (data.total == 1000) throw data.total;

    const table = data.RaceTable.Races;
    const yearResults: Race[] = table.map(
      (race: YearDataIn): Race => ({
        round: Number(race.round),
        results: race.Results.map(
          (result): Result => ({
            position: Number(result.position),
            positionText: result.positionText,
            driver: result.Driver.driverId,
            constructor: result.Constructor.constructorId,
            status: result.status,
          })
        ),
      })
    );

    output[year] = yearResults;
    console.log("tabulated", year);
  }

  await writeFile("data.json", JSON.stringify(output, null, 2));
  let races = 0,
    entries = 0;
  for (const r of Object.values(output)) {
    races += r.length;
    for (const e of r) entries += e.results.length;
  }
  console.log(`wrote to file ${races} races and ${entries} entries`);
}

runDataTabulation();
