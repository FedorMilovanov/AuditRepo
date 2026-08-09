# Inter-session current-owner consolidation

Date: 2026-08-09
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Exact Product anchor

Current verified Product `main` at this consolidation checkpoint:

`c389f88ed06eb8e30cebf2a1c4f0d5764c18522f`

Commit: `fix(discovery): separate new-row author and editor authority (#1313)`.

This anchor already contains:

- merged `#1364` Gill-claim retained-reference storage repair;
- merged `#1267` conditional Gill quiz-panel/label relation repair;
- merged `#1313` Search Manifest new-row role authority.

The Product tree after these merges does not add Home/Arena temporary configuration or writer surfaces.

## Inter-session collision / owner census

Open Product owners observed after `#1313` merged:

- `#1370` — current Strangler visual-parity reader slice;
- `#1363` — MapEngine scale-resize browser-witness repair;
- `#1348` — exhaustive `/articles/` catalog projection;
- `#1339` — Lot publication registration;
- `#1334` — Avraam Tall el-Hammam retraction parity;
- `#1212` — all-reading-route runtime/control census.

`#1313` and `#1267` are merged and must no longer appear as active repair rows.

## Strangler truth

Merged `#1364` exact-head Shared Files evidence proves:

- 53 immutable retained references;
- 52 migration-only + 1 production-required + 0 unresolved;
- 36 registered dependencies;
- 7 dependency-owner blockers;
- Gill claim surface audit: 6/6 logical legacy surfaces, zero findings;
- retirement readiness self-test remains quarantine-aware and ambiguity fail-closed;
- global readiness is `NOT_YET_SAFE_TO_MOVE_OR_DELETE; blockers=12`.

Therefore the current main-level retirement count is **12**, not obsolete historical counts.

Open `#1370` is the next bounded Strangler owner. Its semantic diff is exactly four files and is intended to remove one additional mechanical reader (`12 → 11`) by moving production visual parity onto the retained-reference resolver. On its pre-`#1313` exact head, Shared/Metadata/Node were green while Visual and Deploy were still running. Because `#1313` subsequently moved main, `#1370` must refresh and obtain a new exact-head barrier; its earlier green is semantic evidence only.

## Reader-control status

Merged `#1267` closes the conditional Gill Learning quiz relation defect: no-quiz configurations no longer render `panelQuiz aria-labelledby=tabQuiz` without the corresponding tab.

This does **not** close SYSTEM issue `#1224`. Remaining reader-control work stays consolidated there rather than reopening merged slices.

`#1212` remains an audit-only owner. Its historic 887 raw manifestations are not 887 Product defects. In particular, the 124 click failures remain sequence-contaminated until the harness gives each control a fresh/reproducible starting state, and mixed runtime-error scenes contain localhost/WebKit noise. Do not weaken static assertions merely to obtain green.

Footnote publication semantics remain separately owned by issue `#1225`.

## Search role authority — closed upstream root

`#1313` is merged in current main. New Search Manifest rows derive role presence from structured Article/ScholarlyArticle authority and no longer synthesize `editor` from `<meta name=author>`.

Downstream consequences:

- `#1348` must refresh from current main and make catalog attribution role-aware (`author`, `translator`, `editor`) without synthesizing editor from author;
- stale generated Lot Search/RSS/sitemap state in `#1339` cannot be final authority and must be regenerated after refresh using the canonical writer;
- direct/manual Search Manifest editing remains forbidden.

There is no longer an active `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` Product defect row after this merge.

## Catalog projection

`#1348` is the current exhaustive `/articles/` owner. Its architecture remains correct in principle:

- membership from Search Manifest + page-ownership publication status;
- no hand-maintained Lot card;
- removal of `ArticlesPublicationsSection.astro` as a second membership/metadata owner;
- Scripture occurrence JSON only as deterministic canonical derivative.

After `#1313`, the branch must refresh and adapt its consumer/audit to truthful role-aware attribution before Ready. It should not fork Search metadata ownership.

## Lot publication dependency graph

Issue `#1295` remains the canonical Lot publication root; `#1339` is the current publication PR owner.

Known current dependencies/boundaries:

1. Search new-row role authority is merged; `#1339` must refresh and regenerate Search/RSS/sitemap from the new authority.
2. Human reachability must come from exhaustive catalog owner `#1348`, not a one-off Lot link.
3. `LotSectionArchaeology.astro` has a real `#sec-map-connection` H2 that must be represented in `lotToc.ts` by the publication owner.
4. PageHead JSON-LD should use the existing canonical `#website` WebSite graph node pattern rather than inventing a second schema convention.
5. Lot media/browser publication evidence remains a separate bounded lane.
6. Native quiz rendering already exists; the valid shared quiz dependency is semantic parity issue `#1369`, not missing rendering.

The Lot route is not yet a current-main public defect; these are publication-readiness requirements before the route may be claimed ready.

## Native article quiz correction — #1365 retired, #1369 current

An earlier pass incorrectly inferred that Lot would not render because `KodDaVinchiPageFooter.astro` intentionally omits legacy `js/site.js`. That inference was incomplete.

Fresh exact-source verification on current main proves the native chain:

`SITE_CONFIG.quiz → ReaderActionsRuntime.astro → src/runtime/article-interactions.js → src/runtime/article-quiz.js → #quizPlaceholder`.

Evidence:

- `ReaderActionsRuntime.astro` imports `../../runtime/article-interactions.js`;
- `article-interactions.js` imports `{ installArticleQuiz } from './article-quiz.js'` and calls it during install;
- `article-quiz.js` consumes `window.SITE_CONFIG.quiz.questions`, finds `#quizPlaceholder`, and materializes the native launch/questions/result UI.

Therefore Product issue `#1365` has been closed `not_planned` as an audit false positive. Do not restore/copy legacy `site.js` and do not create a second renderer.

The real current SYSTEM root is Product issue `#1369` (`SYS-ARTICLE-QUIZ-NATIVE-PARITY`):

1. native result selection assumes `{min,max}` ranges while accepted configs such as Lot use ordered `min` thresholds, causing named score tiers to fall through;
2. structured feedback uses `short || full`, suppressing distinct full teaching explanation whenever `short` exists;
3. configured result badge projection also requires explicit disposition/regression coverage.

Repair belongs at the shared native renderer/schema layer, not in Lot PageHead data.

## Avraam Tall el-Hammam current defect

Issue `#1298` remains a current public source-integrity defect. `#1334` owns the bounded static/native fallback repair.

The remaining data residual is narrowed to one structural item in canonical `karty/avraam/route.json`:

`scientific_variants.hammam[0]`

It still cites `Bunch et al., Sci. Reports 2021` without the 2025 retraction marker, while sibling Sodom science data is retraction-aware. Do not rewrite the large authority JSON through a risky whole-file transport merely to force closure; use a normal source patch / owner-safe git path and retain structural mutation coverage in `avraam-map-audit.js`.

## Map scale audit witness

`#1363` is a current audit/test-harness repair, not a MapEngine runtime change.

Root cause: the permanent browser witness resized the viewport, slept a fixed 120 ms, then measured a scale line whose CSS width transition lasts 300 ms. The intermediate width was falsely reported as runtime scale drift.

The repair preserves the existing `<=2.5px` invariant and waits only for bounded convergence; it does not widen tolerance, touch runtime/CSS, or retry the whole test.

Exact pre-current-main head `9f85b76a...` has terminal SUCCESS for Route Registry, Shared Files and Metadata. Since current main later absorbed `#1364`, `#1267` and `#1313`, final merge authorization still requires one ancestry refresh and fresh exact-head CI after near-term SYSTEM settlement.

## Source Authority trigger closure

Issue `#1244` remains open. The concrete Baptist path-filter false negative was repaired earlier, but the class-level requirement remains: workflow applicability should be derived/fail-closed against publication source surfaces consumed by static-publication validation, with adversarial PR/push path witnesses.

## Product-golden visual blind spot

Issue `#298` remains open and independent from migration visual parity. `#1370` improves retained-reference source resolution for migration parity; it does **not** replace owner-approved immutable product-state goldens.

## Current disposition

Solved/stale items removed from current planning include old Baptist S12 ownership, merged Search role authority, merged reader slices and historical Strangler blocker wording.

Current compact roots are represented by the current AuditRepo MASTER/reconciliation package. This report contributes only the later `#1313` merge delta, current Strangler count/owner state, and the correction retiring false-positive `#1365` in favor of verified native-quiz parity root `#1369`.
