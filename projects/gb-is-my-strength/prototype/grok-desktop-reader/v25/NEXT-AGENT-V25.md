# Next-agent starting point — GB Grok Desktop Reader V25

Read README → DECISIONS → QA → PRODUCT-ROLLOUT → REFERENCE-V25.html from this folder. Older V24/V23 stay forensic history only. **No need to ask user to re-explain 20+ iterations.**

Goal: one shared, softly animating desktop in-page TOC, book/series/article hierarchy, series-specific themes and original Gill upside-down ВВЕДЕНИЕ, careful 1px H2 guides (no deep spines), 2px active edge and solid dots, serif GB, same-height collapse control, real four VERTICAL SVGs on top right. No mobile redesign. Popovers anchor to buttons. Search book/series first, global second through actual GBSearch. No second themes, library, TTS or scroll manager.

Source current check at documentation: Product main 717efc54772edf4224f44254651c102e2af24129, merged library PR #2283, exact-head 33 successful workflows incl. deploy and reader controls, but live SHA not independently fetched. Open print #2269 and deps #2268 separate. Refresh before coding.

First practical action: snapshot real Product source, pages and mobile; then add typed read-only series tree adapter with tests; only then reversible single-family desktop pilot. Do not paste ~150 KB demo HTML into existing Astro pages, replace article prose, rewrite navigation slugs/anchors or fake full-text search.

Standalone V25 Chromium 57/57, not integration green. Firefox/WebKit, true reload with library V3, real routes and print are blockers before Product release. The real Product and open PR owners determine mutation scope.
