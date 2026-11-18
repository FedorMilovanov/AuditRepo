# HOREB 3D — Имена Бога: перед Святым

## Актуальное состояние · 18.11.2026 · W12D.7 — ограниченная коррекция складок стоянки

**Текущая кодовая волна:** W12D.7, отдельный кандидат на основе полностью проверенной W12D.6 `dd90c52a0218d4ca15f944e8ec307130a35f6493`. [W12D.6 HOREB QA #44378422909 — 6/6 SUCCESS](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44378422909), [Validate #44378422708](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44378422708) и [Preflight #44378422704](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44378422704) SUCCESS; 151/151 source, 198/198 geometry, 8/8 placement, полный Chromium и четыре независимых пешеходных задания. Сравнены настоящие PNG `homestead-walk-interior.png` и `homestead-walk-mobile390.png` с W12D.5.1: сетка волокон стала менее механической, новых крупных пятен, световых щелей, смещения навеса, корзин или элементов управления нет. Это **локальный целевой ART PASS W12D.6**, не всей среды.

**Что добавлено W12D.7:** только более естественные *трёхмерные* складки существующей 28×14 задней ткани при неизменных геометрии крыши, габаритах коллизий и едином процедурном материале. Реальная независимая локальная Windows/CPU-Chrome-проверка, TypeScript, Vite и 152/152 source, 198/198 geometry, 8/8 placement успешны; новые контрольные точки строго держат ткань перед закрывающим фронтоном и внутри прежнего препятствия. **Новому HEAD W12D.7 требуется собственный 6/6 HOREB QA + Validate/Preflight и проверка точных новых CI PNG; до этого W12D.7 ENGINEERING/ART = HOLD.**

**Текущая архитектура:** реальные независимые 3D Нил (Исх. 2:1–6), колодец Мадиама (Исх. 2:16–17), условная семейная стоянка (Исх. 2:18–21), отдельный Хорив (Исх. 3–4); 42 досье — сохранённая лаборатория Research, а не 42 личных имени Бога. Эпизод Гирсама и большая часть последующего Египта/Исхода остаются текстовыми переходами. Визуальная реконструкция материалов/дома/географии **условна**, не археологически доказана.

**Глобальные HOLD:** дальнейшая художественная режиссура, персонажи/стада, настоящие GPU Android/iOS, Research/редактура/права, голос и релиз. Только один [Draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) и каноническая ветка `lane/horeb-3d-lab-20261108`. Никаких `main` merge, Product/Research, force-push/deploy, новых веток или вмешательства в незавершённую Windows W10D `NilePrelude.ts`. Статусы всегда проверять на точном SHA.

Основной актуальный ретроспективный акт: [HOREB_WORLD_SPLIT_EXODUS_TIMELINE_V1.md](audit/HOREB_WORLD_SPLIT_EXODUS_TIMELINE_V1.md). Раздел W1 ниже — сохранённый исторический план, а не нынешнее состояние реализации.

**Раздел:** AuditRepo → [Отдел разработок / Prototype Lab](../../../../../references/PROTOTYPE_LAB.md) · `gb-is-my-strength` → `prototype/imena-boga/horeb-3d/`.

**Статус:** `IMPORTED / LAB DEVELOPMENT`; настоящий исходный Arena-проект находится в [Draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) на ветке `lane/horeb-3d-lab-20261108`. **Не Product, не деплой и не редакционно опубликованный материал.**

## Новый сюжетный маршрут — W1 (15 ноября 2026)

**Готовится хронологическая экспедиция «Исход 3–40».** Купина перестаёт
быть концом большого музея: после призвания Моисей возвращается
в Египет, затем море, Марра, Рефидим и Синайский завет.
**«Патриархи» получают самостоятельный будущий мир**. Более поздний
Ветхий Завет и Новый Завет остаются отдельными планируемыми мирами.

[Решение, волны и независимые ворота](audit/HOREB_WORLD_SPLIT_EXODUS_TIMELINE_V1.md)
· `src/imena-boga-horeb-3d/data/storyWorlds.ts` — проверяемый план
распределения 42 ID. **Внимание: это не внедрённая геометрия новой
экспедиции**; исходная линейная лаборатория сохранена до отдельной W2.
Никакой Product merge/deploy, редакционные `HOLD` действуют.

## Начать здесь

1. **[AGENT_HANDOFF.md](AGENT_HANDOFF.md)** — фактическое состояние, иммутабельный источник, SHA, тесты, допуски, ближайшая работа.
2. **[AGENT_NEXT_PROMPT.md](AGENT_NEXT_PROMPT.md)** — рабочий запрос для Arena Agent, который продолжает *этот* код.
3. **[ARENA_ORIGINAL_README.md](ARENA_ORIGINAL_README.md)** — неизменённая оригинальная инструкция Arena, переименованная при импорте для сохранения лабораторной навигации.
4. **[SOURCE_PROVENANCE.md](SOURCE_PROVENANCE.md)** · [IMPORT_MANIFEST.json](IMPORT_MANIFEST.json) · [original/arena-horeb-original.zip](original/arena-horeb-original.zip) — происхождение и побайтовый оригинал.
5. **[docs/SCENE_MAP.md](docs/SCENE_MAP.md)**, **[docs/SOURCE_AUDIT.md](docs/SOURCE_AUDIT.md)**, **[audit/acceptance-matrix.md](audit/acceptance-matrix.md)**, **[audit/iteration-log.md](audit/iteration-log.md)** — имеющийся маршрут и подтверждённые/незакрытые проверки.
6. **[briefs/SCENE_SPEC_42.md](briefs/SCENE_SPEC_42.md)** — режиссура 42 различных исследовательских экспозиций (исторический художественный бриф, только после сохранения имеющегося проекта).

## Что действительно импортировано

Исходное приложение React 19 / TypeScript / Vite / Three.js, 8 пространственных зон, 42 исследовательские записи Research (29+13), управление от первого лица и на мобильных устройствах, аппарат снятия обуви и ограничения у горящего куста, доступный режим чтения с/без JS, детальные unit- и браузерные тесты. Ключевые файлы:

- `package.json` и `package-lock.json`;
- `src/imena-boga-horeb-3d/HorebApp.tsx`;
- `src/imena-boga-horeb-3d/engine/World.ts`, `SceneZones.ts`, `BurningBush.ts`, `nav.ts`;
- `src/imena-boga-horeb-3d/data/exhibits.ts` и `validate.ts`;
- `tests/run.mjs`, `tests/test.sh`, `tests/e2e.mjs`, `tests/regression.mjs`, `tests/generate-reader.mjs`;
- `public/reader.html` — исторически сгенерированный HTML без JavaScript.

Подтверждённый первоначальный импорт: коммит `4d9ec9f7899ff6f6af349f404460e9137b4766b8`. SHA-256 исходного ZIP: `c2267894e1369f96244f0df9b78b51acfc5ccfeb4838f25037b2ec1551b14fa9`. SHA каждого исходного файла проверен против Git-дерева при импорте. Архив `.test-build` сохранён **в оригинальном ZIP**, а не включён в активное дерево.

## Локальная разработка

```bash
cd projects/gb-is-my-strength/prototype/imena-boga/horeb-3d
npm ci
npm run build  # prebuild regenerates reader.html and fonts from the 42-entry registry
npx tsc --noEmit
sh tests/test.sh
npm run dev  # predev regenerates reader.html and fonts
```

Браузерные тесты: `tests/e2e.mjs` и `tests/regression.mjs`; см. оригинальный README для переменной `PW_PATH`. Версии и браузерный результат нужно засвидетельствовать в текущей рабочей ветке. **Наличие исходников и 24/24 повторённых unit-тестов из архивного предварительно скомпилированного набора не означает проверку чистой сборки после `npm ci`.** Реальные GPU/WebKit/Firefox и редакционная сверка — отдельные незакрытые ворота.

## Границы

- Основное исследование [Research #379](https://github.com/FedorMilovanov/Research/pull/379): 29 + 13 = **42 исследуемых обозначения**, не «42 личных имени Бога», **0 публикационных допусков**.
- Прототипы [Atlas/Созвездие #538](https://github.com/FedorMilovanov/AuditRepo/pull/538) — **отдельные** концепции; не переписывать.
- Сайт [gospod-bog.ru](https://gospod-bog.ru/) / [Product](https://github.com/FedorMilovanov/gb-is-my-strength) — отдельный владелец. Никакой автоматической замены страниц, публикации или Product-переноса.
- Все карточки `HOLD` до независимого source/editorial/rights review. Благоговейная сценография, без визуального изображения Бога; куст должен быть **вне** художественной пещеры на Хориве. Даже после снятия обуви внутренний запрет подхода к кусту действует.

**Один прототип — одна каноническая ветка/PR.** Следующий агент должен читать и менять **реальные исходники** здесь, а не создавать новоявленное приложение с таким же названием.

## Доказательный браузерный smoke-тест (не входит в 88 unit/geometry)

Запусти в отдельном терминале `npm run dev -- --host 127.0.0.1`, затем:

```bash
HOREB_BASE_URL=http://127.0.0.1:5173 HOREB_BROWSER_PATH=/path/to/chrome npm run test:browser:smoke
```

На Windows в PowerShell: `$env:HOREB_BROWSER_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npm.cmd run test:browser:smoke`.
Проверка использует реальный Chromium, не отключает web security и **падает**, если браузер или работающий сервер недоступны; не объявлять её PASS при SKIPPED. Проверяются загрузка, фокус модального окна, старт WebGL, 42 размещения, WASD, пауза анимации на время диалога, HTML reader с 42 статьями, no-WebGL fallback и мобильный viewport. Скриншоты: `.test-build/screenshots/smoke-*.png` — локальные QA-артефакты, не источник исторических фактов и не GPU-бенчмарк.

Для полного прохода всех 42 экспонатов в Chromium с настоящими проверками панели и источников: `npm run test:browser:exhibits` при работающем Vite-сервере и `HOREB_BROWSER_PATH`. Каждая метка проверяется через ограниченный `teleportTo` (защита от стен/границ), появление точного prompt ID, клавишу E, правильное досье и Esc. **PASS только при 42/42**, ошибки перечисляются с ID; физическую историческую точность тест не доказывает.
