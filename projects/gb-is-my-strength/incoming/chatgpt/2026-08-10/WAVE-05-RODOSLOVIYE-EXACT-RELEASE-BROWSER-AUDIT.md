# WAVE 05 — `/rodosloviye/` exact-release browser audit

Date: 2026-08-10
Agent: ChatGPT
Status: raw current evidence; Product untouched

## Anchors

- Product current main at recheck: `29770e1c7a99478ce7dc2a01abec206ac1daa69b` (`fix(hermenevtika): align canonical original-work title (#1545)`).
- The genealogy surface is unchanged between prior audited anchor `9156ccb714acbf1a1ba5eef4d0972abd4a7bf83f` and current `29770e1...`; the intervening diffs are Source Authority control-plane changes plus Hermenevtika content/manifests.
- Current deployment witness for Product `29770e1...`: deploy run `31379283849`, release-candidate artifact `pages-release-candidate-31379283849-1`, artifact id `9059689652`, 1,178 files / 86,924,625 candidate bytes; release SHA and control-plane SHA are both `29770e1...`.
- AuditRepo head immediately before this intake: `96472dc28a7bdfed9af75428a2583593cf757f38`.

## Environment and evidence boundary

Direct DNS/origin navigation from the audit container is blocked. To avoid claiming a browser witness that did not happen, the current deployed release-candidate ZIP was downloaded from the exact `29770e1...` deployment run and its already-built `/rodosloviye/` HTML, `_astro` modules, CSS and fonts were used as the browser payload.

The container also blocks loopback/file origins. For browser execution only, the same built modules/styles/fonts were embedded into an audit-only document and the candidate Astro island module references were rebound to data URLs. Product JS/CSS/content logic was not edited. CSP/origin transport was therefore the only substituted boundary. The production `GenealogyTree` React island hydrated successfully with 143 ReactFlow person nodes. Chromium was exercised with real DOM focus, keyboard and pointer interactions on this candidate bundle. Screenshots and machine state were captured locally; durable numeric evidence is copied into the adjacent JSON intake file.

A local-storage exception caused by the opaque audit document was excluded as environment noise and is not a Product claim.

## NEW CURRENT FINDING A — initial genealogy viewport contains zero people

Classification: `CONFIRMED-CURRENT` reader-visible route defect.
Suggested severity: P2.
Confidence: high.

The route’s main interactive purpose is a family tree, but after hydration the initial ReactFlow viewport contains **zero visible person nodes**.

Exact candidate browser state:

- `390×844`: 143 person nodes are mounted; initial visible nodes = `0`; after 2.3 s = `0`.
  - initial transform: `translate(-1234.25px, -3462.1px) scale(0.55)`;
  - node rendered vertical envelope: about `-3334 .. +4434 px` relative to viewport.
- `1440×1000`: 143 person nodes are mounted; initial visible nodes = `0`; after 2.3 s = `0`.
  - initial transform: `translate(-709.25px, -3384.1px) scale(0.55)`;
  - node rendered vertical envelope: about `-3233 .. +4535 px`.
- The same empty-person visual state was captured at 320, 390, 768, 1024 and 1440 widths: the toolbar/legend/edges render against a largely empty dark canvas while person cards are outside the viewport.

The canonical ReactFlow `Fit View` does not recover the route:

- `390×844` after Fit View: scale reaches the route minimum `0.5`, visible nodes remain `0`.
- `1440×1000` after Fit View: scale `0.5`, visible nodes remain `0`.
- eight further Zoom Out activations cannot go below `0.5`; visible nodes remain `0`.

The app is not dead. Typing `Адам` into the genealogy-local search centers a real node:

- 390: visible nodes become 4 (`adam`, `eve`, `cain`, `abel`);
- 1440: visible nodes become 10.

### Bounded mechanism

Current `layout.ts` mixes two incompatible vertical coordinate systems in the same graph:

- dated people receive `yForAM()` in a hard 0..4200 AM span (`Y_SPAN = 4200`);
- people without `birthAM` keep their Dagre rank Y (`yAM ?? dagreY`).

The combined graph therefore has a very large sparse bounding envelope. `GenealogyTree` then uses `fitView` with `fitViewOptions.minZoom = 0.55` while the global ReactFlow minimum is `0.5`; the canvas cannot zoom far enough to make that mixed envelope useful and centers on an empty region.

This is stronger than a design preference: the primary interactive visualization initially shows none of its 143 mounted entities and the built-in Fit View cannot repair it.

## NEW CURRENT FINDING B — fullscreen Matthew/Luke comparison has broken focus/Escape lifecycle

Classification: `CONFIRMED-CURRENT` accessibility/usability defect.
Suggested severity: P2.
Confidence: high.

Opening `⇆ Мф/Лк` creates a full-canvas, visually modal comparison layer, but the exact candidate interaction behaves as follows at every tested width 320/390/768/1024/1440:

1. focus starts on the `⇆ Мф/Лк` opener;
2. after the overlay opens, focus remains on that now-covered underlying opener;
3. the overlay itself has one focusable close button, while many underlying controls remain keyboard reachable;
4. pressing Tab advances to the underlying `🎬 Тур` button instead of the overlay close button/content;
5. pressing Escape does **not** close the comparison;
6. clicking the comparison close button removes the layer, but focus falls to `BODY` instead of returning to the opener.

Source independently explains the browser result:

- `SplitView.tsx` renders the full inset layer as `role="complementary"`, with no focus entry/trap/restore lifecycle;
- `GenealogyTree.tsx` global keyboard handler begins with `if (showSplit || !activeId) return;`, so Escape handling is explicitly bypassed while SplitView is open.

This is not merely missing ARIA polish: keyboard users can tab into controls visually hidden behind the full-screen comparison and cannot dismiss the layer with Escape.

## NEW CURRENT FINDING C — host/app height disagreement clips ReactFlow controls at natural max scroll

Classification: `CONFIRMED-CURRENT` geometry defect; severity needs verification against intended control availability.
Suggested severity: P2/P3.
Confidence: medium-high.

The route host is `height: 85vh; min-height: 650px`, but `GenealogyTree` root is `height: 100dvh`. In a settled natural-scroll state (0.8–3.0 s), document scroll is already at its maximum while the React app continues below the host/document reach.

Representative exact-candidate settled geometry:

- `390×844`, max scroll `1060`:
  - host: y≈126.9, height≈717.4, bottom≈844.3;
  - ReactFlow child: y≈127.9, height=844, bottom≈971.9;
  - Controls: y≈836.9..956.9, so only a few pixels are inside the viewport;
  - MiniMap: y≈804.9..956.9, only its top strip is visible;
  - fixed TTS bar at y≈774..828 overlaps the visible MiniMap strip.
- `1440×1000`, max scroll `877`:
  - host bottom≈1000.3;
  - child bottom≈1151.3;
  - Controls y≈1016.3..1136.3 are entirely below viewport;
  - MiniMap y≈984.3..1136.3 shows only a narrow top strip.

The same host/child mismatch exists at 320, 768 and 1024. Playwright can sometimes reposition around an off-screen control when explicitly commanded to click it; that actionability behavior is not equivalent to a normal user being able to reach the controls at the page’s natural maximum scroll. This is why this finding is kept separate from the higher-confidence empty-canvas root.

## NEW CURRENT CANDIDATE — DetailPanel does not take focus

Classification: accessibility candidate, not promoted as a required bug in this intake.
Suggested severity: P3 if owner semantics require panel focus entry.

After a person node is activated, `DetailPanel` opens as an absolute right-side `role="complementary"` panel. Focus remains on the ReactFlow node; Tab advances to the next underlying node rather than the panel close button. Escape does close the panel. Because the source declares a complementary side panel rather than a modal dialog, a focused accessibility-tree/screen-reader witness should determine whether this becomes required work or stays optional polish.

## DISPROVED / DO NOT OPEN — reduced-motion concern

A source-only pass initially suggested genealogy pulse/dash/camera animations might ignore reduced motion. Exact candidate browser evidence disproves that as a current defect.

With browser `prefers-reduced-motion: reduce`:

- media query matches;
- maximum computed animation duration across the hydrated page is `0s`;
- maximum computed transition duration is `0s`;
- SplitView fade-in duration is also `0s`.

The production `mobile-hotfix.css` contains the global reduced-motion rule that zeroes animation/transition durations. Do not open a genealogy reduced-motion bug from the raw JSX animation declarations alone.

## CI blind spot explaining the green state

The current `Runtime Interactive Audit` workflow does not trigger on `src/components/genealogy/**` or `src/pages/rodosloviye/**`. Its deep route-specific interactive suite covers Home/articles/shared reader families, not genealogy SplitView/Fit View/focus lifecycle. A broader public-surface matrix can still pass status/H1/overflow/canonical checks while the 143 mounted genealogy nodes are all outside the useful viewport.

This means current green CI is compatible with findings A–C; it is not contradictory evidence that these interactions were tested and passed.

## Security/build-noise disposition retained from this marathon

`npm ci` on the current Astro-7.2 toolchain still emits the familiar 8-vulnerability count, but this intake does **not** call the public site vulnerable. Earlier dedicated exact-main inventory proved the then-current 8 advisories were transitive dev/build dependencies and `npm audit --omit=dev` was 0. A fresh production-only audit would be needed before changing that disposition for the current lockfile.

## Recommended verification / repair boundaries

Do not make one giant genealogy rewrite. Keep roots bounded:

1. initial/Fit View world-coordinate/zoom contract;
2. SplitView overlay focus/Escape lifecycle;
3. host/app viewport-height/control reachability;
4. DetailPanel semantics only if accessibility verification promotes it.

A permanent browser guard should use Chromium + WebKit where available, at least 390 and 1440, and assert semantic outcomes rather than screenshot color:

- after hydration, at least one canonical person node is meaningfully visible;
- Fit View produces a non-empty visible person set;
- SplitView receives focus, keeps keyboard navigation inside its intended surface, Escape closes, and focus returns to opener;
- built-in navigation controls remain reachable at natural page scroll limits;
- reduced-motion remains zero-duration.

## Limitations

- Direct production-origin navigation was unavailable from the container; browser execution used the exact published release-candidate bundle with an audit-only transport/CSP rebinding.
- WebKit binary was not installed in the local Playwright cache despite the Python Playwright package exposing a nominal path, so the exact bundle interaction proof in this intake is Chromium. Source evidence and the exact deployment witness are independent additional angles; a permanent Product guard should add WebKit.
- Local hydration timing is not a valid Web Vitals measurement and is not used as a performance defect claim.

## Mutation disposition

- Product: **not modified**.
- AuditRepo MASTER: **not modified in this intake**; current final-zero/cemetery lanes were active concurrently, so raw evidence is published first to avoid racing canonical verification state.
- Adjacent machine evidence: `WAVE-05-RODOSLOVIYE-EXACT-RELEASE-BROWSER-EVIDENCE.json`.
