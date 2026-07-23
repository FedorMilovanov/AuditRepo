# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived under
> `archive/stale/2026-07-23-current-truth-cleanup/`. Bug status and counts belong to
> `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary and next execution order.

**Source main:** `83f04647c470a92c340d4d7990485c4e1376836b`
**Production:** ✅ exact `83f04647`
**Readiness:** `29966152952` — success
**Pages:** `29966633078` — success
**Live witness:** AuditRepo `29967501124` / artifact `8548383473`

## 1) Proven production boundary

The deployed source is exact `83f04647c470a92c340d4d7990485c4e1376836b`. It contains these completed waves:

- PR #154 — epistemic comparison UI: merge `f1946b523d45028c17e39ecf1dc6e9b361887401`;
- PR #157 — route semantics: merge `6f412430a21eae411970f8601687c4f99f61e9c4`;
- PR #158 — Nagornaya PremiumControls ARIA release repair: merge `6fe9be4064ffa4d50549607f89a9d2ca2f42c2f5`.

The current production descendant is seven CI/control commits ahead of the release repair. The release SHA is a verified ancestor; no product fix was reverted.

Exact chain:

1. Metadata & IndexNow Readiness `29966152952` — success on `83f04647`;
2. Deploy to GitHub Pages `29966633078` — success on the same SHA;
3. all deploy steps passed, including PremiumControls, Gill smokes, broad runtime, content coverage, SW switch, Pages upload/deploy and IndexNow;
4. live HTTP witness found:
   - `nagornaya-matthew-luke-observation-matrix`;
   - `nagornaya-part4-green-model`;
   - `nagornaya-part4-thomas-model`;
   - `aria-haspopup="dialog"` + `aria-expanded="false"` on Nagornaya Play controls;
5. live hashes:
   - `/nagornaya/chast-1/` — `d8a15ef9a83ead0dea12f29ad64b6bb0d7904397fecda7abc9de4ea33a79ffeb`;
   - `/nagornaya/chast-4/` — `45168405d3b946a8e1cae295affa75947ca668ed5941f511a5c4096f19b39c6d`.

Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_83f04647_production.md`.

## 2) Completed lanes — do not reopen without current-head evidence

- `NG-UI-EPISTEMIC-BIAS-01` / issue #153 — closed by PR #154; 3428/3428 all-route, 174/174 epistemic UI, 20 before/after PNG.
- `READER-ROUTE-SEMANTICS-01` / issue #146 — closed by PR #157; 3428/3428 all-route, 126/126 route semantics.
- `NG-PREMIUM-CONTROLS-ARIA-01` — closed by PR #158; exact production-like PremiumControls 158/158 and live ARIA witness.

Reader R6 / issue #59 remains a separate future lane and must not be mixed with cleanup or route semantics.

## 3) Active work, in order

1. **AuditRepo current-truth cleanup — PR #28**
   - finish canonical cleanup and remove its last temporary deploy observer;
   - keep all moved evidence under archive paths; do not delete historical witnesses;
   - rerun `check_auditrepo_structure.py`, `validate_audit_repo.py`, and matrix coverage.

2. **Matrix coverage to zero**
   - BAD-COMMIT-REF is already zero after immutable-SHA normalization;
   - remaining debt is orphan claims and unregistered evidence IDs;
   - fix parser false positives first, then register aliases/retired IDs or attach independent current evidence;
   - never satisfy coverage by citing the matrix as its own evidence.

3. **Source legacy/control cleanup — draft PR #159**
   - only three unreferenced superseded audit implementations and one completed lane document;
   - active strangler, `legacyPath` parity references, archives and Gill PR #156 orchestrator remain protected.

4. **Gill PR #156**
   - active draft transaction; its temporary branch orchestrator is not stale until the PR finishes;
   - do not merge unrelated work into that lane.

5. Continue the verified P0/P1 order from `MASTER_BUG_MATRIX.md` after governance cleanup is merged.

## 4) Non-negotiable gates

Before any source merge:

- Shared Files Guard;
- Native Source Contract when source/profile paths are touched;
- Route Registry Validators and browser matrix when public semantics are touched;
- Visual Parity policy when rendered surfaces are touched;
- production-like build and route-specific release gate for deploy blockers.

After any production-impacting merge:

- exact readiness success;
- exact Pages success;
- live marker/hash witness;
- only then update AuditRepo current truth.

## 5) Data hygiene rules

- `PROJECT_REGISTRY.md` is static; never put HEAD or session history there.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns status/counts.
- `reverify/` owns immutable current-head witnesses.
- superseded intake is moved to `archive/stale/`; fixed rows/evidence to `archive/fixed/`.
- no silent deletion of evidence; Git history alone is not a substitute for a provenance note when moving AuditRepo evidence.
