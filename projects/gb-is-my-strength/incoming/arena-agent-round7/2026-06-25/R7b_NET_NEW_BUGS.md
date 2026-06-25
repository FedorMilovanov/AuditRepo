# Round 7 — Net-New Bugs & Scope Refinements

## NEW BUGS FOUND

### P3-NEW: `back-to-top.js` module NEVER loaded — button broken on 5 articles

**Severity: P2** (user experience impact on long articles, 30-54 min reading time)

**Route(s):**
- `articles/dzhon-gill-chast-1-chelovek/` (32 min read)
- `articles/dzhon-gill-chast-2-uchenyi/` (39 min read)
- `articles/dzhon-gill-chast-3-nasledie/` (54 min read)
- `articles/krajne-li-isporcheno-serdce/`
- `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`

**Evidence:**
```bash
# No Astro file or HTML file loads back-to-top.js anywhere in the project
$ grep -rn "back-to-top.js" /home/user/project --include="*.astro" --include="*.html" | grep -v dist/
# (no results)

# But these 5 articles have #back-to-top button in HTML:
$ grep -l "back-to-top" /home/user/project/articles/*/index.html
articles/dzhon-gill-chast-1-chelovek/index.html
articles/dzhon-gill-chast-2-uchenyi/index.html
articles/dzhon-gill-chast-3-nasledie/index.html
articles/krajne-li-isporcheno-serdce/index.html
articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
```

**Root cause:** `back-to-top.js` module exists at `js/modules/back-to-top.js` (self-contained, no dependencies) but is never loaded on any page. The `#back-to-top` button HTML exists in 5 articles but:
- Scroll-based visibility (show after 600px scroll) doesn't work → button always visible
- Click-to-scroll-to-top doesn't work → no handler attached

**Module functionality (from source):**
- Shows button when `window.scrollY > 600`
- Hides button when at top
- Click handler: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Uses AbortController for cleanup

**CSS analysis:** `site.css` has hover effect for `#back-to-top svg` (translateY on hover) but NO CSS that hides the button by default. Button is hardcoded as visible in HTML.

**Repair lane:** `faq-accordion-wiring` (same lane as P3-8) — add `<script src="/js/modules/back-to-top.js">` to all 5 affected article pages. The module is self-contained and needs no configuration.

---

## P3-8 SCOPE EXPANSION CONFIRMED

**Original finding:** Antisovetov only
**Expanded scope:** 5 pages with non-functional FAQ accordion:

| Page | FAQ Items | Module Loaded? |
|------|-----------|----------------|
| `articles/20-antisovetov-pastoru/` | 16 (Q1-Q16) | ❌ No |
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | present | ❌ No |
| `articles/kod-da-vinchi/` | present | ❌ No |
| `articles/krajne-li-isporcheno-serdce/` | present | ❌ No |
| `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/` | present | ❌ No |

**Module:** `js/modules/faq-accordion.js` — self-contained, no dependencies.

---

## P1-2 / P1-3 RECHECK

**sitemap.xml (43 URLs):** All missing pages are placeholder stubs ("Визуальный аудит карт"):
- 8 karty stub routes (early-church, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua)
- Per user instruction: stubs are NOT bugs → P1-2 gap is intentional design

**search-manifest.json (44 items vs 51 Astro pages):**
- Missing pages: 8 karty stubs + `/` (home page)
- Home page IS in sitemap.xml → search still functional via sitemap
- Karty stubs shouldn't be indexed → gap is intentional design

---

## CI CASCADE (P0-6) RECHECK

Analyzed `indexnow.yml` + `deploy.yml`:
- `indexnow.yml` does `git push` (auto-update commit) → triggers `deploy.yml` via `push:` event
- `deploy.yml` has `workflow_run: ["IndexNow"]` → runs after indexnow completes
- Both can fire simultaneously; `concurrency: group: pages` handles this
- Comment in deploy.yml explicitly states this design: "Запускается ПОСЛЕ того, как indexnow.yml завершил работу"
- **Likely INTENTIONALLY DESIGNED behavior**, not a bug. Git history shows 3 regression-fix commits but may have addressed earlier cascade issues.
- Verifier should confirm with owner whether this is intentional or needs retry logic.

---

## Bug Count Update

**Original:** 60 bugs (9 P0, 20 P1, 19 P2, 12 P3)
**New in Round 7:** +1 P3-NEW (back-to-top broken on 5 articles)
**Post-Round-7:** 61 bugs (9 P0, 20 P1, 20 P2, 12 P3) | 6 fixed (V2-2, V2-3, V2-4, P2-6, PS-06, V2-1 PARTIAL)

**Active bugs:** 55 (9 P0, 20 P1, 19 P2, 7 P3) + P2 P3-NEW-2 = 61 total