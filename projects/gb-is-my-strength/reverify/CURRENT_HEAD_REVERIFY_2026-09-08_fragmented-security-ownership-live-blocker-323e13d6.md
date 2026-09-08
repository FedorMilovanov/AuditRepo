# Historical reverify — `FRAGMENTED-SECURITY-OWNERSHIP` after Product #1922

## Disposition

`HISTORICAL / superseded by post-#1918 exact-head witness`

This receipt was current for Product `main@85088dabc96fa66093b75c23aed9d5fe70855325` and Security head `323e13d64b0a23000ef45fd6635adec2da3f0545`. Product #1918 later moved `main` to `f17376bd807cf77ae8c5e62c1d2519c040dae711`; #1917 was then synchronized by a normal two-parent merge to Security head `1c1f7046cdc0d849ae267c0898150de13140e82e` without semantic scope expansion. Therefore this receipt remains evidence history only and must not be used as the current admission witness.

## Historical Product anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Historical Product `main`: `85088dabc96fa66093b75c23aed9d5fe70855325`
- Main movement at that time: Product #1922, `fix(ci): make Native Source artifacts rerun-unique`
- Canonical Security PR: #1917 — `fix(security): close document and transport ownership on current main`
- Historical exact Security head: `323e13d64b0a23000ef45fd6635adec2da3f0545`
- Synchronization: normal two-parent merge-main; no rebase, force-push or dummy commit
- Compare at that time: `ahead=3`, `behind=0`, merge base = then-current main
- Net diff: exactly five Security-owned paths
- Reviews: 0
- Review threads: 0

## Scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

## Historical exact-head Security proof

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
- canonical CSP verified on **88** governed HTML documents;
- **67** transport-only meta pragmas were removed;
- CSP injection/canonicalization = **24/64**;
- final dist security/asset/Atlas/relation/metadata/reader/sitemap drift = **0**.

The live assertion against `https://gospod-bog.ru` failed only at the HTTP transport boundary:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Historical artifact:

- artifact id: `10068338006`
- artifact name: `security-ownership-34256542115-1`
- digest: `sha256:b4e7efa639121d7af51a17e0880a9dba163f3dba32759978ae1a28d14e3b0e91`
- size: 681 bytes
- expiry: 2026-10-08

## Current authority pointer

Use the post-#1918 receipt for Product `main@f17376bd807cf77ae8c5e62c1d2519c040dae711` and Security head `1c1f7046cdc0d849ae267c0898150de13140e82e` as the current Security witness.

## MASTER consequence

None. Historical status does not change canonical arithmetic.