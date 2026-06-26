# Verifier Synthesis — Deep Verifier Editor — 2026-06-26 (FINAL)

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source HEAD:** `5d53913d` (post v2.1 + izbrannoe + CI fixes)  
**Rounds:** R1 (pre-merge), R2 (post-merge), R3 (speed-pill visual parity)

---

## Current state: v2.1 merged + 3 post-merge commits

PremiumControls v2.1 released. Content corruption fixed. Baptisty SEO fixed. TTS implemented. Speed-pill morphing CSS implemented with 93% visual match to owner reference. 14 of 18 branches deleted.

---

## ALL active findings (comprehensive, deduplicated)

### P1 — FUNCTIONAL (2)

| ID | Title | Fix LOC |
|---|---|---|
| **BUG-R3-01** | `data-fc-mode="series-rich"` (12 routes) not in controller enum → pilot activation skipped | **1 line** |
| **BUG-R3-02** | Heart-series root HTML (`data-fc-controls="gill-rail"`) vs Astro source (`data-fc-root data-fc-mode="series-rich"`) — schism | **~4 lines** |

### P2 — UX / ACCESSIBILITY / CONSISTENCY (5)

| ID | Title | Fix LOC |
|---|---|---|
| **BUG-R3-03** | Toast text "Озвучка ещё не подключена" should be "Браузер не поддерживает озвучку" | **1 line** |
| **BUG-R3-04** | `getStoredRate()` reads `gbx-tts-rate` first, should read `gb:audio:rate` first | **1 line** |
| **BUG-R3-05** | No keyboard ←/→ navigation in speed panel (spec requires it) | **~15 lines** |
| **BUG-R3-06** | No tab trap in speed panel when open (spec requires it) | **~10 lines** |
| **BUG-R3-07** | Rollout audit doesn't enforce mode enum (`series-rich` passes silently) | **5 lines** |

### P3 — DEBT / STYLING (6)

| ID | Title |
|---|---|
| BUG-R3-08 | `premium-controls.css` loaded by 0 pages (dead file) |
| BUG-R3-09 | `PremiumControlAnchor.astro` imported by 0 components (dead code) |
| BUG-R3-10 | `asset-version.js` has placeholder `pc-v21` |
| BUG-R3-11 | `SeriesLiteCluster.astro` still has 199-line `<style is:global>` |
| BUG-R3-12 | Speed-pill animation 380ms vs spec 260ms |
| BUG-R3-13 | Pill padding `5px 48px 5px 8px` vs spec `10px 56px 10px 14px` |

---

## Speed-pill visual parity

**Score: ~93%** (20/27 exact + 5/27 close).

The implementation **matches the owner's reference screenshots** on all major aspects:
- ✅ Gold pill with blur, expanding LEFT from Play circle
- ✅ Active speed = gold gradient fill
- ✅ Staggered cascade animation
- ✅ Mobile: UP morph with viewport guard
- ✅ GBS rail: UP morph  
- ✅ Dark mode variant
- ✅ ARIA attributes
- ✅ TTS with progress ring

Missing for 100%: keyboard ←/→, tab trap, exact animation timing.

---

## Reference screenshots

Now stored in AuditRepo:
- `PremiumControls/screenshots/speed-pill-desktop.png` — owner reference (desktop pill close-up)
- `PremiumControls/screenshots/speed-pill-full-cluster.png` — owner reference (full cluster: theme, search, speed-pill, bookmark)

---

## Quick-fix lane proposal: `lane/premiumcontrols-v21-polish-2026-06-27`

**~23 lines of code, closes all P1 + most P2:**

```javascript
// 1. BUG-R3-01: Add series-rich to controller (line 588)
if (mode === 'series-rich') activateSeriesPilot();

// 2. BUG-R3-03: Fix toast text (line 379)
showToast('Браузер не поддерживает озвучку', false);

// 3. BUG-R3-04: Fix getStoredRate key order (line 268)
r = parseFloat(localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')) || 1;

// 4. BUG-R3-07: Add mode enum to rollout audit
const ALLOWED_MODES = new Set(['single','series-lite','series-rich','nagornaya','gill','disabled','']);
// ... check each route's data-fc-mode against this set
```

Keyboard and tab trap (BUG-R3-05/06) = separate PR, ~25 lines.
