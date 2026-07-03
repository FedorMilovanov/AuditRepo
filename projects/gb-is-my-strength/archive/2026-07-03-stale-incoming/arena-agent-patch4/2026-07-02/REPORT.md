# Agent Audit Report — Patch 4 follow-up / Gill TOC controls

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Audit repo: `FedorMilovanov/AuditRepo`
- Agent: Arena Agent
- Date: 2026-07-02
- Source HEAD at start: `0f89bb98` (`chore: auto-update meta, cache-bust [skip ci]`)
- Last non-skip source commit investigated: `b9f4cb59` (`fix(quality): woff2 font, empty CSS cleanup, audit doc update, PageHead TODOs`)
- Local repair branch: `lane/patch4-gill-toc-actions-2026-07-02`
- Local repair commit: `2f65c2e7` (`fix(gill): wire TOC overlay save and unclip PlayEmber [LANE lane/patch4-gill-toc-actions-2026-07-02]`)
- Push status: not pushed from sandbox — HTTPS remote requested credentials (`fatal: could not read Username for 'https://github.com'`). Patch artifact included.
- Environment: Arena sandbox, Node `v22.12.0`, npm ci, Playwright Chromium `v1228` + system deps.
- Build mode: production-like dist + browser smoke.

---

## 1. CI / history findings

### CI-HIST-01 — visible red CI was the `b9f4cb59` Visual Parity run, not current deploy artifact
- GitHub Actions API evidence:
  - `b9f4cb59`: `Visual Parity Guard — pixel-diff` → **failure** (`28538296322`), `Deploy to GitHub Pages` → cancelled.
  - `0f89bb98`: `Deploy to GitHub Pages` → **success** (`28538338704`), but `[skip ci]` meant the visual parity workflow was not rerun for the cache-bust-only commit.
- Local current-main reproduction after build: `npm run visual:parity:guard` passes 11 routes × 2 viewports.
- Interpretation: CI looked red because the last visual-parity workflow remained failed on the previous non-skip commit; current source/dest parity is green locally.

### CI-HIST-02 — source `sw.js` and baseline were out of sync before this patch
- At source HEAD `0f89bb98`, `sw.js` declared `gb-v179-sheet-lock-sri-5routes-20260701`, while `migration/sw-cache-version-baseline.json` already claimed `gb-v181-woff2-css-cleanup-20260701`.
- The existing audit treats this as advisory unless `--require-cache-bump` is used, but it is a stale cache/accounting weakness for deploy analysis.
- Patch `2f65c2e7` bumps and aligns both to `gb-v182-gill-toc-actions-20260702`.

---

## 2. New / confirmed runtime findings

### GILL-TOC-01 — Part TOC overlay Save button was visually present but unwired
- Severity: P2
- Routes: all five Gill v16 routes.
- Source file: `src/components/article-pilots/gill-series/GillPartTocOverlay.astro` renders `<button class="toc-action-btn gb-save" data-fc-action="save">` outside `.mobile-bottom-bar`.
- Root cause: `initCluster(root)` delegated `[data-fc-action]` only inside `[data-fc-root]` / `[data-fc-controls]`; Gill overlays are siblings of the bar, therefore outside every cluster root.
- Reproduction before patch: open `#partTocOverlay`, click overlay `.gb-save`; `aria-pressed` remains `false`, no `gb-favorites` localStorage entry.
- Fix in local commit: factor `dispatchClusterAction(action, btn)` and call it from a document-level fallback only for `[data-fc-action]` outside normal cluster roots.
- Regression guard added: `scripts/gill-v16-mobile-play-smoke.js` now asserts Part TOC overlay save toggles on every Gill route.

### GILL-TOC-02 — Gill overlay open state used implicit ARIA visibility
- Severity: P3
- Source file: `js/floating-cluster-controller.js`
- Before: `openOverlay()` removed `aria-hidden`, relying on implicit “not hidden”.
- After: `openOverlay()` sets `aria-hidden="false"`, matching the GBS2 sheet convention and making state explicit/testable.

### GILL-PLAY-01 — mobile PlayEmber speed pill could be clipped by bar overflow
- Severity: P2
- Source file: `css/floating-cluster.css`
- Root cause: the late Gill mobile reference-lock block forced `.mobile-bottom-bar { overflow: hidden !important; }` after earlier polish allowed visible overflow.
- Impact: PlayEmber speed pill is anchored inside the fixed mobile bar and blooms upward; hidden overflow can clip the pill at the rounded bar edge.
- Fix: change that late Gill bar rule to `overflow: visible !important` with a comment explaining the PlayEmber dependency.
- Verification: `gill:mobile-layout:audit` still reports no horizontal overflow and no duplicate fallback controls.

---

## 3. Local gates run

All commands below were run after the local source repair commit content was in the worktree:

```text
git diff --check                                                    PASS
npm run strangler:build:production-like                             PASS
npm run gill:mobile-play:smoke                                      PASS
npm run gill:mobile-layout:audit                                    PASS
npm run pagefind:build:dist                                         PASS
npm run sw:dist:audit:pagefind                                      PASS
npm run visual:parity:guard                                         PASS
npm run validate:static-publication:light                           PASS
npm run guard:shared-files                                          PASS after commit with [LANE ...]
```

Notes:
- `sw:dist:audit:pagefind` fails if run before `pagefind:build:dist`; it passed after the expected CI sequence generated `dist/pagefind/pagefind.js`.
- `guard:shared-files` correctly failed on `main` and before commit-message tagging; it passed on `lane/patch4-gill-toc-actions-2026-07-02` after commit `2f65c2e7` with the required `[LANE ...]` tag.

---

## 4. Patch artifact

- `artifacts/gb-is-my-strength-2f65c2e7.patch` — source repo patch generated via `git format-patch -1 --stdout 2f65c2e7`.

---

## 5. Recommended next action

Because the sandbox has no GitHub credentials, apply/push one of these from an authenticated environment:

```bash
cd gb-is-my-strength
git checkout -b lane/patch4-gill-toc-actions-2026-07-02 origin/main
git am /path/to/gb-is-my-strength-2f65c2e7.patch
git push -u origin lane/patch4-gill-toc-actions-2026-07-02
```

Then open/merge PR if CI passes. The branch touches `css/**` and `js/**`, so the Visual Parity workflow should rerun without `[skip ci]` and clear the stale red `b9f4cb59` status if GitHub branch protection tracks latest commit checks.
