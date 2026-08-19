# Аудит-отчет: Глубокое погружение по GENEALOGY-NO-ERROR-BOUNDARY и SECURITY-CSP-GAPS

## Контекст
- **Целевой репозиторий**: `FedorMilovanov/gb-is-my-strength`
- **Анализируемый коммит**: `cb3681e1a`

## 1. Валидация GENEALOGY-NO-ERROR-BOUNDARY
🔴 **Подтверждено (Source-only)**

**Анализ кода:**
В файле `src/pages/rodosloviye/index.astro` компонент React монтируется как Astro island:
```astro
<div id="genealogy-tree" ...>
  <GenealogyTree client:only="react" persons={persons} eras={eras} />
</div>
```
Сам файл `src/components/genealogy/GenealogyTree.tsx` является корневым компонентом дерева, рендерящим узлы `ReactFlow`. В компоненте отсутствует обертка `<ErrorBoundary>`. Это означает, что любое необработанное исключение (runtime error) внутри ReactFlow, логики layouting'а (`buildLayout`) или при рендеринге графа приведет к размонтированию (unmount) всего компонента `GenealogyTree`. 

Поскольку Astro не имеет встроенного React Error Boundary для клиентских островов (client islands), результат выброшенной ошибки для конечного пользователя — пустой белый блок вместо интерактивного графа, без Graceful Degradation или сообщения об ошибке.

**Вывод**: Ошибка присутствует в текущем коде и требует реализации ErrorBoundary (например, использование пакета `react-error-boundary` на уровне острова или внутри компонента).

## 2. Валидация SECURITY-CSP-GAPS
🔴 **Подтверждено (Fragmented Security Ownership)**

**Анализ кода:**
В проекте наблюдается сильная фрагментация выдачи CSP (Content-Security-Policy). Поиск по коду показал, что мета-тег `<meta http-equiv="Content-Security-Policy" ...>` зашит (hardcoded) в отдельных PageChrome и PageHead компонентах (например, `HomePageHead.astro`, `ArticlesPageChrome.astro`, `AboutPageChrome.astro`, компонентах серии `baptisty-rossii` и др.).

Однако, ряд других корневых лейаутов и страниц полностью лишены этого тега в исходниках (source code):
1. `src/layouts/BaseLayout.astro` (используется, например, в `/hard-texts/genesis-6/` и `/izbrannoe/`) не содержит CSP.
2. `src/pages/app/index.astro` — полностью изолированная страница (не использует `BaseLayout`), и в ней **нет** генерации CSP.
3. `src/pages/rodosloviye/index.astro` использует `RodosloviyePageHead.astro`, в котором также **отсутствует** CSP мета-тег.

Согласно описанию баг-матрицы, в "живом" артефакте (live + committed artifact) эти заголовки могут присутствовать (вероятно, они добавляются через CDN, Cloudflare Pages/Vercel заголовки, или legacy-скрипты), что порождает **source-vs-artifact divergence**. В самом исходном коде Astro проекта политика фрагментирована, и на новых/некоторых старых роутах CSP отсутствует.

**Вывод**: Симптом поглощен корневым багом `FRAGMENTED-SECURITY-OWNERSHIP`. Текущая архитектура, где CSP копипастится по 61 разным head-компонентам, привела к пробелам (`/app/`, `/rodosloviye/`, `BaseLayout`). Необходим рефакторинг с выносом CSP в единый централизованный компонент (Unified security head).
