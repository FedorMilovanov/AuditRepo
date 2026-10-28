# Resulting main: Product #2202 и #2204 — 2026-10-27

## 1. Якорь и цель

Проверен новый Product main `e4e64607500433bb78274285ef43723cb5ed2ad1`, содержащий merged #2204 (`14c2c84…`) и #2202 (`e4e6460…`). Предыдущий audit anchor был `21dcfdd9…`. Product checkout не изменялся.

Канонический `npm run strangler:build:production-like` прошёл и выпустил 108 HTML-документов. Цель волны — не повторно принять route bugs, а определить, закрывают ли два merged repair существующие owners `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` и `SYS-READING-TABLE-KEYBOARD-SCROLL`.

Машинное свидетельство: `evidence/2026-10-27-resulting-main-pr2202-pr2204.jsonl`. Скриншоты и полные browser outputs оставлены вне Git в `/tmp/wave5`.

## 2. Product #2204: текущие confidence manifestations исправлены

В publishable data по-прежнему 181 relation и 42 `evidence.confidence`: `certain` ×1, `certain-textual-genealogy` ×40, `disputed` ×1. Shared inspector теперь отображает соответственно:

- «Редакторская уверенность: высокая»;
- «…подтверждена текстовой родословной»;
- «…оспариваемая».

Все три значения открыты штатной цепочкой «поиск → карточка человека → click связи» на desktop 1440×900 и mobile 390×844 `isMobile`, Dark, reduced motion. В каждом состоянии panel нарисован, raw enum отсутствует и фокус переходит на кнопку закрытия. Desktop Axe 0; mobile повторяет один известный `.mcp-search` `label-content-name-mismatch`. Broken images, page errors и нефильтрованные console errors — 0. LCP/CLS: desktop 224 ms / 0.000687, mobile 244 ms / 0.

Следовательно, 42 текущих raw confidence manifestations у `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` отмечаются как исправленные resulting-main, но owner не закрывается.

## 3. Почему publication-scaffold owner остаётся активным

Из тех же 42 reader-facing «Редакционных пометок» 40 остаются целиком английскими, одна смешивает русский с operational `legal` / `source-derived`, и только одна русская. Нативно вновь нарисована пометка `Matthew 1 directly states this genealogy step with 'begat'…`.

Кроме того, `CONFIDENCE_LABELS` перечисляет текущие 3/3 значения, но production expression сохраняет `CONFIDENCE_LABELS[evidence.confidence] ?? evidence.confidence`. Будущее значение тихо вернётся в reader UI как raw enum. Это closure-gap exhaustive projection contract, а не утверждение о четвёртом текущем значении.

Итог по #2204: **частичная resulting-main closure внутри существующего owner**. Для полного закрытия нужны локализованные reader notes и source guard, не допускающий silent raw fallback. Новый ID и отдельный confidence row не нужны.

## 4. Product #2202: один mobile table manifestation устранён

На Gill I таблица детей теперь имеет нативный `<caption>`, `tabindex="0"` и focus-visible style. На 390×844 её геометрия действительно overflow: client 309 px, scroll 356 px. Axe `scrollable-region-focusable` на этой таблице исчез. Нативный обратный Tab достигает таблицы, а ArrowRight прокручивает `0→14` без перехода на Gill II.

Повторный mobile census всех 15 built table routes показывает **19** residual `scrollable-region-focusable` nodes вместо прежних 20. Остаток распределён по прежним Gill II/III/context/reference и Nagornaya owners. Поэтому #2202 уменьшает проявление на единицу, но не закрывает shared `SYS-READING-TABLE-KEYBOARD-SCROLL`.

## 5. Conditional-contract и browser-harness gap

Fix жёстко ставит `tabindex="0"`, а не включает его только при реальном overflow. На desktop 1440×900 та же таблица имеет client=scroll=750 px, но остаётся дополнительным Tab stop. Нативный обратный Tab достигает её на шаге 45; ArrowRight уже не может скроллить и shared series handler переводит на Gill II. Это не отдельный route ID: current system owner уже требует «only actual scrollers enter Tab order» и reversible resize/reflow.

Обычный forward Tab не достиг таблицы за 1200 нажатий ни на desktop, ни на mobile: перед ней traversal попадает в уже активный rich-footnote interaction owner. Обратный Tab достигает таблицы штатно. Эта блокировка принадлежит `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL`, а не создаёт второй table bug.

PR browser contract на строке около 300 вызывает `await table.focus()`. Это валидно доказывает локальную focusability и Arrow handling после программного входа, но не доказывает нативную forward reachability и не проверяет отсутствие desktop stop без overflow. В audit использованы только настоящие Tab/Shift+Tab и Arrow; forced click/focus для вывода не применялись.

Свежий Gill I health после чистой перезагрузки: desktop/mobile Axe 0, broken images 0, page errors 0, нефильтрованные console errors 0; LCP 320/176 ms, CLS 0/0. Yandex delivery errors отфильтрованы как sandbox egress.

## 6. Exact-head CI boundary

На момент проверки Product exact head `e4e6460…` имеет pre-existing red check `Chromium WebKit reader semantic projection`: failed step — `Install exact dependencies and browsers`; semantic test не дошёл до исполнения. Несколько jobs ещё исполнялись. Локальный canonical build зелёный, но это не превращает exact-head CI в green и не используется для его замены.

## 7. Disposition

1. В `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` текущие raw confidence manifestations помечаются fixed-current; 41 нелокализованная/operational note и raw-fallback gate gap оставляют owner активным.
2. В `SYS-READING-TABLE-KEYBOARD-SCROLL` Gill I mobile manifestation помечается частично закрытым; residual Axe 20→19, остальные producers и conditional desktop contract остаются открытыми.
3. Forward footnote blocker только reconciled с существующим `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL`.
4. Арифметика не меняется: **47 direct + 8 improvements + 0 residuals + 23 systems = 78 active work units**.
