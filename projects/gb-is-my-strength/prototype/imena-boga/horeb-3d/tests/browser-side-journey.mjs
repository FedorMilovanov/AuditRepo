// Side-exhibit pedestrian witness: real player keyboard input, no teleport,
// no world position/yaw mutation, no simulation clock manipulation.
// Four disjoint CI zone shards visit all 42 exhibits, with real WASD,
// arrow turns and E, returning to the central aisle after every detour.
// No teleport or simulation/position mutation, including during setup.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chrome = [process.env.HOREB_BROWSER_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
  .find((p) => p && existsSync(p));
if (!chrome) throw new Error('SIDES BLOCKED: real Chromium executable required');
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, args, protocolTimeout: 120000,
});
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const dir = join(process.cwd(), '.test-build');
const shots = join(dir, 'screenshots');
mkdirSync(shots, { recursive: true });
const SIDE_SHARD = process.env.HOREB_SIDE_SHARD || 'sample';
const SHARDS = {
  '1-2': { zones: [1, 2], count: 10 },
  '3-4': { zones: [3, 4], count: 18 },
  '5': { zones: [5], count: 12 },
  '7': { zones: [7], count: 2 },
  sample: { ids: ['elohim', 'el-olam', 'el-roi', 'el-gibbor',
    'qedosh-yisrael', 'abba', 'ehyeh'], count: 7 },
};
const selector = SHARDS[SIDE_SHARD];
if (!selector) throw new Error('Invalid HOREB_SIDE_SHARD ' + SIDE_SHARD);
const witnessFile = join(dir, 'side-journey-witness-' + SIDE_SHARD + '.json');
const record = { source: 'real WASD / arrow turn / E only',
  shard: SIDE_SHARD, expected: selector.count, selectedIds: [],
  teleportCalls: 0, exhibits: [], segments: [], errors: [], result: null };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let page;
const read = () => page.evaluate(() => {
  const w = window.__horeb?.world;
  if (!w) return null;
  const p = w.position;
  const s = window.__horeb.state();
  return { x: p.x, z: p.z, yaw: w.yaw, zone: s?.zone,
    prompt: s?.prompt, shoes: w.shoes, block: s?.block,
    frame: w.renderer.info.render.frame, contextLost: w.contextLost,
    inputLocked: w.inputLocked };
});
const safe = (s, where) => {
  if (!s || !Number.isFinite(s.x) || !Number.isFinite(s.z) ||
      !Number.isFinite(s.yaw) || s.contextLost || s.inputLocked ||
      s.shoes !== 'shod' || Math.abs(s.x) > 26 ||
      Math.hypot(s.x, s.z + 366) < 13.98)
    throw new Error('SIDE INVALID STATE ' + where + ': ' + JSON.stringify(s));
};
const wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x));

// Turning is done by holding the real arrow key, not setting world.yaw.
async function face(yaw, label) {
  const started = Date.now();
  let s = await read();
  // Low-FPS SwiftShader can render no frame during a 45–140 ms tap.
  // Hold the REAL arrow key until a simulation-frame yaw change is observed;
  // do not change World.yaw or skip time. Still fail on a genuinely stalled
  // renderer/controller, and require the physical E prompt afterwards.
  while (Math.abs(wrap(yaw - s.yaw)) > 0.12) {
    if (Date.now() - started > 30000)
      throw new Error('SIDE TURN STALLED ' + label + ' ' +
        JSON.stringify({ targetYaw: yaw, state: s }));
    const diff = wrap(yaw - s.yaw);
    const key = diff > 0 ? 'ArrowLeft' : 'ArrowRight';
    const before = s.yaw;
    let changed = false;
    await page.keyboard.down(key);
    try {
      for (let n = 0; n < 30; n++) {
        await sleep(120);
        s = await read(); safe(s, label + '-turn');
        const remaining = wrap(yaw - s.yaw);
        if (Math.abs(remaining) <= 0.12 ||
            Math.sign(remaining) !== Math.sign(diff) ||
            Math.abs(wrap(s.yaw - before)) >= 0.035) {
          changed = true;
          break;
        }
      }
    } finally {
      await page.keyboard.up(key);
    }
    if (!changed)
      throw new Error('SIDE TURN NO RENDERED ANGULAR PROGRESS ' + label +
        JSON.stringify({ key, targetYaw: yaw, state: s }));
    await sleep(90);
    s = await read(); safe(s, label + '-turn-settle');
  }
}
// Steering axes uses actual W/S/A/D with yaw≈0. Stop before targets, allow
// movement to decelerate, then correct small overshoots by a real reverse key.
async function axis(kind, target, label, tolerance = 0.65) {
  const axisName = kind === 'x' ? 'x' : 'z';
  const start = Date.now();
  for (let attempt = 0; attempt < 8; attempt++) {
    const initial = await read();
    safe(initial, label + '-axis-start');
    if (Math.abs(initial[axisName] - target) <= tolerance) return initial;
    if (Date.now() - start > 130000)
      throw new Error('SIDE AXIS TIMEOUT ' + label + JSON.stringify({ target, initial }));
    const positive = target > initial[axisName];
    const key = kind === 'x' ? (positive ? 'KeyD' : 'KeyA')
      : positive ? 'KeyS' : 'KeyW';
    await page.keyboard.down(key);
    const started = Date.now();
    let lastMovement = Date.now();
    let prev = initial[axisName];
    try {
      while (true) {
        await sleep(160);
        const s = await read(); safe(s, label + '-move');
        if (Math.abs(s[axisName] - prev) > 0.025) lastMovement = Date.now();
        if ((positive ? s[axisName] >= target - 0.35 :
          s[axisName] <= target + 0.35)) break;
        if (Date.now() - started > 115000 || Date.now() - lastMovement > 9000)
          throw new Error('SIDE COLLISION/STALLED ' + label + ' ' +
            JSON.stringify({ key, target, state: s }));
        prev = s[axisName];
      }
    } finally { await page.keyboard.up(key); }
    await sleep(480);
    const result = await read(); safe(result, label + '-settle');
    record.segments.push({ label, axis: axisName, target, ...result });
    if (Math.abs(result[axisName] - target) <= tolerance) return result;
  }
  throw new Error('SIDE NO CONVERGENCE ' + label +
    JSON.stringify({ target, state: await read() }));
}

let approach = [];

try {
  page = await browser.newPage();
  await page.setViewport({ width: 640, height: 480, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on('pageerror', (e) => record.errors.push('pageerror ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') record.errors.push('console ' + m.text());
  });
  const res = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (res?.status() !== 200) throw new Error('SIDE intro HTTP ' + res?.status());
  const start = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((el) =>
      /^(Начать|Продолжить) путешествие$/.test((el.textContent || '').trim()));
    b?.click(); return !!b;
  });
  if (!start) throw new Error('SIDE intro button missing');
  await page.waitForFunction(() => !!window.__horeb?.world && !!window.__horeb?.state(),
    { polling: 200, timeout: 90000 });
  const initial = await read(); safe(initial, 'initial');
  if (Math.abs(initial.z + 2) > 0.6 || Math.abs(initial.x) > 0.5)
    throw new Error('SIDE unsafe/altered spawn ' + JSON.stringify(initial));
  // Test-side tripwire: an accidental future direct teleport must be a FAIL,
  // even if its destination happens to satisfy the ordinary E-distance checks.
  await page.evaluate(() => {
    const w = window.__horeb.world;
    window.__horebSideTeleportViolations = 0;
    for (const method of ['teleportTo', 'teleportZone']) {
      if (typeof w[method] !== 'function') throw new Error('SIDE missing movement guard: ' + method);
      Object.defineProperty(w, method, {
        configurable: false, writable: false,
        value: () => {
          window.__horebSideTeleportViolations++;
          throw new Error('SIDE FORBIDDEN TELEPORT ' + method);
        },
      });
    }
  });

  // Use the production registry, not a hand-maintained list that might omit
  // an exhibit added later. The zone partition must exhaust all 42 IDs.
  const registry = await page.evaluate(() => window.__horeb.world.exhibitPos.map((p) => ({
    id: p.e.id, zone: p.e.zone, x: p.x, z: p.z,
  })));
  const unique = new Set(registry.map((p) => p.id));
  const counts = [1, 2, 3, 4, 5, 7].map((zone) =>
    registry.filter((p) => p.zone === zone).length);
  if (registry.length !== 42 || unique.size !== 42 ||
      counts.join(',') !== '6,4,7,11,12,2')
    throw new Error('SIDE registry changed: ' + JSON.stringify({
      size: registry.length, unique: unique.size, zoneCounts: counts,
    }));
  approach = registry.filter((p) => selector.ids
    ? selector.ids.includes(p.id) : selector.zones.includes(p.zone))
    .sort((a, b) => b.z - a.z || a.id.localeCompare(b.id))
    .map((p) => ({ id: p.id, zone: p.zone, label: p.id }));
  if (approach.length !== selector.count ||
      new Set(approach.map((p) => p.id)).size !== selector.count ||
      (selector.ids && selector.ids.some((id) => !approach.some((p) => p.id === id))))
    throw new Error('SIDE shard incomplete: ' + JSON.stringify({
      shard: SIDE_SHARD, ids: approach.map((p) => p.id),
    }));
  record.selectedIds = approach.map((p) => p.id);
  console.log('SIDE SHARD ' + SIDE_SHARD + ' actual visits=' +
    record.selectedIds.length + '/42: ' + record.selectedIds.join(','));

  for (const item of approach) {
    const ex = await page.evaluate((id) => {
      const p = window.__horeb.world.exhibitPos.find((v) => v.e.id === id);
      if (!p) return null;
      return { id, x: p.x, z: p.z, nx: p.nx, nz: p.nz,
        label: p.e.displayLabelRu, zone: p.e.zone };
    }, item.id);
    if (!ex || ex.zone !== item.zone)
      throw new Error('SIDE exhibit mislocated: ' + JSON.stringify({ item, ex }));
    // Each corridor segment is at most 20 metres. Keep the character on the
    // centre line: we are validating a real detour, not wall-sliding for 200m.
    while (true) {
      await face(0, item.id + '-corridor-facing');
      const pos = await read(); safe(pos, item.id + '-corridor');
      const goal = ex.z + 2.5;
      if (pos.z <= goal + 0.65) break;
      await axis('z', Math.max(goal, pos.z - 18),
        item.id + '-corridor-segment');
      await axis('x', 0, item.id + '-recenter');
    }
    await face(0, item.id + '-side-facing');
    const sideX = ex.x - Math.sign(ex.x) * 2.4;
    await axis('x', sideX, item.id + '-side-detour', 0.58);
    await sleep(350);
    let near = await read(); safe(near, item.id + '-approach');
    // Interaction radius is 3.6 m. A stele at x=±8.5 can finish a little
    // beyond it after keyboard momentum has settled. Physically correct the
    // longitudinal approach with W/S rather than relaxing canInspectExhibit
    // or directly moving the visitor through a wall/collider.
    if (Math.hypot(near.x - ex.x, near.z - ex.z) > 3.35) {
      await axis('z', ex.z + 1.75, item.id + '-final-forward', 0.4);
      near = await read(); safe(near, item.id + '-final-approach');
    }
    if (Math.hypot(near.x - ex.x, near.z - ex.z) > 3.58)
      throw new Error('SIDE target too far ' + JSON.stringify({ ex, near }));
    await face(Math.atan2(-(ex.x - near.x), -(ex.z - near.z)),
      item.id + '-face-plaque');
    await page.waitForFunction((id) => window.__horeb?.state()?.prompt?.id === id,
      { polling: 150, timeout: 7000 }, item.id);
    const ready = await read(); safe(ready, item.id + '-ready');
    if (ready.prompt?.id !== item.id ||
        !await page.evaluate((id) => window.__horeb.world.canInspectExhibit(id), item.id))
      throw new Error('SIDE prompt/inspection wrong ' + JSON.stringify(ready));
    await page.keyboard.press('KeyE');
    await page.waitForSelector('[role="dialog"]', { timeout: 12000 });
    const actual = await page.$eval('[role="dialog"]', (node) => node.textContent || '');
    if (!actual.includes(ex.label))
      throw new Error('SIDE incorrect dossier ' + item.id);
    const file = 'journey-side-' + SIDE_SHARD + '-' + item.label + '.png';
    await page.screenshot({ path: join(shots, file) });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'),
      { polling: 150, timeout: 10000 });
    record.exhibits.push({ id: item.id, zone: item.zone, point: ex,
      at: ready, screenshot: file, dossier: 'PASS' });
    console.log('PASS real side detour ' + item.id + ' ' +
      JSON.stringify({ x: near.x, z: near.z, zone: near.zone }));
    await face(0, item.id + '-return-facing');
    await axis('x', 0, item.id + '-return-centre');
    const centre = await read(); safe(centre, item.id + '-return-centre');
    if (Math.abs(centre.x) > 0.8)
      throw new Error('SIDE could not return to central passage ' +
        JSON.stringify(centre));
  }
  const teleportViolations = await page.evaluate(() => window.__horebSideTeleportViolations);
  record.teleportCalls = teleportViolations;
  if (teleportViolations !== 0)
    throw new Error('SIDE forbidden movement method invoked ' + teleportViolations);
  if (record.exhibits.length !== approach.length || record.errors.length)
    throw new Error('SIDE incomplete with runtime errors ' + JSON.stringify(record));
  record.result = 'PASS';
  console.log('PASS SHARD ' + SIDE_SHARD + ': ' + approach.length +
    '/42 side scenes reached by keyboard WASD + arrow turns + E; no teleport or collision stalls, all returned to centre');
} catch (error) {
  record.result = 'FAIL';
  record.failure = String(error?.stack || error);
  console.error(record.failure);
  process.exitCode = 1;
} finally {
  if (page) {
    for (const key of ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight'])
      await page.keyboard.up(key).catch(() => {});
  }
  writeFileSync(witnessFile, JSON.stringify(record, null, 2));
  await browser.close();
}
