# ГБСМ — пространственная библиотека, карта сайта и личный кабинет

**Design RFC / laboratory proposal · 2026-11-08 · status: proposed, not implemented**

Scope: standalone Premium 3D Library Lab. No changes to `gb-is-my-strength`, `AuditRepo`, GitHub PRs, branches or deployment. This file is a proposal, not a new current authority for the Product repository.

## 0. Product thesis

This is **one content and reader-data system expressed in three interfaces**, not three independent apps:

1. **Site & reader (canonical)**: semantic articles, series, search, exact citations, TTS, bookmarks, progress.
2. **2D library / personal study**: shelves, saved excerpts, notes, collections, progress and accessibility-first tasks.
3. **3D library & spatial sitemap**: naturalistic architectural world to discover, browse and return to canonical materials.

The library is optional; users should be able to reach every published destination without WebGL, motion, login, or large downloads. Personal content stays private by default.

### Verified repository constraints (read-only, 2026-11-08)

- Product: `docs/GROK_V27_PRODUCT_RELEASE_GATE_2026-11-07.md` explicitly names `GBReaderLibrary V3`, `ReaderState`, `GBReaderPreferences`, `GBSearch`, `OverlayRuntime`; do **not** duplicate them.
- Product: `docs/REFERENCE_TRANSFER_POLICY.md` protects existing Favorite Store and other reader flows as `native-contract`.
- Product: `docs/SEARCH_INDEX_POLICY.md` declares `data/route-search-policy.json` the publication membership source; `librarySection`, `topicCategory`, `contentKind` belong to that metadata, and personal surfaces must be `noindex`.
- AuditRepo: `references/PROTOTYPE_LAB.md`, `references/prototype-lab/WORKFLOW.md` govern prototypes: evidence, no second source of truth, owner acceptance before Product transfer.
- The current lab `src/data.ts` has handwritten ITEMS; `src/store.ts` currently saves only presentation settings / visited 3D stations. Neither is a new authorized personal-data owner.

These declarations do not prove the exact current Favorite Store implementation or compatibility API; inspect exact Product source and existing browser contracts **before any integration**.

## 1. Functional model and spaces

### Public immersive library

- **Entrance / central catalog**: public sitemap, universally available 2D list with keyboard-accessible controls; 3D markers are alternate navigation.
- **Subject shelves**: derived from canonical published route classifications (`librarySection`, `topicCategory`), not manually maintained per-room lists.
- **Series gallery**: chronological sequence / parts, one canonical URL per published item, clear statuses.
- **Authors & history hall**: biographies, documentary sources and verified quotations with credits; do not conflate historical author quotes with user-highlighted text.
- **Reference/maps desk**: published maps only; unapproved/draft works are excluded.
- **Personal reading alcove**: beautiful private desk in the 3D hall, opening a normal, responsive HTML cabinet; no unreadable 3D text for notes and citations.

### Personal cabinet — 2D tasks

- **Overview**: continue reading, recently saved, current series, recent notes, pinned collection.
- **Bookmarks**: article, chapter, H2/H3 anchor, date, personal tags; open exactly where saved.
- **My quotations / highlights**: selected exact snippet, edition/author/source, link to passage, own note, tags, copy; unresolved reanchor state when article changes.
- **Collections (my shelves)**: user-created folders; item can appear in multiple shelves; stable ordering; private by default.
- **Reading history and progress**: last visited anchor and optional percentage; clear history and pause recording.
- **Preferences**: use canonical Product `GBReaderPreferences` instead of cloning font/theme/TTS controls.
- **Data & privacy**: offline/local status, account sync status (if added), JSON export/import, delete notes or all user data.

Optional **learning progression** may show noncompetitive levels, badges and cosmetic library rewards as specified in `PROGRESSION_SYSTEM_RFC.md`, in response to the owner's new request. It must not rate spirituality, block content, reward mere clicks, force daily streaks or become a second Product store. No forced login, no automatic public sharing of personal notes, no invented/attributed "quotes".

## 2. Navigation and interaction

```text
Published article / canonical reader
  ├─ Save passage → common reader-data API → My quotations
  ├─ Bookmark paragraph → common reader-data API → My bookmarks
  └─ Continue reading → existing ReaderState / compatible adapter

2D personal cabinet ← same reader-data contracts → 3D personal alcove
                 ↕
         Published catalog adapter
                 ↕
3D shelves / sitemap → canonical article / exact anchor
```

**Examples (desired, not implemented)**:

1. Reader highlights text in an article and saves it with a note.
2. In 3D, a quiet reading desk shows that saved excerpt as a *card*, never as a publicly world-visible inscription.
3. Opening the card moves to the exact paragraph in the canonical reader. Closing restores the 3D camera pose.
4. If the article was revised, unresolved highlights show **"место не найдено; проверить"** rather than attaching to the wrong passage.

The interface is a library, not a first-person game: explicit click-to-navigate, accessible 2D mode, optional first-person exploration, reduced motion, no compulsory intro.

## 3. Proposed data shape (not a duplicate Product schema)

Adopt or adapt only after inspecting existing Product owners. Stable IDs must not be generated from visual mesh names or display titles.

```ts
// Illustrative contracts, NOT shipped code or an approved migration

type PublishedItemRef = {
  contentId: string;           // canonical stable content identity
  canonicalUrl: string;        // verified published route
  sectionAnchor?: string;     // semantic heading or paragraph ID
  sourceRevision?: string;
};

type ReaderBookmark = {
  id: string; target: PublishedItemRef; createdAt: string;
  updatedAt: string; collectionIds: string[];
};

type ReaderExcerpt = {
  id: string; target: PublishedItemRef;
  exact: string; prefix?: string; suffix?: string; // W3C TextQuoteSelector
  start?: number; end?: number;                    // optional position selector
  sourceAttribution: string; sourceEdition?: string; citationUrl?: string;
  personalNote?: string; tags: string[];
  anchorStatus: 'verified' | 'needs-review' | 'unresolved';
  createdAt: string; updatedAt: string;
};

type ReadingPosition = {
  contentId: string; sectionAnchor?: string; percentage?: number;
  updatedAt: string;
};

type ReaderCollection = {
  id: string; title: string; orderedItemIds: string[];
  updatedAt: string;
};
```

Quotes from public site/source registry: verified, editorially checked, source/edition metadata, separate from the user's selections. Never present summaries as verbatim quotations; preserve translation and rights constraints. Personal snippets are private user selections, not automatically endorsed site quotations. Consider using the W3C Web Annotation Model (TextQuoteSelector with exact/prefix/suffix; TextPositionSelector as secondary aid).

## 4. Storage and sync — architectural options

**Initial experiment**: same-origin adapter to existing `GBReaderLibrary V3`/Favorite Store + IndexedDB for *new* structured objects only where no canonical owner exists. Use storage schema versioning, migration tests, export/import and backup messaging. Browser storage is not guaranteed against device loss or user clearing data.

**Optional authenticated sync later**: static Pages frontend alone has no user-account backend. Evaluate an independently secured Auth + DB service and document costs, operational responsibility, privacy and portability. For a Supabase-like Postgres architecture, enforce row-level access controls per owner on every private table; never treat client checks as security. Sync requires conflict rules, offline outbox, idempotent imports and delete propagation (tombstones). Do not ship cloud service secrets to JS bundles.

**Conflict safety**: bookmarks are set-like with stable IDs and tombstones; notes need explicit resolution on conflicting edits; reading positions should not overwrite a more recent user choice because a stale tab reconnected. Tests across anonymous→logged-in migration, two tabs, two devices, offline/online, and revoked sessions.

## 5. Visual experience — premium, not fantasy

- Natural limestone, wood, books, subtle brass, real architectural proportions; generous windows, soft morning daylight and restrained warm task lighting.
- A single personal reading alcove opens in a normal HTML drawer/sheet. No delicate editable text directly mapped onto 3D objects.
- Typographic system shared with the Product reader only when approved by current owner. No second competing site-wide design token authority.
- Avoid unnecessary golden lines, magical beams, forced cinematic fades, constant ambient movement and overwhelming floating controls.
- 3D rendering may be hidden/off while the cabinet is open; accessible content and data operations must function with graphics disabled.

## 6. Technical boundaries

- Canonical content/index: derive from Product registries and build projections, not an alternative authored list in AuditRepo.
- Client navigation: route to Product's canonical pages/anchors; never invent or expose draft URLs.
- Personal dashboard: use existing reader runtime as semantic owner; prototype includes only a mock adapter until owners are inspected.
- Render: WebGL2 baseline, GPU-quality tiers tested by frame time; keep WebGPU as isolated research. Lazy load scene after explicit opt-in.
- Performance: baseline no-3D page must not pay 3D bundle/texture costs; 60 FPS on suitable desktop and 30 FPS mobile are tentative measured goals, not promises.
- Security: private surfaces noindex, auth/session validation, XSS-safe text, private RLS if cloud sync used, no personal data in public static manifests/caches or telemetry by default.
- Accessibility: independent DOM navigation, Tab/Escape/focus return, touch targets, prefers-reduced-motion, text alternatives and reader without canvas.

## 7. Acceptance tests before any Product transfer

1. Save bookmark in Product article → appears in 2D cabinet and 3D alcove → opens *exact anchor*; repeat backwards. No duplicate owners.
2. Save highlighted quote with source attribution, update article around quote → reanchor correctly or show unresolved; never silently link to a wrong passage.
3. New published route appears exactly once in generated spatial catalog; retired/noindex/unpublished routes do not appear.
4. Personal data survives same-origin navigation and reload; export/import round trip is idempotent; data deletion clears relevant stores.
5. Anonymous mode works without account; after optional sign-in data can merge without overwriting or accidental sharing.
6. Test Chromium + WebKit, 320×760, 390×844, 768×900, 1440×900 and 1920×1080; keyboard-only, mouse/touch, reduced motion, no-WebGL and WebGL context loss.
7. 3D load does not inflate ordinary article/search LCP; measure p95 frame time, GPU memory, loading and CPU/battery impact, and provide graceful fallback.
8. User visually approves real screenshots and navigation flows before transfer; current exact-head Product CI and subsequent live witness are separate gates.

## 8. Proposed staged implementation (no automatic push)

- **Wave L0 — inventory / owner reconciliation**: inspect current `GBReaderLibrary V3`, Favorite Store, `ReaderState`, `GBSearch`, reader overlays, route registries, migration rules; define semantic owners. No code mutation.
- **Wave L1 — 2D cabinet prototype**: keyboard-first dashboard with mock data and workflow visual acceptance; no backend.
- **Wave L2 — common data adapters**: bookmark/quote/collection models + migration, persistence and full unit tests in isolated lab; no second Product storage.
- **Wave L3 — 3D connection**: personal study zone, spatial catalog derived from published metadata, deep link/camera return, graceful no-WebGL mode.
- **Wave L4 — measured polish**: desktop/mobile UX and p95 frame-time optimization, rights audit, performance budgets, accessibility.
- **Wave L5 — optional cross-device sync feasibility**: security, cost, account deletion, privacy review, explicit owner approval before infrastructure.
- **Wave L6 — Product promotion decision**: selectively transfer capabilities into current Product owner via separate scoped PR only when explicitly authorized.

**Updated implementation note (V4, local Lab):** A real standalone personal-cabinet data engine, IndexedDB adapter, React panel and independent browser preview now exist; see `CABINET_LAB_IMPLEMENTATION.md`. These remain Lab-only and are not Product integration, account sync, editorially verified quote capture, generated registry projection or personal 3D furniture.

## Research references (verified 2026-11-08)

- W3C Web Annotation Data Model: https://www.w3.org/TR/annotation-model/
- MDN IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
- MDN Storage quotas and eviction: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN keyboard accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard
- Three.js WebGPURenderer: https://threejs.org/manual/pages/webgpurenderer
- Supabase RLS documentation (example implementation choice, **not selected**): https://supabase.com/docs/guides/database/postgres/row-level-security
