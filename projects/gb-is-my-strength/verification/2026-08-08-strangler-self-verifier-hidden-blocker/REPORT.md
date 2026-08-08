# Strangler Wave A — hidden self-verifier blocker despite green CI

Date: 2026-08-08
Product repository: `FedorMilovanov/gb-is-my-strength`
Product main: `11999f6d674e64e6afef590adeb71aeaaf303b3a`
PR: `#1222`
Exact candidate head: `22983986fadc50f22fb831a2b956915576448aad`

## What is green

Current compare is clean and narrow:

- `behind_by=0` against current main;
- exactly five intended files;
- mergeable=true;
- no submitted reviews;
- no inline review threads.

All seven fresh exact-head workflows are SUCCESS:

- Shared Files Guard;
- Deploy Candidate Contract;
- Metadata & IndexNow Readiness;
- Search Modal Contract;
- Source Authority Contract;
- Visual Parity Guard;
- Route Registry Validators.

This proves the current pre-move tree is internally consistent under the registered gates. It does **not** prove the retirement dependency ledger is complete.

## Hidden dependency still present

Current `scripts/legacy-shadow-retirement-readiness.mjs` directly reads governed legacy-reference bytes from current physical repository locations in multiple paths:

- `ledgerCandidate()` → `fs.readFileSync(path.join(root, item.path))`;
- `effectiveInventory()` → `path.join(root, entry.legacyPath)` and `fs.readFileSync(absolute)`;
- native-shadow integrity → `fs.readFileSync(path.join(root, item.path))`.

The script does not use the new `migration/legacy-reference-path.js` storage resolver for those bytes.

Therefore after the eventual atomic move to `migration/legacy-reference/<logicalPath>`, this verifier cannot re-read the same governed bytes through the new storage abstraction without its own migration.

## Ledger currently hides that fact

At exact `#1222@22983986...`, `data/legacy-reference-ledger/manifest.json` classifies the verifier itself as:

- path: `scripts/legacy-shadow-retirement-readiness.mjs`;
- access: `fixture-or-contract`;
- classification: `production-required`;
- `quarantineImpact: none-fixture-policy-or-comment-only`.

`dependencyClass()` maps that quarantine impact to `nonblocking`.

The same readiness script then computes:

- `blockerTotal` from registered blocking classes;
- `deletionReady = blockerTotal === 0`;
- `physicalMoveAuthorized = deletionReady`.

So the verifier's own active physical-storage dependency contributes **zero** blockers to the report that can eventually authorize the physical move.

This makes the reported `21 blockers` incomplete as an inventory of everything that must be storage-aware before quarantine.

## Guard-health gap

A source scan of the current readiness script finds no quarantine-only self-test for its own ledger/reference byte reads. Its `quarantine` mentions are limited to dependency classification/future transaction text and synthetic report data, not a fixture that moves an immutable reference to `migration/legacy-reference/**` and proves the readiness verifier still resolves/integrity-checks it.

Thus the wrong nonblocking classification is not protected by an adversarial post-storage-move contract.

## Correct bounded repair options

### Option A — migrate the verifier now

Make `legacy-shadow-retirement-readiness.mjs` consume the explicit reference storage resolver for governed bytes and add adversarial fixtures for:

- quarantine-only storage;
- active + quarantine ambiguity fail-closed;
- absent storage fail-closed;
- exact-byte/hash preservation after storage relocation.

This widens Wave A beyond the current five-file scope and would require a new exact-head scope/CI review.

### Option B — keep Wave A narrow, but make ledger arithmetic truthful

Preferable if the five-file transaction must stay bounded:

- reclassify `legacy-shadow-retirement-readiness.mjs` as a real `must-update-before-move` dependency with truthful access/classification/evidence;
- update blocker arithmetic and PR body so this dependency remains explicitly visible for the next wave;
- do not claim the current 21-count is a complete pre-move blocker inventory;
- migrate the verifier in a later bounded storage-reader wave before any atomic move can become authorized.

This preserves Wave A's current semantic repair while preventing a false future `physicalMoveAuthorized` boundary.

## Audit disposition

`#1222` is **not merge-authorized yet**, despite 7/7 exact-head green, because its central retirement-readiness evidence still contains a hidden self-dependency classified as nonblocking.

The Product PR conversation was updated with this exact-head finding in comment `5225397646`.

Do not weaken the readiness script or scanner to obtain green. Fix the ledger/storage truth, rerun the exact-head suite, and require the blocker count/PR record to describe the corrected boundary.
