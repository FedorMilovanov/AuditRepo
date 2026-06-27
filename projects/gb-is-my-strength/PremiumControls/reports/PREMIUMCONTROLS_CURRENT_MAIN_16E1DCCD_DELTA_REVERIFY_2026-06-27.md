# PremiumControls — current-main delta reverify after source HEAD `16e1dccd`

**Project:** `gb-is-my-strength` / `gospod-bog.ru`
**Date:** 2026-06-27
**Previous audited source:** `87505f1b`
**New source HEAD audited:** `16e1dccd` (`chore: auto-update meta, cache-bust [skip ci]` after runtime/a11y fixes)
**Verifier role:** continue current-head audit, update AuditRepo truth after new source commits.

---

## 0. Executive delta

Source `origin/main` advanced from `87505f1b` to `16e1dccd`:

```text
20324465 audit: update runtime checks for Gill v16 and a11y
279fb1cd chore: auto-update meta, cache-bust [skip ci]
3aee1a12 audit: clean up axe accessibility runtime issues
16e1dccd chore: auto-update meta, cache-bust [skip ci]
```

This source wave **fixes several audit-script false positives and runtime/a11y details**, but does not close the remaining PremiumControls contract holes.

Confirmed fixed/green on `16e1dccd`:

- `npm run strangler:audit:production-like` ✅ PASS.
- `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` ✅ PASS.
- `npm run visual-audit` ✅ PASS, 52 pages / 156 screenshots / 0 unsuppressed bugs.
- `npm run interactive-audit` ✅ PASS.
- JS syntax checks for edited runtime/audit scripts ✅ PASS.
- `npm run audit:premium-controls:no-build` ✅ PASS `39/39`.

Still open:

- PC-CURRENT-02 RomanNumeral false-green (`gb-roman=0` on all five Gill routes).
- PC-CURRENT-03 unversioned PremiumControls asset refs in Gill/Baptisty dist.
- PC-CURRENT-04 `css/premium-controls.css` architecture/inventory drift.
- PC-CURRENT-05 malformed transition fragments in `floating-cluster.css`.
- PC-CURRENT-06 Gill mobile current series item still reloads the current page instead of opening part TOC.

---

## 1. Source delta reviewed

### 1.1 `scripts/interactive-audit.js`

The script now understands current PremiumControls / Gill v16 selectors:

- desktop v16 rail: `.gbs-rail`
- current card: `.gbs-rail-card.is-current` / `[aria-current="page"]`
- mobile v16 controls: `.mobile-bottom-bar`, `#mobTocBtn`, `#seriesTocOverlay`, `#partTocOverlay`
- current theme controls: `[data-fc-action="theme"]`, `.gb-theme-toggle`

This closes the earlier audit drift behind BUG-033 and BUG-035.

### 1.2 `scripts/visual-audit.js`

The stale Gill Part 1 cover check was expanded to accept v16 current-card markers:

```js
.gbs-rail-card[aria-current="page"], .gbs-rail-card.is-current
```

This closes the earlier BUG-034 red surface.

### 1.3 `js/floating-cluster-controller.js`

Speed selector radio buttons no longer combine `role="radio"` with `aria-pressed`; they now use `aria-checked`, which is the correct radio semantics.

This is an a11y cleanup, not a fix for the remaining Gill mobile TOC issue.

---

## 2. Commands rerun on `16e1dccd`

### 2.1 Production-like dist gate

```bash
npm run strangler:audit:production-like
```

Result:

```text
exit=0
✅ page ownership check passed
✅ dist publication audit passed
✅ Dist JSON-LD audit passed
PremiumControls rollout audit: 39/39 passed
✅ dist smoke passed
✅ CSS parity audit passed: 52/52 pages carry project CSS.
✅ SW dist readiness audit passed
```

### 2.2 Browser visual audit

```bash
python3 -m http.server 8080 --bind 127.0.0.1 -d dist
npm run visual-audit
```

Result:

```text
VISUAL AUDIT COMPLETE
Pages audited:     52
Screenshots:       156
After suppression: 0
Report: visual-audit-report.json
```

Parsed report:

```json
[]
```

So BUG-034 is closed as audit-contract drift on current source.

### 2.3 Browser interactive audit

```bash
npm run interactive-audit
```

Result:

```text
GB INTERACTIVE AUDIT
✅ Interactive audit passed
```

So BUG-033 and BUG-035 are closed as audit-selector drift on current source.

### 2.4 Syntax and PremiumControls rollout audit

```bash
node --check js/site.js
node --check js/glossary.js
node --check js/floating-cluster-controller.js
node --check scripts/interactive-audit.js
node --check scripts/visual-audit.js
npm run audit:premium-controls:no-build
```

Result:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

---

## 3. Static PremiumControls contract checks after fresh build

### 3.1 RomanNumeral remains missing in built Gill output

```text
dzhon-gill-istoricheskiy-kontekst: v16=3 gbsRail=31 gbRoman=0 raw=20
dzhon-gill-chast-1-chelovek:      v16=2 gbsRail=31 gbRoman=0 raw=23
dzhon-gill-chast-2-uchenyi:       v16=2 gbsRail=31 gbRoman=0 raw=16
dzhon-gill-chast-3-nasledie:      v16=2 gbsRail=31 gbRoman=0 raw=25
dzhon-gill-spravochnik:           v16=2 gbsRail=31 gbRoman=0 raw=19
```

PC-CURRENT-02 remains open.

### 3.2 Unversioned PremiumControls assets remain

```text
/articles/dzhon-gill-chast-1-chelovek/: unversioned-css
/articles/dzhon-gill-chast-2-uchenyi/: unversioned-css
/articles/dzhon-gill-chast-3-nasledie/: unversioned-css
/articles/dzhon-gill-spravochnik/: unversioned-css
/baptisty-rossii/dva-sezda-1884/: unversioned-css,unversioned-js
/baptisty-rossii/goneniya-i-sovest/: unversioned-css,unversioned-js
/baptisty-rossii/: unversioned-css,unversioned-js
/baptisty-rossii/iniciativnaya-gruppa/: unversioned-css,unversioned-js
/baptisty-rossii/noch-na-kure/: unversioned-css,unversioned-js
/baptisty-rossii/peterburgskaya-liniya/: unversioned-css,unversioned-js
/baptisty-rossii/podpolnaya-pechat/: unversioned-css,unversioned-js
/baptisty-rossii/sovetskaya-noch/: unversioned-css,unversioned-js
/baptisty-rossii/spravochnik/: unversioned-css,unversioned-js
/baptisty-rossii/vsehib-1944/: unversioned-css,unversioned-js
/baptisty-rossii/yuzhnaya-shtunda/: unversioned-css,unversioned-js
```

PC-CURRENT-03 remains open.

### 3.3 `css/premium-controls.css` remains absent

Actual `css/` files:

```text
command-palette.css
floating-cluster.css
home.css
mobile-hotfix.css
nagornaya-mobile-toc.css
site-layered.css
site.css
```

`css/premium-controls.css` remains missing while AGENTS/cache-bust still mention it.

PC-CURRENT-04 remains open.

### 3.4 Malformed transition fragments remain

```bash
grep -nE '^\[data-gill-v16\] [a-z-]+ ' css/floating-cluster.css
```

Still finds 13 malformed transition fragments, e.g.:

```text
[data-gill-v16] background .28s var(--gb-ease-out),[data-gill-v16]
[data-gill-v16] border-color .28s var(--gb-ease-out),[data-gill-v16]
```

PC-CURRENT-05 remains open.

---

## 4. PC-CURRENT-06 remains open on `16e1dccd`

Manual Playwright check after fresh build and server:

```text
/articles/dzhon-gill-istoricheskiy-kontekst/
  afterOpen:  series=true, part=false
  afterClick: series=false, part=false, navCount=2

/articles/dzhon-gill-chast-1-chelovek/
  afterOpen:  series=true, part=false
  afterClick: series=false, part=false, navCount=2

/articles/dzhon-gill-chast-2-uchenyi/
  afterOpen:  series=true, part=false
  afterClick: series=false, part=false, navCount=2

/articles/dzhon-gill-chast-3-nasledie/
  afterOpen:  series=true, part=false
  afterClick: series=false, part=false, navCount=2

/articles/dzhon-gill-spravochnik/
  afterOpen:  series=true, part=false
  afterClick: series=false, part=false, navCount=2
```

Meaning:

1. mobile series overlay opens;
2. tapping current series item causes current URL navigation/reload;
3. part overlay does not remain open.

This is not caught by `interactive-audit` after the v16 selector update. The audit verifies presence/opening of series overlay, but does not yet verify current-item → part overlay behavior.

### Recommended next guard

Add a targeted Gill v16 mobile TOC assertion to `interactive-audit.js` or a small dedicated smoke:

```text
for each Gill route:
  click #mobTocBtn
  assert #seriesTocOverlay.is-open
  click #seriesTocOverlay .toc-item.is-current
  assert no navigation
  assert #partTocOverlay.is-open
```

### Recommended code repair

First try in `initTocPopups()`:

```js
if (item.classList.contains('is-current') && partToc) {
  e.preventDefault();
  e.stopPropagation();
  closeOverlay(seriesToc);
  openOverlay(partToc);
  return;
}
```

Prior event-level instrumentation showed the existing delegated handler opens `partToc` briefly, but navigation still occurs. That means propagation must be stopped or a more specific capture handler must be added.

---

## 5. Updated current issue matrix after `16e1dccd`

| ID | Status | Notes |
|---|---|---|
| PC-CURRENT-01 stale `dist-publication-audit` Gill markers | FIXED | Full production-like gate passes. |
| BUG-033 interactive-audit stale Gill selectors | FIXED | `interactive-audit` passes. |
| BUG-034 visual-audit Gill cover red | FIXED / audit drift | `visual-audit` passes. |
| BUG-035 mobile theme visibility | FIXED / false-positive | Current theme selectors added. |
| PC-CURRENT-02 RomanNumeral false-green | OPEN | `gb-roman=0` on all Gill routes. |
| PC-CURRENT-03 unversioned PremiumControls asset refs | OPEN | 15 dist pages still affected. |
| PC-CURRENT-04 `css/premium-controls.css` architecture drift | OPEN | File absent, inventory still mentions it. |
| PC-CURRENT-05 malformed transition declarations | OPEN | 13 malformed CSS fragments remain. |
| PC-CURRENT-06 Gill mobile current item reloads instead of opening part TOC | OPEN | Confirmed after latest source. |

---

## 6. Revised next repair order

1. **PC-CURRENT-06 runtime fix + guard**
   - Add `stopPropagation()/return` or capture listener.
   - Add interactive/mobile smoke assertion.

2. **PC-CURRENT-02 RomanNumeral truth**
   - Replace raw Gill numerals with `RomanNumeral`.
   - Make missing `gb-roman` fatal in rollout audit.

3. **PC-CURRENT-03 asset/hash truth**
   - Version all remaining `floating-cluster.css` / controller refs or route through `assetUrl()`.
   - Make unversioned PremiumControls assets fatal in rollout audit.

4. **PC-CURRENT-04 CSS architecture decision**
   - Decide `floating-cluster.css` only vs generated `css/premium-controls.css` artifact.

5. **PC-CURRENT-05 CSS transition syntax cleanup**
   - Fix malformed transition declarations only.

---

## 7. Do-not-regress reminders

- Do not revert Gill v16 selectors to legacy `gbs2-*` to satisfy old checks.
- Do not treat `interactive-audit` passing as proof that the Gill part overlay flow works; PC-CURRENT-06 is not covered yet.
- Do not call PremiumControls “fully complete” until `gb-roman` and unversioned asset checks are enforced.
- Do not change PlayEmber click semantics while fixing Gill TOC.
