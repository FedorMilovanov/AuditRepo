# Regression / Preservation — forensic synthesis and wave closure

Date: 2026-08-07

## Purpose

This report converts the large regression-forensic campaign into a bounded current work model. It does **not** copy every historical candidate into `MASTER_BUG_MATRIX.md`, does not restore content automatically, and does not treat historical markup/count differences as restoration oracles.

Operating rule:

> historical loss signal ≠ current defect; current defect requires current evidence and a named owner/boundary.

## Evidence base

The synthesis used the uploaded forensic audit bundles, the consolidated 115-check marathon ledger, the 27-row restore/disposition ledger, direct current Product inspection, exact current PR/CI evidence and retained branch/PR history.

Large forensic corpora remain evidence rather than backlog:

- 115 consolidated evidence checks;
- 27 initial restore/disposition rows;
- 705 Gill/Herm low-similarity candidates;
- 175 AI/coauthored critical commits in the risk corpus;
- 48 Baptists low-similarity candidates;
- 37 currently retained Product `lane/*` refs.

## Execution outcome

### Wave 1A — validator authority / content coverage: CLOSED AND MERGED

Product PR **#1176** merged as:

`778b787f491e91d8cd1f0e1c58cf79d999e18ade`

Exact pre-merge head `bb0f4dc717149b630588511b811984c4b7793436` passed **10/10 registered workflow groups**, including Source Authority, Content Source Truth, Shared Files, Route Registry, Native Source, Deploy Candidate and Visual Parity.

The repair went deeper than the initial symptom list after the first honest Shared Files red exposed a duplicated authority owner.

Final architecture:

1. **Route profiles are the sole current legacy/reference authority.** Production Astro profiles must explicitly declare `canonical`, `reference-only`, `runtime-required` or `absent`.
2. Non-`absent` authority requires an existing `legacyPath`; `absent` forbids one; missing/unknown/inconsistent states fail closed.
3. Retained strict-native/native-app shadows that were previously undeclared are now explicit `reference-only`; `/izbrannoe/` is explicit `absent`; the independent Baptists `_app` built artifact is `runtime-required`.
4. The immutable legacy-reference ledger remains an exact identity/provenance snapshot at `auditedAtCommit`: route/path/profile ownership, Git blob SHA-1, byte/text SHA-256, bytes/words/H1/H2 and dependency/governance evidence stay blocking.
5. Historical `declaredLegacyStatus/classification/decisionSource` fields inside immutable shards are now declared **snapshot metadata**, not a second current authority registry.
6. `legacy-shadow-retirement-readiness.mjs` combines immutable ledger identity with current route-profile disposition rather than manually synchronizing two current classification tables.
7. Generic content coverage uses true occurrence deficit `max(legacyCount - distCount, 0)` instead of set membership.
8. It reports `expected / exercised / explicit-skips / undeclared`; undeclared authority is a hard failure; `expected>0 && exercised=0` is a hard failure; an intentional `expected=0/exercised=0/undeclared=0` state is valid.
9. Dead generic route-specific `ALLOW` / Avraam 40% threshold policy was removed. Strict-native semantic preservation belongs to positive native contracts rather than restoring old HTML as canonical truth.
10. Deterministic mutation/self-contracts cover repeated-occurrence loss, zero-exercise health, undeclared authority, invalid status shapes and stale ledger-snapshot/current-authority disagreement.

### Strangler effect of Wave 1A

The exact final Wave 1A Shared Files run reports:

`legacy shadow readiness: NOT_YET_SAFE_TO_MOVE_OR_DELETE; blockers=23`

This is a major narrowing from the previous 52 blockers.

The 29 old reference-owner decisions disappeared because current route-profile authority is now explicit. Remaining blockers are the already-known dependency/mechanical classes:

- **13** mechanical reader repoints;
- **3** obsolete readers to remove/repoint;
- **7** dependency owner decisions;
- total **23**.

Physical retirement remains forbidden until these reach zero and readiness is rerun on the exact current Product. The improvement is not “legacy can now be deleted”; it is that the blocker model is now truthful and actionable.

### Wave 1B — Avraam positive guard: CLOSED AND MERGED

Product PR **#1178** was synchronized onto merged Wave 1A with an ordinary two-parent commit, without rewriting its two Product-audit blobs, and then earned a fresh exact-head CI matrix.

Synced exact head:

`bd67129ec11d6441a85aa6779f62b602c992bff3`

It passed **4/4 registered workflow groups**: Shared Files, Metadata, Deploy Candidate and Visual Parity.

PR #1178 then squash-merged as:

`ce5d023b7501f43f1c6cf04d3840718548da8e44`

Repair:

- removed the mathematically always-true Shechem assertion (`condition ? true : true`);
- removed the low-value “research document <= 320 lines” proxy;
- added `data/karty/avraam-static-content-contract.json` with exact native owner, route, 14 semantic source-unit IDs, Shechem dispute identity and native archaeology anchor;
- `avraam-map-audit.js` now validates the actual 14-item native `Источники и метод` apparatus at `AvraamMap.astro`;
- in-memory adversarial mutations prove removal/duplication of required source identity and corruption of Shechem dispute title are rejected.

This is the first positive semantic-manifest pilot of the campaign.

### `SYS-VALIDATOR-TRUST` disposition

**CLOSED BY SYSTEM FIX.**

The four original manifestations — silent authority loss, false multiset semantics, dead Avraam threshold and always-green Shechem assertion — are now covered by one current authority model, health contracts and positive native mutations.

`SYS-VALIDATOR-TRUST` is therefore removed from active MASTER in this closure wave rather than retained as a `CLOSED` row.

---

## Wave 2 — semantic recovery: CLOSED, zero Product restorations

### Wave 2A — Gill / Hermenevtika

Dedicated evidence:

`verification/2026-08-07-regression-semantic-wave2a/REPORT.md`

Result:

**13 high-signal candidates → 0 confirmed current regressions → 0 Product edits.**

Key conclusions:

- Gill Part I static `.gterm` count drop is not six lost definitions. Three current terms are covered by global runtime glossary hydration; three old local popovers became redundant after their explanation moved into current authored prose/footnotes.
- Hermenevtika's three fewer `.bref` controls are intentional. Commit `e809b75d...` explicitly makes Scripture references inside governed footnote tooltips static and guards against nested interactive descendants; all three propositions/references remain as text.
- Benjamin Stinton is current-present.
- old `никкуд` wording was intentionally source-corrected and is forbidden by final Gill reconciliation.
- `analogia fidei` remains current with a narrower supported claim.
- Memra was intentionally removed from Part IV's proof-example role by final source reconciliation but remains in the current Spravochnik with the chronology caveat.

No old Gill/Herm surrounding prose or legacy interaction markup should be restored from these counters.

### Wave 2B — Baptists 48-candidate package

Dedicated evidence:

`verification/2026-08-07-regression-baptists-wave2b/REPORT.md`

Result:

**48 candidates → 0 confirmed current reader-content regressions → 0 public restorations.**

The high-risk 1884 cluster is current-present/rephrased with the exact historical distinction between Petersburg 1–6 April, Novo-Vasilievka 30 April–1 May and separate Tiflis 1867 background.

Most remaining low-sim rows were repository-internal research/OCR/PDF/file locators, not reader canon. Current public articles retain the evidentiary value through narrative source criticism and reader-facing reading lists/PDF/archive links.

One separate non-Product hygiene residue was identified:

`RESEARCH_INDEX_DRIFT — Initiative Group / Инструктивное письмо provenance notes`

Older internal master/specialized research notes still contain B/C-era “find the full text” wording, while the current article states that a 10-page typewritten primary copy has since been found/read. Do **not** weaken the article and do not rewrite the research memory from article prose alone; first re-locate the exact primary scan/provenance receipt, then reconcile the research layer as a bounded hygiene task.

This does not enter Product MASTER as a reader bug.

---

## Wave 3 — retained branch archaeology: CLOSED

Dedicated evidence:

`verification/2026-08-07-regression-branch-archaeology-wave3/REPORT.md`

Current retained Product `lane/*` refs inspected: **37**.

Result:

- active current work: 1 (`lane/nagornaya-library-theme-2026-08-07`, Product #1179 / `NG-INLINE-01`);
- lost approved capability requiring recovery: **0**;
- `UNIQUE_REVIEW`: **0**.

All other retained lanes have an evidence-backed disposition:

- merged/integrated;
- superseded;
- diagnostic/evidence-only;
- evidence transferred;
- explicitly rejected/obsolete;
- or reimplemented through a later canonical owner.

Important example: source-link trigger #964 is closed/unmerged, but its exact capability exists in current main through permanent #967. Therefore merge status is not a lost-capability oracle; current capability ownership is.

Branch count itself is not treated as a quality target and no Product recovery PR is required from this archaeology.

---

## Explicit keep-deleted / do-not-restore classes

The following remain non-recovery targets without new current evidence:

- Gill claims forbidden by final source reconciliation as overconfident/unsupported;
- the old Hermenevtika quiz that inverted Abner Chou's position;
- intentionally removed Gill duplicate sections;
- deep Research archive material not selected for publication;
- Lenis runtime behavior in TheLegendaryPoet;
- nested Scripture `.bref` controls inside governed Hermenevtika footnotes;
- old Part IV Memra proof-example wording;
- already repaired historical losses (Gill Part III figures, last-page anchor, Herm Scripture corruption, Antisovetov note-box, Nagornaya/series SEO, core Astro CSS, map manifest/anti-FOUC, Gill scrollspy/progress ring, tooltip CSS parser cascade, workflow YAML, Ishod basemap).

---

## Positive preservation architecture

Do not create 115 permanent tests. The successful Wave 1A/1B direction is:

### Accepted Semantic Manifest

Protect typed important units rather than whole-HTML goldens:

- canonical owner/source;
- accepted baseline anchor;
- stable semantic section/claim/source identities where meaningful;
- glossary/reference annotations only when they are actual capability owners;
- media IDs/provenance;
- reader capabilities;
- explicit deletion dispositions.

Avraam now has the first concrete implementation through #1178.

Remaining pilots: Hermenevtika and Gill Part I.

### Declared Surface Closure Set

For each governed entity, explicitly state which surfaces are expected (`source`, `route`, `data`, `search`, `dist`, `live`) and which are intentionally N/A. Missing expected layers must never become vacuous PASS.

Wave 1A's explicit route authority is the first implementation of this principle.

### Validator Health Contract

Blocking validators should expose meaningful `expected / exercised / skipped / failures / authority source` evidence and mutations where the failure class warrants it.

`SKIP` or unsupported execution must not masquerade as PASS.

### Mutation suite

Use historical real disasters rather than random score-chasing. Initial valuable classes include:

- remove closing spans;
- mass-remove classes;
- duplicate ID;
- inject U+FFFD;
- remove a source/claim unit;
- invert quiz semantic stance;
- remove route from search/sitemap;
- duplicate runtime owner;
- remove stylesheet import;
- expected-but-zero validator execution;
- reduce repeated-word frequency;
- always-true assertion;
- stale runtime identity;
- geometry overlap/hidden control;
- source exists in directory but leaves canonical import graph.

The useful metric is regression-class kill evidence, not raw test count.

---

## Process simplification — evidence from this campaign

Wave 1B demonstrated a better current-main synchronization pattern:

- keep the already validated feature/audit blobs;
- after `main` advances through a disjoint merge, construct an ordinary two-parent sync commit with the new main as parent;
- keep the PR's actual file diff unchanged;
- require a completely fresh exact-head CI matrix;
- merge the same PR when current.

This avoided another successor PR while preserving the no-stale-green rule.

The broader synthetic merged-candidate/process simplification remains optional Work Queue work rather than a current Product defect.

---

## Remaining campaign waves

### Wave 4 — positive manifest pilots

Avraam: **done** by #1178.

Remaining:

- Hermenevtika;
- Gill Part I.

Done when each has a small positive semantic/capability manifest at the actual current owner plus at least one meaningful deletion/corruption mutation, without whole-file snapshots or historical static-count preservation.

### Wave 5 — guard retirement

After the positive owners exist, remove/degrade redundant low-value proxies:

- magic line/byte/count floors whose number is not itself an invariant;
- duplicate literal grep where AST/DOM/typed contract exists;
- obsolete migration parity after current authority/receipt is closed;
- duplicate guards for the same owner;
- warnings with no owner/expiry/action.

---

## Campaign closure

Current status after Product #1176/#1178 and semantic/branch review:

1. validator trust — **DONE**;
2. high-signal semantic recovery dispositions — **DONE, zero Product restorations**;
3. retained-lane archaeology — **DONE, UNIQUE_REVIEW=0**;
4. positive preservation pilots — **Avraam done; Hermenevtika + Gill Part I remaining**;
5. redundant-guard retirement — after Wave 4.

The forensic campaign is therefore no longer an open-ended search for losses. Remaining work is bounded positive hardening and cleanup.

AuditRepo remains active; the campaign, not the repository, will close after Waves 4–5.
