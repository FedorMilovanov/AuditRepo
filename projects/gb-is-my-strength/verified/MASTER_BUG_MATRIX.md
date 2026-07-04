# MASTER BUG MATRIX — gb-is-my-strength

> Единый реестр всех багов проекта gospod-bog.ru.  
> Дата консолидации: **2026-07-05** (полная реструктуризация из 2174-строчного документа).  
> Source HEAD: `dea91376` | AuditRepo HEAD: `77c23c4`  
> Предыдущая версия: `archive/2026-07-05-matrix-pre-restructure/`

---

## ✅ ЗАКРЫТО (33 бага)

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

---

## 🟠 P1 — ОТКРЫТО (5)

| ID | Описание | Witnesses |
|---|---|---|
| AUDIT-P1-FC-IMP | `floating-cluster.css`: 490 `!important`, audit-pro проверяет только site.css. Нет ceiling/ratchet. | АУДИТ 1.0 + verifier |
| BUG-CI-002 | `validate:static-publication:light` пропускает 3 чека: `article-mdx:strict`, `baptisty-series`, `sw:dist:audit` | 5 witnesses |
| AUDIT-P1-CI-GATE-GAP | То же что BUG-CI-002: `indexnow.yml:71` использует `:light` → SW-регрессии попадают в IndexNow | АУДИТ 1.3 |
| BUG-CI-003 | indexnow.yml push retry: после 3 fail → exit 0 (silent failure) | 2 witnesses |
| BUG-PERF-001 | addEventListener без removeEventListener: 294 add / 16 remove в 5 JS-файлах | 2 witnesses |

## 🟡 P2 — ОТКРЫТО (8)

| ID | Описание | Witnesses |
|---|---|---|
| BUG-SW-BASELINE-DRIFT | SW baseline `v182` vs actual `v187` (5 версий). CI: note(), не bad(). ⚠️ Severity disputed: P0 vs P2. | АУДИТ 1.0, Pass 91 reclassified |
| AUDIT-P2-SW-PRECACHE-4 | SW PRECACHE содержит 4 lazy-loaded ассета (search.js, glossary.js, manifest.json, search-manifest.json) | АУДИТ 1.1 |
| BUG-ARCH-001 | = дубликат AUDIT-P2-SW-PRECACHE-4 (исходное описание: SW precache vs lazy loading) | АУДИТ 1.0 + verifier |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится | АУДИТ 1.4 |
| AUDIT-P2-MATRIX-DRIFT | route-migration-matrix (35) ≠ page-ownership (54) ≠ sitemap (43). Нет cross-validation. | АУДИТ 1.0 |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |
| NEW-OG-DIMENSIONS-HARDCODED | Seo.astro hardcodes og:image:width/height 1200×630 — не props | Pass 91 |

## 🟢 P3 — ОТКРЫТО (17)

| ID | Описание |
|---|---|
| BUG-SW-001 | sw.js `isFont()` — двойное отрицание, читаемость |
| AUDIT-P3-STYLE-DUP | enhancements/highlights inject CSS `<link>` без ID guard (дубликат при повторной загрузке) |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights.js delete без confirm() |
| BUG-SEO-002 | robots.txt `Allow: /llms.txt` только для ImagesiftBot |
| BUG-CLEANUP-001 | 4 dead scripts (~27KB), 0 callers |
| BUG-CLEANUP-002 | `docs/refactor-2026/lanes/` — 31MB stale |
| BUG-CLEANUP-003 | `AUDIT_HISTORY.md` — 187KB stale |
| BUG-CLEANUP-004 | `docs/BUGS_FOUND_2026-06-25.md` — 78KB stale |
| NEW-CSS-BUDGET-01 | audit-pro CSS budget warning на каждом прогоне, не в backlog |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| NEW-ACTIONLINT-CI-GAP | actionlint зарегистрирован, но не вызывается в CI (high-leverage fix) |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | SW precache defeats lazy loader strategy |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| NEW-STALE-BRANCHES | 5 merged lane branches на remote |
| NEW-PREFETCH-UNCONDITIONAL | 5 prefetch hints на каждой странице включая саму себя |

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
- **BUG-CI-002** ≈ **AUDIT-P1-CI-GATE-GAP** (один root cause: `:light` gate). Два ID т.к. описывают разные аспекты (пропущенные чеки vs IndexNow последствия).
- **NEW-CACHE-BUST-ASTRO** закрыто (`6499d42e`), но **AUDIT-P3-SEARCH-LAZY-CONFIRMED** и **AUDIT-P2-SW-PRECACHE-4** описывают ту же тему SW/lazy — не дубликаты, разные root causes.

### Severity dispute: BUG-SW-BASELINE-DRIFT
- **Pass 91 (agent):** P2 — "документационный drift, SW корректен, CI осознанно note()"
- **Pass 92 (agent):** P0 — "CI не фейлится при --require-cache-bump, deploy-safety gap"
- **Решение:** требуется owner decision. Помечен P2 с ⚠️.

### False positives (отклонённые находки):
- `AUDIT-P2-NODE-REGEX` — fabricated evidence (функция mustScript не существует). Archive: `archive/false-positive/`
- `AUDIT-P3-REACT-UNDOCUMENTED` — React IS used. Archive: `archive/false-positive/`
- `BUG-ASTRO-CONFIG-001` (Pass 88) — downgraded to INFO.

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица → `archive/2026-07-05-matrix-pre-restructure/`
- 41 PASS evidence section из старой матрицы → `archive/2026-07-05-pass-evidence/`

---

## Статистика

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 33 |
| P1 открыто | 5 |
| P2 открыто | 8 |
| P3 открыто | 17 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто** | **37** |
| False positives отклонено | 3 |
| Passes processed | 93+ |
