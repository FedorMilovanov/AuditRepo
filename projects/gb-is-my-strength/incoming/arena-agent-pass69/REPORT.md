# Deep Audit Report — Pass 69 (Independent Verification)

**Date:** 2026-07-04  
**Source HEAD:** `629ed89a` (fix(images): remove orphaned image files)  
**Mode:** Pure auditor/verifier — no source changes

---

## New Findings

### BUG-CLEANUP-004: search-manifest stale image references (P2)

**Status:** verified-current  
**Evidence:** After `629ed89a` deleted 7 orphan images, `dist/data/search-manifest.json` still references 3 deleted files:

| Item | URL | Deleted image |
|------|-----|---------------|
| #2 | /biografii/#dzhon-gill-series | /images/gill-authentic-study-cover.webp |
| #7 | /articles/dzhon-gill-chast-1-chelovek/ | /images/gill-authentic-study-cover.webp |
| #13 | /articles/dzhon-gill-spravochnik/ | /images/og-gill-five-volumes-shelf.webp |

**Fix needed:** Regenerate search-manifest after orphan image deletion.

---

### BUG-CLEANUP-005: 3 more orphan images still in /images/ (P3)

**Evidence (from `node scripts/audit-pro.js`):**
- `images/gill-southwark-sermon.webp` — 477KB, 0 references in dist HTML
- `images/og-dzhon-gill-spravochnik-600w.webp` — 50KB, 0 references
- `images/og-dzhon-gill-chast-1-chelovek-600w.webp` — 19KB, 0 references

Total wasted: ~546KB. These are 600w variants and a sermon image that no page references.

---

### CSS-QUALITY-003: 45 duplicate selectors in floating-cluster.css (P3)

**Evidence:** Static analysis reveals 45 selector blocks appearing 2-6 times each.

Worst offenders:
- `[data-gill-v16] .mobile-bottom-bar` — 6× with different `!important` overrides
- `[data-gill-v16] .mobile-btoc-progress-fill` — 3×
- `[data-gill-v16] .mobile-icon-row` — 3×
- `[data-gill-v16] .gb-series-mark--label.toc-item__num` — 3×
- `@media (hover: hover) and (pointer: fine)` — 19× (all unique rules inside, this is normal)

The duplicate selectors are mostly v16 base rules + "hotfix" blocks with `!important` overriding them. This is a code smell but not blocking.

---

### CSS-QUALITY-004: floating-cluster.css !important flood (P3)

**Count:** 524 `!important` declarations in `css/floating-cluster.css`.

For comparison:
- site.css: 202 (near ceiling of 202 — healthy)
- home.css: 36
- mobile-hotfix.css: 142
- nagornaya-mobile-toc.css: 135

The pre-v16 restoration block (Gill desktop rail) contributes 0 `!important`. The 524 count comes from accumulated mobile hotfix layers over v16 base CSS. Known pattern from earlier passes.

---

### SEO-006: 4 pages without JSON-LD (P3)

| Page | Note |
|------|------|
| `konfessii/russkij-baptizm/_app/index.html` | 3D SPA shell — expected |
| `dist/nagornaya/index.html` | Legacy copy? |
| `dist/nagornaya/istochniki/index.html` | Legacy copy? |
| `dist/nagornaya/nakhodki/index.html` | Legacy copy? |

The 3 nagornaya landing/index pages are legacy root copies. Their `PageHead` components (NagornayaIndexPageHead.astro, etc.) exist but may need JSON-LD injection.

---

### SEC-002: Token warning in docs/SANDBOX-ENV (INFO)

`docs/SANDBOX-ENV-2026-06-21.md` in the source repo (72KB — OLD version before cleanup) contains the text "github_pat" in the context of an example token URL. This is the stale pre-cleanup version. **The AuditRepo version was already cleaned to 211 lines.** The source repo still has the old 940-line/72KB version which should be replaced or deleted.

---

## Previously Verified (still current)

| Item | Status |
|------|--------|
| Gill desktop rail: 105/105 submenu audit | ✅ Fixed in `79eab398` |
| Mobile smoke/layout | ✅ PASS |
| PremiumControls 87/87 | ✅ PASS |
| Gill v16 markers on all 5 routes | ✅ v16, roman, rail, toc, track all present |
| DOCTYPE + lang=ru | ✅ 53/53 pages |
| Viewport meta | ✅ 53/53 pages |
| OG image dimensions | ✅ 0 missing |
| Canonical links | ✅ 53/53 pages |
| Icons/manifest | ✅ All present and valid |
| 404.html | ✅ Has title, CSP, canonical, SW |
| Sitemap | ✅ 43 URLs, all exist in dist |
| RSS feed | ✅ 27 items |
| JSON-LD schema.org context | ✅ All use proper schema.org |

