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

## 2026-08-06 — Search platform labels and Home footer closure

- Scope: `SEARCH-P3-01`, the repeated `HOME-P3-FOOTER-EDGE-CONSOLE` signal, and the obsolete predecessor transport recorded in Product PR #1074.
- Inputs: current Product command-palette owner, exact Chromium/WebKit browser evidence, Product control-plane policy and the Home responsive geometry contract.
- Result:
  - closed-by-fix: global Search triggers now expose exact `Ctrl+K` on Windows and `⌘+K` on Apple platforms through the existing `js/search.js` owner;
  - closed-by-fix: the Home footer has a real mobile viewport inset of at least 20 px, including safe-area insets, while the existing 17 px assertion remains unchanged;
  - absorbed-by-system-fix: duplicate Home/App platform-label helpers were removed in favour of the existing global owner;
  - rejected architecture: no separate global trigger-label runtime, no global `MutationObserver`, no Search writer inside the Glossary workflow and no surviving temporary write capability;
  - predecessor disposition: Product PR #1074 closed as superseded and its `autofix` label was removed; its branch was not deleted;
  - remaining independent: none for `SEARCH-P3-01` or the Home footer geometry signal.
- Product evidence: PR #1079, exact tested head `0bbeb51f93ae364d1f05721e7180e612d2b57f90`, merge `a55a03851506945ef61bb753efe58205d231a807`.
- Regression witness: all 25 exact-head pull-request workflows passed, including Search Modal, Shared Files Guard, Source Authority, Route Registry Chromium/WebKit surfaces, Runtime Interactive Audit, Home Chromium/WebKit interaction/lifecycle/A13 and Visual Parity policy.
- Live evidence: not required and not claimed.
- Detailed evidence: Product PR #1079 body and exact-head workflow evidence; no separate reverify document required.

## 2026-08-06 — AuditRepo maintenance backlog consolidation

- Scope: historical `AR-001`, `AR-004` and `AR-005` under the broader `ST-AUDIT-HARNESS` quality theme.
- Inputs: AuditRepo operating-model PR #196, validator/intake hardening PR #201 and the current proportional verification/reverify policy.
- Result:
  - closed-by-fix: `AR-001` — validator/scaffold hardening now blocks overwrite, traversal, invalid dates, placeholder anchors and template-only reports, with black-box regressions and same-PR concurrency cancellation;
  - absorbed-by-system-fix: `AR-004` — the useful verification goal is now owned by package waves, independent evidence angles, lightweight ordinary-PR checks and periodic/manual deep forensic rather than one mandatory protocol automator;
  - stale/retired: `AR-005` — blanket reverify automation is intentionally not a current invariant; narrow current checks and separate reverify documents are created only when selected evidence or risk justifies them;
  - remaining independent: `ST-AUDIT-HARNESS` stays active as a quality lens, and any future concrete false-green/false-red or evidence-integrity defect must be opened as its own bounded finding.
- Product evidence: no Product mutation; AuditRepo PR #196 merged as `1fd204f0f7c76ead6dc7ab22b2a7feb46c0fc297`, PR #201 merged as `a0e49cec76173911b9cb489173d7729e5617a8e1`.
- Regression witness: PR #201 exact head `e1a2b2f565888b92a256da8cfea5644874fe1e4f`; AuditRepo Validate run `31098233305` passed compilation, structure, repository rules, validator regressions, scaffold regressions and clean-tree checks.
- Live evidence: not applicable and not claimed.
- Detailed evidence: `../verification/2026-08-06-auditrepo-maintenance-consolidation/REPORT.md`.

## 2026-08-06 — Route-scoped TTS loading absorbed by the current reader architecture

- Scope: historical `R-006` under `ST-PERFORMANCE` and `ST-RUNTIME-OWNERSHIP`.
- Inputs: current Product reader owner, representative unrelated native routes, Vosk document/Worker boundary, permanent TTS contracts and Product PR #876 evidence.
- Result:
  - absorbed-by-system-fix: unrelated representative Home/strict-native app routes do not mount `ReaderActionsRuntime`;
  - intended inclusion: `/baptisty-rossii/` mounts the runtime because it exposes a real PLAY control and speakable article body;
  - lazy heavy boundary: a plain page open does not create the Worker or request the model; user playback selects system speech and only then warms Vosk in the background;
  - worker ownership: model download, integrity verification, extraction, IndexedDB, ONNX preparation and synthesis remain outside the document main thread;
  - no measured residual: no current evidence demonstrates user-visible or operational harm from the lightweight bootstrap on eligible reader pages;
  - remaining independent: `R-005` and any future concrete route/request regression with direct measurement.
- Product evidence: current anchor `a55a03851506945ef61bb753efe58205d231a807`; no Product mutation. System repair PR #876 merged as `0d60315d37efd5b47c76795f8167e99398a5b7e3`.
- Regression witness: PR #876 exact tested head `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e` proved 56 routes × desktop/mobile = 112/112, exactly one 280,394,098-byte model request, Worker reuse and a 32.7 ms maximum UI heartbeat gap; current consent contract rejects heavyweight document-client ownership and premature Worker-start regressions.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-r006-tts-loading-wave/REPORT.md`.
