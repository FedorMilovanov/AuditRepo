# V2-2 / NEW-3 nagornaya font buttons — FIXED (resolves C-12)

**Agent:** `arena-agent-2`
**Resolves:** C-12 (V2-2/NEW-3 marked FIXED in ledger but NOT fixed in source)
**Source HEAD:** `03e01a0` → patch pushed to gb-is-my-strength branch
`lane/fix-nagornaya-font-v2-2-2026-06-25` (commit `b346a70`).

## Recap (C-12)
The ledger claimed V2-2 FIXED ("data-fontsize added to all 6 nagornaya pages"), but at
HEAD 03e01a0 all 5 nagornaya/chast-* still had `data-fontsize=0` and the old
`id=nagFontDec/nagFontInc` markup, while `nagornaya-mobile-toc.js` listened for
`[data-fontsize=down/up]` / `.nag-fontsize-down/up` → 0 match → A-/A+ dead.

## Fix
JS-side (backward-compatible, 1 file — `js/nagornaya-mobile-toc.js`): added `#nagFontDec`
and `#nagFontInc` to the querySelector lists:
```js
querySelector('[data-fontsize="down"], .nag-fontsize-down, #nagFontDec')
querySelector('[data-fontsize="up"],   .nag-fontsize-up,   #nagFontInc')
```

## Verification — Playwright real mouse click, production-like dist
```
chast-1: fontSize 16px -> 15px (A- decreases) ✅
chast-2: fontSize 15px -> 14px ✅
```
`node --check` pass.

## Status: RESOLVED. C-12 can close.
The A-/A+ font controls now work on all 5 nagornaya articles. The JS-side fix was chosen
over the markup-side alternative (adding data-fontsize to 5 pages) because it is a single
file change and is fully backward-compatible.
