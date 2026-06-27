# PremiumControls — current-main delta verifier after source HEAD `0159da05`

**Project:** `gb-is-my-strength` / `gospod-bog.ru`
**Date:** 2026-06-27
**Previous independent baseline:** `819fd3f1`
**New source HEAD audited:** `0159da05` (`[LANE lane/system-external-checks-registry] Add verified external checks registry`)
**Verifier role:** continue current-head audit, check whether new source docs/code changed PremiumControls truth.

---

## 0. Executive delta

Source `origin/main` advanced from `819fd3f1` to `0159da05` after the previous independent report.

The new source commit is mostly **documentation / external-check registry / workflow text**, not a PremiumControls code repair:

```text
.github/workflows/notify-on-failure.yml
.github/workflows/shared-files-guard.yml
AGENTS.md
audit/external-checks/README.md
docs/BUGS_FOUND_2026-06-25.md
docs/LANE_LOCK_POLICY.md
```

Important result: **all previously reported code-level PremiumControls holes remain live** on `0159da05`.

What changed usefully:

- `docs/BUGS_FOUND_2026-06-25.md` now contains new BUG-032..BUG-036 entries, including the stale Gill `gbs2-rail` dist-audit problem.
- `audit/external-checks/README.md` records external-check classification and says `strangler:audit:production-like` fails due to BUG-032.

What did not change:

- `scripts/dist-publication-audit.js` still expects old `gbs2-rail` on four Gill routes.
- `premium-controls-rollout-audit.js` still passes while `gb-roman=0` on every Gill route.
- Unversioned PremiumControls CSS/controller refs remain.
- The stale/false sections in older bug docs still need current-head interpretation.

---

## 1. Commands rerun on `0159da05`

### 1.1 Workflow policy

```bash
npm run workflows:check
```

Result:

```text
GB WORKFLOW POLICY CHECK
✅ Workflow policy passed
```

### 1.2 PremiumControls rollout audit

```bash
npm run audit:premium-controls:no-build
```

Result still passes:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
```

But it still warns instead of failing:

```text
/articles/dzhon-gill-*-... missing gb-roman class
```

So PC-CURRENT-02 remains: `gb-roman=0` is not enforced.

### 1.3 Dist publication audit

```bash
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

Still fails:

```text
exit=1
❌ /articles/dzhon-gill-spravochnik/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-1-chelovek/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-2-uchenyi/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/dzhon-gill-chast-3-nasledie/ in dist is missing visual-shadow markers: gbs2-rail
❌ dist publication audit failed: 4 issue(s)
```

So PC-CURRENT-01 remains open.

---

## 2. Browser/server audits rerun

A static server was started:

```bash
python3 -m http.server 8080 --bind 127.0.0.1 -d dist
```

### 2.1 `npm run visual-audit`

Result:

```text
Pages audited:     52
Screenshots:       156
Console errors:    0
Network errors:    0
Raw bugs:          89
After suppression: 2
Suppressed kinds:  {"invisible-text":87}
❌ Visual audit found 2 blocking HIGH/CRITICAL bug(s).
```

Parsed `visual-audit-report.json`:

```json
{"severity":"HIGH","page":"/articles/dzhon-gill-chast-1-chelovek/","viewport":"mobile","kind":"bio-cover-missing","detail":"bio-cover 16:9 block missing from Gill chast-1 article"}
{"severity":"HIGH","page":"/articles/dzhon-gill-chast-1-chelovek/","viewport":"desktop","kind":"bio-cover-missing","detail":"bio-cover 16:9 block missing from Gill chast-1 article"}
```

This confirms source `docs/BUGS_FOUND_2026-06-25.md` BUG-034 as a current red visual-audit surface.

Interpretation is still open:

- If Gill v16 intentionally removed the `bio-cover`/legacy cover block, update `visual-audit.js` contract.
- If the cover is required by owner visual contract, repair Gill Part 1 page chrome/content.

Do not hide this as a PremiumControls success; it is a real red visual gate until classified.

### 2.2 `npm run interactive-audit`

Result:

```text
GB INTERACTIVE AUDIT
Pages: 41 · series: 5 · quizzes: 6 · glossary: 3 · theme: 4 · search: 4 · media: 2
❌ 17 issue(s)
```

Issue classes:

```text
15× Gill v16 selector drift:
- gbs-rail-not-visible
- gbs-no-current-part
- gbs-mobile-ui-missing

2× mobile theme visibility:
- mobile-theme-control-not-visible /articles/dzhon-gill-chast-1-chelovek/
- mobile-theme-control-not-visible /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
```

This confirms source BUG-033 and BUG-035 as current audit surfaces.

Interpretation:

- The 15 Gill `gbs-*` failures are very likely stale selector checks because current pages use v16 `gbs-rail` / `mobile-bottom-bar` rather than legacy `gbs2-*`.
- The 2 mobile theme visibility failures require manual viewport triage. Do not assume false-positive until a Playwright DOM/screenshot check proves a visible tappable theme control.

---

## 3. Source `docs/BUGS_FOUND_2026-06-25.md` review after `0159da05`

### What is good

The source repo now documents:

- **BUG-032** — stale `dist-publication-audit.js` expects `gbs2-rail` on 4 Gill routes.
- **BUG-033** — `interactive-audit.js` checks stale `.gbs2-*` selectors after Gill v16.
- **BUG-034** — `visual-audit.js` stale/possibly wrong Gill cover selector.
- **BUG-035** — mobile theme control visibility issues need triage.
- **BUG-036** — Pa11y contrast errors on home page.

This is useful, but new agents must still treat the file as a mixed historical ledger, not canonical current truth.

### Corrections / caveats

#### BUG-032 repair text is under-specified

The source bug says replace `gbs2-rail` → `gbs-rail` for four Gill routes.

Better repair: require both current v16 markers:

```js
'data-gill-v16', 'gbs-rail'
```

This prevents a future page with accidental bare `gbs-rail` but no v16 scope from passing.

#### Old BUG-029 is stale/inaccurate on current head

Old text says `RomanNumeral.astro` renders `fc-roman` and CSS lacks `gb-roman`.

Current truth:

- `RomanNumeral.astro` renders `gb-roman`.
- `css/floating-cluster.css` defines `.gb-roman`.
- The active problem is that Gill PageChrome files do not use `RomanNumeral`, so `dist` has `gb-roman=0`.

So do not repair BUG-029 literally; repair PC-CURRENT-02.

---

## 4. Updated current issue matrix after `0159da05`

| ID | Status on `0159da05` | Notes |
|---|---|---|
| PC-CURRENT-01 stale `dist-publication-audit` Gill markers | OPEN | Source docs now have BUG-032; code not fixed. |
| PC-CURRENT-02 RomanNumeral false-green | OPEN | Still missing from source BUG-032..036; old BUG-029 is stale formulation. |
| PC-CURRENT-03 unversioned PremiumControls asset refs | OPEN | Not fixed by new commit. |
| PC-CURRENT-04 `css/premium-controls.css` architecture drift | OPEN | Not fixed by new commit. |
| PC-CURRENT-05 malformed transition declarations | OPEN | Not fixed by new commit. |
| BUG-033 interactive-audit stale Gill selectors | CONFIRMED | Needs audit-script update or v16/legacy dual selector support. |
| BUG-034 visual-audit Gill cover red | CONFIRMED | Needs contract decision: stale selector or real missing cover. |
| BUG-035 mobile theme visibility | CONFIRMED AS AUDIT SURFACE | Needs manual triage before classifying false-positive. |

---

## 5. Practical next steps for agents

### Immediate code lane 0

Patch `scripts/dist-publication-audit.js` using stronger markers:

```js
['gbs-world', 'data-gbs2-series="dzhon-gill"', 'data-gill-v16', 'gbs-rail']
```

Run:

```bash
npm run strangler:audit:production-like
npm run validate:static-publication
```

### Audit-script lane 0b

Update `interactive-audit.js` to support Gill v16 selectors:

- desktop rail: `.gbs-rail`
- current card: `.gbs-rail-card.is-current` / `aria-current="page"`
- mobile UI: `.mobile-bottom-bar`, `#seriesTocOverlay`, `#partTocOverlay`

Keep legacy `gbs2-*` checks for Heart/Baptisty/Nagornaya where still applicable.

### Visual-audit lane 0c

For `/articles/dzhon-gill-chast-1-chelovek/`, decide whether `bio-cover` is still required. Either:

- update `visual-audit.js` to accept the v16 visual structure; or
- restore the expected cover block if owner visual contract requires it.

### PremiumControls hardening lanes

Proceed with the previously documented sequence:

1. asset/hash truth,
2. RomanNumeral truth,
3. CSS architecture truth,
4. malformed CSS transition cleanup,
5. controller smoke/decomposition.

---

## 6. Final delta verdict

`0159da05` improved documentation and external-check registry but did **not** fix the core PremiumControls code/audit holes. It also confirms that source repo now knows about BUG-032..036, but those bug entries are not enough for safe implementation without the stronger current-head correction in AuditRepo.

Use this file together with:

- `PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`
- `PREMIUMCONTROLS_BUG_REPORT_FOR_SOURCE_REPO_2026-06-27.md`
