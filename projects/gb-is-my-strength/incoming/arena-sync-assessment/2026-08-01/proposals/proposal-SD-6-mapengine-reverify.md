# Proposal — SD-6 schedule reverify of map-engine cluster on actual HEAD 2273b8c9

- Target: open Karty/map matrix rows (see list below)
- Proposal type: reverify scheduling (data-sync / matrix-freshness, NOT a product claim, NOT a closure)
- Current state: source PR #709 ("map-engine runtime P1 normalization", merge 8bd891b13, now in
  actual HEAD 2273b8c9) implements fixes whose source diff directly corresponds to several open rows.
  These rows were witnessed on old SHAs (c2c339708252 / 32ae0d7d) and are candidate fixed-current.
- Candidate rows to reverify on 2273b8c9:
  Direct (diff/PR text): ASTRO-P1-02, ENGINE-P1-22, ENGINE-P1-23, MAP-P1-15, MAP-P1-14.
  Candidate (PR text): ENGINE-P1-21, MAP-P1-11, ENGINE-P1-28, ENGINE-P1-26.
- Proposed action: after SD-5 authority sync records HEAD=2273b8c9, run a fresh reverify of these rows
  on that HEAD (verified-source / verified-browser). Close only those that no longer reproduce;
  keep the rest open with fresh evidence. Do NOT close on PR-description evidence alone.
- Evidence: `../evidence/sd6_mapengine_fixes_candidates.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
