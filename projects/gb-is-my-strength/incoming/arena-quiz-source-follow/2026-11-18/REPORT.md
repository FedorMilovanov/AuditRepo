# Аудит квизов: озвучка уводит экран от открытого источника

**18 ноября 2026, UTC · этап 14 · intake для [Draft #570][draft].**

- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product], локальная production-like сборка. AuditRepo: `arena/9713b5a4-auditrepo` от `fcf2e69b…`.
- Agent: Arena Quiz Source Follow. Только новые свидетельства; Product, MASTER и ledger не менялись.

**Вывод (`verified-browser`, `verified-production-like-dist`, `verified-source`).** Клик по источнику из разбора правильно открывает раздел, но при активной озвучке **первая следующая фраза может увести экран от него**, не меняя `#фрагмент` в адресе. На Гилле II после этого заголовок источника остаётся DOM-фокусом, хотя его уже не видно. Это не возврат [починенного перехода #2222][fixed] и не только попытка прокрутить удалённый узел из [этапа 13][active]: здесь следующий узел **подключён**, а экран действительно переместился.

## Два действия, два разных результата

1. Начать «Озвучка» обычным кликом **до** запуска квиза. Удержать первую фразу статьи только на входе/выходе Web Speech. Дать неверный ответ и открыть источник из разбора. Нативный Q1 «Анатомии» ведёт в `#metod`; карточка `gill.scholar.canticles` из «Обучения» на Гилле II — в `#sec-canticles`. Без Play — тот же ответ и тот же клик.
2. Убедиться, что прокрутка закончилась и заголовок источника в окне: `getBoundingClientRect`, затем попадание `elementFromPoint` в его центр. Пока первая фраза удержана, источник остаётся на месте. Отдельный `onboundary` той же фразы обновляет внутреннюю позицию, но **не** двигает окно. Потом отпустить только её `onend`, дать штатному consumer отправить следующую фразу и дождаться окончания настоящей прокрутки. После клика по источнику никаких Wheel/Home/переходов к другому месту для получения результата нет. В строке «пауза» Resume нажимали на видимой кнопке, без возврата к началу; это отдельно не сдвинуло экран.

В каждом из двух прогонов получились одинаковые значения ниже (CSS px). Первая точка — **уже после успешного перехода**, вторая — после отправки следующей фразы и остановки прокрутки; без Play — после того же окна наблюдения. `top` измерен относительно viewport.

| Маршрут и профиль | Режим | `scrollY` | `top` заголовка | Источник остался виден? |
| --- | --- | ---: | ---: | --- |
| «Анатомия» 390×844 | Без Play | 1854 → 1854 | 88 → 88 | Да |
| «Анатомия» 390×844 | Play, обычное движение | **1854 → 0** | **88 → 1942** | Нет |
| «Анатомия» 1440×900 | Play, обычное движение | **1753 → 0** | **168 → 1921** | Нет |
| «Анатомия» 390×844 | Play, reduced motion | 1854 → 1854 | 88 → 88 | Да |
| Гилл II, «Обучение», 390×844 | Без Play | 8004 → 8004 | 400 → 400 | Да |
| Гилл II, «Обучение», 390×844 | Play, обычное движение | **8004 → 665** | **400 → 7757** | Нет; заголовок всё ещё в фокусе |
| Гилл II, «Обучение», 390×844 | Play, reduced motion | 8004 → 8004 | 400 → 400 | Да |
| Гилл II, «Обучение», 1440×900 | Пауза → источник → Resume, обычное движение | **5446 → 618** | **483 → 5329** | Нет после следующей фразы; во время паузы и после самого Resume — да |

**Что видно.** [«Анатомия» у источника][screenshot-source] и [тот же viewport после отправки следующей фразы][screenshot-next] — кадры одного прогона: текст «Что эта модель утверждает — и чего не утверждает» сменился началом статьи, индикатор «Сейчас читаете» — на «Введение». Следующее `speak()` получило заголовок статьи (`H1`, `index=1`), не фразу квиза. Гилл II перешёл к обычному абзацу «Человек» (`#gill-search-p-002`, `index=1`); в узкой пробе `#sec-canticles` одновременно остался в URL **и** `activeElement`. Этот заголовок был на `7757 px` от верха окна высотой `844 px` — фокус не означает, что место видно.

**Что сохраняется.** Все 16 переходов действительно показали нужный источник, на Гилле закрыли модальное «Обучение», сняли scroll lock и сфокусировали заголовок. Смена экрана при следующей фразе произошла в том же документе и при том же URL, без отмены озвучки. Нативный Back после замера и повторное открытие панели на Гилле сохранили вопрос, вердикт, разбор, ссылку, счётчик и блокировку вариантов. Это не потеря попытки. Два наблюдаемых текста в каждой активной пробе совпали с первыми фразами из [этапа 13][active], где очередь также стартовала до квиза. Одно исключение временных блоков квиза из аудиопотока не остановит этот сдвиг.

## Владелец и граница приёмки

- [Ссылка нативного квиза][native-link] — обычный fragment link. [Handoff «Обучения»][handoff] закрывает панель, ставит hash, прокручивает к цели, фокусирует и временно подсвечивает её. [Контракт #2222][source-contract] снова **55/55** на том же `dist` в штатном reduced-motion профиле, Reader TTS runtime fixture **PASS**. Эти проверки не измеряют первый новый фрагмент после успешного открытия источника при обычном движении.
- [Канонический `followCurrentElement`][follow] при смене узла вне полосы окна вызывает `scrollIntoView({behavior:'smooth',block:'center'})`, если motion не reduced. [TTS вызывает его перед `speak()`][speak]. По трассе в четырёх отрицательных сценариях на прогон появился ровно один такой вызов по **существующему** узлу при `index=1`, после чего он выигрывает hit-test, а источник уже вне viewport. Регистрация делегировала настоящий метод браузеру. В [legacy-follow][legacy] есть отдельная задержка для wheel/touch/клавиш; это не защита встроенного `followCurrentElement` на проверенном пути. Цепочка не требует разрывать текущую озвучку для перехода: [same-document не является выходом со страницы][lifecycle].
- **Приёмка.** Ручной переход «Перечитать» должен давать возможность читать выбранный раздел, даже пока поток продолжает воспроизведение. Проверять следующий реальный переход TTS на другой блок, а не только наличие hash, краткую подсветку либо `activeElement`. Не исправлять прыжок сбросом попытки, принудительным Stop, внедрением отдельного прокрутчика или переключением системного reduced motion. Сохранить исходный #2222: попадание к заголовку источника, фокус, снятие лока и нативный Back. Политику возвращения к сопровождению чтения определить отдельно; один сценарий не обосновывает отключение автопрокрутки всюду.
- **Свидетельства.** Два свежих прогона по **8/8**, каждый с четырьмя реальными уходами от раздела и четырьмя стабильными контролями, **35/35** dist-пинов совпали с этапом 13. JSON не побайтно равны: карточки и варианты перемешивает сам сайт, счётчик до нужного вопроса различается; геометрия и ожидаемый исход совпали. Проверяли в Chromium Headless Shell 153.0.8010.0 / Playwright 1.62.1 / Node 22.23.4, мышь при обеих ширинах, отдельный контекст, SW/сторонняя сеть заблокированы, Vosk не загружали. Нет `pageerror`, локальных HTTP ≥400 и необъяснённых сетевых отказов. Фиксировали реальный viewport при управляемой длительности фраз, не естественную скорость прохождения квиза, звук, Vosk, Safari, экранный диктор или live. [Прогон A][run-a], [прогон B][run-b], [квитанция][replay], [сценарий][harness], [команды][commands].
- **Соседние агенты.** Реальный diff Product [#2344 `25907490`][journal-qa] — Journal-контракт и `package.json` (вызов контракта вынесен из `validate:all`), [#2340 `7d74f9d7`][journal1] — визуальный handoff G3 и его браузерный тест; не новые владельцы квиза, source handoff или TTS. Bare tips AuditRepo [f2fa039e][witnesses] — свидетельства 1971, [98343a3a][archive] — Keston/Tokmak; другие intake. Это проверка пересечения, не независимая приёмка этих изменений.
- **Отдельно:** [QPDF‑01][native-print] остаётся `PENDING_NATIVE_DIALOG`. Ничего здесь не заменяет квитанцию холодной пары PDF из обычного Chrome.

[draft]: https://github.com/FedorMilovanov/AuditRepo/pull/570
[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[fixed]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2222
[active]: ../../arena-quiz-active-playback/2026-11-18/REPORT.md
[native-print]: ../../arena-quiz-native-print/2026-11-18/REPORT.md
[native-link]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/article-quiz.js#L164-L169
[handoff]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L561-L597
[source-contract]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/scripts/series-quiz-source-handoff-browser-contract.mjs
[follow]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/reader-tts.js#L505-L515
[speak]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/reader-tts.js#L576-L605
[legacy]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L680-L732
[lifecycle]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/reader-tts-lifecycle.js#L24-L37
[journal-qa]: https://github.com/FedorMilovanov/gb-is-my-strength/compare/b434d30a07ded45968a623f58a3da62fd0be8fb1...259074909f0d1a35aca255adbb12bd40e99b3044
[journal1]: https://github.com/FedorMilovanov/gb-is-my-strength/compare/a682d395930de16f950a0bbe7ba2f5e2cc3dd2d4...7d74f9d74c3366fb613b083051ec6e0279f09385
[witnesses]: https://github.com/FedorMilovanov/AuditRepo/commit/f2fa039e87d6b9649f5d57f86f03fbf1e3da16c2
[archive]: https://github.com/FedorMilovanov/AuditRepo/commit/98343a3a0559ab8526df32dee7df507bf8c6d62d
[screenshot-source]: evidence/anatomy-at-source.png
[screenshot-next]: evidence/anatomy-after-next-phrase.png
[run-a]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-follow-source-follow-witness-json
[run-b]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-follow-source-follow-witness-replay-json
[replay]: evidence/replay-receipt.json
[harness]: harness/source-follow.mjs
[commands]: commands.log
