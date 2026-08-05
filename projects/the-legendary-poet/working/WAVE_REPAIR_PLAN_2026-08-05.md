# Wave repair plan — The Legendary Poet

Current source production baseline: `4544bb387108a98641313267beafe29deb71ee81`.

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

Exact tested source head `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3` passed all 13 PR workflows. Manual Browser QA passed 4/4: Chromium/Android/base iPhone Safari, premium desktop, critical iPhone and independent WebKit home reveal/routes.

## W3 — community scaling — COMPLETE

Source #312 was closed unmerged after a stronger parallel implementation appeared. Source #313 became the durable working lane and fixed the global-corpus architecture, then final production #316 was created directly from exact #313 head `f85aba5803ecc5643b39a5ee4081da86e0174997` and added only the missing Android/iPhone request-topology and failed remote-helpful persistence proof.

Production `4544bb387108a98641313267beafe29deb71ee81` now enforces all eight W3 outcomes:

1. generic application startup performs zero community reads;
2. detail targets load one aggregate summary and a bounded first comment page;
3. comments use stable `(created_at DESC, id DESC)` cursor pagination without equal-timestamp gaps or duplicates;
4. the ratings leaderboard reads aggregate rows for known poet ids only and never downloads raw rating rows or comment bodies;
5. public remote corpora remain ephemeral and are not written wholesale to localStorage;
6. optimistic writes, outbox retry, offline state, cooldowns, helpful votes, cross-tab notification and storage-failure honesty remain intact;
7. schema rollout is additive, with a bounded detail-target fallback and a fail-closed leaderboard when aggregate infrastructure is unavailable;
8. repository validators, desktop Manual Browser QA and a permanent exact-head Android/iPhone workflow prove the request topology and remote-helpful outbox contract.

Exact tested head `a810a2a9bdcf9a150c73d4adea703e95ae6bd71a` passed Project contracts, Content model, CI, catalog, route integrity, Yesenin publication/browser gates, both brand lines, Manual Browser QA 4/4 and Community scaling mobile contract. Pages was skipped by the normal PR condition.

## W4 — workflow and performance consolidation — ACTIVE

W4 owns two linked current findings: repeated exact-checkout/setup/build/browser workflow primitives and limited entry/chunk budget margin.

Required outcomes:

1. inventory duplicated setup, deterministic asset, build, preview and browser-install blocks before changing workflow structure;
2. introduce reusable primitives only where exact-head identity, artifacts, timeouts and failure visibility remain equivalent or stronger;
3. preserve every route/content/brand/community/browser acceptance contour; consolidation by deleting checks is forbidden;
4. record current production entry and route-chunk measurements before setting budgets;
5. enforce an entry ceiling and route-specific chunk budgets with explicit exceptions rather than one opaque total-size number;
6. keep content, community backend behavior, brand art and branch retirement outside W4;
7. run the complete exact-head source matrix and Manual Browser QA 4/4 before promotion.

## W5 — premium browser certification

Production-like Chromium/WebKit, desktop/mobile, keyboard, reduced motion, blocked storage/network and real reader tasks.

## W6 — branch/artifact retirement

Selective extraction from the deeply diverged work branch, Arena archive pointers, trigger deletion and dormant candidate retirement review.

## W7 — closure discipline

After every source merge: exact tested head, merge SHA, current-production reverify, matrix transition and next-agent prompt from current truth.

## Non-mixing rule

One wave owns one root-cause family. Do not combine community backend, content migration, brand art and branch deletion in one PR merely to make the diff look "massive". Scale is achieved by shared ownership layers and complete affected-surface closure, not by unrelated file count.
