import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { drawChart } from "./chart";

process.stdout.write("reading file... ");
const driverFile = readFileSync("good-drivers.csv");
const drivers: Record<string, number>[] = parse(driverFile, {
  columns: true,
  bom: true,
});
process.stdout.write("done\n");

async function drawFrames() {
  const chars = Math.ceil(Math.log10(drivers.length)),
    pad0 = "0".repeat(chars);
  console.log(`TODO: ${drivers.length} frames`);
  for (let i = 60; i < 61; i++) {
    const index = (pad0 + i).slice(-chars);

    process.stdout.write(`rendering frame #${index}... `);
    const lastFew = drivers.slice(Math.max(0, i - 25), i);
    const dates = lastFew.map((r) => r.date as unknown as string);

    const last = lastFew[lastFew.length - 1];
    const best = Object.entries(last)
      .filter((r) => r[1] && r[0] !== "date")
      .sort((r1, r2) => Number(r2[1]) - Number(r1[1]))
      .slice(0, 10)
      .map((r) => r[0]);
    const sets: Record<string, (number | null)[]> = {};
    for (const record of lastFew) {
      for (const guy of best) {
        const val = Number(record[guy]) || null;
        if (sets[guy]) sets[guy].push(val);
        else sets[guy] = [val];
      }
    }
    // process.stdout.write("done\n");
    // console.log({ last10, best, sets });

    // console.log({ dates, sets });

    // process.stdout.write(`drawing graph #${index}... `);
    await drawChart({ dates, sets }, `frames/${index}.png`);
    process.stdout.write("done\n");
  }

  console.log("rendering complete!");
}

drawFrames();
