#!/usr/bin/env node
// Fetch the exact engine source used for the shipped build and verify it.
//
// usage: node scripts/fetch-source.mjs <target dir>
//   - clones https://github.com/shielune/YaneuraOu (if <target dir> does not exist)
//   - checks out the pinned commit
//   - verifies that `source/` is exactly the tree recorded in SOURCE-TREE.git-ls-tree.txt
//     (git object ids, so the check is independent of OS and line-ending settings)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = "https://github.com/shielune/YaneuraOu";
const COMMIT = "ff8b229b2cffbdd4a2ded35509bf3a66ee2ff6a8"; // tag v9.60.2
const SOURCE_TREE = "7062656f62c9645b5102779cd6a7abbf7b4116be"; // git tree id of `source/` at COMMIT

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/fetch-source.mjs <target dir>");
  process.exit(2);
}
const git = (cwd, ...a) => execFileSync("git", a, { cwd, encoding: "utf8" }).trim();

if (!fs.existsSync(target)) execFileSync("git", ["clone", REPO, target], { stdio: "inherit" });
git(target, "checkout", "--detach", COMMIT);
const head = git(target, "rev-parse", "HEAD");
const tree = git(target, "rev-parse", `${COMMIT}:source`);
const here = path.dirname(fileURLToPath(import.meta.url));
const recorded = fs.readFileSync(path.join(here, "..", "SOURCE-TREE.git-ls-tree.txt"), "utf8").replaceAll(String.fromCharCode(13), "").trim();
const actual = git(target, "ls-tree", "-r", COMMIT, "source");

const problems = [];
if (head !== COMMIT) problems.push(`HEAD is ${head}, expected ${COMMIT}`);
if (tree !== SOURCE_TREE) problems.push(`source/ tree is ${tree}, expected ${SOURCE_TREE}`);
if (actual !== recorded) problems.push("file list of source/ differs from SOURCE-TREE.git-ls-tree.txt");
if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`OK: ${target} is ${COMMIT} and source/ matches the recorded tree (${tree}).`);
console.log(`Next: node scripts/build-engine.mjs --source ${path.join(target, "source")} --out <output dir>`);
