# Intake — gb-is-my-strength — gpt-css-important-audit — 2026-07-14

## Agent
- **Name:** `gpt-css-important-audit` (external GPT auditor, research-only pass)
- **Date:** 2026-07-14
- **Source repo state:** `FedorMilovanov/gb-is-my-strength` @ `main`
- **Commit audited:** `bd8cb9a0b14d8a71a51317ec7b954607337b9e78` (report's stated HEAD)
- **Mode:** free-intake, report-only (исходный код проекта не менялся)

## Files in this folder
- `REPORT.md` — сырой отчёт GPT «Повторный аудит CSS и `!important`» (verbatim, не редактировать).
- `evidence/` — машиночитаемые witnesses верификатора (см. также reverify-док ниже).

## Scope of the report
Повторный аудит `!important`-контракта и CSS-грамматики на текущем `main`. Ключевые
заявления автора:
1. `css/site.css` = **210** `!important` → нарушает оба гейта (`css:layer:validate` ceiling 202,
   `audit-pro.js` ceiling 200); `validate:static-publication` детерминированно падает. → `P1-CSS-IMPORTANT-GATE-DRIFT`.
2. Пять невалидных/мёртвых CSS-фрагментов в `site.css` проходят brace-only валидатор.
3. Массовое удаление `!important` небезопасно (accessibility / load-order / inline / hotfix-слои).
4. Безопасное механическое снижение `!important` = **1** (дубль в `nagornaya-mobile-toc.css`, 135→134).
5. Матрица не синхронизирована с текущим HEAD (SSOT drift, P2); шапка `Deploy GREEN` не отражает CI.
6. `floating-cluster.css` — точный счётчик автор **не подтвердил** (raw-файл не получен целиком);
   `524` назван только настроенным ceiling.

## Notes for verifier
- **Confirmed (см. reverify 2026-07-14):** всё ядро отчёта подтверждено независимо на current HEAD —
  счётчики, оба ceiling, 5 грамматических дефектов, дубли, и **реальный** падающий CI-лог деплоя
  (`css:layer:validate` → «!important count 210 exceeds ceiling 202», exit 1).
- **Verifier added (не было в отчёте):**
  - точный счётчик `floating-cluster.css` = **503** (автор оставил неподтверждённым);
  - root-cause коммиты регрессии 200→210: `26266ee` (+8) и `e904670` (+2), 2026-07-13, «Нагорная
    проповедь» — это **реальные WCAG-фиксы контраста/reduced-motion**, а не случайный долг;
  - **второй** deploy-blocker: `js/nagornaya-bar-extras.js` не в `ALLOWED_JS` (audit-pro «Forbidden JS»)
    + не в `cache-bust-assets.js` (грузится как `?v=1`) — latent за CSS-гейтом;
  - **третий, независимый от CSS** deploy-blocker: workflow «Metadata & IndexNow Readiness» падает на
    5 отсутствующих записях в `data/editorial-metadata.json` (Gill Ч.4 + 4 статьи серии «Сердце»);
  - 4-й красный workflow — «Visual Parity Guard — pixel-diff»;
  - SSOT drift сильнее, чем в отчёте: `b8459bdf` (source HEAD матрицы) **не существует как git-объект**;
    «Deploy GREEN @ b8459bdf run 29065454930» ссылается на несуществующий SHA — прод фактически КРАСНЫЙ.
- **Not confirmed / left honest:** первопричина падения `Visual Parity` (лог-хвост не показал корень);
  авторский замысел повреждённого backlinks-селектора и потерянных accessibility-деклараций (восстанавливать по git history, не по догадке).
- Каноника обновлена: `verified/MASTER_BUG_MATRIX.md` + `NEXT_AGENT_PROMPT.md`.
  Полное evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_bd8cb9a0_css-important-gate-drift.md`,
  синтез: `working/VERIFIER_SYNTHESIS_2026-07-14_css-important-gate-drift.md`.
