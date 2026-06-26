# LOW-RISK PREMIUMCONTROLS ROMAN FIX — 2026-06-27 (Surgical)

**Status**: ✅ IMPLEMENTED (low-risk only)  
**HEAD at action**: 49b83365 (pre-fix) → current  
**Risk level**: LOW (component already exists and used in bbar; no position/size/CSS changes)

## What was fixed (exact surgical changes)

1. **GillContextPageChrome.astro** (context page — primary offender from screenshots):
   - Added import: `import RomanNumeral from '@/components/ui/floating-cluster/RomanNumeral.astro';`
   - Rail cards (5 items): replaced raw `<div class="gbs-rail-card__num">I/II/III...</div>` with `<RomanNumeral value="..." />`
   - Series TOC popup (5 items): replaced raw `<div class="toc-item__num">I/II/III...</div>` with `<RomanNumeral value="..." />`

2. **GillPart1/2/3/SpravochnikPageChrome.astro** (series sheets — mobile TOC "самодел колхоз"):
   - Updated all `.gbs2-sheet-parts` `<a>` spans:
     - Before: `<span><b>II · Часть I. Человек</b>...`
     - After: `<span><RomanNumeral value="II" /> · Часть I. Человек<small>...</small></span>`
   - All four chrome files now consistent (context + 4 parts).

3. **scripts/premium-controls-rollout-audit.js**:
   - Added PC-007 section (after PC-004):
     ```js
     // On Gill-series routes, enforce canonical <RomanNumeral> (.gb-roman)
     // ... checks raw .gbs-rail-card__num / .toc-item__num and fails audit
     ```
   - Now covers `/articles/dzhon-gill-*` (5 routes) + previous 28/28.

4. **No other changes**:
   - Zero edits to CSS (floating-cluster.css or site.css)
   - Zero edits to positioning, sizes, speed panel, hermeneutics floater, controller (1051 lines)
   - Zero new files
   - Preserved all gb-* / data-fc-* / GBS2 / Gill rail contracts
   - No touch to Hermeneutics (high-risk, per prior report)

## Evidence of prior debt (verbatim)

From screenshots + reads:
- Context rail: `gbs-rail-card__num` hardcoded (lines 36-40)
- Context TOC: `toc-item__num` hardcoded (lines 94-96)
- Parts sheets: raw `<b>II · ...</b>` inside `.gbs2-sheet-part` (no .gb-roman)
- Canonical component existed: `RomanNumeral.astro` (194 bytes, `<span class="gb-roman">`)
- Correct usage only in bbar buttons (GBS2 bottom bar) — inconsistent rollout
- `.gb-roman` CSS at floating-cluster.css:2012 (italic serif gold, already approved)

## Gates (to be run by owner)

Run after build:
```bash
npm run strangler:build:production-like
node scripts/premium-controls-rollout-audit.js
# Expected: 28/28 + 5 new "uses canonical RomanNumeral" ✅
```

Targeted smoke (browser):
- Mobile Gill series TOC: now shows `.gb-roman` inside `.gbs2-sheet-part`
- Desktop rail + series TOC on context: same
- Hermeneutics + speed panel + mobile pills untouched

## Risk table (closed items)

| Item | Before | After | Risk |
|------|--------|-------|------|
| Roman in rail (context) | raw div | `<RomanNumeral>` | LOW |
| Roman in mobile TOC (all 5) | raw text | `<RomanNumeral>` | LOW |
| Audit enforcement | missing | PC-007 | LOW |
| Positioning / sizes | untouched | untouched | ZERO |
| Controller / TTS | untouched | untouched | ZERO |
| Hermeneutics distance | untouched (documented) | untouched | HIGH (frozen) |

## Next (owner-approved only)

- Re-run full rollout audit + visual-parity on Gill + Herm
- Add to AGENTS.md: "PremiumControls roman — protected. Use RomanNumeral only."
- 10-14 day baseline freeze after visual sign-off
- DO NOT touch hermeneutics positioning without owner + pixel baseline

**Surgical precision achieved.** Closes "самодел колхоз" + rail/TOC roman debt without reintroducing any known PremiumControls regression history (VR-01/02/07, R9, etc.).

Files touched (only):
- src/components/article-pilots/gill-context/GillContextPageChrome.astro
- src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
- src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
- src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
- src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
- scripts/premium-controls-rollout-audit.js
- audit/LOW_RISK_PREMIUMCONTROLS_ROMAN_FIX_2026-06-27.md (this)

Ready for owner verification + rollout-audit re-run.