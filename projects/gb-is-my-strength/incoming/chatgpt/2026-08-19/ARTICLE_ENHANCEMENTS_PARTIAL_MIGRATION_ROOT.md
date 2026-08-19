# ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT

> Filename retained for branch/link stability. The evidence now proves a broader legacy-capability migration root spanning both `enhancements.js` and `site.js`, not only one retired bundle.

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product systemic interaction regression + audit-harness coverage gap
- Proof state: current source/composition + unique-consumer census + two independent migration-origin commits
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Freshness: Product later advanced to `01894214765d7ab6e51a7eea1fb7f239c6591af8` only through `scripts/css-layer-validator.js`; the interaction owners below did not change.
- Primary strict-native routes proving the migration boundary:
  - `/articles/20-antisovetov-pastoru/`
  - `/articles/krajne-li-isporcheno-serdce/`
- Additional series-native heading-anchor configuration witnesses: Diotrophes + five Gill surfaces.
- Product mutation: none
- MASTER mutation: none
- Suggested themes: `ST-RUNTIME-OWNERSHIP`, `ST-STRANGLER`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## System root

The shared series migration correctly retired broad legacy runtime ownership in favor of native article modules, but the migration did **not inventory and re-home every retained feature owned by the removed legacy scripts**.

The current native stack explicitly owns:

- inline article tooltips;
- article quiz;
- article image viewer;
- reader/TTS/control projection through `ReaderActionsRuntime`;
- share through the native reader-actions owner;
- bookmarks/favorite persistence through the native bookmark/favorite owner.

However, retained markup/config/data still declares capabilities whose only behavioral owners lived in scripts removed by the series migration:

1. Antisovetov strategic-map popovers — legacy `enhancements.js` owner;
2. FAQ accordion state/height interaction on Antisovetov and Krajne — legacy `enhancements.js` owner;
3. heading-anchor copy controls on series-native pages that still explicitly set `features.headingAnchors.enabled=true` — legacy `site.js` owner.

This is not a request to restore the old monoliths. The systemic defect is **partial capability migration without a capability-completeness oracle**.

## Shared native owner boundary

The two primary affected pages are current production Astro owners and mount the shared native series runtime:

```text
AntisovetovBody / KrajneBody
        ↓
SeriesReaderChrome
        ↓
GillSeriesChrome
        ↓
ReaderActionsRuntime
        ↓
article-interactions.js
        ↓
tooltips + quiz + image viewer
```

`GillSeriesChrome` contains an explicit ownership decision that the broad legacy enhancements bundle is absent because loading both old and native owners recreated reader controls and competed for glossary/quiz state. That retirement decision is sound for duplicated capabilities. The defect is that legacy scripts contained a **heterogeneous capability set**, and not every still-declared/visible capability received a native successor.

A current tree search finds:

- no `.faq-accordion__q` behavior under `src/runtime/**`, reader-platform or the shared series runtime;
- no native `strategicMapData` consumer;
- no native `headingAnchors` / `.heading-anchor` / `anchor-copy-toast` owner under the shared series runtime.

## Manifestation A — Antisovetov strategic map

See companion evidence `ANTISOVETOV_STRATEGIC_MAP_RUNTIME_ORPHAN.md`.

Current Antisovetov retains:

- 39 `.map-trigger` elements;
- 36 distinct `data-tip` identities;
- 36 matching `#strategicMapData` records;
- interactive affordance (`role="button"`, `tabindex="0"`, cursor/underline styling).

The only current-equivalent source implementation that parses `#strategicMapData`, creates `.singleton-popover`, populates records and attaches trigger activation is legacy `js/enhancements.js`.

The canonical native article modules have no equivalent owner.

### Exact migration boundary

Product commit `3f199e9bb4cf2741e7db2c94ea6aa7345932c6c7` migrated Antisovetov to the shared series engine. Its own message records:

```text
AntisovetovBody: ... 9 хром-скриптов [removed]; сохранены strategicMapData и bookmark-toast.
```

The diff removes the legacy behavior scripts while preserving `strategicMapData`.

This is a direct data-carrier-without-behavioral-owner migration error.

## Manifestation B — FAQ accordion interaction

Legacy `js/enhancements.js` owns `.faq-accordion__q` behavior. It:

- marks accordion containers enhanced;
- listens to each `.faq-accordion__q` click;
- toggles `.is-open` / `.open`;
- synchronizes `aria-expanded`;
- computes/animates body `max-height`;
- recalculates open heights on resize.

The current native article interaction stack contains no FAQ-accordion owner.

### Current affected markup

Current source census:

| Route | FAQ buttons | Current chrome | `enhancements.js` through current owner? |
|---|---:|---|---|
| Antisovetov | 14 | `SeriesReaderChrome` | **No** |
| Krajne | 3 | `SeriesReaderChrome` | **No** |
| Hermenevtika | 3 | standalone/pilot runtime | Yes |
| Kod Da Vinci | 8 | standalone footer runtime | Yes |

The latter two are useful negative controls: the legacy owner still exists there, so the finding is not “all FAQs are broken.” The failure boundary follows the series-native migration.

### Why the missing owner is reader-visible

The FAQ surface is not an always-open semantic list whose JavaScript merely adds polish.

Global/current CSS makes a not-open FAQ body non-interactive and collapsed:

```css
.faq-accordion__item:not(.open):not(.is-open) .faq-accordion__body {
  max-height: 0;
  grid-template-rows: 0fr;
  overflow: hidden;
  pointer-events: none;
}
```

Antisovetov additionally carries page-level CSS:

```css
.faq-accordion__body {
  max-height: 0;
  overflow: hidden;
  ...
}
```

Without the missing behavior owner, clicking the real `<button>` does not add the open state and does not update `aria-expanded`; the reader-visible answer remains collapsed.

This is therefore a functional interaction regression, not only a source ownership smell.

### Independent Krajne migration boundary

Product commit `8d02f3339866688eda5b675fdee42f109d7741af` migrated Krajne to the same series engine. Its message says the legacy GBS2 chrome / duplicate scripts were replaced with `GillSeriesChrome`; the diff explicitly removes the legacy enhancements owner.

Thus the same capability loss occurred independently on a second route while the shared chrome became the canonical owner.

## Manifestation C — enabled heading-anchor copy feature without its owner

The same migration incompleteness crosses a **second retired legacy script**, `site.js`.

`site.js` is the current legacy implementation of `features.headingAnchors`. When the feature is not disabled, it:

- scans `h2[id], h3[id], h4[id]`;
- injects an `<a class="heading-anchor" href="#...">` control into each heading;
- labels it “Скопировать ссылку на раздел”;
- creates `#anchor-copy-toast`;
- handles click → clipboard copy / hash fallback / success feedback.

The current `SeriesReaderChrome → GillSeriesChrome → ReaderActionsRuntime` stack contains no `headingAnchors`, `.heading-anchor` or `anchor-copy-toast` implementation.

Yet current series-native page heads still explicitly promise this capability. Confirmed current source examples:

- Antisovetov: `features.headingAnchors.enabled = true`;
- Krajne: `features.headingAnchors.enabled = true`;
- Diotrophes: `features.headingAnchors.enabled = true`;
- Gill Part I;
- Gill Part II;
- Gill Part III;
- Gill Part IV;
- Gill reference/spravochnik.

That is **at least eight series-native article heads** declaring the feature while their shared runtime has no implementation.

The two primary migration witnesses make the user-visible gap direct rather than configuration-only:

- Antisovetov current body contains **35** `h2/h3/h4[id]` headings and **0** explicit `.heading-anchor` controls;
- Krajne current body contains **15** `h2/h3/h4[id]` headings and **0** explicit `.heading-anchor` controls.

Because the controls were historically runtime-injected by `site.js`, source markup is expected to contain zero controls **only if the runtime owner is present**. On the current series-native stack it is not.

Thus the state is:

```text
feature flag: enabled
+ dozens of eligible heading IDs
+ no pre-rendered controls
+ legacy injector retired
+ no native injector
= enabled capability with no behavioral/rendering owner
```

This is stronger than a generic “stale config” smell: the page explicitly declares a feature enabled, the prerequisite DOM exists, and the canonical runtime lacks the only behavior that makes the feature visible.

Standalone pages must not be folded into this manifestation merely because their heads also contain `headingAnchors`: the relevant question is whether their current composition still loads an owner. The systemic boundary is the series-native migration, not the flag name itself.

## Why existing checks can stay green

### Structural markup checks are narrower than behavior

The Antisovetov dove guard in `scripts/audit-pro.js` treats a `.map-trigger` as valid when it merely has `data-tip`, without proving a runtime consumer exists.

For FAQ, current source audits validate button/ARIA/DOM structure but no repository browser contract references `.faq-accordion__q` or exercises open/close state on these series-native routes.

For heading anchors, a source check can see both `headingAnchors.enabled=true` and valid heading IDs while still never requiring a mounted capability owner or a rendered `.heading-anchor` control.

### Migration browser claims did not exercise retained capability inventory

The Antisovetov migration commit reports Playwright coverage for:

- rail;
- part TOC;
- settings;
- breadcrumb;
- zero JS errors.

A missing event listener or missing runtime injector produces no exception, so “0 JS errors” is compatible with complete feature orphaning.

The Krajne migration similarly focused the shared series engine, not an exhaustive pre/post capability manifest.

The class-level oracle gap is:

```text
shared chrome works
+ page data/config/markup still present
+ no console exception
        ↓
accepted as migration parity

while

retained enabled feature has no current owner
```

## Root-cause model

```text
legacy site.js / enhancements.js own heterogeneous feature sets
        ↓
series migration identifies duplicated/shared chrome owners
        ↓
legacy scripts removed to prevent owner collisions
        ↓
retained page markup/data/config not mapped to a capability manifest
        ↓
some features receive native replacements (tooltip/quiz/image/reader/share/bookmark)
some do not (strategic map / FAQ / heading anchors)
        ↓
source structure remains plausible and configs remain truthy
        ↓
structural guards + selected browser flows stay green
        ↓
reader-visible capabilities disappear or become inert
```

## Durable closure boundary

Do not close this class by re-adding `enhancements.js` or `site.js` to series pages. That would undo the explicit single-owner migration and recreate known collisions.

A systemic repair should:

1. **Inventory the retained interactive capability set** for strict-native article/series pages, not just script filenames.
2. Give every retained capability exactly one current owner:
   - strategic-map interaction → native module or deliberately retire its markup/data;
   - FAQ accordion → native shared module or deliberately always-open semantic rendering;
   - heading anchors → native shared heading-link module, or set the feature false/remove the promise if deliberately retired.
3. Delete stale markup/data/config for deliberately retired features; do not leave inert affordances or `enabled:true` promises.
4. Add class-level source/build assertions: a route emitting a capability marker or enabling a capability must resolve exactly one canonical capability owner.
5. Add representative real browser contracts to the **shared series engine**:
   - Antisovetov strategic-map trigger click + Enter/Space + expected payload;
   - Antisovetov FAQ open/close;
   - Krajne FAQ open/close;
   - one enabled heading-anchor route renders a copy control and copies/navigates to the correct fragment;
   - `aria-expanded` truth and Escape/focus behavior where applicable.
6. Preserve the current no-duplicate-owner rule: native owner present ⇒ broad legacy script remains absent from series-native pages.
7. Add adversarial mutation witnesses: remove one capability module while retaining its marker/data/`enabled:true` config and prove the migration/readiness gate turns red.

## Negative controls that bound the root

This pass explicitly checked nearby retained surfaces so the root is not over-expanded:

- shared reader/TTS owner is present on Antisovetov/Krajne;
- bookmark toast is owned by the native bookmark engine;
- share is owned by the native reader-actions runtime;
- Krajne heart flip has a local keyboard-aware owner;
- old Krajne back-to-top markup is deliberately hidden when the series cluster is active;
- standalone Hermenevtika/Kod FAQ still have their legacy FAQ owner;
- mobile automatic note-collapse loss would leave content open/available and was not promoted without a stronger user-visible defect.

## Disposition of companion manifestation evidence

`ANTISOVETOV_STRATEGIC_MAP_RUNTIME_ORPHAN.md` is detailed manifestation evidence under this broader system root, not an independent Product repair lane.

If a verifier admits this work, prefer **one** systemic row/package over one row per trigger, FAQ item, heading, or route.

## Collision boundary

At recording time no open Product PR was found for `antisovetov`, `enhancements`, or the relevant shared capability migration. This evidence package still performs no Product mutation.

## What this report does not claim

- `SeriesReaderChrome` itself is generally broken; its shared reader/TTS/series controls are present.
- The correct repair is **not** to restore the monolithic legacy bundles.
- No need to create 17 FAQ rows, 39 strategic-map rows or dozens of heading-link rows; they are manifestations of one capability-migration root.
- A `headingAnchors` flag on a standalone page is not automatically broken; current runtime ownership must be checked per composition.
- Unrestricted live-browser navigation is blocked in this audit environment; the current feature-orphan mechanisms are established from exact source composition, unique-consumer census, CSS/config truth and origin commits.
