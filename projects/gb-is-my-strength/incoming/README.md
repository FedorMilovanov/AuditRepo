# Incoming

Сюда агенты складывают **сырые отчёты**.

Формат:

```text
incoming/<agent-name>/<YYYY-MM-DD>/
```

Пример:

```text
incoming/arena-agent/2026-06-25/
```

Правило:
- не редактировать чужие intake-папки задним числом;
- если нужен апдейт, создать новый dated intake;
- synthesis делать в `working/`, не здесь.
