# W12B.1 — homestead stone collisions (separate staged candidate)

## Verified engineering issue
In W12B, `MidianHomestead.ts` renders 64 large instanced stone meshes along the edges of the walkable region. The walking predicate `homesteadWalkable()` only restricts tent walls, hearth and storage pots. It does not test those visible rocks. A person can therefore walk through some actual rock meshes, unlike the already protected Midian well.

## Scoped remediation
Use one deterministic `homesteadRockPoint(index)` source for the 64 rendered mesh transforms and cached collider positions. Test a rotated ellipse approximation of each exposed stone inside `homesteadWalkable()`, with no separate conflicting random coordinate generator. Keep the central start-to-door corridor and walk through the real open A-frame intact. Report instance count to Chromium, test rock-centre rejection and same-coordinate identity in Node, assert render count in the homestead browser run. This is static, original 3D geometry with approximate player collision, not a rigid-body engine or archaeology.

## Integration gate
This Git tree is a **detached candidate only** based on W12B `bf003323`; it has not been TypeScript/Chromium/CI verified or published to the active PR. First require exact-head W12B all 6 HOREB jobs SUCCESS plus Validate and Preflight. Then recheck current branch head and test new candidate independently. Retain local Windows `NilePrelude.ts` W10D and no Product/Research/main changes; keep PR #543 Draft. ART/mobile-real-GPU/characters/animals/editorial/release HOLD.
