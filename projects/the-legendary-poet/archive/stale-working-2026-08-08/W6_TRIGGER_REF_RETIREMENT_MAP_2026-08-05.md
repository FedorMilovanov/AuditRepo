# W6 trigger-ref retirement map — final reconciliation — 2026-08-05

## Verdict

The fifteen `agent/marathon-*trigger*` refs are confirmed temporary same-repository transport branches. Their PRs #287–301 are closed/unmerged and each PR diff is a one-shot trigger file. Durable product work was integrated through separate production PRs and remains in current source production.

## Exact map

| Branch | PR | Exact head | Disposition |
|---|---:|---|---|
| `agent/marathon-audit-trigger-20260805` | #287 | `76b8ccd23a33bf5741719c6aa9e90a91940a59a7` | `RETIRE_READY` |
| `agent/marathon-audit-trigger2-20260805` | #288 | `06545dda727503c1ce4a71bb93b51777f739f959` | `RETIRE_READY` |
| `agent/marathon-audit-trigger3-20260805` | #289 | `5f93f24f76714896e29eaa08efa84cf402e4db7e` | `RETIRE_READY` |
| `agent/marathon-audit-trigger4-20260805` | #290 | `c6b970902664b72f5473d7596b17983177574f06` | `RETIRE_READY` |
| `agent/marathon-audit-trigger5-20260805` | #291 | `f4a0a718a82926a40256ae5ab02c61b672da4a4c` | `RETIRE_READY` |
| `agent/marathon-audit-trigger6-20260805` | #292 | `6be2422c40eadec003ac6e761c78efc637e61d2c` | `RETIRE_READY` |
| `agent/marathon-audit-trigger7-20260805` | #293 | `f449c6e72f3865c1aa8a851f5991a049d72ca994` | `RETIRE_READY` |
| `agent/marathon-audit-trigger8-20260805` | #294 | `705c91da514e7e34dbfa935c29f4d1c1e57a3664` | `RETIRE_READY` |
| `agent/marathon-clean-security-trigger-20260805` | #295 | `9da460da562d8b296d15b7875f738fbc3ce47dda` | `RETIRE_READY` |
| `agent/marathon-dependency-trigger-20260805` | #296 | `eefba29f2cc63819f18e45c54ffb16d5b2280115` | `RETIRE_READY` |
| `agent/marathon-dependency-trigger2-20260805` | #297 | `7b01bdc799b9c099b78fda220b3f2036681de7aa` | `RETIRE_READY` |
| `agent/marathon-router8-trigger-20260805` | #298 | `00f1805a3cb4f2d82e095c90b9e8bf5753e3335d` | `RETIRE_READY` |
| `agent/marathon-router8-direct-trigger-20260805` | #299 | `97497b04840916786db216b912d5bcdfff1b8ce4` | `RETIRE_READY` |
| `agent/marathon-router8-react-compatible-trigger-20260805` | #300 | `13f67afb159b6d40c637b76fc3cab1010463d4cf` | `RETIRE_READY` |
| `agent/marathon-router8-semver-trigger-20260805` | #301 | `f962fcd01baa76683ea958b5f898db175b7d7490` | `RETIRE_READY` |

## Durable successor

The trigger refs do not own product history. Their durable marathon result was integrated through source #286/#302 and then retained and strengthened by W0–W6 production waves through source #324 production `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97` and the isolated governance successor.

The old integration base `agent/marathon-audit-integration-20260805` is already absent. This map preserves the remaining trigger identities before deletion.

## Deletion gate

All fifteen refs have passed code/evidence extraction barriers. Before physical deletion:

1. verify each head still matches the table;
2. verify no open PR uses the ref;
3. retain this map in merged AuditRepo PR #185;
4. use an authorized delete-ref operation;
5. re-list source branches and prove absence;
6. never force-move a trigger ref to `main`.

## Status

`15/15 TRIGGER REFS = EXACTLY MAPPED / RETIRE_READY / PHYSICAL DELETION OUTSTANDING`.
