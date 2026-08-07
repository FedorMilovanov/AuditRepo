# TLP-AUDIO-002 closure — precision-safe cross-tab audio logical ordering

Closure recorded: 2026-08-08  
Verification package opened: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #360  
Product repair: PR #362  
Verified-current defect anchor: `0712a1845d4133953750a32a9df598f6cbeb192e`  
Exact tested Product head: `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`  
Product squash merge / resulting main: `7fb70a207af2f793afde46b0aee4e59e43d30984`  
AuditRepo row: `TLP-AUDIO-002`

## Disposition

**CLOSED-BY-FIX / P3 removed from active engineering matrix.**

This closure is independent of `TLP-AUDIO-001`: Product #358 remains the closed fix for ordinary simultaneous-start arbitration, while this repair closes the later-discovered numeric-domain failure in that protocol's Lamport-style clock.

## Verified root cause

At the defect anchor, playback coordination accepted every finite numeric timestamp and advanced the observed peer clock with `lastSeen + 1`. JavaScript's IEEE-754 `number` domain contains finite values that cannot preserve that integer increment. In particular:

```js
Number.isFinite(2 ** 53) === true;
(2 ** 53) + 1 === 2 ** 53;
```

A malformed/corrupt same-origin BroadcastChannel or storage claim could therefore be accepted, move the local coordination clock outside safe-integer precision, and make the next explicit local play reuse the same numeric timestamp. The comparator then fell through to `instanceId`, so a delayed copy of the already-seen peer claim could defeat the later user action.

## Repair

Product PR #362 kept the repair bounded to four existing audio/proof files.

### Two-part coordination clock

`src/components/music/audioCoordination.ts` now separates:

- `timestamp`: nonnegative JavaScript safe-integer wall-clock time;
- `sequence`: optional canonical nonnegative decimal Lamport sequence, interpreted as `BigInt`.

Sequence-less claims from the #358 protocol normalize to logical sequence zero, preserving ordinary deployment-overlap compatibility.

Claim ordering is now:

1. wall-clock timestamp;
2. logical sequence;
3. `instanceId` for genuinely simultaneous equal-clock starts;
4. `trackId` only as a final identity tie-break.

The local wall timestamp is never incremented as an IEEE-754 number. When real wall time moves forward, the sequence resets to zero. When a later local action must advance beyond an equal or future already-seen timestamp, the timestamp remains unchanged and the arbitrary-precision `BigInt` sequence increments.

External claims with unsafe, fractional, negative or non-finite timestamps are rejected before they can update the clock or influence playback.

### Provider wiring

`src/components/music/AudioPlayerProvider.tsx` stores the explicit `{ timestamp, sequence }` clock, folds accepted peers through the shared observation helper, and emits both safe numeric wall time and decimal sequence on every real `play`. BroadcastChannel and storage-event fallback continue to use the same validator/comparator path. Media Session, session persistence, source switching, retry/error behavior, deep links and player UI were not redesigned.

## Deterministic regression evidence

The existing `validate:audio-coordination` entry remained in the normal `check:content` chain and was expanded to prove:

- normal newer/older ordering;
- exact simultaneous A/B starts still leave exactly one winner;
- stale, duplicate and self delivery remain stable;
- sequence-less legacy claims normalize to zero;
- logical sequence outranks `instanceId` when wall timestamps are equal;
- same-millisecond replay advances sequence without mutating wall time;
- later real wall time resets sequence to zero;
- invalid wall-clock input cannot roll back or poison an existing clock;
- a later explicit local replay beats an already-seen higher-sorting peer before identity tie-break;
- `Number.MAX_SAFE_INTEGER` remains a valid legacy wall timestamp while later replay advances by sequence instead of overflowing the number;
- very large decimal sequences advance as `BigInt` beyond Number precision;
- `2 ** 53`, fractional and negative timestamps are rejected;
- malformed/noncanonical sequences and empty identities are rejected.

## Real browser evidence

`qa/audio-cross-tab.spec.mjs` retained the two #358 transport witnesses:

1. real two-page A→B→A handoff through BroadcastChannel;
2. the same handoff with BroadcastChannel unavailable, forcing storage-event fallback.

PR #362 added a third Chromium-core witness for the precision boundary:

1. open two real `/music` pages;
2. start real audio in page A;
3. arm an independent storage-event observer in A after normal startup traffic;
4. page B writes a coordination-shaped storage claim with `timestamp: 2 ** 53`;
5. wait until the independent observer proves that exact storage event has actually been dispatched in A;
6. prove A remains playing — the malformed claim was rejected and did not poison/pause the player;
7. start normal real audio in B and prove ordinary handoff still pauses A and leaves B playing.

Waiting for confirmed event delivery prevents the witness from passing merely because it checked audio state before the malformed message arrived.

## Exact-head Product gates

All PR-triggered workflows on exact tested head `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621` completed successfully before merge:

- `CI`: success, including the expanded audio validator, app-shell/interactions, TypeScript, production build, route splitting and existing budgets, prerender and SEO;
- `Project contracts`: success;
- `Site route integrity audit`: success;
- `Brand deep reference and motion audit`: success;
- `Manual Browser QA`: success.

Manual Browser QA evidence on that head:

- Chromium/Android core step: success, including all three audio cross-tab tests and therefore the delivered `2 ** 53` storage witness;
- fresh-process base iPhone Safari step: success;
- WebKit home/reveal job: success;
- premium-home job: success;
- critical iPhone job: success.

Immediately before merge Product `main` was still `0712a1845d4133953750a32a9df598f6cbeb192e`, the repair branch was four commits ahead / zero behind, the diff was exactly the four registered audio/test files, and PR comments/review threads were empty.

PR #362 was marked ready and squash-merged with expected-head protection for `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`.

## Post-merge verification

GitHub produced Product merge / resulting `main`:

`7fb70a207af2f793afde46b0aee4e59e43d30984`

Product issue #360 closed automatically with state reason `completed`.

Resulting Product `main` was re-read after merge:

- `src/components/music/audioCoordination.ts` contains safe-integer timestamp validation, the optional decimal `sequence`, `BigInt` sequence comparison/advancement, and the two-part clock helpers;
- `qa/audio-cross-tab.spec.mjs` contains the delivered unsafe-storage-claim browser witness alongside both normal handoff witnesses.

The repair is therefore part of current source truth rather than only a closed PR diff.

## Matrix effect

After this closure:

- P0: `0`;
- P1: `0`;
- P2: `0`;
- P3: `0`;
- total active engineering rows: `0`;
- registered Product architecture lanes: `0`.

Fresh current-head engineering verification may resume only from new evidence. Product #269 and its Yesenin authoring PRs remain editorial work outside the engineering bug matrix unless a new engineering root cause is independently reproduced.

## Durable evidence

- activation report: `REPORT.md`;
- Product issue: #360;
- Product PR: #362;
- exact tested head: `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`;
- Product merge / resulting main: `7fb70a207af2f793afde46b0aee4e59e43d30984`.
