# Proposal — SD-7 schedule a batched Karty reverify lane on actual HEAD 2273b8c9

- Target: 65 open Karty-cluster rows witnessed on `32ae0d7d`
- Proposal type: reverify scheduling (data-sync / matrix-freshness; SHA-first)
- Current state: 65 open rows carry witness SHA `32ae0d7d`, which is 607 commits behind actual source
  main `2273b8c9` (live `gh api compare` => ahead_by=607). By SHA-first none is repair-ready on
  current HEAD without a fresh reverify.
- Subset overlap: SD-6 already source-verified the map-engine rows on `2273b8c9`
  (ENGINE-P1-21/22/23/28 fixed; MAP-P1-11, ENGINE-P1-26 open). The remaining ~57 rows are unverified.
- **Supplementary (SD-7b):** 7 additional open rows on other stale SHAs — `2ca2af3` (D-1,
  NEW-VOSK-FETCH-NO-ABORT, AR-AUDIT-17), `21624a3` (AUDIT-CSS-DEAD-KEYFRAMES-TOKENS,
  AUDIT-CSS-GBFLOATER-DUP-MEDIA, AUDIT-JS-ESCAPER-DUP-X5), `30bf3f5c` (NF-DEAD-ENHANCE-SHIM) — 658-1105
  commits behind current main. D-1's indexnow.yml delta does NOT change concurrency, so D-1 stays open.
  Combined stale-witness open surface ≈ **72 rows**. Fold into the same batched reverify lane.
- Proposed action: verifier schedules ONE batched Karty reverify lane on `2273b8c9` (after SD-5
  authority sync), reusing SD-6 dispositions as the map-engine subset. For each row: verified-source /
  verified-browser on current HEAD; close only non-reproducing; keep the rest open with fresh witness.
- Evidence: `../evidence/sd7_stale_karty_witnesses.txt` + `../evidence/sd7_supplementary_stale_witnesses.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
