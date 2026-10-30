# Широкая волна 44: route delivery, requested matrix и фактически нарисованные шрифты

Дата: **2026-10-30**  
Product anchor: `89bab745790a6a5c1cddf86fd65cb0c692b049d9`.  
Browser: production-like `dist`, Chromium 153, native desktop Light 1440×1000 и mobile Dark 390×844; reduced motion, явные viewport/scheme/isMobile.

## Итог

Проблема шире неполного набора файлов. Есть три разных проявления одного действующего font-matrix owner:

1. requested family/weight/style/script не имеет точного физического face;
2. часть маршрутов preload-ит font bytes, но вообще не подключает `@font-face` registry;
3. computed CSS family скрывает как mixed custom/platform painting, так и silent substitution одного веса другим.

Новая строка не добавляется: это текущая причинная область `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`.

## 1. Статический route census

Production-like output содержит **115 HTML index documents**. Из них:

- 107 подключают `fonts/fonts.css`;
- пять preload-ят local WOFF2, но не подключают registry и не содержат inline `@font-face`;
- одна дополнительная app surface содержит строку `Inter`, но без preload и без видимого direct-text computed custom-family use; она не включена в подтверждённый preload defect.

Подтверждённые preload-without-registry маршруты:

| Route | Preload files | Bytes |
|---|---:|---:|
| `/karty/` | 2 | 21 964 |
| `/karty/avraam/` | 1 | 9 604 |
| `/karty/ishod/` | 1 | 9 604 |
| `/konfessii/` | 1 | 11 480 |
| `/konfessii/russkij-baptizm/` | 1 | 9 604 |

Причина на `/karty/` видна в source owner: `KartyPageHead.astro` явно preload-ит Playfair/Source Sans 3 и подключает route/site CSS, но не `fonts.css`. Поэтому сеть получает bytes, однако browser не создаёт ни одного `FontFace`; `document.fonts` на маршруте пуст.

## 2. Полный requested-token census

На всех 115 маршрутах браузер собрал каждый видимый element с собственным direct Text node и custom family в computed stack: **28 410 nodes**. Для каждого сохранены family, computed weight/style, реальные scripts и route sample.

Строгое сопоставление с `@font-face` + `unicode-range` + физическими OS/2/cmap выявило **7 663 nodes** (27.0%), где нет точного face для хотя бы одного реально присутствующего script либо запрошенного weight/style. Это не утверждение, что весь такой node невидим: browser может смешать platform fallback или синтезировать/подменить face. Именно отсутствие точного контракта и является измеряемой границей.

| Family | Нет точного physical match, nodes | Затронуто routes |
|---|---:|---:|
| Lora | 3 586 | 102 |
| Source Sans 3 | 2 041 | 94 |
| Inter | 1 300 | 26 |
| Playfair Display | 267 | 34 |
| Noto Sans Greek | 265 | 26 |
| Cormorant Garamond | 128 | 18 |
| Noto Serif Hebrew | 76 | 15 |

Главные причины:

- Lora requests 700/800/900 и italic variants при физическом максимуме 600;
- Source Sans 3 requests 700–900, italic и Latin 600+, но имеет Cyrillic 400/500/600 normal и Latin 400 normal;
- Inter requests 680/700/740/750/760/800/820/900, italic и Latin, но имеет только Cyrillic 300–600 normal;
- Playfair и Cormorant не имеют Latin/punctuation subsets для mixed text; у Cormorant также нет requested 600/700;
- Greek terms вычисляются как italic при единственном normal Greek face;
- Hebrew terms вычисляются как 500 italic, а физически 400/500 binaries одинаковы и оба regular 400.

## 3. Painted-font proof, а не декларации

CDP `CSS.getPlatformFontsForNode` подтвердил:

- Home H1, declared Playfair 700: 17 custom Playfair glyphs и 4–5 DejaVu Serif glyphs;
- Enoch H1, declared Playfair 600: 26 custom `Playfair Display SemiBold` и 23–24 DejaVu Serif glyphs;
- ordinary article `strong`, requested Lora 700: все 25 glyphs рисует `Lora SemiBold`;
- Lawson bibliography label, requested Inter 700: все 9 glyphs рисует `Inter SemiBold`;
- Lawson H1 intentionally declares Georgia and in Linux harness paints 53–54 glyphs system `DejaVu Serif`; это platform fallback control, не требование self-host Georgia;
- ordinary article H1, requested Lora 600: 48–50 glyphs честно рисует custom `Lora SemiBold`.

Следовательно, `getComputedStyle().fontFamily`, успешный asset verifier и `document.fonts.ready` сами по себе не доказывают результат.

## 4. Route integration root на `/karty/`

В desktop Light и mobile Dark computed declarations обещают Playfair, Noto Serif Hebrew и Cormorant Garamond, но CDP показывает:

| Sample | Declared | Actual platform font |
|---|---|---|
| H1 «Библейские карты» | Playfair 700 | DejaVu Serif, 15–16 glyphs |
| Hebrew `מַפּוֹת` | Noto Serif Hebrew 500 | DejaVu Sans, 7 glyphs |
| description | Cormorant Garamond 400 | DejaVu Serif, 244–246 glyphs |
| numeric stat | Playfair 700 | DejaVu Serif, 1 glyph |

При этом route делает ровно два successful local font requests. Они являются preload waste: без registry ни один face не участвует в painting. Это не «плохой Linux»: browser не получил декларации, связывающей bytes с family.

## 5. Greek/Hebrew positive и negative controls

На обычной статье registry подключён. Усиленный non-empty script sample даёт:

- Greek `καρδία`, computed Noto Sans Greek 400 italic → custom physical `Noto Sans`, 6 glyphs;
- Hebrew `לֵב`, computed Noto Serif Hebrew 500 italic → custom physical `Noto Serif Hebrew`, 3 glyphs.

То есть scripts доставляются и рисуются локально там, где registry существует. Но style/weight остаются синтетическими/несоответствующими физической матрице. На `/karty/` тот же Hebrew class падает полностью в DejaVu. Это разделяет asset coverage и route integration.

## 6. Browser health controls

Пять репрезентативных routes × два профиля = 10 runs:

- HTTP 200: 10/10;
- external font responses: 0;
- attributable console errors: 0;
- page errors: 0;
- broken images: 0;
- WCAG A/AA Axe violations: 0;
- positive horizontal overflow: 0;
- LCP: 100–556 ms в локальном harness;
- CLS: 0–0.01499.

Скриншоты и raw runtime JSON оставлены вне Git. WebKit: `skipped: sandbox egress`; обязательное Chromium evidence получено. Зелёные Axe/health controls не опровергают font identity defect.

## 7. Closure boundary

Font contract должен строить route-aware requested matrix, а не только inventory:

1. final route действительно подключает registry до/вместе с preload;
2. preload URL соответствует объявленному face и реально используется critical above-the-fold text;
3. family/weight/style/script из painted direct text имеет owner-approved exact face или явную normalization/fallback policy;
4. CDP mixed-script fixture не распадается на platform-dependent families;
5. Karty/Confessions/map heads не могут снова preload-ить bytes без `FontFace` registration.

**Широкая волна 44 завершена.**
