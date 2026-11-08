# HOREB 3D — Имена Бога: перед Святым

**Раздел:** AuditRepo → [Отдел разработок / Prototype Lab](../../../../../references/PROTOTYPE_LAB.md) · `gb-is-my-strength` → `prototype/imena-boga/horeb-3d/`.

**Статус:** `IMPORTED / LAB DEVELOPMENT`; настоящий исходный Arena-проект находится в [Draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) на ветке `lane/horeb-3d-lab-20261108`. **Не Product, не деплой и не редакционно опубликованный материал.**

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
