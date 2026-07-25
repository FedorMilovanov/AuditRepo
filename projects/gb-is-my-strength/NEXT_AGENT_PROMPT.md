# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `d94b54889e4f5f0330adaf2b9947e59af4aee7e4`
**Last fully imported exact production witness:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Newer production candidate:** ⚠️ `ddcf71533fe85606ae59d5a6e0d8662db3dd28cb` — permanent post-deploy TTS contract exists in source, but exact readiness/Pages/live-artifact IDs have not yet been imported into AuditRepo.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md`
**Multi-agent convergence report:** `reverify/MULTIAGENT_CONVERGENCE_2026-07-25_d94b5488.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `d94b5488` after merged PR #283;
- PR #283 is the sole accepted owner of the shared PDF product surface and removes repeated gold progress decoration while keeping reversible cards intact;
- PR #280 is closed without merge as a superseded diagnostic branch;
- PR #285 is closed without merge and its temporary Genesis snapshot branch is reset to current `main`;
- the last fully pinned AuditRepo production authority remains `8a535267` until newer exact run IDs and artifacts are imported;
- `ddcf7153` is a newer production candidate, not yet canonical production authority inside AuditRepo;
- this AuditRepo update advances source and orchestration truth only; it does not manufacture missing production evidence.

Canonical evidence:

- `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_d94b5488_multiagent-convergence.md`;
- `reverify/MULTIAGENT_CONVERGENCE_2026-07-25_d94b5488.md`.

## 2) Current active pull requests

At this snapshot the active source PRs are:

- **#284 — deployment provenance**: draft. The current implementation is TTS-coupled and must not be accepted as universal provenance until generic deployment identity/build/routes/assets fields are separated from `extensions.tts`.
- **#286 — reversible-card physical PDF proof**: draft, narrow evidence-only follow-up. It adds no workflow and no product CSS/JS; it must physically prove both front and flipped-back faces on one page through the existing Print Paper Contract.

There is no active Genesis 6 activation PR. The canonical Genesis corpus remains intentionally `draft: true` and `noindex: true` until one explicit owner is created for the five-route activation.

## 3) Shared-surface ownership

- One shared/route surface has one active product owner.
- PDF product ownership is closed through merged #283; #286 owns only the missing permanent physical test.
- Do not revive #280 or create another print implementation branch.
- Do not create another Genesis snapshot. A future activation must use one named activation PR and one owner.
- Before every lane, refresh `main`, open PRs, changed filenames and workflow intersections.

## 4) CI status semantics

Do not treat every red status as the same defect. Classify it first:

1. **protective failure** — for example Shared Files Guard rejecting temporary write workflows in a final tree;
2. **product regression** — for example `back: card root is not atomic`;
3. **cancelled/superseded run** — a newer head cancelled the old run through concurrency;
4. **stale alert lifecycle** — an old failure issue remains open after a green recovery.

`notify-on-failure.yml` currently lacks a recovery state machine and does not reliably consume route-impact artifacts. Do not trust its inferred root-cause prose without the actual failed step and log excerpt.

## 5) Active work, in order

1. **Finish exact physical PDF proof (#286)**
   - require front and flipped-back PDFs;
   - require outer card root `atomic` in both states;
   - require marker start/end on the same physical page;
   - use no article-text selectors;
   - merge only after exact-head Print Paper artifact review.

2. **Refactor deployment provenance (#284) before merge**
   - generic manifest owns repository, commit SHA, workflow identity, artifact digest, build metadata, route-registry snapshot and critical assets;
   - TTS-specific hashes/policy live only under `extensions.tts`;
   - do not create a second specialized workflow;
   - deploy must eventually promote the same immutable artifact that readiness verified.

3. **Fix CI alert lifecycle**
   - key alerts by workflow + branch/PR + latest head SHA;
   - open/update on failure;
   - close or mark recovered on exact-head success;
   - distinguish cancelled/superseded;
   - download the actual diagnostic artifact and quote the failed step/log, not a guessed root cause.

4. **Inventory and converge CI before adding permanent workflows**
   - map capabilities to current workflows/scripts;
   - identify duplicate `npm ci`, production build and validation passes;
   - target build-once → upload immutable artifact → deploy same artifact → generic live witness;
   - specialized TTS/PDF/Gill/Nagornaya checks remain capability gates, not parallel CI platforms.

5. **Replace shadow-era workflow policy (existing issue #64)**
   - derive route coverage from effective route registry;
   - enforce read-only validation and permissions;
   - forbid mutating validation;
   - remove hardcoded historical route/shadow requirements where capability contracts supersede them.

6. **Resolve Genesis 6 activation ownership**
   - current state is intentionally draft/noindex;
   - activation requires one explicit PR and one owner for all five routes;
   - no standalone snapshot may remain open without a named consumer.

7. **Add Research authority manifest**
   - machine-readable document IDs, scope, supersedes, authority, source grade, rights state and pinned source commit;
   - block cycles, duplicate canonical authority, missing documents, stale site references and unresolved image rights.

## 6) Non-negotiable gates

Before source merge:

- exact-head changed-file and ownership refresh;
- Shared Files Guard;
- repository control-plane audit for workflow/package changes;
- Native Source/Route Registry/Visual gates when relevant;
- route-specific browser/PDF contracts;
- production-like build;
- no `_temp-*` workflow/materializer in final scope;
- no mutation in a nominally read-only validation step.

After a production-impacting merge:

- exact readiness;
- exact Pages deployment from the same verified artifact identity;
- generic live witness plus capability-specific witness where relevant;
- only then advance production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head and convergence witnesses.
- stale failure issues are not evidence of current failure.
- no silent evidence deletion and no temporary workflow in a final diff.
