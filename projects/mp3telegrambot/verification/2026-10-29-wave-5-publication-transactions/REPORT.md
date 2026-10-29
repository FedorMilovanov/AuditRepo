# mp3telegrambot audit — wave 5 publication transactions

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

Telegram audio/video publication ordering, cache commit boundaries, cached-pair rollback, request single-flight and deferred source-audio ownership. Product heads/owners were re-read first: `main` was unchanged; new PR #426 is Dependabot-owned; no new human repair owner exists.

## Verified strengths

- new LiveDub companion file IDs are persisted only after all required roles have been sent;
- cached clean/mixed roles are validated for presence and distinct Telegram identities before send;
- cache verification occurs before a complete video+companion pair enters the fast-resend cache;
- partial sends returned to the coordinator are deleted in reverse order and their cache entry is dropped;
- request-local single-flight suppresses concurrent duplicate companion transactions;
- 68 focused delivery, transaction and cached rollback tests passed.

Generic upload retries still have the unavoidable accepted-request/lost-response ambiguity of the Telegram Bot API. That residual requires durable operation identity or conservative retry policy; it is not misclassified here as a proven duplicate observed in production.

## `MP3-LIVEDUB-ROLLBACK-ORPHAN-001`

A deterministic rollback ownership hole exists before `_send_local_variant_uncommitted` returns.

The helper awaits `bot.send_audio`, receives a Telegram message, then extracts `message.audio.file_id`. If the returned message has no usable file ID, the helper raises immediately. Its caller appends the message to `sent_messages` only after the helper returns, so the already-visible Telegram message is absent from the rollback set.

A source-level executable probe used a successful fake `send_audio` response with `message_id=101` and an empty `audio.file_id`. The result was:

```text
RuntimeError ... Telegram не вернул audio.file_id
sent 1 deleted []
[LiveDubDelivery] new companion transaction rolled back=0/0
```

Thus the transaction reports rollback while leaving a companion message visible, violating its own all-or-nothing publication contract. Existing tests cover failure on the *next* send after one fully returned message, but not failure between send acceptance and ownership transfer.

**Closure boundary:** transfer message ownership immediately after `send_audio` returns, before validating cache metadata; on missing/invalid `file_id`, delete that exact message and propagate an outcome that records whether deletion succeeded. Add a regression witness for empty/missing `message.audio.file_id`, and ensure outer rollback does not double-delete.

## Disposition

One direct publication defect is admitted. The broader explicit coordinator and commit-after-complete design should be repaired forward, not replaced or rolled back.