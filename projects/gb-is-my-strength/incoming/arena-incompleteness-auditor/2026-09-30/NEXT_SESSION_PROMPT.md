# Next-session prompt — gb-is-my-strength audit (written 2026-09-30, third pass)

Read [`AUDITREPO_OPERATING_MODEL.md`](../../../../../AUDITREPO_OPERATING_MODEL.md),
[`../../../DOC_MAP.md`](../../../DOC_MAP.md) and
[`../../../verified/MASTER_BUG_MATRIX.md`](../../../verified/MASTER_BUG_MATRIX.md) first. This file is
a handoff, not an authority: MASTER wins on every disposition.

## State at handoff (all measured, receipts in-repo)

- AuditRepo branch `arena/01a0f435-auditrepo`, base `054c9c1b1a74f20ead716b835a2f618270dfb78b`.
- Product main `d586aa63f02b569cfe050a63cc9078c044375d8d`; live release
  `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (run `35927303479`). Production has **not** advanced:
  every main push since the #2148 merge fails `Deploy to GitHub Pages` at `Static publication source
  gates`.
- Release-gate truth: `validate:static-publication` = **41** top-level commands, **40 exit 0**, the
  blocker is **#24** `node scripts/audit-pro.js` (Lawson route missing from the sitemap contract).
  Enumerated receipt: `../../../reverify/evidence/2026-09-30-validate-static-publication-command-list.txt`.
- MASTER arithmetic: 26 defects + 0 improvements + 0 narrowed + 2 lanes + 1 owner decision =
  **29 work units**.
- Branch census 37 total / 36 non-main; six open Product PRs (#2153 docs-only, #2150 Lawson catalog
  11 red, #2145 apostasy 4 red **another agent**, #2144 Dependabot 20 red, #2143 draft, #2142
  research-only).

## Standing owner instructions (do not re-litigate)

1. **Lawson release-block decision: stand down.** Another owner-directed effort handles Lawson.
   Measure and preserve receipts; file no Lawson row, propose no Lawson disposition, do not merge
   #2150 as a release fix.
2. **Never restore lost Russian `????` text by guessing.** Only owner-approved originals. None exist
   in the repository for the nine Baptist bodies.
3. **PR #2145 belongs to another agent** — do not take, edit, close or merge it.
4. **A green AuditRepo PR is never a reason to merge a Product PR.**
5. Research plans, old branches and optional improvements are **not** defects;
   `PROGRAM_CLOSURE_MATRIX.md` is a program, not a bug list.

## Do not re-file (already adjudicated)

- **"Human label ≠ `<time datetime>`" is approved design**, not a defect: the owner-approved
  exact-instant reconciliation of 2026-09-08 (`data/editorial-metadata-review-decisions/*-reconciliation-20260908.json`,
  approved-only projection, shape pinned by `scripts/editorial-metadata-v3-approval-gate-test.js:102`).
  Recorded as a MASTER negative boundary. The genuine residuals are *slot* mismatches only:
  `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT` and the narrowed
  `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE`.
- The bare ISO strings visible in HTML→text retrievals of live pages are hidden
  `data-pagefind-meta` spans, not reader-visible text.

## Method boundaries proven in this sandbox (save the next pass the retries)

- ~~**No browser is available**~~ — **RETRACTED 2026-10-01.** `npx playwright install chromium` still fails
  (`ECONNRESET`) and there is still no system Chrome and no sudo, **but** a browser can be assembled from
  public sources: `@sparticuz/chromium` + `playwright-core` from npm, NSS/NSPR built from GitHub mirrors
  (`mozilla/nspr`, `nss-dev/nss`) into `/tmp/nssroot` + `/tmp/browserlibs`, launched with
  `LD_LIBRARY_PATH=/tmp/browserlibs` (~85 min cold, recipe in the receipt headers). Fresh browser evidence at
  Product `d586aa63` therefore exists: `../../../reverify/evidence/2026-10-01-fresh-browser-pass-at-anchor.txt`
  and `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt`. Note the width lesson: a
  single-viewport sweep once produced a false “FALSIFIED” for a media-query-gated row — always sweep at least
  two widths straddling the breakpoint.
- **`fetch_page` drops `<time>` element text** and surfaces hidden Pagefind spans → live byline
  *labels* cannot be witnessed that way. Witness labels from an exact-SHA build instead; witness
  ordinary live text (e.g. the `????` cards) directly. Receipt:
  `../../../reverify/evidence/2026-09-30-live-fetch-time-element-boundary.txt`.
- `curl` to external hosts fails (use `fetch_page`); `gh` log/artifact download is broken (use the
  Actions API and enumerate runs by id/head_sha — the paginated `branch=main` listing omits deploy
  runs); `/tmp` does not survive sessions (copy receipts into `reverify/evidence/`); piped exit
  codes lie (use scripted loops); never grep minified single-line CSS/JS without width limits.
- Local node v22.22.3 vs CI-pinned 22.23.1: local builds/runs are receipts, not CI runs.
- Reproducible build: `npm run strangler:build:production-like` in a full clone (`npm ci`) at the
  exact SHA; ~4 min; use `git worktree add` + a `node_modules` symlink for a second SHA.

## Highest-value next scopes (owner has not chosen one yet)

1. `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT` — smallest artifact-proven repair in
   MASTER: change the class/wording of ten Nagornaya components (or the projector's targeting) plus
   the class-level guard; provable by build alone, no browser needed.
2. Baptist byline labels — five routes at main; needs the owner's `spravochnik` choice first
   («14 июня» authored vs `publishedAt` 2026-06-10).
3. Class-level guard for the dateline contract (no gate asserts projected field ↔ dateline wording,
   nor published-slot label ↔ `publishedAt`).
4. ~~Rows that need a rendering browser remain blocked in this environment~~ — **DONE 2026-10-01**: the
   browser was built in-sandbox and those three rows were re-measured
   (`GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` and `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` confirmed with fresh
   anchors; `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` structurally confirmed but **not** colour-reproduced,
   because Playwright `forcedColors:'active'` leaves the bars white — that harness does not emulate Windows HCM).
   Receipts: `../../../reverify/evidence/2026-10-01-fresh-browser-pass-at-anchor.txt`,
   `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt`.

## Filing discipline for the next pass

- New intake needs an explicit labelled `Audited anchor:`/`Evidence anchor:` with a concrete value;
  `scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>` rejects `-rN` suffixes, so add extra
  same-day passes as additional files inside the existing dated intake directory.
- Run `python3 scripts/validate_audit_repo.py` and `python3 scripts/check_matrix_coverage.py` before
  filing; the deep-audit workflow also runs `repository_history_forensic_audit.mjs --strict` and
  `matrix_coverage_regression_test.py`.
- Keep the distinctions: public page vs byte access vs historical SHA vs visual verification.
