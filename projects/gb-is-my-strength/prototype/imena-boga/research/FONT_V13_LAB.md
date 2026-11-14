# Names of God — v1.3 local font supply, measurement and rejection record

Date: 2026-11-07. Scope: AuditRepo prototype candidate only. Source baseline: PR #538 candidate v1.2 at 08e8a0c4fd66ec09a1501ed1faa3f5e29f95d242. Research #379 was not edited, nor was the Product/live site.

## Why this work

Original Atlas and Constellation standalone Arena shells depended on an external Google Fonts CSS endpoint. This could block or destabilize the first styled render when the endpoint was slow/unreachable. Greek text in Atlas was mapped to Noto Serif Greek; the supported Noto Serif package provides Greek and Greek Extended. Both sites already use elaborate type and Hebrew/Greek, so replacing them with generic fonts was rejected as an unacceptable visual downgrade.

## Options tested and rejected

1. Variable fonts for every family: fontsource-variable 5.3.0 from SIL OFL packages. Fully self-hosted and functionally correct, but all-weight files are large. With simulated 390×844, CPU×4 and 200000B/s download + 150ms CDP latency, first full font-settlement in Atlas transferred approximately 783698B (21 font requests, median CLS ≈0.095), and Constellation approximately 776055B (17 font requests, median CLS ≈0.054). These figures are from an early separate test and should not be used as a Product target.
2. Static subsets everywhere: after verifying every import was actually active (see defect below), Atlas initial transfers ≈476964B, median CLS ≈0.097 (three trials, one had CLS ≈0.147). The occasional large shift argues against promotion without more confidence.
3. Selected hybrid chosen for the lab: Atlas retains Lora Variable as the dominant long-reading family, while other typefaces are pinned static subsets. Median of three trials: first-page bytes 545820, FCP 2216ms, CLS ≈0.09155, font-settled time 5107ms. The difference from static alone is not statistically established (n=3). Choice favors stability of the primary reading face.
4. Constellation uses only pinned static subsets; bundled available WOFF2 set before the corrected import: 374364B. Measured full-page bytes from early trials should not be promoted as a final metric after finding a commented font import. A fresh source QA now verifies every CSS import.

Important: comparison with v1.2 under deliberately disabled CDN fonts (fallback only, no font transfer) is not a valid claim of production speed regression or improvement. Real online font delivery should be compared under like-for-like typography, CDN and browser cache conditions, then measured on Product.

## Defect found in the experiment itself

Initial script accidentally wrote a JS comment containing literal backslash+n before the first font import. Vite still built and the family still looked correct because other styles of the same font were imported. The first font CSS was silently commented out; this invalidated some early CLS comparisons. Corrected both main.tsx files. Added checks/source_contract.cjs to require every imported CSS target, matching pinned package and original OFL license. The corrected experiment was rebuilt and measured again.

## Proof of delivery

- Package sources: Google Fonts/Fontsource, @fontsource static and @fontsource-variable/lora, exact 5.3.0. All packages declare SIL OFL-1.1 and their unmodified license texts are shipped as separate files.
- 45 stylesheet imports, 11 license package instances (8 underlying families); no source code URL to external Google Fonts.
- Both WebKit and Chromium explicitly loaded 6 Atlas families and 5 Constellation families using representative Cyrillic, Hebrew, Greek and Latin strings, with zero external requests, zero failed local font responses, and zero horizontal overflow.
- Original v1.2 image assets, source research data and original Arena ZIP remain unchanged.

## Limitations and next promotion gates

Do not merge this lab code into the Product itself. The Product uses Astro + React islands and owns typography, Reader, SEO and routes. Reuse Product font ownership, apply measured weights/subsets, verify rights and editorial evidence, test real mobile devices and use relevant page-specific Core Web Vitals. One currently large Constellation JS chunk still triggers the Vite warning; do not hide it by raising the warning limit.

Comparison evidence JSON, generated on the authorized desktop from real Chromium sessions, is archived alongside this research; samples are tiny and method-dependent. No claim of P75 field performance is made.


## Artifact-admission and secret scanner dispositions

- Four owner-provided original ZIP archives are accompanied by exact \`.zip.artifact.json\` manifests.
- The Sinai JPG now has ONE canonical immutable reference and the optimized WebP ONE authored source; Vite generates content-addressed build resources.
- AuditRepo's full-history Gitleaks scan flagged exactly seven occurrences of a constant \`PREFS_KEY\` used only as a browser localStorage preference identifier, not an authentication credential. Their precise commit/path/line/rule fingerprints are documented in the root \`.gitleaksignore\` rather than disabling the scanner. Root validation explicitly admits only this file.
- Previous intermediate full-source candidates v07-v12 were pruned from active HEAD. They remain source-history pointers; a future squash may affect their long-term availability.

## Independent clean-head QA, disk exhaustion and typography stability (2026-11-07)

The current candidate at commit ad772f7ef7e75a0a578a0b861f82acdeaab73eb1 was independently sparse-cloned with sibling reference. Both npm ci / Vite production builds / tsc --noEmit passed. The source, font, delivery, failure and WebP QA passed. Chromium and WebKit responsive browser tests passed 8/8 each on 320, 390, 768, and 1440px.

The first Constellation full 78-case suite stopped with ENOSPC when Playwright attempted to write a screenshot. This was not a React rendering failure. The device initially had zero free space because several disposable QA clones contained generated dependency/build trees. Cleanup was strictly limited to node_modules and dist under explicitly named temporary prototype QA directories. Immutable Arena ZIPs, source code, Git worktrees, Product and user files were left untouched. After cleanup the available C: space reached approximately 3.26 GiB. Repeating the **same** v1.3 full suite then produced ALL 78 CHECKS PASSED.

To prevent recurrence, the Constellation browser QA now checks available space via Node statfsSync for both build and OS temp volumes before opening Playwright. A minimum of 1 GiB is required for screenshot-heavy QA. The guard is read-only and never deletes files. Heavy npm ci sessions should be scheduled with more headroom than a browser smoke. No automation may manipulate the owner's ordinary GUI browser; all verification uses separate headless contexts.

A targeted Chrome PerformanceObserver at 390x844, 4x CPU throttling and simulated slow network found a local CLS approximately 0.095 on Atlas and 0.054 on Constellation, driven mainly by late font metric substitution. On Atlas, the hero paragraph moved approximately 34px after heading geometry changed. On Constellation, the centrally aligned hero composition shrank from roughly 499px to 453px, repositioning the CTA about 46px. These are synthetic samples, not field p75 Web Vitals. A future change needs multi-viewport font metric/preload experiments and side-by-side visual review, not arbitrary clipping, disappearing text or bypassing warnings.

Resource protection has a syntax check; the 78-case full suite was certified on the immediately preceding exact source head before this read-only preflight addition. Production Astro, rights of Sinai photograph and theological corpus Research #379 remain independent release gates.
