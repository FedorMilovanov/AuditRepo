# Reverify — TLP systemic accessibility runtime closure — 2026-09-12

## Scope

Bounded closure verification for `TLP-A11Y-RUNTIME-001` only.

Independent discovery, audit-harness, analytics-consent, GA4 property authority and community-production roots remain outside this closure.

## Product repair

Product PR: `FedorMilovanov/TheLegendaryPoet#502` — `fix(a11y): unify runtime focus and overlay authority`.

Base: `8da2447bb5b46f10c92aef2f51e593157e8e096c`.

Exact certified head: `094bbbe1afdee4c773d6ac326d7167d4686ac926`.

CAS squash/resulting `main`: `71c3ddf76e0be2fe98e94be9dc09beabe3ade58a`.

Tested tree: `8774076863a259ef555cc84d1487a1e7a8354627`.

Resulting tree: `8774076863a259ef555cc84d1487a1e7a8354627`.

The tested and resulting trees are identical.

## Root cause and repair

The prior runtime split accessibility ownership across unrelated surfaces:

- reading-mode chrome was visually translated away without leaving the sequential-focus/accessibility tree;
- fully transparent seek ranges had no reliable visible focus owner;
- hash/citation restoration scrolled but did not transfer programmatic focus;
- archive removal could delete the focused control without deterministic next/fallback ownership;
- the shared overlay stack owned Escape/scroll behavior but not topmost accessibility isolation or exact restoration.

The repair establishes one bounded interaction authority:

- shared programmatic focus helper with temporary `tabindex=-1` for non-native targets;
- hidden chrome snapshots/restores prior `inert` and `aria-hidden` state and hands focus to main content before disappearing;
- citation/hash targets receive focus after settled route insertion;
- archive removal hands focus next → previous → stable status fallback;
- both audio seek controls expose a visible focus indicator whenever the transparent range owns focus;
- overlayRuntime recursively isolates sibling branches for the topmost overlay and restores exact prior accessibility state across nested transitions;
- fail-closed source guards make these invariants permanent.

During browser verification, the same contour exposed an additional real production layout defect in the mini-player: CSS horizontal centering used `left:50% + transform:translateX(-50%)` on the same `motion.aside` whose transform is owned by Framer Motion. Motion therefore replaced the centering transform and clipped the player outside the viewport. The final repair uses `left/right + max-width + margin-inline:auto`, with browser viewport-containment proof and a validator that forbids reintroducing transform-owned centering.

## Exact-head proof

At exact Product head `094bbbe1afdee4c773d6ac326d7167d4686ac926`:

- Project Contracts: success;
- CI/source verification: success;
- Site Route Integrity Audit: success;
- Brand Deep Reference and Motion Audit: success;
- Merge Certification: success;
- Manual Browser QA run `34710036455`: success;
- full Chromium/Android Chrome QA: success;
- fresh-process iPhone Safari QA: success;
- premium iPhone critical QA: success;
- premium home QA: success;
- WebKit home reveal QA: success;
- analytics-route regression QA: success.

The permanent browser outcomes prove:

1. reading-mode chrome becomes `inert + aria-hidden`, cannot retain focus while hidden, and restores prior state;
2. citation destinations receive deterministic programmatic focus;
3. archive removal preserves focus ownership after DOM mutation;
4. mini-player and immersive seek controls expose painted focus indication;
5. nested overlays isolate only the topmost accessibility environment;
6. closing the topmost nested overlay restores the underlying dialog while keeping page background isolated;
7. closing the final overlay restores the page background exactly;
8. the mini-player and immersive control remain inside mobile viewports in Chromium/Android and iPhone WebKit.

An independent detached production-build targeted run also passed the final nested-overlay/seek/viewport contour in Android Chromium and iPhone WebKit before merge.

## Resulting-main proof

Push workflows for resulting `main@71c3ddf76e0be2fe98e94be9dc09beabe3ade58a` all completed success:

- Project Contracts `34711011413`;
- Brand Deep Reference and Motion Audit `34711011412`;
- Brand Raster QA `34711011424`;
- CI `34711011432`;
- Site Route Integrity Audit `34711011425`;
- Manual Browser QA `34711011449`;
- Deploy to GitHub Pages `34711011477`;
- Notify IndexNow `34711094239`.

## Disposition

`TLP-A11Y-RUNTIME-001` is closed-by-systemic-runtime-repair and leaves the active engineering matrix.

Independent rows remain independent:

- `TLP-DISCOVERY-001`;
- `TLP-AUDIT-004`;
- `TLP-ANALYTICS-CONSENT-001`;
- `TLP-ANALYTICS-PROPERTY-001`;
- `TLP-COMM-ABUSE-001`.

Matrix arithmetic: P1 stays 1, P2 `5 → 4`, P3 stays 0, total active `6 → 5`.
