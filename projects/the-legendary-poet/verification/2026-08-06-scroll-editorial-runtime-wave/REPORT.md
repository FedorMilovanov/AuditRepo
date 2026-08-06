# Scroll continuity and editorial voice verification wave

Date: 2026-08-06  
Project: `the-legendary-poet`  
Product base anchor: `dd2df7be196d81d5212b43a08616f782af2fecf6`  
Product repair: PR #334, branch `agent/native-scroll-editorial-pass-20260806`  
Current exact Product head: `1add78cbc4be86e59e2d1a07f9090d72213c9f3b`  
Wave status: `fixing / exact-head verification in progress`

## Owner request

The owner reported intermittent severe downward-scroll stalls: the page could stop or become viscous in the middle of a wheel gesture. The same request asked for a complete additional audit rather than blindly repeating prior waves, and for the poet moral sections to lose service prose explaining that the site neither idealises the person nor diminishes the gift.

The scope was explicitly limited to The Legendary Poet. The concurrent Mayakovsky photo-verification lane was treated as an independent owner and was not modified. Its completed source merge `dd2df7be196d81d5212b43a08616f782af2fecf6` became the base of PR #334.

## Prior-corpus check

The current AuditRepo entrypoint, document map, historical master matrix, W0–W7 evidence and system themes were checked before opening a new lane.

The prior corpus contained strong route, reader, browser, build-budget and interaction work, but no finding or permanent witness for **continuous ordinary wheel-scroll ownership**. The existing Product scroll validator checked anchor geometry, reduced motion and overlay ownership. It did not reject a global JavaScript wheel interpolator and did not model the user symptom.

Disposition: this was not a duplicate request for a full W0–W7 replay. It was a new bounded runtime finding plus one audit-harness defect discovered during the repair.

## Finding TLP-SCROLL-001 — global JavaScript document scrolling

Priority: `P1 user-visible`  
Initial status: `current-local`  
Root classification: `systemic-root`

### Source witness

The desktop app shell dynamically installed Lenis for the entire document with smooth wheel handling and advanced it through a permanent `requestAnimationFrame` loop. Ordinary wheel movement therefore depended on a healthy JavaScript main-thread frame instead of remaining browser-native.

Two additional owners increased work on the latency-sensitive path:

- fixed decorative poetry subscribed to document scroll through Framer motion values, although the effect was only a faint opacity change;
- the scroll-to-top control also used a Framer document-scroll subscription.

### Mechanism

A global smooth-scroll library cancels or replaces the browser's direct wheel response and interpolates toward a target from JavaScript. When React work, image decoding, layout, paint or another long task delays that loop, the document cannot continue through the browser's native compositor path. The visible result matches the owner report: a pause in the middle of the gesture followed by delayed or viscous catch-up.

This finding does not require every individual heavy frame to be isolated before repair. The class-level defect is that ordinary document movement was made dependent on those frames.

### Repair in Product PR #334

- removed Lenis from document runtime ownership;
- restored native wheel, trackpad and touch scrolling;
- retained route-position restoration, hash geometry and the scroll-to-top command;
- removed the decorative backdrop scroll subscription;
- moved scroll-to-top visibility to one passive listener with RAF coalescing;
- expanded `validate-scroll-runtime.ts` to reject global JS scrolling, wheel interception, perpetual scroll RAF and decorative frame subscriptions.

### Permanent witness

The Product contract now checks both behavior and class-level source invariants:

- missing and present anchors;
- fixed-header offset;
- reduced-motion behavior;
- nested overlay token ownership;
- absence of Lenis loading, `smoothWheel`, wheel interception and shell `preventDefault`;
- absence of decorative Framer scroll subscriptions;
- presence of one passive visibility listener for the scroll-to-top control.

## Finding TLP-AUDIT-STYLE-001 — exact prose mistaken for an editorial contract

Priority: `audit-harness defect`  
Initial status: `current-local`  
Root classification: `ST-TLP-AUDIT-HARNESS`

### Discovery witness

The first exact-head CI run for PR #334 passed the library, essay, content-model and other preceding checks, then failed the literary-style validator with 21 missing sentence fragments. Those fragments included the precise explanatory and defensive wording selected for removal.

The validator was therefore protecting one historical draft, not the underlying facts, qualifications or theological boundaries. A legitimate editorial improvement could not pass without restoring obsolete prose.

### Repair

The poet checks were converted from frozen exact sentences to named semantic invariants. Each invariant accepts a small bounded set of equivalent textual witnesses while preserving the required historical claim, uncertainty boundary, responsibility or conclusion.

The validator now also rejects service scaffolding in the published moral portrait and conclusion, including formulations such as:

- `честный портрет`;
- `редактору достаточно`;
- `не даёт редактору права`;
- `не нуждается в приукрашивании`;
- `не приукрашиваем`;
- `не умаляем`.

Essay-specific established contracts remain unchanged.

## Editorial outcome

The visible warning at the start of the moral section was removed. The section is now titled `Характер и поступки`, which names its subject without announcing the site's method.

The former branded `Авторская ремарка` is now a natural `Итог` and is rendered after spiritual context, historical context, the character-and-actions section and testimonies.

All ten current poet portraits received publication overrides that:

- begin with the person, event or choice rather than an editorial defence;
- distinguish evidence from uncertainty inside the relevant sentence;
- state responsibility and consequences directly;
- reserve synthesis for the final paragraph or `Итог`;
- preserve the poet's artistic achievement without inserting a repeated formula about preserving it.

The underlying authoring records were not destructively rewritten; the publication boundary applies the reviewed versions centrally.

## Scope boundaries

- no image binary changed;
- no Mayakovsky media provenance file changed;
- no route contract changed;
- no essay body was rewritten by this lane;
- no live-production claim is made before deployment evidence exists.

## Closure requirements

This wave becomes `closed-by-fix` only after:

1. exact Product head passes Project contracts, Content model contract and full CI;
2. route integrity and brand/motion audits pass on the same head;
3. Manual Browser QA passes the repository's four supported browser profiles on the same head;
4. PR #334 is merged without losing the Mayakovsky media base;
5. this report is updated with the exact tested head and merge SHA.

## Reverify triggers

- reintroduction of a global document smooth-scroll library;
- a wheel/touch handler that cancels native document movement;
- new perpetual document-scroll RAF ownership;
- a concrete browser witness of another mid-gesture stall;
- change to route-restoration or overlay-lock ownership;
- a literary validator that again requires one exact editorial sentence rather than a semantic boundary;
- return of method-disclaimer prose to the visible poet portrait.
