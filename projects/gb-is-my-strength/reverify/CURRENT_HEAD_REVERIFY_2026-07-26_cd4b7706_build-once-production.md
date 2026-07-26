# CURRENT HEAD REVERIFY — 2026-07-26 — `cd4b7706` build-once production convergence

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `cd4b77068fabfde05487859f2178ea89ad9b2e43`
- Exact production/live authority: `cd4b77068fabfde05487859f2178ea89ad9b2e43`
- AuditRepo base before reconciliation: `a8f566c2757e2878831d23fe32adb3a8d1506d2e`
- Release PR: source PR #370
- Homepage lifecycle PR: source PR #405
- Permission-policy PR: source PR #374
- Genesis owner: source issue #362; manuscript theme is dormant and route activation remains unshipped

Source, candidate, Pages promotion, live acceptance and downstream projection are separate authorities. This reconciliation advances production authority only because each layer independently binds the same exact SHA and candidate identity.

## Homepage lifecycle residual closure

PR #405 squash-merged as `cc2e829fe738d3d62322cf3c5c61dab895e3490e` with one permanent product-test file.

Exact head `88d17334ec13271c42fe4773308cbd23a4ab4d0f` passed:

- Runtime Interactive Audit `30196286302`;
- Shared Files Guard `30196286327`;
- browser artifact `8630244568`, `sha256:a92dde7ab47e2b669c131c4acd5ebe606e64adb2f92ba49347218f0772ef1a57`.

The accepted contract is capability-aware and fail-closed:

- Chromium must admit BFCache, emit coherent persisted events and preserve the exact in-memory document token;
- Playwright WebKit may use BFCache, but when the engine reports `persisted:false`, it must prove coherent `back_forward` navigation, a new document token, restored theme/menu/scroll state and all runtime, shortcut, Pagefind and back-to-top assertions;
- incoherent lifecycle events, wrong token behavior, non-history navigation, runtime/Pagefind errors or UI-state drift remain blocking.

No retry, waiver, product runtime edit or workflow edit was merged.

## Source acceptance for build-once release

PR #370 final exact head `5282bbf203494e39c863cf92230ad298cba1000f` was one commit over `90a888cddc91988cfe06586b5d1f8b99d1846344`, 20 permanent release/control-plane files, zero unresolved review threads.

Exact-head checks:

- Shared Files Guard `30211064671`;
- Editorial Metadata v3 `30211064653`;
- TTS Download Consent `30211064656`;
- Visual Parity Guard `30211064652`.

Exact-head artifacts:

- control-plane `8634462060`, `sha256:09eafa0d444ed4816cc6a7d88d6587c4e8c1582df8a7244e3cdf5385ee3ad957` — 28 workflows, 152 package scripts, 706 static local references, 42 explicit-permission jobs, 5 registered privileged jobs, 0 issues/warnings;
- editorial `8634488007`, `sha256:44cdebdff472c8b7f2435edc10886ceb7f595dc054a9168f0595b1e035054ff2`;
- TTS source/mutations `8634462495`, `sha256:162033acfc9aba30aa91908ae484130ecc4c320fce53f02730afa72f640f89c8`;
- TTS browser/routes `8634512622`, `sha256:8cd7c3912170bae8f51cb5828c3b085d29ea3df3bf5ccb19fb6799908555c1b5`;
- visual parity `8634536002`, `sha256:20eb1107d82ba0c890beac328ac325b4d01c83c55108ab0dd3a261b3aa2a27d2`.

PR #374 / `90a888cddc91988cfe06586b5d1f8b99d1846344` separately established fail-closed effective permissions, exact privileged action identities and the machine-readable writer registry. Issue #301 is closed; broader shadow-era policy issue #64 remains open.

## Exact production authority

PR #370 squash-merged as `cd4b77068fabfde05487859f2178ea89ad9b2e43`. Automatic production run `30211404138` attempt 1 completed both jobs successfully.

### Readiness — one build

Job `89818133255`:

- checked out exact release source;
- proved release/control-plane Git boundary;
- used Node `22.12.0` and npm `10.9.0`;
- ran exactly one `npm ci` and one production-like `dist` build;
- passed static publication, ownership, Pagefind, visual, URL, JSON-LD/schema, Gill, Chromium runtime, content coverage and Service Worker gates;
- staged verifier tools from the trusted control-plane SHA;
- wrote and verified immutable release provenance;
- uploaded candidate artifact `8634711632`.

### Promotion — same bytes

Job `89819636301`:

- downloaded exact same-run candidate;
- verified repository, release SHA, control-plane SHA, run/attempt and candidate digest;
- uploaded Pages artifact `8634714712` and deployed it;
- performed no checkout, `npm ci`, source validation or build;
- passed generic live acceptance before TTS live acceptance.

### Candidate and artifacts

- Candidate ID: `cd4b77068fabfde05487859f2178ea89ad9b2e43:30211404138-1`
- Candidate tree digest: `sha256:0f1780b179b6dce95dbebb8427a3e44441709d03c3a576afa1234fe86681b1a4`
- Candidate tree: 1,110 files, 78,985,779 bytes
- Candidate transport artifact: `8634711632`, 79,229,089 bytes, `sha256:577aa82418448aa77199f9a9ac928e5836dee716a2a3624c6ee7a0a6996cc5c3`
- Pages artifact: `8634714712`, 63,134,932 bytes, `sha256:cc66d911666ab7536fb04b62a4c1e2fb8521b4d5a1b46e55dce15eb3d37f1750`
- Generic live artifact: `8634715957`, `sha256:f669aecd843e0d661dd66a0b4e4ca39ec9e2a14120ade63762ef6fab288ab8fc`
- TTS live artifact: `8634716211`, `sha256:78cf2c0daaaf21790316f8d36e8f5c7585b45540f81c2da79c89e944c20ce413`
- Current pointer: `/deployments/current.json`
- Immutable provenance: `/deployments/cd4b77068fabfde05487859f2178ea89ad9b2e43/30211404138-1.json`

The generic live witness verified exact live bytes for `/`, sitemap, feed, Pagefind and Service Worker, plus pinned build/route-registry identities. The TTS extension witness verified both named routes, controller/engine/CSS hashes and `lazyTtsPrecache=false`.

## Downstream ledger

Deployment Witness Ledger accepted comment `5084526211` on PR #370 with marker:

`deployment-release-witness:cd4b77068fabfde05487859f2178ea89ad9b2e43:cd4b77068fabfde05487859f2178ea89ad9b2e43:30211404138:1:8634711632:8634715957:8634716211`

The machine envelope is schema v3, event `push`, and binds:

- `releaseSha = cd4b77068fabfde05487859f2178ea89ad9b2e43`;
- `controlPlaneSha = cd4b77068fabfde05487859f2178ea89ad9b2e43`;
- candidate tree digest `sha256:0f1780b179b6dce95dbebb8427a3e44441709d03c3a576afa1234fe86681b1a4`;
- exact candidate transport ID/digest;
- generic live PASS and TTS extension PASS from the same repository/run/attempt.

This is the required proof that readiness validated and Pages promoted one exact candidate.

## Status transaction

Closed in `MASTER_BUG_MATRIX.md`:

- `HOME-BROWSER-LIFECYCLE-RESIDUAL`;
- `CI-BUILD-VALIDATION-DUPLICATION`;
- `DEPLOY-PROVENANCE-TTS-COUPLING`;
- `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP`.

Counters:

- fixed `160 → 164`;
- P1 open `101 → 97`;
- total open `196 → 192`;
- P0/P2/P3/refactoring/AuditRepo counts unchanged.

After this AuditRepo reconciliation merges, source issues #292, #295 and #299 may close completed. Genesis issue #362 remains open; neither dormant theme registration nor this production witness activates the Genesis routes.
