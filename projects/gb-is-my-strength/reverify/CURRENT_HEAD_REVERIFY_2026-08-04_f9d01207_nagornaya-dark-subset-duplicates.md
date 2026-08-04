# CURRENT HEAD REVERIFY — Nagornaya dark-theme subset duplicates

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `NG-DARK-04`, `NG-DARK-05`
- Open root owner: `NG-DARK-01`
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `92bd5457c391604507147694a826791cb0c061d2`
- Current production claim: **none**

## Current source boundary

The Product defect remains current. At `f9d0120718569c510833dba7a3abd68ce2f6a003`, `css/mobile-hotfix.css` still has a blanket Nagornaya `.bg-*-50` dark remap that does not include `.bg-rose-50`, and it has no `.bg-stone-100` remap. This transaction therefore does not close or narrow `NG-DARK-01`.

The canonical P1 owner already names the same affected classes — `bg-rose-50` and `bg-stone-100/200` — and prescribes the same per-chapter custom-property/remap architecture. The P2 rows add measured instance counts but do not establish separately repairable causes.

## Dispositions

### `NG-DARK-04` — duplicate / merged into `NG-DARK-01`

The 26 `bg-rose-50` containers are a measured subset of the open root owner's missing dark-remap architecture. The P2 row and P1 owner share the same class, dark-theme failure mode and `--ng-accent-soft` / per-chapter-variable repair boundary. `NG-DARK-01` remains open.

### `NG-DARK-05` — duplicate / merged into `NG-DARK-01`

The 18 `bg-stone-100/200` containers are another measured subset of the same open root owner, which explicitly includes `bg-stone-100/200` among the unmapped Tailwind classes. Closing the duplicate does not claim that those containers are fixed. `NG-DARK-01` remains open.

## Evidence boundary

This is an AuditRepo accounting consolidation only:

- no Product file changes;
- no source-fix claim;
- no production claim;
- no change to the open root owner's repair requirements.

The current CSS witness is used only to ensure that the root defect is not accidentally closed while its subsets are de-duplicated.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **207 → 209**
- Open: **151 → 149**
- P0: 0
- P1: 71
- P2: **31 → 29**
- P3: 42
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 209 + 149`.
