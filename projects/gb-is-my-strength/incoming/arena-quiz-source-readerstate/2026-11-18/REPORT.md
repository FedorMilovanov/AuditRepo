# Аудит квизов: одно место, разные «Продолжить чтение»

**18 ноября 2026 UTC · этап 18 · intake для [Draft #570][draft].**

- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][anchor], локальная production-like сборка. AuditRepo `arena/9713b5a4-auditrepo` от `fcf2e69b…`.
- Agent: Arena Quiz Source ReaderState. Только свидетельства; Product, MASTER и ledger не менялись.

**Вывод (`verified-source`, `verified-browser`, `verified-production-like-dist`).** После того как «Перечитать» в «Обучении» показало `#sec-canticles`, **и главная, и подсказка «Вы здесь были» возвращают к предыдущему `#sec-hebrew`**, если уйти без прокрутки. Для этого не нужно отмечать статью в библиотеке. Есть и расхождение между каналами: при заголовке на **300 px** от верха главная предлагает нужное место, а библиотека из **того же профиля и для той же сохранённой позиции** фактически открывает предыдущий раздел.

## 1. Что показали две кнопки

На Гилле II дали неверный ответ на [вопрос о Песни Песней][card] и нажали «Перечитать». До ухода `#sec-canticles` был виден, проходил hit-test и получил фокус; ответ не менялся. Ушли на главную без прокрутки к шапке и прочитали запись ReaderState уже после `pagehide`. В отдельных свежих профилях нажали ссылку **«Продолжить» на главной** либо открыли обычный адрес статьи без fragment и нажали **«Продолжить» в появившейся подсказке**. Эти сценарии не создают запись «Читаю».

| Перед уходом | `top` источника, 390 / 1440 | Что сохранил ReaderState | Где оказался читатель через обе кнопки |
| --- | ---: | --- | --- |
| «Обучение» → «Перечитать», без прокрутки | 400 / 483 | `sec-hebrew`, `scrollY` **8004 / 5446** | **«Раввинист — христианин с Мишной в руках»**, `scrollY` 5223 / 3458. Нужный источник ниже окна (3181 / 2471 px). |
| Встроенный [квиз Q1][native-q] → ссылка на тот же раздел | 88 / 168 | `sec-canticles`, 8316 / 5761 | **«Песнь Песней»**, 8316 / 5761. |
| «Обучение» → тот же источник → один жест колеса (100 / 183 px) | 300 / 300 | `sec-canticles`, 8104 / 5629 | **«Песнь Песней»**, 8316 / 5761. |

После центрирования без прокрутки неверный раздел воспроизвёлся в **8/8** пробах (две кнопки × две ширины × два прогона). Нативная ссылка и прокрутка — **16/16** правильных возвратов через эти же кнопки. Главная фактически ставит `#sec-hebrew` в `href` и показывает имя этого раздела с «14% прочитано»; клик открывает новый документ с этим fragment. Подсказка прокручивает к тому же предыдущему заголовку **без загрузки нового документа или смены URL в момент клика**. Дополнительный контроль: при той же старой записи прямой вход на настоящий `#sec-canticles` оставил источник видимым **4/4**, предыдущая запись его не переопределила.

**Кадры 390×844:** [метаданные карточки на главной][home-shot] → [предыдущий раздел после перехода][landing]. Кадр приземления из прогона A побайтно равен кадру библиотеки из этапа 17, поэтому второй PNG не добавлен. Из кадра не выводим контраст надписи или поведение подсказки, если она позже появляется на уже открытом fragment-URL; для подсказки использован отдельный вход без hash. Фактический `href` и видимость цели взяты из трассы.

## 2. Прямая сверка двух записей в одном профиле

Для дополнительной пробы явно выставили **«Читаю»**, открыли источник и тем же жестом довели его до `top=300`, не меняя URL `#sec-canticles`. На главной прочли **обе** записи из этого же профиля:

- **ReaderState:** `sectionId=sec-canticles` и реальный `scrollY=8104/5629`; видимая карточка главной имеет `…#sec-canticles`.
- **Библиотека:** `gb-library-reading-v1` сохраняет `anchor=sec-hebrew` и ненулевое отношение прокрутки. На другой странице обе записи остались такими же. Обычный клик «Моя библиотека → Продолжить» открыл Гилла II без fragment у `sec-hebrew`, исходный заголовок остался вне экрана. **4/4** расхождения при 390 и 1440. В этой парной пробе ссылку главной только прочитали; её фактическое приземление подтверждено отдельными колесо-контролями выше.

Значит, частичный обход «чуть прокрутить» зависит от канала. При **300 px** это помогает на главной и в подсказке, но не в библиотеке. Путь к `top=145` для библиотеки уже измерен в [этапе 17][library-audit].

## Механизм и приёмка

- [Переход из «Обучения»][handoff] делает `scrollIntoView(block:'center')` и фокусирует нужную цель. [ReaderState][line] выбирает последний заголовок выше своей линии чтения, здесь **325/342 px**, и сохраняет и `sectionId`, и `scrollY`. При 400/483 px он всё ещё считает активным предыдущий раздел. [Библиотека][library-owner] независимо выбирает якорь выше **250 px**. На 300 px эти правила дают разные durable записи даже при том же источнике, hash и координатах.
- [Главная][home-owner] формирует ссылку из `sectionId`; [подсказка][toast-owner] передаёт сохранённый снимок в [`ReaderState.restoreSnapshot`][restore], который предпочитает существующий `sectionId` координате и не должен подменять явный входящий hash. Это **не три независимые ошибки перехода**, а стык явного выбора источника с двумя правилами запоминания пассивного чтения.
- **Приёмка для владельца:** сохранить явную цель «Перечитать» как место продолжения, пока читатель реально не выбрал другое место; сверить библиотеку, главную и подсказку на одной позиции. Сохранить нормальный выбор раздела при обычной прокрутке, прямые fragment-URL и [штатное снятие лока #2222][fixed]. Не лечить это перестановкой одной глобальной линии или принудительным восстановлением ответа квиза в новом документе.

**Условия.** 16 сценариев ×2, **46** точных пинов HTML/JS/CSS: все **40** от этапа 17 и ещё 6 при загрузке главной. Без `pageerror`/локальных HTTP ≥400; 3 document request по 200 на обычную пробу, 4 в парной. Headless Shell 153.0.8010.0 / Playwright 1.62.1 / Node 22.23.4; Light, reduced motion, мышь. Сайт локальный, SW и внешняя сеть заблокированы; писали только штатные обработчики. Штатный `homepage-resume-owner-contract-test.js` PASS; обычный переход 55/55 подтверждён на тех же байтах на этапе 17. Нет live, других движков, BFCache, аудио или нативной печати. [A][a], [B][b], [квитанция][receipt], [сценарий][harness], [команды][commands].

**Координация.** Product `main` не сдвинулся. Соседний #2346 `5a5b0282` из предыдущей сверки — геометрия Гилла и оформление библиотеки, не владельцы выбора места; точные координаты относятся к Product anchor. Новые Product #2347 `67c89307` и #2348 `7d9c3d10` добавляют только материалы проверки G3/no-JS Back в `docs/reviews/` (24 и 1 файл); они не затрагивают ReaderState, библиотеку или квиз. `AuditRepo main=fe692393` и Draft до записи пакета стабильны. **QPDF‑01** остаётся `PENDING_NATIVE_DIALOG`.

[draft]: https://github.com/FedorMilovanov/AuditRepo/pull/570
[anchor]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[card]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/gillLearningData.ts#L159-L167
[native-q]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part2/GillPart2PageHead.astro#L209-L233
[handoff]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L579-L597
[line]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/reader-state.js#L236-L240
[restore]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/reader-state.js#L455-L469
[home-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/home/HomeResumeClient.js#L181-L185
[toast-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L2711-L2745
[library-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/reader-library-v3.js#L341-L379
[library-audit]: ../../arena-quiz-source-resume/2026-11-18/REPORT.md
[fixed]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2222
[home-shot]: evidence/home-resume-390.png
[landing]: ../../arena-quiz-source-resume/2026-11-18/evidence/gill-resumed-previous-heading.png
[a]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-readerstate-source-readerstate-witness-json
[b]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-source-readerstate-source-readerstate-witness-replay-json
[receipt]: evidence/replay-receipt.json
[harness]: harness/source-readerstate.mjs
[commands]: commands.log
