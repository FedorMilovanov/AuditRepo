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
