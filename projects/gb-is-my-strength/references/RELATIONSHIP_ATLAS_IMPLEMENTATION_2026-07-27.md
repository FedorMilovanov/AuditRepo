# Relationship Atlas implementation and consolidation record — 2026-07-28

Статус: **`SOURCE-MERGED / REVERIFY-EVIDENCE-RECORDED / NOT-OPERATIONAL-SSOT`**  
Source owner: `FedorMilovanov/gb-is-my-strength`  
Superseded source PR: `#425`  
Merged source PR: `#471`  
Final pre-Atlas site base: `cfbea1d33005908503d48d525a68a04db7045db1`  
Latest captured Atlas source: `fe548f1755b75550efdac1574a1bc6b01f06beea`  
Combined two-parent commit: `d723ce73d95a8da8096073e79bae82c4e2a89c38`  
Exact accepted CI head: `15b2d03f411deff29fedff86fa94e979b338ad18`  
Final source merge commit: `03f051b25f83c078c4a2c38fa3055e381ec8ed93`  
Final Research authority: `0a9105c499fa801f4095bce7ec311fcb728206a7`

## 1. Назначение записи

Этот документ фиксирует фактическую архитектуру Relationship Atlas, её объединение с финальным Genesis 6 / 1 Енох authority state и exact-head evidence, по которому source PR был слит.

Он не заменяет:

- source contracts в `gb-is-my-strength`;
- `MASTER_BUG_MATRIX.md`;
- `NEXT_AGENT_PROMPT.md`;
- отдельный CURRENT_HEAD_REVERIFY;
- operational counters и disposition дефектов.

Настоящая reference-запись не меняет counters и не объявляет operational issue закрытым автоматически.

## 2. Почему старый implementation lane superseded

Первоначальный reference описывал переходный этап:

- browser-side `js/relationship-panel.js`;
- runtime article projection;
- отсутствие typed relation catalog;
- ручной `data/links-graph.json` как единственный semantic owner;
- ранний data-driven `MapBody`.

Финальная архитектура ушла дальше. Эти формулы больше не соответствуют source truth и не являются acceptance evidence.

## 3. Граница владения

### Series engine — единственный владелец

- previous / next;
- порядка частей;
- прогресса;
- оглавления;
- спутников и вложенных материалов.

### Relation engine — владелец внешних смысловых связей

- related;
- continues;
- background;
- compares;
- explains;
- inverse semantics typed catalog.

Article relationship panel не повторяет части той же серии. `seriesOrder` доступен общей модели, но исключён из article projection.

## 4. Каноническая архитектура

### Typed source data

- `data/relations.json`;
- `data/relations.schema.json`;
- канонические relation IDs;
- explicit source / target;
- relation kind;
- rationale;
- inverse label and semantics;
- validation unresolved targets, duplicates и invalid shapes.

### Единый compiler

- `src/lib/relations/engine.mjs`;
- `src/lib/relations/engine.d.ts`;
- `src/lib/relations/compiled.ts`;
- `src/pages/data/relations.compiled.json.ts`.

Один compiled graph используется для:

1. SSR Атласа;
2. build-time article projection;
3. browser Atlas runtime;
4. deterministic contracts.

Параллельного второго relation engine нет.

### Article projection

- `scripts/project-relations-to-dist.mjs`;
- semantic `<nav>` внедряется после production-like build;
- stale `.gbx-backlinks` и старые relation panels удаляются;
- article HTML не fetch-ит graph data в runtime;
- runtime relationship-panel script отсутствует;
- CSS materialized с content hash;
- отсутствие обязательной projection является fail-closed ошибкой.

### Атлас

- `AtlasBody.astro`;
- `AtlasNoScriptFallback.astro`;
- `AtlasRecovery.astro`;
- `AtlasRelationStyles.astro`;
- `AtlasVisualPolish.astro`;
- `atlas-runtime.js`.

Поддерживаются:

- SSR graph and anchor list;
- no-JS navigation;
- один compiled JSON request;
- list / graph parity;
- focus URL;
- group state;
- relation filters;
- history restoration;
- pan / zoom / pinch;
- keyboard controls;
- desktop detail panel;
- mobile drawer / sheet;
- fail-safe переход к SSR list при runtime/data error.

Старый hardcoded `MapBody.astro` удалён.

## 5. Runtime consolidation

Общие article interactions сведены в явные модули:

- `article-tooltips.js`;
- `article-quiz.js`;
- `article-image-viewer.js`;
- `reader-actions.js`;
- `print-pagination-geometry.js`;
- `article-interactions.js/css`.

Exact combined audit выявил одну настоящую keyboard/hover race на сноске статьи о герменевтике:

- explicit keyboard focus открыл правильную footnote surface;
- synthetic pointer hover мог немедленно заменить её другой tooltip surface;
- diagnostic предыдущего head: `markerOpen: false / tipOpen: true / nestedFocusable: 1`.

Исправление в accepted head `15b2d03...`:

- различает реальное движение указателя и synthetic pointer event;
- не разрешает hover перехватить active non-hover tooltip до реального pointer movement;
- сохраняет keyboard, ARIA и OverlayRuntime;
- не использует forced click;
- не увеличивает acceptance timeout;
- не ослабляет audit;
- не меняет article source или footnote content.

После исправления полный Runtime Interactive Audit прошёл на exact head.

## 6. Publication boundary Genesis 6

Консолидация доказала отсутствие file overlap между Atlas scope и семью финальными Genesis 6 файлами.

В combined tree Genesis blobs были взяты byte-for-byte из final site main.

Дополнительно:

- Genesis 6 parts в `data/series.json` имеют `status: draft`;
- relation compiler импортирует только `status: published`;
- 6A/6B отсутствуют в legacy graph;
- Atlas не публикует и не индексирует draft/noindex Енохов блок;
- Research provenance закреплён на final Research main `0a9105c499fa801f4095bce7ec311fcb728206a7`;
- publication state не менялся.

## 7. Source race и её закрытие

Во время первой consolidation исходная PR #425 получила дополнительные коммиты.

Они были проверены и сохранены:

- Atlas state browser contract;
- расширенный engine contract;
- map fallback assertion;
- hardened tooltip activation.

Затем:

- immutable latest source head `fe548f1...` был сохранён вторым родителем combined commit;
- исходный PR #425 закрыт как superseded;
- его branch ref нормализован к site main;
- successor #471 стал единственной merge-целью;
- после merge successor branch также нормализован к final site main.

## 8. Deterministic evidence surface

Source scope содержит:

- `check-relations.mjs`;
- `check-engine-contracts.js`;
- `relationship-panel-browser-contract.mjs`;
- `atlas-browser-contract.mjs`;
- `atlas-state-browser-contract.mjs`;
- `map-runtime-fallback-browser-core.mjs`;
- `map-runtime-fallback-browser-test.mjs`;
- print geometry / reversible card contracts;
- source authority contracts;
- route registry contracts;
- Chromium / WebKit public-surface matrices;
- visual parity evidence;
- glossary and runtime interaction contracts.

`atlas-state-browser-contract.mjs` использует реальный compiled graph и проверяет:

- полный neighbor count независимо от визуального cap;
- filter recomputation active focus;
- URL focus ownership;
- group navigation clearing stale focus;
- DOM/detail consistency;
- browser console cleanliness.

## 9. Exact-head CI acceptance

Accepted exact head:

`15b2d03f411deff29fedff86fa94e979b338ad18`

На нём завершились `success`:

- Genesis 6 Research provenance;
- Shared Files Guard;
- Glossary Contract;
- Overlay Runtime Browser;
- Editorial Dateline Contract;
- Native Source Contract;
- Print Paper Contract;
- Gill Final Source Reconciliation;
- Gill pre-v16 submenu contract;
- Runtime Interactive Audit;
- Source Authority Contract;
- Visual Parity Guard — pixel-diff;
- Route Registry Validators, включая Chromium и WebKit all-public-surfaces.

Перед merge также подтверждены:

- branch `0 behind` относительно `main`;
- отсутствие unresolved review threads;
- отсутствие submitted reviews с блокирующим verdict;
- неизменность exact head;
- отсутствие Genesis authority/content diff.

## 10. Merge result

Source PR `#471` слит squash-методом.

Final source merge commit:

`03f051b25f83c078c4a2c38fa3055e381ec8ed93`

Merge сохранил:

- typed relation compiler;
- build-time article projection;
- SSR/no-JS Atlas fallback;
- browser state contracts;
- explicit-focus versus synthetic-hover fix;
- final Genesis 6 authority;
- draft/noindex boundary;
- отсутствие manuscript/research artifact deletion.

После merge открытых source PR по текущему контуру не осталось.

## 11. Operational boundary

Эта запись подтверждает source implementation и exact-head evidence.

Она не выполняет автоматически:

- изменение `MASTER_BUG_MATRIX.md`;
- пересчёт counters;
- перевод всех исторических строк в `CLOSED`;
- live-production verification после deploy;
- deployment witness acceptance.

Для этих действий нужен отдельный CURRENT_HEAD_REVERIFY / production witness pass с его собственными доказательствами.

## 12. Итог

> Relationship Atlas слит как typed, compiled и fail-closed relation system с build-time article projection, SSR/no-JS Atlas, проверяемым browser state и исправленной keyboard/hover ownership. Genesis 6 authority сохранён и остаётся draft/noindex. Source merge и exact-head CI зафиксированы; operational counters настоящим reference не изменяются.