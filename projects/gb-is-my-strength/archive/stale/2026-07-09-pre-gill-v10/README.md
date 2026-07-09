# Stale canonical handoffs — pre Gill V10 — 2026-07-09

This archive index preserves the former current-truth documents without duplicating large files.

## Immutable source snapshot

AuditRepo commit:

```text
18713174a343740cc0886df6c6441c51bde61274
```

At that commit, the superseded documents are available at:

```text
projects/gb-is-my-strength/README.md
projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md
projects/gb-is-my-strength/verified/README.md
projects/gb-is-my-strength/verified/START_HERE.md
projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
PROJECT_REGISTRY.md
```

## Why they are stale

They mixed several time layers:

- project/registry/next-agent headers pointed to source `14a49be8` from 2026-07-06;
- the matrix had later 2026-07-08 TTS updates and another source header;
- Gill V10 began on `ac26d8e`, audited functional tree `30d9fb61`, and current source HEAD is `ff55161b` with an empty net file diff from that tree;
- no active working/verification entrypoint represented the Gill research state.

## Replacement by layer

### Canonical verified

```text
projects/gb-is-my-strength/verified/START_HERE.md
projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
```

### Working / verification

```text
projects/gb-is-my-strength/working/START_HERE_2026-07-09.md
projects/gb-is-my-strength/verification/START_HERE_2026-07-09.md
```

### Raw evidence

```text
projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/
```

The raw intake is not a canonical replacement document.

## Retention decision

- Raw incoming evidence was not deleted or rewritten as verified truth.
- The old 401-line matrix was not copied into another active ledger.
- Git history at the immutable commit preserves the original artifact.
- This index prevents old handoffs from pretending to be current while avoiding duplicate historical files.