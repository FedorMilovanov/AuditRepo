# АУДИТ — gb-is-my-strength (re-audit cycle 2)

> **Режим:** чистый аудитор (только наблюдение и отчёт, без правки кода).
> **Объект:** `main` @ `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR #48).
> **Дата:** 2026-07-06 (вечерний цикл перепроверки). **Аудитор:** arena-auditor (Node v22.12.0).
> **Продакшн:** 🟢 GREEN — run `28794737410` (`workflow_dispatch`, 2026-07-06T13:22Z, success). Новых CI-прогонов с момента пред. цикла нет.

---

## 0. Регресс-контроль (этот цикл)

| Гейт | Результат | Деталь |
|---|---|---|
| `node scripts/audit-pro.js` (Node 22) | ✅ PASSED (exit 0) | Те же 3 предупреждения: CSS 464636 > 425000; JS 375041 > 365000; magic z-index. Отчёт: `audit/audit-pro-2026-07-06T16-55-50-761Z.md` |
| `npm run validate:all` | ✅ PASSED (exit 0) | 0 errors; 2 неблокирующих warning `title≠og:title` (см. **D-19**) |
| CI deploy runs (GitHub API) | 🟢 1 success / 0 failure | `28794737410` success @ `14a49be8`; пред. failed `28758726417` не повторялся |
| `git fetch` (gb) | ➖ 0 новых коммитов | `origin/main == HEAD == 14a49be8` |
| `git fetch` (AuditRepo) | ➖ в синхроне | локальный HEAD `5c3cda7` == `FETCH_HEAD` |

**Вывод:** регрессий нет. Продакшн стабильно GREEN. Цикл направлен на **углублённую перепроверку** и поиск новых дефектов в уже задеплоенном коде.

---

## 1. Подтверждённые перепроверки

- **D-16 — RESOLVED (повторно подтверждено).** `sw.js:1`: `var CACHE_VERSION="gb-v189-lazy-precache-20260705"`. Фикс `b712bb15` поднял `migration/sw-cache-version-baseline.json` до `gb-v189`. SW readiness-гейт зелёный.
- **D-9 — УТОЧНЕНИЕ (см. D-20).** Ветки слиты в main (delete-safe), **но с origin НЕ удалены** — висят по сей день.
- **D-7 — OPEN (подтверждено).** `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` содержит внутренний путь `// See: AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md §1`. Не ловится `audit-pro.js §14`.
- **D-8 — OPEN (подтверждено).** `deploy.yml:9-33` `paths:` не содержит `*.md`; doc-only пуши не триггерят push-деплой.

---

## 2. Углублённый анализ ранее открытых находок

### D-2 (Med) — css-layer-validator: несоответствие документации и реализации + порог противоречит цели
**Файл:** `scripts/css-layer-validator.js`

1. **Документация лжёт про проверку порядка.** Заголовок (строки 9–15) обещает:
   > `3. All @layer blocks are in the declared order`
   Реализация (строки ~54–72) **никогда не проверяет порядок** — она только собирает имена слоёв и предупреждает об **необъявленных** слоях (`warnings.push(\`@layer ${fl.name} used but not declared ...\`)`). Пункт «3» из описания не выполняется.
2. **Порог предупреждения противоречит заявленной цели.** Строка ~121:
   ```js
   if (parseFloat(layeredPct) < 50) {
     warnings.push(`Only ${layeredPct}% of CSS is in @layer blocks (target: ≥80%)`);
   }
   ```
   Порог срабатывания — **50%**, а в тексте указана цель **≥80%**. Файл с @layer-адопцией, скажем, 60% (между 50 и 80) **пройдёт молча**, хотя цель архитектуры недостигнута. `audit-pro.js` сообщает для `css/site.css` ровно **21.9%** @layer (цель ≥80%) — то есть реальная адопция далека от цели, а гейт это почти не энфорсит.
3. **Валидируется только один файл.** `package.json:121`:
   ```json
   "css:layer:validate": "node scripts/css-layer-validator.js css/site.css --ceiling=202"
   ```
   Route-scoped CSS (`css/home.css`, `css/nagornaya/tw.min.css`, `css/mobile-hotfix.css`, `css/floating-cluster.css` и др.) **не проверяются** на архитектуру слоёв вообще. Бóльшая часть CSS — вне контроля валидатора.
4. **200/202 `!important`** — потолок 202 почти достигнут; валидатор только считает, не анализирует источники ратчета.

**Статус:** OPEN (carry-over), усилено доказательствами. Риск: повторение инцидента «коррупция CSS» (см. `CSS-PARSE-CORRUPTION-SITECSS` в матрице) маловероятно поймается этим валидатором, т.к. он лишь считает фигурные скобки, без семантического парсинга.

### D-4 (Low) — Magic z-index: точные строки + первопричина
**Свежий grep (этот цикл) — строки В МАТРИЦЕ D-4 УСТАРЕЛИ, исправлены ниже:**

| Файл | Строка | Значение |
|---|---|---|
| `css/floating-cluster.css` | 2372 | `z-index: 2102 !important;` |
| `css/floating-cluster.css` | 2447 | `z-index: 9999 !important;` |
| `css/floating-cluster.css` | 2504 | `z-index: 3000;` |
| `css/floating-cluster.css` | 2697 | `z-index: 2147483000 !important;` |
| `css/floating-cluster.css` | 2882 | `z-index: 2147483100 !important;` |
| `css/mobile-hotfix.css` | 129 | `z-index: 2102 !important;` |

**Первопричина (важно):** система токенов `--z-*` **существует и богата** — в `css/*.css` определены: `--z-toast`(9800), `--z-modal`(10000), `--z-sheet`(2000), `--z-sticky`(1000), `--z-bottom-bar`(2000), `--z-dropdown`, `--z-overlay`, `--z-popover`, `--z-tooltip*`, `--z-critical`, **`--z-max`** и др. (grep `--z-*` → 24 токена). То есть:
- `2147483000` должно быть `var(--z-max)`;
- `9999` — `var(--z-modal)` (10000) или `--z-toast` (9800);
- `3000`/`2102` — соответствующий доменный токен.

Фикс **тривиален** (заменить литералы на токены), но не сделан. Нарушение `AGENTS-r33`.

**Статус:** OPEN (carry-over). Матричные строки D-4 обновлены на актуальные.

---

## 3. НОВЫЕ находки

### D-19 (Low) — `<title>` ≠ `og:title` / `twitter:title` / JSON-LD `headline` на кастомных PageHead
**Воспроизводимо** через `npm run validate:all` (этот цикл, exit 0, 2 warning):

```
⚠️ [20-antisovetov-pastoru] <title> ≠ og:title
     <title>: "20 антисоветов пастору: как разрушить служение"
   og:title: "20 антисоветов, как пастору разрушить своё служение"
⚠️ [rimlyanam-7-veruyushchiy-ili-neveruyushchiy] <title> ≠ og:title
     <title>: "Римлянам 7: верующий или неверующий?"
   og:title: "Римлянам 7: верующий, неверующий или человек под законом?"
```

**Первопричина (доказано чтением кода):** страницы — кастомные Astro-компоненты, обходящие общий конвейер мета:
- `src/components/article-pilots/antisovetov/AntisovetovPageHead.astro`
- `src/components/article-pilots/rimlyanam7/Rimlyanam7PageHead.astro`

В каждом hardcode-ятся **4 независимых строковых литерала** без общего источника истины:
1. `<title>` (документный, с суффиксом `| Господь Бог`)
2. `og:title`
3. `twitter:title`
4. JSON-LD `"headline"`

Пример (`AntisovetovPageHead.astro`): `<title>` = «20 антисоветов **пастору: как разрушить служение**», а `og:title`/`twitter:title`/JSON-LD `headline` = «20 антисоветов, **как пастору разрушить своё служение**». Расхождение уже реализовано на обеих страницах.

**Почему это риск:** стандартные MDX-статьи генерят мета через `Seo.astro`, который держит `title`/`og:title` синхронно. Кастомные head — вне этого конвейера, поэтому дрейф неизбежен при правке заголовка в одном месте. Эффект: разные заголовки в табе браузера, карточке соцсети и SERP-сниппете (Google может показать любой). Серьёзность Low, но это системная ловушка сопровождения.

**Рекомендация (для владельца, не исполняется аудитором):** ввести один `const TITLE` на страницу и прокидывать его во все 4 места (или через общий `PageHeadMeta` Astro-компонент).

### D-20 (Info/Low) — слитые feature-ветки не удалены с origin
**Доказательство:** `git branch -r` (этот цикл):
```
origin/claude/image-generation-query-3e8rd5
origin/claude/website-text-image-audit-9ep5z9
```
Обе ветки слиты в `main` через PR #48 / PR #47 (их коммиты — предки `14a49be8`), но **с origin не удалены**. D-9 корректно пометила их «delete-safe», но статус «RESOLVED» преждевременен: физически они висят.

**Статус:** уточнение к D-9 (Open как housekeeping). Матрица D-9 скорректирована.

---

## 4. Проверено и ЧИСТО (подтверждение пред. цикла)

- **3D-tilt `/izbrannoe/`** — a11y-корректен: JS активирует tilt только под `(hover:hover) and (pointer:fine)` (`js/site.js` блок `is-home-tilt-ready`), CSS сбрасывает `transform:none` при `@media (prefers-reduced-motion:reduce)` (`izbrannoe/index.astro:186`). Дефектов не найдено.
- **TTS** (`js/site.js` блок §1.2) — надёжен: feature-detect `speechSynthesis`, `cancel()` на stop/`beforeunload`, pause/resume на `visibilitychange`, poll `voiceschanged`, guard устаревших utterance (`_uttGen`), обход 15s-бага Chrome. Дефектов не найдено.
- **SW `staleWhileRevalidate`** — код минифицирован и тяжело аудируется статически; функциональный дефект **не подтверждён** (гейт SW readiness GREEN). Отмечаю лишь как наблюдение: minified SW плохо читается (observability), но это не баг.

---

## 5. Ограничения аудита

- Полный `strangler:build:production-like` локально **OOM (exit 137, ~1 ГБ при нужных ~2 ГБ)** — см. `docs/SANDBOX-ENV-2026-06-21.md`. Браузерные гейты и Pages-публикация проверены через GitHub API (авторитетно).
- GitHub fine-grained PAT **нельзя отозвать через API** (GET/DELETE `/user/fine_grained_personal_access_tokens` → 404). Отзыв — вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.

---

## 6. Рекомендации (для владельца)

1. **(Low) D-19:** унифицировать `title`/`og:title`/`twitter:title`/JSON-LD `headline` через один источник на кастомных PageHead (2 страницы).
2. **(Low) D-20/D-9:** удалить `image-generation-query-3e8rd5` и `website-text-image-audit-9ep5z9` с origin (слиты, не нужны).
3. **(Med) D-2:** заменить brace-counter на postcss-семантический парсинг; привести порог предупреждения (50%) в соответствие с целью (80%); расширить `css:layer:validate` на route-scoped CSS.
4. **(Low) D-4:** заменить magic z-index на существующие токены `--z-*` (в т.ч. `--z-max`).
5. **(Carry-over) D-1/D-3/D-7/D-8:** concurrency `cancel-in-progress`; бюджет JS; убрать внутренний путь из `PremiumControlAnchor.astro:3`; добавить `*.md` в `deploy.yml paths:`.

---

*Подготовлено независимым аудитором (arena-auditor). Отчёт и матрица запушены в `FedorMilovanov/AuditRepo` в `incoming/arena-auditor/2026-07-06/` и `verified/MASTER_BUG_MATRIX.md`.*
