# Comment on Finding

## Identity

- Project: gb-is-my-strength
- Comment by: arena-dx-ux-audit
- Date: 2026-10-06
- Target report: matrix row `GBS-BASELAYOUT-MISSING-SKIP-LINK` (MASTER_BUG_MATRIX.md, open table)
- Target finding ID: GBS-BASELAYOUT-MISSING-SKIP-LINK
- Evidence anchor: `68750830f4725213d80b833015520e5894699838` (fresh local production-like build)

## Comment type

stale / evidence-addition (candidate for closed-by-fix)

## Evidence angle

artifact + browser

## Evidence

```text
The row names exactly two emitted astro-shell routes (/hard-texts/genesis-6/ and /izbrannoe/), both then without a bypass link
and with a main element that had no target id. Measured now, at 1440 and at 390 on both routes:

/hard-texts/genesis-6/   main#main-content
   a.skip-link «Перейти к основному содержимому» href="#main-content"  (first Tab stop, top 12)
   Enter -> location.hash = "#main-content"; next Tab lands inside main (inMain=true)
   straight sequential trace at 1440: focus enters main at Tab #13 (the header owns the first 12 stops)
/izbrannoe/              main#main-content
   a.skip-link «Перейти к основному содержимому» href="#main-content"  (first Tab stop)
   Enter -> location.hash = "#main-content"; next Tab = «Перейти к статьям» (inMain=true)
   straight sequential trace at 1440: focus enters main at Tab #13

Negative control retained from this pass: /konfessii/ and /karty/ still ship without any bypass link (0 skip links in the DOM;
their first Tab stops are a back link and the three offscreen mobile-chrome controls respectively), and /journal/ still has
none — so the class is real elsewhere; it is the two routes named by this row that are repaired.
```

## Summary

Both routes named by the row now expose an effective keyboard bypass (`#main-content` target, visible-on-focus link as the
first Tab stop, Enter activates it and the next Tab enters the content). The row's stated remediation ("supply an effective
keyboard bypass and valid main target on both emitted routes") is satisfied at this anchor.

## Recommended classification or action

- Result: `closed-by-fix` candidate at `68750830` for the two routes the row enumerates
- Reason: the row's own success criteria are met in a browser witness on both named routes
- Notes for verifier: the row also instructs to "re-enumerate BaseLayout build outputs at repair time"; this pass did not do a
  full output census, so if the verifier wants the row to become a class-level guard rather than a two-route fix, the remaining
  work is the census plus the still-open routes (/konfessii/, /karty/, journal shell, and the separate
  `GBS-JOURNAL-MISSING-SKIP-LINK` row). Do not merge this closure with the mobile-chrome row: the three offscreen chrome stops
  are still present and are tracked separately.
