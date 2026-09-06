# DOC MAP — the-legendary-poet

Эта карта объясняет, где искать evidence и кто владеет каждым типом факта.

Главная модель: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

## Fact ownership

| Fact | Owner | Notes |
|---|---|---|
| Current source code, HEAD, open PRs, branches, CI and deploy | `FedorMilovanov/TheLegendaryPoet` | проверять непосредственно перед source work; не копировать постоянно сюда |
| Current audit-marathon disposition | `verification/2026-08-12-audit-marathon-closeout/REPORT.md` | `AUDIT-COMPLETE-AT-ANCHOR`; the Product roots it recorded were repair-pending, not fixed. Row inventory has moved since that anchor — read the count from MASTER, never from this map |
| Raw observations and immutable evidence | `incoming/` | anchor-specific reports; чужие raw reports не переписывать |
| Temporary synthesis and historical wave planning | `working/` | не является постоянным backlog; завершённые synthesis архивируются |
| Active verified engineering backlog | `verified/MASTER_BUG_MATRIX.md` | только текущие verified инженерные строки; закрытое уходит из active surface |
| Systemic cause map | `verified/SYSTEM_THEMES.md` | revalidate only when a theme is selected |
| Optional owner-selected work | `WORK_QUEUE.md` | может быть пустой; не является обязательным backlog |
| Compact wave/closure history | `verified/CLOSURE_LEDGER.md` | append-only proportional outcomes |
| Detailed verification packages | `verification/` | substantial synthesis, disputes and historically valuable waves |
| Significant current checks | `reverify/` | only when needed for selected work or disposition |
| Historical/superseded evidence | `archive/` | evidence, not active guidance |
| Stable project orientation | `README.md` | no volatile global HEAD or run list |

## Start here by goal

| Goal | Read |
|---|---|
| Understand repository rules | `../../AUDITREPO_OPERATING_MODEL.md` |
| Understand this project | `README.md` |
| See whether broad auditing is still active | `verification/2026-08-12-audit-marathon-closeout/REPORT.md` |
| See current verified engineering bugs | `verified/MASTER_BUG_MATRIX.md` |
| See owner-selected next work | `WORK_QUEUE.md` |
| Understand recurring mechanisms | `verified/SYSTEM_THEMES.md` |
| Review recent outcomes | `verified/CLOSURE_LEDGER.md` |
| Inspect current matrix-consolidation proof | `verification/2026-08-07-matrix-consolidation/REPORT.md` |
| Inspect the latest SSOT/backlog integrity audit | `verification/2026-09-06-ssot-matrix-integrity-audit/REPORT.md` |
| Inspect the most recent Product closures | `verification/2026-08-20-community-reconciliation-closure/REPORT.md`, `verification/2026-08-20-theme-contrast-closure/REPORT.md`, `verification/2026-08-24-reader-text-closure/REPORT.md` |
| Inspect W7 route/runtime proof | `verification/2026-08-06-w7-route-runtime-wave/REPORT.md` |
| Inspect historical 2026-08-05 root-cause rows | `archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md` |
| Inspect the retirement mapping for those rows | `archive/superseded/MATRIX_CLEANUP_2026-08-07.md` |
| Inspect W6 branch evidence | historical `working/W6_*_2026-08-05.*` and prior verification/reverify documents |

## Finding lifecycle

```text
observation
→ candidate
→ verified-at-anchor
→ selected-for-current-check only when useful
→ current-local / systemic-root / duplicate / stale / invalid / parked / owner-decision
→ proportional repair or disposition
→ removal from active matrix after closure
```

Movement of source `main` alone does not reopen or stale historical evidence.

## TLP-specific boundaries

- Source architecture and runtime behavior belong to the source repository and its permanent tests.
- AuditRepo records why a systemic measure mattered, which evidence angles proved it and what remains independent.
- Media provenance and publication rights are never inferred from technical availability, an archive ref or an image already present in history.
- The retained deep-research source branch is forensic/evidence ownership, not a merge candidate.
- Open editorial/research issues are not engineering-bug rows unless a concrete engineering defect is independently verified.
- A non-empty current bug matrix does not by itself reopen a completed broad audit; future auditing requires a useful reopen trigger from the closeout report.

## Proportional closure

For a new TLP wave update only what materially changed:

1. a verification report when the synthesis is substantial;
2. `SYSTEM_THEMES.md` if causal understanding changed;
3. `WORK_QUEUE.md` if owner-selected options changed;
4. one compact `CLOSURE_LEDGER.md` entry;
5. `verified/MASTER_BUG_MATRIX.md` when current verified engineering rows are added, closed, parked or reclassified;
6. historical material only during a dedicated consolidation/retirement wave.

Do not rebuild an exact-authority mirror after every source merge.
