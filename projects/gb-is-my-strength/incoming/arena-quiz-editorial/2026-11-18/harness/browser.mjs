// Read-only evidence from real clicks on an existing Product dist. See REPORT.md.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [productArg, outArg, executablePath] = process.argv.slice(2);
if (!productArg || !outArg || !executablePath) throw new Error('Usage: node browser.mjs PRODUCT OUT CHROMIUM');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
const baselines = read('score-baselines.json');
const reviewed = read('review-contexts.json');
const cases = new Map(reviewed.map(q => [q.id, q]));
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const { server, base } = await serve();
const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark', reducedMotion: 'reduce' },
};
const witness = { node: process.version, playwright: requireProduct('playwright/package.json').version, browser: null, profiles, runs: [] };
const jobs = [];
const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const longestIndex = options => options.reduce((best, s, i) => s.length > options[best].length ? i : best, 0);
const job = (scenario, route, profile, fn) => jobs.push({ scenario, route, profile, fn });
const articleQuiz = page => page.locator('#quizPlaceholder .quiz-wrapper');
const openArticleQuiz = page => page.locator('#quizLaunch').click();
const quizOptionLengths = async panel => (await panel.locator('button.quiz-option').allInnerTexts()).map(norm);
const sourceLink = async (page, link, expected) => {
  const href = await link.getAttribute('href');
  const target = new URL(href, page.url());
  assert.equal(target.pathname, expected.route);
  assert.equal(decodeURIComponent(target.hash.slice(1)), expected.id);
  await link.click();
  await page.waitForURL(url => url.pathname === target.pathname && url.hash === target.hash);
  const heading = page.locator(`[id=${JSON.stringify(expected.id)}]`);
  assert.equal(await heading.count(), 1);
  return { href, target: `${target.pathname}#${expected.id}`, heading: norm(await heading.innerText()) };
};

// All six maxima in the static length baseline, plus a high-but-not-maximum and a negative control.
const h = '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/';
const neg = '/articles/anatomiya-padeniya-pyat-stadiy/';
for (const row of baselines.filter(x => x.topByLength || [h, neg].includes(x.route))) {
  const profile = row.route.startsWith('/nagornaya/') ? 'mobile' : 'desktop';
  job('article-visible-length-only', row.route, profile, async (page, rec) => {
    await openArticleQuiz(page);
    const panel = articleQuiz(page);
    rec.answers = [];
    for (let n = 0; n < row.questions; n++) {
      const options = await quizOptionLengths(panel);
      const picked = longestIndex(options); // no config, feedback or key used to select the button
      const lengths = options.map(x => x.length);
      await panel.locator('button.quiz-option').nth(picked).click();
      const verdict = await panel.locator('.quiz-feedback > strong').first().innerText();
      const key = await panel.locator('button.quiz-option').evaluateAll(nodes => nodes.findIndex(x => x.classList.contains('is-correct')));
      rec.answers.push({ n: n + 1, lengths, picked: picked + 1, markedCorrect: key + 1, verdict });
      assert.equal(picked, row.longestPicksZeroBased[n]);
      await panel.locator('button.quiz-next').click();
    }
    rec.result = norm(await panel.locator('.quiz-progress').innerText());
    rec.title = norm(await panel.locator('#quizQuestion').innerText());
    rec.description = norm(await panel.locator('.quiz-result-copy').innerText());
    assert.equal(rec.answers.filter(a => a.verdict === 'Верно').length, row.lengthScore);
    assert.equal(rec.result.toLowerCase(), `результат: ${row.lengthScore} из ${row.questions}`);
    assert.equal(rec.title, row.lengthTitle);
    assert.equal(rec.description, row.lengthDescription);
    if (row.route === '/articles/lot-i-sodom/') {
      await panel.screenshot({ path: path.join(out, 'lot-longest-result.png'), animations: 'disabled' });
    }
  });
}

// A real link can land on the wrong section; a paraphrase in another section can still support the key.
for (const [route, profile, selected] of [
  ['/articles/dzhon-gill-chast-2-uchenyi/', 'desktop', {
    2: ['не утверждает точный день присуждения, оплату профессором', 'sec-dd'],
    3: ['Святой Дух — не «наблюдатель»', 'sec-pactum'],
  }],
  ['/nagornaya/chast-2/', 'mobile', {
    2: ['евангелиста переводили одну арамейскую проповедь', 'vii-аргумент-перевода-арамейский-греческий'],
    4: ['Различный отбор материала, тематическое расположение и свободное цитирование совместимы', 'v-чикагское-заявление-точные-границы'],
  }],
]) job('article-content-handoff', route, profile, async (page, rec) => {
  rec.items = [];
  await openArticleQuiz(page);
  const panel = articleQuiz(page);
  const last = Math.max(...Object.keys(selected).map(Number));
  for (let n = 1; n <= last; n++) {
    const item = cases.get(`${route}#q${n}`);
    const options = panel.locator('button.quiz-option');
    await options.nth(selected[n] ? item.correct : 0).click();
    if (selected[n]) {
      const [needle, evidenceHeadingId] = selected[n];
      const details = {
        n, question: norm(await panel.locator('#quizQuestion').innerText()), selected: item.options[item.correct],
        verdict: await panel.locator('.quiz-feedback > strong').innerText(),
        explanation: (await panel.locator('.quiz-explanation').allInnerTexts()).map(norm),
      };
      rec.items.push(details);
      assert.equal(details.verdict, 'Верно');
      details.source = await sourceLink(page, panel.locator('.quiz-feedback a[href]'), item.link);
      const marker = page.locator(`[id=${JSON.stringify(evidenceHeadingId)}]`);
      details.evidenceHeading = { id: evidenceHeadingId, text: norm(await marker.innerText()) };
      // innerText avoids treating tooltip metadata as prose; match visible descendants of main.
      details.evidenceText = await page.locator('main :is(p,div,span)').evaluateAll((nodes, text) => {
        const normal = s => String(s || '').replace(/\s+/gu, ' ').trim();
        return nodes.map(e => normal(e.innerText)).filter(x => x.includes(text)).sort((a, b) => a.length - b.length)[0] || '';
      }, needle);
      assert.ok(details.evidenceText.includes(needle), `${route} Q${n}: ${needle}`);
    }
    if (n < last) await panel.locator('button.quiz-next').click();
  }
});

const gillAnalysis = [
  ['gill.scholar.systematics', '/articles/dzhon-gill-chast-2-uchenyi/', 'Называть его первым трудом такого рода среди всех баптистов было бы неточно'],
  ['gill.man.education', '/articles/dzhon-gill-chast-1-chelovek/', 'Гилл учился в Кеттерингской грамматической школе'],
  ['gill.legacy.america', '/articles/dzhon-gill-chast-3-nasledie/', 'делают фонд важным направлением дальнейшей проверки'],
];
for (const [id, route, quote] of gillAnalysis) {
  const item = cases.get(id);
  job('panel-content-handoff', route, 'mobile', async (page, rec) => {
    rec.case = id;
    await page.locator('#mobSettingsBtn').click();
    await page.locator('#mobLearningBtn').click();
    await page.locator('#tabQuiz').click();
    const panel = page.locator('#panelQuiz');
    const clickAnswer = async locator => {
      await panel.locator('[data-conf="sure"]').click();
      await locator.click();
    };
    rec.skippedOtherItems = 0;
    for (;;) {
      rec.question = norm(await panel.locator('#glsQuizQuestion').innerText());
      if (rec.question === item.q) break;
      assert.ok(rec.skippedOtherItems++ < 31, `Cannot find ${id} in one cycle`);
      await clickAnswer(panel.locator('button.quiz-option').first());
      await panel.locator('#glsQuizNext').click();
    }
    const options = panel.locator('button.quiz-option');
    rec.shownOptions = (await options.allInnerTexts()).map(norm);
    const answer = item.options[item.correct];
    await clickAnswer(options.getByText(answer, { exact: true }));
    rec.selected = answer;
    rec.verdict = norm(await panel.locator('#glsQuizVerdict').innerText());
    rec.explanation = norm(await panel.locator('#glsQuizExplanation').innerText());
    assert.match(rec.verdict, /^Верно/u);
    assert.equal(rec.explanation, item.explanation);
    rec.source = await sourceLink(page, panel.locator('#glsQuizSource'), item.link);
    const paragraph = page.locator('p').filter({ hasText: quote });
    assert.equal(await paragraph.count(), 1, id);
    rec.source.paragraph = norm(await paragraph.innerText());
    assert.ok(rec.source.paragraph.includes(quote));
    rec.source.overlayOpenAfterClick = await page.locator('#gillLearningOverlay').evaluate(e => e.classList.contains('is-open'));
    assert.equal(rec.source.overlayOpenAfterClick, false);
  });
}

const mapRoute = '/konfessii/russkij-baptizm/';
const mapQuiz = page => page.frameLocator('#appframe').locator('#quiz');
const mapHeading = (quiz, item) => quiz.getByRole('heading', { name: item.q, exact: true });
const nextMap = quiz => quiz.getByRole('button', { name: /^(Следующий вопрос|Посмотреть результат)/u }).click();
const mapItems = reviewed.filter(x => x.family === 'map');
job('map-visible-green-only', mapRoute, 'desktop', async (page, rec) => {
  const quiz = mapQuiz(page);
  rec.answers = [];
  for (const item of mapItems) {
    const card = mapHeading(quiz, item).locator('..');
    const options = card.getByRole('button'); // scoped to the visible pre-answer card
    await mapHeading(quiz, item).waitFor();
    const before = await options.evaluateAll(nodes => nodes.map(el => ({ color: getComputedStyle(el).color, enabled: !el.disabled })));
    assert.equal(before.length, item.options.length);
    assert.ok(before.every(x => x.enabled));
    const candidates = before.map((x,i) => x.color === 'rgb(110, 231, 183)' ? i : -1).filter(i => i >= 0);
    assert.equal(candidates.length, 1); // one distinctive green button, independent of answer text
    const picked = candidates[0];
    await options.nth(picked).click();
    const score = `${rec.answers.length + 1} правильно`;
    await card.getByText(score, { exact: true }).waitFor();
    rec.answers.push({ id: item.id, idleColors: before.map(x => x.color), picked: picked + 1, score });
    await nextMap(card);
  }
  const result = quiz.getByText('Результат', { exact: true }).locator('..');
  await result.waitFor();
  rec.result = norm(await result.getByRole('heading').innerText());
  rec.percentage = await result.getByText('100%', { exact: true }).innerText();
  rec.description = await result.getByText('Отлично! Вы знаете историю баптизма.', { exact: true }).innerText();
  assert.equal(rec.result, '25 / 25');
});
job('map-overlap-two-trials', mapRoute, 'desktop', async (page, rec) => {
  const quiz = mapQuiz(page);
  const figures = mapItems.filter(x => x.topic === 'figures');
  rec.trials = [];
  for (const candidate of ['Нет', 'Частично']) {
    await quiz.getByRole('button', { name: 'Все темы', exact: true }).click();
    await mapHeading(quiz, mapItems[0]).waitFor();
    await quiz.getByRole('button', { name: 'Фигуры', exact: true }).click();
    for (const item of figures) {
      const card = mapHeading(quiz, item).locator('..');
      await mapHeading(quiz, item).waitFor();
      if (item.id !== 'f3') {
        // Select a wrong option on earlier cards so score at f3 isolates this answer.
        await card.getByRole('button').nth((item.correct + 1) % item.options.length).click();
        await card.getByText('0 правильно', { exact: true }).waitFor();
        await nextMap(card);
        continue;
      }
      const before = await card.getByText('0 правильно', { exact: true }).innerText();
      await card.getByRole('button', { name: new RegExp(`^[A-D]\\s*${candidate}$`, 'u') }).click();
      const after = await card.getByText(candidate === 'Нет' ? '1 правильно' : '0 правильно', { exact: true }).innerText();
      const explanation = norm(await card.getByText('Объяснение:', { exact: true }).locator('..').innerText());
      rec.trials.push({ selected: candidate, before, after, explanation });
      break;
    }
  }
  assert.equal(rec.trials.length, 2);
  assert.equal(rec.trials[0].explanation, rec.trials[1].explanation);
});

let browser;
try {
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  witness.browser = browser.version();
  let cursor = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < jobs.length) {
      const i = cursor++;
      const { scenario, route, profile, fn } = jobs[i];
      const rec = { scenario, route, profile, pageErrors: [], localHttpErrors: [] };
      witness.runs[i] = rec;
      const context = await browser.newContext(profiles[profile]);
      await context.route(url => ['mc.yandex.ru', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname), r => r.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      page.on('pageerror', e => rec.pageErrors.push(String(e).slice(0, 400)));
      page.on('response', r => { if (r.url().startsWith(base + '/') && r.status() >= 400) rec.localHttpErrors.push([r.status(), r.url().slice(base.length)]); });
      try {
        await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await fn(page, rec);
        assert.deepEqual(rec.pageErrors, []);
        assert.deepEqual(rec.localHttpErrors, []);
        rec.ok = true;
      } catch (error) {
        rec.ok = false;
        rec.error = String(error).slice(0, 900);
        console.error(scenario, route, rec.error);
      } finally {
        await context.close();
      }
    }
  }));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(out, 'browser-witness.json'), JSON.stringify(witness, null, 2) + '\n');
}
const ok = witness.runs.filter(r => r.ok).length;
console.log(`${ok}/${jobs.length} browser runs passed (${witness.browser})`);
if (ok !== jobs.length) process.exitCode = 1;
