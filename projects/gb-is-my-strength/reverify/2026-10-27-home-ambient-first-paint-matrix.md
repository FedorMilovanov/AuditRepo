# Home ambient first-paint matrix — 2026-10-27

## Решение

На exact Product anchor `21dcfdd9f9018607a708c5118383e287ec1a3fed` завершена closure-oriented матрица для `GBS-HOME-AMBIENT-FIRST-PAINT-CLS`.

108 изолированных browser runs подтверждают, что дефект:

- присутствует на 1480, 1600 и 1920px;
- не зависит от Light/Dark или motion preference;
- сохраняется с cold, warm и failed fonts;
- имеет два уже известных owner-компонента, а не новый третий дефект.

Главная причинная граница уточнена. Home-owned residual возникает ещё во время HTML parsing: `.home-content` впервые красится, когда в нём только 4 из 20 верхнеуровневых children, затем растёт примерно с 1,005px до 7,533px. Абсолютные marginalia с процентным `top` немедленно пересчитываются относительно растущего containing block и перемещаются на сотни пикселей. Это не hydration, animation или поздний пользовательский state.

Дополнительно native focus sweep всех 32 marginalia обнаружил уже существующий class-level owner `GBS-CHROME-LABEL-IN-NAME-MISMATCH`: при focus-visible Axe выдаёт serious `label-content-name-mismatch` на 32/32 phrases. Новая строка не нужна.

Машинное резюме: `evidence/2026-10-27-home-ambient-first-paint-matrix.jsonl`.

## 1. Baseline и scope

- Product `main`: `21dcfdd9f9018607a708c5118383e287ec1a3fed`.
- `npm ci`: 490 packages; известная moderate advisory, зависимости не менялись.
- `npm run strangler:build:production-like`: PASS.
- Astro check: 625 files, 0 errors, 0 warnings, 6 hints.
- Build: 104 Astro pages, 108 финальных HTML.
- Chromium 153; service workers отключены; external egress не участвовал в выводах.

Полная матрица:

- widths: 1480, 1600, 1920;
- schemes: Light, Dark;
- motion: normal, reduced;
- font delivery: cold, warm reload, failed/aborted;
- три изолированных repeats;
- **108 runs**.

Каждый run фиксировал PerformanceObserver CLS/LCP и shift sources, timeline высоты `.home-content`, geometry marginalia, scheme/motion identity, broken images, page/console errors и viewport screenshot для первого repeat профиля.

## 2. CLS distribution

| Font state | Runs | Median CLS | Min–max | CLS ≥0.1 | CLS ≥0.25 |
|---|---:|---:|---:|---:|---:|
| cold | 36 | 0.715086 | 0–1.207319 | 33/36 | 32/36 |
| warm reload | 36 | 0.765374 | 0.228919–1.101068 | 36/36 | 35/36 |
| failed | 36 | 0.259143 | 0.162735–0.425009 | 36/36 | 21/36 |

Три low/zero cold records являются timing-sensitive случаями, когда промежуточная геометрия не попала в отдельный painted frame. Они не опровергают дефект: все 36 warm reloads и все 36 failed-font controls остаются выше 0.1.

Warm cache не является исправлением. После настоящего reload его median CLS даже не ниже cold median. Поэтому closure нельзя связывать с cache priming, `document.fonts.ready` или задержкой.

## 3. Width, scheme и motion boundaries

Median CLS по width:

| Width | Cold | Warm | Failed |
|---:|---:|---:|---:|
| 1480 | 0.741999 | 0.790379 | 0.236969 |
| 1600 | 0.772358 | 0.765724 | 0.250572 |
| 1920 | 0.654051 | 0.705618 | 0.314473 |

Cold medians по scheme/motion:

- Light/normal: 0.635259;
- Light/reduced: 0.649416;
- Dark/normal: 0.865014;
- Dark/reduced: 0.771577.

Failed-font medians:

- Light/normal: 0.232124;
- Light/reduced: 0.225756;
- Dark/normal: 0.308618;
- Dark/reduced: 0.312050.

Reduced motion не устраняет shift, потому что источник — layout. Dark усиливает часть результатов, но дефект воспроизводится во всех четырёх scheme/motion quadrants.

## 4. Causal parser timeline

Отдельный 1600×1000 Dark/reduce probe зафиксировал readyState, child count и containing-block height до settlement.

### Normal font delivery

| Time | readyState | `.home-content` children | Height |
|---:|---|---:|---:|
| 201ms | loading | 4 | 1,005.1px |
| 318ms | loading | 18 | 6,844.7px |
| 582ms | interactive | 20 | 7,532.7px |
| 595ms | complete | 20 | 7,532.7px |

Navigation timing:

- response end: 10.6ms;
- DOM interactive: 383.3ms;
- DOMContentLoaded end: 527.4ms;
- load: 586.6ms.

### Failed fonts

| Time | readyState | `.home-content` children | Height |
|---:|---|---:|---:|
| 194ms | loading | 4 | 1,089.1px |
| 340ms | loading | 18 | 7,237.7px |
| 517ms | interactive | 20 | 7,925.8px |
| 625ms | complete | 20 | 7,925.8px |

HTML response уже получен, но parser продолжает добавлять статические children внутри открытого `.home-content`. Первый paint возможен до закрытия container. Следовательно, percentage `top` у `.h-ambient-word` меняет физический y при каждом росте containing block.

Representative normal run:

- container: 1,005.1 → 5,834.1 → 7,532.7px;
- first Greek phrase: y=41.7 → 242.1 → 312.6px;
- second Hebrew phrase: y=80.4 → 466.7 → 602.6px;
- third phrase: y=140.7 → 816.8 → 1,054.6px.

Failed fonts сохраняют ту же причинность:

- container: 1,089.1 → 6,105.1 → 7,925.8px;
- first phrase: y=45.2 → 253.4 → 328.9px.

Это painted PerformanceObserver evidence, а не settled-DOM inference.

## 5. Ownership split

### Home-owned residual

Во всех 36 failed-font runs CLS остаётся 0.162735–0.425009. Shift sources во всех 36 включают `.h-ambient-word__text`; representative failed run состоит из marginalia shifts 0.259511 и 0.022777.

Root cause: абсолютный ambient layer использует процентные вертикальные координаты внутри progressively parsed `.home-content` полного документа.

Closure требует stable containing geometry до первого paint. Возможные owner-level направления:

- отдельный заранее размеренный ambient coordinate space;
- вертикальные позиции, не зависящие от полной высоты ещё парсящегося документа;
- детерминированная непокрашенность до structural readiness.

Timeout, font wait и cache priming root cause не исправляют.

### Font-owned component

Normal/warm records дополнительно включают `.h-hero-search-wrap`, hero `::after`, title и sacred-word sources. При failed fonts эти источники почти полностью исчезают, а median падает примерно с 0.72–0.77 до 0.26.

Эта часть остаётся у `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`. Новый общий Home CLS owner не должен поглощать font metric mismatch.

## 6. Native marginalia interaction

В каждом из 36 profile combinations первый ambient control достигнут настоящим `Tab`, затем проверен настоящими клавишами Enter и Escape:

- focus reached: 36/36;
- Enter opens and sets `aria-expanded=true`: 36/36;
- Escape closes and restores `aria-expanded=false`: 36/36.

Отдельный native sweep всех 32 phrases при 1600 Dark/reduce:

- Tab focus: 32/32;
- tooltip и source становятся painted после transition: 32/32;
- Enter open: 32/32;
- Escape close: 32/32;
- tooltip остаётся внутри viewport: 32/32.

Loaded state не использовался как proxy: проверены active element, rendered opacity/visibility, geometry и state attributes.

Один self-contract diagnostic возник, когда matrix harness одновременно фокусировал phrase во время встроенного contract sweep. В изолированном полном 32-phrase native run он не повторился; это harness contention, а не Product finding. Внешний blocked-resource noise также не классифицирован как дефект.

## 7. Focus-visible label-in-name extension

Без focus ambient text имеет почти прозрачную decorative presentation, и базовый Axe run не выдаёт finding. После native Tab focused phrase становится явно видимой; Axe на каждом focused control даёт:

- `label-content-name-mismatch`;
- impact: serious;
- 32/32 phrases.

Пример visible descendants:

- `ἐν ἀρχῇ ἦν ὁ λόγος`;
- `В начале было Слово`;
- `Ин. 1:1`.

`aria-label` вставляет между ними дополнительные префиксы `Перевод:` и `Источник:`, поэтому последовательность painted label не содержится в accessible name согласно WCAG 2.5.3 matching rule.

Это не новая строка. `GBS-CHROME-LABEL-IN-NAME-MISMATCH` уже является class-level owner ручных `aria-label`, включая Home controls. Его scope расширяется ambient focus owner и требует focus-state Axe, а не только settled unfocused scan.

## 8. Additional controls

- Page errors: 0/108.
- Completed broken images: 0/108.
- Horizontal document overflow: 0/108.
- Scheme identity mismatch: 0/108.
- Motion identity mismatch: 0/108.
- 36 profile screenshots сохранены вне Git и просмотрены в Light/Dark, normal/reduce и font states.
- LCP observer был включён во всех runs; median ненулевого LCP: cold 980ms, warm 768ms, failed 1,036ms. В 10 timing-sensitive runs entry не появился в capture window, поэтому отдельный performance finding не admitted.

## 9. Closure additions

### `GBS-HOME-AMBIENT-FIRST-PAINT-CLS`

Resulting-main proof должен требовать:

- 1480/1600/1920;
- Light/Dark;
- normal/reduce;
- cold/warm/failed fonts;
- parser-time first rect = settled rect для всех 32 phrases;
- stable ambient coordinate space до закрытия `.home-content`;
- сохранение native Tab/Enter/Escape и viewport-safe tooltip geometry;
- без timeout, opacity-only delay и font readiness workaround.

### `GBS-CHROME-LABEL-IN-NAME-MISMATCH`

Добавить focus-visible ambient fixture:

- все 32 phrases;
- painted original/translation/source входят в accessible name в том же порядке;
- Axe `label-content-name-mismatch` = 0 после native focus;
- translation/source semantics и disclosure state не теряются.

## 10. Матрица

Новых строк нет. Active arithmetic остаётся:

- 46 direct defects;
- 8 verified improvements;
- 22 system lanes;
- **76 active work units**.

Product не изменялся.
