# Приложение: результаты deep-research workflow (2026-07-11)

Параллельно личному сбору (artifacts/web-research-sources) прогонялся multi-agent
deep-research workflow (6 углов × WebSearch → WebFetch → 3-vote adversarial verify).

## ⚠️ Статус верификации — CAVEAT

Fetch-фаза отработала (36 источников, 25 извлечённых утверждений), но **verify-фаза
(75 голосующих агентов) целиком упала на лимите сессии** («session limit · resets 1:10pm»).
Поэтому утверждения ниже — **unverified raw extractions уровня L0**, НЕ прошедшие
adversarial-проверку. Тем не менее они (а) независимо ПОДТВЕРЖДАЮТ факты, которые я
уже проверил скачиванием/парсингом (evidence/dataset-feasibility-probe), и (б) добавляют
новые источники и датасеты. Что пересекается с моими probed-фактами — считать надёжным;
новое (бенчмарки, чужие датасеты) — L0, перепроверять перед использованием.

## Независимое подтверждение моих probed-фактов

- TIPNR: CC BY 4.0, все имена собственные, у персон father+mother/partners/siblings/
  offspring, ключ `Name@FirstRef=uStrong` — **совпадает** с моим парсингом (3056 персон).
  Workflow насчитал в PERSON-секции «2856 Male + 200 Female + 76 Group + 10 Place» —
  **точно мои числа** (независимая репликация счётчиков).
- Лицензионный нюанс «не редистрибутить сырьё, ссылаться на github.com/STEPBible» —
  подтверждён вторым чтением.
- Theographic: CC BY-SA 4.0, поля father/mother/children/partners/siblings +
  halfSiblings, ~3.4k строк People.csv — совпадает.

## Новые датасеты-свидетели (L0 — перепроверить в Phase 1)

1. **BradyStephenson/bible-data** — https://github.com/BradyStephenson/bible-data
   ⚑ **CC BY 4.0**. `BibleData-Person.csv` — 3 009 персон (sex, tribe);
   `BibleData-PersonRelationship.csv` — **5 450 направленных связей, каждая с
   verse-ссылкой И провенансом: 2 458 explicit / 2 967 inferred / 25 implicit**;
   реципрокные пары (son/father, descendant/ancestor, wife/husband) ⇒ ~2 700 уникальных
   рёбер; часть типов негенеалогические (killer/master/servant/disciple).
   **Ценность для нас: провенанс explicit/inferred — прямой вход для честной пометки
   «прямая связь vs выведенная» в атласе** (усиливает наш disputed/uncertain-слой).
   Кандидат в ТРЕТИЙ свидетель сверки рёбер рядом с TIPNR.
2. **MetaV (theonize/KJV-...-MetaV)** — https://github.com/theonize/KJV-bible-database-with-metadata-MetaV-
   `PeopleRelationships.csv` (Primary/RelatedTo/RelType). ⚠️ README предупреждает:
   «Father» может означать далёкого предка (пропуски поколений), спутаны spouse/concubine;
   не обновлялся после 2016. ⇒ Как свидетель — с осторожностью; TIPNR-маркер (a)-ancestor
   решает ту же проблему чище.

## Рендеринг: бенчмарки (L0, но конкретные цифры)

3. **Cytoscape.js WebGL preview (2025-01)** — https://blog.js.cytoscape.org/2025/01/13/webgl-preview/
   ⚑ M1 MBP/Chrome: **~3 200 узлов + 68 000 рёбер → 3 fps canvas / 10 fps WebGL**;
   ~1 200 узлов + 16 000 рёбер → 20 fps canvas / >100 fps WebGL (~5× GPU).
   **Ключевой вывод для нас:** у Cytoscape тормоза при 3k узлов — от 68k РЁБЕР;
   наш граф — 3 056 узлов при **~2 053 рёбрах** (в 30+ раз меньше рёбер) ⇒ рендер
   с LOD-бюджетом ≤500 видимых карточек тем более выполним; проблема не в числе персон,
   а всегда в плотности рёбер — что подтверждает наш LOD-first подход.
4. **React Flow performance guide** — https://reactflow.dev/learn/advanced-use/performance
   Главная причина тормозов — лишние ре-рендеры при движении узлов (state-updates).
   Подтверждает бюджет-риск RF-ядра на pan/zoom 3k узлов (наш вердикт: движок B).
5. **yWorks SVG/Canvas/WebGL** — https://www.yworks.com/blog/svg-canvas-webgl —
   индустриальный разбор порогов (совпадает с §F нашего реестра).

## Layout: подтверждение анти-паттерна + академия

6. ⚑ **bible-family-tree lesson** (workflow прочитал README): «d3-force на всём графе
   разом → плоский, широкий, нечитаемый layout; вставка по поколениям (BFS) → выше,
   уже, читаемее» — **дословное подтверждение** нашего решения (build-time послойный
   layout, НЕ force на полном графе; REPORT §S3.5, §S5).
7. **McGuffin & Balakrishnan «Interactive Visualization of Genealogical Graphs»** —
   https://www.semanticscholar.org/paper/.../5aea8f3e... — семинарная работа по
   генеалогической визуализации (dual-tree, fractal, ориентации). Первичный академический
   источник для контракта движка Phase 2.
8. **Efficient Genealogical Graph Layout** (Springer, Graph Drawing) —
   https://link.springer.com/chapter/10.1007/978-3-319-50901-3_45 — алгоритм layout
   генеалогических DAG. Вход Phase 2.
9. **Degree-of-Interest Trees** (Card & Nation 2002) — https://davenation.com/doitree/doitree-avi-2002.htm
   + DOI+прогрессивное раскрытие (Aarhus) https://cs.au.dk/~hjschulz/pdfs/doi4pva.pdf —
   первоисточники degree-of-interest, на которые ссылается наш §G (фокус-режим атласа).
10. **yFiles Family Tree Layout** — https://docs.yworks.com/yfiles-html/dguide/layout/family_tree_layout.html
    + https://www.yworks.com/pages/drawing-family-trees-with-javascript — коммерческий
    эталон family-layout (супруги/поколения); референс контракта, не зависимость.

## Новая существующая реализация (прецедент)

11. **fromadamtojesus.com** — https://fromadamtojesus.com/ — интерактивная трассировка
    родословия Адам→Иисус. Добавить в обзор прецедентов (§C реестра) наряду с
    complete-bible-genealogy / viz.bible / bible-family-tree.

## Прочие новые источники сравнений библиотек (L0)

12. Linkurious «Top 13 JS graph viz libraries» — https://linkurious.com/blog/top-javascript-graph-libraries/
13. Cylynx сравнение — https://www.cylynx.io/blog/a-comparison-of-javascript-graph-network-visualisation-libraries/
14. pkgpulse Cytoscape vs vis-network vs Sigma 2026 — https://www.pkgpulse.com/guides/cytoscape-vs-vis-network-vs-sigma-graph-visualization-2026
15. weber-stephen «render large network graphs» — https://weber-stephen.medium.com/the-best-libraries-and-methods-to-render-large-network-graphs-on-the-web-d122ece2f4dc
16. Ogma vs Cytoscape — https://doc.linkurious.com/ogma/latest/compare/cytoscape.html
17. Svelte Flow layouting libraries — https://svelteflow.dev/learn/layouting/layouting-libraries
18. VisualFlow «Massive Scale in React Flow» — https://www.visualflow.dev/blogs/scale-studio-pro
19. Scott Logic D3 SVG chart performance — https://blog.scottlogic.com/2014/09/19/d3-svg-chart-performance.html

## Итог для стратегии

Ни один новый факт НЕ опровергает выводы REPORT.md. Усиления:
- **BradyStephenson provenance (explicit/inferred/implicit)** — конкретный механизм для
  честной пометки достоверности рёбер в атласе; рекомендую добавить как 3-го свидетеля
  рёбер в Phase 1 (не ядро — TIPNR остаётся ядром, но провенанс — ценное обогащение).
- **Cytoscape-бенчмарк** численно подтверждает: bottleneck — рёбра, не узлы; наш граф
  с ~2k рёбрами и LOD-бюджетом заведомо в зелёной зоне.
- **bible-family-tree + McGuffin + Springer** — прямые входы контракта движка (Phase 2):
  послойный/BFS layout вместо force, dual-tree ориентации.

Общий реестр источников: 70 (личный сбор) + 19 новых (workflow) = **89 уникальных**.
