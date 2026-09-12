# DOC MAP — bible-bot

Canonical model: `../../AUDITREPO_OPERATING_MODEL.md`.

| Fact | Owner |
|---|---|
| Source, tests, `render.yaml`, Telegram/Mongo lifecycle | `FedorMilovanov/bible-bot` |
| Live Render service settings, deploys, logs, metrics | Render control plane |
| Current verified necessary work | `verified/MASTER_BUG_MATRIX.md` |
| Significant current evidence | `verification/` / `reverify/` |
| Optional future work | `WORK_QUEUE.md` |

Do not rewrite healthy readiness endpoints to compensate for a platform health-check path that is simply not configured to call them.
