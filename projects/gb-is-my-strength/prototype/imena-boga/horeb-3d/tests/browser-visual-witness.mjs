// Deterministic screenshot witness for all 8 HOREB zones.
// It checks that a *newly rendered frame* follows each zone transition;
// a correct state label without a WebGL frame is not visual evidence.
// Images are CI artifacts for human art direction, NOT aesthetic PASS claims.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chromePaths = [
  process.env.HOREB_BROWSER_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromePath = chromePaths.find((path) => existsSync(path));
if (!chromePath) throw new Error('Visual witness cannot run: Chrome binary missing.');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const output = join(process.cwd(), '.test-build');
const shots = join(output, 'screenshots');
mkdirSync(shots, { recursive: true });
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');

const witness = {
  timestamp: new Date().toISOString(),
  browser: chromePath,
  renderingMode: process.env.HOREB_SWIFTSHADER === '1' ? 'software-SwiftShader' : 'browser-default-not-verified-GPU',
  desktop: [], mobile: [], details: [], closeBush: null, innerBush: null, errors: [],
};
const browser = await puppeteer.launch({
  executablePath: chromePath, headless: true, args, protocolTimeout: 90000,
});
const attachErrors = (page, prefix) => {
  page.on('pageerror', (err) => witness.errors.push(prefix + ': ' + err.message));
  page.on('response', (response) => {
    if (response.status() >= 400) witness.errors.push(prefix + ': HTTP ' + response.status() + ' ' + response.url());
  });
};
const startWorld = async (page) => {
  // New pages in one Chromium browser can share HTTP cache. A conditional
  // navigation may return 304 even though the scene is fine; demand a fresh
  // document response for each independent visual witness instead.
  await page.setCacheEnabled(false);
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (response?.status() !== 200) throw new Error('Unexpected intro HTTP status ' + response?.status());
  const clicked = await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')]
      .find((element) => /^(Начать|Продолжить) путешествие$/.test((element.textContent || '').trim()));
    button?.click();
    return !!button;
  });
  if (!clicked) throw new Error('WebGL start button missing');
  await page.waitForFunction(() => !!window.__horeb?.world && !!window.__horeb?.state(), { timeout: 90000 });
};
const waitForRenderedFrame = async (page, before, zone) => {
  await page.waitForFunction(({ previousFrame, expectedZone }) => {
    const debug = window.__horeb;
    return !!debug && debug.state()?.zone === expectedZone &&
      debug.world.renderer.info.render.frame > previousFrame;
  }, { polling: 200, timeout: 60000 }, { previousFrame: before, expectedZone: zone });
};
// Camera orientation is part of the art witness. After detail captures the
// yaw still points at Gethsemane; a mere teleport would photograph empty Horeb.
const aimCameraAtBush = async (page) => page.evaluate(() => {
  const w = window.__horeb?.world;
  const bush = w?.bush?.group?.position;
  if (!w || !bush) throw new Error('Cannot frame the living bush');
  const here = w.position;
  const dx = bush.x - here.x, dz = bush.z - here.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 6.5 || !Number.isFinite(distance))
    throw new Error('Unsafe or invalid bush camera distance: ' + distance);
  w.yaw = Math.atan2(-dx, -dz);
  w.pitch = Math.atan2(bush.y + 0.85 - w.camera.position.y, distance);
});
const captureZone = async (page, zone, prefix) => {
  const priorFrame = await page.evaluate(() => window.__horeb.world.renderer.info.render.frame);
  await page.evaluate((index) => window.__horeb.world.teleportZone(index), zone);
  await waitForRenderedFrame(page, priorFrame, zone);
  const state = await page.evaluate(() => {
    const s = window.__horeb.state();
    const world = window.__horeb.world;
    return {
      zone: s.zone, fps: s.fps, calls: s.calls, triangles: s.tris,
      quality: world.settings.quality, pixelRatio: world.renderer.getPixelRatio(),
      frame: world.renderer.info.render.frame,
    };
  });
  const file = 'visual-' + prefix + '-zone-' + zone + '.png';
  await page.screenshot({ path: join(shots, file) });
  return { requestedZone: zone, screenshot: file, ...state };
};
try {
  const desktop = await browser.newPage();
  attachErrors(desktop, 'desktop');
  await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await startWorld(desktop);
  for (let zone = 0; zone < 8; zone++) {
    const evidence = await captureZone(desktop, zone, 'desktop');
    witness.desktop.push(evidence);
    console.log('PASS desktop zone ' + zone + ' screenshot ' + evidence.screenshot);
  }
  // A detail witness is essential: the zone-6 spawn is 28m from the mouth
  // and perspective conceals real roof deformation. This is only a camera
  // for human visual acceptance, not a pedestrian navigation witness.
  const beforeExit = await desktop.evaluate(() => {
    const w = window.__horeb.world;
    const frame = w.renderer.info.render.frame;
    w.teleportTo(0, -309.5);
    w.yaw = 0; w.pitch = 0.22;
    return frame;
  });
  await waitForRenderedFrame(desktop, beforeExit, 6);
  await new Promise((resolve) => setTimeout(resolve, 350));
  const exitClose = 'visual-detail-zone6-exit-roof.png';
  await desktop.screenshot({ path: join(shots, exitClose) });
  witness.details.push({ id: 'zone6-continuous-roof', zone: 6, screenshot: exitClose,
    narrative: 'Camera at z=-309.5 looking toward exit; no nav certification' });
  console.log('PASS close-up zone-6 continuous roof screenshot ' + exitClose);

  // Previous QA's -0.37 pitch looked horizontally toward the BACK WALL
  // and a stele near z=-201. Two materially different down-facing
  // compositions at z=-206, halfway between right-side steles, are required.
  // Both positions remain strictly inside the existing x<=4.2 guard.
  for (const [slug, x, pitch] of [
    ['zone4-chasm-edge', 2.95, -0.42],
    ['zone4-chasm-depth', 3.45, -0.62],
  ]) {
    const beforeRavine = await desktop.evaluate(({ x, pitch }) => {
      const w = window.__horeb.world;
      const frame = w.renderer.info.render.frame;
      w.teleportTo(x, -206);
      w.yaw = -Math.PI / 2;
      w.pitch = pitch;
      return { frame, actualX: w.position.x, actualZ: w.position.y };
    }, { x, pitch });
    // A line of sight steeper than the floor-edge clearance would
    // intersect the walking slab BEFORE reaching the gorge. Such a PNG is
    // deceptive even if Chromium draws it successfully.
    const eyeToLip = (4.82 - beforeRavine.actualX) *
      Math.tan(Math.abs(pitch));
    if (beforeRavine.actualX > 3.5 ||
        Math.abs(beforeRavine.actualZ + 206) > 0.4 ||
        eyeToLip > 1.35)
      throw new Error('Ravine evidence invalid: clipping or floor-occluded camera ' +
        JSON.stringify({ ...beforeRavine, pitch, eyeToLip }));
    await waitForRenderedFrame(desktop, beforeRavine.frame, 4);
    await new Promise((resolve) => setTimeout(resolve, 330));
    const file = 'visual-detail-' + slug + '.png';
    await desktop.screenshot({ path: join(shots, file) });
    witness.details.push({ id: slug, zone: 4, screenshot: file,
      narrative: 'Real safe ledge looking down, camera-only QA not locomotion' });
    console.log('PASS ravine ' + slug + ' visual screenshot ' + file);
  }

  // Hardware safety witness. Compare low-quality startup draw calls to the
  // before-optimization artifact (306 calls in zone 0). This is a GPU command
  // budget check, not an FPS claim from software SwiftShader.
  if (witness.desktop[0].quality === 'low' && witness.desktop[0].calls >= 245)
    throw new Error('PERFORMANCE: zone-0 distance culling ineffective, draw calls=' +
      witness.desktop[0].calls + ' (baseline 306)');
  // At zone-7 spawn, the Horeb signs are about 21 metres ahead, so a
  // hard-coded 20-metre threshold incorrectly selected zero nearby props.
  // Derive the observation range from the same quality profile as World.
  // The actual uninterrupted 0->7->0 journey is tested separately.
  const groups = await desktop.evaluate(() => {
    const w = window.__horeb.world;
    const z = w.position.z, list = w.scenicGroups;
    const cutoff = w.settings.quality === 'low' ? 85 : 125;
    const close = list.filter((item) => Math.abs(item.z - z) < cutoff - 1);
    const distant = list.filter((item) => Math.abs(item.z - z) > cutoff + 25);
    return { allNear: close.every((item) => item.object.visible),
      allDistantHidden: distant.every((item) => !item.object.visible),
      close: close.length, distant: distant.length, cutoff };
  });
  if (!groups.allNear || !groups.allDistantHidden || !groups.close || !groups.distant)
    throw new Error('SCENIC CULL: expected near objects visible, distant art hidden ' +
      JSON.stringify(groups));
  console.log('PASS nearby exhibits preserved / distant meshes not drawn; zone0=' +
    witness.desktop[0].calls + ' GPU calls');
  // Editorial LAB art inspection only: a stable 4.6 m view of the actual
  // Beersheba well, Hagar's spring and Gethsemane grove. These photographic
  // camera positions do NOT certify route accessibility; the independent
  // journey test uses only real keyboard locomotion.
  for (const [id, slug] of [['el-olam', 'beersheba-well'],
    ['el-roi', 'hagar-spring'], ['abba', 'gethsemane-grove']]) {
    const before = await desktop.evaluate(() => window.__horeb.world.renderer.info.render.frame);
    const view = await desktop.evaluate((exhibitId) => {
      const w = window.__horeb.world;
      const e = w.exhibitPos.find((p) => p.e.id === exhibitId);
      if (!e) throw new Error('Missing material-detail exhibit ' + exhibitId);
      const n = Math.hypot(e.nx, e.nz), ux = e.nx / n, uz = e.nz / n;
      w.teleportTo(e.x + ux * 4.6, e.z + uz * 4.6);
      const here = w.position;
      const aimX = e.x + ux * 1.5, aimZ = e.z + uz * 1.5;
      w.yaw = Math.atan2(-(aimX - here.x), -(aimZ - here.z));
      w.pitch = -0.20;
      return { id: exhibitId, zone: e.e.zone, x: here.x, z: here.z,
        canInspect: w.canInspectExhibit(exhibitId) };
    }, id);
    if (!view.canInspect) throw new Error('Detail camera cannot inspect ' + id);
    await waitForRenderedFrame(desktop, before, view.zone);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const file = 'visual-detail-' + slug + '.png';
    await desktop.screenshot({ path: join(shots, file) });
    witness.details.push({ ...view, screenshot: file });
    console.log('PASS material-detail ' + slug + ' screenshot ' + file);
  }
  // The arrival screenshot is far from the bush. Capture the physical outer
  // boundary as a second, strictly shod view; never bypass the sacred perimeter.
  const beforeClose = await desktop.evaluate(() => window.__horeb.world.renderer.info.render.frame);
  await desktop.evaluate(() => window.__horeb.world.teleportTo(0, -351));
  await aimCameraAtBush(desktop);
  await desktop.waitForFunction((frame) => {
    const w = window.__horeb?.world, state = window.__horeb?.state();
    return !!w && !!state && state.zone === 7 &&
      state.distBush >= 14 && state.distBush < 17 &&
      w.renderer.info.render.frame > frame;
  }, { polling: 200, timeout: 60000 }, beforeClose);
  // Give the intentional 700 ms CSS transition time to finish. A screenshot
  // taken on the first WebGL frame would falsely show a fully opaque HUD.
  await desktop.waitForFunction(() => {
    const hud = document.querySelector('.hud');
    return !!hud && Math.abs(Number(getComputedStyle(hud).opacity) - 0.4) < 0.025;
  }, { polling: 100, timeout: 6000 });
  await desktop.screenshot({ path: join(shots, 'visual-desktop-bush-boundary.png') });
  witness.closeBush = await desktop.evaluate(() => {
    const world = window.__horeb.world;
    const hud = document.querySelector('.hud');
    return {
      distance: window.__horeb.state().distBush,
      shoes: window.__horeb.state().shoes,
      zone: window.__horeb.state().zone,
      hudOpacity: hud ? Number(getComputedStyle(hud).opacity) : 0,
      promptOpacity: (() => {
        const prompt = [...document.querySelectorAll('button.prompt')].find((b) => b.textContent?.includes('Снять обувь'));
        return prompt ? Number(getComputedStyle(prompt).opacity) : 0;
      })(),
      ambientIntensity: world.ambient.intensity,
      hemisphereIntensity: world.hemi.intensity,
      moonIntensity: world.moon.intensity,
      thresholdScree: ['outer-threshold-scree', 'inner-threshold-scree'].map((name) => {
        const obj = world.zones.group.getObjectByName(name);
        if (!obj?.isInstancedMesh) return { name, count: 0, maxAngleGap: 0 };
        const data = obj.instanceMatrix.array;
        const angles = Array.from({ length: obj.count }, (_, i) =>
          Math.atan2(data[i * 16 + 14] + 366, data[i * 16 + 12]))
          .sort((a, b) => a - b);
        let maxAngleGap = 0;
        for (let i = 0; i < angles.length; i++) {
          const next = i + 1 < angles.length ? angles[i + 1] : angles[0] + Math.PI * 2;
          maxAngleGap = Math.max(maxAngleGap, next - angles[i]);
        }
        return { name, count: obj.count, maxAngleGap };
      }),
    };
  });
  // Owner-approved art direction: the bush is visually dominant. Navigation
  // recedes softly to 40%, while the sandal-action prompt remains fully visible.
  if (Math.abs(witness.closeBush.hudOpacity - 0.4) > 0.025)
    throw new Error('BUSH UX: restored cinematic HUD fade is not present');
  if (witness.closeBush.promptOpacity < 0.99)
    throw new Error('BUSH SAFETY: sandal action must stay fully visible outside dimmed HUD');
  if (Math.abs(witness.closeBush.ambientIntensity - 0.35) > 0.02 ||
      Math.abs(witness.closeBush.hemisphereIntensity - 0.55) > 0.02 ||
      Math.abs(witness.closeBush.moonIntensity - 0.55) > 0.02)
    throw new Error('BUSH ART: dark predawn lighting was unexpectedly brightened');
  if (witness.closeBush.thresholdScree?.length !== 2 ||
      witness.closeBush.thresholdScree[0].count !== 36 ||
      witness.closeBush.thresholdScree[1].count !== 25 ||
      witness.closeBush.thresholdScree[0].maxAngleGap < 0.5 ||
      witness.closeBush.thresholdScree[1].maxAngleGap < 0.65)
    throw new Error('BUSH ART: threshold stones regressed to artificial uniform circles');
  console.log('PASS outer bush boundary: subdued HUD, natural scree, visible sandal action');
  // Additional close-up from the *permitted* unshod zone. This is essential
  // for judging whether the bush reads as a living shrub, not only as sparks.
  const initiated = await desktop.evaluate(() => window.__horeb.world.removeShoes());
  if (!initiated) throw new Error('BUSH WALK: cannot remove footwear at outer boundary');
  // Removal now progresses in World simulation time, not wall time. A busy
  // SwiftShader runner may take >10 s to render 2.6 s of active frames.
  // Wait for the actual terminal state, fail with live diagnostics if stalled.
  try {
    await desktop.waitForFunction(() => window.__horeb?.world?.shoes === 'unshod',
      { polling: 200, timeout: 30000 });
  } catch (error) {
    const state = await desktop.evaluate(() => {
      const w = window.__horeb?.world;
      return w ? { shoes: w.shoes, elapsed: w.shoeRemovalElapsed,
        simTime: w.t, fps: w.fps, locked: w.inputLocked,
        contextLost: w.contextLost, hidden: document.hidden } : null;
    });
    throw new Error('BUSH WALK: removal did not complete in active simulation: ' +
      JSON.stringify(state), { cause: error });
  }
  const frameBefore = await desktop.evaluate(() => window.__horeb.world.renderer.info.render.frame);
  await desktop.evaluate(() => window.__horeb.world.teleportTo(0, -358));
  await aimCameraAtBush(desktop);
  await desktop.waitForFunction((previousFrame) => {
    const s = window.__horeb?.state(), w = window.__horeb?.world;
    return !!s && !!w && s.shoes === 'unshod' && s.zone === 7 &&
      s.distBush >= 6.5 && s.distBush < 9 &&
      w.renderer.info.render.frame > previousFrame;
  }, { polling: 200, timeout: 10000 }, frameBefore);
  await desktop.screenshot({ path: join(shots, 'visual-desktop-bush-inner-boundary.png') });
  witness.innerBush = await desktop.evaluate(() => ({
    distance: window.__horeb.state().distBush,
    shoes: window.__horeb.state().shoes,
    foliageInstances: window.__horeb.world.bush.foliage.count,
    bushFoliageVisible: window.__horeb.world.bush.foliage.visible,
    draws: window.__horeb.world.renderer.info.render.calls,
  }));
  if (witness.innerBush.foliageInstances < 32 || !witness.innerBush.bushFoliageVisible)
    throw new Error('BUSH VISUAL: living foliage missing at close range');
  console.log('PASS living bush close-up from permitted unshod boundary');
  await desktop.close();

  const mobile = await browser.newPage();
  attachErrors(mobile, 'mobile-emulation');
  await mobile.setViewport({
    width: 390, height: 844, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  await startWorld(mobile);
  for (const zone of [0, 4, 7]) {
    const evidence = await captureZone(mobile, zone, 'mobile-emulation');
    witness.mobile.push(evidence);
    console.log('PASS mobile-emulated zone ' + zone + ' screenshot ' + evidence.screenshot);
  }
  await mobile.close();
} catch (error) {
  witness.errors.push('UNCAUGHT: ' + (error?.stack || String(error)));
} finally {
  await browser.close();
  writeFileSync(join(output, 'visual-witness.json'), JSON.stringify(witness, null, 2) + '\n');
}
const expectedDetailShots = [
  'visual-detail-zone6-exit-roof.png',
  'visual-detail-zone4-chasm-edge.png',
  'visual-detail-zone4-chasm-depth.png',
  'visual-detail-beersheba-well.png',
  'visual-detail-hagar-spring.png',
  'visual-detail-gethsemane-grove.png',
];
const actualDetailShots = witness.details.map((item) => item.screenshot);
const detailComplete = witness.details.length === 6 &&
  actualDetailShots.length === new Set(actualDetailShots).size &&
  expectedDetailShots.every((name) => actualDetailShots.includes(name));
const ok = witness.desktop.length === 8 && witness.mobile.length === 3 &&
  detailComplete &&
  witness.closeBush?.shoes === 'shod' && witness.innerBush?.shoes === 'unshod' &&
  witness.innerBush?.distance >= 6.5 && witness.errors.length === 0;
console.log('Visual witness: ' + witness.desktop.length + '/8 desktop, ' +
  witness.mobile.length + '/3 mobile-emulated, ' + witness.details.length +
  '/6 prop/detail screenshots; errors=' + witness.errors.length +
  '. Software/remote browser snapshots are NOT art-direction approval.');
if (!ok) for (const error of witness.errors) console.error('FAIL ' + error);
process.exitCode = ok ? 0 : 1;
