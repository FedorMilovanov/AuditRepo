# Closure Ledger — gb-is-my-strength

Append-only журнал компактных результатов verification/repair waves.

Цель — сохранять полезную историю без разрастания активного backlog и без обязательного exact-authority пересказа каждого Product merge.

## Transition note

Исторические закрытые строки пока остаются в `MASTER_BUG_MATRIX.md`. Они не переписываются массово в этой реформе. Будущие consolidation waves могут переносить их сюда пакетами с сохранением provenance.

Новая запись не обязана сопровождаться отдельным `reverify/` документом. Он нужен только для спорного, системного, security/live/rights или исторически ценного решения.

---

## Entry format

```md
## YYYY-MM-DD — <wave or closure title>

- Scope: <single finding / cluster / system theme / owner decision>
- Inputs: <reports, matrix IDs or themes>
- Result:
  - closed-by-fix: ...
  - absorbed-by-system-fix: ...
  - stale/invalid: ...
  - parked/accepted-risk: ...
  - remaining independent: ...
- Product evidence: <PR/commit/contract links or “no Product mutation”>
- Regression witness: <what protects the result>
- Live evidence: required + obtained / not required / not claimed
- Detailed evidence: <optional link>
```

Do not copy every workflow run, later blob SHA or unrelated current HEAD into the entry.

---

## 2026-08-06 — AuditRepo operating-model reform initiated

- Scope: AuditRepo governance and documentation.
- Result:
  - defined AuditRepo as evidence memory rather than Product mirror;
  - replaced global-HEAD synchronization with event-driven current checks;
  - made evidence proportional by independent angles;
  - introduced optional work queue and system-theme map;
  - moved deep forensic toward periodic/manual execution;
  - preserved the existing matrix intact for gradual migration.
- Product evidence: no Product mutation and no finding disposition change.
- Regression witness: AuditRepo documentation/CI validation on the reform branch.
- Live evidence: not applicable.

This entry records the governance change only. It does not claim that the reform PR has merged until GitHub shows the final merge.

## 2026-08-06 — Strangler inventory verification wave

- Scope: `ST-STRANGLER`, historical `R-007` and `STRANGLER-HYGIENE` evidence family.
- Inputs: Product ownership manifest, committed public indexes, current legacy-shadow parity harness.
- Result:
  - verified-at-anchor: **52 public indexes = 51 Astro shadows / 4,026,027 bytes + 1 independent built app / 2,245,854 bytes; unowned 0**;
  - systemic-root: parity/reference authority is coupled to every committed Astro shadow;
  - invalidated approximation: the old `50/53` wording is not the exact inventory at this anchor;
  - remaining independent: storage/maintenance duplication remains, but current deletion-ready count is **0**;
  - owner exception: the Baptists 3D `_app` is explicit built-app ownership and is not a retirement candidate.
- Product evidence: PR #1082, merge `76737eefe16a0feb2fdf729c805d17b5cdcdc376`, exact tested head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`.
- Regression witness: dependency-free inventory self-test plus the existing Shared Files Guard integration; `legacy-shadow-wrapper-audit.js` remains unchanged.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-strangler-inventory-wave/REPORT.md`.

## 2026-08-06 — Bible corpus rights and provenance verification wave

- Scope: `ST-CONTENT-AUTHORITY` / `SEARCH-P2-07`.
- Inputs: current Product Bible owners plus Research PR #149 rights/provenance authority and machine ledger.
- Result:
  - verified candidate: exact CrossWire `RusSynodal` 1.9.1 is `CANDIDATE_ONLY` because institutional records identify `Public Domain`;
  - archive hold: official raw endpoint is known, but archive bytes, SHA-256, embedded configuration, book manifest and Product mapping were not obtained;
  - rejected shortcut: `RusSynodalLIO` is copyrighted and its CrossWire permission is not a general downstream licence;
  - rights hold: Cassian remains permission-controlled and cannot be expanded or republished from open-web copies;
  - remaining independent: exact acquisition, 66-book/versification mapping, verse-level comparison/import, complete per-record provenance and Product release evidence;
  - finding state: `SEARCH-P2-07` remains open; matrix arithmetic is unchanged.
- Product evidence: no Product mutation; evidence anchor `76737eefe16a0feb2fdf729c805d17b5cdcdc376`.
- Regression witness: Research `Repository authority integrity` run `31097491083` on exact head `be5354b92aa4ab1de6d9483c7b93740e2ff6ab34`; Research merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-bible-corpus-rights-wave/REPORT.md`.
