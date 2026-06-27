# PremiumControls Node22 + Playwright evidence — 2026-06-27

This file preserves the exact verification commands and the important outputs from the Arena surgical audit pass.

---

## Environment

```bash
node -v
# v22.12.0+

npm ci
npx playwright install chromium
sudo npx playwright install-deps chromium
```

Playwright launch was verified:

```bash
node -e "const {chromium}=require('playwright'); (async()=>{const b=await chromium.launch({headless:true}); console.log(await b.version()); await b.close();})()"
# 149.0.7827.55
```

---

## Source lane checks

```bash
git rev-parse --abbrev-ref HEAD
# lane/system-premiumcontrols-guard-cleanup-2026-06-27

git log -1 --format=%B
# [LANE lane/system-premiumcontrols-guard-cleanup-2026-06-27] ...

git status --porcelain
# empty after commit

git diff --check HEAD
# pass
```

---

## Syntax checks

```bash
node --check scripts/premium-controls-rollout-audit.js
node --check scripts/dist-jsonld-audit.js
node --check scripts/check-workflows.js
node --check js/floating-cluster-controller.js
node --check sw.js
```

All passed.

---

## Key structural checks

```bash
! grep -RIn "body\.fc-single-active" css/floating-cluster.css
! grep -RIn "body\.fc-series-active" css/floating-cluster.css
! grep -RIn "body\.fc-single-active" dist/css/floating-cluster.css
! grep -RIn "body\.fc-series-active" dist/css/floating-cluster.css
```

All passed.

```bash
grep -RIn "body\.gb-cluster-single-active" css/floating-cluster.css
grep -RIn "body\.gb-cluster-series-active" css/floating-cluster.css
grep -F "[data-fc-root]" js/floating-cluster-controller.js
grep -F "[data-fc-controls" js/floating-cluster-controller.js
grep -F "initGillRail" js/floating-cluster-controller.js
grep -F "gb:tts-rate-change" js/floating-cluster-controller.js
```

All found expected live contracts.

---

## Main audit commands

```bash
npm run pagefind:build:dist
npm run premium-controls:rollout:audit
npm run workflows:check
npm run dist:jsonld:audit
npm run dist:css-parity
npm run sw:dist:audit:pagefind
npm run page-ownership:check
npm run contract:compare
npm run data:consistency
npm run content:parity
npm run readable-audit
npm run editorial:lint
npm run gill:reading-time:audit
npm run gill:pagefind:audit
npm run tokens:check
npm run css:layer:validate
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run owner:ui-guard
npm run validate:all
node scripts/audit-pro.js
npm run maps:validate
npm run avraam:audit
npm run mdx:structure:audit
npm run baptisty:roadmap:audit
npm run baptisty:visual-atlas:audit
npm run guard:shared-files
```

All passed.

Full release-level checks also passed:

```bash
npm run strangler:build:production-like
npm run strangler:audit:production-like
npm run validate:static-publication
```

---

## PremiumControls rollout audit output

```text
PremiumControls rollout audit: 30/30 passed

Key assertions:
- 26 dist pages carry PremiumControls
- all controls scoped + controller loaded
- no retired fc-* state selectors in css/floating-cluster.css
- no retired fc-* state selectors in dist/css/floating-cluster.css
- no double floating-cluster CSS delivery
```

---

## Dist structural count script

```js
const fs = require('fs');
const path = require('path');
let n = 0, missingController = [], missingScope = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const h = fs.readFileSync(p, 'utf8');
      const has = /\b(gb-ember|gb-save)\b|data-fc-action=/.test(h);
      if (has) {
        n++;
        if (!/floating-cluster-controller\.js/.test(h)) missingController.push(p);
        if (!/data-fc-root|data-fc-controls=/.test(h)) missingScope.push(p);
      }
    }
  }
}
walk('dist');
console.log(JSON.stringify({ n, missingController, missingScope }, null, 2));
if (n !== 26 || missingController.length || missingScope.length) process.exit(1);
```

Output:

```json
{
  "n": 26,
  "missingController": [],
  "missingScope": []
}
```

---

## Playwright visibility probe

Run local server:

```bash
nohup python3 -m http.server 8093 --bind 127.0.0.1 --directory /home/user/gb-is-my-strength/dist >/tmp/pc-pw-server.log 2>&1 &
```

Probe logic:

```js
const { chromium } = require('playwright');
const routes = [
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/articles/dzhon-gill-istoricheskiy-kontekst/',
  '/articles/kod-da-vinchi/',
  '/baptisty-rossii/noch-na-kure/',
  '/nagornaya/chast-1/'
];
```

For each route and viewport, gather:

```js
const embers = [...document.querySelectorAll('.gb-ember')];
const saves = [...document.querySelectorAll('.gb-save')];
const scoped = !!document.querySelector('[data-fc-root], [data-fc-controls]');
const controller = [...document.scripts].some(s => /floating-cluster-controller\.js/.test(s.src));
const overflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
```

---

## Browser witness output summary

### Passing examples

Hermeneutics desktop:

```json
{
  "embers": 1,
  "visibleEmbers": 1,
  "saves": 1,
  "visibleSaves": 1,
  "scoped": true,
  "controller": true,
  "overflow": 0,
  "oldStateSelectors": false
}
```

Kod da Vinci mobile:

```json
{
  "embers": 1,
  "visibleEmbers": 1,
  "saves": 1,
  "visibleSaves": 1,
  "scoped": true,
  "controller": true,
  "overflow": 0,
  "oldStateSelectors": false
}
```

Gill Part I mobile:

```json
{
  "embers": 2,
  "visibleEmbers": 1,
  "saves": 2,
  "visibleSaves": 1,
  "scoped": true,
  "controller": true,
  "overflow": 0,
  "oldStateSelectors": false
}
```

### Failing examples

Nagornaya desktop:

```json
{
  "selector": ".gb-ember.nag-sidebar-ember",
  "display": "inline-block",
  "visibility": "visible",
  "rect": { "x": 134, "y": 136, "w": 0, "h": 0 }
}
```

Nagornaya desktop save:

```json
{
  "selector": ".gb-save.nag-sidebar-save",
  "display": "block",
  "visibility": "visible",
  "rect": { "x": 236, "y": 177, "w": 0, "h": 0 }
}
```

Baptisty mobile:

```json
{
  "selector": ".gb-ember.gbs2-ctl",
  "display": "grid",
  "rect": { "x": 0, "y": 0, "w": 0, "h": 0 },
  "parent": "aside.gbs2-rail display:none"
}
```

Baptisty mobile save:

```json
{
  "selector": ".gb-save.gbs2-ctl",
  "display": "grid",
  "rect": { "x": 0, "y": 0, "w": 0, "h": 0 },
  "parent": "aside.gbs2-rail display:none"
}
```

---

## Interpretation

The structural audit is necessary and now stronger, but not sufficient. Browser-visible PremiumControls require a viewport-level audit. The next implementation lane should add a stable Playwright smoke after fixing Nagornaya and Baptisty mobile visibility.
