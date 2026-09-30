# Step-count correction, anchor-currency sweep and the editorial dateline projection (2026-09-30)

Authoritative reverify. It corrects one wrong number that had already entered merged AuditRepo
documents, records a full source-anchor currency sweep of the active MASTER, and disposes a
site-wide dateline candidate that this pass investigated and **rejected** — while admitting the one
narrow residual that survived that rejection.

- AuditRepo base: `054c9c1b1a74f20ead716b835a2f618270dfb78b` (branch `arena/01a0f435-auditrepo`)
- Product main anchor: `d586aa63f02b569cfe050a63cc9078c044375d8d`; `package.json` blob `812497795d8a3c5c7a2beb6224b2f9492354dfdf`
- Live release: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (run `35927303479`)
- Evidence tier: source + exact-SHA local production-like builds (both SHAs, `BUILD_EXIT=0`) + GitHub
  API + live HTTP retrieval for ordinary text only. **No browser** ran in this session (see §5).
- Receipts: [`evidence/2026-09-30-release-block-repro-receipt.txt`](./evidence/2026-09-30-release-block-repro-receipt.txt),
  [`evidence/2026-09-30-validate-static-publication-command-list.txt`](./evidence/2026-09-30-validate-static-publication-command-list.txt),
  [`evidence/2026-09-30-master-source-anchor-currency.txt`](./evidence/2026-09-30-master-source-anchor-currency.txt) (+`.json`),
  [`evidence/2026-09-30-dateline-projection-scan-main.json`](./evidence/2026-09-30-dateline-projection-scan-main.json),
  [`evidence/2026-09-30-time-label-scan-main.json`](./evidence/2026-09-30-time-label-scan-main.json),
  [`evidence/2026-09-30-time-label-scan-live-sha.json`](./evidence/2026-09-30-time-label-scan-live-sha.json),
  [`evidence/2026-09-30-baptist-dates-main-vs-live-sha.txt`](./evidence/2026-09-30-baptist-dates-main-vs-live-sha.txt),
  [`evidence/2026-09-30-live-fetch-time-element-boundary.txt`](./evidence/2026-09-30-live-fetch-time-element-boundary.txt),
  [`evidence/2026-09-30-pr-gates-by-head.txt`](./evidence/2026-09-30-pr-gates-by-head.txt),
  [`evidence/2026-09-30-branch-census.txt`](./evidence/2026-09-30-branch-census.txt),
  [`evidence/2026-09-30-program-currency-remeasure.txt`](./evidence/2026-09-30-program-currency-remeasure.txt),
  [`evidence/2026-09-30-artifact-witness-main.txt`](./evidence/2026-09-30-artifact-witness-main.txt),
  [`evidence/2026-09-30-artifact-witness-live-sha.txt`](./evidence/2026-09-30-artifact-witness-live-sha.txt),
  [`evidence/2026-09-30-quiz-route-census.txt`](./evidence/2026-09-30-quiz-route-census.txt)

## 1. Withdrawn figure: the release-gate step count

The earlier 2026-09-30 release-gate documents reported a step count for
`npm run validate:static-publication` that does not match the script at this head. That figure is
**withdrawn and not repeated here**; every site that carried it is corrected in this pass (see the
list at the end of this section). The blocked command is **#24 of 41**.

Recomputation from the exact head (rule: split the script string on `&&` and count top-level
commands; nested `npm run` scripts are not expanded):

| fact | value |
| --- | --- |
| top-level commands in `validate:static-publication` | **41** |
| exit 0 when run one by one | **40** |
| failing | **1** — #24 `node scripts/audit-pro.js` |
| failure output | exactly one error line: `sitemap contract: missing canonical indexable production route: /articles/steven-lawson-samoobman-i-publichnyy-golos/` |
| CI equivalence | `deploy.yml:148` runs the same script as one `&&` chain, so #24 stops the chain and #25–41 never run in CI |

The same 41 commands were re-run individually in this session so that the steps after the blocked
one are also witnessed (all exit 0). Both receipts were previously lost with `/tmp` and are now
preserved in this repository.

Corrected in: [`verified/MASTER_BUG_MATRIX.md`](../verified/MASTER_BUG_MATRIX.md) (2 places),
[`PROGRAM_CLOSURE_MATRIX.md`](../PROGRAM_CLOSURE_MATRIX.md),
[`../incoming/arena-incompleteness-auditor/2026-09-30/RELEASE_GATE_AND_BAPTIST_TRACE.md`](../incoming/arena-incompleteness-auditor/2026-09-30/RELEASE_GATE_AND_BAPTIST_TRACE.md)
(annotated, original wording kept), and superseded for
[`2026-09-30-release-block-and-baptist-provenance.md`](./2026-09-30-release-block-and-baptist-provenance.md).

The release-block disposition itself does not change: the blocker is the Lawson article route being
absent from the published sitemap while the page builds and is canonical. Per the owner's
instruction of 2026-09-30 the Lawson release decision is **not** worked in this pass — another
owner-directed effort is already on it; this pass only keeps the measurement true and preserves the
receipt.

## 2. Source-anchor currency sweep — all 28 active MASTER units walked

Coverage: the 25 current defects and the 2 system lanes are source-anchored (**27 units**, checked
by **45 anchor assertions** against a worktree at Product main `d586aa63`); the 28th unit,
`GBS-OPEN-CONTENT-PR-DISPOSITION`, has no source anchor and was re-measured from the lifecycle
rollups in §6 instead. Result: **43 of 45 assertions confirmed verbatim**; two are quoted with a
selector/expression that no longer matches the source, although the defect behaviour itself is
unchanged. **No unit was closed, deleted or found already fixed**, and no unit needed archiving.

| row | anchor as documented | current source | verdict |
| --- | --- | --- | --- |
| `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` | `:focus-visible { outline: 2px solid #10b981 }` | the focusable target is `body.home-page .mobile-controls > button`; `css/mobile-hotfix.css:12` sets `outline:0 !important` and is loaded from `src/components/home/HomePageHead.astro:158` | defect CONFIRMED, anchor expression superseded |
| `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` | `window.scrollY > 500` | `(window.scrollY \|\| window.pageYOffset) > 500` | defect CONFIRMED, anchor expression superseded |
| `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP` | (a legacy citation of `css/header-mobile.css:284` / `.hCpBtnIcon` — **neither exists at this head**; that file and class are absent from the repository) | `css/mobile-hotfix.css:12` `.mobile-controls .gb-nav-search-icon{margin-right:-12px!important}`; same sheet `.mobile-controls{gap:0!important}` and the 44×44 rule covering `.gb-nav-search-icon` + `.mobile-controls .theme-toggle`; the search button is `#hCpBtnNav.gb-nav-search-icon` (`src/components/ui/Header.astro:31`) | defect CONFIRMED, anchors re-identified (§5b derives the 12px overlap statically) |
| `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED` | `#hCpBtnNav` has no handler | `src/components/ui/Header.astro:31` renders `#hCpBtnNav` with no listener anywhere in the eagerly loaded path; the only binding is `js/search.js` `Se()`, which renames the node to `gbSearchBtn` and attaches the handlers — and `search.js` is loaded only on demand by the inline bootstrap in `src/layouts/BaseLayout.astro` (`__gbSearchSrc`) | CONFIRMED |
| `GBS-NAGORNAYA-READER-FONT-SCALE-INCOMPLETE` | `.article-body p{font-size:var(--font-size)}` | present; `data-font-scale` is set on `documentElement` | CONFIRMED |
| `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` | `-webkit-text-fill-color:transparent` + `background-clip:text` | **`-webkit-text-fill-color:transparent` occurs 0 times in `css/*.css` at this head** — the sweep's assertion was too loose. Real mechanism: the built button is `<button id="menuBtn" aria-label="Открыть меню" …>` containing three `<div class="bar h-0.5 bg-white">` bars painted only by a utility background class, no SVG/text/border; the single `@media (forced-colors:active)` block in `css/site.css` covers `.fn-marker`, `.theme-toggle svg`, `.quiz-option.*`, `.btoc-link.active`, `.article-reading-progress-fill` and **not** `#menuBtn`/`.bar` | defect CONFIRMED, mechanism corrected |
| `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED` | `--herm-badge-pad-y:0.3rem` etc. (no such token exists at this head; the sweep's `speed[^{]*badge` pattern matched a **CSS comment** in `css/floating-cluster.css:3869`) | real anchors: `src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro:236` `.hm-spdbadge{min-width:18px;height:13px;padding:0 3px}` and `:240` `.hm-spdbadge::before{inset:-4px -3px}` on button `#hmSpdBadge`; compliant in-repo control `css/floating-cluster.css` `[data-gill-v16] .mobile-spdbadge{min-width:24px;height:24px}` | defect CONFIRMED, anchors re-identified + repair precedent found |
| `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS` | `404.html` uses `css/reader-preferences.css`, `js/reader-preferences-head.js` | present | CONFIRMED |
| `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` | `????` runs in Baptist bodies | present in source and in both built artifacts (§4, §5) | CONFIRMED |
| remaining 17 anchors | — | present verbatim at the cited files/lines | CONFIRMED |

Machine receipt: `evidence/2026-09-30-master-source-anchor-currency.{txt,json}`, whose coverage
summary records the same three refinements. Honest note on method: the sweep used one regex per
documented anchor, and three of its CONFIRMED verdicts were loose — a legacy citation that no longer
exists (`header-mobile.css`/`.hCpBtnIcon`), a pattern that matched a CSS comment
(`speed[^{]*badge`), and an alternation that confirmed only one of two claimed declarations
(`-webkit-text-fill-color:transparent`). All three were re-derived by hand above; in each case the
**defect itself is confirmed**, only the quoted anchor changed. No current defect was closed by this
sweep, and no defect was found to be already fixed.

## 3. Rejected candidate: "17 routes publish a label that contradicts their `datetime`"

A site-wide scan of the built artifact found 61 `<time datetime>` elements whose human label and
machine value name different days on 17 routes. Before filing it, the class was traced to its
owner. It is **approved design**, not a defect:

- `data/editorial-metadata-review-decisions/*-reconciliation-20260908.json` (7 files) change the
  affected routes to `reviewStatus: approved`, with `provenance` ending
  `…exact-instant-owner-approved-2026-09-08`, and carry both the frozen `from` values and the
  approved `to` values.
- `scripts/editorial-metadata-registry.js` applies that layer only to **approved** records — the
  base registry's `inconsistent-needs-review` value seen in `data/editorial-metadata.json` is the
  frozen `from` history, not the effective state.
- `scripts/editorial-metadata-v3-approval-gate-test.js:102` asserts the shipped shape verbatim:
  `<time class="article-updated" datetime="2026-07-05T09:14:15.000Z">9 мая 2026</time>`.
- Contract: the **human label stays the editorial date**; `datetime`, JSON-LD and Open Graph carry
  the **owner-approved exact instant** (`scripts/lib/editorial-metadata-v3.js` →
  `projectVisibleDateline` rewrites the attribute and never the text; `projectPagefindDates`,
  `projectTimeTag`, JSON-LD `dateModified` and the meta tags take the same instant).

So label ≠ `datetime` on those routes is the intended reconciliation, and the visible label agrees
with `publishedAt`/`modifiedAt` in Moscow time in every case. Filing it would have converted an
approved owner decision into a defect and inflated the class to 17 routes. It is recorded in the
MASTER "Verified negative boundaries" section instead, with the guard note that **no gate currently
asserts this pairing** — only `editorial-metadata-v3-approval-gate-test.js` pins one instance.

Scan totals (both SHAs, same distribution): main `d586aa63` — 61 elements, 41 consistent,
17 approved-contract divergences, 2 month-precision attributes (`datetime="2026-08"`, valid),
1 range label (`8–12 мая 2025` for a span, valid). Live SHA `d0e04a9c` — 55 elements, 35 consistent,
18 flagged, 2 month-precision.

## 4. Admitted residual: a "Published:" dateline carrying the modification instant (5 routes)

One narrow shape survived the rejection above and is **not** covered by the approved contract:

```html
<!-- src/components/nagornaya/chast-1/NagornayaChast1MainShell.astro:36 (and …SectionSummary.astro:21) -->
<p class="article-updated text-stone-400 text-xs mt-1 font-mono">Опубликовано: <time datetime="2026-05-01">1 мая 2026</time></p>
```

`projectVisibleDateline` selects by class: a container carrying `article-updated` gets
`record.editorialModifiedAt` written into its first `<time datetime>`. On the five Nagornaya
chapters the authored wording is **«Опубликовано:»** and the authored label is the **publication**
day, so the built page reads:

```html
<p class="article-updated …">Опубликовано: <time datetime="2026-07-22T21:48:34.000Z">1 мая 2026</time></p>
```

while the same page publishes JSON-LD `datePublished: 2026-04-30T21:00:00.000Z` and
`article:published_time` with the same value. The reader-visible text says "published 1 May 2026";
the machine date attached to that sentence says "modified 22 July 2026".

- Scope at `d586aa63` and identically at the live SHA `d0e04a9c`: `/nagornaya/chast-1/` … `/chast-5/`
  (10 authored components: `NagornayaChast{1..5}MainShell.astro` + `NagornayaChast{1..5}SectionSummary.astro`).
- Effective approved values per route: `editorialPublishedAt 2026-04-30T21:00:00.000Z` (all five);
  `editorialModifiedAt` `2026-07-22T21:48:34.000Z` (chast-1/2/4), `2026-07-05T18:09:08.000Z` (chast-3),
  `2026-07-22T11:13:44.000Z` (chast-5).
- Control: `/articles/kod-da-vinchi/`, where the `article-updated` element's own label **is** the
  modified date (`9 мая 2026` + `2026-07-05T09:14:15.000Z`) — the approved shape asserted by the gate
  test. The Nagornaya markup reuses that class for a *published* sentence.
- Owner: the component class/wording (or the projector's class-only targeting). Not an editorial
  data question — the approved instants are correct; only the slot they are written into is wrong.
- Guard gap: `scripts/editorial-dateline-contract-test.js` governs `class="editorial-dateline"`
  markup and never inspects `article-updated` datelines; the approval gate pins one kod-da-vinchi
  instance. A class-level guard would fail when a `<time>` inside an `article-updated` container is
  introduced by «Опубликовано» (or, generally, when the projected field disagrees with the
  dateline's own wording and label).

Recorded as MASTER row `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT`. If the owner
judges the wording intentional, the disposition is accepted-risk and the row leaves the MASTER;
this pass does not pre-empt that.

The Baptist byline row `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE` is narrowed, not extended,
by this pass. Its real residual is the five single-date routes that put the **modification-day
label** in the **publication dateline slot**
(`iniciativnaya-gruppa`, `podpolnaya-pechat`, `spravochnik`, `vsehib-1944`, plus `dva-sezda-1884`,
`goneniya-i-sovest`, `noch-na-kure`, `sovetskaya-noch`, `yuzhnaya-shtunda` at the live SHA — i.e.
the four repair commits `11a69e94`, `87f659d4`, `7665a64a`, `37171903` exist only on main and not in
the live release). Built at main: `<time datetime="2026-06-08T00:00:00+03:00">13 июня 2026</time>`.
The label is authored text, so no projection can repair it — the fix stays component authoring plus
an owner decision on `spravochnik` («14 июня» authored vs `publishedAt` 2026-06-10).

## 5. Measurement boundaries in this session

1. **No browser ran.** `npx playwright install chromium` fails with `ECONNRESET` and no system
   Chrome exists in this sandbox. Everything here is source, exact-SHA build artifact, GitHub API or
   plain-text live retrieval. Rows that need rendering (contrast, focus visibility, forced colors,
   touch behaviour) keep their existing browser receipts from earlier passes; no row was promoted to
   "browser-verified" here.
2. **`fetch_page` cannot read `<time>` text** (control-proven in
   `evidence/2026-09-30-live-fetch-time-element-boundary.txt`): it drops element text of `<time>`
   and surfaces the hidden `data-pagefind-meta` spans. Live byline *labels* are therefore witnessed
   from the exact-SHA built artifact, not from live HTTP text. Ordinary text is witnessed live: the
   `????` copy loss renders verbatim on live `/baptisty-rossii/spravochnik/` today, including inside
   link text (`03 ????? **????????? ???????? ? SHA-256**`), which also confirms the damage is not a
   single-element artefact.
3. **Deployed bytes were not re-downloaded.** GitHub Pages artifact egress is unavailable here, so
   the live-SHA statements are "what the live release SHA builds to with the sanctioned production
   pipeline", corroborated by the hidden spans retrieved from the live site matching that build
   byte for byte on three routes. This is stronger than the previous source-only comparison but is
   not a byte-identity proof of the deployed file.
4. Both builds succeeded: `strangler:build:production-like` exit 0 at `d586aa63` and at `d0e04a9c`.

## 5b. Artifact witnesses at both SHAs (the substitute for the unavailable browser)

Because no browser could run (§5), every current row that is decidable from built output was
re-proven on **two** production-like builds — Product main `d586aa63` and the live release SHA
`d0e04a9c`. The two receipts differ only in `head_sha` and in one page count (main has the extra
Lawson page), so **each witness below holds for the live release as well as for main**.

| row | artifact witness (identical at both SHAs) |
| --- | --- |
| `GBS-BASELAYOUT-MISSING-SKIP-LINK`, `GBS-JOURNAL-MISSING-SKIP-LINK` | `/izbrannoe/`, `/hard-texts/genesis-6/`, `/journal/`, `/journal/dossiers/g3/`: skip-link anchors/text = **0**, `<main>` present **without `id`** on all four |
| `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS` | built `404.html`: **3 of 3** reader-preference references relative (`css/reader-preferences.css?v=…`, `js/reader-preferences-head.js?v=…`, `js/reader-preferences.js?v=…`) |
| `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST` | `.quiz-wrapper{background:var(--color-surface-muted)}`; WCAG math on shipped tokens: dark ink `#e6e1d7` over every light surface token = **1.16–1.30:1** (AA needs 4.5:1), while the same ink over the dark-theme tokens = 12.7–14.5:1 |
| `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` | shipped `.quiz-next-btn{display:none}` and **no `.is-visible` rule for it anywhere** (`is-visible` exists only in `floating-cluster.css` and `tts-download-notice.css`, for other components) — the runtime's reveal class has no styling counterpart; 63 built routes carry `[data-gill-v16]`, 9 of them with a quiz payload |
| `GBS-QUIZ-LITERAL-MARKUP` | parsing `window.SITE_CONFIG` in every built route (7 strict-JSON blobs + a raw-text fallback over 80 JS-literal blobs) finds literal `<em>`/`<span>` inside quiz strings on **9 routes** (antisovetov 14 strings, Nagornaya chast-2/4/5, Gill chast-2/3/4, kod-da-vinchi, krajne-li) — an independent corroboration of the row's "9+ routes"; `js/bookmark-engine.js` uses `.textContent=` twice and `.innerHTML=` **never** |
| `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP` | `margin-right:-12px!important` on `.gb-nav-search-icon` + `.mobile-controls{gap:0!important}` + both targets forced to 44×44 ⇒ the 12px shared strip is derivable from shipped CSS alone |
| `GBS-NAGORNAYA-SOURCE-LINKS-COLOR-ONLY` | base rule `a{color:#1f4ea3;text-decoration:none}`; of the 10 `text-decoration:underline` declarations in `css/*.css` **none** targets a Nagornaya source/bibliography selector; built chapters carry 31–37 links with no inline underline |
| `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED` | `.hm-spdbadge{min-width:18px;height:13px}` + `::before{inset:-4px -3px}` shipped on all three named routes (`#hmSpdBadge` present, `mobile-spdbadge` absent), against the compliant in-repo control `[data-gill-v16] .mobile-spdbadge{min-width:24px;height:24px}` |
| `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` | `.theme-toggle…:focus-visible` rules in `css/*.css`: **0**; `home.css` has one `.mobile-controls > button:focus-visible` rule; `css/mobile-hotfix.css` (loaded by `src/components/home/HomePageHead.astro:158` and listed in `src/layouts/BaseLayout.astro:129`) applies `outline:0!important` to the same controls |
| `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` | built `#menuBtn` contains three `div.bar.h-0.5.bg-white` bars, **0** SVG/border fallbacks; the only forced-colors block (`css/site.css`) does not mention `#menuBtn`/`.bar`; 9 built `/nagornaya/**` pages (hub + 8) |
| `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` | shipped `.h-scroll-top{…opacity:0…}` with reveal only via `.h-scroll-top.visible`; runtime test `(window.scrollY\|\|window.pageYOffset)>500`; no focus-driven reveal |
| `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` | `#canonTimeline .ctw-body{overflow-x:auto}` + `.ctw-track{min-width:580px}` shipped; the built tags are `<div class="ctw-body">` / `<div class="ctw-track">` with **no `tabindex` and no `role`** |
| `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS` | true DOM parse of the built page: 39 `role="button"[tabindex="0"]` triggers, exactly **1** nested inside another — tip **19**, matching the row |

Rows that remain **browser/runtime-only** (stated, not skipped): `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY`
(ready-state observer), the three `GBS-MOBILE-CHROME-*` rows (visibility/navbar sync/touch race),
`GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` (`data-print-keep-next` appears on **0** built routes —
it is applied at runtime), `GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS` (built `/` contains «Закрыть
поиск» once; the second control is created at runtime), `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST`
(needs composited colors) and `GBS-NAGORNAYA-READER-FONT-SCALE-INCOMPLETE` (needs preference
application). Their earlier browser receipts stand; none was promoted or re-dated here.

Two rows also gained an exact denominator (receipt `evidence/2026-09-30-quiz-route-census.txt`,
identical at both SHAs): of 105/104 built routes, 63 carry `[data-gill-v16]`, **23 are
quiz-enabled**, and **15** of those are quiz-enabled *and* under `[data-gill-v16]` — so the affected
count in `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` ("15 of 24 audited") is confirmed unchanged while its
denominator is re-measured as 23, and `GBS-QUIZ-LITERAL-MARKUP` is enumerated as **9 of 23** routes
(a lower bound from two parse passes).

Receipts: `evidence/2026-09-30-artifact-witness-main.txt`, `evidence/2026-09-30-artifact-witness-live-sha.txt`, `evidence/2026-09-30-quiz-route-census.txt`.

## 6. Open Product PR rollups, recomputed at each exact head

| PR | head | vs main | gates | disposition in this pass |
| --- | --- | --- | --- | --- |
| #2153 | `c671491f660a67f6241e469905379a41f98a4a4d` (docs only, `arena-ai-coding-agent[bot]`) | +209/−9 | no red checks at this head | not a release fix; the blocker is absent from the branch, so green here proves nothing about main |
| #2150 | `89e767940932d809d15a4a304777f222009925e6` | +62800/−13511, 417 files, 37 behind | 11 red (Deploy to GitHub Pages, Metadata & IndexNow Readiness, Canonical Index, Canonical Route Contract, Editorial Dateline, Publication Profile Gate, Repo Health Gate, Route Contract, Source Registry Guard, Strict Source Metadata Gate, Validate Publication Contract) | Lawson catalog lane — **owner-directed stand-down**; not worked, not closed, not merged |
| #2145 | `994b87356d526f0180b2885f92691f94379f969e` | +205/−1, 3 files, 24 behind | 4 red | another agent's branch — untouched |
| #2144 | `892977fd8d85011636e68f003b4d2e1673b68533` (Dependabot) | 4 behind | 20 red | dependency lane; not this pass's scope |
| #2143 | `acd4ace432516d890d37743684e5800765e3a609` (draft) | 6 behind | none red at this head | research-only lane |
| #2142 | `71a4f5295b398487f74937592c0c804358050d60` | 6 behind | none red at this head | research-only lane |

No Product PR was merged, closed or edited in this pass. A green AuditRepo PR is not a reason to
merge any Product PR.

## 7. Branch census

37 total / 36 non-main at measurement time (receipt: `evidence/2026-09-30-branch-census.txt`).
This supersedes 36/35 (earlier same day), 44/43 (lifecycle recheck) and 205/204 (pre-cleanup). The
Lawson-active branches are `fix/lawson-premium-polish-20260930`,
`publication/lawson-release-hardening-20260930`, `publication/steven-lawson-final-20260930` (plus
its `tmp-…-fixup` twin) — noted for the SYS-STRICT lane collision risk only; the lane itself is
under owner-directed stand-down.

## 7b. PROGRAM currency re-derived (Direction 4)

Rather than carrying the previous numbers forward, the program facts that are measurable at this
head were re-read (receipt: `evidence/2026-09-30-program-currency-remeasure.txt`):

- **Articles/books axis:** `src/content/articles/*.mdx` is **64** files at main vs **63** at the live
  SHA; the +1 is the blocked Lawson route, so the corpus grew on main only.
- **Wave 4 genealogy:** raw layer 3056 persons / 2053 edges / 982 isolated, RU review queue **2825**,
  raw status `phase1-draft — НЕ подключать в рантайм до exit-критериев Phase 1`; publishable layer is a
  closed curated subset (154 of 3056, `partial-by-design`) with 181 relations and relation evidence
  **42 reviewed / 139 pending** — the PROGRAM figures re-derived from
  `data/genealogy/v2/publishable/meta.json`, not assumed. Rights: derived dataset **CC BY 4.0**
  (attribution STEPBible.org / Tyndale House Cambridge); Synodal text public domain.
- **Wave 5B image rights / primary-source access:** 10 diagrams, all `status: production`, all 10
  local SVG assets present, policy forbids remote SVG / external raster / AI historical photos; all
  **31** referenced source dossiers exist under `baptisty-rossii/research/` (byte access in Product,
  not public routes).
- **Wave 6 maps:** live `/karty/` re-measured 2026-09-30 — **1 open / 9 on audit / 0 drafts**,
  unchanged since 2026-09-24; data readiness 10 maps / 132 places / 153 photos / 23 verified
  waypoints. The 10-in-data vs 1-on-showcase gap is the audit gap, not a defect.

Not re-measured: Wave 5A research families (needs the Research repo and Drive traversal), Wave 7
external provider/legal items and the red scheduled `Source Link Audit` (job logs unreachable; local
reproduction inadmissible in this sandbox), and any visual verification (no browser).

## 8. Resulting AuditRepo changes

- MASTER: step count corrected (2 places); one current row added
  (`GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT`, 25 → 26);
  `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE` narrowed to the label-slot residual with both
  SHAs measured; `GBS-OPEN-CONTENT-PR-DISPOSITION` refreshed with the six open PRs and the
  stand-down note; the SYS-STRICT lane records the lane collision without taking Lawson work; one
  negative boundary added (the approved exact-instant dateline contract).
- PROGRAM: Wave 8 branch census and gate rollups refreshed; the terminal-disposition step count
  corrected; Wave 5B records the live/main `????` equivalence now measured on built artifacts.
- Ledger: two entries (step-count correction + rejected candidate; admitted dateline residual).
- No closure was claimed for the release block; the Lawson decision remains the owner's.
