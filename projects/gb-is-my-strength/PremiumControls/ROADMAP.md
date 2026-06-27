# PremiumControls — Roadmap PC-001..PC-006

**Base:** PR #19 `e204104` — Phase 1+2 merged
**Last update:** 2026-06-27 — v2.2 CSS sync, controller cleanup
**Current source HEAD:** commit `fdd446b` / `53212c1` (hover-bloom landed)

**Canonical CSS source:** `src/styles/premium-controls.css` v2.2 (8.9KB + hover-bloom)
→ Build copies to → `css/premium-controls.css`
**Actual deployed CSS:** `css/floating-cluster.css` (77.6KB) — contains full PremiumControls styles + site styles

> ⚠️ **CSS DESYNC NOTE:** `css/floating-cluster.css` is the ACTIVE deployed CSS on all pages.
> `css/premium-controls.css` is the canonical extracted subset, NOT connected to pages yet.
> PageHead components link `floating-cluster.css`, not `premium-controls.css`.
> Phase 4 should resolve this by switching pages to canonical CSS or merging the sources.

| ID | Severity | Title | Status |
|---|---|---|---|
| PC-001 | P1 | `PremiumControlAnchor` extraction / adoption | ✅ SOURCE-LANDED / verify rollout completeness |
| PC-002 | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` wiring | ✅ FIXED on current HEAD |
| PC-003 | P1 | Source hash drift / asset-version parity | 🟨 MOSTLY FIXED, keep parity watch |
| PC-004 | P1 | CSS duplicate cleanup / canonical CSS source | 🔶 PARTIALLY RESOLVED — CSS desync active, see note above |
| PC-005 | P2 | PlayEmber semantics: canonical key/event/ARIA/reference UI | ✅ MAJOR FIXES LANDED — hover-bloom (53212c1), TTS, ARIA radio |
| PC-006 | P2 | Route-archetype / rollout audit | ✅ SCRIPT EXISTS; integrate into canonical barrier if desired |

---

## Status Details

### PC-001 — PremiumControlAnchor — ✅ SOURCE-LANDED

- `src/components/ui/premium-controls/PremiumControlAnchor.astro` exists (41 lines)
- Component variants: `breadcrumb`, `rail`, `floating`
- Not yet universally adopted — some pages still use legacy anchoring

### PC-002 — Heart-series wiring — ✅ FIXED

- `KrajneBody.astro` + `Rimlyanam7Body.astro`: `data-fc-root data-fc-mode="series-lite"`
- Controller wires correctly on current HEAD

### PC-003 — Asset hash unification — 🟨 MOSTLY FIXED

- `src/lib/asset-version.js` exists — central ASSET_VERSIONS
- `scripts/cache-bust.js` with Astro support
- Still needs: full migration of all PageHead components to use asset-version.js helper

### PC-004 — CSS duplicate — 🔶 CSS DESYNC ACTIVE (NOT FULLY FIXED)

**Problem:** Two CSS sources for PremiumControls:
1. `css/floating-cluster.css` (77.6KB) — ACTIVE, linked in all PageHead components
2. `css/premium-controls.css` (8.9KB v2.2) — canonical subset, NOT linked to pages

Both sources contain overlapping `.gb-ember`, `.gb-save`, `.gb-ember-wrap`, `.gb-ember-expand`, `.gb-fc-toast` classes.

**What was done (2026-06-27):**
- `src/styles/premium-controls.css` updated to v2.2 — includes hover-bloom CSS from `floating-cluster.css`
- `css/premium-controls.css` synced to same v2.2
- `::before` loading fallback added to v2.2

**What still needs Phase 4:**
- Decision: switch pages to `premium-controls.css` as canonical OR merge styles into `floating-cluster.css`
- Update PageHead components to use the chosen canonical CSS
- Remove duplicate declarations from the non-canonical file

### PC-005 — PlayEmber semantics — ✅ MAJOR FIXES LANDED

- Storage canonical: `gb:audio:rate`, alias `gbx-tts-rate`
- TTS engine: `speechSynthesis`, ru-RU via `pickRuVoice()`, chunk ≤220 chars
- handlePlayClick: real TTS, no dead toast
- ARIA: `aria-haspopup/aria-expanded/aria-controls` coherent, role=radio, aria-checked
- Speed morph: hover-bloom (HOVER_CAPABLE, translateX(4px), scale), keyboard ←/→ + Tab trap
- ✅ commit `53212c1` — hover-bloom speed pill + Russian TTS voice + working pause

### PC-006 — Route audit — ✅ SCRIPT EXISTS

- `scripts/premium-controls-rollout-audit.js` (147 lines)
- Checks: dead controls guard, forbidden routes guard, double CSS invariant
- NOT yet in canonical barrier (`validate:static-publication`)
- Audit script still references `floating-cluster-controller.js` (not `premium-controls-controller.js`)

---

## Phase 4 TODO (unresolved)

1. **CSS architecture decision** (PC-004):
   - Option A: Switch all pages to `css/premium-controls.css` as canonical
   - Option B: Merge `premium-controls.css` content INTO `floating-cluster.css` and retire the duplicate
   - Decision needed before next UI lane

2. **Controller rename** (transitional naming):
   - `floating-cluster-controller.js` → `premium-controls-controller.js` (when Phase 4 is ready)
   - Update audit script (PC-006) to match new filename

3. **GBS2 controls cleanup**:
   - `initGbs2Controls()` (180+ lines) is a SEPARATE system from PremiumControls
   - Consider migrating to `site-modules.js` or dedicated controller

4. **PremiumControls.astro component** (missing from contract):
   - Contract specifies `PremiumControls` component but only `PremiumControlAnchor.astro` exists
   - 7 files in `src/components/ui/floating-cluster/` use old naming

5. **Workflow-policy parity** (not PC-specific but affects release):
   - `npm run workflows:check` is red on current HEAD
   - `dist:jsonld:audit` contract mismatch

6. **ROADMAP this-file sync**:
   - This document was written against PR #19 baseline
   - Updated 2026-06-27 to reflect current HEAD, but needs ongoing maintenance

---

## Phase 3 acceptance (2026-06-26 baseline)

- [x] Krajne / Rimlyanam7 controls alive
- [x] PlayEmber speed morph matches reference screenshots
- [x] `gb:audio:rate` canonical, legacy alias read
- [x] No "Озвучка ещё не подключена" toast anywhere
- [x] Asset hashes unified in source
- [x] `PremiumControlAnchor` exists, CSS canonical
- [x] Route audit script green
- [x] All `[data-fc-action]` clickable site-wide

**Additional (2026-06-27):**
- [x] hover-bloom CSS landed in `floating-cluster.css` (50 lines, commit 53212c1)
- [x] hover-bloom CSS synced to `src/styles/premium-controls.css` v2.2
- [x] Russian TTS voice properly assigned via `pickRuVoice()`
- [x] Stuck pause fixed — ember click now drives `handlePlayClick`
- [x] Controller dead code cleaned (isFavorite removed, saveCurrent param fixed)

---

## Current-head reverify note (2026-06-27)

This roadmap was originally written against the PR #19 / Phase 1+2 baseline.
Current source HEAD moved substantially beyond that baseline.

Verified on current source HEAD:
- `src/components/ui/premium-controls/PremiumControlAnchor.astro` exists ✅
- `scripts/premium-controls-rollout-audit.js` exists ✅
- `KrajneBody.astro` + `Rimlyanam7Body.astro` have `data-fc-root data-fc-mode="series-lite"` ✅
- Controller reads canonical `gb:audio:rate` first, keeps `gbx-tts-rate` fallback ✅
- Controller exposes `aria-controls` / `aria-expanded` wiring ✅
- Hover-bloom CSS present in `css/floating-cluster.css` ✅
- Hover-bloom CSS synced to `src/styles/premium-controls.css` v2.2 ✅
- Old toast "Озвучка ещё не подключена" no longer in TTS path ✅

**Remaining real concerns:**
1. CSS desync — `floating-cluster.css` vs `premium-controls.css` (active, see PC-004)
2. Controller naming still transitional (`floating-cluster-controller.js`)
3. GBS2 controls as separate system not integrated with PremiumControls architecture
4. Workflow-policy mismatch (`workflows:check` red)
5. ROADMAP maintenance lag

**Interpretation:**
PC-001 / PC-002 / PC-004 / PC-005 / PC-006 are no longer safe to describe as simply OPEN.
Remaining real concerns are now mostly architectural/convergence questions, not first-order absence.

Mark done with ✅ when merged to main.
