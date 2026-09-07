# CURRENT HEAD REVERIFY — SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS closure

Date: 2026-09-07
AuditRepo lane: `lane/audit-source-surface-closure-20260907`
AuditRepo admission base: `e13125d468c9e8733e341f9524f6892760d539ab`
Product owner: `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`

## Disposition

`SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` is closed and must be removed from active MASTER arithmetic.

This disposition is scoped only to source-surface completeness and its absorbed button-accounting manifestations. It makes no inference about `RODOSLOVIYE-OG-IMAGE`, `SW-ROOT-GENERATION-AUTHORITY`, `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`, `METADATA-SSOT-PROLIFERATION`, or `FRAGMENTED-SECURITY-OWNERSHIP`.

## Product repair receipt

- Product PR: #1829 — `audit(source): make source-surface completeness fail closed`
- Exact certified repair head: `33a9a14ed23d82626caf9e12f3ee9a07bcef58f4`
- Product merge commit: `4750b649eab5ad749c8b84f11fc064370b42225f`
- Product current-main witness checked for this reconciliation: `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`
- Logical Product diff: exactly four audit/control-plane paths:
  - `scripts/audit-pro-source-corpus-test.js`
  - `scripts/cache-bust.js`
  - `scripts/lib/audit-pro-source-corpus.js`
  - `scripts/lib/product-source-surfaces.js`

The merge commit is an ancestor of current Product `main`: compare `4750b649... → fc2e4570...` reports `ahead_by=21`, `behind_by=0`, with merge base exactly `4750b649...`.

None of the four repair paths appears in the intervening changed-file set from the merge commit to current `main`; the certified repair therefore remains byte-stable in current Product main rather than merely existing in historical ancestry.

## Closure-boundary verification

The original owner required a deterministic, repository-derived definition of DOM/resource-producing source surfaces and fail-closed detection of omitted producer classes rather than historical magic counts.

The merged repair satisfies that boundary by:

1. introducing one repository-derived source-surface classifier rather than route/file-count allowlists;
2. declaring current DOM/control source kinds (`html`, Astro, JS-family, TS-family and MDX) and resource source kinds, while treating JSON/CSS as resource-only for the DOM census;
3. detecting static `<button>` and quoted dynamic `createElement(...button...)` factories;
4. streaming unknown textual source kinds for producer sentinels so an omitted extension cannot silently become a false-green class;
5. failing closed on unreadable/non-regular/binary declared source and on broken, escaping or excluded-root symlink aliases;
6. extending asset-revision validation to governed code/data resource constructors while preserving the existing canonical cache-bust writer;
7. requiring the live repository census to report `unclassified=[]` instead of freezing historical 47/49/75 cardinalities.

The absorbed `MISSING-BUTTON-TYPE` and `SITEWIDE-BTN-TYPE-AUDIT` accounting therefore no longer needs an independent repair row: completeness authority is structural and repository-derived, while typeless-button cleanup remains preventive unless a behavioural submit witness exists.

## Exact-head CI evidence

For exact Product repair head `33a9a14ed23d82626caf9e12f3ee9a07bcef58f4`, the applicable pull-request workflows completed successfully:

- Shared Files Guard — run `34100872589` (a previous duplicate run `34100872378` was cancelled; the later same-head run succeeded)
- Route Registry Validators — run `34098983595`
- Deploy Candidate Contract — run `34098983691`
- Source Authority Contract — run `34098983672`
- Editorial Metadata v3 — run `34098983544`
- Metadata & IndexNow Readiness — run `34098983525`
- Glossary Contract — run `34098983610`
- TTS Download Consent — run `34098983637`
- Search Modal Contract — run `34098983759`

No cancelled run is being substituted for final authority.

## Live boundary

A separate external HTTP witness is not required for this owner. The repaired subject is the repository audit/control-plane census itself: source classification, deterministic scanners, production-like build gates and fail-closed omission detection. Current-main ancestry plus unchanged repair paths and the exact-head CI set are the relevant closure authority.

No claim is made here about unrelated Product runtime, metadata, Service Worker, article capability or transport-security owners.

## MASTER consequence

Remove `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` from `SYSTEM VERIFICATION LANES` and decrement:

- Active work units: `6 → 5`
- System verification lanes: `5 → 4`

All other active rows remain unchanged in this transaction.
