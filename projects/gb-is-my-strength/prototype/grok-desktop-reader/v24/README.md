# Grok Desktop Reader — reference V24 (2026-11-06)

**Status:** accepted *prototype / desktop visual reference*, **NOT implemented in Product**. Source owner: `FedorMilovanov/gb-is-my-strength`; audit/evidence owner: `FedorMilovanov/AuditRepo`. This package supersedes V23 **for the selected desktop prototype only**; retain V23 and V22 for historical comparison. Do **not** copy the demo HTML wholesale into Astro.

## Where a new agent must start

1. `REFERENCE-V24.html` — **the exact self-contained interactive V24 prototype** (book, cycle, standalone; demo content; no backend authority).
2. `DECISIONS-V24.md` — locked UX, palette and ownership boundaries, what remains and what gets added.
3. `QA-V24.md` — reproduced defects, precise repairs and limits of testing.
4. `PRODUCT-ROLLOUT-V24.md` — staged, *additive* implementation contract and stop-ship list.
5. `NEXT-AGENT-V24.md` — a ready-to-use handoff; refresh Product HEAD/PR/CI before working.
6. `legacy/v22-final-reference.html` and `REFERENCE-V23.html` — retained historical states; these are not current visual authority.

Other canonical sources: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` (single ACTIVE verified work matrix); `DOC_MAP.md`; repository-level `AUDITREPO_OPERATING_MODEL.md` and `CONCURRENT_EDIT_PROTOCOL.md`. This prototype record is NOT another bug matrix or a replacement for Product truth.

## V24 change log relative to V23

- Corrected stale `V22` in the dynamically generated left overline to `V24`, along with the page title/version indicator.
- Smoothed **both** phases of the wide/compact crossfade (not only its final state). Keeps the existing elastic grid geometry and 335→68 px prototype measurements.
- On closing a subtree, if keyboard focus is inside, return it to the **exact controlling toggle before setting `inert`**.
- Arrow-key traversal ignores links in `[inert]`, `[hidden]`, and `[aria-hidden="true"]` ancestors while the visual close animation runs.
- Enter on a zero-match hidden/scope outline search no longer opens an unrelated first section. (Product search remains `GBSearch`.)

## Locked visual characteristics

- On desktop: one integrated page, left collapsible TOC + article text, **not a separate TOC modal**.
- Thin precise active strip (2 px, 6 px top/bottom inset), filled small dots, at most one carefully terminated 1 px connector between root peer headings; **no deep H3/H4 connector forest**.
- Header monogram is simply **GB** in typography, no heraldic lines/square borders.
- The four canonical real actions stay **VERTICAL at upper right**: theme, search, playback/speed, bookmark. Do not add a horizontal replacement toolbar.
- Series palettes remain independent of Reader Day/Sepia/Night; Gill historical leather INTRO/REFERENCE ornaments use official `GillLeatherRibbon/GillLeatherDefs` when integrated.
- Popovers open near the actual trigger. Do not introduce another overlay, search, save or audio owner.
- Mobile Product remains unchanged; narrow viewport in this HTML is only a visual stress fixture, not a mobile replacement.

## Implementation status at recorded snapshot

Product `main@717efc54772edf4224f44254651c102e2af24129` includes merged library V3 PR #2283. As observed during this pass, 29 push workflows successful, 1 still in progress (Deploy to GitHub Pages), 7 skipped and 1 cancelled. These counts are **one timestamped observation**, not a standing CI/deploy certificate. Recheck before Product edits; never say library V3 is unmerged or published solely based on this note. Independent print PR #2269 remains open. Product code and production were not modified by this AuditRepo package.

## Explicit next gate

A human-readable V24 screenshot or zero-error standalone Chromium run is *not* a greenlight for rollout. Product pilot requires source/head/CI/live identity, old-vs-new real-route screenshots, WebKit/Firefox, reader-axis/anchor and library V3 regression checks, and a feature-flag rollback. See `PRODUCT-ROLLOUT-V24.md`.