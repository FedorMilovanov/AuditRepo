# FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
**PremiumControls / Floating Cluster — Protected Subsystem Truths & Forbids**
**Date:** 2026-06-27 (post RASSINKHRON + 8-screenshot bugs)
**Source of truth:** gb-floating-cluster-probe-v16.html + owner instructions + VR history

## Core Truths (never violate)
- Roman numerals **MUST** use `<RomanNumeral value="II" />` (src/components/ui/floating-cluster/RomanNumeral.astro) → renders `<span class="gb-roman">` (css/floating-cluster.css:2012).
  - Gold italic serif, --color-accent-gold.
  - Applies to: all Gill rails, series TOCs, part TOCs, sheets, bbars.
- Hermeneutics floater position (breadcrumb-level, not top-right):
  ```css
  .gb-floater--hermeneutics {
    top: calc(clamp(24px, 3.5vw, 44px) - 4px);
    right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
  }
  ```
  (floating-cluster.css:39; matches legacy .theme-toggle).
- All PremiumControls scoped with `data-fc-root` or `data-fc-controls="gill-rail"`.
- Controller (js/floating-cluster-controller.js — 1051 lines) handles TTS chunking, speed morph, gb:tts-rate-change, favorites, keyboard, Gill/GBS2 init.
- No double CSS delivery (PC-004).
- 4 archetypes supported (single, series-lite, series-rich, Nagornaya special).
- Visual parity + rollout-audit (28/28 + PC-007) is blocking gate.

## Explicit Forbids (high-regression history)
**DO NOT (without owner + full visual gate + 14-day freeze):**
- Change any calc/position/top/right on `.gb-floater`, `.gb-floater--hermeneutics`, `.gb-floater--series-lite`.
- Touch speed panel morph, viewport guard, tab trap, stagger, pill sizes (360-390px mobile).
- Edit floating-cluster.css sizes, icon 40px, ember ring, or add new rules for .gb-roman / .gb-icon.
- Introduce new CSS/JS files for controls (use existing only).
- Split or refactor floating-cluster-controller.js without dedicated lane.
- Allow raw `<div class="...__num">I</div>` or hardcoded romans in any Gill context / part / sheet (closes "самодел колхоз").
- Apply legacy gbs2-rail / gbs2-sheet bleed to gill-context pages (Part 1+ must stay v16).
- Override data-fc-* scoping or fc-single-active / fc-series-active.
- Change Play/Save (36px transparent, no white circle — R9 revert history).
- Break TTS click path, chunking, rate change, or favorites separate path.
- Touch Nagornaya special variant without its own visual audit.
- Change controller init for Gill rail (initGillRail that iterates ALL containers).

**Regressions that already happened (verbatim history):**
- VR-07: Gill huge icons.
- VR-01: position override.
- VR-02: footer stretched space-between.
- R9 revert: restore transparent Play/Save 36px.
- fc-single-active races, TTS dead paths, speed panel not opening on Gill rail.
- Mobile pill layout breakage.
- Part 1 Gill stayed on legacy gbs2-rail (vertical header "ДЖОН ГИЛЛ..." by letter, GILL-A/B/C/D/E).

**Screenshot bugs 2026-06-27 (documented, only low-risk roman closed):**
- Mobile Gill TOC: self-made roman pills (fixed).
- Hermeneutics: "старое близкое расстояние" (POS-01 not applied — FROZEN).
- Gill context "Исторический контекст": weird top block + rail collapse (legacy bleed suspected — FROZEN pending owner lane).
- Blue romans (#1f4ea3) instead of gold.
- gbs2-thumb mini-pics live in Part 1.

## Low-risk allowed (with FAST gates only)
- Enforce `<RomanNumeral>` + update PC-007 guard (done).
- Add smoke assertions to rollout-audit.
- Document + freeze in reports/AGENTS.md.
- Run `node scripts/premium-controls-rollout-audit.js --build` after any change.

## Audit & Gates
- scripts/premium-controls-rollout-audit.js (PC-006 + PC-007)
- npm run strangler:build:production-like + rollout-audit (blocking)
- visual-parity on Gill + Herm (gill-context-visual-parity-audit etc.)
- 10-14 day freeze after sign-off on positioning/sizes.

**Owner note (verbatim):** "PremiumControls и т п не доделано... углублись в него еще серьезно... много регрессий было, пришлось откатывать снова... будь аккуратен"

**Next higher-risk only after explicit owner approval + lane declaration.**

See also:
- AGENTS.md §3.10
- audit/PREMIUMCONTROLS_DEEP_DIVE_2026-06-27.md
- audit/RASSINKHRON_GILL_HERMENEUTICS_VISUAL_BUGS_2026-06-27.md
- css/floating-cluster.css:39,2012
- js/floating-cluster-controller.js (1051 lines)
- src/components/ui/floating-cluster/RomanNumeral.astro
