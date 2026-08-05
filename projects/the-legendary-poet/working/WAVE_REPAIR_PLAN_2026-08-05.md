# Wave repair plan — The Legendary Poet

Current source production baseline: `a248abd54007bd839ffc149b9195dc4e79dc5dd3`.

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

## W3 — community scaling — ACTIVE

Confirmed current root cause:

- `App` unconditionally calls global remote hydration during generic startup;
- the remote client can page through up to 20,000 rating rows and 20,000 comment rows;
- the resulting global corpus is persisted locally;
- target stores and the leaderboard filter or aggregate only after that wholesale download.

W3 owns one isolated source lane with these required outcomes:

1. generic application startup performs zero community reads;
2. a detail target loads only its aggregate summary and a bounded first comment page;
3. comments use stable cursor pagination with no duplicates or gaps under equal timestamps;
4. the ratings leaderboard reads aggregate rows only and never downloads comment bodies;
5. remote corpora are not written wholesale to localStorage;
6. optimistic writes, outbox retry, offline state, cooldowns, helpful votes and cross-tab notification remain intact;
7. existing schema rollout is additive, with a bounded target-only fallback until aggregate infrastructure is deployed;
8. static validators and browser request-topology tests prove the contract on the exact head.

Do not mix W3 with W4 workflow consolidation, content changes, brand work or branch retirement.

## W4 — workflow and performance consolidation

Create reusable setup/build/browser primitives while preserving route/content-specific acceptance; establish chunk budgets.

## W5 — premium browser certification

Production-like Chromium/WebKit, desktop/mobile, keyboard, reduced motion, blocked storage/network and real reader tasks.

## W6 — branch/artifact retirement

Selective extraction from the deeply diverged work branch, Arena archive pointers, trigger deletion and dormant candidate retirement review.

## W7 — closure discipline

After every source merge: exact tested head, merge SHA, current-production reverify, matrix transition and next-agent prompt from current truth.

## Non-mixing rule

One wave owns one root-cause family. Do not combine community backend, content migration, brand art and branch deletion in one PR merely to make the diff look "massive". Scale is achieved by shared ownership layers and complete affected-surface closure, not by unrelated file count.
