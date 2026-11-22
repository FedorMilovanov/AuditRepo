# W61 · Global responsive structured-content presentation and premium page audit
Date: 2026-11-22 · Project: gb-is-my-strength · State: `current-owner-evidence / verified-necessary-work`

## Reproducible current anchor

- Product PR [#2352](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2352), exact reviewed published head `26bd051205a3b5e4e8f11893b288d230f6d3f283`, Draft/HOLD.
- Route: `/articles/dzhon-gill-istoricheskiy-kontekst/`.
- Source component: `src/components/article-pilots/gill-context/GillContextSectionParticularVsGeneral.astro`. A `.table-scroll.reveal > table.compare-table` has three semantic columns: topic, Particular Baptists, General Baptists, and five prose-comparison rows.
- Owner's actual mobile screenshot supplied on 2026-11-22 shows a cropped two/three-column comparison. The right-hand column is hidden until lateral scrolling. This is **not data loss** and not automatically a keyboard bug: it is a confirmed reader-visible presentation shortfall for short text comparisons.
- Product PR's [W81 visual finding](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2352#issuecomment-7072085434) records the same component and bounded alternative. AuditRepo tracking issue: [#577](https://github.com/FedorMilovanov/AuditRepo/issues/577).
- Separate existing system owner: `SYS-READING-TABLE-KEYBOARD-SCROLL` in canonical MASTER. Its older reproducible scan covered 22 mobile overflow regions on 8 routes and insufficient native keyboard reachability. The present finding is **responsive content presentation**, not another ID for the same scroll/focus failure.

## Causal scope, without overclaiming

1. The shared responsive strategy treats a compact **editorial comparison** as a horizontally navigable data table. At small widths this hides the second interpretation in the initial reading viewport and makes essential context dependent on a non-obvious gesture.
2. Different semantics demand different adaptations. A short pairwise or three-way prose comparison can become an `aspect → labelled contrasting blocks` card while preserving all content. A genuine numeric or very wide dataset may require accessible horizontal navigation; chronology, definition lists, technical tables and interactive tables require separate verified choices. **No global `table, tr, td {display:block}` hack.**
3. A current **sitewide inventory has not yet been performed** in this wave; route counts in the historical scroll audit are a prior witness, not a fresh total. The bug is confirmed on the Gill historical-context table; generalization into a systemic *fix lane* is owner-requested and needs inventory and stratified validation before blanket implementation.
4. A second, related request is **whole-page premium review** of Gill Historical Context: all sections, source and timeline boxes, headings/citation presentation, table/card spacing, embedded diagrams and information density, responsiveness at 320/360/390/430/768/1440 and in both themes. No claim that every block is broken; review first, mutate confirmed defects after evidence.

## Required plan and exit gates

- Build a full current-Product table/layout census by type and route family; report exact routes/counts with sources and display semantics. Preserve excluded Reader consumers (Nagornaya, News/G3) and distinct application owners; audit their native responsive content only with explicit owner coordination.
- Implement **one typed responsive presentation strategy** at the appropriate shared component/style layer with explicit opt-in, no duplicate Reader/parser/painter/store. Confirmed Gill compare uses two labelled sides per aspect, full-wrap prose, calm editorial contrast, clear spacing, no x-scroll on 320–430. Desktop keeps the real 3-column semantic table; retain screen-reader relationships, anchors, links, print/PDF, TTS/ReaderProjection and SSR.
- Define other intentional patterns: compact key–value; chronology; wide numerical tables with visible directional affordance and keyboard arrow/home/end focus; interactive cell links; dynamic and literal HTML tables. Do not change uninspected types.
- Test native tap/Tab and keyboard, overflow/clipping, font scaling, light/dark and short-height phones. Require before/after screenshots at **320×568, 360×640, 390×844, 430, 768, 820, 1024, 1440** plus representative desktop; visually check all content not merely document scrollWidth. Verify Print/PDF and no-JS reader semantics.
- Finish Gill **whole-page** editorial visual audit and then recheck each affected route family; attach Product implementation PR, exact SHA + CI/visual acceptance, and retire this row only when global work is done and owner signs off.
- Keep independent `SYS-READING-TABLE-KEYBOARD-SCROLL` open for truly horizontally scrollable data; coordinate test coverage and do not double-count symptoms. Related current Product Library 320×568 cropping/management-sheet overflow belong to Library owner, not silently folded into table work.

## Negative guardrail / coordination

W81 local Reader Play/speed experiment failed `series-layout-browser-contract` because 44px hit targets overlapped by 20×44px, despite passing an amended narrower test; it was **not pushed**. Do not treat pending local W81 as an accepted Product baseline. Frozen desktop W57, semantic snapshots, linked-note concurrency, library export are independent owners. A Product patch is not considered accepted merely because this evidence has been recorded.

**Classification:** new active system-level necessary improvement `SYS-STRUCTURED-CONTENT-RESPONSIVE-PRESENTATION`, with premium whole-page review as an explicit acceptance stage. An optional sitewide redesign is not preapproved; implementation must remain evidence-bounded.

## W82 rendered-route census (follow-up, local Product candidate)

Direct DOM/geometry sample from the locally compiled Product `dist`, 2026-11-22: **113 built pages; 15 distinct routes with 36 rendered tables**. A separate source scan counted 30 authored files containing 36 `<table>` openings; this number alone is **not** route coverage. Chromium 320/390/768 plus selected WebKit 320/390 produced **53 browser profiles, 0 navigation errors**.

At 390 px **13 of 36 tables are wider than the visible parent**: all seven Gill Historical Context comparisons (each `544px` table inside a `310.8px` parent), plus six unique tables in the separate Nagornaya surface (chast-1: four; chast-3: one; chast-4: one). Remaining 23 tables are not marked geometrically offscreen, **not** signed off for typography/density. Other observed families include five Gill Handbook tables, Gill I/II/III, Heart, Lot, standalone MDX and HardTexts. Counts are for the local build with uncommitted W81 chrome adjustments, which do **not** edit the table markup; do not claim these figures as independently verified production release numbers. Source/DOM witness and follow-up: [AuditRepo #577 comment](https://github.com/FedorMilovanov/AuditRepo/issues/577#issuecomment-7072190055).

This confirms the system design split: seven short Gill Context prose tables need the card-style mobile **opt-in** first, while the six Nagornaya tables require their separate owner and may legitimately retain labelled accessible wide-table scrolling. Test across *every* family before sitewide rollout; never replace all `table` semantics or equate no x-overflow with readable content.
