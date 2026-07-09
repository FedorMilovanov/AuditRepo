# Stale canonical handoffs — pre Gill V10 — 2026-07-09

This archive index preserves the exact former current-truth documents without duplicating large files in the repository.

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

- project/registry/next-agent headers still pointed to source `14a49be8` from 2026-07-06;
- the matrix had later 2026-07-08 TTS updates and source header `75f807b`;
- Gill V10 began on `ac26d8e`, while final current source HEAD became `30d9fb61` during the pass;
- the previous project README embedded long incident histories beside current instructions;
- no single entrypoint represented current Gill Part IV/content-ownership research.

## Replacement

Current canonical entrypoints on branch `audit/gill-series-v10-canonical-2026-07-09`:

```text
projects/gb-is-my-strength/verified/START_HERE.md
projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md
projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/
```

## Retention decision

- Raw incoming evidence was not deleted or rewritten.
- The old 401-line matrix was not copied into another active ledger.
- Git history at the immutable commit is the preserved original artifact.
- This index prevents the old documents from pretending to be current while avoiding repository duplication.
