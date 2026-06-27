# PremiumControls visibility repair playbook — Nagornaya + Baptisty

**Purpose:** give the next implementation agent a concrete, under-key path to fix the browser-visible residual PremiumControls debt found on 2026-06-27.  
**Do not apply blindly.** Use this as a surgical lane plan with Playwright proof.

---

## 0. Create a lane

```bash
git fetch origin main
git checkout main
git pull --rebase origin main
git checkout -b lane/premiumcontrols-visibility-nagornaya-baptisty-2026-06-27
```

This touches special route worlds and shared CSS/scripts, so do not work on `main`.

---

## 1. Setup in Arena

```bash
cd /home/user/gb-is-my-strength
if [ ! -x /tmp/node-v22.12.0-linux-x64/bin/node ]; then
  wget -q https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz -O /tmp/node22.tar.xz
  tar -xf /tmp/node22.tar.xz -C /tmp/
fi
export PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH
npm ci
npx playwright install chromium
sudo npx playwright install-deps chromium
```

Always prefix commands with Node 22 if exports do not persist:

```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run ...
```

---

## 2. Confirm current repro

```bash
npm run strangler:build:production-like
npm run pagefind:build:dist
nohup python3 -m http.server 8093 --bind 127.0.0.1 --directory /home/user/gb-is-my-strength/dist >/tmp/pc-server.log 2>&1 &
```

Run this browser probe:

```js
// scripts/tmp-premium-visibility-probe.js (temporary; do not commit if scratch)
const { chromium } = require('playwright');

const routes = [
  '/baptisty-rossii/noch-na-kure/',
  '/nagornaya/chast-1/'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const vp of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const route of routes) {
      await page.goto('http://127.0.0.1:8093' + route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      const data = await page.evaluate(() => {
        function info(sel) {
          return [...document.querySelectorAll(sel)].map((el) => {
            const s = getComputedStyle(el);
            const b = el.getBoundingClientRect();
            return {
              selector: sel,
              className: String(el.className),
              display: s.display,
              visibility: s.visibility,
              opacity: s.opacity,
              rect: { x: b.x, y: b.y, w: b.width, h: b.height },
              visible: s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0,
              parent: el.parentElement ? String(el.parentElement.className) : '',
            };
          });
        }
        return {
          route: location.pathname,
          embers: info('.gb-ember'),
          saves: info('.gb-save'),
          scopes: document.querySelectorAll('[data-fc-root], [data-fc-controls]').length,
          controller: [...document.scripts].some((s) => /floating-cluster-controller\.js/.test(s.src)),
          overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        };
      });
      console.log(vp.name, route, JSON.stringify(data, null, 2));
    }
    await page.close();
  }
  await browser.close();
})();
```

Expected current repro:

- Nagornaya `.gb-ember.nag-sidebar-ember` / `.gb-save.nag-sidebar-save` are `0×0`.
- Baptisty mobile `.gb-ember.gbs2-ctl` / `.gb-save.gbs2-ctl` are in hidden desktop rail.

---

## 3. Repair option A — Nagornaya scoped CSS fix

### 3.1 Problem

Nagornaya article pages include PremiumControls markup but do not load `css/floating-cluster.css` or `css/premium-controls.css`. Because `.gb-ember` and `.gb-save` are class-only buttons, they collapse to `0×0` without the PremiumControls CSS layer.

### 3.2 Do NOT do this blindly

Do not simply add global `floating-cluster.css` to Nagornaya without checking because that file contains global hide/state rules that can interfere with Nagornaya’s Tailwind sidebar and legacy `#themeToggle` / mobile controls.

### 3.3 Safer surgical CSS

Preferred minimal route-scoped CSS can be added to the existing allowed CSS file `css/nagornaya-mobile-toc.css` or `css/mobile-hotfix.css` (depending on owner preference), not a new CSS file.

Example scoped CSS:

```css
/* PremiumControls sizing for Nagornaya sidebar only.
   Keep scoped to body.nagornaya-page to avoid changing article/Gill controls. */
body.nagornaya-page .nag-sidebar-controls .gb-ember,
body.nagornaya-page .nag-sidebar-controls .gb-save {
  width: var(--ember-size, 32px);
  height: var(--ember-size, 32px);
  min-width: var(--ember-size, 32px);
  min-height: var(--ember-size, 32px);
  display: grid;
  place-items: center;
  position: relative;
  border: 0;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  color: currentColor;
  cursor: pointer;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__ring-svg {
  position: absolute;
  inset: -3px;
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  transform: rotate(-90deg);
  pointer-events: none;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__ring-track,
body.nagornaya-page .nag-sidebar-controls .gb-ember__ring-progress {
  fill: none;
  stroke-width: 2.5;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__ring-track {
  stroke: rgba(255,255,255,.16);
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__ring-progress {
  stroke: var(--ring-color, #d8aa6d);
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: calc(283 * (1 - var(--p, 0)));
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__glyph,
body.nagornaya-page .nag-sidebar-controls .gb-ember__pause,
body.nagornaya-page .nag-sidebar-controls .gb-ember__check,
body.nagornaya-page .nag-sidebar-controls .gb-save svg {
  width: 18px;
  height: 18px;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember__pause,
body.nagornaya-page .nag-sidebar-controls .gb-ember__check {
  display: none;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember[data-state="playing"] .gb-ember__glyph {
  display: none;
}

body.nagornaya-page .nag-sidebar-controls .gb-ember[data-state="playing"] .gb-ember__pause {
  display: block;
}
```

### 3.4 Mobile decision

Current Nagornaya Play/Save live in desktop sidebar only:

```html
<aside class="hidden lg:flex ...">
  <div class="nag-sidebar-controls" data-fc-root ...>
```

On mobile, that sidebar is hidden. Decide one of two paths:

#### Path A — desktop-only policy

If owner says Nagornaya mobile should not have Play/Save, encode this as policy in the rollout audit:

```js
// allow desktop-only exception for body.nagornaya-page if documented
```

But this conflicts with “PremiumControls everywhere” expectations.

#### Path B — add mobile Play/Save

Add a mobile-visible controls container near the existing mobile header/bottom controls:

```html
<div class="nag-mobile-premium-controls" data-fc-root data-fc-mode="nagornaya" data-fc-variant="nagornaya">
  <button type="button" class="gb-ember nag-mobile-ember" data-state="idle" style="--p:0;--ember-size:32px;--ring-color:var(--color-accent-gold-bright,#d8aa6d)" data-fc-action="play" aria-label="Озвучка">...</button>
  <button type="button" class="gb-save nag-mobile-save" data-fc-action="save" aria-label="Сохранить" aria-pressed="false">...</button>
</div>
```

Then add scoped CSS:

```css
@media (min-width: 1024px) {
  body.nagornaya-page .nag-mobile-premium-controls { display: none; }
}

@media (max-width: 1023px) {
  body.nagornaya-page .nag-mobile-premium-controls {
    position: fixed;
    right: 12px;
    bottom: calc(76px + env(safe-area-inset-bottom, 0px));
    z-index: 60;
    display: flex;
    gap: 8px;
    padding: 6px;
    border-radius: 999px;
    background: rgba(28,25,23,.92);
    color: #f7f2e8;
    box-shadow: 0 12px 30px rgba(0,0,0,.24);
  }
}
```

This must be visually reviewed because Nagornaya already has mobile TOC/bottom controls.

---

## 4. Repair option B — Baptisty mobile Play/Save

### 4.1 Problem

Baptisty articles place Play/Save inside desktop rail:

```html
<div class="gbs2-rfoot" data-fc-root data-fc-mode="series-lite" data-fc-variant="baptisty">
  ...
  <button class="gb-ember gbs2-ctl" data-fc-action="play">...</button>
  <button class="gb-save gbs2-ctl" data-fc-action="save">...</button>
</div>
```

But on mobile the parent rail is hidden:

```css
.gbs2-rail { display: none; } /* mobile behavior */
```

Mobile head contains only theme/search:

```html
<div class="gbs2-mobile-actions">
  <button data-gbs2-theme>◐</button>
  <button data-gbs2-search>⌕</button>
</div>
```

### 4.2 Recommended minimal repair

Add Play/Save buttons into `.gbs2-mobile-actions` for the Baptisty series article components.

Example:

```html
<div class="gbs2-mobile-actions" data-fc-root data-fc-mode="series-lite" data-fc-variant="baptisty-mobile">
  <button class="gbs2-mctl" type="button" data-gbs2-theme aria-label="Переключить тему">◐</button>
  <button class="gbs2-mctl" type="button" data-gbs2-search aria-label="Поиск">⌕</button>
  <button type="button" class="gb-ember gbs2-mctl gbs2-mctl--ember" data-state="idle" style="--p:0;--ember-size:32px;--ring-color:var(--color-accent-gold-bright,#d8aa6d)" data-fc-action="play" aria-label="Озвучка">...</button>
  <button type="button" class="gb-save gbs2-mctl gbs2-mctl--save" data-fc-action="save" aria-label="Сохранить" aria-pressed="false">...</button>
</div>
```

Add CSS in an existing allowed CSS file (`css/site.css` or `css/floating-cluster.css` if it is already loaded on Baptisty pages):

```css
@media (max-width: 899px) {
  body.gbs-world .gbs2-mobile-actions .gb-ember,
  body.gbs-world .gbs2-mobile-actions .gb-save {
    width: 34px;
    height: 34px;
    min-width: 34px;
    min-height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: rgba(255,255,255,.08);
    color: currentColor;
  }

  body.gbs-world .gbs2-mobile-actions .gb-ember__ring-svg {
    position: absolute;
    inset: -3px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    transform: rotate(-90deg);
    pointer-events: none;
  }
}
```

### 4.3 Avoid duplicate-click race

If both desktop and mobile controls exist in DOM, controller must handle multiple embers safely. It currently iterates embers and scopes; keep that behavior. Do **not** introduce IDs duplicated across buttons. Prefer classes and `data-fc-action` only.

### 4.4 Apply to all 10 Baptisty article components

Find files:

```bash
grep -RIl "gbs2-mobile-actions" src/components/baptisty-rossii/*PageHead.astro src/components/baptisty-rossii/*Body.astro
```

or:

```bash
grep -RIl "data-fc-variant=\"baptisty\"" src/components/baptisty-rossii
```

Patch all 10 article route components, not just `noch-na-kure`, unless the repo has a shared helper.

---

## 5. Strengthen audit — structural + visibility

The current rollout audit is structural. It catches:

- controls on forbidden routes;
- controls without scope;
- controller missing;
- retired `fc-*` state CSS;
- double CSS delivery.

It does **not** catch 0×0 browser visibility. Add a new Playwright smoke script in `scripts/`, e.g.:

```js
#!/usr/bin/env node
'use strict';

const { chromium } = require('playwright');

const ROUTES = [
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/baptisty-rossii/noch-na-kure/',
  '/nagornaya/chast-1/',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

function isVisibleRect(r) {
  return r.width > 0 && r.height > 0;
}

(async () => {
  const base = process.env.AUDIT_BASE || 'http://127.0.0.1:8093';
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const route of ROUTES) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      const result = await page.evaluate(() => {
        const controls = [...document.querySelectorAll('.gb-ember, .gb-save')].map((el) => {
          const cs = getComputedStyle(el);
          const b = el.getBoundingClientRect();
          return {
            className: String(el.className),
            action: el.getAttribute('data-fc-action'),
            display: cs.display,
            visibility: cs.visibility,
            rect: { width: b.width, height: b.height, x: b.x, y: b.y },
            visible: cs.display !== 'none' && cs.visibility !== 'hidden' && b.width > 0 && b.height > 0,
          };
        });
        return {
          controls,
          visibleEmbers: controls.filter((c) => c.className.includes('gb-ember') && c.visible).length,
          visibleSaves: controls.filter((c) => c.className.includes('gb-save') && c.visible).length,
          overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        };
      });

      // If route is in matrix as carrying Play+Save, require at least one visible of each per viewport.
      if (result.visibleEmbers < 1) failures.push(`${vp.name} ${route}: no visible .gb-ember`);
      if (result.visibleSaves < 1) failures.push(`${vp.name} ${route}: no visible .gb-save`);
      if (result.overflow > 8) failures.push(`${vp.name} ${route}: horizontal overflow ${result.overflow}`);
    }
    await page.close();
  }

  await browser.close();
  if (failures.length) {
    console.error('PremiumControls visibility audit failed:');
    failures.forEach((f) => console.error('- ' + f));
    process.exit(1);
  }
  console.log('PremiumControls visibility audit passed');
})();
```

Wire it as optional/manual first:

```json
"premium-controls:visibility:audit": "node scripts/premium-controls-visibility-audit.js"
```

Do not immediately put it into the main release barrier until it is stable in CI with Playwright installed.

---

## 6. Verification sequence after repair

```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run cache-bust
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run pagefind:build:dist
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run premium-controls:rollout:audit
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run premium-controls:visibility:audit
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:audit:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run guard:shared-files
```

If Playwright is not available locally, at minimum run the structural audits and document that the visibility witness must be run in CI or a Playwright-enabled Arena session.

---

## 7. What not to do

- Do not rewrite `floating-cluster-controller.js` in this lane.
- Do not rename `data-fc-*` attributes.
- Do not merge Gill convergence while fixing Baptisty/Nagornaya visibility.
- Do not add new global CSS files; use existing allowed CSS files.
- Do not add duplicate IDs for mobile Play/Save.
- Do not silently declare mobile Play/Save “not needed” without owner decision.

---

## 8. Done definition

A successful follow-up lane must show:

```text
PremiumControls rollout audit: PASS
PremiumControls visibility audit: PASS
validate:static-publication: PASS
strangler:audit:production-like: PASS
No old body.fc-* selectors in source/dist CSS
No horizontal overflow on sampled mobile routes
```

And must include before/after Playwright evidence in its lane report.
