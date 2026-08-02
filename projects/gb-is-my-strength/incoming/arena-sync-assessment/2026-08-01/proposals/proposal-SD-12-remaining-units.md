# Proposal — SD-12 remaining Karty unit verdicts on 2273b8c9

- Target: MAP-P1-12, MAP-P1-20, SIG-P1-01, WAYP-P1-01, MEDIA-P1-01, CSS-P1-01, COMP-P1-01, LOD-P1-01
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state (direct source on 2273b8c9):
  - STILL OPEN: MAP-P1-12 (compass in svg translate(50,80)), MAP-P1-20 (sw.js cacheFirst for static,
    unversioned), SIG-P1-01 (hardcoded origin.x-74 offsets), WAYP-P1-01 (.lab-wp small no plate),
    MEDIA-P1-01 (wikimedia external: ishod 22, avraam 76), LOD-P1-01 (partial: z4 1.4px + stroke 2.6px).
  - FIXED candidates: COMP-P1-01 (atlas-reader uses svgR.width/vb[2] real width), CSS-P1-01 (bounded
    me-base-css lease, same root as MAP-P1-14).
- Proposed action: verifier keeps still-open rows with fresh witness; close COMP-P1-01 and CSS-P1-01
  with evidence; ~25 browser/runtime/CI rows (MAP-P1-* browser, AVRAAM-P1-*, GATE-P1-*, LOD) require a
  browser reverify on 2273b8c9 rather than source-only classification. Fold into SD-7 batched lane.
- Evidence: `../evidence/sd12_remaining_units.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
