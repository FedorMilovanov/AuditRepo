> **CURRENT DESIGN / HANDOFF: [V25](v25/README.md) · [interactive V25 HTML](v25/REFERENCE-V25.html) · [V25 safe rollout](v25/PRODUCT-ROLLOUT-V25.md).** Original V24/V23 below are historical comparisons. Product Library V3 #2283 is merged. Product deployment workflow on exact head 717efc5 succeeded; real public release SHA remains to be independently confirmed.

> V23 content below is retained as historical provenance, NOT the current instructions.

# Grok Desktop Reader V23 — handoff and definitive reference

**Date:** 2026-11-06. **Product:** FedorMilovanov/gb-is-my-strength (gospod-bog.ru). **Status:** standalone design/QA witness; not merged into Product, not a production release.

## Read in this order

1. [REFERENCE-V23.html](REFERENCE-V23.html) — full self-contained interactive HTML, the CURRENT reference.
2. [DESIGN-AND-HANDOFF.md](DESIGN-AND-HANDOFF.md) — owner-approved design decisions, original UI elements to preserve.
3. [INTEGRATION-PLAN.md](INTEGRATION-PLAN.md) — small non-destructive Product pilot, owners and rollback.
4. [QA-AND-HISTORY.md](QA-AND-HISTORY.md) — V22→V23 fix, actual browser results, historic regressions.
5. [NEXT-AGENT.md](NEXT-AGENT.md) — exact start instructions for a fresh chat.
6. [legacy/v22-final-reference.html](legacy/v22-final-reference.html) — previous exact HTML reference for comparisons.

## Essential distinction

We are NOT replacing the current site, reader engines, library, search, print, TTS or mobile navigation. We are adopting the selected Grok-style *desktop* table-of-contents presentation inside existing Product-owned wrappers. Book/series theme styles differ; the tree and control behavior are shared.

Product is the sole authority for current main, branch/PR ownership, releases, live pages, headings and real component behavior. AuditRepo stores the requested design and evidence. Recheck Product before every implementation.

The 2026-11-06 snapshot found Product PR #2283 (reader library v3) touching reader wrappers and PR #2269 covering print. Do not race those owners. AuditRepo PR #521 touched the GB active MASTER; this reference intentionally does not edit MASTER.

**Visual screenshot recreation:** open REFERENCE-V23.html in Chromium at 1480×900, 900×480 and 320×640; switch Book/Cycle/Article, Day/Sepia/Night, expand/compact rail, and open settings. The screenshots inside the preceding chat were autonomous-HTML evidence, not a production parity baseline.