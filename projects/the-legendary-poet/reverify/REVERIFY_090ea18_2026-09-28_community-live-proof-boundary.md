# Current boundary reverify — community live adversarial proof

**Project:** `the-legendary-poet`
**Root:** `TLP-COMM-ABUSE-001`
**AuditRepo check date:** 2026-09-28
**Product issue:** [#497](https://github.com/FedorMilovanov/TheLegendaryPoet/issues/497)
**Status:** `UNPROVEN / HUMAN-TURNSTILE-BOUNDARY`

## Current ownership and source boundary

- Product `main` observed: `090ea18233ca4888de1ea854d05d27f4e14c7eae`.
- Product #505 merged the human-backed certifier at exact head `a781083d74c2b6eb8f16c7961f36ebcf9d4bed7f`; resulting `main` at that transaction was `e5d34db4106533cad17f80ce6c52782330803dff`.
- Product #506 subsequently changed the community comment contract and Worker implementation. Therefore #505 is implementation provenance, not a current live-closure witness.
- The only currently open Product PR is #514, a lockfile-only dependency update; it is not a community owner. The final run must still bind to the actually deployed Worker/Pages revision at execution time.
- Product issue #497 remains open and explicitly retains the human-backed Turnstile boundary.

## Closure boundary

No automated browser run, decoded token, local source test or recorded `/health` result closes this row. Closure requires two fresh normal production browser profiles, legitimate Turnstile completion, hidden local TTY token entry and the committed operator certifier:

```bash
npm run operator:community-live -- --target-type poet --target-id alexander-pushkin
```

The sanitized result must include distinct sessions, authenticated unknown-target rejection, concurrent identical comment convergence, explicit idempotent replay, changed-payload conflict, rotated-actor conflict, exact-row cleanup and proof that the temporary comment is absent afterward. Tokens, actor UUIDs and cleanup SQL must remain local and unpublished.

## Execution hazard

Product PR #505 records a Windows cleanup failure caused by the current `npx.cmd` launch path. Run the certifier on a platform where the pinned Wrangler cleanup path is known to work, or land a reviewed Windows-safe launcher/error-handling fix in Product first. A proof whose cleanup failed is not a PASS.

This package deliberately records the boundary as `UNPROVEN`; it does not claim a live run from AuditRepo.
