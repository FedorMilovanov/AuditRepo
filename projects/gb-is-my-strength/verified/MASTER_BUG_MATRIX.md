# MASTER BUG MATRIX — gb-is-my-strength

> Единый реестр всех багов проекта gospod-bog.ru.  
> Дата консолидации: **2026-07-05** (полная реструктуризация из 2174-строчного документа).  
> Source HEAD: `671cd163` (Merge PR #35 — gates hardening; PR#33/#34/#35 все смержены) | AuditRepo HEAD: см. git log  
> Предыдущая версия: `archive/2026-07-05-matrix-pre-restructure/`

---

## ✅ ЗАКРЫТО (52)

| ID | Описание | Коммит |
|---|---|---|
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P2-SEARCH-EAGER | search.js eager load → lazy loader | `546f7016` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-CI-001 | deploy.yml двойной `run:` ключ (2 witnesses) | `6e68d7ca` |
| PC-CURRENT-06 | Gill mobile item → partTOC flow | V3 |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy + scrollspy rewrite | `79eab398` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-59 | hard-texts OG dimensions (genuinely fixed) | `6cc68586` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-68/69 | CSP form-action regression | `14574a9a` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-README-ANCHOR-01 | README.md TOC stale anchor | `c82a8d4b` |
| NEW-CANONICAL-IZBRANNOE-01 | `/izbrannoe/` canonical relative→absolute | `563e85f3` |
| NEW-IMG-REGRESSION-01 | orphan-image cleanup broken refs | `fc5f94bd` |
| SEC-001-VERIFIER | innerHTML XSS — 3/6 полей без tt() | `3d242b1c` |
| NEW-SAFEURL-XSS-HARDENING | safeUrl() blocked only javascript: | `3d242b1c` |
| NEW-CACHE-BUST-ASTRO | Runtime CSS ?v= empty на 53 Astro-страницах | `6499d42e` |
| NEW-GITCONFIG-COMMITTED | .gitconfig agent identity в корне репо | `6499d42e` |
| BUG-CI-002 | `:light` gate aligned with `:full` — 3 missing checks added | `85a2fd65` |
| AUDIT-P1-CI-GATE-GAP | → merged into BUG-CI-002 (same root cause: indexnow.yml :light gate) | `85a2fd65` |
| BUG-CI-003 | indexnow.yml push retry: exit 1 + ::error:: после 3 fail | `85a2fd65` |
| NEW-ACTIONLINT-CI-GAP | actionlint v1.7.7 wired into shared-files-guard.yml | `85a2fd65` |
| NEW-OG-DIMENSIONS-HARDCODED | Seo.astro og:image:width/height → props с defaults 1200/630 | `85a2fd65` |
| BUG-CLEANUP-001 | 4 dead scripts (~23KB) удалены | `85a2fd65` |
| BUG-SEO-002 | robots.txt: `Allow: /llms.txt` во всех 14 заблокированных AI-ботах | `85a2fd65` |
| NEW-STALE-BRANCHES | 5 merged lane branches удалены с remote | `85a2fd65` |
| CONTENT-PARITY-LOSS-01 | Потеря контента на 2 прод-маршрутах («О серии» 81 слово, «Три истока» 88 слов) — восстановлено, на проде | `d2f34a66` PR#33 |
| AUDIT-P1-FC-IMP | !important ratchet-потолки для floating-cluster(524)/mobile-hotfix(142)/nagornaya-toc(135) в audit-pro | `8d1e8891` PR#35 |
| AUDIT-PRO-FC-IMPORTANT-GAP | = закрыт тем же multi-file ratchet | `8d1e8891` PR#35 |
| BUG-SW-BASELINE-DRIFT | baseline v182→v187 + fatal-равенство currentExpectedCacheVersion под --require-cache-bump | `8d1e8891` PR#35 |
| IMAGE-CROSSREF-GAP | imageCrossRef guard (data/*.json+sitemap ↔ диск); поймал и починил 3 битые ссылки в links-graph.json | `8d1e8891` PR#35 |
| DATA-SERIES-DRIFT | series.json ↔ SERIES_ORDER sync-чек (док. исключения nagornaya/pastor-series) | `8d1e8891` PR#35 |
| UI-GILL-SUBMENU-LABEL-SEMANTICS-09 | Owner decision: подпись = текущему заголовку. Скан: 19/56 дрейфов; 17 relabels + label↔heading энфорс в аудите | `8d1e8891` PR#35 |
| NOINDEX-PHANTOM | phantom yandex-запись удалена из NOINDEX_ALLOWLIST | `8d1e8891` PR#35 |
| AUDIT-PRO-REQUIRE-CRASH | require cache-bust-assets → fatal с диагностикой | `8d1e8891` PR#35 |
| DEAD-SCRIPTS-6 | 6 мёртвых скриптов удалены (0 ссылок, перепроверено) | `8d1e8891` PR#35 |
| CACHE-BUST-STALE-MAIN | самоизлечился первым content-пушем (предсказано в reverify) | `8fd5bb36` |

---

## 🟠 P1 — ОТКРЫТО (4: SCROLLSPY-06 и ORDER-07 merged PR#34, ждут только зелёного Pages-деплоя)

| ID | Описание | Witnesses |
|---|---|---|
| UI-GILL-SCROLLSPY-DEAD-06 | 🆕 Scrollspy pre-v16 суб-меню был МЁРТВ на всех Gill-страницах в проде (initGbs2Controls гейт не пускал v16-страницы; меню — замороженный SSR «1 / N»). Аудит маскировал green-обходом (35/35 ячеек). **Fix in PR #34** (`655e1652`): гейт открыт, обход → FATAL в CI. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_gill-scrollspy-dead-revived.md` | эмпирика headless, verified |
| UI-GILL-SUBMENU-ORDER-07 | 🆕 Меню chast-1/2/3 нарушало монотонность порядка документа (статьи выросли после bcf6389f; systematics: меню#3 ↔ документ#17/29) → active-index замерзал посреди статьи. **Fix in PR #34**: reorder по документу + `reorders` в reconciliation + рантайм-сортировка + fatal-ассерт монотонности | эмпирика headless, verified |
| BUG-PERF-001 | addEventListener без removeEventListener: 339 add / 25 remove по всем js/ (294/16 в 5 файлах) | 2 witnesses + пересчёт 07-05 |
| SEARCH-SCRIPTURE-BROKEN | 🔍 Scope «Писание» не работает: 0/20 MDX передают scripture:true; ArticleLayout без prop; 44/44 manifest без scripture. ⚠️ Verifier correction: 6 pages (не 3) имеют data-pagefind-meta. **Severity dispute: P1→P2 recommended** (feature gap, не runtime breakage) | Pass 92, verified |

## 🟡 P2 — ОТКРЫТО (5)

| ID | Описание | Witnesses |
|---|---|---|
| GATE-GAP-NATIVE-TEXT-PARITY | 🆕 Нет текстового parity-гейта legacy↔Astro для native-маршрутов — из-за этого CONTENT-PARITY-LOSS-01 прожил 10 дней. Рекомендация: word-coverage гейт | reverify 07-05 content-parity |
| UI-GILL-DOT-TRACK-OFFSET-08 | 🆕 Точки суб-меню не на линии трека (7.5px): track вынесен из ul при реставрации, аудит закрепил ошибку («valid track sibling»). **Fix in PR #34**: track внутрь ul (исторично), проверка перевёрнута, ассерт ≤4px | измерено headless, verified |
| AUDIT-P2-SW-PRECACHE-4 | SW PRECACHE содержит 4 lazy-loaded ассета (search.js, glossary.js, manifest.json, search-manifest.json) | АУДИТ 1.1 |
| BUG-ARCH-001 | = дубликат AUDIT-P2-SW-PRECACHE-4 (исходное описание: SW precache vs lazy loading) | АУДИТ 1.0 + verifier |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится | АУДИТ 1.4 |
| AUDIT-P2-MATRIX-DRIFT | route-migration-matrix (35) ≠ page-ownership (54) ≠ sitemap (43). Нет cross-validation. | АУДИТ 1.0 |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |

## 🟢 P3 — ОТКРЫТО (24, DEPLOY-YML-DEAD-WARN-STEP merged PR#34)

| ID | Описание |
|---|---|
| VALIDATE-SCOPE-GAP | validate.js проверяет только `articles/` (10 страниц из 40+). baptisty-rossii, nagornaya, karty, konfessii, biografii, hard-texts — **не валидируются** checks #1-#17 (canonical, section, byline, img alt, internal links, quote policy) | Meta-audit |
| BUG-SW-001 | sw.js `isFont()` — двойное отрицание, читаемость |
| AUDIT-P3-STYLE-DUP | enhancements/highlights inject CSS `<link>` без ID guard (дубликат при повторной загрузке) |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights.js delete без confirm() |
| BUG-CLEANUP-002 | `docs/refactor-2026/lanes/` — 31MB stale |
| BUG-CLEANUP-003 | `AUDIT_HISTORY.md` — 187KB stale |
| BUG-CLEANUP-004 | `docs/BUGS_FOUND_2026-06-25.md` — 78KB stale |
| NEW-CSS-BUDGET-01 | audit-pro CSS budget warning на каждом прогоне, не в backlog |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | SW precache defeats lazy loader strategy |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| SHADOW-AUDIT-NARROW | `legacy-shadow-wrapper-audit.js` проверяет только 7/52 (13%) production-dist маршрутов. Не охвачены: все страницы статей, baptisty-rossii, karty (8 из 10), biografii, about, pastor-series, konfessii, rodosloviye. |
| AUDIT-PRO-SITEMAP-ROOT-ONLY | `publicFiles()` проверяет покрытие sitemap по `htmlPages` (root HTML). Если Astro-страница существует только в dist/ (без root-копии), её URL не попадёт в проверку покрытия — sitemap может недосчитаться страниц, а аудит пройдёт. |
| AUDIT-PRO-VM-DEPRECATED | `extractSiteConfig()` и `inlineScriptSyntax()` используют `new vm.Script()` — deprecated в Node 22.12+. При полном удалении API в будущей версии Node аудит упадёт. Альтернатива: `new Function()` в sandbox. |
| SEO-AUDIT-ROOT-ONLY | `seo-audit.js` исключает `dist/` из `walk()`. Astro-only страницы без root-копии невидимы для SEO-аудита: проверки canonical, og:image, JSON-LD, Twitter cards, FAQ, robots. Та же архитектурная проблема что AUDIT-PRO-ROOT-ONLY. |
| VALIDATE-JS-VM-DEPRECATED | `extractSiteConfigFromHtml()` использует `new vm.Script()` — deprecated в Node 22.12+. Дублирует ту же проблему что и `audit-pro.js` (AUDIT-PRO-VM-DEPRECATED). При удалении API — validate.js упадёт. |
| VALIDATE-JS-ARTICLES-ONLY | `scripts/validate.js` (`validateArticle()`) проверяет только `articles/*`. 9 baptisty-rossii статей (dva-sezda-1884…yuzhnaya-shtunda) НЕ проходят 17 проверок: canonical, byline, og:image, breadcrumb, author-card и др. `EXTRA_PAGES` = 4 страницы (pastor-series, biografii, about, index) — жёстко захардкожено. |
| AUDIT-PRO-ROOT-ONLY | `audit-pro.js` проверяет ТОЛЬКО root HTML (`walk(ROOT)`, `dist/` в skipDirs). `/izbrannoe/` (Astro-only, без root-копии) невидим для 7 гвардов: canonical, sitemap, SEO, cache-bust, JSON-LD, links, a11y. При `astro build` в dist/ генерируются 54 страницы — аудит проверяет только 50 root HTML. |
| STRANGLER-HYGIENE | 50/53 Astro-маршрутов имеют дублирующийся legacy HTML в корне репо (работает корректно через page-ownership, но техдолг). |
| NEW-PREFETCH-UNCONDITIONAL | 5 prefetch hints на каждой странице включая саму себя |
| SEARCH-MANIFEST-QUALITY | search-manifest.json: 44/44 без поля slug (ключ отсутствует, не пустой); 44/44 нет scripture; 4/44 нет image. Verified. |
| DEPLOY-YML-DEAD-WARN-STEP | 🆕 deploy.yml:72-75 — warn-шаг с `if: conclusion == 'failure'` недостижим (job-level `if:` скипает job при failure) и несёт вводящий в заблуждение текст «Deploying anyway». Источник grep-ложноположительных reopen'ов P1-DEPLOY-FAIL. Удалить шаг. |

## 🔵 P3 — РЕФАКТОРИНГ (4)

| ID | Описание |
|---|---|
| R-001 | site.js монолит ~167KB (15 модулей) |
| R-002 | enhancements.js монолит ~48KB |
| R-003 | Нет source maps |
| R-004 | Нет type="module"/tree-shaking |

## 🟣 AUDITREPO (3)

| ID | Описание |
|---|---|
| AR-001 | validate_audit_repo.py hardening |
| AR-004 | verification protocol automation |
| AR-005 | reverify automation |

---

## Примечания

### Дубликаты (объединены):
- **BUG-ARCH-001** = **AUDIT-P2-SW-PRECACHE-4** (одна суть: SW precache содержит lazy assets). Оставлено оба ID для обратной совместимости с reverify-документами.
- **NEW-CACHE-BUST-ASTRO** закрыто (`6499d42e`), но **AUDIT-P3-SEARCH-LAZY-CONFIRMED** и **AUDIT-P2-SW-PRECACHE-4** описывают ту же тему SW/lazy — не дубликаты, разные root causes.

### Severity dispute: BUG-SW-BASELINE-DRIFT — RESOLVED → P2 (2026-07-05)
- **Pass 91 (agent):** P2 — "документационный drift, SW корректен, CI осознанно note()"
- **Pass 92 (agent):** P0 — "CI не фейлится при --require-cache-bump, deploy-safety gap"
- **Решение (владелец делегировал; reverify 07-05):** P2. Гейт энфорсит только «≠ pre-switch v171» (`sw-dist-readiness-audit.js:82-89`), `currentExpectedCacheVersion` — note(). Фикс: bump baseline v182→v187 + строгое равенство под `--require-cache-bump`.

### Dispute resolution: P1-DEPLOY-FAIL — остаётся ЗАКРЫТ (false reopen, 2026-07-05)
- Intake `arena-agent-verifier-hardening-2026-07-05` и `working/VERIFIER_SYNTHESIS` считали reopened по grep-хиту `conclusion == 'failure'` в deploy.yml.
- **Reachability-анализ на `68b2bf4c`:** job-level `if:` (deploy.yml:62-65) пускает только success/dispatch/push → при failure job скипается. Хит — в недостижимом warn-шаге (deploy.yml:72-75, dead code). См. DEPLOY-YML-DEAD-WARN-STEP (P3) и `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_content-parity-loss-restored.md` §4.

### False positives (отклонённые находки):
- `AUDIT-P2-NODE-REGEX` — fabricated evidence (функция mustScript не существует). Archive: `archive/false-positive/`
- `AUDIT-P3-REACT-UNDOCUMENTED` — React IS used. Archive: `archive/false-positive/`
- `BUG-ASTRO-CONFIG-001` (Pass 88) — downgraded to INFO.
- `BUG-SITEMAP-8-KARTY-MISSING` — 8 karty/ routes are temporary placeholders with `data-pagefind-ignore`, intentionally excluded from sitemap by `check-map-publication-status.js`.
- `BUG-FRONTMATTER-INCONSISTENCY-01` — Zod schema uses `.default(false)` / `.default(true)`. Omitting fields is valid, not inconsistency.

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица → `archive/2026-07-05-matrix-pre-restructure/`
- 41 PASS evidence section из старой матрицы → `archive/2026-07-05-pass-evidence/`

---

## Статистика

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 52 |
| P1 открыто | 4 |
| P2 открыто | 5 |
| P3 открыто | 24 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто** | **40** (11 закрыто PR#33/#35 + самоизлечение; PR#34-тройка закроется зелёным деплоем) |
| False positives отклонено | 3 |
| Passes processed | 93+ |
