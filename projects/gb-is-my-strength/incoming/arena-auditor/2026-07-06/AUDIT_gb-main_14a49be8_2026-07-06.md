# АУДИТОРСКИЙ ОТЧЁТ (ОБНОВЛЕНИЕ) — `FedorMilovanov/gb-is-my-strength`

**Объект:** актуальный `main` → HEAD `14a49be83ab57212c0bbd26a8249b75ac026511d`
**Дата аудита:** 2026-07-06 (Europe/Moscow)
**Роль:** чистый аудитор (наблюдение + отчёт, без правки кода)
**Пред. отчёты:** `AUDIT_gb-main_e044908e_2026-07-05.md` (HEAD `e044908e`), `AUDIT_gb-main_4ae0c915_2026-07-05.md`

---

## 0. ВЕРДИКТ (коротко)

- **ПРОДАКШН СТАЛ СТАРЫМ (STALE).** Последний успешный деплой — `e044908e` (2026-07-05T19:27:43Z, `workflow_run`). С тех пор **4 попытки деплоя подряд провалились или были отменены**: PR #45 (`55a7d437e`), PR #46 (`2e760e746`), cache-bust (`5704924ab`), и HEAD `14a49be8` (`28758726417`). Новые фичи (PR #45–#48: 3D-tilt `/izbrannoe/`, Писание в глоссарии, Bible-tooltip, TTS/kinetic numeral, SW baseline) **НЕ на продакшне**.
- **HEAD `14a49be8` проходит ВСЕ quality-гейты**, но его деплой упал на шаге **«Deploy to GitHub Pages»** (инфраструктурный/транзиентный сбой публикации: `error_count: 10`, `timeout: 600000` → «Deployment failed, try again later»). То есть баг НЕ в коде — нужен перезапуск деплоя (или устранение таймаута/размера артефакта).
- **Локальные гейты на Node 22 — все PASSED.** CSS-бюджет теперь В НОРМЕ (предупреждение по CSS исчезло); JS-бюджет всё ещё превышен (375041 > 365000).
- **Новая фича 3D-tilt `/izbrannoe/` — a11y-корректна**: включается только при `(hover:hover) and (pointer:fine)` (`js/site.js:577`) и отключается через `@media (prefers-reduced-motion:reduce)` (`izbrannoe/index.astro:186`). Не баг.
- **Ранее висячие ветки слиты** (PR #47, #48) → D-9 закрыт (обе delete-safe на origin).

---

## 1. Методология

- Перечитал `docs/SANDBOX-ENV-2026-06-21.md`; поставил **Node v22.12.0** в `/tmp`, `npm ci` (exit 0).
- Прогнал локально (Node 22): `audit-pro.js`, `css:layer:validate`, `data:consistency`, `gill:series:data:consistency:audit`, `native:runtime:audit:strict`, `migration:metadata:check:strict`, `validate:all`, `editorial:lint`, `pastor-series:visual-parity:audit`, `gill:context/spravochnik:visual-parity:audit`.
- **Полный build локально НЕ прошёл** (OOM exit 137, ~1 ГБ свободно). Браузерные гейты и Pages-публикацию проверял **через CI по GitHub API** (run-логи через подписанный blob-редирект).
- Статус CI: `/actions/runs` + `/jobs/{id}/logs`.

---

## 2. Статус продакшна и CI (таблица, свежие прогоны `Deploy to GitHub Pages`)

| Run ID | Conclusion | Head | Event | Время (UTC) | Что |
|---|---|---|---|---|---|
| **28758726417** | **failure** | **14a49be8** | push | 23:46:08 | **HEAD: все гейты ✅, но упал «Deploy to GitHub Pages» (infra: error_count 10, timeout 600000)** |
| 28758340460 | failure | 5704924ab | workflow_run | 23:18:19 | SW baseline drift (gb-v189≠gb-v188) — позже пофикшено `b712bb15` |
| 28758257340 | cancelled | d9ee57d2f | push | 23:15:07 | убит `concurrency` |
| 28758164176 | cancelled | 0e23ec330 | push | 23:11:25 | убит `concurrency` |
| 28757603646 | failure | 2e760e746 | push | 22:50:17 | Gill mobile/play smoke: series-marks expectation (позже пофикшено) |
| 28756906592 | skipped | 55a7d437e | workflow_run | 22:23:06 | пропущен (дубликат) |
| 28756822942 | failure | 55a7d437e | push | 22:19:54 | Static gates: spravochnik H2 parity (позже пофикшено) |
| — | success | **e044908e** | workflow_run | 19:27:43 | **← последний УСПЕШНЫЙ деплой (продакшн сейчас здесь)** |

**Вывод:** окно последних 40 прогонов содержит **0 успешных деплоев**. Продакшн = `e044908e`. Все 4 последующие попытки (вкл. HEAD) не опубликованы.

---

## 3. Что продвинулось с `e044908e` (PR #45–#48)

- `fa6b6a38` / `8a5ce75d` — премиум `/izbrannoe/` с **3D-tilt**; карточки избранного в tilt-движке; **Писание в определениях глоссария**; tilt-движок на `/izbrannoe/`.
- `7febe633` — стили «Избранного» на главной; стратегия **Библия-тултипов** + seed.
- `cad24dd7` — fix(glossary): вложенная подсветка ломала тултип; именительный падеж; реже повторы.
- `730248cb` / `233750b5` — home/ambient: ссылка на Писание у греч./лат. фраз; uniform end-block, saved-fill, smart resume, TTS ring/pill, hero cover, kinetic numeral, home search icon.
- `9d6e9aef` — полировка главной (tilt, обрезка «я», hover, карточки, чипы).
- `621559a5` — fix(smoke): flow-rail aware series-marks expectation (попытка починить D-15).
- `b712bb15` — fix(sw): bump baseline до gb-v189 (чинит D-16).
- `0e23ec33` / `d9ee57d2` — **Merge PR #47**: ветка `website-text-image-audit-9ep5z9` **слита**.
- `14a49be8` — Merge PR #48 (image-generation-query).

---

## 4. Локальные гейты (Node 22, HEAD `14a49be8`)

| Гейт | Результат |
|---|---|
| `audit-pro.js` (soft) | ✅ PASSED (warning: JS 375041 > 365000; magic z-index). **CSS-бюджет в норме** |
| `css:layer:validate` | ✅ PASSED, ⚠ 21.9% @layer (цель ≥80%), 200 !important |
| `data:consistency` | ✅ PASSED |
| `gill:series:data:consistency:audit` | ✅ PASSED |
| `native:runtime:audit:strict` | ✅ 51/53; `/izbrannoe/` = native-with-legacy-head (1.9%, ок) |
| `migration:metadata:check:strict` | ✅ PASSED |
| `validate:all` | ✅ 0 ошибок, 2 warning (`title≠og:title`: 20-antisovetov-pastoru, rimlyanam-7) |
| `pastor-series:visual-parity:audit` | ✅ PASSED |
| `gill:context/spravochnik:visual-parity:audit` | ✅ PASSED |

> Замечание: `audit-pro` больше НЕ выдаёт предупреждение по Core CSS (было 460887 > 425000 при `e044908e`) — CSS-бюджет выправлен. JS-бюджет всё ещё превышен (375041 > 365000, рост с 368235).

---

## 5. НАЙДЕННЫЕ ПРОБЛЕМЫ

### ВЫСОКИЙ (High)

**D-17. Продакшн STALE — 4 подряд проваленных/отменённых деплоя; HEAD не опубликован.**
- Последний успех = `e044908e` (19:27:43Z). Затем `55a7d437e`(fail), `2e760e746`(fail), `5704924ab`(fail), `14a49be8`(fail, infra) — и несколько `cancelled` от `concurrency`.
- Следствие: фичи PR #45–#48 (3D-tilt, glossary Scripture, Bible-tooltip, TTS, SW baseline) **не на продакшне**. Любая правка, сделанная «для продакшна», сейчас не видна пользователю.
- Действие: опубликовать HEAD перезапуском деплоя (см. D-18) и убедиться, что он доходит до «Deploy to GitHub Pages».

### СРЕДНИЙ (Medium)

**D-18. HEAD-деплой упал на «Deploy to GitHub Pages» (инфраструктура, не код).**
- `28758726417`: ВСЕ гейты ✅ (Static gates, Build, Pagefind, Gill submenu audit, Gill mobile layout, dist-smoke, content coverage 50/50, **SW readiness ✅ CACHE_VERSION=gb-v189 matches baseline**), но шаг «Deploy to GitHub Pages» → `error_count: 10`, `timeout: 600000`, `##[error]Deployment failed, try again later.`
- Это сбой **загрузки/публикации Pages-артефакта** (`actions/deploy-pages` / Upload Pages Artifact), не регрессия кода. Вероятно транзиент (временный сбой GitHub или превышение 10-мин таймаута из-за размера артефакта).
- Действие: перезапустить прогон; если повторяется — проверить размер Pages-артефакта (50 роутов + изображения + Pagefind) и 10-мин таймаут шага публикации (возможный scaling-риск).

**D-1. Deploy `concurrency: cancel-in-progress` делает push-деплои мёртвыми; публикация держится на `workflow_run`.** (carry-over)
- `deploy.yml:50-52`. Каждый пуш отменяет летящий деплой → «cancelled» в истории. Публикация идёт по цепочке IndexNow→deploy. Хрупкая связка (если IndexNow не сработает — пуш не опубликуется). Рекомендую либо убрать `cancel-in-progress`, либо сделать деплой чисто push-триггером.

**D-2. CSS-валидатор слабый; @layer-адопция 21.9% (цель ≥80%); 200 `!important`.** (carry-over)
- `css:layer:validate` только считает скобки/долю; не ловит семантику. Латентный риск повтора инцидента с битым CSS.

### НИЗКИЙ (Low) — carry-over, всё ещё актуально

- **D-3.** JS total 375041 > 365000 (CSS-бюджет теперь OK). 
- **D-4.** Magic z-index: `floating-cluster.css:2649` `2147483000`, `:2834` `2147483100`, `:2324` `2102 !important`, `:2399` `9999`, `:2456` `3000`; `mobile-hotfix.css:129` `2102 !important`.
- **D-7.** Residual path-leak в комментарии `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` (`AuditRepo/projects/gb-is-my-strength/...`) — не ловится §14.
- **D-8.** `deploy.yml` `paths:` не включает `*.md` (doc-only не триггерит push-деплой).

### РАНЕЕ ЗАБЛОКИРОВАННЫЕ, НЫНЕ РЕШЁННЫЕ НА HEAD (для трассировки)

- **D-14 (был High).** PR #45 упал на `article MDX public shadow audit`: у `dzhon-gill-spravochnik` первый H2 расходился (`Справочник по Гиллу` vs legacy `Джон Гилл (1697–1771)`). В прогоне `28758726417` (HEAD) шаг Static gates **прошёл** → к HEAD закрыто (вероятно поправлено в одном из PR #45–#48 либо baseline регенерирован).
- **D-15 (был High).** PR #46 упал на `Gill mobile/play smoke`: expected series-marks `Введение/I/II/III/Справ.`, а рендерилось 4 (без своей метки). Корень — **rail по дизайну показывает только SIBLING-метки** (`GillSeriesRail.astro:34-36,47-49,90-92`: `partsBefore`+`partsAfter`; текущая часть = большая карточка «Сейчас читаете», не бейдж). Т.е. это было **устаревшее ожидание smoke-теста**, не баг продукта. В `28758726417` Gill mobile/play smoke **прошёл** → закрыто (фикс `621559a5` сработал к HEAD).
- **D-16 (был High).** cache-bust `5704924ab` упал на `sw:dist:audit:deploy-switch`: `CACHE_VERSION gb-v189 ≠ baseline gb-v188`. Пофикшено `b712bb15` (baseline теперь gb-v189; в `28758726417` SW readiness ✅). Транзиент — bump и baseline были в разных коммитах (process-smell: делать атомарно).

### ЗАКРЫТО

- **D-9.** Обе висячие ветки **слиты** (PR #47 `website-text-image-audit-9ep5z9`, PR #48 `image-generation-query-3e8rd5`) → delete-safe на origin.

### ПОЗИТИВ

- Новая фича **3D-tilt `/izbrannoe/` a11y-корректна**: `js/site.js:577` — только `(hover:hover) and (pointer:fine)`; `izbrannoe/index.astro:186` — `@media (prefers-reduced-motion:reduce){transform:none}`.

---

## 6. Ограничения

- Полный build убит OOM (exit 137, ~1 ГБ). Локально не прогнал `dist`-зависимые гейты и Pages-публикацию — заменены авторитетным CI.
- GitHub fine-grained PAT **нельзя отозвать через API** — отзыв вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.

---

## 7. Рекомендации (приоритет)

1. **(High) D-17/D-18:** немедленно **перезапустить деплой HEAD `14a49be8`** (все гейты зелёные; сбой был инфраструктурный). Убедиться, что прогон доходит до «Deploy to GitHub Pages» и завершается success. Если повторяется `timeout/error_count` — исследовать размер Pages-артефакта и 10-мин таймаут шага.
2. **(Med) D-1:** пересмотреть `concurrency` — убрать `cancel-in-progress` или сделать деплой чисто push-триггером; задокументировать «продакшн = последний успешный `workflow_run`».
3. **(Med) D-2:** усилить CSS-валидатор (postcss-парсинг) + поднять @layer-адопцию.
4. **(Low) D-3/D-4/D-7/D-8:** бюджет JS; z-index-токены; убрать внутренний путь из комментария; добавить `*.md` в `deploy.yml paths:` (или закрепить doc-only вне деплоя).
5. **(Low) D-9:** удалить слитые ветки `image-generation-query-3e8rd5` и `website-text-image-audit-9ep5z9` из origin.
6. **(Process) D-16:** CACHE_VERSION-bump и обновление `sw-cache-version-baseline.json` делать ОДНИМ коммитом (аудит это уже требует, но разрыв вызвал транзиентный фейл деплоя).

---

*Сгенерировано аудитором на основе прямого чтения кода (HEAD `14a49be8`), локальных гейтов на Node v22.12.0 и статуса CI через GitHub API. Правок в репо не вносилось.*
