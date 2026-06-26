# Evidence — integration-monolith-preflight analysis

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Branch:** `lane/integration-monolith-preflight-2026-06-26-arena` (tip `51a0bc43`, 17 ahead, 0 behind)

---

## What it is

This is an **octopus merge** that combines 7 smaller branches into one integration:

1. `content-text-corruption` (CHV-003, CHV-004)
2. `karty-ishod-jsonld` (P0-02)
3. `system-cache-bust-astro-source` (S3-N4/PC-003/P0-10)
4. `baptisty-seo-breadcrumb-ogimage` (S3-N1, S3-N2)
5. `premiumcontrols-heart-series-wiring` (**with `series-rich` — WRONG**)
6. `system-dist-content-hardening`
7. `system-migration-metadata-hardening`

Plus 2 post-merge fixup commits:
- `8b69a633` — converge astro cache-bust after integration
- `51a0bc43` — consolidate baptisty jsonld graph dates

## Problem

This branch merges the **wrong** heart-series implementation (`data-fc-mode="series-rich"` from `099afce4`). The controller doesn't handle `series-rich` — it only knows `single`, `series-lite`, and `nagornaya`. This means heart-series controls are **still half-wired** even after this monolith merge.

## Comparison with phase3

| Feature | monolith-preflight | premiumcontrols-phase3 |
|---------|-------------------|----------------------|
| Heart-series mode | `series-rich` ❌ | `series-lite` ✅ |
| PremiumControlAnchor | ❌ absent | ✅ created |
| asset-version.js | ❌ absent | ✅ created |
| premium-controls.css | ❌ absent | ✅ created |
| rollout-audit script | ❌ absent | ✅ created |
| Content corruption fix | ✅ | ✅ |
| Ishod JSON-LD fix | ✅ | ✅ |
| Baptisty SEO | ✅ | ✅ (WebP covers) |
| TTS implementation | ❌ | ✅ (Web Speech API) |
| Astro cache-bust | ✅ (separate script) | ✅ (asset-version.js) |

## Recommendation

**Do NOT merge monolith-preflight.** Merge `premiumcontrols-phase3` instead — it covers everything monolith does (except the system-cache-bust script approach) AND adds the 3 plan-required primitives AND uses the correct heart-series mode AND includes TTS.

If any unique work exists only in monolith-preflight's post-merge fixups (baptisty jsonld graph dates consolidation), cherry-pick that single commit after phase3 merge.

## Unique content in monolith-preflight (not in phase3)

- `51a0bc43` "consolidate baptisty jsonld graph dates" — likely small JSON-LD date fixup. Verify if phase3 already covers this.
- `system-migration-metadata-hardening` content — also merged separately as its own branch (1 ahead, 0 behind).
- `system-dist-content-hardening` content — also merged separately.

So the monolith is effectively a convenience merge that phase3 supersedes at the PC level.
