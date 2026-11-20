// Check the handoff tool with intentionally generated fixtures. NOT a native-dialog witness.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const [product, executablePath, origin, out] = process.argv.slice(2);
assert.ok(product && executablePath && origin && out, 'node smoke.mjs PRODUCT CHROMIUM PREVIEW_ORIGIN OUT_JSON');
const requireProduct = createRequire(resolve(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const base = new URL(origin).origin;
const witnessUrl = base + '/__print-witness/';
const sha = buffer => createHash('sha256').update(buffer).digest('hex');
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
try {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', r => new URL(r.request().url()).origin === base ? r.continue() : r.abort());
  const check = await c.newPage();
  const requests = [], errors = [];
  check.on('request', r => requests.push({ method: r.method(), path: new URL(r.url()).pathname, bytes: r.postDataBuffer()?.length ?? 0 }));
  check.on('pageerror', e => errors.push(String(e)));
  const page = await check.goto(witnessUrl);
  assert.equal(page.status(), 200);
  await check.waitForFunction(() => !document.getElementById('compare').disabled);
  assert.ok(await check.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.ok(requests.every(r => !r.path.startsWith('/fonts/') && !r.path.startsWith('/articles/')));
  const anchor = await (await c.request.get(witnessUrl + 'status.json')).json();
  assert.equal(anchor.nativePrintWitness, 'pending');
  assert.equal(anchor.distPinsVerifiedAtStartup, 48);
  const protectedHost = await c.request.get(witnessUrl, { headers: { Host: 'preview-test.e2b.app' } });
  assert.equal(protectedHost.status(), 200);
  assert.ok(!protectedHost.headers()['x-frame-options']);
  const write = await c.request.post(witnessUrl, { data: 'smoke-control' });
  assert.equal(write.status(), 405);

  const source = await c.newPage();
  const document = await source.goto(base + anchor.article + '#sec-quiz', { waitUntil: 'load' });
  assert.equal(sha(await document.body()), anchor.articleSha256);
  await source.waitForFunction(() => window.GBPrintEngine && document.querySelector('#quizLaunch'));
  assert.ok(await source.locator('button[data-reader-pdf="save"]').first().isVisible());
  await source.evaluate(async () => {
    await document.fonts.load('500 14px "Source Sans 3"', 'Писание выше личности и системы');
    await document.fonts.ready;
  });
  const options = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  const complete = await source.pdf(options);
  const clipped = await source.pdf({ ...options, pageRanges: '1-12' });
  const unrelated = await check.pdf(options); // Neutral setup page, not the article.
  const make = (buffer, name) => ({ buffer, name, mimeType: 'application/pdf' });
  await check.locator('#attest').check(); // Test input only; no actual attestation or native printing.
  const receipts = [];
  for (const [left, result] of [[clipped, 'missing_last_page'], [complete, 'tail_present_both'], [unrelated, 'unconfirmed_article']]) {
    await check.locator('#first').setInputFiles(make(left, 'fixture-first.pdf'));
    await check.locator('#repeat').setInputFiles(make(complete, 'fixture-repeat.pdf'));
    await check.locator('#compare').click();
    await check.locator('#receipt:not([hidden])').waitFor({ timeout: 22000 });
    const v = JSON.parse(await check.locator('#receipt-text').textContent());
    assert.equal(v.result, result, `${await check.locator('#status').textContent()} ${JSON.stringify({
      first: v.first.markerPages, repeat: v.repeat.markerPages, pages: [v.first.pages, v.repeat.pages],
      changedPages: v.first.pageSha256.flatMap((h, i) => h === v.repeat.pageSha256[i] ? [] : [i + 1]),
    })}`);
    assert.equal(v.first.sha256, sha(left));
    assert.equal(v.repeat.sha256, sha(complete));
    assert.equal(v.inputBytesEqual, left.equals(complete));
    assert.equal(v.nativePrintWitness, 'user-attested-only');
    if (v.inputBytesEqual) assert.match(await check.locator('#status').textContent(), /побайтно совпадают/);
    receipts.push({ result: v.result, first: v.first, repeat: v.repeat });
  }
  assert.ok(!errors.length, errors.join('\n'));
  assert.ok(requests.every(r => r.method === 'GET' && r.bytes === 0));
  assert.ok(requests.every(r => r.path.startsWith('/__print-witness/')));
  await writeFile(out, JSON.stringify({ ...anchor, coverage: 'fixture-only (Chromium Headless; pageRanges explicitly trims the control)',
    chromium: browser.version(), receipts, workerSameOrigin: requests.some(r => r.path.endsWith('/pdf.worker.mjs')),
    noFileBytesSent: true, writeRejectedWith: write.status(), previewHostAccepted: true }, null, 2) + '\n');
  console.log('PASS 3 fixture classifications, no uploads, verified article bytes, compatible preview host');
} finally {
  await browser.close();
}
