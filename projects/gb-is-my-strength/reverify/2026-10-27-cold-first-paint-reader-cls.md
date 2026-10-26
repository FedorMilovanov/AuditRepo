# Cold first-paint reader CLS continuation — 2026-10-27

## Решение

Продолжение полного premium census на том же Product anchor `21dcfdd9f9018607a708c5118383e287ec1a3fed` обнаружило два системных first-paint проявления уже активных reader-layout owners:

1. при 1023px поздняя проекция reader measure заменяет первый full-width layout на 800px shell;
2. при 1024px legacy body reserve сначала сдвигает весь reader на 304px, после чего v16 override возвращает его к x=0.

Новых строк матрицы нет. Доказательство расширяет:

- `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`;
- `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`.

Одновременно сужена причинная интерпретация `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`: route-specific font CLS остаётся доказанным, но основная масса compact CLS сохраняется без font responses.

Машинное резюме: `evidence/2026-10-27-cold-first-paint-reader-cls.jsonl`.

## 1. Baseline и метод

- Product `main`: `21dcfdd9f9018607a708c5118383e287ec1a3fed`.
- Production-like build: 108 HTML, 625 checked files, 0 errors, 0 warnings, 6 hints.
- Chromium 153.
- Все 105 index routes получили отдельный cold browser process/context.
- External hosts блокировались и не участвовали в выводах.
- Service workers отключены.
- На каждом документе observer устанавливался до parsing и сохранял `layout-shift` value, timestamp, source node и previous/current rect.

Три route-wide прохода:

- 105 × 1023×900 Light/reduce;
- 105 × 1024×900 Light/reduce;
- 105 × 1023×900 Light/reduce с заблокированными font responses.

Итого 315 route/profile records, navigation errors 0.

## 2. Масштаб

### 1023px, обычные шрифты

- CLS ≥0.05: 64/105;
- CLS ≥0.10: 63/105;
- CLS ≥0.25: 9/105;
- median CLS: 0.109086.

### 1023px, fonts blocked

- CLS ≥0.10: 59/105;
- median CLS: 0.108993.

Следовательно, broad compact first-paint instability не является преимущественно font-swap эффектом.

### 1024px

- CLS ≥0.05: 48/105;
- CLS ≥0.10: 30/105;
- CLS ≥0.25: 22/105;
- median CLS: 0.043948.

19 routes зафиксировали один и тот же полный geometry transition `gbs2-world`: x=304, width=720 → x=0, width=1024.

## 3. 1023px: поздняя route-root measure projection

Head bootstrap `js/reader-preferences-head.js` синхронно задаёт на `<html>`:

- `data-reader-measure`;
- `--gb-reader-measure`;
- остальные shared reader tokens.

Но route CSS использует дополнительный локальный token:

```css
[data-gill-v16] .page-wrap {
  max-width: var(--gbs2-article-measure, none);
}
```

Синхронный head bootstrap не может записать его на ещё не распарсенный `[data-gill-v16]`. Позднее `js/reader-preferences.js::applyReaderRoots()` выполняет:

```js
element.style.setProperty('--gbs2-article-measure', measure);
```

До этого write shell может впервые покраситься с `max-width:none`; после write normal measure становится 50rem = 800px.

Высокосигнальная геометрия:

- `.page-wrap`: x=0, width=1023 → x=111.5, width=800;
- no-image hero: x=58.5, width=906 → x=82.5, width=858.

Это не loaded-state proxy: PerformanceObserver фиксирует реальный painted layout shift.

### Изолированные no-font repeats

`/articles/serdce-i-sokrovishche/`:

- 0.708019;
- 0.707335;
- 0.708019;
- основной shift 0.705706.

`/articles/kak-menyaetsya-serdce/`:

- 0.650187;
- 0.650187;
- 0.000612.

`/articles/cerkovnaya-disciplina-vlast-granicy-zashchita/`:

- 0.002585;
- 0.683647;
- 0.683647.

Последние два показывают timing-sensitive first paint, но не опровергают дефект: при промежуточном layout, попавшем в первый paint, одинаковая поздняя проекция стабильно заменяет геометрию. Это нельзя закрывать задержкой или ожиданием `document.fonts.ready`.

Disposition: расширить `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`. Его owner уже включает signed measure choices, persistence, shared tokens и breakpoint semantics. Closure теперь должна требовать SSR/head-first parity для route-local token: первый painted shell обязан совпадать с persisted/default choice.

## 4. 1024px: legacy reserve → v16 full-bleed

`css/site.css` включает ровно на 1024px:

```css
@media (min-width:1024px) {
  body.gbs-world { padding-left:304px }
}
```

Поздняя v16 layout owner в `css/floating-cluster.css` отменяет reserve только после совпадения descendant-dependent selector:

```css
@media (min-width:64em) {
  body.gbs-world:has(.gbs2-world[data-gill-v16]) { padding-left:0 }
}
```

В 19/105 cold records промежуточное состояние успело покраситься:

- `gbs2-world`: x=304, width=720;
- затем x=0, width=1024;
- shift value 0.296875–0.375549.

При 1023px такого x=304→0 перехода нет: 0 routes. Это локализует проявление на exact 64rem transition, уже принадлежащий `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`.

Disposition: не создавать отдельный CLS row. Capacity owner должен исключить не только плохую финальную ширину, но и конкурирующие first-paint geometries. Серверно известный route class/attribute либо единый layout rule должен определять reserve до paint; descendant `:has()` не должен переключать основную ось документа после первого кадра.

## 5. Коррекция границы font finding

Предыдущая targeted проверка корректно доказала:

- Hermenevtika CLS около 0.282 исчезает без fonts;
- Nagornaya part 3 targeted CLS исчезает без fonts;
- Home сохраняет отдельный non-font residual.

Новый полный 1023 census добавляет важную границу:

- normal CLS ≥0.1: 63 routes;
- no-font CLS ≥0.1: 59 routes;
- font blocking уменьшает CLS более чем на 0.05 только на 10 routes;
- более чем на 0.1 — на 9 routes.

Поэтому font matrix row сохраняет route-specific impact evidence, но не поглощает broad compact CLS. Остальные случаи принадлежат measure/capacity first-paint owners.

## 6. Closure additions

### Reader measure owner

Добавить проверки:

- cold 390/960/1023/1024/1280/1600;
- default и persisted narrow/normal/wide;
- первый painted rect равен settled rect;
- route-local `--gbs2-article-measure` доступен до paint либо CSS напрямую использует уже синхронный shared token;
- fonts warm/cold/failed не меняют disposition;
- без opacity cloak, timeout и fake readiness.

### Compact capacity owner

Добавить проверки:

- adjacent 1023→1024 first-paint geometry;
- body reserve и v16 full-bleed имеют одного SSR-known owner;
- no 304px horizontal relocation;
- no prose/control collision в settled state;
- все текущие шесть route families.

## 7. Матрица

Active arithmetic не меняется:

- 46 direct defects;
- 8 verified improvements;
- 22 system lanes;
- **76 active work units**.

Product не изменялся.
