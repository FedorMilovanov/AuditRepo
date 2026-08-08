# Марафон — финальный снепшот 2026-08-08 09:50 UTC

## Git
- Branch: `arena/019fe0b5-auditrepo` (6 commits ahead of `main` @ `e50c4c9`)
- Commits:
  - `9e09aca` P0 trash (ZIP 7.4M + __pycache__ + 6 py + duplicate DEBT)
  - `f7f00c8` working/reverify archive (8 stale working + 15 reverify 2026-07-03/04 + prototype README)
  - `289d643` append phase 7-9
  - `a919ad4` doc sync + karta 8.4M + gill-mobile 516K
  - `7d1ad57` system deep dive verification 31st wave (15 active)
  - `92282f1` search+hall deep 32nd wave

## Размеры (du -sh)

| Проект | До | После | Δ |
|---|---|---:|---|
| gb/verification | 37M (atlas 34M) | 37M | 0 (keep) |
| gb/archive | 14M | 23M | +9M (moves from active) |
| gb/incoming | 27M (40 agents) | 17M (33 agents) | -10M (karta 8.4M + dedup 1.2M + ZIP) |
| gb/reverify | 816K (135) | 600K (105) | -216K (-30 files) |
| gb/working | 220K (22) | 184K (7 + audits) | -36K + cleaner |
| gb/references | 512K (11 MASTER_REPORT) | 460K (2) | -52K |
| gb/verified | 160K | 164K | +4K doc sync |
| gb/legacy | 88K | 88K | 0 ideal |
| TLP total | 676K | 676K | 0 clean |
| code-audit | 70K | 70K | 0 |
| ROOT ZIP | 7.4M tracked | 0 removed | -7.4M |

**Всего projects/gb:** 80M (was ~89M) — active surface -10M + archive +9M (net -1M but active -10M).

## Валидаторы

- `AUDITREPO VALIDATION: PASS`
- `matrix gb: 15 active ids, 0 closed, 15 open, evidence 347, historical 651, legacy 1340, registry 52, evidenceOnly 642 → PASS`
- `matrix tlp: 0 active ids → PASS`
- `structure: PASS`

## Легаси vs мусор — итог марафона

**Легаси идеален (keep 100%):**
- `gb/legacy` 88K 11 файлов — retirement maps + branch-forensics
- `gb/archive` 23M — 45 buckets, all searchable, incl. new `2026-08-08-stale-incoming-karty` 8.4M + `2026-07-13-canon-old` 516K + `2026-07-05-08-stale-reverify-delta` 132K + `2026-08-05-stale-audit-session-reports` 52K
- `tlp/archive` 120K — clean
- `verification/atlas` 34M — keep (visual witness)

**Мусор удалён/архивирован:**
- P0 7.7M immediate (ZIP + py + duplicate)
- P1 8 stale working + 29 reverify (270K) → archive
- P2a 8.4M karta incoming → archive (raw keep)
- P2b 516K gill-mobile HTML → archive

**Осталось (P2-P3 на следующий круг):**
- `incoming` 33 agents 17M — 6 search/gill/hermenevtika current, 27 older 2026-07-14 etc. could next archive wave
- `references/gb-ui-canon` PNG 8M — keep (distinct), no HTML duplicate left
- Doc sync done (MATRIX_ID model + CLOSURE ledger), TLP hall correctly outside MASTER

## System deep dive (verification waves 31-32)

- 31st wave `marathon-system-deep-dive` (107 lines): 15 active reverified at `11999f6d`
- 32nd wave `marathon-search-hall-deep` (75 lines): search P1-01/P1-02 + hall next H1/H2/H3
- No new MASTER row needed; all 15 have traceable evidence
- S-CLASS `DEEP_AUDIT_S-CLASS` already retired per `MATRIX_CLEANUP`

## Passes/forensics

- `passes/` 4 MD (gill-calibration etc.) — superseded by census 7020→8, keep historical
- `forensics/GENESIS6` — 41 refs moved to `main@4c7aaf7`, keep forensic

## Следующий виток

- Search S0 truthfulness fix (rename Писание tab) + S1 index generation — blocked by SEARCH-P2-07 decision but S0 could be bounded PR
- Strangler ledger Option B reclassify
- Manifest reconciler `alreadyInManifest` fix
- Reader census harness fresh-page

Марафон не останавливается — следующий файл: `verification/2026-08-08-marathon-...`
