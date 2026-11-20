# QE‑01 · Гилл II: исправить ключ и объяснение, сохранить источник

Дополнение к [редакционному отчёту](REPORT.md) по [комментарию к Draft #570][owner]. Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product]; сверены исходники и локальный production-like `dist`.

**Граница Product [#2328][article-pr].** Поправка статьи и оглавления принята в комментарии владельца; откат не нужен. [Раздел `#sec-systematics`][article] теперь говорит об одном из важнейших систематических трудов **партикулярных баптистов XVIII века**. Текст прямо отвергает первенство среди всех баптистов и называет Томаса Грэнтема, *Christianismus Primitivus* (1678). Это сверка согласованности с утверждением статьи, не новое исследование исторического приоритета.

**Остаток в банке.** [Запись `gill.scholar.systematics`][bank] («Чем примечателен „Полный свод богословия“ Гилла?») по-прежнему засчитывает «Это первая систематическая сумма богословия, написанная баптистом». Разбор повторяет первенство. Ни один из остальных вариантов не передаёт квалифицированный ответ статьи. В пяти путях #2328 файла `gillLearningData.ts` нет.

**Независимый повтор браузера.** «Настройки → Обучение → Тест», выбор по тексту, не по позиции; «Точно знаю» и указанный вариант дали **«Верно — и вы были уверены. Точная калибровка.»** Клик по «Перечитать» закрыл лист и сфокусировал видимый заголовок `#sec-systematics` в том же документе (**12/12**, два прогона, 390×844 / 1440×900). Опровергающий абзац ниже заголовка; обычная прокрутка показала его в том же разделе (**12/12**). Это не навигационный сбой: [кадр ответа][answer] · [абзац после прокрутки][paragraph] · [квитанция с трассой][receipt]. Состояние вопроса сохранено при возврате в «Обучение». Дальнейшая проверка заметок относится к [QNL‑01/02](../../arena-quiz-note-lifecycle/2026-11-18/ACCEPTANCE-FOLLOWUP.md), не к ключу.

## Что передать редактору банка

- Переписать вариант-ключ и разбор вместе: значимость труда — в развернутой партикулярно-баптистской догматике и церковной практике, а не в непроверенном первенстве среди всех баптистов. Не просто переставить `correctIndex` на один из нынешних дистракторов.
- В чистой попытке на узком и широком экране проверить: корректный квалифицированный вариант засчитывается, ложное первенство не засчитывается (или удалено из вариантов), «Почему это важно» согласуется со статьёй. Проверять текст ответа при случайном порядке вариантов.
- Сохранить `sourceHref` на `#sec-systematics`, повторить обычный «Перечитать» и визуальную сверку текста. Не менять статью, оглавление, [обработчик перехода][handoff] или логику заметок ради исправления ключа.

`verified-source` · `verified-production-like-dist` · `verified-browser`. Отдельный редакционный handoff, без исправления в Product и без изменения статуса #2328.

[owner]: https://github.com/FedorMilovanov/AuditRepo/pull/570#issuecomment-6983861606
[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[article-pr]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2328
[bank]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/gillLearningData.ts#L169-L183
[article]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro#L479-L484
[handoff]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L553-L597
[answer]: ../../arena-quiz-note-lifecycle/2026-11-18/evidence/same-390-qe-key.png
[paragraph]: ../../arena-quiz-note-lifecycle/2026-11-18/evidence/same-390-qe-paragraph.png
[receipt]: ../../arena-quiz-note-lifecycle/2026-11-18/evidence/comment-followup-receipt.json
