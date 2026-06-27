# PremiumControls — independent current-main verifier pass (2026-06-27)

**Project:** `gb-is-my-strength` / `gospod-bog.ru`
**Verifier:** Arena agent independent text verifier/editor
**Date:** 2026-06-27
**Source HEAD audited:** `819fd3f1` (`origin/main`)
**AuditRepo purpose:** correct stale PremiumControls truth for new agents; separate live holes from historical/regressed reports.

---

## 0. Executive verdict

PremiumControls is **functionally much healthier than old 2026-06-25 reports imply**, but the current canonical docs are now partially over-optimistic.

Confirmed on `819fd3f1`:

- `npm run validate:static-publication` ✅ PASS.
- `npm run workflows:check` ✅ PASS.
- `node scripts/audit-pro.js` ✅ PASS with one z-index warning class.
- `npm run audit:premium-controls:no-build` ✅ PASS `39/39`, but it is **not strict enough**.
- `node scripts/premium-mobile-visibility-smoke.js` ✅ PASS after the mobile fallback commit.
- `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` ❌ FAILS on current main because the audit still expects legacy Gill markers on pages that are now v16.

Therefore: do not tell new agents “all PremiumControls barriers are 100% green” unless the barrier set explicitly excludes `dist-publication-audit` / `strangler:audit:production-like`. The full production-like dist lane currently needs a small audit-contract repair.

---

## 1. Commands and evidence

Environment used:

```text
Node: v22.23.1 via npx node@22
npm: 10.8.2
Playwright browsers/deps installed in sandbox for mobile smoke
```

### 1.1 Workflow policy

```bash
npm run workflows:check
```

Result:

```text
GB WORKFLOW POLICY CHECK
✅ Workflow policy passed
```

### 1.2 Audit-pro

```bash
node scripts/audit-pro.js
```

Tail result:

```text
── WARNINGS (1) ──
⚠️ Magic z-index numbers (use design tokens):
  - css/mobile-hotfix.css: z-index: 2102 (use --z-* token; see AGENTS-r33)
  - css/floating-cluster.css: z-index: 2102 (use --z-* token; see AGENTS-r33)

✅ AUDIT PASSED — ready for deploy
```

### 1.3 PremiumControls rollout audit

```bash
npm run audit:premium-controls:no-build
```

Result:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

But it logs warnings that are not actually legacy-only in the current source/dist truth:

```text
⚠️ /articles/dzhon-gill-chast-1-chelovek/ (legacy root copy): missing gb-roman class
⚠️ /articles/dzhon-gill-chast-2-uchenyi/ (legacy root copy): missing gb-roman class
⚠️ /articles/dzhon-gill-chast-3-nasledie/ (legacy root copy): missing gb-roman class
⚠️ /articles/dzhon-gill-istoricheskiy-kontekst/ (legacy root copy): missing gb-roman class
⚠️ /articles/dzhon-gill-spravochnik/ (legacy root copy): missing gb-roman class
```

Those pages are Astro-owned dist output and all five currently have `gb-roman=0`. This is a false-green gap in the rollout audit.

### 1.4 Current dist-publication audit failure

Against existing production-like `dist/`:

```bash
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

Result:

```text
exit=1
❌ /articles/dzhon-gill-spravochnik/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-1-chelovek/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-2-uchenyi/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-3-nasledie/ in dist is missing visual-shadow markers: gbs2-rail
❌ dist publication audit failed: 4 issue(s)
```

A temporary local patch changing those expectations to `data-gill-v16` + `gbs-rail` made the full `npm run strangler:audit:production-like` pass. The patch was reverted after verification. This is an audit-contract stale marker bug, not a current Gill runtime regression.

---

## 2. Current Gill truth at `819fd3f1`

Custom dist marker check after production-like build:

```text
dzhon-gill-istoricheskiy-kontekst: v16=3 gbs2Rail=0 gbsRail=31 mobileHead=0 mobileBottom=2 gbRoman=0 rawRailNum=5 rawTocNum=15
dzhon-gill-chast-1-chelovek:      v16=2 gbs2Rail=0 gbsRail=31 mobileHead=0 mobileBottom=1 gbRoman=0 rawRailNum=5 rawTocNum=18
dzhon-gill-chast-2-uchenyi:       v16=2 gbs2Rail=0 gbsRail=31 mobileHead=0 mobileBottom=1 gbRoman=0 rawRailNum=5 rawTocNum=11
dzhon-gill-chast-3-nasledie:      v16=2 gbs2Rail=0 gbsRail=31 mobileHead=0 mobileBottom=1 gbRoman=0 rawRailNum=5 rawTocNum=20
dzhon-gill-spravochnik:           v16=2 gbs2Rail=0 gbsRail=31 mobileHead=0 mobileBottom=1 gbRoman=0 rawRailNum=5 rawTocNum=14
```

Interpretation:

- Older statements saying “Gill context/part1 are v16 while part2/part3/spravochnik remain legacy `gbs2-rail`” are **stale on current head**.
- All five Gill routes are now on v16 layout markers and no longer contain `gbs2-rail`, `gbs2-mobile-head`, or legacy `gbs2Sheet` markers in dist.
- The remaining Gill PremiumControls bug is different: **PC-007 RomanNumeral is not actually wired.**

---

## 3. Confirmed current PremiumControls bugs / holes

## PC-CURRENT-01 — Production-like dist gate red because Gill marker contract is stale

**Severity:** P0/P1 gate blocker
**Files:** `scripts/dist-publication-audit.js`
**Status:** confirmed-current

### Evidence

`node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` fails with 4 Gill marker errors because the audit expects `gbs2-rail` for part pages.

### Root cause

The code still uses old marker expectations:

```js
'dzhon-gill-spravochnik': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'gbs2-rail'],
'dzhon-gill-chast-1-chelovek': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'gbs2-rail'],
...
```

Current v16 truth is:

```js
['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail']
```

### Repair

Apply the minimal patch from remote commit `7cb0f8c7`, not the whole branch.

### Verification

```bash
npm run strangler:audit:production-like
npm run validate:static-publication
npm run audit:premium-controls:no-build
```

---

## PC-CURRENT-02 — PC-007 RomanNumeral integration is false-green

**Severity:** P1
**Files:** `src/components/article-pilots/gill-*/Gill*PageChrome.astro`, `scripts/premium-controls-rollout-audit.js`
**Status:** confirmed-current

### Evidence

All five Gill dist pages have:

```text
gbRoman=0
rawRailNum >= 5
rawTocNum >= 11
```

Source still uses raw numerals like:

```html
<div class="gbs-rail-card__num">I</div>
<div class="toc-item__num">II</div>
<div class="toc-part-item__num">III</div>
```

### Root cause

`RomanNumeral.astro` exists and CSS `.gb-roman` exists, but the Gill PageChrome files do not actually use the component. The rollout audit treats missing `gb-roman` as a warning because its Astro-vs-legacy classifier is too weak.

### Repair

- Import `RomanNumeral` in all five Gill PageChrome files.
- Replace raw numerals with `<RomanNumeral value="I" />` etc.
- If needed, add a tiny CSS containment rule so nested `.gb-roman` does not alter grid spacing:

```css
.gbs-rail-card__num .gb-roman,
.toc-item__num .gb-roman,
.toc-part-item__num .gb-roman {
  margin-right: 0;
}
```

- Harden `premium-controls-rollout-audit.js`: for Astro-owned Gill routes, `gb-roman=0` must be fatal.

---

## PC-CURRENT-03 — PremiumControls asset hashes are still not fully protected

**Severity:** P1/P2
**Files:** Gill PageHead components, Baptisty PageHead/Body components, `scripts/cache-bust.js`, `scripts/premium-controls-rollout-audit.js`
**Status:** confirmed-current

### Evidence

Current `dist/` contains unversioned PremiumControls assets:

```text
/articles/dzhon-gill-chast-1-chelovek/: unversioned-css
/articles/dzhon-gill-chast-2-uchenyi/:  unversioned-css
/articles/dzhon-gill-chast-3-nasledie/: unversioned-css
/articles/dzhon-gill-spravochnik/:      unversioned-css
/baptisty-rossii/*:                     unversioned-css, unversioned-js
```

Source causes include:

```text
src/components/article-pilots/gill-part1/GillPart1PageHead.astro: <link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/*PageHead.astro:                    <link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/*Body.astro:                        <script ... src="../../js/floating-cluster-controller.js"></script>
```

### Root cause

`cache-bust.js` only rewrites already-versioned Astro references. It does not add `?v=` to unversioned Astro-source refs. `src/lib/asset-version.js` is synced but effectively unused by these components.

### Repair options

1. Adopt `assetUrl()` in relevant PageHead/PageChrome components; or
2. Add explicit current `?v=` refs and extend `cache-bust.js` to add versions to whitelisted Astro asset references; plus
3. Add a fatal rollout-audit check for unversioned `floating-cluster.css` / `floating-cluster-controller.js` in dist.

---

## PC-CURRENT-04 — CSS architecture contract drift: `css/premium-controls.css` missing

**Severity:** P1/P2 documentation/architecture drift
**Files:** `AGENTS.md`, `scripts/cache-bust.js`, `src/styles/premium-controls.css`, `css/`
**Status:** confirmed-current

### Evidence

`AGENTS.md` says `css/` has 8 files including `css/premium-controls.css`; actual `css/` has 7 files and no `css/premium-controls.css`.

`cache-bust.js --dry-run` reports:

```text
⚠ css/premium-controls.css: файл не найден, пропускаем
```

### Interpretation

Runtime truth is currently `css/floating-cluster.css`. `src/styles/premium-controls.css` exists as a source/reference subset, but no deployed `css/premium-controls.css` file exists.

### Repair decision needed

- Either declare `floating-cluster.css` the only runtime canonical file and remove `css/premium-controls.css` from inventory/cache-bust expectations; or
- Generate/commit `css/premium-controls.css` and enforce byte parity with `src/styles/premium-controls.css`, but do not load it on pages unless a separate visual freeze is approved.

Do **not** switch pages to `premium-controls.css` casually.

---

## PC-CURRENT-05 — malformed transition declarations in `floating-cluster.css`

**Severity:** P2
**File:** `css/floating-cluster.css`
**Status:** confirmed-current

### Evidence

There are 13 lines like:

```css
[data-gill-v16] background .28s var(--gb-ease-out),[data-gill-v16]
[data-gill-v16] border-color .28s var(--gb-ease-out),[data-gill-v16]
```

inside `transition:` blocks.

### Repair

Replace with normal transition values only:

```css
transition:
  background .28s var(--gb-ease-out),
  border-color .28s var(--gb-ease-out),
  transform .32s var(--gb-ease-spring);
```

Keep this as a tiny syntax lane. Do not adjust positions/sizes in the same lane.

---

## 4. Stale statements that new agents must not follow blindly

### Stale: “Gill parts 2/3/Spravochnik remain legacy gbs2-rail”

Current `819fd3f1` dist says all five Gill routes have `data-gill-v16` and no `gbs2-rail`.

### Stale/over-broad: “Phase 1..3 are 100% atomically closed”

The user-facing functions are mostly fixed, but PC-007 and PC-003 have verified false-green holes.

### Stale/over-broad: “PremiumControls rollout audit is bulletproof”

It passes while missing `gb-roman=0` and unversioned assets in dist.

---

## 5. Safe next repair sequence

1. **Lane 0: dist-publication Gill marker patch**
   - Patch only `scripts/dist-publication-audit.js` marker expectations.
   - Verify `npm run strangler:audit:production-like`.

2. **Lane 1: asset/hash truth**
   - Version all PremiumControls CSS/controller refs or wire `assetUrl()`.
   - Add rollout fatal for unversioned `floating-cluster.css` / controller.

3. **Lane 2: RomanNumeral truth**
   - Replace raw Gill numerals with `RomanNumeral`.
   - Make missing `gb-roman` fatal for Astro-owned Gill routes.

4. **Lane 3: CSS architecture truth**
   - Decide `floating-cluster.css` vs `premium-controls.css` inventory.

5. **Lane 4: CSS syntax cleanup**
   - Fix malformed transitions only.

6. **Lane 5: controller smoke/decomposition**
   - Only after above truth gaps close.

---

## 6. Do-not-do list

- Do not raw-merge `origin/lane/system-premiumcontrols-dist-gate-wiring-2026-06-27`; cherry-pick/manual patch only.
- Do not batch-merge remote lanes.
- Do not touch `.gb-floater--hermeneutics` position in any of these lanes.
- Do not change PlayEmber click semantics; click must remain play/pause.
- Do not write inline `transform` for speed pill; CSS owns geometry, JS only sets `--gb-ember-shift`.
- Do not rename `floating-cluster-controller.js` before all hardcoded refs/hash guards are fixed.
