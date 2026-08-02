# CURRENT HEAD REVERIFY — expanded browser/runtime wave

- Date: 2026-08-03
- Canonical source/main anchor: `1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5`
- Active Atlas comparison head: `6cc3465fcb047c04d8f3b632ccee41f6f5c3c10e` (PR #759, unmerged)
- Workflow: `Audit Browser Runtime Wave`
- Exact run: `30769737659`
- Production claim: **none**
- Last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`.

## Evidence bundles

### Canonical source/main target

- Job: `witness / source-main-1944eb1b` — success
- Artifact: `8840166904`
- Digest: `sha256:eef8df91e454721ba6afdc29138e90420a1e0bfb2ee28323046348310214246a`
- Build: production-like source build, local static server, headless Chromium
- No failed network requests; only non-blocking preload warnings were recorded.

### Active Atlas PR comparison

- Job: `witness / atlas-pr-head` — success
- Artifact: `8840164723`
- Digest: `sha256:a6850cec4ab95c49b229440724f8070efec65dacdcaefff7fe6410340413d410`
- This comparison is evidence-only. It does not replace the source/main disposition anchor and makes no production claim.

## Finding dispositions

### `A11Y-P1-01` — CONFIRMED CURRENT

The canonical source/main witness sampled heading state every 25 ms while observing DOM mutations. During the visible intro it recorded 23 samples and a maximum of two simultaneous page headings:

1. `h1.sr-only` — the static descriptive page heading;
2. `h1.me-intro__title` — the visual intro heading.

The same two-heading state reproduced on the active Atlas PR head. The finding remains open.

### `AVRAAM-P1-04` — PARTIAL STALE, NARROWED RESIDUAL

The historical claim is overbroad:

- all rendered tabs are native `<button>` elements, not `<div>`;
- Enter activates the focused tab;
- numeric shortcut `2` activates the second visible tab.

The current residual is confirmed:

- `.me-tabs` has no `role="tablist"`;
- tab buttons have no `role="tab"`, `aria-selected` or roving `tabindex` contract;
- Space does not activate the focused tab;
- ArrowRight does not move focus between tabs and is consumed by global map navigation.

The row remains open with this narrower wording. Work belongs in the existing Atlas ownership lane rather than a competing branch.

### `QUAL-P1-04` — STALE ON CURRENT SOURCE/MAIN

The canonical witness selected the only route record with one photo and distinct full/thumbnail URLs: Цоар (`story=lot`, `place=zoar`). Runtime evidence showed:

- visible trigger `src`: Wikimedia URL with `width=320`;
- canonical `data-src`: the same photo with `width=1280`;
- one open photo modal;
- modal `src` immediately after click: exact `width=1280` URL;
- modal `src` after 700 ms: unchanged exact `width=1280` URL;
- no reset to the thumbnail URL.

Therefore the historical repeat-delegation regression is not reproducible at exact source/main `1944eb1b`; the canonical row is closed. The Atlas PR-head comparison did not expose a stable clickable fixture after its own in-branch runtime rerender, so it is not used to reopen or weaken the exact source/main disposition.

## Canonical arithmetic

Before:

- 358 total
- 186 closed
- 172 open
- P1: 84

After:

- 358 total
- 187 closed
- 171 open
- P1: 83
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

Only `QUAL-P1-04` moved from open P1 to closed. `A11Y-P1-01` remains confirmed open; `AVRAAM-P1-04` remains open with narrower current wording.
