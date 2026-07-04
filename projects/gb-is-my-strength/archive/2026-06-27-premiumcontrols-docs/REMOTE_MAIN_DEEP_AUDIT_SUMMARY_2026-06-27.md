# PremiumControls — remote main deep audit summary (Node 22 + Playwright + remote branches)

**Project:** `gb-is-my-strength` / `gospod-bog.ru`  
**Date:** 2026-06-27  
**Audited source:** current `origin/main` after many follow-up lanes  
**Current audited main commit:** `4e57cf81` — `[LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27] system(premiumcontrols): wire rollout audit into dist deploy gates`  
**Raw 50+ check log:** `DEEP_REVERIFY_2026-06-27.md` (generated harness; contains both real findings and harness/path failures)  

---

## 1. Why this extra audit was needed

After the earlier source lane was pushed:

```text
lane/system-premiumcontrols-surgical-2026-06-27 @ 6c9b3d06
```

`origin/main` advanced rapidly with many additional agents/lanes:

```text
4e57cf81 system(premiumcontrols): wire rollout audit into dist deploy gates
23f283d4 system(premiumcontrols): enhance rollout audit and owner UI guard with bulletproof assertions
46920582 fix(premiumcontrols): reapply TTS race and speed pill guards after Gill v16 converge
...plus Gill H2 parity, audit-pro cleanup, workflow parity, izbrannoe contract, etc.
```

Therefore the old pushed lane is no longer the integration target. Current truth is `origin/main@4e57cf81`, and this document audits that remote-main state.

---

## 2. Checks performed

The generated harness attempted **57 checks** across:

- Node 22 environment
- npm under Node 22
- source and AuditRepo git status
- remote lane list
- remote branch conflict simulations
- PremiumControls core source invariants
- `cache-bust.js` / controller / rollout audit syntax
- source hash scans
- project gates (`validate:all`, `audit-pro`, metadata, native runtime, Gill audits, article MDX audit)
- production-like dist build
- PremiumControls rollout audit
- direct dist DOM checks
- Playwright desktop and mobile smoke
- AuditRepo report integrity

The first raw harness hit timeout/path issues after long build work; it should be treated as a raw transcript, not the final verdict. I then reran the critical checks manually and confirmed the current-main findings below.

---

## 3. Remote branch / conflict status

Current main is ahead of the earlier pushed source lane by many commits. The earlier lane is now **superseded for integration**.

Important remote-main sequence after the surgical lane:

```text
4e57cf81 [LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27]
d4ddc422 [LANE lane/system-visual-audit-height-reconciliation-2026-06-27]
6af03136 [LANE lane/shared-genealogy-multiparent-2026-06-27]
23f283d4 [LANE lane/system-premiumcontrols-bulletproof-guards-2026-06-27]
46920582 [LANE lane/premiumcontrols-surgical-finish-2026-06-27]
```

### Interpretation

- Do **not** merge the old `6c9b3d06` blindly into current main now.
- Most intended runtime/gate changes appear to have been reimplemented or superseded in later main commits.
- The correct next move is a **small current-main fix lane** for the residual findings below, not resurrecting the old lane wholesale.

---

## 4. Current-main positives

### 4.1 PremiumControls rollout audit passes

After production-like build on current main:

```bash
npm run strangler:build:production-like
npm run audit:premium-controls
```

Result:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

The audit now reports additional checks beyond the earlier 31/31:

```text
✅ floating-cluster-controller.js canonical storage & events OK (PC-005)
✅ floating-cluster.css canonical rules OK (POS-01, speed morph, gb-roman)
✅ /articles/... ARIA / accessibility parity OK
```

### 4.2 Desktop Playwright smoke passes

Routes checked at desktop `1280×900`:

Allowed:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
/articles/krajne-li-isporcheno-serdce/
/articles/dzhon-gill-chast-1-chelovek/
/baptisty-rossii/noch-na-kure/
```

Forbidden:

```text
/karty/
/map/
/konfessii/russkij-baptizm/
/rodosloviye/
```

Desktop result:

```text
/articles/hermenevticheskaya... { embers:1, visibleEmbers:1, panels:1, speedButtons:6, badRadio:0, radiogroups:1 }
/articles/krajne...             { embers:1, visibleEmbers:1, panels:1, speedButtons:6, badRadio:0, radiogroups:1 }
/articles/dzhon-gill-chast-1... { embers:2, visibleEmbers:1, panels:2, speedButtons:12, badRadio:0, radiogroups:2 }
/baptisty-rossii/noch-na-kure/  { embers:1, visibleEmbers:1, panels:1, speedButtons:6, badRadio:0, radiogroups:1 }
/karty/                         { embers:0, saves:0 }
/map/                           { embers:0, saves:0 }
/konfessii/russkij-baptizm/     { embers:0, saves:0 }
/rodosloviye/                   { embers:0, saves:0 }

desktop smoke pass
```

Desktop hover opened the speed panel on allowed sample routes.

### 4.3 Runtime ARIA is better than earlier baseline

Current main controller has:

```js
panel.setAttribute('role', 'radiogroup');
...
aria-checked="..."
```

So the earlier ARIA gap is closed in current main.

---

## 5. New residual findings on current main

## Finding PC-MAIN-01 — `src/lib/asset-version.js` still stale / not wired into guard

**Severity:** P2/P3 architectural drift; not currently user-facing if helper remains unused.  
**Confidence:** high.  

Current main real hashes:

```text
css/floating-cluster.css real=e7feff19
js/floating-cluster-controller.js real=2ea97d46
css/premium-controls.css real=35714e73
```

Current helper still says:

```js
'css/floating-cluster.css': '56994ecc',
'css/premium-controls.css': '35714e73',
'js/floating-cluster-controller.js': 'd77256d1',
```

Manual check:

```text
css/floating-cluster.css real=e7feff19 helperCurrent=false
js/floating-cluster-controller.js real=2ea97d46 helperCurrent=false
css/premium-controls.css real=35714e73 helperCurrent=true
```

### Why this matters

The helper was introduced as part of PC-003, but current main still does not keep it synchronized. If any future PageHead starts using `assetUrl()`, it will emit stale hashes.

### Recommended fix

Either:

1. remove `src/lib/asset-version.js` if it is intentionally unused, **or**
2. restore/sync the helper from the same hash map as `cache-bust.js`, and add an audit check for helper drift.

Turnkey patch pattern from earlier surgical replay:

```js
function syncAssetVersionHelper(hashes) {
  const helperPath = path.join(ROOT, 'src', 'lib', 'asset-version.js');
  if (!fs.existsSync(helperPath)) return false;
  const src = fs.readFileSync(helperPath, 'utf8');
  const body = Object.keys(hashes)
    .filter(asset => hashes[asset])
    .sort()
    .map(asset => `  '${asset}': '${hashes[asset]}',`)
    .join('\n');
  const updated = src.replace(
    /export const ASSET_VERSIONS = \{[\s\S]*?\n\};/,
    `export const ASSET_VERSIONS = {\n${body}\n};`
  );
  if (updated === src) return false;
  if (!DRY_RUN) fs.writeFileSync(helperPath, updated, 'utf8');
  return true;
}
```

---

## Finding PC-MAIN-02 — no `audit:premium-controls:no-build` script on current main

**Severity:** P3 workflow ergonomics.  
**Confidence:** high.  

Current `package.json`:

```text
audit:premium-controls = node scripts/premium-controls-rollout-audit.js
audit:premium-controls:no-build = missing
```

This is not fatal. Later main apparently chose to wire the rollout audit into dist/deploy gates differently. But for agent iteration, a no-build alias is still useful.

### Recommended fix

Add:

```json
"audit:premium-controls:no-build": "node scripts/premium-controls-rollout-audit.js"
```

If `audit:premium-controls` should always build, set it to:

```json
"audit:premium-controls": "npm run strangler:build:production-like && node scripts/premium-controls-rollout-audit.js"
```

Current main uses the script without `--build`, so it assumes `dist/` already exists.

---

## Finding PC-MAIN-03 — mobile controls are invisible / 0×0 on several series-rich families

**Severity:** P0/P1 functional mobile regression candidate.  
**Confidence:** high from Playwright DOM geometry.  
**Browser:** Playwright Chromium mobile emulation, `390×844`, touch enabled.  

### Matrix

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
  embers: visible 36×36 at bottom — OK

/articles/krajne-li-isporcheno-serdce/
  .gb-ember.gbs2-ctl display=inline-grid but rect=0×0 at x=0,y=0 — NOT VISIBLE

/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/
  .gb-ember.gbs2-ctl display=inline-grid but rect=0×0 at x=0,y=0 — NOT VISIBLE

/articles/dzhon-gill-chast-1-chelovek/
  desktop rail ember hidden 0×0, mobile ember visible 34×34 — OK

/articles/dzhon-gill-spravochnik/
  desktop rail ember hidden 0×0, mobile ember visible 34×34 — OK

/baptisty-rossii/noch-na-kure/
  .gb-ember.gbs2-ctl display=grid but rect=0×0 at x=0,y=0 — NOT VISIBLE

/nagornaya/chast-1/
  .gb-ember.nag-sidebar-ember display=inline-block but rect=0×0 at x=0,y=0 — NOT VISIBLE
```

### Repro script

```js
import { chromium } from 'playwright';
const routes = [
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/krajne-li-isporcheno-serdce/',
  '/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/',
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/articles/dzhon-gill-spravochnik/',
  '/baptisty-rossii/noch-na-kure/',
  '/nagornaya/chast-1/'
];
const browser = await chromium.launch({ headless: true });
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:8103' + route, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const embers = Array.from(document.querySelectorAll('.gb-ember')).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        cls: el.className,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      };
    });
    return {
      embers,
      saves: document.querySelectorAll('.gb-save').length,
      roots: document.querySelectorAll('[data-fc-root],[data-fc-controls]').length
    };
  });
  console.log(route, JSON.stringify(data));
  await page.close();
}
await browser.close();
```

### Interpretation

The rollout audit checks that controls exist and are scoped, but it does **not** prove that the controls are visible/tappable on mobile.

This is why `audit:premium-controls` passes while mobile users may still have no reachable Play/Save on:

- Heart series (`Krajne`, `Rimlyanam7`)
- Baptisty series-rich pages
- Nagornaya series-rich pages

Gill v16 is OK because it has a separate mobile bottom bar with a visible mobile ember.

### Recommended guard addition

Add a Playwright-based mobile visibility smoke for the PremiumControls matrix, at least:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/  -> visible ember required
/articles/krajne-li-isporcheno-serdce/                                 -> visible ember required
/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/                  -> visible ember required
/articles/dzhon-gill-chast-1-chelovek/                                  -> visible mobile ember required
/baptisty-rossii/noch-na-kure/                                          -> visible ember required
/nagornaya/chast-1/                                                     -> visible ember required
```

Minimal assertion:

```js
const visible = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.gb-ember')).some(el => {
    const r = el.getBoundingClientRect();
    return r.width >= 30 && r.height >= 30;
  })
);
if (!visible) throw new Error(route + ': no visible/tappable .gb-ember on mobile');
```

### Likely repair direction

For affected non-Gill GBS2 families, either:

1. add a true mobile bottom control bar comparable to Gill v16, **or**
2. make the existing `.gbs2-ctl .gb-ember` live inside a mobile-visible container with explicit dimensions.

Do not just add `display:block`; current geometry shows the element is in a hidden/collapsed branch and becomes `0×0`.

---

## Finding PC-MAIN-04 — current `audit:premium-controls` warns about legacy root copies but passes

Current audit output includes many warnings like:

```text
⚠️ /articles/dzhon-gill-chast-1-chelovek/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/noch-na-kure/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
```

But then passes:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

This is probably intentional: source root legacy copies are not the deploy artifact. But it should be documented in the canonical PremiumControls README so future agents do not waste time “fixing” root legacy files when dist/Astro is the publication truth.

---

## 6. Current-main recommended next surgical lane

Do **not** resurrect old `6c9b3d06` wholesale. Instead create a small current-main lane with only these targets:

```text
lane/system-premiumcontrols-mobile-visibility-2026-06-27
```

Suggested scope:

1. Add mobile Playwright visibility smoke for PremiumControls.
2. Fix mobile `0×0` controls on:
   - `Krajne`
   - `Rimlyanam7`
   - Baptisty series-rich
   - Nagornaya series-rich
3. Decide `src/lib/asset-version.js` fate:
   - remove if unused, or
   - synchronize and guard it.
4. Optionally add `audit:premium-controls:no-build` as a developer convenience alias.

Mandatory checks:

```bash
npm run strangler:build:production-like
npm run audit:premium-controls
node scripts/audit-pro.js
npm run validate:static-publication
# plus new Playwright mobile smoke
```

---

## 7. Final current-main verdict

```text
Desktop PremiumControls: PASS on sampled routes
Forbidden routes: PASS (0 controls)
Rollout audit: PASS (39/39)
Build: PASS
Major residual: mobile visibility 0×0 on non-Gill series-rich families
Secondary residual: stale src/lib/asset-version.js helper
Workflow residual: no audit:premium-controls:no-build alias
```

Current main is significantly more hardened than the earlier baseline, but the mobile visibility finding is real and should be treated as the next user-facing PremiumControls target.
