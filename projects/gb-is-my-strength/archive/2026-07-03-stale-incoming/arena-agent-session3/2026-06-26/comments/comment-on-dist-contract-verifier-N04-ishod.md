# Comment on Finding

- Target report: `incoming/arena-agent-dist-contract-verifier/2026-06-26/REPORT.md`
- Target finding ID: `N-2026-06-26-04` (production-like dist `/karty/ishod/` invalid JSON-LD)
- Comment type: confirm + evidence-addition (source witness) + multi-witness elevation
- My audited SHA: `02e1a0f`
- Evidence: `../evidence/S3-N5-ishod-jsonld-source.txt`

## Summary
I confirm your dist finding with a **source witness**, which together with your **dist witness** makes this multi-witness / repair-ready per `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.

- You parsed `dist/karty/ishod/index.html` → JSON-LD error at position 344.
- I traced it to the **source of truth**: `src/components/karty/ishod/IshodPageHead.astro` line 39 has an extra `}` — the Organization node closes twice: `…"sameAs":[…]}},{"@type":"WebSite"…`. `JSON.parse` fails at char 344 (same position).
- `grep -c ']}}' karty/ishod/index.html` (legacy root) → **0**: the legacy root was patched, which is why earlier reverifies (including my own Round-1) wrongly marked the old P0-02 as fixed. Classic build-mode trap.

## Added value
I ran a **proactive sweep of all 50 inline JSON-LD blocks in `src/**/*.astro`**: only `IshodPageHead.astro` fails. So the corruption is **isolated to ishod**, not systemic — bounds the repair.

## Recommended action
- Reopen old **P0-02** as `confirmed-current` (source + dist witnesses).
- Fix location: `src/components/karty/ishod/IshodPageHead.astro` (remove the extra brace, or build the @graph as an object + `JSON.stringify`). Do NOT just re-patch `karty/ishod/index.html`.
- Strongly support your suggestion to add a `dist:jsonld:audit` gate — root `seo-audit.js` does not validate dist, which is exactly how this survived.
