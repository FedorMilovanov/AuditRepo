# Verification Report: A11Y-NO-SCRIPT-ARIA

**Date:** 2026-07-17
**Status:** CLOSED (STALE / NOT REPRODUCED)

## Current Evidence
Checked pages in the atlas section (`/karty/`, `/karty/avraam/`, `/karty/ishod/`) for the presence of `AtlasNoScriptFallback.astro` logic and `aria-labelledby=\"atlasPageTitle\"`.

1. **/karty/ishod/**:
   - Found `<section ... aria-labelledby=\"pihahiroth-noscript-title\">`.
   - Found matching `<h2 id=\"pihahiroth-noscript-title\">...</h2>`.
   - **No trace** of `aria-labelledby=\"atlasPageTitle\"`.

2. **/karty/avraam/**:
   - Found `<section class=\"map-runtime-noscript\" ... aria-label=\"Текстовая замена интерактивной карты\">`.
   - **No traces** of `aria-labelledby=\"atlasPageTitle\"`.

3. **Global Audit**:
   - Broad search for `atlasPageTitle` in Product HTML across main sections returned **zero hits**.
   - AuditRepo history (`working/atlas/DEBT-REGISTER.md`) suggests that the atlas engine was heavily refactored around 2026-07-11.

## Conclusion
The defect `A11Y-NO-SCRIPT-ARIA` (described as a broken ARIA reference in a specific component `AtlasNoScriptFallback.astro`) is **stale**. The current Product implementation uses different ARIA strategies (direct labels or specific IDs like `pihahiroth-noscript-title`) which are correctly resolved.

According to AuditRepo Operating Model, this stale residual is removed from the active matrix.
