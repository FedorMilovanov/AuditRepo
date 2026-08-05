# Verification — system truth, discovery integrity and content-model unification

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Initial matrix baseline: `main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`
- Final production SHA: `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`
- Date: `2026-08-05`
- Result: `passed / production-current`

## Promoted source waves

### W0 — machine-checked project truth

Source PR `#303` passed its exact-head matrix on `d33203ec6583f788774b83d919e5783d9e41bf59` and produced `main@69e5d3931bc1d1af635efeaf98c76cf36ce30f41`.

Verified production outcomes:

- current architecture is represented by `docs/project-contract.json` and a permanent `Project contracts` workflow;
- literal workflow path filters are checked against the live repository tree;
- stale documentation and retired-path instructions are marked historical instead of remaining operational authority;
- Node 24 is the repository baseline;
- daily content rotation is based on a deterministic UTC-day contract rather than local timezone/DST behavior.

### Inter-wave discovery and Safari readiness closure

Source PR `#305` passed the exact-head matrix on `1787b1dc27aa5a7d86f19fb8462d0d001eef94cb` and produced `main@44a36bdb97e22827b2026e5622b79a6908d7af03`.

Verified production outcomes:

- committed `public/sitemap.xml` and `public/feed.xml` are regenerated from canonical data and byte-compared by `validate:discovery-artifacts`;
- the validator restores original files in `finally`, so local and CI worktrees stay clean;
- the validator is included in `check:content` and the repository-wide gate;
- the Safari brand-source test waits for the official route-loading shell to settle, then requires real header/footer raster placements before enumerating sources;
- no sleep, retry wrapper or weakened assertion was introduced.

### W1 — single longform content model

The parallel agent authored durable content retirement on source PR `#306`. Because production moved during that work, its branch was not rebased or force-pushed by the integrator. Its durable content was exact-SHA applied to a branch created from current production through integration-only PR `#307`, then hardened and verified by production PR `#308`.

Source PR `#308` passed the exact-head matrix on `efb097c158f2015c7312ed35492caee2f72f281d` and produced final `main@e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`.

Verified production outcomes:

- `Article`, `Poet.articles`, the generic legacy export and `src/data/library/articles.ts` are absent from runtime;
- one live longform extension point remains: `Essay`;
- five unpublished legacy drafts, 2,116 words total, are preserved under `docs/legacy-content/`;
- every bounded archived body has an executable SHA-256 contract and is marked `НЕ ПУБЛИКАЦИЯ / LEGACY DRAFT`;
- five known compatibility redirects and the unknown-id fallback remain;
- `validate:content-model` is dependency-free, runs in the targeted Node 24 workflow and is also part of repository-wide `check:content`.

## Final exact-head evidence for W1 combined tree

- Content model contract `30998000018` — success
- Project contracts `30997999990` — success
- CI `30998000054` — success
- Brand raster QA `30998000050` — success
- Brand deep reference and motion audit `30998000023` — success
- Site route integrity audit `30998000016` — success
- Articles catalog acceptance `30998000005` — success
- Yesenin Part I browser acceptance `30998000010` — success
- Yesenin Part II safe publication `30997999986` — success
- Manual Browser QA `30997999988` — success, 4/4 jobs
- Request Pages deployment `30998000261` — expected PR skip

Manual Browser QA passed premium desktop, critical iPhone, Safari reveal/routes, core Chromium/Android and isolated base iPhone Safari processes on the same exact combined head.

## Concurrency and stale-base disposition

- PR `#304` was closed unmerged after parallel PR `#303` moved production main.
- PR `#305` reapplied the discovery repair from the new production base and was merged only after a fresh exact-head matrix.
- The agent branch for PR `#306` was not modified by the integration lane.
- PR `#307` targeted only a non-production integration branch.
- PR `#308` was created from production after `#305`, passed a complete combined matrix and used expected-head squash protection.
- After production merge the agent independently reconstructed its branch at `53e7168aaf5b6c6351a7e45658666f1de52f3ec9`; comparison showed the same 25-file Article-retirement surface, one ahead and one behind final main, with no unique unintegrated production repair.

## Promotion decision

Promote the following rows to `fixed-current`:

- `TLP-SYS-003` — working root-cause matrix established by AuditRepo `#177`;
- `TLP-ARCH-001` — dual Article/Essay longform model removed in production;
- `TLP-DISC-001` — committed discovery artifact freshness enforced;
- `TLP-QA-002` — Safari route-loading readiness race removed from the brand-source audit.

Keep W2–W6 findings open. This closure does not claim immutable essay composition, community scaling, workflow consolidation, full premium certification or branch retirement.
