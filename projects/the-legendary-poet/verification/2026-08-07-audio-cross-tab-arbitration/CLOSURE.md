# TLP-AUDIO-001 closure — deterministic cross-tab audio arbitration

Closure recorded: 2026-08-08  
Verification package opened: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #356  
Product repair: PR #358  
Original verified-current anchor: `67d614bc186b52c408ad6cef4c84cf57d4e78a45`  
Repair base before merge: `0a74185911e1fbbcc49d7d4e96b05504e0dc94b0`  
Exact tested Product head: `ab8fd872d65e6c10aef809967bc87bff8a08e72d`  
Product squash merge / resulting main: `7231b2f33deed185a76fc6dd1c336a6d4dad1776`  
AuditRepo row: `TLP-AUDIO-001`

## Disposition

**CLOSED-BY-FIX / P3 removed from active engineering matrix.**

The existing one-persistent-audio-engine-per-tab design remains intact. The repair preserves BroadcastChannel plus storage-event fallback, Media Session behavior, audio-session persistence, source switching, retry/error behavior, deep links and the existing mini-player / immersive player UI. No catalog, audio asset, visual redesign or budget increase was mixed into the repair.

## Root-cause repair

The old receiver paused local playback on any valid peer `playing` claim. That made ordinary sequential handoff work but left simultaneous starts without a shared winner: if A and B began before receiving each other's messages, each could pause on the peer claim and the final state could be zero active players.

Product PR #358 introduced one explicit playback-claim ordering model:

- every real local `play` owns an active `PlaybackCoordinationClaim`;
- claims compare first by monotonic timestamp, then by `instanceId`, with `trackId` only as a final identity tie-break;
- a per-tab logical coordination clock advances to `max(Date.now(), lastSeen + 1)`, so a later explicit local replay outranks a peer claim the tab has already observed even inside the same wall-clock millisecond;
- a playing tab yields only when the remote claim wins that total order;
- self claims are ignored;
- stale claims cannot displace a newer local player;
- duplicate winning claims preserve the same decision and the provider's paused guard makes repeated transport delivery operationally idempotent;
- BroadcastChannel and storage-event messages flow through the same arbitration helper.

The resulting Product `main@7231b2f33deed185a76fc6dd1c336a6d4dad1776` contains `src/components/music/audioCoordination.ts` with this total-order/logical-clock contract, and `package.json` permanently wires `validate:audio-coordination` into `check:content`.

## Deterministic regression witnesses

The exact tested head `ab8fd872d65e6c10aef809967bc87bff8a08e72d` added both pure and browser-level evidence.

### Pure coordination validator

`scripts/validate-audio-coordination.ts` proves:

1. sequential newer claim beats older claim;
2. stale older claim cannot pause a newer local player;
3. equal timestamps use a symmetric deterministic tie-break;
4. the exact simultaneous A/B crosswise-delivery model requires `Number(aPauses) + Number(bPauses) === 1`, so exactly one player survives;
5. self claims are ignored;
6. a playing tab with no local claim yields conservatively to a valid peer;
7. duplicate winning claims preserve the same decision;
8. the logical clock advances beyond already-seen peer time without sleeping/debouncing;
9. invalid/non-finite coordination timestamps and empty claim identities are rejected.

### Real two-page browser witness

`qa/audio-cross-tab.spec.mjs` runs on the existing Chromium core profile and uses two pages in one browser context with real site audio:

- page A plays;
- page B plays and A must pause;
- page A explicitly plays again and B must pause;
- the final active-audio count must be exactly `1`.

The same A→B→A handoff is repeated after defining `window.BroadcastChannel` as unavailable before application code executes. That second test therefore exercises the storage-event fallback and proves both transports reach the same arbitration rule.

The deterministic simultaneous race itself remains a pure state-machine assertion rather than a timing-sensitive real-MP3 race, avoiding a flaky correctness witness.

## Exact-head Product gates

On `ab8fd872d65e6c10aef809967bc87bff8a08e72d`, all required pull-request workflows completed successfully before merge:

- `CI`: success, including full `check:content`, the new audio coordination validator, TypeScript, production build, existing route/JS/CSS budgets, prerender and SEO;
- `Project contracts`: success;
- `Content model contract`: success;
- `Site route integrity audit`: success;
- `Articles catalog acceptance`: success;
- `Yesenin Part I browser acceptance`: success;
- `Yesenin Part II safe publication`: success;
- `Brand raster QA`: success;
- `Brand deep reference and motion audit`: success;
- `Manual Browser QA`: success, including the new two-page BroadcastChannel/storage audio witnesses plus the existing Chromium/Android and fresh-process iPhone Safari contours.

Immediately before merge the branch was exactly one commit ahead and zero commits behind current Product `main@0a74185911e1fbbcc49d7d4e96b05504e0dc94b0`, the diff remained the six registered audio/QA files, the PR was mergeable, and its comment/review-thread surface was empty.

PR #358 was marked ready and then squash-merged with expected-head protection for `ab8fd872d65e6c10aef809967bc87bff8a08e72d`. GitHub produced Product merge `7231b2f33deed185a76fc6dd1c336a6d4dad1776`, and Product #356 closed automatically as completed.

## Post-merge source verification

Resulting Product `main@7231b2f33deed185a76fc6dd1c336a6d4dad1776` was re-read after merge:

- `src/components/music/audioCoordination.ts` is present on `main` with `nextPlaybackClaimTimestamp`, `comparePlaybackClaims` and `shouldYieldToRemotePlayback`;
- `package.json` exposes `validate:audio-coordination` and includes it in the standard `check:content` chain;
- Product #356 is closed with state reason `completed`.

This verifies that the repair is part of current source truth rather than only a closed PR diff.

## Matrix effect

Current verified engineering rows after this closure:

- P0: `0`;
- P1: `0`;
- P2: `0`;
- P3: `0`;
- total active engineering rows: `0`;
- registered Product architecture lanes: `0`.

Fresh engineering bug hunting may now resume only from new current-head evidence. Editorial/research work such as Yesenin Part II #269 remains outside the engineering bug matrix unless an independently reproduced engineering defect is found.

## Durable evidence

- activation/root-cause report: `REPORT.md`;
- final Product PR: #358;
- Product issue: #356;
- exact tested head: `ab8fd872d65e6c10aef809967bc87bff8a08e72d`;
- Product merge / resulting main: `7231b2f33deed185a76fc6dd1c336a6d4dad1776`.
