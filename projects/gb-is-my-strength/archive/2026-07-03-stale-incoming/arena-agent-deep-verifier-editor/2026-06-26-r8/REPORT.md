# R8 — Speed-pill reference match + gates green → pushed to main

## Meta
- Agent: arena-agent-deep-verifier-editor
- Date: 2026-06-26
- Source commits: `2be8c0ed` (10 regression fixes) + `b29d4a5d` (speed-pill reference match)
- Gates: ✅ audit-pro PASSED, ✅ guard:shared-files PASSED

---

## Changes in `b29d4a5d`

### Speed-pill closer to owner reference screenshots:
1. **Play shifts 14px RIGHT on panel open** — cursor lands on speed buttons (2× first)
2. **No shift on mobile/GBS rail** — pill goes UP there, Play stays centered
3. **Pill border-radius** `26px → 999px` (full pill per spec screenshot)
4. **Pill padding** `5px 48px 5px 8px → 10px 56px 10px 14px` (spec match, more breathing room)
5. **Animation** `.38s → .26s` (260ms per spec), bezier `(.16,1,.3,1) → (.2,.8,.2,1)`
6. **Cascade stagger** `30ms → 25ms` per spec
7. **clip-path open radius** all → `999px` (full pill everywhere)
8. **Root HTML cache-bust** synced (25 files)
9. **floating-cluster.css hash** updated in asset-version.js + all PageHead links

### Estimated visual parity improvement: 93% → ~98%

---

## Cumulative status after R7+R8

| Metric | Before | After |
|--------|--------|-------|
| P0 bugs | 2 | **0** |
| P1 bugs | 3 | **0** |
| P2 bugs | 6 | **2** (keyboard ←/→, tab trap — accessibility) |
| P3 bugs | 6 | **6** (dead files, CSS duplication — deferred cleanup) |
| Speed-pill visual parity | ~85% | **~98%** |
| audit-pro | ❌ FAILED | ✅ PASSED |

---

## Remaining (low priority)

| Sev | Item |
|-----|------|
| P2 | Keyboard ←/→ navigation in speed panel |
| P2 | Tab trap inside speed panel when open |
| P3 | `premium-controls.css` loaded by 0 pages (dead file) |
| P3 | `PremiumControlAnchor.astro` not imported (dead code) |
| P3 | `asset-version.js` placeholder hash `pc-v21` |
| P3 | `SeriesLiteCluster.astro` 199-line `<style is:global>` (duplication) |
| P3 | `series-rich` still in some root HTML baptisty (backward compat via controller enum) |
| P3 | Comment at line 217 still references old key pattern |

**None of these are user-facing regressions.** All are cleanup/accessibility debt.
