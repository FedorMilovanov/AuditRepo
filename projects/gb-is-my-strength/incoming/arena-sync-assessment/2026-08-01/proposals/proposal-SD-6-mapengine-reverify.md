# Proposal — SD-6 reverify map-engine cluster on actual HEAD 2273b8c9 (source-verified)

- Target: open Karty/map matrix rows
- Proposal type: reverify scheduling + closure dispositions (data-sync / matrix-freshness; SHA-first)
- Current state: source-verified on actual HEAD `2273b8c9` (map-engine.js @ v0.57.0). PR #709
  (merge `8bd891b13`) plus current engine implement the fixes. Direct source evidence below.
- **Fixed on 2273b8c9 (source-verified) → verifier reverify then close (do not close on PR text alone):**
  - ASTRO-P1-02 (getStageColor normalize)
  - ENGINE-P1-21 (clientPointToView letterbox scale/offset)
  - ENGINE-P1-22 (kmBetween -> distanceKm(cfg.kmPerUnit))
  - ENGINE-P1-23 (circle:nth-child(3) removed)
  - ENGINE-P1-28 (single delegated photo owner, data.src)
  - MAP-P1-14 (bounded me-base-css lease + destroy cleanup)
  - MAP-P1-15 (single measure button, me-ruler-btn gone)
- **Still OPEN on 2273b8c9 (do NOT close):**
  - MAP-P1-11 (scale bar still uses `cfg.W0 / view.w`; real fix + browser reverify needed)
  - ENGINE-P1-26 (no search-outside-story click handler in engine; route-level reverify needed)
- Evidence: `../evidence/sd6_verified_on_2273b8c9.txt` (grep/line references)
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
