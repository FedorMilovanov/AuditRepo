# REPORT — karty/ Strategy: 1 Atlas-Grade Map (Авраам)

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Audited branch:** main
- **Audited SHA:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, deploy run `28829729903`)
- **Agent:** arena-agent-karty-strategy
- **Date:** 2026-07-07
- **Environment:** E2B / Firecracker microVM, Debian 13 trixie, 2 vCPU / 2 GB RAM, Node 22.12.0
- **Build mode:** source-only (no dist built, no Playwright — out of scope)
- **Browser / device if used:** none (read-only static analysis)
- **Report type:** **strategy** (out of standard types — close to `source-audit` but with strategic redirection focus)
- **Supersedes:** `incoming/arena-agent-karty-audit/2026-07-07/` strategy (commit c253596) — **technical findings preserved**
- **Trigger:** owner decision 2026-07-07, 4 hours after previous intake push
- **Status:** 5 owner decisions pending

## Critical context

> **Owner (Фёдор Милованов, 2026-07-07):**
>
> «Сначала ИДЕАЛЬНО сделать Авраама или вообще переделать все в атлас какой-то
> крутой с 1 рабочей картой а потом уже остальное делать, а не всё сразу.
> ... Не костылями делать, а долгая работа на месяцы.»

This intake is a **strategic redirection** in response to owner's words. Not technical findings (those are in previous intake), but **plan structure**.

---

## 1. New Findings

### Strategy Finding STRAT-01
- **Title:** "Fleet model" (10 routes maintained) is wrong for karty/. "Flagship model" (1 atlas + 9 placeholders) is right.
- **Severity:** P0 (blocks all other strategy decisions)
- **Source:** owner words 2026-07-07
- **Evidence:** 8 placeholder routes have JSON-LD `description`: «Карта временно снята с витрины до ручной визуальной доводки» — they are intentionally broken, awaiting atlas-grade UI design, not "just need activation".
- **Suggested action:** **Phase 0 FREEZE.** Do not activate 8 placeholders. Do not even prepare to activate.
- **Cross-ref:** supersedes `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-01.md` strategy

### Strategy Finding STRAT-02
- **Title:** Engine v2.0 should be designed **before** Авраам v2.0, not after.
- **Severity:** P0 (blocks Phase 2)
- **Source:** `ANTI-PATTERNS.md` A2 (engine as afterthought)
- **Evidence:** Current `map-engine.js` v0.52.0 grew organically from avraam-app.js. 13 call-sites in avraam-app.js use `window.MapEngine?` with inline fallbacks because engine doesn't have explicit extension points.
- **Suggested action:** Phase 2 = 2-4 мес design-only (no code). `ENGINE-CONTRACT-RETHINK.md` as spec.
- **Cross-ref:** replaces `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-06.md` strategy

### Strategy Finding STRAT-03
- **Title:** 6-8 month phased plan, not W-wave FAST plan
- **Severity:** P0 (timeline)
- **Source:** owner words
- **Evidence:** FAST plan (W1, W4, W7, W9) is 1-2 weeks per lane = 2 months total. But "very good, not atlas" — not what owner wants. Atlas-grade = 6-8 months.
- **Suggested action:** `STRATEGY.md` §4 (6-phase plan)
- **Cross-ref:** supersedes W1/W4/W7/W9 in SUPER_AUDIT W-system

### Strategy Finding STRAT-04
- **Title:** Atlas-grade = 8 simultaneous criteria (visual, narrative, reference, cross-ref, perf, a11y, editorial, honest)
- **Severity:** P0 (success criteria)
- **Source:** `STRATEGY.md` §6
- **Evidence:** "Macmillan Bible Atlas" / Logos / Step Bible as reference. Russian-language gap.
- **Suggested action:** Phase 3 not closed until all 8 met
- **Cross-ref:** this is the **acceptance gate** for Авраам v2.0

### Strategy Finding STRAT-05
- **Title:** Visual QA baseline (Playwright screenshots + 5-bug review) needed before Phase 1
- **Severity:** P1 (recommended, not blocking)
- **Source:** `STRATEGY.md` §4.1
- **Evidence:** audit-only mode can't run Playwright. Owner / external reviewer must.
- **Suggested action:** 30-min owner-driven baseline + 1-2 weeks Playwright supplement

### Strategy Finding STRAT-06
- **Title:** Reclassify 16 KARTY-findings from W1/W4/W7/W9 to Phase 0/1/2/3/4
- **Severity:** P2 (process)
- **Source:** `KARTY-01-16-RECLASSIFICATION.md`
- **Evidence:** All 16 technical findings still valid. What changes is which phase they belong to.
- **Suggested action:** verifier updates MASTER_BUG_MATRIX.md `repair_lane` column

---

## 2. Confirmations of Previous Intake (16)

All 16 KARTY-findings from `incoming/arena-agent-karty-audit/2026-07-07/` (commit c253596) are **technically valid**. This intake **does not dispute** any of them. What changes is **actionable plan**:

- KARTY-01 SUPERSEDED strategy (technical finding kept)
- KARTY-02 DEFERRED to Phase 3
- KARTY-03 ELEVATED to P0 (central problem of avraam)
- KARTY-04, KARTY-05, KARTY-07, KARTY-09, KARTY-10, KARTY-13, KARTY-16 KEPT in Phase 2 (engine redesign)
- KARTY-06 REDEFINED (engine first, then Авраам)
- KARTY-08 KEPT in Phase 1.3 (function-taxonomy)
- KARTY-11, KARTY-12, KARTY-14 KEPT in Phase 3 (rewrite)
- KARTY-15 KEPT in Phase 4 (template)

See `KARTY-01-16-RECLASSIFICATION.md` for full table.

---

## 3. Challenges / Disputes

**0 disputes.** Previous intake and this intake are **consistent on technical findings**. They differ on **strategic prioritization and timeline**, which is **owner's call**, not audit's.

---

## 4. Duplicate / Merge Proposals

**0 merge proposals.** Previous intake's 16 findings remain as separate findings. This intake **adds** 6 strategic findings (STRAT-01..06), no merge needed.

---

## 5. Severity Proposals

5 owner decisions (`proposals/proposal-OWNER-1..5.md`):

| # | Question | Default if no response |
|---|----------|------------------------|
| 1 | Авраам = единственная живая карта, 9 frozen? | YES (per owner words) |
| 2 | Engine redesign allowed (не pure preserve)? | YES (per anti-patterns) |
| 3 | Phased plan (months, not weeks)? | YES (per owner words) |
| 4 | Atlas-grade quality bar (8 criteria)? | YES (per STRATEGY.md §6) |
| 5 | Visual QA baseline (Playwright + 5 bugs)? | YES (recommended) |

---

## 6. Repair Lane Suggestions

**NO W1/W4/W7/W9 lanes** (those are weeks, we work in months).

**6 phases** (детально в `STRATEGY.md` §4):

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 0 FREEZE | 1-2 days | 5 owner decisions |
| 1 AUDIT AVRAAM | 1-2 months | 30+ visual bugs, perf baseline, design system v0.1 |
| 2 ENGINE DESIGN | 2-4 months | ENGINE-CONTRACT-RETHINK.md final, anti-engine manifesto |
| 3 REWRITE AVRAAM | 2-3 months | engine v2.0 + Авраам v2.0, atlas-grade |
| 4 TEMPLATE & DOCS | 1 month | template docs, 2nd map proof-of-concept |
| 5+ SCALE | future | only after owner approves |

**Total: 6-8 months.**

**Owner-blocking decisions: 5 (in `proposals/`)**

**Not in this plan:**
- All 8 placeholder routes (KARTY-01 superseded, KARTY-02 deferred)
- GSAP, DrawSVG, MotionPath (KARTY-11 deferred to Phase 3)
- 2nd map (only after Phase 4 owner approval)

**What we DON'T touch:**
- PremiumControls / Gill (frozen, in-flight, не наше)
- Глоссарий (W5, in-flight, не наше)
- Bible-корпус (W6, frozen, не наше)

---

## 7. Reverify Notes (для verifier)

When merging this intake into MASTER_BUG_MATRIX.md:
1. **Keep** 16 KARTY-findings (technical valid)
2. **Update** their `repair_lane` to Phase 0..4
3. **Add** 6 STRAT-findings as separate section
4. **Mark** KARTY-01 as `proposal-superseded` (not closed)
5. **Add** new "karty/ Atlas Project" entry in `verified/`
6. **Link** to this intake + STRATEGY.md

---

## 8. Notes for Verifier

### 8.1 What this intake does NOT do
- No code in gb-is-my-strength
- No dist build
- No Playwright run
- No mutation of MASTER_BUG_MATRIX.md (verifier's job)
- No activation of any route (owner decision)

### 8.2 What verifier should do (priority)
1. **Update** 16 KARTY-findings' `repair_lane` in MASTER_BUG_MATRIX.md
2. **Add** 6 STRAT-findings to a new "karty/ Atlas Project" section in `verified/`
3. **Wait** for 5 owner decisions before any code work
4. **Reference** this intake + previous intake as dual sources

### 8.3 What verifier should NOT do
- Do NOT close KARTY-findings as "not-actionable" (they ARE actionable, just not in W9 anymore)
- Do NOT activate 8 placeholders (owner explicitly said no)
- Do NOT push for FAST lane (owner explicitly said months)

### 8.4 Cross-agent handoff

| Agent | Intake | Status |
|-------|--------|--------|
| arena-agent-6 (2026-06-25) | `archive/2026-07-03-stale-incoming-2/.../GENEALOGY_MAP_ANALYSIS.md` | MAP-01 confirmed (now P0 in this intake) |
| arena-agent-karty-audit (2026-07-07) | `incoming/arena-agent-karty-audit/2026-07-07/` (commit c253596) | 16 findings, strategy SUPERSEDED |
| arena-agent-karty-strategy (2026-07-07) | THIS INTAKE | strategy + reclass, 5 owner decisions pending |
| fable-super-audit (2026-07-06) | `incoming/fable-super-audit/2026-07-06/REPORT.md` | page-ownership + publication status confirmed |

---

## Files in this intake

- `README.md` — identity, scope, supersedes relationship
- `STRATEGY.md` — **main document** (~400 lines): vision, anti-patterns, 6-phase plan, decision matrix
- `ENGINE-CONTRACT-RETHINK.md` — engine v2.0 spec (Phase 2 deliverable preview)
- `ANTI-PATTERNS.md` — 15-pattern catalog
- `KARTY-01-16-RECLASSIFICATION.md` — table of how 16 findings change under new plan
- `REPORT.md` — this file
- `commands.log` — what I read
- `comments/comment-on-KARTY-01-supersede.md` — formal supersede notice
- `proposals/proposal-OWNER-1..5.md` — 5 owner decisions

---

**Подпись:** arena-agent-karty-strategy, 2026-07-07
**Status:** `proposal-open` — 5 owner decisions required
**Source HEAD:** `75f807b73` (verified, на проде)
