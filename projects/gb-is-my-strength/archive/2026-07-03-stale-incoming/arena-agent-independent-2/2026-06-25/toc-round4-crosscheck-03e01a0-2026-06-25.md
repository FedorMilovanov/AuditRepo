# Cross-check of TOC Round 4 new bugs — `03e01a0`

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/toc-round4-crosscheck-03e01a0.txt`
- Method: production-like dist, SW audit, source/data grep

## 1. Challenge NEW-TOC-1 / NEW-TOC-2 as production bugs

TOC Round 4 reports:

- `NEW-TOC-1`: `/css/site-layered.css` and `/js/site-modules.js` in SW precache = regression.
- `NEW-TOC-2`: `/pagefind/pagefind.js` missing = SW install failure.

These are not reproducible after the correct production-like sequence:

```bash
npm run strangler:build:production-like
npm run pagefind:build:dist
npm run sw:dist:audit:deploy-switch
```

Artifact witness:

```text
dist/css/site-layered.css exists
dist/js/site-modules.js exists
dist/pagefind/pagefind.js exists
✅ SW dist readiness audit passed
```

Recommended status:

- `NEW-TOC-1`: `false-positive-production-like-dist` / `wrong build-mode` unless the claim is explicitly about source-root-only checks before `copy-legacy-to-dist` and `pagefind:build:dist`.
- `NEW-TOC-2`: `false-positive-production-like-dist`; Pagefind must be checked after `pagefind:build:dist`, not immediately after Astro build.

## 2. Challenge NEW-TOC-5 as production stale-JS bug

TOC Round 4 says the 14 stale `floating-cluster-controller.js?v=efd81d3a` Astro source refs become stale JS in dist.

Production-like dist witness says otherwise:

```text
floating-cluster-controller.js?v=efd81d3a  0
floating-cluster-controller.js?v=58c2ea90 15
```

This is the same source-vs-production distinction as P0-10. The source literals are stale, but `astro-cache-bust-postbuild.js` rewrites production-like dist.

Recommended status: `source-layer debt`, not active production artifact bug.

## 3. Confirm NEW-TOC-3 — Gill Part1 duplicate TOC target

This one is real in production-like dist.

Evidence:

```text
dist/articles/dzhon-gill-chast-1-chelovek/index.html
href #sec-personal-credo: 2
id sec-personal-credo: 1
```

Two visible TOC entries target the same section anchor. It is not a broken anchor, but it is a semantic/navigation bug: the second item (“Личная духовность…”) scrolls to the same place as the first personal-credo section.

Recommended status: `confirmed-production-like-dist`, severity P2/P3 UX.

## 4. Reframe NEW-TOC-4 — not a visible TOC href, but a broken quiz/sourceRef anchor

TOC Round 4 says Gill Part3 TOC links to `#sec-wesley`. Current dist does **not** have a normal HTML `href="#sec-wesley"` link.

Evidence:

```text
href="#sec-wesley" html count: 0
id="sec-wesley" count: 0
json href refs missing ids: ['sec-wesley']
```

So the real residual is narrower: a JSON/SITE_CONFIG quiz/sourceRef href points at a missing anchor. This can still break “source” navigation from quiz feedback, but it is not a visible TOC broken link.

Recommended status: split/reword to `Gill Part3 quiz sourceRef #sec-wesley missing target`, likely P3/P2 depending on quiz prominence.

## 5. Challenge NEW-TOC-7 / NEW-TOC-8 data drift claims

### NEW-TOC-7 — Nagornaya `series.json` readTime null

Current source contradicts it:

```text
nagornaya readTimes: [16, 11, 12, 25, 25]
```

Recommended status: `false-positive-current` / stale report.

### NEW-TOC-8 — Baptisty spravochnik `series.json=27` vs `search-manifest=8`

Current `search-manifest.json` item for `/baptisty-rossii/spravochnik/` has no `readTime` key, not `8`.

Evidence:

```text
russian-baptism spravochnik series readTime: [27]
search spravochnik readTime: None
search keys: description, editor, featured, id, image, modifiedTime, priority, publishedTime, section, tags, title, type, url
```

Recommended status: reword if desired as “search-manifest missing readTime for Baptisty spravochnik while series.json has 27,” but the claimed `27 vs 8` conflict is false on current HEAD.

## 6. Summary recommendations

| Finding | My recommended status |
|---|---|
| NEW-TOC-1 | false-positive-production-like-dist / wrong build mode |
| NEW-TOC-2 | false-positive-production-like-dist / missing pagefind build step |
| NEW-TOC-3 | confirmed-production-like-dist, semantic duplicate TOC target |
| NEW-TOC-4 | reword: quiz/sourceRef missing anchor, not visible TOC href |
| NEW-TOC-5 | source-layer debt only; dist fixed by postbuild |
| NEW-TOC-7 | false-positive-current |
| NEW-TOC-8 | claimed 27 vs 8 false; possible “missing readTime” low-priority drift |
