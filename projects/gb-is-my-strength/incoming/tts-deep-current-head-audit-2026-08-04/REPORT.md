# Deep PLAY / TTS / Vosk audit — 2026-08-04

## Scope

Current-head audit of the TTS reader in `FedorMilovanov/gb-is-my-strength`:

- PLAY / PAUSE / RESUME and speed-change behaviour;
- Web Speech fallback and PremiumControls ownership;
- real Vosk model download, ONNX initialization, synthesis and IndexedDB reuse;
- desktop/mobile interaction coverage;
- lifecycle cleanup and progress;
- pronunciation/stress architecture and CI coverage.

This record is evidence-only. Product runtime files were not changed in the audit lane.

## Reproducibility

- Product audit PR: `FedorMilovanov/gb-is-my-strength#875`
- Audit base / rollback: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- Audit head: `b32409f96d4fbab7804a060b0bb84eacefd776e6`
- GitHub Actions run: `30898028535`
- Browser evidence artifact: `8888255621`
- Canonical product issue: `FedorMilovanov/gb-is-my-strength#61`
- Production-like build command: `npm run strangler:build:production-like`

Audit additions:

- `scripts/tts-engine-lifecycle-browser-test.js`
- `scripts/tts-real-model-phase-browser-test.js`
- `scripts/tts-route-crawl-browser-test.js`
- `.github/workflows/tts-download-consent.yml`

The legacy blocking Chromium/WebKit contracts remained green. New defect probes were diagnostic and intentionally non-blocking in the audit-only PR.

## Executive verdict

The real Vosk model is downloadable, cacheable and capable of producing non-silent audio. The feature is not yet production-polished because the document main thread can freeze for roughly 32–36 seconds, pause/resume does not preserve the exact spoken position, rapid clicks race, page lifecycle cleanup is missing, Vosk progress is frozen, one mobile notice blocks PLAY, and pronunciation overrides do not fully implement the stated priority contract.

Overall current quality assessment: **functionally real, operationally incomplete**. The principal problem is no longer “does Vosk work?” but “can it work without freezing and replaying text?”

## Verified working

### Real model and audio

A cold Chromium run downloaded the production model, initialized ONNX and produced:

- WAV size: `466,988` bytes;
- duration: `10.588299 s`;
- RMS / peak: `2763.52 / 24017`;
- media playback requested successfully.

A second run reused IndexedDB:

- model network requests: `0`;
- `cache-hit` status observed;
- generated the same duration and size;
- RMS / peak: `2796.92 / 24128`.

Therefore model acquisition, cache reuse and actual non-silent synthesis are confirmed.

### Status and geometry contracts

Passed in Chromium and WebKit:

- first status paint;
- disabled / opt-out state;
- retry and dependency failure;
- Save-Data handling;
- cache-hit / ready state;
- desktop geometry;
- mobile 390 px;
- standalone 320 px;
- transformed containing block geometry.

### Speech projection

The dedicated nested `<li><p>` case was checked and passed. No duplicate-reading defect was reproduced for that structure.

## Confirmed defects

### TTS-P0-01 — main-thread freeze during model preparation

Measured with a 25 ms document heartbeat:

| Path | Total phase | Maximum document-thread gap |
|---|---:|---:|
| cold load / session preparation | `53.91 s` | **`36.52 s`** |
| cached load / session preparation | `38.26 s` | **`35.95 s`** |

The cached path made zero model requests and still froze for almost 36 seconds. Network and synchronous unzip are therefore not the sole cause. ONNX session creation also blocks the document thread.

Severity: **P0** for perceived availability and mobile reliability.

Pass gate: no document heartbeat gap above `500 ms` on the cached path; a stricter target should follow after worker migration.

### TTS-P0-02 — main-thread freeze during synthesis

For a generated 10.59-second sample:

| Path | Synthesis elapsed | Maximum document-thread gap |
|---|---:|---:|
| cold-loaded session | `32.01 s` | **`31.99 s`** |
| cached-loaded session | `31.95 s` | **`31.94 s`** |

The page is effectively non-responsive for the whole generation phase.

Severity: **P0**.

Required direction: worker/proxy ORT execution, worker-side preparation/inference, message-based cancellation/progress, and UI-thread ownership limited to state and audio playback.

### TTS-P1-01 — rapid PLAY toggle race

Two clicks in the same task ended in:

```json
{"state":"playing","speaks":1,"cancels":2}
```

Expected state after two toggles: `paused` or a deterministically cancelled `idle`, not `playing`.

Root cause class: asynchronous start without an explicit `starting` state and operation token.

### TTS-P1-02 — pause/resume replays the active chunk

The controller cancels the active utterance/audio and restarts the full current chunk. Web Speech boundary events currently drive visual progress but are not persisted as a resumable character offset.

User impact: repeated words or sentences after every pause.

### TTS-P1-03 — speed change replays the active chunk

Changing the TTS rate cancels and restarts the current chunk from its beginning rather than from the last spoken boundary.

### TTS-P1-04 — pagehide / BFCache cleanup missing

A `pagehide` transition did not cancel active speech. This reproduced across the production route crawl and can leave stale playback/state when navigating or restoring from BFCache.

### TTS-P1-05 — Vosk progress is frozen

The Vosk engine exposes end/error but no live progress callback. The active chunk progress ring remains unchanged during generation/playback.

### TTS-P1-06 — mobile notice intercepts PLAY

On `/baptisty-rossii/` at `390×844`, the visible disabled-state notice intercepted pointer events over the PLAY control. Playwright repeatedly reported `.gb-tts-download-notice__meta` as the hit target.

Required direction: safe placement relative to the fixed control cluster and/or pointer-event rules that preserve notice actions without blocking PLAY.

### TTS-P1-07 — route-specific no-start

On `/baptisty-rossii/spravochnik/`, Web Speech did not start within five seconds on either desktop or mobile in the production-like crawl.

This is not classified as a Vosk-model failure because the test fixture used the system speech path. It needs a route-specific trace of text projection, owner selection and synchronous click-handler cost.

### TTS-P2-01 — no cross-tab acquisition/session lock

No `navigator.locks` or equivalent BroadcastChannel ownership protocol is present. Two tabs can duplicate the ~280 MB acquisition and expensive initialization.

### TTS-P2-02 — manual pronunciation cannot override a model-known word

The intended priority is manual terms first, but the current custom-stress injection returns the original word when the model dictionary already contains it. A manual correction therefore cannot override an existing but wrong model pronunciation.

Required ordering:

1. explicit manual override;
2. stress-marker lookup;
3. model dictionary;
4. fallback/G2P;
5. unresolved/ambiguous report.

### TTS-P2-03 — stress coverage is not proved at corpus level

The current scanner identifies selected words absent from the stress marker, but it does not establish:

- which source supplied every spoken word;
- whether a word is ambiguous in context;
- whether a model-known pronunciation is correct;
- whether names and abbreviations pass golden audio/text cases.

The current manual list has 159 entries. Ten names remain marked low-confidence: `риппон`, `оуэн`, `кальвейт`, `деляков`, `унгер`, `уильям`, `мастерс`, `солтерс`, `винса`, `прицкау`. `доктора` remains intentionally context-dependent.

### TTS-P2-04 — pronunciation assets do not trigger the dedicated workflow

The dedicated TTS workflow path filters omit:

- `js/vosk-tts-core.js`;
- `js/vosk-stress-lookup.js`;
- `js/vosk-custom-terms.json`;
- `js/vosk-stress-marker.bin`.

A pronunciation regression can therefore bypass the dedicated browser matrix.

### TTS-P3-01 — dual-owner architecture remains

The legacy `site.js` Web Speech owner and the PremiumControls/Vosk owner coexist. Current crawled production routes resolved to `window.__gbCluster`, and the legacy owner suppresses itself when cluster controls exist, but issue #61 should remain the canonical convergence owner until one state machine and route owner are guaranteed.

## Route matrix

Production-like build output: 83 Astro pages plus copied legacy assets.

TTS crawler:

- candidate routes: `56`;
- viewport checks: `112`;
- desktop: `1440×900`;
- mobile: `390×844`;
- pages without visible PLAY: `0`;
- `pagehide-not-cancelled`: `109`;
- route-specific failures: `3` (two no-start checks on the same reference page, one mobile notice interception).

The crawler recorded console errors in 78 checks. Inspection showed they were overwhelmingly localhost-CSP blocks for absolute production icon and OG image URLs. No uncaught page exceptions were recorded, so these console entries are not promoted as TTS defects.

## Recommended correction lanes

### Lane A — P0 worker migration

- move model unzip/preparation and ONNX inference away from the document main thread;
- evaluate `ort.env.wasm.proxy = true` where compatible;
- preserve CSP `worker-src 'self' blob:`;
- add explicit progress/cancel messages;
- keep real model, non-silent WAV and cache assertions blocking;
- add heartbeat gate for cold and cached paths.

### Lane B — playback finite state machine

Introduce one state model:

`idle → starting → playing ↔ paused → stopping → idle`, plus `error`.

Required invariants:

- one operation token per start/resume;
- stale `onend`/`onerror` ignored;
- exact character offset persisted;
- rate changes resume from the offset;
- no duplicate current chunk;
- pagehide/visibility cleanup;
- deterministic repeated clicks.

### Lane C — mobile notice interaction

- test all notice states while PLAY is visible;
- 320/390 px clickability gate;
- transformed containing block gate;
- overlay must not intercept cluster controls.

### Lane D — pronunciation

- fix manual override priority;
- create corpus coverage report with reason codes;
- golden terms for names, abbreviations and ambiguous words;
- trigger TTS CI on every pronunciation asset.

### Lane E — cross-tab ownership

- one model acquisition/session-preparation owner;
- follower tabs receive progress and ready/error state;
- explicit cancel/retry semantics;
- verify only one model network acquisition across two contexts.

## Acceptance criteria for “10/10”

The feature should not be called complete until all are true:

- real model generates non-silent audio cold and cached;
- cached run performs no model network request;
- no main-thread gap above the agreed threshold;
- PLAY is deterministic under rapid clicking;
- pause/resume and rate changes continue from the last spoken position;
- progress advances for Web Speech and Vosk;
- speech stops cleanly on navigation/pagehide;
- PLAY remains clickable under every mobile notice state;
- all TTS production routes pass desktop/mobile crawl;
- manual pronunciation overrides model entries;
- corpus coverage and low-confidence terms are reported in CI;
- two tabs do not duplicate the model acquisition/initialization;
- all diagnostic probes from product PR #875 are promoted to blocking regression gates.

## Current disposition

- Audit: **complete for current head**.
- Product corrections: **not yet applied**.
- Canonical product issue: remains open.
- Audit PR #875: should remain draft until its diagnostic tests are either merged as evidence infrastructure or split into the corresponding fix lanes.