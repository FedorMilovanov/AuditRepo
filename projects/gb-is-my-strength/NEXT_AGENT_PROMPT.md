# 🐛 SEARCH SYSTEM — CRITICAL BUG, still open (2026-07-04, Pass 69/70)

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

# 🟢 CURRENT TRUTH — 2026-07-05 Pass 71 + Pass 65 merged (READ FIRST)

**Source HEAD:** `8c318010` (merge: seo-fix-og-images lane — final commit of a 4-fix session: BUG-CI-001 CI-gate fix, orphan-image regression fix, README anchor fix, /izbrannoe/ canonical fix, NEW-59 real image-resize fix)
**AuditRepo HEAD:** Pass 71 (deep JS code review: floating-cluster-controller.js) merged with Pass 65 (verifier sync — 2nd witness on BUG-CI-001, NEW-59 reopened-then-genuinely-fixed, 6 new findings, 1 new regression found+fixed same session, unresolved merge-conflict markers found and cleaned from AuditRepo's own history)
**Branches:** `origin/main` only (zero stale branches in both repos)
**CI:** ✅ **All P0 blockers closed** — BUG-CI-001 fixed and independently re-confirmed by 2 agents (Pass 63 + Pass 65) with `actionlint` (0 issues across all 8 workflow files on current HEAD)

## ✅ P0 fixed — BUG-CI-001 (L2, 2 independent witnesses)

| Bug | Description | Fix | Commit |
|-----|-------------|-----|--------|
| BUG-CI-001 | deploy.yml duplicate `run:` key — submenu audit disabled | Deleted line 156 | `6e68d7ca` ✅ |

Confirmed post-fix with `actionlint` v1.7.7 release binary → 0 issues across all 8 workflow files.

## ✅ NEW-59 — reopened, then genuinely fixed (ledger-integrity lesson, Pass 65)

`NEW-59` (hard-texts og:image dimensions) was closed as fixed-current on `c0ab48fc`, but that commit only edited meta tag numbers to match the wrong 1360×768 asset instead of resizing it. **Reopened, then genuinely fixed**: `images/og-series-heart.webp` center-cropped to 1200×630 (commit `6cc68586`). Verified: `SEO audit passed: 0 errors, 0 warnings.`

**Rule going forward: never mark a bug fixed-current without re-running the original detector and pasting its output.**

## 🚨 Regression found AND fixed same session: orphan-image cleanup left broken refs (Pass 65)

Commit `629ed89a` ("remove orphaned image files") deleted 7 files but didn't update `data/search-manifest.json`/`sitemap.xml` (2 broken refs → 404 in prod) and missed 3 more orphans. **`node scripts/audit-pro.js` was failing with 3 errors on `main`** for a window during this session. Fixed in `fc5f94bd` — re-verified `✅ AUDIT PASSED` (165 passed, 0 errors). Lesson: when deleting referenced files, grep ALL consumers (HTML/astro AND data/*.json AND sitemap.xml).

## ✅ Deletions Audit — no regressions (Pass 64), one follow-through gap found+fixed (Pass 65)

Pass 64's deletions audit verified 11 major deletions with no regressions. Pass 65 found a *later*, separate deletion commit (`629ed89a`) introduced a regression — see above, now resolved.

## ⚠️ AuditRepo process note (Pass 65)

Commit `646f38e` ("Pass 70 — deep SEARCH system investigation") was pushed to AuditRepo `main` with **unresolved git merge-conflict markers still in the file** (`MASTER_BUG_MATRIX.md`). Cleaned up during Pass 65's rebase — no content lost. **Always grep for conflict markers (or run `git diff --check`) before pushing a merge/rebase result.**

## Open items summary (Pass 71 + Pass 65 merged — see MASTER_BUG_MATRIX.md for full detail)

| Уровень | Open | Closed | Всего |
|---------|------|--------|-------|
| P0 | 0 | 4 | 4 |
| P1 | 11 | 8 | 19 |
| P2 | 19 | 16 | 35 |
| P3 (Medium) | 4 | 6 | 10 |
| P3 (Refactor) | 4 | 0 | 4 |
| P3 (Cleanup) | 21 | 0 | 21 |
| P3 (SEO tooling, Pass 65) | 3 | 0 | 3 |
| AuditRepo | 3 | 0 | 3 |
| **Total** | **65** | **34** | **99** |

Most P1/P2 growth since the last snapshot is **CSS/JS technical debt found by Pass 68-71's deep code review**: floating-cluster.css (106KB, 524 `!important`, 4 specificity layers), site.css (275KB, minified, 7+ mixed concerns), floating-cluster-controller.js (61KB, 2 memory leaks, 77 empty catches) — all require dedicated refactor lanes, not quick fixes. See MASTER_BUG_MATRIX.md "PASS 68/69/70/71" sections.

## Ключевые документы

- `verified/MASTER_BUG_MATRIX.md` — consolidated canonical truth (Pass 65 section has full evidence for this session's fixes)
- `incoming/arena-agent-pass63/REPORT.md` — Pass 64 deep CI audit report
- `incoming/arena-agent-deep-audit-2/2026-07-04/REPORT.md` — Pass 65 independent audit + verifier notes + source-fix log
- `incoming/arena-agent-pass69/REPORT.md` — search system deep investigation (scripture meta bug above)
- `incoming/arena-agent-pass71/REPORT.md` — floating-cluster-controller.js deep JS review

## P1 items (non-blocking but important)

- Search scripture meta bug (see top of this file) — biggest single-fix ROI (rodosloviye alone has 262 refs invisible)
- BUG-CI-002: `validate:static-publication:light` пропускает 3 gates (MDX strict, baptisty series, SW dist)
- BUG-CI-003: indexnow.yml push retry — silent failure после 3 неудачных попыток
- BUG-PERF-001, BUG-CSS-001/006/007/008/013/014, BUG-JS-001/002: CSS/JS technical debt (Pass 65, 68-71)

## P2 items (advisory)

- BUG-ARCH-001: SW PRECACHE_ASSETS содержит lazy-loaded файлы (search-manifest.json, search.js)
- BUG-SEO-001: IndexNow submit до Pages CDN propagation
- BUG-011: 23 px breakpoints (reclassified, no visual regression)
- **NEW-CANONICAL-IZBRANNOE-01-GAP** *(Pass 65, underlying bug already fixed)*: canonical-integrity gates structurally don't check absolute-URL-ness on noindex routes
- BUG-QUALITY-001/002/003, BUG-A11Y-001, BUG-PERF-002, BUG-CSS-002/003/009/010/015/016/017 (Pass 64-70)

## P3 items (Pass 65, high confidence)

- **NEW-CSS-BUDGET-01, NEW-SAFEURL-XSS-HARDENING, NEW-OG-SIZE-PARAM**
- **NEW-ACTIONLINT-CI-GAP** *(high leverage despite formal P3)*: `actionlint` registered `KEEP` but not wired into any workflow — it's the exact tool that caught `BUG-CI-001`. Recommend fast-track.

## Source fixes shipped this session (all merged to main, all re-verified green)

| Commit | Fix |
|---|---|
| `c82a8d4b` | README.md stale TOC anchor |
| `563e85f3` | `/izbrannoe/` canonical/og:url absolute + bonus SITE_CONFIG.page.id fix |
| `fc5f94bd` | Repaired orphan-image cleanup regression (search-manifest.json/sitemap.xml broken refs + 3 more orphans) |
| `6cc68586` | NEW-59 real fix — og-series-heart.webp resized to 1200×630 |

---

**Historical addendums archived:** `archive/2026-07-04-next-agent-prompt-history/`
