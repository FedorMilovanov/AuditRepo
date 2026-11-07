// Browser E2E (Playwright Chromium, SwiftShader software WebGL). Run: node tests/e2e.mjs  (requires playwright installed; see README)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');
import { fileURLToPath } from 'url';
import path from 'path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'file://' + root + '/dist/index.html';
const shots = root + '/audit/screens/';
let pass = 0, fail = 0; const log = [];
const t = (n, ok, extra = '') => { ok ? pass++ : fail++; const l = `${ok ? 'PASS' : 'FAIL'} ${n} ${extra}`; console.log(l); log.push(l); };
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(90000);
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url()));
await page.goto(URL + '?e2e');
await page.waitForTimeout(2500);
await page.screenshot({ path: shots + '01-intro-1280.png' });
t('intro title visible', await page.getByRole('heading', { name: 'ИМЕНА БОГА' }).isVisible());
await page.getByRole('button', { name: 'Начать путешествие' }).click();
await page.waitForFunction(() => window.__horeb && window.__horeb.state(), null, { timeout: 60000 });
await page.waitForTimeout(4000);
const S = () => page.evaluate(() => window.__horeb.state());
const W = (code) => page.evaluate(code);
const bright = async (name) => {
  const buf = await page.screenshot({ path: shots + name });
  return page.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = 160; c.height = 100; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 160, 100); const d = g.getImageData(0, 0, 160, 100).data; let s = 0, v = 0; const vals = []; for (let i = 0; i < d.length; i += 4) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; s += l; vals.push(l); } const m = s / vals.length; for (const x of vals) v += (x - m) ** 2; return { mean: m, std: Math.sqrt(v / vals.length) }; }, buf.toString('base64'));
};
const b0 = await bright('02-zone0-start.png');
t('G1 WebGL canvas renders non-empty frame', b0.std > 4 && b0.mean > 3, JSON.stringify(b0));
let s = await S(); t('state reports fps & draw calls', s.calls > 0, `fps=${s.fps} calls=${s.calls} tris=${s.tris}`);
// walk forward with real keys
const z0 = s.z; await page.keyboard.down('KeyW'); await page.waitForTimeout(2500); await page.keyboard.up('KeyW');
s = await S(); t('keyboard W moves player forward (-z)', s.z < z0 - 0.5, `z ${z0.toFixed(2)} -> ${s.z.toFixed(2)}`);
// angled wall entry
await W(() => { const w = window.__horeb.world; w.teleportTo(-5.5, -20); w.yaw = Math.PI / 2 - 0.3; });
await page.keyboard.down('KeyW'); await page.waitForTimeout(4000); await page.keyboard.up('KeyW');
s = await S(); t('wall at angle: player stays inside', Math.abs(s.x) < 7, `x=${s.x.toFixed(2)}`);
// exhibit zone 1
await W(() => { const w = window.__horeb.world; w.teleportTo(-2.6, -16.4); w.yaw = Math.atan2(-(-5.0 - -2.6), -(-18 - -16.4)); w.pitch = 0; });
await page.waitForTimeout(800);
s = await S(); t('prompt for Gen 1:1 exhibit', s.prompt && s.prompt.id === 'elohim-gen-1-1', JSON.stringify(s.prompt));
await bright('03-zone1-exhibit.png');
await page.keyboard.press('KeyE'); await page.waitForTimeout(500);
const dlg = page.getByRole('dialog');
const txt = await dlg.textContent().catch(() => '');
t('dossier shows verse + category', txt.includes('Быт. 1:1') && txt.includes('Обозначение божества'));
const href = await dlg.locator('a[href*="mechon-mamre"]').first().getAttribute('href').catch(() => null);
t('dossier has source URL', !!href, href);
const heLang = await dlg.locator('[lang="he"][dir="rtl"]').count(); t('Hebrew in lang=he dir=rtl container', heLang > 0);
await page.screenshot({ path: shots + '04-dossier.png' });
await page.keyboard.press('Escape'); await page.waitForTimeout(300);
t('Esc closes dossier', (await page.getByRole('dialog').count()) === 0);
// zones screenshots
for (const z of [1, 2, 3, 4, 5, 6]) { await page.evaluate((zz) => window.__horeb.world.teleportZone(zz), z); await page.waitForTimeout(1500); const b = await bright(`05-zone${z}.png`); t(`zone ${z} renders`, b.std > 3, JSON.stringify(b)); }
// Sandals gate
await page.evaluate(() => { const w = window.__horeb.world; w.teleportTo(0, -330); w.yaw = 0; w.pitch = 0.05; });
await page.waitForTimeout(800);
await bright('06-zone7-first-view.png');
await page.evaluate(() => window.__horeb.world.teleportTo(0, -350.5));
await page.keyboard.down('KeyW'); await page.waitForTimeout(9000);
s = await S(); await page.keyboard.up('KeyW'); t('G3 shod: walking stops at outer threshold', s.block === 'outer' && s.distBush >= 14 - 1e-3 && s.shoes === 'shod', `dist=${s.distBush.toFixed(3)} block=${s.block}`);
t('G3 Ex 3:5 message shown', await page.getByText('Не подходи сюда', { exact: false }).first().isVisible().catch(() => false));
await bright('07-outer-threshold-shod.png');
await page.evaluate(() => window.__horeb.world.teleportTo(0, -366)); s = await S();
t('G3 shod: teleport into bush rejected (no crossing)', s.distBush >= 14 - 1e-3, `dist=${s.distBush.toFixed(3)}`);
await page.evaluate(() => window.__horeb.world.teleportTo(0, -351)); await page.waitForTimeout(300);
for (const ang of [0.6, -0.6, 1.2]) { await page.evaluate((a) => { window.__horeb.world.yaw = a; }, ang); await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW'); }
s = await S(); t('G3 shod: angled approaches rejected', s.distBush >= 14 - 1e-3, `dist=${s.distBush.toFixed(3)}`);
await page.evaluate(() => { const w = window.__horeb.world; w.teleportTo(0, -351); w.yaw = 0; });
await page.keyboard.press('KeyE'); await page.keyboard.press('KeyE'); await page.waitForTimeout(500);
s = await S(); t('removing state + movement lock', s.shoes === 'removing');
await page.keyboard.down('KeyW'); await page.waitForTimeout(800); await page.keyboard.up('KeyW');
const s2 = await S(); t('no movement while removing', Math.abs(s2.z - s.z) < 0.01);
await page.waitForTimeout(3500);
s = await S(); t('G3 shoes -> unshod', s.shoes === 'unshod');
await bright('08-after-unshod.png');
await page.evaluate(() => { window.__horeb.world.yaw = 0; window.__horeb.world.pitch = 0; });
await page.evaluate(() => window.__horeb.world.teleportTo(0, -358.6)); await page.keyboard.down('KeyW'); await page.waitForTimeout(8000);
s = await S(); await page.keyboard.up('KeyW'); t('unshod: allowed path walked closer', s.distBush < 13, `dist=${s.distBush.toFixed(3)}`);
t('G3 unshod: inner boundary holds (reached and stopped)', s.block === 'inner' && s.distBush >= 6.5 - 1e-3, `dist=${s.distBush.toFixed(3)} block=${s.block}`);
await bright('09-observation-boundary.png');
await page.evaluate(() => window.__horeb.world.teleportTo(0, -366)); s = await S();
t('G3 unshod: teleport into bush rejected', s.distBush >= 6.5 - 1e-3, `dist=${s.distBush.toFixed(3)}`);
// return to galleries
await page.evaluate(() => window.__horeb.world.teleportZone(2)); await page.waitForTimeout(500); s = await S();
t('G2 return to zone 2', s.zone === 2);
// settings
await page.getByRole('button', { name: 'Настройки' }).click(); await page.waitForTimeout(300);
await page.getByLabel(/Уменьшить движение/).click(); await page.getByLabel(/Уменьшить движение/).click(); await page.getByLabel(/Уменьшить движение/).click();
await page.getByLabel(/Звук окружения/).click();
await page.getByText('Низкое').click();
await page.getByRole('button', { name: 'Сбросить камеру' }).click(); await page.waitForTimeout(300);
t('settings toggles + reset camera, dialog closed', (await page.getByRole('dialog').count()) === 0);
// reload safety
await page.reload(); await page.waitForTimeout(1500);
await page.getByRole('button', { name: 'Начать путешествие' }).click();
await page.waitForFunction(() => window.__horeb && window.__horeb.state(), null, { timeout: 60000 });
s = await S(); t('reload: shoes reset to shod (safe)', s.shoes === 'shod');
await page.evaluate(() => { window.__horeb.world.teleportTo(0, -366); }); s = await S(); t('reload: bush still guarded', s.distBush >= 14 - 1e-3);
// context loss
await page.evaluate(() => { const gl = document.querySelector('canvas').getContext('webgl2'); window.__ext = gl.getExtension('WEBGL_lose_context'); window.__ext.loseContext(); });
await page.waitForTimeout(500);
t('context lost overlay', await page.getByText('Графический контекст потерян').isVisible());
await page.evaluate(() => window.__ext.restoreContext()); await page.waitForTimeout(1500);
t('context restored overlay hidden', !(await page.getByText('Графический контекст потерян').isVisible()));
// Reader mode widths
for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1440, 900], [1920, 1080]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(URL + '#read'); await p.waitForTimeout(600);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  t(`reader ${w}x${h} no horizontal overflow`, ov <= 0, `overflow=${ov}`);
  await p.screenshot({ path: shots + `10-reader-${w}.png` });
  if (w === 320) { const n = await p.locator('article.exhibit-card').count(); t('reader lists all exhibits', n >= 25, `n=${n}`); }
  await p.close();
}
await page.close();
try { const intro390 = await browser.newPage({ viewport: { width: 390, height: 844 } }); await intro390.goto(URL); await intro390.waitForTimeout(2500); await intro390.screenshot({ path: shots + '11-intro-390.png' }); await intro390.close(); } catch (e) { console.log('NOTE intro390 screenshot failed: ' + e.message.split('\n')[0]); }
// no WebGL fallback
const ctx = await browser.newContext(); const nog = await ctx.newPage();
await nog.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (/webgl/.test(t)) return null; return o.call(this, t, ...a); }; });
await nog.goto(URL); await nog.waitForTimeout(800);
t('no-WebGL fallback message + reader button', await nog.getByText('WebGL недоступен').isVisible() && await nog.getByRole('button', { name: 'Режим чтения' }).isVisible());
await ctx.close();
// Separate HTML file is built from the typed registry and does not require React/JS.
const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 640 } });
const noJs = await noJsContext.newPage();
await noJs.goto(URL);
t('no-JS shell links to complete HTML reader', await noJs.getByRole('link', { name: 'Читать экспозицию без JavaScript' }).isVisible());
await noJs.getByRole('link', { name: 'Читать экспозицию без JavaScript' }).click();
t('no-JS reader contains all 25 exhibits', await noJs.locator('article').count() === 25);
t('no-JS reader has source, category, RTL', await noJs.locator('a[href*="mechon-mamre"]:visible').count() > 0 && await noJs.locator('[lang="he"][dir="rtl"]').count() > 0);
t('no-JS 320px reader has no horizontal overflow', await noJs.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth));
await noJs.screenshot({ path: shots + '12-no-js-reader-320.png' });
await noJsContext.close();
const real = errors.filter((e) => !/GPU stall|swiftshader|WebGL-/i.test(e));
t('no console/page errors', real.length === 0, real.slice(0, 5).join(' | '));
console.log(`\n${pass} passed, ${fail} failed`);
await browser.close(); process.exit(fail ? 1 : 0);
