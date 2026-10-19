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

## 16. What assistive technology receives: heading names, outline order, landmark containment (2026-10-16, continuation 8)

### 16.1 Every section heading's accessible name ends with a control's label

`src/runtime/article-heading-anchors.js:129-150` appends a focusable `<a class="heading-anchor" href="#id" aria-label="Скопировать ссылку на раздел">`
**inside** every `h2[id], h3[id], h4[id]` (`heading.appendChild(anchor)`). Because a heading's accessible name is computed from its
contents, the label becomes part of the heading's name. Two witnesses: Chrome's own AX tree via CDP on `/articles/kod-da-vinchi/` — **16
of 37 headings** named «‹текст раздела› Скопировать ссылку на раздел» — and Playwright's `ariaSnapshot()`, which prints the same names.
Live scan over 23 routes: **16 routes, 224 such controls**, 2–38 per route; each is also a separate tab stop inside a heading.

The control itself **works** (clicking it put `…/kod-da-vinchi/#sec-intro` on the clipboard and showed the toast «Ссылка на раздел
скопирована»), so the defect is the naming, not the feature: a screen-reader user hears the same trailing phrase after every section
title, and the outline becomes harder to scan. Admitted as `GBS-SECTION-HEADING-NAME-POLLUTION`.

### 16.2 Outline order and landmarks

axe `heading-order` (moderate/best-practice) fires on **3 of 23** sampled routes, **8 nodes** — kod-da-vinchi 6 (h2→h4 «Миф романа» /
«Исторический факт»), gill-1 and gill-2 one each (h1→h4 card titles). Sitewide, **5 of 108** pages contain level jumps. Beyond that,
**64 of 108** pages open their outline with an `h2` placed **outside** `<main>` and before the page `h1` — the series rail's
`h2.gbs2-current-title` (63 pages; `_shared/series/SeriesReaderChrome.astro`, `GillSeriesRail.astro:150`) and one `h2.gbs2-rtitle`
(`BaptistyRossiiBody.astro:9`). On `/baptisty-rossii/` that rail heading duplicates the page `h1` word for word.

axe `region` fires on **14 of 23** routes, **22 nodes**: the runtime-injected reader widget `#gb-ember-speed-*`, `#gbFloatingControls`,
`#read-progress`, `.skip-link`, the «Soli Deo Gloria» line, `.sr-only`, and on `/rodosloviye/` five nodes of the genealogy tool
(`.genealogy-toolbar/-navigation/-status`) — an interactive tool outside any landmark.

Admitted as one row, `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT`, because both criteria are the same question — what a
landmark/outline navigator receives — and share the layout/chrome owners.

### 16.3 Checked and dismissed in this continuation

The discovery layer is clean: `sitemap.xml` 95 entries = 95 indexable pages with `lastmod` on all, no sitemap→missing and no
sitemap→noindex, both sitemaps declared in `robots.txt`, `feed.xml` 75 items and `feed-pastor-series.xml` 2 items with **0 dead links**,
canonical and `og:url` consistent. Two of my own first-pass claims were retracted as artefacts of my tooling: a fixed-attribute-order
regex invented «10 pages without canonical/description» (they have both; only the two search-engine verification files and the `_app`
noindex shell legitimately lack them), and crude selectors invented «54 images without dimensions» (all Yandex.Metrica pixels) and
«549 unnamed interactive SVGs» (icons inside labelled hosts — 0 nameless hosts). Duplicate meta descriptions exist only on the eight
`/karty/*` pages, which are `noindex` by design. Sitewide: 0 duplicate ids, 0 dangling ARIA references, 0 `target=_blank` without
`rel`, 0 inline handlers, 0 `tabindex>0`, 0 iframes without `title`, 0 images without `alt`.

Receipts: `evidence/2026-10-16-heading-structure-and-name-pollution.txt`, `.../2026-10-16-heading-outline.json`,
`.../2026-10-16-axe-structure-sweep.json`, `.../2026-10-16-heading-name-pollution.json`.

## 17. Dependency security: a gate that cannot notice the world changing (2026-10-17, continuation 9)

### 17.1 The gate is red on a head that nobody re-runs

`.github/workflows/dependency-security.yml` runs `npm audit --json` and hands the report to `scripts/npm-security-contract.mjs`, whose policy (lines 82-88) blocks on **any** moderate/high/critical count:

```js
const blocking = counts.moderate + counts.high + counts.critical;
if (blocking > 0) { console.error(`NPM SECURITY CONTRACT: FAIL (${blocking} ...)`); process.exit(1); }
```

Replaying exactly that contract on today's unchanged `main`: **`NPM SECURITY CONTRACT: FAIL (7 moderate/high/critical vulnerabilities)`, exit 1**. The count is 7 (5 high / 2 moderate) from both directions — the lockfile alone (`npm audit --package-lock-only`) and an installed tree (`npm audit`) — and **0** with `--omit=dev`.

The red is drift, not a change: the `package-lock.json` blob is **`0ad7fcd7eb641f11b5d728a75dab233caf96459e`** on `f8d70a9a` (the 2026-09-15 green run), on the 2026-10-12 merge `d14da74c` and on `main` today — an identical dependency set. What changed is the advisory feed: `GHSA-w293-vg96-wgc3` (undici, high — TLS certificate validation bypass) and `GHSA-hrr3-gc8f-f4qj` (fast-uri, moderate) were published **2026-09-29**, `GHSA-r4xh-jqrq-34v2` (smol-toml, moderate) on **2026-10-05**.

The workflow cannot see that on its own: its triggers are `paths`-filtered (`package.json`, `package-lock.json`, the contract script, the workflow file) plus `workflow_dispatch` — **no `schedule`**, in a repository where 3 of 77 workflows do carry one. So the last time this gate ran against `main` is 2026-09-15 (success, and the most recent run on `main` at all), and every run since — 2026-09-21, 09-28, 10-05, 10-12 (×2), 10-16 — was a pull-request run that failed on `Enforce dependency security contract`. The practical reading of "main is green on dependency security" is therefore "nobody has asked it recently".

All 7 items are dev-only, and `npm audit fix --dry-run` closes all of them with no semver-major bump ("To address all issues, run: npm audit fix"); the lockfile stays untouched (`git status` empty), so the fix is cheap — the visibility is what is missing.

### 17.2 The updates exist and are stuck

**10 of 14** devDependencies are behind the registry as of today: `@astrojs/mdx` 7.0.8→8.1.0, `@astrojs/react` 6.0.4→7.1.0, `typescript` 6.0.3→7.0.2, `pixelmatch` 7.2.0→8.0.0 (major); `astro` 7.2.9→7.4.0, `react`/`react-dom` 19.2.8→19.3.1, `playwright` 1.62.1→1.64.1, `@astrojs/sitemap` 3.7.3→3.7.4, `@xyflow/react` 12.11.5→12.12.0 (minor/patch). Four are current (`@astrojs/check`, `@astrojs/rss`, `@dagrejs/dagre`, `pngjs`). Production dependencies remain **0**, so none of this reaches `dist/` or the live site.

Dependabot is configured and working — weekly (Monday 04:30 Europe/Paris, open-PR limit 3, prefix `deps`) — and it opened exactly the right things: **#2144** (2026-09-28) bumps `astro` 7.3.8, `react`/`react-dom` 19.3.0, `playwright` 1.64.0, `@astrojs/sitemap` 3.7.4, `@xyflow/react` 12.12.0; **#2179** (2026-10-12) bumps the github-actions group. Both are open, `MERGEABLE`, behind `main`, with every check failing — #2144 has now been sitting red for 19 days.

The failing steps there are build/publication gates (`Build production-like dist`, `Static publication source gates`), not the security step. The log text itself could not be fetched from this sandbox (`results-receiver.actions.githubusercontent.com` is outside the available egress), so the cause of that failure is recorded as **unknown** — this report does not claim that the version bumps break the build.

### 17.3 Checked and deliberately not filed

CI Node `22.23.1` matches `engines: >=22.12.0`; all `actions/*` are pinned by full SHA at current versions (`checkout` v7.0.1, `setup-node` v7.0.0, `upload-artifact` v7.0.1); `npm ci` replays the lockfile in 56 of 77 workflows. The seven advisories are dev-only and the live site has no npm runtime surface.

Receipts: `evidence/2026-10-17-dependency-security-gate-drift.txt`, `.../2026-10-17-dependency-security-drift.json`.
## 18. The home page's offer, the genealogy atlas, and the series' text-glyph icons (2026-10-17, continuation 10)

### 18.1 What the home page offers — and the swapped John Gill part numbers

`/` links to **8 articles** (plus the `/articles/` index) — the same set at 1440×900 and 390×844. The library has **51**, every one with `datePublished`/`dateModified` in JSON-LD. The newest article the page offers was published **2026-07-09** and the newest update among them is 2026-09-06, while **40** articles published after that date and **43** updated after 2026-07-01 appear nowhere on the page — including the newest in the library (published 2026-09-29, updated 2026-10-04) and a 16-article batch from 2026-09-08/09. The shelf announces itself as «Редакторский выбор», so a curated set is expected; what is missing is any signal of what is new, and nothing else on the page surfaces the rest.

Two John Gill slugs carry each other's number:

| slug | h1 / `<title>` | label on `/` | label in the rail |
|---|---|---|---|
| `dzhon-gill-chast-3-nasledie` | «… Часть **IV**: Наследие» | «Серия · Часть IV» | «Читать Часть IV →» |
| `dzhon-gill-chast-4-ekzeget` | «… Часть **III**: Экзегет» | «Серия · Часть III» | links to `chast-3-nasledie` under «V. Историческое влияние» |

The slug semantics (`chast-3 = nasledie`, `chast-4 = ekzeget`) contradict the content (`nasledie` is IV, `ekzeget` is III), and the swap travels into `rel=canonical`, `og:url`, sitemap and feed, so a reader who remembers «Часть IV» opens a page titled «Часть III».

axe adds **5** `label-content-name-mismatch` nodes on `/`: `#heroSearchBar` (already carried) plus four `.h-featured-series` cards (`/biografii/`, `nagornaya/seriya/`, `hard-texts/`, `pastor-series/`) whose `aria-label` replaces their visible text — new owners for the same row.

Not defects, verified rather than assumed: after a full scroll **0 of 17** images fail to load (a first pass read `naturalWidth=0` on two lazy images and was my probe artifact), 13 images carry `alt=""` because they are decorative thumbnails inside already-labelled links, and the only axe `region` node is `.sdg` (carried).

### 18.2 The «SVG scheme» on `/rodosloviye/` is a React Flow graph — and its semantics leak

It is not a static SVG: one `@xyflow/react` instance holds **154** person cards in a 4014×1226 layout rendered into a 1425×595 canvas. The overview shows **5 of 154**, exactly as its own status line says. Mechanically the `.react-flow__node` box measures 6×4 px at viewport scale `0.0358784` while the card inside is counter-scaled to 144×44 px, which is why the five visible cards stay readable; the scale is identical in three cold loads, there is one graph instance, the console is clean, and LCP is 160 ms with CLS 0.

What is wrong is what assistive technology receives. axe reports **`aria-prohibited-attr`, serious, on 149 nodes** — the collapsed cards put `aria-label` on generic-role elements, where the platform may ignore it (`div[data-id="eve"]` and siblings). Chrome's own AX tree carries **all 154 persons** as named controls («Адам: открыть сведения и семью», roles `group`/`generic`, none ignored) while 5 cards are painted and only 5 sit in the tab order. A screen-reader user browsing the page meets 149 people who are not on screen. axe also reports `label-content-name-mismatch` once (`button[title="Тур"]`) and `region` five times on the atlas toolbar (the latter already carried). Controls are otherwise healthy: the minimap is 144×96 on desktop and replaced by a 44×44 «Мини-карта» toggle on mobile, and every tap target is ≥ 44 px.

Self-correction, recorded so it is not re-filed: my first pass read the 6×4 node boxes as «154 nodes, 0 readable — the atlas paints dust» and suspected two graph instances. Both were tooling artifacts — the outer node box is not what gets painted, and the count is one. Judge this atlas by the inner card rect, a screenshot and a hit test.

### 18.3 The series is built from text glyphs, and the theme glyph never changes

On `/baptisty-rossii/` and every part page the controls are **text characters**, not SVG: `<button class="gbs2-ctl" aria-label="Переключить тему">◐</button>`, `⌕` for search, `↗` for share, `A−`/`A+` for size — markup that exists in `BaptistyRossiiBody.astro`, `BaptistyRossiiBookLanding.astro` and `SeriesArticleLayout.astro:112,156`. Everywhere else the same actions are drawn as SVG (the Gill bar carries the canonical sun/moon swap and a gear for settings), so this series is the only surface in the product made of glyphs — and the glyph does not follow the state: four clicks on `◐` toggle the reader light (`rgb(239,231,215)`) ↔ dark (`rgb(14,17,22)`) while the character stays `◐` and no `aria-pressed` is exposed. The reader ships three themes (День / Сепия / Ночь, with pressed states in the Gill sheet); this control offers two, and sepia is unreachable from it.

Same route family, axe on `/baptisty-rossii/`: `color-contrast` ×20, `label-content-name-mismatch` ×3 (all `#articleEndPrintBtn`), `region` ×3 (`.gbs2-mobile-title`).

On `/hard-texts/genesis-6/` at 390×844 the page's own breadcrumb (`nav.genesis6-hub__breadcrumb`, 12,18, 366×25) is laid over the site brand (16,10, 186×25) — **186×17 px of text-on-text**. The brand keeps the click (z-order), so this is visual; no other sampled route renders that crumb.

Related, recorded as a widening of the heading-anchor row rather than a new row: `.gb-anchor-copy-toast` is created **already filled** (`article-heading-anchors.js:24`) and sits in the DOM at `opacity: 0`, so the first copy does not change the live region and the announcement is not guaranteed.

Re-confirmed, not re-filed: at 768 px on `/articles/` the header controls still sit outside the viewport (`#gbSearchBtn` 747,7 `offRight` 23; `#themeToggle` 779,7 `offRight` 55).

### 18.4 Contrast measured on solid colours

`/articles/` reports **330** axe `color-contrast` nodes, and the inspected families are opaque pairs: `#78716c` on `#f7f4ee` = **4.37:1** (`.h-meta-time` 139 nodes at 12 px normal, `.h-meta-author` 4) and `#78716c` on `#f8f5f0` = **4.41:1** (`.h-section-label` 5 at 11.5 px bold). Because these are solid colours the axe figure is trustworthy here — unlike the alpha/image cases re-measured by painted glyphs in continuation 3 — so this is a widening of `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` (148 newly counted nodes) rather than a new class. Same family elsewhere: `/baptisty-rossii/` 20, gill-1 18, `/hard-texts/genesis-6/` 11. LCP on the six sampled routes is 156–392 ms and CLS is 0.

Receipts: `evidence/2026-10-17-home-genealogy-and-mobile-icons.txt`, `.../2026-10-17-home-genealogy-mobile-icons.json`.

## 19. The map surfaces and the 3-D app (2026-10-17, continuation 11)

### 19.1 `/karty/avraam/` deletes its own `<h1>` when the map becomes ready

The route ships exactly one `<h1>` — `h1.sr-only` in `AvraamMap.astro:44` — and `src/pages/karty/avraam/index.astro:18-31` removes it as soon as the stage reports `data-map-state="ready"`, on the assumption that the engine has rendered the document title. It has not: the engine's only heading is the intro's `<h2 class="me-intro__title">` (`karty/_engine/map-engine.js:3752`), and that node leaves the DOM with the intro. Measured after entering the map (Escape): **12 headings, 0 visible, 0 `<h1>`**, and Chrome's AX tree carries **0 level-1 headings**; the whole remaining outline is sr-only (`h2` «Путь Авраама по Бытие 11–25…» at 1×28 px plus 11 `h3`). `/karty/ishod/` keeps its sr-only `h1` (`IshodMap.astro:17`), so the two sibling maps disagree. Before entry the visible title is the intro's `h2` (354×46) — the page never has a level-1 heading at runtime.

This is also why axe does not see it. axe 4.14's `page-has-heading-one` calls `passForModal`, which treats a `position: fixed` element covering ≥75% of the viewport — the 1440×900 map stage — as an open modal dialog. Calibration: on a control page with only an `h2` the rule reports `page-has-heading-one`; on `/karty/avraam/` it passes, and it still passes after removing the `aria-modal` panel, because the stage itself triggers the heuristic (and axe caches `isModalOpen` after the first run). Page-level axe rules are therefore unreliable on these full-screen routes; the finding above comes from the live DOM and the AX tree.

### 19.2 Both route maps are unnamed graphics

`/karty/avraam/` and `/karty/ishod/` paint a 1440×900 inline SVG with `role=null` and no `aria-label`; avraam has no `<title>`, and ishod's `<title>` («Географическая основа карты Исхода») names the basemap rather than the interactive route. These SVGs own **19** and **13** focusable `g[role=button]` and 139/129 text nodes, so assistive technology enters an unnamed graphic that contains dozens of controls labelled «Открыть досье: …». `/map/` is the in-product reference: a 1176×816 SVG with `role="application"`, a full `aria-label` and 56 focusable controls. axe reports **0** on all four routes — this is a semantic gap, not a rule violation. `/karty/` itself is a hub without a map (correct), with 3 keyboard stops.

### 19.3 Head assets are pinned to the production origin

**82 of 108** pages carry absolute `https://gospod-bog.ru/...` URLs for icons, apple-touch icons, the manifest or the feed: icons 40 absolute vs 58 relative, apple-touch 40 vs 57, manifest 38 vs 20, feed 89. In source, **69** component files pin that host against **27** that use relative hrefs (e.g. `DiotrophesPageHead.astro:28-31`, `AboutPageChrome.astro:150`, `AntisovetovPageHead.astro:53`). On production `'self'` covers the host, so nothing breaks live; on any other origin (preview, staging, custom domain) the browser resolves these to production, and when the page CSP omits the host they are blocked. Measured on the local build: **5 `img-src` refusals per page** (`/articles/dzhon-gill-chast-1-chelovek/` — `favicon.ico`, `apple-touch-icon.png`, `favicon-48.png`, `favicon-120.png`, `icons/icon-192.png`); **46 of 108** pages ship an `img-src` without `https://gospod-bog.ru`. The one remaining console event is Metrica's `ERR_CONNECTION_CLOSED` (sandbox egress, not a defect).

### 19.4 The 3-D app has no failure path

In `/konfessii/russkij-baptizm/_app/`, when `THREE.WebGLRenderer` cannot create a context the app throws (`THREE.WebGLRenderer: A WebGL context could not be created` ×2, `Error creating WebGL context`, `PAGEERROR`) and wipes itself: text **36 857 → 0**, DOM **3 074 → 1 node** (31 bytes of HTML), `canvas` 0, **no support message**, body `rgb(8, 8, 8)`. The result is identical at 1440×900 and 390×844. The scene opens only through «Войти в 3D-карту»; the nav's «3D Карта» and the «Начать путешествие» CTA are in-app anchors, which is not a defect.

The outer document has **no `<main>`** (an sr-only `h1` in `Baptizm3DBody.astro:6`, a header and the iframe), while the indexable prose lives in `<noscript>` (1 444 chars, 1 link, no `<main>`). The app is a **2 245 873-byte** inline document; the iframe is ready in **6 818 ms** on localhost. The outer loader is honest and still visible in every sample from 0.5 s to 7.0 s, so the wait is not a blank screen — the weakness is weight and the missing failure path. WebGL absence itself is a sandbox condition (unavailable with `--use-gl=swiftshader`, `--use-angle=swiftshader`, `--ignore-gpu-blocklist` and `--enable-unsafe-swiftshader`), not a site defect; what is filed is what the app does when the context fails.

### 19.5 Negative results, recorded so they are not re-filed

The intro overlay is a correct modal in practice: while it is open the underlay is `inert` (14 nodes), Tab stays on its single button, and Escape, a backdrop click and the button all dismiss it and move focus to «Весь путь», after which Tab walks the map controls normally (Весь путь → Лех-леха → Линия Лота → Война царей → Акеда → поиск → тема → ↗ → +). It has no `role="dialog"`/`aria-modal`, but with an inert underlay and a single control this is cosmetic, not filed.

Also not defects: the map routes lock document scroll (`html`/`body` overflow hidden, `body` fixed, `scrollHeight` 900 = viewport) — by design for a full-screen map; `div.me-panel[aria-modal="true"]` is correctly `aria-hidden="true"` + `inert`, and its four controls are not in the tab order; `img.me-photo-modal__img` with `src=""` is a closed 0×0 modal; and the loading state is visible for the whole wait.

Receipts: `evidence/2026-10-17-map-surfaces-and-3d-fallback.json`.

---

## 20. Series discovery surfaces, sitemap ownership, and the Gill sepia control (2026-10-18, continuation 12)

Environment rebuilt after a sandbox reset with `harness/rebuild-env.sh` (Product clone `d14da74`, Chromium 153, `npm ci`, `strangler:build:production-like` → `dist` 95 MB / 108 HTML, served on `127.0.0.1:8099`).

### 20.1 One series, five surfaces, five different answers — `GBS-PASTOR-SERIES-DISCOVERY-DRIFT`

`/pastor-series/` is published from four independent hand-maintained projections, and they disagree:

| Surface | Value | Last commit |
|---|---|---|
| Hub cards (`PastorSeriesCardsSection.astro`) | **10** | 2026-09-15 `9662af5` |
| `data/series.json` → `pastor-series.parts` | **9** | 2026-09-15 `4c7b07c` |
| JSON-LD `CreativeWorkSeries` `numberOfItems` / `hasPart` | **9** / 9 | 2026-10-11 `b58a814` |
| `feed-pastor-series.xml` `<item>` | **2** | 2026-08-02 `9a84276` |
| `sitemap-pastor-series.xml` `<loc>` | **3** (hub + 2) | 2026-08-02 `cfe4e55` |

The card missing from the data file and from the structured data is `diotrefy-nashego-vremeni` («Досье A»), which is hard-coded at `PastorSeriesCardsSection.astro:42` (`data-wave12-series-card="true"`) while `data/series.json` was never given the part and `PastorSeriesPageHead.astro:89` still declares `numberOfItems: 9`. The series RSS shard and its sitemap shard were frozen on the 2026-08-02 Wave-12 release day and have not moved since, so a subscriber of «Тёмная сторона кафедры» receives 2 of 10 materials. The main `feed.xml` (51 items) and main `sitemap.xml` (95 URLs) do contain all ten, so the drift is confined to the series-specific surfaces.

All six product guards pass on this state: `check-data-consistency.js`, `gill-series-data-consistency-audit.js`, `pastor-series-visual-parity-audit.js` (which explicitly certifies "I–IX + Dossier A"), `pastor-series-guards-dist.js` (G-1…G-8), `rss-feed-normalizer.js --check` (owns `feed.xml` only) and `sitemap-policy-normalizer.js --check` — all exit 0.

### 20.2 The guard exists but is time-frozen — `GBS-WAVE12-CONTRACT-FROZEN-AT-BOUNDARY`

`.github/workflows/diotrophes-wave12-release.yml` does not run the working-tree contract. It extracts the **historical** copy of `scripts/diotrophes-wave12-release-contract.mjs` from `aaf0ba7f` (`DIOTROPHES_WAVE12_HISTORICAL_VALIDATOR`), creates a detached worktree at the release boundary `fbd305a5` (`DIOTROPHES_WAVE12_RELEASE_BOUNDARY`) and runs the historical validator **inside that snapshot**. The assertions that matter for discovery — `series sitemap entry`, `series RSS entry`, `numberOfItems` — therefore only ever see the 2026-08-02 state.

Running the working-tree copy on current `main` exits **1** with two content failures: `series landing Part II missing` (the contract wants «Часть II · 35 мин», the shipped landing says «Досье A · 15 мин») and `series structured data drift` (the contract pins `numberOfItems: 2`, the source declares 9). The workflow itself is green in Product CI (last runs 2026-10-16 on a PR branch: 3 × success). Caveat recorded honestly: the audit clone is `--depth 1`, so history-dependent assertions cannot be evaluated locally; the two failures above read only current files and are therefore independent of clone depth.

### 20.3 Five sitemap entries nobody owns — `GBS-SITEMAP-LASTMOD-UNOWNED`

`node scripts/sitemap-policy-normalizer.js --check` exits 0 and prints its own disclaimers: `/hard-texts/`, `/karty/`, `/karty/avraam/`, `/map/` are `VALID_DATE_MISSING` and `/hard-texts/genesis-6/` is `SEARCH_MANIFEST_ITEM_MISSING`. Eligibility is `POLICY_INCLUDE_AND_PRODUCTION_AND_MANIFEST_AND_VALID_DATE`, so these five routes are outside the normalizer's control — yet all five are present in `dist/sitemap.xml` (95 `<url>` blocks, 0 without `<lastmod>`), i.e. they are maintained by hand.

Consequence, measured against Product history: `/karty/avraam/` carries `<lastmod>2026-07-03T15:22:38+03:00</lastmod>` while `AvraamMap.astro` last changed 2026-09-15 (`ec515b7`) — **74 days stale**; `/karty/` 73 days (`02e182e`); `/hard-texts/` 71 days (`46f9059`); `/map/` 25 days (`e44686f`); `/hard-texts/genesis-6/` 2 days. `sitemap.xml` itself was edited 2026-10-02 (`69d3aa1`), so the file is actively maintained while these entries are refreshed by nobody.

### 20.4 Series RSS coverage (improvement, not a defect)

`data/series.json` holds 7 series / 49 published parts; **all 49 are in the main `feed.xml`**, so no material is undiscoverable. Only **1 of 7** series (`pastor-series`) has a dedicated RSS shard. `nagornaya`, `dzhon-gill`, `hard-texts`, `russian-baptism`, `genesis-6`, `teen-double-life` have none. Filed as an improvement: `GBS-SERIES-RSS-SHARD-COVERAGE`.

### 20.5 The Gill sepia control works; sepia contrast does not (extension)

At 390×844 on `/articles/dzhon-gill-chast-1-chelovek/` the control is `button.reader-setting-btn[data-gill-theme-btn][data-theme="sepia"]` inside the mobile settings sheet. Behaviour is correct: `#mobSettingsBtn` opens `#gillSettingsOverlay` (`aria-hidden` false, `aria-expanded` true), clicking Сепия sets `html[data-reader-theme="sepia"]` (body `rgb(253,252,249)` → `rgb(238,227,200)`), flips `aria-pressed` on both theme buttons, writes `gb:reader-preferences:v1`, and survives a reload; the desktop rail (`#railSettingsBtn`) opens the same sheet; 0 page errors. **Not filed.**

Contrast in that theme is not: axe `color-contrast` reports **18** nodes in `light` and **19** in `sepia` (1 incomplete each) — e.g. `.gill-card__kicker` 3.24:1 in light (`#8d8d8b` on `#fdfcfb`) and 3.00:1 in sepia (`#95856c` on `#f5ead3`), `.gill-card__time` 3.00:1. Recorded as an extension of `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`, not as a new row.

Also checked and not filed: the legacy `localStorage` key `theme` stays `"light"` after switching to sepia, but no shipped file reads it; the legacy on-site search cannot return `/hard-texts/genesis-6/` (query «Бытие 6» → 1 result), which matches `searchManifestPolicy: "exclude"` in `data/route-search-policy.json` and is therefore policy, not drift. No Pagefind bundle exists in this build (`pagefind:build:dist` is not part of `strangler:build:production-like`), so no claim is made about production full-text search.

Receipts: `evidence/2026-10-18-series-feeds-sitemap-sepia.json`.

---

## 21. Series hubs, `isPartOf`, fragment focus, and `/app/` (2026-10-18, continuation 13)

Same environment as §20 (Product `d14da74`, production-like `dist` 95 MB on `127.0.0.1:8099`, Chromium 153).

### 21.1 Seven series, six hubs — `GBS-GILL-SERIES-NO-HUB-NO-ISPARTOF`

`data/series.json` defines seven series. Six own a hub route that is in both `sitemap.xml` and `data/search-manifest.json`; one does not:

| Series | Parts | Hub | sitemap | manifest |
|---|---|---|---|---|
| `nagornaya` | 5 | `/nagornaya/` | ✓ | ✓ |
| **`dzhon-gill`** | **6** | **none** | **—** | **—** |
| `pastor-series` | 9 (+1 dossier) | `/pastor-series/` | ✓ | ✓ |
| `hard-texts` | 6 | `/hard-texts/` | ✓ | ✓ |
| `russian-baptism` | 10 | `/baptisty-rossii/` | ✓ | ✓ |
| `genesis-6` | 6 | `/hard-texts/genesis-6/` | ✓ | ✗ (policy) |
| `teen-double-life` | 7 | `/podrostok-za-kadrom/` | ✓ | ✓ |

The Gill series' entry point is the fragment **`/biografii/#dzhon-gill-series`** — a `<section>` inside the biographies catalogue (22 Gill links on that page). There is no route-policy entry for a Gill hub (the six parts have their own entries), so the series has no canonical URL, no sitemap or manifest surface, and no possible RSS shard.

The same gap shows in structured data. On one published part per series, `Article.isPartOf` is: `pastor-series` → `CreativeWorkSeries «Тёмная сторона кафедры»` (also for the dossier), `nagornaya` → `@id /nagornaya/#collectionpage`, `hard-texts` and `genesis-6` → `CreativeWorkSeries «Бытие 6, Енох, Иуда…»`, `russian-baptism` → `Series «Баптисты России»`, `teen-double-life` → `CreativeWorkSeries «Под…» — and **`dzhon-gill` → `null`**. (`position` is absent on every series, which is consistent rather than drifted.)

In-page navigation is not the problem: `/articles/dzhon-gill-chast-1-chelovek/` carries 78 sibling links — 5 `gbs-rail-card`, 3 `gill-card__cta`, 2 `gbs2-next-card` and 64 TOC items. The gap is discovery and machine-readable series membership, not a dead end for a reader who is already there.

### 21.2 Fragment targets never receive focus — improvement `GBS-FRAGMENT-TARGET-FOCUS`

Landing on `/biografii/#dzhon-gill-series` scrolls the viewport to `scrollY 1061` while `document.activeElement` stays `BODY`, and the first `Tab` moves to the page's first link (the skip link) rather than into the section the user was sent to. No fragment target in the product carries `tabindex="-1"`: 0 of 12 id-bearing elements on `/biografii/`, 0 of 6 on `/articles/`, 0 of 21 on `/`. Keyboard and assistive-tech users therefore restart navigation from the top of a long catalogue every time they follow an in-page link.

### 21.3 `/app/` is clean (checked, not filed)

`/app/` is the promo page for the external Telegram Mini App `@milovanovaibot`. At both 1440×900 and 390×844: axe **0** violations (41 passes), **9** visible interactive elements, **0** tap targets under 44 px, **5** `target="_blank"` links all carrying `rel="noopener noreferrer"`, 0 page errors, 0 console errors. The page advertises chapters 1 Петра 3 and 4 only; the app itself is external and out of sandbox reach, so no claim is made about it.

Also checked and not filed: `/izbrannoe/` is `noindex` by policy (`indexPolicy: noindex`, `contentKind: personal`) and consistently absent from sitemap and manifest; `teen-double-life` parts **do** carry `Article.isPartOf` (an earlier probe hit the hub, which is a `CollectionPage`, and was corrected); `nagornaya` shows 6 cards for 5 parts because the sixth is the sources page `/nagornaya/istochniki/`; `hard-texts`, `genesis-6`, `baptisty-rossii` and `podrostok-za-kadrom` hubs match their `series.json` counts exactly.

Receipts: `evidence/2026-10-18-series-hubs-and-fragment-focus.json`.

---

## 22. Родословие, журнал и перепроверка выводов §21 (2026-10-18, continuation 14)

Продукт: точный `main` **`d14da74cfe9f45e9b03e383e8e622695b01f8e16`**; AuditRepo baseline — чистый `e7ac026`, гейты 4/4 PASS. Проверены актуальные инструкции, сборка после `npm ci`, Chromium 153 и HTTP-сервер. Код продукта не менялся; Product PR #2143 относится к редакционной проверке имён и не затрагивался. Ниже **явно исправлены два вывода §21**; исходные receipts и запись Cont. 13 сохранены как provenance, а не переписаны задним числом.

### 22.1 Направление подписей родства — `GBS-GENEALOGY-RELATION-LABEL-DIRECTION`

На `/rodosloviye/`: ввести имя в «Поиск по имени», нажать найденную карточку, прокрутить панель до «Семья»/«Связи». Проверено обычными кликами для **5 людей × 2 viewport** (1440×900 и 390×844 isMobile/touch, dark, reduced motion):

| Выбранный человек | «Семья» / корректная связь | Что написано рядом с именем другого человека в «Связях» |
|---|---|---|
| Адам | Каин — сын | **Отец / Каин** |
| Каин | Адам — отец | **Ребёнок / Адам**, также **Ребёнок / Ева** |
| Ева | Ева → Каин — мать → ребёнок | **Мать / Каин** |
| Иосиф (Обручник) | Иаков (Мф) — отец; Иосиф → Иисус — юридический родитель → ребёнок | **Ребёнок / Иаков (Мф)**; **Юридический родитель / Иисус Христос** |
| Иисус Христос | Мария — мать | **Ребёнок / Мария**; **Юридический ребёнок / Иосиф (Обручник)** |

Причина одна: `DetailPanel.tsx:22–29` возвращает роль **выбранного** человека, но `:240–252` печатает её рядом с **`peerName`**, без указания субъекта или стрелки. Открыв ту же связь из карточки Адама, читатель получает правильное «Адам → Каин / Отец → ребёнок»: ошибка в кратком представлении, **не в данных**. В адаптированном наборе 181 связь: 146 father + 25 mother + 1 legal-parent + 9 spouse. Направление существенно для **172** связей (344 возможных отображения с двух концов; это подсчёт данных, не 344 браузерных испытания).

Граница исправления: один однозначный форматтер направления — либо роль **соседа**, либо полное «субъект → объект / роль → роль». Не менять правильные отношения в JSON ради подписи. Регрессия должна проверять father/mother/legal-parent/spouse с обоих концов и согласованность с «Семьёй»/инспектором на двух ширинах. `genealogy-publishable-runtime-contract.mjs` — exit 0, 154 человека / 181 связь; этот gate доказывает корректность проекции, а не подписей UI.

### 22.2 `GBS-FRAGMENT-TARGET-FOCUS` — FALSE-POSITIVE, убрать из работы

В §21.2 вывод был сделан по `activeElement=BODY` и тегу первой ссылки `A`, **без проверки её `href`**. Это недостаточное измерение. Новый тест: свежая загрузка `/biografii/#dzhon-gill-series` и отдельно настоящий клик из `/articles/`, затем последовательный Tab на обоих viewport. Первый Tab → **`#biografiiRecentTitle`** (ссылка заголовка **внутри нужной секции**, не skip link), второй → `../articles/dzhon-gill-istoricheskiy-kontekst/`, третий → `../articles/dzhon-gill-chast-1-chelovek/`. `scrollY` остаётся **1061 / 763**, навигация не возвращается наверх. Браузер сохраняет стартовую точку последовательного фокуса даже при `activeElement=BODY`. Сквозная поломка не подтверждена; требование добавлять `tabindex="-1"` снято. Это опровергает исходную находку в проверенном Chromium, но не является проверкой реального screen reader или WebKit.

### 22.3 Гилл — PARTIAL/NARROWED вместо требования нового хаба

Перепроверены **все 6**, а не одна статья. У `dzhon-gill-istoricheskiy-kontekst` **есть** `Article.isPartOf` → `CreativeWorkSeries «Джон Гилл (1697-1771)»`, URL `https://gospod-bog.ru/biografii/`. У остальных **5** (части 1–4 и справочник) поле отсутствует. В поисковом манифесте **есть отдельная запись серии** `id: dzhon-gill-seriya`, `type: series`, URL **`/biografii/#dzhon-gill-series`**. Поэтому прежние «каждая часть без isPartOf», «нет поверхности в манифесте» и «RSS-шард невозможен без маршрута-хаба» неверны. Строка `GBS-GILL-SERIES-NO-HUB-NO-ISPARTOF` сужена до **неодинаковой JSON-LD проекции членства в одной серии**. Отдельный маршрут, миграция URL и редиректы для закрытия этой строки не обязательны.

### 22.4 Контраст и контрольные проверки трёх страниц

**12 загрузок**: три маршрута × два viewport × light/dark; desktop `isMobile:false`, mobile `isMobile:true`, touch, dsf 2; reduced motion. Скриншоты сохранены вне Git, просмотрены состояния панели и тёмного журнала.

| Страница | Узлов axe `color-contrast`: light / dark (на каждой ширине) | Другие результаты |
|---|---|---|
| `/journal/` | **0 / 10** | В mobile обеих тем также `landmark-no-duplicate-banner` ×1 (best practice, зафиксировано без новой самостоятельной WCAG-строки) |
| `/biografii/` | **32 / 0** | Все **11** изображений загружены после прокрутки; четыре первоначально не загруженных — lazy, не битые |
| `/rodosloviye/` | **0 / 0** | Уже учтённые `aria-prohibited-attr` ×149, label-in-name ×1, `region` ×5; не дублируются |

Журнал расширяет **существующую** строку `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`: `.journal-kicker`, `.eyebrow` ×3, `.lead-label`, `.read-link`, `.direction-index` ×4. Захардкоженный `#7a2e2e` (`JournalLanding.astro:121,133,136,143`) в dark даёт axe **2.03:1** на `#0e1116` и **2.00:1** на `#131217`, ниже 4.5:1. Исправлять следует тематический цвет этого семейства, а не отдельные надписи и не результат теста.

Во всех 12 загрузках: `document.fonts.status=loaded`, page errors **0**, горизонтальный overflow **0**, битых изображений после прокрутки **0**. LCP **96–268 мс**, CLS **0–0.016604** — локальная лаборатория, не производительность прода. На биографиях единственная console/network ошибка каждого профиля — заблокированная песочницей Метрика `mc.yandex.ru`; это не дефект сайта. Без JS родословие сохраняет статический раздел, методологию и предусмотренный текущим browser contract fallback со ссылкой «Как читать связи»; отсутствие интерактива в этом режиме не оформлено как новая поломка.

### 22.5 Что не стало обязательной работой

HTML родословия — **307 782 UTF-8 байта**, из них props — **280 299** (91.1%). Это не 296 177 «байт»: последнее — число UTF-16 символов. Те же данные обычным JSON — 152 275 байт; после gzip уровня 6 в Python zlib props / plain JSON — **21 369 / 18 396 байт**, разница **2 973 байта**. Это сравнение представления данных, не доказательство выигрыша страницы; нарушение бюджета не установлено. Обязательный lazy-fetch/переписывание движка не назначены; старый design-before-code документ не переопределяет текущий runtime owner (`AGENTS-REFERENCE.md` §8).

В `dist/data/genealogy/` лежат **21 файл / 3 136 825 байт**; raw `v2/persons.json` доступен по HTTP. Но установленный запрет — подключать raw/full v2 в **runtime**, а не хранить публичный JSON. `genealogy-v2-publication-audit.mjs` → exit 0, **`draft-blocked`**, `runtimeGuard.ok=true`, RU review queue 2825. Нарушение приватности/прав или использование raw в интерфейсе не доказаны. Поиск ссылок по имени файла также не доказывает «мёртвый груз»: например, `note-registry.json` прямо требуется `print-pagination-contract.mjs:97`. Поэтому предварительный подсчёт «528 неиспользуемых файлов» не превращён в finding и не является основанием для удаления.

Receipts: `evidence/2026-10-18-genealogy-relations-recheck.json` (**40 записей**, round-trip проверен); воспроизводимый браузерный сбор — `harness/genealogy-relations-and-fragments.mjs` (копировать и запускать по README; `CAPTURE_DONE` не означает product PASS). Итог относительно baseline: **+1 дефект, −1 ложное улучшение**, сужение строки Гилла, расширение существующего контраста; **50+3+2=55 → 51+2+2=55**. Прод, WebKit, реальные AT и полная release-suite в этом ходе не проверялись.

---

## 23. Повторное открытие карточек, источники G3 и scroll owner (2026-10-18, continuation 15)

AuditRepo baseline — чистый **`94b3167`**, гейты **4/4 PASS** до изменений. Среда восстановлена после сброса; snapshot перед восстановлением побайтово совпал с remote. Product `main` повторно проверен через GitHub: **`d14da74cfe9f45e9b03e383e8e622695b01f8e16`**. После `npm ci` собран production-like `dist`, Chromium 153.0.8010.0 / Playwright 1.64.1 / axe 4.14.0, HTTP :8099. Проверены инструкции и текущие владельцы: Product #2143 — редакционная проверка имён; ни код продукта, ни чужая ветка не менялись. Область — поведение `/rodosloviye/` и читательские поверхности `/journal/dossiers/g3/`, а не повторное расследование утверждений G3.

### 23.1 Подсветка человека ошибочно заменяет состояние панели — `GBS-GENEALOGY-POINTER-PANEL-STATE-DESYNC`

Ввести «Адам», нажать карточку, закрыть панель, нажать того же человека снова. **Первое повторное нажатие не открывает сведения, второе открывает.** Подтверждено для Адама (закрытие кнопкой) и Ноя (закрытие Escape) на desktop 1440×900 и mobile 390×844 isMobile/touch, в light/dark: **8 сценариев**. В mobile использованы настоящие `tap`, не подмена кликами мыши.

| Состояние | `activeId` | Панель |
|---|---|---|
| Сведения открыты | тот же человек | открыта |
| Закрыта кнопкой / Escape | **сохраняется** | закрыта |
| Первое повторное click/tap | сброшен в null | **остаётся закрытой** |
| Следующее нажатие | человек | открыта |

Та же причина проявляется при входе из обзора: первое нажатие приближает Адама, второе лишь снимает подсветку, **только третье** открывает сведения (4 профиля). В контроле `Enter → Escape → Enter` панель, напротив, открывается повторно сразу, а фокус после Escape возвращается на тот же узел (4/4).

`GenealogyTree.tsx:304–323` устанавливает `activeId` при приближении и считает `activeId === node.id` запросом закрытия, не проверяя, открыта ли вообще панель. Оба обработчика закрытия (`:351–355`, `:643–645`) сбрасывают `selected`, но оставляют `activeId`. Требуется развести состояние подсветки/ветви и открытых сведений в общем обработчике активации. Дополнительные программные клики, таймеры «попробовать ещё раз» или изменение данных не устраняют причину.

### 23.2 Исследовательский handoff вместо библиографии — `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING`

В опубликованном G3 **33** элемента `.claim-ref` (`span`/`p`), **6** карточек классов источников, **0** ссылок в этих карточках. Обе внешние ссылки основного текста ведут в один `Research/.../PRODUCT_HANDOFF_G3_DOSSIER_2026-09-09.md`; пути от читательского ID к конкретному документу/библиографической записи на странице нет. Читателю приходится вручную разыскивать реестр в другом репозитории.

Проверка внешней границы не дала ложного «404/private»: Research **публичен**, pinned handoff существует на seal **`298d00ddc4db46522c8ad904016e98a4426c9fcf`** (GitHub API, 15 621 байт, SHA-256 в receipt). Но в самом handoff **0 HTTP URL** — это разрешение на ограниченные проекции утверждений, не готовая читательская библиография. В `SOURCE_LEDGER.md` на том же seal существуют имена, даты, точные идентификаторы объектов/локаторы и статусы источников; например, семейства корпоративных записей и IRS filings. Это проверка доступности metadata, **не независимая проверка финансовых или обвинительных выводов**.

Источник проблемы: `G3Dossier.astro:27,297–307,328–331` проецирует служебные IDs и ссылку authority, но не нормальную библиографическую атрибуцию, требуемую `EDITORIAL-SOURCE-POLICY.md:171–174` и `CONTENT-QUALITY-STANDARD.md:47`. Граница исправления — читательская проекция **использованных, разрешённых** источников: название/дата/локатор, кликабельный публичный адрес где допустимо, явная граница доступа для ограниченных материалов. Handoff можно сохранить как дополнительную provenance. Нельзя ради этого зеркалировать private-study media, снимать HOLD или усиливать утверждения статьи. «Неизвестное» в досье — разрешённые ограничения результата, не недописанные фактические выводы.

### 23.3 Sticky-навигация привязана не к прокручиваемому элементу — `GBS-JOURNAL-STICKY-NAV-SCROLL-OWNER`

После реального перехода к `#finance` меню G3, объявленное `position:sticky; top:0` (`G3Dossier.astro:355`), уезжает за экран вместо закрепления:

| Viewport | Реальная прокрутка `html` | Верх меню до пробы | В одноразовой пробе | После отката |
|---|---|---|---|---|
| 1440×900 | 3535 px | **−2618.56 px** | 0 | −2618.56 px |
| 390×844 | 4755 px | **−3504.91 px** | 0 | −3504.91 px |

Одинаково в light/dark. CSSOM указывает на глобальный `body{overflow-x:hidden}` из `css/site.css:10` (reset layer, revision `06849619`). Он вычисляет `overflow-y:auto` для body, делая body ближайшим scroll container для sticky; при этом `body.scrollTop=0`, а реально прокручивается **HTML**. Для причинной A/B-пробы только в одноразовом browser context body временно получил `overflow-x:clip; overflow-y:visible`: меню вернулось к y=0 **без изменения scrollY**, откат вернул прежнюю отрицательную координату.

Это **не готовый CSS-fix**: общая таблица стилей не менялась; влияние на остальные страницы и отступ от мобильной шапки не сертифицированы. Нужен согласованный владелец прокрутки и sticky inset, а не локальный `z-index`, `!important` или JS-перенос меню по scroll. Сами якоря исправны: переходы finance/timeline проходят в 4/4 профилях, все 9 целей меню существуют. Первоначальная гипотеза «ссылка не нажимается из-за шапки» не подтверждена: в исходном состоянии меню вообще находится за пределами viewport.

### 23.4 Уже существующие строки, без новых дублей

На G3 axe `color-contrast` даёт **58 узлов dark / 1 light** на каждой ширине. Тёмные пары: `#7a2e2e/#0e1116` **2.03:1** (27), `#8a6b59/#0e1116` **3.89:1** (26), `#8a6b59/#141317` **3.81:1** (1), а также состояния 2.65/2.85/3.23:1 (4). Light — `#8a6b59/#f5f0ed` **4.29:1** (1). Это расширение `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`, не новая строка.

В light ссылка `.authority-note > a` различима от соседнего текста только цветом: axe `link-in-text-block` ×1, **1.71:1** к соседнему тексту, без подчёркивания/другого нецветового оформления. Расширена существующая `GBS-NAGORNAYA-SOURCE-LINKS-COLOR-ONLY` (ID сохранён), а не заведён повтор того же критерия на другом маршруте. Mobile `landmark-no-duplicate-banner` ×1 и уже учтённые 149 generic-role узлов родословия записаны, но не выданы за новые самостоятельные дефекты.

### 23.5 Контроль, ограничения и итог

Полный сбор — **8 профилей** (2 маршрута × 2 ширины × 2 темы), reduced motion; **0 page/console errors, 0 failed requests, 0 горизонтального overflow**, fonts loaded 8/8. Изображений на этих двух страницах нет. Локальный LCP **100–148 мс**, CLS **0–0.000582**; это не продовые показатели. Кроме исправного keyboard reopen: поиск Исаака снимает исключающий фильтр 4/4; неоднозначный «Иосиф (Лк)» предлагает 2 кандидата, ArrowDown/Enter выбирает конкретного и закрывает список 4/4. Просмотрены скриншоты панелей, источников и диагностической CSS-пробы; PNG остаются вне Git.

Для **изолированных** mobile tap использован интервал 650 мс: первоначальная быстрая серия дала pointerup без click и остановилась незавершённой, она **не зачтена как PASS**. При разнесённых жестах дефект панели сохраняется; пауза не предлагается как ремонт продукта. Семантика быстрых multi-tap остаётся вне проверенного scope. Воспроизводимый `harness/genealogy-reopen-and-journal.mjs` закончил `CAPTURE_DONE` (**52 записи**, не product PASS); receipt `evidence/2026-10-18-genealogy-reopen-journal-sources-sticky.json` содержит исходные browser records без потерь и bounded source/Research witnesses. Прод, WebKit/реальные AT, общесайтовая регрессия CSS и полный release-contract не проверялись.

Матрица: **+3 дефекта, 2 расширения существующих строк; 55 → 58 = 54 дефекта + 2 улучшения + 2 lanes**. Продуктовые исправления не выполнены и за выполненные не выдаются.

---

## 24. Сохранение состояния: quota, доступность избранного и история поиска (2026-10-18, continuation 16)

Baseline AuditRepo — чистый **`47e12b1`**, гейты **4/4 PASS** до правок. После сброса snapshot точно совпал с remote; ветка восстановлена без потери данных. Product `main` повторно проверен: **`d14da74cfe9f45e9b03e383e8e622695b01f8e16`**. Проверены текущие инструкции/CI/владельцы; пересекающейся Product repair-ветки для этого scope не найдено. `npm ci`, production-like build, Chromium 153 / Playwright 1.64.1 / axe 4.14.0; затем отдельно штатный `npm run pagefind:build:dist`. Код продукта не менялся.

### 24.1 Неуспешная запись считается успешной, миграция удаляет старое — `GBS-FAVORITES-WRITE-FAILURE-IGNORED`

В **одноразовых** browser contexts реально заполнена квота `localStorage`: двоичным поиском подобрана максимальная строка, отдельная пробная запись возвращает настоящий **`QuotaExceededError`**. `Storage` API не подменялся. Размер наполнителя **5 242 577–5 242 626 символов** — это не заявление о байтах на диске. Проверено в 4 профилях: 1440×900 desktop / 390×844 isMobile+touch, dark/light, reduced motion.

| Сценарий | Наблюдение в каждом из 4 профилей |
|---|---|
| Нажать обычное «Добавить в Избранное» при полной квоте | Toast **«Добавлено в Избранное»**, но `aria-pressed=false`, canonical list **0**, после освобождения места и открытия `/izbrannoe/` по-прежнему **0** |
| Миграция корректного legacy `fc:saved:<path>=1` при полной квоте | Новая запись **не создана**, старый флаг **удалён**; после освобождения места данные не восстанавливаются |
| Контроль той же миграции со свободным местом | Canonical item создан и сохранён, только после этого старый флаг отсутствует — **4/4** |

Причина: `favorite-store.js:178–187` возвращает `false` из `persist`, но `:254–261` игнорирует результат и отвечает `saved:true`; `floating-cluster-controller.js:181–190` показывает успех. `favorite-store.js:291–299` после такого `add` безусловно удаляет legacy flag. Это потеря состояния в **контролируемом пограничном сценарии**, не свидетельство потерь у продовых пользователей.

Нужен один транзакционный контракт текущего `GBFavoriteStore`: отличать успешную запись, отказ и состояние saved; не публиковать успех при отказе, сохранять старые данные до подтверждённого commit. Простая замена `saved:true` на false недостаточна: нынешний caller тогда ошибочно скажет «Убрано». Не требуются второй store, автоматическая очистка чужих ключей или молчаливый переход на недолговечную сессию. Source gate **65/65 PASS**, включая `FAV-MIG-07` «removed after successful migration», но его `:63` проверяет лишь regex `localStorage.removeItem(key)` — не условие успешной записи. Это свидетельство недостающей проверки error-ветви внутри той же работы, не новая отдельная CI-строка.

### 24.2 У ссылки-обложки нет имени — `GBS-FAVORITES-COVER-LINK-UNNAMED`

Два материала сохранены **реальными UI-кнопками**, не подстановкой fake favorite records. На `/izbrannoe/` в каждом из 4 профилей axe **`link-name` ×2**. Chrome native AX (CDP) для обеих `.izbrannoe-card__link`: **role=link, name="", ignored=false**. Именованные title/open-ссылки рядом не дают имя отдельной ссылке-обложке. В Home те же две записи имеют непустые native AX names — проблема в шаблоне `/izbrannoe/`, не в metadata store.

`izbrannoe/index.astro:110–128` создаёт `<a>` только с CSS-background `<div>`, без текста/`aria-label`/`aria-labelledby`. Следует связать имя с названием материала либо согласовать обложку с именованной ссылкой, сохранив кнопку удаления отдельной интерактивностью. Не заведен ложный «на проде нет обложек»: локальный origin закономерно отбрасывает абсолютный production URL по same-origin image policy; анонимность ссылки от изображения не зависит. Robots/noindex для личной подборки остаётся намеренной политикой.

### 24.3 Изолировать необязательную историю от перехода — улучшение `GBS-SEARCH-HISTORY-SHAPE-ISOLATION`

Предусловие явно задано тестом: `gb-cp-history` содержит JSON **`{}`** либо **`null`**. Текущий UI пишет массивы, поэтому это **не дефект обычного корректного состояния**, а подтверждённая необходимая защита от некорректного persisted state. Результаты отображаются, но выбор даёт `t.filter is not a function` / `Cannot read properties of null (reading 'filter')`, и пользователь остаётся на `/` вместо выбранной статьи.

Сначала проверен fallback без Pagefind: **8/8** таких fault-сценариев блокируют переход, **16/16** контролей (нет ключа, массив, битый JSON-синтаксис, отказ записи истории при реальной квоте) переходят правильно. Затем каноническим builder собран **Pagefind 1.5.2: 95 страниц / 27 835 слов**. С настоящим модулем и `wasm.ru.pagefind` **HTTP 200**: ещё **8/8** object/null-сценариев блокируют переход, **4/4** array-контроля проходят. Pagefind нашёл 3 результата на «Многотомный», целевое имя взято из реального индекса; fallback нашёл 7 на «Гилл». Это парная проверка одного перехода, не полный аудит качества поиска. Bundle после испытаний восстановлен; смешение indexed/non-indexed режимов baseline harness отклоняет явно.

В `js/search.js:1` `z()` ловит ошибки JSON.parse, но не валидирует тип; `U()` вызывает `.filter` **до** своего write try/catch; `Le()` вызывает `U` **перед** `location.href`. Требуется узкая граница «массив строк» и best-effort history, которая не может блокировать навигацию. Не надо очищать всё localStorage или перехватывать click дополнительным обработчиком. Из-за искусственно заданного malformed state находка внесена в **улучшения устойчивости**, а не объявлена массовой поломкой продового поиска.

### 24.4 Что действительно работает и чего не утверждается

В 4/4 профилях: две UI-записи дают counts **1→2**, сохраняются после reload и синхронизируются с Home другой вкладки; удалить одну → **1**, отменить «Очистить всё» → **1**, подтвердить → **0**. Все 6 настроек чтения через **публичный API** переживают reload и Gill→герменевтика; обновление масштаба из другой вкладки приходит как 1.2. Это не GUI-проверка всех переключателей. Неверный JSON-синтаксис в favorites/preferences корректно восстанавливается, последующее сохранение работает 4/4; `reader-preferences-regression-test.js` также exit 0. Значит, вывод «все storage-потребители сломаны» не делается.

Собраны **80 browser observations** в 52 изолированных contexts; **8 UI health-профилей**, снимки после `document.fonts.ready`. LCP **180–476 мс**, CLS **≤0.049310**, только локальная лаборатория. Положительного горизонтального overflow нет (desktop −15 px означает запас, не переполнение). В `/izbrannoe/` `<img>` нет; в палитре проверены завершившие загрузку видимые изображения, битых среди них **0** — это не полный media-crawl статей. Скриншоты просмотрены и остаются вне Git. Прочие counts axe (цвет/label-in-name) сохранены как наблюдения, без новых дублей и без объявления интерфейсов «чистыми».

Console errors **не обнулены**: счётчики разложены на CSP production-origin иконок (уже `GBS-HEAD-ASSETS-PINNED-TO-PRODUCTION`), sandbox egress Метрики и ожидаемый 404 Pagefind в baseline до сборки; неизвестных сообщений **0**. Во второй фазе module/WASM работают, поэтому ошибку истории нельзя списать на отсутствие индекса. Uncaught TypeError есть именно в 16 malformed-history случаях; нормальные поисковые контроли и quota-сценарии избранного не дают uncaught page errors.

Receipts: `evidence/2026-10-18-browser-state-boundaries.json`; сборы `harness/browser-state-boundaries.mjs` и `harness/pagefind-history-boundary.mjs`. Прод, WebKit/реальный screen reader, все режимы запрета Storage (например SecurityError), все GUI настроек, полный release-contract и общая полнота/relevance Pagefind **не проверялись**. Итог: **+2 дефекта +1 необходимое улучшение; 58 → 61 = 56 + 3 + 2**. Продуктовые исправления не выполнялись.
