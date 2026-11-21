# W12C.3 — portrait establishing composition without teleport (detached)

## Actual W12B.1 visual problem
At 390×844, the existing 10m walking start and 56° vertical FOV cropped much of both roof eaves, producing a brown roof/flat-sky composition. This occurs because the portrait horizontal field of view becomes substantially smaller. An object-only screenshot is not sufficient: the person must be able to walk from the actual camera position.

## Reversible technical fix
- Same real Three.js scene; no new fake card or scripted flythrough. On `window.innerWidth<=520`, start walking at `z=14.5` rather than `z=10`, and use a moderate 72° vertical FOV so both sides of the six-metre-wide structure enter the portrait frame. Desktop FOV/start remain 56° and z=10.
- Verify every 0.2m of the physically shared centre approach from the new start towards the existing path is unblocked by new W12B.1 rock colliders.
- Browser must set 390px viewport **before** entering walk mode, assert real player x/z and lens, save the phone PNG at that start, then move forward with actual `W` before checking Esc/focus and WebGL remount.
- No separate cameras with decorative remote view, no teleport after activation, no relaxation of actual navigation collision or terrain.
- No network assets, geology/geographical claims, speculative human activity or animal models.

## Gates
Do not publish this candidate before W12C.1 and W12C.2 independent CI and visual acceptance. Exact SHA HOREB QA 6/6, Validate/Preflight and mobile screenshot comparison are mandatory; real Android/iOS GPU remains HOLD.
