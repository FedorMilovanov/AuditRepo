# 🐛 SEARCH SYSTEM — CRITICAL BUG (2026-07-04)

**14 pages with 262+ Bible references invisible in "Писание" search scope.**

## Summary
The `data-pagefind-meta="scripture"` attribute is missing from almost ALL scripture-heavy pages.
Only **3 pages** have it. The "Писание" tab is effectively broken.

## Affected pages (need fix)
| Page | Bible refs | Priority |
|------|:----------:|:--------:|
| /rodosloviye/ | 262+ (Main reference!) | 🔴 P1 |
| /nagornaya/chast-4,5/ | 24-56 | 🟡 P2 |
| /nagornaya/istochniki,nakhodki/ | 10-12 | 🟡 P2 |
| /hard-texts/ | 26 (Иер 17, Рим 7) | 🟡 P2 |
| /articles/dzhon-gill-*/ | 12-17 | 🟡 P2 |
| /articles/kod-da-vinchi/ | 11 | 🟡 P2 |

## Root cause
1. `ArticleLayout.astro` and `SeriesArticleLayout.astro` have no `scripture` prop mechanism
2. Nagornaya chast-4/5 headers lack scripture meta (chast-1/2/3 have it — inconsistency)
3. No gate verifies scripture-heavy pages have meta tags

## Fix plan
1. Add `data-pagefind-meta="scripture"` to all ArticleBody components
2. Add `scripture` prop to BaseLayout → ArticleLayout
3. Regenerate search-manifest with scripture field

See MASTER_BUG_MATRIX.md for full details. Verify existing search gates: `gill:pagefind:audit`, `sw:dist:audit:pagefind`.

---

# 🟢 CURRENT TRUTH — 2026-07-05 (READ FIRST)

**Source HEAD:** `6e68d7ca` (fix(ci): remove duplicate run: key — re-enable submenu audit)
**AuditRepo HEAD:** pending (Pass 64 — deep CI + deletions audit)
**Branches:** `origin/main` only (zero stale branches in both repos)
**CI:** ✅ **All P0 blockers closed** — BUG-CI-001 fixed, deletions audit passed

## ✅ P0 fixed — BUG-CI-001

| Bug | Description | Fix | Commit |
|-----|-------------|-----|--------|
| BUG-CI-001 | deploy.yml duplicate `run:` key — submenu audit disabled | Deleted line 156 | `6e68d7ca` ✅ |

## ✅ Deletions Audit — no regressions

Verified 11 major deletions (GillRailControls, site-layered.css, premium-controls, legacy utils, _headers, etc.). All were dead code or duplicates. Zero broken asset references, 63/63 JSON-LD valid, 22/22 cache-bust versions correct.

## Open items summary

| Уровень | Open | Closed | Всего |
|---------|------|--------|-------|
| P0 | 0 | 4 | 4 |
| P1 | 3 | 8 | 11 |
| P2 | 6 | 15 | 21 |
| P3 | 16 | 5 | 21 |
| Refactor | 4 | 0 | 4 |
| AuditRepo | 3 | 0 | 3 |
| **Total** | **28** | **32** | **60** |

## Ключевые документы

- `verified/MASTER_BUG_MATRIX.md` — consolidated canonical truth (Pass 64 updated)
- `incoming/arena-agent-pass63/REPORT.md` — Pass 64 deep CI audit report

## P1 items (non-blocking but important)

- BUG-CI-002: `validate:static-publication:light` пропускает 3 gates (MDX strict, baptisty series, SW dist)
- BUG-CI-003: indexnow.yml push retry — silent failure после 3 неудачных попыток

## P2 items (advisory)

- BUG-ARCH-001: SW PRECACHE_ASSETS содержит lazy-loaded файлы (search-manifest.json, search.js)
- BUG-SEO-001: IndexNow submit до Pages CDN propagation
- BUG-011: 23 px breakpoints (reclassified, no visual regression)

---

**Historical addendums archived:** `archive/2026-07-04-next-agent-prompt-history/`
