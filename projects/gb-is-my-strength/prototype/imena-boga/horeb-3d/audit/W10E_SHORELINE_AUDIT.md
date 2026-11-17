# W10E — 3D Nile shoreline and wetland composition (engineering candidate)

**One existing Draft PR #543; no release, no archaeological geolocation claim.**

The W10D visual inspection revealed papyrus standing in deep water, repetitive spacing and a flat-looking foreground. W10E corrects the actual physical shoreline, terrain and vegetation placement — not a 2D overlay or a decorative post-processing effect.

* **Coastal geometry:** one continuous meandering `nileShoreX(z)` shared by the rendered terrain, silt-water shallows, pedestrian safety boundary and wetland roots. Two gentle inlets remain physically smooth.
* **Ground:** `nileGroundY(x,z)` adds broad silt ridges, tiny local relief, a shallow runoff depression and a higher dry terrace; the wet lip stays at −0.14, with the water at −0.13. This is scenic, not a claimed excavated landscape.
* **Papyrus:** 91 deterministic bank roots now form five irregular vegetation clusters; 13 water-grown stems sit within approximately one metre of the shore, not mid-river. The basket and discovery gestures retain a clear central sightline. The existing 104 GPU-instanced plant meshes and branch counts are unchanged.
* **Performance:** root coordinates for physical collision are cached per narrative moment rather than recomputed in every movement frame. Figures, basket, waterline, finite-coordinate guards and walk limits retain their boundaries.
* **QA:** four new regression tests verify coast continuity, walkable dry ground, bank-root collision, shallow-water planting and unobstructed subject corridor. Prior W10B/C tests remain enabled. Browser QA, mobile viewport and software WebGL must pass on this exact SHA before marking engineering green.

**Local Windows WIP protection:** The Windows worktree `C:\Users\Fedor\Projects\horeb-w5c-20261115-isolated` contains *uncommitted* W10D work in `NilePrelude.ts`, and Desktop Commander has reached its monthly limit. The W10E commit intentionally does **not** modify that engine file. Before synchronizing the machine, preserve and inspect its local diff; never use `git reset --hard`, force-push, or silently overwrite W10D.

**ART HOLD:** faces and gestures, realistic linen materials, advanced atmospheric depth, authentic river optics, sound, actual device GPU load, and the separate Egypt/Midian scenes remain unfinished. A green engineering test is not cinematic acceptance.