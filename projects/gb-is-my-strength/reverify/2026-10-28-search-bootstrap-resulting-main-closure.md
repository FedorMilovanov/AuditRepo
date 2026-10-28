# Resulting main: closure shared search bootstrap — 2026-10-28

## 1. Якорь и решение

Проверен Product main `90a65c056640e2d655c3dea96498290283dde238`, merge Product #2203, с exact PR head `4c36f1d6d89a75491ac7ae22548bb56a8fee2fd0`. Канонический `npm run strangler:build:production-like` прошёл и выпустил 108 HTML-документов. Product checkout не изменялся.

Disposition: **`SYS-SEARCH-LAZY-BOOTSTRAP-OWNERSHIP` → FIXED-CURRENT**. Shared owner, исходное HardTexts first-touch проявление, cold/warm acquisition, editor boundary и exact-head CI подтверждены независимо. Активная системная арифметика уменьшается 23→22, total 78→77.

Машинное свидетельство: `evidence/2026-10-28-search-bootstrap-resulting-main-closure.jsonl`. Скриншоты и полные browser outputs оставлены вне Git в `/tmp/wave7`.

## 2. Source owner действительно консолидирован

До repair 18 Astro components и MobileChrome независимо писали boot/loading/pending state. На resulting main поиск по `src/**/*.astro` находит `__gbSearchBootRequested`, `__gbSearchLoading` и `__gbSearchOpenAfterLoad` только у `ReaderPreferencesHead.astro`. Остальные ссылки на `search.js` являются declarative source/asset consumers, а не конкурирующими state writers.

Текущие executable guards:

- `node scripts/app-search-surface-source-contract.mjs` — **127/127 PASS**;
- `node scripts/search-loader-retry-contract-test.js` — **PASS**.

HardTexts больше не запускает двухстадийный competing loader на generic touch. Первый touch search opener проходит через shared bootstrap; отдельный preload остаётся сетевой подсказкой, а не вторым владельцем состояния.

## 3. Mobile first-touch и warm reuse

В Chromium 390×844 `isMobile`, touch, Dark, reduced motion проверены четыре shell family:

- `/hard-texts/` — MobileChrome search после реального wheel reveal;
- `/articles/` — MobileChrome search после реального wheel reveal;
- `/pastor-series/` — header search;
- `/` — hero search.

В каждой свежей browser context до действия `ready=false`, `pending=false`, `loading=false`. Первый trusted tap:

- открыл `.cp-backdrop.is-open` — 4/4;
- установил `GBSearch.__ready=true` — 4/4;
- очистил pending/loading — 4/4;
- передал фокус в `.cp-input` с именем «Поиск» — 4/4;
- выполнил ровно один request `search.js` — 4/4.

После Escape повторный trusted tap открыл тот же runtime без второго request: warm reopen 4/4, focus 4/4, pending=false 4/4. Историческое HardTexts состояние «первый tap оставляет non-ready stub, второй открывает» не воспроизводится.

## 4. Desktop shortcut и editor boundary

На тех же четырёх routes в desktop 1440×900 первый `Ctrl+K` и повторный `Ctrl+K` после Escape дали cold/warm open 8/8, ready 8/8, pending=false 8/8, точный input focus 8/8 и один runtime request на context.

Отдельно на `/rodosloviye/` desktop и mobile нативно активирован видимый genealogy input «Поиск по имени», введено «Иосиф» и нажато `Ctrl+K`. Overlay не открылся 2/2; input сохранил фокус и значение 2/2. После native click вне editable control тот же shortcut открыл search и сфокусировал search input 2/2. Значит, консолидация не ослабила editor guard и не блокирует canonical shortcut вне редактора.

## 5. Health и Axe reconciliation

Десять целевых loads: broken images 0, page errors 0, Product console errors 0. Максимальные LCP 428 ms и CLS 0.036269. Yandex sandbox egress и отсутствие Pagefind artifact у простого static preview отфильтрованы как delivery boundary; manifest fallback позволил квалифицировать сам bootstrap, focus и reuse без объявления delivery ошибкой Product.

Axe открытой palette повторяет независимые residual owner classes:

- mobile: `color-contrast` 9 и `label-content-name-mismatch` 7 на route;
- desktop: `color-contrast` 11 и `label-content-name-mismatch` 5 на route.

Они принадлежат активным `GBS-TEXT-CONTRAST-RESIDUAL-BATCH` и `GBS-CHROME-LABEL-IN-NAME-MISMATCH`; это не acquisition/pending regression и не причина удерживать закрываемый bootstrap owner. Новый ID не создаётся.

## 6. Exact-head CI

На merge head `90a65c0…` GitHub сообщает 58 check runs: 38 success, 20 intentional skipped, 0 failure, 0 pending. В частности, Chromium/WebKit cold-bootstrap contract, Search Modal, SearchAction, shared-files guard, production-like candidate, public surfaces и runtime interactive audit завершены успешно.

## 7. Итог

Closure contract выполнен:

1. один state writer и negative writer guard;
2. first trusted HardTexts tap открывает готовую palette;
3. cold/warm pointer/touch/shortcut paths не дублируют runtime request;
4. pending/loading очищаются;
5. editor shortcut boundary сохранён;
6. Chromium evidence и exact-head Chromium/WebKit CI зелёные;
7. residual Axe findings reconciled с другими активными owners.

`SYS-SEARCH-LAZY-BOOTSTRAP-OWNERSHIP` удаляется из активной матрицы. Новая арифметика: **47 direct + 8 improvements + 0 residuals + 22 systems = 77 active work units**.
