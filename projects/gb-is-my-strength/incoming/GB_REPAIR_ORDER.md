# GB Repair Order

## Goal
Minimal, practical repair order based on audit findings, without flooding the repo with many separate plans.

---

## Phase 1 — Stop the highest-risk drift and current runtime breakage

### 0. Fix current interactive runtime regressions found in production-like dist
**Why first:** these are live runtime/UI defects found by the project's own Playwright-backed interactive audit on Node 22 + local production-like dist.

Current confirmed issues:
- `gbs-rail-not-visible` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `gbs-no-current-part` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `gbs-mobile-ui-missing` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `mobile-theme-control-not-visible` on `/articles/dzhon-gill-chast-1-chelovek/`
- `mobile-theme-control-not-visible` on `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

These should be treated as immediate product-facing fixes before or alongside governance cleanup.

---

### 1. Harden shared-files guard
**Why first:** if governance protection is weaker than intended, every other lane is less trustworthy.

**Fixes:**
- validate pushed commit range, not only current worktree state
- do not rely only on last commit message
- make lane-policy enforcement reflect actual push behavior

**Audit finding(s):** F-02

---

### 2. Refresh stale app-route profiles
**Why now:** this is the cleanest confirmed stale metadata inconsistency.

**Fixes:**
- update app-route profiles from `legacy-shadow-app` to current matrix vocabulary
- remove placeholder `unknown` fields where obvious
- normalize `currentStatus` where possible

**Audit finding(s):** F-01, F-11, F-12

---

### 3. Add profile-to-matrix semantic validation
**Why now:** prevents stale route profiles from reappearing.

**Fixes:**
- compare `profile.migrationMode` with matrix `mode`
- fail or warn clearly on drift

**Audit finding(s):** F-06

---

## Phase 2 — Reduce duplicated truth

### 4. Unify asset manifest truth
**Why:** this is a recurring regression family.

**Fixes:**
- introduce one canonical asset manifest
- use it for cache busting
- use it for SW precache validation/generation
- use it for audit-pro asset checks

**Audit finding(s):** F-03, F-14

---

### 5. Complete migration matrix vocabulary and semantics
**Why:** live route mode vocabulary must be declared and validated.

**Fixes:**
- add `strict-native-app` to glossary
- validate all used mode values against glossary
- document how app/native interactive routes map to ownership/profile layers

**Audit finding(s):** F-04, F-05

---

### 6. Add route taxonomy to public baseline
**Why:** baseline currently flattens different route classes into one model.

**Fixes:**
- add route type field such as:
  - `article`
  - `landing`
  - `interactive-wrapper`
  - `app-route`
  - `series-article`
- use that in future audits

**Audit finding(s):** F-07

---

## Phase 3 — Align docs and workflow truth

### 7. Align workflow checker wording with actual policy
**Fixes:**
- document whether `validate:static-publication:light` is the intended accepted gate in IndexNow
- make checker wording and regex policy agree

**Audit finding(s):** F-08

---

### 8. Fix or simplify `notify-on-failure.yml`
**Fixes:**
- either truly extract route-impact data from artifacts
- or remove comments that imply this is already implemented

**Audit finding(s):** F-09

---

### 9. Unify agent onboarding order
**Fixes:**
- choose one canonical reading order
- make README and AGENTS agree

**Audit finding(s):** F-10

---

## Phase 4 — Cleanup / quality improvement

### 10. Split route profile machine fields from narrative fields
**Why:** reduce schema confusion.

**Fixes:**
- keep machine fields normalized
- move history/notes/constraints into clearly narrative sections

**Audit finding(s):** F-12

---

### 11. Clarify `visual-parity-contract.js` scope
**Fixes:**
- describe it as marker/structural parity guard
- avoid overstating it as complete visual proof by itself

**Audit finding(s):** F-13

---

### 12. Reduce `audit-pro.js` monolith risk
**Fixes:**
- extract shared manifests/config where practical
- reduce duplicated policy knowledge

**Audit finding(s):** F-14

---

## Parallelization Guidance

### Can be done together
- shared-files guard hardening
- route profile refresh
- workflow wording cleanup

### Should be coordinated carefully
- route contract unification
- profile schema changes
- baseline taxonomy changes
- asset manifest unification

### Do not mix casually in one noisy lane
- system guard logic
- route schema redesign
- asset manifest redesign
- doc onboarding rewrite

Better as 2–4 focused lanes, not one giant refactor.

---

## Short Version
If only a few things are fixed first, do these:
1. shared-files guard hardening
2. stale app-route profile refresh
3. asset manifest unification
4. matrix/profile semantic validation

These give the best risk reduction per unit of work.

---

## Practical Note
Right now the highest leverage work is **not** visual tweaking.
It is system consistency work:
- strengthen what guards actually enforce
- reduce duplicated truth
- make route metadata layers speak the same vocabulary
- stop stale metadata from surviving future changes