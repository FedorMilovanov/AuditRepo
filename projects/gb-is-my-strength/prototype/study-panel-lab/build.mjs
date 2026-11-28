/**
 * arena-study-panel-lab / build.mjs
 *
 * Read-only extraction from the parent repository into an isolated lab.
 * The parent project is never modified. Run: node build.mjs
 *
 * Sources (all from the checked-out commit, see STATUS.md):
 *   articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
 *   data/glossary.json, data/bible/books.json, data/bible/{synodal,kassian}/*.json
 *   css/site.css, css/reader-preferences.css, css/floating-cluster.css, fonts/*
 *   src/components/article-pilots/_shared/ReaderRail.astro (style block only)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LAB = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = 'articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html';
// Locate the source checkout when this folder is archived under the repo. The
// env override and old sandbox path keep the standalone Arena copy runnable too.
function findSourceRoot() {
  const candidates = [];
  if (process.env.GB_SOURCE_ROOT) candidates.push(path.resolve(process.env.GB_SOURCE_ROOT));
  for (let dir = LAB; ; dir = path.dirname(dir)) {
    candidates.push(dir);
    if (path.dirname(dir) === dir) break;
  }
  candidates.push('/home/user/gb-is-my-strength');
  const root = candidates.find(dir => fs.existsSync(path.join(dir, SRC_HTML)));
  if (!root) throw new Error(`Cannot find source checkout containing ${SRC_HTML}; set GB_SOURCE_ROOT.`);
  return root;
}
const ROOT = findSourceRoot();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const ensure = (p) => fs.mkdirSync(path.join(LAB, p), { recursive: true });
const write = (p, v) => { ensure(path.dirname(p)); fs.writeFileSync(path.join(LAB, p), v); };
const html = read(SRC_HTML);

// ---------------------------------------------------------------- 1. real article
const mainStart = html.indexOf('<main class="article-main');
const mainEnd = html.indexOf('</main>', mainStart) + '</main>'.length;
if (mainStart < 0 || mainEnd < 0) throw new Error('article main not found');
let main = html.slice(mainStart, mainEnd);
// Local asset paths: the original page lives two levels deep. Our lab serves at /.
main = main.replace(/(src|srcset|href)="\.\.\/\.\.\/(images|fonts|css|js|data)\//g, '$1="/vendor/$2/');
main = main.replace(/(src|srcset|href)="\.\.\/(images|fonts|css|js|data)\//g, '$1="/vendor/$2/');
// Remove inert quiz placeholder / scripts that belonged to the production runtime.
main = main.replace(/<script[\s\S]*?<\/script>/g, '');

// ---------------------------------------------------------------- 2. real bible refs
const refsMatch = html.match(/<script id="bibleRefs" type="application\/json">([\s\S]*?)<\/script>/);
if (!refsMatch) throw new Error('bibleRefs not found');
const bibleRefs = JSON.parse(refsMatch[1]);
write('data/bible-refs.json', JSON.stringify(bibleRefs, null, 2));

// ---------------------------------------------------------------- 3. real glossary (only terms actually in this article)
const glossaryAll = JSON.parse(read('data/glossary.json'));
const articleText = main.replace(/<span class="tooltip">[\s\S]*?<\/span>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/g, ' ');
const matched = [];
for (const [key, val] of Object.entries(glossaryAll)) {
  const aliases = [key, ...(val.aliases || [])];
  let count = 0;
  for (const alias of new Set(aliases)) {
    if (alias.length < 4) continue;
    const re = new RegExp('(?<![\\p{L}\\p{N}_])' + alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\p{L}\\p{N}_])', 'giu');
    count += (articleText.match(re) || []).length;
  }
  if (count > 0) matched.push([key, count]);
}
matched.sort((a, b) => b[1] - a[1]);
const glossary = {};
for (const [key] of matched) {
  const v = glossaryAll[key];
  glossary[key] = {
    definition: typeof v.definition === 'string' ? v.definition : (v.definition?.definition || ''),
    detail: v.detail || '',
    aliases: v.aliases || [key],
    category: v.category || '',
  };
}
write('data/glossary.json', JSON.stringify(glossary, null, 2));
write('data/terms-list.json', JSON.stringify(matched.map(([k, c]) => ({ term: k, count: c })), null, 2));

// ---------------------------------------------------------------- 4. real local verse corpus → context
const books = JSON.parse(read('data/bible/books.json'));
const aliasToFile = {};
for (const [id, info] of Object.entries(books.books)) {
  for (const alias of (info.aliases || [])) aliasToFile[alias.replace(/\.$/, '').toLowerCase()] = info.file;
}
const corpusCache = new Map();
function corpus(file) {
  if (!corpusCache.has(file)) {
    const p = path.join(ROOT, 'data/bible', file);
    if (!fs.existsSync(p)) return null;
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    corpusCache.set(file, j);
  }
  return corpusCache.get(file);
}
function parseRef(ref) {
  const m = ref.match(/^(.+?)\s+(\d+)(?::(\d+)(?:[–—-](\d+))?)?([а-яА-Я]?)$/u);
  if (!m) return null;
  return { book: m[1], chapter: +m[2], from: m[3] ? +m[3] : 1, to: m[4] ? +m[4] : (m[3] ? +m[3] : null) };
}
const context = {};
for (const ref of Object.keys(bibleRefs)) {
  const p = parseRef(ref);
  if (!p) continue;
  const file = aliasToFile[p.book.toLowerCase()];
  if (!file) continue;
  const data = corpus(file);
  if (!data) continue;
  // The site's local corpus is sparse: keep every verse of the chapter that
  // actually exists locally, and mark which ones the article cites.
  const rows = [];
  for (const [key, text] of Object.entries(data)) {
    if (key.startsWith('_')) continue;
    const [ch, v] = key.split(':').map(Number);
    if (ch !== p.chapter || !Number.isFinite(v)) continue;
    rows.push({ n: v, text, cited: p.to ? (v >= p.from && v <= p.to) : v === p.from });
  }
  rows.sort((a, b) => a.n - b.n);
  if (rows.length) context[ref] = {
    book: data._meta?.book || p.book,
    translation: data._meta?.translation || 'Локальный корпус сайта',
    chapter: p.chapter,
    from: p.from,
    to: p.to || p.from,
    verses: rows,
  };
}
write('data/bible-context.json', JSON.stringify(context, null, 2));

// ---------------------------------------------------------------- 5. vendor assets (verbatim copies)
const vendorCss = ['css/site.css', 'css/reader-preferences.css', 'css/floating-cluster.css', 'css/command-palette.css'];
for (const f of vendorCss) {
  write(`vendor/css/${path.basename(f)}`, read(f));
}
// ReaderRail's authentic <style is:global> block, reused verbatim.
const rail = read('src/components/article-pilots/_shared/ReaderRail.astro');
const rs = rail.indexOf('<style is:global>'), re = rail.indexOf('</style>', rs);
write('vendor/css/reader-rail.css', rail.slice(rs + '<style is:global>'.length, re));

write('vendor/fonts/fonts.css', read('fonts/fonts.css'));
for (const dir of fs.readdirSync(path.join(ROOT, 'fonts'))) {
  const abs = path.join(ROOT, 'fonts', dir);
  if (!fs.statSync(abs).isDirectory()) continue;
  ensure(`vendor/fonts/${dir}`);
  for (const f of fs.readdirSync(abs)) fs.copyFileSync(path.join(abs, f), path.join(LAB, 'vendor/fonts', dir, f));
}
// Only the images really referenced by our copied main content + the article's own hero.
const imgNames = new Set([...main.matchAll(/["']([^"']*?\.(?:webp|jpg|png|svg|avif))["']/g)].map(m => path.basename(m[1])));
imgNames.add('hermenevtika-preview.webp');
imgNames.add('og-hermenevtika-hristotsentrichnaya-otsenka.webp');
for (const name of imgNames) {
  const src = path.join(ROOT, 'images', name);
  if (fs.existsSync(src)) { ensure('vendor/images'); fs.copyFileSync(src, path.join(LAB, 'vendor/images', name)); }
}

// ---------------------------------------------------------------- 5b. series / book structure
// Real series registry and the two authentic series skins. Nothing is invented:
// data/series.json is the source of truth for parts; the book nesting and the
// progress math are transcribed from hardTextsSeriesConfig.ts + heartSeriesData.ts.
const seriesRegistry = JSON.parse(read('data/series.json'));
const writeJson = (p, v) => write(p, JSON.stringify(v, null, 2));

const gill = seriesRegistry['dzhon-gill'];
writeJson('data/series/gill.json', {
  id: 'dzhon-gill',
  shape: 'flat',
  title: gill.title,
  baseUrl: gill.baseUrl,
  theme: null,
  stepLabel: 'Часть',
  items: gill.parts.map((p, i) => ({ id: p.slug, n: p.n, roman: ['I','II','III','IV','V','VI'][i] || String(p.n), slug: p.slug, title: p.title, minutes: p.readingTime })),
});
const bapt = seriesRegistry['russian-baptism'];
writeJson('data/series/baptisty.json', {
  id: 'russian-baptism',
  shape: 'flat',
  title: bapt.title,
  baseUrl: bapt.baseUrl,
  theme: 'samizdat',
  stepLabel: 'Часть',
  items: bapt.parts.map((p) => ({ id: p.slug, n: p.n, mark: String(p.n), slug: p.slug, title: p.title, minutes: p.readingTime })),
});

// Book model: chapters are heading groups (tier 'chapter'), articles are the
// real pages. Transcribed verbatim from hardTextsSeriesConfig.ts HEART_CHAPTERS
// and the lead/extras ids of heartSeriesData.ts.
const heartCore = fs.readFileSync(path.join(ROOT, 'src/components/article-pilots/_shared/heartSeriesData.ts'), 'utf8');
const slugs = {};
for (const m of heartCore.matchAll(/id: '([^']+)',\s*\n\s*slug: '([^']+)',\s*\n\s*kind: '([^']+)',\s*\n\s*minutes: (\d+)/g)) {
  slugs[m[1]] = { slug: m[2], kind: m[3], minutes: +m[4] };
}
// Satellites live in hardTextsSeriesConfig.ts, not in heartSeriesData.ts.
const heartCfgSrc = fs.readFileSync(path.join(ROOT, 'src/components/article-pilots/_shared/series/hardTextsSeriesConfig.ts'), 'utf8');
for (const m of heartCfgSrc.matchAll(/\{ id: '([^']+)', slug: '([^']+)', minutes: (\d+),\s*\n\s*railTitle: '([^']+)'/g)) {
  slugs[m[1]] = { slug: m[2], kind: 'satellite', minutes: +m[3], title: m[4] };
}
// The lead article of every chapter lives in heartSeriesData.ts, where the human
// title is railTitle («Испорчено ли сердце?»), not the slug id.
for (const m of heartCore.matchAll(/id: '([^']+)',\s*\n\s*slug: '([^']+)',[\s\S]{0,400}?railTitle: '([^']+)'/g)) {
  if (slugs[m[1]]) slugs[m[1]].title = m[3];
}
const BOOK_CHAPTERS = [
  { id: 'ch1', roman: 'I',   title: 'Диагноз сердца',     lead: 'krajne',    extras: ['idoly', 'religioznoe', 'sovest', 'myslennaya', 'dorozhki'] },
  { id: 'ch2', roman: 'II',  title: 'Сердце на войне',    lead: 'rimlyanam', extras: ['yazyk', 'telo', 'sokrovishche', 'tma', 'skorb'] },
  { id: 'ch3', roman: 'III', title: 'Перелом и перемена', lead: 'novoe',     extras: ['menyaetsya', 'iskushenie', 'hranit', 'strah', 'svoboda'] },
  { id: 'ch4', roman: 'IV',  title: 'Жизнь Духом',        lead: 'serdce-duh', extras: ['odinochku', 'hrista', 'osvobozhdennoe'] },
];
const needed = ['prolog', ...BOOK_CHAPTERS.flatMap(c => [c.lead, ...c.extras]), 'spravochnik'];
const missing = needed.filter(id => !slugs[id]);
if (missing.length) throw new Error('book structure: no real page data for ' + missing.join(', '));

const seq = [slugs.prolog, ...BOOK_CHAPTERS.flatMap(c => [slugs[c.lead], ...c.extras.map(id => slugs[id])]), slugs.spravochnik];
const totalMin = seq.reduce((n, p) => n + p.minutes, 0);
const prog = {};
let done = 0;
for (const p of seq) { prog[p.slug] = { doneMin: done, partMin: p.minutes, totalMin }; done += p.minutes; }

const bookItems = [
  { id: 'prolog', tier: 'front', mark: { kind: 'label', value: 'Пролог' }, title: 'Пролог', minutes: slugs.prolog.minutes, slug: slugs.prolog.slug },
  ...BOOK_CHAPTERS.flatMap(c => ([
    { id: c.id, tier: 'chapter', mark: { kind: 'roman', value: c.roman }, title: `Глава ${c.roman}. ${c.title}`, articles: 1 + c.extras.length },
    { id: c.lead, tier: 'article', parent: c.id, mark: { kind: 'arabic', value: '1' }, title: slugs[c.lead].title || c.lead, minutes: slugs[c.lead].minutes, slug: slugs[c.lead].slug },
    ...c.extras.map((id, i) => ({ id, tier: 'article', parent: c.id, mark: { kind: 'arabic', value: String(i + 2) }, title: slugs[id].title || id, minutes: slugs[id].minutes, slug: slugs[id].slug })),
  ])),
  { id: 'spravochnik', tier: 'front', mark: { kind: 'label', value: 'Справочник' }, title: 'Справочник', minutes: slugs.spravochnik.minutes, slug: slugs.spravochnik.slug },
];

writeJson('data/series/heart-book.json', {
  id: 'hard-texts',
  shape: 'book',
  title: seriesRegistry['hard-texts'].title,
  baseUrl: seriesRegistry['hard-texts'].baseUrl,
  theme: null,
  stepLabel: 'Глава',
  totalMin,
  items: bookItems,
  progress: prog,
});

// The two authentic series skins, copied verbatim from the product.
write('vendor/css/series-samizdat.css', read('css/series-samizdat.css'));
write('vendor/css/series-manuscript.css', read('css/series-manuscript.css'));
writeJson('data/series/index.json', {
  gill: { file: 'gill.json', title: gill.title, shape: 'flat' },
  baptisty: { file: 'baptisty.json', title: bapt.title, shape: 'flat' },
  heart: { file: 'heart-book.json', title: seriesRegistry['hard-texts'].title, shape: 'book' },
});

// ---------------------------------------------------------------- 6. shell
const shell = fs.readFileSync(path.join(LAB, 'shell.template.html'), 'utf8');
const out = shell.replace('<!-- __REAL_MAIN__ -->', main);
write('index.html', out);

console.log(`built index.html (${(out.length / 1024).toFixed(0)} KB)`);
console.log(`series: ${Object.keys(seriesRegistry).length} in registry | book items: ${bookItems.length} | book minutes: ${totalMin}`);
console.log(`bible refs: ${Object.keys(bibleRefs).length} | glossary terms in article: ${matched.length} | local verse contexts: ${Object.keys(context).length} | images: ${imgNames.size}`);
