# W12E.1 — Midian well horizon and detrital silhouettes (candidate)

## Original-image diagnosis (19 Nov 2026)
Exact-SHA W12E.0 CI `horeb-chromium-witness-44410241494` `screenshots/midian-walk-desktop.png` (1024×768) shows an almost uniformly dark, sharply triangular full-circle ridge behind the physical well, with flat beige rocks clustered as identical smooth loaves. The well itself is materially different and already has independent masonry/collision contracts; this wave must not redesign it, introduce invented people, or make the Exodus 2 site look archaeologically identified.

## Controlled proposed change
- Same two complete low-poly indexed ridge meshes, 150 angular segments and four radial rows each: **same topology and draw-call count**, but use a seam-closed 2/5/9/15-mode profile rather than fractional-frequency squared sines that generated regular triangular teeth.
- Separate near/far phase profiles and subtler tonal bands add depth while retaining the neutral arid palette. No new sky, fog or lighting source.
- The same 145 instanced rocks keep exact X/Z positions and radii/colliders, but use moderately taller Y scales and deterministic per-instance color. **Still one rock draw call.**
- The finite, bounded profile is exported and tested over 151 angular samples on both radii, including an exact 2π seam and a strict adjacent-sample height jump; deterministic rock color in range and height ratios are also tested.
- No changes to MidianWell.ts, MidianMasonry.ts, MidianTrough.ts, route physics, initial shot camera, Research/rights, story chronology, text or asset count.

## Acceptance
Candidate only until exact-SHA source tests/build + actual same-camera browser screenshots at 1024×768 and 390×844 (software-WebGL is NOT hardware FPS proof). Reject for new unnatural bands/patchiness, lost silhouetted depth, rocks that look stacked or float, occluded well, blocked walk path or mobile aliasing. A later branch push must pass all six HOREB QA jobs, Validate/Preflight and original PNG review; a green CI alone cannot establish ART PASS. Wider Midian, Research, copyright, physical phones, people/animals, voice and release remain HOLD.

No new PR/branch or merge, main, Product, Research, and unfinished Windows W10D remain protected.

## Source-only independent numeric preflight
Initial candidate was rejected in strict 150-interval skyline sampling: maximum adjacent difference measured 0.609 above the new hard limit 0.6. The final detached tree reduces the highest 15th harmonic from 0.20 to 0.17 rather than weakening the test. Sampled max step is now 0.583 near / 0.591 far; both 2π seams close, height spreads 4.8m and 4.815m. Windows Desktop Commander is temporarily rate-limited; no claim of locally rendered W12E.1 screenshots. Actual Chromium from CI must be inspected after publication. This is still a candidate, not art approval.
