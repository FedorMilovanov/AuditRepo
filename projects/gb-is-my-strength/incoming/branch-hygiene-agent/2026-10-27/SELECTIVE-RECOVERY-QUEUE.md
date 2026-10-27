# Selective recovery queue — classes B–E

This is a triage sequence, not authorization to change Product. The 28 source branch heads remain preserved in Product Git and in the verified 31-ref local bundle. No B–E remote branch has been deleted.

## Explicit decisions and successors

- `agent/app-integration-zero-debt-20260820`: do not re-admit `AppSiteChrome` or `site-sections.ts`. Merged PR #1797 explicitly superseded that design while preserving the independent Genesis 6 chapter-CTA contract.
- `arena/header-cluster-audit-20261002` (#2158), `arena/header-cluster-repair-20261002` (#2160), and `fix/quiz-runtime-namespace-20261003` (#2165): do not merge. The accepted current-main ownership change is PR #2167. Gill CSS is scoped to `#glsQuizNext`; the shared article quiz keeps `.quiz-next`.
- `system/fix-article-quiz-next-ownership` (#2157): do not merge. The generic `.quiz-next` → `.gb-quiz-next` namespace rename was explicitly superseded.
- `agent/antisovetov-title-suffix-20260818` (#1705) and `repair/antisovetov-title-suffix-20260906` (#1813): do not merge. Both have the identical one-line title change rejected by the current canonical headline test. Do not retry until contract and tests are deliberately changed.
- `content/apostasy-bible-study` (#2145): keep while open PR #2164 supersedes the single-article architecture with a five-part series. Re-evaluate after the successor lands or closes; do not delete during the successor lane.
- `deps/npm-non-major-20260906-r2` and `fix/npm-non-major-security-20260907`: do not merge stale manifests. Their package scripts remove important publication/heading guards. Dependabot #2196–#2198 are separate active proposals, but currently failing checks; they are not yet proven replacements.
- `fix/series-taxonomy-projection-20260911`: hold for #2203. Do not merge its stale search-policy, generated manifest or feed; selectively recover only a current, tested gap after #2203 is resolved.
- `repair/source-surface-audit-completeness-20260906`: do not merge. Its actual diff removes active workflows/source evidence and mutates deploy/build contracts despite its label.
- `fix/quiz-plain-text-payload-20261003`: preserve the unique workflow in Product Git/bundle, not in AuditRepo, and do not reactivate it. Workflow mutations require their own review.
- `lane/metadata-reconcile-tma-pr518-20260908`: do not merge the change from `inconsistent-needs-review` to `approved`; this remains an editorial decision, not a branch-cleanup action.
- `fix/genealogy-relation-confidence-localization`: the useful intent is recovered in Product PR #2204 as a one-file current-main patch, not a merge of the historical branch. Wait for CI before disposition.

## Unique evidence retained in AuditRepo

The incoming evidence tree contains 24 byte-for-byte Git blobs with SHA-1 provenance: 17 C-class pastor-series/reader audit artifacts, five D-class research/metadata artifacts, and two B-class Baptist handoff versions. `SOURCE-ARTIFACT-MANIFEST.csv` carries original path, branch head and blob SHA. The remaining unique code, workflow, scripts and screenshots are still retrievable from the Product source refs and the verified local Git bundle.

## Remaining work before branch retirement

- Class B: review the 103 residual nonblank added lines in `class-B-residual-lines.txt` individually. The 94.92% textual overlap is a heuristic, not proof of equivalence. The two complete Baptist handoff versions are preserved; the two Bible App contract branches still need their two residual selector lines checked against current #2167 ownership.
- Class C: synthesize the pastor-series audit findings into a small number of current, evidence-backed conclusions; re-test reader-audit findings against current Product. Do not bring historical reports directly into active MASTER.
- Class D: keep metadata decisions raw until registry checks and owner approvals; retain the predecessor apostasy source until #2164's disposition is settled; inspect `agent/app-integration-zero-debt` only as history because #1797 already rejected its old chrome design.
- Class E: keep the no-merge decisions above; all other differing blobs require file-level replacement proof, not just a branch-age or content-overlap score.

## Safety

No whole-branch merge for B–E. No mass B–E deletion. `incoming/` stores historical evidence, not current truth or active work. Before any implementation or deletion, recheck Product main, exact heads, tags and PR/owner state.
