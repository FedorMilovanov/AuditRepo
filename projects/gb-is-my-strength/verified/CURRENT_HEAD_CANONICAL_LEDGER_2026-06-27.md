# Current Head Canonical Ledger — gb-is-my-strength
**Date:** 2026-06-27  
**Source HEAD:** `49b83365606cec1e65060238cefea210439b882d`  
**Purpose:** current operational truth only. No historical append-only narrative, no old bug-count drift.

---

## A. STALE / retired broad narratives

### A1. “The repo is broadly broken / unstable”
**Status:** stale-on-current-head  
**Reason:** current HEAD passes full static publication barrier and core consistency checks.

### A2. “Premium controls are broadly broken across the project”
**Status:** stale-on-current-head  
**Reason:** broad first-order breakage has been significantly repaired; only targeted residual surfaces remain.

### A3. “Old 2026-06-25 aggregate bug counts are current operational truth”
**Status:** stale-on-current-head  
**Reason:** many subsequent commits and reverify passes invalidate naive reuse of those totals.

---

## B. CONFIRMED-CURRENT — live issues

### B1. Workflow-policy mismatch on current HEAD
**Severity:** P1  
**Type:** guard-drift / release-process defect

`npm run workflows:check` fails now, on current HEAD, while the broader release gate still passes.

**Canonical wording:** workflow policy guard and canonical release barrier are not fully aligned.

---

### B2. `dist:jsonld:audit` contract mismatch
**Severity:** P1  
**Type:** CI/policy contract defect

Current script wiring does not satisfy `check-workflows.js` expectation for auditing dist-root JSON-LD.

---

### B3. `/izbrannoe/` partial route integration
**Severity:** P1  
**Type:** unfinished implementation / contract debt

The route exists in source and UI, but remains incompletely reconciled across metadata/search/reference layers.

Current warning surfaces include:
- no route-migration-matrix entry
- no search-manifest entry warning
- local reference warning from `audit-pro`

Interpretation on current HEAD: the matrix gap is real contract debt; the search-manifest and local-reference warnings are more likely guard/checker drift than proof of a broken user-facing page.

---

### B4. Gill split-family architecture remains live
**Severity:** P1/P2 boundary  
**Type:** architectural convergence debt

Gill pages still span more than one UI family / premium-control structure. This is live architecture debt, not just cosmetic drift.

---

### B5. Source-vs-built divergence remains an active repo risk class
**Severity:** P2  
**Type:** publication truth risk

Because the repo mixes source components and committed built/static HTML, source-side fixes must not be treated as publication truth without evidence at the correct layer.

---

### B6. Canonical-truth fragmentation across docs
**Severity:** P2  
**Type:** ledger-drift / verifier-truth defect

Current-head truth is fragmented across old ledgers, README summaries, reverify notes, working docs, and phase-roadmap files that still describe already-landed PremiumControls work as open. Weak-agent misuse risk is real.

---


### B7. PremiumControls roadmap/documentation lag
**Severity:** P2  
**Type:** documentation drift / planning defect

`AuditRepo/projects/gb-is-my-strength/PremiumControls/ROADMAP.md` and `patches/APPLIED-2026-06-26.md` were written against the PR #19 baseline and now lag current source HEAD. Multiple items formerly listed as open are source-landed now (anchor, heart-series wiring, rollout audit script, controller semantics progress), but the docs had not been updated accordingly.


### B8. `/izbrannoe/` native taxonomy mismatch
**Severity:** P2  
**Type:** contract-model drift

`native:runtime:audit:strict` currently classifies `/izbrannoe/` as `native-with-legacy-head`, while the route is otherwise treated operationally as an Astro-owned personal/noindex production page. This is not currently a release blocker, but it means `/izbrannoe/` still sits in an intermediate contract state even beyond the missing migration-matrix entry.

## C. HALF-FIXED — recovery landed, but not fully closed

### C1. Release hardening overall
**Status:** half-fixed

The repo has strong gates and major recovery work landed, but some specialized protection layers are still not part of the single final truth barrier.

### C2. `/izbrannoe/` rollout
**Status:** half-fixed

User-facing/source rollout is done; contract-level completion is not.

### C3. Floating-cluster / source-built parity class
**Status:** half-fixed

Many repairs landed, but this class still requires layer-specific verification and cannot be assumed closed by source inspection alone.

---

## D. CROSS-CUTTING LABELS

### guard-drift
Use this label for:
- workflow-policy mismatch
- Gill owner-ui-guard vs target architecture tension

### ledger-drift
Use this label for:
- old unified ledger no longer being safe as present-only truth
- stale summary counts in human-facing docs

---

## E. Immediate repair priorities

1. **Fix workflow-policy parity**
   - repair `dist:jsonld:audit`
   - decide whether `workflows:check` joins the final release barrier

2. **Finish `/izbrannoe/` integration**
   - migration matrix
   - search-manifest decision
   - local reference cleanup

3. **Prepare Gill convergence safely**
   - align guard contract with target architecture before further migration

4. **Publish one canonical current-head verifier truth**
   - this file can be that starting point
   - archive older aggregate-count truth as historical, not operational

---

## F. Canonical one-paragraph summary

**Current HEAD is no longer defined by first-order breakage. Its live problems are second-order: a real workflow-policy mismatch, an unfinished `/izbrannoe/` rollout, unresolved Gill architectural split, ongoing source-vs-built publication risk, and fragmented canonical truth across verification documents.**
