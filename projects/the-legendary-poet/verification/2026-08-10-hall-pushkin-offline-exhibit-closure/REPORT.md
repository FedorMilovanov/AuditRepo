# TLP Hall Pushkin offline exhibit — merged closure verification

Date: 2026-08-10  
Project: `FedorMilovanov/TheLegendaryPoet`  
Architecture lane: `TLP-HALL-001` / Product #369  
Source PR: #403 `feat(hall): build first source-based Pushkin offline exhibit`

## Outcome

Product PR #403 is **MERGED**.

- exact tested PR head: `653ed65c102c09c39803193d95addf8aef739a34`
- source base before merge: `6c651613e7084e98e4f1afb1a75a18b6f46d52ff`
- merge commit: `256dd19f1e39eef341ca260a4d8c72e1b6f19d73`
- current Product `main` at closure check: `256dd19f1e39eef341ca260a4d8c72e1b6f19d73`
- pre-merge compare: `ahead=8`, `behind=0`
- post-merge compare from tested head to merge commit: one merge commit, **0 changed files**
- Product open PRs after merge: `0`

The resulting `main` tree is therefore the exact source tree that passed the terminal pre-merge gates. The merge commit changed ancestry only; it introduced no untested source bytes.

## Root cause closed inside the wave

The first Pushkin slice already required `budgetReportRequired: true`, but the original offline-exhibit validator/workflow did not require or verify a budget report. That allowed a false-green proof surface: the exhibit could satisfy its old final validator while a canonical slice requirement remained unproved.

#403 closed that audit/contract gap at the owning layer rather than with a manual note:

- added a separate offline budget authority;
- added a deterministic builder that measures the actual raw/optimized GLBs and embedded documentary texture identities;
- added a fail-closed budget validator;
- wired the validator into Project Contracts;
- wired report build + validation into the dedicated Hall workflow before final evidence publication;
- re-ran the budget validator at the final barrier after the walkthrough/ffprobe path.

The report explicitly refuses to manufacture browser/GPU facts that offline Blender evidence cannot prove.

## Exact-head terminal gates

All of the following completed successfully on `653ed65c102c09c39803193d95addf8aef739a34` before merge:

| Gate | Result |
|---|---|
| Project Contracts | SUCCESS |
| CI | SUCCESS |
| Brand deep reference and motion audit | SUCCESS |
| Hall greybox tooling / DCC | SUCCESS |
| Site route integrity audit | SUCCESS |
| Manual Browser QA | SUCCESS |
| Hall Pushkin offline exhibit | SUCCESS |

The dedicated Hall workflow completed the full evidence chain:

1. exact source re-download + SHA verification;
2. pinned Blender 4.5.12 identity;
3. H1/H2/H3 regeneration;
4. H3 material-bay rebuild + bounded lookdev;
5. ten fixed stills;
6. raw GLB Khronos validation;
7. preservation-safe Meshopt optimization;
8. optimized GLB Khronos validation;
9. first-slice budget build + validation;
10. still contact sheet + intermediate artifact;
11. separate authored 24-second walkthrough render;
12. independent ffprobe;
13. final exhibit + budget validation;
14. final artifact publication.

## Artifact evidence

### Still-review artifact

- artifact id: `9057080606`
- digest: `sha256:bf2ceefd4860c46a1c14de65e748c16e3a07fdf1c247c4d76846896615602fe4`

The ten exact-head stills were manually inspected. They preserve the accepted Pushkin exhibit state and do not regress to the earlier empty-wall/pedestal failures.

### Final exhibit artifact

- artifact id: `9058946051`
- digest: `sha256:a6c15d7164c139c22cca9dce116749ba033e6234316518b136dd9cf24096fd04`

Independent local re-check of the downloaded exact-head MP4:

- codec: H.264
- dimensions: 960 × 540
- frame rate: 24 fps
- frame count: 577
- duration: 24.041667 s
- bytes: 3,556,994
- SHA-256: `75ee2eabad523292d0b2566dc7cfd0e983c880ce5d1c5371a945baacdee26342`

Chronological sampled frames across approximately 0 → 23.5 seconds were inspected. The authored path remains on the Pushkin exhibit node, reads both the Kiprensky portrait and the 1833 Onegin title page, covers medium/close views and returns to the portrait without broken frames, wall penetration or pedestal fall-through.

This is QA evidence only; it is **not** owner visual-gate promotion.

## GLB / transport evidence

Raw and optimized GLBs both pass Khronos validation with:

- errors: `0`
- warnings: `0`

Measured exact-head budget facts:

| Metric | Value |
|---|---:|
| raw GLB | 12,541,228 bytes |
| optimized GLB | 12,520,580 bytes |
| Meshopt saving | 20,648 bytes / 0.1646% |
| documentary compressed bytes | 12,508,630 |
| documentary share of optimized transfer | 99.9046% |
| optimized non-documentary bytes | 11,950 |
| conservative RGBA8 decoded-texture estimate | 62,729,680 bytes |
| exhibit triangles | 196 |
| draw materials | 7 |
| exhibit mesh objects | 18 |

The dominant transfer cost is documentary imagery, not geometry. That is a useful later web-slice optimization fact, but this offline wave does not choose a production texture encoding.

## Metrics deliberately not claimed

The merged report keeps the following as unknown / `null` because offline evidence cannot prove them:

- production GPU residency;
- `renderer.info` runtime counts;
- desktop/mobile browser frame time;
- browser decode/load time;
- production texture encoding decision.

No production budget acceptance is inferred from the offline GLB report.

## Production boundaries retained

The merged wave does **not**:

- replace or activate production `/hall`;
- ship Three/R3F/WebGL Hall runtime;
- put rights-pending documentary media into a production manifest;
- treat the RGBA8 estimate as measured GPU residency;
- approve a production asset budget;
- self-promote `offlineVisualApproval`;
- self-promote `webVerticalSlice` or `fullMuseumScaleOut`;
- fabricate a historical facsimile/autograph or institutional permission.

Generated evidence remains fail-closed with production flags false and human owner visual approval required.

## Current lane disposition

`TLP-HALL-001` / Product #369 remains open by design. It is an owner-selected architecture lane, not a current engineering defect row.

The merged #403 milestone establishes:

- one source-based Pushkin offline exhibit;
- exact source-byte identities;
- deterministic still/video evidence;
- validated raw/optimized GLB transport;
- measured offline first-slice budget evidence;
- a class-level guard against silently skipping the canonical budget-report requirement.

Still independent / blocked until later explicit authority or evidence:

- owner `offlineVisualApproval` promotion;
- canonical production documentary approval, intended-use/credit disposition;
- production manifest shipping of documentary media;
- browser/GPU budget measurement and acceptance;
- production WebGL activation;
- `webVerticalSlice`;
- `fullMuseumScaleOut`.

## AuditRepo disposition

No row is added to `verified/MASTER_BUG_MATRIX.md`:

- the matrix remains `0` verified-current engineering defects;
- Hall #369 remains explicitly outside defect totals as a registered Product architecture lane;
- the budget-validator gap was discovered and closed inside the same source wave and leaves no independent current residual;
- no duplicate or historical symptom row is preserved merely to record the closure.

This report is the durable exact-SHA closure witness for the merged offline-exhibit milestone. Product remains the authority for current code, `main`, CI and later Hall gate state.