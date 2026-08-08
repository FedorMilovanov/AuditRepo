# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Current S12 / in-flight guard recheck: [`../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md).  
Current Home / owner / CI recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).  
Previous Search/CSS handoff evidence: `../verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `a068decefff4ddd0055da952c84b7a3633d7b43b` |
| Wave | Current-Gold + publication truth + S12 metadata/in-flight guard reverify, 2026-08-08 |
| Active work units | **13** |
| Direct current defects | **3** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **4** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

Эта wave расширяет проверку от узкого технического defect census к **publication truth**: current Product может быть технически зелёным и одновременно иметь подтверждённый reader-facing content/projection/readiness debt. MASTER по-прежнему хранит только крупные текущие work roots; детальная декомпозиция и evidence находятся в Current-Gold REPORT.

`GILL-PROJECTION-01` удалён из active MASTER после Product `#1213`, squash-merged как `a068decefff4ddd0055da952c84b7a3633d7b43b`: canonical Gill sequence восстановлен в обеих `/biografii/` projections, stale «Трилогия» снята, graph ordinal drift устранён, а существующий Gill consistency guard расширен на этот класс расхождения. Exact PR head `a748cb57fe276693019bbdd4ec9db790050a43e9` прошёл все 11 triggered workflow groups; review threads = 0.

Fresh Home/control-plane recheck на том же Product anchor не добавил нового Home defect: переход `21b437cb... → a068dece...` не меняет Home files; временные `astro.config.dev.mjs` / arena one-shot workflow отсутствуют на current `main`; текущий Directions/Ambient presentation-owner split оставлен в `WORK_QUEUE.md`, пока нет свежего user-visible regression/false-green/owner-collision witness.

---

## CURRENT DEFECTS — 3

| ID | Current defect / required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Убрать reader-facing backstage research scaffolding из Baptist publication surfaces и закрыть S12 false-green как для body, так и для публичной metadata projection. | Product `#1218` — clean current-main successor для «Подпольной печати»: body rewrite + `сохранены/сохранён локально` `е/ё` guard + workspace-note fixtures. Но current `BaptistyRossiiSpravochnikPageHead.astro` всё ещё публикует `research-досье и очередь правок 3D-карты` в description/Twitter/OG/JSON-LD. `sources:hygiene` false-green объяснён точно: walker включает только `*Body.astro`/MDX и категорически не сканирует `*PageHead.astro`, поэтому уже запрещённый `research-досье` может пройти в public metadata. Среди проверенных Baptist PageHeads остаток сужен до Spravochnik. Exact файл сейчас занят Search `#1209` cache-revision projection, поэтому не открывать конкурирующий edit; closure требует #1218 result + metadata repair + guard scope/fixture на metadata class. [`REPORT`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md) |
| `BAPT-CONTENT-TRUTH-01` | Свести опубликованные Baptist factual claims с current discrepancy authority: спорные цифры/даты не должны быть сильнее источника; разрешить источник либо квалифицировать public prose и синхронизировать reference/map consumers. | Два current witnesses: `goneniya-i-sovest` публикует **11** арестованных делегатов, пока QA register держит `11 vs 21` открытым; `dva-sezda-1884` публикует exact `1–6 апреля 1884`, пока register требует отдельного подтверждения точной даты. Это один content-truth reconciliation package, не разрешение массово переписывать серию. Product `#1217` — clean current-main owner. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `CATALOG-PROJECTION-01` | Сделать `/articles/` правдивой derived projection текущих публикаций/серий вместо ручной копии метаданных; исключить orphan-by-catalog и ручной drift title/time/count. | Hero обещает «Все статьи», а publication grid hand-authored. Current drift уже наблюдаем: Gill представлен неполно как publication set, а ручное время чтения `Римлянам 7` расходится с canonical Heart data (`12` vs `45` минут). Fix должен читать существующие route/series/metadata authorities, а не создавать новый publication SSOT. Product `#1216` остаётся current owner, но его ancestry/CI/diff boundary ещё не merge-authorizing. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `SEARCH-P3-02` | Give Search one truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrence paths: expose total vs shown state and deterministic continuation without reopening global shortcut ownership. | Product `#1209` is the current owner at this snapshot. Its bounded implementation removes pre-hydration truncation, keeps full deduped sets behind a visible window and extends the existing Chromium/WebKit Search contract. Merge authorization must use the **actual exact PR head**, not prose/history. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AR-IDX-05` | Replace the generic runtime `SITE_CONFIG.version` bridge with explicit per-asset revision authority for runtime-loaded CSS (or an equivalent injected asset map), then remove the misleading generic bridge when unused. | Canonical hashes already exist for `css/enhancements-runtime.css` and `css/highlights-runtime.css`, but `js/enhancements.js` and `js/highlights.js` version those files with generic `SITE_CONFIG.version`; `BaseLayout.astro` seeds that field from the unrelated `js/glossary.js` hash. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers, preserving loader availability and context/output equivalence rather than replacing helpers mechanically. | Fresh current-source re-read confirms five separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 4

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Детальная декомпозиция Current-Gold работ находится в linked REPORT и **не является второй active matrix**.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Build a **derived** current-publication readiness layer on top of existing Product authorities, not a new publication registry. It must distinguish source acceptance from live publication and make human discoverability, metadata approval, Research/content holds, visual evidence and production witness explicit. | Product `#1220` is now the bounded first implementation owner on current `main`, reusing Deploy Candidate and `public-surface-registry`. Before merge, its “human-facing inbound link” witness must be made false-green resistant: current regex extractor excludes hidden state only on the `<a>` itself and can count links under hidden/`aria-hidden` ancestors or CSS-hidden/non-rendered geometry as `GOLD`. Add ancestor-aware DOM/browser-equivalent proof + adversarial hidden-parent fixtures; do not weaken the invariant. Existing Product issue `#298` remains visual-golden authority. [`REPORT`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md) |
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

- Product `#1209` is the current owner for `SEARCH-P3-02`. Fresh current-head witness is `2b90612c82cf9df356c11b62d8099521700fd758`; it is based on current `main@a068dece...` (`behind=0`). Deploy Candidate, Scripture Occurrence Index, Shared Files and NoteRegistry were green while multiple other exact-head groups remained queued/in-progress. The PR body names an older candidate SHA, so use actual head/CI, not prose history, for merge authorization.
- `#1209` also currently touches `BaptistyRossiiSpravochnikPageHead.astro` only for deterministic command-palette cache revision. The file contains the remaining `BAPT-S12-01` metadata leak on current main. Do not open a competing PageHead edit while Search owns the file; sequence/coordinate the S12 metadata repair after release of that exact owner.
- Product `#1214` is **closed unmerged / SUPERSEDED_VERIFIED**. Its body/guard material moved to clean current-main successor `#1218`; do not treat #1214 as an active owner.
- Product `#1218` is the current body/guard owner for `BAPT-S12-01`, head `d401b51810a04fb36ea87a0b8ab906f21105b20e`, based on current `main@a068dece...`. It changes exactly `scripts/sources-hygiene.js` and `BaptistyRossiiPodpolnayaPechatBody.astro`. Its exact-head workflows were still queued/in-progress at recheck. It **does not** close the Spravochnik PageHead metadata residual or the PageHead scan blind spot.
- Product `#1217` is the clean current-main successor for `BAPT-CONTENT-TRUTH-01`. Head `e1bbc474...` is based on `a068dece...`; Shared Files, Metadata, Editorial Dateline and Glossary were green while Visual Parity remained in flight. Keep the row until terminal exact-head evidence + merge/result verification.
- Product `#1216` is the current owner for `CATALOG-PROJECTION-01`. Head `a76f9872...` remains `behind=1`; GitHub currently reports the PR mergeable, but returned exact-head workflow conclusions remain `action_required`, so this is **not green CI**. Its actual changed-file list includes `.github/workflows/scripture-occurrence-index-contract.yml` and `data/scripture-search-index.json`, broader than the PR prose claim that no workflow changes. Reconcile ancestry, authorization and stated-vs-actual diff boundary before merge.
- Product `#1212` is audit-only current work to add an all-reading-route interaction census; it is not a Home repair owner. Head `3292f4c...` remains `behind=1`; Shared Files, Metadata and Node Toolchain were green while Runtime Interactive remained in progress. Treat its browser evidence as guard work, not current-main repair authorization.
- Product `#1220` is the current first implementation owner for `SYS-CURRENT-GOLD-READINESS`, head `9cdc79825f508a92b9e5ad10ed3c760991ef2a9e`, based directly on `a068dece...`. It changes only Deploy Candidate workflow linkage + the new human-reachability audit. All returned exact-head workflows were still queued at recheck. Before merge, repair the hidden-ancestor/CSS-hidden false-green in the witness model; no second MASTER row is needed for this in-flight harness defect.
- Fresh Home recheck found no new direct defect and no temporary writer/config residue on current `main`. Directions/Ambient presentation-owner convergence remains optional in `WORK_QUEUE.md`; do not create a Product `SYS-HOME-*` lane unless its recorded promotion trigger is met.
- Old Home/writer refs still exist, but sampled refs are ancestry-diverged and retain unique branch commits. Do not delete them by name; first prove unique material is absorbed/useless per branch-forensic policy.
- Do not overlap `#1209` in Search/shared search assets or its deterministic projection consumers.
- Existing Product issue `#298` already owns the product-golden blind spot. `SYS-CURRENT-GOLD-READINESS` should consume/reference that evidence rather than opening a duplicate visual-baseline program.
- Existing Product issue `#54` is a historical Hermenevtika umbrella whose old checklist has been partially/sometimes systemically superseded by later merged work. Reverify current residuals before promoting any new Hermenevtika row.
- No separate Product repair lane is authorized merely because this audit decomposes future work; every Product mutation still requires fresh owner/open-PR/current-surface discovery.
- Do not combine Search continuation, runtime asset identity, JS escaper consolidation, catalog projection and Current-Gold tooling into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

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
