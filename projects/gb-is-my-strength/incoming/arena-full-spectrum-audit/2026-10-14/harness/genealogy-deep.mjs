// genealogy-deep.mjs — глубокий разбор SVG-схемы атласа родословной: узлы, связи, контролы, доступность, темы.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const res = {};

const PROFILES = [
  { tag: 'desktop-light', width: 1440, height: 900, isMobile: false, colorScheme: 'light' },
  { tag: 'desktop-dark', width: 1440, height: 900, isMobile: false, colorScheme: 'dark' },
  { tag: 'mobile-light', width: 390, height: 844, isMobile: true, colorScheme: 'light' },
];

for (const prof of PROFILES) {
  const ctx = await browser.newContext({ viewport: { width: prof.width, height: prof.height }, isMobile: prof.isMobile, hasTouch: prof.isMobile, colorScheme: prof.colorScheme, locale: 'ru-RU' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 180)}`); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 180)));
  await page.goto(BASE + '/rodosloviye/', { waitUntil: 'load' });
  await page.waitForTimeout(6000);

  const data = await page.evaluate(() => {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const rect = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
    const flow = document.querySelector('.react-flow');
    const viewport = document.querySelector('.react-flow__viewport');
    const nodes = [...document.querySelectorAll('.react-flow__node')].map(n => {
      const cs = getComputedStyle(n);
      const textEl = n.querySelector('.genealogy-node__name, b, strong, span');
      return {
        id: n.getAttribute('data-id'), cls: (n.className || '').toString().slice(0, 70), rect: rect(n),
        text: norm(n.textContent).slice(0, 60),
        fontSize: textEl ? getComputedStyle(textEl).fontSize : null,
        color: textEl ? getComputedStyle(textEl).color : null,
        bg: cs.backgroundColor, border: cs.borderColor, radius: cs.borderRadius,
        role: n.getAttribute('role'), tabindex: n.getAttribute('tabindex'), aria: n.getAttribute('aria-label'),
      };
    });
    const edges = [...document.querySelectorAll('.react-flow__edge')].map(e => ({ cls: (e.className || '').toString().slice(0, 60), label: norm(e.textContent).slice(0, 30), stroke: e.querySelector('path') ? getComputedStyle(e.querySelector('path')).stroke : null }));
    const edgeLabels = [...document.querySelectorAll('.react-flow__edge-textwrapper, .react-flow__edge-text')].map(t => ({ text: norm(t.textContent).slice(0, 30), rect: rect(t), fontSize: getComputedStyle(t).fontSize, fill: getComputedStyle(t).fill }));
    const controls = [...document.querySelectorAll('.react-flow__controls button, .react-flow__controls-button, .react-flow__minimap, button, select, input')].map(el => {
      const r = rect(el); const cs = getComputedStyle(el);
      return { tag: el.tagName, cls: (el.className || '').toString().slice(0, 40), aria: el.getAttribute('aria-label'), title: el.getAttribute('title'), text: norm(el.textContent).slice(0, 24), rect: r, fontSize: cs.fontSize, tapOk: Math.min(r.w, r.h) >= 24, visible: r.w > 0 && r.h > 0 };
    }).filter(c => c.visible);
    const minimap = document.querySelector('.react-flow__minimap');
    const statusBar = document.querySelector('[class*="status"], [class*="genealogy-status"]');
    const loading = [...document.querySelectorAll('h2')].find(h => /Загружаем/.test(h.textContent));
    const loadingVisible = loading ? (r => r.width > 0 && r.height > 0 && getComputedStyle(loading).visibility !== 'hidden' && getComputedStyle(loading).display !== 'none')(loading.getBoundingClientRect()) : null;
    const svgBg = document.querySelector('.react-flow__background');
    return {
      flowExists: !!flow, viewportTransform: viewport ? getComputedStyle(viewport).transform : null,
      nodeCount: nodes.length, nodes,
      edgeCount: edges.length, edges: edges.slice(0, 8), edgeLabels,
      loadingVisible, loadingRect: loading ? rect(loading) : null,
      minimap: minimap ? { rect: rect(minimap), visible: minimap.getBoundingClientRect().width > 0 } : null,
      controls: controls.slice(0, 24),
      graphBgColor: svgBg ? getComputedStyle(svgBg).backgroundColor : null,
      bodyText: norm(document.querySelector('#genealogy-tree')?.textContent || '').slice(0, 400),
      h1: norm(document.querySelector('h1')?.textContent || ''),
      statusText: statusBar ? norm(statusBar.textContent).slice(0, 200) : null,
    };
  });
  data.errors = errors;
  data.profile = prof.tag;
  res[prof.tag] = data;
  await page.screenshot({ path: `${OUT}/gen-deep-${prof.tag}.png` });
  // крупный план графа и контролов
  const graph = await page.$('#genealogy-tree');
  if (graph) { try { await graph.screenshot({ path: `${OUT}/gen-graph-${prof.tag}.png` }); } catch (e) { console.log('screenshot графа не удался:', String(e).slice(0, 80)); } }
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/genealogy-deep.json`, JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) {
  console.log(`\n== ${k}: узлов=${v.nodeCount} рёбер=${v.edgeCount} подписи_рёбер=${v.edgeLabels.length} h1=${JSON.stringify(v.h1)}`);
  console.log('   загрузочный h2 виден:', v.loadingVisible, '| transform viewport:', v.viewportTransform);
  console.log('   minimap:', JSON.stringify(v.minimap));
  console.log('   контролы:', v.controls.map(c => `${c.aria || c.title || c.text || c.cls}(${c.rect.w}x${c.rect.h}${c.tapOk ? '' : ' ⚠<24px'})`).join(', ').slice(0, 400));
  console.log('   узлы (id | rect | размер шрифта | текст):');
  for (const n of v.nodes.slice(0, 12)) console.log(`     ${n.id} | (${n.rect.x},${n.rect.y}) ${n.rect.w}x${n.rect.h} | ${n.fontSize} | ${n.text.slice(0, 40)}`);
  console.log('   ошибки консоли:', v.errors.slice(0, 4));
}
