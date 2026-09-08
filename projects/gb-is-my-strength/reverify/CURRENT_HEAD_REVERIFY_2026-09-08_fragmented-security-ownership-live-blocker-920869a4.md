# Current-head reverify — `FRAGMENTED-SECURITY-OWNERSHIP` live blocker

## Disposition

`CURRENT / repository-side repair proven; live transport blocker remains`

This receipt does **not** close `FRAGMENTED-SECURITY-OWNERSHIP`. It refreshes the active Security owner against the current Product main after Metadata closure and proves that the remaining failure still belongs to the live transport layer rather than to the generated document artifact.

## Anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `c65b83a6588187c71b6e39c720d2b6666b4959c2`
- Product Security PR: #1856 — `fix(security): establish document and transport ownership`
- Current exact Security head: `920869a445d287920c45d3c42e5d3028c22faf52`
- PR checked merge ref observed by Actions: `f5ec2f7dca0a6c151397818b6ab701d902fded31`
- Compare from current Product `main` to Security head: `ahead=5`, `behind=0`, merge base exact current main
- Net Product diff: exactly five Security-owned paths

## Current Security scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

No Article, Metadata, Service Worker, content or governance files are part of this Product lane.

## Repository/document layer proof

Fresh Security Ownership Contract run:

- run: `34249525270`
- job: `102140076059`
- exact source head: `920869a445d287920c45d3c42e5d3028c22faf52`

The fresh run proves:

- syntax and source ownership contract: **SUCCESS**;
- production-like build: **SUCCESS**;
- Astro check result: 573 files, 0 errors, 0 warnings;
- production-like postbuild scans 89 HTML files;
- canonical CSP verified on 88 governed HTML files;
- 67 obsolete transport meta pragmas removed;
- canonical CSP injection/normalization completes without document-policy drift;
- Metadata v3 inside the same production-like build remains `56 approved / 0 blocked`, with HTML/Search/Sitemap/RSS projection complete.

This independently confirms that the Metadata closure did not regress the Security document boundary and that the Security source/artifact repair remains applicable on current Product main.

## Live transport proof

The same exact-head job then executes:

`node scripts/security-ownership-contract.mjs --dist --live`

with:

`SECURITY_LIVE_BASE_URL=https://gospod-bog.ru`

The live assertion fails exactly at the transport boundary:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Observed actual value: empty/missing.
Required value: `nosniff`.

No document-CSP assertion fails before this point.

## Evidence artifact

The failure is accompanied by a successfully uploaded current-head evidence artifact:

- artifact id: `10065511729`
- name: `security-ownership-34249525270-1`
- digest: `sha256:e639048ff7905e3e4354aa5c2634f27042c4eb889386c7765d1e03ba3c7adb4f`

The artifact upload completed after the live assertion, so the failed live measurement is preserved rather than inferred from job status alone.

## Production transport owner

Current Product `deploy.yml` publishes the immutable production candidate through the GitHub Pages deployment path:

- build and validate immutable candidate;
- upload same-run candidate;
- `actions/upload-pages-artifact`;
- `actions/deploy-pages`;
- environment: `github-pages`;
- generic live release witness against `https://gospod-bog.ru`.

Therefore the current production transport owner is the GitHub Pages serving layer. The missing `X-Content-Type-Options` header cannot be truthfully repaired by editing HTML meta, by weakening the live assertion, or by adding a provider-specific headers file that GitHub Pages does not consume as arbitrary HTTP response-header configuration.

## Current external-control boundary

No connected provider/CDN control exposed in this session can mutate the production HTTP response headers for the existing GitHub Pages origin. A Vercel integration is present and Vercel supports response-header configuration, but the connected Vercel account exposes no usable project/team scope for this site; migrating hosting blindly is outside the bounded repair and would change production architecture without a verified domain/deployment handoff.

The current GitHub integration likewise has repository source/Actions write capabilities but no external GitHub Pages response-header configuration surface capable of satisfying this transport requirement.

## Closure boundary remains unchanged

Do not close `FRAGMENTED-SECURITY-OWNERSHIP` until all of the following are true:

1. a real hosting/proxy/CDN transport owner emits `X-Content-Type-Options: nosniff` on `https://gospod-bog.ru/`;
2. a fresh exact-head Security Ownership Contract observes that live header and succeeds;
3. all applicable exact-head Product workflows are terminal green;
4. Security head is synchronized to then-current Product `main` with `behind=0` and the declared five-file scope remains collision-clean;
5. review/thread debt is zero;
6. Product merge uses expected-head/CAS;
7. AuditRepo separately reconciles the Security owner after the Product repair is merged.

## MASTER consequence

None. `FRAGMENTED-SECURITY-OWNERSHIP` remains active. This receipt refreshes its current evidence boundary only; it does not change active arithmetic and does not affect `SYS-MAIN-ADMISSION-ENFORCEMENT`.