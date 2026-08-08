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
| Product verification anchor | `670d82fa5b567813a52886c62c704047f76b4b71` |
| Wave | Baptist content-truth closure + Current-Gold/S12 owner reverify, 2026-08-08 |
| Active work units | **12** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **4** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

Эта wave расширяет проверку от узкого технического defect census к **publication truth**: current Product может быть технически зелёным и одновременно иметь подтверждённый reader-facing content/projection/readiness debt. MASTER по-прежнему хранит только крупные текущие work roots; детальная декомпозиция и evidence находятся в verification reports.

`BAPT-CONTENT-TRUTH-01` удалён из active MASTER после Product `#1217`, merged как `670d82fa5b567813a52886c62c704047f76b4b71`. Exact PR head `e1bbc4746904a5c7639c49146c4d434f74bdb038` прошёл все 5 triggered workflow groups, review threads = 0. QA authority теперь закрывает Q4 как **11** арестованных на документальной опоре Савина/РГАСПИ, Q8 как **1–6 апреля 1884** на Никитине/Степанове + независимом witness начала 1 апреля, а C8 корректно сужен. Public bodies уже совпадали с более сильной authority, поэтому closure потребовал только reconciliation register, а не переписывание reader prose.

`GILL-PROJECTION-01` ранее удалён после Product `#1213`, squash-merged как `a068decefff4ddd0055da952c84b7a3633d7b43b`: canonical Gill sequence восстановлен в обеих `/biografii/` projections, stale «Трилогия» снята, graph ordinal drift устранён, а существующий Gill consistency guard расширен на этот класс расхождения.

Product advance `a068dece... → 670d82fa...` меняет ровно один Baptist QA-register file и не трогает Home, Search runtime, S12 body/metadata, CSS или shared runtime. Home disposition поэтому не меняется: временный `astro.config.dev.mjs` отсутствовал на предыдущем exact tree, новый merge его не добавляет; Directions/Ambient presentation-owner convergence остаётся в `WORK_QUEUE.md` без свежего direct regression witness.

---

## CURRENT DEFECTS — 2

| ID | Current defect / required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Убрать reader-facing backstage research scaffolding из Baptist publication surfaces и закрыть S12 false-green как для body, так и для публичной metadata projection. | Product `#1218` — clean current-main successor для «Подпольной печати»: body rewrite + `сохранены/сохранён локально` `е/ё` guard + workspace-note fixtures. Но current `BaptistyRossiiSpravochnikPageHead.astro` всё ещё публикует `research-досье и очередь правок 3D-карты` в description/Twitter/OG/JSON-LD. `sources:hygiene` false-green объяснён точно: walker включает только `*Body.astro`/MDX и категорически не сканирует `*PageHead.astro`, поэтому уже запрещённый `research-досье` может пройти в public metadata. Среди проверенных Baptist PageHeads остаток сужен до Spravochnik. Exact файл сейчас занят Search `#1209` cache-revision projection, поэтому не открывать конкурирующий edit; closure требует #1218 result + metadata repair + guard scope/fixture на metadata class. [`REPORT`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md) |
| `CATALOG-PROJECTION-01` | Сделать `/articles/` правдивой derived projection текущих публикаций/серий вместо ручной копии метаданных; исключить orphan-by-catalog и ручной drift title/time/count. | Hero обещает «Все статьи», а publication grid hand-authored. Current drift уже наблюдаем: Gill представлен неполно как publication set, а ручное время чтения `Римлянам 7` расходится с canonical Heart data (`12` vs `45` минут). Product `#1216` закрыт как `SUPERSEDED_VERIFIED`; чистый bounded successor `#1221` на current main переносит derived catalog, guard, удаление старого manual owner и deterministic Scripture projection без predecessor-only workflow writer mutation. [`REPORT`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `SEARCH-P3-02` | Give Search one truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrence paths: expose total vs shown state and deterministic continuation without reopening global shortcut ownership. | Product `#1209` remains the current owner, but Product `main` moved to `670d82fa...`; actual head `2b90612c...` is now `behind=1` and GitHub reports mergeable=false. Earlier exact-head green/in-flight evidence is historical only until Search refreshes current-main ancestry and reruns the actual head. `verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md` |
| `AR-IDX-05` | Replace the generic runtime `SITE_CONFIG.version` bridge with explicit per-asset revision authority for runtime-loaded CSS (or an equivalent injected asset map), then remove the misleading generic bridge when unused. | Canonical hashes already exist for `css/enhancements-runtime.css` and `css/highlights-runtime.css`, but `js/enhancements.js` and `js/highlights.js` version those files with generic `SITE_CONFIG.version`; `BaseLayout.astro` seeds that field from the unrelated `js/glossary.js` hash. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers, preserving loader availability and context/output equivalence rather than replacing helpers mechanically. | Fresh current-source re-read confirms five separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 4

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Детальная декомпозиция Current-Gold работ находится в linked REPORT и **не является второй active matrix**.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Build a **derived** current-publication readiness layer on top of existing Product authorities, not a new publication registry. It must distinguish source acceptance from live publication and make human discoverability, metadata approval, Research/content holds, visual evidence and production witness explicit. | Product `#1220` is the bounded first implementation owner and has refreshed onto current `main@670d82fa...`; actual head `98b1e55c0fd5b3c7db1005552d9d128dab8e294c`, behind=0. Before merge, its “human-facing inbound link” witness must be made false-green resistant: current regex extractor excludes hidden state only on the `<a>` itself and can count links under hidden/`aria-hidden` ancestors or CSS-hidden/non-rendered geometry as `GOLD`. The audited script bytes are unchanged from the original `9cdc798...` implementation; subsequent commits only refresh ancestry. Add ancestor-aware DOM/browser-equivalent proof + adversarial hidden-parent fixtures; do not weaken the invariant. Existing Product issue `#298` remains visual-golden authority. [`REPORT`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | One series-level readiness program for the 10 Baptist routes **after independently actionable direct defects above are handled**: Research/current-scope closure, source confidence, authentic media provenance, roadmap realization, 2D diagrams where useful, modern-stat as-of discipline and 3D data/build/live convergence. | Current Product roadmap explicitly says the articles are not final and requires depth, local rights-cleared media and map sync; canonical media ledger is still TODO-only; visual atlas entries remain `planned`; Research records source-snapshot 3D corrections not rebuilt into production iframe. Decompose implementation into article/data/media/map lanes; do **not** make one mega-PR. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is clear for the retained legacy/native-shadow surface: route profiles are sole current authority; exact evidence has 53/53 public indexes covered, 53 ledger entries, 52/52 native shadows classification-clear, 0 unknown reference decisions and no integrity/inventory/parity problems. | Exact Shared Files artifact on Product `#1205` head `55c20a3f...` reconfirms **35 dependency records / 26 blockers**: **16 mechanical reader repoints + 3 obsolete/remove-or-repoint readers + 7 dependency owner decisions**; unknown dependency impacts/integrity/inventory/parity problems remain `0`; `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation**: Product Charter currently says Synodal by default while the Content Quality annex directs NT Cassian / OT Synodal; Research `d52ea9d...` keeps current corpus fail-closed, Cassian permission-controlled, and CrossWire `RusSynodal` 1.9.1 candidate-only pending exact archive/hash/mapping/import proof. Do not expand permission-unproven corpus before this owner decision. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `REG-001` | Hosting/proxy decision for response-level CSP/X-Frame/Referrer/Permissions headers, or explicit accepted-risk disposition. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-VIS-04` | Author/editor decision whether dense table/card material should be rewritten into more prose/air. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

`GENESIS6-ACTIVATION-OWNER-GAP` is removed in this wave as **stale/fixed-current**: Product issue `#362` is closed `completed`, and its final lifecycle evidence records `COMPLETED / PRODUCTION WITNESSED / NO OPEN GENESIS PRODUCT DEFECT`. Historical context remains in Product issue history and prior AuditRepo verification; no new Product lane is authorized by this retirement.

---

## IN FLIGHT — do not collide

Not extra work units; current Product owners or existing issue authorities that constrain implementation:

- Product `#1209` remains the owner for `SEARCH-P3-02`, actual head `2b90612c82cf9df356c11b62d8099521700fd758`, but after Product `#1217` merged it is now `behind=1` from current `main@670d82fa...` and currently mergeable=false. Do not merge from the older exact-head green set; refresh ancestry and rerun exact current head.
- `#1209` also touches `BaptistyRossiiSpravochnikPageHead.astro` only for deterministic command-palette cache revision. The file contains the remaining `BAPT-S12-01` metadata leak on current main. Do not open a competing PageHead edit while Search owns the file; sequence/coordinate the S12 metadata repair after release of that exact owner.
- Product `#1214` is **closed unmerged / SUPERSEDED_VERIFIED**. Its body/guard material moved to `#1218`; do not treat #1214 as an active owner.
- Product `#1218` is the current body/guard owner for `BAPT-S12-01`, refreshed head `a70b42d352eaa422092a3e5564a93ae929bfff35`, based on current `main@670d82fa...`, behind=0. It still changes exactly `scripts/sources-hygiene.js` and `BaptistyRossiiPodpolnayaPechatBody.astro`. Fresh current-head CI is queued/pending; one older moving-head Shared Files run is cancelled and a newer one is pending. It **does not** close the Spravochnik PageHead metadata residual or PageHead scan blind spot.
- `BAPT-CONTENT-TRUTH-01` has no active Product owner anymore: `#1217` merged as `670d82fa...`, exact-head CI 5/5 SUCCESS, review threads=0; the row is removed from MASTER in this wave.
- Product `#1216` is **closed unmerged / SUPERSEDED_VERIFIED**. Canonical catalog owner is now `#1221`, actual head `b603b0c9a51407d721db99d7ed1ae0364a6f7585`, based on current `main@670d82fa...`, behind=0. Current diff is the clean five-file catalog/data package; predecessor-only `.github/workflows/scripture-occurrence-index-contract.yml` writer mutation is not transferred. All returned exact-head workflows were queued/pending at recheck.
- Product `#1212` is audit-only current work to add an all-reading-route interaction census; it is not a Home repair owner. Head `3292f4c...` is now `behind=2` from current main. Treat its browser evidence as guard work, not current-main repair authorization, until it refreshes ancestry.
- Product `#1220` is the current first implementation owner for `SYS-CURRENT-GOLD-READINESS`, actual head `98b1e55c0fd5b3c7db1005552d9d128dab8e294c`, behind=0. It changes only Deploy Candidate workflow linkage + the new human-reachability audit. Fresh exact-head workflows were queued/pending. Before merge, repair the hidden-ancestor/CSS-hidden false-green in the witness model; no second MASTER row is needed for this in-flight harness defect.
- Fresh Home recheck found no new direct defect and no temporary writer/config residue on the Product tree. Product `#1217` changed only one Baptist QA-register file, so Home bytes remain unchanged. Directions/Ambient presentation-owner convergence remains optional in `WORK_QUEUE.md`; do not create a Product `SYS-HOME-*` lane unless its recorded promotion trigger is met.
- Old Home/writer refs still exist, but sampled refs are ancestry-diverged and retain unique branch commits. Do not delete them by name; first prove unique material is absorbed/useless per branch-forensic policy.
- Existing Product issue `#298` already owns the product-golden blind spot. `SYS-CURRENT-GOLD-READINESS` should consume/reference that evidence rather than opening a duplicate visual-baseline program.
- Existing Product issue `#54` is a historical Hermenevtika umbrella whose old checklist has been partially/sometimes systemically superseded by later merged work. Reverify current residuals before promoting any new Hermenevtika row.
- No separate Product repair lane is authorized merely because this audit decomposes future work; every Product mutation still requires fresh owner/open-PR/current-surface discovery.
- Do not combine Search continuation, runtime asset identity, JS escaper consolidation, catalog projection and Current-Gold tooling into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

- `#1217` — Baptist publication-truth reconciliation; merged Product `670d82fa...`; row retired;
- `#1216` — closed unmerged as `SUPERSEDED_VERIFIED`; clean catalog successor is `#1221`;
- `#1214` — closed unmerged as `SUPERSEDED_VERIFIED`; body/guard successor is `#1218`;
- `#1213` — Gill public series projection convergence; Product `a068dece...`;
- `#1205` — closed duplicate shared CSS owners; Product `21b437cb...`;
- `#1197` — series-level Nagornaya library theme ownership repair; Product `76ad2f3f...`;
- `#1195` — FAQ JSON-LD text-only security repair; Product `a2d0ce58...`;
- `#1183` — global Search shortcut/runtime ownership closure; Product `67c23492...`;
- `#1193` — Hermenevtika accepted-semantic anchor repair; Product `f3e291b7...`;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I; Product `c9055428...`;
- Genesis issue `#362` — completed and production witnessed; its former owner-gap row is retired here.

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
