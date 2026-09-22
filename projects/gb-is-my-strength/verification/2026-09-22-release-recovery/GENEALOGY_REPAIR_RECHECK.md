# Genealogy: confirmed identity defects and residual native crash

Observed 2026-09-22. This materially updates two existing work units; it does not
create another matrix or certify production recovery. Product source anchor:
`a8b82bb567cbafcf1d042e135ac3b214bf5f72a5`.

## Editorial admission and identities

The [original Hepher counterexample](EDITORIAL_PROOF_COUNTEREXAMPLE.md) remains
valid for original #2137 head `e4cd38a1501f1879221af1e4549ba2cf922230d3`.
Current main additionally contains two distinct-person identity collisions:

| Curated identity | Wrong current-main TIPNR identity | Reviewed identity and discriminator |
|---|---|---|
| Matthew's `joram` | `Joram@2Ki.1.17`, Ahab/Jezebel's son, king of Israel | `Jehoram@1Ki.22.50`, Jehoshaphat's son, king of Judah; Greek G2496; Matthew 1:8 |
| Matthew's `abihud_mt` | `Abihud@1Ch.8.3`, Bela's son, Benjaminite, H0031 | `Abiud@Mat.1.13`, Zerubbabel's descendant, G0010; Matthew 1:13 |

These were checked in the pinned source records, their parent fields, original
language identifiers, the curated v1 references, and Matthew 1's Synodal text.
An exact English name match did not establish the correct historical identity.
The bad mappings also appear in main's publishable projection; unlike Hepher's
raw-only candidate, these are current publication-data defects.

Pinned sources are the existing Product builder authorities:

- TIPNR SHA-256 `1a3b7d7df5cfa1e96eefa07dec92900bea278370c6788fadb5d036f3223b637c`,
  [STEPBible commit b86d26cd](https://github.com/STEPBible/STEPBible-Data/tree/b86d26cdb1f51729e73b5b4eb7f7ccadc5dfba39).
- Synodal JSON SHA-256 `ac900cd6675e524f728edcf965646bbd9cf791506a67e24e78bb8c7ff4d7c923`,
  [configured source](https://raw.githubusercontent.com/thiagobodruk/bible/master/json/ru_synodal.json).
  This URL is mutable; the digest fixes the source bytes.

The existing [Product #2137](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2137)
now has a meaningful repair checkpoint
`5738144817df5a50bee99dad177b679d0fab119a`, with current main merged without force.
It removes token-only automatic certification, adds a reviewed Хефер override,
corrects both identity exceptions and regenerates the projections. A missing
reviewed target must remain unmatched, never fall back to a namesake.

Local proof includes the real Hepher negative fixture, both identity/missing-target
fixtures, a mutation of committed corpus bytes rejected by the publication CLI,
nine negative annotation cases, publication/runtime parity, and a second full
pinned-source build leaving all 68 file hashes unchanged. Exact-head publication
safety, publishable projection and both triage workflows passed; the broader
candidate/browser checks are still required before admission.

Resulting counts: 3056 raw persons / 2053 raw edges; **2825 pending names**;
154 publishable persons / 181 relations; **42 reviewed / 139 pending relations**;
zero orphan annotations. The original 2825→1217 certification claim is superseded.
Forty Matthew annotations qualify explicit textual genealogy, including its
possible generation compression, not immediate biological paternity. Reviewed
Abraham–Isaac and genuinely pending Adam–Seth retain separate browser witnesses.
Raw data stays `phase1-draft`.

## WebKit: isolation was partial, not terminal closure

[Product #2139](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2139)
head `bd7c6c5d3e978432a9b9301dfae77d601e36f0a4` passed
[candidate 35776321022](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35776321022):
24 full browser/viewport cases, four reduced-motion cases, and five expected
touch-target mutation rejections. It was merged as the source anchor above.

Two independent subsequent jobs reproduced the residual failure:

- [resulting-main deploy](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35779615179/job/106921469383):
  legal-relations phase, WebKit 1920×1080;
- [#2140 candidate](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35779722471/job/106921840897):
  same phase, WebKit 430×932, head `db1ac84655c709c3cc7e00c0919fb9e841b6e5f8`.

Both fail after Joseph's inspector closes and the search moves to Jesus. New
diagnostics report `page-crash`, no page errors, `pageClosed: false`, and
`browserConnected: true`. A fresh process did not eliminate the failure.

Local controlled runs use Playwright 1.62.1 / WebKit 2336 (26.5), unchanged
`assertLegalRelationInteractions`, fresh browsers, and alternating 430×932 /
1920×1080. Each variant stops on its first unexpected failure; none retries to
obtain a pass. Diagnostic CSS changes are local, not release artifacts.

| Variant | Observation |
|---|---|
| Original renderer | Native page crash on trial 17, Jesus click |
| Remove only backdrop blur | Native page crash on trial 1; hypothesis rejected |
| Remove grayscale filter entirely | 30/30 passed; broader than necessary |
| Keep grayscale, remove only filter interpolation | 30/30 passed |
| Restore original renderer after controls | Native page crash on trial 3, Jesus click |

[Product #2141](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2141)
head `731fe3596cd5da04ac353e4f2804d24cde53149b` changes only the card transition
list, preserving grayscale and the other effects. This is a bounded candidate
repair of the demonstrated trigger, not a native stack-level diagnosis or a
claim that 30 trials prove universal stability. Existing full/reduced-motion and
negative witnesses remain mandatory and unchanged. This root remains OPEN.

## Release and remaining boundaries

#2140's obsolete heading-oracle and missing candidate-smoke repairs remain
necessary. A merge or one green candidate cannot certify production. Before
claiming recovery, include the confirmed identity corrections, obtain exact-head
green, deploy an immutable candidate, and prove the intended live release SHA
with the required witnesses. No new live release is attested by this receipt.

MASTER still has four independent work units. The existing editorial unit moves
from an improvement to a current defect because published identity mappings are
now independently disproved; the broader editorial queue is not silently closed.
