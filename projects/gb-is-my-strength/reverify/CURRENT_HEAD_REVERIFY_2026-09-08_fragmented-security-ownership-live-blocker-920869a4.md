# Historical reverify — `FRAGMENTED-SECURITY-OWNERSHIP` live blocker at `920869a4`

## Supersession notice

`HISTORICAL / SUPERSEDED FOR CURRENT-HEAD IDENTITY`

This receipt was current when recorded, but Product #1856 was subsequently closed unmerged and superseded by canonical Product #1917. The live measurement and artifact below remain valid historical evidence of the same transport defect. Current admission authority is the separate receipt `CURRENT_HEAD_REVERIFY_2026-09-08_fragmented-security-ownership-live-blocker-cd6fc71a.md`.

## Historical disposition at measurement time

`repository-side repair proven; live transport blocker remained`

This receipt did **not** close `FRAGMENTED-SECURITY-OWNERSHIP`. It refreshed the Security implementation after Metadata closure and proved that the remaining failure belonged to the live transport layer rather than to the generated document artifact.

## Historical anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product `main` at measurement: `c65b83a6588187c71b6e39c720d2b6666b4959c2`
- Historical Product Security PR: #1856 — now closed unmerged
- Exact Security head measured: `920869a445d287920c45d3c42e5d3028c22faf52`
- PR merge ref observed by Actions: `f5ec2f7dca0a6c151397818b6ab701d902fded31`
- Compare at measurement time: `ahead=5`, `behind=0`, merge base exact then-current main
- Net Product diff: exactly five Security-owned paths

## Historical Security scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

No Article, Metadata, Service Worker, content or governance files were part of this Product lane.

## Repository/document layer proof

Security Ownership Contract run:

- run: `34249525270`
- job: `102140076059`
- exact source head: `920869a445d287920c45d3c42e5d3028c22faf52`

The run proved:

- syntax and source ownership contract: **SUCCESS**;
- production-like build: **SUCCESS**;
- Astro check: 573 files, 0 errors, 0 warnings;
- production-like postbuild scanned 89 HTML files;
- canonical CSP verified on 88 governed HTML files;
- 67 obsolete transport meta pragmas removed;
- Metadata v3 remained `56 approved / 0 blocked`, with HTML/Search/Sitemap/RSS projection complete.

## Live transport proof

The same job executed:

`node scripts/security-ownership-contract.mjs --dist --live`

with `SECURITY_LIVE_BASE_URL=https://gospod-bog.ru` and failed exactly at:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Observed actual value: empty/missing. Required value: `nosniff`. No document-CSP assertion failed before this point.

## Evidence artifact

- artifact id: `10065511729`
- name: `security-ownership-34249525270-1`
- digest: `sha256:e639048ff7905e3e4354aa5c2634f27042c4eb889386c7765d1e03ba3c7adb4f`

The artifact upload completed after the live assertion, so the failed live measurement is preserved rather than inferred from job status alone.

## Transport boundary preserved

The production path was direct GitHub Pages. The missing `X-Content-Type-Options` header could not be truthfully repaired by HTML meta, by weakening the live assertion, or by adding a provider-specific headers file that GitHub Pages does not consume as arbitrary HTTP response-header configuration.

## Current lineage

Canonical Product owner is now #1917. See `CURRENT_HEAD_REVERIFY_2026-09-08_fragmented-security-ownership-live-blocker-cd6fc71a.md` for current Product main/head/run/artifact identity.

## MASTER consequence

None. `FRAGMENTED-SECURITY-OWNERSHIP` remains active. This file is retained as historical evidence and no longer claims current-head authority.