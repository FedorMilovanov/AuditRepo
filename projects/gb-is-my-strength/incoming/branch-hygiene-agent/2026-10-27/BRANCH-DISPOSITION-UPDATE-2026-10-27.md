# Branch disposition update — 2026-10-27

**Product review anchor:** `FedorMilovanov/gb-is-my-strength` main `21dcfdd9f9018607a708c5118383e287ec1a3fed`.
**AuditRepo anchor:** `cb41d406965db63ce93b818c286faff3fb315586` (after merge of evidence intake PR #497).
**Purpose:** content-aware disposition for the 28 still-retained B–E Product branches, beyond the initial queue. This does not authorize deletion of a branch or override its owner.

## Decisions grounded in predecessor/successor evidence

| Source lane | Evidence | Decision |
|---|---|---|
| `agent/app-integration-zero-debt-20260820` | Merged PR #1797 explicitly excludes old `AppSiteChrome`/`site-sections` as superseded and recovers only the Genesis 6 CTA contract. | Do not re-admit old navigation component. Keep branch for historical provenance pending owner-approved archive/ref cleanup. |
| `arena/header-cluster-audit-20261002`, `arena/header-cluster-repair-20261002`, `fix/quiz-runtime-namespace-20261003` | Current main PR #2167 scopes Gill visibility rules to `#glsQuizNext`; general quiz runtime still owns `.quiz-next`. | Do not merge any old branch wholesale. |
| `system/fix-article-quiz-next-ownership` | PR #2157 explicitly says the `.gb-quiz-next` rename is superseded; canonical generic quiz contract remains `.quiz-next`. | Do not merge. |
| Both `antisovetov-title-suffix` branches | PR #1705 rejects the one-line suffix change because executable headline contract/CI expects `| Господь Бог`. PR #1813 repeats the same blob. | Do not merge or attempt again without an owner-approved contract+test change. |
| `content/apostasy-bible-study` | Open PR #2164 identifies its head `994b8735f79383c860ee6502ed36a9bcd9531886` as the superseded single-article architecture for a five-part series. | Keep while the successor is open. Do not merge/delete yet. |
| Two old npm-non-major branches | The package script delta removes current publication/heading guards from the build/check flow; current Dependabot #2196–#2198 have failing checks, so not yet accepted replacements. | Do not merge stale lockfiles. Keep until dependency lane is independently resolved. |
| `repair/source-surface-audit-completeness-20260906` | Actual base-to-head diff removes numerous active `.github/workflows/*` contract files and source/audit materials and changes deployment behavior. | Do not merge based on its name; preserve and review exact removals. |
| `fix/series-taxonomy-projection-20260911` | Seven-file old search/taxonomy/generated-feed delta; open PR #2203 owns current search/bootstrap surface. | Hold, compare after #2203; never restore generated feed/manifest blindly. |
| `lane/metadata-reconcile-tma-pr518-20260908` | Changes owner-sensitive editorial status from `inconsistent-needs-review` to `approved`. | Do not merge; separate explicit editorial decision required. |
| `fix/genealogy-relation-confidence-localization` | Its small user-facing label mapping has been selectively reimplemented on exact current main in Product PR #2204 (`55e44954ea80d9640016376332fe8ee4f1f9871a`). | Historical branch itself is not the patch; wait for PR #2204 checks. |

## Evidence inventory

`BRANCH-DISPOSITION.csv` now records a specific decision for each of 28 branches, while `branch-forensic-B-to-E.json` stays the raw compare snapshot. `SOURCE-ARTIFACT-MANIFEST.csv` records 24 source blobs checked byte-for-byte against Git object SHA-1. The class B line file is a review aid only; textual presence does not prove semantic equivalence.

## Outstanding, intentionally not done

- No Class B–E remote branch deleted; no tags changed.
- No old Product code, generated index, content draft or workflow merged wholesale.
- Class D `content/apostasy-bible-study` remains protected while #2164 is open.
- Dependabot #2196–#2198 still have failed checks, so they are not marked as accepted successors.
- Canonical Product branch hygiene script could not complete due GitHub API transport errors; the JSON file is the custom snapshot, not a claimed successful canonical report.
