# Agent Arena audit session — integration index

## Provenance

- Source branch: `arena/019fd2bb-auditrepo`
- Immutable source head / rollback anchor: `7f4b609ac8eea8e5a82c9a9fd98fb097694441ca`
- Branch merge base: `1392037c4c49a9265ac11bd1f25ac4722bad69fa`
- AuditRepo `main` used for integration: `4129a585e8a149911965455ee191b4cba76eda04`
- Product source reverified against: `3a05a1e79bcd7061e9b9c3f98ed3953ae2e8d0c0`
- Research authority observed: `c3f7ea27bfc8a10f2369ae90a89107faea8257bf`

This directory preserves the Agent Arena investigation as evidence. It is not a second SSOT and does not override `verified/MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`, Product ownership, or Research authority.

## Integration disposition

### Preserved unchanged

All 33 Markdown investigation reports in this directory are retained as raw/session evidence. Their internal source anchors, measurements, corrections, and supersession history remain part of the record. A report is not automatically a current Product verdict merely because it is retained here.

The original D-22 reverify is also retained at:

- `../../reverify/CURRENT_HEAD_REVERIFY_2026-08-05_d0647b71_favorite-store-d22.md`

A fresh integration reverify against Product `3a05a1e7` is recorded at:

- `../../reverify/CURRENT_HEAD_REVERIFY_2026-08-06_3a05a1e7_arena-019fd2bb-integration.md`

### Preserved as non-executable prototypes

The ten JSON contracts and two JavaScript scripts created by the branch are moved under `artifacts/prototypes/`.

They are **design/evidence prototypes only**. They are not active AuditRepo guards and must not be cited as CI proof:

- the contract paths target the Product repository (`src/`, `js/`, route files);
- the original `scripts/diff-canonical.mjs` resolves its root to AuditRepo, where those Product surfaces do not exist;
- absent Product paths are reported as `SKIP`, allowing a false-green result;
- no current workflow wires these scripts as a blocking owner.

Promotion requires a bounded Product SYSTEM lane, owner-scoped paths, adversarial fixtures, fail-closed behavior, and exact-head CI evidence.

### Intentionally not promoted

- The branch copy of `NEXT_AGENT_PROMPT.md` was stale (`92c4939c`, 226 closed / 145 open) and is reset to current AuditRepo `main`.
- The branch matrix edit placed a `PARTIAL REGRESSION` inside the `ЗАКРЫТО` table while leaving arithmetic unchanged. That malformed canonical mutation is not promoted.
- No Product source code, Research corpus, rights decision, publication state, or production authority is changed by this integration.

## Current verified delta

The branch's most important live finding survives current-head reverify:

- `normalizePath()` still enforces same-origin route paths for favorite links;
- `normalizeImage()` accepts `http:`/`https:` URLs without checking `url.origin === location.origin`;
- protocol-relative and absolute external image URLs can therefore become CSS `background-image` requests;
- this is not script execution, but it is an external-request/privacy and contract-drift residual.

The safe repair lane is narrow: enforce same-origin in the canonical Favorite Store image normalizer and add permanent positive/negative tests. Canonical matrix movement must happen in that repair/reverify transaction, with counters recalculated according to the matrix rules.

## Use rule

Read reports for hypotheses, measurements, visual/design context, and candidate repair ideas. Before changing Product or canonical status, re-read current Product `main`, identify the current owner, and obtain the required source/build/browser/CI witnesses. Historical wording never outranks current exact-head evidence.
