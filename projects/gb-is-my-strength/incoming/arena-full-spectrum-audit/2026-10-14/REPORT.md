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

### F1 — `GBS-FOOTNOTE-MARKER-NESTED-INTERACTIVE` (new, systemic candidate)

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
| `GBS-FOOTNOTE-MARKER-NESTED-INTERACTIVE` | systemic candidate | admit to SYSTEM lanes after the owner confirms the shared `.fn-marker` tooltip runtime as the single owner; extend the existing `note-registry-browser-contract.mjs` assertion from one fixture route to the note-bearing route set as the class-level guard |
| `GBS-CHROME-LABEL-IN-NAME-MISMATCH` | defect cluster | admit as one row; repair per-owner (`mobPartTocBtn` / `barSectionBtn` / header controls / `gbs2-ctl` / map-trigger), not per-route |
| `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` | P3 batch | admit only with the `.heart-flip-*` half removed (UNPROVEN) |
| glossary index route | owner decision | ask the owner whether the 130-term dictionary should have a browsable surface |

## 6. Summary for verifier

- Strongest new material: F1 (systemic note-marker interactivity + the harness gap that hides it) and the current-anchor **closures** in §2.1, which let MASTER shrink.
- Weakest material: §3 F3 `.heart-flip-*` contrast (visibility unproven) and the header-geometry half of F6.
- Nothing in this pass authorises a Product mutation by itself: every row still needs the normal lane record before repair.
