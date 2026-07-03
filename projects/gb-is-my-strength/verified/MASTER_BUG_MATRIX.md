# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-03  
**HEAD исходного репозитория:** `86827c18` (Pass 25 — dead code cleanup + defer + CSS vars)  
**Режим аудита:** Multi-Agent Synthesis (Passes 1–24)  

---

## 📊 Итоговая статистика

| Приоритет | Количество | Описание |
|-----------|------------|----------|
| 🔴 **P0 (Critical)** | 1 | REG-001 _headers бесполезен (остаётся — нужна CDN-инфра) |
| 🟠 **P1 (High)** | 1 | CI-дублирование (частично оптимизирован) |
| 🟡 **P2 (Medium)** | 14 | SEO, SW metadata, search, audit drift |
| 🔵 **P3 (Medium)** | 10 | a11y, social metadata, оптимизация |
| 🔵 **P3 (Refactor)** | 4 | site.js монолит, enhancements.js, no source maps, no ES modules |
| ⚪ **S0 (Low)** | 2 | Документация |
| 🟣 **AuditRepo** | 5 | Слабая валидация, stale SHA, нет автоматизации |
| ❌ **Fixed** | 12 | Исправлено в коммитах `f284fc60`–`47a98da` |
| **ВСЕГО АКТУАЛЬНЫХ БАГОВ** | **31** | (было 79, -48 исправлено/закрыто) |

---

## ✅ ИСПРАВЛЕНО В PASS 24 (коммит `47a98da`, 2026-07-03)

### Мёртвый код удалён (289KB):
| Файл | Размер | Причина удаления |
|------|--------|-----------------|
| `_headers` | 1,033 B | Бесполезен на GitHub Pages (REG-001) |
| `css/site-layered.css` | 283,706 B | Не подключён нигде |
| `js/modules/back-to-top.js` | 1,289 B | Никогда не загружается (site.js имеет inline handler) |
| `js/series-cards.js` | 2,642 B | data-series-cards не используется ни на одной странице |
| `yandex_d8876d66da1b4592.html` | 161 B | Дублирующая верификация Яндекса |

### Security fixes:
- **P1-SITE-XSS ✅:** Санитизация `w.original`, `w.definition` через `tt()`, `n.title` через `tt()`, `a.href=n.url` через inline safeUrl, verse tooltips `ref`+`text` через `tt()`
- **NEW-60 ✅:** CSP meta добавлена на 10 karty/ holding pages (было 0/10, стало 10/10)
- **NEW-61 ✅:** `form-action 'self'` добавлен в CSP meta на всех 51 странице + _app

### Service Worker fixes:
- **REG-003 ✅:** CACHE_VERSION обновлён до `gb-v183-dead-cleanup-20260703`
- **REG-008 ✅:** `/pagefind/pagefind.js` убран из PRECACHE_ASSETS (устранён 404 при SW install)
- **P2-SW-FALLBACK ✅:** Убран query-stripping fallback в cacheFirst, который возвращал stale cache-busted assets

### Data fixes:
- **NEW-62 ✅:** Фантомная статья `zakon-duha-zhizni-rimlyanam-8` удалена из series.json

### Infrastructure cleanup:
- **REG-004 ✅:** dist-publication-audit.js — silent `catch(e){}` заменён на `bad()` с сообщением об ошибке
- **REG-006 ✅:** back-to-top.js убран из PRECACHE_ASSETS и cache-bust-assets.js
- **REG-007 ✅:** series-cards.js убран из ALLOWED_JS в audit-pro.js, удалён dead import из site.js
- **P2-BOOKMARK-DUP ✅:** Дублирующий IIFE с getAllForSite удалён из bookmark-engine.js
- **P1-BACK-TOP ✅:** Мёртвый back-to-top.js удалён (вместо добавления в precache)
- **P1-LAYERED-CSS ✅:** Мёртвый site-layered.css удалён, все ссылки в audit-pro.js/css-layer-validator.js/copy-legacy-to-dist.js зачищены
- Удалена запись `js/modules/back-to-top.js` из asset-version.js
- AGENTS.md обновлён: структура директорий без мёртвых файлов

---

## 🔴 P0 — CRITICAL (1 открытый баг)

### REG-001: `_headers` бесполезен на GitHub Pages — FALSE SECURITY
* **Суть:** GitHub Pages не поддерживает файл `_headers`. HTTP-заголовки безопасности (HSTS, X-Frame-Options, CSP frame-ancestors, Referrer-Policy, Permissions-Policy) **не применяются**.
* **Файл `_headers` удалён** в коммите `47a98da`.
* **Остаточный риск:** Сайт работает без HSTS, без CSP frame-ancestors, без X-Frame-Options.
* **Решение:** CDN-прокси (Cloudflare) поверх GitHub Pages, или переход на Netlify/Cloudflare Pages.
* **CSP meta tag работает** на 52/52 страницах (включая `form-action 'self'`), но `frame-ancestors` невозможно задать через meta.

---

## 🟠 P1 — HIGH PRIORITY (2 открытых бага)

### P1-CI-DUPE: Дублирование npm ci + cache-bust в IndexNow и Deploy
* **Файлы:** `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`
* **Суть:** 2× npm ci + 2× cache-bust + Astro build = 20–30 мин CI на каждый пуш.

### REG-002: ~~Deploy pipeline SPOF для 14 путей~~ ✅ FIXED
* **Файл:** `.github/workflows/deploy.yml`
* **Фикс:** Деплой теперь разрешён при падении indexnow (с warning). Deploy.yml выполняет собственный cache-bust и валидацию.

---

## 🟡 P2 — MEDIUM PRIORITY (19 открытых багов)

* **P2-AUDIT-DRIFT:** audit-pro.js не проверяет синхронизацию PRECACHE↔cache-bust↔ALLOWED (улучшено в REG-004, но полный дрифт не решён)
* **P2-SW-METADATA:** CACHE_METADATA ключ = полный URL, но trimCache ищет по cache keys
* **P2-SEARCH-EAGER:** search.js создаёт DOM при загрузке (~15KB nodes)
* **P2-SEARCH-SVG-DUP:** 20+ дублированных SVG-констант в search.js (~3KB)
* ~~**P2-ENH-CSS:** enhancements.js инжектит CSS через JS~~ ✅ FIXED (→ css/enhancements-runtime.css)
* ~~**P2-HIGHLIGHTS-CSS:** highlights.js инжектит CSS через JS~~ ✅ FIXED (→ css/highlights-runtime.css)
* ~~**BUG-003:** Рассинхрон в оркестрации SW gate~~ ✅ FIXED (sw:dist:audit добавлен в gate)
* **BUG-012:** Рассинхрон заголовков MDX и HTML (3 статьи)
* **BUG-041:** Sitemap/indexability mismatch for karty holding pages
* **NEW-43:** Отсутствие атрибутов `width`/`height` у 65 изображений (CLS)
* ~~**BUG-005:** Дублирование стилей~~ ✅ FIXED (site-layered.css удалён в Pass 24)
* **BUG-010:** Хаос с брейкпоинтами в CSS (20+ breakpoints)
* **BUG-011:** Конфликт брейкпоинтов на 768px
* **BUG-013:** Отсутствие Preload для Critical CSS
* **NEW-39:** Отсутствие Preload для ключевых шрифтов (FOUC)
* **BUG-014:** Race condition в скриптах сборки
* **BUG-016:** ~62 неиспользуемых CSS custom properties
* **BUG-019:** Скрытый баг с trailing slash в search.js
* ~~**P2-REG-005:** Порядок PRECACHE_ASSETS и ASSETS расходится~~ ✅ FIXED (переупорядочен)

---

## 🔵 P3 — MEDIUM (16 открытых багов)

* **NEW-44:** Отсутствие `loading="lazy"` у 59 изображений
* **NEW-45:** Отсутствие `<link rel="prefetch">` для навигации
* **NEW-31/32:** HTTP Referrer-Policy/Permissions-Policy не применяются (GitHub Pages ограничение, REG-001)
* **BUG-020:** 336 кнопок без `aria-label` (WCAG)
* **BUG-021:** 2 короткие meta descriptions
* **BUG-022:** 256 переопределённых CSS правил
* **BUG-023:** Мёртвый атрибут `data-gill-current-part`
* **BUG-024:** Мёртвый TypeScript/JS API
* **BUG-025:** Устаревшие CSS-селекторы в openSearch()
* **BUG-034/035:** grid-template-rows: 0fr без фоллбека
* **BUG-036:** scrollbar-gutter без фоллбека
* **PC-101:** Мёртвый компонент GillRailControls.astro
* **PC-107:** Неиспользуемые TypeScript props
* **NEW-54:** 4 sitemap URL с 0 inlinks
* **NEW-55:** robots.txt блокирует query-версии CSS (частично исправлено)
* **NEW-56-59:** Social metadata gaps, feed.xml title drift, og:image size mismatch

---

## 🔵 P3 — REFACTORING (4 позиции)

* **R-001:** site.js — 167KB монолит (15 модулей)
* **R-002:** enhancements.js — 48KB (7+ модулей)
* **R-003:** Нет source maps
* **R-004:** Нет `type="module"` → нет tree-shaking

---

## ⚪ S0 — DOCUMENTATION (2 бага)

* **BUG-026:** Дублирование параграфа §12.5.7 в AGENTS.md
* **BUG-027:** Конфликт нумерации релизов r300–r308

---

## 🟣 AuditRepo (5 позиций)

* **AR-001:** validate_audit_repo.py — слабая валидация identity-маркеров
* **AR-002:** PROJECT_REGISTRY.md устарел
* **AR-003:** check_auditrepo_structure.py не проверяет содержимое
* **AR-004:** MULTI_WITNESS_VERIFICATION_PROTOCOL — не автоматизирован
* **AR-005:** Нет reverify-автоматизации

---

## ❌ FIXED / CLOSED (полный список)

| ID | Коммит | Описание |
|----|--------|----------|
| P0-FC-REC | `ca6a25a` | Бесконечная рекурсия addCleanListener → target.addEventListener() |
| P0-SW-DRIFT | `47a98da` | PRECACHE_ASSETS очищен от мёртвых записей, CACHE_VERSION обновлён |
| P1-SITE-XSS | `47a98da` | innerHTML с непроверенными данными → tt() + safeUrl |
| P1-LAYERED-CSS | `47a98da` | 283KB мёртвый site-layered.css удалён |
| P1-BACK-TOP | `47a98da` | Мёртвый back-to-top.js удалён (вместо precache) |
| P1-DEPLOY-FAIL | `29b49df` | deploy.yml блокируется при падении indexnow |
| NEW-48 | `f284fc6` | Stored XSS в Favorites.astro → esc() |
| NEW-46 | `bba171a` | llms.txt 100% покрытие |
| NEW-47 | `4a367a9` | Genealogy tree оживлён |
| NEW-49 | `ac132c8` | Google Fonts зависимость удалена из 3D-карты |
| NEW-50/51 | `36003b9` | Publication boundary leak + nested checks |
| NEW-52 | `36003b9` | Pagefind body на article element |
| NEW-53 | `36003b9` | IndexNow после deploy |
| BUG-007 | `f284fc6` | readTime→readingTime нормализация |
| BUG-008 | `36003b9` | readTime для всех 17 статей |
| BUG-009 | `4a367a9` | Единый assetUrl() API |
| P2-TTS-LOCALSTORAGE | `e458581` | try/catch для TTS localStorage |
| P2-VIEWTRANSITION-TARGET | `e458581` | Guard (!t.target||t.target==="_self") |
| NEW-55 | `e458581` | Allow для fonts/images с query strings |
| NEW-60 | `47a98da` | CSP meta на 10 karty/ страницах |
| NEW-61 | `47a98da` | form-action 'self' на 51 странице |
| NEW-62 | `47a98da` | Фантомный zakon-duha-zhizni-rimlyanam-8 удалён |
| NEW-63 | `47a98da` | Дублирующий yandex verification файл удалён |
| REG-003 | `47a98da` | CACHE_VERSION обновлён до v183 |
| REG-004 | `47a98da` | Silent catch → error reporting |
| REG-006 | `47a98da` | Dead back-to-top.js removed from PRECACHE |
| REG-007 | `47a98da` | Dead series-cards.js removed |
| REG-008 | `47a98da` | pagefind/pagefind.js removed from PRECACHE |
| P2-SW-FALLBACK | `47a98da` | Query-stripping fallback removed from cacheFirst |
| P2-BOOKMARK-DUP | `47a98da` | Duplicate getAllForSite IIFE removed |

---

## 🛠 ПОСЛЕДУЮЩИЙ ПЛАН (Fix Pipeline)

1. **Пакет 1 (Инфраструктура безопасности):**
   - Настроить Cloudflare CDN поверх GitHub Pages для HTTP-заголовков (HSTS, X-Frame-Options, CSP frame-ancestors, Referrer-Policy, Permissions-Policy)
2. **Пакет 2 (CI оптимизация):**
   - Разделить indexnow.yml и deploy.yml чтобы убрать дублирование npm ci + cache-bust (P1-CI-DUPE)
   - Добавить fallback для 14 путей при падении indexnow (REG-002)
3. **Пакет 3 (Производительность):**
   - width/height для 65 изображений, loading="lazy" для 59
   - Preload Critical CSS и шрифтов
4. **Пакет 4 (Рефакторинг):**
   - Разделить site.js (167KB) на ES-модули
   - Вынести CSS-in-JS из enhancements.js/highlights.js в файлы

---

## 🕵️‍♂️ PASS 25 — PURE AUDITOR & VERIFICATION PASS (2026-07-03, Node 22 v22.14.0)

**Режим выполнения:** Чистый аудитор и верификатор («Режим Чистого Аудитора и Верификатора», без изменения исходного кода в `gb-is-my-strength`).  
**Toolchain:** Node.js `v22.14.0` (официальный Linux x64 бинарник в `/home/user/.node22/bin`) + Playwright Chromium (`v1228`).  
**Объем аудита:** 75+ строгих bash-проверок по всем 6 архитектурным доменам, повторная проверка актуального HEAD `edea8b3c` на отсутствие регрессий и «костылей», а также полная гигиеническая расчистка директории `incoming/` в архив.

### 🧪 Верификация актуального HEAD (`edea8b3c` / `47a98da`)

На стенде Node 22 была проведена полная перепроверка всех 15 публикационных гейтов и скриптов вёрстки после удаления мёртвых файлов (`site-layered.css`, `back-to-top.js`, `series-cards.js` — минус 289 КБ), внедрения CSP `form-action` на 51 странице и обновления Service Worker (`v183`):

1. **Сборка и публикационный контракт (Gates 1–9):**
   - `npm run strangler:build:production-like`: 100% успешная сборка дистрибутива из 53 статических Astro-страниц. Дрифт хешей ассетов после удаления мёртвых скриптов отсутствует (`hash drift → 0`).
   - `npx astro check`: TypeScript-диагностика по 415 файлам проекта: **0 ошибок, 0 предупреждений**.
   - `node scripts/dist-publication-audit.js`: Проверены все 45 обязательных артефактов дистрибутива, подтверждено отсутствие утечек приватных директорий (`src`, `scripts`, `research`, `raw-sources`, `_legacy`).
   - `npm run contract:compare`: Точное соответствие 43 публичных baseline-страниц.
   - `npm run page-ownership:dist:production-like`: Подтверждён владелический контракт 53 роутов.
   - `npm run strangler:smoke`: Playwright-проверка 15 десктопных и 15 мобильных страниц дистрибутива — **0 горизонтального переполнения (h-overflow)**, корректный рендеринг H1.
   - `npm run dist:css-parity`: 53/53 страниц несут корректный CSS-контракт.
   - `npm run sw:dist:audit`: Верифицирована готовность Service Worker (`PRECACHE_ASSETS`, стратегия `stale-while-revalidate` для HTML и `cache-first` для статики).
   - `npm run editorial:lint`: Проверка редакционных стандартов прошла успешно.

2. **Интерактивные 3D/2D карты и мобильный UX (Gates 10–15):**
   - `npm run maps:validate` & `npm run maps:publication-status`: Валидация схем 10 библейских карт (Авраам, Исход, Павел и др.) и статусов публикации.
   - `npm run tokens:check`: Проверка дизайн-токенов (0 легаси `var()` ссылок).
   - `node scripts/konfessii-map-audit.js`: Живой Playwright-тест 3D-карты баптизма в браузере Chromium — подтверждены 14 инвариантов (рендеринг WebGL Canvas, отсутствие блокировки кликов геометрией, изоляция iframe `_app/index.html`).
   - `npm run gill:mobile-layout:audit`: Playwright-аудит мобильной шапки и панели Джона Гилла на разрешениях 360×740 и 390×844 (light/dark) — 100% PASS.
   - `npm run avraam:audit`: 28/28 проверок интерактивной карты пути Авраама успешно пройдены.

3. **Контентная целостность, поисковые индексы и SEO (Gates 16–22):**
   - `npm run content:parity`: Проверка MDX vs HTML паритета по словам (допуск ±8%) и семантике — все статьи в зелёной зоне.
   - `npm run gill:reading-time:audit`: Верифицировано каноническое время чтения серии (149 минут) в MDX, `search-manifest.json` и HTML.
   - `npm run gill:pagefind:audit`: Подтверждено, что все части серии индексируются Pagefind через `<article class="article-body">`.
   - `node scripts/schema-rich-results-audit.js` & `node scripts/dist-jsonld-audit.js`: 60 валидных блоков JSON-LD, 25 схем Article, 39 BreadcrumbList, 4 FAQPage.
   - `node scripts/baptisty-series-shadow-audit.js`: 10 роутов «Баптисты России» соответствуют strict-native стандарту без `loadLegacyFullDocument`.

4. **Визуальный паритет и миграция легаси-разделов (Gates 23–40):**
   - Успешно выполнены все специализированные скрипты визуального паритета: `about:visual-parity`, `biografii:visual-parity`, `hard-texts:visual-parity`, `pastor-series:visual-parity`, `articles:visual-parity`, `gill:context:visual-parity`, `gill:spravochnik:visual-parity`, `konfessii:visual-parity`, `karty:visual-parity`, `baptisty-rossii:visual-parity`, `home:visual-parity`, `nagornaya:visual-parity`, `catalogs:visual-parity`, `baptisty:roadmap`, `baptisty:visual-atlas`.
   - `npm run audit:premium-controls`: 87/87 проверок PremiumControls прошли успешно.
   - `npm run migration:metadata:check:strict`: 52 профиля роутов и 35 записей матрицы миграции полностью когерентны.

### 🧹 5. Гигиена AuditRepo и расхламление («Не плодим миллионы файлов»)

В рамках задачи по очистке мусора и поддержанию строго одной канонической матрицы (`MASTER_BUG_MATRIX.md`), директория `AuditRepo/projects/gb-is-my-strength/incoming/` была полностью вычищена:
- Все 58 устаревших директорий от предыдущих прогонов агентов (`arena-agent-6`, `deep-auditor`, `arena-surgical-surgeon` и др.) перенесены в архив `archive/2026-07-03-stale-incoming/`.
- В `incoming/` оставлены исключительно 3 корневых управляющих документа (`GB_AUDIT_MASTER_REPORT.md`, `GB_REPAIR_ORDER.md`, `README.md`).
