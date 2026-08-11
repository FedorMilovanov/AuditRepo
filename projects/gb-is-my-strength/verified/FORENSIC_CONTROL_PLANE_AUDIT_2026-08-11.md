# FORENSIC CONTROL-PLANE AUDIT — gb-is-my-strength

Date: **2026-08-11**  
Status: **durable forensic evidence / governance aid**  
Observed Product anchor: `998cd60759c535af0f542c31d5fc8e2948440c02`  
Observed AuditRepo anchor before this write: `a59bf1a9833e9043610bc7860ae584ddef5fdb78`

> This is **not a Product backlog, not a new audit wave, and not a synchronization contract**. Historical evidence remains historical until current-checked. Active work belongs only in `MASTER_BUG_MATRIX.md`.

## 1. Core diagnosis

A recurring work-amplifier was the missing admission boundary between **“a signal is red”** and **“a current Product defect exists.”**

```text
red signal
→ assumed Product defect
→ issue/agent/branch/PR
→ more proof/control-plane state
→ another red
→ another assumed Product defect
```

The stronger fail-closed model is:

```text
SIGNAL
→ bind exact SHA
→ classify witness
→ prove applicability
→ attribute mechanism
→ admit/reject Product work
→ only admitted Product work gets one mutation owner
```

This does not weaken CI. A red invariant can still block release; **attribution decides what work follows**.

## 2. Signal classes

| Class | Meaning | Product mutation? |
|---|---|---|
| `PRODUCT` | current Product mechanism violates required invariant | yes, after admission |
| `HARNESS` | proof cannot truthfully exercise/observe/interpret invariant | no automatic Product mutation |
| `CONTROL-PLANE` | workflow/notifier/writer/orchestration/lifecycle is mechanism | repair that owner, not Product feature by default |
| `ENVIRONMENT` | runner/network/tool/external service is mechanism | no automatic Product mutation |
| `HISTORICAL-WITNESS` | old-anchor/stale/absorbed/superseded claim | no |

A workflow name, `bug` label or CI lifecycle issue is evidence about a **signal**, not sufficient root-cause attribution.

### Current witness: issue #474

At `main@998cd607…`, #474 reports `Deploy to GitHub Pages` run `31513310584`, attempt 2, failed job `Build and validate immutable release candidate`, step 27 **Gill mobile reference layout audit**.

That proves a release-assurance failure on an exact SHA. It does **not yet prove** that current Gill Product code is defective or that #1652 caused Gill regression. Until the failed assertion/mechanism is attributed, classify it **ASSURANCE / UNADMITTED**.

## 3. Proof states

Every proof cell is exactly one of:

- `PASS` — intended invariant was actually exercised and true;
- `FAIL` — exercised and false;
- `UNPROVEN` — harness could not perform a sufficient proof;
- `N/A` — applicability was explicitly disproven.

**`UNPROVEN` MUST NOT increment PASS.**

Canonical witness: `69b1fad83e7d1a008fd9155d3bad3545ebd0ac1f`. The old Gill audit printed OK when scrollspy was “not exercisable headlessly”, producing **35 route×viewport bypass greens** while live scrollspy was dead on Gill v16 routes. The repair made non-exercisable local state WARN, CI fatal under `GILL_SUBMENU_REQUIRE_LIVE=1`, then completed `1701/1701` live assertions.

## 4. Product-work admission gate

A signal becomes active Product work only after:

1. **Exact identity** — exact Product SHA/artifact/workflow is known.
2. **Applicability** — route/state/invariant really applies; dynamic state is seeded where relevant.
3. **Witness integrity** — source/artifact/browser/lifecycle witness is capable of proving the claim.
4. **Mechanism attribution** — failure is located in Product, harness, control-plane, environment or stale history.
5. **Repair ownership** — only a confirmed current Product mechanism receives one bounded semantic owner.

Outcomes:

```text
CONFIRMED PRODUCT MECHANISM → admitted Product work
HARNESS / CONTROL-PLANE / ENVIRONMENT → repair that owner if necessary
STALE / FIXED / ABSORBED / DUPLICATE / INVALID → disposition → STOP
INSUFFICIENT EVIDENCE → UNPROVEN / UNADMITTED → no Product mutation
```

## 5. Same-tree contradiction protocol

If the same Product tree passes one proof and fails another without a relevant Product change, classify **PROOF SUSPECT first**.

Compare:

```text
run
→ exact Product SHA
→ workflow definition at that SHA
→ event/dispatch
→ inputs/flags
→ runner/browser/tool versions
→ generated artifacts
→ exact assertion
```

Do not “rerun until green”; explain the contradiction.

## 6. Preservation contract

Every non-trivial mutation needs two explicit statements:

```text
POSITIVE INVARIANT — what must become true?
PRESERVATION BOUNDARY — what must remain semantically unchanged?
```

This closes a repeated hole: agents proved the requested target but not what they accidentally destroyed outside it.

## 7. Historical wrong turns

### A. Brace balance mistaken for CSS semantics

`0d5586e2d0d19ebceeb75b52920b85ba388615eb` closed **151** open blocks, reached net brace=0 and added a brace guard. Repair `a1c6d0076c044b789b62738f0c04ed23db4e0acf` records that braces were closed in wrong positions: `site.css` produced about **19 parsable rules instead of 1222**, with sitewide styling damage.

**Rule:** surrogate structural metric is a guard, not the semantic oracle. CSS structural edits need parser + browser proof.

### B. Regex migration proved target and violated preservation

`6f21bdcdabdeaeb33e2072fa70dec263ca64335f` proved `grep fc- = 0`, preserved selected `data-*`, and called the migration `zero risk`. Repair `a335aaa605181c697a00282310f22ef7e2d8b5c0` records regex-stripped class attributes from **1580+ elements**, breaking five Gill pages.

**Rule:** mass edit must prove target mutation **and semantic preservation outside the mutation set**.

### C. Visual truth became universal authority

`4f940b34ed15c0155a91448494351cafee5f7794` full-shadow-wrapped all production Astro pages and described 0% pixel diff as guaranteed “by construction”. `23bd2c722da5ce56aba167a85fd8670d1d6ebee3` then restored native route ownership, `GenealogyTree`, Pagefind projection, app assets and deploy contracts.

**Rule:** reference authority is dimension-scoped: visual/runtime/content/metadata/search/data are separate contracts.

### D. Parallel work collided semantically

`84cd7da0354fb5515a532c16ca72d2f1a44381c0` records four regressions after parallel push: fixed positioning, footnote hit targets after `all:unset`, tooltip close lifecycle, and detached floating-tip pointer lifecycle.

**Rule:** file allowlists are necessary but insufficient. SYSTEM work declares a **semantic ownership domain**: e.g. overlay lifecycle, global scroll lock, Search activation, reader chrome, TTS, SW lifecycle, generated projection.

### E. Harness inability became false green

`69b1fad83e7d1a008fd9155d3bad3545ebd0ac1f` is the canonical witness.

**Rule:** `UNPROVEN != PASS`.

### F. Guard fossilized implementation detail

Historical examples include obsolete mobile-bar smoke, holding-page markers after a route became live, Search exact-title assumptions where title+snippet was the semantic contract, and Reader locators tied to an old parent after runtime reparenting.

Classify guards:

- `BEHAVIORAL INVARIANT`;
- `STRUCTURAL INVARIANT`;
- `IMMUTABLE IDENTITY`;
- `HEURISTIC / DEBT METRIC`.

A heuristic must not silently become an immutable identity rule.

### G. Currentness materialized into transport work

Good requirement: final candidate must be tested against current `main`. Wrong operationalization: `main moves → refresh/successor → transport-only PR → CI → main moves → repeat`.

**Rule:** derive current integration truth from authoritative refs/merge-base/candidate. Do not create a PR solely to synchronize ancestry.

### H. Temporary terminal machinery still created control-plane cost

PR #1598, `chore(terminal): final frozen-scope proof and cleanup`, merged as `498595b2144d32ce13578dc184a61b635159a0af` with **16 commits / 16 changed files**. Its own body describes a temporary terminal proof workflow capable of materializing witness/cache-bust state before a second exact-head proof.

**Rule:** temporary machinery must justify **creation**, not only deletion. One-off normal edits use existing owners; recurring derivative mutation may justify one governed permanent writer.

### I. Fail-fast serial masking

`A && B && C` hides B/C when A fails. Fixing A later makes old B/C look newly created.

**Rule:** for independent checks in one bounded phase, execute all, collect complete failure census, fail the phase if any fail. Keep fail-closed; improve observability.

### J. Full Zero became eligible to outlive its migration epoch

AuditRepo `e56f5a93b3ee4521f343ca86593d7cd2c4361ab3` created a coherent one-time Full-Zero closure model and snapshotted **123 Product remote branches**. Useful for cemetery/convergence cleanup; dangerous as permanent steady-state governance.

**Rule:** **zero applies to the selected/current-reverified workset, not eternal repository stillness.** Raw branch/issue counts do not prove required Product work.

### K. New policy existed while old terminal ritual survived

Current `AUDITREPO_OPERATING_MODEL.md` correctly says AuditRepo is not a Product mirror and MASTER is current actionable work only. The pre-update MASTER still retained Search V14 after merge #1637 and `FINAL-ZERO-AUDIT` as a permanent system lane.

**Rule — policy migration completeness:** writing new policy is incomplete until superseded operational instructions are retired from the active SSOT.

## 8. Semantic ownership declaration

For SYSTEM work record both:

```text
Allowed files: ...
Semantic owner: ...
Must preserve: ...
```

Collision check is not only “same file?” but also “same generated derivative?”, “same semantic owner?”, “same global lifecycle?”.

## 9. Writer necessity gate

A new writer requires answers to all:

1. Why can read-only verification not solve this?
2. Why can the existing canonical writer not own it?
3. Why is mutation recurring enough to merit automation?
4. What source→derivative contract does it implement?
5. What is least privilege?
6. How are lease/CAS/stale-head refusal enforced where applicable?
7. What proves idempotence and bounded scope?

**Safety proof + necessity proof** are both required. Self-deleting is not sufficient justification.

## 10. CI topology

Keep strict blocking, but separate:

- candidate-local proof;
- integration/release proof;
- historical/diagnostic proof.

Rules:

- independent candidate checks should not be masked by unrelated serial failures;
- release blockers need explicit applicability and ownership;
- unrelated red requires attribution, not scope expansion;
- notifier reports verified failed jobs/steps, not guessed root cause;
- deterministic release blockers should, when feasible, have exact-candidate pre-merge proof.

## 11. Closure is read-only

Closure answers whether the selected workset is terminal. It does not mutate Product until green.

If closure discovers a repair:

```text
closure stops
→ signal re-enters admission
→ admitted repair gets normal bounded owner
→ closure may be rerun after repair
```

Do not create a self-authorizing “closure writer”.

## 12. STOP protocol

When the **admitted current Product workset is empty**:

```text
NO CURRENT ACTION REQUIRED
→ STOP
```

STOP means no new discovery wave merely to continue activity, no successor-by-default, no transport PR, no extra guard merely to produce work, no global AuditRepo synchronization, no branch-count backlog, no perpetual Full-Zero ritual.

A genuinely new future signal can enter admission normally.

## 13. Current disposition at this anchor

Observed Product truth:

- `main = 998cd60759c535af0f542c31d5fc8e2948440c02`;
- open Product PRs: **0**;
- Search #1637 merged as `d18ce559e166837380550c5cfd91db5687a3628f`;
- dependency-security #1652 merged as current main `998cd607…`;
- #474 remains an open automated CI lifecycle signal for Gill mobile reference layout audit on that exact main SHA.

AuditRepo admission snapshot:

```text
admitted current Product implementation roots: 0
open assurance incidents requiring attribution: 1 (#474)
```

This does not declare #474 harmless. It prevents a notifier from becoming automatic Product mutation authority before mechanism evidence exists.

## 14. Final invariant

```text
Deep evidence
→ exact attribution
→ minimal admitted work
→ one semantic owner
→ positive invariant + preservation boundary
→ independent proof
→ read-only closure
→ NO CURRENT ACTION REQUIRED
→ STOP
```

The protections remain strong. What is removed is accidental work generation from stale snapshots, unclassified red, moved ancestry, raw branch counts and terminal machinery that starts behaving like implementation.
