# Optional Work Queue — the-legendary-poet

Эта очередь содержит только направления, которые реально требуют нового owner-selected решения или следующей bounded wave. Закрытая история живёт в `verified/CLOSURE_LEDGER.md`, verification packages и Git history; очередь не должна становиться биографией проекта.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering authority lives only in the MASTER matrix. This optional queue intentionally does **not** copy active row counts or active IDs, because duplicated volatile snapshots become stale and can resurrect already closed work. No Product repair lane is selected here.

## Audit marathon disposition

**Current autonomous audit queue: CLOSED AT PRODUCT `d59cceccb0c49af59b1be38d4c547a6240b3005a`.**

Rows that remain active in MASTER are verified Product repair roots, not unfinished audit waves. Do not start another broad audit against the unchanged Product head just because rows remain open. Reopen auditing only on a materially changed relevant surface, a concrete contradictory live/browser witness, new deployed/backend evidence, an owner-selected unanswered surface, or future repair verification.

Closeout evidence: [`verification/2026-08-12-audit-marathon-closeout/REPORT.md`](verification/2026-08-12-audit-marathon-closeout/REPORT.md).

## Optional community product-quality opportunities — not current defect rows

These are useful owner-selected improvements after/alongside the active repair roots; they must not be promoted to MASTER without a fresh defect witness.

- **Production shared-backend canary:** if shared comments/ratings are a required product promise, make configuration/reachability/write-capability observable with a dedicated non-destructive health contract rather than inferring it from optional repository variables.
- **Moderation/reporting workflow:** keep guest comments registration-free, but consider a reader `Пожаловаться` action, documented moderation states/reasons and an operator path that does not require direct database surgery for routine abuse handling.
- **Repeat-commenter convenience:** remember the last nickname locally after a durable submission; keep anonymous posting available and do not turn nickname persistence into account registration.
- **Lower first-comment friction:** keep one sensible comment-kind default and consider moving kind selection behind an optional `Тип комментария` disclosure so the primary path stays optional name → text → submit.
- **Community privacy transparency:** if the owner wants the privacy page to describe implementation details more precisely, explain the stable pseudonymous browser UUID and local pending outbox without presenting them as an account/profile.

## Optional editorial/discovery product decisions — not current defect rows

- **Reader-visible update provenance:** article data can carry `dateModified`; decide whether substantial updates should additionally render an explicit `Обновлено` label in the reader UI rather than remaining machine metadata only.
- **Command Palette scope copy:** Footer exposes archive/policy destinations that the palette index does not; active `TLP-SEARCH-001` owns the engineering mismatch, while final wording versus index expansion remains an owner choice.
- **Canonical poet portrait provenance:** current canonical portraits are not proven reconstructions; do not relabel by inference. Active authoring contract owns future portrait existence/provenance gating; Product #270 remains longform visual provenance territory.
- **Essay image-kind hardening:** sampled current published image blocks explicitly classify `kind`, so no current mislabel was promoted. Future authoring should make missing `kind` fail closed rather than renderer-defaulting it to `archive`.
- **Consent copy/placement:** active `TLP-ANALYTICS-CONSENT-001` owns the engineering need for a reopenable preference control; the final wording and whether that entry lives in Privacy, Footer, or a dedicated settings surface is an owner product choice.

## 2026-08-19 parked observations (arena-bugverifikator)

- `RATINGS-PROMISE-VS-CAPABILITY` — `/ratings` is indexed with a description and JSON-LD promising «Сводный читательский рейтинг русских поэтов: оценки, комментарии и прозрачная методика», while the current production build can only show this-browser data (community remote disabled at build time). The page itself is honest in-UI (`RatingsPage.tsx:188`), so this is an indexed-promise vs delivered-capability gap, not a UI defect. Either soften the indexed wording while the shared backend is off, or accept it as a temporary release state — owner call. Re-check when Product PR #420 lands and the backend is enabled.
- `ESSAY-DEAD-COVER-FIELDS` — `src/data/essays/brikCase.ts:13-14` and `src/data/essays/mayakovskyGromovoy.ts:13-14` still point `cover`/`cardCover` at four `.jpg` files that exist neither in `public/` nor on production (404). They are overridden by the visual layers (`brikCaseVisual.ts:7-8`, `mayakovskyPartTwoVisual.ts`) before export, so `EssayCard.tsx:26` never renders them and no image is broken on the live site. Cleanup only; also worth teaching `validate:covers` to fail on unreachable base values so the next stale path is caught by CI rather than by an audit pass.

## Current architecture selection

**None.**

`TLP-HALL-001` / Product #369 remains terminally closed. Frozen Hall safety/evidence stays historical authority, not a current architecture lane or permission to promote WebGL/documentary production without new owner/evidence gates.

Terminal Hall evidence remains under `verification/2026-08-10-hall-v3-root-closure/` and the historical Product #404/#369 closure chain.

## Current disposition

**No autonomous Product transaction is selected now.**

Не создавать повторные schema/workflow/recheck PR или новые broad-audit waves только ради ощущения движения. Не продвигать documentary rights, offline visual approval, WebGL, scale-out или Product repair без нового owner-selected действия/evidence.
