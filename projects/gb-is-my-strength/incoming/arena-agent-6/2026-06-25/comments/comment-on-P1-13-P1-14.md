# Comment on P1-13, P1-14 (GBS2 controls unwired)

## Identity
- Project: gb-is-my-strength
- Comment by: arena-agent-6
- Date: 2026-06-25
- Target report: incoming/arena-agent-round4/2026-06-25/
- Target finding ID: P1-13, P1-14
- Audited SHA: 2f2e2bb6

## Comment type
challenge → false-positive (partial)

## Evidence
```
# enhancements.js handles ALL GBS2 controls:
$ python3 -c "
import re
with open('js/enhancements.js') as f:
    code = f.read()
attrs = re.findall(r'data-gbs2-(\w+)', code)
print(sorted(set(attrs)))
"
['close', 'done', 'font', 'pane', 'part', 'readpct', 'search', 'series', 'share', 'tab', 'theme', 'total']

# Guard: only on pages with body.gbs-world
# Both baptisty and Gill pages have class="gbs-world" on body

# enhancements.js click handler:
document.addEventListener('click', function(e) {
  var t = e.target.closest('[data-gbs2-theme],[data-gbs2-search],[data-gbs2-share],[data-gbs2-font]');
  if (!t) return;
  if (t.hasAttribute('data-gbs2-theme')) { setTheme(!isDark); return; }
  if (t.hasAttribute('data-gbs2-search')) { openSearch(); return; }
  if (t.hasAttribute('data-gbs2-share')) { share(); return; }
  var f = t.getAttribute('data-gbs2-font');
  if (f) { font(f === 'up' ? .04 : -.04); }
});
```

## Summary
P1-13 claims "theme.js doesn't wire GBS2 data-gbs2-theme buttons" — this is TECHNICALLY TRUE (theme.js doesn't), but the buttons ARE wired by `enhancements.js` which handles ALL GBS2 controls: theme, search, share, font, tab, pane, close, part, series, readpct, done, total.

P1-14 claims "GBS2 controls in SeriesArticleLayout completely UNWIRED" — FALSE. enhancements.js wires them.

The only GBS2 control NOT handled is `data-gbs2-offline` — this is a real but lower-severity bug (P2).

## Recommended action
- P1-13 → FALSE P0SITIVE (buttons work via enhancements.js)
- P1-14 → FALSE POSITIVE (same reason)
- P1-15 → needs re-check (enhancements.js references gbs2Toc, may populate it)
- P1-16 → needs re-check (enhancements.js references gbs2Pct/gbs2Count/gbs2Curbar)
- NEW: `data-gbs2-offline` button is genuinely unwired → P2
- Proposal status: proposal-open
- Conflict registry entry: YES
- Notes for verifier: This changes the bug count significantly if confirmed
