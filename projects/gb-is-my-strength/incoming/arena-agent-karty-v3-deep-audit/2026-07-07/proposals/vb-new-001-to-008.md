# Proposal: VB-NEW-001 to VB-NEW-008 — 8 new ground-truth findings

**Source:** `incoming/arena-agent-karty-v3-deep-audit/2026-07-07/REPORT.md` §2.2
**Current source HEAD:** `75f807b73`
**Status:** `proposal-confirmed` (ground-truth screenshots, real DOM, real errors)

## What we propose

Add 8 new visual findings to MASTER_BUG_MATRIX, all confirmed by Playwright v3 ground-truth (46 runs, route-specific selectors).

| ID | Severity | Title | File:line |
|----|----------|-------|-----------|
| **VB-NEW-001** | P0 | Bottom timeline shows 7 dots, but 8 stages defined | `karty/avraam/avraam-app.js` (timeline rendering) or `karty/_engine/map-engine.js` (timeline rendering) — owner to investigate which |
| **VB-NEW-002** | P1 | Header timeline dots red, bottom timeline dots multicolor — inconsistent | Same — 2 different renderings of same data |
| **VB-NEW-003** | P1 | Active place marker label is gray, not gold (active state not visually distinct) | `karty/_engine/map-engine.js:1485` (label color logic) or `karty/avraam/avraam-app.js` (label color override) |
| **VB-NEW-004** | P2 | Search input embedded in header between buttons | `karty/avraam/avraam-app.js` (header layout) or `karty/_engine/map-engine.js` (search placement) |
| **VB-NEW-005** | P1 | Panel takes ~30% of screen on desktop | `karty/_engine/map-engine.js` CSS `.me-panel` (line 320+) |
| **VB-NEW-006** | P2 | "Полночный марафон" button — no tooltip, no aria-label, unclear purpose | `karty/avraam/avraam-app.js` (header buttons) |
| **VB-NEW-007** | P2 | "LEGENDA" overlay blocks markers in right area | `karty/_engine/map-engine.js:1302+` (`.me-legend`) |
| **VB-NEW-008** | P2 | Header timeline подписи обрезаны at ~20-25 chars | `karty/avraam/avraam-app.js` (top timeline rendering) |

## Evidence

All confirmed by ground-truth screenshots:
- `evidence/screenshots/avraam-desktop-1920-intro-dismissed.png`
- `evidence/screenshots/avraam-desktop-1920-place-open-2.png`
- `evidence/screenshots/avraam-mobile-iphone14-intro-dismissed.png`
- `evidence/screenshots/avraam-mobile-iphone14-place-open-2.png`
- `evidence/screenshots/ishod-desktop-1920-intro-dismissed.png`
- `evidence/screenshots/ishod-desktop-1920-place-open-2.png`
- `evidence/screenshots/ishod-mobile-iphone14-intro-dismissed.png`
- `evidence/screenshots/ishod-mobile-iphone14-place-open-2.png`

(8 screenshots, ~1.4 MB total)

## Why these matter

- **VB-NEW-001 (P0):** Timeline accuracy is foundational for atlas-grade narrative
- **VB-NEW-002, 003, 005 (P1):** Visual consistency and clarity
- **VB-NEW-004, 006, 007, 008 (P2):** Polish, but visible to users

## Why FAST-safe (propose but don't fix)

These are mostly in `karty/avraam/avraam-app.js` (avraam-specific) or `karty/_engine/map-engine.js` (shared, LANE required). Most need:

- Owner decision on UX direction (VB-NEW-004, VB-NEW-006)
- LANE for engine changes (VB-NEW-001, 002, 003, 005, 007, 008)
- Or avraam-specific lane (VB-NEW-004, 006, 008)

**Recommended:** add to MASTER_BUG_MATRIX for Phase 1/3 work, not for immediate fix.

## Cross-agent note

These were NOT found in `karty-visual-baseline` (5c2f2f7) because:
1. v1 ground-truth used broken selectors (no real state coverage)
2. Visual-baseline author worked from owner-provided screenshots (different angle/zoom)
3. Many of these bugs (especially VB-NEW-001) only visible at specific states (place-open-2)

This is why v3 ground-truth is needed for accurate visual audit.

## Recommendation

1. Verifier adds 8 rows to MASTER_BUG_MATRIX
2. Owner reviews severity (especially VB-NEW-001 — is P0 really P0?)
3. Phase 1 deep audit includes verification of these on more states (all 19 places, all 5 stories)
