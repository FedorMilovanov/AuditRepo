# Canonical Verifier Note — current-head status flips and second-order defects
**Project:** gb-is-my-strength  
**Date:** 2026-06-27  
**Source HEAD audited:** `49b83365606cec1e65060238cefea210439b882d`  
**AuditRepo SHA:** `6cd5785dd8c5b361ff7caae83e8acd7a06cbfed0`  
**Verifier mode:** current-head correction / deepening / canonicalization  

---

## Purpose

This note does **not** replace historical evidence.  
It corrects how current HEAD should be understood now that the project has moved beyond the 2026-06-25 ledger baseline.

Main conclusion:

> The repo is substantially healthier than older ledgers imply, but it still carries live **second-order defects**: workflow-policy drift, incomplete route-contract finishing, Gill architectural split, and fragmentation of canonical truth across verification artifacts.

---

## Evidence run in this pass

### Read
- `AuditRepo/README.md`
- `AuditRepo/SANDBOX-ENV-2026-06-21.md`
- `AuditRepo/projects/gb-is-my-strength/README.md`
- `AuditRepo/projects/gb-is-my-strength/verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- 2026-06-27 reverify docs in `reverify/`
- source repo `AGENTS.md`, `docs/WORK_MODES.md`, `package.json`

### Commands executed on current HEAD
```bash
npm ci
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run data:consistency
npm run guard:shared-files
npm run workflows:check
npm run content:parity
node scripts/audit-pro.js
npm run validate:static-publication
```

### Current gate truth
- `validate:static-publication` ✅ passes
- `audit-pro` ✅ passes with warnings
- `data:consistency` ✅ passes
- `native:runtime:audit:strict` ✅ passes
- `workflows:check` ❌ fails on current HEAD

---

# 1. Status flips the verifier should make now

## SF-1 — Generic “repo/CI/publication is broadly broken” framing → STALE
**Old intuition:** project still in broad breakage / unstable release state  
**New status:** `stale-on-current-head`

### Why
Current HEAD passes the heavy publication barrier. The codebase is not in the old “critical instability everywhere” state anymore.

### Verifier guidance
Do not keep broad “system is broken” framing as canonical truth. Replace with narrower second-order defects.

---

## SF-2 — Generic “premium controls globally broken” framing → STALE
**Old intuition:** premium controls still broadly nonfunctional  
**New status:** `stale-on-current-head`

### Why
Recent HEAD has multiple premium-control recovery commits and passes full static-publication. Broad global-breakage wording is no longer accurate.

### Verifier guidance
Keep route-specific or family-specific residual issues only.

---

## SF-3 — “There is one current canonical bug count in old 2026-06-25 docs” → STALE / MISLEADING
**Old intuition:** old counts are still operational truth  
**New status:** `stale-on-current-head` and `documentation correction required`

### Why
Multiple subsequent commits and reverify waves have invalidated any naive reuse of old totals.

### Verifier guidance
Do not promote old count snapshots as current truth. Use them as historical baseline only.

---

# 2. Findings that remain live, but must be reworded more precisely

## RT-1 — CI / release-process issues did not disappear; they changed shape
**New recommended status:** `confirmed-current`

### Precise current truth
The active issue is **not** “CI is dead”. The active issue is:
- `npm run workflows:check` is red on current HEAD
- while `validate:static-publication` is green

This is a **workflow-policy drift** issue, not a platform-collapse issue.

### Evidence
```text
GB WORKFLOW POLICY CHECK
❌ 1 issue(s):
- package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
```

### Canonical wording
**Policy guard and canonical release barrier are no longer perfectly aligned.**

---

## RT-2 — route-contract drift is still live, now best represented by `/izbrannoe/`
**New recommended status:** `confirmed-current`

### Precise current truth
`/izbrannoe/` is already source-visible and UI-linked, but not fully registered in all metadata/contract layers.

### Evidence
Warnings from current strict checks:
- `/izbrannoe/: no entry in route-migration-matrix.json`
- `route /izbrannoe/: production-dist route without search-manifest entry`
- `Missing local reference: index.html → /izbrannoe/`

### Canonical wording
**Feature rollout reached source/UI before contract reconciliation completed.**

---

## RT-3 — Gill remains a real current convergence problem
**New recommended status:** `confirmed-current`

### Precise current truth
Gill is still split between:
- migrated/context-like `gbs-rail-foot` family
- legacy `gbs2-*` family on other pages

This is not merely visual drift; it is active architecture debt with guard implications.

### Canonical wording
**Gill premium surface remains cross-family inconsistent on current HEAD.**

---

## RT-4 — source-vs-built divergence remains an active risk class
**New recommended status:** `confirmed-current` as structural class, even where specific old reproductions may be stale

### Precise current truth
Because this repo ships both source components and committed built/static HTML, source-side fixes cannot be assumed to equal publication truth.

### Verifier guidance
Any future status claim on route UI fixes should specify evidence layer:
- source-only
- built-html
- production-like dist
- browser witness

---

# 3. Net-new second-order defects the current verifier should add

## SOD-1 — Workflow guard drift outside canonical release barrier
**Severity:** P1  
**Recommended status:** `confirmed-current`

### Definition
`workflows:check` catches a real issue on HEAD, but the full release gate still passes because the workflow-policy guard is not part of the canonical barrier.

### Why this matters
This is a classic “intended protection exists, but is not truly operationalized” defect.

### Repair direction
- fix `dist:jsonld:audit` wiring
- either include `workflows:check` in final release barrier or formally justify its exclusion

---

## SOD-2 — Partial route introduction defect (`/izbrannoe/`)
**Severity:** P1  
**Recommended status:** `confirmed-current`

### Definition
A production-visible route exists in source and navigation, but registry/search/migration/reference contracts are not fully reconciled.

### Why this matters
This is an unfinished implementation, not just a warning.

### Repair direction
- add migration-matrix entry
- decide search-manifest inclusion policy
- clear local reference warning

---

## SOD-3 — Guard/target architecture collision on Gill
**Severity:** P2  
**Recommended status:** `confirmed-current`

### Definition
Current anti-regression guard expectations are partially tied to an intermediate Gill architecture, while desired future convergence points toward a different v16-like structure.

### Why this matters
The next implementation agent can easily either:
- break guard while doing the right architectural move, or
- preserve guard by perpetuating legacy scaffolding.

### Repair direction
Update guard contract and architecture in one coordinated lane, not separately.

---

## SOD-4 — Ledger drift in canonical-looking documents
**Severity:** P2  
**Recommended status:** `confirmed-current`

### Definition
Current-head operational truth is fragmented across:
- old unified ledger
- project README summaries
- multiple reverify notes
- working docs

Several files look canonical while containing historical appendices interleaved with current truth.

### Why this matters
Weak agents may act on stale bug states as if they are current.

### Repair direction
- split archive/history from canonical-now ledger
- publish one current-head truth file

---

# 4. Proposed exact status classes for current verification use

## Use `stale-on-current-head` for
- broad “CI is broken” claims
- broad “premium controls are broadly broken” claims
- old total bug-count truth in 2026-06-25 docs

## Use `confirmed-current` for
- workflow-policy mismatch
- `dist:jsonld:audit` contract mismatch
- incomplete `/izbrannoe/` contract finishing
- Gill split-family convergence debt
- source-vs-built divergence as a repo risk class
- ledger fragmentation / canonical truth drift

## Use `half-fixed` for
- release hardening overall
- `/izbrannoe/` feature rollout
- floating-cluster / source-built parity class where source repairs landed but truth surfaces remain multi-layered

## Use `guard-drift` as a cross-cutting label for
- workflow barrier mismatch
- Gill owner-ui-guard vs target architecture tension

## Use `ledger-drift` as a cross-cutting label for
- unified ledger no longer being safe as present-only truth
- README/current-status summaries that lag current HEAD

---

# 5. Proposed repair-order update

## Phase A — canonical truth cleanup
1. Create one current-head canonical verifier ledger
2. Demote old unified ledger to historical baseline / archive role
3. Replace stale bug-count summaries in README-family docs with pointer to current-head ledger

## Phase B — workflow barrier integrity
1. Fix `dist:jsonld:audit` contract to satisfy workflow policy guard
2. Decide whether `workflows:check` must become part of final release barrier
3. Re-run both guards together and record parity

## Phase C — `/izbrannoe/` completion
1. route-migration-matrix entry
2. search-manifest decision + implementation
3. clear local reference warning

## Phase D — Gill convergence only with guard update
1. define final target shape
2. update owner-ui guard in same lane
3. then migrate family surfaces

---

# 6. Verifier conclusion

The correct current-head story is no longer:
- “the repo is broadly broken”, or
- “premium controls are still generally failing”.

The correct story is:

> **The repo has recovered much of the first-order breakage, but still carries a cluster of live second-order defects: one active workflow-policy mismatch, one unfinished route integration (`/izbrannoe/`), one unresolved Gill convergence problem, and one serious truth-fragmentation problem across verification artifacts.**

That is the canonical framing I recommend for all next repair and reverify work.
