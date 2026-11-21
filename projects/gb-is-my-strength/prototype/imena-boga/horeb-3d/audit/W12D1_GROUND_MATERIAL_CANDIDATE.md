# W12D.1 — ground breakup and dry erosion relief (DETACHED candidate)

## Trigger from actual scene evidence
W12C.3's 390px comparison shows meaningful improvement in framing but the surrounding terrain remains uniformly tan and low-relief. A successful screenshot contract is not a successful artistic review. This candidate addresses only physical ground continuity and visible arid surface texture, not biblical persons or unverified dwellings.

## Grounded design distinctions
Research distinguishes *general north-west Arabian arid pastoral landscapes* from the **unlocated site** of the biblical Midian narrative. The Oxford scholarly entry *Midian* explains that even the exact geographical heartland and relevant material culture are uncertain: https://academic.oup.com/reference/62341/reference-article-abstract/554111915 . The systematic Western Nafud survey documents arid pastoral and settlement traces but does NOT identify an Exodus 2 family site: https://www.mdpi.com/2571-9408/8/11/456 . Qurayyah landscape survey discusses geomorphology, long-term water management and a proposed Midianite association without definitive identification: https://www.tandfonline.com/doi/full/10.1080/17445647.2019.1576068 . Treat those sources as cautious *visual environment references*, never as archaeology validating the rendered tent or Moses' walking coordinates.

## Reversible implementation scope
- Shared `homesteadGround(x,z)` gets ~0.135m maximum shallow dry erosion relief to one side of the main visitor corridor, plus tiny continuous ground undulations. Exactly the same height is used by the Three.js physical terrain vertices, rock instances, cloth and camera, preventing a visible floor versus navigation desync.
- World-coordinate ground vertex colours vary in broad/fine non-repetitive patterns and match the shallow channel, without a repeating external texture, network resources or run-time fragment shader.
- One additional `InstancedMesh`, 720 small *cosmetic* pebbles each under ~35 mm tall, with individual deterministic colour/rotation. Large boulders retain their existing W12B.1 exact-coordinate colliders; pebbles remain walk-through because their scale is below practical step height.
- Browser asserts 720 instances in exactly one visible mesh; Node asserts the erosion amplitude/location, continuity, finite heights and the unobstructed 390px-to-door corridor.
- Preserve W12C.4 real touch/keyboard, focus, frame and WebGL cleanup; 42 dossiers and all other worlds unchanged. Scene-specific only.

## Release and evidence gates
Rebased detached candidate based on W12D.0.1 frame-synchronized Chromium fix (inheriting W12D.0 rear gable); **not on the PR head**. Hold it until W12C.4 AND W12D.0.1 each independently pass exact-SHA HOREB QA 6/6 + Validate/Preflight, including real-touch script and a visually closed rear gable. On eventual push, run another independent 6/6 exact-SHA QA and compare matched homestead desktop / interior / mobile PNGs before claiming artistic progress. Nonmoving pebbles are not people, animals, vegetation or archaeological materials. Real mobile hardware GPU, fully constructed story actors, Research/rights/voice and Product release remain **HOLD**.

Safety: Only existing Draft PR #543, no new branches, no force push, no main merge, never modify local Windows W10D `NilePrelude.ts`.
