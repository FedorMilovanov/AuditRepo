# GB follow-up — Lot current truth + Strangler inventory move-safety

**AuditRepo base:** `15536126b337886ba1476c72ff488bbfd16df56a`  
**Product anchor:** `bc786f4da7b6b3e9924caa046a3ab9ba829330fe`  
**Mode:** AuditRepo evidence/SSOT only; Product read/verify.  
**Non-overlap:** active AuditRepo #289 owns `verified/MASTER_BUG_MATRIX.md`; this follow-up does not touch MASTER.

## Why this follow-up is material

Merged AuditRepo reconciliation correctly retired Product #1373 from active work and stopped treating #1339/#1389 as current Lot owners. Two material gaps remained outside MASTER:

1. Lot `CURRENT_STATUS.md` still contained the older `main@59e99bfa…`, called #1339 active/open, #1348 open and #1369 without implementation, and still described the now-merged native quiz runtime defects as current.
2. The earlier Strangler control pass identified a move-safety risk outside dependency arithmetic: the inventory audit excludes itself from dependency discovery but still validates immutable reference bytes from physical root `legacyPath` storage. The reserved inventory branch currently has no unique implementation.

This follow-up preserves those facts without competing with Product or AuditRepo owners.

## Strangler inventory self-owner check

Fresh Product comparison against `main@bc786f4d…`:

- `agent/readable-audit-reference-authority-20260809`: real unique storage-aware work, `ahead=2 / behind=2`.
- `agent/owner-ui-reference-authority-20260809`: real unique storage-aware work, `ahead=1 / behind=2`.
- `agent/legacy-inventory-storage-authority-20260809`: **ahead=0 / behind=1**; no unique implementation.

The inventory branch name therefore must not be treated as completed or even started repair evidence.

Current `scripts/legacy-reference-inventory-audit.mjs` excludes `SELF_REL` from dependency discovery, but immutable ledger reference validation still checks each current profile reference through `path.join(ROOT, profile.legacyPath)` before reading bytes and comparing blob/SHA/text/H1/H2 metrics. That is valid for current root storage, but a future physical quarantine can invalidate the inventory owner itself even when ordinary dependency blockers have reached zero.

Required closure after the three counted blockers are retired:

- create/refresh one bounded inventory storage-authority owner from then-current main;
- resolve immutable reference bytes through canonical legacy-reference path/resolver authority, preserving exact immutable metrics and ambiguity fail-closed behavior;
- keep the inventory audit in permanent Shared execution;
- prove ordinary inventory + retirement readiness on exact head;
- prove a **non-destructive quarantine dry-run** where root storage is absent/simulated moved and canonical quarantine resolution still passes;
- only then consider a separate explicitly authorized physical move transaction.

`blockers=0` is therefore **necessary but not sufficient** for physical move authorization.

## Lot current-state correction

Current Product `main@bc786f4d…` has no `src/pages/articles/lot-i-sodom/index.astro`.

Current owner truth:

- Product issue #1295 remains open;
- #1339 is closed unmerged / superseded — historical publication evidence only;
- #1348 catalog/human-reachability is merged;
- #1313 Search role authority is merged;
- #1353 Scripture occurrence writer is merged;
- #1373 native article quiz runtime parity is merged at `bc786f4d…`;
- #1378 is the bounded current Lot source-resilience owner;
- #1401 is the current shared standalone-footer owner adjacent to Lot;
- #1389 is closed unmerged / rights-blocked and cannot supply publication corpus bytes without new binding rights/provenance authority;
- #1334 remains the separate Avraam/Tall el-Hammam owner.

Accordingly, route-level Lot findings from stale #1339 evidence are carried forward as **fresh-successor acceptance requirements**, not described as production regressions on a route that is absent from current main.

## Lot media truth

Fresh comparison against Product current main:

- `lane/lot-media-20260809`: `ahead=0 / behind=7` — zero unique media payload;
- `lane/lot-illustration-placement-20260809`: `ahead=13 / behind=12`, seven-file source placement delta.

Historical audit evidence had nine source-grounded mounted figure slots plus five reserves, while stale publication acceptance language referred to 14 raster families. There is currently no 14-family media payload in Product.

Future media closure must therefore choose a truthful explicit positive acceptance count, provide actual responsive bytes + Lot-specific OG, and prove exactly that count in browser **and** print/PDF. “14/14 ready” is not a current fact.

## Logical boundary

This follow-up deliberately does **not**:

- mutate Product;
- take over #1395/readable/owner-ui lanes;
- touch MASTER while AuditRepo #289 owns it;
- authorize physical move/delete;
- resurrect #1339 or #1389;
- claim Lot production regressions on an unpublished route.

The durable next sequence is: finish counted Strangler owners serially → inventory move-safety slice → quarantine dry-run → only then decide physical move; and independently finish Lot prerequisites → fresh `release/*` Lot publication successor from live main → current exact-head publication/media/browser/print/public witness.