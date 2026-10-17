// articles-catalog.mjs — каталог /articles/: карточки, даты, заголовки; и какая статья где упомянута.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { parse } from 'node-html-parser';

const DIST = process.env.DIST || '/home/user/gbs-src/dist';
const OUT = process.env.OUT || process.env.OUT || './out';
const norm = s => (s || '').replace(/\s+/g, ' ').trim();

const cat = parse(readFileSync(`${DIST}/articles/index.html`, 'utf8'));
const cards = cat.querySelectorAll('.article-card, article, li').map(el => {
  const a = el.querySelector('a[href^="/articles/"]');
  if (!a) return null;
  const text = norm(el.textContent);
  const date = norm(el.querySelector('time')?.textContent || '');
  const dateAttr = el.querySelector('time')?.getAttribute('datetime') || null;
  const h = norm(el.querySelector('h1, h2, h3, h4')?.textContent || '');
  return { href: a.getAttribute('href'), heading: h, date, dateAttr, text: text.slice(0, 200) };
}).filter(Boolean);
const uniq = new Map();
for (const c of cards) if (!uniq.has(c.href)) uniq.set(c.href, c);
const catalog = [...uniq.values()];

// все постройки: slug -> его <title>
const files = readdirSync(`${DIST}/articles`).filter(f => f !== 'index.html');
const slugs = files.map(f => ({ slug: f, titleFile: existsSync(`${DIST}/articles/${f}/index.html`) ? norm(parse(readFileSync(`${DIST}/articles/${f}/index.html`, 'utf8')).querySelector('title')?.textContent || '') : null }));

// что главная упоминает (из home-listings.json)
const mentioned = new Set();
try {
  const home = JSON.parse(readFileSync(`${OUT}/home-listings.json`, 'utf8'));
  for (const mode of ['desktop', 'mobile']) {
    for (const s of home[mode].sections) for (const l of s.links) {
      const h = (l.href || '').replace(/^\//, '');
      if (h.startsWith('articles/')) mentioned.add(h.replace('articles/', '').replace(/\/$/, ''));
    }
  }
} catch { console.log('(нет ./out/home-listings.json — сверка с главной пропущена)'); }

const report = {
  catalogCount: catalog.length,
  dirCount: files.length,
  catalogWithDate: catalog.filter(c => c.date).length,
  catalogSample: catalog.slice(0, 3),
  mentionedOnHome: [...mentioned],
  inCatalogNotMentioned: catalog.map(c => c.href.replace('/articles/', '').replace(/\/$/, '')).filter(s => !mentioned.has(s)),
  mentionedNotInCatalog: [...mentioned].filter(s => !files.includes(s)),
};
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/articles-catalog.json`, JSON.stringify({ report, catalog, slugs }, null, 1));
console.log(JSON.stringify(report, null, 1));
console.log('\n=== карточки каталога (href | heading | date) ===');
for (const c of catalog) console.log(`${c.href.padEnd(58)} | ${c.heading.slice(0, 60).padEnd(60)} | ${c.date}`);
