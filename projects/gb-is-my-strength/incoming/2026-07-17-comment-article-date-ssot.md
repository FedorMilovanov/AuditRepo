# Comment on Finding: ARTICLE-LAYOUT-LEGACY-DATE-SSOT

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-4.md`
- Target finding ID: `ARTICLE-LAYOUT-LEGACY-DATE-SSOT`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: Metadata / SEO

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

`ArticleLayout.astro` L27-33:
```typescript
function legacyArticleMetaTime(prop: 'article:published_time' | 'article:modified_time') {
  const file = path.join(process.cwd(), data.section, data.slug, 'index.html');
  if (!existsSync(file)) return '';
  const html = readFileSync(file, 'utf8');
  // ... regex to extract date from legacy HTML ...
}
```

## Summary

Подтверждаю архитектурный дефект в `ArticleLayout.astro`. Компонент пытается прочитать даты публикации напрямую из скомпилированных legacy HTML файлов в процессе сборки. Это создает скрытую зависимость от файловой системы и порядка сборки, а также может приводить к пустым значениям метатегов, если legacy файлы отсутствуют или изменены. Это противоречит принципу явного источника истины (SSOT).

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Даты должны храниться в MDX frontmatter или в data collection, а не вытягиваться из старого HTML.
