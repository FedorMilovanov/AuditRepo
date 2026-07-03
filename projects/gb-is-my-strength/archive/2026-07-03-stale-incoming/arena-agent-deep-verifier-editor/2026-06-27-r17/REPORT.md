# R17 — POS-01: EXACT historical .theme-toggle position restored

## Source commit: `f372505f`
## Gates: ✅ audit-pro PASSED (Node 22.12.0) | ✅ data:consistency PASSED

## Fix
Restored the EXACT values from `.theme-toggle` in `css/site.css`:
```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}
@media (max-width: 899px) {
  .gb-floater--hermeneutics {
    right: max(4.5vw, env(safe-area-inset-right, 0px));
  }
}
```

Previous self-invented `calc((100vw - min(820px,92vw))/2 - 28px)` REMOVED — it was not the historical value and produced wrong positioning.

## Remaining from playbook
- B3 (Gill family unification) — NOT started yet, requires structural migration
- GILL-A (vertical text mobile) — NOT fixed (needs gbs2-mobile-title overflow fix or B3 migration)
- GILL-D (mobile TOC roman numerals) — legacy gbs2 style, not v16
- GILL-E (thumbnails in parts) — legacy gbs2-thumb, removed by B3
