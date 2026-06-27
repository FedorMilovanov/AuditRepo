# PremiumControls — source-repo bug report / repair order (current main 819fd3f1)

**Source repo:** `FedorMilovanov/gb-is-my-strength`
**Audited HEAD:** `819fd3f1`
**Date:** 2026-06-27
**Use:** actionable bug report for agents working in the source repo. This file is intentionally written as implementation-facing repair order, not as historical narrative.

---


## Delta note — source `0159da05`

Source `0159da05` added BUG-032..BUG-036 to `docs/BUGS_FOUND_2026-06-25.md`. Treat those as useful but incomplete:

- BUG-032 repair should require `data-gill-v16` + `gbs-rail`, not only `gbs-rail`.
- BUG-033/034/035 were reproduced by the verifier and need audit-script/UX triage lanes.
- This source docs update did not fix PC-CURRENT-01..05.

Detailed delta report: `PREMIUMCONTROLS_CURRENT_MAIN_0159DA05_DELTA_VERIFIER_2026-06-27.md`.

---


## Delta note — source `87505f1b`

Source `87505f1b` fixed the BUG-032 gate symptom: `dist-publication-audit.js` now expects `gbs-rail`, and full `npm run strangler:audit:production-like` passes. Residual hardening: add `data-gill-v16` to the marker list too.

New verified issue after browser triage:

- **PC-CURRENT-06:** on Gill mobile, tapping the current item in `#seriesTocOverlay` reloads the current page instead of opening `#partTocOverlay`.


### PC-CURRENT-06 event-level detail

Instrumented run shows the existing delegated `seriesToc` click handler does call `preventDefault()` and opens `partToc` briefly, but navigation still occurs because propagation continues:

```text
BUBBLE overlay click ... default=true seriesClass=toc-overlay partClass=toc-overlay is-open
NAV .../articles/dzhon-gill-chast-1-chelovek/
```

So the first repair attempt should add `e.stopPropagation(); return;` to the current-item branch in `initTocPopups()`. If that is insufficient, add a capture-phase current-item handler.


Audit classifications after triage:

- BUG-033 = audit selector drift; add Gill v16 selectors.
- BUG-034 = visual-audit contract decision; either accept v16 no-cover or restore cover.
- BUG-035 = false-positive selector drift; `.gb-theme-toggle` / `[data-fc-action="theme"]` are visible and click toggles theme.

Detailed delta report: `PREMIUMCONTROLS_CURRENT_MAIN_87505F1B_DELTA_TRIAGE_2026-06-27.md`.

---

## Must-fix order

1. `PC-CURRENT-01` — `strangler:audit:production-like` red because `dist-publication-audit.js` expects stale Gill `gbs2-rail` markers.
2. `PC-CURRENT-03` — unversioned PremiumControls CSS/controller refs in Astro-owned dist pages.
3. `PC-CURRENT-02` — `RomanNumeral` not actually used on Gill pages; `gb-roman=0` in dist.
4. `PC-CURRENT-04` — `css/premium-controls.css` inventory drift.
5. `PC-CURRENT-05` — malformed CSS transition declarations.
6. `PC-CURRENT-06` — Gill mobile current series item reloads instead of opening part TOC.

Do not combine all of these in one commit. Each item is a separate small lane.

---

## PC-CURRENT-01 — production-like dist audit expects old Gill markers

**Severity:** P0/P1
**File:** `scripts/dist-publication-audit.js`
**Minimal patch:** change Gill markers from `gbs2-rail` to `data-gill-v16` + `gbs-rail`.

### Exact target snippet

Replace the Gill entries in `visualShadowArticleMarkers` with:

```js
'dzhon-gill-spravochnik': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail'],
'dzhon-gill-istoricheskiy-kontekst': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail'],
'dzhon-gill-chast-1-chelovek': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail'],
'dzhon-gill-chast-2-uchenyi': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail'],
'dzhon-gill-chast-3-nasledie': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail'],
```

### Verification

```bash
npm run strangler:audit:production-like
npm run validate:static-publication
npm run audit:premium-controls:no-build
```

### Warning

Do not raw-merge `origin/lane/system-premiumcontrols-dist-gate-wiring-2026-06-27`. It contains this good patch but is older than current main and can revert newer mobile fallback/package state.

---

## PC-CURRENT-03 — unversioned PremiumControls asset refs

**Severity:** P1/P2
**Files:**

```text
src/components/article-pilots/gill-part1/GillPart1PageHead.astro
src/components/article-pilots/gill-part2/GillPart2PageHead.astro
src/components/article-pilots/gill-part3/GillPart3PageHead.astro
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
src/components/baptisty-rossii/*PageHead.astro
src/components/baptisty-rossii/*Body.astro
scripts/cache-bust.js
scripts/premium-controls-rollout-audit.js
```

### Evidence command

```bash
node - <<'JS'
const fs=require('fs'), path=require('path');
function walk(d,out=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p,out); else if(e.name==='index.html') out.push(p)} return out;}
for(const f of walk('dist')){ const h=fs.readFileSync(f,'utf8'); const route='/'+path.relative('dist',path.dirname(f)).split(path.sep).join('/')+'/'; let a=[]; if(/floating-cluster\.css(?!\?v=)/.test(h)) a.push('unversioned-css'); if(/floating-cluster-controller\.js(?!\?v=)/.test(h)) a.push('unversioned-js'); if(a.length) console.log(`${route}: ${a.join(',')}`); }
JS
```

### Expected current output before fix

```text
/articles/dzhon-gill-chast-1-chelovek/: unversioned-css
/articles/dzhon-gill-chast-2-uchenyi/: unversioned-css
/articles/dzhon-gill-chast-3-nasledie/: unversioned-css
/articles/dzhon-gill-spravochnik/: unversioned-css
/baptisty-rossii/*: unversioned-css,unversioned-js
```

### Repair options

Prefer one of these, not both:

- Import and use `assetUrl()` from `src/lib/asset-version.js`; or
- Add explicit `?v=<hash>` to those refs and enhance `cache-bust.js` to add versions for whitelisted Astro refs.

Then add a fatal check in `premium-controls-rollout-audit.js`:

```text
No built page carrying PremiumControls may contain /css/floating-cluster.css or /js/floating-cluster-controller.js without ?v=<8 hex>.
```

---

## PC-CURRENT-02 — RomanNumeral false-green

**Severity:** P1
**Files:** all five Gill PageChrome components + rollout audit.

### Evidence command

```bash
for p in dzhon-gill-istoricheskiy-kontekst dzhon-gill-chast-1-chelovek dzhon-gill-chast-2-uchenyi dzhon-gill-chast-3-nasledie dzhon-gill-spravochnik; do
  echo "$p gb-roman=$(grep -c gb-roman dist/articles/$p/index.html) raw=$(grep -Eo 'gbs-rail-card__num">[IVX]|toc-(item|part-item)__num">[IVX]' dist/articles/$p/index.html | wc -l)"
done
```

Current output class:

```text
gb-roman=0, raw>0 for every Gill route
```

### Repair

1. Add `import RomanNumeral from '@/components/ui/floating-cluster/RomanNumeral.astro';` or relative import where consistent.
2. Replace raw numeral inner text with `<RomanNumeral value="I" />`, etc.
3. Add CSS only if necessary:

```css
.gbs-rail-card__num .gb-roman,
.toc-item__num .gb-roman,
.toc-part-item__num .gb-roman {
  margin-right: 0;
}
```

4. Make missing `gb-roman` fatal in `premium-controls-rollout-audit.js` for Astro-owned Gill routes.

---

## PC-CURRENT-04 — `css/premium-controls.css` inventory drift

**Severity:** P1/P2
**Files:** `AGENTS.md`, `scripts/cache-bust.js`, `src/styles/premium-controls.css`, optional generated `css/premium-controls.css`.

### Current state

- `AGENTS.md` says 8 CSS files and lists `css/premium-controls.css`.
- Actual `css/` has 7 CSS files and no `css/premium-controls.css`.
- `cache-bust.js --dry-run` warns missing file.

### Safe decision paths

A. Runtime-only truth: remove `css/premium-controls.css` from inventory/cache-bust expectations and document `floating-cluster.css` as runtime canonical.

B. Dual artifact truth: generate/commit `css/premium-controls.css` from `src/styles/premium-controls.css` and add parity guard. Do not load both CSS files on pages.

Do not switch page links to `premium-controls.css` in this lane.

---

## PC-CURRENT-05 — malformed Gill transition CSS

**Severity:** P2
**File:** `css/floating-cluster.css`

### Evidence

```bash
grep -nE '^\[data-gill-v16\] [a-z-]+ ' css/floating-cluster.css
```

Current count: 13 malformed transition fragments.

### Repair

Convert malformed transition blocks to plain property names. Example:

```css
transition:
  background .28s var(--gb-ease-out),
  border-color .28s var(--gb-ease-out),
  transform .32s var(--gb-ease-spring);
```

No geometry/position/sizing changes in this lane.

---

## Final gate set for every lane touching PremiumControls

```bash
node --check js/floating-cluster-controller.js
npm run cache-bust
npm run strangler:build:production-like
npm run audit:premium-controls:no-build
node scripts/premium-mobile-visibility-smoke.js
npm run validate:static-publication
# For Lane 0 and release barriers:
npm run strangler:audit:production-like
```

If Playwright deps are missing in a fresh Arena sandbox:

```bash
npx playwright install chromium
sudo npx playwright install-deps chromium
```
