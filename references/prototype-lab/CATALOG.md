# Отдел разработок — каталог реальных образцов

[Общий вход](../PROTOTYPE_LAB.md) · [Правила работы](DEVELOPMENT_DEPARTMENT.md)

Это **навигация, не зеркальный backlog и не realtime монитор веток**. Даты/статусы ниже — снимок по проверке 2026-11-08; прежде чем действовать, заново открыть PR и README на соответствующей ветке. Каталог перечисляет **реальные артефакты и их текущую границу**, а не идеи улучшений.

| Эксперимент | Где искать рабочий образец | Что уже существует | Статус / следующий шаг |
|---|---|---|---|
| Reader «На полях» — исследовательская панель | [полный исходник и контрольные суммы](../../projects/gb-is-my-strength/prototype/study-panel-lab/AUDITREPO_HANDOFF.md) | 65 оригинальных файлов (JS/CSS/HTML, тесты, документация, 43 PNG), manifest SHA-256; исходный Product e4eb066 | **IMPORTED / source exact-match 2026-11-13**; архив лаборатории, прежние 125 PASS относятся только к исходной версии, чистая сборка в AuditRepo пока NOT RUN; дальше owner UX review и right-panel-only пилот, не Product live |
| Grok Desktop Reader | [папка в main](../../projects/gb-is-my-strength/prototype/grok-desktop-reader/README.md) | HTML reference V22–V26, QA, передачи агентам и Product-заметки | Реальные reference-файлы в main; актуальные визуальные решения проверить в project README; **не** считать live Product |
| Book Engine v7 | [папка в main](../../projects/gb-is-my-strength/prototype/book-engine/v7/README.md) | HTML-прототип и исторические аудит/QA | Исторический образец; перед продолжением выяснить, актуален ли этот design owner |
| Имена Бога — Atlas / Sozvezdie | [AuditRepo draft PR #538](https://github.com/FedorMilovanov/AuditRepo/pull/538) | Два независимых React-прототипа и проверенные кандидаты; код **пока в ветке PR**, не в main | `lab-active` на ветке PR; Research [#379](https://github.com/FedorMilovanov/Research/pull/379) не разрешает публикацию; проверять head, webkit/права/owner review |
| HOREB 3D — пещера и горящий куст | [AuditRepo draft PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) · `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d/` | Импортированный Vite/React/Three.js проект: 8 зон, 25 исходных карточек, `package.json`, `src/`, `tests/`, `original/`, Arena agent prompt и 42-сценный бриф | **IMPORTED / LAB DEVELOPMENT**: исходники и ZIP побайтово проверены, CI AuditRepo зелёный; свежие npm build/browser/WebKit/редакция — отдельные gates, не Product |

**Важно:** два отдельных UI-образца и HOREB 3D — **три различных эксперимента** на тему имён Бога, не три Product-маршрута. Их связь через научный Research, но никакой автоматической публикации.

## Появление нового проекта

Если уже имеется исполняемый HTML/React/Three.js/Canvas/WebGL исходник, сохранить исходный reference/ZIP (SHA-256), завести отдельный `projects/<product>/prototype/<slug>/`, положить README + один агентский checkpoint и привязать существующую рабочую ветку/PR. После этого добавить **одну** строку в таблицу. Если есть только предложение/промпт — хранить его в Research/WORK_QUEUE или как `intake-pending`, **без** объявления проекта работающим.

## Как проверять состояние проекта

1. Проверить branch/PR и файлы в GitHub **сейчас** (не полагаться на строку каталога).
2. Найти runnable entrypoint, зависимости, assets и тесты.
3. Открыть project checkpoint и последние evidence.
4. Назвать: `source-present`, `build-pass`, `browser-pass`, `owner-approved`, `editorially-cleared`, `integrated` — это независимые факты.
5. Работать там же, не создавать конкурирующую реализацию.

Для HOREB [PR #543](https://github.com/FedorMilovanov/AuditRepo/pull/543) уже содержит исходники, SHA-256 оригинального ZIP, manifest и инструкции Arena; проверено 2026-11-08. Следующий агент обязан **получить эту ветку** — в `main` файлы могут отсутствовать до merge. Наличие исходников не означает успешного clean build и editorial approval.
