# Язык иноязычных фрагментов — current head, 2026-10-27

## Решение

На Product `21dcfdd9f9018607a708c5118383e287ec1a3fed` принят один системный владелец: `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`.

Production-like корпус содержит сотни греческих и еврейских фраз, которые программно остаются русскими из-за унаследованного `<html lang="ru">`. При этом другие поверхности корректно используют `lang="grc"`/`lang="he"`. Это не дефект отдельных 39 маршрутов, а отсутствующий единый authoring→projection contract для WCAG 3.1.2 Language of Parts.

Активная арифметика: **77→78**; system lanes **22→23**. Product не изменён.

## Метод

1. Канонический `npm run strangler:build:production-like`: 104 Astro pages, 108 итоговых HTML, 0 errors, 6 известных hints.
2. Для каждого final HTML разобраны реальные Text nodes вне `script`, `style`, `template`, `svg`, `noscript`.
3. Unicode Hebrew и Greek/Greek Extended сопоставлены с ближайшим унаследованным `lang`.
4. Отдельно выделен консервативный high-confidence набор: не одиночный термин, а минимум два same-script run в одном неразмеченном Text node.
5. Browser witnesses выполнены в Chromium 153 на desktop/mobile Dark, `isMobile/hasTouch` где применимо, `reducedMotion: reduce`; CDP screenshots и raw оставлены вне Git.

## Census

| Категория | Без корректного `lang` | Маршруты | Корректно размечено | Маршруты-контроли |
|---|---:|---:|---:|---:|
| Greek/Greek Extended | 253 | 34 | 261 | 26 |
| Hebrew | 36 | 10 | 115 | 18 |
| **Всего missing occurrences** | **289** | **39 unique routes** | **376** | — |

Всего в корпусе найдено 659 Text nodes с одной из двух письменностей. Числа Greek/Hebrew — occurrences, а не «289 отдельных багов».

Консервативный набор многочленных фраз: **109 occurrences на 20 маршрутах** — 101 Greek и 8 Hebrew. Поэтому admission не зависит от спорного вопроса, нужно ли отдельно маркировать каждую одиночную лексему/технический термин.

## Нативные browser witnesses

### Greek

`/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/` публикует, среди прочего, `τούτοις` и многочленные греческие строки. Ближайший язык — `ru`; локального `lang="grc"`/`el` нет. Фраза покрашена и присутствует как CDP AX `StaticText` на 1440×900 и 390×844.

### Hebrew

`/articles/krajne-li-isporcheno-serdce/` визуально публикует `שָׁמִיר` внутри русского абзаца. Ближайший язык — `ru`; локального `lang="he"` нет. Painted Range составляет 482×109.39 px desktop и 307.75×147.97 px mobile; полный AX tree содержит Hebrew `InlineTextBox`, но DOM не даёт программе правильного языка.

Screenshots подтверждают, что речь о читательском тексте, а не о dormant data или скрытом шаблоне.

## Почему это системный owner

Корпус одновременно содержит **376 корректно размеченных occurrences** на десятках маршрутов: Home ambient phrases и отдельные authored spans уже применяют `lang="he"`/`lang="grc"`. Следовательно:

- браузер и шрифты способны представить контракт;
- проблема не в невозможности определить язык;
- разметка зависит от конкретного ручного source owner;
- MDX/Astro/final publication gates не обеспечивают единообразие.

Разносить 289 occurrences по маршрутам нельзя. Нужен один источник правил для authored foreign phrases и final-output guard.

## Gate gap и health

Прошли, но не увидели проблему:

- `article:qa`: 174 files, 0 errors, 0 warnings;
- `readable-audit`: PASS;
- `content:parity`: 67/67 strict-native route contracts;
- full Axe WCAG A/AA: 0 в 4/4 targeted profiles.

Axe проверяет наличие/валидность уже указанного языка, но не может вывести язык произвольной фразы по письменности. Это объясняет green, но не отменяет WCAG 3.1.2.

Browser health: broken images 0, page errors 0. LCP составил 520–628 ms на Greek route и 2092–3280 ms на Krajne; CLS зафиксирован в evidence без присвоения этой находке. Единственный request failure — заблокированный `mc.yandex.ru`, отфильтрован как sandbox egress.

## Closure boundary

1. Ввести authoring primitive для Greek/Hebrew phrase с обязательным `lang` (`grc` для древнегреческого, `he` для иврита; `el` только когда редакционно верно).
2. Покрыть source и final HTML Unicode-aware guard, который проверяет ближайший эффективный язык.
3. Иметь reviewable исключения для имён, общепринятых заимствований и действительно неопределимых терминов; не разрешать весь `<code>` или весь маршрут.
4. Сначала закрыть 109 многочленных high-confidence occurrences, затем вручную квалифицировать одиночные лексемы.
5. Resulting-main browser/AX proof на Greek/Hebrew mixed paragraphs, standalone phrases и уже здоровых Home controls; не менять богословский текст и транслитерацию.
6. Отдельно решить TTS policy; эта строка не утверждает, что простое добавление `lang` автоматически переключит Product voice engine.

Открытые Product PR не владеют этим общим authoring/final-output контрактом; #2202 касается соседних Gill/runtime файлов, но не закрывает корпус.

## Evidence

`evidence/2026-10-27-language-of-parts-current-head.jsonl` — 8 компактных строк; raw census и PNG вне Git.
