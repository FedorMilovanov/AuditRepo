# Multi-witness Verification Protocol

This repository should move from “one agent says so” to “2–3 witnesses from different angles”.

---

## 1. Principle

A bug should not become strong truth just because one agent wrote a persuasive report.

### Preferred path

```text
single witness
→ second witness from a different angle
→ third witness for deep root-cause confidence
→ verified / repair-ready
```

---

## 2. Witness types

### W1 — Source witness
Confirms the issue directly in source files.

Examples:
- wrong selector in JS
- duplicate hardcoded IDs in component source
- stale hidden meta in source HTML / Astro component

### W2 — Artifact witness
Confirms the issue in a built artifact.

Examples:
- plain `dist`
- strangler production-like `dist`
- copied legacy artifact

### W3 — Browser witness
Confirms real runtime behavior.

Examples:
- button click does nothing
- console/page error
- overlay does not open
- hidden metadata mismatch rendered in page

### W4 — History / regression witness
Useful supporting witness.

Examples:
- git history proves when bug was introduced
- older report shows behavior changed between SHAs
- route shell changed and audit assumptions became stale

---

## 3. Status by witness count

### 1 witness only
Allowed statuses:
- `suspected`
- `reproduced-by-agent`
- `needs-cross-verification`

### 2 witnesses from different angles
Allowed statuses:
- `confirmed-on-sha`
- `likely-current`

### 3 witnesses or production-like browser witness
Allowed statuses:
- `confirmed-current`
- `repair-ready`

### Exception
A very strong `verified-production-like-dist` browser reproduction may be enough to treat a bug as repair-ready even if only one agent performed it — but that document must say so explicitly.

---

## 4. Retirement / cancellation rules

A bug must **not** be removed just because one later agent says “I don’t see it”.

### Correct retirement path

```text
confirmed-current
→ suspected-stale
→ recheck opened
→ at least 2 negative witnesses from different angles
→ false-positive / fixed-current / stale-on-current-head
→ archive
```

Negative witness examples:
- source no longer contains defect
- production-like browser no longer reproduces defect
- build artifact no longer contains defect

---

## 5. Deep-root protocol

Not all witnesses are equal. Three witnesses should ideally look from different angles:

### Surface witness
What the user sees.
- broken click
- wrong visible text
- overlay missing

### Mechanism witness
What code/path causes it.
- selector mismatch
- controller not loaded
- ownership guard suppressing legacy runtime

### Lifecycle witness
Why it stayed / reappeared.
- stale hash system
- old verified doc on outdated SHA
- audit selector drift after route-shell evolution

When all three exist, the repair order is much more stable.

---

## 6. Required wording in reports

Use explicit labels:
- `verified-source`
- `verified-build`
- `verified-browser`
- `verified-production-like-dist`
- `suspected-stale`
- `false-positive`
- `audit-drift`

Do not just write `verified` without saying the witness angle.
