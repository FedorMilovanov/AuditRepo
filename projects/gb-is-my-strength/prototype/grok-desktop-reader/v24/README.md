# Grok Desktop Reader V24 — canonical handoff (2026-11-06)

**Status: desktop prototype / integration candidate, NOT deployed in Product.** V24 supersedes V23 as the current visual reference; leave V23 and `legacy/v22-final-reference.html` untouched as forensic assets.

## Reading order for a new agent

1. [REFERENCE-V24.html](REFERENCE-V24.html) — exact interactive book / cycle / standalone prototype; demo text/logic, not Product source.
2. [DECISIONS-V24.md](DECISIONS-V24.md) — visual and semantic contract, protected Product owners.
3. [QA-V24.md](QA-V24.md) — reproduced repairs, browser evidence and limitations.
4. [PRODUCT-ROLLOUT-V24.md](PRODUCT-ROLLOUT-V24.md) — additive rollout, risk gates, rollback.
5. [NEXT-AGENT-V24.md](NEXT-AGENT-V24.md) — direct handoff prompt.

AuditRepo source rules: [operating model](../../../../AUDITREPO_OPERATING_MODEL.md) (use actual repository root path when browsing), `projects/gb-is-my-strength/DOC_MAP.md`, `verified/MASTER_BUG_MATRIX.md`, `CONCURRENT_EDIT_PROTOCOL.md`. The reference pack is not another active problem matrix.

## Verified V24 delta vs V23

- Corrected stale dynamic left label `V22` → `V24`.
- Relaxed full/compact rail opacity crossfade while keeping interruptible 335→68 px elastic width (design reference only).
- When closing an accordion that contains keyboard focus, focus returns to the exact disclosure trigger **before** applying `inert`.
- Arrow-key navigation excludes links whose ancestors are inert, hidden or aria-hidden even while their collapsing CSS box still has a nonzero rect.
- Zero-match Enter no longer navigates to an unrelated first item.

## Product truth is not inherited from a demo

Product [#2283](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2283) **merged** at `main@717efc54772edf4224f44254651c102e2af24129` (2026-11-06), adding local Library V3 and reading status. Recorded CI snapshot had 25 successful, five in progress, five skipped diagnostic and one cancelled push workflows; this is **not terminal green or live proof**. Refresh exact current CI/live state before touching Product. Print [#2269](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2269) is an independent open lane. No Product changes made in this AuditRepo pass.
