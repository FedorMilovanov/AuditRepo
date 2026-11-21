# W12D.3 — shared procedural textile weave, detached visual candidate

## Visual evidence and scope
Actual W12D.2 full Chromium [#44307416603](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44307416603) completed 6/6 HOREB QA + Validate/Preflight SUCCESS. Four saved screenshots show two new small storage baskets, a collision-free front opening and no roof seam regression. However giant roof faces, rear panel, floor mat and storage baskets still look like smooth brown slabs, rather than woven physical material. W12D.2 is engineering accepted but global ART remains HOLD.

## W12D.3 material-only correction
- One authored 128×128 RGBA `THREE.DataTexture` synthesized once at scene creation from bounded deterministic, **seamless periodic** yarn crossing functions. No download, licence dependency, historical weave attribution, HTML images, external assets, network or custom GPU fragment shader.
- Mipmapped repeat wrapping and restrained .014 bump scale, reused across nine *actual material bindings*: two roofs, two side drapes, one rear wall, one shaped rear gable, one floor mat and two anonymous storage baskets.
- The custom gable buffer receives explicit real `uv` coordinates to avoid applying the texture with missing UV geometry. Existing structural fabric geometry, collisions, field of view, entry, props, all other worlds, lighting and controls are unchanged.
- Explicit shared `weaveMap.dispose()` in the existing WebGL teardown prevents texture leaks across chapter navigation and remount. Node test checks yarn intensity nonuniformity, boundedness and periodic tile continuity; Chrome tests check one 128² texture and nine actual map+bumpMap mesh/material bindings, while preserving 42 dossiers and 8-zone physical walk.
- No added draw calls from surface meshes (same geometry and count), although map/bump texture sampling has GPU cost. Require screenshot inspection, actual-Chromium WebGL exit/remount, and real low-power hardware testing before claiming performance or ART.

## Independent release gates
This is an unreferenced DETACHED git commit based on accepted W12D.2 SHA `d2ef609bafea48ad0710c682fccb2ca2267d0ba7`. Do not merge into main or deploy. When pushing the same existing Draft PR #543, require exact known head and successful 6/6 W12D.2. Then require full independent exact-SHA HOREB QA 6/6, Validate, Preflight and real desktop/390px/interior PNG comparisons. Material authoring is hypothetical and does not assert the historical fabric or a verified Exodus 2 camp. Hardware mobile/rights/Research/art/release remain HOLD.

Do not modify local Windows work-in-progress `NilePrelude.ts`. One branch, no force push, no changes to Research or production.
