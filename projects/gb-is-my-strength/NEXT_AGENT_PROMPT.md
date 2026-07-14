# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-14 (FAST-loop RCA пройден).** Source HEAD: `2ca2af3b` (main; merge «Библейский атлас — карта
> Авраама»; мерджи «Генеалогия v1» `0aee617`, сердечные статьи А3–Д1, фиксы Нагорной/karty/
> map/hard-texts). **Prod deploy 🔴 RED** — с 2026-07-11 `deploy.yml` падает на шаге `Static
> publication gates` и параллельно фейлятся `Metadata & IndexNow Readiness` (registry structure) и `Visual Parity Guard — pixel-diff`
> (56 failure + 24 cancelled, 0 success после run `29138555390` @ `007b67de`;
> последняя попытка — run `29338523013` @ `2ca2af3b`). Контент серий «Сердце», Атлас v1 и
> карта Авраама **не доехали до продакшена** — P0 DEPLOY-STATIC-GATES-RED-2026-07-11 в матрице.
> **RCA локализован (arena-auditor-2026-07-14)**: `audit-pro`/`validate` walk(ROOT) не скипят `scripts/` (ложные срабатывания на build-шаблонах `scripts/genealogy-build/*.html`, placeholder `/*__ATLAS__*/;` валит inline-script syntax + все HTML-контракты), `js/nagornaya-bar-extras.js` не внесён в `ALLOWED_JS` в `audit-pro.js`; реальные регрессии: `site.css !important` 210 > ceiling 200, 2 path-leak `AuditRepo/...` в markdown, oversized `images/atlas-export/avraam-{hires,preview}.png`, 38 orphan images; плюс `data/editorial-metadata.json` без 5 новых статей, visual-parity нуждается в owner-approved baseline refresh.
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог + план волн W0–W10);
> атлас-трек KA-0…KA-8 — в `working/atlas/DEBT-REGISTER.md`.
> Прежние промпты (Pass 71 `8c318010`; 2026-07-06 `14a49be8`; 2026-07-10 `b8459bdf`)
> устарели; SEARCH-016/017 и KARTY-Q-BUG-P0 закрыты (см. матрицу), не переоткрывать.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
```

1. Сверь HEAD: если `main` уехал с `14a49be8` — сначала запиши reverify-дельту (что изменилось), не работай по старой правде.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9 и «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` §0–§2 (что подтверждено, что опровергнуто) и §3 (в какой волне твоя задача).

## Текущее состояние (одним абзацем)

Прод = main, **но деплой красный на Static publication gates с 11 июля** (P0 DEPLOY-STATIC-GATES-RED-2026-07-11) — RCA локализован в проходе 2026-07-14: блокирует не одна «загадочная» ошибка, а **комплекс из 11 ошибок audit-pro + missing editorial-metadata records + визуальный пиксель-бейзлайн**, среди которых часть — tooling-ложные срабатывания на build-шаблонах `scripts/genealogy-build/*.html` (audit-pro/validate walk не скипят `scripts/`) и отсутствие `js/nagornaya-bar-extras.js` в `ALLOWED_JS`, а часть — реальные регрессии (!important ceiling, path-leak в markdown, oversized/bitmap-orphans). Полный список и repair-lane (п.1–8) — в `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md` §FAST-loop RCA и в строке P0 матрицы. Точечные открытые баги и их счётчики живут в `verified/MASTER_BUG_MATRIX.md` (единственный владелец). Главный системный приоритет сейчас — **W1 транзакция релиза (P0)** — красный деплой блокирует продвижение всех других волн; Атлас/Сердца/Нагорная фиксы не доезжают до продакшена с 11 июля. План волн SUPER_AUDIT по-прежнему: W2 редакционные даты (P0) → W3 SW/кэш → W4 route-реестр/sitemap/IndexNow → W5 security/XSS → W6 Bible-корпус → W7 семантические гейты → W8 SEO-очистка → W9 a11y/perf → W10 автоматизация AuditRepo. Дополнительный in-flight трек — Атлас/Генеалогия (KA-0…KA-8, в работе владельцем; верифицированные результаты интейков в `incoming/claude-atlas-deep-audit/` и `working/atlas/DEBT-REGISTER.md`). W0 выполнена 2026-07-06.

## Зоны in-flight — НЕ ТРОГАТЬ без владельца

- **PremiumControls / Floating Cluster / Gill-визуал** — владелец активно дорабатывает («не доделано», freeze-правила AGENTS §3.10). Не закрывать/не открывать PC-находки, не менять визуал.
- **Глоссарий (data/glossary.json) и Библия-тултипы** — владелец обновляет данные. Инфраструктура вокруг них (санитайзер W5, версия кэша W3, корпус W6) — приоритетна, но координируй с этим треком; массово не править данные.

## Нагорная проповедь — актуальное состояние (3 цикла аудита 2026-07-14)

**20 багов** (6 P1 + 10 P2 + 4 P3). Архитектурный корень: **NG-CSS-01** — `tw.min.css` содержит 0 dark-селекторов, вся тёмная тема — `!important` хаки в `mobile-hotfix.css`.

**Ключевые P1:**
- **NG-DARK-01** → 54 Tailwind-класса без dark-ремапа (168× text-600, 47× text-700, 52× border-stone-100)
- **NG-CSS-01** → tw.min.css без dark-вариантов (архитектурная причина NG-DARK-01)
- **NG-BODY-01** → `bg-stone-100` на body не ремапится, фон светло-серый в dark
- **NG-STRUCT-01** → Секции ch.2–5 без group-wrapper (регресс Astro-миграции), emoji вместо SVG
- **NG-INLINE-01** → «Из библиотеки» на inline стилях, невидимы в dark

**Единое решение:** `data-chapter="N"` + per-chapter `--ng-accent`/`--ng-accent-soft` CSS custom properties → закрывает NG-CSS-01 + NG-BODY-01 + NG-DARK-01 + NG-DARK-04/05.

**Дальнейшие шаги:**
1. Создать `css/nagornaya-chapter-vars.css` с per-chapter CSS vars (light + dark)
2. Добавить `data-chapter="N"` на `<body>` в 5 `index.astro`
3. Заменить accent Tailwind-классы на `var(--ng-accent)` в Section-компонентах
4. Создать `NagornayaLibraryLinks.astro` → убирает ~98 inline style=
5. Удалить 15 мёртвых компонентов
6. Fix NG-SEO-01 (add scripture meta ch.4/5, update footer version)

Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md`

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
