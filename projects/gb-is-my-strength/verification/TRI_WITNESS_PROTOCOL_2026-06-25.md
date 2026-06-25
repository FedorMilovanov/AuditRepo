# Tri-witness protocol — gb-is-my-strength — 2026-06-25

This project now has enough parallel intake that one witness is often not enough.

## 1. Preferred witness stack

### Witness A — Source
Confirms the mechanism in source files.

### Witness B — Artifact
Confirms the issue in `dist` or production-like `dist`.

### Witness C — Browser
Confirms runtime behavior through user-visible interaction.

### Witness D — History (optional)
Useful for regression cause or lifecycle context.

---

## 2. Promotion rules

### To `confirmed-on-sha`
Need at least:
- 2 witnesses from different angles

### To `confirmed-current`
Need at least:
- current HEAD context
- 2 strong witnesses

### To `repair-ready`
Prefer:
- 3 witnesses, or
- one very strong `verified-production-like-dist` browser witness plus mechanism/source witness

---

## 3. Demotion / cancellation rules

Do not jump from `confirmed-current` straight to deletion.

Use:

```text
confirmed-current
→ suspected-stale
→ retirement review
→ false-positive / fixed-current / stale-on-current-head
→ archive
```

---

## 4. Project-specific warning

For `gb-is-my-strength`, source-only witness is often weaker than production-like browser witness because:
- source repo
- Astro dist
- strangler production-like dist

can disagree.

So when witnesses conflict, prefer:
1. production-like browser
2. production-like artifact
3. source-only reading
