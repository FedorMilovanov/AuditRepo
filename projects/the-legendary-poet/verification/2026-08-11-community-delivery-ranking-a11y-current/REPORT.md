# Community delivery, ranking and accessibility — current verification

Date: 2026-08-11  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: community mutation delivery state machine, server/client rate-limit interaction, comment ordering/filter completeness, mutation-status accessibility and regression coverage.

## Executive result

The previous current audit established `TLP-COMM-ABUSE-001` and `TLP-COMM-ACK-001`. This continuation verifies three independent current roots and consolidates the acknowledgement symptom into a broader delivery root:

1. `TLP-COMM-DELIVERY-001` — queued mutations have an incomplete delivery state machine: premature success acknowledgement, stop-on-first-failure, no scheduled retry/backoff, and no distinction between transient/permanent/server-validation failure.
2. `TLP-COMM-ORDER-001` — the UI's default `Полезные` ordering and kind filters operate only on the newest-loaded subset, not the full remote comment corpus.
3. `TLP-COMM-A11Y-001` — mutation result feedback is routed through a visual toast without live-region/status semantics; the comment sort state is also visual-only.

`TLP-COMM-ACK-001` should be removed as a separate MASTER row and absorbed by `TLP-COMM-DELIVERY-001`.

## Positive controls

The audit does not treat the entire community surface as broken. Current source already has several strong contracts:

- rating stars implement a real `radiogroup`, `radio` state, roving tab stop, Arrow/Home/End keyboard behavior and visible focus;
- comment author is optional and comments render as React text, not raw HTML;
- local writes are durable and a bounded outbox preserves failed mutations;
- target reads are bounded and cursor-paginated;
- existing hardening tests cover malformed persisted operations, stable rating baselines and deferred remote reads.

These are preserved requirements for any repair.

## Finding 1 — TLP-COMM-DELIVERY-001

Severity: **P2**  
Status: **CONFIRMED-CURRENT / DELIVERY-LIVENESS / SYSTEMIC**

### Current mechanism

`commitRatingFeedback`, `commitCommentFeedback` and `commitHelpfulFeedback` persist local state and, when remote mode is enabled, enqueue one operation. `useCommunityFeedback` then calls `flushCommunityOutbox()` asynchronously.

`flushCommunityOutbox()` processes the queue serially. On the first `sendOperation()` failure it:

- increments `attempts`;
- breaks the loop immediately;
- leaves that operation at the front of the queue;
- marks sync state as `offline` with `Сервер недоступен; изменения безопасно сохранены и будут повторены.`

However, there is no timer, exponential backoff or scheduled retry. The only explicit future retry trigger in the reviewed store is the browser `online` event. A later user mutation also invokes `flushCommunityOutbox()` again through the hook. Reload/module initialization only restores the outbox; it does not itself schedule a flush.

The remote RPC wrapper reduces every non-2xx result to `false`, so the store does not distinguish:

- transient network/5xx failure;
- rate-limit rejection;
- validation/schema rejection;
- authorization/configuration failure.

A permanent or temporarily invalid first operation therefore blocks all later queued operations until another external trigger happens, and the UI calls every rejection `server unavailable`.

### Concrete current user path

The client comment cooldown is scoped to `comment:${targetType}:${targetId}` and is 30 seconds per target. The server function `tlp_submit_comment` rejects any second comment from the same `voter_id` anywhere in the comments table during the previous 20 seconds.

Therefore:

1. visitor submits a comment on target A;
2. within 20 seconds, visitor navigates to target B and submits another comment;
3. client allows it because the target-scoped cooldown key differs;
4. server rejects it because server rate limiting is global per `voter_id`;
5. the second operation remains queued and the flush stops;
6. if the connection never transitions through an `offline`→`online` event and the visitor performs no later mutation, no scheduled retry exists after the 20-second window expires.

This is a normal-online liveness failure, not merely an offline edge case.

### Relationship to prior TLP-COMM-ACK-001

The same delivery state machine returns `Комментарий добавлен` after local persistence while remote publication is still unresolved. That acknowledgement defect remains real, but it is one symptom of the broader missing delivery-state model. Keep one root in MASTER: `TLP-COMM-DELIVERY-001`.

### Required terminal outcome

Implement an explicit mutation delivery state machine:

- separate `saved-local`, `queued`, `sending`, `published`, `retry-wait`, `permanent-error` states;
- parse HTTP/RPC outcomes rather than collapsing every failure to boolean `false`;
- retry transient failures automatically with bounded exponential backoff/jitter;
- retry restored pending work on application/community-store startup when remote mode is enabled;
- do not let one permanent poison operation block unrelated later operations indefinitely: dead-letter/quarantine or bounded per-item retry policy;
- align client/server rate-limit semantics, or expose the server retry-after interval and schedule it;
- only show publication-success wording after remote success; local-only and queued states must be named honestly;
- add browser/store regression proof for cross-target rate-limit rejection, transient 5xx recovery without an `online` event, reload with pending outbox, and permanent-error non-blocking behavior.

## Finding 2 — TLP-COMM-ORDER-001

Severity: **P2**  
Status: **CONFIRMED-CURRENT / DATA-PRESENTATION**

### Current mechanism

Remote comments are fetched in stable newest-first order: `(created_at DESC, id DESC)`, ten visible rows plus one sentinel. The target store retains this bounded newest-first corpus.

`CommentList` defaults to `sortMode='helpful'`, but it sorts only the `comments` array that has already been loaded. Therefore `Полезные` means `most helpful among the newest pages currently loaded`, not `most helpful comments` for the target.

The kind filters have the same completeness boundary: category counts are derived from loaded comments only. The UI appends `+` while more remote pages exist, but `canRequestMore` is explicitly disabled whenever `kindFilter !== 'all'`. A reader must switch back to `Все`, load more newest pages, then re-enter the category to discover older matching comments.

### Existing test evidence exposes the gap

The current `validate-community-target-store.ts` fixture creates 12 comments where `helpful` increases with age. The first remote page returns the first 10 newest rows and the second page returns the final two older rows. Those older rows have the highest helpful values in the fixture.

The validator correctly proves bounded cursor pagination, but it does not exercise `CommentList`'s `Полезные` mode. Under the actual UI algorithm, the two most-helpful fixture comments cannot appear at the top until the second page has been loaded manually.

### Product impact

- default `Полезные` label overstates the scope of the ranking;
- older high-quality comments can remain invisible below the pagination boundary;
- type filters can present an incomplete subset with no direct load-more path while filtered;
- readers may infer community consensus from a newest-window sample rather than the corpus.

### Required terminal outcome

Choose one truthful model and test it:

**Preferred:** server-supported sort/filter pagination.

- add a stable helpful ordering (`helpful DESC`, deterministic tie-breakers) for `Полезные`;
- add kind-scoped pagination/counts when a category is active;
- keep cursor stability and bounded requests.

**Acceptable minimal alternative:** rename/scope the UI so it explicitly says ranking/filtering applies to loaded comments and provide a direct `load more` path while filtered. This is weaker UX and should not be presented as corpus-wide ranking.

Add a browser contract with an older comment whose helpful count exceeds every first-page comment and prove `Полезные` returns it correctly under the chosen model.

## Finding 3 — TLP-COMM-A11Y-001

Severity: **P2**  
Status: **CONFIRMED-CURRENT / ACCESSIBILITY**

### Current mechanism

`CommunityPanel` routes status from all three mutation families through one `ActionToast`:

- rating submit/update;
- comment submit;
- helpful vote.

`ActionToast` renders a visual `motion.div` with icon and text but no `role='status'`, `role='alert'`, `aria-live` or equivalent live-region owner. The panel's separate sync line has `aria-live='polite'`, but mutation result text is not placed in that live region.

A screen-reader user can activate a rating/comment/helpful action and receive no programmatic announcement of the immediate success/failure message.

Separately, `CommentSortBar` visually highlights `Полезные` vs `Новые`, but its buttons expose no `aria-pressed`/radio state and no labelled group semantics. Keyboard activation works because the controls are native buttons, but the selected sort is not programmatically conveyed.

### Positive contrast

`RatingStars` already demonstrates the repository's intended accessibility quality: real radiogroup semantics, `aria-checked`, roving tab index and keyboard navigation. The community mutation/status controls should meet the same standard.

### Required terminal outcome

- make mutation feedback a persistent/reused live status owner (`role='status'`/polite for success and ordinary queued states; assertive alert only where warranted);
- preserve visible toast presentation while ensuring announcement text changes in the live owner;
- expose comment sort as a truthful single-select control (`aria-pressed` buttons or radio group) with a programmatic group label;
- add Chromium + WebKit accessibility regression proof for rating, comment and helpful result announcements and selected sort state.

## Lower-severity observation — validation normalization mismatch

The composer enables submit based on `text.trim().length`, and the hook also checks a trimmed string. The persisted-store sanitizer additionally collapses runs of tabs/spaces before enforcing the eight-character minimum. An input that appears >=8 characters before space-collapse can therefore reach `commitCommentFeedback()` and be rejected by `sanitizeComment()`, after which the hook reports `Не удалось сохранить: браузер блокирует локальное хранилище` even though storage may be healthy.

This is a real validation/error-classification mismatch, but it is not promoted as an independent MASTER row in this wave. It should be absorbed by the delivery/input-state repair if that lane normalizes once before validation and returns typed errors.

## Regression coverage gap

Current community tests are strong on target scoping, cursor stability, malformed persisted state and optimistic overlays, but the reviewed contracts do not currently prove:

- automatic retry after transient failure while the browser remains online;
- startup flush of restored pending work;
- permanent-rejection queue progress;
- global `Полезные` correctness across multiple remote pages;
- filtered pagination completeness;
- live announcement of mutation results;
- selected-state semantics for comment sorting.

## Audit disposition

- Keep `TLP-COMM-ABUSE-001` as independent P1 public-integrity root.
- Replace `TLP-COMM-ACK-001` with `TLP-COMM-DELIVERY-001` (P2 systemic delivery/liveness root; ACK absorbed).
- Add `TLP-COMM-ORDER-001` as P2.
- Add `TLP-COMM-A11Y-001` as P2.
- Do not reopen W3 community scaling; the bounded newest-first pagination mechanism remains valid for `Новые`, while the new ordering root concerns the mismatch between that backend ordering and corpus-wide `Полезные`/filter UI claims.
