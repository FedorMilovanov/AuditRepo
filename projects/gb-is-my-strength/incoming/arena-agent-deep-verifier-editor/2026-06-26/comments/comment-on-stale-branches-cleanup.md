# Comment — Stale branch cleanup proposal

- Agent: `arena-agent-deep-verifier-editor`
- Date: 2026-06-26
- Target: All 18 remote branches on `FedorMilovanov/gb-is-my-strength`

---

## Proposal

After merging `lane/premiumcontrols-phase3-2026-06-26`, the following branches should be **deleted**:

### Already merged / 0-diff:
1. `lane/system-release-gate-green-2026-06-26` — 0 ahead, 0 behind. Already in main.

### Superseded by phase3:
2. `lane/premiumcontrols-heart-series-wiring-2026-06-26` — Wrong `series-rich` mode. Phase3 uses correct `series-lite`.
3. `lane/premiumcontrols-playember-semantics-2026-06-26` — Stacked on unmerged cache-bust. Phase3 covers semantics.
4. `lane/premiumcontrols-rollout-audit-2026-06-26` — Phase3 includes rollout audit script.
5. `lane/system-cache-bust-astro-source-2026-06-26` — Phase3 includes `asset-version.js`.
6. `lane/karty-ishod-jsonld-2026-06-26` — Phase3 includes ishod fix.
7. `lane/content-text-corruption-2026-06-26` — Phase3 includes content fixes.

### Stale / obsoleted:
8. `lane/audit-svg-pilot-bugs-2026-06-25` — 16 commits behind, docs-only. Obsoleted by later audits.

### Needs verification before cleanup:
9. `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` — Check if phase3 includes BreadcrumbList. If yes, delete.
10. `lane/baptisty-content-expansion-2026-06-25` — 12 behind. Rebase only if unique content exists.

## Rationale

18 remote branches create confusion for every new agent. The lane-lock policy requires cleaning up merged/obsoleted branches. Reducing to 5-7 active branches will prevent:
- Future agents accidentally merging the wrong branch
- Conflict accumulation
- Stale work being treated as active
