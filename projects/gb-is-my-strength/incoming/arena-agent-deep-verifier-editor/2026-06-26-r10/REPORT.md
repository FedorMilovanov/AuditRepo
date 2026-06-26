# R10 — CSS cleanup + final verification sweep → pushed

## Meta
- Source commit: `8f42c9f8`
- Gates: ✅ audit-pro PASSED

## Changes
1. **Removed redundant `premium-controls.css`** links from 3 cluster components (floating-cluster.css covers everything)
2. **Fixed placeholder hash** `pc-v21` → real md5 `35714e73` in asset-version.js
3. **Removed 199-line `<style is:global>`** from SeriesLiteCluster.astro → single CSS source of truth
4. **Added `fc-series-active`** legacy alias to floating-cluster.css (was only in deleted inline block)
5. **Cache-bust synced**: 23 root HTML + 4 Astro PageHeads

## 11-point verification sweep (all passed)

| Check | Result |
|-------|--------|
| 1. No `<style>` in cluster components | ✅ 0 blocks in all 8 files |
| 2. No `premium-controls.css` links | ✅ 0 |
| 3. All PageHeads have `floating-cluster.css` | ✅ 8/8 |
| 4. Controller hash unified | ✅ 15×`61cb9b7b` |
| 5. Modes correct | ✅ Nagornaya=nagornaya, Heart=series-lite |
| 6. No old toast | ✅ 0 matches |
| 7. `getStoredRate` reads `gb:audio:rate` first | ✅ |
| 8. TTS auto-start present | ✅ |
| 9. Keyboard ←/→ + tab trap | ✅ |
| 10. `fc-series-active` in CSS | ✅ 8 rules |
| 11. No dead controls | ✅ 0 dead |

## Final status after R7-R10

| Severity | Count | Before R7 |
|----------|-------|-----------|
| **P0** | **0** | 2 |
| **P1** | **0** | 3 |
| **P2** | **0** | 6 |
| **P3** | **2** | 6 |
| **Visual parity** | **~99%** | ~85% |

### Remaining P3 (non-user-facing)
1. `premium-controls.css` file exists on disk but loaded by nobody (167 bytes, harmless)
2. `PremiumControlAnchor.astro` exists but imported by nobody (reference artifact for future use)

Both are intentionally kept as reference artifacts, not dead code bugs.

## Summary of all commits pushed (R7-R10)

| Commit | Lines | What |
|--------|-------|------|
| `2be8c0ed` | +49−46 | 10 regression fixes (CSS, modes, TTS, toast, init) |
| `b29d4a5d` | +56−40 | Speed-pill reference match (anim, radius, stagger, shift) |
| `9e06173b` | +108−65 | Pixel-match Play (48px gold ring, protrusion, keyboard a11y) |
| `8f42c9f8` | +39−233 | CSS cleanup (−199 duplication, dead link removal, hash fix) |
| **Total** | **+252 −384** | **Net −132 lines** (cleaner codebase) |
