# Current HEAD Reverify — map P0 closure

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Exact source SHA: `184d7ed1b50161ec5fa1418ca24539e33977e2a8`
- Last exact production authority: `8a5352671375fdb01b6c30273c25ec4283a13f69`
- Date: 2026-07-24
- Witness angles: `verified-source`, `verified-browser`, `verified-production-like-dist`, `verified-ci`

This witness advances **source authority only**. It does not assert that `184d7ed1` passed Metadata & IndexNow Readiness, GitHub Pages deployment or a live exact-SHA witness.

## Preserved source chain

Current `main@184d7ed1` contains the previously reconciled homepage, Gill corpus, ReaderState R6, Android/WebKit public-route matrix, accessible map failure recovery, control-plane zero-warning policy and repository-history forensic work.

The map P0 sequence is additionally present:

1. PR #218 → `d57d49b8c13e622e6fa76cf5f77920133c093dbd`
   - viewport-bound mobile and desktop detail panels;
   - fixed header/tabs/navigation and internally scrolling `.me-content`;
   - permanent Chromium/WebKit 320×568 and 390×844 panel contract over Ishod and real Maccabim data.

2. PR #224 → `c27176bf6cc61dcc4ca3411f38c307ab38002161`
   - MapEngine v0.55 renders all 15 author-authored cubic Bézier paths from `avraam/route.json`;
   - exact source order, SVG `d`, semantic colors, dash state, underlays, arrows, layer membership and stage labels;
   - generated `M/L` remains fail-closed fallback for routes without valid authored geometry;
   - Chromium, WebKit and Firefox agree on authored rendering.

3. PR #226 → `184d7ed1b50161ec5fa1418ca24539e33977e2a8`
   - versioned archaeology source registry foundation;
   - 52 source records, 42 verified, 31 high-evidence, 6 YEC interpretation records, 11 governed claims;
   - YEC interpretation cannot replace excavation, object, institutional or peer-reviewed evidence.

## MAP-P0-01 — fixed-current

Original defect: `.me-panel` could expand above the mobile viewport, hiding its title, close control and tabs.

Permanent repair:

- panel has viewport- and safe-area-bound `max-height` plus overflow containment;
- header, tabs and navigation are non-shrinking flex children;
- only `.me-content` scrolls and has `min-height:0`;
- desktop floating panel is also bounded;
- close target remains at least 44×44 px.

Exact PR #218 head: `3956906866afe29f9711a4e8c4784e9923779949`.

Evidence:

- Map Keyboard Contract `30108888551`: source, keyboard, Chromium panel and WebKit panel jobs success;
- Shared Files Guard `30108888569`: rerun success across all 27 steps;
- Overlay Runtime Browser `30108888784`: Chromium, WebKit and Firefox success;
- Visual Parity `30108888609`: production-like build and route policy success;
- every Ishod/Maccabim marker at 320/390, forced 1500px content and viewport-height reduction remained inside the viewport with zero horizontal overflow and zero runtime errors.

Disposition: `MAP-P0-01` → `FIXED/SOURCE+CI VERIFIED`.

## DATA-P0-01 — fixed-current

Original defect: shared MapEngine ignored all 15 author-authored `stages[].paths` in Avraam and reconstructed stages as straight generated `M/L` segments.

Permanent repair:

- valid authored SVG geometry is authoritative;
- exact `d`, order, stage/path indexes, `gold`/`lot`/`war`, dash state, underlay and matching arrow are preserved;
- malformed authored geometry fails closed to generated geometry;
- late generated stages retain legacy gold/arrow behavior;
- public engine metadata is synchronized at `0.55.0`.

Exact PR #224 head: `be2b707c85d2febb6a91e497011e62dc996e7289`.

Evidence:

- Map Keyboard Contract `30113097520`: seven jobs success, including authored geometry in Chromium, WebKit and Firefox plus both panel engines;
- Shared Files Guard `30113097647`: all 27 steps success;
- Overlay Runtime Browser `30113097467`: Chromium, WebKit and Firefox success;
- Visual Parity `30113097686`: production-like build, progressive enhancement, pixel diagnostics and route policy success;
- exact report: 15 main paths, 15 underlays, 15 authored markers, 8 stages, 7 dashed segments, real base geography, no failures.

Disposition: `DATA-P0-01` → `FIXED/SOURCE+CI VERIFIED`.

## Counter transaction

Only directly affected canonical counters move:

- closed: `146 → 148`;
- P0/P1 open: `2 → 0`.

P1/P2/P3 backlog and the W1 system backlog are not re-counted or reclassified by this witness.

## Remaining operational work

- do not advance production authority without exact readiness → Pages → live witness on one SHA;
- continue map P1 work from current source and current open-PR intersections;
- expand the archaeology registry before atomically removing hardcoded archaeology from MapEngine;
- do not weaken uncertainty, retraction or YEC/evidence-layer separation.
