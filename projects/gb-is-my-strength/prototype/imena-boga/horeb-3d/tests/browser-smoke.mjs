// Strict headless Chrome browser smoke; no silent PASS/SKIP and no disabled web security.
// HOREB_BASE_URL=http://127.0.0.1:5173 HOREB_BROWSER_PATH=/path/to/chrome npm run test:browser:smoke
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const paths = [process.env.HOREB_BROWSER_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/tmp/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
const browserPath = paths.find((p) => existsSync(p));
if (!browserPath) throw new Error('BROWSER BLOCKED: Chrome/Chromium not found; set HOREB_BROWSER_PATH');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const shots = join(process.cwd(), '.test-build', 'screenshots');
mkdirSync(shots, { recursive: true });
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args, protocolTimeout: 90000 });
const failures = [];
let passes = 0;
const check = (name, ok, detail = '') => {
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' — ' + detail : ''));
  if (ok) passes++; else failures.push(name + (detail ? ': ' + detail : ''));
};
const errors = [];
// The actual Chromium accessibility tree, not the DOM text alone: a visible
// button/link with an empty computed accessible name is a keyboard/AT blocker.
// CDP audits are not substitutes for real NVDA/VoiceOver, and are named as such.
async function anonymousAccessibleActions(page) {
  const cdp = await page.createCDPSession();
  try {
    await cdp.send('Accessibility.enable');
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const namesRequired = new Set(['button', 'link', 'radio', 'checkbox', 'slider', 'textbox']);
    return nodes.filter((node) => !node.ignored && namesRequired.has(node.role?.value) &&
      !(node.name?.value || '').trim())
      .map((node) => ({ role: node.role?.value, node: node.backendDOMNodeId })).slice(0, 10);
  } finally { await cdp.detach(); }
}
// Wait for *painted* intro, not merely a DOM node whose reveal animation is
// still at opacity:0. Fail rather than saving a misleading black screenshot.
async function waitForIntroPaint(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('.intro');
    const heading = root?.querySelector('h1');
    const landscape = root?.querySelector('.sinai');
    const start = [...(root?.querySelectorAll('button') || [])].find(
      (b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()));
    if (!root || !heading || !landscape || !start) return false;
    const painted = (element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return false;
      for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
        const css = getComputedStyle(node);
        if (css.display === 'none' || css.visibility !== 'visible' ||
            Number(css.opacity) < 0.99) return false;
      }
      return true;
    };
    return painted(heading) && painted(start) && painted(landscape);
  }, { polling: 100, timeout: 15000 });
}
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(75000);
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push('HTTP ' + response.status() + ' ' + response.url());
  });
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const location = m.location();
      errors.push(m.text() + (location.url ? ' @ ' + location.url : ''));
    }
  });
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  check('intro HTTP 200', response?.status() === 200, String(response?.status()));
  check('intro title visible', await page.$eval('h1', (h) => h.textContent.includes('ИМЕНА БОГА')).catch(() => false));
  await waitForIntroPaint(page);
  check('intro visibly painted after reveal', true);
  const introUnnamedActions = await anonymousAccessibleActions(page);
  check('intro Chromium AX tree has no unnamed interactive controls',
    introUnnamedActions.length === 0, JSON.stringify(introUnnamedActions));
  await page.screenshot({ path: join(shots, 'smoke-01-intro.png') });

  await page.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => b.textContent.includes('Настройки доступности'))?.click());
  check('settings modal opened', (await page.$$('[role="dialog"]')).length === 1);
  const modalUnnamedActions = await anonymousAccessibleActions(page);
  check('settings Chromium AX tree has no unnamed interactive controls',
    modalUnnamedActions.length === 0, JSON.stringify(modalUnnamedActions));
  check('initial focus remains in modal', await page.evaluate(() =>
    !!document.querySelector('[role="dialog"]')?.contains(document.activeElement)));
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  check('Shift+Tab remains in modal', await page.evaluate(() =>
    !!document.querySelector('[role="dialog"]')?.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Escape closes modal', (await page.$$('[role="dialog"]')).length === 0);

  // Non-WebGL reader is a first-class, fully accessible route. Validate the
  // actual browser AX tree, independent of React heading/href text assertions.
  const axReaderPage = await browser.newPage();
  try {
    await axReaderPage.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await axReaderPage.evaluate(() => [...document.querySelectorAll('button')]
      .find((button) => (button.textContent || '').trim() === 'Режим чтения')?.click());
    await axReaderPage.waitForSelector('main#reader h1', { timeout: 20000 });
    const readerUnnamedActions = await anonymousAccessibleActions(axReaderPage);
    check('42-dossier reader Chromium AX tree has no unnamed interactive controls',
      readerUnnamedActions.length === 0, JSON.stringify(readerUnnamedActions));
    // Real study encounter in the accessible non-WebGL reader. A wrong
    // response must not count, and no lesson may count before inspection.
    const lessonSelector = 'section[aria-label^="Путь понимания:"]';
    check('eight optional source-grounded learning chapters exist alongside all 42 dossiers',
      (await axReaderPage.$$(lessonSelector)).length === 8 &&
      (await axReaderPage.$$('article.exhibit-card')).length === 42);
    const first = lessonSelector + ':first-of-type';
    const lesson = (await axReaderPage.$$(lessonSelector))[0];
    const locked = await lesson.evaluate((node) =>
      !!node.querySelector('fieldset')?.disabled &&
      !(node.querySelector('input[type="radio"]')?.checked));
    check('learning answer remains locked until observation and comparison', locked);
    await lesson.evaluate((node) => [...node.querySelectorAll('button')]
      .find((b) => b.textContent.includes('Изучить описание сцены'))?.click());
    await axReaderPage.waitForFunction(() =>
      JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}').observed?.includes('elohim'));
    const afterObserve = await lesson.evaluate((node) => !!node.querySelector('fieldset')?.disabled);
    check('observing alone cannot bypass required comparison step', afterObserve);
    await lesson.evaluate((node) => [...node.querySelectorAll('button')]
      .find((b) => b.textContent.includes('Сопоставить с Писанием'))?.click());
    await axReaderPage.waitForFunction(() => {
      const node = document.querySelector('section[aria-label^="Путь понимания:"]');
      return !!node && !node.querySelector('fieldset')?.disabled;
    });
    await lesson.$('input[value="a"]').then((e) => e.click());
    await lesson.evaluate((node) => [...node.querySelectorAll('button')]
      .find((b) => b.textContent.includes('Проверить понимание'))?.click());
    const wrongProgress = await axReaderPage.evaluate(() => {
      const data = JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}');
      return data.understood || [];
    });
    check('wrong interpretation never awards learning progress', wrongProgress.length === 0);
    await lesson.$('input[value="b"]').then((e) => e.click());
    await lesson.evaluate((node) => [...node.querySelectorAll('button')]
      .find((b) => b.textContent.includes('Проверить понимание'))?.click());
    await axReaderPage.waitForFunction(() =>
      JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}').understood?.includes('elohim'));
    await axReaderPage.reload({ waitUntil: 'domcontentloaded' });
    check('learned meaning persists but does not unlock or modify navigation',
      await axReaderPage.evaluate(() => {
        const data = JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}');
        const p = JSON.parse(localStorage.getItem('imena-horeb.progress.v1') || '{}');
        return data.observed?.includes('elohim') && data.understood?.includes('elohim') &&
          !p.last;
      }));
  } finally { await axReaderPage.close(); }

  const start = await page.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.textContent);
  check('WebGL start button available', !!start);
  if (start) {
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.click());
    await page.waitForFunction(() => !!(window.__horeb?.world && window.__horeb?.state()), { timeout: 75000 });
    const before = await page.evaluate(() => ({
      z: window.__horeb.state().z, count: window.__horeb.world.exhibitPos.length,
    }));
    check('42 actual 3D exhibit placements', before.count === 42, String(before.count));
    const labelsByQuality = await page.evaluate(() => {
      let high = 0, low = 0;
      window.__horeb.world.scene.traverse((obj) => {
        if (!obj.isMesh) return;
        const image = obj.material?.map?.image;
        if (image?.width === 640 && image?.height === 900) high++;
        if (image?.width === 384 && image?.height === 540) low++;
      });
      return { high, low, quality: window.__horeb.world.settings.quality };
    });
    const labelsMatch = labelsByQuality.quality === 'high'
      ? labelsByQuality.high === 42 && labelsByQuality.low === 0
      : labelsByQuality.quality === 'low' && labelsByQuality.low === 42 && labelsByQuality.high === 0;
    check('all 42 labels match selected high/low render quality', labelsMatch, JSON.stringify(labelsByQuality));
    // Regression for solid rectangular SpriteMaterial glow panels in all 42 scenes.
    const glowMask = await page.evaluate(() => {
      const uses = new Map();
      window.__horeb.world.scene.traverse((obj) => {
        const tex = obj.isSprite && obj.material?.map;
        if (tex?.image?.width === 128 && tex?.image?.height === 128) uses.set(tex, (uses.get(tex) || 0) + 1);
      });
      const [texture, count] = [...uses.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      const ctx = texture?.image?.getContext?.('2d');
      return { count: count ?? 0, centerAlpha: ctx?.getImageData(64, 64, 1, 1).data[3] ?? -1,
        cornerAlpha: ctx?.getImageData(0, 0, 1, 1).data[3] ?? -1 };
    });
    check('42 scenic glows share a radial alpha mask, not solid square sprites',
      glowMask.count === 42 && glowMask.centerAlpha > 200 && glowMask.cornerAlpha === 0,
      JSON.stringify(glowMask));
    const beacons = await page.evaluate(() => {
      const objects = [];
      window.__horeb.world.scene.traverse((obj) => {
        if (obj.name !== 'original-script-beacon') return;
        const canvas = obj.material?.map?.image;
        const ctx = canvas?.getContext?.('2d');
        objects.push({
          id: obj.userData.exhibitId,
          w: canvas?.width,
          h: canvas?.height,
          opacity: obj.material?.opacity,
          depthTest: obj.material?.depthTest,
          cornerAlpha: ctx?.getImageData(0, 0, 1, 1).data[3] ?? -1,
          centerAlpha: ctx?.getImageData(Math.floor(canvas.width/2), Math.floor(canvas.height/2), 1, 1).data[3] ?? -1,
        });
      });
      return objects;
    });
    const pilotIds = ['elohim','el-elyon','el-shaddai','el-olam','el-roi','yireh','ehyeh','yhwh'];
    const expectedWidth = labelsByQuality.quality === 'high' ? 1024 : 640;
    check('8 original-script pilot beacons retain canonical IDs and canvas resolution',
      beacons.length === 8 && pilotIds.every((id) => beacons.some((b) =>
        b.id === id && b.w === expectedWidth && b.depthTest === true)),
      JSON.stringify(beacons));
    check('8 script glows dissolve into stone instead of opaque rectangular signs',
      beacons.length === 8 && beacons.every((b) => b.cornerAlpha === 0 && b.centerAlpha > 120),
      JSON.stringify(beacons.map(({id,cornerAlpha,centerAlpha})=>({id,cornerAlpha,centerAlpha}))));

    const creationCollider = await page.evaluate(() => {
      const world = window.__horeb.world;
      const e = world.exhibitPos.find((p) => p.e.id === 'elohim');
      if (!e) return false;
      const len = Math.hypot(e.nx, e.nz) || 1;
      const bx = e.x + e.nx / len * 1.2, bz = e.z + e.nz / len * 1.2;
      return world.obstacles.some((o) => o.r >= 1.7 &&
        Math.hypot(o.x - (bx - 1.4), o.z - (bz - 3.0)) < 0.01);
    });
    check('relocated creation boulder retains matching physical collision', creationCollider);

    await page.screenshot({ path: join(shots, 'smoke-02-world.png') });

    // Never time a held movement key against a fixed wall-clock sleep.
    // SwiftShader can render fewer than two RAF frames per second on a busy
    // runner; an otherwise healthy controller then looks frozen.
    await page.keyboard.down('KeyW');
    let observedMovement = false;
    try {
      await page.waitForFunction((initialZ) => {
        const s = window.__horeb?.state?.();
        return !!s && s.z < initialZ - 0.025;
      }, { timeout: 15000, polling: 100 }, before.z);
      observedMovement = true;
    } catch { /* collect diagnostics and fail below */ }
    const movementDiag = await page.evaluate(() => {
      const w = window.__horeb.world;
      return { z: window.__horeb?.state()?.z,
        simTime: w.t, keys: [...w.keys], inputLocked: w.inputLocked,
        documentHidden: document.hidden, contextLost: w.contextLost,
        animationFps: w.fps };
    });
    await page.keyboard.up('KeyW');
    check('W actually moves player forward in an active simulation frame',
      observedMovement && movementDiag.z < before.z - 0.025,
      JSON.stringify({ initialZ: before.z, ...movementDiag }));
    // An async WebGL import can complete after the 'Start' click's transient
    // activation has expired. A real W key event must recover Web Audio.
    const resumedAudio = await page.waitForFunction(() =>
      window.__horeb.world.audio.ctx?.state === 'running',
      { timeout: 6500, polling: 100 }).then(() => true, () => false);
    check('trusted movement key unlocks browser Web Audio after async world load',
      resumedAudio, String(await page.evaluate(() =>
        window.__horeb.world.audio.ctx?.state ?? 'unavailable')));


    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => b.textContent.trim() === 'Настройки')?.click());
    await new Promise((r) => setTimeout(r, 250));
    const freeze = await page.evaluate(() => ({
      t: window.__horeb.world.t, locked: window.__horeb.world.inputLocked,
    }));
    await new Promise((r) => setTimeout(r, 400));
    const frozenAt = await page.evaluate(() => window.__horeb.world.t);
    check('modal pauses GPU animation', freeze.locked && frozenAt === freeze.t);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 450));
    const resumed = await page.evaluate(() => ({
      t: window.__horeb.world.t, locked: window.__horeb.world.inputLocked,
    }));
    check('closing modal resumes animation', !resumed.locked && resumed.t > frozenAt);
    // Real loss of browser focus must neutralize *all* locomotion sources:
    // not just W held down, but a stuck touch joystick and residual velocity.
    await page.keyboard.down('KeyW');
    const unfocused = await page.evaluate(() => {
      const w = window.__horeb.world;
      w.setMoveInput(0.7, 0.5);
      w.vel.set(2, 3);
      window.dispatchEvent(new Event('blur'));
      return { keys: w.keys.size, x: w.move.x, y: w.move.y,
        speed: w.vel.length(), dragging: w.dragging };
    });
    await page.keyboard.up('KeyW');
    check('window blur clears held keys, touch vector and inertia',
      unfocused.keys === 0 && unfocused.x === 0 && unfocused.y === 0 &&
      unfocused.speed === 0 && unfocused.dragging === null,
      JSON.stringify(unfocused));
    // Zone 1 at its default spawn: the first inscription sits off the left
    // camera edge. It must *not* be rendered as half of a large cut-off word.
    await page.evaluate(() => {
      const w = window.__horeb.world;
      w.teleportZone(1);
      w.yaw = 0;
    });
    const beaconAlpha = () => page.evaluate(() => {
      let value = -1;
      window.__horeb.world.scene.traverse((o) => {
        if (o.name === 'original-script-beacon' && o.userData.exhibitId === 'elohim')
          value = o.visible ? o.material.opacity : 0;
      });
      return value;
    });
    await page.waitForFunction(() => window.__horeb?.world?.position?.z <= -8, { timeout: 5000 });
    await page.waitForFunction(() => {
      const w = window.__horeb.world;
      let opacity = -1;
      w.scene.traverse((o) => {
        if (o.name === 'original-script-beacon' && o.userData.exhibitId === 'elohim')
          opacity = o.visible ? o.material.opacity : 0;
      });
      return opacity === 0;
    }, { timeout: 7000, polling: 100 });
    check('side Hebrew name fades before it clips at zone-1 spawn', (await beaconAlpha()) === 0);
    await page.screenshot({ path: join(shots, 'smoke-02b-zone1-forward.png') });
    await page.evaluate(() => {
      const w = window.__horeb.world;
      const e = w.exhibitPos.find((p) => p.e.id === 'elohim');
      w.yaw = Math.atan2(-(e.x - w.position.x), -(e.z - w.position.z));
    });
    await page.waitForFunction(() => {
      const w = window.__horeb.world;
      let opacity = -1;
      w.scene.traverse((o) => {
        if (o.name === 'original-script-beacon' && o.userData.exhibitId === 'elohim')
          opacity = o.visible ? o.material.opacity : 0;
      });
      return opacity > 0.5;
    }, { timeout: 7000, polling: 100 });
    check('turning towards Elōhîm reveals a complete glowing inscription', (await beaconAlpha()) > 0.5);
    await page.screenshot({ path: join(shots, 'smoke-02c-zone1-faced.png') });
    // WebGL loss must not be recovered by a fragile 50ms screen toggle.
    // Simulate the actual canvas event and verify a new renderer on a NEW
    // canvas, with a live frame and safe shod travel checkpoint.
    await page.evaluate(() => {
      const w = window.__horeb.world;
      window.__lostWorld = w;
      window.__lostCanvas = w.renderer.domElement;
      w.renderer.domElement.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    });
    await page.waitForFunction(() => window.__horeb?.state()?.contextLost === true,
      { timeout: 7000 });
    const restartClicked = await page.evaluate(() => {
      const button = [...document.querySelectorAll('button')]
        .find((b) => b.textContent?.trim() === 'Перезапустить сцену');
      button?.click(); return !!button;
    });
    check('WebGL context loss exposes a deliberate restart action', restartClicked);
    await page.waitForFunction(() => {
      const w = window.__horeb?.world;
      const state = window.__horeb?.state?.();
      return !!w && !!state && w !== window.__lostWorld &&
        w.renderer.domElement !== window.__lostCanvas &&
        !state.contextLost && w.renderer.info.render.calls > 0;
    }, { timeout: 90000, polling: 100 });
    const restoredWorld = await page.evaluate(() => {
      const w = window.__horeb.world;
      return { freshCanvas: w.renderer.domElement !== window.__lostCanvas,
        freshWorld: w !== window.__lostWorld,
        shoes: w.shoes, z: w.position.z, contextLost: window.__horeb.state().contextLost };
    });
    check('WebGL restart replaces canvas and renderer without a timer or bypassing shoes',
      restoredWorld.freshCanvas && restoredWorld.freshWorld &&
      !restoredWorld.contextLost && restoredWorld.shoes === 'shod',
      JSON.stringify(restoredWorld));
    await page.screenshot({ path: join(shots, 'smoke-02d-webgl-restarted.png') });
    await page.evaluate(() => { delete window.__lostWorld; delete window.__lostCanvas; });
    // The solemn barefoot action is now a World-clock animation, not an
    // independent RAF. Pausing 3D must pause the ceremony; reopening cannot
    // unexpectedly mark shoes removed or release a stuck joystick movement.
    const barefootStart = await page.evaluate(() => {
      const w = window.__horeb.world;
      w.teleportTo(0, -351);
      w.setMoveInput(0.7, 0.5);
      const accepted = w.removeShoes();
      // Direct movement during the ritual must be ignored as well.
      w.setMoveInput(0.8, 0.1);
      w.setInputLocked(true);
      return { accepted, shoes: w.shoes, elapsed: w.shoeRemovalElapsed,
        x: w.move.x, y: w.move.y, velocity: w.vel.length(), pos: w.position };
    });
    check('shoes may only be removed at the outside boundary with no residual input',
      barefootStart.accepted && barefootStart.shoes === 'removing' &&
      barefootStart.x === 0 && barefootStart.y === 0 && barefootStart.velocity === 0,
      JSON.stringify(barefootStart));
    await new Promise((r) => setTimeout(r, 950));
    const duringPause = await page.evaluate(() => {
      const w = window.__horeb.world;
      return { shoes: w.shoes, elapsed: w.shoeRemovalElapsed,
        pos: w.position, locked: w.inputLocked };
    });
    check('pausing world also pauses removal of shoes, even after wall time',
      duringPause.locked && duringPause.shoes === 'removing' &&
      Math.abs(duringPause.elapsed - barefootStart.elapsed) < 0.0001,
      JSON.stringify(duringPause));
    await page.evaluate(() => window.__horeb.world.setInputLocked(false));
    await page.waitForFunction(() => window.__horeb?.world?.shoes === 'unshod',
      { timeout: 22000, polling: 100 });
    const barefootDone = await page.evaluate(() => {
      const w = window.__horeb.world;
      return { shoes: w.shoes, elapsed: w.shoeRemovalElapsed,
        distance: Math.hypot(w.position.x, w.position.z + 366),
        sandals: w.sandals?.children.length ?? 0,
        moveX: w.move.x, moveY: w.move.y,
        velocity: w.vel.length() };
    });
    check('removing shoes resumes exactly once on live simulation frames',
      barefootDone.shoes === 'unshod' && barefootDone.elapsed >= 2.6 &&
      barefootDone.sandals === 2 && barefootDone.distance >= 6.5 &&
      barefootDone.moveX === 0 && barefootDone.moveY === 0 &&
      barefootDone.velocity === 0,
      JSON.stringify(barefootDone));
    await page.screenshot({ path: join(shots, 'smoke-02e-shoes-resumed.png') });



  }

  const reader = await page.goto(base + '/reader.html', { waitUntil: 'domcontentloaded', timeout: 45000 });
  const count = await page.$$eval('article[id]', (a) => a.length);
  check('no-JS reader exposes 42 dossiers', reader?.status() === 200 && count === 42,
    'HTTP ' + reader?.status() + ', cards ' + count);
  check('reader has Hebrew RTL', await page.$eval('[lang="he"][dir="rtl"]', () => true).catch(() => false));
  const bilingual = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('article details.voice-stage')];
    return {
      total: rows.length,
      holds: rows.filter((el) => el.getAttribute('data-audio-state') === 'HOLD').length,
      drafts: rows.filter((el) => el.textContent?.includes('неутверждённый черновик:')).length,
      el: document.querySelector('article#el details.voice-stage')?.textContent || '',
      yhwh: document.querySelector('article#yhwh details.voice-stage')?.textContent || '',
    };
  });
  check('no-JS reader shows 42 Russian scripts sourced from original 42-scene matrix',
    bilingual.total === 42 && bilingual.holds === 42 && bilingual.drafts === 42 &&
    bilingual.el.includes('Его значение определяется контекстом'),
    JSON.stringify({ total: bilingual.total, holds: bilingual.holds, drafts: bilingual.drafts }));
  check('written-only Tetragrammaton remains silent before Russian narrator',
    bilingual.yhwh.includes('без произнесения спорного Имени') &&
    !bilingual.yhwh.includes('Сначала произношение на'));
  await page.screenshot({ path: join(shots, 'smoke-03-reader.png') });
  await page.close(); // release the desktop WebGL context before mobile QA

  const disabled = await browser.newPage();
  await disabled.evaluateOnNewDocument(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...rest) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(type)) return null;
      return get.call(this, type, ...rest);
    };
  });
  await disabled.goto(base + '/', {waitUntil:'domcontentloaded',timeout:45000});
  check('no-WebGL fallback retains reader', await disabled.evaluate(() =>
    ![...document.querySelectorAll('button')].some((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim())) &&
    [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Режим чтения'))));
  await disabled.close();

  const mobile = await browser.newPage();
  await mobile.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await mobile.goto(base + '/?e2e', {waitUntil:'domcontentloaded',timeout:45000});
  const dims = await mobile.evaluate(() => ({document:document.documentElement.scrollWidth, viewport:innerWidth}));
  check('390px intro no horizontal overflow', dims.document <= dims.viewport + 1,
    dims.document + '/' + dims.viewport);
  await waitForIntroPaint(mobile);
  check('390px intro visibly painted after reveal', true);
  await mobile.screenshot({path:join(shots,'smoke-04-mobile.png')});
  await mobile.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.click());
  await mobile.waitForFunction(() => !!window.__horeb?.world, {timeout:75000});
  // World.create resolves before its first RAF emits the WorldState. React
  // only mounts <Joystick> after that state arrives: wait for the actual
  // visible control, not merely the engine instance.
  await mobile.waitForSelector('[data-testid="movement-joystick"]',
    { visible: true, timeout: 30000 });
  const touchControls = await mobile.evaluate(() => ({
    hasJoystick: !!document.querySelector('[data-testid="movement-joystick"]'),
    maxTouchPoints: navigator.maxTouchPoints,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    width: innerWidth,
  }));
  check('narrow touch-capable mobile viewport shows on-screen joystick',
    touchControls.hasJoystick, JSON.stringify(touchControls));
  // Real browser pointer event sequences (mobile viewport): second finger
  // must not take over or cancel the first finger's movement vector.
  const multiTouch = await mobile.evaluate(() => {
    const w = window.__horeb.world;
    const stick = document.querySelector('[data-testid="movement-joystick"]');
    if (!stick) return { error: 'missing joystick' };
    const r = stick.getBoundingClientRect();
    const pointer = (target, type, id, dx = 0, dy = 0) => target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true, cancelable: true, pointerType: 'touch', pointerId: id,
        isPrimary: id === 11 || id === 21,
        clientX: r.left + r.width / 2 + dx,
        clientY: r.top + r.height / 2 + dy,
      }),
    );
    pointer(stick, 'pointerdown', 11, 38);
    const firstX = w.move.x;
    pointer(stick, 'pointerdown', 12, -38);
    const afterSecondDownX = w.move.x;
    pointer(stick, 'pointerup', 12, -38);
    const afterSecondUpX = w.move.x;
    pointer(stick, 'pointermove', 11, 28);
    const afterOwnerMoveX = w.move.x;
    pointer(stick, 'pointerup', 11, 28);
    const releasedX = w.move.x;
    // Also verify the viewing half (main canvas) retains its owning finger.
    const canvas = document.querySelector('canvas');
    const cr = canvas.getBoundingClientRect();
    const viewPointer = (target, type, id, x) => target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true, cancelable: true, pointerType: 'touch', pointerId: id,
        isPrimary: id === 21, clientX: cr.left + x,
        clientY: cr.top + cr.height / 3,
      }),
    );
    viewPointer(canvas, 'pointerdown', 21, 280);
    const cameraOwner = w.dragging?.id;
    viewPointer(canvas, 'pointerdown', 22, 200);
    const cameraOwnerAfterSecond = w.dragging?.id;
    const yawBefore = w.yaw;
    viewPointer(window, 'pointermove', 21, 295);
    const yawAfter = w.yaw;
    viewPointer(window, 'pointerup', 22, 200);
    const cameraOwnerAfterSecondUp = w.dragging?.id;
    viewPointer(window, 'pointerup', 21, 295);
    return { firstX, afterSecondDownX, afterSecondUpX, afterOwnerMoveX,
      releasedX, cameraOwner, cameraOwnerAfterSecond, cameraOwnerAfterSecondUp,
      cameraReleased: w.dragging === null, yawBefore, yawAfter };
  });
  check('mobile joystick second finger cannot hijack or cancel movement',
    multiTouch.firstX > 0.5 &&
    Math.abs(multiTouch.afterSecondDownX - multiTouch.firstX) < 0.01 &&
    Math.abs(multiTouch.afterSecondUpX - multiTouch.firstX) < 0.01 &&
    multiTouch.afterOwnerMoveX > 0.3 && multiTouch.releasedX === 0,
    JSON.stringify(multiTouch));
  check('mobile camera second touch cannot hijack or cancel first camera drag',
    multiTouch.cameraOwner === 21 &&
    multiTouch.cameraOwnerAfterSecond === 21 &&
    multiTouch.cameraOwnerAfterSecondUp === 21 &&
    multiTouch.cameraReleased && Math.abs(multiTouch.yawAfter - multiTouch.yawBefore) > 0.005,
    JSON.stringify(multiTouch));
  const labels = await mobile.evaluate(() => {
    let small = 0, large = 0;
    window.__horeb.world.scene.traverse((o) => {
      if (!o.isMesh || !o.material?.map?.image) return;
      const {width,height}=o.material.map.image;
      if (width===384 && height===540) small++;
      if (width===640 && height===900) large++;
    });
    return {small,large,quality:window.__horeb.world.settings.quality};
  });
  check('mobile low-quality renders 42 compact labels (384x540)', labels.small === 42 && labels.large === 0 && labels.quality === 'low', JSON.stringify(labels));
  await mobile.screenshot({path:join(shots,'smoke-05-mobile-world.png')});
  await mobile.close();

  // Real 3D investigation uses the same well/tree/spring mesh locations;
  // only camera setup is programmatic. Actual collection uses trusted F
  // keyboard events, which revalidate distance and orientation in World.
  const investigator = await browser.newPage();
  await investigator.setViewport({ width: 1280, height: 800 });
  investigator.on('pageerror', (e) => errors.push(String(e)));
  await investigator.goto(base + '/?e2e', { waitUntil:'domcontentloaded', timeout:45000 });
  await waitForIntroPaint(investigator);
  const investigatorStarted = await investigator.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()));
    btn?.click(); return !!btn;
  });
  check('3D investigation can start with a new or existing local route', investigatorStarted);
  await investigator.waitForFunction(() => !!window.__horeb?.world && !!window.__horeb?.state(),
    { timeout: 45000 });
  check('out-of-range story clue is not focusable',
    await investigator.evaluate(() => window.__horeb.world.focusStoryClue() === null));
  const baselineUnderstanding = await investigator.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}').understood?.length || 0; }
    catch { return -1; }
  });
  const collected = [];
  for (const clueId of ['beersheba-well','beersheba-tamarisk','hagar-spring']) {
    const setup = await investigator.evaluate((id) => {
      const world = window.__horeb.world;
      const target = world.storyTargets.find((item) => item.id === id);
      if (!target) return { error: 'missing physical mesh target' };
      // Move to the visitor-side of existing solid props, not inside them.
      const x = target.x + (target.x > 0 ? -4.5 : 4.5);
      world.teleportTo(x, target.z);
      const pos = world.position;
      world.yaw = Math.atan2(-(target.x - pos.x), -(target.z - pos.z));
      return { id, target, pos, focus: world.focusStoryClue() };
    }, clueId);
    check('camera can investigate actual prop ' + clueId,
      setup.focus === clueId, JSON.stringify(setup));
    if (clueId === 'beersheba-well') {
      await investigator.evaluate(() => document.querySelector('nav button')?.focus());
      await investigator.keyboard.press('KeyF');
      check('F does not steal keyboard navigation from HUD buttons',
        await investigator.evaluate(() =>
          !JSON.parse(localStorage.getItem('imena-horeb.site-observations.v1') || '[]')
            .includes('beersheba-well')));
      await investigator.evaluate(() => (document.activeElement)?.blur());
    }
    await investigator.keyboard.press('KeyF');
    await investigator.waitForFunction((id) => {
      try { return JSON.parse(localStorage.getItem('imena-horeb.site-observations.v1') || '[]').includes(id); }
      catch { return false; }
    }, { timeout: 7500 }, clueId);
    collected.push(clueId);
  }
  check('three 3D details discovered by trusted F action, without rewarding doctrinal progress',
    await investigator.evaluate((before) => {
      const ids=JSON.parse(localStorage.getItem('imena-horeb.site-observations.v1') || '[]');
      const study=JSON.parse(localStorage.getItem('imena-horeb.learning.v1') || '{}');
      return ids.length===3 && (study.understood || []).length === before;
    }, baselineUnderstanding));
  // The same F key must be inert at an unobserved distant location.
  await investigator.evaluate(() => window.__horeb.world.teleportZone(0));
  await investigator.keyboard.press('KeyF');
  check('F cannot collect a clue from outside physical observation range',
    await investigator.evaluate(() =>
      JSON.parse(localStorage.getItem('imena-horeb.site-observations.v1') || '[]').length === 3));
  await investigator.reload({ waitUntil: 'domcontentloaded' });
  check('three discovered details survive a full reload in local-only storage',
    await investigator.evaluate(() =>
      JSON.parse(localStorage.getItem('imena-horeb.site-observations.v1') || '[]').length === 3));
  await investigator.close();

  check('no page runtime errors', errors.length === 0, errors.slice(0, 2).join(' | '));
} catch (error) {
  failures.push('Uncaught browser-test exception: ' + (error?.stack || String(error)));
} finally {
  await browser.close();
}
console.log('HOREB browser smoke: ' + passes + ' passed, ' + failures.length + ' failed. Chrome=' + browserPath);
for (const failure of failures) console.error('FAIL ' + failure);
if (failures.length) process.exitCode = 1;
