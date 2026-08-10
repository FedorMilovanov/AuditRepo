# Wave 05 — narrow navbar geometry + biography structured-data drift + PWA cache review

Date: 2026-08-10
Auditor: ChatGPT autonomous browser/source wave

## Anchors

- Product current main checked before analysis: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- AuditRepo main rechecked immediately before this write: `fdcfc1a3f44d0ec26309bca4b580a9079cdbe7e5`
- Product mutation: **none**

## Capability boundary

Fresh local clone / local Playwright remained unavailable because the execution container could not resolve `github.com`. Public web retrieval was available for the live home surface and search-index witnesses, but direct uncached fetches of several nested routes/assets intermittently failed in the web backend. Therefore this wave does **not** claim a fresh real-browser pixel reproduction for the narrow breakpoint candidate. Findings are classified by evidence strength below.

---

## Finding A — `/biografii/` JSON-LD `hasPart` carries a stale canonical article name

**Disposition:** `CONFIRMED-CURRENT / source metadata drift`; current live structured-data fetch still desirable before MASTER promotion.

Current `src/components/biografii/BiografiiPageChrome.astro` emits a `CollectionPage` JSON-LD node whose `hasPart` contains:

- URL: `https://gospod-bog.ru/articles/dzhon-gill-chast-1-chelovek/`
- name: `Джон Гилл (1697–1771): доктор Многотомный — защитник Троицы и гигант библейского богословия`

The canonical current article metadata on the same Product head in `src/content/articles/dzhon-gill-chast-1-chelovek.mdx` is:

`Джон Гилл (1697–1771). Часть I: Человек — детство, призвание, семья`

The public home/search witness also exposes the newer title family (`Часть I: Человек — детство, призвание, семья`), so the old `hasPart.name` is not just stylistic variation inside one current source of truth.

### Why this matters

This is structured-data identity drift: a collection page tells crawlers that a canonical child URL has a materially different old title than the current article metadata and current library projection. The `hasPart` array is optional and being incomplete is not itself a defect; the confirmed issue is the stale identity attached to the child URL.

### Next verification

1. Fetch deployed `/biografii/` HTML on the exact deployed SHA and parse the JSON-LD graph.
2. Confirm that the stale `hasPart.name` is present in production bytes rather than source-only pending deploy.
3. Check whether existing metadata/structured-data contracts compare `hasPart` identities to canonical content metadata. If not, treat this as a small current SEO contract gap rather than a route-local one-off.

Do not hand-edit several title copies if a canonical projection can own this relation.

---

## Finding B — shared navbar has a likely 761–~800 px no-man's-land

**Disposition:** `CURRENT-SOURCE GEOMETRY CANDIDATE`; requires screenshot/browser witness before MASTER.

The shared `home.css` navbar geometry on current main has these simultaneous constraints:

- `.h-navbar__inner`: `max-width:1000px`, `padding: 0 28px`, `gap:24px`;
- logo parts use 18 px serif text, `white-space:nowrap`, `flex-shrink:0`;
- `.h-nav-links` is a single non-wrapping flex row; every link is `white-space:nowrap`;
- at `761–1100px`, links are only reduced to 12 px text and 12 px gaps;
- the hamburger is hidden until `max-width:760px`;
- the full desktop link row is hidden only at `max-width:760px`.

At 761–800 px the layout therefore keeps the complete desktop logo + five nowrap links + theme/control cluster while the inner content box has already shrunk to roughly viewport minus 56 px. There is no intermediate compact-nav mode, wrapping rule, or earlier hamburger handoff.

Because flex items retain intrinsic nowrap widths, this creates a credible narrow-desktop/tablet collision/overflow band immediately above the mobile breakpoint. This is exactly the class of defect that endpoint-only 390/1440 screenshots can miss.

### Required browser witness

Capture at minimum 761, 768, 800, 820, 860 and 900 px for:

- `/articles/`;
- `/biografii/`;
- home;
- one article/reader route using the same shared navbar.

Measure navbar child bounding boxes and assert no overlap, horizontal viewport overflow, clipping, or control occlusion. If reproduced, fix the shared breakpoint/root geometry rather than individual routes.

---

## Finding C — article catalog content width itself does **not** support the earlier "too-narrow column" suspicion in the 761+ band

**Disposition:** `NARROWED / negative source witness`.

Current shared CSS gives ordinary `.home-content` a `max-width:1000px`, while `body.articles-index-page .home-content` expands to `max-width:min(1120px, calc(100vw - 80px))` above the mobile breakpoint. The catalog cards are a two-column grid where appropriate and collapse under dedicated mobile rules.

Therefore the current source does not show an obvious forced ultra-narrow reading column for `/articles/` at tablet/narrow-desktop widths. The more credible risk in that band is the **navbar**, not the main catalog container. Keep the historical "too narrow" concern open only for route families with an actual browser screenshot/geometry witness; do not generalize it from old reports.

---

## Finding D — PWA cache review did not produce a new current defect in this pass

**Disposition:** `NO NEW DEFECT / reviewed`.

Current `sw.js` explicitly bypasses cache handling for audio/video/range requests and `/audio/`, `/tts*`, media/model binary paths. That means TTS/audio startup timing should not be attributed to stale service-worker cache interception without a network witness.

HTML is network-first with cached-page fallback; Pagefind static/data and mutable JSON use dedicated strategies. No new source-level broken-cache mechanism was established in this pass. The previously identified missing user-perceived latency measurements remain a measurement gap, not a defect.

---

## Live/public witness notes

The live home surface remained retrievable and continues to present search as a first-class library action with `Ctrl K`. Search-engine/public crawl output exposes current Gill part titles rather than the stale `biografii` JSON-LD child name, strengthening the structured-data drift classification while not proving the exact live JSON-LD bytes.

---

## Collision / mutation note

No Product files, PRs, branches, cemetery refs, MASTER rows, or Work Queue entries were modified. This is a unique incoming evidence file. AuditRepo head was rechecked immediately before publication and had not advanced beyond the previous ChatGPT wave, so no parallel AuditRepo work was overwritten.
