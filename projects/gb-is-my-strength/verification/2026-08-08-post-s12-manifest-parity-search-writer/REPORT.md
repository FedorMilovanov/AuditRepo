# Post-S12 live refresh: manifest field parity, Search writer transport, current owners

Date: 2026-08-08
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Product anchor

Current verified Product `main` at this refresh:

`fa2db40c2eb42942f07823d94e526f3a0bbeddce`

Commit: `fix(s12): remove backstage notes from Baptist publications (#1238)`.

`#1238` is merged. It removed the five previously observed Charter S12 backstage/workspace markers from:

- `src/content/articles/podpolnaya-pechat.mdx`;
- `src/content/articles/sovetskaya-noch.mdx`;
- `src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro`.

Therefore old Source Authority failures on unrelated branches that were caused only by those five markers are historical evidence. Those branches must still absorb current `main` and obtain fresh exact-head CI.

## Remaining Baptist metadata/discovery S12 residual

Direct read of current `main@fa2db40c...` confirms `src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro` still publishes backstage wording in reader-facing metadata:

- `research-досье`;
- `очередь правок 3D-карты`.

The wording appears in meta description, Twitter description, Open Graph description and Article JSON-LD description. `#1238` did not repair this PageHead/discovery residual.

The correct mutation boundary remains source metadata authority first, then deterministic Search/RSS/discovery projection. Closed `#1228` already proved that directly hand-editing the manifest is the wrong layer.

## Existing Search-manifest field-parity inventory

Disposable diagnostic PR `#1237` ran against exact Product `main@1f14761a...`, produced read-only evidence, and was then closed unmerged (`merged=false`). No diagnostic workflow/code entered Product.

Inventory result for 73 existing `data/search-manifest.json` rows:

- rows with at least one reader-facing mismatch: **67 / 73**;
- title mismatches: **66**;
- description mismatches: **29**;
- missing image fields: **4**;
- image mismatches: **17**;
- `datePublished` mismatches: **16**;
- `dateModified` mismatches: **25**.

Four proven rows with missing image authority despite public route imagery:

- `/hard-texts/`;
- `/karty/`;
- `/karty/avraam/`;
- `/map/`.

This is a system-level existing-row convergence gap, not a two-thumbnail local defect. Current policy can preserve stale existing manifest rows while deriving metadata for newly missing rows, so title/description/image/date drift can survive green membership/indexability checks.

No dedicated open Product implementation PR for this field-parity root was found in the live owner census at this refresh. The closed `audit/search-manifest-field-parity-20260808` branch/PR is diagnostic evidence only.

## Catalog consequence — #1221

`#1221` (`CATALOG-PROJECTION-01`) current observed head remains:

`0c779df113b5716a200bda023d356ef33cdade22`

It is still based on `1f14761a...` and is currently behind Product `main` by one commit.

The candidate explicitly treats `data/search-manifest.json` as owner of reader-facing catalog metadata and renders `title`, `description`, `image` and related fields from those rows. Its current media guard checks local image existence and built thumbnail coverage, but does not prove field parity against PageHead/dist.

Because the diagnostic inventory found 67/73 existing rows divergent, merging `#1221` before a real existing-row field-convergence authority would risk publishing stale manifest metadata as the exhaustive human-facing `/articles/` catalog.

Do not weaken its media guard and do not hand-patch manifest rows. Closure requires source-derived field convergence, stale `/articles/` route-profile cleanup, Spravochnik metadata cleanup, deterministic projection regeneration, current-main ancestry and exact-head green CI.

## Search continuation — #1209 hard merge blocker

Current observed PR head:

`ee7f1e0ba9102034abd83c33d734e41f7e6fae2c`

Current PR body is stale: it still names older head/base claims. Compare against `main@fa2db40c...` is diverged and the branch is behind by one commit.

Current net PR diff contains **84 files**, including two temporary operational transport files outside the declared bounded Search owner set:

- `.github/workflows/search-stale-interaction-finalizer.yml`;
- `scripts/search-stale-interaction-finalizer.mjs`.

The workflow is self-writing: job-level `contents: write`, exact PR-branch checkout, structural rewrite, `cache-bust.js --write`, commit as `github-actions[bot]`, push to the same PR branch, then intended self-deletion.

Exact current-head evidence rejects this mechanism:

### Shared Files Guard

Run `31247573559`: **FAILURE**.

`Workflow policy contracts` failed before later control-plane stages. Reported policy failures:

1. `stale-interaction-autofix must not stage untracked repository-wide changes`;
2. only the explicitly labelled same-repository glossary normalizer may use `cache-bust --write`;
3. cache-bust policy mutation baseline is invalid for this workflow.

### Self-writing workflow

Run `31247573542` (`Search stale interaction repair once`): **FAILURE**.

The structural Search patch and cache-bust projection ran, but validation failed on the same workflow-policy rules. The bounded-scope and self-clean/push steps were skipped, so the temporary workflow and script remain in the net PR diff.

This is a hard merge blocker, not cosmetic dirt. `#1209` must not merge until both transport files are completely absent from the net diff, the branch contains current `main`, the PR body is refreshed to the actual exact candidate SHA/scope, and fresh exact-head workflows including Shared Files and Search Modal are terminal green.

## Strangler Wave A — #1222

Current observed head:

`17a6fecc39ac443c100f56709088af8a1f393912`

The branch has absorbed `main@fa2db40c...`; current semantic compare is still exactly five intended Strangler files and `behind=0`.

Previous `/index.html` normalization and dependency-registration defects are repaired. The old S12 Source Authority red is obsolete after `#1238`. Fresh exact-head Source Authority, Shared Files, Route Registry, Visual, Deploy, Metadata and Search Modal runs are now running/queued and are the only merge authority.

Do not resurrect the old `/index.html` blocker unless fresh exact-head evidence proves a regression.

## Source Authority trigger coverage — #1245

Current observed head:

`5456bfd1181356b9a3a73a0a4c044881c42f218e`

This branch already contains `main@fa2db40c...`, is `behind=0`, and changes exactly one file (`.github/workflows/source-authority-contract.yml`, +4/-0):

- add `src/content/articles/**` to pull/push path filters;
- add `src/components/baptisty-rossii/**` to pull/push path filters.

No job logic, permissions or assertions change. The repair is appropriately narrow. Fresh exact-head Source Authority / Shared Files / Node Toolchain / Metadata are still running or queued at this refresh; do not merge before terminal green.

## Reader-control owners

Clean successor PRs remain bounded but have not yet absorbed `#1238` at this refresh:

- `#1246` relation-state slice — head `3cd81b29007ee343f23920fff332308c7465696a`, two files, currently behind Product main by one commit;
- `#1240` shared Gill mobile Back-authority slice — head `f91507fb13ab1345e2557b9e4b7bd27b756a53d3`, two files, currently behind Product main by one commit.

Their predecessors `#1227` and `#1233` are forensic/superseded merge vehicles and must not be treated as current owners.

`#1212` remains an audit-only all-reading-route census. Its 887 manifestations are evidence to decompose by root, not 887 MASTER rows.

## Merge-order implications

1. `#1245` may become a small independent merge candidate after exact-head green.
2. `#1222` may become mergeable after its fresh post-#1238 exact-head suite is terminal green and the five-file compare remains intact.
3. `#1209` is blocked by its own temporary self-writing workflow/script and stale ancestry/body; no merge before full transport removal and fresh exact-head green.
4. `#1221` is blocked by upstream manifest field-parity authority, not merely Spravochnik copy or thumbnail presence.
5. `#1240/#1246` need current-main refresh and exact-head reruns before merge authorization.

## Audit disposition

- Product code was not modified by this audit.
- Disposable metadata diagnostic `#1237` remains closed unmerged.
- AuditRepo is the only repository updated by this evidence wave.

---

## Live follow-up — Source trigger merged and manifest writer root localized

This section supersedes moving-head facts above where they conflict with the earlier snapshot.

### Product anchor advanced

`#1245` completed exact-head SUCCESS for Source Authority, Shared Files, Node Toolchain and Metadata, then merged. Current verified Product `main` is therefore:

`11999f6d674e64e6afef590adeb71aeaaf303b3a`

Commit: `ci(source): cover Baptist publication surfaces`.

The permanent Source Authority trigger gap is closed. `BAPT-S12-01` no longer needs trigger coverage as unfinished work; its active residue is Spravochnik source metadata plus deterministic Search/RSS/sitemap convergence and parity verification.

### Exact manifest-writer root

Current `scripts/search-manifest-policy-normalizer.js` already contains the canonical `buildManifestItem()` function that derives route metadata from production-like built HTML:

- `id`, `type`, `url`;
- `title`, `description`, `section`, `editor`, `image`, `tags`;
- `publishedTime`, `modifiedTime`, `readTime`.

However, `migrationCandidates()` only emits missing declared include rows or promotion candidates. In `applyMigration()`, an existing row reaches `candidate.alreadyInManifest` and is explicitly skipped. Therefore the canonical writer never reconciles already-present rows.

The permanent test `scripts/search-manifest-policy-normalizer-test.js` reinforces that current behavior: after first insertion, a second `applyMigration()` is expected to report no additions/promotions, but there is no adversarial mutation proving that a stale existing row is repaired or rejected.

`search-index-policy-inventory.js --strict` likewise records manifest membership and only a small manifest field subset for reporting; the actual strict contract is policy/membership/indexability, not PageHead field parity. This is why 67/73 stale rows can coexist with green Search Manifest Policy.

The correct implementation boundary is therefore the existing canonical normalizer, not a second registry and not catalog-local repair. Existing rows should be reconciled from `buildManifestItem()` while preserving fields that are not owned by that derivation, including current editorial/search extras such as `featured`, `priority`, `scripture`, `seriesId`, `seriesPosition`, `author`, `wordCount` where present. Blind row replacement would itself be lossy because `buildManifestItem()` currently defaults `featured=false` and `priority=0.6` and does not emit those extra fields.

### Downstream impact is wider than Search UI/catalog

`rss-feed-normalizer.js` derives RSS entries from `data/search-manifest.json`, including title, description, creator/editor, section and publication/modification dates. `sitemap-policy-normalizer.js` consumes manifest modification dates and, for policy-generated additions, image/title and `featured`/type-driven priority. Therefore existing-row manifest drift is a discovery-chain authority problem, not merely a catalog thumbnail problem.

A safe permanent convergence transaction should therefore:

1. build production-like `dist`;
2. reconcile PageHead-derived fields on every existing policy-included manifest route while preserving non-derived extras;
3. add missing eligible rows as today;
4. regenerate deterministic `feed.xml` and sitemap projection;
5. fail closed on a deliberately stale existing-row mutation in `search-manifest-policy-normalizer-test.js` or an equivalent permanent parity contract;
6. prove idempotence after reconciliation;
7. keep the focused autofix write scope limited to canonical discovery artifacts.

No dedicated open implementation PR for this root was verified at this follow-up.

### #1209 moved again but transport is still not a final candidate

Latest observed `#1209` head at this follow-up:

`c8caefeeba8fef9c1a3cf8973203632f0a12af5a`

The branch is now **behind current main by 2** and still has an 84-file net diff containing both temporary transport files. The latest transport commit narrows the writer to a semantic two-file patch and separates asset projection from that semantic transaction, but the self-writing workflow/script still exist in the current net diff. Its new writer run and most exact-head checks are still queued/pending at this snapshot. Previous exact-head writer-policy failures remain valid forensic evidence, but should not be mislabeled as the conclusion of the newest `c8caefe...` head until those runs finish.

Merge remains blocked until a later exact head has both transport files absent, current `main` contained, bounded semantic/projection diff, refreshed PR record and terminal green exact-head CI.

### #1222 refreshed after #1245

`#1222` has already absorbed `main@11999f6d...` by normal merge commit. Latest observed head:

`22983986fadc50f22fb831a2b956915576448aad`

Net semantic compare remains exactly five intended Strangler files and `behind=0` at that head. Fresh exact-head Source Authority, Shared Files, Route Registry, Deploy, Visual, Metadata and Search Modal were queued when observed; those new runs supersede earlier post-#1238 runs.

### Other ancestry after current main

At `main@11999f6d...`:

- `#1221@0c779df...` is `behind=2` and remains blocked by existing-row manifest convergence;
- `#1240@f91507fb...` is `behind=2`, still exactly two Back-authority files;
- `#1246@3cd81b29...` is `behind=2`, still exactly two relation-state files.

All require current-main refresh and fresh exact-head CI before merge authorization.
