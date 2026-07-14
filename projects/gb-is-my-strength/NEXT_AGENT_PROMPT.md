# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-14.** Source HEAD: `bd8cb9a0` (main, authoritative `git ls-remote origin main`,
> коммит 2026-07-13 20:17Z). ⚠️ Прежний `b8459bdf` **не существует как git-объект** — история разошлась
> (`P2-SSOT-DRIFT-2026-07-14`). **Prod deploy 🔴 RED** (verified 2026-07-14): Deploy #1568 fail
> (`css:layer:validate` — `site.css` 210 `!important` > 202), Metadata&IndexNow #1330 fail (5 metadata
> records missing), Visual Parity #383 fail; Native Source Contract #151 ✅. Прежняя запись «GREEN @
> `29065454930`@b8459bdf» ссылалась на несуществующий SHA.
> **Первоочередное:** 3 P1 deploy-blocker из контент-сессий 07-11..13 — `P1-CSS-IMPORTANT-GATE-DRIFT`,
> `P1-EDITORIAL-METADATA-REGISTRY-GAP`, `P1-NAGORNAYA-JS-UNREGISTERED` (последовательны; зелёный требует всех трёх;
> +10 `site.css` `!important` — реальные WCAG-фиксы, развязывать архитектурно, НЕ удалять). Детали:
> `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_bd8cb9a0_css-important-gate-drift.md`.
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог + план волн W0–W10).
> Прежние промпты (Pass 71 `8c318010`; 2026-07-06 `14a49be8`) устарели; SEARCH-016/017 и
> KARTY-Q-BUG-P0 — уже закрыты (см. матрицу), не переоткрывать.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
```

1. Сверь HEAD: если `main` уехал с `bd8cb9a0` — сначала запиши reverify-дельту (что изменилось), не работай по старой правде. ⚠️ Локальные checkout'ы молча откатываются на container-reset — доверяй только `git ls-remote origin main`.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9 и «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` §0–§2 (что подтверждено, что опровергнуто) и §3 (в какой волне твоя задача).

## Текущее состояние (одним абзацем)

Прод = main, **но деплой сейчас 🔴 RED** (3 workflow, см. шапку выше) — публикация заблокирована CSS-`!important`-контрактом + metadata-registry + unregistered JS. Точечные открытые баги + их счётчики — в `verified/MASTER_BUG_MATRIX.md` (единственный владелец счётчиков, здесь намеренно не дублируются). Главная работа — системная, волнами из SUPER_AUDIT: **W1 транзакция релиза (P0) → W2 редакционные даты (P0) → W3 SW/кэш → W4 route-реестр/sitemap/IndexNow → W5 security/XSS → W6 Bible-корпус → W7 семантические гейты → W8 SEO-очистка → W9 a11y/perf → W10 автоматизация AuditRepo**. W0 (гигиена правды) выполнена 2026-07-06.

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
7. Позитивные заявления («чисто», «надёжно») — только с именованным инвариантом, окружением и негативным тестом (GATE-29).
8. AuditRepo обновляй атомарно с фиксом: строка в матрице + статус в SUPER_AUDIT + reverify при смене HEAD.

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
