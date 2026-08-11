# Community reconciliation and read-state truth — current audit

Date: 2026-08-11  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: post-delivery reconciliation, moderation visibility, simultaneous cross-tab persistence, first-load/read failures, summary consumers, ratings hub, rating dimension contract and privacy/moderation boundary.

## Current-source / collision check

The Product `main` head remains `d59cceccb0c49af59b1be38d4c547a6240b3005a` during this pass. Targeted searches found no open Product issue/repair owner for community comments, ratings, helpful votes, outbox retry, moderation, rate-limit or accessibility work. This report therefore records current defects in AuditRepo only; it does not create a competing Product implementation lane.

## Result

This continuation does not reopen W3 target-scoped community scaling. W3's bounded read topology remains intact. It does, however, exposes additional current state-truth problems and strengthens the already-active delivery root.

### Existing active roots retained

- `TLP-COMM-ABUSE-001` — P1 public-integrity authority remains current.
- `TLP-COMM-DELIVERY-001` — P2 delivery liveness remains current and is expanded below to own post-sync reconciliation and lossless cross-tab persistence.
- `TLP-COMM-ORDER-001` — P2 corpus ordering/filter truth remains current.
- `TLP-COMM-A11Y-001` — P2 status/sort accessibility semantics remain current.

### New independent root

- `TLP-COMM-READSTATE-001` — P2 read-state truth: loading/error is rendered as real zero/empty data on several community consumers.

## Finding A — synced local comments can survive later server moderation

Severity contribution: **absorbed into `TLP-COMM-DELIVERY-001`**.

### Mechanism

`commitCommentFeedback()` inserts a new comment into `localSnapshot.comments` and, in shared mode, also queues an outbox operation. On successful `flushCommunityOutbox()` delivery, the matching outbox item is removed, but the delivered comment is not retired from `localSnapshot.comments`.

`communityTargetStore.mergeComments()` always merges `getLocalTargetSnapshot(...).comments` over the current remote comment page, regardless of whether those local comments are still pending.

The backend moderation workflow hides a comment by changing `tlp_comments.status` away from `published`; `tlp_comments_public` then correctly stops returning it and the aggregate view stops counting it. Because the author's successfully delivered local copy remains persisted, that browser can continue to render the hidden comment.

### User-visible consequence

After moderation, the same browser can show a locally retained comment that the shared backend no longer publishes. Since `commentCount` comes from the remote aggregate while the rendered list includes the local mirror, the UI can reach contradictory states such as `Показано 1 из 0`.

This is not a reason to remove optimistic local durability. The missing transition is `pending local -> remotely confirmed -> retire local comment mirror / retain only explicit device metadata if needed`.

### Existing test gap

`validate-community-store.ts` proves that a successful retry empties the outbox, but it does not assert that a successfully delivered comment leaves `localSnapshot.comments`. The v2->v3 migration explicitly keeps only pending comments from the old public corpus, so the missing post-delivery retirement is inconsistent with the bounded-state intent.

## Finding B — simultaneous cross-tab writes can overwrite durable pending work

Severity contribution: **absorbed into `TLP-COMM-DELIVERY-001`**.

### Mechanism

Each tab owns an in-memory `currentState`. `applyState()` serializes the next state directly to one `localStorage` key. The `storage` listener reloads state after another document writes, but there is no transaction, Web Lock, compare-and-merge step or cross-tab mutation arbitration around the write itself.

A deterministic lost-update sequence is therefore possible:

1. tab A and tab B both hold state `S0`;
2. A commits mutation A and writes `S0 + A`;
3. before B processes A's storage event, B commits mutation B from stale `S0` and writes `S0 + B`;
4. the shared persisted envelope now lacks A.

The risk is strongest while offline or during backend failure, precisely when the outbox is supposed to be the durable source of truth. Existing validation dispatches a storage event and proves notification, but does not exercise two simultaneous writers or prove lossless merge/arbitration.

### Required addition to the delivery root

The terminal delivery repair must include lossless cross-tab mutation ownership: serialize/merge writes through a real cross-document arbitration mechanism or equivalent conflict-safe envelope protocol, and add a two-page offline browser witness where simultaneous rating/comment/helpful actions all survive reload and later flush exactly once.

## Finding C — TLP-COMM-READSTATE-001

Severity: **P2**  
Status: **CONFIRMED-CURRENT / READ-STATE-TRUTH**

### Root cause

Community consumers do not share a complete state model for `loading`, `error`, `ready-empty` and `ready-with-data`.

#### Main CommunityPanel

`CommunityPanel` passes only `comments`, `total`, `hasMore` and a boolean `loading` into `CommentList`. When the initial comment request fails, `commentsPhase === 'error'`, so `loading` is false and the list receives an empty array. `CommentList` therefore renders `Комментариев пока нет. Можно стать первым внимательным читателем.` while the panel may simultaneously display `Общая база временно недоступна` above it.

If the aggregate request fails while comments succeed, the local/empty aggregate can report zero comments while the rendered remote page contains comments, producing contradictory count presentation.

#### PoetCommunitySummary

`PoetCommunitySummary` subscribes in `summary` mode but does not render `summaryPhase` or `error`. Before the remote summary arrives, and permanently after a failed summary request, it renders `0 оценок`, `0 мнений`, `Пока мало данных` and empty dimension bars. Those are valid ready-empty values, so a backend failure becomes indistinguishable from genuinely having no community data.

#### RatingsPage / leaderboard

`communityLeaderboardStore` has an explicit `phase: idle | loading | ready | error`, but when remote mode is enabled and no remote aggregate has arrived, `buildAggregates()` fills every known poet with an empty aggregate. On a failed leaderboard fetch, the store preserves `phase='error'` but those zero aggregates remain the numeric source for `RatingsPage`.

`RatingsPage` does show an unavailable/offline badge through the shared sync state, yet the same render also produces real-looking metric cards such as `0` reader votes, `0` comments, `0` rated poets and highlight copy such as `Ждём голоса`. A failed read is therefore simultaneously labelled unavailable and rendered as genuine zero participation.

### Product impact

- temporary backend/read failure can erase visible social proof rather than showing unavailable/loading;
- readers may conclude that a poet, article or the whole ranking has no participation when the data simply failed to load;
- the same page can display mutually contradictory `unavailable` and `no comments / zero votes` states;
- monitoring, screenshots and manual QA can capture false-zero states as if they were real product data.

### Required terminal outcome

1. Give every community consumer an explicit state contract: `loading | error | ready-empty | ready-data` (or equivalent typed phases).
2. Never render zero/empty copy from an unresolved or failed remote read.
3. `CommentList` must receive/read a first-page phase and render unavailable/retry separately from true empty.
4. `PoetCommunitySummary` must expose loading and error semantics instead of coercing both to zeros.
5. `RatingsPage` must gate numeric totals/highlights on leaderboard readiness instead of presenting synthetic empty aggregates as actual zeros during loading/error.
6. Preserve already-loaded comments/aggregates during retryable later failures where truthful stale-data presentation is possible.
7. Add Chromium + WebKit browser cases for summary failure, initial-comments failure, aggregate-fails/comments-succeed, leaderboard failure/loading and genuine ready-empty.

## Rating-dimension contract — checked, no defect

The current UI and backend agree on score keys:

- poet: `language`, `depth`, `legacy`, `truth`;
- poem: `beauty`, `form`, `impact`;
- track: `voice`, `music`, `text`;
- article: `clarity`, `depth`, `fairness`.

No current UI/RPC dimension mismatch was found. Mock aggregate fixtures may contain extra response dimensions, but current renderers read only the configured dimensions and the write contract remains aligned.

## Rendering / injection boundary — still no new root

Comment author/text are rendered as React text, not raw HTML. The reviewed path still has no direct `dangerouslySetInnerHTML`-style user-comment sink. Server comment RPC validates kind/length and cleans author control characters. Intentional abuse/spam remains owned by `TLP-COMM-ABUSE-001`, not a new XSS row.

## Privacy / deletion / moderation boundary

The public privacy page tells users to contact the project about deletion of submitted data. The operator can hide comments by backend `status` and, with administrative database authority, can delete rows. The current guest model has no verified person identity, so ownership proof, deletion workflow, moderation audit trail and reader reporting remain product/operations quality topics rather than a newly proven engineering defect in this pass.

The concrete engineering defect is narrower: once the backend has hidden a row, the client must honor that authoritative public state and not resurrect its old local mirror.

## Live-production evidence boundary

A direct public runtime fetch was attempted during this audit, but the available web retrieval path could not establish a usable witness for `thelegendarypoet.ru`; no production pass/fail claim is made from that attempt. Production Supabase configuration/write capability therefore remains bounded by the earlier canary recommendation rather than inferred from source or search-index visibility.

## Audit disposition

- Keep `TLP-COMM-ABUSE-001`, `TLP-COMM-ORDER-001`, and `TLP-COMM-A11Y-001` unchanged.
- Expand `TLP-COMM-DELIVERY-001` to include:
  - post-success retirement/reconciliation of local comments;
  - authoritative moderation visibility;
  - lossless simultaneous cross-tab persistence;
  - existing typed error/retry/backoff/rate-limit/acknowledgement work.
- Add `TLP-COMM-READSTATE-001` as one independent P2 root with `CommunityPanel`, `PoetCommunitySummary` and `/ratings` as class-level manifestations.
- Active engineering rows remain **5 total: 1 P1 + 4 P2**.
- Do not create separate symptom rows for `hidden comment still visible`, `1 из 0`, `two-tab lost outbox` or `ratings page zeros while unavailable`; they are absorbed by the delivery or read-state roots above.
