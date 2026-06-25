# arena-agent-2 — P0-NEW (SW 404) is a FALSE POSITIVE — 2026-06-25

**Agent:** `arena-agent-2`
**Target claim:** `incoming/arena-agent-round5/.../VERIFICATION_AUDIT_ROUND5.md` —
"P0-NEW — SW precaches non-existent `site-layered.css` / `site-modules.js` → 404 on all
SW-enabled pages" (round5 raised the total to 64).
**Verdict:** FALSE POSITIVE for production. Confirmed count stays 63.

## Method
Code-trace + deterministic simulation of `scripts/copy-legacy-to-dist.js` against the
real `migration/page-ownership.json`.

## Why the files ARE in production dist

`gospod-bog.ru` is a **strangler** project. Production `dist/` =
`strangler:build:production-like` = `astro build` + `scripts/copy-legacy-to-dist.js`.
The latter copies legacy root dirs wholesale:

- `PUBLIC_DIRS` (copy-legacy-to-dist.js lines 56, 63) includes `'css'` and `'js'`.
- line 274: `for (const dir of PUBLIC_DIRS) copyDir(ROOT/dir, DIST/dir, …)`.
- `copyDir` copies every file; the only skip is an Astro-owned ROUTE match.

`astroRoutes` = page routes from `page-ownership.json` (52 astro-owned HTML pages).
`/css/site-layered.css` and `/js/site-modules.js` are assets, NOT routes → not skipped →
copied to dist.

## Deterministic proof output

```
astroRoutes contains 52 astro-owned ROUTES (HTML pages)
  contains /css/site-layered.css? false
  contains /js/site-modules.js?  false
PUBLIC_DIRS contains css? true | js? true
[css/site-layered.css] shouldSkipLegacyFile:false => COPIED to dist? YES
[js/site-modules.js]   shouldSkipLegacyFile:false => COPIED to dist? YES
```

## Why round5 saw "No such file" in dist

They almost certainly inspected a **plain `astro build` dist** (Astro only emits
imported assets), not the production **strangler** dist. This is the exact build-mode
trap `verification/RECHECK_PROTOCOL_2026-06-25.md` flags (trust order #1 =
production-like dist).

## What stays VALID (do not throw out with P0-NEW)

- **P0-7 / P0-8**: these files are in `sw.js` precache but NOT in `cache-bust.js`
  ASSETS → real cache-invalidation drift (their `?v=` never updates). Still P0.
- **NEW-8 (P2)**: these files are precached but never `<link>`ed from any page →
  wasteful precache; legitimate P2 cleanup, NOT a P0 404.

## Logged as C-08
See `verification/CONFLICT_REGISTRY_2026-06-25.md` §C-08 for the full write-up and the
action for the final verifier (drop P0-NEW; count back to 63).
