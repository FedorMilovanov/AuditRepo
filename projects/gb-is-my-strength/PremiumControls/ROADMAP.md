# PremiumControls — Roadmap PC-001..PC-011

**Base:** PR #19 `e204104` — Phase 1+2 merged
**Current HEAD override:** `819fd3f1` independent reverify — previous `7cbd184a`/PR #19 statuses are historical baseline only

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` extraction / adoption | ✅ SOURCE-LANDED (`PremiumControlAnchor.astro` exists + protected by `owner-ui-regression-guard`) |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` wiring | ✅ FIXED on current HEAD (`data-fc-root data-fc-mode="series-lite"` + `floating-cluster.css` links surgically injected) |
| PC-003 | P1 | Source hash drift / asset-version parity | ⚠️ PARTIAL / REOPENED — helper sync exists, but unversioned `floating-cluster.css` / controller refs remain in Astro-owned dist pages |
| PC-004 | P1 | CSS duplicate cleanup / canonical CSS source | ✅ SOURCE-LANDED (`src/styles/premium-controls.css`) / `AGENTS.md` §2 inventory officially reconciled |
| PC-005 | P2 | PlayEmber semantics: canonical key/event/ARIA/reference UI | ✅ MERGED (`fdd446b6` hover-bloom, Russian TTS voice `pickRuVoice`, working pause, `gb:audio:rate` canonical + upward bloom container expansion) |
| PC-006 | P2 | Route-archetype / rollout audit | ⚠️ SCRIPT EXISTS BUT NOT BULLETPROOF — passes while `gb-roman=0` and unversioned PremiumControls assets remain |
| PC-007 | P1 | RomanNumeral integration (`gb-roman`) | ❌ REOPENED — component exists, but all five Gill dist pages have `gb-roman=0` and raw numerals remain |
| PC-008 | P1 | Playwright `visual-audit.js` vertical cluster height expectations | ✅ FIXED (expectations split by desktop vs mobile viewports) |
| PC-010 | P2 | Controller god-object decomposition | ⏳ OPEN — turn-key guide available in `TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md` |
| PC-011 | P1 | Gill parts v16 convergence & Spravochnik accurate audit | ✅ v16 layout markers present on all five Gill pages; ✅ BUG-032 dist-audit marker gate fixed in source `87505f1b`; ⚠️ RomanNumeral/asset audit hardening still open |

---

## Current-main independent reverify override (2026-06-27 / `819fd3f1`)

The table above has been corrected for the live PremiumControls gaps found by the independent verifier pass:

- **PC-003 is not fully closed** until all `floating-cluster.css` / `floating-cluster-controller.js` refs in Astro-owned dist pages are versioned or routed through `assetUrl()`.
- **PC-006 is not bulletproof** until the rollout audit fails on missing `gb-roman` and unversioned PremiumControls assets.
- **PC-007 is reopened** because `RomanNumeral.astro` exists but is not used in Gill PageChrome output (`gb-roman=0`).
- **PC-011 layout convergence is mostly landed**, but release gates are blocked by stale `dist-publication-audit.js` expectations.

Primary evidence: `reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`.

87505f1b delta: `reports/PREMIUMCONTROLS_CURRENT_MAIN_87505F1B_DELTA_TRIAGE_2026-06-27.md` — dist publication gate fixed; PC-CURRENT-06 added.


---

## PC-002 — Heart-series wiring — P0 — ✅ FIXED

Files:
- `src/components/article-pilots/krajne/KrajneBody.astro`
- `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`

Status: wrapped `gbs2-rfoot` controls with `data-fc-root data-fc-mode="series-lite"`. Play opens speed panel, Save toggles, no dead controls.

---

## PC-005 — PlayEmber semantics — P2 — ✅ MERGED

File: `js/floating-cluster-controller.js`

- [x] storage canonical: `gb:audio:rate`, read alias `gbx-tts-rate`
- [x] dispatch: `gb:tts-rate-change`
- [x] remove any remaining "Озвучка ещё не подключена" idle toast
- [x] ARIA: `aria-haspopup/aria-expanded/aria-controls` coherent
- [x] Speed morph UI matches `spec/playember-speed-morph.md` (hover-bloom, rubbery expand, sideways on singles, UP on GBS)
- [x] Real Russian TTS voice assigned via `pickRuVoice()` + `u.voice`
- [x] Bulletproof assertions embedded in `premium-controls-rollout-audit.js`

---

## PC-003 — Asset hash unification — P1 — ✅ FIXED

- [x] `src/lib/asset-version.js` helper component exists
- [x] Hardcoded `?v=xxx` removed from PageHead components
- [x] fc-controller / premium-controls.css linked via helper
- [x] `cache-bust.js` = safety net only
- [x] All hashes verified via `npm run cache-bust`

---

## PC-001 + PC-004 — Anchor + canonical CSS — P1 — ✅ SOURCE-LANDED

- [x] `src/components/ui/premium-controls/PremiumControlAnchor.astro` exists
- [x] `src/styles/premium-controls.css` — single canonical source
- [x] build → `public/css/premium-controls.css`
- [x] `AGENTS.md` Section 2 inventory officially reconciled to 8 CSS / 12 JS + modules
- [x] Desktop single-anchor: control at breadcrumb-level, top delta ≤ 8px
- [x] No viewport-right drift

---

## PC-006 — Route audit — P2 — ✅ SCRIPT EXISTS

- [x] `scripts/premium-controls-rollout-audit.js` exists
- Check:
  - allowed routes have expected root
  - forbidden app/landing routes: 0× `gb-ember` / `gb-save`
  - every `[data-fc-action]` inside `[data-fc-root]` / `[data-fc-controls]`
  - no stale asset hashes
- [x] `package.json`: `"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"`
- [x] CI gate passes

---

## Phase 3 acceptance — ✅ ACHIEVED ON CURRENT HEAD

- [x] Krajne / Rimlyanam7 controls alive
- [x] PlayEmber speed morph matches reference screenshots (premium hover-bloom)
- [x] `gb:audio:rate` canonical, legacy alias read
- [x] No "Озвучка ещё не подключена" toast anywhere
- [x] Asset hashes unified in source
- [x] `PremiumControlAnchor` exists, CSS canonical
- [x] Route audit green
- [x] `npm run validate:all` / `static-publication` green on Node 22 (`v22.12.0`)
- [x] All `[data-fc-action]` clickable site-wide
- [x] `AGENTS.md` Section 3.10 PremiumControls protected status landed

---

Mark done with ✅ when merged to main.

---

## Current-head reverify note (2026-06-27)

This roadmap was originally written against the PR #19 / Phase 1+2 baseline.
Current source HEAD `7cbd184a` has moved substantially beyond that baseline and officially closed PC-001..PC-008, PC-011.

Remaining active work is now focused on second-order architectural cleanups:
1. **PC-010 Controller decomposition:** internal sectional split of `js/floating-cluster-controller.js` into 6 strict domains using `TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md`.
2. **Atomic iOS & Visual Subtleties:** 100% verified on current HEAD via `PREMIUMCONTROLS_ATOMIC_IOS_VISUAL_DEEP_DIVE_2026-06-27.md`.
