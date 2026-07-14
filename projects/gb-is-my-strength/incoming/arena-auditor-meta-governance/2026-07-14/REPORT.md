# Agent Audit Report — Meta-audit of AuditRepo (governance + tooling)

## Meta
- Project: gb-is-my-strength (host folder for this meta-intake; findings are about **AuditRepo itself**)
- Source repo audited: `FedorMilovanov/AuditRepo` (this repo) — **not** the site source repo
- Agent: arena-auditor-meta-governance (Arena.ai Agent Mode)
- Date: 2026-07-14
- Audited branch: `arena/019f60df-auditrepo`
- Audited SHA (AuditRepo): `77ae95634f341501531703887738c0676fb4025f` (77ae956)
- Current HEAD at start: 77ae956
- Current HEAD at end: 77ae956
- Environment: Arena sandbox, Python 3.12
- Build mode: n/a (docs/governance repo)
- Browser / device if used: —

> **Why this intake exists.** The owner asked for a *thorough audit* of the repo, its rules,
> and the project — as an AUDITOR. AuditRepo is a coordination/evidence layer, so the highest-
> value audit target is the **consistency of its own governance and tooling** (the machinery that
> keeps every downstream bug honest). Findings below are all evidence-based (command + output),
> SHA-anchored, and filed through the repo's own intake contract. No canonical ledger was edited;
> per-fact ownership (DOC_MAP §1 / CLEANUP §8) is respected — proposals only.

---

## 1. New Findings

### Finding AR-META-01 — `check_matrix_coverage.py` fails but is not wired into CI (silent guard)
- Title: Matrix-coverage checker exits 1 on current HEAD yet no workflow runs it → the guard is decorative
- Severity: **P2**
- Route(s): n/a
- Source file(s): `scripts/check_matrix_coverage.py`, `.github/workflows/auditrepo-validate.yml`
- Observed on SHA: `77ae956`
- Repro steps / Evidence:
  ```
  $ python3 scripts/check_matrix_coverage.py >/dev/null 2>&1; echo "EXIT: $?"
  EXIT: 1
  $ grep -rn "check_matrix_coverage" .github/workflows/
  (no output → NOT in CI)
  $ grep -c "check_matrix_coverage" scripts/README.md README.md CONTRIBUTING.md
  0 / 0 / 0   (documented nowhere)
  ```
- Expected: A checker whose stated purpose (its own docstring: *"keep the canonical matrix honest"*,
  AR-004 lineage) either runs in CI or is documented as manual-only. If it runs, it must be green
  (or `--warn-only`).
- Actual: It exits non-zero on HEAD, is invoked by no workflow, and is mentioned in zero docs — so
  nobody sees the 46 problems it reports (see AR-META-02). It is effectively dead governance code.
- Confidence: high
- Verification level: L2 (direct source/tooling evidence)
- Suggested repair lane: **auditrepo-tooling** (matches open matrix rows AR-001/AR-004/AR-005)
- Do not mix with: any source-repo (gb) fix.

### Finding AR-META-02 — 46 real matrix-coverage problems: unregistered evidence + non-SHA close refs
- Title: Coverage checker surfaces 9 "unregistered-evidence" IDs and 37 "bad-commit-ref" closed rows
- Severity: **P3** (documentation hygiene; the checker is right, the matrix drifted)
- Source file(s): `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`, `reverify/*`
- Observed on SHA: `77ae956`
- Evidence (abridged; full list in `evidence/matrix-coverage-2026-07-14.txt`):
  ```
  UNREGISTERED-EVIDENCE: reverify mentions SEC-002 but matrix does not
  UNREGISTERED-EVIDENCE: reverify mentions UI-GILL-DESKTOP-FRAME-03 but matrix does not
  ... (7 more UI-GILL-DESKTOP-* / UI-GILL-*-0x IDs)
  BAD-COMMIT-REF: closed bug SEARCH-SCRIPTURE-BROKEN ref 'PR#36' is not a short SHA
  ... (36 more closed rows referenced by PR#3x/PR#4x or 'by-design' instead of a merge SHA)
  ```
- Root cause (two independent classes):
  1. **Unregistered evidence** — `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_sec-001-002-fixed.md`
     documents `SEC-002` and the Gill desktop rail/TOC forensic docs name `UI-GILL-DESKTOP-*`
     IDs that never landed as rows in the matrix. Confirmed: `grep -c "SEC-002" MASTER_BUG_MATRIX.md → 0`.
     This is exactly the drift class the checker was built to catch (AR-004 lineage).
  2. **Bad commit refs** — 37 closed rows cite `PR#33..PR#45` / `by-design` in the "Коммит" column
     instead of the immutable short SHA the SHA-First principle (README) and DOC_MAP §4 demand.
     The matrix *has* the SHAs elsewhere (e.g. `SEARCH-SCRIPTURE-BROKEN` merged via PR#36) but the
     canonical column stores the mutable PR number.
- Confidence: high
- Verification level: L2 (tool + manual grep)
- Suggested repair lane: **auditrepo-tooling** (same lane as AR-META-01)
- Note: This does **not** mean the closed bugs are wrong — only that the canonical column violates
  the repo's own SHA-First rule and the coverage guard cannot verify them.

### Finding AR-META-03 — Governance threshold contradiction: PROJECT_META vs README/MULTI_WITNESS
- Title: `confirmed-current` requires **2** witnesses in PROJECT_META.yml but **3** everywhere else
- Severity: **P2** (a live rule that decides when a bug becomes repair-ready)
- Source file(s): `projects/gb-is-my-strength/PROJECT_META.yml`,
  `README.md`, `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`
- Observed on SHA: `77ae956`
- Evidence:
  ```
  $ grep -n minimum_witnesses projects/gb-is-my-strength/PROJECT_META.yml
  40:  minimum_witnesses_for_confirmed_current: 2
  $ grep -n "3 свидет\|усиленный барьер" README.md
  138-139: "Ранее README допускал confirmed-current при 2 агентах, что противоречило
           MULTI_WITNESS (3 свидетеля). Используйте усиленный барьер."
  $ grep -n "confirmed-current" MULTI_WITNESS_VERIFICATION_PROTOCOL.md
  72-74: "### 3 witnesses or production-like browser witness → confirmed-current"
  ```
- Expected: One source of truth for the witness threshold. README explicitly declares MULTI_WITNESS
  as authoritative ("3 свидетеля... используйте усиленный барьер") and says it *already reconciled*
  the README↔MULTI_WITNESS split — but the machine-readable `PROJECT_META.yml` was never updated and
  still encodes the **weaker** `2` that README calls a past mistake.
- Actual: The one file a tool would parse (`PROJECT_META.yml`) contradicts the prose canon, so an
  automated promoter reading it would under-gate `confirmed-current`.
- Confidence: high
- Verification level: L2 (direct source evidence, 3 files)
- Suggested repair lane: **governance-single-writer** — set `minimum_witnesses_for_confirmed_current: 3`
  (or convert it to a pointer/comment referencing MULTI_WITNESS as SSOT, per CLEANUP §8).
- Do not mix with: any bug-status change.

### Finding AR-META-04 — `code-audit` project is invisible & mislabeled (registry + status drift)
- Title: Second project `code-audit` is absent from PROJECT_REGISTRY and its status is stale
- Severity: **P3**
- Source file(s): `PROJECT_REGISTRY.md`, `projects/code-audit/README.md`, `projects/code-audit/incoming/`
- Observed on SHA: `77ae956`
- Evidence:
  ```
  $ grep -c "code-audit" PROJECT_REGISTRY.md
  0                      # exists on disk, but registry lists only gb-is-my-strength
  $ ls projects/code-audit/incoming/
  README.md              # no live intake — only the placeholder
  $ find projects/code-audit/archive/2026-07-05-stale-intake -name REPORT.md
  .../arena-agent/2026-07-02/REPORT.md   # the only real intake was archived as stale
  $ grep "Current status" projects/code-audit/README.md
  - Current status: `intake-only`
  ```
- Root cause: `PROJECT_REGISTRY.md` claims to be the single owner of "which projects exist"
  (CLEANUP §8 table) but omits `code-audit`. Meanwhile `code-audit/README.md` says
  `intake-only`, yet its only intake was moved to `archive/2026-07-05-stale-intake/` — so the
  accurate status is closer to `archived` / `stale` with an empty live `incoming/`.
- Confidence: high
- Verification level: L2 (registry vs disk)
- Suggested repair lane: **governance-single-writer** — either register `code-audit` in
  PROJECT_REGISTRY with an honest status, or mark the folder archived. (Structure itself is valid:
  `validate_audit_repo.py` = PASS.)

### Finding AR-META-05 — README structure diagram is incomplete vs actual `_templates/` (doc drift)
- Title: README "Структура" tree lists 3 templates; 12 exist on disk
- Severity: **P3** (advisory)
- Source file(s): `README.md` (structure block), `projects/_templates/`
- Observed on SHA: `77ae956`
- Evidence:
  ```
  README tree shows only:  AGENT_REPORT_TEMPLATE.md, VERIFIER_SYNTHESIS_TEMPLATE.md, COMMENT_TEMPLATE.md
  $ ls projects/_templates | wc -l
  12    # incl. BUG_MATRIX/BUG_RECORD/CURRENT_HEAD_REVERIFY/INTAKE_README/PROJECT_README/
        #       REPAIR_ORDER/REPAIR_PLAN/SUSPECTED_RETIREMENT/WITNESS_MATRIX templates
  ```
- Note: README already carries a similar "old docs referenced `scripts/auditrepo.py` which does not
  exist" correction, so the maintainers value this kind of doc-truth fix. Low risk; cosmetic.
- Confidence: high
- Verification level: L2
- Suggested repair lane: **governance-single-writer** (doc-only).

---

## 2. Confirmations of Existing Findings

### Confirm AR-004 (matrix "AUDITREPO" row: "verification protocol automation")
- Target: `verified/MASTER_BUG_MATRIX.md` → `## 🟣 AUDITREPO (3)` → `AR-004`.
- My evidence: `check_matrix_coverage.py` **is** the AR-004 automation (its docstring cites the
  AR-004 lineage) but it fails (EXIT 1) and is un-wired (AR-META-01). So AR-004 is only *partially*
  done: the tool exists, the enforcement loop does not.
- Same bug / related: **related** — AR-META-01/02 are the concrete open surface of AR-004.
- Recommended status: keep AR-004 OPEN; link AR-META-01/02 as its evidence.

### Confirm AR-001 (matrix "AUDITREPO" row: "validate_audit_repo.py hardening")
- My evidence: `validate_audit_repo.py` = PASS today, but it does **not** check: (a) registry↔disk
  project parity (AR-META-04), (b) witness-threshold consistency (AR-META-03), (c) SHA-format of
  closed-matrix rows (AR-META-02 class 2). These are natural hardening targets for AR-001.
- Recommended status: keep AR-001 OPEN; the three checks above are candidate acceptance criteria.

---

## 3. Challenges / Disputes
_None._ Structure validators (`check_auditrepo_structure.py`, `validate_audit_repo.py`) both PASS,
and the 851-file tree matches the documented contract. The 11 "broken links" from a raw sweep were
verified as **false positives** — all are regex snippets or `![...](screenshots/…)` samples *inside
fenced code blocks* (e.g. `proposals/proposal-OWNER-5-visual-qa-baseline.md` lines 42–53 are a
```markdown fence). No genuine broken intra-repo link found. I explicitly do **not** raise a link bug.

---

## 4. Duplicate / Merge Proposals
- AR-META-01 and AR-META-02 share one root (the coverage checker is unenforced *and* currently red).
  Suggest handling them in a single **auditrepo-tooling** PR but tracking as two IDs (one = wiring,
  one = data cleanup), mirroring the matrix's own BUG-ARCH-001 = AUDIT-P2-SW-PRECACHE-4 precedent.

## 5. Severity Proposals
- None against existing bugs. Proposed severities for new findings are inline in §1.

## 6. Repair Lane Suggestions
- **Lane A — auditrepo-tooling:** AR-META-01 (wire checker into CI, likely `--warn-only` first),
  AR-META-02 (backfill SHAs into closed rows; register SEC-002 + UI-GILL-* IDs). Advances AR-004.
- **Lane B — governance-single-writer:** AR-META-03 (witness threshold 2→3 in PROJECT_META),
  AR-META-04 (register/relabel code-audit), AR-META-05 (README template list). Advances AR-001.
- Must NOT mix: Lane A/B (AuditRepo) with any `gb-is-my-strength` **source** change. Different repos.

## 7. Reverify Notes — ⚠️ MAJOR: canon is STALE, production is RED

> **Update (second pass, per owner: "много пушей и MERGE был, актуализируй").** A full live
> reverify was performed against the **cloned source repo at live HEAD `2ca2af3b`**
> (2026-07-14), Node v22.22.3, `npm ci`. Findings are in the dedicated reverify doc:
> **`../../../reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`**.

- **Canon drift confirmed:** matrix masthead + `NEXT_AGENT_PROMPT.md` are frozen at source HEAD
  `b8459bdf` (2026-07-10, deploy GREEN). Live source is `2ca2af3b` — **287 commits / 300 files
  ahead**, merged PRs **#72–#88** + genealogy-atlas merges. Prior analyses are stale.
- **🔴 Production deploy is RED** (canon says GREEN). Three CI workflows fail on `2ca2af3b`:
  Deploy *Static publication gates* (`29338523013`), Metadata & IndexNow *Validate registry
  structure* (`29338522715`), Visual Parity *pixel-diff* (`29338522526`). Production is
  stale-locked at `b8459bdf`; the genealogy/atlas + mobile-reader work is **not live**.
- **Three deploy blockers reproduced locally** (stronger than CI log scraping):
  1. `REG-VALIDATE-GENEALOGY-TEMPLATE` (P1) — `validate.js` lint-fails the two
     `scripts/genealogy-build/*.html` **build templates** (unsubstituted `/*__ATLAS__*/`
     placeholders → invalid JS) because its file walker doesn't skip `scripts/`.
  2. `REG-EDITORIAL-METADATA-MISSING` (P1) — 5 new routes (Gill Part IV + «Сердце» articles)
     lack editorial-metadata records → readiness gate red.
  3. `CACHE-BUST-NO-WRITER` — site-wide cache-bust `?v=` drift (82 files); no workflow runs
     `cache-bust --write`. **Recurrence** of the owner's 2026-07-11 follow-up (`9fce2bc`).
- **Matrix status changes (reverified on live):** CI-INDEXNOW-CHECKER-STALE → **fixed-current**
  (`3a43cada`/PR#70, `check-workflows.js` now `contents: read`, `node scripts/check-workflows.js`
  = ✅). Still-confirmed open: D-19 (antisovetov half), D-4, D-7, TTS-DL-CONSENT, TTS-DL-UNZIP-SYNC,
  NF-VOSK-DEAD-SPLITSENTENCES, NEW-HARDTEXTS-CSP-MISSING-HFCDN, D-8.
- I did **not** modify the source repo or the canonical SSOT facts — regressions A/B/C touch the
  release transaction (W1) and pipeline config, which is owner-gated (`NEXT_AGENT_PROMPT.md` r5).

## 8. Notes for Verifier
- All five findings are about **AuditRepo governance/tooling**, filed here because the repo has no
  dedicated "auditrepo" project folder — the matrix already tracks such work under the `🟣 AUDITREPO`
  category (AR-001/004/005), so this intake feeds those rows.
- Nothing here is repair-ready by me alone (L2 max). A verifier should: (1) confirm AR-META-01/03 by
  re-running the two commands; (2) decide the witness threshold (owner-level policy — MULTI_WITNESS
  says 3); (3) accept/route the lanes above.
- Structural health is otherwise good: both validators PASS, tree matches contract, no orphan open
  claims (coverage checker Check-1 found **0** ORPHAN-CLAIM — every open bug has evidence).
- Evidence artifacts: `evidence/matrix-coverage-2026-07-14.txt`, `evidence/validators-2026-07-14.txt`,
  `evidence/link-sweep-2026-07-14.txt`. Commands: `commands.log`.
