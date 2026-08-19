# Comment on Finding: SECURITY-CSP-GAPS

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-6.md`
- Target finding ID: `SECURITY-CSP-GAPS`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Security
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: Security Policy / Article Layout

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

1. **CSP присутствует** в `src/components/home/HomePageHead.astro` и `src/components/biografii/BiografiiPageChrome.astro`.
2. **CSP отсутствует** в `src/layouts/ArticleLayout.astro` L1-100 (проверено grep по Content-Security-Policy).

## Summary

Подтверждаю критический пробел в безопасности. Статьи являются основным контентным слоем сайта, однако они не защищены политикой Content-Security-Policy, которая уже внедрена для главной страницы и раздела биографий. Это создает неравномерный периметр защиты и оставляет наиболее посещаемые страницы уязвимыми для XSS-атак в случае компрометации сторонних скриптов или инъекции в MDX-контент.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Рекомендуется вынести CSP в `BaseLayout.astro` или общий SEO-компонент, чтобы гарантировать покрытие всех маршрутов.
