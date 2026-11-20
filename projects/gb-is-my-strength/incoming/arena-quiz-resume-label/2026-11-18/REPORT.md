# Главная: у ссылки «Продолжить» текст сливается с фоном

**18 ноября 2026 UTC · этап 19 · intake для [Draft #570][draft].**

- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][anchor], локальный production-like dist.
- AuditRepo `arena/9713b5a4-auditrepo` от `fcf2e69b…`. Статус: `verified-source`, `verified-browser`, `verified-production-like-dist`. Product не менялся.

В карточке **«Продолжить чтение»** на `/` ссылка остаётся доступной для активации, но её надпись становится **точно того же цвета, что заливка**. В светлой теме — при наведении. В тёмной — уже при первом показе, в том числе до касания на эмулированном мобильном экране. **Квиз для этого не нужен.**

| Тема, реальное состояние ссылки | Цвет надписи | Заливка | Контраст |
| --- | --- | --- | ---: |
| Светлая, без наведения и с `:focus-visible` без указателя | `#fff` | `#7a2e2e` | 9,30:1 |
| Светлая, указатель наведён | `#7a2e2e` | `#7a2e2e` | **1:1** |
| Тёмная, без наведения / наведена / `:focus-visible` | `#d4a574` | `#d4a574` | **1:1** |

Это непрозрачные значения `getComputedStyle` после загрузки шрифтов и переходов, без тени текста, фонового изображения и смешивания. Контраст пересчитан независимо из sRGB; **14 CSS px при весе 700** — не крупный текст, порог [WCAG 1.4.3][wcag] — **4,5:1**. Упоминание `:focus-visible` здесь относится к цвету надписи, а не к проверке видимости кольца фокуса или автопрокрутки: на 390 px в момент выборки фокус был на ссылке, а её прямоугольник — ниже окна. Кадры ниже сняты с полностью видимой карточкой.

## Воспроизведение и контроли

1. В свежем профиле карточка на главной скрыта и не несёт `href`. На Гилле II открыть «Обучение», ошибиться в вопросе о Песни Песней и нажать «Перечитать». `#sec-canticles` виден, ответ сохранён. Открыть главную, не прокручивая статью перед уходом. Появляется карточка, основанная на реально записанном ReaderState.
2. На главной сравнить ссылку в покое, после наведения мышью и после Tab без указателя на ней. На 390×844 и 1440×900 результат для цвета совпал. Отдельно в 390×844 с `hasTouch/isMobile` проверен вид **до** касания и настоящий tap, а не перенос hover-вывода на тач.
3. **Контроль без квиза:** в новой сессии на том же Гилле II обычным колесом довели нужный заголовок до 175 px от верха. Встроенный тест остаётся незапущенным, панель «Обучение» закрыта; на главной ссылка ведёт к правильному `#sec-canticles`. Надпись пропадает в тех же состояниях и с теми же значениями. Выбор `#sec-hebrew` после «Перечитать» относится к [этапу 18][position], не причина исчезновения надписи.

**Два прогона по 10 сценариев.** В каждом 8 сценариев с мышью и клавиатурой и 2 с касанием: **17/26** проверок цвета дали 1:1, остальные 9 — 9,30:1. Во всех **20/20** сценариях имя `Продолжить` присутствует в accessibility snapshot, реальный Enter или tap открыл документ с объявленным в `href` fragment, а `:target` совпал с ним. Это проверка активации и идентичности цели, не скринридер и не оценка всех положений viewport при клавиатурной навигации.

**Кадры при 390×844, вырезка карточки 352×258:** светлая [покой][light] → [наведение][hover]; тёмная [покой][dark] → [диагностический цвет текста][probe]. Все четыре кадра A/B побайтно совпали. Диагностический кадр **не результат исправления Product**: в том же DOM временно изменили только `color`, не фон, размеры, текст или ссылку, затем полностью откатили. Белый на красной заливке возвращает 9,30:1; чёрный на бежевой заливке в тёмной теме — 9,43:1. Если только вернуть белый в тёмной теме, с этой заливкой было бы **2,23:1**, всё ещё ниже 4,5.

## Владелец каскада и приёмка

[`ResumeMobile.astro`][shell] даёт ссылке `.resume-reading-btn`, а [`HomeResumeClient.js`][href] заполняет её адрес. [Правило карточки][card-style] задаёт `background:var(--color-accent);color:#fff`, но CDP `CSS.getMatchedStylesForNode` показал, что цвет перебивают более специфичные правила из того же `site.css`: общий [`a:hover`][hover-style] в светлой и [`html.dark a`][dark-style] в тёмной. Фон не переопределяется; оба выигравших значения равны акценту соответствующей темы.

**Приёмка:** сохранить контраст не ниже 4,5:1 для надписи этой ссылки в обеих темах, в покое, при hover и при фокусе, не меняя цвета всех ссылок глобально. Сохранить имя, `href`, отсутствие карточки при пустом профиле, запись прогресса и работу Enter/tap. Для dark недостаточно выиграть специфичность с прежним `#fff`: нужен совместимый цвет надписи либо пара «надпись/заливка». Состояния `:visited` и `:active` — отдельные проверки для владельца; здесь не засчитаны.

**Границы.** Это не возврат [HOME-RESUME-DEAD-01][old] на старом `485db8c2…` (там карточка не имела runtime-владельца). Сегодня карточка открылась на реальных данных; `homepage-resume-owner-contract-test.js` и `reader-state-regression-test.js` прошли, проверка контраста в них не предусмотрена. 61 SHA-256 загруженных HTML/JS/CSS/WOFF2: 41 общий с этапом 18, все его 46 повторно проверены. Headless Shell 153.0.8010.0, Playwright 1.62.1, Node 22.23.4, reduced motion, внешняя сеть и SW заблокированы, без `pageerror` и локальных HTTP ≥400. Не live, не реальные устройства и не нативная печать. QPDF‑01 остаётся `PENDING_NATIVE_DIALOG`.

Соседние Product #2340 `76297a84`, #2341 `4c69ec0c`, #2347 `dad21acb` и G3-ветка `8168e46e` сверены по точным diff, без этого CSS/владельца главной. #2346 `5a5b0282` — по-прежнему отдельный слой оформления библиотеки и Гилла. Дельты AuditRepo #543 и двух источниковых intake не пересекаются с пакетом.

[A][a] · [B][b] · [квитанция][receipt] · [harness][harness] · [команды][commands].

[draft]: https://github.com/FedorMilovanov/AuditRepo/pull/570
[anchor]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[wcag]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[shell]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/home/HomeSections/ResumeMobile.astro#L13-L24
[href]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/home/HomeResumeClient.js#L181-L185
[card-style]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/css/site.css#L30
[hover-style]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/css/site.css#L18
[dark-style]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/css/site.css#L16
[old]: ../../arena-bugverifier/2026-07-17/REPORT.md#observation-home-resume-dead-01
[position]: ../../arena-quiz-source-readerstate/2026-11-18/REPORT.md
[light]: evidence/home-resume-light-rest.png
[hover]: evidence/home-resume-light-hover.png
[dark]: evidence/home-resume-dark-rest.png
[probe]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-resume-label-home-resume-dark-color-probe-png
[a]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-resume-label-resume-label-witness-json
[b]: ../../arena-quiz-draft-review/2026-11-18/ARCHIVE.md#q-resume-label-resume-label-witness-replay-json
[receipt]: evidence/replay-receipt.json
[harness]: harness/resume-label.mjs
[commands]: commands.log
