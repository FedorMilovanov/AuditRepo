# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-14 (live-reverify).** Source HEAD: **`2ca2af3b`** (main; +287 коммитов
> над `b8459bdf`: PR#72–#88 mobile-chrome/Gill/Hermenevtika readers + TTS RU-voice + gill-quiz CBM,
> merge `0aee6171` генеалогия «Библейский атлас родословий», merge `2ca2af3b` карта Авраама).
> **🔴 Prod deploy RED @ `2ca2af3b`** — 3 workflow падают (Deploy *Static publication gates*
> `29338523013`, Metadata & IndexNow *Validate registry structure* `29338522715`, Visual Parity
> *pixel-diff* `29338522526`). **Прод заперт на последнем зелёном `b8459bdf`** (run `29065454930`);
> генеалогия/атлас + mobile-reader НЕ на проде.
>
> **➡️ ПЕРВЫЙ ПРИОРИТЕТ — разблокировать деплой** (release-транзакция W1, owner-gated). Три корня
> (все воспроизведены локально на `2ca2af3b`, Node v22.22.3): **REG-VALIDATE-GENEALOGY-TEMPLATE**,
> **REG-EDITORIAL-METADATA-MISSING**, **CACHE-BUST-NO-WRITER** — детали в матрице (P1) и
> `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`.
>
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог + план волн W0–W10).
> Прежние промпты (Pass 71 `8c318010`; 2026-07-06 `14a49be8`; 2026-07-10 `b8459bdf`) устарели;
> SEARCH-016/017, KARTY-Q-BUG-P0, CI-INDEXNOW-CHECKER-STALE — уже закрыты (см. матрицу), не переоткрывать.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
```

1. Сверь HEAD: если `main` уехал с `14a49be8` — сначала запиши reverify-дельту (что изменилось), не работай по старой правде.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9 и «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` §0–§2 (что подтверждено, что опровергнуто) и §3 (в какой волне твоя задача).

## Текущее состояние (одним абзацем)

⚠️ **Прод НЕ на main:** штатные гейты **красные** на `2ca2af3b`, прод заперт на `b8459bdf`. Первый приоритет — разблокировать деплой (3 P1-регрессии выше), затем сверить, что генеалогия/атлас реально доехали до прода. Точечные открытые баги + их счётчики — в `verified/MASTER_BUG_MATRIX.md` (единственный владелец счётчиков, здесь намеренно не дублируются). Системная работа — волнами из SUPER_AUDIT: **W1 транзакция релиза (P0) → W2 редакционные даты (P0) → W3 SW/кэш → W4 route-реестр/sitemap/IndexNow → W5 security/XSS → W6 Bible-корпус → W7 семантические гейты → W8 SEO-очистка → W9 a11y/perf → W10 автоматизация AuditRepo**. W0 (гигиена правды) выполнена 2026-07-06.

## Зоны in-flight — НЕ ТРОГАТЬ без владельца

- **PremiumControls / Floating Cluster / Gill-визуал** — владелец активно дорабатывает («не доделано», freeze-правила AGENTS §3.10). Не закрывать/не открывать PC-находки, не менять визуал.
- **Глоссарий (data/glossary.json) и Библия-тултипы** — владелец обновляет данные. Инфраструктура вокруг них (санитайзер W5, версия кэша W3, корпус W6) — приоритетна, но координируй с этим треком; массово не править данные.

## Жёсткие правила (не обсуждаются)

1. Один сабсистем на PR. Волны из SUPER_AUDIT не смешивать.
2. SHA-first: любой фикс/закрытие — с immutable SHA + командой + результатом.
3. Не считать зелёный шаг workflow доказательством (IndexNow глушится `|| true`; `[skip ci]`-HEAD не проверен сам по себе).
4. Паритет Astro↔legacy ≠ правда контента. Байтовое совпадение не закрывает семантические классы.
5. Не деплоить/не мержить с падающими гейтами через ослабление аудита; каждое исключение в гейте — с замещающим семантическим контрактом.
6. Не «исправляй» уже исправленное: сверься с ЗАКРЫТО-таблицей матрицы и §1 SUPER_AUDIT (опровергнутые формулировки).
7. **Пока `DEPLOY-STATIC-GATES-RED-2026-07-11` не закрыт — не мержь новых контентных/фича-коммитов в `main`** без локального FAST-гейта (`npm run guard:shared-files && npm run data:consistency && npm run migration:metadata:check:strict && npm run audit-pro`). Прод-застревание важнее новых фич.
8. Позитивные заявления («чисто», «надёжно») — только с именованным инвариантом, окружением и негативным тестом (GATE-29).
9. AuditRepo обновляй атомарно с фиксом: строка в матрице + статус в SUPER_AUDIT + reverify при смене HEAD.

## Формат финального отчёта

```text
Source functional SHA / bot SHA / deployed SHA:
AuditRepo SHA:
Canonical IDs (матрица/SUPER_AUDIT):
Root cause:
Fix + files:
Tests / mutation tests:
Production-like result (какая цепочка, точный SHA):
Remaining risks:
AuditRepo update (коммит):
```
