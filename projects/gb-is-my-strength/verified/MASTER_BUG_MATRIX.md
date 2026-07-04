# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04
**HEAD исходного репозитория:** `6e667978` (prefetch + CI optimization)
**Статус:** ✅ **deploy-green** — все P0/P1/P2 блокеры закрыты

> ⚠️ Исторические PASS-секции (30–46) перемещены в `archive/2026-07-04-stale-matrix/`.

---

## ✅ ЗАКРЫТО (fixed-current)

| ID | Описание | Коммит |
|---|---|---|
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-68/69 | CSP form-action regression | `14574a9a` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-59 | hard-texts OG dimensions | `c0ab48fc` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| PC-CURRENT-06 | Gill mobile item -> partTOC flow | V3 |

---

## 🟠 P2 — MEDIUM (2 открытых)

- **BUG-011:** 23 уникальных px брейкпоинта, 768px коллизия (reclassified — без визуальной регрессии)

## 🔵 P3 — MEDIUM (2 открытых)

- **NEW-72:** SVG dedup micro-optimization (~1.9KB, downgraded from P2)
- **NEW-54/56/57/58:** Social/SEO metadata bundle (NEW-55/59 fixed)

## 🔵 P3 — REFACTORING (4)

- **R-001:** site.js монолит ~167KB (15 модулей)
- **R-002:** enhancements.js монолит ~48KB
- **R-003:** Нет source maps
- **R-004:** Нет type="module"/tree-shaking

## 🟣 AUDITREPO (3)

- **AR-001/004/005:** validate_audit_repo, verification protocol, reverify automation

---

## 📊 СВОДКА

| Уровень | Открыто | Закрыто |
|---|---|---|
| P0 (Critical) | 0 | 3 |
| P1 (High) | 0 | 6 |
| P2 (Medium) | 1* | 15 |
| P3 (Medium) | 2 | 5 |
| P3 (Refactor) | 4 | 0 |
| AuditRepo | 3 | 0 |
| **Итого** | **10** | **29** |

*P2: BUG-011 reclassified, SEARCH-EAGER partially fixed (Astro-native pages), REG-001 accepted risk (GitHub Pages limitation)*
