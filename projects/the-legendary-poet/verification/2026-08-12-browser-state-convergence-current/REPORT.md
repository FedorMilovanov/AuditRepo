# Browser state convergence — current audit

Date: 2026-08-12  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: audio session persistence and reader archive convergence, analytics consent convergence/revocation, browser-storage lifecycle and current permanent-test coverage.

## Current-source / collision check

The Product source anchor is unchanged from the immediately preceding wave: `d59cceccb0c49af59b1be38d4c547a6240b3005a` compares identical to `main` with zero commits ahead/behind.

Targeted open Product issue/PR searches for audio session cross-tab/archive progress and analytics consent/privacy/storage found no matching current repair owner. This report records evidence in AuditRepo only and creates no Product repair lane.

## Result

Two independent current P2 roots are confirmed:

- `TLP-AUDIO-SESSION-001` — persisted music session state does not satisfy the Product's own cross-tab archive promise and can lose/erase state through stale whole-snapshot ownership.
- `TLP-ANALYTICS-CONSENT-001` — analytics consent has no cross-tab convergence or post-start revocation/teardown owner.

The wave also strengthens two already-active system roots rather than adding duplicate rows:

- `TLP-THEME-001` — the stored theme preference is another localStorage owner without cross-tab convergence; this is absorbed into the existing theme/document ownership root.
- `TLP-AUDIT-004` — current audio/analytics validators do not exercise the cross-document state transitions that expose these defects.

---

## Finding A — `TLP-AUDIO-SESSION-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / PERSISTENCE-CONVERGENCE / DATA-LOSS**

### Product promise

`MyArchivePage` tells the reader:

> `Данные синхронизируются между вкладками этого браузера`

The same page includes music sessions derived from saved playback positions and completed-track state, so this promise covers more than the conflict-safe poem-favorites store.

### Mechanism 1 — one unversioned whole snapshot

`src/components/music/audioSessionStore.ts` persists `tlp-audio-session:v2` as one object containing:

- `lastTrackId`;
- `volume` / `muted`;
- `positions` map;
- `completedTrackIds` array;
- `updatedAt`.

Every mutation runs `readAudioSession() -> clone -> mutate -> writeAudioSession(next)`. `updatedAt` is sanitized and rewritten, but it is not used for conflict resolution, per-field arbitration or merge.

Two documents can therefore read the same base snapshot and overwrite each other's independent fields/sets. Unlike Personal Archive v4, there is no operation generation, writer id, tombstone merge or `current + oldValue + newValue` repair.

### Mechanism 2 — Provider listens only to playback coordination, not session state

`AudioPlayerProvider` installs a `storage` listener for `AUDIO_COORDINATION_STORAGE_KEY`, used to arbitrate which tab may continue audible playback. It does not subscribe to `AUDIO_SESSION_STORAGE_KEY`.

The distinction is important:

- playback coordination can correctly pause the losing player;
- persisted resume/completion/volume/archive state in the other tab still does not converge into the mounted Provider's React state.

`initialSessionRef`, `completedRef`, `volume` and `muted` are initialized from the session at mount and are not updated when another document mutates the persisted session.

### Deterministic sequential data-loss witness — no simultaneous race required

A stale completion set can erase a newer completion from another tab:

1. tabs A and B mount while `completedTrackIds=[]`;
2. A completes track X and persists `[X]`;
3. B's `completedRef` is still `[]` because session storage changes are not subscribed;
4. B later completes track Y;
5. `persistCompleted(Y)` produces B's local set `[Y]` and `setStoredCompletedTracks()` replaces the persisted completed array with that stale set;
6. X disappears from the shared session even though A previously completed it.

This is stronger than a narrow same-millisecond localStorage race: ordinary sequential use across already-open tabs can lose data.

### Live convergence failure

Even for fields that are not erased, an already-open `/archive` tab receives no audio-session storage notification that causes the audio context/archive view to re-render. A second tab can advance a track beyond the archive threshold or mark it completed while the first tab continues to show an old music-session list until some unrelated local render/remount happens.

The reader-facing cross-tab promise is therefore false for the music half of the archive even while the poem-favorites half has an explicit conflict-safe cross-tab protocol.

### Existing validation gap

`validate-audio-session-store.ts` uses one `MemoryStorage` instance and exercises:

- default/migration;
- sanitization;
- single-writer mutation;
- reconciliation against the catalog;
- corrupt JSON recovery;
- presentation helpers.

It does not model two writers, storage events, stale Provider refs or cross-tab archive convergence. Playback-coordination validators protect a different key/protocol and do not close this persistence gap.

### Required terminal outcome

1. Give audio session persistence a cross-document merge/arbitration contract rather than one last-writer whole snapshot.
2. Treat per-track position/completion state as mergeable/versioned data; do not let one stale completion set erase unrelated newer completions.
3. Subscribe mounted audio/archive state to accepted session changes from other documents.
4. Keep playback coordination and persisted-session convergence as separate responsibilities while ensuring they compose correctly.
5. Reuse the proven Personal Archive v4 operation/merge pattern where practical instead of inventing another weaker conflict model.
6. Add a two-page browser witness:
   - A completes X;
   - B, opened before A's completion, completes Y;
   - both X and Y survive reload;
   - saved positions from different tracks survive independent writes;
   - an already-open `/archive` converges without manual reload;
   - only one tab plays audibly at a time.

---

## Finding B — `TLP-ANALYTICS-CONSENT-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / PRIVACY-CONSENT / STATE-AUTHORITY**

### What is already correct

The first analytics startup is not fail-open: `initAnalytics()` checks `getAnalyticsConsent() === 'granted'` before creating Yandex/Google scripts, and `trackPageView()` repeats the same guard. The privacy page's `до согласия` statement is therefore consistent with the reviewed initial-start path.

This wave does **not** claim that analytics loads before the first explicit grant.

### Root cause

Consent state has one local custom event but no browser-wide state owner:

- `setAnalyticsConsent()` writes `tlp:analytics-consent:v1` and dispatches `ANALYTICS_CONSENT_EVENT` only in the current document;
- `AnalyticsConsentBanner` listens only to that custom event;
- `AnalyticsRouteTracker` listens only to that custom event and reacts only when detail is `granted`;
- neither component listens to the storage key across documents;
- analytics startup uses a module-level `started` flag;
- there is no application revocation/disable/teardown path after analytics has started.

### Deterministic two-tab witness

1. A and B open with no stored consent, so both render the banner.
2. In A, the reader selects `Разрешить`.
   - storage becomes `granted`;
   - A starts configured analytics;
   - B does not receive the custom event, so its already-mounted banner remains visible.
3. In B, the reader selects `Без аналитики` from that stale banner.
   - storage becomes `denied`;
   - B updates itself;
   - A receives no storage/custom-event convergence and does not execute any revocation path.
4. On A's later route changes, the Product's own `trackPageView()` re-reads storage and therefore stops sending its explicit page-view call.
5. However, already initialized analytics remains live in A's document. In particular, Yandex was initialized with `clickmap`, `trackLinks`, `accurateTrackBounce` and `webvisor`; Product code does not call any vendor-supported revoke/disable/destruct action when the browser consent becomes denied.

The defect is therefore not “our route tracker ignores denied”. It is that **the application has no mechanism that makes a later browser-level denial authoritative over already-started analytics in another document**.

This report does not assert, without live vendor/network instrumentation, the exact set of events each third-party script will transmit after that point. The verified engineering defect is the missing revocation/convergence owner: Product cannot enforce or prove that a later `denied` state has stopped the already initialized tracker.

### Blocked-storage honesty mismatch

`setAnalyticsConsent()` contains the comment:

> `Consent still applies to the current page even when storage is blocked.`

But it ignores `safeWrite()`'s boolean result. The banner sets local React state and disappears, then the route tracker's `send()` re-reads storage. If storage did not persist `granted`, `getAnalyticsConsent()` returns `null` and analytics does not start.

This path is privacy-safe, but the implementation/comment/UI state disagree: the UI behaves as if a choice became effective while the analytics owner treats it as no consent. The terminal fix should expose persisted/effective state explicitly instead of keeping two interpretations.

### Privacy-page boundary

The public privacy page says:

- analytics loads only after explicit consent;
- the decision is saved in the browser;
- the choice can be reset by deleting site data.

Initial startup honors the first statement. The current architecture does not provide a convergence/revocation contract for a later stored `denied`/cleared state across already-open documents.

### Existing validation gap

`validate-app-shell.ts` verifies only that analytics persistence uses `safeWrite()` instead of direct localStorage mutation. It does not test:

- two simultaneously open consent banners;
- cross-tab storage convergence;
- grant then later deny;
- teardown/disable after analytics startup;
- blocked-storage effective consent state.

No matching open Product repair owner was found by the targeted current search.

### Required terminal outcome

1. Make consent one browser-wide observable state with storage/custom-event convergence.
2. A stale tab must reconcile to the newer consent decision instead of allowing conflicting hidden state.
3. A transition to `denied` after startup must invoke a supported stop/revoke/teardown path for every configured analytics provider and prevent further Product-owned tracking.
4. Treat blocked persistence explicitly: either retain a clearly volatile in-memory consent state for the current document or keep the banner/choice unresolved; do not claim both persisted and current-page semantics simultaneously.
5. Add two-page browser regression proof for `null -> granted -> denied`, asserting state convergence and the absence of further Product/vendor tracker activity after denial using instrumented provider stubs.

---

## Existing-root additions

### `TLP-THEME-001`

`ThemeToggle` also treats the localStorage preference as mount-time state plus same-document mutation only. It does not listen to storage changes from another tab. This is absorbed into the existing theme/document owner row because the fix belongs with the same pre-paint/document-theme state owner; it is not a third new browser-state row.

### `TLP-AUDIT-004`

The current permanent suite demonstrates the recurring false-green class again:

- audio session tests are single-storage/single-writer;
- app-shell analytics checks protect `safeWrite` implementation style but not consent behavior or revocation;
- playback coordination being strong can create false confidence about the independent audio session key.

Add these cross-tab state transitions to the class-level audit-harness repair instead of creating separate test-only symptom rows.

## Checked distinction — Personal Archive remains the reference, not part of the defect

`myArchiveStore` already uses an operation/generation/writer model and storage-event repair that merges the current physical snapshot with `oldValue` and `newValue`. The poem-favorites side of `/archive` therefore demonstrates a materially stronger cross-tab conflict pattern than `audioSessionStore`.

The new audio finding does not reopen the previously closed personal-archive convergence work; it proves that the same reader-facing page combines one conflict-safe store with another non-convergent store.

## Audit disposition

After this wave the active matrix should contain **14 rows total: 1 P1 + 13 P2**.

- add `TLP-AUDIO-SESSION-001` as an independent P2 persistence/data-loss root;
- add `TLP-ANALYTICS-CONSENT-001` as an independent P2 privacy-consent state root;
- expand `TLP-THEME-001` with cross-tab stored-preference convergence;
- expand `TLP-AUDIT-004` with audio-session and analytics-consent browser-state false-green coverage;
- no Product mutation or repair lane is created by this evidence push.
