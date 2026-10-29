# Broad wave 33 — reader controls и сохранение состояния на PR #2217

Дата: 2026-10-29  
Product PR: #2217, exact head `36066273b6e06f0c156a31531cf551ebfce98bf5`

## Цель и метод

После повторного восстановления detached Product clone выполнен свежий `npm ci --ignore-scripts` и `npm run strangler:build:production-like` — exit 0. Все пять новых article routes проверены через нативные pointer/touch действия в двух профилях:

- desktop 1440×900, Light;
- mobile 390×844, Dark, `isMobile:true`, `hasTouch:true`, reduced motion.

Проверялись не только DOM/state-маркеры, а конечные действия:

- открыть и закрыть reader settings;
- добавить статью в «Избранное» и перезагрузить страницу;
- сменить тему и перезагрузить страницу;
- вызвать Web Share и записать фактически переданный payload;
- вызвать print через desktop rail и mobile part sheet;
- выполнить обычный wheel scroll и нативно нажать «Наверх»;
- после действий запустить Axe, проверить broken images, console/page errors, URL identity, CLS/LCP и сделать desktop/mobile screenshots.

`navigator.share` и `window.print` были заменены только до загрузки страницы на capture-fixtures: действие по-прежнему запускалось нативным click по реальному контролу. Forced clicks и прямые вызовы Product handlers не использовались.

## Результат

Все **10/10** profile-route сценариев прошли:

- settings sheet действительно открылся (`is-open` / `aria-hidden=false`) и закрылся нативным контролом;
- save установил `aria-pressed=true`, и после reload состояние осталось `true` на каждой статье;
- theme click изменил реальный `html.dark`, после reload выбранная тема сохранилась;
- Web Share вызван ровно один раз и получил правильные article title + текущий полный route URL;
- print callback вызван ровно один раз; desktop печатает из rail, mobile — из part sheet;
- mobile part sheet после вызова print остаётся открыт — это сохранение контекста, а не заявленная ошибка; Escape штатно закрывает его перед следующим независимым действием;
- после обычного wheel scroll до `scrollY=5000` «Наверх» завершает движение на `scrollY=3` во всех профилях; URL/page identity не меняются;
- Axe: 0 violations во всех 10 сценариях;
- broken loaded images: 0;
- attributable console errors: 0;
- uncaught page errors: 0;
- CLS: 0 во всех локальных сценариях;
- captured LCP: 124–240 ms в локальном тёплом production-like harness; это health control, не production claim.

Screenshots показывают согласованную article identity и сохранённое состояние bookmark/theme. Mobile tap target, а не просто видимый icon, был реальным инициатором действий.

## Вывод

Нового дефекта в shared reader controls у пяти статей не обнаружено. Wave 33 намеренно не увеличивает matrix: уже открытые проблемы quiz-source handoff, bottom-neighbour navigation и print-policy parity не следует дублировать исправными save/theme/share/print/scroll/settings проявлениями.

Постоянная проверка новых series routes всё же должна сохранять этот минимальный native capability набор, но отдельная новая system lane для него без отказа текущего output не обоснована.

Product source не изменялся, комментарии в #2217 не оставлялись.
