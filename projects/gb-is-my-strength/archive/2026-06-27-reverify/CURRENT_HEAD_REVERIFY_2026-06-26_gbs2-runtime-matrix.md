# Current HEAD Reverify — GBS2 Runtime Matrix — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Date: 2026-06-26
- Verifier: `arena-agent`
- Method:
  - production-like dist build
  - Playwright browser witness on local static server
  - route matrix focused on `baptisty-rossii` GBS2 series routes
  - history review in AuditRepo for PremiumControls / phase3 / PC-* claims

Routes tested:
- `/baptisty-rossii/index.html`
- `/baptisty-rossii/dva-sezda-1884/index.html`
- `/baptisty-rossii/goneniya-i-sovest/index.html`
- `/baptisty-rossii/iniciativnaya-gruppa/index.html`
- `/baptisty-rossii/spravochnik/index.html`

Evidence labels:
- `verified-source`
- `verified-production-like-dist`
- `verified-browser`
- `verified-history`

---

## Executive summary

This pass confirms that the **GBS2 control shell is present across multiple baptisty routes**, but the current runtime remains **partially inert** in exactly the way the earlier verifier waves warned about.

The strongest current fact:
- across 5 tested baptisty routes, **theme buttons are rendered in DOM but not visible and do not toggle dark mode**, while search/share UI markers exist in DOM and TOC sheet container exists.

This supports the already-open GBS2 wiring family and provides a stronger route-matrix witness.

---

## History review findings

AuditRepo history shows a dense agent wave around PremiumControls / phase3 / rollout branches:
- `aebbd48` — critical production regression, styles deleted, dist broken
- `2923879` — blast radius analysis
- `8f23365` — phase3 not merge-ready
- `267d682` — rollout verifier matrix
- `975a445`, `f0b1f6e`, `b72f379` — implementation/fix rounds
- `85d9494` — Gill GBS2 clickability fix

### Interpretation
- this history strongly supports the user's warning that multiple agents introduced churn/regressions in the premium controls area.
- current verification should therefore prefer **route-by-route runtime proof** over trusting any single historical verdict.

---

## Dist/source matrix before browser interaction

### Verified in built dist on multiple baptisty routes
For each tested baptisty route:
- `data-gbs2-theme` present: **2**
- `gbs2-sheet` markers present: **23** (text/markup occurrences)
- `data-gbs2-search` present: **2**
- `data-gbs2-share` present: **1**
- `data-gbs2-offline` present: **0**
- legacy floating-cluster markers absent:
  - `data-fc-root` = 0
  - `gb-ember` = 0
  - `data-fc-action="save"` = 0
  - `data-fc-action="theme"` = 0
  - `data-fc-action="search"` = 0

### Interpretation
- baptisty routes are in the newer GBS2 world, not the old floating-cluster world.
- the problem is therefore not “wrong old controls mounted”, but **new controls existing without functioning user-visible behavior**.

---

## Browser matrix results

### Matrix

| Route | Theme buttons | Theme visible | Dark before | Dark after click | TOC sheet count | Search UI | Share UI | Offline UI |
|---|---:|---|---|---|---:|---:|---:|---:|
| `/baptisty-rossii/index.html` | 2 | false | false | false | 1 | 2 | 1 | 0 |
| `/baptisty-rossii/dva-sezda-1884/index.html` | 2 | false | false | false | 1 | 2 | 1 | 0 |
| `/baptisty-rossii/goneniya-i-sovest/index.html` | 2 | false | false | false | 1 | 2 | 1 | 0 |
| `/baptisty-rossii/iniciativnaya-gruppa/index.html` | 2 | false | false | false | 1 | 2 | 1 | 0 |
| `/baptisty-rossii/spravochnik/index.html` | 2 | false | false | false | 1 | 2 | 1 | 0 |

### Route-level observations
- No page errors were thrown during tested loads.
- All routes emitted local CSP console noise for absolute production icon URLs; this is treated as verification-environment noise, not the primary runtime bug here.
- The key invariant across all 5 routes is stable:
  - theme buttons exist
  - theme buttons are not visible
  - dark mode does not toggle after forced click

---

## Canonical bug implications

### GBS2 theme/search/share shell bug is strongly confirmed-current
- Prior ledger relation: **P1-13 / P1-14 / P1-15 family**
- Status: `confirmed-current`
- Severity: **P1**
- Witness set:
  - `verified-source`: layout/markup includes GBS2 controls
  - `verified-production-like-dist`: controls present across tested pages
  - `verified-browser`: buttons not visible / no dark mode state change
- Recommendation:
  - keep open and promote this route-matrix evidence into canonical repair prioritization.

### Offline control gap remains likely-current
- Status: `likely-current`
- Severity: **P2/P1 depending expected contract**
- Evidence:
  - no `data-gbs2-offline` markers found on tested baptisty routes
- Recommendation:
  - verify whether offline is intentionally absent or contractually required.

### TOC sheet container exists, but this pass does not yet prove functional content flow
- Status: `needs-deeper-browser-check`
- Evidence:
  - sheet container count = 1 on all tested routes
- Recommendation:
  - separate follow-up should verify whether the sheet opens, populates, and is navigable.

---

## Regression risk assessment from history + current evidence

The PremiumControls / phase3 history plus current matrix suggests a classic pattern:
1. controls were rapidly iterated across branches,
2. visual/runtime parity drifted,
3. some fixes targeted one world (Gill / floating cluster) while baptisty routes moved into another world (GBS2),
4. current series routes now show a **stable partial-shell regression** rather than catastrophic crashes.

This is exactly the kind of issue that can survive if audit truth focuses only on source markers and not browser behavior.

---

## Recommended next actions

1. **Open/strengthen one canonical GBS2 runtime bug** with this route matrix as core evidence.
2. Test the same matrix on:
   - `/hard-texts/`
   - Gill routes
   - any other routes sharing the same GBS2 shell
3. Add a second browser pass for:
   - sheet open/close behavior
   - search trigger behavior
   - share button action
4. Compare the current behavior against the phase3 / PremiumControls historical claims to isolate which branch family likely introduced the hidden/inert control state.
