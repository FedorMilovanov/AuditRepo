# Focus-reachable label/name census — 2026-10-27

## Решение

На exact Product anchor `21dcfdd9f9018607a708c5118383e287ec1a3fed` пройден весь corpus из 105 built routes настоящей клавишей `Tab` в двух профилях: desktop 1440×900 и mobile 390×844 (`isMobile=true`, `hasTouch=true`).

Итог: **210/210 route-profile runs, 6 121 уникальных focus states, 11 serious `label-content-name-mismatch` событий на 10 route-profile runs, 4 реальных owner-family**. Все четыре уже принадлежат `GBS-CHROME-LABEL-IN-NAME-MISMATCH`; новая строка не нужна. Product не изменялся.

Машинное резюме: `evidence/2026-10-27-focus-label-current-head-census.jsonl`.

## 1. Scope и метод

- Product SHA: `21dcfdd9f9018607a708c5118383e287ec1a3fed`.
- Production-like build: PASS, 104 Astro pages, 108 final HTML, 0 errors, 6 hints.
- Corpus: 105 route directories из `dist/**/index.html`.
- Профили: desktop 1440×900; mobile 390×844 с mobile/touch semantics.
- Scheme/motion: Light + reduced motion, чтобы исключить необязательное движение из focus sweep.
- Для каждого route сначала выполнен settled-document Axe baseline, затем только native `Tab`; после каждого нового active element Axe запускался на реальном `document.activeElement`.
- Обход прекращался только после возврата к уже посещённому DOM element. Два длинных article routes, упиравшиеся в первоначальный предел 220, повторены с пределом 500 и завершили цикл на 415 и 389 элементах.
- Сняты navigation/console/page errors, completed broken images, CLS и LCP.

Это не forced-focus scan: `focus()` и искусственная подмена `tabindex` не использовались.

## 2. Полнота обхода

| Профиль | Routes | Focus states | Min / median / max |
|---|---:|---:|---:|
| Desktop | 105 | 4 470 | 1 / 43 / 415 |
| Mobile | 105 | 1 651 | 1 / 6 / 389 |
| **Всего** | **210 runs** | **6 121** | **1 / 21 / 415** |

Все 210 runs завершились возвратом к ранее посещённому элементу. Routes с одним или несколькими controls не исключались: карты с intro gate и компактные error/fallback views вошли в corpus наравне с длинными статьями.

## 3. Focus-reachable residuals

| Owner-family | Routes / profiles | События | Видимый текст → accessible name |
|---|---|---:|---|
| Home sacred name | `/`, desktop + mobile | 2 | `СВЯЩЕННОЕ ИМЯ БОГА … Яхве` → `יְהוִה — показать чтение имени` |
| Russian Baptism app home | wrapper и `/_app/`, desktop + mobile | 4 | `РУССКИЙ БАПТИЗМ / КАРТА ИСТОРИИ` → `Перейти на главную` |
| Highlights FAB | `chast-2`, `istochniki`, `nakhodki`, mobile | 3 | counter `0` → `Мои цитаты` |
| TTS speed | `nakhodki`, desktop + mobile | 2 | `1×` → `Скорость` |

Wrapper `/konfessii/russkij-baptizm/` и direct `/_app/` показывают один и тот же nested app control. Это четыре измерения одного owner, а не два дефекта.

Каждый residual имеет impact `serious` и один корень: handwritten accessible name не содержит реально нарисованную строку элемента. Это точное определение существующего `GBS-CHROME-LABEL-IN-NAME-MISMATCH`.

## 4. Baseline против focus-visible

Финальный settled baseline нашёл 10 nodes, тогда как native focus sweep нашёл 11 событий. Разница ожидаема для scroll-reactive chrome:

- `#gb-hl-fab` может быть включён или скрыт в зависимости от scroll/reader state;
- TTS speed становится релевантным в visible player state;
- Tab естественно прокручивает документ и измеряет состояние, которое пользователь действительно достигает.

Подозрительные Nagornaya routes повторены в свежих browser processes. Результат воспроизведён: mobile `chast-2` даёт FAB mismatch, `istochniki` — FAB mismatch, `nakhodki` — TTS + FAB; desktop `nakhodki` — TTS. На `chast-3/4` settled baseline видит FAB, но native traversal его не достигает. Поэтому baseline nodes не подменяют focus-reachable счётчик.

## 5. Home ambient boundary

В профилях этой волны ambient marginalia не являются focus-reachable: CSS скрывает их ниже 1480px, а runtime корректно назначает скрытым phrases `tabindex=-1`. Поэтому 1440 desktop и 390 mobile дают **0 ambient controls** — это ожидаемая media boundary, не регрессия harness.

Ранее доказанные 32/32 focus-visible mismatch на широких Home profiles (1480px и выше) остаются действующими и принадлежат той же строке. Текущий corpus добавляет sacred-name owner на `/`, но не отменяет wide ambient evidence.

## 6. Визуальные witnesses

Четыре distinct owner-family достигнуты native Tab и сняты через CDP viewport capture без ожидания `document.fonts.ready` и без forced focus:

- Home sacred: 12 Tabs, desktop;
- Russian Baptism home: 1 Tab, desktop;
- TTS speed: 28 Tabs, desktop;
- Highlights FAB: 134 Tabs, mobile.

Во всех четырёх `:focus-visible=true`; target geometry и SHA-256 screenshots записаны в JSONL. PNG оставлены вне Git согласно evidence policy.

## 7. Health telemetry

- navigation errors: 0;
- console errors: 0;
- page errors: 0;
- completed broken images: 0.

Performance telemetry собрана как диагностический слой, а не как closure этого a11y owner:

| Профиль | Median CLS | Max CLS | CLS ≥ 0.1 | Median LCP | LCP range |
|---|---:|---:|---:|---:|---:|
| Desktop | 0.006712 | 0.303809 | 15/105 | 364ms | 0–2044ms |
| Mobile | 0 | 0.002302 | 0/105 | 424ms | 88–3876ms |

`LCP=0` означает отсутствие buffered LCP entry к моменту чтения, а не нулевую загрузку. Эти числа не используются для закрытия других performance rows.

## 8. Reconciliation

Для `GBS-CHROME-LABEL-IN-NAME-MISMATCH` зафиксирован current-head residual set из четырёх owner-family:

1. Home sacred-name control;
2. Russian Baptism app home control;
3. highlights counter FAB;
4. TTS speed control.

Старые широкие списки route-specific selectors нельзя считать current-head census: многие прежние owners больше не проявляются в полном native-Tab corpus, а текущие residuals зависят от focus/scroll state. Closure criterion должен быть owner-level и включать settled baseline **и** полный native focus traversal.

**Disposition:** extend existing row; duplicates/new rows = 0; active matrix остаётся `46 + 8 + 22 = 76`.
