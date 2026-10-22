// широкий живой замер структурных правил axe: heading-order, region, page-has-heading-one
import { chromium } from 'playwright-core';
import fs from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh';
const BASE = 'http://127.0.0.1:8099';
const AXE = fs.readFileSync(process.env.AXE || './axe.min.js', 'utf8')  // npm i axe-core && cp node_modules/axe-core/axe.min.js .;

const ROUTES = [
  '/', '/articles/', '/konfessii/', '/baptisty-rossii/', '/karty/', '/nagornaya/', '/hard-texts/',
  '/journal/', '/about/', '/404.html', '/rodosloviye/', '/map/', '/izbrannoe/',
  '/articles/dzhon-gill-chast-1-chelovek/', '/articles/dzhon-gill-chast-2-uchenyi/',
  '/articles/dzhon-gill-spravochnik/', '/articles/kod-da-vinchi/',
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/krajne-li-isporcheno-serdce/', '/baptisty-rossii/sovetskaya-noch/',
  '/hard-texts/genesis-6/', '/nagornaya/chast-1/', '/articles/serdce-i-duh/',
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const rows = [];
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.waitForTimeout(1400);
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: { type: 'rule', values: ['heading-order', 'region', 'page-has-heading-one', 'empty-heading'] } });
    const dom = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.textContent.trim());
    const h1 = dom.findIndex((h) => h.tagName === 'H1');
    const before = h1 > 0 ? dom.slice(0, h1).map((h) => `${h.tagName}«${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)}»${h.closest('main') ? '' : ' [вне main]'}`) : [];
    const anchorsInHeadings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.querySelector('[aria-label="Скопировать ссылку на раздел"]')).length;
    return {
      axe: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ').slice(0, 60)) })),
      headingsTotal: dom.length, headingsBeforeH1: before, anchorsInHeadings,
    };
  });
  const ho = r.axe.find((v) => v.id === 'heading-order');
  const rg = r.axe.find((v) => v.id === 'region');
  rows.push({ route, headings: r.headingsTotal, headingsBeforeH1: r.headingsBeforeH1, anchorsInHeadings: r.anchorsInHeadings,
    headingOrderNodes: ho ? ho.nodes : 0, headingOrderTargets: ho ? ho.targets : [],
    regionNodes: rg ? rg.nodes : 0, regionTargets: rg ? rg.targets : [],
    otherViolations: r.axe.filter((v) => !['heading-order', 'region'].includes(v.id)).map((v) => `${v.id}:${v.nodes}`) });
  await p.close();
}
await b.close();
fs.writeFileSync('./out/axe-structure-sweep.json', JSON.stringify(rows, null, 1));
const sum = {
  pages: rows.length,
  withHeadingOrder: rows.filter((r) => r.headingOrderNodes).length,
  headingOrderNodes: rows.reduce((a, r) => a + r.headingOrderNodes, 0),
  withRegion: rows.filter((r) => r.regionNodes).length,
  regionNodes: rows.reduce((a, r) => a + r.regionNodes, 0),
  withHeadingsBeforeH1: rows.filter((r) => r.headingsBeforeH1.length).length,
  withAnchorsInHeadings: rows.filter((r) => r.anchorsInHeadings).length,
  anchorsTotal: rows.reduce((a, r) => a + r.anchorsInHeadings, 0),
  regionTargets: [...new Set(rows.flatMap((r) => r.regionTargets))].slice(0, 12),
};
console.log(JSON.stringify(sum, null, 1));
console.log('\nпо страницам:');
for (const r of rows) console.log(`  ${r.route} | заголовков ${r.headings} | до h1: ${r.headingsBeforeH1.length} | копий в заголовках: ${r.anchorsInHeadings} | axe heading-order ${r.headingOrderNodes} | region ${r.regionNodes} ${r.regionTargets.join(',').slice(0, 60)}`);
