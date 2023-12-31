import d from "../../data-norm.json";
import { writeFileSync } from "fs";
import type { Race } from "../types";
import { constructorElos, doStep, driverElos } from "./one-v2";

const data = d as Record<string, Race[]>;
const constructorOutput: Record<string, number>[] = [],
  driverOutput: Record<string, number>[] = [];

for (const [year, races] of Object.entries(data)) {
  for (const race of races) {
    doStep(race.results);
    constructorOutput.push(Object.assign({ date: race.date }, constructorElos));
    driverOutput.push(Object.assign({ date: race.date }, driverElos));
  }
  console.log("Completed", year);
}

process.stdout.write("writing files... ");
writeFileSync(
  "constructor-elos.json",
  JSON.stringify(constructorOutput, null, 2)
);
writeFileSync("driver-elos.json", JSON.stringify(driverOutput, null, 2));
process.stdout.write("done\n");
