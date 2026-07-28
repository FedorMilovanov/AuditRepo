# Print/PDF ref normalization completion — 2026-07-28

## Authority

This record executes the normalization set authorized by `references/PRINT-PDF-CONTENT-DISPOSITION-2026-07-28.md`.

Target site main:

- `b40044713b9fa09e404d5f57b2016d31f4cc88c6`
- `docs(governance): fix reference split link drift (#491)`

Forensic preservation was completed before mutation:

- combined anchor `archive/forensic-print-pdf-histories-20260728`;
- dedicated PR #280 archive `archive/forensic-print-decoration-pagination-pr280-20260725`;
- dedicated PR #288 archive `archive/forensic-live-print-timing-witness-pr288-20260725`.

## Final pre-mutation verification

Immediately before ref movement, every authorized branch still equaled its audited historical head exactly:

| Ref | Audited head | Result |
|---|---|---|
| `lane/reader-ui-pdf-system-polish-2026-07-24` | `ba52d50177af7c2fde62b80ee623cbf93cd43c84` | identical |
| `fix/reader-print-paper-contract-2026-07-24` | `565bd033f93a3ee88a51104e7c34aadc2c4c390e` | identical |
| `fix/gill-series-print-orphan-2026-07-25` | `1647e687e8e92dcbd9aaf3e87190bf962bd6d2e4` | identical |
| `fix/universal-print-pagination-marathon-2026-07-25` | `15436ad01e75878dd336b865c06f69dcc631a8d6` | identical |
| `fix/print-decoration-pagination-final-2026-07-25` | `b110450cb9cb47974e96e51ff15b618c448f63f5` | identical |
| `fix/print-reversible-card-physical-contract-20260725` | `4dc1e155b990660687c568ded5541c10768d5d1c` | identical |
| `verify/live-print-decoration-2026-07-25` | `b7eb9f8d84a375166956dd87c10cc30d9ce89162` | identical |

Site `main` was then re-read and remained `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

## Ref operations

All seven authorized refs were force-moved to the target main SHA.

| Ref | Operation | Result |
|---|---|---|
| `lane/reader-ui-pdf-system-polish-2026-07-24` | update to `b400447...` | success |
| `fix/reader-print-paper-contract-2026-07-24` | update to `b400447...` | success |
| `fix/gill-series-print-orphan-2026-07-25` | update to `b400447...` | success |
| `fix/universal-print-pagination-marathon-2026-07-25` | update to `b400447...` | success |
| `fix/print-decoration-pagination-final-2026-07-25` | update to `b400447...` | success |
| `fix/print-reversible-card-physical-contract-20260725` | update to `b400447...` | success |
| `verify/live-print-decoration-2026-07-25` | update to `b400447...` | success |

Summary:

- successful updates: **7**;
- failed updates: **0**;
- branch deletions: **0**;
- product commits created: **0**;
- publication/deploy changes: **0**.

## Protected exclusions rechecked after normalization

### Tooltip tail

`fix/print-decoration-pagination-2026-07-25` was not touched. It remains exactly two commits ahead of PR #280 head `ccbdb6959cc32d8b9f650b02793222b6e99d8c2b`, with changes limited to:

- `scripts/tooltip-style-normalizer.js`;
- `scripts/tooltip-style-normalizer-test.js`.

This tail requires a separate content decision because it removes `!important` from floating-tooltip pointer-event ownership while current `main` deliberately retains priority-bearing rules.

### Reused production-witness ref

`verify/reader-production-postmerge-2026-07-24` was not touched. It remains a later reused state, diverged from PR #253 head by 99 commits ahead / 9 behind.

Neither exclusion is authorized for cleanup by this record.

## Final disposition

The seven print/PDF working refs are normalized without losing product or diagnostic history. The two out-of-scope refs remain protected for separate audits. All forensic archives remain intact.