# Agent Audit Report — Hermeneutics UI

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: GPT-5.5 Thinking / source UI auditor
- Date: 2026-07-09
- Audited branch: `main`
- Audited/current source SHA: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- Current HEAD at start/end: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- AuditRepo base: `18713174a343740cc0886df6c6441c51bde61274`
- Environment: direct GitHub source inspection
- Build mode: source-only audit
- Browser / device: not used by the agent
- Owner witness: active Scripture references inside numeric footnote popovers close/break the parent popover

## Verification boundary

This report provides one independent source witness plus an owner-reported browser symptom. It does not claim a production-like build, screenshot, accessibility-tree capture or automated interaction trace.

```text
W1 source witness
verified-source
needs cross-verification
not repair-ready by this intake alone
```

All severities are proposals pending canonical verification.

---

## 1. New Findings

### HERM-UI-001 — Active Scripture buttons nested inside footnote triggers create competing tooltip controllers

- Proposed severity: **P1**
- Route: `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Source files:
  - `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
  - `js/site.js`
  - `js/site-utils.js`
- Observed on SHA: `d579745c`
- Owner-reported repro: open/hover a numbered footnote that contains a Scripture reference, then move the pointer onto that Scripture reference; the footnote closes or becomes unstable.
- Expected: Scripture citations inside a footnote's explanatory text are static text. The already-open footnote remains open and readable.
- Actual source contract:
  1. `.fn-marker` is a focusable `span role="button"` and contains `.tooltip` inline.
  2. Several `.tooltip` bodies contain real nested `<button class="bref" data-ref="…">` elements.
  3. `site.js` initializes **every** `.bref[data-ref]` as a Bible tooltip trigger, without excluding `.fn-marker .tooltip` descendants.
  4. `site-utils.js` globally closes other tooltip controllers whenever one controller opens.
  5. Entering a nested Bible trigger therefore closes the footnote controller before opening the Bible controller.
- Confirmed affected footnote numbers in source: **40, 72, 75, 82, 83 and 107**. Footnote 83 alone contains a long chain of active Bible buttons.
- Additional defect: interactive `<button>` descendants are nested inside an ancestor exposed as `role="button"`, creating invalid/ambiguous interaction semantics and keyboard focus behavior.
- Confidence: **high** for root cause; owner supplied matching browser symptom.
- Required next witness: desktop pointer trace + keyboard trace + mobile bottom-sheet trace on production-like dist.
- Preferred repair:
  - replace `button.bref[data-ref]` **inside footnote tooltip text only** with plain, non-focusable citation text at the Astro source;
  - preserve active Scripture buttons in the article body and FAQ;
  - do not solve primarily with a global runtime selector exclusion, because that leaves invalid/no-op interactive markup in source.
- Acceptance criteria:
  - `document.querySelectorAll('.fn-marker .tooltip .bref[data-ref]').length === 0`;
  - no `button`, `a`, `[tabindex]` or `[role=button]` descendants inside `.fn-marker .tooltip`, unless explicitly approved;
  - hovering/clicking static references inside a footnote never changes which footnote is open;
  - body/FAQ Bible references remain interactive;
  - keyboard and touch tests pass.
- Suggested repair lane: `lane/hermenevtika-footnote-static-scripture-2026-07-09`
- Do not mix with: shared tooltip-controller refactor, Gill, TTS, or content rewriting.

### HERM-UI-002 — Exact 1200 px breakpoint leaves neither desktop rail nor mobile bars

- Proposed severity: **P2**
- Source files:
  - `HermenevtikaRail.astro`
  - `HermenevtikaMobileBar.astro`
  - `css/floating-cluster.css`
- Observed on SHA: `d579745c`
- Expected: one complete navigation/control surface is visible at every viewport width.
- Actual deterministic CSS seam:
  - desktop rail: `@media(max-width:1200px){ .hrail{display:none} }`;
  - mobile bars render only under `@media(max-width:1199px)` and are force-hidden at `@media(min-width:1200px)`;
  - article desktop offset starts at `@media(min-width:1200px)`;
  - Hermeneutics floating cluster below 1200 contains only theme and is hidden at `max-width:1199px`.
- At exactly **1200 CSS px**:
  - `.hrail` is hidden;
  - `.hmtop` and `.hmbar` are hidden;
  - search, Play, Save, TOC and font controls disappear;
  - the article receives desktop left clearance despite the absent rail.
- Confidence: **high** from mutually exclusive media-query logic.
- Required next witness: screenshots at 1199, 1200 and 1201 CSS px with deviceScaleFactor 1 and 2.
- Preferred repair: choose one canonical boundary and use it consistently (`max-width:1199px` / `min-width:1200px`, or an equivalent non-overlapping pair).
- Acceptance criteria: exactly one intended control surface at 1199/1200/1201; no horizontal jump or missing controls.
- Suggested repair lane: same route UI lane as HERM-UI-003…006.

### HERM-UI-003 — Mobile TOC sheet violates modal focus lifecycle and presents two unsynchronised search fields

- Proposed severity: **P2**
- Source file: `HermenevtikaMobileBar.astro`
- Observed on SHA: `d579745c`
- Expected for `role="dialog" aria-modal="true"`:
  - focus moves into the sheet on open;
  - focus remains within the modal while open;
  - Escape/close returns focus to the opener;
  - the visible search state is singular and coherent.
- Actual:
  - typing in `#hmTocSearch` opens the sheet, but focus stays in that top-bar input behind the overlay;
  - the sheet simultaneously displays a second, blank `#hmSheetSearch` input;
  - no focus transfer, focus trap, initial-focus target or return-focus logic exists;
  - background content is not made inert;
  - Escape only toggles classes/ARIA and does not restore focus.
- User impact: keyboard/screen-reader users can interact outside an `aria-modal` dialog; touch users may continue typing into a visually covered input while a second empty search field is shown.
- Confidence: **high** source observation; rendered severity needs browser/a11y-tree witness.
- Preferred repair:
  - define one search model and synchronise both surfaces, or use only the sheet search after open;
  - store opener, focus sheet search/close on open, trap Tab, return focus on close;
  - use `inert` with fallback for background content.
- Acceptance criteria: axe/manual keyboard dialog checks; one query value; no focus behind overlay.

### HERM-UI-004 — Mobile TOC sheet uses unsafe direct body overflow mutation

- Proposed severity: **P2**
- Source file: `HermenevtikaMobileBar.astro`
- Observed on SHA: `d579745c`
- Actual code:
  - open: `document.body.style.overflow = 'hidden'`;
  - close: `document.body.style.overflow = ''`.
- Risk:
  - closing the TOC can unlock page scrolling while another overlay/controller still owns a scroll lock;
  - any pre-existing inline overflow value is destroyed;
  - the implementation bypasses the site's shared tooltip/mobile-sheet lock infrastructure.
- Repro candidates: open another modal/tooltip sheet, open/close TOC, then test background scroll; repeat in reverse order.
- Confidence: **high** source risk, browser interaction pending.
- Preferred repair: use the shared reference-counted/named scroll-lock API and release only this sheet's lock source.
- Acceptance criteria: nested overlay order never unlocks the document prematurely; original overflow state is preserved.
- Do not mix with: unrelated global tooltip redesign unless verifier promotes a shared-system defect.

### HERM-UI-005 — Reading progress and “time left” measure the whole page, not the article

- Proposed severity: **P2**
- Source files:
  - `HermenevtikaMobileBar.astro`
  - `HermenevtikaBody.astro`
- Observed on SHA: `d579745c`
- Expected: progress/time-left represent the 50-minute article reading range.
- Actual formula: `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`.
- The document continues after `</article>` with:
  - accuracy/feedback block;
  - related-article cards;
  - Soli Deo Gloria end block;
  - footer.
- Result: at the end of the article body the reader may still see remaining time and sub-100% progress; unrelated footer/related-card scrolling is counted as reading the article.
- Confidence: **high** source observation.
- Preferred repair: compute progress against explicit article start/end anchors, clamp to 0–100, and use the same range for remaining time.
- Acceptance criteria: 0% near article start; 100% at article end before related content; remains 100% below it.

### HERM-UI-006 — TOC sheet close transition cannot visibly run; open transition is fragile

- Proposed severity: **P3**
- Source file: `HermenevtikaMobileBar.astro`
- Observed on SHA: `d579745c`
- CSS contract:
  - `.hmsheet { display:none }`;
  - `.hmsheet.is-open { display:block }`;
  - panel transform transitions between `translateY(100%)` and `translateY(0)`.
- Actual lifecycle:
  - removing `.is-open` immediately restores `display:none`, so the closing transform is never painted;
  - adding `.is-open` changes display and transform in one style update, making entry animation browser-dependent/fragile.
- Confidence: **high** for close snap; entry needs browser confirmation.
- Preferred repair: keep overlay rendered during exit, use opacity/visibility/pointer-events plus `transitionend`, and respect `prefers-reduced-motion`.
- Acceptance criteria: smooth open/close where motion is allowed; immediate accessible close under reduced motion; no invisible focusable sheet.

### HERM-UI-007 — Desktop rail list contains an invalid direct `<span>` child of `<ul>`

- Proposed severity: **P2**
- Source file: `HermenevtikaRail.astro`
- Observed on SHA: `d579745c`
- Actual markup: `<ul class="hrail-toc">` contains `<span class="hrail-track">` before mapped `<li>` elements.
- Expected: a list's direct children are list items (apart from script/template allowances); decorative track belongs outside the list or in a semantically neutral wrapper.
- Risk: validator/accessibility-tree inconsistencies and brittle list navigation.
- Confidence: **high** source semantics.
- Preferred repair: move `.hrail-track` outside `<ul>` into `.hrail-scroll` or implement it as a pseudo-element.
- Acceptance criteria: valid list structure; visual track unchanged; screen-reader list item count equals TOC item count.

### HERM-UI-008 — Hermeneutics control comments contradict current implementation and can trigger regressions

- Proposed severity: **P3 documentation/maintainability**
- Source files:
  - `HermenevtikaRail.astro`
  - `SingleArticleCluster.astro`
  - `HermenevtikaBody.astro`
  - `HermenevtikaMobileBar.astro`
  - `css/floating-cluster.css`
- Observed on SHA: `d579745c`
- Current CSS explicitly makes the desktop rail Play pill bloom **DOWN**.
- Stale comments still claim:
  - the rail Play blooms UP;
  - the Hermeneutics floating cluster is the restored theme/search/Play/save cluster, although that variant now renders theme only;
  - the mobile top-bar search opens the sitewide command palette, while markup/script implement a local TOC input.
- Risk: another agent follows comments instead of current contract and reintroduces direction, duplication or search-scope defects.
- Confidence: **high**.
- Preferred repair: update comments in the same route lane; no visual change or editorial date update.

### HERM-UI-009 — Visible article update date and machine metadata disagree

- Proposed severity: **P2 metadata/editorial consistency**
- Source files:
  - `HermenevtikaBody.astro`
  - `HermenevtikaPageHead.astro`
- Observed on SHA: `d579745c`
- Visible byline: `Обн. 9 мая 2026`.
- Head/structured metadata observed during audit: modified date on 2026-07-09.
- Project invariant: technical CSS/JS/UI work must not silently advance editorial freshness.
- Risk: users and crawlers receive different claims; technical UI commits can appear as substantive editorial updates.
- Confidence: **high** for mismatch; intended canonical date requires owner/editorial decision.
- Required next step: compare `article:modified_time`, JSON-LD `dateModified`, sitemap `lastmod`, visible byline and actual editorial changelog; choose one truthful value.
- Do not auto-change dates inside a UI repair lane without owner/editorial confirmation.

### HERM-UI-010 — `SITE_CONFIG.features.footnotes.enabled` is false while custom footnotes are active

- Proposed severity: **P3 configuration drift**
- Source file: `HermenevtikaPageHead.astro`
- Observed on SHA: `d579745c`
- Actual: page config advertises `footnotes.enabled: false`, while the article contains many active `.fn-marker` tooltip footnotes initialized by shared runtime.
- Risk: future feature-gated code, audits or analytics can conclude that footnotes are absent and skip required behavior/tests.
- Confidence: **high** source observation.
- Preferred repair: either set the flag truthfully or document that it refers to a different legacy footnote subsystem and rename it to remove ambiguity.

---

## 2. Confirmations of Existing Findings

No existing canonical row was directly edited or promoted. HERM-UI-001 is related to the active owner Bible-tooltip track, but this intake treats the nested-footnote conflict as a distinct candidate until verifier reconciliation.

## 3. Challenges / Disputes

None.

## 4. Duplicate / Merge Proposals

- HERM-UI-003, HERM-UI-004 and HERM-UI-006 share the mobile TOC dialog lifecycle and may be repaired in one route-local modal pass.
- HERM-UI-008 should be corrected opportunistically with the component it documents, but must not mask visual changes.

## 5. Severity Proposals

Priority order proposed:

1. HERM-UI-001 — P1, owner-reproduced interaction break.
2. HERM-UI-002 — P2, deterministic responsive control loss.
3. HERM-UI-003/004/005/007/009 — P2.
4. HERM-UI-006/008/010 — P3.

## 6. Repair Lane Suggestions

See `proposals/proposal-hermenevtika-ui-repair-lanes.md`.

## 7. Reverify Notes

Mandatory viewport/browser matrix after implementation:

- Desktop Chrome/Firefox/Safari-equivalent at 1199/1200/1201 and 1366 px.
- Keyboard: Tab/Shift+Tab/Escape through footnotes and mobile TOC dialog.
- Touch emulation at 320, 360, 390, 768 and 1199 px.
- Open footnotes 40, 72, 75, 82, 83 and 107; move pointer over every citation.
- Open TOC while another mobile sheet owns scroll lock; close in both orders.
- Confirm article progress reaches 100% exactly at article end.
- Validate list semantics and accessible names.

## 8. Notes for Verifier

- The source route is strict-native; prefer semantic Astro-source repair over runtime DOM mutation.
- Do not mix this route work with current Gill PRs.
- Shared `site.js`/`site-utils.js` changes require a separate SYSTEM lane. They are not necessary for the preferred HERM-UI-001 source fix, but a global audit guard may later be justified.
- Add a regression assertion to an existing audit script rather than introducing a new runtime JS file:
  - zero active `.bref[data-ref]` descendants under footnote tooltip content;
  - no responsive control dead zone at the canonical breakpoint.