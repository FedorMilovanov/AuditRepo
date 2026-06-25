# Mobile Audit — 2026-06-25

- **Agent:** arena-agent-mobile-audit
- **Date:** 2026-06-25
- **Audited branch:** main
- **Audited SHA:** `03e01a0008de34d654175ea600cdf9f22b2351b4`
- **Mode:** mobile-focused free-intake
- **Scope:** CSS, layout, touch targets, z-index stacking, viewport, responsive breakpoints, mobile JS

**Reference materials:** 
- `gb-floating-cluster-probe-v16.html` (v16 design intent)
- `Полный план внедрения PremiumControls по всему проекту.pdf`

## Summary

| Finding | Severity | Status |
|---------|----------|--------|
| M-01: `.gbx-tts` z-index (9800) overlaps `.gbs2-bbar` (2000) | P2 | confirmed-current |
| M-02: `.gbs2-ctl` (35px) / `.gbs2-mctl` (38px) undersized for touch | P2 | confirmed-current |
| M-03: `Header.astro` has NO mobile burger menu | P2 | confirmed-current |
| M-04: `.gbs-rail-foot__btn` (32px) undersized on Gill pages | P2 | confirmed-current |
| M-05: `.gb-series-controls .gb-icon` (34px) undersized on mobile | P2 | confirmed-current |
| M-06: `.gb-icon`/`.gb-save` (40px) no `pointer:coarse` override | P3 | disputed |
| M-07: `scroll-padding-top` insufficient for GBS2 sticky header | P3 | confirmed-current |

## Key observations

1. **Systemic touch target issue**: 5 different button classes below 44px WCAG minimum
2. **Header nav inconsistency**: Mobile burger exists in PageChrome but NOT in Header.astro
3. **M-01 extends arena-agent-2's finding**: Blocks entire bottom bar, not just theme buttons
4. **v16 design vs implementation**: Design shows intentional small buttons (32px), gap is in `pointer:coarse` coverage
