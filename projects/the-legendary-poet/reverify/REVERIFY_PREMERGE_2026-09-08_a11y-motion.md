# The Legendary Poet — A11Y utility-motion pre-merge witness

Date: 2026-09-08  
Audit issue: #410  
AuditRepo base: `1ee4247f37d7d57f5a7d9a2739af3a86d0e1147f`  
Product issue: #467  
Product PR: #468  
Current Product base: `cf78d58f0bef479e77a0265dd14111bc7d0c44db`  
Current Product head under test: `2c98a7e184adfdd43e45f1342b1b9e01a222cbab`

## Status

This document is **pre-merge evidence only**. It does not retire `TLP-A11Y-MOTION-001`, does not change the active denominator, and does not assert a future Product merge SHA. Terminal reconciliation is permitted only after Product #468 is fully certified and CAS-merged.

## Root reproduced before repair

The active matrix correctly recorded a split accessibility authority: Framer/View Transitions and several hand-written CSS animations respected `prefers-reduced-motion`, while persistent Tailwind utility animation did not.

The first Product #468 implementation intentionally made the canonical browser-runtime validator fail closed on every persistent utility literal lacking a local guard. That head exposed a broader pre-existing inventory than the original three observed instances, including loaders/status motion in community, FeaturedTrackPlayer, ImmersivePlayer, TrackReleaseCard and RatingsPage. Those findings were treated as manifestations of the same `TLP-A11Y-MOTION-001` root, not excluded to make CI green.

## Final architecture under test

The current Product head centralizes the policy instead of copy-patching each component:

- new `src/reduced-motion.css` is imported after all other production CSS from `src/main.tsx`;
- under `@media (prefers-reduced-motion: reduce)`, the canonical looping Tailwind utility classes `.animate-spin`, `.animate-ping`, `.animate-pulse`, `.animate-bounce` resolve to `animation: none !important`;
- normal-motion utility behavior remains unchanged;
- visible state semantics remain present because the policy removes only CSS animation, not icons, color, text or state containers.

`validate:browser-runtime` now recursively inventories persistent utility tokens across production `src/**/*.ts(x)` and verifies the central policy is non-vacuous, covers all four canonical looping utility selectors, contains the authoritative reduced-motion media query and `animation: none !important`, is imported by `main.tsx`, and is the final production CSS import.

## Browser proof under test

Two real production journeys were added to the existing cross-browser Manual Browser QA matrix:

1. `/poets`: the rating-star pulse is visible and has a running computed animation under `no-preference`; after changing the media preference to `reduce`, the same visible state remains while computed `animationName` becomes `none`.
2. `/music`: under reduced motion, a real audio track is started, the global mini-player remains visible with `Сейчас звучит`, the underlying `<audio>` element remains actively playing, and the visible playing-state pulse has computed `animationName: none`.

This is stronger than a source-only assertion: it proves the final CSS cascade, media-query behavior and visible state semantics in the real application.

## Earlier red head

An earlier Product head `ed3b4d51fc5906dd1bd9493b4185f4f731f72ec6` failed the canonical `validate:browser-runtime` step in CI #3906 and corresponding downstream workflows because additional old utility-motion usages were discovered. That failure is diagnostic history only and is not merge evidence. The validator was not weakened by excluding those surfaces; the repair architecture was generalized instead.

## Current merge barrier

The current exact Product head `2c98a7e184adfdd43e45f1342b1b9e01a222cbab` has fresh workflow runs requested. At the time of this pre-merge witness the relevant jobs are still queued in the repository runner backlog; no terminal success is claimed here.

Terminal closure requires:

- fresh exact-head CI/contracts/build success;
- relevant Manual Browser Chromium/Android/iPhone-WebKit success with the new regressions actually executed;
- aggregate merge certification for the same final head;
- current Product base / `behind=0`;
- zero review and review-thread debt;
- CAS squash merge from the exact certified head;
- resulting-main verification.

## Expected audit disposition only if terminal Product proof succeeds

If and only if the final Product transaction satisfies the barrier above and resulting source preserves the certified policy, `TLP-A11Y-MOTION-001` can leave the active matrix. The denominator would then move from `16 = P1 1 / P2 11 / P3 4` to `15 = P1 1 / P2 11 / P3 3`.

No broader `TLP-A11Y-RUNTIME-001` closure is implied: focus/navigation/dialog/hash/hidden-chrome/collection-mutation/citation/overlay concerns remain an independent P2 systemic root.