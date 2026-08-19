# TTS SharedWorker speech-job disconnect witness

## Disposition

Detailed second manifestation under existing work unit `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`. This is **not** an eighth work unit.

Current Product boundary:
`01894214765d7ab6e51a7eea1fb7f239c6591af8`

## Finding

The missing SharedWorker client-lifecycle owner affects not only model-load membership. Current `dropPort()` does not cancel speech jobs belonging to the disappearing client, and SharedWorker synthesis is serialized through one global promise queue.

So an abandoned client job can continue expensive inference after its port disappears and can delay subsequent live clients, even though its output can no longer be delivered meaningfully.

## Current disconnect cleanup is incomplete even if it were called promptly

Current worker cleanup is:

```js
function dropPort(port) {
  var key = portKey(port);
  state.loadClients.delete(key);
  clients.delete(key);
}
```

It does **not** enumerate or cancel synthesis jobs owned by that `clientKey`.

Current `attachPort()` calls `dropPort()` only on `messageerror`; the normal port-close lifecycle is already missing as described in the primary work-unit file.

Therefore there are two layers:

1. normal disconnect currently does not reach `dropPort()`;
2. even if it did, `dropPort()` currently retires membership but not queued/running speech work.

## Speech job identity exists, but ownership is not used for disconnect cleanup

Speech cancellation is otherwise correctly namespaced:

```js
messageJobKey(port, message)
  = clientKey + ':' + message.clientId + ':' + message.id
```

`synthChunk()` and session execution repeatedly check:

```js
state.cancelledJobs.has(jobKey)
```

and explicit `cancel` adds the precise job key.

So the worker already has enough identity to cancel one client's jobs without cancelling another client's jobs.

The missing piece is maintaining/retiring the set of jobs owned by a disconnected `clientKey`.

## Global synthesis queue makes stale work affect surviving clients

Current handling is serialized through one shared queue:

```js
if (message.type === 'speak') {
  var jobKey = messageJobKey(port, message);
  state.cancelledJobs.delete(jobKey);
  state.synthQueue = state.synthQueue.catch(function () {}).then(function () {
    return synthesize(message, port);
  });
  return;
}
```

A synthesis job for a dead port therefore still occupies the global queue unless it received an explicit job `cancel` before teardown.

Current `send()` deliberately swallows postMessage failure:

```js
try { port.postMessage(payload, transfer || []); } catch (_) {}
```

Thus after expensive inference completes, inability to deliver `synth-progress`, `audio` or `synth-error` to the closed client does not cancel or surface the wasted job. The queue simply proceeds afterward.

## Concrete cross-tab consequence

A protocol sequence can be:

```text
Tab A sends long speak job A1
→ A1 begins / occupies state.synthQueue

Tab A disappears abruptly or its port closes before explicit cancel reaches worker
→ normal close is not handled
→ even future dropPort semantics currently have no job retirement

Tab B sends speak job B1
→ B1 is queued after A1

A1 continues ONNX/BERT/G2P work for a client that no longer exists
→ progress/audio postMessage is discarded or undeliverable
→ only after A1 settles can B1 begin
```

This is a SharedWorker-specific resource/fairness issue: stale client work can delay a live client because synthesis queue ownership is process-global while cancellation lifetime is client-message driven.

This report does **not** claim that ordinary `pagehide` always leaves a job alive. The Reader TTS owner attempts to stop active speech on page lifecycle and can send normal cancellation. The defect boundary is that the worker has no authoritative disconnect cleanup for abrupt/normal port lifetime and therefore cannot make speech-job lifetime depend solely on client lifetime.

## Why current multitab coverage misses it

Current multitab browser coverage focuses on:

- shared worker reuse after readiness;
- second-page playback;
- navigation preserving ready worker reuse;
- single SharedWorker script instance;
- DedicatedWorker fallback.

It does not queue a deliberately slow synthesis for client A, destroy A before completion, then measure whether client B starts promptly and whether A's job is marked cancelled.

## Durable closure extension

The primary work unit's disconnect repair should cover **both load and speech ownership**:

1. Track active/queued job keys per SharedWorker client key.
2. A standard port close / explicit disconnect immediately:
   - removes `loadClients` membership;
   - aborts shared model load if no live waiter remains;
   - marks every queued/running speech job owned by that client cancelled;
   - removes the client from `clients`.
3. Cancellation must remain client-scoped: disconnecting A cannot cancel B's job.
4. Add a delayed-synthesis multitab test:
   - A sends long job A1;
   - B sends B1 behind it;
   - destroy A without explicit speech cancel;
   - prove A1 is cancelled/short-circuited;
   - prove B1 is not cancelled and begins without waiting for full abandoned A1 inference;
   - prove no audio event for A1 is treated as deliverable.
5. Retain current explicit per-job cancel path as a normal control, but client lifetime becomes the final ownership boundary.

## Boundary

- No claim that cancelled job audio is currently played in a surviving tab; job keys/ports prevent cross-client delivery.
- No claim that every pagehide becomes abrupt; this is lifecycle fault containment for the cases where explicit cancel is absent/lost.
- No separate MASTER row is recommended; this is the same missing SharedWorker client-lifetime owner as the stale model-load waiter manifestation.
