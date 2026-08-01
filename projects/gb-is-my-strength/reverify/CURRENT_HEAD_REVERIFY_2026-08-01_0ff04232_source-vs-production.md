# CURRENT HEAD REVERIFY — source `0ff04232` vs production `abf1edba`

**Дата:** 2026-08-01
**Статус:** `SOURCE_CURRENT / PRODUCTION_STALE_RELATIVE_TO_SOURCE`
**Production claim для `0ff04232`:** `no`
**AuditRepo synchronization PR:** `#116`

## 1. Authority boundary

- Current source `main`: `0ff04232ee08a8f81711db640395901124aca787`.
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`.
- Эти SHA **не совпадают**. Текущий source нельзя называть production без нового same-SHA witness.
- AuditRepo canonical authority до этой синхронизации оставалась на `2f9ad5d89143fd45be1b882219eadfc89bfbdbae`; PR #115 был evidence-only и не менял эту границу.
- Active source owners at capture: #669, #680 and #691. Эта синхронизация не изменяет их ветки, PR, checks или файлы.

## 2. Source ancestry после `2f9ad5d8`

- PR #675 — homepage discovery metadata parity; merge `0131f8b9d6c717f85a8990700b72b09b575219a4`, exact head `404db8d14087d29522e56f190717d6224e8e3bfb`, 9/9 triggered workflows green.
- PR #672 — Editorial Metadata v3; merge `eb129d3e122b8932216232319f4e735e6866d941`, exact head `7de20ed77e60ec05bb91322ac03800a3d9860410`, 9/9 triggered workflows green.
- PR #678 — Nagornaya dark body surfaces; merge `af60f833c70c4a74e0add987dc7a3a568b676589`, exact head `dcf9a7f9424034285c4d0be28729bb52b7106490`, 8/8 triggered workflows green.
- PR #683 — glossary dictionary trust boundary; merge `d93039866d721ff0b1ead08c8b7bccc0eb2b8b1b`, exact head `92e12ac4fa7edb516ffd7e178b54c60ce8534046`, 17/17 triggered workflows green.
- PR #688 — Workflow Policy v2; merge/current source `0ff04232ee08a8f81711db640395901124aca787`, exact head `fff6155b651620b5e497585948d3b2a9fae5cd67`.

Exact PR #688 evidence:

- Metadata & IndexNow Readiness run `30681815950` — success;
- Shared Files Guard run `30681815958` — success, including Workflow Policy v2 and actionlint;
- Node Toolchain Contract run `30681815957` — success, including read-only validation proof;
- TTS Download Consent run `30681815981` — success, including source/mutation contract and real-route Chromium matrix;
- review threads: `0`;
- merge guarded by expected head SHA `fff6155b651620b5e497585948d3b2a9fae5cd67`.

Workflow Policy v2 removes route-name ownership from active workflow policy, derives production route presence from `migration/page-ownership.json`, proves validation leaves tracked source clean, and isolates explicit same-repository label-gated autofix capabilities from ordinary read-only checks. Source issue #64 is closed.

## 3. Last exact production witness

The last admitted exact source/release/control/live authority remains:

- release/control SHA: `abf1edba190280e554dfda085bef9fb6594c896d`;
- deploy run: `30669840189`, attempt `1`;
- candidate identity: `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- release digest: `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612`: `sha256:c7ddd49753c2a6f7c93b4962cce372a1be99d6f7871e76db6d6b9de12f4c3159`;
- generic live artifact `8808666936`: `sha256:28333e7d19ebc51641f00ca086e8d77d2a92880ee546161f78a8e4d034957f10`;
- TTS live artifact `8808667707`: `sha256:7b8354caca07d12e682243c22487afe189413dbd5a0fbe36235c55395089aa54`;
- release ledger comment: `5148074092`;
- physical Windows witness: `5148209495`.

Этот immutable witness остаётся действительным для `abf1edba`, но не переносится на более новый source по наследованию.

## 4. Decision

```text
current source = 0ff04232ee08a8f81711db640395901124aca787
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

Для продвижения production authority требуется новый same-SHA путь:

1. exact-source readiness;
2. candidate identity and digest;
3. privileged Pages promotion тех же bytes;
4. generic live verification;
5. TTS capability verification;
6. immutable manifest/current-pointer readback;
7. downstream release ledger evidence.

## 5. Canonical synchronization boundary

Эта синхронизация:

- обновляет current source/production boundary в `NEXT_AGENT_PROMPT`, мастхеде/статистической подписи/session log матрицы и этом reverify;
- не меняет open/closed/severity bug rows;
- не меняет счётчики: 164 closed / 192 open;
- не заявляет production для текущего source;
- не изменяет Research, Google Drive, source branches, active PRs или release evidence.

Отдельный verifier может disposition-нуть матричную строку `WORKFLOW-POLICY-SHADOW-ERA` после проверки merge `0ff04232`; authority-only lane не повышает source CI до bug-row closure автоматически.
