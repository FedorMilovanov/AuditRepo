#!/usr/bin/env node
/**
 * diff-canonical.mjs v2 — сверяет реализацию с контрактом (машиночитаемый референс).
 *
 * Usage:
 *   node scripts/diff-canonical.mjs --route gill-part-1     # ищет по роуту
 *   node scripts/diff-canonical.mjs --component GillSeriesMobileBar  # ищет по компоненту
 *   node scripts/diff-canonical.mjs --all
 *
 * Контракт (contracts/*.json) содержит requiredTokens/requiredOrder/forbiddenTokens,
 * а также optional `component` (имя Astro-компонента) — тогда проверка идёт по нему,
 * а не по роут-файлам (честнее: shared-компоненты живут не в роут-папках).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACTS_DIR = join(ROOT, 'contracts');
const SRC_DIR = join(ROOT, 'src');
const JS_DIR = join(ROOT, 'js');

function loadContracts() {
  if (!existsSync(CONTRACTS_DIR)) return [];
  return readdirSync(CONTRACTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try { return JSON.parse(readFileSync(join(CONTRACTS_DIR, f), 'utf8')); }
      catch { console.error(`⚠ contract parse error: ${f}`); return null; }
    })
    .filter(Boolean);
}

function allSourceFiles() {
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/(\.astro|\.ts|\.html|\.js)$/.test(e.name)) out.push(p);
    }
  };
  walk(SRC_DIR);
  if (existsSync(JS_DIR)) walk(JS_DIR);
  return out;
}

function collectFor(contract) {
  const files = allSourceFiles();
  let matched;
  if (contract.component) {
    matched = files.filter((f) => f.includes(contract.component) || f.includes(contract.component.replace(/-/g, '_')));
  } else {
    matched = files.filter((f) => (contract.routes || []).some((r) => f.includes(r) || f.includes(r.replace(/-/g, '_'))));
  }
  let code = '';
  for (const f of matched) code += readFileSync(f, 'utf8') + '\n';
  return { code, files: matched };
}

const args = process.argv.slice(2);
const routeArg = args.includes('--all') ? null : (args[args.indexOf('--route') + 1] || args[args.indexOf('--component') + 1] || null);

let exit = 0;
let checked = 0;
for (const contract of loadContracts()) {
  if (routeArg && contract.id !== routeArg && !(contract.routes || []).includes(routeArg)) continue;
  const { code, files } = collectFor(contract);
  if (!code) { console.log(`\n[${contract.id}] SKIP (нет файлов)`); continue; }
  checked++;

  const req = contract.requiredTokens || [];
  const present = req.filter((t) => code.includes(t));
  const missing = req.filter((t) => !code.includes(t));
  const forbidden = (contract.forbiddenTokens || []).filter((t) => code.includes(t));

  let orderOK = true;
  const ord = contract.requiredOrder || [];
  for (let i = 0; i < ord.length - 1; i++) {
    const a = code.indexOf(ord[i]);
    const b = code.indexOf(ord[i + 1]);
    if (a === -1 || b === -1 || a > b) { orderOK = false; break; }
  }

  const verdict = missing.length === 0 && orderOK ? 'PASS' : 'FAIL';
  if (verdict !== 'PASS') exit = 1;

  console.log(`\n[${contract.id}] mode=${contract.mode || '?'} target=${contract.component || (contract.routes||[]).join(',')}`);
  console.log(`  files: ${files.length}`);
  console.log(`  PRESENT: ${present.length}/${req.length}${present.length ? ' (' + present.join(', ') + ')' : ''}`);
  if (missing.length) console.log(`  MISSING: ${missing.join(', ')}`);
  if (forbidden.length) console.log(`  FORBIDDEN-PRESENT (NEW): ${forbidden.join(', ')}`);
  console.log(`  ORDER: ${orderOK ? 'OK' : 'WRONG'}`);
  console.log(`  VERDICT: ${verdict}`);
}
console.log(`\nПроверено контрактов: ${checked}. Exit=${exit}`);
process.exit(exit);
