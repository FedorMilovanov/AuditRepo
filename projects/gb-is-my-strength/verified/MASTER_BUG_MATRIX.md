# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current audit chain:
- [`../verification/2026-08-10-full-zero-wave-01/REPORT.md`](../verification/2026-08-10-full-zero-wave-01/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md`](../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md`](../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md)

## Current state

| Поле | Значение |
|---|---|
| Active work units | **2** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |
| Product verification anchor | `main@9e9556a2e0a389b351ea4f0490275128a6eed046` |
| Current Lot PR exact head | `#1456@e25bee467aa87a2fcb357ad44609bdd4a2ae174a` |
| Open Product PRs | **1** — `#1456` |
| Product remote branches at latest census | **123** |
| Open Product issues at Wave 01 snapshot | **24** |
| Automated CI-failure lifecycle issues in that snapshot | **10** |
| Active stabilization MASTER units | **2** |
| Current-head observed workflows for `#1456` | **20/20 terminal SUCCESS** |

Major former roots are already closed completed: `#1298`, `#1299`, `#1359`, `#1369`, `#1383`, `#1384`. Lot reader figures, rights-safe Scripture projection and exactly 28 Lot production WebPs are already merged into `main`.

---

## SYSTEM VERIFICATION LANES — 2

| ID | Status | Required terminal outcome | Current owner / evidence boundary |
|---|---|---|---|
| `LOT-PUBLICATION-CLOSURE` | `MERGE-READY-CANDIDATE` | Finish the one remaining publication transaction: confirm exact current main / exact 16-file diff / clear review-thread state, move Draft→Ready, guarded merge, then obtain post-merge/live witness for `/articles/lot-i-sodom/` and close `#1295`. | Product `#1456` / `release/lot-publication-20260809-r4`. Exact connector head `e25bee467aa87a2fcb357ad44609bdd4a2ae174a`; current main remains `9e9556a2…`; every one of the 20 observed exact-head workflows is terminal SUCCESS, including Runtime Interactive and Visual Parity. Evidence: `verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md`. No second Lot lane is allowed. |
| `SYS-REPOSITORY-CONVERGENCE-CLOSURE` | `systemic-root` | After Lot is actually live, run one final fresh-current-main release/convergence audit, retire current-lane CI residue, prove no release-required orphan work, close `#1403`, and STOP the stabilization wave. | Product `#1403` + Full-Zero reports. Evidence: `verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md`. Do not promote unrelated old backlog into this finish line. |

---

## VERIFIED POST-STABILIZATION TECHNICAL RESIDUE

These are real or strongly evidenced current SYSTEM roots discovered/reverified in Wave 03. They **must not delay current #1403** unless the current release candidate proves them blocking. After #1403 closes, process serially under the hard-finish contract; do not spawn parallel successors.

| Issue | Current disposition | Evidence |
|---|---|---|
| `#1249` | `VERIFIED CURRENT DEFECT` | Current Shared Files workflow still uses `github.event.pull_request.base.sha` as protected-diff base instead of a proven live merge-base. |
| `#1247` | `VERIFIED CURRENT GOVERNANCE DEFECT` | Current Lane Lock Policy explicitly says machine ownership is stateless and has no lease / TTL / heartbeat. |
| `#1224` | `PARTIALLY FIXED — RESIDUAL REAL` | Back authority `#1258` and relation-state `#1259` merged; current ReaderRail still has invalid direct `<span>` under `<ul>` and Menu/Search meaning conflation. Current Gill conditional quiz orphan is already fixed and must not be replayed. |
| `#1244` | `PARTIALLY FIXED — VERIFY BROADER CONTRACT` | Concrete Baptist trigger witness fixed by merged `#1245`; current workflow still uses manually enumerated paths. Inspect current workflow-policy/control-plane tests for a general validator→input closure witness before deciding repair vs close. |
| `#1225` | `REVERIFY CURRENT PRINT/A11Y` | No matching implementation PR found; likely semantic residual, but promote only after fresh representative screen + physical print proof. |

---

## STALE-OPEN / CLOSE-CANDIDATES FOUND IN WAVE 03

These must not remain active Product bugs if their final targeted receipt stays green:

- `#1288` — **current source already implements requested authority split**: H1/title drift is enforced only for authoritative legacy; strict-native/reference-only routes use built PageHead/Search title authority.
- `#1239` — **already solved**: stale CRC32 wording is absent from current `AGENTS-REFERENCE.md`; current `scripts/cache-bust.js` remains explicit MD5/8 `md5short()` authority.

---

## MOVE OUT OF ACTIVE PRODUCT-DEFECT INVENTORY

These are legitimate ideas/work, but are not proven current Product regressions and must not masquerade as blocking bugs:

- `#1243` — measurement-only Search latency study; move to `WORK_QUEUE.md` unless measurement proves a regression;
- `#1242` — Search fixture/test-health hardening; Work Queue unless a current runtime defect appears;
- `#298` — future owner-approved Product-golden quality system;
- `#1360` — genuine future Baptist provenance-backed media completion, but not current stabilization unless broken/lying live media is separately proven.

`#54` is a stale Hermenevtika umbrella candidate: run one current route smoke, preserve any unique residual, otherwise consolidate into newer roots `#1224/#1225` and close as absorbed rather than reopening a mega-wave.

---

## BRANCH / CI LIFECYCLE FORENSIC

### Proven live refs

- `main`;
- `release/lot-publication-20260809-r4` while `#1456` remains open.

### Direct SAFE DELETE proof already obtained

- `transport/reader-projection-rebase-20260805` — `ahead=0` vs current main;
- `transport/search-manifest-main-refresh-after-1270-20260808` — `ahead=0` vs current main.

### Strong superseded/history candidates

- four `transport/lifecycle-retired-identities*` refs — canonical lifecycle repair is merged `#987`; final exact-ref semantic containment receipt still required;
- `release/lot-publication-20260809-r3` — predecessor superseded by current `#1456`;
- `system/scripture-tooltip-projection-20260809` — semantic successor merged via `#1452`;
- `agent/owner-ui-reference-authority-20260809` — historical Strangler owner after completed `#1383`;
- `lane/system-favorites-store-20260805` — PR `#1040` explicitly superseded by merged `#1061`.

### Manual forensic remains

- seven legacy-reference `transport/*` refs have small unique transaction ancestry and require named-successor containment before deletion;
- `noop` and `tmp/noop-search-ci-tree-20260808` are **not** safe by name: both retain large historical Search/revision ancestry.

No branch is deleted by name, age or raw `ahead_by` alone.

---

## Finite full-zero execution order

1. Finish `#1456` without scope expansion: final review/current-main receipt → Ready → guarded merge → live witness.
2. Close `#1295`.
3. Run one final fresh-main convergence/release audit and close `#1403`; stabilization STOP.
4. Retire stale CI-failure issues tied to dead/superseded branch identities.
5. Close stale-open `#1288` and `#1239` after their final targeted receipts.
6. Consolidate `#54`; move measurement/quality/future-content items out of active Product-defect inventory.
7. Process verified post-stabilization SYSTEM roots **serially** (`#1249`, `#1247`, residual `#1224`, `#1244` if still real, `#1225` if reverified).
8. Continue branch cemetery by bounded families: transport/tmp/ci → explicit predecessor/successor refs → stale agent/system/lane owners → unexplained unique tails → archives last.
9. Re-run issue census after every closure wave; no new root unless fresh current evidence proves it.
10. Declare full zero only when: no open Product PR; no unexplained live CI red; every open issue has terminal disposition; every non-main branch has KEEP/DELETE/SUPERSEDED/MANUAL disposition; no orphan release-required unique work; current main audit green; active MASTER = 0.

## Stop rule

```text
finish current work
→ verify exact head
→ integrate
→ prove live result
→ close root
→ retire stale identities
→ repair only verified residue
→ MASTER = 0
→ repository understandable
→ STOP
```
