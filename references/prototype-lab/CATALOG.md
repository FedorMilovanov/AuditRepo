# Отдел разработок — каталог реальных образцов

[Общий вход](../PROTOTYPE_LAB.md) · [Правила работы](DEVELOPMENT_DEPARTMENT.md)

Это **навигация, не зеркальный backlog и не realtime монитор веток**. Даты/статусы ниже — снимок по проверке 2026-11-08; прежде чем действовать, заново открыть PR и README на соответствующей ветке. Каталог перечисляет **реальные артефакты и их текущую границу**, а не идеи улучшений.

| Эксперимент | Где искать рабочий образец | Что уже существует | Статус / следующий шаг |
|---|---|---|---|
| Grok Desktop Reader | [папка в main](../../projects/gb-is-my-strength/prototype/grok-desktop-reader/README.md) | HTML reference V22–V26, QA, передачи агентам и Product-заметки | Реальные reference-файлы в main; актуальные визуальные решения проверить в project README; **не** считать live Product |
| Book Engine v7 | [папка в main](../../projects/gb-is-my-strength/prototype/book-engine/v7/README.md) | HTML-прототип и исторические аудит/QA | Исторический образец; перед продолжением выяснить, актуален ли этот design owner |
| Имена Бога — Atlas / Sozvezdie | [AuditRepo draft PR #538](https://github.com/FedorMilovanov/AuditRepo/pull/538) | Два независимых React-прототипа и проверенные кандидаты; код **пока в ветке PR**, не в main | `lab-active` на ветке PR; Research [#379](https://github.com/FedorMilovanov/Research/pull/379) не разрешает публикацию; проверять head, webkit/права/owner review |
| HOREB 3D — пещера и горящий куст | [AuditRepo draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) · `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/` | Project README + AGENT_HANDOFF на ветке PR. Исходный Arena ZIP отдельно передан владельцем через import kit | **SOURCE-IMPORT-PENDING**: проверить присутствие `package.json`, `src/`, `tests/`, immutable `original/` в PR. Только потом продолжать Three.js код |

**Важно:** два отдельных UI-образца и HOREB 3D — **три различных эксперимента** на тему имён Бога, не три Product-маршрута. Их связь через научный Research, но никакой автоматической публикации.

## Появление нового проекта

Если уже имеется исполняемый HTML/React/Three.js/Canvas/WebGL исходник, сохранить исходный reference/ZIP (SHA-256), завести отдельный `projects/<product>/prototype/<slug>/`, положить README + один агентский checkpoint и привязать существующую рабочую ветку/PR. После этого добавить **одну** строку в таблицу. Если есть только предложение/промпт — хранить его в Research/WORK_QUEUE или как `intake-pending`, **без** объявления проекта работающим.

## Как проверять состояние проекта

1. Проверить branch/PR и файлы в GitHub **сейчас** (не полагаться на строку каталога).
2. Найти runnable entrypoint, зависимости, assets и тесты.
3. Открыть project checkpoint и последние evidence.
4. Назвать: `source-present`, `build-pass`, `browser-pass`, `owner-approved`, `editorially-cleared`, `integrated` — это независимые факты.
5. Работать там же, не создавать конкурирующую реализацию.

Для HOREB отсутствие исходного кода в ветке **блокирует** дальнейшую реализацию; открытый PR с документацией сам по себе не доказывает импорт.
