# TLP-AUDIO-002 verification — cross-tab audio logical clock precision

Verification date: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #360  
Verified current Product head: `0712a1845d4133953750a32a9df598f6cbeb192e`  
Severity: P3  
Disposition: **VERIFIED-CURRENT / repair allowed only after this AuditRepo registration merges**

## Question

Does the cross-tab arbitration protocol introduced by Product #358 preserve its explicit invariant — a later local play must outrank an already-seen peer claim — for every peer timestamp that the current wire validator accepts?

## Current source evidence

On Product `main@0712a1845d4133953750a32a9df598f6cbeb192e`, `src/components/music/audioCoordination.ts` defines:

```ts
export interface PlaybackCoordinationClaim {
  type: 'playing';
  instanceId: string;
  trackId: string;
  timestamp: number;
}
```

The external claim boundary accepts the timestamp when:

```ts
Number.isFinite(claim.timestamp)
```

The per-tab logical advance is:

```ts
return Math.max(safeNow, safeLastSeen + 1);
```

The provider records every accepted peer timestamp into `coordinationClockRef` before deciding whether the local audio should yield, and the next real local `play` uses that clock to construct its next claim.

## Deterministic reproduction

JavaScript `number` is IEEE-754 binary64. Finiteness does not imply integer precision.

```js
const poisoned = 2 ** 53;
Number.isFinite(poisoned) === true;
Number.isSafeInteger(poisoned) === false;
poisoned + 1 === poisoned;
```

Therefore the current protocol admits a value for which its own advertised Lamport-style operation cannot advance.

State-machine reproduction:

1. Tab A owns a normal local playback claim and is playing.
2. A same-origin peer/storage message arrives with a valid shape, non-A `instanceId`, and `timestamp = 2 ** 53`.
3. `isPlaybackCoordinationClaim` accepts it because the timestamp is finite.
4. `coordinationClockRef` becomes `2 ** 53`; the remote claim is newer than the normal local claim, so A may pause.
5. The user explicitly starts playback in A again.
6. `nextPlaybackClaimTimestamp(2 ** 53, Date.now())` returns `2 ** 53`, not a greater value.
7. A's new claim therefore has the same timestamp as the already-seen peer claim. The comparator falls through to `instanceId` ordering.
8. If the peer instance id sorts after A, a delayed/duplicate copy of that already-seen peer claim pauses the later explicit local play again.

The final result violates the repair invariant of #358: recency has collapsed into identity ordering.

## Why this is a new root cause

`TLP-AUDIO-001` / Product #356 fixed the absence of a deterministic total order for simultaneous ordinary claims. That closure remains valid for the normal timestamp domain it tested.

This finding is independent:

- the total order exists;
- simultaneous ordinary starts still converge to one winner;
- the flaw is that the external numeric domain includes states for which the logical-clock advancement operation is not monotonic.

The closed #356 row is therefore not reopened.

## Current coverage gap

`scripts/validate-audio-coordination.ts` currently checks:

- newer/older normal integer ordering;
- equal-timestamp deterministic tie-break;
- simultaneous A/B state model;
- self/stale/duplicate behavior;
- same-millisecond advancement at small values;
- `NaN` rejection;
- empty ids.

It does not check:

- unsafe finite integers such as `2 ** 53`;
- fractional/negative numeric domain constraints;
- logical progress at the highest supported timestamp boundary.

`qa/audio-cross-tab.spec.mjs` proves normal BroadcastChannel and storage fallback A→B→A handoff, but does not inject a malformed finite storage claim and prove the player remains unpoisoned.

## Severity

P3.

The condition is an edge resilience/protocol-validation failure. It requires malformed/corrupt/out-of-domain same-origin coordination state rather than normal user timing. It can nevertheless break the one-active-player handoff invariant for the current document and is deterministic once such a claim is delivered. No data corruption, privilege escalation or security impact is asserted.

## Repair boundary

One bounded Product #360 lane may change only the audio coordination protocol and its focused regression witnesses.

Required properties:

1. reject external numeric claim state that cannot preserve ordering arithmetic;
2. later explicit local playback must remain logically newer than an already-seen valid peer claim at the supported numeric boundary;
3. ordinary #358 sequence-less claims should remain safely interpretable where practical;
4. simultaneous ordinary starts must still leave exactly one winner;
5. stale/duplicate/self behavior remains idempotent;
6. BroadcastChannel and storage fallback share one rule;
7. no sleeps/debounce as correctness;
8. no player UI, audio asset, catalog, editorial or unrelated persistence changes.

A clean design may keep a safe wall-clock timestamp for recency and add an explicit logical sequence for same/lower wall-clock advancement rather than repeatedly incrementing one IEEE-754 timestamp.

## Required witnesses before merge

- deterministic pure test for `2 ** 53` rejection / precision boundary;
- deterministic proof that a valid high timestamp followed by explicit local replay creates a logically newer claim without relying on `instanceId`;
- compatibility witness for ordinary legacy sequence-less claims if sequence is added;
- existing simultaneous/sequential/stale/self/duplicate cases retained;
- two-page Chromium storage witness that writes an unsafe finite claim from one page, proves the playing peer is not paused/poisoned, then performs an ordinary handoff successfully;
- full exact-head Product CI/build/budgets/routes plus Manual Browser QA.

## Lifecycle

`VERIFY → AuditRepo registration → one Product #360 owner/branch → repair PR → exact-head gates → Browser QA → Product merge → resulting-main verification → AuditRepo closure → matrix back to zero.`
