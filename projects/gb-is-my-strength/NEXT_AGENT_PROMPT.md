# NEXT AGENT PROMPT — gb-is-my-strength

> **SSOT по текущему состоянию source-проекта.** Карта документов и правило
> Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-21. Source `main`: `75b236acd31a779b431406710309f6a086b7f845`.**
> PR #98 (карты), #101 (Reader R1) и #102 (Reader R3 façade) влиты.
> Source/release gates зелёные на точных PR-head; **exact deployed SHA proof всё ещё pending**.
> Не объявлять production-deploy подтверждённым без отдельного witness.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_75b236ac.md`.

## Перед началом

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
# expect 75b236ac… or newer
```

Если HEAD новее — сначала записать reverify delta. Затем прочитать `AGENTS.md`,
`docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`, документы Reader Platform и этот SSOT.

## Что уже landed — не переделывать заново

### Единая типология контента

- `series` — обычная серия и книга;
- книга — **`series.shape = 'book'`**, а не отдельный движок;
- `article` — самостоятельная большая статья;
- `page` — каталог, справочная и другая нестатейная страница;
- `special` — карты, 3D, графы и иные приложения, использующие общую инфраструктуру только там, где это уместно.

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
- historical `GillSeriesChrome` остаётся одной внутренней проверенной реализацией;
- все **41** production consumer (Gill, книга «Сердце», Баптисты и другие серии)
  механически переведены на façade;
- DOM/CSS/runtime implementation не переписывались;
- `series:facade:guard` запрещает новые прямые импорты `GillSeriesChrome` вне façade;
- guard подключён к `engine:contracts` и Shared Files Guard;
- финальные Shared Files Guard, Route Registry Validators, Native Source Contract,
  Astro, production-like build и functional `engine:sweep` зелёные;
- временные proof/recovery workflows удалены до merge;
- runtime CSS восстановлен byte-for-byte, лишнего cache-bust churn нет.

## Следующий обязательный SYSTEM lane — Reader R4

Создать **полный декларативный registry всех публичных поверхностей** и связать его с
существующими ownership/profile contracts без нового мегадвижка.

Цель registry:

1. Для каждого публичного route явно указать `surface`: `series | article | page | special`.
2. Для `series` отдельно декларативно указать `shape: flat | book`; книга не становится новым engine.
3. Указать adapter/chrome owner, config source, settings capability и сознательные исключения.
4. Registry должен выводиться из одного канона или строго cross-validate существующие
   `page-ownership`, route profiles, mobile registry и migration matrix — без второго SSOT.
5. Все production Astro routes должны быть покрыты; legacy/built-app routes получают явный статус.
6. Добавить read-only validator и negative mutation tests: неизвестный route, неверный surface,
   book без series, special с насильно подключённым reader chrome, drift source/profile.
7. Сначала inventory/report, затем отдельный implementation commit, затем full gates.

**Не смешивать R4** с overlay lifecycle, визуальным redesign, контентом, картографией,
переименованием Gill DOM/CSS или удалением compatibility storage keys.

## После R4

- R5: единый overlay lifecycle/focus/scroll-lock API (issue #58), убрать прямые
  `body.style.overflow` у standalone settings после browser parity;
- единое reader progress/bookmarks/notes state (issue #59) без дублирования storage;
- mobile quality/performance sweep 320–430 px: safe areas, 44px targets, overflow,
  listeners, focus, overlays, desktop parity;
- compatibility keys удалять только после миграционного browser witness.

## Открытый P0 карт после PR #98

`MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`. Layer/theme defects закрыты.
Reader R4 с картографическими runtime-fix не смешивать.

## Другие крупные остатки

- Нагорная проповедь: dark-theme architecture (`NG-CSS-01`, `NG-BODY-01`,
  `NG-DARK-01` и связанные), inline/library cleanup, SEO/TOC;
- exact deployed SHA proof (`PROD-STALE-DEPLOY-RED`) — отдельная witness-задача;
- PremiumControls/Floating Cluster/Gill visual contract, glossary data и genealogy
  visual language — owner/freeze zones по `AGENTS.md`.

## Жёсткие правила

1. Один subsystem на PR; не смешивать waves.
2. SHA-first: любой статус — immutable SHA + команда/witness + результат.
3. Не ослаблять gates ради зелёного CI.
4. Astro↔legacy parity не доказывает истинность контента.
5. Не переоткрывать закрытое без fresh negative witness.
6. Positive claim = invariant + environment + negative test.
7. AuditRepo matrix + этот prompt обновлять атомарно после merge.
8. Не утверждать deploy без exact deployed SHA witness.
