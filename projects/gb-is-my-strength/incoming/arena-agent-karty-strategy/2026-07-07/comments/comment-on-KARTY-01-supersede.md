# Comment on KARTY-01 — Formal Supersede (Strategy)

**Target finding:** `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-01.md` (commit c253596)
**Target comment:** `incoming/arena-agent-karty-audit/2026-07-07/comments/comment-on-BUG-SITEMAP-8-KARTY-MISSING.md`
**Status:** `proposal-confirmed` (technical finding) + `proposal-superseded` (actionable plan)
**Current source HEAD:** `75f807b73`
**Date:** 2026-07-07 (same day as target, owner strategic redirection)

## Status: SUPERSEDED for actionable plan; CONFIRMED for technical finding

## What is being superseded

Original proposal-KARTY-01 said:
> Severity: P3 (originally P1, reclassified)
> Suggested action: Phase 0 (FREEZE) + Phase 1 (W9: activate 8 placeholders)
> Do not mix with: BUG-SITEMAP-8-KARTY-MISSING (там уже RESOLVED; это extension, не duplicate)

Specifically, the actionable recommendation was:
> "W9 — MapEngine activation. ... ⏳ В W9: подключить <script src="../_engine/map-engine.js"></script> + init-код (по образцу karty/ishod/index.html) к каждой из 8 заглушек."

**This actionable recommendation is SUPERSEDED.**

## Why superseded

**Owner decision (2026-07-07):**
> «Сначала ИДЕАЛЬНО сделать Авраама. ... Наша ошибка — наплодили карт, это карты-баги-заглушки, а не карты. Нужно их и оставить ими и работать с Авраамом.»

The owner's strategic redirection is **opposite** to the original actionable plan:
- Original: "Phase 1 → activate 8 placeholders"
- New: "Phase 0 → freeze 8 placeholders (keep as-is)"

## What is NOT being superseded (preserved)

- The **technical finding** that 8 routes are placeholder without UI: STILL VALID
- The **evidence** (JSON-LD description, file:line, grep outputs): STILL VALID
- The **severity reclassification P1→P3**: STILL VALID (placeholder is intentional, not regression)
- The **cross-link** to BUG-SITEMAP-8-KARTY-MISSING: STILL VALID
- The **observation** that ishod = canonical pattern: STILL VALID (but not "for activation", for "future template")

## What is being added (new plan)

See `STRATEGY.md` for full 6-phase plan. Summary:

| Phase | KARTY-01 (8 placeholders) |
|-------|---------------------------|
| 0 FREEZE | DO NOTHING. Keep frozen. |
| 1 AUDIT | (not applicable to placeholders) |
| 2 ENGINE DESIGN | (not applicable) |
| 3 REWRITE | (not applicable, only Авраам) |
| 4 TEMPLATE | Document template (so 2nd map can be made **later**, only if owner approves) |
| 5+ SCALE | Future. Not in this plan. |

## Recommendation for verifier

When merging findings from this intake:
1. **Keep** KARTY-01 as `proposal-confirmed` (technical finding valid)
2. **Update** its `repair_lane` from W9 to DEFERRED (or "Phase 5+ if owner approves")
3. **Mark** as `proposal-superseded` in MASTER_BUG_MATRIX (or equivalent mechanism in current matrix)
4. **Link** this comment + STRATEGY.md as evidence
5. **Do NOT** add to active queue (no action in next 6-8 months)

For BUG-SITEMAP-8-KARTY-MISSING:
- Keep as RESOLVED (intentional noindex)
- Add comment: "Confirmed by strategy intake 2026-07-07"

## Cross-agent note

`incoming/arena-agent-karty-audit/2026-07-07/` (this same author, 4 hours earlier) proposed the OPPOSITE strategy. The change is not "wrong" — it's "owner redirected strategy in 4 hours". Future agents should treat the strategy intake as canonical, the audit intake as evidence.

---

— arena-agent-karty-strategy, 2026-07-07
**Supersedes:** KARTY-01 actionable plan (technical finding preserved)
**Source HEAD:** 75f807b73
