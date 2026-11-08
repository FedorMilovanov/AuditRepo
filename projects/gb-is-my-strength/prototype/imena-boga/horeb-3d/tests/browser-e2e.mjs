// E2E interaction test: exhibit reading, bush/sandal mechanic.
// Uses ?e2e mode to access World instance via window.__horeb.
// Teleports player to exhibits/bush, tests interactions end-to-end.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-e2e.mjs
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const CHROME = '/tmp/chromium';
const BASE = 'http://127.0.0.1:5173';
const CACHE_BUST = '?v=' + Date.now();
const SHOTS = join(process.cwd(), '.test-build/screenshots');

if (!existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });

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
const t = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
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

// ── 1. Load with ?e2e and enter 3D world
await page.goto(BASE + CACHE_BUST + '&e2e', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const b of btns) { if (b.textContent.includes('Начать')) { b.click(); return; } }
});
await new Promise(r => setTimeout(r, 5000));

// ── 2. Get World instance
const worldReady = await page.evaluate(() => !!(window.__horeb && window.__horeb.world));
t('e2e: World instance accessible via window.__horeb', worldReady);

// ── 3. Get exhibit info and teleport player
const exhibitInfo = await page.evaluate(() => {
  const w = window.__horeb.world;
  if (!w || !w.exhibitPos || w.exhibitPos.length === 0) return null;
  const ex = w.exhibitPos[0];
  const d = Math.hypot(ex.nx, ex.nz) || 1;
  // Place player 2m in front of stele (on label side, toward corridor centre)
  const px = ex.x + (ex.nx / d) * 2;
  const pz = ex.z + (ex.nz / d) * 2;
  // Face the stele: yaw = atan2(nx, nz)
  const yaw = Math.atan2(ex.nx, ex.nz);
  w.pos.set(px, pz);
  w.vel.set(0, 0);
  w.yaw = yaw;
  return { id: ex.e.id, x: ex.x, z: ex.z, px, pz, yaw };
});
t('e2e: teleported player to first exhibit', exhibitInfo !== null, exhibitInfo ? `${exhibitInfo.id} at [${exhibitInfo.px.toFixed(1)}, ${exhibitInfo.pz.toFixed(1)}]` : '');

// ── 4. Wait for prompt to update
await new Promise(r => setTimeout(r, 2000));
const promptBefore = await page.evaluate(() => window.__horeb.state().prompt);
t('e2e: exhibit prompt visible after teleport', promptBefore && promptBefore.kind === 'exhibit', promptBefore ? JSON.stringify(promptBefore) : 'null');

// ── 5. Press E to interact
await page.keyboard.press('KeyE');
await new Promise(r => setTimeout(r, 1500));

// ── 6. Check reader dialog opened
const dialogOpen = await page.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"], .modal, .reader-panel, [data-dialog]');
  return !!dlg;
});
t('e2e: exhibit reader dialog opens on E press', dialogOpen);
await page.screenshot({ path: join(SHOTS, '17-exhibit-reader.png') });

// ── 7. Close dialog
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 1000));

// ── 8. Teleport to bush (zone 7, outdoor)
const bushInfo = await page.evaluate(() => {
  const w = window.__horeb.world;
  // Bush at (0, -366), R_OUTER = 14. Place player at distance 16 (within prompt range < R_OUTER+2.5)
  const dist = 16;
  w.pos.set(0, -366 + dist); // south of bush
  w.vel.set(0, 0);
  w.yaw = Math.PI; // face north (toward bush)
  return { x: w.pos.x, z: w.pos.y, dist };
});
t('e2e: teleported player to bush area', bushInfo !== null, bushInfo ? `at [${bushInfo.x}, ${bushInfo.z}] dist=${bushInfo.dist}` : '');

// ── 9. Wait for shoes prompt
await new Promise(r => setTimeout(r, 3000));
const posAfterWait = await page.evaluate(() => {
  const w = window.__horeb.world;
  return { x: w.pos.x, z: w.pos.y, dist: Math.hypot(w.pos.x, w.pos.y + 366) };
});
console.log(`  [debug] player position after bush teleport wait: [${posAfterWait.x.toFixed(1)}, ${posAfterWait.z.toFixed(1)}] dist=${posAfterWait.dist.toFixed(1)}`);
const shoesPrompt = await page.evaluate(() => {
  const s = window.__horeb.state();
  return { prompt: s.prompt, shoes: s.shoes };
});
t('e2e: shoes prompt visible near bush', shoesPrompt.prompt && shoesPrompt.prompt.kind === 'shoes', shoesPrompt.prompt ? JSON.stringify(shoesPrompt.prompt) : 'null');
t('e2e: player has shoes on (shod)', shoesPrompt.shoes === 'shod', shoesPrompt.shoes);

// ── 10. Remove shoes via direct World call (bypass React keyboard chain)
const removeResult = await page.evaluate(() => {
  const w = window.__horeb.world;
  const dist = Math.hypot(w.pos.x - 0, w.pos.y - (-366));
  const before = w.shoes;
  const ok = w.removeShoes();
  return { ok, before, after: w.shoes, dist };
});
t('e2e: removeShoes() called successfully', removeResult.ok, `dist=${removeResult.dist.toFixed(1)} before=${removeResult.before} after=${removeResult.after}`);

// ── 11. Wait for sandal removal animation (2600ms real, but SwiftShader ~1FPS so allow 8s)
await new Promise(r => setTimeout(r, 8000));

// ── 12. Check shoes removed
const shoesAfter = await page.evaluate(() => window.__horeb.state().shoes);
t('e2e: sandal removal completed', shoesAfter === 'unshod', `shoes=${shoesAfter}`);
await page.screenshot({ path: join(SHOTS, '18-sandal-removal.png') });

// ── 12. Approach bush closer (now unshod) — inside inner boundary
await page.evaluate(() => {
  const w = window.__horeb.world;
  // R_INNER = 6.5. Place at distance 5 (inside inner boundary) → should be blocked
  w.pos.set(0, -366 + 5);
  w.vel.set(0, 0);
  w.yaw = Math.PI;
});
await new Promise(r => setTimeout(r, 2000));
const innerBlock = await page.evaluate(() => {
  const s = window.__horeb.state();
  return { block: s.block, prompt: s.prompt, shoes: s.shoes };
});
t('e2e: inner boundary blocks approach when unshod', innerBlock.block === 'inner', `block=${innerBlock.block}`);
t('e2e: no shoes prompt when unshod', !innerBlock.prompt || innerBlock.prompt.kind !== 'shoes', innerBlock.prompt ? JSON.stringify(innerBlock.prompt) : 'null');

// ── 13. No console errors
t('e2e: no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
