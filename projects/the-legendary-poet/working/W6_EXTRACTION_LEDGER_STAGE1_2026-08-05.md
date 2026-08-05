# W6 deep-branch extraction ledger — final classification — 2026-08-05

## Identity and rule

Source branch reviewed: `TheLegendaryPoet/work/local-images-playwright-wtoc`.

- exact head: `909df9f73b8d9be6faa58cbee767603954e3fb17`;
- merge base: `0e987e413f73048e835ed064eab6ac94029104f1`;
- comparison at final classification: `787 ahead / 749 behind` relative to source production before the governance wave;
- exact preservation ref: `archive/deep-research-local-images-20260724`;
- archive ref and work ref compare `identical`, `ahead=0`, `behind=0`, at exact head `909df9f...`.

The branch is never a production merge candidate. Every path is classified by ordered family rules below. The first matching rule owns the path, so no path can silently fall through.

## Ordered path-family outcomes

| Precedence | Path family | Outcome | Durable authority / reason |
|---:|---|---|---|
| 1 | `research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md` | `EXTRACTED_CURRENT` | Exact evidence copied to `docs/research/mayakovsky/media/` by source #324. It proves source identity/hashes, not publication permission. |
| 2 | `research/mayakovsky/media/pr77-accepted-active-media-2026-07-24.md` | `EXTRACTED_CURRENT` | Exact C03/C08 decisions copied by #324. |
| 3 | `research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json` | `EXTRACTED_CURRENT` | Machine-readable 2 accepted / 28 unresolved boundary copied by #324. |
| 4 | C03/C08 old runtime wrappers and caption/source overrides | `REPRESENTED_CURRENT` | Adapted into central `verifiedEssayMedia` registry at immutable `publishEssay` boundary; #324 exact head `6146e6f5da81c7904fd1bb135c22a409f3e12719`, squash production `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`. |
| 5 | remaining PR77 candidates C01, C02, C04–C07, C09–C30 and related image binaries/derivatives | `OWNER_DECISION_ARCHIVED` | Acquisition/hashes do not prove caption, depicted date/location, rights in every jurisdiction or owner publication approval. Bytes remain reachable through exact archive ref; none enter current production. |
| 6 | `research/**` not matched above | `ARCHIVE_REF_CURRENT_BACKLOG` | Text research, claim ledgers, correspondence/source collations, acquisition notes and historical inventories remain fully reachable at archive ref `909df9f...`. Live issues/current `docs/research/` remain operational authority; no second canonical research tree is created. |
| 7 | `docs/ISSUE_49_ARCHIVE_REQUEST_PACK.md`, `docs/SOURCE_ACQUISITION_49_RESULTS.md`, `docs/RESEARCH_SOURCES.md`, `docs/PUBLIC_CLAIM_BOUNDARIES.md`, `docs/STABLE_CITATION_BLOCK_IDS.md` | `ARCHIVE_REF_CURRENT_BACKLOG` | Preserve exact historical evidence/request material at archive ref. Issue #49 and current editorial/source policies own unresolved work; wholesale copying would create competing truth. |
| 8 | `.github/workflows/source-acquisition-*`, `.github/workflows/source-verification-*`, `.github/workflows/yesenin-*-pass*.yml`, old Part-I acquisition/authoring workflows | `ARCHIVE_ONLY_REJECT_LIVE` | One-shot transport/acquisition execution is forensic evidence, not current production infrastructure. Do not restore dozens of executable workflows. |
| 9 | old `e2e/**`, `playwright.config.ts`, `playwright.manual.config.mjs`, modified old `qa/**` | `REPRESENTED_OR_OBSOLETE` | Current exact-head W5 and Manual Browser contours cover route, archive, longform, media, modal, reduced-motion, SEO and device outcomes on the current app topology. Old framework/config is not copied. |
| 10 | old `.github/workflows/ci.yml`, `deploy.yml`, `manual-browser-qa.yml` | `REJECT_OBSOLETE` | Superseded by current composite-action, locked-browser, exact-head and four-profile workflows. |
| 11 | old `src/**`, root configs, `package.json`, README, sitemap/index changes | `REPRESENTED_OR_REJECT_OBSOLETE` | Current production owns Router 8, one route registry, immutable Essay model, current search/SEO, storage safety, tilt/compositor repair, build budgets and current package lock. No old runtime/config file is copied. |
| 12 | `public/images/essays/archive/**` and responsive variants not matched as accepted C03/C08 evidence | `OWNER_DECISION_ARCHIVED` | Bytes and names alone are insufficient rights/provenance approval. They remain at exact archive ref and are not added to production. |
| 13 | old removed/replaced public article images and generated derivatives | `REPRESENTED_OR_REJECT_OBSOLETE` | Current production asset catalog and validators are authoritative. Archive ref retains historical bytes. |
| 14 | any remaining path not matched above | `ARCHIVE_POINTER_ONLY` | Exact branch head preserves it; no executable or reader-facing promotion is authorized without a new current-head verification decision. |

## Selective source extraction result

Source PR #324 was rebuilt directly on W5/current-truth production and merged only after the full exact-head matrix:

- base: `db6bc3ea8997f78d1370a05e2736cf20645c80dd`;
- exact tested head: `6146e6f5da81c7904fd1bb135c22a409f3e12719`;
- one commit / seven files / `behind=0`;
- CI, Project contracts, Content model, Articles catalog, route and brand successful;
- Manual Browser QA run `31046697422`, four of four jobs successful;
- expected-head squash production: `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`.

The repaired Articles catalog workflow watches all `src/data/essays/**`, so future changes to the shared publication boundary cannot evade Chromium/Android/iPhone catalog acceptance.

## Rights and source boundaries

- `30/30 acquired` is not `30/30 publication-safe`.
- Only C03 and C08 have explicit accepted metadata decisions in current production.
- C03 keeps photographer unknown.
- C08 keeps location unknown and does not silently equate a restored derivative with an archive original.
- Remaining images, correspondence claims and source-acquisition gaps remain owner/editorial/research decisions.
- The archive ref preserves evidence; it grants no licence and closes no unresolved research issue.

## Retirement disposition

The original `work/local-images-playwright-wtoc` ref is `RETIRE_READY` because:

1. every path has an ordered family outcome;
2. durable C03/C08 value and exact decision ledgers are in current production;
3. all remaining bytes and history are preserved by exact archive ref `archive/deep-research-local-images-20260724@909df9f...`;
4. no old runtime/workflow is authorized for merge;
5. unresolved rights and research remain explicitly blocked.

`RETIRE_READY` is not physical deletion. Deleting the old work ref still requires an authorized delete-ref operation and a subsequent branch inventory proving absence. The archive ref is intentionally retained.
