# Широкая волна 9 — interactive semantic output и keyboard-scroll regions

**Дата:** 2026-10-28
**Product resulting main:** `d056a19cfabe84dc2dbc59fc37ff4b03288917f1`
**Режим:** read-only LANE/SYSTEM reverify; Product не изменялся
**Строки:** quiz rich markup, chrome label-in-name, Antisovetov nested map triggers, Krajne heart back contrast, shared reading-table keyboard contract, outline/landmark containment.

## 1. Точная база и владельцы

Точный Product main и open-owner state перепроверены после волны: `d056a19c…`; единственный открытый PR #2211 изменяет genealogy v2 data/config и не пересекается с пятью владельцами. Production-like `dist` от exact HEAD уже прошёл validate/build в волнах 7–8 и содержит 108 HTML. Product checkout после всех probes clean.

Browser: Chromium 153 через `@sparticuz/chromium` + bundled AL2023 NSS, desktop/mobile, Light/Dark, reduced/normal motion; только нативные click/Tab/Enter/Escape. PNG и полный 66-record stream оставлены вне Git. Канонический `interactive-audit` прошёл 56 page, 10 series, 6 quiz, 7 chrome-label и 7 header-host owners без содержательных findings; его exit 1 образован только 42 одинаковыми sandbox `ERR_CONNECTION_CLOSED`, а не Product assertions.

## 2. `GBS-QUIZ-LITERAL-MARKUP` — `FIXED-CURRENT`

Вместо прежней выборки проведён полный final-corpus crawl всех quiz hosts:

- **23 routes**;
- **153 questions**, каждая пройдена настоящими click: launch → first option → next/result;
- **10 rich-payload routes**, 71 строк с `<em>/<span>`-семантикой;
- **0 literal tags** в question/options/feedback/explanations на всех 153 шагах;
- 280 реально созданных rich descendants/feedback emphasis nodes;
- page errors 0.

Текущий `renderQuizRich()` использует escape-first allowlist для attribute-free `em/strong/b/i/u/span`; опасная/атрибутированная разметка не передаётся как raw HTML. `article-quiz-native-parity-test.mjs` проходит. Поэтому исходный дефект `textContent` → literal `<em>/<span>` больше не проявляется, а intended emphasis сохранён. Строка удаляется.

No-JS boundary: обе проверенные статьи сохраняют полный основной текст (Krajne 65 571, Antisovetov 111 742 символа), но quiz host остаётся пустым без JS. Это существующая progressive-enhancement граница интерактивного теста, не проявление literal-markup row и не заявляется как no-JS quiz closure.

## 3. `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS` — `FIXED-CURRENT`

Current DOM имеет по одному отдельному `.map-trigger` для `data-tip=19` и `43`; Axe `nested-interactive` — 0. Нативный pointer для 19 и focus→Enter для 43 открывают popup/dialog, устанавливают `aria-expanded=true`, затем Escape закрывает поверхность. Оба distinct record сохранены, удаления содержимого нет. Исходная вложенность устранена; строка удаляется. Отдельный `SYS-STRATEGIC-MAP-DIALOG-FOCUS-ENTRY` с mobile zero-height reach остаётся и не поглощается.

## 4. `GBS-KRAJNE-HEART-FLIP-BACK-LIGHT-UNREADABLE` — `FIXED-CURRENT`

Heart card перевёрнут настоящим pointer click в четырёх профилях: 1280/390 × Light/Dark. Во всех 4/4 `.flipped=true`; back face имеет собственную тёмную поверхность:

- Light: `rgb(21,16,10)`;
- Dark: `rgb(17,14,7)`;
- body/closing text сохраняет светлую ink palette;
- Axe не находит contrast nodes внутри heart back.

Старое белое-on-white состояние больше невозможно из-за явного background owner. Два Dark desktop contrast nodes относятся к уже действующему mobile bottom-ToC owner и не дублируются. Screenshots сохранены вне Git. Строка удаляется.

Официальные print-card контракты после подключения Chromium дошли до внешнего `pdftotext`, которого в sandbox нет; PDF text extraction **NOT DONE: missing executable**, не Product red. Этот direct row закрывается только по screen Light/Dark back-face criterion. Native print-media sample не используется как доказательство обеих PDF faces.

## 5. `GBS-CHROME-LABEL-IN-NAME-MISMATCH` — сужено, остаётся активным

Прежний исторический список десятков route-specific owners больше не является текущей границей. Fresh native focus/settled Axe подтвердил четыре семейства:

1. Home 1600px ambient marginalia: 33 focus-reachable mismatch events (32 phrases + sacred-name control); обычный settled baseline их не видит, потому что state зависит от native focus;
2. Russian Baptism app home: 1 baseline + 1 native-focus mismatch — visible «Русский баптизм / Карта истории» против name «Перейти на главную»;
3. Nagornaya TTS speed: `1×` против name «Скорость» на desktop/mobile;
4. mobile Highlights FAB: visible counter `0` против name «Мои цитаты».

Shared `.h-nav-logo` guard и repaired historical owners остаются зелёными; `interactive-audit` подтверждает 7/7 source owners. Closure должна покрыть settled Axe **и** native full-focus/wide-home состояния, а не только статический DOM.

## 6. `SYS-READING-TABLE-KEYBOARD-SCROLL` — сужено, остаётся активным

Полный current final-corpus candidate scan: 17 table routes × 390/1440. На 390px восемь routes содержат **21 фактический horizontal scroll region**:

- Gill I: 1;
- Gill II: 2;
- Gill III: 1;
- Gill Context: 7;
- Gill Spravochnik: 5;
- Nagornaya I: 3;
- Nagornaya III: 1;
- Nagornaya IV: 1.

Axe `scrollable-region-focusable`: **20/21**. Единственный Axe-clean owner — repaired Gill I table: named, `tabindex=0`, focus style and Arrow interception contract. Но нативный 700-Tab crawl не достигает его из-за более ранней tooltip focus topology; программный `focus()` в permanent contract не доказывает forward reach. На desktop 1440 этот же table уже не overflow, но сохраняет `tabindex=0`: conditional/reversible stop всё ещё не выполнен.

Native mobile traversal естественно достиг только 6/21 regions на двух routes (Gill III и Gill Spravochnik). Остальные Gill II/context/Nagornaya owners сохраняют unnamed/non-contract regions и 20 serious Axe nodes. Значит, W47 — полезная локальная repair, но не универсальный owner; строка остаётся системной с точной current границей.

## 7. `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT` — сужено, остаётся активным

Fresh all-108-page static census дал **22 heading skips на 8 routes** и **5 landmark anomalies на 5 routes**. Аномалии не распределены по всему corpus, а сосредоточены в Nagornaya pilots:

- II: `H1→H3` 1;
- III: `H1→H3` 1;
- IV: `H1→H4` 1;
- VI: `H2→H4` 1;
- VII: `H2→H4` 2;
- VIII: `H1→H3` 1;
- IX: `H1→H4` 1;
- «По ту сторону»: `H1→H3` 14.

Landmark topology: Nagornaya II имеет 0 `<main>` и единственный `<article>` вне landmark; VII/IX имеют по 2 `<main>`; IV/VI имеют второй `<main>` внутри `<footer>`. Во всех 108 routes `h1=1`, то есть прежнюю широкую формулировку можно сузить до этих восьми outline/five landmark routes, но закрывать строку нельзя.

## 8. Reconciliation

Удалены как `FIXED-CURRENT` три direct rows:

- `GBS-QUIZ-LITERAL-MARKUP`;
- `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS`;
- `GBS-KRAJNE-HEART-FLIP-BACK-LIGHT-UNREADABLE`.

Сужены без новых строк:

- `GBS-CHROME-LABEL-IN-NAME-MISMATCH` — четыре current owner-family;
- `SYS-READING-TABLE-KEYBOARD-SCROLL` — 21 real mobile region, 20 Axe failures, repaired Gill I retained as control.

Арифметика: **69 → 66 active units**, direct **43 → 40**; improvements/residual/systems остаются **7/1/18**.
