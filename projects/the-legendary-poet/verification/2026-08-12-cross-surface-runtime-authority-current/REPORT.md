# Cross-surface runtime authority — current audit

Date: 2026-08-12  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: community identity/delivery and target ownership, light-theme document/surface ownership, persistent navigation/focus semantics, machine-readable discovery metadata, semantic poem rendering, authoring ID contracts and current audit-harness false-green boundaries.

## Current-source / collision check

`git compare d59cceccb0c49af59b1be38d4c547a6240b3005a...main` through the connected Product repository returned `identical`, `ahead_by=0`, `behind_by=0`. The current source therefore remains the same anchor used by the preceding community verification packages.

Targeted open Product issue/PR searches for light theme, community cross-tab/draft state, SEO/sitemap/OG metadata and accessibility/Command Palette/navigation found no matching current repair owner. This wave records current defects in AuditRepo only; it does not create a Product implementation lane.

## Result

The five previously active community rows remain current. Two of them gain materially stronger evidence, and seven independent current roots are added.

### Existing roots strengthened, not duplicated

- `TLP-COMM-ABUSE-001` — remains P1. It now also owns ordinary first-run browser-identity races and the absence of a trusted canonical-target check at the public write boundary.
- `TLP-COMM-DELIVERY-001` — remains P2 systemic. It now also owns Unicode client/server validation mismatch, cross-document duplicate flush ownership, server idempotency ordering, storage-failure ACK cleanup and stale-tab remote convergence.
- `TLP-COMM-ORDER-001` — unchanged.
- `TLP-COMM-A11Y-001` — unchanged.
- `TLP-COMM-READSTATE-001` — unchanged.

### New independent roots

- `TLP-COMM-TARGET-001` — P2 target/editor ownership: dirty rating/comment drafts are not keyed to `targetType:targetId` and can be submitted to a different SPA detail target.
- `TLP-THEME-001` — P2 systemic theme ownership: light mode is implemented through a whitelist of dark literal utilities plus global text recoloring instead of semantic surface/document tokens.
- `TLP-A11Y-RUNTIME-001` — P2 systemic interaction semantics: several shell/navigation/modal transitions have separate visual state and semantic focus/current-state owners.
- `TLP-DISCOVERY-001` — P2 systemic machine-metadata ownership: sitemap modification clocks and SPA head image dimensions have divergent authorities.
- `TLP-READER-TEXT-001` — P2 semantic reader text: the animated poem word layer doubles as the canonical semantic text layer even though it removes textual whitespace and disables native selection.
- `TLP-AUDIT-004` — P2 audit-harness false-green: several permanent tests measure stale strings/proxies rather than the current user outcome they claim to certify.
- `TLP-AUTHORING-ID-001` — P2 authoring/release contract: the documented `new-poet` scaffold can generate IDs/assets that are valid to the authoring/router layer but invalid to community/runtime contracts.

---

## Strengthening A — `TLP-COMM-ABUSE-001`

### First-run browser identity can split into two voters

`src/utils/communityIdentity.ts` uses a normal localStorage `read -> generate UUID -> write -> return` bootstrap. There is no lock, compare-after-write or cross-document arbitration. Two freshly opened tabs can both observe an empty key, generate UUIDs A/B and each return its own value before storage convergence.

`src/hooks/useCommunityFeedback.ts` calls `getCommunityDeviceId()` inside each rating/comment/helpful action rather than consuming one already-arbitrated application identity. The backend uniqueness keys are `(target_type, target_id, voter_id)` for ratings and `(comment_id, voter_id)` for helpful votes. Two first-run UUIDs from one browser therefore count as two independent participants.

This is not a new delivery row. The existing P1 root already says the public write boundary trusts a caller-controlled anonymous identifier as its primary integrity authority. The new witness proves that even non-adversarial first-use concurrency can violate the intended `one browser -> one voter` interpretation.

### Canonical target existence is not checked at the write boundary

The public RPCs validate target type and target-id syntax, but do not verify that the target exists in the canonical published Product registry. A caller can therefore write social-proof rows for syntactically valid future/nonexistent ids. A trusted server-side boundary should validate canonical target membership as part of the same P1 repair instead of relying on the client to only submit real Product ids.

### Regression additions

- two clean browser pages synchronize the first anonymous identity and produce exactly one rating for one target;
- rotating/generated UUIDs still cannot bypass the trusted write boundary;
- writes to unknown/noncanonical targets are rejected before they become public aggregate data.

---

## Strengthening B — `TLP-COMM-DELIVERY-001`

### Honest Unicode comment can become a permanent poison item

The browser checks comment minimum length using JavaScript string `.length` in both `useCommunityFeedback()` and the persisted-state sanitizer. JavaScript counts UTF-16 code units. PostgreSQL checks `char_length(clean_text)`, which counts characters.

A deterministic user-visible witness is `😀😀😀😀`:

1. browser `.length === 8`, so the comment is accepted locally, persisted and queued;
2. the UI returns success from the local commit path;
3. PostgreSQL `char_length(...) === 4`, so `tlp_submit_comment` raises `invalid comment length`;
4. transport collapses the response to boolean failure;
5. flush stops at that first item, leaving later valid operations behind it.

The existing hardening validator calls the queue `poison-safe`, but its poison fixture is malformed persisted state removed by the local sanitizer before network delivery; every mocked POST returns 204. It therefore does not exercise a syntactically valid operation that is permanently rejected by the real server contract.

Terminal delivery repair must use one explicit client/server Unicode length contract and distinguish permanent validation errors from transient retryable failures so a single rejected item cannot block later work.

### Cross-document duplicate flush ownership

`flushPromise` is module-local to one JS document. Every tab also installs its own `online -> flushCommunityOutbox()` listener. Two tabs holding the same persisted operation can therefore submit it concurrently.

For comments this interacts badly with the SQL order:

1. RPC validates comment and checks the 20-second voter rate limit;
2. only after that does `INSERT ... ON CONFLICT(id) DO NOTHING` provide idempotency.

If tab A already inserted comment X, tab B retrying the exact same comment X can still hit `comment rate limit` before the existing `id` is treated as success. If B has not yet processed A's storage removal, its failure path can increment `attempts` from stale state and whole-envelope write the already-delivered item back into storage.

Required direction: one cross-document flush lease/lock or equivalent conflict-safe sender ownership, plus server idempotency recognition before rate limiting for exact same operation identity.

### ACK cleanup can succeed only in memory

Successful delivery removes an outbox item through `applyState(..., allowMemoryFallback=true)`. If localStorage becomes unavailable after the operation was queued but before ACK cleanup, the in-memory state reports the operation removed while the old persisted envelope remains. Reload can resurrect the already delivered operation.

A regression must create a queue successfully, make storage fail only at ACK cleanup, then reload and prove the operation does not reappear or double-submit.

### Cross-tab remote data does not self-heal

Remote mutation invalidation is an in-memory listener set. Other tabs receive storage events, but no `visibilitychange`, `focus` or cross-document remote-invalidation signal forces `communityTargetStore` / leaderboard data to refetch after another tab successfully publishes a mutation. A tab can therefore return to the foreground and remain indefinitely on an old remote aggregate while local/persisted state has already changed.

This remains part of the delivery/convergence root rather than a separate read-state row: the missing mechanism is cross-document publication invalidation after a successful write.

---

## Finding C — `TLP-COMM-TARGET-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / DATA-INTEGRITY / TARGET-STATE**

### Mechanism

Page-level `CommunityPanel` instances for poet, essay/article and track detail are rendered in stable component positions without a `key` based on `targetType:targetId`.

`RatingForm` deliberately preserves a dirty draft instead of applying new initial values when its dimension signature remains the same. Different poets share the same poet dimension keys; different tracks share the same track keys. `CommentComposer` has local author/text/kind state but receives no target identity at all.

In the browser path where native View Transitions are supported, `RouteContent` does not wrap pathname changes in the fallback keyed `motion.div`. Dynamic param changes such as `/poets/A -> /poets/B` can therefore reuse the same page/component instance instead of receiving the incidental remount that the fallback branch provides.

Natural SPA paths exist in current Product UI:

- poet detail -> another poet through `KindredSpirits`;
- track detail -> another track through `Other musical publications` / `TrackReleaseCard`;
- essay detail -> sibling article through series previous/next navigation.

`useCommunityFeedback()` itself switches target records correctly. The dangerous mismatch is narrower: aggregate/title/callbacks already belong to target B while the local editor can still contain unsent draft state created for target A.

### User-visible consequence

A reader can begin rating or writing a comment for A, navigate to B through an ordinary SPA link, see the old draft still present and submit it into B's now-current mutation closure. This is wrong-target user data, not merely stale visual state.

### Required terminal outcome

Make `targetType:targetId` explicit editor state ownership. Either key the stateful community editor subtree by target identity or make each form detect target changes and reset/prompt according to an explicit draft policy. Add browser regressions for poet->poet, track->track and essay->essay dirty-draft transitions on the View-Transitions branch.

---

## Finding D — `TLP-THEME-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / SYSTEMIC / THEME-OWNERSHIP**

### Root cause

Light mode is not expressed through a complete semantic set of surface/text/document tokens. Instead, global CSS rewrites selected literal Tailwind dark colors and globally recolors common white text classes. New custom hex values, arbitrary gradients and inline `var(--track-surface)` backgrounds can therefore stay dark while their text is converted to the light-theme dark foreground.

### Current witnesses

- `/ratings` uses `#071018` surfaces not covered by the current light override while parent `text-white` is rewritten to a dark foreground; the resulting dark-on-dark contrast is approximately 1.3:1.
- Command Palette uses `bg-[#050b12]/95` with `text-white`; its chrome CSS provides no independent light-mode ownership.
- Global mini-player derives its surface from track-theme inline dark composition, while common white text is globally recolored.
- CommentComposer and ErrorBoundary contain custom dark surfaces outside the whitelist.
- consent-banner custom dark surface has the same config-dependent risk.
- saved light preference is applied by a React effect after initial paint rather than a pre-paint document bootstrap.
- `html.style.colorScheme` changes, but document `theme-color` / static `color-scheme` metadata and install manifest remain dark-oriented.

Current browser route certification is explicitly dark-scheme; the route/light combination that exposes these failures has no permanent browser witness.

### Required terminal outcome

One semantic theme owner must define document background, nested surfaces, text, borders and browser chrome. Remove substring/literal-color dependence for mode conversion, apply persisted mode before first paint, synchronize relevant document metadata and certify representative routes/overlays/audio/community surfaces in light mode with computed contrast assertions.

---

## Finding E — `TLP-A11Y-RUNTIME-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / SYSTEMIC / FOCUS-NAV-SEMANTICS**

### Root cause

Several interaction surfaces keep visual state, router section state and DOM focus/semantic state in separate mechanisms. The UI can therefore look current/hidden/active while the accessibility tree or keyboard focus says something else.

### Manifestation 1 — Command Palette has two active authorities

The dialog owns a visual `activeIndex`, while results and close are ordinary focusable buttons. `onDialogKeyDown` handles every bubbling Enter on the entire dialog and always selects `results[activeIndex]` without checking the actual focused target.

Deterministic witness: Tab to `Закрыть поиск`, press Enter; the dialog handler prevents the button's normal action and navigates to the visual active result instead. Likewise, focus on a non-active result button can still submit the separate `activeIndex` destination.

The input declares a combobox controlling a `role=listbox`, but the result buttons are not `role=option`, have no `aria-selected`, and the combobox has no `aria-activedescendant`. Keyboard focus and the advertised listbox model therefore disagree.

### Manifestation 2 — hidden reading chrome remains tabbable

`useAutoHideChrome()` only reacts to scroll position/direction. CSS moves Header/MobileDock offscreen by `transform`; it does not use inertness/visibility/tab-index changes and has no focus-in path that restores chrome. Keyboard focus can therefore enter transformed-offscreen navigation.

### Manifestation 3 — persistent section ownership is ad hoc

`Статьи` navigation points to `/articles`, but article detail lives at `/essays/:slug`. Header and MobileDock use prefix-style active checks and therefore lose the `Статьи` current state on every essay detail, while Breadcrumbs correctly know the section relationship. Desktop Header also lacks a programmatic `aria-current` state.

### Manifestation 4 — same-path command navigation loses focus owner

Command selection suppresses focus restoration because route navigation is expected to move focus to the new main landmark. `RouteContent` performs that handoff only when pathname changes. Selecting the already-open route or another same-path URL can close the dialog, remove the focused element and perform no replacement focus handoff.

### Manifestation 5 — immersive track replacement deletes focused DOM

`ImmersivePlayer` keeps the modal logically open while its dialog root is keyed by `currentTrack.id`. Activating Next/Previous replaces the entire keyed dialog subtree, including the focused control. `useDialogSurface` updates the overlay root but its initial-focus effect does not restart because `open` remains true. Focus is therefore lost until a later Tab event is trapped back into the dialog.

### Manifestation 6 — duplicate main landmarks on policy pages

The application shell already owns `<main id="main-content">`. Privacy and EditorialPolicy pages render another `<main>` inside that shell, creating nested main landmarks on those routes.

### Required terminal outcome

Create one interaction/semantic contract for persistent navigation and modal transitions:

- route metadata or one section mapper owns current-section semantics, including `/essays -> articles`;
- persistent navigation exposes `aria-current`;
- hidden chrome cannot receive invisible keyboard focus and must reveal on focus when appropriate;
- Command Palette uses one keyboard model (real focused options or complete `aria-activedescendant` roving semantics) and never hijacks Enter from ordinary controls;
- same-path navigation has an explicit post-close focus owner;
- keyed modal content replacement re-establishes focus inside the replacement dialog;
- enforce one main landmark in the app shell;
- certify representative Chromium + WebKit keyboard journeys.

---

## Finding F — `TLP-DISCOVERY-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / SYSTEMIC / MACHINE-METADATA-OWNERSHIP**

### Root cause

Machine-readable route metadata has multiple partial owners: content data, sitemap heuristics, prerender metadata mutation and client-side `useSeo()`. The same route therefore does not have one canonical modification/image contract across sitemap, direct HTML and SPA navigation.

### Current witness 1 — sitemap poet clock can omit real poet modifications

Poet detail `<lastmod>` is derived from related essay/music dates rather than a modification clock owned by the poet record. `/poets/fyodor-tyutchev` currently has no own lastmod even though its canonical poet content changed in source history. The generator has no field from which to express that poet-record modification.

### Current witness 2 — broad route lastmod can move on unrelated child changes

The inverse also occurs: aggregate routes such as `/poets` and `/ratings` can inherit a maximum content date and advance when one child/article cover is updated, despite no modification to those routes' own reader contract. The clock can therefore be false in both directions: omit own change and advertise unrelated change.

### Current witness 3 — direct HTML and SPA head disagree on route-image dimensions

Root HTML contains default OG image dimensions `1200x630`. `prerender-og.mjs` explicitly removes those tags when a route uses a non-default portrait/cover because the dimensions cannot be copied to arbitrary artwork. Client `useSeo()` updates image URL, MIME and alt but does not remove/reset width/height.

Result: direct `/poets/:id` prerender can have correct route image metadata, while `Home -> poet` SPA navigation can leave the portrait associated with stale `1200x630` dimensions.

### Required terminal outcome

Define one route metadata contract that owns modification clocks and social-image facts, derive sitemap/prerender/runtime from it, and add parity checks proving direct HTML and equivalent SPA navigation produce the same canonical/robots/OG image metadata. Lastmod must represent documented route modification authority rather than maximum unrelated child/build timestamps.

---

## Finding G — `TLP-READER-TEXT-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / ACCESSIBILITY / SEMANTIC-TEXT**

### Mechanism

`InteractivePoemText` renders each word as a sibling animated `<motion.span>`. The textual spaces between those spans do not exist as text nodes; visual separation is provided by flex gaps/margins. The outer poem container is also `select-none`.

There is no separate semantic canonical text layer (`aria-label`, sr-only original text, or visual spans hidden from assistive extraction). The visually transformed word layer is therefore also the only semantic DOM representation of the poem.

### Consequences that are directly source-provable

- DOM `textContent` for a rendered line does not preserve the original spaces between words;
- native selection/copy is intentionally disabled on the core poem text;
- generic selection-based `ShareLine` cannot operate on that reader surface;
- assistive extraction has no independent canonical whitespace-preserving text source and must depend on the fragmented visual spans.

This report does **not** claim without an AT browser witness that every screen reader necessarily pronounces every line as one joined token. The verified defect is the architecture: a visual layer that intentionally transforms whitespace/selection also owns the semantic text.

### Required terminal outcome

Separate canonical poem semantics from animated presentation. Preserve the exact original text for selection/copy/assistive extraction and mark presentation-only word spans appropriately. Add DOM text/copy and at least one real accessibility-engine browser regression without removing the visual reading effect.

---

## Finding H — `TLP-AUDIT-004`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / AUDIT-HARNESS / FALSE-GREEN**

### Current false-green witnesses

1. A manual/browser error-boundary detector looks for legacy phrases such as `что-то пошло не так`, `не удалось загрузить страницу` or `application error`; the current ErrorBoundary says `Страница остановлена безопасно / Попробуем восстановить страницу`. A real current fallback can therefore be invisible to that detector.
2. Main route/deep browser profiles explicitly use dark color scheme and do not certify representative light-theme route/overlay combinations, allowing the current theme regression class to stay green.
3. Reader archive->poem journey manually calls `scrollIntoViewIfNeeded()` on the destination after navigation, so it cannot prove that production hash restoration itself moved the viewport correctly. Citation tests check DOM/CSS visibility but not destination focus.
4. Community hardening calls the outbox poison-safe while malformed poison is removed before network and every mock POST succeeds; permanent server-validation poison is not exercised.
5. SEO output validation checks that structured data/meta are present in prerendered documents but not direct-vs-SPA head parity, so stale runtime OG dimensions remain outside the certified boundary.

### Root cause

Permanent QA still contains proxy/string assertions that do not always measure the exact current behavior named by the test. This is the same class that historical audit-harness hardening attempted to eliminate, but these are new current witnesses and therefore do not reopen old symptom IDs.

### Required terminal outcome

Replace the stale/proxy checks with user-outcome contracts:

- current ErrorBoundary detection through role/semantic marker rather than copy text;
- light-theme representative route/overlay contrast certification;
- hash navigation must prove viewport destination and keyboard focus without test-authored scrolling/focus;
- community poison test must model a syntactically valid permanent server rejection and later valid queued work;
- direct-vs-SPA SEO metadata parity witness.

---

## Finding I — `TLP-AUTHORING-ID-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / AUTHORING-RELEASE-CONTRACT**

### Mechanism

The documented `new-poet` scaffold can derive its default id directly from a Russian surname/name transformation instead of requiring the same ASCII-kebab identity accepted by all downstream consumers. That id also feeds the generated portrait path and initial poem id.

The current router/data layer can represent such string ids, but the community persistence layer requires ASCII `[a-z0-9-]` target ids. A scaffolded Cyrillic poet and poem therefore become valid enough to render while ratings/comments are rejected locally before storage.

`useCommunityFeedback()` maps a failed local `commit*` to copy saying the browser blocks local storage. In this scenario storage can be perfectly healthy; the actual failure is the generated target id violating the community contract. The scaffold/guide portrait-path examples also diverge in transliteration expectations, and the library validator does not make one cross-consumer canonical ID/asset contract authoritative.

### Required terminal outcome

Make authoring IDs a single release invariant:

- scaffold requires/derives stable ASCII-kebab IDs with deterministic transliteration rules;
- poet id, poem id, route id, community target id and generated asset path are validated together;
- documented guide and generated output agree;
- validation errors identify the actual contract rather than reporting blocked browser storage;
- add a fixture using a Cyrillic author name and prove the generated module passes the full identity/asset/community preflight.

---

## Checked and removed candidates

The following were explicitly rechecked and are **not** promoted as new rows:

- ErrorBoundary does not expose a dead same-visit `Повторить` action; its recovery button performs a real full reload and the fallback has `role=alert`.
- track detail `?t=` timestamp is reactive; changing query time on the same pathname re-applies `loadTrack(...startAt)`.
- late community reads are bound to their original `TargetRecord` and do not write old target data into the new target record.
- `useDialogSurface` has a real Tab containment loop for the topmost modal; generic keyboard escape from a modal is not the current defect.
- EssayHero visibly labels `archive/restoration/reconstruction/document` cover kinds and credits; the current Yesenin article-cover reconstruction does not silently present itself as an archival photograph.
- Personal Archive v4 remains a useful conflict-safe reference: generation/tombstone merge plus `current + oldValue + newValue` storage-event repair is materially stronger than the community whole-envelope writer.
- playback claim arbitration remains deterministic through Lamport sequence/tie-break; the independent audio problem is persistence/focus lifecycle rather than claim ordering.

## Optional product/editorial transparency — not active rows in this wave

- Privacy copy does not currently explain the stable pseudonymous community device UUID/local outbox in detail. Public views do not expose `voter_id`, so this is recorded as transparency hardening rather than a proven data leak.
- Article data can carry `dateModified`, while visible hero copy primarily shows publication date. Whether every substantial edit needs an explicit reader-facing `Обновлено` label is an editorial/product decision unless a stronger public promise is selected.
- Command Palette copy can imply broader site coverage than its current index; Footer still exposes the omitted policy/archive destinations, so this is not a navigation dead-end.

## Audit disposition

Active matrix after this wave should contain **12 rows total: 1 P1 + 11 P2**.

- retain the existing five community rows;
- expand `TLP-COMM-ABUSE-001` and `TLP-COMM-DELIVERY-001` with the evidence above instead of adding duplicate symptoms;
- add seven independent P2 roots: `TLP-COMM-TARGET-001`, `TLP-THEME-001`, `TLP-A11Y-RUNTIME-001`, `TLP-DISCOVERY-001`, `TLP-READER-TEXT-001`, `TLP-AUDIT-004`, `TLP-AUTHORING-ID-001`;
- no Product repair lane is selected by this AuditRepo write;
- Product source remains unchanged by this audit wave.
