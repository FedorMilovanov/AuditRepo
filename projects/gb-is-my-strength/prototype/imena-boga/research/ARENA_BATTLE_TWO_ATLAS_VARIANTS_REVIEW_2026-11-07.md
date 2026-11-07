# Arena Battle: comparison of two additional Atlas exports (2026-11-07)

Status: code reviewed; selective, gated transplant into the **existing** Atlas v1.3 of AuditRepo PR #538. These are **two variants of Atlas**, not a replacement Constellation. Preserve both independent flagships and their immutable references. Do not merge the Research #379 corpus or deploy to the production website.

## Intake and provenance

Two owner-supplied ZIPs were inspected by filename, archive membership, file hashes and source diffs; neither archive was rewritten or copied into AuditRepo. They are retained in the owner's file library.

| Input | ZIP size | SHA-256 | Internal members |
|---|---:|---|---:|
| `-1 (2).zip` (variant A) | 718115 bytes | `4705353622ee7240d93e935b5bb2d372afdf7603afa35d3ec547ecee9070ea67` | 29 |
| `-1 (3).zip` (variant B) | 702703 bytes | `c2b1427519dad3d9a52f07ef15b9d18b786ca84d3848da15a56dbc72ccb568d4` | 29 |

The two ZIPs share the same `public/og-imena-boga.jpg` bytes and much of the component tree. Variant A contains `App.tsx` 1830 lines, `SiteNavbar.tsx` 479 lines and CSS 499 lines; variant B contains 1744, 360 and 468 lines respectively. These source-size differences do not demonstrate better runtime performance. Neither ZIP supplies a reproducible browser-test result or any scientific/rights clearance.

## Review: accept, adapt, or hold

| Area | A vs B | Decision in canonical v1.3 |
|---|---|---|
| Reading settings | A: one compact settings panel (theme, font scale, share/print); B: wide top-bar controls | **ADAPT** to Atlas's existing handlers and prefixed localStorage. Preserve React focus/Escape/outside-click behavior, provide usable 320px width, keep progress/quick search; do not wholesale replace navbar |
| Browser chrome color | A: updates theme-color metadata when reader theme changes | **ADAPT**; v1.3 has three themes and a static meta tag; synchronize at runtime |
| Editorial method | A: new disclosure separating names/titles/images and editorial hermeneutics | **ADAPT WITH REWRITE**, distinguishing prototype records from verified divine names and stating Research #379's editorial HOLD; do not suggest BHS/NA28 collations have actually been completed |
| Position resume | A: protects bookmark against automatic scroll-restoration and updates active-name ref; B: older lifecycle | **PARTIAL**: v1.3 already stores numeric Y with separate namespaced key and explicit dismissal. Add real-user-scroll-intent guard; do **not** replace with incompatible ID-based storage or A's global namespace |
| Original text card | A: wrapping constraints and explicit Greek/Hebrew/Aramaic language tags | **ADAPT** at the plaque component only; avoid clipping or forcing every flex element in main to shrink |
| Colors and contrast | A: new accent-fill/on-accent variables and darker gold on light/sepia; B: original palette | **HOLD** for visual comparison plus measured WCAG contrast; avoid copying broad palette changes across the site without owner approval |
| Global overflow rules | A: page-wide `overflow-x:clip`, forced flex shrink, forced table widths | **REJECT** as generic masking; keep targeted card adjustments and check actual overflow at 320/390/768/1440 |
| Content | A: changed theological theses, named categories and a handful of claims; B: stronger unsupported 'canonical names' language | **HOLD** for Research #379 claim-level review. Avoid replacing the reviewed v1.3 source inventory or 36-entry data with unsourced Arena prose |
| Bundling | A: added `@axe-core/playwright`, `@playwright/test` and floating versions; B: fewer dependencies | **REJECT package overwrite**. Use the pinned existing Playwright browser QA and existing Vite/Fontsource versions |
| Astro integration | Both remain standalone Vite applications | **HOLD** until Product owner route/SEO/rights/editorial review; do not deploy or merge PR just because QA is green |

## Implementation boundaries and acceptance

Only the following canonical v1.3 files were targeted:

- `atlas/src/components/SiteNavbar.tsx`: responsive progressive-disclosure reader controls; keyboard and focus lifecycle
- `atlas/src/App.tsx`: theme-color metadata, reading-position dismissal intent, methodology/disclosure
- `atlas/src/components/DivineNameTiltCard.tsx`: narrow-width script plaque and original-language tagging
- `checks/browser.cjs`: functional Chrome/WebKit assertions for mobile/desktop preferences, theme-color update, font controls, Escape/focus restoration, geometry and editorial disclosure
- `source-manifest.json`: SHA-256 file integrity

Acceptance requires exact-HEAD Vite production builds, TypeScript, local-font/source contracts, all 16 cross-browser responsive scenarios, Constellation's 78-case regression suite, and controlled CLS checks. Record failures rather than suppressing real browser errors. AuditRepo PR #538 remains Draft; Research #379 remains separate and unapproved. Rights for Sinai image and real-device validation remain outstanding.

## Editorial caveat

Variant A uses confident references to critical editions and theological interpretations, but source appearance alone is **not** a completed textual collation. A disclaimer UI component is helpful, yet its wording must not convert unsourced linguistic claims into facts. Keep all research-stage entries behind the existing editorial gate.

## Independent acceptance of selective transplant

**Code witness:** commit `cd117df1fac5ec7707798c7f953c3c9b765d227a`, [GitHub Actions run 42400344040](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42400344040). All three workflows on the code commit passed: AuditRepo Validate, Workflow Preflight, and Names of God prototype browser QA.

- Both Vite production builds and TypeScript: **PASS**.
- Existing 45 CSS font imports and 11 local font licenses: **PASS**.
- Source, delivery, network failure, image, font contracts, and unique two-font preload contracts for both flagship builds: **PASS**.
- Responsive Chromium/WebKit browser QA: **8+8 scenarios PASS**, including the new reader settings panel, theme-color metadata, font scale, Escape/focus restoration, mobile geometry, and methodology disclosure.
- Full independent Constellation reader QA: **78/78 PASS**.
- Independent lab CLS medians after the transplant (Chromium CPU×4; n=3 each width): Atlas 320px **0.01911**, 390px **0.00230**, 768px **0.00921**, 1440px **0.00518**. Constellation 320px **0.00218**, 359px **0.00097**, 360px **0.00064**, 375px **0.00051**, 390px **0.00049**, 768px **0.00111**, 1440px **0.00035**. These are synthetic data, not field Core Web Vitals.

Two issues were found by CI and repaired rather than suppressed: an unused badge-icon import rejected by TypeScript; and a browser-dependent computed-font-size assumption in the new WebKit test (replaced by waiting for the React inline-size contract). Both Chromium and WebKit subsequently completed successfully.

### Color contrast follow-up from source comparison

Calculated WCAG contrast ratios from A/B source CSS (text on surface backgrounds):

| Color | Variant B | Variant A | Assessment |
|---|---:|---:|---|
| Gold text on light paper | `#b8936a` / `#ffffff`: **2.83:1** | `#855a2c` / `#ffffff`: **6.01:1** | A is substantially more readable for small text |
| Gold text on sepia paper | `#9e733b` / `#f9f3e7`: **3.82:1** | `#78501f` / `#f9f3e7`: **6.41:1** | A is better |
| Gold text on dark surface | `#d4a574` / `#171b23`: **7.75:1** | Same | No adjustment needed |

The source proof establishes a design-system opportunity but **not** a license to recolor every decorative gold ornament. The next visual-review candidate should introduce a distinct accessible `--gb-gold-ink` token for small foreground text while preserving original gold borders, lighting and effects. This was deliberately **not** silently applied across the flagships.

### Remaining gates

No real Android/iOS Safari and screen-reader witness, no screenshot-based owner comparison to approve any more visual palette changes, no permission to publish the original Sinai photo, no Research #379 critical-edition/source approval, and no Product Astro route integration. PR #538 stays Draft. No changes were made to the public website or Research repository.
