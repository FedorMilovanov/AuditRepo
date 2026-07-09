# Verified

Здесь живёт только **текущая каноническая операционная правда**. Исторические версии и прежние handoff-документы индексируются в `../archive/` или остаются доступны по immutable Git SHA.

## Current canonical set — 2026-07-09

Current source HEAD checked: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.

Initial Gill V10 baseline: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.

1. `START_HERE.md` — текущая сводка для владельца и следующего агента.
2. `MASTER_BUG_MATRIX.md` — канон активных operational IDs и текущих счётчиков.
3. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md` — официальный current-head Gill V10 intake.
4. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md` — supporting detailed baseline research.
5. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_30d9fb61.md` — current-head delta after Part III image restoration.
6. `SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting historical systemic backlog; **reverify-needed**, not automatically current at `30d9fb61`.

## Canonicality rules

- Matrix rows are operational root-cause IDs; detailed sub-findings live in intake evidence.
- A source-structural claim may be `confirmed-source-current` when directly verified at current SHA.
- Browser/production behavior must not be promoted from source inspection alone.
- A finding is not `repair-ready` until it has current SHA, evidence, owner decisions where required, repair lane and not-stale check.
- Do not keep parallel “current” ledgers in `verified/`.

## Current Gill delta

Merge PR #50 did not change `GillPart3ArticleBody.astro`; the V10 structure/TOC/ownership findings remain current. It introduced `GILL-V10-RESTORED-FIGURE-RELOCATION`: figures are SSR-rendered after the article and moved client-side to semantic locations. The exact impact needs browser/Pagefind/print verification.

## Historical material

The previous matrix, project README and next-agent prompt reflected mixed 2026-07-06/08 states. Their immutable versions remain at AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274` and are indexed by `../archive/stale/2026-07-09-pre-gill-v10/README.md`.

## Special note: Gill

The current Gill V10 work is an audit/editorial architecture package, not a source fix. The accepted implementation sequence is:

```text
canonical graph → manifest → Reader/outline → ownership relocation
→ Part III cleanup → Research brief → Part IV → atomic publication
```

Part IV must not be authored additively before the relocation phase.