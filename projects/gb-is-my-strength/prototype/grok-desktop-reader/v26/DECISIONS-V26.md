> **OWNER OVERRIDE / VISUAL TARGET 2026-11-07:** [Owner visual acceptance contract](../OWNER-VISUAL-ACCEPTANCE-2026-11-07.md) is the latest direction. The current Product V27 floating rounded TOC **fails visual parity** with this reference. Final composition must be **integrated into the page layout**, expandable/collapsible to an actual narrow rail, and library must not float in a detached bottom-right corner. Do not claim signoff without before/after live screenshots. Original V26 design details below remain the reference.

# V26 visual and function ownership contract

## Desired presentation, explicitly additive

- Desktop Grok-style TOC and reading text are in one layout, not a modal or separate page. One common renderer over existing SeriesConfig / partToc; series skins remain individually themed.
- Publication structure: book chapter → article → H2 → H3/H4 where present; flat series part → H2 → H3/H4; standalone H2 → H3 → H4. No duplicated tabs for “главы / в главе”. Preserve all actual published headings, slugs and old Gill anchors including sec-gill-last-pages.
- Active multi-line item uses a restrained 2px side rule with equal inset top/bottom; selected dots small and solid without rings. Optional 1px connectors join adjacent main H2 leaves only. Do NOT draw H3/H4 trunks or several competing vertical lines.
- Series colors come from existing data-series-theme: Baptists samizdat, Gill leather/gold, standalone paper/claret. Day/Sepia/Night reading preference is independent. Retain original GillLeatherRibbon / GillLeatherDefs for historical vertically embossed ВВЕДЕНИЕ and СПРАВОЧНИК.
- Right controls remain **four existing vertical SVGs**: theme, search, Play/speed, bookmark. The GB emblem is a restrained typographic monogram only; do not silently replace the live logo without visual approval.
- Left tools: site menu, settings, print/PDF, share, library. At very short desktop heights (V26 demo height ≤390px) show all five commands in a single compact row to preserve usable TOC height. Never drop functionality for a visual shortcut. No Product mobile changes.
- Popovers follow the actual triggering button, including short screens, Escape and focus return. Keyboard arrows exclude inert/hidden children; subtree collapse restores focus to its disclosure. Animation is interruptible and respects reduced motion, without duplicate content or scroll-jumps.

## One owner per function

| Feature | Must remain owned by | Grok view can supply |
| --- | --- | --- |
| Tree and URLs | SeriesConfig, partToc, native anchors | Read-only tree adapter and visual disclosure |
| Theme and reader settings | GBReaderPreferences / ReaderSettings | Trigger and skin only |
| Global / scoped search | GBSearch and canonical index | Supported contextual filter, not second search engine |
| Audio and speed | PlayEmber / TTS runtime | Reuse its control, no fake playback |
| Save, statuses, resume, backups | GBReaderLibrary V3, SaveButton | Reflection of existing state, not own localStorage |
| Popover and focus | SiteSectionsMenu / overlay runtime | Position and style under existing lifecycle |
| Progress and scroll | Existing reader scrollspy | Observe existing reader state, no parallel scroll listener |
| Print and share | Existing reader actions (PR #2269 independent) | Retain action, no in-print floating controls |

## V26-specific fixes

1. A zero-overflow page may still be unusable. Measure actual TOC viewport height. V25's 900×300 list was 14px; V26's is ≈109px.
2. Adjust compact collapse/expand to **same vertical Y** even when header height is reduced (3px alignment bug caught by V26 regression).
3. Browser Back to the initial empty hash restores original selection in the *demo*. In Product adopt normal canonical routing and history; **do not copy demo hash/scroll code**.
