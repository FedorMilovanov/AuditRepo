# Diotrophes live release same-SHA recovery — 2026-08-17

## Scope

Classify the Product `Diotrophes Live Release Extension` red signal on the attested Product `main` SHA without changing Product code or weakening the live-release contract.

## Anchors

- Product `main` / control-plane SHA: `a2ef67da54dd4ae00aedae154422280620acdf21`.
- Workflow: `Diotrophes Live Release Extension`.
- Workflow run: `32053106622`.
- Exact Pages deployment resolved by the workflow: run `32051788316`, attempt 1.
- Generic live PASS artifact: `release-live-deployment-32051788316`, artifact ID `9295399214`, expected SHA-256 `295a0977a078e6dcbb23280225721c8843d787058557430df42cbb74d0a49aff`.

## Attempt 1 — infrastructure failure before capability verification

Run attempt 1 failed in job `95457020232`, step `Download exact-run generic live PASS evidence`.

The exact Product checkout and exact successful Pages-deployment resolution had already succeeded. GitHub's artifact service then returned:

`No server is currently available to service your request. Sorry about that. Please try resubmitting your request and contact us if the problem persists.`

Because the prerequisite artifact was unavailable, the pinned-Node setup, verifier source contract and actual live Diotrophes verification were skipped. The later upload step also failed because no report had been produced.

This attempt therefore did **not** demonstrate a Product or Diotrophes contract failure. It demonstrated an unavailable GitHub Actions artifact service at the evidence-acquisition boundary.

## Recovery method

No Product file, workflow, timeout, assertion or retry policy was changed.

The failed workflow run itself was re-run using GitHub's native failed-jobs rerun mechanism. The rerun stayed on:

- the same run ID `32053106622`;
- the same Product/control-plane SHA `a2ef67da54dd4ae00aedae154422280620acdf21`;
- the same exact Pages deployment run `32051788316`;
- the same prerequisite generic live artifact and expected artifact digest.

## Attempt 2 — recovered and substantively green

Run attempt 2 job `95494476887` completed successfully. The recovery was substantive, not merely a green wrapper:

1. exact Product SHA checkout — PASS;
2. exact-run generic live PASS artifact download — PASS;
3. downloaded artifact SHA-256 matched `295a0977a078e6dcbb23280225721c8843d787058557430df42cbb74d0a49aff` — PASS;
4. pinned Node `22.23.1` setup — PASS;
5. `node --check` for the verifier and verifier test plus `git diff --exit-code` — PASS;
6. verifier source-contract tests — `Diotrophes live release contract tests: PASS`;
7. actual live verifier — `Diotrophes live release extension: PASS (a2ef67da54dd4ae00aedae154422280620acdf21, sha256:b5e3b8df9b5eca84281582efc16087255c7c4f2aecb821ac69ea3517e35d2cdd)`;
8. exact live-route evidence artifact upload — PASS, artifact ID `9299499783`, artifact digest `b666afa7f13a0f55a6b727b85b34feb782d7be0c1ebe0f7ea8e27b32d733a812`;
9. idempotent capability-witness recording — PASS.

The verifier asserted the exact live route `/articles/diotrefy-nashego-vremeni/`, HTTP 200, publication marker, source authority, source-link contract, immutable deployment pointer and evidence-artifact identity against the exact release/control-plane anchors.

## Classification

`DIOTROPHES_LIVE_RELEASE_ATTEMPT_1 = EXTERNAL_GITHUB_ARTIFACT_SERVICE_FAILURE`

`DIOTROPHES_LIVE_RELEASE_ATTEMPT_2 = SAME_RUN_SAME_SHA_SUBSTANTIVE_RECOVERY`

`PRODUCT_MUTATION_REQUIRED = false`

`ACTIVE_MASTER_ROOT_REQUIRED = false`

This recovered signal should remain forensic evidence rather than an active MASTER row. A future repeat should be classified from fresh evidence; this recovery is not a blanket exemption for later failures.

## Terminal-attestation consequence

The Diotrophes failure occurred after AuditRepo #309's terminal snapshot, so it was a freshness signal. It is now independently classified and recovered on the same Product SHA with the real live verifier green.

This recovery does **not** restore terminal `PRODUCT ZERO: CURRENT`, because the separate `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` remains unresolved. It only removes Diotrophes as an independent current blocker/root.
