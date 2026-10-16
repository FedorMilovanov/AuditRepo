// второй свидетель: нативное AX-дерево Chrome (CDP) + поведение кнопки «Скопировать ссылку»
import { chromium } from 'playwright-core';

const EXE = '/tmp/gbchrome/chrome.sh';
const BASE = 'http://127.0.0.1:8099';
const route = process.argv[2] || '/articles/kod-da-vinchi/';

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const p = await ctx.newPage();
await p.goto(BASE + route, { waitUntil: 'load' });
await p.waitForTimeout(1500);

// 1) нативное AX-дерево
const cdp = await ctx.newCDPSession(p);
await cdp.send('Accessibility.enable');
const { nodes } = await cdp.send('Accessibility.getFullAXTree');
const headings = nodes
  .filter((n) => n.role?.value === 'heading')
  .map((n) => ({ level: n.properties?.find((x) => x.name === 'level')?.value?.value, name: (n.name?.value || '').slice(0, 70) }))
  .filter((h) => h.name);
console.log('--- нативное AX-дерево Chrome: заголовки ---');
console.log('всего заголовков:', headings.length);
const polluted = headings.filter((h) => /Скопировать ссылку/.test(h.name));
console.log('с «Скопировать ссылку» в имени:', polluted.length);
headings.slice(0, 6).forEach((h) => console.log(`   h${h.level}: ${h.name}`));

// 2) поведение кнопки
const before = p.url();
const res = await p.evaluate(() => {
  const a = document.querySelector('h2 [aria-label="Скопировать ссылку на раздел"], h3 [aria-label="Скопировать ссылку на раздел"], h4 [aria-label="Скопировать ссылку на раздел"]');
  if (!a) return { found: false };
  const info = { found: true, tag: a.tagName, href: a.getAttribute('href'), text: a.textContent.trim(), hidden: a.hasAttribute('hidden'), tabIndex: a.tabIndex, parentTag: a.parentElement.tagName };
  a.click();
  return info;
});
await p.waitForTimeout(600);
const after = p.url();
let clip = null;
try { clip = await p.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'недоступно: ' + e.message.slice(0, 40); }
const feedback = await p.evaluate(() => {
  const f = [...document.querySelectorAll('[role="status"], .copy-feedback, .heading-anchor__feedback, [aria-live]')].map((e) => ({ cls: e.className.toString().slice(0, 40), text: e.textContent.trim().slice(0, 60), hidden: e.offsetParent === null }));
  return f.slice(0, 4);
});
console.log('\n--- поведение кнопки ---');
console.log('описание:', JSON.stringify(res));
console.log('URL до :', before);
console.log('URL после:', after, before === after ? '(не изменился)' : '(изменился)');
console.log('буфер обмена:', String(clip).slice(0, 120));
console.log('обратная связь для пользователя:', JSON.stringify(feedback));

// 3) клавиатура: сколько Tab-нажатий до первого заголовочного контрола
await p.goto(BASE + route, { waitUntil: 'load' });
await p.waitForTimeout(1200);
let tabHits = 0, found = null;
for (let i = 0; i < 60; i++) {
  await p.keyboard.press('Tab');
  tabHits++;
  const cur = await p.evaluate(() => {
    const a = document.activeElement;
    if (!a) return null;
    return { tag: a.tagName, label: a.getAttribute('aria-label'), inHeading: !!a.closest('h1,h2,h3,h4,h5,h6') };
  });
  if (cur?.inHeading && /Скопировать/.test(cur.label || '')) { found = { ...cur, tabHits }; break; }
}
console.log('\n--- клавиатура ---');
console.log('первый контрол внутри заголовка достигнут:', JSON.stringify(found));
await b.close();
