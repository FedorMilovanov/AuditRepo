# Source and workflow topology witness

## Exact anchor

Product `main`: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`.

## Resolver mechanism

`scripts/check-data-consistency.js:116-118`:

```js
if (item.image && isLocalImage(item.image) && !exists(item.image.replace(/^\//, ''))) {
  fail('search-item-image-missing', `${item.url}: ${item.image}`);
}
```

`exists(rel)` resolves relative to repository `ROOT`. It does not try Astro `public/` or consult route/publication ownership.

Example chain:

- `data/search-manifest.json:1380` declares `/images/articles/genesis6/07-angels-kept-under-darkness.webp`;
- committed file is `public/images/articles/genesis6/07-angels-kept-under-darkness.webp`;
- series owner references the same URL projection from `src/components/article-pilots/_shared/series/genesis6SeriesData.ts:68`.

All six names in the error output exist under `public/images/articles/genesis6/`; none needs duplication into legacy root.

## Required topology

- `package.json`: `validate:static-publication` invokes `npm run data:consistency`.
- `.github/workflows/deploy.yml:101`: invokes `npm run validate:static-publication`.
- `.github/workflows/deploy-candidate-contract.yml:82`: invokes the same aggregate.
- `.github/workflows/dist-dry-run.yml:35`: invokes `npm run ci:check`, which includes the aggregate.

## Boundary

This proves required source topology, not the terminal state of a particular authenticated GitHub Actions run.
