# Comment / Challenge — `data-fc-mode="series-rich"` on heart-series (PC-002 lane)

- Target report: lane `premiumcontrols-heart-series-wiring-2026-06-26` (tip `099afce4`)
- Target finding: heart-series article roots (`KrajneBody.astro`, `Rimlyanam7Body.astro`) wired with
  `data-fc-root data-fc-mode="series-rich" data-fc-variant="heart"`
- Author of this comment: `arena-agent-premiumcontrols-rollout-verifier`
- Date: `2026-06-26`
- Recommended status: **disputed — must-fix-before-merge**

## Why disputed

1. **Not in the canonical plan enum.** The owner-supplied plan (`Полный план внедрения PremiumControls…`, p. 7) fixes the `data-fc-mode` enum as:
   `single | series-lite | gill | disabled`
   `series-rich` is not a member.

2. **Not handled by the controller.** `js/floating-cluster-controller.js` (main `09c2d34`, lines 434–437) only branches on `single`, `series-lite`, and `nagornaya`. With `data-fc-mode="series-rich"` the `activateSinglePilot()`/`activateSeriesPilot()` calls are **never reached** for heart-series roots. The result is exactly the failure class the plan calls out: "если agent не может объяснить, какой exact mode стоит у root … задача не закрыта."

3. **Inconsistent with the committed dist.** The built `dist` HTML for the same two routes uses `data-fc-controls="gill-rail"`, not `data-fc-root`/`data-fc-mode="series-rich"`. So even the lane's own approach disagrees with what shipped.

## Suggested resolution

Option A (preferred): heart-series is a **series-lite** archetype per the plan's route map (series articles without a Gill rail). Set:
```
data-fc-root data-fc-mode="series-lite" data-fc-variant="heart"
```
and confirm `activateSeriesPilot()` covers the heart affordances.

Option B: if a distinct `series-rich` behavior is genuinely intended, it must be (a) added to the plan's enum by owner decision, (b) implemented in the controller, and (c) enforced by `scripts/premium-controls-rollout-audit.js` (currently it is not — see PC-ROLL-06).

Either way, the lane should not merge until the mode is recognized by the controller and the dist/source wiring agree.
