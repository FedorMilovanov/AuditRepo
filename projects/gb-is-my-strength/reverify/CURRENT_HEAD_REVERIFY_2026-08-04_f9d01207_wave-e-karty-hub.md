# CURRENT HEAD REVERIFY — Karty hub audit-count supersession

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `HUB-AUDIT-COUNT-DRIFT`
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `500ca80ff6c9b31a6336fbd5c9222dd0b58bee02`
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Original claim

`HUB-AUDIT-COUNT-DRIFT` (2026-07-14): `hasAuditPendingDesign()` in `validate-map-routes.js`
requires an exact integer "на аудите" == `missingCount`; adding the 11th map (`nachalo`, 10
missing) against a stat of "9" dropped the whole `maps:validate`/deploy. Recommended fix:
generate the counter from `route.json` publication statuses.

## Exact current witness

At `f9d01207`:

- `scripts/validate-map-routes.js` now uses `hasGovernedAuditPendingDesign(...)` instead of a
  hardcoded integer comparison;
- the counts are derived from the governed inventory `getKartyHubInventory` in
  `src/lib/karty-hub-inventory.cjs`, which computes:
  `auditSlugs = routeSlugs.filter((slug) => !publishedSet.has(slug))`,
  `auditCount = auditSlugs.length`, `publishedCount = publishedSlugs.length`;
- the check asserts `sameStringSet(missingIds, inventory.auditSlugs)` and, on built HTML, that
  `audit.data === inventory.auditCount && audit.visible === inventory.auditCount` (and likewise for
  published) — so the "на аудите" figure is generated from `route.json` publication statuses rather
  than a stale hardcoded integer;
- this is exactly the row's recommended fix, landed by PR #669 / `efaf2a51b`
  (`fix(karty): derive audit count from route inventory`).

## Disposition

`HUB-AUDIT-COUNT-DRIFT` → ✅ **FIXED-CURRENT / SOURCE VERIFIED.** The hardcoded `== missingCount`
drift that broke `maps:validate` on an 11th map is gone; the audit/published counts are governed
inventory-derived from publication statuses. No Product mutation, browser, production or TTS claim.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **217 → 218**
- Open: **141 → 140**
- P0: 0
- P1: 69
- P2: **27 → 26**
- P3: 38
- Refactoring: 4
- AuditRepo: 3

Total remains `358 = 218 + 140`.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- direct source inspection of `validate-map-routes.js` and `karty-hub-inventory.cjs`;
- fix commit `efaf2a51b` (PR #669) is an ancestor of the exact head;
- no Product mutation;
- no browser run executed in this sandbox, so no live Chromium/production claim;
- no TTS inspection or modification.
