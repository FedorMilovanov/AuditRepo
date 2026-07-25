# CURRENT HEAD REVERIFY — 2026-07-25 — `7b462b96` canonical deployment-witness lock

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `7b462b96f0e776dbd155e19cd7eb01610499e137`
- Exact imported production SHA: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `74ad756f5f4a5597d654f80413c505d9e3e4ffc1`
- Imported production proof: artifact `8622690663`, digest `sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`

Source and production remain separate. This advances source truth only.

## Production authority retained

Exact `f5e29998` evidence remains unchanged:

- readiness `30169126149` success;
- deploy `30169443420`, attempt 1, success;
- GitHub Pages deployment `5603663894` success;
- Pages artifact `8622641548`, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS artifact `8622642553`, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- exact live report, two routes, asset/CSP/SW checks and captured pointer/provenance PASS.

Historical ledger run `30169981463` remains failure at PR projection. Operator comment `5080203496` is transparent recovery, not automated success.

## Source progression after `733ba309`

### Notifier ordering

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b` and closed the newest-transition ordering residual without reopening the broader notifier architecture.

### Redirect-hop policy

PR #324 merged as `e8e7c39c15642f0ab70999779b9d734c29c70f77` after exact Source Link Audit `30171741109` and Shared Guard `30171741122` success. Core per-hop scheme/host/private-address/redirect-chain policy and DNS pinning are source fixed. Issue #303 remains open for malformed-input evidence privacy, immutable evidence-action pins and real-network artifact acceptance.

### Canonical witness writer lock

PR #332 final head `73a0417ed1e522c43d1cced584d4651d4bf8a0f7` merged as `7b462b96f0e776dbd155e19cd7eb01610499e137` and closed #320.

Architecture:

- workflow defaults to contents read only;
- read-only resolver canonicalizes numeric deploy-run identity and validates exact workflow/status/success/main/repository/SHA;
- privileged writer alone owns Issues/PR write;
- job-level concurrency uses only `needs.resolve.outputs.run_id` with cancellation disabled;
- writer re-fetches and revalidates the target after acquiring the lock;
- exact-run artifact, disabled credentials and full-SHA action pins remain.

Exact evidence:

- TTS Download Consent `30172394177` PASS: source, recorder/provenance, 44 adversarial mutations, canonical alias/unsafe-ID fixtures, actionlint, Chromium/WebKit lifecycle, production build, real routes and mobile geometry;
- source artifact `8623271965`, digest `sha256:282aeba9e05cf27fb3c3a5fe46392f304a469ad8f6c247976c9848df92143a6b`;
- browser artifact `8623312279`, digest `sha256:c9980c26a3d5b54b559d7a618342479b1caa96adc3615dbe5d583ebac63c1f02`;
- Shared Files Guard `30172394185` PASS.

## Current owner boundary

At capture only PR #309 remains open. It owns deterministic font integrity and its readiness/deploy integration. Its current focused jobs are green; the known Shared Guard failure was stale fixture-message drift after stronger validation and has been reported to the owner.

## Remaining systemic work

1. Finish #309 without weakening production validation.
2. Converge #292/#295 build-once + whole-artifact provenance.
3. Finish #303 privacy/evidence/pinning residuals.
4. Reconcile legacy guessed alerts.
5. Complete #301/#64 permission registry.

## Acceptance

- advance source boundary to `7b462b96`;
- retain production authority at `f5e29998`;
- record #320 closed by canonical lock;
- record #303 core merged but acceptance residual open;
- retain automated replay observation and whole-release identity gaps;
- leave matrix counters unchanged.
