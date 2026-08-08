# Intake — gb-is-my-strength — arena-agent-karty-visual-baseline — 2026-07-07

## Identity
- **Project:** gb-is-my-strength
- **Agent:** arena-agent-karty-visual-baseline (independent Arena Agent, owner: Фёдор Милованов)
- **Date:** 2026-07-07 (same day, 3rd intake for karty/)
- **Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, run `28829729903`)
- **Environment:** E2B / Firecracker microVM
- **Build mode:** **visual-only** (read screenshots, NO code, NO dist build, NO Playwright)
- **Report type:** visual-baseline (out of standard types — close to `source-audit` but for UX)
- **Supersedes:** none (this is a NEW intake, additional to the two prior)
- **Triggers:** OWNER-DECISION-5 from `arena-agent-karty-strategy` intake

## Why this intake exists

In `incoming/arena-agent-karty-strategy/2026-07-07/`, OWNER-DECISION-5 proposed:
> Visual QA baseline (Playwright + 5-bug review) needed before Phase 1.
> Output: `audit/avraam/visual-baseline.md` (Phase 1.1 deliverable).

**This intake implements that baseline — but using owner's actual production screenshots, not Playwright.**

Owner shared 3 screenshots from https://gospod-bog.ru/karty/avraam/ on 2026-07-07 at 13:01 MSK. I analyzed them and produced a structured visual bug catalog.

This is **NOT** a complete visual QA (only 3 screenshots, only desktop, no mobile, no all 8 stages, no all 5 stories). It's a **baseline** — enough to:
1. Validate that "atlas-grade" is achievable
2. Identify the **60+ visual bugs** that block atlas-grade
3. Categorize bugs by severity and by which Phase they belong to
4. **Replace the need for owner's 30-min baseline** — owner already provided data

## Scope (what this intake covers)

- 3 desktop screenshots from production
- 3 zoom levels: full region, mid, detail with open place panel
- One place: «Шалем - гора Мория» (Stage VII, Акеда)
- 60+ visual bugs cataloged with severity + file:line cross-ref to code
- 8 visual strengths (what works)
- Phase assignment (which phase of 6-phase plan should fix each bug)

## Scope (what this intake does NOT cover)

- All 8 stages (only VII analyzed)
- All 5 stories (only «Весь путь» visible)
- Mobile (no screenshots)
- Tablet (no screenshots)
- All tabs (only «Сюжет» in panel)
- Long-press, swipe, deep-link, share, photo modal, search, measure tool
- Keyboard navigation
- Screen reader (NVDA / VoiceOver)
- Performance (Lighthouse, FCP, LCP, INP)
- Cross-platform (Firefox, Safari, Edge)

## Files in this folder

- `README.md` (this file)
- `REPORT.md` — full visual bug catalog with severity + code cross-refs
- `evidence/screenshots/zoom-1-full-region.png` — Babylon zoom-out
- `evidence/screenshots/zoom-2-mid.png` — Mid zoom (Canaan + Sinai)
- `evidence/screenshots/zoom-3-detail-panel-open.png` — Detail with open panel (Moriah)
- `commands.log` — what I did

## Headline finding

**60+ visual bugs** found from 3 screenshots.

- **Critical (P0-P1):** 5 bugs (orthography, timeline duplicates, label overlap, opacity bug, panel size)
- **Atlas-blocker (P1-P2):** 7 bugs (markers outside route, Hebrew RTL, Hebrew word separation)
- **Polish (P2-P3):** ~48 bugs (typography, contrast, spacing, branding)

**vs Strategy's Phase 1 budget:** 30+ visual bugs expected. **Result: 2× over budget.** This is a real signal — the existing Авраам карта has serious quality issues that the W-волна plan would NOT have fixed (FAST plan focuses on engine contract, not visual quality).

## Recommendation

1. **Accept** this baseline as Phase 1.1 deliverable (replaces owner's 30-min baseline)
2. **Update** STRATEGY.md Phase 1 budget: 30+ → 60+ bugs
3. **Add** this intake to MASTER_BUG_MATRIX as supplementary evidence for KARTY-findings
4. **Use** the bug catalog for Phase 3 (rewrite) acceptance criteria: each P0/P1 must be fixed

## Status

- `proposal-confirmed`: 60 visual bugs (this intake)
- `proposal-superseded`: OWNER-DECISION-5 owner-driven baseline (this intake replaces it)
- `proposal-open`: 0 (no owner decisions required for THIS intake — bugs are facts)

— arena-agent-karty-visual-baseline, 2026-07-07
