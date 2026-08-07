# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Это не только баги: здесь также живут доказанно нужные внедрения/улучшения, системные изменения, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `87d1a3c26c61e474603b1c68b551fde9163f744a` |
| Wave | full-matrix consolidation, 2026-08-07 |
| Active work units | **23** |
| Direct current defects | **9** |
| Narrowed residuals | **3** |
| System verification lanes | **7** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 9

| ID | Current problem | Boundary |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. |
| `MAP-P1-11` | Scale bar всё ещё выводит pixel scale из `cfg.W0 / view.w`, а не из реальной rendered canvas width. | `karty/_engine/**` SYSTEM owner. |
| `MINI-P1-01` | Minimap остаётся blank rectangle + dots + viewport и всё ещё wraps/reassigns `flyTo`. | `karty/_engine/**` SYSTEM owner. |
| `SIG-P1-01` | Signature overlays всё ещё используют fixed map-unit offsets (`origin.x - 74` и подобные). | Karty geometry SYSTEM owner. |
| `ENGINE-P2-04` | Story/toast notifications не имеют доказанного canonical live-region/status owner. | Karty a11y SYSTEM owner. |
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`, не исключая `Alt`/`Shift`. | Existing Search owner only. |
| `SEARCH-P3-02` | Search ограничивает Pagefind 10 результатами / fallback 12 без total/show-more contract. | Existing Search owner only. |
| `SEARCH-P3-03` | Search copy-preview строит canonical `https://gospod-bog.ru` URL при generic copy-link label. | Search owner: current-origin vs explicitly canonical behavior. |
| `AR-IDX-05` | Home содержит hard-coded `SITE_CONFIG.version` плюс explicit asset `?v=` revisions. | Cache/version ownership; check active legacy/reference lane first. |

---

## NARROWED RESIDUALS — 3

| ID | Current residual |
|---|---|
| `MAP-P1-13` | Marker keyboard semantics уже существенно исправлены; current-check нужен только для reduced-motion / remaining interaction semantics. |
| `MAP-P1-20` | `route.json` SW-cache half старого claim stale; residual — unversioned shared `map-engine.js` cache-bust ownership. |
| `QUAL-P1-09` | Residual — holding/noindex route-profile publication-status semantics; проверять profiles + validators одной transaction. |

---

## SYSTEM VERIFICATION LANES — 7

Одна строка = один текущий пакет/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary |
|---|---|---|
| `SYS-KARTY-RUNTIME-GEOMETRY` | Current-check interaction/viewport/tour/panel/marker/LOD behavior после многочисленных изменений MapEngine. | Representative source + browser wave; split only independent current roots. |
| `SYS-KARTY-DATA-PROJECTION` | Route/schema/base-geo/generated-artifact ownership. | Verify current data/schema/base owners together before Product mutation. |
| `SYS-KARTY-VISUAL-LANGUAGE` | Visual/data-quality package where old P1 wording mixes correctness and quality targets. | Current screenshots + owner/value review; retain only genuinely necessary improvements. |
| `SYS-AUDIT-CONTROL-PLANE` | Audit/workflow false-green/false-red, duplicated/incorrect proof boundaries; also owns any remaining noindex/canonical harness gap after the `/izbrannoe/` source fix. | Wait for/coordinate with active Product release/reader workflow owners. |
| `SYS-NAGORNAYA-MIGRATION` | Current residual is narrower than the July package: the five Part I–V routes use `MainShell` again while the extracted `HeaderHero`/`ArticleBody`/`PostContent` component family still exists; Part I also still carries the repeated inline `Из библиотеки` palette/structure. Old scripture/footer SEO symptoms are already fixed. | Exact import inventory for all 15 extracted files; then one bounded delete-or-restore-componentization decision plus shared library-block ownership. |
| `SYS-SHARED-CSS-RUNTIME-HYGIENE` | Shared CSS/runtime dead/duplicate owner cleanup and a11y hygiene. | Reverify after active reader tooltip/layout owners settle. |
| `SYS-STRANGLER-RETIREMENT` | Legacy/reference parity-authority migration and eventual bounded retirement. | Follow Product PR #1090 owner; no parallel retirement lane. |

---

## OWNER DECISIONS — 4

| ID | Missing decision |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary; CrossWire `RusSynodal` 1.9.1 remains candidate-only pending exact archive/hash/mapping/import proof. |
| `GENESIS6-ACTIVATION-OWNER-GAP` | Whether/when to publish canonical Genesis 6 routes and who owns the final Product publication transaction. |
| `REG-001` | Hosting/proxy decision for response-level CSP/X-Frame/Referrer/Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — do not collide

Not extra work units; current Product owners that constrain the matrix:

- #1093 — shared article tooltip runtime / Hermenevtika popup repair.
- #1095 — ReaderRail/ReaderSettings desktop layout geometry.
- #1096 — Reader Projection workflow linkage.
- #1097 — dependent tooltip/layout regression guards.
- #1092 — release/live-evidence control plane.
- #1090 — legacy-reference identity/inventory/ledger.

Merged #1104 already corrected the interactive-tooltip audit harness and is part of the current Product anchor.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
3. Solve → verify result → remove from MASTER immediately.
4. Many symptoms with one root → one `SYS-*` row.
5. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
6. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.