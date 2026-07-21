# NEXT AGENT PROMPT — gb-is-my-strength

> **SSOT по текущему состоянию source-проекта.** Карта документов и правило
> Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-21. Source `main`: `ffdba1496b66a18b16feaa231af5922d118dc3f8`.**
> PR #98 (карты: layers/theme) и PR #101 (Reader R1) влиты.
> Release/source gates зелёные на точных PR-head; **exact deployed SHA proof всё ещё pending**.
> Не объявлять production-deploy подтверждённым без отдельного witness.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_ffdba149.md`.

## Перед началом

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
# expect ffdba149… or newer
```

Если HEAD новее — сначала записать reverify delta. Затем прочитать `AGENTS.md`,
`docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`, архитектуру Reader Platform и этот SSOT.

## Что уже landed — не переделывать заново

### Единая типология контента

- `series` — обычная серия и книга;
- книга — **`series.shape = 'book'`**, а не отдельный движок;
- `article` — самостоятельная большая статья;
- `page` — каталог, справочная и другая нестатейная страница;
- `special` — карты, 3D, графы и иные приложения, использующие общую инфраструктуру только там, где это уместно.

Трёхуровневая книга уже есть в source: главы `tier:'chapter'`, статьи глав,
chapter/article rail и трёхуровневое TOC. Старые book-прототипы AuditRepo — evidence,
не код для полного merge.

### Reader R1 — PR #101

На `ffdba149` landed:

- каноническое `gb:reader-preferences:v1` и `window.GBReaderPreferences`;
- День / Ночь / Сепия, размер, line-height, measure, text mode, reduced motion;
- миграция Gill/Hermenevtika/global legacy keys и cross-tab sync;
- единый first-paint `ReaderPreferencesHead` вместо локальных theme-bootstrap;
- семантическая Sepia без blanket filters для изображений, видео, карт и 3D;
- shared assets в cache-bust, service worker, audit allowlists и Shared Files Guard;
- permanent pure/browser regressions.

Во время прогона дополнительно закрыт runtime blocker: общий scroll-lock создавал
feedback loop `MutationObserver → ensureLockState → повторная запись style/class` и
блокировал renderer при открытии настроек. Lock теперь идемпотентен, observer чинит
только реальный drift. `engine:sweep` гарантированно закрывает browser/server в `finally`.

Доказательства PR #101:

- Shared Files Guard + actionlint — green;
- Native Source Contract, Astro, production-like dist, native article/series output — green;
- cross-engine Chromium matrix — green;
- functional `engine:sweep` — **98/98 PASS**;
- временные proof/corrector workflows удалены до merge.

### Карты — PR #98

На `6a7539f9` закрыты `MAP-P0-06/07`:

- составные layer memberships;
- `main`, `stage.cls`, `place.type`, journey1–3 и общие города нескольких путешествий;
- сохранение выключенных слоёв после story switch/re-render;
- соблюдение `on:false` на первом рендере;
- реальная Day/Night палитра canvas/SVG/chrome.

Не переоткрывать эти пункты без fresh witness на `6a7539f9` или новее.

## Следующий обязательный SYSTEM lane — Reader R3

Создать нейтральный façade **`SeriesReaderChrome`** над текущим
`GillSeriesChrome`, сохранив существующий DOM/CSS/селекторы/поведение.

Порядок:

1. Инвентаризировать все реальные импорты и runtime-владельцев.
2. Добавить façade, который один напрямую импортирует historical Gill implementation.
3. Механически перевести series/book imports на façade без визуального redesign.
4. Добавить guard: новые маршруты не импортируют `GillSeriesChrome` напрямую.
5. Подтвердить flat series + `shape:'book'` + Gill эталоны браузером.
6. Прогнать Shared Files Guard, Native Source Contract, production-like build и `engine:sweep`.
7. Только отдельной следующей волной R4 — полный registry всех public routes: series/article/page/special.

**Запрещено:** создавать новый книжный мегадвижок, переименовывать DOM/CSS одним большим
рефакторингом, смешивать façade с overlay/runtime redesign или контентными правками.

## После R3/R4

- R5: единый overlay lifecycle/scroll-lock/focus runtime (issue #58), убрать прямые
  `body.style.overflow` у standalone settings после browser parity;
- единое reader progress/bookmarks/notes state (issue #59) без дублирования storage;
- mobile quality/performance sweep 320–430 px: safe areas, 44px targets, overflow,
  listeners, focus, overlays, desktop parity;
- удалять compatibility keys только после миграционного browser witness.

## Открытый P0 карт после PR #98

`MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`. Layer/theme defects закрыты.
Следующие map lanes не смешивать с Reader R3.

## Другие крупные остатки

- Нагорная проповедь: архитектурный dark-theme долг (`NG-CSS-01`, `NG-BODY-01`,
  `NG-DARK-01` и связанные), inline/library cleanup и SEO/TOC задачи;
- exact deployed SHA proof (`PROD-STALE-DEPLOY-RED`) остаётся отдельным witness-task;
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
