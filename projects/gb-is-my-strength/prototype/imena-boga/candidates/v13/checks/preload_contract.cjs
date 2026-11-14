#!/usr/bin/env node
// The built HTML must reference exactly the two intended, hashed font subsets.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const specs = {
  atlas: { files: ['playfair-display-cyrillic-700-normal-', 'playfair-display-cyrillic-400-italic-'], media: null },
  sozvezdie: { files: ['cormorant-garamond-cyrillic-600-normal-', 'eb-garamond-cyrillic-400-italic-'], media: '(min-width: 360px)' },
};
for (const [app, spec] of Object.entries(specs)) {
  const dist = path.join(root, app, 'dist');
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const tags = [...html.matchAll(/<link\b[^>]*\brel=["']preload["'][^>]*>/gi)].map(m => m[0]);
  const fonts = tags.filter(tag => /\bas=["']font["']/.test(tag));
  if (fonts.length !== spec.files.length) throw Error(app + ': unexpected font preload count ' + fonts.length);
  for (const prefix of spec.files) {
    const matches = fonts.filter(tag => tag.includes('href="./assets/' + prefix));
    if (matches.length !== 1) throw Error(app + ': missing or duplicate preload ' + prefix);
    const tag = matches[0];
    if (!/type=["']font\/woff2["']/.test(tag) || !/\bcrossorigin(?:\s|=|>)/.test(tag)) throw Error(app + ': invalid preload attributes ' + tag);
    const foundMedia = /\bmedia=["']([^"']+)["']/.exec(tag)?.[1] || null;
    if (foundMedia !== spec.media) throw Error(app + ': unexpected preload media ' + foundMedia);
    const file = /href=["']\.\/(assets\/[^"']+\.woff2)["']/.exec(tag)?.[1];
    if (!file || !fs.existsSync(path.join(dist, file))) throw Error(app + ': missing hashed output ' + file);
  }
  console.log('TITLE_PRELOAD_CONTRACT_PASS', JSON.stringify({app,fonts:fonts.length,media:spec.media,hashed:true}));
}
