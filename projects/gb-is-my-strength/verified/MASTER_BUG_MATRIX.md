# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current closure / main-advance evidence: [`../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md).  
Current S12 / in-flight guard recheck: [`../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Current Home / owner / CI recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).  
Previous Search/CSS handoff evidence: `../verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `6d671d0e30bff8da1f7354a00191ab990f17ed12` |
| Wave | Reader/browser marathon + S12 narrowing + Current-Gold owners, 2026-08-08 |
| Active work units | **14** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **1** |
| System verification lanes | **6** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

Эта wave расширяет проверку от узкого технического defect census к **publication truth + reader complete-process truth**: current Product может быть технически зелёным и одновременно иметь подтверждённый reader-facing content/projection/readiness или control-semantics debt. MASTER по-прежнему хранит только крупные текущие work roots; детальная декомпозиция и evidence находятся в verification reports и Product issues.

`BAPT-CONTENT-TRUTH-01` удалён из active MASTER после Product `#1217`, merged как `670d82fa5b567813a52886c62c704047f76b4b71`. Exact PR head `e1bbc4746904a5c7639c49146c4d434f74bdb038` прошёл все 5 triggered workflow groups, review threads = 0. QA authority теперь закрывает Q4 как **11** арестованных на документальной опоре Савина/РГАСПИ, Q8 как **1–6 апреля 1884** на Никитине/Степанове + независимом witness начала 1 апреля, а C8 корректно сужен. Public bodies уже совпадали с более сильной authority, поэтому closure потребовал только reconciliation register, а не переписывание reader prose.

`GILL-PROJECTION-01` ранее удалён после Product `#1213`, squash-merged как `a068decefff4ddd0055da952c84b7a3633d7b43b`: canonical Gill sequence восстановлен в обеих `/biografii/` projections, stale «Трилогия» снята, graph ordinal drift устранён, а существующий Gill consistency guard расширен на этот класс расхождения.

Product `#1218` merged как `6d671d0e30bff8da1f7354a00191ab990f17ed12`: reader-facing S12 leak в «Подпольной печати» убран, `сохранены/сохранён локально` `е/ё` false-green закрыт fixture-guard. `BAPT-S12-01` поэтому **сужен**, а не считается полностью закрытым: Spravochnik PageHead всё ещё публикует backstage metadata wording, и текущий `sources:hygiene` body/MDX walker не является доказательством PageHead-чистоты. Этот exact PageHead пока занят Search `#1209` deterministic projection, поэтому остаток sequenced after Search release.

Product advance `a068dece... → 6d671d0e...` не является сам по себе поводом переоценивать Home или другие независимые surfaces. Directions/Ambient presentation-owner convergence остаётся в `WORK_QUEUE.md` без свежего direct regression witness.

---

## CURRENT DEFECTS — 2

| ID | Current defect / required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Закрыть **оставшийся public-metadata S12 residual** и распространить hygiene contract на reader-facing metadata projection без повторного ремонта уже исправленного body. | Product `#1218` merged как `6d671d0e...`: Body rewrite + `сохранены/сохранён локально` `е/ё` guard + fixtures закрыты. Current `BaptistyRossiiSpravochnikPageHead.astro` всё ещё содержит `research-досье и очередь правок 3D-карты` в description/Twitter/OG/JSON-LD. `sources:hygiene` false-green объяснён точно: scanner body/MDX-oriented и не доказывает PageHead metadata. Exact PageHead занят Search `#1209`; не открывать конкурирующий edit. [`REPORT`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md) |
| `CATALOG-PROJECTION-01` | Сделать `/articles/` правдивой derived projection текущих публикаций/серий вместо ручной копии метаданных; исключить orphan-by-catalog и ручной drift title/time/count. | Hero обещает «Все статьи», а publication grid hand-authored. Current drift уже наблюдаем: Gill представлен неполно как publication set, а ручное время чтения `Римлянам 7` расходится с canonical Heart data (`12` vs `45` минут). Product `#1216` закрыт как `SUPERSEDED_VERIFIED`; чистый bounded successor `#1221` на current main переносит derived catalog, guard, удаление старого manual owner и deterministic Scripture projection. [`REPORT`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `SEARCH-P3-02` | Give Search one truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrence paths: expose total vs shown state and deterministic continuation without reopening global shortcut ownership. | Product `#1209` remains the current owner. Latest observed actual head `e06a1abec8a503177ff7bb6b16f94219b72dec27`; against Product `main@6d671d0e...` it is currently `behind=1`, so earlier green exact-head sets remain semantic evidence only until current ancestry/final head is green. `verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md` |
| `AR-IDX-05` | Replace the generic runtime `SITE_CONFIG.version` bridge with explicit per-asset revision authority for runtime-loaded CSS (or an equivalent injected asset map), then remove the misleading generic bridge when unused. | Canonical hashes already exist for `css/enhancements-runtime.css` and `css/highlights-runtime.css`, but `js/enhancements.js` and `js/highlights.js` version those files with generic `SITE_CONFIG.version`; `BaseLayout.astro` seeds that field from the unrelated `js/glossary.js` hash. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers, preserving loader availability and context/output equivalence rather than replacing helpers mechanically. | Fresh current-source re-read confirms five separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 6

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Детальная декомпозиция Current-Gold работ находится в linked REPORT и **не является второй active matrix**.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-READER-CONTROL-SEMANTICS` | Один shared repair root для truthful control→surface behavior across standalone/full-series reader engines: Menu ≠ Search, config-owned Back, valid trigger relations/states, valid list semantics and no duplicate standalone control drift. | Product issue `#1224` — canonical root. Current source proves: standalone ReaderRail hamburger promises site sections but dispatches Search while a separate Search magnifier already exists; shared series mobile Back hardcodes `../../biografii/` instead of `SeriesConfig.railBackHref`; standalone/series TOC lists contain decorative direct children under `<ul>`; standalone/series TOC/Settings relations are incomplete; Baptist `quiz: []` leaves an orphan `panelQuiz aria-labelledby=tabQuiz`; KdV renders duplicate desktop Settings actions. Existing OverlayRuntime remains healthy and must not be replaced. First bounded implementation slice `#1227` extends the existing `reader-controls-a11y.js` owner + its permanent Chromium contract for already-working surfaces; Search/menu extraction waits for `#1209`. Browser census `#1212` remains evidence/guard, not Product repair. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one source identity and truthful screen + accessibility + print projections, instead of treating the citation body as tooltip-only UI. | Product issue `#1225` — canonical root. Current `reader-projection.js` excludes `.fn-marker/.tooltip` as note UI for reader/TTS projection, while current print CSS explicitly hides `.tooltip` with `display:none!important`; Hermenevtika current source still has many generic `aria-label="Показать сноску"` markers whose citation body exists only inside the tooltip. Preserve completed nested-Bible repair `#53` and existing physical PDF geometry owner; add deterministic print endnote completeness + unique marker→note relations rather than making floating tooltips visible on paper. |
| `SYS-CURRENT-GOLD-READINESS` | Build a **derived** current-publication readiness layer on top of existing Product authorities, not a new publication registry. It must distinguish source acceptance from live publication and make human discoverability, metadata approval, Research/content holds, visual evidence and production witness explicit. | Product `#1220` is the bounded first implementation owner and is based on current Product lineage. Human-reachability witness is derived from public-surface authority and rendered Chromium/JS-disabled evidence; no second publication registry. Existing Product issue `#298` remains visual-golden authority. [`REPORT`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | One series-level readiness program for the 10 Baptist routes **after independently actionable direct defects above are handled**: Research/current-scope closure, source confidence, authentic media provenance, roadmap realization, 2D diagrams where useful, modern-stat as-of discipline and 3D data/build/live convergence. | Current Product roadmap explicitly says the articles are not final and requires depth, local rights-cleared media and map sync; canonical media ledger is still TODO-only; visual atlas entries remain `planned`; Research records source-snapshot 3D corrections not rebuilt into production iframe. Decompose implementation into article/data/media/map lanes; do **not** make one mega-PR. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is clear for the retained legacy/native-shadow surface; storage-location abstraction and remaining dependency blockers are handled through bounded Strangler waves rather than direct legacy deletion. | Product `#1222` is current storage-abstraction Wave A on `main@6d671d0e...`; it changes five intended files and is designed to reduce mechanical blockers without moving/deleting legacy bytes or resolving owner decisions. Merge/deletion remains exact-head evidence gated. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation**: Product Charter currently says Synodal by default while the Content Quality annex directs NT Cassian / OT Synodal; Research `d52ea9d...` keeps current corpus fail-closed, Cassian permission-controlled, and CrossWire `RusSynodal` 1.9.1 candidate-only pending exact archive/hash/mapping/import proof. Do not expand permission-unproven corpus before this owner decision. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `REG-001` | Hosting/proxy decision for response-level CSP/X-Frame/Referrer/Permissions headers, or explicit accepted-risk disposition. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-VIS-04` | Author/editor decision whether dense table/card material should be rewritten into more prose/air. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

`GENESIS6-ACTIVATION-OWNER-GAP` remains retired as **stale/fixed-current**: Product issue `#362` is closed `completed`, and its final lifecycle evidence records `COMPLETED / PRODUCTION WITNESSED / NO OPEN GENESIS PRODUCT DEFECT`. Historical context remains in Product issue history and prior AuditRepo verification; no new Product lane is authorized by this retirement.

---

## IN FLIGHT — do not collide

Not extra work units; current Product owners or existing issue authorities that constrain implementation:

- Product `#1209` remains the owner for `SEARCH-P3-02`, actual head `e06a1abec8a503177ff7bb6b16f94219b72dec27`; against Product `main@6d671d0e...` it is currently `behind=1`. Do not merge from an older green set; refresh ancestry and rerun exact current head.
- `#1209` also touches `BaptistyRossiiSpravochnikPageHead.astro` for deterministic command-palette cache revision. The file contains the remaining `BAPT-S12-01` metadata leak. Do not open a competing PageHead edit while Search owns the file; sequence/coordinate the S12 metadata repair after release of that exact owner.
- Product `#1218` is **merged** as `6d671d0e30bff8da1f7354a00191ab990f17ed12`. It closed the S12 body/`е/ё` guard manifestation only; do not keep treating it as an active branch owner and do not claim it closed the Spravochnik PageHead residual.
- Product `#1216` is **closed unmerged / SUPERSEDED_VERIFIED**. Canonical catalog owner is `#1221`, based on current Product lineage. Do not resurrect predecessor-only workflow writer mutation.
- Product `#1212` is audit-only current work to add an all-reading-route interaction census. Frozen calibration head `3292f4c36c0225d438e234ba3eb1b3d286c6459d` is now `behind=3` from `main@6d671d0e...`; its in-flight browser run is calibration evidence only. After artifact classification, refresh current-main ancestry non-force and rerun; do not use old-head success/failure as merge authorization.
- Product `#1227` is the first bounded implementation slice of `SYS-READER-CONTROL-SEMANTICS`; exact head at this wave is `49aa055c1f4f7ff122afb7d0a2db34273d7b5ec2`. It touches only `src/runtime/reader-controls-a11y.js` + its existing permanent Chromium contract, and deliberately leaves Back/menu/list/KdV/inner-accordion residuals open. Do not broaden it into Search/menu extraction or visual redesign.
- Product `#1220` is the current first implementation owner for `SYS-CURRENT-GOLD-READINESS`. It must remain derived from public-surface authority, not become a second publication registry; no second MASTER row is needed for in-flight harness details.
- Product `#1222` owns the current Strangler storage-abstraction Wave A. Do not overlap its migration/legacy-reference files from reader/catalog/search work.
- Product `#1223` is diagnostic-only npm security inventory and **must not merge**; its existence is not a Product dependency/runtime mutation owner.
- Product issue `#1224` owns the shared reader-control semantic root; issue `#1225` owns footnote publication projection. Old Hermenevtika issue `#54` now has a handoff comment pointing shared residuals to these SYSTEM owners; only fresh route-specific Hermenevtika residuals should remain local to #54.
- Fresh Home recheck found no new direct defect. Directions/Ambient presentation-owner convergence remains optional in `WORK_QUEUE.md`; do not create a Product `SYS-HOME-*` lane unless its recorded promotion trigger is met.
- Existing Product issue `#298` already owns the product-golden blind spot. `SYS-CURRENT-GOLD-READINESS` and reader visual work should consume/reference that evidence rather than opening a duplicate visual-baseline program.
- No separate Product repair lane is authorized merely because this audit decomposes future work; every Product mutation still requires fresh owner/open-PR/current-surface discovery.
- Do not combine Search continuation, runtime asset identity, JS escaper consolidation, catalog projection, reader-control semantics, footnote projection and Current-Gold tooling into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

- `#1218` — S12 reader-body wording + `е/ё` guard repair; merged Product `6d671d0e...`; S12 row narrowed to metadata residual;
- `#1217` — Baptist publication-truth reconciliation; merged Product `670d82fa...`; row retired;
- `#1216` — closed unmerged as `SUPERSEDED_VERIFIED`; clean catalog successor is `#1221`;
- `#1214` — closed unmerged as `SUPERSEDED_VERIFIED`; body/guard successor was `#1218`;
- `#1213` — Gill public series projection convergence; Product `a068dece...`;
- `#1205` — closed duplicate shared CSS owners; Product `21b437cb...`;
- `#1197` — series-level Nagornaya library theme ownership repair; Product `76ad2f3f...`;
- `#1195` — FAQ JSON-LD text-only security repair; Product `a2d0ce58...`;
- `#1183` — global Search shortcut/runtime ownership closure; Product `67c23492...`;
- `#1193` — Hermenevtika accepted-semantic anchor repair; Product `f3e291b7...`;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I; Product `c9055428...`;
- Genesis issue `#362` — completed and production witnessed; its former owner-gap row is retired.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. Detailed audit decomposition belongs in verification evidence; it does **not** become active merely because it has an ID in a report.
3. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
4. Solve → verify result → remove from MASTER immediately.
5. Many symptoms with one root → one `SYS-*` row.
6. Holding routes are one activation/readiness transaction until a blocker becomes independently current.
7. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
8. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.
9. A moving Product `main` alone is not a reason for AuditRepo authority-sync; update MASTER only when finding disposition, scope, evidence or actionable handoff materially changes.
10. `CURRENT GOLD` is a derived evidence state, not a manually maintained second SSOT.
