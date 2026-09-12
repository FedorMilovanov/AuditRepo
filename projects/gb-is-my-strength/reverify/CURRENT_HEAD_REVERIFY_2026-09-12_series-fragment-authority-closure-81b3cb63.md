# Current-head reverify — series fragment authority closure

## Disposition

`FIXED-CURRENT / closed-by-product-and-system-repair`

This receipt reconciles two tightly related roots discovered during current-head verification:

1. a real Product reader-navigation defect in Baptist series TOC fragment targets;
2. an audit-harness authority defect that made rendered-fragment validation depend on incidental local `dist/` state.

Neither is added to active MASTER arithmetic.

## Anchors

- Reverify date: 2026-09-12
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `81b3cb63013da25cdaa096730b17fbca61023da8`
- AuditRepo base: `d242ad4c087e2eaa405c026c5f5d6371f43548d5`
- System theme: `ST-AUDIT-HARNESS`
- Product #2020 head: `33d81dda61cc598973573a24903ee0cd2aacd351`
- Product #2020 merge: `7bf6da9fcf9a1be4eae44df8336379fb8f97cbdb`
- Product #2021 head: `f2795d0597f7fe8617c52907569a5779b1a14f03`
- Product #2021 merge: `81b3cb63013da25cdaa096730b17fbca61023da8`

## Root E — Baptist series TOC fragment-target drift

### Mechanism

The canonical Baptist series configuration had retained historical section slugs while the article bodies had evolved to a richer current heading structure.

Examples included:

- `#petersburg` while the live/current section is `#petersburg-april-1884`;
- `#novo-vasilievka` while the current heading is `#novo-vasilyevka`;
- multiple historical TOC concepts that no longer existed as distinct headings.

Because the shared series chrome renders the same canonical TOC authority into multiple reader surfaces, one config defect generated repeated broken same-page links.

### Pre-fix witnesses

Fresh production-like artifact audit found:

- 2 affected Baptist routes;
- 11 unique broken fragment targets;
- direct href targets existed in rendered TOC chrome but had no matching `id` / `name` in the same document.

The defect was not repaired by adding duplicate alias anchors. The current article heading structure was treated as reader authority.

### Repair

Product #2020 updates only `baptistFlatSeriesConfig.ts`:

- `/baptisty-rossii/noch-na-kure/` TOC now points to current headings such as `#molokan-context`, `#the-three-men`, `#kalweit-1869`, `#memory-and-myth`;
- `/baptisty-rossii/dva-sezda-1884/` TOC now points to current headings such as `#petersburg-april-1884`, `#baptism-as-boundary`, `#police-intervention`, `#novo-vasilyevka`, `#vladikavkaz-1885`;
- mobile section labels were aligned with the same canonical current structure.

### Post-fix witnesses

- source 1:1 mapping: 12/12 configured TOC targets exist in the current article headings;
- fresh `strangler:build:production-like`: EXIT=0, 103 pages;
- full rendered fragment audit: 64 series pages, 1,673 fragment links, 1,015 unique targets, **0 broken**;
- `series:facade:guard`: PASS;
- `engine:contracts`: PASS;
- `validate:all`: PASS, SEO 0 errors / 0 warnings;
- Shared Files, workflow policy and control-plane contracts: PASS.

Exact-head #2020 workflows all succeeded. Relevant run anchors:

- Runtime Interactive — `34710370175`
- Deploy Candidate — `34710370247`
- Metadata & IndexNow — `34710370256`
- Shared Files — `34710370271`
- Metadata SSOT — `34710370159`
- Native Source — `34710370165`
- Source Authority — `34710370234`
- Visual Parity pixel-diff — `34710370238`
- Route Registry — `34710370214`

## Root F — series façade source-vs-dist implicit mode switch

### Mechanism

Before #2021 the source regression guard contained effectively:

```js
if (fs.existsSync(DIST)) {
  auditSeriesFragments(...)
}
```

Therefore the exact same source guard had different semantics depending on unrelated local filesystem residue:

- clean Shared Files CI: no `dist/` → rendered-fragment proof silently skipped;
- developer checkout with stale/corrupt `dist/` → same source guard could fail;
- fresh built checkout → artifact validation happened only accidentally.

This is the same authority class as the earlier stale-dist visual-parity root, but on the shared series façade/fragment boundary.

### Adversarial pre-fix witnesses

A temporary fixture redirected only the `dist` filesystem view:

- simulated `dist` absent → façade guard EXIT=0;
- stale fixture containing `href="#missing-target"` without matching target → same façade guard EXIT=1;
- direct `series-reader-fragment-audit.js` on the same fixture → EXIT=1.

The exact Shared Files CI log confirmed that the source guard ran in clean checkout without rendered-fragment output.

### Repair

Product #2021:

- default façade guard is explicitly source-only;
- artifact mode requires `--require-dist`;
- `--dist` / `--report` outside strict mode are rejected;
- missing strict artifact fails closed;
- post-build `visual-parity-contract.js` explicitly invokes the façade guard in strict artifact mode;
- policy regression carries broken/fixed fragment fixtures so the authority split cannot silently regress.

### Post-fix witnesses

On current Product state after #2020:

- policy regression: PASS;
- default source-only guard: PASS with local `dist/` present;
- missing strict `dist`: expected FAIL;
- broken strict fixture: expected FAIL;
- repaired fixture: PASS;
- fresh production-like build: EXIT=0, 103 pages;
- strict post-build series witness:
  `series-reader-facade ... strict fragment audit passed: 64 page(s), 1015 unique target(s)`;
- outer witness:
  `series reader façade/fragments: strict dist audit passed`;
- full Visual Parity Contract: PASS;
- `validate:all`, Shared Files, workflow policy and control-plane: PASS.

Exact-head #2021 workflows all succeeded:

- Metadata & IndexNow — `34716941209`
- Shared Files — `34716941193`
- Metadata SSOT — `34716941202`
- Source Authority — `34716941224`
- Visual Parity pixel-diff — `34716941218`
- Deploy Candidate — `34716941195`

## Windows worktree / Genesis6 false-red

During combined verification, an additional worktree produced six apparent missing Genesis6 catalog images.

This was not a Product asset-loss defect.

Git authority shows:

- `images/articles/genesis6` is mode `120000`;
- symlink target is the canonical `public/images/articles/genesis6` tree;
- canonical assets exist under `public/`.

On a Windows additional worktree at Product #2010 exact head:

- the root symlink is materialized as a plain archive file;
- `WT_ROOT_CHILD=False`;
- `WT_PUBLIC_CHILD=True`;
- #2010's `static-public-asset.js` checks `public/<asset>` first and legacy root second;
- `articles-visual-parity-audit.js` EXIT=0 and resolves all six Genesis6 catalog images to `public/images/articles/genesis6/...`.

Because #2010 already owns this resolver and broader TEEN media work, no competing Product repair was created.

Its one historical red Runtime Interactive result was unrelated: LOT WebKit quiz feedback timed out at 5 seconds after the general interactive audit itself had passed. It did not implicate TEEN media or the static-asset resolver.

## Multi-witness closure assessment

The two closed roots are supported by:

- current source/config authority;
- fresh built artifact evidence;
- direct rendered-fragment enumeration;
- adversarial stale/missing artifact fixtures;
- exact-head CI;
- Product merge via expected-head CAS after live-base checks.

No unresolved symptom from these two roots is promoted to active MASTER.

## AuditRepo transaction boundary

This reconciliation should modify only:

- `verified/CLOSURE_LEDGER.md` by append-only entry;
- this reverify receipt.

It intentionally does not edit `MASTER_BUG_MATRIX.md` or `SYSTEM_THEMES.md`.
