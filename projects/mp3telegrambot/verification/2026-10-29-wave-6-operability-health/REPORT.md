# mp3telegrambot audit — wave 6 operability and health semantics

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

HTTP health/readiness semantics, polling heartbeat, maintenance status, restart policy, health-server lifecycle and owner alerting. Product heads/owners were re-read first: exact `main` was unchanged; only stale human PR #203 and dependency PRs were open.

## Verified strengths

- the legacy `/health` heartbeat is advanced from the running bot loop rather than from inbound user traffic;
- `/healthz` checks the database file header/schema, disk floor, key configuration and maintenance outcome;
- maintenance failures are counted, logged and alerted to configured owners with anti-spam state;
- lifecycle policy rejects singleton conflicts and delegates unexpected failure restart to an external supervisor;
- health payloads avoid secret values and filesystem/user identities;
- 60 focused health, observability, lifecycle and restart tests passed.

The health-server thread logs a critical error if binding/serving terminates but does not currently fail the bot process. That is an operability concern, but external supervisors may intentionally own unreachable-health restart; it is not admitted as a separate root without deployment-policy evidence.

## `MP3-HEALTH-QUIET-TRAFFIC-001`

`/healthz` uses age of the last *received Telegram update* as a liveness signal. `runtime_status.record_update()` runs only when an inbound update enters handling. Therefore traffic silence and polling failure are indistinguishable.

The behavior is asymmetric:

- before the first update, `last_update_age_seconds` is `None`, so an indefinitely idle bot is healthy;
- after one update, any legitimate quiet interval above 300 seconds produces `updates_stale` and HTTP 503;
- another user message makes the same unchanged polling process healthy again.

A pure exact-source probe with healthy DB/disk/keys/maintenance, one historical update and `last_update_age_seconds=301` returned:

```text
503 ['updates_stale']
```

Thus a health-based supervisor can restart a correctly polling bot merely because users were quiet, potentially creating repeated restart churn. Existing tests assert the current threshold but do not distinguish transport heartbeat from user demand.

**Closure boundary:** derive readiness from a polling/transport heartbeat (successful `getUpdates` cycle, updater task state or the existing bot-loop heartbeat), retain last inbound update age as an informational metric only, and add tests for (1) long quiet healthy polling, (2) stalled polling with recent traffic, and (3) never-received traffic.

## Disposition

One direct health-semantics defect is admitted. Existing structured health and maintenance telemetry should be corrected at the signal source, not removed.