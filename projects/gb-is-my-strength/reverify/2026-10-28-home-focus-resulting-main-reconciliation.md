# Home focus return: resulting-main reconciliation — 2026-10-28

## 1. Якорь и границы

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`, уже содержащий owner merge Product #2206 `0e83c2adc10c053ed25146fa191f232f2e4a9ae9`. Canonical `npm run strangler:build:production-like` прошёл с 0 Astro errors и выпустил 108 финальных HTML-документов. Product не изменялся; открытых Product PR на момент reconciliation нет.

Цель волны — отделить уже доставленную системную защиту delayed focus recovery от остающейся Home-specific opener identity в `GBS-HOME-SEARCH-FOCUS-RESTORE`. Машинное свидетельство: `evidence/2026-10-28-home-focus-resulting-main-reconciliation.jsonl`; полные browser outputs и PNG оставлены вне Git в `/tmp/wave10`.

## 2. Нативная browser-матрица

На Home проверены четыре production-like профиля:

- desktop 1440×900 и mobile 390×844 с `isMobile: true`;
- Light и Dark;
- `prefers-reduced-motion: reduce` во всех случаях.

В каждом профиле поиск открывался реальным Tab → Enter для keyboard cases либо native click. Search input действительно становился active element. Затем выполнялись Escape, клик единственной кнопки закрытия и клик backdrop. Focus target снимался на 0/80/250/600/1000 ms после закрытия. Отдельный сценарий после Escape нативным Tab переводил фокус на следующий доступный элемент и проверял, что delayed recovery не отбирает его обратно.

Итого: 4 профиля × 4 сценария = 16 browser cases.

## 3. Что исправлено #2206

Desktop в обеих темах возвращает фокус точно в активированный `a#heroSearchBar` для всех трёх способов закрытия: **30/30 exact-opener observations**. Это сохраняет ранее квалифицированное исправление desktop manifestation.

Главное системное изменение #2206 также подтверждено поведением: после Escape и намеренного native Tab новый target сохранялся на всех пяти срезах во всех четырёх профилях — **20/20 observations**, без позднего перехвата opener-ом. Значит, условный bounded retry в `OverlayRuntime.restoreOverlayOpener()` устранил generic delayed-focus theft и защищает не только Home point-case.

## 4. Что не исправлено

Mobile в обеих темах после Escape, close-button и backdrop по-прежнему фокусирует `button#hMobileMenuBtn`, а не фактически активированный `#heroSearchBar`: **30/30 wrong-target observations** до 1000 ms.

Это согласуется с current source: `HomePageChrome::stableOpener()` продолжает преобразовывать mobile `[data-action="open-search"]` в `#hMobileMenuBtn`. Условный retry #2206 не может исправить неверно сохранённую identity; он лишь не перезаписывает последующий осознанный перевод фокуса.

Поэтому row не закрывается и не расширяется: active owner остаётся только mobile truthful-opener identity. Новый системный или point row не нужен.

## 5. Browser health и границы доказательства

Во всех 16 cases: URL остался `/`, overlay закрылся, broken images 0, horizontal overflow 0, page errors 0, Axe violations 0. LCP: 332–612 ms на mobile и 364–452 ms на desktop; CLS: 0–0.000029 на mobile и 0.015357–0.026053 на desktop. Сохранены четыре финальных screenshot — по одному на профиль.

`ERR_CONNECTION_CLOSED` внешней доставки и локальный static-preview 404 отфильтрованы как delivery noise: они не сопровождались broken image, page error, нарушением открытия/закрытия overlay или focus chain и не объявлены Product defect.

## 6. Disposition

1. Product #2206 принят как подтверждённая системная защита от delayed focus theft.
2. `GBS-HOME-SEARCH-FOCUS-RESTORE` остаётся активным без расширения: desktop fixed-current; mobile hero opener всё ещё подменяется menu button.
3. Closure требует удалить/уточнить Home-specific identity substitution и доказать exact clicked opener для трёх close paths, не ломая generic/header triggers и сохранённую #2206 защиту намеренного focus move.
4. Новых work units нет. Арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
