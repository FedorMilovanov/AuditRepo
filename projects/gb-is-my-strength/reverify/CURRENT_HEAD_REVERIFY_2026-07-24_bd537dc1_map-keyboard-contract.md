# CURRENT HEAD REVERIFY — `bd537dc1` — MapEngine keyboard contract

Date: 2026-07-24

## Boundary

- Current source `main`: `bd537dc107bd4b80c72075357f452690cbc39781`.
- Exact pre-merge PR head used by all cited checks: `64e36c82d6d70bb25a3e88793f7c61c2982ad1f8`.
- Last exact deployed source remains `8a5352671375fdb01b6c30273c25ec4283a13f69`.
- This record closes two source/CI defects. It does **not** claim that `bd537dc1` is already the exact GitHub Pages deployment.
- Gill PRs #156 and #174 were already present in the tested merge state and are file-disjoint from the four map-contract files.

## Closed canonical rows

### `MAP-P1-16`

Global MapEngine keyboard handling now leaves editable and system input alone:

- `input`, `textarea`, `select`, active `contenteditable` and `role=textbox` are excluded;
- IME composition is excluded;
- Alt/Ctrl/Meta chords are excluded;
- Space, digits, arrows, PageUp/PageDown, Home/End and help shortcuts remain map commands only outside those contexts;
- Escape remains the canonical overlay close command.

### `MAP-P1-17`

Numeric tab navigation no longer owns a second content-availability policy:

- visible `.me-tab[data-tab]` elements are read in actual DOM order;
- the selected tab is activated through its canonical `.click()` handler;
- direct keyboard calls to `renderTabContent` and `TAB_KEYS.filter` are permanently forbidden;
- the scientific `sci` tab is reachable at its rendered numeric position;
- `ishod` is the shared MapEngine live fixture;
- `avraam` is explicitly classified as a separate bespoke legacy engine and is not run through incompatible `.me-*` selectors.

## Exact source verification

Final PR head: `64e36c82d6d70bb25a3e88793f7c61c2982ad1f8`.

- Map Keyboard Contract `30049773607` — source contract and Chromium contract success.
- Shared Files Guard `30049773605` — success, including actionlint and all shared/runtime guards.
- Overlay Runtime Browser `30049773623` — Chromium, Firefox and WebKit success.
- Visual Parity Guard `30049773601` — production-like build, pixel diagnostics, owner-approved route policy and screenshot artifact upload success.
- Exact keyboard smoke artifact `8580550637`, digest `sha256:72ecffd9898edeb2af24e029e8574302c5126fbec6039777302e849ab3fc9d2d`.
- Smoke payload: `ishod` routes 4/4; signature toggle, story flyTo, scientific tab and keyboard contract all `ok`; map width 1366px; overflow 0px; console errors 0.

## Final source diff

Exactly four permanent files:

1. `.github/workflows/map-keyboard-contract.yml`;
2. `karty/_engine/map-engine.js`;
3. `scripts/map-browser-smoke.js`;
4. `scripts/map-keyboard-contract-test.js`.

No temporary workflow, staging block, reconciler or route implementation file remained in source PR #173.

## Matrix effect

- closed: 139 → 141;
- P1 open: 98 → 96;
- total open rows: 196 → 194;
- P0, P2, P3, refactoring and AuditRepo counts are unchanged;
- no canonical row was aliased or silently deleted;
- source authority advances to `bd537dc1` while production authority remains `8a535267`.

## Remaining execution order

Continue verified P0/P1 work from the matrix only after refreshing current source `main` and active PR file intersections. The 34 PR #167 editorial warnings and Reader R6 remain separate lanes; active source PR #161 and AuditRepo PR #27 must not be overwritten.
