# Next agent — read this before touching Product

Read [README.md](README.md), [DECISIONS-V24.md](DECISIONS-V24.md), [QA-V24.md](QA-V24.md), [PRODUCT-ROLLOUT-V24.md](PRODUCT-ROLLOUT-V24.md), then open the exact [V24 interactive HTML](REFERENCE-V24.html). V23 and V22 are historical comparisons, not current design authority.

Owner decisions: preserve the existing Product reader and **mobile unchanged**. One left desktop Grok TOC, filled dots, fine H2 peer connectors, no H3/H4 connector forest, 2px active strip, typographic GB, same-y collapse button, gentle elastic text width transition, four real **vertical** SVG quick actions on the right, anchored lower popovers, and independent family palettes with reader Day/Sepia/Night.

Product library V3 [#2283](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2283) was **merged** at main SHA `717efc54772edf4224f44254651c102e2af24129`; refresh CI/live before edits, don't wait for a nonexistent merge. Keep local reading statuses, save/notes/quotes/import and the existing library owner. Print #2269 remains separate.

Implementation procedure: current Product head + owners → legacy screenshot and DOM anchor baseline → pure typed tree adapter → route-scoped desktop-only renderer behind rollback flag → reuse existing action owners → Product build and Chromium/WebKit/Firefox + library V3/print/anchor/scroll regressions → owner visual acceptance → controlled release. NO second search, storage, playback, reader scroll or overlay runtime; NO full Astro shell replacement. Do not infer “shipped” from this AuditRepo prototype.
