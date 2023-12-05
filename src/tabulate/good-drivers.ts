import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { readFileSync, writeFileSync } from "fs";

process.stdout.write("reading file... ");
const driverFile = readFileSync("drivers.csv");
const drivers: Record<string, number>[] = parse(driverFile, {
  columns: true,
  bom: true,
});
const columns = new Set<string>(["date"]);
process.stdout.write("done\n");

for (const record of drivers) {
  for (const [driver, elo] of Object.entries(record)) {
    if (elo >= 2020) columns.add(driver);
  }
}

process.stdout.write("writing file... ");
writeFileSync(
  "good-drivers.csv",
  stringify(drivers, { header: true, columns: Array.from(columns) })
);
process.stdout.write("done\n");
