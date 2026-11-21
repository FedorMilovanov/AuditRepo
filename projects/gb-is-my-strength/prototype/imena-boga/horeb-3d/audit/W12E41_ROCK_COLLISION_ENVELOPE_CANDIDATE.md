# W12E.4.1 — fail-closed visible-rock / physical-collider alignment

## Independent issue found while W12E.4 art CI was still running
The accepted prior rock shapes (`new THREE.DodecahedronGeometry(1,0)`) are scaled anisotropically and rotated about Y and small X/Z angles before rendering. But legacy `midianRockPoint` supplied **unrotated axis-aligned ellipse radii 0.68×sx and 0.68×sz** to `midianWalkable`. That ellipse does **not** enclose the visible rotated dodecahedron: the visual stone can extend beyond its obstacle footprint. Earlier W11D test checked only the rock **centre**, so it could never expose this error. A separate mathematical projection of the regular unit-radius dodecahedron across the current 132 rock placements found at least one protruding above-ground vertex for each rock. This is a geometry/physics mismatch risk, not a reported in-browser collision penetration.

## Minimal structural candidate
- Keep identical 132 actual W12E.4 rock placements, original 145 deterministic seed inputs, instanced mesh, geometry, material, rotations, colours, terrain, 42 dossiers, physical walking controller and sun.
- Use a **circumscribed projected circular collider**, radius `Math.max(sx,sy,sz)` in both horizontal directions. All vertices of a radius-1 THREE dodecahedron lie in that world-space sphere after arbitrary rotation. A circle with that radius safely encloses the projected mesh. This is intentionally conservative rather than a falsely precise ellipsoid.
- Include *every* stone whose new radius could intersect the playable x=±18,z=±22 rectangle, using `abs(center)-radius<extent` instead of the old fixed +1.7m margin; never have a rock body without a corresponding obstacle near the walkable boundary.
- Replace the stale test asserting `rx=.68*sx, rz=.68*sz` and add an explicit test reading the **actual THREE.DodecahedronGeometry(1,0)** vertex attribute, applying nonzero Euler rotation to each scaled vertex and checking every projected vertex lies within the new collision circle; also assert exact collider index coverage and the whole protected entry line remains walkable.
- Tests and code are intentionally detached until W12E.4 exact-SHA 6/6 and original art PNG inspection. No material/draw call/asset cost; collisions become **larger** near stones, so the four pedestrian shards and real Midian browser walkthrough must be repeated after any publication. The four 42-dossier shards alone do not prove Midian movement safety.

## Strict caveats
No claim of new historically authenticated objects, real Android/iOS FPS, visual ART PASS, or actual observed camera penetration. The old bug was inferred from mathematical geometry and source. Release, overall Midian ART, research/rights, actors, flocks, voice and future Exodus 3D worlds remain HOLD. One Draft PR #543, canonical lane, no main/Research/Product/dirty local W10D edits, new branch, force-push or deployment.

## Refinement of detached collision candidate
Exported deterministic `midianRockOrientation(index)` now supplies both the renderer and the new exact-facet test. The test applies the *same* Euler angles to vertices in `THREE.DodecahedronGeometry(1,0)`, not an approximated or duplicated rotation. Still detached while W12E.4 CI runs.
