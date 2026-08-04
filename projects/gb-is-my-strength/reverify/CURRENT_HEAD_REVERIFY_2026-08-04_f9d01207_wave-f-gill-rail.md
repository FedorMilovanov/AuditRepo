# CURRENT HEAD REVERIFY — Gill rail speed-slot dedup closure

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NF-SPEEDSLOT-4TH-COPY`
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `fc7cac4bf314ce9feb56380ffde3220d4e528567`
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Original claim

`NF-SPEEDSLOT-4TH-COPY` (reverify 07-09): dedup speed-slot 3-of-4 — `GillSeriesRail.astro:209`
holds its own inline `initGillRailSpeedSlot`, not importing `_shared/speedSlot.ts` (as the two
mobile bars and HermenevtikaRail do). Refactor-minor.

## Exact current witness

At `f9d01207`:

- `GillSeriesRail.astro` contains **no** `initGillRailSpeedSlot`, no speed-slot swap, and no
  `data-gb-speed-custom` on the ember;
- the desktop rail drives the canonical `initPlayExpand()` panel (`.gb-ember-expand`), the same
  speed-bloom mechanism used on single articles (per the file's design comment: "Скорость больше НЕ
  кастомный слот-свап ... initPlayExpand() ... сама вешает canonical-панель .gb-ember-expand");
- `_shared/speedSlot.ts` (`initSpeedSlot`) is now imported by only `HermenevtikaMobileBar.astro`;
- the Gill **mobile** bar (`GillSeriesMobileBar.astro`) uses a distinct, documented
  `initGillInlineSpeedRail` mechanism (`data-fc-speed-mode="inline"` + `.mobile-speedrail`), which
  is not a copy of `initSpeedSlot`;
- `git log -S "initGillRailSpeedSlot"` shows commit `980c63715` (#72, "canonical rail
  hamburger/search, speed-bloom migration, touch-tap race, rail-narrow removal") introduced the
  migration away from the custom slot-swap; the `initGillRailSpeedSlot` symbol is absent in current
  source.

## Disposition

`NF-SPEEDSLOT-4TH-COPY` → ✅ **FIXED-CURRENT / SOURCE VERIFIED.** The named desktop-rail 4th copy of
`initSpeedSlot` no longer exists; the rail uses the canonical ember expansion and the shared
`initSpeedSlot` has a single consumer. The Gill mobile inline rail is a separate documented
mechanism, not a duplicate of the shared slot-swap. No Product mutation, browser, production or TTS
claim.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **218 → 219**
- Open: **140 → 139**
- P0: 0
- P1: 69
- P2: 26
- P3: **38 → 37**
- Refactoring: 4
- AuditRepo: 3

Total remains `358 = 219 + 139`.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- direct source inspection of `GillSeriesRail.astro`, `GillSeriesMobileBar.astro`,
  `_shared/speedSlot.ts`, `floating-cluster-controller.js`, and `git log -S "initGillRailSpeedSlot"`;
- no Product mutation;
- no browser run executed in this sandbox, so no live Chromium/production claim;
- no TTS inspection or modification.
