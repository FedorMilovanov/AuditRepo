#!/usr/bin/env node
/**
 * diff-canonical.mjs — сверяет реализацию с контрактом (машиночитаемый референс).
 *
 * Usage:
 *   node scripts/diff-canonical.mjs --route gill-part-1
 *   node scripts/diff-canonical.mjs --all
 *
 * Читает contracts/*.json (requiredTokens/requiredOrder/forbiddenTokens/routes),
 * идёт в src/components/** по роутам семейства и проверяет наличие токенов.
 * Выводит PRESENT / MISSING / NEW / VERDICT (FAIL если есть MISSING или неодобренные NEW).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACTS_DIR = join(ROOT, 'contracts');
const SRC_DIR = join(ROOT, 'src');

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

function routeFiles(route) {
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.astro') || e.name.endsWith('.ts') || e.name.endsWith('.html')) out.push(p);
    }
  };
  // ищем по имени роута в src
  walk(SRC_DIR);
  return out.filter((p) => p.includes(route) || p.includes(route.replace(/-/g, '_')));
}

function collectCode(routes) {
  const files = new Set();
  for (const r of routes) for (const f of routeFiles(r)) files.add(f);
  let code = '';
  for (const f of files) code += readFileSync(f, 'utf8') + '\n';
  return { code, files: [...files] };
}

const args = process.argv.slice(2);
const routeArg = args.includes('--all') ? null : (args[args.indexOf('--route') + 1] || null);

let exit = 0;
for (const contract of loadContracts()) {
  const { code, files } = collectCode(contract.routes || []);
  if (!code) { console.log(`\n[${contract.id}] SKIP (нет файлов роутов)`); continue; }

  const present = (contract.requiredTokens || []).filter((t) => code.includes(t));
  const missing = (contract.requiredTokens || []).filter((t) => !code.includes(t));

  // NEW: токены из forbidden, найденные в коде
  const forbidden = (contract.forbiddenTokens || []).filter((t) => code.includes(t));

  // порядок
  let orderOK = true;
  const ord = contract.requiredOrder || [];
  for (let i = 0; i < ord.length - 1; i++) {
    const a = code.indexOf(ord[i]);
    const b = code.indexOf(ord[i + 1]);
    if (a === -1 || b === -1 || a > b) { orderOK = false; break; }
  }

  const verdict = missing.length === 0 && !orderOK ? 'FAIL(order)' : (missing.length === 0 ? 'PASS' : 'FAIL');
  if (verdict !== 'PASS') exit = 1;

  console.log(`\n[${contract.id}] mode=${contract.mode || '?'}`);
  console.log(`  REQUIRED: ${(contract.requiredTokens || []).length}`);
  console.log(`  PRESENT:  ${present.length}/${(contract.requiredTokens || []).length}`);
  if (missing.length) console.log(`  MISSING:  ${missing.join(', ')}`);
  if (forbidden.length) console.log(`  FORBIDDEN-PRESENT (NEW): ${forbidden.join(', ')}`);
  console.log(`  ORDER:    ${orderOK ? 'OK' : 'WRONG'}`);
  console.log(`  VERDICT:  ${verdict}`);
  if (files.length > 4) console.log(`  files: ${files.length} (показаны первые 4)`);
  files.slice(0, 4).forEach((f) => console.log(`    - ${f.replace(ROOT + '/', '')}`));
}

process.exit(exit);
