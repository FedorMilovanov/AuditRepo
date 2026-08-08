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
