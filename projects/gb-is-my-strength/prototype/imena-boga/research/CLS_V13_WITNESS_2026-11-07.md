# CLS v1.3 — reproducible cold-load witness (2026-11-07)

Scope: AuditRepo PR #538, `candidates/v13/` only. Neither the production Astro site nor Research #379 is modified.

## Why this exists

Earlier Chromium lab observations at 390px, CPU×4 reported roughly 0.095 CLS for Atlas and 0.054 for Constellation. Source review indicates that late webfont substitution changes heading and paragraph metrics; Constellation's vertically centered hero then shifts its CTA. These are earlier *synthetic* numbers, not remeasured by the new tool and **not** CrUX/field Core Web Vitals. Guessing heights, hiding text, suppressing warnings or accepting incorrect fallback typography is not an acceptable fix.

`candidates/v13/checks/cls_witness.cjs` now instruments `layout-shift` in a fresh Chromium context *before* navigation. It applies CPU×4, 150ms simulated latency, 200000 bytes/s throughput, reduced motion and an isolated HTTP server using compiled Vite assets. It waits for `document.fonts.ready` and records: maximum CLS session window (1s gaps, 5s cap), individual shift sources with before/after rectangles, font settlement time, WOFF request counts, the loaded families and runtime/network failures. Results are printed on stdout. It never modifies application code, data, caches in user profiles, or the deployed website.

## Reproduce on a clean exact-head checkout

1. Include both `candidates/v13` and its sibling immutable `reference/sozvezdie` in a checkout. Do **not** use the owner's dirty main AuditRepo working tree.
2. In each `candidates/v13/atlas` and `candidates/v13/sozvezdie` directory run `npm ci`, `npm run build`, `npx tsc --noEmit`.
3. In `candidates/v13/checks` run `npm ci`. Ensure Playwright Chromium or a compatible `CHROMIUM_PATH` is available.
4. From `checks` in PowerShell, for example:

```powershell
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:VIEWPORTS = '320,390,768,1440'
$env:CLS_RUNS = '5'
node .\cls_witness.cjs | Tee-Object -FilePath .\cls-witness-output.txt
```

The text output may be saved outside version control; the script itself writes no screenshots or build artifacts. Set `MAX_CLS` to a chosen threshold to make an exceeded **maximum observed run** fail with exit code 1; by default this is a diagnostic and does not claim PASS on CLS. Remove temporary output after review if unnecessary.

## Evaluation and guardrails

- Compare at least five cold runs for each variant and viewport on the **same** CPU/network settings and the same source revision; compare medians and worst individual runs. Keep v1.3 as baseline until a measured improvement is demonstrated.
- Attribute shifts to font face/weight/subset and a specific hero element *before* modifying the layout. Check font delivery, synthetic 400/500/600/700 faces, line wrapping, Cyrillic and Hebrew metrics, and the centered hero composition.
- Test alternatives one at a time: priority loading of critical hero faces, narrower font subset, or metric-compatible fallback. Do not introduce blocking text, artificial loading screens, clipping or fixed heights solely to conceal CLS.
- After a candidate improves CLS, repeat existing QA: Chromium/WebKit 16 responsive cases, Constellation 78-case suite, font/source/delivery/failure/image contracts, keyboard/focus, and full screenshots. Real Android/iOS Safari measurements and owner's visual approval are separate publication gates.
- This witness is **Chromium-only** because it uses CDP. It does not replace WebKit, true handset tests, LCP/INP, field p75 Core Web Vitals or rights/editorial review.

## Current execution status

The new script has passed Node.js syntax validation and its published SHA-256 matches the 80-file v1.3 source manifest. Actual browser execution of **this new script** remains pending: Desktop Commander reported the monthly remote-access quota was exhausted on 2026-11-07. Do not report this test as a pass before executing it. Previous v1.3 browser QA remains recorded separately.

## GitHub runner baseline: 24 cold loads (2026-11-07)

Independent evidence: [browser CI run #42385374329](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42385374329), source commit `7ea82fd`, Linux Chromium via Playwright Core 1.62.1, 320/390/768/1440px, three isolated cold contexts per app+width, CPU ×4, network latency 150ms and 200000 bytes/s. This is a **laboratory diagnostic**, not real mobile Web Vitals or a statistically powered performance study.

| Viewport | Atlas median CLS | Atlas trial values | Constellation median CLS | Constellation trial values |
| --- | ---: | --- | ---: | --- |
| 320px | 0.02933 | 0.15052 / 0.02933 / 0.02933 | 0.00218 | 0.00218 / 0.00218 / 0.00218 |
| 390px | 0.00649 | 0.00980 / 0.00649 / 0.00649 | 0.05297 | 0.05297 / 0.05297 / 0.05297 |
| 768px | **0.16263** | 0.16251 / 0.16263 / 0.16263 | 0.01708 | 0.01716 / 0.01708 / 0.01708 |
| 1440px | 0.01417 | 0.01329 / 0.01417 / 0.01421 | 0.00819 | 0.00815 / 0.00819 / 0.00822 |

### Confirmed geometry, not guesses

- **Atlas at 768px:** dominant individual layout shift ≈0.12673, repeated in all 3 trials around 5.9–6.0s. The editorial hero paragraph's top moved from `y=565.78` to `626.88` (≈61px); the large heading and downstream content were changing with late font settlement. Full CLS ≈0.163 is a genuine synthetic regression candidate. Investigate typography, width-dependent wrapping and font request order before touching layout geometry.
- **Atlas at 320px:** the first trial was an outlier (0.15052), with a 0.12426 single shift and a further 0.02605; the other trials were 0.02933. Do not discard the outlier or present median as reliability proof.
- **Constellation at 390px:** dominant shift 0.05222 in all 3 trials. Vertically centered hero content measured `499.375px` high at `y=172` before font settlement and `453.0625px` at `y=195` afterwards; the cross-flagship CTA moved `y=636.06 → 590.06`, a 46px jump. This independently reproduces the earlier reported behavior.
- **Font delivery:** 20–21 WOFF2 requests for Atlas and 20 for Constellation; document.fonts ready around 6.1–6.4s (Atlas) and 6.9–7.2s (Constellation). These values belong only to the controlled simulated network and CPU settings.

### CI findings and cleanup of instrumentation

GitHub-hosted builds, TS checks, source/font/delivery/failure/image contracts and 16 Chromium/WebKit smoke scenarios passed. The diagnostic itself originally failed because its own observer called `tagName.toLowerCase()` on a non-element layout-shift source; corrected in `8a2785b` and confirmed by the successful 24-run witness on `7ea82fd`. These were test instrumentation exceptions, not application errors.

The 78-case Constellation suite produced 77 PASS and 1 test-specific failure under Linux: `requestfailed` counted two pending WOFF2 loads aborted by the test's explicit `page.reload()` during the resume scenario. The fix in `c8bc3a5` awaits the first document's `document.fonts.ready` before reload and preserves true error reporting. **Resolved:** [GitHub browser CI #42386172703](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42386172703) completed successfully on tested candidate commit `165431c`: **ALL 78 CHECKS PASSED**. The later research-only commit did not change the candidate sources. This restores a green functional QA witness without suppressing genuine request errors. No UI code was changed to hide the failure.

### Bounded next experiment

Prioritize Atlas 768px and Constellation 390px, then Atlas 320px worst-case reliability. Run a paired baseline and controlled **critical font preload** experiment on identical standalone builds, report request timing and CLS plus screenshot comparison. Only promote preloads or metric-adjusted fallbacks to source after repeatable improvement and no regression at 320/390/768/1440. Avoid fixed-height hero clamps, clipping, delayed visibility, oversized generic bundles and inflated Vite warning thresholds. Real Android/iOS and Product/rights/editorial gates remain independent.
