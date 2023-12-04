import d from "../../data.json";
import type { Race } from "../types";
import { writeFileSync } from "fs";

const data: Record<string, Race[]> = d as Record<string, Race[]>;
for (const races of Object.values(data)) {
  for (const { results } of races) {
    let lastSet = 0,
      lastPosition = results[0].position;
    for (let i = 1; i < results.length; i++) {
      if (results[i].position !== lastPosition) {
        for (let j = lastSet; j < i; j++) {
          results[j].position = (lastSet + i - 1) / 2;
        }

        lastSet = i;
        lastPosition = results[i].position;
      }
    }

    for (let j = lastSet; j < results.length; j++) {
      results[j].position = (lastSet + results.length - 1) / 2;
    }
  }
}

writeFileSync("data-norm.json", JSON.stringify(data, null, 2));
