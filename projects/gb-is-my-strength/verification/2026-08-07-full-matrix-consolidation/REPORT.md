# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `e678b6c8b487e0617fb2add21503af0e1961b59f`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: keep one compact working notebook of verified necessary current work, not a lifetime history.

The previous Product anchor `9a0db0dc4533cb473abfe57f86e27517f04deea6` advanced by exactly one merged commit to `e678b6c8...`; that delta changes only `scripts/live-release-contract.mjs` and `scripts/release-pipeline-contract-test.mjs`. Karty/Nagornaya/shared-CSS/JS source witnesses from the earlier anchor therefore remain byte-relevant, while release-control evidence is reverified on the new current main.

## Governance result

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

MASTER may contain defects, verified necessary implementations/improvements, bounded system work and owner decisions. Optional/speculative or measurement-first work belongs outside MASTER. Holding/future routes do not inflate the public runtime defect count merely because unfinished source exists.

## Current MASTER result

Current active work is **27 work units**:

- **14** direct current defects;
- **6** verified necessary improvements;
- **0** narrowed residuals;
- **3** bounded system packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed/inert rows are absent from active MASTER. Retirement mapping is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; optional measurement work is in `../../WORK_QUEUE.md`.

## Current direct defects

### Release / shared / Search

- `AUDIT-P2-WORKFLOWS-CHECK-GAP` — current main release evidence lifecycle can lose the report needed to diagnose early live-verifier failure. `live-release-contract.mjs` and `tts-live-deployment-contract.mjs` perform strict environment/candidate preflight before creating their JSON report; `deploy.yml` later uploads both evidence files with bare `if: always()`. A generic preflight failure can therefore produce no generic report, skip the TTS verifier under normal step success semantics, and then execute evidence-upload steps against missing files. Active Product PR #1092 is the exact repair owner; AuditRepo does not open a competing Product lane.
- `S-SEC-01` — current `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design.
- `AR-IDX-09` — current global Search shortcut does not reject Alt/Shift-modified Ctrl/Command+K.

### Public Karty strict-native surfaces

- `MAP-P1-01` — tour computes actual `sid`, while caption/highlight still use `tourStepIdx`.
- `MAP-P1-10` — canonical Ishod omits `baseGeoUrl`; public map has no geographic base layer. Shared `base-geo.svg` is not yet safe to wire blindly because it has empty `<defs>` while referencing unresolved asset IDs.
- `MAP-P1-11` — scale bar uses configured map width instead of actual rendered canvas width.
- `MAP-P1-18` — multi-photo modal receives thumbnail/no gallery index and cannot swipe the multi-photo set correctly.
- `WAYP-P1-01` — verified waypoint labels resolve to only a few CSS pixels on current Avraam view widths.
- `ENGINE-P1-26` — search can visually expose an out-of-story marker that current interaction ownership will not open.
- `ENGINE-P2-03` — MapEngine hides already-resolved route content behind a fixed ~600ms loading overlay.
- `ENGINE-P2-04` — story/toast notifications lack canonical live-region/status ownership.
- `MAP-P1-13` — scripted `flyTo()` motion remains active under reduced-motion.
- `MAP-P1-20` — Ishod loads unversioned shared `map-engine.js`, which the SW treats as cache-first static JS.

### Nagornaya

- `NG-INLINE-01` — public Part I `Из библиотеки` remains inline hardcoded light-palette presentation inside `MainShell`, bypassing theme/token ownership.

## Verified necessary improvements

- `D-2` — make `css-layer-validator.js` enforce what it advertises. It currently collects declared/found layers and flags undeclared names but never compares actual block sequence against declared order. Its output also says target ≥80% while only `<50%` becomes a warning. The validator contract must become truthful.
- `NG-DEAD-01` — remove the 15 zero-consumer extracted Nagornaya `HeaderHero` / `ArticleBody` / `PostContent` artifacts or deliberately restore them as the canonical componentization boundary.
- `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` — narrowed current duplicate CSS owner cleanup: two `fx-breathe` definitions plus duplicate mobile `.gb-floater` ownership.
- `AUDIT-JS-ESCAPER-DUP-X5` — one canonical HTML-escape primitive instead of current 3× `site.js` + `highlights.js` + `search.js` copies.
- `SEARCH-P3-02` — truthful search result total/continuation beyond Pagefind 10 / fallback 12.
- `AR-IDX-05` — consolidate Home/shared version/cache identity instead of parallel `SITE_CONFIG.version` and asset revision authorities.

## Dissolved `SYS-AUDIT-CONTROL-PLANE`

The old control-plane package was removed after current-source classification.

### Retired / superseded symptoms

- `CI-WORKFLOW-PROLIFERATION` — workflow count alone is no longer a valid problem statement. Current `repository-control-plane-audit.mjs` enumerates every workflow, filesystem-derived local reference, effective permission set and registered privileged job; Shared Files requires the control-plane audit and actionlint.
- `S-T-01` — old route-parity gap is superseded. Workflow Policy v2 derives production route coverage from `migration/page-ownership.json`, while `validate:static-publication` composes page-ownership and route-family native/visual audits.
- `GATE-MARKER-DATA-DRIFT` / `NF-GATE-IZ5-STALE` — the old exact forbidden marker `«Часть 1 из 5»` is absent from current Product search.
- `GATE-P1-03` — historical `atlas:gate` is no longer a current package-script owner; current `maps:validate` owns route validation/publication status and current browser smoke exists separately.
- `BUG-011` — old “23 breakpoints / 768px collision” count has no independently reproduced current collision witness after responsive-owner migrations.

### Promoted exact roots

- `AUDIT-P2-WORKFLOWS-CHECK-GAP` — narrowed release evidence lifecycle defect described above.
- `D-2` — exact CSS-layer validator contract gap described above.

Current release controls are otherwise substantially stronger than the historical package implied: `check-workflows.js` is Workflow Policy v2, `repository-control-plane-audit.mjs` parses permission/control-plane policy, and `release-pipeline-contract-test.mjs` currently rejects a broad adversarial mutation suite around exact release/control SHAs, immutable candidate identity, action pins and build-once promotion.

## Karty publication boundary

Current canonical sources distinguish public interactive maps from holding/readiness routes:

- `/karty/avraam/` — strict-native interactive;
- `/karty/ishod/` — strict-native interactive;
- `/karty/shoftim/`, `/karty/early-church/`, `/karty/shvatim/` — `KartyHoldingPage`.

Holding route-data/readiness defects therefore stay under `SYS-KARTY-DATA-PROJECTION` until activation or until a root independently blocks an active-map repair. The public hub/HoldingPage explicitly requires viewport, label-collision, desktop/mobile, controls, route readability and overall-quality checks; that published contract is the basis of `SYS-KARTY-VISUAL-LANGUAGE`, not historical decorative preferences.

## Dissolved Karty runtime system lane

`SYS-KARTY-RUNTIME-GEOMETRY` was removed. Public current roots were promoted, stale cinematic/custom-app symptoms retired, and `PERF-P1-01` / `QUAL-P2-04` moved to `WORK_QUEUE.md` because current material performance impact requires measurement rather than source-shape inference.

## Dissolved Nagornaya migration system lane

`SYS-NAGORNAYA-MIGRATION` was replaced by exact `NG-INLINE-01` + `NG-DEAD-01`. All five canonical routes render MainShell; a prior exact verification recorded zero imports of the 15 extracted fragments; intervening Product changes did not change those consumers; current edge extraction files still exist.

## Dissolved shared CSS/runtime hygiene system lane

`SYS-SHARED-CSS-RUNTIME-HYGIENE` was replaced by exact `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` + `AUDIT-JS-ESCAPER-DUP-X5`. `D-4` is now cleanup/polish, `NF-DEAD-ENHANCE-SHIM` is strangler context, and old Home focus-visible deficiency is stale because global CSS provides link/button focus outlines.

## Remaining system packages

### `SYS-KARTY-DATA-PROJECTION`

Holding-map publication readiness plus shared data/base dependency needed by active Ishod repair. Next pass should distinguish active Ishod basemap dependency from dormant holding-only source and retire unsupported old base/vector assertions.

### `SYS-KARTY-VISUAL-LANGUAGE`

One explicit holding-map visual publication-readiness owner. Current browser screenshots/interaction review should produce concrete blockers or retire old aesthetic rows; the package is not permission to implement arbitrary cartographic decoration.

### `SYS-STRANGLER-RETIREMENT`

Legacy/reference parity-authority migration and bounded retirement. Historical `ASTRO-P1-05` and `NF-DEAD-ENHANCE-SHIM` are context, not runtime bugs. Product #1090 remains the current collision owner and must be rechecked before changing this package.

## Owner decisions retained

- `SEARCH-P2-07` — exact Bible corpus rights/provenance/acquisition/import publication boundary.
- `GENESIS6-ACTIVATION-OWNER-GAP` — canonical Product publication/finalizer decision.
- `REG-001` — hosting/proxy response-header strategy or accepted risk.
- `NG-VIS-04` — author/editor decision on rewriting dense structured content into prose/air.

## Product owner snapshot

Current main is `e678b6c8b487e0617fb2add21503af0e1961b59f` (#1120 merged). Relevant open owners at this checkpoint:

- #1092 — release/live-evidence lifecycle (`AUDIT-P2-WORKFLOWS-CHECK-GAP` repair owner);
- #1090 — legacy/reference identity and retirement;
- #1097 — tooltip/layout regression guard owner;
- #1129 — Home footer settled-frame contract;
- #1130 — ReaderSettings follow-up.

The last two are unrelated to the Karty/Nagornaya/control-plane roots above and are listed only to avoid accidental surface collision.

## Branch forensic completed

At wave start two intentional AuditRepo archive refs contained unique forensic material. PR #228 materialized six exact ledger/receipt blobs under project legacy and PR #229 materialized exact Vosk report blob `97e9472b3019518751cdaa1fc3edb9ff2bed2ba1` without restoring stale README state. GitHub auto-deleted both archive heads after merge.

## Validator / coverage correction

Compact MASTER enforcement is executable:

- no closed rows in compact MASTER;
- active rows require current evidence/direct witness;
- legacy-only active work fails closed;
- evidence-only historical IDs do not force permanent active/alias registration;
- retired aliases do not require dead canonical targets to remain active;
- regression fixtures cover improvement sections, count drift, closed-row rejection, legacy-only actives, duplicate JSON keys and evidence-only history.

Green exact-head checkpoints already achieved include `ddb352c58753743e45b0350d088adefbb119673d` and `e821d85d56d8f43fb052cd78f85047480b800a2e`. Current later classification commits still require a fresh exact-head green before merge.

## Product governance note

Product `AGENTS.md` §4.1 still contains older “durable registry / close rather than remove rows” wording. A direct connector write was blocked by the platform safety layer; it has not been silently changed. AuditRepo canonical rules in this branch implement the newer owner directive.

## Next checks

1. reduce `SYS-KARTY-DATA-PROJECTION`, especially active Ishod basemap dependency vs holding-only source;
2. reduce `SYS-KARTY-VISUAL-LANGUAGE` to concrete publication blockers/explicit readiness evidence;
3. keep `SYS-STRANGLER-RETIREMENT` bounded to actual replacement/parity authority and #1090;
4. run exact-head AuditRepo CI after the next classification set;
5. merge PR #227 only after latest-head green and clean owner state, then continue from main.