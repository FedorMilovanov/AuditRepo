# Full-spectrum audit pass — gb-is-my-strength

- **Agent:** `arena-full-spectrum-audit`
- **Date:** 2026-10-14
- **Project:** `FedorMilovanov/gb-is-my-strength` (`gospod-bog.ru`)
- **Audited anchor:** Product `main` = `d14da74cfe9f45e9b03e383e8e622695b01f8e16` (merge of PR #2182, 2026-10-14T00:04:41Z push)
- **Branch/event context:** `main` push; no Product mutation performed by this pass.
- **Environment:** sandbox Linux, Node v22.22.3, npm 10.9.8; **production-like local build** (`npm run strangler:build:production-like`, exit 0) served at `127.0.0.1:8099`; browser = sandbox Chromium **153.0.8010.0** driven by Playwright 1.62.1 (`executablePath` shim). Sandbox cannot reach `gospod-bog.ru` (egress), so this is exact-SHA local-build evidence, not live-host evidence.
- **Report type:** `browser-audit` + `source-audit` + `verifier-synthesis` (multi-witness)
- **Scope requested by owner:** bugs, weaknesses, gaps, **unfinished articles / unfinished work, glossary, tooltips, element placement**, several surfaces.
- **Baseline discipline:** AuditRepo gates were run on the clean session HEAD first — `check_auditrepo_structure.py` PASS, `validate_audit_repo.py` PASS, exit 0, no pre-existing red.

## 0. What this pass is not

- It is **not** a live-production witness: the sandbox has no route to `gospod-bog.ru`. Every claim below is anchored to a **local production-like build of `d14da74c`**.
- It does **not** re-litigate approved owner design (the editorial dateline label ≠ `datetime` decision stays non-refutable).
- It does **not** create repair lanes where an active Product owner already exists (collision rule; see §7).

## 1. Method and witnesses

| Witness | What was actually done |
|---|---|
| W2 source | `git` clone of Product at `d14da74c`; source reads of `src/`, `css/`, `js/`, `data/`, `scripts/` |
| W3 artifact | `npm run strangler:build:production-like` → exit 0; `dist/` produced on the sanctioned production-like path (104 Astro pages + 1018 legacy files) |
| W4 browser | Chromium 153 via Playwright: **64 page loads** = 16 routes × {desktop 1440×900, mobile 390×844 isMobile/hasTouch} × {`colorScheme:'light'`, `colorScheme:'dark'`}; console/pageerror capture; axe-core `wcag2a/wcag2aa/wcag21a/wcag21aa`; image natural-size checks; geometry/overflow capture |
| W4b browser (targeted) | Row probes on `/articles/20-antisovetov-pastoru/`, `/articles/krajne-li-isporcheno-serdce/`, `/articles/kod-da-vinchi/`, `/articles/dzhon-gill-chast-2-uchenyi/`, `/hard-texts/genesis-6/`, `/nagornaya/chast-2/`, `/articles/`, `/` at 320/360/390/430 px; print emulation on genesis-6 |
| W5 mechanism | Source-level mechanism reads for each confirmed symptom (owners named below) |
| W6 history | Product `gh` run/PR/issue inventory: last 12 `Deploy to GitHub Pages` runs on `main`, 10 open PRs, issue list |

Raw receipts: `evidence/2026-10-14-axe-and-overview-summary.txt`, `evidence/2026-10-14-axe-node-detail.txt`, `evidence/2026-10-14-master-row-probe.json`, `evidence/2026-10-14-product-pr-and-release-state.txt`.

## 2. Current-anchor verdicts on the active MASTER (main moved `d586aa63` → `d14da74c`)

Product `main` advanced materially (19 PRs merged after 2026-09-30), so the previous admission snapshot is superseded.

### 2.1 Closed by this pass (current-anchor proof)

| Row | Verdict | Witness at `d14da74c` |
|---|---|---|
| `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` | **FIXED-CURRENT** | Release path is green: `Deploy to GitHub Pages` on `main` succeeded on **12 consecutive runs**, latest `d14da74c` 2026-10-12T09:13:29Z. The Lawson route is now present in **all** discovery surfaces: `data/route-search-policy.json:1036`, `data/search-manifest.json:1813`, `sitemap.xml:763` (95 `<loc>`), `feed.xml:22`, `migration/page-ownership.json:54` (`astro` / `production-dist`). `npm run strangler:build:production-like` = exit 0. |
| `GBS-BASELAYOUT-MISSING-SKIP-LINK` | **FIXED-CURRENT** | `src/layouts/BaseLayout.astro:189` ships `<a class="astro-skip-link" data-map-skip-link href="#main-content">Перейти к основному содержимому</a>` with `:focus`/`:focus-visible` styles at `:219/:235`; landed via `b601072b` (`fix(a11y): re-anchor and harden BaseLayout skip link (#2156)`). |
| `GBS-OPEN-CONTENT-PR-DISPOSITION` | **RESOLVED (narrowed to 3 PRs)** | Of the 2026-09-30/10-01 PR set: **#2145, #2150, #2153, #2154 CLOSED**; **#2146, #2148, #2151, #2152 MERGED**. Only `#2142` (research-only), `#2143` (genealogy draft), `#2144` (Dependabot) remain open — none of them is the previously blocking release lane. |

### 2.2 Confirmed-current (fresh independent witnesses, not carried forward)

| Row | Fresh witness at `d14da74c` |
|---|---|
| `GBS-QUIZ-LITERAL-MARKUP` | Deep walk of `window.SITE_CONFIG.quiz` in Chromium: literal tag counts **74** (`/articles/20-antisovetov-pastoru/`), **58** (`/articles/krajne-li-isporcheno-serdce/`), **8** (`/articles/kod-da-vinchi/`), **6** (`/articles/dzhon-gill-chast-2-uchenyi/`). Same magnitudes as the 2026-10-01 count. |
| `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` | `/articles/dzhon-gill-chast-2-uchenyi/` at 390×844: `.quiz-next` exists, `display: none`, `getBoundingClientRect()` = 0×0, inside `[data-gill-v16]`. Dead end below 1024 px still real. |
| `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST` | Dark scheme: `.quiz-wrapper` painted surface still `rgba(255, 253, 248, 0.92)` while `.quiz-question` colour is `rgb(230, 225, 215)` → the previously measured **1.08:1** pairing still exists in the built artifact. |
| `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` | Print emulation on `/hard-texts/genesis-6/`: **101** `[data-print-terminal-follower]` nodes, **all 101** `display:none`, **4 245** characters removed — including `article.genesis6-card`, `picture.genesis6-card__picture`, `span.genesis6-card__action`. |
| `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY` | `/karty/avraam/` in all four combos: `h1` count = **0** after ready (page ships the `sr-only` fallback in HTML, the ready state removes it). |
| `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS` | axe `nested-interactive` (serious) on `span[data-tip="43"]` on `/articles/20-antisovetov-pastoru/` — the outer trigger still contains the inner focusable tip-19 trigger. |
| `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` | `/` mobile: the scroll-top control is focusable and matches `:focus-visible` (2 px ring computed) but has computed `opacity: 0` at 39×39 px — keyboard users focus an invisible control. |
| `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` | **NARROWED, still current on one surface:** `/articles/` → `#themeToggle` matches `:focus-visible` with computed `outline: 0px none`. `/` and `/hard-texts/genesis-6/` now compute `2px solid` (`rgb(8,125,145)` / `rgb(122,46,46)`) — the home/genesis half is fixed; the `/articles/` half is not. `css/mobile-hotfix.css` still carries `.gb-nav-search-icon,.h-cp-btn,.theme-toggle{…outline:0!important}` plus a `:hover/:focus/:active` variant with the same `!important`. |

### 2.3 Not re-measured in this pass

`GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`, `GBS-MOBILE-CHROME-*` (3 rows), `GBS-HEADER-*` (3 rows), `GBS-NAGORNAYA-*` (4 rows), `GBS-BAPTISTS-*` (2 rows), `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`, `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL`, `GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS`, `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST`, `SYS-GENEALOGY-WEBKIT-WITNESS`, `SYS-READER-SPEED-KEYBOARD-MODEL`. They keep their previous admission; several have an active Product owner (see §7). `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` in particular is **already owned** by open drafts #2162/#2168.

## 3. New findings

### F1 — `SYS-FOOTNOTE-MARKER-INTERACTIVITY` (new system lane, admitted 2026-10-14)

`span.fn-marker[role=button][tabindex=0]` is a single interactive control that **contains** its own `.tooltip` payload. When the payload contains a link (normal for source citations), the control has a focusable descendant, and axe reports `nested-interactive` (serious, WCAG 4.1.2). Measured on `/articles/krajne-li-isporcheno-serdce/` (6 nodes: notes 1, 3, 8, 11, 12, 13) and `/articles/dzhon-gill-chast-1-chelovek/` (1 node).

Same structure also produces `label-content-name-mismatch` (WCAG 2.5.3): the accessible name is `aria-label="Показать сноску N"`, while the element's own content — the whole citation text, hidden only by `opacity: 0`, which assistive technology still exposes — is not part of that name.

**Mechanism / owner:** the note projection is a shared runtime (`note projection: 184 notes across 5 routes; interaction owner=SiteUtils.makeTooltipController` in the build log); `js/site.js` adds `role="button"`, `tabindex="0"` and `aria-label` to every `.fn-marker`. This is **not** route-specific markup, which is why it is proposed as a systemic row rather than a route defect. It also subsumes the shape of the existing `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS` symptom class.

**Audit-harness gap (separate claim, same evidence):** the repository already measures exactly this condition — `scripts/note-registry-browser-contract.mjs:202` records `source:no-nested-interactive-footnotes` using the selector `.fn-marker .tooltip a, …` — but only inside its single-`ROUTE` fixture. The gate is green while at least two other note-bearing routes fail the same condition. A green contract here is not site-wide evidence.

### F2 — `GBS-CHROME-LABEL-IN-NAME-MISMATCH` (new)

`label-content-name-mismatch` (serious, WCAG 2.5.3) fires on interactive chrome whose visible text/iconography is not contained in its accessible name. Observed nodes (light scheme, first two viewports):
`#mobPartTocBtn` (krajne, antisovetov, gill-1), `#barSectionBtn` + `#nagFontDec` + `#nagFontInc` (`/nagornaya/chast-2/`), `#hmBottomBtn` + `#hmSectionBtn` (kod-da-vinchi, Lawson), `.gbs2-ctl[data-gbs2-font]` (`/baptisty-rossii/`), `.map-trigger[data-tip]` (antisovetov), `.flip-card` (gill-1), `.error-flip-card` (kod-da-vinchi), `a[aria-label="Telegram личный"]` (`/about/`), `#heroSearchBar` (`/`). 32 occurrences over the 64-load sweep.

### F3 — text-contrast residuals with measured ratios (new evidence, P3 batch)

axe measured concrete ratios on visible text in the light theme (4.5:1 required):

| Element | Measured | Where |
|---|---|---|
| `.article-byline__updated` / `.article-updated` | **3.15:1** (`#8f8f8e` on `#fdfcf9`, 10.4 px) | krajne, kod-da-vinchi |
| `#gbs2Pct` | **3.42:1** (`#eadac7` on `#9a6a2f`, 11 px bold) | antisovetov |
| `.h-hero-desc`, `.h-hero-tagline` | reported failing | `/articles/`, `/hard-texts/`, `/pastor-series/`, `/biografii/` |
| `.gbx-backlinks__title`, `.gill-card__kicker`, `.mobile-btoc-section__label`, `#nagFontDec/#nagFontInc`, `.crumb`, `cite` | reported failing | per-route, see receipt |

The `.heart-flip-*` occurrences (1.05–1.22:1) are reported by axe on the **back face of reversible cards**; this pass did **not** establish whether that face is user-visible without interaction, so they are recorded as **UNPROVEN** and must not be filed as defects on this evidence alone.

### F4 — unfinished work / planned content (inventory, not a defect)

- Explicit "planned" surfaces exist on **two** built routes only: `/hard-texts/genesis-6/` (parts I–V, each rendered as a non-link `<article class="genesis6-card--planned">` with «Без ссылки до готовности») and `/pastor-series/` (prose explaining that a further instalment is deliberately not planned).
- `/` carries a «В планах» roadmap section with two items (hymns; thematic studies).
- **No dangling link to an unwritten page was found** in the sampled set: 0 broken images across 64 loads, and the planned cards are not anchors.
- Active owner: Product PR **#2183** ("fix(baptisty): restore six dead Commons source URLs + **unfinished-work audit**") — do not duplicate.

### F5 — glossary and tooltips (state of the capability)

Positive witness (W2+W4): `node scripts/glossary-contract-audit.js` → `Glossary contract passed: 130 terms, 370 aliases, 834 source files` (exit 0); `data/glossary.json` has **130** entries with no missing `definition`/`detail`/`category`/`aliases` and no detail shorter than 200 chars; `data/glossary-policy.json` v3 declares root/prose selectors, separate hydration vs placement forbidden lists and cadence `1200/20/3`; `js/glossary.js` is 11 822 B (below the 12 000 B ceiling) and fetches `/data/glossary.json` + `/data/glossary-policy.json` at runtime; `scripts/copy-legacy-to-dist.js` publishes `data/` (only `data/bible` is internal), so the runtime payload is reachable in `dist`.

Open questions raised (owner decision, not defect):
1. **No public glossary index route exists** (`src/pages` has no `glossary/slovar/termin` route, and no navigation link to one). 130 curated terms are therefore reachable *only* as inline tooltips.
2. `js/glossary.js` `inline()` renders `detail` with an **`<em>`-only** allowlist; any other tag in future dictionary text renders literally. No current entry violates this, so it is a guard gap, not a current defect.
3. `docs/TEEN-SERIES-GLOSSARY-REFERENCE-PLAN.md` deliberately leaves `совесть`, `покаяние`, `средства благодати`, `апостасия` without shared entries — approved design, do not file.

### F6 — element placement (negative witness, stated as such)

Across all 64 loads, `document.documentElement.scrollWidth === clientWidth` — **no horizontal page overflow** was produced by any sampled route at 1440 px or 390 px. The raw "offender" lists produced by a naive bounding-box scan contain only off-canvas SVG internals and legacy off-screen anchors (`left: -99xx`) and must not be reported as layout defects. Header-control geometry at 320/360/390/430 px is recorded in the receipt for the next pass; no overlap or clipping was proven here.

`/karty/avraam/` page-level area is under an active owner: issue **#2180** + PR **#2181** ("prevent narrow-screen overflow in map holding titles").

## 4. Environment limits (honest boundary)

- Live host unreachable from the sandbox (`gospod-bog.ru`); all browser claims are exact-SHA local-build claims.
- `favicon.ico` / `apple-touch-icon.png` / `icons/icon-192.png` CSP `img-src` console errors in the sweep are a **local-origin artifact** of serving `dist` from `127.0.0.1` while the markup references the absolute production origin. Not filed; marked `skipped: sandbox egress/local origin`.
- One `net::ERR_CONNECTION_CLOSED` on `/` is an external-request artifact of the sandbox network, not a site defect.

## 5. Suggested dispositions

| Proposed ID | Class | Suggested disposition |
|---|---|---|
| `SYS-FOOTNOTE-MARKER-INTERACTIVITY` | system lane | **admitted in this pass** (see `verified/MASTER_BUG_MATRIX.md`); the class-level guard is the extension of the existing `note-registry-browser-contract.mjs` assertion from one fixture route to the note-bearing route set |
| `GBS-CHROME-LABEL-IN-NAME-MISMATCH` | defect row | **admitted in this pass**; repair per-owner (`mobPartTocBtn` / `barSectionBtn` / header controls / `gbs2-ctl` / map-trigger), not per-route |
| `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` | defect row | **admitted in this pass** with the `.heart-flip-*` half excluded (UNPROVEN) |
| glossary index route | owner decision | ask the owner whether the 130-term dictionary should have a browsable surface |

## 6. Summary for verifier

- Strongest new material: F1 (systemic note-marker interactivity + the harness gap that hides it) and the current-anchor **closures** in §2.1, which let MASTER shrink.
- Weakest material: §3 F3 `.heart-flip-*` contrast (visibility unproven) and the header-geometry half of F6.
- Nothing in this pass authorises a Product mutation by itself: every row still needs the normal lane record before repair.

## 7. Addendum — header control geometry (element placement, re-measured)

A dedicated geometry probe at 320/360/390/430/768 px (mobile emulation) produced a **positive** finding on top of the negative
witness in §3 F6:

- `/articles/` (`body.articles-index-page`) at **768×900**: the header control cluster `div.mobile-controls` spans **747–823 in a
  768 px viewport** — `#themeToggle` ends **55 px beyond the right edge**. `document.documentElement.scrollWidth` stays 768 because
  `body { overflow-x: hidden }` clips the cluster, so the search and theme controls are **invisible and untappable** at iPad-portrait
  width. Screenshot captured but **not committed** (PNG never enters Git per the source protocol); re-capture with the header probe
  (`isMobile 768×900, full-page screenshot`) or read `evidence/2026-10-14-header-geometry.json` for the numeric witness.
- `/articles/` at **320 px**: `#hMobileMenuBtn` spans 281–325 (**5 px past** the edge) and `#gbSearchBtn` (205–249) overlaps
  `#themeToggle` (237–281) by **12 px**.
- `/`, `/izbrannoe/` and `/hard-texts/genesis-6/` measured **clean** at every width in this sweep: all controls 44×44, inside the
  viewport, no overlap.

Consequence for the matrix: `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT` is **confirmed and widened** (the current instance is
the articles-index chrome, not every route) and `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP` is **confirmed on `/articles/`** while the
previous `/`, `/izbrannoe/`, `/hard-texts/genesis-6/` instances did not reproduce in this sweep.

Receipts: `evidence/2026-10-14-header-geometry.txt`, `evidence/2026-10-14-header-geometry.json`.

## 8. Follow-up run — 2026-10-15: `validate:static-publication` executed (item previously NOT RUN)

`npm run validate:static-publication` — the suite this report listed as **not run** — was executed on the same exact-SHA
production-like build and is **green**:

- `npm run strangler:build:production-like` → exit 0;
- `npm run validate:static-publication` → **exit 0 with all 41 chained `&&` commands running in order** (a non-zero step would
  abort the chain and change the exit code). The 41 commands in execution order, plus the 59 nested npm-script invocations, are
  listed in `evidence/2026-10-15-validate-static-publication.txt`.
- The command that the 2026-09-30 record called red, **#24 `node scripts/audit-pro.js`, is green at `d14da74c`**:
  `✅ PASSED · 166 passed · 7 warnings · 0 errors`. The script's own tail (`process.exit(R.errors.length ? 1 : 0)`) shows exit 0
  means zero errors rather than a hardcoded success, so this is a real state change, not a reporting artifact.

### New improvement admitted from the warnings: `SYS-AUDIT-PRO-LLMS-ROOT-RESOLUTION`

Two of the seven warnings — `llms.txt → /articles/anatomiya-padeniya-pyat-stadiy/ (file not on disk)` and the same for
`/articles/teksty-pisaniya-kotorymi-manipuliruyut/` — are **false positives**, proven three ways: both files exist in the build
(`dist/articles/<slug>/index.html`, sources `src/content/articles/<slug>.mdx`), both appear twice in `dist/sitemap.xml`, and an
exhaustive re-check of `dist/llms.txt` shows **all 19 distinct `/articles/.../` URLs resolving on disk, 0 missing**.

Cause: `scripts/audit-pro.js` → `llmsTxtSanityGuard` (from line 3671) checks `path.join(ROOT, url, 'index.html')` — the repository
root — instead of the built `dist/`. Legacy shadow pages live in the repo root, so only Astro-native routes are falsely reported;
the guard cannot tell «page deleted» from «page is native». Because the owner cares about LLM discoverability, a permanent false
warning also hides a real removal, so this is filed as the first **verified necessary improvement** row (matrix 30 → 31 units).
The other five warnings (CSS/JS size budgets, `deploy.yml` not using `actions/deploy-pages@v4`, a missing `concurrency:` group in
`genealogy-v2-publishable-contract.yml`, five magic `z-index` values) are recorded verbatim in the receipt and are **not** admitted
as defects.

## 9. Continuation run — 2026-10-15: the three open items measured (browser)

The first follow-up closed the validator question. This one takes the three items the report had left open and measures them instead of
carrying them.

### 9.1 `.heart-flip-*` — the UNPROVEN pair is now a proven defect (light theme only)

The reversible card on `/articles/krajne-li-isporcheno-serdce/` is `div.heart-flip-card[role=button][tabindex=0]`, 752×545, and it flips
by **both** user paths (keyboard Enter on the focused card and a pointer click both set `.flipped`). Face styling is transform-based, so
the decisive witness is the painted result:

- **Light theme:** `.heart-flip-back` has **no background of its own** and paints `rgb(255,255,255)`, while `.heart-flip-back-body` is
  `rgba(255,245,220,.82)`, `.heart-flip-back-closing` `rgba(255,245,220,.72)` and the `.highlight-divine` span `rgb(200,169,126)` —
  axe `color-contrast` **1.05–1.22:1** against 4.5:1, and the after-flip screenshot reads as a white rectangle with barely perceptible
  text. The card's whole payload disappears on a white page.
- **Dark theme:** the same face paints `rgb(17,14,7)` and is fully legible — so this is a light-theme regression, not a "dark-first" quirk.
- **Controls:** `.flip-card` (kod-da-vinchi) back `rgb(238,245,236)` with `rgb(26,26,26)` text and `.error-flip-card` back
  `rgb(238,247,242)` with `rgb(26,26,26)` text — the sibling families **do** set a themed surface, so the missing surface belongs to this
  one owner.

Withdrawn from the axe list with controls (they are **not** defects): `.heart-flip-hint-text` — the reported 1.18:1 is sampled against an
ancestor colour, but the text is painted over the dark front artwork where it reads fine; and `#gill-search-p-131/132` — those are
Pagefind's own ids stamped on the very same back-face paragraphs, not separate elements.

Admitted as `GBS-KRAJNE-HEART-FLIP-BACK-LIGHT-UNREADABLE` (defects 28 → 29, units 31 → 32).

### 9.2 Print — no body loss, but the hidden region is a route-family rule, not a genesis-only quirk

Real A4 print-to-PDF runs with pdf.js text extraction on five routes:

| route | pages | DOM main chars | PDF text chars | hidden follower nodes | hidden follower chars |
|---|---|---|---|---|---|
| `/about/` | 4 | 4 322 | 4 527 | 0 | 0 |
| `/baptisty-rossii/` | 6 | 5 444 | 5 085 | 16 | 702 |
| `/articles/dzhon-gill-chast-1-chelovek/` | 26 | 36 082 | 36 295 | 9 | 607 |
| `/hard-texts/genesis-6/` | 3 | 3 257 | 1 692 | 71 | 4 315 |
| `/articles/krajne-li-isporcheno-serdce/` | 40 | 70 809 | 64 842 | 203 | 24 902 |

Normalised containment of long body sentences shows **0 body sentences absent from the PDF text layer on every route** — the rule costs
apparatus, navigation and planned-content cards, not prose. The matrix row is nevertheless **widened**: the affected `.genesis6-range`
container measures **1 700 px tall on an article route**, so `/articles/krajne-li-isporcheno-serdce/` loses 203 marked nodes / 24 902
chars (series navigation, quiz shell, related blocks) and kod-da-vinchi loses 34 / 1 292. On genesis-6 the planned-article cards keep
their titles and «Планируется / В планах» markers on paper. At true A4 width the print layout measured **0 overflowing elements** on all
five routes (the 1 440 px print-emulation viewport shows card overflow on `/about/` and `/baptisty-rossii/` and a 1 448 px hero image on
gill-chast-1 at A4 width — recorded as a boundary, not claimed as a defect, because the A4 measurement contradicts it).

### 9.3 `prefers-reduced-motion` — honoured where it matters

- The `reveal-fallback` elements (`.quote-box`, `.warn-box`) resolve to `opacity: 1; transform: none` with a 0 s animation under `reduce`;
  the 3 s delay belongs to the fallback path itself, not to motion — no defect.
- `/karty/avraam/` switches `meSpringIn` (22 nodes) 0.5 s → 1e-06 s and `meProgressFlow` (2 nodes) 1.5 s infinite → 1e-06 s; 0 long
  transitions remain, against 8 without the preference.
- Nothing new admitted from this sweep.

### 9.4 Dark-theme contrast pairs appended to the batch row

On the same route in the dark theme, `.author-card-icon` ("ФМ", 52×52, 18 px/600) and `#quizLaunch` («Начать проверку», 191×46,
15.2 px/700) both paint `rgb(255,255,255)` on `rgb(212,165,116)` = **2.22:1** — visible without interaction, no image behind. Appended to
`GBS-TEXT-CONTRAST-RESIDUAL-BATCH`.

Receipts: `evidence/2026-10-15-continuation-probes.txt` plus `evidence/2026-10-15-{heart-flip-face-probe,cards-probe,card-contrast-axe,`
`print-a4-and-pdf,print-body-containment,print-sweep,reduced-motion-sweep,print-offenders-and-rm-durations}.json`.
