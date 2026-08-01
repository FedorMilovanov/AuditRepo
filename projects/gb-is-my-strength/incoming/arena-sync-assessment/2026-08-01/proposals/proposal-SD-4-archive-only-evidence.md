# Proposal — SD-4 archive-only open bug (evidence freshness)

- Target: `AUDIT-P3-OG-LCP-MISMATCH` (open, P3, matrix line 370)
- Proposal type: reverify / evidence-freshness (data-sync lane, NOT a product-bug claim)
- Current state: the only open bug whose evidence is archive-only (2026-07-05) plus a 2026-07-09
  reverify note "needs-live-recheck". No fresh witness on/after 2026-07-09. Current source HEAD is
  `efaf2a51` (2026-08-01), which is not even a production witness.
- Proposed action: verifier/implementation schedules a fresh reverify of
  `AUDIT-P3-OG-LCP-MISMATCH` on current HEAD `efaf2a51` (4 routes: is `og:image` == LCP image now?):
  - if still reproduces -> keep open, add fresh evidence;
  - if fixed -> move to stale/fixed-current with evidence.
  Do NOT close or repair from the archived 2026-07-05 evidence alone.
- Evidence: `../evidence/sd4_archive_only_open_bugs.txt`
- My audited SHA: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
