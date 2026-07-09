# Working — gb-is-my-strength

This folder contains active synthesis drafts that are **not ready for `verified/`**.

## Current entrypoint

- `START_HERE_2026-07-09.md` — Gill V10 candidate matrix; current source HEAD `ff55161b`, audited functional tree `30d9fb61`, empty net file delta; W1 `verified-source`, `needs-cross-verification`.

## Layer contract

- `incoming/` supplies raw evidence.
- `working/` deduplicates and structures candidate findings.
- `verification/` resolves witness thresholds, disputes, severity and promotion.
- `verified/` contains only canonical ledgers and approved handoffs.

The Gill V10 candidate rows must not be treated as implementation instructions until the verification queue promotes them. A tree-identical freshness recheck is not an independent second witness.

Historical/stale working documents remain under `archive/2026-07-03-stale-working/`. Do not restore old competing matrices here.