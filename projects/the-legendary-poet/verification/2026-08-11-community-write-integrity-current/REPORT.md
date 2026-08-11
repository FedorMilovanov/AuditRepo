# Community write integrity and guest-comment UX — current audit

Date: 2026-08-11  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited production source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Audit scope: guest comments, ratings, helpful votes, local/outbox durability, remote Supabase write boundary, anti-abuse model, acknowledgement UX and production-proof boundary.

## Executive result

The current community implementation is substantially stronger than the original localStorage prototype: anonymous users can comment without account registration, the author field is optional, local writes survive reload, an outbox retries failed remote mutations, remote reads are target-scoped/paginated, and the UI exposes local/syncing/offline/online states.

Two current root defects remain:

1. `TLP-COMM-ABUSE-001` — public feedback integrity can be bypassed by rotating caller-controlled voter UUIDs.
2. `TLP-COMM-ACK-001` — the composer reports success and clears the draft after local persistence, before remote publication is confirmed.

Production Supabase activation itself could not be proven from repository source alone because the deploy workflow consumes repository variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) whose values are outside the readable source tree. This is an evidence boundary, not by itself a defect.

## What is already correct

### Guest path / registration

- No user account is required to leave a comment.
- The name/pseudonym field is explicitly optional.
- Blank author values are normalized to `Анонимный читатель`.
- Comment length is bounded to 8–2000 characters; author length is bounded to 60 characters.
- The client uses a stable anonymous browser UUID only for duplicate/rate-limit semantics; it is not an account system.

This is the right default product direction for a literary site: low-friction guest participation without mandatory sign-up.

### Durability and retry

- A comment is committed to bounded browser state first.
- When the shared backend is enabled, a matching outbox operation is persisted.
- Failed remote writes stay queued and are retried later.
- The sync state distinguishes local, syncing, online and offline modes.
- W3 community-scaling evidence already proved bounded target reads, cursor pagination, aggregate-only leaderboard reads and offline/helpful outbox persistence.

### Rendering safety

Current comment cards render author/text as React text content rather than raw HTML, so the reviewed path does not introduce a direct HTML-injection sink.

## Finding 1 — TLP-COMM-ABUSE-001

Severity: **P1**  
Status: **CONFIRMED-CURRENT / PUBLIC-INTEGRITY**

### Root cause

The backend trusts a `p_voter_id uuid` supplied by the public client. The browser UUID is generated client-side and stored locally. Server uniqueness/rate-limit controls are keyed to that caller-provided UUID:

- ratings: unique `(target_type, target_id, voter_id)`;
- comments: 20-second rate limit by `voter_id`;
- helpful votes: unique `(comment_id, voter_id)`.

The public anonymous RPCs are executable by `anon`/`authenticated`, and comments are inserted directly with `status='published'`.

A scripted caller can therefore generate a fresh valid UUID for every request and bypass the intended one-vote / comment-rate / helpful-vote limits. The current controls stop accidental repeat actions from one browser installation; they are not an anti-abuse boundary.

### Product impact

- public poet/poem/track/article ratings can be manipulated;
- helpful counts can be inflated;
- comment spam can be automated despite the nominal 20-second limit;
- the public signal may look community-derived while being cheap to forge.

### Required terminal outcome

Move write authorization/abuse control behind a server-side boundary that does not trust a caller-chosen identity as the sole control. Recommended shape:

1. Keep reading public aggregate/comment views directly if desired.
2. Route rating/comment/helpful writes through a Supabase Edge Function or equivalent trusted endpoint.
3. Verify a bot challenge (for example Turnstile) server-side for comment submission and suspicious/high-rate rating traffic.
4. Add server-side throttling using a non-user-controlled key (for example privacy-preserving IP hash + short-lived signed session/device token) and bounded per-target limits.
5. Issue/verify a signed anonymous session token if the product wants one-vote-per-guest semantics without account registration.
6. Preserve database uniqueness as defense in depth, but do not treat raw client UUID as authority.
7. Add abuse-contract tests that rotate voter UUIDs and prove the trusted boundary still rejects burst spam/manipulation.

## Finding 2 — TLP-COMM-ACK-001

Severity: **P2**  
Status: **CONFIRMED-CURRENT / UX-HONESTY**

### Root cause

`addComment()` returns `{ ok: true, message: 'Комментарий добавлен' }` immediately after local `commitCommentFeedback(...)` succeeds. The composer then clears the textarea and shows success. `flushCommunityOutbox()` runs asynchronously afterward.

If the backend write fails, the operation remains safely queued and the panel later exposes an offline/queued state, but the first user-visible acknowledgement has already implied completion/publication.

### Product impact

- a user can reasonably interpret `Комментарий добавлен` as “published for everyone” when only local persistence is confirmed;
- the draft is cleared before shared publication is known;
- the architecture is durable but the acknowledgement semantics blur `saved locally`, `queued`, and `published`.

### Required terminal outcome

Use a two-stage acknowledgement model:

- local commit: `Сохранено на этом устройстве — отправляем…`;
- remote success: `Комментарий опубликован`;
- remote failure/outbox: `Сохранено, но пока не опубликовано. Отправим автоматически при восстановлении связи.`;
- local-only deployment: `Сохранено только в этом браузере`.

The composer may still clear the draft after a durable local commit, but the toast/status must accurately name the achieved state. Add a browser contract that forces remote failure and verifies no publication-success wording appears before the RPC succeeds.

## Production-proof boundary

The deploy workflow injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from repository variables. The client enables shared mode only when both are present. Repository source and PR QA prove both local/outbox behavior and mocked remote topology, but they do not reveal whether those production variables are currently populated or whether a real production row was written at audit time.

For a product that requires shared feedback, add an explicit production contract rather than relying on optional configuration:

- fail the production build/deploy when shared community is required but either variable is absent;
- run a non-destructive production health check against a dedicated canary RPC/table or metadata endpoint;
- expose an operator-visible health state that distinguishes `configured`, `reachable`, and `write-capable` without polluting public comments.

## Guest-name recommendation

Do **not** require registration merely to comment. Keep the current guest-first path. Also keep the name/pseudonym optional.

Quality improvements:

- remember the entered nickname locally after the first successful durable submission so repeat commenters do not retype it;
- offer a small `Комментировать как Анонимный читатель` / optional-name cue instead of account language;
- do not add email/password registration until the product needs durable identities, edit history, subscriptions or moderation reputation;
- if durable identity becomes useful, offer optional sign-in as an enhancement, not a gate for first participation.

## Friction recommendation

The four comment-kind pills are useful metadata but add decision cost before a simple comment. Keep one sensible default and consider moving category choice under an optional `Тип комментария` disclosure. The primary path should be: optional name → comment → submit.

## Verification sources inspected

Current Product source:

- `src/components/community/CommentComposer.tsx`
- `src/components/community/CommunityPanel.tsx`
- `src/components/community/CommentCard.tsx`
- `src/components/community/ExpandableText.tsx`
- `src/hooks/useCommunityFeedback.ts`
- `src/utils/communityIdentity.ts`
- `src/utils/communityStore.ts`
- `src/utils/communityRemote.ts`
- `docs/community-schema.sql`
- `.github/workflows/deploy.yml`
- `qa/community-request-topology.cases.mjs`
- current exact-head Manual Browser QA matrix for PR #415 head `c99aff26dd83f6d5f8b0dadd0840666d92f8e901`

Prior AuditRepo evidence:

- `verified/COMMUNITY_SCALING_2026-08-05.md`
- W3 production closure at source `main@4544bb387108a98641313267beafe29deb71ee81`.

## Audit disposition

Promote `TLP-COMM-ABUSE-001` to active P1 and `TLP-COMM-ACK-001` to active P2 in `verified/MASTER_BUG_MATRIX.md`.

Do not reopen W3 community-scaling: these findings concern write-integrity/abuse authority and acknowledgement semantics, not the already-closed read-scaling/persistence topology root.
