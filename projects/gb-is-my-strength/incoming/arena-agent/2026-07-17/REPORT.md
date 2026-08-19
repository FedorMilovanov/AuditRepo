# Independent audit pass — gb-is-my-strength

## Intake identity

- Agent: `arena-agent`
- Local audit date: `2026-07-17`
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product anchor observed from GitHub `main`: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Product ZIP SHA-256: `2d4111a249c44f8b810d7b2c522c80a635f8fe055dac14df18c5153b2001223b`
- Environment: Linux sandbox, Node `v22.17.0`, npm `10.9.2`, Python `3.12.13`
- AuditRepo snapshot structure check before intake: `PASS`

> The remote Product/AuditRepo metadata identifies this anchor as `2026-08-19`, later than the local audit clock supplied to this agent. This report preserves both facts rather than rewriting either timestamp.

## Pre-flight and overlap

At the start of the pass, GitHub exposed two open Product PRs:

- `#1722` — `fix(ci): wire aggregate engine contracts into PR guard`, head `475a8f210529b6cdadd0f1dc97d8d4666e7a56e3`;
- `#1721` — `fix(audit): admit Astro CSS in dist parity guard`, head `d4264572e6e4a0d25667f6dc9babe1de42755d9c`.

Neither title names `scripts/check-data-consistency.js` or search-manifest image resolution. PR `#1722` is nevertheless adjacent CI/guard work and must be re-inspected at exact head before any Product mutation.

The active AuditRepo MASTER was read before this pass. No current row or current intake located by exact mechanism/text search names `search-item-image-missing` or the `public/` asset-resolution mismatch documented below.

---

## Confirmed current finding

### `DATA-CONSISTENCY-PUBLIC-ASSET-RESOLUTION`

**Disposition:** current deterministic validation defect; candidate for verification/promotion, not directly inserted into MASTER by this raw pass.

**Impact:** the repository's required publication validation is red even though all six reported image assets are committed and publicly served. This creates a false release/CI blocker and trains operators to distrust or bypass a required gate.

### W1 — direct command witness

At exact source anchor, with a clean dependency install:

```text
$ npm run data:consistency

GB DATA CONSISTENCY AUDIT
❌ 6 issue(s) { 'search-item-image-missing': 6 }
- .../angely-pod-mrakom...: /images/articles/genesis6/07-angels-kept-under-darkness.webp
- .../blagovestie-mertvym...: /images/articles/genesis6/09-gospel-preached-to-the-dead.webp
- .../duhi-v-temnice...: /images/articles/genesis6/08-spirits-in-prison.webp
- .../enoh-prorochestvoval...: /images/articles/genesis6/06-enoch-prophesied-and-apostolic-witness.webp
- .../kniga-enoha-kotoroy-ne-bylo...: /images/articles/genesis6/03-what-is-first-enoch.webp
- .../mozhno-li-doveryat-1-enohu...: /images/articles/genesis6/04-book-of-watchers.webp
```

Exit code: `1`.

### W2 — source/mechanism witness

`scripts/check-data-consistency.js:116-118` validates a local image this way:

```js
if (item.image && isLocalImage(item.image) && !exists(item.image.replace(/^\//, ''))) {
  fail('search-item-image-missing', `${item.url}: ${item.image}`);
}
```

`exists(rel)` resolves only from repository `ROOT`. The six search-manifest URLs intentionally map to Astro public assets under:

```text
public/images/articles/genesis6/*.webp
```

They do not exist under legacy root `images/articles/genesis6/`. The checker therefore understands only the legacy root owner and rejects valid Astro `public/` ownership.

Example authority chain:

- `data/search-manifest.json:1380` → `/images/articles/genesis6/07-angels-kept-under-darkness.webp`;
- committed file → `public/images/articles/genesis6/07-angels-kept-under-darkness.webp`;
- source series owner → `src/components/article-pilots/_shared/series/genesis6SeriesData.ts:68`.

All six alleged missing names were found under `public/images/articles/genesis6/` in the anchored source snapshot.

### W3 — live/artifact witness

A direct `HEAD` request to every alleged missing public URL returned `200 image/webp`:

| Asset | HTTP | Content-Length |
|---|---:|---:|
| `07-angels-kept-under-darkness.webp` | 200 | 35434 |
| `09-gospel-preached-to-the-dead.webp` | 200 | 30694 |
| `08-spirits-in-prison.webp` | 200 | 29836 |
| `06-enoch-prophesied-and-apostolic-witness.webp` | 200 | 43360 |
| `03-what-is-first-enoch.webp` | 200 | 45888 |
| `04-book-of-watchers.webp` | 200 | 47504 |

Base URL for each row: `https://gospod-bog.ru/images/articles/genesis6/<asset>`.

This disproves the checker's `missing` conclusion while confirming the production URL contract.

### W4 — lifecycle / required-gate witness

The command is not an optional local helper:

- `package.json` wires `npm run data:consistency` into `validate:static-publication`;
- `.github/workflows/deploy.yml:101` runs `npm run validate:static-publication`;
- `.github/workflows/deploy-candidate-contract.yml:82` runs the same required aggregate;
- `.github/workflows/dist-dry-run.yml:35` runs `npm run ci:check`, which also includes `validate:static-publication`.

Thus the false negative occupies deploy, candidate-contract and dry-run validation topology.

### Root cause and bounded repair lane

The root is not six missing files and must not be repaired by duplicating those assets into legacy root. The checker has an incomplete source-of-truth resolver: it validates URL paths against repository root only and does not admit Astro's `public/` URL projection.

A bounded repair should update the data-consistency asset resolver to accept the declared publication owners (at minimum current root and `public/`), then add both positive and negative fixtures so an actually missing file still fails. Re-run the direct command and the required aggregate. Recheck PR `#1722` immediately before mutation because it is adjacent guard-topology work.

### Confidence

High for the local deterministic defect and mechanism: direct failing command + source owner + six committed files + six live responses + required workflow wiring.

Remote GitHub run status was not used as a witness because the unauthenticated Actions UI did not expose a sufficiently precise run/log mapping for this exact command at this exact anchor.

---

## Non-findings / environment limitations

1. `npm run workflows:check` threw while trying to read `.gitattributes` through Git file enumeration. The source was obtained as a GitHub ZIP because `git` is unavailable in this sandbox; the extracted tree has no `.git` metadata. This result is environment-induced and is **not** admitted as a Product finding.
2. `npm run engine:contracts` similarly emitted a Git/module-graph ownership failure in the ZIP environment. It is not admitted without a real Git checkout witness.
3. `npm run validate` and `npm run validate:seo` passed with zero errors (two pre-existing non-blocking warnings).
4. Production dependency audit returned zero known vulnerabilities.
5. A literal internal route/asset scan found no unresolved normal source URL after accounting for the generated Atlas runtime owner.

## Suggested verification next step

A second agent should reproduce `npm run data:consistency` from a real Git checkout of `cb3681e`, inspect the exact current heads/files of PRs `#1721` and `#1722`, and verify a negative fixture. If unchanged and unowned, promote one compact work unit rather than six symptom rows.
