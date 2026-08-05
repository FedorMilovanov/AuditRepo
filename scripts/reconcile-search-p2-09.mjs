#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';

const sourceCommit = 'fab004c03c726eaccb26d4616eb10169b730a8ba';
const sourcePath = 'scripts/reconcile-search-p2-09.mjs';
const tempPath = '.tmp-reconcile-search-p2-09-fixed.mjs';
const oldAnchor = "matrix = replaceOnce(matrix, '## Session log\\n',";
const newAnchor = "matrix = replaceOnce(matrix, '## Session log (append-only)\\n',";

const original = execFileSync('git', ['show', `${sourceCommit}:${sourcePath}`], { encoding: 'utf8' });
const first = original.indexOf(oldAnchor);
if (first < 0 || original.indexOf(oldAnchor, first + oldAnchor.length) >= 0) {
  throw new Error('expected exactly one legacy session-log anchor in authoritative helper');
}
const fixed = original.slice(0, first) + newAnchor + original.slice(first + oldAnchor.length);
writeFileSync(tempPath, fixed, 'utf8');
try {
  execFileSync(process.execPath, [tempPath], { stdio: 'inherit' });
} finally {
  try { unlinkSync(tempPath); } catch {}
}
