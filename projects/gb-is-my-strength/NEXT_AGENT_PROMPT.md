# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_efaf2a51_source-vs-production.md`
**AuditRepo synchronization:** authority-only projection; canonical counters remain 165 closed / 191 open.

## 1. Точная граница source

- current source `main` = `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`;
- после канонического `0ff04232ee08a8f81711db640395901124aca787` в source ancestry находятся:
  - PR #691 / `c5ae325e5e73f1997112c395fd28f3a52f02ee96` — canonical article headline contract; exact head `6736bf988e3c4e69ffe4ffe90c4f987b12523674`, 14/14 triggered workflows green;
  - PR #669 / `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` — Karty audit count derived from governed route inventory; exact head `94748bb7e4ce7035a5687465200fb24676ac4249`, 8/8 triggered workflows green;
- Workflow Policy v2 remains merged at `0ff04232ee08a8f81711db640395901124aca787`; AuditRepo PR #117 moved `WORKFLOW-POLICY-SHADOW-ERA` to fixed and set counters to 165 closed / 191 open;
- active source owner at capture: #680 NoteRegistry; do not modify its branch or owner files;
- no post-`abf1edba` merge is production without a separate same-SHA witness.

## 2. Last exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `abf1edba190280e554dfda085bef9fb6594c896d`;
- candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- files / bytes `1152` / `81177351`;
- immutable path `/deployments/abf1edba190280e554dfda085bef9fb6594c896d/30669840189-1.json`;
- candidate artifact `8808656612` / `sha256:c7ddd49753c2a6f7c93b4962cce372a1be99d6f7871e76db6d6b9de12f4c3159`;
- generic live `8808666936` / `sha256:28333e7d19ebc51641f00ca086e8d77d2a92880ee546161f78a8e4d034957f10`;
- TTS `8808667707` / `sha256:7b8354caca07d12e682243c22487afe189413dbd5a0fbe36235c55395089aa54`;
- release ledger comment `5148074092`;
- physical Windows witness `5148209495`.

```text
current source = efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

## 3. Следующий порядок

1. Не продвигать `efaf2a51` в production authority без exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Не вмешиваться в active owner-lane #680; использовать его exact head, file boundary and CI evidence.
3. После освобождения зависимого scope следующий свободный фундамент — source issue #62 Legacy Reference Quarantine.
4. После NoteRegistry продолжать единый ReaderProjection; не добавлять route-local note/TTS/search/print engines.
5. `WORKFLOW-POLICY-SHADOW-ERA` закрыт; canonical counters = 165 closed / 191 open.
