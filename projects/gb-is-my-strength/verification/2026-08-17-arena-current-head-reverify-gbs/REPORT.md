# Current HEAD reverify — gb-is-my-strength — 2026-08-17

## Meta

- Project: `gb-is-my-strength` (gospod-bog.ru)
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current HEAD SHA: `3b6bac3904331176023fb7517f131c8c9360bbc5`
- Current tree/event when relevant: HEAD advanced on 2026-08-18 with `gbs2` wiring + `SeriesArticleLayout` auto-rendering + a `D-19` title-suffix fix.
- Date: 2026-08-17 (verifier local) — Product commit timestamps are 2026-08-18T06:5xZ.
- Verifier: Arena.ai agent (single bounded reverify pass).
- Signal class: Product local/systemic defects + harness coverage gap.
- Semantic owner and overlap check: no open Product PRs exist (`pulls?state=open` → 0), so no collision with another agent's branch. The active Research repair lane `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` is explicitly another agent's owner and was **not** touched here.

> This document re-verifies the **five code-relevant** active MASTER rows against fresh Product `main`. The two control-plane rows (`SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE`, `SYS-MAIN-ADMISSION-ENFORCEMENT`) are governance/external-evidence lanes, not Product code, and are intentionally out of this pass's scope.

## Compared against

- verified ledger: `verified/MASTER_BUG_MATRIX.md` (current `main` snapshot; 7 active units).
- repair order: none open in Product.
- incoming reports reviewed: none new; this is a fresh current-check on stale-stamped rows.

## Status changes

| Work ID | Previous status | Proof state | Current status | W1–W6 evidence used | Claim boundary |
|---|---|---|---|---|---|
| `D-19` | current-local defect | PASS | `closed-by-fix` | W2 source + W6 history (closure commit) | exact `<title>` text in `AntisovetovPageHead.astro` at HEAD `3b6bac3` |
| `A11Y-NO-SCRIPT-ARIA` | narrowed residual | FAIL (reframed) | `confirmed-current` (reframed) | W2 source + W4 runtime-reasoning + W5 lifecycle | `/map` landmark structure at HEAD; the originally-stated "title hidden" mechanism is **invalid**; a different, real mechanism (double `<main>`) is current |
| `HTML-BTN-TYPE` | narrowed residual | UNPROVEN→narrowed | `narrowed-residual` (down-graded) | W2 source + W4 runtime-reasoning | four chrome components at HEAD; the stated "accidental submit" mechanism is **not supported** (no `<form>` in any chrome; buttons are siblings of the slot, not form descendants). No-`type` fact is real but is defensive hardening, not a live defect |
| `AR-IDX-JS-02` | narrowed residual | PASS (broadened) | `confirmed-current` (broadened to systemic) | W2 source + W5 lifecycle/root-cause | three files at HEAD; the residual names `enhancements.js` only, but `site.js` is a **third/fourth writer** of the same `theme` key |
| `D-2` | narrowed residual | PASS | `confirmed-current` | W2 source + W3 artifact/harness + W5 lifecycle | `css-layer-validator.js` + `package.json` at HEAD; validator processes exactly one file; npm script passes only `css/site.css` |

## Buckets

- **fixed-current:** `D-19`
- **still-confirmed (broadened):** `AR-IDX-JS-02` (→ systemic), `D-2`
- **still-confirmed (reframed):** `A11Y-NO-SCRIPT-ARIA` (mechanism corrected)
- **narrowed-residual (down-graded):** `HTML-BTN-TYPE`
- stale-on-current-head: none new
- regression: none
- needs-manual-check: `A11Y-NO-SCRIPT-ARIA` benefits from a real browser/AT pass to confirm the double-`main` landmark effect on screen-reader navigation.

---

## 1. Current local findings

| Finding | Signal class | Proof state | Evidence angles | Current-check anchor | Claim boundary | Suggested lane | Minimum closure proof |
|---|---|---|---|---|---|---|---|
| `A11Y-NO-SCRIPT-ARIA` (reframed: double `<main>` landmark on `/map`) | Product/a11y | PASS (mechanism) | W2 source + W4 + W5 | `AtlasBody.astro:81` (`<main class="atlas-main">`) + `AtlasNoScriptFallback.astro:24` (`<main class="atlas-noscript">`) at HEAD `3b6bac3`; page composes both via `src/pages/map/index.astro` | two `role=main` landmarks in one document | local fix: make the noscript `<main>` a non-landmark (`<section aria-labelledby=...>`) or hide `.atlas-main` entirely in noscript CSS so only one `<main>` is exposed when JS is off | built page inspected; AT/manual landmark-count check on `/map` with JS disabled shows exactly one `main` |
| `HTML-BTN-TYPE` (narrowed) | Product/defensive-hardening | UNPROVEN as a *defect* | W2 + W4 | four chrome components at HEAD; zero `<form>` in any chrome; buttons are siblings of `<slot/>`, not descendants of a form | "accidental submit" requires a form-associated submit button; none exists here | park to `WORK_QUEUE.md` as hardening, or keep as a *narrowed residual* | if kept: explicit statement that this is hardening against future form-in-chrome, not a current defect |
| `D-2` | Product/harness coverage | PASS | W2 + W3 + W5 | `scripts/css-layer-validator.js:133` (single-file `args.find(a => !a.startsWith('--'))`) + `package.json:131` (`... css/site.css --ceiling=200`) at HEAD | `css/home.css` (113 KB) and `css/floating-cluster.css` (236 KB) bypass the @layer/brace/`!important`-ceiling validator despite being shipped CSS | local fix: pass all three files (loop in validator, or call the validator per file in the npm script) | `css:layer:validate` exits green only after all three shipped CSS files are individually validated |
| `AR-IDX-JS-02` (broadened to systemic `SYS-THEME-KEY-MULTIWRITER`) | Product/systemic | PASS | W2 + W5 | `enhancements.js:8`, `reader-preferences.js:187`, `site.js` (≥2 writers) all write `localStorage["theme"]` at HEAD | ≥4 writers of one key across 3 files; no single canonical owner | systemic lane: one canonical theme-key owner; other writers delegate or are removed | one owner; cross-tab `storage` parity preserved; no legacy `"theme"` literal except in the owner |

---

## 2. Systemic root causes

### System root `SYS-THEME-KEY-MULTIWRITER` (proposed; absorbs `AR-IDX-JS-02`)

- **Symptoms absorbed or related:** `AR-IDX-JS-02` (the `enhancements.js` writer); plus two unnamed writers in `site.js` and the canonical writer in `reader-preferences.js`.
- **Shared mechanism:** the `localStorage["theme"]` key has no single owner. `SiteUtils.themeKey === "theme"` (set in `site.js`), so `enhancements.js`'s `SiteUtils.themeKey ? SiteUtils.themeKey : "theme"` fallback and `reader-preferences.js`'s literal `safeSet('theme', …)` all converge on the same key, but each writer independently derives state (toggle current classList vs. explicit dark/light string), independently fires/lacks `theme:changed` and cross-tab `storage` parity, and each can clobber the others.
- **Surface evidence:** toggle the theme via any of (a) `[data-gbs2-theme]` → `enhancements.js`, (b) the chrome `#themeToggle` → `site.js`, (c) the reader-preferences controller; the persisted value and the dispatched event differ across entry points.
- **Mechanism evidence:** source-level — four `setItem`/`safeSet` call sites on key `"theme"`; two independent `storage`-event listeners (`site.js` and `reader-preferences.js:276`) both react to the same key.
- **Lifecycle evidence:** the residual already flagged `enhancements.js` as a straggler keeping a multi-writer surface alive "despite canonical owner in `reader-preferences.js`" — i.e. the class has already returned/lingered because ownership was never actually consolidated.
- **Why local patches are insufficient:** removing only the `enhancements.js` writer leaves `site.js`'s two writers and `reader-preferences.js`'s writer still racing on the same key.
- **Proposed common owner/process/contract:** one canonical theme-state module (the existing `reader-preferences.js` controller is the natural owner); every other caller calls a single `setTheme(dark)` / reads `getTheme()` and does not touch `localStorage["theme"]` or `document.documentElement.classList` directly. Cross-tab parity handled in one place.
- **Representative cases:** `enhancements.js` writer; `site.js` `o(e)` writer; `site.js` inline `SiteUtils.themeKey` writer; `reader-preferences.js` `safeSet('theme', …)`.
- **Exceptions:** none observed.
- **Findings that may close as `absorbed-by-system-fix`:** `AR-IDX-JS-02` becomes a symptom of `SYS-THEME-KEY-MULTIWRITER`; on system closure its row is removed from MASTER.

---

## 3. Duplicate and merge decisions

| Finding | Canonical owner/root | Decision | Reason |
|---|---|---|---|
| `AR-IDX-JS-02` | `SYS-THEME-KEY-MULTIWRITER` (proposed) | **duplicate-symptom → absorb** when system lane lands | the `enhancements.js` writer is one of ≥4 writers of the same key; the residual was already describing the multi-writer root, just under-scoped |
| `A11Y-NO-SCRIPT-ARIA` (original framing) | (none) | **invalid mechanism, keep ID reframed** | the "title hidden/skipped" claim is false at HEAD (`#atlasPageTitle` is server-rendered, not `hidden`, not hidden by noscript CSS); the ID is retained because a *different* real a11y issue (double `<main>`) exists on the same page |
| `HTML-BTN-TYPE` | (none) | **keep-independent, down-grade to hardening** | not a current defect (no form-association path), but a real future-resilience gap |

---

## 4. Stale, invalid and audit-drift

| Finding | Result | Decisive evidence | Historical value retained |
|---|---|---|---|
| `D-19` | **closed-by-fix** | Product commit `79e59b64e9` "fix(seo): restore canonical title suffix (D-19)" (2026-08-18) + HEAD `3b6bac3` shows full `<title>… \| Господь Бог — Сила Моя</title>` | the malformed-suffix symptom stays in Git/`legacy/` if needed; removed from active MASTER |
| `A11Y-NO-SCRIPT-ARIA` (original "title hidden" wording) | **invalid mechanism** | `AtlasBody.astro:20` renders `<h1 id="atlasPageTitle">` server-side; noscript CSS in `AtlasNoScriptFallback.astro` hides only `.atlas-workspace`, `.atlas-search`, `.atlas-topbar__actions` — never the title | the reframed double-`main` finding supersedes it under the same ID |

---

## 5. Parked, accepted, owner decisions

| Finding | Disposition | Reason | Condition to revive |
|---|---|---|---|
| `HTML-BTN-TYPE` | park to `WORK_QUEUE.md` (or keep as narrowed residual) | "accidental submit" mechanism not supported at HEAD; pure hardening | a future `<form>` is introduced as a descendant of these chrome shells, or a slotted page form is structured to capture the chrome buttons |

No new owner decisions required from this pass. The existing `SYS-MAIN-ADMISSION-ENFORCEMENT` owner decision is unchanged and out of scope.

---

## Suggested MASTER update (next consolidation wave)

```text
ACTIVE: 6 work units (was 7)
  CURRENT DEFECTS: 0          (D-19 closed-by-fix; remove row)
  VERIFIED NECESSARY IMPROVEMENTS: 0
  NARROWED RESIDUALS: 2        (HTML-BTN-TYPE down-graded; A11Y-NO-SCRIPT-ARIA reframed)
  SYSTEM VERIFICATION LANES: 2 (SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE unchanged;
                                NEW SYS-THEME-KEY-MULTIWRITER absorbs AR-IDX-JS-02)
  OWNER DECISIONS: 1           (SYS-MAIN-ADMISSION-ENFORCEMENT unchanged)
  + D-2 promoted to confirmed-current (stays a residual until fixed)
```

Rows to retire in the same wave (with one-line `legacy/` stubs only if useful):
- `D-19` → `closed-by-fix` (commit `79e59b64e9`).
- `AR-IDX-JS-02` → `absorbed-by-system-fix` under `SYS-THEME-KEY-MULTIWRITER` once the system lane is the active row.

Rows whose **wording** must change (same IDs retained):
- `A11Y-NO-SCRIPT-ARIA`: replace "title might be hidden/skipped, breaking accessible name" with "double `<main>` landmark on `/map` (`AtlasBody.astro` + `AtlasNoScriptFallback.astro`); one `main` per document."
- `HTML-BTN-TYPE`: relabel from "risking accidental submit behavior" to "defensive hardening; no current form-association path on HEAD `3b6bac3`."

## Evidence files inspected (HEAD `3b6bac3904331176023fb7517f131c8c9360bbc5`)

- `src/components/article-pilots/antisovetov/AntisovetovPageHead.astro`
- `src/components/map/AtlasBody.astro`
- `src/components/map/AtlasNoScriptFallback.astro`
- `src/components/map/AtlasRecovery.astro`
- `src/components/map/MapStyles.astro`
- `src/pages/map/index.astro`
- `src/components/about/AboutPageChrome.astro`
- `src/components/hard-texts/HardTextsPageChrome.astro`
- `src/components/nagornaya/seriya/NagornayaSeriyaPageChrome.astro`
- `src/components/pastor-series/PastorSeriesPageChrome.astro`
- `js/enhancements.js`
- `js/reader-preferences.js`
- `js/site-utils.js`
- `js/site.js`
- `scripts/css-layer-validator.js`
- `package.json`
- `css/site.css`, `css/home.css`, `css/floating-cluster.css` (sizes only)

Product commit history used: `commits?path=…/AntisovetovPageHead.astro` (closure witness `79e59b64e9`).
Open-PR collision check: `pulls?state=open` → 0.
