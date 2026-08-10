# Terminal verification — Konfessii reduced-motion policy

Date: 2026-08-10
Product: `FedorMilovanov/gb-is-my-strength`
Disposition: **TERMINAL / MERGED-GREEN**

## Closed root

`V09-KONFESSII-AUTOMOTION`

## Repair owner

PR #1552 — `fix(konfessii): honor reduced motion for automatic card effects`

- tested PR head: `5150cb4291245293089dca1a7366351ccd7b5c2d`
- squash-merged main commit: `dd31df135ffb1e2640ba25536e9dcd94c319b52b`

The repair establishes one route motion policy across CSS and JavaScript:

- live-card `liveShimmer` and status-dot `liv` animations are disabled under `prefers-reduced-motion: reduce`;
- hover tilt/zoom and transition motion are suppressed under reduced motion;
- the automatic 4.2s JavaScript shimmer interval is not started while reduced motion is active;
- live media-preference changes clear timer/inline shimmer/transform state rather than leaving a previously scheduled effect running;
- normal-motion behavior remains enabled.

## Permanent evidence

A dedicated `Konfessii Reduced Motion Contract` is now part of Product CI. It builds production-like output and runs Chromium + WebKit in both `reduce` and `no-preference` modes.

The browser witness includes a 4.8-second delayed reduced-motion observation, long enough to cross the former 4.2-second automatic shimmer interval, and asserts no inline shimmer/transform mutation occurs. The normal-motion control proves the CSS animations and JS shimmer still run when motion is allowed.

The strict-native Konfessii audit also requires the CSS/JS reduced-motion ownership markers, so the browser witness cannot silently become disconnected from the route implementation.

## Exact PR-head CI

All workflows observed for `5150cb4291245293089dca1a7366351ccd7b5c2d` completed successfully, including:

- Konfessii Reduced Motion Contract;
- Visual Parity Guard — pixel-diff;
- Search Modal Contract;
- Scripture Occurrence Index Contract;
- Deploy Candidate Contract;
- Native Source Contract;
- Source Authority Contract;
- Metadata & IndexNow Readiness;
- Search Manifest Policy;
- Editorial Dateline Contract;
- Print Paper Contract;
- Glossary Contract;
- Shared Files Guard;
- Node Toolchain Contract.

## Merged-main identity

`scripts/konfessii-reduced-motion-browser-test.mjs` has blob SHA `e90f1c586af71c97f586d8ffd37351392e90d9e5` on both the fully-green PR head and merged current main, proving the permanent browser witness landed unchanged through squash merge.

The merged current `KonfessiiPageChrome.astro` is the repaired runtime owner (`85554c4e96cb24b59ac78271ac90bdefcda905c4`).

## Terminal outcome

`V09-KONFESSII-AUTOMOTION` is merged, exact-head green, current-main present and permanently browser-guarded. Remove it from the active MASTER matrix.
