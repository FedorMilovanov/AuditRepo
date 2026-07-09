# Project Registry

Список проектов, проходящих мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Current canonical entry |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active / repair-in-progress / older systemic backlog reverify-needed** | `verified/START_HERE.md` → `verified/MASTER_BUG_MATRIX.md` |

## Status glossary

- `active` — проект в работе.
- `intake-only` — сырые отчёты есть, канонической сводки ещё нет.
- `verifying` — идёт дедупликация и проверка.
- `repair-ready` — current-head evidence, repair lane and owner decisions собраны.
- `repair-in-progress` — source implementation идёт, но reverify не закрыл цикл.
- `reverify-needed` — источник ушёл вперёд относительно старого verified документа.
- `archived` — активная работа завершена.

## gb-is-my-strength current summary — 2026-07-09

- Current source HEAD checked: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.
- Initial Gill V10 baseline: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.
- Research HEAD checked: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.
- AuditRepo base before Gill V10 branch: `18713174a343740cc0886df6c6441c51bde61274`.
- Active matrix: 6 P0, 6 P1, 11 P2, 19 P3, 4 refactoring, 3 AuditRepo = 49 active items.
- Historical closed/fixed count retained: 90.
- Current major intake: `projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/`.

### Current priority truth

1. Gill Part IV is not an additive article task. First resolve canonical content source, series manifest, outline/Reader AST, topic ownership and Part III duplication.
2. Historical Gill submenu count is an obsolete content contract; visual witness and current outline completeness must be separate gates.
3. Merge PR #50 restored Part III figures through runtime relocation. `GILL-V10-RESTORED-FIGURE-RELOCATION` requires browser/Pagefind/print verification and direct semantic placement.
4. TTS ~280 MB consent/lifecycle remains an owner UX decision and is a separate lane.
5. `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` remains supporting evidence but is tied to old source SHA; reverify before repair.

### Primary current documents

1. `projects/gb-is-my-strength/verified/START_HERE.md`
2. `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`
3. `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md`
4. `projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md`
5. `projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`
6. `projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_30d9fb61.md`

## Registry rules

- Project status must name one current canonical entrypoint.
- Do not hardcode old bug counts in root README prose; use the project matrix.
- When source HEAD moves significantly, mark old systemic documents `reverify-needed` rather than silently treating them as current.
- Raw `incoming` evidence is never rewritten or silently deleted.
- Superseded canonical handoffs are indexed in `archive/stale/` or by immutable commit pointer.

## How to add a new project

1. Create the project folder with `scripts/scaffold_project.py`.
2. Confirm `PROJECT_META.yml` exists.
3. Add the project row here.
4. Create the first intake with `scripts/scaffold_intake.py`.
5. After verification, add `verification/START_HERE_<date>.md` and `verified/START_HERE.md`.
