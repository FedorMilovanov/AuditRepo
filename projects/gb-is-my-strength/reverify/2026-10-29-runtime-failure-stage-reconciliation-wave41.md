# Волна 41 — сужение стадии resulting-main runtime failure

Дата: 2026-10-29  
Product main: `f63aac014c1d2d24e812a2f283245e4c60dc45d8`  
Дерево: `8a121d9021949a8eb843e19f8b7d588dbfe5717f`

## Резюме

Волна 40 честно оставила точный assertion неизвестным. Дополнительная сверка метаданных успешного PR run, красного main run, диагностического workflow и исходного runner сужает границу, но не позволяет назвать конкретный тест.

Полный check-suite resulting main завершён: **32 success + 13 skipped + 1 failure = 46**. Единственный failure — `interactive-audit` / `123620198340`. Deployment `7420006801` для exact SHA имеет финальный `success` и environment URL `https://gospod-bog.ru/`; это не превращает runtime suite в зелёный.

## Сопоставление двух запусков одного дерева

| Свойство | PR head | Resulting main |
|---|---:|---:|
| Run | `40915091982` | `40921411176` |
| Job | `123601286928` | `123620198340` |
| Conclusion | success | failure |
| Runtime step | 238 s | 239 s |
| Runtime artifact | 20 935 274 bytes | 6 435 bytes |
| Source tree | `8a121d90…` | `8a121d90…` |

Оба job успешно прошли checkout, dependency/browser install, production-like build, Pagefind build и запуск static server. Различие возникло только внутри составного шага `npm run interactive-audit`.

## Что означает размер артефакта

`interactive-audit-runner.js` сначала последовательно выполняет основной audit и дочерние runtime contracts. Только после них `runHomeDesignAudits()` запускает Chromium и WebKit. Каталог `reports/home-design-audit-pro` копируется в загружаемый `reports/interactive-audit/home-design-audit-pro` **только после успеха обоих движков**.

Локальный успешный Chromium Home Design report занимает около 21 MB; успешный PR artifact имеет сопоставимый размер 20 935 274 bytes. Красный artifact в 6 435 bytes не содержит успешно скопированный полный Home Design bundle.

Это устанавливает только безопасную границу:

- составной runner не дошёл до состояния «оба Home Design engine прошли и bundle скопирован»;
- сбой мог произойти в одном из более ранних contracts либо в Chromium/WebKit Home Design до финального копирования;
- почти одинаковая длительность двух шагов делает позднюю стадию правдоподобной, но **не доказывает** её;
- по одному размеру ZIP нельзя приписывать failure WebKit, Chromium или конкретному assertion.

## Диагностический workflow

Автоматический `CI Failure Diagnostics` run `40924151973` успешно отработал после красного runtime run. Его check annotations подтверждают:

- workflow `Runtime Interactive Audit`;
- exact run/attempt/branch/SHA;
- failed job `interactive-audit`;
- failed step 10 `Runtime interactive audit with durable evidence`.

`ci-failure-lifecycle.cjs` читает Jobs API и Artifacts API, но не распаковывает artifact и не публикует хвост `output.log` как annotation/summary. Artifact metadata остаётся в Actions log. Поэтому этот observer подтверждает координаты failure, но не раскрывает внутренний assertion.

Это не принимается отдельной строкой матрицы: исходный workflow действительно сохраняет `output.log` и `result.json`, а невозможность скачать ZIP здесь вызвана sandbox egress. Требование дублировать произвольные логи в annotations без доказанной общей операционной потребности создало бы лишнюю сложность. Если владелец решит улучшить машинную диагностику, минимальная форма — структурированный список дочерних contract/engine/status/duration и `failedPhase` в `result.json`, а не новый notification lifecycle.

## Независимые границы

На exact merge tree в волне 40 прошли основной interactive audit и шесть доступных Chromium contracts. WebKit локально не заявлялся (`skipped: sandbox egress`). Отдельный resulting-main job `Home Chromium WebKit contract` прошёл, но он исполняет другой набор Home/genealogy/lifecycle/a11y scripts и не доказывает Home Design WebKit внутри runner.

## Решение

1. Полностью зелёный resulting-main CI по-прежнему не заявляется.
2. Конкретная Product-регрессия, flaky assertion или engine не назначаются без `output.log`.
3. Новая строка и новый owner не добавляются.
4. Матрица остаётся **57 = 28 direct + 7 improvements + 1 residual + 21 system lanes**.
5. Product не изменялся; rerun, issue, comment и notification mutation не выполнялись.
