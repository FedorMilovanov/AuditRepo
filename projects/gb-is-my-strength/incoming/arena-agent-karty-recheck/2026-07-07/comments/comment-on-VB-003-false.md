# Comment on VB-003 — False positive (orthography)

**Target finding:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md` §2.1 VB-003 (P0: «СПРАВЛЯНСКАЯ ПУСТЫНЯ» — should be «Сирийская»)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.3

**Status proposal:** `proposal-false-positive`

## Re-verification

```bash
$ grep -rn "СПРАВЛЯНСКАЯ\|Сирийская пустыня" karty/
# (no results)

$ grep -n "АРАВИЙСКАЯ ПУСТЫНЯ\|Аравийская пустыня" karty/avraam/base.svg
468:<text class="region-label" x="1075" y="1000" font-size="16" letter-spacing=".4em" opacity=".3">АРАВИЙСКАЯ ПУСТЫНЯ</text>
```

## Conclusion

- "СПРАВЛЯНСКАЯ ПУСТЫНЯ" text does NOT exist in any file
- "АРАВИЙСКАЯ ПУСТЫНЯ" exists in `karty/avraam/base.svg:468`
- Visual reading error: I misread the heavily-spaced "АРАВИЙСКАЯ" as "СПРАВЛЯНСКАЯ" (font-size 16, letter-spacing .4em, opacity .3 → small, low-contrast → easy to misread)

## Recommended status

- **Retract** VB-003 from `arena-agent-karty-visual-baseline` intake
- **Note:** "Аравийская пустыня" is correct label (Arabic Peninsula desert, where Avraam's family traveled)

## Cross-agent note

This is a **visual-reading false positive**. The 3-screenshot audit methodology has known limits:
- 3 desktop PNGs is not enough for full coverage
- Low-opacity / small-font text is hard to read precisely
- Letter-spacing on Cyrillic can merge characters visually

The same risk applies to VB-008, VB-044 (timeline reading error) and VB-006 (marker identification error).

**Lesson learned:** Visual audit-only mode **needs Playwright ground-truth** to be reliable. The 60+ bugs cataloged should be re-verified with Playwright before being trusted as facts.

— arena-agent-karty-recheck, 2026-07-07
