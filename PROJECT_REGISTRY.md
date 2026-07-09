# Project Registry

## Active projects

| Project | Source repo | Status | Canonical entrypoint |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | active; Gill V10 cross-verifying | `verified/START_HERE.md` |

## gb-is-my-strength — current state

- Current source HEAD: `2313f36f6aeaf7415e85d5e353e7e4cd10222ece`.
- Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.
- Existing canonical matrix: 90 closed/fixed IDs, 38 open rows.
- Gill V10: 11 candidates pending cross-verification; not included in the canonical open count.

Active entrypoints:

```text
projects/gb-is-my-strength/verified/START_HERE.md
projects/gb-is-my-strength/working/START_HERE_2026-07-09.md
projects/gb-is-my-strength/verification/START_HERE_2026-07-09.md
projects/gb-is-my-strength/reverify/START_HERE_2026-07-09.md
```

Raw intake is evidence only:

```text
projects/gb-is-my-strength/incoming/gpt-5-5-gill-series-master-audit/2026-07-09/
```

## Registry rules

- Name one canonical entrypoint per project.
- Do not count working candidates as verified open bugs.
- Current-head changes belong in `reverify/`, not in parallel status summaries.
- Preserve raw evidence, but archive superseded synthesis and intermediate SHA notes.
- Only verifier-promoted `repair-ready` findings may enter implementation.