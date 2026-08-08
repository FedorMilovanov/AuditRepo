# Strangler exact-red CI + npm security inventory — 2026-08-08

## Product anchor

Current Product `main` remained `6d671d0e30bff8da1f7354a00191ab990f17ed12` throughout this recheck.

## SYS-STRANGLER-RETIREMENT / Product #1222

Observed PR head: `304d89f808ad82273f0ecbd2c704b23817956f17`, based on current Product main (`behind=0`). PR body still names stale candidate `ca5e48ac...`; merge authorization must follow actual GitHub head/CI.

The proposed logical storage resolver is directionally correct: ledger identity stays logical/immutable and storage resolution fails closed on active+quarantine ambiguity, missing files, traversal/symlink/root escape and route/profile identity mismatch. However the current exact head is **not merge-ready**.

### Exact blocking CI

Three triggered workflow groups are red on `304d89...`:

1. Shared Files Guard — shared-files feasibility guard fails with:
   `ENOENT: no such file or directory, lstat '.../migration/legacy-reference/index.html'`.

2. Metadata & IndexNow Readiness — `node scripts/cache-bust.js` fails with:
   `cache-bust legacy authority invalid for data/route-profiles/home.json: invalid repository reference path: "/index.html"`.

3. Source Authority Contract — preceding resolver/provenance/source-authority/build/Gill checks pass, then `Full static publication gate` fails. The available job-status evidence proves the gate is red; this report does not invent the exact terminal message where logs were not cleanly extractable.

### Root compatibility defect in candidate

Current canonical Home route profile legitimately stores:
`legacyPath: "/index.html"`.

The new resolver's `normalizeRepositoryPath()` rejects all POSIX-absolute-looking strings via `path.posix.isAbsolute(value)`. `scripts/lib/legacy-source-authority.js` now calls that normalizer directly on `profile.legacyPath` before comparing profile identity to ledger identity. This makes the new API incompatible with the current route-profile logical-path representation for Home and explains the Metadata/cache-bust failure.

The Shared Files ENOENT is the companion storage-resolution symptom: current logic attempts/quarantines the root logical reference as `migration/legacy-reference/index.html` while a current consumer still expects active repository-root `index.html` semantics. The repair must define **one canonical logical-path normalization contract** that accepts current route-profile identity forms without weakening traversal/root-escape protection, then test root route `/` in active-only, quarantine-only, both and missing states.

### Readiness proof remains physical-path-bound

Independent of the current CI break, `scripts/legacy-shadow-retirement-readiness.mjs` still directly reads immutable reference blobs using old physical `root/<legacyPath>` joins in inventory/integrity code. Therefore Wave A does not yet make the retirement verifier itself post-move/storage-agnostic. The manifest currently classifies that script as nonblocking despite active physical reads. Before an atomic quarantine move, make readiness/inventory verification storage-aware (or supply an explicit post-move verifier) and keep `physicalMoveAuthorized` fail-closed until that proof exists.

### Disposition

No new MASTER ID. Keep all symptoms under `SYS-STRANGLER-RETIREMENT`. Current #1222 cannot reduce the authoritative blocker count until:
- root logical-path compatibility is fixed and adversarially guarded;
- exact-head Shared Files / Metadata / Source Authority are terminal SUCCESS;
- readiness output proves the intended blocker delta with no integrity/inventory/parity regression;
- post-move verifier boundary is made truthful;
- PR body/current SHA and review state are reconciled.

Audit review handoff already posted on Product #1222.

## npm dependency security — exact disposable inventory

Repeated `npm ci` logs reported `8 vulnerabilities (4 moderate, 4 high)`. Counts alone were insufficient because Product `package.json` has no production `dependencies`; npm packages are build/dev tooling.

A one-shot diagnostic PR #1223 was created from exact Product `6d671d0e...` with one temporary workflow only, explicitly `MUST NOT MERGE`. It corrected the older #605 diagnostic bug where inherited shell `errexit` stopped at the expected non-zero `npm audit` exit before evidence generation.

Exact inventory on Node `22.12.0` / npm `10.9.0`:

- all dependencies: **8** vulnerabilities = 4 high + 4 moderate;
- production-only `npm audit --omit=dev`: **0 vulnerabilities**;
- all affected packages are transitive (`direct=false`) and `fixAvailable=true`.

High:
- `fast-uri`;
- `fast-xml-parser`;
- `js-yaml`;
- `nanoid`.

Moderate:
- `@astrojs/language-server`;
- `volar-service-yaml`;
- `yaml`;
- `yaml-language-server`.

Artifact: `npm-security-inventory-main-6d671d0e-v3`, uploaded successfully with SHA256 `161e0d1a7f33e7ea143f77416570d4152389d415f18dbbc8116429b1056c396d`.

### Security disposition

No current public-runtime security defect is established, so **do not add a direct MASTER row** from the npm count. This is dev/build toolchain maintenance evidence. Product #1223 was closed unmerged as `DIAGNOSTIC_DISPOSABLE`; its temporary workflow did not reach `main`.

The diagnostic PR's Node Toolchain / Shared Files failures were expected governance rejection of the temporary helper workflow and are not Product regressions.

## Matrix effect

Counts unchanged: **12 active work units / 2 direct defects / 3 improvements / 4 system lanes / 3 owner decisions**.

Material handoff change: `SYS-STRANGLER-RETIREMENT` now has a concrete current owner (#1222) with exact-red root-path compatibility evidence; npm security remains evidence-only, not active Product work.
