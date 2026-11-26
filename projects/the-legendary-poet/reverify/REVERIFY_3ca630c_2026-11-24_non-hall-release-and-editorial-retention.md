# W93 — non-Hall release and editorial retention recheck

Date: 2026-11-24; Product anchor: `3ca630c47a93b9083216a1b7d79f5483d735d33b` (#619). Owner directed continued closure of all non-Hall work; Hall is deferred, no Hall permission or source change.

## Release residuals, not a terminal ZERO

- [#618](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/618) `f2f02fdb`: ahead=6, behind=1. [Actual job](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/45051135780/job/137297703374): core job failed the old Pushkin 390px navigation focus assertion, not an immersive-close assertion; the spec ended 1 flaky, 12 passed, 4 skipped. Other four browser jobs passed; merge certification failed. No fresh all-green certificate.
- Current main PoemQuickNav blob `ceee18e9983743483b43db8872c9ced5ab228cb2` has native tabIndex=-1; old #618/#614/#615 blob `1ff44033b7f7884588cab1cc86faecbc73ef224d` lacks it. QA blob also changed: `9869e5f84242c8ca2993310e1a9356af004e0479` vs `59eb44391a73472485930d876118d9cedc14aede`. Recheck after integrating #619 before claiming a new focus defect. [Handoff on existing #618](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/618#issuecomment-7117573080).
- #343 remains open: docs-only [#614 job](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/44946633709/job/137054388244) reported Escape received but immersive portal remained connected; [#615 job](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/44972245124/job/137055521084) reported modal-open=true after exit. Their ImmersivePlayer and useDialogSurface blobs equal current main (respectively `728618c5b243002989ac9a9223f65b7972bccf0f`, `c98b86fd7136b7a611310349555b25b0f1c4ca6f`). This is material repeated evidence, not an independently run current production reproduction. Existing #618 owns the repair, no parallel implementation.
- [#595](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/595) `14293782`, [core](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/44842839167/job/136655230386) and [desktop WebKit](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/44842839167/job/136655230485) failures include reading-block restoration >18,000px error, glyph placement and wrapped verse ink; these are candidate-branch failures, not demonstrated main regressions. Existing owner must extract and reverify on current main; do not wholesale merge Arena.
- #614 (one file) behind=2; #615 (two files) behind=1; both CI successful but browser gate red. #624 behind=0, CI successful; full Browser QA/brand/merge certification were still running at readback. Its workflow changes increase job-level budgets, not assertion tolerances; require full exact-head gates. #620–623 remain separate dependency lanes.

## Editorial retention — narrow source proof

Compared actual contents and Git blobs at Product main anchor vs corresponding surviving editorial branch. No need to restore these 13 files. This is retention evidence, not rights clearance, full branch retirement, or new editorial acceptance.

| Branch suffix | Research document | Main blob | Canonical TS blob |
|---|---|---|---|
| core-poets-corpus-wave1-20261117 | CORE_POETS_CORPUS_WAVE1_2026-11-17.md | 07db5a194fcdc2deb1ef255b8fece53682201f98 | not checked in this pass |
| blok-kulikovo-completion-ledger-20261120 | BLOK_KULIKOVO_III_V_SOURCE_AND_EDITORIAL_PACK_2026-11-20.md | d2e083bd45ca24c2ffee99747e28af5575710ce8 | 07763ada3835796c040466a66373b2d566fb4532 |
| ak-tolstoy-fulltexts-source-20261121 | AK_TOLSTOY_FULLTEXTS_W79_2026-11-21.md | 5675ebafcfbd9043a9e33f02ddf076715f87151e | 5ed16cf6653dc55951664374a95b76d2da289874 |
| mandelstam-1909-fulltext-rights-gate-20261121 | MANDELSTAM_FULLTEXT_RIGHTS_W80_2026-11-21.md | 0d9636d38a784b38415554ec21ba43b074cf5f28 | 245d2fcd4e6609720f2b87824b8b7fcb00d37ce2 |
| simonov-archival-context-rights-w81-20261121 | SIMONOV_TWO_EXCERPTS_W81_2026-11-21.md | 7a44a679b7dc3dbed51bd922863768540d1e5a69 | 4a4b7cad6f251d8babec18bf1fe2a493ac11db47 |
| nekrasov-two-complete-poems-20261121 | NEKRASOV_TWO_FULLTEXTS_W78_2026-11-21.md | 6e7971c2b07f1a75d3b53ab77714fc32db6718fc | fe53e85ef4edaa497eaad6fe5473c63fed05a909 |
| tsvetaeva-two-complete-poems-20261121 | TSVETAEVA_TWO_FULLTEXTS_W77_2026-11-21.md | bfb18e76d4a7c6ac1816e1cb39207349ebdbb6a6 | cca3952f3304bea931e6fa421dc28e298eabfaf9 |

All six supplementary docs and TS blobs match exactly. The core document branch blob `d7700030ab88ee98d2f5d80f17b72b732a1cdeae` differs only by one trailing space each on lines 139, 181, 266; 809/809 lines match after trimEnd. All paths relative to Product docs/research and src/data/library respectively. Do not use this partial file proof to delete the full branches.

## Disposition

Existing Product PR owners retained. No Product source, provider, rights, Hall, workflows or local files changed. Local directory census found multiple Reader and editorial checkouts; preserve until tracked/untracked/git-ref and active-agent checks complete. Current release certification is not established; the prior empty engineering matrix cannot serve as terminal attestation. Promote only current-confirmed independent engineering roots after current-browser verification, not every historic symptom. 
