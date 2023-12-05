import d from "../../driver-elos.json";
const data = d as Record<string, string>[];

const peaks: Record<string, { elo: number; date: string }> = {};
for (const record of data) {
  for (const [driver, elo] of Object.entries(record)) {
    if (driver === "date") continue;
    if (!peaks[driver] || peaks[driver].elo < Number(elo))
      peaks[driver] = { elo: Number(elo), date: record.date };
  }
}

const entries = Object.entries(peaks)
  .sort((a, b) => b[1].elo - a[1].elo)
  .slice(0, 100);
for (let i = 0; i < entries.length; i++) {
  const [driver, info] = entries[i];
  console.log(`${i + 1}.\t${info.elo.toFixed(1)}\t@ ${info.date}\t${driver}`);
}
