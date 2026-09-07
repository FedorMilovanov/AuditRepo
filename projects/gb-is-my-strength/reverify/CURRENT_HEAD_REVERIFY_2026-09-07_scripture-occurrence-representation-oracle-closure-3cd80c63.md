# CURRENT HEAD REVERIFY — SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE closure

Date: 2026-09-07
AuditRepo lane: `lane/audit-scripture-occurrence-closure-20260907`
AuditRepo admission base: `010ae76ee343a133af311b601d05efabda709565`
Product owner: `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE`

## Disposition

`SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` is closed and must be removed from active MASTER arithmetic.

This disposition is scoped only to the Scripture occurrence representation/fragment oracle. It makes no inference about the remaining SYSTEM owners.

## Product repair receipt

- Product PR: #1835 — `fix(scripture): make occurrence representation visible-prose exact`
- Exact tested head: `e0469e6994b337ff6401e11eaab0ada11448ef07`
- Product merge commit: `3cd80c63220d1a221f90b9aca3b5f6ddc2a17473`
- Product current-main witness checked for this reconciliation: `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`
- Logical Product diff: exactly three paths:
  - `scripts/build-scripture-occurrence-index.mjs`
  - `scripts/scripture-occurrence-index-contract.mjs`
  - generator-owned `data/scripture-search-index.json`

The merge commit remains in current Product main ancestry; this is not a stale branch-only repair.

## Closure-boundary verification

The original owner required all of the following:

1. user-visible occurrence context must be derived from visible prose rather than raw source syntax;
2. fragment ownership must accept only a real literal `id` attribute, not an `id` suffix inside attributes such as `data-note-id`;
3. the independent oracle must reject dirty snippets and nonexistent/false fragment targets;
4. the generated index must converge deterministically rather than being hand-edited.

Current Product source at `fc2e4570...` still satisfies those boundaries:

- `projectVisibleSource()` masks Astro/MDX frontmatter, comments, script/style blocks, tags, expressions, MDX destinations/image syntax and other non-visible carriers while preserving visible prose needed by occurrence scanning;
- `nearestExplicitAnchor()` tokenizes tag attributes and recognizes only an attribute whose normalized name is exactly `id`;
- the independent contract has adversarial fixtures proving `data-note-id="false-anchor"` is rejected while a real `id="real-anchor"` is accepted;
- the contract verifies generated context contains visible prose and rejects source syntax leakage;
- the independent dist-side literal-id oracle separately parses rendered HTML tags instead of reusing the producer's old boundary regex;
- the contract recomputes the canonical index and fails if `data/scripture-search-index.json` is stale or nondeterministic.

## Exact-head CI evidence

For exact Product head `e0469e6994b337ff6401e11eaab0ada11448ef07`, the applicable closure gates were terminal SUCCESS:

- Scripture Occurrence Index Contract — run `34107892563`
- Search Scripture Occurrence Runtime — run `34107892687`
- Source Authority Contract — run `34107892557`
- Deploy Candidate Contract — run `34107892611`
- Visual Parity Guard — run `34107892612`
- Metadata & IndexNow Readiness — run `34107892549`
- Shared Files Guard — run `34107943623`

An earlier same-head Shared Files Guard run `34107892589` was cancelled; the later exact-head run above completed successfully, so no stale-green substitution is used.

## Live boundary

A separate live HTTP witness is not required for this closure. The repaired owner is a deterministic source → generated-index → production-like-dist/runtime contract, and the exact-head Deploy Candidate plus runtime gates exercise that publication boundary. No unrelated live-site claim is made.

## MASTER consequence

Remove `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` from `SYSTEM VERIFICATION LANES` and decrement:

- Active work units: `7 → 6`
- System verification lanes: `6 → 5`

All other active rows remain unchanged in this transaction.
