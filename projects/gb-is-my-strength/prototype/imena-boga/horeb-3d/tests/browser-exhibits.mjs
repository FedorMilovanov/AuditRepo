// Real browser check that all 42 3D markers can be approached, activated and read.
// Explicit test, never an invisible SKIP. HOREB_BROWSER_PATH and HOREB_BASE_URL as in browser-smoke.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

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
} catch(error) {
  failures.push('UNCAUGHT '+(error?.stack||error));
} finally {
  await browser.close();
}
console.log('HOREB actual exhibit interactions: '+passed+'/42 PASS, '+failures.length+' FAIL');
if (failures.length) process.exitCode=1;
