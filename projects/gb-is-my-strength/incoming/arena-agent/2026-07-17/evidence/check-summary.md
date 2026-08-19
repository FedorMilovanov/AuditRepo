# Check and disposition summary

## Passed

- AuditRepo structure and repository validation
- AuditRepo matrix coverage
- Product `validate`, `validate:seo`, `validate:strict` (warnings only)
- production dependency audit (zero known vulnerabilities)
- direct Astro build
- legacy-to-dist production-like copy
- cache-bust/editorial/reader postbuild with exact build instant
- dist JSON-LD/SEO
- production schema rich-results audit (optional-image warnings only)
- production-like page ownership
- dist publication audit
- service-worker dist readiness
- content parity and coverage
- article QA, readability, editorial lint
- strict migration metadata and native runtime taxonomy
- Gill claims and Pagefind checks
- repository control-plane audit
- literal internal route/asset/fragment scan over 89 generated HTML files

## Failed and admitted

- `npm run data:consistency`: six false missing-image errors; one root cause.

## Failed/noisy but rejected

- Git-dependent checks in ZIP/no-Git environment
- browser launch without `libglib-2.0.so.0`
- reference-only root schema mismatch corrected in production dist
- frontmatter regex warning on `"4Q204"`
- sandbox DNS failures for three independently reachable BnF records
