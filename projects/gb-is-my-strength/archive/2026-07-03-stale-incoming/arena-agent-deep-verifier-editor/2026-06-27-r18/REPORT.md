# R18 — POS-01 + GILL-A fixes pushed

## Source commits
- `f372505f` — POS-01: exact historical .theme-toggle position for Hermeneutics
- `3e477231` — GILL-A: prevent vertical text in gbs2-mobile-head

## Gates: ✅ audit-pro PASSED (Node 22.12.0) | ✅ data:consistency PASSED

## What was done

### POS-01 — Hermeneutics position (CLOSED)
Restored EXACT `.theme-toggle` values from `css/site.css`:
- Desktop: `right: max(8.5vw, env(safe-area-inset-right, 0px))`
- Mobile: `right: max(4.5vw, env(safe-area-inset-right, 0px))`
- Top: `calc(clamp(24px, 3.5vw, 44px) - 4px)`
No self-invented calc formulas.

### GILL-A — Vertical text on mobile (CLOSED)
Added to `css/floating-cluster.css`:
```css
.gbs2-mobile-title { overflow: hidden; }
.gbs2-mobile-title b, .gbs2-mobile-title span {
  white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; max-width: 100%;
}
```
Root cause: 4 control buttons (4×38px+gaps≈170px) squeezed flex:1 title to 0px → vertical letter stacking.

## Remaining from playbook

| Bug | Status | Notes |
|-----|--------|-------|
| POS-01 | ✅ CLOSED | Historical position restored |
| GILL-A | ✅ CLOSED | Overflow fix prevents vertical text |
| GILL-B | ⚠️ MITIGATED | Footer space-between already fixed (R14/R15), but controls may still overflow on very narrow screens — needs B3 |
| GILL-C | 🔲 OPEN | Roman numerals blue (link color) — needs v16 migration |
| GILL-D | 🔲 OPEN | Mobile TOC = legacy gbs2, not v16 — needs B3 |
| GILL-E | 🔲 OPEN | Thumbnails in parts — needs B3 |
| VR-02 | ✅ CLOSED | Gill footer drift box fixed to space-between |
| VR-07 | ✅ CLOSED | gb-rail-foot typo fixed |
| VR-08/B3 | 🔲 OPEN | Gill family unification — HIGH scope, needs owner pilot review |

## Environment
- Node 22.12.0 ✅
- Astro check: timeout in sandbox (needs CI)
- Playwright: not attempted (system deps missing)
