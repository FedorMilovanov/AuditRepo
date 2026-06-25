# Round 1: System-level bugs — 2026-06-25

## Agent
- `arena-agent-round3` / Arena Agent Mode
- Audit scope: full project source review (AGENTS.md, workflows, scripts, JS, CSS, Astro)

## Confirmed P0 bugs

### P0-1: Gill Rail SAVE button — NOP (no-op)
- **File:** `src/components/article-pilots/gill-context/GillContextPageChrome.astro` + `js/floating-cluster-controller.js`
- **Bug:** Button uses `data-action="save"` → controller handles only `share` and `print`
- **Status:** confirmed via code review
- **Evidence:** `initActionHandlers()` in fc-controller handles `share`/`print`, NOT `save`

### P0-2: `css/floating-cluster.css` — EMPTY FILE
- **File:** `css/floating-cluster.css`
- **Bug:** File contains only comment header. Claim: "Авто-генерация" — LIE
- **Status:** confirmed — 0 lines of CSS, all v16 styles in `css/site.css` and inline

### P0-3: `robots.txt` blocks SEO crawlers
- **File:** `robots.txt`
- **Bug:** `Disallow: /*?*` for `User-agent: *` — blocks AhrefsBot, SemrushBot, MJ12bot (disallowed with `Disallow: /`)
- **Impact:** Marketing monitoring and SEO audit impossible

## Confirmed P1 bugs

| ID | Bug | File |
|----|-----|------|
| P1-1 | Old controls (`#themeToggle`, `#bottomBar`) don't check `.has-premium-controls` | js/site.js |
| P1-2 | `sitemap.xml` incomplete (~43 URLs, missing 13 karty + 10 baptisty-rossii + map/rodosloviye) | sitemap.xml |
| P1-3 | `search-manifest.json` incomplete (~44 items, missing 10 baptisty + 13 karty + 5 nagornaya) | data/search-manifest.json |
| P1-4 | `ASTRO_PAGE_HEAD_MAP` in update-meta.js only 10 articles (missing baptisty, karty, nagornaya) | scripts/update-meta.js |
| P1-5 | `page-ownership.json` (2026-06-20) vs `route-migration-matrix.json` (2026-06-23) — route conflict | migration/*.json |
| P1-6 | `copy-legacy-to-dist.js` skips copy if dest exists, no timestamp compare | scripts/copy-legacy-to-dist.js |
| P1-7 | `js/search.js` hardcoded fallback readTime values (89, 41, 30, 50) unvalidated | js/search.js |
| P1-8 | Gill rail `[data-fc-root]` element initialized twice (main loop + initGillRail) | js/floating-cluster-controller.js |

## P2 bugs

| ID | Bug |
|----|-----|
| P2-1 | `visual-audit.js` covers ~26 of 52+ routes (~50%) |
| P2-2 | CSS duplication: `site.css` + `site-layered.css` both precached |
| P2-3 | `floating-cluster.css` false comment claim |
| P2-4 | `sw.js` CACHE_VERSION manual update, not synced with cache-bust |
| P2-5 | `notify-on-failure.yml` Python3 artifact parser broken |
| P2-6 | feed.xml UTC +0000 instead of Moscow +0300 |
| P2-7 | AGENTS.md 700+ lines, 41 version history |
| P2-8 | `cache-bust.js` ASSETS hardcoded duplicate in `audit-pro.js` |

## Corrections (false positives from Round 1)

- **P0-4 CORRECTED:** `feed.xml` does NOT contain `raw.githubusercontent.com` dead link — grep=0
- **P0-5 CORRECTED:** `cache-bust.js` regex works correctly — `/\./g` has global flag, all paths tested

## Notes
- Baptisty-rossii content confirmed as known placeholder (user instruction: not a bug)
- Full detailed reports available in `/home/user/reports/` (source workspace)
