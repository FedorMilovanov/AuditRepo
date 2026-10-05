# arena-dx-ux-audit — 2026-10-06 — DX/UX/engine audit of gospod-bog.ru

## Meta

```text
project:            gb-is-my-strength
source repo:        FedorMilovanov/gb-is-my-strength
audited anchor:     350848145ee252a4e6ad8b86c9c8e831e2b4cb12  (main at read time, 2026-10-05T21:18:50Z — merge of PR #2170)
anchor note:        main moved to 68750830 (merge of PR #2171, 2026-10-05T22:06Z) while this pass was being written; a second
                    wave then rebuilt current main 68750830 locally and re-tested four matrix rows there (see §2 and
                    evidence/2026-10-06-matrix-row-recheck-at-main.txt).
                    All browser/build evidence here is tied to 35084814 and was NOT re-taken on 68750830; only the CI state
                    was re-read at the newer head (the red Search Modal Contract lane is still red there).
environment:        Debian-class sandbox, 2 cores / 3 GB; node v22.22.3; npm 10.9.8
browser:            sandbox-local Chromium 153.0.8010.0 (patched NSS), axe-core, Playwright 1.62/1.63
served artifact:    production-like local dist (`npm run strangler:build:production-like` + pagefind) over http://127.0.0.1:8080
agent:              arena-dx-ux-audit
date:               2026-10-06
report type:        browser-audit + source-audit + ci-audit + dist-audit (mixed evidence package)
intake language:    every item is `raw` / `candidate` / `reproduced-by-agent`, with its evidence class named;
                    durable classification belongs to a verifier synthesis, not to this pass.
evidence classes:   verified-browser (Chromium 153 on the exact-SHA dist), verified-build (production-like dist),
                    verified-source (file/line at the anchor), verified-ci (GitHub check-runs/deployments/pages API), verified-live (none)
live-host claim:    NONE. gospod-bog.ru is unreachable from this sandbox (`curl` -> exit 35 / code 000);
                    production statements below come from the GitHub deployment/CI API, not from live bytes.
```

Scope of the pass, as requested by the owner: how convenient the site is for a reader, how universal the engines are,
how easily new articles can be written, professional appearance, quality, and "Apple-level" polish.

Routes with browser evidence in this pass: `/`, `/articles/`, `/articles/kod-da-vinchi/`,
`/articles/steven-lawson-samoobman-i-publichnyy-golos/`, `/articles/dzhon-gill-chast-2-uchenyi/`,
`/articles/20-antisovetov-pastoru/`, `/nagornaya/chast-1/`, `/karty/`, `/karty/avraam/`, `/map/`, `/hard-texts/`,
`/biografii/`, `/konfessii/`, `/journal/`, `/404.html` (plus a nested-404 emulation) and 10 `/baptisty-rossii/*` routes.

## 1. New observations

Every item below was reproduced in this sandbox at the anchor above; the machine evidence paths are in `evidence/`.

### 1.1 Blocking pre-existing red that this pass did NOT fix (reported, not touched)

- **`Search combobox, modal and touch contract` is red on current main.** It is the only red check-run at the anchor
  (1 failure / 21 success / 5 skipped of 27 non-helper runs). Job 111905495568 fails at step 8 "Validate Search modal runtime";
  the check-run annotation is only the generic "Process completed with exit code 1" at `.github` line 24, so CI exposes no
  assertion text for it.
  It went red on the merge that produced the audited head (`35084814`, 2026-10-05T17:56Z; the two runs before it, at
  `528771be` and `6ce0102e`, were green) and has stayed red on **every** run since, including PR heads `db498d59`, `fad890a6`,
  `3e176955`, `af90af3b`, `d3afb9a6` and the newest head `68750830` (in progress at read time).
- Locally the **Chromium half is green**: search-modal 4/4, scope-semantics 4/4, app-search-surface 8/8, header-cluster
  (18 geometry cases + 2 interaction contexts) all PASS on the production-like dist of the same SHA.
  The unreachable half is **WebKit** (no engine available in this sandbox — see §9 and the environment evidence).
  So the locus is narrowed to WebKit cases/assertions; the actual cause is **not** identified here.
- Secondary robustness note: the search-modal contract treats *any* console error as a failure, so a blocked third-party
  beacon (Yandex Metrika) alone reddens it. That is what happened in my first local run. It does not explain CI (where the
  beacon is reachable), but it is a real fragility of the contract.

### 1.2 The 2026-09-30/10-01 release blocker is gone — the matrix's `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` needs narrowing

- `Deploy to GitHub Pages` on main `35084814` = **success** (run 37352186501); deployment `6866820381` status **success**
  (2026-10-05T18:28:19Z); Pages API `status: built`. `node scripts/audit-pro.js` — the command that failed on 2026-09-30 —
  exits **0** locally on a clean tree.
- Source: commit `69d3aa13361063a6aaa6272553c4874866829fa0` ("canonical hardened article + unblocked deploy gate (supersedes
  #2153, #2154) (#2155)") added the missing discovery rows. At the anchor the Lawson route is present in
  `data/route-search-policy.json` (1), `data/search-manifest.json` (3), `dist/sitemap.xml` (2), `dist/feed.xml` (2) and
  `dist/articles/index.html` (1) — i.e. all three former manifestations (release gate, catalog omission, RSS omission) are fixed.
- **But the class-level defect is still live and I reproduced it independently** (see §1.3): the sanctioned writers still
  cannot register a new route, and nothing fails admission while the effective-route registry and the discovery surfaces
  disagree. So the lane narrows to the guard/machine-repair gap rather than closing.

### 1.3 Writing a new article: measured friction (the owner's main question)

Controlled staged probe (full recipe and gate output in `evidence/2026-10-06-article-add-friction-probe.txt`):

| Stage | What was added | Result |
|---|---|---|
| 1 | `src/content/articles/<slug>.mdx` only | `astro build` exit 0, still **104 pages**, no route emitted — an MDX file alone publishes nothing |
| 2 | + `src/pages/articles/<slug>/index.astro` (26 lines, generic `ArticleLayout`) | 105 pages, page renders correctly, but `page-ownership:check` **FAILS** |
| 3 | + `migration/page-ownership.json` row + `data/route-profiles/articles-<slug>.json` | ownership passes; the two discovery normalizers still fail without the profile; `editorial-metadata-registry --check` fails |
| 4 | + `data/route-search-policy.json` row + `data/search-manifest.json` row (hand-written, `publishedTime`/`readTime`) | registers, but see the four traps below |
| 5 | production-like rebuild + pagefind | appears in catalog (1), sitemap (2), feed (2), manifest (3), editorial registry (4); Pagefind indexes its own fragment |

Four measured traps on that path:

1. **`search-manifest-policy-normalizer.js --write` is a no-op for a new route** — it prints
   "Search manifest migration candidates: 0 / existing-row drift: 0 / No search policy or manifest migration changes required"
   and produces an **empty diff** (exit 0). The sanctioned writer cannot do the job; the operator must hand-author the manifest row.
2. **Two field vocabularies for the same facts.** Frontmatter is `publishedAt/updatedAt/readingTime`; the manifest is
   `publishedTime/modifiedTime/readTime`. Writing the frontmatter names into the manifest passes `--check` silently and later
   fails inside the RSS writer with a misleading "search-manifest item missing publishedTime". Census: 95/96 manifest rows use
   `readTime`, 90/96 use `publishedTime`, 5 rows carry no date at all.
3. **`editorial-metadata-registry.js --write` rewrites unrelated lanes** — registering one article also rewrote five
   supplement files (`diotrophes-wave12`, `lawson-publication-20260930`, `nagornaya-native-chapters`,
   `pastor-series-ii-ix-20260908`, `teen-series-20260910`), filling `observations` drift. A single-article commit becomes diff noise.
4. **The route profile is required but not enforced where you would expect** — `migration:metadata:check:strict` passes without
   it; only `rss-feed-normalizer`/`sitemap-policy-normalizer` complain ("production Astro route has no route profile").

**Engine universality differs sharply per engine** (full map: `evidence/2026-10-06-engine-universality-map.txt`):

- **Series engine — the mature, genuinely reusable one.** One `SeriesReaderChrome` plus one config per series
  (`defineSeriesConfig()`; Baptist/Gill, heart, teen, pastor, hard-texts, genesis-6 …), a per-series theme CSS restricted to
  `--gb-*` token overrides, an isolation contract that fails if a single article imports `gill-series`, and a real
  step-numbered authoring guide (`docs/SERIES-ENGINE-GUIDE.md`: 6 steps to add an article to an existing series, 4 steps for a
  new series). The gate chain backing it is green at this anchor: `npm run engine:guard` = PASS, including a real browser
  sweep (relations panel 9/9, unified navigation sweep completed, exit 0).
- **Mobile chrome engine — config-driven registry.** `mobileChromeRegistry.ts` selects the chrome engine by route config, not
  by `pathname.includes(...)`, with four adapters (`gill`, `hermenevtika`, `default-page`, `series-landing`) covering 13 routes
  and documented opt-outs (`/izbrannoe/`, `/map/`). Gap: the file promises route profiles will mirror a `mobileChrome` field
  after freeze, but **0 of 106 profiles contain it** — the registry is the only source, so route profiles do not record which
  chrome engine a route uses.
- **Reader-bar strings — there is no i18n layer at all.** The earlier "i18n dictionary `hm*`" hypothesis is corrected: `hm*`
  are DOM ids inside the 492-line `HermenevtikaMobileBar.astro` (the `hermenevtika` adapter). `find src -iname '*i18n*'` finds
  nothing; all eight `aria-label`s and all visible copy in that bar are Russian literals, and the series engine has a second,
  separate 280-line bar component. So the bar is shared by import (Hermenevtika, Da Vinci, Lawson, Lot) but not parameterized
  for language or reuse.

Engine universality at the same anchor:

- 107 route profiles / 106 owned routes. `contentSourceMode`: `astro-native-entry` 45, `mdx-native` 23, unset 39.
  `mdxStatus`: `reference-only` 42, `canonical` 23, `absent` 3, unset 39.
- Of 37 `routeType=article` profiles: `reference-only` 32, `absent` 3, **`canonical` 2** (`steven-lawson-samoobman-i-publichnyy-golos`,
  and the probe route I created). The other 21 canonical-MDX routes are `surface=series` (heart / teen / hard-texts families).
- Only **1 of the 51** article route directories under `src/pages/articles/` uses the generic `ArticleLayout` shell (Lawson,
  added 2026-09-30). The other 50 are bespoke shells over **40 pilot directories / 241 files** in `src/components/article-pilots/`.
- The generic path itself **works well** when used: reader rail, TOC, byline, author card, JSON-LD, dark theme, mobile chrome,
  Pagefind — all verified in the browser. The problem is that it is the unused exception, and nothing scaffolds it.
- **Documentation drift.** `docs/refactor-2026/CONTENT_MODEL_AND_AUTHORING_2026.md` (dated 2026-06-12) promises
  `npm run new:article` and authoring components `<Verse>`, `<OriginalWord>`, `<SourceRef>`, `<Note>`, `<Warning>`,
  `<ArgumentMap>`, `<Timeline>`, `<MapLink>`, a `cover`/`coverAlt` pair and a collection-driven catalog/sitemap/RSS.
  Measured now: `new:article` does not exist in `package.json`; each of those component names has **0** matching files in
  `src/components`; `src/content.config.ts` has no `cover`/`coverAlt` (it has `ogImage`/`ogImageAlt`); the catalog/sitemap/RSS are
  registry-driven, not collection-driven. The only custom MDX components used anywhere in `src/content/articles/*.mdx` are the
  Lawson pilot's `<LawsonSourceRef>` (×292), `<LawsonTerm>` (×5) and `<LawsonBibliography>` (×1). The real editorial standard is
  `docs/ARTICLE-STANDARD-CHARTER.md` (54 standards S1–S54) — the authoring doc is the one promising ergonomics that do not exist.
- CI cost of one public article: its path set matches the path filters of **22 of the 77** product workflows
  (`migration/page-ownership.json` and `data/search-manifest.json` are each referenced by 9 workflows).

### 1.4 Accessibility failures reproduced in a real browser (axe-core + independent contrast recomputation)

Full per-viewport axe matrix: `evidence/2026-10-06-browser-matrix-19-viewports.json`;
per-node contrast triage with independent recomputation: `evidence/2026-10-06-contrast-triage.json`.

`/articles/` (catalog, 1440 **and** 390):

- **`color-contrast` 325 nodes** (plus `region` 1). All 25 distinct failing selector/colour combinations recompute to a failure,
  and they come from **one foreground token**, `rgb(120,113,108)`, over three paper surfaces:
  **4.41:1** (×4 nodes, `#78716c` on `#f8f5f0` — `.h-hero-tagline`, `.h-hero-desc`, `#hLibraryLabel`, `#hSeriesLabel`),
  **4.37:1** (×14 — `.h-meta-time`, `.h-article-abstract` on `#f7f4ee`),
  **4.12:1** (×7 — `.h-meta-tag--neutral` on its own card surface `#f3ede5`).
  Requirement is 4.5:1 for small text; the whole library surface misses AA by ~2–8 %.

`/articles/kod-da-vinchi/` (1440 light / 1440 dark / 390 / 768 / reduced-motion):

- `color-contrast` 17 nodes light, 11 dark at 390, 9 at 1440 dark, 23 under reduced-motion. Recomputed values:
  `.error-flip-label-fact` ("По источникам", 10 px) **3.87:1** (`#3a8a5a` on `#eef7f2`, ×5);
  `.ctw-sub`, `.ctw-sub > em`, `.ctw-axis > span` **3.24:1** (`#888888` on `#f5f5f3`, ×7);
  `.ctw-pin-yr`, `.ctw-pin-lbl` **3.51:1** (`#bf6e2a` on `#f5f5f3`, ×2);
  one reader-section `h4` **1.49:1** (`#b8d0b0` on `#eef5ec`);
  dark theme: `.ctw-*` **3.71:1** (`#6b7280` on `#13171e`, ×7) and `#quizLaunch` "Начать проверку" + `.author-card-icon`
  **2.22:1** (white on `#d4a574`, ×2).
- `label-content-name-mismatch` (WCAG 2.5.3): **25 nodes** at 1440 / **27** at 390 and 768 / **30** under reduced-motion —
  mostly `.error-flip-card`, whose accessible name is "Нажмите, чтобы перевернуть: <тема>" and does not contain the card's
  visible text; §1.5 shows `#hmBottomBtn` (visible "0 %" progress, name "Открыть оглавление статьи") as the same class.
- `aria-allowed-role` ×2 (new here, not previously recorded on this route), `heading-order` ×6
  (six `h4` follow `h2` without an `h3`), `region` 1–2.
- Mobile/tablet only: `landmark-no-duplicate-contentinfo` 1 + `landmark-unique` 1 (the `.hmbar` footer bar),
  `target-size` 1 — `#hmSpdBadge`, 13 px tall, on this route too. The shared `HermenevtikaMobileBar.astro:69` is imported by
  `KodDaVinchiPageChrome.astro:5,32`, so the existing undersized-badge row has a wider route boundary than recorded.
- `scrollable-region-focusable` 1 at 768 px on `.ctw-body` — independent re-confirmation of the existing
  `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` row.

`/nagornaya/chast-1/`:

- `color-contrast` **36 nodes**, of which **34 recompute as failures**: series-nav inactive items **4.03:1**
  (`#78716c` on `#f0ebe1`, ×7) and source-list lines **4.39:1** (`#78716c` on `#f5f5f4`, ×14);
  the **active** item is white on `rgb(217,119,6)` = **3.18:1** with its `text-amber-200` sub-label at **2.55:1**;
  also `.text-amber-600` 3.08:1, `.text-emerald-600` 3.57:1, `.text-amber-200` 2.55:1.
  Non-contrast rules here: `aria-allowed-role` ×2, `label-content-name-mismatch` ×2, `landmark-unique` ×1,
  `link-in-text-block` ×5, `region` ×1.

Library-landing family (new in this pass, full receipt `evidence/2026-10-06-extra-surfaces-pass.txt`):

- `/hard-texts/` — **`color-contrast` 27 nodes** from two tokens: `#78716c` on `#f8f5f0` = **4.41:1** (19 nodes: hero
  tagline/kicker, `#seriesLabel`, card meta/minutes/abstract) and the accent kicker `rgba(31,78,163,0.7)` → `#6080ba`
  = **3.64:1** (6 nodes, 10 px bold).
- `/biografii/` — **`color-contrast` 32 nodes**: the same `#78716c` family at 4.41:1/4.37:1 (22 nodes) plus the accent kicker
  at 3.61:1/3.64:1 (10 nodes). So one muted token **plus one accent token** carry the whole catalog/landing family
  (`/articles/`, `/hard-texts/`, `/biografii/`).
- `/konfessii/` — renders a dark shell regardless of `colorScheme`; 3 contrast nodes: `.crumb` **4.14:1**,
  `.he` (`rgba(232,200,121,0.55)`) **4.26:1**, `footer` **3.36:1**. Other rules: `label-content-name-mismatch` 1
  (`a[href$="russkij-baptizm/"]`), `link-in-text-block` 3, `region` 4, and at 390 `landmark-no-duplicate-banner` +
  `landmark-unique` on `.mcp-top`.
- `/journal/` — **0 axe violations and 0 console errors** (the only sampled route with no blocked-beacon error), but also
  **no skip link** and no `main` target: the first Tab stop is the topbar brand link.
- `/404.html` — no violations in light, one in dark (`.skip-link` itself, low contrast).

Other routes (axe, one viewport each): `/about/` `color-contrast` 1 + `label-content-name-mismatch` 4 + `region` 1;
`/pastor-series/` `color-contrast` 2 + `aria-allowed-role` 2; `home` `label-content-name-mismatch` 1 (`#heroSearchBar`)
+ `region` 1 (`.sdg`), identical in light and dark and at 390; Lawson `link-in-text-block` 1;
`/articles/dzhon-gill-chast-2-uchenyi/` `color-contrast` 27 — **not** reproduced by my own recomputation (see §3).

Positive controls (green, worth recording):

- `/` has **0** axe contrast violations; 19/19 sampled viewports had **0 page errors**, **0** images without `alt`,
  **0** broken content images, `document.fonts.status = "loaded"` everywhere, and no horizontal document overflow.

### 1.5 Interaction and behavior checks (all worked; no JS errors)

- Command palette: `Ctrl+K` opens `#gbCommandPalette` (`class="cp-backdrop is-open"`, `role=combobox`, `aria-expanded=true`,
  placeholder "Поиск по статьям и ссылкам…"); typing "Гилл" produced **16 live results** linking to the Gill parts;
  `Escape` closes it; the network log shows `js/search.js`, `data/search-manifest.json`, `pagefind/pagefind.js`,
  `pagefind-worker.js`, `pagefind-entry.json` and the `.pf_meta` shard all fetched.
- Theme toggle: 44×44 with `aria-pressed`, flips `<html class="dark">` and persists `gb:reader-preferences:v1`.
- Skip link: `Перейти к содержимому` at 621,20 (198×34) on `/` and `/articles/`, `Перейти к содержанию` at 625,20 (190×34)
  on `/articles/kod-da-vinchi/`; opacity 1, `inViewport: true`, `clip: none`.
- Reversible cards flip (`aria-pressed` false → true), reader rail TOC lists 6+ sections with `#sec-*` targets,
  mobile bottom bar has four 44×44 controls (TOC / theme / reading settings / share) with correct centre hit-testing
  and opens its sheet (`hmSheet`, `aria-expanded=true`).
- Quiz engine: 10-question run reaches "Результат: 3 из 10" + "Пройти ещё раз" at 1440 and at 390; feedback after an answer is
  "Верно"/"Неверно" and "Следующий вопрос" (699×46) advances the progress counter. No JS errors at any step.

### 1.6 Performance measured directly (PerformanceObserver, not Lighthouse)

Raw entries: `evidence/2026-10-06-cls-lcp-shift-sources.json`, `evidence/2026-10-06-browser-matrix-19-viewports.json`.

- LCP 136–396 ms on every sampled page (static local server, sandbox) — no LCP problem. Examples: `/` 360 ms (element
  `p.h-hero-desc`), catalog 312 ms (image), Kod light 388 ms / dark 368 ms (hero image), Lawson 340 ms (`h1`),
  Gill 348 ms, Nagornaya 208 ms, map 204 ms, catalog at 390 136 ms.
- CLS: `/` 0.038 light / 0.039 dark (one 33 px shift of `.h-hero-search-wrap` at ~181–240 ms);
  catalog 0.0116 desktop / 0 mobile; Lawson 0.0041; Gill 0.0002; Nagornaya 0.0193; map 0; pastor 0.0141; about 0.0055;
  **Kod 0.1339 light / 0.1579 dark** (identical 0.1339 under reduced-motion, 0 at 390). Attribution for Kod:
  `figure.article-hero` moves ~79 px plus `p.article-desc` / `p.article-byline` shifts at ~240–400 ms.
  0.134 is above the 0.1 "good" threshold on the flagship article route; nothing in the repo declares a CLS budget for it,
  so it goes to the Work Queue as measurement-first work rather than to the matrix.

### 1.7 Evidence map for the items above

| Claim | Class | Machine receipt |
|---|---|---|
| baseline green on clean HEAD (26/26) | verified-build | `evidence/2026-10-06-baseline-gates-clean-head.txt` |
| red check is only Search Modal Contract; step 8; went red at this merge | verified-ci | `evidence/2026-10-06-ci-and-release-state-main.txt` |
| Chromium half of step 8 green at this SHA (4/4, 4/4, 8/8, 18+2) | verified-browser | `evidence/2026-10-06-search-contract-local-chromium.txt` |
| deploy/pages green; `audit-pro` exit 0; Lawson discovery rows present | verified-ci + verified-build | `evidence/2026-10-06-ci-and-release-state-main.txt` |
| authoring friction: 6 stages, no-op writer, two field vocabularies, unrelated rewrites | verified-build + verified-source | `evidence/2026-10-06-article-add-friction-probe.txt`, `artifacts/probe-*` |
| 1/51 generic article shells; 40 pilot dirs / 241 files; docs promise missing toolchain | verified-source | `evidence/2026-10-06-article-add-friction-probe.txt` §5–7 |
| series engine reusable + green `engine:guard`; mobile-chrome registry 13 routes, 0/106 profiles mirror it; no i18n layer | verified-source + verified-build + verified-browser | `evidence/2026-10-06-engine-universality-map.txt` |
| catalog 325 axe nodes / 4.41–4.12:1; Kod 2.22–3.87:1; Nagornaya 2.55–4.03:1 | verified-browser | `evidence/2026-10-06-contrast-triage.json`, `evidence/2026-10-06-interactions-and-runtime-probes.json` |
| palette/theme/skip-link/quiz interactions all work, 0 JS errors | verified-browser | `evidence/2026-10-06-interactions-and-runtime-probes.json` |
| 19-viewport matrix, no overflow/alt/error, fonts loaded | verified-browser | `evidence/2026-10-06-browser-matrix-19-viewports.json` |
| LCP/CLS incl. Kod 0.134 light / 0.158 dark with shift sources | verified-browser | `evidence/2026-10-06-cls-lcp-shift-sources.json` |
| retraction of my own "Спорой" reading (DOM at 3×, exact text) | verified-browser | `evidence/2026-10-06-non-defects-and-negative-findings.txt` |
| Baptist residual narrows to 4 routes; `spravochnik` reconciled | verified-build | `evidence/2026-10-06-baptist-dateline-current-artifact-recheck.txt` |
| extra surfaces: hard-texts/biografii accent token 3.6:1, konfessii dark 3.36–4.26:1 and no skip link, journal clean, 404 fixed | verified-browser + verified-build | `evidence/2026-10-06-extra-surfaces-pass.txt`, `.json` |
| four rows re-tested on a fresh current-main build: quiz-next fixed, BaseLayout bypass fixed, mobile-chrome re-confirmed, genesis toggle re-confirmed | verified-browser + verified-source | `evidence/2026-10-06-matrix-row-recheck-at-main.txt`, `.json` |
| toolchain/NSS/browser setup and its limits (no WebKit, no live host) | verified-build | `evidence/2026-10-06-environment-and-toolchain.txt` |

## 2. Confirmations and extensions

- `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` — re-confirmed independently (axe `scrollable-region-focusable` on `.ctw-body` at 768 px).
- `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED` — **boundary extension**: the same shared component renders on
  `/articles/kod-da-vinchi/` (13 px badge, `target-size`), not only on the three routes recorded in the row.
- `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST` — same family: I measured `#quizLaunch` 2.22:1 in dark theme on the Da Vinci route
  (a different node from the row's `.quiz-wrapper` text, so it is recorded inside the new Kod contrast cluster row instead).
- `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` — the Lawson instance is FIXED-CURRENT; the class-level repair gap is re-proven
  with an independent staged probe at the current anchor.
- `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE` — artifact recheck at the anchor: the residual is now **four** routes, not five;
  `spravochnik` is reconciled (label and `datetime` both 2026-06-14). Detail receipt in `evidence/`.
- `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS` — **fixed-current at this anchor.** `dist/404.html` references all three
  reader-preference assets with root-absolute URLs and the document contains zero non-root-absolute same-origin references;
  in a Pages-style 404 emulation both a nested 404 (`/deep/nested/missing/`) and the root 404 page load all three with HTTP 200
  and apply stored Sepia (`body rgb(238,227,200)`), while the control request for the *relative* path under the nested URL
  still 404s. Repair commit `e86725321` is inside the deployed history. Comment filed with a `closed-by-fix` recommendation.
- `GBS-JOURNAL-MISSING-SKIP-LINK` — re-confirmed at this anchor (0 skip links, first Tab stop is the topbar brand);
  `/konfessii/` is added as an additional route with no skip link at all (first Tab stop desktop = «На главную»,
  mobile = nothing focusable in the header), reported as an evidence-addition to the `GBS-BASELAYOUT-MISSING-SKIP-LINK` class.
- **Independent recheck wave on a fresh build of current main `68750830`** (the sandbox was rebuilt between passes; four
  rows were re-tested in a browser — receipt `evidence/2026-10-06-matrix-row-recheck-at-main.txt`):
  - `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` — **not reproducible**: `.quiz-next` computes `display:block; visibility:visible; opacity:1`
    on a Gill v16 route at 390 and 1440 and on `/articles/20-antisovetov-pastoru/`, and a click advances the quiz
    («Вопрос 2 из 4» / «Вопрос 2 из 10»). The rule the row describes was deleted by commit `2ee584d` (2026-10-04), whose message
    names this finding. Comment filed with a `closed-by-fix` recommendation.
  - `GBS-BASELAYOUT-MISSING-SKIP-LINK` — **not reproducible on either named route**: `/hard-texts/genesis-6/` and `/izbrannoe/`
    now have `main#main-content`, a skip link as the first Tab stop whose Enter sets `#main-content`, and focus entering main
    afterwards. Comment filed with a `closed-by-fix` recommendation (the class remains real on `/konfessii/`, `/karty/`, journal).
  - `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL` — **re-confirmed**: 3 chrome stops at `top=-51` on each of six routes;
    on `/rodosloviye/` they are Tab stops 1–3 *before* the skip link, exactly as the row states.
  - `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST` — **re-confirmed**: resting icon `rgb(26,26,26)` on `rgb(14,17,22)` = **1.09:1**
    at 1440 in the light reader theme (dark theme: 11.66:1); at 390 that desktop control is 0×0, so the failure is desktop-width.
- Positive confirmations: the release path is green again; `audit-pro` passes; skip links work on the three tested shells
  (`/`, `/articles/`, `/articles/kod-da-vinchi/`) plus `/hard-texts/`, `/biografii/` and `/404.html`;
  search, theme and the quiz engine all behave.

## 3. Challenges and negative findings

- I **retract** a mid-pass claim of my own: the byline badge on the Da Vinci route is **not** "Спорой…".
  At `deviceScaleFactor 3` the text is exactly "С опорой на исторические источники". It was a 1× screenshot downscaling artifact.
- The map page's `<img naturalWidth=0>` is an intentionally empty photo-modal placeholder, not a broken asset.
- The sitemap normalizer's "VALID_DATE_MISSING" diagnostics for `/karty/`, `/karty/avraam/`, `/map/`, `/hard-texts/` are not
  missing-sitemap defects: all of those URLs are present in `sitemap.xml` and the manifest (`/hard-texts/genesis-6/` is
  deliberately manifest-excluded by its policy row and is present in the sitemap).
- The 27-node axe contrast report on `/articles/dzhon-gill-chast-2-uchenyi/` was **not** reproduced by my own recomputation on
  the sampled node (7.46:1 = pass); the route is left unclassified rather than reported as a defect.
- The missing `<h1>` on `/karty/avraam/` is the already-known row, with Product PR #2161 in flight — not re-filed.
- Live-host behavior is not claimed: `curl https://gospod-bog.ru/` exits 35 with code 000 from this sandbox.

## 4. Root-cause clusters

1. **Shared token/surface mismatch under dark themes and tinted cards** (article contrast cluster, catalog 4.41:1, Nagornaya amber
   nav, quiz CTA on amber). One class: a foreground token is reused over surfaces it was not measured against.
2. **Accessible name vs visible text on interactive wrappers** (reversible cards, mobile reader bar TOC button). One class:
   `aria-label` written as an instruction, not as the visible label.
3. **Registry-driven publication with no single registration authority** (authoring friction, no-op normalizer writer, two field
   vocabularies, unrelated-lane rewrites). One class: six authorities, no scaffolder, no admission guard.
4. **Bespoke per-route shells instead of one article engine** (1/51 generic, 40 pilot dirs / 241 files). One class: route families
   were built before the generic shell existed and were never consolidated.
5. **Contract fragility to environment** (search-modal contract reddens on any console error, including a blocked beacon).

## 5. Value and cost assessment

| Candidate | Reader/owner value | Likely cost |
|---|---|---|
| Catalog contrast token (4.41 → ≥4.5) | high — whole library surface, AA conformance | very low — one token, ~zero layout risk |
| Kod contrast cluster (2.22–3.87) | high — flagship article, dark theme | low — token/theme scoping |
| Nagornaya nav contrast | medium-high | low |
| Mobile bar ARIA (name/landmark) | medium-high — serious axe, voice control | low (label text + tabindex/role choice) |
| Reversible-card name mismatch | medium | low-medium (label wording vs visible text contract) |
| Authoring DX (scaffolder + admission guard + doc truth) | very high — every future article | medium (new script + CI contract; needs owner scope) |
| Search-modal red lane | high — signal hygiene on main | unknown until WebKit is available |

## 6. Suggested verification wave

1. Re-run the four contracts with a real WebKit (owner machine or CI artifact retrieval) to locate the red step-8 assertion.
2. After any contrast repair: rebuild, re-run axe + independent recomputation on `/articles/`, `/articles/kod-da-vinchi/` (both
   themes), `/nagornaya/chast-1/`, `/hard-texts/`, `/biografii/`, `/konfessii/`, and confirm no new violations.
3. Re-run the staged article probe after a scaffolder/admission guard exists: one command must produce a publishable route with
   catalog/sitemap/feed/manifest/registry rows, and the probe must fail closed if any surface is missing.

## 7. Suggested repair boundaries

- Contrast work: tokens and theme scoping only; no typography or layout changes (owner-sensitive surfaces).
- ARIA work: visible-label wording or accessible-name derivation; do not remove the reversible-card interaction or the mobile bar.
- Authoring work: a `scripts/new-article.mjs`-class scaffolder + a fail-closed admission check (route registered ⇒ discovery
  rows present). Explicitly out of scope here: changing the six authorities' ownership without an owner decision.
- Do not touch the Lawson lane or the open product PRs (#2150, #2151-family, #2161, #2162, #2168, #2171) from AuditRepo.

## 8. Owner decisions

1. Whether an article scaffolder + admission guard is wanted now (this pass measures the friction but does not implement it).
2. Whether closing the four-route Baptist label/instant residual is still wanted, and whether the label should follow the
   editorial update day or the publication day.
3. Whether the `docs/refactor-2026` authoring document should be corrected or retired now that
   `docs/ARTICLE-STANDARD-CHARTER.md` is the real standard.

## 9. Summary for verifier

- Strongest, cheapest, fully evidenced items: catalog contrast token 4.41–4.12:1 (325 nodes), Kod contrast cluster (2.22–3.87:1),
  Nagornaya nav contrast (2.55–4.03:1), mobile-bar ARIA conflict, reversible-card name mismatch.
- Strongest structural item: the article-publication path needs six hand-edited authorities, and the sanctioned writer is a no-op
  for new routes; the official authoring doc describes a toolchain that does not exist.
- Strongest closure item: `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS` is fixed at this anchor (root-absolute references in the
  built 404 page + a nested-404 browser witness applying stored Sepia) — a verifier should retire the row rather than re-open it.
- Coverage note: this pass covers 15 named routes plus the 19-viewport matrix; still NOT VERIFIED are WebKit, TTS,
  Pagefind facets, Lighthouse, the reading experience of individual hard-texts/biografii articles, and live-host bytes.
- Everything browser-based here is **local exact-SHA** (production-like dist over HTTP), not live-host; the single pre-existing red
  (Search Modal Contract, WebKit half) is reported, not fixed. No Product file, PR, branch or issue was touched.

## 10. NOT VERIFIED — explicit gaps of this pass

- **WebKit**: no engine available in this sandbox (`@playwright/browser-webkit` is a download shim, the WebKit build is
  fetched from a CDN the sandbox cannot reach, and its system libraries cannot be installed because apt is dead). Therefore
  the WebKit half of the Product contracts and the actual cause of the red Search Modal Contract step are NOT VERIFIED.
- **Live host**: `https://gospod-bog.ru/` answers `curl` exit 35 / code 000 from this sandbox. Every production statement here
  is CI/deployment-API evidence, never live bytes.
- **TTS** (voice quality, first-audible latency), **Pagefind facet behaviour**, and **Lighthouse** were not run in this pass.
  LCP/CLS were measured directly from `PerformanceObserver` entries instead.
- **Depth limits**: `/hard-texts/*` and `/biografii/*` were audited only at their landing pages, `/hard-texts/genesis-6/` was
  not visited, and `src/components/article-pilots/**` was not read line-by-line outside the routes named in this report.
- **Not re-run from earlier passes**: the `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` and remaining `GBS-QUIZ-*` rows, the
  `GBS-MOBILE-CHROME-*` family, `/map/` interaction depth, and the 15-of-23 quiz-route sweep. Their rows are untouched here.
- **Statistics with a single witness**: the contrast values were recomputed independently for every distinct failing
  selector/colour combination on the routes triaged in `2026-10-06-contrast-triage.json`, but the routes added later
  (`/hard-texts/`, `/biografii/`, `/konfessii/`) were triaged with axe plus own DOM computation only — one method pair,
  one viewport each (1440, plus 390 for `/konfessii/`).
