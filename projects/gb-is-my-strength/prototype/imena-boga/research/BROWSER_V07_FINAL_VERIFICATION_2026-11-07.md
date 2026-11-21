# Names of God v0.7 — exact source, build and browser closure witness

**Recorded:** 2026-11-07. **Scope:** only AuditRepo prototype reference research, NOT Product and NOT Research data. This note **supersedes** the provisional "not run" statements in the earlier iteration report, without erasing that chronological evidence.

## Exact candidate and immutability

- The Arena late A/B ZIP archives were unpacked in isolated Windows QA directories, the candidate source patch applied by `git apply --check` / `git apply`, and Windows CRLF normalized only in QA copies for byte-exact SHA verification.
- This PR now preserves **both complete standalone source trees** under `candidates/v07/atlas/` and `candidates/v07/sozvezdie/` plus `source-manifest.json` with SHA-256 for every source/media file. `originals/` and `reference/` remain unchanged.
- No dependency directories or Vite `dist/` artifacts are committed. The source of truth for later Product integration must be a separate approved Product PR, not a never-ending AuditRepo fork.

## Actually executed on rebuilt exact candidate

| Check | Atlas | Constellation |
|---|---|---|
| `npm.cmd ci` Node 22.23.1 | PASS, 94 installed packages | PASS, 99 installed packages |
| `npm.cmd run build` (Vite 7.3.2) | PASS | PASS |
| `tsc.cmd --noEmit` with local TS config | PASS | PASS (after adding standard `src/vite-env.d.ts`) |
| Chromium 320 / 390 / 768 / 1440 px | 4/4 PASS | 4/4 PASS |
| Horizontal scroll / uncaught JS errors | No root overflow; no page exceptions | No root overflow; no page exceptions |
| Standalone nested base `/preview/imena-boga/` with Sinai image | N/A | PASS, image naturalWidth=1672 |
| Full built-in browser QA | N/A (no equivalent long test) | **78/78 PASS**: desktop, keyboard, search, clipboard, Tetragrammaton, 320/390 mobile dialog/focus/scroll, reader controls and full progress |

Standalone single-file Vite build output after final Constellation corrections: Atlas 556.13 kB HTML / 155.71 kB gzip; Constellation 598.91 kB / 176.13 kB gzip. These are not Product LCP or bundled React-island sizes.

## Important repaired browser-visible root cause

Initial full TypeScript and Vite builds succeeded but the real `Анимации` button completely destroyed the Constellation React root on toggle. Real Chromium `pageerror`: `TypeError: Cannot read properties of undefined (reading 'get')` inside bundled Framer/React. Source-level root cause in `Hero.tsx`: `motionOn && !useReducedMotionConfig()` **conditionally called a hook**, breaking hook order when `motionOn` changed.

**Fix:** call `useReducedMotionConfig()` unconditionally at top level; compute `shouldAnimate = motionOn && !prefersReducedMotion`. Separate deterministic runtime witness confirms user motion state `on → off → on`: React root stays populated, ReaderDock remains mounted, no pageerror. The permanent source regression guard disallows the conditional hook pattern. The final comprehensive QA passes the motion step.

## Classified remaining initial QA reports

- Radial count off by one: new context-lens button was incorrectly counted as another orbiter. The test now counts the 12 named outer/inner orbits plus the central YHWH button.
- Hebrew numeric explanatory caption updated in source: QA now checks correct caption (26) without restoring old overclaims.
- Exodus 3:15 quote in QA was stale from an earlier, factually incorrect text. QA now expects the current verse, not the prior conflation with 3:14.
- Page-level ArrowRight / M shortcuts intentionally refuse to hijack active buttons/inputs; test explicitly removes focus from its preceding button before testing global reader shortcut.
- HTTP404 was an automatic browser request for absent **`/favicon.ico`**, not the Sinai photo. Standalone `index.html` declares `<link rel="icon" href="data:," />`; Product Astro continues to own its real favicon.
- Celebration test pressed M before a long **smooth scroll** finished; active chapter still pointed to the *previous* completed name, toggling it off. QA now positions instantly and waits for active last-chapter header before pressing M. Verified final 78/78.

## Still open before public website

- No WebKit/iOS confirmation, no low-end mobile GPU/FPS/battery, no CI with exact candidate commit, no owner-reviewed visual snapshots.
- No audited licenses/attribution for Sinai photo and fonts; no final Product SEO/URL/Reader/Search ownership integration.
- All model-generated name counts and theological text remain unapproved until Research PR #379 claim-level source and rights gates. **Do not publish this candidate as researched content.**

## Next controlled transfer

Two Astro route families: `/imena-boga/` (Constellation reading) and `/imena-boga/atlas/` (Atlas); route-scoped React/Canvas/SVG, and canonical Product reader/search/navigation. No React conversion of the entire site, no wholesale standalone Vite shell copy. Product exact-head checks and live deploy are separate gates.
