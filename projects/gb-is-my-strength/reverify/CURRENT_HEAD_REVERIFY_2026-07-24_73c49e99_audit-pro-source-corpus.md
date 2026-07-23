# CURRENT HEAD REVERIFY — `73c49e99` — registry-owned audit-pro source corpus

Date: 2026-07-24

## Boundary

- Current source `main`: `73c49e992358c850832ac1bbd37c426e7b9e75bb`.
- Last exact deployed source remains `8a5352671375fdb01b6c30273c25ec4283a13f69`.
- This record closes a source/CI defect. It does **not** claim that `73c49e99` is already the exact GitHub Pages deployment.
- Parallel homepage rebuild `4ee73bb2fd9568c107f5c62ab2d96da38e21aa6f` was already in `main` and its new G113 homepage contract was preserved during reconciliation.

## Closed canonical row

`AUDIT-PRO-ROOT-ONLY` is closed by source PR #169, merge `73c49e992358c850832ac1bbd37c426e7b9e75bb`.

The source merge is `73c49e99`; the exact pre-merge PR head used by the cited CI evidence is `7bda4b44`.

The fix does not turn `audit-pro.js` into a second `dist` audit. Instead, it gives the early source gate an explicit registry-owned corpus:

- 75 production routes total;
- 52 committed production-shadow HTML files audited at source time;
- 23 dist-only routes explicitly delegated to mandatory built-output SEO, HTML and Search/Index contracts;
- unregistered root HTML is blocking;
- duplicate route-to-root mappings are blocking;
- repeated HTML anti-regression scans consume one `htmlPages` corpus;
- the Russian quote-policy loop now evaluates repository-relative article/Nagornaya paths instead of vacuously testing absolute paths;
- corpus mutations cover dist-only classification, orphan rejection and disappearing source shadows without a second route list.

## Parallel-agent reconciliation

The homepage agent advanced source `main` from `7187c32a` to `4ee73bb2` and changed `scripts/audit-pro.js` in the G113 homepage contract. Exact base, PR and new-main versions were reconciled through a three-way merge with no conflict markers. The final source PR contained only:

1. `.github/workflows/route-registry-validators.yml`;
2. `scripts/audit-pro-source-corpus-test.js`;
3. `scripts/audit-pro.js`;
4. `scripts/lib/audit-pro-source-corpus.js`.

No temporary workflow, materializer, route allowlist or homepage implementation file remained in the final diff.

## Exact source verification

Final PR head: `7bda4b449044597536782a02635482d078f6299d`.

- Shared Files Guard `30045742164` — success, including workflow policy, shared-system guards and actionlint.
- Route Registry Validators `30045742230` — success.
- Registry/adversarial contracts — success.
- Production-like build — success.
- Registry-derived production SEO — success.
- Search & Index policy — success.
- Chromium public-surface matrix — 75/75 routes; 3428/3428 contracts; 0 failures.
- Route semantics — 126/126; 0 failures.
- Nagornaya epistemic UI — 174/174; 0 failures.
- Browser evidence artifact `8579172903`, SHA-256 digest `188d687c9bbac61362fd3548c27ab508c059ff6185903bc3c9341c48955045e8`, is attached to the exact final head.

## Matrix effect

- closed: 138 → 139;
- P3 section: 52 → 51;
- statistical P3: 55 → 54;
- total open rows: 197 → 196;
- no canonical row was aliased or silently deleted;
- source authority advances to `73c49e99` while production authority remains `8a535267`.

## Remaining execution order

The audit/route-scope architecture lane is complete. Next work must be selected from still-open current evidence and coordinated against active source PRs #156, #161, #136 and #130 plus AuditRepo PR #27. Immediate documented candidates are the 34 PR #167 editorial warnings, Reader R6/issue #59, and the verified P0/P1 matrix order.
