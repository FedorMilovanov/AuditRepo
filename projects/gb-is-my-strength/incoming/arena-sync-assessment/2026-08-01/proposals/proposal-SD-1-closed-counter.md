# Proposal — SD-1 closed-counter row shape (`NEW-68/69`)

- Target: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — `## ✅ ЗАКРЫТО`
- Proposal type: row-shape / ID-naming reconciliation (NOT a counter bug)
- **CORRECTED CONCLUSION (2026-08-01, after running canonical tooling):**
  The closed counter **165 is correct** and consistent with the project's SSOT tool
  `scripts/check_matrix_coverage.py` (356 canonical ids, 191 open => 165 closed canonical).
  My earlier "off-by-one / bump to 166" framing (Option A in the first draft) is **withdrawn**.
- The only real inconsistency: the combined row `NEW-68/69` (slash in ID) represents **two distinct
  fixed bugs** (NEW-68: dist CSP missing `form-action 'self'`; NEW-69: Astro karty routes missing CSP
  meta; both fixed at `14574a9a`), but the slash makes the row invisible to canonical ID counting,
  so neither NEW-68 nor NEW-69 is currently a counted canonical closed ID.
- Proposed action — verifier picks one (each changes the canonical total, so must be intentional):
  - **Option A:** split into two rows `NEW-68` and `NEW-69` -> closed canonical 167, total 358,
    closed counter -> 167.
  - **Option B:** rename to one slash-free canonical ID (e.g. `NEW-CSP-FORM-ACTION`) -> closed
    canonical 166, total 357, closed counter -> 166.
  - **Option C:** leave as-is + one-line note that the slash-ID row is not canonical-counted; no
    counter/total change.
  - Invariant: `closed_canonical == closed_counter == NEXT_AGENT_PROMPT claim`,
    `total_canonical == closed_canonical + open(191)`.
- Evidence:
  - `../evidence/sd1_resolved_canonical.txt`
  - `../evidence/sd1_alias_rows_and_options.txt` (superseded by the resolution above)
  - `../evidence/matrix_row_counts.txt`
- My audited SHA: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
