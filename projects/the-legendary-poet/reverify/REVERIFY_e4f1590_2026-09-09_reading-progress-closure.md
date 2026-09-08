# Reverify — TLP-READING-PROGRESS-001 terminal closure

**Project:** `FedorMilovanov/TheLegendaryPoet`  
**Root:** `TLP-READING-PROGRESS-001`  
**Product issue:** #469  
**Product PR:** #470 — `fix(reader): bind reading progress to article boundaries`  
**Product base:** `965c8a5f122eeb9362f5156404bf61c6e977d178`  
**Exact tested head:** `2565a7383b5cb730c2e6b7ed4c87cacdf71dd5c3`  
**CAS squash / resulting Product main:** `e4f159063648a6663e165877ef3f75dfcc2c0d09`  
**Tested tree = resulting tree:** `281e3fedb264ab56240c5b6ac2a493b80a88bfde`

## Terminal finding

`TLP-READING-PROGRESS-001` is closed-by-fix and closed-by-browser-proof.

The previous reading-progress implementation had two root-document authorities: CSS `animation-timeline: scroll(root)` and a JavaScript fallback using `document.documentElement.scrollHeight`. That made the community/footer tail part of the reading denominator even though `EssayPage` already owned the semantic article boundary through `articleRef`.

Product #470 moves progress authority to that existing article ref. Progress is now 0% when the article top reaches the viewport top, reaches 100% when the article bottom reaches the viewport bottom, and remains 100% after the reader enters the post-article community/footer tail. Passive scroll and resize observation plus `ResizeObserver(article)` all schedule one RAF-coalesced computation path. The component also exposes the value through semantic progressbar state.

The permanent `validate-scroll-runtime.ts` contract rejects document-height ownership, split CSS/JS progress authority and legacy runtime use of `reading-progress-fill`, and requires the explicit article ref, article geometry, passive observers, `ResizeObserver` and RAF coalescing. The browser regression proves the physical 0 → midpoint ≈50 → article-end 100 → post-article-tail 100 outcome on the real longform route.

## Exact-head certification

All required Product workflows completed successfully on exact head `2565a7383b5cb730c2e6b7ed4c87cacdf71dd5c3`:

- CI #3914 — success;
- Project Contracts #1025 — success;
- Content Model Contract #785 — success;
- Site Route Integrity Audit #1920 — success;
- Brand Deep Reference and Motion Audit #1937 — success;
- Merge Certification #66 — success;
- Manual Browser QA #2973 — success.

CI included the runtime/interaction contracts, typecheck, Worker dry-run, production build, route splitting and budgets, prerender and SEO/discovery checks.

## Browser proof

Manual Browser QA used the exact checked-out head and completed the relevant longform contours across the required browser families:

- Chromium + Android core matrix: **154 passed / 14 skipped**;
- the reading-progress regression passed in Chromium and Android Chrome;
- base iPhone Safari: **17 fresh-process contours passed**;
- the WebKit reader journey containing the reading-progress boundary proof passed;
- premium-home, critical-iPhone and WebKit-home jobs also completed successfully.

Core evidence artifact:

- artifact id: `10076915318`;
- name: `manual-browser-core-evidence-2565a7383b5cb730c2e6b7ed4c87cacdf71dd5c3`;
- size: `165132780` bytes;
- digest: `sha256:d38a0da12d5d8db16b9d59a8cf1567f40e4286a079dcecdf17ec5a6136078447`.

## Merge integrity

The final pre-merge race check found the PR mergeable, `behind=0`, with zero reviews, zero review threads and no comment debt. The squash merge was executed with expected head `2565a7383b5cb730c2e6b7ed4c87cacdf71dd5c3`.

The certified head and resulting Product merge both point to tree `281e3fedb264ab56240c5b6ac2a493b80a88bfde`; therefore no untested source-tree delta entered through squash. Product issue #469 closed as `completed`.

## Control-plane disposition

This bounded transaction closes only `TLP-READING-PROGRESS-001`. It does not reclassify or reopen any other active root.

AuditRepo disposition for this wave:

- P1 remains 1;
- P2 remains 11;
- P3 moves **3 → 2**;
- total active moves **15 → 14**;
- `TLP-AUDIT-004` is narrowed because reading-progress denominator behavior now has both a fail-closed source contract and exact browser outcome proof, but its other independent audit-harness gaps remain active.

No live backend, hosting, rights, discovery, home-media or systemic-focus claim is made by this closure.