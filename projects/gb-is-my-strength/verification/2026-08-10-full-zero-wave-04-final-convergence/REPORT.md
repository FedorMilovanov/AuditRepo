# Wave 04 — Final Convergence / Lot Live Closure

Date: 2026-08-10

Product: `FedorMilovanov/gb-is-my-strength`

Audit authority: `FedorMilovanov/AuditRepo`

Scope: final convergence / release verification only. No Product implementation lane, no Lot successor PR, no backlog expansion.

## Decision

**PASS — terminal stabilization state reached.**

- Product `main` remained exactly `f0ec90563ec5ae7eec439f78d0729694267af6df` throughout the final closure pass.
- PR #1456 (`release(lot): publish native standalone article`) is merged and its merge commit is exactly the current Product `main`.
- A real post-merge GitHub Pages production witness exists for that exact SHA.
- Lot route/release checks passed against the exact promoted candidate, with an HTTP-success production route probe and immutable deployment provenance.
- #1295 was closed `completed` only after the live witness existed.
- A fresh-current-main convergence pass after that state transition satisfied #1403 criteria 1–7.
- #1403 was closed `completed` per its stop rule.
- No next backlog lane was started.

## 1. Fresh Product authority

Final Product authority:

```text
main@f0ec90563ec5ae7eec439f78d0729694267af6df
```

Fresh compare at closure:

```text
base=f0ec90563ec5ae7eec439f78d0729694267af6df
head=main
status=identical
ahead_by=0
behind_by=0
```

PR #1456 state:

```text
state=closed
merged=true
merge_commit_sha=f0ec90563ec5ae7eec439f78d0729694267af6df
```

Therefore the Lot publication merge commit is contained in current `main` as the current tip itself.

## 2. Open Product PR inventory

Final fresh census found exactly one open Product PR:

### #1460 — `audit(repo): inventory historical image bloat`

Classification: **active SYSTEM diagnostic, non-release, do-not-merge, outside this stabilization wave**.

Its own PR body explicitly states:

```text
SYSTEM diagnostic only. Do not merge.
```

Purpose is read-only reachable-history/image-blob inventory. It declares no production/deploy mutation and is intended to close unmerged after artifact review.

Final observed head during this audit:

```text
4f535a6920413bd9e7fdc59d7c9711c81ec8dae0
```

It is not a Lot successor, not a Product release implementation owner, and does not contain unique release-required work for #1295/#1403.

## 3. Live-branch red classification

A real live CI red exists and was **not** mislabeled as stale backlog:

```text
#1461 — CI failure: Shared Files Guard [PR #1460]
run=31338489979
attempt=1
sha=4f535a6920413bd9e7fdc59d7c9711c81ec8dae0
conclusion=failure
branch=audit/history-image-bloat-20260810
```

This red belongs to the explicitly `Do not merge` diagnostic #1460. It is therefore an active diagnostic failure, but not an unresolved red on a merge-intended release branch and not a release blocker for the completed stabilization wave.

Historical CI notifier failures belonging to retired/superseded branches remain historical/non-blocking. They are not being called recovered and are not counted as current release blockers.

## 4. Exact post-merge deployment witness

The trusted release-control plane produced and promoted one exact candidate for current Lot-containing `main`.

### Release tuple

```text
releaseSha=f0ec90563ec5ae7eec439f78d0729694267af6df
controlPlaneSha=f0ec90563ec5ae7eec439f78d0729694267af6df
workflow=Deploy to GitHub Pages
run=31337477765
attempt=1
candidateId=f0ec90563ec5ae7eec439f78d0729694267af6df:31337477765-1
result=PASS
```

### Candidate identity

```text
candidate tree digest:
sha256:f092d9fd5b1b5f65b301365863ce32e90af5eeb6680d7a5bc12a21c28952b159

candidate files=1177
candidate bytes=86840809

transport artifact:
pages-release-candidate-31337477765-1
artifact ID=9044986803
transport digest=sha256:e9bec1e59dda7d7e019d1fc96edb717d57bfa0d181986f925a889a211de90789
```

### Generic post-promotion live witness

```text
release-live-deployment-31337477765
artifact ID=9044991855
digest=sha256:5ee4317a259479f6826ac1ad7d2f1fb232bf882fb8f012f46966e735513f71f9
result=PASS
```

Immutable production provenance:

```text
/deployments/f0ec90563ec5ae7eec439f78d0729694267af6df/31337477765-1.json
```

Current production pointer:

```text
/deployments/current.json
```

The deployment ledger projected this exact release witness back to merged PR #1456. This is the required post-merge/live witness; the earlier production-like witness #836/run `31337477724` is predecessor candidate evidence only and was not substituted for live deployment proof.

## 5. Production live-contract evidence

The `release-live-deployment-31337477765` artifact records PASS after Pages promotion and binds the live site to the exact candidate above.

Verified critical production assets in that witness include:

| Surface | Result |
|---|---|
| `/` | live bytes/hash match candidate |
| `/sitemap.xml` | live bytes/hash match candidate |
| `/feed.xml` | live bytes/hash match candidate |
| `/pagefind/pagefind.js` | live bytes/hash match candidate |
| `/sw.js` | live bytes/hash match candidate |

The live contract also records the exact release SHA/control-plane SHA, candidate ID and candidate digest.

## 6. Lot route verification

Route:

```text
https://gospod-bog.ru/articles/lot-i-sodom/
```

### 6.1 HTTP success

Direct production route probe returned HTTP success (`200`) with HTML length `145221` bytes.

The exact promoted candidate contains:

```text
dist/articles/lot-i-sodom/index.html
bytes=145221
```

This gives a route-specific production response anchor consistent with the exact promoted candidate, in addition to the release-control-plane identity proof above.

### 6.2 Canonical / H1 / social metadata

Promoted route HTML contains:

```text
canonical=https://gospod-bog.ru/articles/lot-i-sodom/
H1=Лот: праведник у ворот Содома
og:url=https://gospod-bog.ru/articles/lot-i-sodom/
og:image=https://gospod-bog.ru/images/articles/lot/og-lot-i-sodom.webp
twitter:card=summary_large_image
twitter:image=https://gospod-bog.ru/images/articles/lot/og-lot-i-sodom.webp
```

Dedicated OG file exists and is non-zero:

```text
images/articles/lot/og-lot-i-sodom.webp
```

### 6.3 JSON-LD Article

The route has a schema.org graph containing:

- `Organization`
- `WebSite`
- `Article`
- `BreadcrumbList`

The Article node is bound to the Lot page and dedicated image.

### 6.4 Search / discovery / RSS / sitemap

Exact route is present in the promoted candidate's:

- `data/search-manifest.json`
- `feed.xml`
- `sitemap.xml`
- Pagefind ownership surface via the single `data-pagefind-body` article owner.

This is internal publication/discovery authority; external search-engine crawl lag is not used as a release criterion.

### 6.5 Single article owner / no duplicate owner

Promoted route HTML has:

```text
article elements=1
[data-pagefind-body]=1
```

The sole owner is:

```html
<article class="article-body" data-pagefind-body>
```

No duplicate article/Pagefind owner remains.

### 6.6 Nine responsive raster figure families

The route contains nine mounted responsive raster figure families, plus two semantic diagram figures.

Responsive families present:

1. `lot-two-roads`
2. `lot-jordan-plain`
3. `lot-sodom-gate`
4. `lot-sodom-crowd`
5. `lot-judgment`
6. `lot-wife-back`
7. `lot-cave`
8. `lot-ruth-naomi`
9. `lot-remember-wife`

Each family has non-zero:

```text
600w.webp
900w.webp
1200w.webp
```

That is 27 responsive route images, plus the dedicated 1200×630 OG.

The permanent Lot publication browser contract on the exact release tree executes Chromium + WebKit at 390×844, 412×915, 1024×768 and 1366×900 in light/dark mode: 16 cases. It verifies full `srcset`, `sizes`, selected `currentSrc`, decode/render/clipping and a separate raw selected-file dimension probe, rather than trusting density-adjusted `naturalWidth` alone.

### 6.7 Broken critical requests / route resources

Static resolution audit of the exact promoted candidate found:

```text
first-party route references checked=61
missing_or_zero=0
```

This includes script/style/image/srcset references resolvable from the route document.

Combined with the exact-candidate Chromium/WebKit route contract and the post-promotion generic live contract, no broken critical first-party release request was found.

### 6.8 TOC / quiz / base runtime

The Lot route contains the canonical TOC and `#sec-quiz`/`#quizPlaceholder` handoff. The exact-release permanent publication contract verifies:

- TOC interaction;
- duplicate-ID absence;
- native 8-question quiz runtime;
- shared reader/runtime ownership;
- responsive/overflow behavior;
- metadata and article ownership.

Evidence model note: runtime interaction was proved by the permanent 16-case browser barrier on the exact candidate that was then immutably promoted. The final verifier did not invent a separate second browser implementation lane solely to replay the same bytes after promotion.

### 6.9 Scripture rights-held byte boundary

The exact promoted candidate satisfies the shared public Scripture boundary:

- Lot route sets the canonical reader-facing `window.SCRIPTURE_DATA` projection from an empty object (`{}`) for this route;
- `dist/data/bible/**` does not exist;
- public `dist/data/scripture-search-index.json` exists as a sanitized Search derivative;
- that public derivative contains no `canonicalText` field;
- that public derivative contains no `canonicalSource` field;
- the route has no retained `#bibleRefs` payload owner.

Reference labels/occurrence metadata remain available for Search, but rights-held canonical verbatim corpus bytes are not exposed through the retired public paths.

### 6.10 Tall el-Hammam retraction boundary

Promoted article text explicitly says, in substance:

- the 2021 `Scientific Reports` airburst paper existed;
- `Scientific Reports` formally retracted it on **24 April 2025**;
- the retraction concerns methodology/mineralogical/geochemical evidence and Tunguska comparison reliability;
- the retracted paper must not be used as positive scientific proof that Tall el-Hammam is biblical Sodom;
- the retraction itself also does not prove a different Sodom identification.

This preserves the established #1298/#1334 evidence boundary instead of reviving the withdrawn airburst claim.

## 7. Required root status

Fresh issue-state checks during the final pass:

| Root | Final state |
|---|---|
| #1298 | closed / completed |
| #1299 | closed / completed |
| #1359 | closed / completed |
| #1369 | closed / completed |
| #1383 | closed / completed |
| #1384 | closed / completed |

### Strangler #1383

Final convergence history records the corrected terminal state:

- `30 dependencies / 0 dependency blockers`;
- post-zero storage-authority hardening merged;
- quarantine-only/reference-path authority proved;
- ambiguity/missing storage fail-closed;
- no path-copy compatibility shim needed for the terminal result.

Physical quarantine remains a separate future transaction and is not required to close this stabilization wave.

## 8. #1403 exit criteria — literal final check

### Criterion 1 — Current owned PRs settle

**PASS.** Every PR active in this stabilization wave settled via canonical merge/closure. Current #1460 is a new diagnostic-only, explicitly do-not-merge PR outside this wave and carries no unique release-required Product implementation.

### Criterion 2 — No ownership limbo

**PASS.** No stale branch was found carrying unique release-required Product work without a current owner/successor. Diagnostic #1460 is not hidden release-required work.

### Criterion 3 — Lot closes for real

**PASS.** #1295 now has:

- fresh-current-main native publication via merged #1456;
- post-merge GitHub Pages production witness for exact `f0ec9056…`;
- route-specific production HTTP success;
- exact promoted-candidate metadata/discovery/media/runtime/rights/retraction evidence.

#1295 was closed `completed` only after those conditions became true.

### Criterion 4 — Confirmed current roots close

**PASS.** #1298, #1299, #1369 and #1359 are closed/completed. The additionally required shared Scripture root #1384 also remains closed/completed.

### Criterion 5 — Strangler explicit terminal state

**PASS.** #1383 is closed/completed with zero relevant dependency blockers and the corrected post-zero storage-authority terminal proof. No compatibility shim is being treated as terminal success.

### Criterion 6 — No live-branch red mistaken for backlog

**PASS with explicit classification.** #1461/#1460 is a real current red, not stale. But #1460 explicitly says `Do not merge` and is outside the release wave. Therefore there is no unresolved red on a branch still intended to merge for this stabilization release.

Historical notifier failures from superseded/retired branches remain historical and non-blocking; they are not treated as recovered release evidence.

### Criterion 7 — Final main audit

**PASS.** Fresh `main` is still exact deployed SHA `f0ec9056…`. Required release/build/source/route/runtime/visual gates for the changed Lot surface are green on the exact promoted candidate. Post-promotion live contract is PASS. Route-level static integrity and rights/retraction boundaries were independently re-inspected from that exact artifact.

No #1460 diagnostic workflow exists on Product `main` because #1460 is unmerged. No new temporary release-only Product implementation or Lot successor was created by this verifier.

### Criterion 8 — Stop

Criteria 1–7 are true. The stabilization wave therefore stops here. Unrelated backlog and #1460's separate repository-history diagnostic do not extend the finish line.

## 9. Terminal actions

Completed by this final convergence verifier:

1. Added exact live/deployment/route evidence comment to #1295.
2. Closed #1295 as `completed`.
3. Re-ran fresh-current-main convergence audit after #1295 closure.
4. Added literal criteria 1–7 closure comment to #1403.
5. Closed #1403 as `completed`.
6. Created this standalone Wave 04 AuditRepo report.

Not performed:

- no Product feature/system fix;
- no new Lot successor PR;
- no unrelated backlog root;
- no mutation of Wave 01/02/03 reports;
- no #1460/#1461 cleanup or takeover;
- no next stabilization wave.

## 10. Final terminal snapshot

```text
Product main:
f0ec90563ec5ae7eec439f78d0729694267af6df

Lot merge:
PR #1456 -> f0ec90563ec5ae7eec439f78d0729694267af6df

Live deploy:
run 31337477765 / attempt 1
candidate artifact 9044986803
live witness artifact 9044991855

Lot root:
#1295 closed/completed

Convergence owner:
#1403 closed/completed

Current open Product PRs:
#1460 only — SYSTEM diagnostic / Do not merge / outside release wave

Current live red:
#1461 on #1460 — real diagnostic red, explicitly non-release

Wave disposition:
TERMINAL PASS / STOP
```
