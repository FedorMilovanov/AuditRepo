# CURRENT_HEAD REVERIFY — Gill pre-v16 submenu: scrollspy был мёртв в проде; ревив + закрытие false-green

**Verifier/Implementer:** Claude (session claude/image-generation-query-3e8rd5)
**Date:** 2026-07-05
**Source base HEAD:** `8fd5bb36` (main после merge PR #33 + auto cache-bust)
**Implementation commit:** `655e1652` (PR #34)
**Historical reference:** `bcf6389f` (verified via `extract-gill-pre-v16-submenu-reference.js --verify`)
**Метод:** конформанс-матрица по ТЗ GILL_PRE_V16_SUBMENU_ROUNDED_FRAME → эмпирическая проверка каждого пункта в headless-браузере → исправление → полная перегонка гейтов.

---

## 1. UI-GILL-SCROLLSPY-DEAD-06 — P1 owner-visible, найден + исправлен

**Суть:** `initGbs2Controls()` (floating-cluster-controller.js) выходил на `if (!sheet && !bbar) return` — `#gbs2Sheet`/`#gbs2Bbar` есть только у серии Баптистов. На ВСЕХ Gill-страницах весь scrollspy восстановленного pre-v16 суб-меню (active/passed, счётчик N/TOTAL, track fill, автопрокрутка рельса, aria-current) **никогда не инициализировался**: меню — статичный SSR-снимок «1 / N». Автор реставрации написал v16-ветки ВНУТРИ функции (guards `!isV16Page` и пр.), но не открыл входной гейт.

**Как маскировалось:** аудит-скрипт при неответе scrollspy печатал `OK ... not exercisable headlessly ... verified correct via algorithm replication`. Эмпирика: **все 35 ячеек (5 роутов × 7 вьюпортов) шли этим обходом** — «500/500» состояло из статики + 35 бесплатных зелёных.

**Фикс:** гейт `if (!sheet && !bbar && !qs('[data-gill-v16]')) return;` (все внутренние обращения к sheet/bbar null-guarded — проверено). Обход в аудите: WARN локально (не passed), FATAL в CI (`GILL_SUBMENU_REQUIRE_LIVE=1` в deploy.yml).

## 2. UI-GILL-SUBMENU-ORDER-07 — P1, найден + исправлен (3 роута)

Меню chast-1/2/3 нарушало монотонность порядка документа (ТЗ §9.5): статьи выросли (chast-2: 6→29 секций) и перестроились после `bcf6389f`. Примеры: `#sec-systematics` в меню 3-й, в документе 17-й из 29; полемика с Уэсли в chast-3 — в меню 3-я, в документе 11-я. Break-цикл active-index замерзал посреди статьи (для читателя: подсветка врёт на десятках тысяч px скролла).

**Фикс (3 слоя):** (а) данные — строки partToc переупорядочены по текущему порядку документа, подписи/иерархия/состав исторические, задокументировано в `data/gill-submenu-anchor-reconciliation.json → reorders` (undocumented drift по-прежнему фейлит аудит); (б) рантайм — represented сортируется по `compareDocumentPosition` (деградация вместо заморозки); (в) аудит — монотонность таргетов ассертится в браузере per route×viewport.

## 3. UI-GILL-DOT-TRACK-OFFSET-08 — P2 visual, найден + исправлен

Точки не лежали на линии трека: смещение **7.5px** (замерено, все роуты). Причина: при реставрации `.gbs2-track` вынесли из `ul.gbs2-toc` (исторически — первый ребёнок ul; `left:9px` считается от ul, что кладёт линию точно через центры точек), а старый аудит **закрепил неверное размещение** проверкой «valid track sibling». Фикс: трек возвращён внутрь ul (историческое размещение, подтверждено `git show bcf6389f`), проверка перевёрнута, добавлен ассерт выравнивания ≤4px (ТЗ §8). Итоговое смещение ~0.5px.

## 4. Достройка ослабленных пунктов ТЗ (конформанс-матрица → фиксы)

| ТЗ | Было | Стало |
|---|---|---|
| §6.3 traversal | green-обход | полный live-traversal, FATAL без live в CI |
| §6.4/§7.2 gaps | top/bottom/height не ассертились | ±2px/±4px ассерты |
| §7.4 tocscroll | `overflow:auto` | `overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; scrollbar-gutter:stable` |
| §7.4 rmid | только `min-height:0` | полный flex-контракт |
| §8 dot align | проверки не было | ≤4px fatal |
| §9.4 aria-current | на `.toc-part-item` (оверлей) | + на активной строке рельса; exactly-one ассерт |
| §9.5 монотонность | не проверялась | fatal с перечнем нарушителей |
| §11 extractor | `--verify` трактовался как SHA → пустой манифест | `--verify` режим + unknown-flag guard + empty-extraction guard |
| §12 | 7 вьюпортов, без JSON-фактов | 8 вьюпортов (+1024×768-dark), JSON-факты в `reports/gill-pre-v16-submenu-audit/<route>/<vp>.json` |
| deploy.yml | мёртвый warn-шаг «Deploying anyway» | удалён (закрывает DEPLOY-YML-DEAD-WARN-STEP) |

## 5. Верификация (Implementation `655e1652`)

- `extract --verify`: OK, манифест = исторический свидетель (5 роутов)
- Суб-меню аудит: **1701/1701 при GILL_SUBMENU_REQUIRE_LIVE=1** — полный live-traversal каждой строки, 5×8 ячеек, per-route counts: kontekst 10, chast-1 15, chast-2 6, chast-3 16, spravochnik 9
- `gill:series:data:consistency` ✅; `gill:mobile-play:smoke` ✅; context/spravochnik strict-native parity ✅; `audit:premium-controls` OK; `astro check` 0 errors; `audit-pro` 165 passed / 0 errors
- `gill:mobile-layout:audit`: 20 фейлов = `ERR_TUNNEL_CONNECTION_FAILED` (Метрика ↔ sandbox-прокси), pre-existing на чистом HEAD, все layout-проверки зелёные

## 6. Открытым остаётся (для матрицы)

- **UI-GILL-SUBMENU-LABEL-SEMANTICS-09 (P2, owner decision):** 3 записи reconciliation (Part I/III renames) имеют `currentRenderedHeading` с ДРУГИМ смыслом, чем историческая подпись меню (например, подпись «Гилл и Рим…» ведёт на заголовок «Управление церковью…»), при этом `decision` утверждает «heading preserved verbatim». Подпись меню ≠ заголовок цели — нужно редакционное решение владельца: править подписи меню под текущие заголовки или заголовки под подписи.
- Критерии приёмки ТЗ §16: 23 (remote CI proof — закроется прогоном deploy на PR #34), 25 (owner visual approval — за владельцем).
