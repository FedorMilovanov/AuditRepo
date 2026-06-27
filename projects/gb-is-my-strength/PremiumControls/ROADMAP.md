# PremiumControls — Roadmap PC-001..PC-011

**Base:** PR #19 `e204104` — Phase 1+2 merged  
**Current HEAD:** `7cbd184a` (`lane/premiumcontrols-atomic-ios-2026-06-27` merged to `main`)

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` extraction / adoption | ✅ SOURCE-LANDED (`PremiumControlAnchor.astro` exists + protected by `owner-ui-regression-guard`) |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` wiring | ✅ FIXED on current HEAD (`data-fc-root data-fc-mode="series-lite"` + `floating-cluster.css` links surgically injected) |
| PC-003 | P1 | Source hash drift / asset-version parity | ✅ FIXED (`npm run cache-bust` synced all hashes) |
| PC-004 | P1 | CSS duplicate cleanup / canonical CSS source | ✅ SOURCE-LANDED (`src/styles/premium-controls.css`) / `AGENTS.md` §2 inventory officially reconciled |
| PC-005 | P2 | PlayEmber semantics: canonical key/event/ARIA/reference UI | ✅ MERGED (`fdd446b6` hover-bloom, Russian TTS voice `pickRuVoice`, working pause, `gb:audio:rate` canonical + upward bloom container expansion) |
| PC-006 | P2 | Route-archetype / rollout audit | ✅ SCRIPT EXISTS (`scripts/premium-controls-rollout-audit.js` enhanced with smart Strangler pattern bridging) |
| PC-008 | P1 | Playwright `visual-audit.js` vertical cluster height expectations | ✅ FIXED (expectations split by desktop vs mobile viewports) |
| PC-010 | P2 | Controller god-object decomposition | ⏳ OPEN — turn-key guide available in `TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md` |
| PC-011 | P1 | Gill parts v16 convergence & Spravochnik accurate audit | ✅ FIXED (`b00ca5b6` v16 convergence + Spravochnik accurate 200-word tolerance audit alignment) |

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
