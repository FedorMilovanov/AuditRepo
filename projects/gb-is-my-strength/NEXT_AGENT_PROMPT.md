# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo base incorporated before this transaction: `058c952fee0a0c5fffdca1e4175bbd6a669043d1`.
- Product current source anchor: `76737eefe16a0feb2fdf729c805d17b5cdcdc376` (advisory strangler duplicate inventory, PR #1082).
- Product exact tested head: `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`.
- Product rollback anchor before that transaction: `3d907194d81eee1227a4fc9ad6f037773d19a1ec`.
- Production authority remains unchanged: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778` attempt `1`.
- Candidate: `38b257030afb7cfa8a7b1128f8c86539fd36dec0:30960174778-1`; digest `sha256:973369f7753f89b9a4fae4d19f523f89aa2a50808a0d11cbe8448e79b793c9ef`.
- Current canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-06_76737eef_strangler-duplicate-inventory.md`.

## Canonical matrix

- **376 total = 231 closed + 145 open**.
- Open severity counts: P0 `0`, P1 `69`, P2 `26`, P3 `40`, refactoring `7`, AuditRepo `3`.
- `D-22` and `REFERENCE-TRANSFER-GOVERNANCE` remain closed-current from Product `3d907194`.
- `HOME-P3-FOOTER-EDGE-CONSOLE` remains open and separate.
- `R-005`, `R-006`, `R-007` remain non-blocking measured directions.
- `R-007` and `STRANGLER-HYGIENE` now use exact current inventory rather than the stale approximate `50/53` claim.

## Current strangler inventory truth

Product PR #1082 added `scripts/strangler-duplicate-inventory.mjs` to the existing Shared Files Guard legacy-inventory step. It reads canonical `migration/page-ownership.json`; it does not create a second ownership registry.

Exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae` found:

- public `index.html`: **52**;
- Astro-owned `native-shadow`: **51 files / 4,026,027 bytes**;
- explicit built app: **1 file / 2,245,854 bytes**;
- unowned public indexes: **0**.

The only independent built app is `/konfessii/russkij-baptizm/_app/`. It must not be counted as a removable legacy duplicate.

Artifact `8953474789`, digest `sha256:721c63f3cc545a749c6ce8659a467a346e18342bafcdc9436232daeb9b7163d0`, contains the exact JSON and Markdown inventory.

## Why the 51 shadows cannot be deleted directly

Current `scripts/legacy-shadow-wrapper-audit.js` dynamically uses every committed legacy `index.html` for an Astro production-dist route as active parity evidence. It checks canonical URL, metadata/H1, noindex disposition, route-specific markers and retained reader-text ratio.

Consequently:

- inventory is **not** deletion authority;
- current deletion-ready count is **0**;
- a retirement lane must first move parity/reference authority for one bounded route or family to another immutable owner;
- equivalent source, production-like dist and browser evidence must pass before deleting the old shadow;
- do not weaken or bypass `legacy-shadow-wrapper-audit.js` merely to reduce file count.

## Exact-head evidence for Product PR #1082

- Shared Files Guard `31064874211`: success.
- Node Toolchain Contract `31064874215`: success.
- Metadata & IndexNow Readiness `31064874238`: success.
- Inventory self-test covered native-shadow, built-app, built-app descendant and unowned classification.
- Final Product merge: `76737eefe16a0feb2fdf729c805d17b5cdcdc376`.

No production or live-deployment claim follows from this source transaction.

## Reference-transfer operating contract

Product still owns:

- `docs/REFERENCE_TRANSFER_POLICY.md`;
- `data/reference-transfer-contracts.json`;
- `scripts/reference-transfer-contracts.mjs`;
- integration through the existing `owner:ui-guard`.

Transfer modes remain `exact-replica`, `adaptive-approved`, `native-contract`, `legacy-preserve`, `performance-target`, and `inventory`.

Keep the anti-bureaucracy budget intact:

- at most **8** blocking transfer contracts;
- at most **3** delegated guards per contract;
- at most **12** required and **12** forbidden markers per checked file;
- no automatic HTML token/class/selector harvesting;
- new contracts start advisory;
- performance and inventory counts never block unrelated Product work.

## Current bounded lanes

### 1. `HOME-P3-FOOTER-EDGE-CONSOLE`

The Home Design Audit reproduced `[home-footer-contract] footer touches a viewport edge` twice on the prior exact head. Reverify the current harness and exact geometry in a bounded script/Home lane. Do not fix with clipping, `overflow:hidden`, weakened inset assertions or unrelated CSS changes.

### 2. `R-005` — Baptists 3D measured split

- current `_app/index.html` is **2,245,854 bytes** and correctly owned as `built-app` / `copy-as-built-asset`;
- preserve strict-native-app and iframe ownership;
- obtain complete source bytes and dependency boundaries before mutation;
- do not split the one-line app by guessed anchors or add a premature bundle gate.

### 3. `R-006` — route-scoped TTS loading

- coordinate with any active TTS owner before touching the lane;
- prove route ownership and record before/after bundle/browser evidence;
- keep unrelated catalog/landing routes free of the heavy runtime where evidence permits.

### 4. `R-007` — parity-authority migration before retirement

- select one small route or tightly related family;
- prove where the legacy file is used by current parity/source checks;
- move that evidence to a named immutable replacement without reducing coverage;
- run source, production-like dist and applicable browser witnesses;
- only then delete the legacy shadow and update the inventory.

### 5. Search and rights/provenance

- Do not overlap the active/successor work around Product PR #1074 without a fresh ownership check.
- `SEARCH-P2-07` remains blocked on authoritative/licensed corpus and explicit rights/provenance evidence.

## Before any Product mutation

1. Re-read current Product `main`; do not assume `76737eef` remains HEAD.
2. Read Product `AGENTS.md`, `WORK_MODES.md`, lane/branch policy and only the surface-specific referenced rules.
3. Inspect open PRs and active branches before selecting ownership.
4. Identify the current source owner; AuditRepo is evidence, not Product authority.
5. Use one owner, one canonical branch and one PR per bounded task.
6. Avoid temporary workflow/writer loops; use existing guards whenever possible.
7. Run only checks that can fail from the diff, with final witnesses on the exact PR head.
8. Do not move matrix status or arithmetic without current applicable reverify.
9. Do not claim production, publication, rights or live behavior without exact authority.

Complete and clean one bounded lane before starting another.
