# Agent Audit Report — the-legendary-poet

## Meta

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Agent: Arena Agent (arena.ai Agent Mode)
- Date: 2026-08-18
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot):
  - Product `main` SHA: `d59cceccb0c49af59b1be38d4c547a6240b3005a`
  - HEAD subject: `assets(yesenin): publish approved Part II premium cover (#415)`
  - Source tree: codeload zip of `main` at check time
  - Live host: `https://thelegendarypoet.ru` (not fully browser-exercised this pass)
- Environment: static source inspection + GitHub API (commits/PRs/branches)
- Build mode: source
- Browser / device if used: none (no Playwright/Chromium this pass)
- Scope:
  1. current-check of all **30** active MASTER rows;
  2. collision check vs open Product PRs/branches;
  3. representative source witnesses for P1 and systemic P2/P3 classes.
- Explicit exclusions:
  - no Product code mutation;
  - no deployed Supabase grant/live RLS interrogation;
  - no full Chromium/WebKit a11y/runtime matrix;
  - no Hall architecture lane work (`architecture/tlp-hall-*`, closed #369);
  - no MASTER mutation / count rewrite.
- Signal class: Product engineering residuals + process/collision
- Proof state: **CONFIRMED-CURRENT (source)** for sampled mechanisms; **UNPROVEN-LIVE** where only browser/deploy proof would close; **no closures**
- Claim boundary: Product `main` `d59ccec…` only; editorial open PRs noted as non-owners of engineering residuals
- Preservation boundary: do not reopen Hall #369; do not treat marathon `AUDIT-COMPLETE-AT-ANCHOR` as “bugs fixed”
- Semantic owner: AuditRepo `projects/the-legendary-poet`
- Overlapping active owner/PR/branch check:
  - Open PRs: **#416** `agent/benislavskaya-longform-draft`, **#417** `editorial/simonov-son-artillerista-essay` — editorial/content staging only
  - Engineering residual lanes: **no open competing fix PR** observed for the 30 MASTER IDs
  - Stale/parallel refs present (`architecture/*`, `agent/fix-archive-cross-tab-363`, forensic/archive) — not treated as current residual owners without merge

> Anchor records what this pass inspected. Do not update this report merely because source later moved.

---

## Executive result

```text
MASTER open rows: 30
Closed this pass: 0
Source-confirmed still current (sampled mechanism): 30 (no contrary fix found)
New Product defects admitted to MASTER: 0
Colliding engineering fix PRs: 0
Terminal "all clear": NOT issued
```

Recent Product history after the 2026-08-12 verification wave is dominated by **Yesenin Part II editorial/provenance/asset** merges (#406–#415) and Hall roadmap closeout (#404). That work does **not** implement the community abuse, theme ownership, shell-noise singleton, consent revocation, poem text layer, or other MASTER engineering terminals. Therefore the active matrix remains the correct repair backlog; it is not stale-empty.

---

## Collision / branch map

| Ref | Role | Collision with MASTER? |
|---|---|---|
| PR **#417** `editorial/simonov-son-artillerista-essay` | editorial longform staging | No — content lane |
| PR **#416** `agent/benislavskaya-longform-draft` | editorial longform + hero | No — content lane |
| `architecture/tlp-hall-*`, `architecture/hall-v3-foundation-369` | Hall spikes / historical | Outside matrix (Hall #369 frozen) |
| `agent/fix-archive-cross-tab-363` | historical archive cross-tab attempt | Not an open PR; do not assume it owns `TLP-COMM-READSTATE-001` without re-base proof |
| `archive/deep-research-local-images-20260724` | forensic | Not a merge candidate |

**Handoff rule:** engineering residual repairs may proceed on fresh branches from `d59ccec…` without waiting on #416/#417, but must not touch contested editorial essay paths those PRs own.

---

## 1. P1 — confirmed current

### `TLP-COMM-ABUSE-001` — CONFIRMED-CURRENT (source)

- **Mechanism still present**
  - `src/utils/communityIdentity.ts`: anonymous `tlp-community-device-v1` UUID from `crypto.randomUUID()` / fallback; stored via `safeWrite` in browser storage; fresh profile/storage ⇒ new voter identity.
  - `src/utils/communityRemote.ts`: writes call `rpc('tlp_submit_rating'|'tlp_submit_comment'|'tlp_mark_helpful', { …, p_voter_id: voterId })` with **caller-supplied** `voterId`.
  - `docs/community-schema.sql`: uniqueness is `(target_type, target_id, voter_id)` / equivalent vote tables — **DB enforces one row per voter_id**, not per trusted person; RPC is `security definer` and accepts client `p_voter_id`.
- **Expected terminal (unchanged):** server-side anti-abuse/target authority; rotated-ID / multi-tab adversarial proof; no mandatory registration requirement in the row’s success criteria.
- **Evidence labels:** `verified-source`
- **Not proved here:** live production grant matrix; quantitative abuse success rate.
- **Disposition:** keep P1; no fix owner PR.

---

## 2. P2 — row-by-row current-check (source-proportionate)

| ID | Result | Source witness (anchor `d59ccec…`) | Notes |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | **CURRENT** | `communityStore.ts`: local outbox/cooldowns/pending ops + remote submit; client validation/`COOLDOWN_MS` live beside server path | No typed server-authoritative ACK reconciliation layer found that retires the row |
| `TLP-COMM-ORDER-001` | **CURRENT** | comment fetch uses newest-first remote pages; helpful/kind ordering remains client-side over loaded subset in store/UI path | No server corpus sort contract found |
| `TLP-COMM-A11Y-001` | **CURRENT** | community panel still a dense client widget surface; no contrary a11y owner rewrite in recent merges | Full browser a11y not re-run; mechanism class not removed |
| `TLP-COMM-READSTATE-001` | **CURRENT** | local snapshot keys `tlp-community-feedback:v3` + archive store; multi-tab via storage, not a single server read-state authority | Branch `agent/fix-archive-cross-tab-363` exists but is not merged |
| `TLP-COMM-TARGET-001` | **CURRENT** | `communityTargetStore.ts` optimistic overlays; target membership still not a single server-canonical membership gate in client | Aligns with abuse/target authority gap |
| `TLP-THEME-001` | **CURRENT** | `ThemeToggle.tsx`: `STORAGE_KEY='tlp-theme-mode'`, applies `theme-light` on `documentElement`; has `storage` listener but **no `matchMedia` system preference owner**; preboot/`index.html` still separate from React toggle path | Systemic theme ownership not collapsed |
| `TLP-A11Y-RUNTIME-001` | **CURRENT** | multiple focus/hover owners (`InteractivePoemText`, `KineticText`, audio chrome, overlays) without one nav/focus/dialog contract module | Needs browser proof for closure; source fragmentation remains |
| `TLP-A11Y-CONTRAST-001` | **CURRENT** | widespread low-opacity utility text (`text-cyan-200/65`, luxury gold/white alpha borders) + star/control graphics; no shared non-text 3:1 certification helper | Prior 2026-08-12 package still applicable class |
| `TLP-DISCOVERY-001` | **CURRENT** | SEO/head still runtime-composed; no single route-state machine module retiring sitemap/OG/IndexNow drift class in tree | Editorial merges did not add discovery owner |
| `TLP-READER-TEXT-001` | **CURRENT** | `InteractivePoemText.tsx`: words split to motion spans; `select-none` on poetry surface; no parallel exact selectable canonical text layer | Direct source hit for MASTER wording |
| `TLP-AUDIT-004` | **CURRENT** | large QA surface still split across many `qa/*.spec.mjs` + `scripts/validate-*.ts`; no evidence of a unified proxy/preview matrix closing false-green gaps | Harness debt remains |
| `TLP-AUTHORING-ID-001` | **CURRENT** | authoring/release scripts and content IDs still multi-path; recent Yesenin work tightened provenance for one corpus, not a global authoring ID state machine | Do not over-claim Yesenin fixes as global closure |
| `TLP-AUDIO-SESSION-001` | **CURRENT** | `audioSessionStore.ts` + `AudioPlayerProvider.tsx` persist session in browser storage; no conflict-safe versioned multi-tab merge authority found that matches terminal outcome | |
| `TLP-ANALYTICS-CONSENT-001` | **CURRENT** | `AnalyticsConsent.tsx` + `analytics.ts`: consent gates load; **no durable cross-tab revoke/re-grant control surface** beyond banner-while-unset pattern; `PrivacyPage` remains policy text without full in-app consent editor | Matches MASTER evidence pointer class |
| `TLP-RATING-SOURCE-001` | **CURRENT** | rating presentation still mixes reader aggregates and editorial scores without a universal source/scale carrier in UI badges | |
| `TLP-AUDIO-RELEASE-001` | **CURRENT** | release/audio validation scripts remain warning-tolerant patterns in places; no new fail-closed “every published master physical asset” gate observed that retires the row | Exact gate audit not exhaustively re-derived; no contrary hard gate found |
| `TLP-ROUTE-REDIRECT-001` | **CURRENT** | `vercel.json` / client router redirects still not a complete host-level legacy alias proof; client-side routing remains primary | |
| `TLP-SECONDARY-DATA-001` | **CURRENT** | essay/poet detail still compose secondary catalog/related data in-route without a dedicated primary-readiness boundary module retiring the class | |
| `TLP-SEARCH-001` | **CURRENT** | `scripts/gen-essay-search-index.ts` builds lightweight index (good direction historically) but MASTER residual on inventory/text authority not fully retired by a single search authority package | |
| `TLP-RATING-METHOD-001` | **CURRENT** | sample-size/methodology truth not newly centralized | |
| `TLP-RATING-URLSTATE-001` | **CURRENT** | rating/filter URL state still bidirectional-risk class without a dedicated ownership module proof | |

---

## 3. P3 — row-by-row current-check

| ID | Result | Source witness | Notes |
|---|---|---|---|
| `TLP-ANALYTICS-ROUTE-001` | **CURRENT** | `analytics.ts` page-view tied to location lifecycle | No settled-semantic-route-only emitter found |
| `TLP-READING-PROGRESS-001` | **CURRENT** | progress still document/root-scroll oriented where present | Article-boundary ownership not introduced |
| `TLP-AUDIO-COMPLETION-001` | **CURRENT** | `AudioPlayerProvider` / session store still use high-fraction completion heuristics (incl. ≥97% class) rather than native `ended`-only categorical truth | Matches MASTER |
| `TLP-HOME-MEDIA-PERF-001` | **CURRENT** | `HomePage.tsx` still eager hero word/portrait media patterns; responsive `srcset` not systematically applied to hero portraits | Byte budget not re-measured this pass; mechanism class present |
| `TLP-A11Y-MOTION-001` | **CURRENT** | Framer paths exist; `index.css` still has pulse/spin-style utilities without a single CSS+JS reduced-motion contract covering all decorative persistence | `prefers-reduced-motion` coverage incomplete vs terminal |
| `TLP-A11Y-STATUS-001` | **CURRENT** | dynamic `/poets` filter/search UI without a unified live region/status owner retiring the row | |
| `TLP-COMM-TEXT-001` | **CURRENT** | community text still plain React string render (XSS escaped — good) but MASTER text/moderation residuals not engineering-closed | Do not reopen XSS claim |
| `TLP-SHELL-NOISE-001` | **CURRENT** | **Direct dual owner still present:** `index.html` preboot `<div class="noise-bg"></div>` **and** `App.tsx` runtime `<div className="noise-bg" />`; shared CSS `.noise-bg` + `feTurbulence` data-URI in `src/index.css` | Strongest trivial singleton residual; prior 2026-08-12 package still accurate |

---

## 4. New observations

### `OBS-TLP-NO-ENGINEERING-FIX-PR`

- Kind: process
- Finding: after 2026-08-12 closeout, Product motion is almost entirely editorial/provenance/assets; **engineering MASTER rows lack open fix PRs**
- Impact: backlog is real but idle; risk of “audit complete” being misread as “product clear”
- Disposition: record only; WORK_QUEUE / owner may select lanes

### `OBS-TLP-EDITORIAL-PRS-SAFE-PARALLEL`

- Kind: collision guidance
- #416/#417 can merge without clearing engineering residuals; engineering branches should avoid their essay asset paths

### `OBS-TLP-SHELL-NOISE-STILL-DUAL`

- Kind: defect confirmation (already MASTER `TLP-SHELL-NOISE-001`)
- High-confidence source proof of dual fixed full-screen noise layers post-hydration
- Good **small first repair** candidate if owner wants a quick P3 win with singleton browser proof

No new ID promoted to MASTER (would need consolidation owner + necessity bar; this pass is reverify).

---

## 5. Disproved / not reopened

| Claim | Disposition |
|---|---|
| Marathon complete ⇒ 0 bugs | **invalid reading** — closeout is audit-wave complete; 30 roots remain |
| Hall #369 is current Product lane | **outside matrix** — frozen/historical |
| Community XSS via raw HTML comments | **not reopened** — React string escape still holds in inspected path |
| Open editorial PRs block all engineering work | **false** — only content path collision |
| Any of 30 rows closed by #415 cover asset | **false** |

---

## 6. Recommended next repair selection (owner)

Highest leverage if starting engineering again:

1. **`TLP-COMM-ABUSE-001` (P1)** — server-trusted write authority (does not require registration if designed with edge tokens/proof-of-work/session cookies carefully).
2. **`TLP-SHELL-NOISE-001` (P3 quick win)** — single noise owner + hydration handoff test.
3. **`TLP-THEME-001` + preboot** — one theme authority including pre-hydration.
4. **`TLP-READER-TEXT-001`** — canonical selectable text layer under kinetic presentation.
5. **`TLP-ANALYTICS-CONSENT-001`** — persistent reopenable control + revoke semantics.

Do **not** start Hall architecture from residual matrix.

---

## 7. MASTER hygiene

- Counts in MASTER (P1=1, P2=21, P3=8, total=30) match table IDs enumerated this pass.
- “Latest current verification” pointer still names `2026-08-12-shell-noise-ownership-current`; after this PR it can optionally also point at `verification/2026-08-18-arena-agent-master-reverify/REPORT.md` in a consolidation wave (not done here).

---

## 8. Proof labels

`verified-source`, `current-confirmed-for-work`, `collision-checked`, `no-closure`, `live-browser-unproven`, `editorial-pr-non-owner`

---

## 9. Minimum useful contribution

- Re-anchored all 30 MASTER rows to Product `main` `d59ccec…` after editorial wave #406–#415.
- Showed open PRs are editorial-only (no engineering dual-fix collision).
- Re-hit strongest source proofs for P1 abuse identity, shell-noise dual layer, poem `select-none` text, theme storage ownership, consent gaps.
- Kept MASTER untouched; evidence deposited for consolidation/repair owners.
