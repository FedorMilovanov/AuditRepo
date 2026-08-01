# Proposal — SD-3 unregistered RIGHT-* evidence IDs

- Target: `projects/gb-is-my-strength/verified/MATRIX_ID_ALIASES.json` (registry) + coverage checker
- Proposal type: evidence/registry reconciliation
- Current state: `scripts/check_matrix_coverage.py` fails-closed with UNREGISTERED-EVIDENCE for
  `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`, both referenced at
  `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md:27`. Neither ID is
  in the matrix or the registry (`aliases`, `ignoredTokens` empty for RIGHT-*).
- Nature of the IDs: **Research rights-decisions** (`RIGHT-*`), part of the Genesis-6 Research
  provenance pinning (Research commit `9bba3d45`, rights for Articles 6-9). Not bugs.
- Proposed action (verifier/implementation agent, per the disposition menu in
  `working/MATRIX_COVERAGE_CONTROL_PLANE_AUDIT_2026-08-01.md` §1): add TWO registry records with
  `status: informational` and a non-empty reason, e.g.:
  `"Research rights-decision identifier pinned by Genesis provenance (Research 9bba3d45), not a bug; kept visible for reverify cross-reference."`
  This clears the UNREGISTERED-EVIDENCE diagnostic without fabricating a bug.
  Do NOT add them to the bug matrix or to `ignoredTokens`.
- Evidence: `../evidence/sd3_unregistered_rights_ids.txt`
- My audited SHA: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
