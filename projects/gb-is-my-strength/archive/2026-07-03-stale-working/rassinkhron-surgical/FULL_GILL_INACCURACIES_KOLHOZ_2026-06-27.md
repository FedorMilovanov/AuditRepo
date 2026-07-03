# FULL GILL INACCURACIES + KOLHOZ DEBT (Thorough surgical audit) — 2026-06-27

**Method:** Deep manual + scripted cross-check of all Gill chromes vs canonical data + controller + screenshots complaints.

## 1. SERIES PROGRESS PERCENTAGES (biggest visible kolhoz)

Canonical (data/series.json, total 149 min):
- Part1: 16 → **11%**
- Part2: 32 → **21%**
- Part3: 39 → **26%**
- Part4: 54 → **36%**
- Part5: 8 → **5%**

**Hardcoded in UI (wrong on 4/5 parts):**
- Part2 ring + bbar: 32% (should 21%)
- Part3 ring + bbar: 58% (should 26%)
- Part5 ring + bbar: 95% (should 5%)

Fixed stroke-dashoffset values baked in for each chrome (101, 77, 47, 6).

Context page (Part 1) completely missing the series ring in desktop rail.

## 2. CHAPTER COUNTS (gbs2Count)

Hardcoded and often wrong:
- Part1: "1 / 1"
- Part2: "1 / 6"
- Part3: "1 / 16" (grossly inflated)
- Spravochnik: "1 / 9"

Actual section counts in bodies are different.

## 3. "Часть X из 5" labels

Duplicated in 8+ places (HeaderHero + PageChrome):
- Part1 files say "Часть 2 из 5"
- Part2 files say "Часть 3 из 5"
- etc.

Some are correct for the file, but the pattern is copy-paste instead of computed.

## 4. gbs2Meta labels

Hardcoded:
- Part1: "Часть 2 из 5"
- Part2: "Часть 3 из 5"
- Part3: "Часть 4 из 5"
- Spravochnik: "Часть 5 из 5"

## 5. Reading times

Canonical values are used in many places (good), but the **cumulative series %** derived from them is not used at all.

## 6. Part TOC progress bars (inside context)

All static `width:0%` or empty.

## 7. Root cause summary

- Zero use of `data/series.json` for any series-level calculation in the Astro components.
- Controller only does per-article TTS progress.
- Everything series-related (%, ring, "X of Y", chapter count, meta) is per-file static strings + static SVG attributes.
- Classic kolhoz that was manually maintained when the series grew.

This explains user complaints:
- "проценты мобильного не те"
- "колхозные костыли"
- Inconsistent visuals across Gill pages in screenshots.

## Files with debt
- All 5 Gill *PageChrome.astro + HeaderHero.astro
- No single SeriesProgress component
- No audit guard

**Status:** New major documented debt (visual + data parity + maintenance).

Next low-risk surgical step: one data-driven SeriesProgress component + guard.
