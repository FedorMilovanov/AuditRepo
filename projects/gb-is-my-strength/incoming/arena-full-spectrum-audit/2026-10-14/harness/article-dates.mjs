// article-dates.mjs — даты публикации/обновления всех статей из JSON-LD + сверка с главной
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse } from 'node-html-parser';

const DIST = process.env.DIST || '/home/user/gbs-src/dist';
const OUT = process.env.OUT || process.env.OUT || './out';
const norm = s => (s || '').replace(/\s+/g, ' ').trim();

const slugs = readdirSync(`${DIST}/articles`).filter(f => f !== 'index.html');
const rows = [];
for (const slug of slugs) {
  const html = readFileSync(`${DIST}/articles/${slug}/index.html`, 'utf8');
  const root = parse(html);
  const blocks = root.querySelectorAll('script[type="application/ld+json"]').map(s => {
    try { return JSON.parse(s.textContent); } catch { return null; }
  }).filter(Boolean);
  let published = null, modified = null, type = null;
  for (const top of blocks.flat()) {
    const items = [];
    const push = x => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(push); if (x['@graph']) x['@graph'].forEach(push); items.push(x); };
    push(top);
    for (const it of items) {
      if (it && (it.datePublished || it.dateModified)) {
        published = published || it.datePublished || null;
        modified = modified || it.dateModified || null;
        type = type || it['@type'] || null;
      }
    }
  }
  const h1 = norm(root.querySelector('h1')?.textContent || '');
  const title = norm(root.querySelector('title')?.textContent || '');
  rows.push({ slug, published, modified, type, h1: h1.slice(0, 90), title: title.slice(0, 90) });
}
rows.sort((a, b) => String(b.published || '').localeCompare(String(a.published || '')));

const mentioned = new Set();
try {
  const home = JSON.parse(readFileSync(`${OUT}/home-listings.json`, 'utf8'));
  for (const mode of ['desktop', 'mobile']) for (const s of home[mode].sections) for (const l of s.links || []) {
    const h = (l.href || '').replace(/^\//, '');
    if (h.startsWith('articles/')) mentioned.add(h.replace('articles/', '').replace(/\/$/, ''));
  }
} catch { console.log('(нет ./out/home-listings.json — сверка с главной пропущена; сначала запустите home-listings.mjs)'); }

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/article-dates.json`, JSON.stringify({ rows, mentioned: [...mentioned] }, null, 1));
console.log('всего статей:', rows.length, '| с датой публикации:', rows.filter(r => r.published).length, '| на главной упомянуто:', mentioned.size);
console.log('\n=== 12 самых свежих (по datePublished) ===');
for (const r of rows.slice(0, 12)) {
  const onHome = mentioned.has(r.slug) ? 'НА ГЛАВНОЙ' : '—';
  console.log(`${(r.published || 'нет').slice(0, 10)} | ${(r.modified || '—').slice(0, 10)} | ${onHome.padEnd(10)} | ${r.slug.slice(0, 44).padEnd(44)} | ${r.h1.slice(0, 45)}`);
}
console.log('\n=== 8 самых старых ===');
for (const r of rows.slice(-8)) {
  console.log(`${(r.published || 'нет').slice(0, 10)} | ${r.slug.slice(0, 50).padEnd(50)} | ${r.h1.slice(0, 40)}`);
}
