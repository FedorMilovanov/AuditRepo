# W13D — multi-touch look ownership (detached candidate)

Observed from code on W13C `a4d5bf470af4f136ef5a25a05cdf9623a4cfd074`: the `pointerdown` handlers in `MidianWell.ts`, `MidianHomestead.ts` and `NilePrelude.ts` unconditionally overwrite their active pointer identifiers. A second `pointerdown` from another finger may replace the first primary look drag. This was noted in prior PR comments but not covered by ordinary mouse/touch-button tests.

Fix is intentionally small and shared by behavior: reject non-primary touch `pointerdown`, never overwrite an already active pointer, preserve matching-pointer release and existing keyboard/movement handling. No physical coordinates, GPU meshes, textures, research material, sound, navigation, or release permissions modified.

Add 390×844 actual Chromium **two-contact CDP** tests for all three existing worlds. Start a first finger and second finger on the 3D canvas; move only the second (expect yaw unchanged); move the original first (expect yaw change); return yaw near original and release all contacts in a `finally` block. This is gesture ownership, **not** a claim of perfect pinch zoom (not implemented).

This SHA is detached and **not approved** while W13C exact-SHA HOREB QA is pending. After acceptance: Vite/TypeScript, all unit/geometry, three real Chromium journeys with native touch, fresh CI 6/6, actual 390px witness and no content changes. Keep one PR only and preserve main/Product/Research/dirty Windows W10D.
