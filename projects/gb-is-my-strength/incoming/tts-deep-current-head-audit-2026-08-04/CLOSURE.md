# Deep PLAY / TTS / Vosk audit closure — 2026-08-04

## Purpose

This file closes the findings recorded in `REPORT.md` without rewriting the historical baseline. The baseline captured the pre-fix state at product audit head `b32409f96d4fbab7804a060b0bb84eacefd776e6`; this closure records the independently gated product result in `FedorMilovanov/gb-is-my-strength#876`.

## Final product reference

- Product PR: `FedorMilovanov/gb-is-my-strength#876`
- Product title: `feat(reader): harden shared TTS playback across article routes`
- Final product head: `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e`
- Current `main` reconciled into the lane: `83875378a31436e235f1296f13d22c816b2945df`
- Reconciliation merge: `eb6893e337082e2f244388035294ce8de7523d60`
- Canonical umbrella issue: `FedorMilovanov/gb-is-my-strength#61`
- Superseded audit-only PR: `FedorMilovanov/gb-is-my-strength#875` — closed without merge

## Corrected architecture

The final product uses one capture-phase `GBReaderTTS` owner with an explicit operation-token state machine:

`idle → starting → playing ↔ paused → complete`, plus `error`.

The Vosk path is SharedWorker-first with a DedicatedWorker fallback. The Worker owns:

- the approximately 280 MB model acquisition;
- integrity verification and archive extraction;
- IndexedDB persistence and reuse;
- ONNX Runtime session construction;
- inference and synthesis;
- serialized jobs, client identity, heartbeat and progress.

The document thread is limited to state, consent/status presentation and audio playback. Cross-tab ownership and SharedWorker reuse prevent duplicate acquisition and expensive repeated preparation.

Additional corrections include:

- native Web Speech pause/resume;
- continuation from the latest boundary after rate change;
- deterministic rapid-click handling and stale callback rejection;
- `pagehide` / `beforeunload` cleanup;
- live Web Speech and Vosk progress;
- Vosk audio pause/resume and in-place playback-rate changes;
- corrected ORT WASM distribution path and worker-safe settings;
- manual pronunciation terms overriding model dictionary membership;
- mobile notice placement/clickability;
- canonical ownership on `/baptisty-rossii/spravochnik/`;
- a bounded, single-replay fallback for the Gill mobile ToC WebKit activation race without adding a second modal owner.

## Final blocking evidence

### TTS Reader Polish

Workflow run: `30936304361`

Real-model job: `92083287842` — **success**

- cold SharedWorker ready: `49,381.0 ms`;
- SharedWorker follower ready: `9.7 ms`;
- SharedWorker synthesis: `2,738.0 ms`;
- navigation reuse ready: `6.8 ms`;
- cached DedicatedWorker ready: `37,308.7 ms`;
- cached synthesis: `2,873.3 ms`;
- maximum measured document heartbeat gap: `32.7 ms`;
- model requests: exactly `1`;
- model bytes: `280,394,098`;
- generated WAV: `45,612` bytes in both synthesis paths;
- shared WAV RMS / peak: `2636.38 / 16498`;
- cached WAV RMS / peak: `2902.50 / 23425`;
- PASS-to-artifact step start: approximately `29 ms`.

Playback/FSM/routes job: `92083287932` — **success**

- production TTS routes: `56`;
- desktop/mobile checks: `112`;
- failures: `0`;
- deterministic FSM, lifecycle, pause/resume, rate, progress and cross-tab fixtures: pass.

Artifacts:

- playback: `8903539955`;
- real model: `8903325837`.

### Consent, source and release

Workflow run: `30936304395` — **success**

- consent/status/pronunciation architecture contracts: pass;
- provenance and build-once release contracts: pass;
- asset revisions and workflow policy: read-only clean;
- production route crawl and mobile notice geometry: pass.

Artifacts:

- consent/browser: `8903567531`;
- source contract: `8903395410`.

### Repository-wide verification

Every workflow group associated with final head `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e` completed successfully: **19/19**.

This includes:

- Route Registry Validators, including strict repository audit, Chromium public surfaces and Chromium/WebKit touch/scroll;
- Overlay Runtime Browser in Chromium, Firefox and WebKit;
- Runtime Interactive Audit;
- Visual Parity Guard;
- Deploy Candidate, Print Paper, Native Source and Source Authority;
- Search Manifest, Metadata, Shared Files, Glossary and editorial contracts;
- Gill reconciliation/traversal and Avraam reference baseline.

PR review state at closure:

- unresolved review threads: `0`;
- submitted reviews: `0`;
- product PR: open, mergeable and ready for review;
- product merge/deployment: not performed because no authorization was given.

## Finding disposition

| Baseline finding | Final disposition |
|---|---|
| P0 document-thread freeze during preparation | Closed: preparation moved to Worker; max measured UI gap `32.7 ms` |
| P0 document-thread freeze during synthesis | Closed: inference in Worker; shared/cached synthesis remains responsive |
| Rapid PLAY toggle race | Closed by explicit `starting` state and operation tokens |
| Pause/resume replays full chunk | Closed: native resume / preserved playback state |
| Rate change replays full chunk | Closed: continuation from latest speech boundary |
| Missing page lifecycle cleanup | Closed: `pagehide` and `beforeunload` cancellation |
| Frozen Vosk progress | Closed: Worker generation and playback progress messages |
| Mobile notice intercepts PLAY | Closed by geometry/pointer contract and browser gate |
| `/baptisty-rossii/spravochnik/` no-start | Closed by canonical route owner and route crawl |
| Duplicate cross-tab acquisition | Closed by SharedWorker ownership plus fallback lock protocol |
| Manual pronunciation cannot override dictionary | Closed by manual-first precedence |
| Pronunciation assets bypass dedicated CI | Closed by expanded workflow paths and source contracts |
| Dual-owner ambiguity | Closed for TTS routes by one capture-phase `GBReaderTTS` owner |
| WebKit Gill ToC activation race found during final audit | Closed by bounded single replay; full WebKit surface and overlay matrices pass |

## Verdict

The TTS ownership, playback and Vosk implementation is **10/10 against the blocking acceptance criteria defined by the baseline audit**.

The broader issue `gb-is-my-strength#61` remains open only for separate ReaderProjection, speakable/search policy, speed/search accessibility, radiogroup and save-metadata work outside the scope of product PR #876.