# Workflow Parity Deep Dive — current-head root cause and minimal repair path
**Project:** gb-is-my-strength  
**Date:** 2026-06-27  
**Source HEAD audited:** `49b83365606cec1e65060238cefea210439b882d`  
**Type:** verifier / system-policy deep dive

---

## Executive diagnosis

Current HEAD has a **real workflow-policy inconsistency**, but the inconsistency is narrower and more subtle than “CI broken”.

### What is happening
- `npm run validate:static-publication` passes.
- `npm run workflows:check` fails.
- The concrete failing check is:
  - `package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact`

### Root cause in one sentence
> The implementation script `dist:jsonld:audit` is functionally correct by default, but the **policy guard requires explicit `--root dist` invocation** and the package script was left in a looser form, creating a guard-level mismatch rather than a runtime failure.

---

## Exact evidence

### 1. Current package script
`package.json`
```json
"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js"
```

### 2. Current guard expectation
`scripts/check-workflows.js`
```js
mustScript(scripts, 'dist:jsonld:audit', /dist-jsonld-audit\.js[^\n]*--root\s+dist/, 'must audit JSON-LD in dist artifact');
```

### 3. Script behavior itself
`scripts/dist-jsonld-audit.js` supports:
```text
node scripts/dist-jsonld-audit.js [--root dist]
```
and defaults to:
```js
const rootArg = process.argv.includes('--root')
  ? process.argv[process.argv.indexOf('--root') + 1]
  : 'dist';
```

So **behaviorally** it already audits `dist/` by default.

### 4. Deploy workflow usage
`.github/workflows/deploy.yml` runs:
```yaml
- name: Dist JSON-LD parse audit
  run: npm run dist:jsonld:audit
```

There is also a second, duplicated inline JSON-LD parse step later in the same workflow.

---

## Root-cause analysis

## RC-1 — This is not a runtime bug; it is a policy-expression mismatch
The actual script already defaults to `dist`. Therefore production behavior is probably correct.

The failing condition exists because the guard wants **explicitness**:
- the package script should say `--root dist`
- not merely rely on default script behavior

This is a valid policy preference, but it means the defect is at the level of:
- contract clarity,
- future-proofing,
- drift resistance,
not current JSON-LD parsing capability.

---

## RC-2 — The project has duplicate enforcement for the same deploy concern
`deploy.yml` contains **two JSON-LD parse audit surfaces**:
1. `npm run dist:jsonld:audit`
2. a later inline `node -e` loop that parses all JSON-LD blocks again

This duplication matters because it indicates a broader pattern:
- hardening was added incrementally,
- but not always normalized back into one canonical implementation path.

That increases drift risk:
- one step can evolve,
- the other can lag,
- the guard may validate one surface while actual deploy behavior relies on another.

---

## RC-3 — `workflows:check` is currently outside the strongest operational truth path
Even though `ci:check` includes `workflows:check`, the more visible repo health signal here was `validate:static-publication`, which passed.

So the repo currently allows the human impression:
- “full gate green → system aligned”

when in fact:
- “full publication gate green, but workflow-policy contract still red”

This is a classic second-order control-plane defect.

---

## Severity assessment

## Recommended severity: P1
Why not P0:
- deploy behavior is not shown broken
- script functionality itself is not broken

Why not only P2:
- this is a live contradiction in the repo’s own safety model
- it weakens trust in green release signals
- the project has prior history of deploy/workflow regressions, so policy drift here is materially risky

---

## Minimal repair path (safest)

### Option A — smallest, cleanest fix
Change package script from:
```json
"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js"
```
to:
```json
"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js --root dist"
```

### Current verification status in this pass
Verified directly against current source HEAD:
- `package.json` still has the looser form: `node scripts/dist-jsonld-audit.js`
- `scripts/check-workflows.js` still requires the explicit form: `--root dist`
- `npm run workflows:check` is still red for exactly this reason
- `validate:static-publication` and `ci:check` therefore represent different barrier strictness levels

### Why this is best
- zero functional ambiguity
- satisfies `workflows:check`
- documents intent directly in package contract
- no deploy workflow rewrite required

---

## Recommended follow-up cleanup (not strictly required for parity)

### Option B — remove duplicated JSON-LD parse logic in deploy workflow
After Option A is in place and trusted, consider removing the later inline JSON-LD parse block in `deploy.yml` and keep only:
```yaml
- name: Dist JSON-LD parse audit
  run: npm run dist:jsonld:audit
```

### Why
One canonical mechanism is better than two partially overlapping ones.

### Caution
Do this only if the remaining guard logic still proves all required behavior. The duplicated step may have been intentionally added as a belt-and-suspenders response to an earlier incident.

---

## Should `workflows:check` join `validate:static-publication`?

## My verifier answer: probably yes, but only if you accept the philosophy shift

### Argument for YES
Right now a strong-looking green publication gate can coexist with a red workflow-policy truth. That is misleading.

Adding `npm run workflows:check` to `validate:static-publication` would mean:
- the final barrier represents a truer system state,
- workflow-policy drift cannot hide behind green content/build gates.

### Argument for caution
`validate:static-publication` is already large and content-focused.  
If you want to keep workflow policy as a separate class of governance gate, that can also be valid — **but then the docs must say so explicitly**.

### Verifier recommendation
Either:
1. add `workflows:check` into the final barrier, **or**
2. explicitly document that `validate:static-publication` is not the complete system-policy barrier and that `ci:check` is the stronger release truth.

Current repo state does neither clearly enough.

---

## Suggested canonical wording for the ledger

**Workflow-policy parity defect:** current HEAD has no proven deploy failure here, but the package/workflow contract is not fully aligned. `dist:jsonld:audit` relies on default `dist` behavior while `check-workflows.js` requires explicit `--root dist`, leaving `workflows:check` red despite a green publication gate.

---

## Recommended verifier status
- **Status:** `confirmed-current`
- **Category:** `guard-drift`
- **Severity:** `P1`
- **Repair lane:** `system / workflow-parity`

---

## Short implementation note for a weak agent

If asked to fix this, do **only** the minimal parity change first:
1. edit `package.json`
2. set `dist:jsonld:audit` to `node scripts/dist-jsonld-audit.js --root dist`
3. run:
   ```bash
   npm run workflows:check
   npm run validate:static-publication
   ```
4. if both are green, stop
5. do **not** deduplicate deploy.yml JSON-LD steps in the same patch unless explicitly asked

That keeps the repair surgical and low-risk.


## Minimal repair recommendation (current position)

### Do now
1. Change `package.json` script:
   - from: `node scripts/dist-jsonld-audit.js`
   - to: `node scripts/dist-jsonld-audit.js --root dist`
2. Re-run `npm run workflows:check`
3. Only after parity is green, decide whether `workflows:check` should also join the strongest publication barrier

### Do not do in the same first patch
- do not rewrite deploy workflow structure
- do not deduplicate the second JSON-LD parse path in `deploy.yml` yet
- do not mix this parity fix with broader CI philosophy changes

This keeps the first repair strictly surgical and easily reversible.


## Additional current-head nuance

A fresh read of `.github/workflows/deploy.yml` shows the repo currently has **two** dist JSON-LD parse audit steps and **two** dist contract-compare surfaces in the deploy workflow. This duplication is not the primary failing defect today, but it confirms that the workflow layer was hardened incrementally and still carries normalization debt even after the deploy-unblock push.
