# AuditRepo Operating Model

## Назначение

AuditRepo — evidence/reasoning слой для мультиагентной работы: сырые аудиты, anchors, проверки, опровержения, root-cause synthesis и выбранная очередь проблем.

AuditRepo **не является** зеркалом Product и **не является летописью всех когда-либо найденных/закрытых багов в активной матрице**.

Короткая модель:

```text
many audit passes
→ evidence
→ verification wave
→ deduplicate / find root cause
→ compact active MASTER
→ repair or owner decision
→ remove solved/stale rows from MASTER
```

---

## Разделение ответственности

### Product владеет

- текущим кодом/HEAD;
- открытыми Product PR и ветками;
- CI/build/deploy/runtime истиной.

### AuditRepo владеет

- raw evidence на конкретных anchors;
- verification/reverify материалом;
- причинной моделью и дедупликацией;
- **одной активной problem matrix для каждого проекта**;
- optional work queue;
- legacy retirement material, когда он нужен для forensic recovery.

AuditRepo не обязан переписывать глобальный Product HEAD после каждого коммита.

---

## Матрица: рабочая очередь, не архив

`projects/<project>/verified/MASTER_BUG_MATRIX.md` — единственная рабочая матрица проекта.

В MASTER разрешены только:

- `current-local` / current-confirmed defects;
- narrowed current residuals;
- current system/root-cause lanes;
- owner decisions, без которых работа не может продолжиться.

Не держать в MASTER:

- `closed-by-fix`;
- `absorbed-by-system-fix`;
- `duplicate-symptom`, если общий root уже имеет строку;
- `stale`;
- `invalid`;
- `not-worth-fixing`;
- superseded wording;
- suspected-only claims без current witness;
- необязательные performance/refactor/polish идеи.

Закрытое/неактуальное удаляется из MASTER **в той же closure/consolidation wave** и при необходимости кратко уходит в `legacy/`. Подробная старая версия уже остаётся в Git history; не надо копировать её обратно в активную матрицу.

Если 30 старых symptom-ID объясняются одной текущей системной причиной, MASTER должен содержать **одну** `SYS-*` строку, а не 30 строк ради исторического счётчика.

Цель — маленькая матрица, по которой можно принимать решение и работать.

---

## Optional work queue

`WORK_QUEUE.md` — место для полезных, но не являющихся текущими дефектами улучшений:

- measurement-first performance work;
- refactoring;
- polish;
- accepted/parked optimization opportunities.

Очередь может быть пустой. Она не должна превращаться во вторую bug matrix.

---

## Жизненный цикл находки

| Статус | Смысл |
|---|---|
| `raw` | сырое наблюдение |
| `candidate` | достаточно конкретно для проверки |
| `verified-at-anchor` | доказано на историческом anchor |
| `selected-for-current-check` | выбрано для актуализации |
| `current-local` | существует сейчас, локально исправимо |
| `systemic-root` | текущая работа должна идти на уровне общего механизма |
| `duplicate-symptom` | поглощено общим root cause; убрать из MASTER как отдельную строку |
| `owner-decision` | требуется решение владельца |
| `parked` | полезно, но не активный дефект; обычно Work Queue |
| `accepted-risk` | риск принят; убрать из активной матрицы |
| `not-worth-fixing` | стоимость несоразмерна; убрать из активной матрицы |
| `stale` | формулировка больше не применима; убрать |
| `invalid` | claim ложный/метод неверен; убрать |
| `fixing` | активная repair lane |
| `closed-by-fix` | исправлено; убрать |
| `absorbed-by-system-fix` | закрыто общим механизмом; убрать |

Исторический `verified-at-anchor` не означает `current-local`: перед Product mutation нужна применимая current-check.

---

## Verification waves

Одна wave может брать 10, 50 или 200 исторических claims и уменьшать их до нескольких текущих единиц работы.

Хороший результат:

```text
50 historical claims
→ 7 current defects
→ 3 system roots
→ 2 owner decisions
→ остальное stale / duplicate / invalid / parked
→ MASTER содержит только 12 рабочих строк
```

Не нужно сохранять 50 строк внутри MASTER ради provenance. Provenance живёт в evidence/Git/legacy, а не в рабочем backlog.

---

## Когда объединять в системную причину

Объединять, если:

1. один механизм объясняет ≥3 симптомов;
2. локальный patch оставляет тот же класс риска;
3. дефект уже возвращался;
4. причина в shared ownership, release/build/cache/data model/audit harness;
5. один контракт реализован несколькими владельцами;
6. один общий owner дешевле и надёжнее набора костылей.

После объединения старые symptom rows убираются из MASTER; текущая `SYS-*` строка хранит краткий список absorbed historical IDs и конкретный next check.

---

## Evidence

Важны независимые углы, а не количество агентов:

- surface witness;
- source witness;
- artifact witness;
- browser witness;
- lifecycle/history witness, когда он действительно помогает объяснить механизм.

Ориентир:

- security/rights/data loss/release identity — 2–3 независимых угла;
- пользовательский P1 — browser/artifact witness + mechanism;
- P2 — один сильный direct current witness;
- P3/polish — screenshot/measurement + решение о целесообразности;
- system root — несколько manifestations + общий mechanism + class-level guard;
- audit defect — доказательство false-green/false-red или неверной измеряемой границы.

---

## Collision rule

Перед любой Product lane:

1. проверить текущие Product open PR/branches;
2. определить owner и protected/shared files;
3. не создавать параллельный fix того же SYSTEM owner;
4. если current owner уже существует — матрица должна ссылаться на него, а не порождать конкурирующую lane.

---

## Branch/PR forensic

Периодически проверять AuditRepo refs и closed/unmerged PRs.

- полезный уникальный материал либо переносится в main/evidence;
- доказанно поглощённые рабочие refs удаляются;
- intentional `archive/*` refs можно оставить только когда они действительно являются forensic authority и их удаление потеряет важный контекст;
- не держать десятки бессмысленных stale branches.

Branch count сам по себе не является целью: цель — отсутствие непонятных и конфликтующих рабочих refs.

---

## Reverify / verification / legacy

- `verification/` / `reverify/` — доказательства существенных current-check/system/security/rights решений.
- `legacy/` — retirement sink для того, что убрано из активной работы и иногда ещё нужно для forensic lookup.
- `legacy/` **не является вторым backlog** и не должен читаться как список задач.
- Git history уже хранит полные старые версии; не дублировать огромные закрытые таблицы без причины.

---

## Terminal attestation и freshness

`PRODUCT ZERO`, `AUDIT ZERO`, `CONTROL-PLANE ZERO` и сходные terminal-формулы — **не вечные свойства проекта**, а evidence-bound снимки конкретного состояния.

Terminal attestation должна явно фиксировать минимум:

- `attested_at` — момент проверки;
- Product `main` SHA, к которому относится code/CI witness;
- момент проверки открытых Product PR/issues;
- состояние релевантных scheduled/hard gates;
- Research HEAD, если вывод опирается на Research authority;
- внешнюю evidence/date boundary, если вывод зависит от живой ссылки, production/API, прав/лицензии или ответа третьей стороны;
- AuditRepo HEAD/PR, которым attestation записана.

Terminal claim становится `STALE` и **не может использоваться как current admission witness**, если после attestation произошло хотя бы одно материальное событие:

1. Product `main` продвинулся так, что затронут проверяемый owner/contract;
2. появился новый current-confirmed defect или красный hard gate;
3. scheduled hard gate, production/API или другая внешняя проверка стала красной/недоступной;
4. Research authority продвинулась в области, на которую опирался вывод;
5. истекла, изменилась или была опровергнута существенная внешняя evidence;
6. изменились admission/ruleset/branch-protection условия, на которых строился control-plane вывод.

`STALE` не означает автоматически «есть баг»: это означает только, что прежний `ZERO` больше нельзя цитировать как доказательство текущего нуля. Нужна свежая current-check на изменившейся границе; неизменившиеся независимые evidence не обязаны перепроверяться без причины.

MASTER не обязан обновляться после каждого Product коммита, но если в нём видимо напечатан terminal `ZERO`, который уже опровергнут свежим current witness, такой текст должен быть помечен stale или заменён в ближайшей текущей consolidation wave.

---

## Closure

### Локальный finding

- current surface проверена;
- mechanism понятен;
- fix слит;
- regression witness есть;
- строка удалена из MASTER.

### Системный finding

- доказан общий mechanism;
- реализован общий owner/process/contract;
- репрезентативные manifestations проверены;
- class-level guard есть;
- absorbed symptom rows удалены из MASTER;
- если независимого остатка нет — `SYS-*` строка тоже удаляется.

### Owner decision

После решения владельца строка либо превращается в конкретную repair lane, либо удаляется как accepted/parked/not-planned.

---

## Automation

Обычный PR: структура, валидность intake, canonical IDs, чужие проекты, diff hygiene; глубокий matrix/evidence forensic — только когда меняются соответствующие owners или запускается consolidation wave.

Не создавать штатно:

- write-capable workflow ради Markdown-правки;
- отдельную authority-sync транзакцию после каждого Product merge;
- reverify-файл на каждую мелкую строку;
- обязательный publisher/cleanup PR-каскад.

---

## Главное правило

```text
Audit deeply.
Keep evidence where evidence belongs.
Keep MASTER small and actionable.
Collapse symptoms into current roots.
Solved or obsolete means removed from MASTER.
Do not turn the problem matrix into project biography.
```