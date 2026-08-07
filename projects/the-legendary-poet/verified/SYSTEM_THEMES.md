# System Themes — the-legendary-poet

Системные темы объединяют повторяющиеся симптомы по общему mechanism. Это не автоматически актуальный bug list: выбранную тему нужно узко проверить на текущем source перед новой реализацией.

## Status model

- `evidence-rich` — значимый исторический corpus;
- `candidate` — правдоподобная тема, не выбранная для работы;
- `active-work` — владелец выбрал реализацию;
- `absorbed/closed` — общий mechanism устранён и репрезентативно защищён;
- `parked` — признано, но не выбрано;
- `owner-decision` — требуется editorial/rights/product decision.

## ST-TLP-CONTENT-AUTHORITY — One public longform model

- Status: `absorbed/closed` by W1–W2.
- Historical manifestations: параллельные Article/Essay models, mutation of imported authoring objects, duplicated derived metadata.
- System outcome: one Essay publication boundary with clone/override/derived-read-time/deep-freeze semantics and zero-loss archival.
- Reverify trigger: material change to essay schema, publication registry or renderer ownership.

## ST-TLP-POET-SOURCE-AUTHORITY — Canonical poet modules own reader-facing portrait prose

- Status: `absorbed/closed` by source PR #336.
- Historical manifestation: the canonical ten poet modules still contained pre-rewrite `moralPortrait` / `authorCommentary` values while a central `editorialPortraitOverrides.ts` layer replaced those fields for publication.
- Common mechanism: two source owners existed for the same reader-facing editorial fields, so inspecting one poet module did not reveal the exact prose delivered by the catalog.
- System outcome:
  - all ten canonical poet modules own their final portrait and conclusion prose directly;
  - `editorialPortraitOverrides.ts` is deleted;
  - `library/index.ts` publishes the imported poet objects directly with no clone, map, override or mutation layer;
  - `validate-poet-authority.ts` requires direct identity and exactly one source owner for the editorial fields;
  - the complete Pasternak record is preserved while only its two intended editorial fields changed.
- Source anchor: PR #336 exact tested head `8e22188f98b9eaa39bab044794a7852e9b746f8d`, squash merge `dc37961cf64de5400e622d9c3d202634ed135100`.
- Regression witness: Project contracts, Content model, full CI/build/budgets/prerender/SEO, route/catalog/Yesenin/brand gates and Manual Browser QA 4/4.
- Detailed evidence: `../verification/2026-08-07-canonical-poet-authority-wave/REPORT.md`.
- Reverify trigger: any publication-time poet override, clone/mutation boundary, duplicate editorial-field ownership or catalog identity drift.

## ST-TLP-COMMUNITY-OWNERSHIP — Target-scoped community state

- Status: `absorbed/closed` by W3 and hardening.
- Historical manifestations: global startup hydration, unstable pending baselines, detail N+1 reads, poison persisted identities/outbox rows.
- System outcome: target/aggregate reads, bounded persistence/outbox and stable recovery contracts.
- Reverify trigger: backend topology or persisted-state format change.

## ST-TLP-WORKFLOW-PERFORMANCE — Shared CI primitives and measured budgets

- Status: `absorbed/closed` by W4, strengthened by W7.
- Historical manifestations: duplicated setup/build/browser primitives and independently maintained route budgets.
- System outcome: shared workflow actions, locked browser runtime, measured build reports and route-specific budgets owned by the route contract.
- Reverify trigger: build system, chunking strategy or workflow ownership change.

## ST-TLP-READER-OUTCOMES — Honest longform and archive behavior

- Status: `absorbed/closed` by W5 and W7.
- Historical manifestations: incomplete cross-browser reader synthesis, silent archive failures, unstable route readiness and fixed sleeps.
- System outcome: Chromium, Android, desktop WebKit and fresh-process iPhone evidence; structured archive outcomes; observable readiness; preserved visible state on rejected writes.
- Reverify trigger: archive storage version, focus/runtime shell or longform interaction change.

## ST-TLP-ROUTE-AUTHORITY — Single machine route/runtime truth

- Status: `absorbed/closed` by W7.
- Common mechanism: paths, lazy page ownership, redirects, sitemap membership, QA inventory and budgets were duplicated across independent owners.
- Absorbed symptoms: broad `/articles/:id` soft-404, manual redirect drift, focus suppression when returning to the session-opening URL, parallel route QA/budget lists and renderer-level hiding of invalid essay structure.
- System outcome: `src/routes/route-contract.json` owns route ids, paths, modules, redirects, sitemap, audit roles and budgets; runtime and validators derive from it.
- Representative anchor: source PR #331, tested head `19fd978fcaf7513be93e7222c0caa9f0a5332bda`, squash merge `5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`.
- Regression witness: project/content contracts, production build and budgets, three-profile catalog, 35+ URL route crawl and Manual Browser QA 4/4.
- Detailed evidence: `../verification/2026-08-06-w7-route-runtime-wave/REPORT.md`.
- Reverify trigger: route-contract schema/consumer change or concrete contradictory runtime evidence.

## ST-TLP-RELEASE-GOVERNANCE — Private package and exact-SHA promotion

- Status: `absorbed/closed`.
- Historical manifestations: generic package identity, undefined Node support, ambiguous licence/release authority.
- System outcome: private non-publishable package, explicit Node range, `UNLICENSED` non-grant and exact-SHA release policy.
- Reverify trigger: package publication, runtime baseline or licence policy change.

## ST-TLP-BRANCH-EVIDENCE-LIFECYCLE — Retire refs without losing durable value

- Status: `absorbed/closed` by W6.
- Historical manifestations: temporary transport refs, superseded implementation refs, Arena evidence and deeply diverged research history.
- System outcome: extraction/classification, byte-preserved evidence, exact retained forensic archive and allowlisted physical ref deletion with absence recheck.
- Current durable boundary: source intentionally retains `archive/deep-research-local-images-20260724` as evidence-only history, not production code.
- Reverify trigger: proposal to merge, rewrite or delete the retained archive.

## ST-TLP-MEDIA-PROVENANCE — Publication authority for images

- Status: `absorbed/closed for the 30-candidate Mayakovsky set`.
- Historical manifestations: archived candidates with exact file identity but incomplete caption, object, publication or rights evidence; repeated derivative metadata was at risk of becoming publication authority by analogy.
- System outcome:
  - source issue #77 completed and closed;
  - exact originals and hashes remain `30/30`;
  - accepted active: `5` — C03, C08, C10, C11, C16;
  - verified reserve: `1` — C15;
  - explicit terminal exclusions: `24`;
  - unresolved candidates: `0`;
  - source PR #333 exact tested head `b9a4bc7dd3dc2c14160e3b551497465eab82753c`;
  - source squash merge `dd2df7be196d81d5212b43a08616f782af2fecf6`.
- Active publication mechanism:
  - `verifiedEssayMedia.ts` owns five stable media records;
  - each active record must resolve exactly one current archive block;
  - stale pre-verification source/caption metadata must resolve zero blocks;
  - no image binary was added by the final batch.
- Accepted additions from the final batch:
  - C10: State Mayakovsky Museum exact group/leaflet witness, Moscow 1912 and documented February 1913 publication, unknown photographer preserved;
  - C11: State Catalogue / State Mayakovsky Museum object lineage, Tina Modotti, Mayakovsky and Francisco Moreno, Mexico City 1925;
  - C16: Arzamas exact reproduction credited to the State Mayakovsky Museum, Osip Brik, Moscow 1927.
- Reserve boundary:
  - C15 has sufficient evidence for a future bounded use but no current essay block uses the exact source, so it has no decorative active key.
- Exclusion boundary:
  - `excluded-rights` means useful caption/object/publication evidence exists but the Product's required rights predicate is incomplete;
  - `excluded-provenance` means exact object/source/creator/date/publication lineage is insufficient;
  - `excluded-scope` means current editorial need does not justify publication while evidence remains incomplete;
  - exclusion is a terminal Product decision for current scope, not an instruction to continue automatic waves.
- Durable evidence model preserved by C01–C30:
  1. exact original identity and hashes;
  2. independent caption evidence;
  3. primary object/collection provenance;
  4. bibliographic publication identity;
  5. exact early-publication page/context;
  6. creator and location uncertainty;
  7. jurisdiction-appropriate rights rationale;
  8. explicit Product decision and active runtime coverage.
- Regression witness:
  - Project contracts and Content model contract;
  - full CI/typecheck/build/budgets/prerender/SEO;
  - Articles catalog on Chromium, Android and iPhone;
  - route crawl across 35+ URLs;
  - brand deep audit;
  - Manual Browser QA 4/4 including desktop WebKit and fresh-process iPhone Safari.
- Reverify trigger:
  - materially new primary object/publication evidence;
  - explicit permission or licence;
  - reviewable jurisdiction-specific rights evidence;
  - changed editorial need for C15 or an excluded candidate;
  - change to the active media registry or exact-one coverage contract.
- A Commons metadata edit, derivative mirror, filename, visual resemblance or repeated caption alone is not a reverify trigger.
- Detailed final evidence: `../verification/2026-08-06-mayakovsky-media-final-batch/REPORT.md`.
- Historical bounded evidence remains in the C01, C02, C04, C05, C06 and C07 reports and is not superseded as evidence-at-anchor.

## ST-TLP-SCROLL-OWNERSHIP — Native document movement

- Status: `absorbed/closed` by source PR #334; the install-only residual `TLP-DEPS-001` / Product #335 is also `closed-by-fix` through source PR #348.
- User-visible manifestation: intermittent wheel-scroll stalls and viscous catch-up in the middle of downward movement.
- Common mechanism: the desktop app shell globally replaced ordinary document scrolling with Lenis smooth-wheel interpolation advanced by a permanent JavaScript RAF; fixed decorative text and scroll-to-top visibility added document-scroll subscriptions on the same latency-sensitive path.
- Prior-corpus boundary: W0–W7 covered reader outcomes, routes, browser evidence and performance budgets, but the permanent scroll validator protected anchor geometry rather than continuous ordinary wheel ownership.
- System outcome:
  - wheel, trackpad and touch document movement belong to the browser on every pointer class;
  - route restoration, hash geometry and the explicit scroll-to-top command remain application-owned;
  - decorative fixed typography has no document-scroll subscription;
  - scroll-to-top visibility uses one passive listener with RAF coalescing;
  - the scroll runtime and app-shell contracts reject global JS scrollers, wheel interception, perpetual scroll RAF and decorative frame subscribers;
  - Chromium QA sends six real wheel impulses on a long poet page, requires measurable progress after every impulse and verifies that none is default-prevented;
  - direct manifest and lock ownership of `lenis` is absent after Product PR #348 and remains absent on current Product main.
- Source anchors:
  - native-scroll repair: PR #334 exact tested head `774804be169f53581ae85ab4b835be08537c532f`, squash merge `76ef482bedb1722b691ec1f301b403c3a28aad3d`;
  - install-only cleanup: PR #348 exact tested head `43527c7a7932f17fcba599ff4df270c243ba69a6`, squash merge `3a8d5fe3a6f729e8a583a3a8c7e6881ec31b5214`.
- PR #348 repair boundary: exactly `package.json` + `package-lock.json`, with no scroll-runtime, validator, route or content change; the current Product source still has no active `lenis` occurrence.
- Regression witness: the native-scroll repair retained its original CI/browser evidence, and PR #348 passed exact-head CI, project/content contracts, route audit, brand gates, Yesenin/catalog gates and Manual Browser QA 4/4 before merge.
- Detailed evidence: `../verification/2026-08-06-scroll-editorial-runtime-wave/REPORT.md` and `../verification/2026-08-07-lenis-dependency-closure/REPORT.md`.
- Reverify trigger: global document smooth scrolling, wheel/touch cancellation, new perpetual document-scroll RAF ownership, route/overlay ownership change, a concrete mid-gesture browser stall, or new direct package/runtime ownership that reintroduces the closed global-scroller mechanism.

## ST-TLP-AUDIT-HARNESS — Class-level evidence without control-plane duplication

- Status: `absorbed/closed` for the selected current manifestations through source PR #345. Future concrete harness defects require independent current-head reverification before becoming active work.
- Historical manifestations: stale string-literal validators, soft-404 expectations, boolean archive assumptions, exact-authority documentation drift, a literary-style validator that first required historical sentence fragments instead of their facts and qualifications, an app-shell validator that required the global smooth-scroll mechanism behind a reported defect, semantic-label checks implemented by case-sensitive exact substring matching, and high-risk app-shell/document-scroll guards that still depended on selected literal source spellings.
- System outcome:
  - validators prefer machine contracts and user-visible or semantic invariants over frozen implementation prose;
  - poet portrait boundaries permit bounded grammatical form changes through normalized, clause-local semantic witnesses while short negative particles remain meaning-bearing;
  - service scaffolding is rejected directly;
  - scroll validators protect native ownership rather than one library implementation;
  - selected high-risk app-shell/document-scroll source-structure checks now use one bounded TypeScript-AST helper that accepts equivalent extracted syntax while rejecting alternate forbidden operations;
  - object option analysis follows JavaScript left-to-right, last-write-wins spread precedence;
  - const alias/shorthand resolution respects lexical scope instead of one global binding map;
  - mutation fixtures cover equivalent passive/focus forms, unsafe passive values/spreads, wheel interception, bracket-form `preventDefault`, dynamic Lenis import aliases and lexical shadowing.
- Closed witnesses:
  - source PR #334 exact tested head `774804be169f53581ae85ab4b835be08537c532f`, squash merge `76ef482bedb1722b691ec1f301b403c3a28aad3d`;
  - source PR #336 exact tested head `8e22188f98b9eaa39bab044794a7852e9b746f8d`, squash merge `dc37961cf64de5400e622d9c3d202634ed135100`;
  - source PR #345 exact tested head `c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`, squash merge `b6f731263211208a31de1e36ed7830d7a46ffa87`.
- PR #345 regression witness: full CI/check/build/typecheck/SEO, Project contracts, route integrity, brand audit and Manual Browser QA 4/4 across Chromium/Android, desktop WebKit and fresh-process iPhone Safari.
- Detailed evidence: `../verification/2026-08-06-scroll-editorial-runtime-wave/REPORT.md`, `../verification/2026-08-07-canonical-poet-authority-wave/REPORT.md`, and `../verification/2026-08-07-audit-harness-semantic-closure/REPORT.md`.
- Reverify trigger: a current guard demonstrably measures implementation text rather than meaningful contract behavior, a content validator blocks a legitimate rewrite without loss of meaning, a semantic matcher loses negative meaning or accepts tokens scattered across unrelated passages, a runtime validator requires the mechanism behind a user-visible defect, or a new AST/semantic helper produces a reproducible false pass/failure. Source movement or historical matrix presence alone is not a trigger.
