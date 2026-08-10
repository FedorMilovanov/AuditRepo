# Wave 09 — canonical projection, static Pagefind, tooltip keyboard a11y, search semantics, JSON-LD image truth

Date: 2026-08-10
Auditor: ChatGPT
Evidence class: `incoming/raw-current-evidence`

## Anchor / collision boundary

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Exact Product `main`: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- Product open PR census immediately before publication: **0**
- AuditRepo base immediately before publication: `2b128dd24a459aeacb530c4e9fa6121c077fe572`
- Product mutation: **none**
- MASTER mutation: **none**
- WORK_QUEUE mutation: **none**

This is an evidence-only continuation of the browser/source audit marathon. Current repository rules and AuditRepo operating model were reread before the wave. Findings below do not authorize a Product fix by themselves; they are current evidence for later bounded verification/disposition.

## Environment / limitations

The local execution container still cannot resolve `gospod-bog.ru` or `github.com`, so this wave does **not** claim a fresh local Playwright session, fresh pixel screenshot, real pointer click, accessibility-tree capture, or measured live latency. Public web crawler snapshots remain useful only as older historical witnesses and are not treated as current production truth.

This wave instead used:

1. exact-current canonical Product source;
2. strict-native route-owner tracing;
3. current reader/search/tooltip runtime source;
4. current static Pagefind build command and Pagefind primary documentation;
5. W3C ARIA Authoring Practices for tabs/dialog semantics;
6. the current OG image binary itself, decoded at the WebP container/header level;
7. a negative-control sibling route where useful.

## Executive disposition

Wave 09 materially **narrows/corrects** Wave 08 while also finding three new current defects and one current search-index projection divergence:

| Finding | Current disposition |
|---|---|
| Wave 08 claim that Krajne corruption is fundamentally malformed MDX before runtime | `PARTIAL/NARROWED / MECHANISM CORRECTION` |
| Concern that canonical TTS reads glossary/footnote tooltip bodies | `FALSE-POSITIVE / MITIGATED ON CURRENT CANONICAL TTS` |
| Static Pagefind input includes annotation bodies that ReaderProjection strips from semantic search text | `CONFIRMED-CURRENT / STATIC INDEX INPUT DIVERGENCE` |
| Reparented footnote/glossary popups are not keyboard-reachable in a normal Tab sequence once opened from the anchor | `CONFIRMED-CURRENT / A11Y SOURCE-MECHANISM` |
| Search scope controls use tab semantics without implementing a tabs interaction/model | `CONFIRMED-CURRENT / A11Y SEMANTIC ROLE MISUSE` |
| Krajne Article JSON-LD declares the wrong dimensions for its OG image | `CONFIRMED-CURRENT / LOCAL SEO STRUCTURED-DATA` |
| Current schema audit can green-pass the wrong image dimensions | `CONFIRMED-CURRENT / AUDIT COVERAGE GAP` |

No MASTER change is made in this incoming wave. The direct defects are suitable for a bounded verification package; the Pagefind divergence still benefits from one exact built-index/query witness before deciding whether it is a system root or a narrower route problem.

---

## 1. Wave 08 mechanism correction: strict-native Krajne is not simply “bad MDX rendered live”

### Canonical route owner

Current route:

`src/pages/articles/krajne-li-isporcheno-serdce/index.astro`

imports and renders:

`src/components/article-pilots/krajne/KrajneBody.astro`

The canonical strict-native body itself owns:

```html
<article data-pagefind-body>
  <span data-pagefind-meta="image" hidden>/images/og-krajne-isporcheno.webp</span>
  ...
```

and later contains real nested annotation markup such as:

```html
<span class="gterm" tabindex="0">
  шамир
  <span class="gtip">...full definition...</span>
</span>
```

and footnotes such as:

```html
<span class="fn-marker" role="button" tabindex="0" aria-label="Показать сноску">
  1
  <span class="tooltip">Calvin J. ... <a ...>Commentary on Jeremiah</a> ...</span>
</span>
```

Therefore the earlier symptom — annotation/source text living inside the article linear DOM and raw Pagefind metadata living inside the pagefind body — is real on current canonical source. But it is not safe to describe the live mechanism as merely “the MDX was malformed before runtime”. The strict-native rendered component is the current route owner and it intentionally carries the nested annotation structures.

### Negative-control sibling

`/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/` is also strict-native:

`src/pages/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.astro`
→ `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`

It uses the same hidden Pagefind metadata pattern inside `<article data-pagefind-body>`, but its reviewed body is ordinary article prose without Krajne’s dense inline `.gterm/.gtip` and `.fn-marker/.tooltip` content.

**Disposition:** Wave 08 should be read as a valid symptom report with a corrected current mechanism. The root question is now semantic projection of nested annotations/static indexing, not “MDX corruption” as a blanket explanation.

---

## 2. Important false-positive cleanup: canonical TTS strips tooltip and footnote bodies

Previous waves correctly raised the risk that polluted linear DOM might affect TTS, but current exact source provides a stronger answer.

### ReaderProjection is explicitly the semantic owner

`src/components/reader-platform/ReaderActionsRuntime.astro` states that `ReaderProjection` owns article representations used by TTS, speakable metadata, search boundaries, print order, and current-section labels. It loads `reader-projection.js` before the reader consumers.

`src/runtime/reader-projection.js` defines an inline strip policy containing, among other selectors:

```text
.gtip
.fn-marker
.tooltip
.footnote-popup
[hidden]
[data-reader-exclude]
[data-no-speech]
```

`readableText()` clones a candidate element and removes these nodes before text normalization. `getTtsSegments()` and `getSearchText()` use that cleaned projection. `markPolicy()` additionally marks note nodes `data-reader-exclude` and `data-no-speech`.

### TTS has an independent defensive strip too

`src/runtime/reader-tts.js` independently defines `STRIP_INLINE` with:

```text
.gtip
.fn-marker
.tooltip
.footnote-popup
[hidden]
[data-no-speech]
```

and `collectParts()` clones each readable block, removes those nodes, normalizes the remaining text, and only then creates speech chunks.

This is stronger than an assumption based on visible DOM linearization: the canonical TTS owner specifically strips the problem nodes.

**Disposition:** `FALSE-POSITIVE / MITIGATED ON CURRENT CANONICAL TTS` for the earlier statement that Krajne’s tooltip definitions/citation bodies may be read aloud by the current reader TTS. The static/crawler/search projection issue remains separate and is not invalidated by this cleanup.

A true click→first-audible-speech latency measurement remains unperformed and remains a measurement gap, not a defect established by this wave.

---

## 3. Static Pagefind input diverges from runtime ReaderProjection semantics

### Current static source input

Krajne’s canonical `<article data-pagefind-body>` contains `.gtip` definition text and `.tooltip` citation text. Those annotation elements do not carry `data-pagefind-ignore` in the reviewed body.

The Product’s Pagefind builder is:

`scripts/build-pagefind.js`

which invokes Pagefind on the built site approximately as:

```text
pagefind --site <site> --output-path <output>
```

No custom exclusion selector for `.gtip`, `.tooltip`, `.fn-marker`, etc. is supplied there.

### Pagefind primary documentation

Primary docs:

- https://pagefind.app/docs/indexing/
- https://pagefind.app/docs/metadata/

Pagefind documents that `data-pagefind-body` selects the content body to index and `data-pagefind-ignore` excludes individual portions. Its automatic skips are structural/programmatic elements such as navigation/script-like content; arbitrary nested annotation spans are not automatically equivalent to `data-pagefind-ignore`.

The metadata docs also make an important architectural point: `data-pagefind-meta` can be collected as metadata without requiring that the metadata carrier be semantically embedded in the visible article text body.

### Why this is a real divergence

At runtime, `GBReaderProjection.getSearchText()` deliberately strips annotation bodies. Static Pagefind generation does not execute that JS semantic projection; it indexes generated HTML according to Pagefind markup rules.

Thus the Product currently has two different definitions of “searchable reader text” for the same route:

1. **runtime ReaderProjection** → strips `.gtip/.fn-marker/.tooltip`;
2. **static Pagefind input** → receives those nested elements inside `data-pagefind-body` without `data-pagefind-ignore`.

That is a current source/config divergence even without claiming an exact live query result.

### Existing audit blind spot

`scripts/gill-pagefind-body-audit.js` checks that Gill article bodies own `data-pagefind-body`, have minimum word counts, and contain expected semantic markers. It does **not** test that note/glossary/popup annotation text is excluded from Pagefind input, and it is Gill-specific rather than a class-level reader projection guard.

**Disposition:** `CONFIRMED-CURRENT / STATIC INDEX INPUT DIVERGENCE` with an audit blind spot. Before promoting a broad system root, obtain one exact production-like Pagefind witness: query a phrase unique to a Krajne glossary/footnote body and inspect whether the route/result/excerpt is produced from that annotation text.

---

## 4. New current accessibility defect: reparented tooltip internals are keyboard-dead-ended

Current owner:

`src/runtime/article-tooltips.js`

### Mechanism

For `.gterm`, `.fn-marker`, and `.bref[data-ref]` anchors, the controller:

1. initializes the anchor with `tabindex=0` / `role=button` when needed and `aria-expanded=false`;
2. on focus/keyboard/click opens the inline tip;
3. inserts a placeholder where the tip originally lived;
4. **moves the tip to the end of `<body>`** using `document.body.appendChild(tip)`;
5. sets only the anchor open state (`aria-expanded=true`);
6. does not move focus into the popup on desktop;
7. on anchor blur schedules close after 120 ms;
8. keeps the popup open on that close path only if focus actually became the anchor or a descendant of the moved tip.

Krajne footnote tooltips contain real links. Glossary tips may contain a `[data-gtip-expand]` “Подробнее” control. After the tip is reparented to the end of `<body>`, these controls are no longer the next controls in DOM/tab order after the anchor.

Therefore the ordinary keyboard sequence is structurally broken:

```text
focus footnote/glossary anchor
→ popup opens
→ press Tab
→ next tab stop follows article DOM, not the reparented popup
→ anchor blurs
→ close timer fires
→ popup closes before its internal link/expand control is reached
```

On mobile the controller uses `OverlayRuntime` with `trapFocus: false`; that does not create a route from the opener to popup descendants either.

The file also contains no reviewed `aria-controls` or `aria-describedby` ownership connecting anchor and reparented content. That is a semantic weakness, but the stronger finding here is keyboard reachability of actual interactive descendants.

### Coverage blind spot

`scripts/overlay-runtime-browser-test.js` robustly exercises generic nested overlay stack behavior, focus restore, Escape, scroll restoration, pagehide, and reduced motion. It does not cover the article tooltip’s reparent→Tab→internal-control sequence.

**Disposition:** `CONFIRMED-CURRENT / A11Y SOURCE-MECHANISM`. A real browser keyboard witness and accessibility-tree capture should be the next verification step, but the DOM/focus mechanism itself is current and deterministic.

Recommended bounded regression witness:

- desktop 1440 and 768/769 boundary;
- focus a Krajne `.fn-marker` containing an `<a>`;
- open by keyboard;
- press Tab;
- assert focus can enter the popup link before the popup closes;
- repeat for a glossary with `[data-gtip-expand]`;
- repeat mobile sheet mode with external keyboard if feasible.

---

## 5. New current accessibility defect: search scope buttons misuse `tab` semantics

Current `js/search.js` creates:

```html
<div class="cp-scope-chips" role="tablist">
  <button role="tab" aria-selected="true">Все</button>
  <button role="tab" aria-selected="false">Статьи</button>
  <button role="tab" aria-selected="false">Ссылки</button>
  <button role="tab" aria-selected="false">Авторы</button>
</div>
```

These controls are search **scope filters**. Current source does not create associated `tabpanel` elements for them and does not expose `aria-controls` relationships to panels.

Their interaction owner attaches click handlers that update scope/`aria-selected`. There is no Left/Right/Home/End roving-tab keyboard implementation for the tablist. The search dialog focus trap also treats all ordinary buttons as normal Tab stops, so the four faux tabs remain a sequence of ordinary tabbable controls rather than one tab-stop plus arrow navigation.

### Primary ARIA reference

W3C APG Tabs pattern:

https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

The standard tabs model expects a `tablist` containing tabs associated with `tabpanel` content; in the common horizontal pattern, Tab enters the active tab and arrow keys move among tabs. Tabs use relationships such as `aria-controls` / panel `aria-labelledby`.

The current controls are conceptually filters and already behave like buttons. Their ARIA roles promise a tabs widget the implementation does not provide.

**Disposition:** `CONFIRMED-CURRENT / A11Y SEMANTIC ROLE MISUSE`.

Likely repair direction is one of two bounded designs:

1. keep them as filter buttons / an appropriate grouped selection control and remove false tab semantics; or
2. if they truly represent tabs, implement full tab/tabpanel ownership and roving-arrow keyboard behavior.

No Product change is made in this audit.

---

## 6. New exact SEO defect: Krajne JSON-LD image dimensions disagree with the current asset

Current head source:

`src/components/article-pilots/krajne/KrajnePageHead.astro`

For the same URL:

`https://gospod-bog.ru/images/og-krajne-isporcheno.webp`

Open Graph declares:

```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

but the Article JSON-LD declares:

```json
{
  "@type": "ImageObject",
  "url": "https://gospod-bog.ru/images/og-krajne-isporcheno.webp",
  "width": 900,
  "height": 600
}
```

### Binary witness

The current repository binary `images/og-krajne-isporcheno.webp` was fetched from exact Product head. Its WebP/VP8 keyframe header decodes to:

```text
width  = 1200
height = 630
```

Thus Open Graph is consistent with the file and the Article JSON-LD dimensions are objectively stale/wrong.

### Negative control

`src/components/article-pilots/rimlyanam7/Rimlyanam7PageHead.astro` declares 1200×630 for the OG image and also 1200×630 in its Article `ImageObject`, demonstrating that Krajne’s mismatch is local rather than an intentional site-wide metadata convention.

### Existing schema audit blind spot

`scripts/schema-rich-results-audit.js` checks Article required fields, absolute image URLs, Breadcrumbs and FAQ structure, but it does not compare declared image dimensions against:

- the actual image binary; or
- corresponding OG width/height for the same URL.

Therefore the current rich-results audit can green-pass this exact metadata falsity.

**Disposition:**

- `CONFIRMED-CURRENT / LOCAL SEO STRUCTURED-DATA`
- `CONFIRMED-CURRENT / AUDIT COVERAGE GAP`

This is repair-ready evidence at the source/binary level, though it is intentionally left in incoming rather than mutating MASTER during this evidence wave.

---

## 7. What was deliberately NOT promoted in this wave

### Not a current TTS content-pollution bug

Canonical TTS strips annotation bodies; earlier risk is narrowed/closed as above.

### Not a fresh live screenshot conclusion

No new visual claim is called confirmed without a current browser witness. The container’s DNS limitation remains explicit.

### Not a current “series still has three parts” bug

Older public crawler snapshots showing the previous three-part hard-texts wording are stale. Current source has a four-Roman-part model plus prologue/reference bookends. This wave does not use old crawl output as proof of current production state.

### Not a MASTER synchronization transaction

AuditRepo’s operating model says not to turn evidence collection into unnecessary authority-sync/control-plane work. This wave adds only a unique incoming report.

---

## 8. Highest-value next verification sequence

1. **Pagefind semantic witness** — production-like build; query a phrase existing only inside a Krajne `.gtip` or `.tooltip`; inspect route hit + result excerpt. This determines whether the current divergence is an actual user-facing search contamination and whether it should become a shared semantic-projection root.
2. **Tooltip keyboard browser witness** — keyboard-only focus/open/Tab for footnote link and glossary expand control at desktop and mobile/breakpoint modes; capture accessibility tree before/after reparent.
3. **Search scope keyboard witness** — inspect accessibility tree roles and prove current tablist has four sequential Tab stops and no tabpanel/arrow model; then define the intended control semantics.
4. **JSON-LD asset-truth regression** — add a verification that maps local Article ImageObject URLs to asset binary dimensions (and, where present, OG dimensions) so wrong structured-data dimensions cannot green-pass.
5. **Return to visual marathon** when a genuine browser network path is available: 761/768/769/800/820/860 narrow-nav pixel/bounding-box sweep remains high value, as do full-page screenshots and measured TTS/search latency.

## Final wave status

Wave 09 both reduced noise and increased confidence:

- one prior TTS concern is closed as a current false-positive;
- one prior mechanism is corrected without discarding its valid symptom;
- one current static-search semantic divergence is established;
- two independent accessibility defects are established at current source-mechanism level;
- one exact structured-data defect is proven against the image binary itself;
- two audit blind spots are identified without adding speculative Product work.

No Product source was changed.