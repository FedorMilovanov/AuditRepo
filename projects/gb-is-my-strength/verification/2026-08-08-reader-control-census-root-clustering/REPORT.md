# Reader-control census root clustering

Date: 2026-08-08
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit source PR: `#1212`
Audit source SHA: `b48982428042df07c8a621bff40b64cb39b61536`
Current Product anchor used for source-identity recheck: `11999f6d674e64e6afef590adeb71aeaaf303b3a`

## Artifact authority

Runtime Interactive run `31246241912` produced the audit-only artifact:

- artifact: `article-control-census-31246241912-1`
- artifact id: `9018812831`
- digest: `sha256:b63299fc6a173815914a87f04ce4a6836c1effc076ee2a31c4137956b85caf3a`
- routes: **55**
- scenes: **232**
- control observations: **7020**
- attempted clicks: **1068**
- raw issue manifestations: **887**

Raw kind counts:

- broken ARIA reference: 174
- Back authority drift: 174
- small control target: 207
- invalid list direct child: 103
- popup trigger missing `aria-controls`: 70
- click failed: 124
- footnote name not unique: 14
- menu label but no section links: 3
- control clipped: 6
- runtime errors: 12

The raw number 887 is **not** 887 independent Product defects. Fingerprinting reduces the static findings to a small number of shared source roots, and two dynamic categories are currently contaminated by the audit harness/environment itself.

## Current-main applicability

The three dominant shared source owners have identical blob SHAs on census source `b489824...` and current Product `main@11999f6d...`:

| file | blob SHA on census | blob SHA on current main |
|---|---|---|
| `src/components/article-pilots/gill-series/GillLearningSheet.astro` | `c7ce5b59e35a2d4e9342b2409e6bf22dc3b77dc3` | same |
| `src/components/article-pilots/gill-series/GillSeriesRail.astro` | `7afc39331ece9eb7314240ab54ff70fd443c8bbf` | same |
| `src/components/article-pilots/gill-series/GillSeriesMobileBar.astro` | `4da951bff07789484a96e4cff42d05d2c6c47121` | same |

Therefore the static roots below remain current-main applicable despite later S12/Source-trigger merges.

---

## Root cluster 1 — conditional quiz panel orphan

Raw manifestations: **174** across **42 routes**.

Every single broken-reference finding is identical:

- owner: `panelQuiz`
- attribute: `aria-labelledby`
- target id: `tabQuiz`
- target missing

Source root is exact and local in `GillLearningSheet.astro`:

- `tabQuiz` is rendered only under `{hasQuiz && ...}`;
- `panelQuiz role="tabpanel" aria-labelledby="tabQuiz"` is rendered unconditionally.

When a series config has no quiz, the label control disappears but the panel survives with a dangling ARIA reference. The repair boundary is one shared conditional DOM owner: render the quiz panel under the same `hasQuiz` condition (or provide another truthful label, if the panel intentionally remains). Do not repair 42 routes individually.

This is a current direct accessibility/DOM defect, not audit noise.

---

## Root cluster 2 — mobile Back hard-code

Raw manifestations: **174** across **42 routes**.

Only four target-pair fingerprints exist:

- series Back `/hard-texts/` vs mobile Back `/biografii/` — 96 manifestations;
- series Back `/baptisty-rossii/` vs mobile Back `/biografii/` — 42;
- series Back `/hard-texts/genesis-6/` vs mobile Back `/biografii/` — 26;
- series Back `/pastor-series/` vs mobile Back `/biografii/` — 10.

Source root is `GillSeriesMobileBar.astro`, which is reused through `SeriesReaderChrome` by Gill, Heart/Hard-texts, Baptist and other series configs. Current main hard-codes:

`data-home-href="../../biografii/"`

while the desktop rail already uses `config.railBackHref`.

Product `#1240` is the correct bounded owner: its patch replaces the mobile hard-code with `data-home-href={config.railBackHref}` and adds a permanent regression contract. Therefore the 174 manifestations are already assigned to `#1240`; no second Back lane is needed.

`#1240` still requires current-main refresh and exact-head green before merge authorization.

---

## Root cluster 3 — minimum control hit areas

Raw manifestations: **207**, but only three fingerprints:

| control | manifestations | observed box | source family |
|---|---:|---:|---|
| `#mobSpdBadge.mobile-spdbadge` | 100 | `23×16` | shared series mobile bar |
| `#gbsTocToggle.gbs2-toch-toggle` | 100 | `22×22` | shared series rail |
| `#hmSpdBadge.hm-spdbadge` | 7 | `20.3×13` | standalone/Hermenevtika reader |

The census threshold is `<24px` for interactable non-specialized controls, so these are deterministic geometry findings, not click-sequence artifacts.

Do not spread them across routes. A later bounded reader target-size lane can fix the shared selectors/owners and add 390/412 + desktop hit-area contracts. Because `#1240` currently touches `GillSeriesMobileBar.astro`, avoid colliding with it before that owner is resolved.

---

## Root cluster 4 — invalid direct children of lists

Raw manifestations: **103**, only two fingerprints:

- **100×** `SPAN.gbs2-track` directly under `UL.gbs2-toc`;
- **3×** `SPAN.hrail-track` in the standalone rail family.

The dominant source is directly visible in current `GillSeriesRail.astro`: a decorative `<span class="gbs2-track">` is intentionally placed as a direct child of `<ul class="gbs2-toc">` before the `<li>` rows. The historical geometry comment explains the visual reason but does not make the HTML content model valid.

Repair at the two shared rail owners, preserving the line/dot geometry while making list children structurally valid (for example a valid list child or a non-list/pseudo-element presentation owner). Do not mutate every rendered route.

This is a direct current semantic defect.

---

## Root cluster 5 — popup relation coverage

Raw manifestations: **70**.

Fingerprints:

- `hMobileMenuBtn`: 52
- `barSectionBtn`: 6
- `hmBottomBtn`: 3
- `hmSectionBtn`: 3
- `hmSettingsBtn`: 3
- `hrailSettingsBtn`: 3

Product `#1246` explicitly binds relation state for:

- `#hMobileMenuBtn → #hMobileNav`;
- `#hmBottomBtn/#hmSectionBtn → #hmSheet`;
- `#hmSettingsBtn/#hrailSettingsBtn/#gbFcSettings → #hmSettings`;
- plus existing Part/Series TOC and Gill learning/settings surfaces.

Thus `#1246` covers **64/70 raw missing-aria-controls manifestations** from this census. The six remaining manifestations are all Nagornaya `#barSectionBtn`, across the five Nagornaya parts/repeated browser scene.

Do not widen `#1246` into Nagornaya. Keep its relation-state slice bounded; a separate Nagornaya control-relation repair can address `barSectionBtn` if current-head revalidation confirms it after `#1246` merges.

---

## Root cluster 6 — footnote accessible-name uniqueness

Raw issue manifestations: **14**, but only **3 routes**:

- Hermenevtika: 114 footnote markers per affected scene;
- `kod-da-vinchi`: 21;
- `krajne-li-isporcheno-serdce`: 40.

The markers expose the same accessible name `Показать сноску` despite distinct ordinals/targets. This is a shared footnote semantics/root-owner problem, not 14 route defects and not hundreds of individual marker defects.

Before Product mutation, identify the canonical NoteRegistry/footnote marker owner and make the accessible name unique while preserving the existing target relation and visible ordinal. Re-run the three routes in Chromium + representative WebKit.

---

## Root cluster 7 — site-menu label overclaims the opened surface

Raw manifestations: **3** on only **2 routes** (Hermenevtika and `kod-da-vinchi`, desktop representative scenes).

The rail control is named `Поиск и разделы сайта`, but the command palette evidence contains only zero/one direct internal section links. Screenshot evidence confirms the surface is a search/content palette with filters/results, not a site-sections menu.

This is a low-severity semantic-label mismatch. The safest repair is likely truthful control wording rather than injecting unrelated navigation into Search, but source-owner inspection should precede mutation.

---

## Root cluster 8 — Nagornaya share control clipped at 390

Raw manifestations: **6**, all the same control:

- `#barShareBtn.bar-icon-btn`
- `44×44`
- five Nagornaya parts in Chromium 390 plus WebKit representative

Screenshot evidence shows the rightmost share icon/control crossing the viewport edge. This is a real mobile layout defect, independent of click sequencing.

Repair should stay in the Nagornaya bottom-bar/layout owner and prove the full 390/412 action row remains in viewport without shrinking required hit areas.

---

## Dynamic findings that are NOT yet valid Product defects

### 124 `click-failed` manifestations are state-contaminated

The census says it clicks each visible control, but `reset()` only sends Escape twice and reloads the route **only if navigation changed the pathname**. Otherwise every click is performed on the same already-mutated document/context.

The failure fingerprints are dominated by:

- `mobPartTocBtn`: 49
- theme toggle: 49
- mobile Save: 18
- quiz launch: 2
- mobile Back: 2
- Learning: 2
- Hermenevtika Back: 1
- one FAQ accordion: 1

The sequence evidence proves contamination. In Chromium mobile scenes with `mobPartTocBtn` failure:

- **46/46** failures occur immediately after the Save attempt;
- Theme then also fails;
- the later Settings control succeeds again in **46/46** of those same scenes.

A control tested after Learning/Save/transient UI is therefore not an independent witness. `stable-control-not-interactable` can also be caused by prior control state, and the 2.5 s timeout itself changes timing before later controls.

Required guard-health repair before treating click failures as Product regressions:

1. fresh page/context (or provably complete state reset) per clicked control;
2. re-snapshot/bind the control after reset;
3. clear transient overlays/toasts/storage side effects deterministically;
4. preserve browser/view identity;
5. rerun and only promote failures that reproduce independently.

Until then, **do not create Product bug rows from the 124 click-failed manifestations**.

### 12 `runtime-errors` manifestations are audit-origin contaminated

Most logged messages are:

- WebKit: `Viewport argument key "interactive-widget" not recognized and ignored.`
- CSP refusal for absolute `https://gospod-bog.ru/manifest.json`.

The audit serves pages from `http://127.0.0.1:8080`, while PageHead declares `default-src 'self'` and an absolute production manifest URL. In the audit environment, `https://gospod-bog.ru` is therefore cross-origin relative to `self`; in production it is same-origin. The local CSP refusal is not a valid production defect witness.

The WebKit viewport message is an unsupported-directive compatibility warning/noise, not proof of a broken reader control. One Hermenevtika `PAGE_ERROR: TypeError: Load failed` remains unresolved but is embedded in the same external-request-intercepted/local-origin environment and requires isolated reproduction before Product promotion.

Required census repair: classify known local-origin/WebKit environment noise and/or run a production-origin-equivalent context. Do not promote these 12 raw manifestations as Product runtime defects yet.

---

## Recommended bounded merge/decomposition order

1. Finish/refresh `#1240` — removes the shared mobile Back hard-code root (174 manifestations).
2. Finish/refresh `#1246` — relation-state owner (64 of 70 missing-control manifestations).
3. Repair `GillLearningSheet` conditional quiz panel/tab ownership — one file + permanent adversarial `hasQuiz=false` contract.
4. Repair reader list structure (`gbs2-track`, then standalone `hrail-track`) without changing visual rail geometry.
5. Repair shared hit areas after `#1240` releases `GillSeriesMobileBar`.
6. Separate Nagornaya relation/clipping slice (`barSectionBtn` + `barShareBtn`) only if source ownership/collision allows a coherent bounded fix.
7. Identify canonical footnote marker owner and fix unique accessible names on the three affected routes.
8. Fix the census click isolation/runtime-noise policy, then rerun before promoting any dynamic click/runtime roots.

The system root remains `SYS-READER-CONTROL-SEMANTICS`; these clusters are decomposition evidence, not new top-level MASTER rows.
