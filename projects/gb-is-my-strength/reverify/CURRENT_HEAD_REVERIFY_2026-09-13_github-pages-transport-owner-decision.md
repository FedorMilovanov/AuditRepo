# Current-head reverify — GitHub Pages transport owner decision — 2026-09-13

## Classification

- Root: `FRAGMENTED-SECURITY-OWNERSHIP`.
- Prior classification: system verification lane.
- Current classification: **architectural owner decision**.
- Product tracking: `gb-is-my-strength#1928`.
- Product current `main` during this reverify: `9bf46679f3aab3f72d540dc9f344903bc94bf868`.
- AuditRepo base: `4026be1c101ec9ca1185ccfe1587c05b41ffbc19`.

This receipt does **not** claim that the missing transport header is fixed. It narrows the remaining work to the layer that can actually own it.

## Witness 1 — Product release topology

The authoritative Product release workflow is `Deploy to GitHub Pages`.

Current repository evidence shows:

- exact immutable release bytes are promoted with GitHub Pages Actions;
- `actions/upload-pages-artifact` and `actions/deploy-pages` own publication;
- the current architecture intentionally keeps HTTP publication direct to GitHub Pages;
- Cloudflare is not a Product response-header mutation dependency in the selected release topology.

The previous Cloudflare Transform Rules repair path was already closed unmerged and superseded during the release-topology reconciliation recorded in Product issue #1928.

Therefore there is no current repository-local writer that can emit an arbitrary transport response header after GitHub Pages serves the bytes.

## Witness 2 — live transport surface

Read-only HEAD probes on the current production custom domain:

### `https://gospod-bog.ru/`

- HTTP 200
- `server: GitHub.com`
- `via: 1.1 varnish`
- `Strict-Transport-Security: max-age=31556952`
- `X-Content-Type-Options`: **absent**
- transport `Content-Security-Policy`: **absent**
- transport `Referrer-Policy`: **absent**

### `https://gospod-bog.ru/articles/`

- HTTP 200
- `server: GitHub.com`
- `via: 1.1 varnish`
- `X-Content-Type-Options`: **absent**

The historical GitHub Pages path `https://fedormilovanov.github.io/gb-is-my-strength/` currently redirects to the custom domain and its redirect response is also served by `GitHub.com`; it does not expose an independent repository-owned header layer.

## Witness 3 — DNS / ownership layer

Current DNS resolution:

- apex `gospod-bog.ru` resolves directly to GitHub Pages addresses:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www.gospod-bog.ru` CNAMEs to `fedormilovanov.github.io`;
- authoritative DNS remains on Cloudflare nameservers.

This is consistent with the selected DNS-only Cloudflare topology: DNS can point at Pages, but the current Product deployment does not own a response-header rewrite layer.

## Root-cause disposition

The old wording made this look like an unfinished Product system lane: “add a real live response-header owner”.

That is no longer the most precise current classification.

Under the selected direct-GitHub-Pages topology, the missing `nosniff` header is a **platform/topology boundary**. Repository HTML, CSP meta, build output and GitHub Actions artifact construction cannot create a response header that is added only by the HTTP serving layer.

Therefore the remaining action is an owner choice, not an open repository repair:

1. **Accept the direct-Pages limitation** and explicitly record `X-Content-Type-Options` absence as accepted risk; or
2. **Introduce a transport/header owner** — for example a proxy/CDN response-header rule or a hosting platform that supports the required header — then admit a bounded implementation lane and verify the live response independently.

A fake HTML `http-equiv` substitute remains invalid closure.

## MASTER consequence

The number of active owners does not change, but the arithmetic/classification does:

- direct current defects: 0
- verified necessary improvements: 0
- narrowed residuals: 0
- system verification lanes: **0**
- owner decisions: **3**
- active work units: **3**

The other two owner decisions remain:

- `SYS-MAIN-ADMISSION-ENFORCEMENT`;
- `GBS-SEARCH-CONTROL-PLANE-001`.

## Negative boundaries

This reverify does not:

- claim that `nosniff` is present;
- re-enable Cloudflare proxying;
- mutate Cloudflare, DNS or GitHub Pages settings;
- create a competing Product security branch;
- weaken document-policy/CSP source contracts;
- use HTML meta as a response-header substitute.

It only corrects the active causal classification so future agents do not search for a repository-only repair that the selected serving topology cannot provide.
