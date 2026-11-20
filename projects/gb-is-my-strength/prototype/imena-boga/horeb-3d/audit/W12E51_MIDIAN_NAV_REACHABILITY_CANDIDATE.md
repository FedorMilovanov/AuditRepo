# W12E.5.1 — detached connectivity safety gate for Midian well

## Why this test exists
W12E.4.1 changed projected collision footprints to fully cover actual rotated DodecahedronGeometry vertices; W12E.5 then changed placements and size distribution of all remaining rocks. Both share same rendered and collision coordinate generator, and targeted browser `tests/browser-midian-walk.mjs` verifies forward steps from the actual start, touch movement, and scene mount/unmount. The independent four side pedestrian jobs walk the *legacy 42-dossier galleries*, **not all corners of the independent Midian well**. A full-loop navigation topology regression was untested.

## Narrow source-only candidate
- Add a single deterministic 0.5m-grid 2D reachability guard to `tests/run.mjs`, over the exact playable rectangle x ∈ [-18,18], z ∈ [-22,22]. Reuse actual exported `midianWalkable`, so the well, trough and exactly the W12E.5 published collision instances all contribute.
- BFS from grid cell nearest canonical start (5.2,7.6) using four physically adjacent lattice neighbors.
- Require more than 5,900 passable cells, **over 99.9% reachable**, reachability of the *walkable approach* at (0,2.5), an independently walkable straight path from (5.2,7.6) to (0,2.5), **and explicitly blocked solid well centre (0,0)**. Do not demand 100% because discrete circles can create incidental isolated grid points without affecting real continuous motion; *any larger disconnected region fails*.
- Independent exact W12E.5 JS formula and same world bounds produce 94 accepted visual rocks, 35 active colliders, 6,016 passable 0.5m cells, 6,014 reachable (99.9668%), 2 disconnected fringe grid points (x=-15/-14.5,z=-13). This is a mathematical grid experiment **not** proof of browser or hardware performance.
- No geometry, materials, textures, WebGL scene, walking code, collision values, camera, sources, rights, images, people or history are altered by this test.

## CI failure and correction (20 Nov 2026)
The initial W12E.5.1 code SHA `85815e1` was **rejected** at HOREB QA #44720462610 (159 passed, 1 failed), because the new test's 17-point approach was incorrectly interpolated from start (5.2,7.6) to the physically blocked **centre (0,0)**. The final three points of that line overlap the well cylinder; that is **correct world behaviour**, not a navigation regression. The source-level check simultaneously required `midianWalkable(0,2.5)`, exposing the test's internal inconsistency.

The corrected 17-point path interpolates from (5.2,7.6) to **(0,2.5)**, a walkable position outside the solid well perimeter; it explicitly asserts `!midianWalkable(0,0)` so a change accidentally permitting passage through the well also fails. Independent literal evaluation of the published W12E.5 placements verifies all 17 corrected points are passable; the three failing centre-targeted points are all blocked as designed. BFS threshold, grid resolution, colliders and true well geometry are **unchanged**. This is a test-only correction, not a relaxation. Exact-SHA new CI required; no acceptance inherited from failed parent.

## Acceptance and restrictions
W12E.5 baseline already has exact-SHA HOREB QA 6/6 and original desktop/mobile images accepted for narrow declumping improvement. W12E.5.1 remains a new, test-only candidate until its own 160/160 source tests, 198/198 geometry, 8/8 placement, full Chromium + four side shards, Validate and Preflight all succeed. Additional real well walk QA remains valuable because lattice connectivity doesn't replace camera/player physics or touch gestures. Main, Research, Product, unfinished Windows W10D and release HOLD; one existing Draft PR/branch; no force-push, deployment, new PR or merge.
