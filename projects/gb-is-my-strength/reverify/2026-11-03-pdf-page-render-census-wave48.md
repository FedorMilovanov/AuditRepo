# Реальные A4 PDF и постраничная визуальная проверка — broad wave 48

**Якорь Product:** `9a68fe214ef592b6bfb99a041d00153fd438f22a`.  
**Доказательство:** `evidence/2026-11-03-pdf-page-render-census-wave48.jsonl`.

## Охват и метод

После нативной подготовки control-path созданы реальные Chromium A4 PDF для **73/73** маршрутов. Получено **73 PDF / 1 421 страница**. Каждая страница растеризована через MuPDF; проверены индивидуальные PNG, 73 route contact sheets и восемь последовательных общих листов. Text layer использовался только для навигационных проверок и ссылок, не как свидетель отрисовки.

Для каждой страницы отдельно проверены:

- A4 MediaBox и порядок;
- пустота и точные дубликаты;
- painted pixels у четырёх границ (clipping witness);
- таблицы, изображения, типографика, начало/конец материала и terminal sections;
- link annotations и неразрешимые PDF destinations;
- крайние/разреженные страницы вручную на рендерах.

## Результат

- 1 421/1 421 страниц имеют A4-геометрию;
- 0 точных дубликатов;
- 0 страниц с painted pixels на краях или нижнем срезе;
- 2 017 link annotations, 0 malformed/unresolved destinations;
- 140 встроенных image objects; изображения и таблицы остаются внутри листа;
- основная последовательность материалов, bibliography, авторские и terminal sections визуально сохранена;
- большие документы (до 95 страниц) не показывают перестановки, горизонтального среза или повторённого body-content.

## Новый дефект: лишняя пустая terminal page

`/articles/dzhon-gill-istoricheskiy-kontekst/` стабильно создаёт 30 листов:

- page 28 завершает источники и авторский блок;
- page 29 содержит terminal-карту серии и `SOLI DEO GLORIA`;
- **page 30 полностью белая**: text 0, image 0, ink ratio 0.

Повторено тремя независимыми PDF-вызовами; click-state не влияет. Это не text-layer артефакт: raster страницы также полностью белый. Других пустых листов в 1 421 страницах нет.

Допускается новая direct-строка `GBS-GILL-HISTORY-PRINT-TRAILING-BLANK-PAGE`. Исправление должно устранить источник лишнего листа, а не обрезать PDF постфактум; closure требует реального A4 render terminal pages и общего negative guard на blank/duplicate tail.

## Не дублируется

Существующий `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` владеет скрытием meaningful terminal content, а `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY` — расхождением семантической projection policy с painted output. Здесь содержимое terminal-карты присутствует и правильно отрисовано; отдельный failure — добавленный после него пустой физический лист.

**Broad wave 48 завершена.**
