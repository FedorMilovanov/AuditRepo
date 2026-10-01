# Agent Audit Report — fresh browser pass 2 (quiz + header cluster) and pre-merge self-audit

## Meta

- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: arena-incompleteness-auditor
- Date: 2026-10-01
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `d586aa63f02b569cfe050a63cc9078c044375d8d` (re-checked unchanged at the end of this pass); live release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`; AuditRepo base `054c9c1b1a74f20ead716b835a2f618270dfb78b`, evidence PR #479
- Environment: Arena sandbox (Linux x86_64, no sudo/apt), Node v22.22.3, Python 3, authenticated `gh`; npm/GitHub/PyPI reachable; debian mirrors, every Playwright browser CDN and `raw.githubusercontent.com` blocked; live host unreachable (`curl` → `000`); `/tmp` does **not** survive between turns
- Build mode: production-like dist (`astro build` 104 pages + `copy-legacy-to-dist --omit-build-only` + cache-bust + heading-id hygiene + pastor guards + pagefind), served at `127.0.0.1:8899`
- Browser / device if used: HeadlessChromium 153.0.8010 (`@sparticuz/chromium`) + `playwright-core` 1.63.0 with NSS/NSPR built from `mozilla/nspr` + `nss-dev/nss`; viewports 360/390/414/768/1023/1024/1280/1440; `isMobile` + touch; `forcedColors:'active'`
- Scope: MASTER rows `GBS-QUIZ-NEXT-HIDDEN-GILL-V16`, `GBS-QUIZ-LITERAL-MARKUP`, `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`, `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS`, `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS`, `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`, `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`, `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`, `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`; plus a self-audit of my own 2026-09-30 claims and a pre-merge hygiene audit of PR #479
- Explicit exclusions: no Product mutation; no Product PR taken/edited/closed/merged; Lawson release-block decision under owner stand-down; PR #2145 is another agent's lane; no new MASTER row filed
- Signal class: Product (rows) + audit-harness (two self-corrections, one method blind spot)
- Proof state: PASS for the rows re-measured (one with narrowed scope, one with broadened scope); one harness non-reproduction recorded in §3
- Claim boundary: exact-SHA local-build browser evidence — **not** live-site rendering; `forcedColors:'active'` is **not** Windows High Contrast Mode
- Preservation boundary: every superseded claim stays in its original file with a marked correction block (two 2026-09-30 artifact witnesses, the quiz census receipt, the step-count doc, the release-block doc, the 2026-09-30 handoff prompt)
- Semantic owner: shared article-quiz runtime (`src/runtime/article-quiz.js`) against the legacy Gill-scoped CSS state contract (`css/floating-cluster.css` mobile block); shared `Header.astro` + `css/mobile-hotfix.css` for the header cluster
- Overlapping active owner/PR/branch check: Product `main` did not move during the pass; no open Product PR touches the quiz runtime or the `floating-cluster.css` mobile block (#2153 docs, #2150 Lawson catalog, #2145 apostasy, #2144 deps, #2143 genealogy draft, #2142 research-only)

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `header-mobile-variant-controls-overflow`

- Title: on two routes the mobile header variant pushes the theme toggle outside a 390px viewport where `overflow:hidden` clips it
- Kind: defect candidate — **deliberately not filed as a MASTER row** (owner triage first)
- Suggested impact: medium (touch target unreachable/clipped on small screens; only under real mobile emulation)
- Route(s) / owner(s): `/izbrannoe/`, `/hard-texts/genesis-6/` (and at 768px `/`); `src/components/ui/Header.astro` + `css/mobile-hotfix.css` (`.mobile-controls`)
- Observed on anchor: Product `d586aa63`, production-like dist, Chromium 153 `isMobile` context 390×844 (dsf 2, touch)
- Expected: both 44×44 header controls fully inside the viewport and hit-testable
- Actual: `#themeToggle` right edge 415/418px, centre x 393/396 of a 390px viewport; `.mobile-controls{overflow:hidden}` clips it; on `/izbrannoe/` even the search button centre is not hit-testable (returns `div.astro-shell`); at 768px on `/` both controls sit past the viewport with the container's overflow `visible`
- Reproduction or inspection steps: serve the dist; open an `isMobile` 390×844 context; measure `getBoundingClientRect()` of `#hCpBtnNav`/`#gbSearchBtn` and `#themeToggle` plus the `.mobile-controls` container; hit-test the centres with `document.elementFromPoint`; compare with a plain desktop window at the same CSS width (which fits — different header variant)
- Evidence type: verified-browser
- Evidence: `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt` §P4-4, §P4-4b, §P6-5, §C (three 390px header screenshots were viewed and corroborate; they are sandbox-local and not committed)
- Confidence: high
- Limitations of this method: headless emulation, not a real device; the live site could not be checked (no network route); no real-user touch metrics
- Possible mechanism: the same negative-margin/gap collapse that produces row `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`, combined with a route-specific header variant whose control cluster is wider than the viewport
- Related existing findings: `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP` (row 115), `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED` (row 116), `GBS-BASELAYOUT-MISSING-SKIP-LINK` (row 111)
- Applicability: same anchor and same built routes as the admitted header rows, measured in the same session
- What this evidence does **not** prove: not proven on the live host, not proven on a physical device, and not proof of a *new* root cause — it may be a symptom of the already-admitted overlap row

### Observation `quiz-payload-bonus-questions-blindspot`

- Title: static parsing of `window.SITE_CONFIG` under-counts quiz markup because `bonusQuestions` and nested explanation fields are skipped
- Kind: audit-harness
- Suggested impact: low for readers, high for audit accuracy (it produced a wrong enumeration that reached MASTER)
- Route(s) / owner(s): audit method, not a Product file; surfaced on `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` and `/articles/20-antisovetov-pastoru/`
- Observed on anchor: Product `d586aa63`, in-browser deep walk of `window.SITE_CONFIG.quiz`
- Expected: every literal `<em>`/`<span>` inside the runtime quiz payload counted once
- Actual: the 2026-09-30 static passes (strict JSON + raw-text fallback) reported 9 routes and per-route “strings” counts; the deep walk reports **10** routes and up to 74 tags on one route (14 previously)
- Reproduction or inspection steps: in a page context, walk the whole `SITE_CONFIG.quiz` object recursively over every string value and count `</?(em|span|strong|b)\b` matches; compare with a key-name-filtered walk
- Evidence type: verified-browser
- Evidence: `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt` §B; correction block inside `../../../reverify/evidence/2026-09-30-quiz-route-census.txt`
- Confidence: high
- Limitations of this method: counts payload markup, not painted markup — a route can carry tags in fields a given interaction path never renders
- Possible mechanism: n/a (method defect)
- Related existing findings: `GBS-QUIZ-LITERAL-MARKUP` (row 100)
- Applicability: applies to any future enumeration of quiz payload content at any anchor
- What this evidence does **not** prove: not proof that all 74 tags on one route are reader-visible

---

## 2. Confirmations and extensions

### Confirm or extend `GBS-QUIZ-NEXT-HIDDEN-GILL-V16`

- Target report/finding: MASTER row 99/101 + `../../../reverify/2026-09-29-current-quiz-defects.md` Finding 1
- Evidence angle added: viewport-width sweep straddling the media breakpoint + CSS-rule introspection + brace-counted enclosing at-rule + click-through to results
- My evidence anchor: Product `d586aa63`, production-like dist, Chromium 153 at 360/768/1023/1024/1280px
- Result: **narrower scope, stronger mechanism** — the dead end is real but only below 1024px: `[data-gill-v16] .quiz-next{display:none}` lives inside `@media (max-width: 63.99em)` (`css/floating-cluster.css:3774` → rule `:4063`) and the reveal rule `[data-gill-v16] .quiz-next.is-visible{display:block}` exists at `:4072`; `src/runtime/article-quiz.js` never adds `.is-visible`. Measured `display:none` 0×0 at 360/768/1023px and `display:block` + full flow at 1024/1280px; non-gill routes fine at all widths; panel inside `[data-gill-v16]` on exactly 15 routes
- What this changes: the row's repair precedent now requires proof at **both** sides of the breakpoint, and the affected population is 15 of 23 quiz routes (8 non-gill routes are controls, not 9)

### Confirm or extend `GBS-QUIZ-LITERAL-MARKUP`

- Target report/finding: MASTER row 100/102 + the 2026-09-30 census
- Evidence angle added: deep in-browser walk of the runtime payload + render-level click-through witness
- My evidence anchor: Product `d586aa63`, Chromium 153
- Result: **broader scope** — 10 of 23 routes (adds hermenevticheskaya, 6 tags in `bonusQuestions`); per-route tag counts 74/58/16/12/10/8/6/6/2/2
- What this changes: the “9 is a lower bound” wording is replaced by an exact payload count, with an explicit render-level boundary (3 routes witnessed painted; on `/articles/20-antisovetov-pastoru/` the first-option path painted none)

### Confirm `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`, `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`, `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS`, `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`, `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`, `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`

- Target report/finding: MASTER rows 116, 120, 113, 103, 115, 121
- Evidence angle added: fresh browser run at the current anchor (previously artifact-level or 2026-09-29 browser evidence)
- My evidence anchor: Product `d586aa63`, Chromium 153, 390×844 `isMobile` and 1280/1440×900 desktop contexts
- Result: same symptom, and for row 120 a stronger mechanism — the overlapping neighbour is now identified as `button.gb-ember.hm-ember` (38×38, aria «Озвучка»), overlapping the badge's `::before` (24.3×19, inset −4/−3) by 20.3×17px and the 20.3×13 badge box by 17.3×13px; a trusted tap at the badge centre sets `aria-expanded=true`
- What this changes: evidence tier raised to fresh browser for six rows; row 116 gained the request-level witness (`js/search.js` never requested on the two broken routes, requested on the `/articles/` control); row 121 gained the Sepia contrast (nested 404s: no theme attrs, body `rgb(253,252,249)`; root `/404.html`: `data-reader-theme=sepia`, body `rgb(238,227,200)`)

### Confirm `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` (structural half only)

- Target report/finding: MASTER row 114
- Evidence angle added: DOM/structure census of all nine `/nagornaya/**` pages under a `forcedColors:'active'` context
- My evidence anchor: Product `d586aa63`, Chromium 153, 390×844
- Result: same symptom for the structure (three `.bar` divs painted only by a utility background, no border/SVG/text; `/nagornaya/seriya/` has no `#menuBtn`, matching the row's eight)
- What this changes: nothing in the row's substance; the colour half is explicitly **not** re-proven here (see §3)

---

## 3. Challenges and negative findings

### Challenge `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` — my own pass-5 “FALSIFIED” verdict

- Target report/finding: the 2026-10-01 pass-5 sweep result recorded during this session (never committed as a verdict)
- Reason: the sweep ran at a single viewport (1440px), where the row's hiding media query does not apply
- Contradictory evidence angle: width sweep 360/768/1023/1024/1280 with `matchMedia('(max-width: 63.99em)')` read alongside the computed `display`, plus click-through
- Evidence anchor: Product `d586aa63`, Chromium 153
- Recommended result: **audit-drift (wrong measurement condition)** — the verdict is withdrawn; the row stays current with narrowed scope

### Challenge the 2026-09-30 artifact witness claims about the quiz CSS

- Target report/finding: `../../../reverify/evidence/2026-09-30-artifact-witness-main.txt` and `-live-sha.txt`, lines about “hidden-by-default” and “`.is-visible` rules … 0”
- Reason: both claims are false at the same SHA — the hiding rule is `[data-gill-v16] .quiz-next` inside a media block (not `.quiz-next-btn`, whose only `display:none` is an inline style in the legacy `js/site.js` template, present in **0** built routes), and the `.is-visible` reveal rule does exist at `css/floating-cluster.css:4072`
- Contradictory evidence angle: brace-counted enclosing at-rule in the shipped sheet + in-browser `getComputedStyle` + `document.styleSheets` introspection
- Evidence anchor: Product `d586aa63`
- Recommended result: **invalid as written; corrected in place with marked blocks** (text preserved for audit). The 2026-09-29 detail doc had the mechanism right from the start and needed only a width note

### Negative finding — `forcedColors:'active'` does not emulate the Windows HCM repaint

- Target report/finding: MASTER row 114, colour-override half
- Reason: under Playwright's forced-colors context the three `.bar` divs still compute `rgb(255,255,255)` on all eight routes, so no repaint/blanking is observable in this harness
- Evidence anchor: Product `d586aa63`, Chromium 153, 390×844, `forcedColors:'active'`
- Recommended result: **not reproducible here — keep the 2026-09-29 forced-colors evidence for that half**; a real Windows HCM environment (or an owner screenshot) is required to re-prove it. A forced-colors screenshot attempt in this pass also failed on a harness bug (`clip` given as `{x,y,w,h}` instead of `{x,y,width,height}`), so no image claim rests on it

### Negative finding — literal quiz markup is payload-present but not always painted

- Target report/finding: MASTER row 100
- Reason: on `/articles/20-antisovetov-pastoru/` the first-option path through all 10 questions and the result screen rendered **0** literal tags, although the payload carries 74
- Evidence anchor: Product `d586aa63`, Chromium 153, full click-through
- Recommended result: **narrower scope for the render claim** — recorded as “not observed on that path”, not refuted; the three render-witnessed routes carry the painted claim

---

## 4. Root-cause clusters

### Cluster `legacy-gill-state-contract-vs-quiz-runtime`

- Findings/symptoms included: `GBS-QUIZ-NEXT-HIDDEN-GILL-V16`, `GBS-QUIZ-LITERAL-MARKUP`, `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST`
- Shared mechanism: the Gill-v16 legacy layer (`css/floating-cluster.css` mobile block, `js/site.js`/`js/bookmark-engine.js` templates) still owns quiz state and text insertion, while `src/runtime/article-quiz.js` owns the interaction — the two disagree about the reveal class, about markup vs text, and about surface tokens
- Surface evidence: dead end after question 1 below 1024px; literal `<em>`/`<span>` in question text; measured 1.08:1 dark quiz text on the painted light surface
- Mechanism evidence: `:4063` hide + `:4072` reveal with no runtime add-site; `.textContent=` twice and `.innerHTML=` never in `js/bookmark-engine.js`; painted surface `rgba(255,253,248,0.92)` over `#0e1116`
- Lifecycle evidence: identical at Product `d586aa63` and at the live release SHA `d0e04a9c` builds (2026-09-30 artifact witnesses), so it ships
- Why local patches may be insufficient: forcing `.quiz-next` visible globally, or switching to `innerHTML`, each fixes one symptom while the state contract stays split
- Suggested status: keep-independent rows, systemic-root noted (no row was merged or retired by this pass)
- Representative cases that should be tested: `/nagornaya/chast-2/`, `/articles/kod-da-vinchi/`, `/articles/20-antisovetov-pastoru/`, `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` — each at ≤1023px **and** ≥1024px
- Known exceptions: the 8 non-gill quiz routes advance normally at every width; `/nagornaya/seriya/` has no `#menuBtn`

### Cluster `shared-header-mobile-controls`

- Findings/symptoms included: `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`, `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`, `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`, `GBS-BASELAYOUT-MISSING-SKIP-LINK`, plus the unfiled overflow observation in §1
- Shared mechanism: `css/mobile-hotfix.css` collapses gaps and outlines on the shared header cluster (`margin-right:-12px!important`, `gap:0!important`, `outline:0!important`) while the palette binding lives in an on-demand script (`js/search.js`) that two routes never load
- Surface evidence: 12px overlap on three routes at every width tested; click and `Ctrl+K` inert on two routes; no visible focus ring on the theme toggle; theme toggle clipped past a 390px viewport on two routes
- Mechanism evidence: `css/mobile-hotfix.css:12`; `#hCpBtnNav` has no listener in any eagerly loaded path; `js/search.js` requested only on the `/articles/` control
- Lifecycle evidence: reproduced fresh at `d586aa63` in this pass and artifact-proven at both SHAs on 2026-09-30
- Why local patches may be insufficient: restoring the gap alone leaves the unwired trigger and the missing focus ring; wiring the trigger alone leaves the overlap
- Suggested status: keep-independent rows, systemic-root noted
- Representative cases that should be tested: `/`, `/izbrannoe/`, `/hard-texts/genesis-6/`, `/articles/` at 360/390/768/1280 with keyboard and touch
- Known exceptions: `/articles/` uses `#gbSearchBtn` and works; narrow desktop windows at the same CSS width fit the controls (different header variant)

---

## 5. Value and cost assessment

- `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` — user impact: high on mobile/tablet (quiz unusable after question 1 on 15 routes); blast radius 15 of 23 quiz routes; recurrence risk high (contract split); repair size small (add the reveal class in the runtime **or** retire the hidden-state rule); regression risk low; absorbs 0 other findings; recommendation: **fix-now**, with proof at both sides of the 1024px breakpoint.
- `GBS-QUIZ-LITERAL-MARKUP` — impact medium (visible markup noise), blast radius 10 routes / up to 74 tags per route, repair size small-to-medium (authoring cleanup or a sanitised rich-text path), regression risk low; recommendation: **fix-now** after choosing the owner of the text-insertion contract.
- Rows 116 / 120 / 113 / 103 / 115 / 121 / 114 — unchanged dispositions from MASTER; this pass only raised their evidence tier (114's colour half still needs an environment this sandbox cannot provide → **verify-first** with owner-side HCM).
- `header-mobile-variant-controls-overflow` (§1) — impact medium, evidence single-harness; recommendation: **verify-first / owner triage**, do not file without an owner signal or a second witness angle.
- No `park`, `accepted-risk` or `not-worth-fixing` recommendation is made by this pass.

---

## 6. Suggested verification wave

- Package of findings: the two quiz rows + the header cluster (§4)
- Questions the wave should answer: (1) does the repaired quiz advance on all 15 gill routes at ≤1023px **and** ≥1024px, keyboard and touch? (2) do the 8 non-gill routes stay working? (3) is literal markup gone from the painted panel on the 3 render-witnessed routes and from the payload on all 10? (4) after any header change, are both controls inside the viewport at 360/390/414/768 and hit-testable at their centres? (5) does the theme toggle show a visible `:focus-visible` ring without restoring the unwanted hover pill?
- Evidence-critical owners: `src/runtime/article-quiz.js`, `css/floating-cluster.css` mobile block, `js/bookmark-engine.js`, `src/components/ui/Header.astro`, `css/mobile-hotfix.css`, `js/search.js`
- Recommended witness angles: width sweeps straddling every media breakpoint; computed-style + rule introspection together; request-level witness for on-demand scripts; deep payload walk rather than key-filtered parsing; trusted taps/clicks, not `element.click()`
- What does **not** need global revalidation: Baptist provenance, the 17-route label-vs-`datetime` negative boundary, the branch census, the 41-command publication chain — all receipted at the same anchor earlier in the PR #479 cycle
- Possible outputs: rows closed-by-fix with browser receipts, or a narrower residual row if the fix is width-conditional again

---

## 7. Suggested repair boundaries

- Local lane: `src/runtime/article-quiz.js` reveal-state handling; quiz authoring strings; `Header.astro` control cluster markup
- System lane: the legacy Gill-scoped CSS/state contract in `css/floating-cluster.css` (already tracked by MASTER's system lanes); `css/mobile-hotfix.css` as the shared mobile override sheet
- Do not mix with: the Lawson catalog lane (#2150), the apostasy lane (#2145, another agent), dependency bumps (#2144)
- Minimum regression witness: for the quiz rows, a scripted run at 390 and 1280 answering question 1 on one gill route and one non-gill route and asserting the panel advances and no literal tag is painted; for the header rows, a scripted geometry + hit-test + `:focus-visible` assertion at 390
- Is live evidence actually required? **no** for admission (artifact- and browser-proven at the exact SHA); **unknown** for closing the forced-colors colour half, which needs a real HCM environment
- Required exact-head checks: rebuild the production-like dist at the fixing SHA and re-run the same sections of the receipt (they are parameterised by route and width)
- Is merge admission machine-enforced? **no** — AuditRepo checks validate structure and coverage, not Product behaviour; Product CI gates are the owner's

---

## 8. Owner decisions

- Decision needed: for `GBS-QUIZ-NEXT-HIDDEN-GILL-V16`, retire the legacy hidden-state rule or teach the runtime the `.is-visible` contract (the row's repair precedent allows either, but not a blanket force-visible).
- Available options: (a) runtime adds `.is-visible` when the button becomes actionable; (b) delete `:4063` and keep the desktop flow; (c) accept the mobile dead end as intentional.
- Trade-offs: (a) keeps the legacy contract intact and is the smallest behavioural change; (b) removes dead CSS but risks other Gill-v16 assumptions; (c) leaves 15 routes unusable on small screens.
- Default recommendation: (a), with proof at both sides of the breakpoint.
- Decision needed (second): whether the §1 mobile header overflow is a defect to file or an accepted trait of that header variant. Default recommendation: owner triage; the audit side keeps it as a bounded observation.
- Decision needed (third, standing): the Lawson release-block decision remains with the owner (“Лоусоном уже занимаются”) — this pass took no action on it.

---

## 9. Summary for verifier

- Strongest new evidence: the width sweep pinning the `63.99em` boundary for the quiz dead end (`display:none` at 360/768/1023 → `display:block` at 1024/1280, with `matchMedia` read in the same context), and the deep payload census giving an exact 10-of-23 with per-route tag counts.
- Findings likely current when selected: all nine rows re-measured at `d586aa63`; Product `main` did not move during the pass.
- Systemic clusters: `legacy-gill-state-contract-vs-quiz-runtime`, `shared-header-mobile-controls`.
- Likely stale/invalid items: my own 2026-09-30 witness lines about `.quiz-next-btn{display:none}` and “no `.is-visible` rule anywhere”, the “9 of 23” enumeration, and the pass-5 single-viewport “FALSIFIED” verdict — all corrected in place with markers.
- Highest-value next work: owner-side repair of the quiz reveal contract (small, unblocks 15 routes on mobile/tablet), then the header cluster; the forced-colors colour half needs an environment outside this sandbox.

---

## Files in this intake folder

- `REPORT.md` — this report;
- `NEXT_SESSION_PROMPT.md` — handoff for the next pass (standing owner instructions, proven sandbox boundaries, do-not-refile list, next scopes);
- `commands.log` — commands used during the pass;
- `evidence/`, `artifacts/` — empty by design: the receipts of this pass live in `../../../reverify/evidence/2026-10-01-fresh-browser-pass-2-quiz-header.txt` (pass 2) and `../../../reverify/evidence/2026-10-01-fresh-browser-pass-at-anchor.txt` (pass 1) and are not duplicated here.

## Status boundary

An intake report may use `raw`, `candidate`, `reproduced-by-agent` and explicit evidence labels. Durable classifications such as `verified-at-anchor`, `systemic-root`, `invalid`, `not-worth-fixing` or `absorbed-by-system-fix` belong to a verifier synthesis or an accepted project ledger decision; the corrections recorded in this pass were applied to AuditRepo's own evidence files and to MASTER row text, and are logged in `../../../verified/CLOSURE_LEDGER.md` entry `2026-10-01-b`.

A report does not become stale merely because Product HEAD moved. It remains evidence about its recorded anchor.
