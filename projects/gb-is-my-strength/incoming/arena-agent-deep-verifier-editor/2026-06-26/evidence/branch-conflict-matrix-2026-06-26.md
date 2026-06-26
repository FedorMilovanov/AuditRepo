# Branch Conflict Matrix — 2026-06-26

**Agent:** arena-agent-deep-verifier-editor  
**Source HEAD:** `09c2d34`  
**Total remote branches:** 18 (excl. `main` and `HEAD`)

---

## Full branch inventory

| # | Branch | Ahead | Behind | Base SHA | Tip SHA | Category |
|---|--------|-------|--------|----------|---------|----------|
| 1 | `lane/premiumcontrols-phase3-2026-06-26` | 3 | 0 | `09c2d34` | `c4de1d42` | **PC canonical** |
| 2 | `lane/system-premiumcontrols-hardening-2026-06-26-arena` | 2 | 0 | `09c2d34` | `e2041042` | PC + BUG-* mega |
| 3 | `lane/premiumcontrols-rollout-audit-2026-06-26` | 2 | 0 | `09c2d34` | `39d1f10b` | PC Phase 0 |
| 4 | `lane/karty-avraam-indexable-text-layer-2026-06-26` | 1 | 0 | `09c2d34` | `afd9cb53` | SEO fix |
| 5 | `lane/system-dist-content-hardening-2026-06-26-arena` | 1 | 0 | `09c2d34` | `3ecc3ddd` | System |
| 6 | `lane/system-migration-metadata-hardening-2026-06-26-arena` | 1 | 0 | `09c2d34` | `22de2668` | System |
| 7 | `lane/baptisty-seo-structured-og-2026-06-26-arena` | 1 | 0 | `09c2d34` | `b8a26c1c` | SEO fix |
| 8 | `lane/integration-monolith-preflight-2026-06-26-arena` | 17 | 0 | `09c2d34` | `51a0bc43` | Mega-branch |
| 9 | `lane/premiumcontrols-heart-series-wiring-2026-06-26` | 1 | 2 | `106f98d` | `099afce4` | **SUPERSEDED** |
| 10 | `lane/premiumcontrols-playember-semantics-2026-06-26` | 2 | 2 | `106f98d` | `71ea9b10` | **SUPERSEDED** |
| 11 | `lane/system-cache-bust-astro-source-2026-06-26` | 1 | 2 | `106f98d` | `e7724a73` | **SUPERSEDED** |
| 12 | `lane/karty-ishod-jsonld-2026-06-26` | 1 | 2 | `106f98d` | `eb6be96a` | **SUPERSEDED** |
| 13 | `lane/content-text-corruption-2026-06-26` | 2 | 2 | `106f98d` | `f5f845cf` | **SUPERSEDED** |
| 14 | `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` | 1 | 2 | `106f98d` | `ff9e33a3` | **POSSIBLY SUPERSEDED** |
| 15 | `lane/audit-svg-pilot-bugs-2026-06-25` | 7 | 16 | `feedf2b2` | `b0d84131` | **STALE** |
| 16 | `lane/baptisty-content-expansion-2026-06-25` | 1 | 12 | `f08e29c2` | `ac78d674` | **STALE** |
| 17 | `lane/system-release-gate-green-2026-06-26` | 0 | 0 | `09c2d34` | `09c2d34` | **MERGED** |

---

## File-level conflict analysis

### `js/floating-cluster-controller.js` — **THE MOST CONTESTED FILE**

Modified by:
- `premiumcontrols-playember-semantics` (+56 lines)
- `system-premiumcontrols-hardening` (+202 lines)
- `premiumcontrols-phase3` (changes exist)

Conflict count (playember × system-hardening): **28 files** changed in both

### `src/components/article-pilots/krajne/KrajneBody.astro`

Modified by:
- `premiumcontrols-heart-series-wiring` (adds `data-fc-mode="series-rich"` — WRONG)
- `premiumcontrols-rollout-audit` (also edits)
- `premiumcontrols-phase3` (adds `data-fc-mode="series-lite"` — CORRECT)
- `system-premiumcontrols-hardening` (also edits)

### `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`

Same 4-way conflict pattern as Krajne.

### Root HTML files (25+ `articles/*/index.html`, `baptisty-rossii/*/index.html`, `nagornaya/*/index.html`)

Modified by:
- `premiumcontrols-playember-semantics` (20+ files — hash updates)
- `system-premiumcontrols-hardening` (30+ files — hash updates + content fixes)
- `premiumcontrols-phase3` (same files)

---

## Recommended merge order

```
1. premiumcontrols-phase3          (3 ahead, 0 behind — FAST FORWARD candidate)
2. karty-avraam-indexable-text     (1 ahead, 0 behind — independent)
3. system-dist-content-hardening   (1 ahead, 0 behind — independent)
4. system-migration-metadata       (1 ahead, 0 behind — independent)
5. baptisty-seo-structured-og      (1 ahead, 0 behind — verify no overlap w/ phase3)

THEN: Extract non-PC fixes from system-premiumcontrols-hardening.
THEN: Audit integration-monolith-preflight for residual unique work.
THEN: Delete 10 superseded/stale branches.
```
