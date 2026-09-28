# DOC MAP — bible-bot

Canonical model: `../../AUDITREPO_OPERATING_MODEL.md`.

| Fact | Owner |
|---|---|
| Source, tests, `render.yaml`, Telegram/Mongo lifecycle | `FedorMilovanov/bible-bot` |
| Live Render service settings, deploys, logs, metrics | Render control plane |
| Current verified necessary work | `verified/MASTER_BUG_MATRIX.md` |
| Significant current evidence | `verification/` / `reverify/` |
| Optional future work | `WORK_QUEUE.md` |

The former Render settings mismatch is closed by Product issue #128. Do not rewrite healthy readiness endpoints to compensate for a new platform mismatch without a fresh live witness; if one appears, open a bounded current check instead of reviving the retired row.
