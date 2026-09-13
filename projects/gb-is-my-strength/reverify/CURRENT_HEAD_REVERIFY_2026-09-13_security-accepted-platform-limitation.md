# Current-head reverify — Security transport accepted platform limitation — 2026-09-13

## Classification

- Root: `FRAGMENTED-SECURITY-OWNERSHIP`.
- Prior state: architectural owner decision.
- Current disposition: **accepted-risk / not-planned under the selected direct GitHub Pages architecture**.
- Product tracking issue: `gb-is-my-strength#1928`.
- Product live anchor observed after current main reached `580e7081d870fcc57d259e720f406a3825630f1f`.
- AuditRepo base: `8dd7be24fd6e23fb9dc29d5ae7ae2865332e224d`.

This receipt does not claim that `X-Content-Type-Options: nosniff` is present.

## Architecture authority

Merged Product #1945 deliberately selected:

`immutable build → GitHub Pages deploy → strict live byte/SHA witness → TTS witness → IndexNow`

and intentionally removed Cloudflare purge / Transform credentials from the HTTP and release control plane while retaining Cloudflare only as authoritative DNS.

The earlier Cloudflare Transform Rules implementation was closed unmerged because restoring a proxied edge would recreate the provider dependency that #1945 removed.

Therefore the owner choice encoded by the merged architecture is direct GitHub Pages publication rather than a separate response-header edge owner.

## Fresh live transport witness

Read-only production probes after the direct-Pages topology was established:

### `https://gospod-bog.ru/`

- HTTP 200
- `server: GitHub.com`
- `via: 1.1 varnish`
- HSTS present
- `X-Content-Type-Options`: **absent**

### `https://gospod-bog.ru/articles/`

- HTTP 200
- direct GitHub Pages serving path
- `X-Content-Type-Options`: **absent**

### deliberate nonexistent route

- HTTP 404
- direct GitHub Pages serving path
- `X-Content-Type-Options`: **absent**

DNS corroboration:

- apex resolves directly to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
- `www.gospod-bog.ru` CNAMEs to `fedormilovanov.github.io`.

## Owner disposition

Reintroducing Cloudflare proxy / Transform ownership solely to emit `nosniff` would reverse the merged #1945 architecture and restore the provider dependency intentionally removed from the release path.

Accordingly, the current GitHub Pages transport-header limitation is explicitly accepted under the selected architecture.

Product issue #1928 received final disposition comment `5649346125` and was closed with state reason `not_planned`.

This is an **accepted platform limitation**, not a successful header implementation.

## MASTER consequence

Remove `FRAGMENTED-SECURITY-OWNERSHIP` from active arithmetic.

New active state:

- direct current defects: 0
- verified necessary improvements: 0
- narrowed residuals: 0
- system verification lanes: 0
- owner decisions: **1**
- active work units: **1**

The only remaining active MASTER owner is `GBS-SEARCH-CONTROL-PLANE-001`.

## Negative boundaries

This closure does not:

- claim that `nosniff` is present;
- re-enable Cloudflare proxying;
- weaken the prohibition on fake transport-only HTML meta pragmas;
- close the separate source-hygiene debt tracked by Product #1937.

The #1937 source debt is a separate cleanup owner and does not require keeping this transport architecture decision active.