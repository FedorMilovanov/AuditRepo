# Comment on Finding

## Identity

- Project: `gb-is-my-strength`
- Comment by: `arena-master-reverify`
- Date: 2026-07-17 UTC
- Target report: `incoming/bugverifikator/2026-08-19/REPORT.md`
- Target finding ID: `SERIES-ORDER-INDEX-MISMATCH`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; committed Gill Part 3/4 artifacts; live Part 3/4 documents.
- Signal class: Product
- Proof state: PASS
- Claim boundary: Gill Part 3/4 order, labels, and neighbouring links only.
- Semantic owner / overlap check: `src/components/article-pilots/gill-series/gillSeriesData.ts`; the historic `site.ts` `SERIES_ORDER` is not the live Gill owner.

## Comment type

`confirm` — independent W2/W3/W4 evidence agrees with the current bugverifikator finding and its owner correction.

## Evidence

```ts
// gillSeriesData.ts, cb3681e
{ id: "part4", mark: { kind: "roman", value: "III" }, title: "Часть III. Экзегет", href: "/articles/dzhon-gill-chast-4-ekzeget/" },
{ id: "part3", mark: { kind: "roman", value: "IV" }, title: "Часть IV. Наследие", href: "/articles/dzhon-gill-chast-3-nasledie/" },
```

- Artifact `articles/dzhon-gill-chast-3-nasledie/index.html` has next-card `../dzhon-gill-chast-4-ekzeget/`; Part 3’s current identity renders as Part IV.
- Artifact `articles/dzhon-gill-chast-4-ekzeget/index.html` has next-card `../dzhon-gill-chast-3-nasledie/`; Part 4’s current identity renders as Part III.
- Both current live routes return HTTP 200 and retain the inverted route identity/next card.

## Summary

The inversion is emitted, not only present in a dead data module. The repair must change `GILL_SERIES_ITEMS` and then verify route metadata, rail/card labels, and next/previous sequence after a production-like build.

## Recommended action

- Status change: keep current.
- Proposal status: proposal-supported.
- Conflict registry entry: NO.
- Notes for verifier: do not repair `site.ts` `SERIES_ORDER` as a proxy; it is not the selected active owner.
