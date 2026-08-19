# Comment on Finding: RODOSLOVIYE-OG-IMAGE

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-4.md`
- Target finding ID: `RODOSLOVIYE-OG-IMAGE`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: SEO / Metadata

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

```html
<!-- src/components/rodosloviye/RodosloviyePageHead.astro L27 -->
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />

<!-- src/components/karty/KartyPageHead.astro L21 -->
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
```

## Summary

Подтверждаю некорректное использование превью-изображения для страницы Родословия. Компонент `RodosloviyePageHead.astro` ссылается на `og-karty-1200x630.webp`, которое является специфичным для раздела Библейских Карт. Это вводит в заблуждение пользователей при шеринге ссылки в социальные сети.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Требуется создание уникального OG-изображения для страницы Родословия.
