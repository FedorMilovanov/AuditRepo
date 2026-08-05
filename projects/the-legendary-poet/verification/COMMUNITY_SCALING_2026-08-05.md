# Verification — W3 community scaling

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Previous production: `a248abd54007bd839ffc149b9195dc4e79dc5dd3`
- Final source PR: `#316`
- Exact tested head: `a810a2a9bdcf9a150c73d4adea703e95ae6bd71a`
- Production merge: `4544bb387108a98641313267beafe29deb71ee81`
- Date: `2026-08-05`
- Result: `passed / production-current`

## Root cause closed

Generic application startup unconditionally initiated remote community hydration. The client could page through up to 20,000 ratings and 20,000 comments, persist that public corpus in localStorage, and only afterward filter it by target or recompute leaderboard aggregates from raw rows and comment bodies.

## Verified repair

- `App` performs no generic community read;
- browser persistence moved to a bounded v3 device-owned envelope with a bounded outbox;
- v2 migration preserves pending work and own ratings while discarding cached public corpora;
- target subscriptions are explicitly `passive`, `summary` or `full`;
- detail surfaces fetch one target aggregate and bounded comment pages;
- comment pagination uses `(created_at DESC, id DESC)` with a stable equal-timestamp cursor;
- remote pages stay in memory and merge with pending local ratings, comments and helpful votes;
- `/ratings` uses one bounded aggregate request for known poet ids and never reads raw ratings or comment bodies;
- when the aggregate view is unavailable, the leaderboard fails closed rather than issuing raw per-poet fan-out reads;
- a bounded target-only fallback supports additive backend rollout on detail surfaces;
- backend aggregate view, cursor indexes, grants, UUID id validation and 2,000-character comment limit were added without removing existing safe compatibility views/RPCs;
- the static community validators run in repository-wide `check:content`;
- desktop topology remains inside mandatory Manual Browser QA;
- a permanent exact-head mobile workflow runs startup, detail, cursor, helpful/outbox and leaderboard request contracts on Android Pixel 7 Chrome and iPhone Safari/WebKit;
- the remote-helpful test proves failed delivery remains optimistic and queued across reload without persisting the remote comment page.

## Concurrency reconciliation

Source `#312` was closed unmerged after a stronger parallel implementation appeared. Source `#313` became the parallel working lane and advanced through loopback-only QA enablement and community-panel-scoped pagination fixes. Final production `#316` was created directly from exact `#313` head `f85aba5803ecc5643b39a5ee4081da86e0174997`, then added only the missing Android/iPhone topology and offline-helpful persistence evidence. Non-production transfer `#315` was closed without merge after a Git-history-only conflict; no code was discarded.

## Exact-head workflow evidence

- Articles catalog acceptance `31021415449` — success
- Site route integrity audit `31021415328` — success
- Content model contract `31021415366` — success
- Project contracts `31021415326` — success
- Community scaling mobile contract `31021415490` — success
- Brand raster QA `31021415405` — success
- CI `31021415406` — success
- Yesenin Part II safe publication `31021415335` — success
- Yesenin Part I browser acceptance `31021415387` — success
- Brand deep reference and motion audit `31021415346` — success
- Manual Browser QA `31021415332` — success, 4/4 jobs
- Request Pages deployment `31021415360` — expected PR skip

Manual Browser QA passed Chromium/Android/base iPhone Safari, premium desktop, critical iPhone and independent WebKit home reveal/routes on the exact head. The dedicated mobile contract separately passed all four request-topology cases on both Android Chrome and iPhone Safari/WebKit.

## Post-merge production readback

- `src/App.tsx` on source `main` contains no community hydration call;
- `src/utils/communityRemote.ts` declares the aggregate summary view, 10-row default comment pages, 50-row maximum pages, 100-target leaderboard bound and loopback-only QA configuration seam;
- `src/utils/communityStore.ts` declares the v3 local envelope, 500-entry local bound and 500-item outbox bound;
- `.github/workflows/community-scaling-browser.yml` is present on production `main` and verifies exact checkout identity before validators, build and two-engine browser proof.

## Promotion decision

Promote `TLP-COMM-001` to canonical `fixed-current` on source production `4544bb387108a98641313267beafe29deb71ee81`.

Activate W4 for workflow/performance consolidation. Keep W5–W6 and separate governance open. This closure does not claim broader reader-outcome certification, branch retirement or owner-controlled package/license decisions.
