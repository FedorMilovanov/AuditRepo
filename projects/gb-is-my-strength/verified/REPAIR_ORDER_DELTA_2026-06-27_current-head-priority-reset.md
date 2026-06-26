# Repair Order Delta — 2026-06-27 current-head priority reset
**Project:** gb-is-my-strength  
**Source HEAD:** `49b83365606cec1e65060238cefea210439b882d`  
**Purpose:** replace stale priority instincts inherited from older ledgers with a current-head repair order.

---

## Why this delta exists

Older repair thinking was shaped by first-order failures:
- global premium-controls breakage
- broken CI/deploy surfaces
- broad cache-bust / runtime crises

Current HEAD is no longer in that state.  
Therefore the repair order must change.

> The next valuable work is no longer “rescue the project from collapse”.
> It is “close the remaining second-order defects that can quietly reintroduce regressions or mislead future agents”.

---

# New priority order (current-head)

## P0 of process, not of UI — establish one current truth
### DELTA-1 — Canonical truth cleanup
**Priority:** Highest  
**Type:** verification / documentation / control-plane integrity

### Why first
If this is not done, weak agents will continue acting on stale counts and mixed historical/current ledgers.

### Scope
- adopt `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` as primary current-head truth
- demote old aggregate-count narratives to historical role
- update README/status docs to point at the canonical ledger

### Value
Prevents incorrect repair selection before any code is touched.

---

## P1 — Fix workflow-policy parity before more feature work
### DELTA-2 — Workflow barrier integrity
**Priority:** Very high  
**Type:** system / CI / guard alignment

### Current live issue
- `npm run workflows:check` is red
- `validate:static-publication` is green

### Why ahead of UI work
A red policy guard outside the canonical barrier is how future regressions sneak back in while the repo appears healthy.

### Scope
1. fix `dist:jsonld:audit` script to satisfy policy expectation
2. decide whether `workflows:check` must join `validate:static-publication`
3. document the decision explicitly if not integrated

### Success condition
No contradiction between workflow-policy truth and release-barrier truth.

---

## P2 — Finish `/izbrannoe/` completely or mark policy explicitly
### DELTA-3 — Route contract completion for `/izbrannoe/`
**Priority:** High  
**Type:** unfinished feature rollout

### Why now
This is fresh debt, small enough to close quickly, and a good example of source/UI leading contracts.

### Scope
1. add route to `route-migration-matrix.json` if intended production route
2. decide whether route belongs in `search-manifest.json`
3. clear `audit-pro` local-reference warning
4. if intentional exclusions remain, encode them as policy, not accidental warning residue

### Success condition
No unresolved contract warnings for a route already visible in source/UI.

---

## P3 — Prepare Gill convergence safely, do not freestyle it
### DELTA-4 — Gill guard/architecture preflight
**Priority:** High  
**Type:** architectural convergence control

### Why not later
Gill is now less about a visible crash and more about a dangerous migration trap:
- current family split is real
- target v16-like convergence is desired
- current owner-ui guard may still anchor to intermediate architecture

### Scope
1. inventory exactly what `owner-ui-regression-guard.js` requires for Gill
2. inventory what the intended target architecture removes/renames
3. decide whether to preserve `gbs2-*` aliases or retire them formally
4. only then greenlight the next UI lane

### Success condition
No implementation lane is forced to choose between “correct architecture” and “passing stale guard”.

---

## P4 — Keep source-vs-built risk visible in every future UI lane
### DELTA-5 — Evidence-layer discipline
**Priority:** Medium-high  
**Type:** verifier process / build-truth discipline

### Why
This repo’s hybrid publication model means a source fix can still be a publication lie.

### Scope
For every future route/UI verification note, explicitly label evidence:
- source
- committed built HTML
- production-like dist
- browser witness

### Success condition
No future “fixed” claim is accepted without evidence-layer clarity.

---

# Old priorities that should be demoted now

## DEMOTE-1 — broad premium-controls rescue work
**Old place:** top urgency  
**New place:** only route-specific residuals

### Reason
Current HEAD no longer supports global-breakage framing.

---

## DEMOTE-2 — generic “CI collapse” repair framing
**Old place:** top urgency  
**New place:** narrow workflow-policy parity work

### Reason
The active problem is not collapse, but mismatch between specialized guard and canonical barrier.

---

## DEMOTE-3 — stale total-bug counting as planning tool
**Old place:** canonical planning input  
**New place:** historical context only

### Reason
Current repair selection must be based on live categories, not inherited totals.

---

# Suggested implementation sequence

## Sequence A — control plane first
1. canonical truth cleanup
2. workflow barrier integrity
3. `/izbrannoe/` completion
4. Gill guard/architecture preflight
5. later route/UI surgery

## Sequence B — if owner wants one quick code win first
1. `/izbrannoe/` completion
2. workflow barrier integrity
3. canonical truth cleanup in docs
4. Gill preflight

### Recommended
**Sequence A** is safer for multi-agent work.  
It reduces the chance of another wave of agents reading stale documents and solving yesterday’s problems.

---

# One-paragraph current repair doctrine

**As of 2026-06-27, the smartest repair order is to fix the control plane before chasing more UI surgery: establish one canonical current-head truth, remove the workflow-policy mismatch, complete the half-shipped `/izbrannoe/` route contracts, and only then proceed with Gill convergence under an updated guard contract.**
