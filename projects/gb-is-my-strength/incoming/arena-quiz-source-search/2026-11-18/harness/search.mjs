// Reader-search witness against the trusted, unmodified exact Product archive + production-like dist.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , productArg, outArg, executablePath, filter] = process.argv;
if (!productArg || !outArg || !executablePath) throw new Error('Usage: node search.mjs PRODUCT OUT CHROMIUM [scenario-filter]');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const { parse } = requireProduct('parse5');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const dist = path.join(product, 'dist');
const census = JSON.parse(fs.readFileSync(path.join(out, 'census.json'), 'utf8'));
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const relative = value => { const u = new URL(value); return u.pathname + u.search + u.hash; };
const G1 = '/articles/dzhon-gill-chast-1-chelovek/';
const G2 = '/articles/dzhon-gill-chast-2-uchenyi/';
const K = '/articles/krajne-li-isporcheno-serdce/';
const A = '/articles/otstuplenie-chto-govorit-bibliya/';
const profiles = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark', reducedMotion: 'reduce' },
  desktop: { viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' },
};
const args = ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'];
const sheet = '#gillLearningOverlay';
const input = '#learningSearchInput';
const status = '#learningSearchStatus';
const buttons = '#learningSearchResults .gill-search-result';
const min = 'Введите минимум 2 символа';
const notFound = 'Ничего не найдено';
const targetClass = '.is-search-target';
const dec = s => decodeURIComponent(new URL(s, 'https://gospod-bog.ru').hash.slice(1));

function markedRoots(route) {
  const roots = [];
  const file = path.join(dist, route, 'index.html');
  const walk = n => {
    if (n.attrs?.some(a => a.name === 'data-pagefind-body')) roots.push({ tag: n.tagName, cls: n.attrs.find(a => a.name === 'class')?.value ?? '' });
    (n.childNodes ?? []).forEach(walk);
  };
  walk(parse(fs.readFileSync(file, 'utf8')));
  return roots;
}
const sheetRoots = census.sheet.map(({ route, questions }) => ({ route, deck: questions.length > 0, roots: markedRoots(route) }));
assert.equal(sheetRoots.length, 68);
const extras = sheetRoots.filter(r => r.roots.length > 1);
assert.equal(extras.length, 3);
assert.ok(extras.every(r => r.roots.length === 2 && r.roots[1].cls.includes('gb-note-endnotes')));

async function openSheet(page, profile) {
  const selector = profile === 'mobile' ? '#mobSettingsBtn' : '#railSettingsBtn';
  await page.locator(selector).click();
  await page.locator('#mobLearningBtn').click();
  await page.locator(`${sheet}.is-open`).waitFor();
}
async function activateSearch(page) {
  await page.locator('#tabSearch').click();
  await page.locator(input).waitFor();
  assert.equal(await page.locator(input).getAttribute('aria-label'), 'Найти в этой статье');
}
async function lookup(page, rec, q, expectedCount) {
  await page.locator(input).fill('');
  await page.waitForFunction(([status, min]) => document.querySelector(status).textContent === min, [status, min]);
  await page.locator(input).fill(q);
  if (q.length >= 2) {
    await page.waitForFunction(([status, min]) => document.querySelector(status).textContent !== min, [status, min]);
  }
  const d = await page.evaluate(({ q, status, buttons }) => {
    const plain = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
    const includes = s => plain(s).toLocaleLowerCase('ru').includes(q.toLocaleLowerCase('ru'));
    // innerText alone can include opacity:0 footnote payload at desktop width.
    // Remove only CSS-nonpainted text when witnessing the small authored blocks below.
    const visibleText = el => {
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const chunks = [];
      for (let node = walk.nextNode(); node; node = walk.nextNode()) {
        let visible = true;
        for (let p = node.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (s.display === 'none' || s.visibility !== 'visible' || Number(s.opacity) === 0) { visible = false; break; }
        }
        if (visible) chunks.push(node.textContent);
      }
      return plain(chunks.join(''));
    };
    const all = [...document.querySelectorAll(buttons)];
    const roots = [...document.querySelectorAll('[data-pagefind-body]')];
    const sourceNodes = q.length < 2 ? [] : roots.flatMap(root => [...root.querySelectorAll('h2,h3,p,blockquote,li,figcaption,td,th,.ancient-epigraph,.manuscript-quote-text')]);
    const matching = sourceNodes.map(n => ({ n, readable: visibleText(n) })).filter(({ n, readable }) =>
      n.getClientRects().length && (includes(readable) || includes(n.textContent)));
    const projection = window.GBReaderProjection;
    return {
      q, count: all.length, status: document.querySelector(status).textContent,
      inputFocused: document.activeElement?.id === 'learningSearchInput',
      readerProjectionIncludes: typeof projection?.getSearchText === 'function' && q.length >= 2 ? includes(projection.getSearchText()) : null,
      results: all.slice(0, 6).map(b => ({ heading: plain(b.querySelector('strong').textContent), snippet: plain(b.querySelector('span').textContent), marks: [...b.querySelectorAll('mark')].map(m => m.textContent) })),
      candidates: matching.slice(0, 8).map(({ n, readable }) => ({
        id: n.id, tag: n.tagName, parentId: n.parentElement.id, root: roots.indexOf(n.closest('[data-pagefind-body]')),
        rawIncludes: includes(n.textContent), renderedIncludes: includes(readable), renderedExcerpt: readable.slice(0, 265),
        endnoteRootClipped: getComputedStyle(n.closest('[data-pagefind-body]')).clip !== 'auto',
        auxiliary: [...n.querySelectorAll('[data-reader-linear-aux]')].slice(0, 3).map(x => ({
          kind: x.getAttribute('data-reader-linear-aux'), pagefindIgnored: x.hasAttribute('data-pagefind-ignore'), rawIncludes: includes(x.textContent),
          visibility: getComputedStyle(x).visibility, opacity: getComputedStyle(x).opacity, open: x.classList.contains('is-open'),
        })),
      })),
    };
  }, { q, status, buttons });
  rec.queries.push(d);
  assert.equal(d.count, expectedCount, q);
  assert.equal(d.status, q.length < 2 ? min : expectedCount ? `Найдено: ${expectedCount}` : notFound, q);
  return d;
}

async function landed(page, q, expectedId) {
  await page.locator(`${sheet}.is-open`).waitFor({ state: 'detached' });
  await page.locator(targetClass).waitFor();
  const data = await page.evaluate(({ targetClass, q }) => {
    const n = document.querySelector(targetClass);
    const r = n.getBoundingClientRect();
    const x = (Math.max(0, r.left) + Math.min(innerWidth, r.right)) / 2;
    const y = (Math.max(0, r.top) + Math.min(innerHeight, r.bottom)) / 2;
    const top = document.elementFromPoint(x, y);
    // Same CSS filter for the landed target. No DOM or authored style changes.
    const walk = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
    let text = '';
    for (let node = walk.nextNode(); node; node = walk.nextNode()) {
      let visible = true;
      for (let el = node.parentElement; el; el = el.parentElement) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility !== 'visible' || Number(s.opacity) === 0) { visible = false; break; }
      }
      if (visible) text += node.textContent;
    }
    const a = document.activeElement;
    return {
      target: { id: n.id, tag: n.tagName, rect: { top: Math.round(r.top), bottom: Math.round(r.bottom) }, hit: n.contains(top), hasFocus: n === a, queryInRenderedText: text.replace(/\s+/gu, ' ').toLocaleLowerCase('ru').includes(q.toLocaleLowerCase('ru')) },
      viewport: { width: innerWidth, height: innerHeight }, active: { tag: a.tagName, id: a.id },
      scrollY: Math.round(scrollY), maskHidden: document.getElementById('gillLearningOverlay').getAttribute('aria-hidden'),
      overflow: getComputedStyle(document.body).overflowY, hash: location.hash,
    };
  }, { targetClass, q });
  assert.equal(data.target.id, expectedId);
  assert.ok(data.target.rect.top < data.viewport.height && data.target.rect.bottom > 0);
  assert.ok(data.target.hit);
  assert.equal(data.maskHidden, 'true');
  assert.notEqual(data.overflow, 'hidden');
  return data;
}

const jobs = [];
const add = (name, route, fn) => { for (const profile of Object.keys(profiles)) jobs.push({ name, route, profile, fn }); };
add('visible-phrase-vs-footnote', G1, async (page, rec) => {
  const q = '23 ноября 1697 года по старому стилю в Кеттеринге';
  const missing = await lookup(page, rec, q, 0);
  assert.ok(missing.candidates.some(n => n.renderedIncludes && !n.rawIncludes && n.tag === 'P' && n.auxiliary.some(t => t.kind === 'footnote')));
  const short = await lookup(page, rec, '23 ноября 1697 года', 1);
  assert.match(short.results[0].snippet, /⟦сноска:/u);
  if (rec.profile === 'mobile') await page.locator(`${sheet} [role="dialog"]`).screenshot({ path: path.join(out, 'footnote-in-search.png'), animations: 'disabled' });
  const note = 'Nov. 23, o. s. 1697';
  const hidden = await lookup(page, rec, note, 1);
  const paragraph = hidden.candidates.find(n => n.tag === 'P' && n.root === 0);
  assert.ok(paragraph && !paragraph.renderedIncludes && paragraph.auxiliary.some(x => x.rawIncludes && !x.open && x.pagefindIgnored));
  assert.ok(hidden.candidates.some(n => n.tag === 'LI' && n.root === 1 && n.rawIncludes && n.endnoteRootClipped), 'separate endnote record exists, but was not activated');
  await page.locator(buttons).click();
  rec.landing = await landed(page, note, paragraph.id);
  assert.equal(rec.landing.target.queryInRenderedText, false);
});
add('visible-phrase-vs-definition', K, async (page, rec) => {
  const q = 'Кархемише (605 до н.э.)';
  const missing = await lookup(page, rec, q, 0);
  assert.ok(missing.candidates.some(n => n.renderedIncludes && !n.rawIncludes && n.auxiliary.some(t => t.kind === 'definition')));
  const short = await lookup(page, rec, 'Иеремия служил в последние десятилетия', 1);
  assert.match(short.results[0].snippet, /⟦определение:/u);
  const term = 'Навуходоносор II разгромил египтян';
  const aux = await lookup(page, rec, term, 1);
  const paragraph = aux.candidates.find(n => n.tag === 'P' && n.auxiliary.some(x => x.rawIncludes && !x.open && x.pagefindIgnored));
  assert.ok(paragraph && !paragraph.renderedIncludes);
  await page.locator(buttons).click();
  rec.landing = await landed(page, term, paragraph.id);
  assert.equal(rec.landing.target.queryInRenderedText, false);
});
add('visible-caption-table-quote-and-cap', G2, async (page, rec) => {
  for (const [q, tag] of [
    ['Перо и чернильница — символ многолетней', 'FIGCAPTION'],
    ['Сопоставление цитат ВЗ с масоретским текстом', 'TD'],
    ['Богословие будучи ничем иным', 'DIV'],
  ]) {
    const miss = await lookup(page, rec, q, 0);
    assert.ok(miss.candidates.some(n => n.renderedIncludes && n.rawIncludes && n.tag === tag && n.root === 0), `${tag} is visibly present in indexed root`);
  }
  const ok = await lookup(page, rec, 'Называть его первым трудом такого рода', 1);
  assert.ok(ok.candidates.some(n => n.renderedIncludes && n.tag === 'P'));
  await lookup(page, rec, 'Гилл', 20);
  // Count distinct candidate DOM blocks, not word frequency or Pagefind results.
  rec.rawMatchingBlocks = await page.locator('[data-pagefind-body]').first().locator('h2,h3,p,blockquote,li').evaluateAll(nodes => nodes.filter(n => {
    return !n.closest('.gbs2-toc, [data-fc-root], [data-fc-controls], #quizPlaceholder, .fn-marker, .source-tooltip') && n.textContent.replace(/\s+/gu, ' ').trim().length >= 8 && n.textContent.toLocaleLowerCase('ru').includes('гилл');
  }).length);
  assert.ok(rec.rawMatchingBlocks > 20);
  await lookup(page, rec, 'Г', 0);
});

async function answerLexeme(page, rec) {
  await page.locator('#tabQuiz').click();
  const pool = JSON.parse(await page.locator('#gillQuizData').getAttribute('data-quiz'));
  const readQuestion = () => page.locator('#glsQuizQuestion').textContent().then(norm);
  let q = await readQuestion();
  for (let i = 0; i < pool.length; i++) {
    const item = pool.find(x => norm(x.question) === q);
    assert.ok(item, q);
    await page.locator('#glsQuizConf [data-conf="sure"]').click();
    const answer = item.answers.find((_, idx) => idx !== item.correctIndex);
    await page.locator('#glsQuizOptions').getByRole('button', { name: answer, exact: true }).click();
    await page.locator('#glsQuizVerdict:not([hidden])').waitFor();
    if (item.id === 'apostasy.p1.lexeme') {
      rec.answeredToReach = i + 1;
      rec.item = item.id;
      assert.match(await page.locator('#glsQuizVerdict').textContent(), /Неверно/u);
      return;
    }
    await page.locator('#glsQuizNext').click();
    await page.waitForFunction(prev => document.getElementById('glsQuizQuestion').textContent.trim() !== prev, q);
    q = await readQuestion();
  }
  throw new Error('Lexeme item not encountered in one full deck');
}
const quizState = page => page.evaluate(() => {
  const text = id => document.getElementById(id).textContent.trim();
  return { question: text('glsQuizQuestion'), verdict: text('glsQuizVerdict'), explanation: text('glsQuizExplanation'), seen: text('glsQuizStreak'), calibration: text('glsQuizCalibPct'), source: document.getElementById('glsQuizSource').getAttribute('href') };
});
add('quiz-miss-search-quote-reopen-outline-control', A, async (page, rec) => {
  await answerLexeme(page, rec);
  rec.quizBefore = await quizState(page);
  await activateSearch(page);
  const q = 'Лексема — доказательство внутри контекста, а не готовая система спасения';
  const got = await lookup(page, rec, q, 2);
  assert.deepEqual(got.results.map(x => x.snippet), [`${q}.`, `${q}.`]);
  const quote = got.candidates.find(n => n.tag === 'BLOCKQUOTE');
  const p = got.candidates.find(n => n.tag === 'P' && n.parentId === quote?.id);
  assert.ok(quote?.id && p?.id);
  assert.ok(got.inputFocused);
  const target = rec.profile === 'mobile' ? quote : p;
  const steps = rec.profile === 'mobile' ? 1 : 2;
  rec.tabSteps = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab');
    rec.tabSteps.push(await page.locator(buttons).nth(i).evaluate(n => n === document.activeElement));
  }
  assert.ok(rec.tabSteps.every(Boolean));
  await page.keyboard.press('Enter');
  rec.landing = await landed(page, q, target.id);
  assert.ok(rec.landing.target.queryInRenderedText);
  assert.equal(rec.landing.hash, '');
  assert.equal(rec.landing.target.hasFocus, false);
  // Restore-window control, not a general latency measurement.
  await page.evaluate(() => new Promise(r => setTimeout(r, 520)));
  rec.focusSettled = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }));
  assert.notEqual(rec.focusSettled.id, target.id);
  await openSheet(page, rec.profile);
  await activateSearch(page);
  rec.queryRetained = await page.locator(input).inputValue();
  assert.equal(rec.queryRetained, q);
  await page.locator('#tabQuiz').click();
  rec.quizAfterSearch = await quizState(page);
  assert.deepEqual(rec.quizAfterSearch, rec.quizBefore);
  await page.locator(targetClass).waitFor({ state: 'detached' });
  await page.locator('#tabOutline').click();
  const card = page.locator('#panelOutline [data-outline-link]').filter({ hasText: 'Одно слово не рассказывает весь порядок спасения' });
  rec.outlineHref = await card.getAttribute('href');
  assert.equal(rec.outlineHref, '#odno-slovo');
  await card.click();
  rec.outlineLanding = await landed(page, 'Одно слово не рассказывает весь порядок спасения', dec(rec.outlineHref));
  assert.ok(rec.outlineLanding.target.queryInRenderedText);
  assert.equal(rec.outlineLanding.target.hasFocus, false);
});
add('local-to-global-search-control', G2, async (page, rec) => {
  const q = 'Грэнтем';
  await lookup(page, rec, q, 1);
  await page.locator('#globalSearchBtn').click();
  const field = page.getByRole('combobox', { name: 'Поиск', exact: true });
  await field.waitFor();
  await page.waitForFunction(() => document.activeElement.matches('input[role="combobox"][aria-label="Поиск"]'));
  rec.global = { afterHandoff: await field.inputValue(), learningHidden: await page.locator(sheet).getAttribute('aria-hidden'), focused: true };
  assert.equal(rec.global.afterHandoff, '');
  assert.equal(rec.global.learningHidden, 'true');
  await field.fill(q);
  const found = page.locator('#cp-listbox [role="option"]').filter({ hasText: 'Томас Грэнтем' }).first();
  await found.waitFor();
  rec.global.hit = norm(await found.innerText());
  assert.match(rec.global.hit, /Часть II: Учёный.*было бы неточно/u);
  await page.keyboard.press('Escape');
  await field.waitFor({ state: 'hidden' });
  await openSheet(page, rec.profile);
  await activateSearch(page);
  rec.global.localQueryStillThere = await page.locator(input).inputValue();
  assert.equal(rec.global.localQueryStillThere, q);
  assert.ok(rec.pagefindResponses.length, 'expected successful local Pagefind requests');
});

const selected = jobs.filter(j => !filter || j.name.includes(filter));
assert.ok(selected.length, 'No matching scenarios');
const assets = [G1, G2, K, A].map(r => `${r}index.html`).concat(['/js/search.js', '/pagefind/pagefind-entry.json']);
const learningBundle = fs.readdirSync(path.join(dist, '_astro')).filter(f => /^GillLearningSheet.*\.js$/u.test(f));
assert.equal(learningBundle.length, 1);
assets.push(`/_astro/${learningBundle[0]}`);
const witness = {
  productCommit: '9edef94ece08012223c1364bec7ddcd561cf5713',
  playwright: requireProduct('playwright/package.json').version, node: process.version, args, profiles,
  serviceWorkers: 'block', artifactSha256: Object.fromEntries(assets.map(f => [f, createHash('sha256').update(fs.readFileSync(path.join(dist, f))).digest('hex')])),
  scope: { panels: sheetRoots.length, withQuiz: sheetRoots.filter(x => x.deck).length, extraSearchRoots: extras },
  runs: new Array(selected.length),
};
const { server, base } = await serve();
let browser;
try {
  browser = await chromium.launch({ executablePath, args });
  witness.browser = browser.version();
  let i = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    for (;;) {
      const ix = i++;
      if (ix >= selected.length) return;
      const { name, route, profile, fn } = selected[ix];
      const rec = { name, route, profile, pageErrors: [], localHttpErrors: [], pagefindResponses: [], queries: [], mainNavigations: [] };
      witness.runs[ix] = rec;
      const ctx = await browser.newContext({ ...profiles[profile], serviceWorkers: 'block' });
      const page = await ctx.newPage();
      page.setDefaultTimeout(9000);
      page.on('pageerror', e => rec.pageErrors.push(e.message));
      page.on('response', r => {
        if (!r.url().startsWith(`${base}/`)) return;
        if (r.status() >= 400) rec.localHttpErrors.push(`${r.status()} ${relative(r.url())}`);
        if (r.ok() && relative(r.url()).startsWith('/pagefind/')) rec.pagefindResponses.push(relative(r.url()));
      });
      page.on('framenavigated', f => { if (f === page.mainFrame()) rec.mainNavigations.push(relative(f.url())); });
      try {
        const response = await page.goto(base + route, { waitUntil: 'load' });
        assert.ok(response?.ok());
        await openSheet(page, profile);
        if (name !== 'quiz-miss-search-quote-reopen-outline-control') await activateSearch(page);
        await fn(page, rec);
        assert.deepEqual(rec.pageErrors, []);
        assert.deepEqual(rec.localHttpErrors, []);
        assert.deepEqual(rec.mainNavigations, [route]);
        rec.ok = true;
      } catch (e) {
        rec.ok = false;
        rec.error = `${e.name}: ${e.message}`;
      } finally {
        await ctx.close();
      }
      console.log(`${rec.ok ? 'PASS' : 'FAIL'} ${name} ${profile}${rec.ok ? '' : ` — ${rec.error}`}`);
    }
  }));
} finally {
  await browser?.close();
  await new Promise(r => server.close(r));
  fs.writeFileSync(path.join(out, 'search-witness.json'), JSON.stringify(witness, null, 2) + '\n');
}
const passed = witness.runs.filter(r => r?.ok).length;
console.log(`${passed}/${selected.length} reproduced; Chromium ${witness.browser}, Playwright ${witness.playwright}`);
if (passed !== selected.length) process.exitCode = 1;
