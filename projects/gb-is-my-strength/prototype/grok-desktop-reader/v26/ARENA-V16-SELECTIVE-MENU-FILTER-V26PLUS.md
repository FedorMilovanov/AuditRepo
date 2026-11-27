# V26+ — выборочное улучшение навигационного меню из Arena V16

Решение: НЕ переносить React, собственный ReaderState, hash-routing, хранилище, TTS, demo-search и ширину 850 px. В V26 они либо слабее, либо уже реализованы.

Выбор: один полезный UX-штрих — локальный фильтр текущих пунктов меню сайта (название + пояснение). Он НЕ заменяет GBSearch и не индексирует статьи.

Изменения в `REFERENCE-V26.html`:
- Фильтр над существующим `<nav>`, без изменения шести адресов, групп и их семантики.
- Точный учёт найденных разделов, пустое состояние, очистка, поиск с учётом регистра и `ё/е`, AND-поиск по словам.
- Фокус ввода при открытии; вниз/Enter — к первому видимому результату; вверх из первого результата — обратно к вводу; Escape — закрытие с возвратом к триггеру.
- Скрытые строки и пустые группы удаляются из дерева доступности; панель остаётся в едином позиционировании popover.
- Локальные стили: без общих CSS-правил для ссылок, без второго меню и без изменения mobile Product.

Проверка: `python qa-v26-menu-filter.py` (Playwright). Данная QA доказывает поведение ПРОТОТИПА, не Product.

Граница внедрения в Product: позже адаптировать паттерн к существующему `SiteSectionsMenu.astro` и каноническому навигационному набору, сохранив OverlayRuntime, фокус, No-JS и untouched mobile. Ветка Product #2285 не входит в этот change set.


## Additional root cause corrected

The original V26 reference had a swallowed if(!open&&panel.contains(...)) inside a // comment in animateBranch. This made the entire inline script fail to parse with Unexpected token } (Illegal return statement in Chromium). No meaningful browser run was possible while this remained. The minimal newline fix restores disclosure-focus safety. This was confirmed against the unmodified baseline (which failed node --check and the original smoke).

The compact desktop 781–900×300px geometry was inspected explicitly: first pass left a ~30px scroll area in site menu. Compact header/foot styles now reserve a real menu-scroll viewport; qa-v26-menu-filter.py checks its minimum.
