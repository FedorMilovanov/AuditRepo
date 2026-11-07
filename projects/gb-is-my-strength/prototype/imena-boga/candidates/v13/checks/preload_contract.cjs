#!/usr/bin/env node
// Exact build artifact contract: two hashed title WOFF2 preloads, no duplicates.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const app = 'atlas';
const dir = path.join(root, app, 'dist');
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const links = [...html.matchAll(/<link\b[^>]*\brel=["']preload["'][^>]*>/gi)].map(m => m[0]);
const expected = ['playfair-display-cyrillic-700-normal-', 'playfair-display-cyrillic-400-italic-'];
if (links.length !== expected.length) throw Error('Expected exactly two font preloads, got ' + links.length);
for (const prefix of expected) {
  const hits = links.filter(tag => tag.includes('href="./assets/' + prefix));
  if (hits.length !== 1) throw Error('Missing/duplicate title preload ' + prefix);
  const tag = hits[0];
  if (!/\bas=["']font["']/.test(tag) || !/type=["']font\/woff2["']/.test(tag) || !/\bcrossorigin(?:\s|=|>)/.test(tag)) throw Error('Incorrect preload attributes: ' + tag);
  const filename = /href=["']\.\/(assets\/[^"']+\.woff2)["']/.exec(tag)?.[1];
  if (!filename || !fs.existsSync(path.join(dir, filename))) throw Error('Missing referenced font file: ' + filename);
}
const other = fs.readFileSync(path.join(root, 'sozvezdie', 'dist', 'index.html'), 'utf8');
if (/<link\b[^>]*\brel=["']preload["'][^>]*\bas=["']font["']/.test(other)) throw Error('Unapproved Constellation font preloads');
console.log('TITLE_PRELOAD_CONTRACT_PASS', JSON.stringify({app,preloads:links.length,nestedAssets:true,sozvezdieUnchanged:true}));
