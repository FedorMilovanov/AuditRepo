# PR #2217 editorial/source review — broad wave 25

**Date:** 2026-10-29  
**Product base:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**PR head:** `ffdd9b236fd7dde38819691422c1d451e666ac5e`  
**Boundary:** detached read-only checkout; no Product files, PR comments or owner branch were changed.

## Scope

Read all five «Отступники» MDX articles, the series config, 30-question learning pool, shared page wrapper, publication self-audit, source policy and generated/discovery diff. Checked visible Russian, source apparatus, quiz copy, glossary integration, route anatomy and applicable source gates.

## Healthy evidence

- Five articles have distinct argument structures, five-point «Коротко», explicit source sections and pastoral qualifications; they do not collapse every departure into one category.
- Reading times are internally plausible: approximately 2,280–2,966 body words at 165–176 words/minute for declared 13–18 minutes.
- Part IV names primary or near-primary objects with chapter/letter locators and public links; it also explicitly limits what historical records can prove.
- The 30 quiz items have source deep-links and generally restate claims present in the corresponding article.
- `article:qa`, `editorial:lint`, `sources:hygiene` and `engine:contracts` all pass on this exact head.

## Finding 1 — reader-facing English editorial vocabulary survives all gates

Part V visibly publishes:

- metadata description: `assurance и perseverance`;
- body: `Поэтому assurance нельзя строить…`;
- body: `Если учение о perseverance…`;
- source annotation: `самонадеянность и assurance`;
- source-policy boilerplate: `doctrinal authority`.

Part IV publishes the heading `Современный source-critical контроль`. Parts I and III also publish `doctrinal authority`. The quiz pool contains `settled-отвержение Христа`; it is dynamic and therefore absent from initial body text until that question is selected.

Book/article titles and the historical term `lapsi` are legitimate original-language uses. The terms above are different: ordinary Russian equivalents already exist in the same series (`уверенность`, `стойкость`, `сознательное/устойчивое отвержение`, `критическая проверка источников`, `богословский авторитет`). The hybrid forms are avoidable editorial leakage and reduce the promised premium Russian register.

The exact source gates remain green because their coverage is fragmented:

- `article:qa` does not reject these article/config payloads;
- `sources:hygiene` does not treat editorial English as backstage leakage;
- `editorial:lint` operates on the wrong/currently insufficient surface for this class;
- dynamic quiz text is not checked as rendered reader copy.

Because #2217 is still an unmerged active owner lane, this is recorded as a **PR-blocking observation**, not admitted as a current-main defect row.

## Finding 2 — source apparatus quality is uneven

Part IV provides usable object identity and locators for Pliny, Polycarp, Cyprian and other historical material. Parts II and III instead use broad descriptions such as “консервативные комментарии” and author names without work/edition/locator. Part V names works but uses them mostly as broad thematic authorities.

This does not automatically falsify any claim: much of Parts II/III directly expounds named biblical passages, and exact locators are mandatory particularly for quotations and evidence-critical claims. It does mean the source section cannot itself prove that every secondary-source-dependent formulation was checked. The source policy explicitly says a bibliography entry and source existence are separate from claim support.

**Disposition:** bounded editorial review required before calling the five-article package source-closed. Do not manufacture footnotes for statements supported directly by the cited biblical text; add precise object/locator evidence only where a secondary author or historical reconstruction materially carries the claim.

## Finding 3 — the self-audit was useful but not a final publication witness

The PR’s audit document correctly predicted orphan routes, registry divergence, Roman progress, native prev/next and reader-language risks. The implementation then needed multiple registry/projection repair commits and still ships the English leakage above. This is further evidence that a prose pre-audit is not an atomic publication contract and cannot certify its own later implementation.

## Root-cause allocation

| Cause | Evidence |
|---|---|
| Agent omission | Plain Russian alternatives were available; the agent’s own audit required Russian reader quality. |
| Gate coverage gap | Four applicable green gates miss static metadata, body and dynamic quiz manifestations. |
| Split payload ownership | Copy is spread across MDX frontmatter/body, config summaries and TypeScript quiz data. |
| Policy defect | Not proven: current source/language policies already state the needed boundary. |

## Required closure for this PR observation

1. Replace only the identified avoidable hybrids with reviewed Russian; preserve real titles, identifiers and historically necessary terms.
2. Render all quiz strings and verify the known `settled-отвержение` negative fixture.
3. Review evidence-critical secondary claims against exact objects/locators without turning ordinary biblical exposition into citation clutter.
4. Add the payload classes to one source→rendered reader-language contract rather than another prose reminder.

**Broad wave 25 complete.**
