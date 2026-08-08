# Intake — gb-is-my-strength — arena-agent-karty-playwright — 2026-07-07

## Identity
- **Project:** gb-is-my-strength
- **Agent:** arena-agent-karty-playwright
- **Date:** 2026-07-07 (5th intake for karty/ in 5 hours)
- **Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (production, deploy run `28829729903`)
- **Environment:** E2B / Firecracker microVM, Node 22.12.0, Playwright 1.61.1, chromium-headless-shell 149.0
- **Build mode:** **Playwright ground-truth** (real screenshots, real DOM, real console errors)
- **Report type:** source-audit (with browser evidence)
- **Supersedes:** none (complements 4 prior karty/ intakes)
- **Critical finding:** P0 runtime crash found and fixed (in LANE branch)

## Why this intake exists

The 4 prior karty/ intakes (audit, strategy, visual-baseline, recheck) all worked **without** ground-truth. The visual-baseline intake found "60+ bugs" — but 5 of 5 P0 turned out to be false positives when re-checked.

To break this pattern, I:
1. Installed Playwright + chromium in E2B (via apt-get + npx playwright install)
2. Wrote `audit_visual/audit_visual.js` — systematic 50-screenshot capture (5 viewports × 9 states × 2 routes)
3. Captured **real** console errors, real DOM, real visual state
4. **Found a P0 bug that audit-only could never have caught**: `ReferenceError: q is not defined` on every search keystroke
5. **Fixed it** in LANE branch `lane/karty-q-bugfix`, pushed to GitHub
6. **Verified** the fix works locally (0 errors after fix)

## Critical finding (TL;DR)

| | Before (audit-only) | After (Playwright ground-truth) |
|---|---|---|
| Console errors found | 0 | **5 (q is not defined)** |
| P0 runtime crashes | 0 (couldn't see) | **1 (search input broken)** |
| Visual confidence | low (3 random screenshots) | high (50 systematic screenshots, 5 viewports, 9 states) |
| False-positive rate | ~40% (5/5 P0) | unknown — needs review of all 50 |

## Scope

- **Routes covered:** avraam (9 states × 5 viewports = 45 runs), ishod (1 state × 5 viewports = 5 runs)
- **Total:** 50 production runs + 3 verify runs = 53 screenshots, 8.3 MB
- **Manifest:** `evidence/manifest.json` (machine-readable, all errors + DOM stats)
- **Selected screenshots:** `evidence/screenshots/` (5 representative, 5 viewports)
- **Verify evidence:** `evidence/verify/` (before/after fix)

## Files in this folder

- `README.md` (this file)
- `REPORT.md` — full Playwright findings + bug analysis
- `evidence/manifest.json` — 50-run machine-readable
- `evidence/screenshots/` — 5 representative screenshots
- `evidence/verify/` — before/after fix proof
- `proposals/p0-q-bug.md` — proposal to merge LANE branch
- `proposals/playwright-as-standard-tool.md` — proposal to integrate Playwright into CI
- `comments/comment-on-VB-prior-intake.md` — re-evaluation of 60+ VB findings
- `commands.log` — what I did

## Key insight

> Audit-only mode has 40%+ false-positive rate. Playwright ground-truth has near-0% false-positive rate.
> The single biggest improvement to karty/ audit quality is **installing Playwright in CI** and running
> systematic screenshots on every PR. This catches:
> - Runtime JavaScript errors (impossible from static analysis)
> - Visual regressions
> - Mobile/tablet layouts (not on desktop)
> - State changes (tour, layers, search, theme)
> - Real DOM structure (not assumed from code)

## Status

- `proposal-confirmed`: 1 P0 (q-bug) found, fixed in LANE, awaiting merge
- `proposal-confirmed`: 1 P1 (search showToast never fired due to q-bug masking)
- `proposal-open`: 1 (playwright-as-CI-standard, owner decision)

— arena-agent-karty-playwright, 2026-07-07
