# Gill Guard / Architecture Preflight — current-head collision map
**Project:** gb-is-my-strength  
**Date:** 2026-06-27  
**Source HEAD audited:** `262d0737d1926ca764a27f54d4a24faf42a7b46a`  
**Type:** verifier / migration preflight / anti-regression collision map

---

## Executive diagnosis

Gill is no longer primarily a “broken controls” story.  
On current HEAD it is a **migration-collision story**.

### Current truth
- Gill historical-context page already carries a newer v16-like surface:
  - `data-gill-v16="context"`
  - `gbs-rail-foot`
  - `mobile-bottom-bar`
  - explicit note: no legacy `gbs2-rail / gbs2-bbar / gbs2-sheet`
- Gill Parts 1/2/3 still ship the older `gbs2-*` family:
  - `gbs2-rail`
  - `gbs2-bbar`
  - `gbs2-sheet`
  - `gbs2-hero`
- `owner-ui-regression-guard.js` still explicitly requires `gbs2-rail` + `gbs2-hero` on the Gill parts.

### Root diagnosis in one sentence
> The repo already contains the future Gill architecture and the past Gill architecture at the same time, while the owner anti-regression guard still protects the past architecture on key pages.

---

## Evidence inventory

## 1. Newer architecture exists in Gill context page
`src/components/article-pilots/gill-context/GillContextPageChrome.astro`
contains:
- `data-gill-v16="context"`
- `gbs-rail-foot`
- `mobile-bottom-bar`
- comment: **No legacy gbs2-rail / gbs2-bbar / gbs2-sheet**

This means the target architecture is not hypothetical. It is already implemented on one branch of the Gill family.

---

## 2. Old architecture remains on Part 1/2/3 pages
`src/components/article-pilots/gill-part1/GillPart1PageChrome.astro` and siblings still contain:
- `gbs2-rail`
- `gbs2-bbar`
- `gbs2-sheet`
- legacy series-rail world

This confirms a live split-family surface.

---

## 3. Owner guard still protects the old markers
`scripts/owner-ui-regression-guard.js`
requires for Gill parts:
- `gbs-world`
- `data-gbs2-series="dzhon-gill"`
- `gbs2-rail`
- `gbs2-hero`

So if an implementation agent migrates a part page toward the context/v16 model and removes those markers, the owner guard will fail.

---

# Collision map

## Collision A — target architecture vs guard contract
### New target markers
- `data-gill-v16`
- `gbs-rail-foot`
- `mobile-bottom-bar`

### Guard-protected old markers
- `gbs2-rail`
- `gbs2-hero`
- implicitly the surrounding old Gill structure

### Consequence
A correct architectural convergence can currently look like a regression to the guard.

---

## Collision B — one family already migrated, others not
Gill context is already on the newer surface, but the parts are not.

### Consequence
The project is forced to maintain:
- two markup systems
- two CSS expectation sets
- two anti-regression interpretations

This is exactly the kind of partial convergence that breeds future regressions.

---

## Collision C — documentation and reverify pressure now points toward convergence
Recent verifier notes and repair-order deltas already frame Gill as convergence debt, not as a simple isolated bug.

### Consequence
Future agents are likely to keep pushing toward v16 unification. Without an updated guard contract, they will enter a trap.

---

# What this means operationally

## Current bug framing that should be avoided
Avoid reducing Gill to:
- “still broken”
- “just fix a few controls”

That misses the actual problem.

## Better framing
Gill is now:
> **a controlled migration problem with an anti-regression contract anchored to an intermediate state**.

---

# Minimal safe next step

## Do NOT start by rewriting Gill part pages
That is the highest-risk move if guard expectations are not updated first.

## Do this instead
### Step 1 — enumerate the exact guard contract
For each Gill page family, write down:
- which markers are semantically required by owner doctrine
- which markers are only legacy implementation artifacts

### Step 2 — define convergence policy
Decide explicitly:
- will `gbs2-*` markers remain as compatibility aliases for a while?
- or are they being retired formally?

### Step 3 — update owner guard and migration target in one lane
Only after that should a page-family migration patch proceed.

---

# Recommended status

## Gill split-family architecture
- **Status:** `confirmed-current`
- **Severity:** `P1/P2 boundary`
- **Reason:** active architecture debt, visible in source and built surfaces

## Gill guard/architecture tension
- **Status:** `guard-drift`
- **Severity:** `P1`
- **Reason:** anti-regression contract is anchored to a non-final architecture

---

# One-paragraph verifier conclusion

The next Gill work should not begin as a styling or runtime tweak lane. It should begin as a **guard/architecture preflight lane**. The repo already contains the intended newer Gill surface on the context page, but Parts 1/2/3 remain on the older `gbs2-*` world, and the owner anti-regression guard still explicitly enforces that older world. Until those contracts are reconciled, any serious Gill convergence patch risks appearing as a regression even when it is architecturally correct.
