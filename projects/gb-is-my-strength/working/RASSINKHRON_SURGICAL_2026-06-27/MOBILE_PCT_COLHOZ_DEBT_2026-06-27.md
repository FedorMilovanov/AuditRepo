# MOBILE + SERIES PROGRESS PERCENTAGE DEBT (Kolhoz + Inaccuracy) — 2026-06-27

**Source of truth:** data/series.json (149 min total)
**Rendered in UI:** Hardcoded strings + fixed stroke-dashoffset in every Gill chrome.

## Exact numbers from data/series.json
- Total: **149 min**
- Part 1 (context): 16 min → **11%**
- Part 2: 32 min → **21%**
- Part 3: 39 min → **26%**
- Part 4: 54 min → **36%**
- Part 5 (spravochnik): 8 min → **5%**

## What is actually rendered (kolhoz / frozen wrong values)

### Series ring progress (id="gbs2Pct" + stroke-dashoffset)
| File (Part)          | Hardcoded % | stroke-dashoffset | Should be |
|----------------------|-------------|-------------------|-----------|
| gill-part1           | **11%**     | 101               | 11% (ok for part1) |
| gill-part2           | **32%**     | 77                | **21%**   |
| gill-part3           | **58%**     | 47                | **26%**   |
| gill-spravochnik     | **95%**     | 6                 | **5%**    |

### Mobile bottom bar / bbar (id="gbs2MobPct")
Same wrong values duplicated:
- Part1 bbar: 11%
- Part2 bbar: 32% 
- Part3 bbar: 58%
- Spravochnik bbar: 95%

**Context page (Исторический контекст = Part 1)**: NO `gbs2Pct` ring at all in desktop rail. Only 0% in mobile + part TOC progress bars (all static 0% or static widths).

## Root causes / extra logic / unfulfilled
1. **No dynamic calculation** from data/series.json anywhere in the Gill chrome files.
2. Controller (`floating-cluster-controller.js`) only does **TTS** progress (`updateProgress` based on spokenChars / totalChars). No series % logic.
3. All % and ring offsets are **hardcoded per-file** (classic kolhoz — copy-paste when adding new parts).
4. No single source of truth used at render time for "current part index → series percent".
5. stroke-dasharray is always hardcoded `113` (circumference for r=18), offsets manually calculated per part instead of `113 * (1 - pct/100)`.
6. Mobile bbar and desktop rail ring are duplicated strings instead of one component computing from series data + current route.

## Other related inaccuracies / kolhoz found during deep check
- `gbs2-rsub`: "5 частей · 149 мин серии" — good (matches data).
- But individual part labels in rail/TOC/sheet use correct readingTime from data (16/32/39/54/8), while the **series cumulative %** is wrong.
- Context chrome (Part 1) has different structure (no big ring in rail), but part TOC progress bars are all static `<i style="width:0%"></i>`.
- In part chromes the "Часть X из 5" text is also hardcoded in some places (`gbs2Meta`).
- Some part TOCs have `gbs2-count` hardcoded (e.g. "1 / 1", "1 / 9", "1 / 16") — not dynamic chapter count.
- No guard / audit yet that would fail if hardcoded % != calculated from data/series.json.

## Evidence files
- `data/series.json` (canonical)
- `src/components/article-pilots/gill-part*/Gill*PageChrome.astro` (hardcoded strings + dashoffset)
- `js/floating-cluster-controller.js` (only TTS progress, no series %)
- `src/components/article-pilots/gill-context/GillContextPageChrome.astro` (missing series ring entirely)

**This is a clear "колхозные костыли" + inaccuracy** that affects every screenshot of Gill series UI (desktop rail ring + mobile bbar).

Recommended low-risk fix (after owner): introduce a single `SeriesProgress.astro` or data-driven calc in Gill chrome that reads current part n + series.json and renders correct % + correct stroke-dashoffset.

**Status:** Documented as new debt (P1 visual + data parity).

## Additional kolhoz / inaccuracies found in same pass (2026-06-27 continuation)

**Hardcoded chapter counts (gbs2Count):**
- Part1: "1 / 1"
- Part3: "1 / 16" (wrong — actual chapters in that part are fewer)
- Spravochnik: "1 / 9"

**Hardcoded "Часть X из 5" / series meta:**
- Many places still say "Часть X из 5" even when current part number is wrong in context of the rendered page.

**gbs2Meta (progress label):**
- "Часть 2 из 5", "Часть 4 из 5" etc. — hardcoded per chrome file.

**Conclusion:** The entire series progress UI (ring + mobile bar + meta labels + chapter counts) is implemented as per-file copy-paste instead of one data-driven component. This is classic "колхоз" that will break every time a part is added/removed or readingTime is corrected in series.json.

**Recommendation for next surgical pass:**
- Create `SeriesProgress.astro` (or extend GillRailControls) that takes `currentPartN` + reads `data/series.json` at build time or via a tiny JS init.
- Single source for % , ring offset, "X из Y", chapter count.
- Add guard in `premium-controls-rollout-audit.js` or new gill-series-audit that asserts rendered % == calculated %.

