# Current-main re-verification — command combobox and mobile chapter chip

**Date:** 2026-11-03. **Disposition:** BOTH ROOTS FIXED BY ALREADY-MERGED PRODUCT #548; retire from the active matrix. No new Product code, bypass, hidden timeout relaxation or CI change.

## Product evidence

- Original October findings: `TLP-COMMAND-COMBOBOX-SEMANTICS` (listbox without option children or `aria-activedescendant`) and `TLP-MOBILE-SECTION-CHIP-INERT` (CSS-visible chapter button also marked `inert`/`aria-hidden` by the shared chrome owner).
- The exact merged Product commit `010d23f28eb2aaf3695a5b73b2f59882538077d9` (#548) repaired both owners:
  - `src/components/command/CommandPalette.tsx` now supplies stable option IDs, dynamic `aria-activedescendant`, correct listbox expanded state, and one disabled semantic option for empty results. `CommandResult.tsx` provides `role="option"`, `aria-selected`, stable ID and controlled tabindex.
  - `src/hooks/useAutoHideChrome.ts` no longer includes `.section-chip` in the chrome-inert set; `src/index.css` sets explicit hidden/visible ownership and `src/components/essay/SectionChip.tsx` routes section selection through a real URL fragment. No extra overlay engine was introduced.
- Exact Product source for independent verification: unchanged `main@ab57d75489de8f1722f6742ac66810254cae78e6`, detached clean checkout; `npm ci` and Vite production build passed. Product #550 advanced only documentation after #548.

## Command combobox — verified browser and axe

- The permanent Product regression `qa/reader-interaction-ownership.spec.mjs` passed the real opened command palette, active/second option and live `aria-activedescendant`; the separate empty-state test passed. The full 7-test owner suite passed on current main.
- Independent browser probe: Chromium light desktop 1440×900 and dark touch/mobile 390×844, both normal filled results and an empty no-results query. Focus remained on the combobox while ArrowDown changed `aria-selected` and `aria-activedescendant`; Escape closed the surface.
- axe-core 4.10.3 rules `aria-required-children`, `aria-required-parent`, `aria-valid-attr-value`: **12 rule-level passes**, **zero violations/incomplete**, for two visual environments × populated/empty list. Semantic options remain discoverable in the accessibility tree.

## Mobile chapter chip — verified real pointer/touch

- The permanent Product `qa/reader-interaction-ownership.spec.mjs` test passed the baseline route, reading-mode transition, absence of inert/aria-hidden, native popover opening and section hash.
- Independent Chromium touch-emulation matrix: **20/20 tests PASS**, covering **all ten published essays**, portrait 390×844 and landscape/tablet-width 844×390; every test exercised **reduced and normal motion**, or **40 functional scenarios**. After scrolling past the hide threshold, the chip was visible, not inert or aria-hidden, available as an accessible named button; real pointer activation opened the native popover, Escape closed it, and selecting a chapter populated the URL hash and dismissed the popover.
- Independent iPhone Safari/WebKit: **2/2 real tap cases PASS**, portrait `brik-case` with reduced motion and short landscape `galina-benislavskaya-yesenin-manuscripts-publishing-archive` with normal motion. Native popover, Escape, subsequent tap and hash navigation all worked.

## Scope and disposition

Both October root observations were valid on their source anchor; they are **no longer current** after merged Product #548. This wave updates AuditRepo, not Product. One existing active row `TLP-STATIC-PAGE-NESTED-MAIN-LANDMARKS` is separately retired in the companion report. Together, the three already-fixed #548 rows narrow the active matrix from **1 P1 + 10 P2 + 1 P3 = 12** to **1 P1 + 7 P2 + 1 P3 = 9**.

The adjacent `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME` remains active: #548 restored hash identity for PoemQuickNav and SectionChip, but did not independently prove repeated citation reveal or all post-layout deep-link geometry. `TLP-ESSAY-PORTRAIT-POINTER-HITTEST` also remains active: a new normal-motion diagnostic detected a transient non-hit-tested figure centre despite the original reduced-motion suite passing, so this report does not claim complete pointer closure. No independent live-domain deployment or all-browser full-site attestation is asserted.

Transient probe files and the separate axe-core installation stayed in an isolated local worktree; no new Product tests or dependencies were committed. The permanent #548 owner regression stays in source.
