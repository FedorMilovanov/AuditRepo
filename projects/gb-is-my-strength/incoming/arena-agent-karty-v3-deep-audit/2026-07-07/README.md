# Intake — gb-is-my-strength — arena-agent-karty-v3-deep-audit — 2026-07-07

## Identity
- **Project:** gb-is-my-strength
- **Agent:** arena-agent-karty-v3-deep-audit
- **Date:** 2026-07-07 (6th intake for karty/, 5 hours after karty-audit)
- **Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (production)
- **Environment:** E2B / Playwright 1.61.1
- **Build mode:** **Playwright v3 ground-truth** (route-specific selectors, JS dispatchEvent for SVG)
- **Report type:** source-audit + visual deep-audit (with ground-truth screenshots)

## Critical insight (TL;DR)

The 5 previous karty/ intakes (audit, strategy, visual-baseline, recheck, playwright) had systematic blind spots:
- **Audit-only** cannot detect runtime JavaScript errors
- **3 random screenshots from owner** had 40%+ false-positive rate (5/5 P0 retracted)
- **Playwright v1** had broken SVG selectors — all "post-state" runs were actually initial state

**v3 fixes this**: route-specific placeIds, JS dispatchEvent for SVG elements, proper intro dismissal.

## Key findings (v3 ground-truth)

### Real P0 (runtime)
- **Q-BUG-SEARCH-P0** (already in LANE): `q is not defined` on search keystroke (map-engine.js:867). Confirmed 4x in v3 (vs 25x in v1 — v1 was firing per page, v3 fires per search action).

### Real P0 (visual, ground-truth NEW)
- **VB-NEW-001** P0: Bottom timeline stage dots inconsistency — 7 visible at stage 7 panel open, but 8 stages defined
- **VB-NEW-002** P1: Header timeline dots (red) ≠ bottom timeline dots (multi-color) — two different renderings
- **VB-NEW-003** P1: Active place marker not highlighted (gray label instead of gold)
- **VB-NEW-005** P1: Panel takes ~30% of screen on desktop (VB-053 confirmed, not false positive)

### Real P2 (visual, ground-truth NEW)
- **VB-NEW-004** P2: Search input embedded in header (visual hierarchy broken)
- **VB-NEW-006** P2: "Полночный марафон" button — what is it? (no aria-label, no tooltip)
- **VB-NEW-007** P2: Legend overlay (LEGENDA) blocks markers in right area
- **VB-NEW-008** P2: Header timeline подписи обрезаны (e.g., "АВРАМУ 75 ЛЕТ" → "АВРАМ 75 ЛЕТ..." cut at ~20 chars)

### False positives retracted (re-verify)
- **VB-018, VB-036, VB-037, VB-038** (label overlap): NOT visible in v3 ground-truth (no overlap on real screenshots)
- **VB-008, VB-044** (timeline duplicates): 9 unique dates, ~2091 is correct (same year for stages 0+1)
- **VB-058** (Hebrew not RTL): Hebrew shows correctly RTL on v3 screenshots (שלם · מלכי־צדק, דרך אברהם)
- **VB-053** (panel 30%): CONFIRMED, not false positive

## Why v1 was wrong

`audit_visual.js` v1 used HTML text selectors (`text=Шалем`, `text=Весь путь`) which don't traverse SVG. Result: all "post-state" actions either timed out or were no-ops. The 50 v1 screenshots showed essentially the **same** state (initial + intro) for all 9 avraam states × 5 viewports.

**v3 lessons learned:**
1. SVG elements need `[data-place-id="..."]` selectors, not text
2. Layer toggles need `force: true` (they may be partially off-screen)
3. Need to dismiss intro before testing real state actions
4. State actions need verification (`panel=true('Имя')` confirms success)

## Coverage

- **46 runs total** (vs 50 in v1, with proper state coverage)
- **2 routes:** avraam, ishod
- **2 viewports:** desktop-1920, mobile-iphone14
- **11-12 states per route** (initial, intro-dismissed, 3 place-opens, 2 layer-off, 1-2 stories, theme-light, search, panel-tab-arch)
- **4 pageerrors total** (all q-bug, none in new state actions)
- **0 unexpected JS errors** in v3 (q-bug is the only P0 runtime)

## Files in this folder

- `README.md` (this file)
- `REPORT.md` — full v3 ground-truth analysis
- `evidence/manifest/run-46.json` — all 46 runs
- `evidence/screenshots/` — 8 key screenshots (4 per route)
- `proposals/vb-new-001-to-008.md` — 8 new P0/P1 visual bugs with ground-truth
- `proposals/confirm-q-bug-merge.md` — request owner to merge LANE
- `comments/comment-on-VB-recheck.md` — final re-evaluate of all VB findings
- `comments/comment-on-v1-bug.md` — explain v1's broken selector methodology
- `commands.log`

## Status

- `proposal-confirmed`: 8 new VB findings (P0/P1/P2)
- `proposal-retracted`: 4 false positives (VB-008, VB-018, VB-036, VB-037, VB-038, VB-044, VB-058)
- `proposal-confirmed-real`: VB-053 (panel 30%, not false)
- `proposal-pending`: q-bug merge (LANE branch awaiting PR review)

— arena-agent-karty-v3-deep-audit, 2026-07-07
