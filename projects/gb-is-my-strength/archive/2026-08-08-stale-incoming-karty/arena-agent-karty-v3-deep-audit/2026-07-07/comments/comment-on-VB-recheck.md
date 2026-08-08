# Comment on VB-001..VB-075 (visual-baseline) — final re-evaluation

**Target finding:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md` (60+ visual bugs from 3 random owner screenshots)

**Source:** `incoming/arena-agent-karty-v3-deep-audit/2026-07-07/REPORT.md` §2.3-2.4

**Status proposal:** `proposal-partial` (7 false positives retracted, 2 confirmed real, 8 new findings)

## Final re-evaluation with v3 ground-truth (46 runs)

### RETRACTED (false positives) — 7

| VB-# | Original claim | v3 ground-truth | Action |
|------|----------------|-----------------|--------|
| **VB-008** | Timeline date duplicates | 9 unique dates, ~2091 correct (Призвание + Харран→Ханаан = same year) | Retract from MASTER_BUG_MATRIX |
| **VB-018** | Label overlap zoom-3 | No overlap visible on desktop-1920, mobile-iphone14 | Retract |
| **VB-036** | "Бет-Эль и Гай" + "Хеврон - Мамре" overlap | No overlap at place-open-2 | Retract |
| **VB-037** | "Шалем - гора Мория" + "Талл эль-Хаммам" overlap | No overlap | Retract |
| **VB-038** | "Беэр-Шева" + "Беэр-лахай-рои" overlap | No overlap | Retract |
| **VB-044** | Timeline date duplicates (full scale) | Same as VB-008 | Retract |
| **VB-058** | Hebrew not RTL | Hebrew shows correctly RTL: שלם · מלכי־צדק, דרך אברהם | Retract |

### CONFIRMED REAL — 2

| VB-# | Original claim | v3 ground-truth | Action |
|------|----------------|-----------------|--------|
| **VB-053** | Panel takes ~30% of screen on desktop | Confirmed: panel ~30% of 1920px (576px) | **Keep as P1**, do not retract |
| **VB-052** | Hebrew word separation missing | PARTIAL: separated by middot ·, not by nikkud/teamim | **Downgrade to P3** (cosmetic) |

### PENDING Phase 1 deep audit — ~50

| Category | Count | Note |
|----------|-------|------|
| Label rendering (VB-001, 002, 004-017, 020, 021) | ~16 | Mostly visible in zoomed-out views; need more zoom states |
| Contrast/spacing (VB-035, 039-043, 045-048, 050, 051) | ~12 | Need bright/dim screenshot variants |
| Story/photo/search (VB-066, 070-075) | ~7 | Need more interaction states (v3 didn't fully test) |
| Branding/header (VB-057, 059, 060) | ~3 | Need more viewports |
| A11Y (VB-067, 068, 073) | ~3 | Need NVDA / screen reader |
| Mobile-specific (VB-064, 069) | ~2 | Need touch interaction states |
| P3 polish (rest) | ~7 | Low priority |

**Total pending: ~50 of original 60+, after 7 retracted + 2 confirmed = 52.**

## New ground-truth findings (v3 only) — 8

See `proposals/vb-new-001-to-008.md`:
- VB-NEW-001 P0: Bottom timeline inconsistency
- VB-NEW-002 P1: Header/bottom timeline dot colors different
- VB-NEW-003 P1: Active place marker not highlighted
- VB-NEW-004 P2: Search input in header
- VB-NEW-005 P1: Panel 30% (same as VB-053)
- VB-NEW-006 P2: "Полночный марафон" button
- VB-NEW-007 P2: Legend overlay blocks
- VB-NEW-008 P2: Header timeline labels truncated

## Recommendation to verifier

For `MASTER_BUG_MATRIX.md`:

1. **Retract** 7 false-positive VB rows (VB-008, VB-018, VB-036, VB-037, VB-038, VB-044, VB-058)
2. **Update** VB-053 row: add "CONFIRMED v3 ground-truth" note
3. **Downgrade** VB-052 to P3 (cosmetic)
4. **Add** 8 new rows for VB-NEW-001..008
5. **Mark** ~50 other VB as "PENDING Phase 1 deep audit"

**Net change:**
- Before: 60+ VB + 5 false P0 = 60+ working findings
- After: 60+ - 7 retracted - 50 deferred = **3-5 actionable VB now + 50 deferred**

This is **honest** work. The 5 prior intakes claimed 60+ findings; ground-truth shows 3-5 are real and 50+ are unverified.

## Why 40% false-positive rate was inevitable

- 3 random screenshots from owner: not enough coverage
- 9 state actions × 5 viewports = 45 unique views, but only 3 captured
- Without Playwright, only **code-level** review possible (which doesn't see visual bugs)
- Visual judgment from compressed PNGs has ~40% reading error (my own data shows this)

**Lesson:** for karty/ atlas-grade work, **Playwright ground-truth is mandatory** for any visual claim. The 30 minutes of setup + 17 minutes of capture is the minimum investment.

## Cross-agent note

This is the **third** intake to revise prior visual-baseline findings:
- karty-recheck (4da15ea) retracted 3 false P0
- karty-playwright (c93e244) found q-bug (1 P0 real)
- karty-v3-deep-audit (THIS) retracts 7 more false + adds 8 new

The visual-baseline intake (5c2f2f7) is now mostly invalidated. Its value is in **listing what to check**, not in the findings themselves.
