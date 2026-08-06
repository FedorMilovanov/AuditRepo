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

- Status: `active-work` in source PR #334.
- User-visible manifestation: intermittent wheel-scroll stalls and viscous catch-up in the middle of downward movement.
- Common mechanism: the desktop app shell globally replaced ordinary document scrolling with Lenis smooth-wheel interpolation advanced by a permanent JavaScript RAF; fixed decorative text and scroll-to-top visibility added document-scroll subscriptions on the same latency-sensitive path.
- Prior-corpus boundary: W0–W7 covered reader outcomes, routes, browser evidence and performance budgets, but the permanent scroll validator protected anchor geometry rather than continuous ordinary wheel ownership.
- Selected system outcome:
  - wheel, trackpad and touch document movement return to the browser;
  - route restoration, hash geometry and the explicit scroll-to-top command remain application-owned;
  - decorative fixed typography has no document-scroll subscription;
  - scroll-to-top visibility uses one passive listener with RAF coalescing;
  - the scroll runtime contract rejects global JS scrollers, wheel interception, perpetual scroll RAF and decorative frame subscribers.
- Current source anchor: PR #334 exact head `1add78cbc4be86e59e2d1a07f9090d72213c9f3b`; base includes the completed Mayakovsky media merge `dd2df7be196d81d5212b43a08616f782af2fecf6`.
- Closure requirement: exact-head full CI, route integrity, brand/motion audit, Manual Browser QA 4/4 and merge without losing the independent media base.
- Detailed evidence: `../verification/2026-08-06-scroll-editorial-runtime-wave/REPORT.md`.
- Reverify trigger: global document smooth scrolling, wheel/touch cancellation, new perpetual document-scroll RAF ownership, route/overlay ownership change or a concrete mid-gesture browser stall.

## ST-TLP-AUDIT-HARNESS — Class-level evidence without control-plane duplication

- Status: `active governance theme`; one exact-prose manifestation is under repair in source PR #334.
- Historical manifestations: stale string-literal validators, soft-404 expectations, boolean archive assumptions, exact-authority documentation drift and a literary-style validator that required 21 exact historical sentence fragments instead of the facts and qualifications those sentences represented.
- System outcome: validators test machine contracts and user-visible or semantic invariants; AuditRepo stores proportional evidence instead of mirroring every source commit. For poet portraits, named semantic boundaries accept a bounded set of equivalent witnesses while service scaffolding is rejected directly.
- Current witness: source PR #334 converts frozen poet prose markers to semantic invariants and rejects visible formulas such as `честный портрет`, `редактору достаточно`, `не приукрашиваем` and `не умаляем`.
- Detailed evidence: `../verification/2026-08-06-scroll-editorial-runtime-wave/REPORT.md`.
- Reverify trigger: a guard measures implementation text rather than meaningful contract behavior, a content validator blocks a legitimate rewrite without loss of meaning, or documentation work becomes larger than the selected repair.
