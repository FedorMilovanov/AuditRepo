# Agent Work Report

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `gpt-5-6-source-library`
- Date: `2026-07-30`
- Audited branch: `main`
- Audited SHA: `97f5da7122b96d6cdedd55e4717234ac700233f4`
- Documentation merge SHA: `90cccf7ebf1cd3c3fe913041960cafe80104c7a1`
- Mode: `free-intake / source-rights evidence`

## 1. New Findings

### SOURCE-RIGHTS-2026-07-30-01 — Vatican P72 permission workflow now has direct institutional evidence

- Severity: `P3 documentation / rights-governance`
- Route/files: Articles 6–9 research and any future P72 asset.
- Evidence:
  - Vatican Reproduction and Rights Office answered on 2026-07-28.
  - An ordinary email request is not processed without the Library's own form.
  - Prices and general conditions are in the forms.
  - The office advised allowing up to ten weeks from request to expected delivery.
- Confidence: `high — direct institutional correspondence`
- Recommended status: `evidence-addition`, not a product bug.
- Suggested repair lane: source documentation only.

### SOURCE-RIGHTS-2026-07-30-02 — 4Q204 production visual can remain unblocked without IAA facsimile

- Severity: `P3 documentation / rights-governance`
- Route/files: Article 6 visual/source planning.
- Evidence:
  - Qumran-Digital exposes the 4Q204 transcription under `CC BY-SA 4.0`.
  - IAA terms restrict reproduction/display/modification/distribution of its photographs without prior written permission.
  - A project-owned typographic schematic can therefore be derived from the separately licensed transcription while the IAA photograph remains link-only.
- Confidence: `high — official source and licence pages`
- Recommended status: confirms existing Research authority decision.

### SOURCE-RIGHTS-2026-07-30-03 — Separate public-repository and private-archive storage boundaries

- Severity: `P3 governance`
- Evidence:
  - Public GitHub is appropriate for links, claims, provenance, licence decisions, attribution and openly licensed derivative source files.
  - Private Drive is appropriate for official open-access PDFs, correspondence, manifests and private-study screenshots.
  - IAA and P72 facsimiles must not be committed without permission.
- Confidence: `high`.
- Recommended status: policy clarification.

## 2. Confirmations of Existing Findings

### Confirm Research image-rights crosswalk

- Target Research document: `ТРУДНЫЕ ТЕКСТЫ/00_ARTICLE_6_4Q204_P72_IMAGE_RIGHTS_AND_ARCHIVE_CROSSWALK_XLIX.md`
- Confirmed details:
  - IAA image IDs `B-359409` and `B-359410` remain the official 4Q204 Fragment 1 visual locators.
  - P72 official research viewers remain CSNTM and DigiVatLib.
  - `LINK-ONLY / PRIVATE-STUDY` is the correct status for facsimiles pending permission.
- Recommended status: `confirmed-current` as research evidence, without changing canonical bug counts.

### Confirm Research rights-gate publication decision

- Target Research document: `ТРУДНЫЕ ТЕКСТЫ/00_ARTICLES_6_9_L_RIGHTS_GATE_RESOLUTION_AND_PUBLICATION_DECISION.md`
- Result:
  - Articles 6–9 need not wait for facsimile licences.
  - 4Q204 may use a `CC BY-SA 4.0` schematic.
  - P72 may use description, links and a licensed Greek-text source.
- Recommended status: `confirmed-current` as content/source policy.

## 3. Challenges / Disputes

### Challenge any assumption that Wikimedia/Academia provenance alone authorizes production use

- Reason:
  - A platform label or user upload does not necessarily establish an independent lawful chain for a modern institutional photograph or copyrighted monograph.
- Current evidence:
  - Vatican conditions require permission for online publication of DigiVatLib images.
  - No direct author/publisher permission has been received for a full digital copy of Henryk Drawnel's 2019 monograph.
- Recommended status: `HOLD` for such binaries unless provenance is separately verified.

## 4. Duplicate / Merge Proposals

None. This intake adds evidence and a source map; it does not create a new canonical product bug.

## 5. Severity Proposals

None.

## 6. Repair Lane Suggestions

- Keep source/rights documentation separate from route implementation.
- PR `#508` was merged as documentation only.
- Any future facsimile integration requires its own bounded lane with written permission, exact asset, credit line and production-use terms.

## 7. Reverify Notes

- PR: https://github.com/FedorMilovanov/gb-is-my-strength/pull/508
- Merge SHA: `90cccf7ebf1cd3c3fe913041960cafe80104c7a1`
- Cross-project index: https://github.com/FedorMilovanov/Research/blob/main/SOURCE_LIBRARY/MASTER_OPEN_ACCESS_SOURCE_INDEX_2026-07-30.md
- Result: documentation is merged; no production asset or route was changed.

## 8. Notes for Verifier

This is a governed evidence intake. Do not add it to `MASTER_BUG_MATRIX.md` as a new bug. Use it to strengthen provenance, rights and publication-boundary documentation for Articles 6–9.
