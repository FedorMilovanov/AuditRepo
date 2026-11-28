# V5.15 — harden required lab CI and extend data/recovery verification

**Date:** 2026-11-09. **Existing branch/PR:** `lane/gb-premium-3d-library-lab-20261108`, [AuditRepo Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545). **Base for this wave:** `ebf5bc286b5cdc6adc0ec37df190d56add1aa895`.

**Status:** Candidate change for the existing mandatory AuditRepo Validate check. No Product code, AuditRepo main branch, user data, separate branch or release. Treat acceptance as **PENDING** until exact-head GitHub jobs finish successfully.

## 1. CI was real, and exposed a runner-specific problem

V5.15 inherits the first conditional Premium 3D Library GitHub gate introduced on `ebf5bc2`. On [Validate run 42682846007](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42682846007), the full repository validation, Node npm checks, vault/geometry checks, strict TS, Vite build and Chrome/WebKit installation were all **SUCCESS**; but the very first public browser suite, `interaction-regression-browser.py`, reached its 480-second timeout before completing twelve cases. Its published screenshots show that at least the first three Chrome entry views ran, but the initial runner used `subprocess.run(capture_output=True)`, so the case logs were unfortunately hidden until the timeout. **This GitHub CI failure is not a green result.**

The prior machine evidence was obtained on an authorized Windows RTX 3060 Chrome and Playwright WebKit configuration, not an ordinary CPU-only GitHub Ubuntu runner. GitHub's standard hosted runner should not be treated as GPU-backed ([GitHub docs](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners)). Chromium's official [SwiftShader guide](https://github.com/chromium/chromium/blob/main/docs/gpu/swiftshader.md) documents explicit software-WebGL flags for bots without a GPU.

## 2. Explicit CPU-backed browser mode, not a production workaround

The new `tests/browser_runtime.py` is shared by all nine browser suites. In normal use it preserves the original Chrome launch and unmodified user/app graphics setting. **Only** with `GB_LIBRARY_CI_SOFTWARE_GPU=1`:

- Chromium uses the pinned Playwright browser instead of the runner's Chrome Stable channel, and opts into software ANGLE + SwiftShader via `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- Both browser engines set the application's existing, source-owned localStorage `gb-hall-quality=low` before loading the page, matching its real user-selectable low-quality preset. No WebGL monkeypatch, HTML replacement, hidden input automation or scene fixture is substituted.
- The browser runner still enforces the same **nine full suites and 47 independent browser case records**, including both quality toggle directions. The program can reject missing/skip/fail/JS-errored cases, not pass them.
- Output of each case now streams directly into the GitHub job log while the test is running. Eight-minute per-suite timeout remains a hard failure with a precise last completed case. No silent retries or test skips.

**Limits:** this software-only mode validates the actual public UI and WebGL code paths on a no-GPU machine, but its snapshots/latency do not attest to visual fidelity, GPU power, physical iPhone Safari, Android or XR. Production builds and real-device settings remain untouched. The software flags are for a trusted localhost test app; they opt into Chromium's expressly less-protected SwiftShader mode, not internet browsing.

## 3. Persistence, concurrency and the 2D escape route

Added real-origin tests that weren't in the older static/opaque-origin cabinet preview:

`tests/cabinet-persistence-browser.py` (Chrome and Playwright WebKit): creates only synthetic lab book records in an isolated browser context, reloads to verify IndexedDB durability, exports a known-valid backup, attempts a stale import after another tab has written a collection, requires the atomic conflict to **reject** the old import and preserve the newer record, verifies isolation in an independent browser profile. **2/2 PASS** on the authorized Windows test machine. No user data or Product GBReaderLibrary V3 keys read.

`tests/webgl-recovery-browser.py` (Chrome and Playwright WebKit, desktop and emulated touch): injects the standard `WEBGL_lose_context` extension fault into the actual rendered canvas, checks the visible recovery overlay, calls `restoreContext`, confirms reuse of the same canvas and live WebGL2. A separate test disables WebGL2 at browser startup to require an accessible 2D cabinet fallback; it does not change app code. **6/6 PASS** on the authorized Windows browser machine. Synthetic extension loss != physical GPU reset certification.

Together these cases raise the source-owned browser matrix from **39 to 47**; exact-candidate Windows local original orchestration passed **47/47** before the portable backend integration. The portable backend is covered by syntax/contract checks and an explicit Windows software-ANGLE probe (HTTP 200, saved quality low, active WebGL2).

## 4. Engineering release gates

- `node tests/vault-rib-equivalence.mjs`
- Five existing lab/npm checks, strict `npx tsc --noEmit` and `npm run build`.
- `python tests/browser-runner-contract.py` (reject missing case, SKIP, failed case, JS errors and malformed JSON).
- `python scripts/run-browser-regression.py` against the actual production build; source-owned ephemeral localhost server + **47/47** witnesses.
- Exact-head GitHub mandatory `validate` and `preflight` both SUCCESS with no skipped library steps.

No waiver of artistic, content-rights or physical-device gates. Do not merge or publish while incomplete.
