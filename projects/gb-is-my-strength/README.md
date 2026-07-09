# gb-is-my-strength / gospod-bog.ru

**Status:** 🟢 active / repair-in-progress / reverify-needed for older systemic backlog  
**Current source HEAD checked:** `30d9fb61fe2c9116ee53a54d681c01455eef4fe6` (2026-07-09)  
**Initial Gill V10 baseline:** `ac26d8efa2b952df6dc46eef05908e6d65287e82`  
**Source repository:** `FedorMilovanov/gb-is-my-strength`

## Start here — current truth

1. `verified/START_HERE.md` — owner and next-agent handoff at current source HEAD.
2. `verified/MASTER_BUG_MATRIX.md` — canonical operational matrix.
3. `incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md` — official current-head Gill V10 intake.
4. `incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md` — detailed Gill architecture/content research baseline.
5. `incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_30d9fb61.md` — PR #50 delta and restored-figure finding.
6. `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting systemic backlog tied to old SHA; reverify each item before implementation.

## Current matrix summary

| Category | Count |
|---|---:|
| Historical closed/fixed | 90 |
| P0 open | 6 |
| P1 open | 6 |
| P2 open | 11 |
| P3 open | 19 |
| Refactoring | 4 |
| AuditRepo | 3 |
| **Active items** | **49** |

The six P0 rows are Gill-series structural publication blockers, not a claim that the entire production site is unavailable.

## Current-head change during the audit

Source `main` advanced from `ac26d8e` to `30d9fb61` through Merge PR #50, restoring two Gill Part III illustrations. The article body itself did not change, so the original V10 structural findings remain current.

New scoped P2:

```text
GILL-V10-RESTORED-FIGURE-RELOCATION
```

The figures are server-rendered after the article and moved client-side by heading/prose anchors. This needs a browser/Pagefind/print witness and should ultimately be replaced by direct semantic placement.

## Current priority tracks

### Gill series V10

Required order:

```text
canonical content graph
→ series manifest
→ outline / Reader AST
→ content ownership and relocation
→ Part III cleanup
→ Research canonical brief
→ Part IV authoring
→ atomic six-document publication
```

Do not publish Part IV as an additive page: Parts II–III already contain most of its doctrinal scope.

### TTS model lifecycle

`TTS-DL-CONSENT` remains an owner UX decision. Save-Data is mitigation, not explicit consent. Do not mix the neural-model delivery lane with Gill content work.

### Older systemic backlog

`SUPER_AUDIT_2026-07-06_14a49be8.md` remains useful evidence for release transaction, editorial dates, SW/cache, route registries, security, Bible corpus and semantic gates. Its wording is not automatically current at `30d9fb61`; reverify first.

## Project rules

- SHA-first; source claim without immutable SHA is not repair-ready.
- One subsystem per source PR.
- Astro↔legacy parity is not proof of content correctness.
- A green workflow step is not proof unless its failure path is strict and the checked/deployed SHA is explicit.
- Do not rewrite or delete another agent’s `incoming` evidence.
- Old canonical documents are indexed under `archive/stale/`; active entrypoints must not preserve multiple competing truths.
- Update AuditRepo atomically with source repair: matrix row, evidence, reverify and canonical handoff.

## In-flight / owner-coordination zones

- Gill editorial ownership and Part IV scope.
- PremiumControls/Floating Cluster visual behavior.
- TTS consent and large-model lifecycle.
- Glossary/Bible tooltip data.

Infrastructure may be audited, but owner-facing behavior or content should not be changed without coordination.

## Historical note

The former project README mixed 2026-07-06 status banners with later TTS incident history and no longer represented one current truth. It remains available in Git history at AuditRepo base commit `18713174a343740cc0886df6c6441c51bde61274` and is indexed in `archive/stale/2026-07-09-pre-gill-v10/README.md`.