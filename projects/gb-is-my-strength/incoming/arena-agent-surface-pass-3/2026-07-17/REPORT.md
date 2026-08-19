# Agent Audit Report — Baptist light-theme contrast pass

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-surface-pass-3`
- Date: `2026-07-17`
- Product ref/SHA: `main` at `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Build/runtime: production-like dist + live Chromium
- Viewport/theme: `390×844`, default light theme
- Scope: `/baptisty-rossii/` landing and generated mobile fallback controls
- Explicit exclusions: data-consistency and PR #337 findings
- Signal class: Product accessibility/visual runtime
- Proof state: FAIL for two bounded contrast contracts
- Claim boundary: exact source + current generated artifact + live rendered colors at observation time
- Semantic owners: Samizdat theme tokens, landing card typography, mobile fallback clone/presentation
- Overlap: inspect current CSS/mobile-control PR files immediately before Product mutation

---

## 1. New findings

### `BAPTISTY-MOBILE-FALLBACK-CONTROL-CONTRAST`

- Kind: accessibility/runtime defect; suggested severity `P2 / medium`
- Route/state: `/baptisty-rossii/`, mobile default light theme
- Expected: visible font/theme/search/play controls meet WCAG AA text/icon contrast against the fallback pill
- Actual: runtime clones controls styled for the dark rail into a light fallback panel. Rail text token `--gbs2-rtext:#e7dff0` remains on `rgba(253,252,249,.94)`; axe measures `A−` and `A+` at **1.26:1**, expected 4.5:1
- Source mechanism:
  - `js/floating-cluster-controller.js:1284-1295` clones scoped rail controls and adds `.gb-mobile-fallback-controls`;
  - `css/floating-cluster.css:2895-2917` forces a nearly white mobile panel;
  - `css/floating-cluster.css:2929-2942` sizes cloned controls but does not reset their rail foreground;
  - `css/series-samizdat.css:25` owns the light lavender rail text token.
- Live Chromium: fallback controls are visible; theme/font/search/share controls compute `rgb(231,223,240)` over a translucent near-white control/panel. Live axe reports two text controls at 1.26:1; the same inheritance affects the other pale glyph controls.
- Confidence: high (source + runtime owner + generated artifact + live computed style + live axe)

### `BAPTISTY-LANDING-TEXT-CONTRAST`

- Kind: accessibility/theme defect; suggested severity `P2 / medium`
- Route/state: `/baptisty-rossii/`, default light Samizdat theme
- Expected: reader-facing body/card metadata meet 4.5:1 for normal-sized text
- Actual: live axe reports **26 non-control text nodes** below AA:
  - 10 card kickers at `3.41:1` (`#5d7cb3` on `#efe7d7`, 9px bold);
  - 10 card abstracts at `3.9:1` (`#78716c` on `#efe7d7`, 12.5px);
  - article description/byline/time nodes at `4.39:1` (`#6a6a6a` on `#efe7d7`).
- Root: Samizdat changes the page canvas to newspaper paper `#efe7d7` but inherited global/partially transparent metadata colors were not requalified against that canvas
- Breadth: hero metadata plus all ten article cards; not a single isolated string
- Confidence: high (live 200 response + computed colors + axe + exact theme source)

Evidence: `evidence/live-baptisty-axe.json`, `evidence/live-fallback-control-census.json`, `evidence/source-anchors.md`.

---

## 2. Confirmations and extensions

1. `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-visual-parity-fixed-914c7fb.md` validly closes geometry/parity drift and reports PremiumControls checks green. This pass adds an orthogonal responsive color-state failure that pixel parity between two equally styled artifacts cannot reject. See `comments/comment-on-baptisty-visual-parity.md`.
2. `verification/2026-08-07-regression-baptists-wave2b/REPORT.md` correctly concludes no reader-content regression in its corpus. This pass does not challenge content truth; it adds current presentation/accessibility evidence. See `comments/comment-on-baptists-wave2b.md`.

---

## 3. Challenges and negative findings

- Do not classify the pale fallback controls as missing controls: they are present, named and clickable; the defect is effective foreground/background contrast.
- Do not classify the 26 landing nodes as 26 separate bugs; they are repeated theme-token manifestations.
- Dark-theme appearance does not invalidate the default light-theme failure.
- Visual parity does not prove WCAG contrast if source and target share the same bad colors.
- The slight 4.39 failures alone would be low-value polish, but the same theme surface also has repeated 3.41/3.9 failures; the class is admitted on breadth and actual small text.
- Previously observed Gill/Atlas/tooltip findings are outside this package.

---

## 4. Duplicate and root-cause clusters

- Keep two work units:
  1. runtime fallback control foreground ownership;
  2. landing metadata/card theme-token contrast.
- They may share one Samizdat/light-theme implementation lane but require separate acceptance predicates.
- Do not merge with generic mobile registry coverage: the controls mount correctly.
- Do not merge with missing button type: controls have native button semantics.

---

## 5. Severity and value assessment

| Finding | Severity proposal | Impact | Cost |
|---|---:|---|---:|
| Mobile fallback control contrast | P2 | Primary mobile reading controls are nearly invisible in default light theme | low |
| Landing text contrast | P2 | Repeated small metadata/summary text across the whole series landing is hard to read | low-medium |

No P0/P1 claim: interactions still execute, and no security/data/release failure is shown.

---

## 6. Suggested verification and repair lanes

### Shared Samizdat contrast lane

- Recheck current CSS/control owner and competing PRs.
- Give fallback controls explicit light/dark effective foreground/background tokens rather than inheriting dark-rail color.
- Requalify landing description/byline/card kicker/card abstract colors against `#efe7d7` while preserving the Samizdat visual identity.
- Test effective rendered colors, not token names alone.
- Verify mobile and desktop, light/dark, Chromium and WebKit; retain focus/hover/pressed contrast.
- Acceptance: axe color-contrast has zero nodes for the two admitted selector families; existing visual parity and PremiumControls behavior remain green.

Proposals: `proposals/proposal-baptisty-fallback-control-contrast.md` and `proposals/proposal-baptisty-landing-contrast.md`.

---

## 7. Reverify results

- Product anchor remains `cb3681e`; live landing metadata/text matches production-like artifact.
- Live `/baptisty-rossii/` returned HTTP 200.
- Live axe reproduced 28 total contrast nodes: 26 landing text nodes and 2 fallback font controls.
- Runtime census confirmed the fallback panel and inherited pale rail foreground on visible mobile controls.
- Existing AuditRepo MASTER/incoming/verification searches found no canonical current finding for these exact selectors/ratios/mechanisms.
- AuditRepo validation is run after package assembly.

---

## 8. Notes for verifier

- Independently reproduce with fresh storage/default light theme at `390×844`.
- Inspect both effective blended background and foreground; translucent panel/button layers matter.
- Preserve two findings but permit one implementation lane.
- Do not accept only a dark-theme screenshot.
- Ensure hover/focus/pressed states and icon-only controls also meet applicable non-text/text contrast.
- Suggested disposition after reproduction: two `current-local / accessibility / P2` rows, then same-wave closure after live browser/axe evidence.
- Provisional synthesis: `VERIFIER_SYNTHESIS.md`.
