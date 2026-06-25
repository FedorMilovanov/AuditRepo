# Repairs

Сюда складываются документы implementation-agent'ов.

Пример структуры:

```text
repairs/
  2026-06-25/
    GB-P0-RUNTIME-001/
      PLAN.md
      PATCH_SUMMARY.md
      VERIFICATION.md
```

Правило:
- implementation docs не должны жить в `incoming/`
- verified bug ledger не должен переписываться implementation-agent'ом напрямую без reverify
