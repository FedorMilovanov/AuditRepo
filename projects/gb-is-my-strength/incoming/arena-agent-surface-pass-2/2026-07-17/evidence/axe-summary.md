# Axe WCAG A/AA witness

Environment: production-like `dist`, Playwright Chromium, `390×844`, service workers blocked.

## Admitted violations

| Route | Rule | Impact | Target | Result |
|---|---|---:|---|---|
| `/map/` | `button-name` | critical | `#atlasFilterTrigger` | Visible mobile filter button has no accessible name |
| `/map/` | `aria-allowed-attr` | critical | `#atlasSearchInput` | `aria-expanded` is not allowed on native searchbox role |
| `/articles/dzhon-gill-chast-1-chelovek/` | `scrollable-region-focusable` | serious | overflowing `table.manuscript-table` | Scroll region is not focusable and has no focusable descendants |

A separate live census broadened the table predicate to nine overflowing tables on four Gill routes. Color-contrast and previously documented tooltip findings from the representative axe run are outside this package and were not admitted as new work.
