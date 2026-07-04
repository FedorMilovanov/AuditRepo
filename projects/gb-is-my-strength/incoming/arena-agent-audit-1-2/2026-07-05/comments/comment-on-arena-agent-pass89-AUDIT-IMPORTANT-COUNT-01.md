# Comment on Finding — Severity Challenge

## Target

- **Target report:** `incoming/arena-agent-pass89/2026-07-05/REPORT.md`
- **Target finding ID:** AUDIT-IMPORTANT-COUNT-01
- **Comment type:** challenge (severity)
- **My audited SHA:** `8c318010`
- **Mode:** verifier + matrix-reconciliation

## Summary

AUDIT-IMPORTANT-COUNT-01 (Pass 89) rates "floating-cluster.css 490 !important" as **P3** (metric clarification). I rate the same file as **AUDIT-P1-FC-IMP** (P1 guard gap). Root cause differs. I challenge the P3 rating.

## Evidence

**Pass 89's reasoning:**
> "Ранее в матрице указывалось 524 `!important` для floating-cluster.css. Корректировка: 490 на `8c318010`. Всё ещё катастрофично (~4.5 !important на KB CSS). Контекст: BUG-CSS-001..017 (Pass 68-70) описывают общий техдолг CSS. Это уточнение метрики."

**My reasoning:**
The critical issue is NOT the count (490), it's the **absence of an automated guard**:

```
audit-pro.js lines 263-276:
  - checks css/site.css !important → ceiling=202 ✅
  - does NOT check css/floating-cluster.css ❌
```

If someone adds 10 !important rules to floating-cluster.css:
- audit-pro.js: ✅ AUDIT PASSED
- validate:static-publication: ✅ all green
- deploy: triggered, content shipped
- Result: floating-cluster.css grows !important debt with no gate

This is a **deploy-safety regression mechanism**, not just a "metric clarification."

## Difference from BUG-CSS-001..017

BUG-CSS-001..017 (Pass 68-70) = architectural CSS debt (cascade depth, selector specificity, naming inconsistency)
AUDIT-P1-FC-IMP = **automated guard gap** (no ceiling check for floating-cluster.css)

These are different problems requiring different repair lanes.

## My Severity: P1 (Guard Gap)

A missing automated guard for a file with 490 !important is P1 because:
1. It enables invisible regression (adding !important = pass all gates)
2. site.css has the same protection (ceiling=202) — inconsistent enforcement
3. AGENTS.md §4.10 explicitly protects site.css but says nothing about floating-cluster.css

## Recommended Action

1. AUDIT-IMPORTANT-COUNT-01 → close as P3 (metric confirmed)
2. AUDIT-P1-FC-IMP → add to matrix as P1 (guard gap, different root cause)
3. Add floating-cluster.css !important ceiling to audit-pro.js: ceiling=490, goal=400 (ratchet only down)

## Current HEAD Evidence

```bash
$ grep -c '!important' css/floating-cluster.css
490

$ grep -c '!important' css/site.css
18

$ sed -n '263,276p' scripts/audit-pro.js
  // Only checks site.css — floating-cluster.css NOT checked
```

## Status Recommendation

contested — need third-party verifier. I propose: P1 for guard gap, P3 for metric debt.
