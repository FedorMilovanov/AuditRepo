# Conflict registry — gb-is-my-strength — 2026-06-25

**Purpose:** record contradictions between incoming/verified documents so the next strong verifier or implementation lead does not assume all "verified" statements agree.

---

## C-01 — `qs is not defined` status disagreement

### One document says
`projects/gb-is-my-strength/README.md` currently states:

```text
PS-01 (`qs is not defined`) — needs-reverification — статически не воспроизводится, нужен Playwright на HEAD
```

### Browser-verified evidence from Arena Agent intake says
Production-like Playwright verification reproduced `qs is not defined` on 13 routes, including:
- Hermeneutics
- Kod da Vinci
- 20 антисоветов
- Gill context
- Gill part 1/2/3
- Gill spravochnik
- Nagornaya ch1–5

See intake docs:
- `incoming/arena-agent/2026-06-25/deep-safe-bug-verification-2026-06-25-round2.md`
- `incoming/arena-agent/2026-06-25/premium-surface-bug-matrix-2026-06-25.md`

### Current safe interpretation
Treat `PS-01` as **confirmed in production-like artifact** unless a newer browser run disproves it.
Static source inspection alone is insufficient here.

---

## C-02 — Hermeneutics stray `76e7365` disagreement

### One document says
`projects/gb-is-my-strength/README.md` currently states:

```text
PS-05 (stray "76e7365") — FALSE POSITIVE in HEAD
```

### Browser/build evidence from Arena Agent intake says
The string survives into the production-like artifact body for:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

Confirmed via Playwright/body-text checks after production-like build.

See intake docs:
- `incoming/arena-agent/2026-06-25/premium-svg-pages-bug-investigation-2026-06-25.md`
- `incoming/arena-agent/2026-06-25/deep-safe-bug-verification-2026-06-25-round2.md`

### Current safe interpretation
Treat `PS-05` as **confirmed in production-like artifact** until disproven by a newer browser-verified run.
A source-only grep on HEAD is not enough if the issue is serializer/build-output related.

---

## C-03 — Meaning of “verified” is currently overloaded

Observed problem:
- some docs call something “verified” based on static source inspection;
- other docs call something “verified” based on browser + production-like dist.

### Operational rule going forward
Use explicit evidence tags in future documents:

```text
verified-source
verified-build
verified-browser
verified-production-like-dist
```

This repo should not use one undifferentiated word `verified` when the evidence level differs.

---

## Recommendation

Before implementation starts, the strongest verifier should reconcile:
1. source-layer findings
2. plain Astro build findings
3. strangler production-like dist findings
4. live browser findings

If those are mixed together, contradictions like C-01 and C-02 will keep reappearing.

---

## C-04 — PS-01 `qs is not defined` now TRIPLE-confirmed (resolve C-01)

C-01 noted a disagreement (README "needs-reverification / not statically reproducible" vs Playwright). This is now settled with **three independent methods**:

- `arena-agent` — Playwright on production-like `dist` (browser).
- `arena-agent-2` — Node DOM-stub `require()` with `readyState:'complete'` (deterministic, no browser).
- `arena-agent-verifier-2` — jsdom executing the shipped `js/floating-cluster-controller.js?v=35a91710` (third method): `ReferenceError: qs is not defined at initTocPopups(...) at Document.eval(...:348)`; theme click does not toggle `html.dark`; `window.__gbCluster === undefined`.

**Resolution:** PS-01 = `confirmed-browser` + `confirmed-runtime`. The earlier "not statically reproducible" line is correct *only* because it is a lexical-scope defect that needs **execution** (or careful structural reading of IIFE close at line 389), not a grep. Mark C-01 CLOSED → confirmed.

Root cause (agreed across agents): `initTocPopups`/`initActionHandlers`/`initPlayExpand` are declared AFTER the IIFE close (`})();` line 389) but call `qs`/`qsa` which are local to the IIFE; under `<script defer>` the `ready()` callback runs synchronously and throws before `roots.forEach(initCluster)`. Blast radius = **23 pages** (8 articles + 5 nagornaya + 10 baptisty-rossii), not 13 (interactive-audit didn't test baptisty-rossii). Fix = move the three functions inside the IIFE.

---

## C-05 — P0-2 `floating-cluster.css` "empty" = FALSE POSITIVE (independent second confirmation)

Both `arena-agent-2` and `arena-agent-verifier-2` independently verified `css/floating-cluster.css` = **1869 lines / 68596 bytes / 374+ selectors** (incl. all `.gb-ember*` state rules). P0-2 is a false positive. Recommend CLOSED.

Implication for V2/NEW bug "premium play-ember broken on baptisty/nagornaya": the ember visual breakage on those 15 pages is NOT because the CSS file is empty — it is because those legacy pages **do not LINK** `floating-cluster.css` at all (only the migrated/pilot pages do). So the issue is a per-page missing `<link>`, not an empty stylesheet.

---

## C-06 — feed.xml has TWO independent date bugs (do not dedupe)

- P2-6 (existing): pubDate uses `+0000` instead of Moscow `+0300`.
- V2-4 (new, arena-agent-verifier-2): weekday names disagree with the date (`Sat, 31 May 2026`→actually Sunday ×3; `Thu, 01 May 2026`→actually Friday ×6) per RFC-822.

These are different defects in the same file and should both be fixed.

## C-07 — DANGEROUS MISATTRIBUTION: "P0-10 is the root cause of PS-01/PS-02/PS-03"

**Raised by:** `arena-agent-2` (verification pass 2)
**Severity of the misattribution:** HIGH — if an implementation agent follows the note,
they will fix cache-busting and believe PS-01 is resolved; the controller will STILL crash.

### The contradiction

`verified/FALSE_POSITIVES_REGISTRY_2026-06-25.md` (NOTES, lines 50–51) states:

> 2. Сосредоточиться на P0-10 (hash bomb) как **корневой причине** PS-01, PS-02, PS-03, PS-05.
> 3. После исправления P0-10: re-run Playwright для верификации PS-01/05.

But `verification/CONFLICT_REGISTRY` C-04 (this file) already states the *correct*
root cause of PS-01:

> `initTocPopups`/`initActionHandlers`/`initPlayExpand` are declared AFTER the IIFE
> close (`})();` line 389) but call `qs`/`qsa` which are local to the IIFE; under
> `<script defer>` the `ready()` callback runs synchronously and throws before
> `roots.forEach(initCluster)`.

These two statements are **in direct conflict** about what causes PS-01.

### Why the P0-10→PS-01 link is wrong (deterministic proof)

The two bugs are completely independent:

- **P0-10** = stale `?v=HASH` strings hardcoded in Astro components (cache-busting drift).
- **PS-01** = a **lexical-scope** defect in the controller's source: three functions
  declared outside the IIFE reference `qs`/`qsa` declared inside it.

The `?v=` query param is a **cache-buster** — it changes which cached copy a browser
uses, but GitHub Pages serves the **same file bytes** regardless of the param. The crash
is in the file's *code structure*, not in how the file is referenced.

**Proof (arena-agent-2):** executing the **current committed file content** directly
(`js/floating-cluster-controller.js`, the version correctly hashed at `35a91710`) in a
Node DOM-stub with `readyState:'complete'` still throws
`ReferenceError: qs is not defined`. If P0-10 caused PS-01, a file with the *correct*
hash would not crash. It does. Therefore P0-10 ≠ cause of PS-01.

This is corroborated by `arena-agent-verifier-2`, who reproduced the crash in jsdom on
the shipped `?v=35a91710` file and traced it to the IIFE-scope defect — never mentioning
cache-bust hashes as a factor.

### Corrected causality

| Bug | Real cause | Independent of P0-10? |
|---|---|---|
| **PS-01** `qs is not defined` | IIFE lexical-scope defect (functions after `})();`) | **YES — independent** |
| **PS-02** dead theme controls | symptom of PS-01 (init aborts before `initCluster`) | YES — independent |
| **PS-03** dead save controls | symptom of PS-01 | YES — independent |
| **PS-05** stray `76e7365` | plausibly downstream of P0-10 (build/serializer artifact) | **possibly linked** (needs build proof) |

### Resolution

- **PS-01/PS-02/PS-03 must be fixed by editing `js/floating-cluster-controller.js`**
  (move the three functions inside the IIFE). Fixing P0-10 will NOT touch them.
- The FALSE_POSITIVES_REGISTRY note (lines 50–51) should be **corrected**: remove
  PS-01/PS-02/PS-03 from the "P0-10 is root cause" list. Only PS-05 may plausibly
  remain linked to P0-10, and even that needs a fresh dist build to confirm.
- **Implementation order:** PS-01 fix and P0-10 fix are independent and can proceed in
  parallel, but NEITHER closes the other.

### Action for the final verifier
Correct the FALSE_POSITIVES_REGISTRY NOTES so an implementation agent does not skip the
controller edit under the false belief that fixing cache-bust hashes will revive the cluster.

## C-08 — FALSE POSITIVE: "P0-NEW — SW precache 404 for site-layered.css / site-modules.js"

**Raised by:** `arena-agent-2` (verification pass 3)
**Source claim:** `incoming/arena-agent-round5/2026-06-25/VERIFICATION_AUDIT_ROUND5.md`
escalated a **P0** "SW precaches non-existent `site-layered.css` and `site-modules.js`
→ 404 on all SW-enabled pages", raising the total to 64.

### Why the claim is wrong

The agent reasoned: *"files exist in src/ root but are never imported in any Astro
component → Astro build does NOT copy them to `dist/` → SW tries to precache 404."*

This reasoning is **valid for a pure Astro project** but **wrong for THIS project**.
`gospod-bog.ru` is a **strangler** project: production `dist/` is produced by
`npm run strangler:build:production-like`, which runs `scripts/copy-legacy-to-dist.js`
AFTER `astro build`. That script wholesale-copies the legacy root asset directories.

### Deterministic proof (arena-agent-2)

`scripts/copy-legacy-to-dist.js`:
- `PUBLIC_DIRS` (lines 56, 63) includes **both `'css'` and `'js'`**.
- line 274: `for (const dir of PUBLIC_DIRS) copyDir(path.join(ROOT, dir), path.join(DIST, dir), …)`.
- `copyDir` (line 172) recursively copies every file; the ONLY skip is
  `shouldSkipLegacyFile(src)` = `astroRoutes.has(routeForFile(src))`.

`astroRoutes` is built from `migration/page-ownership.json` `.routes` filtered to
`owner` starting with `astro` — these are **HTML page routes only** (52 of them, e.g.
`/about/`, `/articles/`). Neither `/css/site-layered.css` nor `/js/site-modules.js` is
in that set.

Simulation against the real ownership file:
```
astroRoutes contains 52 astro-owned ROUTES (HTML pages)
  contains /css/site-layered.css? false
  contains /js/site-modules.js?  false
PUBLIC_DIRS contains css? true | js? true
[css/site-layered.css]  shouldSkipLegacyFile:false  => БУДЕТ СКОПИРОВАН В dist/css/site-layered.css? ✅ ДА
[js/site-modules.js]    shouldSkipLegacyFile:false  => => БУДЕТ СКОПИРОВАН В dist/js/site-modules.js?   ✅ ДА
```

So in the **production strangler dist**, both files exist and the SW precache does
**not** 404.

### Why round5's `ls dist/...css` showed "No such file"

The agent almost certainly inspected a **plain `astro build` dist** (Astro only copies
imported assets) rather than the production `strangler:build:production-like` dist.
This is precisely the source-vs-build-vs-production-dist split that
`verification/RECHECK_PROTOCOL_2026-06-25.md` warns about (trust order #1 =
production-like dist).

### What remains VALID (do NOT discard these)

The 404 framing is wrong, but adjacent findings stand:

- **P0-7 / P0-8 (cache-bust drift):** `css/site-layered.css` and `js/site-modules.js`
  are in `sw.js` `PRECACHE_ASSETS` but missing from `cache-bust.js` `ASSETS`. This is a
  real cache-invalidation gap (their `?v=` never updates), independent of existence.
  Still P0.
- **NEW-8 (P2, wasteful precache):** these files (plus `series-cards.js`) are precached
  but never `<link>`ed from any page → precache is wasted. Reasonable cleanup, P2.

### Resolution

- **P0-NEW → CLOSE as false positive.** Revert the ledger total 64 → 63.
- Keep the 404 reasoning out of the implementation path; do NOT remove the entries from
  `sw.js` on the (false) premise that they 404.
- If a cleanup of unused precache entries is desired (NEW-8), that is a separate P2
  decision, not a P0 404 fix.

### Action for the final verifier
Drop P0-NEW. The confirmed count stays at 63 (9 P0). P0-7/P0-8 stay (cache-bust drift).
