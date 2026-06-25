# Agent Audit Report — PremiumControls rollout verifier

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-premiumcontrols-verifier`
- Date: `2026-06-26`
- Audited branch: `main`
- Audited SHA: `106f98d chore: auto-update meta, cache-bust [skip ci]`
- Current HEAD at start: `106f98d`
- Current HEAD at end: `106f98d`
- Environment: Arena sandbox; source clone `/home/user/gb-src`
- Build mode: source/static feature-contract verification; no browser witness
- Browser / device if used: none; Playwright blocked by missing system lib `libnspr4.so`
- Evidence: `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`
- Attachments preserved in `artifacts/`:
  - `premium-controls-plan-extracted.txt`
  - `gb-floating-cluster-probe-v16-reference.html`
  - `premium-controls-reference-mobile.png`
  - `premium-controls-reference-compact.png`

---

## Executive summary

Latest project HEAD is much healthier than the earlier `02e1a0f` state: `validate:all`, `audit-pro`, `content:guard`, and native-runtime strict audit are green. However, the attached PremiumControls plan is **not fully implemented as a coherent site-wide system**.

The current code still represents a transitional `floating-cluster` implementation:

- no `PremiumControlAnchor` primitive exists;
- no `premium-controls-controller.js` / canonical `src/styles/premium-controls.css` exists;
- CSS is split between Astro component `<style is:global>` blocks and `css/floating-cluster.css`;
- some routes have visible `gb-ember` / `gb-save` but no `[data-fc-root]` or `[data-fc-controls]`, so Play/Save wiring is incomplete;
- source-level hardcoded hashes still have multiple versions even after root cache-bust is green;
- PlayEmber has split semantics: speed panel exists, but generic `handlePlayClick()` still says “Озвучка ещё не подключена” for idle state, and storage key is old `gbx-tts-rate`, not the plan's `gb:audio:rate` namespace.

This should be treated as **feature completion work before CSS/JS cleanup**, exactly as owner requested.

---

## 1. New Findings

### Finding `PC-001`

- Title: Planned `PremiumControlAnchor` layer is absent; standalone controls still self-position with `position: fixed`
- Severity: P1 (feature architecture / visual-anchor risk)
- Route(s): standalone article routes using `SingleArticleCluster`, especially Hermeneutics and Kod da Vinci
- Source file(s):
  - `src/components/ui/floating-cluster/SingleArticleCluster.astro`
  - `src/components/ui/floating-cluster/FloatingCluster.astro`
  - attached plan `artifacts/premium-controls-plan-extracted.txt`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -R "PremiumControlAnchor\|premium-control-anchor" -n src js css
  grep -n "\.gb-floater" -A30 src/components/ui/floating-cluster/SingleArticleCluster.astro
  ```
- Expected:
  - Per attached plan, rollout should split placement and UI:
    - `PremiumControlAnchor` = layout/geometry
    - `PremiumControls` = SVG/UI
    - controller = behavior
  - For article-breadcrumb routes, the control surface should live inside the old visual slot/anchor, not decide geometry itself.
- Actual:
  - No `PremiumControlAnchor` / `premium-control-anchor` exists.
  - `SingleArticleCluster.astro` renders `#gbFloatingControls` directly and CSS sets:
    ```css
    .gb-floater { position: fixed; top: ...; right: ... }
    .gb-floater--hermeneutics { top: ...; right: ... }
    ```
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, sections `Missing planned primitives` and `CSS source duplication signals`.
- Confidence: high
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-anchor-architecture-2026-06-26`
- Do not mix with: visual redesign of controls; first introduce anchor primitive and preserve current visual.
- Comments: This is the core mismatch with the PDF plan. The current implementation may look acceptable on some routes, but it remains a floating widget rather than route-aware anchored controls.

---

### Finding `PC-002`

- Title: Heart-series routes (`Krajne`, `Rimlyanam7`) have visible `gb-ember` / `gb-save` but no `[data-fc-root]` or `[data-fc-controls]`; Play/Save PremiumControls are not initialized by the controller
- Severity: P0/P1 (visible controls likely dead; feature rollout incomplete)
- Route(s):
  - `/articles/krajne-li-isporcheno-serdce/`
  - `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- Source file(s):
  - `src/components/article-pilots/krajne/KrajneBody.astro`
  - `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`
  - `js/floating-cluster-controller.js`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  python3 - <<'PY'
  from pathlib import Path
  for p in ['src/components/article-pilots/krajne/KrajneBody.astro','src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro']:
      t=Path(p).read_text()
      print(p, 'gb-ember', t.count('gb-ember'), 'gb-save', t.count('gb-save'), 'data-fc-root', t.count('data-fc-root'), 'data-fc-controls', t.count('data-fc-controls'))
  PY
  ```
- Expected:
  - Any visible `data-fc-action="play"` / `data-fc-action="save"` controls should be inside a root initialized by the PremiumControls controller, or wired by a route-specific controller.
- Actual:
  - Both files contain `gb-ember` and `gb-save` with `data-fc-action`, but contain **zero** `data-fc-root` and **zero** `data-fc-controls`.
  - `initPlayExpand()` explicitly ignores embers not inside `[data-fc-root], [data-fc-controls]`:
    ```js
    if (!ember.closest('[data-fc-root], [data-fc-controls]')) return;
    ```
  - `initCluster(root)` click delegation only attaches to roots, so `save` is also not routed through the controller.
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, `Current usages`.
  - Direct source snippets show the buttons inside `gbs2-rfoot` but outside any `data-fc-*` root.
- Confidence: high source-level; browser witness still needed for final L4
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-heart-series-wiring-2026-06-26`
- Do not mix with: hard-texts content refactor.
- Comments: This is the clearest “agent fell midway” defect: markup + controller script exist, but the route archetype root is missing.

---

### Finding `PC-003`

- Title: PremiumControls source still has multiple hardcoded controller/CSS hash versions even after latest cache-bust commit
- Severity: P1 (source drift hidden by postbuild; future conflict source)
- Route(s): multiple Astro components and root HTML references
- Source file(s):
  - `src/components/article-pilots/*`
  - root `articles/**`, `baptisty-rossii/**`, `nagornaya/**` HTML
  - `js/floating-cluster-controller.js`
  - `css/floating-cluster.css`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  md5(js/floating-cluster-controller.js) # ba4a4019
  grep -R "floating-cluster-controller.js?v=" -n src articles baptisty-rossii nagornaya --include='*.astro' --include='*.html' | sed -E 's/.*v=([a-f0-9]+).*/\1/' | sort | uniq -c
  ```
- Expected:
  - Source should not carry conflicting hardcoded asset versions for the same controller/CSS.
- Actual:
  - Actual controller hash: `ba4a4019`.
  - Source/root references include:
    ```text
    25 × ba4a4019
    14 × efd81d3a
     1 × 58c2ea90
    ```
  - Actual `css/floating-cluster.css` hash: `f4bddc5b`.
  - CSS references include `f4bddc5b` and stale `ccc70580`.
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, `Actual hashes` and `Source hardcoded floating controller/css hashes`.
- Confidence: high
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-asset-hash-source-unification-2026-06-26`
- Do not mix with: visual styling cleanup.
- Comments: `astro-cache-bust-postbuild.js` may converge `dist`, and `audit-pro` is currently green, but source remains non-monolithic. For owner’s “единый монолит” goal, this should be eliminated.

---

### Finding `PC-004`

- Title: PremiumControls CSS has no single canonical source; styles are duplicated between Astro component `<style is:global>` blocks and `css/floating-cluster.css`
- Severity: P1 (feature maintainability / drift risk)
- Route(s): all PremiumControls routes
- Source file(s):
  - `src/components/ui/floating-cluster/SingleArticleCluster.astro`
  - `src/components/ui/floating-cluster/SeriesLiteCluster.astro`
  - `src/components/ui/floating-cluster/GillRailControls.astro`
  - `css/floating-cluster.css`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -R "\.gb-floater\|\.gb-ember\|\.gb-save" -n src/components/ui/floating-cluster css/floating-cluster.css
  ```
- Expected:
  - Attached plan says one canonical CSS source, not “component copy + public CSS copy”.
- Actual:
  - `SingleArticleCluster.astro`, `SeriesLiteCluster.astro`, and `GillRailControls.astro` all contain large `<style is:global>` sections for `.gb-floater`, `.gb-ember`, `.gb-save`, rail controls, etc.
  - `css/floating-cluster.css` also contains the same family of selectors and is 69KB.
  - `audit-pro` warns about undefined variables in `css/floating-cluster.css`, showing this public CSS file is independently audited and not just a generated artifact.
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, `CSS source duplication signals`.
  - `audit-pro` warning on current HEAD: undefined vars in `css/floating-cluster.css` and CSS budget overrun.
- Confidence: high
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-canonical-css-source-2026-06-26`
- Do not mix with: broad site.css cleanup; keep this feature-scoped.
- Comments: Owner asked to finish feature first, then CSS/JS cleanup. This item is feature completion because it prevents route drift during rollout.

---

### Finding `PC-005`

- Title: PlayEmber has split semantics: speed panel exists, but generic play handler still treats idle state as “audio not connected”; storage key also differs from plan
- Severity: P2 (UX/semantics; needs browser witness)
- Route(s): all routes with `.gb-ember`
- Source file(s): `js/floating-cluster-controller.js`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -n "handlePlayClick\|gbx-tts-rate\|data-speed\|aria-expanded\|Озвучка ещё не подключена" -C2 js/floating-cluster-controller.js
  ```
- Expected:
  - Attached plan says PlayEmber should be honest interactive UI: click opens speed panel, speed persists in canonical namespace, `aria-expanded`/panel semantics are coherent.
- Actual:
  - `initPlayExpand()` creates speed panel and stores rate in `localStorage['gbx-tts-rate']`.
  - `handlePlayClick()` still says for idle state:
    ```js
    showToast('Озвучка ещё не подключена', false);
    return;
    ```
  - Keyboard shortcut `T` and root-level action delegation call `handlePlayClick()`.
  - The plan’s proposed namespace `gb:audio:rate` is not used.
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, `Controller speed panel / localStorage / disabled semantics`.
- Confidence: medium-high source-level; browser witness needed for actual conflict surface.
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-playember-semantics-2026-06-26`
- Do not mix with: actual TTS/audio engine implementation.
- Comments: This should be normalized before site-wide rollout so PlayEmber does not mean different things depending on event path.

---

### Finding `PC-006`

- Title: Current implementation uses transitional `floating-cluster` naming and lacks route-archetype lock/audit requested by the PremiumControls plan
- Severity: P2 (rollout governance / conflict prevention)
- Route(s): all PremiumControls archetypes
- Source file(s):
  - `src/components/ui/floating-cluster/FloatingCluster.astro`
  - `js/floating-cluster-controller.js`
  - route matrix/audit scripts indirectly
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -R "PremiumControls\|PremiumControlAnchor\|premium-controls-controller" -n src js css scripts
  grep -R "data-fc-mode" -n src/components
  ```
- Expected:
  - Plan requires explicit archetype handling: `single`, `series-lite`, `gill-rail`, app/disabled exclusions; routes should not receive controls by default.
- Actual:
  - Components remain `floating-cluster/*` with modes `single`, `series-lite`, ad hoc `series-rich`, `nagornaya`, and `gill` variants.
  - `data-fc-mode="series-rich"` appears on Gill context and Nagornaya roots, but `activateSinglePilot()` / `activateSeriesPilot()` only know `single`, `series-lite`, and a special `nagornaya` branch.
  - No dedicated PremiumControls rollout audit exists that checks every route archetype for allowed/forbidden controls.
- Evidence:
  - `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`, `Current usages` and `Missing planned primitives`.
- Confidence: high source-level
- Verification level: `verified-source`
- Suggested repair lane: `lane/premiumcontrols-route-archetype-audit-2026-06-26`
- Do not mix with: migration matrix wholesale refactor.
- Comments: This is how future agents will avoid adding controls to app routes or leaving half-wired controls on series routes.

---

## 2. Confirmations of Existing Findings

### Confirm older “PremiumControls feature incomplete” class

- Target report: multiple prior AuditRepo reports around floating cluster / premium controls, especially `system-floating-cluster-v16` source repo lane reports and verified ledger amendments.
- Target finding: PremiumControls rollout unfinished / inconsistent route wiring.
- My evidence:
  - Latest HEAD gates are green but route source still has partial rollouts (`Krajne`, `Rimlyanam7`) and missing planned primitives.
- Same bug / related / stronger root cause:
  - Stronger root cause: rollout lacks a canonical archetype contract and anchor/CSS/controller split.
- Recommended status: create new canonical feature-completion repair order; do not treat this as mere CSS cleanup.

---

## 3. Challenges / Disputes

### Challenge: “CSS/JS cleanup can fully wait until later”

- Target report: owner instruction clarified priority; no specific prior report.
- Reason for challenge:
  - Broad CSS/JS cleanup should wait, yes.
  - But **PremiumControls CSS/source unification and route wiring are part of finishing the feature**, not optional cleanup.
- Current HEAD evidence:
  - Without CSS/source unification, same `.gb-*` selectors exist in component styles and public CSS.
  - Without route roots, visible `gb-ember`/`gb-save` controls can remain dead on heart-series pages.
- Recommended status: keep general CSS/JS cleanup later, but include feature-scoped CSS/controller normalization in PremiumControls completion lane.

---

## 4. Duplicate / Merge Proposals

### Merge proposal: `PC-003` with cache-bust/P0-10 residuals

- Finding A: `PC-003` source hardcoded hash drift for PremiumControls assets
- Finding B: older P0-10/P3-6 hash drift family
- Why same root cause: source-level asset versioning is still manual and route-fragment-dependent.
- Canonical ID suggestion: `PREMIUM-P1-SOURCE-HASH-DRIFT-2026-06-26`

### Merge proposal: `PC-002` with older heart-series PremiumControls defects

- Finding A: `PC-002` heart-series visible controls without fc root/control scope
- Finding B: older PS-04/PremiumControls heart route partial rollout reports
- Why same root cause: visible controls added before route archetype/controller root was completed.
- Canonical ID suggestion: `PREMIUM-P0-HEART-SERIES-DEAD-FC-CONTROLS-2026-06-26`

---

## 5. Severity Proposals

- `PC-002`: P0/P1 until browser witness. Visible Play/Save controls likely dead due missing root; if browser confirms, mark P0 because user-facing controls are non-functional.
- `PC-001`: P1 because it blocks top-quality site-wide rollout, but does not necessarily break current route behavior.
- `PC-004`: P1 because CSS duplication will cause conflicts as rollout expands.
- `PC-005`: P2 pending browser witness.

---

## 6. Repair Lane Suggestions

### Lane: `lane/premiumcontrols-feature-completion-2026-06-26`

- Bug IDs:
  - `PC-001`
  - `PC-002`
  - `PC-003`
  - `PC-004`
  - `PC-005`
  - `PC-006`
- Why together:
  - These are all part of finishing PremiumControls as a route-aware system.
- What must NOT be mixed:
  - global `site.css` debt reduction;
  - broad JS decomposition;
  - MapEngine refactor;
  - content repairs.

### Suggested sub-order inside the lane

1. Add route archetype inventory/audit first.
2. Fix heart-series root/wiring for `Krajne` and `Rimlyanam7`.
3. Normalize PlayEmber semantics + storage key aliases.
4. Introduce `PremiumControlAnchor` (or explicitly document transitional decision if owner keeps `floating-cluster` name).
5. Consolidate feature CSS source or generate public CSS from one source.
6. Normalize source asset hash delivery so postbuild is not hiding stale source.
7. Add Playwright smoke once browser deps are available.

---

## 7. Reverify Notes

- Current HEAD `106f98d` broad gates:
  ```text
  validate:all ✅
  audit-pro ✅ 162 passed, 0 errors
  content:guard ✅
  native:runtime:audit:strict ✅ 51/52 strict-native
  ```
- Therefore the current problem is **not general broken CI**, but **feature rollout incompleteness not covered by current gates**.

---

## 8. Notes for Verifier

1. The attached PDF plan is strong and should become the canonical PremiumControls repair order.
2. The current code is useful and partially works, but it is still named/structured as `floating-cluster`, not final PremiumControls architecture.
3. Do not retire `css/floating-cluster.css` or component styles blindly. First decide canonical CSS source and generation path.
4. Do not add controls to app routes by default (`karty/*`, `/map/`, `/konfessii/russkij-baptizm/`) without explicit archetype decision.
5. Browser witness is still required for clickability, speed persistence, mobile rail/bar behavior, and exact visual alignment.

---

## Files in this intake folder

- `README.md`
- `REPORT.md`
- `evidence/premiumcontrols-current-source-evidence-2026-06-26.md`
- `artifacts/premium-controls-plan-extracted.txt`
- `artifacts/gb-floating-cluster-probe-v16-reference.html`
- `artifacts/premium-controls-reference-mobile.png`
- `artifacts/premium-controls-reference-compact.png`
