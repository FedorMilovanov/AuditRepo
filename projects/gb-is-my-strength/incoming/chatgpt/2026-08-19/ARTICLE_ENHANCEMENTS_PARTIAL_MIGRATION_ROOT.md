# ARTICLE-ENHANCEMENTS-PARTIAL-MIGRATION-ROOT

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product systemic interaction regression + audit-harness coverage gap
- Proof state: current source/composition + unique-consumer census + two independent migration-origin commits
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Affected current strict-native routes proven in this pass:
  - `/articles/20-antisovetov-pastoru/`
  - `/articles/krajne-li-isporcheno-serdce/`
- Product mutation: none
- MASTER mutation: none
- Suggested themes: `ST-RUNTIME-OWNERSHIP`, `ST-STRANGLER`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## System root

The shared series migration retired broad legacy `js/enhancements.js` ownership in favor of native article modules, but the migration did **not inventory and re-home every feature that `enhancements.js` owned**.

The current native stack explicitly owns:

- inline article tooltips;
- article quiz;
- article image viewer;
- reader/TTS/control projection through `ReaderActionsRuntime`.

However, retained page markup still depends on at least two additional legacy enhancement capabilities that have no native replacement on current `SeriesReaderChrome → GillSeriesChrome` pages:

1. Antisovetov strategic-map popovers;
2. FAQ accordion state/height interaction on Antisovetov and Krajne.

This is not a request to restore the whole legacy bundle. The systemic defect is **partial capability migration without a capability-completeness oracle**.

## Shared native owner boundary

Both affected pages are current production Astro owners and mount the shared native series runtime:

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

`GillSeriesChrome` contains an explicit ownership decision:

```text
The legacy enhancements bundle is intentionally absent: loading both owners
recreated reader controls and competed for glossary/quiz interaction state.
```

That retirement decision is reasonable for duplicated capabilities. The failure is that the retired bundle also contained capabilities that were **not duplicated** by the native stack.

A current tree search finds no `.faq-accordion__q` behavior under `src/runtime/**`, `reader-platform/**`, or the shared series runtime, and no native `strategicMapData` consumer.

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

The diff removes `js/enhancements.js` while preserving `strategicMapData`.

This is a direct data-carrier-without-behavioral-owner migration error.

## Manifestation B — FAQ accordion interaction

Legacy `js/enhancements.js` also owns `.faq-accordion__q` behavior. It:

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

Product commit `8d02f3339866688eda5b675fdee42f109d7741af` migrated Krajne to the same series engine. Its message says the legacy GBS2 chrome / duplicate scripts were replaced with `GillSeriesChrome`; the diff explicitly removes `js/enhancements.js`.

Thus the same capability loss occurred independently on a second route family while the shared chrome became the canonical owner.

Two independent manifestations on the same shared migration boundary satisfy the AuditRepo systemic-root model better than two unrelated point bugs.

## Why existing checks can stay green

### Structural markup checks are narrower than behavior

The Antisovetov dove guard in `scripts/audit-pro.js` treats a `.map-trigger` as valid when it merely has `data-tip`, without proving a runtime consumer exists.

For FAQ, current source audits validate button/ARIA/DOM structure but no repository browser contract references `.faq-accordion__q` or exercises open/close state on these series-native routes.

### Migration browser claims did not exercise retained feature inventory

The Antisovetov migration commit reports Playwright coverage for:

- rail;
- part TOC;
- settings;
- breadcrumb;
- zero JS errors.

A missing event listener for a retained feature produces no exception, so “0 JS errors” is compatible with complete feature orphaning.

The Krajne migration similarly focused the shared series engine, not an exhaustive pre/post capability manifest.

The class-level oracle gap is:

```text
shared chrome works
+ page data/markup still present
+ no console exception
        ↓
accepted as migration parity

while

retained feature has no behavioral owner
```

## Root-cause model

```text
legacy enhancements.js owns heterogeneous feature set
        ↓
series migration identifies duplicated/shared chrome owners
        ↓
legacy bundle removed to prevent owner collisions
        ↓
retained page markup/data not mapped to a capability manifest
        ↓
some features receive native replacements (tooltip/quiz/image/reader)
some do not (strategic map / FAQ)
        ↓
source structure remains plausible
        ↓
structural guards + selected browser flows stay green
        ↓
reader-visible controls have no runtime behavior
```

## Durable closure boundary

Do not close this class by re-adding `enhancements.js` to two pages. That would undo the explicit single-owner migration and recreate known collisions.

A systemic repair should:

1. **Inventory the retained interactive capability set** for strict-native article/series pages, not just script filenames.
2. Give every retained capability exactly one current owner:
   - strategic-map interaction → native module or deliberately retired markup/data;
   - FAQ accordion → native shared module or deliberately always-open semantic rendering.
3. Delete legacy markup/data for deliberately retired features; do not leave inert affordances.
4. Add class-level source/build assertions: a route emitting a capability marker (`.map-trigger`, `.faq-accordion__q`, etc.) must resolve a canonical capability owner.
5. Add representative real browser contracts to the **shared series engine**:
   - Antisovetov strategic-map trigger click + Enter/Space + expected payload;
   - Antisovetov FAQ open/close;
   - Krajne FAQ open/close;
   - `aria-expanded` truth and Escape/focus behavior where applicable.
6. Preserve the current no-duplicate-owner rule: native owner present ⇒ legacy `enhancements.js` remains absent from series-native pages.
7. Add an adversarial mutation witness: remove one capability module while retaining its marker/data and prove the migration/readiness gate turns red.

## Disposition of companion manifestation evidence

`ANTISOVETOV_STRATEGIC_MAP_RUNTIME_ORPHAN.md` should be treated as detailed manifestation evidence under this broader system root, not as a request for an independent Product repair lane.

If a verifier admits this work, prefer **one** systemic row/package over one row per trigger, FAQ item, or route.

## Collision boundary

At recording time no open Product PR was found for `antisovetov`, `enhancements`, or the relevant shared capability migration. This evidence package still performs no Product mutation.

## What this report does not claim

- `SeriesReaderChrome` itself is generally broken; its shared reader/TTS/series controls are present.
- Hermenevtika and Kod FAQ are not included in the broken set because their current owners still load `enhancements.js`.
- The correct repair is **not** to restore the monolithic legacy bundle.
- No need to create 17 FAQ rows or 39 strategic-map rows; they are manifestations of one owner-migration root.
- Unrestricted live-browser navigation is blocked in this audit environment; the current feature-orphan mechanism is established from exact source composition, CSS behavior, unique-consumer census and origin commits.
