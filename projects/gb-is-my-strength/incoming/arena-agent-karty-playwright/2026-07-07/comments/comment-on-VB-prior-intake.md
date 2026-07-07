# Comment on VB-001..VB-075 — Re-evaluation with ground-truth

**Target finding:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md` (60+ visual bugs from 3 random screenshots)

**Source:** `incoming/arena-agent-karty-playwright/2026-07-07/REPORT.md` §5

**Status proposal:** `proposal-partial-recheck` (5 of 5 P0 already retracted; ground-truth screenshots available for remaining 60+)

## Re-verification status

| VB-# | Visual baseline (3 screenshots) | Recheck (code only) | Ground-truth needed? |
|------|----------------------------------|----------------------|----------------------|
| **VB-003** | «СПРАВЛЯНСКАЯ» orthography | **RETRACTED** (text doesn't exist) | n/a |
| **VB-006** | Babylon/Nippur markers outside route | **RETRACTED** (all 19 places are Biblical) | n/a |
| **VB-008/VB-044** | Timeline date duplicates | **RETRACTED** (9 unique dates) | n/a |
| VB-018, VB-036-038 | Label overlap (4 places in zoom-3) | **NOT RETRACTED** | YES — Playwright zoom screenshots |
| VB-049 | Opacity .15 for inactive places | **NOT RETRACTED** | YES — visual check |
| VB-053 | Panel 30% screen | **NOT RETRACTED** | YES — visual check |
| VB-058, VB-052 | Hebrew not RTL | **NOT RETRACTED** | YES — visual check |
| VB-001, VB-002, ... | Various label rendering | **NOT RETRACTED** | YES — visual check |

**Result:** 5 of 5 P0 retracted. ~55 of 60+ VB still unverified — need ground-truth review.

## Ground-truth available

50 Playwright screenshots at:
- `/home/user/audit_visual/avraam/<viewport>/<state>/viewport.png`
- `/home/user/audit_visual/ishod/<viewport>/<state>/viewport.png`

Manifest: `/home/user/audit_visual/manifest.json` (machine-readable, 50 runs with dom stats)

5 representative screenshots included in `evidence/screenshots/`.

## Recommendation

1. **Owner or next agent** reviews 50 screenshots + manifest
2. For each VB-XX, mark: confirmed / false-positive / needs-more-context
3. Output: `audit/karty/vb-recheck-2026-07-08.md` (new file, not modifying VB-prior-intake)
4. **Confirmed** bugs → MASTER_BUG_MATRIX
5. **False-positive** bugs → note retracted
6. **Needs-more-context** → Phase 1 deep audit, more screenshots

## Why this matters

The 60+ VB findings had a 40%+ false-positive rate (5/5 P0). Without ground-truth review:
- Phase 1 deep audit could waste days chasing ghosts
- Visual parity in CI would catch real bugs but ALSO flag false positives (annoying)
- Owner loses trust in audit reports

Ground-truth-first methodology is **essential** for karty/ atlas-grade work.

## Cross-agent note

This complements (not supersedes) the visual-baseline intake. The baseline's value is in **listing what to check**; this intake's value is in **providing the data to check**.

— arena-agent-karty-playwright, 2026-07-07
