# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `87d1a3c26c61e474603b1c68b551fde9163f744a`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: make MASTER a compact working notebook of verified necessary work, not a lifetime history.

## Governance result

The current model is:

```text
raw evidence
→ verification / re-verification
→ enough independent witnesses for the risk
→ verified necessary work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy for useful retirement context
```

MASTER can contain bugs, necessary implementations/improvements, system work, required migration/retirement, residuals and owner decisions. Optional or speculative improvements belong in `WORK_QUEUE.md` until verification proves necessity.

## Current MASTER result

Current active work is 27 work units:

- 9 direct current defects;
- 6 narrowed residuals;
- 8 system verification/work packages;
- 4 owner decisions.

Closed/stale/duplicate/absorbed rows are not retained in active MASTER. Retirement mapping is in `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; the full pre-cleanup matrix is recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`.

## Current Product collision witness

At the verification anchor, Product owners already occupy these SYSTEM surfaces:

- PR #1093 — shared article tooltip runtime / Hermenevtika popup behavior;
- PR #1095 — ReaderRail / ReaderSettings desktop geometry;
- PR #1096 — Reader Projection workflow linkage;
- PR #1097 — dependent tooltip/layout regression contracts;
- PR #1092 — release/live-evidence control plane;
- PR #1090 — legacy-reference identity/inventory/ledger.

Product #1104 is already merged into the current anchor and corrected the interactive tooltip physical-pointer audit transport.

Therefore this wave intentionally performs no competing Product mutation.

## Direct current defects

### `S-SEC-01`

Current `js/enhancements.js` still sanitizes authored HTML through a fixed blacklist/attribute-stripping pipeline. Retain as current SYSTEM security work; any repair needs a shared owner and adversarial fixtures rather than a route-local patch.

### `MAP-P1-11`

Current MapEngine scale-bar math still derives pixels from configured map width / viewBox width rather than actual rendered canvas width. Retain.

### `MINI-P1-01`

Current minimap still uses a minimal blank rectangle + dots + viewport representation and wraps/reassigns `flyTo` to keep itself synchronized. Retain as current architecture/UX debt.

### `SIG-P1-01`

Current signature rendering still contains fixed map-unit offsets such as `origin.x - 74` for the water-split signature. Retain.

### `ENGINE-P2-04`

Current Karty toast/story notification ownership has no proven canonical live-region/status contract. Retain until browser/a11y verification either closes or repairs it.

### `AR-IDX-09`

Current global Search lazy/bootstrap key handler triggers on `(metaKey || ctrlKey) && key === "k"` and does not reject Alt/Shift modifiers. Retain.

### `SEARCH-P3-02`

Current Search result paths still use bounded visible result slices without a result-total/show-more ownership. Retain as a current search-discovery improvement/defect.

### `SEARCH-P3-03`

Current Search preview copy path constructs canonical `https://gospod-bog.ru` links behind a generic copy-link action. Retain until behavior is made explicitly canonical or current-origin.

### `AR-IDX-05`

Current Home source still declares a numeric `SITE_CONFIG.version` and explicit version query strings for shared assets. Retain as cache/version owner debt; coordinate with current legacy/reference work before repair.

## Narrowed residuals

### `MAP-P1-13`

The original broad accessibility claim is stale: current interactive markers receive button semantics, keyboard focus and accessible labels; panel tabs also have explicit ARIA/roving focus ownership. Only reduced-motion / remaining interaction semantics need a current bounded recheck.

### `MAP-P1-20`

Prior re-verification already disproved the `route.json` SW-cache half. Residual remains the unversioned shared `map-engine.js` asset/cache-first ownership.

### `QUAL-P1-09`

Prior re-verification narrowed this to holding/noindex route-profile publication-status semantics. Recheck profiles + validators together.

### `D-1`

The old concurrency formulation was partly repaired. Only cross-workflow deploy/IndexNow race semantics remain and overlap current release-control-plane work.

### `D-19`

Rimlyanam half is already repaired; only the Antisovetov custom title/social/JSON-LD ownership residual needs exact-current verification.

### `NEW-OG-SIZE-PARAM`

The single hardcoded size check is superseded by an approved social-image profile allowlist. Residual is whether route-specific image profiles need a stronger owner.

## Current system work packages

### `SYS-KARTY-RUNTIME-GEOMETRY`

Retained. Current MapEngine has received major repairs since the original deep audit, so old line-by-line claims are not current authority. However current-source checks still prove independent geometry/runtime debt (`MAP-P1-11`, `MINI-P1-01`, `SIG-P1-01`, `ENGINE-P2-04`) and the Product history contains later geometry guards that explicitly report remaining authored geometry rather than silently changing it. One representative source+browser wave is justified.

### `SYS-KARTY-DATA-PROJECTION`

Retained pending current data/schema/base-geo verification. Historical source claims cannot authorize direct engine edits after authored path rendering, archaeology projection integration, story-ID schema and route-inventory owner changes.

### `SYS-KARTY-VISUAL-LANGUAGE`

Retained only as a verification/value package, not as a claim that every historical visual P1 remains a bug. Current screenshots + owner requirements must distinguish genuine necessary improvements from taste/polish before any Product lane.

### `SYS-AUDIT-CONTROL-PLANE`

Retained because current Product work still proves active control-plane ownership and linkage/evidence gaps, but it is collision-blocked by #1092/#1096/#1097. Do not start a competing lane.

### `SYS-SEO-RELEASE-SURFACES`

Retained for a bounded current route/live/tooling verification after #1092 settles; old exact formulations are not repair authority.

### `SYS-NAGORNAYA-MIGRATION`

Retained but narrowed substantially.

Current evidence:

- every inspected Part I–V route currently imports `NagornayaChastNMainShell`, not the earlier fine-grained `HeaderHero/ArticleBody/PostContent` composition;
- the extracted Part I `HeaderHero`, `ArticleBody`, `PostContent` files still exist, confirming real dead extraction residue rather than a purely historical claim; the same package requires an exact import inventory before deletion;
- current Parts IV–V already expose `data-pagefind-meta="scripture"`, so that half of `NG-SEO-01` is fixed;
- current part footers delegate to one shared `NagornayaPageFooterRuntime`, so the old per-part footer-version inconsistency no longer describes the current owner;
- current Part I `MainShell` still contains repeated inline `Из библиотеки` color/background/style markup, so the old `NG-INLINE-01` mechanism remains real even though later CSS supplied visual overrides;
- current `nagornaya-mobile-toc.css` still has series-wide `--ng-toc-accent` / `--ng-toc-accent-2` tokens. Whether per-chapter TOC accents are still a requirement is a value/design question, not assumed defect.

Next wave should inventory all Part I–V extracted components/importers, classify the inline-library block as shared-component migration vs accepted current source, and retire visual/color rows that are only optional style preferences.

### `SYS-SHARED-CSS-RUNTIME-HYGIENE`

Retained for a current AST/source pass after active reader UI work. Historical duplicate CSS/escaper/dead-shim claims are insufficient alone, but duplicate-owner drift has produced real regressions before, so the class merits one current check rather than many old rows.

### `SYS-STRANGLER-RETIREMENT`

Retained and collision-owned by Product #1090. Current retirement readiness depends on moving parity/reference authority, not deleting shadows by count.

## Owner decisions

### `SEARCH-P2-07`

Retain. Bible corpus publication/import is blocked by acquisition/provenance/rights evidence, not by a missing local patch. CrossWire `RusSynodal` 1.9.1 remains candidate-only until exact archive/hash/mapping/import evidence is complete.

### `GENESIS6-ACTIVATION-OWNER-GAP`

Retain until an owner chooses/executes the canonical Product finalizer/publication transaction.

### `REG-001`

Retain until hosting/proxy response-header strategy or accepted-risk disposition is chosen.

### `NG-VIS-04`

Retain as an editorial owner decision: changing dense structured sections into prose is author-sensitive and cannot be inferred from technical audit alone.

## Retired findings

The 2026-08-07 cleanup retired or absorbed 24 former open rows and collapsed many more historical symptom rows into the eight current system work units. See `../../legacy/MATRIX_CLEANUP_2026-08-07.md`.

Important explicit closures in this wave include:

- `CI-WEBKIT-TOC-NONDETERMINISTIC` — Product `a130ca01` fixed the diagnosed WebKit ToC readiness race;
- `SEARCH-P3-01`, `AR-IDX-03`, `HOME-P3-FOOTER-EDGE-CONSOLE` — Product PR #1079 established one platform-aware Search label owner and repaired Home footer safe inset;
- `AR-IDX-JS-02` — current `site.js` uses the `theme` storage key;
- `R-006` — current TTS heavy work is lazy and Worker-owned;
- `AR-001`, `AR-004`, `AR-005` — AuditRepo operating-model/validator work superseded those maintenance obligations.

## Branch forensic

Live AuditRepo refs observed at wave start:

- `main`;
- `archive/forensic-pr-3-vosk-tts-report-2026-07-24`;
- `archive/legacy-diverged-heads-20260801`.

The first archive contains a unique historical Vosk TTS report plus a stale README delta; do not merge the branch wholesale. The second contains only reviewed archival ledgers/receipts. Unique evidence should be materialized into main/legacy/archive before any archive ref is retired; no important evidence may be deleted merely to reduce branch count.

## Next checks

1. finish exact Nagornaya importer/current-source inventory and shrink `SYS-NAGORNAYA-MIGRATION` accordingly;
2. current-check Search residuals and Antisovetov SEO residual;
3. current-check Karty system packages against the materially changed engine;
4. inspect shared CSS/runtime hygiene after reader owners settle;
5. consolidate the two intentional archive branches into ordinary retained files before retiring refs, if exact evidence preservation can be proved.
