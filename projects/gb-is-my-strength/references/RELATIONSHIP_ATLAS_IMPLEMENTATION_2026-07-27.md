# Relationship Atlas implementation and consolidation record — 2026-07-28

Статус: **reference / exact combined CI pending / не operational SSOT**  
Source owner: `FedorMilovanov/gb-is-my-strength`  
Superseded source PR: `#425`  
Current source PR: `#471`  
Final site base: `cfbea1d33005908503d48d525a68a04db7045db1`  
Latest captured Atlas source: `fe548f1755b75550efdac1574a1bc6b01f06beea`  
Combined two-parent commit: `d723ce73d95a8da8096073e79bae82c4e2a89c38`  
Exact CI head: `77b6815a45bbdc1a7492fa7e2f868ed58f61d0db`

## 1. Назначение записи

Этот документ фиксирует фактическую архитектуру Relationship Atlas и путь её консолидации с финальным Genesis 6 / 1 Енох authority state.

Он не заменяет:

- source contracts в `gb-is-my-strength`;
- `MASTER_BUG_MATRIX.md`;
- `NEXT_AGENT_PROMPT.md`;
- exact-head CI;
- отдельный operational reverify после source merge.

Counters и статусы дефектов настоящим reference не меняются.

## 2. Почему старый implementation lane superseded

Первоначальный reference описывал переходный этап:

- browser-side `js/relationship-panel.js`;
- runtime article projection;
- отсутствие typed relation catalog;
- ручной `data/links-graph.json` как единственный semantic owner;
- ранний data-driven MapBody.

Финальная source-ветка ушла дальше. Эти формулы больше не соответствуют коду и не должны использоваться как acceptance evidence.

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
- и inverse semantics, определённых typed catalog.

Article relationship panel не повторяет части той же серии. Поле `seriesOrder` доступно компилятору только для общей модели и не попадает в article projection.

## 4. Каноническая архитектура

### Typed source data

- `data/relations.json`;
- `data/relations.schema.json`;
- канонические relation IDs;
- explicit source/target;
- relation kind;
- rationale;
- inverse label and semantics;
- validation unresolved targets, duplicates и invalid shapes.

### Единый compiler

- `src/lib/relations/engine.mjs`;
- `src/lib/relations/engine.d.ts`;
- `src/lib/relations/compiled.ts`;
- `src/pages/data/relations.compiled.json.ts`.

Один compiled graph используется:

1. SSR Атласа;
2. build-time article projection;
3. browser Atlas runtime;
4. deterministic contracts.

Параллельного второго relation engine нет.

### Article projection

- `scripts/project-relations-to-dist.mjs`;
- semantic `<nav>` внедряется после production-like build;
- старые `.gbx-backlinks` и stale relation panels удаляются;
- article HTML не fetch-ит graph data в runtime;
- runtime relationship-panel script удалён;
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

Source PR также сводит общие article interactions в явные runtime-модули:

- `article-tooltips.js`;
- `article-quiz.js`;
- `article-image-viewer.js`;
- `reader-actions.js`;
- `print-pagination-geometry.js`;
- `article-interactions.js/css`.

Последняя tooltip-правка не ослабляет browser contract:

- нет forced click;
- timeout acceptance не увеличен;
- сохранены keyboard, ARIA и OverlayRuntime;
- hover state стабилизирован через pointer epoch и переход anchor ↔ floating tip.

## 6. Publication boundary Genesis 6

Консолидация доказала отсутствие file overlap между Atlas scope и семью финальными Genesis 6 файлами.

В combined tree семь Genesis blobs взяты byte-for-byte из final site main.

Дополнительно:

- Genesis 6 parts в `data/series.json` имеют `status: draft`;
- relation compiler импортирует только `status: published`;
- 6A/6B отсутствуют в legacy graph;
- Atlas не публикует и не индексирует draft/noindex Енохов блок;
- Research provenance остаётся закреплён на final Research main `0a9105c499fa801f4095bce7ec311fcb728206a7`.

## 7. Последняя source race и её закрытие

Во время первой consolidation исходная PR #425 получила дополнительные коммиты.

Они были проверены и сохранены:

- Atlas state browser contract;
- расширенный engine contract;
- map fallback assertion;
- hardened tooltip activation.

После capture:

- исходный PR #425 закрыт как superseded;
- его branch ref нормализован к site main;
- immutable source head сохранён вторым родителем combined commit;
- текущей merge-целью является только PR #471.

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

## 9. Текущий acceptance boundary

До merge source PR #471 обязательны:

- неизменный exact head `77b6815a45bbdc1a7492fa7e2f868ed58f61d0db`;
- complete CI success;
- отсутствие unresolved review threads;
- подтверждение zero-behind относительно site main;
- отсутствие нового source race.

Отменённые runs предыдущего head не являются evidence.

## 10. Действия после source merge

После merge #471 этот reference должен получить:

- final source merge commit;
- финальный exact-head CI inventory;
- статус `SOURCE-MERGED / REVERIFY-EVIDENCE-RECORDED`;
- подтверждение нуля открытых source PR;
- отдельное решение, какие строки operational matrix действительно закрываются.

Только затем допустим отдельный CURRENT_HEAD_REVERIFY или изменение counters.

## 11. Итог

> Relationship Atlas больше не является ручным прототипом или browser-side backlink injector. Это typed, compiled и fail-closed relation system с build-time article projection, SSR/no-JS Atlas и проверяемым browser state. Genesis 6 authority сохранён byte-for-byte и остаётся draft/noindex. Настоящий документ фиксирует implementation evidence, но не объявляет source merge или operational закрытие до завершения exact combined CI.