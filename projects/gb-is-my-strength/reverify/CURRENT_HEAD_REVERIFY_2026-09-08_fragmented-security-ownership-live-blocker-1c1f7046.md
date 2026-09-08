# Current-head reverify — `FRAGMENTED-SECURITY-OWNERSHIP` after Product #1918

## Disposition

`CURRENT / repository-side repair proven on current main; live transport blocker remains`

This receipt supersedes the historical `323e13d6` current-head identity. It does **not** close `FRAGMENTED-SECURITY-OWNERSHIP`; it binds the canonical Product Security owner to the post-#1918 Product main and records a fresh exact-head live measurement.

## Current Product anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `f17376bd807cf77ae8c5e62c1d2519c040dae711`
- Main movement: Product #1918, `content(pastor-series): clear Parts II–IX before release`
- Canonical Security PR: #1917 — `fix(security): close document and transport ownership on current main`
- Current exact Security head: `1c1f7046cdc0d849ae267c0898150de13140e82e`
- Current PR checked merge ref observed by Actions: `6b65e4105ef5ec10dd0efbaf0de2d1496f4e4581`
- Synchronization: normal two-parent merge-main; no rebase, force-push or dummy commit
- Compare against current Product main: `ahead=4`, `behind=0`, merge base = exact current main
- Net diff: exactly five Security-owned paths
- Reviews: 0
- Review threads: 0

## Scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

Product #1918 changed pastor-series content/research clearance paths and does not collide with these five owners. Product #1922's rerun-safe Native Source artifact identity is inherited by the synchronized lane.

## Fresh exact-head Security proof

Security Ownership Contract:

- run: `34260542256`
- job: `102177085520`
- source head: `1c1f7046cdc0d849ae267c0898150de13140e82e`
- checked PR merge ref: `6b65e4105ef5ec10dd0efbaf0de2d1496f4e4581`
- runner checkout explicitly recorded merge `1c1f7046...` into `f17376bd...`

Repository/document side:

- syntax and source ownership contract: **SUCCESS**;
- production-like build: **SUCCESS**;
- Astro 7/Satteri contract: **PASS** (`Astro 7.2.9`, `Satteri 0.3.8`, native defaults, no Unified override);
- Astro diagnostics: **573 files / 0 errors / 0 warnings / 8 hints**;
- production build generated **85** Astro pages;
- copy-legacy-to-dist copied 948 files while preserving Astro-owned routes;
- Editorial Metadata v3 remained **56 records / 56 approved / 0 blocked**;
- HTML metadata projection matched **56/56**, Search 56, Sitemap 56, RSS 56, unknown dates 0/0;
- final postbuild scanned **89** HTML files;
- canonical CSP verified on **88** governed HTML documents;
- **67** transport-only meta pragmas were removed;
- CSP injection/canonicalization = **24/64**;
- final dist security/asset/Atlas/relation/editorial-metadata/reader/sitemap drift = **0**.

The same exact-head job then executed the live assertion against `https://gospod-bog.ru` and failed only at the HTTP transport boundary:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Observed actual value: empty/missing.
Required value: `nosniff`.

The live failure occurred after the successful source contract and successful production-like artifact build; no document-CSP assertion failed first.

## Evidence artifact

The `always()` evidence upload succeeded after the live failure:

- artifact id: `10069794896`
- artifact name: `security-ownership-34260542256-1`
- digest: `sha256:40e445136129ee43e6c04cc4f6022fb84ec2605a5679e73a4144c63511f66b0f`
- size: 681 bytes
- created: 2026-09-08T18:04:29Z
- expiry: 2026-10-08T18:04:29Z

The artifact identity is rerun-safe and independently preserves the current live failure evidence.

## Exact-head CI snapshot

The observed applicable workflow set on exact Security head `1c1f7046...` is now terminal:

- Shared Files Guard — controlling later run **SUCCESS** (an earlier duplicate run was cancelled);
- Source Authority Contract — **SUCCESS**;
- Reader Linear Text Projection Contract — **SUCCESS**;
- Native Source Contract — **SUCCESS**;
- Node Toolchain Contract — **SUCCESS**;
- Metadata SSOT Closure — **SUCCESS**;
- Metadata & IndexNow Readiness — **SUCCESS**;
- Route Registry Validators — **SUCCESS**;
- Editorial Metadata v3 — **SUCCESS**;
- Deploy Candidate Contract — **SUCCESS**;
- Security Ownership Contract — terminal **FAILURE** solely because its live transport assertion correctly remained fail-closed.

Thus every non-Security applicable workflow in the observed exact-head run set is terminal-green; the only terminal red is the intended live `X-Content-Type-Options` transport boundary. This promotes no stale or previously in-progress result and does not weaken the Security admission condition.

## Production transport owner

Current Product deployment remains direct GitHub Pages:

- the release workflow builds one immutable candidate;
- uploads that exact candidate with `actions/upload-pages-artifact`;
- deploys it with `actions/deploy-pages` into the `github-pages` environment;
- verifies the live release against `https://gospod-bog.ru`.

GitHub Pages documentation does not expose per-repository arbitrary response-header configuration as a static-content feature. Repository HTML therefore cannot truthfully manufacture the HTTP response header required by this contract.

The remaining defect is the live HTTP serving boundary. `X-Content-Type-Options` cannot be truthfully supplied by an HTML meta pragma, and the Security contract intentionally rejects that substitution.

## External control boundary — freshly rechecked

No connected control plane in this session can mutate the production response headers for the existing GitHub Pages origin:

- GitHub connector exposes repository/PR/Actions writes but no Pages arbitrary-response-header mutation;
- plugin discovery found no connected Cloudflare/CDN edge write owner for this domain;
- connected Vercel returned `teams=[]`, so there is no verified Vercel project/team scope that could safely own this production domain;
- the Product branch `lane/security-netlify-transport-owner-20260908` has no pull request and points exactly to historical Product main `c65b83a6588187c71b6e39c720d2b6666b4959c2`; its provider-flavoured branch name is therefore not evidence of an implemented or active transport owner;
- a blind hosting migration or DNS/proxy insertion is not an admissible bounded Security repair.

## Closure boundary

Keep `FRAGMENTED-SECURITY-OWNERSHIP` active until all are true:

1. a real production transport owner emits `X-Content-Type-Options: nosniff` on `https://gospod-bog.ru/`;
2. a fresh exact-head Security Ownership Contract succeeds including the live assertion;
3. all applicable exact-head Product workflows needed for admission are terminal-green;
4. #1917 is synchronized to then-current Product `main`, remains `behind=0`, and retains its five-file scope;
5. reviews and review threads remain zero;
6. #1917 is merged with expected-head/CAS;
7. AuditRepo performs a separate Security closure reconciliation.

Until the live header exists, #1917 must remain Draft and unmerged. No test weakening, fake HTML transport pragma, or provider-specific dead configuration is accepted as closure.

## MASTER consequence

None. Canonical arithmetic remains:

- active work units: `2`
- direct current defects: `0`
- system verification lanes: `1` (`FRAGMENTED-SECURITY-OWNERSHIP`)
- owner decisions: `1` (`SYS-MAIN-ADMISSION-ENFORCEMENT`)

Security remains a real external SYSTEM blocker; Product-main native admission enforcement remains a separate governance owner decision.