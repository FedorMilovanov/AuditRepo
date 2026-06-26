# Premium surface bug matrix — 2026-06-25

**Purpose:** unified verification matrix after four safe forensic passes.  
**Scope:** artifact-level reality, route-level reality, shared-runtime bugs, and audit false positives.  
**No implementation changes applied in this document.**

---

## 1. Severity legend

- **P0** — shared runtime / ownership bug affecting multiple routes or killing controls
- **P1** — route-level broken markup / stale public metadata in production-like artifact
- **P2** — audit/tooling drift that misclassifies otherwise-present UI
- **S0** — source-layer drift (legacy/root, docs, cache-bust, indexing) not necessarily live production behavior

---

## 2. Shared bug classes

| ID | Severity | Bug class | Verified where | Short description |
|---|---|---|---|---|
| PS-01 | P0 | Shared runtime crash | production-like `dist` | `floating-cluster-controller.js` throws `qs is not defined` |
| PS-02 | P0 | Dead premium theme controls | production-like `dist` | visible premium theme buttons click but do not toggle because controller is dead |
| PS-03 | P0 | Dead premium save controls | production-like `dist` | save buttons render but do not change state / show toast |
| PS-04 | P0 | Partial rollout ownership conflict | source + production-like `dist` | `.gb-ember` markers suppress legacy TTS in `site.js`, but premium controller is absent on some heart routes |
| PS-05 | P1 | Hermeneutics stray tail garbage | production-like `dist` | literal `76e7365` text survives into body |
| PS-06 | P1 | Hermeneutics hidden read-time drift | production-like `dist` | hidden Pagefind `35` vs visible `50` |
| PS-07 | P1 | Duplicate IDs on Gill controls | production-like `dist` | `gbsTheme` / `gbsSearch` duplicated on 4 Gill pages |
| PS-08 | P2 | Interactive-audit stale theme selectors | audit script | audit misses `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme` |
| PS-09 | P2 | Interactive-audit stale Gill context shell expectations | audit script | Gill context is checked as old GBS2 shell though route uses v16 shell |
| PS-10 | S0 | Legacy/root cache-bust drift for premium controller | source layer | root HTML uses old `?v=a6bb164d`, production-like routes use `?v=c78a4236` |

---

## 3. Route matrix

| Route | Family | Controller loaded? | Premium roots/markup present? | Real route bug(s) | Audit drift? | Status |
|---|---|---:|---:|---|---|---|
| `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | single premium | yes | yes | PS-01, PS-02, PS-03, PS-05, PS-06 | yes (`mobile-theme-control-not-visible`) | **broken + partially mis-audited** |
| `/articles/kod-da-vinchi/` | single premium | yes | yes | PS-01, PS-02, PS-03 | not yet proven | **broken** |
| `/articles/20-antisovetov-pastoru/` | series-lite premium | yes | yes | PS-01, PS-02, PS-03 | not primary | **broken** |
| `/articles/krajne-li-isporcheno-serdce/` | heart series | no | yes (`gb-ember`, `gb-save`) | PS-04 | no major false-positive confirmed | **partially rolled out / unwired** |
| `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/` | heart series | no | yes (`gb-ember`, `gb-save`) | PS-04 | no major false-positive confirmed | **partially rolled out / unwired** |
| `/articles/dzhon-gill-istoricheskiy-kontekst/` | Gill v16 shell | yes | yes | PS-01, PS-02, PS-03 | PS-09 | **broken + audit drift** |
| `/articles/dzhon-gill-chast-1-chelovek/` | Gill GBS2 shell | yes | yes | PS-01, PS-02, PS-03, PS-07 | PS-08 | **broken + duplicate IDs + audit drift** |
| `/articles/dzhon-gill-chast-2-uchenyi/` | Gill GBS2 shell | yes | yes | PS-01, PS-07 | likely some audit drift | **broken + duplicate IDs** |
| `/articles/dzhon-gill-chast-3-nasledie/` | Gill GBS2 shell | yes | yes | PS-01, PS-07 | likely some audit drift | **broken + duplicate IDs** |
| `/articles/dzhon-gill-spravochnik/` | Gill GBS2 shell | yes | yes | PS-01, PS-02/03 by implication, PS-07 | likely some audit drift | **broken + duplicate IDs** |
| `/nagornaya/chast-1/` | Nagornaya | yes | yes (premium markers only) | PS-01 | some interactive-audit confusion possible | **broken** |
| `/nagornaya/chast-2/` | Nagornaya | yes | yes (premium markers only) | PS-01 | unknown | **broken** |
| `/nagornaya/chast-3/` | Nagornaya | yes | yes (premium markers only) | PS-01 | unknown | **broken** |
| `/nagornaya/chast-4/` | Nagornaya | yes | yes (premium markers only) | PS-01 | unknown | **broken** |
| `/nagornaya/chast-5/` | Nagornaya | yes | yes (premium markers only) | PS-01 | unknown | **broken** |
| `/baptisty-rossii/noch-na-kure/` | Baptisty series | no | no premium markup in production-like dist | no premium-surface bug confirmed in dist | n/a | **not currently in premium rollout surface** |

---

## 4. Shared runtime bug coverage

### `qs is not defined` confirmed on 13 production-like routes

- Hermeneutics
- Kod da Vinci
- 20 antiсоветов
- Gill context
- Gill part 1
- Gill part 2
- Gill part 3
- Gill spravochnik
- Nagornaya part 1
- Nagornaya part 2
- Nagornaya part 3
- Nagornaya part 4
- Nagornaya part 5

### Interpretation

This is the dominant P0. Until PS-01 is fixed, many route-level control symptoms are downstream noise.

---

## 5. Premium markup without runtime ownership

### Confirmed routes

- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`

### Verified state

- `.gb-ember` exists
- `.gb-save` exists
- `floating-cluster-controller.js` absent
- clicks do nothing

### Additional source-level insight

`js/site.js` contains:

```js
if (document.querySelector(".gb-ember,[data-fc-root]")) return; /* v16 cluster owns TTS */
```

So premium markers suppress legacy TTS ownership while premium controller is still absent.

This makes PS-04 a true ownership bug, not just a missing script include.

---

## 6. Route-level content / metadata integrity findings

### Hermeneutics

- stray body text `76e7365` survives into production-like artifact
- hidden Pagefind `readTime=35`
- visible byline `50 мин`

### Note on other articles

A full article scan did **not** reveal another hidden-vs-visible read-time mismatch in the same class, beyond Hermeneutics.

---

## 7. Audit/tooling drift matrix

| Tool / script | Drift | Why it matters |
|---|---|---|
| `scripts/interactive-audit.js` | theme selector set misses `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme` | causes false `mobile-theme-control-not-visible` findings |
| `scripts/interactive-audit.js` | Gill context still measured as `.gbs2-rail` / `#gbs2Bbar` / `#gbs2Sheet` world | causes false shell-shape findings on a valid v16 shell |
| `scripts/interactive-audit.js` | route findings can mix real runtime crash with stale shell assumptions | triage becomes noisy and agents may chase wrong fixes |

### Important nuance

These audit drifts do **not** erase the real route bugs.
They just mean some individual audit lines are not trustworthy as direct evidence of missing UI.

---

## 8. Recommended triage order for implementation agents

### Phase A — clear shared P0 first
1. PS-01 `qs is not defined`
2. PS-07 duplicate IDs on reusable Gill controls
3. PS-04 heart-series premium ownership gap

### Phase B — then fix route-level P1
4. PS-05 Hermeneutics stray hash
5. PS-06 Hermeneutics hidden read-time drift

### Phase C — then audit/tooling cleanup
6. PS-08 interactive-audit theme selectors
7. PS-09 interactive-audit Gill context shell assumptions

### Phase D — source-layer cleanup
8. PS-10 legacy/root cache-bust drift

---

## 9. Safe conclusion

At this point the premium-surface area is no longer “one vague bug”. It has a clear taxonomy:

- **one major shared runtime crash**,
- **one shared reusable-markup bug (duplicate IDs)**,
- **one partial-rollout ownership bug on heart routes**,
- **one route-specific content/metadata pair on Hermeneutics**,
- and **a real audit drift layer** that should not be confused with route failures.

This should let active implementation agents fix the right things in the right order without stepping on each other or wasting time on false positives.
