# Proposal — SD-1 closed counter reconciliation

- Target: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — `## ✅ ЗАКРЫТО`
- Proposal type: counter/status reconciliation
- Current state: header claims `(165)`, statistics `165`, `NEXT_AGENT_PROMPT.md` "165 closed",
  but the closed table physically holds **166** unique ID rows (off-by-one).
- Merged/alias-style rows inside the closed table (4): `AUDIT-P1-CI-GATE-GAP`,
  `AUDIT-PRO-FC-IMPORTANT-GAP`, `BUG-ARCH-001`, `AUDIT-P3-SEARCH-LAZY-CONFIRMED`.
- Proposed action — verifier picks ONE, keeping the invariant
  `closed rows (minus non-counting aliases) == closed counter == NEXT_AGENT_PROMPT claim`:
  - **Option A (recommended, simplest):** treat the closed table as SSOT and reconcile the counter
    upward to **166** — update header `(166)`, statistics `Закрыто (fixed) | 166`, and
    `NEXT_AGENT_PROMPT.md` to "166 closed". Open total is unaffected (stays 191).
  - **Option B:** keep counter 165 and explicitly exempt exactly one merge-alias row
    (e.g. `AUDIT-P1-CI-GATE-GAP`) with a one-line counting rule.
  - **Option C:** any other single-row disposition that satisfies the invariant.
- Evidence:
  - `../evidence/matrix_row_counts.txt`
  - `../evidence/sd1_alias_rows_and_options.txt`
- My audited SHA: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open (awaiting 2nd witness / verifier disposition before any canonical change)
