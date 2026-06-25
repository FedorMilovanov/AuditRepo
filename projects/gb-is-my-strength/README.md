# gb-is-my-strength / gospod-bog.ru

Проект для мультиагентных аудитов сайта:
- source repo: `FedorMilovanov/gb-is-my-strength`
- production: `https://gospod-bog.ru`

## Назначение папок

```text
incoming/   ← сырые отчёты от разных агентов
working/    ← сводные матрицы, route maps, triage notes
verified/   ← финальные подтверждённые bug ledgers
```

## Правило

- `incoming/` не переписывать задним числом;
- каждый агент пишет в свою подпапку;
- сводка идёт только в `working/` или `verified/`.

## Текущий стартовый набор

Первично добавлены отчёты Arena Agent по глубокой верификации premium/runtime/docs-багов на дату `2026-06-25`.
