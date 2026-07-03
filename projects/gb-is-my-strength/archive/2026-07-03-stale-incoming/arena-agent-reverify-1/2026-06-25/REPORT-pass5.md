# Agent Work Report — Pass 5 (Full Site Sweep)

## Meta
- Agent: arena-agent-reverify-1
- SHA: 03e01a0008de34d654175ea600cdf9f22b2351b4

---

## 1. New Findings

### N-REV1-8: P1 — Sitemap missing 8 karty subroutes (confirms P1-2)

- Severity: P1
- Evidence:
  ```
  Dist pages: 51
  Sitemap page URLs: 43
  Missing from sitemap (in dist):
    /karty/early-church/, /karty/maccabim/, /karty/melachim/,
    /karty/pavel/, /karty/revelation/, /karty/shoftim/,
    /karty/shvatim/, /karty/yeshua/
  ```
- Impact: 8 interactive map pages not indexed by search engines
- Note: /karty/ hub and /karty/avraam/ and /karty/ishod/ ARE in sitemap

### N-REV1-9: P3 — Pastor-series hub still has old themeToggle

- Severity: P3
- Route: /pastor-series/
- Evidence: `dist/pastor-series/index.html: id="themeToggle" = 1`
- Impact: Old toggle visible on hub page (no v16 cluster on this page — not an article)
- Note: Not a regression — this page was never migrated to v16

### N-REV1-10: P3 — External http:// links in article content

- Severity: P3
- Routes:
  - KodDaVinchi: `http://www.danbrown.com/media/todayshow.htm`
  - Baptisty spravochnik: `http://e-heritage.ru/Book/10071267`
- Impact: Mixed-content warnings in browser console (external sites, not our assets)
- Fix: Change to https:// if sites support it, or add `rel="noopener noreferrer"`

---

## 2. Confirmations

### Full site health check
| Area | Status | Notes |
|------|--------|-------|
| Karty (10 pages) | ✅ Working | No cluster needed (map-engine apps) |
| Konfessii | ✅ Working | iframe=1, canonical correct |
| Nagornaya (5 parts) | ✅ Working | fc-ctrl=1, ember=1, save=1, theme=1 each |
| Krajne/Rimlyanam | ✅ Fixed (PS-04) | fc-controller loaded |
| Landings (home/about/bio) | ✅ Clean | No cluster (correct) |
| 404 page | ✅ Present | 7945 bytes |
| manifest.json | ✅ Valid | name, start_url, 4 icons |
| Yandex/Google verification | ✅ Present | 2 Yandex + 1 Google files in dist |
| llms.txt | ✅ 25 URLs | All key pages present |
| feed.xml | ✅ 17 items | Weekdays correct (V2-4 fixed) |
| search-manifest.json | ✅ 44 items | 26 articles, 7 series, 3 tools, etc |
| CSP meta | ✅ Present | On kontekst + hermenevtika |
| theme-color | ✅ Present | Light + dark variants |
| OG images | ✅ All exist | 4 key pages verified in dist |
| Accessibility (alt, lang, skip-link) | ✅ Clean | 0 missing alt, lang=ru, skip-link targets exist |
| SW precache | ✅ 29/29 exist | All assets in dist (copy-legacy provides site-layered/site-modules) |
| Duplicate IDs | ✅ Zero | Across all 51 dist pages |
| Inline handlers | ✅ Clean | Only konfessii _app (3D bundle, expected) |

---

## 8. Notes for Verifier

1. Site is in healthy state overall — most infrastructure works correctly.
2. Remaining issues cluster around 3 themes:
   - **Baptisty controls dead** (P1-14, P1-13, P1-15) — biggest functional gap
   - **Sitemap/search-manifest incomplete** (P1-2, P1-3) — 8 karty pages missing
   - **SW hygiene** (P0-7/P0-8 regression) — not breaking, but should be cleaned
3. v16 pilot (kontekst) is production-clean.
4. No new P0 findings in this pass.
