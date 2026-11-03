# Milovi School / Le Canon Sucré

- Source repository: `FedorMilovanov/Milovi_School`
- Production: https://french.milovicake.ru
- Default branch: `main`
- AuditRepo verified necessary work: **0 in MASTER**, as attested in the [2026-10-29 closure recheck](reverify/REVERIFY_877c8f4_2026-10-29_gsc-ownership-closure.md). This is an evidence-bound assessment, not a permanent claim that no later changes or tasks can arise.

## Current authority

The Product repository owns current source, working branches and PRs, exact-head CI and deployment truth. AuditRepo owns the evidence, current applicability assessment and compact active problem matrix.

The former external Google Search Console ownership/API-read blocker `MS-GSC-OWNERSHIP-001` was **closed on 2026-10-28**, after successful Search Console reads and inspection of 166 URLs. Sitemap discovery through `robots.txt` also works. Do **not** describe the old ownership problem as an active row: the current [MASTER](verified/MASTER_BUG_MATRIX.md) has zero active units. A read-only OAuth integration may not submit a sitemap manually; that limitation does not reverse confirmed Search Console read access or ordinary crawler discovery.

Historical evidence remains accessible, but is not a current Product bug. A new issue or failed release gate must be verified against current Product SHA and browser/API evidence before adding a MASTER row.

## Navigation

- [`DOC_MAP.md`](DOC_MAP.md) — division of authority.
- [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md) — current verified necessary work.
- [`reverify/REVERIFY_ae354dd_2026-11-03_media-and-repo-closeout.md`](reverify/REVERIFY_ae354dd_2026-11-03_media-and-repo-closeout.md) — exact Product release, image and branch-hygiene witnesses.
- [`reverify/REVERIFY_877c8f4_2026-10-29_gsc-ownership-closure.md`](reverify/REVERIFY_877c8f4_2026-10-29_gsc-ownership-closure.md) — successful GSC closure evidence.
- [`verification/2026-09-12-gsc-ownership/REPORT.md`](verification/2026-09-12-gsc-ownership/REPORT.md) — historical *blocked* state, not current.
- [`WORK_QUEUE.md`](WORK_QUEUE.md) — no admitted optional work.
