// cross-check sitemaps + feeds against what actually exists in dist
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

const DIST = '/home/user/gbs-src/dist';
const DOMAIN = 'https://gospod-bog.ru';

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

const pages = walk(DIST).map((p) => {
  const rel = path.relative(DIST, p).split(path.sep).join('/');
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
  const root = parse(fs.readFileSync(p, 'utf8'));
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  return { route, file: rel, noindex: /noindex/i.test(robots) };
});

const exists = new Set(pages.map((p) => p.route));
const indexable = pages.filter((p) => !p.noindex && !p.route.startsWith('/google') && !p.route.startsWith('/yandex') && p.route !== '/404.html');

function parseSitemap(file) {
  const xml = fs.readFileSync(path.join(DIST, file), 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const loc = m[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1] || '';
    const lastmod = m[1].match(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/)?.[1] || null;
    const changefreq = m[1].match(/<changefreq>\s*([^<]*?)\s*<\/changefreq>/)?.[1] || null;
    return { loc, lastmod, changefreq };
  });
  return entries;
}

function parseFeed(file) {
  const xml = fs.readFileSync(path.join(DIST, file), 'utf8');
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    title: (m[1].match(/<title>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/title>/) || [])[1]?.trim(),
    link: (m[1].match(/<link>\s*([^<]+?)\s*<\/link>/) || [])[1],
    pubDate: (m[1].match(/<pubDate>\s*([^<]*?)\s*<\/pubDate>/) || [])[1],
    guid: (m[1].match(/<guid[^>]*>\s*([^<]+?)\s*<\/guid>/) || [])[1],
  }));
  const channelTitle = (xml.match(/<channel>[\s\S]*?<title>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/title>/) || [])[1]?.trim();
  const lastBuild = (xml.match(/<lastBuildDate>\s*([^<]*?)\s*<\/lastBuildDate>/) || [])[1];
  return { file, channelTitle, lastBuild, items };
}

const report = { pages: pages.length, indexable: indexable.length, sitemaps: {}, feeds: {}, problems: [] };

for (const sm of ['sitemap.xml', 'sitemap-pastor-series.xml']) {
  const entries = parseSitemap(sm);
  const locs = entries.map((e) => e.loc);
  const routes = locs.map((l) => l.replace(DOMAIN, '') || '/');
  report.sitemaps[sm] = { entries: entries.length, unique: new Set(routes).size };

  const missingTargets = routes.filter((r) => !exists.has(r));
  const noindexTargets = routes.filter((r) => pages.find((p) => p.route === r)?.noindex);
  if (missingTargets.length) report.problems.push({ kind: 'sitemap→нет файла', sm, items: missingTargets });
  if (noindexTargets.length) report.problems.push({ kind: 'sitemap→noindex', sm, items: noindexTargets });

  const notInSitemap = indexable.map((p) => p.route).filter((r) => !routes.includes(r));
  report.sitemaps[sm].indexableMissing = notInSitemap.length;
  if (notInSitemap.length) report.problems.push({ kind: 'страница есть, в карте нет', sm, items: notInSitemap });

  const lm = entries.map((e) => e.lastmod).filter(Boolean);
  report.sitemaps[sm].lastmodPresent = lm.length;
  report.sitemaps[sm].lastmodExamples = [...new Set(lm)].slice(0, 5);
  report.sitemaps[sm].lastmodMissing = entries.filter((e) => !e.lastmod).map((e) => e.loc);
  const future = lm.filter((d) => Date.parse(d) > Date.now() + 86400000);
  if (future.length) report.problems.push({ kind: 'lastmod в будущем', sm, items: future });
}

for (const f of ['feed.xml', 'feed-pastor-series.xml']) {
  const fd = parseFeed(f);
  const bad = fd.items.filter((i) => i.link && !exists.has(i.link.replace(DOMAIN, '') || '/'));
  report.feeds[f] = { channel: fd.channelTitle, lastBuild: fd.lastBuild, items: fd.items.length, badLinks: bad.map((b) => b.link), firstPub: fd.items[0]?.pubDate, lastPub: fd.items.at(-1)?.pubDate };
  if (bad.length) report.problems.push({ kind: 'feed→битая ссылка', feed: f, items: bad.map((b) => b.link) });
}

console.log(JSON.stringify(report, null, 1));
