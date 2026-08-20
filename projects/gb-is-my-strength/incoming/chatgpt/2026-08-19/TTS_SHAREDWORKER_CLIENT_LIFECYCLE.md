# TTS-SHAREDWORKER-CLIENT-LIFECYCLE

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product resource/cancellation lifecycle defect + browser-contract gap
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none
- Open competing Product TTS PR found at recording time: none
- Suggested themes: `ST-RUNTIME-OWNERSHIP`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## Finding

The enhanced Vosk TTS path correctly shares one large model load across tabs through a `SharedWorker` and correctly prevents one **live** client from cancelling a load that another live client still awaits. However, SharedWorker client membership is not retired on the standard `MessagePort` close lifecycle.

That leaves a stale client key in `state.loadClients` when a tab/page goes away during model loading. A later cancellation by the last **live** waiter can therefore fail to abort the shared model download because the stale disconnected waiter still keeps `loadClients.size > 0`.

The UI itself tells users the enhanced model is approximately 280 MB and gives a `Не загружать` / cancel action. The defect is therefore not only bookkeeping: the user's final live cancellation can stop local waiting/UI while the shared network transfer continues.

## Current client-side lifecycle

`js/vosk-tts-engine.js` prefers SharedWorker and represents the connected worker through a channel whose shared-mode teardown is essentially:

```js
terminate: function () {
  if (mode === 'shared') {
    try { port.close(); } catch (_) {}
    return;
  }
  ...
}
```

The engine does have an explicit model-load cancellation path. `cancelLoading()` sends `cancel-load` to the worker and then terminates the current channel.

But the ordinary page lifecycle is not the same operation. Current reader TTS pagehide/beforeunload handling stops active speech; it does not send a model-load disconnect/cancel membership message for a page that merely disappears while still awaiting shared model initialization.

Thus a SharedWorker port can be closed because the document/page is destroyed without the worker receiving the protocol-level `cancel-load` message that removes that client's load membership.

## Current SharedWorker membership model

`js/vosk-tts-worker.js` owns two related sets:

```text
clients: Map<clientKey, port state>
loadClients: Set<clientKey>
```

When a client asks to ensure/load the model, its key is added to `loadClients`. When the request settles normally, the key is removed.

The worker's explicit `cancel-load` handling removes only the sending client and aborts the global model fetch only when no waiters remain:

```text
loadClients.delete(myKey)
if (loadClients.size === 0 && loadController) loadController.abort()
```

That is the correct multi-client rule **if membership reflects live clients**.

### Missing disconnect owner

`attachPort(port)` currently installs:

```text
port.onmessage
port.onmessageerror
```

and calls `dropPort(port)` only from `messageerror` or periodic stale-client pruning.

It does **not** install a `close` event handler for the MessagePort, and the client does not send an explicit `disconnect` message before normal SharedWorker port teardown.

`dropPort()` is the function that would remove both:

```text
state.loadClients.delete(key)
clients.delete(key)
```

but the standard close lifecycle does not currently reach it.

## Platform lifecycle boundary

The HTML MessagePort lifecycle defines closing/disentangling a port separately from message deserialization errors. Closing one endpoint (including `MessagePort.close()` / document destruction) produces the port close lifecycle; `messageerror` is not the normal disconnect signal.

Current worker code handles `messageerror` but not `close`.

Therefore the worker cannot rely on `onmessageerror` as the primary membership-retirement path for a normally closed page/port.

The existing timeout/prune logic is only a delayed fallback:

```text
CLIENT_TTL_MS = 120000
prune interval = 60000 ms
```

A disconnected load waiter may therefore remain counted for roughly minutes, depending on lastSeen/prune timing.

## Concrete failure sequence

A current protocol-level sequence is:

```text
Tab A connects → ensure model
Tab B connects → ensure same model
loadClients = {A, B}
shared ~280 MB download is in flight

Tab A navigates away / closes
→ its SharedWorker port is closed
→ worker has no close handler / disconnect message
→ stale A remains in loadClients

Tab B is now the last live waiter
Tab B presses “Не загружать”
→ worker receives cancel-load from B
→ removes B
→ loadClients still contains stale A
→ loadClients.size !== 0
→ shared AbortController is NOT aborted

B closes its own local channel / rejects local waiting state
UI reports cancellation
but underlying shared fetch can continue until completion or stale pruning
```

This does **not** mean one live tab can cancel another live tab today. The current Set-based rule correctly prevents that. The defect is stale membership after a client ceases to exist.

## Why current TTS tests can remain green

Current `scripts/tts-reader-multitab-lock-browser-test.js` provides useful SharedWorker coverage:

- first page warms the SharedWorker;
- second page attaches to the already-ready SharedWorker;
- second page can synthesize/play audio;
- navigation reuses the ready SharedWorker while another page is active;
- only one SharedWorker script instance is expected;
- DedicatedWorker fallback is verified.

That test exercises **ready-state persistence/reuse**.

It does not exercise:

```text
model load still in progress
+ two load waiters
+ one waiter disappears without explicit cancel-load
+ last live waiter requests cancellation
```

Current source/status contracts also assert that SharedWorker/loadClients/cancel-load machinery exists, but no current contract requires:

- handling MessagePort close/disconnect;
- removing a disconnected client from `loadClients` immediately;
- aborting the shared fetch when the final *live* waiter cancels;
- proving no model-ready completion occurs after the final live cancellation.

So the existing tests are compatible with this lifecycle gap.

## User-visible / resource boundary

The enhanced voice UI explicitly presents the load as approximately **280 MB** and exposes a cancellation action (`Не загружать`).

A correctness contract for that button is stronger than “this tab stops waiting.” When no live client still wants the model, the shared download should be aborted promptly rather than kept alive by a client that no longer exists.

This is especially relevant on metered/mobile connections — the same UI already has `save-data`, manual-load and opt-out states, showing that network-consent semantics are intentional Product behavior.

## Durable closure boundary

Do not solve this by lowering the TTL alone. TTL pruning is useful as crash/leak fallback, not as primary correctness for a normal close/navigation event.

A durable repair should:

1. Give SharedWorker client lifetime an explicit owner.
2. On standard MessagePort close, immediately call the equivalent of `dropPort(port)`.
3. Prefer an explicit client `disconnect` handshake before `port.close()` / page teardown as an additional deterministic path, while retaining port-close handling for abrupt destruction.
4. After any client retirement, if a model load is in progress and `loadClients` contains no live waiters, abort the shared `AbortController`.
5. Keep the current behavior that one live waiter cannot cancel another live waiter.
6. Retain TTL pruning as a last-resort stale-client cleanup, not as normal cancellation semantics.
7. Add a browser contract with a deliberately delayed fake model fetch:
   - page A starts model load;
   - page B starts/join same load;
   - destroy/navigate A without pressing cancel;
   - verify worker immediately retires A from load membership;
   - B presses cancel;
   - verify the fake model request is aborted and no later ready event appears;
   - repeat with a third live waiter and prove B cancellation does **not** abort while that third waiter remains;
   - cover navigation/pagehide and explicit engine teardown.
8. Distinguish speech-job cancellation (already id/client scoped) from model-load client membership; do not regress the existing synthesis isolation.

## What this report does not claim

- No claim that two live tabs currently cancel one another; the current Set logic correctly avoids that.
- No claim that late synthesized audio from a cancelled speech request is played; current speak ids/cancelled handles already reject that path.
- No claim that the model always downloads 280 MB on every session; IndexedDB cache can make later loads local.
- No claim of a captured production network incident; this is a current lifecycle/protocol defect proved from the standard disconnect boundary plus exact source ownership.
- No Product repair is opened by this AuditRepo evidence file.
