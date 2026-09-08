# Current-head reverify — `FRAGMENTED-SECURITY-OWNERSHIP` after Product #1922

## Disposition

`CURRENT / repository-side repair proven on current main; live transport blocker remains`

This receipt supersedes the prior `cd6fc71a` current-head identity. It does **not** close `FRAGMENTED-SECURITY-OWNERSHIP`; it binds the canonical Product Security owner to the post-#1922 Product main and records a fresh exact-head live measurement.

## Current Product anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `85088dabc96fa66093b75c23aed9d5fe70855325`
- Main movement: Product #1922, `fix(ci): make Native Source artifacts rerun-unique`
- Canonical Security PR: #1917 — `fix(security): close document and transport ownership on current main`
- Current exact Security head: `323e13d64b0a23000ef45fd6635adec2da3f0545`
- Synchronization: normal two-parent merge-main; no rebase, force-push or dummy commit
- Compare against current Product main: `ahead=3`, `behind=0`, merge base = exact current main
- Net diff: exactly five Security-owned paths
- Reviews: 0
- Review threads: 0

## Scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

Product #1922 changed only Native Source artifact identity and does not collide with these five owners.

## Fresh exact-head Security proof

Security Ownership Contract:

- run: `34256542115`
- job: `102163684646`
- source head: `323e13d64b0a23000ef45fd6635adec2da3f0545`
- PR merge ref checked out by Actions: `9419cda26467cd11d632e751be45003ff39a7e9f`

Repository/document side:

- syntax and source ownership contract: **SUCCESS**;
- production-like build: **SUCCESS**;
- Astro diagnostics: **573 files / 0 errors / 0 warnings / 8 hints**;
- production build generated 85 Astro pages and scanned 89 final HTML files;
- Editorial Metadata v3 remained **56 records / 56 approved / 0 blocked**;
- HTML metadata projection matched **56/56**, Search 56, Sitemap 56, RSS 56, unknown dates 0/0;
- final postbuild scanned 89 HTML files;
- canonical CSP verified on **88** governed HTML documents;
- **67** transport-only meta pragmas were removed;
- CSP injection/canonicalization = **24/64**;
- final dist security/asset/Atlas/relation/metadata/reader/sitemap drift = **0**.

The same job then executed the live assertion against `https://gospod-bog.ru` and failed only at the HTTP transport boundary:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Observed actual value: empty/missing.
Required value: `nosniff`.

The live failure occurred after the successful source contract and successful production-like artifact build; no document-CSP assertion failed first.

## Evidence artifact

The `always()` evidence upload succeeded after the live failure:

- artifact id: `10068338006`
- artifact name: `security-ownership-34256542115-1`
- digest: `sha256:b4e7efa639121d7af51a17e0880a9dba163f3dba32759978ae1a28d14e3b0e91`
- size: 681 bytes
- expiry: 2026-10-08

The artifact identity is rerun-safe and proves that the #1922 artifact-name repair is inherited without expanding Security semantic scope.

## Production transport owner

Current Product deployment remains direct GitHub Pages:

- the release workflow builds one immutable candidate;
- uploads that exact candidate with `actions/upload-pages-artifact`;
- deploys it with `actions/deploy-pages` into the `github-pages` environment;
- verifies the live release against `https://gospod-bog.ru`.

Therefore the remaining defect is not an unknown repository renderer. It is the live HTTP serving boundary. `X-Content-Type-Options` cannot be truthfully supplied by an HTML meta pragma, and the Security contract intentionally rejects that substitution.

## External control boundary — freshly rechecked

No connected control plane in this session can mutate the production response headers for the existing GitHub Pages origin:

- GitHub connector exposes repository/PR/Actions writes but no Pages arbitrary-response-header mutation;
- plugin discovery found no connected Cloudflare/CDN edge write owner for this domain;
- connected Vercel returned `teams=[]`, so there is no verified Vercel project/team scope that could safely own this production domain;
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