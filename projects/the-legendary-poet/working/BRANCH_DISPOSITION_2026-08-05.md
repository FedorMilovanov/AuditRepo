# Remote branch disposition — The Legendary Poet

Current production: `4544bb387108a98641313267beafe29deb71ee81`.

| Branch / class | Graph result | Disposition |
|---|---|---|
| `arena/019fcf76-thelegendarypoet` | diverged, old merge base; selective value already used in #286 | evidence-only; no merge; delete after archive pointer |
| `arena/019fcf77-thelegendarypoet` | diverged; broad integration source of #286 | evidence-only; no merge; delete after archive pointer |
| `agent/marathon-audit-trigger*` | temporary one-shot runners/markers | never merge; batch delete after this ledger is verified |
| `agent/marathon-clean-security-trigger-20260805` | temporary verification trigger | never merge; delete |
| `agent/marathon-dependency-trigger*` | temporary dependency verification | superseded by #286/#302; never merge; delete |
| `agent/marathon-router8-*trigger*` | temporary router migration verification | superseded by production Router 8; never merge; delete |
| `work/local-images-playwright-wtoc` | deeply diverged, 787 ahead / 739 behind in audit snapshot | do not merge. Extract unique research/provenance/media/E2E artifacts by path and current-head relevance, then archive/delete |
| `audit/system-contract-wave1-20260805` | source #303 merged to production `69e5d39` | evidence-only after merge; do not re-merge |
| `audit/discovery-artifact-contract-20260805` / source #304 | old-base discovery proposal | closed unmerged; superseded by fresh-base #305 |
| `audit/discovery-artifact-contract-v2-20260805` | source #305 merged to production `44a36bd` | evidence-only after merge; do not re-merge |
| `audit/content-model-unification-wave2-20260805` | stale parallel W1 branch | source #306 closed superseded; durable content integrated and hardened by #308; no separate merge |
| `integration/content-model-after-discovery-20260805` | W1 integration branch, source #307 then #308 | production content merged as `e06bdfc`; evidence-only after merge |
| `audit/immutable-essay-publication-w2-20260805` | first W2 implementation, source #309 | closed unmerged after overlap; evidence incorporated into #311 |
| `audit/immutable-essay-publication-20260805` | parallel W2 implementation, source #310 | closed unmerged after overlap; strongest invariants incorporated into #311 |
| `integration/immutable-essay-publication-w2-20260805` | single W2 production integration, source #311 | squash-merged as production `a248abd`; evidence-only after merge |
| `audit/community-scaling-w3-20260805` | first W3 implementation, source #312 | closed unmerged after stronger parallel lane appeared; evidence-only, never merge separately |
| `audit/community-target-scaling-w3-20260805` | parallel W3 working lane, source #313 | closed unmerged; exact durable head `f85aba58` was used as the base of final production #316 |
| `integration/community-target-scaling-w3-final-20260805` | non-production exact-head transfer through #314 | superseded integration history; no production merge and no separate re-merge |
| source #315 transfer lane | second non-production transfer collided only in Git history | closed unmerged; no code loss; replaced by fresh exact-head final integration branch |
| `integration/community-scaling-w3-final2-20260805` | final W3 production lane, source #316 | squash-merged as production `4544bb3`; evidence-only after merge |

## Retirement barrier

Before deletion of the deeply diverged work branch, record:

- research/provenance files absent from production;
- approved or rejected image binaries and their hashes;
- E2E tests whose user outcomes are not covered on main;
- explicit decision for every unique path: extract, archive pointer, or reject as stale.

Trigger branches require no code extraction when their PR body and diff prove one-shot infrastructure only. Merged or superseded audit/integration branches require an archive pointer to their PR and production merge before deletion.
