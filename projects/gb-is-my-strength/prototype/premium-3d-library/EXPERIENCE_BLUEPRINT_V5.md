# Premium 3D Library — V5 experience blueprint

**Status:** `lab-active`, not `promotion-ready`. Owner: Fedor Milovanov. Product: `gb-is-my-strength`.
**Date:** 2026-11-08. Audience: reader, researcher, owner-curator. Scope: ONE 3D Library prototype, no Product edits.

## 1. Product identity — one corpus, several views

```text
Product route/content/search registries (sole authority)
       |
       +--> normal HTML reader + book mode, including no-JS
       |
       +--> public canonical catalog (projection; never hand-maintained)
                  |
                  +--> 2D semantic sitemap / shelf list
                  +--> 3D architectural library / spatial map
                  +--> search + stable canonical URL/deep-link

Product GBReaderLibrary V3, ReaderState, existing reader bookmarks,
OverlayRuntime, and GBSearch (sole live owners)
       | contract-based future adapter (NOT IMPLEMENTED)
       +--> personal reading desk / exact quotes / notes / collections

Lab-owned simulated demo progression (not verified learning events)
       +--> optional decorative personalization only
```

Do not create a second Product content registry, second search index, or independent, mutable user account. `src/data.ts` is the **historical Arena display fixture**. It is not a publication source and should be replaced at Product admission with source-owned projections.

## 2. Spatial information hierarchy — 7 scales

| Scale | Physical metaphor | Actual behavior | 2D accessible equivalent |
|---|---|---|---|
| 0 | threshold / entrance | choice: explore, browse, continue, personal desk | one ordinary navigation page |
| 1 | wings / halls | sections derived from `librarySection` | grouped canonical headings |
| 2 | shelf / collection | categories and subjects, no fabricated editions | filtered article list |
| 3 | volume / series | series cards and chapter table of contents | canonical series landing |
| 4 | chapter / article | opens the current Product-owned reader; no WebGL text renderer | normal HTML article |
| 5 | annotation / citation | precisely anchored quote + edition + note, review status | reader controls and cabinet |
| 6 | personal desk | recent work, folders, bookmarks, saved excerpts, privacy controls | standard account/dashboard |

Spatial metaphor is an *optional* navigation layer. The book is not stored inside a 3D mesh. Public content must remain discoverable by the search engine and readable without WebGL.

## 3. Architecture and art direction

- **Place:** quiet monumental stone-and-oak library, not a theme park or glowing fantasy temple.
- **Hero frame:** naturally lit reading table in a room, with convincing joinery, believable shelves, window light and restrained material reflectance. AI concept is a **mood reference**, not evidence of rendered WebGL quality.
- **LOD budget:** profile by measured GPU rather than a blanket model polygon count. Use glTF + mesh compression and texture compression when measurements justify them; render architectural set pieces with bake-ready materials. No promise of 60 FPS without measurements.
- **Graphic modes:** high, balanced, low and 2D-only. Canvas becomes dormant when hidden; suspend input for open dialog; honor reduced motion.
- **VR:** optional behind capability detection and its own QA. Never deny access to materials without VR.

## 4. Personal cabinet and synchronization

The V4 IndexedDB vault is a *lab-specific* private demonstration, completely isolated from Product. The V5 import now uses the same optimistic compare-and-write as normal edits. This prevents silent replacement by a stale tab after user confirmation. A corrupt stored database is never auto-overwritten.

`src/catalog/adapter.ts` introduces a read-only projection boundary: it accepts route policy (version 1) and verified public metadata, excludes noindex/excluded/unlisted entries, and supplies stable IDs. It **does not fetch live content** and therefore cannot claim the current source catalog is synchronized.

Future personal quote data needs stable content identifiers, exact text, nearby prefix/suffix, author/editor attribution, translation/edition, URL/anchor, and verified match state. Duplicate quotes remain explicitly ambiguous. Do not claim historical authorship solely from a quote typed by a reader.

**No cloud account yet.** Cross-device sync needs explicitly approved authentication, server access control, export/delete features and migration. Local data alone is not durable across device loss.

## 5. Rewards, safeguards, and educational ethics

- 10 ranks are optional study progress, **not spiritual maturity**. No public ranking, paid XP, streak pressure, spiritual authority, religious merit points, or gated Scripture.
- Scores are derivations from canonical user-visible events. Lab events are editable client-side and are not trusted; a future Product adapter needs server-side independent validation if rewards acquire external consequences.
- Time validation is canonical UTC; impossible calendar dates rejected, event count bounded. Previous V4 valid UTC strings without fractional seconds remain accepted to avoid data loss.
- Cosmetic rewards: shelf veneer, lighting choices, ex libris and desk objects. Purchase never changes reader access or editorial rankings.

## 6. Concrete acceptance journeys

1. **Reader without WebGL:** open library → keyboard select section → canonical article → browser Back → personal bookmarks. No broken canvas overlay; no loss of focus.
2. **Reader with WebGL:** enter library → move to shelf → choose series → open canonical HTML → save bookmark → return to desk → find same bookmark. Requires Product adapter; **not achieved**.
3. **Citation:** select exact text on a real article → save with edition → reload → follow back to correct heading; after article update show `needs-review` instead of fabricated success. **Not achieved**.
4. **Multi-tab safety:** tab A opens vault; tab B saves record; tab A attempts full import → stale-write error, B’s record remains. Code guard present; real-origin IndexedDB browser witness pending.
5. **Graphic degradation:** lose WebGL context → 2D routes and cabinet remain accessible. Static fault handling present; actual GPU loss witness pending.
6. **Progress:** repeat same action, bad dates, forged XP and overspent tokens → no silent credit. Tests local only.

## 7. Release gates / stop conditions

| Gate | Current | Must pass before Product consideration |
|---|---|---|
| TS module parsing / imports | PASS | preserve |
| Catalog policy projection + noindex | PASS in fixture tests | exact Product registry and metadata projection |
| Cabinet pure-engine and import rules | PASS | real-origin IndexedDB, reload, cross-tab, backup/restore |
| Progress integrity | PASS | Product-verified event contract, no client trust |
| React/Vite production build | NOT VERIFIED | clean npm ci, typecheck, build, all imports |
| Desktop WebGL aesthetic | NOT VERIFIED | 3 viewport screenshots, camera route QA, memory check |
| Mobile/WebKit | NOT VERIFIED for 3D | 320 / 390 / 768, touch, long labels, reduced motion |
| FPS + GPU recovery | NOT VERIFIED | representative hardware, low/medium/high and fallback |
| Product bridge | NOT IMPLEMENTED | owner-approved SYSTEM lane and exact-head tests |
| Owner visual signoff | PENDING | before any Production implementation |

## 8. Next bounded work packages

- **A:** get clean offline/online build + browser witness of current actual 3D scene; no new visual claims beforehand.
- **B:** design one excellent architectural bay and one reading desk with real meshes/textures, profile GPU and fix root bottlenecks.
- **C:** Product route-projection contract with published route metadata (read-only), 3D item IDs derived from it, 2D accessible sitemap.
- **D:** integrate cabinet with canonical Product reader only after owner approval, avoiding Product storage duplication.
- **E:** visual personalization/levels as an independent optional skin, never as access control.

No automatic upload/deployment, no mutation of existing Product PRs, and no merging with HOREB or Names-of-God lanes.
