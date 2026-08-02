# BROWSER REVERIFY PLAN — Karty browser-class rows on actual HEAD 2273b8c9

> План для верификатора. Фактический source HEAD = `2273b8c9` (канон `efaf2a51` stale — сначала SD-5).
> Эти строки НЕ закрываются source-only (browser/runtime/CI-поведение). Скопировать шаблон в
> `reverify/CURRENT_HEAD_REVERIFY_2026-08-xx_2273b8c9_karty-browser.md` и заполнить статусы.

## Маршруты для проверки (production-like dist или live на 2273b8c9)
- /karty/ishod/ · /karty/avraam/ · /karty/shoftim/ · /karty/shvatim/ · /karty/pavel/ · /karty/melachim/ · /karty/revelation/ · /karty/early-church/ · /karty/yeshua/ · /karty/maccabim/
- Viewports: desktop 1440×900 · mobile 390×844 · mobile landscape 844×390 · short landscape 1024×450

## Browser-class rows (проверить на 2273b8c9)
| ID | Что проверить (repro) | Где |
|---|---|---|
| MAP-P1-01 | tour: подпись этапа по sid vs tourStepIdx; flyTo до остановки | /karty/avraam/, Space |
| MAP-P1-02 | есть ли touch-запуск тура (не только Space) | mobile |
| MAP-P1-04 | перекрытия search×theme, search×share, header×timeline, stories×timeline | desktop |
| MAP-P1-05 | mobile viewport occupancy / коллизии подписей | mobile |
| MAP-P1-06 | `_renderArchaeologyFooter` рендерится вне вкладки Археология | mobile |
| MAP-P1-08 | переключение story: мигание opacity, сброс при очистке поиска | /karty/ishod/ |
| MAP-P1-09 | выбор story → auto-open панели первого места (bottom sheet) | mobile |
| MAP-P1-18 | галерея: thumbnail 320px / свайпы | mobile |
| MAP-P1-19 | landscape 844×390 → desktop-панель, -357px заголовок | 844×390 |
| AVRAAM-P1-01 | CTA «Начать кинотур» невидим 1.8с (opacity 0) | /karty/avraam/ |
| AVRAAM-P1-02 | initial viewport сжимает кластер Ханаана | /karty/avraam/ |
| AVRAAM-P1-03 | mobile panel дублирует навигацию, квадратный share | mobile |
| AVRAAM-P1-05 | 1024×450 → оверлей «Разверните устройство» | 1024×450 |
| GATE-P1-03 | atlas:gate / waypoints-chars регрессия Авраама | CI |
| GATE-P1-01 | JS-crash детекция в smoke:maps | CI/browser |
| DRAW-P1-01 | подписи в плотных кластерах (label v2, anchors/leaders) | browser |
| SVG-P1-01 | экспортированные atlas-export/*.svg: неэкранированный `&nbsp;` | artifact |
| PERF-P1-01 | feTurbulence в avraam/base.svg: анимирован ли (drag FPS) | /karty/avraam/ |
| DRAW-P1-02 | сдвоенная линия рек у берегов | /karty/ishod/ |
| QUAL-P1-06 | таймеры после destroy (нет утечек) | devtools |

## Метод
- Для каждой строки: verified-source / verified-browser на `2273b8c9`; скриншот/логи в evidence.
- Вердикт: still-confirmed / fixed-current / stale-on-current-head / needs-manual-check.
- Закрывать только fixed-current со свежим witness (SHA-first).
- После закрытия обновить `MASTER_BUG_MATRIX.md` + `NEXT_AGENT_PROMPT.md` счётчики (совместно с SD-1/SD-2).

## Границы
- Это revert-plan, не закрытие. Канон менять — только верификатор.
- Source-verified строки (см. VERIFIED_DISPOSITIONS.md) — не в этом плане.
