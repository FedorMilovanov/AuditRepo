# Round-2 Surgical Deepening — arena-surgeon (2026-06-27)

**HEAD:** `1a288da5` (current origin/main)
**Agent:** arena-surgeon
**Purpose:** net-new verified findings beyond `REVERIFY_DEEPENING_2026-06-27_HEAD-1a288da5.md` + cross-ref with fellow agents + closing open questions.

---

## 1. CROSS-REF with fellow agents — verdict per finding

### 1.1 Gill series-progress % (32/58/95) — **FALSE-POSITIVE** (formal challenge filed)
Fellow-agent report `INACCURACIES_KOLHOZ_GILL` §1 claims 32/58/95 are WRONG (should be 21/26/5).
**Verified FALSE.** Values = correct cumulative `done-min/total` floor; body carries `data-gbs2-done-min/part-min/total-min` hooks; JS (`enhancements.js`) computes the same value and animates up. The proposed 21/26/5 is the wrong metric (part-share). Full evidence + challenge: `incoming/arena-surgeon/2026-06-27/comments/challenge-on-INACCURACIES_KOLHOZ_GILL-percentages-FALSE-POSITIVE.md`.
**Action:** do NOT change 32→21 anywhere — that is a regression.

### 1.2 "Gill not in migration matrix" — **NON-ISSUE (by design)**
Initial scan suggested Gill/krajne/rimlyanam absent from `route-migration-matrix.json`. Verified: they are in the **`exclude` list**:
```json
exclude: ["nagornaya/**","articles/dzhon-gill-*","articles/krajne-li-isporcheno-serdce","articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy","hard-texts/**"]
```
These routes have their own route-specific visual-parity audits (gill:context/spravochnik, etc.), so exclusion is intentional. The `migration:metadata:check` warning is correctly scoped to `/izbrannoe/` only. **Not a gap.**

---

## 2. Source-vs-built desync (ledger B5) — made CONCRETE

**Confirmed operational state:**
- `migration/route-migration-matrix.json` marks kod-da-vinchi, antisovetov, hermenevtika as `mode: strict-native`, `source: src/pages/articles/<slug>/index.astro`.
- These routes are **fully native**: no `_legacy/` fragments (kod-da-vinchi has 29 Astro components; antisovetov/hermenevtika/krajne/rimlyanam = 2 each; Gill parts 6–26).
- Root `articles/<slug>/index.html` for these routes is the **frozen legacy/rollback layer** — verified: root `articles/kod-da-vinchi/index.html` carries **no cache-bust hash** (`site.css?v=…` absent), i.e. it is NOT maintained; publication truth = `dist` built from `src/`.

**Risk class (live, documented but trap-laden):** an agent editing root `articles/*/index.html` for a native route produces a change that **does not ship** (dist is src-built). AGENTS §2 documents root as "legacy/source/rollback layer", so this is known architecture — but the trap is real for any agent who assumes root HTML = published HTML.

**Surgical note:** not a code bug to fix, but a candidate for a **guard + doc hardening**: a check that warns when root `articles/*/index.html` diverges from its native `src/` counterpart (drift detector), so stale-root edits surface before they confuse. Low priority.

---

## 3. PremiumControls coverage map (input to owner's "finish everywhere" goal)

**Where controls live (verified):**
| Surface | Mechanism | Count |
|---|---|---|
| Article pilots (single) | `FloatingCluster mode="single"` in body/chrome | antisovetov, hermenevtika, kod-da-vinchi |
| Gill series | `GillRailControls` (Gill-specific path) | 5 routes |
| Baptisty series | `variant="baptisty"` in **series bodies** (commit `53f68d38` "Play+Save to all 11 Baptisty bodies") | 11 |
| Heart / pastor / article | `SeriesLiteCluster` variants | 2 / 1 / 1 |
| Nagornaya | Tailwind-own controls (**excluded from consolidation**, AGENTS §9.11) | 5 |

**Key realization:** the "finish PremiumControls everywhere" task is **not** about missing routes (coverage is broad) — it is about **convergence + consistency**:
- Gill two-worlds (context v16-rail vs parts legacy gbs2-rail) — convergence debt (re-verify §3.5).
- Variant explosion (7 variants, pastor/article single-use) — design doc §1.2.
- CSS triple-source desync (canonical 8.8KB vs runtime 75KB vs orphan 8.8KB) — re-verify §4.1/§4.2.
- Controller god-object (1050 lines, no test) — re-verify §4.4.
- baptisty controls in bodies (correct), but variant consistency across 11 bodies unverified by any guard.

Full clean-implementation plan: `incoming/arena-surgeon/2026-06-27/proposals/PREMIUMCONTROLS_CLEAN_IMPLEMENTATION_DESIGN_2026-06-27.md`.

---

## 4. Verification hygiene log (what I checked that turned out clean — prevents future false reports)

| Checked | Expected (risk) | Actual | Verdict |
|---|---|---|---|
| Gill/krajne/rimlyanam missing from matrix | gap | in `exclude` (by design) | NON-ISSUE |
| baptisty missing FloatingCluster in index.astro | coverage gap | controls in series bodies (correct) | NON-ISSUE |
| Gill progress % hardcoded | bug | correct done-min floor + JS-computed | FALSE-POSITIVE (colleague) |
| `site-modules.js` SW precache (P0) | bug | file doesn't exist | FALSE-POSITIVE (re-verify §1.1) |
| root html cache-bust for native routes | stale | confirmed stale (rollback layer) | KNOWN/DOCUMENTED |

---

## 5. Updated surgical priority (consolidated, all HEAD `1a288da5`)

**P1 — systemic, low-risk (Lane A, doable now):**
1. Wire `workflows:check` into `validate:static-publication` (re-verify §3.1) — decoupled guard is a dead signal.
2. Fix `dist:jsonld:audit` false-red regex (re-verify §3.2).
3. Reconcile AGENTS §2 inventory to 8 CSS / 12 JS + modules (re-verify §3.3).
4. Finish `/izbrannoe/` matrix + search-manifest (re-verify §3.4).
5. Delete orphan `css/site-layered.css` (282KB) + `css/premium-controls.css` (8.8KB dup) (re-verify §4.1/§4.2).

**P1 — PremiumControls convergence (after fellow-agent's Hermeneutics+Gill template):**
6. Execute PremiumControls design plan (canonical CSS, Gill convergence, controller decomposition) — Phase 1→5.

**P2 — guard hardening:**
7. Gill progress computed-assert guard (prevent the false-positive "fix").
8. Root-vs-src drift detector for native routes (source-vs-built trap).

---

## Status

Round-2 deepening complete on HEAD `1a288da5`. All findings evidence-backed. Multi-witness cross-ref done (1 false-positive challenged, 1 non-issue closed, source-built made concrete). PremiumControls design ready for owner review + sequencing after fellow-agent's template. No source-code edits made (audit/verification mode only).
