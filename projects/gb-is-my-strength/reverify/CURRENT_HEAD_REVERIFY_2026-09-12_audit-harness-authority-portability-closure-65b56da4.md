# Current-head reverify — audit-harness authority / portability false-signal closure

## Disposition

`FIXED-CURRENT / closed-by-system-product-repair`

This receipt reconciles four harness/evidence-integrity roots discovered during current-head audit work. They are not new active Product defects and do not change MASTER arithmetic.

## Anchors

- Reverify date: 2026-09-12
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main` witness at reconciliation: `65b56da4cb9f0ee9a0d3c843b443574b3ea5a380`
- AuditRepo base at transaction start: `521f0febb91493196fbca90892c98b5c58af1e6b`
- System theme: `ST-AUDIT-HARNESS`
- Product repairs:
  - #2002 — validator authority drift — merge `6fa9e564286f450c5cab0d558c3a6f9d00507220`
  - #2006 — stale-dist visual parity authority — merge `971bfcd61065326b67f95974de268e1b04bb383e`
  - #2012 — Windows npm child-launch portability / fail-closed status — merge `33a958c2bf47447e06ba09d92552ab98df15837c`
  - #2016 — semantic map-init source oracle — merge `65b56da4cb9f0ee9a0d3c843b443574b3ea5a380`
- Product issue #2013: closed/completed by #2016.

## Root A — validator authority drift

### Mechanism

Three independent symptoms shared one validation-authority problem:

1. `mdx-structure-audit.js` scanned YAML frontmatter as reader body and could report reader-structure defects from metadata tokens.
2. `validate.js` treated `reference-only` legacy article HTML as live semantic title/OG authority.
3. the layout validator retained a stale breakpoint allowlist and rejected the current 1199/1200 contract.

### Repair

Product #2002 aligned validators with current authority instead of historical storage/implementation residue.

Exact certified head: `4a4bd59c07009b1107d74b9dab9b4925872ddfe4`.

Exact-head workflows all succeeded:

- Metadata & IndexNow Readiness — `34682824908`
- Shared Files Guard — `34682824851`
- Metadata SSOT Closure — `34682824824`
- Source Authority Contract — `34682824856`
- Deploy Candidate Contract — `34682824834`

Merge: `6fa9e564286f450c5cab0d558c3a6f9d00507220`.

## Root B — visual-parity stale-dist authority drift

### Mechanism

Route parity audits changed meaning merely because a local `dist/` directory happened to exist. The same Product source could therefore:

- PASS when `dist` was absent;
- FAIL against unrelated stale build residue;
- PASS on server source gates that build in a clean environment.

This was an audit-mode authority defect, not a Product catalogue defect. The alleged 65/80 article-catalogue symptom was stale artifact residue: the fresh catalogue contained the exact 80 projected catalogue identifiers plus one separate non-catalog editorial card.

### Repair

Product #2006 introduced explicit source vs strict artifact modes:

- default route audit is source-only and ignores incidental `dist/`;
- `--require-dist` fails closed when the artifact is absent and validates it when present;
- `visual-parity-contract.js` invokes the strict route audits after build;
- article parity compares exact sorted catalogue route identities rather than only thumbnail count.

Adversarial witness:

- corrupt one `data-catalog-route` in fresh `dist/articles/index.html`;
- default source audit: PASS;
- strict `--require-dist`: FAIL with route-set mismatch;
- restore artifact: strict audit PASS, exact catalogue 80/80.

Exact certified head: `7c1d17f181ae808b7ab201c3a78cd2551dd3b925`.

Exact-head authoritative workflows:

- Shared Files Guard — `34690390792`
- Metadata SSOT Closure — `34690359841`
- Source Authority Contract — `34690359832`
- Visual Parity Guard — pixel-diff — `34690359821`
- Metadata & IndexNow Readiness — `34690359833`
- Deploy Candidate Contract — `34690359830`

The earlier Shared Files run `34690359842` was superseded/cancelled and is not used as evidence.

Merge: `971bfcd61065326b67f95974de268e1b04bb383e`.

## Root C — Windows npm child-launch portability / false-green status handling

### Mechanism

On the audited Windows environment:

```
spawnSync('npm.cmd', ['--version']) -> status=null, error.code=EINVAL
execFileSync('npm.cmd', ['--version']) -> EINVAL
```

Four audit/build callers therefore could die before actually running their production-like child build. `build-pagefind.js` was worse: `process.exit(res.status || 0)` converted `status=null` into success, creating a genuine false-green path.

Blast radius was six callers:

- `article-native-contract-audit.js`
- `astro-home-pilot-audit.js`
- `astro-ishod-pilot-audit.js`
- `legacy-shadow-wrapper-audit.js`
- `build-pagefind.js`
- `editorial-metadata-registry.js`

### Repair

Product #2012 introduced canonical `scripts/lib/npm-spawn.js` and migrated all six callers.

The helper:

- owns the Windows shell route instead of directly executing `.cmd`;
- fails closed on `result.error`;
- rejects non-numeric status;
- rejects unsafe Windows command metacharacters before launch;
- preserves `npm exec -c` argument grouping;
- removes the Pagefind `status || 0` false-success path.

The Node toolchain contract additionally executes pinned npm through the helper, injects synthetic `EINVAL` and `status=null`, rejects unsafe arguments, and scans `scripts/` for direct npm child-process bypasses.

Independent Windows witnesses:

- canonical helper executes npm `10.9.8`;
- `astro:audit:article-mdx:strict` performs a real production-like build and passes 35 routes;
- Pagefind `1.5.2` indexes 92 pages / 25,932 words, EXIT=0;
- unsafe Pagefind version input containing `&` is rejected before npm;
- `editorial-metadata-registry.js --check --build` passes 71/71 records.

Exact certified head: `1ae897b6a0a96d04fc7d2745793b96ee102f377f`.

Exact-head workflows all succeeded:

- Node Toolchain Contract — `34697164416`
- Shared Files Guard — `34697162765`
- Native Source Contract — `34697162664`
- Source Authority Contract — `34697162723`
- Deploy Candidate Contract — `34697162696`
- Metadata & IndexNow Readiness — `34697162714`
- Editorial Metadata v3 — `34697162777`
- Metadata SSOT Closure — `34697162704`

Merge: `33a958c2bf47447e06ba09d92552ab98df15837c`.

## Root D — implementation-coupled map-init source oracle

### Mechanism

`astro-ishod-pilot-audit.js` required the literal local name `inst` and exact error wording for the null-map guard. Current Product source had already renamed the result to `instance` while retaining the same fail-closed runtime semantics.

Independent runtime witnesses before repair were already green:

- Ishod basemap browser contract: route 200, map reaches ready, no page/console errors;
- map-runtime fallback browser contract: 8/8, including route-data failure and engine-asset failure recovery.

Therefore the failing source assertion was a stale oracle, not a Product runtime defect. A repository-wide sibling scan found the same latent implementation coupling in the Avraam audit.

### Repair

Product #2016 introduced one shared semantic source contract used by both audits.

It proves:

1. MapEngine availability guard exists before `createMap()`;
2. `createMap()` result is actually assigned and the identifier is captured;
3. a null guard protects that same identifier before `data-map-state='ready'`.

Mutation contract:

- rename `inst → instance → mapResult`: PASS;
- missing null guard: FAIL;
- null guard after ready: FAIL;
- engine guard after `createMap()`: FAIL;
- guard on a different identifier: FAIL.

Fresh exact-head local witnesses:

- semantic mutation contract: PASS;
- Avraam audit: 55/55 PASS;
- Ishod no-build audit: PASS.

After Roots C and D were both repaired, `validate:static-publication:light` completed EXIT=0 end-to-end.

Exact certified head: `e572fc6c8cd28dd365b2eef496a910118b79bb48`.

Exact-head workflows all succeeded:

- Metadata & IndexNow Readiness — `34705972402`
- Shared Files Guard — `34705972404`
- Metadata SSOT Closure — `34705972419`
- Source Authority Contract — `34705972408`
- Deploy Candidate Contract — `34705972407`, including final Gill browser steps 27–29

Merge: `65b56da4cb9f0ee9a0d3c843b443574b3ea5a380`.

## Multi-witness closure assessment

These roots satisfy the audit-harness closure standard from independent angles:

- **source/mechanism**: each false signal has a concrete harness mechanism and bounded caller set;
- **adversarial/mutation**: stale-dist corruption, synthetic process launch failures, and semantic map guard mutations demonstrate fail-open/false-red behavior and the repaired boundary;
- **local runtime/build**: current Windows npm/build/Pagefind paths and Ishod/Avraam runtime/source audits pass;
- **exact-head server CI**: every final Product candidate cited above completed its relevant admission suite successfully;
- **Product merge**: each repaired candidate was merged via expected-head/CAS after live-base drift/overlap checks.

No unresolved symptom from these four roots is promoted to an active Product row.

## Current-state consequence

At reconciliation time Product `main` is `65b56da4cb9f0ee9a0d3c843b443574b3ea5a380`, exactly the #2016 merge commit.

MASTER arithmetic is unchanged. The active owners already present there remain independent:

- fragmented security ownership;
- Product main-admission owner decision;
- Search control-plane owner decision.

This receipt makes no closure inference about those owners.

## AuditRepo transaction boundary

This reconciliation should modify only:

- `verified/CLOSURE_LEDGER.md` by append-only closure entry;
- this reverify receipt.

It intentionally does not edit `MASTER_BUG_MATRIX.md` or `SYSTEM_THEMES.md`.
