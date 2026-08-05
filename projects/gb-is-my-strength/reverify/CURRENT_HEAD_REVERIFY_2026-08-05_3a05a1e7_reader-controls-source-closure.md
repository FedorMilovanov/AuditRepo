# CURRENT HEAD REVERIFY — Reader controls accessibility source closure

Date: 2026-08-05
Project: `gb-is-my-strength`
AuditRepo base before transaction: `174fc803ad478d924d86420edd71cbba3f82bf5f`
Product current source: `3a05a1e79bcd7061e9b9c3f98ed3953ae2e8d0c0`
Product PR #988 exact tested head: `18f130fe91e6d25ae44ceb897daa362ba3187518`
Product PR #988 guarded squash merge: `c159526e272812371be614a2fa95e0b149fbbe20`
Production authority retained: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`

## Scope and disposition

This transaction imports the already merged Product #988 closure for the two remaining independently verified boundaries inside umbrella issue #61:

1. inactive speed/search controls exposed to Tab and assistive technology while visually closed;
2. incomplete radiogroup roving-keyboard, focus-return and popup-semantics ownership.

Disposition: **FIXED-CURRENT / MERGED-SOURCE+CHROMIUM+CI VERIFIED**.

These were umbrella/intake scopes without canonical matrix IDs. Canonical arithmetic remains exactly **371 = 229 closed + 142 open**; P0 `0`, P1 `70`, P2 `26`, P3 `39`, refactoring `4`, AuditRepo `3`.

## Product result

Product PR #988 introduced the versioned additive `GBReaderControlsA11y` owner through the canonical reader runtime:

- synchronizes truthful `aria-hidden`, `inert`, `aria-controls` and `aria-expanded` state without taking visual open/close ownership;
- exposes zero radio Tab stops while closed and exactly one while open;
- owns Arrow keys, Home, End, Enter and Space for the speed radiogroups;
- preserves selected-rate persistence while navigation keys keep the rail open;
- returns focus to the speed badge before the rail becomes inert;
- uses the existing Gill close owner and restores the Hermenevtika visual end-state without synthetic pointer/TTS behavior;
- removes mobile Play popup claims where no controlled popup exists while preserving truthful desktop popup semantics;
- preserves exactly one speech owner and non-empty speech projection.

No ReaderProjection, Favorite Store, TTS/Vosk, Search, route-content or visual-redesign ownership was changed by this lane.

## Exact evidence

- Exact tested head `18f130fe91e6d25ae44ceb897daa362ba3187518` passed **14/14** applicable workflow groups before guarded squash merge `c159526e272812371be614a2fa95e0b149fbbe20`.
- Reader Controls workflow run `30972484056`, job `92199627173`, checked out and proved exact head identity.
- Production-like build completed with **0 errors, 0 warnings** and six retained hints.
- Permanent Chromium contract: **85/85 PASS**, five cases across Hermenevtika/Gill/Antisovetov mobile and Hermenevtika/Gill desktop; zero failures and zero uncaught page errors.
- Artifact `8917086074`; digest `sha256:02ca8c71b194bd82f4cdf698b9dd5ec40258770ef8d378a4face4c31def72070`.
- Runtime Interactive, TTS Download Consent, TTS Reader Polish, Print, Visual Parity, Scripture Index, Deploy Candidate, Editorial, Native Source, Node, Metadata, Glossary and Shared Files also passed on the exact head.

## Exact-current drift proof

Current Product `3a05a1e79bcd7061e9b9c3f98ed3953ae2e8d0c0` is a descendant of merge `c159526e272812371be614a2fa95e0b149fbbe20`.

- `src/runtime/reader-controls-a11y.js` remains exact blob `49360065b2c8270f8de6d5cad919fd1c24fa8502`.
- `scripts/reader-controls-a11y-browser-contract.mjs` remains exact blob `ae34d8bc16088101bfed4fc8fc72ce6c608124b3`.
- `.github/workflows/reader-controls-a11y.yml` remains exact blob `db655c838a24f025f1aa4c87ada7edf9bcf10dfb`.
- Current `src/components/reader-platform/ReaderActionsRuntime.astro` blob `1a5fd1b6321477328416973a2e199d427a15e262` retains `import '../../runtime/reader-controls-a11y.js';`; later ReaderProjection and Favorite Store imports are additive and do not replace the controls owner.

## Authority boundary

This is merged-source, Chromium and CI evidence only. Production authority remains `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`; no same-SHA production/live claim is made for Product #988.

Umbrella Product issue #61 has no remaining source scope under its currently verified boundary and may be closed as merged-source complete. Reopen only from fresh exact-current evidence.
