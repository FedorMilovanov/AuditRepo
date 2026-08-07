# D-2 CSS layer validator closure — 2026-08-07

## Scope

- AuditRepo base: `c3d6f84e2bd50e1fdbe8759483711a28df132b37`.
- Product repair PR: `FedorMilovanov/gb-is-my-strength#1138`.
- Product pre-repair base used for the final combined-tree proof: `e440dd044cab9e9d1b11933f9f0be20a28c35080`.
- Product exact repair head after current-main refresh: `d876380b3da57158cd91f9c6b2755003d29f04a8`.
- Product squash merge: `f4cfb8653551ed8459aba1bfcf65f03e27fdfbb2`.
- Product mutation surface: `scripts/css-layer-validator.js` only.
- AuditRepo work unit closed: `D-2`.

## Re-verification corrected the original wording

The consolidation wave correctly found that `css-layer-validator.js` did not enforce the layer architecture it advertised and that its layered-coverage message said target `>=80%` while the implementation warned only below 50%.

The first repair attempt interpreted the old comment "All @layer blocks are in the declared order" as a requirement that every repeated named-layer block must appear physically in monotonic source order. Current `css/site.css` disproved that interpretation: it declares

```css
@layer reset,base,components,utilities;
```

before the named blocks and later legally re-opens `components` after a `utilities` block.

That is valid CSS Cascade Layers behavior. Once named-layer precedence is established by the order statement, reopening an existing named layer later appends rules to that layer without changing its precedence. Therefore the repair must protect precedence/ownership, not invent a non-standard physical-order restriction.

## Product repair

PR #1138 changed only `scripts/css-layer-validator.js` and now:

- parses named layer declarations/blocks with exact hyphenated and dotted layer names;
- fails closed when no named-layer order statement exists;
- requires the order statement to appear before the first named layer block;
- rejects duplicate names in the order statement;
- rejects every used named layer absent from the declaration;
- explicitly allows legal later reopening of already declared named layers;
- uses one `LAYERED_TARGET_PCT = 80` value for both the published target and warning threshold;
- runs internal executable contract assertions for declaration parsing, legal reopening, late declaration rejection, undeclared hyphenated names, duplicate declarations, missing declarations and the 80% invariant.

No runtime CSS, UI, package script or workflow was changed.

## Current Product proof

`package.json` invokes:

```text
node scripts/css-layer-validator.js css/site.css --ceiling=200
```

through `css:layer:validate`, which is included in `validate:static-publication`.

The current `site.css` source was inspected across the complete file before merge. Its named-layer order statement precedes the named blocks; the named layer set is `reset`, `base`, `components`, `utilities`; later `components` blocks are legal reopens; no new named-layer family appears later in the file.

The Product branch was refreshed onto current `main@e440dd044...` using an ordinary two-parent merge commit, not force-push. Final compare had `behind_by=0`, merge-base equal to current main, and a one-file Product diff.

## Exact merge boundary

Exact Product head `d876380b3da57158cd91f9c6b2755003d29f04a8` passed:

- `Metadata & IndexNow Readiness` — `success`;
- `Shared Files Guard` — `success`, including all 32 guard steps;
- PR comments — 0;
- review threads — 0;
- submitted reviews — 0;
- mergeable — `true`;
- draft removed only after the exact-head boundary was clean.

Important limitation preserved: Shared Files Guard does **not** itself invoke `css:layer:validate`. Functional confidence came from the validator's executable internal assertions plus complete current-source contract inspection; the CI result is the repository/system-policy boundary, not a claim that that workflow executed the validator CLI.

The PR was squash-merged with `expected_head_sha=d876380b...`, producing Product commit `f4cfb8653551ed8459aba1bfcf65f03e27fdfbb2`.

## Disposition

`D-2` is `closed-by-fix` and must leave the active MASTER in this same closure wave.

Correct closure wording:

> The CSS layer validator now enforces the real named-layer precedence/integrity contract and truthful 80% migration warning semantics. Product CSS was not physically reordered, because legal named-layer reopening is not a defect.

MASTER delta:

- active work units: `27 -> 26`;
- direct defects: `14` unchanged;
- verified necessary improvements: `7 -> 6`;
- system lanes: `2` unchanged;
- owner decisions: `4` unchanged.

## Next repair boundary

The next prepared non-colliding Product candidate is `NG-DEAD-01`: the 15 zero-consumer `NagornayaChastN{HeaderHero,ArticleBody,PostContent}` extraction artifacts. Before deletion, re-read current Product main/open PR ownership and let the existing Nagornaya source/registry guards prove whether any hidden contract still depends on those files. Do not weaken a guard merely to make deletion pass.
