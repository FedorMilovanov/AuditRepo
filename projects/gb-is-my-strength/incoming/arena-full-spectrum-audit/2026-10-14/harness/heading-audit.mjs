// точный замер структуры заголовков: кто идёт первым, где перескоки, виден ли «текущий заголовок»
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

const DIST = '/home/user/gbs-src/dist';
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['pagefind', '_astro', 'assets', 'fonts', 'images', 'img', 'js', 'css'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const rows = [];
for (const p of walk(DIST)) {
  const rel = path.relative(DIST, p).split(path.sep).join('/');
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
  const root = parse(fs.readFileSync(p, 'utf8'));
  const hs = root.querySelectorAll('h1,h2,h3,h4,h5,h6')
    .map((h, i) => ({ i, lvl: +h.tagName[1], text: h.text.trim().replace(/\s+/g, ' ').slice(0, 50), cls: h.getAttribute('class') || '' }))
    .filter((h) => h.text.length > 0);
  if (!hs.length) { rows.push({ route, none: true }); continue; }
  const first = hs[0];
  const firstIsH1 = first.lvl === 1;
  const h1Index = hs.findIndex((h) => h.lvl === 1);
  const jumps = [];
  for (let i = 1; i < hs.length; i++) if (hs[i].lvl - hs[i - 1].lvl > 1) jumps.push({ from: hs[i - 1].lvl, to: hs[i].lvl, text: hs[i].text, cls: hs[i].cls.slice(0, 40) });
  const dist = hs.reduce((a, h) => ((a['h' + h.lvl] = (a['h' + h.lvl] || 0) + 1), a), {});
  rows.push({
    route, firstLvl: first.lvl, firstText: first.text, firstCls: first.cls.slice(0, 40),
    firstIsH1, h1Index, total: hs.length, dist,
    jumps: jumps.map((j) => `h${j.from}->h${j.to} «${j.text}»`), jumpCount: jumps.length,
  });
}
const noH1First = rows.filter((r) => r.firstLvl && r.firstLvl !== 1);
const withJumps = rows.filter((r) => r.jumpCount > 0);
const currentTitle = rows.filter((r) => /gbs2-current-title/.test(r.firstCls));
const noH1 = rows.filter((r) => r.noH1 !== undefined);

console.log('страниц:', rows.length);
console.log('первый заголовок не h1:', noH1First.length);
console.log('  из них с классом gbs2-current-title:', currentTitle.length);
console.log('  позиция h1 среди заголовков (индекс):', JSON.stringify([...new Set(noH1First.map((r) => r.h1Index))]));
console.log('  примеры:', JSON.stringify(noH1First.slice(0, 4).map((r) => ({ r: r.route, first: `h${r.firstLvl} ${r.firstText}`, cls: r.firstCls, h1At: r.h1Index })), null, 0));
console.log('страниц с перескоком уровня:', withJumps.length, '| суммарно перескоков:', withJumps.reduce((a, r) => a + r.jumpCount, 0));
const pat = {};
for (const r of withJumps) for (const j of r.jumps) { const k = j.split(' ')[0]; pat[k] = (pat[k] || 0) + 1; }
console.log('  паттерны перескоков:', JSON.stringify(pat));
console.log('  примеры:');
for (const r of withJumps.slice(0, 6)) console.log(`    ${r.route} -> ${r.jumps.join(' | ')}`);

fs.writeFileSync('/home/user/arena-harness/out/heading-audit.json', JSON.stringify({ rows, noH1First, withJumps, pat }, null, 1));
