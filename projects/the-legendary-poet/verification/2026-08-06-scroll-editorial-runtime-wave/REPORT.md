# Scroll continuity and editorial voice verification wave

Date: 2026-08-06  
Project: `the-legendary-poet`  
Product base anchor: `dd2df7be196d81d5212b43a08616f782af2fecf6`  
Product repair: PR #334, branch `agent/native-scroll-editorial-pass-20260806`  
Exact tested Product head: `774804be169f53581ae85ab4b835be08537c532f`  
Product squash merge: `76ef482bedb1722b691ec1f301b403c3a28aad3d`  
Wave status: `closed-by-fix`

## Owner request

The owner reported intermittent severe downward-scroll stalls: the page could stop or become viscous in the middle of a wheel gesture. The same request asked for a complete additional audit rather than blindly repeating prior waves, and for the poet moral sections to lose service prose explaining that the site neither idealises the person nor diminishes the gift.

The scope was explicitly limited to The Legendary Poet. The concurrent Mayakovsky photo-verification lane was treated as an independent owner and was not modified. Its completed source merge `dd2df7be196d81d5212b43a08616f782af2fecf6` became the base of PR #334.

## Prior-corpus and concurrent-work check

The current AuditRepo entrypoint, document map, historical master matrix, W0–W7 evidence, open PRs, active branches, issues and recent scroll-related commits were checked before opening a new lane.

The prior corpus contained strong route, reader, browser, build-budget and interaction work. Earlier scroll work protected fixed-header anchor geometry, overlay restoration, mobile/WebKit reveal traversal and chrome behavior. It did not contain a finding or permanent witness for **continuous ordinary wheel-scroll ownership** and did not reject a global JavaScript wheel interpolator.

No existing issue matched the reported stall. The only meaningful concurrent Product lane was Mayakovsky media verification; it completed and merged before this repair was replayed on top of it. No media-verification file was changed by PR #334.

Disposition: this was not a duplicate request for a full W0–W7 replay. It was a new bounded runtime finding plus two audit-harness defects discovered during the repair.

## Finding TLP-SCROLL-001 — global JavaScript document scrolling

Priority: `P1 user-visible`  
Initial status: `current-local`  
Final status: `closed-by-fix`  
Root classification: `systemic-root`

### Source witness

The desktop app shell dynamically installed Lenis for the entire document with smooth wheel handling and advanced it through a permanent `requestAnimationFrame` loop. Ordinary wheel movement therefore depended on a healthy JavaScript main-thread frame instead of remaining browser-native.

Two additional owners increased work on the latency-sensitive path:

- fixed decorative poetry subscribed to document scroll through Framer motion values, although the effect was only a faint opacity change;
- the scroll-to-top control also used a Framer document-scroll subscription.

### Mechanism

A global smooth-scroll library cancels or replaces the browser's direct wheel response and interpolates toward a target from JavaScript. When React work, image decoding, layout, paint or another long task delays that loop, the document cannot continue through the browser's native compositor path. The visible result matches the owner report: a pause in the middle of the gesture followed by delayed or viscous catch-up.

This finding did not require every individual heavy frame to be isolated before repair. The class-level defect was that ordinary document movement had been made dependent on those frames.

### Product repair

- removed Lenis from document runtime ownership;
- restored native wheel, trackpad and touch scrolling for every pointer class;
- retained route-position restoration, hash geometry and the scroll-to-top command;
- removed the decorative backdrop scroll subscription;
- moved scroll-to-top visibility to one passive listener with RAF coalescing;
- expanded `validate-scroll-runtime.ts` to reject global JS scrolling, wheel interception, perpetual scroll RAF and decorative frame subscriptions;
- aligned the app-shell contract with the same native-ownership boundary;
- added a real browser witness with six desktop wheel impulses on a long poet page.

### Permanent witness

The Product contract now checks both behavior and class-level source invariants:

- missing and present anchors;
- fixed-header offset;
- reduced-motion behavior;
- nested overlay token ownership;
- absence of Lenis loading, `smoothWheel`, wheel interception and shell `preventDefault`;
- absence of decorative Framer scroll subscriptions;
- presence of one passive visibility listener for the scroll-to-top control.

The Chromium browser witness places the pointer over content, sends six real positive wheel impulses, requires measurable forward movement after every impulse, verifies all observed events remain `defaultPrevented === false`, requires more than 2,000 px total progress and rejects page errors.

An earlier diagnostic artifact, before the test harness was calibrated to place the synthetic pointer over content, already recorded six positive unprevented wheel events and final progress of 3,720 px. The final exact-head run passed the stricter per-impulse witness.

## Finding TLP-AUDIT-STYLE-001 — exact prose mistaken for an editorial contract

Priority: `audit-harness defect`  
Initial status: `current-local`  
Final status: `closed-by-fix`  
Root classification: `ST-TLP-AUDIT-HARNESS`

### Discovery witness

The first exact-head CI run for PR #334 passed the library, essay, content-model and other preceding checks, then failed the literary-style validator with 21 missing sentence fragments. Those fragments included the precise explanatory and defensive wording selected for removal.

The validator was protecting one historical draft, not the underlying facts, qualifications or theological boundaries. A legitimate editorial improvement could not pass without restoring obsolete prose.

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

## Finding TLP-AUDIT-SCROLL-001 — the app-shell contract required the defect

Priority: `audit-harness defect`  
Initial status: `current-local`  
Final status: `closed-by-fix`  
Root classification: `ST-TLP-AUDIT-HARNESS`

The app-shell validator explicitly required Lenis to remain a lazy enhancement and only required native scrolling for coarse-pointer devices. It therefore encoded the mechanism behind the reported desktop symptom as a desired invariant.

The contract now rejects any global JavaScript document scroller, wheel interception and shell-level cancellation, while continuing to require bounded history restoration, fixed-header hash geometry, reduced-motion behavior and the explicit scroll-to-top command.

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

## Exact-head verification

The following passed on Product head `774804be169f53581ae85ab4b835be08537c532f` before squash merge `76ef482bedb1722b691ec1f301b403c3a28aad3d`:

- Project contracts;
- Content model contract;
- full CI: literary invariants, app shell, overlay/pointer contracts, TypeScript, production build, budgets, prerender and SEO;
- Site route integrity across 35+ URLs;
- Brand deep-reference and motion audit;
- Chromium and Android Chrome QA, including the real wheel-continuity witness;
- base iPhone Safari in fresh browser processes;
- critical iPhone first viewport and reduced-motion contours;
- desktop WebKit home reveal and route QA;
- premium homepage and pointer-performance matrix.

All four Manual Browser QA jobs concluded `success` on the exact tested head.

## Scope boundaries and residual cleanup

- no image binary changed;
- no Mayakovsky media provenance file changed;
- no route contract changed;
- no essay body was rewritten by this lane;
- no live-production deployment claim is made by this source verification wave;
- the `lenis` package remains an unused install-only dependency in `package.json`/lockfile; runtime contracts forbid its use, and removing the dead package is a non-blocking dependency-cleanup task rather than part of the P1 runtime closure.

## Closure statement

TLP-SCROLL-001, TLP-AUDIT-STYLE-001 and TLP-AUDIT-SCROLL-001 are closed by Product PR #334 and squash merge `76ef482bedb1722b691ec1f301b403c3a28aad3d`.

The owner-reported mechanism is removed rather than tuned: ordinary document movement no longer depends on the application RAF. The repaired boundary is protected statically and by a real wheel-input browser witness. The editorial change is applied across all ten poet portraits and protected by semantic rather than sentence-level contracts.

## Reverify triggers

- reintroduction of a global document smooth-scroll library;
- a wheel/touch handler that cancels native document movement;
- new perpetual document-scroll RAF ownership;
- a concrete browser witness of another mid-gesture stall;
- change to route-restoration or overlay-lock ownership;
- a literary validator that again requires one exact editorial sentence rather than a semantic boundary;
- return of method-disclaimer prose to the visible poet portrait.
