# bible-bot — Render control-plane verification — 2026-09-12

## Exact anchors

- Product `main`: `3bfc89822a25e0a46f0c255b5637dfe75fe4af74`
- Live Render service: `srv-d5uair7pm1nc73de0uqg`
- Product tracking issue: `bible-bot#128`

## Code/deploy identity

The latest live Render deploy commit exactly matched Product `main`, so this wave did not establish stale application code.

## Declared vs live control plane

Repository `render.yaml` declares:
- region `frankfurt`;
- `healthCheckPath: /production/ready`;
- `autoDeployTrigger: checksPass`;
- start command `python production_entrypoint.py`.

Live Render service reported:
- region `oregon`;
- empty health-check path;
- auto deploy trigger `commit`;
- branch `main`;
- plan `free`;
- start command `python production_entrypoint.py`.

## Runtime witness

All current readiness surfaces were healthy at the audited boundary:
- `/live` → status ok;
- `/ready` → database ready;
- `/telegram/ready` → ready, transport webhook;
- `/production/ready` → database + Telegram ready, transport webhook.

Observed runtime metrics were low/stable during the sampled period, with memory around 80–81 MiB. This proves the current service is not in outage; it does not make the control-plane drift disappear.

## Root cause and preservation boundary

The repository already exposes the intended production readiness contract. The defect is that Render is not configured to consume that contract and promotes on commit rather than on checks-passed policy. Region is a deliberate infrastructure choice and must not be changed silently.

## Closure proof required

1. Render health check path becomes `/production/ready`.
2. Auto-deploy trigger becomes checks-passed behavior.
3. Region is explicitly accepted as Oregon or deliberately migrated/recreated to Frankfurt.
4. One resulting deployment is observed.
5. All four readiness endpoints and webhook delivery are reverified.

Until then `BB-RENDER-CONTROL-PLANE-001` remains active.
