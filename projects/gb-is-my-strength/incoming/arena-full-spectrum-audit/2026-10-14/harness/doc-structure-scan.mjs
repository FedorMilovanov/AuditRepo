// разведка: структура документа, ARIA-целостность, доступные имена, изображения, семантика
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

const pages = walk(DIST).map((p) => {
  const rel = path.relative(DIST, p).split(path.sep).join('/');
  return { file: rel, route: rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '') };
});

const findings = {
  headingOrder: [], imgNoAlt: [], imgNoDims: [], btnNoName: [], linkNoName: [],
  dupIds: [], ariaDangling: [], hashHref: [], blankNoRel: [], inlineOnclick: [],
  divOnclick: [], imgLazyButAboveFold: [], svgNoLabel: [], iframeNoTitle: [], tabindexPositive: [],
};
const totals = { pages: pages.length, imgs: 0, buttons: 0, links: 0, svgInteractive: 0 };

for (const { file, route } of pages) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8');
  const root = parse(html, { blockTextElements: { script: false, style: false } });

  // заголовки
  const hs = root.querySelectorAll('h1,h2,h3,h4,h5,h6')
    .map((h) => ({ lvl: +h.tagName[1], text: h.text.trim().slice(0, 45) }))
    .filter((h) => h.text.length > 0);
  const skips = [];
  for (let i = 1; i < hs.length; i++) if (hs[i].lvl - hs[i - 1].lvl > 1) skips.push(`${hs[i - 1].lvl}->${hs[i].lvl} «${hs[i].text}»`);
  if (hs.length && hs[0].lvl !== 1) skips.push(`первый заголовок h${hs[0].lvl} «${hs[0].text}»`);
  if (skips.length) findings.headingOrder.push({ route, skips: skips.slice(0, 4), count: skips.length });

  // изображения
  for (const img of root.querySelectorAll('img')) {
    totals.imgs++;
    if (img.getAttribute('alt') === undefined) findings.imgNoAlt.push({ route, src: (img.getAttribute('src') || '').slice(0, 70) });
    const hasDims = img.getAttribute('width') && img.getAttribute('height');
    if (!hasDims) findings.imgNoDims.push({ route, src: (img.getAttribute('src') || '').slice(0, 70) });
  }

  // доступные имена
  for (const b of root.querySelectorAll('button')) {
    totals.buttons++;
    const name = (b.text || '').trim() || b.getAttribute('aria-label') || b.getAttribute('title');
    if (!name) findings.btnNoName.push({ route, html: b.outerHTML.slice(0, 110) });
  }
  for (const a of root.querySelectorAll('a')) {
    totals.links++;
    const name = (a.text || '').trim() || a.getAttribute('aria-label') || a.getAttribute('title');
    const imgAlt = a.querySelector('img')?.getAttribute('alt');
    if (!name && !imgAlt) findings.linkNoName.push({ route, href: a.getAttribute('href'), html: a.outerHTML.slice(0, 110) });
    const href = a.getAttribute('href');
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') findings.hashHref.push({ route, html: a.outerHTML.slice(0, 90) });
    if (a.getAttribute('target') === '_blank' && !/noopener|noreferrer/.test(a.getAttribute('rel') || '')) findings.blankNoRel.push({ route, href: (href || '').slice(0, 70) });
  }

  // id и aria-целостность
  const ids = root.querySelectorAll('[id]').map((e) => e.getAttribute('id'));
  const seen = new Set(); const dup = new Set();
  for (const id of ids) { if (seen.has(id)) dup.add(id); seen.add(id); }
  if (dup.size) findings.dupIds.push({ route, ids: [...dup].slice(0, 5) });
  for (const el of root.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls],[aria-owns],[for]')) {
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'for']) {
      const v = el.getAttribute(attr);
      if (!v) continue;
      for (const ref of v.split(/\s+/)) if (ref && !ids.includes(ref)) findings.ariaDangling.push({ route, attr, ref, tag: el.tagName });
    }
  }
  for (const el of root.querySelectorAll('[tabindex]')) {
    const t = +el.getAttribute('tabindex');
    if (t > 0) findings.tabindexPositive.push({ route, tag: el.tagName, tabindex: t });
  }
  for (const el of root.querySelectorAll('[onclick]')) {
    if (el.tagName === 'DIV' || el.tagName === 'SPAN') findings.divOnclick.push({ route, tag: el.tagName, html: el.outerHTML.slice(0, 90) });
    else findings.inlineOnclick.push({ route, tag: el.tagName, attr: el.getAttribute('onclick').slice(0, 60) });
  }
  for (const svg of root.querySelectorAll('svg')) {
    const interactive = svg.closest('button,a,[role="button"],[tabindex]') !== null || svg.getAttribute('role') === 'button';
    if (interactive) {
      totals.svgInteractive++;
      const labelled = svg.getAttribute('aria-label') || svg.querySelector('title') || svg.closest('[aria-label]') || svg.closest('button')?.text.trim();
      if (!labelled) findings.svgNoLabel.push({ route, html: svg.outerHTML.slice(0, 100) });
    }
  }
  for (const f of root.querySelectorAll('iframe')) if (!f.getAttribute('title')) findings.iframeNoTitle.push({ route, src: (f.getAttribute('src') || '').slice(0, 60) });
}

const summary = { totals, counts: {} };
for (const [k, v] of Object.entries(findings)) summary.counts[k] = v.length;
console.log(JSON.stringify(summary, null, 1));
for (const [k, v] of Object.entries(findings)) {
  if (!v.length) continue;
  console.log(`\n--- ${k} (${v.length}) ---`);
  for (const x of v.slice(0, 6)) console.log('  ' + JSON.stringify(x).slice(0, 180));
}
fs.writeFileSync('/home/user/arena-harness/out/doc-structure-scan.json', JSON.stringify(findings, null, 1));
