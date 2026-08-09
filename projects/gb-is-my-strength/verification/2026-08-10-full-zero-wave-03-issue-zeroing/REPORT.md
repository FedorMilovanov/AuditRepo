# Full-Zero Closure Audit — Wave 03: Issue Zeroing

Date: 2026-08-10 (+03)
Product anchor during audit: `main@9e9556a2e0a389b351ea4f0490275128a6eed046`
Parent reports:
- `../2026-08-10-full-zero-wave-01/REPORT.md`
- `../2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md`

## Purpose

Re-check the non-CI open issue residue against current Product truth after the large finish/convergence chain. The goal is to distinguish:

- current verified defect;
- partial/umbrella residual;
- already solved but stale-open issue;
- measurement/test-hardening proposal rather than Product bug;
- valid future content/product work that must not extend the current stabilization wave.

No new Product implementation lane is authorized by this report.

## A. Current stabilization owner — still active

### `#1295` — Lot standalone publication

Disposition: **ACTIVE CURRENT ROOT**.

Current route publication is owned by the sole open Product PR `#1456`. Its prerequisites that were historically blocking are already merged: reader figures, rights-safe Scripture projection and exactly 28 production WebPs.

Do not create a second Lot lane. Terminal sequence remains exact-head green → guarded merge → live witness → close #1295.

## B. Verified current SYSTEM defects — real, but outside the current #1403 finish line unless they break the current release candidate

### `#1249` — protected diff uses stale PR payload base SHA

Disposition: **VERIFIED CURRENT DEFECT**.

The current `.github/workflows/shared-files-guard.yml` still sets:

`BASE_SHA: ${{ github.event.pull_request.base.sha || github.event.before }}`

and passes that value to `guard-shared-files.js`.

This directly preserves the defect described by #1249: after base branch movement the event payload base SHA can be historical rather than the live merge-base. Current successful CI does not invalidate the root because the documented failure mode is conservative over-validation / false collision ownership, not necessarily a red run.

Required later bounded repair: derive one effective live base/merge-base and use it consistently for protected diff + collision accounting, with fail-closed parent verification.

### `#1247` — machine-distinguishable writer lease

Disposition: **VERIFIED CURRENT GOVERNANCE DEFECT**.

Current `docs/LANE_LOCK_POLICY.md` explicitly states that the machine collision boundary is stateless and that **no lock file, lease, TTL, heartbeat or branch mutation exists**. It relies on open PRs and exact-file precedence.

Therefore #1247 is not stale. The hard-finish prompt reduced the practical concurrency problem, but it did not create the requested mechanical writer/session lease.

This is important for the next clean development era, not a reason to delay current Lot publication.

### `#1224` — reader control → surface semantics

Disposition: **PARTIALLY FIXED, CURRENT RESIDUAL CONFIRMED**.

Merged repairs already absorbed meaningful slices:

- `#1258` merged config-owned shared mobile Back;
- `#1259` merged reader control relation-state synchronization.

Current source also proves one historical residual is now fixed: `GillLearningSheet.astro` renders `panelQuiz` only when `hasQuiz`, matching conditional `tabQuiz`.

But the umbrella is not done. Current `ReaderRail.astro` still contains:

- `<span class="hrail-track">` directly under `<ul class="hrail-toc">`, preserving invalid list semantics;
- hamburger-looking bottom control with `data-fc-action="search"` and `aria-label="Поиск и разделы сайта"`, i.e. Menu/Search meaning remains conflated on this shared standalone rail.

Therefore do not close #1224 yet. Re-scope it to only the residuals that survive current main; do not replay already merged Back/relation work.

### `#1244` — Source Authority trigger closure

Disposition: **PARTIALLY FIXED / SYSTEM RESIDUAL NEEDS ONE CURRENT CONTRACT CHECK**.

The concrete Baptist witness is fixed:

- merged `#1245` permanently added `src/content/articles/**` and `src/components/baptisty-rossii/**` to both PR and push Source Authority path filters;
- those paths remain present in the current workflow.

However #1244 explicitly owns the broader invariant: workflow applicability should be derived/guarded against the actual static-publication input surface, with adversarial path-filter proof, not only patched for two discovered witness classes. The current workflow is still a manually enumerated path list.

Do not open a repair lane until the existing `workflows:check` / control-plane contracts are inspected for an already-implemented general closure test. If no such test exists, #1244 remains a real bounded SYSTEM guard-health root. If it does exist, close #1244 as absorbed.

## C. Strong stale-open / already solved candidates

### `#1288` — Search title guard vs PageHead authority

Disposition: **SOLVED IN CURRENT SOURCE — CLOSE COMPLETED after one targeted command receipt**.

Current `scripts/check-data-consistency.js` now gates H1/title literal consistency only when `legacyIsAuthoritative(profile)` is true. Its own comment states that strict-native/reference-only routes derive `search-manifest.title` from built PageHead authority.

That is the architecture #1288 requested. The issue is stale-open unless its targeted command unexpectedly exposes another manifestation.

### `#1239` — CRC32 documentation drift

Disposition: **SOLVED IN CURRENT SOURCE — CLOSE COMPLETED**.

Current `AGENTS-REFERENCE.md` no longer contains the stale CRC32 claim, while current `scripts/cache-bust.js` explicitly implements `md5short()` as MD5 hex truncated to 8 characters.

No Product code repair is required. This is pure stale issue lifecycle debt.

## D. Current issue requires fresh proof before promotion

### `#1225` — first-class footnote projection for screen/a11y/print

Disposition: **LIKELY CURRENT SEMANTIC DEFECT — REVERIFY, THEN ONE BOUNDED OWNER**.

No implementation PR matching this root was found in the current PR history query. The issue describes a substantive publication problem: numbered note bodies live primarily in interactive tooltip markup while print policy historically hides tooltip bodies, and marker→note accessibility identity is weak.

Do not infer closure from the successful Scripture rights work: #1384/#1452 addressed public Scripture bytes/projection, not the general numbered/source footnote publication model.

Next proof should inspect current rendered representative Hermenevtika/KdV/Gill notes and physical print output. If the note bodies are still absent from print or markers lack unique semantic relations, promote one bounded SYSTEM owner. If current shared work already fixed both, close stale.

## E. Not proven Product bugs — should not remain open as active defect inventory

### `#1243` — Search first-result latency measurement

Disposition: **MEASUREMENT-ONLY, NOT A PROVEN REGRESSION**.

The issue itself explicitly says this is not a proven regression and requires baseline measurement before algorithm change.

For a clean zero-state, move the measurement idea to `WORK_QUEUE.md` / future performance work and close the Product issue as `not_planned` unless an actual measured regression is first demonstrated.

### `#1242` — Search continuation fixture hardening

Disposition: **TEST-HEALTH FOLLOW-UP, NOT A PRODUCT RUNTIME BUG**.

The issue explicitly states current permanent Search browser behavior is already green and the residuals are narrower harness observability/concurrency witnesses.

Move to Work Queue / test-hardening backlog and close the Product issue as `not_planned`, unless current re-run exposes a real runtime defect.

### `#298` — owner-approved product goldens

Disposition: **VALID QUALITY INVESTMENT, NOT CURRENT RELEASE DEFECT**.

This describes a real limitation of migration parity: current legacy↔dist parity cannot detect a common-mode Product regression. But immutable owner-approved product goldens are a future quality-system feature, not proof that current Product is broken.

Keep the concept in Work Queue / next clean quality wave; do not let it hold #1403 open.

### `#1360` — Baptist provenance-verified media completion

Disposition: **VALID CONTENT COMPLETION PROJECT, NOT CURRENT STABILIZATION BUG**.

The issue intentionally asks to replace remaining placeholder/missing Baptist historical media with rights/provenance-verified archive assets. Existing provenance guard #1350 protects published evidence, but does not promise a complete visual corpus.

This is genuine unfinished content enrichment and should not be mislabeled stale. However it is not part of current release convergence unless a current public page has a broken/lying production image. Preserve as planned content work after repository zeroing, or explicitly defer it in Work Queue rather than spawning media lanes during cleanup.

## F. Umbrella issue likely ready for consolidation

### `#54` — Hermenevtika professional closure umbrella

Disposition: **STALE UMBRELLA / CONSOLIDATE, NOT A NEW IMPLEMENTATION OWNER**.

This issue predates the many later SYSTEM roots and contains a broad historical decomposition. Major slices have since gained canonical owners and/or completed implementations, including strict-native/source work, reader runtime work and rights-safe Scripture publication.

Known still-relevant general residuals have newer canonical roots:

- reader control/surface semantics → `#1224`;
- publication footnotes/accessibility/print → `#1225`.

Before closing #54, run one current Hermenevtika route smoke against its own final DoD and record any unique residual not already owned by #1224/#1225. If there is no unique residual, close #54 as superseded/absorbed instead of using it to spawn another Hermenevtika mega-wave.

## Issue-zeroing classification after Wave 03

### Keep as current/verified technical work after stabilization

- `#1249` — real current Shared Files merge-base defect;
- `#1247` — real current writer-lease governance gap;
- `#1224` — reduced but real reader-semantics residual;
- `#1244` — concrete witness fixed; verify whether broader trigger-closure contract still absent;
- `#1225` — reverify current print/a11y semantics, likely real.

### Stale-open closure candidates

- `#1288` — current source implements requested authority boundary;
- `#1239` — stale CRC32 wording already gone.

### Move out of active Product-defect inventory

- `#1243` — measurement-only;
- `#1242` — test-health hardening;
- `#298` — future visual quality system;
- `#1360` — future provenance-backed content completion, unless broken live media is separately proven.

### Consolidate umbrella

- `#54` — close as absorbed if one current route smoke finds no unique residual beyond newer roots.

## Full-zero implication

The 24-open-issue count materially overstates unfinished Product bugs.

After stale CI lifecycle issues are retired and the two stale-open roots above are closed, the genuinely current technical residue appears to be a **small single-digit set**, not dozens of independent repairs.

The correct execution order remains:

1. do not move the stabilization finish line — finish #1456/#1295/#1403 first;
2. retire stale CI identities with branch provenance;
3. close #1288/#1239 if targeted receipts stay green;
4. consolidate #54;
5. move measurement/quality/content-future items out of active defect inventory;
6. run one bounded post-stabilization SYSTEM wave for verified current roots (#1249, #1247, #1224, #1244 if still applicable, #1225 if reverified);
7. finish each root to terminal merge/close under the hard-finish contract;
8. branch cemetery continues in parallel without creating Product feature work;
9. MASTER reaches zero only when no verified current defect remains and every remote ref/open issue has an explicit terminal disposition.
