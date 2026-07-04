# Current-head reverify — NEW-67 dead scripts reclassified

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`  
**Mode:** audit-only / no source changes

---

## 1. Scope

Reverify `NEW-67`, originally reported as "10 dead scripts in `scripts/` with no caller in `package.json`, no workflow reference, no require()".

The original heuristic is too narrow: this repo intentionally keeps multiple manual QA / migration / diagnostic scripts that are invoked directly by agents or referenced by documentation, not by npm scripts.

---

## 2. Scripts checked

All 10 files exist and pass Node syntax check:

```text
node --check scripts/_audit-deep.js                          PASS
node --check scripts/about-leaf-parity-shots.js               PASS
node --check scripts/deep-check.js                            PASS
node --check scripts/extract-native-pilot.js                  PASS
node --check scripts/genealogy-e2e-v2.js                      PASS
node --check scripts/generate-route-profiles.js               PASS
node --check scripts/ishod-qa.js                              PASS
node --check scripts/map-visual-qa.js                         PASS
node --check scripts/premium-mobile-visibility-smoke.js       PASS
node --check scripts/route-impact-report.js                   PASS
```

---

## 3. Evidence of manual/documented ownership

| Script | Current evidence |
|---|---|
| `_audit-deep.js` | Documented in `AGENTS.md`, `README.md`, `docs/BUGS_FOUND_2026-06-25.md` as internal/deep audit. |
| `about-leaf-parity-shots.js` | Documented in `docs/SANDBOX-ENV-2026-06-21.md` as independent screenshot fallback when `astro:audit:about` exits before screenshots. |
| `deep-check.js` | Documented in `AGENTS.md`, `README.md`, `docs/BUGS_FOUND_2026-06-25.md` as manual deep check; output artifact `deep-check.json` is also mentioned. |
| `extract-native-pilot.js` | Referenced by multiple refactor docs (`PATCH_SPEC_KOD_DA_VINCHI`, `PILOT_IMPLEMENTATION_KOD_DA_VINCHI`, `REFACTORING_5_0_PIXEL_DIFF_GUARD`, `REFACTORING_6_0_PLAN`). This is a historical/refactor helper, not a runtime dead asset. |
| `genealogy-e2e-v2.js` | Documented in `docs/BUGS_FOUND_2026-06-25.md` as manual `/rodosloviye/` QA. |
| `generate-route-profiles.js` | Documented in `AGENTS.md` / `docs/BUGS_FOUND_2026-06-25.md`; route profile generation history is part of migration tooling. |
| `ishod-qa.js` | Documented in `docs/MAPS-DESIGN-CONTRACT.md` as map smoke test. |
| `map-visual-qa.js` | Documented in `docs/BUGS_FOUND_2026-06-25.md` as visual QA for maps. |
| `premium-mobile-visibility-smoke.js` | Documented in `docs/refactor-2026/lanes/system-premiumcontrols-main-flaws-reconciliation-2026-06-27.md` as PC-MAIN-03 mobile visibility smoke. |
| `route-impact-report.js` | Documented in `docs/BUGS_FOUND_2026-06-25.md` as analytical route impact tool. |

---

## 4. Classification

`NEW-67` should not be treated as a current source bug or deletion-ready repair order.

**Recommended status:** `false-positive / documentation-classified manual QA tooling`.

Rationale:

- "No package.json caller" does not equal dead in this repository.
- These scripts are not shipped runtime assets.
- They are either documented manual QA, migration/refactor helpers, or historical diagnostic tooling.
- Blind deletion would remove documented recovery/QA procedures and conflict with the sandbox survival docs.

---

## 5. Follow-up recommendation

If cleanup is still desired, create a separate docs/tooling taxonomy lane, not a deletion lane:

```text
lane/tooling-script-inventory-taxonomy-2026-07-04
```

That lane should add a machine-readable inventory such as `scripts/README.md` or `docs/tooling/SCRIPT_INVENTORY.md` and classify scripts as:

- npm/CI gate;
- manual QA;
- migration helper;
- historical/archive candidate;
- delete candidate.

No source deletion is recommended from the current evidence.
