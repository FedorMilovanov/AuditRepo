# NG-DEAD-01 Nagornaya dead extraction closure — 2026-08-07

## Scope

- AuditRepo base: `b4367b3d88bef18edfd5e06a168d9c160bff421b`.
- Product cleanup PR: `FedorMilovanov/gb-is-my-strength#1142`.
- Product cleanup branch base: `f4cfb8653551ed8459aba1bfcf65f03e27fdfbb2`.
- Product exact pre-merge cleanup head: `898e9bd18506feb54787fafe80d99019e44e9c37`.
- Product squash merge: `def95cc7c004cbf2e60b4c8272cb6880235435f6`.
- Concurrent Product merge immediately before #1142: #1140, `b8085fedf33de67718e254aceec221b747f89a36`.
- Product mutation surface: exactly 15 deleted `.astro` extraction files.
- AuditRepo work unit closed: `NG-DEAD-01`.

## What was removed

For each Nagornaya Part I–V, #1142 deleted the three zero-consumer extraction artifacts:

- `NagornayaChastNHeaderHero.astro`;
- `NagornayaChastNArticleBody.astro`;
- `NagornayaChastNPostContent.astro`.

Total Product diff on the cleanup branch:

- 15 removed files;
- 0 added files;
- 0 modified files;
- 569 deleted lines;
- no MainShell, route, runtime JS, CSS, data, workflow or test mutation.

## Current-source re-verification before deletion

The cleanup did not rely only on the old `0fbe7d1e` zero-import result.

1. Product delta `9a0db0dc... -> f4cfb865...` changed only release scripts, Home files and the independent CSS validator. No Nagornaya extraction file, MainShell or canonical Part I–V route changed in that interval.
2. All 15 extraction paths physically existed on `f4cfb865...` immediately before deletion.
3. Representative HeaderHero/PostContent files explicitly described themselves as `verbatim legacy HTML` / `Auto-extracted from NagornayaChastNMainShell.astro`.
4. All five canonical `/nagornaya/chast-N/` routes imported/rendered `NagornayaChastNMainShell` together with PageHead/PageChrome/PageFooter and did not import HeaderHero/ArticleBody/PostContent.
5. The current open Product PR collision scan found no owner of the 15-file family.

This confirmed the actual ownership direction: the extraction family was derivative/dead; the five MainShells were the canonical live owners.

## Exact pre-merge deletion-tree validation

Exact cleanup head `898e9bd18506feb54787fafe80d99019e44e9c37` registered **11 workflow groups**, all terminal `success` before merge:

- Scripture Occurrence Index Contract;
- Search Manifest Policy;
- Native Source Contract;
- Metadata & IndexNow Readiness;
- Route Registry Validators;
- Shared Files Guard;
- Glossary Contract;
- Visual Parity Guard — pixel-diff;
- Print Paper Contract;
- Editorial Dateline Contract;
- Deploy Candidate Contract.

### High-value proof inside those groups

`Shared Files Guard` passed every relevant Nagornaya guard on the deletion tree:

- Nagornaya pastoral safety regressions;
- Nagornaya source integrity regressions;
- Nagornaya source registry regressions;
- Nagornaya epistemic UI regressions;
- Nagornaya PremiumControls ARIA regressions.

`Native Source Contract` passed:

- declared sources against actual import graphs;
- HTML surface mutation contract;
- Astro type/template check;
- production-like build;
- native article and series output;
- every production HTML surface;
- migration metadata coherence;
- workflow policy;
- tracked-source non-mutation check.

`Route Registry Validators` passed:

- registry contracts/provenance/migration policy;
- production-like builds;
- every public surface in Chromium;
- route semantics in Chromium;
- Nagornaya epistemic UI in Chromium;
- every public surface in Chromium touch/scroll;
- every public surface in WebKit touch/scroll.

`Visual Parity Guard` passed production-like build, legacy-vs-dist pixel diagnostics and render-authority checks.

`Print Paper Contract` passed production-like build, canonical PDF generation, pagination/palette checks, reversible-card states and raster audit.

PR review boundary before merge:

- comments: 0;
- review threads: 0;
- submitted reviews: 0;
- mergeable: true after GitHub recalculation.

## Concurrent-main correction

A strict concurrency nuance occurred at the merge boundary and is preserved here rather than hidden.

The 11-group #1142 validation ran on cleanup head `898e9bd1...` based on Product `f4cfb865...`. While the final WebKit job was completing, independent Product PR #1140 merged as `b8085fed...`, approximately 90 seconds before #1142 was squash-merged.

#1140 changed only:

- `src/components/article-pilots/_shared/ReaderRail.astro`;
- `src/components/article-pilots/_shared/ReaderSettings.astro`;
- `src/components/article-pilots/kod-da-vinchi/KodDaVinchiMainShell.astro`;
- `src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageChrome.astro`;
- `src/pages/articles/kod-da-vinchi/index.astro`.

It did not overlap the Nagornaya extraction family or a shared global runtime/CSS owner.

After #1142 merged, exact compare `b8085fed... -> def95cc7...` showed **only the same 15 Nagornaya deletions** and no other Product change. Thus GitHub applied the cleanup cleanly on top of #1140.

No workflow runs were registered on merge SHA `def95cc7...` itself. Therefore this report does **not** claim post-merge combined-tree CI. Closure confidence is based on:

1. the complete 11-group exact-head cleanup validation;
2. #1140's independently validated/merged reader-only lane;
3. exact path-disjointness between #1140 and #1142;
4. exact final-main compare proving `def95cc7...` differs from parent `b8085fed...` only by the 15 already-validated deletions.

No artificial Product diff was created merely to trigger another CI run.

## Disposition

`NG-DEAD-01` is `closed-by-cleanup` and leaves the active MASTER in this closure wave.

Correct closure wording:

> The 15 zero-consumer Nagornaya HeaderHero/ArticleBody/PostContent extraction artifacts were removed. Parts I–V remain owned by their existing MainShell routes, and source/import, build, Nagornaya, browser, visual and print contracts passed on the exact deletion tree.

MASTER delta:

- active work units: `26 -> 25`;
- direct defects: `14` unchanged;
- verified necessary improvements: `6 -> 5`;
- system lanes: `2` unchanged;
- owner decisions: `4` unchanged.

## Next boundary

The remaining direct Nagornaya root is `NG-INLINE-01`: the public Part I `Из библиотеки` block still owns hard-coded presentation inline inside `NagornayaChast1MainShell.astro`. Re-verify current main/open PR ownership before any Product edit; do not conflate that theme/ownership repair with the now-closed dead-extraction cleanup.
