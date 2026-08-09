# Post-Search merge audit correction — 2026-08-09

## Purpose

Correct the current `gb-is-my-strength` AuditRepo working set after Product #1313 merged, after Strangler visual-parity storage #1371 subsequently merged, and after a fresh Lot media/print audit found a separate paged-media visibility residual.

This report supersedes only current-state claims, not historical snapshots. Earlier inter-session reports remain useful evidence for their observed moment, but transient #1367/#1370/#1371 ownership and the standalone-quiz inference must not remain current after their dispositions changed.

## Exact current anchors

- AuditRepo branch started from `ede56dfbd8800b804b9ea854251ab4032f65b639`; current AuditRepo main later moved through unrelated TLP #281 and must be ancestry-transported before final merge.
- Product current main observed at the latest race-check: `59e99bfa277e5bcc9e1d153644e73a2fa2c92a24` — merged Strangler visual-parity storage #1371.
- Active Lot publication: #1339 / `189dfddbeed537c849dd35b1a92578ead894079d`.
- Fresh compare Product main → #1339: **behind=9 / ahead=10**, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

## Search role authority is merged — active Search root retired

Product #1313 is merged in the current Product chain.

Consequences:

- `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` is no longer an active MASTER row;
- new Search rows now derive author/translator/editor role presence from structured Article/ScholarlyArticle authority and no longer synthesize editor from meta-author;
- stale Lot generated Search/RSS/sitemap in #1339 is downstream replay work after ancestry refresh, not an open Search-writer defect;
- direct/manual Search Manifest edits remain forbidden.

## Catalog #1348 has absorbed Search role authority and current main

Latest open-PR metadata observed:

- #1348 head: `e2e6385c0e2d2d32b31fb15ec0d712a9df742f4a`;
- base/current Product main: `59e99bfa277e5bcc9e1d153644e73a2fa2c92a24`;
- semantic transaction remains six files including deterministic Scripture derivative.

Direct source read of `ArticlesLibrarySection.astro` proves the role-aware consumer already exists:

- distinct optional author/editor/translator inputs;
- truthful `Автор-редактор` only when author===editor and no translator exists;
- author-only rows render `Автор:`;
- translation/editor material preserves editor authority;
- owner-sensitive incomplete role states fail closed;
- build-time fixtures cover author-only, original author-editor and translated/editor cases.

Thus #1348's remaining barrier is final exact-head catalog/publication evidence, not implementing role semantics from scratch. The same PR also owns the last known mechanical `gill-reading-time` Strangler reader.

## Strangler visual-parity slice is merged

The #1367/#1370 branches are superseded replay history; #1371 was the final fresh-current replay and is now **merged** as Product commit:

`59e99bfa277e5bcc9e1d153644e73a2fa2c92a24`

`fix(strangler): replay visual parity storage after Search authority merge (#1371)`

Truthful retirement readiness therefore advances **12 → 11**.

Current known remaining classes after #1371:

- 1 mechanical reader: `gill-reading-time`, already inside #1348;
- 3 obsolete legacy-audit readers;
- 7 owner-decision blockers.

There is no separate active Strangler replay PR at this checkpoint. `SYS-STRANGLER-RETIREMENT` remains active until these classes are dispositioned. Physical retained-reference move/delete remains unauthorized.

## Native quiz false positive is closed

Product issue #1365 is closed `not_planned` after exact-source verification proved the native renderer already exists:

`SITE_CONFIG.quiz → ReaderActionsRuntime → article-interactions.js → article-quiz.js → #quizPlaceholder`.

Do not restore/copy legacy `site.js` or create a second standalone renderer.

The real current shared quiz root is Product **#1369**, owning:

1. score-tier schema parity (`min` thresholds vs native `{min,max}` range assumption);
2. distinct short + full teaching explanation parity;
3. configured result badge disposition/regression proof.

## New Lot media print/PDF residual

### Finding

`LOT-MEDIA-REVEAL-PRINT-01` — `CONFIRMED-CURRENT / P2 VISUAL-PRINT READINESS`.

The active placement component renders each published Lot image as:

```astro
<figure class="article-img reveal" data-lot-figure={name}>
```

Shared CSS uses a hidden base state:

```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
}
```

and, on supporting screen engines, reveals through a scroll-driven `view()` timeline. `prefers-reduced-motion` separately forces reveal content visible, but current shared print CSS has no generic `.reveal` visibility override and native/enhancements runtime has no generic controller that adds `.revealed` to these Lot figures.

This is **not** evidence that normal supporting screen browsers hide the figures.

### Why paged media is different

Primary CSSWG/W3C authority:

- Scroll-driven Animations Level 1, §3.2: in paged media, view progress timelines that would otherwise reference the document viewport are inactive: https://www.w3.org/TR/scroll-animations-1/
- current CSSWG editor draft additionally says that if there is no scrollable ancestor, e.g. in print media, `ViewTimeline` is inactive: https://drafts.csswg.org/scroll-animations-1/
- Web Animations Level 1 defines inactive timeline time as unresolved: https://www.w3.org/TR/web-animations-1/

Therefore the screen reveal timeline cannot be the print/PDF visibility owner while the normal author style remains `opacity:0`. Accepted Lot figures need an explicit paged-media visibility contract.

Correct closure: preserve screen reveal but make printable semantic media visible (shared print override or equivalent component ownership), and add a print/PDF witness asserting every expected Lot figure is nontransparent/visible in paged output. This belongs inside `LOT-PUBLICATION-READINESS-01`; no new MASTER row is needed.

A broader unsupported-scroll-animation fallback may be audited separately but is not promoted here without an engine witness.

## Lot media count remains 9 visible vs declared 14

Against current Product main the dedicated media branch still tracks current main with zero unique media bytes; placement source remains a separate source-only branch with nine registry-backed rendered figures and five reserves.

Current truthful editorial shape:

- 14 conceptual families;
- 9 publication registry rows;
- 9 actual `<LotFigure>` placements;
- 5 explicit reserve families;
- #1339 still declaring a final 14-raster browser gate.

The publication owner must choose an explicit 14-visible or 9-visible contract and assert the exact positive count. Whichever count is accepted must also be print/PDF-visible.

## Current MASTER arithmetic

Search writer root is retired; #1371 is merged but Strangler root remains active because 11 blockers remain.

- Direct current defects: **2**;
- Verified necessary improvements: **0**;
- Narrowed residuals: **0**;
- System verification lanes: **9**;
- Owner decisions: **3**;
- Active work units: **14**.

Current open Product PR census:

- #1363 — Map scale resize witness;
- #1348 — catalog projection + last known mechanical Strangler reader;
- #1339 — Lot publication;
- #1334 — Avraam retraction parity;
- #1212 — reader/control census.

Five open PRs therefore map to six active PR-owned roots because #1348 currently carries both catalog projection and the final known mechanical Strangler reader. Shared quiz #1369 is issue-owned with no implementation PR at this checkpoint.

## Required current-state updates

- MASTER: Product anchor → `59e99bfa...`; remove active Search row; catalog → current #1348 head/base; Strangler readiness 11 with no separate replay PR; Lot #1339 → behind=9; keep print/reveal residual inside Lot root; counts 14 / SYSTEM 9.
- SYSTEM_THEMES: Search writer root closed; catalog active/current; Strangler #1371 merged and readiness 11; quiz #1369 / #1365 false-positive boundary; Lot print reveal belongs to publication/visual truth rather than a second runtime root.
- Lot CURRENT_STATUS/MEDIA: Product anchor `59e99bfa...`, #1339 behind=9, Search symptom merged-upstream, print residual current.

No Product Lot implementation file is mutated by this AuditRepo correction.