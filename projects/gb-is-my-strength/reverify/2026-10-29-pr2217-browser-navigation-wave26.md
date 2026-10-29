# PR #2217 browser/navigation review — broad wave 26

**Date:** 2026-10-29  
**Product base / PR head:** `54877be…` / `ffdd9b2…`  
**Build:** detached `strangler:build:production-like`, 111 pages, exit 0  
**Browser:** Sparticuz Chromium 153 with AL2023 libraries; no Product mutation.

## Profiles and method

All five new article routes were opened in:

- desktop 1440×900, Light, reduced motion;
- mobile 390×844, Dark, `isMobile` + touch, reduced motion.

Used trusted Playwright clicks/keyboard activation. No force clicks, synthetic readiness or URL-only success. Each transition required target URL, target H1 and a target document navigation request. Axe ran after settled load. Full-page screenshots were inspected outside Git.

## Healthy results

Across 10 route/profile loads:

- Axe violations: **0**;
- broken loaded images: **0**;
- page errors: **0**;
- console errors: **0**;
- horizontal page overflow: **0**;
- correct H1/page identity: **10/10**.

Desktop visible Roman-series links performed four native forward transitions I→II→III→IV→V: **4/4** changed URL, replaced H1/body and issued one target navigation request. On mobile, the native sequence `Сейчас читаете` → part sheet → `Назад к серии` → Part II also opened the target document with the correct H1 and request.

The mobile dual circular progress indicator is a real read-only state, not a timer/button. On Part I it changed natively from `Статья 0%, серия 0%` to `Статья 100%, серия 23%`; visible percentage became `100%` after ordinary scroll to the document end.

Glossary projection is active: Part II had seven `.gterm` triggers, and natural focus + Enter opened the first (`канон`, `aria-expanded=true`). The learning sheet rendered a 30-item-backed quiz: confidence choice unlocked four answers, native answer activation exposed the next-question action. Local Part II health sample gave CLS 0 and LCP 148–160 ms; this is a local control, not a production performance claim.

## Finding — no bottom neighbouring-part surface exists

Every new route has **zero** `.gbs2-next` / `.gbs2-next-card` elements in source and final DOM: 0/10 route/profile loads. The pages end with author/correction/Soli Deo Gloria blocks. Thus:

- Roman rail/series-sheet navigation works;
- circular progress works;
- the promised bottom previous/next surface does not exist and therefore cannot be natively activated or timed;
- Part V similarly has no bottom route back/next disposition.

This is not an appearance-only complaint. The agent’s own pre-implementation audit explicitly required browser `prev/next I→V`; `SERIES-ENGINE-GUIDE` defines core parts as participating in prev/next; comparable series articles render `.gbs2-next` cards in their article tails. `SeriesReaderChrome` supplies rail/overlays but does not synthesize article-tail neighbours, so creating only routes/config cannot satisfy the promised bottom contract.

The omission remained invisible to green `engine:contracts` and the full PR CI set. Existing engine checks establish facade/config validity, not that each new core part renders a native bottom-neighbour projection.

## Root and disposition

This is a live PR omission plus a system boundary:

1. the active agent omitted a required reader surface already named in its audit;
2. the guide implies shared-engine ownership more strongly than the implementation provides;
3. no current atomic publication gate rejects a five-part series whose bottom neighbour surface is absent.

Because #2217 is unmerged and owned by another active agent, no Product row/fix is created here. The evidence extends `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`: closure fixtures must assert native bottom prev/next identity for first/middle/final core items, in addition to rail/overlay href validity. Do not solve this by copied per-article markup; projection should come from typed series config or one reusable tail primitive.

## Browser environment note

Playwright CDN was blocked by sandbox egress, so the mandated fallback was used. `@sparticuz/chromium` unpacked Chromium 153 and its AL2023 NSS libraries; launch succeeded with the repository’s `playwright-core` and explicit no-sandbox/no-GPU arguments. Screenshots and JSON remained outside Git.

**Broad wave 26 complete.**
