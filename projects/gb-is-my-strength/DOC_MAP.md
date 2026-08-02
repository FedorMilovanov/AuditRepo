# 🗺️ DOC MAP — gb-is-my-strength (read this first)

> Один файл, чтобы не утонуть. Здесь: какие документы существуют, **кто чем владеет**,
> что канон, что история, и какой минимальный ритуал нужен только при материальном
> изменении фактов.
>
> Правило, которое всё это держит: **Single-Writer-Per-Fact** — у каждого факта ровно
> один владелец-файл. Все остальные документы **ссылаются**, а не переписывают. Полная
> формулировка — в корневом [`CLEANUP_RETENTION_POLICY.md`](../../CLEANUP_RETENTION_POLICY.md) §8.

## Owner directive: verified backlog → zero

`MASTER_BUG_MATRIX.md` — практический durable backlog найденных и верифицированных
проблем, **не телеметрия каждого source commit, route count, deploy или active PR head**.
Цель — последовательно довести verified open backlog до нуля:

```text
exact-anchor verification
→ close FIXED / STALE / FALSE-POSITIVE / DUPLICATE
→ narrow PARTIAL findings
→ bounded repair of CONFIRMED-CURRENT findings
→ exact-head reverify
→ repeat until open = 0
```

Не создавай отдельную authority-sync транзакцию только потому, что `main` сдвинулся.
AuditRepo обновляется, когда материально меняются disposition, scope, evidence,
repair-readiness, счётчики или meaningful handoff. Это правило зеркалит owner directive,
закреплённый в source `AGENTS.md` и `docs/OWNER-INVARIANTS.md` коммитом `3aba5112`.

---

## 1. Кто чем владеет (единственный источник факта)

| Факт | Владелец (SSOT) | Все прочие доки |
|---|---|---|
| Открытые/закрытые баги, severity, счётчики | **`verified/MASTER_BUG_MATRIX.md`** | ссылаются |
| Meaningful handoff: выбранный verification anchor, deploy-authority, что делать дальше | **`NEXT_AGENT_PROMPT.md`** | ссылаются |
| Системный бэклог + план волн W0–W10 | **`verified/SUPER_AUDIT_2026-07-06_14a49be8.md`** | ссылаются |
| Стабильная ориентация проекта (что это, стек, freeze-зоны, порядок чтения) | **`README.md`** | — |
| Портфель проектов (какие вообще есть) | **`/PROJECT_REGISTRY.md`** (корень) | ссылается сюда |
| Контракт PremiumControls (in-flight зона владельца) | **`PremiumControls/README.md`** | — |
| Среда Arena (Node, гейты, build-mode ловушки) | **`/SANDBOX-ENV-2026-06-21.md`** (корень) | — |

**Не дублируй чужой факт.** Если нужен выбранный verification anchor или текущий handoff —
ссылайся на `NEXT_AGENT_PROMPT.md`. Не пытайся хранить каждый новый source SHA в README,
REGISTRY и матрице: именно лишние копии HEAD/счётчиков порождали дрейф (AR-014).

---

## 2. Жизненный цикл находки

```text
incoming/<agent>/<date>/     raw evidence, не repair-ready правда
        │ verifier выбирает exact source anchor, сверяет и дедуплицирует
        ├─ FIXED-CURRENT / STALE / FALSE-POSITIVE / DUPLICATE
        │      → канонически закрыть, сохранить provenance/evidence
        ├─ PARTIAL/NARROWED
        │      → оставить открытым только фактический остаток
        ▼
MASTER_BUG_MATRIX «ОТКРЫТО»  CONFIRMED-CURRENT finding
        │ bounded closing lane: root cause + checks + exact final head
        ▼
MASTER_BUG_MATRIX «ЗАКРЫТО»  компактная строка с immutable evidence
        │ когда громоздкие evidence/reverify-доки больше не нужны активной работе
        ▼
archive/fixed|stale|false-positive/  история сохранена; строка/registry disposition живёт
```

**Долгострой** (рефакторинг `R-*`, многомесячный karty-Atlas) остаётся «ОТКРЫТО» с явной
пометкой *deferred* — не архивируется автоматически, пока реально не сделан или не
получил другой проверенный disposition.

**Не удаляй историю бесследно.** Реальный исправленный баг закрывается как fixed,
архитектурно устаревшая формулировка — stale, ошибочный claim — false-positive, дубль —
merged/duplicate. Частичный fix сужает строку до реального остатка.

**Не чини raw/suspected claims.** Product mutation разрешён только после exact-anchor
вердикта `CONFIRMED-CURRENT` и bounded repair-ready scope. Независимые root causes идут
разными mergeable lanes, а не одним гигантским «закрыть всё» PR.

---

## 3. Что канон, что история

- **Канон (читать):** `MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`,
  `SUPER_AUDIT_2026-07-06_14a49be8.md`, `README.md`, `PremiumControls/README.md`.
- **Evidence (сверяться, не считать автоматически правдой):** всё в `incoming/` и
  `reverify/`.
- **История (не действовать без новой верификации):** всё в `archive/**` и секции с
  пометкой «ИСТОРИЧЕСКИЙ ЛОГ». Позитивные заявления («чисто», «надёжно») не переносятся
  в канон без свежей проверки на выбранном exact anchor.

Source движение само по себе не меняет disposition строки. Новый вердикт появляется
только из новой применимой проверки evidence-critical поверхности.

---

## 4. Пропорциональный ритуал закрытия сессии

Обновляй только файлы, чьи факты реально изменились:

1. **`MASTER_BUG_MATRIX.md`** — когда finding открыт, закрыт, реклассифицирован, сужен,
   объединён или когда из-за этого изменились канонические счётчики.
2. **`NEXT_AGENT_PROMPT.md`** — только когда materially изменился meaningful handoff:
   выбран новый verification/repair anchor, изменился deploy-authority или следующий
   конкретный шаг. Не использовать как журнал каждого source commit.
3. **`reverify/CURRENT_HEAD_REVERIFY_<date>_<head>.md`** — когда действительно проведена
   current-head verification, которая поддерживает disposition или repair gate. Простая
   смена `main` без проверки finding не требует нового reverify.

Если работа не изменила статус/evidence/handoff, не делай косметический AuditRepo-sync.
Если bounded repair доказан и приземлился, не откладывай meaningful closure бесконечно:
закрой соответствующую строку в той же closure-сессии или явным следующим атомарным PR.

**Не трогай** README / PROJECT_REGISTRY, если не изменились стабильные факты (стек,
freeze-зоны, появился/закрылся целый проект). Они намеренно почти статичны.

---

## 5. Быстрая навигация

| Хочу… | Иду в |
|---|---|
| увидеть verified backlog и закрывать его к нулю | `verified/MASTER_BUG_MATRIX.md` |
| понять выбранный anchor и следующий meaningful шаг | `NEXT_AGENT_PROMPT.md` |
| разобрать системную работу волнами | `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` |
| проверить сырое исследование агента | `incoming/<agent>/<date>/` |
| понять устройство проекта и freeze-зоны | `README.md` |
| не спалиться на среде Arena (Node/build) | `/SANDBOX-ENV-2026-06-21.md` |
