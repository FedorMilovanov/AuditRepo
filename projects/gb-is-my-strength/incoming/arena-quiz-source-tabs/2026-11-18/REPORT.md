# Аудит квизов: «Перечитать» перехватывает открытие в другой вкладке

**18 ноября 2026, UTC · этап 15 · intake для [Draft #570][draft].**

- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product], локальная production-like сборка. AuditRepo: `arena/9713b5a4-auditrepo` от `fcf2e69b…`.
- Agent: Arena Quiz Source Tabs. Только свидетельства; Product, MASTER и ledger не менялись.

**Вывод (`verified-browser`, `verified-production-like-dist`, `verified-source`).** На Гилле II ссылка «Перечитать» из «Обучения» на раздел **той же статьи** при **Ctrl+клике и Ctrl+Enter** отменяет действие браузера: закрывает панель и открывает источник в исходной вкладке. После повторного открытия вопрос и ответ на месте; это потеря выбранного способа перехода, **не** потеря попытки. Средняя кнопка проходит другим путём: `auxclick` не отменяется, а при открытии отдельно новая вкладка оставляет исходную панель и разбор на экране. Это практическое дополнение к [аудиту автопрокрутки][follow], а не повтор его замера.

## Что делает настоящий ввод

1440×900, мышь и клавиатура. На «Анатомии падения» дали неверный ответ на Q1 и получили обычную ссылку `#metod`. На Гилле II дошли до `gill.scholar.canticles` через реальные кнопки в перемешанном наборе «Обучения», ответили неверно и использовали `#glsQuizSource`. При Ctrl+Enter фокус достигал ссылки через Shift+Tab или Tab, без вызова `focus()` из теста. Ни одного `window.open()`, синтетического `click` или второго тестового `goto()` после активации ссылки.

| Ввод | Нативная «Анатомия» → `#metod` | «Обучение» Гилла II → `#sec-canticles` |
| --- | --- | --- |
| Обычный клик | Обычный фрагмент в текущей вкладке | Штатный handoff в текущей вкладке: закрытие панели, снятие лока, фокус на источнике |
| Ctrl+клик | `click` с `ctrlKey=true` не отменён; источник подтверждён в новой вкладке в 1 из 2 прогонов | **`defaultPrevented=true`**, новой страницы нет, панель закрыта, `#sec-canticles` в исходном URL |
| Средняя кнопка | `auxclick`, `button=1`, не отменён; подтверждён путь в новую вкладку | `auxclick` не отменён; в обеих пробах источник открылся отдельно, панель и разбор остались на месте |
| Ctrl+Enter | Неотменённый `click`, `detail=0`; подтверждён путь в новую вкладку | **Отменённый `click`, `detail=0`**; тот же переход в исходной вкладке и закрытие панели |

«Подтверждена новая вкладка» означает: замечена новая `Page` того же BrowserContext, её документ реально получил HTTP 200, URL содержит нужный fragment, его заголовок виден и выигрывает hit-test. У исходной вкладки не меняются документ, URL, `history.length`, состояние панели или данные ответа. В перехваченных случаях — одна страница и один HTML-ответ, тот же документ, `history.length + 1`; заголовок явным образом получает фокус. Отличали регистрации `click`/`auxclick` с `isTrusted=true`, окончательный `defaultPrevented`, ответ сети и отдельную вкладку; ни один из этих сигналов не подменяет другой.

### Два контроля границы URL и проверка во время Play

- **Другая статья.** Из той же панели на Гилле II `gill.man.horsleydown.years` даёт ссылку на Гилла I `#part-pastor`: Ctrl+клик проходит к браузеру, новая страница открывает нужный раздел, исходная панель остаётся.
- **Та же статья с query у исходной страницы.** Открыли Гилла II с `?utm_source=reader`; ссылка `gill.scholar.canticles` **та же**, query в ней нет. Ctrl+клик не отменён, подтверждён отдельный документ без query. Исходная вкладка сохраняет query, ответ и открытую панель. Это контроль условия перехвата, не рекомендация добавлять tracking-параметры и не повтор [потери состояния при обычном клике с query][review].
- **Уже начатая озвучка.** Play включили штатной кнопкой до входа в «Обучение», первую фразу удержали только на границе Web Speech. Ctrl+клик всё равно закрывает панель и меняет адрес исходной вкладки. Средняя кнопка не закрывает панель. В обоих случаях исходная очередь остаётся `playing`, `index=0`, **1** отправленная фраза и **0** отмен. Одна из двух проб со средней кнопкой загрузила источник, другая оставила `about:blank`; исходная панель оставалась открыта в обеих. При подтверждённом открытии отдельно у новой вкладки нет открытой панели, scroll lock или запущенной озвучки. Это не тест звучания или фонового воспроизведения ОС.

## Владелец, приёмка и пределы

- [Авторские данные][local-source] дают нормальный `<a href>`; у нативной [ссылки][native] нет обработчика, который отменяет эту активацию. [Обработчик «Обучения»][binding] запускает `handoffQuizSource` на любом `click` без проверки модификаторов/уже отменённого события. [Проверка URL][handoff] сравнивает `origin`, `pathname`, `search`; одинаковый URL переводит в `closeSheet → pushState → scrollIntoView → focus`, а затем `preventDefault`. Разница по query и другой статье подтверждает именно эту развилку. Средняя кнопка генерирует `auxclick`, которого обработчик не слушает. Штатный [контракт #2222][source-contract] снова **55/55** (обычная активация, не проверка Ctrl или `auxclick`). Оригинальный [#2222][fixed] остаётся фиксированным для обычного перехода.
- **Приёмка.** Оставить текущий handoff для немодифицированной основной активации, включая обычный Enter, но не забирать действие браузера у modified/middle. Проверять не только флаг отмены: для открытия отдельно наблюдать новую страницу с реальным источником и сохранением панели/ответа у исходной; для обычного клика — прежние фокус и снятие лока. Не переопределять все ссылки `target=_blank` и не разблокировать фон чужой вкладки. macOS Cmd, контекстное меню, системная полоска вкладок и мобильный long-press не проверялись.
- **Окружение.** Chromium Headless Shell 153.0.8010.0 / Playwright 1.62.1 / Node 22.23.4, desktop Light, reduced motion для изоляции от прокрутки; штатный launch Playwright (в том числе его политика popup), отдельный контекст, SW, Vosk и сторонняя сеть не участвуют. **Два прогона по 12/12**, 36 dist-пинов (35 совпали с этапом 14, добавился HTML Гилла I), без `pageerror`, локальных HTTP ≥400 или неожиданных сетевых отказов. Во всех **6** модифицированных активациях локальной ссылки «Обучения» браузерный клик отменён и панель закрыта. Из **14** активаций, оставленных браузеру для открытия отдельно, **12** подтверждены реальной загрузкой источника и hit-test, **2** остались `about:blank` (Ctrl+клик «Анатомии» и средняя кнопка при Play, по одному разу). В обоих случаях был HTTP 200, но не подтверждённое открытие источника. Причину не устанавливали. В пилотах встречались неотменённые активации без наблюдаемой новой страницы, а также HTML-ответ без подтверждённой `Page`; не приписываем это Product или реальному Chrome. Для browser-default пути отводили до 3,5 с на появление `Page` после ввода; замер не является гарантией открытия вкладки за пределами среды. [Прогон A][a], [прогон B][b], [квитанция][receipt], [сценарий][harness], [команды][commands].
- **Соседние агенты.** Сверены точные compare и полные paginated file lists: Product #2339, [#2340 `295a779c`][journal1], [#2341 `537b59f7`][journal7], [#2343 `86f59f52`][journal9] и bare [G3 `6ff1520f`][journal-bare] — Journal/G3, их CSS, документы и тесты. У #2343 и bare G3 есть измерения `page.pdf()` по Journal, не квитанция «Анатомии» из обычного окна. AuditRepo [#538 `17529334`][atlas] — Atlas v13, [#543 `140d6a5e`][horeb] — Horeb. Нет пересечений с owner-путями квиза, «Обучения», `reader-tts` или этим intake.
- **Отдельно:** [QPDF‑01][native-print] остаётся `PENDING_NATIVE_DIALOG`; подмены квитанции первым headless PDF нет.

[draft]: https://github.com/FedorMilovanov/AuditRepo/pull/570
[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[follow]: ../../arena-quiz-source-follow/2026-11-18/REPORT.md
[review]: ../../arena-quiz-review-loop/2026-11-18/REPORT.md
[native-print]: ../../arena-quiz-native-print/2026-11-18/REPORT.md
[local-source]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/gillLearningData.ts#L159-L167
[native]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/article-quiz.js#L164-L169
[binding]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L592-L598
[handoff]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L553-L590
[source-contract]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/scripts/series-quiz-source-handoff-browser-contract.mjs
[fixed]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2222
[journal1]: https://github.com/FedorMilovanov/gb-is-my-strength/compare/ab3e23aa24666bf909758778f28688c2f0d081a6...295a779c2a268c6c44543eb9a237f4a1c6612780
[journal7]: https://github.com/FedorMilovanov/gb-is-my-strength/compare/f5122c18816e4eeac0415b4691c159789d3d0fe7...537b59f7295a34ceb6ac9911b23b0ce1206342d3
[journal9]: https://github.com/FedorMilovanov/gb-is-my-strength/compare/cbe3ebea1a79d1ffb44338bd3b54f6e9e0a05a44...86f59f527df1d7e40d552533129de057b6a6acec
[journal-bare]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/6ff1520f3b7c4100c8de1b7159205d670dd677e5
[atlas]: https://github.com/FedorMilovanov/AuditRepo/pull/538/files
[horeb]: https://github.com/FedorMilovanov/AuditRepo/pull/543/files
[a]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-tabs-source-tabs-witness-json
[b]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-tabs-source-tabs-witness-replay-json
[receipt]: evidence/replay-receipt.json
[harness]: harness/source-tabs.mjs
[commands]: commands.log
