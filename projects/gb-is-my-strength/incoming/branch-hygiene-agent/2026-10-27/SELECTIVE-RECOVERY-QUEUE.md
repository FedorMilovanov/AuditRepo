# Selective recovery queue — classes B–E

This is a triage sequence, not authorization to change Product. All listed branch heads remain preserved in the Product repository and in a local 31-ref Git bundle. Recheck current Product HEAD and ownership before any implementation.

## First priority: truly unique evidence (class D)

- `book/ch07-mazaev-prokhanov-research-v2` — keep the source-to-claim table and visual dossier in evidence intake (both exact blobs transferred). Future recovery should connect claims to citations; do not copy content into product article without editorial checks.
- `lane/teen-core-content-clearance-20260908` — preserve the dated clearance decision as raw evidence; re-verify scope and approval before publishing or changing any editorial status.
- `lane/metadata-review-decision-rimlyanam7-20260908` and `lane/metadata-standalone-three-reconciliation-20260908` — the JSON artifacts are preserved; do not promote a review decision into canonical metadata until the current registry checks and owner-sensitive status rules are re-run.
- `content/apostasy-bible-study` — contains an unmerged article draft not copied into AuditRepo as current Product content. A future recovery should be a new content-only PR after biblical/editorial review; do not merge this 326-commits-behind branch.
- `agent/app-integration-zero-debt-20260820` — two product-code paths are unique. Keep in Product bundle; recover only against a fresh main tree after route/section contracts and current integration state are checked.
- `fix/quiz-plain-text-payload-20261003` — unique `.github/workflows/quiz-plain-text-self-clean-v2.yml` stays preserved but is not copied or reactivated. No workflow change is authorized here.

## Second priority: unique audit results (class C)

- `arena/01a0a1b2-gb-is-my-strength` and `arena/01a0a1b4-gb-is-my-strength` — 12 dated pastor-series Markdown reports were preserved as incoming evidence. Synthesize them before any action; they are multiple passes and a backlog, not 12 independent current tasks. Reverify current routes/content and compare with existing MASTER/legacy before admitting anything to the active matrix.
- `arena/01a0a1ce-gb-is-my-strength` — key reader-audit `FINDINGS.md` and five JSON matrices were preserved as evidence. Scripts/screenshots remain in Product Git/bundle. Before fixing any issue, test the exact finding against current Product and inspect overlapping owner/PR lanes.
- `arena/01a0a1b4-gb-is-my-strength` has no unique code fix approved; audit evidence is the useful part currently recovered.
- Dependency branches and the remaining C-only code deltas remain unmerged. Validate lockfile/runtime compatibility and exact checks before creating a narrow dependency PR.

## Class B residuals

Review `class-B-residual-lines.txt` alongside `BRANCH-DISPOSITION.csv`. Line presence is not semantic equivalence. The Baptist-chapter reconciliation file has a small amount of residual narrative/evidence metadata; header cluster and keyboard-scroll branches have actual selector/style/test deltas. None is to be deleted on the basis of the 94.92% aggregate text-presence figure. Map each residual to a current replacement or selectively recover it first.

## Class E: explicit non-merge decisions

- `agent/antisovetov-title-suffix-20260818` and `repair/antisovetov-title-suffix-20260906`: do not merge. The second repeats the same one-line title change already rejected by #1705 because current Product's canonical headline contract expects the shorter `| Господь Бог` suffix and exact-head CI rejected the longer suffix.
- `system/fix-article-quiz-next-ownership`: do not merge. Renaming generic `.quiz-next` to `.gb-quiz-next` was explicitly superseded.
- `fix/quiz-runtime-namespace-20261003`: do not merge. Its Gill selector scope was accepted and then carried into #2167; current main already uses the `#glsQuizNext` selector while generic quiz runtime retains `.quiz-next`.
- Other class-E branches need file-level comparison and replacement evidence; differing blobs do not mean the work should be integrated.

## Guardrails

- No whole-branch merge for B–E.
- No mass deletion for B–E.
- Do not restore unapproved `.github/**` workflows or merge stale product code.
- `incoming/` is raw historical evidence, not current truth; MASTER promotion requires fresh applicability verification.
