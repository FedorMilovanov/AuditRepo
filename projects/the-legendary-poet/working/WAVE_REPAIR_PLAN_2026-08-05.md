# Wave repair plan — The Legendary Poet

Current source production baseline: `d03f09188cd0360c6c984ed93d03b1432913332c`.

## W0 — system truth and governance — COMPLETE

Source PR #303 merged as production `69e5d3931bc1d1af635efeaf98c76cf36ce30f41`. Machine contract, live workflow path integrity, current documentation authority, agent concurrency rules, Node 24 baseline and UTC daily content are production contracts.

## Inter-wave closure — discovery integrity and Safari readiness — COMPLETE

Source PR #305 merged as production `44a36bdb97e22827b2026e5622b79a6908d7af03`. Committed sitemap/feed freshness is enforced inside `check:content`, and Safari brand-source QA waits for the official route-loading shell before requiring real raster placements.

## W1 — content-model unification — COMPLETE

The parallel agent's durable Article-retirement work was integrated without rewriting its branch. Stale-base PR #306 was superseded through integration-only #307 and production PR #308.

Production `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8` established one live longform model (`Essay`), five zero-loss legacy draft archives with bounded SHA-256, retained redirects and a permanent content-model contract in both the targeted Node 24 workflow and repository-wide `check:content`.

## W2 — immutable essay publication — COMPLETE

Source agent PR #309 and collision PR #310 were closed as evidence; neither was merged. A one-commit production integration was rebuilt directly on current main and merged through source PR #311 as `a248abd54007bd839ffc149b9195dc4e79dc5dd3`.

Current production publishes all eight essays through one clone → explicit override → derived `readTime` → deep-freeze boundary. Stable `id`/`slug` cannot be overridden, the catalog is frozen and rejects duplicates, Yesenin Part II is constructed without mutating its authoring export, and its specialized validator resolves the canonical catalog object only.

The permanent contract imports and snapshots every raw authoring module before dynamically evaluating the catalog, then proves unchanged raw JSON, distinct raw/published identities, deep freeze, stable catalog lookup, derived reading time and no public-consumer bypass. The existing Content model workflow was extended instead of adding another workflow.

Exact tested source head `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3` passed all 13 PR workflows. Manual Browser QA passed 4/4: Chromium/Android/base iPhone Safari, premium desktop, critical iPhone and independent WebKit home reveal/routes.

## W3 — community scaling — COMPLETE

Source #312 was closed unmerged after a stronger parallel implementation appeared. Source #313 became the durable working lane and fixed the global-corpus architecture, then final production #316 was created directly from exact #313 head `f85aba5803ecc5643b39a5ee4081da86e0174997` and added only the missing Android/iPhone request-topology and failed remote-helpful persistence proof.

Production `4544bb387108a98641313267beafe29deb71ee81` established all eight W3 outcomes:

1. generic application startup performs zero community reads;
2. detail targets load one aggregate summary and a bounded first comment page;
3. comments use stable `(created_at DESC, id DESC)` cursor pagination without equal-timestamp gaps or duplicates;
4. the ratings leaderboard reads aggregate rows for known poet ids only and never downloads raw rating rows or comment bodies;
5. public remote corpora remain ephemeral and are not written wholesale to localStorage;
6. optimistic writes, outbox retry, offline state, cooldowns, helpful votes, cross-tab notification and storage-failure honesty remain intact;
7. schema rollout is additive, with a bounded detail-target fallback and a fail-closed leaderboard when aggregate infrastructure is unavailable;
8. repository validators, desktop Manual Browser QA and permanent Android/iPhone topology prove request boundaries and remote-helpful outbox behavior.

A follow-up parallel review found three narrower production boundaries. Source #317 preserved the first server baseline across repeated edits of one pending rating, made poem quick navigation remote-passive, deferred compact poem-panel reads until explicit activation, repaired invalid device UUIDs and discarded malformed/mismatched outbox operations before retry. Exact head `253376bd8107471e1641027d892ac5207c18f73a` passed the complete matrix and Manual Browser QA 4/4; production is now `d03f09188cd0360c6c984ed93d03b1432913332c`.

## W4 — workflow and performance consolidation — COMPLETE

Source #318 closed both W4 rows without deleting acceptance coverage.

Production `a11f6faff984cd599539e04696717c6fb336329b`, retained by current `d03f09188cd0360c6c984ed93d03b1432913332c`, now enforces:

1. a recorded baseline of one `612.81 KiB` entry asset, one `488.82 KiB` shared asset, 14 lazy route chunks, `1597.1 KiB` total JavaScript and `244.8 KiB` total CSS;
2. a `665,000` byte production-entry ceiling and the same ceiling for every emitted JavaScript asset;
3. `1,800,000` total JavaScript and `300,000` total CSS ceilings;
4. explicit raw-byte budgets for all 14 named route modules, each required to remain a distinct lazy dynamic entry outside the eager graph;
5. a machine-readable `dist/build-budget-report.json` retained by CI;
6. four repository-owned composite actions for Node/dependencies, deterministic build tools, locked Playwright browser installation and preview readiness;
7. shared primitives in CI and all four Manual Browser jobs;
8. retirement of the duplicate community mobile workflow only after Android topology moved into core QA and iPhone topology moved into fresh-process WebKit;
9. dependency-free workflow consolidation and shared-action-aware browser-runtime validators;
10. preservation of all previous route, content, community, brand, interaction, premium and critical-iPhone acceptance contours.

Exact tested head `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6` passed the complete source matrix. Manual Browser QA passed 4/4. Pages was skipped by the normal PR condition.

## W5 — premium browser certification — ACTIVE

W5 owns reader-outcome synthesis, not another architecture rewrite.

Required outcomes:

1. define representative reader journeys across home, poet, poem, article, music, ratings and archive surfaces;
2. certify production-like Chromium and WebKit on desktop and mobile viewports;
3. cover keyboard-only operation, focus order, dialogs/lightboxes, reduced motion and forced colors where supported;
4. cover blocked or unavailable storage, offline/failed community writes and degraded network behavior without dishonest success UI;
5. verify first viewport, navigation continuity, longform readability, audio controls and community activation as user outcomes rather than only implementation tokens;
6. reuse existing build/browser primitives and exact-head identity; adding a duplicate runner is forbidden unless an independent process boundary is proven necessary;
7. preserve current budgets and all W0–W4 gates;
8. run the complete exact-head source matrix and Manual Browser QA 4/4 before promotion.

## W6 — branch/artifact retirement

Selective extraction from the deeply diverged work branch, Arena archive pointers, trigger deletion and dormant candidate retirement review.

## W7 — closure discipline

After every source merge: exact tested head, merge SHA, current-production reverify, matrix transition and next-agent prompt from current truth.

## Non-mixing rule

One wave owns one root-cause family. Do not combine community backend, content migration, brand art and branch deletion in one PR merely to make the diff look "massive". Scale is achieved by shared ownership layers and complete affected-surface closure, not by unrelated file count.
