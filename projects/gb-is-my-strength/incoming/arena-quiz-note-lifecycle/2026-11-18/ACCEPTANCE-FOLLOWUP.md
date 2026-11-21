# QNL‑01/02: что остаётся после правки в другой вкладке

- **Дополнение к [этапу 9](REPORT.md)** по [комментарию к Draft #570][owner]. Сценарии проверяют прежнего владельца `GBHighlights`, не добавляют новых дефектов. Это свидетельство до исправления, не приёмка патча.
- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product], исходники и локальный production-like `dist`. AuditRepo `arena/9713b5a4-auditrepo` от `fcf2e69b…`.
- **Два независимых прогона по 6 контекстов:** один ID, удаление, разные ID; каждый при 390×844 и 1440×900. [Квитанция сравнения][receipt] · [трасса A][a] · [трасса B][b].

## Что увидел читатель

В A на Гилле II ответили на вопрос в «Обучении», перешли через «Перечитать» к `#sec-systematics` и открыли «Обучение → Заметки → Управлять заметками». Запись создали штатной формой. Затем A снова открыла её и набрала двухстрочный черновик. В B открыли обычную статью об отступничестве в том же browser context, библиотеку — кнопкой-книгой. B сохранила правку или удалила запись. **До** отправки A дождались реального события `storage` в A и сверили тексты. Это упорядоченные действия, а не одновременная запись.

| Сценарий | После действия B, до отправки A | После отправки A в обеих вкладках и после reload только B |
| --- | --- | --- |
| **QNL‑02: один ID, 4/4** | B показывает сохранённый текст B. В A открыт черновик A, а в хранилище и скрытой разметке списка уже текст B. Скачанный Markdown из **обеих** вкладок и JSON из B содержат текст B, не черновик. | A закрывает форму и сообщает **«Заметка обновлена.»** без предупреждения. Обе вкладки показывают только текст A. Markdown и JSON из A, B и перезагруженной B содержат текст A; текста B больше нет. `id`, `savedAt`, URL и прочие поля этой записи до и после совпадают. |
| **QNL‑01: B удаляет ID, 4/4** | Хранилище и список уже пусты; форма A по-прежнему открыта, черновик на месте, кнопка сохранения доступна. У B `data.notes: []` в скачанном JSON. | A показывает **«Заметка обновлена.»** над пустым списком и закрывает форму. Ни в одной вкладке, ни в JSON после reload B нет ID или текста. Кнопка Markdown сообщает «Библиотека пуста.» и не создаёт загрузку в пределах 650 мс наблюдения после клика. Отмену удаления в этом повторе не нажимали. |
| **Контроль: два разных ID, 4/4** | Две заметки намеренно относятся к одному URL и имеют один заголовок статьи. B изменяет только второй ID. Экспорт различает исходный текст первого ID и новый текст второго. | Сохранение A меняет только первый ID. Обе правки присутствуют в списках и во всех повторных загрузках, в том числе после reload B; общий URL не склеивает записи. Список прокручивается внутри панели: одновременно видимые центры обеих карточек не были условием PASS. |

[В B до отправки][before] → [открытый черновик A][draft] → [в B после reload][after]. Отдельно: [ложное подтверждение после удаления][deleted] и [контроль двух ID после reload][distinct]. В A список скрыт, пока открыта форма (это не видимая карточка), но кнопка Markdown в заголовке доступна и экспортирует **сохранённые** записи. Панель «Копия JSON» скрыта в этом режиме, поэтому до отправки A резервную копию скачали в B; после — в обеих вкладках. В каждом наблюдении reload создал новый документ B (`navigation.type=reload`). A не перезагружали: после закрытия библиотеки в той же попытке сохранились вопрос, варианты, вердикт, разбор, ссылка и запись истории. Редакционное несоответствие самого вопроса — [отдельный QE‑01](../../arena-quiz-editorial/2026-11-18/QE-01-HANDOFF.md).

## Почему результат не доказывает сохранение элемента

**`verified-source` / `verified-production-like-dist` / `verified-browser`.** [`storage` → `sync()`][sync] обновляет список, а [`showEditor()`][editor] хранит снимок `draft.editing`. [`saveNote()`][save] перечитывает массив и делает `map` по ID. Если строки уже нет, массив не меняется, но [`write()`][write] успешно завершает `setItem`; форма закрывается с сообщением об успехе. Если строка есть с новым текстом, `Object.assign({}, x, { text })` меняет только `text`. Наблюдаемая правка B сохраняет прежний `savedAt`, поэтому сравнение только `id + savedAt` пропустит этот конфликт. Скачанные файлы отражают текущие записи: [Markdown][md-owner] читает сохранённые элементы, [JSON v3][json-owner] сериализует текущий снимок. Ни один не ведёт историю версий и не должен включать черновик.

## Приёмка будущего исправления

1. **Нет ID:** не сообщать об обновлении и не закрывать/очищать редактор. Объяснить удаление и дать явный способ скопировать черновик или сохранить его как новую запись. Не воскрешать удалённое автоматически; штатное «Отменить» остаётся независимым действием.
2. **Тот же ID, но уже другая версия:** сравнивать с версией, открытой в A; одного `savedAt` недостаточно. Без явного выбора читателя текст B должен остаться в записи, на экране B, после reload и в Markdown/JSON. Черновик A должен остаться в A и быть доступен для разрешения конфликта. Проверять текст и ID в телах файлов, а не только имя файла, успешный `setItem` или тост. До такого выбора не подменять версию B и не сбрасывать попытку квиза.
3. **Другой ID:** изменение B не должно блокировать сохранение A; обе новые версии переживают reload и попадают в экспорт. Не менять «Добавить без замены»: [v3 merge][merge] намеренно оставляет существующий ID; импорт уже проверен в [исходном отчёте](REPORT.md), здесь его не повторяли.


### Кандидат D7 в Product — не закрытие QNL

В [Draft #2351][d7-pr] на `6036e103` опубликованы [патч D7][d7-patch] к `#2346@e415560` и [проба автора][d7-harness]. [Повтор на исходном HEAD][d7-baseline] относится к тому же владельцу `GBHighlights`, не к отдельной панели помет W57. Проверили содержимое и `patch --dry-run` на точных исходных байтах: патч не применяли к Product и не запускали. На момент сверки действующий HEAD #2346 оставался `e415560`; #2351 добавляет отчёт, файл патча и сценарии, а не исправление `js/highlights.js` в рантайме.

Кандидат перечитывает запись по ID при сохранении, сверяет исходный текст, различает удаление и изменение, оставляет редактор открытым без записи при конфликте. [Автор сообщает][d7-audit] о прохождении четырёх сценариев на локальном кандидате, включая ручной перенос черновика через буфер обмена без записи новой заметки. Проба сверяет ID и текст в хранилище после reload B, но не скачанные Markdown/JSON; патч добавляет инструкцию скопировать черновик, а не отдельное действие интерфейса. Следующий контроль — точный HEAD с интегрированным исправлением: сохранить выбор B и черновик A, проверить загрузки из обеих вкладок и доступный путь копирования/создания новой записи. QNL‑01/02 остаются открытыми.

**Передача владельцу Reader/Library.** На Product `main@e733dd29` [исходник `GBHighlights`][qnl-main-save] совпал с аудированным: отдельной проверки конфликта нет. В [открытом Draft #2352][qnl-candidate] на [`f8df423a`][qnl-candidate-save] `saveNote` перечитывает запись, отказывает до записи при удалении/смене текста и не закрывает редактор. Сверен код, не поведение кандидата. Продолжать в #2352 без второго движка: на принятом HEAD нужны две вкладки, сохранённый черновик, reload и реально скачанные Markdown/JSON. [Более ранний touch-контроль помет][mark-control] не закрывает QNL.

## Воспроизводимость и границы

[Harness][harness] · [проверка повторов][checker] · [команды][commands]. На каждый прогон — **20 фактических Markdown и 24 JSON-загрузки**, ещё 10 кликов по Markdown в пустой библиотеке без загрузки в окне наблюдения. Сверены полные тексты, переносы строк, URL и `data` резервных копий (включая `notes[].id` и `savedAt`), не расширения файлов. Трасса хранит отпечатки и размеры скачанных байтов, нормализованное тело Markdown и разобранный JSON; заменён только локальный origin на `http://local.invalid`. Новые ID и даты создания не приравнивались между прогонами.

Headless Shell 153.0.8010.0 / Playwright 1.62.1 / Node 22.23.4, светлая тема и reduced motion, SW и запросы за пределы локального origin блокированы. Без посева заметок или подмены событий/экспорта; загрузки прочитаны с диска. Два процесса Chromium, чистый контекст на сценарий. **50** совпавших пинов `dist`, перепроверены все **15** исходных пинов этапа 9 (13 общих). 6 из 7 PNG побайтно совпали; на кадре квиза различались случайный порядок вариантов и прогресс, а не принятый ответ. Прочитаны границы [Product #2346][w57]: в `highlights.js`/CSS этого PR — версия стиля и точка счётчика, не обработка конфликтов в `saveNote`; W57 остаётся отдельным пилотом, его сборка здесь не проверялась. Нет утверждения о других движках, реальном телефоне, публичном деплое, квоте или двух одновременных записях. Product, реестры и нативная печать не менялись.

[owner]: https://github.com/FedorMilovanov/AuditRepo/pull/570#issuecomment-6990232675
[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[a]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-note-lifecycle-comment-followup-witness-json
[b]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-note-lifecycle-comment-followup-replay-json
[receipt]: evidence/comment-followup-receipt.json
[before]: evidence/same-390-peer-saved.png
[draft]: evidence/same-390-stale-draft.png
[after]: evidence/same-390-after-reload.png
[deleted]: evidence/delete-390-false-success.png
[distinct]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-note-lifecycle-distinct-1440-distinct-after-reload-png
[harness]: harness/comment-followup.mjs
[checker]: harness/check-comment-replays.py
[commands]: commands-comment-followup.log
[sync]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/highlights.js#L233-L235
[editor]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/highlights.js#L328-L337
[save]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/highlights.js#L345-L368
[write]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/highlights.js#L46-L64
[md-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/highlights.js#L217-L222
[json-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/reader-library-v3.js#L494-L500
[merge]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/reader-library-v3.js#L142-L159
[w57]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2346
[d7-pr]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2351
[d7-patch]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/6036e10305eb24d1150874abd30e9d328b2b71ae/audit/patches/reader-w57-d7-e415560.patch
[d7-harness]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/6036e10305eb24d1150874abd30e9d328b2b71ae/research/reader-w57-audit/note-conflict-witness.mjs
[d7-baseline]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2346#issuecomment-7047485329
[d7-audit]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/6036e10305eb24d1150874abd30e9d328b2b71ae/audit/READER-W57-BROWSER-VISUAL-AUDIT-2026-11-20.md
[qnl-candidate]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2352
[qnl-candidate-save]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/f8df423a308fb3b84081bae1cd338c6d4e35a3a8/js/highlights.js#L417-L430
[qnl-main-save]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/e733dd29f6186801eff9260365eeff8e72d4da0c/js/highlights.js#L345-L368
[mark-control]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2352#issuecomment-7053714082
