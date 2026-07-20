# Deep audit and professional MAIN closure — Hermeneutics — 2026-07-09

> Status: source-audit expansion for AuditRepo PR #7. This document is a repair architecture, not a claim that browser/build verification has already run.

## 1. Current source state

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Current audited `main`: `2313f36f6aeaf7415e85d5e353e7e4cd10222ece`
- Route: `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Route owner: Astro, `production-dist`, `strict-native`
- Primary owner-reproduced bug: active Scripture controls inside footnote popovers (`#53` in source repository)
- Existing AuditRepo intake: `HERM-UI-001..011`

## 2. Executive conclusion

The route should not be “fixed in MAIN” by editing every existing copy. The route currently has three competing article representations:

1. actual production render source: `HermenevtikaBody.astro`;
2. declared MDX representation: `src/content/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki.mdx`;
3. root legacy HTML baseline: `articles/.../index.html`.

The route profile says `hasMDX: true`, but the Astro page imports `HermenevtikaPageHead` and `HermenevtikaBody`, not the MDX file. The MDX/HTML parity guard compares MDX to root legacy HTML and never compares either one to the rendered Astro body. The generic article-shadow audit still describes root legacy HTML as production truth even though `page-ownership.json` says production deploy serves Astro/strangler `dist` and explicitly marks this route Astro-owned.

Therefore a UI-only patch can pass current generic audits while:

- modifying only the real Astro body;
- leaving stale MDX and root HTML behind;
- continuing to derive metadata/search baselines from stale copies;
- reintroducing drift on a later automated update.

Professional closure requires one declared canonical source and generated/verified projections.

## 3. New deep findings

### HERM-ARCH-001 — Three competing content sources and a false parity graph

- Proposed severity: P1 architecture/publication integrity.
- Current render source: `HermenevtikaBody.astro`.
- Route profile simultaneously declares `hasMDX: true` and an MDX path.
- `check-mdx-html-parity.js` compares MDX to root legacy HTML only.
- `article-mdx-pilot-audit.js` uses root legacy facts as the baseline for production `dist`.
- `check-content-source-coverage.js` has an explicit TODO to add `contentSourceMode` and `renderSource`; it currently proves existence/mapping, not actual render provenance.
- Current consequence: all three files can disagree while the production route remains “green”.

Preferred immediate decision:

- declare `HermenevtikaBody.astro` the canonical content source for the current strict-native route;
- set route profile fields such as:
  - `contentSourceMode: "astro-native"`;
  - `renderSource: "src/components/article-pilots/hermenevtika/HermenevtikaBody.astro"`;
  - `metadataSource: <one explicit route metadata file>`;
  - `hasMDX: false` until MDX truly renders the public route;
- remove this route from MDX↔legacy parity pairs or change the guard to compare the declared canonical source to production-like `dist`;
- keep the old MDX/root HTML only as explicitly named frozen migration references, or delete/archive them after a verified content ledger is produced.

Do not attempt a full 10,000-word MDX rewrite inside the UI bug lane. The existing MDX is a flattened migration representation and is not ready to become canonical without a separate semantic-content project.

### HERM-META-001 — Publication and modification truth is fragmented across at least five stores

Proposed severity: P1 metadata/editorial truth.

Observed values:

- visible article publication: `13 апреля 2026`;
- visible article update: `9 мая 2026`;
- Open Graph/JSON-LD page `datePublished`: `2016-09-01`;
- Open Graph/JSON-LD page `dateModified`: auto-bumped to `2026-07-09T02:34:58+03:00`;
- MDX `publishedAt`: `2016-09-01`;
- MDX `updatedAt`: `2026-06-12`;
- search manifest `publishedTime`: `2016-09-01`;
- search manifest `modifiedTime`: `2026-05-21`;
- sitemap `lastmod`: `2026-07-09T02:34:58+03:00`.

The 2016 date belongs to the English original journal work, not to the Russian translated web publication. The JSON-LD already has `isBasedOn` and `translationOfWork`, so the original date can live there without misrepresenting the current page.

Required owner/editorial decision:

- translated page `datePublished`: use the truthful Russian publication date (the visible source currently says 2026-04-13);
- translated page `dateModified`: use the last substantive editorial revision date (visible source currently says 2026-05-09 unless a later editorial change is documented);
- original work `datePublished`: keep 2016 under `translationOfWork` / `isBasedOn`;
- technical rebuild/cache-bust timestamp: never overwrite editorial `dateModified`;
- sitemap `lastmod`: follow the same substantive-content policy, not every technical UI/cache update.

All visible, OG, JSON-LD, search-manifest and sitemap values should be generated or asserted from one canonical metadata record.

### HERM-META-002 — `hreflang="en"` points to a whole-journal PDF, not an equivalent alternate page

Proposed severity: P2 SEO contract.

The page declares the TMSJ volume PDF as an English `rel="alternate" hreflang="en"`. The URL is a complete journal issue rather than a language-equivalent page for this exact Russian route.

Preferred repair:

- remove the `hreflang="en"` alternate unless an equivalent English landing/article URL exists;
- retain the PDF as a normal source/citation link;
- optionally expose it through scholarly citation metadata (`citation_pdf_url`) or `rel="alternate" type="application/pdf"` without hreflang, after confirming desired crawler behavior.

### HERM-PERF-001 — High-priority preload appears to fetch a non-visible preview image

Proposed severity: P2 performance, pending production-like network confirmation.

`HermenevtikaPageHead.astro` preloads `hermenevtika-preview.webp` with `fetchpriority="high"`. The actual article header has no visible hero image; that preview path is used as hidden Pagefind/search metadata while the social image is a different `og-hermenevtika...webp` file.

Preferred repair:

- remove the high-priority preload if the image is not painted above the fold;
- or render the exact preloaded image as the approved visible LCP asset;
- verify with a production-like network trace that no unused high-priority request remains.

### HERM-UI-012 — Back controls are JavaScript-only and semantically mislabel their destination

Proposed severity: P2 resilience/accessibility.

Desktop and mobile bars render a `<button aria-label="Назад" data-home-href="../../">` and navigate only through a component script. The fixed destination resolves to the site root, not browser history and not necessarily the articles catalog.

Impact:

- navigation is dead if component JS fails;
- assistive technology hears “Back” while the actual action is “Home”;
- opening in a new tab/copying the destination is impossible.

Preferred repair:

- use a real `<a href="../../">` with a truthful label such as “На главную”; or
- implement a genuine history-back control with an explicit same-origin fallback link, if “Назад” is the approved behavior.

### HERM-UI-013 — Scrollspy invents a current section before the first heading and leaks the last section beyond article content

Proposed severity: P2 UX/accessibility.

Both mobile and desktop initialize `idx = 0`, so the rail says `1 / 10` and the bottom bar says “Герменевтические определения” while the reader is still in breadcrumbs, legal notice, title, summary and introduction.

After the final configured TOC heading, the last entry remains current through quiz/editor/related/footer content. The mobile list toggles only a CSS class and does not update `aria-current`.

Preferred repair:

- define an explicit intro state before the first TOC target, or show “Введение” as a real navigable item;
- define an article-end boundary so section state does not bleed into unrelated content;
- update `aria-current="location"` on the active TOC link;
- clear it when no configured content section is active;
- use one shared observer/range calculation for desktop and mobile.

### HERM-READER-001 — Whole-document progress is duplicated across three systems

This is the deeper root cause behind initial `HERM-UI-005`; proposed severity remains P2 but repair ownership becomes SYSTEM-level.

Whole-document formulas exist in:

- `HermenevtikaMobileBar` progress/time-left;
- `BookmarkEngine` saved progress/completion;
- desktop rail final-section track calculation.

The article ends before feedback, related articles, SDG and footer. Consequently:

- the article can be fully read while progress is below 100%;
- bookmark completion can depend on scrolling unrelated cards/footer;
- “time left” includes non-article chrome;
- desktop and mobile may disagree because each has its own formula.

Preferred repair:

Create one shared reading-range contract, for example:

```text
articleStart = explicit article start anchor
articleEnd   = explicit article end anchor
readingLine  = viewport reading line after sticky chrome offset
progress     = clamp((readingLine - articleStart) / (articleEnd - articleStart), 0, 1)
```

Expose it through a shared utility or reader service and consume it from:

- BookmarkEngine;
- Hermeneutics mobile progress/time-left;
- Hermeneutics rail track;
- later article controls that currently use document height.

Do not patch the three formulas independently.

### HERM-READER-002 — Speakable, visible summary and custom TTS use different reader projections

Proposed severity: P2 content accessibility.

- JSON-LD `speakable` includes `.summary-card` and `[data-speakable]`.
- The custom TTS extractor explicitly excludes `.summary-card`.
- TTS selects `p, h2, h3, li`, so tables/H4 are absent and FAQ question/answer structure is only partially represented.
- The TOC is a separate hand-maintained projection.

Preferred repair:

- define explicit semantic reader markers, e.g. `data-reader-include`, `data-reader-exclude`, `data-reader-section`;
- generate TTS text, speakable selectors, search extraction and TOC from the same declared article structure where feasible;
- at minimum align the approved summary policy: either the summary is reader/speakable content everywhere or intentionally excluded everywhere with documentation.

### HERM-UI-014 — Play retains obsolete popup ARIA after the custom slot-swap migration

This extends `HERM-UI-011`; proposed severity P2 accessibility.

`PlayEmber` always renders:

- `aria-haspopup="true"`;
- `aria-expanded="false"`.

The current Hermeneutics rail/mobile surfaces no longer use the canonical bloom popup. A separate speed badge opens a search⇄speed slot, but neither Play nor the badge synchronizes `aria-controls` / `aria-expanded` with the speed rail.

Preferred repair:

- make popup semantics an explicit `PlayEmber` mode/prop rather than an unconditional default;
- custom slot surfaces should remove popup semantics from Play;
- the actual speed opener (badge or approved control) should own `aria-controls` and synchronized `aria-expanded`;
- inactive slot layer must be inert/hidden and removed from Tab order;
- radiogroup uses roving tabindex and arrow keys.

### HERM-DATA-001 — Favorite metadata derives the section from the wrong breadcrumb

Proposed severity: P2 data-quality/UI.

The favorite engine obtains `meta.section` from `.breadcrumb__link:last-of-type`. On this route that link is “Публикации”; the actual current-page topic is a non-link span, while other stores say “Переводы” or “Герменевтика”.

Result: saving the article can classify it as “Публикации”, losing the meaningful topic/type.

Preferred repair:

- define canonical page metadata fields rather than scraping breadcrumb presentation:
  - `contentType: translation`;
  - `category: Hermeneutics` / display `Герменевтика`;
  - optional library section `Переводы`;
- favorite/search/Pagefind/OG consumers read that record;
- breadcrumb remains navigation, not a database API.

### HERM-AUDIT-001 — Existing green gates do not exercise the route's real UI contract

Proposed severity: P1 release integrity.

Current generic checks can validate:

- ownership/profile existence;
- title/basic metadata parity with root legacy;
- word-count/H2 tolerance;
- static publication.

They do not catch:

- nested active Scripture controls inside footnotes;
- the 1200px dead zone;
- modal focus/scroll lock;
- hidden speed controls in Tab order;
- article-range progress;
- broken back/print controls;
- duplicate/invalid interactive semantics;
- stale CSP/metadata projections;
- actual current render source versus declared MDX source.

A route-specific source audit and browser smoke are required before declaring the route ideal.

## 4. Chosen canonical architecture for a safe MAIN closure

### Immediate canonical source

Use the source that actually renders production today:

```text
HermenevtikaBody.astro = canonical article body
HermenevtikaPageHead.astro or one extracted metadata object = canonical head projection
hermenevtikaToc.ts = generated/validated navigation projection
```

The MDX file must not remain falsely labeled canonical. A future MDX-native rewrite can be a separate owner-approved semantic project, not part of this bug closure.

### Canonical metadata record

Create one route metadata record containing at minimum:

- canonical URL;
- page title/H1;
- Russian publication date;
- Russian substantive modification date;
- original work publication date;
- author/translator/editor;
- content type/category/section;
- description/tags;
- read time/word count;
- social/search image;
- source PDF URL.

Generate or assert:

- visible byline;
- Open Graph/Twitter;
- JSON-LD;
- search manifest;
- Pagefind metadata;
- sitemap `lastmod` and image;
- favorites metadata.

## 5. Atomic PR plan

### PR 0 — Source ownership correction (no visual change)

Proposed branch:

`lane/hermenevtika-source-contract-2026-07-09`

Files:

- route profile;
- content-source coverage check;
- MDX/HTML/article audit configuration;
- lane report.

Changes:

1. Declare Astro body as current canonical render/content source.
2. Set `hasMDX:false` or equivalent non-canonical status.
3. Stop comparing this route's production output to two stale representations as truth.
4. Add a current canonical-source→dist content/heading assertion.
5. Preserve legacy files only as clearly frozen migration evidence if still needed.

Merge gate: no public output change; all existing production-like checks remain green.

### PR 1 — Route-local semantic/UI repair

Proposed branch:

`lane/hermenevtika-route-ui-hardening-2026-07-09`

Allowed files:

- Hermeneutics Body/Rail/MobileBar/TOC route components;
- route-specific audit/smoke files;
- route lane report.

Changes:

1. Convert nested Scripture controls in footnotes 40/72/75/82/83/107 to static text.
2. Make back navigation semantic and truthful.
3. Repair 1200px boundary.
4. Move rail track outside `<ul>` or make it a pseudo-element.
5. Implement modal focus entry/trap/return, inert background and transition-safe close.
6. Use one synchronized TOC search state.
7. Add opener `aria-controls`/`aria-expanded` and active-link `aria-current`.
8. Add intro/end scrollspy states.
9. Remove stale comments.
10. Remove unused image preload if network verification confirms it is not rendered.

Forbidden:

- shared `site.js`, `site-utils.js`, BookmarkEngine, TTS engine;
- Gill/Nagornaya components;
- editorial text/date changes beyond explicit metadata decision.

### PR 2 — Shared speed-slot accessibility

Proposed branch:

`lane/system-speed-slot-a11y-2026-07-09`

Files:

- `_shared/speedSlot.ts`;
- `PlayEmber.astro` only through a backward-compatible explicit mode;
- all direct consumer tests and required minimal consumer markup changes.

Verify all direct consumers:

- Hermeneutics desktop rail;
- Hermeneutics mobile top bar;
- Gill desktop rail;
- Gill mobile bar.

Required behavior:

- only active slot layer is exposed/focusable;
- one radio Tab stop;
- arrows/Home/End/Space/Enter/Escape work;
- auto-close never strands focus on hidden content;
- Play popup ARIA is truthful;
- badge/opening control owns `aria-controls` and expanded state.

### PR 3 — Shared reading-range service

Proposed branch:

`lane/system-article-reading-range-2026-07-09`

Files:

- shared SiteUtils/reader utility source;
- BookmarkEngine source/projection;
- Hermeneutics consumers;
- shared tests;
- cache-bust projections required by repository policy.

Changes:

1. Introduce explicit article start/end range.
2. Migrate mobile progress/time-left.
3. Migrate bookmark saved/completed progress.
4. Migrate desktop rail final fill.
5. Test short/long articles and content below article.

### PR 4 — Metadata truth and generated projections

Proposed branch:

`lane/hermenevtika-metadata-truth-2026-07-09`

Changes:

1. Apply owner-approved Russian publication/update dates.
2. Keep 2016 only for the original work.
3. Remove invalid English hreflang PDF relation.
4. Introduce canonical category/type metadata.
5. Synchronize PageHead, body, MDX disposition, search manifest, Pagefind, sitemap and favorite payload.
6. Stop technical cache-bust commits from advancing editorial freshness.
7. Add an audit that fails on cross-store date/title/category drift.

### PR 5 — Reader projection and final route smoke

Proposed branch:

`lane/hermenevtika-reader-projection-final-2026-07-09`

Changes:

- align summary/TTS/speakable/search policy;
- add route-specific production-like browser smoke;
- close remaining browser-only findings;
- no new visual redesign.

## 6. Required source assertions

At minimum:

```js
// no nested active content inside footnotes
assert(qsa('.fn-marker .tooltip .bref[data-ref]').length === 0)
assert(qsa('.fn-marker .tooltip button, .fn-marker .tooltip a, .fn-marker .tooltip [tabindex], .fn-marker .tooltip [role="button"]').length === 0)

// structure
assert(allTocHrefsResolveExactlyOnce())
assert(noDuplicateIds())
assert(allAriaControlsResolve())
assert(ulDirectChildrenAreLi())

// source contract
assert(routeProfile.renderSource === actualImportedBody)
assert(!routeProfile.hasMDX || publicRouteActuallyImportsMdx)

// metadata truth
assert(visiblePublished === ogPublished === jsonLdPublished === searchPublished)
assert(visibleModified === ogModified === jsonLdModified === searchModified === sitemapLastmodPolicyValue)
assert(originalWorkPublished !== translatedPagePublished)
```

## 7. Required browser matrix

Viewports:

- 320, 360, 390;
- 768;
- 1199, 1200, 1201;
- 1366, 1440;
- DPR 1 and 2 where practical.

Browsers:

- Chromium;
- Firefox;
- WebKit/Safari-equivalent.

Interaction traces:

1. Open every affected footnote by pointer, keyboard and touch; traverse all static citation text without closing it.
2. Verify ordinary body/FAQ Bible references still open.
3. Open/close TOC by every opener; Tab/Shift+Tab/Escape; focus returns to exact opener.
4. Open another lock-owning overlay and TOC in both orders; background never unlocks early.
5. Search from top bar and sheet; one query/state; zero-result recovery.
6. Speed slot keyboard and pointer drag; auto-close does not lose focus.
7. Start/pause/resume/change speed/complete TTS; Web Speech fallback; no duplicate player.
8. Save/unsave from desktop/mobile/sheet; all controls synchronize; favorite category is correct.
9. Scroll from introduction through article end; current section and progress are truthful.
10. At article end progress is 100% before related/footer content and remains 100% below.
11. Print/PDF: fixed chrome, overlays, tooltips and controls do not print; article/source/footnotes remain usable.
12. Theme, reduced motion, 200% zoom and keyboard-only smoke.
13. No-JS smoke: article and semantic navigation remain readable; no dead button is the sole route out.
14. No console errors, unhandled rejections, duplicate IDs or failed critical requests.

## 8. Command barrier before each merge

Fast lane loop:

```bash
git diff --check
npm run astro:check
npm run migration:metadata:check:strict
npm run native:runtime:audit:strict
npm run data:consistency
npm run content:guard
npm run guard:shared-files
```

Production-like barrier:

```bash
npm run strangler:build:production-like
npm run pagefind:build
npm run contract:compare:dist
npm run validate:static-publication:light
npm run article:mdx:audit:strict   # after correcting its route contract
npm run visual:parity:guard
npm run workflows:check
```

Add and run a dedicated command such as:

```bash
npm run audit:hermenevtika
npm run smoke:hermenevtika
```

The route must not be merged based solely on generic static validation.

## 9. MAIN merge discipline

- Never push these repairs directly to `main`.
- Each PR starts from the latest `origin/main` and declares its file ownership.
- Rebase/reverify if `main` moves; do not rely on an old green run.
- Use squash merge for each atomic lane.
- Bot-generated cache-bust/meta update runs only after the functional commit, then the final head is rechecked.
- Do not merge PR 3/4 while another shared SiteUtils/Bookmark/metadata lane owns the same files.
- Close issue #53 only after production-like pointer/keyboard/touch evidence.
- AuditRepo findings move to verified/fixed only after independent current-head verification.

## 10. Definition of “closed professionally”

The route is closed only when all of the following are true:

1. One declared canonical body source feeds production.
2. One canonical metadata record feeds all projections.
3. No active nested controls exist inside footnote popovers.
4. There is no viewport width with missing control surfaces.
5. Modal, speed slot and TOC are keyboard/screen-reader coherent.
6. Reading progress/bookmarks stop at article end.
7. TTS/speakable/search policy is explicit and tested.
8. Back/save/search/print retain truthful semantic behavior.
9. Root legacy/MDX cannot silently override or bless stale production data.
10. Production-like build and multi-browser route smoke are green on the exact merge head.
