# PDF-ссылки, card fragmentation и визуальные переходы листов — broad wave 52

**Якорь Product:** `c734ad540b526d8e76d524370c71da6a45048e06`.  
**Доказательство:** `evidence/2026-11-03-pdf-link-fragmentation-visual-wave52.jsonl`.

## Чистый baseline и реальное действие

Exact Product main не сдвинулся после wave 51. На чистом checkout повторно прошли print-geometry contract, engine contracts и production-like build на 111 страниц. Product не изменялся; открытые PR #2258–#2260 не пересекаются с print/PDF scope.

Chromium 153 заново выполнил trusted native click по видимому desktop print control на всех 73 маршрутах. Результат одинаков: `window.print()` ровно один раз, URL не меняется, download event — **0/73**. Значит, функция по-прежнему открывает browser print workflow, а не скачивает готовый файл; это остаётся в `SYS-READER-PRINT-ACTION-LABEL-SEMANTICS`.

После native preparation заново созданы **73 PDF / 1 425 A4-листов**. Все листы просмотрены по порядку на восьми global sheets. Дополнительно геометрический scan выделил 88 непоследних листов, заполненных менее чем на 66%; все 88 переходов `page N → page N+1` просмотрены в читаемом масштабе. Катастрофической перестановки, нового пустого interior-листа, обрезанного изображения или пропавшей terminal section не найдено.

## Геометрия и назначение PDF-ссылок

Проверены все **2 020** link annotations:

- 1 666 URI: 432 внутренних и 1 234 внешних;
- 354 внутренних named/GOTO-перехода;
- 0 нулевых или выходящих за MediaBox clickable rectangles;
- 0 destination pages/points вне документа;
- три annotations без text-layer текста принадлежат ожидаемым кликабельным изображениям;
- восемь exact duplicate annotations имеют тот же rectangle и тот же destination, поэтому не меняют исход клика.

Отдельно найдено три пересечения rectangles с **разными** destinations. Одно — уже принадлежащий `GBS-BASELAYOUT-PRINT-SKIP-LINK-REPEATS` конфликт: повторённый fixed skip-link перекрывает нижнюю source-ссылку Hebrews. Два остальных — новый общий card-fragmentation root.

## Новый system owner: linked card разрывается между листами

### Gill reference

На `/articles/dzhon-gill-spravochnik/` блок «VIII. Читать дальше» начинается на page 13. Первые две карточки разрываются: их заголовки остаются внизу page 13, descriptions переходят на page 14. На page 14 fragment annotation первой строки занимает `y=39.75–145.5`, а полная annotation следующей строки начинается с `y=104.25`. Получаются два больших overlap по **9 590.62 pt²** каждый:

- красная зона ведёт в «Исторический контекст», синяя — в «Часть II: Учёный»;
- красная зона второй колонки ведёт в «Часть I: Человек», синяя — в «Часть III: Экзегет».

То есть верхняя часть двух визуально самостоятельных карточек имеет неоднозначный PDF hit target. Это не неправильный source href: пять native screen clicks ведут в пять ожидаемых URL и подтверждают H1 identity 5/5. Ошибка появляется только после paged fragmentation.

### Antisovetov

На `/articles/20-antisovetov-pastoru/` `.series-card` №6 разрывается между pages 58–59: номер и title «Когда говорить…» остаются последними строками page 58, а единственный description начинает page 59. Native screen click ведёт в правильную статью и подтверждает H1, но печатная карточка теряет атомарную смысловую границу.

Обе семьи имеют `break-inside:auto` и не объявлены canonical print atomics. Диагностическая, некоммитившая Product подстановка `break-inside:avoid-page` для `.context-links > a` и `.series-card`:

- сохраняет page counts 18 и 62;
- собирает все пять Gill cards целиком на page 14;
- удаляет оба conflicting overlaps;
- переносит Antisovetov card №6 целиком на page 59.

Допускается `SYS-PRINT-LINKED-CARD-ATOMICITY`: shared print geometry должен классифицировать содержательные linked cards по роли, а не патчить два маршрута.

## Пустые no-image cover pages — расширение существующего parity owner

На 20 Heart routes screen-hero `.gbs2-hero.gbs2-noimg` — содержательная тёмная chapter-card с номером и caption. В print одновременно происходят три вещи:

1. print v2.2 пытается снять hero aspect ratio, но менее специфичный `.gbs2-hero` проигрывает `.gbs2-hero.gbs2-noimg`, поэтому сохраняется пустая высота 235.109px;
2. print v2.2 удаляет decorative background/pseudo-content;
3. print v2.3 скрывает единственный `figcaption`.

В результате каждый из 20 PDF начинается отдельным почти пустым листом: masthead, breadcrumb, белая рамка и один номер; H1 и summary уходят на page 2. Это физическое последствие уже доказанного wave-51 расхождения canonical inclusion ↔ hidden caption, поэтому новый direct owner не создаётся: scope поглощает `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`.

Причинный control на `/articles/kak-hranit-serdce/`: только collapse пустого no-image hero меняет **8 → 7 страниц**, а H1, summary, byline и начало статьи корректно помещаются на page 1. Closure должен выбрать одно согласованное решение: либо печатать осмысленную chapter-card, либо исключить её и полностью схлопнуть geometry; пустой лист нельзя сохранять как «нейтральную» версию.

Image-backed cover pages остаются визуально целыми и не смешиваются с no-image residual.

## Reconciliation и итог

- Gill blank page 30, mobile lock clipping, action-label mismatch и BaseLayout skip-link остаются у прежних owners.
- 20 пустых no-image covers расширяют существующий parity owner, не создавая дубликат.
- Hebrews overlap поглощается существующим skip-link owner.
- Один новый system owner покрывает два независимых linked-card компонента и их реальный paged/link outcome.

MASTER: **62 → 63**, system lanes **23 → 24**; direct 30, improvements 8 и residual 1 без изменения.

**Broad wave 52 завершена.**
