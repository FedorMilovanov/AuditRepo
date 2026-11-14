# Professional non-destructive rollout — V26

**This file is a plan, not a request to mutate Product automatically.**

## Gate 0: source control, owners and release identity

Before writing in Product: read docs/LANE_LOCK_POLICY.md, current Product HEAD, open PRs/branches, AuditRepo MASTER, exact canonical build scripts and published release fingerprint. Latest verified source anchor: Product main 717efc54772edf4224f44254651c102e2af24129, Library V3 #2283 merged and CI/deploy workflow green; this does NOT independently establish actual live releaseSha. Print PR #2269 and deps PR #2268 remain separate. Do not share editor ownership or rewrite their files. No new worktree/branch sprawl without a bounded owner.

## Gate 1: exact baselines before code change

Collect real screenshots + DOM/geometry on a standalone Hermeneutics page, Gill introduction and Part II, Baptists book article 06, and an unaffected control route. Freeze real heading IDs/order, slug/canonical links, Gill leather ribbons, real four vertical SVGs, search/settings/library/Play/print, source and release SHAs. Match viewports 320/390 MOBILE (must remain identical), 781×300, 900×300, 900×480, 1024×768, 1480×900, 1920×1080; Day/Sepia/Night, 130% font, open/closed, current H2/H3/H4, middle of article. Record both horizontal overflow and actual TOC viewport height (V25's 14px mistake). Freeze article reading-axis rectangles. Keep same-state screenshot pairs, not loose visuals.

## Gate 2: pure typed read-only adapter, single data owner

Project existing SeriesConfig / partToc / rendered DOM anchors into one hierarchy: book chapter→article→H2→H3/H4, flat series part→H2/H3/H4, standalone H2→H3/H4. Validate missing and duplicate anchor IDs, heading order, invalid nesting, route registration and unchanged published slugs. Preserve historic Gill numbering and sec-gill-last-pages. Supply unit/contract tests with real + deliberately malformed fixtures. **No UI change in the adapter PR.**

## Gate 3: one reversible desktop component

Use one scoped GrokReaderTree view **inside existing ReaderRail/GillSeriesRail/page owners**, behind route/family pilot flag with old markup as fallback. No entire page-shell rewrite or global CSS surgery. Reuse data-series-theme tokens and keep reader theme independent. Never substitute prototype's 781px experimental breakpoint for site's actual family breakpoints. Short-height compact treatment must still show the five commands and >= practical navigable height; measure per Product family's header geometry. Keep unchanged original mobile reader.

## Gate 4: existing behavior owners, zero duplication

- GBReaderPreferences remains the only settings/theme owner, including Sepia return after Night.
- GBSearch and canonical Pagefind/manifest remain search owners. Book context must filter the real index, not return a fake title-only search.
- PlayEmber remains Play/speed owner; no sample audio control or new MediaSession.
- Merged GBReaderLibrary V3 remains owner of favorites, reading statuses, continue/revisit, local backups/imports, highlights, local keys. Do not copy demo localStorage or make another dock.
- SiteSectionsMenu + OverlayRuntime own popover lifecycle/focus; view may position it near originating button.
- Existing ReaderState/scrollspy owns current section, anchor and scroll compensation. No second window.scroll/IntersectionObserver owner. Product uses native canonical navigation; do not copy synthetic demo fragment grammar.
- Existing print/share engine remains, with independent #2269 print PR; original GillLeatherRibbon/Defs stay untouched.

## Gate 5: proof matrix at exact PR head

**UI:** scrollspy, deep heading jump to closed ancestor, multi-line active bar, connectors on H2 leaves only, no H3+ trunks, 5 actions available at 900×300, same-Y collapse/expand ≤1.5px, no toolbar collision, smooth and interruptible width transition at 0/90/180/350/650ms, reduced-motion instant behavior, accessible focus/inert/aria, Escape/popovers, Back/Forward including initial page.
**Functional:** real Library V3 save→status→reload→continue→backup, canonical global/scoped search, authentic Play/speed, print/PDF A4, service worker caches, no changed href/id/visible prose.
**Technical:** production-like Astro/dist build and existing exact scripts (discover current package), Gill pre-v16 contract, Reader Controls Accessibility, search modal and cold-bootstrap, WebKit reader-axis historical 334px overflow, source/dist identity and mobile no-change witnesses. Execute Chromium, Firefox and WebKit, not just Chromium. No all-green exact head and reviewable same-state screenshots: no merge.

## Gate 6: safe release and rollback

Start with one standalone desktop route; after its signoff pilot Gill + Baptist separately; widen only after each family validates. Rollback = disable narrowly scoped pilot flag, NOT a broad Git revert that undoes new Library V3 or other agent print work. Remove old CSS only after zero-consumer proof. Confirm deployed releaseSha and actual live routes post-merge; adjust AuditRepo verified MASTER only for confirmed current work and retire completed rows by evidence.

**Absolute stop-ship:** missing historic anchor; second owner for library/theme/search/TTS/scroll; any mobile visual or behavior change; unreadable short-height TOC; hidden keyboard focus; WebKit overflow/reader-axis jump; leaked print controls; exact release identity unknown; Library V3 data-loss or state regressions.
