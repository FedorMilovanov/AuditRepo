# Remote branch disposition — The Legendary Poet

Baseline production: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`.

| Branch / class | Graph result | Disposition |
|---|---|---|
| `arena/019fcf76-thelegendarypoet` | diverged, old merge base; selective value already used in #286 | evidence-only; no merge; delete after archive pointer |
| `arena/019fcf77-thelegendarypoet` | diverged; broad integration source of #286 | evidence-only; no merge; delete after archive pointer |
| `agent/marathon-audit-trigger*` | temporary one-shot runners/markers | never merge; batch delete after this ledger is verified |
| `agent/marathon-clean-security-trigger-20260805` | temporary verification trigger | never merge; delete |
| `agent/marathon-dependency-trigger*` | temporary dependency verification | superseded by #286/#302; never merge; delete |
| `agent/marathon-router8-*trigger*` | temporary router migration verification | superseded by production Router 8; never merge; delete |
| `work/local-images-playwright-wtoc` | deeply diverged, 787 ahead / 739 behind in audit snapshot | do not merge. Extract unique research/provenance/media/E2E artifacts by path and current-head relevance, then archive/delete |
| `audit/system-contract-wave1-20260805` | current source repair branch | draft #303; normal PR lifecycle |

## Retirement barrier

Before deletion of the deeply diverged work branch, record:

- research/provenance files absent from production;
- approved or rejected image binaries and their hashes;
- E2E tests whose user outcomes are not covered on main;
- explicit decision for every unique path: extract, archive pointer, or reject as stale.

Trigger branches require no code extraction when their PR body and diff prove one-shot infrastructure only.
