# PremiumControls current-head surgical audit — 2026-06-27

**Project:** `gb-is-my-strength` / `gospod-bog.ru`  
**Source branch audited:** `lane/system-premiumcontrols-guard-cleanup-2026-06-27`  
**Baseline source HEAD before lane:** `251649fc`  
**Lane commits:**

```text
7d172bf2 guard(premiumcontrols): block retired fc state CSS and wire rollout audit
441f22e8 docs(premiumcontrols): record Node22 Playwright self-recheck findings
```

**Audit mode:** current-head source + production-like `dist` + Node 22 + Playwright browser witness.  
**Main conclusion:** broad PremiumControls breakage is stale; current debt is narrower and more dangerous: structural rollout checks pass while some route worlds still fail viewport-level visibility.

---

## Post-push rebase note

After these findings were recorded, `origin/main` in the source repo advanced to `b00ca5b6` (Gill v16 convergence). To avoid PR conflicts, the source lane was reset/rebased onto `origin/main@b00ca5b6` and recommitted as `faf27cb4` with the same low-risk guard/workflow changes. The Playwright residual visibility findings remain valid as a repair playbook category, but the next implementation agent should re-run the provided probe on latest HEAD before editing.

---

## 1. What changed in the source lane

### 1.1 Removed retired `fc-*` state selectors

The runtime controller no longer activates legacy body state classes:

```js
document.body.classList.add('gb-cluster-single-active');
document.body.classList.add('gb-cluster-series-active');
```

Therefore these selectors were dead and misleading:

```css
body.fc-single-active ...
body.fc-series-active ...
```

The lane removed the dead selectors from `css/floating-cluster.css` while preserving the real selectors:

```css
body.gb-cluster-single-active ...
body.gb-cluster-series-active ...
```

**Important:** `data-fc-*` attributes were intentionally preserved. They are still the live controller wiring contract:

```html
data-fc-root
data-fc-controls="gill-rail"
data-fc-action="play"
```

Do **not** rename these attributes until a separate controller migration exists.

### 1.2 Added PC-009 guard

` scripts/premium-controls-rollout-audit.js` now rejects retired body-state selectors in both source and built CSS:

```js
const runtimeCssFiles = [
  path.join(ROOT, 'css', 'floating-cluster.css'),
  path.join(DIST, 'css', 'floating-cluster.css'),
];
const retiredFcStateRe = /body\.fc-(?:single|series)-active\b/;
```

If an agent reintroduces `body.fc-single-active` or `body.fc-series-active`, the PremiumControls rollout audit fails.

### 1.3 Wired rollout audit into production-like gates

New script:

```json
"premium-controls:rollout:audit": "node scripts/premium-controls-rollout-audit.js"
```

`strangler:audit:production-like` now includes:

```bash
npm run dist:css-parity && npm run premium-controls:rollout:audit && npm run sw:dist:audit:pagefind
```

Deploy workflow now also has:

```yaml
- name: PremiumControls rollout audit
  run: npm run premium-controls:rollout:audit
```

### 1.4 Fixed workflow-policy mismatch

`npm run workflows:check` expected `dist:jsonld:audit` to explicitly audit `dist`. The lane changed:

```json
"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js --root dist"
```

This closes the current-head mismatch where `validate:static-publication` could be green while `workflows:check` was red.

---

## 2. Verified green checks

The lane was checked under Node 22. Representative green checks:

```bash
node --check scripts/premium-controls-rollout-audit.js
node --check scripts/dist-jsonld-audit.js
node --check scripts/check-workflows.js
node --check js/floating-cluster-controller.js
node --check sw.js
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

Also run and green:

```bash
npm run strangler:build:production-like
npm run strangler:audit:production-like
npm run validate:static-publication
```

Extended harness result after correcting shell quoting and Pagefind setup:

```text
TOTAL=78
PASS=77
FAIL=1
```

The single fail is the live Playwright visibility finding described below.

---

## 3. Browser witness — real residual debts

Playwright was run against production-like `dist` served locally on representative routes:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
/articles/dzhon-gill-chast-1-chelovek/
/articles/dzhon-gill-istoricheskiy-kontekst/
/articles/kod-da-vinchi/
/baptisty-rossii/noch-na-kure/
/nagornaya/chast-1/
```

Viewports:

```text
desktop 1280×900
mobile  390×844
```

### 3.1 Passing surfaces

- Hermeneutics desktop/mobile: visible `.gb-ember` and `.gb-save`, controller loaded, scope present, no overflow.
- Kod da Vinci desktop/mobile: visible controls, controller loaded, scope present, no overflow.
- Gill context desktop/mobile: visible controls, controller loaded, scope present, no overflow.
- Gill Part I desktop/mobile: duplicate desktop/mobile sets exist, but at least one expected set is visible per viewport; no old `fc-*` body state.

### 3.2 Finding PC-VIS-01 — Nagornaya controls are structurally present but 0×0

**Severity:** P1/P2 boundary  
**Routes sampled:** `/nagornaya/chast-1/`  
**Likely affects:** `/nagornaya/chast-1..5/`  
**Layer:** browser witness / CSS delivery / special route world.

Playwright evidence:

```json
{
  "selector": ".gb-ember.nag-sidebar-ember",
  "display": "inline-block",
  "visibility": "visible",
  "rect": { "w": 0, "h": 0 }
}
```

```json
{
  "selector": ".gb-save.nag-sidebar-save",
  "display": "block",
  "visibility": "visible",
  "rect": { "w": 0, "h": 0 }
}
```

Root-cause direction:

- Nagornaya article pages render PremiumControls markup:

```html
<button class="gb-ember nag-sidebar-ember" data-fc-action="play">...</button>
<button class="gb-save nag-sidebar-save" data-fc-action="save">...</button>
```

- They load `floating-cluster-controller.js`.
- They have `data-fc-root`.
- But they do **not** load `css/floating-cluster.css` or `css/premium-controls.css`.
- Therefore `.gb-ember` / `.gb-save` sizing and visual styles do not apply.

Danger:

A source/dist structural audit says “controls exist and are scoped”, but a user sees no working Play/Save buttons.

Do not apply a blanket global CSS import without testing. Nagornaya is a Tailwind/sidebar exception; broad `floating-cluster.css` hide rules can accidentally hide `#themeToggle`, `#bottomBar`, or other route-specific controls.

### 3.3 Finding PC-VIS-02 — Baptisty mobile Play/Save live only in hidden desktop rail

**Severity:** P1/P2 boundary  
**Route sampled:** `/baptisty-rossii/noch-na-kure/`  
**Likely affects:** 10 Baptisty article routes.  
**Layer:** browser witness / responsive layout / route-world contract.

Mobile Playwright evidence:

```json
{
  "selector": ".gb-ember.gbs2-ctl",
  "display": "grid",
  "rect": { "w": 0, "h": 0 },
  "parent": "aside.gbs2-rail display:none"
}
```

```json
{
  "selector": ".gb-save.gbs2-ctl",
  "display": "grid",
  "rect": { "w": 0, "h": 0 },
  "parent": "aside.gbs2-rail display:none"
}
```

Root-cause direction:

- Desktop rail contains Play/Save.
- On mobile, `.gbs2-rail` is hidden.
- `.gbs2-mobile-head` carries theme/search controls but not Play/Save.
- Result: structural rollout audit passes, mobile user gets no visible Play/Save.

Decision needed:

Either owner explicitly accepts “Baptisty mobile has no Play/Save”, or implementation must add mobile-visible Play/Save in the mobile head / bottom bar / sheet.

Given the PremiumControls rollout language, treat this as live residual debt until owner decides otherwise.

---

## 4. Why the current lane did not fix PC-VIS-01/02

The committed source lane was intentionally low-risk:

- Remove dead CSS selectors.
- Add a guard against their return.
- Wire existing rollout audit into stronger gates.
- Fix workflow-policy mismatch.

PC-VIS-01 and PC-VIS-02 are special-route visual/UX repairs. They can regress Tailwind Nagornaya, GBS2 mobile head, bottom sheets, or theme controls if patched broadly. They require a follow-up lane with Playwright verification.

Recommended follow-up branch:

```text
lane/premiumcontrols-visibility-nagornaya-baptisty-2026-06-27
```

---

## 5. Minimal acceptance criteria for next lane

A correct next implementation must prove:

```text
/nagornaya/chast-1/ desktop: visible Play + Save, no horizontal overflow
/nagornaya/chast-1/ mobile: either visible mobile Play+Save OR explicit no-controls policy encoded
/baptisty-rossii/noch-na-kure/ desktop: visible Play + Save in rail
/baptisty-rossii/noch-na-kure/ mobile: visible Play + Save in mobile UI OR explicit no-controls policy encoded
```

And must keep green:

```bash
npm run premium-controls:rollout:audit
npm run owner:ui-guard
npm run validate:static-publication
npm run strangler:audit:production-like
```

For browser witness, add a Playwright smoke like the one in the playbook file in this folder.

---

## 6. Current operational truth

- The global “PremiumControls are broadly broken everywhere” story is stale.
- Current structural rollout audit is green and now stronger.
- Current remaining risk is **source/dist structural truth diverging from browser-visible truth** on special route worlds.
- The next agent should work surgically on visibility, not rewrite the whole PremiumControls system.
