# MASTER BUG MATRIX — bible-bot

> SSOT for current verified necessary work only.

## Current state

| Field | Value |
|---|---:|
| Active work units | **1** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **1** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Next boundary |
|---|---|---|
| `BB-RENDER-CONTROL-PLANE-001` | Live Render service is code-current but control-plane settings drift from repository `render.yaml`: live region `oregon` vs declared `frankfurt`; live `healthCheckPath` empty vs declared `/production/ready`; live auto-deploy trigger `commit` vs declared `checksPass`. Runtime readiness endpoints themselves are healthy. Product tracking issue: `bible-bot#128`. | Reconcile platform settings at their owner: set Render health check to `/production/ready`; set deploy trigger to checks-passed behavior; explicitly decide whether region stays Oregon or is deliberately migrated/recreated in Frankfurt. Then observe one deployment and re-probe `/live`, `/ready`, `/telegram/ready`, `/production/ready` plus webhook transport. Do not change healthy endpoint code merely to match current control-plane drift. |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Terminal disposition

One system root owns the entire current Render drift. Region choice is part of that root's closure boundary rather than a duplicate row.
