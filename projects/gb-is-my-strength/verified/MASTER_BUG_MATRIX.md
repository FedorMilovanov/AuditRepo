# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT по багам проекта gospod-bog.ru** (открыто/закрыто/severity/счётчики). Волатильные
> факты живут только здесь и в [`../NEXT_AGENT_PROMPT.md`](../NEXT_AGENT_PROMPT.md); карта
> всех документов и правило Single-Writer-Per-Fact — [`../DOC_MAP.md`](../DOC_MAP.md).
> Мастхед — это **статус, не changelog**: per-session заметки идут в `## Session log` внизу.

## Статус

| Поле | Значение |
|---|---|
| Source verification anchor | `f9d0120718569c510833dba7a3abd68ce2f6a003` (native production-like source + refined Chromium: `NG-DARK-01` narrowed from 19 source-residual tokens / 443 uses to **9 browser-confirmed tokens / 142 uses**; 10 tokens / 301 uses are readable/effectively governed; no Product mutation, production or TTS claim). |
| Deploy | ⚠️ **FINDING-DISPOSITION ANCHOR ≠ PRODUCTION.** Last exact production authority remains run `30669840189` attempt `1`, release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`, release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. Closure anchor `3aba5112f0fc37712e027a1ad1d8379debe54377` has no same-SHA production witness and this verifier-only wave makes no production claim. |
| Системный бэклог | `SUPER_AUDIT_2026-07-06_14a49be8.md` — волны W1–W10, **вне счётчиков матрицы**; W1 still empirically blocking |
| Консолидация | 2026-07-05 (из монолита → `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`) |
| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md` |

⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Exact finding-disposition anchor for closure wave V1 = `3aba5112f0fc37712e027a1ad1d8379debe54377`; last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`. The matrix is a durable verified backlog, not per-commit telemetry. Fifteen findings are closed because their claims are fixed or stale on the selected anchor; later source movement does not silently reopen or close rows without a new applicable reverify. Active source PR #680 remains outside this AuditRepo-only lane. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md`.

_История сессий (HEAD-переходы, что влито) — в разделе `## Session log` внизу файла, append-only._

---

## ✅ ЗАКРЫТО (213)

| ID | Описание | Коммит |
|---|---|---|
| NG-BODY-01 | ✅ **STALE VISUAL SUBSET + DUPLICATE / MERGED INTO `NG-DARK-01`; SOURCE+CHROMIUM VERIFIED 2026-08-04.** Exact native source `f9d0120718569c510833dba7a3abd68ce2f6a003` still contains `bg-stone-100` on `/nagornaya/`, `/nagornaya/istochniki/` and `/nagornaya/nakhodki/`, but refined Chromium run `30908030497` proves the effective dark body cascade is correct across all nine routes, both viewports: `bg-stone-100` is classified `effective-body-cascade-covered`, with no light island or contrast failure. PR #150/#152 source-only wording is superseded by browser truth. The historical subset remains closed and creates no Product repair obligation. No Product mutation, production or TTS claim. | `f9d01207` run `30908030497` artifact `8892026949` |
| NG-VIS-12 | ✅ **OVERSTATED-CURRENT + DUPLICATE / MERGED INTO `NG-SEO-01` 2026-08-04.** Exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003` source scan found the stale `v4.0 · Апрель 2026` literal only on chapter parts 1–3, not all five. That exact 1–3 stale / 4–5 absent footer-version residual is already owned by open `NG-SEO-01`, which also retains title and Pagefind metadata drift. No Product mutation, source-fix or production claim. | `f9d01207` |
| NG-VIS-09 | ✅ **DUPLICATE / MERGED INTO `NG-INLINE-01` 2026-08-04.** The same “Из библиотеки” inline-style implementation, dark-theme failure and five-file duplication are already owned by open P1 root `NG-INLINE-01`. Exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003` source scan confirmed the current repeated inline blocks. No Product mutation, source-fix or production claim. | `f9d01207` |
| NG-VIS-11 | ✅ **DUPLICATE / MERGED INTO `NG-INLINE-01` 2026-08-04.** Hardcoded `#b8882a` and `#8a7968` are direct subsets of the exact inline palette already listed by open root `NG-INLINE-01`. Current Product source scan confirmed both values in the repeated blocks; closing the subset does not claim a fix. No Product mutation or production claim. | `f9d01207` |
| NG-DARK-04 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01`; NATIVE-DIST AUTHORITY RECONCILED 2026-08-04.** Exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003` passed the native route contract and production-like build. Built output contains 13 `bg-rose-50` uses and route-linked CSS covers the token on every using native route. The row remains closed because it has no independent repair owner; PR #151 legacy-shadow counts are superseded. No Product mutation, browser, production or TTS claim. | `f9d01207` |
| NG-DARK-05 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01`; REFINED BROWSER BOUNDARY 2026-08-04.** Refined Chromium run `30908030497` removes `bg-stone-100` from the repair boundary because the effective body cascade is dark and readable. `bg-stone-200` remains a confirmed light island with minimum text contrast `1.05:1`, but has one repair owner only: open `NG-DARK-01`. This aggregate row remains closed. No Product mutation, production or TTS claim. | `f9d01207` run `30908030497` |
| QUAL-P1-02 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM+CI VERIFIED 2026-08-04.** Product PR #873 repaired the canonical dynamic Hebrew rendering root cause: `.hw` now uses a Hebrew-capable stack with isolated RTL semantics; rendered Hebrew tokens own `lang="he" dir="rtl"`; Hebrew title boundaries are explicit; Russian transliteration and explanations remain LTR. Exact PR head `cf128cc429ccfa1c48fce4638b3f489f8dc27135` passed all eleven triggered workflows, permanent source audit **44/44**, production-like Chromium `hebrew=ok`, zero browser errors and zero horizontal overflow. Squash merge `f9d0120718569c510833dba7a3abd68ce2f6a003`. No production claim. | `f9d01207` PR#873; exact `cf128cc4` |
| NG-INLINE-02 | ✅ **DUPLICATE / MERGED INTO `NG-INLINE-01` 2026-08-04.** The measured 172 inline `style=` attributes refine the same five-copy “Из библиотеки” inline-style architecture already owned by open P1 root `NG-INLINE-01`; they do not establish another independently repairable cause. No Product mutation or production claim. | `0fbe7d1e` |
| NG-STRUCT-02 | ✅ **DUPLICATE / MERGED INTO `NG-STRUCT-01` 2026-08-04.** Bare headings, missing wrappers, emoji/SVG drift and the chapter-five `font-sans` subset are already contained by open P1 structural owner `NG-STRUCT-01`. Closing the duplicate does not close the root defect. No Product mutation or production claim. | `0fbe7d1e` |
| NG-MOBILE-01 | ✅ **AGGREGATE DUPLICATE / MERGED; BROWSER OWNER LINKS RECONCILED 2026-08-04.** Refined Chromium run `30908030497` proves the former native `bg-stone-100` body subset is effectively dark at desktop and mobile, so it is not a repair obligation. Chapter-specific TOC accent remains owned by open `NG-TOC-01`; inline hero height/adaptivity remains owned by open `NG-A11Y-01`. No independent mobile root remains in this row. No Product mutation, production or TTS claim. | `f9d01207` run `30908030497` |
| NG-VIS-05 | ✅ **FALSE-POSITIVE / INTENTIONAL SEMANTIC MARKER 2026-08-04.** Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` explicitly includes `div.reveal` in `js/glossary.js` `proseSelectors`; the class is consumed as a glossary-hydration prose boundary. The canonical row itself states that reveal animation was not planned. Missing animation is therefore not a defect, and removing the marker would weaken the runtime contract. No Product mutation or production claim. | `0fbe7d1e` |
| NG-VIS-06 | ✅ **DUPLICATE / MERGED INTO `NG-STRUCT-01` 2026-08-04.** The chapter-five `font-sans` heading inconsistency is already a stated subset of open root owner `NG-STRUCT-01`, which covers the same structural/heading regression. Closing this duplicate does not close the root defect. No Product mutation or production claim. | `0fbe7d1e` |
| NG-VIS-07 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01` 2026-08-04.** Loss of chapter colour identity in dark mode is a manifestation of the same missing per-chapter variable/remap architecture owned by open root finding `NG-DARK-01`. No Product mutation or production claim. | `0fbe7d1e` |
| NG-VIS-08 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01` 2026-08-04.** Chapter-three hero contrast drift is another manifestation of the incomplete dark-theme remap owned by open root finding `NG-DARK-01`; it has no independent repair lane. No Product mutation or production claim. | `0fbe7d1e` |
| FONT-P1-01 | ✅ **DUPLICATE / MERGED INTO `QUAL-P1-02` 2026-08-04.** This row is the explicit-font-family subset of the same dynamic Hebrew rendering residual. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` still styles `.me-content .hw` with `Georgia,"Times New Roman",serif`, contains no `dir="rtl"` contract for the dynamic Hebrew panel, and selects `he_deep` for the Hebrew tab. The combined defect remains open only under canonical owner `QUAL-P1-02`; no Product mutation or production claim. | `0fbe7d1e` |
| QUAL-P2-01 | ✅ **DUPLICATE / MERGED INTO `QUAL-P1-09` 2026-08-04.** This row describes the same holding/noindex route-profile status drift as the narrowed P1 owner. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` disproves the broader “all profiles” wording because the production Avraam profile legitimately uses `production-dist`, while the Shoftim profile still combines `currentStatus: "production-dist"` with an explicit holding/noindex contract. The factual residual remains open only as narrowed `QUAL-P1-09`; no Product mutation or production claim. | `0fbe7d1e` |
| RIVER-P1-05 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-04.** Product commit `39df9ed0e650cc08f93c14145cb592868f0c80e4` removed the complete second Nile group under `waterRipple`—parallel stem, five arms and glow—while retaining one canonical river system and adding grouped-stroke protection plus a browser water-intersection gate. The historical commit has no attached Actions run, so no CI claim is made. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` retains the explicit single-system invariant, one Nile stem with five delta arms and the permanent Chromium visual harness. No current production claim. | `39df9ed0` |
| DRAW-P1-02 | ✅ **DUPLICATE / MERGED INTO `RIVER-P1-05` 2026-08-04.** This row described the same obsolete duplicate river channels and the same visible doubled-line root cause as `RIVER-P1-05`; there is no second independently repairable defect. The shared source repair is commit `39df9ed0e650cc08f93c14145cb592868f0c80e4`, retained on current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329`. Separate river/filter/shoreline findings remain open. No current production claim. | `39df9ed0` |
| QUAL-P1-07 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-04.** Product PR #666 aligned canonical Karty story identifiers with the runtime/deep-link vocabulary: internal IDs now use `^[a-z0-9_-]+$`, public `meta.id` remains hyphen-only, no published identifier or URL was renamed, and the permanent guard validates every current `karty/*/route.json`. Exact Product head `12aa744e10c05c134adc951f01cb5e78ef25de65` merged as `424b09b25fc9d4bace3938f4d44f430be8cc7e4b` after four green workflows. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` retains the schema and all-route guard. No current production claim. | `424b09b2` PR#666; current `0fbe7d1e` |
| AR-IDX-01 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-04.** Product PR #675 restored canonical Home alternates for `hreflang="ru"` and `hreflang="x-default"`, both targeting `https://gospod-bog.ru/`, and added parsed production-like assertions. Exact PR head `404db8d14087d29522e56f190717d6224e8e3bfb` merged as `0131f8b9d6c717f85a8990700b72b09b575219a4` after nine green workflows. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` retains both links and the fail-closed assertions. No current production claim. | `0131f8b9` PR#675; current `0fbe7d1e` |
| AR-IDX-02 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-04.** Product PR #675 restored WebSite `SearchAction`, the canonical `https://gospod-bog.ru/?q={search_term_string}` EntryPoint and `required name=search_term_string`, with permanent production-like assertions. Exact PR head `404db8d14087d29522e56f190717d6224e8e3bfb` merged as `0131f8b9d6c717f85a8990700b72b09b575219a4` after nine green workflows. Current Product `0fbe7d1ead9ebd1bea867418e254da438ec63329` retains the complete contract. No current production claim. | `0131f8b9` PR#675; current `0fbe7d1e` |
| EDITORIAL-PROJECTION-51-DRIFT | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-04.** Product PR #442 restored exactly 27 unauthorized `editorialPublishedAt` changes while retaining all 51 proven RSS/Search projection observations, review statuses, modification dates, provenance and source boundary. It added permanent preservation and frozen/observed diff contracts; issue #217 closed in merge `f7e426996fd41a23ca720299a8ef1ce7f1c0952f`. At current Product anchor `0fbe7d1ead9ebd1bea867418e254da438ec63329`, workflow blob `00caeeaecff5a70d22ccbfa1263aefd5ef637640` and preservation-test blob `0c7a733df4c6b661fdffd377e7f0d5b4c3bc9708` are identical to exact green head `7de20ed77e60ec05bb91322ac03800a3d9860410`, where Editorial Metadata v3 run `30679631914` succeeded. Historical same-SHA deployment witness `30300756799` belongs to `f7e42699`; no current production claim. | `f7e42699` PR#442; run `30679631914`; current `0fbe7d1e` |
| A11Y-P1-02 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM VERIFIED 2026-08-03.** Source PR #812 added one route-owned focus-reveal skip link before the full sr-only projection and targets the programmatically focusable `#stage` owner. Exact Chromium Dossier run `30807589787` on verified head `3bd7f8a47bab65f08de45d81707cff2f6233cc55` proved first-Tab focus, visible `295.125 × 44` geometry, native activation to `#stage` with hash synchronization, `tabindex="-1"`, and `304/304` expected states; artifact `8853648893`, digest `sha256:54653a134572f2c6885168dacb938c9213c687d0425f7c5ec497876bdd9d7522`. Squash merge `778a218d9e6dc4c051721fc0f0fe56ee9125c797`. No production claim. | `778a218d` PR#812; run `30807589787`; artifact `8853648893` |
| A11Y-P1-03 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE+CHROMIUM VERIFIED 2026-08-03.** The historical `2.15:1` archaeology-metadata contrast claim is not reproducible on the exact verified source head. The browser-composited Dossier witness sampled `1208` instances through ancestor backgrounds: minimum `5.084:1`, maximum `7.351:1`, invalid samples `0`, against the WCAG AA `4.5:1` threshold. Exact run `30807589787`, artifact `8853648893`, digest `sha256:54653a134572f2c6885168dacb938c9213c687d0425f7c5ec497876bdd9d7522`; source merge `778a218d9e6dc4c051721fc0f0fe56ee9125c797`. This closes only the canonical `2.15:1` claim; no all-route or production claim. | `778a218d` PR#812; run `30807589787`; artifact `8853648893` |
| A11Y-P1-01 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM VERIFIED 2026-08-03.** Source PR #759 established one page-level heading owner during the visible intro lifecycle: the static page heading remains the sole H1 and the visual intro title is H2. The bounded Chromium accessibility witness run `30771541994` sampled the lifecycle and recorded `maxH1CountDuringIntro=1`; artifact `8840711226`, digest `sha256:bc92b51ebc665585b222bcb56d2298ba2523e7ae16d629f8b694ef0519f95fdc`. Final exact PR head `33a2380d6748da26d64eb33d84ff7e588fd6e508` also passed the 304-state Dossier witness, seven-viewport Reference Baseline, Static Projection, Overlay, Map Keyboard and all source gates before merge `d69268b27bb83fe8741159da59f9c1b038d7d9b9`. No production claim. | `d69268b2` PR#759; runs `30771541994`/`30779633089`/`30779633071` |
| AVRAAM-P1-04 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM VERIFIED 2026-08-03.** The narrowed residual is repaired in source PR #759: the panel owns a `tablist`/`tab`/`tabpanel` relationship, `aria-selected` state, roving `tabindex`, locally owned Enter/Space activation and Arrow/Home/End focus navigation, so tab keys no longer fall through to global map navigation. Bounded Chromium witness run `30771541994` passed the ARIA pattern, roving focus, Enter, Space, numeric shortcut and ArrowRight while proving that the global tour did not activate. Final exact head `33a2380d6748da26d64eb33d84ff7e588fd6e508` passed Map Keyboard run `30779633059`, Dossier run `30779633089` (`304/304`, zero failures/warnings/errors) and Reference Baseline run `30779633071` before merge `d69268b27bb83fe8741159da59f9c1b038d7d9b9`. No production claim. | `d69268b2` PR#759; runs `30771541994`/`30779633059`/`30779633089` |
| QUAL-P1-04 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE+CHROMIUM VERIFIED 2026-08-03.** The historical delegated-click regression is not reproducible on exact source/main anchor `1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5`. Production-like Chromium opened the single-photo Цоар fixture through story `lot`: the visible trigger used the 320px thumbnail while `data-src` owned the 1280px source; the modal contained exactly one open instance and retained the exact `width=1280` URL both immediately and after 700 ms, with no reset to `width=320`. Exact workflow run `30769737659`; artifact `8840166904`, digest `sha256:eef8df91e454721ba6afdc29138e90420a1e0bfb2ee28323046348310214246a`. No production claim. | `1944eb1b` run `30769737659` artifact `8840166904` |
| SHADOW-AUDIT-NARROW | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Source PR #780 replaced the manually maintained seven-route sample in `scripts/legacy-shadow-wrapper-audit.js` with an ownership-registry-derived set: every route with `owner=astro`, `status=production-dist` and a committed root HTML shadow becomes an obligation. The audit now fails on malformed ownership data, empty discovery, duplicate shadow files and stale overrides, and checks canonical ownership, required title/description/H1, committed-shadow indexability disposition, route-specific structural markers and retained reader-text ratio. Exact witness head `202b4e9a8fad64c6defa00ae1aa78349c0918ede` discovered and passed **52 routes** in production-like build run `30766785459`; the same permanent script blob was retained on clean head `019cbf2f56d9107883f390b169f92b2f70af0ae8`, which passed Metadata `30766961604` and Shared Files Guard `30766961603`. Squash merge `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3`. No production claim. | `d23546ce` PR#780; runs `30766785459`/`30766785503`/`30766961604`/`30766961603` |
| AR-IDX-CSS-01 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** The historical root-cause claim is obsolete: `css/site.css` now defines the shared z-index scale in `:root`, including `--z-elevated`, `--z-dropdown-high`, `--z-sticky`, `--z-bottom-bar`, `--z-tooltip-low` and `--z-toast-high`, while `css/home.css` consumes those tokens. The original inference that Home fixed/sticky layers fall back to `z-index:auto` because the tokens are absent is therefore not reproducible. This disposition does not claim that every independent stacking interaction is perfect; it closes only this canonical missing-token claim. Exact source anchor `b251c4b99265a9915881048c5fbde61f810d8c96`; the intervening NoteRegistry merge did not touch either CSS owner. No production claim. | `b251c4b9` source reverify |
| NEW-VOSK-DEAD-SPLITSENTENCES | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Source PR #755 removed the unused `splitSentences` definition and public export from `js/vosk-tts-core.js`; runtime chunking remains owned by `splitTtsChunks`, and a fail-closed scan found zero source call sites. Exact head `b348e22b79cf1a802b0d32098ed0a37de5d8e67b` passed Shared Files, Metadata, Deploy Candidate, Print, Visual Parity, Route Registry and Runtime Interactive workflows. Squash merge `aed8ed2244ad566b0458e490f629d394122dbf95`. Production is not claimed. | `aed8ed22` PR#755; runs `30756863997`/`30756863994`/`30756863993`/`30756863988`/`30756863991`/`30756864007`/`30756864014` |
| ASTRO-P1-02 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Extended stage colors no longer collapse after the sixth palette entry: the shared MapEngine normalizes stage color resolution across timeline, legend, dots and layers. Source PR #709 closed the defect and its exact head passed eight triggered workflows; the owner file is unchanged through verifier anchor `3aba5112`. | `8bd891b1` |
| ENGINE-P1-21 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Screen-to-SVG projection now models centered `preserveAspectRatio=meet` letterboxing with the effective scale and offsets. Source PR #709 closed the 1.63x ruler-coordinate error; the MapEngine owner file is unchanged through `3aba5112`. | `8bd891b1` |
| ENGINE-P1-22 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Distance calculation now uses governed `cfg.kmPerUnit` through the canonical distance helper instead of a hardcoded `0.92` multiplier. Closed by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |
| ENGINE-P1-23 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Marker animation targets the semantic marker-dot owner; the stale `circle:nth-child(3)` runtime selector is absent. Closed by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |
| ENGINE-P1-28 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Gallery opening has one delegated owner and resolves the canonical full-size source once, so a thumbnail click no longer overwrites the full image. Closed by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |
| MAP-P1-14 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** `_cleanupAll()` removes every tracked listener with `removeEventListener`, clears timers, and releases shared MapEngine CSS only after the final active lease; destroying one instance cannot leak its keydown handlers or strip styles from another live map. Closed by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |
| MAP-P1-15 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** The toolbar now has one governed distance-measure button and owner; the dead duplicate `#me-ruler-btn` is absent. Closed by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |
| CSS-P1-01 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Same resolved root cause as `MAP-P1-14`: the shared `me-base-css` node is removed only after the final active lease, not when any one map is destroyed. Source PR #709; unchanged through `3aba5112`. | `8bd891b1` |
| GATE-P1-02 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** `atlas-label-audit.js` now measures label-label, label-marker and marker-marker overlap, clipping and safe-area hits, emits a report and includes adversarial assertions. The original zero-work audit claim is not reproducible at exact anchor `3aba5112`. | `3aba5112` |
| COMP-P1-01 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Atlas preview scale derives pixels per unit from the rendered SVG `getBoundingClientRect()` width and viewBox, eliminating the adaptive max-width estimate that produced the reported error. Reverified at `3aba5112`. | `3aba5112` |
| ASTRO-P1-04 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Story/tour membership accepts both canonical `story.stages` and legacy `story.stage_ids`, and route validation applies the same compatibility rule. Reverified at `3aba5112`. | `3aba5112` |
| GATE-P1-04 | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Dist smoke diagnostics filter the known local CSP/Yandex/favicon transport noise before recording page and console errors, while retaining real failures. Reverified at `3aba5112`. | `3aba5112` |
| QUAL-P2-03 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** The absence claim is obsolete: the current page-ownership registry contains the Karty hub and all governed Karty routes, including Avraam, Ishod, Early Church, Maccabim, Melachim, Pavel, Revelation, Shoftim, Shvatim and Yeshua. Directly rechecked at `3aba5112`. | `3aba5112` |
| NEW-VOSK-FETCH-NO-ABORT | ✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** The model download owns an `AbortController` and aborts the active request during cancellation/cleanup; the historical uncancellable 280 MB fetch claim is no longer reproducible. Relevant Vosk owner files are unchanged through `3aba5112`. | `3aba5112` |
| AR-AUDIT-17 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** The genealogy templates are build-time placeholder sources, not inputs to the claimed `validate:all` inline-script check; generated atlas output contains substituted data. The reported two-error gate failure is not reproducible at `3aba5112`. | `3aba5112` |
| WORKFLOW-POLICY-SHADOW-ERA | ✅ **FIXED/SOURCE+CI VERIFIED 2026-08-01.** Source PR #688 replaces hardcoded route-path policy with registry-owned production-route coverage, capability-based gates, source-read-only validation and explicit permission/write-capability contracts. It also keeps build-once candidate promotion and live witnesses separated, makes actionlint blocking and expands stateful SYSTEM-gate failure coverage. Exact head `fff6155b651620b5e497585948d3b2a9fae5cd67` passed Metadata `30681815950`, Shared/Workflow Policy/actionlint `30681815958`, Node/read-only `30681815957` and TTS/Chromium `30681815981`; zero review threads. Squash merge `0ff04232ee08a8f81711db640395901124aca787`; source issue #64 closed. Production is not claimed. | `0ff04232` PR#688; issue #64; runs `30681815950`/`30681815958`/`30681815957`/`30681815981` |
| HOME-BROWSER-LIFECYCLE-RESIDUAL | ✅ **FIXED/SOURCE+CHROMIUM+WEBKIT VERIFIED 2026-07-26.** PR #405 replaced the impossible blanket WebKit BFCache expectation with a stricter capability-aware contract. Chromium must emit coherent persisted=true events and preserve the exact document token; Playwright WebKit may report persisted=false only with coherent pagehide/pageshow, a new token, `navigationType=back_forward`, restored theme/menu/scroll state and all runtime/shortcut/Pagefind/back-to-top assertions. Exact head `88d17334` passed Runtime `30196286302` and Shared `30196286327`; artifact `8630244568` (`sha256:a92dde7ab47e2b669c131c4acd5ebe606e64adb2f92ba49347218f0772ef1a57`). No retry, waiver or product-runtime edit. | `cc2e829f` PR#405; issue #299 |
| CI-BUILD-VALIDATION-DUPLICATION | ✅ **FIXED/SOURCE+CI+PRODUCTION VERIFIED 2026-07-26.** PR #370 makes `Deploy to GitHub Pages` the sole production owner. Readiness performs the only checkout, `npm ci` and production-like build under Node 22.12.0/npm 10.9.0, validates that exact `dist`, writes provenance and uploads candidate `8634711632`. Privileged promotion downloads, verifies and publishes the same candidate without checkout/install/build. Exact run `30211404138` completed both jobs successfully. | `cd4b7706` PR#370; issue #295; run `30211404138` |
| DEPLOY-PROVENANCE-TTS-COUPLING | ✅ **FIXED/SOURCE+PRODUCTION+LIVE VERIFIED 2026-07-26.** PR #370 replaces top-level TTS-shaped provenance with schema-v4 generic release manifest plus schema-v3 current pointer. Candidate identity/path belong to `releaseSha`; workflow/artifact transport belong to `controlPlaneSha`; automatic production requires equality. Whole-tree digest `sha256:0f1780b179b6dce95dbebb8427a3e44441709d03c3a576afa1234fe86681b1a4` covers 1,110 files / 78,985,779 bytes. Generic live artifact `8634715957` verifies pointer→manifest→build/route/Pagefind/sitemap/feed/core assets before TTS artifact `8634716211` verifies `extensions.tts`. | `cd4b7706` PR#370; issue #292 |
| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ **FIXED/EXACT PRODUCTION+LEDGER RECONCILED 2026-07-31.** Source, release, control plane, live pointer and immutable manifest converge at `a7b2f2b514a9745102ca88579bc0caad9a28754e`. Run `30652948250` attempt `1` published candidate `a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1` / `sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f`; generic and TTS live artifacts passed and source PR #551 received machine ledger comment `5146092545`. A later source merge requires a new current-head witness but does not invalidate this immutable release record. | `a7b2f2b5` production run `30652948250` |
| RESEARCH-AUTHORITY-MANIFEST-MISSING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Research issue #16 produced a machine-readable authority/supersession/rights manifest and publication ledger. PR #348 then pinned exact Research commit `9bba3d45`, authority base `b654c537`, manifest digest `95320cc5…`, four ordered article bundles and exact rights decisions in a read-only site contract. Exact head `ce75fcde` passed Genesis provenance `30176399705`, Shared Guard `30176399710` and Visual Parity `30176399701`; merge `9407cc92`. This closes provenance ordering only: no MDX/routes/publication state changed, `draft-noindex` remains mandatory and `GENESIS6-ACTIVATION-OWNER-GAP` stays open. | `9407cc92` PR#348; Research issue #16 |
| GILL-EXTERNAL-SOURCE-5 | ✅ **FIXED/CONTENT+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #354 replaced five genuinely broken Gill source records while preserving the intended works: Crosby via Open Library, the 1644/1646 London Confession scans page, Folger ESTC N3754, Cowan’s canonical DOI and the UPenn John Gill bibliographic gateway. Final scope was exactly two source-owner components. Real-network run `30175593224` published artifact `8624151439` (`sha256:2bee8f47…`): 201 checked, 171 pass, 30 warning, **0 hard**, 34 hops, `systemicTransportFailure=false`. Exact head `031368f2` passed Gill `30175919593`, Overlay `30175919620`, Glossary `30175919619`, Shared `30175919626`, Dateline `30175919606`, Native `30175919608`, submenu `30175919621`, Print `30175919607`, Visual `30175919629` and Route Registry `30175919627`; merge `b594ba82`, issue #352 closed. | `b594ba82` PR#354; issue #352; artifact `8624151439` |
| HOME-BROWSER-CONTRACT-MISSING | ✅ **FIXED/SOURCE+CHROMIUM+WEBKIT VERIFIED 2026-07-25.** PR #338 added a permanent production-like homepage runtime contract for mobile-menu focus trapping/cleanup, BFCache, canonical search shortcuts and lazy Pagefind initialization, Hebrew pointer/keyboard behavior, reading progress, reduced-motion, overflow and JavaScript-disabled reachability. It also fixed the pre-runtime search gate to reject Alt/Shift, IME and editable targets. Exact head `8d39dab1` passed Runtime Interactive Audit `30175417113` and standard source gates; squash merge `31758828`. Later run `30175901907` attempt 1 failed only WebKit Ctrl+K focus, while its screenshot showed the search surface open; unchanged attempt 2 passed all four browser modes, uploaded artifact `8624672432` (`sha256:2d45251b…`) and notifier issue #357 closed automatically. The first failure remains flake evidence; #365 separately owns the reopened #299 lifecycle/shortcut residual and no assertion was weakened. | `31758828` PR#338; PR#365; issues #299/#357; artifact `8624672432` |
| SOURCE-LINK-REDIRECT-POLICY-BYPASS | ✅ **FIXED/SOURCE+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #324 added per-hop redirect/DNS/private-address policy and deterministic chain evidence; PR #336 / `f65795b2` fingerprinted malformed evidence and pinned workflow Actions; PR #346 / `6c005e49` repaired modern Node pinned-lookup callback shapes, fail-closed systemic-warning detection, bounded response probes and bot-block classification. Clean exact head `e30a9b24` passed Source Link `30175072859` and Shared Guard `30175072868`. Diagnostic artifact `8624053524` exposed five genuine content defects; PR #354 then repaired them and artifact `8624151439` proved 201 checked / 0 hard. SYSTEM issue #303 and CONTENT issue #352 are both closed. | `e8e7c39c` PR#324 + `f65795b2` PR#336 + `6c005e49` PR#346 + `b594ba82` PR#354 |
| FONT-PIPELINE-FAIL-OPEN | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #309 replaced the fail-open production-adjacent downloader with 28 pinned WOFF2 records, a separate support manifest, a fully offline fail-closed verifier, an explicit exact-source transactional maintainer generator and permanent every-declaration/alias adversarial fixtures. Three reviewed upstream drifts are recorded without silently replacing tracked bytes; readiness/deploy perform no font network fetch and issue #302 is closed. Exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928`; squash merge `f4c60ecb`. No font binary, typography or visible UI was changed. | `f4c60ecb` PR#309; issue #302 |
| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED 2026-07-31.** Operational SSOT records exact source/production authority `a7b2f2b514a9745102ca88579bc0caad9a28754e`, deploy run `30652948250`, candidate/live/TTS identities, completed homepage closure and protected ownership of Astro 7. AuditRepo synchronization PR #108 changes no source product code and leaves counters unchanged. | `a7b2f2b5` source+production import |
| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+LIVE VERIFIED 2026-07-25.** PR #308 replaced one-way guessed alerts with a machine-marked workflow+PR/branch state machine, exact failed jobs/steps/artifacts, stale-run ordering, recovery closure and trusted-default-branch execution. `4f23a100` added the ledger lifecycle edge; PR #321 / `a105c354` then made transition ordering monotonic against the newest seen lifecycle event. Live issues #310/#317/#311 prove factual PR-separated alerts. Legacy guessed issues remain separate evidence cleanup. | `779ac52b` PR#308 + `4f23a100` + `a105c354` |
| SERIES-CAPABILITY-INTERFACE | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Every reading `surface: series` route must resolve the canonical shared façade with a `defineSeriesConfig(...)`-bound generic flat/book config or carry one explicit owner-approved capability exception. Existing Nagornaya native routes are machine-registered. PR #319 made the full registry contract a permanent Shared Files Guard owner and added the missing deceptive route-specific `SeriesReaderChrome` name regression; exact run `30170548516` passed and issue #300 closed. | `be78785b` PR#319 |
| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #283 became the sole accepted PDF owner, PR #280 closed without merge, and sole follow-up #286 merged as `f5e29998` after exact physical front/back proof. No competing print lane remains. | `f5e29998` |
| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | `6cba8af0` |
| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI+PRODUCTION+LEDGER VERIFIED 2026-07-26.** PRs #297/#312/#332 established truthful capability evidence and serialized exact-run projection. PR #370 upgraded the same path to one generic release candidate, separate release/control identities, generic live before TTS and one downstream `deployment-release-witness`. Exact run `30211404138` attempt 1 projected candidate `8634711632`, generic `8634715957` and TTS `8634716211` for `cd4b77068fabfde05487859f2178ea89ad9b2e43`. Historical run `30169981463` remains failure; trusted replay `30171194731` remains separate history. | `cd4b7706` PR#370; run `30211404138` |
| PRINT-REVERSIBLE-BACK-3D-FLOW | ✅ **FIXED/SOURCE+CI+PRODUCTION-CAPABILITY VERIFIED 2026-07-25.** PR #286 corrected flipped-state selector specificity for all three reversible-card families without adding `!important` or weakening unrelated screen behavior. Exact physical front/back, restoration, raster and Chromium/WebKit contracts passed; merged as `f5e29998`. Exact readiness/Pages/live/TTS production evidence for the same SHA is imported separately in artifact `8622690663`; this does not imply generic whole-release identity. | `f5e29998` PR#286 |
| ASTRO-P0-05 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #203 replaces console-only MapEngine initialization failures with a route-owned accessible recovery surface: `.me-error[role="alert"]`, synchronized `data-map-state`/`aria-busy`, safe text rendering, retry and return controls ≥44 px. Exact head `1338f71f` passed Shared, Native Source, Route Registry Chromium/WebKit, Overlay, Glossary and Visual Parity. | `0461faa8` PR#203 |
| ASTRO-P0-06 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** Ishod and Avraam now expose readable no-JS and runtime fallbacks instead of an opaque black scene when JavaScript is disabled, `route.json` returns 503, the engine asset fails, initialization throws or returns null. Permanent `engine:sweep` covers eight normal/failure scenarios. | `0461faa8` PR#203 |
| MAP-P0-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #218 constrains shared MapEngine detail panels to the mobile safe-area/viewport and bounds the desktop floating panel; header, tabs and navigation remain fixed while only `.me-content` scrolls with `min-height:0`. Exact head `39569068`: Chromium/WebKit 320×568 and 390×844 contract covers every Ishod marker and real Maccabim data, forced 1500px content and live viewport-height reduction; Shared `30108888569`, Overlay `30108888784` and Visual `30108888609` succeeded. | `d57d49b8` PR#218 |
| DATA-P0-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #224 upgrades shared MapEngine to v0.55 and makes valid author-authored `stages[].paths` authoritative: all 15 Avraam cubic Bézier paths preserve exact `d`, order, semantic color, dash state, underlay, arrow, layer membership and stage label; malformed geometry fails closed to generated `M/L`. Exact head `be2b707c`: seven map jobs `30113097520`, Shared `30113097647`, three-engine Overlay `30113097467` and Visual `30113097686` succeeded. | `c27176bf` PR#224 |
| READER-R6-STATE-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #191 replaced independent whole-document progress/resume calculations with one bounded `ReaderState`: one scroll+rAF owner, explicit before/active/after phases, canonical section/time/completion state, one persisted key with BookmarkEngine v4 and `gb-series-pos` migration, and shared consumers across Gill/series/book, Hermenevtika and ordinary `/about/`. ReaderState alone publishes `--gb-read-pct`/`--gb-read-active`. Exact head `2461198f`: Shared `30098725861`, Gill reconciliation `30098725874`, Overlay `30098725895`, Glossary `30098725882`, Native Source `30098725918`, Route Registry/engine sweep `30098725866` and Visual `30098725897` succeeded. Issue #59 closed; merge `a4372707`. | `a4372707` PR#191 |
| CACHE-BUST-NO-WRITER | ✅ **FIXED/SUPERSEDED BY FAIL-CLOSED POLICY 2026-07-24.** Общий metadata auto-writer намеренно запрещён: PR #187 делает блокирующими read-only revision checks на PR и `main`, catch-all readiness до production build и exact-SHA deploy linkage. Живая мутация `js/search.js` завершилась nonzero и оставила файл побайтно неизменённым. Единственный существующий glossary-autofix разрешён только для явно помеченного `autofix` same-repository PR, с job-scoped write permission, повторным read-only check, `git add -u` и push только в requesting head. 17 adversarial mutations защищают все границы. | `20ded750` PR#187 |
| TTS-DL-CONSENT | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** Owner-approved PR #177 preserves immediate Web Speech and shows one compact post-start card only on a real ~280 MB model cache miss. `Не загружать` aborts the active transfer through `AbortController`, persists the opt-out and leaves the ordinary voice working. Exact final head `1c38a8b6`: TTS Download Consent `30083527472`, Shared Files Guard `30083527643`, Route Registry Validators `30083527432` and Visual Parity `30083527431` all succeeded; the production-like 75-route Chromium matrix, route semantics and Nagornaya UI remained green. Manual review also fixed and mutation-guarded a disconnected loading-pulse keyframe. | `96b7a20f` PR#177 |
| MAP-P1-16 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #173 isolates `input`, `textarea`, `select`, active `contenteditable`, `role=textbox`, IME composition and Alt/Ctrl/Meta chords before any global MapEngine shortcut; Escape remains the canonical overlay close command. Exact final head `64e36c82`: Map Keyboard Contract `30049773607`, Shared Files Guard `30049773605`, Chromium/Firefox/WebKit Overlay Runtime Browser `30049773623` and Visual Parity `30049773601` all succeeded. Exact smoke artifact `8580550637` records `ishod` routes 4/4, signature/story/scientific/keyboard `ok`, 1366px map width, zero overflow and zero console errors. | `bd537dc1` PR#173 |
| MAP-P1-17 | ✅ **FIXED AS SAME ROOT 2026-07-24.** Number keys now query visible `.me-tab[data-tab]` nodes in actual DOM order and invoke the canonical `.click()` handler, so `sci` cannot be skipped by a duplicate `TAB_KEYS.filter` policy. Permanent source regression blocks direct `renderTabContent`, hardcoded tab availability and reclassification of bespoke legacy `avraam` as shared MapEngine; `ishod` is the canonical live engine fixture. | `bd537dc1` PR#173 |
| AUDIT-PRO-ROOT-ONLY | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #169 makes the early source HTML corpus registry-owned without duplicating the production-dist audit: all 75 production routes are explicit as 52 committed source shadows + 23 dist-only routes delegated to mandatory production SEO/HTML/Search contracts; unregistered root HTML and duplicate route mappings are blocking; repeated publication guards consume one corpus; the previously vacuous Russian quote-policy path test is repaired; adversarial mutations are permanent CI. Exact final head `7bda4b44`: Shared Files Guard `30045742164` and Route Registry Validators `30045742230` succeeded; Chromium recorded 75/75 routes, 3428/3428 contracts, route semantics 126/126 and Nagornaya UI 174/174. | `73c49e99` PR#169 |
| SEO-AUDIT-ROOT-ONLY | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-23.** PR #165 derives production SEO from the effective route registry and built `dist`: all 75 routes, exact canonical/robots policy, 66 indexable + 9 explicit noindex, and blocking missing-HTML/Astro-only mutations. Its first witness also fixed 22 heart-series `twitter:image` gaps and `/rodosloviye/` creator metadata. | `3baf6a3f` PR#165 |
| VALIDATE-SCOPE-GAP | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-23.** PR #167 added a dependency-free registry-derived HTML contract after production-like build. All 75 production surfaces receive blocking title/canonical/H1, ID, alt, media/srcset, internal-link, inline-JS and JSON-LD checks; final report: 75 routes, 0 errors. | `04fc99f4` PR#167 |
| VALIDATE-JS-ARTICLES-ONLY | ✅ **FIXED AS SAME ROOT 2026-07-23.** `scripts/validate.js` remains backward-compatible, but `articles/*` plus four hardcoded `EXTRA_PAGES` are no longer the only breadth witness: Native Source Contract runs the canonical 75-route audit and permanent mutation suite. | `04fc99f4` PR#167 |
| AUDIT-PRO-SITEMAP-ROOT-ONLY | ✅ **FIXED/PRODUCTION VERIFIED 2026-07-23.** PR #163 removed root-HTML sitemap inference and made the existing effective route registry authoritative: 66 indexable `production-dist` routes are required; only explicit `profile.seo.indexable=false` exempts a production route. Missing Astro-only routes, unregistered/duplicate/foreign/non-canonical URLs are blocking and mutation-tested. Exact readiness `30006414898`, Pages `30007024100`, live sitemap SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`. Sibling breadth rows are closed by PR #165 and PR #169. | `8a535267` PR#163 |
| AUDIT-ATLAS-DOC-PATH-LEAK | ✅ **FIXED/VERIFIED 2026-07-23.** PR #160 replaced two workspace-specific Atlas documentation paths; PR #162 removed the final `AuditRepo/projects/...` reference from `PremiumControlAnchor.astro`. The final source uses explicit repository identity plus repository-relative paths. | `0f5b3307` |
| AUDIT-FORBIDDEN-JS-NAGORNAYA | ✅ **FIXED/VERIFIED CURRENT.** `js/nagornaya-bar-extras.js` is in canonical `ALLOWED_JS`; exact current `audit-pro` passes 170 checks with 0 errors. | `a73f609f` |
| GATE-CSS-IMPORTANT-RATCHET | ✅ **FIXED/VERIFIED CURRENT.** `css/site.css` uses 183 `!important` declarations against the hard ceiling 200; `css:layer:validate` and `audit-pro` both pass. | `a73f609f` |
| ASTRO-P0-03 | ✅ **FIXED/VERIFIED CURRENT.** `validate-map-routes.js` now promotes stats mismatches to fatal `bad(...)` diagnostics; exact `maps:validate` passes all 11 routes. | `a73f609f` |
| ASTRO-P0-04 | ✅ **FIXED/VERIFIED CURRENT.** Exact `avraam:audit` proves one canonical set of 19 non-context places in HTML and route data; all 27 Avraam assertions pass. | `a73f609f` |
| NG-UI-EPISTEMIC-BIAS-01 | ✅ **FIXED/PRODUCTION VERIFIED 2026-07-23.** PR #154 replaced answer-key red/green presentation with registry-driven observation/model/claim comparisons, preserved alternatives before the confessional conclusion, and added permanent schema/mutation/Chromium guards. Pre-merge: 3428/3428 all-route + 174/174 epistemic; live markers present on production. | `f1946b52` |
| READER-ROUTE-SEMANTICS-01 | ✅ **FIXED/PRODUCTION VERIFIED 2026-07-23.** PR #157 introduced orthogonal `routeRole` semantics (reading/landing/reference/application/page), removed `unknown` from production profiles, and prevented landing/reference routes from inheriting reader UI. Pre-merge: 3428/3428 + 126/126; deployed descendant verified. | `6f412430` |
| NG-PREMIUM-CONTROLS-ARIA-01 | ✅ **FIXED/PRODUCTION VERIFIED 2026-07-23.** PR #158 restored `aria-haspopup="dialog"` and initial `aria-expanded="false"` on Nagornaya Play controls I–V, added a permanent Shared Guard regression and removed the obsolete #154 proof job. Release proof 158/158; exact Pages and live ARIA witness green. | `6fe9be40` |
| PROD-STALE-DEPLOY-RED | ✅ **FIXED/VERIFIED 2026-07-22.** PR #125 removed competing direct Pages ownership and pinned automatic deploy checkout to exact readiness `head_sha`; PR #128 synchronized the v191 SW baseline. Pages run `29910271842` succeeded for exact `a0c9c025`; observer recorded PASS for five critical source/live blobs; issue #58 closed and PR #131 removed witness infrastructure. | `e4cf04ab` PR#125 + `a0c9c025` PR#128 + `942a79eb` PR#131 |
| NG-RUNTIME-BAR-ASSET-01 | ✅ **FIXED 2026-07-22.** Five native and five shadow Nagornaya Part I–V pages load canonical `nagornaya-bar-extras.js?v=3c7e0bdd`; cache-bust catches arbitrary stale Astro revisions; permanent source/adversarial and Chromium contracts landed. Eleven Baptist PageHead revision updates are generated-only. Final standard and three-browser CI green. | `9c3dec16` PR#126 |
| RUNTIME-HIGHLIGHT-DEDUPE-01 | ✅ **FIXED 2026-07-22.** Legacy duplicates compact by normalized route+text; new same-page duplicates are blocked; cross-page same text and 200-item cap remain valid; dialog ARIA lifecycle is synchronized and permanently guarded. Issue #112 closed. | `26efb711` PR#120 |
| NG-PASTORAL-SAFETY-01 | ✅ **FIXED 2026-07-22.** Part V retains the warning about persistent fruitlessness but replaces omniscient/final-verdict wording with self-examination, repentance, pastoral support, Christ's final judgment and protection for contrite believers. Native/shadow parity and permanent regression landed. | `5650c96` PR#138 |
| NG-SOURCE-INTEGRITY-01 | ✅ **FIXED 2026-07-22.** Green corrected to 49–68; Thomas and Nichols linked to exact official `tmsj7d.pdf` / `tmsj7h.pdf`; negative object regression added; source-verification claim bounded; Part IV separates Green's argument, venue and series synthesis. Issue #140 closed; full publication and Native Source green. | `2599844b` PR#141 |
| READER-PUBLIC-SURFACE-BROWSER-01 | ✅ **FIXED/EXTENDED SOURCE+CI VERIFIED 2026-07-24.** PR #145 established the registry-derived Chromium breadth matrix for all 75 public routes at 320/390/1440 and closed the initial Nagornaya mobile failure with 3428/3428 PASS. PR #200 then added permanent all-route touch/browser coverage: Android Chromium 360/430 and iPhone/desktop WebKit 320/390/1440, with exact head `da05253b`, Shared `30098798681`, Route Registry `30098798531`, Android 1828/1828 and WebKit 2660/2660 PASS. Product HTML/Astro/CSS/runtime/content/data were unchanged by #200. | `f9439ef3` PR#145 + `c8b47201` PR#200 |
| CI-VISUAL-PARITY-ROUTE-POLICY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #148 made screenshot capture diagnostic and route policy authoritative: blocking `legacy-diff` remains baseline+0.5%; explicit `native-contract` requires a reason, real unique guard files and profile/policy agreement. `/articles/` and `/baptisty-rossii/` declare native ownership; `/karty/` retains reviewed legacy raster baseline. Fake guards and ordinary regressions fail. Exact main pixel gate and production deploy are green. | `aeae401d` PR#148 |
| CI-HARD-TEXTS-NATIVE-VISUAL-OWNERSHIP-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Fresh screenshots exposed a 2.496% mobile legacy-vs-dist difference because retired legacy HTML omitted the current six-card «Материалы серии» section. PR #151 declared explicit native ownership with route-specific source/component, data-consistency and all-route browser guards; tolerance stayed 0.5%; product UI unchanged. | `0a449118` PR#151 |
| NG-SOURCE-REGISTRY-01 | ✅ **FIXED/VERIFIED 2026-07-22.** PR #149 added the canonical source registry + JSON Schema for Green/Thomas/Nichols, exact PDF/page/extraction/last-checked metadata, supports/doesNotSupport and author/editorial/institution levels. Native source rows derive from registry IDs; exact live/registry witness passed. | `6c4106ae` PR#149 |
| NG-EPISTEMIC-MODEL-LAYERS-01 | ✅ **FIXED/VERIFIED 2026-07-22.** Claim records now distinguish historical reconstruction, literary model and doctrinal synthesis and record primary evidence, alternative, series position, confidence and change condition. Author→institution promotion and conflicting evidence fail adversarial tests. | `6c4106ae` PR#149 |
| CI-ASSET-REVISION-PREMERGE-01 | ✅ **FIXED 2026-07-21.** Every PR now runs read-only cache-bust and workflow-policy contracts in Shared Files Guard; direct/manual deploy treats stale revisions as blocking instead of swallowing failure. | `1bbebc2d` PR#109 |
| DEPLOY-CACHE-BUST-RECONCILE-01 | ✅ **FIXED 2026-07-21.** 62 stale HTML/Astro/helper sources and 113 publication mismatches were regenerated through explicit `--write`, then proved idempotent; special-overlay runtime blobs remained unchanged. | `869558cd` PR#108 |
| SPECIAL-OVERLAY-ADAPTERS-01 | ✅ **FIXED 2026-07-21.** MapEngine, MindMap3D/built launcher, image viewer and mobile fallbacks use canonical OverlayRuntime ownership; zero forbidden direct production writers; foreign-owner/double-destroy/fallback/built witnesses and Chromium/Firefox/WebKit matrix green. | `39f6c3ac` PR#106 |
| READER-R5-OVERLAY-RUNTIME-01 | ✅ **FIXED 2026-07-21.** Один canonical OverlayRuntime владеет reader overlay stack, named scroll tokens, exact style/scroll/focus restoration, inert/aria policy, top-layer Escape и pagehide recovery. `site.js` delegate-only; ReaderSettings, Hermenevtika и shared Gill/series sheets мигрированы. Permanent VM/static tests и Chromium/Firefox/WebKit matrix green. Special map/3D adapters остаются отдельным открытым остатком issue #58. | `43d8672f` PR#104 |
| READER-R4-PUBLIC-SURFACE-REGISTRY-01 | ✅ **FIXED 2026-07-21.** Все 76 public routes явно классифицированы через существующие route profiles: 51 series (27 flat/24 book), 2 article, 9 page, 14 special. Derived chrome/config/settings registry, read-only audit и adversarial mutation tests встроены в постоянный CI; второго SSOT и отдельного book engine нет. | `3a715551` PR#103 |
| READER-R3-SERIES-FACADE-01 | ✅ **FIXED 2026-07-21.** Нейтральный `SeriesReaderChrome` стал public façade для 41 series/book consumer; direct `GillSeriesChrome` imports изолированы постоянным guard, без нового book engine и без DOM/CSS/runtime redesign. | `75b236ac` PR#102 |
| READER-R1-PREFERENCES-01 | ✅ **FIXED 2026-07-21.** Единое `gb:reader-preferences:v1`, Day/Night/Sepia, text preferences, legacy migration, cross-tab sync и общий first-paint bootstrap для series/book/article/page/special. Cross-engine matrix green. | `ffdba149` PR#101 |
| RUNTIME-SCROLL-LOCK-FEEDBACK-02 | ✅ **FIXED 2026-07-21.** MutationObserver больше не создаёт бесконечный feedback loop при открытии settings; lock idempotent/repair-only, runtime guard + engine click witness. | `ffdba149` PR#101 |
| MAP-P0-06 | ✅ **FIXED 2026-07-21.** Composite layer membership, stage.cls/place.type, journey1–3, shared cities, persistence across re-render. | `6a7539f9` PR#98 |
| MAP-P0-07 | ✅ **FIXED 2026-07-21.** Theme toggle реально меняет canvas/SVG/chrome palette без blanket filters. | `6a7539f9` PR#98 |
| ASTRO-P1-03 | ✅ **CLOSED AS SAME ROOT AS MAP-P0-06.** Авраамские abr/lot/war/cand memberships работают по составным данным. | `6a7539f9` PR#98 |
| ENGINE-P1-24 | ✅ **FIXED WITH MAP-P0-06.** Layer visibility survives `renderMarkers()`/story switch. | `6a7539f9` PR#98 |
| ENGINE-P1-25 | ✅ **FIXED WITH MAP-P0-06.** `on:false` respected on initial render and after re-render. | `6a7539f9` PR#98 |
| MAP-P0-04 | ✅ **FIXED 2026-07-21.** Initial camera is resolved before render; unconditional first-place `flyTo` removed; explicit URL > saved state > route/story viewport. | `1a66bd8` PR#97 |
| MAP-P0-05 | ✅ **FIXED 2026-07-21.** Query and legacy hash use one atomic parser/URL builder; story chips, markers, place panel, history and storage synchronize; Chromium witnesses passed on `ishod`/`avraam`. | `1a66bd8` PR#97 |
| MAP-P0-02 | ✅ **FIXED 2026-07-21.** Share использует scoped `getState()` внутри `createMap`; `ReferenceError` закрыт, guard проверяет связь с active place/story. | `1f80f12` PR#96 |
| MAP-P0-03 | ✅ **FIXED 2026-07-21.** Delayed search highlight пересчитывает story membership без out-of-scope `inStory`; очистка возвращает opacity `1/.15`. | `1f80f12` PR#96 |
| MAP-P0-08 | ✅ **FIXED 2026-07-21.** Zoom поддерживает обычный click, Enter/Space, programmatic click и press-and-hold без double-fire. | `1f80f12` PR#96 |
| ASTRO-P0-01 | ✅ **FIXED 2026-07-21.** Stage grouping больше не вызывает `.push()` на undefined bucket; production-like/full publication gates green. | `1f80f12` PR#96 |
| ASTRO-P0-02 | ✅ **FIXED 2026-07-21.** Missing/non-integer/out-of-range `stage` отбрасывается до `stagePaths[p.stage].push()`. | `1f80f12` PR#96 |
| RELEASE-CACHE-BUST-SITEUTILS | ✅ **FIXED 2026-07-21.** Full gate обнаружил 38 stale HTML/Astro refs `site-utils.js?v=f6c1f247`; canonical cache-bust sync обновил их до `5ed472a0`, повторный `validate:static-publication` green. | `1f80f12` PR#96 |
| RUNTIME-SCROLL-LOCK-COORD-01 | ✅ **FIXED 2026-07-21.** Общий coordinator не позволяет одному overlay снять scroll-lock другого; permanent runtime harness в Shared Files Guard. | `779c23c` PR#95 |
| CI-INDEXNOW-CHECKER-STALE | ✅ **fixed-current (reverify 2026-07-14 @ `2ca2af3b`).** `check-workflows.js:157` теперь требует у `indexnow.yml` `contents: read` (least-privilege), а indexnow-submission/baptisty-coverage требования перенесены на `deploy.yml` (`build-indexnow-urls.js --base`, :158). `node scripts/check-workflows.js` → ✅ passed. Починено PR#70. | `3a43cada` PR#70 |
| GILL-PART4-EXEGETE | 🆕 Новая **Часть IV «Экзегет»** серии Гилла (`/articles/dzhon-gill-chast-4-ekzeget/`): герменевтический метод + разбор 7 «универсалистских» текстов против Уитби, triple-render (Astro+MDX+legacy), реальная hero-картинка владельца. Логический реордер отображения III↔IV (Экзегет=III, Наследие=IV) — slugs/routes/ids сохранены (живой URL `/chast-3-nasledie/`). Премиум-рейл: сворачиваемый узкий/широкий + demand-scroll под серии 10+ частей. Барьер зелёный (169 passed). | `eca5dcc9` PR#67 |
| GILL-PART4-STRAGGLER-LABEL | 🆕 2 устаревших «Богословие» в SUBMENU-карточках Части IV после переименования в «Экзегет» (MDX-твин стр.33 + legacy HTML стр.269). Найдено adversarial self-audit собственной работы **до** мерджа. | `96549bb3` PR#67 |
| GILL-RAIL-CSS-SCOPE-LEAK-DEPLOY | 🆕 Мердж PR#67 уронил прод-деплой: новый rail-CSS сработал ложным срабатыванием scope-leak гейта (`premium-controls-rollout-audit.js` требует, чтобы `[data-gill-v16]` шёл первым в каждом арме; не распознаёт `.gbs2-world[data-gill-v16]`). Fix: переставить компаунд-селекторы (`[data-gill-v16].gbs2-world`) — семантика CSS идентична. `audit:premium-controls` 98/98. | `1491fbb2` PR#68 |
| KARTY-Q-BUG-P0 | 🆕 **Запись задним числом** (был фикс, не было строки в матрице → дрейф): `ReferenceError: q is not defined`, `karty/_engine/map-engine.js` — `q` использовалась вне scope её `setTimeout` при показе счётчика совпадений; крешила поиск на проде `/karty/ishod/` и любом map-engine-маршруте. Найдено Playwright-ground-truth (статический karty-audit ошибочно писал «нет q-бага»). Проверено 2026-07-09: `q` теперь в scope на строке 866, комментарий документирует фикс. | `f7e9696` → merge `763271b3` |
| AUDIT-P2-MATRIX-DRIFT | **ЗАКРЫТ стеком `native-source-contract-v1` (r323, deploy green `fc4b6326`).** `route-migration-matrix.json` больше не расходится с ownership/sitemap — он **производный**: материализуется из `page-ownership.json` + `route-profiles/*` движком `effective-route-registry.js`, cross-validation через registry-driven чекеры (`route-profile-contract-audit`/`route-migration-matrix-contract-audit`/`content-source-provenance-audit`, `migration:metadata:check:strict`). ⚠️ При интеграции лейны сами уронили секцию `/karty/*` (david/isus вместо 11 реальных, 8 переименованных потеряны) — поймано новым контрактом, исправлено регенерацией (`sync-route-migration-matrix --write`). | `e679362` gb-main |
| TTS-OUTCOME-TELEMETRY | success/selected-engine телеметрия добавлена: `reportTtsOutcome()` шлёт `tts_engine_selected {engine}` при старте воспроизведения — теперь видно долю Vosk vs Web Speech (её отсутствие и прятало CSP-инцидент). Fire-and-forget, не влияет на playback | `a459ff3` |
| D-22 | Favorites/izbrannoe: `f.path`→href без проверки схемы (само-XSS) + protocol-relative `//host` в image — **уже исправлено другим агентом** (`/^\/(?!\/)/` + protocol-allowlist на оба рендерера); стро́ка висела в P2 open по инерции, снята при quick-fix reverify 2026-07-08 | `365de50` |
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P2-SEARCH-EAGER | search.js eager load → lazy loader | `546f7016` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-CI-001 | deploy.yml двойной `run:` ключ (2 witnesses) | `6e68d7ca` |
| PC-CURRENT-06 | Gill mobile item → partTOC flow | V3 |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy + scrollspy rewrite | `79eab398` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-59 | hard-texts OG dimensions (genuinely fixed) | `6cc68586` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-68 | Dist CSP omitted `form-action 'self'` | `14574a9a` |
| NEW-69 | Astro Karty routes omitted the CSP meta projection | `14574a9a` |
| AR-006 | ✅ **CLOSED 2026-07-14 / CANONICALIZED 2026-08-02.** AuditRepo root allowlists and structure validation were hardened; stray root/intake violations were moved or completed without deleting evidence, and both validators passed. The row was previously marked CLOSED while physically counted in the open AUDITREPO section. | `4c069662` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-README-ANCHOR-01 | README.md TOC stale anchor | `c82a8d4b` |
| NEW-CANONICAL-IZBRANNOE-01 | `/izbrannoe/` canonical relative→absolute | `563e85f3` |
| NEW-IMG-REGRESSION-01 | orphan-image cleanup broken refs | `fc5f94bd` |
| SEC-001-VERIFIER | innerHTML XSS — 3/6 полей без tt() | `3d242b1c` |
| NEW-SAFEURL-XSS-HARDENING | safeUrl() blocked only javascript: | `3d242b1c` |
| NEW-CACHE-BUST-ASTRO | Runtime CSS ?v= empty на 53 Astro-страницах | `6499d42e` |
| NEW-GITCONFIG-COMMITTED | .gitconfig agent identity в корне репо | `6499d42e` |
| BUG-CI-002 | `:light` gate aligned with `:full` — 3 missing checks added | `85a2fd65` |
| AUDIT-P1-CI-GATE-GAP | → merged into BUG-CI-002 (same root cause: indexnow.yml :light gate) | `85a2fd65` |
| BUG-CI-003 | indexnow.yml push retry: exit 1 + ::error:: после 3 fail | `85a2fd65` |
| NEW-ACTIONLINT-CI-GAP | actionlint v1.7.7 wired into shared-files-guard.yml | `85a2fd65` |
| NEW-OG-DIMENSIONS-HARDCODED | Seo.astro og:image:width/height → props с defaults 1200/630 | `85a2fd65` |
| BUG-CLEANUP-001 | 4 dead scripts (~23KB) удалены | `85a2fd65` |
| BUG-SEO-002 | robots.txt: `Allow: /llms.txt` во всех 14 заблокированных AI-ботах | `85a2fd65` |
| NEW-STALE-BRANCHES | 5 merged lane branches удалены с remote | `85a2fd65` |
| CONTENT-PARITY-LOSS-01 | Потеря контента на 2 прод-маршрутах («О серии» 81 слово, «Три истока» 88 слов) — восстановлено, на проде | `d2f34a66` PR#33 |
| AUDIT-P1-FC-IMP | !important ratchet-потолки для floating-cluster(524)/mobile-hotfix(142)/nagornaya-toc(135) в audit-pro | `8d1e8891` PR#35 |
| AUDIT-PRO-FC-IMPORTANT-GAP | = закрыт тем же multi-file ratchet | `8d1e8891` PR#35 |
| BUG-SW-BASELINE-DRIFT | baseline v182→v187 + fatal-равенство currentExpectedCacheVersion под --require-cache-bump | `8d1e8891` PR#35 |
| IMAGE-CROSSREF-GAP | imageCrossRef guard (data/*.json+sitemap ↔ диск); поймал и починил 3 битые ссылки в links-graph.json | `8d1e8891` PR#35 |
| DATA-SERIES-DRIFT | series.json ↔ SERIES_ORDER sync-чек (док. исключения nagornaya/pastor-series) | `8d1e8891` PR#35 |
| UI-GILL-SUBMENU-LABEL-SEMANTICS-09 | Owner decision: подпись = текущему заголовку. Скан: 19/56 дрейфов; 17 relabels + label↔heading энфорс в аудите | `8d1e8891` PR#35 |
| NOINDEX-PHANTOM | phantom yandex-запись удалена из NOINDEX_ALLOWLIST | `8d1e8891` PR#35 |
| AUDIT-PRO-REQUIRE-CRASH | require cache-bust-assets → fatal с диагностикой | `8d1e8891` PR#35 |
| DEAD-SCRIPTS-6 | 6 мёртвых скриптов удалены (0 ссылок, перепроверено) | `8d1e8891` PR#35 |
| CACHE-BUST-STALE-MAIN | самоизлечился первым content-пушем (предсказано в reverify) | `8fd5bb36` |
| SEARCH-SCRIPTURE-BROKEN | Скоуп «Писание»: Pagefind-first роутинг + 70 сокращений (все 66 книг) + scripture в 15 items манифеста + guard. Живой смоук: «Иер 17:9»/«Рим 7»/«Мф 5» находят. Layout-prop rollout meta на остальные страницы — след. лейн | `3d6d8877` |
| GATE-GAP-NATIVE-TEXT-PARITY | content-coverage-audit.js (word-multiset legacy↔dist, 50 маршрутов) в prod-like chain + deploy.yml | `3d6d8877` |
| SEARCH-MANIFEST-QUALITY | scripture-часть закрыта (15 items + guard); slug/image-части остаются P3-мелочью | `3d6d8877` |
| CONTENT-LOSS-AVRAAM-SOURCES | 🆕→закрыт в том же PR: /karty/avraam/ потерял весь научный аппарат «Источники и метод» (14 пунктов) — MapEngine не рендерит панель источников. Восстановлен в статичный слой. Найден новым coverage-гейтом | `3d6d8877` |
| CSS-PARSE-CORRUPTION-SITECSS | 🆕 КРИТ: искажённый селектор `.compare-table:not(...` (5 незакрытых скобок от dead-code коммита 86827c18) заставлял браузер отбрасывать огромный блок site.css ниже по каскаду — корень сломанных глоссарий-тултипов, share-бара и «развалившихся блоков снизу» на ВСЕХ страницах. Доказано в headless (getComputedStyle .gtip: display:inline/borderRadius:0 → 0 правил применялось). Восстановлен чистый регион (b9f4cb59). После: 26 поповеров скрыты, клик → плавающая карточка | `c23929a4` |
| GILL-SUBMENU-STEPPED-FILL | 🆕 Полоска оглавления «прыгала» ступенчатым процентом вместо исторической плавной «metro line». Восстановлена непрерывная пиксельная интерполяция (geo() из pre-astro). Headless: 20 различных значений/21 сэмпл, монотонно | `de6197ce` |
| GLOSSARY-CARD-LILAC-LIGHT | 🆕 Owner: сиреневый «перелив» карточки глоссария (light) → чистый белый + глубокая тень; ночной режим не тронут | `de6197ce` |
| HEADING-ANCHOR-FOCUS-FRAME | 🆕 Owner: квадратная рамка (outline на :focus вокруг 44×44) у скрепки копирования заголовков убрана; иконка реагирует цветом+подъёмом, клавиатурный фокус — мягкое свечение | `de6197ce` |
| GILL-SUBMENU-COLLAPSIBLE-SUBGROUPS | 🆕 Owner: восстановлено историческое сворачивание подпунктов H3 под неактивными H2 (было плоско, всегда раскрыто). Плоская разметка + data-gbs2-grp + geo()-заливка с visDot + railKick rAF-цикл (заливка следует за анимацией). Headless: группы сворачиваются/раскрываются, заливка 0→74→162px | `dca748b5` |
| GILL-RAIL-FLOW-CARD-RESTORE | 🆕 Owner: сабменю вернулось ВНУТРЬ развёрнутой карточки текущей части (историч. flow-rail bcf6389f/pilot v2.1: обложка + «Сейчас читаете» + название ЧАСТИ вместо названия серии на всех страницах + curbar + TOC); остальные части обтекают карточку. Рендер серверный (Astro), аудит-контракт .gbs2-current[aria-current=page] | `55a7d437` |
| GILL-SUBMENU-SUBDOT-CLIPPED | 🆕 Owner: у подпунктов пропали кружочки — overflow:hidden коллапса (PR#44) ампутировал точки, висящие левее li. Коллапс переведён на clip-path inset(0 -2px 0 -30px) — клип по вертикали, точки видимы | `55a7d437` |
| GILL-RAIL-FILL-LURCH | 🆕 Owner: «полоска стоит → рывок → ползёт» — транзишен height .38-.45s ease постоянно перезапускался к движущейся цели. Восстановлен историч. режим follow(): height .08s linear на скролле, none во время rAF-догонки railKick. Замер: монотонный непрерывный рост 2400→9000px | `55a7d437` |
| GILL-RAIL-LINE-GOLD-NOT-BEIGE | 🆕 Owner: линия метро в ночном режиме тёплая бежевая (#e6cba3→#d4a574→#c1945f + мягкое гало) вместо яркого золота; light не тронут | `55a7d437` |
| ARTICLE-END-ACTIONS-SKIPPED | 🆕 Owner: «Поделиться статьёй»/«Распечатать PDF» исчезли на Gill/сериях — site.js пропускал весь конструктор конца статьи при наличии ЛЮБОГО .article-end-block (серверный SDG-крест). Гейт → .article-end-actions; при серверном кресте кнопки встают над ним, второй крест не добавляется. Единообразно на всех статьях (Gill+Герменевтика проверены headless) | `55a7d437` |
| GILL-SAVE-NO-FILL | 🆕 Owner: закладка «дрыгается, но не закрашивается» — fill:none футера рельсы (равная специфичность, позже в файле) глушил золотой fill .is-saved. Явный repaint для [data-gill-v16] | `55a7d437` |
| RESUME-TOAST-STALE-NAG | 🆕 Owner: «Вы остановились на 1%» на всех страницах — на v16 драйвер phase-2 (enhancements) мёртв, позиция заморожена навсегда. Phase-2 заглушен на v16; контроллер ведёт позицию сам: показ при 8–92% и y>1200, раз за сессию, × мутит 24ч, ≥95% очищает | `55a7d437` |
| GBS2-HERO-BOTTOM-STRIP | 🆕 Owner: полоса снизу hero (ярко на Справочнике) — unlayered img{height:auto} перебивал layered .gbs2-hero img{height:124%} (слои каскада), картинка 100% при top:-12%. Unlayered-переутверждение + возвращены параллакс-переменные --gbs2-par/--gbs2-kin-y в контроллер | `55a7d437` |
| GILL-KINETIC-OVERLAP | 🆕 Owner: римская «III» (11vw ≈ 2× зарезервированного отступа) наезжала на лид. Расширен gutter + размер под 3 глифа + золотой hover с подъёмом. Headless: overlap 0px | `55a7d437` |
| TTS-PILL-CLIPPED-RING-DEAD | 🆕 Owner: меню скоростей резалось (overflow:hidden рельсы при пилюле шире рельсы), кольцо прогресса «мёртвое» (апдейт только на границах ~200-символьных чанков). Rail overflow:visible + непрерывный прогресс через utterance.onboundary; пауза подтверждена стабом (playing→paused→playing). Прежние «не работает пауза» частично артефакт: window.speechSynthesis — readonly-акцессор, стаб через defineProperty | `55a7d437` |
| HOME-SEARCH-ICON-LAZY-MISSING | 🆕 Owner: иконки поиска нет в шапке главной при первой загрузке (её инжектил только лениво загруженный search.js). Статический #gbSearchBtn в HomePageChrome, search.js дедупит по id | `55a7d437` |
| AUDIT-FILL-MONOTONIC-LAYOUT-AWARE | 🆕 Аудит §6.3 v2: монотонность заливки проверяется в пределах одной раскладки сворачивания (layout signature) + settle-wait — снапшоты середины анимации сворачивания давали ложные «fill regressed» | `55a7d437` |
| UI-GILL-SCROLLSPY-DEAD-06 | Scrollspy суб-меню был мёртв на всех Gill-страницах (гейт initGbs2Controls); ревив + FATAL live-режим аудита. **На проде** (run 28747336849) | `655e1652` PR#34 |
| UI-GILL-SUBMENU-ORDER-07 | Монотонность меню chast-1/2/3 восстановлена (данные+рантайм+аудит). **На проде** | `655e1652` PR#34 |
| UI-GILL-DOT-TRACK-OFFSET-08 | Точки на линии трека (7.5px→0.5px, историческое размещение внутри ul). **На проде** | `655e1652` PR#34 |
| DEPLOY-YML-DEAD-WARN-STEP | Мёртвый недостижимый warn-шаг «Deploying anyway» удалён из deploy.yml | `655e1652` PR#34 |
| AUDIT-P2-SW-PRECACHE-4 | 4 lazy-ассета убраны из SW PRECACHE; CACHE_VERSION v188; G61: LAZY_NO_PRECACHE + запрет реинтродукции | `41d2413c` |
| BUG-ARCH-001 | = дубликат SW-PRECACHE-4, закрыт тем же фиксом | `41d2413c` |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | = та же суть (precache побеждал lazy), закрыт тем же фиксом | `41d2413c` |
| BUG-SW-001 | isFont() двойное отрицание → позитивная форма | `41d2413c` |
| AUDIT-P3-STYLE-DUP | ID-гарды на инъекцию runtime-CSS (enhancements/highlights) | `41d2413c` |
| AUDIT-P3-QUOTE-NO-CONFIRM | confirm() перед удалением цитаты | `41d2413c` |
| NEW-PREFETCH-UNCONDITIONAL | prefetch-хинты BaseLayout исключают текущую страницу | `41d2413c` |
| BUG-CLEANUP-002 | 31MB stale pixel-diff скриншотов удалены; docs/refactor-2026 32MB→1.3MB (журналы лейнов сохранены) | `41d2413c` |
| BUG-CLEANUP-003 | AUDIT_HISTORY.md — закрыт как BY-DESIGN: файл защищён правилами AGENTS.md (§«Оставлять AUDIT_HISTORY.md»), удаление противоречило бы governance | `BY-DESIGN` |
| BUG-CLEANUP-004 | docs/BUGS_FOUND_2026-06-25.md → docs/archive/ | `41d2413c` |

---

## 🔴 RELEASE-BLOCKING P0/P1 — ОТКРЫТО (0)

| ID | Описание | Witnesses |
|---|---|---|

---

## 🟠 P1 — ОТКРЫТО (70)

| ID | Описание | Witnesses |
|---|---|---|
| CI-WORKFLOW-PROLIFERATION | Control plane expanded from the earlier 19-workflow baseline to roughly 26 permanent workflows with repeated heavy setup/build/test sections. Capability inventory and convergence are required before adding workflows. | current control-plane artifacts; forensic delta 2026-07-25 |
| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |
| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |
| MAP-P1-01 | 🆕 **Karty P1:** Tour mode показывает подпись I этапа для III этапа, анимирует stage dot не по `sid` и сразу вызывает `flyTo(nextPlace)` до остановки | verified-browser (c2c339708252) |
| MAP-P1-02 | 🆕 **Karty P1:** Tour mode полностью отсутствует в мобильном/touch интерфейсе (запуск только по клавише Space) | verified-browser (c2c339708252) |
| MAP-P1-03 | 🆕 **Karty P1:** `shoftim` имеет 6 этапов в метаданных, но все 12 мест привязаны к stage 0; этапы II–VI и фильтрованный tour сломаны | verified-source (c2c339708252) |
| MAP-P1-04 | 🆕 **Karty P1:** Системные перекрытия верхнего UI: search × theme (44×23px), search × share (6×23px), header × timeline (1440×53px), stories × timeline (1007×36px) | verified-browser (c2c339708252) |
| MAP-P1-05 | 🆕 **Karty P1:** Mobile viewport occupancy карты крайне мала (3.8% Судьи, 6.6% 12 колен, 10% Павел), создавая коллизии подписей в центре | verified-browser (c2c339708252) |
| MAP-P1-06 | 🆕 **Karty P1:** `_renderArchaeologyFooter` рендерится под всеми вкладками (267 раз вне вкладки «Археология»), раздувая мобильную панель | verified-browser (c2c339708252) |
| MAP-P1-07 | 🆕 **Karty P1:** Exact marker overlap: Ранняя церковь 2 маркера в (624,800); Жизнь Иисуса пары в (623,800) и (622,799) — нижние некликабельны | verified-source (c2c339708252) |
| MAP-P1-08 | 🆕 **Karty P1:** Переключение story мигает (opacity 0.15→1→dimming); очистка поиска сбрасывает inline opacity всех маркеров | verified-browser (c2c339708252) |
| MAP-P1-09 | 🆕 **Karty P1:** Выбор story через 600мс автоматически открывает панель первого места, перекрывая карту bottom sheet'ом на mobile | verified-browser (c2c339708252) |
| MAP-P1-10 | 🆕 **Karty P1:** Base geography SVG отсутствует (Исход в проде) или накрывается полупрозрачным background rect, гасящим рельеф | verified-browser (c2c339708252) |
| MAP-P1-11 | 🆕 **Karty P1:** Scale bar использует `cfg.W0 / view.w` вместо `canvasWidth / view.w`, ошибка масштаба от 1.32x (desktop) до 4.87x (mobile) | verified-source (c2c339708252) |
| MAP-P1-12 | 🆕 **Karty P1:** Compass размещён в координатах карты (50,80) внутри SVG pan/zoom группы вместо screen overlay, улетая за экран | verified-browser (c2c339708252) |
| MAP-P1-13 | 🆕 **Karty P1:** A11y: 113/113 маркеров без role/tabindex/labels; panel без role=dialog/aria-hidden; JS flyTo/tour игнорирует reduced-motion | verified-browser (c2c339708252) |
| AVRAAM-P1-01 | 🆕 **Karty P1:** Primary CTA «Начать кинотур» невидим (opacity 0) 1.8 секунды после загрузки, оставаясь физически кликабельным | verified-browser (c2c339708252) |
| AVRAAM-P1-02 | 🆕 **Karty P1:** Initial viewport Авраама сжимает кластер Ханаана (Дамаск/Дан, Содом/Беэр-Шева, Хеврон/Мамре) при пустом востоке | verified-browser (c2c339708252) |
| AVRAAM-P1-03 | 🆕 **Karty P1:** Mobile panel Авраама дублирует навигацию (prev/next row + mobile arrows + p-elem `← ←`), квадратный share, tabs 42px | verified-browser (c2c339708252) |
| AVRAAM-P1-05 | 🆕 **Karty P1:** Short landscape desktop (1024×450) блокируется оверлеем «Разверните устройство» из-за слепого media query | verified-browser (c2c339708252) |
| KARTY-DATA-P1-01 | 🆕 **Karty P1:** Острая нехватка ручных anchors/leaders в route.json (8 из 9 engine-карт имеют лишь 0–5 анкоров) | verified-source (c2c339708252) |
| ASTRO-P1-01 | 🆕 **Karty P1:** Начальная камера Авраама на 1-й точке уводит 18 из 19 мест за пределы видимого viewBox | verified-browser (c2c339708252) |
| ASTRO-P1-05 | 🆕 **Karty P1:** Статический root (`avraam-app.js`) и deploy build (`AvraamMap.astro`) отдают две абсолютно разные реализации рендерера | verified-source (32ae0d7d) |
| MAP-P1-18 | 🆕 **Karty P1:** Модальное окно галереи всегда загружает thumbnail 320px и не поддерживает свайпы на touch-экранах | verified-browser (c2c339708252) |
| MAP-P1-19 | 🆕 **Karty P1:** Мобильный landscape (844×390) переключается в desktop-панель, уводя заголовок и крестик закрытия на -357px за верх экрана | verified-browser (c2c339708252) |
| MAP-P1-20 | 🆕 **Karty P1:** Service Worker кэширует неверсионированные скрипты и JSON карт с политикой `cacheFirst`, создавая риск вечных устаревших ресурсов | verified-source (32ae0d7d) |
| GATE-P1-03 | 🆕 **Karty P1:** `atlas:gate` постоянно красный на регрессии waypoints/chars Авраама, пока schema-гейты ошибочно остаются зелёными | verified-ci (32ae0d7d) |
| DATA-P1-03 | 🆕 **Karty P1:** Дизайн-токены эпох `route.meta.era` не читаются рантаймом и не меняют палитру карты | verified-source (32ae0d7d) |
| DATA-P1-04 | 🆕 **Karty P1:** Полностью отсутствует semantic zoom/LOD — шрифты подписей масштабируются до 1.5px на mobile zoom-out и 40px на desktop zoom-in | verified-browser (c2c339708252) |
| ENGINE-P1-26 | 🆕 **Karty P1:** Поиск подсвечивает точки вне текущего сюжета, но не добавляет на них обработчик клика, делая их некликабельными | verified-browser (c2c339708252) |
| ENGINE-P1-27 | 🆕 **Karty P1:** Нажатие Escape в модальном окне фотографии одновременно закрывает родительскую панель места | verified-browser (c2c339708252) |
| ENGINE-P1-29 | 🆕 **Karty P1:** Двойной клик по маркеру принудительно приближает камеру до `w=450` без учёта границ сюжета, обрезая соседние места | verified-source (32ae0d7d) |
| RIVER-P1-01 | 🆕 **Karty P1:** `#waterRipple` `feDisplacementMap scale="7"` деформирует береговую линию на ±7px, отрывая статичные устья рек (Киссон, Иордан, дельта Нила) от берега | verified-source (32ae0d7d) |
| RIVER-P1-02 | 🆕 **Karty P1:** В `<defs>` файла `karty/_engine/base-geo.svg` отсутствует определение фильтра `id="waterRipple"`, хотя фильтр вызывается 4 раза | verified-source (32ae0d7d) |
| RIVER-P1-03 | 🆕 **Karty P1:** `stroke-linecap="round"` при ширине рек 3..5px выдвигает полукруглый закругленный торец на 2.5px за конечные координаты, из-за чего река вылетает в море | verified-source (32ae0d7d) |
| RIVER-P1-04 | 🆕 **Karty P1:** Вызов `getTotalLength()` до завершения компоновки DOM возвращает `0`, принуждая `stroke-dasharray="0"` и мгновенный проскок анимации через берег | verified-source (32ae0d7d) |
| QUAL-P1-01 | 🆕 **Karty P1:** 15 контролов карты не соответствуют стандарту WCAG AAA 44px (`.me-back` 36px, `.me-story-chip` 36px, `.me-arch-more` 32px, `.me-panel__resize` 12px) | verified-source (32ae0d7d) |
| QUAL-P1-03 | 🆕 **Karty P1:** 39 библейских цитат диапазона стихов в движковых картах используют ASCII дефисы `-` вместо типографского тире `–` | verified-source (32ae0d7d) |
| QUAL-P1-05 | 🆕 **Karty P1:** 16 обработчиков событий `wheel`, `touchstart`, `touchmove`, `mousemove` не имеют флага `{ passive: true }`, вызывая задержки скролла на mobile | verified-source (32ae0d7d) |
| QUAL-P1-06 | 🆕 **Karty P1:** 58 таймеров `setTimeout/rAF` работают без привязки к lifecycle cleanup, вызывая выполнении кода после уничтожения карты | verified-source (32ae0d7d) |
| DRAW-P1-01 | 🆕 **Karty P1:** Фиксированный сдвиг подписей на 12px в окне 100x16px в `map-engine.js` не решает коллизии подписей в плотных кластерах | verified-source (32ae0d7d) |
| DRAW-P1-03 | 🆕 **Karty P1:** Отсутствует система архитектурных символов и иконок карт — все места рендерятся простыми плоскими кружками `r=4.5` | verified-source (32ae0d7d) |
| QUAL-P1-08 | 🆕 **Karty P1:** 8 holding-карт используют универсальную заглушку OpenGraph `og-karty-1200x630.webp`, лишая превью карт собственного визуала | verified-source (32ae0d7d) |
| QUAL-P1-09 | ⚠️ **PARTIAL / NARROWED 2026-08-04:** Не все `production-dist` значения ошибочны; фактический остаток — восемь holding/noindex Karty-профилей всё ещё объявляют `currentStatus: "production-dist"` вопреки собственной непроизводственной publication-семантике. Требуется определить канонический status owner и обновить профили вместе с validators. | current source `0fbe7d1e`; `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_0fbe7d1e_karty-profile-status-duplicate.md` |
| BASE-P1-01 | 🆕 **Karty P1:** Базовые векторные подложки (`base-geo.svg`, `mediterranean.svg`, `urheimat.svg`): пустой `<defs>` и 18 отсутствующих ID-линковок (символы гор `#hill`, `#peak`, `#peak-snow`, путь подписи `#canaanRidge`, градиенты `#landG`, `#seaG`), вызывающие сбой заливок суши и невидимость хребтов | verified-source (32ae0d7d) |
| BASE-P1-02 | 🆕 **Karty P1:** Принудительное `opacity="0.5"` на контейнере `me-base-geo` в `map-engine.js:2612`, обесцвечивающее рельеф местности | verified-source (32ae0d7d) |
| BASE-P1-03 | 🆕 **Karty P1:** Угольно-чёрная заливка суши (`#22241f`) и 6 слоев анимированного звёздного неба в `avraam/base.svg`, заслоняющие рельеф и маркеры | verified-source (32ae0d7d) |
| ARCH-P1-01 | 🆕 **Karty P1:** Раскол архитектуры движков: пергаментный стиль и символика изолированы в Node-скрипте `sheet-engine.js`, а браузерный `map-engine.js` рендерит тёмную схему | verified-source (32ae0d7d) |
| SVG-P1-01 | 🆕 **Karty P1:** Экспортированные SVG-файлы (`images/atlas-export/*.svg`) содержат неэкранированные `&nbsp;`, ломающие XML-парсеры | verified-source (32ae0d7d) |
| TEXT-P1-01 | 🆕 **Karty P1:** Моноширинный расчёт ширины плашки подписи (`length * 0.6 * 10`) в `map-engine.js:1550` приводит к обрезке широких букв (`Ш`, `Ж`, `ת`, `ש`) | verified-source (32ae0d7d) |
| MINI-P1-01 | 🆕 **Karty P1:** Миникарта (`.me-minimap`) не содержит векторов географии (суша/моря), показывая точки над пустым чёрным прямоугольником, и перезаписывает `flyTo` | verified-source (32ae0d7d) |
| WAYP-P1-01 | 🆕 **Karty P1:** Подписи точек археологии рендерятся 7px серым текстом без подложек и плашек, накладываясь на линии рельефа | verified-source (32ae0d7d) |
| SIG-P1-01 | 🆕 **Karty P1:** Оверлеи кампаний (`water-split`, `hanukkah-lights`) используют жесткие пиксельные смещения (`origin.x - 74`), искажаясь при смене масштаба | verified-source (32ae0d7d) |
| REG-P1-01 | 🆕 **Karty P1:** `map-engine.js` полностью игнорирует `route.regions`, в результате чего на карте 12 колен (`shvatim`) 13 полигонов уделв не рендерятся вообще | verified-source (32ae0d7d) |
| PERF-P1-01 | 🆕 **Karty P1:** Бесконечная 14-секундная анимация `feTurbulence` в `avraam/base.svg:28` вызывает непрерывную переристовку холста и лаги 15–20 fps при драге | verified-source (32ae0d7d) |
| UI-P1-01 | 🆕 **Karty P1:** Абсолютное позиционирование `.me-search` (`top: 8px; right: 48px`) перекрывает заголовок карты и кнопку «Назад» на экранах 390px | verified-source (32ae0d7d) |
| RELIEF-P1-01 | 🆕 **Karty P1:** Горы в «эталонном» `sheet-engine.js` отрисованы вытянутыми геометрическими овалами `<ellipse>` с штриховкой, а для `urheimat` рельеф пуст | verified-source (32ae0d7d) |
| ROUTE-P1-01 | 🆕 **Karty P1:** Последовательный сплайн Катмулла-Рома в `sheet-engine.js:531` заплывает в море без костыльных точек `route_via` и не поддерживает разветвления | verified-source (32ae0d7d) |
| GLYPH-P1-01 | 🆕 **Karty P1:** 9 из 11 наборов данных карт содержат 0 иконок `glyph`, из-за чего 82% карт вырождаются в обычные дефолтные кружки даже в `sheet-engine.js` | verified-source (32ae0d7d) |
| GRAT-P1-01 | 🆕 **Karty P1:** Непроекционная координатная сетка (`sheet-engine.js:437`): линейные уравнения искажают координаты за пределами Иерусалима, меридианы на поле отсутствуют, а засечки гаснут при зуме >4% (`opacity: 0`) | verified-source (32ae0d7d) |
| SEA-P1-01 | 🆕 **Karty P1:** Плиточный узор волн 20×20px в `#seaPattern` (`sheet-engine.js:52`) даёт эффект «кафельной плитки» поверх морей вместо прибрежных волн | verified-source (32ae0d7d) |
| ORN-P1-01 | 🆕 **Karty P1:** Оформление картуша и компаса (`sheet-engine.js:98, 731, 745`): 3-линейный уголок `#cornerOrn`, кириллическая буква «С» на компасе и вычисление ширины картуша формулой `length * 14.6` | verified-source (32ae0d7d) |
| HALO-P1-01 | 🆕 **Karty P1:** Заявленный массив `halos = []` в `sheet-engine.js:579` не используется, а имитация обводки через CSS `stroke` мылит шрифт мелкого кегля 10–11px | verified-source (32ae0d7d) |
| MEDIA-P1-01 | 🆕 **Karty P1:** 100% фотографий карт (312 ссылок) загружаются напрямую с внешнего CDN Wikimedia Commons без локального кэширования в проекте | verified-source (32ae0d7d) |
| LOD-P1-01 | 🆕 **Karty P1:** Нескейлящаяся обводка 2.6px полностью затапливает просветы букв при сжатии шрифтов до 1.4–2.3px на ступени зума z4 | verified-source (32ae0d7d) |
| BASE-P2-01 | 🆕 **Karty P2:** Грубая, низкодетализированная геометрия побережий в `base-geo-mediterranean.svg` (123 команды) и `urheimat.svg` (68 команд) | verified-source (32ae0d7d) |
| DATA-P2-01 | 🆕 **Karty P2:** Полное отсутствие описаний кривых путей `stages[].paths` у 10 из 11 карт в репозитории | verified-source (32ae0d7d) |
|---|---|---|
| BUG-PERF-001 | addEventListener без removeEventListener: 339 add / 25 remove по всем js/ (294/16 в 5 файлах) | 2 witnesses + пересчёт 07-05 |
| NG-CSS-01 | 🆕 **Нагорная P1:** `tw.min.css` без dark-вариантов — 0 `html.dark` селекторов в 34KB Tailwind-выходе для нагорной. Все dark-ремапы живут исключительно на `!important` хаках `mobile-hotfix.css`. Архитектурная причина NG-DARK-01. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD | 🆕 Атлас родословий v1 **в main** (AGENTS §13, `data/genealogy/v2/build/atlas-interactive.html`, owner milestone 07-14) но **не на проде** из-за PROD-STALE-DEPLOY-RED. Delivery risk, не дефект движка. | milestone intake + verified-ci |

> P0/P1-класса системные находки (транзакция релиза, петля дат, SW-ключи, XSS-поверхности, Bible-корпус) ведутся в `SUPER_AUDIT_2026-07-06_14a49be8.md` (волны W1–W6) и переносятся сюда по мере закрытия.
>
> ℹ️ **V12-исследование доставки TTS (GPT-5.5, 2026-07-08):** фактическая точность о текущем коде подтверждена построчно; но большая архитектура (OPFS data/control plane, 11-статусная generation state machine, chunk-manifest+resumable Range, versioned rollback, split-file, 8 CI-уровней) **осознанно отклонена как несоразмерная** одной модели ~280 МБ, меняющейся ~раз в год. Оставлено 3 реальных пункта (1 P1 UX-решение + 2 не-дизайн улучшения — unzip в Worker, пин ревизии URL). §48-49 (SW не должен кэшировать модель) — код УЖЕ корректен. Полный разбор: `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`.

## 🟡 P2 — ОТКРЫТО (29)

| ID | Описание | Witnesses |
|---|---|---|
| GENESIS6-ACTIVATION-OWNER-GAP | Exact Research provenance is now pinned by PR #348, but canonical Genesis 6 MDX/routes remain absent or draft/noindex. Issue #287 is archived/not-planned transport history and cannot own activation; no fresh-main product finalizer exists. Closing requires one normal reviewable product PR with shared series chrome, exact-head Astro/build/Chromium/WebKit, rights/source and publication-state evidence. | PR #348; issue #287 archived; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_genesis-provenance.md` |
| REG-001 | 🟡 **Hosting/security-header decision.** GitHub Pages live responses expose HSTS but no response-level CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy. Closing requires a proxy/hosting decision or explicit by-design acceptance. | `reverify/CURRENT_OPEN_EVIDENCE_2026-07-23_a73f609f.md` |
| AVRAAM-P2-01 | 🆕 **Karty P2:** Тяжёлый payload Авраама (~824KB, 1540 DOM, 1103 SVG, 60 GSAP animations) + дублирующий fetch route.json | verified-browser (c2c339708252) |
| HUB-P2-01 | 🆕 **Karty P2:** Превью Авраама с запечённым текстом, 138px пустой зазор на wide desktop, QA-термины на паблике, скрытый `/karty/ishod/` индексируется | verified-browser (c2c339708252) |
| GATE-P1-01 | 🆕 **Karty P2:** `maps:validate` и `smoke:maps` пропускают ложные зелёные состояния (не проверяют stages, duplicate coords, JS crashes, bounds) | verified-source (c2c339708252) |
| MAP-P2-02 | 🆕 **Karty P2:** `preload route.json` вызывает предупреждение браузера о несоответствии credentials и создаёт двойной сетевой запрос | verified-browser (c2c339708252) |
| ENGINE-P2-03 | 🆕 **Karty P2:** Безусловная искусственная задержка загрузки (600 мс) скрывает уже полученные данные карты | verified-source (32ae0d7d) |
| ENGINE-P2-04 | 🆕 **Karty P2:** Тосты и уведомления о смене сюжета не имеют `role="status"` и `aria-live`, оставаясь невидимыми для скринридеров | verified-source (32ae0d7d) |
| QUAL-P2-02 | 🆕 **Karty P2:** Черновой лист `nachalo/route.json` не содержит обязательных полей `stories`, `meta.id`, `meta.era`, `meta.stats`, не проходя Ajv валидацию | verified-source (32ae0d7d) |
| QUAL-P2-04 | 🆕 **Karty P2:** `renderMarkers()` уничтожает и заново создаёт 54+ SVG-узлов при каждом вызове, вызывая нагрузки на GC и сброс состояния слоёв | verified-source (32ae0d7d) |



|---|---|---|
| TTS-DL-UNZIP-SYNC | `fflate.unzipSync` по полному ~280 МБ архиву на main thread (vosk-tts-engine.js:107-108) — разовый фриз при фоновой прогревке. Не дизайн. Fix: async `unzip()` в Worker | V12 W1-CI-44, verified |
| TTS-DL-NO-TABLOCK | Нет межвкладочного лока: `_voskWarmupStarted` — page-local, `navigator.locks`/`BroadcastChannel` отсутствуют → 2 вкладки всё ещё могут качать модель дважды. Consent UX закрыт PR #177, но cross-tab ownership остаётся самостоятельным P2 runtime-долгом. | V12 W1-CI-39, verified; PR#177 residual |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится; шире: строковые regex вместо YAML-топологии (см. SUPER_AUDIT W1) | АУДИТ 1.4 + fable 07-06 |
| HUB-AUDIT-COUNT-DRIFT | 🆕 2026-07-14: `hasAuditPendingDesign()` в `validate-map-routes.js` требует exact integer «на аудите» == missingCount. Добавление `nachalo` (11-я карта, 10 missing) при стате «9» роняет весь `maps:validate`/deploy. Fix: генерировать счётчик из publication statuses route.json. | verified-source, mechanism of DEP-BLOCK-MAPS-VALIDATE |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |
| D-1 | `concurrency: cancel-in-progress: true` now on BOTH workflows (was `false` on indexnow — **partial fix** reverify 07-14); groups still separate (`pages` vs `metadata-indexnow-readiness-*`) → deploy and indexnow can still race. **P2→P3** | arena 07-06 + fable; reverify 07-14 verified-source `2ca2af3` |
| D-2 | css-layer-validator: заголовок обещает проверку порядка @layer, код проверяет только необъявленные слои; порог <50% против цели ≥80%; валидирует только site.css. **2026-07-14:** ceiling breach 210>202 → linked **DEP-BLOCK-CSS-IMPORTANT-CEILING** (P0 while blocking) | arena cycle2 + reverify 07-14 |
| D-19 | `<title>` ≠ `og:title`/`twitter:title`/JSON-LD headline на 2 кастомных PageHead (antisovetov, rimlyanam-7): 4 независимых литерала мимо Seo.astro. 🔧 **rimlyanam-7 половина ЗАКРЫТА** (title→канонический, контент-сессия 2026-07-11); antisovetov половина остаётся | arena cycle2; `validate:all` |
| D-21 | Глоссарий: dual renderer — `o()` innerHTML vs `l()` textContent → литеральный `<em>` в серверных тултипах; innerHTML из JSON = XSS-поверхность (W5) | arena cycle3 + fable: js/glossary.js, data/glossary.json (55 `<em>`) |
| ATLAS-D-NAMESPACE-COLLISION | Атлас-трек в `working/atlas/DEBT-REGISTER.md` переиспользует ID D-16..D-19 под визуальные баги листа Авраама, тогда как в матрице эти ID значат SW-baseline/dep. timeout/title-drift. Нужно переименовать в неймспейс `ATLAS-D-*` (или `AV-*`), чтобы не ломать автоматизацию и верификацию. | `incoming/arena-auditor-2026-07-14/2026-07-14/REPORT.md` §1 (ATLAS-D-16-19-NAMESPACE-COLLISION) |
| NG-DEAD-01 | 🆕 **Нагорная P2:** 15 мёртвых Astro-компонентов (HeaderHero/ArticleBody/PostContent × 5 глав) — ни один не импортируется, артефакты Astro-экстракции. ~450+ строк мёртвого кода. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| NG-SEO-01 | 🆕 **Нагорная P2:** SEO-мета несогласованность: (1) `<title>` ≠ `og:title>` — разные формулировки на всех 5 частях; (2) ch.4/5 не имеют `data-pagefind-meta="scripture"`; (3) ch.1/2/3: устаревшая версия «v4.0 · Апрель 2026» в футере, ch.4/5 — без строки версии. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| AR-IDX-JS-02 | **Theme toggle пишет в 3 разных localStorage ключа**: анти-FOUC читает `'theme'` ✓, Astro inline пишет в `'theme'` ✓, `site.js` пишет в `SiteUtils.themeKey` (undefined → `"undefined"`) ✗. Темная тема не сохраняется между сессиями. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-JS-02) |
| AR-IDX-PERF-01 | **LCP image `decoding="async"`** (надо sync для LCP) + **5 render-blocking CSS** + 12 images (10 lazy). Core Web Vitals. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-PERF-01) |
| AR-IDX-PERF-02 | **30+ @font-face для INDEX, половина не используется**: Source Sans 3, Noto Sans Greek, Noto Serif Greek не нужны на главной (~450-1500 KB). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-PERF-02) |
| AR-IDX-JS-01 | **Cleanup на `pagehide` не работает на Mobile Safari**: 3 обработчика `pagehide` — на iOS при background не срабатывает. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-JS-01) |
| AR-IDX-03 | **⌘K хардкод** — на Windows/Linux показывает `⌘K` вместо `Ctrl+K`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-03) |
| AR-IDX-09 | **Keyboard shortcut без altKey/shiftKey guard** — `Option+K` или `Ctrl+Shift+K` тоже срабатывают. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-09) |

## 🟢 P3 — ОТКРЫТО (39)
| NG-VIS-04 | 🆕 **Нагорная P2 (→ NG-TABLE-01):** Табличная перегрузка — 8 секций без текстовых абзацев (ch.2/III/V/IX/X, ch.3/V/VII/VIII, ch.5/III). Только гриды/карточки/таблицы — нет «воздуха». ch.2 имеет 1.5x structured/text ratio. **Контентная правка — требует автора.** Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` §NG-TABLE-01 |

| ID | Описание |
|---|---|
| AUDIT-CSS-DEAD-KEYFRAMES-TOKENS | 🆕 **Мелкая CSS-гигиена (deep-аудит 07-14; still-open reverify @ `21624a3` — `@keyframes fx-breathe` всё ещё ×2).** (а) `@keyframes fx-breathe` объявлен **дважды в одном `site.css`** (первое определение мёртвое); (б) 33 `--custom-prop` определены, но не используются (`--label`,`--ghost`,`--docked`,`--tg`,`--vk`,`--wa`,…). Не влияет на рендер; чистка. NB: проверка var-ов дала **0** реально-отсутствующих токенов (все имеют fallback/JS-set/`@layer base`) — ложных срабатываний нет. | verified-source (postcss AST) |
| AUDIT-CSS-GBFLOATER-DUP-MEDIA | 🆕 **Побайтный дубль правил (CSS/JS continued pass 6, reverify @ `21624a3`).** В `floating-cluster.css` селекторы `.gb-floater` и `html.dark .gb-floater` определены **идентично дважды** в двух разных блоках `@media (max-width:899px)` (стр.112≡665 [450 симв.] и 128≡682 [116 симв.]; postcss AST — тела совпадают побайтно). Второй блок дублирует первый — мёртвое повторение. Fix: слить блоки (снижает NEW-CSS-BUDGET-01). Прочие «дубли» селекторов по AST — легитимные оверрайды. | verified-source (postcss AST diff) |
| AUDIT-JS-ESCAPER-DUP-X5 | 🆕 **5 копий HTML-эскейпера (CSS/JS continued pass 6, reverify @ `21624a3`).** `js/site.js` содержит `function tt()` **×3** (три IIFE; две — цепочки `.replace()`, одна — вариант через lookup-таблицу `/[&<>"]/g`; вывод тот же, код разный) + `h()` в `highlights.js` + `F()` в `search.js` = **5 копий**. `js/site-utils.js` (дом общих утилит) эскейпера **не имеет** → каждый файл катит свой. Риск: копии дрейфуют — класс, породивший D-21 (рассинхрон эскейпинга глоссария). Fix: вынести один эскейпер в `SiteUtils` и ссылаться (дедуп 5→1). | verified-source (grep + AST) |
| GATE-MARKER-DATA-DRIFT | 🆕 Системный риск: захардкоженные строки/значения в гейтах 4 раза за 05.07 расходились с работой параллельных лейнов (маркер pastor-series, зеркало timestamps, двойник precache-проверки audit-pro↔dist-publication-audit, label chast-2). Рекомендация: (а) выносить маркеры/списки в data/*.json рядом с контентом; (б) дедуплицировать двойные проверки через общий модуль (по образцу cache-bust-assets.js) | хроника 4 инцидентов 05.07 |
| NEW-CSS-BUDGET-01 | 🔄 reverify 07-14: конкретика — `audit-pro` ⚠️ «Core CSS total **554013** bytes exceeds budget **425000**» (+30% над бюджетом; site.css 291КБ + floating-cluster 192КБ + home 82КБ доминируют). Не блокирует деплой, но постоянный warning. Кандидат: аудит мёртвых правил (см. AUDIT-CSS-DEAD-KEYFRAMES-TOKENS) + разбор дублей селекторов (floating-cluster 77, home 102 по AST) |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| NG-TOC-01 | 🆕 **Нагорная P2:** TOC accent-number не per-chapter — `mobile-hotfix.css` hardcodes `var(--ng-toc-accent-2, #f59e0b)` (amber fallback). Решается через `var(--ng-accent)`. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §8 |
| NG-CROSS-01 | 🆕 **Нагорная P3:** Кросс-главные цветовые утечки — 20+ экземпляров не-акцентных цветов: ch.2 text-purple-800 (Ipsissima vox), ch.4 text-emerald-700 ×8 (Concursus таблица), ch.5 text-blue-*/bg-emerald-*. Не ломает визуал сейчас, но затрудняет миграцию на CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §2.2 |
| NG-SERIYA-01 | 🆕 **Нагорная P3:** Seriya page без `bg-stone-100` на `<body>` — единственная из 9 nagornaya-страниц без него (есть `nagornaya-series-page`). Нужен `data-chapter` для CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §8 |
| NG-A11Y-01 | 🆕 **Нагорная P3:** Emoji вместо SVG иконок (18 секций: 10 ch.2 + 8 ch.5) — рендеринг зависит от ОС, не масштабируется; ch.2 секция VIII использует `#` вместо emoji; inline hero height `style="height:320px"` не адаптивен. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §4.3 |
| STRANGLER-HYGIENE | 50/53 Astro-маршрутов имеют дублирующийся legacy HTML в корне репо (работает корректно через page-ownership, но техдолг). |
| D-3 | 🔄 reverify 07-14 (pass 4): JS total **469101** > 365000 (было 375041 — вырос ~94КБ на atlas/TTS/mobile); **CSS-бюджет БОЛЬШЕ НЕ в норме** — Core CSS **554013** > 425000 (см. NEW-CSS-BUDGET-01). Оба — ⚠️ warning (не блокируют деплой). `audit-pro.js` |
| D-4 | Magic z-index: `floating-cluster.css:2372/2447/2504/2697/2882`, `mobile-hotfix.css:129` — hardcoded `2102 !important`/`9999 !important` вместо `var(--z-max)`. ⚠️ `--z-*` токены **НЕ ОПРЕДЕЛЕНЫ** в проекте (см. AR-IDX-CSS-01 P1) — фикс D-4 требует определить токены сначала, потом заменить hardcoded. (⚠️ PremiumControls in-flight — согласовать) |
| D-7 | ⬇️ Downgraded (reverify 2026-07-08): строка 3 `PremiumControlAnchor.astro` — репо-**относительная** ссылка на doc (`AuditRepo/projects/.../PremiumControls/README.md §1`), а не абсолютный внутренний путь/секрет → фактически безобидно. Косметика: убрать ссылку при случае |
| D-8 | `deploy.yml paths:` не включает `*.md` (doc-only не триггерит деплой; by-design пока Markdown не публичный вход, см. SUPER_AUDIT W4) |
| NF-DEAD-ENHANCE-SHIM | 🆕 reverify 07-09: `enhanceGillMobileBarMarkup` мёртв для прода (bail :986 — все prod-страницы уже v4); тело (988-1047) строит `.mobile-btoc-meter`/`.mobile-icon-row`, чей CSS удалён `30bf3f5c`. Автор отложил в follow-up. `floating-cluster-controller.js:973-1048`. verified-source |
| NF-SPEEDSLOT-4TH-COPY | 🆕 reverify 07-09: дедуп speed-slot 3-из-4 — `GillSeriesRail.astro:209` держит собственный inline `initGillRailSpeedSlot`, не импортит `_shared/speedSlot.ts` (как 2 мобильных бара + HermenevtikaRail). Рефактор-мелочь. verified-source |
| NF-GATE-IZ5-STALE | 🆕 reverify 07-09 (инстанс GATE-MARKER-DATA-DRIFT): гейты хардкодят запрещённый маркер «Часть 1 из 5» (`premium-controls-rollout-audit.js:210`, `gill-v16-mobile-play-smoke.js:253`), но части теперь рендерят «из 3» → guard проходит вакуумно, пропустит будущий miscount. Fix идёт вместе с выносом счётчиков в data/. verified-source |
| NF-STRANGLER-BAR-DRIFT | 🆕 reverify 07-09 (конкретика STRANGLER-HYGIENE): корневой legacy-HTML Гилла = старый 1-уровневый мобильный бар (`#mobTocBtn`, без `__label`) vs v4 в astro. Production-dist → не отдаётся, но дрейфует. verified-source |
| NEW-HARDTEXTS-CSP-MISSING-HFCDN | 🆕 reverify 07-09: `hard-texts/index.astro:122` connect-src без `*.aws.cdn.hf.co` (единственный astro-файл без него из 37). Инертно — на hard-texts нет кнопки Listen; выровнять для консистентности. verified-source |
| NG-VIS-10 | 🆕 **Нагорная P3:** Библиография не использует ref-*/ref-card систему site.css (ad-hoc markup). Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` |
| NEW-HIGHLIGHTS-NO-REINIT-GUARD | 🆕 reverify 07-09 *(suspected)*: `highlights.js` IIFE без re-init guard — двойной `<script>`-include продублирует FAB + глобальные mouseup/keydown/scroll/resize. Низкий риск (статический include). |
| NEW-SAVE-QUOTE-TIMER-RACE | 🆕 reverify 07-09 *(suspected)*: кнопка «Сохранить цитату» инжектится одноразовым таймером 500ms (`highlights.js le()`); если `#selection-share-popup` не в DOM на +500ms — не добавляется и не ретраится. Зависит от порядка init. |
| NG-DARK-01 | ⚠️ **CURRENT / SOURCE+REFINED CHROMIUM NARROWED 2026-08-04:** Exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003` passed the nine-route native contract and production-like build. Native source yielded 19 candidate tokens / 443 uses; refined Chromium run `30908030497` (36/36 observations, 0 meaningful errors; artifact `8892026949`, `sha256:ff3896b0c208b4e385552dd2b1646149b1e441de3fb495cb7d9f08d7697c0b43`) confirms only **9 tokens / 142 source uses** as actual dark-theme defects: `text-blue-600` (41×), `text-rose-600` (41×), `text-purple-600` (40×), `text-purple-700` (12×), `text-teal-700` (3×), `bg-stone-200` (2×), `text-orange-700` (1×), `text-red-600` (1×), `text-rose-700` (1×). `bg-stone-200` is a light island and contrast failure; the other eight fail text contrast. Ten tokens / 301 uses are removed from repair scope, including browser-effective `bg-stone-100`, readable accent levels and the remapped subtle decorative `border-stone-100`. Future Product repair and permanent browser acceptance must be bounded to these nine tokens only. No Product mutation, production or TTS claim. | `f9d01207` runs `30907436765`/`30908030497` artifact `8892026949` |
| NG-STRUCT-01 | 🆕 **Нагорная P1:** Сломанная структура заголовков секций — ch.2/SectionX, ch.5/SectionI–IV/X не имеют `<div class="group mb-6 mt-12">` обёртки (нет иконки, подзаголовка, отступа). Регресс Astro-миграции. + Emoji вместо SVG (19 секций ch.2/ch.5) + `font-sans` на h2 (4× ch.5). Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |
| NG-INLINE-01 | 🆕 **Нагорная P1:** «Из библиотеки» блок — inline `color:#1c1410`/`#8a7968`/`#b8882a`/`background:#faf8f5` на всех 5 частях, дублирование 5×. CSS override не пробивает inline `style=`. **Решение:** Astro-компонент `NagornayaLibraryLinks.astro` + Tailwind + CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` §NG-INLINE-01 |
| AR-IDX-04 | Ссылка «★ Избранное» в десктопном навбаре Astro потеряла класс `h-nav-fav` (legacy имеет). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-05 | `SITE_CONFIG.version: 1778943682` хардкод, query-строки `?v=...` хардкод. Stale cache на проде при изменении файла. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-06 | `<div class="h-reading-progress">` рендерится всегда, но `features.readingProgress.enabled: false`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-07 | `<h1 tabindex="-1">` без фокус-менеджмента — skip-link ведёт на `<main>`, не на h1. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-08 | ~25 inline `style=` в Astro-компонентах (Publications, Planned, Quote) вместо CSS-классов. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-10 | CSP различается между legacy и Astro (cdn.jsdelivr.net добавлен, не синхронизирован). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-A11Y-01 | Карточки-ссылки без `:focus-visible` стилей, с inline `style="text-decoration:none;cursor:pointer"`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-CSS-02 | `.home-v20 { overflow-x:hidden }` клиппит абсолютный `.h-scripture-bg` (фоновые цитаты). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-CSS-03 | `.h-reveal:not(.h-in)` — 3s fallback анимация: если IntersectionObserver не сработал, юзер ждёт 3 сек. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |

## 🔵 P3 — РЕФАКТОРИНГ (4)

| ID | Описание |
|---|---|
| R-001 | site.js монолит ~167KB (15 модулей) |
| R-002 | enhancements.js монолит ~48KB |
| R-003 | Нет source maps |
| R-004 | Нет type="module"/tree-shaking |

## 🟣 AUDITREPO (3)

| ID | Описание |
|---|---|
| AR-001 | validate_audit_repo.py hardening |
| AR-004 | verification protocol automation |
| AR-005 | reverify automation |

> ✅ **AR-CI-RED — ЗАКРЫТ 2026-07-14** (governance, не баг source-репо): `origin/main` был на 581 коммит впереди (параллельные агенты, atlas-верификация), но **AuditRepo CI (`validate_audit_repo.py`) был красный**: (1) stray root `DEBT-REGISTER.md`; (2) intake `claude-atlas-deep-audit/2026-07-10` без `README.md`/`REPORT.md`; (3) intake-папка `claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1` с невалидным именем даты. Починено **минимально и без удаления чужого контента** (CLEANUP §7): `git mv` root-файла в `working/`, additive-`README.md` в 2026-07-10 intake, `git mv …/2026-07-14-milestone-atlas-v1 → …/2026-07-14-r1` + preservation-note. Оба валидатора PASS. Урок для параллельных агентов: гонять `validate_audit_repo.py` **до** пуша. Детали: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md` §AR-CI-RED.

---

## Примечания

### Дубликаты (объединены):
- **BUG-ARCH-001** = **AUDIT-P2-SW-PRECACHE-4** (одна суть: SW precache содержит lazy assets). Оставлено оба ID для обратной совместимости с reverify-документами.
- **NEW-CACHE-BUST-ASTRO** закрыто (`6499d42e`), но **AUDIT-P3-SEARCH-LAZY-CONFIRMED** и **AUDIT-P2-SW-PRECACHE-4** описывают ту же тему SW/lazy — не дубликаты, разные root causes.

### Severity dispute: BUG-SW-BASELINE-DRIFT — RESOLVED → P2 (2026-07-05)
- **Pass 91 (agent):** P2 — "документационный drift, SW корректен, CI осознанно note()"
- **Pass 92 (agent):** P0 — "CI не фейлится при --require-cache-bump, deploy-safety gap"
- **Решение (владелец делегировал; reverify 07-05):** P2. Гейт энфорсит только «≠ pre-switch v171» (`sw-dist-readiness-audit.js:82-89`), `currentExpectedCacheVersion` — note(). Фикс: bump baseline v182→v187 + строгое равенство под `--require-cache-bump`.

### Dispute resolution: P1-DEPLOY-FAIL — остаётся ЗАКРЫТ (false reopen, 2026-07-05)
- Intake `arena-agent-verifier-hardening-2026-07-05` и `working/VERIFIER_SYNTHESIS` считали reopened по grep-хиту `conclusion == 'failure'` в deploy.yml.
- **Reachability-анализ на `68b2bf4c`:** job-level `if:` (deploy.yml:62-65) пускает только success/dispatch/push → при failure job скипается. Хит — в недостижимом warn-шаге (deploy.yml:72-75, dead code). См. DEPLOY-YML-DEAD-WARN-STEP (P3) и `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_content-parity-loss-restored.md` §4.

### False positives (отклонённые находки):
- `AUDIT-P2-NODE-REGEX` — fabricated evidence (функция mustScript не существует). Archive: `archive/false-positive/`
- `AUDIT-P3-REACT-UNDOCUMENTED` — React IS used. Archive: `archive/false-positive/`
- `BUG-ASTRO-CONFIG-001` (Pass 88) — downgraded to INFO.
- `BUG-SITEMAP-8-KARTY-MISSING` — 8 karty/ routes are temporary placeholders with `data-pagefind-ignore`, intentionally excluded from sitemap by `check-map-publication-status.js`.
- `BUG-FRONTMATTER-INCONSISTENCY-01` — Zod schema uses `.default(false)` / `.default(true)`. Omitting fields is valid, not inconsistency.
- `AUDIT-PRO-VM-DEPRECATED` / `VALIDATE-JS-VM-DEPRECATED` — **опровергнуто живым тестом 2026-07-09.** `new vm.Script(...)` на текущем рантайме (Node **v22.22.2**) под `node --pending-deprecation` даёт **0 предупреждений**. Deprecated — другая, более старая функция `vm.createScript()`, а не класс `vm.Script`/`new vm.Script()` (это актуальный, не устаревший API). Оригинальная находка не была прогнана на живом рантайме до фиксации claim'а. Обе строки сняты с P3-open.

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица (вкл. PASS-evidence секции) → `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`
- ⚠️ Прежние ссылки на `archive/2026-07-05-matrix-pre-restructure/` и `archive/2026-07-05-pass-evidence/` были битыми (папки не существовали) — исправлено 2026-07-06.

### Archive-candidates (incoming/, superseded — к переносу в `archive/stale/` следующей чисткой):
> Инвентаризация incoming/ 2026-07-09 (без физического переноса — evidence-трейлы, чтобы не конфликтовать с активными агентами). Все — evidence уже-обработанных находок:
- `incoming/arena-agent-verifier-hardening-2026-07-05/` — reopen-claim P1-DEPLOY-FAIL признан false (см. выше §Dispute); содержал AR-014, теперь закрыт governance-сессией 07-09.
- `incoming/fable-super-audit/2026-07-06/` — влит в `SUPER_AUDIT_2026-07-06_14a49be8.md`; позитивные cycle2/3-заявления отозваны.
- `incoming/arena-agent-karty-visual-baseline-*/` — вытеснен `arena-agent-karty-*-v3-deep-audit` (12/75 VB отозвано ground-truth Playwright).
- `incoming/arena-auditor/2026-07-06/RESEARCH_gill-*` — контент перенесён в `FedorMilovanov/Research`; остались заглушки.
> Karty-технический кластер (KARTY-03/04/05/07/11/14, addEventListener-leaks, GSAP-CDN, JS-CSS-инъекция) — **НЕ archive**: реальные, но долгострой karty-Atlas, ведётся отдельно. Q-BUG P0 из этого интейка — закрыт (см. KARTY-Q-BUG-P0).

---

## Статистика (обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 358 canonical = 213 closed + 145 open)

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 213 |
| **P0 открыто** | **0** |
| P1 открыто | 70 |
| P2 открыто | 29 |
| P3 открыто | 39 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто (матрица)** | **145** |
| Системный бэклог вне матрицы | см. `SUPER_AUDIT_2026-07-06_14a49be8.md` (волны W1–W10; **W1 on fire**) |
| False positives отклонено | 5 |
| Passes processed | 100+ (reverify 2026-07-22 @ 2b67ee8f; Nagornaya source/PDF verification added) |

---

## Session log (append-only)

### 2026-08-04 — Nagornaya refined Chromium dark-theme narrowing @ `f9d01207`
- Refined production-like Chromium measured all nine native routes at desktop/mobile and light/dark: 36/36 observations, zero meaningful errors.
- Narrowed `NG-DARK-01` from 19 source candidates / 443 uses to 9 browser-confirmed tokens / 142 uses.
- Removed `border-stone-100`, `bg-stone-100` and eight readable accent tokens from Product repair scope; reconciled `NG-BODY-01`, `NG-DARK-05` and `NG-MOBILE-01` without changing counts.
- Exact run `30908030497`, artifact `8892026949`, digest `sha256:ff3896b0c208b4e385552dd2b1646149b1e441de3fb495cb7d9f08d7697c0b43`. No Product mutation, production or TTS claim.

### 2026-08-04 — Nagornaya aggregate duplicate consolidation @ current source `0fbe7d1e`
- Closed `NG-INLINE-02` as DUPLICATE/MERGED into open root owner `NG-INLINE-01`.
- Closed `NG-STRUCT-02` as DUPLICATE/MERGED into open root owner `NG-STRUCT-01`.
- Closed `NG-MOBILE-01` as an aggregate duplicate of open owners `NG-BODY-01`, `NG-TOC-01` and `NG-A11Y-01`.
- All five root owners remain open and no Product repair is claimed.
- Canonical arithmetic moved from **203 closed / 155 open** to **206 closed / 152 open**; P2 moved **33→31**, P3 **43→42**. No Product mutation or production claim.

### 2026-08-04 — Nagornaya visual duplicate/false-positive consolidation @ current source `0fbe7d1e`
- Closed `NG-VIS-05` as FALSE-POSITIVE: current `glossary.js` consumes `div.reveal` as a semantic prose selector and no animation was intended.
- Closed `NG-VIS-06` as DUPLICATE/MERGED into open root owner `NG-STRUCT-01`.
- Closed `NG-VIS-07` and `NG-VIS-08` as DUPLICATE/MERGED into open root owner `NG-DARK-01`.
- Root structural/dark findings remain open; `NG-VIS-04` is untouched.
- Canonical arithmetic moved from **199 closed / 159 open** to **203 closed / 155 open**; P3 moved from **47** to **43**. No Product mutation or production claim.

### 2026-08-04 — Karty Hebrew font duplicate consolidation @ current source `0fbe7d1e`
- Retained `QUAL-P1-02` as CONFIRMED-CURRENT canonical owner for the combined explicit Hebrew font and RTL direction residual.
- Closed `FONT-P1-01` as DUPLICATE/MERGED because it is only the font-family subset of the same defect.
- Current engine still uses Georgia/Times for `.hw`, has no `dir="rtl"` contract and selects `he_deep` for the Hebrew tab.
- Canonical arithmetic moved from **198 closed / 160 open** to **199 closed / 159 open**; P1 moved from **73** to **72**. No Product mutation or production claim.

### 2026-08-04 — Karty route-profile status duplicate narrowing @ current source `0fbe7d1e`
- Narrowed `QUAL-P1-09`: the current residual is eight holding/noindex Karty profiles still declaring `currentStatus: "production-dist"`; the broader claim that all Karty profiles are wrong is disproved by the legitimate production Avraam profile.
- Closed `QUAL-P2-01` as DUPLICATE/MERGED into the narrowed P1 owner.
- Current Shoftim profile combines `production-dist` with an explicit holding/noindex reason, proving the residual without choosing a replacement vocabulary.
- Canonical arithmetic moved from **197 closed / 161 open** to **198 closed / 160 open**; P2 moved from **34** to **33**. P1 remains **73**. No Product mutation or production claim.

### 2026-08-04 — Avraam duplicate-river closure @ current source `0fbe7d1e`
- Closed `RIVER-P1-05` as FIXED-CURRENT and `DRAW-P1-02` as DUPLICATE/MERGED into the same root cause.
- Product commit `39df9ed0e650cc08f93c14145cb592868f0c80e4` removed the complete second Nile group under `waterRipple` rather than masking it; current source retains one canonical Nile system and the permanent Chromium visual harness.
- The historical implementation commit has no attached Actions run, so this is a direct source disposition with no CI or production claim.
- Canonical arithmetic moved from **195 closed / 163 open** to **197 closed / 161 open**; P1 moved from **75** to **73**.

### 2026-08-04 — Karty story-ID schema closure @ current source `0fbe7d1e`
- Closed `QUAL-P1-07` as FIXED-CURRENT.
- Product PR #666 / merge `424b09b25fc9d4bace3938f4d44f430be8cc7e4b` aligned internal story/filter identifiers with the canonical schema while preserving hyphen-only public route IDs.
- Exact Product head `12aa744e10c05c134adc951f01cb5e78ef25de65` passed four triggered workflows; current source retains the exact schema and all-route regression guard.
- Canonical arithmetic moved from **194 closed / 164 open** to **195 closed / 163 open**; P1 moved from **76** to **75**. No current production claim.

### 2026-08-04 — Home discovery metadata parity closure @ current source `0fbe7d1e`
- Closed `AR-IDX-01` and `AR-IDX-02` as FIXED-CURRENT.
- Product PR #675 / merge `0131f8b9d6c717f85a8990700b72b09b575219a4` restored both Home hreflang alternates and the complete WebSite SearchAction contract.
- Exact Product head `404db8d14087d29522e56f190717d6224e8e3bfb` passed nine triggered workflows; current source retains the repaired metadata and permanent production-like assertions.
- Canonical arithmetic moved from **192 closed / 166 open** to **194 closed / 164 open**; P1 moved from **78** to **76**. No current production claim.

### 2026-08-04 — editorial projection-only drift closure @ current source `0fbe7d1e`
- Closed `EDITORIAL-PROJECTION-51-DRIFT` as FIXED-CURRENT and architecture-superseded.
- Product PR #442 / merge `f7e426996fd41a23ca720299a8ef1ce7f1c0952f` restored 27 unauthorized editorial dates while retaining all 51 proven projection observations and added permanent preservation/diff contracts.
- Current source retains the exact workflow and preservation-test blobs that passed Editorial Metadata v3 run `30679631914` on exact head `7de20ed77e60ec05bb91322ac03800a3d9860410`.
- Historical deployment run `30300756799` belongs to `f7e42699`; current Product `0fbe7d1e` has no same-SHA production claim.
- Canonical arithmetic moved from **191 closed / 167 open** to **192 closed / 166 open**; P1 moved from **79** to **78**.

### 2026-08-04 — Avraam skip navigation and contrast disposition @ source merge `778a218d`
- Source PR #812 merged exact verified head `3bd7f8a47bab65f08de45d81707cff2f6233cc55` as `778a218d9e6dc4c051721fc0f0fe56ee9125c797`.
- Closed `A11Y-P1-02` as FIXED-CURRENT: exact Chromium Dossier run `30807589787` proved one focus-reveal skip link, first-Tab focus, visible `295.125 × 44` geometry, native activation to programmatically focusable `#stage`, and `304/304` expected states.
- Closed `A11Y-P1-03` as STALE-ON-CURRENT-HEAD: `1208` browser-composited contrast samples had minimum `5.084:1`, maximum `7.351:1`, and zero invalid samples against the `4.5:1` threshold.
- Exact evidence artifact `8853648893`, digest `sha256:54653a134572f2c6885168dacb938c9213c687d0425f7c5ec497876bdd9d7522`; Reference Baseline artifact `8853899070`, digest `sha256:6a407a7c5e142d1939ec57b20ae2bfa69be0243c6c00c4667343a75cbf70d2a4`.
- Canonical arithmetic moved from **189 closed / 169 open** to **191 closed / 167 open**; P1 moved from **81** to **79**. No production claim.

### 2026-08-03 — Atlas accessibility closure @ source merge `d69268b2`
- Source PR #759 merged exact verified head `33a2380d6748da26d64eb33d84ff7e588fd6e508` as `d69268b27bb83fe8741159da59f9c1b038d7d9b9`.
- Closed `A11Y-P1-01`: the visible intro lifecycle now has exactly one H1; sampled Chromium witness run `30771541994` recorded `maxH1CountDuringIntro=1`.
- Closed `AVRAAM-P1-04`: ARIA tab semantics, roving focus, Space/Enter and Arrow/Home/End ownership passed bounded accessibility and final Map Keyboard run `30779633059`.
- Final head also passed Dossier `30779633089` (`304/304`) and Reference Baseline `30779633071` (seven viewports, zero verification failures).
- Canonical arithmetic moved from **187 closed / 171 open** to **189 closed / 169 open**; P1 moved from **83** to **81**. No production claim. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-03_d69268b2_atlas-a11y-closure.md`.

### 2026-08-03 — expanded browser/runtime wave @ exact source/main `1944eb1b`
- Production-like Chromium run `30769737659` confirmed `A11Y-P1-01`, narrowed `AVRAAM-P1-04` to the current ARIA/Space/arrow residual, and closed `QUAL-P1-04` as stale after the Цоар modal retained the 1280px full source immediately and after 700 ms.
- Canonical arithmetic moved from **186 closed / 172 open** to **187 closed / 171 open**; P1 moved from **84** to **83**.
- The parallel Atlas PR-head job is evidence-only and does not replace the source/main disposition anchor. No production claim. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-03_1944eb1b_browser-runtime-wave.md`.

### 2026-08-02 — registry-derived shadow-audit closure @ `d23546ce`
- Closed `SHADOW-AUDIT-NARROW` after source PR #780 replaced the seven-route sample with ownership-registry-derived coverage.
- Exact production-like witness discovered and passed 52 committed-shadow routes; clean one-file head passed Metadata and Shared Files Guard.
- Canonical arithmetic moved from **185 closed / 173 open** to **186 closed / 172 open**; P3 moved from **48** to **47**. No production claim.

### 2026-08-02 — stale Home z-token closure @ `b251c4b9`
- Closed `AR-IDX-CSS-01` as stale after exact source reverify: the shared z-index tokens are defined in `css/site.css` and consumed by `css/home.css`.
- The NoteRegistry delta from `7e43efa1` to `b251c4b9` touched neither CSS owner.
- Canonical arithmetic moved from **184 closed / 174 open** to **185 closed / 173 open**; P1 moved from **85** to **84**. No production claim.

### 2026-08-02 — Vosk dead split closure @ `aed8ed22`
- Source PR #755 removed one dead function/export from `js/vosk-tts-core.js`; zero call sites remained.
- Seven exact-head workflows passed; source squash merge `aed8ed2244ad566b0458e490f629d394122dbf95`.
- Matrix moved to **184 closed / 174 open**; P3 moved **49 → 48**. No production claim.

### 2026-08-02 — fixed-source closure wave V1 @ `3aba5112`
- Reverified 15 source/data candidates against exact source anchor `3aba5112f0fc37712e027a1ad1d8379debe54377`.
- Closed 11 P1, 2 P2 and 2 P3 rows as `FIXED-CURRENT` or `STALE-ON-CURRENT-HEAD`; no browser-only row was promoted.
- Canonical arithmetic moved from **168 closed / 190 open** to **183 closed / 175 open** while retaining **358 total IDs**.
- `A11Y-P1-01` and `QUAL-P1-04` remain open pending exact-anchor browser evidence. No product or production mutation is claimed.

### 2026-08-02 — third independent AuditRepo gate pass @ `69d1e72a`
- Re-read `AuditRepo/main` and source `main`: AuditRepo remained exactly `69d1e72a8b59faafe1e68bd89704cf6fb8cda424`; source was observed at `6cfa7468e033ed44dac79b9752b127f406d33724` at gate start and `92bfa45a02e53d7b735af73025a79d99ffe75b67` before merge.
- Preserved matrix arithmetic: **358 canonical = 168 closed + 190 open**; no status was changed without new product evidence.
- Refreshed operational authority through final source observation `92bfa45a02e53d7b735af73025a79d99ffe75b67` and active NoteRegistry head `f95948ebd3f84791e150445ed505772965e180f7`; the intervening source delta is path-bounded and does not change matrix verdicts.
- Hardened coverage so a canonical section cannot omit its counter, statistics rows cannot be missing/duplicated/non-numeric or drift per category, archive-only open evidence is blocking, and duplicate JSON registry keys are rejected.
- Expanded closed-in-open detection beyond the exact emoji spelling and exposed closed-row totals in machine output.
- Exact evidence and boundary: `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md`.

### 2026-08-02 — verifier matrix reconciliation @ source `fc1085c8`
- Verification anchor advanced from stale `efaf2a51` to exact source snapshot `fc1085c805d72e6d43f58a6383c680d4e886183b` (**65 commits**, source-only; production remains `abf1edba190280e554dfda085bef9fb6594c896d`).
- Corrected canonical identity: combined noncanonical row `NEW-68/69` became two distinct closed IDs `NEW-68` and `NEW-69`; total canonical count therefore increases by **2**, not 1.
- Moved `AR-006` from the open AUDITREPO table to closed; open AUDITREPO 4→3, total open 191→190, closed 165→168, total canonical 356→358.
- Registered `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` as informational rights-policy evidence IDs.
- Hardened matrix coverage against noncanonical table IDs, explicit CLOSED rows inside open sections, section/stat counter drift, and fixed the `tee`/missing-`pipefail` false-green in CI.
- Exact rationale and source-delta boundary: `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_fc1085c8_matrix-reconciliation.md`.

- **2026-08-01 — source advanced to `efaf2a51`; production remains `abf1edba`.** PR #691 / `c5ae325e` established one canonical article-headline contract; exact head `6736bf98` passed 14/14 triggered workflows. PR #669 / `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` replaced the Karty literal audit count with one governed route inventory; exact head `94748bb7` passed 8/8 triggered workflows. Active source owner at capture: #680 NoteRegistry. AuditRepo PR #117 already closed `WORKFLOW-POLICY-SHADOW-ERA`; counters remain 165 closed / 191 open. No same-SHA production witness exists for current source. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_efaf2a51_source-vs-production.md`.

- **2026-08-01 — `WORKFLOW-POLICY-SHADOW-ERA` closed at source `0ff04232`.** Verifier matched the open claim to source PR #688: route coverage is registry-derived, ordinary validation is source-read-only, explicit autofix/transactional write capabilities are isolated, actionlint is blocking and SYSTEM failure lifecycle coverage is current. Exact head `fff6155b` passed runs `30681815950`, `30681815958`, `30681815957` and `30681815981`; review threads 0; issue #64 closed. One P1 row moved to fixed: closed 164 → 165, P1 97 → 96, total open 192 → 191. Production remains `abf1edba`; no production claim for `0ff04232`. Evidence: `reverify/WORKFLOW_POLICY_SHADOW_ERA_CLOSURE_2026-08-01_0ff04232.md`.

- **2026-08-01 — source advanced to `0ff04232`; production remains `abf1edba`.** Current source now includes homepage discovery PR #675 / `0131f8b9`, Editorial Metadata v3 PR #672 / `eb129d3e`, Nagornaya dark surfaces PR #678 / `af60f833`, glossary trust boundary PR #683 / `d9303986` and Workflow Policy v2 PR #688 / `0ff04232ee08a8f81711db640395901124aca787`. Exact #688 head `fff6155b` passed Metadata `30681815950`, Shared/Workflow Policy/actionlint `30681815958`, Node/read-only `30681815957` and TTS/Chromium `30681815981`; review threads 0. Active source owners at capture are #669/#680/#691. Last exact production remains deploy `30669840189` attempt `1` at `abf1edba190280e554dfda085bef9fb6594c896d`; no same-SHA production witness exists for current source. Authority-only synchronization changes no bug rows or counters: 164 closed / 192 open. `WORKFLOW-POLICY-SHADOW-ERA` disposition remains verifier-owned. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_0ff04232_source-vs-production.md`.

- **2026-08-01 — source advanced to `2f9ad5d8`; production remains `abf1edba`.** Current source includes bug-hunt repairs through `be970bfc`, Atlas geometry PR #659 / `65bf6c4a`, Avraam heading lifecycle PR #665 / `8a8ebf70`, Karty story-ID schema PR #666 / `424b09b2`, README Astro 7 truth PR #668 / `b4b02f72` and Pagefind contract PR #667 / `2f9ad5d8`. AuditRepo PR #112 / `2ef6cf66` records exact Karty evidence. Last exact production remains deploy `30669840189` attempt `1` at `abf1edba`; no same-SHA production witness exists for current source. At synchronization time there are no open source PRs. This authority-only synchronization changes no bug rows or counters: 164 closed / 192 open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_2f9ad5d8_source-vs-production.md`.

- **2026-08-01 — source/production convergence `abf1edba` and Windows Astro closure** — PR #643 merged the permanent launcher; exact head `12f6d54e` passed 8/8 workflows. Physical Windows comment `5148209495` records clean `abf1edba190280e554dfda085bef9fb6594c896d`, `npm ci`, 82 pages, 918 legacy files, zero drift and Baptist 16/16. Deploy `30669840189` attempt `1` promoted `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1` (`sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`); generic/TTS artifacts `8808666936` / `8808667707` passed. AuditRepo PR #110 changes authority/evidence only; counters stay 164 closed / 192 open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_abf1edba_exact-production-windows-astro-closure.md`.

- **2026-07-31 — source/production convergence `a7b2f2b5` and homepage closure reconciliation** — PR #551 migrated Pixelmatch to 7.2.0 through controlled ESM loading, preserved checkerboard:false semantics and every visual baseline, and did not change homepage components. Deploy run `30652948250` attempt `1` built candidate `a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1` (`sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f`), promoted the same bytes and produced generic/TTS live PASS; the public pointer and immutable manifest were independently read back. AuditRepo PR #108 synchronizes `NEXT_AGENT_PROMPT`, this masthead/session log and the paired reverify; counters remain 164 closed / 192 open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-31_a7b2f2b5_exact-production-home-closure.md`.

- **2026-07-26 — source/production convergence `cd4b7706`** — PR #405 closed `HOME-BROWSER-LIFECYCLE-RESIDUAL` with exact Chromium/WebKit capability evidence. PR #374 merged the effective-permission registry. PR #370 then closed `CI-BUILD-VALIDATION-DUPLICATION` and `DEPLOY-PROVENANCE-TTS-COUPLING`: exact run `30211404138` built one candidate, promoted the same bytes, passed generic/TTS live checks and wrote the downstream ledger. `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP` is closed because source and production now share the same exact SHA. Closed 160 → 164; P1 101 → 97; total open 196 → 192. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_cd4b7706_build-once-production.md`.

- **2026-07-26 — exact `b594ba82` production import + Runtime recovery** — Advanced only the production authority from `f5e29998` to live-proven `b594ba82`: readiness `30176319427`, deploy `30176621679`, Pages artifact `8624531252`, TTS artifact `8624532125`, live pointer and immutable run provenance. Source remains `9407cc92` and is not claimed deployed. Exact Runtime Interactive Audit run `30175901907` attempt 2 passed all four modes with unchanged assertions, uploaded artifact `8624672432` and automatically closed notifier #357; PR #365 (superseding closed staging #361) remains the distinct owner of reopened #299 lifecycle/shortcut residual. Added that residual as one P1 row and repaired stale summary counters; total open remains 196. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-26_9407cc92_genesis-b594-production.md`.

- **2026-07-25 deterministic font integrity (`f4c60ecb`)** — PR #309 closes source issue #302 without typography redesign: 28 tracked WOFF2 files and support assets are pinned, production verification is offline and fail-closed, the legacy downloader is disabled, exact-source refresh is transactional, every CSS declaration/alias is validated and three reviewed upstream drifts remain explicit. Exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928` before squash merge. Production authority remains `f5e29998`; no deployment of `f4c60ecb` is claimed. Active source owners are #336 and #338. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md`.

- **2026-07-25 notifier/series/production reconciliation (`be78785b`)** — merged #308/#314 establish the factual recovery-aware notifier and complete readiness→deploy→ledger subscription; live machine-marked alerts prove PR-separated exact-step evidence. Series issue #300 is closed by registry/interface commits plus merged #319 and exact Shared Files Guard `30170548516`. Audit artifact `8622690663` imports exact readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS artifact `8622642553`, successful Pages deployment and live run-addressed provenance for `f5e29998`. Ledger `30169981463` failed only posting to PR #286; #312 owns the permission fix. Current `be78785b` remains undeployed here.

- **2026-07-25 auditor R4 (`f5e29998`)** — merged #286 closes `PRINT-REVERSIBLE-BACK-3D-FLOW` at source+CI level after exact physical front/back, state-restoration, raster and Chromium/WebKit proof. No source PR remains open. Production authority stays fail-closed at `8a535267` pending exact readiness/Pages/provenance/live-artifact/downstream-ledger import for `f5e29998`.

- **2026-07-25 matrix diagnostics zeroed (`e8c41d54`)** — named the release-blocking P0/P1 section, registered editorial projection drift, attached explicit production-gap evidence, normalized immutable closed refs and aligned counters.

- **2026-07-25 auditor R2 correction (`e8c41d54`)** — merged #297 closes the source acceptance-ledger coupling while whole-artifact/build-once issues #292/#295 remain. PR #296 closed without merge; #286 is the only active source PR. Fixed malformed table separators and recalculated summary counters from canonical section counts. Production authority remains fail-closed.

- **2026-07-25 auditor R2 follow-up (`dab31616`)** — PR #293 merged the in-deploy TTS acceptance recorder; corrective #297 now owns downstream generic capability-witness repair. Temporary Genesis transport verifier #296 is active but is not a final activation owner. Production authority remains fail-closed.

- **2026-07-25 auditor R2 (`7fe46572`)** — corrected premature print-success claim; recorded real flipped-back 3D/PDF defect, merged AuditRepo report-validator fix `6cba8af0`, updated #290 provenance residual, #293 acceptance-ledger coupling, #294 notifier and #295 build-once architecture; production authority remains fail-closed.

> Сюда идут per-session заметки о HEAD-переходах и что влито — **чтобы мастхед оставался
> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.

- **2026-07-24 — Source `20ded750`: fail-closed asset revisions instead of a general writer.** PR #187 permanently mutation-tests read-only cache-bust coverage on every PR/main push, catch-all readiness before build, successful exact-SHA deploy linkage and explicit-only `--write`. The one pre-existing glossary autofix writer is constrained to an explicitly labeled same-repository PR, job-scoped write permission, tracked-file staging, post-write read-only validation and push-back only to the requesting head. Exact clean head `c8cd3a03` passed Shared Files Guard `30086484719`; policy run `30086392750` rejected 17 adversarial mutations and proved a stale `js/search.js` fails without rewriting. Production authority remains `8a535267` pending same-SHA deployment evidence. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.

- **2026-07-24 — Source `96b7a20f`: owner-approved cancellable enhanced-voice download.** PR #177 preserves immediate Web Speech, announces the real ~280 MB cache-miss transfer through one compact post-start card, aborts it with `AbortController` on `Не загружать`, persists refusal and keeps the ordinary voice available. Exact final head `1c38a8b6` passed TTS Download Consent `30083527472`, Shared Files Guard `30083527643`, Route Registry Validators `30083527432` and Visual Parity `30083527431`; all 75 public routes, route semantics and Nagornaya UI stayed green. Manual review fixed a silent pulse-keyframe disconnect and added a sixth adversarial mutation. `TTS-DL-NO-TABLOCK` and `TTS-DL-UNZIP-SYNC` remain open. Production authority remains `8a535267` pending same-SHA deploy evidence. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.

- **2026-07-24 — Source `bd537dc1`: input-safe, DOM-driven MapEngine keyboard contract.** PR #173 closed `MAP-P1-16` and `MAP-P1-17` without touching homepage, Gill, glossary or route HTML ownership. Editable/IME/modifier input is isolated; number keys follow visible DOM tabs and canonical click behavior; `ishod` is the shared MapEngine fixture while `avraam` remains explicit bespoke legacy. Exact final head `64e36c82` passed Map Keyboard `30049773607`, Shared Guard `30049773605`, Overlay Browser `30049773623` and Visual Parity `30049773601`; artifact `8580550637` records a clean live smoke. Production authority remains `8a535267` pending a same-SHA deploy witness. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md`.

- **2026-07-24 — Source `73c49e99`: registry-owned audit-pro source corpus.** PR #169 closed the final `AUDIT-PRO-ROOT-ONLY` inference tail while preserving the parallel homepage rebuild: 75 production routes are explicit as 52 committed shadows + 23 dist-only routes, stray root HTML is blocking, repeated HTML guards share one corpus, and quote-policy routing is live. Exact final head `7bda4b44` passed Shared Files Guard `30045742164` and Route Registry Validators `30045742230`; browser artifact `8579172903` records 75/75 routes and zero contract failures. Production authority remains `8a535267` pending a same-SHA deploy witness. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_73c49e99_audit-pro-source-corpus.md`.

- **2026-07-23 — Source `7187c32a`: Search, SEO and HTML breadth.** PR #165 moved production SEO to the effective registry and built `dist`; PR #167 added the 75-route static HTML/link/alt/JSON-LD/H1 contract and removed one public link to an unpublished Baptist research file; PR #166 added one explicit 75-route Search & Index policy for robots, Pagefind, search-manifest, sitemap and RSS and normalized 94 RSS metadata drifts. Exact source CI is green; production authority remains `8a535267` until a same-SHA readiness/Pages/live witness exists. Closed `SEO-AUDIT-ROOT-ONLY`, `VALIDATE-SCOPE-GAP` and `VALIDATE-JS-ARTICLES-ONLY`; broader `AUDIT-PRO-ROOT-ONLY` remains narrowly open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_7187c32a_search-seo-html-contracts.md`.

- **2026-07-23 — Production `83f04647`: #154/#157/#158 deployed and current truth reconciled.** Readiness `29966152952` and Pages `29966633078` succeeded on exact `83f04647c470a92c340d4d7990485c4e1376836b`; live observer `29967501124` / artifact `8548383473` verified epistemic markers and PremiumControls ARIA. AuditRepo cleanup archived superseded intake, normalized immutable closed refs, removed fixed rows from open sections and resolved duplicate IDs. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_83f04647_production.md`.

- **2026-07-22 — Source HEAD `2b67ee8f`: deploy-smoke repair + verified Nagornaya deep intake.** PR #111 restored readiness→Pages linkage; failed Pages run `29870616511` was isolated to one stale Gill smoke expectation and PR #115 passed the full production-like build/Gill smoke without production UI changes. New verified intake grouped the supplied C43–C94/D18 analysis into technical bar-asset P0, pastoral-safety P0, source-integrity P1, model/source-registry P1 and epistemic-UI P1 lanes. Matrix drift reopened highlight dedupe/ARIA until PR #113 lands. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2b67ee8f_nagornaya-deep-audit.md` and `incoming/gpt-5-6-nagornaya-deep-audit/2026-07-22/REPORT.md`.

- **2026-07-21 — Source HEAD `1a66bd8`: MAP-P0-04/05 landed.** PR #97 unified query/hash/saved/default initial state, removed competing camera/storage readers, added permanent pure guard and Chromium witnesses on `ishod`/`avraam`. Full publication/shared/production-like gates green; exact deployed SHA proof pending. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`.

- **2026-07-21 — Source HEAD `1f80f12`: release gates green; runtime P0 wave landed.** PR #94 снял исторический atlas-export PNG stop-point; PR #95 закрыл quote dedupe/ARIA/shared scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил permanent map regression guard и синхронизировал 38 stale `site-utils.js` asset revisions. Full `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract green. Exact post-merge deployed SHA proof pending; evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1f80f12.md`.

- **2026-07-20 — Branch reconciliation + current-head reverify (`32ae0d7d`).** `AuditRepo` main сверён с актуальным source-repo, неслитые ветки разобраны выборочно, а SSOT обновлён на живой current head. Verified-source + verified-build + verified-ci: `deploy.yml` latest run `29621961761` FAIL на шаге **Static publication gates**; локально `npm run validate:static-publication` воспроизводит current stop-point — `audit-pro.js` падает на oversized raw atlas-export PNG (`images/atlas-export/shvatim-hires.png`, `images/atlas-export/shvatim-preview.png`). Дополнительно зафиксировано: book-mode серии «Сердце» уже landed в source (`shape:'book'`, chapters + arabic articles), поэтому старые prototype-ветки AuditRepo теперь historical evidence; Hermeneutika intake остаётся materially current по ключевым source-симптомам. Новые preserved evidence packs: Hermeneutika 2026-07-09, arena-auditor 2026-07-16, genealogy progress 2026-07-17, book-engine research 2026-07-15, compact book prototype v7, Gill V10 raw intake. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-20_32ae0d7d.md`.

- **2026-07-19 — Персональная верификация карт (arena-auditor-karty-verification @ HEAD 32ae0d7d).** Строго верифицированы все 31 открытых находок на актуальном HEAD `main`. Найдено подтверждающее строчное свидетельство (`map-engine.js:919` `getState`, `map-engine.js:863` `inStory`, `map-engine.js:2621` forced `flyTo`, `map-engine.js:1037` scale bar math, `map-engine.js:1817` archaeology footer pollution, `avraam/index.html:1063` rotate overlay). Оформлены интейк `incoming/arena-auditor-karty-verification/2026-07-19/` и `reverify/CURRENT_HEAD_REVERIFY_2026-07-19_karty_deep_audit.md`.

- **2026-07-19 — Глубокий визуальный и функциональный аудит раздела карт (/karty/).** Verified intake from `incoming/karty-deep-audit-2026-07-19/2026-07-19/` on commit `c2c339708252`. Registered 31 open findings: 8 P0 blockers (`MAP-P0-01`..`MAP-P0-08`), 20 P1 findings (`MAP-P1-01`..`MAP-P1-14`, `AVRAAM-P1-01`..`AVRAAM-P1-05`, `KARTY-DATA-P1-01`), 3 P2 findings (`AVRAAM-P2-01`, `HUB-P2-01`, `GATE-P1-01`). MapEngine v0.53 and holding maps are confirmed non-production-ready until P0/P1 repair lanes land.

- **2026-07-14 (CSS/JS continued, pass 6) — arena-auditor-meta-governance @ `21624a3`.** Подстроился под
  актуальный main (сброс на `abb49d8`, source ушёл `2ca2af3b`→`21624a3`, +40 коммитов). **Реверифай
  моих CSS-находок:** `AUDIT-CSS-SITECSS-STRUCT-CORRUPTION` → **FIXED** (postcss/css-tree 0 ошибок, @912ffe3),
  `AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION` → **FIXED-CURRENT** (floating-cluster перезалит +406/−39, баннер-
  `/*` восстановлен, 0 битых селекторов), `AUDIT-CSS-NO-STRUCTURAL-PARSE` → **RESOLVED** (другой агент
  реализовал ровно рекомендацию — `check-engine-contracts.js` гоняет `css-tree.parse` по 6 CSS как live-гейт,
  зелёный). **Ещё открыто (заведено):** `AUDIT-CSS-GBFLOATER-DUP-MEDIA` (`.gb-floater` побайтно дублируется
  в 2 `@media(max-width:899px)`, стр.112≡665/128≡682) + `AUDIT-JS-ESCAPER-DUP-X5` (5 копий HTML-эскейпера,
  site-utils пуст). Net P3-open: +2 новых − 2 fixed = 0 (счётчики не двигаю). Source НЕ трогал. Evidence:
  `incoming/arena-auditor-meta-governance/2026-07-14/evidence/css-js-continued-pass6-2026-07-14.txt`.
- **2026-07-14 — HEAD reverify `b8459bdf` → `2ca2af3b` (+287 commits); deploy RED/STALE.**
  Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`, intake `incoming/arena-auditor-head-reverify/2026-07-14/`.
  **Prod:** last GREEN `007b67def5` (2026-07-11); HEAD deploy fail Static publication gates; IndexNow fail editorial registry.

- **2026-07-14 — Нагорная проповедь visual audit (arena-auditor).**
  Full visual audit of `/nagornaya/chast-1/` … `/chast-5/` — 12 bugs found.
  **P1 нагорная (консолидировано):** NG-DARK-01 (54 Tailwind-класса без dark-ремапа — корневая), NG-STRUCT-01 (сломанные заголовки + emoji + font-sans), NG-INLINE-01 («Из библиотеки» inline-стили).
  **+5 P2:** NG-VIS-04 (8 table-only sections), NG-VIS-05 (dead reveal class), NG-VIS-06 (font-sans ch.5 only), NG-VIS-07 (dark theme color flattening), NG-VIS-08 (contrast drift in ch.3 hero).
  **+4 P3:** NG-VIS-09–12 (inline styles, bibliography, hardcoded colors, stale version).
  Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md`.

- **2026-07-14 — INDEX page deep audit (arena-auditor-index).** Полный source-level аудит INDEX: `src/pages/index.astro`, 12 home-компонентов, legacy `index.html` baseline, CSS/JS. **17 findings:** P1 — AR-IDX-CSS-01 (18 `--z-*` CSS vars undefined — stacking INDEX сломан), AR-IDX-01/02 (hreflang + SearchAction SEO регрессии); P2 — AR-IDX-JS-02 (theme пишет в 3 localStorage ключа), AR-IDX-PERF-01 (LCP decoding=async + 5 CSS), AR-IDX-PERF-02 (30+ fonts), AR-IDX-JS-01 (pagehide на iOS), AR-IDX-03/09 (⌘K + altKey); P3 — 10 minors. D-4 исправлено. Evidence: `incoming/arena-auditor-index/2026-07-14/`.

- **2026-07-14 — Нагорная deep dark-theme audit cycle 2 (arena-auditor).**
  Углублённый анализ: найдена **корневая причина** — `mobile-hotfix.css` покрывает только -800/-900 уровни Tailwind, оставляя 54 класса без dark-ремапа (165× text-600, 75× text-700, 52× border-stone-100, 13× bg-rose-50).
  **Консолидация P1:** NG-DARK-01 (корневая), NG-STRUCT-01 (объединены: заголовки + emoji + font-sans), NG-INLINE-01 (Astro-компонент + CSS vars).
  **+2 P2:** NG-DARK-04 (bg-rose-50), NG-DARK-05 (bg-stone-100/200). NG-VIS-06/07/08 поглощены NG-DARK-01.
  **Professional solution:** `data-chapter="N"` + `--ng-accent`/`--ng-accent-soft` custom properties — без `!important`.
  Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md`.

- **2026-07-11 — Контентный аудит двух серий («Тайны сердца» + Джон Гилл) по внешней спецификации + восстановление красного деплоя.**
  Прогон по фактическим/богословским дефектам контента (класс, ранее в матрице отсутствовавший — были только UI/infra). Все правки во всех трёх слоях (Astro-пилот = прод + MDX-твин + legacy HTML), паритет сохранён; deploy-mirror gates зелёные локально.
  - **Серия Гилла:** P0-факты — Макритчи (перевёрнутый вывод диссертации исправлен), SBJT «современный консенсус» → «сборник конкурирующих интерпретаций», эпиграф «само по себе не гиперкальвинистское» → двусторонняя историография, Christmas Evans (MDX «Рождеством» → «Кристмасом»). Новые системные разделы в Части II «Учёный»: **пневматология** (Дух-Применитель — освящение/монергизм/свидетельство, BDD ch.14 «Of Sanctification» + Exposition Rom 8, Level A) и **христология** (две природы, communicatio idiomatum, отвержение буквального descensus ad inferos, BDD Book VI, Level A).
  - **Серия «Сердце»:** P0-точность флагмана (ʾānûš без «терминальной патологии»; убрана апелляция к семинарии как доказательству лексики; каламбур ʿāqōb/Иаков смягчён; бинарность ВЗ/НЗ снята) + пасторская объективность (совесть, «четыре голоса» → пересекающиеся паттерны, Мэнтон в контексте, «острая совесть» без перегиба) + **меланхолия/скрупулёзность** (Тимоти Роджерс 1691, verbatim Level A; достаточность Писания не отрицает медпомощь) + заветные корни нового сердца (Втор. 30:6; Иер. 24:7). Рим. 7: греческая лексика (σάρκινος/πεπραμένος/настоящее время/внутренний человек/7:25b) + ранний/поздний Августин.
  - **D-19 (частично закрыт):** rimlyanam-7 `<title>` приведён к каноническому (совпал с og:title/twitter/JSON-LD headline). Второй адрес (`20-antisovetov-pastoru`) — вне серий данного аудита, остаётся открытым (см. строку D-19).
  - **🔴 Восстановление деплоя (реальный баг, не мой):** prod-деплой main был КРАСНЫМ ~08:20–08:55 UTC (runs 4506c3d/399fad7/3daf2926 — failure). Concurrent-лейны (#81/#82 mobile reader, gill quiz CBM) изменили shared-ассеты (`site-utils.js`, `floating-cluster.css/.js`) без полного cache-bust; гейт «Static publication gates» (audit-pro) падал на рассинхроне `?v=hash` в `nagornaya/*`, `pastor-series/*` и др. **Системная находка (candidate P2/P3):** ни один workflow не делает `cache-bust --write`+commit — `indexnow.yml`/`editorial-metadata-v3.yml` только ПРОВЕРЯЮТ (без записи), `deploy.yml` шаг cache-bust помечен «skip if IndexNow already did it» → no-op; значит запись ревизий это ответственность пушащего, и concurrent-пуши без неё оставляют main красным для всех. Починено коммитом `9fce2bc` ([SYSTEM] cache-bust — регенерация asset-ревизий по всему сайту); деплой разблокирован. Follow-up (owner-decision, правка пайплайна): добавить `cache-bust --write` + auto-commit в metadata-workflow, чтобы concurrent asset-дрейф не блокировал деплой.

- **2026-07-10 — Контрольная перепроверка (control re-verification), source → `b8459bdf`, deploy GREEN `29065454930`.** Тотальный re-check всей сессии нашёл и починил РЕАЛЬНЫЕ дефекты (первый проход их пропустил): (1) **CI-INDEXNOW-CHECKER-STALE** — `check-workflows.js` требовал `contents: write` у read-only `indexnow.yml`; исправлен чекер (→`contents: read`) + восстановлен `baptisty-rossii/**` path (PR#70, `3a43cada`). (2) **2 user-visible Gill-дефекта** от непроброшенного Часть IV: sibling-страницы (I/II/Наследие) говорили «Трилогия/три текста» и рендерили 3 карточки без новой «Экзегет»; biografii-карточка nasledie тегнута «Часть III» (надо IV); home-кикер «Трилогия». Починено во всех 3 слоях (Astro+MDX+legacy HTML, паритет сохранён), PR#71 (`b8459bdf`). (3) **auditrepo SSOT-остатки**: README+NEXT_AGENT всё ещё дублировали устаревшие счётчики → ссылки на матрицу; closed-count 95→94 (унаследованный off-by-1). ⚠️ **Урок среды:** локальные checkout'ы обоих репо молча откатывались на container-reset — всегда `git fetch && reset --hard origin/main` перед доверием локальному состоянию.
- **2026-07-09 — Gill Часть IV «Экзегет» + rail + doc-governance (source → `7a410be9`, deploy GREEN `29058726462`).**
  Влито: PR#67 (`eca5dcc9`) Часть IV «Экзегет» + сворачиваемый rail + логический реордер
  III↔IV; PR#68 (`1491fbb2`) hotfix rail-CSS scope-leak (мердж PR#67 уронил деплой на
  `audit:premium-controls` 97/98); PR#69 (`7a410be9`) hotfix устаревшего deploy-only
  smoke-теста (`gill:mobile-play:smoke`: play-ember переехал в `.gbs-theme-corner`,
  серия-константы не знали про Часть IV — оба масковались более ранним падением).
  **Прод-деплой подтверждён зелёным** (run `29058726462`, все шаги success). Записано 4 закрытия
  (вкл. задним числом KARTY-Q-BUG-P0 — был фикс `f7e9696`, не было строки), VM-DEPRECATED
  ×2 → false-positive (живой Node-тест). Governance: добавлен `DOC_MAP.md` (Single-Writer-
  Per-Fact), мастхед матрицы переведён из changelog в статус-блок, `PROJECT_REGISTRY`/
  `README`/`START_HERE` перестали переписывать HEAD/счётчики. Закрывает дрейф-находку
  AR-014. Инвентаризация `incoming/`: ценные находки (Q-BUG, дефолтный TTS-голос) уже
  были починены, но не отмечены — теперь отмечены; остальное — karty-Atlas (долгострой)
  и owner-gated визуал.
- **2026-07-09 — Фаза 2, стек `native-source-contract-v1` (deploy green `fc4b6326`).**
  `route-migration-matrix.json` стал производным (page-ownership + route-profiles; режимы
  8→3), registry-driven чекеры заменили прямые (оригиналы → `scripts/legacy-audits/*`),
  editorial-freeze baseline `data/editorial-metadata.json`. Закрыто AUDIT-P2-MATRIX-DRIFT.
  При интеграции лейны уронили `/karty/*` (david/isus вместо 11) — поймано контрактом,
  регенерировано. AGENTS.md синхр. (r323). Ещё открыто: NF-SPEEDSLOT-4TH-COPY + хвост P3.
- **2026-07-09 — reverify (claude-auditor), source `75f807b` → `2313f36f`.** Delta:
  mobile-bar v4 + speed-slot dedup, Hermenevtika rail rework, Gill premium images, quotes
  FAB. Runtime SOLID (0 P0/P1 в дельте). +8 P3 (хвост). Evidence:
  `reverify/CURRENT_HEAD_REVERIFY_2026-07-09_head-2313f36f-149-commit-delta.md`.
- **2026-07-06 — fable-super-audit, source `75f807b` (deploy green `28829729903`).** D-23
  RESOLVED (`3280445`), продакшн больше не заперт на `14a49be8`. D-строки arena влиты в
  канонические таблицы, счётчики пересобраны, системный бэклог → SUPER_AUDIT (W1–W10).

---

## 🔴 AUDITOR / ARENA — 2026-07-06 (independent auditor, Node v22.12.0) — ИСТОРИЧЕСКИЙ ЛОГ

> ℹ️ **2026-07-06 fable-super-audit:** открытые D-строки из этой секции ВЛИТЫ в канонические таблицы P2/P3 выше и в счётчики. Секция сохранена как evidence-лог интейка. Позитивные заявления cycle2/3 («/izbrannoe/ чист», «TTS надёжен», «SW-дефект не подтверждён») **ОТОЗВАНЫ** — опровергнуты верификацией (см. `SUPER_AUDIT_2026-07-06_14a49be8.md` §1 и `incoming/fable-super-audit/2026-07-06/REPORT.md` §3).

**Объект:** `main` @ `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR #48). Полные отчёты: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_e044908e_2026-07-05.md` и `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06.md`.

**Метод:** локально Node 22 + `npm ci`, статические гейты (`audit-pro.js`, `css:layer:validate`, `data:consistency`, `gill:series:data:consistency:audit`, `native:runtime:audit:strict`, `migration:metadata:check:strict`, `validate:all`, visual-parity audits) — все PASSED. Браузерные гейты и Pages-публикация проверены через GitHub API (CI run-логи). Полный `strangler:build:production-like` локально OOM (exit 137, ~1 ГБ при нужных ~2 ГБ) — см. `docs/SANDBOX-ENV-2026-06-21.md`.

### Вердикт
- 🔴 **Продакшн STALE.** Последний успешный деплой — `e044908e` (2026-07-05T19:27Z). С тех пор **4 попытки подряд failed/cancelled**: PR #45 `55a7d437e`, PR #46 `2e760e746`, cache-bust `5704924ab`, HEAD `14a49be8` (`28758726417`). В окне последних 40 прогонов — 0 успешных деплоев. Фичи PR #45–#48 (3D-tilt `/izbrannoe/`, Писание в глоссарии, Bible-tooltip, TTS/kinetic numeral, SW baseline gb-v189) **НЕ на продакшне**.
- 🟠 HEAD `14a49be8` проходит **ВСЕ quality-гейты** (Static gates, Build, Pagefind, Gill submenu audit, Gill mobile layout, dist-smoke, content coverage 50/50, **SW readiness ✅ CACHE_VERSION=gb-v189 matches baseline**), но деплой падает на шаге **«Deploy to GitHub Pages»** (`error_count: 10`, `timeout: 600000` → «Deployment failed, try again later»). Баг НЕ в коде — нужен перезапуск деплоя.
- 🟢 Локальные гейты (Node 22) — все PASSED. **CSS-бюджет теперь в норме** (предупреждение исчезло vs `e044908e`); JS total 375041 > 365000 (превышен).

### Найденные проблемы (аудиторские D-*)

| ID | Sev | Описание | Статус | Evidence |
|---|---|---|---|---|
| D-17 | 🔴→✅ | Продакшн STALE (4 failed/cancelled деплоя подряд) — RESOLVED: HEAD `14a49be8` задеплоен run `28794737410` (workflow_dispatch, 2026-07-06T13:22Z, success) | RESOLVED (2026-07-06) | CI runs 28756822942 / 28757603646 / 28758340460 / 28758726417 → 28794737410 success |
| D-18 | 🟠→✅ | HEAD-деплой зелёный по гейтам, но падал на «Deploy to GitHub Pages» (infra/timeout, error_count 10) — RESOLVED: перезапуск (run `28794737410`) успешен | RESOLVED (2026-07-06) | run 28758726417 (`error_count: 10`, `timeout: 600000`) → 28794737410 success |
| D-1 | 🟠 Med | `concurrency: cancel-in-progress` губит push-деплои; публикация держится на цепочке `workflow_run` (IndexNow→deploy) | OPEN (carry-over) | `deploy.yml:50-52` |
| D-2 | 🟠 Med | css-layer-validator: (1) заголовок обещает «проверку порядка @layer», но код проверяет ТОЛЬКО необъявленные слои (порядок не энфорсится); (2) порог предупреждения `< 50%` противоречит заявленной цели `≥80%` (site.css = 21.9%); (3) валидирует только `css/site.css` (package.json:121), route-scoped CSS вне контроля; 200/202 `!important` | OPEN (carry-over) | `scripts/css-layer-validator.js`, `package.json:121` |
| D-3 | 🟡 Low | JS total 375041 > 365000 (CSS-бюджет теперь OK) | OPEN (carry-over) | `audit-pro.js` |
| D-4 | 🟡 Low | Magic z-index (АКТУАЛЬНЫЕ строки, исправлены 2026-07-06 cycle2): `floating-cluster.css:2372` `2102 !important`, `:2447` `9999 !important`, `:2504` `3000`, `:2697` `2147483000 !important`, `:2882` `2147483100 !important`; `mobile-hotfix.css:129` `2102 !important`. Первопричина: токены `--z-*` (вкл. `--z-max`, `--z-modal`, `--z-toast`) СУЩЕСТВУЮТ — фикс тривиален, но не сделан (нарушение AGENTS-r33) | OPEN (carry-over) | grep (этот цикл) |
| D-7 | 🟡 Low | Residual path-leak в комментарии `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` (`AuditRepo/projects/gb-is-my-strength/...`) — не ловится §14 `audit-pro.js` | OPEN (carry-over) | grep |
| D-8 | 🟡 Low | `deploy.yml` `paths:` не включает `*.md` (doc-only не триггерит push-деплой) | OPEN (carry-over) | `deploy.yml:9-33` |
| D-14 | 🔴→✅ | spravochnik H2-parity divergence («Справочник по Гиллу» vs legacy «Джон Гилл (1697–1771)») блокировал PR #45; к HEAD закрыто (гейты зелёные в 28758726417) | RESOLVED @HEAD | run 28756822942 → 28758726417 |
| D-15 | 🔴→✅ | Gill series-marks smoke expectation stale (ждал 5 меток вкл. текущую; rail по дизайну рендерит только sibling-метки) блокировал PR #46; к HEAD закрыто | RESOLVED @HEAD | `GillSeriesRail.astro:34-36,47-49,90-92`; run 28757603646 → 28758726417 |
| D-16 | 🔴→✅ | SW CACHE_VERSION gb-v189 ≠ baseline gb-v188 блокировал cache-bust; пофикшено `b712bb15` (baseline → gb-v189) | RESOLVED (`b712bb15`) | run 28758340460 → 28758726417 SW readiness ✅ |
| D-9 | 🟡→✅ | Висячие ветки слиты в main (PR #47 `website-text-image-audit-9ep5z9`, PR #48 `image-generation-query-3e8rd5`) → delete-safe; **НО с origin НЕ удалены** (см. D-20) | RESOLVED (housekeeping open → D-20) | `git merge-base --is-ancestor`, `git branch -r` |
| D-19 | 🟡 Low | `<title>` ≠ `og:title`/`twitter:title`/JSON-LD `headline` на 2 кастомных PageHead (`20-antisovetov-pastoru`, `rimlyanam-7`): 4 независимых строковых литерала без общего источника (обходят `Seo.astro`-конвейер мета). Repro: `npm run validate:all` | OPEN (new, 2026-07-06 cycle2) | `AntisovetovPageHead.astro`, `Rimlyanam7PageHead.astro`; `validate:all` |
| D-20 | 🟡 Info | Слитые feature-ветки `image-generation-query-3e8rd5` и `website-text-image-audit-9ep5z9` НЕ удалены с origin (висят) — уточнение к D-9 | OPEN (new, 2026-07-06 cycle2) | `git branch -r` |
| D-21 | 🟡→✅ | Глоссарий: несогласованное экранирование `detail` — `o()` рендерит через `innerHTML` (курсив `<em>`), апгрейд-путь `l()` был через `textContent` (букв. `<em>`). Пофикшено: `l()` теперь тоже `innerHTML` (источник доверенный — курируемый `data/glossary.json`) | RESOLVED (`365de50`) | `js/glossary.js` |
| D-22 | 🟡→✅ | `Favorites.astro` не валидировал `f.path` на `javascript:`-схему перед `card.href` (само-XSS); `izbrannoe` не проверял ни `path`, ни `image` регэкспом — расхождение. Пофикшено: оба рендерера теперь требуют same-origin абсолютный путь (`/^\/(?!\/)/`, отклоняет `javascript:`/`data:`/`http(s):`/protocol-relative `//host`) и один и тот же протокол-allowlist для `image` | RESOLVED (`365de50`) | `src/components/home/HomeSections/Favorites.astro`, `src/pages/izbrannoe/index.astro` |

### Позитив (новый код)
- 3D-tilt `/izbrannoe/` a11y-корректен: только `(hover:hover) and (pointer:fine)` (`js/site.js:577`) + `@media (prefers-reduced-motion:reduce){transform:none}` (`izbrannoe/index.astro:186`).
- TTS (`js/site.js:98-197`) надёжен: feature-detect, `cancel()` на stop/`beforeunload`, pause/resume на `visibilitychange`, poll `voiceschanged`, guard устаревших utterance (`_uttGen`).
- Локальные стат-гейты зелёные; `native:runtime` — `/izbrannoe/` теперь `native-with-legacy-head` (1.9%, ок).

### Рекомендации
1. ~~(High) D-17/D-18: немедленно перезапустить деплой HEAD `14a49be8`~~ — **ВЫПОЛНЕНО** (run `28794737410` success, 2026-07-06T13:22Z). Артефакт ~32.3MB при лимите 1GB — гипотеза размера отклонена; RCA сбоя 28758726417 = transient/unknown.
2. **(Med) D-1:** убрать `cancel-in-progress` (или сделать деплой чисто push-триггером); задокументировать «продакшн = последний успешный `workflow_run`».
3. **(Med) D-2:** усилить CSS-валидатор (postcss-парсинг) + поднять @layer-адопцию.
4. **(Low) D-3/D-4/D-7/D-8:** бюджет JS; z-index-токены (`--z-*`); убрать внутренний путь из комментария `PremiumControlAnchor.astro:3`; добавить `*.md` в `deploy.yml paths:`.
5. **(Low) D-9:** удалить слитые ветки (`image-generation-query-3e8rd5`, `website-text-image-audit-9ep5z9`) из origin.
6. **(Process) D-16:** CACHE_VERSION-bump и обновление `sw-cache-version-baseline.json` делать ОДНИМ коммитом (аудит это уже требует, но разрыв вызвал транзиентный фейл деплоя).

### Ограничения
- Полный build OOM локально; браузерные гейты/публикация — через CI (авторитетно).
- GitHub fine-grained PAT **нельзя отозвать через API** (GET/DELETE `/user/fine_grained_personal_access_tokens` → 404; GET `/authorizations` → 404) — отзыв вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.

---

### 🔁 Re-audit cycle 2 — 2026-07-06 (вечер, arena-auditor, Node v22.12.0)

**Контекст:** `main` не сдвинулся (`origin/main == HEAD == 14a49be8`, 0 новых коммитов). Продакшн стабильно 🟢 GREEN (run `28794737410`, 13:22Z). Цикл — углублённая перепроверка уже задеплоенного кода + поиск новых дефектов. Полный отчёт: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06_cycle2.md`.

**Регресс-контроль:** `audit-pro.js` ✅ PASSED; `validate:all` ✅ PASSED (0 errors, 2 неблок. `title≠og:title`); CI: 1 success / 0 failure с пред. цикла.

**Обновления в матрице (этот цикл):**
- **D-2** усилен: заголовок `css-layer-validator.js` лжёт про «проверку порядка @layer» (код проверяет только необъявленные слои); порог `<50%` противоречит цели `≥80%`; валидирует только `css/site.css`.
- **D-4** исправлены УСТАРЕВШИЕ строки (были 2649/2834/2324/2399/2456 → стали 2372/2447/2504/2697/2882); добавлена первопричина — токены `--z-*` уже существуют (фикс тривиален).
- **D-9** уточнён: ветки delete-safe, но с origin **не удалены**.
- **D-19 (NEW):** `<title>` ≠ `og:title`/`twitter:title`/JSON-LD `headline` на 2 кастомных PageHead (`20-antisovetov-pastoru`, `rimlyanam-7`) — 4 независимых литерала, обходят `Seo.astro`. Repro через `validate:all`.
- **D-20 (NEW):** слитые feature-ветки `image-generation-query-3e8rd5`, `website-text-image-audit-9ep5z9` висят на origin (housekeeping).

**Проверено и чисто:** 3D-tilt `/izbrannoe/` (a11y), TTS (`_uttGen` guard), SW (`staleWhileRevalidate` — функц. дефект не подтверждён, код minified/плохо читаем — observability-замечание).

---

### 🔁 Re-audit cycle 3 — 2026-07-06 (поздно, arena-auditor, Node v22.12.0)

**Контекст:** `main` не сдвинулся (`origin/main == HEAD == 14a49be8`). Продакшн стабильно 🟢 GREEN (`28794737410`). Цикл — углублённое чтение клиентского JS новых/менявшихся фич. Полный отчёт: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06_cycle3.md`.

**Регресс-контроль:** `audit-pro.js` ✅; `validate:all` ✅ (2 warning D-19); `data:consistency` ✅; CI без изменений.

**Области:** `js/glossary.js`, `js/bookmark-engine.js`, `src/pages/izbrannoe/index.astro`, `src/components/home/HomeSections/Favorites.astro`, `js/enhancements.js`, `data/glossary.json`.

**Новые находки (этот цикл):**
- **D-21 (Low):** глоссарий — несогласованное экранирование `detail`: `o()` → `innerHTML` (курсив `<em>`), `l()` (апгрейд серверных `.gterm`) → `textContent` (буквальный `<em>`). `data/glossary.json` содержит `<em>` во многих `detail` → серверные тултипы показывают литерал `<em>`. Не XSS (источник доверенный), но баг консистентности рендеринга; единственное место без точки сана/экранирования (контраст с `enhancements.js`, который санизирует FAQ).
- **D-22 (Low/Info):** `Favorites.astro` не валидирует `f.path` на `javascript:`-схему перед `card.href` (само-XSS); `izbrannoe` экранирует `path`, `Favorites` сам проверяет `f.image` регэкспом — расхождение.

**Проверено и чисто:** `/izbrannoe/` (esc на всех полях, remove/clear корректны, storage-синк); `bookmark-engine.js` (очистка localStorage корректна по приоритету операторов, нет утечек слушателей, ключи не конфликтуют); `enhancements.js` FAQ (санизирует HTML перед JSON-LD — позитив).

---

### 📚 Gill research dossier — 2026-07-06 (arena-auditor)

**Контентное исследование серии «Джон Гилл»** (не баг, а лакуны контента + первоисточники). Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`.

**Кратко:**
- Серия = 5 частей (`data/series.json` → `dzhon-gill`): Контекст (~3834 сл) · I Человек (7759) · II Учёный (8745) · III Наследие (11834) · **Справочник (2705 сл, rt 8) — самая маленькая**.
- **Главная лакуна:** богословие Гилла не выделено в статью. Предлагаемые: «Богословие Гилла» (из *Body of Doctrinal Divinity*), «The Cause of God and Truth» (vs Уитбя), «Exposition» (комментарий), крещение/экклесиология, иврит/Троица.
- **Первоисточники на сайте** (из gill-* компонентов): *Cause of God and Truth* (archive.org, 1838, public domain) · *Body of Doctrinal Divinity* т.1/т.3 · *Exposition* (johngill.thekingsbible.com) · Rippon *Memoir* · *Doctrine of Trinity* (1731) · *Dissertation on Hebrew* (1767) · PRDL · CCEL.
- **Научный нюанс:** спор о «гипер-кальвинизме» Гилла (Rathel 2017 — «был»; Toon — «был»; Nettles/George — «нет»; Ella — защита). Любая статья о богословии должна его адресовать.
- **Биография сверена** (Theopedia/Wikipedia/CCEL/Britannica): 1697 Kettering → 1716 крещение → **1719 Goat Yard** (51 год) → 1729–56 лектор Great Eastcheap → 1748 D.D. Абердин → 1757 Carter Lane (→ Метрополитен-тэбернакл) → умер 14.10.1771. «Декларация 1729» на сайте = подтверждение 1689 Исповедания (верно).

---

### 📚 Gill theology deep-dive — 2026-07-06 (arena-auditor)

**Продолжение досье** (ч.2, углублённая): конкретные позиции Гилла с прямыми цитатами из первоисточников — готовый материал для статьи «Богословие Джона Гилла». Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-theology-deep-dive_2026-07-06.md`. Связано с ч.1: `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`.

**Кратко:** пять пунктов кальвинизма (избрание/отвержение, particular redemption, действенная благодать, претерпение, развращение); завет благодати как вечный завет Троицы (две администрации, Агарь/Сарра); прямые цитаты экзегезы 1 Тим 2:4 и Ин 3:16 («все»/«мир» = народы/избранные, не каждый индивид); вечное оправдание; кредобаптизм; сбалансированный разбор спора о «гипер-кальвинизме» (Edinburgh thesis — критика; Ella/Nettles/George — защита; нюанс: free offer без duty-faith).

---

### 🔁 Re-audit cycle 4 — 2026-07-06 (arena-auditor, Node v22.12.0)

**Контекст:** HEAD **сдвинулся** `14a49be8` → `36b815c2` (8 новых коммитов, вкл. Vosk TTS-движок `f7df07bd`/`92f27598`, merge `86bec6ea`). **Деплой НЕ green:** run `28827343079` (workflow_run, `36b815c2`, 2026-07-06T22:23Z) → FAILURE на шаге `Gill mobile TOC and PlayEmber smoke` (`deploy.yml:158-159`). Последний GREEN-деплой = `28794737410` @ `14a49be8` (2026-07-06T13:22Z) — **продакшн заперт на старом HEAD** (регрессия, не инфра-таймаут как D-17/D-18).

**Регресс-контроль (локально, все зелёные):** `audit-pro.js` ✅ (warning: JS 410104 > 365000 — **D-3 ухудшен** на ~35 КБ из-за TTS); `validate:all` ✅ (2 warning D-19); `data:consistency` ✅; `gill:series:data:consistency:audit` ✅; `native:runtime:audit:strict` ✅ (51/53).

D-23 (P1, deploy-блокирующая регрессия) — 🟠→✅ **RESOLVED, подтверждено зелёным продакшн-деплоем.** `gill:mobile-play:smoke` падал 8 assertion'ов на state-машине PlayEmber-плеера: `data-state` висел `["idle","idle"]` после тапов Play; `speed select from idle` → `{"calls":2,"rates":[1,1.75]}` (двойной speak); `long press stop` → `{"cancels":7,"calls":2}`. **Подтверждённая причина:** `resolveTtsEngine()` в `js/floating-cluster-controller.js` гейтил КАЖДЫЙ клик Play асинхронным разрешением движка — в частом случае (Vosk `isSupported()` true, но не `isReady()`) это реально ждало сеть (`ensureLoaded()` тянет ONNX-модель с CDN) прежде чем выставить `data-state=playing` и вызвать `speak()`, хотя код сам же документировал намерение «пока модель не готова — Web Speech без задержки». Из-за этого `data-state` не успевал смениться в окне ожидания смоук-теста → повторные тапы читались как «старт с нуля», а не play/pause/resume → двойной `speak()` и рассинхрон `cancels/calls`. **Фикс:** Web Speech стартует сразу и синхронно всегда, когда доступен; Vosk используется мгновенно только если уже `isReady()` (прогрет), иначе греется в фоне через `warmVoskInBackground()` — никогда не блокирует и не гонится с активным play/pause/stop. Медленный path с тостом и ожиданием сети оставлен только для браузеров без Web Speech вообще. **Двойное подтверждение:** (1) локально — пересобран `dist/` (`strangler:build:production-like`) + запущен реальный `scripts/gill-v16-mobile-play-smoke.js`, все 8 ранее падавших assertion'ов + весь остальной набор (series model, mobile overlays, TOC) прошли ✅; (2) на реальном CI — деплой `run 28829729903` (head `75f807b`, включает фикс `3280445`) прошёл ВСЕ 30+ шагов зелёным, включая сам `Gill mobile TOC and PlayEmber smoke` (step 22, success) и финальный `Deploy to GitHub Pages` (step 28, success) — продакшн обновлён, больше не заперт на `14a49be8`. (Промежуточный push `3280445` попал под `concurrency: cancel-in-progress`, D-1, и был отменён последующим `workflow_run` от авто-коммита `75f807b` — это ожидаемое поведение, не сбой; именно run `28829729903` — финальный правдивый результат.) Тест: `scripts/gill-v16-mobile-play-smoke.js`. Полный отчёт до фикса: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`. (Отношение к D-15: D-15 = series-marks smoke, уже RESOLVED; D-23 = плеер play/speed/stop — genuinely new.)

**Подтверждено RESOLVED (проверено по исходникам `gb` @ `365de509`):** D-21 (`js/glossary.js` апгрейд-путь `l()` теперь `innerHTML=detail`), D-22 (`Favorites.astro` `safePath = /^\/(?!\/)/` отсекает `javascript:`/`//host`).

**Всё ещё OPEN (re-verified в cycle 4):**
- **D-4** (Low): 6 magic z-index, те же строки — `floating-cluster.css:2372/2447/2504/2697/2882`, `mobile-hotfix.css:129`; токены `--z-*` (24) есть → фикс тривиален, не сделан.
- **D-7** (Low): `PremiumControlAnchor.astro:3` → `// See: AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md §1`. ⚠️ Коммит `437c6a33` пофиксил **другой** path-leak (в AGENTS.md), этот НЕ тронут.
- **D-19** (Low): `validate:all` 2 warning — `20-antisovetov-pastoru`, `rimlyanam-7` (`<title>`≠`og:title`).
- **D-2** (Med): `css:layer:validate` → **21.9%** layered (62404/222363), цель ≥80%.
- **D-3** (Low): JS 410104 > 365000 (ухудшено vs 375041).
- **D-1 / D-8 / D-9 / D-20:** без изменений к `36b815c2`.

**Gill research (контент, НЕ баг):** ч.3 — `RESEARCH_gill-series-structure-proposal_2026-07-06.md`. Ответ на вопрос владельца: серия УЖЕ = «Введение + I + II + III + Справочник»; рекомендация — добавить **Часть IV. Богословие** (доктринальный климакс, «недостающее золото») → итог 6 документов. Связано: ч.1 `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`, ч.2 `RESEARCH_gill-theology-deep-dive_2026-07-06.md`.

---

### 📚 Gill content deepening (ч.4) — 2026-07-06 (arena-auditor)

**Контент-аудит серии «Джон Гилл» + «золото» (ч.4 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening_2026-07-06.md`.

**Главный вывод (меняет рекомендацию ч.3):** богословие Гилла **уже вшито в Часть II. Учёный** (`chast-2-uchenyi.mdx`, 7966 сл: завет благодати, крещение/Вечеря, эсхатология, «оправдание до веры», «Дух в вечном совете», «Cause of God and Truth vs Уитби»). Поэтому отдельный 6-й документ «Богословие» пересекался бы с Частью II — уточнённая рекомендация: сфокусированная статья **«Богословие Гилла: 7 спорных текстов»** (экзегетический климакс + баланс гипер-кальвинизма) с перекрёстными ссылками на Часть II.

**Готовый материал (выкопан):** 7-текстовый экзегетический сет с ПРЯМЫМИ цитатами Гилла (1 Тим 2:4, Ин 3:16, 2 Петр 3:9, 1 Ин 2:2, Ин 1:29, Рим 8:29, Рим 9) — все public domain (johngill.thekingsbible.com). **«The Cause of God and Truth» 4-частная структура подтверждена из ПЕРВИЧНОГО предисловия** (archive.org, Tegg 1838, PD) — Part I отвечает на «универсальные» тексты (= мои 7), II — за особую благодать, III — доводы разума, IV — божественное просвещение. Тонкие места серии: `istoricheskiy-kontekst` (3652 сл) и `spravochnik` (2152 сл) легче `chast-3-nasledie` (10858).

Связано: ч.1 `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`, ч.2 `RESEARCH_gill-theology-deep-dive_2026-07-06.md`, ч.3 `RESEARCH_gill-series-structure-proposal_2026-07-06.md`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`.

---

### 📚 Gill content deepening (ч.5) — 2026-07-06 (arena-auditor)

**Систематика + каркас статьи (ч.5 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening2_2026-07-06.md`.

**Добыто:** (1) карта сайта — доктрины Гилла освещены только в серии (+ `krajne-li-isporcheno-serdce` = total depravity), статья «Богословие Гилла» дополняющая, не дублирующая; (2) экзегетический сет расширен до **9 текстов** (добавлены Рим 8:30 — golden chain/effectual calling, Ин 3:3 — regeneration) с прямыми цитатами Гилла; (3) **полное оглавление *A Body of Doctrinal Divinity* (7 книг, CCEL)** — систематический хребет; Book VI ch.3 «Objects of Redemption» + ch.4 «Texts seeming to Favour Universal Redemption» = точная параллель 7-текстовому сету. Итог: конкретный каркас статьи «Богословие Гилла», повторяющий порядок самого Гилла (Book II→VI) + сбалансированный гипер-кальвинизм + перекрёстные ссылки на Часть II и `krajne-li-isporcheno-serdce`.

Связано: ч.1–ч.4 `RESEARCH_gill-*`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`; матрица cycle-4 блок.

---

### 📚 Gill content deepening (ч.6) — 2026-07-06 (arena-auditor)

**Полный индекс сайта + закон/антиномизм + избрание/вера (ч.6 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening3_2026-07-06.md`.

**Добыто:** (1) полный инвентарь сайта — 20 статей; **расширенная карта ссылок**: две прямые доктринальные ссылки, которых не было в ч.5 — `rimlyanam-7-veruyushchiy-ili-neveruyushchiy` (Римлянам 7 → закон/антиномизм) и `krajne-li-isporcheno-serdce` (total depravity); плюс `hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` (герменевтика), `kod-da-vinchi` (канон), серия `russian-baptism` (баптистская идентичность); (2) две новые цитаты — Рим 3:31 (закон «establish», отменён лишь as covenant of works) и Деян 13:48 (вера = «fruit and effect of the decree»; избрание sovereign/irrespective/unconditional/particular); (3) Cause of God and Truth Part III «arguments from reason» (якорь = первичное предисловие) + таксономия рациональных возражений (свобода воли, справедливость отвержения, искренность Евангелия, антиномизм, условность декретов) + нюанс duty-faith. Итог: каркас статьи расширен до **8 разделов** с полной картой ссылок.

Связано: ч.1–ч.5 `RESEARCH_gill-*`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`.

---

### 📚 Gill research → перенесено в Research repo (2026-07-06)

**Консолидация:** все 6 исследовательских досье Гилла перенесены в канонический отдел **«Джон Гилл»** репозитория `FedorMilovanov/Research` (по указанию владельца — «чтобы не путаться потом»). Индекс отдела: `Джон Гилл/00_README_AND_NAVIGATION.md`. Файлы-заглушки в `incoming/arena-auditor/2026-07-06/RESEARCH_gill-*` теперь перенаправляют туда.

Канонические тома (Research → `Джон Гилл/`): `01_SERIES_GAPS_AND_PRIMARY_SOURCES` · `02_THEOLOGY_DEEP_DIVE` · `03_STRUCTURE_PROPOSAL` · `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET` · `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON` · `06_SITE_INDEX_LAW_ANTINOMIANISM_ELECTION`.

Аудит-отчёты (D-23 deploy-регрессия и пр.) остаются в AuditRepo — они НЕ «исследование», поэтому не переносились.

---

### 🔧 D-23 RESOLVED — 2026-07-06 (поздно, arena-auditor + другой агент)

**D-23 (Gill v16 mobile/play smoke, 8 провалов) ЗАКРЫТА.** Подтверждено green-деплоем: run `28829729903` (conclusion=success, HEAD `75f807b73`, workflow_run, 2026-07-06T23:14Z) — продакшн снова GREEN. Фикс регрессии (play/speed/stop state-машина PlayEmber-плеера / интеграция Vosk TTS) выполнен другим агентом поверх `36b815c2`.

Статус: матричный заголовок обновлён на «D-23 RESOLVED / продакшн GREEN @ 75f807b73». Запись cycle-4 («HEAD 36b815c2 НЕ deploy-green») — историческая: на момент cycle-4 деплой действительно падал, позже пофикшено.

Связь: cycle-4 отчёт `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md` (исходная находка D-23); Gill-исследования перенесены в `FedorMilovanov/Research` (отдел «Джон Гилл»).

---

### 🔍 arena-auditor governance reverify — 2026-07-14

**Source HEAD:** `2ca2af3` (confirmed against cloned source repo; +287 commits since `b8459bdf`).

**Verified-source evidence for open bugs:**
- D-1: partial fix confirmed — indexnow now `cancel-in-progress: true`; P2→P3
- D-4: 20 z-index in floating-cluster.css, 5 magic values (2102, 9999, 3000, 2147483000, 2147483100) — still open
- D-7: repo-relative link still at `PremiumControlAnchor.astro:3` — still open
- D-8: deploy.yml paths still missing `*.md` — still open
- D-21: glossary.js `innerHTML=detail` still present — still open
- GATE-MARKER-DATA-DRIFT / NF-GATE-IZ5-STALE: 6 hardcoded `«Часть 1 из 5»` in scripts/ — still open
- NF-DEAD-ENHANCE-SHIM: `enhanceGillMobileBarMarkup` dead at controller:1084 — still open
- NEW-VOSK-DEAD-SPLITSENTENCES: `splitSentences` dead export at vosk-tts-core.js:413 — still open
- TTS-DL-UNZIP-SYNC: `fflate.unzipSync` at vosk-tts-engine.js:110 — still open
- NEW-HARDTEXTS-CSP-MISSING-HFCDN: `huggingface.co` without `*.aws.cdn.hf.co` at hard-texts:122 — still open
- R-001: site.js 169.5 KB, 80 addEventListener / 10 removeEventListener — still open
- R-002: enhancements.js 46.1 KB — still open

**New findings added to matrix:**
- NEW-VOSK-FETCH-NO-ABORT (P3): model fetch without AbortController at vosk-tts-engine.js:166
- AR-AUDIT-17 (P3): validate:all 2 errors in genealogy build templates

**Merge proposal:** NEW-VOSK-UNZIP-SYNC-JANK = alias of TTS-DL-UNZIP-SYNC (same line, same root cause)

**Source gate results on `2ca2af3`:**
- data:consistency ✅ · gill:series:data:consistency:audit ✅ · guard:shared-files ✅
- native:runtime:audit:strict ✅ (55/56 strict-native)
- css:layer:validate ❌ (21.2% layered vs ≥80% target — D-2)
- validate:all ❌ (2 genealogy HTML errors — AR-AUDIT-17)

**Intake:** `incoming/arena-auditor/2026-07-14/`

### 2026-07-14 (вечер) · dns-configuration-setup: разблокировка деплоя + движки
- Влиты и верифицированы ветки: un2iya (CSS-!important синтез), arena dd/df/e0
  (RCA, deep CSS/JS, governance/нагорная), gpt-5-5 image intake, gill-content-research.
- Source-репо (ветка dns-configuration-setup, слита с main 2ca2af3b): ВСЕ гейты
  Static publication chain зелёные локально. Ключевое: site.css 210→183 !important
  архитектурно; 5 CSS-синтакс дефектов восстановлены; floating-cluster comment-corruption
  (глотался .mobile-bottom-bar) починен + AST-гейт; editorial 25/25; nagornaya JS +
  series-samizdat.css зарегистрированы (ALLOWED/cache-bust/SW precache v190);
  36 сирот-изображений удалены; maps/avraam валидаторы научены контрактам Атласа
  (sheet-format, ctx/region); шаблоны генеалогии выведены из страничных чекеров.
- Новое в движках: PLAY follow-скролл, Media Session + фоновый якорь + SVG-обложка,
  page-движок на 6 каталогах, engine:guard (17 контрактов + канон v2.9 + 87 функциональных).
- Деплой станет GREEN после мержа ветки в main.

### 2026-07-14 (ночь) · Марафон 2.0 по аудит-репо
- S-DATA-01 закрыт: series.json «Сердце» 2→6, чекер серий видит Astro/MDX (S-T-01 частично).
- AR-006 закрыт: root allow-list в validate_audit_repo.py; корневой passes/ выселен в проект.
- Оба собственных валидатора аудит-репо PASS. check_matrix_coverage: 132 гигиен-замечания
  (ORPHAN-CLAIM у старых открытых строк + BAD-COMMIT-REF 'PR#N' у исторических закрытий) —
  advisory, кандидат AR-001-hardening.

### 2026-07-19 · Глубокий визуальный и функциональный аудит карт (/karty/)
- Проведён полный аудит разделов карт на коммите `32ae0d7d62bee81737a9aae1f136946d047fe4fb`.
- Зарегистрировано 84 дефекта (20 P0, 74 P1, 33 P2, 45 P3, 7 Refactoring/AuditRepo).
- Созданы досье верификации в `incoming/karty-deep-audit-2026-07-19/` и `incoming/arena-auditor-karty-verification/2026-07-19/`.

### 2026-07-20 · Аудит качества прорисовки и подложек векторных карт
- Проведён детальный аудит качества отрисовки векторной географии, базовых слоёв, трассировки маршрутов, плашек подписей и иконок.
- Зарегистрированы критические качества дефекты: `BASE-P1-01` (пустой `<defs>` в `base-geo.svg`), `BASE-P1-02` (принудительное `opacity="0.5"` в `map-engine.js`), `BASE-P1-03` (угольно-чёрная суша и звёздное небо в `avraam/base.svg`), `TEXT-P1-01` (моноширинная обрезка текста в плашках подписей).
- Добавлена доказательная база в `incoming/arena-auditor-karty-verification/2026-07-20/`.


### 2026-07-21 — Reader R1 and map layer/theme reconciliation (`ffdba149`)

- Source `main` advanced to `ffdba1496b66a18b16feaa231af5922d118dc3f8`.
- PR #98 closed MAP-P0-06/07 and their duplicate P1 rows.
- PR #101 landed canonical reader preferences, site-wide Sepia and first-paint convergence.
- Adversarial engine witness exposed/fixed scroll-lock MutationObserver feedback loop.
- Final evidence: Shared Files Guard, Native Source Contract, cross-engine matrix and engine:sweep 98/98.
- Exact deployed SHA remains pending; next isolated lane is R3 `SeriesReaderChrome` façade.

### 2026-07-21 — Reader R5 unified overlay runtime (`43d8672f`)

- Source `main` advanced to `43d8672f59128de816cfd47c638c132a73d71599` via PR #104.
- One protected OverlayRuntime now owns reader overlay stack, named scroll tokens, focus, inert/aria and lifecycle recovery.
- The competing private `site.js` lock implementation was replaced by canonical delegates.
- ReaderSettings, Hermenevtika mobile TOC and shared Gill/series sheets were migrated without visual redesign.
- Permanent evidence: Shared Files Guard, Route Registry, Native Source, production-like build, clean-tree and Chromium/Firefox/WebKit matrix.
- Exact deployed SHA remains pending; issue #58 remains open only for special map/3D adapters.

### 2026-07-21 — Special overlays and deploy revision hardening (`1bbebc2d`)

- PR #106 (`39f6c3ac`) completed canonical special-surface overlay ownership with zero forbidden direct writers and Chromium/Firefox/WebKit evidence.
- PR #108 (`869558cd`) reconciled 62 generated source files / 113 stale revision mismatches without changing runtime blobs.
- PR #109 (`1bbebc2d`) added read-only revision + workflow-policy checks to every PR and made direct deploy strict.
- Source/release gates are green. Exact Pages deployment SHA remains unverified; `PROD-STALE-DEPLOY-RED` and issue #58 remain open only for that witness.

### 2026-07-22 — exact production witness and cleanup

- Source release sequence: PR #119 `41f78f43` → PR #123 `a6a78304` → PR #125 `e4cf04ab` → PR #128 `a0c9c025` → PR #131 `942a79eb`.
- PR #125 made readiness the only automatic owner for every `main` push and deploy checkout exact `workflow_run.head_sha`.
- Pages run `29910271842` succeeded for exact readiness-verified `a0c9c025`; all publication, Astro, Pagefind, schema, Gill, runtime, content, SW, upload, Pages and IndexNow steps passed.
- Observer recorded PASS for five critical source/live SHA-256 comparisons; issue #58 closed completed.
- PR #131 removed the temporary observer and trigger. Next isolated lanes: PR #126, PR #120, clean pastoral-safety PR, then source-integrity/Reader R6.

### 2026-07-22 — Nagornaya bar asset P0 landed

- PR #126 squash-merged as `9c3dec16717563885c36a497f3b47ff793a6bf4f` after Shared Files, Route Registry, Native Source, Editorial Metadata and Chromium/Firefox/WebKit passed.
- `NG-RUNTIME-BAR-ASSET-01` moved from open P0 to closed; count 118 → 119.
- Next isolated source lane is highlights PR #120, followed by pastoral safety and source integrity; Reader R6 remains separate.

### 2026-07-22 — highlights and pastoral safety landed

- PR #120 squash-merged as `26efb71193b4fbc370755b71f7c7fa1a88e305e7`; issue #112 closed after dedupe/ARIA permanent regression and standard source/browser CI.
- PR #138 squash-merged as `5650c96b838c78dcda3c37b75f8e58755469cacd`; `NG-PASTORAL-SAFETY-01` closed after artifact SHA verification, exact fresh-source replacement, full publication barrier and permanent regression.
- Closed count 119 → 121. Next isolated lane: issue #140 / `NG-SOURCE-INTEGRITY-01`.

### 2026-07-22 — source integrity landed

- PR #141 squash-merged as `2599844b2ea0962f728824564ed6fa6ef9592270`; issue #140 closed.
- Exact TMSJ objects/pages and author-vs-institution attribution are permanently guarded in native + shadow layers.
- Closed count 121 → 122. Next isolated lane: issue #142 / source-role and argument-layer registry.

### 2026-07-22 — all-route browser and visual-policy production closure

- PR #145 squash-merged as `f9439ef303601e1dc68b5c40ff4d0e1ec8db6a3e`; final head `ebc298b3` passed Shared Files `29925122651`, Native Source `29925122656` and Route Registry/browser `29925123418`, with 3428/3428 contracts PASS across 75 routes × 3 viewports.
- PR #148 squash-merged as final source `aeae401d782d769dad582395f2045fa79c020f42`; exact PR-head checks: Shared `29937354573`, Visual `29937351115`, Native `29937351111`, Route/browser `29937357579` — success.
- Exact main checks passed: Shared `29938007239`, Visual `29938007421`, Native `29938007246`, readiness `29938007259`; Pages `29938389078` deployed the same SHA.
- Live-origin witness: AuditRepo run `29938751151`, artifact `8537627473`; HTTP 200, 7/7 required markers, 2/2 forbidden stale markers absent, SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`, ETag `"6a60f46c-132af"`, Last-Modified `Wed, 22 Jul 2026 16:48:44 GMT`.
- Closed count 122 → 124. Next isolated boundaries: issue #142 source-role registry, issue #146 route semantics, then Reader R6 issue #59.

### 2026-07-22 — Hard Texts visual ownership and Nagornaya registry production closure

- PR #151 squash-merged as `0a4491184376442923270c412614392717949a18` after fresh screenshots proved the strict-native Hard Texts landing intentionally renders the current six-card Materials section absent from retired legacy HTML; global tolerance remained 0.5%.
- PR #149 squash-merged as `6c4106aecd35a3c95b09b041332d653f581ceb92`; issue #142 closed. Canonical registry/schema, three exact TMSJ sources, six claim/boundary records, native derivation and adversarial tests landed.
- Final PR head `e9d23d041cf05b58a0719cfda829b44a54b0552d`: Shared `29949641691`, Route/browser `29949641685`, Native `29949641690`, Visual `29949641802` — success; 3428/3428 overall, sources route 33/33 and 0.000% desktop/mobile.
- Exact main: Shared `29950458595`, Visual `29950458386`, Native `29950458319`, readiness `29950459817`; Pages `29951046722` deployed the same SHA.
- AuditRepo witness `29950695954`, artifact `8542524012`: registry SHA-256 `d105f6a309de866550118a4fa7dcd8c8ec9cb8c3f0f68d23dd0c944a8845b4c2`, live HTTP 200, 8/8 required, 2/2 stale absent, live SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`, ETag `"6a611d07-132af"`, Last-Modified `Wed, 22 Jul 2026 19:41:59 GMT`.
- Closed count 124 → 127; open P1 count 215 → 213. Next isolated lanes: issue #153 neutral comparison UI, issue #146 route semantics, Reader R6 #59.

### 2026-07-23 — registry-driven sitemap contract production closure (`8a535267`)

- PR #163 replaced root-HTML sitemap inference with the effective route registry and explicit `seo.indexable=false` policy.
- Exact pre-merge head passed Shared Files, static registry/audit-pro, production-like build, 3428/3428 public-surface Chromium and 126/126 route semantics.
- Exact source readiness `30006414898` and Pages `30007024100` succeeded; observer `30006649281` artifact `8563907298` recorded 66 live sitemap URLs and SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`.
- `AUDIT-PRO-SITEMAP-ROOT-ONLY` closed; broader `AUDIT-PRO-ROOT-ONLY` and `SEO-AUDIT-ROOT-ONLY` remain open. Closed count 134 → 135; open P3 count 56 → 55.


### 2026-07-24 — Reader R6 canonical closure and cross-browser extension (`c8b47201`)

- PR #191 squash-merged ReaderState R6 as `a43727078d0f39e541a5aad8cd250a90310181a9`; issue #59 closed completed.
- Exact R6 head `2461198f45033d8cce5f2444a9492d9f8176fa01` passed Shared Files, Gill reconciliation, Overlay, Glossary, Native Source, Route Registry/engine sweep and Visual Parity.
- PR #200 merged as `c8b47201f5b7210d69809c38808bfbda15695dcd` and extended all 75 public routes to Android Chromium plus iPhone/desktop WebKit without changing product surfaces; exact head `da05253bfc37db7b57318492f5576bd929c5c140` passed 1828/1828 Android and 2660/2660 WebKit assertions.
- `READER-R6-STATE-01` is added as a closed canonical row; `READER-PUBLIC-SURFACE-BROWSER-01` is extended rather than duplicated.
- Closed count `143 → 144`; canonical open counts remain P0/P1 `4`, P1 `94`, P2 `35`, P3 `51`, refactoring `4`, AuditRepo `4` — total open `192`.
- Last exact production authority remains `8a535267`; this reconciliation advances source/CI truth only.

### 2026-07-24 — map failure recovery and control-plane closure (`5636a6a1`)

- Source advanced through map recovery PR #203 (`0461faa8`), control-plane integrity PR #204 (`f11749ee`) and warning-convergence PR #205 (`5636a6a1`).
- PR #203 permanently covers Ishod/Avraam normal, no-JS, `route.json` 503 and engine-asset failure scenarios; `ASTRO-P0-05` and `ASTRO-P0-06` move to source+CI verified closed status.
- PR #204 removed the settled write-capable Gill temporary workflow and added filesystem-derived local-reference/control-plane auditing plus a checksum-verified actionlint runner.
- PR #205 removed deleted editorial branch triggers and migrated Bible, Glossary and TTS workflow linting to the shared runner. Exact artifact: 19 workflows, 151 npm scripts, 452 references, 0 hard issues and 3 bounded warnings.
- Current source has no open PRs. Reader R6 issue #127, Nagornaya umbrella #117 and stale aggregate CI alerts #12/#17 were closed after source verification.
- Production authority intentionally remains `8a535267`; exact readiness → Pages → live evidence for `5636a6a1` has not been established.

### 2026-07-25 — d94b5488 multi-agent convergence

- Source authority advanced from `184d7ed1` to `d94b5488`.
- Duplicate PDF ownership closed through merged #283 and superseded #280.
- Stale Genesis snapshot #285 closed/reset; no activation owner exists.
- Current active source PRs recorded as #284 and #286.
- Production authority remains fail-closed pending exact evidence import for `ddcf7153`.
- Added notifier, build-once, workflow proliferation, provenance coupling and Research authority findings.

### 2026-07-25 — source `733ba309`, imported `f5e29998`, operator witness projection

- Advanced source SSOT from `be78785b` to merged PR #312 / `733ba309`; production authority remains exact imported `f5e29998`.
- Recorded exact CI: TTS `30170949705`, Shared Guard `30170949685`, source artifact `8622897352`, browser artifact `8622943174`.
- Recorded operator-recovery comment `5080203496` with exact marker/artifact IDs and explicit historical ledger failure; automated replay remains unobserved.
- Recorded #307 closed without merge after V2 evidence import and refreshed active owners #309/#321/#322/#324.
- No matrix row changed open/closed/severity class; counters remain unchanged.

### 2026-07-25 — source `7b462b96`, canonical witness lock

- Advanced source SSOT to merged #332 / `7b462b96`; retained production authority at exact `f5e29998`.
- Recorded #321 notifier ordering and #324 core redirect-hop merge; #303 remains open for privacy/evidence/pinning residuals.
- Recorded TTS `30172394177`, Shared Guard `30172394185`, source artifact `8623271965` and browser artifact `8623312279`.
- Refreshed active ownership to sole PR #309.
- No row changed open/closed/severity class; counters remain unchanged.

### 2026-07-25 — source `6c005e49`, trustworthy source-link acceptance

- Advanced source SSOT from `f4c60ecb` to merged PR #346 / `6c005e49`; production authority remains exact imported `f5e29998`.
- Closed `SOURCE-LINK-REDIRECT-POLICY-BYPASS` after PRs #324/#336/#346, clean exact-head CI and post-merge real-network artifact `8624053524` (`sha256:d20c3b57…`).
- Recorded 201 checked, 165 pass, 31 transient warning, 5 genuine hard and 35 redirect hops with `systemicTransportFailure=false`; moved the five source records to CONTENT/RESEARCH issue #352.
- Corrected stale replay status: trusted manual ledger run `30171194731` completed success while historical run `30169981463` remains failure.
- Closed count 156 → 157; P2 open count 37 → 38. Active source PR owners at capture: #338 and #348.

### 2026-07-25 — source `31758828`, homepage Chromium/WebKit contract

- Advanced source SSOT from `6c005e49` to merged PR #338 / `31758828`; production authority remains exact imported `f5e29998`.
- Added closed `HOME-BROWSER-CONTRACT-MISSING` after production-like Chromium/WebKit/no-JS interaction proof and exact Shared/Native/Print/Visual/Glossary gates; source issue #299 is closed.
- Recorded the pre-runtime search shortcut correction and preserved #298 product-golden work as a separate visual-approval boundary.
- Closed count 157 → 158; open severity counts remain unchanged. Active source PR owner at capture: #348; CONTENT/RESEARCH issue #352 remains open.

### 2026-07-25 — source `b594ba82`, Gill source links clean

- Advanced source SSOT from `31758828` to merged PR #354 / `b594ba82`; production authority remains exact imported `f5e29998`.
- Moved `SOURCE-LINK-BROKEN-EXTERNAL-5` from open P2 to closed `GILL-EXTERNAL-SOURCE-5` after exact citation-preserving replacements and real-network artifact `8624151439` (`sha256:2bee8f47…`) with 201 checked and zero hard errors.
- Recorded exact clean-head Gill/Overlay/Glossary/Shared/Dateline/Native/submenu/Print/Visual/Route Registry success.
- Closed count 158 → 159; P2 open count 38 → 37. Active source PR owner at capture: #348.

### 2026-07-25 — source `9407cc92`, Genesis 6 Research provenance pinned

- Advanced source SSOT from `b594ba82` to merged PR #348 / `9407cc92`; production authority remains exact imported `f5e29998`.
- Moved `RESEARCH-AUTHORITY-MANIFEST-MISSING` from open P2 to closed after exact Research SHA/manifest/ledger/bundle/rights pinning and successful provenance, Shared and Visual gates.
- Preserved `GENESIS6-ACTIVATION-OWNER-GAP`: #348 changed no route, MDX, theme, CSS or publication state; `draft-noindex` remains mandatory and issue #287 remains archived transport history.
- Closed count 159 → 160; P2 open count 37 → 36. Active source PR owner at capture: #365 (test-only homepage lifecycle evidence); no Genesis activation owner existed.
