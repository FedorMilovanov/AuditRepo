# CURRENT HEAD REVERIFY — source `b4b02f72` vs production `abf1edba`

**Дата:** 2026-08-01  
**Статус:** `SOURCE_CURRENT / PRODUCTION_STALE_RELATIVE_TO_SOURCE`  
**Production claim для `b4b02f72`:** `no`

## 1. Authority boundary

- Current source `main`: `b4b02f72c26f5ac9c58ea9efe11cfcf4fa3d2c19`.
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`.
- Эти SHA **не совпадают**. Текущий source нельзя называть production без нового same-SHA witness.
- Открытый draft PR #667 не входит в current source truth и сохраняет независимого владельца.

## 2. Source ancestry после последнего exact production

Текущий source сохраняет immutable exact-head/source-CI evidence следующих изменений:

- bug-hunt repairs через `be970bfc13882119e99605ba1689605af4a4af8a`;
- PR #659 — Atlas geometry verifier, merge `65bf6c4a015c933aa3ec8d4046e587e58eabd568`;
- PR #665 — Avraam heading lifecycle, exact head `bc8794c545ae640e8cfdb3c5d09db1cc97883ad4`, merge `8a8ebf70d1a1e51a4f57d3d38a7ef4a97ff65e5b`, 8/8 triggered workflows green;
- PR #666 — Karty story-ID schema/runtime alignment, exact head `12aa744e10c05c134adc951f01cb5e78ef25de65`, merge `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`, all four applicable workflows green;
- PR #668 — active README architecture corrected from Astro 6 to Astro 7, exact head `a1d590869131fb6a94bc73ae613cabb41459117d`, merge/current source `b4b02f72c26f5ac9c58ea9efe11cfcf4fa3d2c19`, Shared Files Guard and Metadata & IndexNow green;
- AuditRepo PR #112 — exact Karty evidence intake, merge `2ef6cf66a011c46086758fea67d5732e1ec292b9`.

Superseded source PRs #661, #663 and #664 were closed without force-push, reset or content loss; their canonical diffs landed through #665/#666.

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
current source = b4b02f72c26f5ac9c58ea9efe11cfcf4fa3d2c19
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

До этого момента нельзя писать `SOURCE = PRODUCTION`, объявлять `b4b02f72` deployed или переносить старые live-доказательства на новый HEAD.

## 5. Canonical synchronization boundary

Эта синхронизация:

- обновляет только current source/production boundary, `NEXT_AGENT_PROMPT`, мастхед/статистическую подпись/session log матрицы и этот reverify;
- не меняет open/closed/severity rows;
- не меняет счётчики: 164 closed / 192 open;
- не включает draft PR #667 в source;
- не заявляет production для текущего source.
