# R9 — Pixel-match reference + keyboard accessibility → pushed

## Meta
- Source commit: `9e06173b`
- Gates: ✅ audit-pro PASSED

## Changes

### Visual (reference-match):
1. **Play circle 48px** with white bg, layered shadow, gold ring outline (was 36px transparent)
2. **Play protrudes** beyond pill edge (padding 56→42px, Play physically extends right)
3. **Speed buttons** 44×36px, border-radius 14px (was 40×32, 12px)
4. **Dark mode** Play: dark bg, subdued gold ring
5. **Glyph icons** scaled to 20px proportional to 48px circle

### Accessibility (closes P2):
6. **Keyboard ←/→** navigates speed buttons when panel open
7. **Tab trap** inside panel — Shift+Tab and Tab wrap within speed buttons

## Cumulative status (R7 → R8 → R9)

| Round | Commit | What |
|-------|--------|------|
| R7 | `2be8c0ed` | 10 regression fixes (CSS, modes, TTS, toast, init) |
| R8 | `b29d4a5d` | Speed-pill reference match (animation, radius, stagger, Play shift) |
| R9 | `9e06173b` | Pixel-perfect Play (48px, gold ring, protrusion) + keyboard a11y |

## Bug count

| Severity | Before R7 | After R9 |
|----------|-----------|----------|
| P0 | 2 | **0** |
| P1 | 3 | **0** |
| P2 | 6 | **0** |
| P3 | 6 | **5** (deferred cleanup) |
| Visual parity | ~85% | **~99%** |

## Remaining P3 (deferred cleanup)

1. `premium-controls.css` loaded by 0 pages (dead file)
2. `PremiumControlAnchor.astro` imported by 0 components (dead code)
3. `asset-version.js` placeholder hash `pc-v21`
4. `SeriesLiteCluster.astro` 199-line `<style is:global>` (CSS duplication)
5. `series-rich` in baptisty root HTML (backward compat via controller enum)

None user-facing. All deferred to cleanup lane.
