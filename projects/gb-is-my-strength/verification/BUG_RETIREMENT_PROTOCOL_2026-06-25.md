# Bug retirement protocol — gb-is-my-strength — 2026-06-25

## Rule

A bug is not retired because one agent says “looks fixed” or “not reproducible”.

It must first become:

```text
suspected-stale
```

Then go through a structured review.

---

## Retirement flow

1. Mark candidate as `suspected-stale`
2. Open a retirement review document
3. Collect at least 2 negative witnesses from different angles
4. Decide one of:
   - `fixed-current`
   - `false-positive`
   - `stale-on-current-head`
5. Move obsolete supporting docs into archive bucket if needed

---

## Negative witness examples

### Source negative witness
- selector no longer exists in source
- duplicate ID removed from component source

### Artifact negative witness
- production-like build no longer contains stale string / markup / hash drift

### Browser negative witness
- click now works
- error no longer reproduced
- overlay now opens/closes correctly

---

## Not enough to retire

These are not enough by themselves:
- one grep says “not found”
- one agent eyeballs the page
- one older ledger says false positive
- route shell changed but no browser recheck was done

---

## Suggested artifacts

Use:
- `projects/_templates/SUSPECTED_RETIREMENT_TEMPLATE.md`
- `scripts/scaffold_retirement_review.py`
