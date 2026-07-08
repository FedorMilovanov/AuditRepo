# Verified

Здесь живёт только **текущая каноническая операционная правда**. Исторические версии и прежние handoff-документы индексируются в `../archive/` или остаются доступны по immutable Git SHA.

## Current canonical set — 2026-07-09

Source HEAD checked: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.

1. `START_HERE.md` — текущая сводка для владельца и следующего агента.
2. `MASTER_BUG_MATRIX.md` — канон активных operational IDs и текущих счётчиков.
3. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md` — официальный Gill V10 intake.
4. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md` — supporting detailed research.
5. `SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting historical systemic backlog; **reverify-needed**, not automatically current at `ac26d8e`.

## Canonicality rules

- Matrix rows are operational root-cause IDs; detailed sub-findings live in intake evidence.
- A source-structural claim may be `confirmed-source-current` when directly verified at current SHA.
- Browser/production behavior must not be promoted from source inspection alone.
- A finding is not `repair-ready` until it has current SHA, evidence, owner decisions where required, repair lane and not-stale check.
- Do not keep parallel “current” ledgers in `verified/`.

## Historical material

The previous matrix, project README and next-agent prompt reflected mixed 2026-07-06/08 states. Their immutable versions remain at AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274` and are indexed by `../archive/stale/2026-07-09-pre-gill-v10/README.md`.

## Special note: Gill

The current Gill V10 work is an audit/editorial architecture package, not a source fix. The accepted implementation sequence is:

```text
canonical graph → manifest → Reader/outline → ownership relocation
→ Part III cleanup → Research brief → Part IV → atomic publication
```

Part IV must not be authored additively before the relocation phase.