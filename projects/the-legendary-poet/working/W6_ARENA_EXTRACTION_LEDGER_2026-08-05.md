# W6 Arena extraction ledger — 2026-08-05

## Scope

Classify the two old TheLegendaryPoet Arena refs without merging their runtime and without losing unique audit evidence.

- current source production at extraction completion: `db6bc3ea8997f78d1370a05e2736cf20645c80dd`;
- common Arena audit base: `85c4303dc683abc6e201ea707a0b4d6f5f19f82c`;
- archive destination: `projects/the-legendary-poet/archive/stale/arena-2026-08-05/`;
- no physical branch deletion is claimed.

## Byte-level extraction result

| Arena ref | Source path | Source blob | AuditRepo target | Target blob | Result |
|---|---|---|---|---|---|
| `arena/019fcf76-thelegendarypoet` | `docs/SITE_WIDE_AUDIT_2026-08-05.md` | `e153e2ea81c6c5ceaf960b20256cf05618a21387` | `archive/stale/arena-2026-08-05/SITE_WIDE_AUDIT_2026-08-05.md` | `e153e2ea81c6c5ceaf960b20256cf05618a21387` | byte-identical |
| `arena/019fcf76-thelegendarypoet` | `docs/ARTICLES_AUDIT_2026-08-05.md` | `a08ee4b7a220629291ce39b13bdcf9d1425fce5e` | `archive/stale/arena-2026-08-05/ARTICLES_AUDIT_2026-08-05.md` | `a08ee4b7a220629291ce39b13bdcf9d1425fce5e` | byte-identical |
| `arena/019fcf77-thelegendarypoet` | `docs/ARTICLES_DEEP_AUDIT_2026-08-05.md` | `24bbc965f8cc56918d48291a3e2250c2bd7799b0` | `archive/stale/arena-2026-08-05/ARTICLES_DEEP_AUDIT_2026-08-05.md` | `24bbc965f8cc56918d48291a3e2250c2bd7799b0` | byte-identical |

The matching Git blob SHA values prove that the target files preserve the exact source bytes. The archive README records branch identity, old base and superseded-claim boundaries.

## Runtime disposition

The Arena runtime changes are not merged. Their durable product outcomes are represented by current production or later verified waves:

- one live fourteen-route registry and route/build budgets;
- reader-facing editorial leakage cleanup and real public source boundaries;
- safe browser-storage behavior;
- materialized brand pipeline and browser workflows;
- immutable Essay publication and derived read time;
- retired Article/search ghosts;
- stable tilt pointer hit-surface, flattened compositor ownership and bounded `will-change`;
- current source/content/style validators and exact-head multi-browser evidence.

Old Arena implementations are therefore `REPRESENTED_CURRENT` or `REJECT_STALE`, not extraction candidates.

## Historical interpretation

The archived documents contain useful old measurements and causal observations, including the shadow route registry, 517 promoted compositor layers, 249 bibliography URLs, old GitHub-ledger substitution, materializer limits and sandbox/browser constraints. They are not automatically current bugs. Any surviving claim must be reverified against current production before it can enter the canonical matrix.

## Final status

| Ref | Extraction status | Merge status | Ref status |
|---|---|---|---|
| `arena/019fcf76-thelegendarypoet` | unique evidence physically archived and hash-verified | old runtime superseded; never merge wholesale | `RETIRE_READY` |
| `arena/019fcf77-thelegendarypoet` | unique evidence physically archived and hash-verified | old runtime superseded; never merge wholesale | `RETIRE_READY` |

Physical deletion still requires an authorized delete-ref API/UI operation followed by branch inventory proving absence. Force-moving a ref is not deletion.
