# Promotion verification — package, engine, release and licensing governance

Date: 2026-08-05

## Source identity

- pre-governance source production: `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`;
- source PR: `FedorMilovanov/TheLegendaryPoet#326`;
- exact tested head: `e3a1a877ebb14eb2e163b14995ded592cf553909`;
- expected-head squash production: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

## Root cause

The private web application still identified itself as generic `react-vite-tailwind@0.0.0` and had no machine-checked Node engine, release authority or licensing disposition. Source truth correctly kept `TLP-GOV-001` open because an agent could not safely infer a public licence or semantic release policy.

## Durable repair

Source #326 records and enforces:

- package name `the-legendary-poet`;
- private non-public version `0.0.0-private`;
- `private: true` and `UNLICENSED`;
- canonical homepage and source repository metadata;
- supported Node range `>=22.22.0 <25`, with Node 24 as `.nvmrc`/CI baseline;
- authoritative `docs/RELEASE_POLICY.md`;
- production release identity as the exact verified source `main` SHA, not private npm-semver;
- exact-head checks, `behind=0`, expected-head squash, post-merge source verification and AuditRepo-after-source ordering;
- package/lockfile/project-contract/current-state/release-policy parity in `validate-project-contracts.mjs`;
- one remaining machine-registered open lane: `TLP-CLEAN-001`.

`UNLICENSED` is a non-grant: it does not create an MIT/Apache/GPL/Creative Commons licence and does not override third-party rights attached to fonts, media, audio or source documents.

## Exact-head workflows

All required workflows associated with `e3a1a877ebb14eb2e163b14995ded592cf553909` completed successfully:

- Project contracts — run `31048129113`;
- CI — run `31048128160`;
- Content model contract — run `31048127993`;
- Articles catalog acceptance — run `31048128801`;
- Yesenin Part I browser acceptance — run `31048128016`;
- Yesenin Part II safe publication — run `31048128729`;
- Site route integrity audit — run `31048128080`;
- Brand deep reference and motion audit — run `31048127845`;
- Brand raster QA — run `31048128534`;
- Manual Browser QA — run `31048128145`, all four jobs successful.

Pages deployment was skipped by the normal pull-request condition and is not a failed source gate.

## Promotion decision

- `TLP-GOV-001`: promote from `owner-decision` to `fixed-current`.
- source production authority: promote to `main@ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.
- W6 `TLP-CLEAN-001` remains `active-current` until physical delete-ref and absence verification, despite complete extraction/classification evidence.
