# RASSINKHRON + PREMIUMCONTROLS: Visual Regressions from Screenshots (2026-06-27)

**HEAD:** 49b83365 (post prior surgical report)  
**Focus:** User-reported bugs in attached screenshots (mobile TOC roman numerals, hermeneutics distance, Gill context "непонятный блок сверху", rail/TOC self-made styles).  
**Mode:** Surgical (хирург). Evidence-first. No new files unless allowed. Preserve visual contracts, gb-* scoping, rollout audit.

## 1. Evidence from Screenshots (verbatim observations)

Screenshots show 8 images (Gill mobile pills, series sheets, rail, TOC, hermeneutics floater, desktop article, Gill context page, etc.):

1. **Mobile Gill series TOC (gbs2-sheet)**: Roman numerals (II, III, IV, V) rendered as custom pill badges inside `.gbs2-sheet-part` / `.gbs2-sheet-parts`. Not using `<RomanNumeral>` component. "Самодел колхоз" styling (brown rounded badges, inconsistent with rail cards or canonical gb-roman).
2. **Hermeneutics floater**: `.gb-floater--hermeneutics` positioned "старое близкое расстояние" — too close to breadcrumb / content column (right edge overlap or insufficient offset).
3. **Gill context (Исторический контекст)**: "ЗАБАГОВАННАЯ ЧАСТЬ" + "непонятный блок сверху" — extra header-like block or duplicate mobile-head / rail overlap visible above main content.
4. **Rail cards + TOC items**: Hardcoded `<div class="gbs-rail-card__num">I/II/III...</div>` and `.toc-item__num`. Styled via `[data-gill-v16] .gbs-rail-card__num` / `.toc-item__num` (italic gold serif). Mini-covers present and "на месте".
5. **Mobile bottom bar**: Uses `<RomanNumeral value="II" />` correctly in some places (GBS2 bbar), but series sheet + rail fall back to raw divs.
6. Positive: Mini pictures render; some progress rings visible.

These are **visual regressions** against:
- Canonical `RomanNumeral.astro` (simple `<span class="gb-roman">` + CSS).
- `FloatingCluster` + `GillRailControls` contract (data-fc-* scoping).
- Hermeneutics positioning contract (breadcrumb-level offset).
- Gill v16 full site plan (unified roman + no extra top blocks).

## 2. Root Cause Analysis (exact files + lines)

### Roman numerals — inconsistent implementation (P1 regression)
- **Reference component**: `src/components/ui/floating-cluster/RomanNumeral.astro` (194 bytes, just `<span class="gb-roman">`).
- **CSS**: `css/floating-cluster.css:2012` (`.gb-roman { font-family:var(--gb-font-serif-display); ... font-style:italic; }`).
- **Correct usage** (GBS2 bbar):
  - `src/components/article-pilots/gill-part1/GillPart1PageChrome.astro:79` — `<RomanNumeral value="II" />`
  - Same for part2 (III), part3 (IV), spravochnik (V).
- **Broken (self-made)**:
  - `src/components/article-pilots/gill-context/GillContextPageChrome.astro:36-40` (rail cards): hard `<div class="gbs-rail-card__num">II</div>`
  - Same file:94-96 (toc-item): hard `.toc-item__num`
  - GillPart1/2/3/Spravochnik chrome files: series sheet uses raw `<span><b>II · ...</b>` inside `.gbs2-sheet-part`.
- **CSS debt**: `[data-gill-v16] .gbs-rail-card__num`, `.toc-item__num`, `.gbs2-sheet-part` (lines ~789, 1049, 1074) duplicate roman logic instead of using `.gb-roman`.
- Result: "колхоз" on mobile TOC + rail; inconsistent hover/scale/gold across contexts. Matches user complaint exactly.

### Hermeneutics positioning (recurring VR-01 / position override regression)
- Component: `FloatingCluster.astro` + variant="hermeneutics" (in HermenevtikaBody.astro).
- CSS: `css/floating-cluster.css:39`
  ```css
  .gb-floater--hermeneutics {
    top: calc(clamp(24px, 3.5vw, 44px) - 4px);
    right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
  }
  ```
- Problem: "старое близкое расстояние" — the calc offset is insufficient on current viewport/content widths. Matches prior reports (VR-01 position override, breadcrumb-level).
- No `data-fc-root` scoping violation (audit still passes), but visual contract broken.

### Gill "Исторический контекст" extra top block
- Chrome: `GillContextPageChrome.astro` (lines 1-154).
  - Has explicit `<div class="gbs2-mobile-head">` + `<img>` + title + `<GillRailControls context="mobile">`.
  - Then `<div class="gbs2-world">` + rail + page-wrap.
- "Непонятный блок сверху": likely the `gbs2-mobile-head` + rail-foot duplication or overlay bleed on context page (only context uses this chrome pattern without full GBS2 shell).
- Rail cards + mobile bbar render on top of main content in narrow viewports.
- Matches "ЗАБАГОВАННАЯ ЧАСТЬ ИСТОРИЧЕСКИЙ КОНТЕКСТ".

### Other related debt
- Mobile pill (360-390px): speed panel + roman in bbar.
- Series sheet tabs/parts: hardcoded numbers instead of component.
- No enforcement of `RomanNumeral` in rollout-audit or gill guards.

## 3. Current Gates Status (targeted)

- `premium-controls-rollout-audit.js`: still 28/28 PASS (scoping, controller, no double CSS).
- But **visual parity** broken on:
  - `/articles/dzhon-gill-istoricheskiy-kontekst/`
  - `/articles/dzhon-gill-chast-1-...` (mobile sheet)
  - Hermeneutics article (distance).
- `data:consistency` / migration metadata: unchanged (1 warning on /izbrannoe/).
- `guard:shared-files`: PASS.

## 4. Risk Assessment (surgical)

| Item | Risk | Why | Safe next action? |
|------|------|-----|-------------------|
| Force `<RomanNumeral>` everywhere (rail + sheet) | LOW-MED | Component is tiny + already used in bbar. Unifies to gb-roman CSS. | Yes (low-risk). |
| Fix hermeneutics offset | HIGH | History of VR-01 / position reverts. "Заморозить на 10-14 дней" per prior report. | **No** — only document + add guard. |
| Remove "непонятный блок" on context | MED | May be intentional mobile-head for GBS2. Needs owner visual review. | Document + targeted smoke. |
| Unify roman CSS (delete duplicate .gbs-rail-card__num rules) | LOW | Pure CSS dedup. | Yes (after component migration). |
| Add roman enforcement to rollout-audit | LOW | Guard only. | Yes. |

**Never without owner + pixelmatch baseline freeze:**
- Position / size changes on .gb-floater / .gb-ember.
- Speed panel morph or hitbox.

## 5. Recommended Low-Risk Surgical Actions (only these)

1. **Enforce RomanNumeral component** (P1, low-risk):
   - Update Gill rail cards + series sheets to import + use `<RomanNumeral value="II" />` (or equivalent prop).
   - Delete or deprecate raw `.gbs-rail-card__num` / `.toc-item__num` divs where possible.
   - Add to `scripts/premium-controls-rollout-audit.js`: check for presence of `.gb-roman` or component usage on Gill pages.

2. **Add targeted visual guards** (P1):
   - In `interactive-audit.js` or new `gill:roman-audit`:
     - Mobile series sheet: `.gbs2-sheet-part` contains `.gb-roman` (not raw text "II ·").
     - Hermeneutics: floater right offset ≥ 28px from content edge (computed).
     - Gill context: no duplicate "mobile-head" above rail (DOM count check).
   - Wire into `validate:static-publication`.

3. **Document + freeze** (P0):
   - Update `audit/PREMIUMCONTROLS_DEEP_DIVE_2026-06-27.md` with this section.
   - Add to AGENTS.md: "PremiumControls roman + hermeneutics positioning — protected. Use RomanNumeral component only."
   - Freeze current baselines for 10-14 days.

4. **Do NOT**:
   - Touch positioning CSS for --hermeneutics.
   - Change ember sizes (36/32/34px).
   - Rewrite speed panel or controller.

## 6. Exact Files to Touch (if approved)

- `src/components/article-pilots/gill-context/GillContextPageChrome.astro` (rail + toc)
- Gill part1/2/3/spravochnik chrome files (series sheet parts)
- `scripts/premium-controls-rollout-audit.js` (add roman guard)
- `audit/RASSINKHRON_GILL_HERMENEUTICS_VISUAL_BUGS_2026-06-27.md` (this file)

## 7. Next Steps (хирург)

1. Owner review of this report + screenshots.
2. Implement #1 + #2 (low-risk component + guard) in a dedicated lane.
3. Re-run full `premium-controls-rollout-audit` + targeted browser smoke on Gill 5 + Hermeneutics.
4. Update baselines only after visual sign-off.
5. Close only after 10-14 day freeze + no new regressions.

**Status**: These are real, user-visible regressions masked by "28/28 PASS". The architectural debt (hardcoded romans, variant-specific positioning) is exactly why PremiumControls was called "не доделано".

Ready for targeted low-risk patch or deeper lane plan. Provide owner direction.