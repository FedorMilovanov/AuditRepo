# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo rollback/base before this transaction: `c5d729375165a9690046e11401965249505d21a3`.
- Current Product source/disposition anchor: `b8882bf04a178d7a1d798a0377083ba57d29ce8a` (PR #901).
- Product exact closure head: `c99af2f104194d022e7f55092af6ad35e561de7b`; squash merge: `b8882bf04a178d7a1d798a0377083ba57d29ce8a`.
- Last exact production authority is unchanged: release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, deploy run `30669840189` attempt `1`. Do not treat the Product source anchor as deployed.
- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-05_b8882bf0_legacy-verse-authority-closure.md`.

## Canonical matrix

- **371 total = 223 closed + 148 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `32`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `SEARCH-P2-08` is closed: the deprecated legacy verse authority and dead `.gbx-verse` runtime/CSS were removed; strict and adversarial contracts now fail closed on reintroduction.
- `SEARCH-P2-07` remains open: the corpus is sparse and cannot be truthfully closed without an authoritative/licensed source plus rights/provenance.

## Product evidence retained

- Product PR #901 deleted the 94-entry `data/verses.json` authority instead of copying disputed legacy text into `data/bible/**`.
- The dead `.gbx-verse` fetch runtime and matching CSS were removed atomically; governed `.bref > .btip` plus `data/bible/**` remain the sole current Bible text/tooltip authority.
- Original self-clean executor: run `30949083337`, job `92126343999`.
- Permanent exact-head Bible contract: run `30959007910`, job `92158545297`; full Runtime `30959007826`; Deploy Candidate `30959007936`; Route Registry `30959007945`.
- Exact head `c99af2f104194d022e7f55092af6ad35e561de7b` passed all 23 triggered workflows before squash merge `b8882bf04a178d7a1d798a0377083ba57d29ce8a`.
- Final Product diff: 125 permanent files, `+267/-339`; revision synchronization accounts for the broad count; no TTS/Vosk paths.

## Next bounded search lanes

1. `SEARCH-P2-09`: implement the advertised `/?q={search_term_string}` SearchAction target as a real search-open/query state.
2. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence and without weakening existing keyboard/fallback behavior.
3. `SEARCH-P1-01`: extend the unified command palette to the remaining searchable app/tool routes.
4. `SEARCH-P2-07`: proceed only after authoritative/licensed corpus and rights/provenance evidence; do not infer completeness from the 66-book registry.
5. Search P3 polish rows.

No active Product mutation lane is owned by this AuditRepo closure transaction. Re-read live Product `main` and source-owner blobs before opening the next lane.
