# PremiumControls — current-main delta triage after source HEAD `87505f1b`

**Project:** `gb-is-my-strength` / `gospod-bog.ru`
**Date:** 2026-06-27
**Previous delta:** `0159da05`
**New source HEAD audited:** `87505f1b` (`audit: extend verified external checks on main`)
**Verifier role:** continue current-head audit, classify which holes were fixed and which remain.

---

## 0. Executive delta

Source `origin/main` advanced from `0159da05` to `87505f1b`.

This commit **does fix the blocking dist-publication marker bug** from BUG-032 / PC-CURRENT-01:

- `scripts/dist-publication-audit.js` now expects `gbs-rail` for all five Gill v16 routes.
- `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` now passes.
- Full `npm run strangler:audit:production-like` now passes in Arena on Node 22.

However, it does **not** fix the deeper PremiumControls contract holes:

- PC-CURRENT-02 `RomanNumeral` false-green remains (`gb-roman=0` on all five Gill pages).
- PC-CURRENT-03 unversioned `floating-cluster.css` / controller refs remain.
- PC-CURRENT-04 `css/premium-controls.css` inventory drift remains.
- PC-CURRENT-05 malformed transition fragments remain.
- BUG-033/034/035 audit surfaces remain.
- New verified runtime issue: Gill mobile series overlay current item reloads the current page instead of opening the part TOC overlay.

---

## 1. Commands rerun on `87505f1b`

### 1.1 Dist publication audit

```bash
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

Result:

```text
✅ dist publication audit passed
```

### 1.2 Full production-like strangler audit

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

So PC-CURRENT-01 is now **fixed in source** at `87505f1b`.

### 1.3 Important caveat

The fix currently checks only `gbs-rail`, not `data-gill-v16`.

Current marker map:

```js
'dzhon-gill-spravochnik': ['gbs-world', 'data-gbs2-series="dzhon-gill"', 'gbs-rail'],
...
```

This is enough to restore the gate, but the stronger long-term contract should require:

```js
['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail']
```

That residual is now a **hardening improvement**, not a blocking gate bug.

---

## 2. Remaining static PremiumControls holes after `87505f1b`

Custom marker scan after production-like build:

```text
dzhon-gill-istoricheskiy-kontekst: v16=3 gbsRail=31 gbRoman=0 raw=20
dzhon-gill-chast-1-chelovek:      v16=2 gbsRail=31 gbRoman=0 raw=23
dzhon-gill-chast-2-uchenyi:       v16=2 gbsRail=31 gbRoman=0 raw=16
dzhon-gill-chast-3-nasledie:      v16=2 gbsRail=31 gbRoman=0 raw=25
dzhon-gill-spravochnik:           v16=2 gbsRail=31 gbRoman=0 raw=19
```

Unversioned asset scan remains:

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

Therefore:

- PC-CURRENT-02 remains OPEN.
- PC-CURRENT-03 remains OPEN.

---

## 3. Browser triage: BUG-035 mobile theme visibility is an audit-selector false-positive

`interactive-audit.js` reports:

```text
mobile-theme-control-not-visible /articles/dzhon-gill-chast-1-chelovek/
mobile-theme-control-not-visible /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
```

Manual Playwright triage at mobile `390x844` found visible tappable controls:

### Gill Part 1

```json
{
  "selector": ".gb-theme-toggle / [data-fc-action=theme]",
  "class": "gb-icon gb-theme-toggle",
  "w": 40,
  "h": 40,
  "x": 260,
  "y": 794,
  "visible": true,
  "clickToggledTheme": true
}
```

### Hermeneutics

```json
{
  "selector": ".gb-theme-toggle / [data-fc-action=theme]",
  "class": "gb-icon gb-theme-toggle",
  "w": 40,
  "h": 40,
  "x": 114,
  "y": 788,
  "visible": true,
  "clickToggledTheme": true
}
```

Root cause: `interactive-audit.js::visibleThemeHandle()` selector list omits the current PremiumControls selectors:

```js
'.gb-theme-toggle'
'[data-fc-action="theme"]'
```

It only checks older aliases like `.gbs2-mctl[data-gbs2-theme]`, `.theme-toggle`, etc.

**Recommendation:** close BUG-035 as audit-script false-positive after adding current selectors.

---

## 4. Browser triage: Gill v16 desktop/mobile shell is present and visible

Manual Playwright checks at desktop `1366x850` and mobile `390x844`:

For all five Gill routes:

```json
{
  "desktop": {
    "v16": true,
    "gbs2Rail": null,
    "gbsRail": { "w": 240, "h": 504, "display": "flex", "visible": true },
    "current": true,
    "next": true,
    "timeline": true,
    "mobileBottomDisplay": "none"
  },
  "mobile": {
    "bottom": { "w": 370, "h": 40, "display": "flex", "visible": true },
    "tocBtn": { "w": 32, "h": 32, "display": "grid", "visible": true },
    "hasSeriesOverlay": true,
    "hasPartOverlay": true
  }
}
```

Root cause of the 15 Gill `interactive-audit` issues:

- `checkSeries()` still queries only `.gbs2-rail`, `.gbs2-part`, `.gbs2-mobile-head`, `#gbs2Bbar`, `#gbs2Sheet`.
- Gill v16 uses `.gbs-rail`, `.gbs-rail-card.is-current`, `.mobile-bottom-bar`, `#seriesTocOverlay`, `#partTocOverlay`.

**Recommendation:** close the 15 Gill `gbs-*` issues as audit-selector drift once `interactive-audit.js` supports both generations.

---

## 5. New runtime issue: Gill mobile current series item does not open part TOC

**ID:** PC-CURRENT-06
**Severity:** P1/P2 UX regression / mobile navigation bug
**Files:** `js/floating-cluster-controller.js`, Gill v16 PageChrome markup
**Routes:** all five Gill v16 routes
**Status:** confirmed-current

### Expected behavior from controller comment/code

`initTocPopups()` says:

```js
// Click on series item → open Part TOC (for current part) or navigate
if (item.classList.contains('is-current') && partToc) {
  e.preventDefault();
  closeOverlay(seriesToc);
  openOverlay(partToc);
}
```

So on mobile:

1. tap `#mobTocBtn`;
2. series overlay opens;
3. tap current series item;
4. part TOC overlay should open.

### Actual behavior

Manual Playwright trace on `/articles/dzhon-gill-chast-1-chelovek/`:

```text
#mobTocBtn click -> #seriesTocOverlay class = "toc-overlay is-open"
click #seriesTocOverlay .toc-item.is-current -> browser navigates/reloads current URL
#seriesTocOverlay class = "toc-overlay"
#partTocOverlay class = "toc-overlay"
```

Same pattern observed across all five Gill routes in the bulk triage:

```json
"clickRes": {
  "afterMobToc": { "series": true, "part": false },
  "afterCurrent": { "series": false, "part": false }
}
```

### Interpretation

The current item click is behaving like a normal `<a href="./">` navigation. The `seriesToc` delegated click handler is not preventing default or not matching the clicked item in the real event path.

### Suggested repair direction

Do not rewrite the whole popup system. Add a narrow robust binding after `seriesToc` / `partToc` are found:

```js
qsa('#seriesTocOverlay .toc-item.is-current').forEach(function (item) {
  item.addEventListener('click', function (e) {
    if (!partToc) return;
    e.preventDefault();
    e.stopPropagation();
    closeOverlay(seriesToc);
    openOverlay(partToc);
  }, true);
});
```

or debug why the existing delegated listener misses. Use capture only if needed.

### Verification

```bash
# mobile Playwright:
click #mobTocBtn -> series overlay open
click #seriesTocOverlay .toc-item.is-current -> part overlay open, no navigation
Escape/backdrop closes overlay
```

---

## 6. Visual audit status after `87505f1b`

`npm run visual-audit` still reports two blocking HIGH bugs:

```json
{"severity":"HIGH","page":"/articles/dzhon-gill-chast-1-chelovek/","viewport":"mobile","kind":"bio-cover-missing","detail":"bio-cover 16:9 block missing from Gill chast-1 article"}
{"severity":"HIGH","page":"/articles/dzhon-gill-chast-1-chelovek/","viewport":"desktop","kind":"bio-cover-missing","detail":"bio-cover 16:9 block missing from Gill chast-1 article"}
```

The script currently checks:

```js
document.querySelector('.bio-cover, .gbs2-current-cover, .gbs2-mobile-head img')
```

Gill v16 intentionally no longer has `.gbs2-current-cover` / `.gbs2-mobile-head`. Decide one of:

1. audit drift: update the guard to accept v16 markers; or
2. visual regression: restore a cover block if owner requires it.

Do not suppress without that decision.

---

## 7. Updated current issue matrix after `87505f1b`

| ID | Status | Notes |
|---|---|---|
| PC-CURRENT-01 stale `dist-publication-audit` Gill markers | FIXED in source `87505f1b` | Gate passes. Hardening: also require `data-gill-v16`. |
| PC-CURRENT-02 RomanNumeral false-green | OPEN | `gb-roman=0` on all five Gill pages. |
| PC-CURRENT-03 unversioned PremiumControls asset refs | OPEN | Gill/Baptisty unversioned refs remain. |
| PC-CURRENT-04 `css/premium-controls.css` architecture drift | OPEN | No runtime decision yet. |
| PC-CURRENT-05 malformed transition declarations | OPEN | No CSS cleanup yet. |
| PC-CURRENT-06 Gill mobile current series item does not open part TOC | NEW / OPEN | Tapping current item reloads page instead of opening part overlay. |
| BUG-033 interactive-audit stale Gill selectors | CONFIRMED audit drift | Add v16 selectors. |
| BUG-034 visual-audit Gill cover red | CONFIRMED audit surface | Needs owner/audit contract decision. |
| BUG-035 mobile theme visibility | FALSE-POSITIVE after triage | Add `.gb-theme-toggle` / `[data-fc-action="theme"]` selectors. |

---

## 8. Revised next repair sequence

1. **Audit hardening small lane:** add `data-gill-v16` marker to `dist-publication-audit.js` Gill expectations.
2. **Interactive-audit v16 lane:** support `.gbs-rail`, `.gbs-rail-card.is-current`, `.mobile-bottom-bar`, `#seriesTocOverlay`, `#partTocOverlay`, and current theme selectors.
3. **Gill mobile TOC click lane:** fix PC-CURRENT-06 with narrow event binding.
4. **Visual-audit Gill cover decision:** update selector or restore cover.
5. **PremiumControls contract lanes:** asset/hash truth, RomanNumeral truth, CSS architecture, transition cleanup.

---

## 9. Do-not-regress reminders

- Do not revert Gill v16 to `gbs2-rail` to satisfy old audits.
- Do not batch-merge remote lanes.
- Do not edit Hermeneutics positioning in any of the above lanes.
- Do not change PlayEmber click semantics while fixing TOC or audit scripts.
- Do not call BUG-035 real after this triage; the controls are visible and clickable, the audit selector list is stale.
