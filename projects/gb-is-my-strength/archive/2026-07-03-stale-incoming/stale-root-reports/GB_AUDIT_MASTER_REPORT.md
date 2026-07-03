# GB Audit Master Report

## Scope
Full multi-pass audit synthesis for `FedorMilovanov/gb-is-my-strength` based on public repository source, docs, manifests, workflows, and audit scripts.

Audit date: 2026-06-26
Method: source/docs/workflow verification only, no local runtime build in this report

---

## 1. Executive Summary

### Main conclusion
The project is not weak because it lacks checks. It is risky because it has **many partially overlapping control layers** that are manually synchronized.

### Dominant bug class
**Synchronization drift between semi-canonical truth layers**:
- route manifests
- route profiles
- workflow guards
- baseline content contracts
- asset inventories
- documentation contracts

### What this means in practice
The most likely failures are no longer simple missing files or missing checks.
The most likely failures are:
- one metadata layer updated, another not
- checker wording stronger than actual logic
- profile layer stale vs matrix layer
- asset list updated in one subsystem but not in others
- docs and enforcement diverging over time

---

## 2. Strongest Confirmed Findings

### F-00 — Runtime interactive audit on Node 22 + Playwright still finds real UI regressions in current HEAD
**Severity:** P1

I installed Node 22.12.0, ran `npm ci`, installed Playwright Chromium, built production-like dist, served it locally, and ran the project's own `interactive-audit` against `AUDIT_BASE=http://127.0.0.1:8080`.

The interactive audit reported 5 live issues:
- `gbs-rail-not-visible` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `gbs-no-current-part` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `gbs-mobile-ui-missing` on `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `mobile-theme-control-not-visible` on `/articles/dzhon-gill-chast-1-chelovek/`
- `mobile-theme-control-not-visible` on `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

**Why important:** this upgrades part of the audit from architecture/governance drift into **current runtime UI defects in production-like dist**.

**Suggested fix:** treat these as top repair candidates before broader metadata cleanup.

---

### F-01 — Route profile layer has improved, but semantic freshness enforcement remains partial
**Severity:** P2

A fresh 50-check bash pass against current HEAD showed an important update:
- route profiles now contain `strict-native-app` for 13 routes
- route profiles contain `legacy-shadow-app` for 0 routes

So the earlier stale-profile finding has materially improved in current HEAD.

What still remains true:
- profile freshness depends on manual synchronization
- `check-route-profiles.js` still does not provide strong, explicit semantic agreement enforcement against the migration matrix
- route-profile quality is still uneven, with placeholder `unknown` values and mixed machine/narrative status semantics

**Why important:** the previous stale-profile mismatch appears largely fixed, but the underlying drift risk remains.

**Suggested fix:** keep profile-to-matrix semantic validation and schema cleanup as planned.

---

### F-02 — Shared-files guard likely enforces less than lane-policy docs imply
**Severity:** P1

`guard-shared-files.js` appears to reason mainly from:
- current staged/unstaged diff
- last commit message

It does not clearly validate the full pushed commit range.

**Why important:** if true in real git flow, a core governance promise is weaker than advertised.

**Suggested fix:** harden guard to validate commit range / push set, not only current worktree state.

---

### F-03 — Asset truth is manually duplicated across several systems
**Severity:** P1

Overlapping asset inventories exist in:
- `scripts/cache-bust.js`
- `sw.js`
- `scripts/audit-pro.js`

**Why important:** this is already a known historical regression family.

**Suggested fix:** create one canonical asset manifest and generate/check from it.

---

## 3. Confirmed Important Findings

### F-04 — Migration matrix/checker enum enforcement still looks weaker than ideal, but glossary drift itself appears improved in current HEAD
**Severity:** P2

A fresh bash pass found:
- 13 live `strict-native-app` route entries in the matrix
- 14 total string hits for `strict-native-app` in the matrix file

This strongly suggests the raw glossary omission has been improved since the earlier pass.

What still remains valid:
- enum enforcement is still weaker than ideal
- checker logic still appears string/heuristic-oriented rather than true schema validation
- the route-contract system still spans several semi-independent metadata layers

**Suggested fix:** keep explicit enum validation and route-contract unification work in scope.

---

### F-05 — Route contract truth is split across several taxonomies without one clear semantic bridge
**Severity:** P2

Main layers:
- `migration/page-ownership.json`
- `migration/route-migration-matrix.json`
- `data/route-profiles/*`
- `data/public-content-baseline.json`

Each is useful, but they describe route state differently.

**Suggested fix:** define explicit mapping rules or reduce truth duplication.

---

### F-06 — Route profile checker validates existence, not freshness vs migration matrix
**Severity:** P2

`check-route-profiles.js` does not compare profile `migrationMode` to matrix `mode`.

**Suggested fix:** enforce profile-to-matrix semantic agreement.

---

### F-07 — Public content baseline still lacks route taxonomy
**Severity:** P2

A fresh bash pass confirmed:
- baseline page count: 43
- typed route field hits in `data/public-content-baseline.json`: 0
- thin pages under 80 words: 4

Baseline stores:
- `url`
- `title`
- `h1`
- `words`

But does not distinguish:
- article
- landing
- app-route
- interactive-wrapper
- series article

**Why important:** interactive thin wrappers and content-rich articles are flattened into one model.

**Suggested fix:** add route type taxonomy to baseline data.

---

### F-08 — Workflow checker does catch at least one real current-HEAD workflow/package contract issue
**Severity:** P2

Running `npm run workflows:check` on Node 22 produced a real failure:
- `package.json scripts.dist:jsonld:audit: missing`

At the same time, a fresh bash pass confirmed:
- `indexnow.yml` explicitly uses `validate:static-publication:light`
- `check-workflows.js` does not explicitly mention `validate:static-publication:light`
- checker logic still matches via broader regex shape, not explicit policy declaration

So two things are true at once:
1. the workflow checker is not merely theoretical — it does catch real contract issues;
2. wording/logic alignment is still imperfect.

**Suggested fix:** resolve the missing script contract and align wording with the actual accepted workflow policy.

---

### F-09 — `notify-on-failure.yml` promises route-impact enrichment it does not actually produce
**Severity:** P2

Workflow comments describe richer failed-route diagnostics, but implementation does not populate them.

**Suggested fix:** either implement artifact extraction or remove overstated comments.

---

### F-10 — Agent onboarding order is contradictory across top-level docs
**Severity:** P2

- README says AI agent should read `AGENTS.md` first
- AGENTS says reading order starts with `docs/WORK_MODES.md`

**Suggested fix:** unify canonical onboarding order in one place.

---

## 4. Lower-Severity but Real Findings

### F-11 — Route profiles still contain placeholder-like `unknown` metadata
**Severity:** P3

A fresh bash pass found 15 `"unknown"` placeholder hits under `data/route-profiles`.

Examples include fields like:
- `migrationLane: unknown`
- `routeType: unknown`
- `section: unknown`

This is a cleaner current-HEAD finding than the older stale-profile mismatch.

---

### F-12 — Route profiles mix machine-like fields and human narrative status text
**Severity:** P2/P3

`currentStatus` is used both as structured-looking status and human descriptive text.

---

### F-13 — `visual-parity-contract.js` is useful as a marker contract, but should not be overread as full visual parity proof by itself
**Severity:** P3

---

### F-14 — `audit-pro.js` is becoming a policy monolith and synchronization hotspot
**Severity:** P2

---

## 5. Cleared Suspicion

### C-01 — `validate:static-publication:light` missing from package.json
**Result:** false positive, cleared

The script exists.

---

## 6. Confirmed Strengths

### S-01 — Production truth is consistently modeled as production-like strangler `dist/`
This is one of the strongest coherent parts of the repo.

### S-02 — Route inventory coverage across baseline / ownership / matrix is broadly coherent
No major route-universe hole was found in sampled comparison.

### S-03 — Heavy publication gates do include strict metadata/route checking layers
The project is genuinely protected; the problem is coordination drift, not total absence of checks.

### S-04 — Current Node 22 source/build validation is broadly healthy
Verified on Node 22.12.0 with installed dependencies:
- `npm run migration:metadata:check` ✅
- `npm run migration:metadata:check:strict` ✅
- `npm run data:consistency` ✅
- `npm run native:runtime:audit:strict` ✅
- `npm run contract:compare` ✅
- `npm run page-ownership:check` ✅
- `npm run maps:validate` ✅
- `npm run avraam:audit` ✅
- `npm run tokens:check` ✅
- `npm run css:layer:validate` ✅
- `npm run mdx:structure:audit` ✅
- `npm run content:guard` ✅

This matters because it shows the repo's own validation stack is mostly green in a proper Node 22 environment.

---

## 7. Root Cause Families

### R-01 — Manual multi-registry synchronization debt
This is the main root cause.

It explains:
- stale route profiles
- glossary drift
- duplicated asset truth
- mixed route taxonomies
- baseline underspecification

### R-02 — Enforcement weaker than surrounding docs/policy suggest
This explains:
- shared-files guard concerns
- workflow wording mismatch
- existence checks without semantic freshness checks

### R-03 — Schema role confusion
This explains:
- narrative text in machine-like fields
- profiles acting as both docs and metadata
- policy monolith behavior in audit scripts

---

## 8. Additional Deepening of Strongest Findings

### D-01 — Shared-files guard concern is now stronger after direct re-read
The concern around `guard-shared-files.js` remains one of the strongest findings.

What the guard actually uses:
- `git diff --name-only --cached`
- `git diff --name-only`
- current branch name
- **last commit message only** via `git log -1 --format=%B`

What this means:
- the guard is very good at reasoning about the current working tree state
- but it is not clearly validating the full pushed commit set/history that may already exist behind a clean tree
- therefore the lane-policy guarantee appears narrower than the governance docs suggest

This strengthens F-02 rather than weakening it.

---

### D-02 — Asset duplication finding is strengthened by SW readiness layer too
The asset-truth duplication problem is not limited to:
- `cache-bust.js`
- `sw.js`
- `audit-pro.js`

There is also a separate service-worker readiness layer in:
- `scripts/sw-dist-readiness-audit.js`

This script parses and validates `sw.js`/dist state and therefore becomes another system depending on stable asset-related truth.

This does **not** mean the script is wrong.
It means the repo has an even wider asset/governance surface area than initially summarized.

This strengthens F-03 and F-14.

---

### D-03 — Data consistency layer shows same architectural style: strong audits, many embedded truths
`scripts/check-data-consistency.js` is not a bug by itself, but it reinforces the global pattern:
- the repo protects itself through many custom zero-dependency audits
- these audits embed significant project truth directly in code
- over time, that increases maintenance and synchronization pressure

So this script acts as supporting evidence for the master conclusion:
**the project is sophisticated, but coordination-heavy.**

---

### D-04 — Workflow policy checker is powerful, but itself depends on brittle regex-level truth
After deeper review of `scripts/check-workflows.js`, the earlier workflow findings are strengthened.

What is good:
- the checker covers many real production invariants
- it explicitly protects the root→dist production model
- it catches many dangerous workflow regressions

What is risky:
- enforcement is mostly regex-on-text based
- workflow truth is therefore coupled to string-shape assumptions
- wording and actual accepted logic can drift even while the checker still passes
- the checker itself contains a very large amount of embedded workflow policy knowledge

This strengthens:
- F-08 (workflow wording vs logic mismatch)
- F-14 (policy monolith / synchronization hotspot)

---

### D-05 — Content source coverage check confirms another pattern: broad observability, soft severity
`scripts/check-content-source-coverage.js` is another example of the repo’s current style.

It does useful cross-checking between:
- series
- search manifest
- route profiles
- page ownership
- MDX files

A fresh bash pass confirmed:
- the script has many warning paths
- no direct `problems.push` use was hit in the current source readout
- strictness is flag-driven, not default-hard

This again supports the broader audit conclusion:
- the repo is rich in observability
- but not every truth layer is enforced at the same strictness level

This reinforces the root-cause family:
**enforcement strength varies across layers, and that variance is itself part of the maintenance burden.**

---

## 9. Suggested Repair Order

### Priority 1
1. Harden shared-files guard
2. Refresh stale route profiles for app routes
3. Unify canonical asset manifest(s)

### Priority 2
4. Complete and validate migration matrix mode vocabulary
5. Add profile-to-matrix semantic validation
6. Define explicit bridge between ownership/matrix/profile layers
7. Add route taxonomy to public baseline
8. Align workflow checker wording and logic
9. Fix or simplify `notify-on-failure.yml` route-impact claims
10. Unify agent onboarding order

### Priority 3
11. Remove `unknown` placeholders in route profiles
12. Split machine metadata from narrative profile fields
13. Clarify `visual-parity-contract.js` wording
14. Break up `audit-pro.js` policy monolith where practical

---

## 9. Repair Lane Suggestions

### Lane A — System Hardening
Use for:
- shared-files guard hardening
- workflow wording/logic alignment
- notify-on-failure cleanup
- onboarding contract unification

Should include:
- F-02
- F-08
- F-09
- F-10

### Lane B — Route Contract Unification
Use for:
- matrix glossary completion
- ownership/matrix/profile semantic bridge
- profile-to-matrix validation
- route profile schema normalization

Should include:
- F-01
- F-04
- F-05
- F-06
- F-11
- F-12

### Lane C — Asset Truth Unification
Use for:
- cache-bust / SW / audit-pro canonical asset manifest
- reduction of duplicated asset inventories

Should include:
- F-03
- F-14

### Lane D — Baseline Taxonomy Cleanup
Use for:
- route typing in `public-content-baseline.json`
- future smarter audit behavior for app wrappers vs article pages

Should include:
- F-07

---

## 10. Final Verdict

This repo is sophisticated, not sloppy.

Its current problem is that the sophistication has created a coordination burden.

### Final one-sentence verdict
**The project is repair-ready for governance, metadata, and system-hardening work; the main risk is synchronization drift between multiple manually maintained contract layers.**
