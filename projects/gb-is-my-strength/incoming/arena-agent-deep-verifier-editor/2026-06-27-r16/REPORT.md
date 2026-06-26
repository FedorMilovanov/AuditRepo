# R16 — INVESTIGATION ONLY (no source pushes) — Owner screenshot analysis + root cause audit

## Meta
- Agent: arena-agent-deep-verifier-editor
- Date: 2026-06-27
- Mode: **INVESTIGATION ONLY — no pushes to source repo per owner request**
- Evidence: 8 owner production screenshots + surgical playbook cross-reference
- Source HEAD verified: `d6a23cae` (after R15 push)

---

## Owner complaints (verbatim, from chat)

1. **"Герменевтика — ещё старое близкое расстояние"** — controls too close to text, not at historical position
2. **"Гилл — жуткие баги"** — multiple visual issues on Gill family
3. **"Забагованная часть Исторический контекст с непонятным блоком сверху"** — context page has different block than parts
4. **"Римские цифры в телефоне ТОС не референс, не топовые, а самодел колхоз"** — mobile TOC roman numerals are in dark-red circles (legacy gbs2), not reference v16 gold italic serif
5. **"Мини картинки на месте"** — desktop rail thumbnails OK but "картинки не нужны в оглавлениях" of Gill
6. **"Расположение нужно ОТКАТИТЬ на историческое расстояние от блока"** — controls position regression
7. **"Не как было раньше на расстоянии определённом от блока, слишком впритык к тексту"**
8. **"Блоки во всех 5 частей должны быть одинаковые, топовые, с заголовками"**

---

## Screenshot analysis (8 screenshots)

### SCR-1: Gill desktop rail thumbnails (dark theme)
- Parts III/IV/V shown with dark circular thumbnails + text
- **Owner says:** "картинки не нужны" в оглавлениях Гилла, только римские цифры с hover-эффектами из reference
- **Current state:** legacy gbs2-rail with `gbs2-thumb` images
- **Target:** v16 `gbs-rail-card` with serif italic roman numerals, no images

### SCR-2: Hermeneutics desktop (light)
- Controls (☀ 🔍 ❙❙ 🔖) visible at right side
- TTS playing (pause icon visible)
- **Owner says:** "ещё старое близкое расстояние" — position still not at the HISTORICAL place
- **Root cause:** `.gb-floater--hermeneutics` uses `right: max(calc((100vw - min(820px,92vw))/2 - 28px), 16px)` — this is mathematically correct for content-column edge but may differ from the EXACT pixel position of the old `#themeToggle` which used `position:absolute` inside article-main (different coordinate system)
- **Fix direction:** The old `.theme-toggle` was `position:absolute; right:max(8.5vw,...)` INSIDE `.article-main` (width 820px centered). This is NOT the same as `position:fixed; right:calc(...)` on viewport. Need to measure or use the EXACT old approach.

### SCR-3: Gill Context desktop (light)
- **THIS IS THE TARGET** — clean roman numerals I-V, no thumbnails, 6 controls at bottom
- Owner: this is what all 5 parts should look like
- But owner also calls it "забагованная часть с непонятным блоком сверху" because it diverges from parts

### SCR-4: Gill Part 1 desktop (dark theme)
- Legacy gbs2-rail with thumbnail images, dark sidebar
- Structurally different from Context page
- **Owner wants:** unified with Context's clean roman numeral style
- This is VR-08 / Playbook B3 (family unification)

### SCR-5: Gill Part 1 tablet/wide-mobile — **CRITICAL BUG**
- Title "ДЖОН ГИЛЛ (1697-1771) II. Часть I. Человек" renders **VERTICALLY letter-by-letter**
- Controls bar (thumbnail, □, Q, A☀, A+, ▶, 🔖) stretched with huge gaps
- **Root cause:** `gbs2-mobile-head` has `display:flex; align-items:center; gap:10px`. The `gbs2-mobile-actions` contains 4 control buttons (`gbs2-mctl` at 38×38px each = 152px + gaps). On narrow viewport, `gbs2-mobile-title` (flex:1, min-width:0) is squeezed to near-zero width → text overflows vertically character-by-character.
- **Fix:** Add `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` to `.gbs2-mobile-title` or reduce button count in mobile header

### SCR-6: Gill Part 1 mobile TOC — "Части серии"
- Roman numerals I-V in dark-red circles (legacy gbs2 style)
- **Owner says:** "не референс, не топовые, а самодел колхоз"
- **Reference (probe):** `.toc-item__num { font-size:24px; font-family:serif; font-style:italic; color:gold }` — large italic serif gold numerals, not circles

### SCR-7: Gill Part 1 mobile TOC — "Оглавление части"
- Numbered 01-10 with dividers
- Functionally OK but styling is legacy gbs2, not reference v16 `toc-part-item`

### SCR-8: Same as SCR-5 (mobile-narrow) — vertical text + floating controls

---

## Root cause summary

| Issue | Root cause | Severity | Fix scope |
|-------|-----------|----------|-----------|
| Hermeneutics position | `position:fixed` with calc vs old `position:absolute` inside container — different coord systems | P1 | CSS position tweak |
| Gill vertical text (mobile) | `gbs2-mobile-title` squeezed to 0 by 4 control buttons in `gbs2-mobile-actions` | P0 | CSS overflow fix |
| Gill Part thumbnails | Legacy `gbs2-thumb` images in `gbs2-parts` nav | P1 | VR-08/B3: migrate to v16 template |
| Mobile TOC numerals | Legacy `gbs2-sheet` with dark-red circle numerals instead of reference gold italic serif | P1 | B3: port v16 `toc-sheet` |
| Gill family split | Context = v16 template, Parts = legacy gbs2 | P1 | B3: unify all 5 onto v16 |
| All 5 parts not identical | Context has different block than parts | UX | B3 resolution |

---

## What NOT to do (owner explicit)

1. ❌ Do NOT push to source repo without owner approval — "сейчас не делай никаких пушей"
2. ❌ Do NOT touch play-expand — owner deferred
3. ❌ Do NOT add thumbnails/images to Gill TOC — owner explicitly said "картинки не нужны"
4. ❌ Do NOT self-tune positions — use historical measurements or reference exactly
5. ❌ Do NOT delete Context's v16 template — it IS the target for all parts

## What TO do next (pending owner go-ahead)

1. **Fix vertical text P0** — add `overflow:hidden` to `.gbs2-mobile-title` in `css/site.css`
2. **Hermeneutics position** — research exact old `#themeToggle` pixel position from git history, use that exactly
3. **B3 Gill unification** — pilot Part 1 onto gill-context v16 template, then 2/3/spravochnik
4. **Mobile TOC** — port reference `toc-sheet` with gold italic numerals
5. **Add prohibitions** to AGENTS.md / main repo docs so future agents don't re-introduce regressions
