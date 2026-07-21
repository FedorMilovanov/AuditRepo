#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path('projects/gb-is-my-strength')
next_path=ROOT/'NEXT_AGENT_PROMPT.md'
matrix_path=ROOT/'verified/MASTER_BUG_MATRIX.md'
next_text=next_path.read_text(encoding='utf-8')
matrix=matrix_path.read_text(encoding='utf-8')


def sub_once(pattern,replacement,text,label,flags=0):
    out,count=re.subn(pattern,replacement,text,count=1,flags=flags)
    if count!=1: raise SystemExit(f'{label}: expected 1, found {count}')
    return out

# NEXT_AGENT_PROMPT
next_text=next_text.replace('1f80f12d8bea9a9eb2c196ed030ddfc5be3924df','1a66bd8ef6c0316842deef75371db9598f7a16c6')
next_text=next_text.replace('PR #94 release-unblock, PR #95 runtime-integrity и PR #96 map-runtime P0s landed','PR #94–96 release/runtime fixes и PR #97 initial-state/deep-link transaction landed',1)
next_text=next_text.replace('На PR #96 exact source tree прошли','На PR #97 exact source tree прошли',1)
next_text=next_text.replace('exact deployed SHA `1f80f12`','exact deployed SHA `1a66bd8`')
next_text=next_text.replace('CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md','CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md')
next_text=next_text.replace('# expect 1f80f12… or newer','# expect 1a66bd8… or newer')
next_text=next_text.replace('если `main` уехал с `1f80f12`','если `main` уехал с `1a66bd8`')
next_text=next_text.replace('зелёные на `1f80f12`','зелёные на `1a66bd8`',1)
next_text=next_text.replace('fresh witness на `1f80f12`','fresh witness на `1a66bd8`')
next_text=next_text.replace('На `1f80f12` книжная модель','На `1a66bd8` книжная модель')

next_text=sub_once(
 r'\*\*Раздел карт /karty/ — живой P0 остаток после PR #96:\*\*[\s\S]*?\n- \*\*Парадигма владельца',
 '''**Раздел карт /karty/ — живой P0 остаток после PR #97:** `MAP-P0-01` (mobile panel escape), `MAP-P0-06` (inert layer toggles), `MAP-P0-07` (theme variables не управляют hardcoded palette), `ASTRO-P0-03`..`ASTRO-P0-06` (warning/data counters/error fallback) и `DATA-P0-01` (authored curved paths игнорируются). `MAP-P0-04/05` закрыты единой initial-state транзакцией и browser witnesses на `ishod`/`avraam`; не переоткрывать без fresh witness на `1a66bd8` или новее.

- **Следующий обязательный SYSTEM lane:** `MAP-P0-06` + `MAP-P0-07` — рабочее membership-переключение слоёв и единая theme palette без визуального редизайна.
- **Затем:** mobile panel, data validation/fallback и authored route geometry отдельными lanes.
- **Парадигма владельца''',
 next_text,'NEXT current karty state')

next_text=sub_once(
 r'## 🔥 Приоритет №1 — исправить initial-state / deep-link transaction карт[\s\S]*?(?=## Зоны in-flight)',
 '''## 🔥 Приоритет №1 — восстановить рабочие layers и реальную theme palette карт

Текущий порядок (по `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`):

1. Создать SYSTEM lane только для `MAP-P0-06` + `MAP-P0-07`.
2. Нормализовать layer membership: один элемент может принадлежать нескольким слоям, toggle не должен зависеть от exact equality одного `data-layer`.
3. Зафиксировать единый layer registry и проверять реальные DOM-match counts на `ishod` и `avraam`.
4. Вынести используемые SVG/DOM цвета в theme palette или CSS variables; toggle должен менять карту, маршруты, подписи и панели, а не только иконку.
5. Добавить static/pure guard и Chromium pixel/DOM witnesses минимум на двух live routes.
6. Перед merge: полный `validate:static-publication`, `guard:shared-files`, production-like build и browser witnesses.
7. Отдельно подтвердить exact deployed SHA `1a66bd8` или более новый и только тогда закрыть `PROD-STALE-DEPLOY-RED`.

**Не смешивать** с cartography redesign, mobile panel, authored path geometry, PremiumControls, glossary или content lanes.

''',next_text,'NEXT priority',flags=re.M)

# Matrix masthead and fixed rows.
matrix=sub_once(r'^\| Source HEAD \|.*$', '| Source HEAD | `1a66bd8ef6c0316842deef75371db9598f7a16c6` (main; PR #97 initial-state/deep-link transaction landed after PR #94–96 runtime/release wave) |', matrix,'matrix source',flags=re.M)
matrix=sub_once(r'^\| Deploy \|.*$', '| Deploy | 🟠 **RELEASE GATES GREEN / EXACT DEPLOYED SHA PROOF PENDING (reverified 2026-07-21).** PR #97 passed full static publication, shared guards, production-like build and Chromium query/hash/localStorage witnesses on `ishod`/`avraam`. Do not close `PROD-STALE-DEPLOY-RED` until exact deployed SHA `1a66bd8` or newer is recorded. |',matrix,'matrix deploy',flags=re.M)
matrix=sub_once(r'^\| Last reverify \|.*$', '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md` |',matrix,'matrix reverify',flags=re.M)
matrix=matrix.replace('CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md','CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md')

fixed_rows='''| MAP-P0-04 | ✅ **FIXED 2026-07-21.** Initial camera is resolved before render; unconditional first-place `flyTo` removed; explicit URL > saved state > route/story viewport. | `1a66bd8` PR#97 |
| MAP-P0-05 | ✅ **FIXED 2026-07-21.** Query and legacy hash use one atomic parser/URL builder; story chips, markers, place panel, history and storage synchronize; Chromium witnesses passed on `ishod`/`avraam`. | `1a66bd8` PR#97 |
'''
for bug_id in ['MAP-P0-04','MAP-P0-05']:
    matches=re.findall(rf'^\| {bug_id} \|.*$',matrix,flags=re.M)
    if len(matches)!=1 or 'FIXED 2026-07-21' in matches[0]: raise SystemExit(f'{bug_id}: unexpected source rows {len(matches)}')
    matrix=re.sub(rf'^\| {bug_id} \|.*\n','',matrix,count=1,flags=re.M)
anchor='| ID | Описание | Коммит |\n|---|---|---|\n'
if matrix.count(anchor)!=1: raise SystemExit('fixed anchor mismatch')
matrix=matrix.replace(anchor,anchor+fixed_rows,1)

matrix=sub_once(r'^\| PROD-STALE-DEPLOY-RED \|.*$', '| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-21 REVERIFY:** source/release gates green at `1a66bd8` after PR #94–97, including Chromium deep-link witnesses. Keep open only as exact deployed-SHA proof task; do not cite old PNG/static/deep-link failures as current cause. | verified-source + verified-pr-gates; deploy witness pending |',matrix,'prod row',flags=re.M)

session_anchor='> Сюда идут per-session заметки о HEAD-переходах и что влито — **чтобы мастхед оставался\n> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n'
if matrix.count(session_anchor)!=1: raise SystemExit('session anchor mismatch')
matrix=matrix.replace(session_anchor,session_anchor+'- **2026-07-21 — Source HEAD `1a66bd8`: MAP-P0-04/05 landed.** PR #97 unified query/hash/saved/default initial state, removed competing camera/storage readers, added permanent pure guard and Chromium witnesses on `ishod`/`avraam`. Full publication/shared/production-like gates green; exact deployed SHA proof pending. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`.\n\n',1)

# Recompute fixed and P0 table counts from actual rows.
fixed_start=matrix.index('## ✅ ЗАКРЫТО')
fixed_end=matrix.index('\n---\n\n## 🔴 P0/P1',fixed_start)
fixed_count=sum(1 for line in matrix[fixed_start:fixed_end].splitlines() if line.startswith('| ') and not line.startswith('| ID ') and not line.startswith('|---'))
matrix=re.sub(r'## ✅ ЗАКРЫТО \(\d+\)',f'## ✅ ЗАКРЫТО ({fixed_count})',matrix,count=1)

p0_start=matrix.index('## 🔴 P0/P1')
p0_end=matrix.index('\n---\n\n## 🟠 P1',p0_start)
p0_count=sum(1 for line in matrix[p0_start:p0_end].splitlines() if line.startswith('| ') and not line.startswith('| ID ') and not line.startswith('|---'))

matrix=sub_once(r'^\| Закрыто \(fixed\) \| \d+ \|$',f'| Закрыто (fixed) | {fixed_count} |',matrix,'fixed stats',flags=re.M)
matrix=sub_once(r'^\| \*\*P0 открыто\*\* \| \*\*\d+\*\* \|$',f'| **P0 открыто** | **{p0_count}** |',matrix,'p0 stats',flags=re.M)
# Total is explicit categories in the stats table.
counts={}
for label in ['P1 открыто','P2 открыто','P3 открыто','Рефакторинг','AuditRepo']:
    m=re.search(rf'^\| {label} \| (\d+) \|$',matrix,flags=re.M)
    if not m: raise SystemExit(f'missing stats {label}')
    counts[label]=int(m.group(1))
total=p0_count+sum(counts.values())
matrix=sub_once(r'^\| \*\*Всего открыто \(матрица\)\*\* \| \*\*\d+\*\* \|$',f'| **Всего открыто (матрица)** | **{total}** |',matrix,'total stats',flags=re.M)
matrix=sub_once(r'## Статистика \(обновлено .*?\)', '## Статистика (обновлено 2026-07-21: PR #97 initial-state/deep-link transaction)',matrix,'stats heading')
matrix=sub_once(r'^\| Passes processed \|.*$', '| Passes processed | 100+ (reverify 2026-07-21 @ 1a66bd8; PR #97 initial-state/browser witnesses) |',matrix,'passes',flags=re.M)

next_path.write_text(next_text,encoding='utf-8')
matrix_path.write_text(matrix,encoding='utf-8')
print(f'patched; fixed={fixed_count}, p0_rows={p0_count}, total_open={total}')
