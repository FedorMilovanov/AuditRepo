# Proposal — Gill content/research audit matrix integration

## Identity
- Project: `gb-is-my-strength`
- Proposed by: `gpt-5-5-gill-content-research-audit`
- Date: `2026-07-09`
- Source HEAD: `08d9fd1ed097f36a8ad0e3b0ff20eb48e3c080cf`
- Functional source HEAD: `f5e000e87f7fe148ee6ea6b3f9623dfe1d207a35`
- Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- Target finding ID(s): `GILL-AUDIT-001…010`; evidence index `GILL-CONTENT-001…480`
- Proposal type: `merge / split / severity / repair-lane / canonical-ledger intake`

## Current state

`verified/MASTER_BUG_MATRIX.md` tracks implementation-facing technical and UI defects, including multiple Gill rail/TOC items, but it has no governed content/research lane for the five Gill articles and Research backend.

The new audit contains 480 mixed-status items. Directly adding all 480 as open canonical rows would violate the verification ladder and make the matrix unusable.

## Proposed change

### Stage 1 — matrix pointer, no counter change

Add a noncanonical section to `verified/MASTER_BUG_MATRIX.md`:

```md
## 📥 PENDING VERIFIER SYNTHESIS — Gill content/research audit

- Intake: `incoming/gpt-5-5-gill-content-research-audit/2026-07-09/REPORT.md`
- Full artifact: `.../artifacts/GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md`
- Scope: five Gill routes + Research `Джон Гилл/00–42`
- Findings indexed: 480
- P0/P0–P1 candidates: 75
- Explicit HOLD / needs-source items: 101
- Status: raw mixed-status evidence corpus; not included in open/closed counters.
```

### Stage 2 — verifier synthesis

Create umbrella canonical items rather than 480 rows:

| Proposed canonical ID | Scope |
|---|---|
| `GILL-CONTENT-CANONICAL-CLAIMS` | canonical facts, supersession and deployment crosswalk |
| `GILL-CONTENT-SOURCE-REGISTRY` | source tiers, access host, edition, page, quote mode |
| `GILL-CONTEXT-HISTORY-INTEGRITY` | legal/denominational/context errors |
| `GILL-PART1-BIOGRAPHY-INTEGRITY` | chronology, family, ordination, quotes, quiz |
| `GILL-PART2-RESEARCH-INTEGRITY` | Body structure, rabbinics, citations, scholarly framing |
| `GILL-PART3-LEGACY-INTEGRITY` | hyper-Calvinism, Spurgeon, Brown, epitaph, bibliography |
| `GILL-SPRAVOCHNIK-GLOSSARY-INTEGRITY` | timeline, works, glossary, source mapping |
| `GILL-IMAGE-PROVENANCE` | historical/reconstruction/AI labels |
| `GILL-RESEARCH-BACKEND-SUPERSESSION` | contradictory and superseded Research claims |

Each umbrella item should reference exact `GILL-CONTENT-*` IDs in the artifact.

### Stage 3 — repair-ready split

Promote only after current-head recheck and exact file/route scope. Keep unresolved institutional/quotation claims as HOLD.

## Evidence

- Intake report: `../REPORT.md`
- Full master: `../artifacts/GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md`
- Direct current-source checks: source `main@08d9fd1`.
- Research crosswalk: Research `main@58e1ea5`.
- Primary/academic evidence status is recorded per finding in the master.

## Why this matters

The current defect is not merely inaccurate prose. Without canonical ownership, a corrected fact can remain wrong in another article, quiz, glossary, Research summary or image caption and later be copied back into production. The proposed umbrella structure keeps the canonical matrix small while preserving all evidence.

## Proposal status: proposal-open

This proposal does not promote any item to `repair-ready` and does not change current open/closed counters.