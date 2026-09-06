# Governance / Documentation / Templates Contract Audit — 2026-09-06

Agent 4 of the five-agent AuditRepo audit. Surface: repository governance, documentation and template contract.

## Scope

Audited (primary surfaces): `README.md`, `CONTRIBUTING.md`, `AUDITREPO_OPERATING_MODEL.md`,
`CLEANUP_RETENTION_POLICY.md`, `CONCURRENT_EDIT_PROTOCOL.md`, `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`,
`PROJECT_REGISTRY.md`, `projects/_templates/*`, `scripts/README.md`, and project documentation
describing the intake/scaffold/status lifecycle (read-only for project-scoped files).

Excluded (per mission): `.github/workflows/**`, validator/scaffold implementation under
`scripts/*.py` / `*.mjs`, project MASTER matrices, raw evidence, branch cleanup.

## Method

- Every statement in the primary surfaces was cross-checked against the machine contract
  (`scripts/validate_audit_repo.py`, `scripts/check_auditrepo_structure.py`,
  `scripts/matrix_coverage_lib.py`, CI workflows) and against the actual folder layout of all
  three projects (`gb-is-my-strength`, `the-legendary-poet`, `code-audit`).
- Old lifecycle terminology was classified against the canonical status table in
  `AUDITREPO_OPERATING_MODEL.md` and the evidence-label model in
  `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.
- All links and heading references in the primary surfaces were resolved.
- After fixes: `check_auditrepo_structure.py`, `validate_audit_repo.py` (+ regression),
  `scaffold_regression_test.py`, `check_workflow_syntax.py` (+ regression) all PASS.

---

## 1. Contract matrix

| # | Topic | Current contract | Canonical source(s) | Cross-doc status |
|---|---|---|---|---|
| 1 | `incoming/` | Raw agent reports and anchor-specific evidence; one agent never silently rewrites another agent's intake | `CLEANUP_RETENTION_POLICY.md`, `CONTRIBUTING.md`, `CONCURRENT_EDIT_PROTOCOL.md` | Consistent |
| 1 | `working/` | Temporary synthesis/clustering; remove or retire when superseded | `CLEANUP_RETENTION_POLICY.md`, `CONCURRENT_EDIT_PROTOCOL.md` | Consistent |
| 1 | `verification/` | Package/current verification, conflicts, system decisions worth keeping as a distinct engineering record | `CLEANUP_RETENTION_POLICY.md`, `CONTRIBUTING.md`, `DOC_MAP` template | Consistent |
| 1 | `reverify/` | Significant current-applicability checks; do not mirror every Product commit | `CLEANUP_RETENTION_POLICY.md`, `AUDITREPO_OPERATING_MODEL.md` | Consistent |
| 1 | `repairs/` | Owner-selected implementation plans and repair summaries; code lives in the Product repo | project `repairs/README.md` (gb, tlp), `PROJECT_META.yml` `repairs_path`, validator (required folder) | **Was undocumented at root level — fixed** (README tree, `CLEANUP_RETENTION_POLICY.md`, `PROJECT_README_TEMPLATE.md`) |
| 1 | `verified/` | Single active MASTER + system context + closure ledger; no giant closed sections | `CLEANUP_RETENTION_POLICY.md`, `AUDITREPO_OPERATING_MODEL.md`, project `verified/README.md` | Consistent |
| 1 | `legacy/` | Retirement sink for solved/stale/duplicate/absorbed/invalid/accepted/superseded material; searchable, never a backlog | `CLEANUP_RETENTION_POLICY.md`, `AUDITREPO_OPERATING_MODEL.md`, README | Consistent |
| 1 | `archive/` | Older historical collections/packages, not current guidance | `CLEANUP_RETENTION_POLICY.md`, README | Consistent |
| 2 | Owner of current Product truth | Product repository: current code/HEAD, open Product PRs/branches, CI/build/deploy/runtime truth. AuditRepo never mirrors it after every commit | `AUDITREPO_OPERATING_MODEL.md` (Разделение ответственности), README («What AuditRepo does not do»), `PROJECT_REGISTRY.md` preamble | Consistent everywhere |
| 3 | What belongs in MASTER | Current defects; **verified necessary implementations/improvements**; required migrations/retirements; narrowed residuals; current system/root-cause lanes; owner decisions blocking work | README, `CONTRIBUTING.md`, `CLEANUP_RETENTION_POLICY.md`, `BUG_MATRIX_TEMPLATE.md`; **`AUDITREPO_OPERATING_MODEL.md` was missing improvements/migrations — fixed** | Contradiction fixed |
| 4 | What leaves MASTER | In the same closure/consolidation wave: fixed, absorbed, duplicate, stale, invalid, not-worth-fixing, accepted, superseded rows; optional ideas → `WORK_QUEUE.md`; one `SYS-*` row per shared root | `AUDITREPO_OPERATING_MODEL.md`, `CLEANUP_RETENTION_POLICY.md`, `CONTRIBUTING.md` | Consistent |
| 5 | Status/lifecycle terminology | `raw → candidate → verified-at-anchor → selected-for-current-check → current-local / systemic-root / duplicate-symptom / owner-decision / parked → fixing → closed-by-fix / absorbed-by-system-fix`; terminal: `stale / invalid / accepted-risk / not-worth-fixing` | `AUDITREPO_OPERATING_MODEL.md` (table) | `current-local` (operating model) = `current-confirmed-for-work` (MULTI_WITNESS). Equivalence now stated in both docs. No numeric levels remain |
| 6 | Verification levels | No numeric ladder. Evidence angles W1–W6 (surface, source, artifact, browser/runtime, lifecycle/root-cause, history) + proof states `PASS / FAIL / UNPROVEN / N/A` + proportional bar per work class | `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`, `WITNESS_MATRIX_TEMPLATE.md`, `PROJECT_META.yml` `verification:` block | Old L0–L4 ladder (peer-reviewed / confirmed-on-sha / confirmed-current / repair-ready) is retired; remnants fixed (see findings) |
| 7 | Proposal lifecycle | `proposal-open → proposal-supported → proposal-accepted / proposal-rejected / proposal-conflicted / proposal-superseded`; conflicts resolved in `verification/` | `scripts/README.md`, `COMMENT_TEMPLATE.md`, `scaffold_intake.py` (proposals folder) | Still supported by scaffold; "resolved in conflicts/" (folder no longer exists) fixed to `verification/` |
| 8 | Concurrent-edit ownership | Separate branches + clear file/fact ownership + narrow diffs + current-base check; one owner file per volatile fact, link instead of restating | `CONCURRENT_EDIT_PROTOCOL.md` (fact-ownership table), `DOC_MAP` template | Consistent |
| 9 | Branch/PR policy | No direct pushes to `main`; branch from current `main`; avoid files owned by open competing PRs; rebase before merge; narrow reviewed diff; periodic ref/closed-PR forensic; no write-capable control plane | `CONCURRENT_EDIT_PROTOCOL.md` §§2,7, `AUDITREPO_OPERATING_MODEL.md` (Branch/PR forensic), `CLEANUP_RETENTION_POLICY.md` (Branch retention) | Consistent |
| 10 | Terminal ZERO freshness | `PRODUCT ZERO / AUDIT ZERO / CONTROL-PLANE ZERO` are evidence-bound snapshots, not eternal properties. Must record `attested_at`, Product `main` SHA, open PR check, gates, Research HEAD, external evidence boundary, AuditRepo HEAD/PR. Becomes `STALE` (not usable as current admission witness) after any material event; stale ≠ bug | `AUDITREPO_OPERATING_MODEL.md` (Terminal attestation и freshness) | Only defined here; no contradicting doc found |
| 11 | Source HEAD / current-check | A historical `verified-at-anchor` claim is not permission to edit current Product; re-check the evidence-critical current surface before mutation; reverify only on material reason (selected work, owner change, contradicting witness, high-risk decision); Product HEAD movement alone is not a trigger | `AUDITREPO_OPERATING_MODEL.md`, `CONTRIBUTING.md` (Implementation handoff), `CLEANUP_RETENTION_POLICY.md` (Event-driven re-verification), `MULTI_WITNESS_VERIFICATION_PROTOCOL.md` (anti-patterns) | Consistent |
| 12 | Raw evidence immutability | Raw intake is not rewritten (even when later disproved); reports stay evidence about their recorded anchor; corrections go into new comments/entries | `CLEANUP_RETENTION_POLICY.md`, `CONCURRENT_EDIT_PROTOCOL.md` §§5,8, `AGENT_REPORT_TEMPLATE.md`, `INTAKE_README_TEMPLATE.md` | Consistent |
| 13 | SSOT rules | One active matrix per project; one owner file per volatile fact; registry keeps only stable orientation; no second active matrix; no duplication of volatile facts across current-authority files | `AUDITREPO_OPERATING_MODEL.md`, `CLEANUP_RETENTION_POLICY.md` («Never do this»), `CONCURRENT_EDIT_PROTOCOL.md` §3, `PROJECT_REGISTRY.md` preamble | Consistent |

---

## 2. Findings — true contradictions

**C1. Canonical MASTER admission list omitted necessary improvements/migrations. — FIXED.**
`AUDITREPO_OPERATING_MODEL.md` ("В MASTER разрешены только") admitted only current defects,
narrowed residuals, system lanes and owner decisions — while README, `CONTRIBUTING.md`,
`CLEANUP_RETENTION_POLICY.md` ("Necessary improvements"), `BUG_MATRIX_TEMPLATE.md` and the matrix
coverage engine (`VERIFIED NECESSARY IMPROVEMENTS` section) all admit verified necessary
improvements and required migrations/retirements. An agent following only the canonical doc
would reject valid MASTER rows. Added the two missing bullet classes to the operating model.

**C2. `repairs/` is a required, scaffolded, validator-enforced folder that no governance doc described.**
`validate_audit_repo.py` and `check_auditrepo_structure.py` require `projects/<p>/repairs/`;
`scaffold_project.py` creates it; all three projects have it (gb/tlp with real READMEs defining
its role). Yet the root README structure tree, `CLEANUP_RETENTION_POLICY.md` folder roles and
`PROJECT_README_TEMPLATE.md` did not mention it. — FIXED in all three doc locations.
Out-of-surface remainder: `scaffold_project.py`'s embedded `DOC_MAP_TEMPLATE` also omits a
`repairs/` row, and `gb-is-my-strength/DOC_MAP.md` omits `repairs/` (tlp likewise) — script and
project-scoped files, flagged but not edited (see §6).

**C3. Old verification ladder still presented as current in actively used surfaces. — FIXED.**
`scripts/README.md` "Governance model reference" documented the retired L0–L4 ladder
(`raw → peer-reviewed → confirmed-on-sha → confirmed-current → repair-ready`) as if current and
referenced README sections «Multi-Level Verification Ladder» / «Proposal Status Lifecycle» that
no longer exist; it also routed conflicted proposals to a nonexistent `conflicts/` folder.
`CURRENT_HEAD_REVERIFY_TEMPLATE.md` (copied by `scaffold_reverify.py` into every new reverify
document) used `confirmed-on-sha` as the example previous status — a term defined nowhere in the
current model. Replaced with the canonical lifecycle and `verified-at-anchor` respectively.

**C4. `SUSPECTED_RETIREMENT_TEMPLATE.md` routed retired rows to `archive/fixed|stale|false-positive/`. — FIXED.**
The current retirement sink is `legacy/` (`CLEANUP_RETENTION_POLICY.md`,
`AUDITREPO_OPERATING_MODEL.md`); `archive/` is for whole historical packages. The template now
says `legacy/` note first, `archive/` only for whole package retirements.

**C5. `PROJECT_REGISTRY.md` omitted the `code-audit` project.**
The registry claims to list "проекты, для которых AuditRepo накапливает мультиагентные аудиты
и evidence", but `projects/code-audit/` (which has intake evidence, a synthesis and a current
MASTER) was absent. — FIXED: added the row with the status its own project README declares
(`intake-only`) and retitled the table "Projects" so non-active statuses fit the glossary.
Independently corroborated by Agent 5's evidence-integrity audit finding VIE-05, which
recommends the same row. Note for the project owner: `code-audit/README.md` says
`intake-only` while `verified/MASTER_BUG_MATRIX.md` has active rows — project-scoped status
deserves owner review.

**C6. Status-term drift `current-local` vs `current-confirmed-for-work`.**
Both canonical docs define the "current, verified for work" state under different names
(operating model: `current-local`; MULTI_WITNESS status guidance + required report labels:
`current-confirmed-for-work`). Live intake reports use both. This is a naming drift, not two
different levels — but it invites exactly the old mistake of treating them as separate ladder
levels. — FIXED minimally: each doc now states the equivalence of the other's term.

## 3. Findings — broken links / headings / stale guidance (fixed)

- `scripts/README.md` referenced README sections «Multi-Level Verification Ladder» and
  «Proposal Status Lifecycle» — sections do not exist (fixed with C3).
- `scripts/README.md` quick start: `scaffold_project.py gb-is-my-strength ...` would fail
  (project already exists) and `scaffold_intake.py` used a hard-coded stale date — replaced
  with placeholders; "Проверить структуру" mislabeled `validate_audit_repo.py` — relabeled and
  `check_auditrepo_structure.py` added.
- `scripts/README.md` described `REPORT.md` as "8-секционный" and mapped intake freedom
  sections to the old numbering (e.g. "Severity proposals — секция 5") while the canonical
  `AGENT_REPORT_TEMPLATE.md` has 9 sections and different numbering — remapped all 9.
- `scripts/README.md` claimed `scaffold_project.py` creates "incoming/working/verified/
  verification + _templates" — actually creates incoming, working, verification, verified,
  repairs, reverify, legacy, archive + README/DOC_MAP/WORK_QUEUE/PROJECT_META + three
  `verified/` docs and no `_templates`. Corrected.
- `scripts/README.md` nested `### scaffold_reverify.py` / `### scaffold_retirement_review.py`
  headings inside the `validate_audit_repo.py` section — promoted to `##`.
- (Round 2) `scripts/README.md` example `touch` commands used the retired ID style `P1-14` and a
  hard-coded stale date `2026-06-25` — replaced with `<YYYY-MM-DD>` / `<TARGET-ID>` placeholders
  matching the scaffold's own sample file names.
- (Round 2) `scripts/README.md` described the intake scaffold as "сабфолдерами новой модели"
  (stale migration-era wording) — corrected to "текущей модели".

## 4. Findings — intentional historical terminology (kept)

- L0–L4 ladder and `confirmed-on-sha`/`peer-reviewed`/`repair-ready` inside
  `projects/*/archive/**` (e.g. `code-audit/archive/2026-07-05-stale-intake/.../README.md`,
  `gb-is-my-strength/archive/**`) — correctly placed historical evidence; not edited.
- `fixed-current` / `stale-on-current-head` / `false-positive` revert/review outcome buckets in
  `CURRENT_HEAD_REVERIFY_TEMPLATE.md` / `SUSPECTED_RETIREMENT_TEMPLATE.md` — still alive in
  `projects/gb-is-my-strength/PROJECT_META.yml` `retirement_flow`; kept.
- `_OWNER_DOWNLOADS/README.md` and `SANDBOX-ENV-2026-06-21.md` dated snapshots — kept.

## 5. Findings — harmless wording differences (kept)

- "backlog" as a synonym for the active matrix (README, `CONCURRENT_EDIT_PROTOCOL.md` fact
  table, project DOC_MAPs) vs "working queue/notebook" in the operating model — same object,
  opposite usage of "legacy is never a backlog" is consistent everywhere.
- `AGENT_REPORT_TEMPLATE.md` evidence-type list omits `verified-production-like-dist` (present
  in MULTI_WITNESS labels) — the label list is "as applicable"; no contradiction.
- `COMMENT_TEMPLATE.md` comment types vs `scaffold_intake.py` sample comment types differ in
  wording — both are non-exhaustive pick-lists; script side is out of surface.
- Root README structure tree omits secondary top-level dirs (`references/`, top-level
  `verification/`, `_OWNER_DOWNLOADS/`, `.github/`) — tree is an orientation subset; the two
  contract-relevant omissions (`CONCURRENT_EDIT_PROTOCOL.md`, `repairs/`) were fixed.

## 6. Findings — documentation telling agents to edit the wrong authority / out-of-surface

- **FIXED** `SUSPECTED_RETIREMENT_TEMPLATE.md` archive-target routing (C4) — an agent following
  it would file retired rows into `archive/*/` against the current legacy/ policy.
- **FIXED** `scripts/README.md` L0–L4 ladder (C3) — an agent following it would label new work
  with retired levels that no verifier recognizes.
- **FIXED** `scripts/README.md` `scaffold_project.py` example on the existing
  `gb-is-my-strength` project (would error or tempt workaround edits).
- **Flagged, not edited (out of surface):**
  - `projects/code-audit/README.md` folder list omits `legacy/` (folder exists) and its status
    (`intake-only`) vs its populated MASTER — project-scoped, owner review recommended.
  - `projects/code-audit/` uses the old intake layout (`incoming/<report>.md` instead of
    `incoming/<agent>/<date>/`) — historical project content.
  - `scaffold_project.py` `DOC_MAP_TEMPLATE` and the gb/tlp `DOC_MAP.md` files omit a `repairs/`
    fact-ownership row — script + project files.
  - `projects/gb-is-my-strength/PROJECT_META.yml` `retirement_flow` uses reverify bucket terms
    (`fixed-current_or_false-positive_or_stale-on-current-head`) — project META, kept per §4.

## 7. Findings — missing guidance for parallel GitHub coding agents

- **FIXED (documentation):** `scripts/README.md` now has a short "Machine contract" note:
  validators run in CI on every PR, and documentation must match validator rules, not the
  reverse. Nothing in the governance docs previously told a docs-editing agent this.
- **Observed, not fixed (would be new rules, not contradictions):**
  - No governance doc states that `.github/workflows/**` and validator implementations are a
    protected machine surface (agents must not casually edit them). `CONCURRENT_EDIT_PROTOCOL.md`
    §7 forbids write-capable control planes, but nothing names workflow/validator ownership.
  - No branch-naming or Draft-PR convention is documented; `CONCURRENT_EDIT_PROTOCOL.md` §2
    covers discipline but not naming.
  - Project `DOC_MAP.md`s do not all list every fact owner (missing `repairs/`, gb missing
    `CLOSURE_LEDGER` row) — an agent looking for the repair-lane owner has no pointer.

## 8. Duplication of volatile facts

No remaining instruction in the primary surfaces tells agents to duplicate volatile facts.
The opposite is enforced: `CONCURRENT_EDIT_PROTOCOL.md` §1/§3 (one owner per volatile fact,
link instead of restate), `PROJECT_REGISTRY.md` preamble (no HEAD/counts/PRs in the registry),
`PROJECT_README_TEMPLATE.md` and README ("does not mirror every HEAD"). Verified against the
current docs after the fixes in this report.

## 9. Open-PR overlap check

At the time of this audit the open PRs are: five `gb-is-my-strength` intake PRs
(#328, #334, #337, #341, #342 — all files under `projects/gb-is-my-strength/incoming/**`),
plus three draft audit PRs from this five-agent wave: #364 (Agent 5, evidence integrity),
#365 (Agent 1, control-plane), #366 (Agent 3, TLP SSOT/matrix). None of them edits any file
this PR edits (root governance docs, `projects/_templates/**`, `scripts/README.md`,
`verification/2026-09-06-governance-contract-audit/**`).

Branch note: this session is pinned to `arena/01a0770d-auditrepo`, which already carried
Agent 5's commits (PR #364, reviewed above; VIE-05 recommends the same registry row added
here). This PR's own commits are the governance fixes after `d5b98d0`; the branch was updated
from current `main` before this PR was opened.

## 10. Verification

```
AUDITREPO STRUCTURE CHECK: PASS
AUDITREPO VALIDATION: PASS
AUDITREPO VALIDATOR REGRESSION: PASS
AUDITREPO SCAFFOLD REGRESSION: PASS
AUDITREPO WORKFLOW PREFLIGHT: PASS
```

## 11. Round-2 re-verification (same day, after first PR push)

- **Branch/main sync:** `origin/main` still at `29450bf`; branch `arena/01a0770d-auditrepo`
  rebased on it, no conflicts. PR #364 OPEN + draft, `mergeable: MERGEABLE`, head = this
  audit's commit. CI on the head at the time of round 1 push: `preflight` PASS, `validate` PASS.
- **Link resolution:** all 8 local links in the primary surfaces + templates + `scripts/README.md`
  resolve; 0 broken. External URLs are not duplicated in these docs.
- **Stale-term re-grep:** `L0–L4`, `confirmed-on-sha`, `peer-reviewed`, `repair-ready`,
  «Multi-Level Verification Ladder», `Governed Freedom`, `conflicts/`,
  `archive/fixed|stale|false-positive/`, "8-секционный" — zero occurrences left in the primary
  surfaces and templates. Remaining occurrences are confined to `projects/*/archive/**`
  (intentional historical) as classified in §4.
- **Additional round-2 fixes:** see §3 (example IDs/date, "новой модели" wording).
- **Sibling-PR contract check:** Agent 1's #365 (validator/coverage changes) extends CI trigger
  patterns and regression tests; it does not alter the documented folder contract
  (`incoming/working/verification/reverify/repairs/verified/legacy/archive`) or MASTER rules, so
  no part of this report's matrix is invalidated by it. No file overlap with this PR.
- **SANDBOX-ENV-2026-06-21.md:** dated sandbox/environment passport — classified historical,
  intentionally retained (consistent with §4).
- **Full local re-run after round-2 fixes (9 suites):**

```
AUDITREPO STRUCTURE CHECK: PASS
AUDITREPO VALIDATION: PASS
AUDITREPO VALIDATOR REGRESSION: PASS
AUDITREPO SCAFFOLD REGRESSION: PASS
AUDITREPO WORKFLOW PREFLIGHT: PASS (+ regression)
AUDITREPO REF RETIREMENT REGRESSION: PASS
MATRIX COVERAGE REGRESSION: PASS
AUDITREPO HISTORY FORENSIC REGRESSION: PASS
```
