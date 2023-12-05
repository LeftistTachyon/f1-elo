import { stringify } from "csv-stringify/sync";
import r from "../driver-elos.json";
import { writeFileSync } from "fs";

const results = r as Record<string, number>[];
const c = new Set<string>();
for (const result of results)
  for (const driver of Object.keys(result)) c.add(driver);

process.stdout.write("cleaning... ");
const latest = results[results.length - 1];
for (const constructor of Object.keys(latest)) {
  for (let i = results.length - 2; i >= 0; i--) {
    if (results[i][constructor] === results[i + 1][constructor])
      delete results[i + 1][constructor];
    else break;
  }
}
process.stdout.write("done\n");

const columns = Array.from(c);
writeFileSync("drivers.csv", stringify(results, { header: true, columns }));
