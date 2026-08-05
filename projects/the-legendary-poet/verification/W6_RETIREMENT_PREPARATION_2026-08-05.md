# Promotion verification — W6 branch and artifact retirement preparation

Date: 2026-08-05

## Authority identities

- current source production: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`;
- W6 selective extraction source PR: `FedorMilovanov/TheLegendaryPoet#324`;
- source #324 exact tested head: `6146e6f5da81c7904fd1bb135c22a409f3e12719`;
- source #324 expected-head squash: `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97`;
- governance source #326 exact tested head: `e3a1a877ebb14eb2e163b14995ded592cf553909`;
- current source successor: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`;
- current AuditRepo production before this promotion: `8861308e9ecd12194f0781c85d4ed0629af712e6`;
- W6 AuditRepo owner: PR #185.

## Source extraction evidence

Source #324 was rebuilt as one commit on the current W5/truth production, `behind=0`, and passed:

- CI;
- Project contracts;
- Content model;
- Articles catalog acceptance across Chromium, Android and iPhone;
- route and brand gates;
- Manual Browser QA run `31046697422`, four of four jobs.

The merge introduced one central verified-media registry at the immutable publication boundary, preserved exact PR77 evidence and accepted only C03/C08. The other 28 candidates remain explicitly unresolved.

## Arena evidence extraction

Three unique old Arena audit documents were physically materialized into AuditRepo. Git blob identities match source and target:

- `SITE_WIDE_AUDIT_2026-08-05.md` — `e153e2ea81c6c5ceaf960b20256cf05618a21387`;
- `ARTICLES_AUDIT_2026-08-05.md` — `a08ee4b7a220629291ce39b13bdcf9d1425fce5e`;
- `ARTICLES_DEEP_AUDIT_2026-08-05.md` — `24bbc965f8cc56918d48291a3e2250c2bd7799b0`.

The old Arena runtime is not merged. Current production represents stronger durable outcomes; obsolete implementations remain rejected.

## Deep-branch preservation

The old work ref and retained archive ref compare identical at exact head `909df9f73b8d9be6faa58cbee767603954e3fb17`:

- old: `work/local-images-playwright-wtoc`;
- retained: `archive/deep-research-local-images-20260724`.

Every unique path is owned by an ordered path-family outcome. Current value is extracted/represented; old executable workflows/runtime are rejected; unresolved research/media stays archived and owner-controlled. No wholesale merge occurred.

## Ref inventory

Final pre-deletion inventory proves:

- 31 source refs: source `main`, one retained archive ref and 29 stale refs;
- 28 AuditRepo refs: unrelated refs untouched, PR #185 active and three old TLP refs prepared for deletion after merge;
- machine manifest total: 29 source + 3 AuditRepo = 32 delete targets.

## Promotion decision

Promote W6 **retirement preparation** to verified-current:

- classification complete;
- source extraction complete;
- Arena evidence archive complete;
- deep history preservation complete;
- exact successor and trigger maps complete;
- machine deletion manifest complete.

Do **not** promote `TLP-CLEAN-001` to fixed-current. Physical delete-ref and branch-absence verification are still outstanding and cannot be performed by the connected capability. Force-moving refs is forbidden.
