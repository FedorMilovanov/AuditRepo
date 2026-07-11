# Веб-исследование: реализация полной библейской генеалогии (2026-07-11)

Собрано лично агентом (WebSearch/WebFetch) + параллельный deep-research workflow
(6 углов, adversarial verify; его verified-claims добавляются отдельным приложением
к REPORT.md по завершении). Ниже — аннотированный реестр источников по темам.
Ключевые инженерные пороги отмечены ⚑.

## A. Датасеты полной библейской генеалогии

1. **Theographic Bible Metadata** — https://github.com/robertrouse/theographic-bible-metadata
   Граф знаний Библии: people/places/events/periods/verses; JSON (nested, предпочтительный),
   CSV, Neo4j, GraphQL. Биографические поля: alt-имена, год/место рождения-смерти,
   семейные связи, все стихи с упоминанием. **Лицензия CC BY-SA 4.0** (share-alike —
   производный датасет тоже CC BY-SA). 335★ / 88 forks / 213 commits.
2. people.json подтверждён в структуре репо — https://github.com/robertrouse/theographic-bible-metadata/tree/master/json
3. **STEPBible TIPNR** (Tyndale House / STEPBible) — https://github.com/STEPBible/STEPBible-Data
   «Translators Individualised Proper Names with all References»: КАЖДОЕ имя собственное
   Библии, разделённое на уникальных персон/места/вещи; ⚑ у персон — parents, partners,
   siblings, offspring; все ссылки на все формы имени (иврит/греч). **CC BY 4.0**,
   академическая курация Tyndale House. Прямой файл: TIPNR…CC BY.txt в репо.
4. Каталог STEPBible-Data — https://stepbible.github.io/STEPBible-Data/
5. Обзор Bible-датасетов — https://get.bible/bible-data-sets/
6. **Viz.Bible** (Robert Rouse) — https://viz.bible/ и данные https://viz.bible/bible-data/
7. Интервью Rouse о данных — https://future.bible/022-2/
8. **Wikidata** (CC0): WikiProject Genealogy — https://www.wikidata.org/wiki/Wikidata:WikiProject_Genealogy
   ⚑ P22 (father)/P25 (mother)/P26 (spouse), SPARQL label service с `ru` —
   источник РУССКИХ имён для мэппинга ~3000 персон.
9. SPARQL-примеры — https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples/en
10. SPARQL по родственным связям (практика) — https://medium.com/@javierzomeo/exploring-human-relationships-in-history-with-wikidata-and-sparql-698b1023991d
11. Wikidata visualize tools (GeneaWiki) — https://www.wikidata.org/wiki/Wikidata:Tools/Visualize_data/en

## B. Русскоязычные источники имён/схем (сверка русской номенклатуры)

12. Азбука.ру, схема «Древо от Адама и Евы до Иисуса Христа» — https://azbyka.ru/shemy/genealogicheskoe-drevo-ot-adama-i-evy-do-iisusa-khrista.shtml
13. Википедия «Библейская родословная» — https://ru.wikipedia.org/wiki/Библейская_родословная
14. Рувики зеркало — https://ru.ruwiki.ru/wiki/Библейская_родословная
15. ⚑ Генеалогия Полубоярцева (~1300 персонажей, по текстам Библии, рус.) — https://pomnirod.ru/materialy-k-statyam/knigi/genealogiya-iisusa-hrista-rodoslovie-adama-i-evy-genealogiya-sostavlena-po-tekstam-biblii-i-hristianskoj-literature-vklyuchaet-okolo-1300-biblejskih-personazhej-sozdal-aleksej-poluboyarcev.html
16. genealogistic.narod.ru (~1500 персон, ru/en) — https://genealogistic.narod.ru/jesus/indexru.htm
17. nev-tanah.info родословная схема — https://nev-tanah.info/rodoslovnaya-iisusa-xrista/
18. kartaslov «Библейская родословная» — https://kartaslov.ru/карта-знаний/Библейская%20родословная

### B2. Полный Синодальный текст (public domain, вход пайплайна русских имён)

18a. RST JSON (gist a1ip, git.io/rst.json) — https://gist.github.com/a1ip/0a5ec1b89e79b4490ef5992a80e72eeb
18b. thiagobodruk/bible (ru_synodal JSON) — https://github.com/thiagobodruk/bible
18c. bobuk/holybooks (RU/OT/*/SYNO.json) — https://github.com/bobuk/holybooks
18d. tigran123/russian-synodal-bible (Bibles.org.uk edition) — https://github.com/tigran123/russian-synodal-bible
18e. jadenzaleski/bible-translations (JSON+SQL, вкл. RST) — https://github.com/jadenzaleski/bible-translations

## C. Прецеденты полных интерактивных библейских генеалогий

19. ⚑ **bible-family-tree** (Canvas + d3-force на Theographic) — https://github.com/jonnyjackson26/bible-family-tree
    демо https://bible-family-tree.pages.dev/ — уроки: force-layout на полном графе =
    «клубок»; disconnected components в данных; в TODO — viewport culling/WebGL.
20. Complete Bible Genealogy (KJV, все имена, десктоп-стиль) — https://www.complete-bible-genealogy.com/
21. biblefamilytree.info — https://biblefamilytree.info/
22. BibleQuick Family Tree (12 колен, поиск, verse-refs) — https://biblequick.com/familytree
23. Viz.Bible интерактивные генеалогии (галерея) — https://viz.bible/interactive-bible-genealogies-gallery/
24. Viz.Bible Biblical Family Tree gallery — https://viz.bible/biblical-family-tree-gallery/
25. ⚑ UsefulCharts «Biblical Family Tree» (Matt Baker) — https://usefulcharts.com/products/biblical-family-tree
    — курируемый постер-язык (кластеры, линии) = ближайший аналог визуального языка референсов владельца.
26. Geni «Biblical Genealogy Portal» — https://www.geni.com/projects/Biblical-Genealogy-Portal/8153
27. Geni «Biblical Tree» — https://www.geni.com/projects/Biblical-Tree/38
28. Bible Lineage (Android) — https://play.google.com/store/apps/details?id=com.seed.bible_lineage
29. Обзор построения библейского древа — https://www.mindonmap.com/blog/bible-family-tree/

## D. Библиотеки визуализации и их пределы

30. ⚑ **React Flow: официальная позиция по масштабу** — https://github.com/xyflow/xyflow/discussions/3003
    «React Flow is not intended to be used in scales of 1000+ nodes/edges… a canvas-based
    approach would be better» (мейнтейнер). Решающий факт против «просто отрендерить всё в RF».
31. React Flow performance guide — https://reactflow.dev/learn/advanced-use/performance
    (onlyRenderVisibleElements, memo, collapse/expand поддеревьев)
32. Обсуждение больших объёмов — https://github.com/xyflow/xyflow/discussions/4975
33. Обсуждение 1682 (large data) — https://github.com/xyflow/xyflow/discussions/1682
34. Issue: 10k nodes lag — https://github.com/xyflow/xyflow/issues/3044
35. RF Stress test — https://reactflow.dev/examples/nodes/stress
36. Оптимизация RF (практика) — https://dev.to/usman_abdur_rehman/react-flowxyflow-optimization-45ik
37. Оптимизация RF (гайд) — https://medium.com/@lukasz.jazwa_32493/the-ultimate-guide-to-optimize-react-flow-project-performance-42f4297b2b7b
38. @xyflow/react npm — https://www.npmjs.com/package/@xyflow/react
39. **family-chart** (D3, специализирован на family) — https://github.com/donatso/family-chart
    док: https://donatso.github.io/family-chart-doc/
40. **Topola** (TS, D3/SVG, GEDCOM-ready, Webtrees addon) — https://github.com/PeWu/topola
41. Обзор «Top 6 JS family tree libraries» — https://dzone.com/articles/top-6-javascript-family-tree-diagram-libraries
42. npm keyword genealogy (ландшафт) — https://www.npmjs.com/search?q=keywords:genealogy
43. github topic family-tree JS — https://github.com/topics/family-tree?l=javascript

## E. Layout-алгоритмы

44. **elkjs** (ELK layered/Sugiyama, порты, web worker) — https://github.com/kieler/elkjs
    npm: https://www.npmjs.com/package/elkjs
45. ELK Layered reference — https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-layered.html
46. ELK paper (arXiv 2311.00533) — https://arxiv.org/pdf/2311.00533
47. React Flow + elkjs пример — https://reactflow.dev/examples/layout/elkjs
48. Практика RF+ELK+radial — https://dtoyoda10.medium.com/building-complex-graph-diagrams-with-react-flow-elk-js-and-dagre-js-8832f6a461c5
49. Entitree Flex (family-специфичный layout, братья/супруги) — https://reactflow.dev/examples/layout/entitree-flex
50. dagre (уже в проекте) — https://github.com/dagrejs/dagre

## F. Рендеринг: SVG vs Canvas vs WebGL

51. ⚑ Кросс-девайс бенчмарк анимаций (DOM деградирует ~500 объектов; Canvas — тысячи;
    WebGL стабилен на 5–10k) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12843483/
52. ⚑ SVG vs Canvas vs WebGL (пороги: SVG «до нескольких тысяч элементов», деградация 3–5k) —
    https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025
53. Dev3lop сравнение — https://dev3lop.com/svg-vs-canvas-vs-webgl-rendering-choice-for-data-visualization/
54. Felt: миграция SVG→Canvas (мотивация и цена) — https://felt.com/blog/from-svg-to-canvas-part-1-making-felt-faster
55. LogRocket SVG vs Canvas — https://blog.logrocket.com/svg-vs-canvas/
56. billboard.js 4.0: canvas-режим, +94.3% в бенчмарке — https://netil.medium.com/billboard-js-4-0-release-canvas-rendering-mode-94-3-faster-overall-in-benchmark-894b18798ffe
57. Counterpoint (large-scale animated viz, arXiv) — https://arxiv.org/pdf/2410.05645

## G. Semantic zoom / LOD / уровни детализации

58. ⚑ **ZMLT: Zoomable Multi-Level Tree** (arXiv 1906.05996) — https://arxiv.org/abs/1906.05996
    7 свойств (representative/persistent/overlap-free/planar/compact…) — теоретическая база
    «карта → раскрытие деталей при зуме», используется и в GENEALOGY-MASTERPLAN.
59. Semantic Zooming for Ontology Graphs (Wiens, Fraunhofer) — https://publica.fraunhofer.de/bitstreams/db3899b7-9ee3-4f2e-8a32-e1b034242f18/download
60. Обзор semantic zoom — https://www.emergentmind.com/topics/semantic-zoom
61. DeepAI зеркало ZMLT — https://deepai.org/publication/multi-level-tree-based-approach-for-interactive-graph-visualization-with-semantic-zoom

## H. UX больших деревьев (индустрия)

62. ⚑ MyHeritage 2025: редизайн мобильного древа (vertical cards default, pinch/swipe) —
    https://blog.myheritage.com/2025/03/new-improved-family-tree-on-the-myheritage-mobile-app/
63. MyHeritage: Relationship Diagram для very large trees (10k+ individuals) —
    https://blog.myheritage.com/2024/07/new-relationship-diagram-now-supports-very-large-family-trees/
64. MyHeritage web tree improvements — https://blog.myheritage.com/2021/08/improvements-to-the-online-family-tree-at-myheritage/
65. MyHeritage: виды древа (обзор) — https://education.myheritage.com/article/making-the-most-of-different-tree-views-on-myheritage/

> Примечание к количеству: реестр — 70 позиций личного сбора (65 + 5 источников
> полного Синодального текста в §B2); verified-claims и дополнительный пул URL от
> deep-research workflow прикладываются отдельно (evidence/web-research-workflow-*.md)
> после завершения его прогонов.

## Ключевые инженерные выводы (кратко, для REPORT.md §S3)

1. **Полный рендер 3 254 персон в DOM/SVG невозможен** (SVG-порог ~2–3k элементов,
   карточка ≈ 5–8 элементов ⇒ ~20k). ⇒ Semantic zoom с агрегатами (мега-узлы) и
   viewport-culling — обязательное ядро, а не улучшение.
2. **React Flow непригоден как ядро полного атласа** по слову мейнтейнеров (1000+ узлов —
   «не для этого»), но пригоден при жёстком LOD-бюджете ≤ ~500 видимых узлов. Вопрос —
   нужен ли тогда React вообще (см. вердикт по движку в REPORT.md).
3. **Layout считается на билде** (Node): ELK layered / Entitree Flex / кастом по эпохам;
   в рантайме — только pan/zoom, морфинг и подгрузка чанков. Прецедент проекта:
   route.json в karty (данные отделены от движка).
4. **Датасет**: TIPNR (полнота, CC BY) + Theographic (verse-links, периоды; CC BY-SA)
   + Wikidata (ru-имена, CC0) + Синодальный текст (уже в data/bible/) + сверка по
   русским схемам (Полубоярцев, Азбука). Производный датасет — CC BY-SA 4.0 с атрибуцией.
5. **Force-layout на полном графе — анти-паттерн** для атласа (урок bible-family-tree):
   нужен курируемый послойный/кластерный layout в стиле UsefulCharts/референсов владельца.
6. **Мобильный паттерн**: vertical cards + pinch/swipe (MyHeritage 2025), лестничная лента
   ветви — как в GENEALOGY-MASTERPLAN §3.8.
