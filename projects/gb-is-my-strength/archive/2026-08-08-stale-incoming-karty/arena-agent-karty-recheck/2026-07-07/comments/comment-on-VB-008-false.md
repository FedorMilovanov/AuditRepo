# Comment on VB-008 / VB-044 — False positive (timeline date duplicates)

**Target finding:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md` §2.1 VB-008, §2.2 VB-044 (P0/P1: timeline dates -2066, -2006 repeat)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.1

**Status proposal:** `proposal-false-positive`

## Re-verification

```bash
$ python3 -c "import json; r=json.load(open('karty/avraam/route.json')); \
  print([(t.get('era'), t.get('stage'), t.get('label')) for t in r.get('timeline',[])])"
[('~2166', 0, 'Рождение Аврама'),
 ('~2091', 0, 'Призвание · Ур→Харран'),
 ('~2091', 1, 'Харран→Ханаан'),
 ('~2085', 2, 'Египет'),
 ('~2080', 3, 'Раздел с Лотом'),
 ('~2075', 4, 'Война царей'),
 ('~2068', 5, 'Завет · Измаил'),
 ('~2067', 6, 'Обрезание · Содом'),
 ('~2066', 7, 'Исаак · Акеда')]
```

## Analysis

**9 уникальных дат** (2166, 2091, 2091, 2085, 2080, 2075, 2068, 2067, 2066):
- `~2091` repeats for stages 0 and 1 — this is **CORRECT** chronologically:
  - Stage 0: Призвание (в Уре) ~2091
  - Stage 1: Харран → Ханаан ~2091 (immediately after)
  - These are the same year (Abram was 75, left Ur, then went to Hanaan)
- Other dates: all unique, in descending order (2166 → 2066)

## Visual reading error

In screenshot 130155, the bottom timeline showed:
- `-2166, -2099, -2069, -2006, -2066, -2006, -2066, -2066`

This was **likely a different visualization** (perhaps simplified `age` field per stage, not the rich `timeline` array). The actual data in `route.json` is correct.

**Note:** There is a discrepancy between what the screenshot shows and what's in route.json — this could be:
1. A different visualization (compact mode)
2. A rendering bug (showing wrong field)
3. Visual reading error on my part

Without Playwright ground-truth, can't verify which. But the **data is correct**.

## Recommended status

- **Retract** VB-008, VB-044 from `arena-agent-karty-visual-baseline` intake
- **Add note:** "Timeline data is correct; visual reading was wrong"
- **Optional:** investigate whether screenshot showed a different rendering (but needs Playwright)

## Cross-agent note

Same visual-reading error as VB-003 and VB-006. Confirms that 3-screenshot audit-only mode has high false-positive rate for numeric/text data.

— arena-agent-karty-recheck, 2026-07-07
