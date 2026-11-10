// Real browser check that all 42 3D markers can be approached, activated and read.
// Explicit test, never an invisible SKIP. HOREB_BROWSER_PATH and HOREB_BASE_URL as in browser-smoke.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const candidates = [process.env.HOREB_BROWSER_PATH, '/usr/bin/google-chrome', '/tmp/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].filter(Boolean);
const browserPath = candidates.find((f) => existsSync(f));
if (!browserPath) throw new Error('Browser unavailable — set HOREB_BROWSER_PATH; cannot claim PASS');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({executablePath:browserPath,headless:true,args,protocolTimeout:90000});
const failures = [];
const screenshots = join(process.cwd(), '.test-build', 'screenshots');
mkdirSync(screenshots, { recursive: true });
let passed = 0;
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', (e) => failures.push('pageerror: ' + e.message));
  const response = await page.goto(base + '/?e2e', {waitUntil:'domcontentloaded',timeout:45000});
  if (response?.status() !== 200) throw new Error('HTTP ' + response?.status());
  const button = await page.$('button');
  if (!button) throw new Error('Intro has no buttons');
  await page.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.click());
  await page.waitForFunction(() => window.__horeb?.world && window.__horeb?.state(), {timeout:90000});
  const exhibits = await page.evaluate(() => window.__horeb.world.exhibitPos.map((p) => ({
    id:p.e.id,label:p.e.displayLabelRu,x:p.x,z:p.z,nx:p.nx,nz:p.nz,
  })));
  if (exhibits.length !== 42 || new Set(exhibits.map((e) => e.id)).size !== 42)
    throw new Error('World markers are not 42 unique Research IDs: '+exhibits.length);
  for (const e of exhibits) {
    try {
      const placed = await page.evaluate((p) => {
        const w = window.__horeb.world;
        const length = Math.hypot(p.nx,p.nz) || 1;
        const x = p.x + p.nx / length * 2.0;
        const z = p.z + p.nz / length * 2.0;
        w.teleportTo(x,z); // observe the same wall/Horeb guardrails as a real user
        w.yaw = Math.atan2(p.nx,p.nz); w.pitch = 0;
        return {x:w.pos.x,z:w.pos.y};
      },e);
      await page.waitForFunction((id) => window.__horeb?.state()?.prompt?.id === id,
        {timeout:6000,polling:100},e.id);
      await page.keyboard.press('KeyE');
      await page.waitForSelector('[role="dialog"]',{timeout:6000});
      const content = await page.$eval('[role="dialog"]',(n)=>n.textContent||'');
      if (!content.includes(e.label)) throw new Error('Wrong dossier opened for ' + e.id);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'),{timeout:6000});
      passed++;
      console.log('PASS '+e.id);
    } catch(error) {
      const current = await page.evaluate(() => window.__horeb?.state()).catch(()=>null);
      const message='FAIL '+e.id+': '+(error?.message||error)+' state='+JSON.stringify(current?.prompt);
      failures.push(message);console.error(message);
      await page.keyboard.press('Escape').catch(()=>{});
    }
  }
  // A hero moment is not just E→static card. First inspect the actual 3D
  // object, then return to compare the historical context.
  try {
    const hero = exhibits.find((e) => e.id === 'elohim');
    if (!hero) throw new Error('elohim hero missing');
    await page.evaluate((e) => {
      const w = window.__horeb.world;
      const length = Math.hypot(e.nx, e.nz) || 1;
      w.teleportTo(e.x + e.nx / length * 2, e.z + e.nz / length * 2);
      w.yaw = Math.atan2(e.nx, e.nz);
    }, hero);
    await page.waitForFunction(() => window.__horeb?.state()?.prompt?.id === 'elohim',
      { timeout: 6000, polling: 100 });
    await page.keyboard.press('KeyE');
    await page.waitForSelector('[role="dialog"]');
    const beforeScale = await page.evaluate(() => {
      let scale = null;
      window.__horeb.world.scene.traverse((object) => {
        if (object.name === 'original-script-beacon' &&
            object.userData.exhibitId === 'elohim') scale = object.scale.x;
      });
      return scale;
    });
    if (!Number.isFinite(beforeScale) || beforeScale <= 0)
      throw new Error('Elōhîm beacon baseline unavailable before inspection');
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent.includes('Осмотреть место в 3D'));
      btn?.click();
      return !!btn;
    });
    if (!clicked) throw new Error('Missing hero inspection control');
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), {timeout:6000});
    // Verify the real +8% inspection response relative to this camera's
    // uninspected scale. Do not hardcode an art-director's old glyph size.
    await page.waitForFunction((normalScale) => {
      const w = window.__horeb?.world;
      if (w?.activeInspection?.id !== 'elohim') return false;
      let inspected = false;
      w.scene.traverse((o) => {
        if (o.name === 'original-script-beacon' &&
            o.userData.exhibitId === 'elohim' &&
            o.scale.x > normalScale * 1.065 &&
            o.scale.x < normalScale * 1.105) inspected = true;
      });
      return inspected;
    }, { timeout: 7000, polling: 100 }, beforeScale);
    // React lock/unlock and World.emit update at different frame cadences;
    // wait for a fresh E target, not only the restored 3D render.
    await page.waitForFunction(() => window.__horeb?.state()?.prompt?.id === 'elohim',
      { timeout: 6000, polling: 100 });
    await page.keyboard.press('KeyE');
    await page.waitForSelector('[role="dialog"]');
    const revisited = await page.$eval('[role="dialog"]',(n) => n.textContent.includes('Место осмотрено'));
    const compare = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent.includes('Сопоставить с Писанием'));
      btn?.click(); return !!btn;
    });
    const context = await page.$eval('[role="dialog"]', (n) =>
      n.textContent.includes('Быт. 1:1') && n.textContent.includes('единственном числе'));
    if (!revisited || !compare || !context) throw new Error('Hero compare state not accessible');
    // Saving the biblical reference must be persistent, not an RPG unlock.
    const save = await page.evaluate(() => {
      const button = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent?.includes('Сохранить свидетельство'));
      button?.click(); return !!button;
    });
    if (!save) throw new Error('Study bookmark button missing');
    await page.waitForFunction(() => {
      const raw = localStorage.getItem('imena-horeb.study-bookmarks.v1');
      try { return JSON.parse(raw || '[]').includes('elohim'); } catch { return false; }
    }, { timeout: 6000 });
    await page.keyboard.press('Escape');
    // The saved dossier may be read remotely; its 3D-only inspect control
    // must not remain active when the actual exhibit is hundreds of metres away.
    await page.evaluate(() => window.__horeb.world.teleportZone(2));
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('nav button')]
        .find((b) => b.textContent?.includes('Закладки'));
      btn?.click();
    });
    await page.waitForSelector('[role="dialog"]');
    const entry = await page.evaluate((label) => {
      const button = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent?.includes(label));
      button?.click(); return !!button;
    }, hero.label);
    if (!entry) throw new Error('Saved biblical dossier not listed');
    await page.waitForFunction((label) => {
      const dialog = document.querySelector('[role="dialog"]');
      return !!dialog?.textContent?.includes(label) &&
        !!dialog?.querySelector('button[disabled]');
    }, { timeout: 6000 }, hero.label);
    const remote = await page.evaluate(() => ({
      text: document.querySelector('[role="dialog"]')?.textContent || '',
      disabled: [...document.querySelectorAll('[role="dialog"] button[disabled]')]
        .some((b) => b.textContent?.includes('Осмотреть')),
    }));
    if (!remote.disabled || !remote.text.includes('Физический осмотр доступен только рядом'))
      throw new Error('Remote bookmark incorrectly enables physical interaction');
    await page.screenshot({ path: join(screenshots, 'smoke-study-bookmark-remote.png') });
    await page.keyboard.press('Escape');
    // Browser-only book references survive leaving the WebGL world entirely.
    await page.evaluate(() => [...document.querySelectorAll('nav button')]
      .find((b) => b.textContent?.trim() === 'Выйти')?.click());
    await page.waitForFunction(() => !!document.querySelector('h1')?.textContent?.includes('ИМЕНА БОГА'),
      { timeout: 7500 });
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Мои закладки'))?.click());
    await page.waitForSelector('[role="dialog"]');
    await page.evaluate((label) => [...document.querySelectorAll('[role="dialog"] button')]
      .find((b) => b.textContent?.includes(label))?.click(), hero.label);
    await page.waitForFunction((label) => {
      const modal = document.querySelector('[role="dialog"]');
      return !!modal?.textContent?.includes(label) && !!modal?.textContent?.includes('Быт. 1:1');
    }, { timeout: 7500 }, hero.label);
    await page.screenshot({ path: join(screenshots, 'smoke-study-bookmark-intro.png') });
    console.log('PASS elohim: inspect → 3D response → comparison → saved bookmark → remote & intro reading');

    // A checkpoint was stored on explicit exit from zone 2, not just on E.
    await page.waitForFunction(() => {
      try {
        const pos = JSON.parse(localStorage.getItem('imena-horeb.progress.v1') || 'null')?.last;
        return !!pos && pos.z < -62 && pos.z > -116;
      } catch { return false; }
    }, { timeout: 6000 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
    const resumeLabel = await page.evaluate(() => [...document.querySelectorAll('button')]
      .some((b) => b.textContent?.trim() === 'Продолжить путешествие'));
    if (!resumeLabel) throw new Error('Saved checkpoint is not advertised as Resume on the intro screen');
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.click());
    await page.waitForFunction(() => !!window.__horeb?.world, { timeout: 90000 });
    const resumedAt = await page.evaluate(() => ({
      ...window.__horeb.world.position, shoes: window.__horeb.world.shoes,
    }));
    if (Math.abs(resumedAt.z + 68) > 1 || resumedAt.shoes !== 'shod')
      throw new Error('Saved progress did not restore zone-2 checkpoint safely: ' + JSON.stringify(resumedAt));
    console.log('PASS persisted travel checkpoint restores zone 2 after full reload');

    // A forged/outdated checkpoint inside the forbidden bush radius must be
    // clamped by the production spawn guard; restoring always starts shod.
    await page.evaluate(() => localStorage.setItem('imena-horeb.progress.v1',
      JSON.stringify({ visited: [0, 7], last: { x: 0, z: -366 } })));
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()))?.click());
    await page.waitForFunction(() => !!window.__horeb?.world, { timeout: 90000 });
    const guard = await page.evaluate(() => ({
      distance: window.__horeb.world.position.z + 366,
      shoes: window.__horeb.world.shoes,
    }));
    if (guard.distance < 13.99 || guard.shoes !== 'shod')
      throw new Error('Restored progress bypassed holy threshold: ' + JSON.stringify(guard));
    console.log('PASS forged inner-bush checkpoint cannot bypass shoes/outer safety gate');
    // Reset from INSIDE a live 3D session, not merely on the intro screen.
    // It must close that World without teardown resurrecting its old position.
    const settingsOpened = await page.evaluate(() => {
      const button = [...document.querySelectorAll('nav button')]
        .find((b) => b.textContent?.trim() === 'Настройки');
      button?.click(); return !!button;
    });
    if (!settingsOpened) throw new Error('World settings unavailable for route reset');
    await page.waitForSelector('[role="dialog"]', { timeout: 6000 });
    const worldReset = await page.evaluate(() => {
      const button = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent?.trim() === 'Сбросить маршрут и выйти');
      button?.click(); return !!button;
    });
    if (!worldReset) throw new Error('In-world reset action unavailable');
    await page.waitForFunction(() => {
      const isIntro = document.querySelector('h1')?.textContent?.includes('ИМЕНА БОГА');
      const hasBegin = [...document.querySelectorAll('button')]
        .some((b) => b.textContent?.trim() === 'Начать путешествие');
      try {
        const p = JSON.parse(localStorage.getItem('imena-horeb.progress.v1') || '{}');
        return isIntro && hasBegin && p.last === null && JSON.stringify(p.visited) === '[0]' &&
          !window.__horeb?.world;
      } catch { return false; }
    }, { timeout: 8000 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => [...document.querySelectorAll('button')]
      .some((b) => b.textContent?.trim() === 'Начать путешествие'), { timeout: 6000 });
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => b.textContent?.trim() === 'Начать путешествие')?.click());
    await page.waitForFunction(() => !!window.__horeb?.world, { timeout: 90000 });
    const afterReset = await page.evaluate(() => ({
      ...window.__horeb.world.position, shoes: window.__horeb.world.shoes,
    }));
    if (Math.abs(afterReset.z + 2) > 1 || Math.abs(afterReset.x) > 1 || afterReset.shoes !== 'shod')
      throw new Error('Reset failed to return explorer to original safe start: ' + JSON.stringify(afterReset));
    console.log('PASS in-world reset survives teardown, reload and starts at original safe position');
    // Recreate a legitimate checkpoint to keep intro reset coverage separate.
    await page.evaluate(() => window.__horeb.world.teleportZone(2));
    await page.evaluate(() => [...document.querySelectorAll('nav button')]
      .find((button) => button.textContent?.trim() === 'Выйти')?.click());
    await page.waitForFunction(() => {
      try {
        const pos = JSON.parse(localStorage.getItem('imena-horeb.progress.v1') || '{}').last;
        return document.querySelector('h1')?.textContent?.includes('ИМЕНА БОГА') &&
          pos && Math.abs(pos.z + 68) < 1;
      } catch { return false; }
    }, { timeout: 7500 });
    // An explorer can discard the saved checkpoint even if only one zone was
    // visited; the primary action must return to a genuine fresh start.
    await page.evaluate(() => [...document.querySelectorAll('nav button')]
      .find((button) => button.textContent?.trim() === 'Выйти')?.click());
    await page.waitForFunction(() => !!document.querySelector('h1')?.textContent?.includes('ИМЕНА БОГА'),
      { timeout: 7500 });
    const resetClicked = await page.evaluate(() => {
      const button = [...document.querySelectorAll('button')]
        .find((b) => b.textContent?.trim() === 'Сбросить прогресс');
      button?.click();
      return !!button;
    });
    if (!resetClicked) throw new Error('Reset saved checkpoint control unavailable');
    await page.waitForFunction(() => {
      const start = [...document.querySelectorAll('button')]
        .some((b) => b.textContent?.trim() === 'Начать путешествие');
      try {
        const p = JSON.parse(localStorage.getItem('imena-horeb.progress.v1') || '{}');
        return start && p.last === null && JSON.stringify(p.visited) === '[0]';
      } catch { return false; }
    }, { timeout: 6000 });
    console.log('PASS reset clears persisted checkpoint and restores Begin Journey action');
  } catch (error) {
    const message = 'HERO ACTION: ' + (error?.stack || error);
    failures.push(message);
    console.error(message);
  }
} catch(error) {
  failures.push('UNCAUGHT '+(error?.stack||error));
} finally {
  await browser.close();
}
console.log('HOREB actual exhibit interactions: '+passed+'/42 PASS, '+failures.length+' FAIL');
if (failures.length) process.exitCode=1;
