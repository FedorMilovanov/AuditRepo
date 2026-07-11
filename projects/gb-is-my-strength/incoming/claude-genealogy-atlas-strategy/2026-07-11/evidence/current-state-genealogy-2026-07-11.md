# Evidence — текущее состояние генеалогического отдела (2026-07-11)

Source repo: `FedorMilovanov/gb-is-my-strength`, branch `claude/biblical-genealogy-svg-6l6qb8`
(= main на момент клона; HEAD `47cdf86` "[SYSTEM] mobile: shared chrome shell foundation (Phase 2 A1) (#80)").

## 1. Остров СМОНТИРОВАН и попадает в dist (статус lane-дока 2026-06-27 устарел)

`docs/refactor-2026/lanes/shared-genealogy-multiparent-2026-06-27.md` утверждал:
«the interactive GenealogyTree ReactFlow island … is **not yet mounted into any built page**
(`@xyflow/react` is absent from `dist/`)». На текущем HEAD это НЕ так.

Команда (Node 22, из корня репо):

```
npm ci && npx astro build
```

Вывод (фрагмент):

```
08:26:37   ├─ /rodosloviye/index.html (+16ms)
08:26:37 [build] 54 page(s) built in 12.51s
```

Содержимое dist:

```
dist/_astro/GenealogyTree.B5lzpxcU.js   248K raw / 80KB gz   (React Flow 12 + dagre + компоненты)
dist/_astro/client.B8D08m9d.js          180K raw / 56KB gz   (React runtime)
dist/_astro/GenealogyTree.C5ap-Sga.css   16K raw /  3KB gz
dist/rodosloviye/index.html             128K  ← props острова СЕРИАЛИЗОВАНЫ в HTML
```

`src/pages/rodosloviye/index.astro` монтирует `<GenealogyTree client:only="react"
persons={persons} eras={eras} />`; данные (88K JSON) инлайнятся в HTML страницы.

**Вывод для масштабирования:** при переходе от 156 к ~3 254 персонам паттерн
«данные как props острова» даст ~1.5–2 MB HTML — данные обязаны переехать в
отдельно загружаемые JSON-чанки (fetch), а не в props.

## 2. Инвентаризация существующего кода (git-факт, wc -l)

```
src/components/genealogy/DetailPanel.tsx    146
src/components/genealogy/GenealogyTree.tsx  311
src/components/genealogy/PersonNode.tsx      99
src/components/genealogy/SplitView.tsx      178
src/components/genealogy/TimelineAxis.tsx    99
src/components/genealogy/layout.ts          203
src/components/genealogy/theme.ts            72
src/components/genealogy/types.ts           143
src/components/rodosloviye/*.astro           83 (Body 39 + PageHead 38 + Styles 6)
src/pages/rodosloviye/index.astro            31
rodosloviye/index.html (legacy fallback)     79
ИТОГО                                     ~1 444 строки
```

Зависимости уже в package.json: `@astrojs/react ^5`, `react ^19.2.7`,
`@xyflow/react ^12.11.0`, `@dagrejs/dagre ^3.0.0`.

## 3. Данные: data/genealogy/genealogy.json (88K)

```
meta.version: 2026-06-19-v3-integrity-fix
_status: "v3-integrity: all parent references fixed, children arrays consistent,
          deathAM computed. 156 persons, 0 orphan references."
persons: 156, eras: 8
lineages: messianic 45, messianic-luke 43, neutral 39, messianic-matthew 25,
          cainite 2, rejected 1, messianic-fulfillment 1
roles: patriarch 65, person 50, king 16, matriarch 11, prince 4, prophet 3,
       priest 3, governor 2, foster-father 1, messiah 1
с хронологией (MT AM): 26 из 156
disputed-узлы: cainan_2, jeconiah, joseph_nt
```

## 4. Маршрут /rodosloviye/ — production, но «сирота» (0 входящих ссылок)

- `migration/page-ownership.json`: `/rodosloviye/` → owner astro, risk 2, status
  **production-dist**, source `src/pages/rodosloviye/index.astro`.
- `data/route-profiles/rodosloviye.json`: `migrationMode: strict-native-app`,
  `routeType: genealogy`, `migrationLane: special`, visualParity 0/0.
- Присутствует в `sitemap.xml` (1), `data/public-content-baseline.json` (2),
  `data/search-manifest.json` (2).
- **НО:** grep по `index.html` (главная), `karty/index.html`, `articles/index.html`,
  `src/pages/index.astro`, `src/components/**` (кроме самих rodosloviye/genealogy
  компонентов) — ссылок на `/rodosloviye/` НЕТ. Раздел недостижим кликом с сайта;
  только прямой URL / sitemap / внутренний поиск.
- Legacy fallback `rodosloviye/index.html` содержит кнопку «Открыть родословие»
  с href `/rodosloviye/` — циклическая ссылка на самого себя (в Astro-версии
  RodosloviyeBody кнопка ведёт на `#genealogy-tree` — исправлено только в native слое).

## 5. Семантический зум текущей реализации — скрытие, не агрегация

`GenealogyTree.tsx`: `detailLevel = zoom<0.3 ? 0 : zoom<0.7 ? 1 : 2`;
L0/L1 реализованы как `hidden: true` для неключевых узлов **при полном dagre-layout
всех 156 узлов**. Т.е. на обзорном масштабе видна разреженная россыпь узлов на
той же огромной канве, а НЕ агрегированные кластер-узлы («Допотопные патриархи
+165 имён») как в референсах владельца. Кластеров/expand-collapse в модели данных
и рендере нет. TimelineAxis — фиксированный overlay на вьюпорт: НЕ синхронизирован
с pan/zoom канвы (шкала не движется вместе с деревом).

## 6. Ограничение среды

`astro build` здесь — plain build (без `scripts/copy-legacy-to-dist.js` strangler-слоя),
но `/rodosloviye/` — Astro-owned strict-native-app route, поэтому вывод о монтировании
острова и весах бандла валиден и для production-like dist. Полный
`npm run strangler:build:production-like` в этой сессии не гонялся.
