# INACCURACIES + KOLHOZ DEBT IN GILL (Deep surgical evidence) — 2026-06-27

**Focus:** Everything that is wrong, hardcoded, duplicated, or not using the canonical data source.

## 1. Series Progress Percentages (MOBILE + DESKTOP RINGS) — MAJOR KOLHOZ

**Canonical data:** `data/series.json` → 149 min total
- Part 1: 16 → 11%
- Part 2: 32 → 21%
- Part 3: 39 → 26%
- Part 4: 54 → 36%
- Part 5: 8 → 5%

**Actually rendered (hardcoded in every chrome):**

| Chrome               | gbs2Pct   | gbs2MobPct | stroke-dashoffset | Correct? |
|----------------------|-----------|------------|-------------------|----------|
| part1                | 11%       | 11%        | 101               | OK (part1) |
| part2                | 32%       | 32%        | 77                | **WRONG** (should 21%) |
| part3                | 58%       | 58%        | 47                | **WRONG** (should 26%) |
| spravochnik          | 95%       | 95%        | 6                 | **WRONG** (should 5%) |

Context (Part 1) has **no ring at all** in desktop rail.

**Why kolhoz:** Every time a new part is added or readingTime changes, someone manually recalculates and pastes new numbers + new dashoffset into 4–5 files.

## 2. Chapter counts (gbs2Count) — wrong / hardcoded
- Part1: "1 / 1"
- Part2: "1 / 6"
- Part3: "1 / 16" (clearly inflated)
- Spravochnik: "1 / 9"

Not derived from actual content.

## 3. "Часть X из 5" and gbs2Meta — duplicated strings
Hardcoded in:
- HeaderHero.astro files
- PageChrome.astro files
- gbs2Meta spans

Examples: "Часть 2 из 5", "Часть 3 из 5", "Часть 4 из 5" etc. appear 8+ times across files.

## 4. No dynamic / data-driven progress anywhere
- `data/series.json` is the only source of truth for readingTime.
- None of the Gill chromes import or use it for series % calculation.
- Controller only handles **TTS** progress.
- All rings, bars, labels are static strings + static SVG attributes.

## 5. Other small kolhoz / inaccuracies found
- Part TOC progress bars inside context: all `<i style="width:0%"></i>` (static).
- Some `gbs2-rsub` and labels are correct, but the **cumulative series %** is not.
- No audit guard that cross-checks rendered % vs data/series.json.

## Impact
- Every desktop rail ring + mobile bottom bar in Gill series shows **wrong progress**.
- Screenshots from user (2026-06-27) would have shown these wrong numbers.
- High maintenance cost (kolhoz).
- Breaks user trust ("почему у меня 58%, когда я только на третьей части?").

**This is classic "колхозные костыли решения"** that the owner complained about.

**Recommended surgical action (low-risk next):**
1. Introduce one `SeriesProgress.astro` component.
2. Pass `currentN` + read series data (or precompute at build).
3. Render correct % + correct `stroke-dashoffset`.
4. Update all 5 chromes to use the component.
5. Add assertion in rollout-audit or new gill audit.

**Files to watch:**
- `data/series.json`
- All `gill-*/Gill*PageChrome.astro`
- `gill-*/Gill*HeaderHero.astro`

**Status:** New documented debt (P1 data + visual parity).
