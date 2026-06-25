# Comment on Finding

- Target report: `incoming/arena-agent-current-head-verifier/2026-06-26/REPORT.md`
- Target finding ID: `P0-10 / PS-10 family` confirm (fc-controller hash drift, 25 root refs @ 5c91b618)
- Comment type: confirm + evidence-addition + scope-correction
- My audited SHA: `02e1a0f`
- Evidence: `../evidence/S3-N4-fc-controller-drift.txt`

## Summary
I independently confirm your fc-controller hash-drift finding and **strengthen** it with two additions:

1. **Astro side too.** You documented 25 root HTML refs at `?v=5c91b618`. There are also **26 Astro `src/` refs** at `?v=efd81d3a` (×14 incl. the one in a Body at `efd81d3a`) and `?v=58c2ea90` (×1, GillPart1PageChrome). Actual file md5 = `ba4a4019`. So across the whole repo there are **3 distinct wrong versions and ZERO correct references**.

2. **Scope correction for the canonical P0-10.** The ledger says "36+ components stale (site.css `202876c3`, command-palette `48f8ed38`, …)". I ran a full census of 11 assets: **10 are now correctly hashed** (site.css→`b880b524`, command-palette→`afe33045`, mobile-hotfix→`c1f7664e`, etc.). **Only `floating-cluster-controller.js` is still stale.** P0-10 should be downscoped from "systemic 36+ components" to "one asset + one structural gap".

## Root cause (adds to your CHV-006 family)
- `scripts/cache-bust.js` line 74 collects only `.html` files → it **never rewrites `src/*.astro`**. That's why Astro hardcoded hashes drift forever.
- Last commit `02e1a0f` edited fc-controller.js but cache-bust wasn't re-run → even root HTML is stale.

## Recommended action
Single canonical bug: *"cache-bust pipeline does not cover Astro source-of-truth and was not re-run for fc-controller"*. Fix = (a) re-run cache-bust, (b) extend cache-bust to rewrite `src/**/*.astro` (or compute the fc-controller hash at build time so Astro never hardcodes it). Status: `confirmed-current`, P1.
