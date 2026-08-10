# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER; provenance хранится в `verification/`, GitHub issues/PR и Git history.

Latest control audit:
- [`../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md`](../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md)

Previous Full-Zero chain:
- [`../verification/2026-08-10-full-zero-wave-01/REPORT.md`](../verification/2026-08-10-full-zero-wave-01/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md`](../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md`](../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md)

## Current verified state

| Field | Current truth |
|---|---|
| Product `main` | `757946da67287354b819737813c0a47095f2d759` |
| Post-history-rewrite anchor | `b8c92eda3af96158dbee4ba53803e90c30cce31c` |
| Semantic commits after rewrite anchor | **2** — SYSTEM C + SYSTEM D only |
| Open Product PRs | **1** — Dependabot `#1538`, currently RED |
| Remote heads | **100 total** |
| Canonical main heads | **1** |
| Current dependency-candidate heads | **1** |
| Other historical/non-main heads | **98** |
| `transport/*` | **0** |
| history-image diagnostic branch | **0** |
| Proven current Product regressions on `main` | **0** |
| Active full-zero closure units | **4** |

History-image rewrite is terminal complete. Old stabilization wave is terminal complete. SYSTEM A→D is terminal complete.

Closed/currently verified roots include:

- `#1295` Lot publication — completed;
- `#1403` stabilization convergence — completed;
- `#1249` live merge-base authority — completed;
- `#1224` reader control semantics residual — completed;
- `#1225` publication footnote truth — completed via merged `#1534`;
- `#1247` machine-distinguishable writer lease — completed via merged `#1536`;
- `#1239` cache-bust documentation drift — completed during Wave 10 verification.

**Do not reopen these roots without fresh current-main evidence.**

---

## ACTIVE FULL-ZERO CLOSURE UNITS — 4

| ID | Status | Required terminal outcome |
|---|---|---|
| `DEP-1538-DISPOSITION` | `ACTIVE / RED CANDIDATE` | Open Dependabot #1538 (`@dagrejs/dagre 3.0.0→3.1.0`, `astro 7.1.6→7.2.0`) must end as exact-head GREEN+MERGED or explicitly CLOSED-NOT-MERGED. Current exact head has failing Route Registry, Deploy Candidate, Native Source and Runtime Interactive. Never merge red merely for zero. |
| `BRANCH-CI-CEMETERY` | `ACTIVE / FORENSIC` | Classify the 98 historical non-main refs by bounded families; delete only with successor/tree/unique-tail proof. Close automated CI-failure issues for identities proven retired/deleted without falsely claiming CI recovery. |
| `NON-CI-ISSUE-ZEROING` | `ACTIVE / VERIFY` | Terminally disposition `#54`, `#1244`, `#1242`, `#1243`, `#298`, `#1360`. Repair only a freshly proven current defect. Preserve future work in AuditRepo queue/roadmap before closing GitHub backlog items if strict open-issue zero is desired. |
| `FINAL-ZERO-AUDIT` | `BLOCKED ON ABOVE 3` | After dependency + branch/CI + non-CI issue lanes terminate, run one sole fresh-main census/audit. PASS only with open PR=0, no unexplained live red, no orphan required work, terminal branch dispositions, terminal issue dispositions, current main green, MASTER=0. Then STOP. |

---

## DEPENDABOT #1538 — LIVE EXCEPTION

Current open PR census is exactly one PR:

`#1538 deps(deps-dev): bump the npm-non-major group with 2 updates`

Exact candidate head observed:

`5a7b035ee04b7ddf658f42c0cbe08bc28b274570`

Successful jobs include Metadata, Node Toolchain, Shared Files and Overlay Runtime.

Failed jobs include:

- Route Registry Validators;
- Deploy Candidate Contract;
- Native Source Contract;
- Runtime Interactive Audit.

Associated lifecycle issues currently include `#1539`, `#1540`, `#1541`, `#1542`.

These failures describe the dependency candidate, **not current main**.

---

## BRANCH / CI CEMETERY

Fresh branch census after Dependabot creation = **100 remote heads**:

- `main`;
- Dependabot #1538 head;
- 98 historical/non-main refs.

Confirmed absent after cleanup/history rewrite:

- all `transport/*` refs;
- `audit/history-image-bloat-20260810`.

The history-cleanup owner observed 99 heads at closure; the later Dependabot branch accounts for the current +1.

Many surviving historical refs emitted fresh Shared Files failures when refs were rewritten/pushed during cleanup. Their CI issues are lifecycle evidence for those identities, not automatically Product bugs.

Rules:

1. no delete by name/age alone;
2. prove PR/successor/tree or exact unique-tail disposition;
3. if unique required Product semantics survives only there → MANUAL REVIEW, no delete;
4. after branch retirement, close its automated CI issues as lifecycle-retired/not-planned;
5. do not rerun ancient CI merely to color history green;
6. branch cemetery agents do not edit Product source.

Recommended non-overlapping families:

- Reader/layout/a11y/diagnostic;
- Search/Home/articles/release;
- Legacy/Strangler/Lot/Baptist/reference/media;
- misc/archive/audit branches last.

---

## NON-CI RESIDUALS

### Verify for stale/absorbed closure

- `#54` — Hermenevtika old mega-umbrella. Do one fresh current route/DoD smoke. If no unique residual survives beyond already completed modern roots, close absorbed/completed. Never resurrect the historical six-PR plan.
- `#1244` — Source Authority trigger closure. The original concrete bypass is now fixed in current workflow: both PR and push include `src/content/articles/**` and `src/components/baptisty-rossii/**`. Verify whether a durable general validator→input trigger-closure witness exists. Only if fresh evidence proves a real general gap should a new bounded SYSTEM repair be allowed.

### Preserve outside current defect inventory

These are not proven current Product regressions:

- `#1242` — Search fixture/test-health hardening;
- `#1243` — Search first-result performance measurement;
- `#298` — future owner-approved Product goldens;
- `#1360` — future Baptist provenance-backed authentic media completion.

For strict GitHub `open issue = 0`, first preserve them in `WORK_QUEUE.md` / roadmap with provenance, then close GitHub as moved/deferred/not-planned. Do not erase the future work.

---

## HISTORICAL-IMAGE REWRITE TERMINAL RECEIPT

The dedicated cleanup lane is closed. Reported and independently consistent boundaries:

- 510 historical-only image blobs removed from owner-managed history;
- purge set durably preserved;
- no new unsaved purge blob at final freeze;
- current Product tree preserved across rewrite;
- recovery bundle stored durably;
- diagnostic PR #1460 closed unmerged;
- history audit branch removed;
- temporary history-image workflows absent from current main;
- GitHub internal `refs/pull/*` intentionally remain outside owner-managed rewrite.

Permanent operational rule:

> **Never push from a pre-rewrite clone/worktree. Fresh clone or full rewritten-ref resynchronization is mandatory.**

---

## FINITE EXECUTION ORDER

### Parallel Phase III-A

1. Dependency #1538 terminal disposition.
2. Reader/layout branch cemetery family.
3. Search/Home/articles/release branch cemetery family.
4. Legacy/Strangler/Lot/Baptist/reference branch cemetery family.
5. Non-CI issue terminal-disposition verifier.

Only branch-cemetery agents may close CI lifecycle issues for branch identities they personally proved retired.

### Phase III-B — one auditor only

After III-A:

1. fresh main SHA/tree;
2. open PR census;
3. branch census;
4. open issue census;
5. live CI identity census;
6. release/build/source/runtime/visual smoke appropriate to current main;
7. orphan unique-work scan;
8. AuditRepo consistency check;
9. MASTER → 0;
10. STOP.

---

## Full-zero Definition of Done

```text
current main green
AND open PR = 0
AND no unexplained intended-to-merge CI red
AND every open issue has terminal disposition
AND every surviving non-main branch is intentionally KEEP
AND every intended-delete branch is actually deleted
AND no orphan release-required unique work
AND future work lives in queue/roadmap instead of bug inventory
AND AuditRepo MASTER active units = 0
→ FULL ZERO
→ STOP
```
