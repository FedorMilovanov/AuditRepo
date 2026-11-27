// Read-only reproduction against a pinned Product production-like dist; see ../REPORT.md.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createServer, get } from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [productArg, outArg, executablePath, only] = process.argv.slice(2);
if (!productArg || !outArg || !executablePath) throw new Error('Usage: node browser.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const { article, map } = JSON.parse(fs.readFileSync(path.join(out, 'question-corpus.json'), 'utf8'));
const { sheet } = JSON.parse(fs.readFileSync(path.join(out, 'census.json'), 'utf8'));
const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' },
  mobile: { viewport: { width: 390, height: 844 }, colorScheme: 'dark', reducedMotion: 'reduce', isMobile: true, hasTouch: true },
};
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'];
const defaultCacheFlag = '--disable-back-forward-cache';
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const plain = s => norm(s.replace(/<\/?(?:em|strong|b|i|u|span)>/giu, ''));
const relative = (url) => { const u = new URL(url); return u.pathname + u.search + u.hash; };
const jobs = [];
const job = (scenario, route, profile, fn, transport = 'normal') => jobs.push({ scenario, route, profile, fn, transport });
const anatomy = '/articles/anatomiya-padeniya-pyat-stadiy/';
const heart = '/articles/krajne-li-isporcheno-serdce/';
const reference = '/articles/dzhon-gill-spravochnik/';
const part2 = '/articles/dzhon-gill-chast-2-uchenyi/';
const part1 = '/articles/dzhon-gill-chast-1-chelovek/';
const apostasy = '/articles/otstuplenie-chto-govorit-bibliya/';
const mapRoute = '/konfessii/russkij-baptizm/';
const mapInner = `${mapRoute}_app/index.html`;
const fallback = article.filter(x => !x.scores?.length);
const custom = article.filter(x => x.scores?.length);
const group = rows => ({ routes: rows.length, questions: rows.reduce((n, r) => n + r.questions.length, 0) });
const witness = {
  auditedCommit: '9edef94ece08012223c1364bec7ddcd561cf5713', node: process.version,
  playwright: requireProduct('playwright/package.json').version, profiles, launchArgs: args,
  context: { serviceWorkers: 'block' },
  transport: {
    normal: { server: 'Product scripts/lib/a04-contract.mjs', cacheControl: 'no-store', playwrightDisablesBFCache: true },
    revalidate: { server: 'header-only local proxy over a04; minimal synthetic control route', cacheControl: 'max-age=0, must-revalidate', omittedDefaultArg: defaultCacheFlag },
  },
  artifactSha256: Object.fromEntries([anatomy, heart, reference, part2, part1, apostasy, mapRoute, mapInner].map(route => [
    route, createHash('sha256').update(fs.readFileSync(path.join(product, 'dist', route.endsWith('/') ? `${route}index.html` : route))).digest('hex'),
  ])),
  coverage: {
    nativeFallback: group(fallback), nativeCustomTiers: group(custom),
    fallbackRoutesWithNoSourceHref: fallback.filter(r => r.questions.every(q => !q.sourceRef?.href)).map(r => r.route),
    part2Deck: sheet.find(r => r.route === part2).questions.length,
  },
  runs: [],
};

const waitForPageShow = page => page.waitForFunction(() => window.__auditPageShow?.length > 0);
const documentState = page => page.evaluate(() => ({
  url: location.pathname + location.search + location.hash,
  timeOrigin: performance.timeOrigin,
  navigation: performance.getEntriesByType('navigation')[0]?.type,
  pageshow: window.__auditPageShow,
  active: document.activeElement?.id || document.activeElement?.tagName,
  scrollY: Math.round(scrollY),
  overlay: document.getElementById('gillLearningOverlay')?.getAttribute('aria-hidden') ?? null,
  bodyOverflow: getComputedStyle(document.body).overflowY,
}));
async function clickSource(page, link) {
  const href = await link.getAttribute('href');
  const title = norm(await link.innerText());
  const target = new URL(href, page.url());
  const id = decodeURIComponent(target.hash.slice(1));
  assert.ok(id && target.origin === new URL(page.url()).origin);
  await Promise.all([page.waitForURL(target.href, { waitUntil: 'domcontentloaded' }), link.click()]);
  await page.waitForFunction(id => {
    const r = document.getElementById(id)?.getBoundingClientRect();
    return r && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
  }, id);
  const landing = await page.evaluate(id => {
    const el = document.getElementById(id), r = el.getBoundingClientRect();
    const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
    const y = (Math.max(0, r.top) + Math.min(innerHeight - 1, r.bottom)) / 2;
    const hit = document.elementFromPoint(cx, y);
    return {
      id, text: el.innerText.replace(/\s+/gu, ' ').trim().slice(0, 210),
      top: Math.round(r.top), bottom: Math.round(r.bottom), viewportHeight: innerHeight,
      focus: document.activeElement === el, highlight: el.classList.contains('is-search-target'),
      hit: hit === el || el.contains(hit),
    };
  }, id);
  return { href, title, landing, document: await documentState(page) };
}

// Equal scores with different missed destinations, explicit repeat, all-correct, a no-source floor, and authored advice.
const nativePanel = page => page.locator('#quizPlaceholder .quiz-wrapper');
async function nativeAnswer(panel, item, n, total, wrong) {
  const options = panel.locator('button.quiz-option');
  assert.equal(norm(await panel.locator('.quiz-progress').textContent()), `Вопрос ${n} из ${total}`);
  assert.equal(norm(await panel.locator('#quizQuestion').innerText()), plain(item.question));
  assert.deepEqual((await options.allInnerTexts()).map(norm), item.options.map(plain));
  await options.nth(wrong ? (item.correct + 1) % item.options.length : item.correct).click();
  const feedback = panel.locator('.quiz-feedback');
  const verdict = norm(await feedback.locator('strong').first().innerText());
  assert.equal(verdict, wrong ? 'Неверно' : 'Верно');
  assert.equal(await options.locator('xpath=self::button[@disabled]').count(), item.options.length);
  assert.equal(await options.nth(item.correct).evaluate(el => el.classList.contains('is-correct')), true);
  const href = await feedback.locator('a[href]').evaluateAll(nodes => nodes.map(a => a.getAttribute('href')));
  assert.deepEqual(href, item.sourceRef?.href ? [item.sourceRef.href] : []);
  return {
    n, id: item.id ?? `q${n}`, verdict, href,
    chosen: norm(await panel.locator(wrong ? '.quiz-option.is-incorrect' : '.quiz-option.is-correct').innerText()),
    correct: norm(await panel.locator('.quiz-option.is-correct').innerText()),
    full: norm(await feedback.locator('.quiz-explanation--full').innerText()).slice(0, 180),
    focusedNext: await panel.locator('.quiz-next').evaluate(b => document.activeElement === b),
  };
}
const isNativeUnanswered = panel => panel.evaluate(el => ({
  progress: el.querySelector('.quiz-progress')?.textContent, question: el.querySelector('#quizQuestion')?.textContent,
  optionsEnabled: el.querySelectorAll('button.quiz-option:not(:disabled)').length,
  feedback: el.querySelectorAll('.quiz-feedback').length, links: el.querySelectorAll('a[href]').length,
}));
async function nativeAttempt(page, route, wrong, visitSource = false) {
  const { questions } = article.find(r => r.route === route);
  const panel = nativePanel(page), rows = [];
  let handoff = null;
  for (const [i, item] of questions.entries()) {
    const answer = await nativeAnswer(panel, item, i + 1, questions.length, wrong.includes(i + 1));
    rows.push(answer);
    if (visitSource && i === 0) {
      const before = await documentState(page);
      const followed = await clickSource(page, panel.locator('.quiz-feedback a[href]'));
      assert.equal(followed.landing.id, 'metod');
      assert.equal(followed.document.timeOrigin, before.timeOrigin);
      const backResponse = await page.goBack({ waitUntil: 'commit' });
      const back = await documentState(page);
      assert.equal(back.url, before.url);
      assert.equal(back.timeOrigin, before.timeOrigin);
      const after = await panel.evaluate(el => ({
        progress: el.querySelector('.quiz-progress')?.textContent,
        verdict: el.querySelector('.quiz-feedback > strong')?.textContent,
        optionsDisabled: el.querySelectorAll('.quiz-option:disabled').length,
        href: el.querySelector('.quiz-feedback a')?.getAttribute('href'),
        full: el.querySelector('.quiz-explanation--full')?.innerText.replace(/\s+/gu, ' ').trim().slice(0, 180),
      }));
      assert.deepEqual(after, { progress: `Вопрос 1 из ${questions.length}`, verdict: answer.verdict, optionsDisabled: item.options.length, href: answer.href[0], full: answer.full });
      handoff = { before, followed, back, backResponse: backResponse?.status() ?? null, after };
    }
    await panel.locator('button.quiz-next').click();
    if (visitSource && i === 0) {
      handoff.next = await isNativeUnanswered(panel);
      assert.equal(handoff.next.feedback + handoff.next.links, 0);
    }
  }
  const result = await panel.evaluate(el => ({
    progress: el.querySelector('.quiz-progress')?.textContent, title: el.querySelector('#quizQuestion')?.textContent,
    copy: el.querySelector('.quiz-result-copy')?.textContent,
    actions: [...el.querySelectorAll('button')].map(b => b.textContent),
    links: [...el.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
    feedback: el.querySelectorAll('.quiz-feedback').length,
    details: el.querySelectorAll('details').length,
  }));
  const score = rows.filter(r => r.verdict === 'Верно').length;
  assert.equal(score, questions.length - wrong.length);
  assert.equal(result.progress, `Результат: ${score} из ${questions.length}`);
  assert.deepEqual(result.actions, ['Пройти ещё раз']);
  assert.equal(result.links.length + result.feedback + result.details, 0);
  return { misses: wrong, answers: rows, handoff, result };
}
job('native-miss-q1-and-repeat-perfect', anatomy, 'desktop', async (page, rec) => {
  await page.locator('#quizLaunch').click();
  rec.attempt = await nativeAttempt(page, anatomy, [1], true);
  await nativePanel(page).getByRole('button', { name: 'Пройти ещё раз', exact: true }).click();
  rec.reset = await isNativeUnanswered(nativePanel(page));
  assert.equal(rec.reset.progress, 'Вопрос 1 из 8');
  assert.equal(rec.reset.feedback + rec.reset.links, 0);
  assert.equal(rec.reset.optionsEnabled, 4);
  rec.repeat = await nativeAttempt(page, anatomy, []);
  assert.equal(rec.repeat.result.copy, 'Все ответы верны.');
});
job('native-miss-q2-same-score', anatomy, 'desktop', async (page, rec) => {
  await page.locator('#quizLaunch').click();
  rec.attempt = await nativeAttempt(page, anatomy, [2]);
});
job('native-no-source-floor', heart, 'mobile', async (page, rec) => {
  await page.locator('#quizLaunch').click();
  rec.attempt = await nativeAttempt(page, heart, Array.from({ length: 12 }, (_, i) => i + 1));
  assert.ok(rec.attempt.answers.every(a => a.href.length === 0));
  assert.equal(rec.attempt.result.copy, 'Вернитесь к отмеченным разделам и попробуйте ещё раз.');
  await nativePanel(page).screenshot({ path: path.join(out, 'krajne-empty-review.png'), animations: 'disabled' });
});
job('native-authored-advice', reference, 'desktop', async (page, rec) => {
  await page.locator('#quizLaunch').click();
  rec.attempt = await nativeAttempt(page, reference, [1, 2, 4]);
  assert.equal(rec.attempt.result.title, 'Вернитесь к таблицам');
  assert.equal(rec.attempt.result.copy, 'Начните с хронологии и структуры «Свода богословия» (Body of Divinity).');
});

// Panels: select the real shuffled item through Next, never seed shuffle or mutate Product state.
const pane = page => page.locator('#panelQuiz');
async function openSheet(page) {
  await page.locator('#mobSettingsBtn').click();
  await page.locator('#mobLearningBtn').click();
  const active = await page.locator('#gillLearningOverlay [aria-selected="true"][role="tab"]').getAttribute('id');
  if (active !== 'tabQuiz') await page.locator('#tabQuiz').click();
  await pane(page).waitFor({ state: 'visible' });
  return active;
}
const closeSheet = page => page.getByRole('button', { name: 'Закрыть', exact: true }).and(page.locator('#gillLearningOverlay [data-overlay-close]')).click();
const deck = page => page.locator('#gillQuizData').getAttribute('data-quiz').then(JSON.parse);
async function currentCard(page, items) {
  const label = norm(await page.locator('#glsQuizQuestion').innerText());
  const arr = items.filter(item => norm(item.question) === label);
  assert.equal(arr.length, 1, label);
  return arr[0];
}
async function answerCard(page, item, wrong) {
  await page.locator('[data-conf="sure"]').click();
  await page.locator('#glsQuizOptions').getByRole('button', {
    name: item.answers[wrong ? (item.correctIndex + 1) % item.answers.length : item.correctIndex], exact: true,
  }).click();
}
async function sheetState(page, items) {
  const quiz = await pane(page).evaluate(el => {
    const read = id => {
      const e = el.querySelector(`#${id}`);
      return { text: e.textContent.replace(/\s+/gu, ' ').trim(), hidden: e.hidden };
    };
    return {
      question: read('glsQuizQuestion').text, seen: read('glsQuizStreak').text,
      calibration: read('glsQuizCalib').hidden ? null : read('glsQuizCalibPct').text,
      verdict: read('glsQuizVerdict'), explanation: read('glsQuizExplanation'),
      confidence: read('glsQuizConf').hidden ? null : 'unanswered',
      source: { ...read('glsQuizSource'), href: el.querySelector('#glsQuizSource').getAttribute('href') },
      options: [...el.querySelectorAll('#glsQuizOptions button')].map(b => ({
        text: b.textContent, disabled: b.disabled, correct: b.classList.contains('is-correct'), wrong: b.classList.contains('is-wrong'),
      })),
      next: el.querySelector('#glsQuizNext').classList.contains('is-visible') ? read('glsQuizNext').text : null,
    };
  });
  return { id: items.find(q => norm(q.question) === quiz.question)?.id ?? null, ...quiz };
}
async function reachMiss(page, id) {
  const openedFrom = await openSheet(page);
  const items = await deck(page);
  for (let i = 0; i < items.length; i++) {
    const item = await currentCard(page, items), wanted = item.id === id;
    // Other questions may vary between runs; a warm-up correct answer makes the counter nontrivial.
    await answerCard(page, item, wanted || i !== 0);
    if (wanted) {
      const state = await sheetState(page, items);
      assert.equal(state.id, id);
      assert.equal(state.seen, `Пройдено: ${i + 1}`);
      assert.ok(/^Неверно — а уверенность/u.test(state.verdict.text));
      assert.equal(state.explanation.text, norm(item.explanation));
      assert.equal(state.explanation.hidden, false);
      assert.equal(state.source.hidden, false);
      assert.equal(state.source.href, item.sourceHref);
      assert.ok(state.options.every(o => o.disabled));
      return { items, state, answered: i + 1, openedFrom };
    }
    await page.locator('#glsQuizNext').click();
  }
  throw new Error(`Question not reached in one deck: ${id}`);
}
const localId = 'gill.scholar.canticles';
const crossId = 'gill.man.horsleydown.years';
const back = page => page.goBack({ waitUntil: 'commit' });
const closedUnlocked = s => s.overlay === 'true' && s.bodyOverflow !== 'hidden';
job('panel-same-document-resume', part2, 'mobile', async (page, rec) => {
  const { items, state, answered, openedFrom } = await reachMiss(page, localId);
  rec.before = { document: await documentState(page), items: items.length, answered, openedFrom, state };
  rec.followed = await clickSource(page, page.locator('#glsQuizSource'));
  assert.equal(rec.followed.document.url, `${part2}#sec-canticles`);
  assert.equal(rec.followed.document.timeOrigin, rec.before.document.timeOrigin);
  assert.ok(closedUnlocked(rec.followed.document));
  assert.equal(rec.followed.landing.id, 'sec-canticles');
  assert.ok(rec.followed.landing.focus && rec.followed.landing.hit);
  rec.reopenedAfterReading = { tabBeforeActivation: await openSheet(page), state: await sheetState(page, items) };
  assert.deepEqual(rec.reopenedAfterReading.state, state);
  await closeSheet(page);
  const returned = await back(page);
  rec.back = { response: returned?.status() ?? null, document: await documentState(page) };
  assert.equal(rec.back.document.url, part2);
  assert.equal(rec.back.document.timeOrigin, rec.before.document.timeOrigin);
  assert.ok(closedUnlocked(rec.back.document));
  rec.reopenedAfterBack = { tabBeforeActivation: await openSheet(page), state: await sheetState(page, items) };
  assert.deepEqual(rec.reopenedAfterBack.state, state);
  await page.locator('#glsQuizNext').click();
  rec.next = await sheetState(page, items);
  assert.notEqual(rec.next.id, localId);
  assert.equal(rec.next.seen, state.seen);
  assert.ok(rec.next.verdict.hidden && rec.next.explanation.hidden);
});
async function crossDocument(page, rec, targetId, destination, expectCold) {
  const { items, state, answered, openedFrom } = await reachMiss(page, targetId);
  rec.before = { document: await documentState(page), items: items.length, answered, openedFrom, state };
  rec.followed = await clickSource(page, page.locator('#glsQuizSource'));
  assert.equal(rec.followed.document.url, destination);
  assert.notEqual(rec.followed.document.timeOrigin, rec.before.document.timeOrigin);
  assert.ok(closedUnlocked(rec.followed.document));
  const response = await back(page);
  await waitForPageShow(page);
  rec.back = { response: response?.status() ?? null, document: await documentState(page) };
  assert.equal(rec.back.document.url, rec.route);
  const cold = rec.back.document.timeOrigin !== rec.before.document.timeOrigin;
  if (expectCold) assert.equal(cold, true);
  if (cold) assert.ok(closedUnlocked(rec.back.document));
  if (rec.back.document.overlay === 'false') await closeSheet(page);
  rec.reopened = { tabBeforeActivation: await openSheet(page), state: await sheetState(page, items) };
  rec.sameQuestion = rec.reopened.state.id === state.id;
  rec.reset = cold;
  if (cold) {
    assert.ok(rec.back.document.pageshow.every(persisted => !persisted));
    assert.equal(rec.back.document.navigation, 'back_forward');
    assert.equal(rec.reopened.state.seen, '');
    assert.equal(rec.reopened.state.calibration, null);
    assert.ok(rec.reopened.state.explanation.hidden && rec.reopened.state.verdict.hidden);
    assert.equal(rec.reopened.state.next, null);
  }
}
job('panel-cross-document-cold-back', part2, 'mobile', (page, rec) =>
  crossDocument(page, rec, crossId, `${part1}#part-pastor`, true));
job('panel-same-path-tracking-query-cold-back', `${part2}?utm_source=reader`, 'mobile', (page, rec) =>
  crossDocument(page, rec, localId, `${part2}#sec-canticles`, true));

job('panel-ends-deck-by-shuffling-not-result', apostasy, 'mobile', async (page, rec) => {
  await openSheet(page);
  const items = await deck(page);
  assert.equal(items.length, 6);
  rec.order = [];
  for (let i = 0; i < items.length; i++) {
    const item = await currentCard(page, items), last = i === items.length - 1;
    rec.order.push(item.id);
    await answerCard(page, item, last);
    if (last) rec.lastCard = await sheetState(page, items);
    await page.locator('#glsQuizNext').click();
  }
  rec.nextCycle = await sheetState(page, items);
  rec.visibleActions = (await pane(page).locator('button:visible').allInnerTexts()).map(norm);
  assert.equal(new Set(rec.order).size, 6);
  assert.equal(rec.lastCard.next, 'Следующий вопрос');
  assert.ok(rec.lastCard.verdict.text.startsWith('Неверно'));
  assert.equal(rec.nextCycle.seen, 'Пройдено: 6 · рекорд 5');
  assert.equal(rec.nextCycle.calibration, '83%');
  assert.ok(rec.order.includes(rec.nextCycle.id) && rec.nextCycle.id !== rec.lastCard.id);
  assert.ok(rec.nextCycle.verdict.hidden);
});

// BFCache diagnostic: identical static bytes via the probe; change headers and launch flag, not scripts or state.
async function backReasons(context, page, rec) {
  const session = await context.newCDPSession(page);
  await session.send('Page.enable');
  rec.notRestored = [];
  session.on('Page.backForwardCacheNotUsed', e => rec.notRestored.push(...e.notRestoredExplanations.map(({ type, reason }) => ({ type, reason }))));
}
job('bfcache-control-two-plain-pages', '/__audit-control/a/', 'mobile', async (page, rec, ctx) => {
  await backReasons(ctx, page, rec);
  rec.before = await documentState(page);
  await Promise.all([page.waitForURL('**/__audit-control/b/'), page.getByRole('link', { name: 'B', exact: true }).click()]);
  const response = await back(page);
  await waitForPageShow(page);
  rec.back = { document: await documentState(page), response: response?.status() ?? null };
  assert.equal(rec.back.document.url, rec.route);
}, 'revalidate');
job('bfcache-product-revalidate', part2, 'mobile', async (page, rec, ctx) => {
  await backReasons(ctx, page, rec);
  await crossDocument(page, rec, crossId, `${part1}#part-pastor`, false);
}, 'revalidate');

// Map: the topic filters reset even on the active topic; ordinary reading within the frame does not.
const origins = map.filter(q => q.topic === 'origins');
const frame = page => page.frameLocator('#appframe');
const mapQuiz = page => frame(page).locator('#quiz');
const pill = (quiz, text) => quiz.getByRole('button', { name: text, exact: true });
const mapCard = (quiz, item) => quiz.getByRole('heading', { name: item.question, exact: true }).locator('..');
async function mapState(quiz, item) {
  const card = mapCard(quiz, item);
  await card.waitFor();
  return card.evaluate(el => {
    const norm = s => s?.replace(/\s+/gu, ' ').trim() ?? null;
    const buttons = [...el.querySelectorAll('button')];
    const explain = [...el.querySelectorAll('span')].find(x => norm(x.textContent) === 'Объяснение:');
    return {
      question: norm(el.querySelector('h3').textContent), progress: norm(el.querySelector('.font-mono').textContent),
      score: norm(el.querySelector('.chip-accent').textContent), explanation: norm(explain?.parentElement.innerText),
      sources: [...el.querySelectorAll('p')].filter(x => norm(x.textContent)?.startsWith('Источник:')).map(x => norm(x.textContent)),
      links: [...el.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
      disabled: buttons.filter(b => b.disabled).length,
      activeTopic: norm(el.closest('#quiz').querySelector('.filter-pill-active')?.textContent),
      frameUrl: location.pathname + location.search + location.hash,
    };
  });
}
async function mapAnswer(quiz, item, wrong) {
  const card = mapCard(quiz, item);
  const buttons = card.getByRole('button');
  await buttons.nth(wrong ? (item.correctIndex + 1) % item.options.length : item.correctIndex).click();
  await card.getByText('Объяснение:', { exact: true }).waitFor();
  const state = await mapState(quiz, item);
  assert.equal(state.disabled, item.options.length);
  assert.deepEqual(state.sources, item.source ? [`Источник: ${norm(item.source)}`] : []);
  assert.equal(state.links.length, 0);
  return { id: item.id, wrong, ...state };
}
const mapNext = (quiz, item) => mapCard(quiz, item).getByRole('button', { name: /^(Следующий вопрос|Посмотреть результат)/u }).click();
job('map-equal-score-different-misses-and-repeat', mapRoute, 'desktop', async (page, rec) => {
  const quiz = mapQuiz(page);
  await pill(quiz, 'Истоки').click();
  rec.trials = [];
  for (const missedId of ['o1', 'o3']) {
    const rows = [];
    for (const [i, item] of origins.entries()) {
      rows.push(await mapAnswer(quiz, item, item.id === missedId));
      assert.equal(rows[i].score, `${rows.filter(r => !r.wrong).length} правильно`);
      await mapNext(quiz, item);
    }
    const panel = quiz.getByText('Результат', { exact: true }).locator('..');
    await panel.waitFor();
    const result = await panel.evaluate(el => ({
      title: el.querySelector('h3')?.textContent.trim(), copy: [...el.querySelectorAll('p')].map(p => p.textContent.trim()),
      links: [...el.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
      actions: [...el.querySelectorAll('button')].map(b => b.textContent.trim()),
    }));
    assert.equal(result.title, '3 / 4');
    assert.ok(result.copy.includes('75%'));
    assert.deepEqual(result.actions, ['Пройти снова']);
    assert.equal(result.links.length, 0);
    rec.trials.push({ missedId, rows, result });
    if (missedId === 'o1') {
      await pill(panel, 'Пройти снова').click();
      rec.reset = await mapState(quiz, origins[0]);
      assert.equal(rec.reset.progress, '1 / 4');
      assert.equal(rec.reset.activeTopic, 'Истоки');
      assert.equal(rec.reset.score, '0 правильно');
      assert.equal(rec.reset.explanation, null);
    }
  }
  assert.deepEqual(rec.trials[0].result, rec.trials[1].result);
});
async function mapQuestionTwo(quiz) {
  await mapAnswer(quiz, origins[0], false);
  await mapNext(quiz, origins[0]);
  const state = await mapAnswer(quiz, origins[1], true);
  assert.equal(state.progress, '2 / 4');
  assert.equal(state.score, '1 правильно');
  return state;
}
job('map-glossary-preserves-active-topic-click-resets', mapRoute, 'desktop', async (page, rec) => {
  const quiz = mapQuiz(page);
  await pill(quiz, 'Истоки').click();
  rec.before = await mapQuestionTwo(quiz);
  const glossary = frame(page).locator('#glossary');
  const input = glossary.getByPlaceholder('Найти термин или понятие…');
  await input.click();
  await input.fill('молокане');
  const term = glossary.getByRole('button', { name: /Молокане/u });
  await term.click();
  const definition = term.locator('..').locator('p');
  await definition.waitFor();
  rec.glossary = { query: await input.inputValue(), expanded: await term.getAttribute('aria-expanded'), definition: norm(await definition.innerText()) };
  assert.equal(rec.glossary.expanded, 'true');
  assert.match(rec.glossary.definition, /Никита Воронин/u);
  await mapCard(quiz, origins[1]).getByRole('heading').scrollIntoViewIfNeeded();
  rec.afterReading = await mapState(quiz, origins[1]);
  const { id, wrong, ...beforeReading } = rec.before;
  assert.deepEqual(rec.afterReading, beforeReading);
  await pill(quiz, 'Истоки').click();
  rec.afterActiveTopicClick = await mapState(quiz, origins[0]);
  assert.equal(rec.afterActiveTopicClick.progress, '1 / 4');
  assert.equal(rec.afterActiveTopicClick.score, '0 правильно');
  assert.equal(rec.afterActiveTopicClick.explanation, null);
  rec.beforeDifferentTopic = await mapQuestionTwo(quiz);
  await pill(quiz, 'Фигуры').click();
  rec.differentTopic = await mapState(quiz, map.find(q => q.topic === 'figures'));
  await pill(quiz, 'Истоки').click();
  rec.returnToTopic = await mapState(quiz, origins[0]);
  assert.deepEqual(rec.returnToTopic, rec.afterActiveTopicClick);
});
job('map-cold-return-from-series', mapRoute, 'desktop', async (page, rec) => {
  const quiz = mapQuiz(page);
  await pill(quiz, 'Истоки').click();
  rec.before = { state: await mapQuestionTwo(quiz), document: await documentState(page) };
  await Promise.all([page.waitForURL('**/baptisty-rossii/'), page.locator('.bar').getByRole('link', { name: 'Серия «Баптисты России»', exact: true }).click()]);
  rec.landing = await documentState(page);
  const response = await back(page);
  await waitForPageShow(page);
  rec.back = { response: response?.status() ?? null, document: await documentState(page), state: await mapState(quiz, map[0]) };
  assert.equal(rec.back.document.url, mapRoute);
  assert.notEqual(rec.back.document.timeOrigin, rec.before.document.timeOrigin);
  assert.equal(rec.back.state.activeTopic, 'Все темы');
  assert.equal(rec.back.state.progress, '1 / 25');
  assert.equal(rec.back.state.score, '0 правильно');
  assert.equal(rec.back.state.explanation, null);
});

const selected = jobs.filter(j => !only || j.scenario.includes(only));
assert.ok(selected.length, 'No selected scenarios');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const { server, base } = await serve();
const proxy = createServer((req, res) => {
  const cacheControl = witness.transport.revalidate.cacheControl;
  if (/^\/__audit-control\/[ab]\/$/u.test(req.url)) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': cacheControl });
    res.end('<!doctype html><title>BFCache control</title><a href="/__audit-control/b/">B</a>');
    return;
  }
  const target = new URL(req.url, base);
  if (target.origin !== base) { res.writeHead(400).end(); return; }
  get(target, upstream => {
    res.writeHead(upstream.statusCode, { ...upstream.headers, 'cache-control': cacheControl });
    upstream.pipe(res);
  }).on('error', () => res.writeHead(502).end());
});
await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
const revalidate = `http://127.0.0.1:${proxy.address().port}`;
try {
  for (const transport of ['normal', 'revalidate']) {
    const batch = selected.filter(j => j.transport === transport);
    if (!batch.length) continue;
    const browser = await chromium.launch({
      executablePath, headless: true, args,
      ...(transport === 'revalidate' ? { ignoreDefaultArgs: [defaultCacheFlag] } : {}),
    });
    witness.browser = browser.version();
    try {
      let cursor = 0;
      const rows = new Array(batch.length);
      await Promise.all(Array.from({ length: Math.min(3, batch.length) }, async () => {
        while (cursor < batch.length) {
          const index = cursor++;
          const { scenario, route, profile, fn } = batch[index];
          const rec = rows[index] = { scenario, route, profile, transport, pageErrors: [], localHttpErrors: [] };
          const origin = transport === 'normal' ? base : revalidate;
          const context = await browser.newContext({ ...profiles[profile], ...witness.context });
          try {
            await context.addInitScript(() => {
              window.__auditPageShow = [];
              addEventListener('pageshow', e => window.__auditPageShow.push(e.persisted));
            });
            const page = await context.newPage();
            page.setDefaultTimeout(12000);
            page.on('pageerror', e => rec.pageErrors.push(String(e)));
            page.on('response', r => {
              if (r.url().startsWith(`${origin}/`) && r.status() >= 400) rec.localHttpErrors.push({ url: relative(r.url()), status: r.status() });
            });
            const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 40000 });
            rec.cacheControl = await response?.headerValue('cache-control') ?? null;
            await waitForPageShow(page);
            await fn(page, rec, context);
            assert.deepEqual(rec.pageErrors, []);
            assert.deepEqual(rec.localHttpErrors, []);
            rec.ok = true;
          } catch (error) {
            rec.ok = false;
            rec.error = String(error).replaceAll(origin, 'LOCAL_ORIGIN');
          } finally { await context.close(); }
          console.log(`${rec.ok ? 'PASS' : 'FAIL'} ${scenario}${rec.error ? ` — ${rec.error}` : ''}`);
        }
      }));
      witness.runs.push(...rows);
    } finally { await browser.close(); }
  }
  const a = witness.runs.find(r => r.scenario === 'native-miss-q1-and-repeat-perfect' && r.ok);
  const b = witness.runs.find(r => r.scenario === 'native-miss-q2-same-score' && r.ok);
  if (a && b) {
    witness.equalNativeResults = {
      score: a.attempt.result.progress,
      missedSources: [a, b].map(r => r.attempt.answers.filter(q => q.verdict === 'Неверно').flatMap(q => q.href)),
      equal: JSON.stringify(a.attempt.result) === JSON.stringify(b.attempt.result),
    };
    assert.deepEqual(witness.equalNativeResults.missedSources, [['#metod'], ['#lichnoe-sistemnoe']]);
    assert.equal(witness.equalNativeResults.equal, true);
  }
  const good = witness.runs.filter(r => r.ok).length;
  console.log(`${good}/${witness.runs.length} completed; ${witness.browser}, Playwright ${witness.playwright}`);
  if (good < witness.runs.length) process.exitCode = 1;
} finally {
  fs.writeFileSync(path.join(out, 'browser-witness.json'), JSON.stringify(witness, null, 2) + '\n');
  await new Promise(resolve => proxy.close(resolve));
  await new Promise(resolve => server.close(resolve));
}
