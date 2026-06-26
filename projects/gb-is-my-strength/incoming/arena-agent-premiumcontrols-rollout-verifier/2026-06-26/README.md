# Intake — PremiumControls rollout status verifier

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-premiumcontrols-rollout-verifier`
- Role: verifier / researcher / editor
- Date: `2026-06-26`
- Audited main HEAD: `09c2d34aedf3d0a29e19298ffa886e60fea02b87`
- Reference plan: `Полный план внедрения PremiumControls по всему проекту.pdf` (14 pages, owner-supplied canonical plan)
- Build mode: source + git branch-graph + tree-hash verification; **no browser witness** (sandbox lacks `libnspr4.so` for Playwright — see Finding PC-ROLL-07)
- Scope of this intake: **is the PDF plan implemented, at what stage, where are the bugs / inconsistencies**

## Files in this intake folder

- `README.md` — this file
- `REPORT.md` — main report: 7 findings (`PC-ROLL-01`…`PC-ROLL-07`), confirmations, challenges, synthesis
- `evidence/premiumcontrols-unmerged-branch-matrix-2026-06-26.md` — definitive per-branch matrix (tip, fork-point, diff size, files, conflict map) + exact repro commands
- `comments/comment-on-heart-series-mode-enum-PC-002.md` — formal challenge of the `data-fc-mode="series-rich"` choice on lane `premiumcontrols-heart-series-wiring`

## Headline answer to the owner question

> «ТАМ ПЛАН ВНЕДРИЛСЯ ПО PREMIUM CONTROLS?»

**Частично, и только на незалитых ветках.** На `main` (`09c2d34`) плана нет вообще. План внедряется **четырьмя параллельными, взаимно-конфликтующими feature-ветками**, ни одна из которых не смержена. Из 7 фаз плана по-настоящему закрыта только половина Phase 0/2, причём с багом в Phase 1 и тройным перекрытием. Архитектурное ядро плана (`PremiumControlAnchor`, канонический CSS, split geometry) **не начато ни в одной ветке**.

## Status: `intake-pending-synthesis`
