# Status Matrix — gb-is-my-strength — current-head verifier grade
**Date:** 2026-06-27  
**Source HEAD audited:** `49b83365606cec1e65060238cefea210439b882d`  
**Purpose:** separate live truth from historical truth; classify by *current operational reality*, not by legacy ledger inertia.

Legend:
- **FIXED** — no longer an active issue on current HEAD within the evidence layer checked
- **STALE** — historical finding no longer safely applicable as written
- **HALF-FIXED** — some repair landed, but contract/integration/root cause not fully closed
- **SOURCE-ONLY-FIXED** — source looks corrected, but built/deploy/guard truth still not closed
- **GUARD-DRIFT** — main problem is now mismatch between implementation and anti-regression/policy guard
- **LEDGER-DRIFT** — main problem is mismatch between current head and canonical-looking audit docs
- **CONFIRMED-CURRENT** — still a real active issue on current HEAD

---

## 1. System / Truth surfaces

| Theme | Current status | Why |
|---|---|---|
| Full publication gate health | **FIXED / GREEN** | `validate:static-publication` passes on current HEAD |
| Workflow policy consistency | **GUARD-DRIFT** | `npm run workflows:check` is red while full publication gate is green |
| Canonical bug truth in docs | **LEDGER-DRIFT** | unified ledger and README-family docs mix old and current truths |
| Source vs built artifact truth | **HALF-FIXED** | many earlier issues were repaired, but the repo structure still permits source/build divergence; current reverify docs still flag this class as live |
| Shared release safety model | **HALF-FIXED** | many guards exist, but not all are wired into the final barrier |

---

## 2. Routes / feature rollout integrity

| Item | Current status | Why |
|---|---|---|
| `/izbrannoe/` route existence | **FIXED** | route exists in source and is linked in UI |
| `/izbrannoe/` metadata contract completion | **HALF-FIXED** | missing entry in `route-migration-matrix.json`; route also still classifies as `native-with-legacy-head` in runtime taxonomy |
| `/izbrannoe/` search/discoverability truth | **HALF-FIXED / GUARD-DRIFT** | route is production-visible, but the route profile explicitly says personal/noindex/excluded; current strict content-source checks still warn because the checker is not route-profile-aware |
| Root/home/local reference completeness for `/izbrannoe/` | **GUARD-DRIFT** | `audit-pro` still warns `Missing local reference: index.html → /izbrannoe/`, but this is a legacy-root checker blind spot for an Astro-owned route |

---

## 3. Gill family

| Item | Current status | Why |
|---|---|---|
| Gill family visual/runtime convergence | **CONFIRMED-CURRENT** | context page and parts still ship different UI families |
| Gill “two worlds” problem (`gbs-rail-foot` vs `gbs2-*`) | **CONFIRMED-CURRENT** | built HTML confirms split architecture |
| Gill future migration safety | **GUARD-DRIFT** | target v16 convergence is in tension with current owner-ui guard expectations |
| Gill as operational premium surface | **HALF-FIXED** | many premium-control regressions were fixed historically, but family-wide architecture is still not unified |

---

## 4. Hermeneutics / floating-cluster / built-sync class

| Item | Current status | Why |
|---|---|---|
| Earlier raw premium-control breakage class | **mostly FIXED** | broad premium control recovery landed across recent commits and green gates |
| Hermeneutics source-vs-built desync class | **SOURCE-ONLY-FIXED / HALF-FIXED** | per reverify docs, source-side intent may be repaired while built/static truth remains potentially stale; structural risk remains alive |
| Floating-cluster reference fidelity as a whole | **HALF-FIXED** | many fixes landed, but 2026-06-27 reverify docs still document unresolved convergence surfaces |

---

## 5. CI / workflow / release process

| Item | Current status | Why |
|---|---|---|
| Deploy workflow gross breakage from earlier phases | **FIXED** | current repo passes full static publication gate and recent CI repair commits are present |
| Workflow-policy contract parity | **CONFIRMED-CURRENT** | `workflows:check` fails now, on current HEAD |
| `dist:jsonld:audit` contract | **CONFIRMED-CURRENT** | script wiring does not satisfy workflow guard expectation for dist-root audit |
| Final release barrier completeness | **HALF-FIXED** | `validate:static-publication` is strong but still not the complete system-policy barrier |

---

## 6. Audit / verification / documentation layer

| Item | Current status | Why |
|---|---|---|
| AuditRepo process quality | **FIXED / STRONG** | rules and verification ladder are coherent; project folder is rich and structured |
| Operational current-head readability | **LEDGER-DRIFT** | too many historical amendments are mixed into files that look canonical |
| Unified bug counts in old docs | **STALE** | older totals are not safe current truth after many subsequent commits |
| Historical evidence preservation | **FIXED** | forensic history is preserved well |
| Separation of archive vs canonical-now truth | **HALF-FIXED** | preserved, but not cleanly enough for weak-agent consumption |

---

## 7. Exact current live problems I would treat as highest-value

### A. Live now, actionable now
1. **`workflows:check` red on HEAD** → active system-policy bug
2. **`dist:jsonld:audit` contract mismatch** → active release-process inconsistency
3. **`/izbrannoe/` incomplete cross-contract integration** → active unfinished implementation
4. **Gill split-family architecture** → active convergence debt
5. **owner-ui-guard vs future Gill target tension** → active future-regression trap

### B. Live now as management/truth problems
6. **Unified ledger mixes current truth with append-only history**
7. **README/ledger/current-reverify truth not fully collapsed into one current canonical operational view**
8. **Full gate green can coexist with red specialized guard**

### C. Still requires careful treatment
9. **source-vs-built divergence class** in this hybrid repo should be considered active structural risk until stronger end-to-end invariant enforcement exists
10. **feature rollout before contract completion** is still happening (`/izbrannoe/` as fresh proof)

---

## 8. Recommended interpretation for a strong verifier

### Treat as CLOSED enough
- generic “repo is broken / quality gates broken” claims
- generic “premium controls globally broken” claims
- generic “CI is fundamentally dead” claims

### Treat as STILL LIVE
- workflow-policy mismatch
- incomplete route registration/completion around new route surfaces
- Gill convergence debt
- truth-fragmentation across ledgers/docs

### Treat as DANGEROUSLY MISLEADING if left unclarified
- old aggregate bug counts in project docs
- any statement that current full gate green means all system contracts are aligned
- any assumption that source fix automatically means built/publication truth fix

---

## 9. One-sentence diagnosis

**Current HEAD is substantially healthier than the old ledgers suggest, but the repo still carries live second-order defects: policy guard drift, incomplete route-contract finishing, Gill architectural split, and canonical-truth fragmentation across verification artifacts.**
