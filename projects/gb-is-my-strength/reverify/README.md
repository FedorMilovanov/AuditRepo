# Reverify

После значимых push в source repo сильный verifier должен сверять текущий HEAD с verified ledger.

Формат файла:

```text
CURRENT_HEAD_REVERIFY_<date>_<sha>.md
```

В этой папке фиксируются переходы статусов:
- confirmed-current
- fixed-current
- stale-on-current-head
- regression
- needs-manual-check
