# Proposal — SD-9 data-layer validation on 2273b8c9

- Target: QUAL-P2-03, QUAL-P1-07, QUAL-P2-02, DATA-P2-01, REG-P1-01
- Proposal type: reverify/triage on actual HEAD (data-sync, SHA-first)
- Current state (direct live-data checks on 2273b8c9):
  - **QUAL-P2-03 → STALE/FIXED candidate:** `/karty/*` routes ARE now in `migration/page-ownership.json`
    (83 routes incl. all 10 karty). Close after reverify.
  - **QUAL-P1-07 → STILL OPEN:** underscore story ids persist (exile_return, first_love, jerusalem_church,
    peter_john, stephen_philip, paul_early).
  - **QUAL-P2-02 → STILL OPEN:** nachalo/route.json still lacks stories / meta.id / meta.era / meta.stats.
  - **DATA-P2-01 → PARTIAL:** avraam now has stages[].paths (8/8), ishod has none (0/6).
  - **REG-P1-01 → STILL OPEN:** shvatim route.json has 13 regions, but map-engine.js ignores route.regions.
- Proposed action: verifier applies these dispositions in the batched Karty reverify lane; keep open rows
  with a fresh witness, close QUAL-P2-03 with evidence.
- Evidence: `../evidence/sd9_data_validation.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
