# GBS Book Mode — full audit matrix

**Date:** 2026-07-16
**Prototype:** `book-engine/v7/gbs-book-prototype.html`
**Production source audited:** `FedorMilovanov/gb-is-my-strength@c9a06a3e94727de385072e7c28712185b7f8b892`
**Method:** 48 independent command/manual checks, source-contract comparison, JSDOM interaction tests and direct inspection of all supplied reference screenshots.

## Decision: narrow integration boundary

The book mode is a **shape of the existing series engine**, not a fourth reader engine and not an opportunity to replace the existing UI chrome.

| Layer | Rule |
|---|---|
| New | `chapter → arabic article → H2/H3` data/hierarchy and its Book TOC presentation |
| Reuse as-is | PlayEmber, speed expand, Settings, search, save, share, mobile chrome, scroll lock, reader progress calculation |
| Do not port literally from ZIP prototype | `.set-*`, `.mobile-speedrail` bindings, standalone modal implementations, hardcoded `BOOK[]` as production data |
| Production data source | `defineSeriesConfig()` with `tier:'chapter'`, `mark.kind:'arabic'`, `chapterArticles()` |

## A. Prototype/book checks — 28

| ID | Check | Result |
|---|---|---|
| B-01 | HTML parse and explicit button `type` | PASS |
| B-02 | Runtime JavaScript compilation | PASS |
| B-03 | 6 article sections in content | PASS |
| B-04 | 6 article rows in chapter rail | PASS |
| B-05 | Current article exposes 10 H2/H3 navigation rows | PASS |
| B-06 | Fixed book context and independently scrollable rail navigation | PASS |
| B-07 | Outer metro-node centre geometry | PASS by CSS coordinate assertion |
| B-08 | Book overlay starts from its own `scrollTop=0` | PASS |
| B-09 | Target chapter II opens inside the overlay | PASS |
| B-10 | Current article section click restores reading position | PASS |
| B-11 | Full-book progress is continuous, not section-step based | PASS |
| B-12 | Mobile dual ring reads article + book values | PASS |
| B-13 | Local Lora / Source Sans 3 / image paths resolve relatively | PASS |
| B-14 | Day / sepia / dark theme states | PASS |
| B-15 | Source-like Gill settings adapter (`gillSettingsOverlay`) | PASS |
| B-16 | Both Settings triggers sync `aria-expanded` | PASS |
| B-17 | Font track has five source-compatible dots | PASS |
| B-18 | Line-height segment uses `aria-pressed` | PASS |
| B-19 | Search dialog and result routing | PASS |
| B-20 | Learning tabs, note jumps and quiz feedback | PASS |
| B-21 | Bookmark state syncs desktop/mobile controls | PASS |
| B-22 | Print/PDF action is wired | PASS |
| B-23 | Share has Web Share / clipboard / prompt fallback | PASS |
| B-24 | Rail hamburger opens site-sections menu, never Book TOC | PASS |
| B-25 | Canonical Gill Play wrapper and speed badge | PASS |
| B-26 | Current source `initPlayExpand()` speed set has five values (1–2×) | PASS |
| B-27 | Current source Gill desktop minimal-number speed treatment and 32px ember are mirrored | PASS static + JSDOM |
| B-28 | Prologue/Reference use `GillLeatherRibbon` shape + `GillLeatherDefs` material filters | PASS static |
| B-29 | First Heart article book progress derives from `heartProgress('krajne')` / source item data; 0% → 17%, 42.5% → 25%, 100% → 35% | PASS |
| B-30 | Modal focus handling, Escape and reduced motion rules | PASS static + JSDOM |
| B-31 | 28-assertion JSDOM interaction suite | PASS |

## B. Source repository / engine checks — 25

| ID | Check | Result |
|---|---|---|
| S-01 | Full git history fetched and reviewed | PASS, 2481 commits locally available |
| S-02 | Latest origin/main recorded | `c9a06a3e` |
| S-03 | Delta since book introduction reviewed | Book contract originates at `e9faea5b` |
| S-04 | `SeriesMark` allows `arabic` | PASS |
| S-05 | `tier:'chapter'` validates roman heading/no own page | PASS |
| S-06 | Arabic article validates parent chapter | PASS |
| S-07 | Empty chapters are forbidden | PASS |
| S-08 | `topLevelItems()` keeps nested articles out of top rail | PASS |
| S-09 | `chapterArticles()` preserves declared article order | PASS |
| S-10 | `GillSeriesRail` resolves an article to its parent chapter | PASS |
| S-11 | `GillPartTocOverlay` renders chapter → article → current H2/H3 | PASS |
| S-12 | `HARD_TEXTS_SERIES` is production book-mode pilot | PASS |
| S-13 | `engine:contracts` | PASS after dependency install |
| S-14 | `gill:chrome:guard` | PASS |
| S-15 | `gill:series:data:consistency:audit` | PASS |
| S-16 | `gill:reading-time:audit` | PASS |
| S-17 | `gill:pagefind:audit` | PASS |
| S-18 | `route:profiles:check` | PASS, 75 owned production routes |
| S-19 | `migration:matrix:check` | PASS, all 75 routes covered |
| S-20 | `content:sources:check` | PASS |
| S-21 | `data:consistency` | PASS |
| S-22 | `tokens:check` | PASS |
| S-23 | `guard:shared-files` + workflow policy | PASS |
| S-24 | `astro:check` | PASS: 0 errors, 0 warnings, 12 non-blocking hints |
| S-25 | GitHub Pages state | latest `c9a06a3e` run was still `in_progress` when checked; previous `11ae43cb` deploy failed |

## C. Screenshot review

Manually inspected from `ZIP GBS.zip → GBS_ENGINE_RESEARCH_2026-07-15.zip`:

- `reference-book-desktop.png`
- `reference-book-toc-desktop.png`
- `reference-settings-desktop.png`
- `reference-series-player-desktop.png`
- `reference-book-mobile.png`
- `reference-book-mobile-dark.png`
- `reference-book-toc-mobile.png`
- `reference-chapter-ii-expanded-mobile.png`
- `reference-chapter-ii-article-toc-mobile.png`
- `reference-series-player-mobile.png`
- `reference-settings-mobile.png`
- `reference-notes-mobile.png`

Findings:

1. The supplied ZIP reference has its own early `.set-*` settings visual. Current production has since consolidated on `GillReaderSettingsSheet`; the prototype now follows **current source**, not the stale inner settings DOM.
2. The three-level Book TOC, rail rhythm, current chapter treatment, mobile bottom player and reference player are retained as **book-specific visual evidence**.
3. The speed control is not book-specific. **Current `origin/main` source is the only visual authority.** Its `initPlayExpand()` uses five speeds (`1×…2×`) and its Gill desktop exception uses the minimal-number treatment. Older `PremiumControls/spec` material is retained only as historical evidence and must not override current source.
4. `GillLeatherRibbon.astro` + `GillLeatherDefs.astro` are the only acceptable implementation for Prologue / Reference material treatment; handmade CSS ribbons are forbidden.
5. The first article's progress now derives from a local copy of current source `heartProgress()` / `HEART_SERIES_ITEMS`, yielding `heartProgress('krajne') = { doneMin:39, partMin:41, totalMin:228 }`; prior prototype values `39/169/707` were invalid.

## D. Known environment limitation

`npm run engine:sweep` is a browser/Playwright sweep and was not executed to completion because this sandbox has no Chromium executable at `/opt/pw-browsers/chromium`. This is an environment limitation, not a passing result. All non-browser source guards above passed after `npm ci`.

## E. Permitted next increments

1. Replace prototype `BOOK[]` with a generated fixture matching `HARD_TEXTS_SERIES` exactly.
2. Add a source-side regression test proving every chapter has at least one arabic article and Book TOC row order matches `chapterArticles()`.
3. Add Book-mode screenshot baselines to the production visual runner once Chromium is available.
4. Keep visual changes limited to Book TOC/rail nesting. Any chrome change must cite and reuse its existing source component.
