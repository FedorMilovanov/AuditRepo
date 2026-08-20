# ANTISOVETOV-STRATEGIC-MAP-RUNTIME-ORPHAN

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Product interaction regression + audit-harness false-green
- Proof state: current-source + import/composition witness + origin-commit witness
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Route: `/articles/20-antisovetov-pastoru/`
- Owner: strict-native Antisovetov → `AntisovetovBody.astro` → `SeriesReaderChrome` → `GillSeriesChrome`
- Product mutation: none
- MASTER mutation: none
- Suggested themes: `ST-RUNTIME-OWNERSHIP`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## Finding

The strict-native Antisovetov source still renders its strategic-map interaction surface and full data payload, but the migration to the shared series chrome removed the **only runtime that consumes that payload**.

Current `AntisovetovBody.astro` contains **39 `.map-trigger` elements** pointing to **36 distinct `data-tip` values** and a matching `#strategicMapData` JSON payload with 36 top-level entries. The triggers deliberately present themselves as interactive:

```html
<span class="fn-marker fn-marker--dove map-trigger" data-tip="1" role="button" tabindex="0"></span>
```

Other triggers contain visible inline text and the same `role="button" tabindex="0"` affordance.

The body is currently wrapped by the canonical series owner:

```astro
import SeriesReaderChrome from '@/components/article-pilots/_shared/series/SeriesReaderChrome.astro';
...
<SeriesReaderChrome pageId="antisovetov" config={PASTOR_SERIES}>
  ...
</SeriesReaderChrome>
<script is:inline type="application/json" id="strategicMapData">...</script>
```

`SeriesReaderChrome` delegates to `GillSeriesChrome`.

## Runtime ownership trace

`GillSeriesChrome` intentionally excludes the legacy enhancements bundle:

```text
Gill routes are fully owned by the native article interaction modules below.
The legacy enhancements bundle is intentionally absent: loading both owners
recreated reader controls and competed for glossary/quiz interaction state.
```

It loads the floating controller and `<ReaderActionsRuntime />` instead.

`ReaderActionsRuntime` imports the native article interaction bundle. The current `article-interactions.js` installs only:

- article tooltips;
- article quiz;
- article image viewer.

The canonical tooltip owner itself recognizes `.gterm`, `.fn-marker`, and `.bref[data-ref]`, but for `.fn-marker` it requires a nested `.tooltip`. Antisovetov strategic markers are data-driven `.map-trigger` nodes and do not carry that nested tooltip payload.

A full current-equivalent tree search finds the functional strategic-map consumer only in legacy `js/enhancements.js`:

```js
var e=document.getElementById("strategicMapData");
...
document.querySelectorAll(".map-trigger").forEach(function(e){
  e.addEventListener("click", function(...) { ... build singleton-popover ... })
})
```

`js/site.js` contains only `.map-trigger` geometry scheduling for an already-existing `.singleton-popover`; it does not parse `strategicMapData`, create/populate the popover, or own activation. It is also not loaded by the current series chrome.

There is no current native consumer of `strategicMapData` in `src/runtime/**` or the shared series owner.

Therefore the strict-native source projects:

```text
interaction affordance + data payload
             ↓
      no functional owner
             ↓
click / Enter / Space cannot materialize the intended strategic-map popover
```

This is a source-level feature-orphan regression, not merely a missing accessible-name or keyboard-polish issue.

## Exact origin commit

The regression boundary is unusually explicit. Product commit
`3f199e9bb4cf2741e7db2c94ea6aa7345932c6c7`
(`antisovetov → серия-движок: «Тёмная сторона кафедры», часть I`) records the migration from the article FloatingCluster path to `GillSeriesChrome + PASTOR_SERIES`.

Its commit message says:

```text
AntisovetovBody: убраны FloatingCluster, skip-link, in-body крошка, 9
хром-скриптов; сохранены strategicMapData и bookmark-toast.
```

The diff confirms `js/enhancements.js` was among the removed scripts while `strategicMapData` remained. The migration therefore preserved the feature's data carrier while deleting its behavioral owner.

The same commit's Playwright claim covered rail / part TOC / settings / breadcrumb and zero JS errors. Those checks did not exercise strategic-map activation, so the regression could ship without an exception or console failure.

## Current repair history does not close it

Product commit `838ae821a18f22312e5f2065cd91036bbfb5535e` (`fix(series): restore Antisovetov shared reader capability owner`) later removed the stale `SeriesArticleLayout` path and restored the direct pilot composition. Current `AntisovetovBody` does correctly mount `SeriesReaderChrome`, so the shared reader/TTS owner is **not** missing now.

That repair does not restore strategic-map behavior because the series chrome still intentionally excludes `enhancements.js`, and the native article interaction bundle still has no strategic-map module.

This distinction matters: the current root is not “Antisovetov lost all reader runtime.” The reader owner is present; **one retained feature family never migrated into the native runtime**.

## Existing oracle false-green

### `audit-pro.js` dove guard

The existing dove-marker integrity guard explicitly treats a map trigger as valid if it merely carries `data-tip`:

```text
Every fn-marker--dove must be either a map-trigger (data-tip) or carry a .tooltip child.
```

Its pass criterion is structural:

```text
withTip + withTooltip >= doveOpens
```

It never proves that a `data-tip` marker has a runtime owner capable of consuming the referenced payload. Therefore the exact orphan state above is reported as healthy.

This is a classic carrier-vs-capability oracle error:

```text
payload exists
≠
feature can be activated
```

### Browser coverage

Current repository browser contracts do cover Antisovetov for shared reader controls / reader projection / favorite-store behavior, but the current script inventory contains no browser contract that references `.map-trigger` or `strategicMapData`.

Thus the tests correctly protect the shared reader capability while leaving this Antisovetov-specific retained feature outside the behavioral matrix.

## Accessibility boundary

The current markers expose `role="button"` and `tabindex="0"`. The removed legacy `enhancements.js` implementation itself attached only a `click` listener to `.map-trigger` and did not provide Enter/Space activation.

That means simply re-adding `enhancements.js` would be the wrong durable repair: it would revive a competing legacy bundle and would still preserve a keyboard-semantics defect.

The correct closure boundary is to give strategic-map interactions a canonical native owner with button-equivalent keyboard behavior, not to resurrect the entire legacy enhancements bundle.

## Suggested durable closure

1. Create or extend one native article-interaction module that explicitly owns `[data-tip].map-trigger` + `#strategicMapData`.
2. Preserve the current strict-native series composition and do **not** reintroduce the broad legacy `enhancements.js` owner.
3. Use one accessible interaction contract:
   - native `<button>` where practical, or equivalent role/tab semantics;
   - click + Enter + Space activation;
   - truthful `aria-expanded` / popup relationship;
   - Escape/outside close;
   - deterministic focus behavior;
   - mobile/desktop geometry.
4. Add fail-closed source/data integrity:
   - every rendered `data-tip` resolves to exactly one strategic-map record;
   - every retained record is referenced or deliberately declared unused;
   - a route carrying strategic-map triggers must import/mount the canonical runtime owner.
5. Add a real production-like Chromium + WebKit witness on representative triggers, including at least:
   - one dove marker;
   - one visible inline `.map-trigger`;
   - keyboard activation;
   - popup content from the expected JSON record;
   - close and focus behavior.
6. Harden `audit-pro` or replace the structural dove check so `data-tip exists` cannot be treated as equivalent to `interactive capability exists`.

## Collision boundary

At recording time no open Product PR was found for `antisovetov` or `enhancements`. This AuditRepo package still records evidence only; it does not open a competing Product repair lane.

## What this report does not claim

- The shared Antisovetov reader/TTS owner is **not** missing; `SeriesReaderChrome → GillSeriesChrome → ReaderActionsRuntime` is present.
- No claim that the entire series engine is broken.
- No claim that `strategicMapData` is corrupt; the problem is missing behavioral ownership.
- No recommendation to restore the whole legacy `enhancements.js` bundle.
- No unrestricted live-browser interaction capture was possible in this audit environment; the feature-orphan mechanism is established from exact current composition + unique-consumer + origin-commit evidence.
