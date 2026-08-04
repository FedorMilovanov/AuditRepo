# Final TTS validation — 2026-08-04

## Disposition

**PASS — 10/10 for the TTS ownership / playback / Vosk scope defined by the blocking acceptance gates.**

This is the closure companion to `REPORT.md`. The original report remains the immutable defect baseline; this file records the corrected product state and final evidence.

Product repository: `FedorMilovanov/gb-is-my-strength`  
Product PR: `#876` — `feat(reader): harden shared TTS playback across article routes`  
Final tested head: `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e`  
Main reconciliation commit: `eb6893e337082e2f244388035294ce8de7523d60`  
Audit-only PR `#875`: closed without merge as superseded  
Canonical umbrella issue `#61`: remains open for the broader non-TTS ReaderProjection / speakable / search / save scope

PR #876 is open, ready for review and reported mergeable by GitHub. It was not merged and no production deployment was performed.

## Architecture accepted

- one capture-phase `GBReaderTTS` owner;
- explicit `idle / starting / playing / paused / complete / error` state machine;
- operation tokens and stale callback rejection;
- native Web Speech pause/resume and boundary-based rate continuation;
- `pagehide` / `beforeunload` cleanup;
- SharedWorker-first Vosk engine with DedicatedWorker fallback;
- Worker ownership of model download, SHA-256 verification, extraction, IndexedDB persistence, ORT session creation and inference;
- addressed clients, heartbeat, stale-client pruning and serialized synthesis;
- exactly-once cross-tab acquisition semantics;
- live preparation, synthesis and playback progress;
- worker-safe ORT WASM distribution path;
- manual pronunciation overrides before model dictionary fallback;
- versioned and release-attested engine/Worker assets;
- bounded Gill mobile ToC activation replay for WebKit throttling without a second modal owner.

## Baseline findings closed

| Baseline finding | Final disposition |
|---|---|
| P0 main-thread freeze during model preparation | Closed: preparation moved to Worker; final maximum measured UI gap `32.7 ms` |
| P0 main-thread freeze during synthesis | Closed: inference moved to Worker; synthesis heartbeat remains responsive |
| rapid PLAY race | Closed by explicit starting state and operation tokens |
| pause/resume replays active chunk | Closed by native pause/resume and persisted boundaries |
| speed change replays active chunk | Closed by boundary continuation / in-place Vosk playback rate |
| page lifecycle cleanup missing | Closed with pagehide/beforeunload cancellation |
| Vosk progress frozen | Closed with Worker progress messages and playback progress |
| mobile notice intercepts PLAY | Closed by geometry and pointer-event contract |
| `/baptisty-rossii/spravochnik/` no-start | Closed through canonical route owner; route crawl green |
| duplicate cross-tab acquisition | Closed with SharedWorker-first ownership and addressed clients |
| manual pronunciation cannot override dictionary | Closed by explicit manual-term precedence |
| pronunciation assets bypass dedicated CI | Closed by workflow path coverage and source contracts |
| Worker unrecognized by repository audit | Closed by strict canonical JS allowlist entry; unknown JS remains forbidden |
| WebKit Gill ToC activation race | Closed by bounded exactly-once replay; Chromium/Firefox/WebKit overlay matrices green |

## Final real-model evidence

TTS Reader Polish run: `30936304361`  
Real-model job: `92083287842`

- cold SharedWorker ready: `49,381.0 ms`;
- SharedWorker follower ready: `9.7 ms`;
- navigation reuse ready: `6.8 ms`;
- SharedWorker synthesis: `2,738.0 ms`;
- cached DedicatedWorker ready: `37,308.7 ms`;
- cached synthesis: `2,873.3 ms`;
- maximum measured UI heartbeat gap: `32.7 ms`;
- generated WAV: `45,612` bytes in both synthesis paths;
- audio was non-silent in both paths;
- model requests: exactly `1`;
- model bytes: `280,394,098`;
- PASS-to-artifact start: approximately `29 ms`;
- real-model job completed inside the fail-closed eight-minute budget.

## Final route and source evidence

- TTS Reader Polish run `30936304361`: real-model and playback/route jobs successful;
- TTS Download Consent run `30936304395`: source/release and consent/browser jobs successful;
- production TTS routes: `56`;
- desktop/mobile checks: `112/112` successful;
- mobile notice geometry: successful;
- model consent/status/pronunciation/provenance/build-once/workflow-policy contracts: successful;
- repository audit allowlist and route registry contracts: successful.

Artifacts:

- playback: `8903539955`;
- real model: `8903325837`;
- consent/browser: `8903567531`;
- source contract: `8903395410`.

## Repository-wide final result

All **19/19** workflow groups associated with final product head `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e` completed successfully, including:

- TTS Reader Polish;
- TTS Download Consent;
- Route Registry Validators, including Chromium and WebKit public-surface matrices;
- Overlay Runtime Browser in Chromium, Firefox and WebKit;
- Runtime Interactive Audit;
- Visual Parity;
- Deploy Candidate;
- Print Paper;
- Native Source and Source Authority;
- Search, Metadata, Glossary, Shared Files, Dateline, Avraam and Gill contracts.

Review state at closure:

- unresolved review threads: `0`;
- submitted review blockers: `0`;
- PR #876: ready for review and mergeable;
- merge performed: **no**;
- production deployment performed: **no**.

## Remaining umbrella work

This validation closes only the TTS ownership/playback/Vosk slice. Issue `gb-is-my-strength#61` correctly remains open for independent requirements around:

- a unified ReaderProjection policy for TTS, speakable, search and summaries;
- speed/search inactive-layer accessibility semantics;
- radiogroup keyboard behavior;
- canonical save/favorite metadata and cross-surface synchronization.

Those items do not invalidate the 10/10 disposition for the TTS slice validated here.
