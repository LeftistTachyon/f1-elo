/// @ts-expect-error
import GIFEncoder from "gif-encoder-2";
import { createCanvas, Image } from "canvas";
import { createWriteStream, readdir } from "fs";
import { promisify } from "util";
import path from "path";

const readdirAsync = promisify(readdir);
const imagesFolder = "frames";

async function createGif(algorithm = "neuquant") {
  process.stdout.write("spinning up... ");
  return new Promise<void>(async (resolve1) => {
    const files = await readdirAsync(imagesFolder);

    const [width, height] = [400, 400];
    const dstPath = `${algorithm}.gif`;
    const writeStream = createWriteStream(dstPath);

    writeStream.on("close", () => {
      resolve1();
    });

    const encoder = new GIFEncoder(width, height, algorithm);

    encoder.createReadStream().pipe(writeStream);
    encoder.start();
    encoder.setDelay(200);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    process.stdout.write("done\n");

    for (const file of files) {
      process.stdout.write(`${file}... `);
      await new Promise<void>((resolve3) => {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          encoder.addFrame(ctx);
          resolve3();
        };
        image.src = path.join(imagesFolder, file);
      });
      process.stdout.write("done\n");
    }

    console.log("DONE!");
  });
}

createGif();
