# Project Registry

Список проектов, проходящих мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Current canonical entry |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active / repair-in-progress; Gill V10 verifying** | `verified/START_HERE.md` → `verified/MASTER_BUG_MATRIX.md` |

## Status glossary

- `active` — проект в работе.
- `intake-only` — сырые отчёты есть, канонической сводки ещё нет.
- `verifying` — идёт дедупликация, независимая проверка и решение статусов.
- `repair-ready` — current-head evidence, witness threshold, repair lane and owner decisions собраны.
- `repair-in-progress` — source implementation идёт, но reverify ещё не закрыл цикл.
- `reverify-needed` — источник ушёл вперёд относительно старого verified документа.
- `archived` — активная работа завершена.

## gb-is-my-strength current summary — 2026-07-09

- Current source HEAD: `ff55161b6858a1bbb0fad5704a11c6b41c961879`.
- Gill functional tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.
- Net compare `30d9fb61..ff55161b`: empty file delta; current tree is identical to the audited tree.
- Research HEAD checked: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.
- AuditRepo base before this branch: `18713174a343740cc0886df6c6441c51bde61274`.
- Canonical open/carry-over ledger: 38 rows.
- Gill V10 working queue: 11 candidates pending cross-verification.
- Historical closed/fixed count retained: 90.

### Current priority truth

1. The Gill V10 package is raw/working evidence, not a verified source-repair order.
2. Six proposed P0, four proposed P1 and one proposed P2 Gill candidates require independent witnesses.
3. Current rail code already fixed the old `Часть 3 из 5` display defect; that stale subclaim was removed.
4. The broader series manifest, content ownership, outline and Reader-model issues remain candidates.
5. TTS ~280 MB consent/lifecycle remains an existing owner UX decision and separate lane.
6. `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` is tied to an older source SHA and requires current-head reverify.

### Current documents by layer

#### Verified

1. `projects/gb-is-my-strength/verified/START_HERE.md`
2. `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

#### Working / verification

3. `projects/gb-is-my-strength/working/START_HERE_2026-07-09.md`
4. `projects/gb-is-my-strength/verification/START_HERE_2026-07-09.md`

#### Raw evidence

5. `projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/`

## Registry rules

- Project status must name one current canonical entrypoint.
- Raw `incoming` evidence is never rewritten or silently deleted.
- Working candidates must not be counted as verified open bugs.
- When source HEAD moves, open a reverify delta before status promotion.
- Superseded canonical handoffs are indexed in `archive/stale/` or by immutable commit pointer.

## How to add a new project

1. Create the project folder with `scripts/scaffold_project.py`.
2. Confirm `PROJECT_META.yml` exists.
3. Add the project row here.
4. Create the first intake with `scripts/scaffold_intake.py`.
5. After synthesis and verification, add the current working/verification/verified entrypoints.