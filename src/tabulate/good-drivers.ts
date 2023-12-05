import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { readFileSync, writeFileSync } from "fs";

const driverFile = readFileSync("drivers.csv");
const drivers: Record<string, number>[] = parse(driverFile, {
  columns: true,
  bom: true,
});
const columns = new Set<string>(["date"]);

for (const record of drivers) {
  for (const [driver, elo] of Object.entries(record)) {
    if (elo >= 2020) columns.add(driver);
  }
}

writeFileSync(
  "good-drivers.csv",
  stringify(drivers, { header: true, columns: Array.from(columns) })
);
