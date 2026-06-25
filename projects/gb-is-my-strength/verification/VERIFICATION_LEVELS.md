# Verification levels

Use these labels in future reports for `gb-is-my-strength`:

| Label | Meaning |
|---|---|
| `suspected` | hypothesis only, not confirmed |
| `needs-recheck` | one agent reported it, but evidence level is incomplete or conflicting |
| `verified-source` | confirmed directly in source files |
| `verified-build` | confirmed in built artifact (plain Astro dist) |
| `verified-browser` | confirmed via browser interaction |
| `verified-production-like-dist` | confirmed in browser against strangler production-like artifact |
| `false-positive` | disproven after verification |
| `audit-drift` | tool/script expectation is stale rather than route being wrong |

## Important rule

For this project, `verified-production-like-dist` should outrank `verified-source` whenever the two disagree.
