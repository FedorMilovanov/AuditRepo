# Proposal — SD-13 tour/story/a11y verdicts on 2273b8c9

- Target: MAP-P1-01/02/03/13, ASTRO-P1-04
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state (direct source + data on 2273b8c9):
  - STILL OPEN: MAP-P1-03 (shoftim 6 stages, all 12 places stage 0), MAP-P1-01 (tour uses tourStepIdx
    not sid; pre-flyTo before stop), MAP-P1-02 (tour entry keyboard-only Space, no touch affordance),
    MAP-P1-13 (marker dots no role/tabindex).
  - FIXED candidate: ASTRO-P1-04 (story.stages||stage_ids both read; validate checks both).
- Proposed action: verifier keeps still-open rows with fresh witness; close ASTRO-P1-04 with evidence;
  MAP-P1-01/02 recommend browser confirm (browser-class). Fold into SD-7 batched reverify lane.
- Evidence: `../evidence/sd13_tour_a11y.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
