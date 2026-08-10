# Wave 13 — Rodosloviye interaction lifecycle, runtime coverage, CI provenance, build-hygiene triage

Date: 2026-08-10
Auditor: ChatGPT
Evidence class: `incoming/raw-current-evidence`

## Anchor / collision boundary

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Exact Product `main` immediately before publication: `6af19a6f219698112b74c4875f7fd2c03e7a4720`
- Previous audit anchor during this wave: `9156ccb714acbf1a1ba5eef4d0972abd4a7bf83f`
- `9156ccb... -> 6af19a6...` changes only Source Authority control-plane files:
  - `.github/workflows/source-authority-contract.yml`
  - `data/source-authority-trigger-inputs.json`
  - `scripts/source-authority-trigger-closure-contract-test.js`
  - `scripts/source-authority-trigger-universe-contract-test.js`
- Genealogy source, Runtime Interactive workflow, shared CSS/runtime, and the findings below were not touched by that main advance.
- Current open Product PR immediately before publication: `#1545 fix(hermenevtika): align canonical original-work title`; its allowlist is unrelated to genealogy/runtime coverage.
- `#1543` Source Authority closure merged during this audit and is now part of current main. It is not treated as a pending lane.
- AuditRepo base immediately before publication: `d9dedc4c3ae0b7a1d7cf97309c7bab24811b3f33` (`wave 12C` from a parallel agent).
- This report deliberately uses Wave 13 rather than colliding with the parallel Wave 12/12C evidence family.
- Product mutation: **none**
- MASTER mutation: **none**
- WORK_QUEUE mutation: **none**

Current repository rules were already reread in this audit session. This remains incoming evidence: it identifies current mechanisms and test-boundary gaps without starting a competing Product repair lane.

## Environment / witness boundary

The local execution container still cannot provide a fresh direct Playwright session against `gospod-bog.ru`. Therefore this wave does **not** claim a fresh production click, screenshot, touch gesture, accessibility-tree capture, or measured RUM/Web-Vitals result.

Instead it uses:

1. exact-current Product source at `6af19a6...`;
2. exact dependency-candidate GitHub Actions evidence from PR #1538, whose dependency tree was subsequently merged into `main`;
3. downloaded Runtime Interactive and Deploy Candidate artifacts;
4. current workflow source to distinguish true coverage from green-but-out-of-scope checks;
5. primary WAI/WCAG references only as interpretation support, not as a substitute for current Product evidence.

---

## Executive disposition

| Finding | Disposition |
|---|---|
| `/rodosloviye/` SplitView visually covers the app but is exposed as `role=complementary`, does not move/trap/return focus, does not inert background, and cannot be closed by Escape through the current tree key handler | `CONFIRMED-CURRENT / A11Y OVERLAY LIFECYCLE` |
| Genealogy search/focus/tour performs 500–600 ms camera pans and the route contains continuous animated edges / Messiah pulse without a reduced-motion branch | `CONFIRMED-CURRENT / ROUTE REDUCED-MOTION GAP` |
| Runtime Interactive workflow path filters and its internal runtime-impact regex omit `src/components/genealogy/**`, `src/pages/rodosloviye/**`, and `data/genealogy/**` | `CONFIRMED-CURRENT / CI TRIGGER COVERAGE GAP` |
| `scripts/interactive-audit.js` has no genealogy route/scenario and the exact Runtime Interactive artifact contains Home/search screenshots but no Rodosloviye interaction witness | `CONFIRMED-CURRENT / INTERACTION EVIDENCE GAP` |
| Public-surface breadth matrix can still be green because generic special/page coverage checks status/overflow/H1/canonical/IDs, not SplitView/tour/detail/focus/motion lifecycle | `CONFIRMED-CURRENT / BREADTH-vs-DEPTH BOUNDARY` |
| Genealogy React root uses `height:100dvh` inside an outer `85vh; min-height:650px` host; toolbar can wrap over the canvas at narrow widths | `LAYOUT/PREMIUM CANDIDATE`, browser geometry witness required |
| Deploy Candidate step named “Checkout exact head” actually checks the synthetic PR merge commit on pull_request because no explicit `ref` is supplied | `CONTROL-PLANE PROVENANCE/NAMING DIVERGENCE`, not stale evidence |
| Deploy artifact records that synthetic merge SHA in `productSha`, so the report is self-honest about what it actually tested | `NEGATIVE CONTROL / NO STALE-PROVENANCE CLAIM` |
| Astro 7.2 candidate build carries 7 hints, 25 Greek Shiki plaintext fallbacks, one Vite runtime-resolution warning, and npm `4 moderate + 4 high` advisory count | `BUILD-HYGIENE / SECURITY-INVENTORY SIGNALS`, not promoted as public-runtime defects |
| Earlier exact npm security inventory found the same 4+4 count entirely in transitive dev/build graph and production-only audit at 0 | `KNOWN TOOLCHAIN MAINTENANCE`, current composition needs a fresh omit-dev audit before any stronger claim |
| Production-like publication, Pagefind construction, Offline/PWA and human reachability remained green on the dependency candidate | `NEGATIVE CONTROL` |

---

# 1. `/rodosloviye/` SplitView behaves like a full-cover overlay without an overlay lifecycle

## Current source

`src/components/genealogy/SplitView.tsx` currently mounts a top-level element with:

```text
position: absolute
inset: 0
zIndex: 60
background: rgba(5,4,2,0.95)
backdropFilter: blur(20px)
overflow: hidden
```

It visually replaces/covers the genealogy application. Yet its accessibility semantics are:

```html
<div role="complementary" aria-label="Сравнение родословий Матфея и Луки">
```

The component has a close button, but it does not own:

- initial focus movement into the comparison;
- a focus boundary/trap while the cover is active;
- `inert`/equivalent background suppression;
- focus return to the opener after closing;
- Escape handling.

This is stronger than a generic “could use better ARIA” observation. The current UI creates an interaction layer that covers the app while keyboard focus can remain in or move into the covered background.

## Escape is specifically disabled while SplitView is open

`src/components/genealogy/GenealogyTree.tsx` opens the view with the toolbar button:

```text
onClick={() => setShowSplit(true)}
```

Its one global tree keyboard handler starts with:

```js
if (showSplit || !activeId) return;
```

The same handler contains the only local `Escape` branch later in the switch. Therefore while `showSplit === true`, the handler exits before Escape handling. `SplitView` has no separate keydown owner.

Deterministic keyboard sequence:

```text
focus / activate “⇆ Мф/Лк”
→ SplitView appears over the app
→ focus is not moved to its close control or content
→ press Escape
→ GenealogyTree handler returns because showSplit=true
→ SplitView remains open
```

If the user Tabs, background controls are still not made inert and there is no local focus loop.

WAI-ARIA APG modal-dialog guidance is a useful behavioral comparator: a modal interaction makes the underlying window inert, keeps focus within the dialog, supports Escape close, and returns focus appropriately. The Product need not literally choose `role=dialog` if the UX is redesigned as non-modal, but the current visual-full-cover/modal-like behavior needs one coherent interaction contract.

**Disposition:** `CONFIRMED-CURRENT / A11Y OVERLAY LIFECYCLE`.

### Minimum regression witness

At desktop and 390px mobile-equivalent geometry:

1. focus the “⇆ Мф/Лк” control;
2. activate it;
3. assert the active interaction owner receives focus;
4. Tab repeatedly and assert covered background controls are not reachable while the cover is active;
5. press Escape and assert the cover closes;
6. assert focus returns to “⇆ Мф/Лк” or another documented logical target;
7. repeat with pointer-open / keyboard-close and keyboard-open / pointer-close.

Do not fix only the ARIA role; the behavioral lifecycle is the root.

---

# 2. Genealogy route ignores reduced-motion across camera motion and continuous animation

Current genealogy motion is not one isolated cosmetic transition.

## Search and focus camera pans

Current `GenealogyTree.tsx` performs:

```js
setCenter(..., { zoom: 1.2, duration: 600 })
```

for search matches and:

```js
setCenter(..., { zoom: ..., duration: 500 })
```

inside `focusPerson()`.

The Golden Path tour invokes `focusPerson()` for each step, so tour navigation also inherits the 500 ms camera movement.

No `matchMedia('(prefers-reduced-motion: reduce)')`, shared reduced-motion helper, or zero-duration branch exists in the reviewed genealogy owner.

## Continuous route animation

The same route also contains persistent visual motion:

- focus-lineage edges are set `animated: true`;
- canonical Golden Path edges in `layout.ts` are created with `animated: isGoldenEdge`;
- `PersonNode.tsx` gives the Messiah halo `genealogy-pulse-gold 2.5s ease-in-out infinite`;
- the genealogy UI defines additional route animation/transition owners.

This means a reduced-motion user can encounter both interaction-triggered camera motion and continuous decorative motion.

The repository already uses reduced-motion handling elsewhere, so this is not a project-wide absence of an accessibility policy; it is a route-level implementation gap.

**Disposition:** `CONFIRMED-CURRENT / ROUTE REDUCED-MOTION GAP`.

### Recommended contract

A route-level browser test should run both:

- `reducedMotion: 'no-preference'` — ordinary animation remains allowed;
- `reducedMotion: 'reduce'` — camera durations become zero/instant, continuous pulse/edge motion is disabled, but all state changes remain visually understandable.

The test should inspect requested ReactFlow transition duration/state rather than waiting for subjective animation timing.

---

# 3. Runtime Interactive does not trigger for genealogy-only changes

Current `.github/workflows/interactive-audit.yml` has symmetrical PR/push path filters for Home/article-pilots/reader-platform/layouts/runtime/styles/CSS/JS and audit scripts.

It does **not** include:

```text
src/components/genealogy/**
src/pages/rodosloviye/**
data/genealogy/**
```

The job also contains a second internal runtime-impact classifier (`runtime_pattern`) with the same omission.

Therefore a PR changing only the genealogy application can avoid the Runtime Interactive workflow entirely at the workflow-trigger boundary. Even if manually/scheduled, its internal classifier can mark such a diff `unrelated-change` and skip the full runtime audit.

This is independent of the newly merged #1543 Source Authority closure. #1543 hardens the static-publication Source Authority workflow; it did not modify `interactive-audit.yml` or genealogy-specific browser depth.

**Disposition:** `CONFIRMED-CURRENT / CI TRIGGER COVERAGE GAP`.

The repair should be derived from a declared interactive-surface authority if available; avoid another ever-growing hand-written path list if the repository already has a canonical public-surface registry suitable for derivation.

---

# 4. Even when Runtime Interactive runs, it has no genealogy interaction scenario

Current `scripts/interactive-audit.js` has targeted URL/scenario families for search, theme, quizzes, glossary/tooltips, media and reader interactions. `/rodosloviye/` is not one of those targeted interaction URLs.

The exact Runtime Interactive artifact downloaded from the Astro 7.2 dependency candidate contains durable screenshots/evidence for Home and search states, including mobile-menu and search states, but no Rodosloviye SplitView/tour/detail-panel interaction screenshot or scenario result.

A separate public-surface browser matrix does sweep all registered public routes in Chromium/WebKit at 320/390/1440, which is valuable breadth. But its generic `page/special` contract checks route health such as status, overflow, H1/canonical and duplicate IDs; it does not perform the genealogy-specific sequence:

```text
search name → camera pan
select node → DetailPanel
keyboard lineage navigation
open SplitView
Tab lifecycle
Escape close
start/step/end tour
reduced-motion variants
```

So green broad route coverage and the current genealogy interaction defect can coexist without contradiction.

**Disposition:** `CONFIRMED-CURRENT / INTERACTION EVIDENCE GAP` plus `BREADTH-vs-DEPTH BOUNDARY`.

---

# 5. Narrow/mobile geometry candidates — deliberately not promoted without screenshots

The current Astro route mounts:

```html
<div id="genealogy-tree" style="height:85vh; min-height:650px; ...">
```

Inside it, the React root declares:

```text
height: 100dvh
```

At common mobile viewport heights the child can therefore be taller than its 85vh host. The app toolbar is absolute at the top, centered, with a 150px search field, multiple filter buttons, separators, Golden Path, SplitView and Tour controls; it allows `flexWrap:'wrap'` but reserves no equivalent content/canvas top inset.

That is enough to flag two geometry risks:

1. host/child height contract mismatch;
2. wrapped toolbar potentially occupying a large part of a narrow canvas.

However, without a fresh exact-current screenshot/box-model witness, this wave does **not** call either a confirmed visual regression.

**Disposition:** `LAYOUT/PREMIUM CANDIDATE — BROWSER WITNESS REQUIRED`.

High-value widths: 320, 360, 390, 430, 768, 1024, 1440; include portrait and short landscape heights.

---

# 6. Good negative control: Rodosloviye is not an all-or-nothing JS page

Current `RodosloviyeBody.astro` provides a meaningful static layer before the React island:

- breadcrumb;
- H1;
- explanatory summary;
- plain descriptive text;
- a link to the interactive tree and a link to maps/tools.

The React tree itself is `client:only="react"`.

So a React hydration/runtime failure does **not** erase the entire route from reading/search/access. This is materially better progressive enhancement than an interactive-only blank shell.

Do not describe this finding as “the page is inaccessible without JS.” The current defect class is interaction depth/lifecycle inside the enhanced app, not absence of static content.

---

# 7. Deploy Candidate provenance: the witness is merge-candidate, not PR-head

Current `.github/workflows/deploy-candidate-contract.yml` names the first step:

```text
Checkout exact head
```

but configures `actions/checkout` only with `fetch-depth: 0`; it does not pass an explicit `ref`.

On PR #1538, the exact job log shows GitHub fetched and checked out:

```text
refs/remotes/pull/1538/merge
HEAD = c11aadbebc72eadfd740a06c58e4589552c551ca
```

That commit is a synthetic merge of PR head `be4ba5bf...` into then-base `757946da...`.

The downloaded Deploy Candidate artifact's `current-gold/human-reachability.json` reports:

```json
"productSha": "c11aadbebc72eadfd740a06c58e4589552c551ca"
```

and `scripts/human-reachability-audit.js` explicitly derives that field from `process.env.GITHUB_SHA`.

Therefore the report is **not stale**; it honestly records the merge-candidate SHA that GitHub actually supplied. The divergence is semantic/naming/authority:

- if the intended boundary is PR-head exactness, checkout should pin `${{ github.event.pull_request.head.sha }}`;
- if the intended boundary is merge-result compatibility, the step/report should call it the PR merge candidate rather than “exact head”.

**Disposition:** `CONTROL-PLANE PROVENANCE/NAMING DIVERGENCE`, not a publication defect and not a stale-evidence claim.

This matters because other repository workflows explicitly distinguish head SHA, base SHA and immutable/executable history anchors.

---

# 8. Exact Astro 7.2 build hygiene — triaged, not inflated

The PR #1538 Deploy Candidate job ran on the synthetic merge candidate whose dependency diff was the Astro 7.2 / Dagre 3.1 update later merged into main. It succeeded, but its logs contain non-zero warning/hint debt.

## Astro check

Result over 569 files:

```text
0 errors
0 warnings
7 hints
```

Hints include:

- unused Hermenevtika mobile-bar `title` and `Props`;
- unused Karty holding-page `slug`;
- one Baptizm3D script treated as inline because it has an attribute;
- three Rodosloviye external script tags (`site-utils.js`, `site.js`, `sw-register.js`) treated as inline because they carry `src`; Astro suggests declaring `is:inline` explicitly.

These are maintainability/build-noise signals. They are not evidence that the scripts failed to load in production.

## Shiki

The build emits 25 occurrences of:

```text
[Shiki] The language "greek" doesn't exist, falling back to "plaintext".
```

This proves syntax highlighting for those fenced Greek blocks falls back to plaintext. It does **not** prove text loss or a reader-visible defect; plaintext can be the appropriate representation for ancient-language quotations. Treat as authoring/build hygiene unless a design contract explicitly promises syntax highlighting.

## Vite asset warning

Vite reports:

```text
../images/og-karty-1200x630.webp ... didn't resolve at build time,
it will remain unchanged to be resolved at runtime
```

Later publication/sitemap image audits pass. Without a broken final asset witness, do not promote this warning to “broken OG image.” It is a bundler-resolution signal worth removing or documenting.

**Disposition:** `BUILD-HYGIENE SIGNALS`, no current public defect established from the logs alone.

---

# 9. npm advisory count — known maintenance signal, not a public-runtime finding

The same current dependency candidate's `npm ci` reports:

```text
8 vulnerabilities (4 moderate, 4 high)
```

A dedicated diagnostic lane on 2026-08-08 previously decomposed the identical 4+4 count on then-current main:

- all 8 were transitive dev/build dependencies;
- `npm audit --omit=dev` returned **0** vulnerabilities;
- the diagnostic was closed unmerged as maintenance evidence rather than a runtime security defect.

That historical inventory cannot be blindly copied onto Astro 7.2 as current package identity truth: dependency upgrades can change advisory paths even when the aggregate count stays the same.

Therefore current disposition is intentionally conservative:

- the 4+4 current count is real;
- previous evidence strongly suggests a tooling-only class;
- a fresh `npm audit --omit=dev --json` on current main is required before claiming current production exposure or current zero exposure.

**Disposition:** `SECURITY INVENTORY SIGNAL / TOOLCHAIN MAINTENANCE`.

---

# 10. Strong negative controls from the same Deploy Candidate

The exact candidate evidence is not broadly unhealthy. It also proves:

- Astro build: 84 generated pages, success;
- publication-like legacy copy completed;
- Pagefind built 75 pages / 23667 words;
- service-worker readiness passed;
- deterministic Offline/PWA browser contract passed 10 scenarios;
- 49 series-reader pages had 904 unique fragment targets / 0 broken;
- dist publication audit passed;
- human reachability passed 56/56 reading routes;
- public URL contract extracted 75 public pages with no blocking issue;
- Pagefind source-page count matched the governed `data-pagefind-body` page count.

Those green contracts should stay green while genealogy-specific interaction depth is added. Do not turn a focused interactive audit finding into a claim that publication/PWA/reachability are generally broken.

---

# 11. Recommended next verification package

A bounded Product verification/repair package for this class should prove, in one route-specific browser matrix:

1. `/rodosloviye/` 320/390/768/1440 layouts plus a short landscape viewport;
2. search-name camera positioning and reduced-motion zero-duration variant;
3. node pointer click + keyboard navigation + DetailPanel close/focus return;
4. SplitView open/focus containment/Escape/return lifecycle;
5. Golden Path tour previous/next/end and reduced-motion behavior;
6. no horizontal overflow / toolbar collision / canvas obscuration;
7. no regression to the static no-JS fallback;
8. trigger mutation proving a genealogy-only Product diff runs the relevant browser contract;
9. durable screenshots at key states rather than only a generic route-health record.

Keep this as one genealogy interactive owner class. Do not create separate symptom issues for every button unless browser evidence proves independent roots.

## Final disposition

This wave finds a **new current interactive/a11y root on `/rodosloviye/` and a matching CI coverage hole**. It does not find a broad publication/PWA failure, does not claim the current 4+4 npm count is a public-runtime vulnerability, and does not mislabel PR merge-candidate artifacts as stale.

No Product source was modified and no competing repair PR was opened.