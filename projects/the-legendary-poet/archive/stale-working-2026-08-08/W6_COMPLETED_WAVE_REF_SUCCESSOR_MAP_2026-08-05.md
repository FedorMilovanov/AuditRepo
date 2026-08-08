# W6 completed-wave source ref successor map — final — 2026-08-05

## Rule

Each surviving old source ref below has a stronger exact tested production successor. It must not be merged again. `RETIRE_READY` does not claim physical deletion.

Current source production retaining all successors: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

## Exact surviving refs

| Remote ref | Historical PR / head | Durable production successor | Disposition |
|---|---|---|---|
| `audit/discovery-artifact-contract-20260805` | source #304 / `27e006a8f30f3d9e4298d42341f233db27b5ef66`, closed unmerged | fresh-base #305 → `44a36bdb97e22827b2026e5622b79a6908d7af03` | `RETIRE_READY` |
| `audit/content-model-unification-wave2-20260805` | #306 / `53e7168aaf5b6c6351a7e45658666f1de52f3ec9`, closed unmerged | #308 exact head `efb097c158f2015c7312ed35492caee2f72f281d` → `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8` | `RETIRE_READY` |
| `audit/immutable-essay-publication-w2-20260805` | #309 / `2d11c8e6075c6463bf27bd0de8df73b493b17341`, closed unmerged | synthesized #311 exact head `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3` → `a248abd54007bd839ffc149b9195dc4e79dc5dd3` | `RETIRE_READY` |
| `audit/immutable-essay-publication-20260805` | #310 / `d076373e8adfd3f5730d5ccb01ece87d5959f375`, closed unmerged | same #311 successor `a248abd54007bd839ffc149b9195dc4e79dc5dd3` | `RETIRE_READY` |
| `audit/community-scaling-w3-20260805` | #312 / `76ea1768278571497459ced5b97f0ef2bb5c7052`, closed unmerged | final #316 → `4544bb387108a98641313267beafe29deb71ee81` | `RETIRE_READY` |
| `audit/community-target-scaling-w3-20260805` | #313 final `f85aba5803ecc5643b39a5ee4081da86e0174997`, closed unmerged | #316 was built directly from that durable source and merged as `4544bb387108a98641313267beafe29deb71ee81` | `RETIRE_READY` |
| `integration/community-target-scaling-w3-final-20260805` | transfer #314; #315 later closed after Git-only divergence | fresh final #316 exact head `a810a2a9bdcf9a150c73d4adea703e95ae6bd71a` → `4544bb387108a98641313267beafe29deb71ee81` | `RETIRE_READY` |
| `integration/community-w3-hardening-production-20260805` | #319 / `253376bd8107471e1641027d892ac5207c18f73a`, redundant closed integration | same exact head merged through #317 → `d03f09188cd0360c6c984ed93d03b1432913332c` | `RETIRE_READY` |
| `audit/premium-browser-certification-w5-20260805` | source #320 head `e3991b71eb2c7b5056961b2b458ac9feed00058f`, closed evidence-only | synthesized W5 #322 exact head `0536547e178fb091de1a76c85aecec4409478975` → `6f13600ba88f08123c8c1b817ffdc0ca3dec0bc0` | `RETIRE_READY` |
| `audit/premium-reader-journeys-w5-20260805` | source #321 head `2dbb10b20b4b0f3abe963e59109133d60aa3bb98`, closed evidence-only | same #322 successor `6f13600ba88f08123c8c1b817ffdc0ca3dec0bc0` | `RETIRE_READY` |
| `agent/current-state-truth-contract-20260805` | source #323 head `6c9cf17871bcaec3aeb9718a3c573d215be65552`, closed unmerged after W5 changed truth | post-W5 rebuild #325 exact head `c73cdcb35d30091264db5bf8c1db1c2b0cd46135` → `db6bc3ea8997f78d1370a05e2736cf20645c80dd` | `RETIRE_READY` |

## Retained production chain

All successors remain present in later production:

- verified-media source #324 exact head `6146e6f5da81c7904fd1bb135c22a409f3e12719` → `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`;
- governance source #326 exact head `e3a1a877ebb14eb2e163b14995ded592cf553909` → current production `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

## Historical transfer nuance

The W3 transfer history must not be simplified into a false code-loss claim. PR #314 transferred an earlier source state; the working source advanced; PR #315 collided only in Git history; final #316 started directly from the final durable source head. No old transfer ref retains unique production code.

## Deletion gate

Before physical deletion, re-read each ref head, verify there is no open PR, preserve this map in merged AuditRepo PR #185 and use an actual delete-ref operation. Force-moving a ref is forbidden.

## Status

`11 COMPLETED/SUPERSEDED SOURCE REFS = EXACT SUCCESSOR MAPPED / RETIRE_READY / NOT PHYSICALLY DELETED`.
