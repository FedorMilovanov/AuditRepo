# Cross-agent bug matrix (synthesis) — 2026-06-25

**Status:** synthesis in progress — NOT yet promoted to `verified/`.
**Inputs:**
- `incoming/arena-agent/2026-06-25/*` (Playwright + production-like dist)
- `incoming/arena-agent-2/2026-06-25/*` (runtime Node + root-source grep)

This document supersedes nothing in `incoming/`; it is the deduplicated
cross-validated view for the next verifier step.

---

## Severity legend
- **P0** — shared runtime / ownership bug affecting multiple routes
- **P1** — route-level broken markup / stale metadata; or latent-on-P0
- **P2** — tooling / SW / low-impact functional defect
- **S0** — source-layer drift (not necessarily live production behaviour)

---

## Cross-validated bug matrix

| ID | Sev | Bug | arena-agent (dist) | arena-agent-2 (source+node) | Verdict |
|---|---|---|---|---|---|
| **B-01** | P0 | `floating-cluster-controller.js` throws `qs is not defined`; entire cluster init aborts | PS-01 ✅ Playwright/dist | CR-FCC-01 ✅ Node repro | **CONFIRMED — 2 methods** |
| **B-02** | P0 | premium theme controls dead (downstream of B-01) | PS-02 ✅ | (implied by B-01) ✅ | **CONFIRMED** |
| **B-03** | P0 | premium save controls dead (downstream of B-01) | PS-03 ✅ | (implied by B-01) ✅ | **CONFIRMED** |
| **B-04** | P0 | heart-series ownership gap (`krajne`/`rimlyanam` have `.gb-ember`/`.gb-save` but no controller; legacy suppressed) | PS-04 ✅ | ✅ grep + site.js FAB-guard | **CONFIRMED** |
| **B-05** | P1 | `initPlayExpand` `.gb-floater` filter → speed panel never built on Gill v16 pages | — (not reported) | CR-FCC-02 ✅ | **CONFIRMED — NEW** |
| **B-06** | P1 | Hermeneutics hidden Pagefind readTime `35` vs visible `50` | PS-06 ✅ | CR-HERM-01 ✅ (line 806) | **CONFIRMED — 2 methods** |
| **B-07** | P2 | `sw-register.js` toast logic error (foreign-node short-circuit) | — (not reported) | CR-SW-01 ✅ truth-table | **CONFIRMED — NEW** |
| **B-08** | P2 | SW precache useless for `?v=`-versioned assets (`cache.match` no `ignoreSearch`) | — (not reported) | CR-SW-02 ✅ | **CONFIRMED — NEW** |
| **B-09** | P1 | Hermeneutics stray body hash `76e7365` | PS-05 ✅ (dist) | ⚠️ **0 hits in source** | **needs dist re-verification** |
| **B-10** | P1 | duplicate `gbsTheme`/`gbsSearch` IDs on 4 Gill pages | PS-07 ✅ (dist) | ⚠️ **0 hits in source/astro** | **needs dist re-verification** |

---

## Source vs artifact split (critical for verifier)

- **Cross-layer bugs** (reproduce in source AND dist — safe to escalate):
  B-01, B-02, B-03, B-04, B-05, B-06.
- **Dist-only** (reproduce only in built artifact — NOT in committed source):
  B-09, B-10. These must be regenerated with a fresh `strangler:build:production-like`
  before they can move to `verified/`. They may be build-introduced *or* already
  patched in root since the dist pass.
- **Audit/tooling drift** (out of runtime scope here): PS-08, PS-09 — trust
  existing `arena-agent` evidence; do not escalate without browser proof.

---

## Deduplicated route impact

| Route | controller loads? | bugs present |
|---|---|---|
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | yes | B-01, B-02, B-03, B-06, (+B-09 dist) |
| `articles/kod-da-vinchi/` | yes | B-01, B-02, B-03, B-05-family |
| `articles/20-antisovetov-pastoru/` | yes | B-01, B-02, B-03 |
| `articles/dzhon-gill-istoricheskiy-kontekst/` (v16 flagship) | yes | B-01, B-02, B-03, B-05 |
| `articles/dzhon-gill-chast-1/2/3-chelovek`, `…spravochnik/` | yes | B-01, B-02, B-03, B-05, (+B-10 dist) |
| `nagornaya/chast-1..5/` | yes (dist) | B-01 |
| `articles/krajne-li-isporcheno-serdce/`, `…rimlyanam-7…/` | **no** | B-04 (unwired markers) |

---

## Recommended repair order (updated)

### Phase A — shared P0 + same-file P1
1. **B-01** `qs is not defined` (move `})();` to end of `floating-cluster-controller.js`)
2. **B-05** `initPlayExpand` selector (same file, same edit — fix together or Gill speed panel stays dead)
3. **B-04** heart-series ownership gap (wire the controller onto `krajne`/`rimlyanam`, or remove the suppressing markers)

### Phase B — route P1
4. **B-06** Hermeneutics readTime `35→50` (or align the visible figure to the editorial value)

### Phase C — gating / re-verification
5. **B-09, B-10** — reproduce in a fresh dist build; escalate only if still present

### Phase D — source-layer / SW cleanup (non-urgent)
6. **B-07** sw-register toast logic
7. **B-08** SW precache `ignoreSearch`

---

## Confirmed CLEAN (negative results — both agents agree, recorded to prevent duplicate work)
- `node --check` passes on all runtime JS (B-01 is runtime, not syntax).
- `wc -l == 0` files are minified, not empty.
- `sitemap.xml`: 43 URLs, 0 broken.
- `series.json` ↔ folders ↔ `data-gbs2-series`: consistent.
- `manifest.json` icons: present.
- `update-meta.js` cascade fix (ASTRO_PAGE_HEAD_MAP): all 10 components exist with the literal.
- `BookmarkEngine` API: complete.

---

## Next verifier step
- Promote **B-01..B-06** to `verified/` once one more agent (or the final verifier)
  signs off.
- Run a **fresh dist build** to resolve B-09/B-10 status before any escalation.
- Keep this file in `working/` until the final verifier closes it.
