# Relationship Atlas implementation lane — 2026-07-27

Статус: **reference / implementation evidence, не operational SSOT**  
Source owner: `FedorMilovanov/gb-is-my-strength` PR #425  
Source branch: `feat/relationship-atlas-marathon-20260727`

## 1. Причина работы

Текущая система связей материалов имела несколько независимых владельцев и пользовательских дефектов:

- клиентский injector создавал два технических блока «Эта статья ссылается на» / «На эту статью ссылаются»;
- зеркальные edge-пары визуально дублировали один материал;
- series navigation и внешние смысловые связи не были формально разведены;
- `/map/` заявлял 42 страницы / 180+ связей, но рисовал ручной прототип из 10 узлов и 12 рёбер;
- URL связанных узлов строились из ID догадкой;
- отсутствовали реальные pan/zoom, list parity, focus URL и отдельная mobile-модель.

## 2. Утверждённая граница владения

Существующий series engine остаётся единственным владельцем:

- previous / next;
- порядка частей;
- прогресса;
- оглавления серии;
- спутников и вложенных материалов.

Новый article relationship panel показывает только внешние содержательные связи и не повторяет части той же серии.

## 3. Source PR #425 — текущий scope

### Документация

- `docs/RELATIONSHIP-NAVIGATION-CONTRACT.md`
- `docs/ARTICLE-RELATIONS-PANEL-SPEC.md`
- `docs/ATLAS-UX-SPEC.md`

### Внутристатейный переходный слой

- `js/relationship-panel.js`
- `css/relationship-panel.css`
- build-time инъекция ассетов во все complete article HTML;
- скрытие и удаление старых `.gbx-backlinks`;
- объединение зеркальных рёбер в один target;
- исключение same-series/group связей;
- разные заголовки для standalone и series article;
- deep link в `/map/?focus=<id>`.

### Атлас

`src/components/map/MapBody.astro` и `MapStyles.astro` заменены data-driven реализацией:

- реальный `data/links-graph.json`;
- unique undirected edge projection;
- вычисляемые counts;
- zoom/pan/pinch и кнопочная альтернатива;
- overview / cluster / detail semantic zoom;
- focus mode;
- канонические URL из node data;
- поиск;
- group filters;
- transitional relation filters;
- desktop detail panel;
- mobile filter drawer и bottom sheet;
- list mode с настоящими anchors;
- URL state `focus`, `group`, `view`.

### SEO

Публичное название `/map/` изменено с технического «Карта связей» на «Атлас исследований» при сохранении стабильного canonical URL.

## 4. Переходные ограничения

PR #425 не закрывает окончательную модель данных.

Пока остаются:

- ручной `data/links-graph.json`;
- отсутствие typed relation catalog;
- отсутствие body-link context extraction;
- три производных класса relation вместо окончательной редакционной таксономии;
- runtime article projection вместо build-time HTML projection.

## 5. Следующая волна после green acceptance

1. Полная инвентаризация entity coverage против series/route registries.
2. Typed relation definitions и inverse semantics.
3. Build-time extraction фактических body links.
4. Per-article projection artifact.
5. Contextual incoming mentions.
6. Удаление старого backlink injector из `site.js`.
7. Graphology + Sigma.js только после стабилизации relation compiler и visual contract.
8. Отдельная auditor projection: orphan, dead-end, unresolved, dense-clique, unpublished target.

## 6. Acceptance boundary

До изменения `MASTER_BUG_MATRIX.md` требуется:

- точный final source head;
- source PR CI green;
- production-like build;
- Chromium + WebKit runtime evidence;
- visual witness 390 / 768 / 1440;
- подтверждение article panel на standalone и series route;
- подтверждение pan/zoom/focus/list/deep-link на `/map/`;
- новый CURRENT_HEAD_REVERIFY для актуального source head.

Этот reference не меняет counters и не объявляет дефекты закрытыми.
