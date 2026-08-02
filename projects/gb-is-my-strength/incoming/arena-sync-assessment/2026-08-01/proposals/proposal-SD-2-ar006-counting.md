# Proposal — SD-2 AR-006 counting semantics

- Target: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — `## 🟣 AUDITREPO` / total open
- Proposal type: status/counter semantics
- Current state: `AR-006` is marked `✅ CLOSED 2026-07-14` but is listed in the open AUDITREPO section
  and is included in the canonical open total (191 = 96+36+51+4+4).
- Confirmed: a full sweep of all sections shows AR-006 is the **only** genuine
  "closed-but-listed-in-open-section" row. Other flagged rows are false positives on wording
  (MAP-P1-19 "крестик закрытия", TTS-DL-NO-TABLOCK "Consent UX закрыт", D-19 partial "половина ЗАКРЫТА").
- Proposed action — decide disposition:
  (a) treat AR-006 as closed and exclude it from the open total (open → 190, AUDITREPO-open → 3), or
  (b) keep it visible in the AUDITREPO section for traceability but exclude it from the open counter,
      with a one-line note explaining the counting rule.
- Evidence:
  - `../evidence/ar006_closed_but_open_section.txt`
  - `../evidence/sd1_alias_rows_and_options.txt` (closed-in-open sweep)
- My audited SHA: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
