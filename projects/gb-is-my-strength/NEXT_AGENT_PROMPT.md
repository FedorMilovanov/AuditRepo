# NEXT AGENT PROMPT — gb-is-my-strength

> **SSOT по текущему состоянию source-проекта.** Карта документов и правило
> Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-22. Source `main`: `942a79eb6d9bd7542e47470260dd3bbd69d533d8`.**
> PR #119, #123, #125, #128 и #131 завершили release-транзакцию после Reader R5/special overlays.
> **Production подтверждена:** Pages run `29910271842` успешно развернул exact readiness-verified
> SHA `a0c9c025b05eccfce0ab4818da250d05d1b65da0`; observer записал PASS для пяти
> критических source/live blob. Issue #58 закрыта, временный observer удалён PR #131.
>
> Авторитет по точечным статусам: `verified/MASTER_BUG_MATRIX.md`.
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md`.
> Новый verified intake: `incoming/gpt-5-6-nagornaya-deep-audit/2026-07-22/REPORT.md`.

## Перед началом

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
# expect 942a79eb… or newer
```

Если HEAD новее — сначала записать reverify delta. Затем прочитать `AGENTS.md`,
`docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`, документы Reader Platform и этот SSOT.

## Что уже landed — не переделывать заново

### Единая типология контента

- `series` — обычная серия и книга;
- книга — **`surface=series` + `seriesShape=book`**, а не отдельный движок;
- `article` — самостоятельная большая статья;
- `page` — каталог, справочная и другая нестатейная страница;
- `special` — карты, 3D, графы и иные приложения.

Трёхуровневая книга уже есть: главы `tier:'chapter'`, статьи глав, chapter/article rail
и трёхуровневое TOC. Старые book-прототипы AuditRepo — evidence, не код для полного merge.

### Reader R1 — PR #101 (`ffdba149`)

- единое `gb:reader-preferences:v1` и `window.GBReaderPreferences`;
- День / Ночь / Сепия, размер, line-height, measure, text mode, reduced motion;
- миграция legacy keys и cross-tab sync;
- единый first-paint `ReaderPreferencesHead`;
- semantic Sepia без blanket filters для изображений, видео, карт и 3D;
- idempotent shared scroll-lock без MutationObserver feedback loop;
- cross-engine matrix и functional `engine:sweep` 98/98.

### Reader R3 — PR #102 (`75b236ac`)

- нейтральный public façade `SeriesReaderChrome`;
- historical `GillSeriesChrome` остаётся одной внутренней реализацией;
- все 41 production series/book consumer переведены на façade;
- постоянный `series:facade:guard` запрещает direct implementation imports;
- DOM/CSS/runtime implementation не переписывались.

### Reader R4 — PR #103 (`3a715551`)

- все 76 public routes классифицированы в существующих `data/route-profiles`;
- `surfaceContractVersion: 1`, `surface: series|article|page|special`;
- `seriesShape: flat|book` только для series;
- baseline: 51 series (27 flat + 24 book), 2 article, 9 page, 14 special;
- derived registry и adversarial mutation tests встроены в постоянный CI;
- 41 exact `SeriesReaderChrome` consumer, 0 direct `GillSeriesChrome` leaks.

### Reader R5 + special overlays — PR #104 (`43d8672f`), PR #106 (`39f6c3ac`)

- один canonical `OverlayRuntime`;
- named/reference-counted owners, top-layer Escape, focus trap/return, exact style/scroll restore;
- reader, Gill/series, Hermenevtika, MapEngine, MindMap3D/built launcher, global image viewer и mobile fallbacks мигрированы;
- direct production lock writers запрещены;
- Chromium/Firefox/WebKit matrix зелёная.

### Production release closure — PR #119/#123/#125/#128/#131

- PR #119 (`41f78f43`) made readiness observe every `scripts/**` correction;
- PR #123 (`a6a78304`) aligned the Gill frosted-bar audit with the canonical `.80/.78 + blur` contract;
- PR #125 (`e4cf04ab`) established one automatic owner: every `main` push → readiness → Pages;
- automatic deploy checks out exact `workflow_run.head_sha`, never moving `main`;
- Pages run `29907735891` then exposed one final SW baseline drift, fixed by PR #128 (`a0c9c025`);
- Pages run `29910271842` succeeded for exact `a0c9c025` through all publication/runtime/SW/deploy stages;
- observer recorded PASS for `site-utils.js`, `site.js`, floating cluster, MapEngine and committed MindMap app;
- issue #58 closed completed; PR #131 (`942a79eb`) removed the temporary observer and trigger.

## Current mandatory boundary — land isolated prepared P0 fixes

1. Revalidate and merge PR #126 (`NG-RUNTIME-BAR-ASSET-01`) from current main.
2. Revalidate and merge PR #120 (highlights dedupe/ARIA), then close issue #112.
3. Recreate the verified pastoral-safety artifact as a clean separate PR.
4. Only then proceed to source-integrity P1 and Reader R6; do not combine these lanes.

## Prepared but not landed — highlights / issue #112 / PR #120

The matrix previously claimed highlight dedupe/ARIA was fixed by PR #95, but current `main`
does not contain it. The clean rebuilt implementation is in draft PR #120:

- compact old duplicate saved quotes by normalized path + text;
- prevent new same-page duplicates while preserving same text on another page;
- preserve 200-item cap and storage schema;
- synchronize dialog `aria-hidden` initial/open/close state;
- dependency-free regression and full `validate:static-publication:light` already passed.

PR #120 has already been rebuilt cleanly and synchronized with the release fixes. Revalidate from current
`main`, merge only the permanent runtime/test/generated-revision diff, then close issue #112.

## New verified Nagornaya lanes

### P0 — `NG-RUNTIME-BAR-ASSET-01`

- all five Part I–V native footers use `nagornaya-bar-extras.js?v=1`;
- canonical asset hash is `3c7e0bdd`;
- `cache-bust.js` only recognizes eight-hex Astro revisions, so `v=1` bypasses the guard;
- checked-in shadow HTML omits the asset;
- asset file itself exists and `js/` is copied to dist.

Clean draft PR #126 already implements this technical P0 and passed source, adversarial, production-like
and Chromium checks. It is now synchronized with the v191 SW baseline; refresh from `942a79eb`, rerun
standard CI, then merge before other Nagornaya content or UI work.

### P0 pastoral safety — `NG-PASTORAL-SAFETY-01`

Part V currently says:

> «Полное отсутствие плодов — смертный приговор вере» … «Мф 7:21 относится к нему».

Preserve the warning against self-deception, but replace final-verdict/omniscient language with
pastorally calibrated evidence and explicit safeguards. Separate owner-reviewable content PR.

### P1 source integrity — `NG-SOURCE-INTEGRITY-01`

- Green is TMSJ 12/1 **pp. 49–68**, not 49–74;
- Thomas Jesus Seminar is `tmsj7d.pdf`, TMSJ 7/1, pp. 75–105;
- `tmsj7h.pdf` is Nichols, TMSJ 7/2, pp. 213–239;
- individual TMSJ author argument ≠ automatic institutional TMS position.

Fix as a separate bibliography/attribution PR after P0s.

### P1 architecture — argument/source transparency

Grouped lanes, not dozens of unrelated matrix rows:

- `NG-EPISTEMIC-MODEL-LAYERS-01`: label text → reconstruction → literary model → doctrine → application;
- `NG-SOURCE-REGISTRY-01`: requested/final URL, exact object, author/title/pages, extraction/OCR, supported/not-supported claim, source role/tradition, author vs institution, last checked;
- `NG-UI-EPISTEMIC-BIAS-01`: replace red/green answer-key styling for disputed models with neutral comparison; browser screenshot witness first.

Use a reusable table/pattern:

```text
claim | type | primary evidence | alternative | series position | confidence | change condition
```

The detailed C43–C94 checklist remains in the incoming report; do not inflate the canonical matrix with every sentence-level action.

## Reader R6 after current P0 boundaries

Issue #59 remains the next reader-platform wave:

- one progress/resume/bookmark/note state service;
- migrate existing keys without losing user data;
- article-boundary progress rather than whole-document/footer progress;
- eliminate duplicate scroll/resize owners;
- no new content engine.

R6 must remain separate from Nagornaya prose/source/UI work.

## Other open P0/P1

- maps: `MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`;
- Nagornaya dark-theme architecture: `NG-CSS-01`, `NG-BODY-01`, `NG-DARK-01` cluster;
- generated asset manifest / workflow policy v2: issues #56/#64, not part of the current one-off fixes;
- PremiumControls/Floating Cluster/Gill visual contract and other owner/freeze zones: follow `AGENTS.md`.

## Жёсткие правила

1. Один subsystem на PR; technical bar asset, pastoral wording, source integrity, UI model and R6 are separate lanes.
2. SHA-first: любой статус — immutable SHA + command/witness + result.
3. Не ослаблять gates ради зелёного CI.
4. Astro↔legacy parity не доказывает истинность контента.
5. Не переоткрывать закрытое без fresh negative witness; highlight is reopened because current source disproves the ledger row.
6. Positive claim = invariant + environment + negative test.
7. AuditRepo matrix + этот prompt обновлять атомарно after merge/status change.
8. Не утверждать deploy без exact deployed SHA/blob witness.
9. User-supplied AI reports are evidence intake, not canonical truth until current-head/source/PDF/browser verification.
