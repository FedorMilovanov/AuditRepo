# GB Home — production visual evidence, 2026-11-09 (wave 1)

## Boundary and provenance

- **Live origin:** `https://gospod-bog.ru/` (HTTP 200), captured `2026-11-09T20:01:11Z` in GitHub-hosted isolated Chromium via [Product audit PR #2294](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2294), head `c436e411515655a1fe772885110e24409a0cf6d5`.
- **Product main/source anchor at examination:** `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`. Production identity is URL/runtime observed, **not** proven equal to main SHA by a deploy manifest. Do not claim source/deploy byte equality.
- [Successful GitHub Actions run #42688110576](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/42688110576); artifact `visual-parity-reports`, ID `13705504213`, 14-day retention. Four full-page PNGs + `live-home-matrix.json` exist in the existing `reports/visual-parity/` artifact path. No screenshot binaries committed to either repository.
- **Capture profiles:** 1440×900 / 390×844, Light + Dark, `reducedMotion: reduce`, RU locale, isolated browser profile and blocked service workers. All four cases captured; snapshots hash-bound in JSON. Not a substitute for normal-motion, forced-colors, keyboard or WebKit tests.

| Profile | Full page | SHA-256 (PNG) |
|---|---:|---|
| 1440 Light | 1440×8548 | `f6f39323ea815dffbb89287c95e064fbbe9a72d50d965d793edae33a63352df1` |
| 1440 Dark | 1440×8548 | `31dd66426b0153ced1246718bd4113fd384878f88fdda9c3167d45470bb12f3f` |
| 390 Light | 390×7260 | `93910e05f29e40dcf5f006ce79cb4c2d9c14e77f0232bd2b8ce780918f21cb62` |
| 390 Dark | 390×7260 | `9553328a01b6fb25ccafe7b32333cc131356be28b9e4694300ff679a58f60be1` |

**Measured:** 0 horizontal document overflow; 21/21 images loaded per profile; 0 unhandled page errors; 0 hidden reveal sections after natural warm-scroll; H1 exact in all four. This does **not** prove there are no layout, visual, WCAG or interaction defects. An earlier AI browser report estimating document height ~1000px was invalid; do not reuse it.

## Findings / disposition

### 1. HOME-FEATURED-INTRO-COUNT-DRIFT — current-confirmed-for-work (W1 + W2)

- **W1 production witness:** the editorial section displays **three** large featured cards: «Биографии служителей», «Нагорная проповедь», «Отступники» at both widths/themes.
- **W2 source mechanism:** `src/components/home/HomeSections/Publications.astro` still says **«Два больших проекта показывают характер библиотеки»** and statically renders three `<a class="h-featured-series">` cards. The phrase no longer describes the actual featured selection; the third card also introduces its own theological dimension absent from the two-item description.
- **Priority/need:** current reader-visible editorial contradiction, low-risk local copy correction. Before mutation, verify final Product head and any active owner collision. Do **not** delete the third card just to restore a count. Acceptance: intro accurately describes the retained selection and still reads naturally on mobile; existing Home source/browser contracts and live post-deploy recheck pass.

### 2. HOME-REFUTATIONS-CARD-HEIGHT-RISK — candidate, NOT yet a confirmed text-loss defect

- **W1:** desktop first «Код да Винчи» card displays its final abstract line extremely close to the bottom border; on 390px both first cards leave conspicuous unused lower space. Seen in both themes.
- **W2:** `src/components/home/HomeSections/Refutations.astro` owns `.h-refutation-slot` and shell/card: desktop `min-height:184px`, inner `height:100%` with `overflow:hidden`; at `max-width:460px` both card and slot are forced to `min-height:224px`. This is a coherent shared geometry mechanism, not isolated copy typo.
- **Next falsifier:** measure `scrollHeight/clientHeight`, last-text painted rectangle vs card padding edge, and dynamic crossed-card focus/hover motion at 1440/390 Light/Dark. Confirm whether glyphs truly clip **before** opening a defect/altering fixed hit-area geometry. If no loss, classify as optional density/spacing polish in WORK_QUEUE, not MASTER.

### 3. HOME-ODD-CARD-GRID-RHYTHM — visual polish candidate, not a mandatory defect

- At desktop width, both the three-card featured shelf and the three-card “Следующие большие серии” shelf retain a solitary third card in the left column; latest-publications five-item shelf has the same final-row asymmetry. The remaining right-hand area becomes large whitespace. On mobile the same content is stacked and there is no page overflow.
- This could be a deliberate editorial asymmetry. Do not claim it is broken or change the grid without owner-approved hierarchy and a before/after design check. Avoid a bespoke CSS patch for each shelf; review shared card-grid rhythm if selected.

### 4. Home microtext and carousel discoverability — needs measurement / no new active row

- Some pale cyan eyebrow labels and muted metadata look weak at screenshot scale. Compute **actual painted text-to-background contrast** in both themes before classifying WCAG impact; see existing `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` owner in MASTER for potential absorption rather than duplicate.
- The mobile five-direction card rail intentionally peeks the next card. Confirm scroll/keyboard affordances and user-visible navigation before treating the lack of explicit swipe hint as a defect.

## Collision and next checks

At this first pass, open Product PRs #2292 (reader), #2293 (workflow deps), #2269 (print) do not change `Publications.astro` or `Refutations.astro`; #2294 only changes the existing screenshot harness. Reverify immediately before any Product mutation. Existing AuditRepo MASTER remains untouched because active AuditRepo PR #521 already owns that matrix; do not collide with its count/closure ledger. This package is evidence and candidate adjudication, **not** a second active backlog. Item 1 is source+live confirmed and ready for current-head reconfirmation/matrix admission once #521 settles; items 2–4 require the narrowed checks above. No terminal ZERO claim and no production fix claim.
