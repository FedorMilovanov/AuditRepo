# AuditRepo

Центральный репозиторий для **мультиагентных аудитов, баг-репортов и верификационных прогонов**.

Идея:
- 5–10 агентов независимо прогоняют проект;
- каждый складывает свои отчёты в `incoming/`;
- сильный верификатор собирает сводную матрицу багов;
- после этого implementation-агент чинит уже **подтверждённые** баги.

---

## Структура

```
audit-repo/
├── README.md                      ← этот файл
├── PROJECT_REGISTRY.md            ← список проектов и статусы
├── scripts/
│   ├── auditrepo.py              ← intake scaffold + utilities
│   └── scaffold_intake.py        ← fallback если auditrepo.py недоступен
└── projects/
    ├── _templates/
    │   ├── AGENT_REPORT_TEMPLATE.md
    │   ├── VERIFIER_SYNTHESIS_TEMPLATE.md
    │   └── COMMENT_TEMPLATE.md
    └── <project>/
        README.md                  ← правила конкретного проекта
        incoming/                  ← сырые отчёты агентов (НЕ редактировать)
          <agent-name>/
            <YYYY-MM-DD>/
              README.md            ← meta: agent, SHA, mode, scope
              REPORT.md            ← универсальный отчёт (см. ниже)
              comments/            ← комментарии к чужим находкам
              proposals/           ← предложения status/severity/merge/repair-lane
              evidence/            ← доказательства (логи, скрины, grep output)
              artifacts/           ← патчи, сниппеты кода, trace output
        working/                   ← сводные промежуточные документы
        verified/                  ← финальные проверенные ledgers и repair orders
        verification/
          conflicts/               ← конфликты между агентами (C-01, C-02, ...)
```

---

## Freedom with Evidence

**Роли назначать не нужно.** Любой агент свободен делать полезную работу. Но свобода не превращается в хаос, потому что все действия проходят через многоуровневую верификацию.

### Any agent MAY

- найти и описать новый баг;
- прочитать отчёты других агентов;
- подтвердить чужой баг своим evidence;
- оспорить чужой баг (`challenge`);
- сказать «это stale на current HEAD»;
- сказать «это false positive»;
- предложить merge duplicates (объединить баги с общей root cause);
- предложить split одного большого бага на несколько;
- предложить severity raise / downgrade;
- предложить repair lane;
- предложить repair order;
- сделать recheck на current HEAD;
- оставить комментарии к любым находкам и ledger.

### Any agent MUST NOT

- редактировать чужой incoming report;
- удалять чужую находку;
- напрямую менять canonical status в verified ledger;
- чинить source repo из raw/suspected findings;
- объявлять repair-ready без current-head evidence;
- стирать конфликт вместо помещения его в `verification/conflicts/`.

**Все свободные действия — evidence-based. Утверждение без SHA и доказательства не попадает в canonical ledger.**

---

## Multi-Level Verification Ladder

Статус бага определяется не прихотью одного агента, а evidence threshold:

| Level | Status | Condition |
|-------|--------|-----------|
| **L0** | `raw` / `suspected` | Один агент нашёл. Не чинить. |
| **L1** | `peer-reviewed` | Второй агент оставил confirm / challenge / comment. |
| **L2** | `confirmed-on-sha` | 2 независимых подтверждения ИЛИ 1 прямое source/build/browser evidence. |
| **L3** | `confirmed-current` / `stale-on-current-head` / `fixed-current` / `needs-manual-check` | Сверили на актуальном HEAD source repo. |
| **L4** | `repair-ready` | confirmed-current + evidence + target SHA + route/file scope + repair lane + not-stale check. |

Только L4 → implementation-agent может чинить.

### Правила движения статусов

**Promote to `confirmed-current`:**
- 2 independent agents confirm on same/similar SHA, OR
- 1 agent gives direct source/build/browser evidence on current HEAD.

**Move to `disputed`:**
- Любой агент даёт конкретное contradictory evidence.

**Move to `stale` / `fixed-current`:**
- current HEAD check показывает, что баг не воспроизводится, ИЛИ source file изменился и original repro не применяется, ИЛИ 2 agents independently mark not reproducible on current HEAD.

**Move to `false-positive`:**
- Исходная finding основана на неверном grep / старом artifact / wrong route / wrong build. Verifier документирует why.

**Move to `repair-ready`:**
- status = confirmed-current + has evidence + has target/current SHA + has route/file scope + has repair lane + has not-stale check.

---

## Proposal Status Lifecycle

Любое предложение агента получает свой статус:

```
proposal-open → proposal-supported → proposal-accepted → (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded (новое предложение заменило)
```

Пример:
```
Agent A: "P0-2 empty CSS" — raw
Agent B: proposal false-positive — proposal-open
Agent C: confirms false-positive with current HEAD evidence — proposal-supported
Verifier: proposal-accepted → P0-2 moved to false-positive/fixed-current
```

---

## Universal REPORT.md Structure

Каждый агент пишет не только «новые баги», а **свободный рабочий пакет** секциями:

```md
# Agent Work Report

## Meta
- Project:
- Source repo:
- Agent:
- Date:
- Audited branch:
- Audited SHA:
- Current HEAD:
- Mode: free-intake

## 1. New Findings
### <temp-id>
- Title:
- Severity: P0/P1/P2/P3
- Route/files:
- Evidence: (command + output)
- Confidence: high/medium/low
- Suggested repair lane:

## 2. Confirmations of Existing Findings
### Confirm <target-id>
- Target report:
- Target finding:
- My evidence: (grep / screenshot / build output)
- Same bug / related / stronger root cause:
- Recommended status:

## 3. Challenges / Disputes
### Challenge <target-id>
- Target report:
- Target finding:
- Reason for challenge:
- Current HEAD evidence:
- Recommended status: disputed / stale-on-current-head / false-positive / downgrade

## 4. Duplicate / Merge Proposals
### Merge proposal
- Finding A:
- Finding B:
- Why same root cause:
- Canonical ID suggestion:

## 5. Severity Proposals
- Target bug:
- Current severity:
- Proposed severity:
- Evidence:

## 6. Repair Lane Suggestions
- Bug IDs:
- Lane:
- Why together:
- What must NOT be mixed:

## 7. Reverify Notes
- Bug:
- Current HEAD:
- Result: confirmed-current / stale / fixed / disputed
- Evidence:

## 8. Notes for Verifier
```

Один агент может одновременно: найти 3 новых бага, подтвердить 2 чужих, оспорить 1, предложить merge 4 дублей и предложить repair order. Это нормально.

---

## Comment Format (No Direct Edit)

Агент не редактирует чужой файл. Он создаёт свой комментарий:

```
projects/<project>/incoming/<agent>/<date>/comments/
  comment-on-<other-agent>-<finding-id>.md
```

Шаблон:

```md
# Comment on Finding

- Target report: incoming/<other-agent>/<date>/REPORT.md
- Target finding ID: <id>
- Comment type: confirm / challenge / stale / duplicate / severity-change / evidence-addition
- My audited SHA: <sha>
- Evidence: (command + output)
- Summary: <one paragraph>
- Recommended action: <status change / proposal / note for verifier>
```

---

## Conflict Registry

Если агенты расходятся — не решать сразу. Создавать:

```
projects/<project>/verification/conflicts/
  CONFLICT_REGISTRY_<date>.md
```

Формат записи:

```md
## C-07 — P0-2 floating-cluster.css empty vs not empty

- Agent A says: empty file
- Agent B says: current HEAD has 1869 lines / 68KB
- Evidence A:
- Evidence B:
- Current status: resolved / unresolved
- Resolution:
- Canonical action:
```

**Конфликт — это не провал. Это нормальный слой верификации.**

---

## SHA-First Principle

```
A bug without SHA is not repair-ready.
A bug without evidence is not confirmed.
A bug confirmed on old SHA must be reverified before implementation.
```

AuditRepo — это не source repo. Это слой координации и доказательств.

## Multi-witness principle

A strong bug should ideally have 2–3 witnesses from different angles:
- source witness
- artifact witness
- browser witness
- optional history/regression witness

See:
- `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`
- `CLEANUP_RETENTION_POLICY.md`

---

## Quick Start

### 1. Найди проект
```bash
cat PROJECT_REGISTRY.md
```

### 2. Создай intake
```bash
# Preferred (если scripts/auditrepo.py есть)
python3 scripts/auditrepo.py intake gb-is-my-strength --agent my-agent-name --date 2026-06-25

# Fallback
python3 scripts/scaffold_intake.py gb-is-my-strength my-agent-name 2026-06-25
```

Создаётся папка:
```
projects/gb-is-my-strength/incoming/my-agent-name/2026-06-25/
  README.md   ← meta: agent, SHA, mode, scope
  REPORT.md   ← универсальный отчёт (секции 1-8)
```

### 3. Работай свободно
- New findings → секция 1
- Confirmations → секция 2
- Challenges → секция 3
- Merge proposals → секция 4
- Severity proposals → секция 5
- Repair lane suggestions → секция 6
- Reverify notes → секция 7

### 4. Комментарии к чужим находкам
```bash
# НЕ редактируй чужой файл
# Создай свой comment в comments/
```

### 5. Предложения по статусу / severity
```bash
# Создай proposal в proposals/
```

### 6. Конфликты
```bash
# Если не согласен с чужим выводом — создай запись в verification/conflicts/
```

---

## Жёсткое правило

```
If a report is not inside projects/<project>/incoming/<agent>/<YYYY-MM-DD>/,
it is not an official audit input.
```

Отчёты вне project-scoped intake-папки — неофициальные. Игнорируются до нормального intake.

---

## Workflow Summary

| Phase | Agent | Writes to | Document |
|-------|-------|-----------|----------|
| Audit | any | `incoming/<agent>/<date>/REPORT.md` | секции 1-8 |
| Audit | any | `incoming/<agent>/<date>/comments/` | comment-on-*.md |
| Audit | any | `incoming/<agent>/<date>/proposals/` | proposal-*.md |
| Conflict | any | `verification/conflicts/` | CONFLICT_REGISTRY_*.md |
| Synthesis | verifier | `working/` | VERIFIER_SYNTHESIS_*.md |
| Canonical | verifier | `verified/` | UNIFIED_BUG_LEDGER_*.md, repair-order-*.md |
| Implementation | repair-agent | — | source repo (только verified/ + repair-ready) |

---

## Проекты

Сейчас активен:
- `projects/gb-is-my-strength/` — gospod-bog.ru (64 bugs, repair-ready)

Позже можно добавлять другие проекты тем же способом. (feat(auditrepo): add Governed Freedom Model — README, templates, scaffold)
