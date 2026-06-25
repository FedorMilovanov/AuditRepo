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

---

## C-04 — PS-01 `qs is not defined` now TRIPLE-confirmed (resolve C-01)

C-01 noted a disagreement (README "needs-reverification / not statically reproducible" vs Playwright). This is now settled with **three independent methods**:

- `arena-agent` — Playwright on production-like `dist` (browser).
- `arena-agent-2` — Node DOM-stub `require()` with `readyState:'complete'` (deterministic, no browser).
- `arena-agent-verifier-2` — jsdom executing the shipped `js/floating-cluster-controller.js?v=35a91710` (third method): `ReferenceError: qs is not defined at initTocPopups(...) at Document.eval(...:348)`; theme click does not toggle `html.dark`; `window.__gbCluster === undefined`.

**Resolution:** PS-01 = `confirmed-browser` + `confirmed-runtime`. The earlier "not statically reproducible" line is correct *only* because it is a lexical-scope defect that needs **execution** (or careful structural reading of IIFE close at line 389), not a grep. Mark C-01 CLOSED → confirmed.

Root cause (agreed across agents): `initTocPopups`/`initActionHandlers`/`initPlayExpand` are declared AFTER the IIFE close (`})();` line 389) but call `qs`/`qsa` which are local to the IIFE; under `<script defer>` the `ready()` callback runs synchronously and throws before `roots.forEach(initCluster)`. Blast radius = **23 pages** (8 articles + 5 nagornaya + 10 baptisty-rossii), not 13 (interactive-audit didn't test baptisty-rossii). Fix = move the three functions inside the IIFE.

---

## C-05 — P0-2 `floating-cluster.css` "empty" = FALSE POSITIVE (independent second confirmation)

Both `arena-agent-2` and `arena-agent-verifier-2` independently verified `css/floating-cluster.css` = **1869 lines / 68596 bytes / 374+ selectors** (incl. all `.gb-ember*` state rules). P0-2 is a false positive. Recommend CLOSED.

Implication for V2/NEW bug "premium play-ember broken on baptisty/nagornaya": the ember visual breakage on those 15 pages is NOT because the CSS file is empty — it is because those legacy pages **do not LINK** `floating-cluster.css` at all (only the migrated/pilot pages do). So the issue is a per-page missing `<link>`, not an empty stylesheet.

---

## C-06 — feed.xml has TWO independent date bugs (do not dedupe)

- P2-6 (existing): pubDate uses `+0000` instead of Moscow `+0300`.
- V2-4 (new, arena-agent-verifier-2): weekday names disagree with the date (`Sat, 31 May 2026`→actually Sunday ×3; `Thu, 01 May 2026`→actually Friday ×6) per RFC-822.

These are different defects in the same file and should both be fixed.
