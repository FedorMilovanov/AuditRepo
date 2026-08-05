# W6 branch and artifact inventory — current reconciliation — 2026-08-05

## Purpose and truth boundary

This document classifies the TheLegendaryPoet branch/artifact surface after W5, current-truth repair and selective W6 source extraction. It authorizes no wholesale old-branch merge and does not claim physical ref deletion.

Current durable rules:

1. source `main` is runtime authority;
2. exact AuditRepo evidence is promoted only after source merge;
3. old branches are retired only after unique value is extracted or durably archived;
4. publication rights are never inferred from acquisition, filenames or hashes;
5. `RETIRE_READY` means forensic barriers are satisfied, not that the ref is absent.

## Current source inventory

Observed source refs during final reconciliation: **32**.

- `main` — current production authority;
- `fix/governance-release-contract-20260805` — active isolated governance PR #326; expected to auto-delete after merge;
- `archive/deep-research-local-images-20260724` — intentional retained archive ref at `909df9f73b8d9be6faa58cbee767603954e3fb17`;
- **29 old refs** classified `RETIRE_READY` after the current governance lane settles.

The 29 stale refs are exactly:

### Trigger / transport — 15

`agent/marathon-audit-trigger-20260805`, trigger2 through trigger8, clean-security, two dependency triggers and four Router-8 triggers. Exact PR/head mapping is in `W6_TRIGGER_REF_RETIREMENT_MAP_2026-08-05.md`.

### Completed source waves — 8

- `audit/discovery-artifact-contract-20260805`;
- `audit/content-model-unification-wave2-20260805`;
- `audit/immutable-essay-publication-w2-20260805`;
- `audit/immutable-essay-publication-20260805`;
- `audit/community-scaling-w3-20260805`;
- `audit/community-target-scaling-w3-20260805`;
- `integration/community-target-scaling-w3-final-20260805`;
- `integration/community-w3-hardening-production-20260805`.

Their production successors are recorded in `W6_COMPLETED_WAVE_REF_SUCCESSOR_MAP_2026-08-05.md`.

### W5 evidence — 2

- `audit/premium-browser-certification-w5-20260805`;
- `audit/premium-reader-journeys-w5-20260805`.

Both were synthesized into exact W5 head `0536547e178fb091de1a76c85aecec4409478975`, source #322, production `6f13600ba88f08123c8c1b817ffdc0ca3dec0bc0`. They have no independent merge authority.

### Superseded architecture truth — 1

- `agent/current-state-truth-contract-20260805`.

Source #323 closed unmerged. Its durable repair was rebuilt after W5 in source #325 and merged as production `db6bc3ea8997f78d1370a05e2736cf20645c80dd`.

### Arena evidence — 2

- `arena/019fcf76-thelegendarypoet`;
- `arena/019fcf77-thelegendarypoet`.

Their three unique audit documents are physically stored byte-identically under `archive/stale/arena-2026-08-05/`; source and target blob SHAs match. Old runtime is represented by stronger current production or rejected as obsolete. See `W6_ARENA_EXTRACTION_LEDGER_2026-08-05.md`.

### Deep old work ref — 1

- `work/local-images-playwright-wtoc` at `909df9f73b8d9be6faa58cbee767603954e3fb17`.

Every path has an ordered family outcome in `W6_EXTRACTION_LEDGER_STAGE1_2026-08-05.md`. Current product value was selectively merged through source #324 as production `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`; all other bytes/history are preserved by the identical retained archive ref `archive/deep-research-local-images-20260724`.

## Current AuditRepo inventory

Observed AuditRepo refs during final reconciliation: **28**. This lane owns only TLP refs:

- `audit/tlp-w2-immutable-publication-closure-20260805` — `RETIRE_READY`;
- `audit/tlp-w3-hardening-w4-closure-20260805` — `RETIRE_READY`;
- `audit/tlp-w4a-closure-20260805` — `RETIRE_READY_AFTER_PR185_MERGE` because its unique evidence is now preserved under `archive/stale/w4a-a11f6fa-2026-08-05/`;
- `audit/tlp-w6-branch-artifact-inventory-20260805` — current PR #185 owner; expected to auto-delete after merge.

All Search, TTS, accessibility, Avraam, photo, generic Arena and intentional archive refs are outside TLP deletion authority and remain untouched.

## Source extraction already promoted

Source #324:

- base `db6bc3ea8997f78d1370a05e2736cf20645c80dd`;
- exact tested head `6146e6f5da81c7904fd1bb135c22a409f3e12719`;
- all triggered contracts successful;
- Articles catalog acceptance successful across its three profiles;
- Manual Browser QA run `31046697422`, 4/4 successful;
- expected-head squash `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`.

It extracted only C03/C08 verified Mayakovsky metadata and exact PR77 ledgers; 28 unresolved candidates remain blocked.

## Physical deletion barrier

The connected GitHub capability can create/move refs and merge PRs but does not expose `DELETE /git/refs/heads/<name>`. Local network access to GitHub is unavailable, so deletion cannot be replaced by CLI. Force-moving refs to `main` is forbidden because it destroys forensic identity without deleting the branch.

Therefore the remaining repository-maintenance operation is explicit and external:

- delete **29** stale source refs, retaining `main` and `archive/deep-research-local-images-20260724`;
- delete **3** stale TLP AuditRepo refs after PR #185 merges;
- re-list both repositories and prove each target ref is absent.

## Current W6 status

`CONTENT/ARTIFACT CLASSIFICATION COMPLETE / SOURCE EXTRACTION MERGED / ARENA ARCHIVED / DEEP HISTORY PRESERVED / 32 REFS RETIRE_READY / PHYSICAL DELETE-REF OPERATION OUTSTANDING`.

W6 must remain `active-current` until the external deletion and absence recheck are completed. This is not a code or evidence gap; it is the final repository-maintenance capability boundary.
