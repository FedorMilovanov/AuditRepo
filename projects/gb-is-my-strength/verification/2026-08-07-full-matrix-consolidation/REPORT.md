# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `e678b6c8b487e0617fb2add21503af0e1961b59f`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: one compact working notebook of verified necessary current work, not a lifetime history.

The Product delta from the earlier Karty/Nagornaya anchor `9a0db0dc...` to current `e678b6c8...` changed only release-contract files, so Karty/Nagornaya/shared CSS/JS source witnesses remain applicable while release-control evidence was reverified on current main.

## Operating model

```text
raw evidence
→ current verification / re-verification
→ enough witnesses for the risk
→ verified necessary current work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy for useful retirement context
```

Holding/future routes do not inflate the public runtime defect count. Optional or measurement-first work belongs in `WORK_QUEUE.md`.

## Current MASTER

Current active work is **27 work units**:

- **14** direct current defects;
- **7** verified necessary improvements;
- **0** residual-only rows;
- **2** bounded system packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed/inert rows are absent from MASTER. Retirement context is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`.

## Exact current roots established in this wave

### Release/control plane

- `AUDIT-P2-WORKFLOWS-CHECK-GAP` — current live verifiers can fail strict preflight before creating JSON evidence, while `deploy.yml` evidence uploads run with bare `if: always()`. An early generic failure can therefore produce no generic report, skip the TTS verifier and then run uploads against missing files. Active Product PR #1092 is the exact repair owner; AuditRepo does not create a competing Product lane.
- `D-2` — `css-layer-validator.js` advertises declared `@layer` ordering but never compares actual block sequence against `declaredLayers`; it also reports a target ≥80% while only `<50%` creates a warning. Make the validator contract truthful.

The old `SYS-AUDIT-CONTROL-PLANE` was dissolved. Historical workflow-count, stale marker, `atlas:gate` and breakpoint-count symptoms were retired after current-source checks.

### Public Karty strict-native surfaces

Active public maps are Avraam and Ishod. Current direct roots retained in MASTER are:

- `MAP-P1-01` — tour `sid` vs `tourStepIdx` state drift;
- `MAP-P1-10` — public Ishod has no geographic base layer;
- `MAP-P1-11` — scale bar uses configured map width instead of rendered canvas width;
- `MAP-P1-18` — multi-photo modal lacks full-source/gallery-index context;
- `WAYP-P1-01` — waypoint labels resolve to only a few CSS pixels on current Avraam viewports;
- `ENGINE-P1-26` — search can expose an out-of-story result that cannot be opened;
- `ENGINE-P2-03` — unconditional ~600ms post-data loading overlay;
- `ENGINE-P2-04` — no canonical live-region/status owner for map notifications;
- `MAP-P1-13` — scripted `flyTo()` motion persists under reduced-motion;
- `MAP-P1-20` — Ishod loads unversioned shared engine under SW cache-first ownership.

`BASE-P1-01` was promoted as a **necessary dependency** of `MAP-P1-10`: current shared `karty/_engine/base-geo.svg` cannot be wired safely because its `<defs>` is empty while it references `#landG`, `#seaG`, `#soft`, `#hill`, `#peak`, `#peak-snow` and other unresolved IDs. Repair means one valid explicitly owned geographic base asset, not blindly enabling the broken shared file.

### Holding Karty routes

Shoftim, Early Church and Shvatim are canonical `KartyHoldingPage` routes. Their unfinished route/data/visual issues are therefore represented by one bounded package:

`SYS-KARTY-HOLDING-PUBLICATION-READINESS`

The public hub/HoldingPage contract already defines the activation checks: initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality. Route/schema readiness is checked in the same activation transaction. Old decorative `sheet-engine.js`/glyph/ornament/halo/sea-pattern preferences are not independent P1 requirements.

The former `SYS-KARTY-DATA-PROJECTION` and `SYS-KARTY-VISUAL-LANGUAGE` were merged into this one owner.

Current vector/data retirements include:

- `RIVER-P1-01`: `waterRipple` is defined but not applied, so current displacement cannot cause the historical shoreline defect;
- `RIVER-P1-02`: fixed, filter exists;
- `RIVER-P1-03/04`: no current visual/browser failure witness;
- `BASE-P1-03`: old land-color formulation no longer matches current Avraam asset;
- `SVG-P1-01`: historical `&nbsp;` export symptom no longer found;
- `DATA-P1-03`, `DATA-P2-01`, low-anchor-count claims: authoring/design properties, not independent current failures;
- `ROUTE/RELIEF/GLYPH/GRAT/SEA/ORN/HALO/ARCH` sheet-engine rows: reference/decorative family, not canonical browser-runtime requirements.

### Nagornaya

The old `SYS-NAGORNAYA-MIGRATION` was dissolved into:

- `NG-INLINE-01` — public Part I `Из библиотеки` still owns inline hardcoded light-palette presentation, bypassing the theme/token owner;
- `NG-DEAD-01` — 15 extracted `HeaderHero` / `ArticleBody` / `PostContent` files remain zero-consumer artifacts while all five canonical routes render `MainShell`.

### Shared CSS/runtime

The old shared hygiene SYS was dissolved into:

- `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` — exact duplicate `fx-breathe` and mobile `.gb-floater` ownership;
- `AUDIT-JS-ESCAPER-DUP-X5` — three local `site.js` HTML escapers + one in `highlights.js` + one in `search.js`, with no shared primitive in `site-utils.js`.

`D-4` is now cleanup/polish, `NF-DEAD-ENHANCE-SHIM` is strangler context, and old Home focus-visible deficiency is stale because global CSS supplies link/button focus outlines.

## Remaining system ownership

Only two `SYS-*` rows remain:

1. `SYS-KARTY-HOLDING-PUBLICATION-READINESS` — one bounded activation transaction for held maps.
2. `SYS-STRANGLER-RETIREMENT` — legacy/reference immutable identity, classification, replacement parity and physical-retirement readiness. Product PR #1090 remains the collision owner.

## Strangler current owner boundary

PR #1090 is intentionally narrow. Its current body proves two exact fixes (inventory discovery and `/about/` immutable identity), but explicitly leaves:

- **29 native shadows still unclassified**;
- **52 remaining readiness blockers** after the PR's expected two-blocker reduction;
- physical move/delete still **unauthorized**;
- no reader migration, obsolete-audit removal or historical HTML deletion in that PR.

Therefore the strangler SYS remains legitimate, but its completion condition is now exact: finish classification/immutable identity/replacement parity until retirement readiness authorizes bounded physical removal. No parallel Product implementation is opened while #1090 owns that surface.

## Other direct/improvement rows retained

- `S-SEC-01` — sanitizer design;
- `AR-IDX-09` — modified Search shortcut ownership;
- `SEARCH-P3-02` — truthful search continuation/result total;
- `AR-IDX-05` — cache/version identity consolidation.

## Owner decisions retained

- `SEARCH-P2-07` — Bible corpus rights/provenance/import boundary;
- `GENESIS6-ACTIVATION-OWNER-GAP` — publication/finalizer owner;
- `REG-001` — hosting/proxy response-header decision;
- `NG-VIS-04` — author/editor decision on rewriting dense structured content.

## AuditRepo branch/validator state

The compact model is executable:

- closed rows forbidden in compact MASTER;
- active rows require current evidence/direct witness;
- legacy-only active work fails closed;
- evidence-only historical IDs do not force permanent active/alias registration;
- retired aliases do not require dead canonical targets to remain active;
- regression fixtures cover improvement sections, count drift, closed-row rejection, legacy-only actives, duplicate JSON keys and evidence-only history.

Earlier exact-head green checkpoints in this wave include `ddb352c58753743e45b0350d088adefbb119673d` and `e821d85d56d8f43fb052cd78f85047480b800a2e`. The latest classification commits require a new exact-head CI check before PR #227 can merge.

## Product owner snapshot

Current main anchor: `e678b6c8b487e0617fb2add21503af0e1961b59f` (#1120 merged).

Relevant open owners:

- #1092 — exact release/live-evidence lifecycle repair;
- #1090 — legacy/reference identity + retirement readiness;
- #1097 — tooltip/layout regression guard owner;
- #1129 — Home footer settled-frame contract;
- #1130 — ReaderSettings follow-up.

Product `AGENTS.md` still contains the older “durable registry / close rather than remove rows” wording; the earlier connector write was blocked, so it has not been silently changed.

## Next boundary

1. keep `SYS-STRANGLER-RETIREMENT` exact against #1090 blockers/classification progress;
2. require latest exact-head AuditRepo CI green;
3. re-read PR #227 mergeability/reviews after CI;
4. merge only when latest head is green and owner state is clean;
5. continue subsequent verification from AuditRepo main.