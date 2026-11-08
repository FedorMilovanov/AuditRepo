// Comprehensive exhibit test: verify all 42 exhibits can be interacted with.
// Uses ?e2e mode to teleport to each exhibit, verify prompt, press E, check dialog.
// Efficient: loops through all exhibits in a single browser session.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-exhibits.mjs
import puppeteer from 'puppeteer-core';

const CHROME = '/tmp/chromium';
const BASE = 'http://127.0.0.1:5173';
const CACHE_BUST = '?v=' + Date.now();

const args = [
  '--no-sandbox', '--disable-setuid-sandbox',
  '--disable-gpu', '--disable-dev-shm-usage',
  '--single-process', '--no-zygote',
  '--headless=shell',
  '--window-size=1440,900',
  '--allow-running-insecure-content',
  '--ignore-gpu-blocklist',
  '--font-render-hinting=none',
];

let pass = 0, fail = 0;
const failures = [];
const t = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  if (!ok) failures.push(name + (detail ? ' — ' + detail : ''));
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args,
  headless: 'shell',
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push('PAGEERROR: ' + err.message));

// ── Load with ?e2e and enter 3D world
await page.goto(BASE + CACHE_BUST + '&e2e', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const b of btns) { if (b.textContent.includes('Начать')) { b.click(); return; } }
});
await new Promise(r => setTimeout(r, 5000));

t('exhibit test: World ready', await page.evaluate(() => !!(window.__horeb && window.__horeb.world)));

// ── Get all exhibit positions
const exhibits = await page.evaluate(() => {
  const w = window.__horeb.world;
  if (!w || !w.exhibitPos) return [];
  return w.exhibitPos.map((ex) => ({
    id: ex.e.id,
    zone: ex.e.zone,
    x: ex.x, z: ex.z,
    nx: ex.nx, nz: ex.nz,
  }));
});
t(`exhibit test: ${exhibits.length} exhibits found`, exhibits.length === 42, `${exhibits.length} exhibits`);

// ── Test each exhibit
let tested = 0;
for (const ex of exhibits) {
  // Teleport player to exhibit
  await page.evaluate((e) => {
    const w = window.__horeb.world;
    const d = Math.hypot(e.nx, e.nz) || 1;
    const px = e.x + (e.nx / d) * 2;
    const pz = e.z + (e.nz / d) * 2;
    w.pos.set(px, pz);
    w.vel.set(0, 0);
    w.yaw = Math.atan2(e.nx, e.nz);
  }, ex);

  // Poll prompt until it matches (up to 5s)
  let promptOk = false;
  let prompt = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    prompt = await page.evaluate(() => window.__horeb.state().prompt);
    if (prompt && prompt.kind === 'exhibit' && prompt.id === ex.id) {
      promptOk = true;
      break;
    }
  }

  if (!promptOk) {
    t(`exhibit ${ex.id} [zone ${ex.zone}] prompt`, false, `got ${JSON.stringify(prompt)}`);
    continue;
  }

  // Press E to open reader
  await page.keyboard.press('KeyE');
  
  // Poll for dialog (up to 5s), retry E if needed
  let dialogOpen = false;
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    dialogOpen = await page.evaluate(() => !!document.querySelector('[role="dialog"], .modal, .reader-panel, [data-dialog]'));
    if (dialogOpen) break;
    // Retry E key
    if (attempt >= 2) {
      await page.keyboard.press('KeyE');
    }
  }

  t(`exhibit ${ex.id} [zone ${ex.zone}] reader dialog`, dialogOpen);

  // Close dialog
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  tested++;
}

t(`exhibit test: ${tested}/${exhibits.length} exhibits tested successfully`, tested === exhibits.length, `${tested} passed, ${failures.length} failed`);

// ── No console errors
t('exhibit test: no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log('  ' + f);
}
process.exit(fail ? 1 : 0);
