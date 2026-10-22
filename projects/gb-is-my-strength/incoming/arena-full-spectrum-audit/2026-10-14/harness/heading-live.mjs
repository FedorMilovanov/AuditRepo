// живые пробы: (1) порядок заголовков в DOM и в AX-дереве, (2) axe по структуре,
// (3) видно ли панель серии, (4) реальные картинки без размеров, (5) доступные имена иконок
import { chromium } from 'playwright-core';
import fs from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh';
const BASE = 'http://127.0.0.1:8099';
const AXE = fs.readFileSync(process.env.AXE || './axe.min.js', 'utf8')  // npm i axe-core && cp node_modules/axe-core/axe.min.js .;

const ROUTES = [
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/articles/kod-da-vinchi/',
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/baptisty-rossii/',
  '/articles/chto-bibliya-nazyvaet-serdcem/',
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const out = [];
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.waitForTimeout(1200);

  const info = await p.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter((h) => h.textContent.trim())
      .map((h) => ({ lvl: +h.tagName[1], text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 45),
        cls: h.className.toString().slice(0, 35),
        inMain: !!h.closest('main'),
        rect: (() => { const r = h.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
        visible: (() => { const s = getComputedStyle(h); return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && h.getBoundingClientRect().height > 0; })(),
      }));
    const h1 = hs.find((h) => h.lvl === 1);
    const rail = document.querySelector('.gbs2-rail');
    const skip = [...document.querySelectorAll('a[href^="#"]')].filter((a) => /Перейти|skip/i.test(a.textContent)).map((a) => ({ text: a.textContent.trim().slice(0, 30), href: a.getAttribute('href') }));
    // реальные картинки без размеров (кроме пикселей аналитики)
    const imgs = [...document.querySelectorAll('img')].map((i) => ({
      src: (i.currentSrc || i.src || '').slice(0, 90), w: i.getAttribute('width'), h: i.getAttribute('height'),
      natural: [i.naturalWidth, i.naturalHeight], rendered: (() => { const r = i.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })(),
      above: i.getBoundingClientRect().top < window.innerHeight,
    })).filter((i) => !/mc\.yandex|metrika|top-fwz1/.test(i.src));
    // иконки: у интерактивного предка есть доступное имя?
    const namelessIcons = [];
    for (const svg of document.querySelectorAll('svg')) {
      const host = svg.closest('button,a,[role="button"],[tabindex="0"],[role="link"]');
      if (!host) continue;
      const name = (host.getAttribute('aria-label') || host.getAttribute('title') || host.textContent.trim() || host.querySelector('img[alt]')?.getAttribute('alt') || '').trim();
      if (!name) namelessIcons.push({ host: host.tagName + '.' + (host.className.toString().split(' ')[0] || ''), svg: svg.outerHTML.slice(0, 80) });
    }
    return { headings: hs, h1IndexDom: hs.findIndex((h) => h.lvl === 1), h1AfterHeadingCount: hs.slice(0, hs.findIndex((h) => h.lvl === 1)).length,
      railPresent: !!rail, railVisible: rail ? rail.getBoundingClientRect().width > 0 : null,
      railTitleText: document.querySelector('.gbs2-rtitle,.gbs2-current-title')?.textContent.trim().slice(0, 40) || null,
      skipLinks: skip, imgsNoDims: imgs.filter((i) => !i.w || !i.h), imgTotal: imgs.length, namelessIcons };
  });

  // axe: только structural-правила
  await p.addScriptTag({ content: AXE });
  const axe = await p.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'rule', values: ['heading-order', 'page-has-heading-one', 'landmark-one-main', 'region', 'empty-heading', 'duplicate-id-aria'] } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0].target.join(' ').slice(0, 80), summary: v.nodes[0].failureSummary?.slice(0, 130) }));
  });

  // AX-дерево: первые заголовки
  let flat = [];
  try {
    const snap = await p.locator('body').ariaSnapshot();
    flat = String(snap).split('\n').filter((l) => /^\s*-\s*(heading|main|complementary|navigation)/.test(l)).slice(0, 10).map((l) => l.trim().slice(0, 90));
  } catch (e) { flat = ['ariaSnapshot недоступен: ' + e.message.slice(0, 60)]; }

  out.push({ route, h1IndexDom: info.h1IndexDom, headingsBeforeH1: info.headings.slice(0, info.h1IndexDom).map((h) => `h${h.lvl} «${h.text}» vis=${h.visible} inMain=${h.inMain}`), railPresent: info.railPresent, railVisible: info.railVisible, railTitleText: info.railTitleText, skipLinks: info.skipLinks, axe, axFirst: flat.slice(0, 8), imgsNoDims: info.imgsNoDims.length, imgTotal: info.imgTotal, imgExamples: info.imgsNoDims.slice(0, 3), namelessIcons: info.namelessIcons.length, iconExamples: info.namelessIcons.slice(0, 3) });
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
fs.writeFileSync('./out/heading-live.json', JSON.stringify(out, null, 1));
