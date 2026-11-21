# W12D.1.1 — deterministic Nile pointer test under SwiftShader

## Observed CI failure
The first W12D.1 run [#44300277314](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44300277314) failed in `tests/browser-nile-walk.mjs` before the W12D.1 homestead test. The real Nile touch-button click moved from `(6.629,1.336)` to `(6.472,1.248)`: ~0.18 m, below the *unchanged* required >0.20 m. The old test pressed the forward pointer for exactly 530 ms, then tested its displacement. SwiftShader software WebGL frame rate varies and can advance fewer animation frames during that wall-clock interval. This is an unstable test scheduling rule, not proof that Midian ground code broke Nile movement. Existing Nile engine/render files are not modified.

## Targeted test-only correction
- Keep the same real Chrome pointer button and the original >0.20m final forward displacement check. Require >0.235m physical movement from canvas `nileCameraX/Z` while the pointer remains down, with a bounded 15 s deadline, instead of relying on 530ms.
- Always release the pointer in `finally`, including a timeout/error. Real nonmovement still fails; no fake dataset writes, no browser mocking and no removed assertions.
- No modification to `NilePrelude.ts`, Nile WebGL renderer, homestead engine, main, Research or production.
- Full exact-SHA HOREB QA 6/6, Validate/Preflight mandatory before the existing Draft PR is considered green. The original red CI remains part of the record.

## Safety
The candidate is a detached Git commit (not yet the PR branch tip), parent W12D.1. No force push, merge, new branch or local W10D work. W12D.2 future interior art remains detached and must inherit this test fix.
