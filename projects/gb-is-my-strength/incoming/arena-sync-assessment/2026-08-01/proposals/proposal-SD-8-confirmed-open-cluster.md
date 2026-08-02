# Proposal — SD-8 source-verified still-open Karty cluster on 2273b8c9

- Target: Karty P1 rows BASE-P1-01/02, RIVER-P1-01/02/03, QUAL-P1-05 (still open); QUAL-P1-04 (likely fixed); QUAL-P1-06 (partial)
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state: direct source inspection on actual HEAD `2273b8c9` of `map-engine.js` + `base-geo.svg`.
- **Confirmed STILL OPEN (keep open, do not close):** BASE-P1-01 (6 missing IDs in base-geo.svg),
  BASE-P1-02 (opacity 0.5 @ me-base-geo still present), RIVER-P1-02 (waterRipple def absent, 4 uses),
  RIVER-P1-03 (39 stroke-linecap round), QUAL-P1-05 (no passive:true on 5 listeners), RIVER-P1-01 (via root RIVER-P1-02).
- **Likely FIXED (revert-close after browser reverify):** QUAL-P1-04 (single gallery delegation, data.src).
- **Partial (reverify, do not close):** QUAL-P1-06 (timers 58->21 in current file).
- Proposed action: verifier keeps the still-open rows open with a fresh witness on `2273b8c9`; schedule
  browser reverify for QUAL-P1-04; re-audit QUAL-P1-06 timer cleanup. These fold into the batched Karty
  reverify lane (SD-7).
- Evidence: `../evidence/sd8_verified_still_open.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
