# V26 reproduced defects and QA certificate scope

## V25 findings and their V26 dispositions

- **GROK-V26-01 / CONFIRMED / FIXED IN DEMO.** At 900×300 desktop, TOC scroller height only 14px (while root horizontal overflow was zero); at 900×480 it was ≈191px. Excess footer/chrome squeezed the nav. V26 folds five meaningful actions into one row and keeps ≈109px of scrollable TOC at 900×300. It does not hide content via overflow masking.
- **GROK-V26-02 / CONFIRMED / FIXED IN DEMO.** After navigating to sections 2 and 4, browser Back→Back returned to bare URL but section 2 remained selected instead of original 0. V26 records initial state for bare-hash Back; Back/Forward now restores 0→2→4.
- **GROK-V26-03 / DETECTED BY RE-TEST / FIXED.** Compacting full-sidebar header caused collapse button to sit 3px above the compact expand button. The compact rail now uses matching top inset at short heights. First V26 test 59/65; **final 65/65 PASS**, not an attempt to hide initial failure.

## Actual checks

- Final **65/65 bounded Chromium regression checks** at 13 sizes from 320×740 to 1920×1080, notably 781×300, 900×260/300/360/390/480 and 1024×300. Test usable nav height, all five actions, vertical button parity, correct ARIA/inert, anchored short library popup, Escape, history Back/Forward, rapid accordion reversal and JS errors.
- Additional **81/81** Chromium checks: three publication families × Day/Sepia/Night × 900×300, 1024×768, 1480×900, at **130% reading font**. No page errors or root horizontal overflows found in those scenarios.
- Total V26 stand-alone test count: **146/146 PASS**. This does NOT establish Firefox/WebKit, Astro dist, production parity, live search, print, real Library V3 or deployed release identity.
- Two reproducible test source files and machine JSON output are included in the user's downloadable V26 backup package. For any new agent, regenerate browser screenshots at the exact viewport; screenshot-only inspection is not a functional witness.

## Required Product checks (not yet done)

- True persistent Library V3 reload, status transitions (“Читаю”, “Прочитано”, “Не интересно”), backup/import safety, note/highlight keys.
- Native anchor/heading census from real DOM; Gill legacy ribbon and sec-gill-last-pages; full actual route and back/forward lifecycle.
- Chromium + Firefox + WebKit on true built Astro preview; 130% font, short heights, reduced motion, multi-stage animation snapshots and no reader-axis drift. Prior 334px WebKit overflow must not return.
- Search manifest/Pagefind, authentic PlayEmber and speed, PDF/print, SW/cache and actual deployment SHA.
- Browser's local file:// navigation was administratively blocked in this test environment; same-document Back/Forward was verified, **true page-reload persistence was not**. Do not claim it passed.
