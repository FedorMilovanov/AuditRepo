# Reader production witness ref disposition — 2026-07-28

## Scope

Repository: `FedorMilovanov/gb-is-my-strength`  
Ref: `verify/reader-production-postmerge-2026-07-24`  
Current ref head inspected: `0f7cefbb20abb17c65872e53c00c733c480f2a97`  
Current site main inspected: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`

This audit resolves a reused temporary production-witness branch by its current ancestry and complete PR history, not by comparing it only with one old PR head.

## Complete PR use of the branch name

GitHub history shows exactly two pull requests using this head branch:

### PR #234

- title: `test(reader): verify merged reader contract on production`;
- exact head: `69b8cf0df189434f6e80bdd6a96c8f2336013ea6`;
- temporary post-merge production proof for the neutral print contract;
- evidence-only and never product merge authority.

### PR #253

- title: `test(reader): verify merged print contract on production`;
- exact head: `2a6881d0be4ce87bdcbc75b3edeea56eb4021ab1`;
- later temporary proof attempt for the older print contract;
- explicitly superseded by the universal semantic pagination work;
- evidence-only and never product merge authority.

Both exact historical PR heads are already preserved as parents of:

- `archive/forensic-print-pdf-histories-20260728`;
- anchor commit `0b1e75008c61ab97f4ae74dcfd4303c88c74343a`.

No historical witness needs to remain encoded in the mutable branch name.

## Current ref state

The current branch no longer points at PR #234 or PR #253. It resolves to:

- `0f7cefbb20abb17c65872e53c00c733c480f2a97`;
- `docs(governance): preserve agent work with durable checkpoints (#484)`.

A direct ancestry comparison against current site `main` proves:

- merge base: `0f7cefbb20abb17c65872e53c00c733c480f2a97`;
- branch-only commits: **0**;
- main-only commits: **3**;
- relationship: current branch head is a direct ancestor of current main.

The three later commits are governance-only successors #486, #487 and #491. The current witness ref contains no unique product, diagnostic, evidence or publication delta.

## Disposition

`CURRENT_REF_ANCESTOR_OF_MAIN / HISTORICAL_PR_HEADS_FORENSICALLY_PRESERVED / FAST_FORWARD_ALLOWED`

Authorized operation after this disposition is merged and the ref/main pair is rechecked:

- fast-forward `verify/reader-production-postmerge-2026-07-24` to the then-current site `main`;
- use a non-force update because the current ref is an ancestor;
- create no product commit;
- delete no branch;
- do not infer any new production-success claim from the ref movement.

## Explicit non-claims

This disposition does not claim:

- that PR #234 or #253 should have been merged;
- that their live-production results remain current;
- that moving the mutable ref alters or improves production;
- that old workflow files should be restored.

It only closes mutable branch drift after immutable preservation of both historical witness heads.

## Publication boundary

No product, route, article, CSS, runtime, publication state or deploy workflow changes are authorized.