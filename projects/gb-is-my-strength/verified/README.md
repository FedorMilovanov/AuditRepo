# Verified

Здесь живёт только **каноническая операционная правда**. Raw intake, working synthesis и verification queue не становятся каноническими только потому, что на них есть ссылки из этого слоя.

## Current canonical set — 2026-07-09

Source HEAD checked: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.

1. `START_HERE.md` — текущая каноническая сводка для владельца и следующего агента.
2. `MASTER_BUG_MATRIX.md` — 38 canonical open/carry-over rows плюс отдельная, **не считаемая канонической**, таблица 11 Gill V10 candidates pending cross-verification.
3. `SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting historical systemic backlog; reverify-needed against current source.

## Non-canonical supporting layers

### Working

- `../working/START_HERE_2026-07-09.md` — Gill V10 candidate synthesis.

### Verification

- `../verification/START_HERE_2026-07-09.md` — witness queue and promotion thresholds.

### Raw intake

- `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/` — official evidence package; not a verified ledger.

## Current counts

```text
38 canonical open/carry-over rows
11 Gill V10 candidates pending cross-verification
90 historical closed/fixed rows
```

Do not describe the project as having “49 active confirmed bugs”.

## Canonicality rules

- One source witness may be labeled `verified-source`, but remains `needs-cross-verification` under the repository multi-witness protocol.
- Browser/production behavior must not be promoted from source inspection alone.
- `confirmed-current` and `repair-ready` require the thresholds in `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.
- Owner editorial decisions are not substitutes for technical witnesses, and technical witnesses are not substitutes for owner editorial decisions.
- Do not keep parallel current ledgers in `verified/`.

## Current Gill status

The Gill V10 package is **not** a source-fix order. It is a candidate map awaiting independent witnesses. One stale subclaim was already removed during recheck: current `GillSeriesRail.astro` correctly counts only three Roman-numbered parts, so the old `Часть 3 из 5` display defect is not part of the candidate manifest issue.

## Historical material

The previous matrix and handoffs remain available at immutable AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274` and are indexed by `../archive/stale/2026-07-09-pre-gill-v10/README.md`.