# Project Registry

Список проектов, для которых AuditRepo накапливает мультиагентные аудиты и evidence.

Registry хранит только стабильную ориентацию. Текущие source HEAD, deploy SHA, counts, открытые PR и выбранные repair lanes живут в соответствующих source-репозиториях и project-scoped документах, а не дублируются здесь.

## Active projects

| Project folder | Source repo | Status | Start here |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | [`DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md) |
| `projects/the-legendary-poet/` | `FedorMilovanov/TheLegendaryPoet` | **active** | [`DOC_MAP.md`](projects/the-legendary-poet/DOC_MAP.md) |

## Status glossary

- `active` — AuditRepo принимает новые проходы, verification waves и closures;
- `intake-only` — есть сырые отчёты, но нет устойчивого synthesis;
- `synthesizing` — выполняется пакетная дедупликация/root-cause analysis;
- `paused` — evidence сохраняется, активная работа временно не выбрана;
- `archived` — проект больше не ведётся активно, история сохранена.

Статус проекта не меняется автоматически из-за движения source HEAD.

## Adding a project

```bash
python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]
```

После создания проект должен объяснить:

- где лежит raw intake;
- где active backlog;
- где system themes;
- где optional work queue;
- какой build/runtime context важен для предотвращения ложных findings.
