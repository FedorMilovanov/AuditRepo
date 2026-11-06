# V24 browser regression and limits — evidence at standalone prototype only

## Reproduced and addressed

1. V23 dynamic left overline still contained **V22**, inconsistent with header.
2. Closing an accordion with focused descendant could leave focus in an inert subtree; now redirected to the exact controlling disclosure before setting inert.
3. Arrow navigation filtered on `getClientRects()` only; a closing inert subtree keeps layout boxes and could be selected while inaccessible. Now excludes inert, hidden and aria-hidden ancestry.
4. Legacy query Enter with zero matching sections fell through to `matches[0]`; now refuses an unrelated jump.
5. A too-abrupt opacity phase (~75ms) during 650ms width travel was softened to a coordinated 140/185ms closing fade and 205/155ms opening fade; CSS width remains interruptible. No claim about device-wide frame pacing.

## Executed Chromium checks

- **36/36** smoke assertions on 320×740, 390×844, 900×300, 900×480, 1024×768, 1480×900, 1920×1080: no root horizontal overflow, correct V24 identification, desktop same-y expand/collapse control and aria/inert ownership.
- **13/13** interaction assertions: book accordion immediate inert; keyboard ArrowDown skips inert; reopen restores visibility; three anchored popovers and Escape; cycle mode, quick theme, save state; no page errors.
- Real intermediate motion frames: rail widths 335px expanded; ~115ms 221.9px (full opacity .11, compact .54); ~285ms 82.0px (compact fully visible); final 68px, expanded after reversal 335px. Text width 746→780→746px.
- **49/49** combined bounded assertions passed; no JS page errors observed. A previous long stress script timed out and is **not included** in the pass count.

## MUST still be tested in Product pilot

Actual Astro production-like build/deploy, Firefox, WebKit, real Gill heading/anchor census incl. `#sec-gill-last-pages`, H4/H5 from real data, Reader/Overlay/scroll state and Back/Forward, TTS and true speed controls, Library V3 across reload/backup/status, Search Pagefind corpus, real mobile no-change and print/PDF/SW/caching. Test 130% text, reduced-motion, rapid reverse 4×, mid-article reading position, keyboard focus inside collapsing child and exact same axis for legacy and pilot. A green demo is not a Product release certificate.

Some snapshots and scripts are in the user-facing V24 ZIP; the exact durable browser asset in AuditRepo is `REFERENCE-V24.html`.
