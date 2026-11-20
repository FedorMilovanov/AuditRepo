# W12E.5.1 — detached connectivity safety gate for Midian well

## Why this test exists
W12E.4.1 changed projected collision footprints to fully cover actual rotated DodecahedronGeometry vertices; W12E.5 then changed placements and size distribution of all remaining rocks. Both share same rendered and collision coordinate generator, and targeted browser `tests/browser-midian-walk.mjs` verifies forward steps from the actual start, touch movement, and scene mount/unmount. The independent four side pedestrian jobs walk the *legacy 42-dossier galleries*, **not all corners of the independent Midian well**. A full-loop navigation topology regression was untested.

## Narrow source-only candidate
- Add a single deterministic 0.5m-grid 2D reachability guard to `tests/run.mjs`, over the exact playable rectangle x ∈ [-18,18], z ∈ [-22,22]. Reuse actual exported `midianWalkable`, so the well, trough and exactly the W12E.5 published collision instances all contribute.
- BFS from grid cell nearest canonical start (5.2,7.6) using four physically adjacent lattice neighbors.
- Require more than 5,900 passable cells, **over 99.9% reachable**, reachability of the position (0,2.5) on the actual well approach, and an independently walkable start-to-centre line. Do not demand 100% because discrete circles can create incidental isolated grid points without affecting real continuous motion; *any larger disconnected region fails*.
- Independent exact W12E.5 JS formula and same world bounds produce 94 accepted visual rocks, 35 active colliders, 6,016 passable 0.5m cells, 6,014 reachable (99.9668%), 2 disconnected fringe grid points (x=-15/-14.5,z=-13). This is a mathematical grid experiment **not** proof of browser or hardware performance.
- No geometry, materials, textures, WebGL scene, walking code, collision values, camera, sources, rights, images, people or history are altered by this test.

## Acceptance and restrictions
Detached follow-up only, no canonical branch edit before W12E.5 has exact-SHA terminal HOREB QA 6/6 and original desktop/mobile screenshots audited. When/if promoted, require a separate exact-SHA CI: 160/160 source tests, 198/198 geometry, 8/8 placement, full Chromium + 4 side shards, Validate/Preflight. Additional real well walk QA remains valuable because lattice connectivity doesn't replace camera/player physics or touch gestures. Main, Research, Product, unfinished Windows W10D, and release HOLD; no new PR or branch, force-push, deployment or merging.
