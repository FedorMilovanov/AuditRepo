# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `0ff04232ee08a8f81711db640395901124aca787`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_0ff04232_source-vs-production.md`
**AuditRepo synchronization:** authority-only projection; bug rows and counters are unchanged.

## 1. Точная граница source

- current source `main` = `0ff04232ee08a8f81711db640395901124aca787`;
- после канонического `2f9ad5d89143fd45be1b882219eadfc89bfbdbae` в source ancestry находятся:
  - PR #675 / `0131f8b9d6c717f85a8990700b72b09b575219a4` — homepage discovery metadata parity; exact head `404db8d14087d29522e56f190717d6224e8e3bfb`, 9/9 workflows green;
  - PR #672 / `eb129d3e122b8932216232319f4e735e6866d941` — approval-gated Editorial Metadata v3; exact head `7de20ed77e60ec05bb91322ac03800a3d9860410`, 9/9 workflows green;
  - PR #678 / `af60f833c70c4a74e0add987dc7a3a568b676589` — Nagornaya dark body surfaces; exact head `dcf9a7f9424034285c4d0be28729bb52b7106490`, 8/8 workflows green;
  - PR #683 / `d93039866d721ff0b1ead08c8b7bccc0eb2b8b1b` — glossary dictionary trust boundary; exact head `92e12ac4fa7edb516ffd7e178b54c60ce8534046`, 17/17 workflows green;
  - PR #688 / `0ff04232ee08a8f81711db640395901124aca787` — Workflow Policy v2; exact head `fff6155b651620b5e497585948d3b2a9fae5cd67`, 4/4 triggered workflows green;
- source issue #64 closed through PR #688;
- active source owners at capture: #669 Karty inventory, #680 NoteRegistry, #691 canonical article headline; do not duplicate or modify their branches/files;
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
current source = 0ff04232ee08a8f81711db640395901124aca787
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

## 3. Следующий порядок

1. Не продвигать `0ff04232` в production authority без exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Не вмешиваться в активные owner-lanes #669/#680/#691; использовать их exact heads и review boundaries.
3. После освобождения зависимых scope следующий свободный фундамент — source issue #62 Legacy Reference Quarantine.
4. После NoteRegistry продолжать единый ReaderProjection; не добавлять route-local note/TTS/search/print engines.
5. Строка `WORKFLOW-POLICY-SHADOW-ERA` и матричные счётчики остаются verifier-owned; authority-only синхронизация не переписывает bug rows.
