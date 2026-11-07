// Guard the canonical @theme palette. Tailwind 4 can silently omit invalid
// utility tokens; never allow a premium UI to ship invisible/missing colors.
// Adapted from the simple Arena variant; no test runner dependencies.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync("src/index.css", "utf8");
const defined = new Set([...css.matchAll(/--color-(ink|gold|cream)-([0-9]+):/g)].map(m => m[1] + "-" + m[2]));
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filename = join(dir, entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (/[.]tsx?$|[.]css$/.test(entry.name)) files.push(filename);
  }
}
walk("src");
const palette = /(?:^|[:\s"'])(?:text|bg|border|ring|from|via|to|decoration|accent|caret|fill|stroke|divide|placeholder)-(ink|gold|cream)-([0-9]+)(?=[/\s"']|$)/g;
let failure = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(palette)) {
    const token = match[1] + "-" + match[2];
    if (!defined.has(token)) {
      console.error("UNDEFINED_PALETTE_COLOR", file, token);
      failure++;
    }
  }
}
if (failure) process.exitCode = 1;
else console.log("PALETTE_CONTRACT_PASS", JSON.stringify({ tokens: defined.size, files: files.length }));
