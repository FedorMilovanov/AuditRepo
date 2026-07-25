# Current-head reverify — `853d9bc5` CI convergence

## Exact authorities

- Source main: `853d9bc5abbe653a23528e444a27689c0b6b8ce6`.
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`.
- Production evidence: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS artifact `8622642553`, live pointer and run-addressed provenance.
- Current source is not claimed deployed.

## Closed source transitions

### `CI-ALERT-POST-RECOVERY-ORDERING`

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b`. `latestSeen` is now the global terminal-event cursor; delayed attempts/duplicates are ignored and genuinely newer failures reopen deterministically. Shared `30171424913` passed.

### `DEPLOY-WITNESS-RAW-RUN-CONCURRENCY`

PR #322 merged as `853d9bc5abbe653a23528e444a27689c0b6b8ce6`. Equal raw automatic/manual target IDs share a non-cancelling writer lock. Shared `30171638400` and TTS `30171638405` passed. This is an intermediate closure only.

## Open canonical identity residual

### `DEPLOY-WITNESS-CANONICAL-RUN-LOCK`

Issue #320 is reopened; PR #332 is the sole owner.

- head `a9d3f3e1bcad20bb8afe799b094fb828cc832cad`;
- read-only resolver canonicalizes to API `workflowRun.id`;
- privileged writer locks on the resolved output and revalidates run/SHA;
- Shared `30172042020` passed;
- TTS source contract `30172042018` failed because mutation `resolved workflow identity check removed` removes only the resolver assertion while the writer duplicate still satisfies an unbounded pattern;
- artifact `8623180869`, digest `sha256:1eed306374087c919719dc7aae7e2aa9adf16de45bb02704b1b50170f894561e` preserves the failure.

Required: independently bound resolver and writer identity/success/repository/SHA checks. Do not weaken defense in depth.

## Active owners

- #309 fonts — draft `c694b776`; artifact `8623016486` proves remaining focused red is obsolete assertion wording after a correct canonical metadata failure.
- #324 source links — head `a24bd78d`; Source Link `30172153862` and Shared `30172153863` pass; real-network adapter evidence and evidence redaction/hop truthfulness remain acceptance boundaries.
- #332 deployment witness canonical identity — sole owner. PR #331 is closed without merge.

## Counters

- closed: 157;
- release-blocking P0/P1: 0;
- P1: 101;
- P2: 37;
- P3: 51;
- refactoring: 4;
- AuditRepo: 4;
- total open: 197.

## Production boundary

Operator marker `5080203496` is recovery evidence, not automated success. Ledger run `30169981463` remains failed. Automated replay is unobserved. Whole-release identity/build-once remain #292/#295.
