# AuditRepo-Internal Audit Report — bugverifikator — 2026-07-17

## Meta

- **Project:** gb-is-my-strength
- **Source repo:** `FedorMilovanov/gb-is-my-strength` (not directly audited here; this is an AuditRepo-side finding)
- **Audited surface:** AuditRepo `main` HEAD `7547fabab486a719f6f9b3cb794adf227c89c32c` (2026-08-18T20:43:14Z), file `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`
- **Agent:** bugverifikator
- **Date:** 2026-07-17 (local intake; evidence boundary anchored to AuditRepo HEAD above)
- **Audited anchor (SHA):** `7547faba` (AuditRepo)
- **Branch/ref:** `main`
- **Environment:** static source/CI inspection via GitHub API + local execution of AuditRepo's own `scripts/matrix_coverage_lib.py`
- **Build mode:** source (AuditRepo markdown + CI run records)
- **Scope:** internal consistency of the gb-is-my-strength active MASTER matrix against its own declared counters and against the repo's coverage validator
- **Explicit exclusions:** TLP matrix (rechecked separately and clean); Product source code defects themselves (owned by separate verification reports)
- **Signal class:** AuditRepo (audit-drift / matrix-coverage violation — not a Product defect)
- **Report type:** source-audit (AuditRepo-internal)
- **Proof state:** FAIL (confirmed AuditRepo-internal defect, machine-reproduced by the repo's own validator)
- **Claim boundary:** AuditRepo HEAD `7547faba`, file `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` at the byte-identical SHA `f9a3ac8475b4…` (9114 bytes)
- **Preservation boundary:** anchored to `7547faba`; this finding becomes STALE if a subsequent commit to that exact file restores count↔row parity

## required_for_intake (per PROJECT_META.yml)

| field | value |
|---|---|
| project | gb-is-my-strength |
| source_repo | FedorMilovanov/gb-is-my-strength (subject product); AuditRepo `FedorMilovanov/AuditRepo` (where the defect lives) |
| audited_anchor | AuditRepo HEAD `7547faba` → `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` |
| branch_or_event_context | `main`; recent direct pushes at 2026-08-18T20:35 (commits `86e4400a`, `8ef37c99`) that bumped counters without inserting rows |
| agent | bugverifikator |
| date | 2026-07-17 |
| environment | static source + CI run inspection via GitHub API; local run of `matrix_coverage_lib.py` |
| report_type | source-audit (AuditRepo-internal / matrix coverage) |

---

## Finding — `GB-MASTER-COUNT-DRIFT-20260818`

**Kind:** AuditRepo-internal audit defect (`audit-drift` per MULTI_WITNESS_VERIFICATION_PROTOCOL taxonomy).
**Severity / impact:** medium-high. The active MASTER is the single SSOT for "what verified work still needs action". A counter that advertises 11 residuals while only 5 rows physically exist means **6 confirmed, evidence-backed Product bugs are invisible in the working matrix** — they are neither actionable to a next agent nor removable on closure. This is exactly the failure mode the operating model's "Matrix: рабочая очередь, не архив" and the repo's own `matrix_coverage_lib` are designed to prevent.
**Exact anchor:** `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` (AuditRepo HEAD `7547faba`).

### Evidence

#### W2 — Source witness (AuditRepo markdown)

At HEAD `7547faba` the gb-is-my-strength MASTER declares:

```
| Active work units | **13** |
| Narrowed residuals | **11** |
…
## NARROWED RESIDUALS — 11
```

but physically contains only **5 residual rows**:

1. `HTML-BTN-TYPE`
2. `AR-IDX-JS-02`
3. `D-2`
4. `A11Y-OG-META-MALFORMED`
5. `A11Y-SEARCH-MODAL-MISSING`

plus 1 current defect (`D-19`) and 1 owner decision (`SYS-MAIN-ADMISSION-ENFORCEMENT`) = **7 canonical open rows total**, not 13.

#### W3 — Artifact witness (repo's own validator, executed locally)

Running the repo's own canonical coverage engine against the live file produces:

```
matrix integrity problems: 3
  - SECTION-COUNT-MISMATCH: 'NARROWED RESIDUALS — 11' declares 11 but contains 5 canonical rows
  - STATE-COUNT-MISMATCH: Current state row 'Active work units' declares 13 but matrix contains 7
  - STATE-COUNT-MISMATCH: Current state row 'Narrowed residuals' declares 11 but matrix contains 5
```

`scripts/matrix_coverage_lib.py::matrix_integrity_problems` parses the declared counter from the `## … — N` header and the `Current state` table, counts canonical rows, and emits these diagnostics. `main()` returns exit code **1** (CI failure) unless `--warn-only` is passed.

#### W6 — History witness (git commit forensics)

Two commits on 2026-08-18 bumped the counters **without** inserting the corresponding row bodies (their patches end at the table header `|---|---|`):

- `86e4400a4e` 20:30:35Z — "audit: admit A11Y-LANG-MISSING, SEO-ORPHAN-PAGE, and BUG-PATH-RESOLVE-DOTS to MASTER" → `Active work units 7→10`, `Narrowed residuals 5→8`, but **no row additions** in the hunk.
- `8ef37c99c8` 20:35:42Z — "audit: admit 3 new technical bugs to MASTER" → `Active work units 10→13`, `Narrowed residuals 8→11`, but **no row additions** in the hunk.

The 6 admitted-but-undisplayed IDs, each with a backing evidence report that **does** exist on disk:

| Missing matrix ID | Evidence report (exists on HEAD) |
|---|---|
| `A11Y-LANG-MISSING` | `verified/verification/2026-07-17-a11y-lang-missing/REPORT.md` |
| `SEO-ORPHAN-PAGE` | `verified/verification/2026-07-17-seo-orphan-page/REPORT.md` |
| `BUG-PATH-RESOLVE-DOTS` | `verified/verification/2026-07-17-bug-path-resolve-dots/REPORT.md` |
| `BUG-CSS-VAL-COMMENT-SENSITIVITY` | `verified/verification/2026-08-18-css-val-comment-sensitivity/REPORT.md` |
| `BUG-SW-MISSING-PRECACHE` | `verified/verification/2026-08-18-sw-precache-missing-assets/REPORT.md` |
| `BUG-CSS-VAL-ANONYMOUS-LAYER-BYPASS` | `verified/verification/2026-08-18-css-val-anonymous-bypass/REPORT.md` |

So the evidence exists; only the matrix rows were dropped — a silent write that mutated the counters and headers but not the row bodies.

#### W4 — Browser/CI-runtime witness (GitHub Actions)

`auditrepo-validate` CI run records for the offending commits:

| commit | workflow conclusion | timestamp |
|---|---|---|
| `8ef37c99` (admit 3 bugs) | **failure** | 2026-08-18T20:35:45Z |
| `f2751126` (pass 4 incoming) | **failure** | 2026-08-18T20:39:28Z |
| `9512b6a2` | **failure** | 2026-08-18T20:41:23Z |
| `7547faba` (latest; touched only an incoming README) | success | 2026-08-18T20:46:58Z |

The latest green run is **not** proof the matrix is repaired: commit `7547faba` did not modify `MASTER_BUG_MATRIX.md`, so the workflow set `RUN_MATRIX_COVERAGE=0` (see the `Capture changed paths` step's grep gate) and the coverage gate was **skipped**. The matrix-integrity defect therefore persists at HEAD but is currently shielded from CI by the changed-paths gate. This is an independent witness angle (CI behaviour) confirming the defect is live and undetected by the most recent run.

### Mechanism / root cause

The two "admit" commits wrote only the header counter and the `Current state` table values, then terminated the diff before the residual row block. The most likely mechanism is a partial/aborted matrix edit (or a merge-tool resolution that dropped the row-addition hunk while keeping the counter hunk). Because `main` is **not** branch-protected (per the `SYS-MAIN-ADMISSION-ENFORCEMENT` owner-decision row itself), these commits landed directly on `main` and the red CI did not block them — precisely the uncontrolled admission path that row warns about.

This is a single root cause with three symptoms (section header, two Current-state rows); it should be one `SYS-*`-style AuditRepo work unit, not three.

### Required terminal outcome

1. **Restore row↔counter parity** in `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`: either re-insert the 6 missing residual rows (preferred, since their evidence reports already exist and are `CONFIRMED`) or, if any was actually closed/stale, update the counters down and record the disposition in `CLOSURE_LEDGER.md` / `legacy/`.
2. Re-run `python3 scripts/check_matrix_coverage.py --verbose` locally until "OK: compact active matrix coverage checks passed"; confirm `auditrepo-validate` goes green **with** `RUN_MATRIX_COVERAGE=1` (i.e. on a commit that actually touches the matrix).
3. Do **not** treat the latest `7547faba` green run as evidence of repair — it skipped the coverage gate.

### Collision / owner note

Eight open AuditRepo PRs are active on this project surface (e.g. #328 brand-title writer authority, #331 brand-title system root + search/RSS defects). Before editing MASTER, check whether any open PR already re-inserts these rows, to avoid a parallel competing mutation (per CONCURRENT_EDIT_PROTOCOL §2 and the operating model Collision rule). Prefer landing this as a narrow MASTER repair on a branch that owns only these 6 row IDs + the two counter corrections.

### What this does NOT prove

- Does not prove the 6 underlying Product bugs are still current on the Product HEAD — each has its own dated evidence report and must be re-verified against current Product `main` before any Product repair (per the TLP-style "audit marathon CLOSED … reopen only on materially changed surface" discipline).
- Does not prove a data-loss or security incident; this is an audit-truth/coverage defect internal to AuditRepo.
- Does not touch the TLP matrix, which is internally consistent (30 open, 0 integrity problems).

## Summary

| ID | Finding | Type | Impact |
|---|---|---|---|
| `GB-MASTER-COUNT-DRIFT-20260818` | gb-is-my-strength MASTER declares 11 narrowed residuals / 13 active units but physically contains 5 / 7; 6 evidence-backed admitted bugs are invisible in the active matrix | AuditRepo-internal / `audit-drift` / matrix-coverage violation | medium-high (active work SSOT is internally inconsistent and currently unguarded by CI) |

**Evidence labels:** `verified-source`, `verified-artifact` (repo's own validator executed), `verified-lifecycle` (git forensics + unprotected-main mechanism), `audit-drift` (false-green CI via changed-paths gate skip).
