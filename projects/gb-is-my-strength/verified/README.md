# Verified

Здесь живёт только **каноническая операционная правда**. Raw intake, working synthesis и verification queue не становятся каноническими только потому, что на них есть ссылки из этого слоя.

## Current canonical files — 2026-07-09

- Current source HEAD: `ff55161b6858a1bbb0fad5704a11c6b41c961879`.
- Gill functional tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.
- Net compare `30d9fb61..ff55161b`: no changed files.

1. `START_HERE.md` — текущая каноническая сводка для владельца и следующего агента.
2. `MASTER_BUG_MATRIX.md` — 38 canonical open/carry-over rows плюс отдельная, **не считаемая каноническими багами**, таблица 11 Gill V10 candidates pending cross-verification.

## Supporting verified-history document

- `SUPER_AUDIT_2026-07-06_14a49be8.md` — исторический системный аудит, привязанный к старому source SHA. Он сохраняет evidence и план волн, но требует current-head reverify перед использованием как repair truth.

## Non-canonical supporting layers

### Working

- `../working/START_HERE_2026-07-09.md` — Gill V10 candidate synthesis.

### Verification

- `../verification/START_HERE_2026-07-09.md` — witness queue and promotion thresholds.

### Raw intake

- `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/` — official evidence package; not a verified ledger.
- `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_ff55161.md` — current-head freshness proof; not a second witness.

## Current counts

```text
38 canonical carry-over rows
11 Gill V10 candidates pending cross-verification
90 historical closed/fixed rows
```

Do not describe the project as having “49 active confirmed bugs”.

## Canonicality rules

- One source witness may be labeled `verified-source`, but remains `needs-cross-verification` under the repository multi-witness protocol.
- A tree-identical current-head freshness recheck is not an independent second witness.
- Browser/production behavior must not be promoted from source inspection alone.
- `confirmed-current` and `repair-ready` require the thresholds in `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.
- Owner editorial decisions are not substitutes for technical witnesses, and technical witnesses are not substitutes for owner editorial decisions.
- Do not keep parallel current ledgers in `verified/`.

## Current Gill status

The Gill V10 package is **not** a source-fix order. It is a candidate map awaiting independent witnesses. One stale subclaim was removed during recheck: current `GillSeriesRail.astro` correctly counts only three Roman-numbered parts, so the old `Часть 3 из 5` display defect is not part of the candidate manifest issue.

## Historical material

The previous matrix and handoffs remain available at immutable AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274` and are indexed by `../archive/stale/2026-07-09-pre-gill-v10/README.md`.