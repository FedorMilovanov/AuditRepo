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
  desktop: [], mobile: [], details: [], exitSeam: [], closeBush: null, innerBush: null, errors: [],
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

  // The earlier roof frame looks toward the mouth from too far away to
  // adjudicate the cave/terrain floor seam. Photograph the same physical
  // boundary from BOTH sides at human eye height. Camera-only witness:
  // actual keyboard movement is certified by the independent journey jobs.
  // The exact seam-vertex agreement is asserted separately in construct.ts.
  for (const pose of [
    { slug: 'zone6-threshold-inside', z: -315.5, yaw: 0, pitch: -0.27, zone: 6 },
    { slug: 'zone6-threshold-outside', z: -326, yaw: Math.PI, pitch: -0.37, zone: 7 },
  ]) {
    const previousFrame = await desktop.evaluate(({ z, yaw, pitch }) => {
      const w = window.__horeb.world;
      const before = w.renderer.info.render.frame;
      w.teleportTo(0, z);
      w.yaw = yaw;
      w.pitch = pitch;
      return before;
    }, pose);
    await waitForRenderedFrame(desktop, previousFrame, pose.zone);
    const boundary = await desktop.evaluate(async () => {
      const THREE = await import('/node_modules/.vite/deps/three.js');
      const w = window.__horeb.world;
      const cave = w.scene.getObjectByName('cave-floor-continuous');
      const terrain = w.scene.getObjectByName('horeb-exterior-terrain');
      if (!cave?.isMesh || !terrain?.isMesh)
        throw new Error('Threshold visual witness missing either actual floor mesh');
      const pos = cave.geometry.getAttribute('position');
      let z = Infinity, y = NaN;
      for (let i = 0; i < pos.count; i++) {
        if (Math.abs(pos.getX(i)) < 0.005 && pos.getZ(i) < -310 &&
            pos.getZ(i) < z) { z = pos.getZ(i); y = pos.getY(i); }
      }
      if (!Number.isFinite(z) || !Number.isFinite(y))
        throw new Error('Cannot locate cave-mouth centre boundary station');
      w.camera.updateMatrixWorld(true);
      const projected = new THREE.Vector3(0, y, z).project(w.camera);
      return { seamZ: z, seamY: y, ndcX: projected.x, ndcY: projected.y,
        cameraZ: w.camera.position.z,
        zone: window.__horeb.state().zone, caveMesh: cave.name,
        exteriorMesh: terrain.name };
    });
    if (boundary.zone !== pose.zone ||
        Math.abs(boundary.cameraZ - pose.z) > 0.05 ||
        ![boundary.seamZ, boundary.seamY, boundary.ndcX, boundary.ndcY]
          .every(Number.isFinite) ||
        Math.abs(boundary.ndcX) > 0.85 ||
        Math.abs(boundary.ndcY) > 0.85)
      throw new Error('Threshold seam not actually framed: ' +
        pose.slug + ' ' + JSON.stringify(boundary));
    await new Promise((resolve) => setTimeout(resolve, 350));
    const screenshot = 'visual-detail-' + pose.slug + '.png';
    await desktop.screenshot({ path: join(shots, screenshot) });
    witness.exitSeam.push({ ...pose, screenshot, ...boundary,
      artGate: 'HOLD_HUMAN_ART_REVIEW',
      narrative: 'Physical cave/terrain boundary framed from eye-height; camera-only, not nav or art approval' });
    console.log('PASS threshold-framed zone-6 art witness ' + pose.slug + ' ' +
      JSON.stringify(boundary));
  }

  // Zone 4 is a ravine, not a flat wall. Both screenshots must show
  // physically DEEP opposite rock from positions reachable on the safe ledge.
  // The near ledge's own cliff face is naturally hidden underneath its lip;
  // requiring that surface in camera ray hits is a false premise.
  // Gate the actual visible negative-Y rock, not screenshot existence.
  // Distinct authored viewing sectors, all on the real safe visitor ledge.
  // Reject obstructed perspectives rather than falsely certifying props-only
  // ray tests that miss opaque merged scenery (shown in old screenshots).
  for (const [slug, candidates] of [
    ['zone4-chasm-edge', [
      [3.1, -195.5, -1.2, -0.50],
      [3.1, -195.5, -Math.PI / 2, -0.54],
      [2.85, -194.7, -Math.PI / 2, -0.56],
      [2.9, -196.8, -Math.PI / 2, -0.52],
    ]],
    ['zone4-chasm-depth', [
      [3.45, -206, -Math.PI / 2, -0.62],
      [3.1, -205, -Math.PI / 2, -0.58],
      [2.9, -207, -Math.PI / 2, -0.60],
    ]],
  ]) {
    let accepted = null;
    const rejected = [];
    for (const [x, z, yaw, pitch] of candidates) {
      const beforeRavine = await desktop.evaluate(({ x, z, yaw, pitch }) => {
      const w = window.__horeb.world;
      const frame = w.renderer.info.render.frame;
      w.teleportTo(x, z);
      w.yaw = yaw; w.pitch = pitch;
      // World.position returns {x,z}; it has NO y property. Never silently
      // skip the coordinate guard by comparing undefined (NaN) to a number.
      const nearestExhibit = Math.min(...w.exhibitPos
        .filter((p) => p.e.zone === 4)
        .map((p) => Math.hypot(p.x - w.position.x, p.z - w.position.z)));
      return { frame, actualX: w.position.x, actualZ: w.position.z, nearestExhibit };
    }, { x, z, yaw, pitch });
      if (![beforeRavine.actualX, beforeRavine.actualZ].every(Number.isFinite) ||
          beforeRavine.actualX > 3.5 ||
          Math.abs(beforeRavine.actualX - x) > 0.2 ||
          Math.abs(beforeRavine.actualZ - z) > 0.2 ||
          beforeRavine.nearestExhibit < 3.5) {
        rejected.push({ x, z, yaw, pitch, reason: 'UNSAFE_CAMERA', ...beforeRavine });
        continue;
      }
      await waitForRenderedFrame(desktop, beforeRavine.frame, 4);
      const geometryVisibility = await desktop.evaluate(async () => {
      const THREE = await import('/node_modules/.vite/deps/three.js');
      const w = window.__horeb.world;
      const floor = w.scene.getObjectByName('cave-floor-continuous');
      const vault = w.scene.getObjectByName('cave-vault-continuous');
      if (!floor?.geometry || !vault?.geometry)
        throw new Error('Missing real chasm floor or opposing cave shell');
      const indices = floor.geometry.getIndex();
      const floorVertexCount = floor.userData.chasmStrata?.floorVertexCount;
      if (!indices || !Number.isInteger(floorVertexCount))
        throw new Error('Missing connected ravine strata indices');
      w.camera.updateMatrixWorld(true);
      const raycaster = new THREE.Raycaster();
      raycaster.far = 90;
      let nearFloor = 0, connectedNearFace = 0, opposingRock = 0;
      let deepOppositeRock = 0, misses = 0, lowestVisibleY = Infinity;
      for (let iy = 0; iy < 7; iy++) for (let ix = 0; ix < 9; ix++) {
        raycaster.setFromCamera(new THREE.Vector2(-0.84 + ix * 0.21, -0.84 + iy * 0.28), w.camera);
        const hit = raycaster.intersectObjects([floor, vault], false)[0];
        if (!hit) { misses++; continue; }
        lowestVisibleY = Math.min(lowestVisibleY, hit.point.y);
        if (hit.object === floor) {
          const face = hit.faceIndex * 3;
          const isConnectedFace = [indices.getX(face), indices.getX(face + 1), indices.getX(face + 2)]
            .some((id) => id >= floorVertexCount);
          if (isConnectedFace) connectedNearFace++; else nearFloor++;
        } else {
          opposingRock++;
          if (hit.point.y < -10 && hit.point.x > 10 &&
              hit.point.z > -225 && hit.point.z < -176)
            deepOppositeRock++;
        }
      }
      // Reuse exactly the World registry of opaque triangles used by F
      // visibility. Merged exhibit props lack root exhibitId: the former
      // "placards only" ray test passed a frame mostly blocked by brown rock.
      const opaqueProps = w.sightMeshes.filter((mesh) => {
        if (mesh === floor || mesh === vault) return false;
        for (let parent = mesh; parent; parent = parent.parent)
          if (!parent.visible) return false;
        return true;
      });
      raycaster.far = 90;
      let foregroundOpaqueProps = 0;
      const foregroundNames = {};
      for (const sx of [-0.25, 0, 0.25]) for (const sy of [-0.20, 0, 0.20]) {
        raycaster.setFromCamera(new THREE.Vector2(sx, sy), w.camera);
        const rock = raycaster.intersectObjects([floor, vault], false)[0];
        const block = raycaster.intersectObjects(opaqueProps, false).find((hit) =>
          hit.distance < 12 && hit.distance < (rock?.distance ?? 90) - 0.12);
        if (block) {
          foregroundOpaqueProps++;
          const name = block.object.name || block.object.parent?.name || 'unnamed-prop';
          foregroundNames[name] = (foregroundNames[name] || 0) + 1;
        }
      }
      return { samples: 63, nearFloor, connectedNearFace, opposingRock,
        deepOppositeRock, misses, lowestVisibleY,
        foregroundOpaqueProps, foregroundNames, checkedOpaqueMeshes: opaqueProps.length,
        actualCameraZ: w.camera.position.z, expectedCameraZ: w.position.z };
    });
      const geometryGate =
        geometryVisibility.nearFloor >= 5 &&
        geometryVisibility.deepOppositeRock >= 8 &&
        geometryVisibility.lowestVisibleY < -14 &&
        geometryVisibility.foregroundOpaqueProps === 0 &&
        geometryVisibility.checkedOpaqueMeshes > 42 &&
        Math.abs(geometryVisibility.actualCameraZ - geometryVisibility.expectedCameraZ) < 0.05
          ? 'PASS_UNOBSTRUCTED_RAVINE' : 'FAIL_RAVINE_SIGHTLINE';
      if (geometryGate !== 'PASS_UNOBSTRUCTED_RAVINE') {
        rejected.push({ x, z, yaw, pitch, reason: geometryGate, ...geometryVisibility });
        continue;
      }
      accepted = { x, z, yaw, pitch, geometryVisibility, geometryGate };
      break;
    }
    if (!accepted) {
      throw new Error('No safe, genuinely unobstructed ravine view ' +
        slug + ': ' + JSON.stringify(rejected));
    }
    await new Promise((resolve) => setTimeout(resolve, 330));
    const file = 'visual-detail-' + slug + '.png';
    await desktop.screenshot({ path: join(shots, file) });
    witness.details.push({ id: slug, zone: 4, screenshot: file,
      camera: { x: accepted.x, z: accepted.z, yaw: accepted.yaw, pitch: accepted.pitch },
      geometryVisibility: accepted.geometryVisibility, geometryGate: accepted.geometryGate,
      artGate: 'HOLD_HUMAN_ART_REVIEW',
      narrative: 'Full opaque-mesh raycast from real safe ledge; separate human art review' });
    console.log('PASS unobstructed ravine ' + slug + ' ' + file +
      ' ' + JSON.stringify(accepted.geometryVisibility));
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
  const ravineDetails = witness.details.filter((item) => item.zone === 4);
  witness.chasmGeometryGate = ravineDetails.length === 2 &&
    ravineDetails.every((item) => item.geometryGate === 'PASS_UNOBSTRUCTED_RAVINE')
    ? 'PASS_UNOBSTRUCTED_RAVINE' : 'FAIL_RAVINE_SIGHTLINE';
  // Not an automatic claim that the rock or all eight scenes are premium.
  witness.chasmArtGate = 'HOLD_HUMAN_ART_REVIEW';
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
  witness.exitSeam.length === 2 && witness.exitSeam.every((item) =>
    existsSync(join(shots, item.screenshot))) &&
  detailComplete && witness.chasmGeometryGate === 'PASS_UNOBSTRUCTED_RAVINE' &&
  witness.closeBush?.shoes === 'shod' && witness.innerBush?.shoes === 'unshod' &&
  witness.innerBush?.distance >= 6.5 && witness.errors.length === 0;
console.log('Visual witness: ' + witness.desktop.length + '/8 desktop, ' +
  witness.mobile.length + '/3 mobile-emulated, ' + witness.details.length +
  '/6 prop/detail screenshots; errors=' + witness.errors.length +
  '. Software/remote browser snapshots are NOT art-direction approval.');
if (!ok) {
  if (witness.chasmGeometryGate !== 'PASS_UNOBSTRUCTED_RAVINE')
    console.error('FAIL physically visible ravine depth: ' + witness.chasmGeometryGate);
  for (const error of witness.errors) console.error('FAIL ' + error);
}
process.exitCode = ok ? 0 : 1;
