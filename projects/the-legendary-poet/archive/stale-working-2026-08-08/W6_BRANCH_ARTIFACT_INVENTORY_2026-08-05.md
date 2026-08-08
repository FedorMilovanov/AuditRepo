# W6 branch and artifact inventory — verified retirement preparation — 2026-08-05

## Purpose and truth boundary

This document classifies the TheLegendaryPoet branch/artifact surface after W5, current-truth repair, W6 selective extraction and governance closure. It authorizes no wholesale old-branch merge and does not claim physical ref deletion.

Current verified source production: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

Durable rules:

1. source `main` is runtime authority;
2. exact AuditRepo evidence is promoted only after source merge;
3. old branches are retired only after unique value is extracted or durably archived;
4. publication rights are never inferred from acquisition, filenames or hashes;
5. `RETIRE_READY` means forensic barriers are satisfied, not that the ref is absent.

## Final source inventory before physical deletion

Observed source refs: **31**.

- `main` — current production authority;
- `archive/deep-research-local-images-20260724` — intentional retained archive ref at `909df9f73b8d9be6faa58cbee767603954e3fb17`;
- **29 old refs** classified `RETIRE_READY`.

The 29 stale refs are exactly:

### Trigger / transport — 15

`agent/marathon-audit-trigger-20260805`, trigger2 through trigger8, clean-security, two dependency triggers and four Router-8 triggers. Exact PR/head mapping is in `W6_TRIGGER_REF_RETIREMENT_MAP_2026-08-05.md`.

### Completed/superseded source waves — 11

- `audit/discovery-artifact-contract-20260805`;
- `audit/content-model-unification-wave2-20260805`;
- `audit/immutable-essay-publication-w2-20260805`;
- `audit/immutable-essay-publication-20260805`;
- `audit/community-scaling-w3-20260805`;
- `audit/community-target-scaling-w3-20260805`;
- `integration/community-target-scaling-w3-final-20260805`;
- `integration/community-w3-hardening-production-20260805`;
- `audit/premium-browser-certification-w5-20260805`;
- `audit/premium-reader-journeys-w5-20260805`;
- `agent/current-state-truth-contract-20260805`.

Their exact production successors are recorded in `W6_COMPLETED_WAVE_REF_SUCCESSOR_MAP_2026-08-05.md`.

### Arena evidence — 2

- `arena/019fcf76-thelegendarypoet`;
- `arena/019fcf77-thelegendarypoet`.

Their three unique audit documents are physically stored byte-identically under `archive/stale/arena-2026-08-05/`; all three source and target blob SHAs match. Old runtime is represented by stronger current production or rejected as obsolete.

### Deep old work ref — 1

- `work/local-images-playwright-wtoc@909df9f73b8d9be6faa58cbee767603954e3fb17`.

Every path has an ordered family outcome in `W6_EXTRACTION_LEDGER_STAGE1_2026-08-05.md`. Current product value was selectively merged through source #324 as production `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`; all other bytes/history are preserved by the identical retained archive ref `archive/deep-research-local-images-20260724`.

## Final AuditRepo inventory before physical deletion

Observed AuditRepo refs: **28**. This lane owns only four TLP refs:

- `audit/tlp-w2-immutable-publication-closure-20260805` — `RETIRE_READY`;
- `audit/tlp-w3-hardening-w4-closure-20260805` — `RETIRE_READY`;
- `audit/tlp-w4a-closure-20260805` — `RETIRE_READY_AFTER_PR185_MERGE`; unique evidence is preserved under `archive/stale/w4a-a11f6fa-2026-08-05/`;
- `audit/tlp-w6-branch-artifact-inventory-20260805` — current PR #185 owner and expected to auto-delete after merge.

All Search, TTS, accessibility, Avraam, photo, generic Arena and intentional archive refs are outside TLP deletion authority and remain untouched.

## Source extraction and governance already promoted

### Source #324

- exact tested head `6146e6f5da81c7904fd1bb135c22a409f3e12719`;
- all triggered contracts successful;
- Articles catalog acceptance successful across Chromium, Android and iPhone;
- Manual Browser QA run `31046697422`, 4/4 successful;
- expected-head squash `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`.

It extracted only C03/C08 verified Mayakovsky metadata and exact PR77 ledgers; 28 unresolved candidates remain blocked.

### Source #326

- exact tested head `e3a1a877ebb14eb2e163b14995ded592cf553909`;
- full source matrix and Manual Browser QA run `31048128145`, 4/4 successful;
- expected-head squash/current production `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`;
- package identity, Node support, `UNLICENSED` and exact-SHA release policy are now machine-checked.

## Physical deletion barrier

The connected GitHub capability does not expose `DELETE /git/refs/heads/<name>`. Local network access to GitHub is unavailable, so CLI deletion cannot be executed from this environment. Force-moving refs to `main` is forbidden because it destroys forensic identity without deleting the branch.

The remaining repository-maintenance operation is explicit and external:

- delete **29** stale source refs, retaining `main` and `archive/deep-research-local-images-20260724`;
- delete **3** stale TLP AuditRepo refs after PR #185 merges;
- re-list both repositories and prove every manifest target absent.

## Current W6 status

`CONTENT/ARTIFACT CLASSIFICATION COMPLETE / SOURCE EXTRACTION MERGED / GOVERNANCE MERGED / ARENA ARCHIVED / DEEP HISTORY PRESERVED / 32 REFS RETIRE_READY / PHYSICAL DELETE-REF AND ABSENCE RECHECK OUTSTANDING`.

W6 remains `active-current` until the external deletion and absence recheck are completed. This is the final capability boundary, not an unclassified code or evidence gap.
