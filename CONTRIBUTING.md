# Contributing / Agent Workflow

AuditRepo — **multi-agent audit intake and synthesis hub**. Он должен хорошо накапливать информацию и помогать выбирать полезную работу, а не постоянно сопровождать каждый commit source-репозитория.

Каноническая модель: [`AUDITREPO_OPERATING_MODEL.md`](AUDITREPO_OPERATING_MODEL.md).

## Core flow

```text
incoming = raw observations and evidence
working  = temporary synthesis and verification waves
verified = durable classifications, active backlog and system themes
archive  = historical material that is no longer active guidance
```

Нельзя превращать одиночную догадку в обязательную Product-задачу. Но и не нужно строить одинаково тяжёлый ритуал для каждого простого дефекта.

---

## Official input

Официальный вход:

```text
projects/<project>/incoming/<agent-name>/<YYYY-MM-DD>/
```

Используй:

```bash
python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]
python3 scripts/scaffold_intake.py <project-folder> <agent-name> <YYYY-MM-DD>
python3 scripts/check_auditrepo_structure.py
```

### Что сохранять в intake

- audited anchor: branch/SHA/artifact/live URL, если применимо;
- среду и build mode;
- scope и исключения;
- команды, логи, screenshots, traces;
- наблюдаемое поведение;
- уверенность и ограничения метода;
- возможную mechanism/root cause;
- ссылки на связанные старые findings.

Audit anchor нужен как provenance конкретного прохода. Не требуется переписывать report при каждом последующем движении `main`.

---

## Что может делать агент

Один report может одновременно:

- добавить новые observations;
- подтвердить или оспорить старые;
- объединить дубли;
- предложить более глубокую системную причину;
- пометить finding как stale/invalid/audit-drift;
- оценить impact, стоимость и риск;
- предложить owner decision;
- предложить локальную или системную lane.

Не нужно искусственно разделять это на много PR, если один пакет логически цельный.

---

## Verification wave

Верификатор не обязан поддерживать вечный `confirmed-current` для всего backlog. Он берёт выбранный пакет и проверяет применимые поверхности на версии, актуальной **для этой волны**.

Рекомендуемые результаты:

- `current-local`;
- `systemic-root`;
- `duplicate-symptom`;
- `stale`;
- `invalid`;
- `parked`;
- `accepted-risk`;
- `not-worth-fixing`;
- `owner-decision`.

Verification wave должна отвечать:

1. Что реально существует сейчас?
2. Какие строки являются одним симптом-кластером?
3. Какой mechanism объясняет кластер?
4. Что выгоднее: локальный fix, системная мера, park или отказ?
5. Какие 1–5 lanes дают максимальный эффект?

Одна волна может обработать десятки findings и завершиться одним synthesis PR.

---

## Evidence proportionality

Считай независимые углы, а не агентов:

- source;
- artifact;
- browser;
- lifecycle;
- history.

Обычные ориентиры:

- security/rights/data loss/release/production — усиленная проверка;
- пользовательский P1 — runtime evidence + mechanism;
- обычный P2 — сильный direct witness;
- P3 — измерение или screenshot и решение о целесообразности;
- systemic root — несколько проявлений и общий mechanism.

Подробно: [`MULTI_WITNESS_VERIFICATION_PROTOCOL.md`](MULTI_WITNESS_VERIFICATION_PROTOCOL.md).

---

## Implementation handoff

Implementation-agent должен:

1. выбрать finding или cluster из verified/working synthesis;
2. перечитать релевантное raw evidence;
3. проверить только evidence-critical owner на текущем Product;
4. определить локальную или системную границу;
5. использовать пропорциональные проверки;
6. после merge записать минимальный честный disposition.

Implementation-agent не обязан сначала синхронизировать весь AuditRepo с последним Product HEAD.

---

## Closure modes

Допустимы разные размеры закрытия:

- одна мелкая строка;
- несколько дублей;
- пакет route-level дефектов;
- systemic root и absorbed symptoms;
- целая verification/repair wave;
- owner decision без Product mutation.

Отдельный `reverify/` документ нужен только для спорного, системного, security/live/rights или исторически ценного решения. Для обычного closure достаточно компактной записи со ссылкой на Product PR и regression witness.

---

## Folder contract

### `incoming/`

Неизменяемые reports и evidence. Сохраняются даже после опровержения.

### `working/`

Временные synthesis, triage, cluster maps и wave plans. После завершения волны материал либо повышается в `verified/`, либо архивируется.

### `verification/`

Конфликты и существенные решения. Не обязан содержать отдельный файл на каждую простую перепроверку.

### `verified/`

Активный backlog, системные темы, owner decisions и компактная история закрытий. Не должен быть складом множества параллельных «current truth» документов.

### `reverify/`

Только значимые перепроверки, а не журнал каждого Product commit.

### `archive/`

История, которая больше не управляет текущей работой.

---

## Naming

Reports:

```text
<topic>-YYYY-MM-DD.md
<topic>-round2-YYYY-MM-DD.md
<topic>-verification-wave-YYYY-MM-DD.md
```

Agent names должны быть стабильными и различимыми:

```text
arena-agent
cursor-agent-1
claude-auditor
gemini-scan-02
```

---

## What not to do

- не переписывать чужой intake;
- не удалять evidence потому, что вывод оказался ложным;
- не считать каждый audit failure реальным Product bug;
- не считать новый Product HEAD автоматической причиной reverify;
- не дублировать один volatile факт в нескольких документах;
- не создавать write-capable temporary workflow ради Markdown;
- не делать compute-only → publisher → cleanup цепочку для простой документационной правки;
- не складывать defects, improvements, refactoring и AuditRepo maintenance в одно число «багов»;
- не требовать live evidence там, где достаточно source/browser contract;
- не гнаться за нулём backlog ценой бессмысленной работы.

---

## Minimum useful result

Хороший вклад делает хотя бы одно:

- добавляет качественное evidence;
- снимает ложную гипотезу;
- объединяет дубли;
- выявляет системную причину;
- улучшает приоритизацию;
- закрывает выбранную работу;
- делает AuditRepo проще использовать.
