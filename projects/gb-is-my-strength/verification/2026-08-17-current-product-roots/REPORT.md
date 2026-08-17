# Current Product root verification — 2026-08-17

Purpose: current evidence for the compact active MASTER. This file records only the two Product roots that are live in the 2026-08-17 consolidation wave; it does not revive historical symptoms.

## PROD-SOURCE-LINK-ROT-20260817

**Status:** current-confirmed, repair lane open.

**Current witness:** scheduled `Source Link Audit` on Product `main` produced a production-like report with 310 checked links, 245 passes, 63 warnings and 2 hard errors. The hard errors were both HTTP 404 Internet Archive item URLs:

1. `sim_baptist-missionary-magazine_1870-01_50_1`, emitted by both `dist/baptisty-rossii/noch-na-kure/index.html` and `dist/baptisty-rossii/yuzhnaya-shtunda/index.html`;
2. `sim_journal-officiel-de-la-republique-francaise_1956-07-20_167`, emitted by `dist/articles/kod-da-vinchi/index.html`.

The report explicitly did **not** classify the run as a systemic transport failure. This is therefore content/source-link rot, not an auditor-network false red.

**Repair owner:** Product PR #1692 (`fix/atlas-focus-source-links-20260817`). The lane replaces the dead JORF mirror with official Légifrance, replaces the dead January 1870 magazine item link with a stable HathiTrust catalog authority exposing full-view vols. 49–50 (1869–1870), and expands the existing exact governed-owner push trigger so those source surfaces cause the full network audit after main integration. It does not introduce a glob or audit exclusion.

**Closure boundary:** exact PR contract/build/source-authority gates green; merge; then full production-like Source Link Audit on the resulting `main` push green before this ID is removed from MASTER.

## SYS-ATLAS-DRAWER-FOCUS-HANDOFF

**Status:** current-confirmed systemic focus-lifecycle root; existing shared-file owner retained.

**Current witness:** Product PR #1683 exact-head `Atlas Focus State Contract` reproduced the failure in WebKit at the responsive `981px → 980px` transition. After the desktop sidebar becomes the compact closed drawer, focus remained on a `.atlas-theme.is-active` button inside the sidebar instead of moving to the drawer trigger. The observed element was still rendered but became an invalid focus owner because the compact drawer surface was closed/inert.

**Mechanism:** `matchMedia('(max-width: 980px)')` change handling can run before WebKit has stabilized the CSS/layout change that makes `#atlasFilterTrigger` visible/focusable. A synchronous focus transfer — and a single-frame fallback — can therefore fail while leaving focus in the displaced sidebar owner.

**Repair owner:** Product PR #1683 remains the earlier owner of `src/runtime/atlas-runtime.js`; no competing shared-file lane is admitted. The successor implementation uses bounded `requestAnimationFrame` retries only while focus is still displaced, preserves `inert`, uses no timer delay, and stops immediately if the user/browser has already established another valid focus owner.

**Closure boundary:** exact-head `Atlas Focus State Contract` including WebKit green, surrounding relevant gates green, and clean current-main integration without bypassing Shared Files Guard. If #1683 is too stale to merge cleanly, close it as superseded only after its exact-head fix is proved, then move the proved patch to one clean successor owner lane.
