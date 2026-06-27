# Branch Closure Ledger — 2026-06-27

Owner request: «мерджи все ветки, и конфликтующие и регрессирующие убери или
доправь, чтобы все зеленое было и ветки чтобы все закрыты были».

All decisions cross-checked against AuditRepo
`PremiumControls/reports/REMOTE_BRANCH_AUDIT_2026-06-27.md` and
`incoming/arena-surgical-surgeon/2026-06-27/DEEP_SURGICAL_PREMIUMCONTROLS_MASTER_ANALYSIS`.

| Branch | Decision | Reason |
|---|---|---|
| lane/gill-parts-v16-converge-2026-06-27 | **MERGED to main** | my clean all-parts v16 converge (b00ca5b6) |
| lane/branch-convergence-cleanup-2026-06-27 | **MERGED to main** | GILL-C safety net + Abraham text layer + docs |
| lane/shared-genealogy-multiparent-2026-06-27 | **MERGED to main** | matriarch multi-parent edges (latent repair) |
| lane/system-premiumcontrols-* (3) | **MERGED to main by other agents** | AGENTS §2/§3.10, workflows parity, izbrannoe, fonts |
| lane/system-release-gate-green-2026-06-26 | **DELETE** | empty (0 commits ahead of main) |
| lane/tts-russian-voice-and-pause-2026-06-27 | **DELETE** | superseded; merge would revert HOVER_CAPABLE |
| lane/gill-part1-v16-converge-2026-06-27 | **DELETE** | superseded by all-parts converge; dirty (scratch files) |
| lane/gill-mobile-head-fix-2026-06-27 | **DELETE** | superseded (parts now v16, no gbs2-mobile-head); GILL-A already on main |
| lane/floating-cluster-guards-2026-06-27 | **DELETE** | GILL-C CSS + docs cherry-picked clean into main |
| lane/karty-avraam-indexable-text-layer-2026-06-26 | **DELETE** | better source-cited text layer applied clean to main |
| lane/baptisty-content-expansion-2026-06-25 | **DELETE** | edits src/content/articles MDX that baptisty routes do NOT render (pages use *Body.astro). Zero live effect + body/strip reading-time mismatch. Content preserved in this archive for a future editorial lane if owner migrates baptisty to MDX. |
| lane/audit-svg-pilot-bugs-2026-06-25 | **DELETE** | docs-only; findings (rail not sticky, mobile bar not fixed, false-green audit) all fixed by v16 converge GILL-F. Research doc archived here. |

After this pass: only `main` remains (all lanes closed).
