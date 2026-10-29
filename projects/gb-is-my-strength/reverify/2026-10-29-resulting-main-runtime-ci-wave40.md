# Волна 40 — CI resulting main после слияния #2217

Дата проверки: 2026-10-29  
Product main: `f63aac014c1d2d24e812a2f283245e4c60dc45d8`  
Дерево: `8a121d9021949a8eb843e19f8b7d588dbfe5717f`

## Итог

Полностью зелёный resulting-main CI **не подтверждён**. Deploy run `40921411158` завершился успешно, включая immutable candidate build, release verification и Pages deployment. Runtime Interactive Audit run `40921411176` завершился с одним красным job: `interactive-audit` / `123620198340`; `Home Chromium WebKit contract` и `Hermenevtika mobile Chrome visual contract` в том же run прошли.

Это не доказывает новую продуктовую регрессию. PR-head `ff860d39dd107997ba70470960bfb003ebc2be1a` и merge commit имеют одно дерево, а эквивалентный `interactive-audit` в PR run `40915091982` / job `123601286928` прошёл. Длительность успешного PR job и красного main job практически одинакова: 6:52 и 6:53. Следовательно, различие зависит от запуска, среды или недетерминированного результата; без конкретной упавшей проверки нельзя честно выбрать одну из этих причин.

## Что удалось установить удалённо

- check-run API подтверждает `failure`, шаг workflow — `Runtime interactive audit with durable evidence`;
- единственная failure-аннотация сообщает только `Process completed with exit code 1` на строке шага workflow и не содержит имени assertion;
- артефакт `runtime-interactive-audit-40921411176-1` существует, размер 6435 байт, не истёк;
- GitHub перенаправляет ZIP логов и артефакта на `productionresultssa8.blob.core.windows.net`; sandbox завершает оба разрешённых GitHub API-запроса на этом внешнем host с `EOF`;
- это ограничение получения доказательства в среде аудита, а не Product-дефект.

Повторный запуск Product workflow не инициировался: аудит не должен мутировать чужой CI только ради получения удобного исхода.

## Независимая проверка того же дерева

На source-clean detached checkout merge commit заново построен Pagefind: 115 HTML-файлов найдено, 102 страницы проиндексированы, 29 027 слов. Затем на production-like `dist` выполнены проверки в Chromium:

| Проверка | Результат |
|---|---:|
| `scripts/interactive-audit.js` | PASS: 56 pages, 10 series, 6 quizzes, 3 glossary, 1 footnotes, 6 theme, 4 search, 2 media, 7 chrome labels, 7 header hosts |
| Hermenevtika tooltip regression guard | PASS: 90/90 |
| Scripture tooltip projection/browser contract | PASS |
| Standalone reader layout guard | PASS: 184/184 |
| Home Design Audit Pro, Chromium | PASS: 338/338 |
| Homepage resume contract, Chromium portion | PASS до запуска недоступного локально WebKit |
| Lot publication contract, Chromium portion | PASS до запуска недоступного локально WebKit |

Chromium запускался с реальным browser runtime; проверки не форсировались кликами и не ослаблялись. Локальный WebKit не заявляется: его binary отсутствует, а загрузка запрещена sandbox egress. Отдельный удалённый job с Chromium+WebKit на этом main прошёл, но точный WebKit-подэтап составного красного job из недоступного artifact восстановить нельзя.

## Классификация

1. **Новая строка матрицы не добавляется.** Нет воспроизводимого assertion, нового root owner или доказанного дефекта продукта.
2. **Красный run не замалчивается.** Статус resulting-main remote CI остаётся «не полностью зелёный».
3. Сильное свидетельство против контентной регрессии: идентичное дерево прошло тот же PR job, а основной и шесть доступных downstream Chromium-контрактов проходят локально.
4. Нельзя повышать это свидетельство до утверждения «обычный flaky test»: точное сообщение красного контракта недоступно.
5. Матрица сохраняет арифметику **57 = 28 direct + 7 improvements + 1 residual + 21 system lanes**. Уже принятые владельцы публикационного контракта, quiz handoff, print policy и exact-destination не дублируются.

## Условие дальнейшего уточнения

Если артефакт или job log станет доступен через разрешённый канал, достаточно извлечь первый фактический FAIL и сопоставить его с успешным PR run. До этого момента корректное заключение ограничено: удалённая результирующая сборка опубликована, но полный runtime CI после merge красный по неизвестному assertion.
