# Agent Audit Report — dist CSS parity rejects valid Astro CSS

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena.ai Agent Mode
- Date: 2026-07-17
- Audited branch/ref: Product `main`
- Audited anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; live `https://gospod-bog.ru/app/`; deploy run `32051788316`
- Environment: Linux x86_64; Node `22.23.2`; npm `10.9.8`; repository acquired from exact GitHub archive
- Build mode: source + production-like `dist` + live
- Browser / device if used: rendered-text/live-HTML inspection; no visual-browser claim
- Scope: CSS-presence admission for current strict-native `/app/`
- Explicit exclusions: visual quality, Telegram application behavior, Product mutation, full browser screenshot comparison
- Signal class: audit harness / release control-plane
- Proof state: `FAIL` for `dist:css-parity`; `PASS` for actual CSS presence on current dist/live page
- Claim boundary: current CSS parity detector false-reds on valid Astro-generated hashed CSS and is absent from the actual deploy admission steps
- Preservation boundary: preserve the fail-closed guarantee that every public route has resolvable project styling; do not weaken the gate to mere arbitrary stylesheet-string presence
- Semantic owner: `scripts/dist-css-parity-audit.js`, production-like audit composition, deploy admission workflow
- Overlapping active owner/PR/branch check: GitHub API returned no open Product PRs/issues and only Product `main`; no Product repair lane was created

> The anchor records what this pass actually inspected. Later Product movement does not rewrite this report.

---

## 1. New observations

### Observation `ARENA-CSS-PARITY-ASTRO-HASHED-ASSET`

- Title: CSS parity gate reports the styled `/app/` page as unstyled
- Kind: audit-harness defect
- Suggested impact: medium
- Route(s) / owner(s): `/app/`; strict-native Astro owner `src/pages/app/index.astro`; detector `scripts/dist-css-parity-audit.js`
- Observed on anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`
- Expected: a production-like `dist/app/index.html` carrying a valid, resolvable Astro-generated stylesheet must pass the CSS-presence gate
- Actual: `npm run dist:css-parity` exits 1 with `app/index.html: NO project CSS`, although the page links `/_astro/index.Y8LdaEC7.css` and that file exists in `dist/_astro/`
- Reproduction or inspection steps:
  1. build exact current source with `node scripts/astro-cli.mjs build`;
  2. run `node scripts/copy-legacy-to-dist.js --omit-build-only`;
  3. run `GB_BUILD_INSTANT=2026-08-17T17:45:57Z node scripts/astro-cache-bust-postbuild.js`;
  4. run `npm run dist:css-parity`;
  5. inspect stylesheet links in `dist/app/index.html` and existence of the linked `_astro` asset
- Evidence type: verified-source + verified-build + verified-live + verified-lifecycle
- Evidence:
  - detector source accepts only `/css/(site|site|home).css/` or inline `<style>`;
  - current Astro compiles the source `<style is:global>` into `/_astro/index.Y8LdaEC7.css`;
  - `dist/app/index.html` links both `/css/reader-preferences.css?...` and `/_astro/index.Y8LdaEC7.css`;
  - `dist/_astro/index.Y8LdaEC7.css` exists and has SHA-256 `81a65addb5df86b4d4a1b2e2b49280bd534e0522fb3ecace69e8cbd992a3068d`;
  - live `/app/` links the same Astro CSS path and serves a styled semantic page;
  - deploy run `32051788316` succeeded on this exact Product SHA
- Confidence: high
- Limitations of this method: no pixel screenshot comparison; this proves resolvable CSS ownership/presence and detector mismatch, not that every visual declaration is correct
- Possible mechanism: the gate encodes legacy stylesheet names and inline styles but does not recognize Astro/Vite hashed stylesheet output
- Related existing findings: none found in current AuditRepo search; distinct from the Krajne root/reference audit-boundary candidate
- Applicability: the inspected `dist` was generated from the exact current source anchor using the repository build/copy/postbuild owners and a deterministic build instant
- What this evidence does **not** prove: it does not prove `/app/` is visually defective; evidence instead contradicts that interpretation

### Observation `ARENA-CSS-PARITY-NOT-IN-DEPLOY-ADMISSION`

- Title: the CSS parity gate is present in the composite production-like audit but absent from deploy admission
- Kind: control-plane/audit-harness gap
- Suggested impact: medium
- Route(s) / owner(s): all published routes; `.github/workflows/deploy.yml`, `.github/workflows/deploy-candidate-contract.yml`, `package.json`
- Observed on anchor: same exact Product SHA
- Expected: a gate documented as preventing publication of pages with zero project CSS should either be valid and run in release admission, or its narrower/non-release role should be explicit
- Actual: `strangler:audit:production-like` includes `npm run dist:css-parity`, while deploy run `32051788316` executes publication, JSON-LD, schema, premium controls, browser smoke and content coverage but has no CSS parity step. The exact release succeeds although a direct invocation of the advertised gate fails.
- Evidence type: verified-source + verified-lifecycle
- Evidence: package script composition, deploy workflow steps, and GitHub Actions jobs for exact run `32051788316`
- Confidence: high
- Limitations of this method: absence from deploy may be an intentional owner choice; no owner rationale was found in the inspected current sources
- Possible mechanism: release workflow evolved separately after the legacy CSS gate was added; stale detector semantics prevented safe admission
- Related existing findings: same cluster as `ARENA-CSS-PARITY-ASTRO-HASHED-ASSET`
- Applicability: deploy run and source workflow both refer to the exact Product SHA
- What this evidence does **not** prove: it does not prove an unstyled page was released at this anchor; `/app/` is positively witnessed as styled

---

## 2. Confirmations and extensions

### Confirm or extend the gate's historical purpose

- Target report/finding: comment in `scripts/dist-css-parity-audit.js` describing the prior 41/50-pages-with-zero-CSS regression
- Evidence angle added: current native Astro output
- My evidence anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`, generated `dist`, live `/app/`
- Result: narrower scope
- What this changes: the fail-closed goal remains valid, but the implementation no longer models all current stylesheet owners. Astro hashed assets are a current legitimate class and must be verified rather than rejected.

### Confirm production-like artifact correctness around the finding

- Target report/finding: whether the local artifact was malformed generally
- Evidence angle added: adjacent production-like checks
- My evidence anchor: same generated `dist`
- Result: stronger mechanism
- What this changes: `dist:jsonld:audit`, `schema:rich-results:audit:dist`, `content:coverage:audit`, `dist-publication-audit --require-pagefind --forbid-dev`, and service-worker readiness pass after the complete postbuild. The CSS failure is isolated to detector classification rather than a generally broken artifact.

---

## 3. Challenges and negative findings

### Challenge `app/index.html is unstyled`

- Target report/finding: literal failure text from `dist:css-parity`
- Reason: the detector's accepted forms are incomplete
- Contradictory evidence angle: source + built artifact + live surface
- Evidence anchor: exact Product SHA, current `dist/app/index.html`, current live `/app/`
- Recommended result: `audit-drift / false-red`; do not create a Product UI bug for `/app/`

### Challenge initial incomplete-postbuild sitemap failures

- Target report/finding: transient `dist:jsonld:audit` failures observed before postbuild completed
- Reason: the first manual postbuild lacked required `GB_BUILD_INSTANT` and stopped before sitemap projection
- Contradictory evidence angle: complete postbuild with deterministic instant followed by rerun
- Evidence anchor: final complete production-like artifact
- Recommended result: `wrong-build / invalid`; after complete postbuild the audit reports `sitemap images match 76 canonical page OG owners`

---

## 4. Root-cause clusters

### Cluster `CSS-PRESENCE-ADMISSION-OWNER-DRIFT`

- Symptoms absorbed:
  - valid `/app/` fails `dist:css-parity`;
  - composite production-like audit is red on current main;
  - release admission omits the historical CSS-presence gate
- Shared mechanism: the detector recognizes legacy named CSS and inline styles, but current Astro owns CSS through emitted hashed `/_astro/*.css` assets. Workflow admission cannot safely adopt a detector that false-reds current valid output.
- Why cluster instead of separate Product bugs: both symptoms concern one semantic owner—classification and admission of stylesheet ownership—not the `/app/` UI itself
- Required class-level guard: parse stylesheet links, resolve same-origin assets inside `dist`, classify approved styling owners, and include adversarial fixtures for missing asset, empty asset, reader-preferences-only utility CSS, and valid Astro route CSS
- Historical IDs absorbed: none identified

---

## 5. Value and cost assessment

| Item | Value | Cost | Assessment |
|---|---|---|---|
| Recognize and resolve Astro hashed CSS | Restores truthful CSS-presence signal | Small/medium | Necessary audit repair |
| Verify linked CSS exists and is non-empty | Preserves fail-closed behavior | Small | Necessary |
| Distinguish route CSS from utility-only reader preferences | Prevents a shallow false-green | Medium | Recommended in same owner |
| Add corrected gate to deploy admission | Prevents recurrence of zero-project-CSS publication | Small workflow diff after detector repair | Valuable; current omission is a release-control gap |
| Add CSS links manually to `/app/` | No value; page is already styled | Small but misleading | Do not do |

Current user impact is not a broken page. The value is restoring a trustworthy release invariant so future unstyled-route regressions cannot pass merely because the detector was omitted.

---

## 6. Suggested verification wave

1. Reproduce current false-red on exact current Product head.
2. Enumerate stylesheet ownership classes across all 85 production routes:
   - legacy `/css/site.css`/`home.css`;
   - inline style where intentionally retained;
   - Astro/Vite `/_astro/*.css`;
   - intentional self-contained `_app` exclusion.
3. Implement detector fixtures:
   - valid hashed Astro stylesheet that exists and is non-empty → PASS;
   - hashed link with missing target → FAIL;
   - empty target → FAIL;
   - only `/css/reader-preferences.css` with route classes but no route styling → FAIL;
   - no stylesheet and no inline style → FAIL.
4. Run corrected gate against a complete production-like `dist`.
5. Run broad publication/browser smoke to ensure no classification-only shortcut hides an unstyled page.
6. Inspect deploy workflow collision and then make corrected gate always-created in candidate admission if owner approves.
7. Re-run workflow-policy/control-plane checks.

Success criterion: exact candidate passes because every included route has a resolvable approved style owner; mutation fixtures reliably fail; deploy admission executes the corrected check.

---

## 7. Suggested repair boundaries

### Local repair option

- Allowed owner: `scripts/dist-css-parity-audit.js` plus a focused regression test/fixtures
- Preserve:
  - recursive public `index.html` coverage;
  - intentional `/_app/` self-contained exclusion unless separately reclassified;
  - hard failure for genuinely unstyled pages
- Do not:
  - whitelist `/app/` by route name;
  - accept any stylesheet link without resolving it;
  - treat `reader-preferences.css` alone as proof of complete route styling;
  - mutate `/app/` markup merely to satisfy the stale regex

### Control-plane follow-up

- After detector repair, add the corrected gate to release candidate admission and corresponding workflow-policy assertions.
- Keep this follow-up in the same semantic system lane or sequence it directly after detector correction; adding the current broken command first would make every release red.

Required checks: corrected adversarial suite, complete production-like build, CSS parity, broad dist smoke, workflow policy, control-plane audit.

---

## 8. Owner decisions

1. Confirm that the repository intends “every public route has a resolvable project/route stylesheet owner” as a release invariant, not merely a historical optional audit.
2. Confirm whether Astro-generated `/_astro/*.css` is an approved first-class owner for strict-native routes. Current source/build/live behavior strongly indicates yes.
3. Decide whether the corrected CSS parity check must become an always-created deploy admission check. Recommendation: yes, after false-red repair.
4. Decide whether utility-only CSS such as `reader-preferences.css` is insufficient by itself. Recommendation: require route styling or a documented intentionally unstyled route contract.

No decision is needed about changing `/app/` presentation: this audit found no current presentation defect and authorizes no Product UI mutation.
