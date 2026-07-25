# Current-head reverify — `853d9bc5` CI convergence

## Exact authorities

- Source main: `853d9bc5abbe653a23528e444a27689c0b6b8ce6`.
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`.
- Production evidence remains readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS witness artifact `8622642553`, live pointer and run-addressed provenance.
- Current source is not claimed deployed.

## Source transitions

### Notifier ordering — closed

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b`.

- `handleFailure()` now orders against `latestSeen || latestFailure`.
- delayed older attempt after recovery is ignored;
- duplicate recovery version is ignored;
- genuinely newer failure reopens the same machine-key issue;
- exact Shared Files Guard `30171424913` passed.

Canonical IDs: `CI-ALERT-NO-RECOVERY-STATE`, `CI-ALERT-POST-RECOVERY-ORDERING`.

### Deployment witness raw-ID serialization — intermediate closure

PR #322 merged as `853d9bc5abbe653a23528e444a27689c0b6b8ce6`.

- automatic/manual projection for the same raw target run ID shares one non-cancelling lock;
- exact Shared Files Guard `30171638400` passed;
- exact TTS Download Consent `30171638405` passed.

This closes the absent-lock race only. It does not close textual alias identity.

Canonical ID: `DEPLOY-WITNESS-RAW-RUN-CONCURRENCY`.

### Canonical run identity — open

Issue #320 is reopened and PR #332 is the sole owner.

- head at capture: `a9d3f3e1bcad20bb8afe799b094fb828cc832cad`;
- read-only resolver trims/validates input, resolves exact successful same-repository `main` Pages run and emits API `workflowRun.id`;
- privileged writer locks on `needs.resolve.outputs.run_id`, re-fetches and revalidates exact SHA before mutation;
- Shared Files Guard `30172042020` passed;
- TTS source contract run `30172042018` failed only because mutation `resolved workflow identity check removed` uses one `.replace`, removes the resolver assertion and leaves the writer duplicate satisfying an unbounded pattern;
- artifact `8623180869`, digest `sha256:1eed306374087c919719dc7aae7e2aa9adf16de45bb02704b1b50170f894561e` preserves the exact failure.

Required: independently bound resolver and writer identity/success/repository/SHA checks. Do not weaken defense in depth.

Canonical ID: `DEPLOY-WITNESS-CANONICAL-RUN-LOCK`.

## Active owners at capture

- #309 fonts — draft `c694b776`; exact artifact `8623016486` proves the remaining focused red is obsolete assertion wording after a correct canonical metadata failure.
- #324 source links — head `a24bd78d`; static Source Link `30172153862` and Shared `30172153863` pass, but real-network adapter evidence and evidence-redaction/hop truthfulness remain acceptance boundaries.
- #332 deployment witness canonical identity — sole owner.

PR #331 is closed without merge as duplicate of stronger #332.

## AuditRepo counters after this reconciliation

- closed: 157;
- release-blocking P0/P1: 0;
- P1: 101;
- P2: 37;
- P3: 51;
- refactoring: 4;
- AuditRepo: 4;
- total open: 197.

## Production boundary

The operator marker `5080203496` is truthful recovery evidence, not an automated success. Historical ledger run `30169981463` remains failed. Automated replay is unobserved. Whole-release identity/build-once remain #292/#295.
