# Archived NEXT_AGENT_PROMPT before production current-truth sync

> Archived 2026-07-23 after exact `83f04647` readiness → Pages → live verification.
> This is historical operational context, not current authority.

# NEXT AGENT PROMPT — gb-is-my-strength

> **SSOT по текущему состоянию source-проекта.** Карта документов и правило
> Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-22. Source `main`: `6c4106aecd35a3c95b09b041332d653f581ceb92`.**
> PR #151 (`0a449118`) отдельно зафиксировал native visual ownership `/hard-texts/` без изменения UI;
> PR #149 (`6c4106ae`) закрыл source-role registry и argument-layer architecture Нагорной.
> **Production подтверждена для exact SHA `6c4106ae…`:** readiness `29950459817` → Pages `29951046722`;
> exact main checks Shared Files `29950458595`, Visual Parity `29950458386`, Native Source `29950458319` — success.
> Pre-merge exact head `e9d23d04…`: Route Registry/browser `29949641685`, **3428/3428 PASS**;
> `/nagornaya/istochniki/` — 33/33 browser contracts и 0.000% desktop/mobile pixel diff.
> Live/registry witness: AuditRepo run `29950695954`, artifact `8542524012` — registry 3 sources/6 claims, live 8/8 required and 2/2 stale markers absent.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_6c4106ae_source-registry-production.md`.
> Новый verified intake: `incoming/gpt-5-6-nagornaya-deep-audit/2026-07-22/REPORT.md`.

## Перед началом

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
# expect 6c4106ae… or newer
```

Если HEAD новее — сначала записать reverify delta. Затем прочитать `AGENTS.md`,
`docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`, документы Reader Platform и этот SSOT.

## Что уже landed — не переделывать заново

### Единая типология контента

- `series` — обычная серия и книга;
- книга — **`surface=series` + `seriesShape=book`**, а не отдельный движок;
- `article` — самостоятельная большая статья;
- `page` — каталог, справочная и другая нестатейная страница;
- `special` — карты, 3D, графы и иные приложения.

Трёхуровневая книга уже есть: главы `tier:'chapter'`, статьи глав, chapter/article rail
и трёхуровневое TOC. Старые book-прототипы AuditRepo — evidence, не код для полного merge.

### Reader R1 — PR #101 (`ffdba149`)

- единое `gb:reader-preferences:v1` и `window.GBReaderPreferences`;
- День / Ночь / Сепия, размер, line-height, measure, text mode, reduced motion;
- миграция legacy keys и cross-tab sync;
- единый first-paint `ReaderPreferencesHead`;
- semantic Sepia без blanket filters для изображений, видео, карт и 3D;
- idempotent shared scroll-lock без MutationObserver feedback loop;
- cross-engine matrix и functional `engine:sweep` 98/98.

### Reader R3 — PR #102 (`75b236ac`)

- нейтральный public façade `SeriesReaderChrome`;
- historical `GillSeriesChrome` остаётся одной внутренней реализацией;
- все 41 production series/book consumer переведены на façade;
- постоянный `series:facade:guard` запрещает direct implementation imports;
- DOM/CSS/runtime implementation не переписывались.

### Reader R4 — PR #103 (`3a715551`)

- все 76 ownership routes классифицированы в существующих `data/route-profiles`;
- `surfaceContractVersion: 1`, `surface: series|article|page|special`;
- `seriesShape: flat|book` только для series;
- baseline: 51 series (27 flat + 24 book), 2 article, 9 page, 14 special;
- derived registry и adversarial mutation tests встроены в постоянный CI;
- 41 exact `SeriesReaderChrome` consumer, 0 direct `GillSeriesChrome` leaks.

### Reader R5 + special overlays — PR #104 (`43d8672f`), PR #106 (`39f6c3ac`)

- один canonical `OverlayRuntime`;
- named/reference-counted owners, top-layer Escape, focus trap/return, exact style/scroll restore;
- reader, Gill/series, Hermenevtika, MapEngine, MindMap3D/built launcher, global image viewer и mobile fallbacks мигрированы;
- direct production lock writers запрещены;
- Chromium/Firefox/WebKit matrix зелёная.

### All-route browser closure — PR #145 (`f9439ef3`)

- 75 public `production-dist` routes проверяются в Chromium на 320×760, 390×844 и 1440×900;
- **3428/3428 contracts PASS** на final PR-head `ebc298b3…`;
- проверяются status/title/canonical/H1, same-origin assets, page errors, scroll-root overflow, interactive IDs, `aria-controls`, surface isolation, series settings/Sepia/Escape, mobile TOC и book-vs-flat tiers;
- найден и исправлен реальный 320px cluster `/nagornaya/chast-5/`: bottom bar, speed sheet transform, длинные flex-заголовки и закрытые glossary cards;
- пять native chapter footers используют один shared compact contract;
- `engine-sweep` остаётся глубоким representative PLAY/MediaSession тестом, browser matrix — breadth witness всех маршрутов.

### Visual parity route ownership — PR #148 (`aeae401d`)

- heavy pixel workflow теперь выполняется и на релевантных PR до merge;
- screenshot capture диагностический (`--warn-only`), sole verdict принадлежит policy validator;
- default `legacy-diff` остаётся блокирующим на baseline + 0.5%; общий tolerance не повышен;
- `native-contract` разрешён только явно, с причиной, минимум двумя уникальными реально существующими guard-файлами и agreement route-profile ↔ central policy;
- `/articles/`, `/baptisty-rossii/` и `/hard-texts/` имеют explicit native ownership; retired legacy HTML не является их render owner;
- Hard Texts ownership исправлен отдельно PR #151 после fresh 2.496% screenshot witness; причина и реальные guards синхронизированы в profile/policy;
- `/karty/` остаётся `legacy-diff` с owner-reviewed 2.0506% mobile glyph-raster baseline;
- fake guard, legacy regression, unknown mode, missing strict-new baseline и update без `OWNER_APPROVED=true` падают adversarial tests.

### Production release closure

- PR #125 (`e4cf04ab`) установил одного automatic owner: `main` push → readiness → Pages;
- automatic deploy checkout использует exact `workflow_run.head_sha`, не moving `main`;
- исторический production witness `a0c9c025` / Pages `29910271842` остаётся архивной границей;
- текущая граница — exact `6c4106ae…`: readiness `29950459817`, Pages `29951046722`, все deploy/Pages/IndexNow stages green;
- exact registry blob содержит 3 verified TMSJ sources, 6 claims, author/institution boundaries и neutral Green alternative; SHA-256 `d105f6a309de866550118a4fa7dcd8c8ec9cb8c3f0f68d23dd0c944a8845b4c2`;
- live origin после cache-buster содержит все три exact PDF/page rows и bounded attribution; 8/8 required, 2/2 stale absent;
- immutable witness — AuditRepo run `29950695954`, artifact `8542524012`, live SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`.

## Current mandatory boundary

1. Issue #153: build the neutral comparison UI from the landed claim registry; preserve the exact 0.000% sources-page baseline and confessional series position.
2. Issue #146: replace remaining `routeType=unknown` / misnamed series-hub semantics explicitly, without creating another engine.
3. Reader R6 / issue #59 remains an independent state-platform lane.
4. Do not combine epistemic UI, route semantics and ReaderState in one PR.

## Highlights hardening — LANDED PR #120 (`26efb711`)

- legacy same-page/same-text duplicates compact on read with newest stable ordering;
- new same-page duplicates are blocked while identical text on another route remains valid;
- 200-item cap and `gb-highlights-v1` compatibility are preserved;
- dialog `aria-hidden=true → false → true` is synchronized across initial/open/close state;
- dependency-free regression is permanent in Shared Files Guard; issue #112 closed.

## Verified Nagornaya lanes

### P0 — `NG-RUNTIME-BAR-ASSET-01` — LANDED PR #126 (`9c3dec16`)

- five native Part I–V footers and five committed shadow pages load canonical `nagornaya-bar-extras.js?v=3c7e0bdd`;
- Astro cache-bust matching rejects arbitrary stale `?v=` values, включая `v=1`;
- permanent source/adversarial and browser contracts are wired into CI;
- 11 newly exposed Baptist PageHead revision mismatches were regenerated mechanically; content/UI unchanged.

### P0 pastoral safety — `NG-PASTORAL-SAFETY-01` — LANDED PR #138 (`5650c96`)

- Christ's warning against self-deception and the necessity of fruit remain explicit;
- final-verdict wording and direct assignment of Matt 7:21 to a reader were removed;
- persistent fruitlessness now triggers serious self-examination, repentance and pastoral support;
- final judgment of the heart is explicitly reserved to Christ;
- mechanical application to a contrite believer fighting sin is forbidden;
- two Astro layers, committed shadow and permanent regression are synchronized.

### P1 source integrity — `NG-SOURCE-INTEGRITY-01` — LANDED PR #141 (`2599844b`)

- Green / `tmsj12d.pdf`: TMSJ 12/1, pp. 49–68;
- Thomas Jesus Seminar: exact `tmsj7d.pdf`, TMSJ 7/1, pp. 75–105;
- Nichols Davidic Kingdom: exact `tmsj7h.pdf`, TMSJ 7/2, pp. 213–239;
- negative contract forbids Jesus Seminar metadata resolving to `tmsj7h.pdf`;
- universal verification wording is bounded by available objects/last-checked state;
- Part IV distinguishes Green's article, TMSJ venue and the series' confessional synthesis;
- issue #140 closed after full publication and Native Source contracts passed.

### P1 source-role and argument-layer architecture — LANDED PR #149 (`6c4106ae`)

- canonical `data/nagornaya/source-registry.json` + JSON Schema own the Green/Thomas/Nichols pilot metadata;
- verified PDF records require requested/resolved URL, exact object, pages, extraction method and last-checked date;
- claim records label historical reconstruction, literary model and doctrinal synthesis, plus alternative, series position, confidence and change condition;
- author-level articles cannot be promoted to institutional doctrine; `doesNotSupport` conflicts fail adversarial tests;
- native sources page derives pilot rows from registry IDs without duplicating URLs/titles or changing visible output;
- final PR head `e9d23d04` passed 3428/3428 browser contracts; sources route 33/33 and 0.000% desktop/mobile.

### P1 neutral comparison UI — ACTIVE ISSUE #153

- consume registry/claim data or a typed projection; no second claim SSOT;
- distinguish observation → reconstruction → model → doctrine → application visibly;
- preserve a clear confessional series position while representing alternatives before the conclusion;
- keep Reader R6 and route semantics out of this UI PR.

Reusable contract:

```text
claim | layer | primary evidence | alternative | series position | confidence | limits | change condition
```

The detailed C43–C94 checklist remains evidence intake; do not inflate the canonical matrix with every sentence-level action.

## Reader R6 after current boundaries

Issue #59 remains the next reader-platform wave:

- one progress/resume/bookmark/note state service;
- migrate existing keys without losing user data;
- article-boundary progress rather than whole-document/footer progress;
- eliminate duplicate scroll/resize owners;
- no new content engine.

R6 must remain separate from Nagornaya prose/source/UI work and route-type cleanup.

## Other open P0/P1

- maps: `MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`;
- Nagornaya dark-theme architecture: `NG-CSS-01`, `NG-BODY-01`, `NG-DARK-01` cluster;
- generated asset manifest / workflow policy v2: issues #56/#64, not part of the current one-off fixes;
- PremiumControls/Floating Cluster/Gill visual contract and other owner/freeze zones: follow `AGENTS.md`.

## Жёсткие правила

1. Один subsystem на PR; source registry, UI comparison, route semantics and R6 are separate lanes.
2. SHA-first: любой статус — immutable SHA + command/witness + result.
3. Не ослаблять gates ради зелёного CI.
4. Astro↔legacy parity не доказывает ни Native ownership, ни истинность контента.
5. `native-contract` требует explicit reason + real named guards; не использовать как escape hatch.
6. Не переоткрывать закрытое без fresh negative witness.
7. Positive claim = invariant + environment + negative test.
8. AuditRepo matrix + этот prompt обновлять атомарно after merge/status change.
9. Не утверждать deploy без exact deployed SHA и live-origin witness.
10. User-supplied AI reports are evidence intake, not canonical truth until current-head/source/PDF/browser verification.
