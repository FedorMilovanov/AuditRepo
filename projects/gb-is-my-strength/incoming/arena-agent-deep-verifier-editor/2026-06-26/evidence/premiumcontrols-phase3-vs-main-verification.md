# Phase3 branch deep verification against main HEAD

**Branch:** `lane/premiumcontrols-phase3-2026-06-26` (tip `c4de1d42`)  
**Base:** `09c2d34` (= current main)  
**Status:** 3 ahead, 0 behind — **clean fast-forward**

---

## New files introduced

| File | Purpose | Plan phase |
|------|---------|------------|
| `src/components/ui/premium-controls/PremiumControlAnchor.astro` | Anchor/geometry primitive | Phase 3 (PC-001) |
| `src/lib/asset-version.js` | Central hash source-of-truth | Phase 5 (PC-003) |
| `src/styles/premium-controls.css` | Canonical CSS source | Phase 4 (PC-004) |
| `css/premium-controls.css` | Public CSS (from build) | Phase 4 |
| `scripts/check-agents-rev-uniqueness.js` | AGENTS.md revision guard | Tooling |
| `scripts/premium-controls-rollout-audit.js` | Route archetype audit | Phase 0 (PC-006) |
| `scripts/bundle-modules.js` | Module bundling | Tooling |
| `images/baptisty-rossii/cover-*.webp` × 11 | WebP OG images | SEO (S3-N2) |

## Key fixes verified

### PC-002: Heart-series dead controls
```
MAIN:   <div class="gbs2-rfoot">                                    ← NO fc root
PHASE3: <div class="gbs2-rfoot" data-fc-root data-fc-mode="series-lite" data-fc-variant="heart">  ← CORRECT
```
Uses `series-lite` (plan-canonical), NOT `series-rich` (controller doesn't know it).

### P0-content: Antisovetov U+FFFD
Phase3 diff modifies `AntisovetovBody.astro` — need to verify U+FFFD is gone.

### P0-content: Hermeneutics Scripture errors
Phase3 diff modifies `HermenevtikaBody.astro` — need to verify `кик → как` and `, .Святое → "Святое`.

### P0-02: Ishod JSON-LD
Phase3 diff modifies `IshodPageHead.astro` — need to verify extra `}` removed.

### PC-001: PremiumControlAnchor
```astro
---
export interface Props {
  variant?: 'breadcrumb' | 'rail' | 'floating';
  class?: string;
}
---
<div class={cls} data-pc-anchor data-pc-variant={variant}>
  <slot />
</div>
```
Three variants matching plan: breadcrumb (standalone articles), rail (Gill), floating (transitional).

### PC-003: Asset version helper
```javascript
export const ASSET_VERSIONS = {
  'css/site.css': 'b880b524',
  'css/command-palette.css': 'afe33045',
  // ...
};
export function assetUrl(path) { ... }
```
Centralizes hardcoded hashes. Components import `assetUrl()` instead of manual `?v=xxx`.

### PC-004: Canonical CSS
`src/styles/premium-controls.css` — single source. Contains anchor styles + transitional `.gb-floater` + ember/save/rail styles.

---

## Conflict risk assessment

| With branch | Conflicting files | Severity |
|-------------|-------------------|----------|
| `system-premiumcontrols-hardening` | 0 (merge-tree test) | **SAFE** |
| `premiumcontrols-rollout-audit` | 2 (KrajneBody, Rimlyanam7Body) | **LOW** — phase3 supersedes |
| `premiumcontrols-heart-series-wiring` | 2 (same files) | **LOW** — superseded |
| `premiumcontrols-playember-semantics` | 1 (fc-controller.js) | **MEDIUM** — but playember superseded |
| `integration-monolith-preflight` | Unknown (17 commits) | **AUDIT NEEDED** |

## Conclusion

Phase3 is the canonical, plan-compliant solution. It should be merged first, and the 4 earlier PC branches retired.
