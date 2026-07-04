# verification-editor — PremiumControls deep reverify addendum (source HEAD 87505f1b)

**Project:** `gb-is-my-strength` / `gospod-bog.ru`  
**Audit repo:** `FedorMilovanov/AuditRepo`  
**Date:** 2026-06-27  
**Verifier role:** verification-editor / deep continuation pass  
**Source HEAD audited:** `87505f1b` (`audit: extend verified external checks on main`)  
**Previous baselines reviewed:** `819fd3f1`, `0159da05`, AuditRepo `46c4e62`

---

## 0. Scope and guardrails

This report is an **addendum**, not a replacement for prior canonical/current-head reports.  
It was produced after a fresh source sync to `origin/main` and a new heavy verification pass with Node 22.

Goals:

1. re-check whether the source moved after the earlier independent PremiumControls audit;
2. rerun a broad verification set (50+ shell / Node / build / audit actions in aggregate);
3. separate **true current defects** from **tooling/environment blockers**;
4. avoid overturning previous findings without direct evidence.

---

## 1. Environment actually used

```text
Node: v22.12.0
npm: 10.9.0
Playwright package: 1.61.1
Source HEAD: 87505f1bfb8e2d174047af00e30063927870cc3c
```

Workspace notes:

- source repo was hard-reset to `origin/main` before the pass;
- dependencies were reinstalled with `npm ci` under Node 22;
- Chromium browser binaries were downloaded with `npx playwright install chromium`;
- browser execution in this sandbox remains partially blocked by missing shared libs (`libnspr4.so`), so browser-type failures were recorded as **environment-blocked**, not silently treated as product failures.

Deep-pass raw log:

```text
/home/user/gb/.arena/deep-pass-20260627-133403.log
```

---

## 2. Source delta since previous PremiumControls current-head reports

Current source `main` is now:

```text
87505f1b audit: extend verified external checks on main
```

Recent head chain:

```text
87505f1b audit: extend verified external checks on main
0159da05 [LANE lane/system-external-checks-registry] Add verified external checks registry
819fd3f1 chore: auto-update meta, cache-bust [skip ci]
83f0acdc fix(premiumcontrols): mobile fallback for hidden series controls
...
```

### What changed since `0159da05`

The source moved further in **audit / external-check documentation**, not in core PremiumControls implementation.  
No evidence was found that the remaining PremiumControls code-level issues were repaired in this delta.

Therefore the earlier current-head findings remain relevant unless directly contradicted below.

---

## 3. Broad verification summary

## 3.1 Green / confirmed-passing under Node 22

The following passed in this run:

- `npm run workflows:check` ✅
- `npm run guard:shared-files` ✅
- `node scripts/audit-pro.js` ✅ PASS with one warning class
- `npm run validate:static-publication:light` ✅
- `npm run audit:premium-controls:no-build` ✅ `39/39`
- `node scripts/check-data-consistency.js` ✅
- `npm run migration:metadata:check:strict` ✅
- `npm run content:guard` ✅
- `npm run mdx:structure:audit` ✅
- `npm run contract:compare` ✅
- `npm run readable-audit` ✅
- `npm run editorial:lint` ✅
- `npm run tokens:check` ✅
- `npm run css:layer:validate` ✅
- `npm run gill:reading-time:audit` ✅
- `npm run gill:pagefind:audit` ✅
- `npm run strangler:build:production-like` ✅
- `npm run audit:premium-controls` ✅
- `PATH=/home/user/node22/bin:$PATH npm run pagefind:build:dist` ✅
- `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` ✅ **after Pagefind is actually built**

### Important correction

A previous independent report treated `dist-publication-audit.js --require-pagefind --forbid-dev` as failing on stale Gill markers.

On current source HEAD `87505f1b`, after a fresh production-like build **and** Pagefind generation, this audit now passes fully.

So the old `PC-CURRENT-01` finding is **no longer current on 87505f1b**.

---

## 3.2 Still-open current issues confirmed by source/code inspection

### PC-CURRENT-02 — RomanNumeral remains false-green

Still confirmed-current.

Evidence remains consistent with earlier reports:

- `AGENTS.md` claims Roman numerals must use `RomanNumeral.astro`;
- `owner-ui-regression-guard.js` only proves the component exists;
- `premium-controls-rollout-audit.js` only treats missing `gb-roman` as a warning path under its current classifier;
- Gill output still carries raw numerals in multiple places.

This run did not find evidence that `gb-roman` is truly landed end-to-end across Gill dist output.

**Status:** OPEN.

### PC-CURRENT-03 — asset-version truth remains suspect / not yet authoritatively closed

Still treated as open/suspect.

Reason:

- historical reports found unversioned PremiumControls refs in Astro-owned outputs;
- source still contains hardcoded references and mixed asset-version pathways;
- this run did not produce enough browser-level/live-dist proof to safely retire the finding.

**Status:** OPEN / needs targeted reverify lane, not safe to retire.

### PC-CURRENT-04 — `css/premium-controls.css` inventory drift remains real

Confirmed by direct source grep:

```text
AGENTS.md lists: css/premium-controls.css
scripts/cache-bust.js lists: css/premium-controls.css
```

But runtime truth is still centered on `css/floating-cluster.css`, and the earlier architecture-drift concern remains valid.

**Status:** OPEN.

### PC-CURRENT-05 — malformed `floating-cluster.css` transition fragments remain real

Direct grep in this run still found malformed lines such as:

```text
[data-gill-v16] background .28s var(--gb-ease-out),[data-gill-v16]
[data-gill-v16] border-color .28s var(--gb-ease-out),[data-gill-v16]
...
```

This syntax debt remains present.

**Status:** OPEN.

---

## 4. PremiumControls-specific current truth on `87505f1b`

### 4.1 Rollout audit is green, but not fully sufficient

```bash
npm run audit:premium-controls:no-build
```

Result:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

Interpretation:

- the main rollout contract is healthy enough to pass;
- but this does **not** prove RomanNumeral truth;
- and it does **not** by itself close asset-version drift.

So the audit is useful, but still not “perfectly bulletproof”.

---

### 4.2 Dist publication audit is now green when run correctly

The first failing attempt in the raw log was caused by calling:

```bash
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

**before** building Pagefind into `dist/pagefind`.

That failure was therefore procedural:

```text
❌ sw.js precache asset missing in dist: /pagefind/pagefind.js
❌ Pagefind required but dist/pagefind/pagefind.js missing
❌ Pagefind entry metadata missing: pagefind/pagefind-entry.json
```

After running:

```bash
npm run pagefind:build:dist
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

Result:

```text
✅ dist publication audit passed
```

### Consequence

The old stale-Gill-marker blocker is no longer the active truth for current `main`.

---

## 5. Gill-family truth update

Earlier reports established that old “Gill is split between legacy and v16” narratives had become stale.
This addendum does **not** reverse that conclusion.

Current verification still supports:

- Gill routes are broadly on the v16 family, not on the old `gbs2-rail` path as a current primary truth;
- the remaining Gill issue set is more about **contract truth and audit drift** than broad legacy-vs-v16 structural collapse.

However, one important nuance remains:

- **RomanNumeral integration is still not proven landed**, so Gill should not be described as “fully complete” yet.

---

## 6. Browser-dependent checks in this pass

## 6.1 Browser execution blocker in sandbox

Several browser-driven scripts failed to launch Chromium headless shell due to missing system shared library:

```text
libnspr4.so: cannot open shared object file: No such file or directory
```

This affected browser-style runs such as:

- `npm run visual-audit`
- `npm run interactive-audit`
- `node scripts/premium-mobile-visibility-smoke.js`
- browser sections inside `strangler:audit:production-like`

### Classification

These failures are **environment-blocked in the current sandbox**, not automatically source regressions.

Therefore:

- do **not** mark visual/mobile/browser gates green from this run;
- do **not** mark them red as confirmed product regressions from this run alone;
- keep prior verified browser evidence in force until rerun in a browser-capable environment.

---

## 6.2 What can still be said safely about browser gates

Because browser checks were blocked here, the safest position is:

- previous reports that confirmed mobile fallback and broad PremiumControls functionality remain the last valid browser evidence;
- any new browser-only defect claims would require a rerun in a machine/environment with complete Playwright runtime libs.

So this addendum is **strong on code/build/contract truth**, but only **limited** on fresh browser truth.

---

## 7. Current risk matrix after this addendum

| ID | Status on `87505f1b` | Notes |
|---|---|---|
| PC-CURRENT-01 stale dist-publication Gill marker contract | **RETIRED on current head** | Current `dist-publication-audit` passes after proper Pagefind build. |
| PC-CURRENT-02 RomanNumeral false-green | **OPEN** | Still no direct proof of end-to-end `gb-roman` landing in Gill output. |
| PC-CURRENT-03 asset-version truth drift | **OPEN / needs targeted proof** | Not safe to retire yet. |
| PC-CURRENT-04 `css/premium-controls.css` inventory drift | **OPEN** | Direct source evidence still present. |
| PC-CURRENT-05 malformed transition fragments | **OPEN** | Direct source grep still confirms. |
| Browser/mobile fresh reverify on this exact head | **BLOCKED IN SANDBOX** | Missing `libnspr4.so` prevents trustworthy rerun here. |

---

## 8. Updated recommended repair order

### Priority A — keep current retirement honest

Update canonical/current-head docs so they do **not** keep presenting PC-CURRENT-01 as active on current source `87505f1b`.

### Priority B — targeted RomanNumeral truth lane

Audit and fix Gill numeral rendering so the contract becomes provably true in dist, then make missing `gb-roman` fatal where appropriate.

### Priority C — asset-version truth lane

Do a narrow source+dist verification lane specifically for PremiumControls CSS/controller refs and hash/version discipline.

### Priority D — CSS contract lane

Resolve whether `css/premium-controls.css` is:

- an intentionally absent source-only conceptual artifact, or
- a missing runtime/generated artifact that should exist.

### Priority E — micro syntax lane

Fix malformed transition fragments in `css/floating-cluster.css` without mixing geometry/layout changes.

---

## 9. Final editorial verdict

On source HEAD `87505f1b`, PremiumControls remains **substantially stabilized and broadly healthy**, and one previously reported blocker (`PC-CURRENT-01`) is no longer current when the dist audit is run correctly with Pagefind built.

However, the subsystem is **still not eligible for a blanket “100% complete” claim** because:

- RomanNumeral truth is still not fully evidenced end-to-end;
- asset-version truth remains insufficiently closed;
- `css/premium-controls.css` contract drift remains unresolved;
- malformed transition fragments remain in the live CSS source;
- fresh browser/mobile reruns in this sandbox are blocked by missing shared libraries, so no new browser-perfect certification should be claimed from this pass.

In short:

> PremiumControls current truth improved again; one former blocker retired; several contract-level holes remain; browser re-certification still needs a fuller environment.
