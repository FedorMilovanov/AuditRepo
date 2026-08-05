# CURRENT HEAD REVERIFY — Favorite Store source closure

Date: 2026-08-05  
Project: `gb-is-my-strength`  
AuditRepo base before transaction: `be03e27e61b6169e518f7b91978abaf48e29baa4`  
Product exact tested head: `845ad48409fc3c8a2fa7056f4b84e005e652318e`  
Product guarded squash merge: `d0647b71b557c17e408c09712fcd8c3ab05ba257`  
Production authority retained: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`

## Scope and disposition

This transaction imports only the verified Favorite Store source closure from Product PR #1061. It does not create or close a canonical matrix ID and does not change production authority.

Disposition: **FIXED-CURRENT / MERGED-SOURCE+CHROMIUM+CI VERIFIED** for the Favorite Store metadata/storage/migration/synchronized-consumer scope inside umbrella issue #61.

## Product result

- `window.GBFavoriteStore` v1 is the canonical owner for storage key `gb-favorites`, schema-v1 migration, fail-closed path/image normalization, canonical route metadata, list/get/has/add/remove/toggle/clear, events, subscriptions, cross-tab storage synchronization and button synchronization.
- Historical `window.__gbCluster.setSaved(Boolean)` remains only as a thin compatibility adapter delegating to the canonical store.
- `ReaderActionsRuntime.astro` loads the store before consumers.
- `SaveButton.astro`, Home Favorites and `/izbrannoe/` consume the canonical state contract; Home and `/izbrannoe/` no longer own direct favorites localStorage access.
- No BookmarkEngine, ReaderState, ReaderProjection, Search behavior, TTS/Vosk, route-content or visual-redesign ownership was changed.

## Exact evidence

- Favorite Store workflow run `31037316037`, job `92412574991`, exact SHA `845ad48409fc3c8a2fa7056f4b84e005e652318e`.
- Source contract: **65/65 PASS**.
- Production-like build: **0 errors, 0 warnings** (six existing hints).
- Chromium contract: **138/138 PASS**, eight cases across Hermenevtika, Gill, Antisovetov, Home cross-tab and `/izbrannoe/`; zero page errors.
- Artifact `8943367668`; digest `sha256:c15e92c25bfc127cac2824ac5aa679be383e3bb916e3d9fa3dfa9bd385822628`.
- Runtime Interactive run `31037316184`: Home Chromium/WebKit and full interactive audit PASS; artifact `8943966044`, digest `sha256:529375d76ddf5ba4fabf1ef65e824e277cf9873aff73c3856a3077569c691022`.
- All **25/25** applicable exact-head workflow groups completed successfully, including Reader Projection, TTS Download Consent, TTS Reader Polish, Overlay Runtime, Route Registry Chromium/WebKit, Visual Parity, Shared Files Guard and Native Source.
- Merge race check proved Product `main` remained exact base `054cade3b22e2dc880329c73a65436739092b4f2`, PR shape remained one commit / 49 files / ahead 1 / behind 0, and reviews/threads were empty.
- Guarded squash required expected head `845ad48409fc3c8a2fa7056f4b84e005e652318e` and produced `d0647b71b557c17e408c09712fcd8c3ab05ba257`.
- Exact blob equality was checked for all nine functional/control owners between tested head and merged `main`; the canonical Product branch was auto-deleted.

## Canonical accounting

Favorite Store was an intake/umbrella scope without a canonical matrix ID. Therefore:

- total remains **371**;
- closed remains **226**;
- open remains **145**;
- open severity counts remain P0 `0`, P1 `70`, P2 `29`, P3 `39`, refactoring `4`, AuditRepo `3`.

## Remaining boundary

Product issue #61 remains open only for independent exact-current findings concerning inactive speed/search control exposure and radiogroup roving-keyboard/popup semantics. ReaderProjection and Favorite Store metadata/store ownership are source-closed and require new exact-current evidence before reopening.

## Production statement

No production deployment is claimed for `d0647b71b557c17e408c09712fcd8c3ab05ba257`. Current production authority remains `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`.
