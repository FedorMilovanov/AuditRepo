# Current-head reverify — legacy verse authority closure

**Date:** 2026-08-05  
**AuditRepo base:** `c5d729375165a9690046e11401965249505d21a3`  
**Product exact head:** `c99af2f104194d022e7f55092af6ad35e561de7b`  
**Product squash merge:** `b8882bf04a178d7a1d798a0377083ba57d29ce8a` (PR #901)

## Disposition

`SEARCH-P2-08` is **FIXED-CURRENT / SOURCE+CI VERIFIED**.

The former authority-drift finding is closed by removing the deprecated flat authority rather than projecting disputed text into the sparse canonical corpus.

## Product authority closure

- Product PR #901 deleted the 94-entry `data/verses.json` authority. The 51 legacy-only references and 38 text divergences recorded by the audit were not copied into `data/bible/**`.
- The dead `.gbx-verse` fetch runtime in `js/site.js` and its matching CSS were removed atomically.
- Governed `.bref > .btip` markup plus `data/bible/**` remain the sole current Bible text/tooltip authority.
- `scripts/bible-reference-contract.mjs --strict` now rejects the legacy file, source/runtime consumers and public `.gbx-verse` / `data-verse` markup.
- `scripts/bible-legacy-authority-regression-test.mjs` adversarially reintroduces the legacy authority, requires a blocking failure, removes the fixture and proves the tree is restored. The regression runs in both the dedicated Bible workflow and global Shared Files Guard.
- Revision owners were synchronized for `js/site.js` (`38b94307 → 8009e039`) and `css/site.css` (`6c30f93f → e3f745d1`); SW cache moved to v197.

## Exact Product evidence

- Original self-clean executor run `30949083337`, job `92126343999`, passed strict/adversarial checks, production-like build, Pagefind, SW deploy-switch and full static-publication validation before publishing the permanent tree.
- Exact-head Bible Reference Contract run `30959007910`, job `92158545297`, passed syntax, strict validation, fail-closed regression, actionlint and clean-tree restoration.
- Exact-head Runtime Interactive Audit `30959007826`, Deploy Candidate Contract `30959007936` and Route Registry Validators `30959007945` passed.
- Exact head `c99af2f104194d022e7f55092af6ad35e561de7b` passed all 23 triggered workflows before squash merge `b8882bf04a178d7a1d798a0377083ba57d29ce8a`.
- Final Product diff: **125 permanent files, +267/-339**. The broad count is governed revision synchronization; no TTS/Vosk paths are present.

## AuditRepo transaction evidence

- Self-clean closure executor run `30960767112` is bounded to the matrix, `NEXT_AGENT_PROMPT.md` and this paired reverify.
- Before publishing the clean head it runs structure validation, repository rules/regressions, matrix coverage and strict repository-history forensic.
- Temporary workflow/helper files are removed before the permanent commit.

## Boundaries retained

- `SEARCH-P2-07` remains open: 66-book registry coverage is not an authoritative/licensed full verse corpus, and rights/provenance remain required.
- No full-corpus, licensing or rights claim is made.
- No production deployment is claimed. Last exact production authority remains release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, run `30669840189` attempt `1`.
- No TTS/Vosk disposition is claimed.

## SSOT arithmetic

Total canonical IDs remain **371**. This one row moves from P2 open to closed:

- closed: `222 → 223`
- open: `149 → 148`
- P2: `33 → 32`
- P0/P1/P3/refactoring/AuditRepo unchanged
