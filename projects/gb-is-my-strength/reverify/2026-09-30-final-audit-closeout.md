# Итоговый handoff браузерного аудита — 2026-09-30

## Статус закрытия

**Аудиторский проход завершён; дефекты продукта не закрыты.** Подтверждённые дефекты остаются активными в `../verified/MASTER_BUG_MATRIX.md` до исправления в Product и отдельной проверки resulting-main. Product-исходники не менялись; GitHub Issues, включая #437, не закрывались; PR не merge'ился.

## Идентичность и ограничения

- Product `main` и локально собранный production-like `dist`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Browser: Chromium 153.0.8010.0 через Playwright.
- Проверки выполнялись на локальной статической раздаче точного `dist`; это **не live-host браузерный тест**.
- Это не полный WCAG/axe аудит и не проверка с реальными экранными дикторами или на физических устройствах.
- Аудиторские документы/evidence менялись только в AuditRepo; Product-код не менялся.

## Итоговая матрица

На момент закрытия audit-прохода в `../verified/MASTER_BUG_MATRIX.md`:

| Категория | Количество |
|---|---:|
| Активные work units | **24** |
| Прямые текущие дефекты | **23** |
| System verification lanes | **1** |
| Исправления Product, включённые этим проходом | **0** |

Этот аудит уточнил доказательства трёх активных MobileChrome work units; ни один из них не закрыт:

1. `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL` — на девяти маршрутах три кнопки остаются focusable, пока панель выше viewport: 27/27 проверок подтвердили невидимые Tab-остановки при `scrollY=0`.
2. `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG` — на `/articles/`, `/biografii/`, `/hard-texts/` дискретный wheel, пересекающий состояние `#hNavbar.nav-hidden`, оставляет MobileChrome в прежнем состоянии до следующего wheel-события; воспроизведено в обоих направлениях. Touch-scroll cross-check прошёл 12/12 проверок.
3. `GBS-MOBILE-CHROME-SEARCH-TOUCH-LOAD-RACE` — на `/hard-texts/` при показанной до первого touch панели первый trusted touch по Search после non-touch-прокрутки начинает lazy preload, но не открывает palette. Повторный touch, mouse click и Enter открывают её. Claim ограничен этим cold-first-touch сценарием; touch-scroll-предшественник прошёл отдельный положительный контроль.

## Завершённые браузерные серии

### Sitewide smoke

- **104 маршрута × 2 viewport = 208 визитов.**
- **1 872/1 872** общих проверок прошли: HTTP 200, title/lang, первый Tab, уникальность ID, локальные fragment targets, skip-link targets, page errors и горизонтальный overflow документа.
- Это smoke, не полный accessibility audit. Восемнадцать страниц без selector-matched skip link прошли отдельную route triage; самостоятельные skip-link дефекты подтверждены только для двух семейств: BaseLayout (`/hard-texts/genesis-6/`, `/izbrannoe/`) и Journal (`/journal/`, `/journal/dossiers/g3/`).

### MobileChrome: focus, search и состояния

- Первичный проход: 9 маршрутов × 2 viewport, **297 assertions: 258 passed / 39 failed**. Из них 27 относятся к подтверждённым focus stops; 12 scroll-reveal failures были вызваны `window.scrollTo` и не считаются дефектом без real-input witness.
- Keyboard Search: Enter, dialog semantics, input focus, Escape и focus restoration прошли на всех девяти маршрутах.
- Wheel/navbar lifecycle: три маршрута, 18 assertions, **12 passed / 6 failed**; дальнейший modality cross-check на тех же трёх маршрутах: 30 assertions, **24 passed / 6 failed**. Все шесть wheel failures — stale-state; touch-gesture проверки прошли 12/12.
- Touch Search: девять маршрутов × 320 и 390 px, **180 assertions: 174 passed / 6 failed**. Все шесть failures ограничены трём search-open/dialog/input assertions на `/hard-texts/` при двух ширинах.
- Back/Home direct entry: 36 визитов, **108/108 passed**.
- Back same-origin history branch: 18 визитов, **54/54 passed**. Для установления same-origin `document.referrer` тестовый visible anchor выполнял реальную same-origin навигацию; это не утверждение, что все продуктовые ссылки на destination отдельно проверены.

## Основные артефакты

- Активная матрица: `../verified/MASTER_BUG_MATRIX.md`
- Sitewide отчёт: `2026-09-30-sitewide-browser-100-checks.md`
- Sitewide evidence: `evidence/2026-09-30-sitewide-browser-100-checks.json`
- Skip-route triage: `evidence/2026-09-30-no-skip-route-triage.json`
- Полный MobileChrome reverify: `2026-09-30-current-mobile-chrome-reverify.md`
- MobileChrome исходные/дополнительные JSON находятся в `evidence/` и перечислены в этом reverify-документе.

## Очистка AuditRepo и сохранность evidence

- Исходная инвентаризация: 65 untracked артефактов, 2 140 108 байт и 58 192 newline-символа по всем файлам. После очистки осталось 61 файл (24 Markdown, 24 JSON, 13 PNG), 1 023 829 байт и 8 976 newline-символов; Markdown и JSON вместе занимают 6 947 строк. Счёт newline по PNG не является осмысленным числом строк.
- Удалены четыре файла без входящих ссылок из Markdown: `2026-09-30-layout-skip-link-reverify.json`, `2026-09-30-skip-link-reverify.json`, `2026-09-30-skip-home-desktop-focused.png` и `2026-09-30-skip-articles-mobile-focused.png`. Это неиспользуемые прежние route/focus snapshots; активные skip-link findings по-прежнему опираются на текущие связанные отчёты и machine evidence (`bypass-blocks`, `no-skip-route-triage` и sitewide smoke).
- В крупных JSON оставлены результаты по маршрутам/viewport, итоговые счётчики и полные наблюдения всех неуспешных проверок. Удалены повторяющиеся payloads успешных assertions и дублирующиеся геометрические снимки. Итоги не изменились: sitewide **1 872/1 872**, touch-search **174/180**, direct Back/Home **108/108**, history Back **54/54**, modality cross-check **24/30**.
- Все оставшиеся 37 evidence-файлов имеют упоминание в Markdown; все оставшиеся JSON успешно разбираются. В 25 актуальных отчётах и матрице проверены 213 локальных evidence/path-упоминаний — неразрешённых нет; четыре удалённых имени перечислены только как запись об очистке. Временный Playwright probe удалён из локальной копии Product; её `git status` чистый.

## Критерий повторного открытия

Возобновлять проверку каждой строки после Product-изменения на resulting-main: повторить её маршрут/состояние, проверить closure boundary в MASTER и убедиться, что изменённая shared component не регрессировала на соседних layout/viewport. Текущие локальные exact-SHA результаты сами по себе ничего не закрывают и не подтверждают состояние live-host.