# Comment on Finding

## Identity

- Project: gb-is-my-strength
- Comment by: arena-dx-ux-audit
- Date: 2026-10-06
- Target report: matrix row `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE` (MASTER_BUG_MATRIX.md, open table)
- Target finding ID: GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE
- Evidence anchor: `350848145ee252a4e6ad8b86c9c8e831e2b4cb12`

## Comment type

stale / evidence-addition

## Evidence angle

artifact (built dist of the exact SHA) + source

## Evidence

```text
grep -o '<time[^>]*>[^<]*</time>' dist/baptisty-rossii/<slug>/index.html   # all 10 routes

iniciativnaya-gruppa   <time datetime="2026-06-08T00:00:00+03:00">13 июня 2026</time>
podpolnaya-pechat      <time datetime="2026-06-09T00:00:00+03:00">13 июня 2026</time>
vsehib-1944            <time datetime="2026-06-07T00:00:00+03:00">13 июня 2026</time>
sovetskaya-noch        <time datetime="2026-06-06T00:00:00+03:00">13 июня 2026</time>
spravochnik            <time datetime="2026-06-14T00:00:00+03:00">14 июня 2026</time>   <-- now agrees
peterburgskaya-liniya  <time datetime="2026-06-04T00:00:00+03:00">4 июня 2026</time> <time datetime="2026-08-20T00:00:00+03:00">20 августа 2026</time>
dva-sezda-1884         <time datetime="2026-06-03T00:00:00+03:00">3 июня 2026</time>  <time datetime="2026-08-22T12:01:29.000Z">13 июня 2026</time>
goneniya-i-sovest      <time datetime="2026-06-05T00:00:00+03:00">5 июня 2026</time>  <time datetime="2026-08-22T13:32:07.000Z">13 июня 2026</time>
noch-na-kure           <time datetime="2026-06-01T00:00:00+03:00">1 июня 2026</time>  <time datetime="2026-08-22T10:21:51.000Z">13 июня 2026</time>
yuzhnaya-shtunda       <time datetime="2026-06-02T00:00:00+03:00">2 июня 2026</time>  <time datetime="2026-08-22T11:01:22.000Z">13 июня 2026</time>
```

## Summary

The residual is narrower than the row states. Four routes still render a single dateline whose visible label
«13 июня 2026» does not name the instant in that element's own `datetime` (June 8/9/7/6):
`iniciativnaya-gruppa`, `podpolnaya-pechat`, `vsehib-1944`, `sovetskaya-noch`.
`spravochnik` no longer belongs to the residual — label and `datetime` agree at `2026-06-14` (its earlier
"JSON-LD/registry says June 10" wording is also stale; the deployed history contains the Spravochnik reconciliation).
The five repaired routes keep the two-slot byline shape; in four of them the update slot's visible label «13 июня 2026»
sits on the modification instant `2026-08-22T…Z`, which the row's current exact-instant contract already covers.
No new row is opened for that shape in this pass.

## Recommended classification or action

- Result: narrow the row's route list 5 → 4 (`spravochnik` removed as fixed-current)
- Reason: artifact witness on an exact-SHA build; the fifth route's label/instant pair now agrees
- Notes for verifier: this is an artifact (built-dist) witness only — no live-host bytes were retrievable from the
  sandbox. Re-check on the live host before editing the row if the verifier's rules require a live witness for a narrowing.
