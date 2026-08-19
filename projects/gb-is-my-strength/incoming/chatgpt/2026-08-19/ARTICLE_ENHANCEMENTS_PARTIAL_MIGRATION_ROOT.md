# ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT

> Filename retained for branch/link stability. The evidence proves a broader legacy-capability migration root spanning both `enhancements.js` and `site.js`, not only one retired bundle.

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product systemic interaction regression + audit-harness coverage gap
- Proof state: current source/composition + unique-consumer census + two independent migration-origin commits
- Primary audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Freshness: Product later advanced to `01894214765d7ab6e51a7eea1fb7f239c6591af8` only through `scripts/css-layer-validator.js`; the interaction owners below did not change.
- Primary strict-native routes proving the migration boundary:
  - `/articles/20-antisovetov-pastoru/`
  - `/articles/krajne-li-isporcheno-serdce/`
- Additional current series-native witnesses: Diotrophes and Gill series surfaces.
- Product mutation: none
- MASTER mutation: none
- Suggested themes: `ST-RUNTIME-OWNERSHIP`, `ST-STRANGLER`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## System root

The shared series migration correctly retired broad legacy runtime ownership in favor of native article modules, but it did **not inventory and re-home every retained feature owned by the removed legacy scripts**.

The current native stack explicitly owns:

- inline article tooltips;
- article quiz;
- article image viewer;
- reader/TTS/control projection through `ReaderActionsRuntime`;
- share through the native reader-actions owner;
- bookmarks/favorite persistence through the native bookmark/favorite owner.

However, retained markup/config/data still declares capabilities whose behavioral owners lived in scripts removed by the series migration:

1. Antisovetov strategic-map popovers — legacy `enhancements.js` owner;
2. FAQ accordion state/height interaction on Antisovetov and Krajne — legacy `enhancements.js` owner;
3. heading-anchor copy controls on series-native pages that still explicitly set `features.headingAnchors.enabled=true` — legacy `site.js` owner;
4. reversible flip cards on current series-native Gill/Krajne surfaces — legacy `site.js` activation/state owner.

This is not a request to restore the old monoliths. The systemic defect is **partial capability migration without a capability-completeness oracle**.

## Shared native owner boundary

The primary affected pages mount the shared native series runtime:

```text
series-native article body / page chrome
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

`GillSeriesChrome` contains an explicit ownership decision that the broad legacy enhancements bundle is absent because loading both old and native owners recreated reader controls and competed for glossary/quiz state. Current series composition also does not mount the monolithic `site.js` owner used by older pages.

That retirement decision is sound for duplicated capabilities. The defect is that the retired scripts contained a **heterogeneous capability set**, and not every still-declared/visible capability received a native successor.

A current tree search finds:

- no `.faq-accordion__q` behavior under `src/runtime/**`, reader-platform or the shared series runtime;
- no native `strategicMapData` consumer;
- no native `headingAnchors` / `.heading-anchor` / `anchor-copy-toast` owner under the shared series runtime;
- no native `.flip-card` / `.heart-flip-card` activation owner under the shared series runtime.

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

| Route | FAQ buttons | Current chrome | legacy FAQ owner through current composition? |
|---|---:|---|---|
| Antisovetov | 14 | `SeriesReaderChrome` | **No** |
| Krajne | 3 | `SeriesReaderChrome` | **No** |
| Hermenevtika | 3 | standalone/pilot runtime | Yes |
| Kod Da Vinci | 8 | standalone footer/runtime | Yes |

The latter two are useful negative controls: the legacy owner still exists there, so the finding is not “all FAQs are broken.” The failure boundary follows the series-native migration.

### Why the missing owner is reader-visible

Global/current CSS makes a not-open FAQ body non-interactive and collapsed:

```css
.faq-accordion__item:not(.open):not(.is-open) .faq-accordion__body {
  max-height: 0;
  grid-template-rows: 0fr;
  overflow: hidden;
  pointer-events: none;
}
```

Antisovetov additionally carries page-level `max-height:0; overflow:hidden` for FAQ bodies.

Without the missing behavior owner, clicking the real `<button>` does not add the open state and does not update `aria-expanded`; the reader-visible answer remains collapsed.

### Independent Krajne migration boundary

Product commit `8d02f3339866688eda5b675fdee42f109d7741af` migrated Krajne to the same series engine. Its message says the legacy GBS2 chrome / duplicate scripts were replaced with `GillSeriesChrome`; the diff removes the legacy enhancements owner.

Thus the same capability loss occurred independently on a second route while the shared chrome became the canonical owner.

## Manifestation C — enabled heading-anchor copy feature without its owner

The same migration incompleteness crosses a second retired legacy script, `site.js`.

`site.js` is the legacy implementation of `features.headingAnchors`. When the feature is enabled it:

- scans `h2[id], h3[id], h4[id]`;
- injects an `<a class="heading-anchor" href="#...">` control into each heading;
- labels it “Скопировать ссылку на раздел”;
- creates `#anchor-copy-toast`;
- handles click → clipboard copy / hash fallback / success feedback.

The current `SeriesReaderChrome → GillSeriesChrome → ReaderActionsRuntime` stack contains no `headingAnchors`, `.heading-anchor` or `anchor-copy-toast` implementation.

Yet current series-native page heads still explicitly promise this capability. Confirmed current source examples:

- Antisovetov;
- Krajne;
- Diotrophes;
- Gill Part I;
- Gill Part II;
- Gill Part III;
- Gill Part IV;
- Gill reference/spravochnik.

That is **at least eight series-native article heads** declaring `features.headingAnchors.enabled=true` while their shared runtime has no implementation.

The two primary migration witnesses make the user-visible gap direct rather than configuration-only:

- Antisovetov current body contains **35** `h2/h3/h4[id]` headings and **0** explicit `.heading-anchor` controls;
- Krajne current body contains **15** `h2/h3/h4[id]` headings and **0** explicit `.heading-anchor` controls.

Because the controls were runtime-injected by `site.js`, source markup is expected to contain zero controls **only if the injector owner is present**. On the current series-native stack it is not.

Thus the state is:

```text
feature flag: enabled
+ eligible heading IDs
+ no pre-rendered controls
+ legacy injector retired
+ no native injector
= enabled capability with no rendering/behavior owner
```

Standalone pages are not folded in merely because their heads contain the same flag; ownership must be checked per composition.

## Manifestation D — series-native flip cards lost the `.flipped` state owner

A deeper capability census corrected an earlier negative assumption in this audit.

Current legacy `site.js` is the generic reversible-card behavior owner. It scans:

```text
.flip-card, .error-flip-card, .heart-flip-card
```

and owns the behavior required for the visual contract:

- add/normalize `role="button"` and `tabindex="0"` where absent;
- initialize `aria-pressed` / `aria-expanded`;
- toggle the `.flipped` class;
- synchronize front/back accessibility state;
- support click and Enter/Space activation.

The CSS itself is state-driven, e.g.:

```css
.flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
.heart-flip-card.flipped .heart-flip-inner { transform: rotateY(180deg); }
```

The current native series stack has no replacement flip-card activation module.

### Gill current witnesses

Gill Part I currently renders a bilingual hymn `.flip-card` whose visible front says “Нажмите, чтобы увидеть оригинал.” It has no pre-rendered `role`, `tabindex`, or local activation script. The reader-facing promise therefore depends entirely on the missing generic owner.

Gill Part III currently renders at least four `.flip-card` instances, including three explicit pseudo-buttons labelled “Раскрыть термин...” with `role="button" tabindex="0"`. They still have no native activation owner, so the affordance remains but `.flipped` is never toggled by the series runtime.

### Krajne correction: the local heart-flip script is only a geometry helper

Krajne has one `.heart-flip-card` with a local inline script. An earlier pass tentatively treated that script as a full local owner; direct current-source reading disproves that.

The script explicitly says:

```text
Перехватываем клик — site.js добавит .flipped, мы только готовим высоту
```

Its click listener only measures/sets `--back-height`; its Enter/Space handler calls `card.click()`. It never toggles `.flipped` itself.

Therefore after the series migration removes `site.js`:

```text
click / Enter / Space
→ local height helper runs
→ expected site.js toggle never runs
→ .flipped never appears
→ card never rotates to its back face
```

This is a current functional regression, not merely an accessibility polish issue.

### Current minimum card blast radius

The directly confirmed series-native retained set is at least:

- Gill Part I: 1 generic flip card;
- Gill Part III: 4 generic flip cards;
- Krajne: 1 heart flip card.

That is **at least six reversible cards** on current series-native surfaces whose visual state contract depends on an owner not mounted by the shared series runtime.

This manifestation also demonstrates why source-only “the element already has `role=button`” is not a behavior witness: Gill Part III/Krajne can look structurally accessible while activation ownership is absent.

## Why existing checks can stay green

### Structural markup checks are narrower than behavior

The Antisovetov dove guard in `scripts/audit-pro.js` treats a `.map-trigger` as valid when it merely has `data-tip`, without proving a runtime consumer exists.

FAQ source checks can validate button/ARIA/DOM structure without exercising open/close state.

Heading-anchor source checks can see both `headingAnchors.enabled=true` and valid IDs without requiring a mounted injector or rendered copy control.

Flip-card/print contracts can recognize reversible-card structure and even manipulate `.flipped` directly in a test harness without proving that the **real runtime** provides the activation owner. A card's print reversibility is therefore not equivalent to interactive reversibility.

### Migration browser claims did not exercise retained capability inventory

The Antisovetov migration commit reports Playwright coverage for rail, part TOC, settings, breadcrumb and zero JS errors. A missing event listener or missing injector produces no exception, so “0 JS errors” is compatible with feature orphaning.

The Krajne migration similarly focused the shared series engine rather than an exhaustive pre/post capability manifest.

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
some features receive native replacements
  (tooltip/quiz/image/reader/share/bookmark)
some do not
  (strategic map / FAQ / heading anchors / flip cards)
        ↓
source structure remains plausible and configs remain truthy
        ↓
structural/print guards + selected browser flows stay green
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
   - heading anchors → native shared heading-link module, or set the feature false/remove the promise if deliberately retired;
   - flip cards → native shared reversible-card module, or deliberately render both faces non-interactively if the flip interaction is retired.
3. Delete stale markup/data/config for deliberately retired features; do not leave inert affordances or `enabled:true` promises.
4. Add class-level source/build assertions: a route emitting a capability marker or enabling a capability must resolve exactly one canonical capability owner.
5. Add representative real browser contracts to the **shared series engine**:
   - Antisovetov strategic-map trigger click + Enter/Space + expected payload;
   - Antisovetov FAQ open/close;
   - Krajne FAQ open/close;
   - one enabled heading-anchor route renders a copy control and copies/navigates to the correct fragment;
   - Gill Part I/III and Krajne card activation actually toggles `.flipped`, changes the visible face and maintains truthful ARIA state.
6. Preserve the current no-duplicate-owner rule: native owner present ⇒ broad legacy script remains absent from series-native pages.
7. Add adversarial mutation witnesses: remove one capability module while retaining its marker/data/`enabled:true` config and prove the migration/readiness gate turns red.

## Negative controls that bound the root

This pass explicitly checked nearby retained surfaces so the root is not over-expanded:

- shared reader/TTS owner is present on Antisovetov/Krajne;
- bookmark toast is owned by the native bookmark engine;
- share is owned by the native reader-actions runtime;
- old Krajne back-to-top markup is deliberately hidden when the series cluster is active;
- standalone Hermenevtika/Kod FAQ still have their legacy FAQ owner;
- mobile automatic note-collapse loss would leave content open/available and was not promoted without a stronger user-visible defect.

Correction to an earlier interim note: Krajne heart-flip is **not** a complete local owner; the local script intentionally delegates the `.flipped` state change to `site.js` and therefore belongs in Manifestation D.

## Disposition of companion manifestation evidence

`ANTISOVETOV_STRATEGIC_MAP_RUNTIME_ORPHAN.md` is detailed manifestation evidence under this broader system root, not an independent Product repair lane.

If a verifier admits this work, prefer **one** systemic row/package over one row per trigger, FAQ item, heading, card, or route.

## Collision boundary

At recording time no open Product PR was found for `antisovetov`, `enhancements`, or the relevant shared capability migration. This evidence package still performs no Product mutation.

## What this report does not claim

- `SeriesReaderChrome` itself is generally broken; its shared reader/TTS/series controls are present.
- The correct repair is **not** to restore the monolithic legacy bundles.
- No need to create 17 FAQ rows, 39 strategic-map rows, dozens of heading-link rows or six card rows; they are manifestations of one capability-migration root.
- A capability flag on a standalone page is not automatically broken; current runtime ownership must be checked per composition.
- Unrestricted live-browser navigation is blocked in this audit environment; the current feature-orphan mechanisms are established from exact source composition, unique-consumer census, state-driven CSS/config truth and origin commits.
