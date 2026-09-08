# The Legendary Poet — A11Y utility-motion terminal closure

Date: 2026-09-08  
Audit issue: #410  
AuditRepo base: `1ee4247f37d7d57f5a7d9a2739af3a86d0e1147f`  
Product issue: #467  
Product PR: #468  
Product base: `cf78d58f0bef479e77a0265dd14111bc7d0c44db`  
Exact certified Product head: `2c98a7e184adfdd43e45f1342b1b9e01a222cbab`  
CAS squash merge / resulting Product `main`: `965c8a5f122eeb9362f5156404bf61c6e977d178`  
Tested/resulting tree: `7928505151ebc491044a080c4e199353f845a7ed`

## Disposition

`TLP-A11Y-MOTION-001` is **closed-by-fix + closed-by-cross-browser-evidence** and may leave the active engineering matrix.

The bounded defect was a split reduced-motion authority: Framer/View Transitions and several hand-written effects respected `prefers-reduced-motion`, while persistent Tailwind utility animation did not. Product #468 centralized the policy instead of adding component-local exceptions.

## Final authority

- `src/reduced-motion.css` is the final production CSS import from `src/main.tsx`.
- Under `@media (prefers-reduced-motion: reduce)`, `.animate-spin`, `.animate-ping`, `.animate-pulse` and `.animate-bounce` resolve to `animation: none !important`.
- Normal-motion behavior is unchanged.
- State meaning remains visible because only animation is suppressed; text/icons/state containers are not removed.
- `validate:browser-runtime` recursively inventories production `src/**/*.ts(x)` and currently reports **18 persistent utility-animation tokens** governed by this authority. The validator also fails if the policy becomes vacuous, loses one of the four selectors, loses the media query/authoritative declaration, or is no longer the final production CSS import.

## Exact-head certification

All substantive workflows associated with exact head `2c98a7e184adfdd43e45f1342b1b9e01a222cbab` completed successfully before merge:

- CI #3912 — success;
- Project Contracts #1023 — success;
- Site Route Integrity Audit #1918 — success;
- Brand Deep Reference/Motion Audit #1935 — success;
- Brand Raster QA #1097 — success;
- Articles Catalog Acceptance #1610 — success;
- Yesenin Part I Browser Acceptance #1153 — success;
- Merge Certification #65 — success;
- Manual Browser QA #2971 — success.

The final race check kept Product `main` at `cf78d58f0bef479e77a0265dd14111bc7d0c44db`, PR #468 at `behind=0`, with zero reviews and zero review threads, before expected-head squash merge.

## Real browser proof

The core Manual Browser job checked out the exact certified head and passed its production build plus browser-runtime validator before runtime execution.

Chromium + Android Chrome core matrix: **152 passed / 14 skipped**. The new regressions both executed there:

1. `/poets`: the persistent rating pulse runs under `no-preference`, then computes `animationName: none` under `reduce` while the rating state remains visible.
2. `/music`: a real track is actively playing; the mini-player still shows `Сейчас звучит` and `<audio>.paused === false`, while its persistent pulse computes `animationName: none` under `reduce`.

The base iPhone Safari contour then ran in **17 fresh WebKit processes** and all 17 contours passed. `poets-status` passed 2/2 and `audio-completion` passed 2/2 in iPhone Safari, so the same two reduced-motion outcomes are not Chromium-only assertions.

Core evidence artifact: `manual-browser-core-evidence-2c98a7e184adfdd43e45f1342b1b9e01a222cbab`, artifact id `10075218940`, digest `sha256:ff54236e5f7528ee48d9695f6e5f7adc790e65dbd71795415985954b7ada03f3`.

## Merge integrity

PR #468 was CAS squash-merged with expected head `2c98a7e184adfdd43e45f1342b1b9e01a222cbab`. Resulting Product `main` is `965c8a5f122eeb9362f5156404bf61c6e977d178`.

The resulting commit tree is exactly `7928505151ebc491044a080c4e199353f845a7ed`, identical to the tested tree certified before merge. Therefore the squash transaction introduced **zero untested source-tree delta**.

## Matrix effect

Only `TLP-A11Y-MOTION-001` leaves the active surface in this wave:

- P1 stays `1`;
- P2 stays `11`;
- P3 moves `4 → 3`;
- total active moves `16 → 15`.

`TLP-A11Y-RUNTIME-001` remains independently active: focus/navigation/dialog/hash/hidden-chrome/collection-mutation/citation/overlay ownership is outside this bounded motion closure.

`TLP-AUDIT-004` also remains independently active. This wave materially narrows one of its previously listed proxy gaps by adding exact computed-animation browser outcomes, but the audit-harness root still has other independent acceptance gaps and is not closed here.

## Historical pre-merge witness

The earlier staged witness `REVERIFY_PREMERGE_2026-09-08_a11y-motion.md` is retained as diagnostic history. Its queued/non-terminal language describes the state before the successful terminal runs above and must not be treated as the current disposition.