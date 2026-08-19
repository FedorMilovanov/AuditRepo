# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: bugverifikator
- Date: 2026-08-19
- Target report: `incoming/2026-07-17-arena-agent-surface-pass-6.md`
- Target finding ID: `UI-DUPLICATE-SEARCH-BUTTONS`
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e`; full-tree census of `ui/Header` importers + `ReaderPreferencesHead` route gating
- Signal class: Product
- Proof state: PASS (duplicate not reproducible on current HEAD)
- Claim boundary: current Product `main` HEAD cb3681e
- Semantic owner / overlap check: UI / reader-platform search owner; no competing lane.

## Comment type
`stale` — defect not reproducible on current HEAD.

## Evidence

```
# ui/Header.astro @ cb3681e L30 renders STATIC search button:
  <button id="hCpBtnNav" class="gb-nav-search-icon" type="button" aria-label="Поиск (Ctrl+K)" …>

# ReaderPreferencesHead.astro @ cb3681e injects DYNAMIC search button ONLY on:
  const searchOpenerRoutes = new Set(['/articles/', '/biografii/', '/pastor-series/']);   # L14
  … if (document.getElementById('gbSearchBtn')) return; … append to .mobile-controls          # L24-44

# Carrier-usage census on cb3681e:
#  ui/Header is imported by ONLY src/layouts/BaseLayout.astro.
#  BaseLayout-backed pages = /hard-texts/genesis-6/ and /izbrannoe/ — NEITHER is in searchOpenerRoutes.
#  /articles/, /biografii/, /pastor-series/ landings use their own PageChrome navbars
#    (e.g. ArticlesPageChrome L241 nav) which do NOT include a static #hCpBtnNav;
#    they only get the single injected #gbSearchBtn via ReaderPreferencesHead.
# → the two buttons are on DISJOINT route sets; no route renders both.
# Lifecycle: commit e6972ea "test: wait for search focus readiness" + related search-lane commits
#   between 485db8c and cb3681e indicate search ownership was reworked.
```

## Summary
The duplicate cannot be reproduced on cb3681e with the stated mechanism. `Header.astro`'s static `#hCpBtnNav` now lives only on BaseLayout pages (`/hard-texts/genesis-6/`, `/izbrannoe/`), while `ReaderPreferencesHead` injects `#gbSearchBtn` only on `{/articles/, /biografii/, /pastor-series/}` — disjoint sets, so no page renders both search icons. The `/articles/`, `/biografii/`, `/pastor-series/` landings render their own navbar (no static search button) plus the single injected one. The search lane was reworked between the report's 485db8c anchor and cb3681e (see `e6972ea` and the search-merged commits), retiring the overlap. (My own earlier `2026-07-17-comment-ui-duplicate-search.md` confirmed the duplicate on 485db8c — that confirmation is now itself stale on cb3681e.)

## Recommended action
- Status change: `UI-DUPLICATE-SEARCH-BUTTONS` → **stale**; remove from MASTER in the next consolidation wave.
- Proposal status: proposal-resolved (overlap gone).
- Conflict registry entry: NO
- Notes for verifier: the underlying hardening the original report suggested (ReaderPreferencesHead should bail if any `.gb-nav-search-icon` already exists) is still a worthwhile guard against future regressions, but as a parked/Work-Queue item, not an active defect. Mark my prior `comment-ui-duplicate-search.md` confirmation stale too (it was anchored to 485db8c).
