# R-006 route-scoped TTS loading verification

## Disposition

- Wave type: selected current-check / performance-owner classification.
- AuditRepo base: `3ed84a33073fd4b97c8d8b0f238c2cff92602ab0`.
- Product anchor: `a55a03851506945ef61bb753efe58205d231a807`.
- Product mutation: none.
- Live/production claim: none.
- Historical matrix recount: intentionally not performed under operating-model v2.

## Question

Does the current Product still load the heavy TTS/Vosk runtime on unrelated catalogs and application routes, such that historical `R-006` needs a new Product extraction lane?

The wave separates four different costs that the historical wording collapsed:

1. mounting the reader action component;
2. loading the small document-side TTS controller/bootstrap;
3. starting a Worker;
4. downloading, verifying, extracting and initializing the approximately 280 MB Vosk model.

## Current source evidence

### Non-reader surfaces

Representative unrelated native surfaces do not mount `ReaderActionsRuntime`:

- Home `src/pages/index.astro` owns only Home components and SearchAction handling;
- `/map/` owns Atlas components only;
- `/karty/avraam/` owns the MapEngine body plus app-search surface;
- `/konfessii/russkij-baptizm/` owns the iframe-based 3D application shell.

These routes therefore do not receive the reader TTS module graph through their page source.

### Legitimate reader/landing surface

`/baptisty-rossii/` explicitly imports `ReaderActionsRuntime`, but this is not an unrelated catalog. Its rendered book landing contains:

- a real `[data-fc-action="play"]` control;
- an `article.article-body` / `data-pagefind-body` text surface;
- reader controls and an authored speakable reading flow.

The runtime inclusion is therefore tied to a user-visible capability on that page.

### Document client versus heavy engine

`ReaderActionsRuntime.astro` loads the canonical reader owners and exposes `vosk-tts-engine.js` on reader surfaces. The engine file itself initializes only lightweight state and public methods.

The heavy boundary remains lazy:

- `ensureWorker()` constructs SharedWorker first and DedicatedWorker only as fallback;
- `ensureLoaded()` checks persistent user opt-out before sending `type: ensure`;
- model download, integrity verification, archive extraction, IndexedDB and ONNX session ownership remain in `vosk-tts-worker.js`, not the document client;
- `reader-tts.js` installs event listeners at page load but does not call `beginSession()` automatically;
- normal playback begins through the canonical PLAY click, keyboard shortcut or explicit public API;
- when Web Speech is available, `selectEngine()` starts the system voice and only then invokes `warmVosk()` in the background;
- retry/switch requests remain explicit user-driven paths.

A plain page open therefore does not create the Worker or request the model.

## Existing class-level repair and regression evidence

Product PR #876 / merge `0d60315d37efd5b47c76795f8167e99398a5b7e3` replaced the former main-thread architecture with:

- one capture-phase `GBReaderTTS` owner;
- SharedWorker-first / DedicatedWorker-fallback model ownership;
- worker-side download, SHA verification, extraction, persistence, ONNX preparation and synthesis;
- cross-tab acquisition/session ownership;
- deterministic lifecycle and cancellation.

Its exact tested head `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e` proved:

- 56 production candidate routes × desktop/mobile = 112/112 checks;
- exactly one model request for 280,394,098 bytes;
- SharedWorker follower/navigation reuse;
- maximum measured UI heartbeat gap 32.7 ms;
- 19/19 workflow groups green.

Current permanent contracts additionally reject:

- heavyweight ONNX/model/extraction ownership returning to the document client;
- Worker revision drift;
- missing opt-out-before-worker-start behavior;
- loss of SharedWorker preference or DedicatedWorker fallback;
- notice geometry that intercepts PLAY.

The route crawl discovers candidates from actual PLAY/floating-reader markers rather than declaring every production route a TTS route.

## Classification

### R-006 — absorbed-by-system-fix

The useful concern behind `R-006` was preventing a heavy speech engine from burdening unrelated routes and the document main thread. The common mechanism has already been replaced:

- unrelated representative app/Home surfaces do not mount the reader runtime;
- pages that do mount it expose an actual reading/PLAY capability;
- the heavy model owner is lazy and Worker-bound;
- no current measurement demonstrates user-visible or operational harm from the remaining lightweight bootstrap on eligible reader pages.

Creating another extraction, bundle threshold or TTS owner would duplicate a working architecture without measured benefit.

`R-006` is therefore `absorbed-by-system-fix`, not an active Product repair lane.

## Boundaries and future regressions

This disposition does not claim that every future route inclusion is automatically correct. A concrete future route that:

- mounts reader TTS without a reading/PLAY capability;
- starts a Worker or model request before user playback;
- loads model/ONNX/extraction code on the document thread; or
- shows measurable route-specific loading harm

should be opened as a new bounded finding with route, request and browser evidence. It should not reopen the generic historical `R-006` obligation without such evidence.

## Result

- `R-006`: `absorbed-by-system-fix`.
- Product change required: none.
- `ST-PERFORMANCE`: remains useful for measured work, currently chiefly `R-005` and any future direct route-specific evidence.
- Optional work queue: remove the completed generic TTS lane.
- Historical matrix: preserved as transitional evidence until a dedicated active-backlog migration wave.
