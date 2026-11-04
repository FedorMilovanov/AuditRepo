# The Legendary Poet — modal exit lifetime P2 closure (release-gated)

Verification prepared: 2026-11-04. Owner: `FedorMilovanov/TheLegendaryPoet`.

## Original failure
- Active root `SYS-TLP-MODAL-EXIT-LIFECYCLE` (P2) was observed in Chromium 153. Before the repair, `useDialogSurface` released overlay-stack ownership, focus containment, body scroll lock and `inert` isolation when React `open` became false, while Framer Motion still painted a full-viewport dialog during exit.
- Essay lightbox remained connected and pointer-active for approximately 1.0 seconds; ImmersivePlayer around 0.7 seconds. The focus was restored behind the connected exiting dialog. Old source guards only verified acquire/release calls, not the visible-exit lifecycle.

## Product repair is already merged
- [Product PR #551](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/551) exact head `484d8491cf9c8c8de6d48278a2b75789adb2948f` was squash-merged at 2026-11-04T02:14:32Z into Product `main@b850ef6795b8c5079c2cf9c740179abf0ff7b3a4`.
- Source tree of original PR head and resulting Product main is identical: `e4938515411a47a50d8a101b7d5bf79024c18f3f`. No post-merge source drift at this anchor.
- Shared `useDialogExitLifetime` retains `lockOpen` ownership until Framer Motion exit completion. Both essay lightbox and ImmersivePlayer pass lifetime-controlled open state to `useDialogSurface` and request release only after unmount. This preserves isolation and pointer/focus ownership during painted exit rather than hiding the dialog or altering exit animation.
- Focus and overlay release are coordinated by the shared hook, with permanent behavioral coverage in `qa/reader-journeys.spec.mjs` and updated `scripts/validate-interaction-runtime.ts` / `scripts/validate-essay-lightbox-runtime.ts`. Documented in `docs/MEDIA_OVERLAY_RUNTIME.md`.

## Verified exact-head evidence
- Original Product PR #551 has **13 SUCCESS checks**, **0 failed**, **0 pending**; optional unrelated Hall wait/dispatch jobs were skipped, not bypassed checks.
- Exact-head full [Browser QA run 41752167788](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41752167788) SUCCESS, including Chromium+Android browser suite, iPhone Safari, WebKit Home and analytics-route QA; `verify` and `merge-certification` also SUCCESS.
- Before merge, combined Product #554+#551 integration on Product `main@01d40f7`: local **12/12 modal-exit scenarios** across Chromium/Android/iPhone Safari, and separate **1/1 cross-site heading sweep** (33 routes), with TypeScript and production build PASS. This is independent integration evidence, not a substitute for resulting-main CI.
- Resulting Product `main@b850ef6`: [CI run 41759439087](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41759439087) SUCCESS. Post-merge [Manual Browser QA 41759439065](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41759439065) had four successful browser/analytics jobs with core browser-qa still IN PROGRESS at preparation. [Pages deploy 41759439111](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41759439111) had successful build but deployment QUEUED.

## Required release gate before AuditRepo merge
Do **not** merge the AuditRepo modal retirement while resulting Product `main@b850ef6` full Browser QA or Pages deployment is unfinished/failed. Read those specific Actions again, then update this report with exact completed status, check current Product main SHA and ensure no source drift. AuditRepo PR must also have successful exact-head `validate` and `preflight`.

## Bounded disposition
Once the above gate is satisfied, retire **only** `SYS-TLP-MODAL-EXIT-LIFECYCLE`; AuditRepo active matrix becomes **1 P1 + 4 P2 + 0 P3 = 5** (was 1 + 5 + 0 = 6). This does **not** close contrast, fragment/hash navigation, sticky geometry, text-spacing robustness or human-only Turnstile adversarial certification.
