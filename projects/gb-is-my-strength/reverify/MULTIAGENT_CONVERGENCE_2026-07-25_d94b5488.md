# Multi-agent convergence report — 2026-07-25

## Scope

Operational delta after the previous 2026-07-24 all-ref forensic boundary. This document records current shared-surface ownership, CI interpretation and architecture findings across `gb-is-my-strength`, AuditRepo and the Genesis/Research lanes.

## Resolved during convergence

### Duplicate PDF ownership

- Final product owner: merged PR #283.
- Superseded diagnostic: PR #280 closed without merge.
- Current source merge: `d94b54889e4f5f0330adaf2b9947e59af4aee7e4`.
- No temporary PDF workflow/materializer remains on `main`.
- Narrow evidence follow-up: PR #286, test-only, existing workflow only.

### Stale Genesis snapshot

- PR #285 had no active activation consumer and referenced older `main@ddcf7153`.
- It was closed without merge.
- Its branch was reset to current `main@d94b5488`.
- Genesis 6 remains intentionally draft/noindex pending one explicit five-route activation owner.

## Open P1 findings

### `AUDIT-SSOT-CURRENT-HEAD-DRIFT`

AuditRepo source truth stopped at `184d7ed1` and listed obsolete PR ownership/order. This convergence PR updates the two canonical SSOT files and adds immutable current-head evidence.

### `CI-ALERT-NO-RECOVERY-STATE`

`notify-on-failure.yml` opens/updates failure issues but has no exact-head recovery transition. It also does not reliably download the named diagnostic artifact or quote the actual failed step. Historical failure issues can therefore remain open after recovery and contain guessed root-cause prose.

Required state key:

```text
workflow + branch/PR + latest head SHA
```

Required transitions:

```text
failure -> open/update
success on exact latest head -> recovered/closed
cancelled/newer head -> superseded
```

### `CI-BUILD-VALIDATION-DUPLICATION`

Readiness and deploy repeat dependency installation, production-like build and overlapping full/light validation. Target architecture:

```text
PR capability gates
  -> exact-head full readiness
  -> build dist once
  -> upload immutable artifact + digest
  -> deploy the same artifact
  -> generic live production witness
```

### `CI-WORKFLOW-PROLIFERATION`

The control plane expanded from the earlier 19-workflow baseline to roughly 26 permanent workflows, with specialized lanes repeating large common build/test sections. No new permanent workflow should be added before a capability/ownership inventory.

### `DEPLOY-PROVENANCE-TTS-COUPLING`

PR #284 uses a generic filename and immutable path but its schema/ownership is primarily TTS-specific. Required shape:

```json
{
  "schemaVersion": 1,
  "repository": "...",
  "commitSha": "...",
  "artifactDigest": "...",
  "workflow": {},
  "build": {},
  "routes": {},
  "criticalAssets": {},
  "extensions": {
    "tts": {}
  }
}
```

Generic provenance must not be owned exclusively by the TTS capability workflow.

### `WORKFLOW-POLICY-SHADOW-ERA`

Existing issue #64 remains open. Workflow policy still protects historical shadow/route names rather than capabilities, effective route registry coverage, read-only validation and permission contracts.

## Open P2 findings

### `GENESIS6-ACTIVATION-OWNER-GAP`

The content corpus exists, but no active activation owner exists. Current intentional state is draft/noindex. A future activation must use one PR and one owner; snapshots are temporary operations only.

### `RESEARCH-AUTHORITY-MANIFEST-MISSING`

Research has strong methodology and supersession prose but no machine-readable authority graph. Required fields include document ID, scope, supersedes, authority, source grade, rights status and pinned source commit. Validation must reject cycles, duplicate canonical authority, missing documents, stale site references and unresolved rights.

## Existing findings preserved

- `EDITORIAL-PROJECTION-51-DRIFT` — existing issue #217; projection-only differences cannot be repaired by a generic editorial writer.
- `WORKFLOW-POLICY-SHADOW-ERA` — existing issue #64.

## Red CI classification

| Class | Meaning | Required response |
|---|---|---|
| Protective failure | Guard rejected forbidden temp/write state | Remove temporary state; do not weaken guard |
| Product regression | Reproducible behavior/contract failure | Fix root cause and preserve regression test |
| Cancelled/superseded | Newer head replaced the run | Ignore as product evidence; inspect latest exact head |
| Stale alert | Failure issue outlived recovery | Fix notifier lifecycle; do not reopen product work blindly |

## Agent instructions

### PDF

One product owner only. #283 is merged. #286 may add only the missing physical front/back proof. No text-based Gill selectors and no new workflow.

### Deployment provenance

Refactor #284 into generic identity/build/routes/assets plus `extensions.tts`. Do not add a specialized workflow.

### Genesis 6

Remain draft/noindex until one explicit activation PR exists. No third snapshot lane.

### CI

Inventory before adding workflows. Prefer capability gates around one build-once/promote-same-artifact chain.

### AuditRepo

Update only SSOT and immutable reverify evidence. Do not rewrite static project registry/history facts.

## Final convergence state

- Current source authority: `d94b5488`.
- Duplicate PDF product ownership: resolved.
- Temporary Genesis snapshot: removed.
- Active source PRs: #284 and #286.
- Production evidence import, notifier lifecycle, build-once deployment, workflow capability policy and Research authority graph remain open.
