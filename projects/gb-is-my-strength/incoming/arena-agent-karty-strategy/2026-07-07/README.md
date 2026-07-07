# Intake — gb-is-my-strength — arena-agent-karty-strategy — 2026-07-07

## Identity
- **Project:** gb-is-my-strength
- **Agent:** arena-agent-karty-strategy (independent Arena Agent, owner: Фёдор Милованов)
- **Date:** 2026-07-07
- **Audited branch:** main
- **Audited SHA:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, run `28829729903`)
- **Environment:** E2B / Firecracker microVM, Debian 13 trixie, 2 vCPU / 2 GB RAM, Node 22.12.0
- **Build mode:** source-only
- **Report type:** **strategy** (out of standard report_types — `source-audit` cousin)
- **Supersedes:** `incoming/arena-agent-karty-audit/2026-07-07/` (commit `c253596`) — **owner strategic redirection**

## Critical context: this is an OWNER DECISION, not a technical reclassification

> **Owner (Фёдор Милованов, 2026-07-07):**
>
> «Сначала ИДЕАЛЬНО сделать Авраама или вообще переделать все в атлас какой-то
> крутой с 1 рабочей картой а потом уже остальное делать, а не всё сразу.
> Сначала делаем 1 идеальный вариант, потом всё остальное.
> Наша ошибка — наплодили карт, это карты-баги-заглушки, а не карты.
> Нужно их и оставить ими и работать с Авраамом.
> Выносить идеальнейший движок, работать долго.
> Исправить все визуальные баги, премиальную карту сделать,
> а потом уже по примеру и движку идти дальше, а не так, как сейчас!
> Сейчас и Авраам весь в багах, имя столько строк, надобавляли кучу всего,
> а баги не исправлялись, в итоге либо новое с нуля делать, что не хочется,
> либо взять за то, что есть, 1 карту до идеала с выносом идеально движка
> и потом другие. Не костылями делать, а долгая работа на месяцы.»

## Scope

- Re-evaluation of `incoming/arena-agent-karty-audit/2026-07-07/` strategy in light of owner's strategic redirection
- Vision document for **premium biblical atlas** (target: 1 perfect map = Авраам)
- Long-term (multi-month) phased plan
- Re-classification of KARTY-01..KARTY-16 against new strategy
- Engine contract redesign: not "universal engine + per-route overlay" but
  "**atlas-grade engine with Авраам as canonical instance**"

## Why this intake exists

The previous intake (`arena-agent-karty-audit`) proposed:
- Activate 8 placeholder routes (KARTY-01)
- Migrate avraam-app.js to engine (KARTY-06)
- Work in W1/W4/W7/W9 lanes (FAST cycles, 1-2 weeks each)

**All of this is wrong per owner's strategic redirection.**

- Activating 8 placeholders → spreading bugs wider
- Migrating avraam-app.js as-is → preserves its bugs as engine contract
- FAST lanes → produces more technical debt, not less

The new strategy:
- **Phase 0 (now):** freeze all karty-route UI work. 8 placeholders STAY placeholders
- **Phase 1 (1-2 months):** audit avraam visually + structurally. List every bug, every bloat, every wrong assumption
- **Phase 2 (2-4 months):** redesign engine contract from scratch (data model, API, A11Y, perf)
- **Phase 3 (4-6 months):** rewrite avraam on new engine. Iterate to **atlas-grade quality**
- **Phase 4 (6-8 months):** document the engine + atlas pattern. Only then — and only if owner explicitly approves — consider second map

## Files in this folder

- `README.md` (this file)
- `STRATEGY.md` — **main document** (~400 lines): vision, anti-patterns, 6-phase plan, decision matrix
- `KARTY-01-16-RECLASSIFICATION.md` — how previous intake's 16 findings change under new strategy
- `ENGINE-CONTRACT-RETHINK.md` — what the engine should be, not what it currently is
- `ANTI-PATTERNS.md` — catalog of "what we did wrong" (so we don't repeat)
- `REPORT.md` — 8-section universal report (compressed)
- `commands.log` — what I read
- `comments/comment-on-KARTY-01-supersede.md` — formal supersede notice for KARTY-01 strategy

## Out of scope (preserved from previous intake)

- PremiumControls / Gill (frozen, in-flight, not touched)
- Glossary (W5, in-flight, not touched)
- Bible corpus (W6, frozen, not touched)
- Mutating `gb-is-my-strength` (audit-only, even more so now)
- All 8 placeholder routes (they are FROZEN as placeholders by owner decision)

## Critical constraints for future implementation lanes

1. **No code in this intake.** Vision, not implementation.
2. **Aвраам = ONLY canvas.** Other routes = frozen placeholders. Period.
3. **Engine redesign is allowed.** Throwing away v0.52.0 is allowed (per owner: "либо новое с нуля делать, что не хочется, либо взять за то, что есть"). Owner prefers "build on what we have" → engine redesign preserves API where possible, breaks API where must.
4. **No deadline.** Owner said "долгая работа на месяцы". Not W1-W10.
5. **A11Y, perf, design quality are NOT optional.** Atlas-grade = top tier.

## Owner decisions REQUIRED before any code

- [ ] **Decision 1:** Confirms "Авраам is the only living route; 8 placeholders stay frozen"?
- [ ] **Decision 2:** Confirms "engine redesign is allowed (not pure preserve)"?
- [ ] **Decision 3:** Confirms "phased plan, not FAST lanes" (months, not weeks)?
- [ ] **Decision 4:** Confirms "atlas-grade quality bar" (what does that mean for Авраам specifically)?
- [ ] **Decision 5:** Visual QA — does Авраам currently look acceptable on https://gospod-bog.ru/karty/avraam/? (Playwright screenshots needed)

## Supersedes relationship to previous intake

`incoming/arena-agent-karty-audit/2026-07-07/` (commit c253596) is **NOT deleted**.
It is **superseded** for strategy purposes, but its **16 technical findings remain valid** —
the bugs are still there. What changes is **which bugs we fix first, and how**.

Specifically:
- KARTY-01 (activate 8 placeholders): **SUPERSEDED → OPPOSITE** (keep them frozen)
- KARTY-02 (noscript for 8): **DEFERRED** (no UI = no need for noscript fallback yet)
- KARTY-03..KARTY-15 (engine bloat, avraam bugs): **ELEVATED to P0** (these are the actual work)
- KARTY-16 (schema hardening): **KEEP in W1** (validation gate is cheap and doesn't activate routes)

See `KARTY-01-16-RECLASSIFICATION.md` for full table.

## Status

- `proposal-open`: 5 owner decisions (in `proposals/`)
- `proposal-supported`: 0
- `proposal-confirmed` (technical findings from previous intake): 16 (kept as evidence)
- `proposal-superseded`: KARTY-01 strategy (technical finding still valid, but actionable plan changed)

— arena-agent-karty-strategy, 2026-07-07
