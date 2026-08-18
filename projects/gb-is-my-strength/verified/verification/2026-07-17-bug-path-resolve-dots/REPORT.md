# Verification Report: BUG-PATH-RESOLVE-DOTS

**Date:** 2026-07-17
**Status:** CONFIRMED (SOURCE + RUNTIME)

## Runtime Evidence
Verified at `https://gospod-bog.ru/biografii/`.

1. **Broken Assets**: Multiple images and scripts are failing to load.
2. **Analysis**: Inspecting the HTML source shows paths like `../images/og-biografii.jpg`. Because this page is at `/biografii/`, the browser resolves this to `https://gospod-bog.ru/../images/...`, which is an invalid URL structure.

## Source Evidence
Verified in `src/components/biografii/BiografiiRecentSection.astro`.

1. **Hardcoded Paths**: Multiple `<img>` tags use hardcoded relative paths:
   - `src=\"../images/og-dzhon-gill-istoricheskiy-kontekst.jpg\"`
   - `src=\"../images/gill-study-portrait.webp\"`

## Conclusion
The use of `../` paths in components intended for subdirectory pages is incorrect. Paths should be root-relative (`/images/...`) or handled via Astro's asset import system.
