# TTS-ENGINE-SCRIPT-FAILURE-STATE

## Classification

- Parent work unit: `LAZY-RUNTIME-LOADER-FAILURE-STATE`
- Companion manifestation: `SEARCH_LAZY_LOADER_FAILURE_STATE.md`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Signal class: current Product resilience/state-machine defect + browser-contract gap
- Product mutation: none
- MASTER mutation: none
- Open competing Product TTS repair PR found at recording time: none

## Finding

The canonical Reader TTS runtime can create a permanently pending Vosk script promise after the already-present Vosk `<script>` element has completed with an error.

This is a different implementation than the MobileChrome Search deadlock, but the same systemic failure-state problem: a lazy/runtime loader has no reliable transition from **failed terminal state** back to **retryable state**.

## Current composition

`ReaderActionsRuntime.astro` owns canonical Reader TTS. It emits the current revisioned Vosk engine script and then mounts the reader runtime modules:

```astro
const voskEngineSrc = assetUrl('js/vosk-tts-engine.js');
...
<script is:inline defer src={voskEngineSrc}></script>
<script>
  ...
  import '../../runtime/reader-tts.js';
  ...
</script>
```

So `reader-tts.js` normally sees an existing `<script>` element for `vosk-tts-engine.js` rather than creating the element itself.

## Current loader state machine

`src/runtime/reader-tts.js` implements:

```js
function ensureVoskScript() {
  if (window.VoskTTSEngine) return Promise.resolve(window.VoskTTSEngine);
  if (state.engineScriptPromise) return state.engineScriptPromise;
  state.engineScriptPromise = new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts)
      .find((script) => /vosk-tts-engine\.js/i.test(script.src || ''));
    const script = existing || document.createElement('script');
    const done = () => window.VoskTTSEngine
      ? resolve(window.VoskTTSEngine)
      : reject(new Error('Vosk engine did not initialize'));

    if (existing) {
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', () => reject(new Error('Vosk engine script failed')), { once: true });
    } else {
      script.src = ENGINE_SRC;
      script.defer = true;
      script.addEventListener('load', done, { once: true });
      script.addEventListener('error', () => reject(new Error('Vosk engine script failed')), { once: true });
      document.head.appendChild(script);
    }
  }).finally(() => { state.engineScriptPromise = null; });
  return state.engineScriptPromise;
}
```

The `existing` branch assumes that the existing script's load/error lifecycle has **not already reached a terminal event**.

That assumption is not guaranteed at the time this function is invoked.

## Concrete current failure sequence

A directly reachable sequence is:

```text
1. ReaderActionsRuntime inserts <script defer src="...vosk-tts-engine.js?v=...">.
2. Its network request fails.
3. The script element fires its one error event.
4. No GBReaderTTS request has needed ensureVoskScript() yet.
5. User later presses Listen / enhanced-voice Retry.
6. ensureVoskScript():
     window.VoskTTSEngine is absent
     engineScriptPromise is null
     finds the already-existing failed <script>
7. It now adds load/error listeners to that element.
8. The terminal error event already happened; no new fetch is started and no new event is required to occur.
9. engineScriptPromise remains pending indefinitely.
10. Because its `.finally()` never runs, engineScriptPromise is never cleared.
```

This is precisely the general event-listener race the HTML Standard warns about: attaching handlers in a later script can miss a load/error event that has already fired. A failed external script fires `error`; registering a listener later does not replay that previous event.

The defect does not depend on whether the TTS module itself executed before or after the original script request completed. The decisive timing is **the later call to `ensureVoskScript()`**, which normally occurs on playback/warm-up/retry rather than at tag creation.

## Retry is captured by the same pending promise

`warmVosk()` begins:

```js
if (state.warmPromise) return state.warmPromise;
state.warmPromise = ensureVoskScript()
  ...
  .finally(() => { state.warmPromise = null; });
```

If `ensureVoskScript()` never settles, `warmPromise` never settles either.

The explicit retry path cannot recover:

```js
function retryVosk(event) {
  if (event?.detail) event.detail.handled = true;
  void warmVosk({ retry: true });
}
```

A retry simply gets the same existing `state.warmPromise` and starts no new script request.

So the UI can expose a retry action while the runtime state machine has no failed→retry transition for this script-resource failure mode.

## User-visible boundary

### Browsers with Web Speech

`selectEngine()` chooses Web Speech when available and starts Vosk warm-up in the background:

```js
if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
  void warmVosk();
  return 'webspeech';
}
```

Therefore ordinary playback can continue using the system voice. The user-visible defect is narrower: enhanced-voice recovery/retry stays stuck until reload even after connectivity recovers.

### Browsers without Web Speech

When Web Speech is unavailable, `selectEngine()` returns `vosk`. `speakVosk()` sets phase `starting` and waits for `warmVosk().then(...)`.

If the promise is permanently pending, the playback state can remain `starting` rather than reaching the normal fail/error fallback.

This report does not claim every supported browser lacks Web Speech; it distinguishes the two impact boundaries.

## Existing contract gap

Current TTS tests cover substantial behavior:

- Web Speech play/pause/resume/rate changes;
- ready Vosk synthesis;
- model loading/cancellation/status;
- SharedWorker reuse/multi-tab behavior;
- real-model and route crawls.

A current source search found no browser/contract scenario that:

```text
pre-inserts the canonical Vosk script
forces that script request to fail
waits until its error event is already terminal
then invokes GBReaderTTS warm/retry
then recovers the network and proves a second script request succeeds
```

The existing engine lifecycle tests exercise failures **inside** a loaded engine/model pipeline, not this outer script-element resource lifecycle.

## Shared systemic root with Search

Search manifestation:

```text
request fails
loading=false
bootRequested remains true
next request is suppressed forever
```

TTS manifestation:

```text
preexisting request fails
terminal event is missed by later listener
engineScriptPromise/warmPromise remain pending
retry returns the same pending state forever
```

Both have the same architectural invariant violation:

```text
failed resource acquisition
must transition to a state from which a later explicit retry can create/observe a fresh acquisition
```

Neither implementation currently proves that invariant for its failure path.

The work unit should therefore be named `LAZY-RUNTIME-LOADER-FAILURE-STATE`, with Search and TTS as separate manifestations, rather than opening two unrelated repair rows.

## Durable closure boundary

A systemic loader repair should prove:

1. Resource state is explicit: idle/loading/ready/failed rather than inferred from sticky booleans or existence of a DOM element.
2. An existing script element is not treated as a pending load merely because it exists.
3. Already-failed script tags are detected/retired/replaced or a separate loader-owned terminal marker is used.
4. A failed attempt settles all promises; no `engineScriptPromise`/`warmPromise` remains pending forever.
5. Explicit retry after failure creates or observes a **new** acquisition and can reach ready.
6. Concurrent calls during one in-flight acquisition still deduplicate to one request.
7. Browser contract uses a controlled server:
   - first Vosk script request returns failure;
   - wait until the script error lifecycle is complete;
   - invoke Reader TTS/warm-up/retry;
   - verify the call settles rather than hangs;
   - recover server;
   - retry;
   - verify a new request occurs and Vosk becomes ready;
   - repeat with Web Speech disabled and assert phase leaves `starting` on failure.
8. Search's MobileChrome failure fixture should share the same generic loader invariant where practical.

## What this report does not claim

- No claim that the current revisioned Vosk URL itself is wrong; canonical `assetUrl()` is current.
- No claim that normal Web Speech playback is broken when the Vosk script request fails.
- No claim that an event listener registered before the script's error event would miss it; the defect is specifically the later `existing` branch after terminal failure.
- No Product repair is opened by this evidence-only file.