# Agent Work Report — Pass 8 (Dead Assets + Performance + Structured Data)

## Meta
- Agent: arena-agent-reverify-1
- SHA: 03e01a0008de34d654175ea600cdf9f22b2351b4
- Build: Node 22 Astro build + copy-legacy-to-dist (production-like)

---

## 1. New Findings

### N-REV1-14: P1 — site-layered.css is 283KB dead file (0 pages load it)

- Severity: P1 (performance — 283KB wasted in dist + SW precache)
- Evidence:
  ```
  dist/css/site-layered.css: 282,846 bytes
  dist/css/site.css: 282,788 bytes (nearly identical)
  Selector overlap: 1460/1467 selectors identical
  Pages that load site-layered.css: 0 (zero)
  grep -rl 'site-layered' src/ --include='*.astro' → 0 (never imported)
  grep -rl 'site-layered' articles/ --include='*.html' → 0 (never referenced)
  ```
- Root cause: `site-layered.css` was created during @layer refactor pilot (commit acb93420) as a reorganized copy of `site.css`. The intent was to replace `site.css` with the layered version, but the swap never completed. `copy-legacy-to-dist.js` copies it to dist. `sw.js` precaches it. But no page ever loads it.
- Impact: 283KB dead CSS in dist. SW precaches it (wasted bandwidth on every fresh install). 1460 duplicate selectors exist but are never parsed by any browser.
- Fix: Remove from `sw.js` PRECACHE_ASSETS + optionally delete the file itself if @layer migration is abandoned.

### N-REV1-15: P2 — site-modules.js is 9KB dead file (0 pages load it)

- Severity: P2
- Evidence:
  ```
  dist/js/site-modules.js: 8,707 bytes
  Pages that load it: 0
  Astro imports: 0
  HTML script tags: 0
  ```
- Same pattern as site-layered.css — extracted during refactor, never wired.
- Impact: 9KB dead weight in dist + SW precache

### N-REV1-16: P2 — series-cards.js is 3KB dead file (0 pages load it)

- Severity: P2
- Evidence: Same pattern. 0 Astro imports, 0 HTML refs. SW precaches it.
- Impact: 3KB dead weight

### N-REV1-17: P2 — site.css + site-layered.css have 99.5% selector overlap

- Severity: P2 (architectural debt)
- Evidence: 1460/1467 selectors identical between the two files
- Root cause: @layer refactor created a copy, then original kept evolving alongside. Both are now ~283KB.
- Impact: If someone accidentally loads both = 566KB of CSS with near-total duplication
- Note: Currently no page loads both, so no user impact. But code confusion risk is high.

---

## 2. Confirmations

### JSON-LD structured data: ✅ All clean
| Page | Types | Article | Breadcrumb | Speakable |
|------|-------|---------|------------|-----------|
| Kontekst | Organization, WebSite, Article, BreadcrumbList | ✅ | ✅ | ✅ |
| Hermenevtika | Organization, WebSite, ScholarlyArticle, BreadcrumbList, FAQPage, ImageObject | ✅ | ✅ | ✅ |
| KodDaVinchi | Organization, WebSite, Article, BreadcrumbList, FAQPage, 2×ImageObject | ✅ | ✅ | ✅ |
| Antisovetov | Organization, WebSite, Article, BreadcrumbList, FAQPage, 3×ImageObject | ✅ | ✅ | ✅ |

### Dist content integrity: ✅
- CSS/JS hashes: root = dist (MATCH)
- All images referenced in dist exist
- No broken src="" in key pages
- H1 count: exactly 1 per page
- No empty sections
- No debug/test markers
- No hardcoded localhost URLs

### Performance summary
| Asset | Size | Status |
|-------|------|--------|
| site.css | 283KB | Active (loaded by 38 pages) |
| site-layered.css | 283KB | **DEAD** (0 pages) |
| floating-cluster.css | 69KB | Active (4 pages) |
| home.css | 76KB | Active (6 pages) |
| site.js | 166KB | Active |
| site-modules.js | 9KB | **DEAD** |
| series-cards.js | 3KB | **DEAD** |
| Total dist | 51MB | 634 files |
| Dead weight | ~295KB | site-layered + site-modules + series-cards |

---

## 8. Notes for Verifier

1. **N-REV1-14 is the biggest performance finding** — 283KB dead CSS file precached by SW. No user sees it, but every fresh SW install downloads it.
2. The 3 dead files (site-layered + site-modules + series-cards) total ~295KB of unnecessary dist/SW weight.
3. JSON-LD is clean across all key pages — no structured data bugs found.
4. Content integrity (images, H1, anchors) is clean on all tested pages.
5. P2-2 from ledger is confirmed: site.css and site-layered.css have 99.5% selector overlap. The @layer migration pilot was started but never completed.
