# Prototype Lab — лаборатория интерфейсов и исследовательских прототипов

**Статус:** навигационный вход в уже существующие `projects/<project>/prototype/` — не новый репозиторий, не Product-ветка и не вторая матрица ошибок.

Здесь сохраняются исходные макеты и альтернативные реализации, сравниваются сильные стороны агентов, проверяются гипотезы и готовятся **выборочные переносы** в Product. Самостоятельный макет допустим как лабораторный результат; он не становится действующим кодом сайта и не создаёт право редактировать Product.

## Существующие лаборатории

| Проект | Эталон / назначение | Текущий статус |
|---|---|---|
| `gb-is-my-strength` | [Grok desktop reader](../projects/gb-is-my-strength/prototype/grok-desktop-reader/README.md) — отбор UX из версий V16–V26 | Reference; пример [PR #537](https://github.com/FedorMilovanov/AuditRepo/pull/537) |
| `gb-is-my-strength` | [Book engine v7](../projects/gb-is-my-strength/prototype/book-engine/v7/README.md) — книжный движок | Исторический prototype/evidence; проверить актуальность перед использованием |
| `gb-is-my-strength` | [Имена Бога — Atlas / Созвездие](https://github.com/FedorMilovanov/AuditRepo/pull/538) — два Arena React-флагмана и четыре версии исходников | Draft PR #538, не Product и не live |

Остальные прежние каталоги `prototype/` не нужно массово перемещать или переименовывать ради новой схемы. Новая лаборатория — **общий метод и индекс, а не новая копия всех файлов**.

## Где располагается проект

```text
projects/<product>/prototype/<experiment>/
  README.md                    # роль, owner, stage, ссылка на Product
  originals/                   # необработанные исходники/экспорты; immutable
  provenance/                  # SHA-256, источник, права, происхождение
  reference/                   # закреплённый визуальный/функциональный эталон
  candidates/                  # только значимые ревизии (при необходимости)
  research/                    # наблюдения, опровержения, QA и решения
  evidence/                    # конкретные скриншоты/отчёты, по делу
  HANDOFF.md                   # появляется только при переносе
```

Каталоги опциональны; **не создавайте пустые папки ради шаблона**. Используйте [шаблон карточки](prototype-lab/templates/PROTOTYPE.md) и [методику](prototype-lab/WORKFLOW.md).

## Операционная модель

`original → independent reference → measured candidate → owner visual decision → Product implementation → frozen reference/evidence`

Исходные версии не перезаписывать. Удачные идеи можно переносить между кандидатами, но отличия фиксировать: что взято, откуда, как изменено и какие проверки пройдены. Отбор сильных деталей **не означает** объединения всех эффектов в одну перегруженную страницу.

**Product — единственный владелец live source, маршрутов, сборки и релиза.** Прототип лаборатории не задаёт текущие framework/route/SEO/reader контракты. После переноса не вести параллельный изменяемый Product-клон в AuditRepo.

## Связь с аудитом

- Raw observations: `projects/<product>/incoming/` или локальное `research/` эксперимента.
- Незначительные улучшения и исследовательские гипотезы: `WORK_QUEUE.md` или исследовательский протокол.
- Подтверждённая необходимая работа: только через реальную повторную проверку в `verified/MASTER_BUG_MATRIX.md`.
- Исторические версии и доказательства остаются доступными через Git, SHA и локальный reference. Не дублируйте изменчивое состояние Product в документации AuditRepo.

Общие правила: [AuditRepo Operating Model](../AUDITREPO_OPERATING_MODEL.md), [Concurrent Edit Protocol](../CONCURRENT_EDIT_PROTOCOL.md). Перед Product transfer действуют **его собственные** `AGENTS.md`, `docs/WORK_MODES.md`, `docs/REFERENCE_TRANSFER_POLICY.md` и route registry.

## Негативные правила

Не переносить токены, почту, закрытые данные или чужие материалы без разрешения; не включать `node_modules`, `dist`, браузерные профили, дампы с секретами. Не выдавать модели/гипотезы за verified. Не делать автоматический merge/deploy из лаборатории и не заменять действующие Product-сервисы вторыми независимыми реализациями.
