# Verification Wave Report — W7 route/runtime truth

## Meta

- Project: The Legendary Poet
- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Wave type: systemic repair verification and AuditRepo proportional closure
- Source PR: #331
- Exact tested head: `19fd978fcaf7513be93e7222c0caa9f0a5332bda`
- Squash merge: `5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Source base: `aa2e37573453480531825c8962c372596513f9f2`

## 1. Why this wave existed

Route behavior was governed by several independent lists and implementation details:

- JSX routes and redirects in `App.tsx`;
- lazy import ownership in `routeModules.ts`;
- sitemap generation;
- route-audit inventory;
- build-budget tables;
- catalog acceptance assumptions.

This duplication created one systemic mechanism rather than isolated defects. It allowed a broad `/articles/:id` fallback to behave as a soft-404, made validators preserve stale string literals, and required repeated manual synchronization whenever a route changed.

Related outcome defects belonged to the same wave because they exposed the same weak boundary between declared contract and runtime truth:

- focus was not transferred when navigation returned to the URL that opened the SPA session;
- the essay renderer silently normalized invalid adjacent headings instead of requiring publication validation;
- archive removal had a separate boolean/silent-failure contract;
- affected browser tests used fixed sleeps or stale soft-redirect expectations.

## 2. Root-cause classification

- Classification: `systemic-root` before repair.
- System owner: route/runtime declaration and its consumers.
- Duplicate symptoms absorbed by the system fix:
  - manual Router path list;
  - manual redirect list;
  - independent sitemap entries;
  - independent route QA inventory;
  - independent route budget mapping;
  - unknown article soft-404 acceptance.
- Independent but bundled outcome contract: archive mutation honesty, because the permanent reader journey and old validators otherwise continued to encode silent failure.

## 3. Implemented system measure

`src/routes/route-contract.json` became the machine-readable owner of:

- route ids and paths;
- lazy page modules;
- explicit historical redirects;
- sitemap participation;
- route-audit roles;
- prefetch eligibility;
- per-route build budgets.

The source runtime and validators derive from that contract. Unknown `/articles/:id` paths now preserve the requested URL and reach the standard NotFound boundary with `noindex`; only named historical paths redirect.

Additional class-level outcomes:

- every real pathname transition owns focus after route settlement, including return to the initial session path;
- invalid essay structure must fail validation rather than being repaired by the renderer;
- archive mutations use `added | removed | unchanged | failed | invalid`;
- rejected archive removal preserves the visible card and stored item and reports that the list did not change;
- affected waits use observable route, heading, busy-region and font readiness instead of fixed sleeps.

## 4. Evidence angles

### Source witness

The final source diff changed 22 files and added the central route contract, derived consumers, structured archive outcomes, updated validators and permanent browser journeys. No transport payload, generated binary or temporary workflow was merged into production.

### Build/artifact witness

The exact head passed TypeScript, production build, fourteen lazy route chunks, entry/route/asset/aggregate budgets, prerender and SEO/discovery validation.

### Browser witness

- Articles catalog acceptance passed on Chromium, Android and iPhone, including explicit known redirects and unknown article NotFound/noindex behavior.
- Site route integrity crawled at least 35 canonical, utility, redirect and NotFound URLs.
- Manual Browser QA completed all four jobs:
  - premium desktop;
  - critical iPhone first viewport and reduced motion;
  - Chromium/Android plus fresh-process iPhone suite;
  - independent desktop WebKit reveal/route suite.
- A permanent blocked-removal journey proves that rejected persistence does not remove the archive card or stored item and exposes an honest status message.

### Lifecycle witness

Several CI failures during the PR were stale acceptance contracts, not evidence that the new behavior was wrong. Each was updated to test the new machine contract or user-visible invariant:

- W4 validator stopped requiring old route-budget literals and boolean mutation results;
- content-model validator stopped requiring the broad `/articles/:id` fallback;
- archive unit validator learned the structured outcomes and preserved baseline;
- catalog acceptance stopped treating unknown article ids as successful redirects.

No timeout or retry policy was weakened to obtain green status.

## 5. Exact-head workflow result

Successful on `19fd978fcaf7513be93e7222c0caa9f0a5332bda`:

- Project contracts — run `31063594585`;
- Content model contract — run `31063594655`;
- CI — run `31063594620`;
- Articles catalog acceptance — run `31063594602`;
- Site route integrity audit — run `31063594606`;
- Brand deep reference and motion audit — run `31063594601`;
- Yesenin Part II safe publication — run `31063594594`;
- Manual Browser QA — run `31063594631`, all four jobs successful.

Pages deployment was skipped by the normal pull-request condition and is not a failed product gate.

## 6. Promotion and branch lifecycle

- PR #331 was mergeable, behind by zero and had no reviews or review threads before promotion.
- Expected-head squash merge produced `5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`.
- A failed earlier transport experiment was closed unmerged before source publication and did not alter the production tree.
- A one-time exact-SHA cleanup physically removed the two stale W7 refs and its own maintenance ref.
- Post-clean source inventory contained only `main` and the intentionally retained `archive/deep-research-local-images-20260724` evidence branch.

## 7. Disposition

- `ST-TLP-ROUTE-AUTHORITY` → `absorbed/closed`.
- Unknown article soft-404 → `closed-by-fix`.
- Route focus return bug → `closed-by-fix`.
- Renderer normalization of invalid headings → `closed-by-fix`.
- Archive removal silent failure → `closed-by-fix`.
- Stale acceptance-contract symptoms → `absorbed-by-system-fix` or corrected audit harness.
- Media provenance and rights → remains independent `owner-decision`.

The historical working matrix is not rewritten in this wave. Its old statuses remain evidence at their anchors; this report, `SYSTEM_THEMES.md` and `CLOSURE_LEDGER.md` own the proportional new-model disposition.

## 8. Definition of Done result

PASS:

- common mechanism proved;
- common owner implemented;
- representative source/build/browser sample passed;
- class-level regression guards retained in source;
- exact tested head and merge identity recorded;
- branch lifecycle cleaned without deleting the evidence archive;
- independent editorial/rights boundary explicitly preserved;
- no live claim made where live evidence was unnecessary.
