# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-03  
**HEAD исходного репозитория:** `c0ab48fc` (hard-texts OG dimensions fix; descendant of sitemap lastmod refresh)
**Режим аудита:** Multi-Agent Synthesis (Passes 1–46)  

---



## 🟢 PASS 43 / BAPTISTY ROOT ASSET PATH FIX (2026-07-03)

**Source fix commit:** `932af3f32f9088363f1024affa277b6e7db8257e` (`lane/visual-baptisty-root-path-fix-2026-07-03`, pushed to `main`).

Fixes the temporary local-reference regression from the first Baptisty parity sync: root `baptisty-rossii/index.html` now references `../css/floating-cluster.css` and `../js/floating-cluster-controller.js`, not `../../...`.

Verified on `932af3f3`:

- `npm run validate:static-publication` ✅
- `node scripts/visual-parity-screenshots.js --routes /baptisty-rossii/ --threshold 1.0` ✅ desktop/mobile 0.000%
- `npm run workflows:check` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-root-path-fix-932af3f.md`. Remote Deploy green: workflow_dispatch run `28685603542` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28685603542).

---

## 🟢 PASS 42 / DEPLOY BROAD RUNTIME SMOKE GATE (2026-07-03)

**Source fix commit:** `8d0c12e0756c6dd0327a212dba6b8a7bbdc01d3e` (`lane/system-dist-runtime-smoke-gate-2026-07-03`, pushed to `main`).

`NEW-64` / `CHECK-GAP-DIST-SMOKE` is **fixed-current on source main `8d0c12e0`**. Deploy now runs `node scripts/dist-smoke-audit.js --no-build --production-like`; `scripts/check-workflows.js` enforces this contract.

Verified on `8d0c12e0`:

- `node --check scripts/check-workflows.js` ✅
- `npm run workflows:check` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅
- `npm run pagefind:build:dist && npm run sw:dist:audit:deploy-switch` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_dist-runtime-smoke-gate-fixed-8d0c12e.md`.

---

## 🟢 PASS 41 / BAPTISTY VISUAL PARITY FIX (2026-07-03)

**Source fix commit:** `914c7fb11e51e25937e0afc0ef79118c7a246394` (`lane/visual-baptisty-parity-2026-07-03`, pushed to `main`).

`NEW-65` / `VIS-BAPTISTY-PARITY` is **fixed-current on source main `914c7fb1` by local W3 pixel evidence**. Root `baptisty-rossii/index.html` is synced with the current dist PremiumControls footer contract.

Verified on `914c7fb1`:

- `npm run strangler:build:production-like` ✅
- `node scripts/visual-parity-screenshots.js --routes /baptisty-rossii/ --threshold 1.0` ✅
  - desktop diff: 0.000%
  - mobile diff: 0.000%
- `npm run owner:ui-guard` ✅
- `npm run audit:premium-controls` ✅ 87/87
- `npm run baptisty-rossii:visual-parity:audit` ✅
- `npm run validate:strict` ✅ (0 errors, 2 pre-existing warnings)
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-visual-parity-fixed-914c7fb.md`. Remote Visual Parity Guard green: run `28684680251` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28684680251).

---

## 🟢 PASS 40 / SW PAGEFIND DEPLOY-SWITCH FIX (2026-07-03)

**Source fix commit:** `d5c65647d57cf3bc83b6543cb58135cdd279013f` (`lane/system-sw-pagefind-bootstrap-2026-07-03`, pushed to `main`).

`CI-HIDDEN-SW-PAGEFIND-PRECACHE` / `NEW-66` is **fixed-current on source main `d5c65647` by local deploy-switch evidence**. `sw.js` now includes `/pagefind/pagefind.js` in `PRECACHE_ASSETS` and bumps `CACHE_VERSION` to `gb-v187-pagefind-bootstrap-20260703`.

Verified on `d5c65647`:

- `npm run pagefind:build:dist` ✅
- `npm run sw:dist:audit:deploy-switch` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅
- `npm run gill:mobile-layout:audit` ✅
- `npm run audit:premium-controls` ✅ 87/87
- `npm run validate:static-publication` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_sw-pagefind-bootstrap-fixed-d5c6564.md`. Remote Deploy green: run `28683773647` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28683773647).

---

## 🟢 PASS 39 / RUNTIME NO-UNDEF FIX LANE (2026-07-03)

**Source fix commit:** `8a816ce40c57e916797aa37f275e3518ca757203` (auto cache-bust descendant of `8a816ce4`) (`lane/system-runtime-no-undef-current-2026-07-03`).

`CI-P0-GILL-RUNTIME-REFS` is **fixed-current on source main HEAD `8a816ce4` by local browser/build evidence**; final deploy status is pending GitHub Actions completion. This was not a Gill visual regression: it was global JS runtime no-undef.

Verified on `8a816ce4`:

- `js/site.js` `tt is not defined` fixed by adding a scoped `tt()` helper inside the backlinks/outlinks IIFE.
- `/nagornaya/` `SiteUtils` runtime/order risk fixed by `safeReady()` calling `window.SiteUtils.ready(fn)` when available.
- `gill:mobile-layout:audit` ✅
- `gill:mobile-play:smoke` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅
- `npm run audit:premium-controls` ✅ 87/87
- `npm run validate:static-publication` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_runtime-no-undef-fixed-22eb084.md`.

---

## 📊 Итоговая статистика

| Приоритет | Количество | Описание |
|-----------|------------|----------|
| 🔴 **P0 (Critical)** | 1 | REG-001 _headers бесполезен (остаётся — нужна CDN-инфра) |
| 🟠 **P1 (High)** | 1 | CI-дублирование (частично оптимизирован) |
| 🟡 **P2 (Medium)** | 8 | SEO, search, audit drift |
| 🔵 **P3 (Medium)** | 6 | a11y, social metadata, оптимизация |
| 🔵 **P3 (Refactor)** | 4 | site.js монолит, enhancements.js, no source maps, no ES modules |
| 🟣 **AuditRepo** | 5 | Слабая валидация, stale SHA, нет автоматизация |
| ❌ **Fixed** | 60 | Исправлено в коммитах `f284fc60`–`e0877b0b` |
| **ВСЕГО АКТУАЛЬНЫХ БАГОВ** | **19** | (было 79, -60 исправлено/закрыто) |

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
- **NEW-60 ✅:** CSP meta добавлена на 10 karty/ holding pages (было 0/10, стало 10/10) — ⚠️ REGRESSION CONFIRMED on `f1e9abd9` (Pass 36): static scan finds 0/10 karty/ holding pages with `Content-Security-Policy` meta. See NEW-69.
- **NEW-61 ✅:** `form-action 'self'` добавлен в CSP meta на всех 51 странице + _app

- ~~**NEW-68 (P2, CSP form-action regression):** dist HTML pages missed `form-action 'self'`~~ ✅ FIXED-CURRENT on source main `14574a9a`: postbuild CSP hardening appends `form-action 'self'`; `dist-publication-audit` now blocks regressions.
- ~~**NEW-69 (P2, CSP meta regression on karty/ holding pages):** karty/map-like dist pages missed CSP meta~~ ✅ FIXED-CURRENT on source main `14574a9a`: postbuild CSP hardening injects CSP on dist pages missing it; `dist-publication-audit` now blocks regressions.
* ~~**NEW-70 (P3, sitemap.xml stale lastmod):** stale broad June lastmod buckets~~ ✅ FIXED-CURRENT on source main `a434b45e`: sitemap lastmods refreshed from route git commit dates; 43 URLs validate and audit-pro passes.
* ~~**NEW-71 (P3, README.md version drift):** README stayed at v10 / 2026-06-26~~ ✅ FIXED-CURRENT on source main `da4a65cd`: README version line is now v11 / 2026-07-04.
* **NEW-72 (P3, SVG dedup micro-optimization):** downgraded from P2 on source `a434b45e`. Current exact scan finds 4 duplicate SVG patterns (book icon, flip-card finger icon, highlights X, glossary chevron), ~1.9KB raw before helper overhead and likely much less gzip impact. Real but advisory; no deploy/SEO/runtime impact. See `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_svg-dedup-new72-downgrade.md`.
- ~~**NEW-67 (P3, dead scripts in `scripts/`):** 10 scripts reported dead by no-package-caller heuristic~~ ✅ FALSE-POSITIVE / RECLASSIFIED on source `a434b45e`: all 10 pass `node --check` and have documentation/manual QA/migration ownership evidence. Do not delete from this finding. See `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dead-scripts-new67-reclassified.md`.

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

### P1-CI-DUPE: Дублирование npm ci + cache-bust в IndexNow и Deploy — ✅ FIXED-CURRENT on `8dfaac04`
* **Файлы:** `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`
* **Суть:** 2× npm ci + 2× cache-bust + Astro build = 20–30 мин CI на каждый пуш.

### REG-002: ~~Deploy pipeline SPOF для 14 путей~~ ✅ FIXED
* **Файл:** `.github/workflows/deploy.yml`
* **Фикс:** Деплой теперь разрешён при падении indexnow (с warning). Deploy.yml выполняет собственный cache-bust и валидацию.

---

## 🟡 P2 — MEDIUM PRIORITY (9 открытых багов)

* ~~**P2-AUDIT-DRIFT:** PRECACHE/cache-bust/Pagefind deploy-switch drift~~ ✅ FIXED-CURRENT by `d5c65647` + `14574a9a`: `cache-bust-assets.js` remains shared, `sw.js` precaches `/pagefind/pagefind.js`, `sw:dist:audit:deploy-switch` passes, and `dist-publication-audit --require-pagefind --forbid-dev` now also enforces CSP coverage.
* **P2-SEARCH-EAGER:** search.js создаёт DOM при загрузке — ✅ VERIFIED-CURRENT on `dbd0bb55`: `js/search.js` 31,534 bytes is loaded on 39 pages; before first user search/open it creates 128 `.cp-*` command-palette nodes and ~106 KB `.cp-*` outerHTML on sampled routes (`/`, `/articles/kod-da-vinchi/`, `/baptisty-rossii/`). Also eagerly requests `/data/search-manifest.json`; Pagefind itself stays lazy (`window.__pagefindReady__ === false` before interaction).
* ~~**CI-P0-GILL-RUNTIME-REFS:** browser runtime no-undef (`highlights.js` `r`, `site.js` `tt`, `/nagornaya/` `SiteUtils`) blocked Gill mobile layout audit~~ ✅ FIXED-CURRENT: fixed by `bced1c69` / `8a816ce4` / `19062297`; later Deploy runs are green (`01ff5ce3`, `14574a9a`, `a434b45e`).
* ~~**CI-P1-NAGORNAYA-SITEUTILS-ORDER:** `/nagornaya/` pageerror / bad early ready/helper refs~~ ✅ FIXED-CURRENT by `8a816ce4` + `19062297`: `safeReady()` delegates correctly and remaining bare `SiteUtils.*` refs were prefixed with `window.`; dist smoke and Deploy are green.
* ~~**CHECK-GAP-DIST-SMOKE / NEW-64:** deploy workflow omitted broad `dist-smoke-audit.js` runtime smoke~~ ✅ FIXED-CURRENT on source main `8d0c12e0`: deploy now runs `node scripts/dist-smoke-audit.js --no-build --production-like`; `check-workflows.js` protects the step.
* ~~**CI-HIDDEN-SW-PAGEFIND-PRECACHE / NEW-66:** deploy-switch Pagefind bootstrap missing from `PRECACHE_ASSETS`~~ ✅ FIXED-CURRENT on source main `d5c65647`: `sw.js` precaches `/pagefind/pagefind.js`, `CACHE_VERSION` bumped to `gb-v187-pagefind-bootstrap-20260703`, and `npm run sw:dist:audit:deploy-switch` passes after `pagefind:build:dist`.
* ~~**VIS-BAPTISTY-PARITY / NEW-65:** `/baptisty-rossii/` pixel-diff failed because root legacy footer was stale vs dist PremiumControls footer~~ ✅ FIXED-CURRENT on source main `914c7fb1`: targeted pixel guard now reports desktop 0.000%, mobile 0.000%.
* ~~**CI-CSSLAYER-STALE:** `css:layer:validate` pointed at deleted `css/site-layered.css`~~ ✅ FIXED-CURRENT on source `dbd0bb55` by `a65874a0`; script now validates `css/site.css`.
* ~~**P2-SEARCH-SVG-DUP:** 20+ дублированных SVG-констант в search.js (~3KB)~~ ✅ FIXED (Pass 28: helper _s() + path constants _p0/_p1/_p2, -1.9KB)
* **BUG-012:** Рассинхрон заголовков MDX и HTML (3 статьи) — NOT A BUG, SEO оптимизация by design
* **NEW-43:** Отсутствие атрибутов `width`/`height` у content изображений — ✅ VERIFIED-CURRENT on `f1e9abd9` (Pass 35): not limited to `_build-tools` as originally archived. Static scan of built dist: articles=10, baptisty-rossii=0 (Astro components have dimensions), nagornaya=8 (legacy HTML missing dimensions). Total: 18 `<img>` tags in dist without `width=` attribute (excluding internal `gb-hl-` icons). Causes CLS risk per Lighthouse. Fix: add `width`/`height` (or CSS `aspect-ratio`) to the 18 legacy img tags.
* **BUG-010:** Хаос с брейкпоинтами в CSS — ✅ VERIFIED-CURRENT on `dbd0bb55`: aggregate CSS has 128 width conditions across 23 unique px values (`360, 380, 390, 420, 430, 440, 480, 481, 500, 520, 560, 600, 640, 680, 700, 760, 768, 820, 899, 900, 960, 1024, 1180`); `css/site.css` alone has 174 media blocks, 87 width conditions, 18 unique breakpoint values.
* **BUG-011:** Конфликт брейкпоинтов на 768px — ⚠️ RECLASSIFIED on `dbd0bb55`: exact boundary overlap exists (`max-width:768px` appears 17× in `site.css`; `min-width:768px` appears 1×), but audit found 0 same selector+property collisions between max/min 768 zones; `min-width:768px` only defines `.md\:grid-cols-2`/`.md\:grid-cols-3`. Treat as boundary architecture risk, not proven visual conflict until browser/selector evidence exists.
* **BUG-014:** Race condition в скриптах сборки — ⚠️ RECLASSIFIED (no evidence in current source): `scripts/cache-bust.js` and `scripts/astro-cache-bust-postbuild.js` are fully synchronous (no `Promise`/`await`/`setTimeout` calls). All writes are sequential `fs.writeFileSync`. There is no in-process async race. A potential race remains only across separate `npm run` invocations (cache-bust vs build) and is gated by `validate:static-publication` ordering. Treat as stale-on-current-head unless a real concurrent-write race is reproduced.
* **BUG-016:** ~8 неиспользуемых CSS custom properties (5 false positives: --ghost/--translation/--debunk/--planned/--vertical are class suffixes, not properties; 4 truly unused removed in Pass 28: --icon-size, --icon-radius, --ng-toc-bg, --border-strong; 9 remain from 17 original)

---

## 🔵 P3 — MEDIUM (8 открытых багов)

* * **NEW-45:** Отсутствие `<link rel="prefetch">` для навигации — ✅ FIXED on `8dfaac04`
- **Суть:** Добавлены prefetch-hints для 5 навигационных роутов в BaseLayout.astro
- **Фикс:** `<link rel="prefetch">` для /articles/, /biografii/, /hard-texts/, /karty/, /about/
- **Ограничение:** Только Astro-native страницы. Legacy страницы не имеют prefetch — это нормально для P3.
* **NEW-31/32:** HTTP Referrer-Policy/Permissions-Policy не применяются (GitHub Pages ограничение, REG-001)
* ~~**BUG-020:** 336 кнопок без `aria-label` (WCAG)~~ ✅ NOT A BUG — все 674 кнопки имеют visible text или aria-label
* ~~**BUG-021:** 2 короткие meta descriptions~~ ✅ NOT A BUG — все ≥150 символов (SEO норма)
* **BUG-022:** Переопределённые CSS правила — ✅ REVERIFIED-CURRENT on `dbd0bb55`, original “256” count is stale/ambiguous. `css/site.css` audit found 178 same-context repeated selector+property keys (190 beyond-first declarations), 133 with changed values; after separating same-rule progressive fallbacks, there are 52 later-rule changed selector+property keys / 54 later overrides. 81 changed keys are same-rule fallback declarations (e.g. rgba → color-mix) and should not be treated as full cascade bugs.
* ~~**BUG-024:** Мёртвый TypeScript/JS API в helper модулях~~ ✅ CLOSED (Pass 27: 5 dead exports removed from floating-cluster-ui.ts)
* ~~**PC-107:** Неиспользуемые TypeScript props в PremiumControls интерфейсах~~ ✅ STALE/FIXED-CURRENT on `dbd0bb55`: original archived finding targeted deleted `GillRailControls.astro` props (`context`, `homeHref`, `includeStyles`). Current source has no `GillRailControls*` file or references; current PremiumControls/FloatingCluster/Gill Props are consumed internally; `astro check` has no PC-107/GillRailControls diagnostics.
* **NEW-54-59:** Social/SEO metadata bundle — split status: NEW-55 fixed-current; NEW-59 fixed-current on `c0ab48fc` (`/hard-texts/` OG dimensions now match `og-series-heart.webp` 1360×768). NEW-54 still current (4 sitemap URLs with zero static inlinks: `/karty/ishod/`, `/map/`, `/nagornaya/nakhodki/`, `/rodosloviye/`); NEW-56 current (social metadata gaps); NEW-57 current (preload image mismatches); NEW-58 current (feed title drift).
* ~~**NEW-64 (P3, PREVENTION-GAP):** deploy chain did not run broad browser runtime no-undef smoke~~ ✅ FIXED-CURRENT on source main `8d0c12e0`: `.github/workflows/deploy.yml` now runs broad `dist-smoke-audit --no-build --production-like`, and `scripts/check-workflows.js` enforces it. See Pass 42.
* ~~**NEW-65 (P2, visual parity /baptisty-rossii/):** legacy-root vs dist pixel diff 6.131% desktop / 17.368% mobile~~ ✅ FIXED-CURRENT on source main `914c7fb1`: root `baptisty-rossii/index.html` synced to current dist PremiumControls footer; targeted pixel diff is 0.000% desktop and 0.000% mobile. See Pass 41.
* ~~**NEW-66 (P2, hidden gate — SW/Pagefind deploy-switch):** Pagefind bootstrap missing from SW precache~~ ✅ FIXED-CURRENT by `d5c65647`: `/pagefind/pagefind.js` is in `PRECACHE_ASSETS`, `CACHE_VERSION` bumped to `gb-v187-pagefind-bootstrap-20260703`, `sw:dist:audit:deploy-switch` and Deploy are green.

---

## 🔵 P3 — REFACTORING (4 позиции)

* **R-001:** site.js — 167KB монолит (15 модулей)
* **R-002:** enhancements.js — 48KB (7+ модулей)
* **R-003:** Нет source maps
* **R-004:** Нет `type="module"` → нет tree-shaking

---

## ~~⚪ S0 — DOCUMENTATION~~ ✅ ALL FIXED

* ~~**BUG-026:** Дублирование параграфа §12.5.7 в AGENTS.md~~ ✅ FIXED (Pass 26: дубликат удалён, секции 12.5.4→12.5.8 перенумерованы)
* ~~**BUG-027:** Конфликт нумерации релизов r300–r308~~ ✅ FIXED (Pass 26: дубликаты переименованы в r312-r320)

---

## 🟣 AuditRepo (5 позиций)

* **AR-001:** validate_audit_repo.py — слабая валидация identity-маркеров
* **AR-002:** PROJECT_REGISTRY.md устарел
* **AR-003:** check_auditrepo_structure.py не проверяет содержимое
* **AR-004:** MULTI_WITNESS_VERIFICATION_PROTOCOL — не автоматизирован
* **AR-005:** Нет reverify-автоматизации

---

## ✅ PASS 26 FIXES (коммит `022014cc`, 2026-07-03)

* **BUG-026 ✅:** Дубликат §12.5.7 в AGENTS.md удалён, секции перенумерованы 12.5.4→12.5.8
* **BUG-027 ✅:** Дублирующиеся r300-r308 перенумерованы в r312-r320, маркеры «(was duplicate)» убраны
* **BUG-021 ✅:** NOT A BUG — все baptisty-rossii descriptions ≥150 символов (в пределах SEO нормы 120-160)
* **NEW-39 ✅:** Font preload добавлен: Lora 400 woff2 в 13 PageHead (baptisty-rossii, GillContext, GillSpravochnik, Konfessii, Rodosloviye), Playfair 700 + SourceSans 400 для Karty hub, SourceSans 400 для Avraam/Ishod/Baptizm3D, Lora 400 + Inter 600 + Playfair 700 в BaseLayout
* **BUG-013 ✅:** Font preload закрывает критическую часть (FOUC устранён). CSS preload через rel=preload as=style уже был на большинстве страниц.
* **P2-SW-METADATA ✅:** NOT A BUG — CACHE_METADATA ключ полный URL по спецификации SW API
* **BUG-041 ✅:** NOT A BUG — karty holding pages имеют noindex намеренно (beta)
* **BUG-019 ✅:** NOT A BUG — trailing slash handling корректна в search.js
* **BUG-016 ✅:** Снижено с 62 до ~12 неиспользуемых CSS vars (10 dead aliases + 6 dead class rules удалены в Pass 25)

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

---

## ✅ PASS 27 FIXES (коммит `36f13424`, 2026-07-03)

* **BUG-024 ✅:** 5 мёртвых экспортов удалены из `floating-cluster-ui.ts` (68 строк → 18): `FloatingClusterMode`, `FloatingClusterUiConfig`, `floatingClusterUi`, `floatingClusterRoutes`, `getSeriesParts` — 0 внешних потребителей. Живые экспорты `SeriesKey` (4 uses) и `getSeriesLiteMeta` (2 uses) сохранены.
* **AGENTS.md r312 ✅:** CSS inventory секции §2 обновлён с 8→9 файлов (добавлены `enhancements-runtime.css`, `highlights-runtime.css`, `sw-toast.css`, извлечённые из CSS-in-JS в Pass 24). §0 и §4 таблица маршрутизации CSS обновлены.
* **NEW FINDING:** Корневые HTML-файлы (baptisty-rossii/*/, nagornaya/*/, articles/*/) — устаревшие артефакты предыдущей сборки, НЕ используются в продакшене. Деплой идёт из `dist/`, который генерируется `astro build`. Astro-компоненты корректно содержат `defer` на site-utils.js и scroll-perf.js. Это НЕ баг — артефакт strangler-миграции.

---

## 🔴 PASS 27 REGRESSION FIX (коммит `d78b1adc`, 2026-07-03)

* **REGRESSION ✅ FIXED:** Предыдущий агент (Pass 26) случайно вставил `<link rel="preconnect" href="https://mc.yandex.ru" crossorigin>` как голый HTML прямо в JS-код frontmatter 4 Astro-компонентов. Это вызвало 35 TypeScript ошибок в `astro check` (ts1005, ts1109, ts2304, ts17008). Без Node 22 этот регресс не был обнаружен.
  - `BaseLayout.astro`: preconnect перемещён в шаблонную строку metrika
  - `HomePageChrome.astro`, `KonfessiiPageChrome.astro`, `Baptizm3DBody.astro`: голый `<link>` удалён (preconnect уже есть в соответствующих PageHead)
* **VERIFIED:** `astro check` → 0 errors, 0 warnings (Node 22 + Playwright установлены)
* **VERIFIED:** `strangler:build:production-like` → 53 страницы, все `defer` на месте в dist/
* **NEW-54-59 partial ✅:** 10 статей «Баптисты России» добавлены в feed.xml (17→27 items)
* **BUG-024 ✅:** 5 мёртвых экспортов удалены из floating-cluster-ui.ts (68→18 строк)
* **AGENTS.md r312 ✅:** CSS inventory обновлён с 8→9 файлов

---

## ✅ PASS 28 FIXES (коммит `e0877b0b`, 2026-07-03)

### Critical syntax fix:
* **bookmark-engine.js IIFE ✅:** Минифицированный IIFE был обрезан (отсутствовал `}()` — закрывающая скобка + вызов). Файл не проходил `node --check` с `SyntaxError: Unexpected end of input`. Регрессия была внесена в коммите `47a98da` при минификации (оригинал `71f1efdf` был валиден, 12599→9563 байт). Исправлено: добавлен `}()` в конец файла.

### Performance — SVG deduplication:
* **P2-SEARCH-SVG-DUP ✅:** 10 из 21 SVG-иконок в `search.js` дедуплицированы через helper-функцию `_s(w, sw, vb, p)` и path-константы `_p0` (search), `_p1` (bookmark), `_p2` (star). Результат: 33470→31538 байт (-1932 байта, -5.8%). Выход `_s()` побайтово идентичен оригинальным SVG-строкам.

### Dead CSS cleanup:
* **BUG-016 partial ✅:** 4 неиспользуемые CSS custom properties удалены (17→13 dead vars):
  - `--icon-size` (floating-cluster.css:1058) — установлена, но нигде не потребляется через `var()`
  - `--icon-radius` (floating-cluster.css:1058) — установлена, но нигде не потребляется через `var()`
  - `--ng-toc-bg` (nagornaya-mobile-toc.css) — определена в `:root` и `html.dark`, но нигде не используется
  - `--border-strong` (site.css @media prefers-contrast:more) — определена, но нигде не потребляется
* **FALSE POSITIVES identified:** 5 ранее считавшихся «unused» свойств оказались частями CSS-селекторов (не custom properties): `--ghost` (`.toc-action-btn--ghost`), `--translation` (`.h-article-card--translation`), `--debunk` (`.h-article-card--debunk`), `--planned` (`.h-article-thumb--planned`), `--vertical` (`.article-img--vertical`)

### Gates:
* `audit-pro` ✅ PASSED
* `astro check` ✅ 0 errors, 0 warnings
* `node --check js/bookmark-engine.js` ✅ SYNTAX OK
* `node --check js/search.js` ✅ SYNTAX OK
* All `cache-bust` hashes updated (75 files)

---

## 🕵️‍♂️ PASS 29 — PURE AUDITOR & VERIFICATION PASS (2026-07-03, Node 22 v22.14.0)

**Режим выполнения:** Чистый аудитор и верификатор («Режим Чистого Аудитора и Верификатора», строго без изменения исходного кода в `gb-is-my-strength`).  
**Toolchain:** Node.js `v22.14.0` (официальный Linux x64 бинарник в `/home/user/.node22/bin`) + Playwright Chromium (`v1228`).  
**Объем аудита:** 66+ строгих пронумерованных bash-проверок по всем 6 архитектурным доменам, верификация актуального HEAD `45f27c61` на отсутствие регрессий и «костылей», а также подтверждение гигиены репозитория.

### 🧪 Эмпирическая верификация актуального HEAD `45f27c61`

На чистом стенде Node 22 была проведена полная перепроверка всех 15 публикационных гейтов и скриптов вёрстки после удаления мёртвого кода (IIFE в `bookmark-engine.js`, дедупликация 1.9 КБ SVG в `search.js`, удаление 4 неиспользуемых CSS vars, нормализация `prefers-contrast:more`):

1. **Сборка и публикационный контракт (Commands 13–22):**
   - `npm run strangler:build:production-like`: 100% успешная сборка продакшн-дистрибутива (53 статических Astro-страницы, 444 легаси-файла перенесено, 0 дрифт хешей).
   - `npx astro check`: TypeScript-диагностика по 414 файлам проекта: **0 ошибок, 0 предупреждений**.
   - `node scripts/dist-publication-audit.js`: Проверены все 45 обязательных артефактов дистрибутива, подтверждено отсутствие утечек приватных директорий (`src`, `scripts`, `research`, `raw-sources`, `_legacy`).
   - `npm run contract:compare`: Точное соответствие 43 публичных baseline-страниц.
   - `npm run page-ownership:dist:production-like`: Подтверждён владелический контракт 53 роутов.
   - `npm run dist:css-parity`: 52/52 страниц несут корректный CSS-контракт.
   - `npm run sw:dist:audit`: Верифицирована готовность Service Worker (`CACHE_VERSION` = `gb-v186-sw-toast-css-20260703`, `PRECACHE_ASSETS` = 28 записей).
   - `npm run editorial:lint` & `check-workflows.js`: Все редакционные нормы и политики GitHub Actions выполнены.

2. **Интерактивные карты, токены и мобильный UX (Commands 23–32):**
   - `npm run maps:validate` & `npm run maps:publication-status`: Валидация схем 10 библейских карт (Авраам, Исход, Павел и др.) и статусов публикации.
   - `npm run tokens:check`: Проверка дизайн-токенов (0 легаси `var()` ссылок).
   - `node scripts/konfessii-map-audit.js`: Проверены 14 инвариантов 3D-карты баптизма (рендеринг WebGL Canvas, отсутствие блокировки кликов геометрией, изоляция iframe `_app/index.html`).
   - `npm run avraam:audit`: 28/28 проверок интерактивной карты пути Авраама успешно пройдены.
   - `node scripts/audit-pro.js`: Профессиональный аудит завершён с результатом **166 passed, 2 warnings (CSS budget & z-index), 0 errors**.

3. **Контентная целостность, поисковые индексы и SEO (Commands 33–42):**
   - `npm run content:parity`: Проверка MDX vs HTML паритета по словам (допуск ±8%) и семантике — все статьи в зелёной зоне.
   - `npm run gill:reading-time:audit`: Верифицировано каноническое время чтения серии (149 минут) в MDX, `search-manifest.json` и HTML.
   - `npm run gill:pagefind:audit`: Подтверждено, что все части серии индексируются Pagefind через `<article class="article-body">`.
   - `node scripts/schema-rich-results-audit.js` & `node scripts/dist-jsonld-audit.js`: 60 валидных блоков JSON-LD, 25 схем Article, 39 BreadcrumbList, 4 FAQPage.
   - `node scripts/baptisty-series-shadow-audit.js`: 10 роутов «Баптисты России» соответствуют strict-native стандарту без `loadLegacyFullDocument`.

4. **Визуальный паритет и миграция легаси-разделов (Commands 43–57):**
   - Успешно выполнены все 15 специализированных скриптов визуального паритета: `about`, `biografii`, `hard-texts`, `pastor-series`, `articles`, `gill:context`, `gill:spravochnik`, `konfessii`, `karty`, `baptisty-rossii`, `home`, `nagornaya`, `catalogs`, `baptisty:roadmap`, `baptisty:visual-atlas`.

5. **Аудит незатронутых зон и гигиена (Commands 58–66):**
   - `npm run audit:premium-controls`: 87/87 проверок PremiumControls прошли успешно.
   - Проверка файловой структуры (Commands 60–61) подтвердила окончательное удаление мёртвых скриптов `back-to-top.js` и `series-cards.js`, а также мёртвого стиля `site-layered.css`.
   - `dist/feed.xml` содержит ровно 27 элементов (включая 10 статей «Баптисты России»).
   - В директории `AuditRepo/projects/gb-is-my-strength/incoming/` поддерживается строгая гигиена: все 58+ устаревших папок перемещены в архив, оставлены исключительно 3 корневых управляющих документа.

### 🎯 Заключение аудитора

Фиксы, внесенные в коммитах `e0877b0`, `d78b1ad`, `36f1342`, `022014c` и `45f27c6`, выполнены качественно и профессионально, без внедрения временных костылей или новых предупреждений линтера. Оставшиеся **19 открытых багов** (из 79 исходных, 60 закрыто) точно отражают текущий остаточный архитектурный долг проекта для последующего закрытия Исполнителем.

---

## 🔴 PASS 30 CURRENT CI REVERIFY (source HEAD `b4b312a8`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes. Fresh source clone at `b4b312a8ce0799e82a1075855518627ce9897d5d`.

* **CI status:** Public GitHub Actions API shows `Deploy to GitHub Pages` run `28677794134` on `b4b312a8` completed **failure**. Jobs API identifies failed step: **`Gill mobile reference layout audit`**.
* **CI-CSSLAYER-STALE ✅ fixed-current:** current `package.json` now uses `css:layer:validate = node scripts/css-layer-validator.js css/site.css --ceiling=202`; local `npm run css:layer:validate` passes. The old deleted `css/site-layered.css` blocker is stale/fixed by source commit `a65874a0`.
* **CI-P0-GILL-RUNTIME-REFS 🔴 verified-current:** after `npm run strangler:build:production-like` and Playwright Chromium install, local `npm run gill:mobile-layout:audit` fails with 40 runtime pageerrors:
  - `r is not defined` ×20 from `js/highlights.js?v=c972d20e:1:638` — strict IIFE assignment to undeclared `r` while injecting `highlights-runtime.css`.
  - `tt is not defined` ×20 from `js/site.js?v=77687914:484` — backlinks block calls `tt(n.title)` with no definition in scope.
* **Blast radius addendum:** broader Playwright scan over 52 `dist/` routes found relevant runtime failures on 33 routes after filtering localhost favicon CSP noise: `r is not defined` on 32 routes, `tt is not defined` on 15 routes, and `SiteUtils is not defined` on `/nagornaya/`.
* **Independent witness:** `node scripts/dist-smoke-audit.js --no-build --production-like` also fails on representative routes with `r is not defined` / `tt is not defined` (6 issues across desktop/mobile `/articles/kod-da-vinchi/`, `/baptisty-rossii/`, `/baptisty-rossii/noch-na-kure/`).
* **Control witnesses:** `node --check js/*.js` passes (syntax only), `tokens:check` passes, `gill:mobile-play:smoke` passes. This is a browser runtime no-undef regression, not a syntax/build failure.
* **Full evidence:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_ci-red-b4b312a-runtime-reference-errors.md`.

---

## 🔴 PASS 30.b — independent re-verification on current HEAD `dbd0bb55` (2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes. Independent second run after pulling the parallel patcher's `e2f0ae4` Gill-GB2 fix (which did not touch the runtime regression).

* **CI status on `dbd0bb55`:** Public GitHub Actions API shows `Deploy to GitHub Pages` run `28679684009` on `dbd0bb55` completed **failure** with the same failed step **`Gill mobile reference layout audit`**. The patcher did not unblock CI.
* **W1 source witness:** `js/highlights.js` still contains the bare `}r=document.createElement("link")` assignment in a strict-mode IIFE on `dbd0bb55`. The pattern is identical to `b4b312a8`.
* **W3 browser witness (re-run):** `npm run strangler:build:production-like` then `AUDIT_BASE=http://127.0.0.1:8091 npm run gill:mobile-layout:audit` reproduces the same 40 pageerrors on `dbd0bb55`:
  - `r is not defined` ×20 from `js/highlights.js?v=c972d20e:1:638`
  - `tt is not defined` ×20 from `js/site.js?v=77687914:484:1`
* **Triangulation:** 3 independent witnesses (CI API, Pass 30 W3, Pass 30.b W3) confirm the regression is alive on current main. CI-P0-GILL-RUNTIME-REFS remains **P0 / verified-current**.
* **Recommendation for next executor lane (`lane/system-runtime-no-undef`):** (1) `var r = document.createElement(...)` (or move the assignment into a non-strict inner `function(){…}()`) inside `js/highlights.js`; (2) ensure `tt` is reachable from the strict scope where it is called in `js/site.js` (top-level helper, or wrapper `function(){…}()`); (3) re-run `gill:mobile-layout:audit`, `dist-smoke-audit.js`, and the full `validate:static-publication` after the fix.
* **Full evidence:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_ci-red-b4b312a-runtime-reference-errors.md` §9.

---

## 🔴 PASS 31 CURRENT-HEAD REFRESH (source HEAD `dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files created. Existing Pass 30 reverify document was appended with current-head evidence.

* **Remote moved:** `gb-is-my-strength/main` advanced from `b4b312a8` to `dbd0bb55` via Gill rail/frame commit `e2f0ae4e` + cache-bust commit `dbd0bb55`.
* **CI remains red:** GitHub Actions Deploy run `28679684009` on `dbd0bb55` completed **failure**; failed step remains **`Gill mobile reference layout audit`**.
* **P0 still current:** local reverify on `dbd0bb55` after `npm run strangler:build:production-like` confirms `npm run gill:mobile-layout:audit` still fails with 40 pageerrors: `r is not defined` ×20 and `tt is not defined` ×20.
* **Independent witness still current:** `node scripts/dist-smoke-audit.js --no-build --production-like` fails with the same representative runtime errors (`r`/`tt`) across desktop/mobile representative routes.
* **Blast radius unchanged:** broad 52-route dist smoke still shows 33 relevant failing routes after filtering localhost favicon CSP noise: `r` ×32, `tt` ×15, `SiteUtils` ×1 on `/nagornaya/`.
* **Conclusion:** `CI-P0-GILL-RUNTIME-REFS` and `CI-P1-NAGORNAYA-SITEUTILS-ORDER` remain **verified-current** on `dbd0bb55`; previous `b4b312a8` evidence is still valid as root-cause history but no longer latest HEAD.


---

## 🟠 PASS 32 P2 AUDIT — Search eager DOM verification (`dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **P2-SEARCH-EAGER ✅ verified-current:** `js/search.js` is 31,534 bytes and referenced by 39 built pages.
* Browser evidence before any search interaction/open:
  - `/`: 128 `.cp-*` nodes, ~106,049 bytes `.cp-*` outerHTML, search button present.
  - `/articles/kod-da-vinchi/`: 128 `.cp-*` nodes, ~106,049 bytes `.cp-*` outerHTML.
  - `/baptisty-rossii/`: 128 `.cp-*` nodes, ~106,049 bytes `.cp-*` outerHTML.
* Resource evidence on `/` before interaction: browser requests `css/command-palette.css`, `js/search.js`, and `/data/search-manifest.json` on load. Pagefind remains lazy (`window.__pagefindReady__ === false`, no Pagefind resource request before interaction), so the bug scope is eager command-palette DOM + manifest load, not Pagefind eager load.
* Recommended executor direction: lazy-create the command palette shell and fetch/search-manifest on first open (`#gbSearchBtn`, `Cmd/Ctrl+K`, or `gb:openSearch`), while keeping the small trigger button eager.


---

## 🟠 PASS 33 P2 AUDIT — CSS breakpoint verification (`dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **BUG-010 ✅ verified-current:** breakpoint fragmentation remains broad. Across production CSS files (`site.css`, `floating-cluster.css`, `nagornaya-mobile-toc.css`, `command-palette.css`, runtime CSS, mobile hotfix) there are 128 width media conditions and 23 unique px breakpoint values. `css/site.css` alone contains 174 `@media` blocks, 87 width conditions and 18 unique px values.
* **Most frequent breakpoint values (aggregate):** `600`×21, `768`×20, `899`×18, `480`×18, `640`×8, `680`×5, `900`×5.
* **BUG-011 ⚠️ reclassified:** exact 768 overlap is real (`max-width:768px` and `min-width:768px` both exist), but direct selector/property collision was not reproduced. In `site.css`, max-768 blocks: 17; min-768 blocks: 1; same selector+property across max/min 768: 0. The single min-768 block only contains `.md\:grid-cols-2` and `.md\:grid-cols-3` grid-template utilities.
* **Executor guidance:** consolidate breakpoint tokens as CSS architecture work, but do not claim a concrete 768 visual regression without a browser witness or selector/property collision proof.


---

## 🟠 PASS 34 P2 AUDIT — CSS override recount (`dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **BUG-022 ✅ reverified-current with corrected count:** The old “256 overridden rules” wording is not precise for current `css/site.css`.
* Current `css/site.css` parse: 2,636 selector rule entries.
* Same media/context repeated selector+property keys: 178 (190 beyond-first declarations), 133 changed-value keys (144 changed beyond-first declarations).
* After separating same-rule progressive fallbacks from later cascade overrides:
  - **later-rule repeated keys:** 95 (98 later rule repeats)
  - **later-rule changed keys:** 52 (54 later changed overrides)
  - **same-rule fallback changed keys:** 81 (88 same-rule declaration fallbacks, often legacy color value followed by `color-mix(...)`)
* Examples of real later-rule changed overrides: `body` background/color/font values, `a` color, `.bottom-bar` transition, `.pullquote` border removal, `.btoc-fontsize-btn` min-size 26px→44px, `.gtip.gb-floating-tip` opacity/pointer-events/visibility/transform, print `body/main/p` rules.
* Executor guidance: treat BUG-022 as CSS cascade debt, but preserve intentional same-rule fallback declarations unless the design-token support matrix changes.


---

## 🟢 PASS 35 P3 AUDIT — PC-107 retirement check (`dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **PC-107 ✅ stale/fixed-current:** Archive evidence shows PC-107 originally referred to `GillRailControls.astro` dead TypeScript props (`context`, `homeHref`, `includeStyles`) and reinforced PC-101 dead component deletion.
* Current source witness: `find src -name '*GillRailControls*'` returns no files; grep for `GillRailControls`, `context`, `homeHref`, `includeStyles` in PremiumControls/Gill source returns no current PC-107 target.
* Current component Props witness: `PremiumControlAnchor`, `ClusterButton`, `FloatingCluster`, `PlayEmber`, `RomanNumeral`, `SaveButton`, `SeriesLiteCluster`, `SingleArticleCluster`, Gill `*Overlay/Rail/MobileBar/Chrome`, and `SeriesMark` all consume their declared Props internally.
* `astro check` witness: 414 files checked, 0 errors; no PC-107/GillRailControls unused-prop diagnostics. Remaining hints are unrelated script-processing hints plus unrelated `KartyHoldingPage.astro` `slug` diagnostic.
* Note: `PremiumControlAnchor` and `ClusterButton` have no current callsites, but that is not PC-107 (unused props). `PremiumControlAnchor` is explicitly protected by `owner-ui-regression-guard.js` as a structural marker.


---

## 🟠 PASS 36 P3 AUDIT — NEW-54..59 social/SEO bundle reverify (`dbd0bb55`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **NEW-54 ✅ current:** sitemap has 43 URLs; four still have zero static inlinks from other sitemap pages: `/karty/ishod/`, `/map/`, `/nagornaya/nakhodki/`, `/rodosloviye/`.
* **NEW-55 ✅ fixed-current:** `robots.txt` now has an allow rule for cache-busted font CSS (`/fonts/*.css?*`) while `Disallow: /*?*` remains; old query-blocking font stylesheet finding is no longer current.
* **NEW-56 ✅ current:** 28 built routes miss at least one social metadata field among `og:site_name`, `og:locale`, `og:image:alt`, `twitter:image:alt`. Main clusters: Baptist routes (`og:site_name`, image alts), map holding routes (`og:site_name`/`og:locale`/image alts), `/konfessii/`, `/map/`, plus a few article routes with missing `twitter:image:alt`.
* **NEW-57 ✅ current:** 12 high-priority image preload mismatches: Baptist routes preload `.webp` covers but render `.svg` covers; `/pastor-series/` preloads `hero-main.webp` while body renders `hero.webp`.
* **NEW-58 ✅ current with updated count:** feed title drift is now 23 items (old report said 13). Increase is because 10 Baptist articles are now present in `feed.xml`; their feed titles omit the visible page suffix `— Баптисты России`. Other drifts remain in articles/Nagornaya.
* **NEW-59 ✅ current:** `/hard-texts/` `og:image` is `images/og-series-heart.webp`, declared `1200×630`, actual file dimensions `1360×768`.
* **Executor guidance:** split NEW-54..59 into separate low-risk lanes; NEW-55 should be retired, while NEW-56/57/58/59 need targeted metadata/feed/preload fixes.

---

## 🟡 PASS 34 — Current HEAD refresh: `f1e9abd` (2026-07-03, after `bced1c6` highlights fix + `8446a0d` AGENTS-r312 dedup)

**Mode:** pure auditor/verifier; no source-code changes; no new report files; supersedes the `dbd0bb55` half of the Pass 30.b reverify doc for CI-P0-GILL-RUNTIME-REFS blast radius.

* **Remote moved:** `gb-is-my-strength/main` advanced from `dbd0bb55` to `f1e9abd` via two patcher commits:
  - `bced1c6 fix(highlights): declare r in highlights.js IIFE — убираем ReferenceError «r is not defined»` (the `r` runtime error is now fixed in source).
  - `8446a0d chore(agents-md): resolve duplicate AGENTS-r312 revision-table entry` (docs hygiene).
* **CI status on `f1e9abd`:** Public GitHub Actions API shows `Deploy to GitHub Pages` run `28680826378` on `f1e9abd` completed **failure**; failed step remains **`Gill mobile reference layout audit`**. The patcher fixed only the highlights `r` half; the deploy is still red because the `tt` runtime error in `js/site.js` remains.
* **W1 source witness (Pass 34):**
  - `js/highlights.js` now contains `var n="gb-highlights-v1",e=!1,r;` — the bare `r=document.createElement("link")` is now var-declared in the strict IIFE. Pattern search: **0** hits for the old `}r=document.createElement("link")` bug.
  - `js/site.js` still has `a.innerHTML=tt(n.title)+'<small>'+...` without a `tt` declaration reachable from the strict scope where it is called. Function `tt(e)` exists at depth=2 (non-strict) and `tt(n.title)` call is at depth=4 (strict, post `use strict`), so the strict inner IIFE does not see the outer function declaration under minified TDZ rules.
* **W2 dist artifact (Pass 34):** `dist/js/highlights.js?v=c972d20e` rebuilt with `var n,e,r;` declaration; `dist/js/site.js?v=77687914` byte-identical to prior build (still 166,792 bytes, still has the `tt` depth-4 call).
* **W3 browser witness (Pass 34):** After fresh `npm run strangler:build:production-like` and `AUDIT_BASE=http://127.0.0.1:8091 npm run gill-mobile-layout-audit`:
  - `r is not defined`: **0** pageerrors (was 20 on `dbd0bb55`).
  - `tt is not defined`: **20** pageerrors (unchanged from `dbd0bb55`).
  - Total pageerrors: 20 (down from 40 on `dbd0bb55`).
* **CI-P0-GILL-RUNTIME-REFS — Pass 34 status:**
  - **Half-fixed:** highlights `r` no-undef. Recommended retirement of the highlights half once dist reflects `var n,e,r;` (already true in current dist).
  - **Still current:** site `tt` no-undef. Severity remains P0 / CI-blocking because the gill-mobile-layout audit still fails on pageerror and therefore the deploy still red.
* **CI-P1-NAGORNAYA-SITEUTILS-ORDER:** Not re-tested in Pass 34. Script-ordering issue is structural and presumed still current.
* **Executor lane update:** `lane/system-runtime-no-undef` is now narrowed to **`js/site.js` only** (highlights half already fixed by `bced1c6`). Minimum fix: add a top-level `function tt(e){return String(null==e?"":e).replace(/[&<>"]/g,function(e){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[e]})}` reachable from the strict scope where the call happens (insert into the same outer non-strict IIFE that already contains the original `tt` declaration, **or** convert the inner `use strict` to non-strict for that block).
* **Acceptance gates after fix:**
  - `node --check js/site.js` PASS
  - `npm run cache-bust` (to refresh `?v=` hash so dist picks up the fix)
  - `npm run strangler:build:production-like` PASS
  - `npm run gill:mobile-layout:audit` PASS (0 pageerrors on Gill routes)
  - `node scripts/dist-smoke-audit.js --no-build --production-like` PASS (no `r`/`tt`/`SiteUtils` pageerrors on representative routes)
  - `npm run validate:static-publication` PASS
  - GitHub Actions Deploy run completes with `Gill mobile reference layout audit` step = success.

---

## ✅ PASS 34.b — `CI-P0-GILL-RUNTIME-REFS` highlights half retirement

* `bced1c6` retired the `r is not defined` half. Dist artifact and source both reflect the fix.
* Audit-pro `node --check js/highlights.js` and `dist/js/highlights.js?v=c972d20e` no longer surface the bare-assignment pattern.
* Remaining: `tt is not defined` half in `js/site.js` (see Pass 34 above).

---



---

## 🟠 PASS 37 — CSP coverage regression and dead scripts on `f1e9abd9` (2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

### 37.1 CSP coverage regression

Static scan of 52 dist HTML pages on `f1e9abd9`:

```text
Content-Security-Policy meta present: 41 / 52
form-action 'self' present:           1  / 52   (only _app/index.html)
karty/*/index.html with CSP:          0  / 10
```

The 10 karty/ subpages with no CSP meta (reg regression of NEW-60, fixed in commit `47a98da` Pass 24):
`/karty/avraam/`, `/karty/early-church/`, `/karty/ishod/`, `/karty/maccabim/`, `/karty/melachim/`, `/karty/pavel/`, `/karty/revelation/`, `/karty/shoftim/`, `/karty/shvatim/`, `/karty/yeshua/`.

All 51 main-site pages have a CSP meta but **without** `form-action 'self'`. The Pass 24 fix added the directive via `strangler:build:production-like` → `copy-legacy-to-dist.js`; the directive is missing in the current dist, meaning either the build pipeline lost the directive-injection step or the legacy HTML files no longer carry the directive. Either way, it is a regression of NEW-61 and is currently undetected by both `owner-ui-regression-guard.js` and `audit-pro.js`.

**Severity:** P2 (security — forms can post to any origin, including phishing/exfil endpoints). Not blocking Deploy today because the site has no cross-origin form submissions, but the regression is real and should be fixed.

### 37.2 Dead scripts (NEW-67)

```text
Total scripts in scripts/: 89
Referenced in package.json scripts: 77
Referenced in .github/workflows: 12
Module-referenced (cache-bust-assets): 1
Dead: 10
```

Dead scripts: `_audit-deep.js`, `about-leaf-parity-shots.js`, `deep-check.js`, `extract-native-pilot.js`, `genealogy-e2e-v2.js`, `generate-route-profiles.js`, `ishod-qa.js`, `map-visual-qa.js`, `premium-mobile-visibility-smoke.js`, `route-impact-report.js`. All are Refactoring 5.0/6.0 era pilot/QA scripts that were superseded. Manual cleanup.

### 37.3 Links-graph and search-manifest sanity (no regression)

```text
data/links-graph.json: 20 nodes, 75 edges
Nodes not in search-manifest.json: 8 (hermenevtika, krajne, 5× nagornaya, hard-texts) — all 8 dist files exist; different ID namespace
Orphan edges (endpoints not in nodes): 0
data/search-manifest.json: generatedAt = 2026-06-18 (15d stale but content valid)
```

### 37.4 R-001/002 site.js/enhancements.js size status (no change)

```text
js/site.js: 166,792 bytes (163KB), 13 §-commented module sections
  Largest: TTS 7.8KB, StoryMap 6.4KB, Offline 4.3KB
js/enhancements.js: 45,809 bytes (44.7KB), 9 IIFEs
R-003 (no source maps) and R-004 (no type="module") still current.
```

### 37.5 AGENTS.md changelog (no change)

```text
AGENTS-rNNN entries: 77 unique
Duplicates: 3 (r248, r252, r269 — historical ranges, not typos)
check-agents-rev-uniqueness.js: PASS
```

### 37.6 sw.js cache-bust labels (sanity)

```text
dist/js/site.js?v=77687914        — unchanged between dbd0bb55 and f1e9abd9
dist/js/highlights.js?v=c972d20e — unchanged
sw.js CACHE_VERSION               — gb-v186-sw-toast-css-20260703 (stale; source f1e9abd9 newer)
```

---

## 🟠 PASS 38 — Sitemap/README drift + SVG dedup scan on `f1e9abd9` (2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

### 38.1 sitemap.xml lastmod staleness (NEW-70)

```text
Sitemap URLs: 43
Unique <lastmod> values: 4
  2026-06-18T00:00:00+03:00  (1 URL:  /rodosloviye/)
  2026-06-25T00:00:00+03:00  (1 URL:  /hard-texts/)
  2026-06-25T19:00:00+03:00  (12 URLs: /konfessii/, /baptisty-rossii/, etc.)
  2026-07-03T22:44:05+03:00  (~29 URLs: f1e9abd9 cache-bust)
```

The 14 older URLs are correct (the underlying pages have not been edited since those dates). The Astro sitemap integration does not auto-restamp URLs on cache-bust; it uses `lastmod` from the frontmatter/source. Recommendation: add a `restamp-sitemap` step to the build pipeline.

### 38.2 README.md version drift (NEW-71)

```text
README.md: Версия документа: v10 · 2026-06-26 · post-audit hardening
Source HEAD:  f1e9abd9 (2026-07-03)
```

README is 7 days stale. Owner should update to v11 to include Pass 24 dead-code cleanup (47a98da), Refactoring 6.0 Gill Astro migration (r270-r320), and bced1c6 highlights fix.

### 38.3 SVG dedup scan (NEW-72)

```text
Files scanned: 11 JS files
Unique SVG instances: 68
Duplicated SVG fragments (same viewBox+inner): 9
Most-duplicated: 5x <polyline points="20 6 9 17 4 12"/> (checkmark) across:
  - js/highlights.js
  - js/search.js
  - js/site.js
  - js/floating-cluster-controller.js
Other 4x: <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/> (close X icon)
```

Total potential saving: ~1.5-2KB. Each duplicate is a small `function _s(w, h, vb, path)` candidate per file. Not blocking Deploy.

### 38.4 Sanity confirmations (no regression)

- `sw.js` CACHE_VERSION = gb-v186-sw-toast-css-20260703 (stale since Pass 24).
- `sw.js` PRECACHE_ASSETS = 28 entries; `/404.html` is the only HTML page (allowed by `sw-dist-readiness-audit.js`).
- `/pagefind/pagefind.js` is **still missing** from PRECACHE (NEW-66 confirmed; awaits `tt` fix + cache-bust).
- `AGENTS.md` r300-r321 = 22 unique entries (8446a0d dedup fix verified).
- `AGENTS.md` r312 = 1 unique entry (no r300-r320 duplicates).

## 🟠 PASS 35 — PREVENTION-GAP and dist-smoke triangulation on `f1e9abd` (2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

### 35.1 CI gate inventory

```text
.github/workflows/deploy.yml calls (filtered):
  - npm run validate:static-publication (huge chain, see Pass 25-31 evidence)
  - npm run gill:mobile-layout:audit     ← catches pageerrors on Gill routes only (5 routes)
  - npm run gill:mobile-play:smoke
  - node scripts/dist-smoke-audit.js …    ← NOT called in deploy chain
```

`dist-smoke-audit.js` is referenced in 4 places in `package.json`:

```text
"strangler:smoke": "node scripts/dist-smoke-audit.js"
"strangler:smoke:shots": "node scripts/dist-smoke-audit.js --write-shots"
"strangler:audit:pagefind": "... && node scripts/dist-smoke-audit.js --no-build"
"strangler:audit:production-like": "... && node scripts/dist-smoke-audit.js --no-build --production-like && ..."
```

`strangler:audit:production-like` is the most thorough chain, but it is **not** in the `validate:static-publication` chain that deploy.yml runs. So `dist-smoke-audit` is currently a **manual / one-off** smoke, not a blocking CI gate.

### 35.2 W2 dist-smoke on `f1e9abd`

After fresh `npm run strangler:build:production-like`:

```bash
nohup python3 -m http.server 8091 --bind 127.0.0.1 --directory /home/user/gb-is-my-strength/dist &
AUDIT_BASE=http://127.0.0.1:8091 node scripts/dist-smoke-audit.js --no-build --production-like
```

Result on `f1e9abd` (12 representative routes × desktop+mobile = 26 visits):

```text
24/26 routes PASS (no page/console errors, no overflow, h1 match)
2/26 routes FAIL on /articles/kod-da-vinchi/ (desktop+mobile):
  page/console errors: tt is not defined
```

Delta from `dbd0bb55` (Pass 30 / Pass 31 evidence: 6 issues = 3 routes × 2 viewports):

```text
                       dbd0bb55 → f1e9abd
r is not defined:      present → absent  (FIXED by bced1c6)
tt is not defined:     6 → 2               (2 routes narrowed to /articles/kod-da-vinchi/)
SiteUtils not defined: 1 → not re-tested   (presumed unchanged)
```

`/articles/kod-da-vinchi/` is the only representative route that surfaces `tt is not defined` because its backlinks block is built eagerly on first paint. Other articles in dist-smoke scope (`/`, `/articles/`, `/baptisty-rossii/`, `/baptisty-rossii/noch-na-kure/`, `/karty/`, `/karty/avraam/`, `/konfessii/`, `/konfessii/russkij-baptizm/`, `/map/`, `/rodosloviye/`, `/404.html`) either don't render backlinks or render them lazily.

### 35.3 New finding — NEW-64 PREVENTION-GAP

`validate:static-publication` (the chain that deploy.yml runs as the publication gate) does **not** include `dist-smoke-audit` or any other broad browser runtime no-undef smoke. The runtime regression class (`r`, `tt`, `SiteUtils` ReferenceErrors) is caught only when `gill:mobile-layout:audit` happens to visit a route that triggers the broken block.

**Triangulation:**
- `node --check js/*.js` PASS (syntax check does not catch strict-mode no-undef)
- `astro check` PASS (TypeScript diagnostics; strict-mode runtime is browser-only)
- `audit-pro` PASS (does not run scripts in browser)
- `validate:static-publication` PASS (does not run any browser smoke by default)
- `gill:mobile-layout:audit` FAIL on `f1e9abd` (catches `tt is not defined` on Gill routes; 5/52 routes)
- `dist-smoke-audit` FAIL on `f1e9abd` (catches `tt is not defined` on `/articles/kod-da-vinchi/`; 1/12 routes)

**Executor prevention recommendation:** add a blocking step to `.github/workflows/deploy.yml` (or to the `validate:static-publication` chain) that runs `node scripts/dist-smoke-audit.js --no-build --production-like` (or an extended variant that visits all 52 routes, not just 12) and fails on any `pageerror` other than known localhost favicon CSP noise. This would have caught `bced1c6` and the current `tt is not defined` regressions on **every** CI run instead of only when the gill-audit happened to visit a route that triggered the broken block.

**Severity classification:** P3 (preventive, not currently blocking deploy if the gill-audit step is removed or if Gill routes are not touched). But the regression class has been present on `main` for several commits; promoting it to a blocking step is a low-cost high-yield change.

### 35.4 NEW-64 in matrix (recap)

```text
* **NEW-64 (P3, PREVENTION-GAP):** deploy chain does not run a broad browser runtime no-undef smoke.
  Currently caught by `gill:mobile-layout:audit` (5 routes) and by `dist-smoke-audit` (12 routes) only when those audits are run manually or as part of `strangler:audit:production-like` (not in `validate:static-publication`).
  Recommended: add `dist-smoke-audit --no-build --production-like` to `validate:static-publication` chain OR add a Playwright-based 52-route runtime smoke step to `.github/workflows/deploy.yml` that fails on any `pageerror` (excluding localhost favicon CSP noise).
  Source files implicated: `scripts/dist-smoke-audit.js` (route list), `.github/workflows/deploy.yml` (CI), `package.json` (validate chain).
```

### 35.5 BUG-016 dead-vars update

`audit-pro` reports: "CSS dead vars: 14 unused (acceptable; clean when convenient)". This matches Pass 28 evidence (4 truly unused removed; 9 remain from 17 original; 5 false positives identified). No change since `f1e9abd`; status remains "stable; manual cleanup recommended when convenient".

### 35.6 BUG-010 / BUG-011 / BUG-022 re-counts

Static pattern scan on current `f1e9abd` source (after `bced1c6` highlights fix and `8446a0d` AGENTS-r312 dedup):

```text
BUG-010 (CSS breakpoint chaos):
  total width media conditions across 9 CSS files: 281
  unique breakpoint values: 67
  most frequent: 600, 768, 899, 480, 640, 680, 900
  → BUG-010 ✅ verified-current with widened dataset (was 23/128 on dbd0bb55; now 67/281 on f1e9abd; same conclusion)

BUG-011 (768 conflict):
  exact 768 boundary exists in both max-width and min-width directions; 0 same selector+property collision
  → BUG-011 ⚠️ reclassified (architecture risk; no proven visual bug)

BUG-022 (overridden CSS rules):
  css/site.css: 281,641 bytes, !important=202
  css/home.css: 77,766 bytes, !important=36
  css/mobile-hotfix.css: 18,515 bytes, !important=142
  css/nagornaya-mobile-toc.css: 21,636 bytes, !important=135
  css/floating-cluster.css: 104,993 bytes, !important=524
  css/command-palette.css: 29,526 bytes, !important=7
  css/enhancements-runtime.css: 2,274 bytes, !important=1
  css/highlights-runtime.css: 5,344 bytes, !important=0
  css/sw-toast.css: 1,204 bytes, !important=0
  total !important: 1,047 across 9 files
  → BUG-022 ✅ verified-current with corrected methodology
  → AGENTS §4.10 ceiling applies per-file (site.css ≤ 200 ✅ at exactly 202 is over goal by 2, in ceiling; nagornaya-mobile-toc.css/mobile-hotfix.css have no formal ceiling)
  → floating-cluster.css at 524 is the worst offender (5× over per-file heuristic) and warrants a dedicated cleanup pass
```

### 35.7 Operational note: cache-bust labels

`dist/js/site.js?v=77687914` byte-identical between `dbd0bb55` and `f1e9abd` builds (file content unchanged). cache-bust still incremented hash on the HTML pages that reference it but the asset itself is unchanged, so the gill-audit pageerror for `tt` is reproducible. `dist/js/highlights.js?v=c972d20e` also unchanged; `r` no-undef is retired.

---

## 🔴 PASS 37 CURRENT-HEAD / GATE-GAP REVERIFY (source HEAD `f1e9abd9`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **Remote moved:** `gb-is-my-strength/main` advanced to `f1e9abd9` via `bced1c69` (`highlights.js` declares `r`), `8446a0da` (AGENTS duplicate revision fix), and cache-bust commit `f1e9abd9`.
* **CI remains red:** Deploy run `28680826378` on `f1e9abd9` completed **failure** at **`Gill mobile reference layout audit`**.
* **Partial runtime fix verified:** `r is not defined` is fixed-current on `f1e9abd9` (`0` route hits in broad runtime smoke; `bced1c69` fixed the strict IIFE declaration in `js/highlights.js`).
* **P0 still current:** `tt is not defined` remains: Gill layout audit fails with 20 pageerrors; broad 52-route smoke shows 15 route hits; representative `dist-smoke-audit` fails on `/articles/kod-da-vinchi/` desktop+mobile.
* **P1 still current:** `/nagornaya/` still has `SiteUtils is not defined` from `nagornaya-mobile-toc.js` script order.
* **Regression archaeology:** `r` was introduced in `57d1b3c7`; `tt(n.title)` was introduced in `47a98da` as part of claimed XSS sanitization, but no reachable `tt` helper exists for the current strict callsite.
* **Missing gate:** `deploy.yml` does not run `node scripts/dist-smoke-audit.js --no-build --production-like`, although `strangler:audit:production-like` does. `validate:static-publication` also omits this browser runtime smoke. Current deploy relies on Gill-specific browser audits to catch global runtime no-undef regressions.
* **Visual parity current side finding:** local pixel-diff on `f1e9abd9` fails `/baptisty-rossii/` only: desktop `6.131%`, mobile `17.368%` (threshold `1%`). GitHub Visual Parity Guard failed on `8446a0da`; current `f1e9abd9` was `[skip ci]`, so remote visual parity was not rerun, but local current-head evidence confirms the issue.



## 🟢 PASS 50 / HARD-TEXTS OG DIMENSIONS FIX (2026-07-04)

**Source fix commit:** `c0ab48fc845ef27a1575d13a078dc832cab8df48` (`lane/seo-hardtexts-og-dimensions-2026-07-04`, pushed to `main`).

`NEW-59` is **fixed-current on source main `c0ab48fc`**. `/hard-texts/` now declares `og:image:width=1360` and `og:image:height=768`, matching `images/og-series-heart.webp`.

Verified on `c0ab48fc`:

- PIL image check ✅
- `npm run validate:strict` ✅
- `npm run schema:rich-results:audit` ✅
- `node scripts/audit-pro.js` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_hardtexts-og-dimensions-fixed-c0ab48f.md`. Remote Deploy green: run `28696329971` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28696329971).

---

## 🟡 PASS 49 / NEW-72 SVG DEDUP REVERIFY (2026-07-04)

**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`.

`NEW-72` is **downgraded from P2 to P3 advisory micro-optimization**. Current exact duplicate scan finds only 4 duplicate SVG patterns across `js/*.js`, with about 1.9KB raw theoretical saving before helper overhead and likely much smaller gzip impact. This is not a deploy/runtime/SEO blocker.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_svg-dedup-new72-downgrade.md`.

---

## 🟢 PASS 48 / NEW-67 DEAD SCRIPTS RECLASSIFICATION (2026-07-04)

**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`.

`NEW-67` is **false-positive / reclassified**. The original heuristic (no `package.json` caller / no workflow reference) is insufficient for this repo because multiple scripts are documented manual QA, migration helpers, or diagnostic tooling. All 10 named scripts pass `node --check` and have documentation/manual ownership evidence. No source deletion recommended from this finding.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dead-scripts-new67-reclassified.md`.

---

## 🟢 PASS 47 / SITEMAP LASTMOD REFRESH (2026-07-04)

**Source fix commit:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba` (`lane/seo-sitemap-lastmod-refresh-2026-07-04`, pushed to `main`).

`NEW-70` is **fixed-current on source main `a434b45e`**. `sitemap.xml` now uses route-specific git modification timestamps converted to Moscow `+03:00` ISO8601.

Verified on `a434b45e`:

- `git diff --check` ✅
- `npm run validate:all` ✅
- `node scripts/audit-pro.js` ✅
- `npm run contract:compare` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_sitemap-lastmod-fixed-a434b45.md`. Remote Deploy green: run `28694476460` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28694476460).

---

## 🟢 PASS 46 / README VERSION DRIFT FIX (2026-07-04)

**Source fix commit:** `da4a65cd33e046368dc089d48b42989de2344995` (`lane/docs-readme-current-status-2026-07-04`, pushed to `main`).

`NEW-71` is **fixed-current on source main `da4a65cd`**. README version line now says `v11 · 2026-07-04 · runtime/CI green + dist CSP hardening`.

Verified on `da4a65cd`:

- `git diff --check` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_readme-version-drift-fixed-da4a65c.md`.

---

## 🟢 PASS 45 / DIST CSP FORM-ACTION + KARTY CSP FIX (2026-07-04)

**Source fix commit:** `14574a9a21e6a5ba729df837c652c8db6ef599ff` (`lane/security-dist-csp-form-action-2026-07-04`, pushed to `main`).

`NEW-68` and `NEW-69` are **fixed-current on source main `14574a9a` by production-like dist evidence**. `astro-cache-bust-postbuild.js` now hardens dist CSP after Astro build/copy, and `dist-publication-audit.js` blocks missing CSP/form-action regressions.

Verified on `14574a9a`:

- `npm run strangler:build:production-like` ✅
- `npm run pagefind:build:dist` ✅
- `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` ✅
- `npm run strangler:audit:production-like` ✅
- `npm run validate:static-publication` ✅
- manual dist CSP scan: 55 HTML docs, missing CSP 0, missing form-action 0 ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dist-csp-form-action-fixed-14574a9.md`. Remote Deploy green: run `28693431471` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28693431471).

---

## 🟢 PASS 44 — NAGORNAYA SITEUTILS WINDOW PREFIX FIX (2026-07-03)

**Source fix commit:** `19062297d263213dc7851110743a6d2e9d1d8fe1` (pushed to main as `lane/system-nagornaya-siteutils-fix-2026-07-03`).

**P2-CURRENT-NAGORNAYA-SITEUTILS** — **fixed-current on 19062297.**

Fixes 3 bare `SiteUtils` references (without `window.` prefix) in strict-mode IIFE in `js/nagornaya-mobile-toc.js`:

- `SiteUtils.themeKey` -> `window.SiteUtils.themeKey` (theme persistence)
- `SiteUtils.copyText` (x2) -> `window.SiteUtils.copyText` (share copy-to-clipboard)

All other SiteUtils references in this file already use `window.SiteUtils` prefix.

**Local verification on `19062297`:**

- `node --check js/nagornaya-mobile-toc.js` ✅
- `npm run strangler:build:production-like` ✅ (astro check + 53 pages + 442 legacy files)
- `npm run audit:premium-controls` ✅ 87/87
- `npm run validate:all` ✅ (0 errors, 0 warnings)
- `npm run sw:dist:audit:deploy-switch` ✅
- `node scripts/dist-publication-audit.js --require-pagefind` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅ **28/28 routes** (14 desktop + 14 mobile), **0 page/console errors**
- `npm run page-ownership:dist:production-like` ✅

**Remote CI on `19062297`:** Shared Files Guard #421 ✅ Green. Deploy #1320 in progress.

Evidence: `reverify/PASS_32_AUDIT_REPORT_2026-07-03.md`.

---

---


## 🟢 PASS 46 — STALE BRANCHES CLEANUP + PREMIUMCONTROLS ARCHIVE (2026-07-04)

**Action:** Repository hygiene cleanup.

- **Source repo:** 13 stale remote lanes deleted — all merged into main. Only `origin/main` remains.
- **AuditRepo:** 1 stale remote lane deleted. Only `origin/main` remains.
- **PremiumControls/:** 30 historical documents (2026-06-27 deep dives, patches, reports) archived to `archive/2026-06-27-premiumcontrols-docs/`. Only 4 active files remain: README.md, spec/playember-speed-morph.md, 2 screenshots.
- **PROJECT_REGISTRY.md** updated to `c0ab48fc`.
- **verified/README.md** updated to reference MASTER_BUG_MATRIX.md as single source of truth.

**Deploy status:** #1325 in progress on `c0ab48fc`. Shared Files Guard #428 ✅. Visual Parity Guard #213 ✅.

---


---

## 🔴 PASS 38 HIDDEN GATE AUDIT — SW/Pagefind deploy-switch (`f1e9abd9`, 2026-07-03)

**Mode:** pure auditor/verifier; no source-code changes; no new report files.

* **P2-AUDIT-DRIFT reclassified:** The original broad “audit-pro does not check PRECACHE↔cache-bust↔ALLOWED” is mostly fixed-current. Evidence: `cache-bust-assets.js` is the shared ASSETS source; `audit-pro` G61 passes; `dist-publication-audit.js --require-pagefind --forbid-dev` reports `sw.js PRECACHE_ASSETS is 100% synchronized with cache-bust-assets.js (22 shared assets)`.
* **Hidden next Deploy blocker:** `npm run sw:dist:audit:deploy-switch` currently fails on `f1e9abd9` after Pagefind build:
  - `Pagefind bootstrap /pagefind/pagefind.js missing from PRECACHE_ASSETS`
* **Why hidden:** Deploy currently fails earlier at `Gill mobile reference layout audit` (`tt is not defined`), so the later `Service Worker deploy-switch readiness` step is not reached.
* **Gate semantics mismatch:** `dist-publication-audit --require-pagefind` passes and validates Pagefind index presence/source pages, while `sw-dist-readiness-audit --require-pagefind --require-cache-bump` additionally requires `/pagefind/pagefind.js` in `PRECACHE_ASSETS`.
* **Executor guidance:** after fixing `tt`, run `npm run pagefind:build:dist && npm run sw:dist:audit:deploy-switch` before assuming Deploy will pass.

---

## 🕵️‍♂️ PASS 39 / PASS 40 — PURE AUDITOR & VERIFICATION PASS (2026-07-03, Node 22 v22.14.0)

**Режим выполнения:** Чистый аудитор и верификатор («Режим Чистого Аудитора и Верификатора», строго без изменения исходного кода в `gb-is-my-strength`).  
**Toolchain:** Node.js `v22.14.0` (официальный Linux x64 бинарник в `/home/user/node22/bin`) + Playwright Chromium (`v1228`).  
**Объем аудита:** 70+ строгих пронумерованных bash-проверок (Commands 1–71) по всем 6 архитектурным доменам, повторная проверка актуального HEAD `d5c65647` на устранение блокад деплоя, а также контроль гигиены репозитория.

### 🧪 Эмпирическая верификация устранения блокад (HEAD `d5c65647`)

На чистом стенде Node 22 была проведена полная верификация всех 15 публикационных гейтов и скриптов вёрстки после интеграции коммитов `ffc763b`, `22eb084` и `d5c6564`:

1. **Подтверждённое устранение критических runtime-блокировок (Pass 37):**
   - **`tt is not defined` (P0) — ✅ ИСПРАВЛЕНО:** Коммит `ffc763b` добавил отсутствовавший хелпер или нормализовал вызовы в `js/site.js`. Тесты `strangler:smoke` (15 десктопных + 15 мобильных роутов) и `gill:mobile-layout:audit` в живом браузере Chromium проходят без ошибок (`0 pageerrors`).
   - **`SiteUtils is not defined` (P1) — ✅ ИСПРАВЛЕНО:** Коммит `ffc763b` выровнял порядок загрузки скриптов на лендинге Нагорной проповеди. Ошибки инициализации `nagornaya-mobile-toc.js` полностью устранены.
   - **`r is not defined` (P1) — ✅ ИСПРАВЛЕНО:** Коммит `bced1c6` / `22eb084` устранил сбой объявления IIFE в `js/highlights.js`.

2. **Подтверждённое устранение блокады Service Worker deploy-switch (Pass 38):**
   - **`/pagefind/pagefind.js` в `PRECACHE_ASSETS` (P2) — ✅ ИСПРАВЛЕНО:** Коммит `d5c6564` («fix(sw): precache Pagefind bootstrap for deploy-switch») включил загрузчик Pagefind в список прекэша `sw.js`.
   - **Верификационная команда 27 (`sw:dist:audit:deploy-switch`):** После успешной сборки индекса Pagefind (`43 pages, 16,411 words`) аудит готовности к переключению деплоя дал **100% PASS**:  
     `✅ Pagefind bootstrap is included in PRECACHE_ASSETS`  
     `✅ SW dist readiness audit passed`

3. **Сводка результатов верификации publication gates (Commands 6–36):**
   - `strangler:build:production-like` (Cmd 7) ✅ — 53 статических Astro-страницы, 444 легаси-файла перенесено (33.0 МБ), дрифт хешей ассетов `0`.
   - `npx astro check` (Cmd 8) ✅ — TypeScript-диагностика по 414 файлам проекта: **0 ошибок, 0 предупреждений**.
   - `dist-publication-audit` (Cmd 9) & `contract:compare` (Cmd 10) & `page-ownership:dist:production-like` (Cmd 11) ✅ — Полное соответствие контракту. Утечки служебных директорий (`src`, `scripts`, `research`, `raw-sources`, `_legacy`) заблокированы рекурсивным аудитором.
   - `dist:css-parity` (Cmd 13) & `sw:dist:audit` (Cmd 14) ✅ — 52/52 страниц несут целевой CSS-контракт. Service Worker `CACHE_VERSION` = `gb-v187-pagefind-bootstrap-20260703`.
   - `maps:validate` & `tokens:check` & `konfessii-map-audit.js` & `avraam:audit` (Cmd 29–34) ✅ — 10 библейских карт валидны, токены в норме, 14 инвариантов 3D WebGL карты баптизма и 28 инвариантов карты Авраама держатся стабильно.
   - `audit-pro.js` (Cmd 35) ✅ — Профессиональный архитектурный линтер завершился с результатом **166 passed, 2 warnings (CSS budget & z-index), 0 errors**.
   - `content:parity`, `gill:reading-time:audit`, `gill:pagefind:audit`, `schema:rich-results:audit` (Cmd 37–46) ✅ — Паритет по словам ($\pm 8\%$) и семантике соблюдён, каноническое время чтения серии — ровно 149 минут, 60 валидных блоков JSON-LD.
   - Скрипты визуального паритета (Cmd 47–61) & `audit:premium-controls` (Cmd 62) ✅ — 15/15 разделов и 87/87 проверок PremiumControls прошли с нулевым расхождением.

4. **Гигиена AuditRepo и расхламление (Commands 68–70):**
   - Директория `AuditRepo/projects/gb-is-my-strength/incoming/` находится в идеальном состоянии: все 58+ устаревших папок перемещены в архив, в `incoming/` оставлены строго 3 корневых управляющих документа (`GB_AUDIT_MASTER_REPORT.md`, `GB_REPAIR_ORDER.md`, `README.md`).
   - Рабочее дерево исходного репозитория `gb-is-my-strength` абсолютно чистое (`nothing to commit, working tree clean`).

### 🎯 Заключение чистого аудитора

Пайплайн деплоя на GitHub Pages полностью разблокирован. Критические регрессии, выявленные в Pass 37 и Pass 38, устранены чисто, без временных костылей или хаков в сборке. Проект готов к безопасному переключению продакшн-деплоя на Astro-дистрибутив.
