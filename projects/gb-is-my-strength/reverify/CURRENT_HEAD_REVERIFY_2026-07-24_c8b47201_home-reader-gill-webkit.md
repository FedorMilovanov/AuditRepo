# CURRENT HEAD REVERIFY — 2026-07-24 — homepage, Gill, Reader R6 and WebKit closure

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source `main`: `c8b47201f5b7210d69809c38808bfbda15695dcd`
- Last exact production authority: `8a5352671375fdb01b6c30273c25ec4283a13f69`
- Last exact readiness: `30006414898`
- Last exact Pages run: `30007024100`
- This witness advances **source/CI authority only**. It does not claim a new exact Pages deployment.

## Source merge chain preserved

| Area | PR | Merge SHA | Result |
|---|---:|---|---|
| Homepage edge states and landmarks | #190 | `0a0d1416` | breakpoint/BFCache cleanup, eight-route no-JS navigation, focus transfer, footer and feedback semantics |
| Homepage no-JS and print visibility | #193 | `12ced3c5` | substantive reveal sections cannot remain hidden without JavaScript or in print |
| Homepage no-IntersectionObserver fallback | #196 | `4111458b` | early home-only fallback before shared runtime |
| Visual Parity reveal settlement | #195 | `f63e7fd2` | warm-scroll → prove visible → freeze → revalidate → screenshot |
| Nagornaya first Safari overflow pair | #197 | `058bf3a2` | local table/subtitle containment without root clipping |
| Final Gill source reconciliation | #192 | `877508fb` | native Gill claims bounded to available evidence with a permanent read-only contract |
| Nagornaya Part III Safari remainder | #199 | `0d352415` | route-owned matrix and summary reflow at iPhone 320 |
| ReaderState R6 | #191 | `a4372707` | one progress/resume/persistence transaction with legacy migration and engine sweep |
| Android/WebKit all-route gate | #200 | `c8b47201` | permanent five-profile touch/scroll/resource matrix over all production routes |

## Homepage loss check

Current source preserves the approved homepage contract:

- Avvakum 3:19 Hebrew-to-Russian inline transformation;
- 39 background biblical phrases;
- four SVG route directions;
- lion label and its explicit interaction;
- mobile menu breakpoint and BFCache cleanup;
- eight native no-JS navigation routes;
- correct focus return/transfer and top-level footer landmark;
- reveal visibility without JavaScript, in print and without `IntersectionObserver`;
- fail-closed Visual Parity capture ordering.

No unpublished fifth homepage package, hidden local commit or missing post-#182 lane was found. The previously lost `a532042` work is represented by merged PR #190 and its descendants.

## Reader R6 exact-head evidence

PR #191 exact head `2461198f45033d8cce5f2444a9492d9f8176fa01` completed:

- Shared Files Guard `30098725861` — success;
- Gill Final Source Reconciliation `30098725874` — success;
- Overlay Runtime Browser `30098725895` — success;
- Glossary Contract `30098725882` — success;
- Native Source Contract `30098725918` — success;
- Route Registry Validators `30098725866` — success;
- Visual Parity Guard `30098725897` — success.

The final PR contains 61 permanent files and no temporary materializer, patch or diagnostic workflow. Review-thread count was zero.

## Cross-browser exact-head evidence

PR #200 exact head `da05253bfc37db7b57318492f5576bd929c5c140` contained exactly:

1. `.github/workflows/route-registry-validators.yml`;
2. `scripts/public-surface-cross-browser-matrix.mjs`.

Exact runs:

- Shared Files Guard `30098798681` — success;
- Route Registry Validators `30098798531` — success;
- existing registry, production-like build, SEO/search policy, Baptist 3D shell, Chromium route matrix, route semantics and Nagornaya epistemic UI — success;
- Android Chromium touch matrix — **75 routes, 1828/1828 PASS, failures 0**;
- WebKit iPhone 320/390 + desktop matrix — **75 routes, 2660/2660 PASS, failures 0**.

Artifacts:

- Chromium: `public-surface-cross-browser-chromium-30098798531`, digest `sha256:2a76f66fc451508befc7a48c1c4026367fa2176dd9fef0c7d7081b648ea66ce1`;
- WebKit: `public-surface-cross-browser-webkit-30098798531`, digest `sha256:7a685f332fd822b0f2eae70762e681fa6b47a0e303989d87007600b07a917383`.

Both `/nagornaya/chast-3/` and `/nagornaya/chast-5/` recorded root overflow `0` in all WebKit profiles.

## Merge-race verification

Reader R6 merged immediately before the cross-browser gate. Current `main@c8b47201` was inspected after both merges and contains both workflow additions:

- `npm run engine:sweep` in the existing Chromium public-surface job;
- the independent `public-surface-cross-browser` Chromium/WebKit matrix job.

Thus the later system merge did not overwrite Reader R6 workflow coverage.

## Superseded work cleanup

- PR #194 — closed as historical/superseded cross-browser branch;
- PR #201 — closed unmerged because its broad `body.nagornaya-page` selectors duplicated #199 and could affect unrelated Nagornaya layouts.

At this source snapshot there are no open pull requests in `gb-is-my-strength`.

## Production boundary still pending

The connector available during this reverify exposes pull-request runs but did not provide an exact `main@c8b47201` readiness/Pages witness. Therefore:

- source authority advances to `c8b47201`;
- production authority remains `8a535267`;
- stale CI/deploy alert issues must not be closed solely from source evidence;
- the next release task is exact readiness → exact Pages → live marker/hash verification on the same SHA.

## Counter policy

This reverify updates source/deploy authority and session history only. It does **not** change canonical bug counters without mapping each merge to an existing matrix row and preserving Single-Writer-Per-Fact discipline.
