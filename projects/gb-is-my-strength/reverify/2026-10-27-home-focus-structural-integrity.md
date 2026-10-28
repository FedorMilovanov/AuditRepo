# Home focus return и финальная структурная целостность — 2026-10-27

## 1. Якорь и границы

Проверен неизменённый Product main `e4e64607500433bb78274285ef43723cb5ed2ad1`; canonical production-like build ранее прошёл и выпустил 108 HTML-документов. Волна повторно квалифицирует активный `GBS-HOME-SEARCH-FOCUS-RESTORE`, reconciles открытый Product #2205 и завершает bounded static structural/link census. Product не изменялся.

Машинное свидетельство: `evidence/2026-10-27-home-focus-structural-integrity.jsonl`. Скриншоты и полные browser outputs оставлены вне Git в `/tmp/wave5`.

## 2. Desktop manifestation исправлен на current main

На Home 1440×900, Dark, reduced motion проверены три штатных пути закрытия поиска, открытого из `#heroSearchBar`:

1. native Tab до hero opener → Enter → Escape;
2. native click opener → click единственной кнопки «Закрыть поиск»;
3. native click opener → click по backdrop.

Во всех трёх случаях search input действительно получал фокус при открытии, overlay закрывался, URL оставался `/`, а фокус возвращался точно в `#heroSearchBar`. Состояние записано на 0/80/250/600/1000 ms: **15/15 exact-opener observations**. Прежнее desktop-проявление «focus → body» больше не воспроизводится и помечается fixed-current.

## 3. Mobile manifestation остаётся

На 390×844 `isMobile`, Dark, reduced motion те же три нативные цепочки дали одинаковый результат: после закрытия фокус находится на `button#hMobileMenuBtn`, а не на фактически активированном `#heroSearchBar`. Неверный target стабилен на всех пяти временных срезах: **15/15 wrong-target observations**.

Источник подтверждает owner boundary: `HomePageChrome.astro::stableOpener()` специально преобразует любой candidate `[data-action="open-search"]` в `#hMobileMenuBtn`. Поэтому это не поздняя browser focus fixup и не случайная потеря в `body`; Home записывает другой opener identity до регистрации overlay. Активный row сужается до mobile hero-opener manifestation, без нового ID.

## 4. Product PR #2205 — соседний, но не закрывающий owner

Открытый Product #2205, head `838fb9768c0432924e4e79a50827b98ab13d7be6`, убирает безусловность первого delayed retry в `OverlayRuntime.restoreOverlayOpener()`. Это полезно для сценария «после close пользователь уже намеренно перевёл фокус», но PR не меняет `stableOpener()` и не исправляет retained mobile target `#hMobileMenuBtn`.

Его exact-head matrix также не green: среди reported failures находятся `guard`, `Home Chromium WebKit contract` и `Chromium WebKit reader semantic projection`. Параллельный Product repair не создавался; #2205 не записан как closure owner для `GBS-HOME-SEARCH-FOCUS-RESTORE`.

## 5. Browser health

Оба чистых профиля: Axe 0, broken images 0, page errors 0. LCP/CLS: desktop 136 ms / 0; mobile 144 ms / 0. Локальный static preview не содержал `/pagefind/pagefind.js`, а sandbox блокировал часть Yandex delivery; эти delivery diagnostics отфильтрованы и не выданы за Product defect. Search overlay, focus entry и все три close actions при этом исполнялись штатно.

## 6. Static structural/link census 108 документов

Parser-level census final HTML дал:

- 15 249 внутренних и 1 045 внешних link occurrences;
- 0 duplicate IDs;
- 0 отсутствующих внутренних route/file targets;
- 0 отсутствующих cross-document или same-document fragment targets;
- 0 broken literal `aria-labelledby` / `aria-describedby` / `aria-controls` / `aria-owns` / `aria-activedescendant` references;
- 0 broken `<label for>` references;
- 0 пустых или `javascript:` href;
- 416 `target="_blank"`, все 416 содержат `noopener`.

Это только contract существования target, не доказательство поведения перехода. Поэтому static result не подменяет native-click evidence и не переоткрывает уже закрытую document-navigation lane.

Восемь static nested-interactive occurrences — один Gill I и семь Krajne rich-footnote links внутри marker-button — полностью совпадают с активным `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL`; отдельный structural row не создаётся. У 351 `<button>` отсутствует explicit `type`, но final corpus содержит 0 `<form>`, поэтому текущего implicit-submit side effect нет. Это не принято как defect без формы/поведения; future form-safety можно решать authoring guard, а не 351 point fixes.

## 7. Disposition

1. `GBS-HOME-SEARCH-FOCUS-RESTORE` остаётся активным, но сужается: desktop fixed-current, mobile hero opener 3/3 close methods всё ещё возвращает фокус в menu button.
2. Product #2205 — adjacent delayed-retry work, не владелец retained mobile identity и не green exact-head closure.
3. Corpus-wide link/ID/ARIA target integrity чиста; найденные восемь nesting occurrences reconciled с существующим footnote owner.
4. Новых work units нет. Арифметика остаётся **47 direct + 8 improvements + 0 residuals + 23 systems = 78**.
