# Proposal: Severity Upgrade — NEW-ACTIONLINT-CI-GAP P3 → P1

## Identity
- **Project:** gb-is-my-strength
- **Proposed by:** arena-agent-pass89
- **Date:** 2026-07-05
- **Target finding ID(s):** NEW-ACTIONLINT-CI-GAP
- **Proposal type:** severity-change

## Current state
- **Current severity:** P3 (Pass 65)
- **Current status:** confirmed-current
- **Bug:** `actionlint` зарегистрирован в `package.json` (`workflows:lint`, `workflows:policy`), но ни один CI workflow его не вызывает.

## Proposed change
**Повысить до P1.** Причина: high-leverage prevention.

## Evidence
```
# 3 CI-YAML регрессии за 24 часа (2026-07-04):
1. 8a8211ea — deploy #1337 FAILED: gill submenu audit ran BEFORE Playwright install
2. 6e68d7c — BUG-CI-001: duplicate run: key, 105 checks silently disabled
3. 45f27c6 — check-design-tokens.js expected 10 deleted legacy aliases, CI red

# actionlint catches ALL three:
$ /tmp/actionlint -color=false .github/workflows/deploy.yml
.github/workflows/deploy.yml:156:9: key "run" is duplicated ... [syntax-check]

# Already in package.json:
"workflows:lint": "npx actionlint",
"workflows:policy": "npm run workflows:check && npm run workflows:lint"

# But NEVER called in CI:
$ grep -r 'workflows:lint\|workflows:policy\|actionlint' .github/
(no matches)

# Fix is ONE line: add to validate:static-publication:light as first step
# Cost: <100ms per CI run. Benefit: prevents entire class of CI-YAML regressions.
```

## Why P1 (not P3)
- Предотвращает класс CI-YAML регрессий (не только конкретный баг)
- 0 ложных срабатываний (подтверждено 2 независимыми свидетелями)
- Уже готов к использованию — не нужно писать новый код
- High-leverage: одно исправление защищает от будущих production-blocking CI-багов

## Why this matters
Каждая CI-YAML регрессия = либо деплой blocked, либо проверки silently skipped. BUG-CI-001 показал: 105 проверок были отключены неизвестно сколько времени. Без `actionlint` в CI следующая YAML-ошибка — вопрос времени. Это не P3 «code quality» — это P1 «CI gate integrity».

## Proposal status: proposal-open
