# Проход: Mobile Chrome Platform — движок на весь сайт (3 движка)

**Дата:** 2026-07-11 (утро, владелец проснулся: «движок выносим и потом на все страницы»)
**Репо:** `FedorMilovanov/gb-is-my-strength`
**План:** `auditrepo/references/gill-mobile/gill-research-3-engines-package.zip`
(докты 03 «Архитектура трёх движков», 04 «План внедрения», патчи 0100/0101)

## Суть плана (перепроверен)
Один общий каркас `MobileChromeShell` + три тонких адаптера:
- **series** (Гилл): dual progress, Series+Part TOC, Обучение;
- **article** (Герменевтика): single progress, Article TOC, без series-артефактов;
- **page** (неконтентные): Back·Home·**Глобальный Поиск** сверху (вместо
  «Обучения»), без Learning/TTS/фейкового прогресса; поиск = существующая
  палитра, второй поиск не создаётся.
Порядок: shell(2) → Gill adapter(3) → Herm adapter(4) → page pilot(5) →
registry(6) → freeze → rollout. Движок выбирается registry, НЕ по pathname.

## Статус
- **Этап 2** (shell в `_shared/`) — был сделан прошлой сессией, файлы в main,
  но НЕ использовались (0 импортов).
- **Этап 3 — ✅ смёржен** (PR #85 → `2aabea4`): Gill series-адаптер.
  - Shell v2: слоты — ПРЯМЫЕ дети header/footer (легаси `.mobile-bottom-bar >
    .gb-icon` жив; display:contents-обёртка сломала бы `>` — селектор матчится
    по DOM, не layout); `topAttrs/bottomAttrs` для контрактных атрибутов;
    `.mobile-chrome{display:contents}` аддитивно в floating-cluster.css.
  - PIXEL PARITY: 68 элементов баров идентичны (rect/классы/display/position)
    в 3 темах; 6 ожидаемых DIV→HEADER/FOOTER. Смоук: Обучение/Настройки/
    part-TOC/рельса+1.5×/тема — работает, 0 JS-ошибок.
- **Этап 4 — PR #86** (ждёт CI): Hermenevtika article-адаптер.
  - hmtop/hmbar через topClass/bottomClass; TOC-лист в слот overlays.
  - PARITY: 129 элементов идентичны (день+ночь); 7 «диффов» иконок ☀/🌙 ночи
    оказались гонкой замера со spring-морфом 0.42s — с отключёнными
    транзишенами замер байт-в-байт стабилен и равен детерминированному концу
    анимации (sun 18=36×.5, moon 36). Смоук: TOC+фильтр/настройки+сепия/
    рельса/тема — зелёный.
- **Этапы 5+6 — PR #87** (ждёт CI): page-движок + registry, пилот /articles/.
  - `MobileChromePage`: Back(history/фолбэк)·Home·«Поиск по сайту…»; хук поиска
    `data-fc-action="search"` → сайтовый lazy-loader → палитра GBSearch;
    нижнего бара нет; появление бара синхронизировано с автоскрытием родного
    navbar (`.nav-hidden`), фолбэк 160px — «двойной шапки» нет.
  - Shell v3: header/footer рендерятся только при заполненных слотах.
  - `mobileChromeRegistry.ts`: mount static (Гилл ×6, Herm) / registry
    (каталог — первый потребитель `mobileChromeFor()`).
  - **Баг найден при верификации:** класс `.gb-search-btn` как хук коллидировал
    с `command-palette.css` (иконочная кнопка) — прятал текст лейбла
    (span display:none, 0×0). Урок: сайтовые классы с готовой вёрсткой не
    использовать как event-хуки; лоадер слушает и атрибут.
  - Верификация: наверху бар спрятан/navbar родной; на скролле выехал (53px,
    top:0); тап → палитра GBSearch (ВСЕ/СТАТЬИ/ПИСАНИЕ/АВТОРЫ) открылась;
    десктоп display:none; регрессия Гилл/Herm зелёная; 0 JS-ошибок.

## Ключевые находки для этапа 5 (пилот: каталог /articles/)
- Каталог — 100% native (ArticlesPageChrome/Main/Footer), СВОЙ бургер-хедер,
  floating-cluster.css/controller НЕ подключены.
- На каталоге УЖЕ есть **lazy-loader сайтового поиска** (инлайн в футере):
  клик по `#gbSearchBtn, [data-gbs2-search], [data-fc-action='search'],
  .gb-nav-search-icon, .gb-search-btn` или Ctrl/Cmd+K → лениво грузит
  `js/search.js` → `GBSearch.open()`. Значит page-движку **не нужен
  controller** — достаточно кнопки с классом `.gb-search-btn`.
- Обычная статья (напр. 20-antisovetov) на мобиле ВООБЩЕ без верхнего бара
  (только крошки) — кластер `gb-floater` скрыт. Это гэп, который закроет
  распространение движков после пилота.
- Замер-урок: перед parity-дифом отключать транзишены
  (`*{transition:none!important}`) — иначе ложные диффы от кадров анимации.

## Дизайн пилота page-движка
- `_shared/MobileChromePage.astro` — самодостаточный адаптер (scoped-стили в
  компоненте — прецедент HermenevtikaMobileBar): shell engine="page", top bar
  mobile-only: Back(история/fallback href) · Home · строка «Поиск по сайту…»
  (class gb-search-btn → лоадер открывает палитру). Нижнего бара НЕТ (по плану
  §8). Появление бара — после скролла мимо родного хедера (no двойной шапки).
- `_shared/mobileChromeRegistry.ts` — route→{enabled, engine, adapter};
  каталог = первая запись; страницы читают registry при сборке.

## ИТОГ: план выполнен полностью — все 6 этапов в main
- Этап 3 (Gill series) → PR #85 → `2aabea4`
- Этап 4 (Herm article) → PR #86 → `2d842a0`
- Этапы 5+6 (page engine + registry, пилот /articles/) → PR #87 → `af59a21`
- Попутно: разблокировка CI — PR #88 → `f4a74f0` (5 свежезалитых pastor-series
  MDX без владельца красили native-source-contract для всех PR; помечены явным
  contentStatus:"draft" по контракту аудита; снять при подключении профилей).

Все три движка живут в проде: **series** (Гилл ×6 маршрутов), **article**
(Герменевтика), **page** (каталог /articles/: Back·Home·Поиск сверху, палитра
GBSearch, появление синхронно с автоскрытием родного navbar). Registry —
единая точка конфигурации; rollout на остальные страницы = записи в
mobileChromeRegistry.ts (+ для page-страниц вставка MobileChromePage).

По плану далее: freeze 10–14 дней без layout-экспериментов (только блокирующие
фиксы), production monitoring, затем rollout.
