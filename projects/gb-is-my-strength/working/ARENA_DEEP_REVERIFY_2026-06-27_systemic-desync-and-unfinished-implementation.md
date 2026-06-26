# Arena Deep Re-Verify — systemic desync, extra logic branches, unfinished implementations, regressions
**Date:** 2026-06-27  
**Audited source repo:** `FedorMilovanov/gb-is-my-strength`  
**Local audited SHA:** `49b83365606cec1e65060238cefea210439b882d`  
**AuditRepo SHA:** `6cd5785dd8c5b361ff7caae83e8acd7a06cbfed0`  
**Mode:** verifier / deepening existing reports, not bulldozer intake  
**Method:** rules-first read (`README`, `SANDBOX-ENV`, project README), fast gates, full static-publication gate, code/HTML grep, ledger cross-check.

---

## Executive summary

Проект в целом **не развален**: быстрые и полный статический gate проходят на HEAD, `audit-pro` зелёный, `validate:static-publication` зелёный. Но именно это и вскрывает главный системный диагноз:

> **Есть несколько мест, где “система считает себя здоровой”, хотя по факту в кодовой базе уже живут рассинхроны между intended architecture, guard-логикой, ledger-правдой и текущим source/built состоянием.**

Это не картина «всё сломано». Это картина **тонкой деградации управления сложностью**:
- часть багов реально исправлена;
- часть old findings уже устарела;
- но поверх этого появились **новые несоответствия второго порядка**: CI/policy drift, guard drift, source-vs-built drift, migration metadata debt, и незавершённые архитектурные переходы.

Ниже — именно такие находки.

---

## What I actually verified

### Read / protocol
- `AuditRepo/README.md`
- `AuditRepo/SANDBOX-ENV-2026-06-21.md`
- `AuditRepo/projects/gb-is-my-strength/README.md`
- `AuditRepo/projects/gb-is-my-strength/verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- current reverify docs dated 2026-06-27
- source repo `AGENTS.md`, `docs/WORK_MODES.md`, `package.json`

### Gates run on current HEAD
- `npm run migration:metadata:check` ✅ with warnings
- `npm run native:runtime:audit:strict` ✅
- `npm run data:consistency` ✅
- `npm run guard:shared-files` ✅
- `npm run workflows:check` ❌
- `npm run content:parity` ✅ with semantic warnings
- `node scripts/audit-pro.js` ✅ with warnings
- `npm run validate:static-publication` ✅ (full chain green, some warnings only)

This matters because several deeper findings below are **not simple build failures**. They are **truth-model failures**: the repo passes, but the repo’s own ledgers or assumptions are stale/incomplete.

---

# 1. New findings

## NEW-A1 — `workflows:check` is red on current HEAD while full publication gate is green
**Severity:** P1  
**Category:** policy / CI discipline / hidden release-process drift  
**Status suggestion:** confirmed-current

### Evidence
Command:
```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run workflows:check
```
Output:
```text
GB WORKFLOW POLICY CHECK
❌ 1 issue(s):
- package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
```

Current script in `package.json`:
```json
"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js"
```

Guard expects:
```js
mustScript(scripts, 'dist:jsonld:audit', /dist-jsonld-audit\.js[^\n]*--root\s+dist/, 'must audit JSON-LD in dist artifact');
```

### Why this is important
This is a **pure repo-self-contradiction**:
- policy script says workflow contract is broken;
- broader full release gate still passes;
- owner/agent can wrongly conclude “everything release-ready”.

That means workflow-policy verification has **fallen out of the default truth path**.

### Root cause
Not just “missing flag”. Deeper cause:
- `check-workflows.js` evolved stricter than `package.json` wiring;
- but `workflows:check` is not embedded into the canonical full release barrier (`validate:static-publication`);
- so a red workflow-policy surface can survive while main quality gate stays green.

### Why this is a real systems bug
This is exactly the kind of thing that causes **future deployment regressions to re-enter silently**. The repo already has history of CI/deploy breakage. A red policy guard outside the main barrier is unfinished hardening.

### Suggested repair lane
system / CI policy consistency

---

## NEW-A2 — `/izbrannoe/` is only partially integrated into repo contracts
**Severity:** P1  
**Category:** incomplete implementation / metadata contract debt  
**Status suggestion:** confirmed-current

### Evidence
`migration:metadata:check` and strict subchecks emit warnings:
```text
/izbrannoe/: no entry in route-migration-matrix.json (add it before migration)
route /izbrannoe/: production-dist route without search-manifest entry
```

At the same time source exists and is linked in navigation:
- `src/pages/izbrannoe/index.astro`
- links in `src/components/home/HomePageChrome.astro`
- link in `src/components/ui/Header.astro`

`audit-pro` warning:
```text
⚠️ Missing local reference: index.html → /izbrannoe/
```

### Why this matters
Это не “забыли одну строчку”. Это **не доведённый до конца feature insertion**:
- route уже введён в UX и source;
- но migration contract не обновлён;
- search contract не обновлён;
- root static/home references тоже частично расходятся.

Именно такие полувведённые маршруты потом дают цепочки ложных `stale/fixed` выводов, потому что разные audit surfaces смотрят на разную “истину”.

### Root cause
Feature shipped through UI/source first, but **cross-contract registration layer** was not fully completed.

### Suggested repair lane
shared metadata / route registry / search contract

---

## NEW-A3 — canonical full gate does not include workflow-policy guard
**Severity:** P1  
**Category:** unfinished protection system  
**Status suggestion:** confirmed-current

### Evidence
`validate:static-publication` script does **not** include `npm run workflows:check`.

Yet `workflows:check` is currently red (see NEW-A1), while full gate passes.

### Why this is deeper than NEW-A1
NEW-A1 is the current red symptom.  
NEW-A3 is the **architectural hole** that allows the symptom to survive.

This is a classic “planned hardening not actually connected to the safety barrier”.

### Root cause
Security/CI policies were added as standalone specialized guards, but not all were made part of the **canonical release truth**.

### Suggested repair lane
system release barrier hardening

---

## NEW-A4 — owner-ui guard and 2026-06-27 Gill mobile strategy are in structural tension
**Severity:** P2  
**Category:** unfinished intended implementation / future regression trap  
**Status suggestion:** confirmed-current

### Evidence
Current owner-ui guard explicitly expects legacy Gill markers in built HTML:
- `gbs2-rail`
- `gbs2-hero`
- current Gill pages in built artifacts still satisfy those expectations.

But the 2026-06-27 surgical playbook in AuditRepo proposes migrating Gill parts toward:
- `gbs-rail-foot`
- `mobile-bottom-bar`
- new v16 mobile/desktop template copied from context page
- eventual removal of legacy `gbs2-bbar` mobile world

The playbook itself warns:
> before deleting `gbs2-bbar`/`gbs2-sheet`, run owner:ui-guard … if it hard-requires `gbs2-*` ids, either guard is stale or ids must be kept as aliases.

### Why this matters
This is a **known pending collision** between:
- desired architectural target,
- current anti-regression contract,
- and still-live built HTML.

Without reconciling these first, the next agent can easily do either of two bad things:
1. break guard while moving toward owner-desired UI, or
2. preserve guard by keeping dead legacy scaffolding, causing dual-system rot.

### Root cause
Protection system was written against an intermediate Gill architecture, while target architecture has moved further.

### Suggested repair lane
Gill convergence + guard contract update in one coordinated lane

---

## NEW-A5 — `UNIFIED_BUG_LEDGER_2026-06-25.md` contains stale truth mixed with active truth
**Severity:** P2  
**Category:** verifier truth drift / ledger hygiene  
**Status suggestion:** confirmed-current

### Evidence
The unified ledger still contains many historical amendment sections saying “fixed in project source”, “pending merge”, “remaining active ~40”, etc. Some of those statements were true on earlier SHA snapshots but are no longer canonical at current HEAD `49b8336`.

Examples of mixed-truth patterns inside one canonical-looking file:
- old counts and “remaining active” estimates from multiple rounds;
- bugs described as pending merge although later commits landed in source repo;
- false-positive/fixed/amendment history interleaved directly into what appears to be the present ledger.

### Why this matters
The file is still useful as forensic history, but it is **dangerous as a current repair ledger**.
A weaker agent can read it and act on stale bug status as if it were live.

### Root cause
Historical append-only verifier process produced a document that is good as archive, bad as present-state canonical ledger.

### Suggested repair lane
verification docs / current-head canonicalization

---

# 2. Confirmations / deepening of existing findings

## CONFIRM-B1 — source/build/deploy truth can diverge while repo still looks green
**Target existing theme:** source-vs-built desync, especially Hermeneutics / floating cluster surfaces  
**Status suggestion:** confirmed-current / stronger root cause

### My strengthening evidence
Current repo structure clearly keeps both:
- source Astro/components,
- committed built/static HTML under root routes like `articles/.../index.html`.

This means the project is intrinsically exposed to a class of bugs where:
- source fix lands,
- cache-bust changes land,
- but committed/built HTML does not fully converge.

The 2026-06-27 reverify docs already identify this concretely for Hermeneutics. My pass strengthens the systemic conclusion:

> this is not a one-page anomaly; it is a structural property of the repo’s dual-artifact publication model.

Any bug touching UI classes, control markup, variant modifiers, or route-specific shells must be treated as potentially **source-fixed but built-stale** until production-like artifact truth is reverified.

### Stronger root cause
Not merely “forgot to rebuild”.  
The real root cause is **hybrid publication architecture with multiple truth surfaces and incomplete end-to-end invariant enforcement**.

---

## CONFIRM-B2 — Gill is still split across two UI families
**Target existing theme:** VR-08 / unfinished Gill convergence  
**Status suggestion:** confirmed-current

### Evidence
Built HTML shows:
- `articles/dzhon-gill-istoricheskiy-kontekst/index.html` has `gbs-rail-foot`
- parts 1/2/3 use `gbs2-bbar` / `gbs2-sheet` legacy mobile world

This confirms the verifier conclusion that Gill family is still **cross-family inconsistent**.

### Deepening
This is not just visual inconsistency. It creates:
- duplicate CSS logic families,
- more than one expected runtime shape,
- harder owner-ui guard design,
- more places for regressions when premium controls evolve.

So this should be treated as **architectural convergence debt**, not just a cosmetic mismatch.

---

## CONFIRM-B3 — full gate green does not imply metadata completeness
**Target existing theme:** incomplete feature registration / route contract drift  
**Status suggestion:** confirmed-current

### Evidence
Even with green `validate:static-publication`, strict metadata checks still warn on `/izbrannoe/`.

### Deepening
This proves a subtle but important point:
- some metadata debt is currently modeled as non-blocking warning,
- even when the route is already exposed in UX/navigation.

That is a policy choice, but it means green gate ≠ “fully integrated route”.

---

# 3. Challenges / status corrections

## CHALLENGE-C1 — not every old “active bug count” in project README / ledgers should still be treated as current truth
**Recommended status:** stale-on-current-head / replace with current canonical snapshot

### Reason
Project README says one set of counts and statuses; unified ledger contains older/append-only counts; current HEAD has moved through many commits after 2026-06-25.

At this point, using old numeric totals as operational truth is misleading.

### Recommendation
Do **not** maintain bug-count truth in multiple human-edited places unless one is explicitly archival-only.

---

# 4. Cross-cutting root causes

## RC-1 — Multi-truth architecture without one brutally canonical current-state document
Surfaces:
- source Astro files
- committed root HTML
- dist/ build expectations
- AuditRepo unified ledger
- reverify notes
- project README summaries
- owner-ui guard expectations

This is the deepest management problem. The codebase is large enough that **truth fragmentation itself becomes a bug source**.

## RC-2 — Hardening scripts exist, but not all are wired into the final barrier
Example:
- `workflows:check` exists and catches a real issue,
- but it is outside the canonical release chain.

This is classic “intended safety not fully operationalized”.

## RC-3 — Feature rollout often finishes in UX/source before registry/contracts are reconciled
`/izbrannoe/` is current proof.

## RC-4 — Intermediate architectures fossilize in guards
Gill `gbs2-*` guard expectations vs v16 target are a live example.

---

# 5. Suggested precise repair order

## Lane 1 — system-truth hardening
1. Decide one canonical current-head ledger in AuditRepo.
2. Move historical amendments out of current operational ledger into archive/history appendices.
3. Mark stale counts in project README and replace with “see current reverify ledger”.

## Lane 2 — workflow barrier integrity
1. Fix `dist:jsonld:audit` script so it satisfies `check-workflows.js`.
2. Add `npm run workflows:check` into the canonical release barrier, or explicitly document why it must stay outside.
3. Re-run full gate plus workflow guard together.

## Lane 3 — `/izbrannoe/` contract completion
1. Register route in `route-migration-matrix.json`.
2. Decide whether it should be in search manifest; if yes, add it, if no, document intentional exclusion.
3. Resolve root/local reference warning from `audit-pro`.

## Lane 4 — Gill convergence contract before UI surgery
1. Freeze desired target: keep `gbs2-*` aliases or formally retire them.
2. Update `owner-ui-regression-guard.js` in the same lane as architecture change.
3. Only then continue the mobile-bottom-bar / v16 convergence.

---

# 6. Bottom line

Мой вывод после чтения репо «от А до Я» и правил AuditRepo такой:

- это **не** проект в хаосе;
- это проект в состоянии **сложной полумиграции**, где главные риски уже не в грубых syntax bugs, а в **расслоении истины**;
- самые опасные вещи сейчас — это не очевидные падения, а:
  - зелёный gate при красном policy-guard,
  - route, который уже живёт в UX, но ещё не доведён до metadata contracts,
  - старые ledger-истины, смешанные с новыми,
  - защита, написанная под вчерашнюю архитектуру.

Именно поэтому следующий шаг должен быть **хирургическим**: не размахивать массовым аудитом, а закрыть несколько системных точек, где проект сам себе врёт или говорит полуправду.
