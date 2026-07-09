# Source Evidence Index — Hermeneutics UI — 2026-07-09

## Audited source state

- Repository: `FedorMilovanov/gb-is-my-strength`
- Branch: `main`
- SHA: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- Route mode: `strict-native`
- Audit angle: source contracts and deterministic CSS/DOM/runtime interactions

## Remote-state evidence

- Current source `main` inspected.
- Current source open PR list inspected: only Gill-image work was open; no Hermeneutics branch/PR overlap.
- Current AuditRepo `main` and all open AuditRepo PRs inspected: open work was Gill-only.
- Cached/deleted historical Hermeneutics lane names were not treated as active branches when GitHub ref resolution failed.

## HERM-UI-001 — nested Bible controls in footnotes

### Source markup examples

`src/components/article-pilots/hermenevtika/HermenevtikaBody.astro` contains active `button.bref[data-ref]` descendants inside `.fn-marker > .tooltip` for at least:

- footnote 40 — `2 Царств 12:11–14`;
- footnote 72 — `Луки 24:24–26`;
- footnote 75 — `Ефесянам 1:21–23`, `Ефесянам 1:10`;
- footnote 82 — `Римлянам 3:10–18`, `Галатам 3:6–11`;
- footnote 83 — long multi-reference chain;
- footnote 107 — Isaiah/Psalms/Daniel/Luke references.

Representative structure:

```html
<span class="fn-marker" role="button" tabindex="0">
  40
  <span class="tooltip">
    ... <button class="bref" data-ref="2 Царств 12:11–14">...</button> ...
  </span>
</span>
```

### Shared runtime chain

`js/site.js`:

```js
document.querySelectorAll('.bref[data-ref]').forEach(...)
makeTooltipController('.bref[data-ref]', '.btip', ...)
makeTooltipController('.fn-marker', '.tooltip', ...)
```

No descendant exclusion is applied for `.fn-marker .tooltip .bref[data-ref]`.

`js/site-utils.js` tooltip controller open path closes other active tooltip controllers before opening the requested controller. Therefore nested Bible trigger activation competes with and closes the parent footnote controller.

### Semantic predicate

```js
document.querySelectorAll('.fn-marker .tooltip .bref[data-ref]').length > 0
```

Preferred post-fix predicate:

```js
document.querySelectorAll('.fn-marker .tooltip .bref[data-ref]').length === 0
```

## HERM-UI-002 — 1200 px breakpoint seam

`HermenevtikaRail.astro`:

```css
@media(max-width:1200px){ .hrail{display:none} }
@media(min-width:1200px){
  .article-main.article-main--hrail { margin-left: ... }
}
```

`HermenevtikaMobileBar.astro`:

```css
@media(max-width:1199px){ .hmtop{display:flex} .hmbar{display:flex} }
@media(min-width:1200px){ .hmtop, .hmbar{display:none !important} }
```

`css/floating-cluster.css`:

```css
@media(max-width:1199px){ .gb-floater--hermeneutics{display:none} }
```

At 1200 px the rail and mobile bars are both hidden while desktop article offset applies.

## HERM-UI-003/004/006 — mobile dialog lifecycle

`HermenevtikaMobileBar.astro` open/close logic:

```js
const openSheet = () => {
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};
const closeSheet = () => {
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};
```

No opener storage, initial focus, focus trap, background inerting or focus return is present.

Top search opens the sheet while keeping focus in `#hmTocSearch`:

```js
topSearchInput?.addEventListener('input', () => {
  filterToc(topSearchInput.value);
  if (topSearchInput.value.trim()) openSheet();
});
```

The sheet contains a separate `#hmSheetSearch` input.

CSS lifecycle:

```css
.hmsheet{display:none}
.hmsheet.is-open{display:block}
.hmsheet-panel{transform:translateY(100%);transition:transform .3s ...}
.hmsheet.is-open .hmsheet-panel{transform:translateY(0)}
```

Removing `is-open` immediately applies `display:none`, preventing a visible exit transition.

## HERM-UI-005 — progress scope

`HermenevtikaMobileBar.astro`:

```js
const docH = document.documentElement.scrollHeight - window.innerHeight;
const pct = docH > 0
  ? Math.round((window.scrollY / docH) * 100)
  : 0;
```

`HermenevtikaBody.astro` continues below `</article>` with `.gb-accuracy-block`, `.related-articles`, `.article-end-block` and `footer`, so the progress denominator includes non-article content.

## HERM-UI-007 — invalid list child

`HermenevtikaRail.astro`:

```html
<ul class="hrail-toc" id="hrailToc">
  <span class="hrail-track" aria-hidden="true"><i></i></span>
  <!-- mapped li elements -->
</ul>
```

The decorative track is a direct non-`li` child of the list.

## HERM-UI-008 — contract comments drift

Current CSS in `css/floating-cluster.css` says and implements:

```css
/* HermenevtikaRail top bar: Play's speed pill blooms DOWN */
.hrail-top .gb-ember-expand {
  top: calc(100% + 9px);
  bottom: auto;
}
```

Stale component comments claim the rail Play blooms UP. Other stale comments claim the Hermeneutics floating cluster contains search/Play/save although `SingleArticleCluster.astro` omits them for `variant="hermeneutics"`, and claim the mobile top search is sitewide although current markup implements local TOC filtering.

## HERM-UI-009 — date mismatch

`HermenevtikaBody.astro` visible byline:

```html
Обн. <time class="article-updated" datetime="2026-05-09">9 мая 2026</time>
```

`HermenevtikaPageHead.astro` machine metadata inspected on the same SHA reports a 2026-07-09 modification value. Project owner invariants prohibit technical UI/CSS/JS work from silently changing editorial freshness.

## HERM-UI-010 — feature flag drift

`HermenevtikaPageHead.astro`:

```js
features: {
  footnotes: { enabled: false }
}
```

The body contains active `.fn-marker` elements and `site.js` initializes them independently.

## Cross-verification still required

- production-like strangler build;
- browser pointer/touch/keyboard traces;
- screenshots at 1199/1200/1201 px;
- accessibility tree / axe pass;
- nested overlay scroll-lock test;
- sitemap/date metadata reconciliation.