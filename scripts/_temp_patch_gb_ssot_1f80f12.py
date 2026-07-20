#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path('projects/gb-is-my-strength')
next_path = ROOT / 'NEXT_AGENT_PROMPT.md'
matrix_path = ROOT / 'verified/MASTER_BUG_MATRIX.md'

next_text = next_path.read_text(encoding='utf-8')
matrix = matrix_path.read_text(encoding='utf-8')


def sub_once(pattern: str, replacement: str, text: str, label: str, flags=0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one replacement, found {count}')
    return updated

# NEXT_AGENT_PROMPT masthead.
next_text = sub_once(
    r'> \*\*Актуально на 2026-07-20\.\*\*[\s\S]*?> Прежние промпты \(`2ca2af3b`, `b8459bdf`, `14a49be8`\) устарели\.',
    '''> **Актуально на 2026-07-21.** Source HEAD: `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df`
> (`main`; PR #94 release-unblock, PR #95 runtime-integrity и PR #96 map-runtime P0s landed).
> **Release gates 🟢 GREEN / exact deployed SHA proof pending.** На PR #96 exact source tree прошли
> `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract.
> Старый PNG stop-point (`shvatim-hires.png`, `shvatim-preview.png`) закрыт PR #94; последующий
> hash-drift `site-utils.js` на 38 HTML/Astro ссылках синхронизирован штатным cache-bust в PR #96.
> Не утверждать post-merge production GREEN, пока exact deployed SHA `1f80f12` не подтверждён отдельным witness.
> 
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги + счётчики)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог W0–W10).  
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`.
> Прежние reverify (`32ae0d7d`, `2ca2af3b`, `b8459bdf`, `14a49be8`) исторические.''',
    next_text,
    'NEXT masthead',
)

next_text = sub_once(r'# expect 32ae0d7d… or newer; if newer — write reverify delta first',
                     '# expect 1f80f12… or newer; if newer — write reverify delta first',
                     next_text, 'NEXT expect')
next_text = sub_once(r'1\. Сверь HEAD: если `main` уехал с `32ae0d7d` — сначала reverify-дельта, не работай по этой правде вслепую\.',
                     '1. Сверь HEAD: если `main` уехал с `1f80f12` — сначала reverify-дельта, не работай по этой правде вслепую.',
                     next_text, 'NEXT head instruction')
next_text = sub_once(r'3\. Прочитай здесь: `reverify/CURRENT_HEAD_REVERIFY_2026-07-20_32ae0d7d\.md`, матрицу \(masthead \+ P0 блок\), SUPER_AUDIT §0–§3\.',
                     '3. Прочитай здесь: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`, матрицу (masthead + P0 block), SUPER_AUDIT §0–§3.',
                     next_text, 'NEXT reverify instruction')

next_text = sub_once(
    r'## Текущее состояние \(одним абзацем\)\n[\s\S]*?(?=\*\*Book mode / «Сердце»\.\*\*)',
    '''## Текущее состояние (одним абзацем)

**Source release gates зелёные на `1f80f12`.** PR #94 снял старый atlas-export PNG blocker; PR #95 закрыл дубли цитат, ARIA и конкурентный scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил постоянный regression guard и исправил обнаруженный full-gate hash-drift `site-utils.js` в 38 HTML/Astro ссылках. Exact post-merge deployed SHA пока не подтверждён доступным connector witness, поэтому `PROD-STALE-DEPLOY-RED` не закрывать декларативно.

**Раздел карт /karty/ — живой P0 остаток после PR #96:** `MAP-P0-01` (mobile panel escape), `MAP-P0-04` + `MAP-P0-05` (viewport/deep-link/share/saved-state precedence), `MAP-P0-06` (inert layer toggles), `MAP-P0-07` (theme variables не управляют hardcoded palette), `ASTRO-P0-03`..`ASTRO-P0-06` (warning/data counters/error fallback) и `DATA-P0-01` (authored curved paths игнорируются). Пять закрытых runtime P0 не переоткрывать без fresh witness на `1f80f12` или новее.

- **Следующий обязательный SYSTEM lane:** `MAP-P0-04` + `MAP-P0-05`, единая транзакция начального состояния с приоритетом `explicit URL > saved state > viewport_init`, синхронизацией story chips/markers и regression tests.
- **Затем:** `MAP-P0-06` + `MAP-P0-07` отдельным lane; mobile panel и data/fallback lanes не смешивать с deep-link state.
- **Парадигма владельца (ВАРИАНТ 1):** карта должна быть красивой географической SVG-картой Ближнего Востока (пергамент, рельеф, синяя акватория, иконки мест, выноски-плашки, дуговые пути), а НЕ простой «картой-схемой» на чёрном фоне.

''',
    next_text,
    'NEXT current state',
    flags=re.M,
)

next_text = next_text.replace('На `32ae0d7d` книжная модель **уже landed**',
                              'На `1f80f12` книжная модель **уже landed**', 1)

next_text = sub_once(
    r'## 🔥 Приоритет №1 — разблокировать деплой[\s\S]*?(?=## Зоны in-flight)',
    '''## 🔥 Приоритет №1 — исправить initial-state / deep-link transaction карт

Текущий порядок (по `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`):

1. Создать SYSTEM lane только для `MAP-P0-04` + `MAP-P0-05`.
2. Ввести единую функцию разбора URL, принимающую query и hash без расхождения Share/loader.
3. Зафиксировать приоритет начального состояния: explicit URL → saved state → `meta.viewport_init`.
4. Не выполнять безусловный first-place `flyTo`, если URL/saved-state/viewport_init уже определили камеру.
5. При deep-linked story синхронизировать `activeStoryId`, chips, markers, stage UI и открытую place panel.
6. Добавить dependency-free/static regression guard и browser witness на минимум двух маршрутах.
7. Перед merge: полный `validate:static-publication`, `guard:shared-files`, Native Source Contract.
8. Отдельно подтвердить exact deployed SHA `1f80f12` или более новый и только тогда закрыть `PROD-STALE-DEPLOY-RED`.

**Не смешивать** с theme/layers, visual cartography redesign, PremiumControls, glossary или content lanes.

''',
    next_text,
    'NEXT priority',
    flags=re.M,
)

# MASTER_BUG_MATRIX masthead.
matrix = sub_once(r'\| Source HEAD \| .*? \|',
                  '| Source HEAD | `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df` (main; PR #94 release-unblock, PR #95 runtime-integrity, PR #96 map runtime P0 + cache-bust repair) |',
                  matrix, 'matrix source row')
matrix = sub_once(r'\| Deploy \| .*? \|',
                  '| Deploy | 🟠 **RELEASE GATES GREEN / EXACT DEPLOYED SHA PROOF PENDING (reverified 2026-07-21).** На PR #96 exact source tree прошли `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract. Старый PNG blocker закрыт PR #94; 38 stale `site-utils.js` revisions исправлены PR #96. Не закрывать `PROD-STALE-DEPLOY-RED`, пока не записан exact deployed SHA `1f80f12` или новее. |',
                  matrix, 'matrix deploy row')
matrix = sub_once(r'\| Last reverify \| .*? \|',
                  '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md` |',
                  matrix, 'matrix reverify row')
matrix = sub_once(r'⚠️ Часть строк в старом P0 deploy-блоке[\s\S]*?provenance\.',
                  '⚠️ Старые 2026-07-14/20 deploy-формулировки ниже исторические. Текущий source/release authority — `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`; exact production deployment остаётся отдельным доказательством.',
                  matrix, 'matrix warning')

matrix = matrix.replace('## ✅ ЗАКРЫТО (95)', '## ✅ ЗАКРЫТО (103)', 1)
closed_anchor = '| ID | Описание | Коммит |\n|---|---|---|\n'
if matrix.count(closed_anchor) != 1:
    raise SystemExit(f'closed table anchor count: {matrix.count(closed_anchor)}')
closed_rows = '''| MAP-P0-02 | ✅ **FIXED 2026-07-21.** Share использует scoped `getState()` внутри `createMap`; `ReferenceError` закрыт, guard проверяет связь с active place/story. | `1f80f12` PR#96 |
| MAP-P0-03 | ✅ **FIXED 2026-07-21.** Delayed search highlight пересчитывает story membership без out-of-scope `inStory`; очистка возвращает opacity `1/.15`. | `1f80f12` PR#96 |
| MAP-P0-08 | ✅ **FIXED 2026-07-21.** Zoom поддерживает обычный click, Enter/Space, programmatic click и press-and-hold без double-fire. | `1f80f12` PR#96 |
| ASTRO-P0-01 | ✅ **FIXED 2026-07-21.** Stage grouping больше не вызывает `.push()` на undefined bucket; production-like/full publication gates green. | `1f80f12` PR#96 |
| ASTRO-P0-02 | ✅ **FIXED 2026-07-21.** Missing/non-integer/out-of-range `stage` отбрасывается до `stagePaths[p.stage].push()`. | `1f80f12` PR#96 |
| RELEASE-CACHE-BUST-SITEUTILS | ✅ **FIXED 2026-07-21.** Full gate обнаружил 38 stale HTML/Astro refs `site-utils.js?v=f6c1f247`; canonical cache-bust sync обновил их до `5ed472a0`, повторный `validate:static-publication` green. | `1f80f12` PR#96 |
| RUNTIME-HIGHLIGHT-DEDUPE-01 | ✅ **FIXED 2026-07-21.** Старые/новые дубли сохранённых цитат нормализуются по page+text; dialog синхронизирует `aria-hidden`/`inert`. | `779c23c` PR#95 |
| RUNTIME-SCROLL-LOCK-COORD-01 | ✅ **FIXED 2026-07-21.** Общий coordinator не позволяет одному overlay снять scroll-lock другого; permanent runtime harness в Shared Files Guard. | `779c23c` PR#95 |
'''
matrix = matrix.replace(closed_anchor, closed_anchor + closed_rows, 1)

for bug_id in ['MAP-P0-02', 'MAP-P0-03', 'MAP-P0-08', 'ASTRO-P0-01', 'ASTRO-P0-02']:
    matrix, count = re.subn(rf'^\| {re.escape(bug_id)} \|.*\n', '', matrix, count=1, flags=re.M)
    if count != 1:
        raise SystemExit(f'open row removal {bug_id}: {count}')

matrix = sub_once(
    r'^\| PROD-STALE-DEPLOY-RED \|.*$',
    '| PROD-STALE-DEPLOY-RED | 🟠 **2026-07-21 REVERIFY:** source/release gates green at `1f80f12` after PR #94–96, but available connector did not independently resolve the exact post-merge deployed SHA. Keep open only as deployment-proof task; do not cite old PNG/static-gate failure as current cause. | verified-source + verified-pr-gates; deploy witness pending |',
    matrix,
    'PROD row',
    flags=re.M,
)
matrix = matrix.replace('## 🔴 P0/P1 — release / deploy unblock (статус 2026-07-14 вечер)',
                        '## 🔴 P0/P1 — release / deploy + karty runtime (статус 2026-07-21)', 1)

# Statistics: five P0 rows closed, eight closed records added.
matrix = sub_once(r'## Статистика \(обновлено .*?\)',
                  '## Статистика (обновлено 2026-07-21: PR #95 runtime integrity + PR #96 пять karty P0 и release cache-bust)',
                  matrix, 'stats heading')
matrix = matrix.replace('| Закрыто (fixed) | 94 |', '| Закрыто (fixed) | 102 |', 1)
matrix = matrix.replace('| **P0 открыто** | **20** |', '| **P0 открыто** | **15** |', 1)
matrix = matrix.replace('| **Всего открыто (матрица)** | **178** |', '| **Всего открыто (матрица)** | **173** |', 1)
matrix = matrix.replace('| Passes processed | 97+ (reverify 2026-07-19 @ c2c339708252, karty-deep-audit-2026-07-19) |',
                        '| Passes processed | 99+ (reverify 2026-07-21 @ 1f80f12; PR #95–96 runtime/release fixes) |', 1)

session_anchor = '> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n'
if matrix.count(session_anchor) != 1:
    raise SystemExit(f'session anchor count: {matrix.count(session_anchor)}')
session_entry = '- **2026-07-21 — Source HEAD `1f80f12`: release gates green; runtime P0 wave landed.** PR #94 снял исторический atlas-export PNG stop-point; PR #95 закрыл quote dedupe/ARIA/shared scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил permanent map regression guard и синхронизировал 38 stale `site-utils.js` asset revisions. Full `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract green. Exact post-merge deployed SHA proof pending; evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`.\n\n'
matrix = matrix.replace(session_anchor, session_anchor + session_entry, 1)

next_path.write_text(next_text, encoding='utf-8')
matrix_path.write_text(matrix, encoding='utf-8')
print('SSOT patch applied')
