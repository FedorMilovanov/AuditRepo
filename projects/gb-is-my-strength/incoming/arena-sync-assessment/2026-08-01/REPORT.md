# Agent Audit Report — data-synchronization / matrix assessment

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength (product); **audited object here = AuditRepo canonical docs**
- Agent: arena-sync-assessment
- Date: 2026-08-01
- Audited branch (AuditRepo): arena/019fbded-auditrepo
- Audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Current HEAD at start/end: source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`; last exact production `abf1edba190280e554dfda085bef9fb6594c896d` (per `NEXT_AGENT_PROMPT.md`)
- Environment: Arena sandbox
- Build mode: source (AuditRepo documents; no product build / browser run)
- Browser / device if used: none

> Purpose: **оценка синхронизации данных, багов и матриц** — проверка, что канон
> (`MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`, `DOC_MAP.md`, `PROJECT_REGISTRY.md`, reverify)
> согласован между собой и внутренне непротиворечив (Single-Writer-Per-Fact, DOC_MAP §1).
> Это governance/data-sync лейн, **не** продукт-баг лейн.

---

## 1. New Findings

### Finding SD-1 — combined slash-ID row `NEW-68/69` in the closed table (RESOLVED: not a counter bug)
- **Category:** AUDITREPO / data-sync (row-shape / ID-naming, not a product bug)
- **Title:** closed table physically holds 166 rows, but the canonical closed counter 165 is
  **correct**; the extra row `NEW-68/69` is invisible to canonical ID counting because of the `/`.
- **Severity:** P3 (cosmetic/ID-shape; **corrected down from the initial P2 "counter drift" framing**)
- **File(s):** `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` closed row `NEW-68/69` (line 130).
- **Evidence:** `evidence/sd1_resolved_canonical.txt` + `evidence/matrix_row_counts.txt`.
- **Analysis:** the project SSOT tool `scripts/check_matrix_coverage.py` reports
  `356 canonical ids, 191 open rows` => 165 closed canonical, which **matches** the claimed counter.
  `UPPER_ID_RE` = `^[A-Z0-9]+(?:-[A-Z0-9]+)+$` rejects the slash, so `NEW-68/69` is not counted.
  `NEW-68` (dist CSP missing `form-action 'self'`) and `NEW-69` (Astro karty routes missing CSP meta)
  are two distinct bugs, both fixed at `14574a9a`, combined into one slash-ID row.
- **Expected:** every fixed bug is a counted canonical closed ID.
- **Actual:** `NEW-68` and `NEW-69` are present only as the combined non-counted row.
- **Confidence:** high (canonical tool output + reverify, reproducible).
- **Verification level:** L1.
- **Suggested repair lane:** verifier picks split (Option A) or rename (Option B) per
  `proposals/proposal-SD-1-closed-counter.md`; counter/total must be reconciled intentionally.
- **Do not mix with:** any other closed-row change.

### Finding SD-2 — AR-006 marked CLOSED but counted inside the open total
- **Category:** AUDITREPO / data-sync
- **Title:** `AR-006` is labelled `✅ CLOSED 2026-07-14` but is listed in the `## 🟣 AUDITREPO (4)`
  open section and is therefore included in the canonical **191 open** total.
- **Severity:** P3 (counter semantics; does not affect product)
- **File(s):** `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` line 427 (row AR-006), line 845 (session log confirms "AR-006 закрыт").
- **Evidence:** `evidence/ar006_closed_but_open_section.txt`.
- **Expected:** a CLOSED bug is not counted in the open total (or is moved to the closed table).
- **Actual:** open total 191 = 96+36+51+4+4 includes AR-006 (closed). If AR-006 is treated closed,
  open would be 190 and AUDITREPO-open 3.
- **Confidence:** high (direct read).
- **Verification level:** L1.
- **Suggested repair lane:** same `AUDITREPO` reconciliation pass as SD-1 (decide disposition: keep in
  open section for traceability but exclude from counter, or move row to closed).
- **Do not mix with:** product fixes.

### Finding SD-4 — open bug with archive-only evidence (`AUDIT-P3-OG-LCP-MISMATCH`)
- **Category:** AUDITREPO / data-sync (evidence-freshness risk, not a product-bug claim)
- **Title:** the only open bug with archive-only evidence is `AUDIT-P3-OG-LCP-MISMATCH`
  (4 routes: `og:image` ≠ LCP image), whose evidence dates to 2026-07-05 archive and a 2026-07-09
  reverify note "needs-live-recheck". No fresh witness on/after 2026-07-09; current source HEAD is
  `efaf2a51` (2026-08-01).
- **Severity:** P3 (evidence-freshness; no product claim)
- **File(s):** matrix line 370; evidence
  `archive/2026-07-05-incoming-consolidated/arena-agent-audit-1-1/2026-07-05/REPORT.md`;
  reverify `..._2026-07-09_head-2313f36f-149-commit-delta.md:34`.
- **Evidence:** `evidence/sd4_archive_only_open_bugs.txt` (from `check_matrix_coverage.py` `archivedOnlyIds`).
- **Recommended action:** verifier schedules a fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH` on current
  HEAD `efaf2a51` before any closure/repair; do not close or repair from archived 2026-07-05 evidence
  alone. See `proposals/proposal-SD-4-archive-only-evidence.md`.
- **Confidence:** high (tool output + reverify note).
- **Verification level:** L1.

---

### Finding SD-3 — unregistered `RIGHT-*` evidence IDs flagged by matrix coverage checker
- **Category:** AUDITREPO / data-sync (evidence-registry hygiene, not a product bug)
- **Title:** `check_matrix_coverage.py` fails-closed on two unregistered evidence IDs —
  `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` — referenced in reverify.
- **Severity:** P3 (governance/registry; no product impact)
- **File(s):** `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md:27`;
  missing registry entries in `verified/MATRIX_ID_ALIASES.json`.
- **Evidence:** `evidence/sd3_unregistered_rights_ids.txt` (exact checker output).
- **Nature:** the two IDs are **Research rights-decisions** (`RIGHT-*`), pinned by Genesis-6
  provenance (Research commit `9bba3d45`, rights for Articles 6–9) — not bug IDs. They do not belong
  in the bug matrix, but the hardened coverage checker correctly flags them because no registry
  disposition exists.
- **Confidence:** high (project tool output, reproducible).
- **Verification level:** L1.
- **Suggested repair lane:** verifier/implementation adds two `informational` registry records
  (with non-empty reason) to clear the diagnostic; do NOT add to matrix or `ignoredTokens`.
  See `proposals/proposal-SD-3-rights-ids-registry.md`.

---

## 2. Confirmations of Existing Findings
None in scope — this lane is a fresh data-sync sweep, not a re-audit of prior product findings.

---

## 3. Challenges / Disputes
None.

---

## 4. Duplicate / Merge Proposals
None.

---

## 5. Severity Proposals
- Target bug: SD-1 → proposed severity **P3** (row-shape / ID-naming; corrected down from the initial
  P2 "counter drift" framing after running canonical tooling). Current: unregistered.
- Target bug: SD-2 → proposed severity **P3** (counter semantics). Current: unregistered.
- Target bug: SD-3 → proposed severity **P3** (registry/evidence hygiene). Current: unregistered.
- Target bug: SD-4 → proposed severity **P3** (evidence-freshness). Current: unregistered.

---

## 6. Repair Lane Suggestions
- Bug IDs: SD-1, SD-2, SD-3, SD-4
- Lane: `AUDITREPO-matrix-counter-reconcile` (single governance pass) — SD-1 + SD-2 (canonical
  counters 165/191 in `MASTER_BUG_MATRIX.md` + propagated to `NEXT_AGENT_PROMPT.md`).
- Lane: `AUDITREPO-evidence-registry-reconcile` — SD-3 (add two `informational` registry records)
  + SD-4 (schedule fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH`).
- Why together: all four are data-sync / evidence-hygiene fixes in the same canonical layer; none
  touches product code.
- What must NOT be mixed: no product/source repo changes; no Research/Drive changes; no
  PremiumControls owner-zone changes; no reclassification of any product bug severity; no
  counter/total edit without an explicit verifier decision.

---

## 7. Reverify Notes
Not applicable (this lane is the initial assessment, not a recheck of a prior finding).

---

## 8. Notes for Verifier

### Coverage-checker pass (this lane, same date) — SD-3
- Running the project's own `scripts/check_matrix_coverage.py` yields exactly **2 problems**, both
  UNREGISTERED-EVIDENCE for `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` at
  `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md:27`. These are
  Research rights-decisions (not bugs). This is precisely the scenario the 2026-08-01 control-plane
  audit designed the hardened checker to catch; it now fires with exact file:line.
  Recommended: two `informational` registry records with reason (do not fabricate bugs).
- Other coverage stats are consistent: 356 canonical ids / 191 open rows; registry 52
  (11 aliases, 7 informational, 30 retired, 4 false-positive); direct witnesses 10; archived-only 2.
  No additional unregistered IDs beyond SD-3.

### Continuation pass (this lane, same date) — refined conclusions
- **SD-1 resolved:** closed counter 165 is **correct** per canonical tooling
  (`check_matrix_coverage.py`: 356 canonical ids, 191 open => 165 closed). The only mismatch is the
  combined slash-ID row `NEW-68/69` (two distinct fixed bugs, invisible to canonical ID counting).
  Severity corrected P2 → P3. Options in `proposals/proposal-SD-1-closed-counter.md`.
- **SD-2 confirmed as the unique case + counter consequence:** a full-section sweep found AR-006 is
  the only genuine closed-but-listed-in-open-section row. Concretely, AUDITREPO(4) includes closed
  AR-006, so the canonical open total 191 counts one CLOSED item; if treated closed, open → 190.
  Disposition options in `proposals/proposal-SD-2-ar006-counting.md` + `evidence/sd2_resolved_ar006.txt`.
- **SD-4 added:** `AUDIT-P3-OG-LCP-MISMATCH` is the only open bug with archive-only evidence;
  recommend a fresh reverify on current HEAD `efaf2a51` (do not close/repair from 2026-07-05 archive).
  See `proposals/proposal-SD-4-archive-only-evidence.md`.
- **Coverage deep-dive (clean):** registry invariants all hold (alias targets resolve; no non-alias↔canonical
  overlap; all reasons filled). Every one of the 191 open IDs has evidence / direct witness / archived
  evidence — no ORPHAN-CLAIM. `R-003` archive-only is fine (refactoring backlog). Evidence:
  `evidence/coverage_deep_dive.txt`.
- **SD-2 wording false-positives confirmed:** all other closed-marked rows in open sections are false
  positives on wording (MAP-P1-19, TTS-DL-NO-TABLOCK, D-19 partial). Evidence:
  `evidence/sd1_alias_rows_and_options.txt`.
- **Cross-section duplicate IDs (D-1/2/3/4/7/8/19/21/22) are benign:** each appears in an open
  section plus the non-counting HISTORICAL AUDITOR LOG section; they do not inflate counters.
  Evidence: `evidence/cross_section_id_check.txt`.

- **What is synchronized (no action needed):**
  - Open section counts match their headers: P0=0, P1=96, P2=36, P3=51, Refactoring=4, AuditRepo=4.
  - Open total 191 = arithmetic sum of section headers.
  - HEAD/deploy authority consistent across docs: source `efaf2a51…` / production `abf1edba…`
    match in `NEXT_AGENT_PROMPT.md`, matrix masthead, matrix session log and the referenced reverify
    `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_efaf2a51_source-vs-production.md` (file exists).
  - All files referenced by `DOC_MAP.md` and `PROJECT_REGISTRY.md` exist:
    `verified/MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`,
    `verified/SUPER_AUDIT_2026-07-06_14a49be8.md`, `README.md`, `PremiumControls/README.md`,
    `projects/the-legendary-poet/README.md`,
    `projects/the-legendary-poet/incoming/gpt-5-6-source-library/2026-07-30/REPORT.md`.
  - `NEXT_AGENT_PROMPT.md` "AuditRepo synchronization: authority-only projection" and matrix
    masthead agree on `source != production` and on 165/191.
- **Needs verifier disposition (L1 → L2):**
  - SD-1: decide split `NEW-68`+`NEW-69` (closed→167) vs rename to one slash-free ID (closed→166);
    reconcile header, `## Статистика` and `NEXT_AGENT_PROMPT.md` accordingly. Closed counter 165 is
    currently correct, so any change here is a deliberate canonical decision.
  - SD-2: decide AR-006 counting semantics (keep visible + exclude from counter → open 190, or move
    row to closed). Applies to `## Статистика` and `NEXT_AGENT_PROMPT.md`.
  - SD-3: add two `informational` registry records for `RIGHT-*` (or an accepted disposition).
  - SD-4: schedule fresh reverify of `AUDIT-P3-OG-LCP-MISMATCH` on current HEAD `efaf2a51`.
- **Boundary:** this lane changed no canonical matrix row, status, severity, counter, source repo
  file, Research/Drive data or production evidence. Per README "Freedom with Evidence" an agent must
  NOT directly change canonical status in the verified ledger; hence only an intake report + proposals.
