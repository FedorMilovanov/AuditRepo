# Browser harness for the 2026-10-14 full-spectrum pass (durable copy)

The sandbox that ran this pass does not persist `/home/user`, `/tmp` or `node_modules`, and it has been reset six times during the
audit. The harness is therefore kept here as text (no binaries, no PNG — those stay out of Git per the source protocol), and the
whole environment is rebuilt with one command.

## Rebuild everything (one command)

```sh
bash rebuild-env.sh                 # Chromium + product clone + production-like build (~4 min)
bash rebuild-env.sh --no-build      # Chromium + clone only (~40 s)
```

Result: `/tmp/gbchrome/chrome.sh` (Chromium 153 launcher) and `/home/user/gbs-src/dist` (production-like build; serve it with
`python3 -m http.server 8099` from that directory). The script asserts nothing about state — it prints `CLONE_OK`, `CHROME_OK`,
`NPMCI_OK`, `BUILD_OK`, `ENV_READY` so a failure is visible at the step that produced it.

`GBS_PRODUCT_DIR` позволяет указать другой Product clone. Существующий негитовый каталог скрипт не удаляет и не перезаписывает: preflight завершается с exit 11.

## What is kept here in full

| file | purpose |
|---|---|
| `rebuild-env.sh` | one-command environment restore (clone, npm, browser, build) |
| `setup-chrome.mjs` | extracts Chromium 153 → `/tmp/gbchrome`, NSS libs → `/tmp/nsslib`, writes `chrome.sh` |
| `patch-nss.mjs` | byte-neutral `NSS_3.30` → `NSS_3.22` rewrite of the `.gnu.version_r` entry |
| `glossary-mobile-at.mjs` | 390×844 touch/keyboard/AX probe for the glossary trigger (receipt §2b, continuation 5) |
| `bref-tooltip-live.mjs` | Scripture-reference tooltip probe: programmatic click, painted text, ARIA state (continuation 7) |
| `bref-sitewide-sweep.mjs` | every `.bref` button on the ten routes: count, projection size, opened tooltip body (continuation 7) |
| `bref-mobile.mjs` | the same tooltip at 390×844 isMobile/touch — geometry, clipping, overflow (continuation 7) |
| `heading-audit.mjs` | sitewide static outline: first heading, level jumps, distribution (continuation 8) |
| `heading-live.mjs` | DOM order of headings + axe (heading-order, region) + first-headings-per-page (continuation 8) |
| `heading-name-pollution.mjs` | how many section headings carry the copy-link control inside them, per route (continuation 8) |
| `heading-axverify.mjs` | native Chrome AX tree (CDP) heading names, clipboard/behaviour of the control, keyboard reach (continuation 8) |
| `axe-structure-sweep.mjs` | 23 routes × axe structure rules, with per-page violation targets (continuation 8) |
| `doc-structure-scan.mjs` | 108 pages: alt/dimensions/ARIA references/duplicate ids/inline handlers/blank targets (continuation 8) |
| `meta-scan.mjs` | canonical/description/robots/title/h1 per page, parsed **without** assuming attribute order (continuation 8) |
| `seo-crosscheck.mjs` | sitemaps + feeds against the actual build: targets, lastmod, dead item links (continuation 8) |
| `home-listings.mjs` | every section, link and image of `/` at 1440×900 and 390×844, with alt/dimensions/console errors (continuation 10) |
| `articles-catalog.mjs` | `/articles/` cards vs article directories, and which articles the home page mentions (continuation 10) |
| `article-dates.mjs` | `datePublished`/`dateModified` per article from JSON-LD `@graph`, sorted; compares against what the home page offers (continuation 10) |
| `imgs-check.mjs` | images per route **after a full scroll** so lazy loading fires — the only way `naturalWidth=0` means "broken" (continuation 10) |
| `genealogy-deep.mjs` | `/rodosloviye/`: node/card geometry, controls, minimap, AX-linked node counts at three profiles (continuation 10) |
| `genealogy-relations-and-fragments.mjs` | 12 health profiles + 10 person panels + native fragment Tab traces; captures facts, not a product PASS (continuation 14) |
| `genealogy-reopen-and-journal.mjs` | 8 profiles: pointer/touch reopen vs keyboard, G3 source projection, disposable sticky scroll-owner A/B; capture, not product PASS (continuation 15) |
| `browser-state-boundaries.mjs` | Before Pagefind build: native favorite UI, real quota, migration, AX, preferences API and fallback history; WIDTH=1440/390 (continuation 16) |
| `pagefind-history-boundary.mjs` | After canonical Pagefind build: same history boundary with actual index-derived target and module/WASM responses (continuation 16) |
| `404-postclosure-recheck.mjs` | 2026-10-22 closure recheck: root + nested Pages-style 404, 3 themes × 2 widths, old-relative negative controls, recovery and axe; SW explicitly isolated, not live/SW PASS |
| `quiz-postclosure-recheck.mjs` | 23 quiz routes: result/restart, actual next controls, explicit native-pointer failure vs keyboard recovery; WIDTH/SCHEME split |
| `reduced-motion-card-occlusion.mjs` | Native Krajne launch at reduced/normal motion, reversible in-memory height A/B and restoration; not a Product fix |
| `header-postclosure-recheck.mjs` | 12 native cold Header bootstrap controls, real delayed search.js, Ctrl/Meta+K, query/close/focus, desktop/mobile Light/Dark; not whole-layout PASS |
| `semantic-surface-recheck.mjs` | 2026-10-23 note/tooltip/dateline capture: class census, native AX, inert/association boundaries, Escape result and approved-instant control; WIDTH/SCHEME split, not Product PASS |
| `tts-native-play-recheck.mjs` | Actual PLAY/native speech/media events and PCM ownership; no fake onstart/audio.play/autoplay bypass, WIDTH/SCHEME split |
| `tts-worker-retry-recheck.mjs` | Actual Shared/Dedicated import failure → restored pinned delivery → Retry vs failed-Promise reset; MIRROR8101, not inference PASS |
| `tts-play-icon-contrast.mjs` | Paired actual ink/underlay PNG test of mobile Nagornaya PLAY in Dark/Light; not hypothetical background or44px requirement |
| `mobile-icons-sweep.mjs` | icon-button geometry at 390 and 768: off-viewport, sub-24 px tap targets, per route (continuation 10) |
| `hero-crumb.mjs` | home hero accessible name (axe `label-content-name-mismatch`) and the `/hard-texts/genesis-6/` breadcrumb/brand collision (continuation 10) |
| `final-sweep.mjs` | axe (WCAG A/AA + best practice) and LCP/CLS on six routes, mobile profile (continuation 10) |

## Node dependencies for the probes

```sh
npm i --no-save node-html-parser playwright-core axe-core && cp node_modules/axe-core/axe.min.js .
```

Install them **in one command**: `npm i --no-save <one package>` prunes the packages an earlier `--no-save` run left behind, which
cost this pass one debugging round (a probe that had worked minutes earlier suddenly could not resolve `node-html-parser`).
The axe-using probes read `./axe.min.js` (override with `AXE=`), and every probe expects the build served at
`http://127.0.0.1:8099` from `/home/user/gbs-src/dist` (`DIST=` overrides the static scanners).

## Why the two patches exist

1. The npm tarball ships a Chromium built against NSS 3.30 while `@achingbrain/nss` provides 3.22, so `libnss3.so` cannot satisfy the
   binary. `patch-nss.mjs` finds `.gnu.version_r` through the section table, locates the `Vernaux` entry whose name is `NSS_3.30`,
   rewrites the name in `.dynstr` (same byte length) and recomputes `vna_hash` — the patch must stay byte-neutral, otherwise the section
   headers shift and the binary segfaults.
2. The 3.22 `libnss3.so` does not export `PK11_HasAttributeSet`, which that Chromium requires at load. `setup-chrome.mjs` compiles a
   stub with a version script pinning the symbol to `NSS_3.22` and loads it with `LD_PRELOAD` through `chrome.sh`.

Playwright uses `executablePath: '/tmp/gbchrome/chrome.sh'` with
`args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']`.

## The rest of the probes

The earlier probe scripts (`gbs-audit.mjs`, `rows-probe.mjs`, `detail.mjs`, `header-probe.mjs`, `heart-print-rm.mjs`, `axe-flip2.mjs`,
`cards-probe.mjs`, `pdf-check.mjs`, `pdf-verify2.mjs`, `verify-print-rm.mjs`, plus the 2026-10-15/16 sets: `lcnm-table.mjs`,
`print-contrast-full.mjs`, `painted-contrast.mjs`, `marker-drift-sweep.mjs`, `tooltip-live2.mjs`, `glossary-sweep.mjs`,
`glossary-detail.mjs`, `gterm-ax-final.mjs`, `px4-probe.mjs`) were written during the pass and did **not** survive the sandbox
resets. They are not reconstructed here because each receipt records the method precisely enough to re-derive them — every receipt in
`../evidence/` names the technique, the route set, the selectors and the exact numbers it produced, and the run commands are recorded
in `../REPORT.md` §7–§13. What matters for re-verification is the measured data, which lives in `../evidence/*.json`.

Continuation 16 order: rebuild production-like dist **without** Pagefind → copy/run `browser-state-boundaries.mjs` in the harness workspace → `npm run pagefind:build:dist` in Product → run `pagefind-history-boundary.mjs`. The baseline capture rejects an already-indexed artifact; neither capture is product PASS.
