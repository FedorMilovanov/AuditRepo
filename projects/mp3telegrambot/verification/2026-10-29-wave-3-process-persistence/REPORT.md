# mp3telegrambot audit — wave 3 process ownership and persistence

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

Cancellation, timeout, subprocess-tree ownership, cleanup, SQLite connection policy and schema evolution. Product heads/owners were re-read before analysis: `main` remained unchanged and no new human repair owner was visible.

## Process and async result

The refactor materially improved ownership rather than merely changing types:

- asynchronous child processes are centralized behind `run_cancellable_process`, use argv execution without a shell, isolate the process group, terminate descendants and reap the direct child before returning on timeout/cancellation;
- non-cancellable executor work remains owned through repeated outer cancellation via `await_owned_coroutine`; soft deadlines do not release resources or launch duplicate work;
- dedicated long-lived Node, Local Bot API, Dub worker and PDF process paths retain explicit lifecycle/termination contracts;
- a full Ruff `ASYNC` scan found only ten `ASYNC109` naming/structured-timeout advisories, not blocking file/process calls;
- 86 focused process, process-tree, repeated-cancellation, cleanup, migration and legacy tests passed.

No process-orphan or semaphore-early-release root was admitted from this wave. Real provider/process behavior remains covered by the canary residual rather than being falsely declared complete.

## `MP3-DB-MIGRATION-FAILOPEN-001`

Core schema initialization treats every `sqlite3.OperationalError` raised by multiple `ALTER TABLE ... ADD COLUMN` statements as if it meant “column already exists.” The same broad suppression exists in generated-page and Gemini observability schema evolution.

SQLite uses `OperationalError` for materially different failures, including lock contention, read-only databases, disk/full I/O conditions and malformed/corrupt schema states. Consequently a required column migration can fail, be silently discarded, and allow startup to continue until a later user request reaches a query that assumes the column. The comment asserts only the duplicate-column case, but the exception boundary does not prove that case.

This is not repaired by WAL/busy timeout: those reduce ordinary contention but do not convert all operational failures into duplicate-column results. It is also not equivalent to optional PRAGMA setup; required application columns are a startup invariant.

**Closure boundary:** introspect existing columns (`PRAGMA table_info` or a versioned migration ledger), execute only missing migrations in an explicit transaction, and propagate every unexpected operational failure. Add fault tests for duplicate column versus lock/read-only/disk-I/O errors, plus post-migration schema assertions before declaring startup healthy.

## Disposition

One direct fail-open persistence defect is admitted. Existing process ownership is retained as a verified strength; no broad async rewrite is justified.