import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import ColorHash from "color-hash";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import "./chartjs-adapter-luxon.umd.min.js";

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width: 400,
  height: 400,
  backgroundColour: "white", // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
});
const colorHash = new ColorHash();

type ChartInput = {
  dates: string[];
  sets: Record<string, (number | null)[]>;
};

export async function drawChart(
  input: ChartInput,
  fileDestination = "out.png"
) {
  const dataUrl = await chartJSNodeCanvas.renderToDataURL({
    type: "line",
    data: {
      // labels: input.dates.map((date) => DateTime.fromFormat(date, "d/M/y")),
      labels: input.dates,
      datasets: Object.entries(input.sets).map(([label, data]) => ({
        label,
        data,
        borderColor: colorHash.hex(label),
        pointRadius: 0,
      })),
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            // unit: "day",
            // stepSize: 1,
            // displayFormats: {
            //   day: "d MMM yyyy",
            // },
            parser: "d/M/y",
          },
          // min: DateTime.fromFormat(input.dates[0], "d/M/y").toMillis(),
          // max: DateTime.fromFormat(
          //   input.dates[input.dates.length - 1],
          //   "d/M/y"
          // ).toMillis(),
        },
        y: { suggestedMin: 2000 },
      },
    },
  });

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  await writeFile(fileDestination, base64Data, "base64");
}

if (require.main === module) {
  process.stdout.write("reading file... ");
  const driverFile = readFileSync("good-drivers.csv");
  const drivers: Record<string, number>[] = parse(driverFile, {
    columns: true,
    bom: true,
  });
  process.stdout.write("done\n");

  process.stdout.write("calculating... ");
  const lastFew = drivers.slice(-25);
  const dates = lastFew.map((r) => r.date as unknown as string);

  const last = lastFew[lastFew.length - 1];
  delete last.date;
  const best = Object.entries(last)
    .filter((r) => r[1])
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
  process.stdout.write("done\n");
  // console.log({ last10, best, sets });

  process.stdout.write("drawing graph... ");
  drawChart({ dates, sets }).then(() => process.stdout.write("done\n"));
}
