# Wave 11 — shared mobile runtime, Pagefind landing boundaries, editorial projections, book-entry semantics, schema completeness

Date: 2026-08-10
Auditor: ChatGPT
Evidence class: `incoming/raw-current-evidence`

## Anchor / collision boundary

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Exact Product `main`: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- Product `main` remained unchanged during this wave.
- Open Product PR census immediately before publication:
  - `#1543 ci(source-authority): prove static publication trigger closure`
  - `#1544 fix(ci): rebind release witnesses to post-rewrite history`
- Both open PRs are based on current `main`; neither is treated as merged/current Product truth in this report.
- AuditRepo base immediately before publication: `dd8cc01ffcd864c75acad817e4adb8010965f140`
- That base is the parallel Wave 10 report. Wave 11 deliberately extends it instead of overwriting or duplicating it.
- Product mutation: **none**
- MASTER mutation: **none**
- WORK_QUEUE mutation: **none**

Current Product `AGENTS.md`, AuditRepo `README.md`, and `AUDITREPO_OPERATING_MODEL.md` were reread in this audit session. This report remains in `incoming/` because it contains exact-current source evidence, class-level scope expansion, false-positive cleanup, and bounded measurement gaps; it does not authorize a competing repair lane by itself.

## Environment / limitations

This execution environment still cannot perform a fresh direct Playwright session against `gospod-bog.ru`. Therefore this wave does **not** claim:

- fresh production screenshots;
- a current production accessibility-tree capture;
- measured LCP/INP/network transfer cost;
- a real pointer/touch sequence against the deployed site;
- a current live Pagefind query against the deployed index.

The evidence below is instead based on exact-current canonical source, current runtime ownership, current audit scripts, current route-family census, and primary documentation from Pagefind, W3C/WAI, and Google Search Central where relevant.

Historical/public crawler snapshots were used only as convergence signals and were explicitly checked against current source before any disposition.

## Relationship to Wave 10

Parallel Wave 10 (`dd8cc01...`) already established two narrow current mechanisms on `/hard-texts/`:

1. Escape can close the mobile menu while leaving focus on a now-hidden menu link.
2. `#hScrollTop` bypasses the repository's reduced-motion-aware helper and always requests smooth scrolling.

Wave 11 does **not** restate those as new findings. It broadens the route census, finds the shared emergency-scroll-lock root behind the same legacy mobile owner, finds additional reduced-motion paths, and moves into Pagefind, editorial metadata, book semantics, schema completeness, and performance policy.

---

## Executive disposition

| Finding | Current disposition |
|---|---|
| Shared `SiteUtils` emergency timer can force-unlock body scrolling while the current `.h-mobile-nav.open` menu is still open | `CONFIRMED-CURRENT / SYSTEMIC SHARED RUNTIME ROOT` |
| Existing runtime tests false-green that path because their timer stub never executes `emergencyCheck()` | `CONFIRMED-CURRENT / TEST COVERAGE GAP` |
| Legacy home-v20 mobile navigation owner is reused by HardTexts, Pastor Series and Biografii; the Wave 10 hidden-focus mechanism therefore has multi-route scope | `CONFIRMED-CURRENT / ROUTE-FAMILY SCOPE EXPANSION` |
| Those legacy surfaces lose their primary mobile navigation when JS fails/is disabled, while current Home has an explicit `<noscript>` fallback | `CONFIRMED-CURRENT / PROGRESSIVE-ENHANCEMENT GAP` |
| Global `html { scroll-behavior:smooth }` has no reduced-motion override, and the reduced-motion block in `home.css` explicitly reintroduces title transforms/transitions | `CONFIRMED-CURRENT / REDUCED-MOTION COVERAGE GAP` |
| HardTexts, Pastor Series and Biografii mark only the hero as `data-pagefind-body`; substantial landing main content sits outside the Pagefind body | `CONFIRMED-CURRENT / STATIC PAGEFIND LANDING CONTENT OMISSION` |
| HardTexts CTA labelled “Начать книгу” links to Chapter I instead of the canonical first book item, the Prologue | `CONFIRMED-CURRENT / NAVIGATION SEMANTIC DIVERGENCE` |
| Krajne currently exposes June 4 / June 12 / July 9 modified-date projections; canonical editorial registry already tracks part of the divergence | `CONFIRMED-CURRENT / EDITORIAL PROJECTION DIVERGENCE; PARTLY ALREADY TRACKED` |
| Editorial freeze guard does not ingest MDX frontmatter, so the third (`updatedAt`) projection is outside its convergence model | `CONFIRMED-CURRENT / EDITORIAL GUARD COVERAGE GAP` |
| Four Heart-series Article JSON-LD graphs omit the recommended Article `image` property although the same routes emit OG/Twitter image metadata | `CONFIRMED-CURRENT / STRUCTURED-DATA COMPLETENESS GAP` |
| Schema audit warns on missing Article image instead of failing, so this class remains green by policy | `SOURCE-CONFIRMED / AUDIT POLICY GAP`, low severity |
| HardTexts eagerly loads `search.js` while Home, Pastor Series, Biografii and SeriesReader owners lazy-load it | `SOURCE-CONFIRMED / PERFORMANCE POLICY DIVERGENCE`, measurement required |
| Older crawler snapshots still expose obsolete Heart-series structure, but current source/data no longer contain it | `STALE EXTERNAL WITNESS / NOT A CURRENT-SOURCE BUG` |

---

# 1. SYSTEM ROOT — emergency scroll unlock does not recognize the current mobile menu owner

## Current shared runtime

`js/site-utils.js` owns the shared body scroll-lock ledger. It also runs a safety timer every 3000 ms:

```js
function startEmergencyTimer() {
  if (!emergencyTimer) emergencyTimer = setInterval(emergencyCheck, 3000);
}

function emergencyCheck() {
  if (!effectiveLocked()) return;
  if (!hasOpenOverlay()) {
    console.warn('[SiteUtils] Emergency unlock ...');
    forceUnlock();
  }
}
```

The purpose is sensible: do not leave the whole document permanently locked after an overlay crashes or disappears.

The problem is the current detector:

```js
function hasOpenOverlay() {
  if (window.OverlayRuntime?.hasLiveLayers?.()) return true;
  return Boolean(
    document.querySelector('.mobile-nav.active, .mobile-nav[aria-hidden="false"]') ||
    document.querySelector('.cp-backdrop.is-open, .cp-panel[aria-hidden="false"]') ||
    ...
  );
}
```

It knows an older `.mobile-nav` family and several modern overlay owners, but it does **not** recognize the current home-v20 menu selector:

```css
.h-mobile-nav.open
```

nor:

```css
.h-mobile-nav[aria-hidden="false"]
```

## Current menu owner

`js/site.js` opens `#hMobileNav` like this:

```text
#hMobileNav.classList.add("open")
#hMobileNav.removeAttribute("aria-hidden")
#hMobileMenuBtn aria-expanded=true
SiteUtils.lockScroll("home-mobile-menu")
```

It does **not** register that menu in `OverlayRuntime`.

Therefore current source yields a deterministic sequence:

```text
open .h-mobile-nav
→ SiteUtils global lock source = "home-mobile-menu"
→ body becomes scroll-locked
→ 3-second emergencyCheck runs
→ OverlayRuntime has no layer for this menu
→ hasOpenOverlay() does not match .h-mobile-nav.open
→ forceUnlock()
→ body scrolling is restored while the menu is still visibly open
```

This is not merely the Wave 10 focus issue. It is a separate shared-state ownership defect: the visual disclosure and the global scroll-lock ledger can disagree after the emergency timer fires.

## Multi-route scope

The same old owner is present on at least:

- `/hard-texts/` — `HardTextsPageChrome.astro`;
- `/pastor-series/` — `PastorSeriesPageChrome.astro`;
- `/biografii/` — native Biografii route/footer chrome;
- current Home also loads the generic owner, but Home layers an additional dedicated mobile-nav accessibility owner on top; it needs a browser witness before assuming identical final behavior there.

That satisfies a system-root threshold: one shared runtime owner plus multiple current route manifestations.

## Test blind spot

`scripts/runtime-integrity-test.js` exercises scroll-lock coordination and OverlayRuntime semantics, but its VM environment replaces `setInterval` with a stub returning an ID. Consequently the real 3-second `emergencyCheck()` path is never executed.

`scripts/overlay-runtime-browser-test.js` deeply tests OverlayRuntime stack/focus/scroll restore, but `.h-mobile-nav` is not an OverlayRuntime layer, so that suite also cannot catch this defect.

**Disposition:**

- `CONFIRMED-CURRENT / SYSTEMIC SHARED RUNTIME ROOT`
- `CONFIRMED-CURRENT / TEST COVERAGE GAP`

### Best regression witness

Use a local production-like build:

1. viewport 390×844;
2. open current `.h-mobile-nav`;
3. assert body locked;
4. keep menu open for >3.2 s;
5. assert body remains locked;
6. verify `SiteUtils` source ledger still contains `home-mobile-menu`;
7. repeat on HardTexts, Pastor Series and Biografii;
8. mutation-test by removing `.h-mobile-nav` from the detector and prove the guard goes red.

---

# 2. Mobile-nav route-family expansion: hidden focus is not HardTexts-only

Wave 10 deliberately proved the Escape→hidden-focus mechanism only on HardTexts and refused to infer a system root from one route.

The current route census now establishes that the same generic `site.js` owner and same `.h-mobile-nav` CSS contract are reused on Pastor Series and Biografii. These legacy chrome implementations render the same basic topology:

```text
burger button
→ .h-mobile-nav
→ .h-mobile-backdrop
→ generic site.js open/close owner
```

The generic close function removes `.open`, makes the panel `aria-hidden=true`, and releases the scroll lock, but it does not restore focus to the opener.

Therefore Wave 10's deterministic Escape lifecycle is a route-family mechanism rather than a HardTexts-only local symptom.

Current Home is a useful negative control: its native Home chrome adds a dedicated mobile-nav accessibility owner with dialog semantics, focus movement/return, inert background handling, breakpoint cleanup, `pageshow` cleanup, and a no-JS fallback. That stronger Home implementation demonstrates that the repository already contains a more complete owner rather than lacking an internal pattern to reuse.

**Disposition:** `CONFIRMED-CURRENT / ROUTE-FAMILY SCOPE EXPANSION`.

Do not multiply one bug row per route. Treat this as one legacy home-v20 mobile-nav owner class.

---

# 3. No-JS mobile navigation is lost on legacy home-v20 landings

This is a separate progressive-enhancement issue, not a claim that every disclosure must be a modal dialog.

At mobile widths `home.css` hides the desktop route list:

```css
@media (max-width:760px) {
  .h-navbar .h-nav-links { display:none!important }
}
```

The mobile panel is closed by default using `visibility:hidden` and `pointer-events:none`; only the `.open` class exposes it. The burger depends on JavaScript to add that class.

On current Home, the native chrome includes an explicit `<noscript><details>...</details></noscript>` navigation fallback.

HardTexts, Pastor Series and Biografii use the old chrome pattern and do not provide an equivalent no-script navigation fallback in the reviewed source.

Therefore with JavaScript unavailable at <=760px:

```text
desktop nav hidden
+ mobile panel hidden
+ burger has no owner
= primary route navigation is unavailable from that chrome
```

The page itself still contains normal content links, so this is **not** “the whole site becomes unusable.” It is specifically loss of the primary navigation mechanism on those landing surfaces.

**Disposition:** `CONFIRMED-CURRENT / PROGRESSIVE-ENHANCEMENT GAP`.

Recommended repair direction is architectural, not route-by-route copy-paste: reuse the canonical Home mobile-nav component/owner or extract a shared owner with a real no-JS fallback.

---

# 4. Reduced-motion gap is broader than the Wave 10 scroll-top button

Wave 10 already confirmed the local JavaScript bypass:

```js
window.scrollTo({ top:0, behavior:'smooth' })
```

instead of the repository's own reduced-motion-aware helper.

Two additional exact-current paths broaden the problem.

## 4.1 Global CSS smooth scrolling has no reduced-motion override

Current `css/site.css` declares globally:

```css
html { scroll-behavior:smooth }
```

A repository search of that exact current stylesheet did not find a corresponding:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto }
}
```

So fragment/anchor scrolling can remain smooth even if individual JavaScript callers are fixed.

## 4.2 Home reduced-motion block reintroduces title movement transitions

`css/home.css` has a substantial `prefers-reduced-motion:reduce` block that correctly disables many animations. But inside that same block it explicitly reassigns transition values to:

```css
.h-title-accent,
.h-title-static
```

and:

```css
.h-title-dash
```

using transform transitions around `.6s`.

Those title elements also have interaction-state transform rules. Thus the “reduce” branch is not fully static for that decorative title motion.

This is a useful negative-control nuance: the site has extensive reduced-motion work; the finding is **not** “reduced motion is ignored everywhere.” The defect is inconsistent coverage across specific global/interactive paths.

W3C technique C39 and SCR40 describe suppressing non-essential interaction-triggered motion when `prefers-reduced-motion` requests it. WCAG 2.3.3 is Level AAA, so this report treats the issue primarily as a Product contract consistency/accessibility-quality defect, reinforced by the fact that the repository has already encoded a reduced-motion-aware scroll helper.

**Disposition:** `CONFIRMED-CURRENT / REDUCED-MOTION COVERAGE GAP`.

---

# 5. SYSTEM CLASS — Pagefind body boundary omits landing main content

This is distinct from Wave 09's annotation-pollution issue inside article bodies.

Pagefind's current documentation states that adding `data-pagefind-body` narrows indexing to the marked body areas; multiple marked bodies may be combined, and `data-pagefind-ignore` may exclude subtrees.

Current legacy-home landings use `data-pagefind-body` only on the hero:

### `/hard-texts/`

`HardTextsPageChrome.astro` marks the hero section as Pagefind body. `HardTextsMain.astro` then renders the substantive book map/cards/stats in a separate `<main>` that has no Pagefind body marker.

### `/pastor-series/`

`PastorSeriesPageChrome.astro` marks only the hero. `PastorSeriesMain.astro` renders the article grid and series content outside that marked body.

### `/biografii/`

The route follows the same hero-body pattern while the biography shelves/era content are rendered in the main content outside that Pagefind body.

Therefore the static Pagefind input for these landings is semantically narrower than the visible landing:

```text
indexed: hero title / hero description
not indexed as page body: rich series map, cards, per-item titles/descriptions, landing-only vocabulary
```

This does not mean child articles are unsearchable. It means a query whose strongest relevance is text in the landing's main map/cards may fail to rank/return the landing itself on that content.

Existing visual-parity audits check native ownership and visible structure but do not enforce Pagefind body coverage for rich landing mains.

**Disposition:**

- `CONFIRMED-CURRENT / STATIC PAGEFIND LANDING CONTENT OMISSION`
- route-family/shared markup class, not three independent bugs.

### Best exact witness

After a production-like build:

1. choose a phrase unique to a HardTexts card/map but absent from the hero and child page title;
2. query Pagefind;
3. inspect whether `/hard-texts/` is returned;
4. repeat on Pastor Series and Biografii;
5. add a source/build guard that proves substantive main content is either inside a Pagefind body or intentionally ignored with an explicit policy marker.

---

# 6. HardTexts “Начать книгу” skips the canonical Prologue

Current canonical book order in `hardTextsSeriesConfig.ts` is built as:

```text
Prologue
→ Chapter I
→ Chapter II
→ Chapter III
→ Chapter IV
→ Reference
```

The landing cards also render `Пролог` first.

But `HardTextsSeriesMapSection.astro` renders the primary start CTA as:

```html
<a href="../articles/krajne-li-isporcheno-serdce/">
  ...
  Начать книгу
  ...
  Глава I · Статья 1 · ~41 мин
</a>
```

So the button's visible promise and its target disagree with the canonical book model:

```text
label: start the book
actual target: first numbered chapter
canonical first book item: Prologue
```

This is not a broken URL. It is an information-architecture/navigation-semantic defect.

Two valid repair directions exist:

1. derive “Начать книгу” from the first canonical non-chapter item, which currently means the Prologue; or
2. if editorial intent is to let readers skip front matter, relabel the CTA truthfully as “Начать с главы I”.

Current HardTexts parity audit verifies page counts/totals/order contracts but does not assert that the primary “start book” CTA resolves to the first canonical book item.

**Disposition:**

- `CONFIRMED-CURRENT / NAVIGATION SEMANTIC DIVERGENCE`
- `AUDIT COVERAGE GAP` for the primary-entry contract.

---

# 7. Krajne has three modified-date projections; only two classes are governed by the editorial freeze model

Current exact source exposes three different modified-date values for the same article:

### Visible body

`KrajneBody.astro`:

```text
Обн. 4 июня 2026
```

### Machine head

`KrajnePageHead.astro`:

```text
article:modified_time ≈ 9 July 2026
JSON-LD dateModified ≈ 9 July 2026
```

### MDX reference frontmatter

`src/content/articles/krajne-li-isporcheno-serdce.mdx`:

```yaml
updatedAt: "2026-06-12T15:14:46+03:00"
```

So the exact-current repository has three distinct editorial projections: June 4, June 12 and July 9.

## Important false-positive cleanup: part of this is already explicitly tracked

`data/editorial-metadata.json` already records the Krajne route as:

```text
reviewStatus = inconsistent-needs-review
editorialModifiedAt = June 4
observed visible modified = June 4
observed meta/jsonLd modified = July 9-ish
```

Therefore it would be wrong to report “the project has no idea these dates disagree.” The canonical registry already knows and marks visible-vs-machine convergence as unresolved.

## New gap: MDX frontmatter is outside the observation model

`scripts/lib/editorial-metadata.js` collects/compares visible candidates, meta, JSON-LD, search, sitemap and RSS projections.

It does not ingest the strict-native route's reference MDX `publishedAt/updatedAt` frontmatter into the record.

Therefore the June 12 projection is neither reconciled nor represented by the current registry's observations.

Because strict-native route ownership may intentionally make MDX reference-only, this report does **not** claim MDX is the display authority. The defect is narrower: a timestamp-bearing source projection exists outside the stated editorial convergence model and can become a future consumer drift source.

**Disposition:**

- `CONFIRMED-CURRENT / EDITORIAL PROJECTION DIVERGENCE`
- `PARTLY ALREADY TRACKED`
- `CONFIRMED-CURRENT / EDITORIAL GUARD COVERAGE GAP` for MDX frontmatter.

---

# 8. Heart-series Article JSON-LD omits `image` on four current routes

The following current routes mount shared `HeartSeriesSocialMeta.astro`:

- `/articles/chto-bibliya-nazyvaet-serdcem/`
- `/articles/novoe-serdce/`
- `/articles/serdce-i-duh/`
- `/articles/serdce-spravochnik/`

That shared component correctly emits:

```text
og:image = https://gospod-bog.ru/images/og-series-heart.webp
og:image:width = 1200
og:image:height = 630
twitter:image = same image
```

However each reviewed PageHead's Article JSON-LD node omits the Article `image` property entirely.

This differs from the Krajne/Romans-style PageHeads, where Article images are explicitly represented in JSON-LD.

Google Search Central currently lists `image` among the recommended Article properties and recommends adding as many applicable recommended properties as practical. Google explicitly says there are no mandatory Article properties for this feature, so this is **not** a critical-schema invalidity and should not be exaggerated as one.

The current schema audit likewise treats a missing Article image as a warning rather than an error. That explains why this class can remain green.

**Disposition:**

- `CONFIRMED-CURRENT / STRUCTURED-DATA COMPLETENESS GAP`
- `SOURCE-CONFIRMED / AUDIT POLICY GAP`, low severity.

A clean repair would project the already-canonical shared Heart-series image into the Article graph from the same owner that supplies OG/Twitter metadata, rather than hardcoding it four times.

---

# 9. HardTexts search loading is an outlier; performance impact still requires measurement

Current Home, current SeriesReader, Pastor Series and Biografii use a lazy search bootstrap: `search.js` is appended only after a search action/event.

Current `HardTextsPageChrome.astro` instead includes `search.js` unconditionally with a deferred script tag.

Therefore HardTexts pays the request/parse/init path on visits where search is never opened, while neighboring current owners already use an interaction-triggered loader.

This is a source-level policy divergence, not yet a measured performance regression. Without a current network trace and CPU/LCP/INP witness, it should not be promoted as “X ms slower” or assigned a high severity based on intuition.

**Disposition:** `SOURCE-CONFIRMED / PERFORMANCE POLICY DIVERGENCE — MEASUREMENT REQUIRED`.

Best witness:

- production-like build;
- cold-cache HardTexts load with and without lazy bootstrap;
- capture search.js request timing, transfer size, parse/eval time, main-thread work, LCP/INP;
- retain the change only if the measured improvement is material and functionality remains identical.

---

# 10. Public crawler mismatch was investigated and deliberately NOT promoted

A public crawler snapshot still exposed an older Heart-series state such as three parts / approximately 53 minutes / planned material.

That looked initially like a severe deploy/content drift. Current-source verification disproved that interpretation:

- current `data/series.json` has the current 39/41/45/38/42/23 core/endpaper times;
- current Heart book config is the modern four-chapter book-shaped model;
- current Home no longer lists the Heart series as a future/planned series;
- current HardTexts audit asserts the expanded current book model.

Therefore the crawler snapshot is an **old external witness**. It may indicate crawler recrawl/cache convergence lag, but it is not evidence that current Product source still publishes the old architecture.

Because this environment lacks a fresh direct production HTTP/Playwright witness, this report does not claim whether the currently deployed origin is fresh or stale.

**Disposition:** `STALE EXTERNAL WITNESS / NOT A CURRENT-SOURCE BUG`.

This cleanup matters: it prevents a noisy false P0 from obscuring the actual current defects above.

---

# 11. Negative controls / things this wave did not turn into bugs

## Article reading width

Current base article layout uses roughly `min(820px, 92vw)` for primary reading surfaces. Source alone does not support a claim that the global article column is absurdly narrow. Perceived density still deserves browser review at 320/390/768/1024/1440, but no source-level width defect is asserted here.

## Reduced-motion is not absent site-wide

Both `site.css` and `home.css` contain many correct reduced-motion suppressions. The current defect is incomplete coverage (global smooth scroll, direct hScrollTop caller, selected title transitions), not total absence of accessibility work.

## Canonical TTS annotation pollution remains closed from Wave 09

Current ReaderProjection and Reader TTS strip tooltip/footnote bodies. Nothing in Wave 11 reopens the earlier false-positive claim that those annotation definitions are currently read aloud by the canonical TTS path.

## Search.js architecture

HardTexts eager loading is a measurement candidate; do not call it a performance failure without a trace.

## Open Product PRs

PR #1543 may strengthen Source Authority trigger closure and PR #1544 may repair historical release witnesses. Neither was merged at publication time, and neither invalidates the exact-current source mechanisms recorded here. If either merges before verification, rerun the affected guard census on fresh `main`.

---

# 12. Recommended next verification package

Highest-value order:

1. **Shared mobile runtime browser guard**
   - HardTexts + Pastor Series + Biografii;
   - open menu, wait through emergency timer, verify scroll remains locked;
   - Escape from inside a menu link, verify visible focus returns to opener;
   - 390 / 760 / 761 boundaries.

2. **Reduced-motion matrix**
   - spy `window.scrollTo` under reduce/no-preference;
   - fragment-anchor test for global `scroll-behavior`;
   - pointer/focus test for Home title motion.

3. **Pagefind production-like index witness**
   - unique landing-main phrase on HardTexts/Pastor/Biografii;
   - annotation-only phrase on Krajne from Wave 09;
   - verify result URL/excerpt/metadata.

4. **HardTexts primary-entry contract**
   - derive expected start route from canonical series config;
   - assert CTA target equals expected first book item or has an intentionally different label.

5. **Editorial projection census**
   - determine whether reference-only MDX date fields are intentionally non-authoritative;
   - if retained, either govern them in editorial metadata freeze or remove misleading projection fields from reference-only sources.

6. **Heart Article image projection**
   - project shared Heart image into Article JSON-LD;
   - optionally upgrade schema guard from silent warning to a targeted route-family contract if the owner wants fail-closed completeness.

7. **Performance measurement**
   - compare HardTexts eager search boot with the site's existing lazy loader pattern;
   - no change purely for aesthetic architectural uniformity without measured benefit.

Until those browser/build witnesses are available, keep this wave in `incoming/`. Do not split the shared mobile/runtime and Pagefind classes into route-by-route duplicate bugs.
