# VALIDATION SYSTEM AUDIT — Meta-Audit проверочной инфраструктуры

**Аудитор:** Arena Agent  
**Дата:** 2026-07-05  
**Source HEAD:** `d1941a6d`  
**Метод:** Построчный анализ 85 скриптов, CI workflows, package.json chains, git history

---

## 1. КАРТА ПРОВЕРОК

### Общая статистика
- **85 скриптов** в `scripts/`
- **77** вызываются из `package.json`
- **6 dead** (0 callers нигде): `_audit-deep.js`, `deep-check.js`, `extract-native-pilot.js`, `genealogy-e2e-v2.js`, `ishod-qa.js`, `map-visual-qa.js`
- **2 library** (вызываются из других скриптов, не из package.json): `build-indexnow-urls.js`, `cache-bust-assets.js`
- **audit-pro.js**: 4498 строк, 113 guard-категорий, 389 check calls — **мегаскрипт**

### CI Pipeline (per deploy)
- `validate:static-publication` = **37 sequential checks** (pre-build)
- deploy.yml adds **~15 post-build steps** (dist-smoke, Playwright, schema audit, etc.)
- **~52 script invocations per deploy**
- Время сборки: strangler:build + pagefind + Playwright install + 28-route smoke ≈ 15-20 min CI

---

## 2. МЁРТВЫЕ ПРОВЕРКИ (удалить)

| Скрипт | Строк | Почему мёртвый |
|---|---|---|
| `_audit-deep.js` | ? | 0 вызовов отовсюду |
| `deep-check.js` | ? | 0 вызовов отовсюду |
| `extract-native-pilot.js` | ? | 0 вызовов отовсюду |
| `genealogy-e2e-v2.js` | ? | 0 вызовов отовсюду, genealogy tree работает через React |
| `ishod-qa.js` | ? | 0 вызовов отовсюду |
| `map-visual-qa.js` | ? | 0 вызовов отовсюду |

→ **6 скриптов к удалению.** Ни один не вызывается ни из package.json, ни из workflows, ни из других скриптов.

---

## 3. УСТАРЕВШИЕ / СТALE ДАННЫЕ В ПРОВЕРКАХ

### 3a. audit-pro.js NOINDEX_ALLOWLIST: phantom file

**Строка 2055:** `'yandex_d8876d66da1b4592.html'` в NOINDEX_ALLOWLIST — **файл не существует** на диске. Только `yandex_42bc0d54a1ca4952.html` реален. Allowlist содержит phantom entry, который ничего не делает (файл отсутствует → не сканируется → запись бесполезна). **Не баг, но мусор.**

### 3b. validate.js scope: только `articles/` (10 из 40+ страниц)

**Строка 11:** `const ARTICLES = path.resolve(__dirname, '../articles');`

validate.js проверяет **только** 10 legacy-статей в `articles/`. Полностью пропущены:
- `baptisty-rossii/` — 10 страниц
- `nagornaya/` — 8 страниц (5 chast + index + seriya + istochniki + nakhodki)
- `karty/` — 11 страниц
- `konfessii/` — 2 страницы
- `biografii/` — 1 страница
- `hard-texts/` — 1 страница
- `pastor-series/` — 1 страница
- `map/` — 1 страница
- `rodosloviye/` — 1 страница

**EXTRA_PAGES** добавляет ещё 4 (pastor-series, biografii, about, index) — но только базовые checks (title, og:image, canonical existence).

→ **~30 страниц** не проходят полную валидацию (canonical match, BreadcrumbList, section, byline, img alt, внутренние ссылки, русская цитатная политика).

**Смягчение:** Astro-страницы валидируются через `article-mdx-pilot-audit.js`, `baptisty-series-shadow-audit.js`, route-specific parity scripts. Но проверки validate.js (#1-#17) — **другие**, они SEO/content-ориентированные.

---

## 4. ДЫРЫ В ЗАЩИТЕ ОТ РЕГРЕССИЙ

### Что НЕ ЗАЩИЩЕНО (confirmed unguarded)

| Gap | Что может сломаться | Уже ломалось? |
|---|---|---|
| **floating-cluster.css !important** (490) | Неконтролируемый рост CSS specificity | Нет — но нет и ceiling |
| **Image ↔ manifest/sitemap cross-ref** | Удаление файла ломает JSON refs | **ДА** — `629ed89a` → `fc5f94bd` |
| **SERIES_ORDER ↔ series.json** | Серия без prev/next навигации | Да — pastor-series (1 статья, low impact) |
| **deploy.yml `if:` conditions** | Deploy на failure indexnow | **ДА** — by design но спорно |
| **SW PRECACHE ↔ lazy assets** | Lazy loading бесполезен (SW кеширует раньше) | Нет — латентный |
| **SW baseline version** | Stale baseline documentation | Нет — латентный |
| **search-manifest completeness** | Пустой slug, нет scripture/image | Нет — латентный |
| **route-matrix ↔ ownership ↔ sitemap** | 35 ≠ 54 ≠ 43 routes | Нет — латентный |

### Что ломалось из-за агентов (regression от автоматических фиксов)

| Паттерн | Пример | Текущая защита |
|---|---|---|
| Fix → сломал refs → fix-the-fix | `629ed89a` orphan images | ❌ Нет cross-ref guard |
| Metadata-only fix без реального фикса | `c0ab48fc` → `6cc68586` (NEW-59) | ✅ og:image props теперь (85a2fd65) |
| Immediate revert | `9b2b039a` → `d3ee628f` (izbrannoe) | ❌ Нет pre-merge build gate |
| CI YAML syntax error | BUG-CI-001 duplicate `run:` | ✅ actionlint wired (85a2fd65) |

---

## 5. РЕКОМЕНДАЦИИ (приоритизированные)

### Высокий ROI (малые усилия → закрывают класс регрессий)

1. **Расширить validate.js scope** на baptisty-rossii/, nagornaya/, karty/ — или создать unified HTML validator для всех legacy-страниц. ~50 строк кода, закрывает ~30 непроверенных страниц.

2. **Удалить 6 мёртвых скриптов** — чистый cleanup, 0 риск.

3. **Добавить !important ceiling для floating-cluster.css** в audit-pro.js — 5 строк, закрывает P1 AUDIT-P1-FC-IMP.

4. **Убрать phantom `yandex_d8876d66da1b4592.html`** из NOINDEX_ALLOWLIST — 1 строка.

### Средний ROI

5. **Cross-ref guard: images ↔ search-manifest ↔ sitemap** — проверять что каждый image-ref в manifest.json указывает на существующий файл. Предотвращает повторение `629ed89a` regression.

6. **SERIES_ORDER auto-sync с series.json** — или хотя бы check что ключи совпадают. 10 строк в data:consistency.

### Низкий ROI (архитектурные)

7. **SW PRECACHE manifest → generated** вместо ручного редактирования. Закрывает 3 бага одновременно.

8. **Route-matrix ↔ ownership ↔ sitemap cross-validation** — один скрипт, 3 data sources.

---

## 6. ПРОВЕРКИ, КОТОРЫЕ НЕ НУЖНО ТРОГАТЬ

13 route-specific visual-parity scripts — **НЕ дубликаты**. Каждый проверяет route-specific маркеры, компоненты, forbidden tokens. Размер: 27-202 строк. Refactor в один generic скрипт **не рекомендуется** — route-specific assertions потеряют точность.

`audit-pro.js` (4498 строк) — монолит, но **работающий**. 113 guards покрывают CSS, SEO, security, a11y, perf, content. Refactor в модули — nice-to-have, но risk of regression > benefit.

---

## Evidence

```
Source HEAD: d1941a6d
Scripts: 85 total, 77 called, 6 dead, 2 libraries
audit-pro.js: 4498 lines, 113 guards, 389 checks
validate.js: articles/ only (10 of 40+ pages)
NOINDEX_ALLOWLIST: phantom yandex_d8876d66da1b4592.html
Regression patterns: 4 classes identified, 2 now guarded, 2 unguarded
```
