# Current intake index — 2026-06-25

## Imported incoming set

### arena-agent (method: Playwright + production-like `dist`)
Source intake folder:
- `projects/gb-is-my-strength/incoming/arena-agent/2026-06-25/`

Imported files:
- `premium-svg-pages-bug-investigation-2026-06-25.md`
- `safe-docs-and-contract-scan-2026-06-25.md`
- `deep-safe-bug-verification-2026-06-25-round2.md`
- `deep-safe-bug-verification-2026-06-25-round3.md`
- `deep-safe-bug-verification-2026-06-25-round4-audit-drift.md`
- `premium-surface-bug-matrix-2026-06-25.md`
- `PREMIUM_CONTROLS_ROUTE_MAP_2026-06-25.md`

### arena-agent-2 (method: runtime Node DOM-stub + root-source grep)
Source intake folder:
- `projects/gb-is-my-strength/incoming/arena-agent-2/2026-06-25/`

Imported files:
- `cross-validation-runtime-2026-06-25.md`
- `runtime-js-bugs-2026-06-25.md`

## Working docs copied for verifier convenience

- `working/premium-surface-bug-matrix-2026-06-25.md` (arena-agent original matrix)
- `working/PREMIUM_CONTROLS_ROUTE_MAP_2026-06-25.md`
- `working/cross-validated-bug-matrix-2026-06-25.md` (arena-agent-2 synthesis,
  dedupes both intakes into a single B-01..B-10 matrix)

## Suggested next step for verifier

1. Read all `incoming/arena-agent/**` and `incoming/arena-agent-2/**`.
2. Start from `working/cross-validated-bug-matrix-2026-06-25.md` — it already
   dedupes both agents.
3. Note the **source-vs-artifact split**: B-01..B-06 reproduce in source (and dist);
   B-09 (stray hash) / B-10 (duplicate IDs) reproduce **only in dist** → run a fresh
   `strangler:build:production-like` to resolve their status before escalating.
4. Move only confirmed cross-layer items into `verified/`.
