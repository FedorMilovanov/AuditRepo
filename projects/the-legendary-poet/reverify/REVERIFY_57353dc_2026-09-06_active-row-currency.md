# Active-row currency + community reachability — reverify at Product `57353dc`

**Date:** 2026-09-06
**Agent:** Arena Agent (SSOT/matrix integrity audit)
**Findings touched:** all 21 active MASTER rows; disposition changed for **none**
**Disposition:** `ALL STILL-CONFIRMED` + `P1 REACHABILITY RE-MEASURED ON CURRENT BUILD`
**Audited anchor:** Product `main` `57353dcee63123e8e2a86fa83bc964ffa5f29303`
**Live snapshot:** `https://thelegendarypoet.ru`, 2026-09-06
**Production claim:** `yes` (for the reachability item only)
**Product mutation:** none
**Wave:** `../verification/2026-09-06-ssot-matrix-integrity-audit/REPORT.md`

---

## 0. Why this check exists

The 2026-09-06 SSOT audit had to answer whether any active row is *current* rather than merely historical. The previous reachability witness for the single P1 was measured on 2026-08-19 at Product anchor `d59ccec` — **before** PR #420 (Cloudflare Worker/D1 authority) and PR #422 (client/runtime contract) merged. Under the operating model's terminal-attestation freshness rule, a witness whose owner has since moved cannot be cited as a current admission witness. It therefore had to be re-measured, not re-quoted.

## 1. Correction to an earlier draft of this wave

An earlier draft of the MASTER `TLP-COMM-ABUSE-001` row cited the 2026-08-19 measurement as if it described the current build. That was a staleness error and is corrected here: the row now cites the live 2026-09-06 witness below. The 2026-08-19 intake and reverify are untouched — they remain valid evidence at their own anchor.

## 2. Community reachability — measured live on the current build

| Item | Value |
|---|---|
| Live URL | `https://thelegendarypoet.ru/ratings` |
| Observed | `2026-09-06` |
| Deploy run behind it | `33992389166`, success, head `57353dcee631` |
| Rendered sync badge | `Сейчас показаны данные этого браузера; общий backend не подключён` |

Mechanism binding the observation to `remoteEnabled`:

- `src/pages/RatingsPage.tsx:188` emits that exact string only for `sync.phase === 'local'`;
- `src/utils/communityLeaderboardStore.ts:63` sets `phase: remoteEnabled ? 'idle' : 'local'`;
- `src/utils/communityStore.ts:661` uses the same conditional for the feedback store;
- `src/utils/communityConfig.ts` derives `remoteEnabled` from build-time `VITE_COMMUNITY_API_URL` **and** a Turnstile path, failing closed to local mode;
- `.github/workflows/deploy.yml:136-137` injects those two values from repository variables.

Had the shared backend been configured, the same badge would have read `Обновляем общую базу читательских оценок…` (`phase: 'idle'`).

Corroborating live values on the same page: `0` голосов читателей, `0` комментариев, every row `Голоса / мнения 0 / 0` and `Индекс читателей —`.

**Conclusion.** `remoteEnabled` is `false` in the currently deployed build. The public community write/abuse surface is unreachable on production today. `TLP-COMM-ABUSE-001` therefore stays **open and P1 as a release gate that binds when the shared backend is enabled** — it is not a claim of a currently exploitable live exposure, and it is not closed either, because none of the six live activation conditions in the 2026-08-20 closure boundary have been observed.

Repository Actions variables remain inaccessible to the issued token (`403`), so this conclusion rests on the live artifact plus the source mechanism, not on reading the configuration directly. That is the same boundary the 2026-08-19 pass recorded.

## 3. Active-row currency — 21/21 re-checked at `57353dc`

Every row was checked against current source; **no disposition changed**.

| Row | Current witness at `57353dc` | Verdict |
|---|---|---|
| `TLP-COMM-ABUSE-001` | §2 above; live badge + `communityConfig.ts` fail-closed derivation | still-confirmed (gate) |
| `TLP-A11Y-RUNTIME-001` | `AnalyticsConsent.tsx:55` renders the consent surface `fixed … z-[140]` with no `overlayRuntime`/`useDialogSurface` registration, so it can sit above registered `aria-modal` dialogs | still-confirmed |
| `TLP-DISCOVERY-001` | `scripts/submit-indexnow.mjs` still derives `urlList` from the whole `public/sitemap.xml` and submits it per deploy | still-confirmed |
| `TLP-AUDIT-004` | `qa/` contains **0** occurrences of `noise-bg` and no UI-driven consent-revoke contour | still-confirmed, narrowed |
| `TLP-AUTHORING-ID-001` | `scripts/new-poet.ts:44` derives the id by transliterating the surname with no ASCII-kebab gate, sets `translitPhoto = id` with no existence check, and prints only `validate-library.ts`; `POET_AUTHORING_GUIDE.md:222` names a different list; `package.json` `check:content` requires ~20 validators including `validate:poet-authority` and `validate:covers` | still-confirmed |
| `TLP-AUDIO-SESSION-001` | `audioSessionStore.ts:136-141` writes the whole snapshot with `setItem(KEY, JSON.stringify(...))`; no `storage` subscription exists for the session key | still-confirmed |
| `TLP-ANALYTICS-CONSENT-001` | `analytics.ts:42` broadcasts consent only through a same-document `CustomEvent`; no `storage` listener, so a second tab never converges | still-confirmed |
| `TLP-RATING-SOURCE-001` | `RatingsPage.tsx:167` reader sort tie-breaks on `right.poet.rating - left.poet.rating` — the editorial `/10` score ranks reader rows; live page shows `Индекс читателей —` beside `Редакция 10.0 / 10` | still-confirmed |
| `TLP-AUDIO-RELEASE-001` | `validate-audio-assets.ts:82,104,107` routes a missing master into `warnings` under `allowMissing`; only `errors` exit non-zero | still-confirmed |
| `TLP-ROUTE-REDIRECT-001` | `route-contract.json` declares the same 5 aliases; `public/_redirects` is only `/*  /index.html  200`; `vercel.json` is a bare rewrite — both inert on GitHub Pages (`pages` API confirms `build_type: workflow`, CNAME `thelegendarypoet.ru`) | still-confirmed |
| `TLP-SECONDARY-DATA-001` | `EssayPage.tsx:26` resolves the optional essay catalog with `use(...)` at component top level, so catalog failure is route-fatal | still-confirmed |
| `TLP-SEARCH-001` | `commandItems.ts` indexes sections + poets + essays + tracks, **no poems**; `CommandPalette.tsx:24-27` filters with bare `toLowerCase()`; `ё/е` folding exists only in two divergent local helpers (`RatingsPage.tsx:60`, `MyArchivePage.tsx:28`) and `dailyContent.ts:49` | still-confirmed |
| `TLP-RATING-METHOD-001` | `RatingsPage.tsx:33,123` — `PRIOR_WEIGHT = 5` against a self-derived `globalMean`, so `1×5.0` still outranks `20×4.5`; the live page still promises `Таблица учитывает размер выборки, поэтому один случайный голос не захватывает первое место` | still-confirmed |
| `TLP-RATING-URLSTATE-001` | `RatingsPage.tsx:83-85` seeds `tag`/`rated`/`query` from `searchParams` inside `useState` initialisers (mount-only), then writes state → URL | still-confirmed |
| `TLP-ANALYTICS-ROUTE-001` | `AnalyticsConsent.tsx:14-31` keys the page-view effect on `location.pathname` **and** `location.search`, emitting on raw location mutation | still-confirmed |
| `TLP-READING-PROGRESS-001` | `ReadingProgress.tsx:24` derives progress from `document.documentElement.scrollHeight` | still-confirmed |
| `TLP-AUDIO-COMPLETION-001` | `AudioPlayerProvider.tsx:575` persists completion at `currentTime / duration >= 0.97` | still-confirmed |
| `TLP-HOME-MEDIA-PERF-001` | `HeroPoetWindow.tsx:123` `loading="eager"` for all six; the six portraits total exactly **880,330 bytes**, byte-identical to the 2026-08-12 witness; no `srcSet` | still-confirmed |
| `TLP-A11Y-MOTION-001` | reduced-motion blocks in `src/index.css` (318, 361, 428, 824) enumerate named utilities only; `PoetCard.tsx:41` keeps an unguarded `animate-pulse`; 18 `animate-pulse`/`animate-spin` usages remain | still-confirmed |
| `TLP-A11Y-STATUS-001` | `PoetsPage.tsx` has no `role="status"` / `aria-live` for the dynamic result count | still-confirmed |
| `TLP-SHELL-NOISE-001` | `index.html:92` and `src/App.tsx:125` (inside `function SiteLayout()`) both render `.noise-bg`; `src/index.css:776` makes each a fixed full-viewport `feTurbulence` layer at `z-index: 100` | still-confirmed |

## 4. Buckets

- **still-confirmed:** 21
- **fixed-current:** 0
- **stale-on-current-head:** 0
- **regression:** 0
- **needs-manual-check:** 0

No row was closed, absorbed, reclassified or removed by this check.

## 5. Claim boundary

- Source claims are bounded to the exact tree at `57353dcee63123e8e2a86fa83bc964ffa5f29303`.
- The one live claim is bounded to the rendered `/ratings` document observed on 2026-09-06 and to the mechanism that produces its sync badge. No browser-runtime, network-timing, GPU or accessibility-engine measurement was performed in this pass.
- Rows whose terminal outcome requires browser proof (`TLP-A11Y-*`, `TLP-AUDIO-*`, `TLP-SHELL-NOISE-001`) are confirmed here at source level only; their existing browser evidence is unchanged and not re-litigated.
