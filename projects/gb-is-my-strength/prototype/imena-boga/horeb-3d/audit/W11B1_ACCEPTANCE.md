# W11B.1 — browser-portable regression and terrain visual candidate

Date: 2026-11-17. Prior W11A.2 run 44091496787: all four actual-keyboard side pedestrian zones, source/geometry, Validate and Preflight **PASS**. Actual-Chromium failed at the portable test: `(await page.$('canvas')).length` treated a single ElementHandle as an array (or null). The correct query is `page.$$('canvas')`, which returns the list and verifies one real WebGL canvas at Exodus 2:16–17; other chronological moments still require zero. No runtime code or acceptance threshold is altered by this correction.

The same W11B.1 candidate uses procedural original Three.js terrain via `MidianLandscape.ts`: two continuous distant geometric ridges, less repetitive stone scatter, sparse twig-like brush, an open approach to the well, subtler well-block variance; all objects are real 3D, not composited pictures. The candidate lives in the same branch and Draft PR #543. **No assertion of historically identified Midian site.**

Acceptance on exact HEAD: TypeScript/build, source/geometry, offline `file://`, actual desktop/mobile Chromium Midian walking, seven independent components? HOREB QA is exactly six jobs total (source, Chromium and four pedestrian shards), plus Validate and Preflight. All six must be green. Visual ART review through screenshots required independently; a green source check alone does not certify cinematic quality.

Local Windows W10D is dirty in `NilePrelude.ts` and MUST NOT be overwritten, reset or rebased. No merge/deploy until quality gates. People, animals, clothing, historical research, rights and real device GPU remain HOLD.
