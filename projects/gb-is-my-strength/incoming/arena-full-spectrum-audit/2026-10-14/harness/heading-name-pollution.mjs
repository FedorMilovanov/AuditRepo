// живые замеры: (1) имена заголовков в AX-дереве, (2) содержимое вне ориентиров (axe region),
// (3) доступна ли кнопка «Скопировать ссылку» с клавиатуры и где она лежит в DOM
import { chromium } from 'playwright-core';
import fs from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh';
const BASE = 'http://127.0.0.1:8099';
const AXE = fs.readFileSync(process.env.AXE || './axe.min.js', 'utf8')  // npm i axe-core && cp node_modules/axe-core/axe.min.js .;

const ROUTES = [
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/articles/kod-da-vinchi/',
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/krajne-li-isporcheno-serdce/',
  '/baptisty-rossii/sovetskaya-noch/',
  '/hard-texts/genesis-6/',
  '/nagornaya/chast-1/',
  '/articles/serdce-i-duh/',
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const out = [];
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); });
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  const dom = await p.evaluate(() => {
    const anchors = [...document.querySelectorAll('.heading-anchor, .article-heading-anchor, a[aria-label="Скопировать ссылку на раздел"], button[aria-label="Скопировать ссылку на раздел"]')];
    const inside = anchors.filter((a) => a.closest('h1,h2,h3,h4,h5,h6'));
    const host = inside[0]?.closest('h1,h2,h3,h4,h5,h6');
    // имена заголовков, как их видит AT (по содержимому, включая вложенные aria-label)
    const pol = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => {
      const nested = [...h.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' | ');
      return { text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), nestedLabels: nested, lvl: +h.tagName[1] };
    }).filter((h) => h.nestedLabels);
    return {
      anchorsTotal: anchors.length, anchorsInsideHeading: inside.length,
      hostTag: host ? host.tagName + '.' + host.className.toString().split(' ')[0] : null,
      anchorSample: inside[0]?.outerHTML.slice(0, 150) || null,
      anchorHref: inside[0]?.getAttribute('href') || null,
      headingsWithNestedLabel: pol.slice(0, 3), countPolluted: pol.length,
      tabbable: anchors.filter((a) => a.tabIndex >= 0).length,
    };
  });

  await p.addScriptTag({ content: AXE });
  const axe = await p.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'rule', values: ['heading-order', 'region', 'page-has-heading-one'] } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 4).map((n) => n.target.join(' ').slice(0, 70)) }));
  });

  // имя первого заголовка так, как его объявит AT
  const firstName = await p.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3')].find((x) => x.textContent.trim());
    const clone = h.cloneNode(true);
    return { tag: h.tagName, text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), lastInnermost: h.querySelector('[aria-label]')?.getAttribute('aria-label') || null };
  });

  out.push({ route, ...dom, axe, firstName, consoleErrors: errs.filter((e) => !/Content Security Policy/.test(e)).slice(0, 2) });
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
fs.writeFileSync('./out/heading-name-pollution.json', JSON.stringify(out, null, 1));
