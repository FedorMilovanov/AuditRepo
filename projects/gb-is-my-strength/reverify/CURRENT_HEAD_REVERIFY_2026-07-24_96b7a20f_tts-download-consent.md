# CURRENT HEAD REVERIFY — 2026-07-24 — TTS download consent

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source merge: `96b7a20f6d9b65fc2363c04c744c5f1af24e000c` — PR #177
- Exact verified PR head: `1c38a8b6c9c31d7b9b98a54ab08b46f2f7e4a012`
- Last exact production authority remains `8a5352671375fdb01b6c30273c25ec4283a13f69`
- This document advances source/CI truth only; it does not claim a new exact Pages deployment.

## Closed canonical row

`TTS-DL-CONSENT`

The owner-approved behavior is post-start and non-blocking: ordinary Web Speech begins immediately. Only a real enhanced-model cache miss creates one compact status card. The card states that the ordinary voice already works and exposes one primary `Не загружать` action. That action aborts the active model fetch through `AbortController`, records `gbx-vosk-warmup=off`, prevents later automatic retries and does not interrupt the ordinary voice.

## Permanent source scope

1. `.github/workflows/tts-download-consent.yml`
2. `css/tts-download-notice.css`
3. `js/vosk-tts-engine.js`
4. `scripts/audit-pro.js`
5. `scripts/tts-download-consent-contract-test.js`
6. `scripts/tts-download-notice-browser-test.js`

No homepage, map, glossary, article, route mirror or shared `site.css` file was changed by PR #177.

## Exact-head evidence

| Contract | Run | Result |
|---|---:|---|
| TTS Download Consent | `30083527472` | source/mutation and desktop/mobile Chromium jobs success |
| Shared Files Guard | `30083527643` | shared/system, runtime, workflow and actionlint gates success |
| Route Registry Validators | `30083527432` | registry contracts, production-like build, SEO, search/index, 75 public routes, route semantics and Nagornaya UI success |
| Visual Parity Guard | `30083527431` | production build, screenshot diagnostics and owner-approved route policy success |

The final source contract rejects six adversarial mutations: missing `AbortSignal`, missing persisted refusal, removed cancel action, undersized coarse-pointer target, stale stylesheet revision and a disconnected loading-pulse keyframe. The browser fixture verifies desktop and mobile-dark layout, pointer and keyboard activation, actual request abortion, repeat opt-out behavior and absence of a hidden-control focus trap.

Manual review found the pulse animation referencing `wb-tts-download-pulse` while the declared keyframe was `gb-tts-download-pulse`. The mismatch was fixed and made permanently blocking rather than left as untested decoration.

## Audit integration

The isolated stylesheet is registered in `audit-pro`; CSS/JS structure success text derives from the canonical allowlist sizes instead of literal counts. The full registry-owned source corpus and 75-route production browser matrix remained green.

## Deliberately open residuals

- `TTS-DL-NO-TABLOCK`: two tabs can still initiate separate large downloads because no cross-tab ownership/lock exists.
- `TTS-DL-UNZIP-SYNC`: the complete archive is still synchronously decompressed on the main thread.

Those are separate runtime/performance debts and are not silently absorbed into the consent closure.

## Counter transition

- Closed: `141 → 142`
- P1 open: `96 → 95`
- Total matrix open: `194 → 193`
- P0/P2/P3/refactoring/AuditRepo counters unchanged.
