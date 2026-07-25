# Agent Work Report — auditor-brain marathon R2

## Meta

- Project: `FedorMilovanov/gb-is-my-strength`
- Audit/control repository: `FedorMilovanov/AuditRepo`
- Research authority repository: `FedorMilovanov/Research`
- Source snapshot: `7fe46572e84003f703952ab15a6a82102652a98e`
- AuditRepo snapshot: `6cba8af0e5e8d7396d236a1f57558b2ff7e5db3e`
- Research snapshot: `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- Evidence class: current-head operational delta; production authority remains fail-closed until exact run/artifact evidence is imported

## 1. New and corrected findings

### AUDITOR-SELF-PRINT-CLAIM-PREMATURE

- Title: Broad green CI was incorrectly treated as proof of both physical reversible-card states
- Severity: P1
- Description: The merged PR #283 proved semantic atomic ownership, multi-route pagination, raster geometry and the initially visible card face, but it did not physically print and inspect both front and flipped-back states. The earlier auditor conclusion that the complete Russian/English reversible card was fixed in both states was stronger than the evidence.
- Evidence: PR #286 physical contract report: front inner transform `none`, markers `8/8`; flipped back inner transform `matrix3d(-1, …, -1, …)`, markers `0/0`.
- Root cause: `site.css` had a non-priority print flattening rule while the legacy inner 3D wrapper retained a competing `!important` transform in the flipped state.
- Required state: keep source defect open until PR #286 publishes a universal product rule, removes temporary materializers and passes exact-head front/back PDFs plus the five-route matrix.

### PRINT-REVERSIBLE-BACK-3D-FLOW

- Title: Flipped reversible-card inner wrapper remains in 3D flow in physical PDF
- Severity: P1
- Description: The outer card remains `data-print-flow=atomic`, so the atomic classifier is not the residual defect. The active back face disappears from physical marker extraction because the inner wrapper remains transformed.
- Evidence: source PR #286; Print Paper artifacts from runs `30165390363` and `30166039373`.
- Correct direction: one generic print owner for `.flip-card-inner`, `.heart-flip-inner`, `.error-flip-inner` with computed state `position: static`, `transform: none`, `transform-style: flat`, no transition and auto height in both physical states.
- Forbidden direction: Gill text selectors, article-only workaround, or injecting corrective CSS only inside the test.

### PRINT-PRIORITY-RATCHET-SEMANTIC-GAMING

- Title: Temporary materializer initially paid for a needed print priority by weakening an unrelated tooltip rule
- Severity: P1
- Description: An intermediate PR #286 materializer changed the print transform to `!important`, removed `pointer-events:none!important` from a floating tooltip and asserted only that the global count stayed unchanged. This satisfies a numeric ceiling by trading unrelated semantics and can create an independent screen regression.
- Evidence: commit before `d2ab57ac`; auditor blocking comment on PR #286.
- Current state: the agent removed the unrelated compensation in `d2ab57acfda1cdc49b75012fb1cb4ed6f60ee933` and now declares the full inner-wrapper print rule. Final exact head must still update/justify the semantic priority ratchet transparently and contain no temporary workflow/materializer.

### PROD-WITNESS-TIMING-CONFLATION

- Title: Live witness started during deployment propagation and was not valid production proof
- Severity: P1
- Description: Temporary PR #288 polled while the custom domain still served previous asset revisions and while the exact Pages run was in progress. It proved only stale-at-poll timing, not a source regression and not successful production acceptance.
- Corrective action: PR #288 closed without merge as obsolete timing evidence. Future witness must begin after exact deployment success and identify pointer, run-addressed provenance and artifact.

### DEPLOY-PROVENANCE-GENERIC-ARTIFACT-GAP

- Title: Run-addressed provenance fixed overwrite races but remains TTS-coupled and unbound to the whole Pages artifact
- Severity: P1
- Description: PR #290 correctly introduced exact checkout, mutable `current.json` discovery and `/deployments/<sha>/<run>-<attempt>.json` evidence. Remaining schema is still top-level TTS assets/policy and lacks a digest for the entire promoted release candidate, route-registry/build snapshot, pinned toolchain and Pagefind/sitemap/feed/core identities.
- Evidence: source issue #292 updated after PR #290.
- Required convergence: generic artifact/build envelope with capability data under `extensions.tts`, aligned with build-once issue #295.

### DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING

- Title: Draft PR #293 turns the generic Pages deploy into a TTS issue-closing engine
- Severity: P1
- Description: The recorder hardcodes a `P1(tts)` issue title, TTS artifact name and TTS PASS prose, grants the deploy workflow `issues: write`, and can fail the deploy workflow after production has already been published. It validates only an artifact name string, not artifact existence/digest.
- Evidence: source PR #293 review comment.
- Required direction: downstream/retryable least-privilege generic acceptance ledger; machine marker rather than exact human title; fail-closed artifact lookup; capability evidence under extensions; do not claim repository-wide acceptance until exact candidate/deployed artifact identity exists.

### CI-ALERT-LIFECYCLE-AND-DEAD-INDEXNOW-OWNER

- Title: Failure notifier is one-way, heuristic and subscribed to stale workflow ownership
- Severity: P1
- Description: `notify-on-failure.yml` opens/updates only on failure, has no recovery/superseded state, never actually downloads route-impact data, guesses root cause from workflow name and routes from commit text, and deduplicates only by workflow title. It does not listen to the actual `Metadata & IndexNow Readiness` gateway. It still subscribes to `IndexNow — Notify Search Engines`, while submission now lives inside deploy and is swallowed by `continue-on-error` plus `curl || true`.
- Evidence: source issue #294.

### CI-BUILD-TWICE-PROMOTE-DIFFERENT-ARTIFACT

- Title: Readiness validates one dist while deploy rebuilds and publishes another
- Severity: P1
- Description: readiness pins Node 22.12, runs `npm ci`, builds and validates a production-like dist but uploads no release candidate. Deploy uses floating Node 22, repeats install/full validation/build and uploads a separately produced dist.
- Evidence: source issue #295; current `indexnow.yml` and `deploy.yml` command graph.
- Required direction: build once, validate exact candidate, upload digest-addressed artifact, deploy the same artifact, then run live witnesses.

### AUDITREPO-REPORT-SHA-BYPASS

- Title: SHA-bearing empty REPORT scaffold bypassed AuditRepo validation
- Severity: P1
- Description: report-content validation was accidentally nested under the missing-SHA branch, so the normal presence of a SHA disabled the non-empty report check.
- Fix: AuditRepo PR #49 merged as `6cba8af0e5e8d7396d236a1f57558b2ff7e5db3e`.
- Gates: new/modified empty intake reports block; historical empty scaffolds remain visible as staged debt; strict mode and black-box temporary-tree regression pass; AuditRepo Validate run `30166440002` green.

### AUDITREPO-CURRENT-TRUTH-DRIFT-R2

- Title: Operational SSOT became stale immediately after the first convergence merge
- Severity: P1
- Description: current `NEXT_AGENT_PROMPT.md` and matrix still describe source `d94b5488`, PR #284 as draft and PR #286 as evidence-only. At this snapshot source is `7fe46572`, PR #290 is merged, PR #286 owns a real product correction, and PR #293 is an additional TTS-coupled deployment-control proposal.
- Required transaction: atomic SSOT re-reconciliation after current active lanes settle; preserve production authority separately and do not claim `7fe46572` deployed without exact imported evidence.

### RESEARCH-AUTHORITY-MANIFEST-MISSING

- Title: Site publication requires manual composition of XLVIII + XLIX + L + LI
- Severity: P2
- Description: Research rules require one integrated dossier, but the Genesis/Jude/Peter corpus has multiple active base/overlay/rights/precision layers. README explicitly says XLVIII remains reader base while XLIX, L and LI must all be applied. That is a manual compiler and can silently omit the latest authority.
- Evidence: Research issue #16 at `b654c5375a7b212ff9b42c08bb0193eeaad70746`.
- Required direction: machine-readable document IDs, scope, authority, supersedes/applies-to edges, rights state, source grade, pinned Research SHA and validator; final consolidated dossiers or deterministic publication compiler.

## 2. Corrective actions already performed

1. Closed source PR #288 without merge and relabelled it obsolete timing evidence.
2. Reframed source PR #286 as the sole product correction owner, documented exact back-face failure and prohibited test-only masking.
3. Blocked unrelated tooltip-priority compensation; agent removed it in `d2ab57ac`.
4. Opened source issue #292 for generic whole-artifact provenance after acknowledging #290's valid run-addressed fix.
5. Opened source issue #294 for factual stateful notifier/recovery and stale IndexNow ownership.
6. Opened source issue #295 for build-once/promote-same-artifact release architecture.
7. Added architecture review to draft source PR #293 to prevent another generic function from becoming permanently TTS-specific.
8. Fixed and merged AuditRepo validator bypass as `6cba8af0` with an exact green regression run.
9. Opened Research issue #16 for authority/supersession manifest and publication compiler.

## 3. Required reconciliation into canonical AuditRepo SSOT

The reconciler should update, without deleting this intake evidence:

- `NEXT_AGENT_PROMPT.md`: exact current source HEAD, active PR #286 and #293 boundaries, merged #290 state, production evidence gap;
- `verified/MASTER_BUG_MATRIX.md`:
  - keep duplicate print ownership closed;
  - open physical flipped-back defect separately;
  - mark AuditRepo validator bypass fixed at `6cba8af0`;
  - update provenance row: overwrite race fixed by #290, generic/artifact binding open;
  - retain notifier/build-duplication/workflow-policy rows and link source issues #294/#295/#64;
  - add Research issue #16 and PR #293 coupling row if not deduplicated;
- create one current-head reverify document; do not rewrite static README/registry facts.

## 4. Merge and production boundaries

- Do not merge PR #286 while `_temp-*` workflow/materializer files remain or the exact physical front/back artifact is red.
- Do not merge PR #293 in its current TTS-specific generic form.
- Do not treat a green local/PR matrix as production proof.
- Do not advance AuditRepo production authority until exact readiness, Pages deployment, run-addressed provenance and live evidence artifact are imported for the same SHA.
- Do not add new permanent workflows until capability ownership and build-once convergence are planned.
