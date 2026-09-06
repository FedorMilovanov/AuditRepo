# Current-head reverify — TTS SharedWorker client lifecycle closure

**Project:** `gb-is-my-strength`  
**Date:** 2026-09-07  
**Audit finding:** `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`  
**Current Product main:** `5938394cf4f308f441396c87a3ab5250483a539d`  
**AuditRepo rollback point:** `fdc2a9da001b22a3b9dfaf5780c606fda4ff2176`

---

## 1. Scope and disposition

This reverify checks only the complete causal boundary of active SYSTEM row `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` against current Product `main`.

Disposition: **FIXED-CURRENT / closed-by-system-fix**.

The active row required an authoritative SharedWorker client-retirement transaction tied to document/MessagePort lifetime, with model-load ownership and speech work retired together rather than relying only on heartbeat expiry. It also required browser evidence for disconnect during live work, last-live load cancellation and abandoned synthesis suppression.

Product #1831 closes that boundary. No independent residue remains under this causal owner.

---

## 2. Product repair

Merged Product PR #1831, final head `ebd987532e03fff09c2a421a241983d87d305626`, merge/current Product `main` `5938394cf4f308f441396c87a3ab5250483a539d`.

The bounded Product delta is exactly eight files:

- `.github/workflows/tts-sharedworker-client-lifecycle.yml`;
- `js/vosk-tts-engine.js`;
- `js/vosk-tts-worker.js`;
- `scripts/tts-sharedworker-client-lifecycle-browser-test.js`;
- `scripts/tts-sharedworker-client-lifecycle-contract.js`;
- `src/components/reader-platform/ReaderActionsRuntime.astro`;
- `src/lib/asset-version.js`;
- `src/runtime/reader-tts-lifecycle.js`.

The repair establishes these owner semantics:

1. the page engine exposes an explicit retirement path and sends a `disconnect` transaction for its SharedWorker client;
2. cross-document navigation attempts ACK-backed retirement through the Navigation API, while `pagehide` remains the final document-lifetime fallback without adding BFCache-hostile `beforeunload`;
3. the worker retires the exact client entry, removes its model-load membership, marks every speech job owned by that client cancelled and closes that MessagePort;
4. a shared model load is aborted only when the retiring client was the last live load owner;
5. queued work owned by a retired client becomes a no-op;
6. in-flight ONNX execution is not falsely claimed abortable mid-call, but cancellation checkpoints suppress its result before terminal audio can be delivered;
7. surviving clients remain registered and usable.

---

## 3. Executed lifecycle evidence

### Actual worker contract

Product workflow `TTS SharedWorker Client Lifecycle` run `34063250793` completed successfully for the #1831 candidate associated with final Product head `ebd987532e03fff09c2a421a241983d87d305626` against stable base `8345873f7c9969840ed485937e26401bf5c5649a`.

Its actual-worker contract executed `js/vosk-tts-worker.js` and reported:

- load retirement: `aborts = 1`, `clients = 0`, `loadClients = 0` after the last waiter retires;
- the first of two live load owners can retire without aborting the shared load;
- queued speech retirement: `queuedJobs = 2`, `survivorPreserved = true`, `terminalAfterRetire = 0`;
- in-flight inference retirement: `inFlightSuppressed = true`, `terminalAfterRetire = 0`.

This directly falsifies the two historical failure modes: a disappeared client remaining a model-load waiter, and abandoned queued/in-flight synthesis producing terminal output after its owner is gone.

### Chromium SharedWorker witness

The same workflow executed a real Chromium SharedWorker lifecycle witness and reported:

- Navigation API and `NavigateEvent.intercept` available in the witness;
- three same-origin pages reached `workerMode = shared` and `ready = true` while the worker script was requested exactly once;
- direct retirement received an ACK tied to a concrete client and MessagePort generation;
- cross-document navigation retired the departing document client;
- a surviving page synthesized successfully after the peer retired;
- history restoration reconnected the peer, and a second departure retired a distinct MessagePort generation;
- the surviving owner synthesized successfully again after that second retirement;
- `retiredConnectionCount = 3` and `workerRequests = 1`.

The browser witness therefore covers authoritative document retirement, peer isolation and reconnect/retire generation semantics rather than inferring lifecycle correctness from source shape alone.

The dedicated workflow checked out GitHub's PR merge candidate for #1831 (`24d5adcd45d64a7531c23c5a0018e268a2e66a55`, merging final head `ebd98753...` into stable base `8345873f...`). The broader final candidate run set also included workflows explicitly proving the raw PR head where configured.

---

## 4. Final candidate gates

Before merge, Product `main` remained `8345873f7c9969840ed485937e26401bf5c5649a`, PR head remained `ebd987532e03fff09c2a421a241983d87d305626`, and the PR stayed an isolated eight-file delta.

Terminal successful head-associated gates included:

- `TTS SharedWorker Client Lifecycle` run `34063250793`;
- `TTS Reader Polish` run `34063250974`;
- `Reader Controls Accessibility` run `34063250760`;
- `Runtime Interactive Audit` run `34063250809`;
- `Route Registry Validators` run `34063250790`;
- `Deploy Candidate Contract` run `34063250754`;
- `Visual Parity Guard — pixel-diff` run `34063250835`;
- `Shared Files Guard` run `34063250772`;
- `Site Sections Menu Contract` run `34063250832`, attempt 2 — success after an attempt-1 animation scheduling tail; its workflow explicitly checked out and proved final raw head `ebd987532e03fff09c2a421a241983d87d305626`, then passed production-like build, the 1152-case Chromium/WebKit behavior contract and visual geometry contract.

The Site Sections attempt-1 failure was not waived: the failed job was rerun on the same head, and attempt 2 reached terminal success including the exact geometry step that had previously observed the transient exit-animation tail.

PR #1831 was then moved from Draft to Ready and merged with `expected_head_sha = ebd987532e03fff09c2a421a241983d87d305626`, producing verified merge `5938394cf4f308f441396c87a3ab5250483a539d` with parents `8345873f7c9969840ed485937e26401bf5c5649a` and `ebd987532e03fff09c2a421a241983d87d305626`.

---

## 5. Closure-boundary check

The MASTER closure boundary required:

1. an authoritative disconnect/close owner for normal client/document lifetime end;
2. retirement of load membership for that exact client;
3. retirement of all queued/in-flight speech work owned by that client;
4. cancellation of an orphaned model load only when no live waiter remains;
5. browser proof that abandoned synthesis cannot outlive its owner while surviving peers continue correctly.

Current Product satisfies all five. The permanent worker contract covers load-owner cardinality, queued work and in-flight suppression; the Chromium witness covers real SharedWorker document retirement, surviving-peer behavior and distinct reconnect generations.

---

## 6. Boundaries preserved

- No dependency, Baptist/content, research or unrelated runtime lane is absorbed into this closure.
- The historical #1826 branch/PR is provenance only; #1831 is the canonical merged repair.
- No inference is made about the remaining six SYSTEM lanes.
- `RODOSLOVIYE-OG-IMAGE` remains independently open.
- Product branch-protection/ruleset governance is not represented as solved by this repair.
- This AuditRepo reconciliation makes no Product mutation.

---

## 7. Terminal status

`TTS-SHAREDWORKER-CLIENT-LIFECYCLE` has no current independent residue at Product `main` `5938394cf4f308f441396c87a3ab5250483a539d` and should be removed from active MASTER arithmetic.
