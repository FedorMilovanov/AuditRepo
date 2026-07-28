# Homepage lifecycle / BFCache content disposition — 2026-07-28

## Scope

Repository: `FedorMilovanov/gb-is-my-strength`  
Site main inspected: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`

This audit classifies the homepage interaction, real-history, Pagefind request-identity and BFCache capability work by actual files and evidence before any mutable-ref normalization.

## Forensic preservation completed first

Combined non-merge anchor:

- ref: `archive/forensic-home-lifecycle-bfcache-histories-20260728`;
- commit: `f79606f99045df27ba1ec8923b9c28da198a0483`.

The anchor preserves current main, accepted authority states, every staging/diagnostic PR head and three later current branch tails.

Dedicated archives:

- Pagefind exact-request proof: `archive/forensic-home-pagefind-request-proof-pr388-20260726` at `b6b3a2b0ab1c64fb143572b6ac818825e50210b6`;
- rejected process-isolation carrier: `archive/forensic-home-browser-process-isolation-pr402-20260726` at `a21690ef04a2a730a0fdf2cf98575667cadf829f`;
- minimal cross-platform WebKit BFCache control: `archive/forensic-webkit-bfcache-control-pr404-20260726` at `7bfc0fc82346ad293e9b1a4f4131b950155a830f`.

Restore a historical state by checking out its exact SHA. Do not merge the octopus anchor into `main`.

## Accepted product and contract evolution

### PR #338 — initial real browser interaction authority

- head: `8d39dab12e1f999b92551f3c80293ce442887537`;
- branch: `fix/home-browser-contract-20260725`;
- established Chromium/WebKit homepage interaction, focus, scroll-lock, shortcut, Hebrew interaction, no-JS and overflow checks;
- corrected the lazy search shortcut gate;
- current branch still equals the exact PR head.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### Clean lifecycle authority on main

The lifecycle source and read-only workflow were accepted on main at:

- `a73b57945ebb354a79e723b2939d9f70e3e0c42e`.

This state replaced temporary write-capable transport and became the reviewed source/workflow baseline used by later request-identity work.

### PR #385 — navigation-abort request identity

- head: `32353e0eda7e321a8220f0d9de7253712063e4ee`;
- branch: `fix/home-browser-request-identity-final-20260726`;
- binds an intentional navigation abort to the exact request object rather than to a broad timing window;
- current branch still equals the exact PR head.

Disposition: `CONTRACT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #388 — Pagefind bootstrap request identity

- head: `b6b3a2b0ab1c64fb143572b6ac818825e50210b6`;
- branch: `fix/home-pagefind-request-identity-20260726`;
- added exact same-origin `/pagefind/pagefind.js` request matching;
- records the successful HEAD response by request identity;
- permits only Chromium's known post-response HEAD abort;
- requires exactly one module GET, one search overlay, input focus, ready=true and failed=false;
- current branch still equals the exact PR head.

The separate `scripts/home-pagefind-bootstrap-proof.mjs` is absent as a standalone file in current main, but its complete method is embedded in `scripts/home-browser-lifecycle-contract.mjs`: exact request matching, response-object binding, known abort classification, module-load counting and ready/fail assertions are retained.

Disposition: `METHOD_ABSORBED / FORENSIC_PROOF_RETAINED / REF_NORMALIZATION_ALLOWED`.

### PR #405 — capability-aware BFCache authority

- head: `88d17334ec13271c42fe4773308cbd23a4ab4d0f`;
- branch: `fix/home-browser-capability-contract-20260726`;
- merge authority for the final capability-aware contract;
- requires real BFCache admission/restoration only when the tested environment demonstrates that capability;
- otherwise still requires the full product lifecycle, cleanup, theme, shortcut and request semantics;
- current branch still equals the exact PR head;
- current main's `scripts/home-browser-lifecycle-contract.mjs` blob is byte-identical to PR #405: `8d1f126d76dfa63fd269bf141b37cacd80fa1090`.

Disposition: `CURRENT_AUTHORITY / REF_NORMALIZATION_ALLOWED`.

## Staging and materializer histories

### PR #361 and current residual tail

PR #361 head:

- `507005b9a2c00af9560c2ebd8ec7dbe31af12045`.

Its temporary Python materializer used exact one-match replacements, added Chromium CDP `Page.backForwardCacheNotUsed` diagnostics and self-deleted.

The mutable branch now points to a separate early diagnostic commit:

- branch: `fix/home-browser-contract-residuals-20260725`;
- current head: `6ccb3616ee810c2845a1f5bb941d658114e55843`.

That head installs the early lifecycle contract and workflow integration directly. Its useful diagnostics and behavior have been superseded by the accepted capability-aware contract; both the PR head and current tail are parents of the forensic anchor.

Disposition: `EARLY_DIAGNOSTIC_ABSORBED / CURRENT_REF_NORMALIZATION_ALLOWED`.

### PR #365 and current lifecycle-final tail

PR #365 head:

- `834fa0153eb6d1f2a523830a9fb9d9b7ae49f2fd`.

Current branch:

- `fix/home-browser-lifecycle-final-20260725`;
- head `00dde6324e3101d77ee9c0c74062eb4a604861d1`.

This variant required persisted BFCache admission/restoration unconditionally in headed Chromium/WebKit. That assumption was later disproved for the tested WebKit environments. The interaction and cleanup semantics survive in the final contract; the impossible unconditional capability assertion does not.

Disposition: `SUPERSEDED_STRICT_CAPABILITY_ASSUMPTION / REF_NORMALIZATION_ALLOWED`.

### PR #368

- exact PR head: `4e1efada974676dedbf3b8a81ff09bcabea24ca4`;
- branch: `test/home-browser-lifecycle-clean-20260726`;
- current branch head: `8a117ec4f157b2581f018f5f9ed4fb83e06775f6`.

The mutable ref points to the parent staging state rather than the PR head. Both states are preserved in the anchor. Neither contains product authority beyond the later accepted contract.

Disposition: `STAGING_HISTORY_PRESERVED / REF_NORMALIZATION_ALLOWED`.

### PR #376

- head and current branch: `2edd637d255c112fa2a4dd68b9ba86a18998dc5c`;
- branch: `test/home-browser-lifecycle-proof-20260726`.

This was a clean proof branch around the source that had already landed on main. It is evidence, not a separate product line.

Disposition: `PROOF_HISTORY_PRESERVED / REF_NORMALIZATION_ALLOWED`.

### PR #381 and current transport tail

PR #381 head:

- `b2d25c381d56c4af134f97ca5381e8fcffdb5369`.

Its Python materializer replaced broad Pagefind timing allowance with exact request-object identity and self-deleted.

Current branch:

- `fix/home-browser-lifecycle-final-clean-20260726`;
- head `dfb2087c9db1607a177d0416e5dee3456f032787`.

The extra commit changes only the temporary write-capable transport workflow so it restores the reviewed workflow from exact commit `a73b579...` and validates its markers. It is transport provenance, not permanent product code. The request-identity method is present in current main.

Disposition: `TEMPORARY_TRANSPORT_HISTORY_PRESERVED / REF_NORMALIZATION_ALLOWED`.

### PR #400 snapshot

- PR head: `307a9c95281a9abeb49421d1468eeee5058233f8`;
- branch: `temp/home388-ff613-snapshot-20260726`;
- current branch head: `ff61367623276815bd88af1f6fa7ab1fca3324f0`.

The current mutable ref is an earlier snapshot state with no unique product claim. PR and current states are preserved through the anchor.

Disposition: `SNAPSHOT_HISTORY_PRESERVED / REF_NORMALIZATION_ALLOWED`.

## Rejected hypothesis: process isolation

PR #402 exact head:

- `a21690ef04a2a730a0fdf2cf98575667cadf829f`.

The temporary materializer:

- pinned the base and source blob;
- verified base64, gzip and patch SHA-256 values;
- applied a one-file process-isolation patch;
- removed all carrier files;
- built the production-like site and ran homepage contracts;
- would have pushed a clean one-file product head.

Result: separating Chromium and WebKit into different Node processes did not change WebKit `persisted:false`. The hypothesis was correctly rejected.

The current mutable branch `fix/home-browser-process-isolation-20260726` no longer represents PR #402; it has been reused and currently points at governance commit `0f7cefbb20abb17c65872e53c00c733c480f2a97`.

Disposition: `REJECTED_HYPOTHESIS_FORENSICALLY_PRESERVED / CURRENT_REUSED_REF_EXCLUDED`.

## Environmental control: WebKit capability

PR #404 exact head:

- `7bfc0fc82346ad293e9b1a4f4131b950155a830f`.

Its read-only control tested a minimal two-page site with no homepage runtime, Pagefind, menu or application code across:

- Chromium Linux headed ephemeral;
- WebKit Linux headed ephemeral;
- WebKit Linux headless ephemeral;
- WebKit Linux headed persistent;
- WebKit macOS headless ephemeral;
- WebKit macOS headless persistent;

and three cache policies: none, revalidate and cacheable.

The control established that Chromium admitted/restored BFCache while the tested WebKit environments did not. This evidence justified the capability-aware contract in PR #405 and must not be rewritten as a product defect.

The current mutable branch `temp/webkit-bfcache-control-20260726` has also been reused and no longer represents the exact PR #404 head.

Disposition: `ENVIRONMENTAL_CAPABILITY_EVIDENCE_PRESERVED / CURRENT_REUSED_REF_EXCLUDED`.

## Current main authority

Current main retains a strict evolution of the full useful method:

- real history traversal;
- menu and scroll-lock cleanup after return;
- document-token and pageshow/pagehide evidence;
- capability-aware BFCache assertions;
- exact Pagefind request identity;
- successful HEAD-response binding;
- exact one-module-load and one-overlay checks;
- Chromium-only known-abort handling;
- external-service fixtures and local manifest mapping;
- Chromium and WebKit execution.

No route or product code should fake `persisted:true`, and no browser failure should be globally ignored. Capability and product semantics remain separate assertions.

## Authorized normalization set

After this disposition is merged, and only after each current ref is rechecked against the exact head recorded below, these ten refs may be force-moved to the then-current site main:

1. `fix/home-browser-contract-20260725` — `8d39dab12e1f999b92551f3c80293ce442887537`;
2. `fix/home-browser-contract-residuals-20260725` — `6ccb3616ee810c2845a1f5bb941d658114e55843`;
3. `fix/home-browser-lifecycle-final-20260725` — `00dde6324e3101d77ee9c0c74062eb4a604861d1`;
4. `test/home-browser-lifecycle-clean-20260726` — `8a117ec4f157b2581f018f5f9ed4fb83e06775f6`;
5. `test/home-browser-lifecycle-proof-20260726` — `2edd637d255c112fa2a4dd68b9ba86a18998dc5c`;
6. `fix/home-browser-lifecycle-final-clean-20260726` — `dfb2087c9db1607a177d0416e5dee3456f032787`;
7. `fix/home-browser-request-identity-final-20260726` — `32353e0eda7e321a8220f0d9de7253712063e4ee`;
8. `fix/home-pagefind-request-identity-20260726` — `b6b3a2b0ab1c64fb143572b6ac818825e50210b6`;
9. `temp/home388-ff613-snapshot-20260726` — `ff61367623276815bd88af1f6fa7ab1fca3324f0`;
10. `fix/home-browser-capability-contract-20260726` — `88d17334ec13271c42fe4773308cbd23a4ab4d0f`.

Force is authorized because these squash/staging/transport histories are not direct ancestors of current main, while all exact historical states have already been preserved.

## Explicit exclusions

Do not move or delete under this disposition:

- `fix/home-browser-process-isolation-20260726` — reused current ref, exact PR #402 state preserved separately;
- `temp/webkit-bfcache-control-20260726` — reused current ref, exact PR #404 state preserved separately.

No branch deletion is authorized.

## Publication boundary

This audit changes no homepage product, route, content, publication state or deploy workflow. It authorizes only evidence-backed ref normalization after exact-head verification.