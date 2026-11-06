# QA V25 — confirmed defect repairs and test boundary

## Reproduced in V24 and fixed in V25
1. A direct anchor/search jump after manually collapsing the current article's subtree selected a hidden section. The current article is now reopened before selecting its H2/H3/H4, including ancestors.
2. updateNav() replaced the whole tree while a keyboard-focused link was selected and sent focus to BODY. It now restores focus to the newly rendered equivalent if accessible, never to hidden/inert content.
3. H2 fine connector lines briefly crossed moving rows during subtree height animation. The new scoped motion-counter mutes only connectors until the last WAAPI animation settles; reversed/cancelled transitions release their ownership exactly once.
4. Preview search buttons were incorrectly assigned role=listitem inside an interactive list. Replaced with semantic buttons under a labelled group.
5. V25 labels consistently identify the new reference; older V-numbers retained in historical code comments only.

## Executed witness, not overstated
Chromium Playwright system executable, 9 viewport fixtures: 320×740, 390×844, 781×300, 900×300, 900×480, 1024×768, 1280×720, 1480×900, 1920×1080. **57/57** assertions passed, **zero reported JS page errors**. Checks include root overflow/ID uniqueness, same-height collapse control, inert/ARIA, direct hidden-section jump, keyboard focus rescue/rerender, three anchored popovers and Escape, Night→Sepia restoration, in-session save, and rapid WAAPI reversal without permanent connector mute.

**Not tested:** real localStorage across reload because sandbox blocked both file: and localhost navigation (ERR_BLOCKED_BY_ADMINISTRATOR). Firefox and WebKit browser engines not installed. Real Astro Product pages, real route/anchor census, native library V3, TTS, Pagefind search, PDF, PWA and deployed public identity not tested by this HTML.

## Required Product blocker tests
Re-run on current actual Product head: WebKit/Firefox/Chromium on real Gill/Baptist/Hermeneutics, before/after visual screenshots and reader-axis rectangles, zero changed mobile behavior at 320/390, H2→H4 deep route/Back/Forward, focus during rapid collapse, reduced-motion, font 130%, fixed right vertical four controls, Gill historic ribbon, anchors including #sec-gill-last-pages, library V3 after genuine reload/backup/import and states, native overlay ownership, TTS, search, SW, and Print PR #2269 collision.

Historical failure evidence: WebKit 334px width drift 24298e66c0fc; duplicate search overlay owner fbbc9510; hidden focus 36ab77b4; lost Gill submenu 586904eb/f5cb271; missing Gill anchor 7b140024; accidental CSS/legacy loss b782f9/58fccd2; mobile scroll owner af90af3b. Abort Product release if any recurs.
