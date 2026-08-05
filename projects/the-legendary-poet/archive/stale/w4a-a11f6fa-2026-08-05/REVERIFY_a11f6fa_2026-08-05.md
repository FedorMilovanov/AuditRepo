# Reverify — source `main@a11f6fa`

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Source branch: `main`
- Source SHA: `a11f6faff984cd599539e04696717c6fb336329b`
- Source PR: `#318`
- Exact tested head: `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`
- Previous production: `4544bb387108a98641313267beafe29deb71ee81`
- Date: `2026-08-05`
- Result: `current and closed for W4-A`

## Proof chain

1. W4 started from exact W3 production `main@4544bb387108a98641313267beafe29deb71ee81`.
2. The production baseline was measured before budgets were changed: entry about `612.81 KiB`, another shared asset about `488.82 KiB`, fourteen lazy route chunks, about `1597.1 KiB` total JavaScript and `244.8 KiB` total CSS.
3. Source `#318` introduced four reusable repository-local workflow actions for Node/npm, deterministic system tools, locked Playwright browsers and preview readiness.
4. CI and all four Manual Browser jobs moved to those actions without deleting an existing acceptance suite.
5. The standalone community mobile workflow was retired only after Android topology entered the mandatory core job and iPhone topology entered the mandatory fresh-process WebKit runner.
6. The build validator replaced broad opaque ceilings with one entry budget, fourteen route-specific budgets, one single-JavaScript-asset ceiling and total JS/CSS limits.
7. The build validator emits `dist/build-budget-report.json` before returning and CI uploads it as exact-head evidence.
8. Static validators were updated from literal old workflow paths/commands to the new durable shared-action and consolidated-topology contract.
9. Early exact-head failures were validator-coupling failures, not product failures: the community validator still read the retired workflow and the browser-runtime validator required literal commands inside Manual Browser YAML. Both were repaired without weakening the underlying contracts.
10. The final Yesenin Part I attempt was initially cancelled while GitHub's runner remained in `apt-get` until the 30-minute job timeout. No dependency, build or browser step had run. Only that job was rerun on the same exact SHA, and it passed.
11. Every required exact-head source workflow became green; Pages retained its expected PR-event skip.
12. Manual Browser QA passed all four jobs and its logs proved Android and fresh-process iPhone community topology after standalone workflow retirement.
13. Immediately before merge, source `main` was unchanged, compare was `behind=0`, the PR head was unchanged, review threads were empty and the separate source `#317` lane remained staging-only draft work.
14. Expected-head squash merge produced source `main@a11f6faff984cd599539e04696717c6fb336329b`.
15. Post-merge `package.json` was re-read from production and contains the consolidation validator in repository-wide `check` with exact Playwright `1.61.1`.
16. Post-merge Manual Browser workflow was re-read and uses all four shared actions while retaining the complete suite list and Android topology.
17. Post-merge WebKit process runner was re-read and includes community topology as a dedicated fresh iPhone Safari process.
18. Post-merge consolidation validator was re-read and forbids return of the standalone community workflow, requires the four shared actions, preserved suites and measured budget constants.
19. The retired `.github/workflows/community-scaling-browser.yml` was requested from production and returned `404`, confirming intentional removal.

## Final source workflow matrix

- Content model contract `31027194200` — success
- Articles catalog acceptance `31027192685` — success
- Brand raster QA `31027192267` — success
- Yesenin Part I browser acceptance `31027191285` — success after same-SHA infrastructure retry
- Yesenin Part II safe publication `31027189583` — success
- Project contracts `31027189299` — success
- CI `31027189279` — success
- Site route integrity audit `31027189272` — success
- Brand deep reference and motion audit `31027189290` — success
- Manual Browser QA `31027189628` — success, 4/4 jobs
- Request Pages deployment `31027189364` — expected skip

## Budget readback

- entry: `612,810 / 665,000 B`;
- total JavaScript: `1,635,465 / 1,800,000 B`;
- total CSS: `250,679 / 300,000 B`;
- fourteen distinct named lazy route chunks;
- all measurements passed and the report contained no failure.

## Current decision

W4-A is closed on current source production. `TLP-PERF-001` is fixed-current. `TLP-CI-001` remains active-current for W4-B because specialized browser workflows outside CI and Manual Browser still own direct setup/build/browser blocks. W5, W6 and owner-governance decisions remain separate lanes.
