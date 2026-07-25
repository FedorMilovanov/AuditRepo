# CURRENT HEAD REVERIFY — 2026-07-25 — `733ba309` ledger projection repair

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `733ba309e159023ae44682b7cb71b2c042cd8eb6`
- Exact imported production SHA: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `a56c85ca6d158267e1cebfea36c1e412089729ff`
- Imported V2 evidence artifact: `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`)
- Deep-audit intake: `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

Source and production remain separate. This document advances source truth to `733ba309`; it does not claim that source SHA deployed.

## Exact production authority retained for `f5e29998`

The imported V2 evidence remains authoritative:

- readiness `30169126149` — success on exact `f5e29998`;
- Pages deploy `30169443420`, attempt 1 — success on the same SHA;
- GitHub Pages deployment `5603663894` — success;
- Pages artifact `8622641548`, 63,124,892 bytes, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS witness artifact `8622642553`, 1,283 bytes, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- exact live report PASS, two real routes, controller/engine/CSS/Service-Worker hashes and `lazyTtsPrecache:false`;
- live `current.json` and `/deployments/f5e29998.../30169443420-1.json` matched at capture.

These facts remain capability-scoped. They do not establish build-once promotion or generic whole-release identity.

## Historical automated ledger result

Run `30169981463`:

1. downloaded the exact TTS artifact;
2. validated non-expiry, artifact ID/size/digest and the exact PASS report;
3. constructed the correct full-SHA witness body;
4. failed only on `POST /issues/286/comments` with `403 Resource not accessible by integration`.

Its conclusion remains **failure**. This document does not rewrite that history.

## Source repair merged in PR #312

PR #312 final head `0d0b7ad7aae282d052d055fd6bc4f9fd0e2cb55f` merged as `733ba309e159023ae44682b7cb71b2c042cd8eb6`.

The exact final source established:

- `pull-requests: write` only on the dedicated ledger writer;
- Pages deploy retains no Issues/PR mutation permission;
- main-only `workflow_dispatch(deploy_run_id)` recovery;
- exact Actions-API validation of run ID, workflow name, completion/success, `main`, same repository and full SHA;
- current trusted recorder code for manual replay, deployed-SHA source for automatic projection;
- `persist-credentials:false` and transient event data under `runner.temp`;
- exact-run artifact download;
- full-SHA pins for privileged `github-script`, `checkout` and `download-artifact` actions.

Exact CI:

- TTS Download Consent `30170949705` — source, recorder/provenance, 26 adversarial mutations, actionlint, Chromium/WebKit lifecycle, production-like build, Gill/standalone real-route matrix and mobile geometry all PASS;
- source artifact `8622897352`, digest `sha256:243e5ae277a7f66fafad335e0d19fa62b3172584c334c96e87bfd011994906af`;
- browser artifact `8622943174`, digest `sha256:e18cdc59427d363f9aac5a125a9edabd434d45b4c32507180e185d92277a82c0`;
- Shared Files Guard `30170949685` — PASS.

## Operator recovery projection

PR #286 now contains one exact marker:

`<!-- deployment-capability-witness:tts:f5e29998c5b42cc9e4e7c917b1e1c1072aa52320:30169443420:1:8622642553 -->`

Comment ID: `5080203496`.

The comment explicitly states:

- projection mode is operator recovery;
- historical automated ledger run remained failure;
- exact readiness/deploy/artifact IDs and digests;
- exact pointer/provenance URLs;
- TTS capability scope and #292/#295 limitation.

The connected GitHub tool exposed no workflow-dispatch operation, so an automated manual replay was not executed in this session. A future replay with `deploy_run_id=30169443420` must be idempotent against the existing marker.

## Temporary evidence carrier disposition

PR #307 was closed without merge after AuditRepo PR #62 imported artifact `8622690663`. It is not an active product/workflow owner.

## Current active source owners at capture

- #309 — deterministic fonts / #302;
- #321 — notifier monotonic `latestSeen` ordering / #318;
- #322 — automatic/manual ledger writer lock by target deploy run / #320;
- #324 — every-hop redirect/source policy / #303.

No reconciliation edit may cross those owners.

## Remaining systemic boundary

- production authority remains exact `f5e29998`;
- source authority is `733ba309` and is newer than the imported production witness;
- automated replay execution remains unobserved, though the source is repaired and an exact operator marker exists;
- #292/#295 remain authoritative for whole-artifact provenance and build-once promotion;
- #301/#64 remain authoritative for repository-wide permission registry and privileged-action policy.

## Acceptance

1. Advance AuditRepo source boundary to `733ba309`.
2. Keep production authority at exact `f5e29998`.
3. Record #312 as source+CI fixed and #307 as imported/closed without merge.
4. Keep `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP` open, narrowed to automated replay observation, newer-source deployment and whole-release identity.
5. Do not change matrix counters: no row changes severity/open/closed class in this reconciliation.
