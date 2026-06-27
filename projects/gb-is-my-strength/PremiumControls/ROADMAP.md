# PremiumControls — Roadmap PC-001..PC-006

**Base:** PR #19 `e204104` — Phase 1+2 merged  
**Current HEAD:** `d5b2460f` (`lane/system-premiumcontrols-reconciliation-2026-06-27` merged to `main`)

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` extraction / adoption | ✅ SOURCE-LANDED (`PremiumControlAnchor.astro` exists) |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` wiring | ✅ FIXED on current HEAD (`data-fc-root data-fc-mode="series-lite"` wired) |
| PC-003 | P1 | Source hash drift / asset-version parity | 🟨 MOSTLY FIXED, keep parity watch |
| PC-004 | P1 | CSS duplicate cleanup / canonical CSS source | ✅ SOURCE-LANDED (`src/styles/premium-controls.css`) / `AGENTS.md` §2 inventory officially reconciled |
| PC-005 | P2 | PlayEmber semantics: canonical key/event/ARIA/reference UI | ✅ MERGED (`fdd446b6` hover-bloom, Russian TTS voice `pickRuVoice`, working pause, `gb:audio:rate` canonical) |
| PC-006 | P2 | Route-archetype / rollout audit | ✅ SCRIPT EXISTS (`scripts/premium-controls-rollout-audit.js`) |
| PC-010 | P2 | Controller god-object decomposition | ⏳ OPEN — planned internal sectional split into 6 strict domains without new `/js/` files |
| PC-011 | P2 | Gill parts v16 convergence | ⏳ HALF-FIXED — `gill-context` and `gill-part1` converged to v16; Parts 2, 3, Spravochnik pending |

---

## PC-002 — Heart-series wiring — P0 — ✅ FIXED

### PC-001 — PremiumControlAnchor — ✅ SOURCE-LANDED

Status: wrapped `gbs2-rfoot` controls with `data-fc-root data-fc-mode="series-lite"`. Play opens speed panel, Save toggles, no dead controls.

---

## PC-005 — PlayEmber semantics — P2 — ✅ MERGED

1. **CSS architecture decision** (PC-004):
   - Option A: Switch all pages to `css/premium-controls.css` as canonical
   - Option B: Merge `premium-controls.css` content INTO `floating-cluster.css` and retire the duplicate
   - Decision needed before next UI lane

- [x] storage canonical: `gb:audio:rate`, read alias `gbx-tts-rate`
- [x] dispatch: `gb:tts-rate-change`
- [x] remove any remaining "Озвучка ещё не подключена" idle toast
- [x] ARIA: `aria-haspopup/aria-expanded/aria-controls` coherent
- [x] Speed morph UI matches `spec/playember-speed-morph.md` (hover-bloom, rubbery expand, sideways on singles, UP on GBS)
- [x] Real Russian TTS voice assigned via `pickRuVoice()` + `u.voice`

---

## PC-003 — Asset hash unification — P1 — 🟨 MOSTLY FIXED

- [x] `src/lib/asset-version.js` helper component exists
- [x] Hardcoded `?v=xxx` removed from PageHead components
- [x] fc-controller / premium-controls.css linked via helper
- [x] `cache-bust.js` = safety net only

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
- [x] `npm run validate:all` / `static-publication` green
- [x] All `[data-fc-action]` clickable site-wide
- [x] `AGENTS.md` Section 3.10 PremiumControls protected status landed

---

Mark done with ✅ when merged to main.

---

## Current-head reverify note (2026-06-27)

This roadmap was originally written against the PR #19 / Phase 1+2 baseline.
Current source HEAD `d5b2460f` has moved substantially beyond that baseline and officially closed PC-001..PC-006.

Remaining active work is now focused on second-order architectural cleanups:
1. **PC-010 Controller decomposition:** internal sectional split of `js/floating-cluster-controller.js` into 6 strict domains.
2. **PC-011 Gill convergence:** replicating `GillPart1PageChrome.astro` v16 standard to Parts 2, 3, and Spravochnik.
