# Conflict Registry — 2026-06-26 — baptisty SEO lane collision

## C-BAPT-01 — two parallel lanes fix the same baptisty SEO bug (S3-N1 + S3-N2)

- **Lane A:** `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` (agent: arena-agent-session3, this intake)
- **Lane B:** `lane/baptisty-seo-structured-og-2026-06-26-arena` (another agent)

Both independently:
- add `BreadcrumbList` JSON-LD to baptisty PageHeads,
- switch og:image from SVG to WebP (`cover-01-kura.webp`, `image/webp`).

Confirmed by inspecting Lane B's `BaptistyRossiiNochNaKurePageHead.astro`:
`BreadcrumbList`=1, `cover-01-kura.webp`=4, `image/webp`=1 — same outcome as Lane A.

### Differences (scope)
- **Lane A** (session3): 11 PageHeads + 11 generated WebP covers (via sharp from existing SVGs) + lane report. Scope = strictly the SEO bug.
- **Lane B**: broader — also touches all `*Body.astro`, all MDX, `AvraamMap.astro`, `MapBody.astro`, `src/pages/map/index.astro` (60 files). Looks like a combined SEO + map-parity + content lane.

### Status: unresolved — needs integrator decision
- This is NOT a correctness conflict (both fix the bug correctly); it is a **merge/dedup** decision.
- Risk: if both merge, the second will conflict on the PageHead files.

### Canonical action (recommended)
1. Integrator picks ONE baptisty-SEO source of truth. Suggest:
   - take the **PageHead BreadcrumbList + og:webp** change from whichever lands first;
   - ensure the **11 WebP cover assets** are included (Lane A generated them; verify Lane B references the same filenames — it does: `cover-01-kura.webp`). If Lane B references webp but does NOT add the binaries, Lane A's `images/baptisty-rossii/*.webp` must be merged too, else og:image 404s.
2. Mark the duplicate lane as superseded; keep the other.
3. Re-run baptisty dist JSON-LD sweep + og:image existence check after merge.

### Note
Flagging instead of force-merging, per AuditRepo coordination rules (avoid stepping on another agent's lane). Lane A remains pushed and self-consistent (includes the webp binaries) if the integrator prefers the minimal-scope version.
