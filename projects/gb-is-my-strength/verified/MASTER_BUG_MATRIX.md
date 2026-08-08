# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current discovery/S12/catalog/Search recheck: [`../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md).  
Current closure / previous main advance: [`../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md`](../verification/2026-08-08-bapt-content-truth-closure-main-advance/REPORT.md).  
Previous S12 / in-flight guard recheck: [`../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md`](../verification/2026-08-08-s12-metadata-and-inflight-guard-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Current Home / owner / CI recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).  
Previous Search/CSS handoff evidence: `../verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `6d671d0e30bff8da1f7354a00191ab990f17ed12` |
| Wave | S12 partial closure + discovery projection + catalog/Search moving-owner reverify, 2026-08-08 |
| Active work units | **12** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **4** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

Эта wave расширяет проверку от узкого technical defect census к **publication truth + discovery truth**: current Product может быть технически зелёным и одновременно иметь reader-facing drift в metadata/search/catalog projections. MASTER хранит только крупные текущие work roots; подробная декомпозиция живёт в verification reports.

`#1218` merged как Product `6d671d0e30bff8da1f7354a00191ab990f17ed12`. Его exact head `a70b42d352eaa422092a3e5564a93ae929bfff35` имеет fresh SUCCESS по Shared Files, Glossary, Scripture Occurrence Index, Deploy Candidate, Metadata, Editorial Dateline, Search Modal, Print Paper, Native Source и Visual Parity; старый cancelled Shared Files run superseded более новым successful run. Поэтому опубликованный backstage body leak «Подпольной печати» и узкий regex false-green закрыты на current main. `BAPT-S12-01` остаётся активным только из-за подтверждённых public metadata/discovery residuals ниже.

`BAPT-CONTENT-TRUTH-01` ранее удалён после Product `#1217` (`670d82fa...`), exact-head CI 5/5 SUCCESS и review threads=0. `GILL-PROJECTION-01` ранее удалён после Product `#1213` (`a068dece...`).

Product advance `670d82fa... → 6d671d0e...` меняет только `scripts/sources-hygiene.js` и `BaptistyRossiiPodpolnayaPechatBody.astro`; Home не меняется. Временный `astro.config.dev.mjs` не возвращён; Directions/Ambient presentation-owner convergence остаётся в `WORK_QUEUE.md` без свежего direct regression witness.

---

## CURRENT DEFECTS — 2

| ID | Current defect / required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Убрать оставшийся reader-facing backstage research scaffolding из Baptist public metadata/discovery projections и сделать S12 guard output-aware, а не только Body/MDX-aware. | Body/regex portion закрыт Product `#1218`. Current residual подтверждён в **двух независимых public projections** для `/baptisty-rossii/spravochnik/`: `BaptistyRossiiSpravochnikPageHead.astro` публикует `research-досье и очередь правок 3D-карты` в description/Twitter/OG/JSON-LD, а `data/search-manifest.json` содержит ту же description. Current `js/search.js` реально fetch'ит manifest; description становится видимым subtitle/preview excerpt и route участвует в scope `Статьи`, то есть это уже reader-facing Search leak на current main. `sources:hygiene` после #1218 всё ещё сканирует только MDX/`*Body.astro`; Search policy inventory проверяет membership/policy, но не description truth; normalizer не rehydrate'ит существующие manifest descriptions. Closure: converge proper metadata authority → PageHead + manifest/Search projection, добавить permanent metadata/discovery S12 fixture/guard, затем reverify final exact Product SHA. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
| `CATALOG-PROJECTION-01` | Сделать `/articles/` правдивой derived projection текущих публикаций/серий **без визуальной деградации каталога** и без размножения уже известного S12 metadata leak. | Root остаётся валиден: старый grid был ручным вторым owner и уже имел Gill/read-time drift. Canonical candidate `#1221` правильно derives membership/metadata из `search-manifest + page-ownership` и удаляет manual owner, но текущий `ArticlesLibrarySection.astro` вообще не проектирует `image`: нет `.h-article-thumb`, `<picture>`/`<img>`, тогда как retired owner имел cover imagery и visual series cards. Candidate Articles guard не проверяет media contract. `/articles/` имеет `native-contract`: legacy screenshot diff diagnostic-only, а named guards (Articles audit + data consistency + generic public-surface browser matrix) не требуют thumbnail coverage, поэтому text-only regression может false-green. Дополнительно #1221 рендерит `item.description`, а current manifest содержит Spravochnik backstage S12 text — merge as-is размножит leak на `/articles/`. Нужны owner-approved media disposition + permanent browser/source media guard + S12 discovery convergence; после #1218 candidate также снова `behind=1`. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `SEARCH-P3-02` | Give Search one truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrence paths: expose total vs shown state and deterministic continuation without reopening global shortcut ownership. | Product `#1209` remains owner. It self-cleaned the transient `.search-p3-merge-refresh-trigger` and refreshed to actual head `e06a1abec8a503177ff7bb6b16f94219b72dec27`; net compare against `670d82fa...` had `behind=0` and no temporary trigger. Current exact-head CI is mostly queued/pending/in-progress. Product `#1218` then moved main to `6d671d0e...`, so Search is again `behind=1`; refresh ancestry + terminal exact-head CI + clear Shared Files/reviews remain the live merge barrier. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
| `AR-IDX-05` | Replace the generic runtime `SITE_CONFIG.version` bridge with explicit per-asset revision authority for runtime-loaded CSS (or an equivalent injected asset map), then remove the misleading generic bridge when unused. | Canonical hashes already exist for `css/enhancements-runtime.css` and `css/highlights-runtime.css`, but `js/enhancements.js` and `js/highlights.js` version those files with generic `SITE_CONFIG.version`; `BaseLayout.astro` seeds that field from the unrelated `js/glossary.js` hash. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers, preserving loader availability and context/output equivalence rather than replacing helpers mechanically. | Fresh current-source re-read confirms five separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 4

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Детальная декомпозиция Current-Gold работ находится в linked REPORT и **не является второй active matrix**.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Build a **derived** current-publication readiness layer on top of existing Product authorities, not a new publication registry. It must distinguish source acceptance from live publication and make human discoverability, metadata approval, Research/content holds, visual evidence and production witness explicit. | Product `#1220` remains bounded first implementation owner. The prior regex/hidden-ancestor false-green is **fixed in candidate head `0f565aa5c5cdfe2653035035096f0e67d29b1b68`**: Chromium + JS-off, ancestor hidden/ARIA-hidden/inert/CSS state, geometry/off-canvas, nofollow/empty-anchor rejection and adversarial fixtures are present. Do not keep the obsolete blocker or invent a clipping/occlusion defect without a Product witness. After #1218 moved main, #1220 is `behind=1`; refresh ancestry + exact terminal CI before merge. Existing issue `#298` remains visual-golden authority. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
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

`GENESIS6-ACTIVATION-OWNER-GAP` remains retired as stale/fixed-current: Product issue `#362` is completed and production witnessed.

---

## IN FLIGHT — do not collide

Not extra work units; current Product owners or existing issue authorities that constrain implementation:

- Product `#1218` is **merged** as `6d671d0e...`; body/guard portion of `BAPT-S12-01` is closed. Do not leave #1218 as an active owner. Remaining S12 work is public metadata/discovery convergence only.
- Product `#1209` remains owner for `SEARCH-P3-02`. Current observed cleaned head `e06a1abec8a503177ff7bb6b16f94219b72dec27` no longer carries the transient `.search-p3-merge-refresh-trigger`; its PR body names the actual head. #1218 moved main afterward, so it is now `behind=1`; current-head CI is still non-terminal. It also touches `BaptistyRossiiSpravochnikPageHead.astro` only for command-palette cache revision, so coordinate the S12 PageHead repair rather than creating a competing edit.
- Product `#1221` remains canonical `CATALOG-PROJECTION-01` owner, observed head `b603b0c9a51407d721db99d7ed1ae0364a6f7585`. #1218 moved main afterward, so candidate is `behind=1`. Before merge, resolve the verified thumbnail/media regression false-green and do not publish current Spravochnik manifest backstage text through the new catalog.
- Product `#1220` remains first `SYS-CURRENT-GOLD-READINESS` implementation owner, observed head `0f565aa5c5cdfe2653035035096f0e67d29b1b68`. Hidden-ancestor witness false-green is repaired in candidate; after #1218 it is `behind=1` and needs refreshed exact CI.
- Product `#1212` remains audit-only all-reading-route control census, not a Home repair owner. Its old head is now **behind=3** from current Product main; treat it as guard evidence until ancestry refresh.
- `BAPT-CONTENT-TRUTH-01` has no active owner: `#1217` merged and row was retired.
- `#1216` is closed unmerged / `SUPERSEDED_VERIFIED`; canonical catalog owner is #1221. `#1214` is closed unmerged / `SUPERSEDED_VERIFIED`; its body/guard material is now merged through #1218.
- Fresh Home recheck still has no new direct defect and no temporary writer/config residue. #1218 touches no Home file. Directions/Ambient presentation-owner convergence stays in `WORK_QUEUE.md` until a promotion trigger is met.
- Old Home/writer refs still exist, but sampled refs are ancestry-diverged and retain unique branch commits. Do not delete them by name; first prove unique material is absorbed/useless per branch-forensic policy.
- Existing Product issue `#298` already owns the product-golden blind spot. `SYS-CURRENT-GOLD-READINESS` should consume/reference it rather than opening a duplicate visual-baseline program.
- Existing Product issue `#54` is a historical Hermenevtika umbrella whose old checklist has been partially/sometimes systemically superseded by later merged work. Reverify current residuals before promoting any new Hermenevtika row.
- No separate Product repair lane is authorized merely because this audit decomposes future work; every Product mutation still requires fresh owner/open-PR/current-surface discovery.
- Do not combine Search continuation, S12 discovery metadata, runtime asset identity, JS escaper consolidation, catalog projection and Current-Gold tooling into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

- `#1218` — Baptist S12 body/guard portion; merged Product `6d671d0e...`; root remains active only for metadata/discovery residual;
- `#1217` — Baptist publication-truth reconciliation; merged Product `670d82fa...`; row retired;
- `#1216` — closed unmerged as `SUPERSEDED_VERIFIED`; clean catalog successor is `#1221`;
- `#1214` — closed unmerged as `SUPERSEDED_VERIFIED`; its body/guard successor #1218 is now merged;
- `#1213` — Gill public series projection convergence; Product `a068dece...`;
- `#1205` — closed duplicate shared CSS owners; Product `21b437cb...`;
- `#1197` — Nagornaya library theme ownership repair; Product `76ad2f3f...`;
- `#1195` — FAQ JSON-LD text-only security repair; Product `a2d0ce58...`;
- `#1183` — global Search shortcut/runtime ownership closure; Product `67c23492...`;
- `#1193` — Hermenevtika accepted-semantic anchor repair; Product `f3e291b7...`;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I; Product `c9055428...`;
- Genesis issue `#362` — completed and production witnessed.

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
