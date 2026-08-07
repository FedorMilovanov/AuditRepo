# MAP-P1-20 Karty shared-engine freshness closure — 2026-08-07

## Scope

- AuditRepo base: `7a17c9b2f58f1bfce08f8485fe8b9bb8558e79f2`.
- Product repair PR: `FedorMilovanov/gb-is-my-strength#1153`.
- Product exact repair base: `c42d0d585133e8fea8dfdd43bec851740eedc9e8`.
- Product exact repair head: `dc6f7d1fb8acb3704b050263187c291730e24a34`.
- Product squash merge: `c99f15b102494282a41d31f90838b9856475bb1b`.
- Product mutation surface: exactly 3 files.
- AuditRepo work unit closed: `MAP-P1-20`.

## Re-verified current root

The public Ishod route still loaded the shared engine as unversioned `/karty/_engine/map-engine.js`.

Current `sw.js` classified same-origin `.js` as static. Revisioned static assets were already network-first, but unversioned static assets fell through to:

```js
cacheFirst(request, CACHE_STATIC)
```

Therefore a previously cached shared MapEngine could remain stale while the user was online. The engine was not in `PRECACHE_ASSETS`; it became a runtime cache entry only after use.

The defect was therefore a Service Worker strategy problem, not a requirement to mutate the large MapEngine runtime or the Ishod route again.

## Product repair

PR #1153 changed only:

1. `sw.js`;
2. `scripts/sw-dist-readiness-audit.js`;
3. `scripts/sw-offline-browser-test.mjs`.

`sw.js` now recognizes exactly the same-origin path `/karty/_engine/map-engine.js` as an unversioned runtime requiring freshness. The static-asset branch preserves the existing hierarchy:

- revisioned static → `revisionedStaticNetworkFirst`;
- exact Karty shared engine → `networkFirstWithCache(request, CACHE_STATIC)`;
- every other unversioned static asset → existing generic `cacheFirst`.

This preserves offline behavior: a successful online request updates the runtime entry in `CACHE_STATIC`; when the network is unavailable, `networkFirstWithCache` returns the latest cached engine.

No route, MapEngine source, route JSON, CSS, cache-version baseline or offline-route matrix changed.

## Why `CACHE_VERSION` was not bumped

Current governed cache identity remained:

`gb-v197-bible-legacy-authority-20260804`.

The baseline requires `sw.js` to match `currentExpectedCacheVersion`; an additional bump is mandatory only under the explicit deploy-switch `--require-cache-bump` boundary. This repair changes the request strategy itself: the online network-first request replaces an existing runtime cache entry, so retaining the current cache namespace does not preserve the stale-online defect.

The exact A07 static audit confirmed the current cache version still matched the governed baseline.

## Permanent source/static contract

The existing A07 owner `scripts/sw-dist-readiness-audit.js` was extended rather than creating a new workflow. On exact Product head `dc6f7d1f...`, the Deploy Candidate log reported:

- `Karty shared map-engine.js is excluded from PRECACHE_ASSETS` — PASS;
- `sw.js Karty engine selector: exact shared map-engine network-first selector` — PASS;
- `sw.js Karty engine strategy: unversioned Karty engine uses network-first with static-cache offline fallback before generic cache-first` — PASS;
- `SW dist readiness audit passed`.

This protects both the exact path and the ordering of the network-first exception before the generic unversioned-static cache-first fallback.

## Real Chromium Service Worker proof

The existing `scripts/sw-offline-browser-test.mjs` was extended with a real Service Worker/CacheStorage scenario on production-like `dist`:

1. cold install confirms the Karty engine is not precached;
2. first online fetch returns fixture `old` and creates the runtime cache entry;
3. the server changes to fixture `new`;
4. second online fetch returns `new`, proving the network beats the cached `old` value;
5. browser goes offline;
6. the same engine request returns cached `new`;
7. server request count remains exactly two, proving the offline response came from CacheStorage.

Direct exact-head log:

- `cold atomic install — 31 complete precache entries; Karty engine remains runtime-fetched` — PASS;
- `Karty engine online freshness + offline fallback — old runtime cache replaced by online new value; latest value remains available offline` — PASS;
- complete A07 Chromium witness: **10/10 scenarios passed**;
- witness digest: `sha256:79f9bcb2ad69bd9664b63b893d9fa7d5e722c273028b6a550cc02ab82b5cd3ad`.

## Exact Product merge boundary

Exact Product head `dc6f7d1fb8acb3704b050263187c291730e24a34` registered four workflow groups, all terminal `success`:

- `Metadata & IndexNow Readiness`;
- `Shared Files Guard`;
- `Deploy Candidate Contract`;
- `Search Scripture Occurrence Runtime`.

The decisive Deploy Candidate run was:

- run ID: `31176298806`;
- job ID: `92858986313`;
- production-like build: PASS;
- Pagefind build: PASS;
- A07 static audit: PASS;
- deterministic Offline/PWA Chromium witness: PASS;
- series reader fragment contract: PASS;
- production-like dist publication audit: PASS;
- public URL contract compare: PASS.

Deploy Candidate artifact:

- artifact ID: `8993049163`;
- artifact ZIP SHA-256: `0610129c915868ec55e5a15682541aad850c95ba926f26469400df6dffbc5422`.

PR merge boundary:

- branch `behind_by=0`;
- diff: exactly 3 files, `+42/-4`;
- mergeable: true;
- comments: 0;
- review threads: 0;
- submitted reviews: 0;
- current Product main remained `c42d0d58...` through the final exact-head check.

The PR was squash-merged with `expected_head_sha=dc6f7d1f...`, producing Product commit `c99f15b102494282a41d31f90838b9856475bb1b`.

Post-merge compare `c42d0d58... -> c99f15b1...` is exactly one commit and exactly the same three SW/A07 files. No concurrent Product merge entered between final green authorization and the squash merge.

## Disposition

`MAP-P1-20` is `closed-by-fix-in-cache-owner`.

The public Ishod engine URL remains unversioned, but the stale-online-cache failure mode no longer exists: the true Service Worker owner fetches the engine network-first online and retains the newest successful engine as offline fallback.

Correct closure wording:

> The unversioned shared Karty engine is no longer served cache-first while online. Its exact Service Worker route is network-first with runtime static-cache fallback, and a real Chromium Service Worker witness proves cached old bytes refresh to new online and the new bytes remain available offline.

MASTER delta:

- active work units: `23 -> 22`;
- direct current defects: `13 -> 12`;
- verified necessary improvements: `4` unchanged;
- system lanes: `2` unchanged;
- owner decisions: `4` unchanged.

## Next boundary

Several remaining defects (`MAP-P1-11`, `WAYP-P1-01`, `AR-IDX-09`, `S-SEC-01`) remain current but their true owners are large shared/minified files for which the present connector has no safe text-hunk mutation API. Do not replace them with route-local or post-filter workarounds merely to reduce the matrix. Prefer the next root with a compact true owner and executable regression boundary.
