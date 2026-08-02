# CURRENT HEAD REVERIFY — registry-derived shadow-audit closure

**Date:** 2026-08-02  
**AuditRepo base:** `b0ab4ac9b21b7b9636e7558b92bb769f63c87787`  
**Source clean head:** `019cbf2f56d9107883f390b169f92b2f70af0ae8`  
**Source witness head:** `202b4e9a8fad64c6defa00ae1aa78349c0918ede`  
**Source squash merge:** `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Canonical finding:** `SHADOW-AUDIT-NARROW`  
**Production claim:** none

## Claim rechecked

The open row asserted that `legacy-shadow-wrapper-audit.js` checked only seven of 52 applicable production-dist routes.

Source PR #780 changed exactly that audit owner:

- route discovery now comes from `migration/page-ownership.json`;
- every `owner=astro`, `status=production-dist` route with a committed root HTML shadow is included;
- malformed ownership data, empty discovery, duplicate shadow paths and stale overrides fail closed;
- canonical URL, required title/description/H1, committed-shadow noindex disposition, structural markers and retained text ratio are enforced.

Exact witness run `30766785459` on `202b4e9a8fad64c6defa00ae1aa78349c0918ede` built the production-like dist, discovered **52 routes** and passed all obligations. Node Toolchain `30766785503` also passed. The temporary witness workflow was removed without changing the permanent script blob; clean head `019cbf2f56d9107883f390b169f92b2f70af0ae8` passed Metadata `30766961604` and Shared Files Guard `30766961603`. Squash merge: `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3`.

## Disposition

`SHADOW-AUDIT-NARROW` is **FIXED-CURRENT / SOURCE+CI VERIFIED**. No product route/content and no production deployment is claimed.

## Arithmetic

- canonical IDs: 358
- closed: 185 → 186
- open: 173 → 172
- P3: 48 → 47
- all other category counts unchanged
