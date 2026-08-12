# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Latest terminal control-plane evidence:
- [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

## Live verification stamp — 2026-08-12

| Field | Observed current value |
|---|---|
| Product `main` | `64bb04bda2b228ef23c20214199b67b987c1eb94` |
| Product tree | `ecff634b31252cd2bed2f9906e2ad4c3056cbd41` |
| Product open PRs | **0** |
| Product open issues | **0** |
| Open `ci-failure` issues | **0** |
| Admitted current Product defects | **0** |
| Active Product implementation lanes represented here | **0** |
| Active SYSTEM repair lanes represented here | **0** |
| Owner decisions blocking admitted Product work | **0** |
| Unadmitted assurance signals requiring action | **0** |
| In-progress / queued `main` workflows at terminal census | **0 / 0** |

This stamp records the terminal 2026-08-12 control-plane closure only. It is **not** a promise that AuditRepo will mirror every later Product move.

## ACTIVE CURRENT WORK — 0

There is currently **no admitted Product defect or SYSTEM repair root** in MASTER.

```text
Product implementation queue = 0
SYSTEM repair queue = 0
```

No branch, successor, transport PR, writer, terminal verifier or new Product issue is authorized by this empty matrix.

## UNADMITTED ASSURANCE SIGNALS — 0

There is no current unadmitted assurance signal requiring action.

Historical Product #474 (`Deploy to GitHub Pages`) completed bounded attribution and terminal disposition during the 2026-08-12 Gill/control-plane marathon. It is now closed/completed and is not an active matrix row. Exact production and recovery evidence is recorded in [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md).

A future GitHub lifecycle issue may carry a `bug`/`ci-failure` label and still remain unadmitted in this matrix. The notifier is a signal owner, not automatic Product root-cause authority.

## RECENTLY RETIRED FROM ACTIVE MASTER

These are recorded here only to explain the consolidation; they are **not active rows**.

### Product #474 / Gill production-readiness assurance lane — RESOLVED / REMOVED

The historical failed production signal was not promoted blindly from lifecycle metadata. The lane retained exact production Gill evidence, attributed the observed transport tuples, preserved hard-fail behavior for unrelated failures, and then proved the repaired oracle on fresh candidate and natural production runs.

Terminal evidence includes:

- PR #1668 — retained production Gill readiness evidence and release-pipeline contract coverage;
- failed natural Deploy `31621730184` — exact retained `hdrc.yandex.net / GET / xhr / net::ERR_ABORTED` evidence;
- PR #1669 — exact bounded HDRC transport diagnostic classification, with unrelated host/path/method/resource/error negatives preserved;
- candidate `31625050462` — Gill 24 expected / 24 cases / 24 completed / 24 exercised / 0 failures;
- natural production Deploy `31626546011`, attempt 1 — SUCCESS;
- final Product main after #1667: `64bb04bda2b228ef23c20214199b67b987c1eb94`;
- final natural Deploy `31636750081`, attempt 1 — SUCCESS, including readiness, production Gill, Pages promotion, generic live witness, TTS witness and IndexNow;
- Product #474 — closed/completed;
- terminal Product census — 0 open PRs, 0 open issues, 0 open `ci-failure` issues.

Detailed evidence: [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md).

### Shared Files Guard lifecycle applicability — RESOLVED / REMOVED

Product PR #1667 repaired the closed-PR lifecycle applicability boundary without weakening active open-PR diff authority. Current `main` was merged into the existing PR branch by an ordinary merge commit; the PR diff remained exactly the two owned files. Fresh exact-head checks were all green before one final merge.

Natural main evidence on `64bb04bda2b228ef23c20214199b67b987c1eb94`:

- Metadata `31636750134` — SUCCESS;
- Shared Files Guard `31636749988` — SUCCESS;
- Source Authority `31636750093` — SUCCESS;
- Node Toolchain `31636750010`, attempt 2 after one bounded failed-jobs rerun — SUCCESS with no code/config/dependency change;
- Deploy `31636750081`, attempt 1 — SUCCESS;
- Deployment Witness Ledger `31638307040` — SUCCESS.

No current SYSTEM repair lane remains from this owner.

### `V14-SEARCH-SCOPE-TAB-SEMANTICS` — CLOSED / REMOVED

Product PR #1637 merged as `d18ce559e166837380550c5cfd91db5687a3628f`.

The merged transaction repaired the previously active Search root by:

- replacing misleading tab semantics with truthful native pressed scope controls;
- integrating Search into shared `OverlayRuntime` ownership;
- preserving cold bootstrap/result navigation;
- retaining permanent Chromium/WebKit proof.

The old MASTER statement that Search was the sole direct current Product defect is therefore stale and is retired.

### Dependency-security #1652 — MERGED / REMOVED

The security transaction `security(deps): eliminate current npm advisories (#1652)` merged before the final control-plane closure. A merged security transaction does not remain in MASTER merely to preserve history.

### `FINAL-ZERO-AUDIT` — RETIRED AS A PERMANENT SYSTEM ROOT

The historical Full-Zero convergence model was useful during the one-time branch/issue/cemetery cleanup epoch. It is **not a standing SYSTEM lane** after the AuditRepo operating model moved to current actionable work only.

Do not recreate this row merely because:

- Product `main` advanced;
- AuditRepo snapshots are old;
- branch count changed;
- a CI lifecycle issue opened;
- a closed historical issue still exists in Git history;
- MASTER has zero admitted rows.

Global repository stillness is not the normal terminal invariant. The 2026-08-12 Product-zero census is evidence for one closure point, not a permanent requirement that every future repository moment remain globally still.

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
- A bounded rerun may prove recovery only when explicitly authorized; a recovered identical tree without code/config/dependency change is evidence against inventing a Product mechanism from the first red check.
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

The current Product mutation state at the 2026-08-12 terminal census is:

```text
ADMITTED PRODUCT WORK = 0
ACTIVE SYSTEM REPAIR = 0
OPEN PRODUCT PR = 0
OPEN PRODUCT ISSUE = 0
OPEN CI-FAILURE ISSUE = 0
UNADMITTED ASSURANCE SIGNAL REQUIRING ACTION = 0
IN-PROGRESS MAIN WORKFLOW = 0
QUEUED MAIN WORKFLOW = 0
→ PRODUCT ZERO
→ NO CURRENT PRODUCT MUTATION REQUIRED
```

`STOP` is a valid successful outcome. It must not automatically trigger another audit wave, successor, transport PR, global synchronization pass, branch census campaign, new guard, or terminal writer merely to keep work moving.
