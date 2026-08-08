# Comment on v1 Playwright methodology — broken selectors

**Target finding:** `incoming/arena-agent-karty-playwright/2026-07-07/REPORT.md` §1.2 (50 Playwright runs)

**Source:** `incoming/arena-agent-karty-v3-deep-audit/2026-07-07/REPORT.md` §1

**Status proposal:** `proposal-partial` (v1 confirmed 1 P0 q-bug, but methodology was broken for state coverage)

## The bug in v1

`audit_visual/audit_visual.js` v1 used HTML text selectors:
```js
// v1 (BROKEN for SVG content)
const stage7 = await page.locator('text=Шалем').first();
if (await stage7.isVisible()) await stage7.click();
```

The markers in avraam/ishod are **SVG elements** (`<g>`, `<circle>`, `<text>` inside SVG namespace). Playwright's `text=` selector does **not traverse SVG** by default. Result:
- All "post-state" actions either timed out (30s) or were no-ops
- 9 "states" × 5 viewports = 45 avraam "post-state" runs were all actually showing **initial + intro screen**
- 50 runs had q-bug firing per page load (because `search-ur` action did work)

**v1's value:** found the q-bug (real P0)
**v1's flaw:** all other 8 states for avraam were not actually captured

## How v3 fixes this

```js
// v3 (CORRECT for SVG content)
const marker = page.locator('g[data-place-id="salem"]').first();
await marker.click({ force: true, timeout: 5000 });

// Or use JS dispatchEvent for SVG (bypasses Playwright's SVG handling)
await page.evaluate((id) => {
  const el = document.querySelector(`g[data-place-id="${id}"]`);
  if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}, state.placeId);
```

Plus:
- Dismiss intro before state actions (`me-intro__btn` click)
- Route-specific placeIds (avraam: ur/salem/harran, ishod: rameses/sinai/marah)
- State verification (`dom.panelOpen && dom.panelName === expected`)

## Impact on prior v1 findings

The 5 viewport × 9 state runs in v1 (45 avraam) were essentially **duplicates** of the "initial" state. The intro screen looks the same at all viewports, so v1's 45 runs effectively captured 5 unique screenshots (1 per viewport, all showing intro).

**v3 gives 46 runs with 12 states per route, real coverage.**

## Lessons

1. **SVG-aware selectors are essential** for map-based UIs. Use `g[data-X="Y"]`, `[data-attr]`, or `aria-label` selectors.
2. **JS dispatchEvent** as fallback for SVG (when Playwright's `.click()` doesn't work)
3. **Verify state changes** — don't assume action succeeded just because no exception
4. **dismiss modals/intro first** — many UIs block subsequent actions behind intro

## Recommendation

1. **Archive** v1 script as `audit_visual_v1.js` (broken)
2. **Commit** v3 script as `scripts/audit_visual.js` in `gb-is-my-strength`
3. **Document** SVG-aware selector pattern in `docs/PLAYWRIGHT-METHODOLOGY.md`
4. **Wire** into CI as `karty:smoke` smoke test (catches runtime errors)

## Cross-agent note

This is honest self-critique. v1 was 50 runs but ~45 of them were duplicates. v3 is 46 runs but all unique. Quality > quantity.

The q-bug finding from v1 is still valid — the bug was in `map-engine.js` and the selector broken only affected state coverage, not the runtime error capture.
