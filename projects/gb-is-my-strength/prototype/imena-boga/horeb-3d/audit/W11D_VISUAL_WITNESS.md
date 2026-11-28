# W11D — Midian visual-evidence gate (staged)

Until W11C, the browser saved individual PNG screenshots for Midian but the
success artifact excluded them. This prevented independent artistic review
without running a personal desktop browser. The next exact-HEAD CI will require
and upload all three real 3D viewport PNG files:

- midian-shot-desktop.png — wide landscape / well
- midian-walk-desktop.png — walking eye level and geometry
- midian-walk-mobile390.png — real 390 × 844 responsive frame

The test itself still verifies keyboard walking, physical camera ground height,
pointer rotation, mobile input, nested Esc/focus and WebGL remount. No
acceptance threshold is weakened. The action checks all PNG signatures
and meaningful file size; missing screenshots fail the QA job, and successful
screenshots are included in the already-existing 'horeb-chromium-witness'
artifact. No separate workflow/branch or Product release.

ART PASS still requires a *human* before/after review of actual frames and
real device visual/GPU checks. Historical well form and costumes remain
interpretive only. W10D Windows changes protected.
