# Article history and live publication case — broad wave 22

**Date:** 2026-10-29  
**Product main:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**Live case:** draft PR #2217, head `ffdd9b236fd7dde38819691422c1d451e666ac5e`  
**Mutation boundary:** read-only; no branch, review, comment or Product file changed.

## History census

Full `main` history was fetched and inspected, not only the current tree.

- repository history: 5,191 commits;
- commits touching `src/content/articles`: 257;
- article MDX additions found: 71 files in 42 addition commits;
- current article MDX files with reconstructable publication transition: 55;
- current article files changed after their addition: 65/71; median four later touching commits, maximum 32;
- within 72 hours of the first reconstructable publishable state, 26/55 were touched; 21/55 had at least one repair-like subject, 31 repair-like events total.

The 21/55 value is an **upper bound, not a defect rate**: subjects include deliberate polish, migration hardening and publication staging. It proves that publication is frequently iterative; it does not prove that every later commit fixed an agent error. The history has draft-first and migration-heavy eras, so “file changed after addition” is not evidence of failure by itself.

## Recurring historical mechanisms

Representative histories show recurring classes rather than one careless-agent pattern:

1. **Publish state corrected after content work.** The Heart cohort includes a follow-up setting nine content seeds back to draft until presentation existed.
2. **Schema/TOC/metadata repaired after article creation.** Lawson has immediate metadata-schema and TOC-anchor hardening, then extensive source/copy reconciliation.
3. **Reader language and source notes polished after promotion.** Teen articles repeatedly receive post-promotion summary, TOC, bibliography and metadata-gate alignment.
4. **Discovery registered after article publication.** The apostasy pillar on `main` was followed by `fix(content): register ... in discovery and metadata registries`.
5. **Runtime/migration hardening follows content ownership changes.** Gill pilot histories needed shadow-shell, Pagefind and SEO hardening after promotion.

These mechanisms align with split publication ownership. They do not excuse an agent from reading rules, but they show that article completion is not represented by one repository operation.

## PR #2217 as a current controlled case

The active owner is publishing five «Отступники» articles plus a hub. At the observed head the PR changed 57 files and had 13 commits. It touched:

- five article MDX files and six routes;
- one shared series config, media/data and wrapper implementation;
- six route profiles, page ownership, route-search policy and `data/series.json`;
- search manifest, scripture index, sitemap, RSS and `llms.txt`;
- glossary/relations and editorial supplement data;
- 19 binary image assets.

The commit sequence is direct causal evidence of fragmented completion:

1. engine/content implementation;
2. registry/discovery fan-out;
3. remove invalid relation endpoints;
4. add sitemap entries;
5. regenerate RSS;
6. align Part V title across manifest/RSS;
7. retitle scripture occurrences;
8. refresh generated timestamps;
9. register the series in `SERIES_ORDER` for prev/next parity.

Checks expose the defects, but only after partial publication states exist. At successive heads GitHub reported failure sets including exact Scripture/metadata closure, RSS/sitemap/Pagefind, registry contracts, production-like build and atomic-publication checks. At the latest observation 25 checks succeeded, four were intentionally skipped and ten were still pending; the draft was `UNSTABLE`. No final quality conclusion is claimed while checks are incomplete.

## Important interpretation

### Agent responsibility

The active agent created partial states and had to react to failures one registry at a time. A stronger preflight against all applicable contracts would have reduced churn. The historical cases also include avoidable misses such as wrong publish state and late metadata/TOC repair.

### Repository/system responsibility

The system requires a content agent to discover and synchronize a large, type-diverse fan-out. The compact series guide neither owns nor lists that full transaction. There is no scaffold/check command that says, before writes, “this new indexable five-part series requires exactly these authored and generated owners.” CI catches defects, but late failure is not the same as safe authoring.

### Allocation

This is **mixed causality with a dominant system boundary**:

- agents remain responsible for explicit instructions and final green exact-head evidence;
- the repeatable mechanism is missing atomic publication ownership, not unique incompetence;
- therefore the right protection is the existing `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`, not more reminders or a separate row per forgotten registry.

## Regression/omission conclusions

1. New articles do introduce omissions often enough to be systemic: at least four distinct cohorts show post-publication state/schema/discovery hardening, and the live six-route case required six consecutive projection/registry repairs after the main wiring.
2. A numerical “agent defect percentage” cannot be honestly derived from commit subjects; draft evolution and deliberate polish confound it. The defensible metrics are the 21/55 upper bound and the exact PR sequence.
3. Current gates are valuable and should not be weakened. Their weakness is orchestration and preflight, not absence.
4. No competing Product repair should be opened while #2217 owns this content. Its final head can later serve as a positive/negative fixture corpus for the atomic publication lane.

## Durable actions

- one typed publication manifest/scaffold with dry-run plan, idempotent write and strict check modes;
- derive generated projections or validate them as one transaction with stale-provenance rejection;
- fail before writes on locked/owner-review series policy, missing discovery strategy and unresolved route identity;
- keep article prose/editorial review human and owner-sensitive; do not pretend registry generation proves article quality;
- retain PR #2217 as evidence, not as a target for audit-agent edits.

**Broad wave 22 complete.**
