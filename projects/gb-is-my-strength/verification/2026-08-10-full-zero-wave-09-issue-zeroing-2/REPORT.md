# Full Zero Wave 09 — Open Issue Zeroing / No Code

Date: 2026-08-10  
Product: `FedorMilovanov/gb-is-my-strength`  
Mode: verifier only; **no Product source changes and no new issues**

## Live preflight

Fresh Product authority: `main@f0ec90563ec5ae7eec439f78d0729694267af6df` (merged #1456).

Open Product PR census at preflight contained only #1460, a draft SYSTEM diagnostic for historical image bloat explicitly marked `Do not merge`. It is unrelated to this issue-zeroing lane.

`#1295/#1403` were not touched.

## Result table

| issue | requested check | current classification | action |
|---|---|---|---|
| #1288 | Search title guard vs PageHead authority | **COMPLETED / stale-open** | evidence comment added; closed `completed` |
| #1239 | CRC32 docs drift | **CURRENT BUG — governance/docs drift** | evidence comment added; left open |
| #1242 | test-health hardening | **FUTURE QUALITY** | left open; not a stabilization blocker |
| #1243 | performance measurement | **MEASUREMENT** | left open; not a stabilization blocker |
| #298 | owner-approved product goldens | **FUTURE QUALITY** | left open; not a current bug |
| #1360 | Baptist media completion | **CONTENT PROJECT** | left open; not a stabilization blocker |
| #54 | Hermenevtika old umbrella | **NARROWED LEGACY UMBRELLA with one current route-local residual** | evidence/reclassification comment added; left open |

## #1288 — Search title guard vs PageHead authority

### Current implementation

Current `scripts/check-data-consistency.js` already contains the required architectural distinction. It loads the route profile, computes whether legacy HTML is authoritative, and applies the old H1/Search-title drift heuristic only for authoritative legacy routes. Strict-native/reference-only routes do not use stale legacy H1 as discovery-title truth; their PageHead/Search projection remains authoritative.

This is exactly the bounded repair requested by #1288.

### Canonical repair receipt

Merged PR #1287 changed only `scripts/check-data-consistency.js` for this root. Its PR description identifies the same false-red: strict-native articles may intentionally have a short editorial H1 and a richer PageHead/Search discovery title.

#1287 merged as `0138ab79804458bc65827679adc0faf8a4e50898`.

On its exact head `ef6875fafacf541432eb7f0340740e3d75a9ba1b`, relevant CI was green, including:

- Source Authority Contract;
- production-like build inside Source Authority;
- full static publication gate;
- Metadata & IndexNow Readiness;
- Shared Files Guard.

Current main retains the authority-aware guard.

### Action

Added a current-main evidence comment and closed #1288 with `state_reason=completed`.

No Product code was written by this verifier.

## #1239 — CRC32 docs drift

The close condition is **not** met.

Current `AGENTS-REFERENCE.md` §3.4 still says that asset revision hashes are `CRC32` and shows `?v=<8 hex>`.

Current `scripts/cache-bust.js` remains the real source authority and defines:

`crypto.createHash('md5').update(...).digest('hex').slice(0, 8)`

Therefore:

- runtime/source behavior remains MD5/8;
- documentation is still wrong;
- the issue is not stale and must not be closed as completed.

Classification: **CURRENT BUG — governance/documentation drift**, not a Product runtime stabilization blocker.

Action: evidence comment added; issue left open. No docs/source edit was made because this lane is verifier/no-code.

## #1242 — test-health hardening

The issue describes missing or weak test-health guarantees rather than a confirmed current Product regression.

Classification: **FUTURE QUALITY**.

It should remain visible as test-system hardening but must not be promoted into a current stabilization blocker absent a fresh Product failure owned by it.

No implementation or issue mutation was performed.

## #1243 — performance measurement

The issue is explicitly about obtaining/strengthening performance measurement evidence rather than repairing a proven current functional defect.

Classification: **MEASUREMENT**.

It remains useful follow-up work but is not a stabilization blocker by itself.

No implementation or issue mutation was performed.

## #298 — owner-approved product goldens

This issue asks for owner-approved visual/product golden baselines and regression governance beyond the existing live/current contracts.

Classification: **FUTURE QUALITY**.

It is not evidence of a current Product regression and should not be zeroed by inventing baseline approvals.

No implementation or issue mutation was performed.

## #1360 — Baptist media completion

The current route/control-plane can remain technically healthy while the Baptist media corpus is incomplete. The issue owns media/content completion and provenance, not a current runtime failure.

Classification: **CONTENT PROJECT**.

It should remain separate from stabilization closure.

No implementation or issue mutation was performed.

## #54 — Hermenevtika umbrella

### Current route/source smoke

The route is no longer governed by the old mixed-source model.

Current route profile for `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` declares:

- `contentSourceMode: astro-native-entry`;
- source/render source = current Astro page;
- `hasMDX: false`;
- `mdxStatus: reference-only`;
- `legacyStatus: reference-only`;
- `migrationMode: strict-native`.

The public Astro entry imports the current `HermenevtikaPageHead` and `HermenevtikaBody`. This satisfies the old source-truth portion of the umbrella through modern canonical roots rather than a Hermenevtika-specific mega architecture.

### Current browser/static smoke

The exact final pre-squash head of merged #1456 (`e25bee467aa87a2fcb357ad44609bdd4a2ae174a`) completed the current relevant matrix successfully, including:

- Runtime Interactive Audit — success;
- Route Registry Validators — success;
- Native Source Contract — success;
- Source Authority Contract — success;
- Overlay Runtime Browser — success;
- Print Paper Contract — success;
- Visual Parity Guard — success;
- Content Source Truth Coverage — success;
- Metadata / Search / Deploy Candidate barriers — success.

The Runtime Interactive run performed a production-like build and durable browser audit successfully. #1456 then squash-merged to current main as `f0ec905…`.

This is sufficient to classify the route as currently integrated and governed; it is **not** evidence that every old #54 wishlist item has vanished.

### Modern ownership of major residual classes

Two old umbrella clusters now have explicit shared SYSTEM owners:

- #1224 — reader control → surface semantics across article engines;
- #1225 — first-class article footnote projection to screen/accessibility/print.

Both issues are still open, so their future work must not be duplicated in a Hermenevtika mega-PR.

Current Hermenevtika source also still shows generic `aria-label="Показать сноску"` markers; that residual is already a direct manifestation of #1225.

### Unique route-local residual still present

The umbrella cannot yet be closed as fully absorbed because one exact route-local content defect from #54 remains on current main.

The visible source notice currently says:

`A Hermeneutical Evaluation of Christocentric Hermeneutics`

while #54's own verified source correction requires the official title:

`A Hermeneutical Evaluation of the Christocentric Hermeneutic`

That is a concrete current route-local bibliographic residual and is not the same problem as #1224 or #1225.

### Action / disposition

A current-main reclassification comment was added to #54. The issue was **not closed**.

Recommended lifecycle status: **narrowed legacy umbrella, not a current stabilization blocker**. Do not create a Hermenevtika mega-PR. Once the remaining route-local bibliographic correction has a bounded owner/receipt, #54 can close as absorbed by the modern shared roots plus that route-local closure.

## Stabilization interpretation

The open issues remaining after this verifier lane are not one undifferentiated blocker set:

- current governance/docs defect: #1239;
- future-quality work: #1242, #298;
- measurement: #1243;
- content project: #1360;
- narrowed umbrella with bounded residual/delegated future owners: #54.

Only #1288 met its close condition and was closed.

## Product mutation boundary

- no Product source or docs were edited;
- no new Product issue was created;
- no Search repair PR was opened;
- #1242/#1243 were not implemented;
- #1295/#1403 were not touched.

## MASTER recommendation

For stabilization accounting, remove closed #1288 from the open-root set. Keep #1239 open as a real but non-runtime docs/governance bug; classify #1242/#298 as FUTURE QUALITY, #1243 as MEASUREMENT, and #1360 as CONTENT PROJECT rather than current stabilization blockers. Keep #54 open only as a narrowed legacy umbrella until its still-current bibliographic title residual has a bounded closure receipt; do not revive the old mega-PR architecture, and do not duplicate #1224/#1225 ownership.
