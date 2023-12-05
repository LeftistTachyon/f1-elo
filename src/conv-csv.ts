process.stdout.write("loading json... ");
import { stringify } from "csv-stringify/sync";
import c from "../constructor-elos.json";
import d from "../driver-elos.json";
import { writeFileSync } from "fs";
process.stdout.write("done\n");

const isConstructor = process.argv[2]?.toLowerCase() === "true";
const results = (isConstructor ? c : d) as Record<string, number>[];
const col = new Set<string>();
for (const result of results)
  for (const driver of Object.keys(result)) col.add(driver);

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

process.stdout.write("writing file... ");
const columns = Array.from(col);
writeFileSync(
  isConstructor ? "constructors.csv" : "drivers.csv",
  stringify(results, { header: true, columns })
);
process.stdout.write("done\n");
