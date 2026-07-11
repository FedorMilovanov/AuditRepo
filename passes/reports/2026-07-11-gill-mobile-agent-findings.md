# Проход Gill mobile — находки агентов (v2.8 workflow)

_Извлечено из journal workflow `wf_eb383b9d-972`. Сохранено для памяти проекта._


## agent

**Область:** Mobile bottom+top bars (css/floating-cluster.css) — extra borders/frames/shadows/insets vs canonical gill-mobile-bars-v2.8 (borderless, flush, single hairline, frosted blur, NO shadow)

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-bottom-bar — line 3051 (REFERENCE LOCK V3 block, @media max-width:960px)
  - Проблема: box-shadow: var(--gill-mobile-bar-shadow) !important draws a large drop shadow PLUS an inset highlight line (token = '0 -10px 30px rgba(45,35,24,.13), 0 1px 0 rgba(255,255,255,.78) inset', defined line 2920). v2.8 bottom bar (canonical line 328-334) has NO box-shadow at all. The inset highlight reads as an extra top frame and the drop shadow makes the flush bar look like a floating detached panel.
  - Причина: --gill-mobile-bar-shadow token (line 2920 light / 2938 dark) invented for a floating look; v2.8 has no such token.
  - Фикс: box-shadow: none !important;  (drop the var(--gill-mobile-bar-shadow); rely only on border-top hairline like v2.8)

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-bottom-bar — lines 3052-3053
  - Проблема: -webkit-backdrop-filter:none !important; backdrop-filter:none !important removes the frost. v2.8 bottom bar (line 332) uses backdrop-filter:blur(22px) saturate(180%) over a translucent bg (--gill-mobile-bar-bg alpha .80). Live instead paints a near-opaque bg (token alpha .99, line 2918) with no blur, which is why an opaque slab + shadow was needed instead of a frosted flush edge.
  - Причина: Frost was disabled and compensated with an opaque bg token + ::after slab (see next finding).
  - Фикс: -webkit-backdrop-filter: blur(22px) saturate(180%) !important; backdrop-filter: blur(22px) saturate(180%) !important;  and lower --gill-mobile-bar-bg alpha toward v2.8 (rgba(253,251,246,.80) light / rgba(13,17,23,.78) dark) so the blur shows.

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-bottom-bar::after — lines 3060-3067
  - Проблема: An extra full-bleed pseudo-element (inset:0, opaque background:var(--gill-mobile-bar-bg), z-index:-1) paints a second solid backing layer under the bar. v2.8 has no ::after on the bottom bar. It exists only to hide the removed frost; with the frost restored it is a redundant opaque frame layer.
  - Причина: Added as an opaque backdrop substitute when backdrop-filter was disabled.
  - Фикс: Delete the whole [data-gill-v16] .mobile-bottom-bar::after rule (or set display:none !important). The single translucent frosted background on the bar itself matches v2.8.

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-top-bar — line 3096
  - Проблема: box-shadow: var(--gill-mobile-bar-shadow) adds a drop shadow + inset highlight to the TOP bar. v2.8 top bar (canonical lines 258-265) has NO box-shadow. This is an extra frame around the top edge.
  - Причина: Same invented shadow token reused on the top bar.
  - Фикс: box-shadow: none;  (remove var(--gill-mobile-bar-shadow) from the top-bar rule)

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-top-bar — line 3094 (background) and line 3093 (border-bottom)
  - Проблема: Top bar is ALWAYS opaque (background: var(--gill-mobile-bar-bg)) and ALWAYS shows border-bottom:1px solid var(--gill-mobile-bar-border). v2.8 top bar is background:transparent with border-bottom:1px solid transparent (lines 261-262), and only gains the solid bg + hairline via the .is-scrolled state (line 269). Result: live shows a permanent top panel + hairline frame instead of dissolving seamlessly into the page at the top (owner: 'у самого верха бар растворяется в странице, никакой отдельной рамки').
  - Причина: The .is-scrolled two-state (transparent-at-top → frosted-hairline-when-scrolled) mechanism from v2.8 was collapsed into a single always-on opaque state.
  - Фикс: In base .mobile-top-bar: background: transparent; border-bottom: 1px solid transparent; add -webkit-backdrop-filter/backdrop-filter: blur(22px) saturate(180%). Then add: [data-gill-v16] .mobile-top-bar.is-scrolled{ background: var(--gill-mobile-bar-bg); border-bottom-color: var(--gill-mobile-bar-border); } (mirroring v2.8 line 269).

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-top-bar — lines 3079-3099 (no backdrop-filter present)
  - Проблема: The top bar has no backdrop-filter, so v2.8's frosted blur(22px) saturate(180%) look is missing entirely (v2.8 line 263).
  - Причина: Frost omitted when the top bar was made a solid panel.
  - Фикс: Add to the base top-bar rule: -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%);

- **[medium]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — html.dark [data-gill-v16] .mobile-top-bar — lines 2877-2882
  - Проблема: html.dark ...{ background-color:#161a21 !important } forces the top bar opaque in dark mode, re-introducing the always-on panel/frame and defeating the transparent-at-top behavior even after finding #5 is applied. v2.8 keeps the dark top bar transparent until .is-scrolled.
  - Причина: FOUC guard over-broadly forces an opaque bg on the top bar.
  - Фикс: Remove .mobile-top-bar from this forced-opaque selector list (keep .toc-sheet and .mobile-bottom-bar), or re-scope to html.dark [data-gill-v16] .mobile-top-bar.is-scrolled only.

- **[medium]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .mobile-bottom-bar — base rule lines 1269-1281 (no media query)
  - Проблема: The base (non-media) bottom-bar rule is the original floating-pill: position:absolute; left/right/bottom:6px (inset from edges), border-radius:20px (rounded corners), border:1px solid var(--gb-border) (full 4-side frame), box-shadow:0 8px 24px rgba(0,0,0,.10). None of this matches v2.8 (flush, radius:0, border:0 + single top hairline). It is overridden by the V3 !important block only below 960px; between 960-1024px (the mobile media at line 2622 is max-width:63.99em) the floating pill with rounded corners/4-side border/inset re-appears.
  - Причина: Legacy floating-cluster pill styling left in the base rule; only patched via a later !important override at narrower widths.
  - Фикс: Align the base rule to v2.8 so it holds at all mobile widths: left:0;right:0;bottom:0; border-radius:0; border:0; border-top:1px solid var(--gill-mobile-bar-border); box-shadow:none; (or extend the V3 flush block's media query up to 63.99em to fully cover the mobile range).

- **[medium]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — Border-color token — .mobile-bottom-bar line 3048 / .mobile-top-bar line 3093 use var(--gill-mobile-bar-border)
  - Проблема: The single hairline uses --gill-mobile-bar-border = rgba(118,96,66,.30) light / rgba(232,184,120,.26) dark (lines 2919/2937). v2.8's hairline token --gill-mobile-hairline is much subtler: rgba(120,96,66,.16) light / rgba(232,184,120,.16) dark. The live hairline is ~2x stronger, reading as a heavier frame line than the canonical near-invisible hairline.
  - Причина: Two different border tokens; live bar points at the heavier -bar-border instead of -hairline.
  - Фикс: Point the border-top/border-bottom hairline at a .16-alpha value (introduce/use --gill-mobile-hairline: rgba(120,96,66,.16) light / rgba(232,184,120,.16) dark) to match v2.8 lines 230/241.


> needsUserRef: Audit is complete against the canonical v2.8. If the owner wants the exact patched CSS block written out (edits are out of scope for this read-only audit), that can be provided on request. Note: two effective definitions cascade for the bottom bar — legacy floating-pill base at line 1269 and the flush !important override in the 'REFERENCE LOCK V3' @media(max-width:960px) block at line 3034 — so any fix must touch both to be correct across the full mobile width range (mobile breakpoint is 63.99em/~1023px, but the flush override only spans max-width:960px).


## agent

**Область:** Gill mobile learning PANE content (GillLearningSheet.astro + floating-cluster.css .gill-*/.quiz-*/.term-card/.outline-card) vs canonical v2.8 .hlp-* learning pane

- **[low]** `/home/user/gb-is-my-strength/src/components/article-pilots/gill-series/GillLearningSheet.astro` — panelQuiz (markup lines 79-88) + quiz JS answerQuiz()/renderQuiz() (lines 317-380); css/floating-cluster.css quiz block lines 3788-3816
  - Проблема: CALIBRATION METER — the v2.8 key feature — is MISSING entirely (not text, not a meter). v2.8 renderMastery() (ref lines 1319-1334) prints, in the quiz header on every question, a .hlp-calib meter: a label 'Калибровка', a visual bar whose fill width = calScore/seen and whose color class is hi(green #3a9d5d ≥70%) / mid(yellow #d4a017 40-69%) / lo(red #c2603a <40%), and a % readout (ref CSS .hlp-calib lines 475-482). The live quiz is a plain correct/wrong+streak quiz: no calibration value is tracked (no calScore/seen), no confidence step, and no meter markup or CSS at all. The whole Certainty-Based-Marking mechanic that FEEDS the meter (confidence buttons .hlp-conf before answering, ref lines 1348-1357/489-506; calibration verdict .hlp-cal after, ref 1384-1394/508-518) is also absent.
  - Причина: Live GillLearningSheet was built as a basic MCQ quiz; the v2.8 metacognition layer (confidence pick -> calibration score -> header meter) was never ported.
  - Фикс: Add the meter CSS (translate .hlp-calib -> --gb-* tokens, scope [data-gill-v16] inside the existing @media (max-width:63.99em) block in floating-cluster.css):
[data-gill-v16] .quiz-calib{display:flex;align-items:center;gap:8px;margin:10px 0 2px}
[data-gill-v16] .quiz-calib[hidden]{display:none}
[data-gill-v16] .quiz-calib__lbl{font-family:var(--gb-font-sans,system-ui,sans-serif);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gb-text-muted);flex-shrink:0}
[data-gill-v16] .quiz-calib__bar{flex:1;height:5px;border-radius:3px;background:var(--gb-border);overflow:hidden}
[data-gill-v16] .quiz-calib__bar i{display:block;height:100%;border-radius:3px;transition:width .35s cubic-bezier(.4,0,.2,1),background .3s}
[data-gill-v16] .quiz-calib__bar i.hi{background:#3a9d5d}
[data-gill-v16] .quiz-calib__bar i.mid{background:#d4a017}
[data-gill-v16] .quiz-calib__bar i.lo{background:#c2603a}
[data-gill-v16] .quiz-calib__pct{font-family:var(--gb-font-sans,system-ui,sans-serif);font-size:11.5px;font-weight:800;color:var(--gb-text);min-width:34px;text-align:right;flex-shrink:0}
Add markup at the top of #panelQuiz (before .quiz-meta):
<div class="quiz-calib" id="glsQuizCalib" hidden title="Совпадение уверенности с результатом"><span class="quiz-calib__lbl">Калибровка</span><span class="quiz-calib__bar"><i id="glsQuizCalibFill"></i></span><span class="quiz-calib__pct" id="glsQuizCalibPct">—</span></div>
Add JS: track seen and calScore, and after each answer set pct=Math.round(calScore/seen*100), fill.className = pct>=70?'hi':pct>=40?'mid':'lo', fill.style.width=pct+'%', pctEl.textContent=pct+'%', unhide #glsQuizCalib. NOTE: a truthful calScore requires the confidence step (calGood = (ok&&conf==='sure')||(!ok&&conf!=='sure'), ref line 1385) — porting that CBM mechanic is the larger part; the meter itself is small.

- **[low]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — quiz header, near .quiz-meta line 3788 (add new .quiz-mastery rules); GillLearningSheet.astro panelQuiz markup line 80
  - Проблема: MASTERY strip (v2.8 .hlp-mastery / .hlp-mastery__lbl, ref lines 467-473, rendered by renderMastery ref 1319-1333) is missing. v2.8 shows 'Освоение категорий  N / total' plus a row of thin per-category segment bars (interleaving progress) above each quiz question; the live header only has category + 'Серия: N'.
  - Причина: Same as calibration — the mastery/interleaving header of the v2.8 quiz was not ported.
  - Фикс: Add (scoped [data-gill-v16] inside the mobile @media block), tokens remapped from ref: [data-gill-v16] .quiz-mastery{display:flex;gap:4px;margin:2px 0 14px} [data-gill-v16] .quiz-mastery__seg{flex:1;height:4px;border-radius:2px;background:var(--gb-border);overflow:hidden;position:relative} [data-gill-v16] .quiz-mastery__seg i{position:absolute;inset:0;transform-origin:left;transform:scaleX(0);background:var(--gb-accent);transition:transform .4s cubic-bezier(.4,0,.2,1)} [data-gill-v16] .quiz-mastery__lbl{margin-bottom:6px;font-family:var(--gb-font-sans,system-ui,sans-serif);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gb-text-muted);display:flex;justify-content:space-between} [data-gill-v16] .quiz-mastery__lbl b{color:var(--gb-accent);font-weight:800} plus per-category segment markup built in JS. Larger feature (needs per-category mastered{} tracking).

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — .term-card rules lines 3753-3775 (add ::before + aria-expanded accent)
  - Проблема: Term cards are visually flatter than v2.8. The canonical .hlp-term (ref 388-406) has a 3px burgundy/gold left-edge accent bar that scaleY-animates in when the card opens, and the card border turns accent-tinted on open. The live .term-card has neither — no left accent bar and no border-color change on aria-expanded="true"; only the ⌄ chevron rotates.
  - Причина: .term-card was styled as a minimal box; the v2.8 accent-edge affordance was omitted.
  - Фикс: Add to the existing .term-card block (pure CSS, keyed on the live's aria-expanded attribute; add position:relative;overflow:hidden to .term-card first):
[data-gill-v16] .term-card{position:relative;overflow:hidden}
[data-gill-v16] .term-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gb-accent);transform:scaleY(0);transform-origin:center;transition:transform .24s cubic-bezier(.34,1.4,.64,1)}
[data-gill-v16] .term-card[aria-expanded="true"]::before{transform:scaleY(1)}
[data-gill-v16] .term-card[aria-expanded="true"]{border-color:color-mix(in srgb,var(--gb-accent) 40%,transparent)}
Also honor reduced-motion (the file already has a reduced-motion block near line 3899 — add .term-card::before there).

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — .quiz-category line 3789
  - Проблема: The quiz category is rendered as plain uppercase accent text, but v2.8 .hlp-cat (ref 418-420) is a rounded pill/chip: an inline-block with accent-tinted background, pill radius and padding. Live look reads as a bare label vs the v2.8 badge.
  - Причина: .quiz-category kept the v1 text treatment; v2.8 upgraded it to a chip.
  - Фикс: Replace/extend .quiz-category to match .hlp-cat: [data-gill-v16] .quiz-category{display:inline-block;padding:2px 9px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:color-mix(in srgb,var(--gb-accent) 12%,transparent);color:var(--gb-accent)} (remove the plain font-weight:900 text-only styling). Note this makes .quiz-meta a chip-on-left / streak-on-right row, matching v2.8.

- **[medium]** `/home/user/gb-is-my-strength/src/components/article-pilots/gill-series/GillLearningSheet.astro` — answerQuiz() lines 349-377; .quiz-explanation markup line 83 / CSS line 3805
  - Проблема: The explanation/'why it matters' box shows ONLY on wrong answers (explEl.hidden=false is set only in the else branch, line 363-364), whereas v2.8 shows .hlp-why on EVERY answer (elaborative interrogation, ref comment line 519 and JS line 1396 'почему это важно — всегда'). Visually v2.8's .hlp-why (ref 520-525) also carries a 3px accent left border + a small uppercase accent label '.hlp-why__lbl', which the live plain muted .quiz-explanation box lacks.
  - Причина: Live quiz treats the explanation as an error-correction message rather than an always-on learning note.
  - Фикс: Behavior: reveal the explanation on correct answers too. Visual, to match .hlp-why: [data-gill-v16] .quiz-explanation{border-left:3px solid var(--gb-accent)} and prepend a label element styled: font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--gb-accent);display:block;margin-bottom:4px. Lower priority than the calibration meter.


## agent

**Область:** Gill series live part-TOC overlay (GillPartTocOverlay) vs canonical v2.8 .btoc-* — mobile, scoped [data-gill-v16]

- **[medium]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — [data-gill-v16] .toc-overlay base rule @ lines 1306-1316 (position:fixed;inset:0), mobile overrides @ 1591 and 3303; DOM placement in /home/user/gb-is-my-strength/src/components/article-pilots/gill-series/GillSeriesChrome.astro line 53 (overlay is a direct child of .gbs2-world, sibling of .page-wrap)
  - Проблема: The part-TOC overlay CSS is actually CORRECT and already matches the v2.8 fix: .toc-overlay is position:fixed; inset:0 with no rule anywhere downgrading it to position:absolute, it is a sibling of the scrolling content (NOT nested inside a scroll container), and on mobile .gbs2-world is display:block/position:relative (site.css:371) with NO transform/filter/perspective/will-change/contain on any ancestor (gbs2-world -> body.gbs-world -> html), so nothing traps the fixed element. On open the controller also scroll-locks the body (floating-cluster-controller.js openOverlay ~1178). So no CSS positioning delta remains in the overlay itself. The residual 'оглавление уезжает, виден текст' symptom, if still reproducible, traces to a STALE scroll-lock watchdog, not overlay CSS: js/site-utils.js emergency-unlock timer l() only recognises modal selectors '.mobile-nav.active', '.cp-backdrop.is-open', '#btocOverlay.open, .btoc-panel[aria-hidden="false"]', '.sd-panel.open'. The live Gill overlay is '#partTocOverlay.is-open' (class .toc-overlay.is-open) which matches NONE of these, so with the gill-toc lock held the watchdog sees 'no modal open + lock held' and force-unlocks scroll after ~3s while the TOC is still open, letting the article scroll behind the overlay.
  - Причина: Overlay CSS positioning already conforms to v2.8 (fixed, over content, out of scroll container). The only live-reproducible scroll/positioning defect is the site-utils.js emergency-unlock selector list being out of date — it never lists #partTocOverlay/.toc-overlay.is-open, so the scroll lock the Gill controller sets is treated as orphaned and force-released mid-view.
  - Фикс: Leave the .toc-overlay CSS as-is (position:fixed is correct). Fix the watchdog: in js/site-utils.js function l(), add the Gill overlay to the recognised-modal query, e.g. add ".toc-overlay.is-open" (and '#partTocOverlay.is-open, #seriesTocOverlay.is-open') to the querySelector chain so a held 'gill-toc' lock is not force-unlocked while the sheet is open.

- **[high]** `/home/user/gb-is-my-strength/css/floating-cluster.css` — Duplicate/override blocks: [data-gill-v16] .toc-part-item @ 1736-1742 and @ 1903-1910 (border:1px solid transparent + border-radius:16px + border-left:none + overflow:hidden), the ::before top hairline @ 1911-1925, and .toc-part-item.is-current @ 1757-1767 and @ 1942-1952 (full box border-color). Base rule @ 1425-1449 (border-left:3px solid transparent, transform-origin) is overridden by these.
  - Проблема: Section items render as a full rounded BOX FRAME (1px border on all four sides + border-radius:16px) plus an extra ::before top hairline, and the active/current state paints a full box border-color rather than a left accent bar. This is exactly the 'double borders / box frame' the v2.8 canon rejects. v2.8 .btoc-link (reference lines 636-642) uses ONLY a left accent bar: border-left:2px solid var(--color-border); border-radius:0 12px 12px 0; NO box; active = muted background (var(--color-surface-muted)) + border-left-color:var(--color-accent). The live 'PURITAN BRASS' overrides (1739 'border-left:none !important', 1740/1906 'border:1px solid transparent !important') explicitly kill the left bar and replace it with a card frame, and the scroll-spy rule @ 2861-2865 then re-adds a border-left-color on top of the 1px transparent box, yielding an inconsistent partial/double border.
  - Причина: Later !important 'monumental card' override layers (v16 PURITAN ANTIQUE BRASS @ ~1901 and the duplicate @ ~1736) reframed each row as a bordered rounded card with a ::before hairline, overriding the canonical single left-accent-bar design.
  - Фикс: Scope-preserving to [data-gill-v16] mobile: in the .toc-part-item override blocks (1736-1742 and 1903-1910) drop 'border:1px solid transparent', 'border-radius:16px', 'border-left:none', 'overflow:hidden'; restore 'border-left:2px solid var(--gb-border); border-radius:0 12px 12px 0'. Delete the .toc-part-item::before hairline (1911-1925). For .is-current/.is-active (1757-1767, 1942-1952, 2861-2865) remove 'border-color' box styling and use only 'background: var(--gb-surface-muted)' + 'border-left-color: var(--gb-accent)' — matching v2.8 .btoc-link.active.

- **[high]** `/home/user/gb-is-my-strength/src/components/article-pilots/gill-series/GillPartTocOverlay.astro` — splitHistoricalLabel() lines 8-11 (regex /^([IVX]+)\.\s*(.+)$/ returning mark:'·' when no match) and the render ternary at line 25 (view.isRoman ? <SeriesMark kind="roman"...> : <span ...>·</span>)
  - Проблема: The numeral marker is derived by regex-parsing a Roman prefix out of the label text. Any level:2 section whose label lacks a leading 'I. ' style prefix falls through to mark:'·' and isRoman:false, so it renders the sub-item dot span INSTEAD of a numeral — the reported 'римские цифры render as ·' bug. Confirmed in the built output /home/user/gb-is-my-strength/dist/articles/dzhon-gill-chast-4-ekzeget/index.html where the is-current level:2 row 'Джон Гилл: экзегет за работой' renders '<span ... class="...toc-part-item__num--sub">·</span>'. Data proof in gillSeriesData.ts: level:2 items like 'Раввинист — христианин с Мишной в руках' (line 185), 'Джон Гилл: экзегет за работой' (line 241), and every 'Проверь себя' quiz row have NO roman prefix, so their numeral silently degrades to a dot. v2.8 (.btoc-link-num, reference css 639-640 + JS PARTS s[0] @ 1144/1146) always shows an explicit numeral, accent-coloured when active.
  - Причина: The mark is computed from label text via a Roman-prefix regex rather than assigned per item; level:2 rows without a literal 'I.'-style prefix produce '·'. There is no explicit num field on GillPartTocItem to fall back to.
  - Фикс: Stop parsing the numeral out of the label. Number the level:2 rows sequentially in the component (running counter -> Roman numeral) and render that via <SeriesMark kind="roman"> / .toc-part-item__num for every level:2 item regardless of label text; keep the '·' only for level:3 sub-rows. (Equivalent alternative: add an explicit `num` field to GillPartTocItem in gillSeriesData.ts like v2.8's PARTS[i][0] and render it directly.) Keep the accent-on-current styling already present at .toc-part-item.is-current .toc-part-item__num.


## agent

astro check passed: **0 errors, 0 warnings, 11 hints** (the 11 hints are all pre-existing `is:inline` script hints in unrelated files — none from my changes). Zero new type errors.

## Report

### Applied

**Area 1 — Part-TOC overlay (Gill series)**

- **A1#1 (medium) — watchdog scroll-lock selector** — `js/site-utils.js` function `l()`: added `||document.querySelector('.toc-overlay.is-open, #partTocOverlay.is-open, #seriesTocOverlay.is-open')` to the recognised-modal chain (after `.sd-panel.open`) so the held `gill-toc` lock is no longer force-released mid-view. Overlay CSS left as-is (already `position:fixed;inset:0` — correct per v2.8).
- **A1#2 (high) — box-frame → left accent bar** — `css/floating-cluster.css` (additive block, `~3990`): new `[data-gill-v16] .toc-part-item` overrides drop `border:1px transparent`/`border-radius:16px`/`overflow:hidden`, restore `border-left:2px solid var(--gb-border); border-radius:0 12px 12px 0`, kill the `::before` top hairline (`content:none`), and make `.is-current/.is-active/[aria-current]` use `background:var(--gb-surface-muted)` + `border-left-color:var(--gb-accent)` only (light + dark). Scoped to `.toc-part-item` so the series-TOC `.toc-item` card look is untouched.
- **A1#3 (high) — Roman numerals render as `·`** — `GillPartTocOverlay.astro`: replaced label-regex `splitHistoricalLabel()` with a `partTocView` built in frontmatter that assigns numerals by a running level:2 counter (`toRoman()`), strips any existing prefix for the title (`cleanTitle()`), and keeps `·` only for level:3. Every section now shows an explicit numeral regardless of label text.

**Area 2 — Mobile bars** (all in the additive `@media (max-width:63.99em)` block)

- **#1/#4 (high)** box-shadow removed on both bars (`box-shadow:none`).
- **#2/#6 (high)** frosted `blur(22px) saturate(180%)` restored on both bars.
- **#3 (high)** bottom-bar `::after` opaque backing killed (`content:none`).
- **#5 (high)** top bar now `background:transparent; border-bottom:1px solid transparent` at top, gaining frost + hairline via `.mobile-top-bar.is-scrolled`. Added the `is-scrolled` toggle to the existing scroll handler in `GillSeriesMobileBar.astro` (`initGillMobileTopBarAutoHide`) + a seed toggle for already-scrolled loads.
- **#7 (medium)** dark top bar no longer forced opaque — instead of editing the shared FOUC-guard rule (2877), I override it with equal-specificity, later `html.dark [data-gill-v16] .mobile-top-bar{background:transparent}`. Same visible result, no risk to the shared `.toc-sheet`/bottom-bar selectors in that rule.
- **#8 (medium)** bottom bar pinned `position:fixed;left/right/bottom:0;radius:0;border:0;border-top hairline` in my 63.99em block, closing the 960–1024px gap where the legacy floating pill re-appeared.
- **#9 (medium)** hairline now uses a new `--gill-mobile-hairline` (.16 alpha, light/dark) instead of the ~2× heavier `-bar-border`.

**Deviation note (bars #2/#9):** rather than lowering the shared `--gill-mobile-bar-bg` (which also feeds the opaque `.toc-sheet` at line 3307 via `color-mix(... 98%, white)` and would have made the TOC sheet translucent), I introduced dedicated `--gill-mobile-bar-frost` (.80 light / .78 dark) + `--gill-mobile-hairline` tokens scoped to `[data-gill-v16]`. Same frosted look, no sheet regression.

**Area 3 — Learning pane**

- **#3 (high)** `.term-card` accent left-edge `::before` (scaleY animate-in) + accent-tinted border on `[aria-expanded="true"]`; added to a reduced-motion guard.
- **#4 (high)** `.quiz-category` restyled as a rounded accent chip (`.hlp-cat`).
- **#5 (medium)** `.quiz-explanation` now reveals on **every** answer (moved the reveal out of the wrong-only `else` branch in `GillLearningSheet.astro answerQuiz()`) + `border-left:3px accent` and an uppercase accent `::before` label "Почему это важно".

### Deferred (low confidence — large new features, not built blind per rules)

- **A3#1 (low) — calibration meter (CBM):** requires porting the whole Certainty-Based-Marking mechanic (confidence-pick step → `calScore/seen` tracking → verdict) that feeds the meter. The delta itself flags "porting that CBM mechanic is the larger part." Skipped to avoid building a large metacognition feature blind.
- **A3#2 (low) — mastery/interleaving strip:** requires per-category `mastered{}` state tracking + segment rendering. Larger feature. Skipped.

### Notes
- No desktop / other-pilot / theme-token-definition changes. All new CSS is `[data-gill-v16]` + `@media (max-width:63.99em)`, using `var(--gb-*)`.
- Not committed; no full build run.
- Files touched: `css/floating-cluster.css`, `js/site-utils.js`, `src/components/article-pilots/gill-series/GillPartTocOverlay.astro`, `src/components/article-pilots/gill-series/GillLearningSheet.astro`, `src/components/article-pilots/gill-series/GillSeriesMobileBar.astro`.
