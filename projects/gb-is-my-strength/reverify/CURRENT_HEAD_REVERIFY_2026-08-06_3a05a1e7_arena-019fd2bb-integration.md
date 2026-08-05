# CURRENT HEAD REVERIFY — Agent Arena `019fd2bb` integration

**Date:** 2026-08-06  
**AuditRepo integration base:** `4129a585e8a149911965455ee191b4cba76eda04`  
**Arena source branch:** `arena/019fd2bb-auditrepo`  
**Arena immutable head:** `7f4b609ac8eea8e5a82c9a9fd98fb097694441ca`  
**Arena merge base:** `1392037c4c49a9265ac11bd1f25ac4722bad69fa`  
**Product exact source anchor:** `3a05a1e79bcd7061e9b9c3f98ed3953ae2e8d0c0`  
**Research observed authority:** `c3f7ea27bfc8a10f2369ae90a89107faea8257bf`

## Scope

This reverify classifies and integrates the complete valuable branch without letting stale operational state, malformed canonical edits, or false-green prototypes override current authority.

Rules applied:

- AuditRepo evidence ladder and no-overclaim requirements;
- current-head reverify before status promotion;
- Multi-Witness Verification Protocol;
- Cleanup Retention Policy and Single-Writer-Per-Fact;
- project `DOC_MAP.md` ownership of matrix, handoff, raw evidence and reverify documents;
- Product `AGENTS.md` branch/PR, owner, repair-ready and exact-anchor requirements;
- Research separation between evidence classes and Product operational state.

## Branch inventory

The branch is 19 commits ahead and 9 commits behind AuditRepo `main`. It contributes:

- 33 Markdown investigation reports under `references/audit-session-2026-08-05/`;
- 10 JSON contract prototypes;
- 2 JavaScript prototype guards;
- 1 Favorite Store D-22 reverify;
- edits to `NEXT_AGENT_PROMPT.md` and `verified/MASTER_BUG_MATRIX.md`.

The five other `arena/*-auditrepo` branches are fully contained by current `main` (zero commits ahead) and contain no additional integration delta.

## Three-way authority reconciliation

### Current AuditRepo authority wins

The Arena handoff was anchored to Product `92c4939c` and matrix arithmetic `371 = 226 closed + 145 open`. Current AuditRepo `main` is anchored to Product `3a05a1e7` with `371 = 229 closed + 142 open`, including later Favorite Store, reader controls and Search P2 closures. The branch handoff is therefore superseded and is not merged.

The branch matrix mutation changes D-22 to `PARTIAL REGRESSION` while leaving the row in `## ЗАКРЫТО` and leaving counters unchanged. This violates canonical section semantics. The edit is not merged into the SSOT. The underlying evidence is retained and reverified below.

### Raw research/evidence is retained

The 33 session reports are preserved because they contain nontrivial inventories, corrections, design comparisons, candidate contracts and source observations. Retention does not make every claim current. Each report keeps its own anchor and evidence class.

### Product-like contracts are prototypes, not AuditRepo guards

The original `scripts/diff-canonical.mjs` computes `ROOT` as the AuditRepo root but then searches Product-only surfaces such as `ROOT/src`, `ROOT/js` and Product route files. Missing targets become `SKIP`, so the script can exit green without checking Product. `guard-no-main-junk.mjs` is also unwired and does not establish Product evidence.

The scripts and JSON contracts are preserved under the audit-session `artifacts/prototypes/` directory and removed from active root/project locations. They require a future Product SYSTEM lane before any CI claim.

## Drift-window verification

The Arena reports' latest broad Product anchor is `007c2d3c`. Comparing that anchor to current Product `3a05a1e7` yields four later commits. Changed surfaces are concentrated around Favorite Store/Home favorites, Home quote/browser contracts, floating-cluster/reader work and generated revision owners. Therefore:

- untouched source observations may remain useful as historical/source evidence;
- findings on changed surfaces are not carried forward without direct reverify;
- current Search closures and current handoff/matrix truth override older report wording;
- no blanket claim is made that all 145 report rows are current.

## D-22 current-head verdict

### Witness 1 — canonical route path owner

Current `src/runtime/favorite-store.js` `normalizePath()` resolves against `location.origin`, requires `url.origin === location.origin`, and returns only the local path/query/hash. The historical favorite-link scheme/XSS half remains fixed.

### Witness 2 — canonical image owner

Current `normalizeImage()` resolves the supplied value and accepts it when the protocol is `http:` or `https:`. It does not compare the resolved origin with `location.origin`.

Consequences:

- `/images/local.webp` remains valid;
- `//external.example/pixel.png` resolves to the page protocol and passes;
- `https://external.example/pixel.png` passes;
- the value can be consumed as a CSS `background-image`, producing an external request.

### Bounded disposition

**CONFIRMED-CURRENT / PARTIAL-NARROWED residual.** This is not JavaScript execution and must not be described as full XSS. It is an external-request/privacy boundary and a regression from the intended same-origin Favorite Store contract.

A repair-ready Product lane should:

1. require `url.origin === location.origin` in the canonical image normalizer;
2. preserve valid same-origin absolute and root-relative image URLs;
3. reject protocol-relative, cross-origin HTTP(S), `data:`, `javascript:` and malformed values;
4. add permanent source and browser/runtime witnesses for both Home favorites and `/izbrannoe/`;
5. update the matrix and counters only in the same verified repair/reverify transaction.

No Product mutation, production deployment, browser execution, Research publication or rights claim is made here.

## Integration verdict

**APPROVED WITH RECONCILIATION.** Merge the evidence pack and fresh integration reverify; keep current `main` canonical files; relocate prototypes out of active locations; do not merge the stale handoff or malformed D-22 matrix edit. This preserves the Arena work without allowing it to regress current AuditRepo truth.
