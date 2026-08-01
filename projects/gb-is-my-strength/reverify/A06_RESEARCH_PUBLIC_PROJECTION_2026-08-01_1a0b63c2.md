# A06 — Research → public projection evidence

**Дата:** 2026-08-01  
**Evidence status:** `VERIFIED_SOURCE_CONTROL_PLANE / NO PRODUCT DELTA / NO PRODUCTION CLAIM`  
**AuditRepo base:** `dd18fc4f68dc733586c981818dd7d99db0704293`  
**Research merge:** `1a0b63c2e5f36da54c96c8744b4866911932e91b`  
**Research PR:** `FedorMilovanov/Research#88`  
**Research exact tested head:** `c1bab60d18c7e824605ee6397f2218a30519dc91`  
**Product source snapshot:** `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`  
**Last exact production authority:** unchanged from canonical AuditRepo authority  
**Production claim:** `no`

## Scope

This reverify records the independently merged Agent 06 Research control plane. It does not alter the Product source repository, the canonical bug matrix, open/closed counters, or the exact-production authority.

Agent 06 establishes the current relationship:

```text
Research corpus
  → typed publication disposition
  → bounded route/page/claim target
  → physical custody and rights boundary
```

Research presence and Drive custody are explicitly insufficient for public promotion.

## Verified Research owners

Research merge `1a0b63c2e5f36da54c96c8744b4866911932e91b` adds exactly seven files:

1. `PUBLIC_PROJECTION_CURRENT_AUTHORITY_2026-08-01.md`
2. `data/public-projection-queue-2026-08-01.json`
3. `data/public-projection-queue-2026-08-01.csv`
4. `data/physical-rights-ledger-2026-08-01.json`
5. `data/physical-rights-ledger-2026-08-01.csv`
6. `scripts/validate_public_projection_queue.py`
7. `.github/workflows/public-projection-queue.yml`

The queue JSON and physical-rights JSON are the machine owners. CSV files are checked projections; the Markdown file is the human dashboard.

## Exact decision snapshot

| Field | Verified value |
|---|---:|
| Corpus records | **10** |
| `PROMOTE` | **0** |
| `REFERENCE` | **3** |
| `SUPERSEDED` | **0** |
| `BLOCKED` | **7** |
| Physical-rights records | **7** |
| Records already represented on public routes | **7** |
| Product writes authorized by Agent 06 | **0** |

The five permitted blockers remain distinct:

- `EVIDENCE_HOLD`;
- `LOCATOR_HOLD`;
- `ARCHIVE_HOLD`;
- `RIGHTS_HOLD`;
- `PUBLICATION_HOLD`.

No untyped `HOLD` is accepted by the validator.

## Physical custody and rights boundary

Drive metadata was used only to confirm physical custody/navigation for bounded packages:

- approved ephemera 63 package and four original ZIP parts;
- editorial PDF checksum/file examples;
- approved core poet portrait folders;
- Bratsky Listok audit/register and Russian Baptist archive catalog;
- Russian Baptist consolidated register and archive finding aids.

The ledger does **not** convert those objects into production-eligible media. Item-level provenance, licence/reuse basis, credit line, identity/content review and a target route owner remain required. Canonical Gill and Biblical Atlas physical-rights packages were not identified and remain fail-closed.

## Exact-head CI evidence

Research workflow run: `30684080536`  
Workflow: `Research Public Projection Authority`  
Conclusion: `success`

Successful steps:

- exact-head checkout;
- Python validator compilation;
- queue, rights ledger and dashboard validation;
- JSON↔CSV convergence;
- source-authority path existence;
- typed disposition and hold vocabulary;
- Drive object identifier/title integrity;
- fail-closed `PROMOTE` requirements;
- read-only proof with `git diff --exit-code`.

Review threads on Research PR #88: **0**.

## Product boundary

Product `main` remained exactly `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` throughout Agent 06. The only open Product lane at Research merge time was PR #680 (`A03 NoteRegistry`), which Agent 06 did not touch.

Because the current queue contains `PROMOTE=0`:

- no Product branch or PR is authorized by Agent 06;
- existing public routes are not declared faithful merely because a Research corpus is closed;
- no media file is authorized for publication by Drive presence;
- future Product work must cite one concrete `PROMOTE` record and remain within its route/claim boundary.

## AuditRepo decision

This file is evidence-only.

- `verified/MASTER_BUG_MATRIX.md`: **unchanged**;
- canonical counters: **unchanged**;
- `NEXT_AGENT_PROMPT.md`: **unchanged**;
- current Product source authority: **unchanged**;
- exact production authority: **unchanged**;
- production/live deployment: **not claimed**.

Agent 06 is source-control-plane complete only after this evidence PR itself passes exact-head AuditRepo validation, merges, and its branch is cleaned up.
