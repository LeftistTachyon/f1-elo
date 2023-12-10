import { writeFile } from "fs/promises";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { Chart, LineController } from "chart.js";
import ColorHash from "color-hash";

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width: 800,
  height: 400,
  backgroundColour: "white", // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
});
const colorHash = new ColorHash();

class FormulaChart extends LineController {
  draw() {
    super.draw();
    drawLabels(this);
  }
}
FormulaChart.id = "formula-chart";
FormulaChart.defaults = LineController.defaults;

function drawLabels(t: FormulaChart) {
  const ctx = t.chart.ctx;

  // ctx.save();
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";

  const chartInstance = t.chart;
  const datasets = chartInstance.config.data.datasets;
  datasets.forEach((ds, index) => {
    const label = ds.label ?? "";
    const meta = chartInstance.getDatasetMeta(index);
    const len = meta.data.length - 1;
    // console.log(ds, meta.data[len]);
    const xOffset = meta.data[len].x;
    const yOffset = meta.data[len].y;
    ctx.fillText(label, xOffset, yOffset);
  });
  // ctx.restore();
}

Chart.register(FormulaChart);

async function run() {
  const dataUrl = await chartJSNodeCanvas.renderToDataURL({
    // @ts-expect-error
    type: "formula-chart",
    data: {
      labels: [2018, 2019, 2020, 2021],
      datasets: [
        {
          label: "Sample 1",
          data: [10, 15, -20, 15],
          borderColor: colorHash.hex("Sample 1"),
          pointRadius: 0,
        },
        {
          label: "Sample 2",
          data: [10, null, 20, 10],
          borderColor: colorHash.hex("Sample 2"),
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          suggestedMin: 0,
        },
      },
    },
  });

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  await writeFile("out.png", base64Data, "base64");
}
run();
