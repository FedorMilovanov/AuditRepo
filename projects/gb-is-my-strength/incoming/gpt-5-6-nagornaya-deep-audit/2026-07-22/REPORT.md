# Agent Work Report — Nagornaya deep audit

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: GPT-5.6 Thinking
- Date: 2026-07-22
- Audited branch: `main`
- Audited SHA: `2b67ee8f6ee788cb0457b5171e1d99d7afeff5dd`
- Mode: free-intake / source verification / primary-PDF verification
- Supplied analysis: `nagornaya-color-block-analysis.md`, 1,900 lines, findings C43–C94 and D18

## Executive verification result

The supplied analysis is directionally strong, but its 50+ content IDs should not be copied one-for-one into the canonical matrix. Current-head verification shows six repair lanes with different evidence levels:

1. **technical asset/runtime contract** — confirmed-current and repair-ready;
2. **pastoral safety** — confirmed-current P0 content safety;
3. **bibliographic/source integrity** — confirmed-current P1;
4. **argument/model transparency** — confirmed-current P1, best handled as a structured editorial wave;
5. **source registry and tradition balance** — confirmed-current P1 architecture;
6. **epistemic UI bias** — source-confirmed, browser/visual witness still required before final UI prescription.

A separate matrix drift was also found: the ledger claims highlight deduplication/ARIA was fixed by PR #95, but current `main/js/highlights.js` still has the old unconditional insert and missing dialog-state synchronization. The actual fix remains in draft PR #113.

---

## 1. New findings

### NG-RUNTIME-BAR-ASSET-01 — Nagornaya bar asset escapes revision/materialization contracts

- Severity: **P0 release/runtime**
- Status recommendation: **repair-ready**
- Routes: `/nagornaya/chast-1/` … `/nagornaya/chast-5/`
- Files:
  - `src/components/nagornaya/chast-{1..5}/NagornayaChast*PageFooter.astro`
  - `nagornaya/chast-{1..5}/index.html`
  - `js/nagornaya-bar-extras.js`
  - `src/lib/asset-version.js`
  - `scripts/cache-bust.js`

#### Verified source evidence

- All five native Astro footers load `../../js/nagornaya-bar-extras.js?v=1`.
- Canonical asset helper records `js/nagornaya-bar-extras.js` as `3c7e0bdd`.
- `scripts/cache-bust.js::rewriteAstro()` matches only `?v=[a-f0-9]{8}`. Therefore `?v=1` evades the universal read-only revision guard.
- The checked-in legacy/shadow HTML for Part IV omits `nagornaya-bar-extras.js` entirely even though the native Astro footer includes it.
- `copy-legacy-to-dist.js` does copy the `js/` directory, so the asset file itself exists. The defect is more precise than “file missing”: **the route reference/materialization and guard contract are inconsistent**.

#### Required repair

- make Astro revision rewriting detect arbitrary stale/missing literal revisions, not only eight-hex revisions;
- replace all five `?v=1` references with the canonical hash;
- restore the asset in all five checked-in shadow HTML pages or explicitly regenerate them from the native source;
- add a permanent source contract for count, ordering and canonical hash;
- prove on production-like `dist` and Chromium at 360/390 px that the bottom bar contains one Play and one Save cluster, with no duplicate floating fallback.

#### Non-goals

Do not mix this lane with Nagornaya prose, dark-theme redesign, Reader R6 or general floating-cluster visual work.

---

### NG-PASTORAL-SAFETY-01 — final-verdict language exceeds the text’s diagnostic scope

- Severity: **P0 pastoral safety**
- Status recommendation: **confirmed-current / repair-ready for wording review**
- Route: `/nagornaya/chast-5/`
- File: `src/components/nagornaya/chast-5/NagornayaChast5MainShell.astro`

#### Exact current wording

> **«Полное отсутствие плодов — смертный приговор вере»** — если за годы «христианства» в жизни человека нет ни покаяния, ни борьбы с грехом, ни плодов Духа — библейский пастырь обязан предупредить его: Мф 7:21 относится к нему.

The surrounding section contains genuine safeguards for the wounded conscience, but this green check-mark verdict is still categorical. It leaves undefined:

- what counts as fruit;
- what duration “за годы” means;
- who can establish complete absence;
- how trauma, depression, disability, addiction, abuse, isolation and weak/hidden fruit are weighed;
- the difference between a grave pastoral warning and a final judgment belonging to Christ.

#### Required repair direction

Retain the warning against self-deception, but replace “смертный приговор” and direct assignment of Matt 7:21 with calibrated language: persistent, conscious, unrepentant rejection of Christ’s will is grave evidence requiring warning and church/pastoral discernment; external observers must not claim omniscient certainty about regeneration.

The green verdict card must also cease visually presenting this conclusion as a mechanically measurable pass/fail rule.

---

### NG-SOURCE-INTEGRITY-01 — bibliographic object and attribution errors

- Severity: **P1 source integrity**
- Status recommendation: **confirmed-current / repair-ready**
- Routes: `/nagornaya/chast-4/`, `/nagornaya/istochniki/`

#### Green article metadata

Official PDF `tmsj12d.pdf` identifies:

- Donald E. Green;
- “Evangelicals and Ipsissima Vox”;
- **TMSJ 12/1 (Spring 2001), pp. 49–68**;
- author line: **Faculty Associate in New Testament**.

Current sources page says **pp. 49–74**. This is a direct bibliographic error.

#### Thomas / Jesus Seminar object

Official PDF `tmsj7d.pdf` is:

- Robert L. Thomas;
- “Evangelical Responses to the Jesus Seminar”;
- **TMSJ 7/1 (Spring 1996), pp. 75–105**.

Official PDF `tmsj7h.pdf` is instead:

- Stephen J. Nichols;
- “The Dispensational View of the Davidic Kingdom”;
- **TMSJ 7/2 (Fall 1996), pp. 213–239**.

Any Jesus Seminar citation resolving to `tmsj7h.pdf` is therefore the wrong object, not merely an imprecise page range.

#### Author-to-institution overreach

Current Part IV repeatedly moves from individual articles by Green, Thomas and Farnell to formulations such as:

- “Жёсткая граница Семинарии Мастерс”;
- “Семинария Мастерс предложила…”;
- TMS/TMSJ as a unified institutional verdict.

An article published in TMSJ is evidence for the named author’s argument. It is not automatically an institutional doctrinal statement. Official institutional claims should be tied to TMS’s doctrinal statement or another explicit institutional source.

#### Required repair

- Green: `49–74` → `49–68` everywhere;
- Thomas: ensure exact `tmsj7d.pdf` object and title metadata;
- distinguish `author argument`, `journal venue`, `institutional doctrine`, and `series synthesis`;
- preserve Thomas’s strong argument as his position without labeling it neutral historical inevitability.

---

### NG-EPISTEMIC-MODEL-LAYERS-01 — text, reconstruction, doctrine and application collapse into one certainty layer

- Severity: **P1 methodological/content depth**
- Status recommendation: **confirmed-current; grouped editorial wave**
- Routes: all Nagornaya parts, especially Parts I–V

The uploaded C43–C94 list contains many local expressions of one root cause. Current source directly confirms the pattern:

- literary unity is used as proof of a single unrepeated historical event;
- Matthew’s Jewish emphasis and Luke’s universal/social emphasis become fixed audience proofs;
- Aramaic translation, repeated teaching, oral transmission, literary dependence and editorial arrangement are not consistently shown as competing explanatory models;
- Matt 5:18 exegesis moves directly into later confessional conclusions;
- MacArthur’s sermon synthesis is called the “изначальный, авторский замысел” of the discourse;
- Beatitudes are reduced mainly to a soteriological portrait rather than also treated as beatitude genre, wisdom/prophetic reversal, kingdom announcement, eschatological promise and community identity;
- Q’s lack of a surviving manuscript is rhetorically treated as if it were itself a refutation;
- Part V reduces the discourse toward “Law drives to Gospel” even though the discourse also announces the kingdom, forms a community, teaches prayer and relationships, warns of judgment and commands practical obedience.

#### Required architecture

Every disputed section should separate:

```text
textual observation
→ historical reconstruction
→ literary model
→ doctrinal synthesis
→ pastoral application
```

Recommended reusable table:

```text
claim | claim type | primary evidence | alternative explanation | series position | confidence | what would change the conclusion
```

Do not create dozens of unrelated one-off disclaimer cards. Implement one reusable “arguments and alternatives” pattern and apply it to the principal disputes.

---

### NG-SOURCE-REGISTRY-01 — the sources page overstates verification and lacks object/role tracking

- Severity: **P1 citation architecture**
- Status recommendation: **confirmed-current / architecture-ready**
- Route: `/nagornaya/istochniki/`

Current page says: **“Все ссылки верифицированы по первоисточникам.”** The supplied network/PDF passes demonstrate that this global claim is not sustainable: some links are blocked, some are obsolete, some redirect to a different object, some point only to an index/landing page, and some PDFs are scans without extracted text.

Required source registry fields:

```text
requested URL
final URL
HTTP/object status
exact title and author
journal / volume / issue / pages
file available / structurally readable / text extracted / OCR status
claim supported
claim not supported
source role
tradition / school
individual author vs institutional statement
last verified date
```

The public source page should expose a compact subset: `type`, `what it supports`, `limit`, `position/role`, `last checked`.

---

### NG-UI-EPISTEMIC-BIAS-01 — disputed synthesis is visually encoded as an answer key

- Severity: **P1 UI/content interaction**
- Status recommendation: **confirmed-source; browser witness required before implementation**

Current source uses large red/green blocks, check/cross markers and headings such as “жёсткая граница” around disputed historical and theological models. Part V places the P0 pastoral sentence in a green check-mark verdict. Part IV presents individual-author positions through institution-labelled headings.

This is not merely a color preference. The visual hierarchy converts the series synthesis into an exam answer and makes caveats subordinate.

Required direction:

```text
model | what it explains | what it does not prove | cost/assumption | series position
```

Use neutral comparison styling for live scholarly/theological disagreements. Reserve red/green pass/fail language for actual source errors, unsafe behavior, or explicitly confessional boundaries—not for every disputed reconstruction.

Before fixing, capture current browser screenshots at 390 and 1440 px for Parts II, IV and V and identify the exact reusable card components/classes.

---

## 2. Confirmation of matrix drift

### RUNTIME-HIGHLIGHT-DEDUPE-01

- Current matrix status: **closed/fixed via PR #95 `779c23c`**.
- Current source evidence: `main/js/highlights.js` still uses unconditional quote insertion and does not maintain the correct closed/open `aria-hidden` lifecycle.
- Current implementation state: issue #112 and draft PR #113 contain the actual fix; its exact transaction and `validate:static-publication:light` already passed, but the branch must be rebuilt from fresh `main` and merged.
- Recommended matrix status: **open — fix prepared in PR #113, not landed**.

This is a canonical-ledger correction, not a new duplicate bug.

---

## 3. Findings not promoted individually

C43–C94 are retained in the supplied analysis as detailed editorial checklists. They are not all independent bugs. The following should remain child actions under the grouped lanes until a per-route source edit is prepared:

- Beatitudes genre/anavim/Q/audience/New Moses/antitheses/Matt 5:18 refinements;
- steelman of Synoptic, dispensational, covenantal and Free Grace alternatives;
- Papias/Chrysostom reception-history calibration;
- lexical claims (`ptōchos`, `oudeποτε`, etc.) vs broader doctrinal conclusions;
- source-tradition diversity and classic-author differences;
- observation/explanation labels in Matthew/Luke tables;
- authorial-intent and soteriological-reduction language.

This prevents the matrix from becoming a second 1,900-line editorial document while preserving every action in incoming evidence.

---

## 4. Repair order

1. **Do not push a new `main` functional change until the current Pages witness for issue #58 is captured**, to keep the source/deploy comparison unambiguous.
2. Prepare isolated technical PR: `NG-RUNTIME-BAR-ASSET-01`.
3. Close production witness / issue #58 and remove temporary observer.
4. Rebuild and merge PR #113; correct highlight matrix drift.
5. Apply `NG-PASTORAL-SAFETY-01` as a small owner-reviewable content PR.
6. Apply `NG-SOURCE-INTEGRITY-01` (Green/Thomas/attribution) as a separate source-integrity PR.
7. Build the source-role/arguments-alternatives data model before broad Nagornaya prose/UI refactoring.
8. Resume Reader R6 after the above P0s and source-integrity blockers are controlled; R6 must not absorb Nagornaya editorial logic.

## 5. Suggested issues / lanes

- `fix/nagornaya-bar-asset-contract-2026-07-22`
- `fix/nagornaya-pastoral-safety-2026-07-22`
- `fix/nagornaya-source-integrity-2026-07-22`
- `feat/nagornaya-argument-map-2026-07-22`

## 6. Verifier notes

- Source evidence angle: `verified-source` on `2b67ee8f`.
- Primary PDF angle: official TMS-hosted PDFs, title pages/text extracted.
- Browser angle still required for `NG-RUNTIME-BAR-ASSET-01` and `NG-UI-EPISTEMIC-BIAS-01` before final closure.
- The user-supplied analysis is useful and should remain preserved, but its HTTP/PDF claims must not be described as newly rerun by this verifier unless the exact URL/object was independently checked here.
