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
    .find((b) => b.textContent.includes('Начать путешествие'))?.click());
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
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('[role="dialog"] button')]
        .find((b) => b.textContent.includes('Осмотреть место в 3D'));
      btn?.click();
      return !!btn;
    });
    if (!clicked) throw new Error('Missing hero inspection control');
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), {timeout:6000});
    await page.waitForFunction(() => {
      const w = window.__horeb?.world;
      let inspected = false;
      w?.scene.traverse((o) => {
        if (o.name === 'original-script-beacon' && o.userData.exhibitId === 'elohim' &&
            o.scale.x > 0.83 && o.scale.x < 0.9) inspected = true;
      });
      return inspected;
    }, { timeout: 7000, polling: 100 });
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
  } catch (error) {
    failures.push('HERO ACTION: ' + (error?.message || error));
  }
} catch(error) {
  failures.push('UNCAUGHT '+(error?.stack||error));
} finally {
  await browser.close();
}
console.log('HOREB actual exhibit interactions: '+passed+'/42 PASS, '+failures.length+' FAIL');
if (failures.length) process.exitCode=1;
