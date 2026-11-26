// Read-only witness against an already-built Product dist. This asserts the
// observations on the audit anchor, not what a repaired Product should do.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const [, , productDir, executablePath] = process.argv;
assert.ok(productDir && executablePath, 'Usage: node followup-browser.mjs <Product dir> <Chromium executable>');
const product = path.resolve(productDir);
const dist = path.join(product, 'dist');
const { chromium } = createRequire(path.join(product, 'package.json'))('playwright');
const origin = 'https://gospod-bog.ru';
const kod = '/articles/kod-da-vinchi/';
const bibliography = '/nagornaya/istochniki/';
const htmlSha256 = Object.fromEntries([
  kod, bibliography, '/baptisty-rossii/spravochnik/', '/baptisty-rossii/podpolnaya-pechat/',
].map(route => [route, createHash('sha256').update(fs.readFileSync(path.join(dist, route, 'index.html'))).digest('hex')]));
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const result = { chromium: browser.version(), network: 'intercepted canonical requests served from local dist; external requests aborted; service workers blocked', htmlSha256, timeline: {} };

try {
  for (const width of [320, 390, 640, 641, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block', isMobile: width <= 390, hasTouch: width <= 390 });
    try {
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) return route.abort();
        let file = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
        if (file !== dist && !file.startsWith(dist + path.sep)) return route.abort();
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'absent in local dist' });
        return route.fulfill({ path: file });
      });
      const page = await context.newPage();
      page.setDefaultTimeout(6000);
      async function load(route) {
        assert.equal((await page.goto(origin + route, { waitUntil: 'load', timeout: 20000 })).status(), 200);
        await page.evaluate(() => document.fonts.ready.then(() => true));
      }

      await load(kod);
      const region = page.locator('#canonTimeline .ctw-body');
      const geometry = await region.evaluate(port => {
        const axis = port.querySelector('.ctw-axis');
        const axisRect = axis.getBoundingClientRect();
        const portRect = port.getBoundingClientRect();
        const round = n => Math.round(n * 100) / 100;
        const pct = (px, rect) => round(100 * (px - rect.left) / rect.width);
        const center = rect => rect.left + rect.width / 2;
        const axisTicks = Array.from(axis.children, tick => {
          const year = Number.parseInt(tick.textContent, 10);
          return { year, centerPct: pct(center(tick.getBoundingClientRect()), axisRect), modelPct: (year - 30) / 4 };
        });
        const rows = Array.from(port.querySelectorAll('.ctw-row'), row => {
          const plot = row.querySelector('.ctw-bwrap').getBoundingClientRect();
          const bar = row.querySelector('.ctw-bar');
          const pin = row.querySelector('.ctw-pin');
          const marker = (bar ?? pin.querySelector('.ctw-pin-line')).getBoundingClientRect();
          const date = row.querySelector('.ctw-bin,.ctw-bout,.ctw-pin-yr');
          const dateRect = date.getBoundingClientRect();
          const rects = date.getClientRects().length;
          return {
            label: row.querySelector('.ctw-rlabel').textContent.trim(), date: date.textContent.trim(),
            dateDisplay: getComputedStyle(date).display, dateRects: rects,
            dateWithinScrollPortX: rects ? dateRect.left >= portRect.left - 1 && dateRect.right <= portRect.right + 1 : null,
            title: (bar ?? pin).title, markerTabIndex: (bar ?? pin).tabIndex,
            startPct: pct(bar ? marker.left : center(marker), plot),
            endPct: bar ? pct(marker.right, plot) : null,
            plotVsAxisLeftPx: round(plot.left - axisRect.left), plotVsAxisWidthPx: round(plot.width - axisRect.width),
          };
        });
        return {
          innerWidth, axisWidthPx: round(axisRect.width), axisTicks, rows,
          scrollPort: { clientWidth: port.clientWidth, scrollWidth: port.scrollWidth, overflowX: getComputedStyle(port).overflowX, role: port.getAttribute('role'), tabIndex: port.tabIndex },
        };
      });
      const item = result.timeline[width] = geometry;
      if (geometry.scrollPort.overflowX === 'auto' && geometry.scrollPort.scrollWidth > geometry.scrollPort.clientWidth) {
        await region.focus();
        await page.keyboard.press('ArrowRight');
        await page.waitForFunction(() => document.querySelector('#canonTimeline .ctw-body').scrollLeft > 0);
        item.afterArrowRightPx = await region.evaluate(port => port.scrollLeft);
      }
      assert.equal(item.innerWidth, width);
      assert.equal(item.rows.length, 9);
      assert.deepEqual(item.rows.filter(row => row.dateRects === 0).map(row => row.date), width <= 640 ? ['44–96 г.', 'II–IV вв.', 'III–IV вв.'] : []);

      if (width !== 1440) continue;
      result.timelineCopy = {
        subtitle: await page.locator('#canonTimeline .ctw-sub').innerText(),
        conclusion: await page.locator('#canonTimeline .ctw-note').innerText(),
      };
      const paragraphs = page.locator('p > strong').filter({ hasText: /^(Апостол Иоанн|Апостол Павел|Поликарп Смирнский)$/ });
      result.church = await paragraphs.evaluateAll(nodes => nodes.map(node => {
        const paragraph = node.parentElement;
        const quote = paragraph.querySelector('em').cloneNode(true);
        quote.querySelectorAll('.gtip,.tooltip,.bible-tip,.btip').forEach(tip => tip.remove());
        return { speaker: node.textContent, quote: quote.textContent, footnote: paragraph.querySelector('.fn-marker')?.firstChild.textContent.trim() ?? null };
      }));
      assert.equal(result.church.length, 3);

      const jo = page.locator('p').filter({ has: page.locator('strong', { hasText: /^Апостол Иоанн$/ }) });
      const glossary = jo.locator('.gterm[data-term="плоть"]');
      await glossary.waitFor({ state: 'visible' });
      await glossary.click();
      const openGlossary = page.locator('.gtip-brief:visible').filter({ hasText: 'В павловском богословии' }).first();
      await openGlossary.waitFor({ state: 'visible' });
      result.glossary = { trigger: await glossary.evaluate(node => node.firstChild.textContent), expanded: await glossary.getAttribute('aria-expanded'), visible: await openGlossary.isVisible(), text: await openGlossary.innerText() };

      const polycarp = page.locator('p').filter({ has: page.locator('strong', { hasText: /^Поликарп Смирнский$/ }) }).locator('.fn-marker');
      await polycarp.focus();
      await page.keyboard.press('Enter');
      const needle = 'подтверждено: Евсевий Кесарийский';
      const openNote = await page.waitForFunction(s => Array.from(document.querySelectorAll('.tooltip')).find(tip => tip.textContent.includes(s) && getComputedStyle(tip).opacity === '1' && tip.getClientRects().length), needle);
      result.polycarp = { expanded: await polycarp.getAttribute('aria-expanded'), text: await openNote.evaluate(tip => tip.textContent.trim()) };

      await load(bibliography);
      result.chicago49 = await page.locator('strong').filter({ hasText: /^Chicago Statement on Biblical Hermeneutics \(1982\)$/ }).evaluate(node => node.parentElement.parentElement.parentElement.innerText.trim());
    } finally {
      await context.close();
    }
  }
  assert.ok(result.timeline[641].afterArrowRightPx > 0);
  assert.ok(result.timeline[1440].afterArrowRightPx > 0);
  assert.equal(result.glossary.expanded, 'true');
  assert.match(result.glossary.text, /В павловском богословии/);
  assert.equal(result.polycarp.expanded, 'true');
  assert.match(result.chicago49, /Art\. XIII: экзегезис, интеграция, применение\./);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
