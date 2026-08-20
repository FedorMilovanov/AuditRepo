# the-legendary-poet

- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Production URL: https://thelegendarypoet.ru
- AuditRepo status: `audit-complete-at-anchor / repair-pending`
- Start here: [`DOC_MAP.md`](DOC_MAP.md)

## Purpose

Эта папка хранит долговременные audit evidence, системные причины, verification waves, исторические dispositions и owner decisions для The Legendary Poet.

Она не является зеркалом текущего source HEAD, списка веток, CI run IDs или deploy-состояния. Актуальный код, PR, branches и runtime truth проверяются непосредственно в source-репозитории перед новой работой.

## Durable synthesis

- Current autonomous audit marathon закрыт как `AUDIT-COMPLETE-AT-ANCHOR` на Product `main` `d59cceccb0c49af59b1be38d4c547a6240b3005a`; исходные 30 verified Product roots были repair-pending, а не falsely closed. См. [`verification/2026-08-12-audit-marathon-closeout/REPORT.md`](verification/2026-08-12-audit-marathon-closeout/REPORT.md).
- Community reconciliation wave 2026-08-20 закрыла шесть source/runtime roots через Product #422: delivery, loaded-row ordering, community accessibility status semantics, read-state truth, target-keyed editor state и comment text fidelity. Exact certified head `fdcff48d1d75a3e645fb13b90e22592e4ccf090e` прошёл repository gate и Browser QA 4/4; squash merge на Product `main` — `ccd5f4c614de9a2e1fd5e4d6de62dd138630ae5c`. См. [`verification/2026-08-20-community-reconciliation-closure/REPORT.md`](verification/2026-08-20-community-reconciliation-closure/REPORT.md).
- W0–W7 системные архитектурные и runtime-линии закрыты на своих точных evidence anchors.
- W6 physical ref retirement завершён; намеренно сохранён только forensic/research archive ref.
- На current source остаются активные engineering roots в production community abuse activation, theme/runtime accessibility/contrast/motion/status, discovery metadata, semantic reader text/progress, authoring release contract, audit harness, audio session/release/completion integrity, analytics consent/route state, rating source/method/URL authority, production legacy-route hosting, primary/secondary data containment, global search authority, Home initial-media delivery и persistent shell visual ownership. Их единственная рабочая очередь — [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md). Текущий счётчик: **24 rows — 1 P1 + 16 P2 + 7 P3**.
- Community source/runtime lane #422 merged. Остальные current roots не считаются выбранными в одну общую implementation lane без отдельного ownership; AuditRepo фиксирует evidence/root causes и не создаёт параллельную implementation authority сам по себе.
- Community source теперь использует trusted Cloudflare Worker/D1 authority boundary; production secret values, D1 schema state, Turnstile configuration, Worker activation и live adversarial behavior остаются отдельной evidence boundary. Поэтому `TLP-COMM-ABUSE-001` остаётся P1 до прямого live proof.
- Negative evidence закреплено: Breadcrumb current semantics, shared image-lightbox dialog ownership, community form labels/help, RatingStars keyboard radiogroup semantics, inspected external-link hygiene and React-escaped comment text are not current roots; sampled published essay images explicitly classify `kind`.
- Hall #369 terminally closed; frozen Hall safety/evidence остаётся исторической authority, но не текущей architecture lane.

## Navigation

- Документная карта и fact ownership: [`DOC_MAP.md`](DOC_MAP.md)
- **Текущие verified engineering bugs:** [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md)
- Возможные, но необязательные направления: [`WORK_QUEUE.md`](WORK_QUEUE.md)
- **Community reconciliation closure:** [`verification/2026-08-20-community-reconciliation-closure/REPORT.md`](verification/2026-08-20-community-reconciliation-closure/REPORT.md)
- **Audit marathon closeout:** [`verification/2026-08-12-audit-marathon-closeout/REPORT.md`](verification/2026-08-12-audit-marathon-closeout/REPORT.md)
- Last defect-producing current check before closeout: [`verification/2026-08-12-shell-noise-ownership-current/REPORT.md`](verification/2026-08-12-shell-noise-ownership-current/REPORT.md)
- Community comment text fidelity: [`verification/2026-08-12-community-comment-text-fidelity-current/REPORT.md`](verification/2026-08-12-community-comment-text-fidelity-current/REPORT.md)
- Analytics consent control: [`verification/2026-08-12-analytics-consent-control-current/REPORT.md`](verification/2026-08-12-analytics-consent-control-current/REPORT.md)
- Form/security/non-text contrast: [`verification/2026-08-12-form-security-nontext-contrast-current/REPORT.md`](verification/2026-08-12-form-security-nontext-contrast-current/REPORT.md)
- Analytics query/pageview semantics: [`verification/2026-08-12-analytics-query-pageview-current/REPORT.md`](verification/2026-08-12-analytics-query-pageview-current/REPORT.md)
- Poets status messages: [`verification/2026-08-12-poets-status-message-current/REPORT.md`](verification/2026-08-12-poets-status-message-current/REPORT.md)
- Reader interaction / media-kind boundaries: [`verification/2026-08-12-reader-interaction-media-kind-current/REPORT.md`](verification/2026-08-12-reader-interaction-media-kind-current/REPORT.md)
- Reduced-motion CSS animation: [`verification/2026-08-12-reduced-motion-css-animation-current/REPORT.md`](verification/2026-08-12-reduced-motion-css-animation-current/REPORT.md)
- Authoring provenance / community SQL security: [`verification/2026-08-12-authoring-provenance-community-security-current/REPORT.md`](verification/2026-08-12-authoring-provenance-community-security-current/REPORT.md)
- SEO error / hydration parity: [`verification/2026-08-12-seo-error-hydration-parity-current/REPORT.md`](verification/2026-08-12-seo-error-hydration-parity-current/REPORT.md)
- Dark-theme contrast: [`verification/2026-08-12-dark-contrast-current/REPORT.md`](verification/2026-08-12-dark-contrast-current/REPORT.md)
- Home media / archive focus: [`verification/2026-08-12-home-media-archive-focus-current/REPORT.md`](verification/2026-08-12-home-media-archive-focus-current/REPORT.md)
- Audio completion semantics: [`verification/2026-08-12-audio-completion-semantics-current/REPORT.md`](verification/2026-08-12-audio-completion-semantics-current/REPORT.md)
- URL state / hash focus: [`verification/2026-08-12-urlstate-hash-focus-current/REPORT.md`](verification/2026-08-12-urlstate-hash-focus-current/REPORT.md)
- Rating method / reading progress: [`verification/2026-08-12-rating-method-reading-progress-current/REPORT.md`](verification/2026-08-12-rating-method-reading-progress-current/REPORT.md)
- Primary readiness / search authority: [`verification/2026-08-12-primary-readiness-search-authority-current/REPORT.md`](verification/2026-08-12-primary-readiness-search-authority-current/REPORT.md)
- Release / hosting / discovery: [`verification/2026-08-12-release-hosting-discovery-current/REPORT.md`](verification/2026-08-12-release-hosting-discovery-current/REPORT.md)
- Analytics route settlement: [`verification/2026-08-12-analytics-route-settlement-current/REPORT.md`](verification/2026-08-12-analytics-route-settlement-current/REPORT.md)
- Audio interaction accessibility: [`verification/2026-08-12-audio-interaction-a11y-current/REPORT.md`](verification/2026-08-12-audio-interaction-a11y-current/REPORT.md)
- Rating source / portrait provenance: [`verification/2026-08-12-rating-source-provenance-current/REPORT.md`](verification/2026-08-12-rating-source-provenance-current/REPORT.md)
- Browser state convergence: [`verification/2026-08-12-browser-state-convergence-current/REPORT.md`](verification/2026-08-12-browser-state-convergence-current/REPORT.md)
- Cross-surface runtime wave: [`verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md`](verification/2026-08-12-cross-surface-runtime-authority-current/REPORT.md)
- Community reconciliation/read-state: [`verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`](verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md)
- Системные темы: [`verified/SYSTEM_THEMES.md`](verified/SYSTEM_THEMES.md)
- Компактная история волн и закрытий: [`verified/CLOSURE_LEDGER.md`](verified/CLOSURE_LEDGER.md)
- Historical verified/reverify evidence: `verified/`, `verification/`, `reverify/`, `archive/`

## Historical-document rule

Старые документы могут содержать exact-current, `fixed-current`, active-barrier и global-HEAD формулировки прежней operating model. Они сохраняются как evidence at anchor и не должны использоваться как живой control plane без узкой перепроверки выбранной поверхности.

Новые волны следуют [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md): audit deeply, verify proportionately, fix at the useful level and close in the smallest honest form.
