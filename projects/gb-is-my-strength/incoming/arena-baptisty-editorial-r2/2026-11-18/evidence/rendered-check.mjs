import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import path from 'node:path';
import Chromium from '@sparticuz/chromium';
import { chromium } from 'playwright';

const [candidate, control, output] = process.argv.slice(2);
assert(candidate && control && output, 'expected candidate-dist, exact-base-dist, output.json');
const mime = new Map(Object.entries({'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.png':'image/png','.woff2':'font/woff2'}));
const statuses = new Map();
async function serve(dist) {
  const root = path.resolve(dist);
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://local.test');
      let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      assert(file.startsWith(root + '/'));
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': mime.get(path.extname(file)) || 'application/octet-stream' }).end(data);
    } catch {
      res.writeHead(404).end('Not in the local dist');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

const slugs = ['', 'noch-na-kure', 'yuzhnaya-shtunda', 'dva-sezda-1884', 'peterburgskaya-liniya', 'goneniya-i-sovest', 'sovetskaya-noch', 'vsehib-1944', 'iniciativnaya-gruppa', 'podpolnaya-pechat', 'spravochnik'];
const changed = ['dva-sezda-1884', 'peterburgskaya-liniya', 'sovetskaya-noch', 'vsehib-1944', 'podpolnaya-pechat', 'spravochnik'];
const site = 'https://gospod-bog.ru';
const route = (slug) => '/baptisty-rossii/' + (slug ? `${slug}/` : '');
const key = (slug) => slug || 'hub';
const witness = 'https://www.rp-net.ru/tools/d_cnt.php?IBLOCK_ID=47&ID=6906';
const alekseeva = 'https://document.wikireading.ru/19046';
const clean = (t) => t.replace(/\s+/gu, ' ').trim();
const excerpts = {};
const linkedSources = {};
const browser = await chromium.launch({ executablePath: await Chromium.executablePath(), headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const live = await serve(candidate);
const past = await serve(control);
const errors = [];
const missing = [];
const snapshots = [];
const contexts = new Map();
async function openPage(width, height) {
  const ctx = await browser.newContext({ viewport: {width, height}, hasTouch: width < 500, colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block' });
  contexts.set(width, ctx);
  await ctx.route(/^https?:\/\//, r => {
    const url = new URL(r.request().url());
    return [live.base, past.base].includes(url.origin) ? r.continue() : r.abort();
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror', e => errors.push([page.url(), e.message]));
  page.on('response', res => {
    const url = new URL(res.url());
    if (url.origin === live.base && res.status() >= 400) missing.push([url.pathname, res.status()]);
  });
  return page;
}
async function collect(page, base, slug, width) {
  const response = await page.goto(base + route(slug), {waitUntil:'load', timeout:15000});
  assert.equal(response?.status(), 200, base + route(slug));
  statuses.set(`${base}:${width}:${slug}`,200);
  const html = await response.text();
  return await page.evaluate(({origin,html}) => {
    // Compare authored output, not glossary nodes inserted at different hydration times.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const norm = t => (t || '').replace(/\s+/gu, ' ').trim();
    const all = (sel, parent=doc) => Array.from(parent.querySelectorAll(sel));
    const txt = (sel, parent=doc) => all(sel, parent).map(x => norm(x.textContent));
    const body = doc.querySelector('article.article-body[data-pagefind-body]');
    if (!body) throw Error('Article root missing');
    const elsWithID = all('[id]', body).map(e => e.id);
    const dup = elsWithID.filter((e,i) => elsWithID.indexOf(e) !== i);
    const hrefs = all('a[href]').map(e => new URL(e.getAttribute('href'), location.href));
    const samePage = [...new Set(hrefs.filter(u => u.hash && [location.origin,origin].includes(u.origin) && u.pathname === location.pathname).map(u => decodeURIComponent(u.hash.slice(1))))].sort();
    const related = [...new Set(hrefs.filter(u => [location.origin, origin].includes(u.origin) && u.pathname.startsWith('/baptisty-rossii/')).map(u => u.pathname + u.hash))].sort();
    return {
      title: doc.title,
      description: doc.querySelector('meta[name=description]')?.content,
      canonical: doc.querySelector('link[rel=canonical]')?.href,
      h1: txt('h1'),
      headings: all('h2,h3', body).map(e => [e.localName, e.id, norm(e.textContent)]),
      captions: txt('figcaption', body),
      imgs: all('img', body).map(e => [e.getAttribute('src'), e.getAttribute('alt')]),
      times: all('time').map(e => [e.getAttribute('datetime'), norm(e.textContent)]),
      summary: txt('.summary-card', body),
      bodyMarkup: body.innerHTML,
      bodyText: norm(body.textContent),
      bodyIds: elsWithID,
      contents: all('#seriesTocOverlay a[href], #partTocOverlay a[href]').map(a => [a.getAttribute('href'), norm(a.textContent)]),
      overflow: document.documentElement.scrollWidth - innerWidth,
      dup,
      samePage,
      broken: samePage.filter(id => !doc.getElementById(id) && !doc.getElementsByName(id).length),
      related,
    };
  }, {origin:site,html});
}
async function paragraph(page, selector) {
  return clean(await page.locator(selector).textContent());
}
async function checkLinks(page, slug, hrefs) {
  for (const href of hrefs) {
    const a = page.locator(`.reading-list-section a[href="${href}"]`);
    assert.equal(await a.count(),1,`${slug}: ${href}`);
    assert.equal(await a.getAttribute('target'), '_blank');
    assert.match(await a.getAttribute('rel') || '', /\bnoopener\b/u);
  }
  linkedSources[slug] = hrefs;
}
function order(text, bits, label) {
  let cursor = 0;
  for (const bit of bits) {
    const i = text.indexOf(bit,cursor);
    assert(i >= 0, `${label}: expected ${bit} after ${cursor} in ${text}`);
    cursor = i + bit.length;
  }
}
async function assertions(page, slug, doc) {
  if (slug === 'dva-sezda-1884') {
    const p = await paragraph(page, '#novo-vasilyevka + p');
    order(p, ['Через несколько недель после петербургского совещания', 'Ново-Васильевке', '№ 323, с. 569'],slug);
    assert(!doc.bodyText.includes('Пока в столице собрание разгоняли'));
    assert(doc.headings.some(e => e[1] === 'petersburg-april-1884' && e[2].includes('1–6 апреля 1884')));
    assert(doc.headings.some(e => e[1] === 'novo-vasilyevka' && e[2].includes('30 апреля — 1 мая 1884')));
    assert(doc.captions.some(t => t.includes('Два события, не один съезд')) && doc.imgs.some(([,alt]) => alt?.includes('схема двух разных событий 1884 года')));
    return p;
  }
  if (slug === 'peterburgskaya-liniya') {
    const lead = page.locator('.article-body p', {hasText:'кавказская история Никиты Воронина'});
    assert.equal(await lead.count(),1);
    assert(!doc.bodyText.includes('Николая Воронина'));
    return clean(await lead.textContent());
  }
  if (slug === 'sovetskaya-noch') {
    const p = await paragraph(page, '#open-window + p');
    order(p,['20 января по старому стилю (2 февраля) 1918 года','принял декрет','23 января (5 февраля) декрет официально опубликовали в правительственной газете (№ 15)'],slug);
    assert(!doc.bodyText.includes('23 января по старому стилю, или 5 февраля 1918 года, Совет народных комиссаров издал'));
    await checkLinks(page, slug, ['https://www.pravenc.ru/text/2578039.html','https://docs.historyrussia.org/ru/nodes/95659']);
    return p;
  }
  if (slug === 'vsehib-1944') {
    const p = await paragraph(page, '#council-state + p');
    order(p,['№ 572 от 19 мая 1944 года','6 июня председателем назначили И. В. Полянского','М. А. Орлов относил создание Совета к июлю','Совет помог созвать'],slug);
    assert(!doc.bodyText.includes('с созданным в июле 1944 года Советом'));
    assert(doc.headings.some(e => e[1] === 'resolution' && e[2].includes('27 октября')));
    await checkLinks(page, slug, ['https://azbyka.ru/otechnik/Istorija_Tserkvi/vlast-i-tserkov-v-vostochnoj-evrope-1944-1953/6','https://mbchurch.ru/publications/brotherly_journal/150/']);
    return p;
  }
  if (slug === 'podpolnaya-pechat') {
    const p = await paragraph(page, '#christian-publisher + p');
    order(p, ['А. Н. Косыгина от 5 июня 1971 года','По изложению Людмилы Алексеевой','Отдельное обращение издательства к верующим датировано 10 июня','№ 115, с. 222–223','архивные оригиналы не сверены'], slug);
    assert.match(doc.summary.join(' '), /заявлении на имя Косыгина от 5 июня 1971 года/u);
    assert.match(doc.bodyText, /Людмила Алексеева приводит оценку: к 1983 году.+около полумиллиона экземпляров Евангелий и духовных сборников/u);
    assert.match(doc.bodyText, /Л\. М\. Алексеева, «История инакомыслия в СССР»/u);
    assert(!/(?:включая М\. Алексееву|\bЛюдмил(а|ы) М\. Алексеева)/u.test(doc.bodyText));
    assert(!doc.bodyText.includes('факт сильно поддержан; нужен оригинал'));
    await checkLinks(page, slug, [witness, alekseeva]);
    return p.slice(p.indexOf('В заявлении'));
  }
  if (slug === 'spravochnik') {
    const lines = await page.locator('#timeline + ul > li').allTextContents();
    const texts = lines.map(clean);
    const i = texts.findIndex(t => t.startsWith('5 июня 1971 —'));
    assert(i >= 0 && texts[i].includes('на имя А. Н. Косыгина'));
    assert.equal(texts[i+1], '10 июня 1971 — отдельное обращение издательства к верующим.');
    assert(!texts[i].includes('нужен полный текст'));
    const docParagraph = await paragraph(page,'#documents + p + p');
    order(docParagraph,['5 июня 1971 года','10 июня перепечатаны','№ 115, с. 222–223','Архивные оригиналы не сверены'],slug);
    assert.match(doc.bodyText, /Документы издательства «Христианин» 1971 года доступны в журнальной перепечатке; оригиналы не сверены\./u);
    assert.match(doc.bodyText, /Никита Исаевич Воронин/u);
    assert(doc.bodyText.includes('Перепечатка документов 1971 года не заменяет сверку оригиналов.'));
    await checkLinks(page, slug, [witness, alekseeva]);
    return [texts[i],texts[i+1],docParagraph];
  }
  if (slug === 'noch-na-kure') assert.match(doc.bodyText, /Никита Исаевич Воронин/u);
}
try {
  const mob = await openPage(390,844);
  const wide = await openPage(1440,950);
  const controlPage = await contexts.get(390).newPage();
  controlPage.setDefaultTimeout(6000);
  const measures = [];
  for (const slug of slugs) {
    const [desktop, mobile, previous] = await Promise.all([
      collect(wide,live.base,slug,1440), collect(mob,live.base,slug,390), collect(controlPage,past.base,slug,390),
    ]);
    assert.equal(mobile.canonical, site+route(slug));
    assert.equal(mobile.h1.length,1);
    for (const field of ['canonical','h1','headings','bodyIds','contents','captions','imgs','title','description','times','samePage','related']) {
      assert.deepEqual(mobile[field], previous[field], `${key(slug)}: ${field} drift from exact base`);
      assert.deepEqual(desktop[field], mobile[field], `${key(slug)}: ${field} drift at 1440`);
    }
    if (slug !== 'podpolnaya-pechat') assert.deepEqual(mobile.summary,previous.summary,`${key(slug)}: summary drift`);
    if (!changed.includes(slug)) assert(mobile.bodyMarkup === previous.bodyMarkup, `${key(slug)}: unchanged body markup diff`);
    else assert(mobile.bodyMarkup !== previous.bodyMarkup, `${key(slug)}: missing expected body diff`);
    assert(mobile.bodyText===desktop.bodyText,`${key(slug)}: compiled body drift at 1440`);
    for (const surface of [mobile,desktop]) {
      assert.deepEqual(surface.dup,[],`${key(slug)}: duplicate IDs in article body`);
      assert.deepEqual(surface.broken,[],`${key(slug)}: broken fragments`);
      assert(surface.overflow <= 2, `${key(slug)}: page overflow ${surface.overflow}`);
    }
    const selected = await assertions(mob, slug, mobile);
    if (selected !== undefined) excerpts[key(slug)] = selected;
    measures.push({route:route(slug),http:200,bodyChanged:changed.includes(slug),samePageUniqueTargets:mobile.samePage.length,seriesPaths:mobile.related.length,figuresWithCaptions:mobile.captions.length,summary:slug==='podpolnaya-pechat'?'one planned text change':'unchanged',overflowPx:{390:mobile.overflow,1440:desktop.overflow}});
    snapshots.push({slug,data:mobile});
    console.log(`PASS ${route(slug)} (390 + 1440, ${mobile.samePage.length} local fragments)`);
  }
  const crossRoute = slugs.map(route);
  let crossRouteFragments = 0;
  for (const {slug,data} of snapshots) {
    for (const href of data.related) {
      const [dest,frag] = href.split('#');
      assert(crossRoute.includes(dest), `${key(slug)}: series path ${dest} not in build set`);
      if (!frag || dest === route(slug)) continue;
      const linkTo = snapshots.find(s => route(s.slug) === dest);
      // Check an actual HTML ID, even if the destination has no same-page link to it.
      const html = await fs.readFile(path.join(candidate,dest.slice(1),'index.html'),'utf8');
      assert(linkTo && html.includes(`id="${decodeURIComponent(frag)}"`),`${key(slug)}: ${href} missing in destination`);
      crossRouteFragments++;
    }
  }
  async function exerciseReferenceToc(page) {
    const overlay = page.locator('#partTocOverlay');
    await page.locator('#mobPartTocBtn').click();
    await page.waitForFunction(() => document.querySelector('#partTocOverlay').getAttribute('aria-hidden') === 'false');
    await overlay.locator('a[href$="#what-to-search-next"]').first().click();
    await page.waitForURL(/#what-to-search-next$/u);
    const reached = await page.waitForFunction(() => {
      const y = document.getElementById('what-to-search-next').getBoundingClientRect().top;
      const closed = document.querySelector('#partTocOverlay').getAttribute('aria-hidden') === 'true';
      return y >= -5 && y < innerHeight && closed ? Math.round(y) : false;
    });
    return {fragment:'#what-to-search-next', overlayCloses:true, headingTopPx:await reached.jsonValue()};
  }
  const [candidateToc,baseToc] = await Promise.all([exerciseReferenceToc(mob), exerciseReferenceToc(controlPage)]);
  assert.deepEqual(candidateToc,baseToc,'reference mobile TOC probe');
  console.log(`PASS mobile reference TOC -> ${candidateToc.fragment}; heading y=${candidateToc.headingTopPx}px; closes on selection.`);
  assert.deepEqual(missing,[], 'candidate local 4xx');
  assert.deepEqual(errors,[], 'uncaught page errors');
  assert.equal(statuses.size,33);
  const report = {
    candidateBase:'9edef94ece08012223c1364bec7ddcd561cf5713',
    comparisonBuild:'9edef94ece08012223c1364bec7ddcd561cf5713',
    buildInstantUtc:'2026-11-18T13:24:28Z',
    environment:'Local production-like dist, headless Chromium. No external network in the browser. Text/structure comparison, not byte identity.',
    browser: browser.version(),
    checkedViewports:[{width:390,height:844},{width:1440,height:950}],
    candidateVisits:22, controlVisits:11, crossRouteFragments,
    headingsIdsContentsCanonicalDatelinesCaptionsMediaAndSeriesDestinationParity:'PASS',
    unchangedBodiesExactMarkup:5,
    mobileReferenceToc:{candidate:candidateToc,base:baseToc},
    duplicateArticleIds:0, brokenSamePageFragments:0, candidateLocal4xx:0, pageErrors:0,
    routes:measures, linkedSources, excerpts,
  };
  await fs.writeFile(output, JSON.stringify(report,null,2)+'\n');
  console.log(`PASS 33 page visits; ${crossRouteFragments} cross-route fragments; ${measures.reduce((a,b)=>a+b.samePageUniqueTargets,0)} unique same-page targets summed across routes.`);
} finally {
  await browser.close();
  await Promise.all([live,past].map(({server})=>new Promise(res=>server.close(res))));
}
