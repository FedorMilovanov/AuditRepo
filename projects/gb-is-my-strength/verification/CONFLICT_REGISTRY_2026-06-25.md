# Conflict registry — gb-is-my-strength — 2026-06-25

**Purpose:** record contradictions between incoming/verified documents so the next strong verifier or implementation lead does not assume all "verified" statements agree.

---

## C-01 — `qs is not defined` status disagreement

### One document says
`projects/gb-is-my-strength/README.md` currently states:

```text
PS-01 (`qs is not defined`) — needs-reverification — статически не воспроизводится, нужен Playwright на HEAD
```

### Browser-verified evidence from Arena Agent intake says
Production-like Playwright verification reproduced `qs is not defined` on 13 routes, including:
- Hermeneutics
- Kod da Vinci
- 20 антисоветов
- Gill context
- Gill part 1/2/3
- Gill spravochnik
- Nagornaya ch1–5

See intake docs:
- `incoming/arena-agent/2026-06-25/deep-safe-bug-verification-2026-06-25-round2.md`
- `incoming/arena-agent/2026-06-25/premium-surface-bug-matrix-2026-06-25.md`

### Current safe interpretation
Treat `PS-01` as **confirmed in production-like artifact** unless a newer browser run disproves it.
Static source inspection alone is insufficient here.

---

## C-02 — Hermeneutics stray `76e7365` disagreement

### One document says
`projects/gb-is-my-strength/README.md` currently states:

```text
PS-05 (stray "76e7365") — FALSE POSITIVE in HEAD
```

### Browser/build evidence from Arena Agent intake says
The string survives into the production-like artifact body for:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

Confirmed via Playwright/body-text checks after production-like build.

See intake docs:
- `incoming/arena-agent/2026-06-25/premium-svg-pages-bug-investigation-2026-06-25.md`
- `incoming/arena-agent/2026-06-25/deep-safe-bug-verification-2026-06-25-round2.md`

### Current safe interpretation
Treat `PS-05` as **confirmed in production-like artifact** until disproven by a newer browser-verified run.
A source-only grep on HEAD is not enough if the issue is serializer/build-output related.

---

## C-03 — Meaning of “verified” is currently overloaded

Observed problem:
- some docs call something “verified” based on static source inspection;
- other docs call something “verified” based on browser + production-like dist.

### Operational rule going forward
Use explicit evidence tags in future documents:

```text
verified-source
verified-build
verified-browser
verified-production-like-dist
```

This repo should not use one undifferentiated word `verified` when the evidence level differs.

---

## Recommendation

Before implementation starts, the strongest verifier should reconcile:
1. source-layer findings
2. plain Astro build findings
3. strangler production-like dist findings
4. live browser findings

If those are mixed together, contradictions like C-01 and C-02 will keep reappearing.
