# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `2f9ad5d89143fd45be1b882219eadfc89bfbdbae`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.  
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_2f9ad5d8_source-vs-production.md`  
**AuditRepo synchronization PR:** `#114`.

## 1. Точная граница source

- current source `main` = `2f9ad5d89143fd45be1b882219eadfc89bfbdbae`;
- после последнего exact production в source ancestry находятся:
  - bug-hunt repairs через `be970bfc13882119e99605ba1689605af4a4af8a`;
  - PR #659 / `65bf6c4a015c933aa3ec8d4046e587e58eabd568` — Atlas geometry verifier;
  - PR #665 / `8a8ebf70d1a1e51a4f57d3d38a7ef4a97ff65e5b` — Avraam heading lifecycle;
  - PR #666 / `424b09b25fc9d4bace3938f4d44f430be8cc7e4b` — Karty story-ID schema/runtime alignment;
  - PR #668 / `b4b02f72c26f5ac9c58ea9efe11cfcf4fa3d2c19` — README Astro 7 truth;
  - PR #667 / `2f9ad5d89143fd45be1b882219eadfc89bfbdbae` — Pagefind scripture/noindex/RSS contract, exact head `8eaf822bca32e1f7be332c2b323a2dba5ff60dd4`, 9/9 workflows green;
- AuditRepo PR #112 / `2ef6cf66a011c46086758fea67d5732e1ec292b9` сохраняет exact Karty evidence;
- на момент этой синхронизации открытых source PR нет;
- ни один post-`abf1edba` merge не считается production без отдельного same-SHA witness.

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
current source = 2f9ad5d89143fd45be1b882219eadfc89bfbdbae
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

## 3. Следующий порядок

1. Не продвигать `2f9ad5d8` в production authority без exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Не переоткрывать #659/#665/#666/#667/#668 по stale evidence; использовать exact-head отчёты и AuditRepo PR #112.
3. Следующий архитектурный порядок: source issue #56 → #62 → #64.
4. Не запускать устаревшие `Finalize-AuditRepo109.ps1` и workflow PR #109.
5. Не менять матричные счётчики в authority-only синхронизации.
