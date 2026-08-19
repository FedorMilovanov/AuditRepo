# Agent Audit Report — current MASTER re-verification

## Meta

| Field | Value |
|---|---|
| Project | `gb-is-my-strength` / gospod-bog.ru |
| Source repo | `FedorMilovanov/gb-is-my-strength` |
| Agent | `arena-master-reverify` |
| Auditor local date | 2026-07-17 UTC |
| Audited branch/ref | Product `main` |
| Exact Product anchor | `cb3681e1a85b5f8919c9dc537f812a842bbe9235` |
| Parent inspected for the App-lane collision check | `dfbb89eca6b2a31462731488aa8ee18400c5ef04` |
| Remote timestamp caveat | GitHub labels the selected Product SHA 2026-08-19T00:30:04Z, later than the auditor platform date. Every conclusion below is bound to the SHA, checked source tree, committed route artifacts, and live responses—not to a date-based inference. |
| Environment | exact-SHA source archive, static source/data analysis, GitHub API, live HTTPS fetches; no local Node/Astro toolchain |
| Build mode | source + committed route artifact + live HTTP; no local build |
| Browser/device | none; no interaction/fault-injection witness |
| Scope | Every active item in `verified/MASTER_BUG_MATRIX.md`: 8 direct defects, 1 narrowed residual, 2 system lanes, and 1 owner decision |
| Explicit exclusions | Product mutation; Telegram/authenticated flows; visual/mobile interaction testing; Research truth; unrelated `the-legendary-poet` project |
| Signal classes | Product source, release/artifact identity, live HTML, data integrity, and control-plane/system ownership |
| Overall proof state | mixed; two active matrix entries are contradicted by current evidence and should be dispositioned before repair work |
| Claim boundary | This report is only about `cb3681e` and the live responses recorded during this pass. It must not be silently refreshed when Product `main` advances. |
| Preservation boundary | Raw intake only. It does not mutate Product source or the active MASTER. |

## Pre-flight and overlap check

- The Product API identifies the anchor as `feat(app): premium Bible App integration across site (#1725)`. Its three changed files are outside the selected existing MASTER owners.
- Open Product PRs at inspection were `#1721` (`repair/dist-css-astro-admission-20260819`) and `#1722` (`repair/wire-engine-contracts-20260819`). Neither owns the Rodosloviye/Gill/genealogy/metadata/security/mobile source surfaces inspected here.
- GitHub reported 30 check runs for `cb3681e`; all conclusions were `success`, `skipped`, or `neutral` (no failing run). This supports release identity but does not prove the individual defects absent.
- The existing MASTER is the authority for active work. This report records evidence and challenges; it does **not** add speculative rows or perform a matrix edit.

Detailed, reproducible evidence is split under [`evidence/`](./evidence/).

---

## 1. Executive result

| MASTER item | This pass | Evidence angles | Result / recommended next disposition |
|---|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | Confirmed current | W2 source, W3 committed artifact, W4 live | Keep as a local metadata/asset repair. |
| `SERIES-ORDER-INDEX-MISMATCH` | Confirmed current | W2 source, W3 artifact, W4 live | Keep; repair the live owner `gillSeriesData.ts`, not the dead `site.ts` order. |
| `ARTICLE-AUTHOR-HARDCODED` | Challenged | W2 source ownership graph | **Invalid as a current Product row** unless a future witness names a live carrier. `ArticleLayout.astro` has zero direct `src/` importers at the anchor. |
| `GENEALOGY-NO-ERROR-BOUNDARY` | Current source risk, runtime unproven | W2 source, W4 normal live load | Keep only as a source-risk / resilience lane until an actual React fault witness establishes user impact. |
| `GENEALOGY-ID-INVALID-SPACE` | Confirmed latent data-integrity defect | W2 data + consumer source, W4 serialized live island props | Keep as bounded data normalization work; the graph is currently self-consistent, so do not claim a present visible outage. |
| `EDITORIAL-LABEL-INCONSISTENCY` | Confirmed literal divergence | W2 source, W4 live header | Keep under the metadata SSOT lane, subject to owner confirmation that the two labels are intended to be identical rather than purposeful audience copy. |
| `SECURITY-CSP-INCONSISTENCY` | Confirmed source fragmentation | W2 static inventory, W5 ownership analysis | Keep absorbed under `FRAGMENTED-SECURITY-OWNERSHIP`; no image-loading break was demonstrated. |
| `SECURITY-CSP-GAPS` | Narrowed further | W2 source, W4 live emitted HTML | Keep only as a **source ↔ deployed-output divergence** concern: the two BaseLayout routes are CSP-less in current source, but current live HTML emits CSP. Do not call them live CSP gaps. |
| `MOBILE-CHROME-REGISTRY-GAPS` | Contradicted | W2 render chain, W4 six live Genesis-6 article routes | **Remove/close as invalid or stale.** `Genesis6ArticlePage → SeriesReaderChrome → GillSeriesChrome → GillSeriesMobileBar` is an unconditional mount, and the bar is emitted live. |
| `METADATA-SSOT-PROLIFERATION` | Still justified, but narrower | W2 current active carriers | Keep as the system owner for Gill order + Header label. Do not retain dead `ArticleLayout.astro` as a symptom. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Still justified | W2 policy inventory + source/release divergence | Keep as a system lane; centralize one policy/head owner and prove emitted artifact parity. |
| `MOBILECHROME-GENESIS6-BAR-DECISION` | No longer blocked by the claimed absence | W2 + W4 | Close the decision as unnecessary after maintainer confirms the existing Gill mobile bar is the intended shared bar. |

### What changed in the evidence state

1. Two high-confidence current defects remain: the Rodosloviye OG route identity mismatch and the Gill Part III/IV ordering mismatch.
2. `ARTICLE-AUTHOR-HARDCODED` has no current source carrier at this anchor. A hard-code in an orphan layout is not an active Product defect.
3. The asserted Genesis-6 mobile-bar residual is disproved by the render chain and live HTML. The system already mounts the same `GillSeriesMobileBar` on Genesis-6 article pages.
4. Security evidence supports a single systemic ownership/parity lane, not a claim that every source omission is presently live without CSP.

### Highest-value next actions

1. Repair and prove `RODOSLOVIYE-OG-IMAGE` with a route-appropriate OG asset (or intentionally aligned generic asset/alt), then verify source, committed artifact, and live head agree.
2. Repair `GILL_SERIES_ITEMS` order/roman labels in `gillSeriesData.ts`; verify both live part routes and their next/previous cards after an emitted build.
3. Before scheduling any mobile-bar work, retire `MOBILE-CHROME-REGISTRY-GAPS` and the dependent owner decision using the evidence in this report.
4. Select `FRAGMENTED-SECURITY-OWNERSHIP` as one bounded system lane; define a single CSP/XCTO head owner and add source-to-emitted-artifact parity proof.

---

## 2. Witness matrix

`PASS` means the named angle supports the bounded claim; `FAIL` means the current evidence contradicts that row; `UNPROVEN` means the method cannot establish the claim; `N/A` means the angle was not proportionate or applicable.

| Work ID | W1 Surface | W2 Source | W3 Artifact | W4 Live/runtime | W5 Lifecycle/root | W6 History | Proof state | Exact anchor / claim boundary |
|---|---|---|---|---|---|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | PASS | PASS | PASS | PASS | N/A | PASS | PASS | `cb3681e`; head metadata identity only |
| `SERIES-ORDER-INDEX-MISMATCH` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `cb3681e`; Gill part sequence/labels and neighbouring links |
| `ARTICLE-AUTHOR-HARDCODED` | N/A | FAIL | N/A | UNPROVEN | PASS | PASS | FAIL | `cb3681e`; current carrier/ownership only |
| `GENEALOGY-NO-ERROR-BOUNDARY` | UNPROVEN | PASS | N/A | PASS normal load only | PASS | PASS | UNPROVEN | `cb3681e`; missing resilience boundary, not a reproduced crash |
| `GENEALOGY-ID-INVALID-SPACE` | UNPROVEN | PASS | N/A | PASS serialized payload | PASS | PASS | PASS (latent) | `cb3681e`; data-key invariant only |
| `EDITORIAL-LABEL-INCONSISTENCY` | PASS | PASS | N/A | PASS | PASS | PASS | PASS | `cb3681e`; literal naming divergence, not necessarily a user-facing break |
| `SECURITY-CSP-INCONSISTENCY` | UNPROVEN | PASS | N/A | UNPROVEN | PASS | PASS | PASS (ownership) | `cb3681e`; policy fragmentation, no exploit/break claim |
| `SECURITY-CSP-GAPS` | UNPROVEN | PASS | N/A | PASS | PASS | PASS | PASS (narrowed) | source omission versus emitted/live CSP divergence |
| `MOBILE-CHROME-REGISTRY-GAPS` | FAIL | FAIL | N/A | FAIL | PASS | PASS | FAIL | Genesis-6 article carrier at `cb3681e`; bar is mounted/emitted |
| `METADATA-SSOT-PROLIFERATION` | N/A | PASS | N/A | PASS representative | PASS | PASS | PASS | current live Gill/Header carriers only |
| `FRAGMENTED-SECURITY-OWNERSHIP` | N/A | PASS | N/A | PASS | PASS | PASS | PASS | current source policy inventory and source/live mismatch |
| `MOBILECHROME-GENESIS6-BAR-DECISION` | N/A | FAIL premise | N/A | FAIL premise | PASS | PASS | N/A | decision is no longer blocked by a missing bar |

---

## 3. Confirmations and extensions

### Confirm `RODOSLOVIYE-OG-IMAGE`

- **Target:** incorrect `/rodosloviye/` social image identity.
- **W2:** `RodosloviyePageHead.astro` sets both `og:image` and `twitter:image` to `/images/og-karty-1200x630.webp`, while `og:image:alt` identifies an interactive genealogy.
- **W3:** committed `rodosloviye/index.html` repeats the same image/alt pairing.
- **W4:** live `https://gospod-bog.ru/rodosloviye/` returns HTTP 200 with the same pairing.
- **Result:** same symptom across three independent carriers. The route-specific correct asset was not found under the current checked image paths; that does not prescribe which new asset to use.
- **Minimum closure proof:** exact source owner changed, emitted route artifact contains the new/approved image and matching alt, and live head matches the artifact.

### Confirm `SERIES-ORDER-INDEX-MISMATCH`

- **Target:** Gill Part III/IV inversion.
- **W2:** `GILL_SERIES_ITEMS` lists `part4` before `part3`; `part4` is marked `III` and `part3` is marked `IV`.
- **W3/W4:** the committed and live Part 3 route identifies itself as Part IV and sends the next card to the Part 4 route; the Part 4 route identifies itself as Part III and sends the next card to Part 3.
- **Root-boundary correction:** the active owner is `src/components/article-pilots/gill-series/gillSeriesData.ts`. `site.ts`/`SERIES_ORDER` must not be patched merely because it has a similar historic concept.
- **Minimum closure proof:** source order/marks, route metadata/labels, and live navigation all show the canonical 1→2→3→4 sequence.

### Confirm `GENEALOGY-ID-INVALID-SPACE`

- **Target:** data key `" lud_shem"` has a leading ASCII space.
- **W2:** `data/genealogy/genealogy.json` contains `" lud_shem"` in Shem’s children list (line 403) and as the person identifier (line 1395). `GenealogyTree.tsx` creates `Map` instances keyed by exact `p.id`, and its parent/child navigation checks those exact values; it does not normalize identifiers at import.
- **W4:** the live Rodosloviye Astro island serializes the same identifier into its props. Normal loading proves the self-consistent graph still renders, not that the identifier is canonical.
- **Result:** a medium-low, latent graph-integrity defect. Rename the key and its references atomically; do not normalize only one side and create a broken relation.
- **Minimum closure proof:** JSON schema/data validation rejects leading/trailing whitespace in IDs and relationships; every reference is updated; focused tree navigation/layout evidence passes.

### Confirm `EDITORIAL-LABEL-INCONSISTENCY`

- **W2:** `src/components/ui/Header.astro` renders `/hard-texts/` as `Разбор заблуждений`; `src/data/site.ts` assigns the same section the label `Трудные тексты`.
- **W4:** live `/izbrannoe/`, a current `BaseLayout → Header` carrier, renders `Разбор заблуждений` for that route.
- **Result:** the divergence is current and is suitable for the metadata SSOT lane. This pass cannot determine editorial intent; if deliberately audience-specific, encode that as two named fields rather than leave two competing canonical literals.

### Confirm `SECURITY-CSP-INCONSISTENCY` and narrow `SECURITY-CSP-GAPS`

- A literal-source inventory found **62** CSP meta occurrences in current `src/**/*.astro`, divided into **7** full-policy strings and **4** distinct `img-src` allowlists. This is an ownership/maintenance signal, not an assertion that all 62 routes are independently broken.
- `BaseLayout.astro` has no CSP or `X-Content-Type-Options` declaration. At this anchor its only direct page importers are `src/pages/izbrannoe/index.astro` and `src/pages/hard-texts/genesis-6/index.astro`.
- Both of those live pages nevertheless emit a CSP meta tag. That source-to-emitted divergence is a release-integrity problem and invalidates a claim that those routes are currently live without CSP.
- **Minimum closure proof:** one semantic security-head owner produces CSP and XCTO consistently; policy allowlists are intentionally parameterized where necessary; CI compares source owner intent to an emitted production-like artifact; live verification checks the selected high-risk routes.

---

## 4. Challenges and negative findings

### Challenge `ARTICLE-AUTHOR-HARDCODED`

- **Reason:** the named source carrier is orphaned at this anchor.
- **W2 decisive evidence:** `src/layouts/ArticleLayout.astro` still contains the single-author/translation conditional, but a complete textual scan of all supported `src` code files (excluding the file itself) found **zero** `ArticleLayout` references/importers. Current article routes use specialized route/page owners instead.
- **Recommended result:** remove from active MASTER as `invalid/dead-carrier` unless a verifier first identifies a current emitted route importing it. Retain historical evidence in `legacy`/`archive`, not as actionable current work.
- **What this does not prove:** that every currently active article author/translation carrier is well-designed. It only defeats the current row’s stated carrier and mechanism.

### Challenge `MOBILE-CHROME-REGISTRY-GAPS`

- **Reason:** the premise that Genesis-6 article pages do not mount a mobile bottom bar is false at `cb3681e`.
- **W2 decisive evidence:** `Genesis6ArticlePage.astro` wraps its content in `SeriesReaderChrome`; that component delegates to `GillSeriesChrome`; `GillSeriesChrome` unconditionally renders `<GillSeriesMobileBar pageId={pageId} config={config} />`.
- **W4 decisive evidence:** all six current routes using `Genesis6ArticlePage` returned HTTP 200 and each emitted `gill-mobile-bar` / `data-gill-v16` markup. The sampled routes include the three named in the matrix and the two 1 Peter pages.
- **Recommended result:** remove the narrowed residual and close `MOBILECHROME-GENESIS6-BAR-DECISION` as no longer required. If the owner wants a *different* Genesis-specific bar, create a new value/UX proposal with its own evidence; do not retain a false absence claim.

### Challenge boundary for `GENEALOGY-NO-ERROR-BOUNDARY`

- `GenealogyTree.tsx` has no `ErrorBoundary` reference and the route mounts it with `client:only="react"`, so the resilience mechanism is absent in source.
- The tree route loads normally live. Without a controlled render/data failure in a browser/runtime, this pass cannot prove that a user actually receives a blank surface or what recovery UI is appropriate.
- **Recommended result:** retain as `UNPROVEN source-risk` only if the owner values fault containment; do not label it a reproduced production outage.

---

## 5. Root-cause clusters

### Cluster `METADATA-SSOT-PROLIFERATION`

- **Included active symptoms:** Gill ordering/roman label mismatch; Header versus `SECTION_META` route label. `ARTICLE-AUTHOR-HARDCODED` should leave this cluster because its named owner is dead.
- **Shared mechanism:** metadata that names the same semantic concept is duplicated in active component-local data and a broad `site.ts` registry, with no contract proving which active consumer owns each value.
- **Why local patches may be insufficient:** changing only `site.ts` will not repair Gill because the live series reads `gillSeriesData.ts`; changing only `Header.astro` can silently leave a different registry label.
- **Required design boundary:** specify live owners first, then make each shared concept have one authority consumed by the relevant renderers. Preserve deliberately different editorial copy as separately named fields.
- **Representative closure cases:** Gill Part 3/4 route labels/order and `Header` `/hard-texts/` label.

### Cluster `FRAGMENTED-SECURITY-OWNERSHIP`

- **Included symptoms:** four `img-src` variants, seven full literal CSP policies, inconsistent XCTO placement, and source-to-emitted CSP divergence for `BaseLayout` routes.
- **Shared mechanism:** per-page handwritten policy heads and a release process that can emit a policy no longer visibly owned by current route source.
- **Why local patches may be insufficient:** repairing one route’s `img-src` can leave many policy copies and does not establish source/artifact identity.
- **Required design boundary:** central security-head/policy builder with an explicitly reviewed extension interface; one emitted-artifact parity check; selected live negative/positive load checks. Do not broaden CSP permissions merely to make the inventory uniform.

---

## 6. Value and cost assessment

| Work | User/operator impact | Recurrence risk | Estimated repair shape | Priority rationale |
|---|---|---|---|---|
| Rodosloviye OG | wrong social preview / SEO identity | low after single-owner correction | small route metadata + asset decision | high-value direct visible defect |
| Gill sequence | misleading series order/navigation | high while one list powers several cards | small data fix + regression fixture | direct content-navigation defect |
| Genealogy whitespace ID | latent break on migration/normalization | medium | small atomic data fix + validator | prevent silent graph drift |
| Genealogy boundary | degraded recovery only if island fails | unknown | bounded resilience implementation + runtime test | requires owner choice / fault witness |
| Metadata SSOT | repeated drift | medium-high | system refactor, stage by concept | take only after direct Gill fix is isolated |
| Security ownership | policy drift / release identity ambiguity | high | system lane with tight contract | security-sensitive; multi-witness closure required |

---

## 7. Recommended matrix actions (for verifier/owner, not applied here)

1. **Keep** `RODOSLOVIYE-OG-IMAGE`, `SERIES-ORDER-INDEX-MISMATCH`, `GENEALOGY-ID-INVALID-SPACE`, `EDITORIAL-LABEL-INCONSISTENCY`, `METADATA-SSOT-PROLIFERATION`, and `FRAGMENTED-SECURITY-OWNERSHIP`.
2. **Reword/narrow** `GENEALOGY-NO-ERROR-BOUNDARY` to a source-risk/resilience claim until a runtime failure witness exists.
3. **Reword/narrow** `SECURITY-CSP-GAPS` to source-to-emitted-release divergence; do not claim a current live CSP omission for `/hard-texts/genesis-6/` or `/izbrannoe/`.
4. **Remove as invalid/dead-carrier** `ARTICLE-AUTHOR-HARDCODED` unless a new current carrier is found.
5. **Remove as invalid/stale** `MOBILE-CHROME-REGISTRY-GAPS` and close dependent `MOBILECHROME-GENESIS6-BAR-DECISION`, subject to owner confirmation that the shared emitted bar is indeed the intended bar.
6. Do not perform Product mutation from this intake. A verifier should reconcile these challenges with the current MASTER and retain closure provenance.

## 8. Limitations

- No local Node/npm/Astro build could run in this sandbox.
- No browser automation, touch viewport test, screen-reader pass, or controlled React exception was available.
- Live HTTP establishes emitted markup and headers/body metadata, not Telegram state, interaction behavior, or cache behavior in a real client.
- CI success is a supporting release signal, not replacement evidence for a specific defect.

## Evidence index

- [`evidence/00_ANCHOR_AND_METHOD.md`](./evidence/00_ANCHOR_AND_METHOD.md)
- [`evidence/01_RODOSLOVIYE_AND_GENEALOGY.md`](./evidence/01_RODOSLOVIYE_AND_GENEALOGY.md)
- [`evidence/02_GILL_AND_METADATA.md`](./evidence/02_GILL_AND_METADATA.md)
- [`evidence/03_SECURITY_CSP_AND_RELEASE.md`](./evidence/03_SECURITY_CSP_AND_RELEASE.md)
- [`evidence/04_MOBILE_CHROME_NEGATIVE.md`](./evidence/04_MOBILE_CHROME_NEGATIVE.md)
