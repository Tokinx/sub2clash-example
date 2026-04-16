import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedTargets = ["public/assets", "public/index.html"];

await Promise.all(
  generatedTargets.map((target) =>
    rm(path.join(rootDir, target), {
      force: true,
      recursive: true
    })
  )
);
