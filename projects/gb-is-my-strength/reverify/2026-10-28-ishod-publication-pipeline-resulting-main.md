# Ishod publication pipeline: resulting-main reconciliation — 2026-10-28

## 1. Якорь и объём большой волны

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`. Canonical production-like build прошёл с 0 Astro errors и выпустил 108 финальных HTML-документов. Открытый Product #2208 меняет только audit addendum и не пересекается с Ishod data/components/runtime.

Одна большая bounded-волна повторно квалифицирует три независимых текущих owner-а одного publication pipeline:

1. `GBS-ISHOD-AARON-NAME-MISSPELLING`;
2. `GBS-ISHOD-NOJS-FALLBACK-OWNER-OCCLUSION`;
3. `GBS-ISHOD-STATIC-PROJECTION-RICH-BLOCK-FLATTENING`.

Product не изменялся. Машинное свидетельство: `evidence/2026-10-28-ishod-publication-pipeline-resulting-main.jsonl`; восемь browser screenshots и полные outputs оставлены вне Git в `/tmp/wave13`.

## 2. Canonical name data всё ещё ошибочны

`Аварон` остаётся в двух вручную синхронизированных source owners: `karty/ishod/route.json` и research copy. Production-like static story projection содержит `Кадеш · Аварон · Финеес` ровно один раз.

В screen mode full CDP AX tree содержит имя в доступной static projection. В Chromium print оно реально painted:

- desktop: `1258×21.7px` на y=533.5;
- mobile: `368×43.4px` на y=937.6.

Результат одинаков в Light/Dark. Это подтверждает текущий reader/AT/print output, а не только наличие JSON. Row остаётся `OPEN-CURRENT`; исправление по-прежнему должно идти через canonical route data и protected-name fixture, а не generated HTML.

## 3. No-JS: полный маршрут существует, но недоступен sighted reader

Проверены disabled-JS desktop/mobile × Light/Dark — четыре профиля. Shared fallback действительно раскрывает полный `[data-map-static-projection]`, скрывает interactive stage и не создаёт horizontal overflow:

- desktop projection: `760×8126.4px`;
- mobile projection: `358×15373.5px`;
- stage: `display:none`;
- broken images, console errors и page errors: 0.

Одновременно `.pihahiroth-noscript` остаётся fixed overlay:

- desktop `1216×836px`;
- mobile `326×780px`;
- overlay owner: `position:fixed`, максимальный z-index из route head.

Нативный document scroll проверен в начале, середине и конце каждого профиля: **12/12 center hit-tests** возвращают overlay, **0/12** — full projection. Значит, длинная текстовая карта движется под постоянной карточкой и не становится зрительно доступной ни в одной части маршрута. Light/Dark не меняют owner collision.

Row остаётся `OPEN-CURRENT`. Нельзя закрыть его снижением z-index без устранения двух конкурирующих no-JS narratives.

## 4. Rich dispute projection всё ещё теряет структуру

Current static projector по-прежнему склеивает sibling blocks rich HTML в один paragraph. В финальной projection остаются точные adjacent artifacts:

- Rameses: `Средняя Поздняя` — 1;
- Kadesh: `Средняя Кочевая` — 1;
- соответствующие dispute title/position/confidence/note boundaries отсутствуют как отдельная semantic projection.

Full CDP AX tree в screen mode содержит malformed strings. В print обе строки painted во всех четырёх профилях:

- desktop Rameses `1280×65.1px`, Kadesh `1280×43.4px`;
- mobile Rameses `390×173.6px`, Kadesh `390×151.9px`.

Axe во всех JS-enabled Light/Dark desktop/mobile profiles — 0; это ожидаемо, потому что потеря authored block boundaries не является формальной Axe-role ошибкой. Broken images, overflow, console/page errors — 0.

Row остаётся `OPEN-CURRENT`. Closure требует typed safe projection либо structured dispute data с source→interactive→print→AX parity; punctuation-only patch не закрывает projector root.

## 5. Почему зелёные gates не закрывают cluster

На exact main проходят:

- `astro:audit:ishod`;
- `maps:validate` и publication status;
- `readable-audit`;
- `article-qa`.

`astro:audit:ishod` отдельно доказывает наличие static projection, no-JS surface и Pihahiroth fallback, но не проверяет их композицию в одном disabled-JS viewport. Map validation проверяет shape, а не protected names или rich semantic parity. Readable/article gates не владеют map JSON и print/AT block boundaries.

Нужна одна системная защита Ishod publication pipeline, но без слияния трёх defect IDs: composed no-JS browser contract, structured projection parity и narrow protected-name fixture.

## 6. Disposition

1. Все три Ishod rows подтверждены как `OPEN-CURRENT` на exact main.
2. Новых manifestations или work units не принято; scope не расширен за доказанные source/print/AX/no-JS boundaries.
3. Product #2208 не является owner; Product mutation в этой волне не выполнялась.
4. Арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
