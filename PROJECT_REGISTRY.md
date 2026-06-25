# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | active | Стартовый intake загружен, есть route map и первая bug matrix. |

## Status glossary

- `active` — проект в работе, агенты продолжают складывать отчёты
- `intake-only` — папка создана, но есть только сырые отчёты
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — verified matrix и repair order готовы для implementation-агента
- `archived` — проект завершён и заморожен

## How to add a new project

1. Создать папку:
   - `projects/<project-name>/`
2. Создать подпапки:
   - `incoming/`
   - `working/`
   - `verified/`
3. Добавить `README.md` проекта
4. Внести запись в этот registry
5. При первом intake создать:
   - `incoming/<agent>/<YYYY-MM-DD>/README.md`
   - `working/CURRENT_INTAKE_INDEX_<YYYY-MM-DD>.md`
