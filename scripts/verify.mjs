#!/usr/bin/env node
// Compare a build output directory with the hashes of the shipped binaries.
//
// usage: node scripts/verify.mjs <build output dir>
//   <build output dir> contains yaneuraou.nnue768.js and yaneuraou.nnue768.wasm (output of build-engine.mjs)
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node scripts/verify.mjs <build output dir>");
  process.exit(2);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const info = JSON.parse(fs.readFileSync(path.join(here, "..", "BUILD-INFO.json"), "utf8"));
let failed = false;
for (const [file, expected] of [
  [info.artifacts.glue.file, info.artifacts.glue.sha256],
  [info.artifacts.wasm.file, info.artifacts.wasm.sha256],
]) {
  const actual = createHash("sha256").update(fs.readFileSync(path.join(dir, file))).digest("hex");
  const ok = actual === expected;
  failed ||= !ok;
  console.log(`${ok ? "OK  " : "FAIL"} ${file}\n     expected ${expected}\n     actual   ${actual}`);
}
process.exit(failed ? 1 : 0);
