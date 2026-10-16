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
| `#gbs2Pct` | ~~**3.42:1** (`#eadac7` on `#9a6a2f`, 11 px bold)~~ — **DISPROVEN 2026-10-15**: axe read the pill as background and the track as foreground; painted-glyph measurement is **11.58:1**, not a defect (see §11) | antisovetov |
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
their titles and «Планируется / В планах» markers on paper. At true A4 width the print layout measured **0 overflowing elements** on all five routes — **CORRECTED 2026-10-15 (same day):
this sentence is wrong and is withdrawn.** The committed receipt itself records **24** overflowing elements on `/baptisty-rossii/`
(`document.scrollWidth` 810 vs clientWidth 794, widest `A.h-article-card` right=810/width 826). Re-measured across all 16 routes at
794 px print width: `/` **34**, `/baptisty-rossii/` **24**, `/articles/` **1**, `/konfessii/russkij-baptizm/` **2**, every other route 0.
Rendered PDF pages of `/` (pages 1–4) and `/baptisty-rossii/` (pages 1, 3) show no visibly clipped content, so this stays a geometry
boundary with render control rather than an admitted defect. See §10.4 for the full correction list.

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

## 10. Print-media contrast collapse — new defect class (2026-10-15, continuation 2)

A systematic print pass — full-page pixel scan over all 16 routes plus pixel-truth contrast (the text's colour is read, the element is
re-shot with its text transparent, and the pixels inside the text's own box are sampled) — found that the print reset in
`css/site.css` **repaints text black regardless of what sits behind it**.

### 10.1 Root cause

`css/site.css:178` — `@media print { *, *::before, *::after { background: transparent; color: #000; box-shadow: none; text-shadow: none; … } }`
— with a second block earlier in the same sheet (`body{background:#fff!important;color:#000!important}`, `a{color:#000!important}`). Two
consequences: text over an **image** becomes black-on-dark, and components that keep their light colour through `!important` land on a
surface the same reset just made transparent.

### 10.2 Measured instances (screen → print)

| owner | screen | print | evidence |
|---|---|---|---|
| home `.h-featured-title` ×4 | `rgb(255,255,255)` **17.8–18.2:1** | `rgb(0,0,0)` **1.09–1.15:1** | `featured-{screen,print}-{0..3}.png` |
| home `.h-featured-abstract` / `.h-featured-author` | white | **1.11:1** / **1.09:1** | full-page scan |
| `/biografii/` `.h-hero-tagline` | 4.41:1 | **1.23:1** | `case-0-{screen,print}.png` |
| `/biografii/` section label | 16:1 | **1.64:1** | full-page scan |
| `/nagornaya/chast-2/` `.nag-project-nav__link` | 11.4:1 | **1.46:1** | `case-3-{screen,print}.png` |
| `/` `.h-article-kicker` / `.h-meta-tag` | 4.52:1 | **1.53:1** / **1.52:1** | `case-4-{screen,print}.png` |

Admitted as `GBS-PRINT-MEDIA-CONTRAST-COLLAPSE` (defects 29 → 30, units 32 → 33). axe cannot detect any of this: with an image
background it inherits an ancestor colour — which is exactly why the first pass could only mark this family UNPROVEN.

### 10.3 Method limit now binding for print claims

Chromium's PDF **text layer is not a reliable witness**: the black-on-dark cover captions *are* present in the extracted text (all five
titles match after letters-only normalisation) although the rendered page shows them unreadable, while on Krajne page 2 the text layer
*omits* the words «Нового Завета» that the render displays. Print evidence must therefore rest on page renders and pixel sampling.

That also confirms the earlier §9.2 result in the only direction it can be trusted: absence of a match in the text layer is **not** proof
of loss, so the "no body loss" finding stands on the render check (`out/krajne-pdf-p2.png`), not on the extraction.

### 10.4 Corrections of my own claims (in place)

1. «At true A4 width 0 elements overflowed on all five routes» (§9.2) — **withdrawn as wrong**; 24 overflow elements were already in the
   committed receipt for `/baptisty-rossii/`. Corrected in place in §9.2; the honest figure across 16 routes is `/` 34,
   `/baptisty-rossii/` 24, `/articles/` 1, `/konfessii/russkij-baptizm/` 2, others 0, with no visible clipping in the rendered pages.
2. The first continuation's printed figure «no body loss anywhere, 0 long body sentences absent» **survives**, but only because it is a
   *pass* (text found); it must not be re-run as a loss check — the extraction fails in both directions.

### 10.5 Screen-side item found by the same scan

`/konfessii/russkij-baptizm/` `.crumb` renders `rgb(94,90,84)` on a near-black map background = **2.93:1 in print and on screen**
(pixel-sampled) — appended to `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`, since unlike the rest it needs no print media to fail.

Receipts: `evidence/2026-10-15-print-contrast-and-corrections.txt`, `evidence/2026-10-15-print-contrast-scan.json`,
`evidence/2026-10-15-print-featured-cover-contrast.json`, `evidence/2026-10-15-print-cases-verified.json`,
`evidence/2026-10-15-print-loss-16-routes.json`.

## 11. Painted-glyph arbitration — method correction, one disproven entry, two more defects confirmed (2026-10-15, continuation 3)

### 11.1 The method was wrong for alpha text and image backgrounds

The first print scan compared an element's **computed** colour with the sampled background. Measured now, that fails twice:
`rgba(255,255,255,.35)` is not what reaches the eye (the painted blend is `rgb(94,99,100)` = 3.10:1, not the 1.9:1 the naive
method claimed), and a sampling box that contains a picture or a faded overlay returns a luminance the text is not sitting on.

The method used from here — shoot the element normally (A) and with its text transparent (B); the strongest |A−B| pixel is the
painted glyph colour, the B pixels where A≈B are the true background — is applied to every case that matters below.

### 11.2 One entry disproven (removed from the matrix)

`#gbs2Pct` is **not** a defect: axe reported 3.42:1 by treating the pill as the background and the track as the foreground;
the painted measurement is **11.58:1**. The entry is struck from `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` and struck through in §3 F3 above.

### 11.3 One entry sharpened, six added (both media, i.e. real screen defects)

`.article-byline__updated` is **2.99:1** painted (axe said 3.15:1 — real, slightly worse). Added: `.h-article-abstract` **4.37:1**
(marginal against 4.5:1), `.error-flip-label` **3.24:1**, `.ctw-pin-lbl` **3.34:1**, `.genesis6-card__state` («Планируется»)
**1.54:1 on screen / 2.67:1 in print**, `.genesis6-hub__kicker` **3.03:1 / 3.83:1**, `.crumb` **2.93:1**.

### 11.4 The print-reset defect gets harder numbers

`GBS-PRINT-MEDIA-CONTRAST-COLLAPSE`: home featured title 18.47 → **1.13**, abstract 7.39 → **1.10**, time 3.10 → **1.10**,
author 3.72 → **1.12**; Krajne series nav link 11.44 → **1.23**; `/biografii/` tagline 4.41 → **1.27**. The axe reading of the
heart-flip hint (1.18:1) is confirmed false: painted, that text is **9.23:1**.

### 11.5 axe boundary for this project

axe remains the screen-media census (it found these owners), but any contrast *conclusion* on image-, gradient- or alpha-backed
surfaces must use the painted-glyph method — it produced one false positive, one false negative and one mildly optimistic number
on this very page set.

### 11.6 `GBS-CHROME-LABEL-IN-NAME-MISMATCH` — per-owner repair table

161 nodes over 16 routes × {390, 1440} px collapse into **14 owners**; the full table with each owner's current `aria-label`,
visible text, control size and proposed direction is in `evidence/2026-10-15-painted-contrast-and-label-table.txt` §4. The
split that matters: singular controls (`article-end-btn`, `gbs2-ctl`, `nag-fontsize-btn`, `hmbar-*`, `mobile-btoc-section`,
`h-hero-search`) are repaired by putting the visible text into the name; the `flip-card`, `error-flip-card`, `heart-flip-card`,
`map-trigger` and `fn-marker` families cannot be — their visible content *is* the payload, so the container must stop being the
labelled control, the same conclusion the `SYS-FOOTNOTE-MARKER-INTERACTIVITY` row reaches.

Receipts: `evidence/2026-10-15-painted-contrast-and-label-table.txt` plus `evidence/2026-10-15-{painted-contrast,print-contrast-full,print-vs-screen,label-name-nodes,label-name-owners}.json`.

## 12. Footnote marker numbering — a new defect, plus the tooltip system verified working (2026-10-16, continuation 4)

### 12.1 The number a marker shows is not the number of the note it opens

The build's NoteRegistry makes the **document ordinal** canonical: it rewrites `aria-label` to `Показать сноску <ordinal>`
(`scripts/lib/note-registry.mjs:172-175`), stamps `data-note-ordinal` (`:330`) and numbers the generated endnotes by the same
ordinal (`:233-236`). The marker's **visible number is authored text** that the registry never rewrites and never validates.

The registry's fail-closed list names `authored ordinal drift`, but that check runs only when a marker is authored with
`data-note-ordinal` — and **0 of 184 markers** carry it (grep over `src/`, `scripts/`, `*.astro`/`*.html`/`*.md`: 0 hits). The
contract test exercises the drift path only with a synthetic fixture (`scripts/note-registry-contract-test.mjs:117-118`), so the
drift ships silently.

Measured (static parse of every built `index.html` in `dist`, cross-checked in the live DOM on Krajne):

| route | markers | visible ≠ ordinal | no visible number | first visible numbers |
|---|---|---|---|---|
| `/articles/kod-da-vinchi/` | 21 | **19** | 0 | 1,2,4,5,6,7,8,9,11,12 |
| `/articles/krajne-li-isporcheno-serdce/` | 40 | **39** | 0 | 1,**27**,**36**,2,3,4,5,6,11,12 |
| `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | 116 | **114** | 2 | 1,2,3,4,5,6,7,8 |
| `/articles/dzhon-gill-chast-1-chelovek/` | 1 | 0 | 1 | — |
| `/articles/dzhon-gill-chast-2-uchenyi/` | 6 | 0 | 6 | — |
| **total** | **184** | **172** | 9 | — |

Live first five on Krajne: `Показать сноску 1`→`1`, `2`→`27`, `3`→`36`, `4`→`2`, `5`→`3`. The consequences: the marker showing
«27» is the second footnote and opens endnote 2; a screen-reader user hears «Показать сноску 2» where a sighted reader sees 27;
and in **print** the inline tooltips are `display:none` while the endnotes print numbered by ordinal, so the printed
cross-reference is wrong on paper — on articles whose stated purpose is careful sourcing. No orphan notes exist: endnote count
equals marker count on all five routes (1/1, 6/6, 116/116, 21/21, 40/40).

The repair belongs at the registry, next to the `aria-label` rewrite: write the ordinal into the marker's visible text, or author
`data-note-ordinal` everywhere so the existing fail-closed check fires. Admitted as `GBS-NOTE-MARKER-NUMBER-DRIFT` (P1).

### 12.2 The tooltip interaction is healthy — measured, not assumed

Because the markers are the elements the tooltip runtime owns, the whole interaction contract was measured on the live page:
desktop **hover** opens the tip (moved to `document.body` as `.gb-floating-tip.is-open`, opacity 1, 544×54, `pointer-events:auto`)
and leaving closes it; **pointer click** opens and a second click toggles closed; **focus alone** opens; **keyboard Enter** opens;
**Escape** closes; on **mobile 390×844** (`isMobile`+`hasTouch`) a **tap** opens it as a 390×88 bottom sheet and Escape closes it.
Note text is also reachable without any hover through `aria-describedby` → the endnote (AX tree: name `Показать сноску N`,
description = note text + «Вернуться к отметке N»). The `⟦сноска: …⟧` boundary spans visible in `textContent` are `[hidden]` +
`aria-hidden="true"` (`display:none`, 0×0) and never paint — the rendered tooltip reads exactly «NASSCAL e-Clavis — Gospel of Philip; Darrell Bock, The Missing Gospels (2006).» alone.

### 12.3 Self-corrections in this continuation (visible, not silent)

- **SC-C1** — the 2026-10-15 label/name table listed `fn-marker` as a case where the *name* should absorb the visible number.
  That direction was backwards: the ordinal is the canonical contract and the visible number is what drifted. `fn-marker` leaves
  the label-in-name row and becomes its own defect (§12.1); the earlier receipt carries a dated correction note.
- **SC-C2** — «desktop hover does not open tooltips» was my measurement error: the first probe took coordinates from
  `boundingBox()` without scrolling the marker into view, and read the tip inside the anchor after the runtime had moved it to
  `document.body`. Re-measured correctly, every path works (§12.2). No defect.
- **SC-C3** — «the tooltip shows `⟦сноска: …⟧` to users» is false: those spans are `display:none`; the painted tooltip is clean
  (screenshot in the receipt).

Receipts: `evidence/2026-10-16-note-marker-number-drift.txt`, `evidence/2026-10-16-marker-drift-sweep.json`,
`evidence/2026-10-16-fn-number-structure.json`, `evidence/2026-10-16-fn-number-detail.json` (the painted-tooltip screenshot is binary and therefore kept in the harness at `arena-harness/out/tip-open-ctx.png`, not in git).

### 12.4 Closed: the «missing» notes on `/articles/rimlyanam-7-veruyushchiy-ili-neverushchiy/`

Continuation 4 left this route unchecked because `dist` showed no footnote markers while the tree contained «Показать сноску».
Answer: that phrase lives in a **legacy hand-authored copy** in the repository root (12 exist); the shipped page is the Astro one,
where the eight old footnotes were restructured into the article's own sources prose («Первоисточники …» with Calvin, Owen, Hodge,
MacArthur, Piper, Schreiner, Moo, Lloyd-Jones, Bailie, Street, Kobelia). The legacy copy cannot reach production —
`scripts/copy-legacy-to-dist.js` never overwrites an Astro-owned route, all six `fn-marker`-bearing dist files differ byte-wise
from their legacy counterparts, and **zero** dist files carry the old unnumbered `aria-label="Показать сноску"`. Rendered check at
1440×900 and 390×844: correct title/`h1`, 0 markers, 0 endnotes, sources prose present, no same-origin HTTP errors, and the only
console error is the documented Yandex-Metrica sandbox-egress artifact. No defect; receipts
`evidence/2026-10-16-note-marker-number-drift.txt` §6 and `evidence/2026-10-16-rimlyanam-render.json`.

## 13. Glossary — definition provenance, AT association, and coverage (2026-10-16, continuation 5)

### 13.1 One term, one page, two definitions

`js/glossary.js` assembles a tooltip two different ways: a marker **without** an authored tooltip gets the canonical brief from
`data/glossary.json` via `tip(d,k)`, while a marker **with** an authored `.gtip` goes through `upgrade()`, whose argument list is
`render(h, plain(h) || z.brief, z.detail)` — **the authored text wins the brief slot** and only the expandable detail comes from
the dictionary. The result is visible to a reader: on `/articles/krajne-li-isporcheno-serdce/` the term «остаточный грех» appears
four times and is summarised **two different ways** (3 occurrences keep the author's «В реформатском богословии: греховная
склонность, остающаяся в возрождённом верующем после обращения …», 1 shows the dictionary's «Оставшееся присутствие греха в
жизни возрождённого человека …»), and all four expand to the **same** dictionary detail. `/baptisty-rossii/yuzhnaya-shtunda/`
repeats the pattern for «штундизм» (3 occurrences, 2 briefs). Total: **2 keys, 7 occurrences** across the 13 `.gterm` routes.
`docs/glossary-contract.md` calls the dictionary canonical, so a reader has no way to tell which wording is authoritative.

### 13.2 The definition is not announced with its trigger

On focus the tooltip opens correctly, but the trigger carries no `aria-describedby`: the accessibility tree returns
`button name='Братский листок' description=<empty> expanded=true` while the definition sits in a separate, non-ignored
`StaticText` branch. The text is therefore reachable by virtual cursor but never announced with the control — while `.fn-marker`
on the same pages does attach the note text as the button's description. Two interaction models for the same affordance on one
page. **Confirmed at 390×844 as well** (touch tap opens a bottom sheet; `aria-describedby` still absent, trigger description still
empty, for both a keyed and a keyless marker), so this is a contract fault rather than a responsive branch.

### 13.3 Coverage (populations, for the record)

51 authored markers hydrate to **175** live terms on 13 routes; **139** carry a dictionary key and **36** authored `.gtip` markers
deliberately do not (historical documents such as «Братский листок», «Лидия Винс», «Самиздат»). Of the dictionary's **130**
entries, **29** never occur on any built page, and **no page lists the dictionary** — no index route, no client-side fetch of
`glossary.json` — so those 29 definitions are unreachable for readers. That is a publication/content decision rather than a
contract violation, but it belongs on the record.

Both faults are admitted as one row, `GBS-GLOSSARY-DEFINITION-PROVENANCE`, because they share one owner component and one repair
session; the closure boundary separates the two acceptance criteria. Receipts:
`evidence/2026-10-16-glossary-authored-vs-canonical.txt`, `.../2026-10-16-glossary-{conflict-detail,sweep,coverage,authored}.json`.

### 13.4 Two «unfinished work» risks checked and closed (2026-10-16)

- **The legacy copies cannot ship.** The ownership manifest holds 105 routes, **all** of them Astro- or app-owned; `/articles/`
  itself is `astro` with `src/pages/articles/index.astro`. All 12 root legacy entries (11 article copies plus the legacy
  `articles/index.html`) are therefore skipped by the strangler copy step. Dead weight for comparison, not a leak path.
- **The article catalog is complete.** `/articles/` derives its cards from `search-manifest + page-ownership`; measured on the
  built page the three sets agree exactly — 51 links, 51 manifest routes, 51 built folders, with **0** built-but-unlisted
  articles, **0** links without a page and **0** manifest routes without a build.

## 14. Internal links and the census of announced-but-unwritten work (2026-10-16, continuation 6)

### 14.1 Internal link integrity: 14,846 links, 0 dead targets

Every `href` on all 108 built pages was resolved against the filesystem of `dist` (directory targets through `index.html`):
18,755 attributes total, 14,846 site-relative, and **not one target is missing** — navigation, series links, catalog cards,
footnote back-links and generated endnote anchors all resolve. `http(s)`, `mailto:`, `tel:`, `data:` and fragment-only links were
excluded as out of scope.

### 14.2 What the site announces but has not written — the complete list

The task scope asks specifically about «недописанные статьи, незавершённые работы», so the census is stated rather than judged:

| surface | announced | wording on the page | link? |
|---|---|---|---|
| home, «В планах» block | «Гимны и их история», «Тематические исследования» | section header «В планах» | none — text only |
| `/konfessii/` | «Пятидесятничество в России», «Древо протестантских течений» | «СКОРО В РАЗРАБОТКЕ» / «СКОРО» | none |
| `/hard-texts/genesis-6/` | 5 of 11 topic cards («Сыны Божии и дочери человеческие», «Нефилимы и сильные древности», «Что такое Первая книга Еноха», «Книга Стражей», «Книга исполинов») | card state «Планируется»; the other 6 read «Опубликовано · N мин» / «Экскурс · N мин» | none |

**No defect follows**: the absences are labelled as absences, they are text rather than dead links, and §14.1 proves the site has no
dead internal target anywhere. The list is on the record so that a later pass can re-run the same three counts and see movement, and
so that a reader of this report does not have to guess what is missing.

Phrasing that looks like a marker but is not one, verified in context: «черновик» on `/karty/` (the map publication policy), `/about/`
(the author on his process) and the Gill article (a historical fact); «в работе» on `/baptisty-rossii/peterburgskaya-liniya/`
(volunteers); «Планируется» on `/pastor-series/` (a statement that a separate issue is deliberately not planned).

### 14.3 Two apparent stubs, dismissed with reasons

`/izbrannoe/` (253 chars) is a designed empty state with instructions, backed by the favourites store; `/konfessii/russkij-baptizm/_app/`
(39 chars) is a `noindex` app shell; `/karty/*/` pages (≈500 chars) are interactive canvases whose content is drawn by script, so text
length is not a completeness signal there.

Receipts: `evidence/2026-10-16-internal-links-and-unfinished-work.txt`, `.../2026-10-16-internal-links.json`,
`.../2026-10-16-unfinished-sweep.json`.

## 15. Scripture references: 238 interactive controls with one possible answer (2026-10-16, continuation 7)

### 15.1 What a reader gets

The site renders **238 `<button class="bref" data-ref="…">` elements across 10 routes** — compact references such as «2 Тим. 4:1–2»
and «Луки 15», focusable, carrying `aria-expanded`, clearly reading as «open this reference for the text». Measured on all ten
routes, every one of them opens a tooltip whose body is the same sentence:

> **2 ТИМОФЕЮ 4:1–2** ⟶ «Ссылка на указанное место Священного Писания.»

Distribution: hermenevtika **208**, kod-da-vinchi 9, krajne 3, and six more routes with 2–3 each. The fallback is not a corpus
accident: it appears identically for books whose corpus is populated (Иеремия 17:5–10, 1 Коринфянам 10:6, Луки 1:1–4) and for a
book whose corpus file is empty (Иезекииль 36:26 — `data/bible/synodal/iizikil.json`, 0 bytes).

### 15.2 Why the lookup is always empty — and why that part is correct

1. The source index (`data/scripture-search-index.json`, 1 222 references) holds text for **148** of them — and **every one** is
   marked `publicationState: "BLOCKED"` with `rightsState: "RIGHTS_UNKNOWN"`, `sourceUrl: null`, `rights: null`. Verified identical
   in the product's `main` via `gh api`.
2. The public serializer (`scripts/public-scripture-index.js`) emits only `id`, `label` and occurrence coordinates — it strips
   `canonicalText` and `canonicalSource` by design. The built index therefore contains **0 non-empty texts**.
3. The projection (`ScriptureDataProjection.astro`) additionally requires `isBibleRecordPublicationEligible()`, whose gate demands
   `PUBLICATION_APPROVED` + `PUBLICATION_ELIGIBLE` rights + non-empty `translation`/`source`/`sourceUrl`/`rights`. Nothing qualifies,
   so it emits `{}`: the inline projection is present on **73 pages and empty on all 73**.

The rights boundary is **working as designed and is recorded as the cause, not the fault**. No corpus leak exists either —
`dist/data/bible/` is absent from the build.

### 15.3 What is actually wrong

The shipped affordance. Ten routes publish 238 interactive controls that can only answer with a tautology, and nothing in the
interface distinguishes «not cleared for publication yet» from «broken». On the hermenevtika page the verse text is **not**
duplicated in prose — the buttons are the inline references inside parentheses — so 208 of the 238 instances promise content the
site cannot deliver. Secondary, same owner: after opening, the trigger keeps `aria-expanded="true"` but has no `aria-describedby`
and no `role` while the tip is portaled to `document.body`, so the body text is not announced with the control (the same
association gap already admitted for `.gterm`, folded into this row because both come from `article-tooltips.js`).

Admitted as `GBS-SCRIPTURE-AFFORDANCE-PLACEHOLDER-ONLY`. The repair is a decision, not a patch: either stop rendering an
unapproved reference as an interactive control (plain text — truthful for all 238 instances), or keep the control and state the
pending status visibly and accessibly instead of the tautology. The author-side work behind the boundary is the 148 `BLOCKED`
records and the **24 zero-byte corpus files** of 66 books (Judges, Ruth, 1–2 Chronicles, Ezra, Job, Ecclesiastes, Song,
Lamentations, Ezekiel, the twelve minor prophets, Kassian Philippians/1 Thessalonians).

At 390×844 (isMobile, touch) the tip adapts instead of clipping — 390×72, left 0, right 390, `scrollWidth` equal to the viewport on all
three routes checked — so narrow-viewport geometry is a dismissed concern, not a finding; the body text is the same placeholder.

Receipts: `evidence/2026-10-16-scripture-tooltip-placeholder.txt`, `.../2026-10-16-bref-sitewide-sweep.json`,
`.../2026-10-16-bref-tooltip-live.json`, `.../2026-10-16-bref-projection.json`, `.../2026-10-16-bref-mobile-390.json`.

