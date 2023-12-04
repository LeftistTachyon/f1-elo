import r from "../../driver-elos.json";

process.stdout.write("sorting... ");
const rankings = r as Record<string, number>[];
const latest = rankings[rankings.length - 1];
const sorted = Object.entries(latest).sort((a, b) => b[1] - a[1]);
process.stdout.write("done\n");

for (let i = 0; i < sorted.length && sorted[i][1] >= 2000; i++) {
  console.log(`${i + 1}.\t(${sorted[i][1].toPrecision(5)}) ${sorted[i][0]}`);
}
