# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Exact production authority:** ✅ `abf1edba190280e554dfda085bef9fb6594c896d`
**Current source deployment status:** ✅ source, release candidate, live pointer и TTS authority сходятся на одном SHA.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_abf1edba_exact-production-windows-astro-closure.md`
**AuditRepo synchronization PR:** `#110`

## 1. Точная граница

- source PR #643 влит как `abf1edba190280e554dfda085bef9fb6594c896d`;
- Astro `7.1.6` / native Sätteri `0.3.5`;
- `astro:dev/check/build/preview` используют постоянный Windows/Linux launcher `scripts/astro-cli.mjs`, без `cross-env`;
- Gill six-surface gate, sitemap-image SEO и книжная витрина «Баптисты России» сохранены;
- Node/npm: `22.23.1` / `10.9.8`;
- exact PR head `12f6d54e` прошёл 8/8 обязательных workflow;
- физический Windows witness: source comment `5148209495` — `npm ci`, 82-page build, 918 legacy files, drift 0, Baptist audit 16/16, clean tree.

## 2. Exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `abf1edba190280e554dfda085bef9fb6594c896d`;
- candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- files / bytes `1152` / `81177351`;
- immutable path `/deployments/abf1edba190280e554dfda085bef9fb6594c896d/30669840189-1.json`;
- candidate artifact `8808656612` / `sha256:c7ddd49753c2a6f7c93b4962cce372a1be99d6f7871e76db6d6b9de12f4c3159`;
- generic live `8808666936` / `sha256:28333e7d19ebc51641f00ca086e8d77d2a92880ee546161f78a8e4d034957f10`;
- TTS `8808667707` / `sha256:7b8354caca07d12e682243c22487afe189413dbd5a0fbe36235c55395089aa54`;
- release ledger comment `5148074092`.

```text
source = release = control plane = current pointer = immutable manifest
generic live PASS = TTS live PASS
```

## 3. Следующий порядок

1. Сохранять `abf1edba190280e554dfda085bef9fb6594c896d` как current exact source+production authority.
2. После следующего source merge требовать новый same-SHA deployment witness.
3. Не запускать устаревшие `Finalize-AuditRepo109.ps1` и workflow PR #109.
4. Не возвращать старый `cross-env` autostash и не менять матричные счётчики.
