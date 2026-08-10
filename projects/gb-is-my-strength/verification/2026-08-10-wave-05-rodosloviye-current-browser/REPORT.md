# Verification — Wave 05 `/rodosloviye/` current browser defects

Date: 2026-08-10
Disposition: two `CONFIRMED-CURRENT` direct defects; one geometry residual held outside MASTER pending reachability verification; one accessibility candidate held outside MASTER; reduced-motion concern disproved.

## Current authority

- Product: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published release witness: deploy run `31379283849`, release candidate artifact `9059689652` (`pages-release-candidate-31379283849-1`), release/control-plane SHA both `29770e1...`.
- Raw evidence:
  - `../../incoming/chatgpt/2026-08-10/WAVE-05-RODOSLOVIYE-EXACT-RELEASE-BROWSER-AUDIT.md`
  - `../../incoming/chatgpt/2026-08-10/WAVE-05-RODOSLOVIYE-EXACT-RELEASE-BROWSER-EVIDENCE.json`

No Product issue/PR or AuditRepo row matching `rodosloviye`, `genealogy`, `fitView`, `SplitView` or `родословие` was found in the pre-promotion deduplication pass.

## V05-ROD-VIEWPORT — CONFIRMED-CURRENT

### User-visible failure

The interactive genealogy mounts 143 ReactFlow person nodes but its initial viewport contains zero visible person cards at both 390×844 and 1440×1000, with the same visually empty state captured across 320/390/768/1024/1440. Waiting 2.3 s does not settle into a useful view.

Canonical ReactFlow `Fit View` also leaves zero visible person nodes. It reaches scale 0.5 and further Zoom Out cannot recover the graph. The local genealogy search proves the nodes are present and functional: searching `Адам` centers the graph and produces visible people.

### Independent source mechanism

`src/components/genealogy/layout.ts` mixes:

1. explicit AM Y coordinates in a 0..4200 span for people with `birthAM`; and
2. Dagre rank Y for people without `birthAM`.

`GenealogyTree.tsx` then constrains fit/zoom to 0.55/0.5 minimum. The combined sparse envelope is larger than the useful fit range and centers the initial viewport on empty graph space.

### Why green CI does not disprove it

The deep `Runtime Interactive Audit` trigger/scope omits `src/components/genealogy/**` and `src/pages/rodosloviye/**`, and its route-specific interaction cases do not exercise genealogy Fit View or initial visible-node count. General route breadth checks can pass status/H1/overflow while all 143 semantic nodes sit outside the useful viewport.

### Required terminal outcome

A bounded genealogy viewport/layout repair must establish a stable world-coordinate contract and an initial/Fit View state with a meaningfully visible canonical person set at narrow mobile and desktop widths, without relying on an accidental search/tour recovery action. Permanent Chromium + WebKit route-specific browser guard required.

## V05-ROD-SPLIT-A11Y — CONFIRMED-CURRENT

### User-visible failure

The full-canvas `⇆ Мф/Лк` comparison behaves visually as an overlay, but exact current candidate browser interaction shows:

- focus remains on the underlying opener after open;
- Tab moves to the underlying `🎬 Тур` control rather than into the comparison;
- underlying controls remain keyboard reachable behind the covering surface;
- Escape does not close the comparison;
- explicit close removes it but focus falls to `BODY` rather than returning to the opener.

This reproduced at every exercised width: 320, 390, 768, 1024 and 1440.

### Independent source mechanism

`SplitView.tsx` uses an absolute `inset:0` layer with `role="complementary"` and no focus-entry/containment/restore lifecycle. `GenealogyTree.tsx` keyboard handler explicitly returns when `showSplit` is true, bypassing its Escape branch while the comparison is open.

### Required terminal outcome

Give the comparison truthful overlay/dialog semantics and lifecycle appropriate to its full-canvas behavior: focus enters the surface, hidden-underlay controls are not the next Tab targets, Escape dismisses, and close restores focus to the opener. Permanent keyboard browser guard required at mobile and desktop; WebKit should be included.

## Held outside MASTER

### Host/app height + controls reachability

Current source uses an 85vh/min-650 host while the React child uses 100dvh. Natural max-scroll evidence shows ReactFlow controls/minimap can remain substantially below the viewport; at 390 only a small part is visible and at 1440 the Controls are below the viewport in the settled natural state. A fixed TTS strip can also overlap the visible MiniMap strip on narrow mobile.

This is real current geometry evidence, but actionability experiments can cause route repositioning and alternative graph gestures/search exist. Reverify with an explicit human-reachability contract before deciding whether this is a separate direct defect or absorbed by the viewport/layout repair.

### DetailPanel focus

The complementary DetailPanel opens without focus entry and Tab continues among graph nodes, but Escape closes it. Because the current semantic contract is complementary/non-modal, require an accessibility-tree/AT decision before calling it mandatory work.

## False-positive closure

### Reduced motion

Do not open a genealogy reduced-motion bug. Exact current candidate under `prefers-reduced-motion: reduce` computes maximum animation and transition durations of 0s, including SplitView fade. Current global mobile-hotfix reduced-motion rules suppress the source-declared pulse/dash/fade motion.

## Product mutation

None. This verification only changes AuditRepo classification based on current evidence.
