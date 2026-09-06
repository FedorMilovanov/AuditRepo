# Source anchors

Product anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`.

## Scroll wrappers

`.overflow-x-auto` wrappers are emitted by:
- Part I: `NagornayaChast1SectionII/VII/VIII.astro` and main-shell occurrences;
- Part III: `NagornayaChast3SectionVII.astro` / main shell;
- Part IV: `NagornayaChast4MainShell.astro` / Section III.

`NagornayaCompactBottomBar.astro:36-58` governs responsive local overflow/min-width behavior. No wrapper has `tabindex`, role/label, or focusable scrolling descendant.

## Chapter IV palette

Historical/current token owner sets chapter IV amber to `#d97706`. Source uses `text-amber-600` for chapter kicker and many 12px bold footnote markers. Live default-light backgrounds are white/near-white, producing 3.08–3.18:1. Prior dark-theme CSS remaps this token to a high-contrast value; that remap does not apply to default light.
