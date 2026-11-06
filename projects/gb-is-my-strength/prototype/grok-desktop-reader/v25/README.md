# Grok Desktop Reader V25 — active handoff

Status 2026-11-06: **desktop-only standalone design reference**, not installed Product code. Source of truth for current reference is [REFERENCE-V25.html](REFERENCE-V25.html), retained beside previous V24/V23 evidence.

Read in this order:
1. [DECISIONS-V25.md](DECISIONS-V25.md) — user-approved design and excluded changes.
2. [QA-V25.md](QA-V25.md) — V24 regressions corrected; bounded tests and unverified risks.
3. [PRODUCT-ROLLOUT-V25.md](PRODUCT-ROLLOUT-V25.md) — strict additive implementation gates.
4. [NEXT-AGENT-V25.md](NEXT-AGENT-V25.md) — one-page restart instruction.

Current Product anchor at audit: gb-is-my-strength main 717efc54772edf4224f44254651c102e2af24129. Library V3 PR #2283 merged. At latest exact-head query 43 runs: 33 successful, 9 skipped, 1 cancelled (Pages Deploy/Reader Controls/Visual Parity/Interactive all success). This is NOT independent verification of live published SHA. Open Product print PR #2269 and deps PR #2268 remain separate.

V25 evidence: 57/57 Chromium standalone assertions (9 screen sizes), 0 page JS errors. True reload/storage test blocked by sandbox browser navigation; Firefox/WebKit and Astro Product integrations NOT run. The source contains fixture prose, prototype-only localStorage, fake title search and speed UI; NEVER transfer these demo mechanisms into Product.

Owner intent: preserve original mobile navigation; native SeriesConfig, GBReaderPreferences, GBSearch, PlayEmber, reader library V3, saved notes/quotes, menu, print, historical Gill leather ribbon, route IDs and existing right vertical 4-SVG quick controls. V25 changes **desktop TOC presentation and motion only**, and must be adopted via reversible family/route flag rather than a page rewrite.
