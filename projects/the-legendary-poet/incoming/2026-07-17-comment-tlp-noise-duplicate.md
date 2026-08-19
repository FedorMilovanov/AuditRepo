# Comment on Finding: TLP-SHELL-DUPLICATE-NOISE

## Identity
- Project: the-legendary-poet
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/the-legendary-poet/verification/2026-08-12-shell-noise-ownership-current/REPORT.md`
- Target finding ID: `TLP-SHELL-DUPLICATE-NOISE` (from report summary)
- Audited anchor (SHA): d59cceccb0c49af59b1be38d4c547a6240b3005a
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA d59ccec
- Semantic owner / overlap check: UI Shell / React Mount Logic

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

1. **Static (HTML)**: `index.html` содержит `<div class="noise-bg"></div>` вне `#root`.
2. **React (Astro/Poet Shell)**: `SiteLayout` повторно рендерит `<div className="noise-bg" />`.

## Summary

Подтверждаю дефект избыточного рендеринга слоев в `the-legendary-poet`. Наличие двух независимых фиксированных слоев шума (`.noise-bg`) с одинаковым `z-index` не только удваивает нагрузку на композитинг GPU (особенно критично на мобильных устройствах), но и искажает задуманный визуальный стиль, увеличивая итоговую непрозрачность шума в два раза. Отсутствие логики "усыновления" (adoption) статического элемента при маунте React-приложения является архитектурным упущением.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Статический элемент должен либо удаляться при старте JS-рантайма, либо React должен использовать `PoetShell` без повторного объявления этого слоя.
