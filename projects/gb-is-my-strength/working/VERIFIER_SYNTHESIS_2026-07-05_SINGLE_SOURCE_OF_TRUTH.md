# VERIFIER SYNTHESIS — 2026-07-05 — Single Source of Truth / Multi-Agent Control

## Назначение

Это **не новый широкий аудит** и не новый competing truth document.
Это verifier-синтез, цель которого — уменьшить путаницу между параллельными агентами.

Главный принцип:

> **У проекта должен быть один активный канон — `verified/MASTER_BUG_MATRIX.md`.**

Все остальные документы должны либо:
- поставлять raw evidence,
- либо кратко отражать матрицу,
- но не создавать параллельную реальность.

---

## 1. Иерархия доверия (обязательная)

Для `projects/gb-is-my-strength/` использовать такой порядок:

1. **`verified/MASTER_BUG_MATRIX.md`** — главный канон статусов
2. **`reverify/*.md`** — current-head proof / доказательства статусов
3. **`working/*.md`** — verifier synthesis / reconciliation / conflict control
4. **`incoming/*`** — сырые intake-пакеты агентов
5. **`NEXT_AGENT_PROMPT.md` и `PROJECT_REGISTRY.md`** — только summary convenience, не authority

### Следствие
Если `NEXT_AGENT_PROMPT.md` противоречит `MASTER_BUG_MATRIX.md`, матрица главнее.  
Если `PROJECT_REGISTRY.md` противоречит матрице, матрица главнее.  
Если incoming-report противоречит reverify-doc, reverify сильнее.

---

## 2. Что сейчас выглядит устойчивой правдой

На текущей удалённой ветке (`AuditRepo` remote main и `gb-is-my-strength` remote main) стабильнее всего выглядят следующие утверждения:

### A. `P1-DEPLOY-FAIL` — ⛔ SUPERSEDED 2026-07-05: остаётся ЗАКРЫТ (false reopen)
~~В body матрицы это уже отражено как reopened/current.~~
Reachability-анализ на `68b2bf4c` показал: grep-хит `conclusion == 'failure'` находится в **недостижимом** warn-шаге (deploy.yml:72-75, dead code); job-level `if:` (строки 62-65) блокирует деплой при failure. Канон — матрица (закрыт `29b49df`) + новый P3 `DEPLOY-YML-DEAD-WARN-STEP`. См. `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_content-parity-loss-restored.md` §4.

### B. `BUG-SW-BASELINE-DRIFT` — current, но severity disputed historically
Текущая устойчивая часть утверждения:
- drift между `sw.js` cache version и baseline-файлом существует;
- это current issue;
- спор идёт не о факте, а о тяжести.

Пока нет новой полноценной reconciliation-волны, safest reading:
- issue current,
- severity следует брать из **текущей canonical matrix**, а не из случайного prompt/pass summary.

### C. `SEC-001-VERIFIER` — фикс считается принятым
По текущей матрице security-fix lane считается закрытым / merged.
Без нового contrary evidence это надо трактовать как fixed-current.

---

## 3. Главная проблема сейчас — truth-surface drift

Сейчас не столько баги создают хаос, сколько расхождения между слоями документации:

- `MASTER_BUG_MATRIX.md` body
- matrix header / summary
- `NEXT_AGENT_PROMPT.md`
- `PROJECT_REGISTRY.md`
- старые incoming-pass narratives

Именно это порождает иллюзию, что у проекта несколько конкурирующих состояний одновременно.

### Практически это выглядит так
- body матрицы может быть свежее, чем её header;
- prompt может рекламировать старую "current truth";
- registry может хранить старый SHA и старое число open/closed;
- verifier-проходы могут быть правильными, но summary docs не подтянуты.

---

## 4. Что НЕ надо делать дальше

Чтобы не утонуть в 100+ аудитах, не нужно:

- заводить новый «большой аудит всего проекта» без сильной причины;
- превращать каждый verifier-pass в отдельную competing summary;
- переписывать канон из `incoming/*` напрямую;
- использовать `NEXT_AGENT_PROMPT.md` как источник истины при расхождении с matrix body.

---

## 5. Что надо делать дальше

### Правило 1 — Matrix is law
Все изменения активного truth-state должны либо:
- сразу попадать в `verified/MASTER_BUG_MATRIX.md`,
- либо явно ожидать reconciliation и не выдавать себя за канон.

### Правило 2 — Working is reconciliation layer
Если нужно объяснить расхождения между волнами агентов — это делается в `working/`, а не ещё одним competing “final audit”.

### Правило 3 — Prompt / registry = mirrors
`NEXT_AGENT_PROMPT.md` и `PROJECT_REGISTRY.md` должны быть короткими mirrors от матрицы.
Они не должны жить своей жизнью.

### Правило 4 — Auditor, not fixer
Аудитор:
- reverify,
- confirm,
- challenge,
- merge duplicates,
- isolate false positives,
- keep matrix coherent.

Аудитор не должен silently repair source repo вместо документирования truth.

---

## 6. Самый правильный следующий тип прохода

Если продолжать без разрастания мусора, следующий pass должен быть **не broad audit**, а один из двух:

### Вариант A — truth-surface reconciliation only
Проверить и выровнять:
- matrix header,
- matrix body,
- next-agent prompt,
- project registry.

### Вариант B — targeted reverify only
Перепроверить только стратегические items:
- `P1-DEPLOY-FAIL`
- `BUG-SW-BASELINE-DRIFT`
- `SEC-001-VERIFIER` lineage

Без повторного полного обхода всего репо.

---

## 7. Bottom line

Чтобы не запутаться под множеством агентов:

- **один активный канон = `verified/MASTER_BUG_MATRIX.md`**
- **один reconciliation layer = `working/*.md`**
- **incoming = raw, не canonical**
- **prompt/registry = derivative mirrors**
- **аудитор = verifier, не repair-agent**
