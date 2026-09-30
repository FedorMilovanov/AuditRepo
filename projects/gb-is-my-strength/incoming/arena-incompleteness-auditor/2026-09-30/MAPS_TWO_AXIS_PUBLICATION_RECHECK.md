# Biblical maps: public-route status versus curated hub (2026-09-30)

Source anchors: Product `main@5e76c6ec81f3c192510c70e49a3deba64fb676c2`, Research `main@2c0f1e375943108dfd582ac22a364fd1e711b4d1`. Source-only classification; no new visual/browser acceptance.

Enumerated all **11** `karty/*/route.json` records and read `publication.status`, `indexable`, `sitemap`, `pagefind` and `hub` alongside `karty/index.html`, `data/search-manifest.json`, `migration/page-ownership.json`, `scripts/validate-map-routes.js` and `scripts/check-map-publication-status.js`.

| Class | Routes | Source publication contract |
|---|---|---|
| `ready` + `featured` | `avraam` (1) | hub featured, public/indexable |
| `ready` + `withheld` | `ishod` (1) | **already** public/indexable/sitemap/Pagefind/manifest + `production-dist`, but not promoted to the curated `/karty/` showcase |
| `temporary-placeholder` + `withheld` | `early-church`, `maccabim`, `melachim`, `pavel`, `revelation`, `shoftim`, `shvatim`, `yeshua` (8) | direct holding routes, non-indexable, no Pagefind/sitemap; visual audit not a publication permit |
| `draft` + `withheld` | `nachalo` (1) | draft prologue, non-indexable, withheld; route metadata says waits for G9 owner |

Thus the hub's **1 open / 9 on audit / 0 drafts on showcase** is a *curation summary*, not the count of ready or indexable routes: its nine off-showcase map slots correspond to the eight placeholders plus `ishod`, while `nachalo` is a separate draft not displayed on the showcase. Neither “all nine are noindex” nor “Ishod is not implemented” follows. Product's ready-status validator explicitly requires `indexable`, `sitemap`, `pagefind` true even when `hub: withheld`; the map-publication guard enforces noindex on temporary placeholders, not on ready-withheld maps. `IshodPageHead.astro` uses `index, follow` and the manifest includes `/karty/ishod/`. Any claim that off-hub means private/unpublished would be false.

Research `БИБЛЕЙСКИЙ АТЛАС/00_CURRENT_AUTHORITY_2026-08-02.md` still labels Pihahiroth Product polygons “implementation required” **as of Aug 2**; Product `IshodMap.astro` and `pihahiroth-authority.json` now implement three uncertainty corridors, hide the exact point, and preserve the caveat. This resolves an old source-vs-current implementation misunderstanding, not a fresh admission of visual quality. Before marking Wave 6 closed, verify the eight placeholder exits, the `nachalo` draft owner decision, and whether the intentionally public/indexable but hub-withheld Ishod passes the owner visual showcase gate. No duplicate MASTER defect is justified by the two-axis classification alone.
