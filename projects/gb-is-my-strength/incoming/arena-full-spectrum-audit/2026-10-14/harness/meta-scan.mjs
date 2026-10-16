// метаданные и заголовки страниц: разбор БЕЗ учёта порядка атрибутов (урок этой серии:
// фиксированный порядок rel/href или name/content рождает ложные «нет canonical»)
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

const DIST = process.env.DIST || '/home/user/gbs-src/dist';
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['pagefind','_astro','assets','fonts','images','img','js','css'].includes(e.name)) walk(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const noCanon = [], noDesc = [], noindex = [], dupDesc = new Map(), dupTitle = new Map(), noMain = [], badH1 = [];
let n = 0;
for (const p of walk(DIST)) {
  const rel = path.relative(DIST, p).split(path.sep).join('/');
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
  const root = parse(fs.readFileSync(p, 'utf8'));
  n++;
  const canon = root.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content');
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const title = root.querySelector('title')?.text.trim();
  if (!canon) noCanon.push(route);
  if (!desc) noDesc.push(route); else dupDesc.set(desc, [...(dupDesc.get(desc) || []), route]);
  if (/noindex/i.test(robots)) noindex.push(route);
  dupTitle.set(title, [...(dupTitle.get(title) || []), route]);
  if (!root.querySelector('main')) noMain.push(route);
  const h1 = root.querySelectorAll('h1').length;
  if (h1 !== 1) badH1.push({ route, h1 });
}
const d = (m) => [...m.entries()].filter(([, v]) => v.length > 1);
console.log(JSON.stringify({
  pages: n, noCanonical: noCanon, noDescription: noDesc, noindex,
  duplicateDescriptions: d(dupDesc), duplicateTitles: d(dupTitle), withoutMain: noMain, h1NotOne: badH1,
}, null, 1));
