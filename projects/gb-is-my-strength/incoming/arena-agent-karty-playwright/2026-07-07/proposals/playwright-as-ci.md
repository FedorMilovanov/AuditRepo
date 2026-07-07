# Proposal: Playwright as standard CI tool (catch q-bug-like errors automatically)

**Source:** `incoming/arena-agent-karty-playwright/2026-07-07/REPORT.md` §7.3
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (owner decision needed)

## Problem

The q-bug (`q is not defined` on search keystroke) **was not caught by any existing CI**:
- `validate:static-publication` — passes (no source-level issue)
- `avraam:audit` — uses deprecated `vm` module, doesn't run browser
- `konfessii:audit` — uses Playwright, but only for konfessii, not karty
- `karty:visual-parity:audit` — exists but not run in standard validation
- `data:consistency` — passes (data is fine)

**The q-bug was on production for an unknown time** (since the engine was first written).

## Proposal

Add Playwright-based validation to standard CI:

1. **Smoke test** for karty/ (10 sec, runs always):
   ```bash
   npm run karty:smoke  # Playwright, no screenshots, just console error check
   ```

2. **Visual parity** (5 min, runs on PR):
   ```bash
   npm run karty:visual:full  # full screenshot suite
   ```

3. **Wire into** `validate:static-publication`:
   ```json
   "validate:static-publication": "... && npm run karty:smoke"
   ```

## Implementation sketch

`scripts/karty_smoke_test.js` (new file, ~50 lines):
```js
const { chromium } = require('playwright');
const ROUTES = ['avraam', 'ishod'];
async function main() {
  const browser = await chromium.launch({ headless: true });
  let errors = 0;
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(`https://gospod-bog.ru/karty/${route}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    // Trigger search (catches q-bug)
    const search = page.locator('input.me-search').first();
    if (await search.count()) {
      await search.fill('test');
      await page.waitForTimeout(500);
    }
    if (errs.length) {
      console.error(`❌ ${route}: ${errs.length} errors`);
      errs.forEach(e => console.error('   ', e));
      errors += errs.length;
    } else {
      console.log(`✅ ${route}: 0 errors`);
    }
  }
  await browser.close();
  process.exit(errors > 0 ? 1 : 0);
}
main();
```

`package.json`:
```json
"karty:smoke": "node scripts/karty_smoke_test.js"
```

## Cost analysis

- **Setup:** 0 (Playwright already installed in E2B sandbox; production CI may need to install chromium)
- **Per run:** ~10-15 sec (headless, no screenshots, just error check)
- **CI time impact:** negligible
- **Maintenance:** minimal (script is small)

## Benefit

- Catches `q is not defined`-class errors (JavaScript runtime) automatically
- Catches broken UI flows (e.g., search input broken)
- Catches mobile-specific bugs (when extended to mobile viewport)
- **No false positives** (real DOM, real errors)

## Drawbacks

- Requires chromium installed in CI (current E2B sandbox already has it via apt-get)
- Requires playwright npm package (already in `dependencies`)
- Some CI environments don't allow browsers (rare, but happens)

## Recommendation

1. **Phase 1 (immediate, this week):** Add `scripts/karty_smoke_test.js` + `npm run karty:smoke`. Wire into `validate:static-publication`.
2. **Phase 2 (next 2 weeks):** Add full screenshot suite as `npm run karty:visual:full` (gated by env var, not on every PR).
3. **Phase 3 (next month):** Add visual regression — compare screenshots to baseline, fail if delta > N%.

## Cross-ref

- This would have caught `Q-BUG-SEARCH-P0` automatically
- Phase 1 of STRATEGY.md mentions Playwright (owner must approve)
- Replaces manual visual audit (Phase 1 of STRATEGY.md)

## Do not mix with

- Q-BUG-SEARCH-P0 fix — separate (this is prevention, that is fix)
- ATLAS-GRADE work — long-term, this is short-term
