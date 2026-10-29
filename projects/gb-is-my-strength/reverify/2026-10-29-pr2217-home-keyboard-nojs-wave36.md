# PR #2217: Home keyboard и no-JS parity — широкая волна 36

**Дата:** 2026-10-29  
**Product PR:** #2217, exact head `ff860d39dd107997ba70470960bfb003ebc2be1a`  
**Граница:** detached read-only; Product-файлы, PR, labels и комментарии не изменялись.  
**Профили:** Chromium 153, desktop 1440×900 Light и mobile 390×844 Dark/touch; reduced motion; JavaScript enabled/disabled.

## Зачем эта граница отдельна от волны 34

Волна 34 доказала pointer navigation и визуальное здоровье новых Home-проекций. Она не доказывала, что те же три входа находятся естественным Tab-порядком, активируются Enter и сохраняют смысл при полном отключении JavaScript. Для editorial landing это важная progressive-enhancement граница: loaded DOM или правильный `href` сами по себе не равны нативной клавиатурной навигации.

Проверены три новых входа:

1. series feature card `/otstupniki/`;
2. Евреям 6 mega-card в `#publikacii`;
3. тот же материал в контекстном ряду `#razbor`.

## Exact-head build

На `ff860d39…` заново выполнен:

```text
npm run strangler:build:production-like
→ Astro check: 0 errors, 0 warnings, 7 hints
→ 111 pages built
→ copy/projection/cache-bust/heading/pastor guards passed
```

Семь Astro hints и Shiki fallback для языка `greek` — существующие диагностические сообщения сборки, не ошибка новых Home-карточек. Product checkout после аудита остаётся чистым.

## Native Tab → Enter matrix

Каждый сценарий начинался на новой загрузке `/`. Целевой `<a>` не фокусировался через DOM API: выполнялся реальный `Tab` до совпадения `document.activeElement`, затем реальный `Enter`, ожидался новый pathname и сверялся H1 целевого документа.

| JavaScript | Viewport | Series | Publications mega | Refutations mega |
|---|---|---:|---:|---:|
| enabled | desktop | PASS | PASS | PASS |
| enabled | mobile | PASS | PASS | PASS |
| disabled | desktop | PASS | PASS | PASS |
| disabled | mobile | PASS | PASS | PASS |

Итого: **12/12** нативных переходов. Во всех случаях:

- цель достигнута последовательным Tab;
- Enter выполнил document navigation;
- pathname совпал с href;
- H1 подтвердил identity целевой страницы;
- 0 page errors;
- 0 сломанных Product-изображений.

No-JS переходы не зависят от hydration, custom click handlers или принудительного event dispatch. Разное число Tab до цели объясняется отсутствием JS-injected controls, но целевые ссылки остаются в логичном последовательном порядке.

## Painted no-JS и focus visibility

При отключённом JavaScript обе Home-секции имеют реальную геометрию, `display:block`, `visibility:visible`, `opacity:1` на desktop/mobile. Все три ссылки сохраняют текстовые accessible names и ненулевые border boxes.

Feature card получает нативный `:focus-visible` outline:

- desktop Light: `2px solid rgb(122, 46, 46)`;
- mobile no-JS: `2px solid rgb(122, 46, 46)`;
- mobile Dark с JS: `2px solid rgb(212, 165, 116)`.

Focused locator screenshot на desktop no-JS показывает целую карточку «Отступники», изображение, название, описание, метаданные и видимый контур. Mobile no-JS screenshot показывает, что landing content и редакторская секция не исчезают без runtime.

Первая full-viewport desktop no-JS capture получилась одноцветной при одновременно корректной DOM-геометрии; отдельный fresh-browser locator capture немедленно показал карточку и outline. Это артефакт capture поверхности, а не Product blank-state; вывод не основан на пустом кадре.

## Health controls

На JavaScript-enabled Home Axe дал **0 violations** в обоих viewport. Axe не исполняется в `javaScriptEnabled:false` context, поэтому no-JS accessibility не объявляется Axe-проверенной; там проверены статическая DOM-семантика, sequential focus, painted geometry и реальная навигация. DOM карточек одинаков и не создаётся JavaScript.

- broken Product images: 0;
- page errors: 0;
- attributable console errors: 0;
- блокировка `mc.yandex.ru` и его no-JS tracking pixel помечена как sandbox egress noise;
- local warm LCP: desktop 232 ms, mobile 188 ms;
- CLS: desktop 0.02118, mobile 0.

## Authority и достаточность системы

Две Евреям 6 карточки — не случайный duplicate owner: комментарии и положение явно разделяют «редакторскую опорную полку» и «знаковый ряд» раздела разборов. Feature series card также является ручным editorial choice, тогда как обещание «новые публикации» отдельно и правильно выводится из manifest. Принудительно сводить эти разные promotional contexts в один data registry нет доказанной необходимости.

Ссылки являются обычными `<a>`, поэтому keyboard/no-JS resilience обеспечивается платформой, а не новым runtime contract. Существующий `home-progressive-enhancement-browser-test.js` уже охраняет общий no-JS reveal boundary. Добавлять bespoke gate для каждой editorial card означало бы ненужную сложность без воспроизводимого дефекта.

## Итог

1. Новые Home promotion links имеют keyboard и no-JS parity: 12/12.
2. Focus indication видим, destination identity подтверждена H1, не только URL.
3. Визуальная и runtime health граница остаётся здоровой.
4. Дублирование mega-article на Home семантически контекстное, не authority drift.
5. Новый matrix unit и Product repair не нужны.
6. Арифметика остаётся **56 = 28 direct + 7 improvements + 1 residual + 20 system lanes**.

**Широкая волна 36 завершена.**
