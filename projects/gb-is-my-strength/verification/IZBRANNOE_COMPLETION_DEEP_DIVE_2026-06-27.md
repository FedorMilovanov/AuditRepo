# `/izbrannoe/` Completion Deep Dive — current-head contract gap analysis
**Project:** gb-is-my-strength  
**Date:** 2026-06-27  
**Source HEAD audited:** `262d0737d1926ca764a27f54d4a24faf42a7b46a`  
**Type:** verifier / feature-completion / contract-gap deep dive

---

## Executive diagnosis

`/izbrannoe/` is **not** a broken page. It is a **half-finished contract introduction**.

### Current truth
The route is already:
- implemented in `src/pages/izbrannoe/index.astro`
- linked from home and header
- registered in `migration/page-ownership.json`
- given a route profile in `data/route-profiles/izbrannoe.json`
- intentionally `noindex, follow`
- intentionally excluded from Pagefind/search because it is personal localStorage-driven content

### But
It still emits three current warning surfaces:
1. missing entry in `migration/route-migration-matrix.json`
2. missing search-manifest entry warning from `check-content-source-coverage.js`
3. `audit-pro` “Missing local reference: index.html → /izbrannoe/`

### Root diagnosis in one sentence
> `/izbrannoe/` is functionally shipped, semantically documented as personal/noindex, but some repo contracts still treat it like a normal production-dist searchable route or a missing root HTML target.

---

## Evidence inventory

## 1. Source page exists and is intentional
`src/pages/izbrannoe/index.astro`
- canonical `/izbrannoe/`
- `robots="noindex, follow"`
- personal favorites UI
- client-side `localStorage` reader using `gb-favorites`
- no `data-pagefind-body`

This is not an accidental stub.

---

## 2. Page ownership already recognizes it as production route
`migration/page-ownership.json`
```json
"/izbrannoe/": {
  "owner": "astro",
  "source": "src/pages/izbrannoe/index.astro",
  "risk": 1,
  "status": "production-dist"
}
```

So the route is already considered part of the production dist artifact.

---

## 3. Route profile already encodes the intended exclusion behavior
`data/route-profiles/izbrannoe.json`
Key facts:
- personal/localStorage page
- `pagefindBody: false`
- note: `excluded from Pagefind + sitemap`
- SEO says `indexable: false`

This is important: **the route profile already states the intended policy.**

---

## 4. Current warnings are real
### `migration:metadata:check`
```text
/izbrannoe/: no entry in route-migration-matrix.json (add it before migration)
route /izbrannoe/: production-dist route without search-manifest entry
```

### `audit-pro`
```text
Missing local reference: index.html → /izbrannoe/
```

---

# Root-cause analysis

## RC-1 — ownership says “production-dist”, but route semantics say “personal/noindex/non-searchable”
This is the core conceptual mismatch.

The repo currently models `/izbrannoe/` as:
- a real production Astro route in ownership

but also as:
- a personal page,
- noindex,
- excluded from Pagefind,
- excluded from sitemap/search-manifest.

That combination can be valid — **but only if the guards are taught that this is an intentional special class**.

Right now, some guards still reason as:
> if route is `owner=astro` + `status=production-dist`, it should probably behave like a normal public searchable route.

That assumption is false for `/izbrannoe/`.

---

## RC-2 — `check-content-source-coverage.js` does not honor route-profile exclusion semantics
The checker warns whenever:
- route owner is `astro`
- route missing search-manifest entry
- route is not excluded by hardcoded route family rules
- route is not detected as noindex by scanning built root HTML files

Why it fails here:
- `/izbrannoe/` exists as `src/pages/izbrannoe/index.astro`
- but there is no root legacy file `izbrannoe/index.html` for `isNoindexOrIgnoredRoute()` to inspect
- the checker does **not** consult `data/route-profiles/izbrannoe.json` where the route is explicitly declared `pagefindBody:false` and excluded from search/sitemap

So the warning is not proving a real bug in page behavior. It is exposing a **checker blind spot**.

### This is an important nuance
This is not “search-manifest forgotten” by default.  
It is more accurately:
> **search-exclusion is intentional, but the checker does not understand the route’s declared exclusion contract.**

---

## RC-3 — `audit-pro` local-link check assumes every internal root link must resolve to a root file or root directory today
Home root `index.html` contains:
```html
href="/izbrannoe/"
```

`audit-pro` resolves that to repository-root path:
```text
/home/user/gb-src/izbrannoe
```
Then checks:
- file exists?
- directory with `index.html` exists?
- extensionless `.html` exists?

All fail, because `/izbrannoe/` is Astro-owned source, not legacy root HTML.

So this warning is also not a page-level breakage proof. It is a **repo-root static reference checker blind spot** after the Astro route was introduced.

---

## RC-4 — `route-migration-matrix.json` truly is incomplete for this route
This part is a real unfinished contract.

Unlike the other two warnings, the missing matrix entry is not merely a blind checker. It means the route has no declared migration-mode contract in the central migration matrix.

So `/izbrannoe/` has a mixed picture:
- one real unfinished contract item
- two checker-policy mismatches / blind spots

---

# Classification of the three warning surfaces

## W1. Missing matrix entry
**Verdict:** real contract debt  
**Status:** confirmed-current

### Why
Every production Astro route should have an explicit migration-mode declaration if the matrix is supposed to be the central route migration contract.

---

## W2. Missing search-manifest entry
**Verdict:** likely intentional exclusion, but checker not route-profile-aware  
**Status:** guard-drift / policy-clarification-needed

### Why
The route profile already says:
- excluded from Pagefind
- excluded from sitemap
- noindex
- personal localStorage content

This strongly suggests omission from search-manifest is deliberate, not accidental.

### What is missing
One of these must happen:
1. encode that exemption in the checker logic, or
2. create an explicit route class in ownership/matrix that means “production-dist but intentionally non-searchable”, or
3. if the owner actually wants it searchable, then add it properly and change route policy

Current state leaves the checker and route profile disagreeing.

---

## W3. `audit-pro` missing local reference from home
**Verdict:** checker blind spot for Astro-owned route links from root legacy HTML  
**Status:** guard-drift

### Why
The link is valid at the deployed site level, but not resolvable as a repository-root legacy file path.

The checker currently lacks logic like:
- “if href points to an Astro-owned route declared in page-ownership.json, count it as valid even if no legacy root HTML file exists”

So this warning should not be treated as user-facing broken navigation evidence by itself.

---

# Is `/izbrannoe/` actually correctly excluded from sitemap/search?

## Search-manifest
Yes, likely intentionally excluded.
- route profile says excluded from Pagefind + sitemap
- page is personal/localStorage driven
- no `data-pagefind-body`
- noindex route

## Sitemap
Likely intentionally excluded for same reason.
No evidence in current pass suggests it should be indexed.

## URL contract
`reports/url-contract-draft.json` shows `/izbrannoe/` only as a **local ref** from home, not as a public indexed page. That is consistent with noindex exclusion.

### Verifier conclusion
Do **not** force `/izbrannoe/` into search-manifest or sitemap unless owner policy explicitly changes.

---

# Minimal repair path (surgical)

## Step 1 — add migration-matrix entry
This is the one clearly unfinished contract item.

Recommended direction:
- add `/izbrannoe/` to `migration/route-migration-matrix.json`
- mode should likely reflect its current architecture (`strict-native` or a dedicated noindex-native route class, depending on matrix philosophy)

---

## Step 2 — teach `check-content-source-coverage.js` about intentional non-searchable Astro routes
Preferred minimal fix:
- consult route profile before warning
- if profile explicitly indicates personal/noindex/non-pagefind route, skip search-manifest warning

Possible signals already available in profile:
- `seo.indexable: false`
- `anatomy.mainContent[].pagefindBody: false`
- note saying excluded from Pagefind + sitemap

Cleaner long-term signal would be an explicit field like:
```json
"searchPolicy": "excluded-intentional"
```
or
```json
"pagefind": false
```

---

## Step 3 — teach `audit-pro` local-reference checker to trust ownership manifest for Astro routes
When root legacy HTML links to `/izbrannoe/`, the checker should accept it if:
- route exists in `migration/page-ownership.json`
- owner is Astro-like
- route is production-dist or otherwise allowed public navigation target

This would eliminate a false warning without weakening actual broken-link detection.

---

# What NOT to do

## Do not immediately add `/izbrannoe/` to search-manifest just to silence a warning
That would contradict:
- noindex semantics
- route profile
- personal/localStorage nature of the page

## Do not treat `audit-pro` warning as proof of broken production navigation
It is proof of a checker assumption, not of a broken deployed link.

---

# Recommended status for ledger

## `/izbrannoe/` route introduction
- **Status:** `half-fixed`
- **Severity:** `P1`
- **Why:** feature is shipped, but central contract and two checker interpretations lag behind

## `/izbrannoe/` search-manifest warning
- **Status:** `guard-drift`
- **Why:** likely intentional exclusion not understood by checker

## `/izbrannoe/` audit-pro local reference warning
- **Status:** `guard-drift`
- **Why:** root static link checker not Astro-route-aware

## `/izbrannoe/` missing matrix entry
- **Status:** `confirmed-current`
- **Why:** real unfinished route-contract registration

---

# One-paragraph verifier conclusion

`/izbrannoe/` should not be framed as a broken feature. It is a valid personal noindex favorites page whose intended exclusion from search/sitemap is already described in its route profile. The true live defect is that its migration-matrix registration is unfinished, while two repo guards (`check-content-source-coverage.js` and `audit-pro`) still interpret it through assumptions suited to normal public searchable or root-legacy routes, producing warning noise that is better classified as guard drift than as feature failure.
