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

- Status: `evidence-rich`, `owner-decision`.
- Historical manifestations: archived candidates with incomplete source, attribution or publication-rights evidence.
- Current bounded result:
  - two candidates are accepted in Product through explicit decisions;
  - all 28 remaining candidates are still publication-unresolved;
  - C01 has primary object/caption support for `Владимир Маяковский; Москва; 1910; неизвестный фотограф`, but remains rights-blocked;
  - C02 has corroborated `Владимир Маяковский; 1912; неизвестный фотограф` and commercial museum attribution, but lacks primary exact-object provenance and remains rights-blocked;
  - C04 has exact-file identity, a long-standing `Владимир Маяковский; 1915; неизвестный фотограф` caption, cited 1940 publication and a materially stronger Commons Russia/US PD rationale, but the exact early-publication page and primary object provenance remain unverified.
- The candidate waves demonstrate five layers that must stay separate:
  1. exact Commons file identity and hashes;
  2. historical caption corroboration;
  3. primary object/collection provenance;
  4. original/early publication evidence with inspectable page context;
  5. jurisdiction-appropriate publication authority and explicit editorial decision.
- A Commons template may be strong evidence for a legal rationale, but it does not replace verification of the factual predicates on which that rationale depends.
- Better-than-local outcome: one explicit provenance/rights record per selected asset and a rights-safe publication boundary.
- Technical availability, visual resemblance, archive presence, catalogue listing, newspaper citation or PD template alone does not authorize publication.
- Detailed evidence:
  - `../verification/2026-08-06-c01-caption-rights-wave/REPORT.md`;
  - `../verification/2026-08-06-c02-caption-rights-wave/REPORT.md`;
  - `../verification/2026-08-06-c04-publication-rights-wave/REPORT.md`.

## ST-TLP-AUDIT-HARNESS — Class-level evidence without control-plane duplication

- Status: `active governance theme`.
- Historical manifestations: stale string-literal validators, soft-404 expectations, boolean archive assumptions and exact-authority documentation drift.
- System outcome: validators test machine contracts and user-visible invariants; AuditRepo stores proportional evidence instead of mirroring every source commit.
- Reverify trigger: a guard measures implementation text rather than meaningful contract behavior, or documentation work becomes larger than the selected repair.
