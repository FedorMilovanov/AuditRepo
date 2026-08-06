# AuditRepo

Центральный репозиторий для **мультиагентных аудитов, доказательств, причинного анализа и вариантов улучшения**.

Здесь можно проводить десятки независимых проходов по одному проекту, складывать сырые отчёты, подтверждать и опровергать находки, объединять симптомы в системные причины и выбирать любую удобную глубину исправления.

Главный контракт: [`AUDITREPO_OPERATING_MODEL.md`](AUDITREPO_OPERATING_MODEL.md).

```text
many audit passes
→ evidence corpus
→ verification wave when useful
→ root-cause synthesis
→ owner-selected repair scope
→ proportional closure
```

## Чего AuditRepo не делает

AuditRepo не является второй копией source-репозитория. Он не обязан после каждого Product-коммита:

- переписывать глобальный current HEAD;
- синхронизировать deploy SHA и run IDs во всех документах;
- доказывать сохранность каждого старого исправления;
- создавать отдельный reverify и closure PR для каждой строки;
- инвентаризировать все ветки и закрытые PR на каждом обычном изменении Markdown.

Product-репозиторий владеет текущим кодом, ветками, CI и deploy. AuditRepo владеет накопленными наблюдениями, evidence anchors, причинными моделями, очередью выбранных работ и историей решений.

---

## Перед аудитом

Прочитай [`SANDBOX-ENV-2026-06-21.md`](SANDBOX-ENV-2026-06-21.md), чтобы не создавать ложные находки из-за неверной версии Node, неправильного build mode, отсутствующего `dist/`, ограничений vision или особенностей Arena.

Для `gb-is-my-strength` production-like результат строится strangler-цепочкой, а не одним `astro build`.

---

## Структура

```text
AuditRepo/
├── AUDITREPO_OPERATING_MODEL.md   ← назначение, статусы, волны, пропорциональность
├── README.md                       ← быстрый старт
├── CONTRIBUTING.md                 ← практический workflow агентов
├── MULTI_WITNESS_VERIFICATION_PROTOCOL.md
├── CLEANUP_RETENTION_POLICY.md
├── PROJECT_REGISTRY.md
├── scripts/
└── projects/
    ├── _templates/
    └── <project>/
        ├── README.md               ← стабильная ориентация проекта
        ├── DOC_MAP.md              ← кто каким фактом владеет
        ├── WORK_QUEUE.md           ← необязательная выбранная очередь
        ├── incoming/               ← сырые неизменяемые проходы
        ├── working/                ← временные синтезы и verification waves
        ├── verification/           ← конфликты и решения
        ├── verified/               ← активный backlog, system themes, closures
        ├── reverify/               ← только существенные перепроверки
        └── archive/                ← история
```

---

## Freedom with Evidence

Любой агент может:

- найти новый дефект или улучшение;
- подтвердить или оспорить чужое наблюдение;
- предложить duplicate/merge/split;
- найти более глубокую root cause;
- классифицировать finding как stale, invalid, parked или not-worth-fixing;
- предложить локальную или системную repair lane;
- провести пакетную verification wave.

Агент не должен:

- переписывать чужой `incoming`;
- превращать сырую гипотезу в обязательную Product-работу;
- считать движение общего `main` автоматической причиной обновлять AuditRepo;
- заявлять live/security/rights вывод без соответствующего evidence;
- создавать тяжёлую control-plane цепочку ради простой документационной правки.

---

## Evidence model

Важны независимые **углы доказательства**, а не количество агентов:

- surface;
- source;
- artifact;
- browser;
- lifecycle;
- history.

Один сильный production-like browser witness может быть достаточнее трёх одинаковых grep-проходов. Усиленный барьер нужен для security, rights, data loss, release identity и production incidents; обычный P2 не должен проходить слепой многоступенчатый ритуал.

Подробно: [`MULTI_WITNESS_VERIFICATION_PROTOCOL.md`](MULTI_WITNESS_VERIFICATION_PROTOCOL.md).

---

## Official input rule

Официальный audit input живёт здесь:

```text
projects/<project>/incoming/<agent>/<YYYY-MM-DD>/
```

Минимально:

```text
README.md   ← кто, что, на каком evidence anchor и в какой среде проверял
REPORT.md   ← наблюдения, доказательства, ограничения и выводы
```

Создание intake:

```bash
python3 scripts/scaffold_intake.py <project> <agent-name> <YYYY-MM-DD>
```

Raw reports сохраняются как evidence. Они не обязаны быть current truth и не редактируются задним числом.

---

## Verification wave

Верификатор может взять любой пакет находок и классифицировать его одним проходом:

- `current-local`;
- `systemic-root`;
- `duplicate-symptom`;
- `stale`;
- `invalid`;
- `parked`;
- `not-worth-fixing`;
- `owner-decision`.

Один verification PR может обработать десятки строк. Один системный fix может поглотить множество симптомов. Один мелкий finding можно закрыть отдельно. Размер волны выбирает владелец.

---

## Implementation handoff

Перед Product-изменением implementation-agent:

1. читает verified synthesis и релевантное raw evidence;
2. проверяет **только выбранную поверхность** на актуальной версии Product;
3. решает, это локальный дефект или системная причина;
4. запускает проверки, которые способны упасть от конкретного diff;
5. после merge фиксирует минимальный честный disposition.

Старый verified finding — полезная отправная точка, но не автоматическое разрешение менять сегодняшний Product.

---

## Автоматические проверки

Обычный AuditRepo PR проходит лёгкую структурную проверку. Глубокая matrix coverage и branch/closed-PR forensic выполняются по расписанию, вручную или когда меняются их собственные governance-файлы.

AuditRepo не должен сам производить больше служебной работы, чем обнаруженная проблема.

---

## Проекты

Список проектов: [`PROJECT_REGISTRY.md`](PROJECT_REGISTRY.md).

Для `gb-is-my-strength` начни с [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).
