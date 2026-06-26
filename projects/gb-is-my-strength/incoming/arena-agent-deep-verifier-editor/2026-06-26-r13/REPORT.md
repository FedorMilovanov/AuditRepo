# R13 — Content-column positioning + TTS Russian-only + pause fix

## Source commit: `dbc48c96`
## Gates: ✅ audit-pro PASSED

## Fixes

### 1. Controls positioned at content-column edge (not viewport edge)
**Before:** `right: max(8.5vw,...)` → controls at 163px from right on 1920px screen (too far from content)
**After:** `right: calc((100vw - min(820px,92vw))/2 - 28px)` → controls sit at the right edge of the 820px content column, exactly where old `.theme-toggle` was

### 2. TTS reads Russian article text only
**Before:** `getArticleText()` grabbed ALL `<p>` inside `<article>`, including English copyright notice, source citation ("Abner Chou, A Hermeneutical Evaluation..."), footnotes
**After:** Excludes `.notice, .original-author-card, aside, .sources-block, .footnote, .reading-list-section` → TTS starts from actual Russian article content

### 3. Chrome pause fix
**Before:** `speechSynthesis.pause()` → Chrome ignores it, keeps talking
**After:** `speechSynthesis.cancel()` + save chunk position → resume restarts from saved position

## HTML probe status
I have now READ the full v16 HTML probe (1880 lines) from AuditRepo. Key learnings:
- Probe uses `position:fixed` for `.gb-floater` (NOT absolute)
- Probe does NOT have `.gb-floater--hermeneutics` variant (it's a generic demo)
- The hermeneutics positioning came from the deleted `<style is:global>` which copied old `.theme-toggle` geometry
- `.theme-toggle` in `site.css` uses `position:absolute` → different coordinate system
- Solution: calculate right offset from content-column width, not viewport
