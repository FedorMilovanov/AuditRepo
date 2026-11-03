# The Legendary Poet — offline Home recovery: corrected causal diagnosis

**Date:** 2026-11-03
**Disposition:** `CURRENT-MAIN REVERIFY / RECLASSIFY AS INVALID ENGINEERING ROOT`
**Product authority:** `FedorMilovanov/TheLegendaryPoet@010d23f28eb2aaf3695a5b73b2f59882538077d9` (Product PR #548 resulting `main`).
**AuditRepo authority before this correction:** `9687b336be4fd399225153e0de9cbcc44c49f281`.
**Original report retained unchanged:** `../verification/2026-10-24-current-main-audit-reopen/REPORT.md` and its historical `TLP-OFFLINE-ERROR-BOUNDARY-HOME-RECOVERY` claim.

## Question under test

The old matrix says that an offline failed lazy route can navigate to `/` yet leaves the ErrorBoundary fallback because the route-change reset fails. This diagnosis did not control whether the destination Home JavaScript and CSS were already loaded. It treated "a new route cannot fetch its code offline" as evidence that the existing ErrorBoundary failed to reset.

## Exact current-source reproduction

Built the unchanged Product `main@010d23f` using Vite 7 on Windows Node `22.23.1`. Ran a local HTTP production preview (`127.0.0.1:4189`) under Playwright with `context.setOffline(true)`. Browser profiles:

1. `chromium-core` desktop;
2. `android-pixel7` (touch Chromium);
3. `iphone-safari` (WebKit, iPhone 15 Pro emulation).

For **each** profile, two distinct scenarios:

- **Cold destination:** open `/about` online without previously loading Home; go offline; use an SPA `pushState` + `popstate` navigation to lazy `/privacy`; wait for expected `main [role="alert"]`; activate the actual "На главную" link; inspect URL, error UI, module request failures, Home cards and metadata.
- **Warm SPA destination:** open `/` online and assert its six HeroPoetWindow cards; navigate within the **same SPA process** to `/about` (without full page reload); go offline; induce the same lazy `/privacy` error; activate the same Home link and inspect the same surfaces.

Readouts after native activation and 1.8–3.0 seconds:

| Browser | Cold Home (not loaded) | Warm Home (module already loaded) |
|---|---|---|
| Desktop Chromium | URL `/`, honest error metadata/UI, zero Home cards; network rejected Home module/CSS | URL `/`, no error, six Home cards, proper Home title and canonical |
| Android Pixel 7 | Same cold failure; explicit `ERR_INTERNET_DISCONNECTED` on Home JS/CSS | Same warm success, six cards, canonical `https://thelegendarypoet.ru/` |
| iPhone Safari/WebKit | Same cold failure; WebKit reports blocked internal resource loads while offline | Same warm success, six cards, proper title and canonical |

**6/6 outcomes matched the cache-availability hypothesis.** The three warm cases prove that the shared route transition **does clear the error fallback**, without changing Product code. The three cold cases are independently explained by blocked source bytes for a destination never loaded in that SPA execution. No `pageerror` was observed in the desktop probe; WebKit's offline request error messages are transport evidence, not proof of a React state bug.

## Source-level cross-check

- `src/components/ErrorBoundary.tsx` already compares `resetKey` in `componentDidUpdate` and clears `hasError` / `chunkFailure`; source path remains unchanged.
- `src/App.tsx` passes the changing `location.pathname` as `resetKey`.
- `src/routes/routeModules.ts` lazy-imports each route chunk. The failed Home import is real; no generic offline fallback bundle can conjure never-fetched route code.
- Scoped Product `git grep` found **no service-worker/offline-shell-cache registration** in `src`, `public`, or `docs/CURRENT_STATE.md`. The current runtime contract does not promise that previously unseen route bundles are accessible offline.
- The older audit already proved that reconnect + reload succeeds; it did not isolate this cold-vs-warm prerequisite.

## Disposition and scope

**Retire the old P2 ID as an invalid root-cause attribution, not as a code fix.** Its proposed remedy ("make the boundary reset") is contradicted by direct warm-SPA browser proof. A blanket ErrorBoundary remount, forced reload, source-test weakening, fake placeholder Home or eager bundling would be cosmetic or impose an unrequested new performance/architecture contract.

The observed **cold offline navigation limitation remains real and transparently documented**. If the owner separately elects full offline navigation, it requires an explicit feature contract and budget (offline shell, versioned route asset cache, invalidation/update and release safety, stale content handling, storage limits, data/rights controls, browser/device test matrix). That is a new product decision, **not** a currently verified defect of the ErrorBoundary.

Historical original evidence is preserved as an observation; only its current engineering **cause and status** are superseded. Remaining active matrix counts change **1 P1 + 11 P2 + 1 P3 = 13** to **1 P1 + 10 P2 + 1 P3 = 12**, independent of Product PR #549's pending CI. Nothing is claimed about unverified production network outages or physical-device offline access.

## Reproducibility / confidence boundary

An isolated throwaway Product worktree was tested; no Product source commit was changed. Exact browser steps above can be recreated as a Playwright test in the existing QA harness. `context.setOffline(true)` is a deterministic browser transport simulation, not an aircraft-mode physical device certificate. Cold/Warm distinction is intentionally **within one SPA process**: a full document reload does not guarantee the old module remains in memory. No assertion that every Home route will work offline is made.
