# Verification — W2 immutable essay publication

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Previous production: `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`
- Final source PR: `#311`
- Exact tested head: `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3`
- Production merge: `a248abd54007bd839ffc149b9195dc4e79dc5dd3`
- Date: `2026-08-05`
- Result: `passed / production-current`

## Root cause closed

The canonical essay catalog mutated imported authoring modules after module evaluation. Yesenin Part II sources and blocks were reassigned, then catalog reading times were written in place. Publication behavior therefore depended on import order and shared mutable identity.

## Verified repair

- all eight essays are published through one clone → override → derived-read-time → deep-freeze boundary;
- publication overrides cannot replace stable `id` or `slug`;
- the catalog array and every nested published object are frozen;
- duplicate published ids and slugs fail at catalog construction;
- Yesenin Part II source URLs and image credits are composed without mutating its authoring export;
- raw authoring modules are snapshotted before dynamic catalog evaluation and remain JSON-equivalent afterward;
- canonical lookup returns the same stable published object;
- page, search, sitemap, feed, prerender and validator consumers are prevented from bypassing the catalog module;
- `validate:essay-publication` runs in repository-wide `check:content` and in the exact-checkout Content model workflow;
- no standalone duplicate workflow, generated artifact, package-lock change or temporary executor entered production.

## Concurrency reconciliation

Source PRs `#309` and `#310` independently addressed W2 and were both closed unmerged after overlap was detected. Production PR `#311` became the single integration lane, preserving the strongest invariants from both without rewriting either historical branch.

AuditRepo PR `#179` already merged the working matrix transition and activated W3. This verification file promotes the canonical W2 evidence without rewriting that parallel working-state update.

## Exact-head workflow evidence

- Content model contract `31001131944` — success
- Project contracts `31001131962` — success
- CI `31001131954` — success
- Articles catalog acceptance `31001131923` — success
- Yesenin Part I safe publication `31001131852` — success
- Yesenin Part I browser acceptance `31001131889` — success
- Yesenin Part II safe publication `31001131849` — success
- Yesenin Duncan safe publication `31001131855` — success
- Site route integrity audit `31001131888` — success
- Brand raster QA `31001131880` — success
- Brand deep reference and motion audit `31001131933` — success
- Manual Browser QA `31001131881` — success, 4/4 jobs
- Request Pages deployment `31001131882` — expected PR skip

Manual Browser QA passed Chromium, Android Chrome, base iPhone Safari, premium desktop, critical iPhone and the independent WebKit reveal/route process on the same exact head.

## Promotion decision

Promote `TLP-ARCH-002` to canonical `fixed-current` on source production `a248abd54007bd839ffc149b9195dc4e79dc5dd3`.

Keep W3–W6 open. W3 is active-current, not fixed. This closure does not claim community scaling, workflow consolidation, broader premium certification or branch retirement.
