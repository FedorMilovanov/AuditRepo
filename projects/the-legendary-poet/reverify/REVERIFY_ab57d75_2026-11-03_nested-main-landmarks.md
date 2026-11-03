# Current-main re-verification — duplicate main landmarks

**Date:** 2026-11-03. **Disposition:** CLOSED BY ALREADY-MERGED SOURCE FIX; retire `TLP-STATIC-PAGE-NESTED-MAIN-LANDMARKS` from the active matrix. No new Product mutation.

## Anchors and mechanism

- Original October audit correctly found two nested `<main>` elements on `/editorial-policy` and `/privacy`, with failed axe rules `landmark-main-is-top-level`, `landmark-no-duplicate-main`, `landmark-unique`.
- Product PR #548, squash merge `010d23f28eb2aaf3695a5b73b2f59882538077d9` (2026-11-03 18:24 UTC), already replaced both page-local `<main>` opening/closing tags with layout-preserving `<div>` tags. This is directly visible in the commit patch for `src/pages/EditorialPolicyPage.tsx` and `src/pages/PrivacyPage.tsx`.
- Current Product `main@ab57d75489de8f1722f6742ac66810254cae78e6` (post #550 documentation-only advancement) contains exactly **one** source-owned `<main>` under `src/`: `src/App.tsx` owns `main#main-content`. Neither static page creates another main or `role="main"`.

## Independently reproduced current-main evidence

Unmodified Product source checked out detached at exact `ab57d75489de8f1722f6742ac66810254cae78e6` into an isolated Windows worktree. `npm ci` and production Vite build both succeeded. Local Vite preview used the generated `dist`, not the development server.

Playwright Chromium-core, real DOM and accessibility-role checks **3/3 PASS**:
- `/editorial-policy` — one visible shared `main#main-content`, unique accessible main landmark, heading `Редакционная политика`, one skip link to the same target; no nested main and no redundant `role="main"`.
- `/privacy` — same guarantees; heading `Политика конфиденциальности`.
- `/poets` — ordinary route control; heading `Лица Эпохи` and the same single-main/skip-link contract.

Independent axe-core 4.10.3 injected into the production-built pages, exact rules `landmark-main-is-top-level`, `landmark-no-duplicate-main`, `landmark-unique`: **3/3 routes PASS, nine rule-level passes, zero violations, zero incomplete results and zero inapplicable results**.

Both test probes and the transient axe-core installation were local forensic materials only; none were added to Product source or workflows.

## Disposition and boundary

This root is **not** a live P2 anymore. It was fixed as part of the already-merged Product #548, not by the present audit. The original observation was valid at its original source anchor; current work is evidence/ledger retirement, not denial of the historical finding. No Product branch, new runtime patch, weakening of checks, or deploy action is needed.

The result establishes current-main source and production-like Chromium browser behavior on the three scoped routes. It does **not** independently attest a new live custom-domain deployment or claim to close unrelated P1/P2/P3 roots. The current active matrix narrows from **1 P1 + 10 P2 + 1 P3 = 12** to **1 P1 + 9 P2 + 1 P3 = 11**.
