# Proposal — SD-10 source-verified map-engine/Avraam cluster verdicts on 2273b8c9

- Target: FONT-P1-01, TEXT-P1-01, A11Y-P1-01/02/03, DRAW-P1-01/03, MINI-P1-01, PERF-P1-01
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state (direct source on 2273b8c9):
  - STILL OPEN: FONT-P1-01 (.hw no Hebrew font), TEXT-P1-01 (labelWidth length*0.6), A11Y-P1-02
    (sr-only before map, no skip link), A11Y-P1-03 (rgba(154,162,174,.4) contrast), DRAW-P1-03
    (plain r=4.5 circles), MINI-P1-01 (minimap no geography).
  - FIXED candidate: A11Y-P1-01 (single sr-only h1 + MutationObserver removal on ready).
  - NEED REVERIFY: PERF-P1-01 (feTurbulence present but animated? static?), DRAW-P1-01 (label v2 with
    anchors/leaders supersedes 12px-shift concern).
- Proposed action: verifier keeps still-open rows with fresh witness; close A11Y-P1-01 after browser
  reverify; reverify PERF-P1-01 and DRAW-P1-01. Fold into batched Karty reverify lane (SD-7).
- Evidence: `../evidence/sd10_browser_engine_clusters.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
