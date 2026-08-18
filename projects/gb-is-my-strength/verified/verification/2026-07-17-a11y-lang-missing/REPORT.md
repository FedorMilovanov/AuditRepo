# Verification Report: A11Y-LANG-MISSING

**Date:** 2026-07-17
**Status:** CONFIRMED (RUNTIME)

## Evidence
Verified at `gospod-bog.ru`.

1. **Greek Text**:
   - Sample: `ἐν ἀρχῇ ἦν ὁ λόгос` (John 1:1) and other quotes on the homepage.
   - Observed: Text is present in the source but is **not** wrapped in any element with `lang=\"el\"` or `lang=\"gr\"`.
   
2. **Hebrew Text**:
   - Sample: `שְׁמַע יִשְׂרָאֵל` (Deut 6:4) and other quotes.
   - Observed: Text lacks `lang=\"he\"` attribute.

## Conclusion
Missing `lang` attributes for foreign language segments prevent screen readers from switching to the correct pronunciation, violating A11Y best practices.
