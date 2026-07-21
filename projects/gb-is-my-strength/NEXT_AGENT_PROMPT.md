# NEXT AGENT PROMPT — gb-is-my-strength

> **SSOT по текущему состоянию source-проекта.** Карта документов и правило
> Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-21. Source `main`: `1bbebc2d9fcfe8a0af7c32e3a6796379927d48b8`.**
> PR #98, #101–#104, #106 (special overlay adapters), #108 (asset revision reconciliation)
> и #109 (pre-merge revision/workflow guard) влиты.
> Source/release gates зелёные; **exact deployed SHA proof всё ещё pending**.
> Не объявлять production-deploy подтверждённым без отдельного witness.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1bbebc2d.md`.

## Перед началом

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
# expect 1bbebc2d… or newer
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

- все 76 public routes классифицированы в существующих `data/route-profiles`;
- `surfaceContractVersion: 1`, `surface: series|article|page|special`;
- `seriesShape: flat|book` только для series;
- фактический baseline: 51 series (27 flat + 24 book), 2 article, 9 page, 14 special;
- chrome owner, config sources и settings capability выводятся из resolved import graph
  и `mobileChromeRegistry.ts`, а не из второго route-list;
- 41 exact `SeriesReaderChrome` consumer, 0 direct `GillSeriesChrome` leaks;
- read-only `surface:registry:check` и adversarial `surface:registry:test` встроены
  в strict migration metadata и Route Registry Validators;
- финальные Shared Files Guard, Route Registry Validators, Native Source Contract,
  Astro, production-like dist, native output, workflow policy и clean-tree зелёные;
- временные runners/scripts/triggers удалены до merge.

### Reader R5 — PR #104 (`43d8672f`)

- один защищённый `window.OverlayRuntime` / `SiteUtils.OverlayRuntime` store;
- named/reference-counted scroll owners и ordered top-layer stack;
- exact restoration исходных body/html styles, classes, attributes и `scrollY`;
- exact opener focus return, общий focus trap и Escape только для top layer;
- nested `inert` / `aria-hidden` claims, idempotent reopen и pagehide/beforeunload recovery;
- `site.js` больше не содержит вторую private scroll-lock implementation;
- ReaderSettings, Hermenevtika mobile TOC и Gill/series TOC, learning, settings, GBS2 sheets мигрированы;
- постоянные VM/static contracts и browser matrix Chromium/Firefox/WebKit зелёные;
- временные runners, patchers и raw inventory удалены до merge.

### Special Overlay Adapters — PR #106 (`39f6c3ac`)

- MapEngine place panel и nested photo viewer используют отдельные canonical owner IDs;
- MindMap3D fullscreen, committed built launcher, global image viewer и mobile-menu fallbacks мигрированы;
- direct production body/html lock writers запрещены постоянным source guard;
- foreign-owner isolation, double destroy, fallback adapter и built-output witnesses добавлены;
- Chromium, Firefox и WebKit matrix зелёная; временные diagnostics удалены до merge.

### Deploy revision repair — PR #108 (`869558cd`) и PR #109 (`1bbebc2d`)

- 62 stale source-файла / 113 cache-bust mismatches синхронизированы explicit `--write` транзакцией;
- runtime blobs PR #106 остались byte-identical, generated diff ограничен HTML/Astro/asset-version;
- temporary reconciliation workflow удалён до merge;
- read-only asset revision check и workflow policy теперь блокируют каждый PR;
- direct/manual deploy больше не проглатывает cache-bust failure через `|| echo`;
- exact production Pages SHA всё ещё требует отдельного witness.

## Следующая обязательная транзакция — exact production witness

Source implementation issue #58 завершена, но production claim требует отдельного доказательства.

1. Получить immutable GitHub Pages deployment/run witness для current `main` или более нового SHA.
2. Проверить, что production HTML ссылается на актуальные revision hashes, а опубликованные
   `site-utils.js`, `site.js`, floating cluster, MapEngine и MindMap blobs соответствуют source.
3. Только после этого закрыть `PROD-STALE-DEPLOY-RED` и issue #58 с run/deployment evidence.
4. Затем перейти к R6 / issue #59: единое progress/bookmarks/notes state без нового движка.

Не смешивать witness-транзакцию с map rendering/data P0/P1, визуальным redesign или content edits.

## После production witness

- R6: единое reader progress/bookmarks/notes state (issue #59) без дублирования storage;
- mobile quality/performance sweep 320–430 px: safe areas, 44px targets, overflow,
  listeners, focus, overlays, desktop parity;
- compatibility keys удалять только после миграционного browser witness.

## Открытый P0 карт после PR #98

`MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`. Layer/theme defects закрыты.
Special overlay runtime source-complete; production witness не должен исправлять map rendering/data defects.

## Другие крупные остатки

- Нагорная проповедь: dark-theme architecture (`NG-CSS-01`, `NG-BODY-01`,
  `NG-DARK-01` и связанные), inline/library cleanup, SEO/TOC;
- exact deployed SHA proof (`PROD-STALE-DEPLOY-RED`) — отдельная witness-задача;
- PremiumControls/Floating Cluster/Gill visual contract, glossary data и genealogy
  visual language — owner/freeze zones по `AGENTS.md`;
- generated asset manifest и read-only workflow policy v2 — issues #56/#64,
  не смешивать с one-time deploy witness или R6.

## Жёсткие правила

1. Один subsystem на PR; не смешивать waves.
2. SHA-first: любой статус — immutable SHA + команда/witness + результат.
3. Не ослаблять gates ради зелёного CI.
4. Astro↔legacy parity не доказывает истинность контента.
5. Не переоткрывать закрытое без fresh negative witness.
6. Positive claim = invariant + environment + negative test.
7. AuditRepo matrix + этот prompt обновлять атомарно после merge.
8. Не утверждать deploy без exact deployed SHA witness.
