# The Legendary Poet — structural document outline, Product #554

- Date: 2026-11-04. Audit root: `SYS-TLP-DOCUMENT-OUTLINE-OWNERSHIP` (P3).
- Product owner: `FedorMilovanov/TheLegendaryPoet`.
- Repair: [Product PR #554](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/554), exact head `a926ac3abf60d5200aacd87e0f405e97ac79d990`, squash-merged 2026-11-04T01:05:30Z as `01d40f7e0ac238956ff6cc998be9c6792035a79c`.
- Git tree identity verified: PR head and resulting Product main have the same tracked tree `03ebc5af6c037532d9d310ba2634b93ada706208`. Thus source validation on the exact PR head is applicable to resulting main; release verification still separately required.

## Earlier audit and root cause

The old broad audit reported `heading-order` violations on 19 of 34 routes, including a shared footer defect. The footer had already been repaired in Product #548 and was not changed again. The independently reproduced scope for #554 found 12/33 current canonical+utility routes failing in Chromium desktop: `/poets/` and `/articles/` catalog cards jumped from H1 to H3, all ten poet detail routes introduced KindredSpirits content as H3 before an H2. An independent mobile Safari sweep found a separate responsive heading jump for mobile ratings cards. The source owner had to preserve semantic headings without visually hidden filler.

## Actual repair, not an audit exemption

- `PoetCard` and `EssayCard` now expose typed `headingLevel: 2 | 3` with H3 as the existing Home default and H2 selected for their catalog uses.
- KindredSpirits now introduces its detail-side content with H2.
- MobileRankCard on `/ratings/` now uses H2, matching the actual mobile document context.
- New `qa/document-heading-outline.spec.mjs` asserts the painted DOM heading hierarchy and one H1 for all sitemap-defined routes plus two utility routes. It does not suppress headings or relax the failure rule.
- PR #554 contains no dependencies or unrelated rights/media/visual redesign.

## Verification evidence

- Pre-fix Chromium desktop reproduction: 12/33 failed (different from the older 19/34 audit because footer and other owners had subsequently changed).
- After the scope-limited repair: Chromium desktop route census **33/33 PASS** and desktop `axe-core` 4.10.3 `heading-order` rule **33/33 PASS (zero violations, zero incomplete)**. Axe was an uncommitted local probe, not a permanent dependency.
- Responsive iPhone Safari / WebKit route-heading sweep: **33/33 PASS** after the additional mobile ratings H2 correction.
- Source and contract validations at PR head: TypeScript, production Vite build, image integrity 52/52 and the permanent Chromium heading regression 33/33 PASS.
- GitHub PR #554: all 14 checks passed, including entire Manual Browser QA [run 41745487210](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41745487210), `verify`, and `merge-certification`. No unresolved review threads, exact head and clean behind=0 before expected-head squash.
- Resulting Product main `01d40f7`: main CI [run 41751601740](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41751601740) SUCCESS; Pages [run 41751601686](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41751601686) SUCCESS; content/contracts/route audits, brand audits and secret scanning SUCCESS.
- **Mandatory last release gate:** the resulting-main Manual Browser QA [run 41751602520](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41751602520) was still IN PROGRESS when this preliminary note was authored. **Do not merge this AuditRepo disposition while it is incomplete or failing.** Obtain the final result and update this note before merging AuditRepo.

## Proposed bounded disposition — conditional on resulting-main QA

Once the above exact-main QA succeeds: retire ONLY `SYS-TLP-DOCUMENT-OUTLINE-OWNERSHIP` as verified on the resulting deployed Product main. AuditRepo active matrix changes from **1 P1 + 5 P2 + 1 P3 = 7** to **1 P1 + 5 P2 + 0 P3 = 6**.

Do not reclassify the separate themes, modal-exit, fragment/hash navigation, sticky geometry, text spacing, or human-backed Turnstile P1 on the strength of #554.