# TERMINAL RODOSLOVIYE TWO-ROOT REPAIR — MERGED PRODUCT PROOF

Date: 2026-08-10

Scope is intentionally limited to the two existing MASTER roots:

- `V05-ROD-VIEWPORT`
- `V05-ROD-SPLIT-A11Y`

No unrelated site defect was added to this repair unit.

## Starting authority

Product: `FedorMilovanov/gb-is-my-strength`

- starting `main`: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`
- starting tree: `4c2e1dc0e92bb02d7a3aa9258a2fc15b4ee35b5c`
- canonical failing evidence: `verification/2026-08-10-wave-05-rodosloviye-current-browser/REPORT.md`
- fresh Git proof supplied for the starting release: HEAD and remote main at the expected SHA, main-only remote heads, clean worktree, `git diff --check` PASS and `git fsck --full` PASS.

Immediately before merge, Product `main` was re-read and remained identical to the starting SHA; there was no concurrent-main refresh to perform for this PR.

## Failing reproduction before edit

### `V05-ROD-VIEWPORT`

The exact-release witness reproduced the failure on narrow mobile and desktop:

- historical settled semantic wrapper count observed by that witness: 143;
- initial useful visible person-card count: 0;
- explicit canonical ReactFlow Fit View useful visible person-card count: 0;
- searching `Адам` recovered visible nodes, proving the graph data was present and centerable rather than absent.

The canonical Product dataset itself contains 156 person records. The historical 143 browser count was therefore not promoted into a new magic dataset constant; the permanent regression derives the expected mounted person count from `data/genealogy/genealogy.json#persons.length`.

### `V05-ROD-SPLIT-A11Y`

The full-canvas `⇆ Мф/Лк` comparison reproduced the complete keyboard failure:

- focus stayed on the covered opener;
- Tab advanced into underlying toolbar controls including `🎬 Тур`;
- covered controls remained keyboard reachable;
- Escape did not dismiss;
- explicit close left focus on `BODY` instead of restoring the exact opener.

## Root mechanisms

### Viewport root

`src/components/genealogy/layout.ts` mixed two incompatible vertical coordinate domains in one ReactFlow world:

- chronology-aware persons received AM-derived Y positions projected across a fixed `4200` span;
- persons without AM chronology retained raw Dagre Y positions.

That produced one sparse world envelope whose useful content could not be fitted inside the existing zoom bounds.

### Split View root

`src/components/genealogy/SplitView.tsx` implemented a visually covering absolute surface as `role="complementary"` without modal focus ownership, underlay inertness, Escape lifecycle or opener restoration. `GenealogyTree.tsx` also bypassed its parent Escape path while Split View was open, so the covering surface itself needed to own a truthful dismissal contract.

## Why previous Runtime Interactive coverage missed these roots

The existing generic Runtime Interactive workflow did not have a route-specific genealogy browser contract and did not include genealogy source/page paths in the authoritative trigger/scope pattern. Therefore broad runtime coverage could remain green without asserting `/rodosloviye/` useful viewport content or the Split View keyboard lifecycle.

## Exact repair

Single branch / single PR delivery:

- branch: `agent/rodosloviye-two-root-repair-20260810`
- PR: `#1548` — `fix(rodosloviye): close viewport and split-view accessibility roots`
- proven PR head: `ef372845f8816ad8ad35186051ced2ee4973608a`
- merge method: squash
- merged Product commit: `533193eeb01dd4b68626f6f58496fe1663b4ed78`

### Coherent genealogy world contract

`layout.ts` now establishes one explicit bounded vertical world:

- Dagre owns topology for every person;
- chronology contributes historical ordering when `birthAM` exists;
- raw Dagre Y and raw AM values are never mixed as pixels;
- each source is normalized to `0..1` and projected into the same `GENEALOGY_WORLD_HEIGHT`;
- the same returned world height feeds the chronology axis.

Semantic zoom remains presentation-only so the canonical person dataset stays mounted; canonical Fit View operates on a meaningful filter-safe cohort rather than relying on a hardcoded center or a minimum-zoom escape hatch. Search remains an explicit user-requested center operation and still centers Adam correctly.

### Truthful full-canvas comparison semantics

`SplitView.tsx` now uses native modal `<dialog>` behavior:

- `showModal()` establishes modal/inert-underlay semantics;
- focus enters the comparison on open;
- Tab boundary handling remains bounded to the modal rather than creating a replacement navigation model;
- Escape uses the dialog cancel/close lifecycle;
- explicit × uses the same close lifecycle;
- the exact focused opener is captured and restored after native close completes.

## Exact changed Product files

Only these five Product files are in PR #1548 / the merged repair:

1. `.github/workflows/interactive-audit.yml`
2. `scripts/genealogy-browser-contract.mjs`
3. `src/components/genealogy/GenealogyTree.tsx`
4. `src/components/genealogy/SplitView.tsx`
5. `src/components/genealogy/layout.ts`

Merged-main scoped blob proof:

| File | Proven PR-head / merged-main blob |
|---|---|
| `.github/workflows/interactive-audit.yml` | `ed2c6ce2230a514900eaa0777d1ada853f43de7f` |
| `scripts/genealogy-browser-contract.mjs` | `72bbfc1fb9823cdb47452ccab383d4647d0d3d68` |
| `src/components/genealogy/GenealogyTree.tsx` | `6f8c8c1a57bba99d222d804595d36231ae85600b` |
| `src/components/genealogy/SplitView.tsx` | `2ba0e74fd54d35ba933416579ae90391dd137b61` |
| `src/components/genealogy/layout.ts` | `7d2c1115ee40328ba79e9c9a16a306d7e8ebb588` |

Constructing the exact five-blob repair over the starting tree yields tree `83213a6d7abbb0134e7a248738022620dcba89de`; the squash merge is on the unchanged starting main and merged-main fetches confirm all five blobs byte-identical to the exact browser-proven PR head.

## Permanent CI coverage

The existing authoritative `.github/workflows/interactive-audit.yml` was extended rather than creating a parallel workflow.

The workflow now:

- triggers on genealogy browser-contract, data, page and component paths for PR and `main` push events;
- includes those paths in the runtime-impacting-source scope decision;
- executes `scripts/genealogy-browser-contract.mjs` in the existing Chromium/WebKit browser job;
- uploads genealogy evidence with the existing browser artifact bundle.

The permanent genealogy contract asserts materially stronger behavior than HTTP/title/overflow:

- mounted person count equals canonical `genealogy.json#persons.length`;
- settled initial useful visible person-card count is non-zero;
- canonical Fit View useful visible person-card count is non-zero;
- useful visible person-card area is non-zero;
- Adam search produces a visible Adam and semantic zoom reaches detailed presentation;
- Split View focus enters the comparison;
- repeated Tabs remain inside and do not reach the covered Tour control;
- Escape closes and restores the opener;
- reopen + explicit × closes and restores the opener;
- no uncaught page errors.

## Exact-head validation

Exact PR head `ef372845f8816ad8ad35186051ced2ee4973608a` completed green GitHub Actions coverage including:

- Node Toolchain Contract — PASS; Node `22.23.1`, npm `10.9.8`, workflow policy and actionlint PASS;
- Shared Files Guard / control-plane contracts — PASS;
- Deploy Candidate Contract — PASS;
- Visual Parity Guard — PASS;
- Runtime Interactive Audit — PASS;
- production-like build — PASS;
- `astro:check` is part of `astro:build`, which is part of the production-like build chain, therefore executed in those passing builds;
- Pagefind build — PASS;
- route-specific genealogy Chromium + WebKit contract — PASS;
- existing homepage and A13 browser contracts — PASS.

The Node/toolchain validation also proved validation left no generated worktree diff (`git diff --exit-code` PASS). The starting fresh-main proof recorded `git diff --check` PASS and `git fsck --full` PASS.

## Browser measurements — exact proven PR head

Artifact: `home-browser-contract-31406726161`, workflow run `31406726161`, exact head `ef372845f8816ad8ad35186051ced2ee4973608a`.

Canonical expected mounted persons: 156, derived from `data/genealogy/genealogy.json#persons.length`.

| Browser | Viewport | Initial mounted | Initial visible | Initial useful area | Fit visible | Fit useful area | Adam-search visible | Page errors |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Chromium | 390×844 | 156 | 6 | 9913.09 | 6 | 9913.10 | 4 | 0 |
| Chromium | 1440×1000 | 156 | 33 | 89566.22 | 33 | 89566.24 | 10 | 0 |
| WebKit | 390×844 | 156 | 6 | 10712.52 | 6 | 10712.52 | 4 | 0 |
| WebKit | 1440×1000 | 156 | 33 | 89996.78 | 33 | 89996.77 | 10 | 0 |

Adam was present in the visible search set in all four cases. Because the same contract step passed in all four cases, the complete Split View focus/Tab/Escape/explicit-close/opener-restore lifecycle also passed on Chromium and WebKit at both required viewport classes.

## Post-merge proof

Product PR #1548 merged successfully as `533193eeb01dd4b68626f6f58496fe1663b4ed78`.

Fresh post-merge authority checks:

- `main` resolves exactly to `533193eeb01dd4b68626f6f58496fe1663b4ed78` at this verification point;
- all five merged scoped blobs exactly equal the exact PR head blobs that produced the passing Chromium/WebKit browser artifact;
- therefore the merged genealogy runtime/browser surface is byte-identical to the exact tested surface, with no post-merge code drift in either root;
- no open `ci-failure` issue exists at the post-merge check.

This byte-for-byte merged-main equivalence is the post-merge witness tying the browser proof to current `main`; the browser-proven code is exactly the merged code.

## Final Product authority for these two roots

- final checked Product `main`: `533193eeb01dd4b68626f6f58496fe1663b4ed78`
- final exact repair tree: `83213a6d7abbb0134e7a248738022620dcba89de`
- `V05-ROD-VIEWPORT`: CLOSED on merged current main
- `V05-ROD-SPLIT-A11Y`: CLOSED on merged current main
- root residual: **NONE**

## Delivery-level residual outside these two roots

The requested post-merge control-plane condition `Product open PR = 0` is not currently true because unrelated concurrent Product work opened after this repair began. At the final census there are two unrelated open PRs:

- #1551 — Hard Texts start-book repair
- #1552 — Konfessii reduced-motion repair

They are outside this delivery unit's explicit ownership and were not modified, closed or merged here. `FINAL-ZERO-AUDIT` therefore remains blocked on other current Product work and is not zeroed by this report.
