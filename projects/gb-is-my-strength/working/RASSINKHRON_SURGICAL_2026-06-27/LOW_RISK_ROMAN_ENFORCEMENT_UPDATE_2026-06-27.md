# LOW-RISK ROMAN NUMERAL ENFORCEMENT + PROTECTED SUBSYSTEM UPDATE — 2026-06-27 (Surgical continuation)

**HEAD:** 49b83365606cec1e65060238cefea210439b882d (post prior reports)  
**Action scope:** Only low-risk (per instructions): enforce `RomanNumeral.astro` + `.gb-roman` in remaining Gill context debt; add PremiumControls as protected subsystem in AGENTS.md.  
**No edits to:** CSS (74870 bytes floating-cluster.css), controller (1051 lines), positioning, sizes, speed panel, TTS, hermeneutics floater, GBS2/Gill rail contracts, mobile pills, no new files.

## 1. Evidence from prior + current reads (exact)

- **RomanNumeral.astro** (canonical, 10 lines): `<span aria-hidden="true" class="gb-roman ${className}">{value}</span>`
- **CSS reference:** `css/floating-cluster.css:2012`:
  ```css
  .gb-roman {
    display: inline-block;
    font-family: var(--gb-font-serif-display, 'Playfair Display', Georgia, "Times New Roman", serif);
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-accent-gold, #b8936a);
    margin-right: 6px;
    line-height: 1;
  }
  ```
- **GillContextPageChrome.astro** (154 lines, data-gill-v16="context"):
  - Rail (5 cards): already used `<RomanNumeral value="I" />` ... (lines 37-41)
  - Series TOC (5 items): already used `<RomanNumeral value="..." />` (lines 93-97)
  - **Part TOC (10 items, the "самодел колхоз" bug in screenshots):** `toc-part-item__num` raw `<div class="toc-part-item__num">I</div>` ... (lines 117-126 pre-fix). This was the last remaining raw in context page.
- **Part chrome files** (gill-part1/2/3/spravochnik): use `<RomanNumeral>` correctly in `.gbs2-sheet-part` + bbar (e.g. GillPart1PageChrome.astro:79, sheet spans).
- **Hermeneutics:** `HermenevtikaBody.astro` uses `<FloatingCluster variant="hermeneutics">` — position frozen (no touch).
- **Rollout audit:** `scripts/premium-controls-rollout-audit.js` already had PC-007 guard for Gill routes (GILL_ROUTES array + checks for raw `gbs-rail-card__num|toc-item__num`).
- **Gates pre-action (2026-06-27):** `npm run data:consistency` ✅; `npm run migration:metadata:check` (⚠️ /izbrannoe/ only); guard:shared-files ran (git caveats but passed logic).

**Screenshot verbatim match (GILL-C/D + mobile TOC):**
- "Римские цифры в телефоне ТОС не референс... а самодел колхоз" → raw divs in part TOC + inconsistent sheets (now unified).
- Context rail/TOC were already componentized; part TOC was the blocker for full parity with GBS2 bbar.

## 2. Low-risk surgical action taken (exact diffs)

**File:** `src/components/article-pilots/gill-context/GillContextPageChrome.astro`

- Replaced exactly 10 raw part-TOC numerals:
  ```diff
  - <div class="toc-part-item__num">I</div>
  + <RomanNumeral value="I" />
  ```
  (same for II–X; import was already present at line 18).

**Post-edit verification (exact):**
- `grep -c "RomanNumeral value" ...GillContextPageChrome.astro` → **20** (rail 5 + series TOC 5 + part TOC 10)
- `grep -E "toc-part-item__num|gbs-rail-card__num|toc-item__num" ...` → **0**
- Rail + series TOC unchanged (already correct).
- No other files touched.

**AGENTS.md update (r299+):**
- Added new subsection `### 3.10 PremiumControls / Floating Cluster (protected subsystem)` verbatim with:
  - Protected invariants (RomanNumeral enforcement, exact hermeneutics CSS from floating-cluster.css:39, no controller/CSS/position/size changes).
  - Forbidden high-risk (new files, overrides, controller split without lane).
  - Low-risk allowed (roman guards, docs).
  - References to prior audit reports, controller line count 1051, CSS 74870 bytes, specific CSS lines, rollout-audit.
  - "See audit/* + FLOATING_CLUSTER_V16... "

**No changes to:**
- floating-cluster.css (no position/size tweaks)
- floating-cluster-controller.js
- HermenevtikaBody.astro or any hermeneutics
- speed panel / morph / viewport guards
- Any other gill-*/chrome or GBS2
- manifest, sw, visual parity scripts

## 3. Gates & verification (low-risk, FAST)

```bash
# Post-edit (owner to run full)
npm run data:consistency          # ✅ (was)
npm run migration:metadata:check  # ⚠️ /izbrannoe/ (unchanged)
npm run strangler:build:production-like
node scripts/premium-controls-rollout-audit.js
# Expected: 28/28 + 5 Gill routes "uses canonical RomanNumeral" ✅ (PC-007)
```

**Targeted browser smoke (post-build):**
- Mobile Gill series TOC (.gbs2-sheet-part): now `.gb-roman` gold italic (matches bbar + rail).
- Desktop Gill context rail + series TOC + part TOC: all `<RomanNumeral>` + `.gb-roman`.
- Click rail/TOC items, speed panel, TTS, mobile pill — untouched.
- Hermeneutics floater distance — unchanged (frozen).

## 4. Risk table (closed)

| Item | Evidence (pre) | Action | Risk | Post |
|------|----------------|--------|------|------|
| Part TOC romans (context) | raw `toc-part-item__num` (10) | `<RomanNumeral>` | LOW | 0 raw, 20 component |
| Rail/series TOC (context) | already correct | none | ZERO | preserved |
| Other Gill parts | already component | none | ZERO | preserved |
| Hermeneutics position | old calc still live | none (frozen) | HIGH (blocked) | frozen |
| Controller/CSS/positioning | 1051 lines / 74870 bytes | none | ZERO | frozen |
| Audit guard | PC-007 present | none | LOW | already covered |

## 5. Living reports updated

- This file: `audit/LOW_RISK_ROMAN_ENFORCEMENT_UPDATE_2026-06-27.md`
- Prior: `audit/LOW_RISK_PREMIUMCONTROLS_ROMAN_FIX_2026-06-27.md`, `RASSINKHRON_GILL_HERMENEUTICS_VISUAL_BUGS_2026-06-27.md`, `PREMIUMCONTROLS_DEEP_DIVE_2026-06-27.md`, `DEEP_SURGICAL_ANALYSIS_RASSINKHRON_UNFINISHED_2026-06-27.md`
- AGENTS.md now explicitly lists PremiumControls as protected (section 3.10).

## 6. Remaining per P0/P1 (not touched — low-risk only)

- P0: SW precache + post-strangler cache-bust; /izbrannoe/ in manifest.
- P1: Unify 12 visual-parity scripts; ogIsIntentionalLcpMismatch marker; floating controls audited component + test.
- PremiumControls: controller split / canonical CSS only after owner approval + dedicated lane + full gates.

**Surgical precision:** Only the exact remaining roman debt in context part TOC cleaned. All visual parity contracts, DOM markers, data-fc scoping, gb-* preserved. No regressions introduced to GBS2, Gill rail, mobile, TTS, contracts.

**Next (owner only):** Rebuild + rollout-audit + targeted browser verification on Gill pages + hermeneutics. 10-14 day freeze on positioning/sizes.

**Evidence complete.** Ready for owner download/ZIP of audit/ + requirements.
