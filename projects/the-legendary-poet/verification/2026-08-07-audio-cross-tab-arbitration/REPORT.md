# TLP-AUDIO-001 — cross-tab audio arbitration

Date: 2026-08-07  
Product: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #356  
Current source anchor: `67d614bc186b52c408ad6cef4c84cf57d4e78a45`  
Disposition: **VERIFIED-CURRENT / P3 / repair-ready after this verification merges**

## Scope

One concurrency root cause in the persistent global audio player. This report does not claim ordinary single-tab playback, Media Session, persistence, sequential handoff or audio assets are broken.

## Current implementation evidence

`src/components/music/AudioPlayerProvider.tsx` defines a cross-tab playback claim with:

- `type: 'playing'`;
- `instanceId`;
- `trackId`;
- `timestamp`.

Every real audio `play` event calls `announcePlayback(track.id)`, which posts the claim through BroadcastChannel when available and also writes the same claim to the storage coordination key for the fallback path.

The current receiver is equivalent to:

```ts
const handleRemotePlayback = (message: CoordinationMessage) => {
  if (message.instanceId === instanceIdRef.current || audio.paused) return;
  audio.pause();
};
```

The message validator requires a finite timestamp, but receiver arbitration does not compare timestamps or any other ordering field.

Historical source intent is explicit: commit `43c65411a3fd695e65861f4939b891b5499c1d26` says the global audio hardening wave would “coordinate tabs” and introduced this claim structure and transports.

## Deterministic failure model

Let A and B be two open Product tabs with separate persistent audio engines.

Initial state:

- A paused;
- B paused.

Race:

1. A enters `play` and emits claim A.
2. Before claim A reaches B, B enters `play` and emits claim B.
3. Claim B reaches A while A is playing. Current rule pauses A.
4. Claim A reaches B while B is playing. Current rule pauses B.
5. Final state: A paused, B paused.

Thus the current rule enforces “pause on any remote active claim” but does not choose one winner when two valid claims exist concurrently. It can collapse the singleton-player goal to zero players.

This is not dependent on malformed input. Both messages are valid claims emitted by Product code. It also does not require message reordering from one sender: the competing claims originate from different tabs and there is no application-level total order.

## Why the timestamp matters

The original and current protocol already carries `timestamp` and validates that it is finite. Leaving it unused means the protocol carries ordering data but does not use it to decide which playing claim should survive.

Timestamp alone is not enough because equal-millisecond claims are possible. A repair needs a deterministic tie-break, such as `instanceId`, so every pair of valid claims has one winner.

## Current coverage gap

Current source validators protect adjacent but different contracts:

- `scripts/validate-music-runtime.ts`: catalog, ordering, filtering, related tracks;
- `scripts/validate-audio-session-store.ts`: migration, progress, volume, completion, reconciliation and moment links;
- `qa/manual-e2e.spec.mjs`: real single-tab master loading and persistence of the audio shell across route navigation;
- floating chrome/browser suites: geometry and persistent player UI.

No current witness creates two independent pages/tabs, starts playback in both before peer delivery, or asserts exactly one deterministic survivor after competing claims.

## Severity

P3.

Reasoning:

- user-visible when triggered: both attempted players can stop instead of the later/newer one continuing;
- persistent data is not corrupted;
- ordinary single-tab and sequential cross-tab behavior remain functional;
- trigger requires a narrow concurrency race across two tabs.

## Repair boundary

One Product repair lane for #356 may change cross-tab claim arbitration and its focused validation only.

Required invariants:

1. one deterministic total order for playback claims;
2. newer claim beats older claim;
3. equal timestamps have stable tie-break;
4. local audio pauses only when remote claim wins;
5. stale delayed claim cannot pause a newer local claim;
6. duplicate winning claim is idempotent;
7. self claim is ignored;
8. BroadcastChannel and storage fallback share the same comparison rule;
9. sequential later-tab handoff still works;
10. no sleeps/debounces as correctness mechanism.

Prefer extracting a pure claim-comparison/arbitration helper so the race can be exhaustively tested without fabricating HTMLMediaElement timing. Browser evidence should still prove that the provider applies the shared rule in real pages and that ordinary audio navigation remains green.

## Acceptance evidence

Before Product merge:

- deterministic state-machine/unit validator covers sequential, simultaneous, timestamp-tie, stale, duplicate and self cases;
- if practical, a two-page Playwright witness proves exactly one survivor under a coordinated simultaneous-start contour;
- existing audio-session and music-runtime validators green;
- full `npm run check` green;
- production build and budgets green;
- real audio playback and shell navigation QA green;
- Manual Browser QA green on the exact merge-ready head.

## Governance

- no architecture lane is required; this is a bounded runtime concurrency repair inside the existing persistent audio owner;
- no editorial/music-catalog/asset work belongs in the repair;
- after Product #356 merges and resulting Product main is reverified, create durable closure evidence, remove `TLP-AUDIO-001` from the active matrix and return the work queue to fresh current-head verification.
