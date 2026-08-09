# Live owner reconciliation — Product main 5434f97

Date: 2026-08-09
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Exact Product anchor

Current verified Product `main` at this checkpoint:

`5434f97dfb2692ff4b59b9afd79a38125789edb3`

Commit: `fix(articles): derive exhaustive catalog from current publication authority (#1348)`.

This checkpoint supersedes the older MASTER anchor `59e99bfa...`.

## Important merges since the previous MASTER anchor

The following Product work is now merged and must not remain described as active:

- `#1267` — shared reader quiz tab/panel conditional ARIA repair;
- `#1313` — Search Manifest new-row author/editor/translator authority;
- `#1364` — Gill claim retained-reference storage repair;
- `#1371` — visual-parity retained-reference storage replay;
- `#1372` — delete three superseded legacy audit copies;
- `#1376` — Nagornaya retained fixture storage repair;
- `#1348` — exhaustive `/articles/` catalog projection from Search Manifest + page ownership.

## Catalog root is closed

`CATALOG-PROJECTION-01` is merged in current main.

Current main now:

- mounts `ArticlesLibrarySection.astro`;
- removes the hand-authored `ArticlesPublicationsSection.astro` owner;
- derives membership from Search Manifest + `migration/page-ownership.json`;
- preserves structured author/editor/translator attribution;
- carries the canonical regenerated Scripture occurrence projection required by removal of the old card source.

Therefore the catalog root must be removed from active MASTER. Lot human reachability is no longer blocked by absence of an exhaustive catalog owner; a correctly published Lot Search row is now consumed automatically.

## Strangler retirement truth

Merged retirement sequence:

1. `#1371`: blockers `12 → 11`;
2. `#1372`: deletes three obsolete readers, dependencies `36 → 33`, blockers `11 → 8`;
3. `#1376`: converts three Nagornaya retained-fixture dependencies to resolver-backed storage, `dependencyUnknownBlockers 7 → 4`, blockers `8 → 5`.

Current five known blockers after `#1376`:

1. `scripts/gill-reading-time-canonical-audit.js` — ledger still says `must-update-before-move`;
2. `scripts/audit-pro.js` — owner decision;
3. `scripts/baptisty-roadmap-audit.js` — owner decision;
4. `scripts/readable-audit.js` — owner decision;
5. `scripts/owner-ui-regression-guard.js` — owner decision.

Current-main source audit after merged `#1348` proves the first item is already mechanically modernized: `gill-reading-time-canonical-audit.js` uses route profiles + `legacyIsAuthoritative()` and does not force reference-only Gill mirrors into the publication oracle.

A protected branch already owns the corresponding ledger reconciliation:

`agent/gill-reading-time-ledger-reconciliation-20260809`

Fresh compare against current main: `ahead=1 / behind=0`, exactly one file (`data/legacy-reference-ledger/manifest.json`). Its row changes:

- `quarantineImpact: must-update-before-move` → `none-fixture-policy-or-comment-only`;
- `evidenceToken: articles/${slug}/index.html` → `legacyIsAuthoritative`.

Do not duplicate that branch. If its readiness proof lands as expected, Strangler becomes `5 → 4`, leaving only the four owner-decision readers.

## Shared native quiz correction

Issue `#1365` is officially closed as a **false positive**. Native standalone quiz rendering already exists:

`SITE_CONFIG.quiz → ReaderActionsRuntime → article-interactions.js → src/runtime/article-quiz.js → #quizPlaceholder`.

Do not restore legacy `js/site.js` and do not create a second quiz engine.

The real current root is `#1369`, implemented by draft PR `#1373`.

Current `#1373` semantic boundary is four files:

- `src/runtime/article-quiz.js`;
- `scripts/article-quiz-native-parity-test.mjs`;
- `.github/workflows/native-source-contract.yml`;
- `scripts/interactive-audit-runner.js`.

It restores ordered min-only result tiers, explicit min/max compatibility, result badges, and distinct short+full explanation layers, plus a real-route browser witness. Current compare reports `behind=0`; final exact-head CI is running and must remain the sole merge authority.

## Map scale witness

`#1363` remains a valid one-file harness repair. It is not absorbed by current main.

The six main commits between its previous merge base and `ed6f5600...` touched Search role authority, reader quiz ARIA and Strangler/Nagornaya files, not `scripts/map-engine-correctness-browser-test.mjs`.

An ancestry-only transport was merged into the feature branch, producing current feature head:

`0358b831202ef90882e0c00a159b78dcb007a192`

At that semantic checkpoint:

- changed files: exactly 1;
- Shared Files Guard: SUCCESS;
- Metadata & IndexNow Readiness: SUCCESS;
- Route Registry Validators: queued at observation time.

Current Product main then advanced once more through catalog #1348. Do not churn the branch on every main tick: preserve semantic proof and perform one final current-main refresh immediately before Ready/merge.

## Lot publication owner

Old publication PR `#1339@189dfdd...` is not a final current-main vehicle.

Against current `main@5434f97...`:

- ahead: 10;
- behind: 12;
- merge base: `56972725...`.

Its generated Search/RSS/sitemap state predates merged role authority and current catalog authority. It requires a clean current-main replay/refresh and canonical regeneration, not manual artifact copying.

Current Lot source resilience work is separately owned by `#1378` and does not overlap publication/catalog/runtime owners.

## Avraam retraction parity

`#1334` remains active and unabsorbed. Against current main it still has exactly two semantic files:

- `src/components/karty/avraam/AvraamMap.astro`;
- `scripts/avraam-map-audit.js`.

The narrowed unresolved route-data residual remains `route.scientific_variants.hammam[0]`, whose Bunch 2021 citation/note lacks the explicit 2025 retraction boundary already present in the sibling Sodom variant. Keep this Atlas-owned and separate from Lot publication.

## Current open Product PR census

At this checkpoint there are six open Product PRs:

- `#1378` — Lot source resilience;
- `#1373` — native article quiz parity;
- `#1363` — Map scale settled-geometry witness;
- `#1339` — stale Lot publication vehicle;
- `#1334` — Avraam retraction parity;
- `#1212` — all-reading-route runtime census.

`#1348`, `#1313`, `#1267`, `#1364` are merged and must not remain active owners.

## Audit disposition

- Product code was not changed by this AuditRepo reconciliation.
- No duplicate Product lane was opened.
- Existing protected `gill-reading-time-ledger-reconciliation` work was detected and left untouched.
- Next merge-order focus: finish protected Strangler ledger reconciliation / shared quiz parity as their owners settle; finish final MapScale current-main rerun; replay Lot publication only after current authorities; keep Avraam route-data residual separate.
