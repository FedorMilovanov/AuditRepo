# Кандидат v0.7 — оба сайта «Имена Бога» (исполняемые исходники)

**Статус:** `LAB-VERIFIED / PUBLICATION-HOLD`. Это не production и не разрешение публиковать непроверенные богословские утверждения.

Содержимое:
- `atlas/` — светлая Астролябия (36 тем): Canvas-орбиты, поиск, медальон, лексические таблицы.
- `sozvezdie/` — тёмное Созвездие (29 тем): орбитальный читатель, панель фокуса имени, фон Синая, развитые средства чтения.
- `source-manifest.json` — SHA-256 каждого сохранённого файла (формируется после копирования).

**Эта папка — точная QA-проверенная исходная версия, а не копия `node_modules` или `dist`.** Оригинальные ZIP и исходные поздние Arena reference остаются нетронутыми на соседних уровнях.

## Проверка 2026-11-07

- Windows Node 22.23.1, Vite 7.3.2: `npm.cmd ci`, `npm.cmd run build` и `tsc.cmd --noEmit` для A и B — **PASS**.
- Chromium: Астролябия + Созвездие при 320, 390, 768, 1440 px — **8/8**, JS pageerror=0, нет горизонтального overflow; фото Синая под вложенным URL `/preview/imena-boga/` реально декодировано (naturalWidth=1672).
- `sozvezdie/npm.cmd run qa` — **78/78**, включая клавиатуру, мобильные модальные окна, прогресс чтения, переключение анимаций и поздравление после 29 имен.
- Отдельный воспроизводимый инцидент **React hook-order crash**: первоначально `motionOn && !useReducedMotionConfig()` вызывал хук условно и полностью уничтожал React-дерево при выключении движения. Исправлено на безусловный `const prefersReducedMotion = useReducedMotionConfig();` + независимое вычисление `shouldAnimate`. Проверены оба направления `on→off→on`, React-дерево и ReaderDock остаются.
- QA очищен от ложных ожиданий: 13 радиальных узлов отдельно от кнопки новой линзы; точная строка о числовых значениях; корректная цитата Исход 3:15; shortcuts не похищают события у сфокусированной кнопки; финишное `M` ждёт действительного перехода к последнему разделу.
- Устранён запрос несуществующего `/favicon.ico` лишь в standalone Vite. В Product favicon/SEO принадлежат Astro.
- Статические source contracts и deterministic effect/keyboard handlers проходят в исходном пакете. Browser QA не доказывает WebKit, Lighthouse/LCP/INP, лицензионность медиа или редакционную истинность.

## Следующие стадии

1. Сравнение снимков владельцем, low-end mobile и WebKit; реальные замеры FPS, INP, CLS/LCP.
2. Проверить право на фотографию Синая, шрифты; публикационные статусы Research #379 до передачи любого текстового утверждения в Product.
3. Только после owner-approved `adaptive-approved` transfer: native `gb-is-my-strength` Astro + route-local React islands, `/imena-boga/` и `/imena-boga/atlas/`, с текущим registry/Reader/Search/SEO.
4. После Product cutover только Product остаётся изменяемым владельцем страниц. Этот v0.7 reference фиксируется по Git SHA и не продолжается как параллельный production fork.

**Не использовать `npm run build` в этой папке как доказательство live-сайта.** Это отдельные Vite reference builds.
