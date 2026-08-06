# Verification Wave Report — final Mayakovsky media batch

## Meta

- Project: The Legendary Poet
- Scope: all 30 Mayakovsky/Brik archive candidates from source issue #77
- Source PR: `FedorMilovanov/TheLegendaryPoet#333`
- Exact tested source head: `b9a4bc7dd3dc2c14160e3b551497465eab82753c`
- Source squash merge: `dd2df7be196d81d5212b43a08616f782af2fecf6`
- Date: 2026-08-06
- Product mutation: yes, four existing media-contract files only
- New image binaries: none

## 1. Goal

Complete the entire 30-candidate media family in one bounded Product batch rather than continue a one-candidate verification queue.

The final batch had to satisfy two requirements simultaneously:

1. preserve independent evidence and uncertainty for every candidate;
2. produce a deliberate terminal Product disposition for every candidate.

A terminal exclusion is not a claim that an image can never be licensed or researched again. It means the current Product has made a no-publication decision under the available evidence and editorial scope, so the candidate is no longer an automatic backlog item.

## 2. Product authority before the batch

The source already preserved:

- exact Commons original identity and SHA-256 for 30/30 candidates;
- two accepted active decisions, C03 and C08;
- one central runtime registry, `src/data/essays/verifiedEssayMedia.ts`;
- an exact-one coverage assertion requiring every accepted runtime record to resolve one current archive block and remove its weaker pre-verification metadata;
- 28 unresolved candidates.

Prior individual AuditRepo waves C01, C02, C04, C05, C06 and C07 established important negative and partial evidence boundaries. Their reports remain durable evidence and were not rewritten by this batch.

## 3. Final Product disposition

The merged Product decision set is:

- accepted active: **5**;
- verified reserve: **1**;
- explicitly excluded: **24**;
- unresolved: **0**.

### 3.1 Accepted active

#### C03 — `Vladimir Mayakovsky 1914.jpg`

Existing accepted record retained:

- media key: `mayakovsky-1914`;
- State Mayakovsky Museum / `История России в фотографиях` witness;
- Kazan, 1914, unknown photographer;
- `PD-RusEmpire` rationale recorded separately.

#### C08 — `Mayakovsky 1928 by Osip Brik.jpg`

Existing accepted record retained:

- media key: `mayakovsky-1928-osip`;
- exact RSL volume and index witnesses;
- Osip Brik, 1928;
- no unsupported shooting location;
- `PD-Russia` rationale recorded separately.

#### C10 — `Mayakovsky and Futurists.jpg`

New accepted active record:

- media key: `mayakovsky-futurists-1912`;
- exact Product SHA-256: `3ae1f3638b36ac5acb4e3289bacb119b355c5e3d8a55bc177880bceca8925999`;
- State Mayakovsky Museum virtual exhibition identifies the exact six-person photograph and all sitters;
- the museum documents use of this photograph on the February 1913 `Пощечина общественному вкусу` leaflet;
- accepted scope: Mayakovsky and the Futurists, Moscow, 1912, unknown photographer;
- `PD-RusEmpire` recorded separately from museum caption/publication evidence;
- current Part I archive block matched exactly and received the verified metadata.

#### C11 — `Mayakovsky and Moreno by Modotti 1925.jpg`

New accepted active record:

- media key: `mayakovsky-moreno-modotti-1925`;
- exact Product SHA-256: `b7c4befe6d4043a3e7e3d936731b17a895deba77ec51b26360c4b333abcd47c8`;
- Commons original explicitly traces to State Catalogue record `11208336` from the State Mayakovsky Museum;
- accepted scope: Vladimir Mayakovsky and Francisco Moreno, Mexico City, 1925, photographed by Tina Modotti;
- creator death in 1942 and captured term-based Commons templates are recorded separately from object/caption evidence;
- current Part II archive block matched exactly and received the verified metadata.

#### C16 — `1927. Владимир Маяковский бреется.jpg`

New accepted active record:

- media key: `mayakovsky-shaving-osip-1927`;
- exact Product SHA-256: `7bea5222bbb5621b11efa66e6ac081948a27719c4e0efb14f051d828cde60008`;
- Arzamas reproduces the exact composition and credits the State Mayakovsky Museum;
- accepted scope: Vladimir Mayakovsky shaving, Moscow, 1927, photographed by Osip Brik;
- Osip Brik's 1945 death and `PD-Russia` rationale are recorded separately;
- current Part II archive block matched exactly and received the verified metadata.

### 3.2 Verified reserve

#### C15 — `1926. Владимир Маяковский с Булькой.jpg`

- exact Product SHA-256: `92cd221171cd249708a74ebaf28340931702a01577da5f2c1166f441553f0c77`;
- exact Arzamas reproduction credited to the State Mayakovsky Museum;
- verified scope: Vladimir Mayakovsky with Bulka, Moscow, 1926, photographed by Osip Brik;
- no current essay archive block uses this exact source;
- therefore no decorative or dead active media key was created.

### 3.3 Explicit exclusions

The remaining 24 candidates received machine-readable terminal classes and candidate-specific reasons:

- `excluded-rights`: useful caption, object or publication evidence exists, but the publication-rights predicate required by the Product is incomplete;
- `excluded-provenance`: exact object, source, creator/date or publication lineage is insufficient;
- `excluded-scope`: current editorial scope does not justify publication while provenance/rights remain incomplete.

Grouped outcome:

- C01, C04, C06, C07, C13, C24, C28 and C30: `excluded-rights`;
- C02, C05, C09, C12, C14, C17–C23, C26, C27 and C29: `excluded-provenance`;
- C25: `excluded-scope`.

The precise reason for each candidate lives in the Product machine decision file. `unresolvedByDefault` is empty.

## 4. Product changes

Source PR #333 changed exactly four files:

1. `src/data/essays/verifiedEssayMedia.ts`
   - added C10, C11 and C16 active records;
   - retained C03 and C08;
   - kept exact-one active coverage.
2. `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`
   - schema version 2;
   - five active, one reserve, 24 exclusions, zero unresolved.
3. `docs/research/mayakovsky/media/pr77-accepted-active-media-2026-07-24.md`
   - final human-readable decision ledger.
4. `docs/research/mayakovsky/media/README.md`
   - final authority map and counts.

No essay prose, route, dependency, workflow, historical acquisition hash or image binary changed.

## 5. Exact-head certification

All checks below ran on unchanged source head `b9a4bc7dd3dc2c14160e3b551497465eab82753c`:

- Project contracts — run `31106402084`, success;
- Content model contract — run `31106402979`, success;
- CI — run `31106403642`, success;
- Articles catalog acceptance — run `31106402094`, success across Chromium, Android and iPhone;
- Site route integrity audit — run `31106402638`, success across 35+ URLs;
- Brand deep reference and motion audit — run `31106403089`, success;
- Manual Browser QA — run `31106402691`, all four jobs success:
  - premium iPhone critical;
  - premium home;
  - desktop WebKit/Safari reveal;
  - core Chromium/Android and fresh-process iPhone Safari.

`Request Pages deployment` was correctly skipped for the pull-request event.

Final preflight:

- source branch `behind=0`;
- exact semantic diff: four files;
- no review submissions;
- no inline review threads;
- expected-head-protected squash merge.

## 6. Issue closure

Source issue #77 required all 30 candidates to be classified and accepted media to pass source/build/browser validation.

After merge `dd2df7be196d81d5212b43a08616f782af2fecf6`:

- every candidate has a terminal Product decision;
- active records are protected by exact-one runtime coverage;
- exact-head source/build/browser gates are green;
- issue #77 was closed as `completed`.

## 7. System conclusion

The 30-candidate Mayakovsky media family is closed for the current Product scope.

There is no remaining automatic C09–C30 verification queue. A candidate can be reopened only when one of these materially changes:

- a new primary object or publication witness appears;
- explicit permission or a licence is obtained;
- jurisdiction-specific rights predicates become reviewable;
- the editorial need changes and justifies reconsidering a verified reserve or excluded asset.

This is the useful terminal state: five active records, one evidence-qualified reserve, 24 deliberate exclusions and zero unresolved candidates.