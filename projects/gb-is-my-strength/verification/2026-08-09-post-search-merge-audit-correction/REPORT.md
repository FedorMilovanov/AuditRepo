# Post-Search merge audit correction — 2026-08-09

## Purpose

Correct the current `gb-is-my-strength` AuditRepo working set after Product #1313 merged and after a fresh Lot media/print audit found a separate paged-media visibility residual.

This report **supersedes only current-state claims**, not historical snapshots. The earlier inter-session report remains useful evidence for the moment it observed, but its transient #1370 owner and original standalone-quiz inference are no longer current.

## Exact anchors

- AuditRepo base for this correction: `ede56dfbd8800b804b9ea854251ab4032f65b639`.
- Product current main observed: `c389f88ed06eb8e30cebf2a1c4f0d5764c18522f` — merged #1313 Search new-row role authority.
- Active Lot publication: #1339 / `189dfddbeed537c849dd35b1a92578ead894079d`.
- Fresh compare Product main → #1339: `behind=8 / ahead=10`, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

## Search role authority is merged — retire the active root

Product #1313 is now merged into current main.

Consequences:

- `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` is no longer an active Product defect row;
- newly materialized Search rows now derive author/translator/editor role presence from structured Article/ScholarlyArticle authority and no longer synthesize editor from meta-author;
- Lot's stale generated Search/RSS/sitemap trio in #1339 must be regenerated after ancestry refresh using the canonical writer, but that is now downstream replay work rather than an open Search-writer defect;
- direct/manual Search Manifest edits remain forbidden.

## Catalog #1348 has already absorbed the role authority

Current catalog head observed: `b526a175279c5966e3047501403cd8ae78373bfc`.

Fresh compare from Product `main@c389f88...`:

- status: ahead;
- behind: **0**;
- ahead: 13;
- semantic diff remains six files, including deterministic Scripture derivative.

Direct source read of `ArticlesLibrarySection.astro` proves the consumer-side role adaptation already exists:

- optional distinct `author`, `editor`, `translator` inputs;
- truthful `Автор-редактор` collapse only when author===editor and no translator exists;
- author-only rows render `Автор:`;
- translation/editor material preserves editor authority;
- owner-sensitive incomplete role states fail closed;
- build-time fixtures cover author-only, original author-editor and translated/editor cases.

Therefore #1348's remaining barrier is final exact-head publication/catalog evidence, not implementing the role-aware consumer from scratch.

## Strangler owner advanced again

The earlier #1367/#1370 branches are predecessor replay history after concurrent main movement.

Current Strangler owner is **#1371**:

`fix(strangler): replay visual parity storage after Search authority merge`

Observed exact base/head:

- base: current Product `main@c389f88...`;
- head: `346776b2cd63eda5514257340816bf95b6f01507`;
- behind=0 at creation;
- exactly four intended files;
- byte-identical semantic replay of the already-proven storage repair.

Truthful retirement readiness remains **12** before this slice. Expected effect after exact-head acceptance remains **12 → 11**.

Expected post-merge classes remain:

- 1 mechanical reader: `gill-reading-time`, owned inside #1348;
- 3 obsolete legacy-audit readers;
- 7 owner-decision blockers.

Physical retained-reference move/delete remains unauthorized.

## Native quiz false positive is closed

Product issue #1365 was closed `not_planned` after exact-source verification proved the native standalone renderer already exists:

`SITE_CONFIG.quiz → ReaderActionsRuntime → article-interactions.js → article-quiz.js → #quizPlaceholder`.

Do not restore/copy legacy `site.js` and do not create a second standalone renderer.

The real current shared quiz root is Product **#1369**, which owns:

1. score-tier schema parity (`min` thresholds vs native `{min,max}` range assumption);
2. distinct short + full teaching explanation parity;
3. configured result badge disposition/regression proof.

## New Lot media print/PDF residual

### Finding

`LOT-MEDIA-REVEAL-PRINT-01` — `CONFIRMED-CURRENT / P2 VISUAL-PRINT READINESS`.

The active placement component currently renders each published Lot image as:

```astro
<figure class="article-img reveal" data-lot-figure={name}>
```

Shared site CSS has a hidden base state:

```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
}
```

and, where scroll-driven animations are supported, reveals the element through:

```css
@supports (animation-timeline:scroll()) {
  .reveal {
    animation: reveal-sda linear both;
    animation-timeline: view();
    ...
  }
}
```

`prefers-reduced-motion` explicitly forces `.reveal` visible, but the current shared print CSS has no generic `.reveal` visibility override and current native/enhancements runtime has no generic controller that adds `.revealed` to these figures.

This is **not** evidence that normal supporting screen browsers hide the figures: the CSS view timeline is the intended screen reveal mechanism.

### Why paged media is different

Primary CSSWG/W3C authority:

- Scroll-driven Animations Level 1: https://www.w3.org/TR/scroll-animations-1/
  - §3.2 states that in paged media, view progress timelines that would otherwise reference the document viewport are inactive.
  - the current editor draft additionally states that if no scrollable ancestor exists, e.g. in print media, `ViewTimeline` is inactive: https://drafts.csswg.org/scroll-animations-1/
- Web Animations Level 1: https://www.w3.org/TR/web-animations-1/
  - an inactive timeline has unresolved time;
  - an animation associated with an inactive timeline has unresolved current time.

Therefore the scroll-driven reveal cannot be relied upon to advance the element from its normal hidden `opacity:0` base state in print/paged media. With no print override and no generic `.revealed` mutation, the current Lot placement contract can produce transparent/invisible semantic figures in print/PDF output.

### Correct closure boundary

Do not remove the screen reveal effect merely to make print work.

Require one of:

- a shared print/paged-media override making reveal-marked semantic content printable, e.g. visibility equivalent to `opacity:1; transform:none; animation:none`; or
- removal of the hidden reveal dependency from printable Lot figures with equivalent screen behavior owned elsewhere.

Permanent evidence should include a print/PDF browser witness that asserts every expected Lot figure is visible/nontransparent in paged layout/PDF output. This belongs inside existing `LOT-PUBLICATION-READINESS-01`; it does **not** need another MASTER row.

A broader unsupported-scroll-animation browser fallback may be worth testing separately, but this audit does not overclaim it as a current target-browser defect without an engine witness.

## Lot media count remains 9 visible vs declared 14

The current placement branch still has:

- 14 conceptual families;
- 9 publication registry rows;
- 9 actual `<LotFigure>` placements;
- 5 explicit reserve families;
- no unique media bytes in `lane/lot-media-20260809` at the last branch census;
- #1339 still declaring a final 14-raster browser gate.

Thus the publication owner still must choose an explicit 14-visible or 9-visible contract and assert the exact positive count. The new print residual is orthogonal: whichever count is accepted must also be printable/visible.

## Current MASTER arithmetic after this correction

Remove one merged Search SYSTEM row:

- Direct current defects: **2**;
- Verified necessary improvements: **0**;
- Narrowed residuals: **0**;
- System verification lanes: **9**;
- Owner decisions: **3**;
- Active work units: **14**.

Current open Product PR census at this checkpoint:

- #1371 — Strangler visual-parity storage;
- #1363 — Map scale resize witness;
- #1348 — catalog projection;
- #1339 — Lot publication;
- #1334 — Avraam retraction parity;
- #1212 — reader/control census.

Shared quiz root #1369 is issue-owned with no implementation PR at this checkpoint.

## Required current-state updates

- MASTER: Product anchor → `c389f88...`; remove active Search row; catalog → #1348 `b526... behind=0`; Strangler → #1371; Lot #1339 → behind=8; add print/reveal residual inside Lot root; counts 15→14 / SYSTEM 10→9.
- SYSTEM_THEMES: Search writer root closed; catalog remains active; Strangler owner #1371; quiz #1369 and #1365 false-positive boundary; print/PDF Lot reveal belongs to release/visual truth rather than a second runtime root.
- Lot CURRENT_STATUS: Search symptom becomes `MERGED-UPSTREAM / READY-TO-REGENERATE`; Product anchor `c389f88...`; #1339 behind=8; add `LOT-MEDIA-REVEAL-PRINT-01`.

No Product Lot implementation file is mutated by this AuditRepo correction.