# Verifier Synthesis — Deep Verifier Editor — 2026-06-26 (UPDATED post-merge)

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source HEAD:** `6c5b83a3` (PremiumControls v2.1 merged)  
**Previous HEAD:** `09c2d34` (pre-merge)

---

## Status: v2.1 MERGED — residual issues found

PremiumControls v2.1 is on main. 14 of 18 branches deleted. Content corruption fixed. Ishod JSON-LD fixed. BreadcrumbList + WebP og:image added. TTS implemented. PremiumControlAnchor + canonical CSS + asset-version.js created.

**BUT:** The merge inherited `series-rich` mode from `integration-monolith-preflight` instead of `series-lite` from `premiumcontrols-phase3`. This is the #1 residual bug.

---

## Active findings (post-merge)

| ID | Sev | Title | ~LOC to fix |
|----|-----|-------|-------------|
| **PC-V21-01** | **P1** | `series-rich` not in controller enum → 12 routes skip pilot activation | 1 line |
| **PC-V21-02** | **P1** | Root HTML (`data-fc-controls="gill-rail"`) vs Astro source (`data-fc-root data-fc-mode="series-rich"`) — two approaches | ~4 lines |
| PC-V21-03 | P2 | Toast "Озвучка ещё не подключена" should be "Браузер не поддерживает озвучку" | 1 line |
| PC-V21-04 | P2 | `getStoredRate()` reads `gbx-tts-rate` first, should read `gb:audio:rate` first | 1 line |
| PC-V21-05 | P2 | CSS triple-source: `floating-cluster.css` (1975L) + `premium-controls.css` (165L, unused) + SeriesLiteCluster `<style is:global>` (199L) | architectural |
| PC-V21-06 | P2 | Rollout audit lacks mode enum validation | 5 lines |
| PC-V21-07 | P3 | `premium-controls.css` loaded by 0 pages — dead file | delete or migrate |
| PC-V21-08 | P3 | `asset-version.js` has placeholder `pc-v21` instead of real hash | 1 line |
| PC-V21-09 | P3 | `PremiumControlAnchor.astro` created but not imported anywhere | dead code |
| PC-V21-10 | P3 | `floating-cluster.css` undefined CSS vars | audit-pro warnings |
| PC-V21-11 | INFO | 4 stale remote branches remain | git cleanup |

---

## What was FIXED since pre-merge

| Before | After |
|--------|-------|
| 5 P0 bugs on main | 0 P0 bugs |
| 18 remote branches | 4 remote branches |
| No PremiumControlAnchor | ✅ Created (unused) |
| No canonical CSS | ✅ Created (unused) |
| No asset-version.js | ✅ Created (working) |
| fc-controller hash drift (3 versions) | ✅ Unified (`f2299253` × 15) |
| Dead controls on heart-series | ✅ Fixed — all `gb-ember` inside scope |
| Baptisty SVG og:image | ✅ WebP |
| Baptisty no BreadcrumbList | ✅ Added |
| Content corruption | ✅ Fixed |
| Ishod JSON-LD invalid | ✅ Fixed |

---

## Recommended quick-fix lane (10 lines total)

```
lane/premiumcontrols-v21-residual-2026-06-27
```

Fixes:
1. `js/floating-cluster-controller.js` line 588: add `if (mode === 'series-rich') activateSeriesPilot();`
2. Same file line 379: change "Озвучка ещё не подключена" → "Браузер не поддерживает озвучку"
3. Same file line 268: change `localStorage.getItem('gbx-tts-rate')` → `localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')`
4. `scripts/premium-controls-rollout-audit.js`: add ALLOWED_MODES enum validation

After these 4 fixes, run:
```bash
npm run validate:all
node scripts/audit-pro.js
node scripts/premium-controls-rollout-audit.js
```

---

## Deferred items (separate lane)

- PC-V21-05: CSS consolidation — requires architectural decision (keep floating-cluster.css vs migrate to premium-controls.css)
- PC-V21-07/08/09: Dead code cleanup — premium-controls.css, PremiumControlAnchor, asset-version placeholder
- PC-V21-02: Root HTML vs Astro source schism — needs owner decision on canonical wiring approach
