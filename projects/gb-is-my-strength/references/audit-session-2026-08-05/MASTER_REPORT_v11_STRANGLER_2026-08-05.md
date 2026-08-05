# MASTER-ОТЧЁТ v11 — SELF-AUDIT: STRANGLER-HYGIENE НЕ ЗАКРЫТ (я ошибался)

**Дата:** 2026-08-05 · **Source main:** `3a05a1e7` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. ГРУБАЯ ОШИБКА В МОЁМ АУДИТЕ — ИСПРАВЛЕНА

**Я утверждал (несколько раз, вплоть до MASTER_VERIFICATION):**
> «STRANGLER-HYGIENE — кандидат на закрытие: legacy-дублей в корне нет, только 4 служебных html (404/google/index/yandex)».

**Факт (проверено на 3a05a1e7, полным find):**
- **54 legacy `index.html`** в корневых подпапках + articles/ (НЕ только 4 в корне!):
  - 11 корневых: `about/`, `baptisty-rossii/`, `biografii/`, `hard-texts/`, `karty/`, `konfessii/`, `map/`, `nagornaya/`, `pastor-series/`, `rodosloviye/` + сам `index.html`;
  - 12 в `articles/` (включая `articles/index.html`);
  - остальное — глубже (karty/*, nagornaya/*, etc.).
- Astro-страниц: **83**.

**Вывод:** строка `STRANGLER-HYGIENE` (50/53 Astro-маршрутов с дублирующимся legacy HTML) — **ПОДТВЕРЖДЕНА**, а не «кандидат на закрытие». Моя ошибка: искал только `*.html` в корне (4 файла) и не проверил подпапки. Это классическая ошибка «неполного evidence» — ровно то, от чего защищает контракт-система (но её тогда не было для этой проверки).

## 2. Что это меняет

| Где я писал | Было | Теперь |
|---|---|---|
| MASTER_VERIFICATION | STRANGLER-HYGIENE 🟢 кандидат на закрытие | 🔴 ПОДТВЕРЖДЕН (54 legacy vs 83 astro) |
| REVERIFICATION_PASS | в списке «реальность лучше» | убрать |
| Действие | «закрыть» | «оставить открытым; это реальный техдолг» |

## 3. Остальные кандидаты на закрытие — перепроверены (не тронуты)

ENGINE-P1-27 (Escape split), MAP-P1-06 (allowedTabs), QUAL-P1-09 (currentStatus=0), BASE-P1-03 (#22241f=0), DATA-P1-04 (semanticZoom) — эти проверялись точечно, их статус «код лучше» подтверждён отдельными greps ранее. STRANGLER-HYGIENE — единственный, где я поленился проверить подпапки.

## 4. Урок

«Кандидат на закрытие» требует **полного** evidence, включая рекурсивный поиск. Контракт-система (`diff-canonical`) делает это автоматически — но для STRANGLER нет контракта. Добавить: контракт `strangler-legacy-duplicates` (счётчик legacy index.html должен быть ≤ N или роут-маппинг 1:1).

---

*Документ — untracked; будет добавлен в ветку коммитом.*
