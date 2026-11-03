# Mobile print: modal scroll-lock обрезает документ — broad wave 49

**Якорь Product:** `9a68fe214ef592b6bfb99a041d00153fd438f22a`.  
**Доказательство:** `evidence/2026-11-03-mobile-print-lock-wave49.jsonl`.

## Нативный путь

Профиль: Chromium mobile 390×844, `isMobile=true`, touch, Light, reduced motion. На каждом из 73 маршрутов выполнена только пользовательская цепочка:

1. нативный click по видимому opener (`#mobPartTocBtn` для series/common или `#hmBottomBtn`/`#hmSectionBtn` для standalone);
2. нативный click по появившемуся print/PDF control;
3. фиксация состояния в момент print;
4. реальный A4 PDF и raster render.

Не использовались force-click, прямой вызов внутренней функции, ручная установка readiness или принудительное открытие overlay.

## Результат 73/73

Каждый click был принят каноническим owner и вызвал `window.print()` ровно один раз, URL остался прежним. Но во всех 73 случаях:

- TOC/sheet остаётся `.is-open`;
- `data-scroll-locked`/эквивалентный lock остаётся активным;
- computed `html` и `body` overflow остаётся `hidden`;
- print CSS скрывает сам overlay, но не снимает scroll lock;
- итоговый PDF содержит **ровно один A4-лист** — только начало статьи; весь остаток документа отсутствует.

Визуально проверены все 73 полученных листа: это первые страницы нормальных материалов, а не корректно сжатые полные документы.

## Причинный контроль

На `/articles/dzhon-gill-istoricheskiy-kontekst/`:

- clean mobile `page.pdf()` без открытия overlay → 29 содержательных страниц;
- только открытый overlay → 1 страница;
- overlay + нативный PDF click → 1 страница;
- desktop native path → 30 страниц (включая отдельно учтённый blank tail).

Значит, причина не viewport, `isMobile`, PDF engine или объём статьи. Причина — modal owner оставляет print lifecycle внутри locked scroll container. Тот же механизм воспроизводится в обеих control families и на каждом маршруте.

## Допуск

Новая system-строка: `SYS-READER-MOBILE-PRINT-LOCK-CLIPS-DOCUMENT`.

Closure boundary:

- канонический action обязан до `window.print()` закрыть/снять все overlay-lock owners либо временно и атомарно нейтрализовать lock;
- после `afterprint`/cancel screen-state и focus должны быть восстановлены без гонки;
- real rendered PDFs на mobile Light/Dark + reduced/normal должны содержать полный first/middle/final body и terminal section;
- contract покрывает обе overlay families и все route profiles, отрицательный fixture с неизвестным lock owner должен падать;
- нельзя лечить отдельные 73 страницы или использовать timeout.

Это не дубликат policy-parity/terminal-loss: здесь print projection подготовлена, но физический документ обрезан viewport-lock до первой страницы.

**Broad wave 49 завершена.**
