import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

process.stdout.write("reading file... ");
const driverFile = readFileSync("good-drivers.csv");
// const driverFile = readFileSync("constructors.csv");
const drivers: Record<string, number>[] = parse(driverFile, {
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

process.stdout.write("calculating... ");
const dominances: Record<string, number> = {};
for (const elos of drivers) {
  delete elos.date;
  const entries = Object.entries(elos);
  let [best, second] =
    entries[0][1] > entries[1][1]
      ? [entries[0], entries[1]]
      : [entries[1], entries[0]];
  for (let i = 2; i < entries.length; i++) {
    const newEntry = entries[i];
    if (newEntry[1] > best[1]) {
      second = best;
      best = newEntry;
    } else if (newEntry[1] > second[1]) {
      second = newEntry;
    }
  }

  const gap = best[1] - second[1];
  if (!dominances[best[0]] || dominances[best[0]] < gap) {
    dominances[best[0]] = gap;
  }
}
process.stdout.write("done\n");
// console.log(dominances);

const bestOf = Object.entries(dominances)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
for (const b of bestOf) {
  const q = 10 ** (-b[1] / 600),
    wr = 100 / (1 + q);
  console.log(
    `${("00000" + b[1].toFixed(1)).slice(-5)} (${wr.toFixed(1)}% WR) by ${b[0]}`
  );
}
