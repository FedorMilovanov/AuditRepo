# Intake metadata

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Subsystem:** Karty / MapEngine
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Agent:** GPT-5.6 Thinking
- **Date:** 2026-08-01
- **Audited source branch:** `main`
- **Starting source SHA:** `be970bfc13882119e99605ba1689605af4a4af8a`
- **Current source SHA at intake creation:** `65bf6c4a015c933aa3ec8d4046e587e58eabd568`
- **Final source SHA for this reverify:** `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`
- **AuditRepo base:** `a19c0510c013e4821c86261c16aeed7711b8bbc7`
- **Mode:** free-intake / current-head reverify

## Scope

Reverify selected Karty P1 rows from `verified/MASTER_BUG_MATRIX.md` against MapEngine v0.56, current route data and permanent regression guards. Record source repairs separately from stale or already-fixed historical findings.

## Final source closure boundary

Three unique source repairs are evidenced in this intake:

- Atlas geometry audit blind spots — source PR #659, merge `65bf6c4a015c933aa3ec8d4046e587e58eabd568`;
- Avraam heading lifecycle — source PR #665, merge `8a8ebf70d1a1e51a4f57d3d38a7ef4a97ff65e5b`;
- Karty story-ID schema/runtime alignment — source PR #666, merge `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`.

Superseded PRs #661, #663 and #664 were closed without force-push or content loss; their canonical diffs landed through #665/#666.

## Mutation boundary

This intake does not directly modify the canonical matrix, counters or another agent's report. Canonical status transitions remain verifier-owned. No production/live state is claimed.
