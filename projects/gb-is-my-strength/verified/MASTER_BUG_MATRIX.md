# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

## Live verification stamp — 2026-08-11

| Field | Observed current value |
|---|---|
| Product `main` | `998cd60759c535af0f542c31d5fc8e2948440c02` |
| Product open PRs | **0** |
| Admitted current Product defects | **0** |
| Active Product implementation lanes represented here | **0** |
| Active SYSTEM repair lanes represented here | **0** |
| Owner decisions blocking admitted Product work | **0** |
| Unadmitted assurance signals tracked below | **1** — Product #474 |

This stamp is evidence for this consolidation only. It is **not** a promise that AuditRepo will mirror every later Product move.

## ACTIVE CURRENT WORK — 0

There is currently **no admitted Product defect or SYSTEM repair root** in MASTER.

```text
Product implementation queue = 0
```

No branch, successor, transport PR, writer, terminal verifier or new Product issue is authorized by this empty matrix.

## UNADMITTED ASSURANCE SIGNALS — NOT PRODUCT WORK

| Signal | Class | Exact current evidence | Admission status | Allowed next action |
|---|---|---|---|---|
| Product #474 — `Deploy to GitHub Pages` | `ASSURANCE / CI` | run `31513310584`, attempt 2, exact SHA `998cd60759c535af0f542c31d5fc8e2948440c02`; failed job `Build and validate immutable release candidate`; step 27 `Gill mobile reference layout audit` | `UNADMITTED` — failed proof step is known, current Product mechanism is **not yet established by the lifecycle issue itself** | If this signal must be handled, perform bounded attribution: exact assertion → workflow definition at SHA → inputs/environment/artifact/reference → PRODUCT vs HARNESS vs CONTROL-PLANE vs ENVIRONMENT. **Do not create Product mutation work before admission.** |

The GitHub lifecycle issue may carry a `bug`/`ci-failure` label and still remain unadmitted in this matrix. The notifier is a signal owner, not automatic Product root-cause authority.

## RECENTLY RETIRED FROM ACTIVE MASTER

These are recorded here only to explain the consolidation; they are **not active rows**.

### `V14-SEARCH-SCOPE-TAB-SEMANTICS` — CLOSED / REMOVED

Product PR #1637 merged as `d18ce559e166837380550c5cfd91db5687a3628f`.

The merged transaction repaired the previously active Search root by:

- replacing misleading tab semantics with truthful native pressed scope controls;
- integrating Search into shared `OverlayRuntime` ownership;
- preserving cold bootstrap/result navigation;
- retaining permanent Chromium/WebKit proof.

The old MASTER statement that Search was the sole direct current Product defect is therefore stale and is retired.

### Dependency-security #1652 — MERGED / REMOVED

Current Product main is merge `998cd60759c535af0f542c31d5fc8e2948440c02`, `security(deps): eliminate current npm advisories (#1652)`.

A merged security transaction does not remain in MASTER merely to preserve history.

### `FINAL-ZERO-AUDIT` — RETIRED AS A PERMANENT SYSTEM ROOT

The historical Full-Zero convergence model was useful during the one-time branch/issue/cemetery cleanup epoch. It is **not a standing SYSTEM lane** after the AuditRepo operating model moved to current actionable work only.

Do not recreate this row merely because:

- Product `main` advanced;
- AuditRepo snapshots are old;
- branch count changed;
- a CI lifecycle issue opened;
- a closed historical issue still exists in Git history;
- MASTER has zero admitted rows.

Global repository stillness is not the normal terminal invariant.

## ADMISSION GATE

A new signal enters active MASTER only after all required boundaries are proven:

1. **Exact identity** — current Product SHA/artifact/workflow is known.
2. **Applicability** — the invariant really applies and is actually exercisable.
3. **Proof state** — `PASS`, `FAIL`, `UNPROVEN`, or `N/A`; `UNPROVEN` never counts as PASS.
4. **Witness class** — Product, harness, control-plane, environment, or historical witness.
5. **Mechanism attribution** — a current repairable mechanism is demonstrated.
6. **Ownership** — one bounded owner exists; no competing lane already owns the same semantic domain.
7. **Preservation boundary** — the repair says both what must change and what must remain semantically unchanged.

Only `CONFIRMED CURRENT PRODUCT MECHANISM` may become Product implementation work.

```text
red signal ≠ admitted Product defect
historical verified-at-anchor ≠ current-local
ahead commit ≠ necessary unique work
branch count ≠ backlog
main moved ≠ transport PR required
```

## PROOF / CONTROL-PLANE BOUNDARIES

- Same-tree pass/fail contradiction → **PROOF SUSPECT first**; compare exact workflow/event/inputs/environment/artifacts/assertion before mutating Product.
- Surrogate metrics may ratchet/guard but cannot be sole semantic oracle.
- Mass edits require target proof **and preservation proof** outside the intended mutation set.
- SYSTEM work should declare semantic ownership domain in addition to allowed files.
- New writers require **necessity proof + safety proof**; self-deleting/temporary is not sufficient justification.
- Independent checks should produce a bounded complete failure census rather than hide later failures behind `A && B && C` where there is no true prerequisite.
- Closure is read-only. If closure discovers a repair, the signal goes back through admission and receives a normal implementation owner only if admitted.

Full evidence and historical examples: [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md).

## EXECUTION BOUNDARIES

- Do not reopen a completed root without fresh current evidence.
- Do not promote an automated CI issue into Product work from title/label/workflow name alone.
- Do not delete branches by name, age, raw ahead count, or historical role alone; classify necessary unique output first.
- Do not rerun ancient CI merely to color historical refs green.
- Do not create authority-sync work merely because Product main moved.
- Do not create a successor unless an explicit replacement is necessary and unique required output still needs an owner.
- Do not create write-capable workflow machinery for Markdown consolidation.
- Optional/refactor/polish work is not an active defect merely because it is useful.
- When an admitted lane reaches terminal disposition, it leaves MASTER in the same consolidation transaction.

## TERMINAL STATE

The current Product mutation state is:

```text
ADMITTED PRODUCT WORK = 0
OPEN PRODUCT PR = 0
UNADMITTED ASSURANCE SIGNAL = #474
→ NO CURRENT PRODUCT MUTATION REQUIRED
```

For #474, the only justified work from this matrix is **bounded assurance attribution if/when that signal requires handling**. If attribution resolves it as harness/control-plane/environment/stale reference, or the lifecycle closes on a newer successful run, and no separate current Product mechanism is admitted:

```text
NO CURRENT ACTION REQUIRED
→ STOP
```

`STOP` is a valid successful outcome. It must not automatically trigger another audit wave, successor, transport PR, global synchronization pass, branch census campaign, new guard, or terminal writer merely to keep work moving.
